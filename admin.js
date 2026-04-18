const CURRENT_USER_KEY = "currentUser";
const ADMIN_EMAILS = ["admin@makasabpro.com", "ghanayemhasan45@gmail.com"];
const ORDER_STORAGE_KEY = "dropshipOrders";
const ORDER_NOTIFICATIONS_KEY = "dropshipOrderNotifications";
const WALLET_NOTIFICATIONS_KEY = "walletNotifications";

const db = window.db || null;
const {
  collection,
  doc,
  updateDoc,
  increment,
  arrayUnion,
  getDocs,
  getDoc,
  setDoc,
  query,
  orderBy,
  serverTimestamp,
} = window.firestoreHelpers || {};
let withdrawFilter = "all";
let orderSearchTerm = "";
let adminOrdersCache = [];
let adminWithdrawRequestsCache = [];

function getCurrentUser() {
  const stored = localStorage.getItem(CURRENT_USER_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

function isAdminUser(user) {
  return user?.isAdmin || ADMIN_EMAILS.includes(user?.email);
}

function loadOrderNotifications() {
  const data = localStorage.getItem(ORDER_NOTIFICATIONS_KEY);
  return data ? JSON.parse(data) : {};
}

function saveOrderNotifications(notifs) {
  localStorage.setItem(ORDER_NOTIFICATIONS_KEY, JSON.stringify(notifs));
}

function saveOrderNotification(orderId, message) {
  const notifs = loadOrderNotifications();
  notifs[orderId] = {
    message,
    date: new Date().toLocaleDateString("ar-EG"),
    time: new Date().toLocaleTimeString("ar-EG"),
  };
  saveOrderNotifications(notifs);
}

async function loadFirestoreOrders() {
  if (!db || !getDocs || !collection || !query || !orderBy) return [];
  try {
    const ordersQuery = query(
      collection(db, "Orders"),
      orderBy("createdAt", "desc"),
    );
    const snapshot = await getDocs(ordersQuery);
    return snapshot.docs.map((docSnap) => {
      const data = docSnap.data();
      const createdAt = data.createdAt?.seconds
        ? new Date(data.createdAt.seconds * 1000)
        : data.createdAt?.toDate
          ? data.createdAt.toDate()
          : new Date(data.createdAt || Date.now());
      return {
        ...data,
        id: docSnap.id,
        date: createdAt.toLocaleString("ar-EG"),
        items: Array.isArray(data.items) ? data.items : [],
        customer: data.customer || {},
      };
    });
  } catch (error) {
    console.warn("تعذّر جلب الطلبات من Firestore:", error);
    return [];
  }
}

async function loadFirestoreOrderById(orderId) {
  if (!db || !doc || !getDoc) return null;
  try {
    const orderRef = doc(db, "Orders", orderId);
    const snapshot = await getDoc(orderRef);
    if (!snapshot.exists()) return null;

    const data = snapshot.data();
    const createdAt = data.createdAt?.seconds
      ? new Date(data.createdAt.seconds * 1000)
      : data.createdAt?.toDate
        ? data.createdAt.toDate()
        : new Date(data.createdAt || Date.now());

    return {
      ...data,
      id: snapshot.id,
      date: createdAt.toLocaleString("ar-EG"),
      items: Array.isArray(data.items) ? data.items : [],
      customer: data.customer || {},
    };
  } catch (error) {
    console.warn("تعذّر جلب الطلب من Firestore:", error);
    return null;
  }
}

async function loadWalletForEmail(email) {
  if (!db || !doc || !getDoc) return null;
  try {
    const walletRef = doc(db, "Wallets", email);
    const snapshot = await getDoc(walletRef);
    return snapshot.exists() ? snapshot.data() : null;
  } catch (error) {
    console.warn("تعذّر جلب المحفظة:", error);
    return null;
  }
}

async function loadWithdrawRequests() {
  if (!db || !collection || !query || !orderBy || !getDocs) return [];
  try {
    const requestsQuery = query(
      collection(db, "WithdrawRequests"),
      orderBy("requestedAt", "desc"),
    );
    const snapshot = await getDocs(requestsQuery);
    return snapshot.docs.map((docSnap) => {
      const data = docSnap.data();
      const requestedAt = data.requestedAt?.seconds
        ? new Date(data.requestedAt.seconds * 1000)
        : data.requestedAt?.toDate
          ? data.requestedAt.toDate()
          : new Date(data.requestedAt || Date.now());
      return {
        ...data,
        id: docSnap.id,
        requestedAt,
      };
    });
  } catch (error) {
    console.warn("تعذّر جلب طلبات السحب:", error);
    return [];
  }
}

async function updateWithdrawRequestStatus(requestId, status) {
  if (!db || !doc || !updateDoc) return;
  try {
    const requestRef = doc(db, "WithdrawRequests", requestId);
    await updateDoc(requestRef, {
      status,
      transferredAt: new Date(),
    });
  } catch (error) {
    console.warn("فشل تحديث حالة طلب السحب:", error);
  }
}

async function completeWithdrawRequest(requestId, walletEmail, amount) {
  if (!db || !doc || !updateDoc || !arrayUnion) return;
  try {
    await updateWithdrawRequestStatus(requestId, "completed");

    const walletRef = doc(db, "Wallets", walletEmail);
    const dateStr = new Date().toLocaleString("ar-EG");
    await updateDoc(walletRef, {
      pending: increment(-Math.abs(amount)),
      totalWithdrawn: increment(Math.abs(amount)),
      history: arrayUnion({
        type: "withdraw-complete",
        amount,
        desc: "اكتمل تحويل السحب بعد 24 ساعة",
        date: dateStr,
        status: "completed",
      }),
    });

    addWalletNotification(
      walletEmail,
      `تم تحويل مبلغ ${amount} ج.م إلى محفظتك بعد 24 ساعة.`,
    );
    renderWithdrawRequests();
  } catch (error) {
    console.error("خطأ في إنجاز طلب السحب:", error);
  }
}

async function rejectWithdrawRequest(requestId, walletEmail, amount) {
  if (!db || !doc || !updateDoc || !arrayUnion) return;
  try {
    await updateWithdrawRequestStatus(requestId, "rejected");

    const walletRef = doc(db, "Wallets", walletEmail);
    const dateStr = new Date().toLocaleDateString("ar-EG");
    await updateDoc(walletRef, {
      pending: increment(-Math.abs(amount)),
      balance: increment(Math.abs(amount)),
      history: arrayUnion({
        type: "withdraw-rejected",
        amount,
        desc: "تم رفض طلب السحب، وقد استُعيد المبلغ إلى الرصيد.",
        date: dateStr,
        status: "rejected",
      }),
    });

    addWalletNotification(
      walletEmail,
      `تم رفض طلب سحب ${amount} ج.م. المبلغ أعيد إلى رصيدك.`,
    );
    renderWithdrawRequests();
  } catch (error) {
    console.error("خطأ في رفض طلب السحب:", error);
  }
}

function mergeOrders(localOrders, firestoreOrders) {
  const merged = [...firestoreOrders];
  localOrders.forEach((localOrder) => {
    if (!merged.some((order) => order.id === localOrder.id)) {
      merged.push(localOrder);
    }
  });
  return merged;
}

function loadWalletNotifications() {
  const data = localStorage.getItem(WALLET_NOTIFICATIONS_KEY);
  return data ? JSON.parse(data) : {};
}

function saveWalletNotifications(notifs) {
  localStorage.setItem(WALLET_NOTIFICATIONS_KEY, JSON.stringify(notifs));
}

function addWalletNotification(email, message) {
  if (!email) return;
  const notifs = loadWalletNotifications();
  if (!notifs[email]) notifs[email] = [];
  notifs[email].push({
    message,
    date: new Date().toLocaleString("ar-EG"),
    status: "info",
  });
  saveWalletNotifications(notifs);
}

function setOrderSearch(value) {
  orderSearchTerm = value.trim();
  renderAdminOrders();
}

function getAdminNotificationItems() {
  const pendingOrders = adminOrdersCache.filter(
    (order) => order.status === "pending",
  );
  const pendingWithdraws = adminWithdrawRequestsCache.filter(
    (request) => request.status === "pending",
  );
  return {
    pendingOrders,
    pendingWithdraws,
    total: pendingOrders.length + pendingWithdraws.length,
  };
}

function updateAdminNotificationBadge() {
  const badge = document.getElementById("adminNotificationsBadge");
  if (!badge) return;
  const items = getAdminNotificationItems();
  if (items.total > 0) {
    badge.classList.remove("d-none");
    badge.innerText = items.total;
  } else {
    badge.classList.add("d-none");
    badge.innerText = "";
  }
}

function renderAdminNotifications() {
  const panel = document.getElementById("adminNotificationsPanel");
  if (!panel) return;

  const { pendingOrders, pendingWithdraws } = getAdminNotificationItems();
  if (!pendingOrders.length && !pendingWithdraws.length) {
    panel.innerHTML = `
      <div class="notification-panel-card p-3 rounded-4 bg-white shadow-sm">
        <p class="mb-0">لا توجد إشعارات جديدة للأدمن.</p>
      </div>
    `;
    return;
  }

  panel.innerHTML = `
    <div class="notification-panel-card p-3 rounded-4 bg-white shadow-sm">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h6 class="mb-0">إشعارات الإدارة</h6>
        <button class="btn btn-link btn-sm" onclick="document.getElementById('adminNotificationsPanel').classList.add('d-none');">إغلاق</button>
      </div>
      ${pendingOrders
        .map(
          (order) => `
            <div class="notification-item mb-3 pb-2">
              <div class="d-flex justify-content-between align-items-center mb-1">
                <strong>طلب جديد #${order.id}</strong>
                <span class="badge bg-warning text-dark">معلق</span>
              </div>
              <p class="mb-1">عميل: ${order.customer?.name || order.customer?.email || order.customer?.phone1 || "غير معروف"}</p>
              <p class="mb-0">إجمالي: ${order.total || "0"} ج.م</p>
            </div>
          `,
        )
        .join("")}
      ${pendingWithdraws
        .map(
          (request) => `
            <div class="notification-item mb-3 pb-2">
              <div class="d-flex justify-content-between align-items-center mb-1">
                <strong>طلب سحب ${request.amount} ج.م</strong>
                <span class="badge bg-warning text-dark">قيد الانتظار</span>
              </div>
              <p class="mb-1">البريد: ${request.marketerEmail || request.walletEmail || "غير معروف"}</p>
              <p class="mb-0">الطريقة: ${request.method || "غير محددة"}</p>
            </div>
          `,
        )
        .join("")}
    </div>
  `;
}

function toggleAdminNotifications() {
  const panel = document.getElementById("adminNotificationsPanel");
  if (!panel) return;
  panel.classList.toggle("d-none");
  if (!panel.classList.contains("d-none")) {
    renderAdminNotifications();
    // إضافة إغلاق تلقائي عند النقر خارج اللوحة
    setTimeout(() => {
      const closePanel = (e) => {
        if (!panel.contains(e.target) && !document.getElementById("adminNotificationsButton").contains(e.target)) {
          panel.classList.add("d-none");
          document.removeEventListener("click", closePanel);
        }
      };
      document.addEventListener("click", closePanel);
    }, 10);
  }
}

function downloadCSV(filename, rows) {
  const headers = Object.keys(rows[0] || {});
  const csv = [headers.join(",")]
    .concat(
      rows.map((row) =>
        headers
          .map((field) => {
            const value = row[field] == null ? "" : row[field].toString();
            return `"${value.replace(/"/g, '""')}"`;
          })
          .join(","),
      ),
    )
    .join("\r\n");

  const bom = "\uFEFF";
  const blob = new Blob([bom + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

async function exportDeliveredOrders() {
  const localOrders = loadOrders();
  let orders = localOrders;
  const firestoreOrders = await loadFirestoreOrders();
  if (firestoreOrders.length) {
    orders = mergeOrders(localOrders, firestoreOrders);
  }
  const delivered = orders.filter((order) => order.status === "delivered");
  if (!delivered.length) {
    showAppMessage("لا توجد طلبات تم تسليمها للتصدير.", "info");
    return;
  }

  const rows = delivered.map((order) => {
    const customer = order.customer || {};
    return {
      "رقم الطلب": order.id,
      التاريخ: order.date,
      العميل: customer.name || "",
      البريد: customer.email || "",
      الهاتف: customer.phone1 || customer.phone2 || "",
      المحافظة: customer.city || "",
      الحالة: order.status,
      الإجمالي: order.total || "",
      الربح: order.profit || "",
      "عنوان التسليم": customer.address || "",
    };
  });
  downloadCSV("delivered-orders.csv", rows);
}

async function exportCompletedWithdrawRequests() {
  const requests = await loadWithdrawRequests();
  const completed = requests.filter(
    (request) => request.status === "completed",
  );
  if (!completed.length) {
    showAppMessage("لا توجد طلبات سحب مكتملة للتصدير.", "info");
    return;
  }

  const rows = completed.map((request) => ({
    "رقم الطلب": request.id,
    البريد: request.marketerEmail || request.walletEmail || "",
    المبلغ: request.amount || "",
    الطريقة: request.method || "",
    الرقم: request.number || "",
    الحالة: request.status,
    "تاريخ الطلب": request.requestedAt.toLocaleString("ar-EG"),
  }));
  downloadCSV("completed-withdraw-requests.csv", rows);
}

function setWithdrawFilter(status) {
  withdrawFilter = status;
  renderWithdrawRequests();
  document.querySelectorAll(".withdraw-filter-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.status === status);
  });
}

function groupOrdersByCustomer(orders) {
  const groups = {};
  orders.forEach((order) => {
    const customer = order.customer || {};
    const identity =
      customer.email ||
      customer.phone1 ||
      customer.phone2 ||
      customer.name ||
      "غير معروف";
    const key = identity.trim() || "غير معروف";

    if (!groups[key]) {
      groups[key] = {
        customer,
        orders: [],
      };
    }
    groups[key].orders.push(order);
  });

  return Object.values(groups);
}

function loadRegisteredUsersCount() {
  const stored = localStorage.getItem("registeredUsers");
  if (!stored) return 0;
  try {
    return Object.keys(JSON.parse(stored) || {}).length;
  } catch {
    return 0;
  }
}

function renderRegisteredUsersCount() {
  const user = getCurrentUser();
  if (!isAdminUser(user)) return;
  const el = document.getElementById("registeredUsersCount");
  if (!el) return;
  el.innerText = loadRegisteredUsersCount();
}

function showAdminTab(tab) {
  const ordersTab = document.getElementById("ordersTabBtn");
  const withdrawTab = document.getElementById("withdrawTabBtn");
  const searchContainer = document.getElementById("adminSearchContainer");
  const ordersSection = document.getElementById("ordersSection");
  const withdrawSection = document.getElementById("withdrawSection");
  const ordersControls = document.getElementById("ordersControls");

  if (!ordersTab || !withdrawTab || !ordersSection || !withdrawSection) return;

  const showOrders = tab === "orders";
  ordersTab.classList.toggle("active", showOrders);
  withdrawTab.classList.toggle("active", !showOrders);
  ordersSection.style.display = showOrders ? "block" : "none";
  withdrawSection.style.display = showOrders ? "none" : "block";

  if (searchContainer) {
    searchContainer.style.display = showOrders ? "block" : "none";
  }
  if (ordersControls) {
    ordersControls.style.display = showOrders ? "block" : "none";
  }
}

function clearOrderHistory() {
  if (
    !confirm(
      "هل أنت متأكد أنك تريد مسح سجل الطلبات المحفوظ محلياً؟ هذا لن يؤثر على الطلبات المخزنة في Firestore.",
    )
  ) {
    return;
  }
  localStorage.removeItem(ORDER_STORAGE_KEY);
  showAppMessage("تم مسح سجل الطلبات المحلي بنجاح.", "success");
  renderAdminOrders();
}

function loadOrders() {
  const data = localStorage.getItem(ORDER_STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

function saveOrders(orders) {
  localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(orders));
}

async function renderWithdrawRequests() {
  const container = document.getElementById("withdrawRequestsContainer");
  if (!container) return;

  const requests = await loadWithdrawRequests();
  const visibleRequests =
    withdrawFilter === "all"
      ? requests
      : requests.filter((request) => request.status === withdrawFilter);

  adminWithdrawRequestsCache = requests;
  updateAdminNotificationBadge();

  if (visibleRequests.length === 0) {
    container.innerHTML = `<div class="col-12"><div class="alert alert-secondary text-center">لا توجد طلبات سحب في هذه الحالة.</div></div>`;
    return;
  }

  container.innerHTML = visibleRequests
    .map((request) => {
      const badgeClass =
        request.status === "completed"
          ? "bg-success"
          : request.status === "rejected"
            ? "bg-danger"
            : "bg-warning text-dark";
      return `
            <div class="col-12">
                <div class="admin-order-card p-4 rounded-4 shadow-sm bg-white">
                    <div class="d-flex justify-content-between align-items-start mb-3 flex-wrap gap-3">
                        <div>
                            <h6 class="fw-bold mb-1">طلب سحب ${request.amount} ج.م</h6>
                            <p class="text-muted mb-1">البريد: ${request.marketerEmail || request.walletEmail || "غير معروف"}</p>
                            <p class="text-muted mb-0">المحفظة: ${request.number || "غير متوفر"}</p>
                        </div>
                        <span class="badge ${badgeClass}">${request.status === "completed" ? "تم التحويل" : request.status === "rejected" ? "مرفوض" : "قيد الانتظار"}</span>
                    </div>
                    <div class="row gy-3 mb-3">
                        <div class="col-md-4">
                            <div class="admin-info-box p-3 rounded-4 bg-light">
                                <p class="mb-1"><strong>الطريقة:</strong> ${request.method || "غير محدد"}</p>
                                <p class="mb-1"><strong>الرقم:</strong> ${request.number || "غير محدد"}</p>
                                <p class="mb-1"><strong>التاريخ:</strong> ${request.requestedAt.toLocaleString("ar-EG")}</p>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="admin-info-box p-3 rounded-4 bg-light">
                                <p class="mb-1"><strong>الحالة:</strong> ${request.status}</p>
                                <p class="mb-1"><strong>رصيد الطلب:</strong> ${request.amount} ج.م</p>
                            </div>
                        </div>
                    </div>
                    <div class="d-flex flex-wrap gap-2">
                        ${
                          request.status === "pending"
                            ? `<button class="btn btn-success btn-sm" onclick="completeWithdrawRequest('${request.id}', '${request.walletEmail || request.marketerEmail}', ${request.amount})">تم التحويل</button>`
                            : ""
                        }
                        ${
                          request.status === "pending"
                            ? `<button class="btn btn-danger btn-sm" onclick="rejectWithdrawRequest('${request.id}', '${request.walletEmail || request.marketerEmail}', ${request.amount})">رفض الطلب</button>`
                            : ""
                        }
                    </div>
                </div>
            </div>
        `;
    })
    .join("");
}

async function renderAdminOrders() {
  const localOrders = loadOrders();
  let orders = localOrders;

  const firestoreOrders = await loadFirestoreOrders();
  if (firestoreOrders.length) {
    orders = mergeOrders(localOrders, firestoreOrders);
  }

  if (orderSearchTerm) {
    const term = orderSearchTerm.toLowerCase();
    orders = orders.filter((order) => {
      const customer = order.customer || {};
      const searchFields = [
        order.id,
        customer.name,
        customer.email,
        customer.phone1,
        customer.phone2,
        customer.city,
        order.marketerEmail,
      ];
      return searchFields.some(
        (field) => field && field.toString().toLowerCase().includes(term),
      );
    });
  }

  const ordersWithWallet = await Promise.all(
    orders.map(async (order) => {
      if (!order.marketerEmail) return order;
      const wallet = await loadWalletForEmail(order.marketerEmail);
      return {
        ...order,
        wallet,
      };
    }),
  );

  const pendingOrders = ordersWithWallet.filter((o) => o.status === "pending");
  const confirmedOrders = ordersWithWallet.filter(
    (o) => o.status === "confirmed" || o.status === "delivered",
  );
  orders = ordersWithWallet;

  adminOrdersCache = orders;
  updateAdminNotificationBadge();

  document.getElementById("pendingOrdersCount").innerText =
    pendingOrders.length;
  document.getElementById("confirmedOrdersCount").innerText =
    confirmedOrders.length;
  document.getElementById("totalOrdersCount").innerText = orders.length;
  renderRegisteredUsersCount();

  const container = document.getElementById("ordersContainer");
  if (orders.length === 0) {
    container.innerHTML = `<div class="col-12"><div class="alert alert-secondary text-center">لا توجد طلبات بعد.</div></div>`;
    return;
  }

  const groups = groupOrdersByCustomer(orders);

  container.innerHTML = groups
    .map((group) => {
      const groupTotal = group.orders.reduce(
        (sum, order) => sum + (parseFloat(order.total) || 0),
        0,
      );
      const groupProfit = group.orders.reduce(
        (sum, order) => sum + (parseFloat(order.profit) || 0),
        0,
      );
      const customer = group.customer || {};

      return `
            <div class="customer-order-group mb-4">
                <div class="p-3 rounded-4 bg-secondary bg-opacity-10 border mb-3">
                    <div class="d-flex flex-column flex-md-row justify-content-between gap-3 align-items-start">
                        <div>
                            <h5 class="fw-bold mb-1">${customer.name || "عميل غير معروف"}</h5>
                            <p class="mb-1 text-muted">${customer.email || customer.phone1 || customer.phone2 || "بدون بيانات اتصال"}</p>
                        </div>
                        <div class="text-end">
                            <span class="badge bg-primary me-2">${group.orders.length === 1 ? "طلب واحد" : `${group.orders.length} طلبات`}</span>
                            <span class="badge bg-success">إجمالي ${groupTotal.toFixed(2)} ج.م</span>
                            <span class="badge bg-info text-dark">ربح ${groupProfit.toFixed(2)} ج.م</span>
                        </div>
                    </div>
                </div>
                <div class="row g-4">
                    ${group.orders
                      .map((order) => {
                        const customerOrder = order.customer || {};
                        const orderQuantity = Array.isArray(order.items)
                          ? order.items.reduce(
                              (sum, item) =>
                                sum + (parseInt(item.qty, 10) || 1),
                              0,
                            )
                          : 0;
                        const orderEmail =
                          customerOrder.email ||
                          order.marketerEmail ||
                          "غير مسجل";
                        return `
                            <div class="col-12">
                                <div class="admin-order-card p-4 rounded-4 shadow-sm bg-white">
                                    <div class="d-flex justify-content-between align-items-start mb-3 flex-wrap gap-3">
                                        <div>
                                            <h5 class="fw-bold mb-1">طلب #${order.id}</h5>
                                            <p class="text-muted mb-0">التاريخ: ${order.date}</p>
                                        </div>
                                        <span class="badge admin-status-badge ${order.status === "delivered" ? "bg-success" : order.status === "confirmed" ? "bg-info text-dark" : order.status === "cancelled" ? "bg-danger" : "bg-warning text-dark"}">${order.status === "delivered" ? "تم التسليم" : order.status === "confirmed" ? "تم الاستلام" : order.status === "cancelled" ? "ملغي" : "جديد"}</span>
                                    </div>
                                    <div class="row gy-3">
                                        <div class="col-md-4">
                                            <div class="admin-info-box p-3 rounded-4 bg-light">
                                                <h6 class="mb-2">بيانات العميل</h6>
                                                <p class="mb-1"><strong>الاسم:</strong> ${customerOrder.name || "-"}</p>
                                                <p class="mb-1"><strong>الهاتف 1:</strong> ${customerOrder.phone1 || "-"}</p>
                                                <p class="mb-1"><strong>الهاتف 2:</strong> ${customerOrder.phone2 || "-"}</p>
                                                <p class="mb-1"><strong>المحافظة:</strong> ${customerOrder.city || "-"}</p>
                                                <p class="mb-1"><strong>البريد:</strong> ${orderEmail}</p>
                                            </div>
                                        </div>
                                        <div class="col-md-4">
                                            <div class="admin-info-box p-3 rounded-4 bg-light">
                                                <h6 class="mb-2">ملخص الطلب</h6>
                                                <p class="mb-1"><strong>عدد المنتجات:</strong> ${orderQuantity}</p>
                                                <p class="mb-1"><strong>الشحن:</strong> ${order.shippingCost} ج.م</p>
                                                <p class="mb-1"><strong>الإجمالي:</strong> ${order.total} ج.م</p>
                                                <p class="mb-1"><strong>الربح:</strong> ${order.profit} ج.م</p>
                                                <p class="mb-1"><strong>رصيد المحفظة:</strong> ${order.wallet ? parseFloat(order.wallet.balance || 0).toFixed(2) + " ج.م" : "غير متاح"}</p>
                                                <p class="mb-0"><strong>إجمالي المسحوبات:</strong> ${order.wallet ? parseFloat(order.wallet.totalWithdrawn || 0).toFixed(2) + " ج.م" : "-"}</p>
                                            </div>
                                        </div>
                                        <div class="col-md-4">
                                            <div class="admin-info-box p-3 rounded-4 bg-light">
                                                <h6 class="mb-2">عنوان التسليم</h6>
                                                <p class="mb-0">${customerOrder.address || "-"}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="mt-4">
                                        <h6 class="mb-3">تفاصيل المنتجات</h6>
                                        ${(Array.isArray(order.items)
                                          ? order.items
                                          : []
                                        )
                                          .map((item) => {
                                            const itemQty =
                                              parseInt(item.qty, 10) || 1;
                                            const wholesalePrice =
                                              parseFloat(item.price) || 0;
                                            const sellingPrice = parseFloat(
                                              item.userSellingPrice ||
                                                item.selling ||
                                                0,
                                            );
                                            return `
                                            <div class="d-flex justify-content-between align-items-center mb-2">
                                                <span>${item.title} (x${itemQty})</span>
                                                <span>جملة: ${wholesalePrice.toFixed(2)} ج.م / بيع: ${sellingPrice.toFixed(2)} ج.م</span>
                                            </div>
                                        `;
                                          })
                                          .join("")}
                                    </div>

                                    <div class="mt-4 d-flex flex-wrap gap-2">
                                        ${order.status === "pending" ? `<button class="btn btn-success btn-sm" onclick="confirmOrder('${order.id}')">تأكيد الطلب</button>` : order.status === "confirmed" ? `<button class="btn btn-primary btn-sm" onclick="deliverOrder('${order.id}')">تم التسليم</button>` : ""}
                                        ${
                                          order.status !== "delivered" &&
                                          order.status !== "cancelled"
                                            ? `<button class="btn btn-danger btn-sm" onclick="cancelOrder('${order.id}')">إلغاء الطلب</button>`
                                            : ""
                                        }
                                        <button class="btn btn-outline-secondary btn-sm" onclick="copyOrderLink('${order.id}')">نسخ رقم الطلب</button>
                                    </div>
                                </div>
                            </div>
                        `;
                      })
                      .join("")}
                </div>
            </div>
        `;
    })
    .join("");
}

async function confirmOrder(orderId) {
  let orders = loadOrders();
  let order = orders.find((o) => o.id === orderId);
  let isRemote = false;

  if (!order) {
    order = await loadFirestoreOrderById(orderId);
    isRemote = !!order;
  }

  if (!order) return;
  if (order.status === "confirmed" || order.status === "delivered") return;

  order.status = "confirmed";
  order.confirmedAt = new Date().toLocaleString("ar-EG");
  order.notification = "تم استلام طلبك الآن وتأكيده.";

  if (isRemote) {
    orders.unshift(order);
    saveOrders(orders);
  } else {
    saveOrders(orders);
  }

  saveOrderNotification(order.id, order.notification);
  renderAdminOrders();
  await syncOrderStatusToFirestore(orderId, "confirmed", order.notification);

  showAppMessage(
    `تم تأكيد الطلب #${orderId.slice(-5).toUpperCase()} بنجاح.`,
    "success",
  );
}

async function deliverOrder(orderId) {
  let orders = loadOrders();
  let order = orders.find((o) => o.id === orderId);
  let isRemote = false;

  if (!order) {
    order = await loadFirestoreOrderById(orderId);
    isRemote = !!order;
  }

  if (!order) return;
  if (order.status !== "confirmed") {
    showAppMessage("يمكنك تسليم الطلب بعد تأكيده فقط.", "info");
    return;
  }

  order.status = "delivered";
  order.deliveredAt = new Date().toLocaleString("ar-EG");
  order.notification = "تم توصيل طلبك بنجاح.";

  if (isRemote) {
    orders.unshift(order);
    saveOrders(orders);
  } else {
    saveOrders(orders);
  }

  saveOrderNotification(order.id, order.notification);
  renderAdminOrders();

  const marketerEmail = order.marketerEmail || order.customer?.email || null;
  if (db && marketerEmail) {
    await addProfitToWallet(
      order.id,
      marketerEmail,
      parseFloat(order.profit) || 0,
    );
  }

  await syncOrderStatusToFirestore(orderId, "delivered", order.notification);
  showAppMessage(
    `تم تسليم الطلب ${order.id} بنجاح وتم إضافة الربح إلى المحفظتك.`,
    "success",
  );
}

async function cancelOrder(orderId) {
  let orders = loadOrders();
  let order = orders.find((o) => o.id === orderId);
  let isRemote = false;

  if (!order) {
    order = await loadFirestoreOrderById(orderId);
    isRemote = !!order;
  }

  if (!order) return;
  if (order.status === "delivered") {
    showAppMessage("لا يمكن إلغاء الطلب بعد التسليم.", "info");
    return;
  }
  if (order.status === "cancelled") return;

  order.status = "cancelled";
  order.cancelledAt = new Date().toLocaleString("ar-EG");
  order.notification =
    "تم إلغاء طلبك. يرجى التواصل مع الدعم إذا كنت بحاجة لمزيد من المعلومات.";

  if (isRemote) {
    orders.unshift(order);
    saveOrders(orders);
  } else {
    saveOrders(orders);
  }

  saveOrderNotification(order.id, order.notification);
  renderAdminOrders();
  await syncOrderStatusToFirestore(orderId, "cancelled", order.notification);
  showAppMessage(`تم إلغاء الطلب #${order.id} بنجاح.`, "success");
}

async function addProfitToWallet(orderId, marketerEmail, profitAmount) {
  if (!db || !doc || !getDoc || !setDoc || !updateDoc) {
    console.warn("Firebase غير متوفر لتحديث المحفظة.");
    return;
  }

  const amount = Number(profitAmount) || 0;
  if (amount <= 0) {
    console.warn("قيمة الربح غير صالحة، لن يتم تحديث المحفظة:", profitAmount);
    return;
  }

  try {
    const walletRef = doc(db, "Wallets", marketerEmail);
    const dateStr = new Date().toLocaleString("ar-EG");
    const profitRecord = {
      type: "income",
      amount,
      desc: `أرباح طلب رقم #${orderId.slice(-5)}`,
      date: dateStr,
      status: "completed",
    };

    const walletSnap = await getDoc(walletRef);
    if (walletSnap.exists()) {
      const walletData = walletSnap.data() || {};
      const currentBalance = Number(walletData.balance) || 0;
      const pendingValue = Number(walletData.pending) || 0;
      const totalWithdrawnValue = Number(walletData.totalWithdrawn) || 0;

      await setDoc(
        walletRef,
        {
          balance: currentBalance + amount,
          pending: pendingValue,
          totalWithdrawn: totalWithdrawnValue,
          history: arrayUnion(profitRecord),
        },
        { merge: true },
      );
    } else {
      await setDoc(walletRef, {
        balance: amount,
        pending: 0,
        totalWithdrawn: 0,
        history: [profitRecord],
      });
    }

    console.log("تم تحديث رصيد المحفظة بنجاح.");
  } catch (error) {
    console.error("خطأ في تحديث المحفظة:", error);
    showAppMessage("حدث خطأ أثناء إضافة الأرباح إلى المحفظة.", "error");
  }
}

async function syncOrderStatusToFirestore(orderId, status, notification) {
  if (!db || !doc || !updateDoc) return;
  try {
    const orderRef = doc(db, "Orders", orderId);
    const payload = {
      status,
      notification,
    };
    if (status === "confirmed") payload.confirmedAt = new Date();
    if (status === "delivered") payload.deliveredAt = new Date();

    await updateDoc(orderRef, payload);
  } catch (error) {
    console.warn("فشل مزامنة حالة الطلب إلى Firestore:", error);
  }
}

function copyOrderLink(orderId) {
  navigator.clipboard
    .writeText(orderId)
    .then(() => {
      showAppMessage("تم نسخ رقم الطلب إلى الحافظة.", "success");
    })
    .catch(() => {
      showAppMessage("فشل نسخ رقم الطلب.", "error");
    });
}

function checkAdminAccess() {
  const user = getCurrentUser();
  if (!isAdminUser(user)) {
    document.body.innerHTML = `
            <main class="container py-5">
                <div class="alert alert-danger rounded-4 shadow-sm text-center">
                    <h3 class="mb-3">دخول غير مصرح</h3>
                    <p>هذه الصفحة مخصصة لمسؤولي النظام فقط. يرجى تسجيل الدخول بحساب مسؤول للوصول.</p>
                    <a href="index.html" class="btn btn-primary mt-3">العودة للصفحة الرئيسية</a>
                </div>
            </main>
        `;
    return false;
  }
  return true;
}

function initAdminPage() {
  if (!checkAdminAccess()) return;
  renderAdminOrders();
  renderWithdrawRequests();
  showAdminTab("orders");
  window.addEventListener("storage", () => {
    renderAdminOrders();
    renderWithdrawRequests();
  });
  setInterval(() => {
    renderAdminOrders();
    renderWithdrawRequests();
  }, 3000);
}

window.confirmOrder = confirmOrder;
window.deliverOrder = deliverOrder;
window.cancelOrder = cancelOrder;
window.copyOrderLink = copyOrderLink;
window.completeWithdrawRequest = completeWithdrawRequest;
window.rejectWithdrawRequest = rejectWithdrawRequest;
window.toggleAdminNotifications = toggleAdminNotifications;
window.setWithdrawFilter = setWithdrawFilter;
window.setOrderSearch = setOrderSearch;
window.exportDeliveredOrders = exportDeliveredOrders;
window.exportCompletedWithdrawRequests = exportCompletedWithdrawRequests;
window.showAdminTab = showAdminTab;
window.clearOrderHistory = clearOrderHistory;

document.addEventListener("DOMContentLoaded", initAdminPage);

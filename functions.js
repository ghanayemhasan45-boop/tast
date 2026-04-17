// --- 2. State ---
let cart = [];
window.cart = cart;
let isLoggedIn = false;
var currentUser = null;
const ADMIN_EMAILS = ["admin@makasabpro.com", "ghanayemhasan45@gmail.com"];
const CURRENT_USER_KEY = "currentUser";

function loadStoredUser() {
  const stored = localStorage.getItem(CURRENT_USER_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

const REGISTERED_USERS_KEY = "registeredUsers";

function saveStoredUser(user) {
  if (!user) {
    localStorage.removeItem(CURRENT_USER_KEY);
    return;
  }
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
}

function loadRegisteredUsers() {
  const stored = localStorage.getItem(REGISTERED_USERS_KEY);
  if (!stored) return {};
  try {
    return JSON.parse(stored) || {};
  } catch {
    return {};
  }
}

function saveRegisteredUsers(users) {
  localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(users || {}));
}

function getRegisteredUserByEmail(email) {
  if (!email) return null;
  const users = loadRegisteredUsers();
  return users[email.toLowerCase()] || null;
}

function addRegisteredUser(user) {
  if (!user?.email) return;
  const users = loadRegisteredUsers();
  users[user.email.toLowerCase()] = {
    name: user.name,
    email: user.email,
    phone: user.phone || "",
    password: user.password || "",
    isAdmin: user.isAdmin || ADMIN_EMAILS.includes(user.email),
  };
  saveRegisteredUsers(users);
}

function notify(message, type = "info") {
  if (typeof showAppMessage === "function") {
    showAppMessage(message, type);
  } else {
    alert(message);
  }
}

window.togglePasswordField = function (fieldId, iconId) {
  const field = document.getElementById(fieldId);
  const icon = document.getElementById(iconId);
  if (!field || !icon) return;

  const isHidden = field.type === "password";
  field.type = isHidden ? "text" : "password";
  icon.classList.toggle("fa-eye", !isHidden);
  icon.classList.toggle("fa-eye-slash", isHidden);
};

function isAdminUser(user) {
  return user?.isAdmin || ADMIN_EMAILS.includes(user?.email);
}

function updateAdminLinkVisibility() {
  const link = document.getElementById("adminPanelLink");
  if (!link) return;
  link.classList.toggle("d-none", !isAdminUser(currentUser));
}

function getFirestoreHelpers() {
  return window.firestoreHelpers || {};
}

function getFirestoreDb() {
  return window.db;
}

async function fetchPersonalOrders() {
  const db = getFirestoreDb();
  const { collection, query, where, orderBy, getDocs } = getFirestoreHelpers();
  if (
    !db ||
    !collection ||
    !query ||
    !where ||
    !orderBy ||
    !getDocs ||
    !currentUser?.email
  )
    return [];

  const ordersQuery = query(
    collection(db, "Orders"),
    where("customer.email", "==", currentUser.email),
    orderBy("createdAt", "desc"),
  );
  const snapshot = await getDocs(ordersQuery);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

async function saveOrderToFirestore(order) {
  const db = getFirestoreDb();
  const { collection, addDoc } = getFirestoreHelpers();
  if (!db || !collection || !addDoc) return null;
  try {
    const orderRef = await addDoc(collection(db, "Orders"), order);
    return orderRef.id;
  } catch (error) {
    console.error("saveOrderToFirestore failed:", error);
    return null;
  }
}

// --- 3. UI & Rendering ---
function renderProducts() {
  const container = document.getElementById("productsContainer");
  const category = document.getElementById("categoryFilter").value;
  const sort = document.getElementById("sortFilter").value;

  let filtered = products.filter(
    (p) => category === "all" || p.category === category,
  );

  if (sort === "profit_high") filtered.sort((a, b) => b.profit - a.profit);
  if (sort === "profit_low") filtered.sort((a, b) => a.profit - b.profit);
  if (sort === "bestseller") filtered.sort((a, b) => b.sales - a.sales);

  document.getElementById("productsCount").innerText =
    `عدد المنتجات: ${filtered.length}`;

  container.innerHTML = filtered
    .map((p) => {
      const suggestedPrice = p.price + p.profit + 50;
      let badgeHtml = "";
      if (p.sales > 100)
        badgeHtml = `<div class="card-badge badge-orange">الأكثر مبيعاً</div>`;
      else if (p.id > 4)
        badgeHtml = `<div class="card-badge badge-red">وصل حديثاً</div>`;

      return `
        <div class="col-12 col-md-6 col-lg-3">
            <div class="product-card">
                ${badgeHtml}
                <img src="${p.image}" class="card-img-top" onclick="showProductDetails(${p.id})" alt="${p.title}">
                <div class="card-body">
                    <h3 class="product-title" title="${p.title}">${p.title}</h3>
                    <div class="price-details">
                        <div class="price-row">
                            <span>سعر الجملة (عليك):</span>
                            <span class="fw-bold text-dark">${p.price} ج.م</span>
                        </div>
                        <div class="price-row">
                            <span>سعر البيع المقترح:</span>
                            <span class="price-strike">${suggestedPrice} ج.م</span>
                        </div>
                    </div>
                    <div class="profit-row">
                        <span class="profit-label">صافي ربحك المتوقع:</span>
                        <span class="profit-value">
                            ${p.profit} ج.م
                            <i class="fa-solid fa-money-bill-wave text-warning ms-1"></i>
                        </span>
                    </div>
                    <div class="card-actions">
                        <button class="btn-blue-solid" onclick="addToCart(${p.id}, this)">
                            <i class="fa-solid fa-cart-plus"></i>
                            إضافة لطلباتي
                        </button>
                        <button class="btn-white-outline" onclick="downloadProductResources(${p.id})">
                            <i class="fa-solid fa-download"></i>
                            تحميل الصور
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    })
    .join("");
}

function showProductDetails(id) {
  const p = products.find((x) => x.id === id);
  if (!p) return;

  const modalHtml = `
        <div class="modal-header">
            <h5 class="modal-title fw-bold">${p.title}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
            <div class="row">
                <div class="col-md-6 mb-3">
                    <img src="${p.image}" class="img-fluid rounded shadow-sm">
                </div>
                <div class="col-md-6">
                    <h6 class="text-primary fw-bold">الوصف:</h6>
                    <p class="text-muted">${p.desc}</p>
                    <hr>
                    <div class="d-flex justify-content-between mb-2">
                        <span>سعر الجملة:</span>
                        <strong class="fs-5">${p.price} ج.م</strong>
                    </div>
                    <div class="d-flex justify-content-between mb-2">
                        <span>الربح المقترح:</span>
                        <strong class="text-success fs-5">${p.profit} ج.م</strong>
                    </div>
                    <button class="btn btn-primary w-100 mb-2" onclick="addToCart(${p.id}); document.querySelector('#productModal .btn-close').click();">أضف للسلة</button>
                    <button class="btn btn-outline-dark w-100" onclick="downloadProductResources(${p.id})">تحميل الصور والوصف</button>
                </div>
            </div>
        </div>
    `;

  document.getElementById("productModalContent").innerHTML = modalHtml;
  new bootstrap.Modal(document.getElementById("productModal")).show();
}

function downloadProductResources(id) {
  const p = products.find((x) => x.id === id);
  if (!p) return;
  notify(
    `جاري تحميل صور ووصف المنتج: ${p.title}\n(سيتم فتح الصورة في نافذة جديدة)`,
    "info",
  );
  window.open(p.image, "_blank");
}

// --- 4. Cart Logic ---
function addToCart(id, btnElement) {
  const p = products.find((x) => x.id === id);
  if (!p) return;

  cart.push({
    ...p,
    userSellingPrice: p.price + p.profit,
    cartId: Date.now() + Math.floor(Math.random() * 1000),
  });

  updateCartUI();

  if (btnElement && typeof btnElement.innerHTML === "string") {
    const originalText = btnElement.innerHTML;
    btnElement.innerHTML = '<i class="fa-solid fa-check"></i> تم';
    setTimeout(() => {
      btnElement.innerHTML = originalText;
    }, 1000);
  }
}

function removeFromCart(cartId) {
  cart = cart.filter((item) => item.cartId !== cartId);
  window.cart = cart;
  updateCartUI();
}

function updateCartItemPrice(cartId, newPrice) {
  const item = cart.find((x) => x.cartId === cartId);
  if (item) {
    item.userSellingPrice = parseFloat(newPrice) || 0;
    updateTotal();
  }
}

function updateCartUI() {
  document.getElementById("cartCount").innerText = cart.length;
  const container = document.getElementById("cartItemsContainer");

  if (cart.length === 0) {
    container.innerHTML =
      '<p class="text-center text-muted py-4">السلة فارغة</p>';
    document.getElementById("summaryWholesale").innerText = "0";
    document.getElementById("summaryProfit").innerText = "0";
    updateTotal();
    return;
  }

  container.innerHTML = cart
    .map(
      (item) => `
        <div class="d-flex gap-3 mb-3 border-bottom pb-3 align-items-center">
            <img src="${item.image}" style="width:60px; height:60px; object-fit:cover; border-radius:8px">
            <div class="flex-grow-1">
                <h6 class="mb-1 small fw-bold">${item.title}</h6>
                <div class="d-flex justify-content-between align-items-center">
                    <span class="text-muted x-small">جملة: ${item.price}</span>
                    <div class="input-group input-group-sm" style="width: 130px;">
                        <span class="input-group-text bg-light">بيع</span>
                        <input type="number" class="form-control" value="${item.userSellingPrice}" onchange="updateCartItemPrice(${item.cartId}, this.value)">
                    </div>
                </div>
            </div>
            <button class="btn btn-sm text-danger" onclick="removeFromCart(${item.cartId})">
                <i class="fa-solid fa-trash"></i>
            </button>
        </div>
    `,
    )
    .join("");

  updateTotal();
}

function updateTotal() {
  const wholesaleTotal = cart.reduce((sum, item) => sum + item.price, 0);
  const sellingTotal = cart.reduce(
    (sum, item) => sum + parseFloat(item.userSellingPrice || 0),
    0,
  );

  const city = document.getElementById("custCity").value;
  let shipping = 0;
  if (city === "cairo") shipping = 50;
  else if (city === "giza") shipping = 65;

  const autoTotal = sellingTotal + shipping;
  const profit = sellingTotal - wholesaleTotal;

  document.getElementById("summaryWholesale").innerText = wholesaleTotal;
  document.getElementById("summaryShipping").innerText = shipping;
  document.getElementById("finalTotalInput").value = autoTotal;
  document.getElementById("summaryProfit").innerText = profit + " ج.م";
}

const ORDER_STORAGE_KEY = "dropshipOrders";
const ORDER_NOTIFICATIONS_KEY = "dropshipOrderNotifications";

function loadOrders() {
  const data = localStorage.getItem(ORDER_STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

function saveOrders(orders) {
  localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(orders));
}

function addOrder(order) {
  const orders = loadOrders();
  orders.unshift(order);
  saveOrders(orders);
}

window.submitOrder = async function () {
  if (typeof window.submitOrderAuth === "function") {
    return window.submitOrderAuth();
  }
  notify(
    "جاري تحميل نظام الطلب. يرجى إعادة تحميل الصفحة إذا استمر الخطأ.",
    "error",
  );
};

function markOrderConfirmed(orderId) {
  const orders = loadOrders();
  const order = orders.find((o) => o.id === orderId);
  if (!order) return;

  order.status = "confirmed";
  order.confirmedAt = new Date().toLocaleString("ar-EG");
  order.notification = "تم استلام طلبك الآن. فريقنا يعمل على تجهيزه.";
  saveOrders(orders);
  saveOrderNotification(orderId, order.notification);
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
  notifs[orderId] = { message, date: new Date().toLocaleString("ar-EG") };
  saveOrderNotifications(notifs);
}

function getOrderNotification(orderId) {
  const notifs = loadOrderNotifications();
  return notifs[orderId] || null;
}

function checkCustomerOrderNotifications() {
  if (!currentUser) return;
  const orders = loadOrders();
  const matchedOrder = orders.find((o) => {
    const sameEmail =
      currentUser.email && o.customer.email === currentUser.email;
    const samePhone =
      currentUser.phone &&
      (o.customer.phone1 === currentUser.phone ||
        o.customer.phone2 === currentUser.phone);
    return (
      (o.status === "confirmed" || o.status === "delivered") &&
      (sameEmail || samePhone)
    );
  });
  if (!matchedOrder) return;

  const notif = getOrderNotification(matchedOrder.id);
  if (notif) {
    notify(`📣 إشعار للعميل:\n${notif.message}`, "info");
    deleteOrderNotification(matchedOrder.id);
  }
}

function deleteOrderNotification(orderId) {
  const notifs = loadOrderNotifications();
  if (notifs[orderId]) {
    delete notifs[orderId];
    saveOrderNotifications(notifs);
  }
}

window.addEventListener("storage", (event) => {
  if (event.key === ORDER_NOTIFICATIONS_KEY) {
    checkCustomerOrderNotifications();
  }
});

// --- ملخص المبيعات اليومية ---
function loadDailySales() {
  const data = localStorage.getItem("dropshipDailySales");
  return data ? JSON.parse(data) : [];
}

function saveDailySales(sales) {
  localStorage.setItem("dropshipDailySales", JSON.stringify(sales));
}

function addOrderToDailySummary(order) {
  let sales = loadDailySales();
  sales.push(order);
  saveDailySales(sales);
}

function renderDailySalesSummary() {
  const summaryContainer = document.getElementById("dailySalesSummary");
  if (!summaryContainer) return;

  const sales = loadDailySales();
  const today = new Date().toLocaleDateString("ar-EG");
  const todaysSales = sales.filter((s) => s.date === today);

  const totalOrders = todaysSales.length;
  const totalRevenue = todaysSales.reduce(
    (sum, i) => sum + (parseFloat(i.total) || 0),
    0,
  );
  const totalProfit = todaysSales.reduce(
    (sum, i) => sum + (parseFloat(i.profit) || 0),
    0,
  );

  // تجميع مبيعات المنتج عبر كل الطلبات
  const productMap = {};
  todaysSales.forEach((order) => {
    if (!order.itemsDetails) return;
    order.itemsDetails.forEach((item) => {
      if (!productMap[item.id]) {
        productMap[item.id] = { ...item };
      } else {
        productMap[item.id].qty += item.qty;
        productMap[item.id].revenue += item.revenue;
        productMap[item.id].profit += item.profit;
      }
    });
  });

  const productSummaryItems = Object.values(productMap);

  summaryContainer.innerHTML = `
        <div class="daily-summary-card p-3 rounded border">
            <h5>ملخص المبيعات اليوم (${today})</h5>
            <p>عدد الطلبات: <strong>${totalOrders}</strong></p>
            <p>إجمالي قيمة البيع: <strong>${totalRevenue.toFixed(2)} ج.م</strong></p>
            <p>إجمالي الربح: <strong>${totalProfit.toFixed(2)} ج.م</strong></p>
            <hr>
            <h6>ملخص بيع كل منتج اليوم</h6>
            ${productSummaryItems.length === 0 ? '<p class="small text-muted">لا توجد منتجات.</p>' : ""}
            ${productSummaryItems
              .map(
                (item) => `
                <div class="d-flex justify-content-between align-items-center py-1 border-top">
                    <span>${item.title} (الكمية: ${item.qty})</span>
                    <span>الإيرادات: ${item.revenue.toFixed(2)} ج.م / الربح: ${item.profit.toFixed(2)} ج.م</span>
                </div>
            `,
              )
              .join("")}
        </div>
    `;
}

// --- 5. Auth & Profile ---
function updateUIAfterLogin() {
  const authSection = document.getElementById("authSection");
  if (authSection) {
    authSection.innerHTML = `
        <div class="user-profile-trigger" data-bs-toggle="offcanvas" data-bs-target="#profileSidebar">
            <i class="fa-solid fa-user-circle"></i>
            <span>${currentUser.name}</span>
        </div>
    `;
  }

  if (document.getElementById("profileName"))
    document.getElementById("profileName").value = currentUser.name;
  if (document.getElementById("profileEmail"))
    document.getElementById("profileEmail").value = currentUser.email;
  if (document.getElementById("profilePhone"))
    document.getElementById("profilePhone").value =
      currentUser.phone || "غير مسجل";

  saveStoredUser(currentUser);
  updateAdminLinkVisibility();

  if (currentUser && !isAdminUser(currentUser)) {
    document.getElementById("salesReportIcon")?.classList.remove("d-none");
  } else {
    document.getElementById("salesReportIcon")?.classList.add("d-none");
  }

  //  if (typeof renderMarketerDashboard === "function") renderMarketerDashboard();
  console.log(`تم تسجيل الدخول بنجاح! أهلاً بك يا: ${currentUser.name}`);
  checkCustomerOrderNotifications();
}

async function getCurrentUserOrders() {
  if (!currentUser?.email) return [];
  const db = getFirestoreDb();
  const { collection, query, where, orderBy, getDocs } = getFirestoreHelpers();
  if (!db || !collection || !query || !where || !orderBy || !getDocs) return [];

  const ordersQuery = query(
    collection(db, "Orders"),
    where("marketerEmail", "==", currentUser.email),
    orderBy("createdAt", "desc"),
  );
  const snapshot = await getDocs(ordersQuery);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

async function renderMarketerDashboard() {
  const dashboardSection = document.getElementById("marketerDashboard");
  if (!dashboardSection) return;
  if (!currentUser?.email || currentUser?.isAdmin) {
    dashboardSection.classList.add("d-none");
    return;
  }

  dashboardSection.classList.remove("d-none");
  const orders = await getCurrentUserOrders();
  const totalProfit = orders.reduce(
    (sum, o) => sum + (parseFloat(o.profit) || 0),
    0,
  );

  document.getElementById("myOrdersCount").innerText = orders.length;
  document.getElementById("myTotalProfit").innerText =
    formatCurrency(totalProfit) + " ج.م";
  document.getElementById("marketerOrdersStatus").innerText = orders.length
    ? "جميع طلباتك"
    : "لا توجد طلبات بعد";

  const tableBody = document.getElementById("marketerOrdersTable");
  if (!tableBody) return;

  if (!orders.length) {
    tableBody.innerHTML =
      '<tr><td colspan="5" class="text-center text-muted py-4">لا توجد طلبات بعد</td></tr>';
    return;
  }

  tableBody.innerHTML = orders
    .map((order) => {
      const createdAt = order.createdAt?.seconds
        ? new Date(order.createdAt.seconds * 1000)
        : new Date(order.createdAt || Date.now());
      const statusLabel =
        order.status === "delivered"
          ? "تم التسليم"
          : order.status === "confirmed"
            ? "تم الاستلام"
            : "جديد";
      return `
            <tr>
                <td>${order.id}</td>
                <td>${createdAt.toLocaleDateString("ar-EG")} ${createdAt.toLocaleTimeString("ar-EG")}</td>
                <td>${statusLabel}</td>
                <td>${formatCurrency(order.total)} ج.م</td>
                <td>${formatCurrency(order.profit)} ج.م</td>
            </tr>
        `;
    })
    .join("");
}

function handleSimpleLogin() {
  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value.trim();

  if (!email || !password) {
    notify("يرجى إدخال البريد الإلكتروني وكلمة المرور للدخول", "info");
    return;
  }

  const registeredUser = getRegisteredUserByEmail(email);
  if (!registeredUser) {
    notify("هذا البريد الإلكتروني غير مسجّل. الرجاء إنشاء حساب جديد.", "error");
    return;
  }

  if (registeredUser.password !== password) {
    notify("كلمة المرور غير صحيحة. حاول مرة أخرى.", "error");
    return;
  }

  isLoggedIn = true;
  currentUser = {
    name:
      registeredUser.name ||
      email
        .split("@")[0]
        .replace(/[\W_]+/g, " ")
        .trim() ||
      "مستخدم",
    email: registeredUser.email,
    phone: registeredUser.phone || "",
    isAdmin: registeredUser.isAdmin || ADMIN_EMAILS.includes(email),
  };
  saveStoredUser(currentUser);
  window.currentUser = currentUser;

  console.log("تم تسجيل الدخول بنجاح");
  if (window.location.pathname.endsWith("login.html")) {
    window.location.href = "index.html";
  } else {
    updateUIAfterLogin();
  }
}

function validateAndLogin() {
  const name = document.getElementById("newUserName").value.trim();
  const email = document.getElementById("newUserEmail").value.trim();
  const phone = document.getElementById("newUserPhone").value.trim();
  const pass = document.getElementById("newUserPass").value.trim();
  const passConfirm = document
    .getElementById("newUserPassConfirm")
    .value.trim();
  const alertBox = document.getElementById("signupAlert");

  function showError(msg) {
    alertBox.innerText = msg;
    alertBox.classList.remove("d-none");
  }

  alertBox.classList.add("d-none");

  if (name.length < 5) {
    showError("الاسم قصير جداً");
    return;
  }
  if (!email.includes("@")) {
    showError("البريد الإلكتروني غير صحيح");
    return;
  }
  if (pass.length < 6) {
    showError("كلمة المرور يجب أن تكون 6 أحرف على الأقل");
    return;
  }
  if (pass !== passConfirm) {
    showError("كلمة المرور وتأكيدها غير متطابقين");
    return;
  }

  const existingUser = getRegisteredUserByEmail(email);
  if (existingUser) {
    showError("هذا البريد الإلكتروني مسجّل بالفعل. الرجاء تسجيل الدخول.");
    return;
  }

  addRegisteredUser({
    name,
    email,
    phone,
    password: pass,
    isAdmin: ADMIN_EMAILS.includes(email),
  });

  isLoggedIn = true;
  currentUser = { name, email, phone, isAdmin: ADMIN_EMAILS.includes(email) };
  saveStoredUser(currentUser);
  window.currentUser = currentUser;

  console.log("تم إنشاء الحساب وتسجيل الدخول بنجاح");
  if (window.location.pathname.endsWith("login.html")) {
    window.location.href = "index.html";
  } else {
    updateUIAfterLogin();
  }
}

function simulateGoogleLogin() {
  const btn = event?.target?.closest("button");
  if (btn) {
    const originalText = btn.innerHTML;
    btn.innerHTML =
      '<i class="fa-solid fa-spinner fa-spin"></i> جاري الاتصال...';
    btn.disabled = true;

    setTimeout(() => {
      isLoggedIn = true;
      currentUser = {
        name: "أحمد (حساب Google)",
        email: "ahmed.google@gmail.com",
        phone: "01000000000",
      };
      btn.innerHTML = originalText;
      btn.disabled = false;
      updateUIAfterLogin();
    }, 1500);
  } else {
    validateAndLogin();
  }
}

function simulateLogin() {
  validateAndLogin();
}

function saveProfile() {
  if (!isLoggedIn) return;
  const newName = document.getElementById("profileName").value;
  currentUser.name = newName;
  const profileNameEl = document.querySelector(".user-profile-trigger span");
  if (profileNameEl) profileNameEl.innerText = newName;

  const offcanvasEl = document.getElementById("profileSidebar");
  const offcanvas = bootstrap.Offcanvas.getInstance(offcanvasEl);
  if (offcanvas) offcanvas.hide();
  notify("تم حفظ البيانات بنجاح", "success");
}

function logout() {
  saveStoredUser(null);
  location.reload();
}

window.addEventListener("DOMContentLoaded", () => {
  const storedUser = loadStoredUser();
  if (storedUser) {
    currentUser = storedUser;
    isLoggedIn = true;
    updateAdminLinkVisibility();
    document.getElementById("authSection")?.querySelector("button")?.remove();
    updateUIAfterLogin();
  }
});

// --- 6. Profit Edit ---
function calculateProfitManual() {
  let finalTotal =
    parseFloat(document.getElementById("finalTotalInput").value) || 0;
  let wholesale =
    parseFloat(document.getElementById("summaryWholesale").innerText) || 0;
  let shipping =
    parseFloat(document.getElementById("summaryShipping").innerText) || 0;
  let newProfit = finalTotal - (wholesale + shipping);
  let profitEl = document.getElementById("summaryProfit");
  profitEl.innerText = newProfit + " ج.م";

  if (newProfit < 0) profitEl.className = "text-danger fw-bold";
  else profitEl.className = "text-success fw-bold";
}

function formatCurrency(value) {
  return Number(value || 0).toFixed(2);
}

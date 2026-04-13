import {
  getFirestore,
  doc,
  updateDoc,
  increment,
  arrayUnion,
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

const db = getFirestore();
const CURRENT_USER_KEY = "currentUser";
const ADMIN_EMAILS = ["admin@makasabpro.com", "ghanayemhasan45@gmail.com"];
const ORDER_STORAGE_KEY = "dropshipOrders";
const ORDER_NOTIFICATIONS_KEY = "dropshipOrderNotifications";

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

function loadOrders() {
  const data = localStorage.getItem(ORDER_STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

function saveOrders(orders) {
  localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(orders));
}

function renderAdminOrders() {
  const orders = loadOrders();
  const pendingOrders = orders.filter((o) => o.status === "pending");
  const confirmedOrders = orders.filter(
    (o) => o.status === "confirmed" || o.status === "delivered",
  );

  document.getElementById("pendingOrdersCount").innerText =
    pendingOrders.length;
  document.getElementById("confirmedOrdersCount").innerText =
    confirmedOrders.length;
  document.getElementById("totalOrdersCount").innerText = orders.length;

  const container = document.getElementById("ordersContainer");
  if (orders.length === 0) {
    container.innerHTML = `<div class="col-12"><div class="alert alert-secondary text-center">لا توجد طلبات بعد.</div></div>`;
    return;
  }

  container.innerHTML = orders
    .map((order) => {
      const customer = order.customer || {};
      return `
            <div class="col-12">
                <div class="admin-order-card p-4 rounded-4 shadow-sm bg-white">
                    <div class="d-flex justify-content-between align-items-start mb-3 flex-wrap gap-3">
                        <div>
                            <h5 class="fw-bold mb-1">طلب #${order.id}</h5>
                            <p class="text-muted mb-0">التاريخ: ${order.date}</p>
                        </div>
                        <span class="badge admin-status-badge ${order.status === "delivered" ? "bg-success" : order.status === "confirmed" ? "bg-info text-dark" : "bg-warning text-dark"}">${order.status === "delivered" ? "تم التسليم" : order.status === "confirmed" ? "تم الاستلام" : "جديد"}</span>
                    </div>
                    <div class="row gy-3">
                        <div class="col-md-4">
                            <div class="admin-info-box p-3 rounded-4 bg-light">
                                <h6 class="mb-2">بيانات العميل</h6>
                                <p class="mb-1"><strong>الاسم:</strong> ${customer.name || "-"}</p>
                                <p class="mb-1"><strong>الهاتف 1:</strong> ${customer.phone1 || "-"}</p>
                                <p class="mb-1"><strong>الهاتف 2:</strong> ${customer.phone2 || "-"}</p>
                                <p class="mb-1"><strong>المحافظة:</strong> ${customer.city || "-"}</p>
                                <p class="mb-1"><strong>البريد:</strong> ${customer.email || "غير مسجل"}</p>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="admin-info-box p-3 rounded-4 bg-light">
                                <h6 class="mb-2">ملخص الطلب</h6>
                                <p class="mb-1"><strong>عدد المنتجات:</strong> ${order.items.length}</p>
                                <p class="mb-1"><strong>الشحن:</strong> ${order.shippingCost} ج.م</p>
                                <p class="mb-1"><strong>الإجمالي:</strong> ${order.total} ج.م</p>
                                <p class="mb-0"><strong>الربح:</strong> ${order.profit} ج.م</p>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="admin-info-box p-3 rounded-4 bg-light">
                                <h6 class="mb-2">عنوان التسليم</h6>
                                <p class="mb-0">${customer.address || "-"}</p>
                            </div>
                        </div>
                    </div>

                    <div class="mt-4">
                        <h6 class="mb-3">تفاصيل المنتجات</h6>
                        ${order.items
                          .map(
                            (item) => `
                            <div class="d-flex justify-content-between align-items-center mb-2">
                                <span>${item.title} (x${item.qty})</span>
                                <span>${item.selling.toFixed(2)} ج.م</span>
                            </div>
                        `,
                          )
                          .join("")}
                    </div>

                    <div class="mt-4 d-flex flex-wrap gap-2">
                        ${order.status === "pending" ? `<button class="btn btn-success btn-sm" onclick="confirmOrder('${order.id}')">تأكيد الطلب</button>` : order.status === "confirmed" ? `<button class="btn btn-primary btn-sm" onclick="deliverOrder('${order.id}')">تم التسليم</button>` : ""}
                        <button class="btn btn-outline-secondary btn-sm" onclick="copyOrderLink('${order.id}')">نسخ رقم الطلب</button>
                    </div>
                </div>
            </div>
        `;
    })
    .join("");
}

function confirmOrder(orderId) {
  const orders = loadOrders();
  const order = orders.find((o) => o.id === orderId);
  if (!order) return;
  if (order.status === "confirmed" || order.status === "delivered") return;

  order.status = "confirmed";
  order.confirmedAt = new Date().toLocaleString("ar-EG");
  order.notification =
    "تم استلام طلبك الآن. فريقنا يعمل على تجهيزه وتم إضافة أرباح الطلب إلى محفظتك.";
  saveOrders(orders);
  saveOrderNotification(order.id, order.notification);
  renderAdminOrders();

  alert(`تم تأكيد الطلب ${order.id} وتم إرسال إشعار استلام العميل.`);
}

function deliverOrder(orderId) {
  const orders = loadOrders();
  const order = orders.find((o) => o.id === orderId);
  if (!order) return;
  if (order.status !== "confirmed") {
    alert("يمكنك تسليم الطلب بعد تأكيده فقط.");
    return;
  }

  order.status = "delivered";
  order.deliveredAt = new Date().toLocaleString("ar-EG");
  order.notification = "تم توصيل طلبك بنجاح.";
  saveOrders(orders);
  saveOrderNotification(order.id, order.notification);
  renderAdminOrders();

  markOrderAsDelivered(
    order.id,
    order.marketerEmail,
    parseFloat(order.profit) || 0,
  );
  alert(`تم تسليم الطلب ${order.id} وإضافة ربحه إلى محفظة المسوق.`);
}

window.markOrderAsDelivered = async function (
  orderId,
  marketerEmail,
  profitAmount,
) {
  try {
    const walletRef = doc(db, "Wallets", marketerEmail);
    const dateStr = new Date().toLocaleString("ar-EG");

    await updateDoc(walletRef, {
      balance: increment(profitAmount),
      history: arrayUnion({
        type: "income",
        amount: profitAmount,
        desc: `أرباح طلب رقم #${orderId.slice(-5)}`,
        date: dateStr,
      }),
    });

    console.log("تم تحديث رصيد المحفظة بنجاح.");
  } catch (error) {
    console.error("خطأ في تحديث المحفظة:", error);
    alert("حدث خطأ أثناء إضافة الأرباح إلى المحفظة.");
  }
};

function copyOrderLink(orderId) {
  navigator.clipboard
    .writeText(orderId)
    .then(() => {
      alert("تم نسخ رقم الطلب إلى الحافظة.");
    })
    .catch(() => {
      alert("فشل نسخ رقم الطلب.");
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
  window.addEventListener("storage", () => renderAdminOrders());
  setInterval(renderAdminOrders, 3000);
}

window.confirmOrder = confirmOrder;
window.deliverOrder = deliverOrder;
window.copyOrderLink = copyOrderLink;

document.addEventListener("DOMContentLoaded", initAdminPage);

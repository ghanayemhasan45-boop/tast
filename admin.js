const CURRENT_USER_KEY = 'currentUser';
const ADMIN_EMAILS = ['admin@makasabpro.com', 'ghanayemhasan45@gmail.com'];
const ORDER_STORAGE_KEY = 'dropshipOrders';

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

function loadOrders() {
    const data = localStorage.getItem(ORDER_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
}

function saveOrders(orders) {
    localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(orders));
}

function renderAdminOrders() {
    const orders = loadOrders();
    const pendingOrders = orders.filter(o => o.status === 'pending');
    const confirmedOrders = orders.filter(o => o.status === 'confirmed');

    document.getElementById('pendingOrdersCount').innerText = pendingOrders.length;
    document.getElementById('confirmedOrdersCount').innerText = confirmedOrders.length;
    document.getElementById('totalOrdersCount').innerText = orders.length;

    const container = document.getElementById('ordersContainer');
    if (orders.length === 0) {
        container.innerHTML = `<div class="col-12"><div class="alert alert-secondary text-center">لا توجد طلبات بعد.</div></div>`;
        return;
    }

    container.innerHTML = orders.map(order => {
        const customer = order.customer || {};
        return `
            <div class="col-12">
                <div class="admin-order-card p-4 rounded-4 shadow-sm bg-white">
                    <div class="d-flex justify-content-between align-items-start mb-3 flex-wrap gap-3">
                        <div>
                            <h5 class="fw-bold mb-1">طلب #${order.id}</h5>
                            <p class="text-muted mb-0">التاريخ: ${order.date}</p>
                        </div>
                        <span class="badge admin-status-badge ${order.status === 'confirmed' ? 'bg-success' : 'bg-warning text-dark'}">${order.status === 'confirmed' ? 'مؤكد' : 'جديد'}</span>
                    </div>
                    <div class="row gy-3">
                        <div class="col-md-4">
                            <div class="admin-info-box p-3 rounded-4 bg-light">
                                <h6 class="mb-2">بيانات العميل</h6>
                                <p class="mb-1"><strong>الاسم:</strong> ${customer.name || '-'}</p>
                                <p class="mb-1"><strong>الهاتف 1:</strong> ${customer.phone1 || '-'}</p>
                                <p class="mb-1"><strong>الهاتف 2:</strong> ${customer.phone2 || '-'}</p>
                                <p class="mb-1"><strong>المحافظة:</strong> ${customer.city || '-'}</p>
                                <p class="mb-1"><strong>البريد:</strong> ${customer.email || 'غير مسجل'}</p>
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
                                <p class="mb-0">${customer.address || '-'}</p>
                            </div>
                        </div>
                    </div>

                    <div class="mt-4">
                        <h6 class="mb-3">تفاصيل المنتجات</h6>
                        ${order.items.map(item => `
                            <div class="d-flex justify-content-between align-items-center mb-2">
                                <span>${item.title} (x${item.qty})</span>
                                <span>${item.selling.toFixed(2)} ج.م</span>
                            </div>
                        `).join('')}
                    </div>

                    <div class="mt-4 d-flex flex-wrap gap-2">
                        ${order.status === 'pending' ? `<button class="btn btn-success btn-sm" onclick="confirmOrder('${order.id}')">تأكيد الطلب</button>` : ''}
                        <button class="btn btn-outline-secondary btn-sm" onclick="copyOrderLink('${order.id}')">نسخ رقم الطلب</button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function confirmOrder(orderId) {
    const orders = loadOrders();
    const order = orders.find(o => o.id === orderId);
    if (!order) return;
    if (order.status === 'confirmed') return;

    order.status = 'confirmed';
    order.confirmedAt = new Date().toLocaleString('ar-EG');
    order.notification = 'تم استلام طلبك الآن. سوف يتم تجهيز الطلب قريباً.';
    saveOrders(orders);
    renderAdminOrders();

    alert(`تم تأكيد الطلب ${order.id} وإرسال إشعار استلام للعميل.`);
}

function copyOrderLink(orderId) {
    navigator.clipboard.writeText(orderId).then(() => {
        alert('تم نسخ رقم الطلب إلى الحافظة.');
    }).catch(() => {
        alert('فشل نسخ رقم الطلب.');
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
    window.addEventListener('storage', () => renderAdminOrders());
    setInterval(renderAdminOrders, 3000);
}

window.confirmOrder = confirmOrder;
window.copyOrderLink = copyOrderLink;

document.addEventListener('DOMContentLoaded', initAdminPage);

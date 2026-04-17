import { getFirestore, collection, query, where, orderBy, getDocs } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const db = getFirestore();

function loadLocalOrders() {
    const data = localStorage.getItem("dropshipOrders");
    return data ? JSON.parse(data) : [];
}

function mergeOrders(localOrders, firestoreOrders, email, isAdmin) {
    const merged = [...firestoreOrders];
    localOrders
        .filter((order) => isAdmin || order.marketerEmail === email)
        .forEach((localOrder) => {
            if (!merged.some((order) => order.id === localOrder.id)) {
                merged.push(localOrder);
            }
        });
    return merged;
}

document.addEventListener("DOMContentLoaded", async () => {
    const container = document.getElementById("salesSummaryContent");
    if (!container) return;
    
    // سحب بيانات المستخدم من المتصفح
    const storedUser = localStorage.getItem("currentUser");
    if (!storedUser) {
        container.innerHTML = `<div class="text-center text-muted py-5"><h5>عذراً، يجب تسجيل الدخول أولاً!</h5></div>`;
        return;
    }

    const user = JSON.parse(storedUser);

    try {
        // سحب طلبات العميل من فايربيز
        const q = user.isAdmin
            ? query(collection(db, "Orders"), orderBy("createdAt", "desc"))
            : query(collection(db, "Orders"), where("marketerEmail", "==", user.email));
        const querySnapshot = await getDocs(q);

        const firestoreOrders = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const localOrders = loadLocalOrders();
        const myOrders = mergeOrders(localOrders, firestoreOrders, user.email, user.isAdmin);

        const totalOrders = myOrders.length;
        const totalRevenue = myOrders.reduce((sum, o) => sum + (parseFloat(o.total) || 0), 0);
        const totalProfit = myOrders.reduce((sum, o) => sum + (parseFloat(o.profit) || 0), 0);
        const lastOrderId = localStorage.getItem("lastOrderId");
        const lastOrder = lastOrderId ? myOrders.find((o) => o.id === lastOrderId) : null;

        container.innerHTML = `
            ${lastOrder ? `
                <div class="alert alert-info rounded-4 border mb-4">
                    <h5 class="mb-2">حالة طلبك الأخير</h5>
                    <p class="mb-1">رقم الطلب: <strong>#${lastOrder.id.slice(-5).toUpperCase()}</strong></p>
                    <p class="mb-0">الحالة الحالية: <strong>${lastOrder.status === 'delivered' ? 'تم التسليم' : lastOrder.status === 'confirmed' ? 'تم التأكيد' : 'قيد الانتظار'}</strong></p>
                </div>
            ` : ""}
            <div class="row text-center mb-5 g-4">
                <div class="col-md-4"><div class="p-4 bg-light rounded shadow-sm border"><h6 class="text-muted">عدد الطلبات</h6><h3 class="text-primary">${totalOrders}</h3></div></div>
                <div class="col-md-4"><div class="p-4 bg-light rounded shadow-sm border"><h6 class="text-muted">إجمالي المبيعات</h6><h3 class="text-dark">${totalRevenue} ج.م</h3></div></div>
                <div class="col-md-4"><div class="p-4 bg-light rounded shadow-sm border border-success"><h6 class="text-success">الأرباح المحققة</h6><h3 class="text-success">+${totalProfit} ج.م</h3></div></div>
            </div>
            <div class="table-responsive">
                <table class="table table-hover text-center align-middle border">
                    <thead class="table-light"><tr><th>رقم الطلب</th><th>التاريخ</th><th>الحالة</th><th>الإجمالي</th><th>الربح</th></tr></thead>
                    <tbody>
                        ${myOrders.length === 0 ? '<tr><td colspan="5" class="text-muted py-5">لا توجد طلبات بعد.</td></tr>' : 
                          myOrders.map(o => `
                                <tr>
                                    <td><small class="text-muted">#${o.id.slice(-5).toUpperCase()}</small></td>
                                    <td>${o.createdAt?.seconds ? new Date(o.createdAt.seconds * 1000).toLocaleDateString('ar-EG') : 'حديث'}</td>
                                    <td><span class="badge ${o.status === 'confirmed' ? 'bg-primary' : o.status === 'delivered' ? 'bg-success' : 'bg-warning text-dark'}">${o.status === 'confirmed' ? 'تم التأكيد' : o.status === 'delivered' ? 'تم التسليم' : 'قيد الانتظار'}</span></td>
                                    <td class="fw-bold">${o.total} ج.م</td>
                                    <td class="text-success fw-bold">+${o.profit} ج.م</td>
                                </tr>
                          `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    } catch (error) {
        console.error("Firebase Error:", error);
        container.innerHTML = '<div class="text-danger text-center py-5">حدث خطأ أثناء الاتصال بقاعدة البيانات.</div>';
    }
});
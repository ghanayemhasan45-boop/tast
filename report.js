import { getFirestore, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

const db = getFirestore();
const auth = getAuth();

// أول ما الصفحة تحمل، هنراقب حالة تسجيل الدخول
document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("salesSummaryContent");

    onAuthStateChanged(auth, async (user) => {
        if (!user) {
            container.innerHTML = `
                <div class="text-center text-muted py-5">
                    <h5>عذراً، يجب تسجيل الدخول أولاً!</h5>
                    <p>يرجى العودة للصفحة الرئيسية وتسجيل الدخول بحسابك لعرض مبيعاتك.</p>
                    <a href="index.html" class="btn btn-primary mt-3">العودة للرئيسية</a>
                </div>`;
            return;
        }

        try {
            // جلب البيانات من الداتا بيز (v9)
            const q = query(collection(db, "Orders"), where("marketerEmail", "==", user.email));
            const querySnapshot = await getDocs(q);

            const myOrders = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            // العمليات الحسابية
            const totalOrders = myOrders.length;
            const totalRevenue = myOrders.reduce((sum, o) => sum + (parseFloat(o.total) || 0), 0);
            const totalProfit = myOrders.reduce((sum, o) => sum + (parseFloat(o.profit) || 0), 0);

            // عرض النتائج في الصفحة
            container.innerHTML = `
                <div class="row text-center mb-5 g-4">
                    <div class="col-md-4">
                        <div class="sales-summary-card">
                            <h6 class="stat-label">عدد الطلبات الإجمالي</h6>
                            <div class="stat-value text-warning">${totalOrders}</div>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="sales-summary-card">
                            <h6 class="stat-label">إجمالي قيمة المبيعات</h6>
                            <div class="stat-value text-white">${totalRevenue.toFixed(2)} <small>ج.م</small></div>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="sales-summary-card border border-success bg-white">
                            <h6 class="stat-label text-dark">إجمالي الأرباح المحققة</h6>
                            <div class="stat-value text-success">+${totalProfit.toFixed(2)} <small>ج.م</small></div>
                        </div>
                    </div>
                </div>

                <h5 class="fw-bold mb-3" style="color: #2D1B69;">سجل الطلبات المفصل</h5>
                <div class="table-responsive">
                    <table class="table table-hover text-center align-middle border">
                        <thead class="table-light">
                            <tr>
                                <th>رقم الطلب</th>
                                <th>التاريخ</th>
                                <th>الحالة</th>
                                <th>إجمالي البيع</th>
                                <th>ربحك</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${myOrders.length === 0 ? '<tr><td colspan="5" class="text-muted py-5">لم تقم بأي طلبات بعد. ابدأ تجارتك الآن!</td></tr>' :
                              myOrders.map(o => {
                                  const orderDate = o.createdAt?.seconds ? new Date(o.createdAt.seconds * 1000).toLocaleDateString('ar-EG') : 'حديث';
                                  
                                  let statusBadge = '<span class="badge bg-warning text-dark px-3 py-2">قيد الانتظار</span>';
                                  if (o.status === 'confirmed') statusBadge = '<span class="badge bg-primary px-3 py-2">تم التأكيد</span>';
                                  if (o.status === 'delivered') statusBadge = '<span class="badge bg-success px-3 py-2">تم التسليم</span>';

                                  return `
                                    <tr>
                                        <td><small class="text-muted">#${o.id.slice(-5).toUpperCase()}</small></td>
                                        <td>${orderDate}</td>
                                        <td>${statusBadge}</td>
                                        <td class="fw-bold">${o.total} ج.م</td>
                                        <td class="text-success fw-bold fs-5">+${o.profit} ج.م</td>
                                    </tr>
                                  `;
                              }).join('')}
                        </tbody>
                    </table>
                </div>
            `;
        } catch (error) {
            console.error("Firebase Error:", error);
            container.innerHTML = '<div class="text-danger text-center py-5">حدث خطأ أثناء الاتصال بقاعدة البيانات. الرجاء التأكد من اتصال الإنترنت.</div>';
        }
    });
});
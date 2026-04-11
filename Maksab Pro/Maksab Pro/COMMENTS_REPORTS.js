/**
 * =====================================================
 * وحدة التقارير (Reports Module) - reports.js
 * =====================================================
 * نظام عرض التقارير الشاملة للمبيعات:
 * - قائمة كاملة بكل المنتجات المباعة
 * - إحصائيات مفصلة لكل منتج
 * - حساب الإجماليات الكلية
 * - تحميل التقرير كملف CSV
 */

/**
 * دالة: فتح تقرير المبيعات الشامل
 * تعرض جدول كامل بـ:
 * - اسم المنتج
 * - الكمية المباعة
 * - عدد الطلبات
 * - الإيراد الكلي
 * - الربح الكلي
 */
function openSalesReport() {
    // جلب سجلات المبيعات
    const sales = loadDailySales();
    
    // التحقق من وجود مبيعات
    if (sales.length === 0) {
        alert('لا توجد مبيعات مسجلة بعد');
        return;
    }

    // بداية بناء محتوى الموديال
    let reportHtml = `
        <div class="modal-header">
            <h5 class="modal-title fw-bold">📊 تقرير المبيعات الشامل</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body" style="max-height: 500px; overflow-y: auto;">
    `;

    // =====================
    // تجميع البيانات
    // =====================
    // هنا نجمع كل منتج من كل الأيام
    const productSales = {};  // مثال: { 101: { title: "...", totalQty: 5, ... } }
    
    sales.forEach(order => {
        if (!order.itemsDetails) return;  // إذا لا تفاصيل، اتخطى
        
        order.itemsDetails.forEach(item => {
            // إنشاء دخول جديد للمنتج إذا لم يكن موجود
            if (!productSales[item.id]) {
                productSales[item.id] = {
                    id: item.id,
                    title: item.title,
                    totalQty: 0,      // الكمية الكلية
                    totalRevenue: 0,  // الإيراد الكلي
                    totalProfit: 0,   // الربح الكلي
                    orders: 0         // عدد الطلبات
                };
            }
            
            // إضافة البيانات
            productSales[item.id].totalQty += item.qty;
            productSales[item.id].totalRevenue += item.revenue;
            productSales[item.id].totalProfit += item.profit;
            productSales[item.id].orders += 1;
        });
    });

    // ترتيب المنتجات من الأعلى إيراد للأقل
    const sortedProducts = Object.values(productSales).sort((a, b) => b.totalRevenue - a.totalRevenue);

    // =====================
    // بناء الجدول
    // =====================
    reportHtml += `
        <div class="table-responsive">
            <table class="table table-striped table-hover">
                <thead class="table-dark">
                    <tr>
                        <th>المنتج</th>
                        <th>الكمية المباعة</th>
                        <th>عدد الطلبات</th>
                        <th>إجمالي الإيراد</th>
                        <th>إجمالي الربح</th>
                    </tr>
                </thead>
                <tbody>
    `;

    // إضافة صف لكل منتج
    sortedProducts.forEach(product => {
        reportHtml += `
            <tr>
                <td><strong>${product.title}</strong></td>
                <td><span class="badge bg-primary">${product.totalQty}</span></td>
                <td><span class="badge bg-info">${product.orders}</span></td>
                <td><span class="text-success fw-bold">${product.totalRevenue.toFixed(2)} ج.م</span></td>
                <td><span class="text-info fw-bold">${product.totalProfit.toFixed(2)} ج.م</span></td>
            </tr>
        `;
    });

    // =====================
    // صف الإجماليات
    // =====================
    const grandTotalQty = sortedProducts.reduce((sum, p) => sum + p.totalQty, 0);
    const grandTotalRevenue = sortedProducts.reduce((sum, p) => sum + p.totalRevenue, 0);
    const grandTotalProfit = sortedProducts.reduce((sum, p) => sum + p.totalProfit, 0);

    reportHtml += `
                </tbody>
                <tfoot class="table-warning">
                    <tr>
                        <td><strong>الإجمالي</strong></td>
                        <td><strong>${grandTotalQty}</strong></td>
                        <td><strong>${sales.length}</strong></td>
                        <td><strong>${grandTotalRevenue.toFixed(2)} ج.م</strong></td>
                        <td><strong>${grandTotalProfit.toFixed(2)} ج.م</strong></td>
                    </tr>
                </tfoot>
            </table>
        </div>

        <!-- ملخص الأداء -->
        <div class="alert alert-success mt-3">
            <h6>📈 ملخص الأداء</h6>
            <p class="mb-1">إجمالي الطلبات: <strong>${sales.length}</strong></p>
            <p class="mb-1">إجمالي الكمية المباعة: <strong>${grandTotalQty}</strong></p>
            <p class="mb-1">متوسط الإيراد لكل طلب: <strong>${(grandTotalRevenue / sales.length).toFixed(2)} ج.م</strong></p>
            <p class="mb-0">متوسط الربح لكل طلب: <strong>${(grandTotalProfit / sales.length).toFixed(2)} ج.م</strong></p>
        </div>
    `;

    // =====================
    // الأزرار
    // =====================
    reportHtml += `
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">إغلاق</button>
            <button type="button" class="btn btn-primary" onclick="exportReportCSV()">
                <i class="fa-solid fa-download"></i> تحميل CSV
            </button>
        </div>
    `;

    // البحث عن الموديال أو إنشاء واحد جديد
    const modal = document.getElementById('reportModal');
    if (!modal) {
        // إنشاء موديال جديد
        const newModal = document.createElement('div');
        newModal.id = 'reportModal';
        newModal.className = 'modal fade';
        newModal.innerHTML = `
            <div class="modal-dialog modal-lg">
                <div class="modal-content" id="reportModalContent"></div>
            </div>
        `;
        document.body.appendChild(newModal);
    }

    // تحديث المحتوى وفتح الموديال
    document.getElementById('reportModalContent').innerHTML = reportHtml;
    new bootstrap.Modal(document.getElementById('reportModal')).show();
}

/**
 * دالة: تحميل التقرير كملف CSV
 * CSV = صيغة جدولية يمكن فتحها في Excel
 */
function exportReportCSV() {
    // جلب سجلات المبيعات
    const sales = loadDailySales();
    
    // بدء الملف بالعناوين
    let csv = 'المنتج,الكمية المباعة,عدد الطلبات,إجمالي الإيراد,إجمالي الربح\n';

    // تجميع البيانات (نفس التجميعة السابقة)
    const productSales = {};
    sales.forEach(order => {
        if (!order.itemsDetails) return;
        order.itemsDetails.forEach(item => {
            if (!productSales[item.id]) {
                productSales[item.id] = {
                    title: item.title,
                    totalQty: 0,
                    totalRevenue: 0,
                    totalProfit: 0,
                    orders: 0
                };
            }
            productSales[item.id].totalQty += item.qty;
            productSales[item.id].totalRevenue += item.revenue;
            productSales[item.id].totalProfit += item.profit;
            productSales[item.id].orders += 1;
        });
    });

    // إضافة كل منتج كصف في الملف
    Object.values(productSales)
        .sort((a, b) => b.totalRevenue - a.totalRevenue)  // ترتيب تنازلي حسب الإيراد
        .forEach(product => {
            csv += `"${product.title}",${product.totalQty},${product.orders},${product.totalRevenue.toFixed(2)},${product.totalProfit.toFixed(2)}\n`;
        });

    // إضافة صف الإجماليات في نهاية الملف
    const grandTotalQty = Object.values(productSales).reduce((sum, p) => sum + p.totalQty, 0);
    const grandTotalRevenue = Object.values(productSales).reduce((sum, p) => sum + p.totalRevenue, 0);
    const grandTotalProfit = Object.values(productSales).reduce((sum, p) => sum + p.totalProfit, 0);

    csv += `الإجمالي,${grandTotalQty},${sales.length},${grandTotalRevenue.toFixed(2)},${grandTotalProfit.toFixed(2)}\n`;

    // =====================
    // تحميل الملف
    // =====================
    // إنشاء Blob (ملف مؤقت)
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    
    // إنشاء رابط للتحميل
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `sales_report_${new Date().toLocaleDateString('ar-EG')}.csv`);
    
    // تحميل الملف
    link.click();
}

/**
 * دالة مساعدة: إحصائيات سريعة
 * تحسب الإجماليات بسرعة لعرضها في الواجهة
 */
function getQuickStats() {
    const sales = loadDailySales();
    const today = new Date().toLocaleDateString('ar-EG');
    
    // المبيعات اليومية
    const todaysSales = sales.filter(s => s.date === today);

    return {
        totalOrders: todaysSales.length,
        totalRevenue: todaysSales.reduce((sum, i) => sum + (parseFloat(i.total) || 0), 0),
        totalProfit: todaysSales.reduce((sum, i) => sum + (parseFloat(i.profit) || 0), 0),
        
        // المبيعات الكلية (منذ البداية)
        allTimeOrders: sales.length,
        allTimeRevenue: sales.reduce((sum, i) => sum + (parseFloat(i.total) || 0), 0),
        allTimeProfit: sales.reduce((sum, i) => sum + (parseFloat(i.profit) || 0), 0)
    };
}

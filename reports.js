// --- تقرير المبيعات الشامل ---

function notify(message, type = "info") {
    if (typeof showAppMessage === "function") {
        showAppMessage(message, type);
    } else {
        alert(message);
    }
}

function openSalesReport() {
    const sales = loadDailySales();
    
    if (sales.length === 0) {
        notify('لا توجد مبيعات مسجلة بعد', 'info');
        return;
    }

    let reportHtml = `
        <div class="modal-header">
            <h5 class="modal-title fw-bold">📊 تقرير المبيعات الشامل</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body" style="max-height: 500px; overflow-y: auto;">
    `;

    // تجميع المبيعات حسب المنتج
    const productSales = {};
    sales.forEach(order => {
        if (!order.itemsDetails) return;
        order.itemsDetails.forEach(item => {
            if (!productSales[item.id]) {
                productSales[item.id] = {
                    id: item.id,
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

    const sortedProducts = Object.values(productSales).sort((a, b) => b.totalRevenue - a.totalRevenue);

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

        <div class="alert alert-success mt-3">
            <h6>📈 ملخص الأداء</h6>
            <p class="mb-1">إجمالي الطلبات: <strong>${sales.length}</strong></p>
            <p class="mb-1">إجمالي الكمية المباعة: <strong>${grandTotalQty}</strong></p>
            <p class="mb-1">متوسط الإيراد لكل طلب: <strong>${(grandTotalRevenue / sales.length).toFixed(2)} ج.م</strong></p>
            <p class="mb-0">متوسط الربح لكل طلب: <strong>${(grandTotalProfit / sales.length).toFixed(2)} ج.م</strong></p>
        </div>
    `;

    reportHtml += `
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">إغلاق</button>
            <button type="button" class="btn btn-primary" onclick="exportReportCSV()">
                <i class="fa-solid fa-download"></i> تحميل CSV
            </button>
        </div>
    `;

    const modal = document.getElementById('reportModal');
    if (!modal) {
        // إنشاء مودال إذا لم تكن موجودة
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

    document.getElementById('reportModalContent').innerHTML = reportHtml;
    new bootstrap.Modal(document.getElementById('reportModal')).show();
}

function exportReportCSV() {
    const sales = loadDailySales();
    
    let csv = 'المنتج,الكمية المباعة,عدد الطلبات,إجمالي الإيراد,إجمالي الربح\n';

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

    Object.values(productSales).sort((a, b) => b.totalRevenue - a.totalRevenue).forEach(product => {
        csv += `"${product.title}",${product.totalQty},${product.orders},${product.totalRevenue.toFixed(2)},${product.totalProfit.toFixed(2)}\n`;
    });

    const grandTotalQty = Object.values(productSales).reduce((sum, p) => sum + p.totalQty, 0);
    const grandTotalRevenue = Object.values(productSales).reduce((sum, p) => sum + p.totalRevenue, 0);
    const grandTotalProfit = Object.values(productSales).reduce((sum, p) => sum + p.totalProfit, 0);

    csv += `الإجمالي,${grandTotalQty},${sales.length},${grandTotalRevenue.toFixed(2)},${grandTotalProfit.toFixed(2)}\n`;

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `sales_report_${new Date().toLocaleDateString('ar-EG')}.csv`);
    link.click();
}

// دالة مساعدة لحساب إحصائيات سريعة
function getQuickStats() {
    const sales = loadDailySales();
    const today = new Date().toLocaleDateString('ar-EG');
    const todaysSales = sales.filter(s => s.date === today);

    return {
        totalOrders: todaysSales.length,
        totalRevenue: todaysSales.reduce((sum, i) => sum + (parseFloat(i.total) || 0), 0),
        totalProfit: todaysSales.reduce((sum, i) => sum + (parseFloat(i.profit) || 0), 0),
        allTimeOrders: sales.length,
        allTimeRevenue: sales.reduce((sum, i) => sum + (parseFloat(i.total) || 0), 0),
        allTimeProfit: sales.reduce((sum, i) => sum + (parseFloat(i.profit) || 0), 0)
    };
}

// --- Daily Sales Tracking ---
let dailySales = [];

// --- Sales Functions ---
function loadDailySales() {
    const saved = localStorage.getItem('dropshipDailySales');
    dailySales = saved ? JSON.parse(saved) : [];
    return dailySales;
}

function saveDailySales(sales) {
    if (!Array.isArray(sales)) {
        console.error('Invalid sales data');
        return;
    }
    dailySales = sales;
    localStorage.setItem('dropshipDailySales', JSON.stringify(sales));
}

function addOrderToDailySummary(order) {
    if (!Array.isArray(order.itemsDetails)) {
        console.error('Invalid order structure');
        return;
    }

    loadDailySales();

    const today = new Date().toLocaleDateString('ar-EG');
    let todayRecord = dailySales.find(s => s.date === today);

    if (!todayRecord) {
        todayRecord = {
            date: today,
            orders: [],
            totalRevenue: 0,
            totalProfit: 0,
            productsMap: {}
        };
        dailySales.push(todayRecord);
    }

    todayRecord.orders.push(order);
    todayRecord.totalRevenue += order.total || 0;
    todayRecord.totalProfit += order.profit || 0;

    order.itemsDetails.forEach(item => {
        if (!todayRecord.productsMap[item.id]) {
            todayRecord.productsMap[item.id] = {
                id: item.id,
                title: item.title,
                qty: 0,
                revenue: 0,
                profit: 0
            };
        }
        todayRecord.productsMap[item.id].qty += item.qty;
        todayRecord.productsMap[item.id].revenue += item.revenue;
        todayRecord.productsMap[item.id].profit += item.profit;
    });

    saveDailySales(dailySales);
}

function renderDailySalesSummary() {
    loadDailySales();

    const today = new Date().toLocaleDateString('ar-EG');
    const todayData = dailySales.find(s => s.date === today);

    const container = document.getElementById('dailySalesSummary');
    if (!container) return;

    if (!todayData) {
        container.innerHTML = '<p class="text-center text-muted py-3">لا توجد مبيعات اليوم</p>';
        return;
    }

    const productsHtml = Object.values(todayData.productsMap || {})
        .map(p => `
            <div class="daily-summary-card">
                <div class="d-flex justify-content-between align-items-center">
                    <div class="flex-grow-1">
                        <h6 class="mb-1 fw-bold text-truncate">${p.title}</h6>
                        <div class="d-flex gap-3">
                            <span class="small text-muted">
                                <i class="fa-solid fa-box"></i> ${p.qty} قطع
                            </span>
                            <span class="small text-muted">
                                <i class="fa-solid fa-money-bill"></i> ${p.revenue.toFixed(2)} ج.م
                            </span>
                        </div>
                    </div>
                    <div class="text-end">
                        <div class="fw-bold text-success">
                            +${p.profit.toFixed(2)} ج.م
                        </div>
                    </div>
                </div>
            </div>
        `)
        .join('');

    container.innerHTML = `
        <div class="mb-3">
            <h6 class="fw-bold mb-2">📊 ملخص المبيعات اليوم</h6>
            <div class="row g-2 mb-3">
                <div class="col-6">
                    <div class="bg-light p-2 rounded text-center">
                        <small class="text-muted d-block">الطلبات</small>
                        <span class="fw-bold">${todayData.orders.length}</span>
                    </div>
                </div>
                <div class="col-6">
                    <div class="bg-light p-2 rounded text-center">
                        <small class="text-muted d-block">الأرباح</small>
                        <span class="fw-bold text-success">${todayData.totalProfit.toFixed(2)} ج.م</span>
                    </div>
                </div>
            </div>
            <h6 class="fw-bold mb-2 small">🏆 أفضل المنتجات</h6>
            ${productsHtml}
        </div>
    `;
}

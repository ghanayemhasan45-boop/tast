// --- Utility Functions ---
function calculateProfitManual() {
    const finalTotalElement = document.getElementById('finalTotalInput');
    const wholesaleElement = document.getElementById('summaryWholesale');
    const profitElement = document.getElementById('summaryProfit');

    if (!finalTotalElement || !wholesaleElement) return;

    const finalTotal = parseFloat(finalTotalElement.value) || 0;
    const wholesale = parseFloat(wholesaleElement.innerText) || 0;
    const profit = finalTotal - wholesale;

    profitElement.innerText = profit + ' ج.م';
    profitElement.style.color = profit < 0 ? '#dc3545' : '#28a745';
}

function downloadProductResources(id) {
    const product = products.find(p => p.id === id);
    if (!product || !product.image) {
        alert('لا توجد موارد للتحميل');
        return;
    }

    const link = document.createElement('a');
    link.href = product.image;
    link.target = '_blank';
    link.download = `${product.title}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function formatCurrency(value) {
    return parseFloat(value).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function getProductByCategory(category) {
    return products.filter(p => p.category === category);
}

function getTotalSalesForProduct(productId) {
    loadDailySales();
    let total = 0;
    dailySales.forEach(day => {
        if (day.productsMap && day.productsMap[productId]) {
            total += day.productsMap[productId].qty;
        }
    });
    return total;
}

function getDailyStats() {
    loadDailySales();
    const today = new Date().toLocaleDateString('ar-EG');
    const todayData = dailySales.find(s => s.date === today) || { orders: [], totalRevenue: 0, totalProfit: 0 };
    return {
        ordersCount: todayData.orders.length,
        totalRevenue: todayData.totalRevenue,
        totalProfit: todayData.totalProfit
    };
}

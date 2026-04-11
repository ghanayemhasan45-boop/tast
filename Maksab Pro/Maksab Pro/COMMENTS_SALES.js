/**
 * =====================================================
 * وحدة المبيعات اليومية (Daily Sales) - sales.js
 * =====================================================
 * نظام تتبع المبيعات اليومية والإحصائيات:
 * - تسجيل كل طلب مع تفاصيل المنتجات
 * - حساب الإجماليات اليومية
 * - حفظ السجل في LocalStorage
 * - عرض ملخص المبيعات اليوم
 */

// ============================================
// حالة المبيعات - سجل يومي
// ============================================
let dailySales = [];  // مصفوفة تحتوي على سجل كل يوم

/**
 * دالة: تحميل سجلات المبيعات من التخزين المحلي
 * عند فتح الموقع، نجلب البيانات المحفوظة سابقاً
 */
function loadDailySales() {
    const saved = localStorage.getItem('dropshipDailySales');  // جلب من LocalStorage
    dailySales = saved ? JSON.parse(saved) : [];  // تحويل JSON إلى JavaScript object أو مصفوفة فارغة
    return dailySales;
}

/**
 * دالة: حفظ سجلات المبيعات في التخزين المحلي
 * استخدام: saveDailySales(sales)
 * - sales: مصفوفة السجلات المراد حفظها
 */
function saveDailySales(sales) {
    if (!Array.isArray(sales)) {
        console.error('Invalid sales data');  // تنبيه خطأ إذا البيانات غير صحيحة
        return;
    }
    dailySales = sales;  // تحديث المتغير العام
    localStorage.setItem('dropshipDailySales', JSON.stringify(sales));  // حفظ في LocalStorage
}

/**
 * دالة: إضافة طلب جديد إلى السجل اليومي
 * استخدام: addOrderToDailySummary(order)
 * - order: معلومات الطلب (تاريخ، إجمالي، ربح، تفاصيل المنتجات)
 */
function addOrderToDailySummary(order) {
    // التحقق من أن تفاصيل المنتجات موجودة
    if (!Array.isArray(order.itemsDetails)) {
        console.error('Invalid order structure');
        return;
    }

    // تحميل السجلات الحالية
    loadDailySales();

    // الحصول على تاريخ اليوم
    const today = new Date().toLocaleDateString('ar-EG');
    
    // البحث عن سجل اليوم الحالي
    let todayRecord = dailySales.find(s => s.date === today);

    // إذا لم يوجد سجل لليوم، ننشئ واحد جديد
    if (!todayRecord) {
        todayRecord = {
            date: today,
            orders: [],           // قائمة الطلبات
            totalRevenue: 0,      // إجمالي الإيراد
            totalProfit: 0,       // إجمالي الربح
            productsMap: {}       // خريطة المنتجات مع إحصائياتها
        };
        dailySales.push(todayRecord);
    }

    // إضافة الطلب الجديد
    todayRecord.orders.push(order);
    todayRecord.totalRevenue += order.total || 0;  // إضافة الإيراد
    todayRecord.totalProfit += order.profit || 0;  // إضافة الربح

    // تحديث البيانات لكل منتج في الطلب
    order.itemsDetails.forEach(item => {
        // إنشاء دخول جديد للمنتج إذا لم يكن موجوداً
        if (!todayRecord.productsMap[item.id]) {
            todayRecord.productsMap[item.id] = {
                id: item.id,
                title: item.title,
                qty: 0,        // الكمية المباعة
                revenue: 0,    // الإيراد من هذا المنتج
                profit: 0      // الربح من هذا المنتج
            };
        }
        
        // إضافة البيانات للمنتج
        todayRecord.productsMap[item.id].qty += item.qty;
        todayRecord.productsMap[item.id].revenue += item.revenue;
        todayRecord.productsMap[item.id].profit += item.profit;
    });

    // حفظ السجل المحدث
    saveDailySales(dailySales);
}

/**
 * دالة: عرض ملخص المبيعات اليومية في الصفحة
 * هذه الدالة تقوم بـ:
 * 1. جلب سجل اليوم
 * 2. عرض المنتجات الأكثر مبيعاً
 * 3. عرض إجماليات المبيعات والأرباح
 */
function renderDailySalesSummary() {
    // تحميل السجلات
    loadDailySales();

    // الحصول على تاريخ اليوم
    const today = new Date().toLocaleDateString('ar-EG');
    
    // البحث عن سجل اليوم
    const todayData = dailySales.find(s => s.date === today);

    // الحصول على الحاوية لعرض الملخص
    const container = document.getElementById('dailySalesSummary');
    if (!container) return;

    // إذا لم تكن هناك مبيعات اليوم
    if (!todayData) {
        container.innerHTML = '<p class="text-center text-muted py-3">لا توجد مبيعات اليوم</p>';
        return;
    }

    // بناء HTML لقائمة المنتجات المباعة
    const productsHtml = Object.values(todayData.productsMap || {})
        .map(p => `
            <div class="daily-summary-card">
                <div class="d-flex justify-content-between align-items-center">
                    <div class="flex-grow-1">
                        <!-- اسم المنتج -->
                        <h6 class="mb-1 fw-bold text-truncate">${p.title}</h6>
                        
                        <!-- الكمية والإيراد -->
                        <div class="d-flex gap-3">
                            <span class="small text-muted">
                                <i class="fa-solid fa-box"></i> ${p.qty} قطع
                            </span>
                            <span class="small text-muted">
                                <i class="fa-solid fa-money-bill"></i> ${p.revenue.toFixed(2)} ج.م
                            </span>
                        </div>
                    </div>
                    
                    <!-- الربح (باللون الأخضر) -->
                    <div class="text-end">
                        <div class="fw-bold text-success">
                            +${p.profit.toFixed(2)} ج.م
                        </div>
                    </div>
                </div>
            </div>
        `)
        .join('');

    // بناء ملخص كامل لليوم
    container.innerHTML = `
        <div class="mb-3">
            <!-- العنوان -->
            <h6 class="fw-bold mb-2">📊 ملخص المبيعات اليوم</h6>
            
            <!-- الإحصائيات السريعة -->
            <div class="row g-2 mb-3">
                <!-- عدد الطلبات -->
                <div class="col-6">
                    <div class="bg-light p-2 rounded text-center">
                        <small class="text-muted d-block">الطلبات</small>
                        <span class="fw-bold">${todayData.orders.length}</span>
                    </div>
                </div>
                
                <!-- إجمالي الأرباح -->
                <div class="col-6">
                    <div class="bg-light p-2 rounded text-center">
                        <small class="text-muted d-block">الأرباح</small>
                        <span class="fw-bold text-success">${todayData.totalProfit.toFixed(2)} ج.م</span>
                    </div>
                </div>
            </div>
            
            <!-- قائمة المنتجات -->
            <h6 class="fw-bold mb-2 small">🏆 أفضل المنتجات</h6>
            ${productsHtml}
        </div>
    `;
}

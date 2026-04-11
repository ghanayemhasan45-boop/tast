/**
 * =====================================================
 * وحدة السلة (Shopping Cart) - cart.js
 * =====================================================
 * هذا الملف يتعامل مع منطق السلة الشرائية:
 * - إضافة منتجات للسلة
 * - حذف المنتجات من السلة
 * - تحديث أسعار البيع
 * - عرض السلة في الواجهة
 * - حساب الإجمالي والربح
 * - إرسال الطلب عبر واتس أب
 */

// ============================================
// حالة السلة - تخزين المنتجات المضافة
// ============================================
let cart = [];  // مصفوفة فارغة في البداية، نملأها كلما العميل يضيف منتج

/**
 * دالة: إضافة منتج إلى السلة
 * استخدام: addToCart(101, buttonElement)
 * - id: معرف المنتج المراد إضافته
 * - btnElement: زر "أضف للسلة" لتغيير نصه عند الضغط
 */
function addToCart(id, btnElement) {
    const p = products.find(x => x.id === id);  // البحث عن المنتج بمعرفه
    if (!p) return;  // إذا ما حجناه، خروج

    // إضافة المنتج للسلة مع معلومات إضافية
    cart.push({
        ...p,  // نسخ كل معلومات المنتج الأصلية
        userSellingPrice: p.price + p.profit,  // السعر الافتراضي = الجملة + الربح المقترح
        cartId: Date.now() + Math.floor(Math.random() * 1000)  // معرف فريد لكل إضافة (وقت الإضافة + رقم عشوائي)
    });

    updateCartUI();  // تحديث عرض السلة في الصفحة

    // تغيير نص الزر لمدة ثانية واحدة لتأكيد الإضافة
    if (btnElement && typeof btnElement.innerHTML === 'string') {
        const originalText = btnElement.innerHTML;
        btnElement.innerHTML = '<i class="fa-solid fa-check"></i> تم';  // عرض علامة ✓ وكلمة "تم"
        setTimeout(() => { btnElement.innerHTML = originalText; }, 1000);  // إرجاع النص الأصلي بعد ثانية
    }
}

/**
 * دالة: حذف منتج من السلة
 * استخدام: removeFromCart(cartId)
 * - cartId: معرف فريد للمنتج في السلة
 */
function removeFromCart(cartId) {
    cart = cart.filter(item => item.cartId !== cartId);  // إزالة المنتج باستثنائه من المصفوفة
    updateCartUI();  // تحديث الواجهة
}

/**
 * دالة: تعديل سعر البيع للمنتج الواحد
 * استخدام: updateCartItemPrice(cartId, 500)
 * - cartId: معرف المنتج
 * - newPrice: السعر الجديد بناءً على رغبة المستخدم
 */
function updateCartItemPrice(cartId, newPrice) {
    const item = cart.find(x => x.cartId === cartId);  // البحث عن المنتج
    if (item) {
        item.userSellingPrice = parseFloat(newPrice) || 0;  // تحديث السعر (تحويله لرقم عشري)
        updateTotal();  // إعادة حساب الإجمالي والربح
    }
}

/**
 * دالة: تحديث عرض السلة في الموديل (الشاشة الصغيرة)
 * هذه الدالة تقوم بـ:
 * 1. عرض عدد المنتجات في الأيقونة بالأعلى
 * 2. إعادة رسم قائمة المنتجات في الموديل
 * 3. عرض رسالة "السلة فارغة" إذا لم يكن هناك منتجات
 */
function updateCartUI() {
    // تحديث العدد في الأيقونة
    document.getElementById('cartCount').innerText = cart.length;  // عرض عدد المنتجات
    const container = document.getElementById('cartItemsContainer');  // الحاوية في الموديل

    // إذا كانت السلة فارغة
    if (cart.length === 0) {
        container.innerHTML = '<p class="text-center text-muted py-4">السلة فارغة</p>';  // رسالة فارغة
        document.getElementById('summaryWholesale').innerText = '0';
        document.getElementById('summaryProfit').innerText = '0';
        updateTotal();
        return;
    }

    // بناء HTML لكل منتج في السلة
    container.innerHTML = cart.map(item => `
        <div class="d-flex gap-3 mb-3 border-bottom pb-3 align-items-center">
            <!-- صورة المنتج -->
            <img src="${item.image}" style="width:60px; height:60px; object-fit:cover; border-radius:8px">
            
            <!-- معلومات المنتج -->
            <div class="flex-grow-1">
                <h6 class="mb-1 small fw-bold">${item.title}</h6>  <!-- اسم المنتج -->
                
                <!-- السعر الجملة وحقل تعديل سعر البيع -->
                <div class="d-flex justify-content-between align-items-center">
                    <span class="text-muted x-small">جملة: ${item.price}</span>  <!-- سعر الشراء الأصلي -->
                    
                    <!-- حقل لتعديل سعر البيع -->
                    <div class="input-group input-group-sm" style="width: 130px;">
                        <span class="input-group-text bg-light">بيع</span>  <!-- علامة "بيع" -->
                        <input type="number" class="form-control" value="${item.userSellingPrice}" onchange="updateCartItemPrice(${item.cartId}, this.value)">
                    </div>
                </div>
            </div>
            
            <!-- زر الحذف -->
            <button class="btn btn-sm text-danger" onclick="removeFromCart(${item.cartId})">
                <i class="fa-solid fa-trash"></i>  <!-- أيقونة سلة المهملات -->
            </button>
        </div>
    `).join('');  // دمج كل المنتجات في نص واحد

    updateTotal();  // إعادة حساب الإجمالي
}

/**
 * دالة: حساب الإجمالي والربح والشحن
 * هذه الدالة تحسب:
 * 1. إجمالي سعر الجملة (تكلفة الشراء)
 * 2. إجمالي سعر البيع (ما ستقبضيه من العميل)
 * 3. تكلفة الشحن (حسب المحافظة)
 * 4. الإجمالي النهائي (بيع + شحن)
 * 5. الربح (الفرق بين البيع والجملة)
 */
function updateTotal() {
    // 1. حساب إجمالي الجملة (ما تشترين به)
    const wholesaleTotal = cart.reduce((sum, item) => sum + item.price, 0);

    // 2. حساب إجمالي سعر البيع (ما تبيعي به)
    const sellingTotal = cart.reduce((sum, item) => sum + parseFloat(item.userSellingPrice || 0), 0);

    // 3. حساب تكلفة الشحن حسب المحافظة المختارة
    const city = document.getElementById('custCity').value;
    let shipping = 0;
    if (city === 'cairo') shipping = 50;      // القاهرة = 50 ج.م شحن
    else if (city === 'giza') shipping = 65;  // الجيزة = 65 ج.م شحن

    // 4. حساب الإجمالي النهائي
    const autoTotal = sellingTotal + shipping;

    // 5. حساب الربح = سعر البيع - سعر الجملة
    const profit = sellingTotal - wholesaleTotal;

    // 6. تحديث الواجهة بالأرقام الجديدة
    document.getElementById('summaryWholesale').innerText = wholesaleTotal;
    document.getElementById('summaryShipping').innerText = shipping;
    document.getElementById('finalTotalInput').value = autoTotal;
    document.getElementById('summaryProfit').innerText = profit + ' ج.م';
}

/**
 * دالة: إرسال الطلب إلى واتس أب
 * هذه الدالة تقوم بـ:
 * 1. التحقق من أن السلة ليست فارغة
 * 2. أخذ بيانات العميل (الاسم والموبايل والعنوان)
 * 3. عمل رسالة للواتس تحتوي على كل المعلومات
 * 4. فتح واتس أب برابط خاص لإرسال الرسالة
 * 5. تسجيل المبيعات في Statistics
 * 6. إضافة الربح للمحفظة
 */
function sendOrderToWhatsapp() {
    // التحقق من أن هناك منتجات في السلة
    if (cart.length === 0) {
        alert('السلة فارغة!');
        return;
    }

    // أخذ بيانات العميل من نماذج الإدخال
    const name = document.getElementById('custName').value;
    const phone1 = document.getElementById('custPhone1').value;
    const phone2 = document.getElementById('custPhone2').value;
    const address = document.getElementById('custAddress').value;
    const city = document.getElementById('custCity').value;

    // التحقق من أن جميع البيانات الأساسية موجودة
    if (!name || !phone1 || !address || !city) {
        alert('برجاء ملء جميع بيانات العميل الأساسية');
        return;
    }

    // بناء قائمة المنتجات بصيغة نصية
    let productsMsg = cart.map((item, index) => {
        return `${index + 1}. ${item.title}\n   - سعر البيع: ${item.userSellingPrice} ج.م`;
    }).join('\n');

    // تحديد تكلفة الشحن
    let shippingCost = city === 'cairo' ? 50 : (city === 'giza' ? 65 : 'يحدد لاحقاً');

    // الحصول على الإجمالي من حقل الإدخال
    let totalElement = document.getElementById('finalTotalInput');
    let total = totalElement ? totalElement.value : '0';

    // بناء الرسالة الكاملة للواتس
    let messageText = `*طلب جديد من الموقع* 📦\n\n`;
    messageText += `👤 *بيانات العميل:*\n`;
    messageText += `• الاسم: ${name}\n`;
    messageText += `• موبايل 1: ${phone1}\n`;
    messageText += `• موبايل 2: ${phone2}\n`;
    messageText += `• العنوان: ${address}\n`;
    messageText += `• المحافظة: ${city}\n\n`;
    messageText += `🛒 *المنتجات:*\n${productsMsg}\n\n`;
    messageText += `🚚 *الشحن:* ${shippingCost} ج.م\n`;
    messageText += `💰 *الإجمالي المطلوب:* ${total} ج.م`;

    // إنشاء رابط واتس أب للإرسال
    let whatsappUrl = `https://wa.me/201553110124?text=${encodeURIComponent(messageText)}`;

    // حساب الربح لهذا الطلب
    let currentProfit = parseFloat(document.getElementById('summaryProfit').innerText) || 0;
    
    // إضافة الربح للمحفظة (إذا كانت الدالة موجودة)
    if (typeof addProfitToWallet === 'function') {
        addProfitToWallet(currentProfit, Math.floor(Math.random() * 10000));
    }

    // فتح واتس أب في نافذة جديدة
    window.open(whatsappUrl, '_blank');

    // تسجيل المبيعات اليومية
    // تجميع بيانات المنتجات لكل منتج
    const itemGroups = cart.reduce((acc, item) => {
        if (!acc[item.id]) {
            acc[item.id] = { id: item.id, title: item.title, qty: 0, revenue: 0, profit: 0 };
        }
        acc[item.id].qty += 1;  // إضافة كمية
        acc[item.id].revenue += parseFloat(item.userSellingPrice || 0);  // إضافة الإيراد
        acc[item.id].profit += parseFloat(item.userSellingPrice || 0) - parseFloat(item.price || 0);  // إضافة الربح
        return acc;
    }, {});

    // إضافة الطلب للإحصائيات اليومية
    addOrderToDailySummary({
        date: new Date().toLocaleDateString('ar-EG'),
        total: parseFloat(total) || 0,
        profit: currentProfit,
        items: cart.length,
        itemsDetails: Object.values(itemGroups)  // تفاصيل كل منتج
    });

    // تحديث عرض ملخص المبيعات اليومية
    renderDailySalesSummary();
}

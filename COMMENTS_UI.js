/**
 * =====================================================
 * وحدة الواجهة (UI Rendering) - ui.js
 * =====================================================
 * هذا الملف يتعامل مع عرض المنتجات:
 * - تصفية المنتجات حسب الفئة
 * - ترتيب المنتجات (حسب الربح/المبيعات)
 * - عرض تفاصيل المنتج في موديال
 * - عرض الشارات (نجوم جديد/أكثر مبيعاً)
 */

/**
 * دالة: عرض قائمة المنتجات
 * هذه الدالة تقوم بـ:
 * 1. جلب قيمة التصفية (الفئة المختارة)
 * 2. جلب قيمة الترتيب (ترتيب حسب ماذا؟)
 * 3. تصفية المنتجات
 * 4. ترتيبها
 * 5. عرضها في الصفحة
 */
function renderProducts() {
    // الحصول على عناصر الواجهة
    const container = document.getElementById('productsContainer');     // الحاوية الرئيسية
    const category = document.getElementById('categoryFilter').value;   // الفئة المختارة
    const sort = document.getElementById('sortFilter').value;           // نوع الترتيب

    // 1. تصفية المنتجات حسب الفئة
    let filtered = products.filter(p => {
        return category === 'all' || p.category === category;  // إذا "الكل" نعرض الكل، وإلا نعرض الفئة المختارة فقط
    });

    // 2. ترتيب المنتجات حسب الاختيار
    if (sort === 'profit_high') {
        // ترتيب من الأعلى ربح للأقل (الترتيب العكسي)
        filtered.sort((a, b) => b.profit - a.profit);  // b - a = ترتيب تنازلي
    }
    if (sort === 'profit_low') {
        // ترتيب من الأقل ربح للأعلى
        filtered.sort((a, b) => a.profit - b.profit);  // a - b = ترتيب تصاعدي
    }
    if (sort === 'bestseller') {
        // ترتيب حسب عدد المبيعات (الأكثر مبيعاً أولاً)
        filtered.sort((a, b) => b.sales - a.sales);  // b - a = ترتيب تنازلي (أكثر أولاً)
    }

    // 3. عرض عدد المنتجات المعروضة
    document.getElementById('productsCount').innerText = `عدد المنتجات: ${filtered.length}`;

    // 4. بناء HTML لكل منتج
    container.innerHTML = filtered.map(p => {
        // حساب سعر البيع المقترح = جملة + ربح + هامش إضافي
        const suggestedPrice = p.price + p.profit + 50;
        
        // تحديد الشارة (بج يحتويها المنتج)
        let badgeHtml = '';
        if (p.sales > 100) {
            // أكثر من 100 مبيعة = "الأكثر مبيعاً"
            badgeHtml = `<div class="card-badge badge-orange">الأكثر مبيعاً</div>`;
        } else if (p.id > 4) {
            // معرف أكبر من 4 = "وصل حديثاً" (منتجات جديدة)
            badgeHtml = `<div class="card-badge badge-red">وصل حديثاً</div>`;
        }

        // بناء بطاقة المنتج الكاملة
        return `
        <div class="col-12 col-md-6 col-lg-3">
            <div class="product-card">
                <!-- الشارة (إن وُجدت) -->
                ${badgeHtml}
                
                <!-- صورة المنتج -->
                <img src="${p.image}" 
                     class="card-img-top" 
                     onclick="showProductDetails(${p.id})"
                     alt="${p.title}"
                     title="اضغط لرؤية التفاصيل">
                
                <div class="card-body">
                    <!-- اسم المنتج -->
                    <h3 class="product-title" title="${p.title}">${p.title}</h3>
                    
                    <!-- أسعار البيع -->
                    <div class="price-details">
                        <!-- السعر الجملة (التكلفة) -->
                        <div class="price-row">
                            <span>سعر الجملة (عليك):</span>
                            <span class="fw-bold text-dark">${p.price} ج.م</span>
                        </div>
                        
                        <!-- السعر المقترح (مع شطب) -->
                        <div class="price-row">
                            <span>سعر البيع المقترح:</span>
                            <span class="price-strike">${suggestedPrice} ج.م</span>
                        </div>
                    </div>
                    
                    <!-- الربح المتوقع -->
                    <div class="profit-row">
                        <span class="profit-label">صافي ربحك المتوقع:</span>
                        <span class="profit-value">
                            ${p.profit} ج.م
                            <i class="fa-solid fa-money-bill-wave text-warning ms-1"></i>
                        </span>
                    </div>
                    
                    <!-- الأزرار -->
                    <div class="card-actions">
                        <!-- زر الإضافة للسلة -->
                        <button class="btn btn-primary btn-sm w-100 mb-2" onclick="addToCart(${p.id}, this)">
                            <i class="fa-solid fa-cart-plus"></i> أضف للسلة
                        </button>
                        
                        <!-- زر التفاصيل -->
                        <button class="btn btn-outline-secondary btn-sm w-100" onclick="showProductDetails(${p.id})">
                            <i class="fa-solid fa-eye"></i> التفاصيل
                        </button>
                    </div>
                </div>
            </div>
        </div>
        `;
    }).join('');  // دمج كل بطاقات المنتجات في نص HTML واحد
}

/**
 * دالة: عرض تفاصيل المنتج في موديال
 * استخدام: showProductDetails(101)
 * - id: معرف المنتج المراد عرض تفاصيله
 */
function showProductDetails(id) {
    // البحث عن المنتج
    const product = products.find(p => p.id === id);
    if (!product) return;  // إذا ما حجناه، خروج

    // حساب السعر المقترح
    const suggestedPrice = product.price + product.profit + 50;

    // بناء محتوى الموديال
    const modalContent = `
        <div class="modal-header">
            <h5 class="modal-title fw-bold">${product.title}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
            <!-- صورة كبيرة للمنتج -->
            <img src="${product.image}" class="img-fluid mb-3 rounded" style="max-height: 300px; object-fit: cover;">
            
            <!-- وصف المنتج -->
            <p class="text-muted mb-3">${product.desc}</p>
            
            <!-- الأسعار -->
            <div class="price-table">
                <div class="price-row mb-2">
                    <strong>سعر الجملة (تكلفتك):</strong>
                    <span class="badge bg-danger">${product.price} ج.م</span>
                </div>
                <div class="price-row mb-2">
                    <strong>السعر المقترح للبيع:</strong>
                    <span class="badge bg-info">${suggestedPrice} ج.م</span>
                </div>
                <div class="price-row mb-2">
                    <strong>الربح المتوقع:</strong>
                    <span class="badge bg-success">${product.profit} ج.م</span>
                </div>
            </div>
            
            <!-- إحصائيات المبيعات -->
            <div class="alert alert-success mt-3">
                <strong>📊 إحصائيات:</strong><br>
                عدد المبيعات الكلية: <strong>${product.sales}</strong> وحدة
            </div>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">إغلاق</button>
            <button type="button" class="btn btn-primary" onclick="addToCart(${product.id}, this); bootstrap.Modal.getInstance(document.getElementById('productModal')).hide();">
                <i class="fa-solid fa-cart-plus"></i> أضف للسلة
            </button>
            <button type="button" class="btn btn-outline-primary" onclick="downloadProductResources(${product.id})">
                <i class="fa-solid fa-download"></i> تحميل الصورة
            </button>
        </div>
    `;

    // تحديث محتوى الموديال
    document.getElementById('productModalContent').innerHTML = modalContent;
    
    // فتح الموديال
    new bootstrap.Modal(document.getElementById('productModal')).show();
}

/**
 * دالة: تحميل صورة المنتج
 * استخدام: downloadProductResources(101)
 * - id: معرف المنتج
 */
function downloadProductResources(id) {
    // البحث عن المنتج
    const product = products.find(p => p.id === id);
    if (!product || !product.image) {
        alert('لا توجد موارد للتحميل');
        return;
    }

    // إنشاء عنصر تحميل مؤقت
    const link = document.createElement('a');
    link.href = product.image;          // رابط الصورة
    link.target = '_blank';             // فتح في تبويب جديد
    link.download = `${product.title}.jpg`;  // اسم الملف
    
    // إضافة للصفحة، ضغط، ثم حذف
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

/**
 * =====================================================
 * شرح ملف التصميم - COMMENTS_STYLE.css
 * =====================================================
 *
 * هذا الملف يحتوي على كل الأنماط والتصميم (CSS)
 * بدل ما تفتح الملف الأصلي، هذا يشرح الأساسيات فقط
 *
 * ===================================================
 * المتغيرات الأساسية (CSS Variables)
 * ===================================================
 *
 * :root {
 *     --primary: #2D1B69;      ← البنفسجي (الرئيسي)
 *     --accent: #136b3c;       ← الأخضر (التأكيد)
 *     --bg-body: #f8f9fa;      ← الرمادي الفاتح (الخلفية)
 * }
 * 
 * الاستخدام:
 * color: var(--primary);  ← سيعطي البنفسجي
 * background: var(--accent);  ← سيعطي الأخضر
 *
 * ===================================================
 * الـ NAVBAR (الشريط العلوي)
 * ===================================================
 *
 * .navbar {
 *     background: var(--primary);      ← خلفية بنفسجية
 *     color: white;                    ← نص أبيض
 *     position: fixed;                 ← يبقى في الأعلى عند التمرير
 *     top: 0;
 *     width: 100%;
 *     height: 60px;                    ← ارتفاع 60 بكسل
 *     z-index: 1000;                   ← يعلو فوق كل العناصر
 *     display: flex;
 *     align-items: center;
 * }
 *
 * استخدام:
 * - عرض الشعار والأيقونات
 * - الأيقونات = buttons صغيرة
 * - الشعار = brand name
 *
 * ===================================================
 * بطاقات المنتجات (.product-card)
 * ===================================================
 *
 * .product-card {
 *     border: 1px solid #e0e0e0;      ← حد خفيف
 *     border-radius: 12px;            ← زوايا مستديرة
 *     padding: 15px;
 *     box-shadow: 0 2px 8px rgba(...) ← ظل خفيف
 *     transition: all 0.3s ease;      ← حركة سلسة عند التبديل
 *     cursor: pointer;                ← تغيير المؤشر
 * }
 *
 * .product-card:hover {
 *     box-shadow: 0 8px 16px rgba(...) ← ظل أقوى عند الهوفر
 *     transform: translateY(-2px);    ← رفع البطاقة قليلاً
 * }
 *
 * الأجزاء الداخلية:
 * - img: صورة المنتج 200px
 * - h3: اسم المنتج (bold)
 * - .price-row: صف السعر
 * - .profit-row: صف الربح (أخضر)
 * - button: أزرار الإجراءات
 *
 * ===================================================
 * عرض الأسعار
 * ===================================================
 *
 * .price-details {
 *     border-top: 1px solid #eee;
 *     padding-top: 10px;
 *     margin-top: 10px;
 * }
 *
 * .price-row {
 *     display: flex;
 *     justify-content: space-between;  ← السعر في اليمين
 *     margin-bottom: 5px;
 *     font-size: 14px;
 * }
 *
 * .price-strike {
 *     text-decoration: line-through; ← خط في الوسط
 *     color: #ccc;                  ← لون فاتح (كأنه ملغى)
 * }
 *
 * .profit-row {
 *     background: rgba(0, 208, 132, 0.1);  ← خلفية أخضر فاتح
 *     color: var(--accent);                ← نص أخضر
 *     padding: 5px;
 *     border-radius: 4px;
 *     font-weight: bold;
 *     margin-top: 5px;
 * }
 *
 * ===================================================
 * الشارات (Badges)
 * ===================================================
 *
 * .card-badge {
 *     position: absolute;           ← موضع مطلق (في الزاوية)
 *     top: 10px;
 *     right: 10px;
 *     padding: 5px 10px;
 *     border-radius: 20px;         ← دائري
 *     font-size: 12px;
 *     font-weight: bold;
 * }
 *
 * .badge-orange {
 *     background: #FF9500;          ← برتقالي
 *     color: white;
 * }
 *
 * .badge-red {
 *     background: #FF5722;          ← أحمر
 *     color: white;
 * }
 *
 * ===================================================
 * الموديالس (Popups)
 * ===================================================
 *
 * .modal {
 *     display: none;                ← مخفي افتراضياً
 *     position: fixed;              ← موضع ثابت على الشاشة
 *     z-index: 1050;                ← فوق الـ navbar
 *     left: 0; top: 0;
 *     width: 100%; height: 100%;
 *     background: rgba(0,0,0,0.5);  ← خلفية شفافة سوداء
 * }
 *
 * .modal-dialog {
 *     background: white;            ← ودي البطاقة البيضاء
 *     border-radius: 8px;
 *     box-shadow: 0 3px 9px rgba(...);
 *     max-width: 600px;             ← عرض أقصى
 *     margin: 10% auto;             ← توسيط
 * }
 *
 * .modal-header {
 *     border-bottom: 1px solid #e0e0e0;
 *     padding: 15px;
 * }
 *
 * .modal-body {
 *     padding: 20px;
 *     max-height: 500px;            ← scroll إذا طويل
 *     overflow-y: auto;
 * }
 *
 * .modal-footer {
 *     border-top: 1px solid #e0e0e0;
 *     padding: 15px;
 *     display: flex;
 *     gap: 10px;
 * }
 *
 * ===================================================
 * الجداول (Tables)
 * ===================================================
 *
 * .table {
 *     border-collapse: collapse;     ← حدود موحدة
 *     width: 100%;
 * }
 *
 * .table-striped tbody tr:nth-child(even) {
 *     background: #f9f9f9;           ← صفوف بألوان متناوبة
 * }
 *
 * .table-hover tbody tr:hover {
 *     background: #f0f0f0;           ← إضاءة عند الهوفر
 * }
 *
 * .table th {
 *     background: var(--primary);    ← رأس الجدول بنفسجي
 *     color: white;
 *     padding: 10px;
 * }
 *
 * .table td {
 *     padding: 10px;
 *     border: 1px solid #e0e0e0;
 * }
 *
 * ===================================================
 * الأزرار (Buttons)
 * ===================================================
 *
 * .btn {
 *     padding: 10px 20px;
 *     border: none;
 *     border-radius: 6px;
 *     cursor: pointer;
 *     font-weight: bold;
 *     transition: all 0.3s;
 * }
 *
 * .btn-primary {
 *     background: var(--primary);    ← بنفسجي
 *     color: white;
 * }
 *
 * .btn-primary:hover {
 *     background: #1d1245;           ← بنفسجي أغمق
 *     transform: translateY(-2px);   ← رفع قليلاً
 * }
 *
 * .btn-outline-secondary {
 *     background: transparent;       ← شفاف (حواف فقط)
 *     border: 2px solid #ccc;
 *     color: #333;
 * }
 *
 * .btn-outline-secondary:hover {
 *     background: #e0e0e0;
 * }
 *
 * ===================================================
 * حقول الإدخال (Input Fields)
 * ===================================================
 *
 * input, textarea, select {
 *     width: 100%;
 *     padding: 10px;
 *     border: 1px solid #ddd;
 *     border-radius: 4px;
 *     font-size: 14px;
 *     font-family: inherit;          ← نفس الخط الأساسي
 * }
 *
 * input:focus, textarea:focus {
 *     outline: none;                 ← لا تظهر حد أزرق افتراضي
 *     border-color: var(--primary);  ← حد بنفسجي عند التركيز
 *     box-shadow: 0 0 4px rgba(...); ← ظل خفيف
 * }
 *
 * ===================================================
 * الألوان والخلفيات
 * ===================================================
 *
 * .bg-light {
 *     background: #f8f9fa;           ← رمادي فاتح
 * }
 *
 * .bg-danger {
 *     background: #dc3545;           ← أحمر (خطأ)
 * }
 *
 * .bg-success {
 *     background: #28a745;           ← أخضر (نجاح)
 * }
 *
 * .text-success {
 *     color: #28a745;                ← نص أخضر
 * }
 *
 * .text-danger {
 *     color: #dc3545;                ← نص أحمر
 * }
 *
 * .text-muted {
 *     color: #6c757d;                ← نص رمادي (خفي)
 * }
 *
 * ===================================================
 * التخطيط والشبكات (Grid)
 * ===================================================
 *
 * Bootstrap نظام شبكة 12 عمود:
 *
 * .row {
 *     display: flex;
 *     flex-wrap: wrap;               ← انتقال للسطر التالي
 *     gap: 15px;                     ← مسافة بين العناصر
 * }
 *
 * .col-12 {
 *     width: 100%;                   ← عمود واحد كامل
 * }
 *
 * .col-md-6 {
 *     width: 50%;                    ← عمودين على الشاشات الكبيرة
 * }
 *
 * .col-lg-3 {
 *     width: 25%;                    ← أربع عمود على الشاشات الكبيرة جداً
 * }
 *
 * المستجيبة (Responsive):
 * - موبايل: 320px - عرض واحد كامل
 * - تابلت: 768px - عمودين
 * - لاب توب: 1024px - أربعة
 *
 * ===================================================
 * التأثيرات والحركات (Animations)
 * ===================================================
 *
 * transition: all 0.3s ease; ← دوام 0.3 ثانية
 *
 * السلاسة:
 * - ease: بطء في البداية والنهاية
 * - ease-in: بطء في البداية
 * - ease-out: بطء في النهاية
 * - linear: خطي بدون تغيير
 *
 * ===================================================
 * الـ RTL (اليمين لليسار)
 * ===================================================
 *
 * dir="rtl"  ← في HTML
 *
 * التأثيرات:
 * - جميع العناصر معكوسة
 * - الشرائط الجانبية على اليسار
 * - الأيقونات والأسهم معكوسة
 * - النص من اليمين براً اليسار
 *
 * في CSS:
 * margin-right → margin-start (شامل)
 * margin-left → margin-end (شامل)
 *
 * ===================================================
 * خط الاستعلام (Media Queries)
 * ===================================================
 *
 * @media (max-width: 768px) {
 *     /* تعديلات للأجهزة الصغيرة */
 *     .navbar { height: 50px; }
 *     .product-card {
 *         padding: 10px;
 *     }
 * }
 *
 * ===================================================
 */

// هذا ملف توثيق فقط - اقرأ assets/css/style.css للكود الفعلي

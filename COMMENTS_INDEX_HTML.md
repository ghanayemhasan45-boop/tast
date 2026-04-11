/**
 * =====================================================
 * شرح ملف HTML الرئيسي - COMMENTS_INDEX.html
 * =====================================================
 *
 * هذه وثيقة توثيقية تشرح هيكل الصفحة (HTML)
 * افتح index.html لرؤية الكود الفعلي
 *
 * ===================================================
 * الرأس (Head - البيانات التعريفية)
 * ===================================================
 *
 * <!DOCTYPE html>              ← تعريف النوع (HTML5)
 * <html lang="ar" dir="rtl">   ← لغة عربية، من اليمين لليسار
 *
 * <head>
 *     <meta charset="UTF-8">  ← ترميز النصوص العربية
 *     <meta viewport>         ← تعديل حجم الصفحة للموبايل
 *     <title>مكسب برو</title>  ← عنوان الموقع (في تبويب المتصفح)
 *
 *     <!-- أوراق الأنماط (CSS) -->
 *     <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.rtl.min.css">
 *     └─ Bootstrap 5.3 (مكتبة أنماط) - نسخة RTL للعربية
 *
 *     <link href="https://fonts.googleapis.com/css2?family=Cairo...">
 *     └─ خط Cairo من Google Fonts (خط يدعم العربية)
 *
 *     <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
 *     └─ Font Awesome (مكتبة الأيقونات)
 *
 *     <link rel="stylesheet" href="assets/css/style.css">
 *     └─ ملف الأنماط الخاص بنا
 * </head>
 *
 * ===================================================
 * الجسم (Body - المحتوى الظاهري)
 * ===================================================
 *
 * هيكل الصفحة:
 *
 * <body>
 *     ├─ 1️⃣ NAVBAR
 *     │   ├─ الشعار (Logo)
 *     │   ├─ أيقونة المحفظة (Wallet)
 *     │   ├─ أيقونة السلة (Cart)
 *     │   ├─ أيقونة التقارير (Reports)
 *     │   └─ زر تسجيل الدخول / الملف الشخصي
 *     │
 *     ├─ 2️⃣ الملف الشخصي (Profile Sidebar)
 *     │   ├─ بيانات المستخدم
 *     │   ├─ نموذج تعديل البيانات
 *     │   └─ نموذج السحب من المحفظة
 *     │
 *     ├─ 3️⃣ HERO SECTION
 *     │   ├─ عنوان ترحيبي
 *     │   ├─ حقل تصفية الفئة (Filter)
 *     │   ├─ حقل الترتيب (Sort)
 *     │   └─ عرض ملخص المبيعات اليومية
 *     │
 *     ├─ 4️⃣ شبكة المنتجات (Products Grid)
 *     │   └─ بطاقات المنتجات 4 عمود
 *     │       ├─ صورة
 *     │       ├─ الاسم والأسعار
 *     │       ├─ الربح
 *     │       └─ الأزرار
 *     │
 *     ├─ 5️⃣ الموديالس (النوافذ المنبثقة)
 *     │   ├─ تسجيل الدخول (Login Modal)
 *     │   ├─ السلة (Cart Modal)
 *     │   ├─ المحفظة (Wallet Modal)
 *     │   ├─ تفاصيل المنتج (Product Details Modal)
 *     │   └─ التقارير (Reports Modal)
 *     │
 *     └─ 6️⃣ FOOTER
 *         └─ معلومات وروابط التواصل
 *
 * ===================================================
 * الـ NAVBAR (الشريط العلوي)
 * ===================================================
 * 
 * <nav class="navbar navbar-expand-lg fixed-top">
 *     └─ fixed-top: يبقى في الأعلى عند التمرير
 * 
 * محتويات الـ Navbar:
 * 
 * - الشعار
 *   <a class="navbar-brand">مكسب <span>برو</span></a>
 *   └─ اسم الموقع (الكلمة الثانية بلون مختلف)
 * 
 * - الأيقونات (Icons)
 *   <div class="nav-icon-btn position-relative">
 *       <i class="fa-solid fa-wallet"></i>  ← أيقونة محفظة
 *       <span id="walletNotif">500 ج.م</span>  ← عرض الرصيد
 *   </div>
 * 
 *   أيقونة السلة:
 *   <span class="badge-counter" id="cartCount">0</span>
 *       └─ عرض عدد المنتجات في السلة
 * 
 *   أيقونة التقارير:
 *   <i class="fa-solid fa-chart-bar"></i>
 *       └─ فتح التقارير عند الضغط
 * 
 * - التسجيل
 *   <div id="authSection">
 *       <button id="loginBtn">تسجيل الدخول</button>  ← ظاهر قبل التسجيل
 *       <button id="profileBtn">حسابي</button>      ← مخفي قبل التسجيل
 *   </div>
 *
 * ===================================================
 * الملف الشخصي (Profile Sidebar)
 * ===================================================
 *
 * <div class="offcanvas offcanvas-end" id="profileSidebar">
 *     └─ offcanvas-end: شريط جانبي من اليسار (عشان RTL)
 *
 * الأجزاء:
 * 
 * 1. رأس البيانات
 *    <div class="offcanvas-header">
 *        <h5>الملف الشخصي</h5>
 *        <button class="btn-close">×</button>  ← زر الإغلاق
 *    </div>
 * 
 * 2. نموذج البيانات
 *    <form id="profileForm">
 *        - حقل الاسم: <input id="profileName">
 *        - حقل المحافظة: <select id="profileCity">
 *        - زر الحفظ: <button onclick="saveProfile()">
 *    </form>
 * 
 * 3. نموذج السحب
 *    <div id="withdrawForm">
 *        - المبلغ: <input id="withdrawAmount">
 *        - البنك: <input id="bankName">
 *        - الحساب: <input id="accountNo">
 *        - زر السحب: <button onclick="confirmWithdraw()">
 *    </div>
 * 
 * 4. سجل المحفظة
 *    <div id="walletHistoryContainer">
 *        └─ يُملأ ديناميكياً من JavaScript
 *
 * ===================================================
 * قسم HERO
 * ===================================================
 * 
 * <section class="hero-section">
 *     ├─ العنوان: "اختر المنتجات والعمل معنا"
 *     ├─ التصفية (Filter):
 *     │  <select id="categoryFilter">
 *     │      <option value="all">الكل</option>
 *     │      <option value="ساعات">ساعات</option>
 *     │      <option value="سماعات">سماعات</option>
 *     │      <option value="شواحن">شواحن</option>
 *     │      <option value="باور">باور</option>
 *     │  </select>
 *     │  └─ عند تغيير القيمة: renderProducts() ينادي
 *     │
 *     ├─ الترتيب (Sort):
 *     │  <select id="sortFilter">
 *     │      <option value="profit_high">الربح الأعلى أولاً</option>
 *     │      <option value="profit_low">الربح الأقل أولاً</option>
 *     │      <option value="bestseller">الأكثر مبيعاً</option>
 *     │  </select>
 *     │  └─ عند التغيير: ترتيب المنتجات
 *     │
 *     └─ ملخص المبيعات اليومية:
 *        <div id="dailySalesSummary">
 *            └─ يُملأ ديناميكياً: عدد الطلبات، أرباح اليوم، أفضل المنتجات
 *
 * ===================================================
 * شبكة المنتجات (Products Grid)
 * ===================================================
 * 
 * <div class="container">
 *     <div class="row" id="productsContainer">
 *         └─ كل بطاقة:
 *         <div class="col-12 col-md-6 col-lg-3">
 *             <div class="product-card">
 *                 ├─ شارة (Badge): "جديد" أو "الأكثر مبيعاً"
 *                 ├─ صورة: <img onclick="showProductDetails(id)">
 *                 ├─ الاسم: <h3 class="product-title">
 *                 ├─ الأسعار:
 *                 │   - سعر الجملة: "سعر الجملة (عليك): 350 ج.م"
 *                 │   - سعر البيع: "سعر البيع المقترح: 500 ج.م" (مع خط)
 *                 ├─ الربح: "+100 ج.م 💰" (بلون أخضر)
 *                 └─ الأزرار:
 *                     - أضف للسلة: <button onclick="addToCart(id, this)">
 *                     - التفاصيل: <button onclick="showProductDetails(id)">
 *
 * ===================================================
 * الموديالز (النوافذ المنبثقة)
 * ===================================================
 * 
 * كل موديال يتبع نفس الهيكل:
 * 
 * <div class="modal fade" id="XXXModal">
 *     <div class="modal-dialog">
 *         <div class="modal-content" id="XXXModalContent">
 *             ├─ modal-header: الرأس (العنوان + زر الإغلاق)
 *             ├─ modal-body: المحتوى الرئيسي
 *             └─ modal-footer: الأزرار (إغلاق، تأكيد)
 *         </div>
 *     </div>
 * </div>
 * 
 * ===================================================
 * موديال تسجيل الدخول (Login Modal)
 * ===================================================
 * 
 * <div class="modal fade" id="loginModal">
 *     النموذج يحتوي على:
 *     ├─ حقل الاسم: <input id="userName" placeholder="الاسم كامل">
 *     ├─ حقل الإيميل: <input id="userEmail" type="email">
 *     ├─ حقل المحافظة: <select id="userCity">
 *     ├─ زر التسجيل: <button onclick="validateAndLogin()">
 *     └─ زر جوجل: <button id="googleLoginBtn" onclick="simulateGoogleLogin()">
 *
 * ===================================================
 * موديال السلة (Cart Modal)
 * ===================================================
 * 
 * <div class="modal fade" id="cartModal">
 *     ├─ العنوان: "سلة الطلبات"
 *     ├─ قائمة المنتجات: <div id="cartItemsContainer">
 *     │   └─ كل منتج:
 *     │       - صورة
 *     │       - الاسم
 *     │       - سعر الجملة
 *     │       - حقل تعديل سعر البيع
 *     │       - زر الحذف
 *     │
 *     ├─ الملخص:
 *     │   <table>
 *     │       - إجمالي الجملة: <span id="summaryWholesale">
 *     │       - الشحن: <span id="summaryShipping">
 *     │       - الإجمالي: <input id="finalTotalInput">
 *     │       - الربح: <span id="summaryProfit">
 *     │   </table>
 *     │
 *     ├─ بيانات العميل:
 *     │   - الاسم: <input id="custName">
 *     │   - الموبايل: <input id="custPhone1">
 *     │   - موبايل 2: <input id="custPhone2">
 *     │   - العنوان: <input id="custAddress">
 *     │   - المحافظة: <select id="custCity" onchange="updateTotal()">
 *     │
 *     └─ أزرار الإجراء:
 *         - إغلاق
 *         - إرسال للواتس: <button onclick="sendOrderToWhatsapp()">
 *
 * ===================================================
 * موديال المحفظة (Wallet Modal)
 * ===================================================
 * 
 * <div class="modal fade" id="walletModal">
 *     ├─ الرصيد: <span id="walletBalance">500 ج.م</span>
 *     ├─ السجل التاريخي: <div id="walletHistoryContainer">
 *     │   └─ كل عملية:
 *     │       - نوع العملية (أيقونة)
 *     │       - الوصف (طلب #1234)
 *     │       - التاريخ والوقت
 *     │       - المبلغ (بالون أخضر/أحمر)
 *     │
 *     └─ نموذج السحب:
 *         - المبلغ: <input id="withdrawAmount">
 *         - اسم البنك: <input id="bankName">
 *         - رقم الحساب: <input id="accountNo">
 *         - زر السحب: <button onclick="confirmWithdraw()">
 *
 * ===================================================
 * موديال تفاصيل المنتج (Product Details Modal)
 * ===================================================
 * 
 * <div class="modal fade" id="productModal">
 *     <div id="productModalContent">
 *         ├─ الصورة الكبيرة: <img style="max-height: 300px">
 *         ├─ الوصف: <p>وصف المنتج...</p>
 *         ├─ جدول الأسعار:
 *         │   - سعر الجملة
 *         │   - السعر المقترح
 *         │   - الربح المتوقع
 *         ├─ الإحصائيات: "عدد المبيعات: 520"
 *         └─ الأزرار:
 *             - إغلاق
 *             - أضف للسلة
 *             - تحميل الصورة
 *
 * ===================================================
 * موديال التقارير (Reports Modal)
 * ===================================================
 * 
 * <div class="modal fade" id="reportModal">
 *     <div id="reportModalContent">
 *         ├─ جدول شامل:
 *         │   <table class="table table-striped">
 *         │       ├─ رأس الجدول (أسود):
 *         │       │   - المنتج
 *         │       │   - الكمية المباعة
 *         │       │   - عدد الطلبات
 *         │       │   - إجمالي الإيراد
 *         │       │   - إجمالي الربح
 *         │       ├─ صفوف المنتجات (مرتبة من الأعلى إيراد)
 *         │       └─ صف الإجماليات (أصفر فاتح)
 *         ├─ ملخص الأداء:
 *         │   - إجمالي الطلبات
 *         │   - إجمالي الكمية
 *         │   - متوسط الإيراد
 *         │   - متوسط الربح
 *         └─ أزرار:
 *             - إغلاق
 *             - تحميل CSV
 *
 * ===================================================
 * الـ FOOTER (التذييل)
 * ===================================================
 * 
 * <footer>
 *     ├─ معلومات الموقع:
 *     │   <p>مكسب برو</p>
 *     │   <p>منصة الدروب شيبينج الكاملة</p>
 *     │
 *     └─ روابط التواصل (Icons):
 *         - فيسبوك: <a href="https://www.facebook.com/...">
 *         - واتس أب: <a href="https://wa.me/01553110124">
 *         - الدعم: <a href="https://www.facebook.com/messages/...">
 *
 * ===================================================
 * الملفات المرفقة (Scripts)
 * ===================================================
 * 
 * <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
 * └─ مكتبة Bootstrap (للموديالز والحركات)
 * 
 * <script src="assets/js/data.js"></script>
 * └─ بيانات المنتجات
 * 
 * <script src="assets/js/modules/utils.js"></script>
 * └─ الدوال المساعدة (تحميل أولاً)
 * 
 * <script src="assets/js/modules/ui.js"></script>
 * └─ دوال عرض المنتجات
 * 
 * <script src="assets/js/modules/cart.js"></script>
 * └─ منطق السلة
 * 
 * <script src="assets/js/modules/auth.js"></script>
 * └─ تسجيل الدخول
 * 
 * <script src="assets/js/modules/wallet.js"></script>
 * └─ المحفظة
 * 
 * <script src="assets/js/modules/sales.js"></script>
 * └─ المبيعات اليومية
 * 
 * <script src="assets/js/reports.js"></script>
 * └─ التقارير
 * 
 * <script src="assets/js/main.js"></script>
 * └─ التهيئة (ينادي renderProducts، إلخ)
 *
 * ===================================================
 */

// هذا ملف توثيق - افتح index.html للكود الفعلي

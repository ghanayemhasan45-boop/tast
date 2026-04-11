/**
 * =====================================================
 * وحدة المصادقة (Authentication) - auth.js
 * =====================================================
 * هذا الملف يتعامل مع تسجيل الدخول والخروج:
 * - تسجيل دخول مستخدم جديد
 * - محاكاة تسجيل الدخول عبر جوجل
 * - حفظ إلغاء تسجيل الدخول
 * - تحديث الواجهة عند تسجيل الدخول
 */

// ============================================
// حالة المستخدم - هل مسجل دخول أم لا؟
// ============================================
let isLoggedIn = false;      // هل المستخدم مسجل دخول؟
let currentUser = null;      // معلومات المستخدم الحالي (الاسم، الإيميل، المحافظة)

/**
 * دالة: تحديث الواجهة بعد تسجيل الدخول
 * هذه الدالة تقوم بـ:
 * 1. أخذ بيانات المستخدم من نماذج التسجيل
 * 2. حفظها في المتغير currentUser
 * 3. تغيير واجهة الموقع (إخفاء زر تسجيل دخول، إظهار اسم المستخدم)
 * 4. إغلاق نافذة تسجيل الدخول
 */
function updateUIAfterLogin() {
    // الحصول على بيانات المستخدم من نماذج الإدخال
    const name = document.getElementById('userName').value;
    const email = document.getElementById('userEmail').value;
    const city = document.getElementById('userCity').value;

    // حفظ البيانات في المتغير العام
    currentUser = { name, email, city };
    isLoggedIn = true;  // تحديث حالة تسجيل الدخول

    // تحديث الواجهة
    document.getElementById('nameInNav').innerText = name.split(' ')[0];  // عرض الاسم الأول في الأعلى
    document.getElementById('loginBtn').style.display = 'none';            // إخفاء زر تسجيل الدخول
    document.getElementById('profileBtn').style.display = 'inline-block';  // إظهار زر الملف الشخصي

    // إغلاق نافذة تسجيل الدخول
    const bsModal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
    if (bsModal) bsModal.hide();

    // تمسيح نماذج الإدخال لحذف البيانات المكتوبة
    document.getElementById('loginModal').querySelectorAll('input').forEach(inp => inp.value = '');
}

/**
 * دالة: التحقق من بيانات التسجيل والدخول
 * هذه الدالة تقوم بـ:
 * 1. التحقق من أن جميع الحقول مملوءة
 * 2. التحقق من صيغة الإيميل
 * 3. استدعاء تحديث الواجهة
 */
function validateAndLogin() {
    // الحصول على نماذج الإدخال
    const nameInput = document.getElementById('userName');
    const emailInput = document.getElementById('userEmail');
    const cityInput = document.getElementById('userCity');

    // التحقق من أن جميع الحقول ممتلئة
    if (!nameInput.value.trim() || !emailInput.value.trim() || !cityInput.value) {
        alert('برجاء ملء البيانات');
        return;
    }

    // التحقق من أن الإيميل يحتوي على رمز @ 
    if (!emailInput.value.includes('@')) {
        alert('البريد غير صحيح');
        return;
    }

    // إذا كل البيانات صحيحة، تمدير الواجهة
    updateUIAfterLogin();
}

/**
 * دالة: محاكاة تسجيل الدخول عبر جوجل
 * هذه الدالة:
 * 1. تعطل الزر وتعرض "جاري..."
 * 2. تنتظر ثانية ونصف (محاكاة إرسال البيانات)
 * 3. تملأ نموذج التسجيل ببيانات وهمية
 * 4. تسجل الدخول تلقائياً
 */
function simulateGoogleLogin() {
    const btnGoogle = document.getElementById('googleLoginBtn');
    if (!btnGoogle) return;

    // حفظ النص الأصلي وتعطيل الزر
    const original = btnGoogle.innerHTML;
    btnGoogle.disabled = true;
    btnGoogle.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>جاري...';

    // محاكاة التأخير (كأننا في انتظار الاتصال برسيفر)
    setTimeout(() => {
        btnGoogle.disabled = false;
        btnGoogle.innerHTML = original;

        // بيانات وهمية (محاكاة بيانات من حساب جوجل)
        const mockUser = { name: 'أحمد السيد', email: 'ahmed@gmail.com', city: 'cairo' };
        document.getElementById('userName').value = mockUser.name;
        document.getElementById('userEmail').value = mockUser.email;
        document.getElementById('userCity').value = mockUser.city;

        // تسجيل الدخول تلقائياً
        updateUIAfterLogin();
    }, 1500);  // الانتظار ثانية ونصف
}

/**
 * دالة: حفظ بيانات الملف الشخصي
 * إذا المستخدم غير معلومات ملفه الشخصي:
 * 1. التحقق من أنه مسجل دخول
 * 2. أخذ البيانات المحدثة
 * 3. تحديث المتغير currentUser
 * 4. تحديث الواجهة
 * 5. إغلاق نافذة التحرير
 */
function saveProfile() {
    // التحقق من أن المستخدم مسجل دخول
    if (!isLoggedIn) {
        alert('برجاء تسجيل الدخول أولاً');
        return;
    }

    // الحصول على البيانات المحدثة
    const name = document.getElementById('profileName').value || 'المستخدم';
    const city = document.getElementById('profileCity').value;

    // التحقق من أن البيانات كاملة
    if (!name || !city) {
        alert('برجاء ملء البيانات');
        return;
    }

    // تحديث بيانات المستخدم
    currentUser = { ...currentUser, name, city };  // دمج البيانات القديمة مع الجديدة
    
    // تحديث الاسم في الأعلى
    document.getElementById('nameInNav').innerText = name.split(' ')[0];

    // إغلاق نافذة التحرير
    const sideBar = bootstrap.Offcanvas.getInstance(document.getElementById('profileSidebar'));
    if (sideBar) sideBar.hide();

    alert('تم حفظ البيانات بنجاح');
}

/**
 * دالة: تسجيل الخروج
 * المستخدم يضغط "خروج" فنقوم بـ:
 * 1. مسح بيانات المستخدم
 * 2. تغيير حالة تسجيل الدخول
 * 3. إرجاع الواجهة للحالة الأولى
 * 4. تحديث النافذة لتنظيف كل البيانات
 */
function logout() {
    // مسح بيانات المستخدم
    isLoggedIn = false;
    currentUser = null;

    // إرجاع الواجهة للحالة الأولى
    document.getElementById('loginBtn').style.display = 'inline-block';    // إظهار الزر للتسجيل مجدداً
    document.getElementById('profileBtn').style.display = 'none';          // إخفاء زر الملف الشخصي
    document.getElementById('nameInNav').innerText = 'حسابي';              // إرجاع النص الأصلي

    // إغلاق نافذة الملف الشخصي
    const sideBar = bootstrap.Offcanvas.getInstance(document.getElementById('profileSidebar'));
    if (sideBar) sideBar.hide();

    // إعادة تحميل الصفحة لمسح جميع الحالة المؤقتة
    location.reload();
}

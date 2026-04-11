// --- Global User State ---
let isLoggedIn = false;
let currentUser = null;

/**
 * دالة: معالجة رد جوجل (تسجيل دخول حقيقي)
 * تُستدعى تلقائياً عند الضغط على زر Google Sign-In
 * response: يحتوي على JWT token من جوجل
 */
function handleCredentialResponse(response) {
    try {
        // JWT Token من جوجل
        const credential = response.credential;
        
        // فك التشفير (Decode) لاستخراج بيانات المستخدم
        const decodedToken = decodeJwt(credential);
        
        if (!decodedToken) {
            alert('خطأ في التحقق من بيانات جوجل');
            return;
        }
        
        // استخراج البيانات من الـ token
        currentUser = {
            name: decodedToken.name || 'مستخدم',
            email: decodedToken.email || '',
            picture: decodedToken.picture || '',
            city: 'cairo'  // قيمة افتراضية
        };
        
        isLoggedIn = true;
        
        // تحديث الواجهة
        document.getElementById('nameInNav').innerText = currentUser.name.split(' ')[0];
        document.getElementById('loginBtn').style.display = 'none';
        document.getElementById('profileBtn').style.display = 'inline-block';
        
        // إغلاق الموديال
        const loginModal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
        if (loginModal) loginModal.hide();
        
        // إظهار رسالة ترحيب
        alert(`مرحباً ${currentUser.name.split(' ')[0]} 👋\nتم تسجيل دخولك من جوجل بنجاح`);
    } catch (error) {
        console.error('خطأ في تسجيل الدخول:', error);
        alert('حدث خطأ في تسجيل الدخول');
    }
}

/**
 * دالة: فك تشفير JWT Token من جوجل
 * JWT = JSON Web Token (نص مشفر بثلاثة أجزاء مفصولة بـ .)
 * الجزء الثاني يحتوي على البيانات
 */
function decodeJwt(token) {
    try {
        // تقسيم الـ token إلى ثلاثة أجزاء
        const base64Url = token.split('.')[1];
        
        // تحويل من base64url إلى base64 عادي
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        
        // فك التشفير
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        
        // تحويل لـ JavaScript object
        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error('خطأ في فك التشفير:', error);
        return null;
    }
}

/**
 * دالة: معالجة تسجيل الدخول البسيط
 */
function handleSimpleLogin() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    if (!email || !password) {
        alert('برجاء إدخال البريد وكلمة المرور');
        return;
    }
    
    if (!email.includes('@')) {
        alert('البريد غير صحيح');
        return;
    }
    
    if (password.length < 3) {
        alert('كلمة المرور قصيرة جداً');
        return;
    }
    
    // حفظ بيانات المستخدم
    const name = email.split('@')[0];
    currentUser = {
        name: name.charAt(0).toUpperCase() + name.slice(1),
        email: email,
        city: 'cairo'
    };
    
    isLoggedIn = true;
    updateUIAfterLogin();
}

/**
 * دالة: تحديث الواجهة بعد تسجيل الدخول
 */
function updateUIAfterLogin() {
    isLoggedIn = true;

    document.getElementById('nameInNav').innerText = currentUser.name.split(' ')[0];
    document.getElementById('loginBtn').style.display = 'none';
    document.getElementById('profileBtn').style.display = 'inline-block';

    const bsModal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
    if (bsModal) bsModal.hide();

    // مسح الحقول
    const inputs = document.getElementById('loginModal')?.querySelectorAll('input');
    if (inputs) inputs.forEach(inp => inp.value = '');
}

/**
 * دالة: التحقق من بيانات إنشاء حساب جديد
 */
function validateAndLogin() {
    const nameInput = document.getElementById('newUserName');
    const emailInput = document.getElementById('newUserEmail');

    if (!nameInput.value.trim() || !emailInput.value.trim()) {
        alert('برجاء ملء الاسم والبريد');
        return;
    }

    if (!emailInput.value.includes('@')) {
        alert('البريد غير صحيح');
        return;
    }

    currentUser = {
        name: nameInput.value,
        email: emailInput.value,
        city: 'cairo'
    };
    
    updateUIAfterLogin();
}

/**
 * دالة: حفظ بيانات الملف الشخصي
 */
function saveProfile() {
    if (!isLoggedIn) {
        alert('برجاء تسجيل الدخول أولاً');
        return;
    }

    const name = document.getElementById('profileName').value || 'المستخدم';
    const city = document.getElementById('profileCity').value;

    if (!name || !city) {
        alert('برجاء ملء البيانات');
        return;
    }

    currentUser = { ...currentUser, name, city };
    document.getElementById('nameInNav').innerText = name.split(' ')[0];

    const sideBar = bootstrap.Offcanvas.getInstance(document.getElementById('profileSidebar'));
    if (sideBar) sideBar.hide();

    alert('تم حفظ البيانات بنجاح');
}

/**
 * دالة: تسجيل الخروج
 */
function logout() {
    isLoggedIn = false;
    currentUser = null;

    document.getElementById('loginBtn').style.display = 'inline-block';
    document.getElementById('profileBtn').style.display = 'none';
    document.getElementById('nameInNav').innerText = 'حسابي';

    const sideBar = bootstrap.Offcanvas.getInstance(document.getElementById('profileSidebar'));
    if (sideBar) sideBar.hide();

    location.reload();
}

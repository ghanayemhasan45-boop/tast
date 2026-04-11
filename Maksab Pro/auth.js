// assets/js/modules/auth.js

// 1. استيراد دوال Firebase الأساسية
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.x.x/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from "https://www.gstatic.com/firebasejs/10.x.x/firebase-auth.js";

// 2. إعدادات مشروعك من Firebase (استبدل هذه القيم ببيانات مشروعك الحقيقية من ملف FIREBASE_SETUP.md)
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// 3. تهيئة Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// 4. ربط زر جوجل
const googleLoginBtn = document.getElementById('google-login-btn');

if (googleLoginBtn) {
    googleLoginBtn.addEventListener('click', () => {
        // إضافة تأثير التحميل للزر
        const originalText = googleLoginBtn.innerHTML;
        googleLoginBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span> جاري الاتصال...';

        signInWithPopup(auth, provider)
            .then((result) => {
                const user = result.user;
                console.log("تم تسجيل الدخول بنجاح:", user.displayName);
                
                // استدعاء دالة تحديث الواجهة بعد الدخول
                handleLoginSuccess(user.displayName, user.email);
                
                // إرجاع شكل الزر
                googleLoginBtn.innerHTML = originalText;
            })
            .catch((error) => {
                console.error("خطأ في تسجيل الدخول:", error);
                googleLoginBtn.innerHTML = originalText;
                
                if (error.code === 'auth/unauthorized-domain') {
                    alert("عذراً! النطاق (Domain) الحالي غير مصرح به.\nيرجى إضافة (localhost أو 127.0.0.1) في إعدادات Firebase -> Authentication -> Settings -> Authorized domains");
                } else {
                    alert("حدث خطأ أثناء تسجيل الدخول: " + error.message);
                }
            });
    });
}

// 5. دالة تحديث الواجهة بعد نجاح الدخول (مربوطة بـ window لتعمل بشكل صحيح مع الـ module)
window.handleLoginSuccess = function(userName, userEmail) {
    // إغلاق نافذة التسجيل
    const loginModalEl = document.getElementById('loginModal');
    if(loginModalEl) {
        const modalInstance = bootstrap.Modal.getInstance(loginModalEl) || new bootstrap.Modal(loginModalEl);
        modalInstance.hide();
    }

    // تحديث زر الـ Header ليظهر الاسم بدلاً من "تسجيل الدخول"
    const authSection = document.getElementById('authSection');
    if(authSection) {
        authSection.innerHTML = `
            <button class="btn btn-primary btn-sm px-3 rounded-pill fw-bold" data-bs-toggle="offcanvas" data-bs-target="#profileSidebar">
                <i class="fa-solid fa-user me-1"></i> ${userName.split(' ')[0]}
            </button>
        `;
    }

    // تحديث بيانات الملف الشخصي (الـ Sidebar)
    const profileName = document.getElementById('profileName');
    const profileEmail = document.getElementById('profileEmail');
    
    if(profileName) profileName.value = userName;
    if(profileEmail) profileEmail.value = userEmail;
};

// 6. دالة تسجيل الخروج (مربوطة بزر الخروج في الـ Sidebar)
window.logout = function() {
    signOut(auth).then(() => {
        console.log("تم تسجيل الخروج");
        // إعادة الواجهة لشكلها الأصلي
        const authSection = document.getElementById('authSection');
        if(authSection) {
            authSection.innerHTML = `
                <button class="btn btn-outline-light btn-sm" data-bs-toggle="modal" data-bs-target="#loginModal">تسجيل الدخول</button>
            `;
        }
        // إغلاق الـ Sidebar
        const sidebarEl = document.getElementById('profileSidebar');
        if(sidebarEl) {
            const sidebarInstance = bootstrap.Offcanvas.getInstance(sidebarEl);
            if(sidebarInstance) sidebarInstance.hide();
        }
    }).catch((error) => {
        console.error("خطأ في تسجيل الخروج:", error);
    });
};
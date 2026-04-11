// assets/js/modules/auth.js

/// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-analytics.js";
import { getAuth, signInWithPopup, signOut, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDDOfl6AlQQHTH_UZD-GQv6mninKHZKtgY",
  authDomain: "makasab-pro.firebaseapp.com",
  projectId: "makasab-pro",
  storageBucket: "makasab-pro.firebasestorage.app",
  messagingSenderId: "1056068624133",
  appId: "1:1056068624133:web:ad9e417d207b8fd2fda16c",
  measurementId: "G-ZE4YJ931FS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
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
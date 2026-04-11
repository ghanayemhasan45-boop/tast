// استيراد الدوال المطلوبة من Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.x.x/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.x.x/firebase-auth.js";

// إعدادات Firebase من ملف FIREBASE_SETUP.md (يجب استبدالها ببيانات مشروعك الحقيقية)
const firebaseConfig = {
    apiKey: "YOUR_API_KEY", // ضع المفتاح هنا
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com", // ضع النطاق هنا
    projectId: "YOUR_PROJECT_ID", // ضع معرف المشروع هنا
    storageBucket: "YOUR_PROJECT_ID.appspot.com", // ضع bucket التخزين هنا
    messagingSenderId: "YOUR_SENDER_ID", // ضع معرف المرسل هنا
    appId: "YOUR_APP_ID" // ضع معرف التطبيق هنا
};

// تهيئة تطبيق Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const googleLoginBtn = document.getElementById('google-login-btn');

// التأكد من وجود الزر قبل إضافة الحدث لتجنب الأخطاء
if (googleLoginBtn) {
    googleLoginBtn.addEventListener('click', () => {
        signInWithPopup(auth, provider)
        .then((result) => {
            const user = result.user;
            console.log("Success:", user.displayName);
            // التوجيه لصفحة المتجر بعد التسجيل
            window.location.href = "index.html"; 
        }).catch((error) => {
            console.error("Error:", error.message);
        });
    });
}
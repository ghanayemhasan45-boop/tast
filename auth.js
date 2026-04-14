import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-analytics.js";
import {
  getAuth,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  GoogleAuthProvider,
  sendPasswordResetEmail,
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
  addDoc,
  query,
  where,
  getDocs,
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDDOfl6AlQQHTH_UZD-GQv6mninKHZKtgY",
  authDomain: "makasab-pro.firebaseapp.com",
  projectId: "makasab-pro",
  storageBucket: "makasab-pro.firebasestorage.app",
  messagingSenderId: "1056068624133",
  appId: "1:1056068624133:web:ad9e417d207b8fd2fda16c",
  measurementId: "G-ZE4YJ931FS",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore();
const provider = new GoogleAuthProvider();
const ADMIN_EMAILS = ["admin@makasabpro.com", "ghanayemhasan45@gmail.com"];
const CURRENT_USER_KEY = "currentUser";

window.auth = auth;
window.db = db;
window.ADMIN_EMAILS = ADMIN_EMAILS;
window.firestoreHelpers = {
  collection,
  doc,
  setDoc,
  getDoc,
  addDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
};

const googleLoginBtn = document.getElementById("google-login-btn");
if (googleLoginBtn) {
  googleLoginBtn.addEventListener("click", async () => {
    const originalText = googleLoginBtn.innerHTML;
    googleLoginBtn.innerHTML =
      '<span class="spinner-border spinner-border-sm me-2"></span> جاري تسجيل الدخول...';
    googleLoginBtn.disabled = true;

    try {
      const result = await signInWithPopup(auth, provider);
      await handleLoginSuccess(result.user);
    } catch (error) {
      console.error("خطأ في تسجيل الدخول عبر جوجل:", error);
      if (error.code === "auth/unauthorized-domain") {
        alert("النطاق غير مصرح له في إعدادات Firebase.");
      } else {
        alert("حدث خطأ أثناء تسجيل الدخول عبر جوجل: " + error.message);
      }
    } finally {
      googleLoginBtn.innerHTML = originalText;
      googleLoginBtn.disabled = false;
    }
  });
}

async function saveUserRecord(user) {
  if (!user?.email) return;
  try {
    const userRef = doc(db, "Users", user.email);
    await setDoc(
      userRef,
      {
        email: user.email,
        name: user.displayName || "مستخدم غير معروف",
        photoURL: user.photoURL || "",
        isAdmin: ADMIN_EMAILS.includes(user.email),
        lastLogin: serverTimestamp(),
      },
      { merge: true },
    );
  } catch (error) {
    console.error("خطأ في حفظ بيانات المستخدم إلى Firestore:", error);
  }
}

window.handleLoginSuccess = async function (user) {
  if (!user) return;

  currentUser = {
    name: user.displayName || "مستخدم غير معروف",
    email: user.email,
    photoURL: user.photoURL || "",
    isAdmin: ADMIN_EMAILS.includes(user.email),
  };
  window.currentUser = currentUser;
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(currentUser));

  await saveUserRecord(user);

  const authSection = document.getElementById("authSection");
  if (authSection) {
    authSection.innerHTML = `
      <button class="btn btn-primary btn-sm px-3 rounded-pill fw-bold" data-bs-toggle="offcanvas" data-bs-target="#profileSidebar">
        <i class="fa-solid fa-user me-1"></i> ${currentUser.name.split(" ")[0]}
      </button>
    `;
  }

  const profileName = document.getElementById("profileName");
  const profileEmail = document.getElementById("profileEmail");
  if (profileName) profileName.value = currentUser.name;
  if (profileEmail) profileEmail.value = currentUser.email;

  const adminLink = document.getElementById("adminPanelLink");
  if (adminLink) {
    adminLink.classList.toggle("d-none", !currentUser.isAdmin);
  }

  const marketerPanel = document.getElementById("marketerDashboard");
  if (marketerPanel) {
    marketerPanel.classList.toggle(
      "d-none",
      currentUser.isAdmin || !currentUser.email,
    );
  }

  if (typeof renderMarketerDashboard === "function") renderMarketerDashboard();
  if (typeof checkCustomerOrderNotifications === "function")
    checkCustomerOrderNotifications();
};

window.forgotPassword = function () {
  const emailInput = document.getElementById("loginEmail");
  const email = emailInput?.value.trim();

  if (!email) {
    if (emailInput) emailInput.focus();
    alert("يرجى إدخال البريد الإلكتروني لاستعادة كلمة المرور.");
    return;
  }

  sendPasswordResetEmail(auth, email)
    .then(() => {
      alert("تم إرسال رسالة إعادة تعيين كلمة المرور إلى بريدك الإلكتروني.");
    })
    .catch((error) => {
      console.error("خطأ أثناء إرسال رسالة إعادة التعيين:", error);
      alert("حدث خطأ: " + error.message);
    });
};

window.logout = function () {
  signOut(auth)
    .then(() => {
      localStorage.removeItem(CURRENT_USER_KEY);
      currentUser = null;
      window.currentUser = null;
      document.getElementById("adminPanelLink")?.classList.add("d-none");

      const authSection = document.getElementById("authSection");
      if (authSection) {
        authSection.innerHTML = `<a class="btn btn-outline-light btn-sm" href="login.html">تسجيل الدخول</a>`;
      }

      const marketerPanel = document.getElementById("marketerDashboard");
      if (marketerPanel) marketerPanel.classList.add("d-none");

      const sidebarEl = document.getElementById("profileSidebar");
      const sidebarInstance = bootstrap.Offcanvas.getInstance(sidebarEl);
      if (sidebarInstance) sidebarInstance.hide();
    })
    .catch((error) => {
      console.error("خطأ أثناء تسجيل الخروج:", error);
    });
};

onAuthStateChanged(auth, async (user) => {
  if (user) {
    await handleLoginSuccess(user);
  }
});
// التأكد من استيراد دالة addDoc (لو مش موجودة فوق، هتشتغل من السطر ده)
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// دالة إرسال الطلب (Global عشان زرار الـ HTML يشوفها)
window.submitOrder = async function() {
    console.log("تم الضغط على زر الإرسال!");

    // 1. التأكد من تسجيل الدخول
    if (!auth || !auth.currentUser) {
        alert("عذراً، يجب تسجيل الدخول أولاً حتى يتم إرسال الطلب باسمك.");
        return;
    }

    // 2. جلب بيانات العميل من الفورم
    const name = document.getElementById("custName").value.trim();
    const phone1 = document.getElementById("custPhone1").value.trim();
    const address = document.getElementById("custAddress").value.trim();
    const city = document.getElementById("custCity").value;

    if (!name || !phone1 || !address || !city) {
        alert("يرجى ملء جميع البيانات الأساسية (الاسم، الهاتف، العنوان، المحافظة).");
        return;
    }

    // 3. التأكد إن السلة مش فاضية (بنقرا متغير cart من ملف functions)
    if (typeof cart === 'undefined' || cart.length === 0) {
        alert("السلة فارغة! قم بإضافة منتجات أولاً.");
        return;
    }

    // 4. جلب الإجمالي والربح
    const total = parseFloat(document.getElementById("finalTotalInput").value) || 0;
    const profit = parseFloat(document.getElementById("summaryProfit").innerText) || 0;

    // 5. تغيير شكل الزرار عشان العميل يعرف إنه بيحمل
    const btn = document.querySelector(".whatsapp-btn");
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> جاري الإرسال...';
    btn.disabled = true;

    try {
        const db = getFirestore();
        
        // 6. إرسال الطلب لقاعدة البيانات
        const docRef = await addDoc(collection(db, "Orders"), {
            marketerEmail: auth.currentUser.email,
            customer: { name, phone1, address, city },
            items: cart, // المنتجات اللي اختارها
            total: total,
            profit: profit,
            status: "pending", // حالة الطلب: قيد الانتظار
            createdAt: new Date() // وقت الطلب
        });

        // 7. اللي هيحصل بعد النجاح
        cart.length = 0; // تفريغ السلة
        if (typeof updateCartUI === 'function') updateCartUI(); // تحديث شكل السلة

        // قفل نافذة السلة
        const modalEl = document.getElementById("cartModal");
        const modal = bootstrap.Modal.getInstance(modalEl);
        if (modal) modal.hide();

        // إظهار رسالة النجاح
        alert("🎉 تم إرسال الطلب بنجاح للوحة الإدارة! \nرقم طلبك: #" + docRef.id.slice(-5).toUpperCase());

    } catch (error) {
        console.error("خطأ في الإرسال:", error);
        alert("حدث خطأ أثناء الإرسال. تأكد من اتصال الإنترنت أو إعدادات Firebase.");
    } finally {
        // إرجاع الزرار لشكله الطبيعي
        btn.innerHTML = originalText;
        btn.disabled = false;
    }
};
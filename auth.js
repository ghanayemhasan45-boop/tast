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
  appId: "1:1056068624133:web:320877f32e2a8ec8fda16c",
  measurementId: "G-SBC317XT7S",
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

window.submitOrder = async function() {
    console.log("1. بدأنا تنفيذ الطلب...");

    // 1. استخدام window لضمان قراءة المستخدم من النظام القديم
    if (!window.currentUser || !window.currentUser.email) {
        alert("عذراً، يجب تسجيل الدخول أولاً حتى يتم إرسال الطلب باسمك.");
        return;
    }
    console.log("2. المستخدم مسجل دخول بإيميل:", window.currentUser.email);

    const name = document.getElementById("custName").value.trim();
    const phone1 = document.getElementById("custPhone1").value.trim();
    const address = document.getElementById("custAddress").value.trim();
    const city = document.getElementById("custCity").value;

    if (!name || !phone1 || !address || !city) {
        alert("يرجى ملء جميع البيانات الأساسية (الاسم، الهاتف، العنوان، المحافظة).");
        return;
    }

    // 2. استخدام window لضمان قراءة محتوى السلة
    if (!window.cart || window.cart.length === 0) {
        alert("السلة فارغة! قم بإضافة منتجات أولاً.");
        return;
    }
    console.log("3. البيانات جاهزة، عدد المنتجات في السلة:", window.cart.length);

    const total = parseFloat(document.getElementById("finalTotalInput").value) || 0;
    const profit = parseFloat(document.getElementById("summaryProfit").innerText) || 0;

    const btn = document.querySelector(".whatsapp-btn");
    const originalText = btn ? btn.innerHTML : "الطلب الآن";
    if(btn) {
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin me-2"></i> جاري الإرسال...';
        btn.disabled = true;
    }

    try {
        console.log("4. جاري الاتصال بـ Firebase...");
        const db = getFirestore();
        
        // إرسال الطلب
        const docRef = await addDoc(collection(db, "Orders"), {
            marketerEmail: window.currentUser.email,
            customer: { name, phone1, address, city },
            items: window.cart,
            total: total,
            profit: profit,
            status: "pending", 
            createdAt: new Date()
        });

        console.log("5. تم الإرسال بنجاح! رقم الطلب في الداتا بيز:", docRef.id);

        window.cart.length = 0; // تفريغ السلة
        if (typeof window.updateCartUI === 'function') window.updateCartUI(); 

        const modalEl = document.getElementById("cartModal");
        if(modalEl){
            const modal = bootstrap.Modal.getInstance(modalEl);
            if (modal) modal.hide();
        }

        alert("🎉 تم إرسال الطلب بنجاح للوحة الإدارة! \nرقم طلبك: #" + docRef.id.slice(-5).toUpperCase());

    } catch (error) {
        console.error("6. ❌ خطأ كارثي في الإرسال:", error);
        alert("حدث خطأ أثناء الإرسال. تأكد من اتصال الإنترنت وإعدادات Firebase.");
    } finally {
        if(btn) {
            btn.innerHTML = originalText;
            btn.disabled = false;
        }
        console.log("7. انتهت العملية بالكامل.");
    }
};

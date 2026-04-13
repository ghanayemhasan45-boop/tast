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
const db = getFirestore(app);
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
  serverTimestamp,
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

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, doc, setDoc, getDoc, serverTimestamp, addDoc, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged, signInWithPopup, signOut, GoogleAuthProvider, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyDDOfl6AlQQHTH_UZD-GQv6mninKHZKtgY",
    authDomain: "makasab-pro.firebaseapp.com",
    projectId: "makasab-pro",
    storageBucket: "makasab-pro.firebasestorage.app",
    messagingSenderId: "1056068624133",
    appId: "1:1056068624133:web:ad9e417d207b8fd2fda16c",
    measurementId: "G-ZE4YJ931FS"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
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

const ORDER_STORAGE_KEY = "dropshipOrders";

function loadLocalOrders() {
    const data = localStorage.getItem(ORDER_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
}

function saveLocalOrders(orders) {
    localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(orders));
}

function addLocalOrder(order) {
    const orders = loadLocalOrders();
    orders.unshift(order);
    saveLocalOrders(orders);
}

function shippingCostForCity(city) {
    if (city === "cairo") return 50;
    if (city === "giza") return 65;
    return 0;
}

window.submitOrderAuth = async function() {
    console.log("1. بدأنا تنفيذ الطلب...");

    const currentUser = window.currentUser || auth.currentUser;
    if (!currentUser || !currentUser.email) {
        alert("عذراً، يجب تسجيل الدخول أولاً.");
        return;
    }
    console.log("2. المستخدم مسجل دخول بإيميل:", currentUser.email);

    const name = document.getElementById("custName").value.trim();
    const phone1 = document.getElementById("custPhone1").value.trim();
    const address = document.getElementById("custAddress").value.trim();
    const city = document.getElementById("custCity").value;

    if (!name || !phone1 || !address || !city) {
        alert("يرجى ملء جميع البيانات الأساسية.");
        return;
    }

    const orderItems = Array.isArray(window.cart)
        ? window.cart
        : Array.isArray(cart)
            ? cart
            : [];

    if (orderItems.length === 0) {
        alert("السلة فارغة!");
        return;
    }
    console.log("3. البيانات جاهزة، عدد المنتجات في السلة:", orderItems.length);

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
        console.log("db:", db, "collection:", collection, "addDoc:", addDoc);

        if (!db || typeof collection !== "function" || typeof addDoc !== "function") {
            throw new Error("Firebase غير مهيأ بشكل صحيح. تأكد من استيراد getFirestore و collection و addDoc.");
        }

        const addDocPromise = addDoc(collection(db, "Orders"), {
            marketerEmail: currentUser.email,
            customer: { name, phone1, address, city },
            items: orderItems,
            total: total,
            profit: profit,
            status: "pending", 
            createdAt: new Date()
        });

        const timeoutPromise = new Promise((_, reject) =>
            setTimeout(
                () => reject(new Error("انتهى وقت الاتصال بـ Firebase بعد 10 ثوانٍ. تحقق من الشبكة أو إعدادات Firestore.")),
                10000,
            ),
        );

        const docRef = await Promise.race([addDocPromise, timeoutPromise]);

        console.log("5. تم الإرسال بنجاح! رقم الطلب:", docRef.id);

        const localOrder = {
            id: docRef.id,
            marketerEmail: currentUser.email,
            customer: {
                name,
                phone1,
                phone2: document.getElementById("custPhone2")?.value.trim() || "",
                address,
                city,
                email: currentUser.email,
            },
            items: orderItems,
            total,
            profit,
            shippingCost: shippingCostForCity(city),
            status: "pending",
            date: new Date().toLocaleString("ar-EG"),
        };

        try {
            if (typeof window.addOrder === "function") {
                window.addOrder(localOrder);
            } else {
                addLocalOrder(localOrder);
            }
        } catch (localError) {
            console.warn("تعذّر حفظ الطلب محلياً:", localError);
            addLocalOrder(localOrder);
        }

        window.cart.length = 0; 
        if (typeof window.updateCartUI === 'function') window.updateCartUI(); 

        const modalEl = document.getElementById("cartModal");
        if(modalEl){
            const modal = bootstrap.Modal.getInstance(modalEl);
            if (modal) modal.hide();
        }

        alert("🎉 تم إرسال الطلب بنجاح للوحة الإدارة! \nرقم طلبك: #" + docRef.id.slice(-5).toUpperCase());

    } catch (error) {
        console.error("6. ❌ خطأ في الإرسال:", error);
        alert("حدث خطأ أثناء الإرسال: " + (error.message || error));
    } finally {
        if(btn) {
            btn.innerHTML = originalText;
            btn.disabled = false;
        }
        console.log("7. انتهت العملية.");
    }
};

window.submitOrder = window.submitOrderAuth;
console.log("auth.js: submitOrderAuth is loaded and hooked");


const db = window.db || null;
const {
  collection,
  doc,
  onSnapshot,
  updateDoc,
  increment,
  arrayUnion,
  setDoc,
  getDoc,
  addDoc,
} = window.firestoreHelpers || {};
const CURRENT_USER_KEY = "currentUser";
let currentUserEmail = null;

function getStoredUserEmail() {
  const storedUser = localStorage.getItem(CURRENT_USER_KEY);
  if (!storedUser) return null;

  try {
    return JSON.parse(storedUser)?.email || null;
  } catch (error) {
    return null;
  }
}

function loadWalletNotifications() {
  const data = localStorage.getItem("walletNotifications");
  return data ? JSON.parse(data) : {};
}

function saveWalletNotifications(notifs) {
  localStorage.setItem("walletNotifications", JSON.stringify(notifs));
}

function clearWalletNotifications(email) {
  const notifs = loadWalletNotifications();
  if (!notifs[email]) return;
  delete notifs[email];
  saveWalletNotifications(notifs);
}

function renderWalletNotifications() {
  const container = document.getElementById("walletNotificationsContainer");
  if (!container) return;

  const notifications = loadWalletNotifications()[currentUserEmail] || [];
  if (!notifications.length) {
    container.innerHTML = "";
    return;
  }

  container.innerHTML = `
    <div class="alert alert-info rounded-4">
      <h6 class="mb-2">إشعارات المحفظة</h6>
      ${notifications
        .map(
          (item) => `<div class="mb-2">
              <p class="mb-1">${item.message}</p>
              <small class="text-muted">${item.date}</small>
          </div>`,
        )
        .join("")}
    </div>
  `;
  clearWalletNotifications(currentUserEmail);
}

function initWalletPage() {
  currentUserEmail = getStoredUserEmail() || window.currentUser?.email || null;
  if (!currentUserEmail) {
    resetWalletUI();
    return;
  }

  if (!db || !doc || !onSnapshot || !setDoc || !getDoc) {
    console.warn("Firebase غير مهيأ بشكل كامل في صفحة المحفظة.");
    resetWalletUI();
    return;
  }

  const walletRef = doc(db, "Wallets", currentUserEmail);

  onSnapshot(walletRef, async (docSnap) => {
    if (docSnap.exists()) {
      updateWalletUI(docSnap.data());
    } else {
      await setDoc(walletRef, {
        balance: 0,
        pending: 0,
        totalWithdrawn: 0,
        history: [],
      });
      updateWalletUI({
        balance: 0,
        pending: 0,
        totalWithdrawn: 0,
        history: [],
      });
    }
    renderWalletNotifications();
  });
}

window.addEventListener("DOMContentLoaded", initWalletPage);

function updateWalletUI(data) {
  const balanceEl = document.getElementById("current-balance");
  const pendingEl = document.getElementById("pending-profit");
  const withdrawnEl = document.getElementById("total-withdrawn");
  const historyContainer = document.getElementById("transactionList");

  if (!balanceEl || !pendingEl || !withdrawnEl || !historyContainer) return;

  balanceEl.innerText = (data.balance || 0).toFixed(2) + " ج.م";
  pendingEl.innerText = (data.pending || 0).toFixed(2) + " ج.م";
  withdrawnEl.innerText = (data.totalWithdrawn || 0).toFixed(2) + " ج.م";

  if (data.history && data.history.length > 0) {
    historyContainer.innerHTML = data.history
      .slice()
      .reverse()
      .map(
        (item) => `
            <div class="d-flex justify-content-between align-items-center border-bottom py-2">
                <div>
                    <p class="mb-0 fw-bold ${item.type === "withdraw" ? "text-danger" : "text-success"}">${item.desc}</p>
                    <small class="text-muted">${item.date}</small>
                </div>
                <p class="mb-0 fw-bold">${parseFloat(item.amount || 0).toFixed(2)} ج.م</p>
            </div>
        `,
      )
      .join("");
  } else {
    historyContainer.innerHTML =
      '<p class="text-center opacity-50 py-3 mb-0">لا توجد معاملات بعد</p>';
  }
}

function resetWalletUI() {
  const balanceEl = document.getElementById("current-balance");
  const pendingEl = document.getElementById("pending-profit");
  const withdrawnEl = document.getElementById("total-withdrawn");
  const historyContainer = document.getElementById("transactionList");

  if (balanceEl) balanceEl.innerText = "0.00 ج.م";
  if (pendingEl) pendingEl.innerText = "0.00 ج.م";
  if (withdrawnEl) withdrawnEl.innerText = "0.00 ج.م";
  if (historyContainer)
    historyContainer.innerHTML =
      '<p class="text-center opacity-50 py-3 mb-0">سجّل دخولك أولاً لعرض المحفظة.</p>';
}

window.toggleWithdrawForm = function () {
  const form = document.getElementById("withdrawForm");
  if (form) form.classList.toggle("d-none");
};

window.confirmWithdraw = async function () {
  if (!currentUserEmail) {
    showAppMessage("يرجى تسجيل الدخول أولاً لطلب السحب.", "info");
    return;
  }

  const amount = parseFloat(document.getElementById("withdrawAmount").value);
  const method = document.getElementById("withdrawMethod").value;
  const number = document.getElementById("withdrawNumber").value.trim();

  if (!amount || !number || amount < 50) {
    showAppMessage("يرجى إدخال بيانات صحيحة (الحد الأدنى للسحب 50 ج.م)", "info");
    return;
  }

  const walletRef = doc(db, "Wallets", currentUserEmail);
  const docSnap = await getDoc(walletRef);

  if (docSnap.exists() && docSnap.data().balance >= amount) {
    const dateStr = new Date().toLocaleString("ar-EG");
    const methodName = method === "vodafone" ? "فودافون كاش" : "انستا باي";

    await updateDoc(walletRef, {
      balance: increment(-amount),
      pending: increment(amount),
      history: arrayUnion({
        type: "withdraw",
        amount,
        desc: `طلب سحب جاري - سيتم التحويل بعد 24 ساعة (${methodName} - ${number})`,
        date: dateStr,
        status: "pending",
      }),
    });

    if (db && collection && addDoc) {
      try {
        await addDoc(collection(db, "WithdrawRequests"), {
          marketerEmail: currentUserEmail,
          amount,
          method: methodName,
          number,
          status: "pending",
          requestedAt: new Date(),
          walletEmail: currentUserEmail,
        });
      } catch (error) {
        console.error("خطأ في حفظ طلب السحب في لوحة الإدارة:", error);
      }
    }

    showAppMessage("تم إرسال طلب السحب بنجاح! سيتم التحويل بعد 24 ساعة.", "success");
    const form = document.getElementById("withdrawForm");
    if (form) form.classList.add("d-none");
    document.getElementById("withdrawAmount").value = "";
    document.getElementById("withdrawNumber").value = "";
  } else {
    showAppMessage("رصيدك الحالي لا يكفي لإتمام عملية السحب!", "error");
  }
};

// --- Wallet Helpers ---
function getWalletKey(email) {
  const safeEmail = email?.trim().toLowerCase() || "guest";
  return `dropshipWallet_${safeEmail}`;
}

function loadWallet(email) {
  const key = getWalletKey(email);
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : { balance: 0, history: [] };
}

function saveWallet(email, walletData) {
  const key = getWalletKey(email);
  localStorage.setItem(key, JSON.stringify(walletData));
}

function addProfitToWallet(amount, orderId) {
  if (!window.currentUser?.email) {
    alert("سجل دخولك أولاً حتى يتم إضافة الربح لمحفظتك.");
    return;
  }
  addProfitToUserWallet(window.currentUser.email, amount, orderId);
}

function addProfitToUserWallet(email, amount, orderId) {
  if (!email) return;
  amount = parseFloat(amount) || 0;
  const walletData = loadWallet(email);
  walletData.balance = parseFloat(walletData.balance || 0) + amount;
  walletData.history = walletData.history || [];
  walletData.history.unshift({
    type: "income",
    amount: amount,
    desc: `ربح طلب #${orderId}`,
    date: new Date().toLocaleDateString("ar-EG"),
    time: new Date().toLocaleTimeString("ar-EG"),
  });
  saveWallet(email, walletData);
  if (window.currentUser?.email === email) {
    updateWalletUI();
  }
}

function updateWalletUI() {
  const balanceEl = document.getElementById("walletBalance");
  const historyContainer = document.getElementById("transactionList");
  const walletDot = document.getElementById("walletNotif");

  if (!window.currentUser?.email) {
    if (balanceEl) balanceEl.innerText = "0";
    if (walletDot) walletDot.classList.add("d-none");
    if (historyContainer) {
      historyContainer.innerHTML = `
                <div class="text-center text-muted py-4">
                    <p>سجل دخولك أولاً لعرض المحفظة وعملياتك.</p>
                </div>
            `;
    }
    return;
  }

  const walletData = loadWallet(window.currentUser.email);
  if (balanceEl)
    balanceEl.innerText = parseFloat(walletData.balance || 0).toFixed(2);

  if (walletDot) {
    walletDot.classList.toggle(
      "d-none",
      parseFloat(walletData.balance || 0) <= 0,
    );
  }

  if (historyContainer) {
    if (!walletData.history || walletData.history.length === 0) {
      historyContainer.innerHTML =
        '<p class="text-center text-muted">لا توجد معاملات بعد</p>';
    } else {
      historyContainer.innerHTML = walletData.history
        .slice()
        .map((h) => {
          const icon =
            h.type === "income"
              ? '<i class="fa-solid fa-plus text-success"></i>'
              : '<i class="fa-solid fa-minus text-danger"></i>';
          const color = h.type === "income" ? "text-success" : "text-danger";
          return `
                        <div class="d-flex justify-content-between align-items-center mb-3 p-3 bg-light rounded-4 shadow-sm">
                            <div>
                                <div>${icon} <span class="fw-bold">${h.desc}</span></div>
                                <div class="text-muted small">${h.date} - ${h.time}</div>
                            </div>
                            <div class="fw-bold ${color}">${h.type === "income" ? "+" : "-"} ${parseFloat(h.amount || 0).toFixed(2)} ج.م</div>
                        </div>
                    `;
        })
        .join("");
    }
  }
}

function toggleWithdrawForm() {
  const form = document.getElementById("withdrawForm");
  if (!form) return;
  form.classList.toggle("d-none");
}

function confirmWithdraw() {
  if (!window.currentUser?.email) {
    alert("سجل دخولك أولاً لطلب السحب.");
    return;
  }

  const amount =
    parseFloat(document.getElementById("withdrawAmount").value) || 0;
  const bankName =
    document.getElementById("withdrawMethod").options[
      document.getElementById("withdrawMethod").selectedIndex
    ].text;
  const accountNo = document.getElementById("withdrawNumber").value;

  const walletData = loadWallet(window.currentUser.email);

  if (amount <= 0) {
    alert("المبلغ يجب أن يكون أكبر من 0");
    return;
  }

  if (walletData.balance < amount) {
    alert("الرصيد غير كافي");
    return;
  }

  if (!accountNo) {
    alert("برجاء ملء رقم المحفظة أو الحساب");
    return;
  }

  walletData.balance -= amount;
  walletData.history.unshift({
    type: "withdrawal",
    amount: amount,
    desc: `سحب (${bankName})`,
    date: new Date().toLocaleDateString("ar-EG"),
    time: new Date().toLocaleTimeString("ar-EG"),
  });

  saveWallet(currentUser.email, walletData);
  updateWalletUI();

  document.getElementById("withdrawAmount").value = "";
  document.getElementById("withdrawNumber").value = "";
  toggleWithdrawForm();
  alert("تم تقديم طلب السحب بنجاح ✓");
}

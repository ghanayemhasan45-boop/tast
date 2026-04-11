// --- Wallet State ---
let wallet = {
    balance: 0,
    history: []
};

// --- Wallet Functions ---
function addProfitToWallet(amount, orderId) {
    if (!wallet) wallet = { balance: 0, history: [] };

    amount = parseFloat(amount) || 0;
    wallet.balance += amount;

    wallet.history.push({
        type: 'income',
        amount: amount,
        desc: `طلب #${orderId}`,
        date: new Date().toLocaleDateString('ar-EG'),
        time: new Date().toLocaleTimeString('ar-EG')
    });

    localStorage.setItem('dropshipWallet', JSON.stringify(wallet));
    updateWalletUI();
}

function updateWalletUI() {
    if (!wallet) {
        wallet = JSON.parse(localStorage.getItem('dropshipWallet')) || { balance: 0, history: [] };
    }

    document.getElementById('walletNotif').innerText = wallet.balance.toFixed(2) + ' ج.م';

    const historyContainer = document.getElementById('walletHistoryContainer');
    const balanceEl = document.getElementById('walletBalance');

    if (balanceEl) balanceEl.innerText = wallet.balance.toFixed(2);

    if (historyContainer) {
        if (wallet.history.length === 0) {
            historyContainer.innerHTML = '<p class="text-center text-muted">لا توجد عمليات</p>';
        } else {
            historyContainer.innerHTML = wallet.history
                .slice()
                .reverse()
                .map(h => {
                    const icon = h.type === 'income' ? '<i class="fa-solid fa-plus text-success"></i>' : '<i class="fa-solid fa-minus text-danger"></i>';
                    const color = h.type === 'income' ? 'text-success' : 'text-danger';
                    return `
                        <div class="d-flex justify-content-between align-items-center mb-3 p-2 bg-light rounded">
                            <div>
                                <div>${icon} <span class="fw-bold">${h.desc}</span></div>
                                <small class="text-muted">${h.date} - ${h.time}</small>
                            </div>
                            <div class="fw-bold ${color}">${h.type === 'income' ? '+' : '-'} ${h.amount.toFixed(2)} ج.م</div>
                        </div>
                    `;
                }).join('');
        }
    }
}

function toggleWithdrawForm() {
    const form = document.getElementById('withdrawForm');
    if (form) form.style.display = form.style.display === 'none' ? 'block' : 'none';
}

function confirmWithdraw() {
    const amount = parseFloat(document.getElementById('withdrawAmount').value) || 0;
    const bankName = document.getElementById('bankName').value;
    const accountNo = document.getElementById('accountNo').value;

    if (amount <= 0) {
        alert('المبلغ يجب أن يكون أكبر من 0');
        return;
    }

    if (!wallet || wallet.balance < amount) {
        alert('الرصيد غير كافي');
        return;
    }

    if (!bankName || !accountNo) {
        alert('برجاء ملء بيانات البنك');
        return;
    }

    wallet.balance -= amount;
    wallet.history.push({
        type: 'withdrawal',
        amount: amount,
        desc: `سحب من ${bankName}`,
        date: new Date().toLocaleDateString('ar-EG'),
        time: new Date().toLocaleTimeString('ar-EG')
    });

    localStorage.setItem('dropshipWallet', JSON.stringify(wallet));
    updateWalletUI();

    document.getElementById('withdrawAmount').value = '';
    document.getElementById('bankName').value = '';
    document.getElementById('accountNo').value = '';
    toggleWithdrawForm();

    alert('تم تقديم طلب السحب بنجاح ✓');
}

/**
 * =====================================================
 * وحدة المحفظة (Wallet System) - wallet.js
 * =====================================================
 * نظام تتبع الأرباح والمحفظة:
 * - تسجيل الأرباح من كل طلب
 * - عرض رصيد المحفظة
 * - تسجيل عمليات السحب
 * - حفظ كل العمليات في LocalStorage
 */

// ============================================
// حالة المحفظة - الرصيد والعمليات
// ============================================
let wallet = {
    balance: 0,      // الرصيد الحالي
    history: []      // قائمة بجميع العمليات (إضافة أرباح، سحب، إلخ)
};

/**
 * دالة: إضافة الأرباح من طلب إلى المحفظة
 * استخدام: addProfitToWallet(250, 12345)
 * - amount: مبلغ الربح (الفرق بين ما اشتريتي به وما بعتيه)
 * - orderId: معرف الطلب (مرجع وتوثيق)
 */
function addProfitToWallet(amount, orderId) {
    if (!wallet) wallet = { balance: 0, history: [] };  // في حالة الحاجة لإعادة تهيئة

    amount = parseFloat(amount) || 0;  // تحويل المبلغ لرقم عشري
    wallet.balance += amount;          // إضافة للرصيد

    // تسجيل العملية في السجل التاريخي
    wallet.history.push({
        type: 'income',              // نوع العملية (إضافة أرباح)
        amount: amount,              // المبلغ
        desc: `طلب #${orderId}`,    // الوصف (رقم الطلب)
        date: new Date().toLocaleDateString('ar-EG'),   // التاريخ الحالي بصيغة عربية
        time: new Date().toLocaleTimeString('ar-EG')    // الوقت الحالي بصيغة عربية
    });

    // حفظ البيانات في LocalStorage (التخزين المحلي للتطبيق)
    localStorage.setItem('dropshipWallet', JSON.stringify(wallet));
    updateWalletUI();
}

/**
 * دالة: تحديث عرض المحفظة في الواجهة
 * هذه الدالة تقوم بـ:
 * 1. جلب بيانات المحفظة من LocalStorage
 * 2. عرض الرصيد الحالي
 * 3. عرض سجل العمليات (أحدثها أولاً)
 */
function updateWalletUI() {
    // جلب البيانات من التخزين المحلي
    if (!wallet) {
        wallet = JSON.parse(localStorage.getItem('dropshipWallet')) || { balance: 0, history: [] };
    }

    // تحديث الرصيد في أيقونة المحفظة بالأعلى
    document.getElementById('walletNotif').innerText = wallet.balance.toFixed(2) + ' ج.م';

    // الحصول على الحاوية حيث نعرض السجل
    const historyContainer = document.getElementById('walletHistoryContainer');
    const balanceEl = document.getElementById('walletBalance');

    // عرض الرصيد الكامل
    if (balanceEl) balanceEl.innerText = wallet.balance.toFixed(2);

    // عرض السجل التاريخي للعمليات
    if (historyContainer) {
        // إذا لم يكن هناك عمليات
        if (wallet.history.length === 0) {
            historyContainer.innerHTML = '<p class="text-center text-muted">لا توجد عمليات</p>';
        } else {
            // عرض العمليات من الأحدث للأقدم
            historyContainer.innerHTML = wallet.history
                .slice()      // نسخة من المصفوفة لتجنب تعديل الأصلية
                .reverse()    // عكس ترتيب العمليات (الأحدث أولاً)
                .map(h => {
                    // تحديد الأيقونة والالوان حسب نوع العملية
                    const icon = h.type === 'income' 
                        ? '<i class="fa-solid fa-plus text-success"></i>'      // أيقونة + للإضافة
                        : '<i class="fa-solid fa-minus text-danger"></i>';     // أيقونة - للطرح
                    const color = h.type === 'income' ? 'text-success' : 'text-danger';

                    // بناء عنصر HTML لكل عملية
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

/**
 * دالة: إظهار/إخفاء نموذج السحب
 * المستخدم يضغط "سحب أموال" فتظهر النموذج
 */
function toggleWithdrawForm() {
    const form = document.getElementById('withdrawForm');
    if (form) form.style.display = form.style.display === 'none' ? 'block' : 'none';
}

/**
 * دالة: معالجة طلب السحب
 * هذه الدالة تقوم بـ:
 * 1. التحقق من المبلغ المدخل
 * 2. التحقق من كفاية الرصيد
 * 3. التحقق من بيانات البنك
 * 4. طرح المبلغ من الرصيد
 * 5. تسجيل العملية في السجل
 * 6. تنظيف النموذج
 */
function confirmWithdraw() {
    // الحصول على البيانات المدخلة
    const amount = parseFloat(document.getElementById('withdrawAmount').value) || 0;
    const bankName = document.getElementById('bankName').value;
    const accountNo = document.getElementById('accountNo').value;

    // التحقق من أن المبلغ موجب
    if (amount <= 0) {
        alert('المبلغ يجب أن يكون أكبر من 0');
        return;
    }

    // التحقق من أن الرصيد كافي
    if (!wallet || wallet.balance < amount) {
        alert('الرصيد غير كافي');
        return;
    }

    // التحقق من بيانات البنك
    if (!bankName || !accountNo) {
        alert('برجاء ملء بيانات البنك');
        return;
    }

    // طرح المبلغ من الرصيد
    wallet.balance -= amount;

    // تسجيل عملية السحب في السجل
    wallet.history.push({
        type: 'withdrawal',               // نوع العملية (سحب)
        amount: amount,                   // المبلغ المسحوب
        desc: `سحب من ${bankName}`,      // الوصف (اسم البنك)
        date: new Date().toLocaleDateString('ar-EG'),   // التاريخ
        time: new Date().toLocaleTimeString('ar-EG')    // الوقت
    });

    // حفظ في LocalStorage
    localStorage.setItem('dropshipWallet', JSON.stringify(wallet));
    updateWalletUI();

    // تنظيف النموذج من البيانات
    document.getElementById('withdrawAmount').value = '';
    document.getElementById('bankName').value = '';
    document.getElementById('accountNo').value = '';
    toggleWithdrawForm();  // إخفاء النموذج

    // إبلاغ المستخدم بالنجاح
    alert('تم تقديم طلب السحب بنجاح ✓');
}

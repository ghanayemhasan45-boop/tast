// --- 8. Initialization ---
window.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    updateWalletUI();
    renderDailySalesSummary();

    const citySelect = document.getElementById('custCity');
    if (citySelect) citySelect.addEventListener('change', updateTotal);

    const finalTotalInput = document.getElementById('finalTotalInput');
    if (finalTotalInput) finalTotalInput.addEventListener('input', calculateProfitManual);

    // فتح نافذة تسجيل الدخول تلقائياً عند فتح الموقع
    if (!isLoggedIn) {
        const loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
        loginModal.show();
    }
});

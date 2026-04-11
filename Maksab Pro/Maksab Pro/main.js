// --- 8. Initialization ---
window.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    updateWalletUI();
    renderDailySalesSummary();

    const citySelect = document.getElementById('custCity');
    if (citySelect) citySelect.addEventListener('change', updateTotal);

    const finalTotalInput = document.getElementById('finalTotalInput');
    if (finalTotalInput) finalTotalInput.addEventListener('input', calculateProfitManual);
});

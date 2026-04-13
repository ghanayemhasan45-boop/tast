// --- 8. Initialization ---
window.addEventListener("DOMContentLoaded", () => {
  renderProducts();
  renderDailySalesSummary();

  const citySelect = document.getElementById("custCity");
  if (citySelect) citySelect.addEventListener("change", updateTotal);

  const finalTotalInput = document.getElementById("finalTotalInput");
  if (finalTotalInput)
    finalTotalInput.addEventListener("input", calculateProfitManual);

  // لا نفتح مودال تسجيل الدخول تلقائياً لكي لا يمنع زر المحفظة
});

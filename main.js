function getSavedTheme() {
  return localStorage.getItem("appTheme") || "light";
}

function applyTheme(theme) {
  const isDark = theme === "dark";
  document.body.classList.toggle("dark-mode", isDark);
  const toggleBtn = document.getElementById("themeToggleBtn");
  if (toggleBtn) {
    toggleBtn.innerHTML = isDark
      ? '<i class="fa-solid fa-sun"></i>'
      : '<i class="fa-solid fa-moon"></i>';
    toggleBtn.title = isDark ? "الوضع الفاتح" : "الوضع الداكن";
  }
  localStorage.setItem("appTheme", theme);
}

function toggleDarkMode() {
  const nextTheme = document.body.classList.contains("dark-mode")
    ? "light"
    : "dark";
  applyTheme(nextTheme);
}

function initTheme() {
  applyTheme(getSavedTheme());
}

function createToastContainer() {
  if (document.getElementById("appToastContainer")) return;
  const container = document.createElement("div");
  container.id = "appToastContainer";
  container.style.position = "fixed";
  container.style.top = "20px";
  container.style.right = "20px";
  container.style.zIndex = "9999";
  container.style.maxWidth = "360px";
  document.body.appendChild(container);
}

function showAppMessage(message, type = "info", timeout = 5000) {
  createToastContainer();
  const container = document.getElementById("appToastContainer");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `app-toast alert alert-${
    type === "error" ? "danger" : type === "success" ? "success" : "info"
  }`;
  toast.style.marginBottom = "10px";
  toast.style.boxShadow = "0 8px 25px rgba(0,0,0,0.15)";
  toast.innerHTML = `
    <div class="d-flex justify-content-between align-items-start gap-2">
      <div>${message}</div>
      <button type="button" class="btn-close" aria-label="Close"></button>
    </div>
  `;

  const closeBtn = toast.querySelector(".btn-close");
  closeBtn.addEventListener("click", () => {
    toast.remove();
  });

  container.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, timeout);
}

function getStoredCurrentUser() {
  const stored = localStorage.getItem("currentUser");
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

function getCustomerNotificationItems() {
  const user = getStoredCurrentUser();
  if (!user || !user.email) return [];

  const orderNotifs = JSON.parse(
    localStorage.getItem("dropshipOrderNotifications") || "{}",
  );
  const walletNotifs = JSON.parse(
    localStorage.getItem("walletNotifications") || "{}",
  );
  const userEmail = user.email;
  const userPhone = user.phone;
  const orders = JSON.parse(localStorage.getItem("dropshipOrders") || "[]");

  const items = [];
  Object.entries(orderNotifs).forEach(([orderId, notif]) => {
    const order = orders.find(
      (o) =>
        o.id === orderId &&
        (o.customer?.email === userEmail ||
          o.customer?.phone1 === userPhone ||
          o.customer?.phone2 === userPhone),
    );
    if (order) {
      items.push({
        id: orderId,
        message: notif.message,
        date: notif.date || "",
        type: "order",
      });
    }
  });

  (walletNotifs[userEmail] || []).forEach((notif) => {
    items.push({
      id: `wallet-${Math.random().toString(36).slice(2)}`,
      message: notif.message,
      date: notif.date || "",
      type: "wallet",
    });
  });

  return items.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 10);
}

function updateCustomerNotificationBadge() {
  const button = document.getElementById("customerNotificationsButton");
  const badge = document.getElementById("customerNotificationsBadge");
  const panel = document.getElementById("customerNotificationsPanel");
  const user = getStoredCurrentUser();
  const items = getCustomerNotificationItems();

  if (!button || !badge) return;
  if (!user || !user.email) {
    button.classList.add("d-none");
    badge.classList.add("d-none");
    badge.innerText = "";
    if (panel) panel.classList.add("d-none");
    return;
  }

  button.classList.remove("d-none");
  if (items.length > 0) {
    badge.classList.remove("d-none");
    badge.innerText = items.length;
  } else {
    badge.classList.add("d-none");
    badge.innerText = "";
  }
  if (panel) panel.classList.add("d-none");
}

function clearCustomerNotifications() {
  const user = getStoredCurrentUser();
  if (!user || !user.email) return;

  const orderNotifs = JSON.parse(
    localStorage.getItem("dropshipOrderNotifications") || "{}",
  );
  const orders = JSON.parse(localStorage.getItem("dropshipOrders") || "[]");

  const newOrderNotifs = {};
  Object.entries(orderNotifs).forEach(([orderId, notif]) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;
    const isUserOrder =
      order.customer?.email === user.email ||
      order.customer?.phone1 === user.phone ||
      order.customer?.phone2 === user.phone;
    if (!isUserOrder) {
      newOrderNotifs[orderId] = notif;
    }
  });

  localStorage.setItem(
    "dropshipOrderNotifications",
    JSON.stringify(newOrderNotifs),
  );
  const walletNotifs = JSON.parse(
    localStorage.getItem("walletNotifications") || "{}",
  );
  delete walletNotifs[user.email];
  localStorage.setItem("walletNotifications", JSON.stringify(walletNotifs));
}

function renderCustomerNotifications() {
  const panel = document.getElementById("customerNotificationsPanel");
  if (!panel) return;

  const items = getCustomerNotificationItems();
  if (!items.length) {
    panel.innerHTML = `
      <div class="notification-panel-card p-3 rounded-4 bg-white shadow-sm">
        <p class="mb-0">لا توجد إشعارات جديدة.</p>
      </div>
    `;
    return;
  }

  panel.innerHTML = `
    <div class="notification-panel-card p-3 rounded-4 bg-white shadow-sm">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h6 class="mb-0">إشعاراتك</h6>
        <button class="btn btn-link btn-sm" onclick="clearCustomerNotifications(); updateCustomerNotificationBadge(); renderCustomerNotifications();">مسح الكل</button>
      </div>
      ${items
        .map(
          (item) => `
        <div class="notification-item mb-3 pb-2 border-bottom">
          <div class="d-flex justify-content-between align-items-center mb-1">
            <strong>${item.type === "wallet" ? "محفظة" : "طلب"}</strong>
            <small class="text-muted">${item.date || "-"}</small>
          </div>
          <p class="mb-0">${item.message}</p>
        </div>
      `,
        )
        .join("")}
    </div>
  `;
}

function toggleCustomerNotifications() {
  const panel = document.getElementById("customerNotificationsPanel");
  if (!panel) return;
  const isHidden = panel.classList.contains("d-none");
  if (isHidden) {
    renderCustomerNotifications();
    panel.classList.remove("d-none");
  } else {
    panel.classList.add("d-none");
  }
}

window.addEventListener("storage", updateCustomerNotificationBadge);

// --- 8. Initialization ---
window.addEventListener("DOMContentLoaded", () => {
  initTheme();
  updateCustomerNotificationBadge();
  if (
    typeof renderProducts === "function" &&
    document.getElementById("productsContainer")
  ) {
    renderProducts();
  }

  const citySelect = document.getElementById("custCity");
  if (citySelect) citySelect.addEventListener("change", updateTotal);

  const finalTotalInput = document.getElementById("finalTotalInput");
  if (finalTotalInput)
    finalTotalInput.addEventListener("input", calculateProfitManual);
});

window.toggleDarkMode = toggleDarkMode;

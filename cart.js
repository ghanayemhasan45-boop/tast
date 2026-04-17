function notify(message, type = "info") {
  if (typeof showAppMessage === "function") {
    showAppMessage(message, type);
  } else {
    alert(message);
  }
}

// --- Cart State ---
let cart = [];

// --- Cart Logic ---
function addToCart(id, btnElement) {
  const p = products.find((x) => x.id === id);
  if (!p) return;

  cart.push({
    ...p,
    userSellingPrice: p.price + p.profit,
    cartId: Date.now() + Math.floor(Math.random() * 1000),
  });

  updateCartUI();

  if (btnElement && typeof btnElement.innerHTML === "string") {
    const originalText = btnElement.innerHTML;
    btnElement.innerHTML = '<i class="fa-solid fa-check"></i> تم';
    setTimeout(() => {
      btnElement.innerHTML = originalText;
    }, 1000);
  }
}

function removeFromCart(cartId) {
  cart = cart.filter((item) => item.cartId !== cartId);
  updateCartUI();
}

function updateCartItemPrice(cartId, newPrice) {
  const item = cart.find((x) => x.cartId === cartId);
  if (item) {
    item.userSellingPrice = parseFloat(newPrice) || 0;
    updateTotal();
  }
}

function updateCartUI() {
  document.getElementById("cartCount").innerText = cart.length;
  const container = document.getElementById("cartItemsContainer");

  if (cart.length === 0) {
    container.innerHTML =
      '<p class="text-center text-muted py-4">السلة فارغة</p>';
    document.getElementById("summaryWholesale").innerText = "0";
    document.getElementById("summaryProfit").innerText = "0";
    updateTotal();
    return;
  }

  container.innerHTML = cart
    .map(
      (item) => `
        <div class="d-flex gap-3 mb-3 border-bottom pb-3 align-items-center">
            <img src="${item.image}" style="width:60px; height:60px; object-fit:cover; border-radius:8px">
            <div class="flex-grow-1">
                <h6 class="mb-1 small fw-bold">${item.title}</h6>
                <div class="d-flex justify-content-between align-items-center">
                    <span class="text-muted x-small">جملة: ${item.price}</span>
                    <div class="input-group input-group-sm" style="width: 130px;">
                        <span class="input-group-text bg-light">بيع</span>
                        <input type="number" class="form-control" value="${item.userSellingPrice}" onchange="updateCartItemPrice(${item.cartId}, this.value)">
                    </div>
                </div>
            </div>
            <button class="btn btn-sm text-danger" onclick="removeFromCart(${item.cartId})">
                <i class="fa-solid fa-trash"></i>
            </button>
        </div>
    `,
    )
    .join("");

  updateTotal();
}

function updateTotal() {
  const wholesaleTotal = cart.reduce((sum, item) => sum + item.price, 0);
  const sellingTotal = cart.reduce(
    (sum, item) => sum + parseFloat(item.userSellingPrice || 0),
    0,
  );

  const city = document.getElementById("custCity").value;
  let shipping = 0;
  if (city === "cairo") shipping = 50;
  else if (city === "giza") shipping = 65;

  const autoTotal = sellingTotal + shipping;
  const profit = sellingTotal - wholesaleTotal;

  document.getElementById("summaryWholesale").innerText = wholesaleTotal;
  document.getElementById("summaryShipping").innerText = shipping;
  document.getElementById("finalTotalInput").value = autoTotal;
  document.getElementById("summaryProfit").innerText = profit + " ج.م";
}

function sendOrderToWhatsapp() {
  if (cart.length === 0) {
    notify("السلة فارغة!", "info");
    return;
  }

  const name = document.getElementById("custName").value;
  const phone1 = document.getElementById("custPhone1").value;
  const phone2 = document.getElementById("custPhone2").value;
  const address = document.getElementById("custAddress").value;
  const city = document.getElementById("custCity").value;

  if (!name || !phone1 || !address || !city) {
    notify("برجاء ملء جميع بيانات العميل الأساسية", "info");
    return;
  }

  let productsMsg = cart
    .map((item, index) => {
      return `${index + 1}. ${item.title}\n   - سعر البيع: ${item.userSellingPrice} ج.م`;
    })
    .join("\n");

  let shippingCost =
    city === "cairo" ? 50 : city === "giza" ? 65 : "يحدد لاحقاً";

  let totalElement = document.getElementById("finalTotalInput");
  let total = totalElement ? totalElement.value : "0";

  let messageText = `*طلب جديد من الموقع* 📦\n\n`;
  messageText += `👤 *بيانات العميل:*\n`;
  messageText += `• الاسم: ${name}\n`;
  messageText += `• موبايل 1: ${phone1}\n`;
  messageText += `• موبايل 2: ${phone2}\n`;
  messageText += `• العنوان: ${address}\n`;
  messageText += `• المحافظة: ${city}\n\n`;
  messageText += `🛒 *المنتجات:*\n${productsMsg}\n\n`;
  messageText += `🚚 *الشحن:* ${shippingCost} ج.م\n`;
  messageText += `💰 *الإجمالي المطلوب:* ${total} ج.م`;

  let whatsappUrl = `https://wa.me/201553110124?text=${encodeURIComponent(messageText)}`;

  window.open(whatsappUrl, "_blank");

  // سجل المبيعات اليومية
  const itemGroups = cart.reduce((acc, item) => {
    if (!acc[item.id]) {
      acc[item.id] = {
        id: item.id,
        title: item.title,
        qty: 0,
        revenue: 0,
        profit: 0,
      };
    }
    acc[item.id].qty += 1;
    acc[item.id].revenue += parseFloat(item.userSellingPrice || 0);
    acc[item.id].profit +=
      parseFloat(item.userSellingPrice || 0) - parseFloat(item.price || 0);
    return acc;
  }, {});

  addOrderToDailySummary({
    date: new Date().toLocaleDateString("ar-EG"),
    total: parseFloat(total) || 0,
    profit: currentProfit,
    items: cart.length,
    itemsDetails: Object.values(itemGroups),
  });
  renderDailySalesSummary();
}

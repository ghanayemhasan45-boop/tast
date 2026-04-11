// --- UI Rendering Functions ---

function renderProducts() {
    const container = document.getElementById('productsContainer');
    const category = document.getElementById('categoryFilter').value;
    const sort = document.getElementById('sortFilter').value;

    let filtered = products.filter(p => category === 'all' || p.category === category);

    if (sort === 'profit_high') filtered.sort((a, b) => b.profit - a.profit);
    if (sort === 'profit_low') filtered.sort((a, b) => a.profit - b.profit);
    if (sort === 'bestseller') filtered.sort((a, b) => b.sales - a.sales);

    document.getElementById('productsCount').innerText = `عدد المنتجات: ${filtered.length}`;

    container.innerHTML = filtered.map(p => {
        const suggestedPrice = p.price + p.profit + 50;
        let badgeHtml = '';
        if (p.sales > 100) badgeHtml = `<div class="card-badge badge-orange">الأكثر مبيعاً</div>`;
        else if (p.id > 4) badgeHtml = `<div class="card-badge badge-red">وصل حديثاً</div>`;

        return `
        <div class="col-12 col-md-6 col-lg-3">
            <div class="product-card">
                ${badgeHtml}
                <img src="${p.image}" class="card-img-top" onclick="showProductDetails(${p.id})" alt="${p.title}">
                <div class="card-body">
                    <h3 class="product-title" title="${p.title}">${p.title}</h3>
                    <div class="price-details">
                        <div class="price-row">
                            <span>سعر الجملة (عليك):</span>
                            <span class="fw-bold text-dark">${p.price} ج.م</span>
                        </div>
                        <div class="price-row">
                            <span>سعر البيع المقترح:</span>
                            <span class="price-strike">${suggestedPrice} ج.م</span>
                        </div>
                    </div>
                    <div class="profit-row">
                        <span class="profit-label">صافي ربحك المتوقع:</span>
                        <span class="profit-value">
                            ${p.profit} ج.م
                            <i class="fa-solid fa-money-bill-wave text-warning ms-1"></i>
                        </span>
                    </div>
                    <div class="card-actions">
                        <button class="btn-blue-solid" onclick="addToCart(${p.id}, this)">
                            <i class="fa-solid fa-cart-plus"></i>
                            إضافة لطلباتي
                        </button>
                        <button class="btn-white-outline" onclick="downloadProductResources(${p.id})">
                            <i class="fa-solid fa-download"></i>
                            تحميل الصور
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    }).join('');
}

function showProductDetails(id) {
    const p = products.find(x => x.id === id);
    if (!p) return;

    const modalHtml = `
        <div class="modal-header">
            <h5 class="modal-title fw-bold">${p.title}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
            <div class="row">
                <div class="col-md-6 mb-3">
                    <img src="${p.image}" class="img-fluid rounded shadow-sm">
                </div>
                <div class="col-md-6">
                    <h6 class="text-primary fw-bold">الوصف:</h6>
                    <p class="text-muted">${p.desc}</p>
                    <hr>
                    <div class="d-flex justify-content-between mb-2">
                        <span>سعر الجملة:</span>
                        <strong class="fs-5">${p.price} ج.م</strong>
                    </div>
                    <div class="d-flex justify-content-between mb-2">
                        <span>الربح المقترح:</span>
                        <strong class="text-success fs-5">${p.profit} ج.م</strong>
                    </div>
                    <button class="btn btn-primary w-100 mb-2" onclick="addToCart(${p.id}); document.querySelector('#productModal .btn-close').click();">أضف للسلة</button>
                    <button class="btn btn-outline-dark w-100" onclick="downloadProductResources(${p.id})">تحميل الصور والوصف</button>
                </div>
            </div>
        </div>
    `;

    document.getElementById('productModalContent').innerHTML = modalHtml;
    new bootstrap.Modal(document.getElementById('productModal')).show();
}

function downloadProductResources(id) {
    const p = products.find(x => x.id === id);
    if (!p) return;
    alert(`جاري تحميل صور ووصف المنتج: ${p.title}\n(سيتم فتح الصورة في نافذة جديدة)`);
    window.open(p.image, '_blank');
}

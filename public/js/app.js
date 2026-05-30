/* ============================================
   OPTIK OTOMASYON - Main Application Controller
   ============================================ */

// --- API Helper ---
async function apiCall(url, method = 'GET', body = null) {
    try {
        const options = {
            method,
            headers: { 'Content-Type': 'application/json' }
        };
        if (body && method !== 'GET') {
            options.body = JSON.stringify(body);
        }
        const response = await fetch(url, options);
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || data.error || 'Bir hata oluştu');
        }
        return data;
    } catch (error) {
        console.error(`API Error [${method} ${url}]:`, error);
        throw error;
    }
}

// --- Toast Notification ---
function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = message;
    container.appendChild(toast);

    // Auto dismiss
    setTimeout(() => {
        toast.classList.add('toast-exit');
        setTimeout(() => {
            if (toast.parentNode) toast.parentNode.removeChild(toast);
        }, 300);
    }, 3500);
}

// --- Modal ---
function showModal(title, formHtml, onSubmit) {
    const overlay = document.getElementById('modalOverlay');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');

    modalTitle.textContent = title;
    modalBody.innerHTML = `
        <form id="modalForm" onsubmit="return false;">
            ${formHtml}
            <div class="form-actions">
                <button type="button" class="btn btn-secondary" onclick="closeModal()">İptal</button>
                <button type="submit" class="btn btn-primary" id="modalSubmitBtn">💾 Kaydet</button>
            </div>
        </form>
    `;

    const form = document.getElementById('modalForm');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (onSubmit) onSubmit();
    });

    // Also bind submit button click
    const submitBtn = document.getElementById('modalSubmitBtn');
    submitBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (onSubmit) onSubmit();
    });

    overlay.style.display = 'flex';
}

function closeModal() {
    const overlay = document.getElementById('modalOverlay');
    overlay.style.display = 'none';
}

// Close modal on overlay click
document.getElementById('modalOverlay').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeModal();
});

// --- Sidebar Toggle (Mobile) ---
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('open');
}

// --- Loading Indicator ---
function showLoading() {
    return `
        <div class="loading-container">
            <div class="spinner"></div>
            <span class="loading-text">Veriler yükleniyor...</span>
        </div>
    `;
}

// --- Navigation ---
function showPage(pageName) {
    // Update active nav item
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.dataset.page === pageName) {
            item.classList.add('active');
        }
    });

    // Close mobile sidebar
    document.getElementById('sidebar').classList.remove('open');

    // Load page
    const mainContent = document.getElementById('mainContent');
    mainContent.innerHTML = showLoading();

    switch (pageName) {
        case 'dashboard':
            renderDashboard();
            break;
        case 'musteri':
            if (window.MusteriModule) MusteriModule.render();
            break;
        case 'doktor':
            if (window.DoktorModule) DoktorModule.render();
            break;
        case 'urun':
            if (window.UrunModule) UrunModule.render();
            break;
        case 'personel':
            if (window.PersonelModule) PersonelModule.render();
            break;
        case 'recete':
            if (window.ReceteModule) ReceteModule.render();
            break;
        case 'satis':
            if (window.SatisModule) SatisModule.render();
            break;
        default:
            renderDashboard();
    }
}

// --- Dashboard ---
async function renderDashboard() {
    const mainContent = document.getElementById('mainContent');

    // Start with structure, fill counts async
    mainContent.innerHTML = `
        <div class="dashboard-welcome">
            <h2>👁️ Optik Otomasyon Yönetim Paneli</h2>
            <p>Müşterilerinizi, ürünlerinizi, satışlarınızı ve daha fazlasını tek bir yerden yönetin. Hoş geldiniz!</p>
        </div>

        <div class="dashboard-grid">
            <div class="stat-card">
                <div class="stat-card-icon">👥</div>
                <div class="stat-card-value" id="statMusteri">
                    <div class="spinner" style="width:24px;height:24px;border-width:2px;"></div>
                </div>
                <div class="stat-card-label">Toplam Müşteri</div>
            </div>
            <div class="stat-card">
                <div class="stat-card-icon">🛍️</div>
                <div class="stat-card-value" id="statUrun">
                    <div class="spinner" style="width:24px;height:24px;border-width:2px;"></div>
                </div>
                <div class="stat-card-label">Toplam Ürün</div>
            </div>
            <div class="stat-card">
                <div class="stat-card-icon">💰</div>
                <div class="stat-card-value" id="statSatis">
                    <div class="spinner" style="width:24px;height:24px;border-width:2px;"></div>
                </div>
                <div class="stat-card-label">Toplam Satış</div>
            </div>
            <div class="stat-card">
                <div class="stat-card-icon">👔</div>
                <div class="stat-card-value" id="statPersonel">
                    <div class="spinner" style="width:24px;height:24px;border-width:2px;"></div>
                </div>
                <div class="stat-card-label">Toplam Personel</div>
            </div>
        </div>

        <div class="section-title">📊 Hızlı Bilgiler</div>
        <div class="dashboard-grid">
            <div class="stat-card">
                <div class="stat-card-icon">🩺</div>
                <div class="stat-card-value" id="statDoktor">
                    <div class="spinner" style="width:24px;height:24px;border-width:2px;"></div>
                </div>
                <div class="stat-card-label">Kayıtlı Doktor</div>
            </div>
            <div class="stat-card">
                <div class="stat-card-icon">📋</div>
                <div class="stat-card-value" id="statRecete">
                    <div class="spinner" style="width:24px;height:24px;border-width:2px;"></div>
                </div>
                <div class="stat-card-label">Toplam Reçete</div>
            </div>
        </div>
    `;

    // Fetch counts in parallel
    const fetchCount = async (url, elementId) => {
        try {
            const result = await apiCall(url);
            const count = result.data ? result.data.length : 0;
            const el = document.getElementById(elementId);
            if (el) el.textContent = count;
        } catch {
            const el = document.getElementById(elementId);
            if (el) el.textContent = '—';
        }
    };

    await Promise.allSettled([
        fetchCount('/api/musteri', 'statMusteri'),
        fetchCount('/api/urun', 'statUrun'),
        fetchCount('/api/satis', 'statSatis'),
        fetchCount('/api/personel', 'statPersonel'),
        fetchCount('/api/doktor', 'statDoktor'),
        fetchCount('/api/recete', 'statRecete')
    ]);
}

// --- Confirm Dialog ---
function showConfirm(message, onConfirm) {
    const overlay = document.createElement('div');
    overlay.className = 'confirm-overlay';
    overlay.innerHTML = `
        <div class="confirm-card">
            <div class="confirm-icon">⚠️</div>
            <div class="confirm-title">Emin misiniz?</div>
            <div class="confirm-text">${message}</div>
            <div class="confirm-actions">
                <button class="btn btn-secondary" id="confirmCancel">İptal</button>
                <button class="btn btn-danger" id="confirmDelete">🗑️ Sil</button>
            </div>
        </div>
    `;
    document.body.appendChild(overlay);

    overlay.querySelector('#confirmCancel').onclick = () => {
        document.body.removeChild(overlay);
    };
    overlay.querySelector('#confirmDelete').onclick = () => {
        document.body.removeChild(overlay);
        if (onConfirm) onConfirm();
    };
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) document.body.removeChild(overlay);
    });
}

// --- Format Helpers ---
function formatCurrency(amount) {
    return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(amount);
}

function formatDate(dateStr) {
    if (!dateStr) return '—';
    try {
        const date = new Date(dateStr);
        return date.toLocaleDateString('tr-TR');
    } catch {
        return dateStr;
    }
}

// --- Initial Load ---
document.addEventListener('DOMContentLoaded', () => {
    renderDashboard();
});

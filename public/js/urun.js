/* ============================================
   URUN MODULE - Ürün Yönetimi
   ============================================ */
const UrunModule = (() => {

    async function render() {
        const mainContent = document.getElementById('mainContent');
        mainContent.innerHTML = `
            <div class="page-header">
                <h1 class="page-title">🛍️ Ürünler</h1>
                <button class="btn btn-add" onclick="UrunModule.showForm()">➕ Yeni Ürün</button>
            </div>
            <div class="table-container">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Ürün Adı</th>
                            <th>Tür</th>
                            <th>Marka</th>
                            <th>Fiyat</th>
                            <th>Stok</th>
                            <th>Stok Durumu</th>
                            <th>İşlemler</th>
                        </tr>
                    </thead>
                    <tbody id="urunTableBody">
                        <tr><td colspan="8" class="table-empty">
                            <span class="table-empty-icon">⏳</span>Veriler yükleniyor...
                        </td></tr>
                    </tbody>
                </table>
            </div>
        `;
        await loadData();
    }

    async function loadData() {
        const tbody = document.getElementById('urunTableBody');
        try {
            const result = await apiCall('/api/urun');
            const urunler = result.data || [];

            if (urunler.length === 0) {
                tbody.innerHTML = `<tr><td colspan="8" class="table-empty">
                    <span class="table-empty-icon">📭</span>Henüz ürün kaydı bulunmuyor.
                </td></tr>`;
                return;
            }

            // Fetch stok durumu for each product in parallel
            const stokPromises = urunler.map(async (u) => {
                try {
                    const stokResult = await apiCall(`/api/urun/${u.UrunID}/stok-durumu`);
                    return stokResult.data || stokResult.stokDurumu || stokResult.StokDurumu || '—';
                } catch {
                    return '—';
                }
            });
            const stokDurumlari = await Promise.allSettled(stokPromises);

            tbody.innerHTML = urunler.map((u, i) => {
                const stokDurumu = stokDurumlari[i].status === 'fulfilled' ? stokDurumlari[i].value : '—';
                const badgeClass = getStokBadgeClass(stokDurumu);

                return `
                <tr>
                    <td><span class="badge badge-primary">#${u.UrunID}</span></td>
                    <td><strong>${escapeHtml(u.UrunAdi)}</strong></td>
                    <td>${escapeHtml(u.UrunTuru || '—')}</td>
                    <td>${escapeHtml(u.Marka || '—')}</td>
                    <td><span class="price">${formatCurrency(u.Fiyat)}</span></td>
                    <td>${u.StokMiktari}</td>
                    <td><span class="badge ${badgeClass}">${escapeHtml(stokDurumu)}</span></td>
                    <td>
                        <div class="btn-group">
                            <button class="btn btn-edit btn-sm" onclick='UrunModule.showForm(${JSON.stringify(u)})'>✏️ Düzenle</button>
                            <button class="btn btn-danger btn-sm" onclick="UrunModule.remove(${u.UrunID})">🗑️ Sil</button>
                        </div>
                    </td>
                </tr>
                `;
            }).join('');
        } catch (error) {
            tbody.innerHTML = `<tr><td colspan="8" class="table-empty">
                <span class="table-empty-icon">❌</span>Veriler yüklenirken hata oluştu.
            </td></tr>`;
            showToast('Ürün verileri yüklenirken hata: ' + error.message, 'error');
        }
    }

    function getStokBadgeClass(durum) {
        if (!durum) return 'badge-info';
        const lower = durum.toLowerCase ? durum.toLowerCase() : '';
        if (lower.includes('yeterli')) return 'badge-success';
        if (lower.includes('kritik')) return 'badge-warning';
        if (lower.includes('yok') || lower.includes('tüken')) return 'badge-danger';
        return 'badge-info';
    }

    function showForm(urun = null) {
        const isEdit = urun !== null;
        const title = isEdit ? '✏️ Ürün Düzenle' : '➕ Yeni Ürün';

        const formHtml = `
            <div class="form-group">
                <label class="form-label">Ürün Adı</label>
                <input type="text" class="form-input" id="fUrunAdi" value="${isEdit ? escapeHtml(urun.UrunAdi) : ''}" required placeholder="Ürün adı">
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label class="form-label">Ürün Türü</label>
                    <input type="text" class="form-input" id="fUrunTuru" value="${isEdit ? escapeHtml(urun.UrunTuru || '') : ''}" placeholder="Örn: Gözlük, Lens">
                </div>
                <div class="form-group">
                    <label class="form-label">Marka</label>
                    <input type="text" class="form-input" id="fMarka" value="${isEdit ? escapeHtml(urun.Marka || '') : ''}" placeholder="Marka adı">
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label class="form-label">Fiyat (₺)</label>
                    <input type="number" step="0.01" min="0" class="form-input" id="fFiyat" value="${isEdit ? urun.Fiyat : ''}" required placeholder="0.00">
                </div>
                <div class="form-group">
                    <label class="form-label">Stok Miktarı</label>
                    <input type="number" min="0" class="form-input" id="fStokMiktari" value="${isEdit ? urun.StokMiktari : ''}" required placeholder="0">
                </div>
            </div>
        `;

        showModal(title, formHtml, () => save(isEdit ? urun.UrunID : null));
    }

    async function save(id) {
        const body = {
            UrunAdi: document.getElementById('fUrunAdi').value.trim(),
            UrunTuru: document.getElementById('fUrunTuru').value.trim(),
            Marka: document.getElementById('fMarka').value.trim(),
            Fiyat: parseFloat(document.getElementById('fFiyat').value) || 0,
            StokMiktari: parseInt(document.getElementById('fStokMiktari').value) || 0
        };

        if (!body.UrunAdi) {
            showToast('Ürün adı zorunludur.', 'error');
            return;
        }

        try {
            if (id) {
                await apiCall(`/api/urun/${id}`, 'PUT', body);
                showToast('✅ Ürün başarıyla güncellendi.', 'success');
            } else {
                await apiCall('/api/urun', 'POST', body);
                showToast('✅ Yeni ürün başarıyla eklendi.', 'success');
            }
            closeModal();
            await render();
        } catch (error) {
            showToast('❌ Hata: ' + error.message, 'error');
        }
    }

    async function remove(id) {
        showConfirm('Bu ürün kaydını silmek istediğinize emin misiniz?', async () => {
            try {
                await apiCall(`/api/urun/${id}`, 'DELETE');
                showToast('🗑️ Ürün başarıyla silindi.', 'success');
                await render();
            } catch (error) {
                showToast('❌ Silme hatası: ' + error.message, 'error');
            }
        });
    }

    return { render, showForm, remove };
})();

window.UrunModule = UrunModule;

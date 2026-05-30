/* ============================================
   DOKTOR MODULE - Doktor Yönetimi
   ============================================ */
const DoktorModule = (() => {

    async function render() {
        const mainContent = document.getElementById('mainContent');
        mainContent.innerHTML = `
            <div class="page-header">
                <h1 class="page-title">🩺 Doktorlar</h1>
                <button class="btn btn-add" onclick="DoktorModule.showForm()">➕ Yeni Doktor</button>
            </div>
            <div class="table-container">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Ad</th>
                            <th>Soyad</th>
                            <th>Uzmanlık Alanı</th>
                            <th>Telefon</th>
                            <th>İşlemler</th>
                        </tr>
                    </thead>
                    <tbody id="doktorTableBody">
                        <tr><td colspan="6" class="table-empty">
                            <span class="table-empty-icon">⏳</span>Veriler yükleniyor...
                        </td></tr>
                    </tbody>
                </table>
            </div>
        `;
        await loadData();
    }

    async function loadData() {
        const tbody = document.getElementById('doktorTableBody');
        try {
            const result = await apiCall('/api/doktor');
            const doktorlar = result.data || [];

            if (doktorlar.length === 0) {
                tbody.innerHTML = `<tr><td colspan="6" class="table-empty">
                    <span class="table-empty-icon">📭</span>Henüz doktor kaydı bulunmuyor.
                </td></tr>`;
                return;
            }

            tbody.innerHTML = doktorlar.map(d => `
                <tr>
                    <td><span class="badge badge-primary">#${d.DoktorID}</span></td>
                    <td>${escapeHtml(d.Ad)}</td>
                    <td>${escapeHtml(d.Soyad)}</td>
                    <td><span class="badge badge-info">${escapeHtml(d.UzmanlikAlani || '—')}</span></td>
                    <td>${escapeHtml(d.Telefon || '—')}</td>
                    <td>
                        <div class="btn-group">
                            <button class="btn btn-edit btn-sm" onclick='DoktorModule.showForm(${JSON.stringify(d)})'>✏️ Düzenle</button>
                            <button class="btn btn-danger btn-sm" onclick="DoktorModule.remove(${d.DoktorID})">🗑️ Sil</button>
                        </div>
                    </td>
                </tr>
            `).join('');
        } catch (error) {
            tbody.innerHTML = `<tr><td colspan="6" class="table-empty">
                <span class="table-empty-icon">❌</span>Veriler yüklenirken hata oluştu.
            </td></tr>`;
            showToast('Doktor verileri yüklenirken hata: ' + error.message, 'error');
        }
    }

    function showForm(doktor = null) {
        const isEdit = doktor !== null;
        const title = isEdit ? '✏️ Doktor Düzenle' : '➕ Yeni Doktor';

        const formHtml = `
            <div class="form-row">
                <div class="form-group">
                    <label class="form-label">Ad</label>
                    <input type="text" class="form-input" id="fAd" value="${isEdit ? escapeHtml(doktor.Ad) : ''}" required placeholder="Doktor adı">
                </div>
                <div class="form-group">
                    <label class="form-label">Soyad</label>
                    <input type="text" class="form-input" id="fSoyad" value="${isEdit ? escapeHtml(doktor.Soyad) : ''}" required placeholder="Doktor soyadı">
                </div>
            </div>
            <div class="form-group">
                <label class="form-label">Uzmanlık Alanı</label>
                <input type="text" class="form-input" id="fUzmanlikAlani" value="${isEdit ? escapeHtml(doktor.UzmanlikAlani || '') : ''}" placeholder="Örn: Göz Hastalıkları">
            </div>
            <div class="form-group">
                <label class="form-label">Telefon</label>
                <input type="tel" class="form-input" id="fTelefon" value="${isEdit ? escapeHtml(doktor.Telefon || '') : ''}" placeholder="05XX XXX XX XX">
            </div>
        `;

        showModal(title, formHtml, () => save(isEdit ? doktor.DoktorID : null));
    }

    async function save(id) {
        const body = {
            Ad: document.getElementById('fAd').value.trim(),
            Soyad: document.getElementById('fSoyad').value.trim(),
            UzmanlikAlani: document.getElementById('fUzmanlikAlani').value.trim(),
            Telefon: document.getElementById('fTelefon').value.trim()
        };

        if (!body.Ad || !body.Soyad) {
            showToast('Ad ve Soyad alanları zorunludur.', 'error');
            return;
        }

        try {
            if (id) {
                await apiCall(`/api/doktor/${id}`, 'PUT', body);
                showToast('✅ Doktor başarıyla güncellendi.', 'success');
            } else {
                await apiCall('/api/doktor', 'POST', body);
                showToast('✅ Yeni doktor başarıyla eklendi.', 'success');
            }
            closeModal();
            await render();
        } catch (error) {
            showToast('❌ Hata: ' + error.message, 'error');
        }
    }

    async function remove(id) {
        showConfirm('Bu doktor kaydını silmek istediğinize emin misiniz?', async () => {
            try {
                await apiCall(`/api/doktor/${id}`, 'DELETE');
                showToast('🗑️ Doktor başarıyla silindi.', 'success');
                await render();
            } catch (error) {
                showToast('❌ Silme hatası: ' + error.message, 'error');
            }
        });
    }

    return { render, showForm, remove };
})();

window.DoktorModule = DoktorModule;

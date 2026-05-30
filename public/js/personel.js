/* ============================================
   PERSONEL MODULE - Personel Yönetimi
   ============================================ */
const PersonelModule = (() => {

    async function render() {
        const mainContent = document.getElementById('mainContent');
        mainContent.innerHTML = `
            <div class="page-header">
                <h1 class="page-title">👔 Personel</h1>
                <button class="btn btn-add" onclick="PersonelModule.showForm()">➕ Yeni Personel</button>
            </div>
            <div class="table-container">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Ad</th>
                            <th>Soyad</th>
                            <th>Görev</th>
                            <th>Telefon</th>
                            <th>İşlemler</th>
                        </tr>
                    </thead>
                    <tbody id="personelTableBody">
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
        const tbody = document.getElementById('personelTableBody');
        try {
            const result = await apiCall('/api/personel');
            const personeller = result.data || [];

            if (personeller.length === 0) {
                tbody.innerHTML = `<tr><td colspan="6" class="table-empty">
                    <span class="table-empty-icon">📭</span>Henüz personel kaydı bulunmuyor.
                </td></tr>`;
                return;
            }

            tbody.innerHTML = personeller.map(p => `
                <tr>
                    <td><span class="badge badge-primary">#${p.PersonelID}</span></td>
                    <td>${escapeHtml(p.Ad)}</td>
                    <td>${escapeHtml(p.Soyad)}</td>
                    <td><span class="badge badge-info">${escapeHtml(p.Gorev || '—')}</span></td>
                    <td>${escapeHtml(p.Telefon || '—')}</td>
                    <td>
                        <div class="btn-group">
                            <button class="btn btn-edit btn-sm" onclick='PersonelModule.showForm(${JSON.stringify(p)})'>✏️ Düzenle</button>
                            <button class="btn btn-danger btn-sm" onclick="PersonelModule.remove(${p.PersonelID})">🗑️ Sil</button>
                        </div>
                    </td>
                </tr>
            `).join('');
        } catch (error) {
            tbody.innerHTML = `<tr><td colspan="6" class="table-empty">
                <span class="table-empty-icon">❌</span>Veriler yüklenirken hata oluştu.
            </td></tr>`;
            showToast('Personel verileri yüklenirken hata: ' + error.message, 'error');
        }
    }

    function showForm(personel = null) {
        const isEdit = personel !== null;
        const title = isEdit ? '✏️ Personel Düzenle' : '➕ Yeni Personel';

        const formHtml = `
            <div class="form-row">
                <div class="form-group">
                    <label class="form-label">Ad</label>
                    <input type="text" class="form-input" id="fAd" value="${isEdit ? escapeHtml(personel.Ad) : ''}" required placeholder="Personel adı">
                </div>
                <div class="form-group">
                    <label class="form-label">Soyad</label>
                    <input type="text" class="form-input" id="fSoyad" value="${isEdit ? escapeHtml(personel.Soyad) : ''}" required placeholder="Personel soyadı">
                </div>
            </div>
            <div class="form-group">
                <label class="form-label">Görev</label>
                <input type="text" class="form-input" id="fGorev" value="${isEdit ? escapeHtml(personel.Gorev || '') : ''}" placeholder="Örn: Satış Danışmanı">
            </div>
            <div class="form-group">
                <label class="form-label">Telefon</label>
                <input type="tel" class="form-input" id="fTelefon" value="${isEdit ? escapeHtml(personel.Telefon || '') : ''}" placeholder="05XX XXX XX XX">
            </div>
        `;

        showModal(title, formHtml, () => save(isEdit ? personel.PersonelID : null));
    }

    async function save(id) {
        const body = {
            Ad: document.getElementById('fAd').value.trim(),
            Soyad: document.getElementById('fSoyad').value.trim(),
            Gorev: document.getElementById('fGorev').value.trim(),
            Telefon: document.getElementById('fTelefon').value.trim()
        };

        if (!body.Ad || !body.Soyad) {
            showToast('Ad ve Soyad alanları zorunludur.', 'error');
            return;
        }

        try {
            if (id) {
                await apiCall(`/api/personel/${id}`, 'PUT', body);
                showToast('✅ Personel başarıyla güncellendi.', 'success');
            } else {
                await apiCall('/api/personel', 'POST', body);
                showToast('✅ Yeni personel başarıyla eklendi.', 'success');
            }
            closeModal();
            await render();
        } catch (error) {
            showToast('❌ Hata: ' + error.message, 'error');
        }
    }

    async function remove(id) {
        showConfirm('Bu personel kaydını silmek istediğinize emin misiniz?', async () => {
            try {
                await apiCall(`/api/personel/${id}`, 'DELETE');
                showToast('🗑️ Personel başarıyla silindi.', 'success');
                await render();
            } catch (error) {
                showToast('❌ Silme hatası: ' + error.message, 'error');
            }
        });
    }

    return { render, showForm, remove };
})();

window.PersonelModule = PersonelModule;

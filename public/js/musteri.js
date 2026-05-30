/* ============================================
   MUSTERI MODULE - Müşteri Yönetimi
   ============================================ */
const MusteriModule = (() => {

    async function render() {
        const mainContent = document.getElementById('mainContent');
        mainContent.innerHTML = `
            <div class="page-header">
                <h1 class="page-title">👥 Müşteriler</h1>
                <button class="btn btn-add" onclick="MusteriModule.showForm()">➕ Yeni Müşteri</button>
            </div>
            <div class="table-container">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Ad</th>
                            <th>Soyad</th>
                            <th>Telefon</th>
                            <th>E-posta</th>
                            <th>Doğum Tarihi</th>
                            <th>Yaş</th>
                            <th>İşlemler</th>
                        </tr>
                    </thead>
                    <tbody id="musteriTableBody">
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
        const tbody = document.getElementById('musteriTableBody');
        try {
            const result = await apiCall('/api/musteri');
            const musteriler = result.data || [];

            if (musteriler.length === 0) {
                tbody.innerHTML = `<tr><td colspan="8" class="table-empty">
                    <span class="table-empty-icon">📭</span>Henüz müşteri kaydı bulunmuyor.
                </td></tr>`;
                return;
            }

            // Fetch ages in parallel
            const agePromises = musteriler.map(async (m) => {
                try {
                    const ageResult = await apiCall(`/api/musteri/${m.MusteriID}/yas`);
                    return ageResult.data !== undefined ? ageResult.data : (ageResult.yas !== undefined ? ageResult.yas : '—');
                } catch {
                    return '—';
                }
            });
            const ages = await Promise.allSettled(agePromises);

            tbody.innerHTML = musteriler.map((m, i) => {
                const age = ages[i].status === 'fulfilled' ? ages[i].value : '—';
                return `
                <tr>
                    <td><span class="badge badge-primary">#${m.MusteriID}</span></td>
                    <td>${escapeHtml(m.Ad)}</td>
                    <td>${escapeHtml(m.Soyad)}</td>
                    <td>${escapeHtml(m.Telefon || '—')}</td>
                    <td>${escapeHtml(m.Eposta || '—')}</td>
                    <td>${formatDate(m.DogumTarihi)}</td>
                    <td><span class="badge badge-age">${age} yaş</span></td>
                    <td>
                        <div class="btn-group">
                            <button class="btn btn-edit btn-sm" onclick="MusteriModule.showForm(${JSON.stringify(m).replace(/"/g, '&quot;')})">✏️ Düzenle</button>
                            <button class="btn btn-danger btn-sm" onclick="MusteriModule.remove(${m.MusteriID})">🗑️ Sil</button>
                        </div>
                    </td>
                </tr>
                `;
            }).join('');
        } catch (error) {
            tbody.innerHTML = `<tr><td colspan="8" class="table-empty">
                <span class="table-empty-icon">❌</span>Veriler yüklenirken hata oluştu.
            </td></tr>`;
            showToast('Müşteri verileri yüklenirken hata: ' + error.message, 'error');
        }
    }

    function showForm(musteri = null) {
        const isEdit = musteri !== null;
        const title = isEdit ? '✏️ Müşteri Düzenle' : '➕ Yeni Müşteri';

        const formHtml = `
            <div class="form-row">
                <div class="form-group">
                    <label class="form-label">Ad</label>
                    <input type="text" class="form-input" id="fAd" value="${isEdit ? escapeHtml(musteri.Ad) : ''}" required placeholder="Müşteri adı">
                </div>
                <div class="form-group">
                    <label class="form-label">Soyad</label>
                    <input type="text" class="form-input" id="fSoyad" value="${isEdit ? escapeHtml(musteri.Soyad) : ''}" required placeholder="Müşteri soyadı">
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label class="form-label">Telefon</label>
                    <input type="tel" class="form-input" id="fTelefon" value="${isEdit ? escapeHtml(musteri.Telefon || '') : ''}" placeholder="05XX XXX XX XX">
                </div>
                <div class="form-group">
                    <label class="form-label">E-posta</label>
                    <input type="email" class="form-input" id="fEposta" value="${isEdit ? escapeHtml(musteri.Eposta || '') : ''}" placeholder="ornek@mail.com">
                </div>
            </div>
            <div class="form-group">
                <label class="form-label">Adres</label>
                <input type="text" class="form-input" id="fAdres" value="${isEdit ? escapeHtml(musteri.Adres || '') : ''}" placeholder="Müşteri adresi">
            </div>
            <div class="form-group">
                <label class="form-label">Doğum Tarihi</label>
                <input type="date" class="form-input" id="fDogumTarihi" value="${isEdit && musteri.DogumTarihi ? musteri.DogumTarihi.substring(0, 10) : ''}">
            </div>
        `;

        showModal(title, formHtml, () => save(isEdit ? musteri.MusteriID : null));
    }

    async function save(id) {
        const body = {
            Ad: document.getElementById('fAd').value.trim(),
            Soyad: document.getElementById('fSoyad').value.trim(),
            Telefon: document.getElementById('fTelefon').value.trim(),
            Eposta: document.getElementById('fEposta').value.trim(),
            Adres: document.getElementById('fAdres').value.trim(),
            DogumTarihi: document.getElementById('fDogumTarihi').value || null
        };

        if (!body.Ad || !body.Soyad) {
            showToast('Ad ve Soyad alanları zorunludur.', 'error');
            return;
        }

        try {
            if (id) {
                await apiCall(`/api/musteri/${id}`, 'PUT', body);
                showToast('✅ Müşteri başarıyla güncellendi.', 'success');
            } else {
                await apiCall('/api/musteri', 'POST', body);
                showToast('✅ Yeni müşteri başarıyla eklendi.', 'success');
            }
            closeModal();
            await render();
        } catch (error) {
            showToast('❌ Hata: ' + error.message, 'error');
        }
    }

    async function remove(id) {
        showConfirm('Bu müşteri kaydını silmek istediğinize emin misiniz?', async () => {
            try {
                await apiCall(`/api/musteri/${id}`, 'DELETE');
                showToast('🗑️ Müşteri başarıyla silindi.', 'success');
                await render();
            } catch (error) {
                showToast('❌ Silme hatası: ' + error.message, 'error');
            }
        });
    }

    // Public API
    return { render, showForm, remove };
})();

// Escape HTML helper
function escapeHtml(text) {
    if (text === null || text === undefined) return '';
    const div = document.createElement('div');
    div.textContent = String(text);
    return div.innerHTML;
}

window.MusteriModule = MusteriModule;

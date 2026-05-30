/* ============================================
   RECETE MODULE - Reçete Yönetimi
   ============================================ */
const ReceteModule = (() => {

    async function render() {
        const mainContent = document.getElementById('mainContent');
        mainContent.innerHTML = `
            <div class="page-header">
                <h1 class="page-title">📋 Reçeteler</h1>
                <button class="btn btn-add" onclick="ReceteModule.showForm()">➕ Yeni Reçete</button>
            </div>
            <div class="table-container">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Tarih</th>
                            <th>Sağ Göz</th>
                            <th>Sol Göz</th>
                            <th>Müşteri</th>
                            <th>Doktor</th>
                            <th>İşlemler</th>
                        </tr>
                    </thead>
                    <tbody id="receteTableBody">
                        <tr><td colspan="7" class="table-empty">
                            <span class="table-empty-icon">⏳</span>Veriler yükleniyor...
                        </td></tr>
                    </tbody>
                </table>
            </div>
        `;
        await loadData();
    }

    async function loadData() {
        const tbody = document.getElementById('receteTableBody');
        try {
            const [receteResult, musteriResult, doktorResult] = await Promise.all([
                apiCall('/api/recete'),
                apiCall('/api/musteri'),
                apiCall('/api/doktor')
            ]);
            const receteler = receteResult.data || [];
            const musteriler = musteriResult.data || [];
            const doktorlar = doktorResult.data || [];

            // Create lookup maps
            const musteriMap = {};
            musteriler.forEach(m => musteriMap[m.MusteriID] = `${m.Ad} ${m.Soyad}`);
            const doktorMap = {};
            doktorlar.forEach(d => doktorMap[d.DoktorID] = `${d.Ad} ${d.Soyad}`);

            if (receteler.length === 0) {
                tbody.innerHTML = `<tr><td colspan="7" class="table-empty">
                    <span class="table-empty-icon">📭</span>Henüz reçete kaydı bulunmuyor.
                </td></tr>`;
                return;
            }

            tbody.innerHTML = receteler.map(r => `
                <tr>
                    <td><span class="badge badge-primary">#${r.ReceteID}</span></td>
                    <td>${formatDate(r.ReceteTarihi)}</td>
                    <td><span class="badge badge-info">R: ${escapeHtml(r.SagGozNumara || '—')}</span></td>
                    <td><span class="badge badge-info">L: ${escapeHtml(r.SolGozNumara || '—')}</span></td>
                    <td>${musteriMap[r.MusteriID] ? escapeHtml(musteriMap[r.MusteriID]) : `<span class="text-muted">#${r.MusteriID}</span>`}</td>
                    <td>${doktorMap[r.DoktorID] ? escapeHtml(doktorMap[r.DoktorID]) : `<span class="text-muted">#${r.DoktorID}</span>`}</td>
                    <td>
                        <div class="btn-group">
                            <button class="btn btn-edit btn-sm" onclick='ReceteModule.showForm(${JSON.stringify(r)})'>✏️ Düzenle</button>
                            <button class="btn btn-danger btn-sm" onclick="ReceteModule.remove(${r.ReceteID})">🗑️ Sil</button>
                        </div>
                    </td>
                </tr>
            `).join('');
        } catch (error) {
            tbody.innerHTML = `<tr><td colspan="7" class="table-empty">
                <span class="table-empty-icon">❌</span>Veriler yüklenirken hata oluştu.
            </td></tr>`;
            showToast('Reçete verileri yüklenirken hata: ' + error.message, 'error');
        }
    }

    async function showForm(recete = null) {
        const isEdit = recete !== null;
        const title = isEdit ? '✏️ Reçete Düzenle' : '➕ Yeni Reçete';

        // Fetch müşteri and doktor lists for dropdowns
        let musteriler = [], doktorlar = [];
        try {
            const [musteriResult, doktorResult] = await Promise.all([
                apiCall('/api/musteri'),
                apiCall('/api/doktor')
            ]);
            musteriler = musteriResult.data || [];
            doktorlar = doktorResult.data || [];
        } catch (error) {
            showToast('Dropdown verileri yüklenirken hata oluştu.', 'error');
        }

        const musteriOptions = musteriler.map(m =>
            `<option value="${m.MusteriID}" ${isEdit && recete.MusteriID == m.MusteriID ? 'selected' : ''}>${m.Ad} ${m.Soyad} (#${m.MusteriID})</option>`
        ).join('');

        const doktorOptions = doktorlar.map(d =>
            `<option value="${d.DoktorID}" ${isEdit && recete.DoktorID == d.DoktorID ? 'selected' : ''}>${d.Ad} ${d.Soyad} - ${d.UzmanlikAlani || ''} (#${d.DoktorID})</option>`
        ).join('');

        const formHtml = `
            <div class="form-group">
                <label class="form-label">Reçete Tarihi</label>
                <input type="date" class="form-input" id="fReceteTarihi" value="${isEdit && recete.ReceteTarihi ? recete.ReceteTarihi.substring(0, 10) : new Date().toISOString().substring(0, 10)}" required>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label class="form-label">Sağ Göz Numara</label>
                    <input type="text" class="form-input" id="fSagGozNumara" value="${isEdit ? escapeHtml(recete.SagGozNumara || '') : ''}" placeholder="Örn: -1.50">
                </div>
                <div class="form-group">
                    <label class="form-label">Sol Göz Numara</label>
                    <input type="text" class="form-input" id="fSolGozNumara" value="${isEdit ? escapeHtml(recete.SolGozNumara || '') : ''}" placeholder="Örn: -2.00">
                </div>
            </div>
            <div class="form-group">
                <label class="form-label">Müşteri</label>
                <select class="form-select" id="fMusteriID" required>
                    <option value="">Müşteri seçiniz...</option>
                    ${musteriOptions}
                </select>
            </div>
            <div class="form-group">
                <label class="form-label">Doktor</label>
                <select class="form-select" id="fDoktorID" required>
                    <option value="">Doktor seçiniz...</option>
                    ${doktorOptions}
                </select>
            </div>
        `;

        showModal(title, formHtml, () => save(isEdit ? recete.ReceteID : null));
    }

    async function save(id) {
        const body = {
            ReceteTarihi: document.getElementById('fReceteTarihi').value || null,
            SagGozNumara: document.getElementById('fSagGozNumara').value.trim(),
            SolGozNumara: document.getElementById('fSolGozNumara').value.trim(),
            MusteriID: parseInt(document.getElementById('fMusteriID').value) || null,
            DoktorID: parseInt(document.getElementById('fDoktorID').value) || null
        };

        if (!body.MusteriID || !body.DoktorID) {
            showToast('Müşteri ve Doktor seçimi zorunludur.', 'error');
            return;
        }

        try {
            if (id) {
                await apiCall(`/api/recete/${id}`, 'PUT', body);
                showToast('✅ Reçete başarıyla güncellendi.', 'success');
            } else {
                await apiCall('/api/recete', 'POST', body);
                showToast('✅ Yeni reçete başarıyla eklendi.', 'success');
            }
            closeModal();
            await render();
        } catch (error) {
            showToast('❌ Hata: ' + error.message, 'error');
        }
    }

    async function remove(id) {
        showConfirm('Bu reçete kaydını silmek istediğinize emin misiniz?', async () => {
            try {
                await apiCall(`/api/recete/${id}`, 'DELETE');
                showToast('🗑️ Reçete başarıyla silindi.', 'success');
                await render();
            } catch (error) {
                showToast('❌ Silme hatası: ' + error.message, 'error');
            }
        });
    }

    return { render, showForm, remove };
})();

window.ReceteModule = ReceteModule;

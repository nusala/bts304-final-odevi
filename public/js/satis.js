/* ============================================
   SATIS MODULE - Satış ve Satış Detay Yönetimi
   ============================================ */
const SatisModule = (() => {

    async function render() {
        const mainContent = document.getElementById('mainContent');
        mainContent.innerHTML = `
            <div class="page-header">
                <h1 class="page-title">💰 Satışlar</h1>
                <div class="btn-group">
                    <button class="btn btn-add" onclick="SatisModule.showSatisForm()">➕ Yeni Satış</button>
                    <button class="btn btn-secondary" onclick="SatisModule.showDetayForm()">📦 Satış Detayı Ekle</button>
                </div>
            </div>

            <!-- Satış Tablosu -->
            <div class="section-title">📊 Satış Kayıtları</div>
            <div class="table-container mb-3">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Tarih</th>
                            <th>Toplam Tutar</th>
                            <th>Müşteri</th>
                            <th>Personel</th>
                            <th>Reçete</th>
                            <th>İşlemler</th>
                        </tr>
                    </thead>
                    <tbody id="satisTableBody">
                        <tr><td colspan="7" class="table-empty">
                            <span class="table-empty-icon">⏳</span>Veriler yükleniyor...
                        </td></tr>
                    </tbody>
                </table>
            </div>

            <hr class="section-divider">

            <!-- Satış Detay Tablosu -->
            <div class="section-title">📦 Satış Detayları</div>
            <div class="table-container">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Detay ID</th>
                            <th>Satış ID</th>
                            <th>Ürün</th>
                            <th>Adet</th>
                            <th>Birim Fiyat</th>
                            <th>Ara Toplam</th>
                            <th>İşlemler</th>
                        </tr>
                    </thead>
                    <tbody id="satisDetayTableBody">
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
        await Promise.all([loadSatislar(), loadDetaylar()]);
    }

    async function loadSatislar() {
        const tbody = document.getElementById('satisTableBody');
        try {
            const [satisResult, musteriResult, personelResult, receteResult] = await Promise.all([
                apiCall('/api/satis'),
                apiCall('/api/musteri'),
                apiCall('/api/personel'),
                apiCall('/api/recete')
            ]);
            const satislar = satisResult.data || [];
            const musteriler = musteriResult.data || [];
            const personeller = personelResult.data || [];
            const receteler = receteResult.data || [];

            // Create lookup maps
            const musteriMap = {};
            musteriler.forEach(m => musteriMap[m.MusteriID] = `${m.Ad} ${m.Soyad}`);
            const personelMap = {};
            personeller.forEach(p => personelMap[p.PersonelID] = `${p.Ad} ${p.Soyad}`);
            const receteMap = {};
            receteler.forEach(r => receteMap[r.ReceteID] = `#${r.ReceteID} (${formatDate(r.ReceteTarihi)})`);

            if (satislar.length === 0) {
                tbody.innerHTML = `<tr><td colspan="7" class="table-empty">
                    <span class="table-empty-icon">📭</span>Henüz satış kaydı bulunmuyor.
                </td></tr>`;
                return;
            }

            tbody.innerHTML = satislar.map(s => `
                <tr>
                    <td><span class="badge badge-primary">#${s.SatisID}</span></td>
                    <td>${formatDate(s.SatisTarihi)}</td>
                    <td><span class="price">${formatCurrency(s.ToplamTutar || 0)}</span></td>
                    <td>${musteriMap[s.MusteriID] ? escapeHtml(musteriMap[s.MusteriID]) : `<span class="text-muted">#${s.MusteriID}</span>`}</td>
                    <td>${personelMap[s.PersonelID] ? escapeHtml(personelMap[s.PersonelID]) : `<span class="text-muted">#${s.PersonelID}</span>`}</td>
                    <td>${s.ReceteID ? (receteMap[s.ReceteID] ? escapeHtml(receteMap[s.ReceteID]) : `<span class="text-muted">#${s.ReceteID}</span>`) : '<span class="text-muted">—</span>'}</td>
                    <td>
                        <div class="btn-group">
                            <button class="btn btn-edit btn-sm" onclick='SatisModule.showSatisForm(${JSON.stringify(s)})'>✏️ Düzenle</button>
                            <button class="btn btn-danger btn-sm" onclick="SatisModule.removeSatis(${s.SatisID})">🗑️ Sil</button>
                        </div>
                    </td>
                </tr>
            `).join('');
        } catch (error) {
            tbody.innerHTML = `<tr><td colspan="7" class="table-empty">
                <span class="table-empty-icon">❌</span>Veriler yüklenirken hata oluştu.
            </td></tr>`;
            showToast('Satış verileri yüklenirken hata: ' + error.message, 'error');
        }
    }

    async function loadDetaylar() {
        const tbody = document.getElementById('satisDetayTableBody');
        try {
            const [detayResult, urunResult] = await Promise.all([
                apiCall('/api/satis-detay'),
                apiCall('/api/urun')
            ]);
            const detaylar = detayResult.data || [];
            const urunler = urunResult.data || [];

            const urunMap = {};
            urunler.forEach(u => urunMap[u.UrunID] = u.UrunAdi);

            if (detaylar.length === 0) {
                tbody.innerHTML = `<tr><td colspan="7" class="table-empty">
                    <span class="table-empty-icon">📭</span>Henüz satış detayı bulunmuyor.
                </td></tr>`;
                return;
            }

            tbody.innerHTML = detaylar.map(d => {
                const araToplam = (d.Adet || 0) * (d.Birimfiyat || 0);
                return `
                <tr>
                    <td><span class="badge badge-primary">#${d.SatisDetayID}</span></td>
                    <td><span class="badge badge-info">Satış #${d.SatisID}</span></td>
                    <td>${urunMap[d.UrunID] ? escapeHtml(urunMap[d.UrunID]) : `<span class="text-muted">Ürün #${d.UrunID}</span>`}</td>
                    <td>${d.Adet}</td>
                    <td><span class="price">${formatCurrency(d.Birimfiyat)}</span></td>
                    <td><span class="price">${formatCurrency(araToplam)}</span></td>
                    <td>
                        <div class="btn-group">
                            <button class="btn btn-edit btn-sm" onclick='SatisModule.showDetayForm(${JSON.stringify(d)})'>✏️ Düzenle</button>
                            <button class="btn btn-danger btn-sm" onclick="SatisModule.removeDetay(${d.SatisDetayID})">🗑️ Sil</button>
                        </div>
                    </td>
                </tr>
                `;
            }).join('');
        } catch (error) {
            tbody.innerHTML = `<tr><td colspan="7" class="table-empty">
                <span class="table-empty-icon">❌</span>Veriler yüklenirken hata oluştu.
            </td></tr>`;
            showToast('Satış detay verileri yüklenirken hata: ' + error.message, 'error');
        }
    }

    // --- SATIŞ FORM ---
    async function showSatisForm(satis = null) {
        const isEdit = satis !== null;
        const title = isEdit ? '✏️ Satış Düzenle' : '➕ Yeni Satış';

        let musteriler = [], personeller = [], receteler = [];
        try {
            const [musteriResult, personelResult, receteResult] = await Promise.all([
                apiCall('/api/musteri'),
                apiCall('/api/personel'),
                apiCall('/api/recete')
            ]);
            musteriler = musteriResult.data || [];
            personeller = personelResult.data || [];
            receteler = receteResult.data || [];
        } catch (error) {
            showToast('Dropdown verileri yüklenirken hata oluştu.', 'error');
        }

        const musteriOptions = musteriler.map(m =>
            `<option value="${m.MusteriID}" ${isEdit && satis.MusteriID == m.MusteriID ? 'selected' : ''}>${m.Ad} ${m.Soyad} (#${m.MusteriID})</option>`
        ).join('');

        const personelOptions = personeller.map(p =>
            `<option value="${p.PersonelID}" ${isEdit && satis.PersonelID == p.PersonelID ? 'selected' : ''}>${p.Ad} ${p.Soyad} - ${p.Gorev || ''} (#${p.PersonelID})</option>`
        ).join('');

        const receteOptions = receteler.map(r =>
            `<option value="${r.ReceteID}" ${isEdit && satis.ReceteID == r.ReceteID ? 'selected' : ''}>Reçete #${r.ReceteID} (${formatDate(r.ReceteTarihi)})</option>`
        ).join('');

        const formHtml = `
            <div class="form-group">
                <label class="form-label">Satış Tarihi</label>
                <input type="date" class="form-input" id="fSatisTarihi" value="${isEdit && satis.SatisTarihi ? satis.SatisTarihi.substring(0, 10) : new Date().toISOString().substring(0, 10)}" required>
            </div>
            <div class="form-group">
                <label class="form-label">Müşteri</label>
                <select class="form-select" id="fMusteriID" required>
                    <option value="">Müşteri seçiniz...</option>
                    ${musteriOptions}
                </select>
            </div>
            <div class="form-group">
                <label class="form-label">Personel</label>
                <select class="form-select" id="fPersonelID" required>
                    <option value="">Personel seçiniz...</option>
                    ${personelOptions}
                </select>
            </div>
            <div class="form-group">
                <label class="form-label">Reçete (Opsiyonel)</label>
                <select class="form-select" id="fReceteID">
                    <option value="">Reçete seçiniz (opsiyonel)...</option>
                    ${receteOptions}
                </select>
            </div>
            ${isEdit ? `
            <div class="form-group">
                <label class="form-label">Toplam Tutar (₺)</label>
                <input type="number" step="0.01" class="form-input" id="fToplamTutar" value="${satis.ToplamTutar || 0}" placeholder="Trigger ile otomatik hesaplanır">
            </div>
            ` : ''}
        `;

        showModal(title, formHtml, () => saveSatis(isEdit ? satis.SatisID : null, isEdit));
    }

    async function saveSatis(id, isEdit) {
        const body = {
            SatisTarihi: document.getElementById('fSatisTarihi').value || null,
            MusteriID: parseInt(document.getElementById('fMusteriID').value) || null,
            PersonelID: parseInt(document.getElementById('fPersonelID').value) || null,
            ReceteID: parseInt(document.getElementById('fReceteID').value) || null
        };

        if (isEdit) {
            const toplamTutarEl = document.getElementById('fToplamTutar');
            if (toplamTutarEl) {
                body.ToplamTutar = parseFloat(toplamTutarEl.value) || 0;
            }
        } else {
            body.ToplamTutar = 0;
        }

        if (!body.MusteriID || !body.PersonelID) {
            showToast('Müşteri ve Personel seçimi zorunludur.', 'error');
            return;
        }

        try {
            if (id) {
                await apiCall(`/api/satis/${id}`, 'PUT', body);
                showToast('✅ Satış başarıyla güncellendi.', 'success');
            } else {
                await apiCall('/api/satis', 'POST', body);
                showToast('✅ Yeni satış başarıyla oluşturuldu.', 'success');
            }
            closeModal();
            await render();
        } catch (error) {
            showToast('❌ Hata: ' + error.message, 'error');
        }
    }

    // --- SATIŞ DETAY FORM ---
    async function showDetayForm(detay = null) {
        const isEdit = detay !== null;
        const title = isEdit ? '✏️ Satış Detayı Düzenle' : '📦 Yeni Satış Detayı';

        let satislar = [], urunler = [];
        try {
            const [satisResult, urunResult] = await Promise.all([
                apiCall('/api/satis'),
                apiCall('/api/urun')
            ]);
            satislar = satisResult.data || [];
            urunler = urunResult.data || [];
        } catch (error) {
            showToast('Dropdown verileri yüklenirken hata oluştu.', 'error');
        }

        const satisOptions = satislar.map(s =>
            `<option value="${s.SatisID}" ${isEdit && detay.SatisID == s.SatisID ? 'selected' : ''}>Satış #${s.SatisID} - ${formatDate(s.SatisTarihi)} (${formatCurrency(s.ToplamTutar || 0)})</option>`
        ).join('');

        const urunOptions = urunler.map(u =>
            `<option value="${u.UrunID}" data-fiyat="${u.Fiyat}" ${isEdit && detay.UrunID == u.UrunID ? 'selected' : ''}>${u.UrunAdi} - ${u.Marka || ''} (${formatCurrency(u.Fiyat)}) [Stok: ${u.StokMiktari}]</option>`
        ).join('');

        const formHtml = `
            <div class="form-group">
                <label class="form-label">Satış</label>
                <select class="form-select" id="fSatisID" required>
                    <option value="">Satış seçiniz...</option>
                    ${satisOptions}
                </select>
            </div>
            <div class="form-group">
                <label class="form-label">Ürün</label>
                <select class="form-select" id="fUrunID" required onchange="SatisModule.onUrunChange()">
                    <option value="">Ürün seçiniz...</option>
                    ${urunOptions}
                </select>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label class="form-label">Adet</label>
                    <input type="number" min="1" class="form-input" id="fAdet" value="${isEdit ? detay.Adet : 1}" required placeholder="1">
                </div>
                <div class="form-group">
                    <label class="form-label">Birim Fiyat (₺)</label>
                    <input type="number" step="0.01" min="0" class="form-input" id="fBirimfiyat" value="${isEdit ? detay.Birimfiyat : ''}" required placeholder="Ürün seçince otomatik dolar">
                </div>
            </div>
        `;

        showModal(title, formHtml, () => saveDetay(isEdit ? detay.SatisDetayID : null));

        // If editing, auto-fill birimfiyat
        if (isEdit && detay.Birimfiyat) {
            setTimeout(() => {
                const fiyatInput = document.getElementById('fBirimfiyat');
                if (fiyatInput) fiyatInput.value = detay.Birimfiyat;
            }, 100);
        }
    }

    function onUrunChange() {
        const select = document.getElementById('fUrunID');
        const selectedOption = select.options[select.selectedIndex];
        const fiyat = selectedOption ? selectedOption.getAttribute('data-fiyat') : '';
        const fiyatInput = document.getElementById('fBirimfiyat');
        if (fiyatInput && fiyat) {
            fiyatInput.value = fiyat;
        }
    }

    async function saveDetay(id) {
        const body = {
            SatisID: parseInt(document.getElementById('fSatisID').value) || null,
            UrunID: parseInt(document.getElementById('fUrunID').value) || null,
            Adet: parseInt(document.getElementById('fAdet').value) || 1,
            Birimfiyat: parseFloat(document.getElementById('fBirimfiyat').value) || 0
        };

        if (!body.SatisID || !body.UrunID) {
            showToast('Satış ve Ürün seçimi zorunludur.', 'error');
            return;
        }

        if (body.Adet < 1) {
            showToast('Adet en az 1 olmalıdır.', 'error');
            return;
        }

        try {
            if (id) {
                await apiCall(`/api/satis-detay/${id}`, 'PUT', body);
                showToast('✅ Satış detayı başarıyla güncellendi.', 'success');
            } else {
                await apiCall('/api/satis-detay', 'POST', body);
                showToast('✅ Satış detayı eklendi! Trigger ile ürün stoğu otomatik düşürüldü ve toplam tutar güncellendi.', 'success');
            }
            closeModal();
            // Refresh both tables to show trigger effects
            await render();
        } catch (error) {
            showToast('❌ Hata: ' + error.message, 'error');
        }
    }

    // --- DELETE ---
    async function removeSatis(id) {
        showConfirm('Bu satış kaydını silmek istediğinize emin misiniz? İlişkili satış detayları da silinebilir.', async () => {
            try {
                await apiCall(`/api/satis/${id}`, 'DELETE');
                showToast('🗑️ Satış başarıyla silindi.', 'success');
                await render();
            } catch (error) {
                showToast('❌ Silme hatası: ' + error.message, 'error');
            }
        });
    }

    async function removeDetay(id) {
        showConfirm('Bu satış detayını silmek istediğinize emin misiniz?', async () => {
            try {
                await apiCall(`/api/satis-detay/${id}`, 'DELETE');
                showToast('🗑️ Satış detayı başarıyla silindi.', 'success');
                await render();
            } catch (error) {
                showToast('❌ Silme hatası: ' + error.message, 'error');
            }
        });
    }

    return { render, showSatisForm, showDetayForm, removeSatis, removeDetay, onUrunChange };
})();

window.SatisModule = SatisModule;

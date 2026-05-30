const express = require('express');
const router = express.Router();
const urunBl = require('../bl/urunBl');

// Listele
router.get('/', async (req, res) => {
    try {
        const data = await urunBl.listele();
        res.json({ success: true, data });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Ekle
router.post('/', async (req, res) => {
    try {
        await urunBl.ekle(req.body);
        res.json({ success: true, message: 'Ürün başarıyla eklendi' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Güncelle
router.put('/:id', async (req, res) => {
    try {
        await urunBl.guncelle(req.params.id, req.body);
        res.json({ success: true, message: 'Ürün başarıyla güncellendi' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Sil
router.delete('/:id', async (req, res) => {
    try {
        await urunBl.sil(req.params.id);
        res.json({ success: true, message: 'Ürün başarıyla silindi' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Stok Durumu
router.get('/:id/stok-durumu', async (req, res) => {
    try {
        const result = await urunBl.stokDurumu(req.params.id);
        res.json({ success: true, data: result });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;

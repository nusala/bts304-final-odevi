const express = require('express');
const router = express.Router();
const satisDetayBl = require('../bl/satisDetayBl');

// Listele
router.get('/', async (req, res) => {
    try {
        const data = await satisDetayBl.listele();
        res.json({ success: true, data });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Ekle
router.post('/', async (req, res) => {
    try {
        await satisDetayBl.ekle(req.body);
        res.json({ success: true, message: 'Satış detayı başarıyla eklendi' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Güncelle
router.put('/:id', async (req, res) => {
    try {
        await satisDetayBl.guncelle(req.params.id, req.body);
        res.json({ success: true, message: 'Satış detayı başarıyla güncellendi' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Sil
router.delete('/:id', async (req, res) => {
    try {
        await satisDetayBl.sil(req.params.id);
        res.json({ success: true, message: 'Satış detayı başarıyla silindi' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;

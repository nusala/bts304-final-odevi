const express = require('express');
const router = express.Router();
const satisBl = require('../bl/satisBl');

// Listele
router.get('/', async (req, res) => {
    try {
        const data = await satisBl.listele();
        res.json({ success: true, data });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Ekle
router.post('/', async (req, res) => {
    try {
        await satisBl.ekle(req.body);
        res.json({ success: true, message: 'Satış başarıyla eklendi' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Güncelle
router.put('/:id', async (req, res) => {
    try {
        await satisBl.guncelle(req.params.id, req.body);
        res.json({ success: true, message: 'Satış başarıyla güncellendi' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Sil
router.delete('/:id', async (req, res) => {
    try {
        await satisBl.sil(req.params.id);
        res.json({ success: true, message: 'Satış başarıyla silindi' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;

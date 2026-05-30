const express = require('express');
const router = express.Router();
const doktorBl = require('../bl/doktorBl');

// Listele
router.get('/', async (req, res) => {
    try {
        const data = await doktorBl.listele();
        res.json({ success: true, data });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Ekle
router.post('/', async (req, res) => {
    try {
        await doktorBl.ekle(req.body);
        res.json({ success: true, message: 'Doktor başarıyla eklendi' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Güncelle
router.put('/:id', async (req, res) => {
    try {
        await doktorBl.guncelle(req.params.id, req.body);
        res.json({ success: true, message: 'Doktor başarıyla güncellendi' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Sil
router.delete('/:id', async (req, res) => {
    try {
        await doktorBl.sil(req.params.id);
        res.json({ success: true, message: 'Doktor başarıyla silindi' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;

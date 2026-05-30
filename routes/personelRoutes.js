const express = require('express');
const router = express.Router();
const personelBl = require('../bl/personelBl');

// Listele
router.get('/', async (req, res) => {
    try {
        const data = await personelBl.listele();
        res.json({ success: true, data });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Ekle
router.post('/', async (req, res) => {
    try {
        await personelBl.ekle(req.body);
        res.json({ success: true, message: 'Personel başarıyla eklendi' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Güncelle
router.put('/:id', async (req, res) => {
    try {
        await personelBl.guncelle(req.params.id, req.body);
        res.json({ success: true, message: 'Personel başarıyla güncellendi' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Sil
router.delete('/:id', async (req, res) => {
    try {
        await personelBl.sil(req.params.id);
        res.json({ success: true, message: 'Personel başarıyla silindi' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;

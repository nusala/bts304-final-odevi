const express = require('express');
const router = express.Router();
const musteriBl = require('../bl/musteriBl');

// Listele
router.get('/', async (req, res) => {
    try {
        const data = await musteriBl.listele();
        res.json({ success: true, data });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Ekle
router.post('/', async (req, res) => {
    try {
        await musteriBl.ekle(req.body);
        res.json({ success: true, message: 'Müşteri başarıyla eklendi' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Güncelle
router.put('/:id', async (req, res) => {
    try {
        await musteriBl.guncelle(req.params.id, req.body);
        res.json({ success: true, message: 'Müşteri başarıyla güncellendi' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Sil
router.delete('/:id', async (req, res) => {
    try {
        await musteriBl.sil(req.params.id);
        res.json({ success: true, message: 'Müşteri başarıyla silindi' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Yaş Hesapla
router.get('/:id/yas', async (req, res) => {
    try {
        const result = await musteriBl.yasHesapla(req.params.id);
        res.json({ success: true, data: result });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;

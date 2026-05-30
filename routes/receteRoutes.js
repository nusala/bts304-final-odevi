const express = require('express');
const router = express.Router();
const receteBl = require('../bl/receteBl');

// Listele
router.get('/', async (req, res) => {
    try {
        const data = await receteBl.listele();
        res.json({ success: true, data });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Ekle
router.post('/', async (req, res) => {
    try {
        await receteBl.ekle(req.body);
        res.json({ success: true, message: 'Reçete başarıyla eklendi' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Güncelle
router.put('/:id', async (req, res) => {
    try {
        await receteBl.guncelle(req.params.id, req.body);
        res.json({ success: true, message: 'Reçete başarıyla güncellendi' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Sil
router.delete('/:id', async (req, res) => {
    try {
        await receteBl.sil(req.params.id);
        res.json({ success: true, message: 'Reçete başarıyla silindi' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;

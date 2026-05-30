const express = require('express');
const cors = require('cors');
const path = require('path');
const pool = require('./config/db');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());

// Statik dosyalar
app.use(express.static(path.join(__dirname, 'public')));

// Route tanımlamaları
const musteriRoutes = require('./routes/musteriRoutes');
const doktorRoutes = require('./routes/doktorRoutes');
const urunRoutes = require('./routes/urunRoutes');
const personelRoutes = require('./routes/personelRoutes');
const receteRoutes = require('./routes/receteRoutes');
const satisRoutes = require('./routes/satisRoutes');
const satisDetayRoutes = require('./routes/satisDetayRoutes');

app.use('/api/musteri', musteriRoutes);
app.use('/api/doktor', doktorRoutes);
app.use('/api/urun', urunRoutes);
app.use('/api/personel', personelRoutes);
app.use('/api/recete', receteRoutes);
app.use('/api/satis', satisRoutes);
app.use('/api/satis-detay', satisDetayRoutes);

// SPA catch-all route
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Veritabanı bağlantı testi ve sunucu başlatma
pool.getConnection()
    .then(connection => {
        console.log('Veritabanı bağlantısı başarılı');
        connection.release();
        app.listen(PORT, () => {
            console.log(`Optik Otomasyon Sunucusu http://localhost:${PORT} adresinde çalışıyor`);
        });
    })
    .catch(err => {
        console.error('Veritabanı bağlantı hatası:', err.message);
        // Veritabanı bağlantısı olmasa bile sunucuyu başlat
        app.listen(PORT, () => {
            console.log(`Optik Otomasyon Sunucusu http://localhost:${PORT} adresinde çalışıyor (DB bağlantısı yok)`);
        });
    });

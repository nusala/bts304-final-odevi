const pool = require('../config/db');

const musteriDal = {
    ekle: async (ad, soyad, telefon, eposta, adres, dogumTarihi) => {
        const [rows] = await pool.execute(
            'CALL sp_Musteri_Ekle(?, ?, ?, ?, ?, ?)',
            [ad, soyad, telefon, eposta, adres, dogumTarihi]
        );
        return rows[0];
    },

    guncelle: async (musteriID, ad, soyad, telefon, eposta, adres, dogumTarihi) => {
        const [rows] = await pool.execute(
            'CALL sp_Musteri_Guncelle(?, ?, ?, ?, ?, ?, ?)',
            [musteriID, ad, soyad, telefon, eposta, adres, dogumTarihi]
        );
        return rows[0];
    },

    sil: async (musteriID) => {
        const [rows] = await pool.execute(
            'CALL sp_Musteri_Sil(?)',
            [musteriID]
        );
        return rows[0];
    },

    listele: async () => {
        const [rows] = await pool.execute('CALL sp_Musteri_Listele()');
        return rows[0];
    },

    yasHesapla: async (musteriID) => {
        const [rows] = await pool.execute(
            'SELECT fn_MusteriYasHesapla(?) as Yas',
            [musteriID]
        );
        return rows[0] ? rows[0].Yas : 0;
    }
};

module.exports = musteriDal;

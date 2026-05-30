const pool = require('../config/db');

const urunDal = {
    ekle: async (urunAdi, urunTuru, marka, fiyat, stokMiktari) => {
        const [rows] = await pool.execute(
            'CALL sp_Urun_Ekle(?, ?, ?, ?, ?)',
            [urunAdi, urunTuru, marka, fiyat, stokMiktari]
        );
        return rows[0];
    },

    guncelle: async (urunID, urunAdi, urunTuru, marka, fiyat, stokMiktari) => {
        const [rows] = await pool.execute(
            'CALL sp_Urun_Guncelle(?, ?, ?, ?, ?, ?)',
            [urunID, urunAdi, urunTuru, marka, fiyat, stokMiktari]
        );
        return rows[0];
    },

    sil: async (urunID) => {
        const [rows] = await pool.execute(
            'CALL sp_Urun_Sil(?)',
            [urunID]
        );
        return rows[0];
    },

    listele: async () => {
        const [rows] = await pool.execute('CALL sp_Urun_Listele()');
        return rows[0];
    },

    stokDurumu: async (urunID) => {
        const [rows] = await pool.execute(
            'SELECT fn_StokDurumuGetir(?) as Durum',
            [urunID]
        );
        return rows[0] ? rows[0].Durum : null;
    }
};

module.exports = urunDal;

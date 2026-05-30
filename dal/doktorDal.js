const pool = require('../config/db');

const doktorDal = {
    ekle: async (ad, soyad, uzmanlikAlani, telefon) => {
        const [rows] = await pool.execute(
            'CALL sp_Doktor_Ekle(?, ?, ?, ?)',
            [ad, soyad, uzmanlikAlani, telefon]
        );
        return rows[0];
    },

    guncelle: async (doktorID, ad, soyad, uzmanlikAlani, telefon) => {
        const [rows] = await pool.execute(
            'CALL sp_Doktor_Guncelle(?, ?, ?, ?, ?)',
            [doktorID, ad, soyad, uzmanlikAlani, telefon]
        );
        return rows[0];
    },

    sil: async (doktorID) => {
        const [rows] = await pool.execute(
            'CALL sp_Doktor_Sil(?)',
            [doktorID]
        );
        return rows[0];
    },

    listele: async () => {
        const [rows] = await pool.execute('CALL sp_Doktor_Listele()');
        return rows[0];
    }
};

module.exports = doktorDal;

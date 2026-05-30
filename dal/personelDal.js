const pool = require('../config/db');

const personelDal = {
    ekle: async (ad, soyad, gorev, telefon) => {
        const [rows] = await pool.execute(
            'CALL sp_Personel_Ekle(?, ?, ?, ?)',
            [ad, soyad, gorev, telefon]
        );
        return rows[0];
    },

    guncelle: async (personelID, ad, soyad, gorev, telefon) => {
        const [rows] = await pool.execute(
            'CALL sp_Personel_Guncelle(?, ?, ?, ?, ?)',
            [personelID, ad, soyad, gorev, telefon]
        );
        return rows[0];
    },

    sil: async (personelID) => {
        const [rows] = await pool.execute(
            'CALL sp_Personel_Sil(?)',
            [personelID]
        );
        return rows[0];
    },

    listele: async () => {
        const [rows] = await pool.execute('CALL sp_Personel_Listele()');
        return rows[0];
    }
};

module.exports = personelDal;

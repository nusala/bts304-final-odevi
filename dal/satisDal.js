const pool = require('../config/db');

const satisDal = {
    ekle: async (satisTarihi, toplamTutar, musteriID, personelID, receteID) => {
        const [rows] = await pool.execute(
            'CALL sp_Satis_Ekle(?, ?, ?, ?, ?)',
            [satisTarihi, toplamTutar, musteriID, personelID, receteID]
        );
        return rows[0];
    },

    guncelle: async (satisID, satisTarihi, toplamTutar, musteriID, personelID, receteID) => {
        const [rows] = await pool.execute(
            'CALL sp_Satis_Guncelle(?, ?, ?, ?, ?, ?)',
            [satisID, satisTarihi, toplamTutar, musteriID, personelID, receteID]
        );
        return rows[0];
    },

    sil: async (satisID) => {
        const [rows] = await pool.execute(
            'CALL sp_Satis_Sil(?)',
            [satisID]
        );
        return rows[0];
    },

    listele: async () => {
        const [rows] = await pool.execute('CALL sp_Satis_Listele()');
        return rows[0];
    }
};

module.exports = satisDal;

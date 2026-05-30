const pool = require('../config/db');

const receteDal = {
    ekle: async (receteTarihi, sagGozNumara, solGozNumara, musteriID, doktorID) => {
        const [rows] = await pool.execute(
            'CALL sp_Recete_Ekle(?, ?, ?, ?, ?)',
            [receteTarihi, sagGozNumara, solGozNumara, musteriID, doktorID]
        );
        return rows[0];
    },

    guncelle: async (receteID, receteTarihi, sagGozNumara, solGozNumara, musteriID, doktorID) => {
        const [rows] = await pool.execute(
            'CALL sp_Recete_Guncelle(?, ?, ?, ?, ?, ?)',
            [receteID, receteTarihi, sagGozNumara, solGozNumara, musteriID, doktorID]
        );
        return rows[0];
    },

    sil: async (receteID) => {
        const [rows] = await pool.execute(
            'CALL sp_Recete_Sil(?)',
            [receteID]
        );
        return rows[0];
    },

    listele: async () => {
        const [rows] = await pool.execute('CALL sp_Recete_Listele()');
        return rows[0];
    }
};

module.exports = receteDal;

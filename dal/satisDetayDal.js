const pool = require('../config/db');

const satisDetayDal = {
    ekle: async (satisID, urunID, adet, birimfiyat) => {
        const [rows] = await pool.execute(
            'CALL sp_SatisDetay_Ekle(?, ?, ?, ?)',
            [satisID, urunID, adet, birimfiyat]
        );
        return rows[0];
    },

    guncelle: async (satisDetayID, satisID, urunID, adet, birimfiyat) => {
        const [rows] = await pool.execute(
            'CALL sp_SatisDetay_Guncelle(?, ?, ?, ?, ?)',
            [satisDetayID, satisID, urunID, adet, birimfiyat]
        );
        return rows[0];
    },

    sil: async (satisDetayID) => {
        const [rows] = await pool.execute(
            'CALL sp_SatisDetay_Sil(?)',
            [satisDetayID]
        );
        return rows[0];
    },

    listele: async () => {
        const [rows] = await pool.execute('CALL sp_SatisDetay_Listele()');
        return rows[0];
    }
};

module.exports = satisDetayDal;

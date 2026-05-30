const satisDal = require('../dal/satisDal');

const satisBl = {
    ekle: async (data) => {
        if (!data.MusteriID || !data.PersonelID) {
            throw new Error('Zorunlu alanlar eksik: MusteriID ve PersonelID girilmelidir');
        }
        return await satisDal.ekle(
            data.SatisTarihi || new Date(),
            data.ToplamTutar || 0,
            data.MusteriID,
            data.PersonelID,
            data.ReceteID || null
        );
    },

    guncelle: async (id, data) => {
        if (!id) throw new Error('ID gerekli');
        return await satisDal.guncelle(
            id,
            data.SatisTarihi,
            data.ToplamTutar,
            data.MusteriID,
            data.PersonelID,
            data.ReceteID || null
        );
    },

    sil: async (id) => {
        if (!id) throw new Error('ID gerekli');
        return await satisDal.sil(id);
    },

    listele: async () => {
        return await satisDal.listele();
    }
};

module.exports = satisBl;

const doktorDal = require('../dal/doktorDal');

const doktorBl = {
    ekle: async (data) => {
        if (!data.Ad || !data.Soyad || !data.Telefon) {
            throw new Error('Zorunlu alanlar eksik: Ad, Soyad ve Telefon girilmelidir');
        }
        return await doktorDal.ekle(
            data.Ad,
            data.Soyad,
            data.UzmanlikAlani || 'Göz Hastalıkları',
            data.Telefon
        );
    },

    guncelle: async (id, data) => {
        if (!id) throw new Error('ID gerekli');
        return await doktorDal.guncelle(
            id,
            data.Ad,
            data.Soyad,
            data.UzmanlikAlani || 'Göz Hastalıkları',
            data.Telefon
        );
    },

    sil: async (id) => {
        if (!id) throw new Error('ID gerekli');
        return await doktorDal.sil(id);
    },

    listele: async () => {
        return await doktorDal.listele();
    }
};

module.exports = doktorBl;

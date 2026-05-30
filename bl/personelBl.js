const personelDal = require('../dal/personelDal');

const personelBl = {
    ekle: async (data) => {
        if (!data.Ad || !data.Soyad || !data.Gorev || !data.Telefon) {
            throw new Error('Zorunlu alanlar eksik: Ad, Soyad, Gorev ve Telefon girilmelidir');
        }
        return await personelDal.ekle(
            data.Ad,
            data.Soyad,
            data.Gorev,
            data.Telefon
        );
    },

    guncelle: async (id, data) => {
        if (!id) throw new Error('ID gerekli');
        return await personelDal.guncelle(
            id,
            data.Ad,
            data.Soyad,
            data.Gorev,
            data.Telefon
        );
    },

    sil: async (id) => {
        if (!id) throw new Error('ID gerekli');
        return await personelDal.sil(id);
    },

    listele: async () => {
        return await personelDal.listele();
    }
};

module.exports = personelBl;

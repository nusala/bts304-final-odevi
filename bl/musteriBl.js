const musteriDal = require('../dal/musteriDal');

const musteriBl = {
    ekle: async (data) => {
        if (!data.Ad || !data.Soyad || !data.Telefon) {
            throw new Error('Zorunlu alanlar eksik: Ad, Soyad ve Telefon girilmelidir');
        }
        return await musteriDal.ekle(
            data.Ad,
            data.Soyad,
            data.Telefon,
            data.Eposta || null,
            data.Adres || null,
            data.DogumTarihi || null
        );
    },

    guncelle: async (id, data) => {
        if (!id) throw new Error('ID gerekli');
        return await musteriDal.guncelle(
            id,
            data.Ad,
            data.Soyad,
            data.Telefon,
            data.Eposta || null,
            data.Adres || null,
            data.DogumTarihi || null
        );
    },

    sil: async (id) => {
        if (!id) throw new Error('ID gerekli');
        return await musteriDal.sil(id);
    },

    listele: async () => {
        return await musteriDal.listele();
    },

    yasHesapla: async (musteriID) => {
        if (!musteriID) throw new Error('Müşteri ID gerekli');
        return await musteriDal.yasHesapla(musteriID);
    }
};

module.exports = musteriBl;

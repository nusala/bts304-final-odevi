const urunDal = require('../dal/urunDal');

const urunBl = {
    ekle: async (data) => {
        if (!data.UrunAdi || !data.UrunTuru) {
            throw new Error('Zorunlu alanlar eksik: UrunAdi ve UrunTuru girilmelidir');
        }
        if (!data.Fiyat || data.Fiyat <= 0) {
            throw new Error('Fiyat 0\'dan büyük olmalıdır');
        }
        if (data.StokMiktari === undefined || data.StokMiktari === null || data.StokMiktari < 0) {
            throw new Error('StokMiktari 0 veya daha büyük olmalıdır');
        }
        return await urunDal.ekle(
            data.UrunAdi,
            data.UrunTuru,
            data.Marka || null,
            data.Fiyat,
            data.StokMiktari
        );
    },

    guncelle: async (id, data) => {
        if (!id) throw new Error('ID gerekli');
        if (data.Fiyat !== undefined && data.Fiyat <= 0) {
            throw new Error('Fiyat 0\'dan büyük olmalıdır');
        }
        if (data.StokMiktari !== undefined && data.StokMiktari < 0) {
            throw new Error('StokMiktari 0 veya daha büyük olmalıdır');
        }
        return await urunDal.guncelle(
            id,
            data.UrunAdi,
            data.UrunTuru,
            data.Marka || null,
            data.Fiyat,
            data.StokMiktari
        );
    },

    sil: async (id) => {
        if (!id) throw new Error('ID gerekli');
        return await urunDal.sil(id);
    },

    listele: async () => {
        return await urunDal.listele();
    },

    stokDurumu: async (urunID) => {
        if (!urunID) throw new Error('Ürün ID gerekli');
        return await urunDal.stokDurumu(urunID);
    }
};

module.exports = urunBl;

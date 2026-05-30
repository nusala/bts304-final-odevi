const satisDetayDal = require('../dal/satisDetayDal');

const satisDetayBl = {
    ekle: async (data) => {
        if (!data.SatisID || !data.UrunID) {
            throw new Error('Zorunlu alanlar eksik: SatisID ve UrunID girilmelidir');
        }
        if (!data.Adet || data.Adet <= 0) {
            throw new Error('Adet 0\'dan büyük olmalıdır');
        }
        if (!data.Birimfiyat || data.Birimfiyat <= 0) {
            throw new Error('Birimfiyat 0\'dan büyük olmalıdır');
        }
        return await satisDetayDal.ekle(
            data.SatisID,
            data.UrunID,
            data.Adet,
            data.Birimfiyat
        );
    },

    guncelle: async (id, data) => {
        if (!id) throw new Error('ID gerekli');
        if (data.Adet !== undefined && data.Adet <= 0) {
            throw new Error('Adet 0\'dan büyük olmalıdır');
        }
        if (data.Birimfiyat !== undefined && data.Birimfiyat <= 0) {
            throw new Error('Birimfiyat 0\'dan büyük olmalıdır');
        }
        return await satisDetayDal.guncelle(
            id,
            data.SatisID,
            data.UrunID,
            data.Adet,
            data.Birimfiyat
        );
    },

    sil: async (id) => {
        if (!id) throw new Error('ID gerekli');
        return await satisDetayDal.sil(id);
    },

    listele: async () => {
        return await satisDetayDal.listele();
    }
};

module.exports = satisDetayBl;

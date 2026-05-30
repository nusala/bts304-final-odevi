const receteDal = require('../dal/receteDal');

const receteBl = {
    ekle: async (data) => {
        if (!data.ReceteTarihi || !data.MusteriID || !data.DoktorID) {
            throw new Error('Zorunlu alanlar eksik: ReceteTarihi, MusteriID ve DoktorID girilmelidir');
        }
        if (data.SagGozNumara === undefined || data.SagGozNumara === null || isNaN(data.SagGozNumara)) {
            throw new Error('SagGozNumara geçerli bir sayı olmalıdır');
        }
        if (data.SolGozNumara === undefined || data.SolGozNumara === null || isNaN(data.SolGozNumara)) {
            throw new Error('SolGozNumara geçerli bir sayı olmalıdır');
        }
        return await receteDal.ekle(
            data.ReceteTarihi,
            data.SagGozNumara,
            data.SolGozNumara,
            data.MusteriID,
            data.DoktorID
        );
    },

    guncelle: async (id, data) => {
        if (!id) throw new Error('ID gerekli');
        if (data.SagGozNumara !== undefined && isNaN(data.SagGozNumara)) {
            throw new Error('SagGozNumara geçerli bir sayı olmalıdır');
        }
        if (data.SolGozNumara !== undefined && isNaN(data.SolGozNumara)) {
            throw new Error('SolGozNumara geçerli bir sayı olmalıdır');
        }
        return await receteDal.guncelle(
            id,
            data.ReceteTarihi,
            data.SagGozNumara,
            data.SolGozNumara,
            data.MusteriID,
            data.DoktorID
        );
    },

    sil: async (id) => {
        if (!id) throw new Error('ID gerekli');
        return await receteDal.sil(id);
    },

    listele: async () => {
        return await receteDal.listele();
    }
};

module.exports = receteBl;

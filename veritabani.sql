DROP DATABASE IF EXISTS OptikOtomasyon;
CREATE DATABASE OptikOtomasyon;
USE OptikOtomasyon;

CREATE TABLE Musteri (
    MusteriID INT AUTO_INCREMENT PRIMARY KEY,
    Ad VARCHAR(50) NOT NULL,
    Soyad VARCHAR(50) NOT NULL,
    Telefon VARCHAR(15) UNIQUE NOT NULL,
    Eposta VARCHAR(100) UNIQUE,
    Adres TEXT,
    DogumTarihi DATE
);

CREATE TABLE Doktor (
    DoktorID INT AUTO_INCREMENT PRIMARY KEY,
    Ad VARCHAR(50) NOT NULL,
    Soyad VARCHAR(50) NOT NULL,
    UzmanlikAlani VARCHAR(50) DEFAULT 'Göz Hastalıkları',
    Telefon VARCHAR(15) UNIQUE NOT NULL
);

CREATE TABLE Recete (
    ReceteID INT AUTO_INCREMENT PRIMARY KEY,
    ReceteTarihi DATE,
    SagGozNumara DECIMAL(4,2) NOT NULL,
    SolGozNumara DECIMAL(4,2) NOT NULL,
    MusteriID INT NOT NULL,
    DoktorID INT NOT NULL,
    FOREIGN KEY (MusteriID) REFERENCES Musteri(MusteriID) ON DELETE CASCADE,
    FOREIGN KEY (DoktorID) REFERENCES Doktor(DoktorID) ON DELETE CASCADE
);

CREATE TABLE Urun (
    UrunID INT AUTO_INCREMENT PRIMARY KEY,
    UrunAdi VARCHAR(100) NOT NULL,
    UrunTuru VARCHAR(50) NOT NULL,
    Marka VARCHAR(50),
    Fiyat DECIMAL(10,2) NOT NULL CHECK (Fiyat > 0),
    StokMiktari INT DEFAULT 0 CHECK (StokMiktari >= 0)
);

CREATE TABLE Personel (
    PersonelID INT AUTO_INCREMENT PRIMARY KEY,
    Ad VARCHAR(50) NOT NULL,
    Soyad VARCHAR(50) NOT NULL,
    Gorev VARCHAR(50) NOT NULL,
    Telefon VARCHAR(15) UNIQUE NOT NULL
);

CREATE TABLE Satis (
    SatisID INT AUTO_INCREMENT PRIMARY KEY,
    SatisTarihi DATETIME DEFAULT CURRENT_TIMESTAMP,
    ToplamTutar DECIMAL(10,2) DEFAULT 0 CHECK (ToplamTutar >= 0),
    MusteriID INT NOT NULL,
    PersonelID INT NOT NULL,
    ReceteID INT NULL, 
    FOREIGN KEY (MusteriID) REFERENCES Musteri(MusteriID),
    FOREIGN KEY (PersonelID) REFERENCES Personel(PersonelID),
    FOREIGN KEY (ReceteID) REFERENCES Recete(ReceteID)
);

CREATE TABLE SatisDetay (
    SatisDetayID INT AUTO_INCREMENT PRIMARY KEY,
    SatisID INT NOT NULL,
    UrunID INT NOT NULL,
    Adet INT NOT NULL CHECK (Adet > 0),
    Birimfiyat DECIMAL(10,2) NOT NULL CHECK (Birimfiyat > 0),
    FOREIGN KEY (SatisID) REFERENCES Satis(SatisID) ON DELETE CASCADE,
    FOREIGN KEY (UrunID) REFERENCES Urun(UrunID) ON DELETE CASCADE
);

DELIMITER //

CREATE PROCEDURE sp_Musteri_Ekle(IN p_Ad VARCHAR(50), IN p_Soyad VARCHAR(50), IN p_Telefon VARCHAR(15), IN p_Eposta VARCHAR(100), IN p_Adres TEXT, IN p_DogumTarihi DATE)
BEGIN
    INSERT INTO Musteri (Ad, Soyad, Telefon, Eposta, Adres, DogumTarihi) 
    VALUES (p_Ad, p_Soyad, p_Telefon, p_Eposta, p_Adres, p_DogumTarihi);
END //

CREATE PROCEDURE sp_Musteri_Guncelle(IN p_MusteriID INT, IN p_Ad VARCHAR(50), IN p_Soyad VARCHAR(50), IN p_Telefon VARCHAR(15), IN p_Eposta VARCHAR(100), IN p_Adres TEXT, IN p_DogumTarihi DATE)
BEGIN
    UPDATE Musteri 
    SET Ad = p_Ad, Soyad = p_Soyad, Telefon = p_Telefon, Eposta = p_Eposta, Adres = p_Adres, DogumTarihi = p_DogumTarihi 
    WHERE MusteriID = p_MusteriID;
END //

CREATE PROCEDURE sp_Musteri_Sil(IN p_MusteriID INT)
BEGIN
    DELETE FROM Musteri WHERE MusteriID = p_MusteriID;
END //

CREATE PROCEDURE sp_Musteri_Listele()
BEGIN
    SELECT * FROM Musteri;
END //

CREATE PROCEDURE sp_Doktor_Ekle(IN p_Ad VARCHAR(50), IN p_Soyad VARCHAR(50), IN p_UzmanlikAlani VARCHAR(50), IN p_Telefon VARCHAR(15))
BEGIN
    INSERT INTO Doktor (Ad, Soyad, UzmanlikAlani, Telefon) 
    VALUES (p_Ad, p_Soyad, p_UzmanlikAlani, p_Telefon);
END //

CREATE PROCEDURE sp_Doktor_Guncelle(IN p_DoktorID INT, IN p_Ad VARCHAR(50), IN p_Soyad VARCHAR(50), IN p_UzmanlikAlani VARCHAR(50), IN p_Telefon VARCHAR(15))
BEGIN
    UPDATE Doktor 
    SET Ad = p_Ad, Soyad = p_Soyad, UzmanlikAlani = p_UzmanlikAlani, Telefon = p_Telefon 
    WHERE DoktorID = p_DoktorID;
END //

CREATE PROCEDURE sp_Doktor_Sil(IN p_DoktorID INT)
BEGIN
    DELETE FROM Doktor WHERE DoktorID = p_DoktorID;
END //

CREATE PROCEDURE sp_Doktor_Listele()
BEGIN
    SELECT * FROM Doktor;
END //

CREATE PROCEDURE sp_Urun_Ekle(IN p_UrunAdi VARCHAR(100), IN p_UrunTuru VARCHAR(50), IN p_Marka VARCHAR(50), IN p_Fiyat DECIMAL(10,2), IN p_StokMiktari INT)
BEGIN
    INSERT INTO Urun (UrunAdi, UrunTuru, Marka, Fiyat, StokMiktari) 
    VALUES (p_UrunAdi, p_UrunTuru, p_Marka, p_Fiyat, p_StokMiktari);
END //

CREATE PROCEDURE sp_Urun_Guncelle(IN p_UrunID INT, IN p_UrunAdi VARCHAR(100), IN p_UrunTuru VARCHAR(50), IN p_Marka VARCHAR(50), IN p_Fiyat DECIMAL(10,2), IN p_StokMiktari INT)
BEGIN
    UPDATE Urun 
    SET UrunAdi = p_UrunAdi, UrunTuru = p_UrunTuru, Marka = p_Marka, Fiyat = p_Fiyat, StokMiktari = p_StokMiktari 
    WHERE UrunID = p_UrunID;
END //

CREATE PROCEDURE sp_Urun_Sil(IN p_UrunID INT)
BEGIN
    DELETE FROM Urun WHERE UrunID = p_UrunID;
END //

CREATE PROCEDURE sp_Urun_Listele()
BEGIN
    SELECT * FROM Urun;
END //

CREATE PROCEDURE sp_Personel_Ekle(IN p_Ad VARCHAR(50), IN p_Soyad VARCHAR(50), IN p_Gorev VARCHAR(50), IN p_Telefon VARCHAR(15))
BEGIN
    INSERT INTO Personel (Ad, Soyad, Gorev, Telefon) 
    VALUES (p_Ad, p_Soyad, p_Gorev, p_Telefon);
END //

CREATE PROCEDURE sp_Personel_Guncelle(IN p_PersonelID INT, IN p_Ad VARCHAR(50), IN p_Soyad VARCHAR(50), IN p_Gorev VARCHAR(50), IN p_Telefon VARCHAR(15))
BEGIN
    UPDATE Personel 
    SET Ad = p_Ad, Soyad = p_Soyad, Gorev = p_Gorev, Telefon = p_Telefon 
    WHERE PersonelID = p_PersonelID;
END //

CREATE PROCEDURE sp_Personel_Sil(IN p_PersonelID INT)
BEGIN
    DELETE FROM Personel WHERE PersonelID = p_PersonelID;
END //

CREATE PROCEDURE sp_Personel_Listele()
BEGIN
    SELECT * FROM Personel;
END //

CREATE PROCEDURE sp_Recete_Ekle(IN p_ReceteTarihi DATE, IN p_SagGozNumara DECIMAL(4,2), IN p_SolGozNumara DECIMAL(4,2), IN p_MusteriID INT, IN p_DoktorID INT)
BEGIN
    INSERT INTO Recete (ReceteTarihi, SagGozNumara, SolGozNumara, MusteriID, DoktorID) 
    VALUES (p_ReceteTarihi, p_SagGozNumara, p_SolGozNumara, p_MusteriID, p_DoktorID);
END //

CREATE PROCEDURE sp_Recete_Guncelle(IN p_ReceteID INT, IN p_ReceteTarihi DATE, IN p_SagGozNumara DECIMAL(4,2), IN p_SolGozNumara DECIMAL(4,2), IN p_MusteriID INT, IN p_DoktorID INT)
BEGIN
    UPDATE Recete 
    SET ReceteTarihi = p_ReceteTarihi, SagGozNumara = p_SagGozNumara, SolGozNumara = p_SolGozNumara, MusteriID = p_MusteriID, DoktorID = p_DoktorID 
    WHERE ReceteID = p_ReceteID;
END //

CREATE PROCEDURE sp_Recete_Sil(IN p_ReceteID INT)
BEGIN
    DELETE FROM Recete WHERE ReceteID = p_ReceteID;
END //

CREATE PROCEDURE sp_Recete_Listele()
BEGIN
    SELECT * FROM Recete;
END //

CREATE PROCEDURE sp_Satis_Ekle(IN p_SatisTarihi DATETIME, IN p_ToplamTutar DECIMAL(10,2), IN p_MusteriID INT, IN p_PersonelID INT, IN p_ReceteID INT)
BEGIN
    INSERT INTO Satis (SatisTarihi, ToplamTutar, MusteriID, PersonelID, ReceteID) 
    VALUES (p_SatisTarihi, p_ToplamTutar, p_MusteriID, p_PersonelID, p_ReceteID);
END //

CREATE PROCEDURE sp_Satis_Guncelle(IN p_SatisID INT, IN p_SatisTarihi DATETIME, IN p_ToplamTutar DECIMAL(10,2), IN p_MusteriID INT, IN p_PersonelID INT, IN p_ReceteID INT)
BEGIN
    UPDATE Satis 
    SET SatisTarihi = p_SatisTarihi, ToplamTutar = p_ToplamTutar, MusteriID = p_MusteriID, PersonelID = p_PersonelID, ReceteID = p_ReceteID 
    WHERE SatisID = p_SatisID;
END //

CREATE PROCEDURE sp_Satis_Sil(IN p_SatisID INT)
BEGIN
    DELETE FROM Satis WHERE SatisID = p_SatisID;
END //

CREATE PROCEDURE sp_Satis_Listele()
BEGIN
    SELECT * FROM Satis;
END //

CREATE PROCEDURE sp_SatisDetay_Ekle(IN p_SatisID INT, IN p_UrunID INT, IN p_Adet INT, IN p_Birimfiyat DECIMAL(10,2))
BEGIN
    INSERT INTO SatisDetay (SatisID, UrunID, Adet, Birimfiyat) 
    VALUES (p_SatisID, p_UrunID, p_Adet, p_Birimfiyat);
END //

CREATE PROCEDURE sp_SatisDetay_Guncelle(IN p_SatisDetayID INT, IN p_SatisID INT, IN p_UrunID INT, IN p_Adet INT, IN p_Birimfiyat DECIMAL(10,2))
BEGIN
    UPDATE SatisDetay 
    SET SatisID = p_SatisID, UrunID = p_UrunID, Adet = p_Adet, Birimfiyat = p_Birimfiyat 
    WHERE SatisDetayID = p_SatisDetayID;
END //

CREATE PROCEDURE sp_SatisDetay_Sil(IN p_SatisDetayID INT)
BEGIN
    DELETE FROM SatisDetay WHERE SatisDetayID = p_SatisDetayID;
END //

CREATE PROCEDURE sp_SatisDetay_Listele()
BEGIN
    SELECT * FROM SatisDetay;
END //

DELIMITER ;

DELIMITER //

CREATE FUNCTION fn_MusteriYasHesapla(p_MusteriID INT) 
RETURNS INT
READS SQL DATA
BEGIN
    DECLARE v_Yas INT;
    SELECT TIMESTAMPDIFF(YEAR, DogumTarihi, CURDATE()) INTO v_Yas 
    FROM Musteri 
    WHERE MusteriID = p_MusteriID;
    
    RETURN IFNULL(v_Yas, 0);
END //

CREATE FUNCTION fn_StokDurumuGetir(p_UrunID INT) 
RETURNS VARCHAR(50)
READS SQL DATA
BEGIN
    DECLARE v_Stok INT;
    DECLARE v_Durum VARCHAR(50);
    
    SELECT StokMiktari INTO v_Stok FROM Urun WHERE UrunID = p_UrunID;
    
    IF v_Stok > 20 THEN 
        SET v_Durum = 'Stok Yeterli';
    ELSEIF v_Stok > 0 THEN 
        SET v_Durum = 'Kritik Stok';
    ELSE 
        SET v_Durum = 'Stokta Yok';
    END IF;
    
    RETURN v_Durum;
END //

DELIMITER ;

DELIMITER //

CREATE TRIGGER trg_StokDusur
AFTER INSERT ON SatisDetay
FOR EACH ROW
BEGIN
    UPDATE Urun 
    SET StokMiktari = StokMiktari - NEW.Adet 
    WHERE UrunID = NEW.UrunID;
END //

CREATE TRIGGER trg_ToplamTutarGuncelle
AFTER INSERT ON SatisDetay
FOR EACH ROW
BEGIN
    UPDATE Satis 
    SET ToplamTutar = ToplamTutar + (NEW.Adet * NEW.Birimfiyat) 
    WHERE SatisID = NEW.SatisID;
END //

DELIMITER ;

USE OptikOtomasyon;

SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE SatisDetay;
TRUNCATE TABLE Satis;
TRUNCATE TABLE Recete;
TRUNCATE TABLE Urun;
TRUNCATE TABLE Personel;
TRUNCATE TABLE Doktor;
TRUNCATE TABLE Musteri;
SET FOREIGN_KEY_CHECKS = 1;

INSERT INTO Musteri (Ad, Soyad, Telefon, Eposta, Adres, DogumTarihi) VALUES 
('Ahmet', 'Yılmaz', '05321112233', 'ahmet.y@email.com', 'Kadıköy, İstanbul', '1985-04-12'),
('Ayşe', 'Kaya', '05332223344', 'ayse.kaya@email.com', 'Beşiktaş, İstanbul', '1992-08-25'),
('Mehmet', 'Demir', '05343334455', 'mehmet.d@email.com', 'Çankaya, Ankara', '1978-11-05'),
('Zeynep', 'Çelik', '05354445566', 'zeynep.c@email.com', 'Bornova, İzmir', '2001-02-18');

INSERT INTO Doktor (Ad, Soyad, UzmanlikAlani, Telefon) VALUES 
('Ali', 'Görür', 'Göz Hastalıkları Uzmanı', '05551234567'),
('Selin', 'Net', 'Göz Cerrahisi', '05559876543'),
('Burak', 'Işık', 'Pediatrik Göz', '05554567890');

INSERT INTO Personel (Ad, Soyad, Gorev, Telefon) VALUES 
('Canan', 'Satıcı', 'Mağaza Müdürü', '05441112233'),
('Emre', 'Kasa', 'Satış Danışmanı', '05442223344'),
('Merve', 'Optik', 'Optisyen', '05443334455');

INSERT INTO Urun (UrunAdi, UrunTuru, Marka, Fiyat, StokMiktari) VALUES 
('Aviator Klasik Güneş Gözlüğü', 'Güneş Gözlüğü', 'Ray-Ban', 3500.00, 45),
('Acuvue Oasys Aylık Lens (Kutu)', 'Kontakt Lens', 'Johnson & Johnson', 650.00, 12),
('Wayfarer Optik Çerçeve', 'Numaralı Çerçeve', 'Ray-Ban', 2800.00, 5),
('Air Optix Renkli Lens', 'Kontakt Lens', 'Alcon', 750.00, 0),
('Titanyum İnce Çerçeve', 'Numaralı Çerçeve', 'Osse', 1450.00, 30);

INSERT INTO Recete (ReceteTarihi, SagGozNumara, SolGozNumara, MusteriID, DoktorID) VALUES 
('2026-05-10', -1.50, -1.75, 1, 1),
('2026-05-15', -2.25, -2.00, 2, 2),
('2026-05-20', -0.50, -0.50, 4, 3);

INSERT INTO Satis (SatisTarihi, ToplamTutar, MusteriID, PersonelID, ReceteID) VALUES 
('2026-05-12 14:30:00', 0.00, 1, 2, 1),
('2026-05-16 11:15:00', 0.00, 2, 2, 2),
('2026-05-25 16:45:00', 0.00, 3, 3, NULL);

INSERT INTO SatisDetay (SatisID, UrunID, Adet, Birimfiyat) VALUES 
(1, 3, 1, 2800.00),
(1, 2, 2, 650.00),
(2, 1, 1, 3500.00),
(3, 2, 1, 650.00);
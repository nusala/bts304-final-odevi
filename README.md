# bts304-final-odevi
N-Katmanlı Mimari ile Optik Mağazası Reçete, Stok ve Satış Yönetim Sistemi
# Optik Mağazası Otomasyonu (N-Katmanlı Mimari):

Bu proje, BTS304 Veritabanı Yönetim Sistemleri-II dersi final ödevi kapsamında geliştirilmiş, **N-Katmanlı Mimari (N-Tier Architecture)** prensiplerine tam uyumlu bir web tabanlı otomasyon sistemidir.

**Hazırlayan:** Nusret Emirhan Ala

## 🎥 Proje Tanıtım ve Çalışma Videosu
👉 **[VİDEO LİNKİ BURAYA GELECEK - TIKLAYINIZ]** *(Not: Videoda sistemin çalışması, Stored Procedure, Trigger ve Function kullanımları detaylıca gösterilmiştir.)*

---

## 🚀 Kurulum ve Çalıştırma Talimatları

Projeyi yerel bilgisayarınızda (localhost) sorunsuz bir şekilde ayağa kaldırmak için lütfen aşağıdaki adımları sırasıyla uygulayınız.

### 1. Veritabanı Kurulumu (MySQL)
Ödev kuralları gereği sistemdeki tüm işlemler **Stored Procedure** üzerinden yapılmaktadır. Veritabanını oluşturmak için:
1. MySQL Workbench uygulamasını açın.
2. Proje dosyaları arasında bulunan **veritabani.sql** dosyasını Workbench içine sürükleyip bırakın (veya File > Open SQL Script adımlarını izleyin).
3. Açılan sayfadaki tüm kodları Execute butonuna basarak çalıştırın.
4. Bu işlem; `OptikOtomasyon` veritabanını, tabloları, test verilerini, 28 adet Stored Procedure'ü, stok düşüren Trigger'ları ve yaş hesaplayan Function'ları otomatik olarak kuracaktır.

### 2. Proje Bağımlılıklarının Yüklenmesi
Projeyi çalıştırmak için bilgisayarınızda **Node.js** kurulu olmalıdır.
1. İndirdiğiniz proje klasörünü VS Code veya herhangi bir terminal programında açın.
2. Terminal ekranına aşağıdaki komutu yazarak gerekli paketleri `node_modules` indirin:
   ```bash
   npm install
   ```

### 3. Veritabanı Bağlantı Ayarları
* Proje bağlantısı varsayılan olarak `localhost`, kullanıcı adı `root` ve şifre `boş` olacak şekilde ayarlanmıştır.
* Eğer MySQL root şifreniz bulunuyorsa, proje klasöründeki `config/db.js` dosyasını açıp `password: ''` kısmına kendi şifrenizi yazabilirsiniz.

### 4. Projeyi Başlatma
Bağımlılıklar yüklendikten sonra terminalde aşağıdaki komutu çalıştırarak yerel sunucuyu başlatın:
   ```bash
   npm start
   ```

Sunucu başarıyla başladıktan sonra tarayıcınızı açıp şu adrese gidiniz: 
**http://localhost:3000**

---

## 🏗️ N-Katmanlı Mimari Yapısı ve Kurallar
Bu projede ödev yönergesine (Adım-4) kesin bir şekilde uyulmuş olup, uygulamanın hiçbir katmanında doğrudan `SELECT`, `INSERT`, `UPDATE` veya `DELETE` komutları **kullanılmamıştır.** Bütün işlemler Data Access Layer (DAL) içinden MySQL **Stored Procedure'leri** çağrılarak gerçekleştirilmektedir.

* **`public/` (Presentation Layer - UI):** Kullanıcı arayüzü, tasarım ve frontend isteklerinin atıldığı katman.
* **`bl/` (Business Layer - BL):** İş kurallarının, veri doğrulamalarının ve mantıksal kontrollerin yapıldığı aracı katman.
* **`dal/` (Data Access Layer - DAL):** Sadece ve sadece MySQL veritabanı Stored Procedure'leri ile iletişim kuran veri erişim katmanı.

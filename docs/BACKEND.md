# Backend Dokumantasyonu

Bu dokuman Testoria backend yapisinin guncel teknik ozetidir. Kurulum ve genel komutlar icin `docs/README.md`, faz takibi icin `docs/ROADMAP_PROGRESS.md` kullanilir.

## Teknoloji Stack

- Next.js 16 App Router
- React 19 Server Components ve Server Actions
- TypeScript strict mode
- Prisma 7
- Neon PostgreSQL
- NextAuth v4 Credentials Provider
- bcryptjs
- Resend
- Upstash Redis ve `@upstash/ratelimit`
- Vitest

## Calisma Modeli

Backend klasik REST API yerine agirlikli olarak Server Components, query fonksiyonlari ve Server Actions uzerinden calisir.

- Route ve sayfalar: `src/app`
- Ozellik bazli is mantigi: `src/features`
- Ortak altyapi: `src/lib`
- Veri modeli ve seed: `prisma`

Temel ayrim:

- Query dosyalari sadece veri okur.
- Action dosyalari validasyon, yetki kontrolu, mutation ve `revalidatePath`/`redirect` islerini yapar.
- Guard ve ortak guvenlik kontrolleri `src/lib` altinda tutulur.

## Veritabani

Veritabani PostgreSQL uyumlu Neon projesidir. Prisma datasource provider `postgresql` olarak tanimlidir ve runtime baglanti `@prisma/adapter-neon` ile yapilir.

Ana dosyalar:

- `prisma/schema.prisma`
- `prisma/seed.ts`
- `src/lib/db.ts`

`src/lib/db.ts`, `DATABASE_URL` degerini okuyup Neon adapter ile Prisma Client olusturur. Node ortaminda Neon WebSocket baglantisinin calismasi icin `ws` constructor'i atanir. Development modunda Prisma Client `globalThis` uzerinde cache'lenir.

Gerekli env degerleri:

```env
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."
```

Not: Mevcut Prisma schema `DATABASE_URL` ile calisiyor. `DIRECT_URL` env olarak tutuluyor fakat schema datasource icinde su an dogrudan kullanilmiyor.

## Neon Durumu

Kullanilan Neon kaynaklari:

- Project: `Testoria`
- Project ID: `ancient-union-47426171`
- Region: `aws-eu-central-1`
- Main branch: `br-lucky-sky-alsmsimr`
- Database: `neondb`
- Compute: `ep-falling-moon-al3ni228`
- PostgreSQL: 17

Ilk schema Neon MCP migration workflow'u ile main branch'e uygulandi. Repository icinde henuz `prisma/migrations` gecmisi yok; bundan sonraki schema degisiklikleri icin migration stratejisi netlestirilmelidir.

## Veri Modeli

Auth modelleri:

- `User`
- `Account`
- `Session`
- `VerificationToken`

Uygulama modelleri:

- `Profile`: admin/hoca profili, sifre hash'i ve rol bilgisi.
- `Student`: public test cozen ogrenci kaydi.
- `TeacherStudent`: hoca-ogrenci eslestirmesi.
- `Course`: ders.
- `Question`: hoca soru havuzu kaydi.
- `Test`: test metadata, yayin durumu ve sonuc gorunurlugu.
- `TestQuestion`: test-soru sirasi ve puan baglantisi.
- `TestAttempt`: ogrencinin test denemesi, skor ve yasal onay zamanlari.
- `StudentAnswer`: cevap kaydi ve soru snapshot alanlari.
- `Ad`: reklam yerlesimi kaydi.

Kritik constraint ve indeksler:

- `Profile.email` unique.
- `Student.email` unique.
- `Course.slug` unique.
- `TeacherStudent` icin `(teacherId, studentId)` unique.
- `TestAttempt` icin `(testId, studentId)` unique; ayni ogrencinin ayni testi tekrar cozmesini engeller.
- `TestQuestion` icin `(testId, questionId)` ve `(testId, orderIndex)` unique.
- Sorgu performansi icin role, aktiflik, owner, status, tarih ve iliski alanlarinda indeksler var.

## Auth

Hoca ve admin girisi NextAuth Credentials Provider ile calisir. Hoca kaydi `User` ve `Profile` modelleri uzerinden olusturulur. Ogrenci paneli ise `Student` modeli uzerinden e-posta+sifre ve HTTP-only session cookie modeli kullanir.

Ana dosyalar:

- `src/lib/auth-options.ts`
- `src/lib/password.ts`
- `src/lib/authorization.ts`
- `src/features/auth/schemas.ts`

Akis:

1. Hoca kullanicisi `/teacher/login` ekraninda giris yapar veya ayni ekranda kayit olur.
2. Kayit akisinda `User` ve `Profile` kaydi `TEACHER` rolunde olusturulur.
3. Giris akisinda Zod ile credentials valide edilir.
4. Login rate limit kontrolu yapilir.
5. `Profile` e-posta ile bulunur ve aktiflik kontrol edilir.
6. Sifre hash'i `bcryptjs` ile dogrulanir.
7. JWT session icine `role` ve `profileId` eklenir.

Yetkilendirme guard'lari:

- `requireTeacher()`
- `requireAdmin()`
- `getCurrentProfile()`
- `assertOwnsQuestion()`
- `assertOwnsTest()`
- `assertCanViewAttempt()`

Hoca ve admin route'lari server-side guard ile korunur. Ownership gerektiren mutation ve detay ekranlarinda ilgili assert fonksiyonlari kullanilir.

Ogrenci panel auth modeli:

- `src/lib/student-session.ts`
- `src/features/student-portal/actions.ts`
- `src/features/student-portal/queries.ts`

Akis:

1. Ogrenci `/student/login` ekraninda e-posta ve sifre ile giris yapar veya ayni ekranda kayit olur.
2. `Student.passwordHash` alaninda sifre hash'i tutulur.
3. Basarili giris/kayit sonrasi imzali `student_portal_session` cookie verilir.
4. Ogrenci `/student/dashboard`, `/student/attempts` ve test baslangic ekranlarina bu cookie ile erisir.

Bu model mevcut `Student` tablosunu kullanir; ayrica yeni `User/Profile` kaydi olusturulmaz.

## Attempt Erisimi ve Ogrenci Session

Ogrenci session'i acildiktan ve attempt olustuktan sonra gerekli HTTP-only cookie'ler verilir.

Ana dosya:

- `src/lib/student-attempt-access.ts`
- `src/lib/student-session.ts`

Guvenlik modeli:

- Cookie adi attempt ID ile namespaced tutulur.
- Cookie degeri HMAC imzasidir.
- Imza secret'i `NEXTAUTH_SECRET` veya `AUTH_SECRET` uzerinden alinir.
- Production ortaminda secret yoksa hata atilir.
- Cookie `httpOnly`, `sameSite=lax`, production'da `secure` olarak set edilir.
- Test cozum, sonuc goruntuleme ve tamamlama action'i attempt access kontrolunden gecirilir.
- Ogrenci paneli icin `student_portal_session` isimli imzali session cookie kullanilir.
- Attempt sorgulari artik hem attempt access cookie'si hem de ogrencinin kendi panel session'i ile yetkilendirilebilir.

Bu model attempt URL'lerinin tahmin edilmesine karsi koruma saglar. Ayrica ayni ogrenci kendi panel session'i ile gecmis denemelerine geri donebilir.

## Test Cozme ve Sonuc

Ana dosyalar:

- `src/features/student-test/queries.ts`
- `src/features/student-test/actions.ts`
- `src/features/student-test/scoring.ts`
- `src/features/student-test/scoring.test.ts`

Cozum ekraninda dogru cevap client'a gonderilmez. Server action tamamlama sirasinda aktif attempt'i okur, sure kontrolu yapar ve cevaplari hesaplar.

Sure davranisi:

- `durationMinutes` yoksa sure siniri uygulanmaz.
- Sure dolmussa gelen cevaplar kabul edilmez ve sorular bos sayilir.
- `durationSeconds`, gecen sure veya maksimum sure ile kaydedilir.

Sonuc hesaplama:

- `calculateTestResult()` saf fonksiyondur.
- Dogru, yanlis, bos sayisi ve skor hesaplanir.
- Unit test ile dogrulanir.

Snapshot davranisi:

- Test tamamlanirken soru metni, secenekler, dogru cevap ve aciklama `StudentAnswer` icine snapshot olarak yazilir.
- Sonuc detaylari once snapshot alanlarini kullanir.
- Snapshot yoksa eski kayitlar icin canli `Question` verisine fallback vardir.
- Bu sayede soru sonradan duzenlense bile gecmis sonuclar bozulmaz.

`showResultImmediately` davranisi:

- `true` ise ogrenci ozet ve cevap detaylarini gorur.
- `false` ise ogrenciye cevap detaylari dondurulmez; sadece kayit bilgisi/ozet akisi kullanilir.
- Hoca detay ekranlari kendi testlerinin tamamlanan attempt'lerini gorebilir.

Test baslatma yalnizca giris yapmis ogrenci session'i ile calisir. OTP veya uyeliksiz baslatma akisi kaldirilmistir.

## Ogrenci Paneli

Ana dosyalar:

- `src/features/student-portal/actions.ts`
- `src/features/student-portal/queries.ts`
- `src/lib/student-session.ts`

Ogrenci yetenekleri:

- E-posta+sifre ile kayit ve giris.
- Kendi profil ozetini gorme.
- Tanimli hocalarini gorme.
- Tum deneme gecmisini gorme.
- Devam eden denemeye geri donme.
- Tamamlanan denemelerin sonuc ekranina panelden ulasma.

## Hoca Paneli

Ana dosyalar:

- `src/features/teacher-dashboard/queries.ts`
- `src/features/question-bank/queries.ts`
- `src/features/question-bank/actions.ts`
- `src/features/test-builder/queries.ts`
- `src/features/test-builder/actions.ts`
- `src/features/results/queries.ts`

Hoca yetenekleri:

- Dashboard istatistikleri.
- Kendi aktif sorularini listeleme ve filtreleme.
- Soru ekleme, duzenleme ve pasife alma.
- Test olusturma.
- Test metadata ve status guncelleme.
- Tamamlanan sonuclari listeleme.
- Tekil sonuc detaylarini inceleme.
- Kendisine atanmis ogrencileri ve deneme gecmislerini gorme.

Guvenlik notlari:

- Soru ve test islemleri `requireTeacher()` ve ownership kontrolleriyle korunur.
- Test olustururken secilen sorularin hocaya ait, aktif ve ayni derse ait oldugu kontrol edilir.
- Test duzenlemede soru seti degistirilmiyor; gecmis sonuc tutarliligini korumak icin sadece metadata/status alanlari guncelleniyor.

## Admin Paneli

Ana dosyalar:

- `src/features/admin/queries.ts`
- `src/features/admin/actions.ts`
- `src/features/admin/schemas.ts`

Admin yetenekleri:

- Hoca olusturma.
- Hoca bilgisi, e-posta, sifre ve aktiflik guncelleme.
- Ders olusturma.
- Ders metadata, slug, sira ve aktiflik guncelleme.
- Hoca-ogrenci eslestirme olusturma.
- Hoca-ogrenci eslestirme kaldirma.

Admin action'lari `requireAdmin()` ile korunur. Hoca olusturma/guncelleme sirasinda `User` ve `Profile` kayitlari transaction icinde senkron tutulur.

## Rate Limiting

Ana dosya:

- `src/lib/rate-limit.ts`

Limit turleri:

- `testStart`: 1 dakikada 5 istek.
- `teacherLogin`: 1 dakikada 10 istek.
- `studentLogin`: 1 dakikada 10 istek.

Upstash env degerleri eksik veya placeholder ise rate limit fail-open calisir. Bu lokal gelistirmeyi kolaylastirir; production ortaminda gercek Upstash degerleri tanimlanmalidir.

Gerekli env degerleri:

```env
UPSTASH_REDIS_REST_URL="https://..."
UPSTASH_REDIS_REST_TOKEN="..."
```

## Seed

Ana dosya:

- `prisma/seed.ts`

Seed varsayilan olarak admin, demo hoca, dersler, sorular, test ve demo attempt verisi olusturur.

Komut:

```bash
npm run db:seed
```

Demo hesaplar:

- Admin: `.env` icindeki `ADMIN_EMAIL` / `ADMIN_PASSWORD`
- Hoca: `hoca@example.com` / `.env` icindeki `ADMIN_PASSWORD`
- Ogrenci: `ogrenci@example.com` / `.env` icindeki `ADMIN_PASSWORD`

## Deployment Env Listesi

Netlify veya hedef production ortaminda asagidaki degerler tanimlanmalidir:

```env
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."
AUTH_SECRET="strong-secret"
AUTH_URL="https://production-domain"
NEXTAUTH_SECRET="strong-secret"
NEXTAUTH_URL="https://production-domain"
UPSTASH_REDIS_REST_URL="https://..."
UPSTASH_REDIS_REST_TOKEN="..."
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="strong-password"
```

Production notlari:

- `AUTH_URL` ve `NEXTAUTH_URL` production domain ile birebir uyumlu olmali.
- `AUTH_SECRET` ve `NEXTAUTH_SECRET` guclu ve kalici olmalidir; degistirilirse session ve attempt cookie imzalari etkilenir.
- Neon connection string repoya yazilmamalidir.
- Upstash production'da placeholder kalmamalidir.

## Dogrulama Komutlari

Backend degisikligi sonrasi calistirilmesi beklenen komutlar:

```bash
npm run typecheck
npm run lint
npm run test
npm run build
npx prisma validate
npx prisma generate
```

DB bagimli degisikliklerde ayrica:

```bash
npm run db:seed
```

## Manuel Test Senaryolari

Ogrenci akisi:

1. `/online-test` sayfasinda aktif dersleri gor.
2. Aktif testi olan dersi sec.
3. `/student/login` uzerinden kayit ol veya giris yap.
4. Test baslangic ekraninda yasal onaylari gir ve testi baslat.
5. Testi tamamla.
6. Sonuc ekraninda `showResultImmediately` davranisini kontrol et.
7. Ayni ogrenci hesabi ile ayni testi tekrar baslatmanin engellendigini kontrol et.

Hoca akisi:

1. `/teacher/login` ile demo hoca olarak giris yap.
2. Dashboard verilerini kontrol et.
3. Soru ekle, duzenle ve pasife al.
4. Test olustur, status guncelle ve metadata duzenle.
5. Sonuc listesini ve detay ekranini kontrol et.
6. Ogrenci takip ekranini kontrol et.

Admin akisi:

1. Admin hesabi ile `/admin` sayfasina gir.
2. Hoca olustur ve guncelle.
3. Ders olustur ve guncelle.
4. Ogrenciyi hocaya ata.
5. Eslestirmeyi kaldir.
6. Pasif hoca girisinin engellendigini kontrol et.

## Bilinen Riskler ve Borclar

- Repository icinde `prisma/migrations` gecmisi yok; Neon MCP ile uygulanan ilk schema icin migration stratejisi belirlenmeli.
- `DIRECT_URL` env olarak var ama Prisma datasource icinde kullanilmiyor.
- Upstash env placeholder kalirsa production rate limiting devre disi kalir.
- Admin ve hoca action'larinda unique constraint hatalari kullanici dostu mesaja cevrilebilir.
- Reklam modeli var, ancak dinamik reklam yonetimi MVP sonrasi is olarak duruyor.
- Ogrenci sonuc ekraninda cevap detayi MVP seviyesinde ozet tutulur; hoca detay ekraninda tum siklar ve aciklama snapshot fallback'i kullanilir.
- Manuel tarayici testi henuz tamamlanmadiysa deploy oncesi mutlaka yapilmali.

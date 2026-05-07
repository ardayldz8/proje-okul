# Proje Okul

Online test platformu. Ogrenciler ders secip test cozer, hocalar soru havuzu, testler ve ogrenci sonuclarini panelden takip eder.

## Teknoloji

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- Prisma 7
- PostgreSQL / Neon
- NextAuth Credentials Provider
- Vitest

## Gereksinimler

- Node.js `20.19+`, `22.12+` veya `24.0+`
- npm
- PostgreSQL uyumlu veritabani baglantisi

Mevcut lokal ortamda dogrulanan Node surumu: `20.20.2`.

## Kurulum

```bash
npm install
```

## Ortam Degiskenleri

`.env.example` dosyasini temel alip `.env` olusturun.

Gerekli degiskenler:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?sslmode=require"
DIRECT_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?sslmode=require"

AUTH_SECRET="change-me"
AUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="change-me"
NEXTAUTH_URL="http://localhost:3000"

RESEND_API_KEY="re_change_me"
UPSTASH_REDIS_REST_URL="https://example.upstash.io"
UPSTASH_REDIS_REST_TOKEN="change-me"

ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="ChangeMe123!"
```

Not: Lokal placeholder `DATABASE_URL`, Prisma client generate ve build icin yeterlidir; migration/seed ve uygulamanin veri okuyan dinamik sayfalari icin gercek veritabani gerekir.

## Prisma

Client uretimi:

```bash
npx prisma generate
```

Migration:

```bash
npm run db:migrate
```

Seed:

```bash
npm run db:seed
```

## Gelistirme

```bash
npm run dev
```

Uygulama varsayilan olarak `http://localhost:3000` adresinde calisir.

## Dogrulama

```bash
npm run typecheck
npm run lint
npm run test
npm run build
```

## Faydalı Komutlar

```bash
npm run db:generate
npm run db:migrate
npm run db:seed
```

## Demo Hesaplar

Seed calistirildiginda varsayilan hesaplar olusturulur:

- Admin: `.env` icindeki `ADMIN_EMAIL` / `ADMIN_PASSWORD`
- Hoca: `hoca@example.com` / `.env` icindeki `ADMIN_PASSWORD`

## Proje Yapisi

- `src/app`: Next.js route ve sayfalari
- `src/features`: Ozellik bazli is mantigi, formlar ve sorgular
- `src/lib`: Prisma client, auth, OTP, yetkilendirme ve yardimci fonksiyonlar
- `src/types`: Ortak TypeScript tipleri
- `prisma`: Prisma schema ve seed dosyasi
- `ROADMAP_PROGRESS.md`: Guncel proje durumu, tamamlanan isler, kalan isler ve backend dokumantasyonu

## Bilinen Notlar

- Gercek Neon, Resend ve Upstash anahtarlari deployment oncesi tanimlanmalidir.
- `npm install` 9 moderate audit uyarisi verebilir; breaking update icerebilecegi icin `npm audit fix --force` dogrudan calistirilmamalidir.
- Upstash rate limiting entegrasyonu OTP, test baslatma ve hoca login akislari icin vardir. Upstash env placeholder veya eksikse lokal gelistirme fail-open devam eder.

## Deployment Kontrol Listesi

1. Neon uzerinde PostgreSQL veritabani olustur.
2. Vercel veya hedef ortamda `.env.example` icindeki tum environment variable'lari gercek degerlerle tanimla.
3. `DATABASE_URL` ve `DIRECT_URL` degerlerini SSL zorunlu olacak sekilde kontrol et.
4. `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `AUTH_SECRET` ve `AUTH_URL` degerlerini production domain ile uyumlu yap.
5. `RESEND_API_KEY` degerini gercek Resend anahtariyla degistir.
6. `UPSTASH_REDIS_REST_URL` ve `UPSTASH_REDIS_REST_TOKEN` degerlerini gercek Upstash Redis bilgileriyle degistir.
7. `npm run db:migrate` ile ilk migration'i calistir.
8. `npm run db:seed` ile demo/admin verisini olustur.
9. `npm run typecheck`, `npm run lint`, `npm run test` ve `npm run build` komutlarini production env ile tekrar calistir.
10. Ogrenci, hoca ve admin akisini tarayicida manuel test et.

## Manuel Test Senaryolari

Ogrenci akisi:

1. Ana sayfadan `Online Teste Basla` butonuna git.
2. Aktif ders listesini gor.
3. Aktif testi olan dersi sec.
4. Ogrenci bilgilerini ve onay kutularini doldur.
5. OTP kodunu iste ve dogrula.
6. Testi baslat, cevaplari isaretle ve tamamla.
7. Sonuc ekrani, puan ve cevap detaylarini kontrol et.
8. Ayni e-posta ile ayni testi tekrar baslatmanin engellendigini kontrol et.

Hoca akisi:

1. Demo hoca ile `/teacher/login` uzerinden giris yap.
2. Dashboard istatistiklerinin geldigini kontrol et.
3. Soru ekle, duzenle ve pasife al.
4. Test olustur, durumunu degistir ve duzenle.
5. `/teacher/results` uzerinden sonuclari listele.
6. Bir sonuc detayina girip cevap detaylarini kontrol et.
7. `/teacher/students` uzerinden tanimli ogrencileri kontrol et.

Admin akisi:

1. Admin hesabiyla `/admin` sayfasina gir.
2. Yeni hoca olustur ve hocayi duzenle.
3. Yeni ders olustur ve dersi duzenle.
4. Mevcut ogrenciyi aktif hocaya ata.
5. Hoca-ogrenci eslestirmesini kaldir.
6. Pasif hoca ile girisin engellendigini kontrol et.

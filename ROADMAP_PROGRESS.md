# Proje Ilerleme ve Uygulama Gunlugu

Bu dosya, `PRD.md` yol haritasinin uygulama sirasinda adim adim takip edilmesi icin tutulur. Her teknik karar, tamamlanan is, dogrulama sonucu ve kalan risk burada guncellenir.

## Kullanim Kurallari

- Her buyuk adim tamamlandiginda bu dosya guncellenir.
- Kod yazmadan once ilgili PRD karari kontrol edilir.
- Tamamlanan islerde hangi dosyalarin eklendigi veya degistigi yazilir.
- Dogrulama komutlari ve sonuclari kaydedilir.
- Blokaj veya eksik bilgi varsa acik sekilde not edilir.

## Durum Ozeti

- Genel durum: Basladi
- Aktif faz: Faz 1 - Proje Iskeleti ve Ana Sayfa
- Aktif sorumluluk alani: Arda - Proje altyapisi
- Son guncelleme: 2026-05-01

## Faz Kontrol Listesi

### Faz 0: Proje Hazirligi

Durum: Tamamlandi

- [x] PRD ana karar dokumani hazirlandi.
- [x] Teknoloji stack'i secildi.
- [x] Veritabani modeli taslagi belirlendi.
- [x] Is bolumu netlestirildi.
- [x] PRD'deki eksik kararlar guncellendi.
- [x] PRD PDF olarak yeniden uretildi.

Notlar:

- Ana karar dokumani: `PRD.md`
- PDF ciktisi: `PRD.pdf`

### Faz 1: Proje Iskeleti ve Ana Sayfa

Durum: Devam ediyor

- [x] Repo ve mevcut dosya yapisi kontrol edildi.
- [x] Next.js + TypeScript proje iskeleti kuruldu.
- [x] Tailwind CSS kuruldu.
- [x] shadcn/ui icin temel altyapi hazirlandi.
- [x] `src` tabanli klasor yapisi olusturuldu.
- [x] Route gruplari olusturuldu.
- [x] Ortak layout hazirlandi.
- [x] Ana sayfa placeholder'i hazirlandi.
- [x] Online test ve hoca giris yonlendirmeleri hazirlandi.
- [x] Ilk build/typecheck kontrolu calistirildi.

### Faz 2: Dersler ve Ogrenci Test Akisi

Durum: Devam ediyor

- [x] Ders modeli Prisma schema'ya eklendi.
- [x] Ders listeleme query'si yazildi.
- [x] `/online-test` sayfasi veriye baglandi.
- [x] `/online-test/[courseId]` aktif test listesi hazirlandi.
- [x] Test baslangic sayfasi veri akisi hazirlandi.
- [x] Ogrenci bilgi formu validasyonu yazildi.
- [x] OTP veri modeli Prisma schema'ya eklendi.
- [x] OTP gonderme ve dogrulama akisi yazildi.
- [x] Test attempt baslatma transaction'i yazildi.

### Faz 3: Test Cozme ve Sonuc Hesaplama

Durum: Beklemede

- [x] Test sorulari dogru cevaplar gizlenerek getirildi.
- [x] Test sure kontrolu server-side yazildi.
- [x] Test bitirme server action'i yazildi.
- [x] Cevaplar batch insert ile kaydedildi.
- [x] Sonuc hesaplama fonksiyonu yazildi.
- [x] Sonuc hesaplama unit testleri yazildi.
- [x] Sonuc ekrani query'si hazirlandi.

### Faz 4: Hoca Girisi ve Panel

Durum: Devam ediyor

- [x] Auth.js bagimliliklari kuruldu.
- [x] Auth.js adapter tablolari Prisma schema'ya eklendi.
- [x] Credentials Provider ayarlandi.
- [x] `bcrypt` sifre hash/dogrulama yardimcilari yazildi.
- [x] Session role/profile bilgileri eklendi.
- [x] `requireTeacher()` ve `requireAdmin()` yazildi.
- [x] Korumali route yapisi kuruldu.
- [x] Hoca login akisi hazirlandi.
- [x] Hoca dashboard query'leri hazirlandi.

### Faz 5: Soru Havuzu

Durum: Devam ediyor

- [x] Soru modeli Prisma schema'da tamamlandi.
- [x] Soru listeleme query'si yazildi.
- [x] Soru ekleme action'i yazildi.
- [ ] Soru duzenleme action'i yazildi.
- [x] Soru pasife alma action'i yazildi.
- [x] Ownership kontrolu eklendi.

### Faz 6: Test Olusturma

Durum: Devam ediyor

- [x] Test modeli Prisma schema'da tamamlandi.
- [x] Test listeleme query'si yazildi.
- [x] Test olusturma action'i yazildi.
- [ ] Test duzenleme action'i yazildi.
- [x] Test soru iliskisi yazildi.
- [x] Aktif test public gorunurluk kontrolu yazildi.

### Faz 7: Ogrenci ve Sonuc Takibi

Durum: Beklemede

- [ ] Hoca sonuc listesi query'si yazildi.
- [ ] Ogrenci sonuc detay query'si yazildi.
- [ ] Tanimli ogrenciler query'si yazildi.
- [ ] Hoca-ogrenci eslestirme altyapisi yazildi.

### Faz 8: Reklam Alanlari

Durum: Beklemede

- [ ] Statik reklam componentleri hazirlandi.
- [ ] Ana sayfa reklam alani eklendi.
- [ ] Ders listesi reklam alani eklendi.
- [ ] Sonuc sayfasi reklam alani eklendi.

### Faz 9: Test, Temizlik ve Yayina Hazirlik

Durum: Beklemede

- [ ] `lint` calisti.
- [ ] `typecheck` calisti.
- [ ] `test` calisti.
- [ ] `build` calisti.
- [ ] Ogrenci akisi manuel test edildi.
- [ ] Hoca akisi manuel test edildi.
- [ ] Admin akisi manuel test edildi.
- [ ] Vercel env listesi son kontrol edildi.

## Uygulama Gunlugu

### 2026-05-01

- `PRD.md` incelendi ve eksik kararlar guncellendi.
- `PRD.pdf` silinip guncel `PRD.md` uzerinden yeniden uretildi.
- Arda gorevleri detayli todo listesine bolundu.
- Proje uygulamasina baslandi.
- Repo kontrol edildi. Baslangicta sadece `.git`, `PRD.md` ve `PRD.pdf` oldugu goruldu.
- `ROADMAP_PROGRESS.md` olusturuldu.
- NPM proje altyapisi baslatildi.
- Next.js 16, React 19, TypeScript, Tailwind CSS v4 ve temel shadcn/ui yardimci bagimliliklari kuruldu.
- `src/app` tabanli App Router iskeleti olusturuldu.
- Public, student, teacher, admin ve api route alanlari icin placeholder sayfalar eklendi.
- `/api/health` route'u eklendi.
- Next.js dynamic route cakismasini onlemek icin `/test/[testId]/start` ve `/test/[attemptId]` yollarinin dosya sistemi karsiligi tek `[id]` segmenti altinda kuruldu. URL davranisi PRD ile uyumlu kalir.
- Prisma 7 bagimliliklari kuruldu.
- Prisma 7'de connection string'ler `schema.prisma` yerine `prisma.config.ts` icinde tanimlandigi icin bu yapi kullanildi.
- `prisma/schema.prisma` icinde Auth.js adapter tablolari ve uygulama modelleri eklendi.
- `profiles`, `students`, `otp_verifications`, `teacher_students`, `courses`, `questions`, `tests`, `test_questions`, `test_attempts`, `student_answers`, `ads` modelleri yazildi.
- `prisma/seed.ts` ile admin, hoca, 3 ders, demo sorular, aktif test ve tamamlanmis sonuc icin seed taslagi hazirlandi.
- Prisma 7 runtime icin `@prisma/adapter-neon` kullanilarak `src/lib/db.ts` ortak Prisma client dosyasi eklendi.
- Gercek PostgreSQL/Neon baglantisi henuz olmadigi icin migration calistirilmadi; schema validate ve client generate ile dogrulandi.
- `next-auth` v4 Credentials Provider ile hoca/admin giris altyapisi kuruldu.
- `src/lib/password.ts` icinde `bcryptjs` hash ve verify yardimcilari eklendi.
- Session ve JWT icin `role` ve `profileId` type augmentation'i yapildi.
- `requireTeacher()`, `requireAdmin()`, `getTeacherProfile()`, `assertOwnsQuestion()`, `assertOwnsTest()`, `assertCanViewAttempt()` helper'lari eklendi.
- Hoca ve admin route placeholder'lari server-side guard ile korumali hale getirildi.
- Hoca login formu Credentials endpoint'ine client-side `signIn` ile baglandi.
- `src/features/courses/queries.ts` eklendi.
- `/online-test` aktif dersleri Prisma uzerinden listeleyecek hale getirildi.
- `/online-test/[courseId]` ders slug'ina gore aktif test listesini Prisma uzerinden getirecek hale getirildi.
- Public test listeleme sayfalari dinamik render olarak isaretlendi.
- `/test/[id]/start` aktif test bilgisini, ders bilgisini, soru sayisini ve hoca listesini Prisma uzerinden getirecek hale getirildi.
- Ogrenci test baslangic formu eklendi.
- Ogrenci bilgi formu Zod validasyon semasi eklendi.
- OTP gonderme action'i eklendi. Development ortaminda placeholder Resend anahtari varsa OTP kodu konsola yazilir.
- OTP dogrulama yardimcisi eklendi. Kodlar hashlenmis tutulur, 5 dakika gecerlidir ve hatali deneme sayisi takip edilir.
- Test baslatma action'i eklendi. Dogru OTP sonrasi ogrenci e-posta ile upsert edilir, tekrar deneme kontrol edilir ve `test_attempts` kaydi olusturulur.
- Ogrenci formunda opsiyonel hoca secilirse `teacher_students` eslestirmesi upsert edilir.
- `/test/[id]` attempt id uzerinden in-progress attempt'i getirecek hale getirildi.
- Test cozme ekraninda soru metni ve siklar gosteriliyor; `correctOption` client'a gonderilmiyor.
- Sureli testler icin kalan sure server-side hesaplanip ekranda gosteriliyor.
- Test bitirme server action'i eklendi.
- Test bitirme sirasinda sure kontrolu yapiliyor. Sure dolmussa gonderilen cevaplar kabul edilmiyor ve sorular bos sayiliyor.
- Cevaplar transaction icinde `student_answers` tablosuna batch insert ile kaydediliyor.
- `test_attempts` tamamlandi olarak isaretleniyor ve skor/dogru/yanlis/bos sayilari yaziliyor.
- Sonuc hesaplama `src/features/student-test/scoring.ts` icinde saf fonksiyon olarak ayrildi.
- `/test/[id]/result` sonuc query'sine baglandi ve ozet + cevap detaylari gosteriliyor.
- Vitest kuruldu ve sonuc hesaplama icin unit testler eklendi.
- `src/features/teacher-dashboard/queries.ts` eklendi.
- Hoca dashboard icin aktif soru sayisi, toplam test sayisi, tamamlanan deneme sayisi, tekil ogrenci sayisi ve son 5 sonuc query'si hazirlandi.
- `/teacher/dashboard` gercek dashboard verilerine baglandi.
- Dashboard kartlari, hizli aksiyonlar ve son test sonuclari tablosu eklendi.
- `src/features/question-bank` modulu eklendi.
- Soru havuzu icin Zod form semasi yazildi.
- Hoca kendi aktif sorularini ders ve zorluk filtresiyle listeleyebiliyor.
- Soru ekleme action'i eklendi.
- Soru pasife alma action'i eklendi ve `assertOwnsQuestion()` ile ownership kontrolu yapiliyor.
- `/teacher/questions` sayfasi soru ekleme formu, filtre formu ve soru listesine baglandi.
- `src/features/test-builder` modulu eklendi.
- Test olusturma icin Zod form semasi yazildi.
- Hoca testleri listeleme query'si yazildi.
- Test olusturma action'i eklendi.
- Test olustururken secilen sorularin aktif, ayni derse ait ve hocanin kendi sorulari oldugu kontrol ediliyor.
- `test_questions` iliskisi test olusturma transaction'i icinde sirali olarak kuruluyor.
- Test durum guncelleme action'i eklendi ve `assertOwnsTest()` ile ownership kontrolu yapiliyor.
- `/teacher/tests` sayfasi test olusturma formu, soru secimi ve test listesine baglandi.

## Karar Kayitlari

- Ana framework: Next.js App Router.
- Dil: TypeScript.
- UI: Tailwind CSS + shadcn/ui altyapisi.
- Veritabani: PostgreSQL + Prisma.
- Auth: Auth.js Credentials Provider.
- Ogrenci kimligi: dogrulanmis e-posta.
- OTP: Resend ile e-posta uzerinden.
- Rate limit: Upstash Redis + `@upstash/ratelimit`.

## Dogrulama Gecmisi

- `git diff --check -- PRD.md`: Basarili, sadece CRLF uyarisi verdi.
- `PRD.pdf` yeniden uretildi: Basarili.
- `npm run typecheck`: Basarili.
- `npm run lint`: Basarili.
- `npm run build`: Basarili.
- `npm run test`: Basarili, 2 test gecti.
- `npx prisma format`: Basarili.
- `npx prisma validate`: Basarili.
- `npx prisma generate`: Basarili.

## Acik Riskler ve Notlar

- Gercek Neon, Resend ve Upstash anahtarlari henuz tanimli degil.
- `.env` dosyasi sadece lokal placeholder degerler icerir ve `.gitignore` kapsamindadir.
- KVKK, gizlilik ve kullanim kosullari metinleri urun icin placeholder olmayacak sekilde hazirlanmali.
- Ilk migration gercek veritabani baglantisi olmadan tamamlanamaz; lokalde schema/generate hazirlanabilir.

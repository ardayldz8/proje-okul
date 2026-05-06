# Proje Ilerleme ve Uygulama Gunlugu

Bu dosya, projenin guncel karar, ilerleme, backend durum ve kalan is takip dokumanidir. Emir ve Arda icin tek guncel roadmap kaynagi olarak kullanilir.

## Kullanim Kurallari

- Her buyuk adim tamamlandiginda bu dosya guncellenir.
- Kod yazmadan once bu dosyadaki guncel durum ve kalan isler kontrol edilir.
- Tamamlanan islerde hangi dosyalarin eklendigi veya degistigi yazilir.
- Dogrulama komutlari ve sonuclari kaydedilir.
- Blokaj veya eksik bilgi varsa acik sekilde not edilir.

## Durum Ozeti

- Genel durum: MVP backend altyapisi buyuk olcude tamamlandi, manuel test ve deploy hazirligi devam ediyor
- Aktif faz: Faz 9 - Deployment / manuel dogrulama hazirligi
- Aktif sorumluluk alani: Arda - manuel test, deploy env ve migration stratejisi; Emir - reklam/yasal sayfa/final UI isleri
- Son guncelleme: 2026-05-06

Guncel not:

- Kod tabani hoca/admin/ogrenci ana MVP backend akislarina kadar ilerlemis durumda.
- Backend tarafinda proje omurgasi, auth, ogrenci test akisi, soru havuzu, test olusturma, sonuc hesaplama, hoca takip sorgulari, admin CRUD akislarinin ana govdesi ve Neon baglantisi tamamlandi.
- Bundan sonraki ana odak, manuel tarayici testleri, production env kontrolleri ve repo ici Prisma migration stratejisidir.
- Guncel ogrenci akisi artik OTP veya uyeliksiz test baslatma kullanmaz; ogrenci kayit/giris ve dashboard odakli modele gecildi.

## Backend Durum Dokumantasyonu

Bu bolum Arda'nin teknik/backend sorumluluklari icin guncel biten-kalan durumunu takip eder.

### Tamamlanan Backend Altyapisi

- Next.js App Router proje yapisi kuruldu.
- TypeScript strict mode ile calisiyor.
- Prisma 7 ve PostgreSQL/Neon hedefli veri modeli kuruldu.
- Prisma Client, `@prisma/adapter-neon` ile ortak `src/lib/db.ts` uzerinden kullaniliyor.
- Lokal Node.js surumu Prisma 7 ile uyumlu hale getirildi: `20.20.2`.
- Lokal `.env` placeholder degerlerle olusturuldu; dosya `.gitignore` kapsaminda.
- `docs/README.md` ile kurulum, env, Prisma, seed, gelistirme ve dogrulama komutlari dokumante edildi.
- `docs/BACKEND.md` ile backend mimarisi, veri modeli, auth, OTP, deployment ve bilinen riskler dokumante edildi.
- `docs/FRONTEND.md` ile frontend mimarisi, route haritasi, component yapisi ve UI borclari dokumante edildi.

### Veri Modeli Durumu

- Auth.js adapter modelleri eklendi: `User`, `Account`, `Session`, `VerificationToken`.
- Uygulama modelleri eklendi: `Profile`, `Student`, `OtpVerification`, `TeacherStudent`, `Course`, `Question`, `Test`, `TestQuestion`, `TestAttempt`, `StudentAnswer`, `Ad`.
- Enum yapilari eklendi: `UserRole`, `Difficulty`, `TestStatus`, `AttemptStatus`, `OtpPurpose`, `AdPlacement`.
- Tekrar deneme kontrolu icin `TestAttempt` uzerinde `(testId, studentId)` unique constraint var.
- Hoca-ogrenci eslestirme icin `TeacherStudent` modeli var.
- Reklamlar icin `Ad` modeli var. MVP icin statik reklam componenti eklendi.
- Gercek Neon veritabanina ilk schema uygulandi ve seed verisi dogrulandi.
- Repository icinde henuz `prisma/migrations` gecmisi yok; bundan sonraki schema degisiklikleri icin migration stratejisi netlestirilmeli.

### Auth ve Yetkilendirme Durumu

- NextAuth v4 Credentials Provider ile hoca/admin girisi kuruldu.
- Sifre hash/dogrulama `bcryptjs` ile yapiliyor.
- Session/JWT icine `role` ve `profileId` eklendi.
- `requireTeacher()` ve `requireAdmin()` ile korumali route guard yapisi var.
- Ownership kontrolleri var: `assertOwnsQuestion()`, `assertOwnsTest()`, `assertCanViewAttempt()`.
- Hoca ve admin route'lari server-side guard ile korunuyor.
- `.env.example` icine `AUTH_SECRET`/`AUTH_URL` ve `NEXTAUTH_SECRET`/`NEXTAUTH_URL` birlikte eklendi; production domain degerleri deployment sirasinda girilmeli.
- Hoca giris endpoint'i icin Upstash rate limiting entegre edildi. Upstash env yoksa lokal gelistirmeyi bozmamak icin fail-open calisir.

### Ogrenci Test Akisi Durumu

- Public ders listeleme query'si yazildi.
- Aktif test listeleme ve test baslangic sayfasi veriye baglandi.
- Ogrenci bilgi formu Zod ile valide ediliyor.
- OTP modeli ve OTP gonderme/dogrulama akisi yazildi.
- OTP kodlari hashlenmis tutuluyor, 5 dakika gecerlilik ve hatali deneme sayisi var.
- Development ortaminda placeholder Resend anahtari varsa OTP kodu konsola yaziliyor.
- OTP dogrulamasi sonrasi `students` tablosunda e-posta ile upsert yapiliyor.
- Test attempt transaction icinde olusturuluyor.
- Ayni ogrencinin ayni testi tekrar cozmesi unique constraint ile engelleniyor.
- Ogrenci formundan gelen hoca secimi backend tarafinda aktif `TEACHER` profili olarak tekrar dogrulaniyor.
- Kalan: Test baslatma ve OTP akisi gercek DB ile tarayicida manuel test edilmeli; production icin gercek Resend ayari gerekli.
- OTP ve test baslatma icin Upstash rate limiting entegre edildi. Upstash env yoksa lokal gelistirmeyi bozmamak icin fail-open calisir.

### Test Cozme ve Sonuc Hesaplama Durumu

- Test cozme ekraninda `correctOption` client'a gonderilmiyor.
- Sureli testler icin kalan sure server-side hesaplanip gosteriliyor.
- Test bitirme server action'i var.
- Sure dolmussa cevaplar kabul edilmiyor ve sorular bos sayiliyor.
- Cevaplar transaction icinde `student_answers` tablosuna batch insert ediliyor.
- Sonuc `test_attempts` uzerine skor/dogru/yanlis/bos olarak yaziliyor.
- Sonuc hesaplama `calculateTestResult()` saf fonksiyonuna ayrildi.
- Vitest ile sonuc hesaplama icin unit test var.
- Ogrenci sonuc ekrani ozet ve cevap detaylarini gosteriyor.
- Hoca tarafinda tekil ogrenci sonuc detay sayfasi eklendi.
- Kalan: Test cozme akisi tarayicida gercek DB ile bastan sona manuel test edilmeli.

### Hoca Paneli Backend Durumu

- Dashboard query'si yazildi: aktif soru sayisi, toplam test, tamamlanan deneme, tekil ogrenci, son 5 sonuc.
- Soru havuzu query'si yazildi: hoca kendi aktif sorularini ders/zorluk filtresiyle goruyor.
- Soru ekleme action'i yazildi.
- Soru duzenleme action'i yazildi.
- Soru pasife alma action'i yazildi.
- Soru islemlerinde ownership kontrolu var.
- Test listeleme query'si yazildi.
- Test olusturma action'i yazildi.
- Test olustururken secilen sorularin aktif, ayni derse ait ve hocaya ait oldugu kontrol ediliyor.
- Test durum guncelleme action'i yazildi.
- Test duzenleme action'i yazildi.
- Test duzenleme kapsaminda soru seti bilerek degistirilmiyor; mevcut sonuc kayitlarini bozmamak icin sadece metadata/status alanlari duzenleniyor.
- Hoca sonuc listesi query'si yazildi.
- Tanimli ogrenciler query'si yazildi.
- `/teacher/results` ve `/teacher/students` gercek veriye baglandi.
- Tekil sonuc detay goruntuleme akisi tamamlandi; query teacher ownership filtresiyle calisiyor.
- Kalan: Hoca-ogrenci eslestirme akisi tarayicida manuel test edilmeli.

### Admin Backend Durumu

- `requireAdmin()` guard var.
- `/admin` route'u admin guard ile korunuyor.
- Seed dosyasinda admin ve demo hoca olusturma taslagi var.
- Admin paneli hoca olusturma/guncelleme akislari gercek server action'lara baglandi.
- Admin paneli ders olusturma/guncelleme akislari gercek server action'lara baglandi.
- Admin paneli hoca-ogrenci eslestirme olusturma/kaldirma akislari gercek server action'lara baglandi.
- Admin paneli hoca, ders, ogrenci ve eslestirme listelerini gercek veriden okuyor.
- Kalan: Admin akisi tarayicida manuel test edilmeli.

### Servis ve Entegrasyon Durumu

- Resend OTP gonderimi icin entegre edildi; production icin gercek `RESEND_API_KEY` gerekiyor.
- Upstash paketleri kurulu ve rate limiting icin kullaniliyor.
- Upstash Redis + `@upstash/ratelimit` ile OTP, test baslatma ve hoca login rate limiting kodu yazildi.
- Neon baglantisi, migration ve seed dogrulamasi yapildi.
- Kalan: Netlify env listesi production icin kontrol edilmeli.

### Dogrulanan Komutlar

- `npm install`: Basarili.
- `npx prisma generate`: Basarili.
- `npm run typecheck`: Basarili.
- `npm run lint`: Basarili.
- `npm run test`: Basarili, 2 test gecti.
- `npm run build`: Basarili.
- `npx prisma validate`: Basarili.
- `npx prisma generate`: Basarili.

### Backend Kapanis Icin Kalan Arda Isleri

- Repo icinde Prisma migration gecmisi stratejisini belirle.
- Auth env isimlerini deployment hedefiyle uyumlu hale getir.
- Netlify env listesini ve deployment ayarlarini kontrol et.
- Npm audit uyarilarini takip et; mevcut fix onerileri breaking downgrade icerdigi icin otomatik `--force` uygulanmadi.
- Ogrenci, hoca ve admin akisini gercek DB ile manuel test et.

## Faz Kontrol Listesi

### Faz 0: Proje Hazirligi

Durum: Tamamlandi

- [x] Ilk urun karar dokumani hazirlandi.
- [x] Teknoloji stack'i secildi.
- [x] Veritabani modeli taslagi belirlendi.
- [x] Is bolumu netlestirildi.
- [x] Eksik kararlar guncellendi.
- [x] Eski uzun karar dokumani ve PDF ciktisi sadeleştirme icin kaldirildi.

Notlar:

- Guncel tek takip dokumani: `docs/ROADMAP_PROGRESS.md`
- Kurulum ve calistirma dokumani: `docs/README.md`

### Faz 1: Proje Iskeleti ve Ana Sayfa

Durum: Kismen tamamlandi

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
- [ ] Header ve footer ortak component olarak tamamlandi.
- [ ] Ana sayfa final MVP tasarimina getirildi.
- [ ] Statik reklam alani final tasarima yerlestirildi.

### Faz 2: Dersler ve Ogrenci Test Akisi

Durum: Buyuk olcude tamamlandi

- [x] Ders modeli Prisma schema'ya eklendi.
- [x] Ders listeleme query'si yazildi.
- [x] `/online-test` sayfasi veriye baglandi.
- [x] `/online-test/[courseId]` aktif test listesi hazirlandi.
- [x] Test baslangic sayfasi veri akisi hazirlandi.
- [x] Ogrenci bilgi formu validasyonu yazildi.
- [x] OTP veri modeli Prisma schema'ya eklendi.
- [x] OTP gonderme ve dogrulama akisi yazildi.
- [x] Test attempt baslatma transaction'i yazildi.
- [ ] Test baslatma akisi manuel olarak dogrulandi.

### Faz 3: Test Cozme ve Sonuc Hesaplama

Durum: Teknik olarak tamamlandi, manuel dogrulama bekliyor

- [x] Test sorulari dogru cevaplar gizlenerek getirildi.
- [x] Test sure kontrolu server-side yazildi.
- [x] Test bitirme server action'i yazildi.
- [x] Cevaplar batch insert ile kaydedildi.
- [x] Sonuc hesaplama fonksiyonu yazildi.
- [x] Sonuc hesaplama unit testleri yazildi.
- [x] Sonuc ekrani query'si hazirlandi.
- [ ] Test cozme akisi tarayicida bastan sona manuel test edildi.

### Faz 4: Hoca Girisi ve Panel

Durum: Kismen tamamlandi

- [x] Auth.js bagimliliklari kuruldu.
- [x] Auth.js adapter tablolari Prisma schema'ya eklendi.
- [x] Credentials Provider ayarlandi.
- [x] `bcrypt` sifre hash/dogrulama yardimcilari yazildi.
- [x] Session role/profile bilgileri eklendi.
- [x] `requireTeacher()` ve `requireAdmin()` yazildi.
- [x] Korumali route yapisi kuruldu.
- [x] Hoca login akisi hazirlandi.
- [x] Hoca dashboard query'leri hazirlandi.
- [ ] Hoca panel layout'u final hale getirildi.
- [ ] Hoca login ve dashboard akisi manuel test edildi.

### Faz 5: Soru Havuzu

Durum: Backend tamamlandi, UI/manual test bekliyor

- [x] Soru modeli Prisma schema'da tamamlandi.
- [x] Soru listeleme query'si yazildi.
- [x] Soru ekleme action'i yazildi.
- [x] Soru duzenleme action'i yazildi.
- [x] Soru pasife alma action'i yazildi.
- [x] Ownership kontrolu eklendi.

### Faz 6: Test Olusturma

Durum: Backend tamamlandi, UI/manual test bekliyor

- [x] Test modeli Prisma schema'da tamamlandi.
- [x] Test listeleme query'si yazildi.
- [x] Test olusturma action'i yazildi.
- [x] Test duzenleme action'i yazildi.
- [x] Test soru iliskisi yazildi.
- [x] Aktif test public gorunurluk kontrolu yazildi.

### Faz 7: Ogrenci ve Sonuc Takibi

Durum: Buyuk olcude tamamlandi

- [x] Hoca sonuc listesi query'si yazildi.
- [x] Ogrenci sonuc detay query'si yazildi.
- [x] Tanimli ogrenciler query'si yazildi.
- [x] Hoca-ogrenci eslestirme veri modeli yazildi.
- [x] Hoca-ogrenci eslestirme yonetim ekrani/action'lari yazildi.
- [x] `/teacher/results` sayfasi gercek veriye baglandi.
- [x] `/teacher/results/[attemptId]` sonuc detay sayfasi gercek veriye baglandi.
- [x] `/teacher/students` sayfasi gercek veriye baglandi.
- [x] Hoca sadece kendi test/ogrenci sonuclarini gorecek sekilde yetki kontrolu query seviyesinde uygulandi.

### Faz 8: Reklam Alanlari

Durum: MVP statik kapsam tamamlandi

- [x] Statik reklam componentleri hazirlandi.
- [x] Ana sayfa reklam alani eklendi.
- [x] Ders listesi reklam alani eklendi.
- [x] Sonuc sayfasi reklam alani eklendi.

Not:

- `Ad` modeli Prisma schema'da hazir. MVP'de statik reklam componenti kullaniliyor; dinamik reklam yonetimi ileri faza birakildi.

### Faz 9: Test, Temizlik ve Yayina Hazirlik

Durum: Kismen basladi

- [x] `lint` calisti.
- [x] `typecheck` calisti.
- [x] `test` calisti.
- [x] `build` calisti.
- [ ] Ogrenci akisi manuel test edildi.
- [ ] Hoca akisi manuel test edildi.
- [ ] Admin akisi manuel test edildi.
- [ ] Netlify env listesi son kontrol edildi.
- [x] `docs/README.md` kurulum ve calistirma dokumani hazirlandi.
- [x] Node.js surumu Prisma 7 ile uyumlu hale getirildi.
- [x] Ilk migration gercek veritabani uzerinde calistirildi.
- [x] Seed/demo veri gercek veritabani uzerinde dogrulandi.
- [x] Deployment ve manuel test kontrol listesi dokumante edildi.
- [x] Npm audit uyarilari incelendi.
- [x] Frontend teknik dokumantasyonu hazirlandi.

## Uygulama Gunlugu

### 2026-05-01

- Eski urun karar dokumani incelendi ve kararlar bu roadmap'e aktarildi.
- Eski PDF ciktisi sadeleştirme kapsaminda kaldirildi.
- Arda gorevleri detayli todo listesine bolundu.
- Proje uygulamasina baslandi.
- Repo kontrol edildi. Baslangicta sadece `.git`, eski urun karar dokumani ve PDF ciktisi oldugu goruldu.
- `docs/ROADMAP_PROGRESS.md` olusturuldu.
- NPM proje altyapisi baslatildi.
- Next.js 16, React 19, TypeScript, Tailwind CSS v4 ve temel shadcn/ui yardimci bagimliliklari kuruldu.
- `src/app` tabanli App Router iskeleti olusturuldu.
- Public, student, teacher, admin ve api route alanlari icin placeholder sayfalar eklendi.
- `/api/health` route'u eklendi.
- Next.js dynamic route cakismasini onlemek icin `/test/[testId]/start` ve `/test/[attemptId]` yollarinin dosya sistemi karsiligi tek `[id]` segmenti altinda kuruldu. URL davranisi proje kararina uyumlu kalir.
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
- Lokal Node.js `20.18.0` surumunden `20.20.2` surumune guncellendi.
- `.env` lokal placeholder degerlerle olusturuldu. Dosya `.gitignore` kapsaminda oldugu icin repoya alinmaz.
- `npm install` yeniden calistirildi ve bagimlilik kurulumu tamamlandi.
- `npx prisma generate` placeholder `DATABASE_URL` ile basarili calisti.
- `src/features/results/queries.ts` eklendi.
- Hoca sonuc listesi icin `getTeacherResults()` query'si yazildi.
- Tanimli ogrenciler icin `getTeacherStudents()` query'si yazildi.
- `/teacher/results` placeholder sayfasi tamamlanan denemeleri listeleyen tabloya baglandi.
- `/teacher/students` placeholder sayfasi tanimli ogrenci kartlari ve son test ozetiyle gercek veriye baglandi.
- `npm run typecheck`, `npm run lint`, `npm run test` ve `npm run build` guncel durumda basarili calisti.
- `docs/README.md` eklendi; kurulum, env, Prisma, seed, gelistirme ve dogrulama komutlari dokumante edildi.
- Soru duzenleme action'i eklendi ve `/teacher/questions` listesindeki inline duzenleme formuna baglandi.
- Test duzenleme action'i eklendi ve `/teacher/tests` listesindeki inline duzenleme formuna baglandi.
- Test duzenleme kapsaminda mevcut sonuc kayitlarini bozmamak icin soru seti degistirme eklenmedi; baslik, aciklama, ders, sure, durum ve sonucu aninda goster ayarlari duzenlenebilir.
- Soru/test duzenleme sonrasi `npm run typecheck`, `npm run lint`, `npm run test` ve `npm run build` basarili calisti.
- `src/features/admin` modulu eklendi.
- Admin hoca, ders ve hoca-ogrenci eslestirme query/action/schema yapilari yazildi.
- `/admin` sayfasi hoca olusturma/guncelleme, ders olusturma/guncelleme ve hoca-ogrenci eslestirme olusturma/kaldirma akislariyla gercek veriye baglandi.
- Admin panel degisiklikleri sonrasi `npm run typecheck`, `npm run lint`, `npm run test` ve `npm run build` basarili calisti.
- Hoca sonuc detay query'si eklendi.
- `/teacher/results/[attemptId]` detay sayfasi eklendi ve sonuc listesinden detay linki verildi.
- Sonuc detay akisi sonrasi `npm run typecheck`, `npm run lint`, `npm run test` ve `npm run build` basarili calisti.
- `src/lib/rate-limit.ts` eklendi.
- OTP isteme, test baslatma ve hoca login akislari Upstash rate limiting helper'ina baglandi.
- Upstash env placeholder/eksikse lokal gelistirme fail-open devam eder.
- Rate limiting entegrasyonu sonrasi `npm run typecheck`, `npm run lint`, `npm run test` ve `npm run build` basarili calisti.
- `src/components/advertisement.tsx` eklendi.
- Ana sayfa, ders listesi ve ogrenci sonuc sayfalarindaki reklam placeholder'lari statik reklam componentine baglandi.
- `src/components/legal-page.tsx` eklendi.
- `/iletisim`, `/gizlilik-politikasi`, `/kvkk` ve `/kullanim-kosullari` sayfalari eklendi.
- Reklam/yasal sayfa degisiklikleri sonrasi `npm run typecheck`, `npm run lint`, `npm run test` ve `npm run build` basarili calisti.
- `.env.example` NextAuth production degiskenleriyle guncellendi.
- `docs/README.md` icine deployment kontrol listesi ve manuel test senaryolari eklendi.
- `npm audit --audit-level moderate` calistirildi. 9 moderate uyari var; onerilen `npm audit fix --force` Prisma/Next/NextAuth icin breaking downgrade getirdigi icin uygulanmadi.
- Emir'in kafasinin karismamasi icin eski uzun karar dokumani ve PDF ciktisi repodan kaldirildi.
- Guncel dokuman yapisi sadeleştirildi: `docs/README.md` kurulum icin, `docs/ROADMAP_PROGRESS.md` durum ve kalan is takibi icin kullanilir.

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

- Eski karar dokumani diff kontrolu: Basarili, sadece CRLF uyarisi verdi.
- Eski PDF ciktisi daha once yeniden uretildi; artik sadeleştirme kapsaminda repodan kaldirildi.
- `npm run typecheck`: Basarili.
- `npm run lint`: Basarili.
- `npm run build`: Basarili.
- `npm run test`: Basarili, 2 test gecti.
- `npx prisma format`: Basarili.
- `npx prisma validate`: Basarili.
- `npx prisma generate`: Basarili.
- 2026-05-01 mevcut inceleme notu: Lokal makinede Node.js `20.18.0` oldugu icin `npm install` Prisma 7 tarafinda durdu. Prisma 7 icin Node.js `20.19+`, `22.12+` veya `24.0+` gerekiyor. Bu nedenle yukaridaki dogrulamalar guncel lokal ortamda tekrar calistirilmelidir.
- 2026-05-01 guncel dogrulama: Node.js `20.20.2` surumune guncellendi.
- 2026-05-01 `npm install`: Basarili. `@prisma/streams-local` icin Node 22 uyarisi ve 9 moderate npm audit uyarisi var.
- 2026-05-01 `npx prisma generate`: Basarili.
- 2026-05-01 `npm run typecheck`: Basarili.
- 2026-05-01 `npm run lint`: Basarili.
- 2026-05-01 `npm run test`: Basarili, 2 test gecti.
- 2026-05-01 `npm run build`: Basarili.
- 2026-05-01 `npm audit --audit-level moderate`: 9 moderate uyari var. Force fix breaking downgrade oneriyor; uygulanmadi.

## Acik Riskler ve Notlar

- Neon baglantisi lokal `.env` icinde tanimli ve `.gitignore` kapsamindadir; connection string repoya eklenmemeli.
- Gercek Resend ve Upstash anahtarlari production icin henuz final kontrol bekliyor.
- KVKK, gizlilik ve kullanim kosullari sayfalari taslak olarak eklendi; yayina alinmadan once hukuki/kisisel kurum bilgileriyle final kontrol gerekir.
- Ilk schema Neon main branch'e uygulandi; repo icinde `prisma/migrations` gecmisi henuz yok.
- `docs/README.md`, `docs/BACKEND.md` ve `docs/FRONTEND.md` eklendi, ancak gercek deployment env degerleri proje yayina alinmadan once tekrar kontrol edilmeli.
- `.env.example` Auth.js/NextAuth degiskenleriyle guncellendi; production degerleri deployment sirasinda gercek domain/secret ile degistirilmeli.
- Upstash rate limiting kodu yazildi, ancak gercek Upstash anahtarlari olmadan production davranisi manuel test edilmedi.
- `/teacher/results`, `/teacher/students` ve `/admin` gercek veriye baglandi; manuel tarayici testi bekliyor.
- Hoca sonuc detay akisi ve admin hoca-ogrenci eslestirme yonetimi kod seviyesinde tamamlandi; manuel test bekliyor.
- Npm audit 9 moderate uyari veriyor; `npm audit fix --force` Prisma/Next/NextAuth icin breaking downgrade onerdiği icin otomatik uygulanmadi.

## Siradaki Oncelikli Isler

1. Repo icinde Prisma migration gecmisi stratejisini belirle.
2. Netlify env listesi ve deployment ayarlarini gercek degerlerle kontrol et.
3. Ogrenci, hoca ve admin akisini gercek DB ile manuel test et.
4. Yasal sayfalardaki placeholder kurum/e-posta bilgilerini final bilgilerle degistir.
5. Audit uyarilari icin upstream paket guncellemelerini takip et; breaking downgrade iceren force fix uygulanmamalidir.

# Emir Tabanli Testoria Altyapi Kurulum Plani

Bu dokuman, mevcut klasore Emir'in frontend reposu yerlestirildikten sonra projeyi eksiksiz, hatasiz ve production'a hazir hale getirmek icin yapilacak isleri listeler.

Ana karar: Emir'in frontend'i ana taban olarak kalacak. Eski Testoria backend/auth/DB mantigi bu frontend uzerine yeniden ve kontrollu sekilde kurulacak.

## Mevcut Durum Ozeti

- Emir repo icerigi mevcut proje klasorune tasindi.
- `.git` ve lokal `.env` korundu.
- `npm install` calisti.
- `npm run db:generate` calisti ve Prisma Client uretildi.
- `npm run typecheck` Prisma generate sonrasi geciyor.
- `npm run lint` geciyor.
- `npm run build` geciyor.
- UI dosyalarinin buyuk bolumu Emir'in hedef gorsel dilini tasiyor.
- Bir cok panel sayfasi hala `UI preview mode - no auth, no DB` durumunda.
- Backend dosyalari eski OTP tabanli ogrenci test akisini iceriyor.
- Mevcut hedef karar ise ogrenci icin OTP degil e-posta + sifre + zorunlu ogrenci hesabi.

## Kritik Bulgular

### Frontend

- Ana sayfa `src/app/page.tsx` Emir'in iki kartli premium rol secim UI'ini kullaniyor.
- Ogrenci login `src/app/login/page.tsx` gercek `loginStudentPortal` server action'ina baglandi.
- Register `src/app/register/page.tsx` ogrenci icin `registerStudentPortal` server action'ina baglandi; hoca secimi Faz 4'e kadar `/teacher/login` yonlendirmesi yapiyor.
- Ogrenci panel sayfalari buyuk oranda hardcoded preview data kullaniyor.
- Hoca panel sayfalari buyuk oranda hardcoded preview data kullaniyor.
- `src/app/(public)` altinda eski public route'lar duruyor; `/` route conflict riski icin `src/app/(public)/page.tsx` kaldirildi ve Emir ana sayfasi `src/app/page.tsx` ana route olarak birakildi.
- Ogrenci/hoca ortak sidebar componentleri sayfalara gomulu; merkezi layout yok veya eksik.
- `src/app/(student)/student/layout.tsx` ve `src/app/(teacher)/teacher/layout.tsx` eski temizlikte silinmis durumda; Emir sayfalari kendi sidebar'larini iceriyor.

### Backend

- Prisma schema mevcut ama ogrenci auth icin `Student.passwordHash` yok.
- `StudentAnswer` snapshot alanlari yok; gecmis sonuc koruma eksik.
- `OtpVerification` ve `src/lib/otp.ts` hala var.
- `student-test` actionlari OTP ile test baslatiyor.
- Ogrenci session altyapisi yok: `student_portal_session` benzeri HTTP-only cookie modeli tekrar kurulacak.
- Attempt access cookie altyapisi yok.
- Hoca/admin auth icin NextAuth Credentials altyapisi var.
- Hoca self-register action'i yok veya mevcut UI ile bagli degil.
- `src/lib/db.ts` Neon adapter kullaniyor ve runtime icin `neonConfig.webSocketConstructor = ws` ayari eklendi.
- `prisma/seed.ts` idempotent degil; her calistirmada yeni soru/test duplicate uretme riski var.
- `prisma/seed.ts` icindeki `// @ts-nocheck` kaldirildi ve seed icin `neonConfig.webSocketConstructor = ws` ayari eklendi.

### Teknik Kontrol Sonuclari

Calisan komutlar:

```bash
npm install
npm run db:generate
npm run typecheck
npm run lint
npm run build
```

`npm install` notlari:

- `@prisma/streams-local` icin Node 20 uzerinde engine warning var; proje yine kuruldu.
- 6 moderate audit uyarisi var.
- `npm audit fix --force` dogrudan calistirilmamali; breaking update riski var.

`npm run typecheck`:

- Prisma generate oncesi cok sayida Prisma export hatasi verdi.
- `npm run db:generate` sonrasi gecti.

`npm run lint`:

- Faz 1 duzeltmeleri sonrasi geciyor.

`npm run build`:

- Faz 1 duzeltmeleri sonrasi geciyor.

## Genel Hedef Mimari

- UI tabani Emir frontend olarak kalacak.
- Backend gercek Testoria altyapisina cekilecek.
- Mock/hardcoded data production route'larda kalmayacak.
- Auth'suz `router.push()` ogrenci login/register akislari kaldirildi; hoca register secimi Faz 4'e kadar gecici yonlendirme.
- Ogrenci test cozmek icin kayitli ve giris yapmis olacak.
- Hoca/admin NextAuth Credentials ile calisacak.
- Neon PostgreSQL + Prisma 7 + Prisma Neon adapter kullanilacak.
- Netlify deployment hedeflenecek.
- Secrets repoya yazilmayacak.
- `ADMIN_EMAIL` ve `ADMIN_PASSWORD` Netlify runtime env'e konulmayacak; sadece seed icin lokal/kontrollu ortamda kullanilacak.

## Faz 0 - Repo ve Baseline Sabitleme

- [ ] Mevcut Emir tabaninin git diff'i incelenecek.
- [ ] Gerekirse `emir-base-import` gibi bir checkpoint branch/commit olusturulacak.
- [ ] `.env` korunacak, repoya eklenmeyecek.
- [ ] `.gitignore` Emir tabaninda `.env`, `.next`, `node_modules` ve build ciktilarini kapsiyor mu kontrol edilecek.
- [ ] Eski silinen `docs/` yapisinin geri gelip gelmeyecegine karar verilecek.
- [ ] Bu dokuman ana is takibi olarak kullanilacak veya `docs/` altina tasinacak.

Dogulama:

- [ ] `git status --short`
- [ ] `npm install`
- [ ] `npm run db:generate`

## Faz 1 - Build ve Lint Baseline Temizligi

- [x] `prisma/seed.ts` icindeki `// @ts-nocheck` kaldirilacak.
- [x] Seed dosyasina dogru tipler verilecek.
- [x] `src/app/(student)/test/[id]/page.tsx` icindeki kullanilmayan `Bell` import'u kaldirilacak.
- [x] `src/lib/db.ts` icine Neon WebSocket constructor ayari eklenecek.
- [x] `prisma/seed.ts` icine de Neon WebSocket constructor ayari eklenecek.
- [x] `package.json` build script'i Netlify icin `prisma generate && next build` olarak netlestirilecek.
- [x] `next-env.d.ts` build/typecheck sonrasinda stabil kalacak mi kontrol edilecek.
- [x] Root route conflict kontrol edilecek: `src/app/page.tsx` ve `src/app/(public)/page.tsx` ayni `/` route'una denk geliyorsa biri kaldirilacak veya tasinacak.

Dogulama:

- [x] `npm run typecheck`
- [x] `npm run lint`
- [x] `npm run build`

## Faz 2 - Prisma Schema'yi Final Backend Kararina Cekme

Gerekli schema hedefleri:

- [x] `Student.passwordHash String?` eklenecek.
- [x] OTP artik ana ogrenci auth modeli olmadigi icin `OtpVerification` ve `OtpPurpose` kaldirilacak veya migration stratejisiyle pasife alinacak.
- [x] `StudentAnswer` snapshot alanlari eklenecek:
  - [x] `questionTextSnapshot String? @db.Text`
  - [x] `optionASnapshot String?`
  - [x] `optionBSnapshot String?`
  - [x] `optionCSnapshot String?`
  - [x] `optionDSnapshot String?`
  - [x] `correctOptionSnapshot String?`
  - [x] `explanationSnapshot String? @db.Text`
- [x] `Test.requiresStudentAccount` davranisi netlestirilecek; test baslatmada zaten zorunlu hesap kullanilacak.
- [ ] `Ad` modeli kalacaksa frontend'e baglanip baglanmayacagi belirlenecek.
- [x] Prisma migration stratejisi secilecek:
  - [x] Lokal `prisma migrate dev` ile migration dosyasi uretme.
  - [x] Neon MCP migration workflow'u ile main branch'e uygulama.
  - [x] Production icin tek kaynak olacak yaklasimi netlestirme.

Dogrulama:

- [x] `npm run db:generate`
- [x] `npm run typecheck`
- [x] `npm run lint`
- [x] `npm run build`
- [x] Migration diff manuel incelenecek.

Not: OTP modeli bu fazda fiziksel olarak silinmedi; mevcut kod hala OTP import ettigi icin build baseline korunarak `OtpVerification` ve `OtpPurpose` legacy durumda birakildi. Faz 3/Faz 6 tamamlaninca OTP kodu ve schema kalintilari birlikte kaldirilacak.

## Faz 3 - Ogrenci Auth Altyapisini Kurma

Hedef: Ogrenci OTP'siz, e-posta + sifre ile kayit/giris yapacak.

- [x] `src/lib/student-session.ts` olusturulacak.
- [x] HTTP-only signed cookie adi belirlenecek: `student_portal_session`.
- [x] Session cookie payload minimal olacak: student id + imza.
- [x] Production'da `NEXTAUTH_SECRET` veya `AUTH_SECRET` yoksa hata atilacak.
- [x] `src/features/student-portal/actions.ts` olusturulacak:
  - [x] `registerStudentPortal`
  - [x] `loginStudentPortal`
  - [x] `logoutStudentPortal`
- [x] `src/features/student-portal/schemas.ts` olusturulacak:
  - [x] `studentLoginSchema`
  - [x] `studentRegisterSchema`
- [ ] `src/features/student-portal/queries.ts` olusturulacak:
  - [ ] `getStudentDashboardData`
  - [ ] `getStudentAttempts`
  - [ ] `getCurrentStudent`
- [x] `src/features/student-portal/queries.ts` icine ilk `getStudentById` sorgusu eklendi.
- [x] `src/app/login/page.tsx` sahte `router.push()` yerine gercek action kullanan forma baglanacak.
- [x] `src/app/register/page.tsx` ogrenci kaydini gercek backend'e baglayacak; hoca kaydi Faz 4'e birakildi.
- [x] Ogrenci login sonrasi `/student/dashboard` route'una gidecek.
- [x] `src/app/(student)/student/layout.tsx` ile ogrenci panel route'lari session guard altina alinacak.
- [x] `src/app/(student)/student/logout/page.tsx` cookie temizleyip ana sayfaya yonlendirecek.
- [x] Ogrenci logout butonlari gercek session temizleme akisini kullanan `/student/logout` route'una baglanacak.

Dogulama:

- [x] `npm run typecheck`
- [x] `npm run lint`
- [x] `npm run build`
- [ ] Yeni ogrenci kaydi browser/DB ile dogrulanacak.
- [ ] Mevcut ogrenci girisi browser/DB ile dogrulanacak.
- [ ] Yanlis sifrede hata mesaji browser'da dogrulanacak.
- [ ] Logout sonrasi dashboard'a erisim engeli.

Not: Dashboard ve diger `/student/*` panel route'lari session guard altinda. Ancak icerikteki preview veriler henuz gercek query'lere baglanmadi; bu is Faz 5'te tamamlanacak.

## Faz 4 - Hoca/Admin Auth ve Kayit Akisini Emir UI'a Baglama

- [x] `src/features/auth/actions.ts` tekrar kurulacak.
- [x] `registerTeacherAccount` server action'i eklenecek.
- [x] `src/features/auth/schemas.ts` icine `teacherRegisterSchema` eklenecek.
- [x] `src/app/register/page.tsx` hoca secimi yapildiginda `registerTeacherAccount` kullanacak.
- [x] `src/app/(teacher)/teacher/login/page.tsx` ve `TeacherLoginForm` NextAuth Credentials ile calismaya devam edecek.
- [x] Hoca login preview degil gercek session ile dashboard'a girecek.
- [x] Admin login icin mevcut NextAuth role guard korunacak.
- [x] `middleware.ts` ile `/teacher/*` ve `/admin` route'lari NextAuth JWT rolune gore korunacak.
- [x] `requireTeacher`, `requireAdmin`, `getTeacherProfile` guard'lari gozden gecirilecek.

Dogulama:

- [x] `npm run typecheck`
- [x] `npm run lint`
- [x] `npm run build`
- [x] Hoca kayit browser/DB ile dogrulanacak.
- [x] Hoca giris browser/DB ile dogrulanacak.
- [ ] Pasif hoca girisi engeli browser/DB ile dogrulanacak.
- [x] Admin route guard browser ile dogrulanacak.

Not: Hoca panel sayfalarinin bir kismi hala preview/hardcoded UI iceriyor. Route erisimi middleware ile korunuyor; gercek dashboard/veri baglantisi Faz 7'de tamamlanacak.

## Faz 5 - Ogrenci Panelini Gercek Veriye Baglama

Preview kalan route'lar:

- `src/app/(student)/student/dashboard/page.tsx`
- `src/app/(student)/student/classes/page.tsx`
- `src/app/(student)/student/courses/page.tsx`
- `src/app/(student)/student/tests/page.tsx`
- `src/app/(student)/student/results/page.tsx`
- `src/app/(student)/student/missing-topics/page.tsx`
- `src/app/(student)/student/wrong-questions/page.tsx`
- `src/app/(student)/student/coach-requests/page.tsx`
- `src/app/(student)/student/settings/page.tsx`
- `src/app/(student)/student/announcements/page.tsx`

Yapilacaklar:

- [x] `dashboard` server-side student session ile korunacak.
- [x] `src/features/student-portal/queries.ts` icine `getStudentDashboardData` eklenecek.
- [x] `src/app/(student)/student/dashboard/page.tsx` server component olarak gercek session/query verisi cekecek.
- [x] `src/app/(student)/student/dashboard/dashboard-client.tsx` client UI component'i olarak ayrilacak.
- [x] Dashboard hardcoded `student`, `notifications`, `stats` gercek query veya bos/Yakinda state ile degistirilecek.
- [x] `src/features/student-portal/queries.ts` icine `getStudentTestsData` eklenecek.
- [x] `src/features/student-portal/queries.ts` icine `getStudentResultsData` eklenecek.
- [x] `src/app/(student)/student/tests/page.tsx` gercek aktif test ve attempt verilerine baglanacak.
- [x] `src/app/(student)/student/results/page.tsx` gercek tamamlanmis attempt verilerine baglanacak.
- [x] `src/components/student-panel-frame.tsx` ortak ogrenci panel cercevesi olarak eklenecek.
- [x] `src/features/student-portal/queries.ts` icine `getStudentClassesData` eklenecek.
- [x] `src/features/student-portal/queries.ts` icine `getStudentMissingTopicsData` eklenecek.
- [x] `src/features/student-portal/queries.ts` icine `getStudentWrongQuestionsData` eklenecek.
- [x] `src/app/(student)/student/classes/page.tsx` gercek koç/sınıf iliskilerine baglanacak.
- [x] `src/app/(student)/student/missing-topics/page.tsx` gercek yanlis cevap konularina baglanacak.
- [x] `src/app/(student)/student/wrong-questions/page.tsx` gercek yanlis cevaplara baglanacak.
- [x] `src/features/student-portal/queries.ts` icine `getStudentCoursesData` eklenecek.
- [x] `src/app/(student)/student/courses/page.tsx` gercek aktif ders listesine baglanacak.
- [x] `src/app/(student)/student/coach-requests/page.tsx` guvenli bos/Yakinda state'e cekilecek.
- [x] `src/app/(student)/student/settings/page.tsx` ogrenci bilgilerini salt okunur gosterecek; duzenleme Yakinda state.
- [x] `src/app/(student)/student/announcements/page.tsx` guvenli bos state'e cekilecek.
- [x] Ogrenci panel sidebar aktif route'u `StudentPanelFrame` ile dinamik olacak.
- [ ] Ogrenci panel menu sadece gercek backend destekli route'lari gosterecek.
- [ ] `AdBanner` statik kalacaksa mock veri degil statik sponsor alani olarak tanimlanacak.
- [ ] Bildirimler backend yoksa `Yakinda` veya bos state olacak.

Dogulama:

- [ ] Giris yapmayan ogrenci dashboard'a giremez.
- [ ] Giris yapan ogrenci kendi verisini gorur.
- [ ] Deneme gecmisi gercek attempt'lerden gelir.

## Faz 6 - Ogrenci Test Baslatma/Cozme/Sonuc Guvenligi

Mevcut sorun:

- Test baslatma OTP ile calisiyordu.
- Attempt access cookie yoktu.
- Sonuc ekraninda snapshot yoktu.

Yapilanlar:

- [x] `src/features/student-test/schemas.ts` OTP alanlari kaldirildi; sadece testId, teacherId ve onay checkbox'lari kaldi.
- [x] `src/features/student-test/actions.ts` OTP bagimliligindan arindirildi.
- [x] `requestStudentOtp` action'i kaldirildi.
- [x] `startStudentAttempt` artik `requireStudentSession()` kullaniyor; ogrenci bilgileri form yerine session'dan geliyor.
- [x] Test baslatma sadece giris yapmis ogrenci session'i ile calisiyor.
- [x] Test cozum sayfasi (`/test/[id]`) server component oldu; ogrenci session ownership kontrolu yapiliyor.
- [x] Test tamamlama action'i (`completeStudentAttempt`) ownership kontrolu (`studentId`) yapıyor.
- [x] Cevap kaydinda snapshot alanlari (`questionTextSnapshot`, `option*Snapshot`, `correctOptionSnapshot`, `explanationSnapshot`) dolduruluyor.
- [x] `showResultImmediately=false` ise sonuc ekraninda cevap detaylari gosterilmiyor; sadece puan/dogru/yanlis/bos gosteriliyor.
- [x] Sonuc ekrani (`/test/[id]/result`) ownership kontrolu ile korunuyor.
- [x] Test cozum client component'i (`test-solving-client.tsx`) gercek veriyle calisiyor; kalan sure, soru navigasyonu ve isaretleme destekleniyor.

Not: `src/lib/otp.ts` dosyasi hala mevcut ama artik student-test aksisi tarafindan kullanilmiyor. Tamamen temizlik sonraki adimda yapilabilir.

Dogulama:

- [x] `npm run typecheck`
- [x] `npm run lint`
- [x] `npm run build`
- [ ] Girissiz test baslatma `/login?next=...` yonlendirmesi browser'da dogrulanacak.
- [ ] Girisli ogrenci test baslatir ve cozer.
- [ ] Dogru cevap client'a gitmez.
- [ ] Test tamamlanir ve sonuc hesaplanir.
- [ ] Gizli sonuc testinde cevap detaylari gorunmez.
- [ ] Baska ogrencinin attempt URL'i acilamaz.

## Faz 7 - Hoca Panelini Gercek Veriye Baglama

Preview kalan route'lar:

- `src/app/(teacher)/teacher/dashboard/page.tsx`
- `src/app/(teacher)/teacher/questions/page.tsx`
- `src/app/(teacher)/teacher/tests/page.tsx`
- `src/app/(teacher)/teacher/tests/create/page.tsx`
- `src/app/(teacher)/teacher/results/page.tsx`
- `src/app/(teacher)/teacher/results/[attemptId]/page.tsx`
- `src/app/(teacher)/teacher/students/page.tsx`
- `src/app/(teacher)/teacher/settings/page.tsx`

Yapilacaklar:

- [x] Ortak `TeacherPanelFrame` ve `TeacherPanelHeader` component'leri eklendi.
- [x] Dashboard stat kartlari `getTeacherDashboardData()` ile gercek veriye baglandi.
- [x] Soru havuzu `getTeacherQuestionBank()` ile gercek veriye baglandi.
- [x] Soru ekleme/duzenleme/pasife alma server action'lari Emir UI formuna baglandi.
- [x] Test listeleme `getTeacherTestBuilderData()` ile gercek veriye baglandi.
- [x] `tests/create` route'u gercek test builder olarak calisiyor; `createTest` action'a bagli.
- [x] Test builder Emir'in 3 kolon UI'ini koruyarak gercek soru verisi ile calisiyor.
- [x] Test status guncelleme ve silme gercek server action'a baglandi.
- [x] Sonuclar `getTeacherResults()` sorgusuna baglandi.
- [x] Ogrenciler `getTeacherStudents()` ile gercek `TeacherStudent` iliskisine baglandi.
- [x] Backend modeli olmayan istek/sinif/materyal paylasimi preview aksiyonlari kaldirildi veya bos state'e cekildi.
- [x] Ayarlar sayfasi `updateTeacherProfile` ve `updateTeacherPassword` server action'lari ile calisiyor.

Dogulama:

- [x] `npm run typecheck`
- [x] `npm run lint`
- [x] `npm run build`
- [ ] Hoca sadece kendi soru/test/sonuclarini gorur.
- [ ] Hoca baskasinin result detail URL'ini acamaz.
- [ ] Test olusturma secilen soru sirasini kaydeder.
- [ ] Soru seti edit mevcut sonuc kayitlarini bozmaz.

## Faz 8 - Admin Panel ve Veri Yonetimi

- [x] `/admin` route'u `requireAdmin()` ile korunacak.
- [x] Hoca olusturma/guncelleme formlari gercek action'a baglanacak.
- [x] Ders olusturma/guncelleme formlari gercek action'a baglanacak.
- [x] Hoca-ogrenci eslestirme olusturma/kaldirma gercek action'a baglanacak.
- [x] Admin panel UI Emir diline aykiri kalmayacak sekilde polish edilecek.
- [ ] Action throw durumlari kullanici dostu hata state'lerine cevrilecek.

Dogrulama:

- [x] Admin login.
- [x] Hoca CRUD.
- [x] Ders CRUD.
- [x] Eslestirme CRUD.
- [x] Pasif hoca girisi engellenir.

## Faz 9 - Seed ve Demo Veri

- [x] `prisma/seed.ts` `@ts-nocheck` olmadan typed hale getirilecek.
- [x] Neon WebSocket constructor ayari eklenecek.
- [x] Seed idempotent olacak.
- [x] Admin, demo hoca ve demo ogrenciler upsert edilecek.
- [x] `Student.passwordHash` seed ile doldurulacak.
- [x] Dersler upsert edilecek.
- [x] Sorular ayni metin/ders/hoca kombinasyonuyla bulunup guncellenecek; duplicate uretilmeyecek.
- [x] Testler ayni baslik/ders/hoca kombinasyonuyla bulunup guncellenecek; duplicate uretilmeyecek.
- [x] Attempt ve answer snapshot verileri idempotent olusturulacak.
- [x] Aninda sonuc ve gizli sonuc senaryolari seed'e eklenecek.

Dogrulama:

- [x] `npm run db:seed`
- [x] `npm run db:seed` ikinci kez hatasiz calisir.
- [x] Dashboardlar seed sonrasi dolu gorunur.

## Faz 10 - Dokumantasyon ve Env

- [ ] README eski OTP/Vercel ifadelerinden arindirilecek.
- [ ] Netlify hedefi dokumante edilecek.
- [ ] Runtime env listesi netlestirilecek:
  - [ ] `DATABASE_URL`
  - [ ] `DIRECT_URL`
  - [ ] `AUTH_SECRET`
  - [ ] `AUTH_URL`
  - [ ] `NEXTAUTH_SECRET`
  - [ ] `NEXTAUTH_URL`
  - [ ] `RESEND_API_KEY` gerekiyorsa
  - [ ] `UPSTASH_REDIS_REST_URL` gerekiyorsa
  - [ ] `UPSTASH_REDIS_REST_TOKEN` gerekiyorsa
- [ ] Seed-only env listesi ayrilacak:
  - [ ] `ADMIN_EMAIL`
  - [ ] `ADMIN_PASSWORD`
- [ ] Netlify runtime env'e `ADMIN_EMAIL` ve `ADMIN_PASSWORD` konulmamasi yazilacak.
- [ ] `.env.example` secret scan'i tetiklemeyecek placeholderlarla guncellenecek.
- [ ] `netlify.toml` eklenecek veya Netlify UI build ayarlari dokumante edilecek.

Dogulama:

- [ ] Dokumanlardaki route/env/komutlar gercek proje ile uyumlu.
- [ ] Secret veya gercek connection string repoda yok.

## Faz 11 - Final Build, Test ve Browser Kontrolu

Komutlar:

- [x] `npm run db:generate`
- [x] `npm run typecheck`
- [x] `npm run lint`
- [x] `npm run test`
- [x] `npm run build`
- [x] `npm run db:seed`

Manual browser smoke test:

- [x] `/` ana sayfa desktop.
- [ ] `/` ana sayfa mobile.
- [x] `/login` ogrenci giris.
- [x] `/register` ogrenci/hoca kayit.
- [ ] `/student/dashboard` auth guard.
- [ ] `/student/dashboard` gercek veri.
- [x] `/online-test` ders secimi.
- [ ] `/online-test/[slug]` test secimi.
- [ ] `/test/[id]/start` girisli ogrenci.
- [ ] `/test/[attemptId]` test cozum.
- [ ] `/test/[attemptId]/result` sonuc.
- [x] `/teacher/login` hoca giris.
- [x] `/teacher/dashboard` gercek veri.
- [ ] `/teacher/questions` CRUD.
- [ ] `/teacher/tests` veya `/teacher/tests/create` test builder.
- [ ] `/teacher/results` sonuc listesi.
- [ ] `/teacher/students` ogrenci takibi.
- [x] `/admin` admin panel.

Responsive kontrol:

- [ ] 375px mobile.
- [ ] 768px tablet.
- [ ] 1440px desktop.
- [ ] Sidebar yatay/dikey davranisi.
- [ ] Uzun tablo overflow davranisi.
- [ ] Modal ve dropdown z-index davranisi.

## Oncelik Sirasi

1. Faz 1: build/lint baseline.
2. Faz 2: schema final kararlari.
3. Faz 3: ogrenci auth.
4. Faz 6: test guvenligi.
5. Faz 7: hoca panel gercek veri.
6. Faz 5: ogrenci panel gercek veri.
7. Faz 8: admin panel.
8. Faz 9: seed.
9. Faz 10: dokumantasyon/env.
10. Faz 11: final test/browser kontrolu.

## Kesinlikle Yapilmayacaklar

- [ ] Gercek secret veya connection string repoya yazilmayacak.
- [ ] Emir UI dosyalari tekrar eski Testoria tasarimina cevrilmeyecek.
- [ ] Production route'larda mock data aktif kalmayacak.
- [ ] Auth'suz `router.push()` login/register davranisi production'da kalmayacak.
- [ ] Dogru cevaplar test cozum client'ina gonderilmeyecek.
- [ ] Baska hocanin test/sonuc verisi gorulemeyecek.
- [ ] Baska ogrencinin attempt/result URL'i acilamayacak.

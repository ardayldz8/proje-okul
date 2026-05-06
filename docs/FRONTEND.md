# Frontend Dokumantasyonu

Bu dokuman Testoria frontend yapisinin guncel teknik ozetidir. Backend detaylari icin `docs/BACKEND.md`, genel kurulum icin `docs/README.md`, faz takibi icin `docs/ROADMAP_PROGRESS.md` kullanilir.

## Teknoloji Stack

- Next.js 16 App Router
- React 19
- TypeScript strict mode
- Tailwind CSS 4
- Server Components
- Server Actions
- NextAuth client helpers
- Zod form validasyonu

## Genel Mimari

Frontend, Next.js App Router route gruplari uzerinden ayrilir.

- Public sayfalar: `src/app/(public)`
- Ogrenci test sayfalari: `src/app/(student)`
- Hoca paneli: `src/app/(teacher)`
- Admin paneli: `src/app/(admin)`
- Ortak componentler: `src/components`
- Feature bazli client componentler: `src/features/*/components`

Varsayilan tercih Server Component kullanmaktir. Sadece browser state, `useActionState`, `signIn`, `useRouter` veya local interaction gereken formlar client component olarak yazilir.

## Route Haritasi

Public route'lar:

- `/`: Ana sayfa, ogrenci ve hoca girisi CTA'lari, statik reklam alani.
- `/online-test`: Aktif ders listesi.
- `/online-test/[courseId]`: Secilen dersin aktif testleri. Param adi `courseId` olsa da deger olarak ders slug'i kullanilir.
- `/iletisim`: Iletisim sayfasi.
- `/kvkk`: KVKK metni.
- `/gizlilik-politikasi`: Gizlilik politikasi.
- `/kullanim-kosullari`: Kullanim kosullari.

Ogrenci route'lari:

- `/student/login`: Ogrenci paneli kayit/giris ekrani.
- `/student/dashboard`: Ogrenci paneli dashboard ekrani.
- `/student/attempts`: Ogrencinin deneme gecmisi.
- `/test/[id]/start`: Test baslangic formu, kayitli ogrenci ozeti, hoca secimi ve yasal onaylar.
- `/test/[id]`: Test cozum ekrani.
- `/test/[id]/result`: Ogrenci sonuc ekrani.

Hoca route'lari:

- `/teacher/login`: Hoca/admin giris formu ve hoca kayit ekrani.
- `/teacher/dashboard`: Hoca dashboard.
- `/teacher/questions`: Soru havuzu ve soru CRUD formlari.
- `/teacher/tests`: Test olusturma, listeleme ve metadata/status duzenleme.
- `/teacher/results`: Tamamlanan test sonuclari listesi.
- `/teacher/results/[attemptId]`: Tekil sonuc detayi.
- `/teacher/students`: Hoca ile eslesen ogrenciler ve test ozetleri.

Admin route'lari:

- `/admin`: Hoca, ders ve hoca-ogrenci eslestirme yonetimi.

API route'lari frontend olmayan destek route'laridir:

- `/api/auth/[...nextauth]`
- `/api/health`

## Layout ve Global Stil

Ana dosyalar:

- `src/app/layout.tsx`
- `src/app/globals.css`

`layout.tsx` yalindir; `html` dili `tr` olarak tanimlanir ve tum sayfalar direkt `children` olarak render edilir. Hoca paneli icin route-level ortak shell `src/app/(teacher)/teacher/layout.tsx`, ogrenci paneli icin `src/app/(student)/student/layout.tsx` altinda tanimlidir.

`globals.css` Tailwind CSS 4 import eder ve temel CSS variable'lari tanimlar:

- `--background`: acik gri zemin.
- `--foreground`: koyu slate metin.
- `--muted`: ikincil metin.
- `--card`: beyaz kart.
- `--border`: slate border.
- `--primary`: koyu indigo.
- `--accent`: teal.

Global body font ailesi `Arial, Helvetica, sans-serif` olarak ayarli. Sayfa tasarimlari su anda agirlikli olarak Tailwind utility class'lari ile inline yaziliyor.

## Tasarim Dili

Mevcut UI dili MVP cekirdegi uzerine kurulu, ancak public portal ve hoca panelinde daha belirgin bir urun dili kullanilmaya baslandi.

Ana desenler:

- Arka plan: `bg-slate-50`
- Kartlar: `rounded-3xl`, `border border-slate-200`, `bg-white`, `shadow-sm`
- Ana CTA: `bg-indigo-950`, `text-white`, `rounded-full`
- Ikincil CTA: `border border-slate-300`, `text-slate-900`, `rounded-full`
- Vurgu rengi: `text-teal-700`, `border-teal-700`, `bg-teal-50`
- Ana sayfa portal dili: koyu bordo/teal gradient zemin, glass kartlar, iki ana rol karti ve yasal footer.
- Hoca ve ogrenci panel dili: koyu indigo/teal gradient hero, yuvarlak buyuk beyaz panel kartlari, siyah agirlikli basliklar ve yumusak hover durumlari.
- Hata mesaji: `bg-red-50`, `text-red-700`
- Basari mesaji: `bg-emerald-50`, `text-emerald-700`
- Bos durumlar: dashed border veya `bg-slate-50` kartlar

Responsive yaklasim:

- Ana container genelde `mx-auto max-w-4xl`, `max-w-5xl` veya `max-w-6xl` kullanir.
- Grid yapilari `md:grid-cols-*`, `lg:grid-cols-*` ile desktop'a genisler.
- Formlar mobilde tek kolon, desktop'ta iki/uc kolon olacak sekilde tasarlanir.

## Component Yapisi

Ortak componentler:

- `src/components/advertisement.tsx`: Home, ders listesi ve sonuc sayfalarinda statik reklam/duyuru alani.
- `src/components/legal-page.tsx`: KVKK, gizlilik ve kullanim kosullari gibi yasal metin sayfalari icin ortak sayfa componenti.
- `src/components/teacher-panel-shell.tsx`: Hoca paneli icin ortak sidebar/topbar shell componenti. `/teacher/login` route'unda shell gosterilmez.
- `src/components/student-panel-shell.tsx`: Ogrenci paneli icin ortak sidebar/topbar shell componenti. `/student/login` route'unda shell gosterilmez.

Feature client componentleri:

- `src/features/auth/components/teacher-login-form.tsx`: Sekmeli hoca giris/kayit formu.
- `src/features/student-portal/components/student-login-form.tsx`: Ogrenci paneli kayit/giris formu.
- `src/features/student-test/components/student-start-form.tsx`: Kayitli ogrenci icin yasal onay ve test baslatma formu.
- `src/features/student-test/components/test-solving-form.tsx`: Test cozum ekraninda cevap secimi, ilerleme, soru navigasyonu ve bitirme onay modali.
- `src/features/question-bank/components/question-form.tsx`: Yeni soru ekleme formu.
- `src/features/test-builder/components/test-form.tsx`: Yeni test olusturma formu ve soru secimi.

Sayfa icinde lokal helper componentler de kullaniliyor. Ornekler:

- `StatCard`
- `QuickAction`
- `ResultCard`
- `Field`
- `Option`

Bu helper'lar su an sadece bulunduklari sayfada kullanildigi icin ayrica ortak component haline getirilmedi.

## Form ve Mutation Deseni

Frontend formlari iki ana desen kullanir.

Client form deseni:

- Browser state veya pending state gerekiyorsa `"use client"` kullanilir.
- Server Action ile `useActionState` kullanilir.
- Hata ve basari mesajlari action state uzerinden render edilir.
- Ornekler: `StudentStartForm`, `QuestionForm`, `TestForm`.

Server form deseni:

- Basit mutation formlarinda direkt `<form action={serverAction}>` kullanilir.
- Hidden input ile id degerleri action'a tasinir.
- Ornekler: test status guncelleme, soru pasife alma, admin hoca/ders formlari.

Login deseni:

- `TeacherLoginForm` client componenttir.
- Giris ve kayit ayni ekranda sekmeli olarak sunulur.
- Giris form verisi Zod ile client tarafinda kontrol edilir.
- Kayit akisi server action ile `User` ve `Profile` kaydi olusturur.
- `signIn("credentials", { redirect: false })` kullanilir.
- Basarili giris veya kayit sonrasi `/teacher/dashboard` route'una push edilir ve router refresh yapilir.
- `StudentLoginForm` client componenttir.
- `useActionState` ile ayni form uzerinden kayit olma ve giris yapma action'larini kullanir.

## Public ve Ogrenci Akisi

Ogrenci paneli:

- Dosya: `src/app/(student)/student/layout.tsx`
- `StudentPanelShell` ile dashboard ve deneme gecmisi ekranlari ortak panel kabuguna alinir.
- `/student/login` route'u shell disinda tutulur.

Ogrenci panel girisi:

- Dosya: `src/app/(student)/student/login/page.tsx`
- Ogrenci e-posta ve sifre ile giris yapar veya ayni ekrandan kayit olur.
- Basarili giris/kayit sonrasi panel session'i acilir.

Ogrenci dashboard:

- Dosya: `src/app/(student)/student/dashboard/page.tsx`
- Tamamlanan deneme, ortalama puan, en iyi puan ve hoca sayisi kartlari bulunur.
- Profil bilgileri, tanimli hocalar ve son denemeler ayni ekranda gosterilir.

Ogrenci deneme gecmisi:

- Dosya: `src/app/(student)/student/attempts/page.tsx`
- Tamamlanan ve devam eden tum denemeler kart bazli listelenir.
- Deneme durumuna gore test cozum ya da sonuc ekranina geri donus linkleri sunulur.

Ana sayfa:

- Dosya: `src/app/(public)/page.tsx`
- Koyu gradient portal tasarimi kullanir.
- Header icinde marka, `Ogrenci Paneli` ve `Hoca Girisi` linkleri vardir.
- Ana sayfa sadece auth/dashboard odakli iki portal karti sunar: ogrenci `/student/login`, hoca `/teacher/login`.
- Hero bolumunde platform vaadi, iki ana CTA ve kisa metrik kartlari bulunur.
- Alt bolumde uc fayda karti vardir: ogrenci hesabi ile test, hoca paneli, guvenli sonuc akisi.
- `Advertisement` componentini `home` placement ile duyuru/sponsor alani olarak gosterir.
- Footer icinde KVKK, gizlilik, kullanim kosullari ve iletisim linkleri vardir.

Ders secimi:

- Dosya: `src/app/(public)/online-test/page.tsx`
- `getActiveCourses()` ile aktif dersleri okur.
- Gradient hero, aktif ders/toplam test/akis ozet kartlari ve ana sayfaya donus linki kullanir.
- Her ders karti `/online-test/[slug]` route'una gider.
- Dersler kart tabanli portal listesi olarak gosterilir.
- `dynamic = "force-dynamic"` ile DB verisinin runtime okunmasi saglanir.

Test secimi:

- Dosya: `src/app/(public)/online-test/[courseId]/page.tsx`
- Slug ile aktif ders ve aktif testler okunur.
- Derse donus linki, aktif test/toplam soru/aninda sonuc ozet kartlari bulunur.
- Test kartlari `/test/[testId]/start` route'una gider.
- Her test kartinda sure, soru sayisi ve sonuc gorunurlugu badge olarak gosterilir.

Test baslangici:

- Dosya: `src/app/(student)/test/[id]/start/page.tsx`
- Gradient hero, ders/soru/sure/sonuc ozet kartlari ve test listesine donus linki bulunur.
- Form iki kolonlu yerlesimde bilgi kartlariyla birlikte gosterilir.
- `StudentStartForm` ile kayitli ogrenci ozeti, hoca secimi ve yasal onaylar yonetilir.
- Hoca secimi frontend'de aktif hocalardan gelir; backend de secilen hocanin aktif `TEACHER` profil oldugunu tekrar dogrular.
- Test baslangici icin ogrenci panel oturumu zorunludur; anonim veya OTP tabanli baslatma yoktur.

Test cozum:

- Dosya: `src/app/(student)/test/[id]/page.tsx`
- Sadece attempt access cookie'si olan ogrenci attempt'i gorebilir.
- Dogru cevaplar client'a gonderilmez.
- Sayfa server component olarak attempt verisini okur ve `TestSolvingForm` client componentine aktarir.
- Sorular buyuk secenek kartlariyla cevaplanir; radio input'lar accessibility/form submit icin korunur.
- Sag panelde cevaplanan/bos soru sayisi, ilerleme bari ve soru navigasyonu vardir.
- `Testi Bitir` once onay modali acar.
- Onay submit'i `completeStudentAttempt` server action'ina gider.

Sonuc:

- Dosya: `src/app/(student)/test/[id]/result/page.tsx`
- `showResultImmediately` kapaliysa cevap detaylari gosterilmez.
- Kapali durumda "Sonuc Kaydedildi" ekrani, cozum suresi ve gizli sonuc bilgisi ile gosterilir.
- Aciksa gradient sonuc hero'su, puan gostergesi, ilerleme bari, toplam/dogru/yanlis/bos kartlari ve soru bazli cevap durumlari gosterilir.
- Cevap detaylarinda ogrencinin secimi ve dogru cevap snapshot/canli fallback ile listelenir.
- Reklam alani `result` placement ile gosterilir.

## Hoca Paneli UI

Hoca sayfalari server-side guard ile korunur ve data server component icinde okunur.

Ortak layout:

- Dosya: `src/app/(teacher)/teacher/layout.tsx`
- `TeacherPanelShell` ile dashboard, soru havuzu, testler, sonuclar ve ogrenciler ekranlari ortak panel kabuguna alinir.
- Sidebar desktop'ta sabit, mobilde yatay scroll menudur.
- Aktif route vurgusu `usePathname()` ile client wrapper icinde yapilir.
- Login sayfasi ayni route segmentinde oldugu icin shell tarafindan ozellikle disarida birakilir.
- Panel shell sadece gorsel/navigasyon katmanidir; sayfalarin server-side guard ve query/action akislari degistirilmedi.

Dashboard:

- Dosya: `src/app/(teacher)/teacher/dashboard/page.tsx`
- Yeni panel shell ile uyumlu gradient ozet hero'su kullanir.
- Canli backend verisinden stat kartlari, hizli aksiyon kartlari ve son 5 test sonucu tablosu bulunur.
- Stat kartlari ikonlu ve route linkli calisir.
- Son sonuc tablosunda yatay overflow davranisi vardir.

Soru havuzu:

- Dosya: `src/app/(teacher)/teacher/questions/page.tsx`
- Gradient ozet hero'su, aktif soru/ders/filtre kartlari ve panel diliyle uyumlu filtre karti kullanir.
- Yeni soru formu client componenttir.
- Filtre formu query string ile calisir.
- Soru listesi etiketli kartlar halinde render edilir; ders, zorluk ve konu badge olarak gosterilir.
- Soru duzenleme `details/summary` icinde inline form olarak render edilir.
- Pasife alma direkt server action formudur.

Test yonetimi:

- Dosya: `src/app/(teacher)/teacher/tests/page.tsx`
- Gradient ozet hero'su, test/aktif soru/ders kartlari ve durum badge'leri kullanir.
- Yeni test formu client componenttir.
- Ders secimine gore soru listesi client state ile filtrelenir.
- Test status hizli guncellenebilir.
- Test metadata `details/summary` icinden duzenlenir.

Sonuclar:

- Dosya: `src/app/(teacher)/teacher/results/page.tsx`
- Gradient hero, toplam sonuc, ortalama puan ve son kayit ozet kartlari bulunur.
- Tamamlanan denemeler yatay overflow destekli tablo olarak listelenir.
- Satir hover durumu ve guclu puan vurgusu ile panel dili korunur.
- Detay linki `/teacher/results/[attemptId]` route'una gider.

Sonuc detayi:

- Dosya: `src/app/(teacher)/teacher/results/[attemptId]/page.tsx`
- Gradient hero icinde geri don aksiyonu, buyuk puan gostergesi ve course/ogrenci/sure etiketleri bulunur.
- Ozet kartlari toplam soru, dogru, yanlis ve bos dagilimini gosterir.
- Ogrenci ve test bilgileri ayri panel kartlarinda listelenir.
- Cevap detaylari soru bazli kartlarda, snapshot fallback mantigi korunarak dogru cevap ve ogrenci secimi vurgulariyla gosterilir.

Ogrenci takip:

- Dosya: `src/app/(teacher)/teacher/students/page.tsx`
- Gradient hero, ogrenci sayisi, tamamlanan deneme sayisi ve son atama ozet kartlari bulunur.
- Hoca ile eslesen ogrenciler hover durumlu kartlar halinde gosterilir.
- Her kartta iletisim/altyapi bilgileri ve tamamlanan denemeye oncelik veren son test ozeti gosterilir.

## Admin UI

Ana dosya:

- `src/app/(admin)/admin/page.tsx`

Admin paneli tek sayfada MVP yonetim islemlerini toplar:

- Ust ozet stat kartlari.
- Yeni hoca formu.
- Yeni ders formu.
- Hoca listeleme ve inline duzenleme.
- Ders listeleme ve inline duzenleme.
- Hoca-ogrenci eslestirme formu.
- Eslestirme tablosu ve kaldirma aksiyonu.

Tum formlar direkt server action kullanir. Hata/uyari state'i su anda form icinde kullanici dostu olarak yakalanmaz; action throw ederse Next.js hata davranisi devreye girer.

## Yasal Sayfalar

Yasal sayfalar `LegalPage` ortak componenti ile render edilir.

Route'lar:

- `/kvkk`
- `/gizlilik-politikasi`
- `/kullanim-kosullari`

Bu sayfalar taslak metin icerir. Production oncesi kurum bilgileri, iletisim adresleri ve hukuki metinler final kontrol gerektirir.

## Data Fetching ve Cache

DB verisi kullanan sayfalarda genellikle su export kullanilir:

```ts
export const dynamic = "force-dynamic";
```

Bu tercih, ders/test/result/admin/hoca verilerinin runtime'da guncel okunmasini saglar. Mutation sonrasi server action'lar ilgili route'lar icin `revalidatePath` kullanir.

Public statik/yasal sayfalarda runtime DB okuma yoktur.

## Error ve Empty State Yaklasimi

Mevcut desenler:

- Bulunamayan public/test verileri icin `notFound()` kullanilir.
- Korunan hoca/admin sayfalarinda guard redirect yapar.
- Client form action state hatalari kirmizi kutu olarak gosterilir.
- Basari mesajlari yesil kutu olarak gosterilir.
- Bos listeler dashed border veya sade kart ile ifade edilir.

Eksik kalan nokta: Server action throw eden admin ve inline update formlarinda kullanici dostu inline error state'i henuz yok.

## Accessibility Notlari

Mevcut iyi noktalar:

- Form input'lari genelde label icinde veya `htmlFor` ile bagli.
- Button ve link metinleri acik.
- `fieldset` ve `legend` test soru gruplarinda kullaniliyor.
- Radio secenekleri label icinde oldugu icin tiklama alani genis.

Gelistirilecek noktalar:

- Panel tablolarinda mobil overflow davranisi eklendi; yine de dar ekran okunabilirligi manuel test edilmelidir.
- Basari/hata mesajlari icin `aria-live` eklenebilir.
- Form validation mesajlari alan bazli hale getirilebilir.
- `details/summary` icindeki duzenleme formlarinda focus davranisi manuel test edilmeli.

## Responsive Durum

Sayfalar genel olarak mobilde tek kolon, desktop'ta grid yapisina gecer. Ancak tablo kullanan sayfalarda mobil deneyim sinirli olabilir.

Mobilde dikkat edilmesi gereken sayfalar:

- `/teacher/results`
- `/teacher/dashboard`
- `/admin`
- Hoca-ogrenci eslestirme tablosu
- Test cozum ekraninda uzun soru/secenek metinleri

Production oncesi Playwright veya manuel cihaz testiyle 375px, 768px ve desktop genislikleri kontrol edilmelidir.

## Bilinen UI Borclari

- Ortak header/footer henuz tamamlanmadi.
- Hoca panelinde ortak sidebar/topbar shell eklendi; dashboard, soru havuzu, test yonetimi, sonuclar ve ogrenci takibi ekranlari yeni panel diliyle uyumlu hale getirildi.
- Ogrenci panelinde ortak sidebar/topbar shell eklendi; dashboard ve deneme gecmisi ekranlari gercek backend verisiyle baglandi.
- Test cozum, ogrenci sonuc ve hoca sonuc detay ekranlari modernlestirildi; admin paneli ve public ara akislar sonraki gorsel onceliklerdir.
- Admin paneli tek sayfada yogun; ileride sekmeli veya bolunmus layout gerekebilir.
- Form field componentleri tekrar ediyor; tasarim sistemi netlestiginde ortak input/select/textarea/button componentleri cikarilabilir.
- Tablo mobil deneyimi iyilestirilmeli.
- Loading state ve skeleton ekranlari yok.
- Error boundary/not-found tasarimlari custom degil.
- Reklam alani statik; dinamik reklam yonetimi henuz UI'a bagli degil.
- Yasal sayfa metinleri final degil.
- Ana sayfa portal tasarimi, hoca panel shell'i ve ana hoca ekranlari yeni urun diliyle guncellendi; siradaki gorsel odak admin ve public ara akislardir.

## Dogrulama Checklist

Frontend degisikligi sonrasi calistirilmesi onerilen komutlar:

```bash
npm run typecheck
npm run lint
npm run test
npm run build
```

Manuel kontrol:

1. `/` ana sayfa CTA'lari.
2. `/online-test` ders kartlari.
3. `/online-test/[courseId]` test kartlari.
4. `/student/login` kayit ve giris state'leri.
5. `/test/[id]/start` kayitli ogrenci ile baslatma.
6. `/test/[id]` soru cevaplama.
7. `/test/[id]/result` sonuc gorunurlugu.
8. `/teacher/login` hatali ve basarili giris.
9. `/teacher/dashboard`, `/teacher/questions`, `/teacher/tests`, `/teacher/results`, `/teacher/students`.
10. `/admin` hoca, ders ve eslestirme formlari.

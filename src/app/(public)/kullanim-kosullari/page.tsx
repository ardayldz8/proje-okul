import { LegalPage } from "@/components/legal-page";

export default function TermsPage() {
  return (
    <LegalPage
      description="Bu kosullar, online test platformunun ogrenci, hoca ve admin kullanimi icin temel kurallari ozetler. Metin MVP icin taslak niteligindedir."
      eyebrow="Kosullar"
      sections={[
        { title: "Platform Kullanimi", body: "Ogrenciler dogru bilgi vererek test akisini kullanir. Hocalar yalnizca kendi soru, test ve ogrenci verilerini yonetir." },
        { title: "Hesap Guvenligi", body: "Hoca ve admin hesaplarinin sifre guvenliginden ilgili kullanici sorumludur. Supheli erisimlerde hesap pasife alinabilir." },
        { title: "Test Kurallari", body: "Ayni testin ayni ogrenci tarafindan tekrar cozulmesi MVP'de engellenir. Sureli testlerde sure dolduktan sonra cevap kabul edilmez." },
        { title: "Degisiklikler", body: "Platform kapsaminda yapilacak onemli degisiklikler PRD ve roadmap dokumanlarina islenerek takip edilir." },
      ]}
      title="Kullanim Kosullari"
    />
  );
}

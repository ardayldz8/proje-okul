import { LegalPage } from "@/components/legal-page";

export default function PrivacyPage() {
  return (
    <LegalPage
      description="Bu politika, online test platformunda toplanan verilerin hangi amaclarla islendigini ve nasil korundugunu ozetler. Metin MVP icin taslak niteligindedir."
      eyebrow="Gizlilik"
      sections={[
        { title: "Toplanan Veriler", body: "Ogrenci ad-soyad, e-posta, telefon, sinif/okul bilgisi, test cevaplari ve sonuc verileri islenir. Hoca ve admin tarafinda ad-soyad, e-posta ve hesap bilgileri tutulur." },
        { title: "Kullanim Amaci", body: "Veriler test baslatma, sonuc hesaplama, hoca takibi, tekrar deneme kontrolu ve platform guvenligini saglamak icin kullanilir." },
        { title: "Saklama", body: "Sonuc verileri MVP'de PRD kararina uygun olarak 2 yil saklanacak sekilde planlanmistir. Silme talepleri iletisim sayfasindaki kanal uzerinden alinacaktir." },
        { title: "Ucuncu Taraf Servisler", body: "Rate limiting icin Upstash ve hosting/deployment icin Vercel kullanilabilir." },
      ]}
      title="Gizlilik Politikasi"
    />
  );
}

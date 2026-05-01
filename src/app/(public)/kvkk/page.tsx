import { LegalPage } from "@/components/legal-page";

export default function KvkkPage() {
  return (
    <LegalPage
      description="Bu metin, online test platformunda kisisel verilerin islenmesine iliskin temel bilgilendirmeyi sunar. Yayina alinmadan once hukuki kontrol gerektirir."
      eyebrow="KVKK"
      sections={[
        { title: "Veri Sorumlusu", body: "Yayin oncesinde gercek kurum veya kisi bilgileri bu alana eklenecektir." },
        { title: "Islenen Veriler", body: "Kimlik ve iletisim bilgileri, ogrenci egitim bilgileri, test cevaplari, sonuc kayitlari, IP adresi ve user-agent bilgileri islenebilir." },
        { title: "Isleme Amaci", body: "Test cozme akisini calistirmak, sonuc hesaplamak, hocalarin ogrenci takibini saglamak, guvenlik ve tekrar deneme kontrolu yapmak." },
        { title: "Haklar", body: "Kullanicilar verilerine erisim, duzeltme, silme ve itiraz haklarini iletisim sayfasindaki kanal uzerinden iletebilir." },
      ]}
      title="KVKK Aydinlatma Metni"
    />
  );
}

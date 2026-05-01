import { LegalPage } from "@/components/legal-page";

export default function ContactPage() {
  return (
    <LegalPage
      description="Platformla ilgili destek, veri talepleri ve is birlikleri icin asagidaki iletisim kanallari kullanilir. Bu sayfadaki bilgiler yayina cikmadan once kurum bilgileriyle guncellenmelidir."
      eyebrow="Iletisim"
      sections={[
        { title: "E-posta", body: "Destek ve veri talepleri icin iletisim adresi: destek@example.com" },
        { title: "Veri Talepleri", body: "KVKK kapsamindaki silme, duzeltme ve bilgi talepleri bu iletisim adresi uzerinden alinip kayit altina alinir." },
        { title: "Yayin Oncesi Not", body: "MVP yayina alinmadan once bu sayfadaki placeholder e-posta ve kurum bilgileri gercek bilgilerle degistirilmelidir." },
      ]}
      title="Iletisim"
    />
  );
}

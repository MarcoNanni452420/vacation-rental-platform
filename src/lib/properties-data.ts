export interface Property {
  id: string
  slug: string
  name: string
  location: string
  shortDesc: string
  description: string
  longDescription: string
  features: string[]
  price: number
  theme: string
  maxGuests: number
  bedrooms: number
  bathrooms: number
  amenities: string[]
  rating: number
  reviews: number
  images: string[]
}

export const properties: Record<string, Property> = {
  fienaroli: {
    id: "casa-fienaroli",
    slug: "fienaroli",
    name: "Casa Fienaroli",
    location: "Via dei Fienaroli, Trastevere",
    shortDesc: "Design contemporaneo e travi a vista nel cuore di Roma",
    description: "Vivi l'atmosfera di Trastevere, cuore di Roma, e gli spazi comodi di questa bellissima proprietà! Dettagli di design e pareti di vetro che si sposano con travi a vista e porte antiche dal fascino impagabile.",
    longDescription: `Vivi l'atmosfera di Trastevere, cuore di Roma, e gli spazi comodi di questa bellissima proprietà! Dettagli di design e pareti di vetro che si sposano con travi a vista e porte antiche dal fascino impagabile...ristrutturato ed arredato con un lusso discreto integrato nell'ambiente! L'appartamento è in un'ottima posizione, a pochi metri dalla movida ma in un angolo tranquillo, a 50mt negozi, market e ristorantini. Con una passeggiata potrete raggiungere tutte le attrazioni turistiche!

**Lo spazio**

Ampio appartamento in Via dei Fienaroli, nel centro di Trastevere!
Una società di design ha ristrutturato ed arredato questo ampio appartamento di 80 metri quadri, riuscendo a creare un ambiente caldo e confortevole con arredi e materiali particolari, in grado di catturare l'attenzione!

L'intero appartamento è a vostro esclusivo utilizzo ed è così composto:
- ampio salone con divano letto matrimoniale, tavolo da pranzo, tv ed aria condizionata
- Grande piano cucina completamente accessoriato per preparare i pasti, dotato di piastre ad induzione, macchina per il caffè Nespresso, forno e lavastoviglie
- ampia camera con parete a vetri con letto matrimoniale, aria condizionata e tv
- bagno con ampia cabina doccia, wc, bidet e lavandino con base in legno
- camera da letto con letto matrimoniale (da notare la testiera del letto) con aria condizionata, tv e bagno in camera. Il bagno privato è dotato di cabina doccia, wc, bidet e lavandino ed ha 2 pareti in vetro, una vera particolarità!

L'appartamento è dotato di lavatrice/asciugatrice, lavastoviglie, wi-fi, tv in tutti gli ambienti ed una cucina equipaggiata per preparare i pasti.
Nel servizio sono incluse le utenze, la biancheria da letto e le stoviglie.

L'appartamento è in una posizione fantastica, a pochi metri dalla movida ma in un angolo tranquillo dai rumori, a 50 mt dalla casa ci sono negozi, market, bar e e deliziosi ristorantini. La macchina non è necessaria e con una breve passeggiata potrete raggiungere Piazza Navona, Piazza Venezia ecc. ecc.!

**Struttura ad uso turistico autorizzata - ID 708**

**Accesso per gli ospiti**

Gli ospiti hanno accesso all'intero appartamento!
Chiediamo ai nostri ospiti di lasciare la casa come l'hanno trovata e di trattarla con la stessa cura con cui la trattiamo noi!

**Altre cose da tenere a mente**

La posizione è strategica e l'appartamento nuovo, è un'occasione da non perdere!

Se volete possiamo organizzare:
- pick-up da/per l'aeroporto
- corsi di cucina italiana/romana singoli o di gruppo
- Tour di Roma ed altre città`,
    features: ["80 mq", "2 camere", "2 bagni", "Aria condizionata", "WiFi veloce", "Cucina attrezzata"],
    price: 250,
    theme: "fienaroli",
    maxGuests: 6,
    bedrooms: 2,
    bathrooms: 2,
    amenities: [
      "WiFi",
      "Aria Condizionata",
      "Cucina Attrezzata",
      "Lavastoviglie",
      "Lavatrice/Asciugatrice",
      "TV in ogni stanza",
      "Macchina caffè Nespresso",
      "Forno",
      "Design esclusivo",
      "Travi a vista",
      "Pareti in vetro"
    ],
    rating: 4.9,
    reviews: 127,
    images: [
      "/images/fienaroli/6ab35909-71bd-4cc5-8196-957ec9e2eedc.jpg",
      "/images/fienaroli/6ab35909-71bd-4cc5-8196-957ec9e2eedc.avif",
      "/images/fienaroli/6890a37b-a615-4d37-a098-1583e0c728de.jpg",
      "/images/fienaroli/9b8ee5c6-6912-4fb5-8e32-faf4e799be28.jpg",
      "/images/fienaroli/b1bba460-60ef-44ff-ac13-c79dd8c202f9.jpg",
      "/images/fienaroli/883f54ff-5438-4d55-a581-dc2f8c7f3aaa.avif",
      "/images/fienaroli/74a8962e-8771-4b87-b780-cf032b481d6a.jpg",
      "/images/fienaroli/953135cd-6c8b-4d36-82c2-9f80d9848ef7.jpg",
      "/images/fienaroli/94b4fe5b-461a-42ca-bec4-6f025b89b699.avif",
      "/images/fienaroli/d036b429-deb0-4d4f-ac72-4a1aeda2c0a4.avif",
      "/images/fienaroli/99ce957b-7b93-46ff-b8aa-0502920974fe.jpg",
      "/images/fienaroli/ed99743a-664e-4dbd-a816-7db070a61ccd.jpg",
      "/images/fienaroli/1281715d-f425-4b56-9e5e-ca7af7cc30c5.jpg",
      "/images/fienaroli/2fdb2dee-220b-4725-9fc2-47819e0d2528.jpg",
      "/images/fienaroli/6cd5dca7-32a6-4941-851f-0844dea4abfb.jpg",
      "/images/fienaroli/c7cd34c2-9908-4fc2-8638-eebf38181bce.jpg",
      "/images/fienaroli/de6e1137-f596-4dfe-8c55-7441d356268a.avif",
      "/images/fienaroli/cbe8cfd0-ee01-475d-ab34-ac52794e470c.jpg",
      "/images/fienaroli/7592c6f6-628b-4b54-b952-1f910951bf5b.jpg",
      "/images/fienaroli/c9a528f2-1217-42fb-8ef0-2b4459b30cf8.jpg",
      "/images/fienaroli/b073105f-f21d-4f3b-b993-2cf1bb985aaa.jpg",
      "/images/fienaroli/7c6a2eeb-6a2c-4b6f-8d0a-a905b8c83342.jpg",
      "/images/fienaroli/670956d6-64a1-4d9f-b0cb-7a0b5c7e72db.jpg",
      "/images/fienaroli/dfc2c170-c356-4559-bd3b-5bf3a1c62326.jpg",
      "/images/fienaroli/8f2a3c1f-9462-46fd-9526-ddcefdd23aef.jpg",
      "/images/fienaroli/b3f49638-4d67-458a-a8e3-097f91bcee12.avif",
      "/images/fienaroli/bad9ac5b-f208-4b8e-9b74-b8b0683cba20.avif",
      "/images/fienaroli/dd90392b-db51-422e-8231-3c8b47f5a2ea.avif",
      "/images/fienaroli/79cc1bdc-16ca-4a2d-9c01-f1487967e56f.avif"
    ]
  },
  moro: {
    id: "casa-moro",
    slug: "moro",
    name: "Casa Moro",
    location: "Cuore di Trastevere",
    shortDesc: "Soffitti del 1400 e lusso moderno nel cuore di Trastevere",
    description: "Nel cuore di Trastevere abbiamo ristrutturato questo appartamento con materiali pregiati, abbinando soluzioni moderne e lussuose, mantenendo i soffitti in legno del 1400.",
    longDescription: `Nel cuore di Trastevere tra Santa Maria e fontana Trilussa abbiamo ristrutturato questo appartamento con materiali pregiati, abbinando soluzioni moderne e lussuose, mantenendo i soffitti in legno del 1400 ed una parte dei pavimenti originali, dove respirare un atmosfera particolare della Roma papale.

L'appartamento presenta:
- Soffitti in legno originali del 1400 restaurati
- Pavimenti antichi parzialmente conservati
- Bagno di lusso con marmi pregiati e doccia walk-in in vetro
- Cucina moderna con piano in terracotta e elettrodomestici di ultima generazione
- Camera padronale con vista caratteristica
- Seconda camera elegante
- Finiture di pregio e opere d'arte originali

Passeggiare per i vicoli e gustare la vera cucina romana nelle tante trattorie tradizionali. Traversare il Tevere e raggiungere rapidamente Piazza Navona, il Pantheon e le meraviglie Romane.

La posizione strategica permette di vivere l'autentica atmosfera trasteverina rimanendo a pochi passi dalle principali attrazioni turistiche.`,
    features: ["90 mq", "Soffitti del 1400", "Materiali pregiati", "Vista caratteristica", "Posizione centrale"],
    price: 300,
    theme: "moro",
    maxGuests: 4,
    bedrooms: 1,
    bathrooms: 2,
    amenities: [
      "WiFi",
      "Aria Condizionata",
      "Cucina di design",
      "Lavastoviglie",
      "Lavatrice",
      "TV",
      "Macchina caffè",
      "Forno moderno",
      "Soffitti storici",
      "Marmi pregiati",
      "Opere d'arte",
      "Doccia walk-in"
    ],
    rating: 5.0,
    reviews: 89,
    images: [
      "/images/moro/146e1219-b055-4ab1-8ae0-b3fe2355d137.avif",
      "/images/moro/b1a91212-cfe1-4810-bfca-a7fd3e32e929.avif",
      "/images/moro/f6d381a4-b0a9-4598-a3cd-87fcf7912ffb.avif",
      "/images/moro/6e8e01ce-00da-47af-abd9-d77ca19b5ba6.avif",
      "/images/moro/72d4468e-8842-4583-abfe-dfee7f3d3bf6.avif",
      "/images/moro/70e4caa8-ce41-4336-823c-498d3fe6e2e2.avif",
      "/images/moro/518e0d73-5157-4842-9875-35d56dac8356.jpeg",
      "/images/moro/b31b2a94-4b3e-48ea-a149-2521085e1b14.avif",
      "/images/moro/38b00fab-0a22-406b-a8e8-cce80575d0e9.avif",
      "/images/moro/e136f86d-c1fd-4cca-a0e8-942dc53413d6.avif",
      "/images/moro/1f84d0f8-198e-4d98-8460-962d9a36ed77.avif",
      "/images/moro/419f2013-7bbe-4d7d-a4a7-48647e9966e4.avif",
      "/images/moro/7b968ad2-8cd1-490d-aa92-5f96402c2f6e.avif",
      "/images/moro/fac75807-e40e-4655-9b33-969f9c4cef49.avif",
      "/images/moro/11f08c0c-3f15-45f8-b235-ef52894de01b.avif",
      "/images/moro/060089de-42dd-420e-aa12-020883b9934d.avif",
      "/images/moro/538d03d5-08c7-43b2-adda-286074b03258.avif",
      "/images/moro/29f33f86-0414-48d2-b6cf-ca1dd5b88196.webp",
      "/images/moro/6651634b-6cb5-46f3-be15-a0840f9dc102.avif",
      "/images/moro/ee2f2734-6c28-4216-86dc-866f80467563.avif",
      "/images/moro/2e03aa0c-f0dc-45d2-ab4b-5ee2f9538293.avif",
      "/images/moro/f360d731-9468-458e-ba5b-3d6ea5c69e06.avif",
      "/images/moro/746bd027-1a8e-4984-b441-5edba1ff35d0.avif",
      "/images/moro/bb95538d-fd9c-400d-aa47-b104d07bd518.avif",
      "/images/moro/f85b342f-f395-4d21-949a-c1dbc844256f.avif",
      "/images/moro/ee4dceec-7ba6-46a9-afe8-0dfd595ab71d.avif",
      "/images/moro/5d1f905c-028d-442c-be50-b837820c7805.jpeg",
      "/images/moro/512d2d26-6df7-4ef4-8929-7a056020188a.avif",
      "/images/moro/64c1717b-186a-4ea3-b71e-995c5893ee28.jpeg",
      "/images/moro/08580fe3-f3d4-40df-b10b-80adc2326d7d.avif",
      "/images/moro/4fff47aa-4271-44f7-b9f5-59312abb16f7.avif",
      "/images/moro/bd6b1031-7bfd-4ab1-81cb-344cb93bd335.avif",
      "/images/moro/f100c53e-cb51-47bb-acd2-b36a48c22562.avif"
    ]
  }
}

export function getPropertyBySlug(slug: string): Property | undefined {
  return properties[slug]
}

export function getAllProperties(): Property[] {
  return Object.values(properties)
}
const synonyms: Record<string, string[]> = {
  wifi: ["wireless", "wi fi", "wi-fi"],

  camera: [
    "cameras",
    "camera ip",
    "camera seguranca",
    "camera de seguranca",
  ],

  cabo: [
    "cabos",
    "fio",
    "cabo rede",
    "cabo ethernet",
  ],

  cartao: [
    "cartao",
    "cartão",
    "rfid",
    "card",
  ],

  controle: [
    "controlador",
  ],

  hd: [
    "hard drive",
    "harddisk",
  ],

  tv: [
    "televisao",
    "televisão",
  ],

  roteador: [
    "router",
  ],
};

const stopWords = [
  "de",
  "da",
  "do",
  "para",
  "com",
  "e",
  "a",
  "o",
];

export function normalize(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[-_/]/g, " ")
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function singularize(word: string) {
  if (word.endsWith("es")) {
    return word.slice(0, -2);
  }

  if (word.endsWith("s") && word.length > 3) {
    return word.slice(0, -1);
  }

  return word;
}

export function tokenize(text: string) {
  return normalize(text)
    .split(" ")
    .map(singularize)
    .filter(
      (word) =>
        word.length > 1 &&
        !stopWords.includes(word)
    );
}

export function expandTerms(query: string) {
  const tokens = tokenize(query);

  const expanded = new Set<string>();

  for (const token of tokens) {
    expanded.add(token);

    if (synonyms[token]) {
      for (const synonym of synonyms[token]) {
        expanded.add(normalize(synonym));
      }
    }
  }

  return [...expanded];
}
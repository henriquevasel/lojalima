const synonyms: Record<string, string[]> = {
  wifi: ["wi-fi", "wi fi", "wireless"],

  camera: [
    "cam",
    "cameras",
    "camêra",
    "camera ip",
  ],

  cabo: [
    "cabos",
    "fio",
    "cabo rede",
  ],

  seguranca: [
    "segurança",
    "security",
  ],

  controle: [
    "controlador",
  ],

  cartao: [
    "cartão",
    "rfid",
    "card",
  ],

  internet: [
    "rede",
    "network",
  ],

  cat5: [
    "cat5e",
  ],

  cat6: [
    "cat6e",
  ],
};

export function normalize(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/-/g, " ")
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function singularize(word: string) {
  if (word.endsWith("s") && word.length > 3) {
    return word.slice(0, -1);
  }

  return word;
}

export function expandTerms(query: string) {
  const normalized = normalize(query);

  const baseTerms = normalized
    .split(" ")
    .filter(Boolean)
    .map(singularize);

  const expanded = new Set<string>();

  for (const term of baseTerms) {
    expanded.add(term);

    // compactado
    expanded.add(term.replace(/\s|-/g, ""));

    // wifi inteligente
    if (term === "wifi") {
      expanded.add("wi-fi");
      expanded.add("wi fi");
      expanded.add("wireless");
    }

    // camera inteligente
    if (term === "camera") {
      expanded.add("cam");
      expanded.add("cameras");
      expanded.add("camera ip");
    }

    // aliases
    if (synonyms[term]) {
      synonyms[term].forEach((s) => {
        expanded.add(normalize(s));
      });
    }
  }

  return [...expanded];
}
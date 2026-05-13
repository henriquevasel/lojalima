const synonyms: Record<string, string[]> = {
  wifi: ["wi-fi", "wi fi", "wireless"],
  camera: ["cameras", "cam", "cameras", "camêra"],
  cabo: ["cabos", "fio"],
  cartao: ["cartão", "card"],
  controle: ["controlador"],
  hd: ["harddisk", "hard drive"],
  tv: ["televisao", "televisão"],
  roteador: ["router"],
  internet: ["rede", "network"],
  seguranca: ["segurança", "security"],
  acesso: ["entrada"],
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

    if (synonyms[term]) {
      synonyms[term].forEach((s) => {
        expanded.add(normalize(s));
      });
    }
  }

  return [...expanded];
}
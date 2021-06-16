export function ensurePrefix(text: string, prefix: string): string {
  if (text.startsWith(prefix)) {
    return text;
  } else {
    return `${prefix}${text}`;
  }
}

export const addCommasToString = (n: string) => {
  const parts = n.split('.');
  return parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',') + (parts[1] ? '.' + parts[1] : '');
};

export const checkIfCharactersIncludes = (characters: string, fullString: string): boolean => {
  return fullString.indexOf(characters) > -1;
};

export default function toTitleCase(str: string) {
  return str
    .split(' ')
    .map(function (word: string) {
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
}

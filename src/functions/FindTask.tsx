
export function levenshtein(a: string, b: string) {
  const matrix = Array(b.length + 1)
    .fill(null)
    .map(() => Array(a.length + 1).fill(null));

  for (let i = 0; i <= a.length; i += 1) {
    matrix[0][i] = i;
  }

  for (let j = 0; j <= b.length; j += 1) {
    matrix[j][0] = j;
  }

  for (let j = 1; j <= b.length; j += 1) {
    for (let i = 1; i <= a.length; i += 1) {
      const indicator = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1, // inserción
        matrix[j - 1][i] + 1, // eliminación
        matrix[j - 1][i - 1] + indicator // sustitución
      );
    }
  }

  return matrix[b.length][a.length];
}


export function findMostLikelyWord(list: string[], str: string) {
  let closerDistance = Infinity;
  let mostLikelyWord = null;

  for (const item of list) {

    if (str === item) {
      return item
    }

    const distancia = levenshtein(str, item);
    if (distancia < closerDistance) {
      closerDistance = distancia;
      mostLikelyWord = item;
    }
  }

  return mostLikelyWord;
}

export function getWordWithDistance(list: string[], str: string) {

  return list.map((item) => {
    return {
      word: str,
      keyword: item,
      distance: levenshtein(str, item)
    }
  })
  //.sort((a, b) => a.distance - b.distance)
}

// Función para calcular la distancia de Levenshtein
export const findTask = (list: string[], text: string) => {

  // Ejemplo de uso
  const listaCadenas = list;
  const cadenaComparar = text;  // Cadena con un error
  const resultado = findMostLikelyWord(listaCadenas, cadenaComparar);

  console.log(`La cadena más parecida es: ${resultado}`);
  return resultado

}
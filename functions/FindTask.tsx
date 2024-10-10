// Función para calcular la distancia de Levenshtein
export const FindTask= (list,text) =>{


function levenshtein(a:any, b:any) {
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
  

  function encontrarCadenaMasParecida(lista:any, cadena:any) {
    let menorDistancia = Infinity;
    let cadenaMasParecida = null;
  
    for (const item of lista) {
      const distancia = levenshtein(cadena, item);
      if (distancia < menorDistancia) {
        menorDistancia = distancia;
        cadenaMasParecida = item;
      }
    }
  
    return cadenaMasParecida;
  }
  
  // Ejemplo de uso
  const listaCadenas = list;
  const cadenaComparar = text;  // Cadena con un error
  const resultado = encontrarCadenaMasParecida(listaCadenas, cadenaComparar);
  
  console.log(`La cadena más parecida es: ${resultado}`);
  return resultado

}
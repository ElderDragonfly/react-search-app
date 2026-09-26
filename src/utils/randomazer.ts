export function randomInt(min: number, max: number, excludeNumber?: number) {
  min = Math.ceil(min); // округляем min вверх до целого
  max = Math.floor(max); // округляем max вниз до целого
  // Исключаем число
  const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
  if(excludeNumber && randomNumber === excludeNumber) {
    return randomInt(min, max, excludeNumber)
  }
  return randomNumber;
}

export default randomInt;
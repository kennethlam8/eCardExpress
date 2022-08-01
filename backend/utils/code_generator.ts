const { floor, random } = Math;

function generateUpperCaseLetter() {
  return randomCharacterFromArray('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
}

export function generateNumber() {
  return randomCharacterFromArray('1234567890');
}

function randomCharacterFromArray(array: string) {
  return array[floor(random() * array.length)];
}

//const identifiers = [];

export function generateIdentifier() {
  const identifier = [
    ...Array.from({ length: 2 }, generateUpperCaseLetter),
    ...Array.from({ length: 4 }, generateNumber)
  ].join('');

  console.log("Random card code generated: ", identifier);
  return identifier;
}

//const identifier = generateIdentifier();
//console.log(identifier);


/* const existingIDs = ['AA1111','XY1234']; 
const getRandomLetters = (length = 1) => Array(length).fill().map(e => String.fromCharCode(Math.floor(Math.random() * 26) + 65)).join('');
const getRandomDigits = (length = 1) => Array(length).fill().map(e => Math.floor(Math.random() * 10)).join('');
const generateUniqueID = () => {
  let id = getRandomLetters(2) + getRandomDigits(4);
  while (existingIDs.includes(id)) id = getRandomLetters(2) + getRandomDigits(4);
  return id;
};
const newID = generateUniqueID();

console.log(newID); */
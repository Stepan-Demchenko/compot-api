// Convert array of numbers to array of objects. Use to save relations in the DB
export default function (arrayOfNumbers: number[]): { id: number }[] {
  return arrayOfNumbers.map((id: number) => {
    return { id: id };
  });
}

export function includes(array, detectValue) {
  for (let i=0;i < array.length;i++) {
    let value = array[i];
    if (value === detectValue) {
      return true;
    }
  }
  return false;
}

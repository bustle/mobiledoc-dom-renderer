/**
 * Reduces an array into an object of k/v pairs.
 *
 * @example
 * ['#href', '#foo', 'rel', 'nofollow'].reduce(kvReduce, {});
 * // returns { href: "#foo", rel: "nofollow" };
 */
export default function kvReduce(obj, key, i, arr) {
  if (i % 2 === 0) {
    obj[key] = arr[i+1];
  }
  return obj;
}

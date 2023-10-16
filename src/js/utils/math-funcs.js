/* -------------------------------------------------------------------------- */
/*                           Mathematical Functions                           */
/* -------------------------------------------------------------------------- */

export const math = {
  map: (x, a, b, c, d) => ((x - a) * (d - c)) / (b - a) + c,
  // linear interpolation ΔE • линейная интерполяция
  lerp: (min, max, val) => min * (1 - val) + max * val,
  // distance between two points • расстояние между двумя точками
  distance: (x1, y1, x2, y2) => Math.hypot(x2 - x1, y2 - y1),
  // random number • случайное число
  getRandomNum: (min, max) => Math.floor(Math.random() * (max - min + 1) + min),
  // number sequence • последовательность чисел
  getNumSeq: (num) => Array.from({ length: num }, (v, i) => i),
  // convert radian to angle and vise versa
  toDegree: (radian) => (radian * 180) / Math.PI,
  toRadian: (degree) => (degree * Math.PI) / 180,
  // loop
  range: (start = 0, end = 0, step = 1) => {
    let output = [];
    for (let i = start; i < end; i += step) { output.push(i); }
    return output;
  }
};

/**
 * Convert to degree.
 *
 * @param {number} radian
 * @return {number}
 */
// const degree = (radian) => (radian * 180) / Math.PI;

/**
 * Convert to radian.
 *
 * @param {number} degree
 * @return {number}
 */
// const radian = (degree) => (degree * Math.PI) / 180;

/**
 * Generate a random value from the array.
 *
 * @param {[]} arr Array to get a random value from.
 * @return {(number | string)} Random value.
 */
export const randomValue = (arr) => arr[Math.floor(Math.random() * arr.length)];

export const valueRange = (start = 0, end, step = 1) => {
  let output = [];
  if (typeof end === 'undefined') {
    end = start;
    start = 0;
  }
  for (let i = start; i <= end; i += step) {
    output.push(i);
  }
  return output;
}

export const ValidationConstants = {
  minLengthName: 2,
  maxLengthName: 30,
  minLengthPassword: 8,
  maxLengthPassword: 255,
  minLengthEmail: 8,
  emailRegex: '^^((?![_.+%-])(?:(?<=[_.+%-])\\w|(?<![_.+%-])[\\w.+%-]){1,64}(?<![_.+%-]))@((?:(?![_.+%-])(?:(?<=[_.-])[a-z0-9]|(?<![_.-])[a-z0-9._-]){1,63}(?<![_.+%-]))\\.[a-z]{2,4})$',
};

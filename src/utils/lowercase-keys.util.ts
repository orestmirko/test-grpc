export const lowercaseKeys = (object: Record<string, any>): Record<string, any> => {
  const keys = Object.keys(object);
  let n = keys.length;
  const lowercaseObj: { [key: string]: any } = {};
  while (n--) {
    const key = keys[n];
    lowercaseObj[key.toLowerCase()] = object[key];
  }
  return lowercaseObj;
};

export const getOrEmptyString = (value: any): any | string => {
  return value ?? '';
};

global.getOrEmptyString = getOrEmptyString
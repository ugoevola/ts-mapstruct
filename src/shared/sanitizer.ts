
import sanitizer  from 'sanitizer';
import _ from "lodash";

export const sanitize = (target: unknown) => (isObject(target)) ? sanitizeObject(target) : sanitizeValue(target);

const sanitizeValue = (target: any): string => {
  if (_.isNil(target))
    return target
  if (isNativeIterable(target))
    return target.map((value: any) => sanitizeValue(value))
  return encodeURIComponent(sanitizer.sanitize(target.toString()));
}

const sanitizeObject = (target: any): any => {
  Object.keys(target).forEach(key => {
    if (target[key] && isObject(target))
      target[key] = sanitizeObject(target[key])
    else
      target[key] = sanitizeValue(target[key]);
  })
  return target;
}

export const getType = (obj: unknown) => Object.prototype.toString.call(obj).slice(8, -1);

const isArray = (obj: unknown) => getType(obj) === 'Array';

const isMap = (obj: unknown) => getType(obj) === 'Map';

const isSet = (obj: unknown) => getType(obj) === 'Set';

const isTypedArray = (obj: unknown) => getType(obj) !== 'Array' && getType(obj).includes('Array');

const isObject = (obj: unknown) => getType(obj) === 'Object';

const isNativeIterable = (obj: unknown) =>  isArray(obj) || isSet(obj) || isMap(obj) || isTypedArray(obj)

// @ts-ignore
Map.prototype.map = function(callback: Function) {
  const copy = new Map(this);
  this.forEach((value: any, index: string) => copy.set(index, callback(value, index)))
  return copy;
}
// @ts-ignore
Set.prototype.map = function(callback: Function) {
  const copy = new Set();
  this.forEach((value: any) => copy.add(callback(value)))
  return new Set(copy)
}
import { IllegalPropertyKeyExceptionMapper } from "../exceptions/illegal-property-key.exception";
import { IllegalObjectAccessExceptionMapper } from "../exceptions/illegal-object-access.exception";
import _ from "lodash";
import { MappingOptions } from "../models/mapping-options";
import { validate } from "class-validator";
import { IllegalMappingOptionsExceptionMapper } from "../exceptions/illegal-mapping-options.exception";

export const getSetter = (targetProperty: string): string => {
  return 'set' + targetProperty.charAt(0).toUpperCase() + targetProperty.slice(1);
}

export const getGetter = (targetProperty: string): string => {
  return 'get' + targetProperty.charAt(0).toUpperCase() + targetProperty.slice(1);
}

export const set = (object: object, key: string, value: any): any => {
  const setter = getSetter(key);
  if (setter in object)
    object[setter](value)
  else
    throw new IllegalObjectAccessExceptionMapper(object, key)
}

export const get = (object: object, key: string): any => {
  const getter = getGetter(key);
  if (getter in object)
    return object[getter]()
  else
    throw new IllegalObjectAccessExceptionMapper(object, key)
}

export const getArgumentsNames = (fn: string): string[] => {
  const STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
  const ARGUMENT_NAMES = /([^\s,]+)/g;
  const fnStr = fn.replace(STRIP_COMMENTS, '');
  let result = fnStr.slice(fnStr.indexOf('(')+1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
  if(result === null)
     result = [];
  return result;
}

export const getAllFunctionNames = (expression: string): string[] => {
  const regex = /([^\.\w])(?!if|for|while|switch|constructor|with)([\wa]+) *\(([ a\w\"'\.]+,?)*\)/g
  return [...expression.matchAll(regex)].map(matches => matches[2])
}

export const bindSourceNames = (sources: any[], sourcesNames: string[]): Map<string, any>  => {
  // TODO: verify that the sources isn't null or empty
  return sources.reduce((pre, cur, index) => { pre.set(sourcesNames[index], cur); return pre;}, new Map())
}

export const setGlobalVariable = (key: string, value: any): void => {
  if (global.suppliedMappingFunctions.indexOf(key) > -1)
    throw new IllegalPropertyKeyExceptionMapper(key)
  global[key] = value;
}

export const checkMappingOptions = async (options: MappingOptions) => {
  const errors = await validate(options)
  if (errors.length > 0) throw new IllegalMappingOptionsExceptionMapper()
}
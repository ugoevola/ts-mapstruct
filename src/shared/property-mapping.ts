import { EmptySourceNameExceptionMapper } from "../exceptions/empty-source-name.exception";
import { InvalidSourceNameExceptionMapper } from "../exceptions/invalide-source-name.exception";
import { BadExpressionExceptionMapper } from "../exceptions/bad-expression.exception";
import { MappingOptions } from "../models/mapping-options";
import { getSetter, getAllFunctionNames, set, get, setGlobalVariable, checkMappingOptions } from "./utils";
import { isNil } from 'lodash';

export const mapProperty = (
  mapperClass: any,
  targetedObject: any,
  sources: Map<string, any>,
  options: MappingOptions
) => {
  checkMappingOptions(options)
  let value = null;
  if (options.value)
    value = valueFromValue(options)
  if (options.source)
    value = valueFromSource(sources, options)
  if (options.expression)
    value = valueFromExpression(mapperClass, sources, options)
  set(targetedObject, options.target, value);
};

const valueFromValue = (
  options: MappingOptions
) => {
  return options.value;
}

const valueFromSource = (
  sources: Map<string, any>,
  options: MappingOptions
) => {
  const [sourceName, sourceProperties, _rest] = options.source.split(/\.(.*)/s);
  let source: any;
  // s'il n'y en a qu'un
  if (sources.size === 1) {
    [source] = sources.values()
    return get(source, sourceName)
  }
  // sinon
  if (isNil(sourceProperties))
    throw new EmptySourceNameExceptionMapper();
  source = sources.get(sourceName);
  if (isNil(source))
    throw new InvalidSourceNameExceptionMapper(sourceName);
  return sourceProperties.split('.').reduce((pre, value) => get(pre, value), source);
}

const valueFromExpression = (
  mapperClass: any,
  sources: Map<string, any>,
  options: MappingOptions
) => {
  const functionNames = getAllFunctionNames(options.expression)
  setGlobalsVariables(mapperClass, sources, functionNames);
  try {
    return eval(options.expression);
  } catch(exception) {
    console.error(exception);
    throw new BadExpressionExceptionMapper()
  } finally {
    cleanGlobalsVariables(sources, functionNames);
  }
}

const setGlobalsVariables = (
  mapperClass: any,
  sources: Map<string, any>,
  functionNames: string[],
) => {
  if (sources.size > 1) {
    for (const [key, value] of sources)
      setGlobalVariable(key, value)
  } else {
    const [firstValue] = sources.values();
    for (const [key, value] of Object.entries(firstValue))
      setGlobalVariable(key, value)
  }
  functionNames.forEach(key => global[key] = global[key] ?? mapperClass[key])
}

const cleanGlobalsVariables = (
  sources: Map<string, any>,
  functionNames: string[],
) => {
  if (sources.size > 1) {
    for (const [key, _value] of sources)
      global[key] = undefined;
  } else {
    const [firstValue] = sources.values();
    Object.keys(firstValue).forEach(key => global[key] = undefined);
  }
  functionNames.forEach(key => setGlobalVariable(key, undefined));
}

export const fillCommonProperties = (sourceObject: any, targetedObject: any) => {
  Object.entries(sourceObject).forEach(([key, value]) => {
    if (targetedObject[getSetter(key)] !== undefined) {
      targetedObject[getSetter(key)](value);
    }
  });
}

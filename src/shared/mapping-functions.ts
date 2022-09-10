import { EMPTY_STRING } from "./constants";
import { isNil } from 'lodash';

global['getConcatProperties'] = (...properties: [...any, string?]): string => {
  const props = properties.slice();
  const lastProperty = props[props.length - 1];
  const separator = isNil(global[lastProperty]) ? lastProperty : EMPTY_STRING;
  if (!isNil(global[lastProperty]))
    props.pop();
  return props.reduce((pre, cur, index) => pre + (index === 0 ? EMPTY_STRING : separator) + cur, EMPTY_STRING);
};

global.suppliedMappingFunctions = ['getConcatProperties']
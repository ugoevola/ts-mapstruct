import { EMPTY_STRING } from './constants'
import { isNil } from 'lodash'

global.getConcatProperties = (...properties: [...any, string?]): string => {
  const props = properties.slice()
  const lastProperty = props[props.length - 1]
  let separator: any;
  if (isNil(global[lastProperty])) {
    separator = lastProperty
    props.pop()
  } else {
    separator = EMPTY_STRING
  }
  return props.reduce((pre, cur, index) => pre + (index === 0 ? EMPTY_STRING : separator) + cur, EMPTY_STRING)
}

global.suppliedMappingFunctions = ['getConcatProperties']

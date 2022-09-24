import { EMPTY_STRING } from '../utils/constants'

export function getConcatProperties(...properties: [...any, string]): string {
  const propertiesCopy = properties.slice()
  const separator = propertiesCopy.pop()
  return propertiesCopy.reduce(
    (pre, cur, index) => pre + (index === 0 ? EMPTY_STRING : separator) + cur,
    EMPTY_STRING
  )
}

global.getConcatProperties = getConcatProperties

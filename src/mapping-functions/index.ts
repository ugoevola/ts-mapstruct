import { getConcatProperties } from "./get-concat-properties"
import { getOrEmptyString } from "./get-or-empty-string"

global.suppliedMappingFunctions = [
  getConcatProperties.name,
  getOrEmptyString.name
]
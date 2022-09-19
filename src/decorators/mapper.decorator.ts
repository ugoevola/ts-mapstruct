import { MAPPINGS_METHOD } from '../utils/constants'
import { MappingWrap } from '../models/mapping-wrap'
import { mapping } from '../core/mapping'
import '../provided-functions/index'

export const Mapper = () => (mapperClass: Function): void => {
  const mappingWraps: MappingWrap[] = Reflect.getOwnMetadata(MAPPINGS_METHOD, mapperClass) || []
  mappingWraps.forEach(wrap => {
    mapping(wrap.mapperClass, wrap.mappingMethodName, wrap.descriptor, wrap.mappingOptions)
  })
}

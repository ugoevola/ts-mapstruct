import { MAPPING_TARGET, MAPPING_TARGET_TYPE } from '../utils/constants'
import { isNil } from 'lodash'

export const MappingTarget =
  (type?: any) =>
  (mapperClass: Object, methodName: string | symbol, parameterIndex: number) => {
    Reflect.defineMetadata(MAPPING_TARGET, parameterIndex, mapperClass, methodName)
    if (!isNil(type))
      Reflect.defineMetadata(MAPPING_TARGET_TYPE, type, mapperClass, methodName)
  }

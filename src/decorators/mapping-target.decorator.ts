import { isNil } from 'lodash'
import { MAPPING_TARGET, MAPPING_TARGET_TYPE } from '../models/constants'

export const MappingTarget = (type?: any) => (
  target: Object,
  propertyKey: string | symbol,
  parameterIndex: number
) => {
  Reflect.defineMetadata(MAPPING_TARGET, parameterIndex, target, propertyKey)
  if (!isNil(type)) Reflect.defineMetadata(MAPPING_TARGET_TYPE, type, target, propertyKey)
}

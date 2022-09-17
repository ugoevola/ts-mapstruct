import { isNil } from 'lodash'
import { MAPPING_TARGET, MAPPING_TARGET_TYPE } from '../utils/constants'
import { getArgumentNames } from '../utils/utils'
import { ArgumentDescriptor } from './argument-descriptor'

export class FunctionDescriptor {
  name: string
  args: ArgumentDescriptor[]
  fn: Function

  constructor (name: string, fn: Function, mapperClass: any) {
    this.name = name
    this.fn = fn
    this.args = getArgumentNames(fn.toString()).map((argName, index) => {
      const mappingTargetIndex = Reflect.getOwnMetadata(MAPPING_TARGET, mapperClass, name)
      const isMappingTarget = !isNil(mappingTargetIndex) && index === mappingTargetIndex
      const type = isMappingTarget ? Reflect.getOwnMetadata(MAPPING_TARGET_TYPE, mapperClass, name) : undefined
      return new ArgumentDescriptor(argName, undefined, isMappingTarget, type)
    })
  }
}

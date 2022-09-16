import { isNil } from 'lodash'
import { MAPPING_TARGET } from '../utils/constants'
import { getArgumentNames } from '../utils/utils'
import { ArgumentDescriptor } from './argument-descriptor'

export class FunctionDescriptor {
  name: string
  args: ArgumentDescriptor[]
  fn: Function

  constructor (name: string, fn: Function, mapperClass: any) {
    this.name = name
    this.fn = fn
    this.args = getArgumentNames(fn.toString()).map(argName => {
      const isMappingTarget = !isNil(Reflect.getOwnMetadata(MAPPING_TARGET, mapperClass, name))
      return new ArgumentDescriptor(argName, undefined, isMappingTarget)
    })
  }
}

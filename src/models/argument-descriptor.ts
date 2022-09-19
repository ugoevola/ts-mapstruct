import { detachUnderscore } from '../utils/utils'
import { MAPPING_TARGET, MAPPING_TARGET_TYPE } from '../utils/constants'
import { isNil } from 'lodash'

export class ArgumentDescriptor {
  name: string
  value: any
  isMappingTarget: boolean
  type: any

  constructor (name: string, mapperClass: any, mappingFunctionName: string, index: number) {
    const mappingTargetIndex = Reflect.getOwnMetadata(MAPPING_TARGET, mapperClass, mappingFunctionName)
    const isMappingTarget = !isNil(mappingTargetIndex) && index === mappingTargetIndex
    const type = isMappingTarget ? Reflect.getOwnMetadata(MAPPING_TARGET_TYPE, mapperClass, mappingFunctionName) : undefined
    this.name = name
    this.isMappingTarget = isMappingTarget
    this.type = type
  }

  sameNameAs (arg: ArgumentDescriptor): boolean {
    return this.nameWithoutFirstUnderscore() === arg.nameWithoutFirstUnderscore()
  }

  nameEquals (name: string): boolean {
    return this.nameWithoutFirstUnderscore() === detachUnderscore(name)
  }

  nameWithoutFirstUnderscore (): string {
    return detachUnderscore(this.name)
  }
}

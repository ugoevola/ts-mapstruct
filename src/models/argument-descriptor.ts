import { detachUnderscore } from '../utils/utils'

export class ArgumentDescriptor {
  name: string
  value: any
  isMappingTarget: boolean
  type: any

  constructor (name: string, isMappingTarget: boolean, type: any) {
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

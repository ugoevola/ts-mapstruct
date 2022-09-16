import { detachUnderscore, sameType } from "../utils/utils"

export class ArgumentDescriptor {
  name: string
  value: any
  isMappingTarget: boolean
  type: any

  constructor (name: string, value: any, isMappingTarget: boolean, type?: any) {
    this.name = name
    this.value = value
    this.isMappingTarget = isMappingTarget
    this.type = type
  }

  same (arg: ArgumentDescriptor): boolean {
    return this.nameWithoutFirstUnderscore() === arg.nameWithoutFirstUnderscore() &&
      sameType(this.value, arg.value)
  }

  sameNameAs (arg: ArgumentDescriptor): boolean {
    return this.nameWithoutFirstUnderscore() === arg.nameWithoutFirstUnderscore()
  }

  nameWithoutFirstUnderscore (): string {
    return detachUnderscore(this.name)
  }
}

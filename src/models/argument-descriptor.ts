import { detachUnderscore } from "../shared/utils"

export class ArgumentDescriptor {
  name: string

  constructor (name: string) {
    this.name = name
  }

  equals (arg: ArgumentDescriptor): boolean {
    return this.nameWithoutFirstUnderscore() === arg.nameWithoutFirstUnderscore()
  }

  nameWithoutFirstUnderscore (): string {
    return detachUnderscore(this.name)
  }
}

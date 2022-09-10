export class ArgumentDescriptor {
  name: string;

  constructor(name: string) {
    this.name = name
  }

  equals(arg: ArgumentDescriptor): boolean {
    return this.nameWithoutFirstUnderscore() === arg.nameWithoutFirstUnderscore()
  }

  nameWithoutFirstUnderscore() {
    if (this.name.charAt(0) === '_')
      this.name = this.name.substring(1)
    return this.name
  }
}
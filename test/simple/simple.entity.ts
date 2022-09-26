export class Simple {
  private property1: any
  private property2: any
  private property3: any

  getProperty1(): void {
    return this.property1
  }

  getProperty2(): void {
    return this.property2
  }

  getProperty3(): void {
    return this.property3
  }

  setProperty1(property1: any): void {
    this.property1 = property1
  }

  setProperty2(property2: any): void {
    this.property2 = property2
  }

  setProperty3(property3: any): void {
    this.property3 = property3
  }
}

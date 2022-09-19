export class SubImplicit {
  stringProp: string
  boolProp: boolean
  numProp: number
  stringArrayProp: string[]
  booleanArrayProp: boolean[]
  numArrayProp: number[]
  mapProp: Map<string, object>
  objectProp: object

  toString (): string {
    return 'SubImplicitToString'
  }
}

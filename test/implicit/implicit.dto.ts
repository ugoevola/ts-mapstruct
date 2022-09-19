import { SubImplicit } from './sub-implicit'

export class SubSubImplicitDto {
  property: string

  toString (): string {
    return 'SubSubImplicitDtoToString'
  }
}

export class SubImplicitDto {
  stringProp: string
  boolProp: boolean
  numProp: number
  stringArrayProp: string[]
  booleanArrayProp: boolean[]
  numArrayProp: number[]
  mapProp: Map<string, object>
  objectProp: object
  dateProp: Date
  subSubImplicit: SubSubImplicitDto

  toString (): string {
    return 'SubImplicitDtoToString'
  }
}

export class ImplicitDto {
  // basic mapping
  stringProp: string
  boolProp: boolean
  numProp: number
  stringArrayProp: string[]
  booleanArrayProp: boolean[]
  numArrayProp: number[]
  mapProp: Map<string, object>
  objectProp: object
  dateProp: Date
  nullProperty: any

  // instance mapping
  dtoClassInstanceProp: SubImplicitDto
  sharedClassInstanceProp: SubImplicit

  // type to another mapping
  booleanToString: boolean
  numToString: number
  dateToString: Date
  objectToString: object
  arrayToString: any[]
  stringToDate: string
}

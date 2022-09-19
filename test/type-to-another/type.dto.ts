export class TypeDto {
  // to string
  booleanToString: boolean
  numToString: number
  dateToString: Date

  // to number
  stringToNumber: string
  booleanToNumber: boolean
  anyToNumber: any

  // to boolean
  stringToBoolean: string
  numToBoolean: number
  anyToBoolean: any

  // to date
  stringToDate: string
  stringToDate2: string

  // itterable
  arrayToString: any[]
  arrayToStringArray: any[]
  arrayToNumberArray: any[]
  mapToString: Map<any, any>
  mapToStringMap: Map<any, any>
  objectToString: object
}

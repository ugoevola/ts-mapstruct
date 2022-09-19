import { Expose } from "class-transformer"

export class TypeEntity {
  // to string
  @Expose() booleanToString: string
  @Expose() numToString: string
  @Expose() dateToString: string

  // to number
  @Expose() stringToNumber: number
  @Expose() booleanToNumber: number
  @Expose() anyToNumber: number

  // to boolean
  @Expose() stringToBoolean: boolean
  @Expose() numToBoolean: boolean
  @Expose() anyToBoolean: boolean

  // to date
  @Expose() stringToDate: Date
  @Expose() stringToDate2: Date

  // itterable
  @Expose() arrayToString: string
  @Expose() arrayToStringArray: string[]
  @Expose() arrayToNumberArray: number[]
  @Expose() mapToString: string
  @Expose() mapToStringMap: any
  @Expose() objectToString: string
}

import { Expose } from 'class-transformer'
import { SubImplicit } from './sub-implicit'

export class SubSubImplicitEntity {
  @Expose() property: string

  toString (): string {
    return 'SubSubImplicitEntityToString'
  }
}

export class SubImplicitEntity {
  @Expose() stringProp: string
  @Expose() boolProp: boolean
  @Expose() numProp: number
  @Expose() stringArrayProp: string[]
  @Expose() booleanArrayProp: boolean[]
  @Expose() numArrayProp: number[]
  @Expose() mapProp: Map<string, object>
  @Expose() objectProp: object
  @Expose() subSubImplicit: SubSubImplicitEntity

  toString (): string {
    return 'SubImplicitEntityToString'
  }
}

export class ImplicitEntity {
  @Expose() stringProp: string
  @Expose() boolProp: boolean
  @Expose() numProp: number
  @Expose() stringArrayProp: string[]
  @Expose() booleanArrayProp: boolean[]
  @Expose() numArrayProp: number[]
  @Expose() mapProp: Map<string, object>
  @Expose() objectProp: object
  @Expose() dateProp: Date
  @Expose() dtoClassInstanceProp: SubImplicitEntity
  @Expose() sharedClassInstanceProp: SubImplicit
  // type to another mapping
  @Expose() booleanToString: string
  @Expose() numToString: string
  @Expose() dateToString: string
  @Expose() objectToString: string
  @Expose() arrayToString: string
  @Expose() stringToDate: Date

  toString (): string {
    return 'ImplicitEntityToString'
  }
}

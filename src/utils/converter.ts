import { ClassConstructor, plainToInstance } from 'class-transformer'
import { isNil } from 'lodash'
import { MappingOptions } from '../models/mapping-options'

export const convert = (targetedValue: any, options: MappingOptions): any => {
  if (isNil(options.type) || isNil(targetedValue)) return targetedValue
  if (!isNil(options.dateFormat) && targetedValue instanceof Date)
    return dateToString(targetedValue, options)
  if (options.type === 'string') return String(targetedValue)
  if (options.type === 'number') return Number(targetedValue)
  if (options.type === 'boolean') return String(targetedValue) === 'true'
  if (options.type === 'date') return new Date(targetedValue)
  if (typeof options.type === 'function')
    return plainToInstance(options.type as ClassConstructor<any>, targetedValue, { excludeExtraneousValues: true })
}

const dateToString = (targetedValue: Date, options: MappingOptions): string => {
  return Intl.DateTimeFormat(options.dateFormat[0], options.dateFormat[1]).format(
    new Date(targetedValue)
  )
}

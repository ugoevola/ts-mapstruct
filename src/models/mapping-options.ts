import { IsOptional, IsString } from 'class-validator'
import { AtMost } from '../validators/at-most.validator'
import { AtLeast } from '../validators/at-least.validator'

export class MappingOptions {
  @IsString()
  target: string

  @AtMost(['value', 'expression'])
  @AtLeast(['value', 'expression', 'type'])
  source?: string

  @AtMost(['source', 'expression'])
  @AtLeast(['source', 'expression', 'type'])
  value?: any

  @AtMost(['source', 'value'])
  @AtLeast(['source', 'value', 'type'])
  expression?: string

  @AtLeast(['source', 'value', 'expression'])
  type?: MappingOptionsType

  @IsOptional()
  dateFormat?: dateFormat
}

export type MappingOptionsType = Function | 'string' | 'number' | 'date' | 'boolean'

export type dateFormat = [string | string[], dateFormatOptions?]
interface dateFormatOptions {
  dateStyle?: fullLongMediumShortType
  timeStyle?: fullLongMediumShortType
  calendar?: string
  dayPeriod?: longShortNarroweype
  numberingSystem?: string
  localeMatcher?: LookupBestfitType
  timeZone?: string
  hour12?: boolean
  hourCycle?: hourCycleType
  formatMatcher?: basicBestFitType
  weekday?: longShortNarroweype
  era?: longShortNarroweype
  year?: Num2DigitType
  month?: Num2DigitType | longShortNarroweype
  day?: Num2DigitType
  hour?: Num2DigitType
  minute?: Num2DigitType
  second?: Num2DigitType
}
type fullLongMediumShortType = 'full' | 'long' | 'medium' | 'short'
type LookupBestfitType = 'lookup' | 'best fit'
type hourCycleType = 'h11' | 'h12' | 'h23' | 'h24'
type basicBestFitType = 'basic' | 'best fit'
type longShortNarroweype = 'long' | 'short' | 'narrow'
type Num2DigitType = 'numeric' | '2-digit'

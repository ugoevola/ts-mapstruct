import { IsOptional, IsString } from 'class-validator'
import { AtMost } from '../validators/at-most.validator'
import { AtLeast } from '../validators/at-least.validator'

export class MappingOptions {
  @IsString()
    target: string

  @IsString()
  @IsOptional()
  @AtMost(['value', 'expression'])
  @AtLeast(['value', 'expression', 'forceType'])
    source?: string

  @IsOptional()
  @AtMost(['source', 'expression'])
  @AtLeast(['source', 'expression', 'forceType'])
    value?: any

  @IsString()
  @IsOptional()
  @AtMost(['source', 'value'])
  @AtLeast(['source', 'value', 'forceType'])
    expression?: string

  @IsOptional()
  @AtLeast(['source', 'value', 'expression'])
    type?: MappingOptionsType

  @IsOptional()
    dateFormat?: dateFormat
}

export type MappingOptionsType = Function | 'string' | 'number' | 'date' | 'boolean'

export type dateFormat = [ string | string[], dateFormatOptions? ]
type dateFormatOptions = {
  dateStyle?: fullLongMediumShortType,
  timeStyle?: fullLongMediumShortType,
  calendar?: string,
  dayPeriod?: longShortNarroweype,
  numberingSystem?: string,
  localeMatcher?: LookupBestfitType,
  timeZone?: string,
  hour12?: boolean,
  hourCycle?: hourCycleType,
  formatMatcher?: basicBestFitType,
  weekday?: longShortNarroweype,
  era?: longShortNarroweype,
  year?: Num2DigitType,
  month?: Num2DigitType | longShortNarroweype,
  day?: Num2DigitType,
  hour?: Num2DigitType,
  minute?: Num2DigitType,
  second?: Num2DigitType
}
type fullLongMediumShortType = 'full' | 'long' | 'medium' | 'short'
type LookupBestfitType = 'lookup' | 'best fit'
type hourCycleType = 'h11' | 'h12' | 'h23' | 'h24'
type basicBestFitType = 'basic' | 'best fit'
type longShortNarroweype = 'long' | 'short' | 'narrow'
type Num2DigitType = 'numeric' | '2-digit'
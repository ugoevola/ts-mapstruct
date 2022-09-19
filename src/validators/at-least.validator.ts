import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator'

export const AtLeast = (
  properties: string[],
  validationOptions?: ValidationOptions
): Function => (object: Object, propertyName: string): void => {
  registerDecorator({
    name: 'AtLeast',
    target: object.constructor,
    propertyName,
    constraints: [properties],
    options: validationOptions,
    validator: {
      validate (value: any, args: ValidationArguments) {
        const [relatedPropertiesNames] = args.constraints
        return relatedPropertiesNames
          .map((propertyName: string) => (args.object as any)[propertyName])
          .concat([value])
          .filter((value: any) => value !== undefined)
          .length >= 1
      }
    }
  })
}

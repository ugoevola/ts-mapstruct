import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions
} from 'class-validator'

export const AtLeast =
  (properties: string[], validationOptions?: ValidationOptions): Function =>
  (object: Object, propertyName: string): void => {
    registerDecorator({
      name: 'AtLeast',
      target: object.constructor,
      propertyName,
      constraints: [properties],
      options: validationOptions,
      validator: {
        validate(_value: any, args: ValidationArguments) {
          let [relatedPropertiesNames] = args.constraints
          relatedPropertiesNames = relatedPropertiesNames.concat([propertyName])
          return (
            relatedPropertiesNames.filter(
              (propertyName: string) => propertyName in args.object
            ).length >= 1
          )
        },
        defaultMessage(args: ValidationArguments) {
          let [relatedPropertiesNames] = args.constraints
          relatedPropertiesNames = relatedPropertiesNames.concat([propertyName])
          return `AtLeast : ${String(relatedPropertiesNames)} in ${JSON.stringify(
            args.object
          )}`
        }
      }
    })
  }

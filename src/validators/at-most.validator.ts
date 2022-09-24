import {
  ValidationOptions,
  ValidationArguments,
  registerDecorator
} from 'class-validator'

export const AtMost =
  (properties: string[], validationOptions?: ValidationOptions): Function =>
  (object: Object, propertyName: string): void => {
    registerDecorator({
      name: 'relatedWith',
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
            ).length <= 1
          )
        },
        defaultMessage(args: ValidationArguments) {
          let [relatedPropertiesNames] = args.constraints
          relatedPropertiesNames = relatedPropertiesNames.concat([propertyName])
          return `AtMost : ${String(relatedPropertiesNames)} in ${JSON.stringify(
            args.object
          )}`
        }
      }
    })
  }

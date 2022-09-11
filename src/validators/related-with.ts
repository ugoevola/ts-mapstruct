import { registerDecorator, ValidationArguments, ValidationOptions } from "class-validator";

export function RelatedWith(properties: string[], validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'relatedWith',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [properties],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [ relatedPropertiesNames ] = args.constraints
          return value === undefined ||
            relatedPropertiesNames
            .filter((propertyName: string) => (args.object as any)[propertyName] !== undefined)
            .length === 0;
        },
      },
    });
  };
}
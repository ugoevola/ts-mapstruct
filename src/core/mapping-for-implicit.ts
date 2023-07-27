import { ArgumentDescriptor } from '../models/argument-descriptor'

export const mapImplicitProperties = <T extends object>(
  sourceArgs: ArgumentDescriptor[],
  targetedObject: T
): void => {
  sourceArgs.forEach(sourceArg => {
    mapImplicitValue(sourceArg, targetedObject)
    mapImplicitObject(sourceArg, targetedObject)
  })
}

const mapImplicitValue = <T extends object>(
  sourceArg: ArgumentDescriptor,
  targetedObject: T
): void => {
  if (sourceArg.nameWithoutFirstUnderscore() in targetedObject)
    targetedObject[sourceArg.nameWithoutFirstUnderscore()] = sourceArg.value
}

const mapImplicitObject = <T extends object>(
  sourceArg: ArgumentDescriptor,
  targetedObject: T
): void => {
  if (typeof sourceArg.value === 'object' && sourceArg.value !== null) {
    Object.entries(sourceArg.value).forEach(([propertyName, propertyValue]) => {
      if (propertyName in targetedObject)
        targetedObject[propertyName] = propertyValue
    })
  }
}

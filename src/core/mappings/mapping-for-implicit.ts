export const mapImplicitProperties = (sourceObjects: any[], targetedObject: any): void => {
  if (sourceObjects.length !== 1) return
  Object.entries(sourceObjects[0]).forEach(([propertyName, propertyValue]) => {
    if (propertyName in targetedObject) {
      targetedObject[propertyName] = propertyValue
    }
  })
}
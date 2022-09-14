import { isNil } from 'lodash'
import { FunctionDescriptor } from '../models/function-descriptor'
import { AFTER_MAPPING, BEFORE_MAPPING, MAPPING_TARGET, MAPPING_TARGET_TYPE, VALUE } from '../models/constants'
import { ArgumentDescriptor } from '../models/argument-descriptor'

export const apply = (
  metadataKey: string,
  consumer: any,
  sourceArgsDescriptors: ArgumentDescriptor[],
  sourceObjects: any[],
  targetedObject: any,
  mappingFunctionName: string
): void => {
  Reflect.getOwnMetadata(metadataKey, consumer)
    ?.map((fnName: string) => new FunctionDescriptor(fnName, Reflect.getOwnMetadata(VALUE, consumer, fnName)))
    ?.filter((applier: FunctionDescriptor) => checkForInvocation(metadataKey, applier, sourceArgsDescriptors, consumer, targetedObject, mappingFunctionName))
    ?.map((applier: FunctionDescriptor) => computeArguments(consumer, applier, sourceObjects, targetedObject, sourceArgsDescriptors))
    ?.forEach((applier: FunctionDescriptor) => applier.fn(...applier.argumentsValues))
}

const checkForInvocation = (
  metadataKey: string,
  applier: FunctionDescriptor,
  sourceArgsDescriptors: ArgumentDescriptor[],
  consumer: any,
  targetedObject: any,
  mappingFunctionName: string
): boolean => {
  if (metadataKey === BEFORE_MAPPING) return checkForInvocationForBefore(applier, sourceArgsDescriptors, consumer, mappingFunctionName)
  if (metadataKey === AFTER_MAPPING) return checkForInvocationForAfter(applier, sourceArgsDescriptors, consumer, targetedObject)
}

const checkForInvocationForBefore = (
  applier: FunctionDescriptor,
  sourceArgsDescriptors: ArgumentDescriptor[],
  consumer: any,
  mappingFunctionName: string
): boolean => {
  return applier.argumentsDescriptors
    .filter((argDescriptor, index) => !(
      sourceArgsDescriptors.some(arg => arg.equals(argDescriptor)) &&
      !isMappingTargetType(index, consumer, applier.name) ||
      sourceArgsDescriptors.some(arg => arg.equals(argDescriptor)) &&
      isMappingTargetType(index, consumer, applier.name) &&
      isTheSameForMappingFunction(consumer, mappingFunctionName, sourceArgsDescriptors, argDescriptor
      )))
    .length === 0
}

const isTheSameForMappingFunction = (
  consumer: any,
  functionName: string,
  sourceArgsDescriptors: ArgumentDescriptor[],
  argDescriptor: ArgumentDescriptor
): boolean => {
  return argDescriptor.equals(sourceArgsDescriptors[Reflect.getOwnMetadata(MAPPING_TARGET, consumer, functionName)])
}

const checkForInvocationForAfter = (
  applier: FunctionDescriptor,
  sourceArgsDescriptors: ArgumentDescriptor[],
  consumer: any,
  targetedObject: any
): boolean => {
  return applier.argumentsDescriptors
    .filter((argDescriptor, index) =>
      !(sourceArgsDescriptors.some(arg => arg.equals(argDescriptor)) && !isMappingTargetType(index, consumer, applier.name) ||
      isMappingTargetType(index, consumer, applier.name) && isReturnedType(targetedObject, consumer, applier.name)))
    .length === 0
}

const isMappingTargetType = (index: number, consumer: any, functionName: string): boolean => {
  return index === Reflect.getOwnMetadata(MAPPING_TARGET, consumer, functionName)
}

const isReturnedType = (targetedObject: any, consumer: any, functionName: string): boolean => {
  return Reflect.getOwnMetadata(MAPPING_TARGET_TYPE, consumer, functionName) === targetedObject.constructor
}

const computeArguments = (
  consumer: any,
  applier: FunctionDescriptor,
  sourceObjects: any[],
  targetedObject: any,
  sourceArgsDescriptors: ArgumentDescriptor[]
): FunctionDescriptor => {
  const args = sourceObjects.reduce((acc, val, index) => {
    const targetedIndex = applier.argumentsDescriptors.findIndex(arg => arg.equals(sourceArgsDescriptors[index]))
    if (targetedIndex !== -1) acc[targetedIndex] = val
    return acc
  }, [])
  const parameterIndex = Reflect.getOwnMetadata(MAPPING_TARGET, consumer, applier.name)
  if (!isNil(parameterIndex)) args[parameterIndex] = targetedObject
  const applierCopy = { ...applier }
  applierCopy.argumentsValues = args
  return applierCopy
}

import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

export function IsBookingTimeValid(
  startTimeField: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isBookingTimeValid',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [startTimeField],
      options: validationOptions,
      validator: {
        validate(endTimeValue: any, args: ValidationArguments) {
          const [startTimeFieldName] = args.constraints;
          const startTimeVAlue = (args.object as any)[startTimeFieldName];

          if (!startTimeVAlue || !endTimeValue) return true; // skip if missing

          const startDate = new Date(startTimeVAlue);
          const endDate = new Date(endTimeValue);
          const now = new Date();

          if (startDate <= now || endDate <= now) return false; // both must be in the future

          return endDate > startDate; // endTime must be after startTime
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be after ${args.constraints[0]} and both times must be in the future`;
        },
      },
    });
  };
}

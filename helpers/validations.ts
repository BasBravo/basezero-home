import { helpers } from '@vuelidate/validators';

export const isPositive = (): any => ({
    $validator: helpers.withParams({ type: 'isPositive' }, (value: number) => value >= 0),
    $message: 'This field should not be negative',
});

export const arrayNotEmpty = () => ({
    $validator: helpers.withParams({ type: 'arrayNotEmpty' }, (value: any[]) => value === undefined || value === null || value.length === 0),
    $message: 'This field should not be empty',
});

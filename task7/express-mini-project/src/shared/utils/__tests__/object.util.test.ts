import test from 'node:test';
import { cleanObject, removeFields } from '../object.util';
import { object } from 'zod';

describe('Object Utility Functions', () => {

    test('"cleanObject" function should remove any undefined or null value ', () => {
        const objectThatHasNullableValues = {
            name: 'ahmed',
            age: undefined,
            email: null
        };

        const objectWithoutNullableValues = cleanObject(
            objectThatHasNullableValues
        );

        // assertion
        expect(Object.keys(objectWithoutNullableValues)[0]).toBe('name');
        expect(Object.keys(objectWithoutNullableValues).length).toBe(1);
    });

    // test.todo('removeFields" function should return the object without');
    test('"removeFields" function should return the object without fields i passed to function to omitted ', () => {
        const user = { name: 'ahmed', age: 20, email: 'ahmed@gmail.com' };
    
    const userWithoutName = removeFields(user, ['name']);{
     expect  (userWithoutName).toBeUndefined();
 expect(Object.keys(userWithoutName).length).toBe(2);
}}
);
})
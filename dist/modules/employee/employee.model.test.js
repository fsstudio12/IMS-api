"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const faker_1 = require("@faker-js/faker");
const employee_model_1 = __importDefault(require("./employee.model"));
describe('User model', () => {
    describe('User validation', () => {
        let newUser;
        beforeEach(() => {
            newUser = {
                name: faker_1.faker.name.findName(),
                email: faker_1.faker.internet.email().toLowerCase(),
                phone: '9812345678',
                password: 'password1',
            };
        });
        test('should correctly validate a valid user', async () => {
            await expect(new employee_model_1.default(newUser).validate()).resolves.toBeUndefined();
        });
        test('should throw a validation error if email is invalid', async () => {
            newUser.email = 'invalidEmail';
            await expect(new employee_model_1.default(newUser).validate()).rejects.toThrow();
        });
        test('should throw a validation error if password length is less than 8 characters', async () => {
            newUser.password = 'passwo1';
            await expect(new employee_model_1.default(newUser).validate()).rejects.toThrow();
        });
        test('should throw a validation error if password does not contain numbers', async () => {
            newUser.password = 'password';
            await expect(new employee_model_1.default(newUser).validate()).rejects.toThrow();
        });
        test('should throw a validation error if password does not contain letters', async () => {
            newUser.password = '11111111';
            await expect(new employee_model_1.default(newUser).validate()).rejects.toThrow();
        });
        /* eslint-disable */
        // test('should throw a validation error if role is unknown', async () => {
        //   newUser.role = 'invalid';
        //   await expect(new User(newUser).validate()).rejects.toThrow();
        // });
    });
    describe('User toJSON()', () => {
        test('should not return user password when toJSON is called', () => {
            const newUser = {
                name: faker_1.faker.name.findName(),
                email: faker_1.faker.internet.email().toLowerCase(),
                password: 'password1',
                role: 'employee',
            };
            expect(new employee_model_1.default(newUser).toJSON()).not.toHaveProperty('password');
        });
    });
});
//# sourceMappingURL=employee.model.test.js.map
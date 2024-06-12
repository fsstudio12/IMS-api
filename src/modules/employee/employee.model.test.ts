import { faker } from '@faker-js/faker';
import { RegisterEmployeePayload } from './employee.interfaces';
import User from './employee.model';

describe('User model', () => {
  describe('User validation', () => {
    let newUser: RegisterEmployeePayload;
    beforeEach(() => {
      newUser = {
        name: faker.name.findName(),
        email: faker.internet.email().toLowerCase(),
        phone: '9812345678',
        password: 'password1',
      };
    });

    test('should correctly validate a valid user', async () => {
      await expect(new User(newUser).validate()).resolves.toBeUndefined();
    });

    test('should throw a validation error if email is invalid', async () => {
      newUser.email = 'invalidEmail';
      await expect(new User(newUser).validate()).rejects.toThrow();
    });

    test('should throw a validation error if password length is less than 8 characters', async () => {
      newUser.password = 'passwo1';
      await expect(new User(newUser).validate()).rejects.toThrow();
    });

    test('should throw a validation error if password does not contain numbers', async () => {
      newUser.password = 'password';
      await expect(new User(newUser).validate()).rejects.toThrow();
    });

    test('should throw a validation error if password does not contain letters', async () => {
      newUser.password = '11111111';
      await expect(new User(newUser).validate()).rejects.toThrow();
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
        name: faker.name.findName(),
        email: faker.internet.email().toLowerCase(),
        password: 'password1',
        role: 'employee',
      };
      expect(new User(newUser).toJSON()).not.toHaveProperty('password');
    });
  });
});

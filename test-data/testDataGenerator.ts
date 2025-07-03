import { faker } from '@faker-js/faker';

export function generateContactData() {
  return {
    firstName: faker.person.firstName(),
    email: faker.internet.email(),
    message: faker.lorem.sentence()
   
  };
}

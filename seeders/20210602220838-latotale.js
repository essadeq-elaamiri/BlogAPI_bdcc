"use strict";
const faker = require("faker");
const users = [...Array(20)].map((user) => ({
  username: faker.internet.userName(),
  email: faker.internet.email();
  password: faker.internet.password(8);
  role: faker.helpers.randomize(["admin", "guest", "author"]),
  createdAt: faker.date.between(new Date("01-01-2000"), new Date("12-12-2020")),
  updatedAt: new Date()
}));


module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    await queryInterface.bulkInsert("Users", users, {});
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};

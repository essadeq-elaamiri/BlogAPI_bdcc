"use strict";

var faker = require("faker");

//create users using faker

var users = Array(20);
for (var i = 0; i < users.length; i++) {
  users[i] = {
    username: faker.name
      .firstName()
      .concat(" ")
      .concat(faker.name.lastName().toUpperCase()),
    email: faker.internet.email(),
    password: faker.internet.password(11),
    role: "guest",
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

console.log(users);

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

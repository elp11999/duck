'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.bulkInsert('drinks', [{
        drink_type: 'beer',
        drink_name: 'guinness',
        price: 3.50,
        quantity: 20,
        createdAt: new Date(),
        updatedAt: new Date()
      }], {});
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('drinks', null, {});
  }
};

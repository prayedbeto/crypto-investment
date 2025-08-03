'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Agregar campos faltantes a la tabla cryptocurrency_metadata
    await queryInterface.addColumn('cryptocurrency_metadata', 'facebook_urls', {
      type: Sequelize.TEXT,
      allowNull: true
    });

    await queryInterface.addColumn('cryptocurrency_metadata', 'subreddit', {
      type: Sequelize.STRING,
      allowNull: true
    });

    await queryInterface.addColumn('cryptocurrency_metadata', 'twitter_username', {
      type: Sequelize.STRING,
      allowNull: true
    });

    await queryInterface.addColumn('cryptocurrency_metadata', 'is_hidden', {
      type: Sequelize.BOOLEAN,
      allowNull: true,
      defaultValue: false
    });

    await queryInterface.addColumn('cryptocurrency_metadata', 'notice', {
      type: Sequelize.TEXT,
      allowNull: true
    });

    await queryInterface.addColumn('cryptocurrency_metadata', 'tag_names', {
      type: Sequelize.TEXT,
      allowNull: true
    });

    await queryInterface.addColumn('cryptocurrency_metadata', 'tag_groups', {
      type: Sequelize.TEXT,
      allowNull: true
    });

    await queryInterface.addColumn('cryptocurrency_metadata', 'contract_addresses', {
      type: Sequelize.TEXT,
      allowNull: true
    });

    await queryInterface.addColumn('cryptocurrency_metadata', 'self_reported_circulating_supply', {
      type: Sequelize.DECIMAL(20, 8),
      allowNull: true
    });

    await queryInterface.addColumn('cryptocurrency_metadata', 'self_reported_market_cap', {
      type: Sequelize.DECIMAL(20, 8),
      allowNull: true
    });

    await queryInterface.addColumn('cryptocurrency_metadata', 'self_reported_tags', {
      type: Sequelize.TEXT,
      allowNull: true
    });

    await queryInterface.addColumn('cryptocurrency_metadata', 'infinite_supply', {
      type: Sequelize.BOOLEAN,
      allowNull: true,
      defaultValue: false
    });

    // Cambiar el tipo de campo platform a TEXT
    await queryInterface.changeColumn('cryptocurrency_metadata', 'platform', {
      type: Sequelize.TEXT,
      allowNull: true
    });
  },

  async down (queryInterface, Sequelize) {
    // Remover campos agregados
    await queryInterface.removeColumn('cryptocurrency_metadata', 'facebook_urls');
    await queryInterface.removeColumn('cryptocurrency_metadata', 'subreddit');
    await queryInterface.removeColumn('cryptocurrency_metadata', 'twitter_username');
    await queryInterface.removeColumn('cryptocurrency_metadata', 'is_hidden');
    await queryInterface.removeColumn('cryptocurrency_metadata', 'notice');
    await queryInterface.removeColumn('cryptocurrency_metadata', 'tag_names');
    await queryInterface.removeColumn('cryptocurrency_metadata', 'tag_groups');
    await queryInterface.removeColumn('cryptocurrency_metadata', 'contract_addresses');
    await queryInterface.removeColumn('cryptocurrency_metadata', 'self_reported_circulating_supply');
    await queryInterface.removeColumn('cryptocurrency_metadata', 'self_reported_market_cap');
    await queryInterface.removeColumn('cryptocurrency_metadata', 'self_reported_tags');
    await queryInterface.removeColumn('cryptocurrency_metadata', 'infinite_supply');

    // Revertir el cambio de tipo de platform
    await queryInterface.changeColumn('cryptocurrency_metadata', 'platform', {
      type: Sequelize.STRING,
      allowNull: true
    });
  }
};

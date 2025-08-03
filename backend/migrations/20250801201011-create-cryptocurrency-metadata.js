'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('cryptocurrency_metadata', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      cryptocurrency_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'cryptocurrencies',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      logo: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      date_added: {
        type: Sequelize.DATE,
        allowNull: true
      },
      date_launched: {
        type: Sequelize.DATE,
        allowNull: true
      },
      tags: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      category: {
        type: Sequelize.STRING,
        allowNull: true
      },
      platform: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      website_urls: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      technical_doc_urls: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      twitter_urls: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      reddit_urls: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      message_board_urls: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      announcement_urls: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      chat_urls: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      explorer_urls: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      source_code_urls: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      facebook_urls: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      subreddit: {
        type: Sequelize.STRING,
        allowNull: true
      },
      twitter_username: {
        type: Sequelize.STRING,
        allowNull: true
      },
      is_hidden: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false
      },
      notice: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      tag_names: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      tag_groups: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      contract_addresses: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      self_reported_circulating_supply: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      self_reported_market_cap: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      self_reported_tags: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      infinite_supply: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    // Agregar índice único para cryptocurrency_id
    await queryInterface.addIndex('cryptocurrency_metadata', ['cryptocurrency_id'], {
      unique: true,
      name: 'cryptocurrency_metadata_cryptocurrency_id_unique'
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('cryptocurrency_metadata');
  }
};

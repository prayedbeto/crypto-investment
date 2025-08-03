'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('cryptocurrency_prices', {
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
      cmc_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: 'ID de CoinMarketCap'
      },
      price: {
        type: Sequelize.DECIMAL(20, 8),
        allowNull: false
      },
      market_cap: {
        type: Sequelize.DECIMAL(20, 2),
        allowNull: false
      },
      volume_24h: {
        type: Sequelize.DECIMAL(20, 2),
        allowNull: false
      },
      percent_change_1h: {
        type: Sequelize.DECIMAL(10, 4),
        allowNull: true
      },
      percent_change_24h: {
        type: Sequelize.DECIMAL(10, 4),
        allowNull: true
      },
      percent_change_7d: {
        type: Sequelize.DECIMAL(10, 4),
        allowNull: true
      },
      percent_change_30d: {
        type: Sequelize.DECIMAL(10, 4),
        allowNull: true
      },
      percent_change_60d: {
        type: Sequelize.DECIMAL(10, 4),
        allowNull: true
      },
      percent_change_90d: {
        type: Sequelize.DECIMAL(10, 4),
        allowNull: true
      },
      market_cap_dominance: {
        type: Sequelize.DECIMAL(10, 4),
        allowNull: true
      },
      fully_diluted_market_cap: {
        type: Sequelize.DECIMAL(20, 2),
        allowNull: true
      },
      circulating_supply: {
        type: Sequelize.DECIMAL(20, 8),
        allowNull: true
      },
      total_supply: {
        type: Sequelize.DECIMAL(20, 8),
        allowNull: true
      },
      max_supply: {
        type: Sequelize.DECIMAL(20, 8),
        allowNull: true
      },
      cmc_rank: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      volume_change_24h: {
        type: Sequelize.DECIMAL(10, 4),
        allowNull: true
      },
      num_market_pairs: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: true
      },
      is_fiat: {
        type: Sequelize.BOOLEAN,
        allowNull: true
      },
      tvl_ratio: {
        type: Sequelize.DECIMAL(10, 8),
        allowNull: true
      },
      tags: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      recorded_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
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

    // Agregar índices para mejorar el rendimiento de consultas
    await queryInterface.addIndex('cryptocurrency_prices', ['cryptocurrency_id', 'recorded_at'], {
      name: 'cryptocurrency_prices_crypto_recorded_idx'
    });

    await queryInterface.addIndex('cryptocurrency_prices', ['cmc_id', 'recorded_at'], {
      name: 'cryptocurrency_prices_cmc_recorded_idx'
    });

    await queryInterface.addIndex('cryptocurrency_prices', ['recorded_at'], {
      name: 'cryptocurrency_prices_recorded_at_idx'
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('cryptocurrency_prices');
  }
};

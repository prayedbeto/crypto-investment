'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class CryptocurrencyPrice extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define associations here
      CryptocurrencyPrice.belongsTo(models.Cryptocurrency, {
        foreignKey: 'cryptocurrency_id',
        as: 'cryptocurrency'
      });
    }
  }
  
  CryptocurrencyPrice.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    cryptocurrency_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'cryptocurrencies',
        key: 'id'
      }
    },
    cmc_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: 'ID de CoinMarketCap'
    },
    price: {
      type: DataTypes.DECIMAL(20, 8),
      allowNull: false
    },
    market_cap: {
      type: DataTypes.DECIMAL(20, 2),
      allowNull: false
    },
    volume_24h: {
      type: DataTypes.DECIMAL(20, 2),
      allowNull: false
    },
    percent_change_1h: {
      type: DataTypes.DECIMAL(10, 4),
      allowNull: true
    },
    percent_change_24h: {
      type: DataTypes.DECIMAL(10, 4),
      allowNull: true
    },
    percent_change_7d: {
      type: DataTypes.DECIMAL(10, 4),
      allowNull: true
    },
    percent_change_30d: {
      type: DataTypes.DECIMAL(10, 4),
      allowNull: true
    },
    percent_change_60d: {
      type: DataTypes.DECIMAL(10, 4),
      allowNull: true
    },
    percent_change_90d: {
      type: DataTypes.DECIMAL(10, 4),
      allowNull: true
    },
    market_cap_dominance: {
      type: DataTypes.DECIMAL(10, 4),
      allowNull: true
    },
    fully_diluted_market_cap: {
      type: DataTypes.DECIMAL(20, 2),
      allowNull: true
    },
    circulating_supply: {
      type: DataTypes.DECIMAL(20, 8),
      allowNull: true
    },
    total_supply: {
      type: DataTypes.DECIMAL(20, 8),
      allowNull: true
    },
    max_supply: {
      type: DataTypes.DECIMAL(20, 8),
      allowNull: true
    },
    cmc_rank: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    volume_change_24h: {
      type: DataTypes.DECIMAL(10, 4),
      allowNull: true
    },
    num_market_pairs: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    is_fiat: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    tvl_ratio: {
      type: DataTypes.DECIMAL(10, 8),
      allowNull: true
    },
    tags: {
      type: DataTypes.TEXT,
      allowNull: true,
      get() {
        const rawValue = this.getDataValue('tags');
        return rawValue ? JSON.parse(rawValue) : [];
      },
      set(value) {
        this.setDataValue('tags', value ? JSON.stringify(value) : null);
      }
    },
    recorded_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'CryptocurrencyPrice',
    tableName: 'cryptocurrency_prices',
    timestamps: true,
    indexes: [
      {
        fields: ['cryptocurrency_id', 'recorded_at']
      },
      {
        fields: ['cmc_id', 'recorded_at']
      },
      {
        fields: ['recorded_at']
      }
    ]
  });
  
  return CryptocurrencyPrice;
}; 
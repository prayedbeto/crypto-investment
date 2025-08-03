'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Cryptocurrency extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define associations here
      Cryptocurrency.hasOne(models.CryptocurrencyMetadata, {
        foreignKey: 'cryptocurrency_id',
        as: 'metadata'
      });
      Cryptocurrency.hasMany(models.CryptocurrencyPrice, {
        foreignKey: 'cryptocurrency_id',
        as: 'prices'
      });
    }
  }
  
  Cryptocurrency.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    rank: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    symbol: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    first_historical_data: {
      type: DataTypes.DATE,
      allowNull: true
    },
    last_historical_data: {
      type: DataTypes.DATE,
      allowNull: true
    },
    platform: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Cryptocurrency',
    tableName: 'cryptocurrencies',
    timestamps: true
  });
  
  return Cryptocurrency;
}; 
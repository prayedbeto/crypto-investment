'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class CryptocurrencyMetadata extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define associations here
      CryptocurrencyMetadata.belongsTo(models.Cryptocurrency, {
        foreignKey: 'cryptocurrency_id',
        as: 'cryptocurrency'
      });
    }
  }
  
  CryptocurrencyMetadata.init({
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
    logo: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    date_added: {
      type: DataTypes.DATE,
      allowNull: true
    },
    date_launched: {
      type: DataTypes.DATE,
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
        this.setDataValue('tags', JSON.stringify(value));
      }
    },
    category: {
      type: DataTypes.STRING,
      allowNull: true
    },
    platform: {
      type: DataTypes.TEXT,
      allowNull: true,
      get() {
        const rawValue = this.getDataValue('platform');
        return rawValue ? JSON.parse(rawValue) : null;
      },
      set(value) {
        this.setDataValue('platform', value ? JSON.stringify(value) : null);
      }
    },
    website_urls: {
      type: DataTypes.TEXT,
      allowNull: true,
      get() {
        const rawValue = this.getDataValue('website_urls');
        return rawValue ? JSON.parse(rawValue) : [];
      },
      set(value) {
        this.setDataValue('website_urls', JSON.stringify(value));
      }
    },
    technical_doc_urls: {
      type: DataTypes.TEXT,
      allowNull: true,
      get() {
        const rawValue = this.getDataValue('technical_doc_urls');
        return rawValue ? JSON.parse(rawValue) : [];
      },
      set(value) {
        this.setDataValue('technical_doc_urls', JSON.stringify(value));
      }
    },
    twitter_urls: {
      type: DataTypes.TEXT,
      allowNull: true,
      get() {
        const rawValue = this.getDataValue('twitter_urls');
        return rawValue ? JSON.parse(rawValue) : [];
      },
      set(value) {
        this.setDataValue('twitter_urls', JSON.stringify(value));
      }
    },
    reddit_urls: {
      type: DataTypes.TEXT,
      allowNull: true,
      get() {
        const rawValue = this.getDataValue('reddit_urls');
        return rawValue ? JSON.parse(rawValue) : [];
      },
      set(value) {
        this.setDataValue('reddit_urls', JSON.stringify(value));
      }
    },
    message_board_urls: {
      type: DataTypes.TEXT,
      allowNull: true,
      get() {
        const rawValue = this.getDataValue('message_board_urls');
        return rawValue ? JSON.parse(rawValue) : [];
      },
      set(value) {
        this.setDataValue('message_board_urls', JSON.stringify(value));
      }
    },
    announcement_urls: {
      type: DataTypes.TEXT,
      allowNull: true,
      get() {
        const rawValue = this.getDataValue('announcement_urls');
        return rawValue ? JSON.parse(rawValue) : [];
      },
      set(value) {
        this.setDataValue('announcement_urls', JSON.stringify(value));
      }
    },
    chat_urls: {
      type: DataTypes.TEXT,
      allowNull: true,
      get() {
        const rawValue = this.getDataValue('chat_urls');
        return rawValue ? JSON.parse(rawValue) : [];
      },
      set(value) {
        this.setDataValue('chat_urls', JSON.stringify(value));
      }
    },
    explorer_urls: {
      type: DataTypes.TEXT,
      allowNull: true,
      get() {
        const rawValue = this.getDataValue('explorer_urls');
        return rawValue ? JSON.parse(rawValue) : [];
      },
      set(value) {
        this.setDataValue('explorer_urls', JSON.stringify(value));
      }
    },
    source_code_urls: {
      type: DataTypes.TEXT,
      allowNull: true,
      get() {
        const rawValue = this.getDataValue('source_code_urls');
        return rawValue ? JSON.parse(rawValue) : [];
      },
      set(value) {
        this.setDataValue('source_code_urls', JSON.stringify(value));
      }
    },
    facebook_urls: {
      type: DataTypes.TEXT,
      allowNull: true,
      get() {
        const rawValue = this.getDataValue('facebook_urls');
        return rawValue ? JSON.parse(rawValue) : [];
      },
      set(value) {
        this.setDataValue('facebook_urls', JSON.stringify(value));
      }
    },
    subreddit: {
      type: DataTypes.STRING,
      allowNull: true
    },
    twitter_username: {
      type: DataTypes.STRING,
      allowNull: true
    },
    is_hidden: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    notice: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    tag_names: {
      type: DataTypes.TEXT,
      allowNull: true,
      get() {
        const rawValue = this.getDataValue('tag_names');
        return rawValue ? JSON.parse(rawValue) : [];
      },
      set(value) {
        this.setDataValue('tag_names', JSON.stringify(value));
      }
    },
    tag_groups: {
      type: DataTypes.TEXT,
      allowNull: true,
      get() {
        const rawValue = this.getDataValue('tag_groups');
        return rawValue ? JSON.parse(rawValue) : [];
      },
      set(value) {
        this.setDataValue('tag_groups', JSON.stringify(value));
      }
    },
    contract_addresses: {
      type: DataTypes.TEXT,
      allowNull: true,
      get() {
        const rawValue = this.getDataValue('contract_addresses');
        return rawValue ? JSON.parse(rawValue) : [];
      },
      set(value) {
        this.setDataValue('contract_addresses', JSON.stringify(value));
      }
    },
    self_reported_circulating_supply: {
      type: DataTypes.DECIMAL(20, 8),
      allowNull: true
    },
    self_reported_market_cap: {
      type: DataTypes.DECIMAL(20, 8),
      allowNull: true
    },
    self_reported_tags: {
      type: DataTypes.TEXT,
      allowNull: true,
      get() {
        const rawValue = this.getDataValue('self_reported_tags');
        return rawValue ? JSON.parse(rawValue) : null;
      },
      set(value) {
        this.setDataValue('self_reported_tags', value ? JSON.stringify(value) : null);
      }
    },
    infinite_supply: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    }
  }, {
    sequelize,
    modelName: 'CryptocurrencyMetadata',
    tableName: 'cryptocurrency_metadata',
    timestamps: true
  });
  
  return CryptocurrencyMetadata;
}; 
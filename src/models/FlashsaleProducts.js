'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class flashsale_products extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    flashsale_products.init(
        {
            product_id: DataTypes.UUIDV4,
            flashsale_id: DataTypes.UUIDV4,
            is_sold_out: DataTypes.BOOLEAN,
            price : DataTypes.DECIMAL
        },
        {
            sequelize,
            modelName: 'flashsale_products',
            underscored: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            deletedAt: 'deleted_at',
        }
    );
    return flashsale_products;
};

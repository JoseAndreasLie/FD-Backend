'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class FlashsaleProducts extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            FlashsaleProducts.belongsTo(models.flashsales, {
                foreignKey: 'flashsale_id',
                as: 'flashsale',
            });

            // // Association with product
            FlashsaleProducts.belongsTo(models.products, {
                foreignKey: 'product_id',
                as: 'product',
            });
        }
    }
    FlashsaleProducts.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4, 
                primaryKey: true,
                allowNull: false,
            },
            product_id: DataTypes.UUIDV4,
            flashsale_id: DataTypes.UUIDV4,
            is_sold_out: DataTypes.BOOLEAN,
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
    return FlashsaleProducts;
};

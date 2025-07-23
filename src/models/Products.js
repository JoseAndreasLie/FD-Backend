'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Products extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            // Products.belongsTo(models.brands, {
            //     foreignKey: 'brand_id',
            //     as: 'brand',
            // });
            // Products.belongsTo(models.booths, {
            //     foreignKey: 'booth_id',
            //     // as: 'booth',
            // });

            // // Association with flashsale_products
            // Products.hasMany(models.flashsale_products, {
            //     foreignKey: 'product_id',
            //     as: 'flashsale_product',
            // });

            // // Many-to-many relationship with flashsales
            Products.belongsToMany(models.flashsales, {
                through: models.flashsale_products,
                foreignKey: 'product_id',
                otherKey: 'flashsale_id',
                as: 'flashsales', // Different alias from Flashsales model
            });
        }
    }
    Products.init(
        {
            name: DataTypes.STRING,
            img_url: DataTypes.STRING,
            // brand_id: DataTypes.UUIDV4,
            price: DataTypes.DECIMAL,
            after_flashsale_price: DataTypes.DECIMAL,
            booth_id: DataTypes.UUIDV4,
        },
        {
            sequelize,
            modelName: 'products',
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            deletedAt: 'deleted_at',
        }
    );
    return Products;
};

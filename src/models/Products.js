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
            Products.belongsTo(models.brands, {
                foreignKey: 'brand_id',
                as: 'brand',
            });
            Products.belongsTo(models.booths, {
                foreignKey: 'booth_id',
                as: 'booth',
            });
        }
    }
    Products.init(
        {
            name: DataTypes.STRING,
            img_url: DataTypes.STRING,
            brand_id: DataTypes.UUIDV4,
            booth_id: DataTypes.UUIDV4,
        },
        {
            sequelize,
            modelName: 'products',
        }
    );
    return Products;
};

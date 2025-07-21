'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Brands extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Brands.hasMany(models.booths, {
                foreignKey: 'brand_id',
                as: 'booths',
            });
        }
    }
    Brands.init(
        {
            name: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: 'brands',
            underscored: true,
        }
    );
    return Brands;
};

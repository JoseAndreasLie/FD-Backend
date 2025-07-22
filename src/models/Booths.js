'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Booths extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            // Booths.belongsTo(models.brands, {
            //     foreignKey: 'brand_id',
            //     as: 'brand',
            // });
        }
    }
    Booths.init(
        {
            name: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: 'booths',
            underscored: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            deletedAt: 'deleted_at',
        }
    );
    return Booths;
};

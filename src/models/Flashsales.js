'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Flashsales extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            // Flashsales.belongsTo(models.brands, {
            //     foreignKey: 'brand_id',
            //     as: 'brand',
            // });
            Flashsales.belongsTo(models.booths, {
                foreignKey: 'booth_id',
                as: 'booth',
            });
        }
    }
    Flashsales.init(
        {
            name: DataTypes.STRING,
            // brand_id: {
            //     type: DataTypes.STRING,
            //     allowNull: false,
            // },
            booth_id: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            start_time: DataTypes.DATE,
            end_time: DataTypes.DATE,
            queue_early_access_minutes: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: 'flashsales',
            underscored: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            deletedAt: 'deleted_at',
        }
    );
    return Flashsales;
};

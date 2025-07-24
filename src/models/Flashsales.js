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
            // Association with flashsale_products (junction table)
            // Flashsales.hasMany(models.flashsale_products, {
            //     foreignKey: 'flashsale_id',
            //     as: 'flashsale_product', // Use a unique alias for the association
            // });

            
            // // Many-to-many relationship with products through flashsale_products
            // Flashsales.belongsToMany(models.products, {
            //     through: models.flashsale_products,
            //     foreignKey: 'flashsale_id',
            //     otherKey: 'product_id',
            //     as: 'product', // Use unique alias
            // });
                
            Flashsales.belongsToMany(models.products, {
                through: models.flashsale_products,
                foreignKey: 'flashsale_id',
                otherKey: 'product_id',
                as: 'products', // Use unique alias for the association
            })

            // Association with booth
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
                type: DataTypes.UUIDV4,
                allowNull: false,
            },
            date: DataTypes.STRING,
            start_time: DataTypes.STRING,
            end_time: DataTypes.STRING,
            queue_early_access_time: DataTypes.STRING,
            flashsale_active_utc: DataTypes.DATE,
            flashsale_inactive_utc: DataTypes.DATE,
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

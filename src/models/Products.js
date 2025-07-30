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
            // // Many-to-many relationship with flashsales
            Products.belongsToMany(models.flashsales, {
                through: models.flashsale_products,
                foreignKey: 'product_id',
                otherKey: 'flashsale_id',
                as: 'flashsales', // Different alias from Flashsales model
            });

            Products.belongsToMany(models.queue_entries, {
                through: models.queue_entry_products,
                foreignKey: 'product_id',
                otherKey: 'queue_entry_id',
                as: 'queue_entries', // Different alias from QueueEntries model
            });
        }
    }
    Products.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4, 
                primaryKey: true,
                allowNull: false,
            },
            name: DataTypes.STRING,
            img_url: DataTypes.STRING,
            // brand_id: DataTypes.UUIDV4,
            price: DataTypes.DECIMAL,
            after_flashsale_price: DataTypes.DECIMAL,
            booth_id: DataTypes.UUIDV4,
            created_at: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
            },
            updated_at: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
            },
            deleted_at: {
                type: DataTypes.DATE,
                allowNull: true,
            },
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

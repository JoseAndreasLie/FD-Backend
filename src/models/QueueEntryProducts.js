'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class QueueEntryProducts extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            QueueEntryProducts.belongsTo(models.queue_entries, {
                foreignKey: 'queue_entry_id',
                as: 'queue_entry',
            });
            QueueEntryProducts.belongsTo(models.products, {
                foreignKey: 'product_id',
                as: 'product',  
            });
        }
    }
    QueueEntryProducts.init(
        {
            queue_entry_id: DataTypes.UUID,
            product_id: DataTypes.UUID,
            quantity: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: 'queue_entry_products',
            underscored: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            deletedAt: 'deleted_at',
        }
    );
    return QueueEntryProducts;
};

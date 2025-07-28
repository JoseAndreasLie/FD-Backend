'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class QueueEntries extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            QueueEntries.belongsToMany(models.products, {
                through: models.queue_entry_products,
                foreignKey: 'queue_entry_id',
                otherKey: 'product_id',
                as: 'products',
            })
            QueueEntries.belongsTo(models.flashsales, {
                foreignKey: 'flashsale_id',
                as: 'flashsale',
            });
        }
    }
    QueueEntries.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4, 
                primaryKey: true,
                allowNull: false,
            },
            device_id: DataTypes.STRING,
            booth_id: DataTypes.UUIDV4,
            flashsale_id: DataTypes.UUIDV4,
            ticket_code: DataTypes.STRING,
            queue_number: DataTypes.INTEGER,
            join_time: DataTypes.DATE,
            called_time: DataTypes.DATE,
            served_time: DataTypes.DATE,
            status: DataTypes.STRING,
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
            modelName: 'queue_entries',
            underscored: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            deletedAt: 'deleted_at',
        }
    );
    return QueueEntries;
};

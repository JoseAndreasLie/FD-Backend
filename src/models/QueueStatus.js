'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class QueueStatuses extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
        // define association here
        }
    }
    QueueStatuses.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4, 
                primaryKey: true,
                allowNull: false,
            },
            booth_id: DataTypes.UUIDV4,
            flashsale_id: DataTypes.UUIDV4,
            current_queue_number: DataTypes.INTEGER,
            is_active: DataTypes.BOOLEAN,
        },
        {
            sequelize,
            modelName: 'queue_statuses',
            underscored: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            deletedAt: 'deleted_at',
        }
    );
    return QueueStatuses;
};

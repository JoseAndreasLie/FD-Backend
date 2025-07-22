'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class QueueEntry extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    QueueEntry.init(
        {
            device_id: DataTypes.STRING,
            booth_id: DataTypes.UUIDV4,
            ticket_code: DataTypes.STRING,
            queue_number: DataTypes.INTEGER,
            join_time: DataTypes.DATE,
            called_time: DataTypes.DATE,
            served_time: DataTypes.DATE,
            status: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: 'queue_entry',
            underscored: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            deletedAt: 'deleted_at',
        }
    );
    return QueueEntry;
};

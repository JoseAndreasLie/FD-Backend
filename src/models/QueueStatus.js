'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class QueueStatus extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    QueueStatus.init(
        {
            booth_id: DataTypes.STRING,
            current_queue_number: DataTypes.INTEGER,
            is_active: DataTypes.BOOLEAN,
        },
        {
            sequelize,
            modelName: 'queue_status',
            underscored: true,
        }
    );
    return QueueStatus;
};

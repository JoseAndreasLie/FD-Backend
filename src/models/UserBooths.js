'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class UserBooths extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            // UserBooths.belongsTo(models.users, {
            //     foreignKey: 'user_id',
            //     as: 'user',
            // });
            // UserBooths.belongsTo(models.booths, {
            //     foreignKey: 'booth_id',
            //     as: 'booth',
            // });
        }
    }
    UserBooths.init(
        {
            user_id: DataTypes.UUID,
            booth_id: DataTypes.UUID,
        },
        {
            sequelize,
            modelName: 'user_booths',
            underscored: true,
        }
    );
    return UserBooths;
};

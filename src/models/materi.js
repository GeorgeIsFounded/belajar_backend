'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class materi extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  materi.init(
    {
      userId: DataTypes.INTEGER,
      materi: DataTypes.TEXT,
      mapel: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'materi',
    }
  );
  return materi;
};

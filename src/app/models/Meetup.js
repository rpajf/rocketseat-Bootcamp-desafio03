import Sequelize, { Model } from 'sequelize';
import { isBefore, subDays } from 'date-fns';

class Meetup extends Model {
  static init(sequelize) {
    super.init(
      {
        title: Sequelize.STRING,
        description: Sequelize.STRING,
        localization: Sequelize.STRING,

        date: Sequelize.DATE,

        cancelable: {
          type: Sequelize.VIRTUAL,
          get() {
            return isBefore(new Date(), subDays(this.date, 3));
          },
        },
      },

      {
        sequelize,
      }
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.File, { foreignKey: 'file_id' });
    this.belongsTo(models.User, { foreignKey: 'user_id' });
  }
}

export default Meetup;

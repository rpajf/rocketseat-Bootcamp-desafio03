import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs';

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        // chamando o metodo init de model
        name: Sequelize.STRING,
        password: Sequelize.VIRTUAL, // n vai existir na base de dados
        email: Sequelize.STRING,
        password_hash: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );
    this.addHook('beforeSave', async user => {
      if (user.password) {
        user.password_hash = await bcrypt.hash(user.password, 8);
      }
    });

    return this; //retorno do model
  }


  checkPassword(password) {
    return bcrypt.compare(password, this.password_hash);
  }
}
export default User;

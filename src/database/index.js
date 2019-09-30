/* arquivo que vai realizar conexao com db e carregar models
 */
import Sequelize from 'sequelize';
import User from '../app/models/User';
import Meetup from '../app/models/Meetup';
import File from '../app/models/File';

import databaseConfig from '../config/database';
const models = [User, File, Meetup];

class Database {
  constructor() {
    this.init();
  }
  init() {
    this.connection = new Sequelize(databaseConfig);
    models
      .forEach(model => model.init(this.connection))
  }
}

export default new Database();

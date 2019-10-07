import Meetup from '../models/Meetup';

class OrganizingController {
  async index(req, res) {
    //Listar apenas meetups criadas pelo usuario logado
    const meetups = await Meetup.findAll({ where: { user_id: req.userId } });

    return res.json(meetups);
  }
}

export default new OrganizingController();

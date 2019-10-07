import * as Yup from 'yup';

import { Op } from 'sequelize';
import { startOfDay, endOfDay, parseISO, isBefore, subDays } from 'date-fns';
import Meetup from '../models/Meetup';
import User from '../models/User';

class MeetupController {
  async index(req, res) {
    const { date } = req.query;
    const { page = 1 } = req.query;

    if (!date) {
      return res.status(400).json({ error: 'Data not provided' });
    }

    const searchDate = parseISO(date);

    const meetups = await Meetup.findAll({
      where: {
        date: { [Op.between]: [startOfDay(searchDate), endOfDay(searchDate)] },
      },
      include: [{ model: User, attributes: ['id', 'name'] }],

      limit: 10,
      offset: 10 * page - 10,
    });

    return res.json(meetups);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      description: Yup.string().required(),
      localization: Yup.string().required(),
      file_id: Yup.number().required(),
      date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }
    const { title, description, localization, file_id, date } = req.body;
    const user_id = req.userId;

    const dayStart = startOfDay(parseISO(date));
    if (isBefore(dayStart, new Date())) {
      return res
        .status(400)
        .json({ error: 'Cannot create a meetup in past dates' });
    }

    const meetup = await Meetup.create({
      title,
      description,
      localization,
      file_id,
      date,
      user_id,
    });
    console.log(user_id);

    return res.json(meetup);
  }
  async update(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      description: Yup.string().required(),
      localization: Yup.string().required(),
      file_id: Yup.number().required(),
      date: Yup.date().required(),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }
    const user_id = req.userId;

    const meetup = await Meetup.findByPk(req.params.id);

    if (meetup.user_id != user_id) {
      return res.status(401).json({ error: 'User unauthorized' });
    }

    const {
      title,
      description,
      localization,
      file_id,
      date,
    } = await meetup.update(req.body);

    const dayStart = startOfDay(parseISO(req.body.date));
    if (isBefore(dayStart, new Date())) {
      return res
        .status(400)
        .json({ error: 'Cannot edit a meetup in past dates' });
    }

    return res.json(meetup);
  }
  async delete(req, res) {
    const meetup = await Meetup.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ['id'],
        },
      ],
    });
    if (meetup.user_id !== req.userId) {
      return res.status(401).json({
        error: "You don't have permission to cancel this meetup",
      });
    }

    const dateWithSub = subDays(meetup.date, 3);
    if (isBefore(dateWithSub, new Date())) {
      return res.status(401).json({
        error: 'You can only delete meetups 3 days before.',
      });
    }

    await meetup.destroy();

    return res.send();
  }
}

export default new MeetupController();

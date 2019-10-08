import { Op } from 'sequelize';
import { isBefore } from 'date-fns';
import Subscription from '../models/Subscription';

import User from '../models/User';
import Meetup from '../models/Meetup';

class SubscriptionController {
  async index(req, res) {
    const subscriptions = await Subscription.findAll({
      where: {
        user_id: req.userId,
      },
      include: [
        {
          model: Meetup,
          where: {
            date: {
              [Op.gt]: new Date(),
            },
          },
          required: true,
        },
      ],
      order: [[Meetup, 'date']],
    });

    return res.json(subscriptions);
  }

  async store(req, res) {
    const meetup = await Meetup.findByPk(req.params.meetupId)


    if (meetup.user_id === req.userId) {
      return res
        .status(400)
        .json({ error: "Can't subscribe to you own meetups" });
    }
    const checkPossibility = await Subscription.findOne({
      where: {user_id: req.userId},
      include: [{
        model: Meetup,
        required: true,
        where: {
          date: meetup.date
        }
      }]
    })

    if (checkPossibility) {
      return res.status(400).json({ error: "Already subscribed to this date" });
    }



    const subscription = await Subscription.create({
      user_id: req.userId,
      meetup_id: meetup.id,
    });


    return res.json(subscription);
  }
}

export default new SubscriptionController();

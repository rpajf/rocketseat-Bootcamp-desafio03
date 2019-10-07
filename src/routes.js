import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import MeetupController from './app/controllers/MeetupController';
import authMiddleware from './app/middlewares/auth';
import FileController from './app/controllers/FileController';
import SubscriptionController from './app/controllers/SubscriptionController';
import OrganizingController from './app/controllers/OrganizingController';
const routes = new Router();
const upload = multer(multerConfig);

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);
routes.post('/files', upload.single('file'), FileController.store);


routes.use(authMiddleware);
routes.get('/meetups', MeetupController.index);
routes.post('/meetups', MeetupController.store);
routes.put('/users', UserController.update);
routes.put('/meetups/:id', MeetupController.update);

routes.get('/organizing', OrganizingController.index);
routes.get('/subscriptions', SubscriptionController.index);
routes.delete('/meetups/:id', MeetupController.delete);


routes.post('/meetups/:meetupId/subscription', SubscriptionController.store);


export default routes;

import { Router } from 'express';
import { usersController } from './users.controller';

const usersRouter = Router();

usersRouter.get('/', usersController.findAll);
usersRouter.get('/:id', usersController.findById);
usersRouter.post('/', usersController.create);
usersRouter.put('/:id', usersController.update);
usersRouter.delete('/:id', usersController.delete);

export default usersRouter;

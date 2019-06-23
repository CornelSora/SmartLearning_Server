import { Router } from 'express';
import HttpStatus from 'http-status-codes';
import * as userService from '../services/userService';
import * as invitationService from '../services/invitationService';

const router = Router();

/**
 * POST /api/account/login
 */
router.post('/login', (req, res, next) => {
  userService
    .login(req.body)
    .then(data => res.status(HttpStatus.ACCEPTED).send(data))
    .catch(err => res.status(HttpStatus.BAD_REQUEST).send(err));
});

/**
 * POST /api/account/register
 */
router.post('/register', (req, res, next) => {
  userService
    .createUser(req.body)
    .then(data => res.status(HttpStatus.CREATED).send(data))
    .catch(err => res.status(HttpStatus.BAD_REQUEST).send(err));
});

router.post('/updateInvitation', (req, res, next) => {
  invitationService
    .updateInvitation(req.body)
    .then(data => res.status(HttpStatus.OK).send(data))
    .catch(err => {
      res.status(HttpStatus.BAD_REQUEST).send(err);
    });
});

router.get('/:id', (req, res, next) => {
  userService
    .getUserByFireabseUID(req.params.id)
    .then(data => res.status(HttpStatus.CREATED).send(data))
    .catch(err => next(err));
});

export default router;

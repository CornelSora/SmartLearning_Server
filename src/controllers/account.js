import { Router } from 'express';
import HttpStatus from 'http-status-codes';
import * as userService from '../services/userService';

const router = Router();

/**
 * POST /api/account/login
 */
router.post('/login', (req, res, next) => {
  userService
    .login(req.body)
    .then(data => res.status(HttpStatus.ACCEPTED))
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

export default router;

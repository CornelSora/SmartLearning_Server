import { Router } from 'express';
import HttpStatus from 'http-status-codes';
import * as emailService from '../services/emailService';
import * as userService from '../services/userService';

const router = Router();

/**
 * GET /api/users
 */
router.post('/send', (req, res, next) => {
  emailService
    .sendEmailTo(req.body.email, req.body.problem)
    .then(data => {
      data.problem = req.body.problem;
      data.invitedBy = req.body.invitedBy;
      userService.addInvitation(data);
      res.send(data);
    })
    .catch(err => {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(err);
    });
});

router.post('/isTokenValid', (req, res, next) => {
  userService
    .isTokenValid(req.body.token)
    .then(data => res.send(data))
    .catch(err => {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(err);
    });
});

export default router;

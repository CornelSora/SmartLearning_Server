import { Router } from 'express';
import HttpStatus from 'http-status-codes';
import * as emailService from '../services/emailService';
// import * as userService from '../services/userService';
import * as invitationService from '../services/invitationService';

const router = Router();

/**
 * GET /api/emails
 */
router.post('/send', (req, res, next) => {
  emailService
    .sendEmailTo(req.body.email, req.body.problem)
    .then(data => {
      data.problem = req.body.problem;
      data.invitedBy = req.body.invitedBy;
      invitationService.addInvitation(data);
      res.send(data);
    })
    .catch(err => {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(err);
    });
});

router.get('/invitations/:email', (req, res, next) => {
  invitationService
    .getInvitations(req.params.email)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(err);
    });
});

router.post('/isTokenValid', (req, res, next) => {
  invitationService
    .isTokenValid(req.body.token)
    .then(data => res.send(data))
    .catch(err => {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(err);
    });
});

export default router;

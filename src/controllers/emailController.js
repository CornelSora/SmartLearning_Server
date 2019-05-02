import { Router } from 'express';
import HttpStatus from 'http-status-codes';
import * as emailService from '../services/emailService';

const router = Router();

/**
 * GET /api/users
 */
router.post('/send', (req, res, next) => {
  emailService
    .sendEmailTo(req.body.email)
    .then(data => res.send(data))
    .catch(err => {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(err);
    });
});

export default router;

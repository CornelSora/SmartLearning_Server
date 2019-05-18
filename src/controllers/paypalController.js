import { Router } from 'express';
import HttpStatus from 'http-status-codes';
import * as paypalService from '../services/paypalService';

const router = Router();

router.get('/pay', (req, res, next) => {
  paypalService
    .pay()
    .then(data => res.send(data))
    .catch(err => {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(err);
  });
});

export default router;

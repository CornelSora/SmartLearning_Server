import { Router } from 'express';
import HttpStatus from 'http-status-codes';
import * as paypalService from '../services/paypalService';
import * as userService from '../services/userService';

const router = Router();

router.get('/pay', (req, res, next) => {
  paypalService
    .pay()
    .then(async data => {
      await userService.updateUserPaymentID(req.userID, data.paymentId);
      res.send(data.url);
    })
    .catch(err => {
      // TO DO: ADD LOGGER
      console.log(err);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(err);
    });
});

export default router;

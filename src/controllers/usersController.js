import { Router } from 'express';
import HttpStatus from 'http-status-codes';
import * as userService from '../services/userService';
import { findUser, userValidator } from '../validators/userValidator';

const router = Router();

/**
 * GET /api/users
 */
router.get('/', (req, res, next) => {
  userService
    .getAllUsers()
    .then(data => res.send(data))
    .catch(err => {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(err);
    });
});

/**
 * GET /api/users/:id
 */
router.get('/:id', (req, res, next) => {
  userService
    .getUser(req.params.id)
    .then(data => res.send(data))
    .catch(err => next(err));
});

/**
 * POST /api/users
 */
router.post('/', (req, res, next) => {
  userService
    .createUser(req.body)
    .then(data => res.status(HttpStatus.CREATED).send(data))
    .catch(err => next(err));
});


/**
 * PUT /api/users/updatestatus
 */
router.put('/updatestatus', (req, res, next) => {
  userService
    .updateUserStatus(req.body.userID, req.body.paymentId)
    .then(data => res.status(HttpStatus.CREATED).send(data))
    .catch(err => next(err));
})

/**
 * POST /api/users/clients
 */
router.post('/clients', (req, res, next) => {
  userService
    .addNewClient(req.body)
    .then(data => res.send(data))
    .catch(err => res.status(HttpStatus.BAD_REQUEST).send(err.toString()));
});

/**
 * GET /api/users/clients
 */
router.get('/clients/:id', (req, res, next) => {
  userService
    .getClients(req.params.id)
    .then(data => res.status(HttpStatus.CREATED).send(data))
    .catch(err => res.status(HttpStatus.BAD_REQUEST).send(err.toString()));
});

/**
 * PUT /api/users/:id
 */
router.put('/:id', findUser, userValidator, (req, res, next) => {
  userService
    .updateUser(req.params.id, req.body)
    .then(data => res.json({ data }))
    .catch(err => next(err));
});

/**
 * DELETE /api/users/:id
 */
router.delete('/:id', findUser, (req, res, next) => {
  userService
    .deleteUser(req.params.id)
    .then(data => res.status(HttpStatus.NO_CONTENT).json({ data }))
    .catch(err => next(err));
});

export default router;

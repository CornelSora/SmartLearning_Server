import { Router } from 'express';
import HttpStatus from 'http-status-codes';
import * as codeforcesService from '../services/codeforcesService.js';

const router = Router();

/**
 * GET /api/codeforces
 */
router.get('/', (req, res, next) => {
  codeforcesService
    .getAllProblems()
    .then(data => res.status(HttpStatus.OK).send(data))
    .catch(err => res.status(HttpStatus.BAD_REQUEST).send(err));
});

/**
 * GET /api/codeforces/:problemID/:userID
 */
router.get('/:problemID/:userID', (req, res, next) => {
  codeforcesService
    .getProblem(req.params.problemID, req.params.userID)
    .then(data => res.status(HttpStatus.OK).send(data))
    .catch(err => res.status(HttpStatus.BAD_REQUEST).send(err));
});

export default router;

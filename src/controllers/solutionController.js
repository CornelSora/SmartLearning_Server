import { Router } from 'express';
import HttpStatus from 'http-status-codes';
import * as problemService from '../services/problemService';

const router = Router();

/**
 * POST /api/problems
 */
router.post('/', (req, res, next) => {
  problemService
    .saveProblemSolution(req.body.problemID, req.body.userID, req.body.solution)
    .then(data => res.status(HttpStatus.ACCEPTED).send(data))
    .catch(err => res.status(HttpStatus.BAD_REQUEST).send(err));
});

export default router;

import { Router } from 'express';
import HttpStatus from 'http-status-codes';
import * as problemService from '../services/problemService';

const router = Router();

/**
 * GET /api/problems
 */

router.get('/', (req, res, next) => {
  problemService
    .getAllProblems()
    .then(data => res.status(HttpStatus.OK).send(data))
    .catch(err => res.status(HttpStatus.BAD_REQUEST).send(err));
});

/**
 * POST /api/problems
 */
router.post('/', (req, res, next) => {
  problemService
    .createProblem(req.body)
    .then(data => res.status(HttpStatus.ACCEPTED).send(data))
    .catch(err => res.status(HttpStatus.BAD_REQUEST).send(err));
});

/**
 * DELETE /api/problems/:id
 */
router.delete('/problems/:id', (req, res) => {
  problemService
    .deleteProblem(req.params.id)
    .then(() => res.status(HttpStatus.OK).send())
    .catch(err => res.status(HttpStatus.BAD_REQUEST).send(err));
});

export default router;

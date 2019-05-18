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
 * GET /api/problems/:problemID/:userID
 */
router.get('/:problemID/:userID', (req, res, next) => {
  problemService
    .getProblem(req.params.problemID, req.params.userID)
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
    .catch(err => {
      res.status(HttpStatus.BAD_REQUEST).send(err.toString());
    });
});

// router.get('/daily-problem', (req, res) => {
//   problemService
//     .getDailyProblem()
//     .then(data => res.status(HttpStatus.OK).send(data))
//     .catch(err => {
//       res.status(HttpStatus.BAD_REQUEST).send(err.toString())
//       console.log(err.toString())
//     });
// })

export default router;

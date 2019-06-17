import { Router } from 'express';
import swaggerSpec from './utils/swagger';
import usersController from './controllers/usersController';
import accountController from './controllers/accountController';
import problemsController from './controllers/problemsController';
import solutionController from './controllers/solutionController';
import emailController from './controllers/emailController';
import paypalController from './controllers/paypalController';
import * as firebaseMiddleware from 'express-firebase-middleware';

/**
 * Contains all API routes for the application.
 */
let router = Router();

/**
 * GET /api/swagger.json
 */
router.get('/swagger.json', (req, res) => {
  res.json(swaggerSpec);
});

/**
 * @swagger
 * definitions:
 *   App:
 *     title: App
 *     type: object
 *     properties:
 *       app:
 *         type: string
 *       apiVersion:
 *         type: string
 */

/**
 * @swagger
 * /:
 *   get:
 *     summary: Get API version
 *     description: App version
 *     produces:
 *       - application/json
 *     tags:
 *       - Base
 *     responses:
 *       200:
 *         description: Application and API version
 *         schema:
 *           title: Users
 *           type: object
 *           $ref: '#/definitions/App'
 */
router.get('/', (req, res) => {
  res.json({
    app: req.app.locals.title,
    apiVersion: req.app.locals.version
  });
});

router.use('/users', firebaseMiddleware.auth, usersController);
router.use('/account', accountController);
router.use('/problems', firebaseMiddleware.auth, problemsController);
router.use('/solutions', firebaseMiddleware.auth, solutionController);
router.use('/emails', firebaseMiddleware.auth, emailController);
router.use('/paypal', firebaseMiddleware.auth, paypalController);
export default router;

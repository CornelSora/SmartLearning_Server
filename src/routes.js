import { Router } from 'express';
import swaggerSpec from './utils/swagger';
import usersController from './controllers/usersController';
import accountController from './controllers/accountController';
import problemsController from './controllers/problemsController';
import solutionController from './controllers/solutionController';
import emailController from './controllers/emailController';
import paypalController from './controllers/paypalController';
import codeforcesController from './controllers/codeforcesController';
import firebase from 'firebase-admin';

const FBAuth = (req, res, next) => {
  try {
    let idToken;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      idToken = req.headers.authorization.split('Bearer ')[1];
    } else {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    firebase
      .auth()
      .verifyIdToken(idToken)
      .then(data => {
        req.userID = data.user_id;
        next();
      })
      .catch(err => {
        return res.status(403).json({ error: err });
      });
  } catch (e) {}
};

//  app.use(FBAuth);
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

router.use('/users', usersController);
router.use('/account', accountController);
router.use('/problems', FBAuth, problemsController);
router.use('/solutions', FBAuth, solutionController);
router.use('/emails', FBAuth, emailController);
router.use('/paypal', FBAuth, paypalController);
router.use('/codeforces', codeforcesController);
export default router;

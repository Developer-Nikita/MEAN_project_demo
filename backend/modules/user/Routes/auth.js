const express = require('express'),
  authRouter = express.Router();

const AuthController = require('../controllers/AuthController');

authRouter.post('/signup', AuthController.signUp);
authRouter.post('/login', AuthController.login);
authRouter.get('/fetchNote', AuthController.fetchNote);  // user wise fetch note
authRouter.post('/addNote', AuthController.addNote);
authRouter.put('/editNote', AuthController.editNote);
authRouter.get('/getNote/:id', AuthController.getNote); //fetch single note
authRouter.post('/deleteNote', AuthController.deleteNote);


module.exports = authRouter;
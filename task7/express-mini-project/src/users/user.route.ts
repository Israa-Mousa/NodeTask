import { Router } from 'express';
import { UserController } from './user.controller';
import { isAuthenticated } from '../shared/middlewares/auth.middleware';
 // Assume we have auth middleware

console.log('UserController',UserController);
const router = Router();
const userController = new UserController();

///router.use(isAuthenticated);  
//extra route to get current user details
router.get('/', userController.getUsers);
router.post('/', userController.createUser);
router.delete('/:id', userController.deleteUser);
//task route neeeds to be authenticated
router.get('/me', isAuthenticated, userController.getCurrentUser); 

router.put('/me', isAuthenticated, userController.updateUser);     
router.post('/coach', isAuthenticated,userController.createCoachUser); 

export const userRouter = router;

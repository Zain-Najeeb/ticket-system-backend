import { Router } from 'express';
import { Login, CheckSession, Signup, Logout } from '../controllers/auth';

const router = Router();

router.post('/logout', Logout); 
router.post('/signup', Signup);
router.post('/login', Login); 
router.get('/check-session', CheckSession);

export default router; 
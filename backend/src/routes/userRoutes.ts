import { Router } from 'express';
import {
    getUsers, createUser, updateUser, deleteUser,
    updateByUser,
    loginUser,
    checkUser,
} from '../controllers/userController';

const router = Router();

router.get('/', getUsers);
router.post('/', createUser);
router.put('/:id', updateUser);
router.put('/byuser/:id', updateByUser);
router.delete('/:id', deleteUser);

// login
router.post('/login', loginUser);
router.post('/checkuser', checkUser);

export default router;

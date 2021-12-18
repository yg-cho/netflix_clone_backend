import express, { Request, Response } from "express";
import { User } from '../model'
import { onCreateUser, loginUser } from '../controller/user'
const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
    return res.json({
        success: true,
        data: 'Welcome! backend'
    })
})


router.post('/signup', onCreateUser)
router.post('/signin', loginUser)


export default router;
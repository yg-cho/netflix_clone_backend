import { Response, Request} from 'express'
import { User } from '../model'


const onCreateUser = async (req: Request, res: Response) => {
    try {
        console.log(req.body);
        await User.createUser(req.body);
        return res.json({
            success: true
        })
    } catch (err: any) {
        console.log(err);
        return res.status(400).json({
            success: false,
            error: err.message
        })
    }
}

const loginUser = async ( req: Request, res: Response) => {
    try {
        // console.log("",req.body)
        await User.loginUser(req.body);
        // console.log(res)
        // console.log(res.data)
        return

    } catch (err: any){
        // console.log(err);
        return res.status(400).json({
            success: false,
            error: err.message
        })
    }
}
// const onSignIn = async (req: Request, res: Response) => {
//     try{
//         console.log(req.body);
//         await
//     }
// }

export { onCreateUser, loginUser }
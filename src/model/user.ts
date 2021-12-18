import { Document, Model, model, Schema } from 'mongoose';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import {Response} from "express";

type Profile = {
    name: string;
    avatar: string;
}

export interface User {
    email: string;
    phone: string;
    password: string;
    profiles: Array<Profile>;
}

export interface UserDocument extends User, Document {}

export interface UserModel extends Model<UserDocument> {
    createUser(userDetails: User): Promise<UserDocument>;
    loginUser(userDetails: User): Promise<UserDocument>;
}


const userSchema = new Schema<UserDocument>(
    {
        email: {
            type: String,
            required: true,
            unique: true
        },
        phone: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        profiles: [
            {
                name: {
                  type: String
                },
                avatar: {
                  type: String
                }
            }
        ]
    },
    { timestamps: true }

)

userSchema.statics.createUser = async function(this: Model<UserDocument>, userDetails: User) {
    try {
        const hash = await bcrypt.hash(userDetails.password, 10);
        userDetails.password = hash;
        return await this.create(userDetails);
    } catch (error) {
        throw error;
    }
}

userSchema.statics.loginUser = async function(this: Model<UserDocument>, userDetails: User, res: Response){
    try {
        const email = userDetails.email;
        const password = await bcrypt.hash(userDetails.password, 10);
        console.log("email : ", userDetails.email);
        console.log("hashPw : ",password)
        const result = this.findOne({email:userDetails.email})
            .then(user => {
                if(!user){
                    // console.log("cannot find email, check your email")
                    return res.json({ message : "cannot find email, check your email"})
                } else {
                    console.log("password: ", userDetails.password, "hashPassword: ", user.password)
                    bcrypt.compare(userDetails.password, user.password, (err, result) => {
                        if(err || result === false){
                            return res.json({
                                message : "password Incorrect"
                            });
                        } else {
                            const token = jwt.sign({
                                email: user.email
                            },
                                process.env.SECRET_KEY,
                                {expiresIn : "1h"}
                            )
                            return {
                                message: "Auth sucessful",
                                tokenInfo : "bearer :" + token
                            }
                        }
                    })
                    console.log("find email : ", email)
                    return { message : "find email"}

                }
            })
            .catch(err => {
                console.log(err)
                return { message : "find err, check your information", error: err}
            })
        // const a = this.findOne({email})
            // .then(user => {
            //     if(!user) {
            //         return { message : "email not found" }
            //
            //     } else {
            //         bcrypt.compare(password, userDetails.password, (err : any, result : boolean) =>{
            //             if(err || result === false){
            //                 return { message: "password incorrect" }
            //             } else {
            //                 const token = jwt.sign(
            //                     {
            //                         email: userDetails.email,
            //                     },
            //                     process.env.SECRET_KEY, { expiresIn: "1h"}
            //                 );
            //                 return {
            //                     message: "Auth successful",
            //                     tokenInfo: "bearer :"+ token
            //                 }
            //             }
            //         })
            //     }
            // })

    } catch(error) {
        throw error;
    }
}


export default model<UserDocument, UserModel>('User', userSchema)
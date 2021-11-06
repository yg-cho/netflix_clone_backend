import { Document, Model, model, Schema } from 'mongoose';
import * as bcrypt from 'bcrypt';

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



export default model<UserDocument, UserModel>('User', userSchema)
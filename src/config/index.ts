import mongoose from 'mongoose';


mongoose.connection.on('connected', () => {
    console.log('DB connected..');
})

mongoose.connection.on('reconnected', () => {
    console.log('DB reconnected..');
})

mongoose.connection.on('error', (error) => {
    console.log('DB connection error..', error);
    mongoose.disconnect();
})

mongoose.connection.on('disconnected', () => {
    console.log('DB disconnected..');
})

const connectDb = () => {
    return mongoose.connect(process.env.DATABASE_URL!
    //     {
    //     useCreateIndex: true,
    //     useNewUrlParser: true,
    //
    // }
    )
}

export { connectDb };
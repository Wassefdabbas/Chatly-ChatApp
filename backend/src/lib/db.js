import mongoose from 'mongoose'

export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URL)
        console.log(`Connected to MongoDB...`)
    } catch (error) {
        console.log("Error in Connection to MongoDB : ", error);
        process.exit(1); // 1 for failure
    }
}
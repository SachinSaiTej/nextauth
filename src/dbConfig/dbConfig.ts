import mongoose from "mongoose";

export async function connect() {
    try {
        await mongoose.connect(process.env.MONGO_URL!);

        const connection = mongoose.connection;

        connection.on("connected", () => {
            console.log("Connected to MongoDB");
        })

        connection.on("error", (error) => {
            console.log("MongoDB connection error. Please make sure MongoDB is running.", error);
            process.exit();
        })

    } catch (error) {
        console.log("Something went wrong in connecting to DB");
        console.log(error);
    }
}
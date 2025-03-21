const mongoose = require("mongoose")

module.exports = async () =>{
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("Connect to MongoDB wpwo 😂😂😂");
    } catch (error) {
        console.log("Connection Failed To MongoDB !",error)
}
}
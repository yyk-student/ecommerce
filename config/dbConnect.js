const { default: mongoose } = require("mongoose")

const dbConnect = () => {
    try {
        const conn = mongoose.connect(process.env.MONGODB_URL);
        console.log("Db connected successfully");
    } catch (error) {
        console.log("DB conn error");
    }
    
}

module.exports=dbConnect;
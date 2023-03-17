const mongoose = require('mongoose')
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(
            'mongodb+srv://maximcebanu:Xmvr62hNxg45Sjk@cluster0.wynrw.mongodb.net/buglogger?retryWrites=true&w=majority'
        )
        console.log('MongoDB Connected...')
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}

module.exports = connectDB
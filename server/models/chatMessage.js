import mongoose from "mongoose";

const messageSchema = mongoose.Schema({
    message:String,
    from: String
})

export default mongoose.model('chatMessage', messageSchema)
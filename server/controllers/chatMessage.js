import chatMessage from "../models/chatMessage.js";

const chatController = {
    // SAVE MESSAGES IN DB
    saveChatMessages:(req,res) => {
        const params = req.body
        const message = new chatMessage()
        message.message = params.message
        message.from = params.from

        message.save((error, messageStored) => {
            if(error || !messageStored) {
                return res.status(404).send({
                status: "error",
                message:" No se pudo guardar el mensaje"})
            }

            return res.status(200).send({
                status: "success",
                messageStored
            })
        })
    },

    // GET MESSAGES FROM DB

    getChatMessages: (req,res) => {
        const query = Message.find({})
        query.sort('-_id').exec((error, messages) => {
            if(error){
                return res.status(500).send({
                    status:'Error',
                    message: 'Error al obtener los mensajes'
                })
            }
            if(!messages) {
                return res.status(404).send({
                    status:'Error',
                    message: 'No Hay mensajes para mostrar'
                })
            }

            return res.status(200).send({
                status:'Success',
                messages
            })
        })
    }
}



export default chatController
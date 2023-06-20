import  {
    Box,
    Button,
    useTheme,
    InputBase, 
} from "@mui/material";

import WidgetWrapper from "../../components/WidgetWrapper";
import { useState, useEffect, useContext, useRef} from "react";
import { useSelector, } from "react-redux";
import { SocketContext } from "context/socket";
import ReactScrollableFeed from 'react-scrollable-feed'


const Chatroom =() => {
const user = useSelector((state) => state.user);
const [chatMessage, setChatMessage] = useState("");
const [chatMessages, setChatMessages] = useState([])
const [isChatConnected, setIsChatConnected] = useState(true)
const socket = useContext(SocketContext);
const {palette} = useTheme()
const usuario = user.firstName
const [connectedUsers, setConnectedUsers] = useState(0)

useEffect(()=> {
    socket.on("broadcastMessages", (message)=> {    
        setChatMessages((list)=> [...list, message])
    })
    socket.on("usersConnected", (usuariosConectados) => {
    setConnectedUsers(usuariosConectados)
    console.log("usuarios conectados:" + usuariosConectados)
    })
}, [socket])

useEffect(()=>{
socket.connect({usuario})
}, [])

// Habilitar Funciones Chat
const joinChat =  () => {
    setIsChatConnected(true)
    if (socket.connected === false) {socket.connect()}
    }  

//Enviar Mensajes
const sendMessage = ()=> {  
    socket.emit('chatMessage', 
    {
    from: usuario,
    message: chatMessage
    })
    setChatMessage("")
      }

const disconnectChat = () => {
setIsChatConnected(false)
socket.on("disconnect", socket)
}


return (
    <WidgetWrapper
    padding="0.2rem">
       {/* CHAT HEADER */}
        <Box
        display="flex"
        flex-direction="row"
        justifyContent="space-around"
        mb="0.1rem"
        padding="0.2rem"        
        > 
            <h4> Sala de Chat</h4>           
            <Box>
              {
              isChatConnected === false ? 
              <Button onClick={joinChat}>Join Chat</Button> : 
              <Button onClick={disconnectChat}>Disconnect</Button>
              }                              
            </Box>
        </Box>
        <Box 
        margin="0.2rem"
        padding="0.2rem">
             {isChatConnected === true &&
            <h5>Usuarios Conectados: {connectedUsers} </h5>}
        </Box>
        {/* CHAT BODY */}
       <Box 
       height="400px"
       borderRadius="0.75rem"
       backgroundColor={palette.neutral.light}  
       padding= "5px"
       mb= "10px"    
       >
       <ReactScrollableFeed>
            {chatMessages.map((message, i)=> {
            return (
            <div key={i}>{message.from === usuario ? <h4 style={{color:palette.neutral.dark, display:"inline"}}> You </h4> :<h4 style={{color:"red", display:"inline"}}>{message.from} </h4> } : {message.message}</div>
                )
            })}
        </ReactScrollableFeed>
            
        </Box>
        {/* CHAT FOOTER */}
        <Box
        height="10%" 
        display="flex"
        alignItems="center"
        padding="5px"
        justifyContent="space-around">
            <Box width="90%">
              <InputBase
                sx={{
                backgroundColor:palette.neutral.light,
                color: palette.neutral.dark,
                padding:"5px",
                borderRadius:"3px",
                width:"80%"
                }}
            onChange={(e) => setChatMessage(e.target.value)}
            value={chatMessage}
            placeholder={isChatConnected === false ? "Click Join Chat..." : "..."}
            disabled={isChatConnected === false}
            onKeyPress={(e) => {
                e.key === "Enter" && sendMessage()
            }}
             />
             </Box>
            <Box >
                <Button
                sx={{backgroundColor:"green"}}
                onClick={sendMessage}
                disabled={isChatConnected === false || chatMessage == ""}
                >send</Button>
            </Box>
            
        </Box>
         
        
    </WidgetWrapper>
)
}

export default Chatroom
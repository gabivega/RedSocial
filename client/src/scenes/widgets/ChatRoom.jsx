import {
  Box,
  Button,
  useTheme,
  InputBase,
  IconButton,
  TextField,
  Typography,
  Divider,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import WidgetWrapper from "../../components/WidgetWrapper";
import { useState, useEffect, useContext, useRef } from "react";
import { useSelector } from "react-redux";
import { SocketContext } from "context/socket";
import ReactScrollableFeed from "react-scrollable-feed";

const Chatroom = () => {
  const user = useSelector((state) => state.user);
  const [previousMessages, setPreviousMessages] = useState([]);
  const [chatMessage, setChatMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [isChatConnected, setIsChatConnected] = useState(true);
  const socket = useContext(SocketContext);
  const { palette } = useTheme();
  const usuario = user.firstName;
  const [connectedUsers, setConnectedUsers] = useState(0);

  useEffect(() => {
    socket.connect({ usuario });
    socket.on("getPrevMessages", (prevMessages) => {
      setPreviousMessages(prevMessages);
    });
    socket.on("broadcastMessages", (message) => {
      setChatMessages((list) => [...list, message]);
    });
    socket.on("usersConnected", (usuariosConectados) => {
      setConnectedUsers(usuariosConectados);
      //  console.log("usuarios conectados:" + usuariosConectados)
    });
  }, [socket]);

  // useEffect(()=>{
  // socket.connect({usuario})
  // }, [])

  // Habilitar Funciones Chat
  const joinChat = () => {
    socket.connect({ usuario });
    setIsChatConnected(true);
    if (socket.connected === false) {
      socket.connect();
    }
  };

  //Enviar Mensajes
  const inputRef = useRef();

  const sendMessage = () => {
    socket.emit("chatMessage", {
      from: usuario,
      message: chatMessage,
    });
    setChatMessage("");
    inputRef.current.focus();
  };

  const disconnectChat = () => {
    setIsChatConnected(false);
    socket.on("disconnect", socket);
  };

  return (
    <WidgetWrapper>
      {/* CHAT HEADER */}
      <Box sx={{ display: "flex", flexDirection: "column", mb: "0.2rem" }}>
        <h3
          style={{ textAlign: "center", padding: "0.1rem", margin: "0.1rem" }}
        >
          {" "}
          ChatRoom
        </h3>
        <h6 style={{ padding: "0.1rem", margin: "0.1rem" }}>
          Online Users: {connectedUsers}{" "}
        </h6>
        {/* <Box>
              {
              isChatConnected === false ? 
              <Button onClick={joinChat}>Join Chat</Button> : 
              <Button onClick={disconnectChat}>Leave Chat</Button>
              }                              
            </Box> */}
      </Box>
      {/* <Box 
        margin="0.2rem"
        padding="0.2rem">
            
          { /* {isChatConnected === true &&
            <h5>Online Users: {connectedUsers} </h5>} }
        </Box> */}
      {/* CHAT BODY */}
      <Box
        height="400px"
        maxWidth={"200px"}
        borderRadius="0.75rem"
        backgroundColor={palette.neutral.light}
        padding="5px"
        mb="10px"
        //sx={{overflow-x : "hidden" }}
      >
        <ReactScrollableFeed sx={{ padding: "0 0 2rem" }}>
          {previousMessages.map((message, i) => {
            return (
              <Box
                sx={{
                  maxWidth: "200px",
                  wordWrap: "break-word",
                  marginBottom: "0.5rem",
                }}
                key={i}
              >
                {message.from === usuario ? (
                  <h4
                    style={{ color: palette.neutral.dark, display: "inline" }}
                  >
                    {" "}
                    You{" "}
                  </h4>
                ) : (
                  <h4 style={{ color: "red", display: "inline" }}>
                    {message.from}{" "}
                  </h4>
                )}{" "}
                : {message.message}
              </Box>
            );
          })}{" "}
          <Divider />
          <Typography fontStyle="italic">New Messages:</Typography>
          {chatMessages.map((message, i) => {
            return (
              <Box
                sx={{
                  maxWidth: "200px",
                  wordWrap: "break-word",
                  paddingBottom: "0.2rem",
                }}
                key={i}
              >
                {message.from === usuario ? (
                  <h4
                    style={{ color: palette.neutral.dark, display: "inline" }}
                  >
                    {" "}
                    You{" "}
                  </h4>
                ) : (
                  <h4 style={{ color: "red", display: "inline" }}>
                    {message.from}{" "}
                  </h4>
                )}{" "}
                : {message.message}
              </Box>
            );
          })}
        </ReactScrollableFeed>
      </Box>
      {/* CHAT FOOTER */}
      <Box
        height="10%"
        display="flex"
        alignItems="center"
        padding="5px"
        justifyContent="space-around"
      >
        <Box width="90%" mr="5px">
          <TextField
            onChange={(e) => setChatMessage(e.target.value)}
            value={chatMessage}
            placeholder={"your message..."}
            ref={inputRef}
            inputProps={{ maxLength: 100 }}
            onKeyPress={(e) => {
              e.key === "Enter" && sendMessage();
            }}
          />
        </Box>
        <Box>
          <IconButton
            sx={{
              backgroundColor: palette.neutral.light,
            }}
            onClick={sendMessage}
          >
            {" "}
            <SendIcon />
          </IconButton>
        </Box>
      </Box>
    </WidgetWrapper>
  );
};

export default Chatroom;

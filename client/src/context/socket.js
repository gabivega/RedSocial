import io from 'socket.io-client';
import React from 'react';
const URL = ('https://redsocial-backend.onrender.com/')
export const socket = io.connect(URL, {
    autoConnect : false
}
);


export const SocketContext = React.createContext();



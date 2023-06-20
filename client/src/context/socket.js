import io from 'socket.io-client';
import React from 'react';
const URL = ('http://localhost:3002')
export const socket = io.connect(URL, {
    autoConnect : false
}
);


export const SocketContext = React.createContext();



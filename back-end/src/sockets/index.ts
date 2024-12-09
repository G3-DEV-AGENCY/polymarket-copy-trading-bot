import { Server, Socket } from 'socket.io';
import * as http from "http";
import { logger } from './logger';

export let io: Server | null = null;
export let counter = 0;
export const socketio = async (server: http.Server) => {
  
};

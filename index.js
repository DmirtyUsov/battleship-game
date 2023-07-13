import { httpServer } from "./src/http_server/index.js";
import { WebSocketServer} from 'ws';
import * as my_func from "./src/ws_server/index.ts";

const HTTP_PORT = 8181;

console.log(`Start static http server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);
my_func.printHi();

// const wss = new WebSocketServer({port: 3000});
// wss.on('connection', (ws) => {
//   console.log("a user connected");
//   ws.on('message', (data) => {
//     console.log('Message from client', data);
//   })
// });


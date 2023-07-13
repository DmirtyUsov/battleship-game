import { httpServer } from "./src/http_server/index.js";
import { WebSocketServer} from 'ws';
import { printHi } from "./src/ws_server/index.js";

const HTTP_PORT = 8181;
const WS_PORT = 3000;

console.log(`Start static http server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);

console.log(`Start websocket server on the ${WS_PORT} port!`);
const wss = new WebSocketServer({port: WS_PORT});
printHi();
wss.on('connection', (wsc) => {
  console.log('a user connected');
  wsc.on('open', () => {
    console.log('Opened');
  });
  wsc.on('message', (data) => {
    console.log('Message from client', JSON.parse(data));
  });
  wsc.on('close', () => {
    console.log('Closed');
  });
  wsc.on('error', console.error);
});


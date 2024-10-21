import { createServer, IncomingMessage, ServerResponse } from 'http';
import { Worker } from 'cluster';

let currentWorkerIndex = 0;

export const loadBalancer = (workers: Worker[], port: number) => {
  const server = createServer((req: IncomingMessage, res: ServerResponse) => {
    const requestDetails = {
      method: req.method,
      url: req.url,
      headers: req.headers,
    };

    const worker = workers[currentWorkerIndex];
    worker.send({ request: requestDetails });

    worker.once('message', (response) => {
      res.writeHead(response.statusCode, {
        'Content-Type': 'application/json',
      });
      res.end(JSON.stringify(response.body));
    });

    currentWorkerIndex = (currentWorkerIndex + 1) % workers.length;
  });

  server.listen(port, () => {
    console.log(`Load balancer listening port ${port}`);
  });
};

import cluster from 'cluster';
import http from 'http';
import os from 'os';
import fs from 'fs';
import path from 'path';

const numCPUs = os.cpus().length;
const basePort = Number(process.env.PORT || '');
let currentWorker = 0;
const usersFilePath = path.resolve(__dirname, 'users.json');

const cleanUpUsersFile = async () => {
  try {
    await fs.promises.unlink(usersFilePath);
  } catch (err) {
    console.error(err);
  }
};

if (cluster.isPrimary) {
  for (let i = 0; i < numCPUs - 1; i++) {
    cluster.fork();
  }

  const loadBalancer = http.createServer((req, res) => {
    const workerIds = Object.keys(cluster.workers || {});
    currentWorker = (currentWorker + 1) % workerIds.length;
    const workerPort = basePort + Number(workerIds[currentWorker]);

    const options = {
      hostname: 'localhost',
      port: workerPort,
      path: req.url,
      method: req.method,
      headers: req.headers,
    };

    const workerReq = http.request(options, (workerRes) => {
      res.writeHead(workerRes.statusCode || 200, workerRes.headers);
      workerRes.pipe(res, { end: true });
    });

    workerReq.on('error', (err) => {
      console.error('Error forwarding request:', err);
      res.writeHead(500);
      res.end('Internal Server Error');
    });

    req.pipe(workerReq, { end: true });
  });

  loadBalancer.listen(basePort, () => {
    console.log(`Load balancer listening port ${basePort}`);
  });

  process.on('exit', cleanUpUsersFile);
  process.on('SIGINT', async () => {
    await cleanUpUsersFile();
    process.exit();
  });
} else {
  const workerPort = basePort + cluster.worker!.id;
  startWorker(workerPort, usersFilePath);
}

function startWorker(port: number, usersFilePath: string) {
  import('./worker').then(({ startWorker }) =>
    startWorker(port, usersFilePath),
  );
}

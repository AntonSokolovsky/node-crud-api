import { createServer, IncomingMessage, ServerResponse } from 'http';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import { User } from '../types/user';
import { HttpMethod } from '../constants/methods';
import { HttpStatusCode } from '../constants/statusCodes';

const readUsersFromFile = async (filePath: string) => {
  try {
    const data = await fs.promises.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch {
    return [];
  }
};

const writeUsersToFile = async (filePath: string, users: any) => {
  try {
    await fs.promises.writeFile(filePath, JSON.stringify(users, null, 2));
  } catch (err) {
    console.error(err);
  }
};

export const startWorker = (port: number, usersFilePath: string) => {
  const server = createServer((req: IncomingMessage, res: ServerResponse) => {
    if (req.method === HttpMethod.GET && req.url === '/api/users') {
      readUsersFromFile(usersFilePath).then((users) => {
        res.writeHead(HttpStatusCode.OK, {
          'Content-Type': 'application/json',
        });
        res.end(JSON.stringify(users));
      });
    } else if (req.method === HttpMethod.POST && req.url === '/api/users') {
      let body = '';
      req.on('data', (chunk) => {
        body += chunk.toString();
      });

      req.on('end', () => {
        const { username, age, hobbies } = JSON.parse(body);
        readUsersFromFile(usersFilePath).then((users) => {
          const newUser = { id: uuidv4(), username, age, hobbies };
          users.push(newUser);
          writeUsersToFile(usersFilePath, users).then(() => {
            res.writeHead(HttpStatusCode.CREATED, {
              'Content-Type': 'application/json',
            });
            res.end(JSON.stringify(newUser));
          });
        });
      });
    } else if (
      req.method === HttpMethod.DELETE &&
      req.url?.startsWith('/api/users/')
    ) {
      const id = req.url.split('/')[3];
      readUsersFromFile(usersFilePath).then((users) => {
        const index = users.findIndex((user: User) => user.id === id);
        if (index !== -1) {
          users.splice(index, 1);
          writeUsersToFile(usersFilePath, users).then(() => {
            res.writeHead(HttpStatusCode.NO_CONTENT);
            res.end();
          });
        } else {
          res.writeHead(HttpStatusCode.NOT_FOUND, {
            'Content-Type': 'application/json',
          });
          res.end(JSON.stringify({ message: 'User not found' }));
        }
      });
    } else {
      res.writeHead(HttpStatusCode.NOT_FOUND, {
        'Content-Type': 'application/json',
      });
      res.end(JSON.stringify({ message: 'Not Found' }));
    }
  });

  server.listen(port, () => {
    console.log(`Worker ${process.pid} listening port ${port}`);
  });
};

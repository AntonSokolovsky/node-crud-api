import { IncomingMessage, ServerResponse } from 'http';
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from '../db/memoryDataBase';
import { HttpStatusCode } from '../constants/statusCodes';
import { HttpMethod } from '../constants/methods';
import { ResponseMessage } from '../constants/responseMessage';

export const handleUserRoutes = async (
  req: IncomingMessage,
  res: ServerResponse,
) => {
  const url = req.url;
  const method = req.method;

  if (url?.startsWith('/api/users')) {
    const userId = url.split('/')[3];

    if (method === HttpMethod.GET && !userId) {
      res.statusCode = HttpStatusCode.OK;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(getUsers()));
    } else if (method === HttpMethod.GET && userId) {
      const user = getUserById(userId);
      if (user) {
        res.statusCode = HttpStatusCode.OK;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(user));
      } else {
        res.statusCode = HttpStatusCode.NOT_FOUND;
        res.end(ResponseMessage.USER_NOT_FOUND);
      }
    } else if (method === HttpMethod.POST) {
      let body = '';
      req.on('data', (chunk) => (body += chunk));
      req.on('end', () => {
        const { username, age, hobbies } = JSON.parse(body);
        const newUser = createUser(username, age, hobbies);
        res.statusCode = HttpStatusCode.CREATED;
        res.end(JSON.stringify(newUser));
      });
    } else if (method === HttpMethod.PUT && userId) {
      let body = '';
      req.on('data', (chunk) => (body += chunk));
      req.on('end', () => {
        const { username, age, hobbies } = JSON.parse(body);
        const updatedUser = updateUser(userId, username, age, hobbies);
        if (updatedUser) {
          res.statusCode = HttpStatusCode.OK;
          res.end(JSON.stringify(updatedUser));
        } else {
          res.statusCode = HttpStatusCode.NOT_FOUND;
          res.end(ResponseMessage.USER_NOT_FOUND);
        }
      });
    } else if (method === HttpMethod.DELETE && userId) {
      const deleted = deleteUser(userId);
      res.statusCode = deleted
        ? HttpStatusCode.NO_CONTENT
        : HttpStatusCode.NOT_FOUND;
      res.end();
    } else {
      res.statusCode = HttpStatusCode.METHOD_NOT_ALLOWED;
      res.end(ResponseMessage.METHOD_NOT_ALLOWED);
    }
  } else {
    res.statusCode = HttpStatusCode.NOT_FOUND;
    res.end(ResponseMessage.NOT_FOUND);
  }
};

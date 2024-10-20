import { IncomingMessage, ServerResponse } from 'http';
import { HttpStatusCode } from '../constants/statusCodes';
import { HttpMethod } from '../constants/methods';
import { ResponseMessage } from '../constants/responseMessage';

export const handleUserRoutes = (req: IncomingMessage, res: ServerResponse) => {
  const url = req.url;
  const method = req.method;

  if (url?.startsWith('/api/users')) {
    if (method === HttpMethod.GET) {
      res.statusCode = HttpStatusCode.OK;
      res.end(ResponseMessage.FETCHING);
    } else if (method === HttpMethod.POST) {
      res.statusCode = HttpStatusCode.CREATED;
      res.end(ResponseMessage.USER_CREATED);
    } else if (method === HttpMethod.PUT) {
      res.statusCode = HttpStatusCode.OK;
      res.end(ResponseMessage.USER_UPDATED);
    } else if (method === HttpMethod.DELETE) {
      res.statusCode = HttpStatusCode.NO_CONTENT;
      res.end(ResponseMessage.USER_DELETED);
    } else {
      res.statusCode = HttpStatusCode.METHOD_NOT_ALLOWED;
      res.end(ResponseMessage.METHOD_NOT_ALLOWED);
    }
  } else {
    res.statusCode = HttpStatusCode.NOT_FOUND;
    res.end(ResponseMessage.NOT_FOUND);
  }
};

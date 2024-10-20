import { createServer } from 'http';
import dotenv from 'dotenv';
import { handleUserRoutes } from './routes/routes';

dotenv.config();

const PORT = process.env.PORT || 4000;

const server = createServer((req, res) => {
  handleUserRoutes(req, res);
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

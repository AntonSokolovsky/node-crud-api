import { createServer } from 'http';
import dotenv from 'dotenv';

dotenv.config();
const PORT = process.env.PORT || 4000;

const server = createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Server is running');
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

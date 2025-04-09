import { IncomingMessage } from 'node:http';

export function getRawBody(request: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    let data = '';
    request.on('data', chunk => {
      data += chunk;
    });
    request.on('end', () => {
      resolve(data);
    });
    request.on('error', (error) => {
      reject(error);
    });
  });
}

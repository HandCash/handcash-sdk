import { createClient } from '@hey-api/openapi-ts';
import path from 'path';

async function generateSDK() {
   await createClient({
      input: {
         path: path.join(process.cwd(), 'docs', 'connectOpenapi.json'),
      },
      output: path.join(process.cwd(), 'connect-sdk/client'),
      plugins: [
         '@hey-api/client-fetch',
         {
            asClass: true,
            name: '@hey-api/sdk',
         }
      ],
   });
}

// eslint-disable-next-line no-console
generateSDK().catch(console.error);

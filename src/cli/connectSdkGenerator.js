import { createClient } from '@hey-api/openapi-ts';
import path from 'path';

async function generateSDK() {
   await createClient({
      input: {
         path: 'https://cloud.handcash.io/sdk-docs.json',
      },
      output: path.join(process.cwd(), 'src/client'),
      operations: {
         include: [
            { path: '/v1/connect*' }
         ]
      },
      plugins: [
         '@hey-api/client-fetch',
         {
            asClass: true,
            name: '@hey-api/sdk',
         }
      ],
   });
}

generateSDK().catch(console.error);

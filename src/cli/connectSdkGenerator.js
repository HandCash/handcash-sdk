import { createClient } from '@hey-api/openapi-ts';
import path from 'path';
import fs from 'fs';
import { pathToFileURL } from 'url';

const CLOUD_SPEC_URL = 'https://cloud.handcash.io/sdk-docs.json';
const LOCAL_SPEC_PATH = path.join(process.cwd(), 'spec', 'sdkOpenapi.json');

async function generateSDK() {
   const specPath = fs.existsSync(LOCAL_SPEC_PATH)
      ? pathToFileURL(LOCAL_SPEC_PATH).href
      : CLOUD_SPEC_URL;

   if (specPath !== CLOUD_SPEC_URL) {
      console.log('Using local spec:', LOCAL_SPEC_PATH);
   }

   await createClient({
      input: { path: specPath },
      output: path.join(process.cwd(), 'src/client'),
      parser: {
         filters: {
            tags: {
               include: ['Connect', 'Minter', 'Payment Requests', 'Wallet Items', 'Friends'],
            },
            preserveOrder: true,
         },
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

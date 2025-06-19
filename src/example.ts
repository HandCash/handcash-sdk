import { getInstance } from './sdk.js';
import { Connect } from './client/sdk.gen.js';

const sdk = getInstance({
   baseUrl: 'https://iae.cloud.handcash.io',
   appId: '<APP-ID>',
   appSecret: '<APP-SECRET>',
});


(async () => {
   const client = sdk.getAccountClient('<PRIVATE-KEY>');

   let result: any = await Connect.getCurrentUserProfile({ client });
   console.log(JSON.stringify(result, null, 2));

   result = await Connect.getExchangeRate({
      client,
      path: { currencyCode: 'USD' }
   });
   console.log(JSON.stringify(result, null, 2));

   result = await Connect.pay({
      client,
      body: {
         instrumentCurrencyCode: 'BSV',
         denominationCurrencyCode: 'USD',
         receivers: [{
            sendAmount: 0.01,
            destination: 'nosetwo'
         }]
      }
   });
   console.log(JSON.stringify(result, null, 2));
})();

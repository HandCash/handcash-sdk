import { getInstance, Connect } from './sdk.js';

const sdk = getInstance({
   appId: '<APP-ID>',
   appSecret: '<APP-SECRET>',
});


const printToConsole = (result: any) => {
   console.log(JSON.stringify(result, null, 2));
}

(async () => {
   const client = sdk.getAccountClient('<PRIVATE-KEY>');

   let result: any = await Connect.getCurrentUserProfile({ client });
   printToConsole(result);

   result = await Connect.getExchangeRate({ client: sdk.client, path: { currencyCode: 'USD' } });
   printToConsole(result);

   result = await Connect.getSpendableBalances({ client });
   printToConsole(result);

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
   printToConsole(result);
})();

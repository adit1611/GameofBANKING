//1] install -->  react plaid
//2] instll --> plaid
//3]👇🏻👇🏻
 import { Configuration, PlaidApi, PlaidEnvironments } from 'plaid';
//4] add keys,secrets,details in .env for==> "PLAD CONNECTION" <==
const configration = new Configuration
    ({
    basePath: PlaidEnvironments.sandbox,
    baseOptions :
    {headers : {
     'PLAID-CLIENT-ID': process.env.CID,
      'PLAID-SECRET': process.env.SILENTDD,
      }
    }  })


export const plaidClient = new PlaidApi(configration) 


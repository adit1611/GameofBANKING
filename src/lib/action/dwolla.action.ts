"use server"
import {Client} from "dwolla-v2"
import { extractCustomerIdFromUrl } from "../utils";

const getEnvironment = (): "production" | "sandbox" => {
    const environment = process.env.DWOLLA_ENV as string;

    switch (environment) {
        case "sandbox":
        return "sandbox"; // ✅

        case "production":
            return "production"; // ✅
        default:
            throw new Error(
                "Dwolla environment should either be set to `sandbox` or `production`"
            ) ;
    }
};

const dwollaClient = new Client({
  environment: getEnvironment(),
  key: process.env.DWOLLA_KEY as string,
  secret: process.env.DWOLLA_SECRET as string,
});

// Create a Dwolla Funding Source using a Plaid Processor Token

export const createFundingSource = async (
  options: CreateFundingSourceOptions
) => {
  try {
    const cleanCustomerId = extractCustomerIdFromUrl(options.customerId);

    return await dwollaClient
      .post(`customers/${cleanCustomerId}/funding-sources`, {
        name: options.fundingSourceName,
        plaidToken: options.plaidToken,
        _links: options._links, // 👈 Forward authorization links here
      })
      .then((res) => res.headers.get("location"));
  } catch (err: any) {
    // Handle already linked bank (DuplicateResource)
    const duplicateUrl = err?.body?._links?.about?.href;

    if (duplicateUrl) {
      console.log("Reusing existing Dwolla funding source URL:", duplicateUrl);
      return duplicateUrl;
    }

    console.error("Creating a Funding Source Failed: ", err);
    return null;
  }
};

//on-Demand-Authrization
export const createOnDemandAuthorization = async ()=> {
    try {
   const onDemandAuthorization = await dwollaClient.post(
      "on-demand-authorizations" );
     const authLink = onDemandAuthorization.body._links;
        return authLink;
    } catch (galti) {
        console.error("Creating an On Demand Authorization Failed: ",galti);    
    }
};
export const createDwollaCustomer = async (
    newCustomer : NewDwollaCustomerParams
) => {
    try {
    const response = await dwollaClient.post("customers", newCustomer);
    return response.headers.get("location");
  } catch (err: any) {
    // Check if error is a Duplicate customer error
    const duplicateError = err?.body?._embedded?.errors?.find(
      (e: any) => e.code === "Duplicate"
    );

    if (duplicateError?._links?.about?.href) {
      console.log(
        "Customer already exists in Dwolla. Reusing existing URL:",
        duplicateError._links.about.href
      );
      return duplicateError._links.about.href;
    }

    console.error("DWOLLA EXACT ERROR:", JSON.stringify(err.body, null, 2));
    return null;
  }
};
/* 
This code structure is an Exported Asynchronous Arrow Function in TypeScript.Depending on the context (syntax vs. full-stack architecture), here is what it is called:
Terminology by Category
TypeScript / JavaScript (Syntax Level):
🫡🫡🤔🥹Exported Async Arrow Function Expression: It uses export const, the async keyword, and the => arrow syntax.  
🫡🫡Named Export: Because it exports a specific named variable (createDr) rather than a default export.
🤔Next.js & React (Full-Stack Level):
🤔🤔Server Action / Server Function: If placed inside a file with "use server", it represents an asynchronous server-side mutation callable from the client or form actions.
🥹Software Architecture (Backend & Design Level):
Service Function / Service Layer Action: 
🥹🥹It encapsulates backend business logic (e.g., calling an external API or database to create a customer/record).Mutation / Data Creation Handler: 
🥹🥹A standard CRUD creation function that accepts typed input parameters (newCustomer: NDrParams) to generate a new entity.
🥹🥹Anatomy Breakdown
Code Part           Technical Term      Role
export      Named Module Export   Makes the function accessible in other files.
const createDr =Variable Declaration  Binds the function to an immutable variable.
async   Asynchronous Modifier  Ensures the function returns a Promise and enables await.
(newCustomer: NDrParams) Typed Parameter  TypeScript type annotation enforcing strict input structure.
=> { ... }  Arrow Function    BlockModern ES6 lexical function body.
*/

export const createTransfer = async({
    sourceFundingSourceUrl,
    destinationFundingSourceUrl,
    amount,
}: TransferParams) =>{
    try {
        const requestBody = {
            _links : {
                source: {
                    href : sourceFundingSourceUrl,
                },
                destination: {
                    href : destinationFundingSourceUrl,
                },
            },
            amount: {
                currency: "USD",
                value: amount,
            },
        };
        return await dwollaClient
            .post("transfers",requestBody)
            .then((res) => res.headers.get("location"));
    } catch (L_lagye) {
        console.error("Transfer fund failed😒😒",L_lagye);   
    }
}


export const addFundingSource = async ({
  dwollaCustomerId,
  processorToken,
  bankName,
}: AddFundingSourceParams) => {
  try {
    // 1. Create Dwolla on-demand authorization link
    const dwollaAuthLinks = await createOnDemandAuthorization();

    // 2. Pass the auth link inside the options
    const fundingSourceOptions = {
      customerId: dwollaCustomerId,
      fundingSourceName: bankName,
      plaidToken: processorToken,
      _links: dwollaAuthLinks,
    };

    return await createFundingSource(fundingSourceOptions);
  } catch (error) {
    console.error("Failed to add funding source: ", error);
    return null;
  }
};
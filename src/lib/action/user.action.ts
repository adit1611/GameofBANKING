'use server'
import React from 'react'
import { createAdminClient, createSessionClient } from '../appwrite';
import { cookies } from 'next/headers';
import { Client, ID, Query, TablesDB } from 'node-appwrite';
import { encryptId, extractCustomerIdFromUrl, parseStringify } from '../utils';
import { CountryCode, ProcessorTokenCreateRequest, ProcessorTokenCreateRequestProcessorEnum, Products } from 'plaid';
import { plaidClient } from './plaid';
import { revalidatePath } from 'next/cache';
import { addFundingSource, createDwollaCustomer } from './dwolla.action';



const {
  APPWRITE_DATABASE_ID,
  APPWRITE_USER_COLLECTION_ID,
  APPWRITE_BANK_COLLECTION_ID,
} = process.env;

export const getUserInfo = async ({ userId }: { userId: string }) => {
  try {
    // 1. Guard against empty or undefined userId to avoid Appwrite query exceptions
    if (!userId || typeof userId !== "string") {
      console.error("getUserInfo error: userId is invalid or undefined:", userId);
      return null;
    }

    const { tablesDB } = await createAdminClient();

    const response = await tablesDB.listRows({
      databaseId: process.env.APPWRITE_DATABASE_ID!,
      tableId: process.env.APPWRITE_USER_COLLECTION_ID!,
      queries: [Query.equal("id_userdhan", [userId])],
    });

    if (!response || !response.rows || response.rows.length === 0) {
      console.warn(`No user document found for userId: ${userId}`);
      return null;
    }

    const userData = response.rows[0];

    // 2. Locate dynamic attribute keys matching your Appwrite schema
    const dwollaIdKey = Object.keys(userData).find(
      (key) =>
        key.startsWith("dwollaID") ||
        key.toLowerCase().includes("customerid")
    );
    const dwollaUrlKey = Object.keys(userData).find(
      (key) =>
        key.startsWith("dwolla_") ||
        key.toLowerCase().includes("customerurl")
    );

    // 3. Resolve raw Dwolla strings
    const rawDwollaId =
      userData.dwollaCustomerId ||
      (dwollaIdKey ? userData[dwollaIdKey] : undefined);

    const rawDwollaUrl =
      userData.dwollaCustomerUrl ||
      (dwollaUrlKey ? userData[dwollaUrlKey] : undefined);

    // 4. Sanitize IDs: dwollaCustomerId must be pure UUID; dwollaCustomerUrl must be the URL
    const sanitizedCustomerId = rawDwollaId
      ? extractCustomerIdFromUrl(String(rawDwollaId))
      : rawDwollaUrl
      ? extractCustomerIdFromUrl(String(rawDwollaUrl))
      : undefined;

    const sanitizedCustomerUrl = rawDwollaUrl?.startsWith("http")
      ? rawDwollaUrl
      : sanitizedCustomerId
      ? `https://api-sandbox.dwolla.com/customers/${sanitizedCustomerId}`
      : undefined;

    // 5. Normalize Appwrite column names into standard properties
    const formattedUser = {
      ...userData,
      $id: userData.$id,
      userId: userData.id_userdhan || userData.userId || userData.$id,
      firstName: userData.first_dhanuser || userData.firstName || userData.name || "",
      lastName: userData.lastdhan_user || userData.lastName || "",
      name:
        `${userData.first_dhanuser || ""} ${userData.lastdhan_user || ""}`.trim() ||
        userData.name ||
        "User",
      email: userData.email,
      address1: userData.address1,
      city: userData.cityuser_dhan || userData.city,
      state: userData.state,
      postalCode: userData.postalcode_dhan || userData.postalCode,
      dateOfBirth: userData.doB_user || userData.dateOfBirth,
      ssn: userData.ssn,

      // Cleaned Dwolla integration fields
      dwollaCustomerId: sanitizedCustomerId,
      dwollaCustomerUrl: sanitizedCustomerUrl,
    };

    return parseStringify(formattedUser);
  } catch (error) {
    console.error("Error in getUserInfo:", error);
    return null;
  }
};

export const signIn = async ({ email, password }: signInProps) => {
  try {
    const { account } = await createAdminClient();

    // 1. Create email/password session
    const session = await account.createEmailPasswordSession({
      email,
      password,
    });

    // 2. Set the HTTP-only cookie in Next.js
    const cookieStore = await cookies();
    cookieStore.set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "development",
    });
        // console.log(cookieStore);
        
// You can use it immediately to fetch user details:
  const user = await getUserInfo({ userId: session.userId });
    return parseStringify(user);
  } catch (error) {
    console.error("Sign in failed:", error);
    throw error;
  }
};

export const signUp = async (userData: SignUpParams) => {
  const { email, password, lastName, firstName } = userData;
  let newUserAccount;
  try {
    const { users, account, tablesDB } = await createAdminClient();

    // 1. Create Appwrite authentication user
    // console.log("1. Creating user...");
    /*const*/ newUserAccount = await users.create({
      userId: ID.unique(),
      email,
      password,
      name: `${firstName} ${lastName}`,
    });
    if(!newUserAccount) throw new Error('Err creating user')
      const dwollaCustomerUrl = await createDwollaCustomer({
          ...userData,
          type:'personal'
      })
      if(!dwollaCustomerUrl) throw new Error("Err in creating Dwolla customer")
      const dwollaCustomerId = extractCustomerIdFromUrl(dwollaCustomerUrl);

      // console.log("2. User created:", newUserAccount.$id);

      // console.log("3. Creating database row...");
    // 2. Save additional user information in your Appwrite Table
      const newUser = await tablesDB.createRow({
      databaseId: process.env.APPWRITE_DATABASE_ID!,
      tableId: process.env.APPWRITE_USER_COLLECTION_ID!,
      rowId: ID.unique(),

      data: {
      id_userdhan: newUserAccount.$id,
    first_dhanuser: userData.firstName,
    lastdhan_user: userData.lastName,
    address1: userData.address1,
    cityuser_dhan: userData.city,
    state: userData.state,
    ssn: userData.ssn,
    email: userData.email,
    password_user : userData.password,
    postalcode_dhan: userData.postalCode,
    doB_user: userData.dateOfBirth,
    dwolla_customerID_url:dwollaCustomerUrl ,
    dwollaID_customer:dwollaCustomerId ,
    }
    });
      // console.log("4. Database row created:", newUserAccount.$id);
    // 3. Create login session
    const session = await account.createEmailPasswordSession({
      email,
      password,
    });

    // 4. Save session in cookie
    const cookieStore = await cookies();

    cookieStore.set("dhanlaxami-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    return parseStringify(newUserAccount);

  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
// ... your initilization functions

export async function getLoggedInUser() {
   try {
    const { account } = await createSessionClient();
    const result = await account.get();

    const user = await getUserInfo({ userId: result.$id });

    // Log before returning
    // console.log("Logged in user:", parseStringify(user));

    console.log("Database user fetched by getUserInfo:", {
      id: user?.$id,
      dwollaCustomerId: user?.dwollaCustomerId,
      dwollaCustomerUrl: user?.dwollaCustomerUrl,
    });

    return parseStringify(user);
    
  } catch (error) {
    console.log(error)
    return null;
  }
}

export const logoutAccount = async () => {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("dhanlaxami-session"); // Your cookie name

  // 1. If user was never logged in, just clear cookie and return early
  if (!sessionCookie || !sessionCookie.value) {
    return { success: true };
  }

  // 2. If logged in, safely delete session on Appwrite
  try {
    const { account } = await createSessionClient();
    await account.deleteSession({ sessionId: "current" });
  } catch (error) {
    console.warn("Session already deleted or expired on Appwrite");
  } finally {
    // 3. Always clean up cookie
    cookieStore.delete("dhanlaxami-session");
  }

  return { success: true };
};

export const createLinkToken = async (user: User, language: string = "en") => {
  try {
      const tokenParams = {
      user: {
        client_user_id: user.$id,
      },
      client_name: `${user.firstName} ${user.lastName}`,
      products: ["auth", "transactions"] as Products[],
      language: "en",
      country_codes: ["US"] as CountryCode[],
    };
    const response = await plaidClient.linkTokenCreate(tokenParams);
    return parseStringify({linkToken: response.data.link_token})
  } catch (error) {
    console.log(error);
  }
}

export const createBankAccount = async ({
  userId,
  bankId,
  accountId,
  accessToken,
  fundingSourceUrl,
  shareableId,
}: createBankAccountProps) => {
  try {
    const { tablesDB } = await createAdminClient();

    // If your tablesDB wrapper uses createRow (singular for one document)
    const bankAccount = await tablesDB.createRow({
      databaseId: process.env.APPWRITE_DATABASE_ID!,
      tableId:
        process.env.APPWRITE_BANK_COLLECTION_ID ||
        process.env.BANK_COLLECTION_ID!,
      rowId: ID.unique(),
      data: {
        userId,
        bankId,
        accountId,
        accessToken,
        fundingSourceUrl,
        shareableId,
      },
    });

    return parseStringify(bankAccount);
  } catch (error) {
    console.error("Error creating bank account row:", error);
    throw error;
  }
};

export const exchangePublicToken = async (
  {
    publicToken,
    user,
  } : exchangePublicTokenProps
) => {
   try {
    // Exchange public token for access token and item ID
    const response = await plaidClient.itemPublicTokenExchange({
      public_token: publicToken,
    });
    const accessToken = response.data.access_token;
    const itemId = response.data.item_id;
    //Get accounnt information from Plaid using the access token
    const accountResponse = await plaidClient.accountsGet({
      access_token: accessToken,
    });  
    const accountData = accountResponse.data.accounts[0];
    // 3. Create Dwolla funding source / processor token
     const request : ProcessorTokenCreateRequest = {
      access_token :accessToken,
      account_id: accountData.account_id,
      processor: "dwolla" as ProcessorTokenCreateRequestProcessorEnum,
     };

     const  ProcessorTokenResponse = await plaidClient.processorTokenCreate(request);
     const processorToken = ProcessorTokenResponse.data.processor_token;

     const customerId = user?.dwollaCustomerId || extractCustomerIdFromUrl(user?.dwollaCustomerUrl)
     // create a funding source URL for the account using the Dwolla customer ID, processor token and bank name
     const fundingSourceUrl = await addFundingSource({
      dwollaCustomerId: user.dwollaCustomerId,
      processorToken,
      bankName:accountData.name
     });
     //If the funding surce url not found,throw an error
     if(!fundingSourceUrl) throw Error;
     //Create a bank account using the user ID, item ID, account ID, and funding source URL , shareable ID
     await createBankAccount({
      userId: user.$id,
      bankId: itemId,
      accountId:accountData.account_id,
      accessToken,
      fundingSourceUrl,
      shareableId : encryptId(accountData.account_id),
     });
     //Revalidate the path to reflect the changes
     revalidatePath("/");
     //Return a success message
     return parseStringify({
      publicTokenExchange:'complete',
     });
   } catch (error) {
    console.error("An error occurred while creating exchanging token:",error);
    
   }
};

// src/lib/action/user.action.ts

export const getBanks = async ({ userId }: getBanksProps) => {
  try {
    if (!userId) {
      console.warn("getBanks called without a valid userId");
      return [];
    }

    const { tablesDB } = await createAdminClient();

    const response = await tablesDB.listRows({
      databaseId: process.env.APPWRITE_DATABASE_ID!,
      tableId:
        process.env.APPWRITE_BANK_COLLECTION_ID ||
        process.env.BANK_COLLECTION_ID!,
      queries: [Query.equal("userId", [userId])],
    });

    // Safely extract the rows array, falling back to an empty array
    const banks = response?.rows || [];

    return parseStringify(banks);
  } catch (error) {
    console.error("Error fetching banks in getBanks:", error);
    // Always return an empty array on error so downstream .map() calls don't crash
    return [];
  }
};



export const getBank = async ({ documentId }: getBankProps) => {
  try {
    if (!documentId) {
      console.warn("getBank called without documentId");
      return null;
    }

    const { tablesDB } = await createAdminClient();

    const response = await tablesDB.listRows({
      databaseId: process.env.APPWRITE_DATABASE_ID!,
      tableId:
        process.env.APPWRITE_BANK_COLLECTION_ID ||
        process.env.BANK_COLLECTION_ID!,
      queries: [Query.equal("$id", [documentId])],
    });

    // Safely extract the first row from the typed RowList
    const bankDoc = response?.rows?.[0] || null;

    if (!bankDoc) {
      console.warn(`No bank row found matching ID: ${documentId}`);
      return null;
    }

    return parseStringify(bankDoc);
  } catch (error) {
    console.error("Error in getBank:", error);
    return null;
  }
};

export const getBankByAccountId = async ({ accountId }: getBankByAccountIdProps) => {
  try {
   const { tablesDB } = await createAdminClient();
    const bank = await tablesDB.listRows({
     databaseId: APPWRITE_DATABASE_ID!,
     tableId: APPWRITE_BANK_COLLECTION_ID!,
     queries: [
       Query.equal('accountId', [accountId])
          ],
    });
    if(bank.total !== 1) return null;

    return parseStringify( bank.rows[0]);
    
  } catch (error) {
    console.log(error);
  }
};
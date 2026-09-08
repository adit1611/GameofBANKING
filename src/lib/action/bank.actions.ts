'use server'

import { ACHClass,
  CountryCode,
  TransferAuthorizationCreateRequest,
  TransferCreateRequest,
  TransferNetwork,
  TransferType,} from "plaid";
import { parseStringify } from "../utils";
import { plaidClient } from "./plaid";
import { getTransactionsByBankId } from "./transaction.action";
import { getBank, getBanks } from "./user.action";

// src/lib/action/bank.action.ts

export const getAccounts = async ({ userId }: { userId: string }) => {
  try {
    console.log("--> getAccounts called with userId:", userId);

    // 1. Fetch bank documents from Appwrite
    const banks = await getBanks({ userId });
    console.log("--> Banks found in DB:", banks);

    if (!banks || banks.length === 0) {
      console.warn("--> No banks found in Appwrite for this user ID!");
      return parseStringify({ data: [], totalBanks: 0, totalCurrentBalance: 0 });
    }

    // 2. Fetch Plaid balances for each bank
    const accounts = await Promise.all(
      banks.map(async (bank: Bank) => {
        console.log("--> Fetching Plaid balance for accessToken:", bank.accessToken);
        
        const accountsResponse = await plaidClient.accountsBalanceGet({
          access_token: bank.accessToken,
        });

        const accountData = accountsResponse.data.accounts[0];
        return {
          id: accountData.account_id,
          availableBalance: accountData.balances.available!,
          currentBalance: accountData.balances.current!,
          name: accountData.name,
          officialName: accountData.official_name,
          mask: accountData.mask!,
          type: accountData.type as string,
          subtype: accountData.subtype as string,
          appwriteItemId: bank.$id,
          shareableId: bank.shareableId,
        };
      })
    );

    const totalBanks = accounts.length;
    const totalCurrentBalance = accounts.reduce((total, account) => {
      return total + account.currentBalance;
    }, 0);

    console.log("--> Computed Balance:", { totalBanks, totalCurrentBalance });

    return parseStringify({ data: accounts, totalBanks, totalCurrentBalance });
  } catch (error) {
    console.error("An error occurred while getting accounts:", error);
    return parseStringify({ data: [], totalBanks: 0, totalCurrentBalance: 0 });
  }
};

//get one bank account
export const getAccount = async ({ appwriteItemId }: getAccountProps) => {
  try {
    if (!appwriteItemId) return null;

    // 1. Fetch single bank record from tablesDB
   
    // get bank from db
    const bank = await getBank({ documentId: appwriteItemId });

    // Guard: Prevent "Cannot read properties of undefined (reading 'accessToken')"
    if (!bank || !bank.accessToken) {
      console.warn("No bank record or accessToken found for ID:", appwriteItemId);
      return null;
    }

    // get account info from plaid
    const accountsResponse = await plaidClient.accountsGet({
      access_token: bank.accessToken,
    });
    const accountData = accountsResponse.data.accounts[0];

    // get transfer transactions from appwrite
    const transferTransactionsData = await getTransactionsByBankId({
      bankId: bank.$id,
    });

    const transferTransactions = transferTransactionsData.rows.map(
      (transferData: Transaction) => ({
        id: transferData.$id,
        name: transferData.name!,
        amount: transferData.amount!,
        date: transferData.$createdAt,
        paymentChannel: transferData.channel,
        category: transferData.category,
        type: transferData.senderBankId === bank.$id ? "debit" : "credit",
      })
    );

    // get institution info from plaid
    const institution = await getInstitution({
      institutionId: accountsResponse.data.item.institution_id!,
    });

    const transactions = await getTransactions({
      accessToken: bank?.accessToken,
    });

    const account = {
      id: accountData.account_id,
      availableBalance: accountData.balances.available!,
      currentBalance: accountData.balances.current!,
      institutionId: institution.institution_id,
      name: accountData.name,
      officialName: accountData.official_name,
      mask: accountData.mask!,
      type: accountData.type as string,
      subtype: accountData.subtype! as string,
      appwriteItemId: bank.$id,
    };

    // sort transactions by date such that the most recent transaction is first
      const allTransactions = [...transactions, ...transferTransactions].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    return parseStringify({
      data: account,
      transactions: allTransactions,
    });
  } catch (error) {
    console.error("An error occurred while getting the account:", error);
  }
};

// Get bank info
export const getInstitution = async ({
    institutionId,
}: getInstitutionProps) => {
    try {
        const institutionResponse = await plaidClient.institutionsGetById({
            institution_id: institutionId,
            country_codes: ["US"] as CountryCode[],
        });
        const institution = institutionResponse.data.institution;

        return parseStringify(institution);
    } catch (error) {
         console.error("An error occurred while getting the accounts:", error);
    }
};

// Get transactions
export const getTransactions = async({
    accessToken,
}: getTransactionsProps) => {
    let hasMore = true;
    let transactions: any = [];

    try{
        // Iterate through each page of new transaction updates for item
       while (hasMore) {
      const response = await plaidClient.transactionsSync({
        access_token: accessToken,
      });

      const data = response.data;

      transactions = response.data.added.map((transaction) => ({
        id: transaction.transaction_id,
        name: transaction.name,
        paymentChannel: transaction.payment_channel,
        type: transaction.payment_channel,
        accountId: transaction.account_id,
        amount: transaction.amount,
        pending: transaction.pending,
        category: transaction.category ? transaction.category[0] : "",
        date: transaction.date,
        image: transaction.logo_url,
      }));

      hasMore = data.has_more;
    }

    return parseStringify(transactions);
  } catch (error) {
    console.error("Plaid transactionsSync error:", error);
    return []; // 👈 Return empty array on error so UI continues to render
  }
};

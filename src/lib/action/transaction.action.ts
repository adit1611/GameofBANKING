"use server"

import { channel } from "diagnostics_channel";
import { createAdminClient } from "../appwrite";
import { Client, ID, Query, TablesDB } from 'node-appwrite';
import { parseStringify } from "../utils";
const {
    APPWRITE_DATABASE_ID:APPWRITE_DATABASE_ID,
    APPWRITE_TRANSACTION_ID: APPWRITE_TRANSACTION_COLLECTION_ID,
} = process.env;
export const createTransaction = async (transaction: CreateTransactionProps) => {
    try {
        
    const {tablesDB} = await createAdminClient();
    
    const newTransaction = await tablesDB.createRows({
              databaseId: APPWRITE_DATABASE_ID!,
              tableId: APPWRITE_TRANSACTION_COLLECTION_ID!,
              rows : [
                {
                    $id: ID.unique(),
                    channel: "online",
                    category: 'Transfer',
                    ...transaction 
                }
              ]
            })

            return parseStringify(newTransaction);
    } catch (error) {
        console.log(error);
    }
}


// src/lib/action/transaction.action.ts

export const getTransactionsByBankId = async ({
  bankId,
}: getTransactionsByBankIdProps) => {
  try {
    const { tablesDB } = await createAdminClient();

    const databaseId = process.env.APPWRITE_DATABASE_ID!;
    const tableId =
      process.env.APPWRITE_TRANSACTION_COLLECTION_ID ||
      process.env.TRANSACTION_COLLECTION_ID;

    if (!tableId) {
      console.warn(
        "Warning: Transaction collection ID is not defined in environment variables."
      );
      return parseStringify({ total: 0, rows: [] });
    }

    const senderTransactions = await tablesDB.listRows({
      databaseId,
      tableId,
      queries: [Query.equal("senderBankId", [bankId])],
    });

    const receiverTransactions = await tablesDB.listRows({
      databaseId,
      tableId,
      queries: [Query.equal("receiverBankId", [bankId])],
    });

    const total =
      (senderTransactions?.rows?.length || 0) +
      (receiverTransactions?.rows?.length || 0);

    const rows = [
      ...(senderTransactions?.rows || []),
      ...(receiverTransactions?.rows || []),
    ];

    return parseStringify({ total, rows });
  } catch (error) {
    console.error("Error fetching transactions by bank ID:", error);
    return parseStringify({ total: 0, rows: [] });
  }
};
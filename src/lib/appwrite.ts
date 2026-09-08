// src/lib/appwrite.ts
"use server";

import { Account, Client, TablesDB, Users } from "node-appwrite";
import { cookies } from "next/headers";

// Session Client: Used for logged-in user requests

export async function createSessionClient() {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.Zenith_APPWRITE_next!);

 const cookieStore = await cookies();

const session = cookieStore.get("appwrite-session");
 
 if (!session || !session.value) {
    throw new Error("No active session found in cookies.");
  }

  client.setSession(session.value);

  return {
    get account() {
      return new Account(client);
    },
    get tablesDB() {
      return new TablesDB(client);
    },
  };
}

export async function createAdminClient() {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.Zenith_APPWRITE_next!)
    .setKey(process.env.Appwrite_SECRETAP!);

  return {
    get account() {
      return new Account(client);
    },
    get tablesDB() {
      return new TablesDB(client);
      
    },
    get users() {
      return new Users(client);
    },
  };
}
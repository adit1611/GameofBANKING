import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import z from "zod";
import qs from "query-string";


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const authFormSchema = (type: string) =>
  z.object({
    firstName:
      type === "sign-in"
        ? z.string().optional()
        : z.string().min(3, "First name must be at least 3 characters"),

    lastName:
      type === "sign-in"
        ? z.string().optional()
        : z.string().min(3, "Last name must be at least 3 characters"),

    address1:
      type === "sign-in"
        ? z.string().optional()
        : z.string().min(10).max(60),

    city:
      type === "sign-in"
        ? z.string().optional()
        : z.string().min(2).max(50),

    state:
      type === "sign-in"
        ? z.string().optional()
        : z.string().min(2).max(50),

    Postalcode:
      type === "sign-in"
        ? z.string().optional()
        : z.string().min(5).max(10),

    dateOfBirth:
      type === "sign-in"
        ? z.string().optional()
        : z.string().regex(
            /^\d{4}-\d{2}-\d{2}$/,
            "Date must be in YYYY-MM-DD format"
          ),

    ssn:
      type === "sign-in"
        ? z.string().optional()
        : z.string().min(3),

    // activityId:
    //   type === "sign-in"
    //     ? z.string().optional()
    //     : z.string()
    //         .regex(
    //           /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&]).*$/,
    //           "Must contain uppercase, lowercase, number, and special character"
    //         )
    //         .min(8)
    //         .max(50),

    email: z.string()
      .min(1, "Email can't be empty")
      .email("Invalid email address"),

    password: z.string()
      .regex(
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&]).*$/,
        "Must contain uppercase, lowercase, number, and special character"
      )
      .min(8)
      .max(50),
  });

export const parseStringify = (value: any) => {
  if (value === undefined) return null;
  return JSON.parse(JSON.stringify(value));
};

// lib/utils.ts
export const PLAID_SUPPORTED_LANGUAGES = [
  "en", "hi", "es", "fr", "de", "nl", "it", "pt", "pl", "sv", "da", "no", "ro", "vi"
] as const;
export type PlaidLanguage = typeof PLAID_SUPPORTED_LANGUAGES[number];

export function getSupportedPlaidLanguage(locale?: string): PlaidLanguage {
  if (!locale) return "en";
  
  // Extract primary tag (e.g., 'hi-IN' -> 'hi', 'en-US' -> 'en')
  const primaryLang = locale.split("-")[0].toLowerCase();
  
  return PLAID_SUPPORTED_LANGUAGES.includes(primaryLang as PlaidLanguage)
    ? (primaryLang as PlaidLanguage)
    : "en"; // Default fallback
}

export function encryptId(id: string) {
  return btoa(id);
}

export function decryptId(id: string) {
  return atob(id);
}

export function extractCustomerIdFromUrl(url: string | undefined | null): string {
  if (!url || typeof url !== "string") return "";

  // If already a clean UUID (no slashes), return it directly
  if (!url.includes("/")) return url.trim();

  const parts = url.split("/");
  return parts[parts.length - 1].trim();
}


interface UrlQueryParams {
  params: string;
  key: string;
  value: string;
}

export function formURLQuery({params,key,value}:UrlQueryParams) {
  const currentURL = qs.parse(params);

  currentURL[key] = value;
  return qs.stringifyUrl(
    {
      url:window.location.pathname,
      query: currentURL,
    },
    {skipNull:true}
  );
}

export function getAccountTypeColors(type:AccountTypes) {
  switch(type) {
    case "depository":
       return {
        bg: "bg-blue-25",
        lightBg: "bg-blue-100",
        title: "text-blue-900",
        subText: "text-blue-700",
      };

    case "credit":
      return {
        bg: "bg-success-25",
        lightBg: "bg-success-100",
        title: "text-success-900",
        subText: "text-success-700",
      };

    default:
      return {
        bg: "bg-green-25",
        lightBg: "bg-green-100",
        title: "text-green-900",
        subText: "text-green-700",
      };
  }
}

export function formatAmount(amount:number): string {
  const formatter = new Intl.NumberFormat("en-US", {
    style:"currency",
    currency: "USD",
    minimumFractionDigits:2,
  });
  return formatter.format(amount)
}

export const formatDateTime = (datestring:Date) =>{
  const dateTimeOptions: Intl.DateTimeFormatOptions ={
    weekday:"short", //  // abbreviated weekday name (e.g., 'Mon')
    month: "short", // abbreviated month name (e.g., 'Oct')
    day: "numeric", // numeric day of the month (e.g., '25')
    hour: "numeric", // numeric hour (e.g., '8')
    minute: "numeric", // numeric minute (e.g., '30')
    hour12: true, // use 12-hour clock (true) or 24-hour clock (false)
  }

   const dateDayOptions: Intl.DateTimeFormatOptions = {
    weekday: "short", // abbreviated weekday name (e.g., 'Mon')
    year: "numeric", // numeric year (e.g., '2023')
    month: "2-digit", // abbreviated month name (e.g., 'Oct')
    day: "2-digit", // numeric day of the month (e.g., '25')
  };

  const dateOptions: Intl.DateTimeFormatOptions = {
    month: "short", // abbreviated month name (e.g., 'Oct')
    year: "numeric", // numeric year (e.g., '2023')
    day: "numeric", // numeric day of the month (e.g., '25')
  };

  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: "numeric", // numeric hour (e.g., '8')
    minute: "numeric", // numeric minute (e.g., '30')
    hour12: true, // use 12-hour clock (true) or 24-hour clock (false)
  };

  const formateDateTime : string = new Date(datestring).toLocaleString("en-US", dateTimeOptions);

  const formateDateDay : string = new Date(datestring).toLocaleString("en-US", dateDayOptions);

  const formateDate : string = new Date(datestring).toLocaleString("en-US", dateOptions);

  const formateTime : string = new Date(datestring).toLocaleString("en-US", timeOptions);

  return {
     dateTime: formateDateTime,
    dateDay: formateDateDay,
    dateOnly: formateDate,
    timeOnly: formateTime,
  }
}

export function removeSpecialCharacters(value: string): string {
  return value.replace(/[^\w\s]/gi, "");
}

export const getTransactionStatus = (date:Date) => {
  const today = new Date();
  const twoDaysAgo = new Date(today);
  twoDaysAgo.setDate(today.getDate() - 2);

  return date > twoDaysAgo ? "Processing" : "Success";
}

export function countTransactionCategories(
    transactions: Transaction[]
) : CategoryCount[] {
    const categoryCounts: {[category:string]: number} = {};
    let totalCount = 0;

    // Iterate over each transaction

    transactions && 
     transactions.forEach((transaction) => {
       // Extract the category from the transaction

       const category = transaction.category;

       // If the category exists in the categorycounts object , increment its count

       if(categoryCounts.hasOwnProperty(category)) {
        categoryCounts[category]++;
       } else {
          // otheerwise, initialize the count to 1
          categoryCounts[category] = 1;
       }
       // Incremental total count
       totalCount++;
      });
      
       // Convert the categoryCounts object to an array of objects
       const aggregatedCategories: CategoryCount[] =  Object.keys(categoryCounts).map((category) => ({
      name: category,
      count: categoryCounts[category],
      totalCount,
     })
       );
       aggregatedCategories.sort((a,b) => b.count - a.count);
       return aggregatedCategories;  
}
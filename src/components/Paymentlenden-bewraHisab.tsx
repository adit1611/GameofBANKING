"use client"

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import React, { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { createTransfer } from "@/lib/action/dwolla.action";
import { createTransaction } from "@/lib/action/transaction.action";

// ✅ Form correctly imported from shadcn UI form component
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { authFormSchema, decryptId } from "@/lib/utils";
import CustomInput from "./CustomInput";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { getBank, getBankByAccountId, signIn, signUp } from "@/lib/action/user.action";
import PlaidLink from "./PlaidLink";

import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";
import { BankBox } from "./BankBox";







const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  name: z.string().min(4, "Transfer note is too short"),
  amount: z.string().min(4, "Amount is too short"),
  senderBank: z.string().min(4, "Please select a valid bank account"),
  sharableId: z.string().min(8, "Please select a valid sharable Id"),
});

const Paymentlenden_bewraHisab = ({ accounts }: PaymentTransferFormProps) => {

  
  const [user, setUser] = useState(false);
    // ✅ Changed initial state to false so button isn't stuck loading
    const [isLoading, setIsLoading] = useState(false);
  
    
    const router = useRouter();
  
    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
      name: "",
      email: "",
      amount: '',
      senderBank:"",
      sharableId:"",
      },
    });
  
    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        setIsLoading(true);

        try {
          const receiverAccountId = decryptId(data.sharableId);
          const receiverBank = await getBankByAccountId({accountId: receiverAccountId,
          });
          const senderBank = await getBank({documentId : data.senderBank});
          // create transfer

          const transferParams : TransferParams = {
            sourceFundingSourceUrl: senderBank.fundingSourceUrl,
            destinationFundingSourceUrl: receiverBank.fundingSourceUrl,
            amount: data.amount,
          };

      const transfer = await createTransfer(transferParams);

          // create transfer transaction
          if(transfer) {
            const transaction = {
              name:data.name,
              amount  :data.amount,
              senderId:senderBank.userId.$id,
              senderBankId:senderBank.$id,
              receiverId:receiverBank.userId.$id,
              receiverBankId : receiverBank.$id,
              email:data.email,
            };
            const newTransaction = await createTransaction(transaction);
            if( newTransaction) {
              form.reset();
              router.push("/");
            }
          }
        } catch (error) {
           console.error("Submitting create transfer request failed: ", error);
        }
         setIsLoading(false);
    }
  
  return (
     <>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(
          onSubmit,
          (errors) => {
            console.log("VALIDATION ERRORS:", errors);
            }
          )} className="flex flex-col">
           <FormField 
            control={form.control}
            name="senderBank"
            render={() => (
              <FormItem className="border-t border-gray-200">
                <div className="payment-transfer_form pb-6 pt-5">
                  <div className="payment-transfer_form-content">
                    <FormLabel className="text-14 font-medium text-gray-700">
                      Select Source Bank
                    </FormLabel>
                    <FormDescription className = "text-12 font-normal text-gray-600">
                      Select the bank account you to transfer funds from
                    </FormDescription>
                  </div>
                  <div className="flex w-full flex-col">
                    <FormControl>
                      <BankBox accounts = {accounts} setValue = {form.setValue} otherStyles = "!w-full"/>
                    </FormControl>
                    <FormMessage className="text-xs text-red-500"/>
                  </div>
                </div>
              </FormItem>
            )}
           />
           <FormField 
            control={form.control}
            name="name"
            render={({field}) => (
              <FormItem className="border-t border-gray-200">
                <div className="payment-transfer_form-item pb-6 pt-5">
                  <div className="payment-transfer_form-content">
                    <FormLabel className="text-14 font-medium text-gray-700">
                      Transfer Note (Optional)
                    </FormLabel>
                    <FormDescription className = "text-12 font-normal text-gray-600">
                       Please provide any additional information or instructions
                      related to the transfer
                    </FormDescription>
                  </div>
                  <div className="flex w-full flex-col">
                    <FormControl>
                      <Textarea 
                      placeholder="Write a short Note 📝📝"
                      className="input-class"
                      {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-red-500"/>
                  </div>
                </div>
              </FormItem>
            )}
           />
          <div className="payment-transfer_form-item pb-6 pt-5">
          <h1 className="payment-transfer_form-content">
              Bank account details
          </h1>
          <p className="text-lg font-normal text-gray-600">
            Enter the bank account details of the recipient
          </p>
      </div>
     <FormField
          control={form.control}
          name="email"
          render={({field}) => (
            <FormItem className="border-t border-gray-200">
                  <div className="payment-transfer_form-item py-5">
                    <FormLabel className="text-14 w-full max-w-70 font-medium text-gray-700">
                      Recipient &apos;s Email Address
                    </FormLabel>
                    <div className="flex w-full flex-col">
                      <FormControl>
                        <Input placeholder="ex: yoyo@xx.com" className="input-class" {...field} />
                      </FormControl>
                      <FormMessage className="text-12 text-red-500"/>
                    </div>
                  </div>
            </FormItem> 
          )}
        />
      <FormField
          control={form.control}
          name="sharableId"
          render={({field}) => (
            <FormItem className="border-t border-gray-200">
               <div className="payment-transfer_form-item py-5">
                 <FormLabel className="text-14 w-full max-w-70 font-medium text-gray-700">
                      Receiver &apos;s Plaid Shareable ID
                    </FormLabel>
                    <div className="flex w-full flex-col">
                      <FormControl>
                        <Input placeholder="ex: 11****99 Enter Your account no." className="input-class" {...field} />
                      </FormControl>
                      <FormMessage className="text-12 text-red-500"/>
                    </div>
                  </div>
            </FormItem> 
          )}
        />
       <FormField
          control={form.control}
          name="amount"
          render={({field}) => (
            <FormItem className="border-t border-gray-200">
               <div className="payment-transfer_form-item py-5">
                    <FormLabel className="text-14 w-full max-w-70 font-medium text-gray-700">
                      Amounts
                    </FormLabel>
                    <div className="flex w-full flex-col">
                      <FormControl>
                        <Input placeholder="ex: 100.05" className="input-class" 
                        {...field} />
                      </FormControl>
                      <FormMessage className="text-12 text-red-500"/>
                    </div>
                  </div>
            </FormItem> 
          )}
        />
             
       <div className="payment-transfer_btn-box">
                <Button type="submit"  className="payment-transfer_btn">
                  {isLoading ? (
                    <>
                      <Loader2 size={20} className="animate-spin" /> &nbsp;
                      Sending📨📨💲💲💲
                    </>
                  ) : ( "Transfer Funds")}
                </Button>
              </div>
            </form>
          </Form>
         </>
  )
}

export default Paymentlenden_bewraHisab;

{/* 
  
  
                    <CustomInput control={form.control} name='firstName' label="First Name" placeholder='Enter your first name' />
                    <CustomInput control={form.control} name='lastName' label="Last Name" placeholder='Enter your first name' />
                  </div>
                  <CustomInput control={form.control} name='address1' label="Address" placeholder='Enter your specific address' />
                  <CustomInput control={form.control} name='city' label="City" placeholder='Enter your city' />
                  <div className="flex gap-4">
                    <CustomInput control={form.control} name='state' label="State" placeholder='Example: NY' />
                    <CustomInput control={form.control} name='Postalcode' label="Postal Code" placeholder='Example: 11101' />
              ============================================
              <div className="flex gap-4">
                    <CustomInput control={form.control} name='dateOfBirth' label="Date of Birth" placeholder='YYYY-MM-DD' />
                    <CustomInput control={form.control} name='ssn' label="SSN" placeholder='Example: 1234' />
                  </div>





               ==============================
               
               

              <CustomInput control={form.control} name='email' label="Email" placeholder='Enter your email' />

              <CustomInput control={form.control} name='password' label="Password" placeholder='Enter your password' />

  */}
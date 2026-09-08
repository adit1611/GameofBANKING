import HeaderBox from '@/components/HeaderBox'
import Paymentlenden_bewraHisab from '@/components/Paymentlenden-bewraHisab'
import { getAccounts } from '@/lib/action/bank.actions';
import { getLoggedInUser } from '@/lib/action/user.action';
import React from 'react'

const Money_lenden = async() => {

  const loggedIN = await getLoggedInUser() || {firstName: 'Dhan',lastName: "F&L", email:"wouldukissme@yahoo.com"};
    const accounts = await getAccounts({
      userId:loggedIN.$id
    })
    if(!accounts) return; 
    const accountsData = accounts?.data;

  return (
    <section className='payment-transfer'>
        <HeaderBox 
         title='Payment transfer'
         subtext = "Please provide any specific detail or notes related to paymnt transfer" />
          <section className="size-full pt-5">
        <Paymentlenden_bewraHisab accounts={accountsData} />
      </section>
    </section>
  )
}

export default Money_lenden
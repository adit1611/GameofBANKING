import HeaderBox from '@/components/HeaderBox'
import TotalBalance from '@/components/totalBalance'
import React from 'react'

const Home = () => {
  const loggedIN = {firstName: 'Dhan'}
  return (
    <section className='home'>
        <div className='home-content'>
          <header className='home-hheader'>
              Welcome to DhanLaxmi Bank
              <HeaderBox
                type = "greeting"
                title = "Welcom"
                user= {loggedIN?.firstName || 'Guest'}
                subtext= "Acces and manage your account and trasaction effiency."
              />
              <TotalBalance
                accounts={[]}
                totalBanks={1}
                totalCurrentBalance={1250.35}

              />
            
          </header>


        </div>

    </section>
  )
}

export default Home
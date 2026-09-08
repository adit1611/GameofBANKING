import React from 'react';
import Auth from '@/components/AuthForm';

const pagesignin = () => {
  return (
    <div className='flex-center size-full max-sm:px-6'>
      <Auth type="sign-in"/>
    </div>
  )
}

export default pagesignin;
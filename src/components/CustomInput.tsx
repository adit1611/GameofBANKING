import React from 'react'
import { FormControl, FormField, FormLabel, FormMessage } from "./ui/form"
import { Input } from '@base-ui/react'
import { Control, FieldPath } from 'react-hook-form'
import z from 'zod'
import { authFormSchema } from '@/lib/utils'


const formSchema = authFormSchema('sign-up')
interface CunstomInput {
  control:Control<z.infer<typeof formSchema>>,
  name:FieldPath<z.infer<typeof formSchema>>,
  label:string,
  placeholder:string
}

const CustomInput = ({control,name,label,placeholder}:CunstomInput) => {
  return (
     <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <div className="flex flex-col gap-4 md:gap-2 text-2xl xs:text-lg text-abrilFatface m-5 justify-center items-center-safe left-10">
          <FormLabel className="text-3xl text-right justify-around xs:text-lg w-full max-w-64 font-medium text-purple-700 lg:font-semibold text-shadow-xs text-shadow-mist-600">
            {label}
          </FormLabel>
          <div className="flex w-full flex-col ring-offset-4 ring-offset-sky-300 in-focus-within:active:not-even:">
            <FormControl>
              <Input 
                placeholder={placeholder}
                className=" text-16 placeholder:text-16 rounded-lg border border-gray-300 text-cyan-900 placeholder:border-2 placeholder:border-double placeholder:border-e-fuchsia-400 placeholder:text-mauve-700  focus:border-sky-500 focus:outline focus:outline-sky-500 focus:invalid:border-pink-500 focus:invalid:outline-pink-500 disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-500 disabled:shadow-none"
                type={name === 'password' ? 'password' : 'text'}
                {...field}
              />
            </FormControl>
            <FormMessage className="text-4xl text-zinc-600 mt-2" />
          </div>
        </div>
      )}
    />
  )
}

export default CustomInput
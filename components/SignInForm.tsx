'use client'
import { loginUser } from '@/lib/user'
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react'
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { z } from 'zod';
import CustomInput from './CustomInput';
import { redirectPath } from './utils';

const schema = z.object({
    email: z.string().email({
        message: "Enter valid email",
    }).transform(s => s.toLowerCase()),
    password: z.string().min(1, "Enter password"),
});

export type LoginSchemaData = z.infer<typeof schema>;

const SignInForm = () => {

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            email: "",
            password: "",
        },
        resolver: zodResolver(schema),
    });

    const onSubmit =  async (data: LoginSchemaData) => {
        const login = await loginUser(data.email, data.password)
        if (login.status === 'error') {
            toast.error(login.error || 'Something went wrong')
            return
        }
        toast.success('Successfully logged in')
        redirectPath(login.user.permissions)
    }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
        <CustomInput name='email' type='text' placeholder='Email' register={register} error={errors.email && errors.email.message}/>
        <CustomInput name='password' type='password' placeholder='Password' register={register} error={errors.password && errors.password.message} customClass='mt-2'/>
        <button type='submit' className='w-full py-1.5 px-4 bg-blue-600 rounded-md mt-3 hover:cursor-pointer'>Sign In</button>
    </form>
  )
}

export default SignInForm

import React, { useState } from 'react'
import { Button } from '../components/ui/button';

const Login = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [state, setState] = useState('Sign Up');

  const onSubmitHandler = async(event) => {

    event.preventDefault();
         
  }

  return (

    

    <form className='min-h-[80vh] flex items-center'>

      <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-sm shadow-lg bg-black'>
        <p className=' text-white text-2xl font-semibold' > { state === 'Sign Up' ? "Create Account" : "Login"} </p>
        <p className='text-slate-200'> Please { state === 'Sign Up' ? 'sign up' : 'log in'  } to book appointment </p>
        <div className='w-full'>
          <p className='text-slate-50'> Full Name </p>
          <input className='border border-zinc-300 rounded w-full p-2 mt-1' type='text' onChange={ (e) => setName(e.target.value)} value={name} required/>

        </div>
        <div className='w-full'>
          <p className='text-white'> Email </p>
          <input className='border border-zinc-300 rounded w-full p-2 mt-1' type='email' onChange={ (e) => setEmail(e.target.value)} value={email} required/>
          
        </div>
        { state === 'Sign Up'  &&
          <div className='w-full'>
            <p className='text-white' > Password </p>
            <input className='border border-zinc-300 rounded w-full p-2 mt-1' type='password' onChange={ (e) => setPassword(e.target.value)} value={password} required/>
            
          </div>
        }
        <Button variant='primary' className='w-full mt-4'> {state === 'Sign Up' ? 'Create Account' : 'Login'} </Button>
        {
          state === 'Sign Up' ? 
          <p className='text-white'> Already have an account? <span className='text-blue-500 cursor-pointer' onClick={() => setState('Login')}> Login </span> </p> :
          <p className='text-white'> Don't have an account? <span className='text-blue-500 cursor-pointer' onClick={() => setState('Sign Up')}> Sign Up </span> </p>
        }
      </div>

    

      
    </form>
  )
}

export default Login

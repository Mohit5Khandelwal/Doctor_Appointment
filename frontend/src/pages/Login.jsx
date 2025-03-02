
import React, { useContext, useEffect, useState } from 'react'
import { Button } from '../components/ui/button';
import axios from 'axios'
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';
import { BarLoader, BeatLoader, ClipLoader, GridLoader, MoonLoader, PulseLoader, RingLoader} from 'react-spinners'
import { useNavigate } from 'react-router-dom';


const Login = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [state, setState] = useState('Sign Up');
  const [loading, setLoading] = useState(false)

  const { token, setToken, backendUrl } = useContext( AppContext )

  const navigate = useNavigate();

  const onSubmitHandler = async(event) => {

    event.preventDefault();
    
    try 
    {
      if( state == 'Sign Up')
      {
        setLoading(true)
        // register user calling an api 
        const { data } = await axios.post( backendUrl + '/api/user/register', { name, password, email })

        if( data.success )
        {
          localStorage.setItem( 'token', data.token)
          setToken( data.token )
          toast.success( 'Register Successfully ')

        }
        else 
        {
          toast.error(  data.message )
        }


      }
      else 
      {
        setLoading(true)
        // Calling an login api 
        const { data } = await axios.post( backendUrl + '/api/user/login', { password, email })

        if( data.success )
        {
          localStorage.setItem( 'token', data.token)
          setToken( data.token )
          toast.success( 'Login Successfully ')

        }
        else 
        {
          toast.error(  data.message )
        }


      }
    }
    catch (error)
    {
      console.log( error )
      toast.error( error.message )

    }
    finally 
    {
      setLoading(false)
    }

  }

  // When token is present then redirect user to home page
  useEffect( () => {

    if( token )
    {
      navigate( '/' )
    }

  }, [token])

  return (

    

    <form onSubmit={ onSubmitHandler } className='min-h-[80vh] flex items-center'>


      <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-sm shadow-lg bg-black'>
        <p className=' text-white text-2xl font-semibold' > { state === 'Sign Up' ? "Create Account" : "Login"} </p>
        <p className='text-slate-200'> Please { state === 'Sign Up' ? 'sign up' : 'log in'  } to book appointment </p>
        { state == 'Sign Up' &&

          <div className='w-full'>
            
            <p className='text-slate-50'> Full Name </p>
            <input className='border border-zinc-300 rounded w-full p-2 mt-1' type='text' onChange={ (e) => setName(e.target.value)} value={name} required/>

          </div>
        }
        <div className='w-full'>
          <p className='text-white'> Email </p>
          <input className='border border-zinc-300 rounded w-full p-2 mt-1' type='email' onChange={ (e) => setEmail(e.target.value)} value={email} required/>
          
        </div>
        
          <div className='w-full'>
            <p className='text-white' > Password </p>
            <input className='border border-zinc-300 rounded w-full p-2 mt-1' type='password' onChange={ (e) => setPassword(e.target.value)} value={password} required/>
            
          </div>
          
          { loading && <RingLoader className='mx-auto mt-4' color="white" size={80} loading={loading}/> }

          {
            !loading &&
            <Button type='submit' variant='primary' className='w-full mt-4'> {state === 'Sign Up' ? 'Create Account' : 'Login'} </Button>

          }
{/*           
            {
              state === 'Sign Up' ? 
              <p className='text-white'> Already have an account? <span className='text-blue-500 cursor-pointer' onClick={() => setState('Login')}> Login </span> </p> :
              <p className='text-white'> Don't have an account? <span className='text-blue-500 cursor-pointer' onClick={() => setState('Sign Up')}> Sign Up </span> </p>
            } */}

    {!loading && (
      state === "Sign Up" ? (
        <p className="text-white">
          Already have an account?{" "}
          <span
            className="text-blue-500 cursor-pointer"
            onClick={() => setState("Login")}
          >
            Login
          </span>
        </p>
      ) : (
        <p className="text-white">
          Don't have an account?{" "}
          <span
            className="text-blue-500 cursor-pointer"
            onClick={() => setState("Sign Up")}
          >
            Sign Up
          </span>
        </p>
      )
    )}

            
      </div>

    

      
    </form>
  )
}

export default Login

import React, { useContext, useState } from 'react'
import { toast } from 'react-toastify'
import axios from 'axios'
import { AdminContext } from '../context/AdminContext'
import { useNavigate } from 'react-router-dom'

const Login = () => {
  const [state, setState] = useState('Admin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { setAToken, backendUrl } = useContext(AdminContext)
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const onSubmitHandler = async (event) => {
    event.preventDefault()
    setLoading(true)

    try {
      if (state === 'Admin') {
        const { data } = await axios.post(`${backendUrl}/api/admin/login`, { email, password })

        if (data.success) {
          localStorage.setItem('aToken', data.token)
          setAToken(data.token)
          toast.success("Login successful!")
          navigate('/admin-dashboard') // redirect after login
        } else {
          toast.error("Login failed: " + data.message)
        }
      } else {
        toast.info("Doctor login not implemented yet")
      }
    } catch (error) {
      console.error("Full error:", error) // logs entire error object
      console.error("Backend response:", error.response ? error.response.data : "No response from backend")
      
      // Show a meaningful toast
      if (error.response && error.response.data && error.response.data.message) {
        toast.error("Error: " + error.response.data.message)
      } else {
        toast.error("Something went wrong: " + error.message)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmitHandler} className='min-h-[80vh] flex items-center'>
      <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5e5e5e] text-sm shadow-lg'>
        <p className='text-2xl font-semibold m-auto'><span className='text-primary'> {state}</span> Login</p>

        <div className='w-full'>
          <p>Email</p>
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            className='border border-[#dadada] rounded w-full p-2 mt-1'
            type="email"
            required
          />
        </div>

        <div className='w-full'>
          <p>Password</p>
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            className='border border-[#dadada] rounded w-full p-2 mt-1'
            type="password"
            required
          />
        </div>

        <button disabled={loading} className='bg-primary text-white w-full py-2 rounded-md text-base'>
          {loading ? "Logging in..." : "Login"}
        </button>

        {
          state === 'Admin'
            ? <p>Doctor Login? <span className='text-primary underline cursor-pointer text-xs' onClick={() => setState('Doctor')}>Click Here</span></p>
            : <p>Admin Login? <span className='text-primary underline cursor-pointer text-xs' onClick={() => setState('Admin')}>Click Here</span></p>
        }
      </div>
    </form>
  )
}

export default Login

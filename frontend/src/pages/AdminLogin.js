import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

export default function AdminLogin() {

    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        username: '',
        password: ''
    })

    function handleChange(e) {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

  async function handleLogin(e){

    e.preventDefault()

    try{

        const res = await api.post(
            '/users/admin-login/',
            formData
        )

        console.log(res.data)

        localStorage.setItem(
            'role',
            res.data.role
        )

        navigate('/admin-dashboard')

    }catch(error){

        console.log(error.response?.data)
    }
}

  return (

    <div className='admin-login-page'>

        <div className='admin-login-card'>

            <div className='admin-login-top'>

                <div className='admin-icon'>
                    🛡️
                </div>

                <h1>Admin Login</h1>

                <p>
                    Election Management Portal
                </p>

            </div>

            <form
                onSubmit={handleLogin}
                className='admin-login-form'
            >

                <div className='admin-input-group'>

                    <label>
                        Username
                    </label>

                    <input
                        type='text'
                        name='username'
                        placeholder='Enter username'
                        onChange={handleChange}
                    />

                </div>

                <div className='admin-input-group'>

                    <label>
                        Password
                    </label>

                    <input
                        type='password'
                        name='password'
                        placeholder='Enter password'
                        onChange={handleChange}
                    />

                </div>

                <button type='submit'>

                    Login

                </button>

            </form>

        </div>

    </div>
)
}
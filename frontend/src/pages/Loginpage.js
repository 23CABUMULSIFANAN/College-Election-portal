import React, { useState } from 'react'
import api from '../services/api'
import { useNavigate } from 'react-router-dom'
import Nav from '../components/Nav'
import '../style/Login.css'
import Card from 'react-bootstrap/Card';


export default function Loginpage() {

    const [data, setData] = useState({
        roll_no: "",
        email: ""
    })

    const [otp, setOtp] = useState("")
    const [showOtpField, setShowOtpField] = useState(false)

    const navigate = useNavigate()

    function handleChange(e) {

        const { name, value } = e.target

        setData({
            ...data,
            [name]: value
        })
    }

    async function handleSubmit(e) {

        e.preventDefault()

        try {

            const response = await api.post(
                "/users/generate_otp/",
                data
            )

            console.log(response.data)

            alert("OTP Sent Successfully")

            setShowOtpField(true)

        }

        catch (error) {

            console.log(error.response?.data || error.message)

            alert("Failed To Send OTP")
        }
    }

   async function verifyOtp(e) {

    e.preventDefault()

    try {

        const response = await api.post(
            "/users/verify_otp/",
            {
                roll_no: data.roll_no,
                otp: otp
            }
        )

        console.log(response.data)

        // STORE ROLL NUMBER
        localStorage.setItem(
            "roll_no",
            data.roll_no
        )

        // CHECK STORAGE
        console.log(
            localStorage.getItem("roll_no")
        )

        alert("OTP Verified")

        navigate("/student")

    }

    catch (error) {

        console.log(
            error.response?.data || error.message
        )

        alert("Invalid OTP")
    }
}
    return (
<div>
    <Nav />

    <div className='login'>

        <Card className='login-card'>

            <div className='head'>
                <h2>Student Login</h2>
                <p>Your Vote. Your Voice.</p>
            </div>

            <form className='login-form' onSubmit={handleSubmit}>

                <div className='form-field'>
                    <label>Roll Number</label>

                    <input
                        type='text'
                        name='roll_no'
                        value={data.roll_no}
                        onChange={handleChange}
                        placeholder='Enter Roll Number'
                    />
                </div>

                <div className='form-field'>
                    <label>Email Address</label>

                    <input
                        type='email'
                        name='email'
                        value={data.email}
                        onChange={handleChange}
                        placeholder='Enter Email Address'
                    />
                </div>

                <button type="submit" className='login-btn'>
                    Generate OTP
                </button>

                {
                    showOtpField && (

                        <div className='otp-section'>

                            <div className='form-field'>
                                <label>Enter OTP</label>

                                <input
                                    type='text'
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    placeholder='Enter OTP'
                                />
                            </div>

                            <button
                                type="button"
                                className='verify-btn'
                                onClick={(e) => verifyOtp(e)}
                            >
                                Verify OTP
                            </button>

                        </div>
                    )
                }

            </form>

        </Card>

    </div>
</div>
    )
}
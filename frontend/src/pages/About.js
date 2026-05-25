
import React from 'react'
import Sidebar from '../components/Sidebar'
import '../style/Dashboard.css'

export default function About() {

    return (

        <div className='portal-layout'>

            <Sidebar />

            <div className='main-content'>

                <div className='about-card'>

                    <h1>About Election Portal</h1>

                    <p>
                        This online voting portal allows students
                        to securely vote for college election
                        candidates using OTP verification.
                    </p>

                    <p>
                        Features included:
                    </p>

                    <ul>
                        <li>OTP Login Authentication</li>
                        <li>Secure Voting System</li>
                        <li>Election Time Validation</li>
                        <li>Duplicate Vote Prevention</li>
                        <li>Real-time Election Results</li>
                    </ul>

                </div>

            </div>

        </div>
    )
}


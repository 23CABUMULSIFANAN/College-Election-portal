import React, { useEffect, useState } from 'react'
import CandidateCard from '../components/CandidateCard'
import Sidebar from '../components/Sidebar'
import '../style/Dashboard.css'

const POSITIONS = [
    {
        id: 'president',
        title: 'President',
        icon: '🏛️',
        description: 'Leads the student body and represents all students.',
    },
    {
        id: 'vice_president',
        title: 'Vice President',
        icon: '🤝',
        description: 'Supports the president and manages key committees.',
    },
    {
        id: 'secretary',
        title: 'Secretary',
        icon: '📋',
        description: 'Maintains records and coordinates communications.',
    },
]

export default function StudentDashboard() {

    const [user, setUser] = useState("")
    const [selectedPosition, setSelectedPosition] = useState(null)

    useEffect(() => {
        const student = localStorage.getItem("roll_no")
        setUser(student)
    }, [])

    return (
        <div className='portal-layout'>

            <Sidebar />

            <div className='main-content'>

                {/* Header */}
                <div className='dashboard-header'>
                    <div>
                        <h1>Student Voting Dashboard</h1>
                        <p>
                            Welcome,
                            <span className='user-name'>{user}</span>
                        </p>
                    </div>
                </div>

                {/* Election Banner */}
                <div className='election-banner'>
                    <h2>College Election 2026</h2>
                    <p>Select a position below to view and vote for candidates.</p>
                </div>

                {/* Position Selection */}
                {!selectedPosition && (
                    <>
                        <p className='section-label'>Choose a Position</p>
                        <div className='position-grid'>
                            {POSITIONS.map((pos) => (
                                <button
                                    key={pos.id}
                                    className='position-card'
                                    onClick={() => setSelectedPosition(pos)}
                                >
                                    <span className='position-icon'>{pos.icon}</span>
                                    <h3>{pos.title}</h3>
                                    <p>{pos.description}</p>
                                    <span className='position-cta'>View Candidates →</span>
                                </button>
                            ))}
                        </div>
                    </>
                )}

                {/* Candidate Cards for selected position */}
                {selectedPosition && (
                    <>
                        <div className='position-header'>
                            <button
                                className='back-btn'
                                onClick={() => setSelectedPosition(null)}
                            >
                                ← Back
                            </button>
                            <div>
                                <span className='position-badge'>
                                    {selectedPosition.icon} {selectedPosition.title}
                                </span>
                                <h2 className='position-heading'>
                                    Candidates for {selectedPosition.title}
                                </h2>
                            </div>
                        </div>

                        <CandidateCard position={selectedPosition.id} />
                    </>
                )}

            </div>
        </div>
    )
}
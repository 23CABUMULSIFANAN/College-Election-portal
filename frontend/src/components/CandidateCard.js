import React, { useState, useEffect } from 'react'
import api from '../services/api'
import '../style/Dashboard.css'

// Maps the position id from StudentDashboard to what your
// backend returns in the `position_name` field.
// Adjust these strings to exactly match your API response.
const POSITION_LABEL_MAP = {
    president:      'President',
    vice_president: 'VicePresident',
    secretary:      'Secretary',
}

export default function CandidateCard({ position }) {

    const [allCandidates, setAllCandidates] = useState([])
    const [voted, setVoted]                 = useState([])
    const [loading, setLoading]             = useState(true)

    // Fetch ALL candidates once
    useEffect(() => {
        async function fetchCandidates() {
            setLoading(true)
            try {
                const response = await api.get('/election/candidates/')
                setAllCandidates(response.data)
            } catch (error) {
                console.log(error.response?.data || error.message)
                alert('Failed to fetch candidates')
            } finally {
                setLoading(false)
            }
        }
        fetchCandidates()
    }, [])

    // Filter by position_name that matches the selected position
    const positionLabel = POSITION_LABEL_MAP[position] || position
    const filtered = allCandidates.filter(
        (c) => c.position_name?.toLowerCase() === positionLabel.toLowerCase()
    )

    async function handleVote(candidateId) {
        if (voted.includes(candidateId)) return

        const rollnumber = localStorage.getItem('roll_no')
        try {
            await api.post('/election/vote/', {
                roll_no: rollnumber,
                candidate_id: candidateId,
            })
            alert('Vote Cast Successfully')
            setVoted((prev) => [...prev, candidateId])
        } catch (error) {
            console.log(error.response?.data || error.message)
            alert(error.response?.data?.error || 'Voting Failed')
        }
    }

    if (loading) {
        return <h2 className='loading-text'>Loading Candidates...</h2>
    }

    if (filtered.length === 0) {
        return (
            <div className='no-candidates'>
                <span>🙁</span>
                <p>No candidates registered for this position yet.</p>
            </div>
        )
    }

    return (
        <div className='candidate-container'>
            {filtered.map((item) => (
                <div className='candidate-card' key={item.id}>

                    <div className='candidate-top'>
                        <div className='candidate-avatar'>
                            {item.student_name.charAt(0)}
                        </div>
                        <div>
                            <h3>{item.student_name}</h3>
                            <p>{item.position_name}</p>
                        </div>
                    </div>

                    <button
                        className='vote-btn'
                        onClick={() => handleVote(item.id)}
                        disabled={voted.includes(item.id)}
                    >
                        {voted.includes(item.id) ? '✓ Voted' : 'Vote Now'}
                    </button>

                </div>
            ))}
        </div>
    )
}
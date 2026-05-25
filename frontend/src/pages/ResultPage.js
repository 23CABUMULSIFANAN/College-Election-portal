import React, { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar'
import api from '../services/api'
import '../style/Dashboard.css'

export default function Results() {

    const [results, setResults]       = useState([])
    const [loading, setLoading]       = useState(true)
    const [revealed, setRevealed]     = useState(false) // backend flag

    useEffect(() => {
        async function fetchResults() {
            setLoading(true)
            try {
                // 1. Check if admin has allowed results to be visible
                //    Your backend should return: { released: true/false }
                const statusRes = await api.get('/election/results/status/')
                const isReleased = statusRes.data?.released

                setRevealed(isReleased)

                // 2. Only fetch actual results if released
                if (isReleased) {
                    const resultsRes = await api.get('/election/results/')
                    setResults(resultsRes.data)
                }

            } catch (error) {
                console.log(error.response?.data || error.message)
            } finally {
                setLoading(false)
            }
        }

        fetchResults()
    }, [])

    // Group results by position
    const grouped = results.reduce((acc, item) => {
        const pos = item.position || 'Other'
        if (!acc[pos]) acc[pos] = []
        acc[pos].push(item)
        return acc
    }, {})

    // Find max votes in a group for progress bar width
    function getMax(group) {
        return Math.max(...group.map(c => c.total_votes || 0), 1)
    }

    const POSITION_ICONS = {
        'President':      '🏛️',
        'Vice President': '🤝',
        'Secretary':      '📋',
    }

    return (
        <div className='portal-layout'>

            <Sidebar />

            <div className='main-content'>

                {/* Header */}
                <div className='dashboard-header'>
                    <div>
                        <h1>Election Results</h1>
                        <p>College Election 2026 — Final Standings</p>
                    </div>
                </div>

                {/* Loading */}
                {loading && (
                    <h2 className='loading-text'>Checking results...</h2>
                )}

                {/* Results NOT released — locked screen */}
                {!loading && !revealed && (
                    <div className='results-locked'>
                        <div className='lock-icon'>🔒</div>
                        <h2>Results Not Released Yet</h2>
                        <p>
                            The election results are currently hidden.
                            Please wait for the admin to release them.
                        </p>
                        <div className='lock-badge'>Admin approval required</div>
                    </div>
                )}

                {/* Results released — show data */}
                {!loading && revealed && (

                    <>
                        <div className='results-banner'>
                            <span>🎉</span>
                            <div>
                                <h2>Results are Live!</h2>
                                <p>Official results released by the election committee.</p>
                            </div>
                        </div>

                        {Object.keys(grouped).map((position) => {

                            const group   = grouped[position]
                            const maxVotes = getMax(group)
                            const winner  = group.reduce((a, b) =>
                                (a.total_votes || 0) >= (b.total_votes || 0) ? a : b
                            )

                            return (
                                <div className='result-section' key={position}>

                                    <div className='result-section-title'>
                                        <span>{POSITION_ICONS[position] || '🗳️'}</span>
                                        <h3>{position}</h3>
                                    </div>

                                    <div className='result-cards'>
                                        {group
                                            .sort((a, b) => (b.total_votes || 0) - (a.total_votes || 0))
                                            .map((candidate, index) => {

                                                const isWinner = candidate.candidate === winner.candidate
                                                const pct = Math.round(
                                                    ((candidate.total_votes || 0) / maxVotes) * 100
                                                )

                                                return (
                                                    <div
                                                        className={`result-card ${isWinner ? 'result-winner' : ''}`}
                                                        key={index}
                                                    >
                                                        {isWinner && (
                                                            <div className='winner-crown'>👑 Winner</div>
                                                        )}

                                                        <div className='result-card-top'>
                                                            <div className='result-rank'>#{index + 1}</div>
                                                            <div className='candidate-avatar'>
                                                                {candidate.candidate?.charAt(0)}
                                                            </div>
                                                            <div className='result-info'>
                                                                <h4>{candidate.candidate}</h4>
                                                                <p>{candidate.position}</p>
                                                            </div>
                                                            <div className='result-votes'>
                                                                <span className='vote-count'>
                                                                    {candidate.total_votes || 0}
                                                                </span>
                                                                <span className='vote-label'>votes</span>
                                                            </div>
                                                        </div>

                                                        {/* Progress bar */}
                                                        <div className='result-bar-bg'>
                                                            <div
                                                                className={`result-bar ${isWinner ? 'result-bar-winner' : ''}`}
                                                                style={{ width: `${pct}%` }}
                                                            />
                                                        </div>

                                                    </div>
                                                )
                                            })
                                        }
                                    </div>

                                </div>
                            )
                        })}
                    </>
                )}

            </div>
        </div>
    )
}
import React, { useEffect, useState } from 'react'
import AdminSidebar from '../components/AdminSidebar'
import api from '../services/api'
import '../style/Dashboard.css'

export default function AdminDashboard() {

    const [studentsCount, setStudentsCount] = useState(0)
    const [candidatesCount, setCandidatesCount] = useState(0)
    const [votesCount, setVotesCount] = useState(0)
    const [released, setReleased] = useState(false)

    useEffect(() => {

        fetchDashboardData()

    }, [])

    async function fetchDashboardData(){

        try{

            const studentsRes = await api.get('/users/student/')

const candidatesRes = await api.get('/election/candidates/')

const resultsRes = await api.get('/election/results/status/')

const votesRes = await api.get('/election/results/')

            setStudentsCount(studentsRes.data.length)
            setCandidatesCount(candidatesRes.data.length)
            setReleased(resultsRes.data.released)
           const totalVotes = votesRes.data.reduce(

    (sum, item) => sum + item.total_votes,

    0
)

setVotesCount(totalVotes)

        }catch(error){

            console.log(error.response?.data)
        }
    }

    return (

        <div className='portal-layout'>

            <AdminSidebar />

            <div className='main-content'>

                <div className='dashboard-header'>
                    <div>
                        <h1>Admin Dashboard</h1>
                        <p>
                            Election Management System
                        </p>
                    </div>
                </div>

                <div className='dashboard-grid'>

                    <div className='dashboard-card admin-card'>
                        <div className='admin-card-icon'>🎓</div>
                        <h2>{studentsCount}</h2>
                        <p>Total Students</p>
                    </div>

                    <div className='dashboard-card admin-card'>
                        <div className='admin-card-icon'>🧑‍💼</div>
                        <h2>{candidatesCount}</h2>
                        <p>Total Candidates</p>
                    </div>

                    <div className='dashboard-card admin-card'>
                        <div className='admin-card-icon'>🗳️</div>
                        <h2>{votesCount}</h2>
                        <p>Total Votes</p>
                    </div>

                    <div className='dashboard-card admin-card'>
                        <div className='admin-card-icon'>📢</div>

                        <h2>
                            {
                                released
                                ? 'Released'
                                : 'Hidden'
                            }
                        </h2>

                        <p>Results Status</p>
                    </div>

                </div>

                <div className='admin-welcome-box'>

                    <h2>Admin Controls</h2>

                    <p>
                        Manage candidates, control election results,
                        and monitor the voting system from here.
                    </p>

                </div>

            </div>

        </div>
    )
}
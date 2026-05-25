import React, { useEffect, useState } from 'react'
import api from '../services/api'
import AdminSidebar from '../components/AdminSidebar'
import '../style/Dashboard.css'

export default function AdminResults() {

    const [released, setReleased] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {

        fetchStatus()

    }, [])

    async function fetchStatus(){

        try{

            const res = await api.get(
                '/election/results/status/'
            )

            setReleased(res.data.released)

        }catch(error){

            console.log(error.response?.data)

        }finally{

            setLoading(false)
        }
    }

    async function toggleResults(){

        try{

            const res = await api.post(
                '/election/results/toggle/'
            )

            setReleased(res.data.released)

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
                        <h1>Results Control</h1>

                        <p>
                            Manage election result visibility
                        </p>
                    </div>

                </div>

                {
                    loading
                    ? (
                        <h2 className='loading-text'>
                            Loading...
                        </h2>
                    )
                    : (
                        <div className='results-admin-card'>

                            <div className='results-status-icon'>

                                {
                                    released
                                    ? '🟢'
                                    : '🔴'
                                }

                            </div>

                            <h2>

                                {
                                    released
                                    ? 'Results Released'
                                    : 'Results Hidden'
                                }

                            </h2>

                            <p>

                                {
                                    released
                                    ? 'Students can now view election results.'
                                    : 'Results are currently hidden from students.'
                                }

                            </p>

                            <button
                                className={
                                    released
                                    ? 'hide-results-btn'
                                    : 'release-results-btn'
                                }
                                onClick={toggleResults}
                            >

                                {
                                    released
                                    ? 'Hide Results'
                                    : 'Release Results'
                                }

                            </button>

                        </div>
                    )
                }

            </div>

        </div>
    )
}
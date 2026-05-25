import React from 'react'
import AdminSidebar from '../components/AdminSidebar'
import { useState,useEffect} from 'react'
import api from '../services/api'
export default function AdminCandidates(){
const [candidates, setCandidates] = useState([])
async function fetchCandidates(){

    try{

        const res = await api.get(
            '/election/candidates/'
        )

        setCandidates(res.data)

    }catch(error){

        console.log(error.response?.data)
    }
}
useEffect(() => {

    fetchCandidates()
    fetchPositions()
    fetchStudents()

}, [])
const [formData, setFormData] = useState({
    student: '',
    position: ''
})
function handleChange(e){

    setFormData({
        ...formData,
        [e.target.name]: e.target.value
    })
}
const [students, setStudents] = useState([])
const [positions, setPositions] = useState([])
async function fetchStudents(){

    try{

        const res = await api.get(
            '/users/student/'
        )

        setStudents(res.data)

    }catch(error){

        console.log(error.response?.data)
    }
}
async function fetchPositions(){

    try{

        const res = await api.get(
            '/election/positions/'
        )

        setPositions(res.data)

    }catch(error){

        console.log(error.response?.data)
    }
}
async function handleAddCandidate(e){

    e.preventDefault()

    try{

        await api.post(
            '/election/candidates/',
            formData
        )

        fetchCandidates()

        setFormData({
            student: '',
            position: ''
        })

    }catch(error){

        console.log(error.response?.data)
    }
}
async function handleDelete(id){

    try{

        await api.delete(
            `/election/candidates/${id}/`
        )

        fetchCandidates()

    }catch(error){

        console.log(error.response?.data)
    }
}

    return(

        <div className='portal-layout'>

            <AdminSidebar />

           <div className='main-content'>

    <div className='dashboard-header'>

        <div>
            <h1>Manage Candidates</h1>

            <p>
                Add and remove election candidates
            </p>
        </div>

    </div>

    {/* ADD FORM */}

    <div className='candidate-form-card'>

        <h2>Add Candidate</h2>

        <form
            onSubmit={handleAddCandidate}
            className='candidate-form'
        >

            <select
                name='student'
                value={formData.student}
                onChange={handleChange}
            >

                <option value=''>
                    Select Student
                </option>

                {
                    students.map(student => (

                        <option
                            key={student.id}
                            value={student.id}
                        >
                            {student.name}
                        </option>
                    ))
                }

            </select>

            <select
                name='position'
                value={formData.position}
                onChange={handleChange}
            >

                <option value=''>
                    Select Position
                </option>

                {
                    positions.map(position => (

                        <option
                            key={position.id}
                            value={position.id}
                        >
                            {position.pos_name}
                        </option>
                    ))
                }

            </select>

            <button type='submit'>
                Add Candidate
            </button>

        </form>

    </div>

    {/* CANDIDATE LIST */}

    <div className='candidate-grid'>

        {
            candidates.map(candidate => (

                <div
                    className='candidate-admin-card'
                    key={candidate.id}
                >

                    <div className='candidate-avatar-admin'>

                        {
                            candidate.student_name?.charAt(0)
                        }

                    </div>

                    <h3>
                        {candidate.student_name}
                    </h3>

                    <p>
                        {candidate.position_name}
                    </p>

                    <button
                        className='delete-btn'
                        onClick={() => handleDelete(candidate.id)}
                    >
                        Delete
                    </button>

                </div>

            ))
        }

    </div>

</div>

        </div>
    )
}
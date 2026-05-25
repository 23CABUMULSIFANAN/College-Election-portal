import {
    BrowserRouter,
    Routes,
    Route,
    Navigate

} from 'react-router-dom'
import AdminLogin from './pages/AdminLogin'
import AdminProtectedRoute from './route/AdminProtectedRoute'
import Loginpage from './pages/Loginpage'
import AdminResults from './pages/AdminResults'
import AdminCandidates from './pages/AdminCandidates'
import StudentDashboard from './pages/StudentDashboard'
import AdminDashboard from './pages/Admindashboard'

import ResultsPage from './pages/ResultPage'
import About from './pages/About'

import ProtectedRoute from './route/ProtectedRoute'

function App() {

    return (

        <BrowserRouter>

            <Routes>

                {/* STUDENT LOGIN */}
                <Route
                    path='/'
                    element={<Loginpage />}
                />
<Route
    path='/admin-login'
    element={<AdminLogin />}
/>
                {/* ADMIN LOGIN */}
                <Route
    path='/admin-dashboard'
    element={
        <AdminProtectedRoute>
            <AdminDashboard />
        </AdminProtectedRoute>
    }
/>

                {/* STUDENT DASHBOARD */}
                <Route
                    path='/student'
                    element={
                        <ProtectedRoute>
                            <StudentDashboard />
                        </ProtectedRoute>
                    }
                />

                {/* RESULTS */}
                <Route
                    path='/results'
                    element={
                        <ProtectedRoute>
                            <ResultsPage />
                        </ProtectedRoute>
                    }
                />

                {/* ABOUT */}
                <Route
                    path='/about'
                    element={
                        <ProtectedRoute>
                            <About />
                        </ProtectedRoute>
                    }
                />

                {/* ADMIN DASHBOARD */}
                <Route
                    path='/admin-dashboard'
                    element={
                        localStorage.getItem('role') === 'admin'
                        ? <AdminDashboard />
                        : <Navigate to="/admin-login" />
                    }
                />
<Route
    path='/admin-results'
    element={
        <AdminProtectedRoute>
            <AdminResults />
        </AdminProtectedRoute>
    }
/>
<Route
    path='/admin-candidates'
    element={
        <AdminProtectedRoute>
            <AdminCandidates />
        </AdminProtectedRoute>
    }
/>
            </Routes>

        </BrowserRouter>
    )
}

export default App
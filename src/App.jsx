import { BrowserRouter, Routes, Route } from 'react-router-dom'
import MainLayout from './components/layout/MainLayout'
import Home from './pages/Home'
import Courses from './pages/Courses'
import Patterns from './pages/Patterns'
import Tools from './pages/Tools'
import Resources from './pages/Resources'
import ResourceDetail from './pages/ResourceDetail'
import Membership from './pages/Membership'
import Studio from './pages/Studio'
import Gallery from './pages/Gallery'
import Activate from './pages/Activate'
import Login from './pages/Login'
import MyCourses from './pages/MyCourses'
import ProtectedRoute from './components/auth/ProtectedRoute'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="courses" element={<Courses />} />
          <Route path="patterns" element={<Patterns />} />
          <Route path="tools" element={<Tools />} />
          <Route path="resources" element={<Resources />} />
          <Route path="resources/:slug" element={<ResourceDetail />} />
          <Route path="membership" element={<Membership />} />
          <Route path="studio" element={<Studio />} />
          <Route path="gallery" element={<Gallery />} />

          {/* Authentication routes */}
          <Route path="activate" element={<Activate />} />
          <Route path="login" element={<Login />} />

          {/* Protected routes */}
          <Route
            path="my-courses"
            element={
              <ProtectedRoute>
                <MyCourses />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App

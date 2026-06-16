/* eslint-disable react/prop-types */
import { BrowserRouter, Routes, Route, useParams, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
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
import Register from './pages/Register'
import MyCourses from './pages/MyCourses'
import AdminCodes from './pages/AdminCodes'
import ProtectedRoute from './components/auth/ProtectedRoute'
import CourseOverview from './pages/CourseOverview'
import LessonDetail from './pages/LessonDetail'
import Checkout from './pages/Checkout'
import AdminOrders from './pages/AdminOrders'
import AdminProducts from './pages/AdminProducts'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

function CourseProtected({ children }) {
  const { courseId } = useParams()
  return <ProtectedRoute courseId={courseId}>{children}</ProtectedRoute>
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
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
          <Route path="checkout" element={<Checkout />} />

          {/* Authentication routes */}
          <Route path="activate" element={<Activate />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />

          {/* Protected routes */}
          <Route
            path="my-courses"
            element={
              <ProtectedRoute>
                <MyCourses />
              </ProtectedRoute>
            }
          />

          {/* Course detail routes - protected */}
          <Route
            path="courses/:courseId"
            element={
              <CourseProtected>
                <CourseOverview />
              </CourseProtected>
            }
          />
          <Route
            path="courses/:courseId/lessons/:lessonIndex"
            element={
              <CourseProtected>
                <LessonDetail />
              </CourseProtected>
            }
          />

          {/* Admin routes */}
          <Route path="admin/codes" element={<AdminCodes />} />
          <Route path="admin/orders" element={<AdminOrders />} />
          <Route path="admin/products" element={<AdminProducts />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App

import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router'
import Layout from './components/Layout'
import LoadingState from './components/LoadingState'
import BoardPage from './pages/BoardPage'
import ContactPage from './pages/ContactPage'
import HomePage from './pages/HomePage'
import NotFoundPage from './pages/NotFoundPage'
import PostPage from './pages/PostPage'
import ProjectsPage from './pages/ProjectsPage'
import PublicationsPage from './pages/PublicationsPage'

// 관리자 페이지는 /admin 접속 시에만 내려받습니다.
const AdminPage = lazy(() => import('./pages/admin/AdminPage'))

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="publications" element={<PublicationsPage />} />
        <Route path="projects" element={<ProjectsPage />} />
        <Route path="board" element={<BoardPage />} />
        <Route path="board/:postId" element={<PostPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route
          path="admin"
          element={
            <Suspense fallback={<LoadingState />}>
              <AdminPage />
            </Suspense>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

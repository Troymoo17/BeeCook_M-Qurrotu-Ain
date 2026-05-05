import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import ListPage from './pages/ListPage'
import DetailPage from './pages/DetailPage'
import ManagePage from './pages/ManagePage'
import ManageFormPage from './pages/ManageFormPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/list" element={<ListPage />} />
        <Route path="/list/:slug" element={<DetailPage />} />
        <Route path="/manage" element={<ManagePage />} />
        <Route path="/manage/add" element={<ManageFormPage />} />
        <Route path="/manage/edit/:id" element={<ManageFormPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Lesson from './Lesson.tsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Lesson fileName='languages/de/set1.md' />
  </StrictMode>,
)

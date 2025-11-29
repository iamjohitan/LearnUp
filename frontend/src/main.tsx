import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import GroupsChat from './pages/groups'
import Login from './pages/LoginPage'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GroupsChat groupId={'2ad6ddaa-72a1-432c-9014-6ffcd7122a11'} />
  </StrictMode>,
)

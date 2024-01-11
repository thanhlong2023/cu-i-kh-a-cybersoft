import { lazy } from 'react'
// ----------------------------
import { createBrowserRouter } from 'react-router-dom'
import AuthTemplate from '~/templates/auth/auth.template'
// ----------------------------
const Home = lazy(() => import('~/pages/board/board'))
const CreatTask = lazy(() => import('~/pages/CreatTask/CreatTask'))
const ProjectManagement = lazy(() =>
  import('~/pages/project management/ProjectManagement')
)
const CreatProject = lazy(() => import('~/pages/creat project/CreatProject'))

const Register = lazy(() => import('~/pages/register/register'))
const Login = lazy(() => import('~/pages/login/login'))
// const EditTask = lazy(() => import('~/pages/EditTask/EditTask'))

const BTest = lazy(() => import('~/pages/board/boardTest'))
const User = lazy(() => import('~/pages/userManagement/userManagement'))

// ------- Template sẽ rất nhẹ chúng ta không cần lazy load -------
import HomeTemplate from '~/templates/home/home.template'

export const router = createBrowserRouter([
  {
    element: <HomeTemplate />,
    children: [
      // {
      //   path: '/projectdetail/:idDetail', // -> /
      //   element: <Home />
      // },
      {
        path: 'task',
        element: <CreatTask />
      },
      {
        path: 'projectMana',
        element: <ProjectManagement />
      },
      {
        path: 'creat',
        element: <CreatProject />
      },
      {
        path: '/projectdetail/:idDetail', // -> /
        element: <BTest />
      },
      {
        path: 'user', // -> /
        element: <User />
      }
    ]
  },
  {
    element: <AuthTemplate />,
    children: [
      {
        path: '', // -> /
        element: <Login />
      },
      {
        path: 'register', // -> /
        element: <Register />
      }
    ]
  }
])

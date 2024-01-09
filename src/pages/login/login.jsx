import { Box } from '@mui/material'
import { Link, useNavigate } from 'react-router-dom'

import * as Y from 'yup'

import { useDispatch } from 'react-redux'

import { useFormik } from 'formik'
import { signIn } from '~/services/user.service'
import { saveLocal } from '~/utils'
import { ACCESS_TOKEN, Avatar_signined, Email_signined } from '~/constants'
import { loginSuccess } from '~/redux/userSlice'
import imgBg from '~/assets/img/bg.jpg'

const validationSchema = Y.object({
  email: Y.string().email().required(),
  passWord: Y.string().required()
})

function Login() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { handleSubmit, getFieldProps, touched, errors } = useFormik({
    initialValues: {
      email: '',
      passWord: ''
    },

    validationSchema,

    onSubmit: (values) => {
      signIn(values).then((resp) => {
        saveLocal(ACCESS_TOKEN, resp.accessToken)
        saveLocal(Email_signined, resp.email)
        saveLocal(Avatar_signined, resp.avatar)
        dispatch(
          loginSuccess({
            email: resp.email
          })
        )
        navigate('/')
      })
    }
  })
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        paddingTop: '50px'
      }}
    >
      {/* <img src={imgBg} alt="" style={{ opacity: '0.1' }} /> */}
      <form
        className="w-25"
        style={{
          boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px',
          padding: '40px 20px'
        }}
        onSubmit={handleSubmit}
      >
        <h1 className="text-center">Login</h1>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email address
          </label>
          <input
            className="form-control"
            id="email"
            {...getFieldProps('email')}
          />
          {touched.email && errors.email && (
            <p className="text-danger">{errors.email}</p>
          )}
        </div>
        <div className="mb-3">
          <label htmlFor="passWord" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="passWord"
            {...getFieldProps('passWord')}
          />
          {touched.passWord && errors.passWord && (
            <p className="text-danger">{errors.passWord}</p>
          )}
        </div>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
          <p className="pt-3">
            Đã có tài khoản <Link to={'/register'}>Đăng ký</Link>
          </p>
        </Box>
      </form>
    </Box>
  )
}

export default Login

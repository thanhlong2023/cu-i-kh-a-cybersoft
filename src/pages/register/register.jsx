import { useState } from 'react'
import { useFormik } from 'formik'

import * as Y from 'yup'

import { Link, useNavigate } from 'react-router-dom'

import { Box } from '@mui/material'
import { signUp } from '~/services/user.service'

const validationSchema = Y.object({
  email: Y.string().email('Email không hợp lệ.').required(),
  name: Y.string()
    .min(6, 'Không được phép nhỏ hơn 10')
    .max(30, 'Không được phép lớn hơn 30')
    .required(),
  passWord: Y.string().min(6).max(50).required(),
  phoneNumber: Y.number().required()
})

function Register() {
  const navigate = useNavigate()

  const { handleSubmit, getFieldProps, touched, errors } = useFormik({
    initialValues: {
      email: '',
      passWord: '',
      name: '',
      phoneNumber: ''
    },

    validationSchema,

    onSubmit: (values) => {
      const payload = {
        email: values.email,
        passWord: values.passWord,
        phoneNumber: values.phoneNumber,
        name: values.name
      }
      // console.log(payload)
      signUp(payload)
        .then((resp) => {
          alert('Đăng ký thành công')
          navigate('/login')
        })
        .catch((err) => {
          alert('Đăng ký thất bại')
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
      <form
        className="w-25"
        style={{
          boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px',
          padding: '40px 20px'
        }}
        onSubmit={handleSubmit}
      >
        <h1 className="text-center">Register</h1>
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
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="password"
            {...getFieldProps('passWord')}
          />
          {touched.passWord && errors.passWord && (
            <p className="text-danger">{errors.passWord}</p>
          )}
        </div>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Name
          </label>
          <input
            className="form-control"
            id="name"
            {...getFieldProps('name')}
          />
          {touched.name && errors.name && (
            <p className="text-danger">{errors.name}</p>
          )}
        </div>
        <div className="mb-3">
          <label htmlFor="phoneNumber" className="form-label">
            Phone number
          </label>
          <input
            className="form-control"
            id="phoneNumber"
            {...getFieldProps('phoneNumber')}
          />
          {touched.phoneNumber && errors.phoneNumber && (
            <p className="text-danger">{errors.phoneNumber}</p>
          )}
        </div>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
          <p className="pt-3">
            Đã có tài khoản <Link to={'/login'}>Đăng nhập</Link>
          </p>
        </Box>
      </form>
    </Box>
  )
}

export default Register

import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  login: {
    email: ''
  }
}

const userSlice = createSlice({
  name: 'userSlice',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.login.email = action.payload.email
    },

    setLogin: (state, action) => {
      state.login.email = action.payload.email
    }
  }
})

export const userReducer = userSlice.reducer

export const { loginSuccess, setLogin } = userSlice.actions

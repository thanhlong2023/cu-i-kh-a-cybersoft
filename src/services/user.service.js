import { axiosAuth } from './axios.config'

export const signIn = async (data) => {
  try {
    const resp = await axiosAuth('/Users/signin', {
      method: 'POST',
      data
    })

    return resp.data.content
  } catch (error) {
    throw new Error(error)
  }
}
export const signUp = async (data) => {
  try {
    const resp = await axiosAuth('/Users/signup', {
      method: 'POST',
      data
    })

    return resp.data.content
  } catch (error) {
    throw new Error(error)
  }
}
export const getUser = async () => {
  try {
    const resp = await axiosAuth('/Users/getUser')

    return resp.data.content
  } catch (error) {
    throw new Error(error)
  }
}
export const editUser = async (data) => {
  try {
    const resp = await axiosAuth('/Users/editUser', {
      data, method: 'PUT'
    })

    return resp.data.content
  } catch (error) {
    throw new Error(error)
  }
}
export const deleteUser = async (id) => {
  try {
    const resp = await axiosAuth('/Users/deleteUser?', {
      method: 'DELETE',
      params: id
    })

    return resp.data.content
  } catch (error) {
    throw new Error(error)
  }
}
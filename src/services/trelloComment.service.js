import { axiosAuth } from './axios.config'

export const insertComment = async (data) => {
  try {
    const resp = await axiosAuth('/Comment/insertComment', {
      method: 'POST',
      data
    })

    return resp.data.content
  } catch (error) {
    throw new Error(error)
  }
}
export const deleteComment = async (id) => {
  try {
    const resp = await axiosAuth(`/Comment/deleteComment?idComment=${id}`, {
      method: 'DELETE'
    })

    return resp.data.content
  } catch (error) {
    throw new Error(error)
  }
}

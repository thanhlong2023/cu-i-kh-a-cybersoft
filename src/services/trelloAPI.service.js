import { axiosAuth } from './axios.config'

export const getProjectCategory = async () => {
  try {
    const resp = await axiosAuth('/ProjectCategory')

    return resp.data.content
  } catch (error) {
    throw new Error(error)
  }
}

export const getAllProject = async () => {
  try {
    const resp = await axiosAuth('/Project/getAllProject')

    return resp.data.content
  } catch (error) {
    throw new Error(error)
  }
}
export const getProjectDetail = async (id) => {
  try {
    const resp = await axiosAuth(`/Project/getProjectDetail?id=${id}`)

    return resp.data.content
  } catch (error) {
    throw new Error(error)
  }
}
export const deleteProject = async (projectId) => {
  try {
    const resp = await axiosAuth('/Project/deleteProject?',
      {
        method: 'DELETE',
        params: { projectId }
      })

    return resp.data.content
  } catch (error) {
    throw new Error(error)
  }
}
export const createProjectAuthorize = async (data) => {
  try {
    const resp = await axiosAuth('/Project/createProjectAuthorize',
      {
        method: 'POST',
        data
      })

    return resp.data.content
  } catch (error) {
    throw new Error(error)
  }
}
export const getUser = async (keyword) => {
  try {
    const resp = await axiosAuth('/Users/getUser?',
      {
        params: { keyword }
      })

    return resp.data.content
  } catch (error) {
    throw new Error(error)
  }
}
export const assignUserProject = async (data) => {
  try {
    const resp = await axiosAuth('/Project/assignUserProject',
      {
        method: 'POST',
        data
      })

    return resp.data.content
  } catch (error) {
    throw new Error(error)
  }
}

export const removeUserFromProject = async (data) => {
  try {
    const resp = await axiosAuth('/Project/removeUserFromProject',
      {
        method: 'POST',
        data
      })

    return resp.data.content
  } catch (error) {
    throw new Error(error)
  }
}
export const updateProject = async (data, projectId) => {
  try {
    const resp = await axiosAuth(`/Project/updateProject?projectId=${projectId}`,
      {
        method: 'PUT',
        data
      })

    return resp.data.content
  } catch (error) {
    throw new Error(error)
  }
}
export const getProjectByName = async (keyword) => {
  try {
    const resp = await axiosAuth('/Project/getAllProject?',
      {
        params: { keyword }
      })

    return resp.data.content
  } catch (error) {
    throw new Error(error)
  }
}
export const getStatus = async () => {
  try {
    const resp = await axiosAuth('/Status/getAll')

    return resp.data.content
  } catch (error) {
    throw new Error(error)
  }
}

export const getPriority = async () => {
  try {
    const resp = await axiosAuth('/Priority/getAll')

    return resp.data.content
  } catch (error) {
    throw new Error(error)
  }
}
export const getTaskType = async () => {
  try {
    const resp = await axiosAuth('/TaskType/getAll')

    return resp.data.content
  } catch (error) {
    throw new Error(error)
  }
}
export const addUserTask = async (keyword) => {
  try {
    const resp = await axiosAuth('/Users/getUser?', {
      params: keyword
    })

    return resp.data.content
  } catch (error) {
    throw new Error(error)
  }
}
export const getUserByProjectId = async (idProject) => {
  try {
    const resp = await axiosAuth(`/Users/getUserByProjectId?idProject=${idProject}`)

    return resp.data.content
  } catch (error) {
    throw new Error(error)
  }
}
export const createTask = async (data, id) => {
  try {
    const resp = await axiosAuth('/Project/createTask',
      {
        method: 'POST',
        data
      })
    await axiosAuth(`/Project/getProjectDetail?id=${id}`)
    return resp.data.content
  } catch (error) {
    throw new Error(error)
  }
}
export const getTaskDetail = async (id) => {
  try {
    const resp = await axiosAuth(`/Project/getTaskDetail?taskId=${id}`)

    return resp.data.content
  } catch (error) {
    throw new Error(error)
  }
}
export const updateStatus = async (data) => {
  try {
    const resp = await axiosAuth('/Project/updateStatus',
      {
        method: 'PUT',
        data
      })
    // const resp1 = await axiosAuth(`/Project/getProjectDetail?id=${id}`)
    return resp.data.content
  } catch (error) {
    throw new Error(error)
  }
}
export const updatePriority = async (data) => {
  try {
    const resp = await axiosAuth('/Project/updatePriority',
      {
        method: 'PUT',
        data
      })

    return resp.data.content
  } catch (error) {
    throw new Error(error)
  }
}
export const updateTask = async (data) => {
  try {
    const resp = await axiosAuth('/Project/updateTask',
      {
        method: 'POST',
        data
      })

    return resp.data.content
  } catch (error) {
    throw new Error(error)
  }
}
export const removeTask = async (taskId) => {
  try {
    const resp = await axiosAuth('/Project/removeTask?',
      {
        method: 'DELETE',
        params: { taskId }
      })

    return resp.data.content
  } catch (error) {
    throw new Error(error)
  }
}
export const removeUserFromTask = async (data) => {
  try {
    const resp = await axiosAuth('/Project/removeUserFromTask',
      {
        method: 'POST',
        data
      })

    return resp.data.content
  } catch (error) {
    throw new Error(error)
  }
}
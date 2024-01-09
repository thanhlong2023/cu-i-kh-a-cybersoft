export const IIFE = (fn) => {
  fn()
}
export const saveLocal = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data))
}

export const getLocal = (key) => {
  const resp = localStorage.getItem(key)
  if (resp) {
    return JSON.parse(resp)
  }
}

export const removeLocal = (key) => {
  localStorage.removeItem(key)
}

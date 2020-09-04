import {useState, useCallback} from 'react'

// create new hook
export const useHttp = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const request = useCallback (async (url, method = 'GET', body = null, headers = {}) => {
    setLoading(true)
    try {
      // body is an object contains form fields
      if (body) { 
        body = JSON.stringify(body)
        headers['Content-Type'] = 'application/json'
      }
      // make request to backend
      const response = await fetch(url, {method, body, headers})
      const data = await response.json()

      // error in response
      if (!response.ok) {
        // process array 'errors' if exist
        if (data.errors !== undefined && data.errors.length > 0) {
          for (let error of data.errors) {
            throw new Error (error.msg)
          }
        }
        // process string 'message'
        throw new Error (data.message || 'Some error') 
      }

      setLoading(false)

      return data

    } catch (e) {
      setLoading(false)
      setError(e.message)
      throw e
    }
  }, [])

  const clearError = useCallback (() => setError(null), [])

  return { loading, error, request, clearError }
}


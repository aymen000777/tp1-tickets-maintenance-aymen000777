import axios from 'axios'

const ticketApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
})

export async function getTickets() {
  const { data } = await ticketApi.get('/tickets')
  return data
}

/* eslint-env node */
// Module imports
import axios from 'axios'





// Local variables
let instance = null





const getTrelloService = () => {
  if (!instance) {
    instance = axios.create({
      baseURL: process.env.TRELLO_API_URL,
      headers: { 'Content-Type': 'application/json' },
      params: {
        key: process.env.TRELLO_APPLICATION_KEY,
        token: process.env.TRELLO_ACCESS_TOKEN,
      },
      timeout: 10000,
    })
  }

  return instance
}





export default getTrelloService

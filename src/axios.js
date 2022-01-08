import axios from 'axios'

const instance = axios.create({
    baseURL:"https://us-central1-anteeqa-e8c7d.cloudfunctions.net/api"
})
    // "http://localhost:5001/anteeqa-e8c7d/us-central1/api"

export default instance
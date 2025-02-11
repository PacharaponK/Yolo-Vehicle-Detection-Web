import axios from "axios"
import conf from "./conf";

export const axData = {
  jwt: null
}

const ax = axios.create({
  baseURL: conf.apiBaseUrl
  
})


export default ax;
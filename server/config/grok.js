import axios from "axios";

import dotenv from "dotenv"
dotenv.config();
export const grokClient = axios.create({
  baseURL: "https://api.groq.com/openai/v1" ,
  headers: {
    Authorization: `Bearer ${process.env.GROK_API_KEY}`,
  },
});
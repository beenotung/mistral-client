import { config } from 'dotenv'
import populateEnv from 'populate-env'

config()

export let env = {
  MISTRAL_API_KEY: '',
}

populateEnv(env, { mode: 'halt' })

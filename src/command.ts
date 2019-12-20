import { projects } from './projects.json'

// Constant
const PATTERN = '/michi-commit'

// Command Interface
export interface Command {
  environment?: String;
  stagingName?: String;
  project?: String;
  provider?: String;
  tag?: String;
}

/**
 * Parse Payload
 * 
 * @param {String} body
 * @return {Promise}
 */
export const parsePayload = async (body: string): Promise<Command> => {
  const contain = body.includes(PATTERN)
  if (!contain) {
    return Promise.reject()
  }

  const splitedPayload = body.split(' ')
  if (splitedPayload.length !== 4) {
    return Promise.reject('Command is malformated')
  }
  
  const token = getToken(splitedPayload.slice(1))
  return Promise.resolve(token)
}

/**
 * Get Token
 * 
 * @param {Array} payload
 * @return {Command}
 */
const getToken = (payload: Array<String>): Command => {
  const [env, project, tag] = payload

  let cmd: Command = {
    project,
    tag
  }

  if (env.includes('staging')) {
    let [kind, staging] = env.split('=')
    
    cmd.provider = projects.staging
    cmd.environment = kind
    cmd.stagingName = staging
  } else {
    cmd.provider = projects.production
    cmd.environment = env
  }

  return cmd
}
import * as util from 'util'
import { exec } from 'child_process'
import { Command } from './command'

const asyncExec = util.promisify(exec)

/**
 * Run Kustomize
 * 
 * @param {Command} cmd
 * @return {Promise}
 */
export async function runKustomize(cmd: Command) {
  const projectImageName = `${cmd.provider}${cmd.project}`
  const { stderr } = await asyncExec(
    `kustomize edit set image ${cmd.project}=${projectImageName}:${cmd.tag}`,
    {
      cwd: `charts/${cmd.project}/overlays/${cmd.stagingName}`
    }
  )

  if (stderr.length > 0) {
    return Promise.reject()
  }

  return Promise.resolve()
}

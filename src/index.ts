import { Application } from 'probot'
import { parsePayload } from './command'
import { getInstance } from './git'
import { runKustomize } from './kustomize'
import chalk from 'chalk'

// get the instance of the git module
const git = getInstance()

// console.log reference
const log = console.log

/**
 * Init Repository
 */
function initRepository() {
  git.setHandle()
    .then(() => git.pull())
    .then(() => log(chalk.blue('git: repo pull')))
    .catch(err => log(err))
}

// Run the initialization of the repository
initRepository()

// Command supported
// /michi-commit staging=demo1 hummingbird-sf <image tag>
// /michi-commit production hummingbird-sf <image-tag>
export = (app: Application) => {
  app.on('issue_comment', async (context) => {
    // retrieve the latest commit before doing anything
    await git.pull()

    // parse the payload and commit
    parsePayload(context.payload.comment.body)
      .then(cmd => runKustomize(cmd))
      .then(() => git.addAll())
      .then(() => git.commit())
      .then(() => git.push())
      .then(() => log(chalk.green(`commit done`)))
      .catch(err => console.log(err))

    return Promise.resolve()
  })
}
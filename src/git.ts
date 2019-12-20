import {
  Clone,
  Repository,
  Cred,
  Oid,
  Reference,
  Signature,
} from 'nodegit'
import fs from 'fs-extra'
import chalk from 'chalk'

// Constant
const REPOSITORY = 'repo'
const BRANCH = 'origin/master'
const NEEDLE = 'HEAD'
const REPOSITORY_FOLDER = 'charts'

// instance
let instance: Git

/**
 * Git
 *    Singleton which handle git operations on the chart repository
 */
class Git {
  // Repository handler
  handle?: Repository
  // Oid is a full | partial hash value that is used to recognized git objects
  oid?: Oid

  /**
   * Set Handle
   * 
   * @return Promise
   */
  async setHandle(): Promise<any> {
    await fs.remove(REPOSITORY_FOLDER)
    const res = await Clone.clone(REPOSITORY, REPOSITORY_FOLDER, {
      fetchOpts: {
        callbacks: {
          credentials: (_: string, username: string) => Cred.sshKeyFromAgent(username),
          certificateCheck: () => 0
        }
      }
    })

    this.handle = res

    return Promise.resolve()
  }

  /**
   * Pull
   * 
   * @return Promise<void>
   */
  async pull(): Promise<void> {
    await this.handle!.fetchAll({
      callbacks: {
        credentials: (_: string, userName: string) => {
          return Cred.sshKeyFromAgent(userName)
        },
        certificateCheck: () => 0
      }
    })
    .then(() => this.handle!.mergeBranches('master', BRANCH))
    .finally(() => console.log(chalk.blue('Git: repo updated')))

    return Promise.resolve()
  }

  /**
   * Add All
   * 
   * @return Promise<void>
   */
  async addAll(): Promise<void> {
    const index = await this.handle!.refreshIndex()
    await index.addAll()
    await index.write()
    
    this.oid = await index.writeTree()

    return Promise.resolve()
  }

  /**
   * Commit
   * 
   * @return Promise<void>
   */
  async commit(): Promise<void> {
    const needle = await Reference.nameToId(this.handle!, NEEDLE)
    const lastCommit = await this.handle!.getCommit(needle)
    const author = Signature.now('zhuchishigedangao', 'zhuchidangao@gmail.com')

    await this.handle!.createCommit(
      'HEAD',
      author,
      author,
      'test commit',
      this.oid!,
      [lastCommit]
    )

    return Promise.resolve()
  }

  /**
   * Push
   * 
   * @return Promise<number>
   */
  async push(): Promise<number> {
    let remote = await this.handle!.getRemote('origin')
    return remote.push(
      ["refs/heads/master:refs/heads/master"],
      {
        callbacks: {
          credentials: (_: string, userName: string) => Cred.sshKeyFromAgent(userName),
          transferProgress: (progress: any) => console.log(chalk.greenBright(`progress: ${progress}`))
        }
      }
    )
  }
}

/**
 * Get Instance
 * 
 * @return {Object} instance
 */
export const getInstance = (): Git => {
  if (!instance) {
    instance = new Git()
  }

  return instance
}
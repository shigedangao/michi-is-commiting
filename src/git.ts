import {
  Clone,
  Repository,
  Cred,
  Oid,
  Reference,
  Signature
} from 'nodegit'

// Constant
const REPOSITORY = ''
const REPOSITORY_FOLDER = 'charts'

class Git {
  handle: Repository
  oid: Oid

  constructor() {
    this.handle = new Repository()
    this.oid = new Oid()
  }

  async setHandle() {
    try {
      let res = await Clone.clone(REPOSITORY, REPOSITORY_FOLDER)
      this.handle = res
    } catch (e) {
      throw new Error(e)
    }
  }

  async pull() {
    await this.handle.fetchAll({
      callbacks: {
        credentials: (userName: string) => {
          return Cred.sshKeyFromAgent(userName)
        },
        certificateCheck: () => 0
      }
    })
    .then(() => this.handle.mergeBranches('master', 'origin/master'))
    .finally(() => console.log('repo updated'))
  }

  async addAll() {
    let index = await this.handle.refreshIndex()
    await index.addAll()
    await index.write()
    
    this.oid = await index.writeTree()
  }

  async commit() {
    const needle = await Reference.nameToId(this.handle, "HEAD")
    const lastCommit = await this.handle.getCommit(needle)

    const author = Signature.now('Shigedangao', '<>')
    
    return this.handle.createCommit(
      'HEAD',
      author,
      author,
      'test commit',
      this.oid,
      [lastCommit]
    )
  }
}
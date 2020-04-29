const { context } = require('@actions/github')

console.log(context.payload)
const commits = context.payload.pull_request.commits.filter((c) => c.distinct)
const repo = context.payload.repository
const org = repo.organization
const owner = org || repo.owner

const args = { owner: owner.name, repo: repo.name }

function isValidFile(file) {
  return (
    file.status === 'added' ||
    file.status === 'modified' ||
    file.status === 'renamed'
  )
}

exports.getChangedFiles = (tools) => {
  const files = []

  return Promise.all(
    commits.map(async (commit) => {
      args.ref = commit.id
      const result = await tools.github.repos.getCommit(args)

      if (!result || !result.data) {
        return
      }

      files.push(...result.data.files.filter(isValidFile))
    })
  ).then(() => files)
}

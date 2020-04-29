const { existsSync, readFileSync } = require('fs')
const { resolve } = require('path')

const { Toolkit } = require('actions-toolkit')
const github = require('@actions/github')

const { getChangedFiles } = require('./getPullRequestFiles')

function resolveFromRoot(...paths) {
  return resolve(process.env.GITHUB_WORKSPACE, ...paths)
}

function isIOApp() {
  const manifestPath = resolveFromRoot('manifest.json')
  return existsSync(manifestPath)
}

function getJSONFile(...paths) {
  return JSON.parse(readFileSync(resolveFromRoot(...paths)))
}

// Run your GitHub Action!
Toolkit.run(async (tools) => {
  let pkg

  tools.log(tools.token)

  try {
    pkg = tools.getPackageJSON()
  } catch (e) {
    tools.log.warn(`No "package.json" found in the root directory. Skipping.`)
    return
  }

  const { scripts } = pkg
  if (scripts == null || !('lint' in scripts)) {
    tools.log.warn(`No "lint" script found in the. Skipping.`)
    return
  }

  tools.log.info('Installing root dependencies')
  await tools.runInWorkspace('yarn', ['install', '--frozen-lockfile'])

  try {
    if (isIOApp()) {
      const { builders } = getJSONFile('manifest.json')
      for await (const builder of Object.keys(builders)) {
        if (!existsSync(resolveFromRoot(builder, 'package.json'))) {
          continue
        }

        // no need to install deps while testing
        if (process.env.NODE_ENV !== 'test') {
          tools.log.info(`Installing "${builder}" dependencies`)
          await tools.runInWorkspace('yarn', ['install', '--frozen-lockfile'], {
            cwd: resolveFromRoot(builder),
          })
        }
      }
    }

    tools.log.info(`Linting`)
    await tools.runInWorkspace('yarn', ['lint'])
  } catch (e) {
    tools.exit.failure(e)
    return
  }

  tools.exit.success()
})

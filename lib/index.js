const { existsSync, readFileSync } = require('fs')
const { resolve } = require('path')
const { execSync } = require('child_process')

const { Toolkit } = require('actions-toolkit')

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
Toolkit.run(async tools => {
  if (!isIOApp()) {
    tools.exit.neutral('Not an IO app. Skipping.')
    return
  }

  const { builders } = getJSONFile('manifest.json')
  for await (const builder of Object.keys(builders)) {
    const { scripts } = getJSONFile(builder, 'package.json')
    if (scripts == null || !('test' in scripts)) {
      tools.log.warn(
        `No "test" script found in the "${builder}" app. Skipping.`
      )
      continue
    }

    try {
      await tools.runInWorkspace('yarn', 'test', {
        cwd: resolveFromRoot(builder),
      })
    } catch (e) {
      tools.log.error(e)
      tools.exit.failure(e)
      return
    }
  }

  tools.exit.success()
})
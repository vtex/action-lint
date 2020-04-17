const { Toolkit } = require('actions-toolkit')

// Run your GitHub Action!
Toolkit.run(async tools => {
  let pkg

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

  try {
    await tools.runInWorkspace('yarn', ['lint'])
  } catch (e) {
    tools.exit.failure(e)
    return
  }

  tools.exit.success()
})

# Lint action

This is a simple Github action that runs the `lint` script of a project. If the project doesn't have a `package.json` nor a `lint` script, the action is skipped.

## Usage

To use it, just add it to your workflow and you're done:

```yml
# someworkflow.yml
name: CI Pull Requests

on:
  pull_request:
    branches: [master]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Use Node.js 16.x
        uses: actions/setup-node@v3
        with:
          node-version: 16
        env:
          RUNNER_TEMP: /tmp

      - name: yarn install
        run: yarn install --frozen-lockfile

      - name: Lint project
        uses: vtex/action-lint@v2
```

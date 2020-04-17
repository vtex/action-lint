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
      - uses: actions/checkout@master
      - name: Use Node.js 12.x
        uses: actions/setup-node@master
        with:
          node-version: 12.x
        env:
          RUNNER_TEMP: /tmp

      - name: yarn install
        run: yarn install --frozen-lockfile

      - name: Lint project
        uses: vtex/action-lint@master
```

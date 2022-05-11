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
  lint:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3
        
      - name: Lint
        uses: vtex/action-lint@v1.1
```

import {Buffer} from 'node:buffer'
import {spawn} from 'node:child_process'

const collect = (stream, chunks) =>
  stream.on('data', chunk => chunks.push(chunk))

export const run = (command, args, cwd) =>
  new Promise((resolve, reject) => {
    const child = spawn(command, args, {cwd})
    const stdout = []
    const stderr = []
    collect(child.stdout, stdout)
    collect(child.stderr, stderr)
    child.on('error', reject)
    child.on('close', code => {
      resolve({
        code,
        stdout: Buffer.concat(stdout).toString(),
        stderr: Buffer.concat(stderr).toString(),
      })
    })
  })

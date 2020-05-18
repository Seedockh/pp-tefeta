#!/usr/bin/env node
const fs = require('fs')
const os = require('os')

let map = fs.readFileSync(process.argv[2], 'utf8').split(os.platform() === 'win32' ? '\r\n' : '\n')
let path = '.'
let wall = '*'
let clean = ' '
let width
let height
let entry
let exit

// setup entry and exit coordinates
map.map((line, i) => {
  console.log(line, i)
  if (i === 0) {
    const size = line.split('x')
    width = size[0]
    height = size[1]
  }
  if (line.indexOf(1) > -1) entry = [i, line.indexOf(1)]
  if (line.indexOf(2) > -1) exit = [i, line.indexOf(2)]
})

if (!entry) throw 'Error: no entry point found'
if (!exit) throw 'Error: no exit point found'

// write path in lines
let vDir = entry[0] < exit[0]
let cursor = entry[1]
let avoidStep = 0

// determine the correct paths to follow
const determineExits = () => {
  let tempPath = []
  let hasExit = false
  let endFound = true

  for (let i = entry[0]; vDir ? i < exit[0] : i > exit[0]; vDir ? i++ : i--) {
    const currentLine = map[i]
    const nextLine = map[vDir ? i+1 : i-1]
    let currentExit = null

    if ((nextLine[cursor] === clean || nextLine[cursor] === '2') &&
        (currentLine[cursor] === clean || currentLine[cursor] === '1')) {
      currentExit = cursor
    }

    if (!currentExit) {
      for (let j = cursor; j < width; j++) {
        let currentAvoidStep = avoidStep
        if (nextLine[j] === '2') {
          endFound = true
          currentExit = j
        } else if (nextLine[j] === clean && (currentLine[j] === clean || currentLine[j] === '1')) {
          if (currentAvoidStep > 0) {
            currentAvoidStep--
          } else {
            const start = cursor < j ? cursor : j
            const end = cursor < j ? j : cursor
            const currentPath = currentLine.substr(start, (end - start))
            if (currentPath.indexOf(wall) === -1) currentExit = j
          }
        }
      }
    }

    if (!currentExit) {
      for (let k = cursor; k > 0; k--) {
        let currentAvoidStep = avoidStep
        if (nextLine[k] === '2') {
          endFound = true
          currentExit = k
        } else if (nextLine[k] === clean && (currentLine[k] === clean || currentLine[k] === '1')) {
          if (currentAvoidStep > 0) {
            currentAvoidStep--
          } else {
            const start = cursor < k ? cursor : k
            const end = cursor < k ? k : cursor
            const currentPath = currentLine.substr(start, (end - start))
            if (currentPath.indexOf(wall) === -1) currentExit = k
          }
        }
      }
    }

    if (currentExit) {
      tempPath.push({ line: i, start: cursor, exit: currentExit })
      cursor = currentExit
    } else {
      avoidStep++
      cursor = entry[1]
      //i = entry[0]
      //determineExits()
    }
  }

  if (!endFound) return console.log('end not found')
  else return tempPath
}

const lineExits = determineExits()

lineExits.map(lineExit => {
  let newLine = ''
  const { line, start, exit } = lineExit

  for (let i = 0; i < width; i++) {
    if (start === exit && i === start && map[line][i] !== '1') {
      newLine += path
    } else if (start > exit && i >= exit && i <= start) {
      newLine += path
    } else if (start < exit && i <= exit && i >= start) {
      newLine += path
    } else {
      newLine += map[line][i]
    }
  }

  map[line] = newLine
})

map.map((line, i) => console.log(line, i))
console.log(lineExits)

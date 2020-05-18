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
let hDir = true
let cursor = entry[1]
let lineExit = null

for (let i = entry[0]; vDir ? i <= exit[0] : i >= exit[0]; vDir ? i++ : i--) {
  // search for next line possible exit
  if (!lineExit) {
    for (let j = cursor; j < width; j++)
      if (
        !lineExit &&
        (map[i][j] === clean || (map[i][j] === '1' && map[vDir ? i+1 : i-1][j] === clean)) &&
        (map[vDir ? i+1 : i-1][j] === clean || map[vDir ? i+1 : i-1][j] === '2'))
        lineExit = j
  }

  if (!lineExit) {
    for (let k = cursor; k > 0; k--)
      if (!lineExit && map[i][k] === clean && (map[vDir ? i+1 : i-1][k] === clean || map[vDir ? i+1 : i-1][k] === '2'))
        lineExit = k
  }

  // draw path in line
  if ((vDir && i >= entry[0] && i <= exit[0]) || (!vDir && i <= entry[0] && i >= exit[0]) && lineExit) {
    let newLine = ''
    hDir = cursor < lineExit

    for (let l = 0; l < width; l++) {
      if (l === lineExit && map[i][l] === clean) newLine += path
      else {
        // when ** cursor --- lineExit **
        if (hDir && l >= cursor && l <= lineExit && map[i][l] === clean) newLine += path
        // when ** lineExit --- cursor **
        else if (!hDir && l <= cursor && l >= lineExit && map[i][l] === clean) newLine += path
        else newLine += map[i][l]
      }
    }
    map[i] = newLine //+ `  <--  ${map[i]} (hDir: ${hDir}, cursor: ${cursor}, lineExit: ${lineExit})`
  } else console.log(`Error: no exit found for line ${i}`)
  cursor = lineExit
  lineExit = null
}

map.map((line, i) => console.log(line))

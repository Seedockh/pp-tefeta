#!/usr/bin/env python
import sys

down = '|'
side = '-'
wall = '*'

with open(sys.argv[1], 'r') as file:
    map = file.read().splitlines()
    pathed_map = []
    entry = []
    exit = []

    # setting start and end coordinates
    for i, line in enumerate(map):
        if i == 0:
            size = line.split('x', 1)
            width = int(size[0])
            height = int(size[1])
        else:
            for char_i, c in enumerate(line):
                if (c == '1'):
                    entry = [i, char_i]
                if (c == '2'):
                    exit = [i, char_i]

    # defining the path to reach end
    for line_i in range(entry[0], exit[0]):
        line = list(map[line_i])
        for cursor_i, cursor in enumerate(range(exit[1], entry[1], 1 if entry[1] > exit[1] else -1)):
            if line[cursor] == ' ':
                line[cursor] = side
        if line_i == height - 1:
            pathed_map.append(line[cursor])

    print(line)

    print('start :', entry)
    print('end :', exit)

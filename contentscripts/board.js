var Board = {
    id: 'fo-board',
    row: 13,
    col: 61,
    color0: '#ebedf0',
    color1: '#239a3b',
    color2: '#c6e48b',
    catLoc: [],
    tubeLocs: [],
    treeLocs: [],
    catPoints: [],
    barrierPoints: [],
    element: null
}

Board.cat = [
    [0, 0, 1, 0, 0, 0, 1],
    [0, 0, 1, 1, 1, 1, 1],
    [0, 0, 1, 2, 1, 2, 1],
    [1, 0, 1, 1, 1, 1, 1],
    [0, 1, 0, 0, 1, 0, 0],
    [0, 0, 1, 1, 1, 1, 1],
    [0, 0, 1, 0, 1, 0, 1],
]

Board.tube = [
    [1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1],
]

Board.tree = [
    [0, 1, 1, 0, 1, 1, 0],
    [1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1],
]

Board.init = function() {
    Board.catLoc = [5, 3]
    Board.tubeLocs = [[20, 9], [58, 0]]
    Board.treeLocs = [[38, 10]]
    Board.catPoints = []
    Board.barrierPoints = []
    Board.timer = {}
}

Board.handleKeydown = function(e) {
    if (e.keyCode == 32 && e.target == document.body) {
        e.preventDefault();
        Board.jump()
    }
}

Board.bindKeyPress = function() {
    window.addEventListener('keydown', Board.handleKeydown);
}

Board.unbindKeyPress = function() {
    window.removeEventListener('keydown', Board.handleKeydown);
}

Board.setUpInterval = function() {
	Board.setUpIntervalFall()
	Board.setUpIntervalMove()
}

Board.setUpIntervalFall = function() {
    if (!Game.running || Game.paused) {
        return false
    }
    Board.timer.fall = setTimeout(function() {
        Board.fall()
        Board.setUpIntervalFall()
    }, Game.intervalFall)
}

Board.setUpIntervalMove = function() {
    if (!Game.running || Game.paused) {
        return false
    }
    Board.timer.move = setTimeout(function() {
        Board.move()
        if (Game.score % 50 == 0) {
            Game.intervalMove = Math.ceil(Game.intervalMove * 0.8)
        }
        Board.setUpIntervalMove()
    }, Game.intervalMove)
}

Board.pointDebug = function(li) {
    li.addEventListener('click', function(e) {
        if(!Board.color(this) || Board.color(this) == Board.color0) {
            Board.fill(this, Board.color1);
        } else {
            Board.fill(this, Board.color0);
        }
    })
}

Board.open = function() {
	var element = document.getElementById(Board.id)
	if (!element) {
		element = document.createElement('div')
		element.id = Board.id
		element.innerHTML = ('<ul>' + '<li></li>'.repeat(Board.row) + '</ul>').repeat(Board.col)

		var i = 0
		element.querySelectorAll('ul').forEach(function(ul){
			var j = 0
				ul.querySelectorAll('li').forEach(function(li) {
					li.setAttribute('id', 'p-' + j + '-' + i)
						// Board.pointDebug(li)
						j += 1
				})
			i += 1
		})

		Board.element = element
		Game.container.appendChild(element)

    	Board.refresh()
	}
}

Board.start = function() {
    Board.refresh()
    Board.bindKeyPress()
    Board.setUpInterval()
}

Board.color = function(e) {
    return e.getAttribute('fill')
}

Board.fill = function(e, color) {
    e.style.backgroundColor = color
    e.setAttribute('fill', color)
}

Board.clear = function() {
    Board.element.querySelectorAll('li').forEach(function(li){
        Board.fill(li, Board.color0)
    })
    Board.catPoints = []
    Board.barrierPoints = []
}

Board.draw = function(matrix, loc, type) {
    var p
    var color
    for (r in matrix) {
        for (c in matrix[r]) {
            y = parseInt(loc[1]) + parseInt(r)
            x = parseInt(loc[0]) + parseInt(c)
            if (x >= Board.col || x < 0) {
                continue
            }
            if (y >= Board.row || y < 0) {
                continue
            }
            id = 'p-' + y + '-' + x
            p = document.getElementById(id)
            if (matrix[r][c] != 0) {
                if (type == 'cat') {
                   Board.catPoints.push(id)
                } else {
                   Board.barrierPoints.push(id)
                }
            }
            Board.fill(p, Board['color' + matrix[r][c]])
        }
    }
}

Board.refresh = function() {
    Board.clear()
    Board.draw(Board.cat, Board.catLoc, 'cat')
    Board.tubeLocs.forEach(function(tubeLoc){
        Board.draw(Board.tube, tubeLoc, 'tube')
    })
    Board.treeLocs.forEach(function(treeLoc){
        Board.draw(Board.tree, treeLoc, 'tree')
    })
    Board.check()
}

Board.jump = function() {
	if (Game.running && !Game.paused) {
        var step = 2
        if (Board.catLoc[1] < 2) {
            step = Board.catLoc[1]
        }
        if (step > 0) {
            Board.catLoc = [Board.catLoc[0], Board.catLoc[1] - step]
            Board.refresh()
        }
    }
}

Board.fall = function() {
	if (Game.paused) return

    if (Board.catLoc[1] + Board.cat.length < Board.row) {
        Board.catLoc = [Board.catLoc[0], Board.catLoc[1] + 1]
        Board.refresh()
    }
}

Board.move = function() {
	if (Game.paused) return

    Game.addScore()
    var tubeLocs = Board.tubeLocs
    Board.tubeLocs = []
    tubeLocs.forEach(function(loc) {
        if (loc[0] + Board.tube[0].length > 0) {
            Board.tubeLocs.push([loc[0] - 1, loc[1]])
        }
    })

    var treeLocs = Board.treeLocs
    Board.treeLocs = []
    treeLocs.forEach(function(loc) {
        if (loc[0] + Board.tree[0].length > 0) {
            Board.treeLocs.push([loc[0] - 1, loc[1]])
        }
    })

    if ((Board.tubeLocs.length + Board.treeLocs.length) < 3 && Math.random() > 0.2) {
        Board.generateBarrier()
    }

    Board.refresh()
}

Board.generateBarrier = function() {
    var rand = Math.random()
    if (rand < 0.3) {
        Board.tubeLocs.push([Board.col - 1, 0])
    } else if (rand < 0.7) {
        Board.tubeLocs.push([Board.col - 1, Board.row - Board.tube.length])
    } else {
        Board.treeLocs.push([Board.col - 1, Board.row - Board.tree.length])
    }
}

Board.check = function() {
    if (!Game.running) {
        return false
    }
    Board.catPoints.every(function(p) {
        if (Board.barrierPoints.indexOf(p) > -1) {
            Board.die()
            return false
        }
        return true
    })
}

Board.die = function() {
	Game.die()
    Board.flash(6)
}

Board.flash = function(times) {
    if (times > 0) {
        Board.timer.flash = setTimeout(function(){
            document.getElementById(Board.id).querySelectorAll('li').forEach(function(li){
                if (Board.color(li) == Board.color0) {
                    Board.fill(li, Board.color1)
                } else if (Board.color(li) == Board.color1) {
                    Board.fill(li, Board.color0)
                }
            })
            Board.flash(times - 1)
        }, 150)
    }
}

Board.close = function() {
    if (Board.element) {
        Board.element.parentNode.removeChild(Board.element)
        Board.element = null
        Board.unbindKeyPress()
        Object.keys(Board.timer).forEach(function(n) {
          clearTimeout(Board.timer[n])
        })
    }
}

Board.init();

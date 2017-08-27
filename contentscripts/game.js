var Game = {
    running: false,
    paused: false,
    dead: false,
    intervalMove: 300,
    intervalFall: 250,
    score: 0
}

Game.graph = document.querySelector('.js-contribution-graph')
Game.container = document.querySelector('.js-calendar-graph').parentNode
Game.legend = document.querySelector('.contrib-legend')

Game.init = function() {
    Game.container.setAttribute('fo-container', '') 
}

Game.start = function() {
	Game.score = 0
	Game.intervalMove = 300
	Game.running = true
	Game.paused = false
	Game.dead = false
    Board.init()
    Board.start()
}

Game.restart = function() {
	Game.start()
}

Game.pause = function() {
	Game.running = true
	Game.paused = true 
	Game.dead = false
}

Game.unpause = function() {
	Game.running = true
	Game.paused = false 
	Game.dead = false
	Board.setUpInterval()
}

Game.close = function() {
	Game.running = false
	Game.paused = false
	Game.dead = false
	Board.close()
	Controls.close()
}

Game.addScore = function() {
	Game.score += 1
	Controls.refreshScore()
}

Game.die = function() {
	Game.running = false
    Game.dead = true

	Controls.refresh()
}

Game.init()

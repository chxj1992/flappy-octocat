var Controls = {
    id: "fo-controls",
    actions: ['start', 'restart', 'pause', 'unpause', 'close'],
    buttons: {},
    element: null
}

Controls.init = function() {
}

Controls.action = function (e) {
    var btn = e.target
	if (btn.hasAttribute('data-action') && !btn.hasAttribute('disabled')) {
		Controls.onclick && Controls.onclick(btn)
	}
    return false
}

Controls.onclick = function(btn) {
	var action = Game[btn.getAttribute('data-action')]
	action && action()
	Controls.refresh()
}

Controls.open = function() {
    if (!Controls.element) {
        var content = '<span id="fo-score">0</span>' + 
				Controls.actions.map(function(name) {
                    return '<a data-action="' + name + '"></a>'
                }).join('')

        var element = document.createElement('div')
        element.id = Controls.id
        element.innerHTML = content

        Controls.actions.forEach(function(name) {
            Controls.buttons[name] = element.querySelector('[data-action="' + name + '"]')
        })
        element.addEventListener('click', Controls.action)

        Controls.element = element 
        Game.container.appendChild(element)
		Controls.refresh()
    }
}    

Controls.apply = function(operation, names, value) {
	if (!Array.isArray(names)) names = [names]
	names.forEach(function(name) {
		var btn = Controls.buttons[name]
		switch (operation) {
			case 'disable': btn.setAttribute('disabled', true); break
			case 'enable': btn.removeAttribute('disabled'); break
			case 'show': btn.style.display = ''; break
			case 'hide': btn.style.display = 'none'; break
			case 'setTitle': btn.title = value; break
			case 'setShadow': btn.firstChild.style.boxShadow = value
		}
	})
	return this
}

Controls.refreshScore = function() {
	var score = document.getElementById('fo-score')
	score.innerHTML = Game.score
}

Controls.refresh = function() {
	if (!Game.running && !Game.dead) {
		Controls.apply('show', ['start', 'close']).apply('hide', ['restart', 'pause', 'unpause'])
	} else if(!Game.running && Game.dead) {
		Controls.apply('show', ['restart', 'close']).apply('hide', ['start', 'pause', 'unpause'])
	} else if (Game.running  && !Game.paused) {
		Controls.apply('show', ['pause', 'close']).apply('hide', ['unpause', 'start', 'restart'])
	} else if (Game.running && Game.paused) {
		Controls.apply('show', ['unpause', 'restart', 'close']).apply('hide', ['pause', 'start'])
	}
}

Controls.close = function() {
	if (Controls.element) {
		Controls.element.parentNode.removeChild(Controls.element)
		Controls.element = null
	}
}

Controls.init()

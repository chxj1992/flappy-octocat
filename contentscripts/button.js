var Button = {
    id: 'fo-button',
	element: null
}

Button.init = function() {
    if (Game.graph){
        Button.build()
    }
}

Button.build = function() {
    var element = document.getElementById(Button.id)
    if (!element){
        element = document.createElement('a')       
        element.id = Button.id
        element.innerHTML = 'Play'
        element.addEventListener('click', function(e) {
    		Board.open()
    		Controls.open()
        })
        Game.legend.insertBefore(element, Game.legend.firstChild)

    	Button.element = element
    } 
}

Button.init()

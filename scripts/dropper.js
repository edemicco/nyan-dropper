window.requestAnimFrame = (function(){
	return  window.requestAnimationFrame   || 
			window.webkitRequestAnimationFrame || 
			window.mozRequestAnimationFrame    || 
			window.oRequestAnimationFrame      || 
			window.msRequestAnimationFrame     || 
			function( callback ){
				window.setTimeout(callback, 1000 / 60);
			};
})();

window.DROP = {};

DROP.drip = function(x,y) {
	var posX, posY, size,opacity;
	
	// constructor code
	this.posX = x;
	this.posY = y;
	this.size = 30;
	this.opacity = 1;
	this.growing = true;
	this.color = {
		r: Math.floor(Math.random() * 256),
		g: Math.floor(Math.random() * 256),
		b: Math.floor(Math.random() * 256)
	}
}

DROP.drip.prototype = {
	draw: function(ctx) {
		this.opacity = (this.size / 150) / 1 ;

		ctx.fillStyle = 'rgba(' + this.color.r + ',' + this.color.g + ',' + this.color.b +',' + this.opacity + ')';
		ctx.beginPath();
		ctx.arc(this.posX, this.posY, this.size, 0, Math.PI*2, true); 
		ctx.closePath();
		ctx.fill();
	},
	advance: function() {
		if (this.growing == true) {
			if (this.size < 100) {
				this.size += 2;
			}
			return true;
		} else {
			if (this.size > 0) {
				this.size -= 0.25;
				return true;
			} else {
				return false;
			}
		}
	},
	stopGrowing: function() {
		this.growing = false;
	}
};

DROP.main = (function() {
	var canvas, ctx, drips = [], drawing = false, dripsAdded = 0, mouseX, mouseY, catEnabled = true, catImg;
	
	function init() {
		canvas = document.getElementById('mainCanvas');
		ctx = canvas.getContext('2d');
		
		$(canvas).bind("mousedown", handleMouseDown);
		$(document).bind("mouseup", handleMouseUp);
		$(canvas).bind("mousemove", handleMouseMove);
		if (catEnabled == true) {
			setupCat();
		}
		
		(function animloop(){
		  requestAnimFrame(animloop);
		  animate();
		})();
	}
	
	function animate() {
		advanceDrips();
		drawDrips();
		if (catEnabled == true) {
			drawCat();
		}
	}
	
	function handleMouseDown(e) {
		drawing = true;
		var x = e.pageX;
		var y = e.pageY;
		x -= $(canvas).offset().left;
		y -= $(canvas).offset().top;
		addDrip(x,y);
		dripsAdded += 1;
	}
	
	function handleMouseUp(e) {
		drawing = false;
		if (dripsAdded > 0) {
			for (var i = 0; i < dripsAdded; i++) {
				drips[(drips.length - 1) - i].stopGrowing();
			}
		}
		dripsAdded = 0;
	}
	
	function handleMouseMove(e) {
		var x, y;
		x = e.pageX;
		y = e.pageY;
		x -= $(canvas).offset().left;
		y -= $(canvas).offset().top;
		if (drawing == true && dripsAdded < 150) {
			addDrip(x,y);
			dripsAdded += 1;
		}
		mouseX = x;
		mouseY = y;
	}
	
	function addDrip(x,y) {
		drips.push ( new DROP.drip(x,y) );
	}
	
	function advanceDrips() {
		for (x in drips) {
			var success = drips[x].advance();
			if (success === false) {
				//delete drips[x];
				drips.splice(x,1);
			}
		}
	}
	
	function drawDrips(x,y) {
		ctx.clearRect(0, 0, 980, 600);
		for (x in drips) {
			drips[x].draw(ctx);
		}
	};
	
	function setupCat() {
		catImg = new Image();
		catImg.src = 'images/nyan-cat.gif';
	}
	
	function drawCat() {
		 ctx.drawImage(catImg, mouseX - 90, mouseY - 55, catImg.width / 2 , catImg.height /2 )
	}
	
	return {
		init: init
	}

}());

$(document).ready(function() {
	DROP.main.init();
});
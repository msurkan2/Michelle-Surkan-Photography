// A function closure for queueing actions
// Usage: queueAction(queueName,duration,callback)
const queueAction = (() => {
	let dict = {};
	const queueAction = function(queue,duration,callback)
	{
		if(dict[queue] == undefined) dict[queue] = [];
		dict[queue].push({duration: duration, callback: callback});
		if(dict[queue].length == 1) popAction(queue);
	}
	
	const popAction = function(queue)
	{
		if(dict[queue] == undefined || dict[queue].length == 0) return;
		const a = dict[queue][0];
		window.setTimeout(() => {
			dict[queue].shift();
			popAction(queue);
		}, a.duration);
		a.callback();
	}
	
	return queueAction;
})();

// Jquery event that runs when document is ready
$(function(){
	
	// Image Carousels
	$('.carousel').toArray().forEach(e => {
		
		let items = [...e.children];
		let curIndex = 0;
		
		// moving all elements of carousel into a div
		$(e).html($("<div></div>").append(...items).addClass('carousel-content'));
		
		// position and style all images in their starting arrangement
		items.forEach((item,index) => {
			item.style.maxHeight = '100%';
			item.style.maxWidth = '100%';
			item.style.top = '50%';
			item.style.transform = 'translate(-50%,-50%)';
			// item.style.left = index*300+'px';
			// item.style.zIndex = items.length-1-index;
			item.style.zIndex = 0;
			item.style.opacity = 0;
			
			// make it so you can click on images to focus them
			// $(item).click(()=>setIndex(index));
		});
		items[0].style.zIndex = 1;
		items[0].style.opacity = 1;
		
		// create the div that houses all the control elements
		let controldiv = $('<div class="carousel-controls"></div>');
		$(e).append(controldiv);
		
		// create back button
		$(controldiv).append($('<button type="button" class="carousel-button carousel-button-left"></button>').append($('<img src="assets/carousel_arrow.svg">')).click(()=>queueAction(e,60,moveLeft)));
		
		// create forward button
		$(controldiv).append($('<button type="button" class="carousel-button carousel-button-right"></button>').append($('<img src="assets/carousel_arrow.svg">')).click(()=>queueAction(e,60,moveRight)));
		
		// create dots
		let dots = $('<div class="carousel-dots"></div>').append(...items.map((item,index) => {
			return $('<button type="button" class="carousel-dot"></button>').append($('<span></span>')).click(()=>setIndex(index));
		}));
		$(controldiv).append(dots);
		
		let dotElements = $(dots).children();
		
		dotElements.first().addClass('selected');
		
		//Add mouse wheel control
		let wheelCooldown = true;
		$(e).on('wheel',function(ev) {
			if(wheelCooldown)
			{
				if(ev.originalEvent.deltaY < 0)
				{
					// scroll up
					queueAction(e,45,moveLeft);
				}
				else
				{
					// scroll down
					queueAction(e,45,moveRight);
				}
				
				// Cooldown to stop users from scrolling too fast
				wheelCooldown = false;
				window.setTimeout(() => wheelCooldown = true, 30);
			}
			return false;
		});
		
		
		// Event that fires when an element is clicked
		let setIndex = function(n)
		{
			// clamp n to valid indices
			n = Math.max(Math.min(n,items.length-1),0);
			
			
			// play transition
			let dir = Math.sign(n-curIndex);
			let c = curIndex;
			while(c != n)
			{
				const i = c;
				queueAction(e,60,() => {
					animate(i + dir, dir);
					curIndex = i + dir;
				});
				c += dir;
			}
		}
		
		let moveLeft = function() {
			let n = curIndex-1;
			n<0 && (n += items.length);
			animate(n, -1);
			curIndex = n;
		}
		
		let moveRight = function() {
			let n = (curIndex + 1) % items.length;
			animate(n, 1);
			curIndex = n;
		}
		
		// Plays the animation of switching images to the image at index 'to'
		// direction -1 means the image will come in from the left and 1 means the right
		let animate = function(to, dir)
		{
			items[to].style.left = 300*dir+'px';
			dotElements.eq(curIndex).removeClass('selected');
			dotElements.eq(to).addClass('selected');
			$(items[to]).animate({
				left: 0,
				opacity: 1,
				zIndex: 1
			},{duration: 160, queue: false});
			$(items[curIndex]).animate({
				left: 300*(-dir)+'px',
				opacity: 0,
				zIndex: 0
			},{duration: 160, queue: false});
		}
	});
	
	// Block context menus on all images on the page to discourage copying.
	$('img').contextmenu(function(e) {e.preventDefault();});
});
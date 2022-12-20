
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
			item.style.height = '100%';
			item.style.top = '50%';
			item.style.left = index*300+'px';
			item.style.transform = 'translate(-50%,-50%)';
			item.style.zIndex = items.length-1-index;
			item.style.opacity = 0;
			
			// make it so you can click on images to focus them
			$(item).click(()=>setIndex(index));
		});
		items[0].style.opacity = 1;
		
		// create the div that houses all the control elements
		let controldiv = $('<div class="carousel-controls"></div>');
		$(e).append(controldiv);
		
		// create back button
		$(controldiv).append($('<button type="button" class="carousel-button carousel-button-left"></button>').append($('<img src="assets/carousel_arrow.svg">')).click(()=>setIndex(curIndex-1)));
		
		// create forward button
		$(controldiv).append($('<button type="button" class="carousel-button carousel-button-right"></button>').append($('<img src="assets/carousel_arrow.svg">')).click(()=>setIndex(curIndex+1)));
		
		// create dots
		let dots = $('<div class="carousel-dots"></div>').append(...items.map((item,index) => {
			return $('<button type="button" class="carousel-dot"></button>').append($('<span></span>')).click(()=>setIndex(index));
		}));
		$(controldiv).append(dots);
		$(dots).children().first().addClass('selected');
		
		//Add mouse wheel control
		$(e).on('wheel',function(ev) {
			if(ev.originalEvent.deltaY < 0)
			{
				// scroll up
				if(curIndex > 0)
				{
					setIndex(curIndex-1);
					return false;
				}
			}
			else
			{
				// scroll down
				if(curIndex < items.length-1)
				{
					setIndex(curIndex+1);
					return false;
				}
			}
		});
		
		
		// Event that fires when an element is clicked
		let setIndex = function(n)
		{
			// clamp n to valid indices
			n = Math.max(Math.min(n,items.length-1),0);
			
			// animate all images to their new positions
			if(curIndex != n) items.forEach((item,index) => {
				let x = index-n;
				let heightPercent = 100-Math.abs(x)*10;
				$(item).animate({
					left: x*300+'px',
					zIndex: items.length-1-Math.abs(x),
					opacity: !x
				},{duration:160,queue:false});
			});
			
			// change selected dot
			let dotElements = $(dots).children();
			dotElements.eq(curIndex).removeClass('selected');
			dotElements.eq(n).addClass('selected');
			
			// update curIndex
			curIndex = n;
		}
	});
	
	// Block context menus on all images on the page to discourage copying.
	$('img').contextmenu(function(e) {e.preventDefault();});
});
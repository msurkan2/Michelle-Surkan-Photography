
// Jquery event that runs when document is ready
$(function(){
	$('.carousel').toArray().forEach(e => {
		
		let items = [...e.children];
		let curIndex = 0;
		
		// moving all elements of carousel into a div
		$(e).html($("<div></div>").append(...items).addClass('carousel-content'));
		
		// Event that fires when an element is clicked
		let setIndex = function(n)
		{
			n = Math.max(Math.min(n,items.length-1),0);
			console.log(curIndex,n);
			/* if(curIndex != n)  */items.forEach((item,index) => {
				let x = index-n;
				let heightPercent = 100-Math.abs(x)*10;
				console.log(item.naturalWidth,item.naturalHeight,item.parentElement.clientHeight,heightPercent);
				$(item).animate({
					height: heightPercent+'%',
					top: Math.abs(x)*5+'%',
					left: -(item.naturalWidth/item.naturalHeight*item.parentElement.clientHeight*heightPercent/100)/2+x*300+'px',
					zIndex: items.length-1-Math.abs(x),
					// opacity: 1-Math.abs(x)*0.3
				},{duration:160,queue:false,always:()=>{item.style.filter = `brightness(${Math.max(20,100-Math.abs(x)*40)}%)`;}});
			});
			curIndex = n;
		}
		
		items.forEach((item,index) => {
			item.style.height = 100-index*10+'%';
			item.style.top = index*5+'%';
			item.style.left = -item.clientWidth/2+index*300+'px';
			item.style.zIndex = items.length-1-index;
			// item.style.opacity = 1-index*0.3;
			item.style.filter = `brightness(${Math.max(20,100-index*40)}%)`;
			$(item).click(()=>setIndex(index));
		});
		
		let controldiv = $('<div class="carousel-controls"></div>');
		$(e).append(controldiv);
		
		// create back button
		$(controldiv).append($('<button type="button" class="carousel-button carousel-button-left"></button>').append($('<img src="assets/carousel_arrow.svg">').css('transform','scaleX(-1)')).click(()=>setIndex(curIndex-1)));
		
		// create forward button
		$(controldiv).append($('<button type="button" class="carousel-button carousel-button-right"></button>').append($('<img src="assets/carousel_arrow.svg">')).click(()=>setIndex(curIndex+1)));
		
		// create dots
		$(controldiv).append($('<div class="carousel-dots"></div>').append(...items.map((item,index) => {
			return $('<button type="button" class="carousel-dot"></button>').append($('<span></span>')).click(()=>setIndex(index));
		})));
	});
});
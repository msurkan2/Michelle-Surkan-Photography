
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
			console.log(curIndex,n);
			curIndex = n;
			items.forEach((item,index) => {
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
	});
});
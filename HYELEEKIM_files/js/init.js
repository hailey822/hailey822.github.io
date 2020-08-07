$( document ).ready(function() {
	
	var viewportWidth = $(window).width(); //viewport width	
	var viewportHeight = $(window).height();

	/* link target ------------------------------- */
	$(document.links).filter(function() {
	    return this.hostname != window.location.hostname;
	}).attr('target', '_blank');

	/* masonry ------------------------------------------------------------------------------------- */

	var $selector = $('.masonry');
	if($selector.length){ // if this fails try $selector.length > 0 (greater than 0)
	
		var container = document.querySelector('.masonry');
		var msnry = new Masonry( container, {
		  columnWidth: 200,
		  itemSelector: '.masonry-item',
		  transitionDuration: 0,
		  gutter: 70,
		  "isFitWidth": true,
		});
   
	}

	

	/* masthead-mp hover --------------------------------------------------------------------------- */
	/*
	$( "#masthead-mp" ).hover(
	  function() {
	  	$( ".mp-green" ).hide();
	  }, function() {
	    $( ".mp-green" ).show();
	  }
	);
	*/

	/* show project list ------------------------------------------------------------------------- */
	$( "#nav-projects" ).click(function() {
	  $( "#project-list" ).slideToggle( 'fast', function() {
	    // Animation complete.
	  });
	});

	/* current page in prohect list ------------------------------------------------------------- */
	var currentProject = $('#project-multi-list').attr('title');
	$('#project-multi-list li').each(function(){
		
		var liProject = $(this).attr("title");

		if ($(this).attr("title") == currentProject) {
			$(this).addClass("current");
		}
	})

	/* thumbnail captions hover ----------------------------------------------------------------- */
	$( ".project-thumbs-item" ).hover(
	  function() {
	    $( this ).find('.thumb-h2').show();
	    $( this ).find('.search-match').hide();
	  }, function() {
	    $( this ).find('.thumb-h2').hide();
	    $( this ).find('.search-match').show();
	  }
	);

	/* search ---------------------------------------------------------------------------------- */
	//get URL parameter
	$.extend({
	  getUrlVars: function(){
	    var vars = [], hash;
	    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
	    for(var i = 0; i < hashes.length; i++)
	    {
	      hash = hashes[i].split('=');
	      vars.push(hash[0]);
	      vars[hash[0]] = hash[1];
	    }
	    return vars;
	  },
	  getUrlVar: function(name){
	    return $.getUrlVars()[name];
	  }
	});

	//function to show search field
	function showSearch(){
		$('.nav-item').css('visibility','hidden');
		$('#search-module').show();
		$('#clear').show();
	}

	function hideSearch(){
		$('.nav-item').css('visibility','visible');
		$('#search-module').hide();
	}

	//when there's a search term, show search field by default
	if ($.getUrlVar("q") != null) {
    	showSearch();
	}

	//show search field upon click
	$("#nav-search").click(function(){
		showSearch();	
		$('#search-field').focus();
	});

	//hide search field when blur/empty
	$("#search-field").blur(function(){
		var val = $('#search-field').val();
		if (val == ""){
			hideSearch();
		}
	})

	//when "x" button is clicked
	$("#clear").click(function(){
		// if there's a search term
		if ($.getUrlVar("q") != null) {
			if (!window.location.origin)
		    window.location.origin = window.location.protocol+"//"+window.location.host;
	    	
	    	window.location.href = window.location.origin;
		}
		else {
			$('#search-field').val('');
			hideSearch();
		}
	})

	/* project list hover */
	/*
	$( ".project-list-item" ).hover(
	  function() {
	    var target = '.' + $( this ).find('a').attr('class').replace('list','thumb');
		$(".project-thumbs-item").css('opacity','.5');
	    $(target).css('opacity','1');
	  }, function() {
	  	$(".project-thumbs-item").css('opacity','1');
	  }
	);
	*/

	/* scroll to show related projects ---------------------------------------------------------------  */
	setRelatedOpacity();

	$(window).scroll(function() {
		setRelatedOpacity();
	});

	function setRelatedOpacity(){
		if ($('#related-thumbs').length){
			var pageLoc = $('body').scrollTop();
			var relatedLoc = $('#related-thumbs').position().top;
			viewportHeight = $(window).height();
			var trigger = relatedLoc - viewportHeight/1.5;
			var opacity = (pageLoc - trigger) / (viewportHeight/2.5);
			opacity = Math.round(opacity * 100) / 100;
			if (opacity > 1) { opacity = 1; }
			if (opacity < 0) { opacity = 0; }
			$('#related-thumbs').css('opacity',opacity);
			//console.log('Currently at ' + pageLoc + '. Thumbnails start at ' + relatedLoc + '. Viewport Height: ' + viewportHeight);
		}
	}

	/* multi-column list ------------------------------------------------------------------------------ */
	
	//config
	var colWidth = 225;
	var colCountMax = 8; //total 1800px
	var target = '#project-multi-list';
	var listCount = $(target + " li").length; //get # of columns
	var lineHeight = 1.5;

	$.fn.multiColList = function() { 

		viewportWidth = $(window).width(); //viewport width	
		//get colCount that's possible within viewportWidth
		var cols = Math.floor(viewportWidth / colWidth);
		if (cols > colCountMax) { cols = colCountMax;}
		var baseCountPerCol = Math.floor(listCount / cols); //base# of <li>s
		var leftoverCount = listCount % (cols); //to be added to the first few columns

		/*
		console.log(
			'viewportWidth:'  + listCount + 
			' viewportWidth:' + viewportWidth + 
			' cols:' + cols + 
			' baseCountPerCol:' + baseCountPerCol + 
			' leftoverCount:' + leftoverCount + 
			' lineHeight:' + lineHeight
		);
		*/
    	
    	var listPointer = 1; //:nth child starts from 1 not 0;
    	var actualCountPerCol = [];

    	//set container height correctly
    	if (leftoverCount > 0){
    		$( target ).css("height", ((baseCountPerCol + 1) * lineHeight) + 'em');
    	}
    	else{
    		$( target ).css("height", (baseCountPerCol * lineHeight) + 'em');	
    	}

		for (var i=0; i < cols; i++) {
			//console.log('col' + i);
			
			//if there should be additional lines, add 1
			if (
				i < leftoverCount) { actualCountPerCol[i] = baseCountPerCol + 1; 
			}
			else { 
				actualCountPerCol[i] = baseCountPerCol; 
			}
			
			//calculate margin-top, except the first column
			if (i == 0){
				var marginTop = 0;
			}
			else {
				var marginTop = actualCountPerCol[i-1] * lineHeight;
			}

			//loop through items in this column
			for (var j=0; j < actualCountPerCol[i]; j++){

				var currentList = target + " li:nth-child(" + listPointer + ")";
				var marginLeft = colWidth * i;

				$( currentList ).css("margin-left" , marginLeft + 'px'); //set left margin

				if (j == 0){
					$( currentList ).css("margin-top" , '-' + marginTop + 'em'); //set top margin		
				}
				else {
					$( currentList ).css("margin-top" , '0'); //reset top margin
				}
				
				//console.log('-li' + j + ' --- list:nth(' + listPointer + ') marginLeft:' + marginLeft + ' marginTop:' + marginTop);

				listPointer++;
			}
		}

	}

	$(target).multiColList();

	//resize wait until done
	var waitForFinalEvent = (function () {
	  var timers = {};
	  return function (callback, ms, uniqueId) {
	    if (!uniqueId) {
	      uniqueId = "Don't call this twice without a uniqueId";
	    }
	    if (timers[uniqueId]) {
	      clearTimeout (timers[uniqueId]);
	    }
	    timers[uniqueId] = setTimeout(callback, ms);
	  };
	})();


	$(window).resize(function () {
	    waitForFinalEvent(function(){
	      $(target).multiColList();
	      $('body').resizeElements(); // call resizeElements
	      $(window).newsListClear();
	    }, 500);
	});

	/* responsive ----------------------------------------------------------------------- */
	//viewportWidth is already here;

	//assign entityClass to videos
	$('#media .element iframe').addClass('responsive-entity');

	var entityClass = '.responsive-entity';

	//get list of items with class="responsive-entity" and save each width and height in array
	var entityWidth = $(entityClass).map(function(){
	    return $(this).attr('width');
	}).get();

	var entityHeight = $(entityClass).map(function(){
	    return $(this).attr('height');
	}).get();

	$.fn.resizeElements = function() { 
	
		//go through every image and see anything is bigger than viewportWidth then resize max-width=100
		for (i=0; i < entityWidth.length; i++){

			var entity = $(entityClass).get(i);

			if ( entityWidth[i] > viewportWidth){ //image is bigger thean viewport
				var newWidth = viewportWidth - 60;
				var newHeight = entityHeight[i]/entityWidth[i]*newWidth;
				//remove HTML ATTRs
				$(entity).attr('width',newWidth);
				$(entity).attr('height',newHeight);
				$(entity).parents('.element').css('margin-right','0');
			}
			else {
				$(entity).attr('width',entityWidth[i]);
				$(entity).attr('height',entityHeight[i]);
				$(entity).parents('.element').css('margin-right','30');
			}
		}

	}

	$(window).resizeElements();

	/* after-video float clear */
	if( $('.after-video').length ){
		$('.after-video').parent().after("<hr style='border:none; padding:0; margin:0; clear:both; width:100%;'>");
	}

	/* news page, hanging laundry style -------------------------------------- */
	$.fn.newsListClear = function() { 
		if( $('.news-list').length ){ //if there's a news list
			if ($('.news-break').length) { 
				$('.news-break').remove();
			}
			var itemWidth = parseInt($('.news-item').css('width').replace('px',''));
			var itemGutter = parseInt($('.news-item').css('margin-right').replace('px',''));
			var contentMargin = parseInt($('#content').css('margin-left').replace('px','')) + parseInt($('#content').css('margin-right').replace('px',''));
			var colCount = Math.floor((viewportWidth-contentMargin) / (itemWidth + itemGutter))
			console.log(colCount);

			//select last ones
			$( ".news-item" ).filter(function( index ) {
			    return index % colCount === colCount-1;
			  }).after( "<hr class='news-break'></div>" );;
		}
	}

	$(window).newsListClear();
});
(function($) {
	var showLarge = false;
	
	$.fn.horizontalGallery = function(duration, loaderSettings) {
		if(!duration) duration = 500;
		var frame = this;
		var frameID = this.attr('id');
		var frameW = frame.width();
		var total;
		var sizesW = [];
		var sizesH = [];
		var totalW;
		var inner;
		
		if(loaderSettings && $.isArray(loaderSettings)) {
			var bbi = new BlackBoxImg($('<img/>').attr('src',loaderSettings[0]), loaderSettings[1], loaderSettings[2]);
		}else{
			bbi = new BlackBoxImg();
		}
			
		$(window).load( function() {
				
			if(frame.is('ul')) {
				frame.css({'position':'relative', 'overflow':'hidden'});
				frame.find('a').click( function() {
					return false;
				});
					
				total = $('li', frame).length;
				$('li', frame).find('img').each( function() {
					sizesW.push($(this).width());
					sizesH.push($(this).height());
				});
				totalW = 0;
				for(var i=0; i<total; i++){
					totalW += sizesW[i];
				}
					
				inner = $('<li class="inner"><ul></ul></li>');
				frame.append(inner);
				inner.find('ul').css({'position':'absolute','top':0,'left':0, 'list-style':'none','padding':0,'margin':0, 'width':totalW+'px'});
					
				$('li', frame).each( function(index) {
					if(!$(this).hasClass('inner')) {
						var topMargin = (frame.height()-sizesH[index]*0.5)*0.5;
						$(this).find('img').attr('width',sizesW[index]*0.5).attr('height',sizesH[index]*0.5).css({'margin-top':topMargin+'px'});
						frame.find('.inner').children('ul').append($(this));	
							
						$(this).hover( 
							function() {
								mouseOverHandler(index, $(this));
							},
							function() {
								mouseOutHandler(index, $(this), topMargin);
							}
						);
							
						$(this).find('a').click( function() {
							mouseClickHandler(index, $(this), topMargin);
						});
						//FOR MOBILE DEVICE
						if('ontouchstart' in document.documentElement) {
							this.addEventListener('touchstart', function(e) {
								e.preventDefault();
								mouseOverHandler(index, $(this));
							}, false);				
							this.addEventListener('touchend', function(e) {
								e.preventDefault();
								mouseOutHandler(index, $(this), topMargin);
							}, false);
							this.addEventListener('touchmove', function(e) {
								if(!showLarge) {
									showLarge = true;
									e.preventDefault();
									mouseClickHandler(index, $(this).find('a'), topMargin);
								}
							}, false);											
						}
					}
				});
				
			}
			return frame;
		});
		
		function mouseOverHandler(index, obj) {
			var curTotalW = totalW*0.5+sizesW[index]*0.5;
			var topMargin2 = (frame.height()-sizesH[index])*0.5;
			obj.find('img').stop(false, false).animate({'width':sizesW[index]+'px','height':sizesH[index]+'px','margin-top':topMargin2+'px'}, duration);
			if(frame.width() < curTotalW) {
				var moveTotalW = 0;
				for(var i=0; i<index; i++) {
					moveTotalW += sizesW[i]*0.5;
				}
				moveTotalW += sizesW[index];
				moveTotalW -= (sizesW[0]/total)*(total-index-1);
				if(index == 0) moveTotalW = 0;
								
				var gapW = curTotalW - frameW;
				var curPosi = (moveTotalW/curTotalW)*gapW*(-1);
				inner.find('ul').stop(false, false).animate({'left':curPosi+'px'}, duration);
			}
		}
		
		function mouseOutHandler(index, obj, topMargin) {
			obj.find('img').stop(false, false).animate({'width':sizesW[index]*0.5+'px','height':sizesH[index]*0.5+'px', 'margin-top':topMargin+'px'}, duration);
			if(frame.width() < totalW) {
				var innerPosi = inner.find('ul').position().left;
				var gap = innerPosi-(frame.width()-totalW*0.5);
				if(gap < 0) {
					inner.find('ul').stop(false, false).animate({'left':(innerPosi-gap)+'px'}, duration);
				}
			}
		}
		
		function mouseClickHandler(index, obj, topMargin) {
			obj.find('img').css({'width':sizesW[index]*0.5+'px','height':sizesH[index]*0.5+'px', 'margin-top':topMargin+'px'});
			var file = obj.attr('href');
			var showdesc = obj.find('img').attr('showdesc');
			var title = obj.find('img').attr('imgtitle');
			var desc = obj.find('img').attr('imgdesc');
								
			if(showdesc && showdesc != 'undefined' && showdesc != 'false')
			var descHTML = '<div style="color:#fff;text-align:left;padding:10px;"><h3>'+title+'</h3><p>'+desc+'</p></div>';
			bbi.setting(file, descHTML);
			imgLarge = null;
		}
	}
	
	function onMouseWheelHandler(e) {
		if(!e) e = window.event;
		if(e.preventDefault) {
			e.preventDefault();
		}else {
			e.returnValue = false;
			e.cancelBubble = true;
		}
		return false;
	}
			
	////////////////////////////////
	//BLACK BOX IMAGE PLUGIN//
	////////////////////////////////
	var BlackBoxImg = function(loaderImg, loaderWidth, loaderHeight) {
	
		if(loaderImg && loaderWidth && loaderHeight) {
			this.loaderBool = true;
			this.loaders = [loaderImg, loaderWidth, loaderHeight];
		}
		
		this.setting = function(imagefile, descHTML) {
			
			var ww = $(window).width();
			var wh = $(window).height();
			var originalW;
			var originalH;
			var descH;
			var scrollTop = $(window).scrollTop();
			var imgloaded = false;
			
			var bodyH = Math.max(
        		Math.max(document.body.scrollHeight, document.documentElement.scrollHeight),
        		Math.max(document.body.offsetHeight, document.documentElement.offsetHeight),
        		Math.max(document.body.clientHeight, document.documentElement.clientHeight)
    		);
			//console.log(bodyH);
			if(bodyH == 0) bodyH = 10000;
			else if(bodyH < wh) bodyH = wh;
				
			var blackbox = $('<div></div>').attr('id','black_box_back_pane').css({'position':'absolute','top':0,'left':0,'width':ww+'px','height':bodyH+'px','background-color':'#000','opacity':0.85,'text-align':'center'});
			if(this.loaderBool) {
				this.loaders[0].css({'margin-top':(wh-this.loaders[2])*0.5+scrollTop+'px'}).appendTo(blackbox);
			}
			
			var contentbox = $('<table></table>').attr({'id':'black_box_content_pane','cellPadding':0,'cellSpacing':0}).css({'position':'absolute','top':scrollTop+'px','left':0,'text-align':'center','width':ww+'px','height':wh+'px'});
			var contentDiv = $('<div></div>').css({'position':'relative','overflow':'hidden','margin':'0 auto'});
			var td = $('<td></td>').css({'vertical-align':'middle','width':'100%','height':'100%','text-align':'center'});
			td.append(contentDiv);
			contentbox.append($('<tr></tr>')).find('tr').append(td);
			
			var closebtn = '<div style="font-size:30px;color:#fff;padding:9px 12px 5px 12px;">X</div>';
			var closebox = $('<div></div>').attr('id','black_box_close_box').css({position:'absolute',top:scrollTop+'px',left:0,opacity:0.8,cursor:'pointer',fontFamily:'sans-serif',fontWeight:'bold',backgroundColor:'#000'}).html(closebtn);
				
			//IMAGE LOADING FUNCTION	
			var imgObject = new Image();
			imgObject.src = imagefile+'?r='+Math.random();
			imgObject.onload = function() {
				
				blackbox.empty();
				imgloaded = true;
				originalW = this.width;
				originalH = this.height;
					
				var sizes = calculation(ww, wh, originalW, originalH); 
				this.width = sizes[0]; this.height = sizes[1];
				contentDiv.css({'width':sizes[0]+'px','height':sizes[1]+'px'}).append(this);
				descH = sizes[1];
					
				if(descHTML) {
					$('<div></div>').attr('id','black_box_desc_pane').css({'position':'absolute','left':0,'background-color':'#000','opacity':0.8,'overflow':'auto'}).html(descHTML).appendTo(contentDiv);		
					var desc = $('#black_box_desc_pane').css({'width':sizes[0]+'px','height':sizes[1]+'px','top':sizes[1]+'px'});;
					contentDiv.find('img').bind('click', function() {
						desc.stop(true,false).animate({'top':0},500);
					});
					desc.bind('click', function() {
						$(this).stop(true,false).animate({'top':descH+'px'}, 500);
					});
					contentDiv.find('img').bind('touchstart', function(e) {
						e.preventDefault();
						desc.stop(true,false).animate({'top':0},500);
					}, false);
					desc.bind('touchstart', function(e) {
						e.preventDefault();
						$(this).stop(true,false).animate({'top':descH+'px'}, 500);
					});
				}
			}
						
			window.onmousewheel = document.onmousewheel = onMouseWheelHandler;
			if(window.addEventListener) {
				window.addEventListener('DOMMouseScroll', onMouseWheelHandler, false);
			}
			$('body').append(blackbox).append(contentbox).append(closebox);	
			
			//CLOSE BLACK BOX FUNCTION
			closebox.bind('click', function(e) {
				e.preventDefault();
				closeHandler();
			});
			closebox.bind('touchstart', function(e) {
				e.preventDefault();
				closeHandler();
			});
			
			function closeHandler() {
				if(window.removeEventListener) {
					window.removeEventListener('DOMMouseScroll', onMouseWheelHandler);
				}
				window.onmousewheel = document.onmousewheel = null;
				
				closebox.unbind('click');
				closebox.unbind('touchstart');
				
				if(descHTML) {
					contentDiv.find('img').unbind('click');
					$('#black_box_desc_pane').unbind('click');
					contentDiv.find('img').unbind('touchstart');
					$('#black_box_desc_pane').unbind('touchstart');
				}
						
				closebox.remove();
				contentbox.remove();
				blackbox.remove();
							
				blackbox = null;
				contentbox = null;
				closebtn = null;
				closebox = null;
				contentDiv = null;
				td = null;
				imgObject = null;
				descHTML = null;
				ww = null;
				wh = null;
				originalW = null;
				originalH = null;
				descH = null;
				scrollTop = null;
				bodyH = null;
				imgloaded = null;
				
				showLarge = false;
			}
			
			//RESIZE WINDOW FUNCTION
			$(window).resize( function() {
				if(imgloaded) {
					ww = $(this).width();
					wh = $(this).height();
					scrollTop = $(window).scrollTop();
					if(document.getElementById('black_box_back_pane')) {
						$('#black_box_back_pane').css({'width':ww+'px'});
						if(wh+scrollTop > bodyH) {
							$('#black_box_back_pane').css({'height':wh+scrollTop+100+'px'});
						}
					}
				
					if(document.getElementById('black_box_content_pane')) {
						contentbox = $('#black_box_content_pane');
						contentbox.css({'width':ww+'px','height':wh+'px'});
						var img = contentbox.find('img');
						var sizes = calculation(ww, wh, originalW, originalH);
						img.attr({'width':sizes[0],'height':sizes[1]});
						descH = sizes[1];
						img.parent().css({'width':sizes[0]+'px','height':sizes[1]+'px'});
						if(descHTML) {
							$('#black_box_desc_pane').css({'width':sizes[0]+'px','height':sizes[1]+'px','top':sizes[1]+'px'});
						}	
					}
					
					if(document.getElementById('black_box_close_box')) {
						$('#black_box_close_box').css({'top':10+scrollTop+'px'});	
					}
				}
			});
			
			//IMAGE SIZE CALCULATION
			function calculation(ww, wh, curW, curH) {
				var w;
				var h;
				if(ww/wh <= curW/curH) {
					w = ww-40;
					if(w < curW) {
						h = curH/curW*w;
					}else{
						w = curW;
						h = curH;
					}
				}else{
					h = wh-40;
					if(h < curH) {
						w = curW/curH*h;
					}else{
						w = curW;
						h = curH;
					}
				}
				return [Math.round(w), Math.round(h)];
			}
		}
	}
})(jQuery);
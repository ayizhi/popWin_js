//====================================================  小弹窗  =========================================================
//*****  弹窗z-index为5000 + 10*num  ******

// 默认mask的class为'theMask';
	// 默认弹框的class为'theAlertBox',id需要初始化设置;

	// 接受参数:
	// 		alert框的id(因为同时只会存在一个mask和多个alert框,所以只需要设定alert的id),
	//		title = '',名称
	//		info = {
	//				'width':'',   默认550px
	//				'height':'',  默认260px
	//				'hasCloseBtn':false,  默认为true
	//    			'bottomBtn':{'className':'content'}  有几个btn写几个,默认是一个确定按钮 key为类名,value为按钮内容
	// 			}
	//

	// 封装的方法：
	// 	rmThis：删掉这个弹窗框
	// 	rmAll：删掉全部谈窗框
	// 	reborn：状态需要保留，比如勾选关闭后，再打开还需要显示原来勾选的结果
	// 	appendDom：可以是拼接字符串，也可以是dom对象或者jq对象
	// 	bindEvent：绑定事件，需要传入一个function

	//其中css可以通过_init方法设置，其中例如大小尺寸这种属性需要在css中设置


//======================================================================================================================

//=====================================================  跳出窗口  =======================================================
	//AlertWin(winId,title,obj)
	//参数:
	//winId:新生成window的ID,
	//title:新win的标题
	//obj = {
	// 			'width':'',//默认100%,
	//			'height':'',//默认100%,
	//			'from':''//上左下右,left,right,top,bottom,弹出的位置,默认为bottom,
	//			'closeBtn':''//true or false , 默认为true,
	//			'titleIcon':''//传一个类名,默认为''
	// 	    	'bottomBtn':{'className':'content'}  有几个btn写几个,默认是一个确定按钮 key为类名,value为按钮内容
	// 		}

	//封装方法
	//rmThis
	//appendDom
	//bindEvent
	//reborn

//======================================================================================================================
	//弹窗管理器
	function PopWinController(){

		this.alertWinArr = {};

		this.bindEvent();
	}

	PopWinController.prototype = {
		pushThis : function (obj) {
			var id = obj.winId ? obj.winId : obj.alertId;
			this.alertWinArr[id] = obj
		},
		deleteThis : function (obj){
			var id = obj.winId ? obj.winId : obj.alertId;
			this.alertWinArr[id] = null;
			delete this.alertWinArr.id;
		},
		bindEvent : function () {
			var t = this;

			//点击esc推出
			document.body.onkeydown = function(e){//按esc删除
				if(e.keyCode == 27){
					//找到z-index最大值
					var theMax = {};
					theMax['z-index'] = 0;

					for(var key in t.alertWinArr){
						if(t.alertWinArr[key]){
							if(t.alertWinArr[key]['z-index'] > theMax['z-index']);
							theMax = t.alertWinArr[key];
						}
					}
					if($('#' + theMax.alertId + ' .alertTitle .theCloseBtn').length > 0 ){
						$('#' + theMax.alertId + ' .alertTitle .theCloseBtn').trigger('click');
					}else if($('#' + theMax.winId + ' .winTitle .theCloseBtn').length > 0){
						$('#' + theMax.winId + ' .winTitle .theCloseBtn').trigger('click');
					}
				}
			}

		}
	}

	//弹窗管理器
	var popWinController = new PopWinController


	function Dialog(alertId,title,obj){//小弹窗
		if(document.getElementById(alertId)){//防止alertId重复
			return
		}
		var obj = obj?obj:{};
		this.alertId = alertId;
		this.title = title;
		this.hasCloseBtn = (obj['hasCloseBtn'] == undefined) ? true : obj['hasCloseBtn'];
		this.width = obj['width'] ? obj['width'] : '460px';
		this.height = '400px';

		this.marginTop = obj['margin-top'] ? obj['margin-top'] : "100px"

		var btns = obj['bottomBtn'] ? obj['bottomBtn'] : {};
		this.bottomBtn = "";
		for(var key in btns){
			this.bottomBtn += '<button class = "btn bottomBtn ' + key + '">' + btns[key] + '</button>'
		}
		this['z-index'] = obj['z-index'] ? obj['z-index'] : 5000;
		this['hasMaskAgain'] = obj['hasMaskAgain'] ? obj['hasMaskAgain'] : false;

		this.theMask = appendAlert('','theMask');
		this.theAlertBox = appendAlert(this.alertId,'alertBox',this.theMask);

		if(this.hasCloseBtn){
			this.theCloseBtn = '<span class = "theCloseBtn"><i class = "icon icon-close"></i></span>'
		}

		this._init();

		popWinController.pushThis(this);



		function appendAlert(id,className,box) {
			if(!box){
				var box = document.body;
			}else{
				var box = box;
			}

			if (document.getElementById(id)) {
				var theDom = document.getElementById(id);
			} else {
				var theDom = document.createElement('div')
				if(id){
					theDom.setAttribute('id', id);
				}
				if(className){
					theDom.setAttribute('class',className)
				}
				box.appendChild(theDom)
			}
			return theDom;
		};
	};


	Dialog.prototype = {
		_init : function(){

			var t = this,
				maskNum = $('.theMask').length,
				alertMarginTop = this.marginTop,
				zIndex = this['z-index'];

			this['z-index'] +=  maskNum*10


			if(this.title){//如果有标题则设置标题
				var closeObj = (this.theCloseBtn == undefined)? '' : this.theCloseBtn;
				$(this.theAlertBox).append($(
					'<div class = "alertTitle">' + '<span>' + this.title + '</span>' + closeObj + '</div>' +
					'<div class = "alertBody"></div>' +
					'<div class = "alertFooter">' + this.bottomBtn + '</div>'
				))
			}else{
				$(this.theAlertBox).append($(
					'<div class = "alertBody"></div>' +
					'<div class = "alertFooter">' + this.bottomBtn + '</div>'
				))
			}



			//样式预设
			$(this.theMask).css({
				'width': '100%',
				'height': '100%',
				'position': 'fixed',
				'left': 0,
				'top': 0,
				'z-index': parseInt(zIndex) + maskNum * 10,
				'backgroundColor': maskNum <= 1 ? 'rgba(227, 227, 227,0.6)' :(this['hasMaskAgain'] ? 'rgba(227, 227, 227,0.6)' : 'none'),
				'display':'none',
				//'overflow-y':'auto',
			})

			$(this.theAlertBox).css({
				'padding':'0 20px',
				'width' : this.width,
				'margin': 'auto',
				'margin-top': parseInt(alertMarginTop) + 'px',
				'box-shadow':'0 0 4px #aaaaaa',
				'background-color':'#fff',
				'position':'relative',
				//'overflow-y':'auto',

			})




			//设置alert内基础样式
			$(this.theAlertBox).find('.alertTitle').css({//标题
				'height':'50px',
				'border-bottom':'1px solid rgb(238, 236, 236)',
				'color':'#999999',
				'line-height':'50px',
				'text-align':'center',
				'font-weight':'normal',
				'font-style':'normal',
				'font-size':'16px',
			})

			if(this.theCloseBtn){
				$(this.theAlertBox).find('.theCloseBtn').css({//关闭按钮的样式跟显示
					'width':'50px',
					'height':'50px',
					'position':'absolute',
					'right':'0',
					'cursor':'pointer',
					'text-align':'center',
					'line-height':'50px',
				})

				$(this.theAlertBox).find('.alertTitle .theCloseBtn').click(function(){
					t.rmThis()
				})
			}

			$(this.theAlertBox).find('.alertBody').css({//主体
				'padding':'30px 0',
				'max-height':this.height,
				//'overflow-y':'auto',
			})

			$(this.theAlertBox).find('.alertFooter').css({//按钮体
				'text-align':'center',
				'line-height':'40px',
				'padding':'20px 0',

			}).find('.bottomBtn').css({
				'padding':'0 20px 0 20px',
				'height':'36px',
				'display':'inline-block',
				'text-align':'center',
				'line-height':'36px',
				'margin-left':'10px',
				'border-radius':'5px',
				'cursor':'pointer',
			})


			$(this.theAlertBox).find('.bottomBtn:first').css({
				'margin-left':'0',
			})


			//一些点击事件
			$('#' + t.alertId + ' .alertTitle .theCloseBtn').click(function(){
				t.rmThis();
			})

			$('#' + t.alertId + ' .cancel').on('click',function(){
				$('#' + t.alertId + ' .alertTitle .theCloseBtn').trigger('click');
			})

			document.body.style.overflow = 'hidden';
		},

		rmThis : function(){
			if(document.getElementById(this.alertId)){
				$(this.theMask).remove();
			}
			popWinController.deleteThis(this);
			document.body.style.overflow = 'auto'
		},

		rmAll : function(){
			if($('.theMask')){
				$('.theMask').remove()
			}
			document.body.style.overflow = 'auto'
		},

		reborn : function(){
			if(!document.getElementById(this.alertId)){
				document.body.appendChild(this.theMask);
			}
			if(!document.getElementById(this.alertId)){
				this.theMask.appendChild(this.theAlertBox)
			}
			document.body.style.overflow = 'hidden';//属性初始化

			//得重新绑定事件
			if(this.hasCloseBtn){
				$(this.theAlertBox).find('.alertTitle .theCloseBtn').click(function(){
					t.rmThis()
				})
			};
			$(document).on('click','#' + this.alertId + ' .cancel',function(){
				t.rmThis();
			})

			if(this.callback){
				this.callback.call(this.theAlertBox);
			}
		},

		appendDom : function(dom){//此处dom应为拼接好的字符串；
			$(this.theAlertBox).find('.alertBody').html($(dom));
			//防止闪一下,加了个fadeInd()
			$(this.theMask).fadeIn(100)

			var thisAlertBox = $('#' + this.alertId);
			var $height = ($(document.body).height() - thisAlertBox.height())/2;
			$height = $height < 0 ? 0 : $height;
			$(this.theAlertBox).css({
				'margin-top': parseInt($height) + 'px',
			})

			var t = this;

			var timer = setTimeout(function(){
				$(t.theMask).mCustomScrollbar({
					autoHideScrollbar:true,
					theme:'minimal',
					alwaysShowScrollbar: 1,
				});

				$(t.theAlertBox).find('.alertBody').mCustomScrollbar({
					autoHideScrollbar:true,
					theme:'minimal',
					alwaysShowScrollbar: 1,
				})

				clearTimeout(timer);
			},2)
		},
		bindEvent : function(callback){
			var callback = callback?callback:function(){};
			this.callback = callback;
			callback.call(this.theAlertBox);
		}
	};



















































	function PopWin(winId,title,obj){
		if(document.getElementById(winId)){//防止alertId重复
			return
		}

		$(document.body).css({//禁止滚动
			'overflow':'hidden',
		})

		var obj = obj?obj:{},
			location = {
				'left':{'left':'-100%','top':'0'},
				'right':{'left':'100%','top':'0'},
				'bottom': {'left':'0','top':'100%'},
				'top':{'left':'0','top':'-100%'},
			};

		this.winId = winId;
		this.titleName = $.trim(title);
		this.width = obj['width'] ? obj['width'] : '100%';
		this.height = obj['height'] ? obj['height'] : '100%';
		this.fromDir = obj['from'] ? obj['from'] : 'bottom';
		this.from = location[this.fromDir]
		this.titleIcon = obj['titleIcon'] ? obj['titleIcon'] : 'icon-off-hot';
		var btns = obj['bottomBtn'] ? obj['bottomBtn'] : false;
		this.bottomBtn = '';
		this['z-index'] = obj['z-index'] ? obj['z-index'] : 999;

		for(var key in btns){
			this.bottomBtn += '<button class = "btn bottomBtn ' + key + '">' + btns[key] + '</button>'
		}

		this.title = '<div class = "winTitle">' +
			'<span class = "title">' + this.titleName + '</span>' +
			'<button class = "titleBtn theCloseBtn"><i class = "icon icon-close"></i></button>' +
			'</div>';
		this.body = '<div class = "winBody"><img class="loadingImg loading-win-body" src="../../img/loading.gif"><img class="loadingImg loading-win-text" src="../../img/loadingText.gif"></div>';
		this.footer = '<div class = "winFooter">' + this.bottomBtn + '</div>'
		//设置dom
		this.$win = $('<div class = "alertWin" id = "' + this.winId + '"></div>');
		if(this.titleName){
			this.$win.append($(this.title))
		}
		this.$win.append($(this.body));
		if(this.bottomBtn){
			this.$win.append($(this.footer))
		}

		this.timer = 200;

		this.init();
		popWinController.pushThis(this);


	};

	function GetLoadingMarginTopValue(upValue, loadingSize) {
		var height = window.innerHeight / 2 - upValue - loadingSize;
		return Math.max(30, height);
	}

	PopWin.prototype = {
		init : function(){
			var t = this,
				$tWin = t.$win,
				from = this.from,
				upFooterHeight = 75,
				loadingSize = 70,
				winLen = $('.alertWin').length;

			this['z-index'] +=  winLen*10

			$tWin.css({
				'width':'100%',
				'height':'100%',
				'position':'fixed',
				'left':from['left'],
				'top':from['top'],
				'z-index':this['z-index'],
				'background-color':'#fff'
			})

			$tWin.find('.winTitle').css({
				'width' : '100%',
				'height' : upFooterHeight + 'px',
				'border-bottom' : '2px solid #eee',
				'text-align' : 'center',
				'line-height' : upFooterHeight + 'px',
				'color':'#555555',
				'font-size':'22px',
				'position':'relative',
			})


			$tWin.find('.winTitle .theCloseBtn').css({
				'position':'absolute',
				'top':0,
				'right':'10px',
				'width' : upFooterHeight + 'px',
				'height' : upFooterHeight + 'px',
				'cursor':'pointer',
				'background':'#fff',
				'font-size': '24px',
				'color': '#bbb'
			})

			if(this.bottomBtn){
				var bodyHeight = parseInt($(document.body).height()) - upFooterHeight*2;
			}else{
				var bodyHeight = parseInt($(document.body).height()) - upFooterHeight - 20;
			}



			$tWin.find('.winBody').css({
				'height': bodyHeight,
				'overflow':'auto',
				'background-color':'#fff',
				'-webkit-scrollbar-track':'background-color: #b46868',// 滚动条的滑轨背景颜色
				'-webkit-scrollbar-thumb':'background-color: rgba(0, 0, 0, 0.2)',
				'-webkit-scrollbar-button':'background-color: #7c2929',
				'-webkit-scrollbar-corner': 'background-color: black',

			})

			$tWin.find('.winBody .loadingImg').css({
				'display':'block',
				'margin':'auto',
				'margin-bottom':'20px',
				// 'width':'150px',
				// 'height' :'25px'
			})
			$tWin.find('.winBody .loading-win-body').css({
				'width': loadingSize + 'px',
				'height': loadingSize + 'px',
				'margin-top': GetLoadingMarginTopValue(upFooterHeight, loadingSize) + 'px'
			})
			$tWin.find('.winBody .loading-win-text').css({
				'width':'80px',
				'height':'13.468px',
				'padding-left':'15px',
				'margin-top': '-7px'
			})


			$tWin.find('.winFooter').css({
				'height':upFooterHeight + 'px',
				'width' : '100%',
				'background-color' : '#eee',
				'text-align' : 'center',
				'line-height' : upFooterHeight + 'px',
			}).find('.bottomBtn').css({
				'padding':'0 30px 0 30px',
				'height':'40px',
				'display':'inline-block',
				'text-align':'center',
				'line-height':'40px',
				'margin-left':'10px',
				'border-radius':'5px',
				'cursor':'pointer',
			})

			$tWin.find('.bottomBtn:first').css({
				'margin-left':'0',
			})


			$(document.body).append(t.$win)

			var timer = setTimeout(function(){
				t.$win.animate({'top':0,'left':0},t.timer,'swing');
				clearTimeout(timer)
			},1)


			//一些点击事件
			$('#' + t.winId + ' .winTitle .theCloseBtn').click(function(){
				t.rmThis();
			})


			$('#' + t.winId + ' .cancel').click(function () {
				console.log('#' + t.winId + ' .winTitle .theCloseBtn')
				$('#' + t.winId + ' .winTitle .theCloseBtn').trigger('click');
			})



			// resize事件
			$(document).on('resize', function () {
				$('.winBody .loading-win-body').css('margin-top', GetLoadingMarginTopValue(upFooterHeight, loadingSize) + 'px');
			});



		},

		rmThis:function(){
			var t = this;
			$(document.body).css({
				'overflow':'auto',
			})
			t.$win.animate({'top': t.from['top'],'left': t.from['left']},t.timer,'swing',function(){
				t.$win.remove();
			})
			popWinController.deleteThis(this);

		},

		reborn : function(){
			var t = this;
			if(!document.getElementById(this.winId)){
				$(document.body).append(t.$win)

				$(document.body).css({//禁止滚动
					'overflow':'hidden',
				})
				t.$win.find('.winTitle .theCloseBtn').click(function(){//一些点击事件
					t.rmThis();
				})
				t.$win.find('.winTitle .icon').click(function(){
					t.rmThis();
				})
				$(document).on('click','#' + this.winId + ' .cancel',function(){
					t.rmThis();
				})

				if(this.callback){
					this.callback.call(this.$win);//重新绑定事件
				}


				var timer = setTimeout(function(){
					t.$win.animate({'top':0,'left':0},t.timer,'swing');
					clearTimeout(timer)
				},1)
			}
		},

		appendDom : function(str){
			var t = this;
			$('#' + this.winId).find('.winBody').html(str);
			var timer = setTimeout(function (){
				//优化滚动条
				$('#' + t.winId).find('.left-box').mCustomScrollbar({
					autoHideScrollbar:true,
					theme:'minimal',
					alwaysShowScrollbar: 1,
				});
				$('#' + t.winId).find('.middle-box').mCustomScrollbar({
					autoHideScrollbar:true,
					theme:'minimal',
					alwaysShowScrollbar: 1,
				});

				clearTimeout(timer)
			},100)

		},

		bindEvent : function(callBack){
			var callBack = callBack?callBack:function(){};
			this.callback = callBack;
			callBack.call(this.$win);
		}
	};







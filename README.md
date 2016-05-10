# alertWindow


 默认mask的class为'theMask';
	 默认弹框的class为'theAlertBox',id需要初始化设置;

	 接受参数:
	 		alert框的id(因为同时只会存在一个mask和多个alert框,所以只需要设定alert的id),
			title = '',名称
			info = {
					'width':'',   默认550px
					'height':'',  默认260px
					'hasCloseBtn':false,  默认为true
	    			'bottomBtn':{'className':'content'}  有几个btn写几个,默认是一个确定按钮 key为类名,value为按钮内容
	 			}
	

	 封装的方法：
	 	rmThis：删掉这个弹窗框
	 	rmAll：删掉全部谈窗框
	 	reborn：状态需要保留，比如勾选关闭后，再打开还需要显示原来勾选的结果
	 	appendDom：可以是拼接字符串，也可以是dom对象或者jq对象
	 	bindEvent：绑定事件，需要传入一个function

	其中css可以通过_init方法设置，其中例如大小尺寸这种属性需要在css中设置


======================================================================================================================

=====================================================  跳出窗口  =======================================================
	AlertWin(winId,title,obj)
	参数:
	winId:新生成window的ID,
	title:新win的标题
	obj = {
	 			'width':'',默认100%,
				'height':'',默认100%,
				'from':''上左下右,left,right,top,bottom,弹出的位置,默认为bottom,
				'closeBtn':''true or false , 默认为true,
				'titleIcon':''传一个类名,默认为''
	 	    	'bottomBtn':{'className':'content'}  有几个btn写几个,默认是一个确定按钮 key为类名,value为按钮内容
	 		}

	封装方法
	rmThis
	appendDom
	bindEvent
	reborn

======================================================================================================================

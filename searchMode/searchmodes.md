#searchModes
一个简单的工具，用于组织简单的``搜索条件更新 -->刷新页面局部``的过程。

基于``jquery``和``artTemplate``。

##用法：
###创建
	
	 /* *
	 	* 新建一个searchMode对象
	 	* defaultMode是搜索对象的模版
	  	* options是进行ajax过程时配置的一些参数,可以配置的项有：
	  		{
	  			'url' : '',
	  			'type' : 'post/get',
	  			'dataType' : 'json/html/jsonp',
	  			'tpl' : '要渲染的模版文件'
	  		}
	 */
	 var searchMode = $.searchModes(defaultMode,options);
	 
	 
###使用

以下这些方法，都支持链式调用
	 
	 searchMode.change(data,fun);  // 改变数据，并更新视图，其中fun是更新视图的函数，如果有多个，可以依次写入，但是第一个参数一定要是更新的搜索条件
	 
	 searchMode.changeView(fun,just) // 更新视图，最后的just参数是用来表明是否“仅仅”刷新视图，true为"仅仅"刷新视图，而不请求数据，false则为"请求数据，并刷新视图";
	 
	 searchMode.changeData(data); // 更新搜索条件，并不发起请求
	 
	 searchMode.ajax(data,fun); // 更新搜索条件，并发起请求，触发回调，是整个searchMode对象最为重要的方法，不过建议使用"change"方法，这样语法看起来更加简明易懂。
	 
	 searchMode.filter(fun); // 过滤数据，会返回给fun回调一个option，其中包括了"searchData"和“callbackData”，分别是“搜索条件”和“返回数据”，可以对其进行过滤。
	
	 

###增强
考虑到可能会有很多地方用到同样或者类似的``更新数据 --> 刷新页面局部``的流程，如果每个都写一大串，语法上会很难看，所以可以创建一个``searchFlow``对象，用于管理和调用相同或者相似的``步骤``，例如：

	var flow = $.searchFlow('flowName'); // 创建一个flow对象
	
	flow.config({
		'step' : ['changeData','filter','changeView'], // searchMode要进行的操作
		'changeDataFun' : fun, // 每部操作触发的回调
		'filterFun' : fun,
		'changeView' : fun
	});
	
	searchMode.use(flow); // 使用flow
	
	
	 	 
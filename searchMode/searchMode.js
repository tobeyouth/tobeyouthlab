/*
	一个方便当前页面刷新的工具
	
	具体原理就是：
	刷新数据 <--> 更新视图
	
	主要功能点在于本地搜索数据和内容部分的更新，对于请求过来的数据不关心
	
	2013 05 22
	by jn
*/

;(function (exports,$) {

	/*
		default是模版data，也就是一个列表，列出所有的搜索条件
		ps:当然，也可以不全部放入，但是还是建议全部放入，因为这样看起来比较清晰

		options是一些设置参数，默认模版为:

		options = {
			'class' : 'static/private/public' , // 数据类型，现在还么想好要做啥，先占上坑
			'tpl' : '', // 模版文件
			'url' : '', // ajax设置
			'type' : 'GET/POST' , 
			'dataType' : ''
		}

	*/

	
	/*
		searchMode对象
	*/
	var searchMode = function (defaultData,options) {
		this.data = defaultData;
		this.options = options;
	};

	var searchFlow = function (flowName,options) {
		this.name = flowName;
	};
	
	searchMode.modList = []; // searchMod的列表
	searchFlow.flowList = []; // searchflow的列表


	/*
		这里是主要内容
	*/
	searchMode.prototype = {
		'constructor' : searchMode,
		// ajax请求回来的数据存放在这里
		// 目前还没有做本地存储，因为考虑到这个东西可能经常性的更新
		// 如果做了本地存储，效率可能会更低下
		'callbackData' : null, 
		'changeData' : function (data) { // 更新搜索条件,但不改变视图
			$.extend(this.data,data);
			return this;
		},
		// 刷新视图；
		// fun这参数可以传入n个，就是可以有多个刷新视图的回调
		// 最后一个参数just表示是否仅仅刷新视图;
		// 就是不走ajax的过程，直接刷新callbackData中缓存的数据
		// 默认为false，就是连带着请求数据和刷新视图
		'changeView' : function (fun,just) {
			var searchMode = this,
				args = arguments,
				len = args.length,
				just =  args[len - 1],
				funArr = [].slice.call(arguments).slice(0,len-1);
			if (!!just && typeof(just) == 'boolean') { // 写了just且just为true时，只刷新页面
				if ($.isArray(fun)) {
					fun.call(searchMode,this.callbackData);
				}
			} else {
				this.ajax(this.data,fun); // 请求数据，并刷新页面
			};
			return this;
		},
		'ajax' : function (data,fun) { // 只请求数据，存入到searchMode的callbackData中
			if (!!data) { // 传入数据时，就先更新数据
				this.changeData(data);
			};

			var searchMode = this,
				options = searchMode.options,
				data = searchMode.data;

			// 这里做ajax请求
			$.ajax({
				'url' : options['url'],
				'type' : options['type'] || 'get',
				'dataType' : options['dataType'] || 'json',
				'data' : data,
				'success' : function (callbackData) {
					searchMode.callbackData = callbackData; // 将缓存更新
					if ($.isArray(fun)) {
						for (var i = 0,len = fun.length;i < len;i++) {
							fun[i].call(searchMode,callbackData);
						}
					} else {
						fun.call(searchMode,callbackData);
					};
					return searchMode; // 异步过程结束之后再返回对象，便于链式调用
				},
				'error' : function (err) {
					console.log(err);
				}
			});
		},
		'change' : function (data,fun) { // 更新搜索条件 -> 请求ajax -> 改变视图
			var searchMode = this,
				args = [].slice.call(arguments),
				data = args.shift(),
				fun = args.slice(1,args.length); // 将fun转化为数组
			$.extend(this.data,data); // 更新搜索条件
			this.changeView(fun); // 这些都在这里面做了
			return this;
		},
		// 仅仅是创建一个过滤的动作，不关心数据是什么，和下一步动作是什么;
		// 目前来看，主要应用在请求前的数据过滤，和请求后，刷新视图前的数据过滤
		// 待完成 ： 需要创建一个标识，来判断是过滤搜索数据，还是过滤ajax请求数据
		'filter' : function (fun) { 
			fun.call(searchMode,{'callbackData':this.callbackData,'searchData' : this.data});
			return this;
		},
		// 使用flow对象
		'use' : function (data,flow) {
			var searchMode = this,
				isPrototypeOf = Object.prototype.isPrototypeOf,
				flowProto = searchFlow.prototype,
				step = flow['step'];
			// 判断是否是flow对象
			if (!isPrototypeOf.call(flowProto,flow)) {
				console.log('请传入flow类型的对象');
				return;
			};

			// 按照step中的步骤来执行
			if (!!step && $.isArray(step)) {
				for (var i = 0,len = step.length;i < len;i++) {
					// 去找对应的方法，如果没有该方法，则跳过该方法继续执行并作出提示
					var funName = step[i]+'Fun';
				}
			} else {
				console.log('使用flow要先指定step才行');
				return;
			};
		},
		// 检测对象某属性的变化
		'watch' : function (type,setter) {

		}
	};

	searchFlow.prototype = {
		'constructor' : searchFlow,
		/*
			flow的格式:
			flow = {
				'name' : 'flow的名称',
				'step' : '[filter,change,changeView,changeData等方法的顺序]',
				'filterFun' : fun / [fun1,fun2], // filter要调用的函数，以下的参数都遵循这个原则
				'changeFun' : '',
				'changeViewFun' : '',
				'ajaxFun' : ''
			}
		*/
		'config' : function (flow) {
			for (key in flow) {
				this[key] = flow[key]
			};
		}
	};


	// 绑定到jQuery上
	$.extend({
		'searchMode' : function (defaultData,options) {
			var obj = new searchMode(defaultData,options);
			searchMode.modList.push(obj); // 推入到列表
			return obj;
		},
		'searchFlow' : function (flowName) { // 返回一个工作流程对象
			// 检查flowlist中是否已经存在了一个同名的flow
			for (var i = 0 ,len = searchFlow.flowList.length;i < len;i++) {
				if (searchFlow.flowList[i].name == flowName) {
					console.log('已存在同名的flow,请重新命名');
					return;
				}
			};

			var flow = new searchFlow(flowName);
			searchFlow.flowList.push(flow);
			return flow;
		}
	});
})(window,jQuery);


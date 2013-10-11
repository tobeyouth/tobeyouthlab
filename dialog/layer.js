/**
 * 最基本的对象
 * 包括弹层最基本的定位，显示，关闭，填充内容等方法
 *
 * 2013 10 09
 * by jn
 */
(function (exports,$) {
	var layerId = 0,
		layers = [];

	var defaultSetting = {
		'cache' : false, // 关闭后是否保留弹层
		// 位置信息
		'style' : {
			'left' : 'auto',
			'top' : 'auto',
			'right' : 'auto',
			'bottom' : 'auto',
			'width' : 'auto',
			'height' : 'auto'
		},
		// 各种回调和方法
		'beforeOpen' : null, // open之前的回调
		'open' : null, // open之后的回调
		'close' : null, // 关闭之后的回调
		'wrap' : null, // 外框
		'content' : null, // 内容，也可以通过setContent来动态插入
		// 'setWrap' : null, // 设置外框，如果不设置此方法的话，content是什么就会显示什么
		// 'setContent' : null, // 动态插入内容的方法
		'assemble' : null // 组装wrap和content
	};

	var layerList = {}; // 一个列表，用于记录页面中所有生成layer

	function layer(setting) {
		layerId += 1;
		this.setting = $.extend({},defaultSetting,setting);
		this.isOpen = false; // 表示是否处于open状态
		this.id = 'layer-' + layerId;
		layerList[this.id] = this;
	};

	layer.prototype = {
		'constructor' : layer,
		'open' : false, // 是否处于open状态
		'dom' : null, // dom对象，带有外框
		'content' : null, // 内容部分
		// 渲染对象
		'render' : function () {
			var layer = this,
				wrap,content,dom;

			// 渲染外框
			if ($.isFunction(layer.setting.wrap)) {
				wrap = layer.setting.wrap();
			} else if (typeof(layer.setting.wrap) == 'string') {
				wrap = layer.setting.wrap;
			} else {
				wrap = 'body';
			};
			layer.wrap = $(wrap);

			// 渲染content
			if ($.isFunction(layer.setting.content)) {
				content = layer.setting.content();
			} else if (typeof(layer.setting.content) == 'string') {
				content = layer.setting.content;
			};
			layer.content = $(content).length ? $(content) : content;

			// 拼接wrap和content
			if ($.isFunction(layer.setting.assemble)) {
				layer.setting.assemble(layer.wrap,layer.content);
				dom = layer.wrap;
			} else {
				dom = layer.wrap.append(layer.content);
			};
			layer.dom = $(dom).hide();

			return layer;
		},
		// 定位
		'setStyle' : function (options,callback) {
			var layer = this,
				option = $.extend({},defaultSetting.style,options);
			
			// 定位
			layer.dom.css(option);
			// 回调
			if ($.isFunction(callback)) {
				callback.call(layer,layer.dom);
			};

			return layer;
		},
		'open' : function (callback) {
			var layer = this;

			layer.render();
			layer.setStyle(layer.setting.style);

			layer.dom.appendTo('body');

			// 回调
			if ($.isFunction(layer.setting.beforeOpen)) {
				layer.setting.beforeOpen.call(layer,layer.dom);
			};
			//显示弹层
			layer.dom.show();

			// 回调
			if ($.isFunction(callback)) {
				callback.call(layer,layer.dom);
			} else if ($.isFunction(layer.setting.open)) {
				layer.setting.open.call(layer,layer.dom);
			};

			layer.isOpen = true;
			return layer;
		},
		'close' : function (callback) {
			var layer = this;
			if (layer.setting.cache) {
				layer.dom.fadeOut(function () {
					if ($.isFunction(callback)) {
						callback.call(layer,layer.dom);
					} else if ($.isFunction(layer.setting.close)) {
						layer.setting.close.call(layer,layer.dom);
					};
				});
			} else {
				layer.dom.fadeOut(function () {
					layer.destroy();
					if ($.isFunction(callback)) {
						callback.call(layer,layer.dom);
					} else if ($.isFunction(layer.setting.close)) {
						layer.setting.close.call(layer,layer.dom);
					};
				});
			};

			layer.isOpen = false;
			return layer;
		},
		// 插入内容
		'setContent' : function (content) {
			var layer = this;

			layer.content = content;

			// 拼接wrap和content
			if ($.isFunction(layer.setting.assemble)) {
				dom = layer.setting.assemble(layer.wrap,layer.content);
			} else {
				dom = layer.wrap.html(layer.content);
			};

			return layer;
		},
		'destroy' : function () {
			var layer = this;
			layer.dom.remove();
			layer = null;
			delete(layerList[this.id])
		}
	};

	// helper


	exports.layer = layer;
})(window,jQuery);
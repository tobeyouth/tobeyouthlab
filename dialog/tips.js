/**
 * 生成tips
 * 依赖于layer.js
 *
 * 2013 10 06
 * by jn
 */
(function (exports,$) {
	// 内部变量
	var tipsId = 0;

	// tip模版
	var wrapTpl = '<div class="Y_commenTips <%= tipClass %> <%= arrow %>" id="<%= id %>">' + 
					'<div class="bd">'+
					'</div>' + 
					'<% if (pointer) { %>' + 
						'<em class="pointer"></em>' + 
					'<% } %>' + 
					'<% if (closeBtn) { %>' + 
						'<a class="close" href="#"></a>' + 
					'<% } %>' + 
				  '</div>';

	// 默认设置
	var defaultSetting = {
		'pointer' : true, // 是否显示箭头
		'closeBtn' : true, // 是否显示关闭按钮
		'content' : '', // 内容
		'style' : {
			'left' : 'auto',
			'right' : 'auto',
			'top' : 'auto',
			'bottom' : 'auto',
			'width' : 'auto',
			'height' : 'auto',
			'position' : 'absolute'
		},
		'horizontal' : '0', // 水平偏移位置
		'vertical' : '0', // 垂直偏移位置
		'arrow' : 'bottom-tip',
		'tipClass' : '',
		'id' : '',
		'open' : null,
		'close' : null,
		'tipsId' : tipsId
	};

	// 原始tips对象
	function Tips(setting) {
		tipsId += 1;
		this.id = tipsId;

		var _setting = $.extend({},defaultSetting,setting),
			wrapRender = template.compile(wrapTpl),
			wrap = wrapRender(_setting);

		this.setting = $.extend({}, _setting, {
			'tipsId': 'tips-' + this.id,
			'wrap': wrap
		});

		this.layer = new layer({
			'cache' : false,
			'style' : this.setting.style,
			'wrap' : wrap,
			'content' : this.setting.content,
			'beforeOpen' : this.setting.beforeOpen,
			'open' : this.setting.open,
			'close' : this.setting.close,
			'assemble' : function (wrap,content) {
				wrap.find('.bd').html(content);
			}
		});
	};
	// Tips.prototype = new layer(this.setting);
	// Tips.prototype.constructor = Tips;
	// Tips.prototype.open = function () {
	// 	var tip = this;
	// 	tip.render();
	// 	// console.log(this)
	// 	// this.render();
	// 	// return this;
	// };

	Tips.prototype = {
		'constructor' : Tips,
		'open' : function (callback) {
			this.layer.open(callback);
			return this;
		},
		'close' : function (callback) {
			this.layer.close(callback);
			return this;
		},
		'setStyle' : function (style,callback) {
			this.layer.setStyle(style,callback);
			return this;
		},
		'destroy' : function (callback) {
			this.layer.destroy();
			this = null;
			return this;
		}
	};

	// 自动获取位置的tips方法
	function triggerTips(setting) {
		this.setting = $.extend({},defaultSetting,setting);
		this.init();
	};

	triggerTips.prototype = new Tips(this.setting);
	triggerTips.prototype.constructor = triggerTips;
	triggerTips.prototype.init = function () {
		var triggerTip = this,
			arrow = triggerTip.setting.arrow || 'bottom',
			trigger = $(triggerTip.setting.trigger),
			vertical = parseInt(triggerTip.setting.vertical, 10),
			horizontal = parseInt(triggerTip.setting.horizontal, 10),
			left = trigger.offset().left,
			top = trigger.offset().top;

		triggerTip.trigger = trigger;
		triggerTip.open(function (layerDom) {
			var layer = this,
				fixedTop = top - layerDom.height() - 7 + vertical,
				fixedLeft = left + trigger.width() / 2 - layerDom.width() / 2 + horizontal;
			triggerTip.setStyle({
				'top' : fixedTop,
				'left' : fixedLeft
			});
		});
		return triggerTip;
	};
	// triggerTips.prototype = {
	// 	'constructor' : triggerTips,
	// 	'trigger' : null,
	// 	'init' : function () {
	// 		var triggerTip = this,
	// 			arrow = triggerTip.setting.arrow || 'bottom',
	// 			trigger = $(triggerTip.setting.trigger),
	// 			vertical = parseInt(triggerTip.setting.vertical,10),
	// 			horizontal = parseInt(triggerTip.setting.horizontal,10),
	// 			left = trigger.offset().left,
	// 			top = trigger.offset().top;
			
	// 		triggerTip.trigger = trigger;
	// 		triggerTip.tip = new Tips({
	// 			'left' : left,
	// 			'top' : top,
	// 			'content' : triggerTip.setting.content,
	// 			'open' : function (layerDom) {
	// 				var layer = this,
	// 					fixedTop = top - layerDom.height() - 7 + vertical,
	// 					fixedLeft = left + trigger.width() / 2 - layerDom.width() / 2 + horizontal;

	// 				layer.setStyle({
	// 					'top' : fixedTop,
	// 					'left' : fixedLeft
	// 				});
	// 			}
	// 		});

	// 		triggerTip.tip.open();
	// 	},
	// 	'close' : function () {
	// 		var triggerTip = this;
	// 		triggerTip.tip.close();
	// 	},
	// 	'open' : function () {
	// 		var triggerTip = this;
	// 		triggerTip.tip.open();
	// 	}
	// };

	exports.Tips = Tips;
	exports.triggerTips = triggerTips;

})(window,jQuery);
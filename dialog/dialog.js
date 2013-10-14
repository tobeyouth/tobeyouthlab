/**
 * 弹层
 * 继承自layer.js
 *
 * 2013 10 14
 * by jn
 */
(function (exports,$) {
	// 所有dialog的列表
	var dialogList = [];
	// 模版文件
	var dialogTpl = '';

	// 默认设置
	var defaultSetting = {
		'title' : '',
		'class' : '',
		'hasTitle' : true, // 是否包含头部
		'hasBtn' : true, // 是否包括底部的按钮栏
		'hasMask' : true, // 是否包含遮罩层
		'confirmBtn' : true, // 是否包含确认按钮
		'cancelBtn' : true, // 是否包含取消按钮
		'closeBtn' : true, // 是否包含关闭按钮
		// 回调
		'confirm' : null, // 点击确认的回调
		'concel' : null // 点击取消的回调
	};

	function Dialog(setting) {
		this.setting = $.extend({},defaultSetting,setting);
		var render = template.compile(dialogTpl),
			wrap = render(this.setting);
		this.wrap = $(wrap);
		this.init();
		// dialogList.push(this);
	};

	Dialog.prototype = layer.prototype;
	$.extend(Dialog.prototype,{
		'constructor' : Dialog,
		'init' : function () {
			var dialog = this;

			// 拼装模版和内容
			dialog.assemble(dialog.wrap.find('.bd'),dialog.setting.content) {

			};
		},
		'confirm' : function (callback) {
			var dialog = this;

			if ($.isFunction(callback)) {
				callback.call(dialog);
			} else if ($.isFunction(dialog.setting.confirm)) {
				dialog.setting.confirm.call(dialog);
			};

			dialog.close();

			return dialog;
		},
		'cancel' : function () {
			var dialog = this;

			if ($.isFunction(callback)) {
				callback.call(dialog);
			} else if ($.isFunction(dialog.setting.cancel)) {
				dialog.setting.cancel.call(dialog);
			};

			return dialog;
		}
	});
	


})(window,jQuery);
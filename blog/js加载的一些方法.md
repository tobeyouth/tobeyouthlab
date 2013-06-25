#js加载的方法

##预加载

众所周知，在js加载的过程中，会阻塞住浏览器加载其他资源，并且会阻止浏览器渲染，如果在页面中需要同时加载多个js文件，有时性能很成问题。

在现代浏览器中，可以给script标签设置``async``这个属性，来使得js可以通过异步的方式加载，不阻塞浏览器的渲染和其他文件的渲染，但是这个属性带来的问题就是无法保证**js的顺序执行**。

在ie中可以通过``defer``属性来使得js异步加载，并可以按加载顺序执行。

另外，通过``preload``这个属性，可以使js实现真正的**预加载**,可以在js中动态的写入这个属性，如:
	
	var script = document.createElement('script');
	script.preload = true; // 添加该属性

在js中加了这个属性之后，就可以通过给src赋值的方式，来触发js的**预加载**，但仅仅是加载，并不会执行该js，执行该js可以通过，``onpreload``这个回调来将js插入到dom中执行的，如：
	
	script.src = "xxx.js";
	script.onpreload = function () {
		document.head.appendChild(script);
	};

##其他加载方法

- 通过xhr方法加载，使用的时候插入到dom中
- 通过创建``script``标签，但是``type``属性写成非``text/javascript``，在需要使用的时候再将其改成``text/javascript``
- 通过创建``script``标签，在前一个``onload``的时候再加载下一个，无法实现并行加载。
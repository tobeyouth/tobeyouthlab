#coffeeScript学习

##函数写法
- 自执行函数
	
		fun = (code) // 关键在于括号
- 普通函数

		fun =-> code // 关键在于 ->

- 带入参数

		fun = (param) -> code
		fun = (param,param2=defaultParam) -> code  // 带入默认参数


##逻辑控制符

### if else
普通判断:
	/*
	* coffee:
	*/
	a = b if c = 0
	
	/*
	* complied:
	*/  	
	if (c = 0) {
    	a = b;
  	}

带有`else`的情况：
	/*
	* coffee:
	*/
	if a
		console.log('a is true')
	else
		console.log('a is false')
	
	/*
	* compiled:
	*/
	if (a) {
    	console.log('a is true');
  	} else {
    	console.log('a is false');
  	}

三元运算符：
	/*
	* coffee:
	*/
	data = if a then b else c // 三元运算符
	
	/*
	* compiled
	*/
	

##循环：

普通循环：
	
	/*
	* coffee 
	*/
	var arr = [1,2,3,4,5,6]
	num for num in arr
	
	/*
	* compiled
	*/
	var arr, num, _i, _len;
  	arr = [1, 2, 3, 4, 5, 6];
  	for (_i = 0, _len = arr.length; _i < _len;_i++) {
    	num = arr[_i];
    	num;
  	}

对循环元素进行操作的循环：

	/*
	* coffee
	*/
	arr = [1,2,3,4,5,6]
	fun i,i+1 for i in arr
	
	/*
	* compiled
	*/
	arr = [1, 2, 3, 4, 5, 6];
  	for (_i = 0, _len = arr.length; _i < _len; _i++) {
    	i = arr[_i];
    	fun(i, i + 1);
  	}


`for in` 表示的是 `for () {}` 这样的代码，例如：

	arr = [1,2,3,4,5,6]
	add = (num+1 for num in arr)
	
	console.lot(add);
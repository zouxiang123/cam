function Xtt(dom,atTime) {
	this.body = document.getElementsByTagName('body')[0];
	if (!atTime) {
		var xtt = new Xtt(dom,true);
	}else{
		this[0] = Elem(dom);
	}
	return xtt;
}

function Elem(dom) {
//获取目标elem
	if (dom) {
		var elem;
		var selector = dom.charAt(0);
		var name = dom.slice(1);
		if (selector == '.') {
			elem = document.getElementsByClassName(name);
		} else if (selector == '#') {
			elem = document.getElementById(name);
		} else {
			name = dom.slice(0);
			elem = document.getElementsByTagName(name);
		}
		return elem;
	}
}
(function() {
	"use strict";

	function Class($class,$elem,$conditions){
	//css删除与添加
		var $arr = [];
		var $this;
		if($elem.length){
			$arr = $elem;
		}else{
			$arr.push($elem)
		}
		for(var i = 0;i<$arr.length;i++){
			var $attr = $arr[i].getAttribute('class');
			$attr == null ? $attr = '' : $attr = $attr;
			$this = $attr.split(' ');
			if($this.indexOf($class) < 0 && $conditions == 'AddClass'){
				$this.push($class);
			}else if($this.indexOf($class) >= 0 && $conditions == 'RemoveClass'){
				$this.splice($this.indexOf($class),1);
			}else if($this.indexOf($class) > 0 && $conditions == 'HasClass'){
				return $this[$this.indexOf($class)];
			}
			$arr[i].setAttribute('class',$this.join(' '))
		}
	}
	function Toggle($elem,$fade,$toggle){
	//show与hide
		var $this = $elem;
		var $arr = [];
		if($this && $this.length > 0){
			$arr = $this;
		}else{
			$arr.push($this);
		}
		for(var i = 0;i<$arr.length;i++){
			if($toggle == 'show'){
				if($fade){
					$arr[i].style.opacity = 0;
					Xtt('#' + $arr[i].id).RemoveClass('fade-hide');
					Xtt('#' + $arr[i].id).AddClass('fade-show');
				}
				$arr[i].style.display = 'block';
			}else if($toggle == 'hide'){
				if($fade){
					$arr[i].style.opacity = 1;
					Xtt('#' + $arr[i].id).RemoveClass('fade-show');
					Xtt('#' + $arr[i].id).AddClass('fade-hide');
				}
				$arr[i].style.display = 'none';
			}

		}
	}
	function CurrentElement($this,$elem,$conditions,$special){
	//追加元素
		var $body;
		var $parent;
		var $index = 0;
		if($special == 'SELECT'){
			$body = $this;
		}else{
			$this[0].length > 0 ? $body =  $this[0][0] : $body = $this[0];
		}
	    $parent = $body.parentNode;
	    for(var i = 0;i<$parent.childNodes.length;i++){
	    	if($parent.childNodes[i] == $body){
	    		if($conditions == 'after' ){
	    			$index = 1;
	    		}
	    		$parent.insertBefore($elem,$parent.childNodes[i + $index]);
	    		return false;
	    	}
	    }
	}
	function CreateElement($elem,$type){
	//创建元素('div',{class:'u-select-xtt',id:'selectId'})
		var $div = document.createElement($elem);
		for(var item in $type){
			$div.setAttribute(item, $type[item]);
		}
		return $div;
	}
	document.body.addEventListener('click',function(e){
	//全局点击事件
		var $el = event.target;
		var $attr = $el.getAttribute('xtt-close');
		if($attr){
			Xtt($attr).Dialog(false);
		}
	},false);
	Xtt.prototype = {
    //选择器方法继承
		Dialog: function($switch, $size, $call) {  
		//对话框(true/false,{width,height},function(){})
			var $this = this[0];
			if($size){
				if($size.width == '100%' && $size.height == '100%'){
					$this.style.width = $size.width;
					$this.style.height = $size.height;
					$this.style.left = 0 + 'px';
					$this.style.top = 0 + 'px';
					$this.style.marginLeft = 0 + 'px';
					$this.style.marginTop = 0 + 'px';
				}else{
					$this.style.width = $size.width + 'px';
					$this.style.height = $size.height + 'px';
					$this.style.marginLeft = -$size.width/2 + 'px';
					$this.style.marginTop = -$size.height/2 + 'px';
				}
			}
			if($switch){
				Xtt('#'+$this.id).Mask(true);
				$this.style.display= 'block';
				Xtt('body').AddClass('mask');
			}else{
				Xtt('#'+$this.id).Mask(false);
				$this.style.display= 'none';
				Xtt('body').RemoveClass('mask');
			}
			if($call){
				$call($switch, $size);
			}
		},
		Mask: function($switch){
		//遮罩(true/false)
		    var $body;
		    this[0].length > 0 ? $body =  this[0][0] : $body = this[0];
			if($switch){
				var $div = document.createElement('div');
				$div.setAttribute('class','xtt-mask');
				Xtt('#'+$body.id).addBefore($div);
				Xtt('.xtt-mask').AddClass('show');
			}else{
				$body.parentNode.removeChild($body.previousSibling);
			}
		},
		SwitchBar: function($bar,$call){
		//切换diolog内容([{id:'',active:true}],function(event){})
			for(var i = 0;i<$bar.length;i++){
				Xtt('#'+$bar[i].id).AddClass('switch-bar');
				Xtt('.'+$bar[i].id).RemoveClass('active');
				if($bar[i].active){
					Xtt('.'+$bar[i].id).AddClass('active');
					Xtt('#'+$bar[i].id).Show(true);
				}
			}
			this[0].onclick = function(e){
				var $barId = event.target.getAttribute('xtt-bar');
				Xtt('.switch-bar').Hide(true);
				Xtt('#' + $barId).Show(true);
				for(var k = 0;k<$bar.length;k++){
					Xtt('.' + $bar[k].id).RemoveClass('active');
				}
				Xtt('.' + $barId).AddClass('active');
				if($call){
					$call(Xtt('.' + $barId)[0][0])
				}
			}
		},
		Prompt :function($objct,$permanen){
		//状态提示框({text:'内容',style:{自定义样式},time:'时间',call:function(dom){回调函数,返回dom}},permanen:false/true(是否永久显示,默认false))
			var $this = this[0];
			var $time = $objct.time || 3000;
			var $call = $objct.call || '';
			var $prompt = function(){
				var $clearTime;
				var $dom = document.getElementsByClassName('u-prompt');
				var $div = document.createElement("div");
				var $child = $this[0].childNodes;
				$div.setAttribute("class", 'u-prompt');
				$div.innerHTML = $objct.text;
				if($objct.style){
					for(var item in $objct.style){
						$div.style[item] = $objct.style[item];
					}
				}
				if($dom.length > 0){
					var $after = $dom[$dom.length - 1];
					$div.style.top = $after.offsetTop - $after.offsetHeight - 5 + 'px'
				}
				$this[0].appendChild($div);
				if(!$permanen){
					$clearTime = setTimeout(function(){
						$this[0].removeChild($div);
						clearTimeout($clearTime);
					},$time);
				}
				if($call != ""){
					$call($div);
				}
			}
			new $prompt()
		},
		Loader: function($switch,$call){
		//加载load(true/false)
			var numberOf = document.getElementsByClassName('u-loader');
			var $this = this[0][0];
			var $div = document.createElement("div");
			$div.setAttribute("class", 'u-loader icon-load');
			$div.setAttribute("id", 'loaderId');
			if($switch){
				if(numberOf.length == 0){
					$this.appendChild($div)
					Xtt('.u-loader').Mask(true);
				}
			}else{
				if(numberOf.length != 0){
					Xtt('.u-loader').Mask(false);
					$this.removeChild(Xtt('.u-loader')[0][0]);
					if($call){
						$call();
					}
				}
			}
		},
		Select: function($modify){
		//选择下拉框(true/false)
			var $this = this[0];
			var $select = function(dom){
				var $frame = CreateElement('div',{class:'u-select-xtt'});
				var $input = CreateElement('input',{type:'text'});
				var $image = CreateElement('i',{class:'icon-arrow-bottom'});
				var $ul = CreateElement('ul',{class:'select-hide'});
				var $childLI = $ul.childNodes;
				var $Selected = function(){
				//选中处理
					for(var k = 0;k<dom.length;k++){
						if(dom[k].selected){
							var $html = $childLI[k].innerHTML
							$childLI[k].setAttribute('class','active');
							$input.value = $html.slice(0,$html.indexOf("<span>"))
						}
					}
				}
				var $Search = function($val){
				//搜索处理
					for(var i = 0;i< $childLI.length;i++){
						var $merge = $childLI[i].innerText + $childLI[i].childNodes[1].innerText;
						$childLI[i].style.display = 'none';
						if($merge.indexOf($val) > -1){
							$childLI[i].style.display = 'block';
						}
					}
				}
				CurrentElement(dom,$frame,'after','SELECT');
				$frame.appendChild($input);
				$frame.appendChild($ul);
				$frame.appendChild($image);
				!$modify ? $input.setAttribute('readonly', true) : '';
				for(var i = 0 ;i<dom.length;i++){
					var $li = CreateElement('li');
					var $span = CreateElement('span');
					$li.innerHTML = dom[i].innerHTML;
					$span.innerHTML = dom[i].getAttribute('xtt-search');
					$li.appendChild($span);
					$ul.appendChild($li);
					$li.onmousedown = function(e){
						for(var j = 0; j < $childLI.length;j++){
							$childLI[j].setAttribute('class','');
							if($childLI[j] == this){
								dom[j].selected = true;
							}
						}
					}
				}
				$input.onfocus = function(){
					$ul.style.display = 'block';
					$ul.setAttribute('class','show');
				}
				$input.onblur = function(){
					$ul.setAttribute('class','hide');
					var $clearTime = setTimeout(function(){
						$ul.style.display = 'none';
						clearTimeout($clearTime);	
					},150)
					$Selected();
				}
				$input.oninput = function(){
					$Search(this.value);
				}
				$Selected();
				$ul.style.display = "none";
				dom.style.display = "none";
			}
			if($this[0].tagName == 'SELECT'){
			//处理select特殊性质
				for(var i = 0;i < $this.length;i++){
					new $select($this[i]);
				}
			}else{
				new $select($this);
			}
		},
		RemoveClass: function($class){
		//删除class(class)
			Class($class,this[0],'RemoveClass');
		},
		AddClass: function($class){
		//添加class(class)
			Class($class,this[0],'AddClass');
		},
		HasClass: function($class){
		//查找指定class(class)
			return Class($class,this[0],'HasClass');
		},
		addBefore: function($elem){
		//在元素前面追加元素(elem)
			CurrentElement(this,$elem,'before');
		},
		addAfter: function($elem){
		//在元素前面追加元素(elem)
			CurrentElement(this,$elem,'after');
		},
		Show: function($fade){
		//显示(false/true)
			Toggle(this[0],$fade,'show');
		},
		Hide: function($fade){
		//隐藏(false/true)
			Toggle(this[0],$fade,'hide');
		}
	}
	Date.prototype.Format = function($style,$symbol){
	//转换日期格式(格式,分割符)
		var repair = function($nbr){
			return $nbr < 10 ? $nbr = '0' + $nbr : $nbr = $nbr;
		}
		var $year = this.getFullYear();
		var $month = repair(this.getMonth() + 1);
		var $date = repair(this.getDate());
		var $hours = repair(this.getHours());
		var $minutes = repair(this.getMinutes());
		var $seconds = repair(this.getSeconds());
		// var $day = this.getDay();
		var $secant = $symbol || '-';
		var $format;
		if($style == 'date'){
			$format = $year + '' + $secant + '' + $month+ '' + $secant + '' + $date
		}else if($style == 'time'){
			$format = $hours + ':' + $minutes + ':' + $seconds
		}else{
			$format = $year + '' + $secant + '' + $month+ '' + $secant + '' + $date + ' ' + $hours + ':' + $minutes + ':' + $seconds
		}
		return $format;
	}
	String.prototype.AddressParams = function($param){
	//获取地址参数(字符串/数组)
		var $params;
		if(typeof $param == 'string'){
			$params = this.match(new RegExp($param + "=([^\&]+)", "i"))[1];
		}else{
			$params = {};
			for(var i = 0;i<$param.length;i++){
				 $params[$param[i]] = this.match(new RegExp($param[i] + "=([^\&]+)", "i"))[1];
			}
		}
		return $params;
	}
})()
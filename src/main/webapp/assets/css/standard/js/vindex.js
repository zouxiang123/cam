function empty(name){
	if(name.replace(/\s+/g, "") == ""){
		return true
	}
}

function chiid(name,css){
	let k =0;
	for(let i = 0;i<name.childNodes.length;i++){
    	if(name.childNodes[i].innerHTML){
            if(name.childNodes[i].getAttribute("class") == css){
               k++;
            }
    	}
    }
    return k;
}

function verification(obj){
	if(empty(obj.titleval)){promptbox("标题不能为空","promptbox-language");return true;}
	if(empty(obj.hospital)){promptbox("来源不能为空","promptbox-language");return true;}
	if(empty(obj.coverbase)){promptbox("封面不能为空","promptbox-language");return true;}
	if(obj.way == "image" && obj.images.length == 0){promptbox("上传图片不能为空","promptbox-language");return true;}
	if(obj.way == "text" && empty(obj.textcontent)){promptbox("上传文本不能为空","promptbox-language");return true;}
	if(obj.way == "video" && empty(obj.videopath)){promptbox("上传视屏不能为空","promptbox-language");return true;}
}

function promptbox(title,css){
	if(this.setClear){clearTimeout(this.setClear)}
	let body = document.getElementsByTagName("body")[0];
	if(chiid(body,css) == 0){
	    let div = document.createElement('div');
	    div.setAttribute("class",css);
	    div.innerHTML = title;
	    body.appendChild(div);
	}
    this.setClear = setTimeout(function(){
        body.removeChild(document.querySelector("."+css ));
    },3000)
}

function load(state,call){
	let body = document.getElementsByTagName("body")[0];
	if(state && chiid(body,"u-pageLoad") == 0){
		let div = document.createElement('div');
	    let div2 = document.createElement('div');
	    let i = document.createElement('i');
	    let p = document.createElement('p');
	    div.setAttribute("class","u-pageLoad");
	    i.setAttribute("class","icon-load");
	    p.innerHTML = "正在加载中....";
	    div.appendChild(div2);
	    div2.appendChild(i);
	    div2.appendChild(p);
	    body.appendChild(div);
	}else if(!state) {
		body.removeChild(document.querySelector(".u-pageLoad"));
	}
    
}
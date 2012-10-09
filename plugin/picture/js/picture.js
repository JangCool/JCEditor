	function sizeCheck(el){
		
		var width = document.getElementById("picture_width");
		var height = document.getElementById("picture_height");
		
		
		if (el.checked) {
			width.disabled=false;
			height.disabled=false;
		}else{
			width.disabled=true;
			height.disabled=true;	
			width.value="0";
			height.value="0";
		}
	}
	
	function textNumberValidate(el){
		
		var re = /^[0-9]*$/ ;
		if (!re.test(el.value)) {			
			el.value="";
			window.alert("숫자만 입력 가능 합니다");
			return;
		}		
	}
	
	function preview(){
			
		if (urlValidation()) {
			var previewImgEl = document.getElementById("preview_img");
			previewImgEl.src = document.getElementById("pt_url").value;	
		}

	}
	
	function urlValidation(){
		var urlRe =/^(https?):\/\/([a-z0-9-]+\.)+([a-z0-9]{2,4}.)*$/;
		var fileRe =/\.(bmp|gif|png|jpg|jpeg)$/i;
		
		if (!fileRe.test(document.getElementById("pt_url").value)) {
			window.alert("파일 확장자가 올바르지 않습니다. bmp,gif,png,jpg,jpeg 만 지원합니다. ");
			return false;
		}else if(!urlRe.test(document.getElementById("pt_url").value)){
			window.alert("URL 형식이 올바르지 않습니다. ");
			return false;
		}else{		
			return true;
		}
	}
	
	function radioValue(obj){
		var value="";
		
		for ( var i = 0; i < obj.length; i++) {
			obj[i].checked
			
			if (obj[i].checked) {
				value = obj[i].value;
			}			
		}
		
		return value;
	}
	
	/*
	* 확인 버튼을 눌렀을 때 에디터에게 설정 값들을 반환 한다.
	*/
		
	function editorInsert(){
		
		var frm = document.getElementById("jce_plugin_popup");
		var direction = radioValue(frm.pt_align);
		var border = frm.pt_thick_select.value;
		var width = frm.picture_width.value;
		var height = frm.picture_height.value;
		var url = frm.pt_url.value;
		
		return {
			direction : direction,
			border : border,
			width : width,
			height : height,
			url : url
		}		
	}
	
	/**
	*
	* 에디터에서 초기화 시킬 수 있게 한다.
	*
	*/
	
	function pluginReset(){
	
		var obj = document.getElementById("jce_plugin_popup");
		document.getElementById("preview_img").src="images/preview.gif";
		obj.reset();	
	}
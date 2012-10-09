	function sizeCheck(el){
		
		var width = document.getElementById("fl_width");
		var height = document.getElementById("fl_height");
		
		
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
			var previewEl = document.getElementById("preview");
			var urlValue = document.getElementById("fl_url").value;
			
			var preview ="";
			preview +="<object classid='clsid:d27cdb6e-ae6d-11cf-96b8-444553540000' codebase='http://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,115,0' width='300' height='200' >";
			preview +="<param name='movie' value='"+urlValue+"'  />																			";
			preview +="<param name='wmode' value='transparent'>																																								";
			preview +="<!--[if !IE]> <-->																																																		";
			preview +="<object data='"+urlValue+"' type='application/x-shockwave-flash' width='300' height=200' >			";
			preview +=" <!--> <![endif]-->																																  ";
			preview +="     <p> 현재 Browser Version 에서는 Flash 랜더링을 하지 않습니다. 상단의 플래시 메뉴를 이용하여 주세요</p>  ";
			preview +=" <!--[if !IE]> <-->  									";
			preview +="  </object>											";
			preview +="  <!--> <![endif]-->									";
			preview +="</object>												";

			
			
			previewEl.innerHTML=preview;
		}

	}
	
	function urlValidation(){
		var urlRe =/^(https?):\/\/([a-z0-9-]+\.)+([a-z0-9]{2,4}.)*$/;
		var fileRe =/\.(swf)$/i;
		
		if (!fileRe.test(document.getElementById("fl_url").value)) {
			window.alert("파일 확장자가 올바르지 않습니다. swf 만 지원합니다. ");
			return false;
		}else if(!urlRe.test(document.getElementById("fl_url").value)){
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
		
		if (!urlValidation()) {		
			return;
		}
		
		var frm = document.getElementById("jce_plugin_popup");
		var mode = radioValue(frm.mode);
		var direction = radioValue(frm.pt_align);
		var border = frm.fl_thick_select.value;
		var width = frm.fl_width.value;
		var height = frm.fl_height.value;
		var url = frm.fl_url.value;
		
		
		var objectHtml ="";
		
		if (mode == "url") {		
		
			objectHtml +="<object classid='clsid:d27cdb6e-ae6d-11cf-96b8-444553540000' codebase='http://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,115,0' width='"+width+"' height='"+height+"' style='";
		
			if (width > 0) {
				objectHtml+=" width : "+width+";";
			}
			
			if (height > 0) {
				objectHtml+=" height : "+height+";";
			}
			
			if (border > 0) {
				objectHtml+=" border : "+border+"px solid #ccc;";
			}
			
			objectHtml +="'>";														
			objectHtml +="<param name='movie' value='"+url+"'  />";
			objectHtml +="<param name='wmode' value='transparent'>";
			objectHtml +="<!--[if !IE]> <-->	";
			objectHtml +="<object data='"+url+"' type='application/x-shockwave-flash' width='300' height=200' style='";			
		
			if (width > 0) {
				objectHtml+=" width : "+width+";";
			}
			
			if (height > 0) {
				objectHtml+=" height : "+height+";";
			}
			
			if (border > 0) {
				objectHtml+=" border : "+border+"px solid #ccc;";
			}
			
			
			objectHtml +="'>																																  ";
			objectHtml +=" <!--> <![endif]-->																																  ";
			objectHtml +="     <p> 현재 Browser Version 에서는 Flash 랜더링을 하지 않습니다. 상단의 플래시 메뉴를 이용하여 주세요</p>  ";
			objectHtml +=" <!--[if !IE]> <-->  									";
			objectHtml +="  </object>											";
			objectHtml +="  <!--> <![endif]-->									";
			objectHtml +="</object>												";
		}else{
			
			objectHtml = document.getElementById("fl_textarea").value;			
		}
		return objectHtml;	
	}
	
	/**
	*
	* 에디터에서 초기화 시킬 수 있게 한다.
	*
	*/
	
	function pluginReset(){
	

		var obj = document.getElementById("jce_plugin_popup");
		var previewEl = document.getElementById("preview").innerHTML="<img id=\"preview_img\" src=\"images/preview.gif\"  class=\"preview-img\"></img>";
		obj.reset();	
		

	}
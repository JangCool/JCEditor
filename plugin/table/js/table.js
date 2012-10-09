
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
	
	/***
	*
	* 테이블 삽입 정보.
	*
	*/
	
	
	var tableMakeInfo = {	
		rowNum : 5,
		cellNum : 5,
		cellpadding : 0,
		cellspacing : 0,
		bordersize : 1,
		colorType : "bgcolor",
		bgcolor : "#white",
		bordercolor : "#ccc",
		align : "none"
	}
	
	
	function setColor(){
		var frm = document.getElementById("jce_plugin_popup");			
		tableMakeInfo.colorType = radioValue(frm.tb_colorType);		
		
		if (tableMakeInfo.colorType=="bgcolor") {
			tableMakeInfo.bgcolor = "#"+radioValue(frm.colorChoice);
		}else{
			tableMakeInfo.bordercolor = "#"+radioValue(frm.colorChoice);		
		}
		
		makeTable()
	}
	function setBorder(el){
		if (el.value > 5) {
			tableMakeInfo.bordersize = 5;
			el.value = "5";
			makeTable();
			window.alert("테두리 두께를 5 이상 적용시킬 수 없습니다. ");			
			return;
		}else{
	
			tableMakeInfo.bordersize = el.value;
			makeTable();
		}
	}	
	function setRow(el){

		if (el.value > 30) {
			tableMakeInfo.rowNum = 30;
			el.value = "30";
			makeTable();
			window.alert("행을 30개 이상 만들 수 없습니다. ");			
			return;
		}else{
	
			tableMakeInfo.rowNum = el.value;
			makeTable();
		}
	}
	
	function setCell(el){
		if (el.value > 30) {
			tableMakeInfo.cellNum = 30;
			el.value = "30";
			makeTable();
			window.alert("열을 30개 이상 만들 수 없습니다. ");
			return;
		}else{
	
			tableMakeInfo.cellNum = el.value;
			makeTable();
		}
	}	
	
	function setCellPadding(el){
		if (el.value > 30) {
			tableMakeInfo.cellpadding = 30;
			el.value = "30";
			makeTable();
			window.alert("패딩을 30 이상 적용시킬 수 없습니다. ");
			return;
		}else{
			tableMakeInfo.cellpadding = el.value;
			makeTable();
		}
	}	
		
	function setCellSpacing(el){
		if (el.value > 30) {
			tableMakeInfo.cellspacing = 30;
			el.value = "30";
			makeTable();
			window.alert("간격을 30 이상 적용시킬 수 없습니다. ");
			return;
		}else{

			tableMakeInfo.cellspacing = el.value;
			makeTable();
		}
	}
		
	function makeTable(type){
		
		var rowNum=tableMakeInfo.rowNum;
		var cellNum =tableMakeInfo.cellNum;
		var cellpadding=tableMakeInfo.cellpadding;
		var cellspacing=tableMakeInfo.cellspacing;
		var bordersize=tableMakeInfo.bordersize;
		var colorType=tableMakeInfo.colorType;
		var bgcolor=tableMakeInfo.bgcolor;
		var bordercolor=tableMakeInfo.bordercolor;
		var align=tableMakeInfo.align;
		var tableHtml = "";
		tableHtml += "<table width=\"100%\" ";
		tableHtml += " cellpadding=\""+cellpadding+"\" ";
		tableHtml += " cellspacing=\""+cellspacing+"\" ";
	
		if (align !="none") {
			tableHtml += " align=\""+align+"\" ";		
		}
	
		tableHtml += " style=\"";
		
		tableHtml += " border-collapse: collapse ;background-color:"+bgcolor+";";
		tableHtml += "\">";
		
		for ( var i = 0; i < tableMakeInfo.rowNum; i++) {
			tableHtml += "<tr>";
			
			for ( var j = 0; j < tableMakeInfo.cellNum;j++) {
				if (type==true) {
					tableHtml += "<td style=\"border:"+bordersize+"px solid "+bordercolor+";height:20px; \"></td>";			
				}else{
					tableHtml += "<td style=\"border:"+bordersize+"px solid "+bordercolor+" \"></td>";		
				}
			}			
			tableHtml += "</tr>";
		}
		
		
		tableHtml += "</table>";
		
		document.getElementById("preview").innerHTML = tableHtml;
	}
	
	
	/*
	* 확인 버튼을 눌렀을 때 에디터에게 설정 값들을 반환 한다.
	*/
		
	function editorInsert(){
		makeTable(true);
		var tableHtml = document.getElementById("preview").innerHTML;
		
		return tableHtml;
	}
	

	/**
	*
	* 에디터에서 초기화 시킬 수 있게 한다.
	*
	*/
	
	function pluginReset(){
	
		var obj = document.getElementById("jce_plugin_popup");
		tableMakeInfo.rowNum = 5,
		tableMakeInfo.cellNum = 5,
		tableMakeInfo.cellpadding = 0,
		tableMakeInfo.cellspacing = 0,
		tableMakeInfo.bordersize = 1,
		tableMakeInfo.colorType = "bgcolor",
		tableMakeInfo.bgcolor = "white",
		tableMakeInfo.bordercolor = "#ccc",
		tableMakeInfo.align = "none";
		obj.reset();	
		makeTable();
	}
		
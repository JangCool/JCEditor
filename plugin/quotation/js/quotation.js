
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
	
	
	var quotationInfo = {
			
			bgColor : null,
			borderColor : "888",
			border :"2",
			borderPos :"BORDER-LEFT",
			borderType :"solid"			
	}
	
	
	
	function setColor(){
		var frm = document.getElementById("jce_plugin_popup");	
		var colorType = radioValue(frm.colorType);
		var colorChoice =radioValue(frm.colorChoice);

		if(colorType =="bgcolor")		{
			quotationInfo.bgColor = "background-color:#"+colorChoice;
		}else{
			quotationInfo.borderColor  = colorChoice;
		}
		
		blcokquote();
	}
	
	function setBorder(){		
		var frm = document.getElementById("jce_plugin_popup");
		quotationInfo.border = radioValue(frm.borderType);	
		blcokquote();
	}
	
	function setStyle(){
	
		var frm = document.getElementById("jce_plugin_popup");
		var quotoType = radioValue(frm.quotoType);
		switch (quotoType) {
		case "q1":			
			quotationInfo.borderPos = "BORDER-LEFT";
			quotationInfo.borderType = "solid";
			quotationInfo.border = "3";		
			quotationInfo.bgColor = null;

			break;	
		case "q2":			
			quotationInfo.borderPos = "BORDER";
			quotationInfo.bgColor = null;
			quotationInfo.border = "0";		
			quotationInfo.borderType = "solid";

			break;	
		case "q3":			
			quotationInfo.borderPos = "BORDER";
			quotationInfo.borderType = "solid";
			quotationInfo.bgColor = null;
			quotationInfo.borderColor = "aaa";
			quotationInfo.border = "1";		

			break;	
		case "q4":			
			quotationInfo.borderPos = "BORDER";
			quotationInfo.borderType = "solid";
			quotationInfo.border = "2";
			quotationInfo.borderColor = "666";
			quotationInfo.bgColor = null;

			break;	
		case "q5":			
			quotationInfo.borderPos = "BORDER";
			quotationInfo.borderType = "dashed";
			quotationInfo.bgColor = null;
			quotationInfo.borderColor = "666";
			quotationInfo.border = "1";		

			break;
		case "q6":			
			quotationInfo.borderPos = "BORDER";
			quotationInfo.borderType = "dashed";
			quotationInfo.bgColor = "background-color:#f9f9f9";
			quotationInfo.borderColor = "666";
			quotationInfo.border = "1";		

			break;	
		default:			
			quotationInfo.borderPos = "BORDER";
			break;
		}

		blcokquote();
	}
	
	function blcokquote(type){		
		
		var frm = document.getElementById("jce_plugin_popup");
		
		var qutation2Img = "/JCEditor/plugin/quotation/images/quote_bg2.gif";
				
		var blockquote="<BLOCKQUOTE style=\"";

		if ((quotationInfo.bgColor!=null)) {
			blockquote += quotationInfo.bgColor;
		}		


		blockquote +=";"+quotationInfo.borderPos+": #"+quotationInfo.borderColor+" "+quotationInfo.border+"px "+quotationInfo.borderType;		
		if (type =="editor") {
		
			if (radioValue(frm.quotoType) =="q2") {
				blockquote += ";background-image: url("+qutation2Img+");background-repeat: no-repeat;background-position: top left;HEIGHT:auto;padding-left:20px;margin-top: 5px;margin-left:20px;padding-top: 5px;font: 10pt 돋움;\"><p>&nbsp;</p></BLOCKQUOTE>";		
			}else{
				blockquote +="; HEIGHT:auto;MARGIN-TOP: 10px; PADDING-LEFT: 15px; FONT: 10pt 돋움; MARGIN-BOTTOM: 10px; MARGIN-LEFT: 35px\">&nbsp;</BLOCKQUOTE>	";			
			}
			return blockquote;
		}else{
		
			if (radioValue(frm.quotoType) =="q2") {
				blockquote += ";HEIGHT:13px;WIDTH:90px;background-image: url("+qutation2Img+") ;background-repeat: no-repeat;background-position: top left;width:100px;margin-top: 5px;margin-left:20px;padding-left:20px;margin: 5px;padding-top: 5px;font: 10pt 돋움;\"><p>&nbsp;</p></BLOCKQUOTE>";		
			}else{
				blockquote +="; HEIGHT:13px;WIDTH:90px;MARGIN-TOP: 10px; PADDING-LEFT: 15px; FONT: 10pt 돋움; MARGIN-BOTTOM: 10px;\"></BLOCKQUOTE>	";			
			}		
			document.getElementById("preview").innerHTML=blockquote;
		}				

		
	}




	/*
	* 확인 버튼을 눌렀을 때 에디터에게  값들을 반환 한다.
	*/
		
	function editorInsert(){
		
		var qutationHtml = blcokquote("editor");		
		return {
			html : qutationHtml
		};		
	}
	
	/**
	*
	* 에디터에서 초기화 시킬 수 있게 한다.
	*
	*/
	
	function pluginReset(){
	
		var obj = document.getElementById("jce_plugin_popup");
		obj.reset();	
		
		quotationInfo.bgColor = null;
		quotationInfo.borderColor = "888";
		quotationInfo.border ="2";
		quotationInfo.borderPos ="BORDER-LEFT";
		quotationInfo.borderType ="solid";
		setStyle();
	}

	
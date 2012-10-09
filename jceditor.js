/**
 * @fileoverview 기존의 오픈소스 웹 에디터들의 업데이트 미지원과 유료화 진행으로 인하여 
 * 보다 가볍고 필요한 기능 위주의 오픈 소스 에디터를 만들어 보고자 한다.
 *
 * @author Jang Jin Chul
 * @version 1.0
 */


/**
 * 에디터 모듈을 로드 한다.
 * 
 */


/**
 * JCEDITOR 에서 이용 할  함수를 관리한다.
 * 
 */

var Browser = (function(){
	
	var returnObj = {};
    returnObj.type ="";
    returnObj.version= "";

	var browerAgent = navigator.userAgent;
	
	var browerType = ""; // 브라우져 종류
	// 브라우져 종류 설정.
	if (browerAgent.indexOf("Chrome") != -1) {
	    browerType = "Chrome";
	} else if (browerAgent.indexOf("Firefox") != -1) {
	    browerType = "Firefox";
	} else if (browerAgent.indexOf("Safari") != -1) {
	    browerType = "Safari";
	} else if (browerAgent.indexOf("MSIE") != -1) {
	    browerType = "MSIE";
	}else{
	    browerType = "Opera";       
	}
	
	returnObj.type = browerType;        
        
	var rv = -1; // Return value assumes failure.      
	var ua = navigator.userAgent;
	var re = null;
	
	if (browerType == "MSIE") {
	    re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
	} else {
	    re = new RegExp(browerType + "/([0-9]{1,}[\.0-9]{0,})");
	}
	if (re.exec(ua) != null) {
	    rv = parseFloat(RegExp.$1);
	}
	
	returnObj.version = rv;
	
	return returnObj;

        
})();


var $J = function (queryId, select) {

	
    if (queryId.indexOf("#") != -1 && queryId.charAt(0) == "#") {

        queryId = queryId.substr(1);

        switch (select) {

        case "wrap":
            queryId = queryId + "-jceditor-wrap-div";
            break;
        case "cTable":
            queryId = queryId + "-jceditor-container-table";
            break;
        case "dragBlock":
            queryId = queryId + "-jceditor-dragBlock-div";
            break;
        case "dragResize":
            queryId = queryId + "-jceditor-dragResize-div";
            break;
        case "ifrm":
            queryId = queryId + "-jceditor-edit-iframe";
            return {
                iframe: document.getElementById(queryId),

                contentWindow: function () {
                    return document.getElementById(queryId).contentWindow;
                },

                doc: function () {
                    return document.getElementById(queryId).contentWindow.document;
                },

                body: function () {
                    return document.getElementById(queryId).contentWindow.document.getElementsByTagName("body");
                }
            };
            break;

        default:
            queryId;
            break;
        }
        return document.getElementById(queryId);

    } else if (queryId.indexOf("#") == -1) {
        return document.getElementsByTagName(queryId);
    }

};

var addEvent = function (editBox, eventName, func) {
    if (editBox.attachEvent) {
        return editBox.attachEvent(eventName, func);
    } else if (window.addEventListener) {
        return editBox.addEventListener(eventName.replace(/^on/i, ""), func, false);
    }
};

/**
 * 에디터 창을 리사이징 한다.
 * 
 * @param textAreaId
 * @param ifrmId
 * @returns
 */
var DragResize = function (textAreaId, ifrmId) {

    var startPosX;
    var startPosY;
    var reSizeStart;
    var diffPosX = 0;
    var diffPosY = 0;
    var self = this;
    var textAreaId = textAreaId;
    var ifrmId = ifrmId;

    this.dragResize_mouse_down = function (event) {

        event = event ? event : window.event;
        event.cancelBubble = true;

        startPosX = event.clientX;
        startPosY = event.clientY;

        reSizeStart = true;

        //dragResize를 하기 위해서 iframe 위에 block 레이러를 덧씌워준다. 그렇게 하지 않으면 좌표가 사라져 drag가 되지 않음				
        $J("#" + textAreaId, "dragBlock").style.display = "block";

        addEvent(window.document, "onmousemove", self.dragResize_mouse_move);
        addEvent(window.document, "onmouseup", self.dragResize_mouse_up);

    };

   this.dragResize_mouse_move = function (event) {

        event = event ? event : window.event;

        var editBox_container_table = $J("#" + textAreaId, "cTable");
        var editBox_iframe = $J("#" + ifrmId);
        var editBox_textArea = $J("#" + textAreaId);
		var doc = editBox_container_table.getElementsByTagName("tr")[0];
		var contentHeight = 0;
		if(doc.offsetHeight != 0){
			contentHeight = doc.offsetHeight; // 현재 지정된 객체의 padding값을 포함한 높이.(눈에보이는 높이 그대로..
		}
        if (editBox_container_table && reSizeStart) {

            var movePosX = parseInt(editBox_container_table.style.width.substr(0, editBox_container_table.style.width.indexOf("px"))) + event.clientX - startPosX;
            var movePosY = parseInt(editBox_container_table.style.height.substr(0, editBox_container_table.style.height.indexOf("px"))) + event.clientY - startPosY;
      //      console.log(contentoffsetHeight);
            diffPosX = movePosX;
            diffPosY = movePosY;
            if (movePosX > 400 && (movePosY-contentHeight) > 65) {

                editBox_container_table.style.cssText += "; width: " + movePosX + "px; height: " + ((movePosY)) + "px;";
                editBox_iframe.style.cssText = "; height: "+(movePosY) + "px";
                editBox_textArea.style.cssText= "; height: "+(movePosY) + "px";

                startPosX = event.clientX;
                startPosY = event.clientY;
            }
        }
    };


    this.dragResize_mouse_up = function (event) {
        reSizeStart = false;

        //drag후에 iframe에 있는 내용을 편집하기 위하여 block 레이어를 없애준다.
        $J("#" + textAreaId, "dragBlock").style.display = "";

        addEvent(window.document, "onmousemove", null);
        addEvent(window.document, "onmouseup", null);

        $J("#" + textAreaId, "dragResize").onmouseout = null;
    };

    this.dragResize = function () {
    	
    	var targetObj = $J("#" + textAreaId, "dragResize");

        addEvent(targetObj, "onmousedown", self.dragResize_mouse_down);

    };

};

var JCEditor = function(textAreaId,width,height,config){
	/** TextArea Id**/
	this.textAreaId = textAreaId || "";
	/** iframe Id**/	
	this.ifrmId = textAreaId+"-jceditor-edit-iframe";
	/**TextArea 객체. **/		
	this.taObj = null;
	/**내용을 편집 하기 위한 iframe Contet.. **/	
	this.ifrmContent = null;
	/** 아이프레임 document..**/
	this.ifrmDoc =  null;
	/** 에디터 가로 크기 **/		
	this.width = width || "600px";
	/** 에디터 세로 크기 **/		
	this.height = height || "500px";
	/** 현재 자신을 가리키는 객체**/
	this.self = this;
	/** selection 객체를 text와 htmltext값과 함께 제공한다.**/			
	this.selection  = null;
	/** 펼처진 DropDownId 를 저장한다.**/			
    this.oldDropDownId=null;
	/** 펼처진 DropDown객체 를 저장한다.**/			
    this.oldDropDownObj=null;	
	/** 펼처진 DropDownBtn 객체 를 저장한다.**/			
    this.oldDropDownBtn=null;
	/** 에디터 편집창의 히스토리를 저장한다.**/			
	this.history = new Array();
	/** 저장된 히스토리를 꺼내올 인덱스 번호.**/			 
	this.historyPos = -1;
	/** 전체 화면 모드 지정.**/			 
	this.fullMode = false;
	
	this.clickTableObj;
	this.currRowIndex	= 0;
	this.currColIndex = 0;
	
	
	
	
	
	
	/** 옵션 설정 Json 방식으로 넘어온다. **/			
	this.config = {
		hideGroup : {
			groupA : false,
			groupB : false,
			groupC : false,
			groupD : false,
			groupE : false,
			groupF : false,
			groupG : false,
			groupH : false,
			group1 : false,
			group2 : false,
			group3 : false,
			group4 : false,
			group5 : false,
			group6 : false,
			group7 : false,
			group8 : false
		},
		
		hideButton : {
			FormatBlock :			false,
			FontFamily :			false,
			FontSize : 				false,
			Bold :					 	false,
			Underline : 			 	false,
			Italic :					false,
			Strikethrough :		false,
			ForeColor :				false,
			BackColor :				false,
			Justifyleft : 				false,
			Justifycenter :			false,
			Justifyright : 			false,
			Justifyfull : 				false,
			Insertorderedlist : 	false,
			Insertunorderedlist : false,
			Outdent : 				false,
			Indent : 					false,
			CreateLink : 			false,
			UnLink : 				false,
			Htmlmode :			false,
			NewDocument :		false,
			Undo :					false,
			Redo :					false,
			Cut :						false,
			Copy :					false,
			Paste :					false,
			SelectAll :				false,
			SubScript :				false,
			SuperScript :			false,
			RemoveFormat :		false,
			Quotation :				false,
			Emoticon :				false,
			Scharacter :				false,
			Table :					false,
			Picture :					false,
			Flash :					false,
			Inserthorizontalrule :	false,
			PrintLine :				false,
			Preview :				false,
			Print :					false,
			FullScreen :				false
		},
		enterMode : false,
		allowScript : false,
		allowScriptValidateMessage : false,
		pTagMargin : {
			marginTop : "15",
			marginBottom :  "15",
			lineHeight :  "1.2"
		}
	};

	/** 전체 화면 모드일 때 이전 크기로 복원하기 위해 가로,세로 정보를 저장한다.**/			 
	
	this.fullModeElOffset = {
		containerWidth : 0,
		containerHeight : 0,
		contentWidth : 0,
		contentHeight : 0			
	};

	/**
	 * 에디터 생성시 글자 크기 설정하는 정보.
	 * @type Json
	 */	
	this.fontSizeInfo={
		"1" : "8pt",
		"2" : "10pt",
		"3" : "12pt",
		"4" : "14pt",
		"5" : "18pt",
		"6" : "24pt",
		"7" : "36pt"
	};
	

    this.formatblockInfo = {
    		"p" : "기본 문단",
    		"address" : "주소" ,
    		"h1": "제목 1",
    		"h2": "제목 2",
    		"h3": "제목 3",
    		"h4":  "제목 4",
    		"h5": "제목 5",
    		"h6": "제목 6",
    		"pre" : "Formatted"
        };	
    
	/**
	* 에디터에서 이용할 폰트 목록
	*/	
	this.fontFamilyInfo=["굴림", "굴림체", "돋움", "돋움체", "바탕",  "바탕체", "궁서", "Arial", "Arial Black", "Comic Sans Ms", "Courier New",  "Tahoma", "Verdana"];
	
	this.toolBar = {
					
		optionToolBar : {
			groupA : ["NewDocument"],
			groupB : ["Undo","Redo"],
			groupC : ["Cut","Copy","Paste","SelectAll"],
			groupD : ["SubScript","SuperScript","RemoveFormat"],
			groupE : ["Quotation","Emoticon","Scharacter","Table","Picture","Flash","Inserthorizontalrule"],
			groupF : ["CreateLink","UnLink"],
			groupG : ["PrintLine","Preview","Print"],
			groupH: ["FullScreen"]
		},
					
		defaultToolBar : {
			group1 : ["FormatBlock"],
			group2 : ["FontFamily"],
			group3 : ["FontSize"],
			group4 : ["Bold","Underline","Italic","Strikethrough","ForeColor","BackColor"],
			group5 : ["Justifyleft","Justifycenter","Justifyright","Justifyfull"],
			group6 : ["Insertorderedlist","Insertunorderedlist"],
			group7 : ["Outdent","Indent"],
			group8 : ["Htmlmode"]		
		}

	};
	
		
	/**
	 * 에디터 툴바 버튼에 적용될 버튼 정보.
	 * @type Json
	 */
	this.toolBarInfo = {
		//커맨드 이름                 //버튼 누르기 전 css class                       //버튼 누른 후 css class                  //버튼 효과....
		FormatBlock :			 ["FormatBlock",        		"jceditor-formatblock-btn-off"            	,"jceditor-formatblock-btn-on"    		 ,"jceditor-formatblock-btn-disabled"       		,"스타일"	  	 ,false ],
		FontFamily :			 ["FontFamily",        		"jceditor-fontfamily-btn-off"            		 ,"jceditor-fontfamily-btn-on"    			 ,"jceditor-fontfamily-btn-disabled"       			,"글꼴"	  		 ,false ],
		FontSize : 				 ["FontSize",         			"jceditor-fontsize-btn-off"           			 ,"jceditor-fontsize-btn-on"       			 ,"jceditor-fontsize-btn-disabled"        			,"크기"			 ,false ],
		Bold :					 	 ["Bold",               		    "jceditor-bold-btn-off"            				 ,"jceditor-bold-btn-on"               		 ,"jceditor-bold-btn-disabled"   						,"굵게"	  		 ,false ],
		Underline : 			 	 ["Underline",         		    "jceditor-underline-btn-off"           		 ,"jceditor-underline-btn-on"               ,"jceditor-underline-btn-disabled"    				,"밑줄"			 ,false ],
		Italic :					 ["Italic",               		    "jceditor-italic-btn-off"           				 ,"jceditor-italic-btn-on"             		 ,"jceditor-italic-btn-disabled"  						,"기울림꼴"  	 ,false ],
		Strikethrough :		 ["Strikethrough",             "jceditor-strikethrough-btn-off"              ,"jceditor-strikethrough-btn-on"          ,"jceditor-strikethrough-btn-disabled"				,"취소선"		 ,false ],
		ForeColor :				 ["ForeColor",                  "jceditor-forecolor-btn-off"            		 ,"jceditor-forecolor-btn-on"                ,"jceditor-forecolor-btn-disabled" 					,"글자색" 		 ,false ],
		BackColor :				 ["BackColor",                  "jceditor-backcolor-btn-off"            		 ,"jceditor-backcolor-btn-on"               ,"jceditor-backcolor-btn-disabled" 				,"배경색" 		 ,false ],
		Justifyleft : 				 ["Justifyleft",                   "jceditor-justifyleft-btn-off"            		 ,"jceditor-justifyleft-btn-on"               ,"jceditor-justifyleft-btn-disabled" 					,"왼쪽정렬" 	 ,false ],
		Justifycenter :			 ["Justifycenter",               "jceditor-justifycenter-btn-off"            	 ,"jceditor-justifycenter-btn-on"           ,"jceditor-justifycenter-btn-disabled" 				,"중앙정렬" 	 ,false ],
		Justifyright : 			 ["Justifyright",                 "jceditor-justifyright-btn-off"            		 ,"jceditor-justifyright-btn-on"           	 ,"jceditor-justifyright-btn-disabled" 				,"오른쪽정렬"   ,false ],
		Justifyfull : 				 ["Justifyfull",                   "jceditor-justifyfull-btn-off"            		 ,"jceditor-justifyfull-btn-on"               ,"jceditor-justifyfull-btn-disabled" 					,"양쪽 맞춤" 	 ,false ],
		Insertorderedlist : 	 ["Insertorderedlist",          "jceditor-insertorderedlist-btn-off"           ,"jceditor-insertorderedlist-btn-on"      ,"jceditor-insertorderedlist-btn-disabled"			,"순서있는 목록" 		 ,false ],
		Insertunorderedlist :  ["Insertunorderedlist",       "jceditor-insertunorderedlist-btn-off"       ,"jceditor-insertunorderedlist-btn-on"   ,"jceditor-insertunorderedlist-btn-disabled"		,"순서없는 목록 " 	 ,false ],
		Outdent : 				 ["Outdent",                    "jceditor-outdent-btn-off"           			 ,"jceditor-outdent-btn-on"                 ,"jceditor-outdent-btn-disabled" 					,"내어쓰기" 		 ,true ],
		Indent : 					 ["Indent",                       "jceditor-indent-btn-off"            			 ,"jceditor-indent-btn-on"                   ,"jceditor-indent-btn-disabled" 						,"들여쓰기" 		 ,true ],
		CreateLink : 			 ["CreateLink",                 "jceditor-createlink-btn-off"          			 ,"jceditor-createlink-btn-on"               ,"jceditor-createlink-btn-disabled"  				,"링크" 		 	 ,false ],
		UnLink : 				 ["UnLink",                      "jceditor-unlink-btn-off"            			 ,"jceditor-unlink-btn-on"                   ,"jceditor-unlink-btn-disabled"  					,"링크제거" 	 ,false ],
		Htmlmode :			 ["Htmlmode",                 "jceditor-html-btn-off"            				 ,"jceditor-html-btn-on"                     ,"jceditor-html-btn-disabled" 						,"배경색" 		 ,false ],
		NewDocument :		 ["NewDocument",           "jceditor-new-btn-off"           				 ,"jceditor-new-btn-on"                     ,"jceditor-new-btn-disabled" 							,"새 문서" 		 ,true ],
		Undo :					 ["Undo",                		 "jceditor-undo-btn-off"           				 ,"jceditor-undo-btn-on"                     ,"jceditor-undo-btn-disabled" 						,"되돌리기" 	 ,true ],
		Redo :					 ["Redo",                		 "jceditor-redo-btn-off"            				 ,"jceditor-redo-btn-on"                 	  ,"jceditor-redo-btn-disabled" 						,"다시실행" 	 ,true ],
		Cut :						 ["Cut",                		 	"jceditor-cut-btn-off"            				 ,"jceditor-cut-btn-on"                 		  ,"jceditor-cut-btn-disabled" 							,"자르기" 	 	 ,true ],
		Copy :					 ["Copy",                		 "jceditor-copy-btn-off"            			 ,"jceditor-copy-btn-on"                 	  ,"jceditor-copy-btn-disabled" 						,"복사하기" 	 ,true ],
		Paste :					 ["Paste",                		 "jceditor-paste-btn-off"            			 ,"jceditor-paste-btn-on"                 	  ,"jceditor-paste-btn-disabled" 						,"붙여넣기" 	 ,true ],
		SelectAll :				 ["SelectAll",                	 "jceditor-selectall-btn-off"            		 ,"jceditor-selectall-btn-on"                  ,"jceditor-selectall-btn-disabled" 					,"전체선택" 	 ,true ],
		SubScript :				 ["SubScript",               	 "jceditor-subscript-btn-off"            		 ,"jceditor-subscript-btn-on"                 ,"jceditor-subscript-btn-disabled" 				,"아래첨자" 	 ,true ],
		SuperScript :			 ["SuperScript",               	 "jceditor-superscript-btn-off"            	 ,"jceditor-superscript-btn-on"              ,"jceditor-superscript-btn-disabled" 				,"윗첨자" 	 	 ,true ],
		RemoveFormat :		 ["RemoveFormat",            "jceditor-removeformat-btn-off"            ,"jceditor-removeformat-btn-on"          ,"jceditor-removeformat-btn-disabled" 			,"서식제거" 	 ,true ],
		Quotation :				 ["Quotation",               	 "jceditor-quotation-btn-off"            		 ,"jceditor-quotation-btn-on"               ,"jceditor-quotation-btn-disabled" 				,"인용구" 	 	 ,false ],
		Emoticon :				 ["Emoticon",           		 "jceditor-emoticon-btn-off"           		 ,"jceditor-emoticon-btn-on"         		  ,"jceditor-emoticon-btn-disabled" 				,"이모티콘" 	 ,false ],
		Scharacter :				 ["Scharacter",           		 "jceditor-scharacter-btn-off"           		 ,"jceditor-scharacter-btn-on"         	  ,"jceditor-scharacter-btn-disabled" 				,"특수문자" 	 ,false ],
		Table :					 ["Table",           				 "jceditor-table-btn-off"           				 ,"jceditor-table-btn-on"         			  ,"jceditor-table-btn-disabled" 						,"테이블" 		 ,false ],
		Picture :					 ["Picture",           		 	"jceditor-picture-btn-off"           			 ,"jceditor-picture-btn-on"         		  ,"jceditor-picture-btn-disabled" 					,"사진" 			 ,false ],
		Flash :					 ["Flash",           		 		"jceditor-flash-btn-off"           				 ,"jceditor-flash-btn-on"         		  	  ,"jceditor-flash-btn-disabled" 					,"플래시" 		 ,false ],
		Inserthorizontalrule :	 ["Inserthorizontalrule",     "jceditor-horizon-btn-off"           			 ,"jceditor-horizon-btn-on"         		  ,"jceditor-horizon-btn-disabled" 					,"수평선" 		,true ],
		PrintLine :				 ["PrintLine",           		"jceditor-printline-btn-off"           			 ,"jceditor-printline-btn-on"         		  ,"jceditor-printline-btn-disabled" 					,"인쇄쪽나눔" 		,true ],
		Preview :				 ["Preview",           			"jceditor-preview-btn-off"           			 ,"jceditor-preview-btn-on"         		  ,"jceditor-preview-btn-disabled" 					,"미리보기" 		,true ],
		Print :					 ["Print",           				"jceditor-print-btn-off"           				 ,"jceditor-print-btn-on"         		 	 ,"jceditor-print-btn-disabled" 						,"인쇄" 				,true ],
		FullScreen :				 ["FullScreen",           		"jceditor-fullscreen-btn-off"           		 ,"jceditor-fullscreen-btn-on"         		  ,"jceditor-fullscreen-btn-disabled" 				,"전체화면" 		,false ]

	};
	
	this.fontcolorpalate = [ "#000000","#993300","#333300","#003300","#003366","#000080","#333399","#333333",
									"#800000","#FF6600","#808000","#008000","#008080","#0000FF","#666699","#808080",
									"#FF0000","#FF9900","#99CC00","#339966","#33CCCC","#3366FF","#800080","#999999",
									"#FF00FF","#FFCC00","#FFFF00","#00FF00","#00FFFF","#00CCFF","#993366","#C0C0C0",
									"#FF99CC","#FFCC99","#FFFF99","#CCFFCC","#CCFFFF","#99CCFF","#CC99FF","#FFFFFF"];
									
									
	var setConfig = (function (self,config){
		
		function optionAlert(optionkey){
			if (typeof(optionkey) =="undefined") {
				window.alert("옵션 설정 명령이 존재 하지 않습니다. 다시 확인해 주시기 바랍니다.");
				return;
			}
		}
		
		for ( var key in config) {
			optionAlert(config[key]);
			if (key =="hideGroup" || key =="hideButton") {
				for ( var elkey in config[key]) {
					optionAlert(self.config[key][elkey]);
					self.config[key][elkey] = config[key][elkey];
				}

			}else{
				optionAlert(self.config[key]);
				self.config[key] = config[key];
			}
		}
	})(this,config);
	
	var init = (function(parent){
		
		parent.setTextAreaAttribute();
		var newElement = parent.wrapElement(); 
		var layout  = parent.editLayout();
		parent.editPlacement(newElement,layout);
		parent.iframeEditMode();
		parent.setEditBoxHeight();
		parent.setToolBarEvent();	

		//브라우져 별로 컨테츠를 조작할 수 있게 셋팅한다.
		
		if (Browser.type == "MSIE" ) {
			parent.ifrmContent = $J("#" + parent.textAreaId, "ifrm").body()[0];
		}else if (Browser.type == "Opera") {
			parent.ifrmContent = $J("#" + parent.textAreaId, "ifrm").contentWindow();
		}else{
			parent.ifrmContent = $J("#" + parent.textAreaId, "ifrm").iframe;
		}
		
		parent.ifrmDoc = $J("#" + parent.textAreaId, "ifrm").doc();
		parent.taObj = $J("#" + parent.textAreaId);
		parent.selection = parent.getSelection();
		parent.getFocusPosition();

		var drag = new DragResize(parent.textAreaId,parent.ifrmId);
		drag.dragResize();
		
		
		if (parent.ifrmDoc.getElementsByTagName("body")[0]) {
			parent.ifrmDoc.getElementsByTagName("body")[0].innerHTML = parent.taObj.value;			
		}
		
		if(parent.ifrmDoc.getElementsByTagName("body")[0].innerHTML == ""){
			parent.ifrmDoc.execCommand("fontName",false,"돋움"); //10pt
			parent.ifrmDoc.execCommand("formatBlock",false,"p"); //10pt
			parent.ifrmDoc.execCommand("fontSize",false,2); //10pt
		}
		
		setInterval(function(){

			parent.fontStyle(["font","u","em","i","strong","b","strike","p"], ["face","size","color"]);
			
		}, 500);
					
		
	})(this);
	
};

JCEditor.prototype = {
		
		
	/**
	* dropdown 레이어 아이디를 생성한다.
	@param menuName select메뉴 이름
	*/
	getLayerId : function(menuName,type){
		return this.textAreaId+"-"+menuName+type+"-div";
	},	
		
	/**
	* toolBar 버튼을 감싸고 있는 span 테그 이름을 생성한다.
	@param menuName 메뉴 이름
	*/
	getBtnSpanId : function(menuName){
		return this.textAreaId+"-"+menuName+"-span";
	},	
	
	
	/**
	* toolBar 버튼을 감싸고 있는 버튼(Button) 테그 이름을 생성한다.
	* @param menuName 메뉴 이름
	*/
	getBtnId : function(menuName){
		return this.textAreaId+"-"+menuName+"-btn";
	},	
	
	/**
	*  편집 내용을 불러온다.
	* @return 편집 tag
	*/
	getContent : function(){
		
		var html = this.ifrmDoc.getElementsByTagName("body")[0].innerHTML;
		var html = $J("#"+this.textAreaId).value = html ;
		
	
		html = html.replace(/<(\/?)(font|Strong|i|em|u|strike|b)([^>]*)>/ig,
				function (a, b, c,d) {
					if (/^\S/.test(d)) return a;
					return '<' + b + 'span' + d + '>';
				});
		
		if (Browser.type=="Chrome" || Browser.type=="Safari" ) {
			html = html.replace(/<div([^>]*)>(.*?)<\/div>/ig,
				function (a, b, c) {
					if (/[a-z]*=/gi.test(b)) return a;

					if (/<br>/.test(c)) c = "";
					return  "<br />"+c;
				});
		}
		
		html = html.replace(/<br>/ig,"<br />");
		
		var allowScript = this.config.allowScript;
		var allowScriptValidateMessage = this.config.allowScriptValidateMessage;
		//정규식 허용하고
		if (allowScript) {
			//정규식 scriptTag검증 메시지 출력시
			if (allowScriptValidateMessage) {
			
				var scriptRegex = /<script>(.*?)<\/script>/gi;
				var scriptValidate ;
				while (scriptValidate = scriptRegex.exec(html)) {				
					var scriptContentRegx = /<(\/?)script([^>]*)>/gi;
					if (scriptContentRegx.test(scriptValidate[1])) {
						window.alert("스크립트 테그가 올바르지 않습니다. 스크립트를 다시 확인하여 주시기 바랍니다.");
						return html;						
					}
				}
			}			
		}else{

			html = html.replace(/<script[^>]*>.*?<\/script>/gi,"").replace(/<(\/?)script([^>]*)>/gi,"");
		}
//		this.getContentLength();
		return html;
	},	
	
	/**
	 * html을 제거한 문자길이를 구한다.
	 * 
	 * @returns 문자길이
	 */
	
	getContentLength : function() {
		
		var html = this.ifrmDoc.getElementsByTagName("body")[0].innerHTML;
		var html = $J("#"+this.textAreaId).value = html ;
		
		var tagRegex = /<(\/?).*?([^>]*)>/gi;
		var whitespace = /&nbsp;/gi;
		html = html.replace(tagRegex,"");
		html = html.replace(whitespace," ");
		html = html.replace(/\n|\t|\r/gi,"");
		html = html.replace(/&lt;/gi,"<");
		html = html.replace(/&gt;/gi,">");
		html = html.replace(/&amp;/gi,"&");
		
		return html.length;
	}
	
	,
	
	
	/**
	* LayerPopup 을 생성 한다. 경고 알림창이나 플러그인 팝업을 만들 때사용한다.
	* @param width 가로 크기
	* @param height 세로크기 
	* @param id LayerPopup id
	*/
	popupWindow : function(id,title){
		
		var wrapLayer  = document.createElement("div");
		wrapLayer.setAttribute("id",id);
		wrapLayer.className="jceditor-dialog-div";
		var titleUl =  document.createElement("ul");
		var titleLi =  document.createElement("li");
		var titleSpan =  document.createElement("span");
		var title = document.createTextNode(title);
		
		titleUl.className="titlebar-ul";
		titleLi.className="titlebar-center-li";
		
		titleSpan.appendChild(title);
		titleLi.appendChild(titleSpan);
		titleUl.appendChild(titleLi);
		wrapLayer.appendChild(titleUl);	
		return wrapLayer;
	},	
	
	/**
	* 플러그인 페이지를 불러올 아이프레임 페이지를 만든다.
	* @param id 팝업 아이디
	*/
	pluginIframe : function(id,title){
		
		var popupWindow = this.popupWindow(id,title);
				
		var iframe = document.createElement("iframe");
		iframe.setAttribute("id", id.replace("-div","-iframe"));
		iframe.setAttribute("src", "about:blank");
		iframe.setAttribute("scrolling", "no");
		iframe.setAttribute("frameBorder", "0");		
		popupWindow.appendChild(iframe);	
		
		return popupWindow;
	},	
	
	
	/**
	* 플러그인을 불러온다. 크기 및 URL 변경.
	* @param width 가로 크기
	* @param height 세로크기 
	* @param url 플러그인 URL
	* @return URL로 호출하고 있는 객체.
	*/
	setPlugin : function(width,height,url,id){		
		height = (Browser.type=="MSIE" ||Browser.type=="Opera")?height:height-10;
		var pluginLayerObj = $J("#"+id);
		pluginLayerObj.style.cssText = "width:"+width+"px;height:"+height+"px;margin-left:"+(-(width/2))+"px;margin-top:"+(-(height/2))+"px";
		var pluginIframe =$J("#"+id.replace("-div","-iframe"));
		pluginIframe.style.cssText="width:"+width+"px;height:"+(height-30)+"px";
		pluginIframe.src = url;
		
		return {
			plugin : pluginIframe,
			layerId : id
		};		
	},	
	
	
	/**
	* HTML 보기나 TEXT보기 실행시 모든 버튼을 DISABLE 하고도
	* IE 브라우져 에서는 버튼에 등록된 이벤트가 실행 된다.
	* 이벤트 실행을 멈추기 위하여 버튼이 disabled 가 되어있다면 이벤트를 실행하지 않는다.
	* @param event 이벤트 객체
	*/
	
	btnDisabledCancel : function(event){	
		var obj = (event.target) ? event.target : event.srcElement;	
		
		if (obj.disabled== true) {
			return;
		}
	},
	
	/**
	* 플러그인 확인이나 취소 버튼 누를경우 실행 됌.
	*
	* @param id  플러그인 레이어 아이디
	*
	*/
	
	pluginClose : function(id){
	
		var toggleReturn =  this.viewToggle(id);    
		var obj = $J("#"+id);		
		this.dropDownClassChange(toggleReturn, obj.parentNode);
	},
	
	
		/**
	* 플러그인팝업이 사라지면 폼안의 내용을 초기화 한다.
	*
	*/
	
	pluginFormReset : function(){				
		
		if (this.oldDropDownObj != null) {		
			var iframeType = typeof(this.oldDropDownObj.getElementsByTagName("iframe")[0]);
			var ifrmObj = null;
			if (iframeType == "object") {
				
				ifrmObj = this.oldDropDownObj.getElementsByTagName("iframe")[0];
				
				if (ifrmObj.tagName.toUpperCase() =="IFRAME") {
					ifrmObj.contentWindow.pluginReset();		
				}
			}
		}			
	}, 
	
	/**
	* 에디터에 html 테그를 입력한다.
	*
	*/	
	pasteHTML : function(html){

		if (Browser.type=="MSIE") {
			this.selection.selection.pasteHTML(html);
		} else {		
			this.ifrmDoc.execCommand('inserthtml', null, html);
		}
	},	
	
	/**
	* 에디터에서 타이핑한 히스토리를 쌓아 놓는다.
	*
	*/	
	historyPush  : function(){	
		//history 를 쌓을 크기.
		var pushLimit = 30;
		
		if (this.history.length > pushLimit) {			
			this.history = this.history.slice(0, 0).concat(this.history.slice(1, 29));
		}		
		this.history.push(this.ifrmDoc.getElementsByTagName("body")[0].innerHTML);		
		this.historyPos = this.history.length;
	},
	

	/**
	 *기본적용된 에디터의 EnterKey 와 shiftKey+EnterKey 의 역활을 바꾼다.
	 * EnterKey = BR 테그, shiftKey+EnterKey = P 테그
	 * 
	 *. -------- 크롬 사파리 때문에 적용 불가..-------------------
	 * @param event
	 */
	
	enterKeyChange : function(event){
		
		var self = this;
		
		function brTag(){
			
			if (Browser.type !="Opera") {
				//--아... 표준... 부르짓는것들이.. 이런거하나 안맞춰놨네... 해결못한체로 그냥 둘까?..
				if (Browser.type =="Chrome"||Browser.type =="Safari") {

					var anchorNode= self.selection.selection.anchorNode;
					var parentNodeTagName = anchorNode.parentNode.tagName.toLowerCase();
					
					if (parentNodeTagName=="p"  || parentNodeTagName =="td"	 || parentNodeTagName=="pre") {
	
						if (parentNodeTagName=="p" || parentNodeTagName =="pre") {

							
							event.preventDefault();

							
							function setCaretTo(iframename, d) {
								var d2 = d;
								obj=document.getElementById(iframename).contentWindow;
								var range= obj.getSelection().getRangeAt(0);

								range.setStart(range.startContainer, range.endOffset-1);
								range.setEnd(range.endContainer, range.endOffset);

			                    self.selection.selection.removeAllRanges();
			                    self.selection.selection.addRange(range);

							}
														
							var range = self.selection.selection.getRangeAt(0);
							var brEl = self.ifrmDoc.createElement("br");
							brEl.id='jce_temp_br';
							var tmpSpan = self.ifrmDoc.createElement("span");
							tmpSpan.id="jce_temp_span";
							tmpSpan.innerHTML="&nbsp;";

							range.insertNode (tmpSpan);	
			                range.insertNode (brEl);	

							self.pasteHTML("<br>&nbsp;");		

							setCaretTo(self.ifrmId);
							
				            var el  = self.ifrmDoc.getElementById("jce_temp_span");
				            el.innerHTML="";
				            el.parentNode.removeChild(el);
				            
				            var el2 = self.ifrmDoc.getElementById("jce_temp_br");
				            
				            if(el2){
					            el2.parentNode.removeChild(el2);				      
					            
				            }else{
								setCaretTo(self.ifrmId);
								self.selection.selection.deleteFromDocument();
				            }
						}
						
	                    return;
		            }else{		 
						event.preventDefault();
						self.pasteHTML("<BR id='jce_tmp_paste_br'>");		
		            }
				}else{
					event.preventDefault();
					self.pasteHTML("<BR id='jce_tmp_paste_br'>");		
				}
			}else{
				event.preventDefault();
				self.pasteHTML("<BR id='jce_tmp_paste_br'> ");
			}
			// 브라우져별로 Enter Key 눌렀을 경우 Br테그 처리가 어려워.. 정규표현식으로 해당 조건 검색후.
			// br 테그를 더 넣는 식으로 했음. br테그가 2개이상 처리될경우 브라우져에서 알아서 처리.함....
			var regx = /<br id=\"jce_tmp_paste_br\">([a-z]|[가-힣]|[^A-Za-z0-9](br)?)/gi;
			var tagHtml = self.ifrmDoc.getElementsByTagName("body")[0].innerHTML;
			
            var el  = self.ifrmDoc.getElementById("jce_tmp_paste_br");
            el.removeAttribute("id");
            self.getSelection();
            var range = self.selection.selection.getRangeAt(0);		  
            range.selectNode(el);
            
            var ret = regx.test(tagHtml);
            
			if (!ret) {
				if(Browser.type !="Opera"){
					self.pasteHTML("<br><br><br>");
				}else{
					self.pasteHTML("<br>");
				}
			}
			
            range.collapse(false);     
            
			if (!ret) {
				self.selection.selection.deleteFromDocument();
			}
		}
		
		function pTag(){
			
			event.preventDefault();

			var el =self.ifrmDoc.createElement("p");
            el.id="jce_tmp_paste";
            var range = self.selection.selection.getRangeAt(0);
            
			if (self.selection.selection.anchorNode.parentNode.tagName.toLowerCase()=="p") {
                range.selectNode(self.selection.selection.anchorNode.parentNode);
            }
			
            range.collapse (false);
            range.insertNode(el);

            var el  = self.ifrmDoc.getElementById("jce_tmp_paste");
            
            if (Browser.type == "Chrome" || Browser.type == "Safari") {
            	
            	el.innerHTML="&nbsp;";
                el.removeAttribute("id");
                var range = self.ifrmDoc.createRange();		            
                range.selectNodeContents(el);

                self.getSelection();

                self.selection.selection.removeAllRanges();
                self.selection.selection.addRange(range);
                self.selection.selection.getRangeAt(0).deleteContents();
                
			}else{
				
	            el.removeAttribute("id");
	            var range = self.ifrmDoc.createRange();		            
	            range.selectNodeContents(el);	            
	            
	            range.collapse(self.selection.selection.focusNode,self.selection.selection.focusOffset);
	            self.getSelection();

	            self.selection.selection.removeAllRanges();
	            self.selection.selection.addRange(range);	
			}
            
		}
		
		
		if (event.keyCode == 13) {
		
			if (Browser.type=="MSIE") {
			
				if (event.shiftKey) {
					this.cancelEventBubbling(event);
					event.returnValue=false;
					this.selection.selection.pasteHTML("<p> </p>");
					this.selection.selection.select();


				}else{
					this.cancelEventBubbling(event);
					event.returnValue=false;
					this.selection.selection.pasteHTML("<br />");
					this.selection.selection.select();
					this.selection.selection.moveEnd("character", 1);
					this.selection.selection.moveStart("character", 1);
					this.selection.selection.collapse(false);
				}
				
			}else 	if (Browser.type=="Firefox") {
				
				event.preventDefault();
				
				if (event.shiftKey) {
					pTag();
				}else{
					brTag();
				}
				
			}else 	if (Browser.type=="Chrome" ||   Browser.type=="Safari"  ||    Browser.type=="Opera") 	{
				
				if (event.shiftKey) {					
					pTag();
				}else{
					brTag();                
				}
			}
		}

	},
	
	setMenu : function(type,menu){
		
		if (type==undefined || menu==undefined ) {
			throw "메뉴 값이 넘어오지 않습니다.";
		}
		
		if (type=="group") {
			type="hideGroup";
		}else if (type=="button") {
			type = "hideButton";
		}
		
		var retValue=false;
		//메뉴가 묶여있는 그룹을 안보여 준다면 그룹에 포함된 메뉴들도 true로 셋팅한다.
		var toolbar = (type=="hideGroup")?this.config.hideGroup : this.config.hideButton;
		if (toolbar[menu] == true) {
			if (type =="hideGroup") {
				
				for ( var toolBarId in this.toolBar) {
					
					var groupMenu = this.toolBar[toolBarId][menu];
					
					if (groupMenu != undefined) {
						for ( var i = 0; i < groupMenu.length; i++) {							
							this.config.hideButton[groupMenu[i]] = true; 										
						}						
					}					
				}				
			}
			retValue = true;
		}
		
		return retValue;
	},
	
	/**
	 * 엘리먼트의 가로 세로 크기를 구한다.
	 * 
	 * @param el 엘리먼트
	 * @returns {width,height}
	 */
	
	elementOffset : function (el){
		
		var width = 0;
		var height = 0;
		
		if(el.offsetHeight != 0 && el.offsetWidth != 0){
			width = el.offsetWidth;
			height = el.offsetHeight;
		}
		
		return {
			width : width,
			height : height
		};
		
	},		
	
	/**
	 * Font-Style 과 관련된 tag들을 span테그로 변경한다.
	 * 
	 * @param tag [테그 배열]
	 * @param attr [속성 배열]
	 */
	
	fontStyle : function(tag,attr){
		var self=this;
		var tag = tag;
		var attr = attr;
		var tagCount =  tag.length;
		
		for (var k = 0; k < tagCount; ++k) {

			var fontEl = this.ifrmDoc.getElementsByTagName(tag[k]);
			var fontTagCount =  fontEl.length;

			for (var i = 0; i < fontTagCount; ++i) {

				for ( var j = 0; j < attr.length; j++) {
				
					if (fontEl[i].tagName.toLowerCase() == "p") {
						if (fontEl[i].style.lineHeight=="") {
							fontEl[i].style.marginTop = (!self.config.pTagMargin.marginTop)?"15":self.config.pTagMargin.marginTop;
							fontEl[i].style.marginBottom = (!self.config.pTagMargin.marginBottom)?"15":self.config.pTagMargin.marginBottom;
							fontEl[i].style.lineHeight = (!self.config.pTagMargin.lineHeight)?"1.2":self.config.pTagMargin.lineHeight;
						}
					}
				
					if(fontEl[i].getAttribute(attr[j])) {		
						var saveValue =fontEl[i].getAttribute(attr[j]);
						fontEl[i].removeAttribute(attr[j]);					
						if (attr[j] =="face" && saveValue ) {
							fontEl[i].style.fontFamily = saveValue;					
						}else if (attr[j] =="size" && saveValue) {
							fontEl[i].style.fontSize = this.fontSizeInfo[saveValue];
						}else if (attr[j] =="color" && saveValue) {
							fontEl[i].style.color = saveValue;
						}		
					}

					if (fontEl[i].tagName.toLowerCase() == "u") {
							fontEl[i].style.textDecoration = "underline";
					}else	if (fontEl[i].tagName.toLowerCase() == "strike" ) {
						fontEl[i].style.textDecoration = "line-through";							
					}else	if (fontEl[i].tagName.toLowerCase() == "em" || fontEl[i].tagName.toLowerCase() == "i") {
						fontEl[i].style.fontStyle = "italic";							
					}else	if (fontEl[i].tagName.toLowerCase() == "strong" || fontEl[i].tagName.toLowerCase() == "b") {
						fontEl[i].style.fontWeight = "bold";
					}			
				}	
			}
												
			fontEl= null;
		}
	},
		
	
	/**
	* 기본 textArea에 JCEditor에서 사용 할 css class 및 임의로 지정한 아이디를 등록한다.
	*/
	setTextAreaAttribute :  function () 
	{
		try {
			
			var currDate = new Date();
			// 기본 textArea에 JCEditor에서 사용 할 css class 를 등록한다.
			var classNameArg = "jceditor-content-textarea";
			var classNameObject = document.getElementById(this.textAreaId);
			
			var newTextAreaId = this.textAreaId+currDate.getMilliseconds();
			classNameObject.id = newTextAreaId;
			classNameObject.className=classNameArg;
			
			this.textAreaId = newTextAreaId;
			this.ifrmId = newTextAreaId+"-jceditor-edit-iframe";
			
		} catch (e) {
			
			window.alert(e.message);
		}
	},

	/**
	* 에디터를 감쌀 div를 생성한다.
	* 
	* @return Dom Element
	*/

	wrapElement : function()
	{
		var newElement = document.createElement("div");
		newElement.setAttribute("id",this.textAreaId+"-jceditor-wrap-div");
		newElement.setAttribute("unselectable","on");
		newElement.className="jceditor-wrap-div";
		
		return newElement;
	},
	
	/**
	* 에디터 형태를 유지할 table을 셋팅한다.
	*
	* @return layout
	* @type String
	*/

	editLayout : function()
	{
		var editLayout ="<table id = \""+this.textAreaId+"-jceditor-container-table\" class=\"jceditor-container-table\"  border=\"0\" >";
		editLayout 	+= "<tr>";
		editLayout 	+= "	<td class=\"jceditor-toolbar-td\" align=\"left\">";

		for ( var toolbarBoxId in this.toolBar) {
			
			editLayout 	+= "<div class=\"jceditor-toolBarWrap-div\">";
			
			var toolBarEval = this.toolBar[toolbarBoxId];


			for ( var  ulName in toolBarEval) {
			
				var groupEval = toolBarEval[ulName];
				var ulId= this.textAreaId+"-"+ulName;
				var groupMake=  this.setMenu("group",ulName);
				
				if (!groupMake) {
					
					editLayout 	+= "<ul id=\""+ulId+"\" class=\"jceditor-group-ul\">";
	
					for(var i = 0 ; i < groupEval.length; i++){
						var toolBarSetInfo =  this.toolBarInfo[groupEval[i]];
						var liId = this.textAreaId+"-"+toolBarSetInfo[0];
						
						var btnMake=  this.setMenu("button", toolBarSetInfo[0]);

						if (!btnMake) {						
						
							editLayout 	+= "<li id=\""+liId+"\" class=\"jceditor-group-li\">";
							editLayout 	+= "<span id=\""+liId+"-span\" class=\""+toolBarSetInfo[1]+"\">";                                
							
							switch (groupEval[i]) {
							case "FormatBlock":
								editLayout 	+= "<button id=\""+liId+"-btn\" type=\"button\" title=\""+toolBarSetInfo[4]+"\" class=\"jceditor-formatblock-btn\">스타일</button>";						
								break;
							case "FontFamily":
								editLayout 	+= "<button id=\""+liId+"-btn\" type=\"button\" title=\""+toolBarSetInfo[4]+"\" class=\"jceditor-fontfamily-btn\">폰트</button>";						
								break;
							case "FontSize":
								editLayout 	+= "<button  id=\""+liId+"-btn\" type=\"button\" id=\""+liId+"-btn\" title=\""+toolBarSetInfo[4]+"\" class=\"jceditor-fontsize-btn\">크기</button>";
								break;
							default:
								editLayout 	+= "<button  id=\""+liId+"-btn\" type=\"button\" id=\""+liId+"-btn\" title=\""+toolBarSetInfo[4]+"\" class=\"jceditor-default-btn\"></button>";							
								break;
							}		
							editLayout 	+= "</span>";
							editLayout 	+= "</li>";
						}
					}				
					editLayout 	+= "</ul>";
				}
			}		
			editLayout 	+= "</div>";
		}
		
		editLayout 	+= "	</td>";
		editLayout 	+= "</tr>";			
		editLayout 	+= "<tr>";
		editLayout 	+= "	<td class=\"jceditor-shadowLine-div\"></td>";
		editLayout 	+= "</tr>";
		editLayout 	+= "<tr>";
		editLayout 	+= "	<td class=\"jceditor-content-td\">";
		editLayout 	+= "	<div class=\"jceditor-contentWrap-div\" >";
		editLayout 	+= "	<iframe  id=\""+this.textAreaId+"-jceditor-edit-iframe\" src=\"about:blank\" frameborder=\"0\" class=\"jceditor-content-iframe\" ></iframe>";
		editLayout 	+= "	<div unselectable=\"On\" id = \""+this.textAreaId+"-jceditor-dragBlock-div\" class=\"jceditor-dragBlock-div\" ></div>";
		editLayout 	+= "	</div>";
		editLayout 	+= "	</td>";
		editLayout 	+= "</tr>";	
		editLayout 	+= "<tr>";	
		editLayout 	+= "	<td><div unselectable=\"On\"  id = \""+this.textAreaId+"-jceditor-dragResize-div\" class=\"jceditor-dragResize-div\" ></div>";	
		editLayout 	+= "	</td>";	 
		editLayout 	+= "</tr>";	
		editLayout 	+= "</div>";	
		
		return editLayout ;
	},

	/**
	* textArea를 Editor 레이아웃 안쪽에 위치 시킨다.
	*
	* @param  newElement 에디터를 감쌀 div Dom 오브젝트
	* @param  editLayout 에디터 형태를 유지할 table
	*/

	editPlacement : function (newElement,editLayout )
	{
		var textAreaObject = $J("#"+this.textAreaId);
		textAreaObject.parentNode.insertBefore(newElement,textAreaObject.nextSibling);
		
		$J("#"+this.textAreaId,"wrap").innerHTML=editLayout;
		var editBox_cTable = $J("#"+this.textAreaId, "cTable");
		editBox_cTable.style.width=this.width;
		
		if (Browser.type=="MSIE") {
			var toolBarHeight =parseInt(editBox_cTable.getElementsByTagName("td")[0].offsetHeight);
			var toolBarLineSeperater =parseInt(editBox_cTable.getElementsByTagName("td")[1].offsetHeight);						
			editBox_cTable.style.height=(parseInt(this.height.substr(0, this.height.indexOf("px"))) -toolBarHeight-toolBarLineSeperater) +"px" ;			
		}else{
			editBox_cTable.style.height=this.height;
		}		
		editBox_cTable.getElementsByTagName("td")[2].getElementsByTagName("div")[0].insertBefore(textAreaObject,$J("#"+this.ifrmId).nextSibling);
	},

	/**
	* iframe 을 에디터 편집기로 활용할 수 있게 편집 모드로 변경 한다.
	*
	*/		
	iframeEditMode :  function ()
	{
		var self = this;

		var ifrm = $J("#"+this.textAreaId,"ifrm");
		var ifrmDoc = ifrm.doc();
		ifrmDoc.open();
		ifrmDoc.write("<html>");
		ifrmDoc.write("<style >");
		
			
			var margin = null;
			var marginTop = "3";
			var marginBottom =  "3";
			var lineHeight =  "1.5";
/*
			
			if (this.config.pTagMargin.length == 1) {
				margin = this.config.pTagMargin[0];
				ifrmDoc.write("body{font-size:9pt;font-family:굴림;}	\n" +
								   "p{margin:"+margin+";line-height:"+lineHeight+"}");			
				
			}else 	if (this.config.pTagMargin.length > 2) {
				window.alert("config.pTagMargin 설정에 문제가 발생하였습니다.");
			}else{
				marginTop = this.config.pTagMargin[0];
				marginBottom = this.config.pTagMargin[1];
				
				ifrmDoc.write("body{font-size:9pt;font-family:굴림;}	\n" +
						"p{margin-top:"+marginTop+";margin-bottom:"+marginBottom+";line-height:"+lineHeight+"}");		
			}
			*/

		ifrmDoc.write("body{font-size:9pt;font-family:굴림;line-height:"+lineHeight+"}");
		
		ifrmDoc.write("</style>");
		ifrmDoc.write("<body></body>");
		ifrmDoc.write("</html>");
		ifrmDoc.close();
		
		if (Browser.type == "MSIE") {
			
			var ifrmBody = ifrm.body()[0];
			this.iframeEditInitialize(ifrmBody);
			ifrmBody.contentEditable=true;	
			ifrmBody.focus();				
		} else {

			this.iframeEditInitialize(ifrmDoc);
			ifrmDoc.designMode="on";		
			ifrm.contentWindow().focus();	
		}
		
	} ,

	/**
	* 에디터의 가로와 세로 값을 지정 하였을때 textArea와 iframe 사이즈도 같이 늘어나게 한다.
	* 세로 값은 table에서 툴바 높이를 제외한 나머지 값이다.
	*/

	setEditBoxHeight : function()
	{
		var doc = $J("#"+this.textAreaId,"cTable").getElementsByTagName("tr")[2];
		if(doc.offsetHeight != 0){
			var pageheight = doc.offsetHeight; // 현재 지정된 객체의 padding값을 포함한 높이.(눈에보이는 높이 그대로..
			$J("#"+this.ifrmId).style.cssText =";height:"+ pageheight+"px";
			$J("#"+this.textAreaId).style.cssText =";height:"+ pageheight+"px";
		}
	},


	/***
	 * 아이프레임을 에디터 모드로 생성 후 이벤트 셋팅 작업을 시작한다. 
	 *
	 * @param ifrmElement 아이프레임 에디터 모드 엘리먼트.
	 */

	iframeEditInitialize : function(ifrmElement)
	{
		var self = this;
		
		addEvent(ifrmElement,"onkeydown",function(event){			
			var obj = (event.target) ? event.target : event.srcElement;
			self.selection = self.getSelection();				
			self.btnState(self.ifrmDoc, self.textAreaId);
		/*	
			//엔터모드일 경우
			if(self.config.enterMode) {
				self.enterKeyChange(event);				
			}
		*/

	
			
			self.historyPush();

		});
		
		addEvent(ifrmElement,"onkeypress",function(){			
			self.selection = self.getSelection();		
			self.btnState(self.ifrmDoc, self.textAreaId);

		});			
		addEvent(ifrmElement,"onmouseup",function(event){		
			event = event ? event : window.event;

			var obj = (event.target) ? event.target : event.srcElement;
			self.selection = self.getSelection();
			//테이블 오른족 마우스 컨텍스트 메뉴 사라지게 하기.
			self.hideContext();
			
			if (obj.tagName.toUpperCase()=="TD" && (event.button==2||event.button==3)) {
				self.contextMenu(event);
			}

			if (obj.tagName.toUpperCase()=="IMG" || obj.tagName=="HR"|| obj.tagName=="TABLE" ) {
				self.btnLock(true);
			}else{
				self.btnLock(false);				
			}

			
			self.pluginFormReset();
			//드롭 다운 메뉴 및 버튼 해제.
			if(self.oldDropDownObj != null){

				var toggleReturn = self.oldDropDownObj.style.display="none";	
				var parentNode = (self.oldDropDownObj.parentNode)? self.oldDropDownObj.parentNode : self.oldDropDownObj.parentElement;

				self.dropDownClassChange(toggleReturn, parentNode);
			}				
			self.btnState(self.ifrmDoc, self.textAreaId);
		});		
	},



	/**
	 * 버튼 이벤트를 등록할 callBack 함수를 만든다.
	 *
	 * @ param eventElement 이벤트 등록할 엘리먼트 객체
	 * @ param commandInfoObj command명령을 내릴 값 모음.
	 * @ param callback 콜백 함수.
	 */
	btnEvent :  function(eventElement,commandInfoObj,callback) {
		try {
			var commandInfo = {element : eventElement,infoObj : commandInfoObj};
			callback(commandInfo);				
		} catch (e) {
			window.alert("버튼 이벤트를 등록하는 와중에 "+e.type+" : "+e.message+"에러가 발생하였습니다");
		}
	},


	/**
	 * css 롤오버 클래스를 등록한다. html모드시에 button객체가 disabled가 되면
	 * 롤어버 이벤트가 실행되지 않게 한다.
	 * @ eventElement 이벤트 등록할 엘리먼트 객체
	 * @ eventName 이벤트 이름
	 * @ className  css 클래스 명.
	 */

	rolloverEvent :  function(eventElement,eventName,className) {
		
		try {
			var self = this;		
			addEvent(eventElement, eventName, function(event){
			
				var btnElement = eventElement.getElementsByTagName("button")[0];
				
				if (btnElement) {
					if (!btnElement.disabled) {
						eventElement.className = className;				
					}					
				}else{
					eventElement.className = className;								
				}

			}) ;
		
		} catch (e) {
			window.alert("롤오버 이벤트를 등록하는 와중에 "+e.type+" : "+e.message+"에러가 발생하였습니다");
		}
	},

	/**
	 * 이벤트 진행시 이루어지는 버블링을 취소한다.
	 * @param event 이벤트 객체.
	 */

	cancelEventBubbling : function (event) {
		var eventReference = event ? event : window.event;
		if (eventReference.stopPropagation) {
			eventReference.stopPropagation();
		} else {
			eventReference.cancelBubble = true;
		}
	},

	/**
	 * selection 객체를 가져온다. 
	 *
	 */
	 
	getSelection : function () {
		var selection;
		var selectionText;
		var selectionhtmlText;
		var selectEl;
		

		if (Browser.type == "MSIE" && Browser.version <= 9) {
			selection = this.ifrmDoc.selection.createRange();
			selectionText = this.ifrmDoc.selection.createRange().text;
			selectionhtmlText = this.ifrmDoc.selection.createRange().htmlText;
		} else {
			var selectionObj = $J("#" + this.textAreaId, "ifrm").contentWindow().getSelection();
			selection = selectionObj;
			selectionText = selectionObj.toString();
			if (selection.rangeCount) { 
	            var container = document.createElement("div"); 
	            for (var i = 0, len = selection.rangeCount; i < len; ++i) { 
	                container.appendChild(selection.getRangeAt(i).cloneContents()); 
	            } 
	            selectionhtmlText = container.innerHTML; 
	        } 
		}
		return {
					selection: selection,
					selectionText: selectionText,
					htmltext: selectionhtmlText,
					selectEl : selectEl
				};
	},

	/**
	 * IE 같은 경우 Iframe 영역 외의 화면에서 마우스 액션이 실행 될 경우 Iframe의 포커스 위치를 잃어버리는  
	 * 현상이 발생하여 selection객체를 통하여 iframe에서 마지막으로 위차한 마우스 포커스 위치를 찾음.
	 *
	 */
	 
	getFocusPosition : function () {

		if (Browser.type == "MSIE" && Browser.version <= 9) {
			this.ifrmContent.focus();  
			if (this.selection != null && this.selection.selectionText.length > 0) {
				this.selection.selection.select();
			} else {

				if(this.selection == null){
					this.selection = this.getSelection();
				}
				this.selection.selection.collapse(false);			
				this.selection.selection.select();		
			}

		} else if (Browser.type != "MSIE" ) {
			
				if (Browser.type == "Chrome" ) {
					this.ifrmContent.contentWindow.document.getElementsByTagName("body")[0].focus();
				}else{
					  this.ifrmContent.focus();  					
				}
		}
	},


	/**
	 * 드롭다운 메뉴를 클릭 했을 때 이전에 열었던 드롭다운 레이어를 사라지게 한다. 
	 * textAreaId 값을 넣지 않을 때 반환값 없이 드롭다운창을 닫히게 한다.
	 *
	 * @param textAreaId 에디터 id
	 * @param afterName 드롬다운 레이어 아이디를 완성하기 위해 textAreaId 뒤에 붙는 이름. ex)textAreaId + "-selectFontFamilyDropDown-div"
	 * @return element.style.display 드롭다운이 Block 인지 none 값 인지. 반환.
	 */
	viewToggle : function (textAreaId) {

		
		if (textAreaId !== undefined) {

			var viewToggleObj = $J( "#" + textAreaId);		  
			var oldToggleObj = null;
			
			if (this.oldDropDownId !=null) {			
				oldToggleObj  = $J( "#" + this.oldDropDownId);		
			}
	
			if (viewToggleObj.style.display == "none" || viewToggleObj.style.display == "") {
				//IE6,7에서 아이프레임을 불러오고 DISPLAY를 BLOCK 하면 화면을 못ㅅ그리는 버그가 있어서 새로고침
				if (Browser.type=="MSIE" && Browser.version < 8) {
					if (oldToggleObj !=null &&this.oldDropDownObj.getElementsByTagName("iframe")[0]) {
						this.oldDropDownObj.getElementsByTagName("iframe")[0].contentWindow.document.location.reload();
					}	
				}

				viewToggleObj.style.display = "block";

				if (oldToggleObj !=null &&  (textAreaId) != this.oldDropDownId) 
				{ 
					oldToggleObj.style.display = "none";
				}
				
			} else {
				viewToggleObj.style.display = "none";
				if (oldToggleObj !=null &&  (textAreaId) != this.oldDropDownId) 
				{ 
					oldToggleObj.style.display = "block";
				}
			}
			
			this.pluginFormReset();

			this.oldDropDownId = textAreaId;
			this.oldDropDownObj = viewToggleObj;

			return viewToggleObj.style.display;		    
			
		}else{
			
			if(this.oldDropDownObj != null && this.oldDropDownBtn != null){
				var returnVal =  this.oldDropDownObj.style.display="none";	
				this.dropDownClassChange(returnVal, this.oldDropDownBtn);
			}
		}
	},

	/**
	* 
	* dropdown 버튼 클래스를 교체한다.
	* 드롭다운 레이어가 활성화 되었을 때 버튼은 누름 효과로 변경
	*
	* @param toggleReturn 드롭다운 레이어 block 여부
	* @param classObj 클래스 변경할 엘리먼트
	*/

	dropDownClassChange : function (toggleReturn,classObj) 
	{
			
		if (toggleReturn == "block") {
			
			if (classObj.className.indexOf("-on") == -1) {
				classObj.className = classObj.className.replace("-off", "-on");
			}
			
			if (this.oldDropDownBtn != null) {
				if (this.oldDropDownBtn.className.indexOf("-off") == -1) {
					this.oldDropDownBtn.className = this.oldDropDownBtn.className.replace("-on", "-off");
				}				
			}
			
		}else{
					
			if (classObj.className.indexOf("-off") == -1) {
				classObj.className =  classObj.className.replace("-on", "-off");
			}		    	
		}
		//이전에 저장된 btn span 객체의 아이디가 현재 아이디와 같다면 old변수에 저장하지 않는다.
		if (this.oldDropDownBtn != null && this.oldDropDownBtn.getAttribute("id") == classObj.getAttribute("id")) {
			this.oldDropDownBtn = null;
		}else{
			this.oldDropDownBtn = classObj;
		}
	},


	/**
	 * 에디터 모드에서 글 작성 및 명령어 버튼으로 편집 명령어를 실행 할 때
	 * 현재 적용된 편집 명령어 버튼을 활성화 한다. 
	 * 
	 * @param classObj 버튼 클래스 엘리먼트
	 * @param state 활성화 여부 boolean 값
	 */
	btnClassChange : function (classObj,state) 
	{	
		if (state !== undefined) {
			if (state == true && classObj.className.indexOf("-on") == -1 || state == true && classObj.className.indexOf("-on")  != -1) {
				classObj.className =  (classObj.className.indexOf("-on") == -1) ? classObj.className.replace("-off", "-on") : classObj.className;
			}else{
				classObj.className =  classObj.className.replace("-on", "-off");
			}				
		}else{
			if (classObj.className.indexOf("-on") == -1) {
				classObj.className = classObj.className.replace("-off", "-on");

			}else{
				classObj.className =  classObj.className.replace("-on", "-off");
			}
		}
	},

	/**
	* 버튼에 onclick 이벤트를 등록한다.
	* DropDown 명렁은 이곳에서 처리한다.
	*
	*/

	setToolBarEvent : function()
	{
		var self = this;
		
		var toolBarInfo = this.toolBarInfo;
		for ( var commandName in toolBarInfo) {
			
			if (!this.config.hideButton[commandName]) {		
			
				var btnEvtId = this.getBtnId(commandName);
				var eventElement  = document.getElementById(btnEvtId);
				
				var infoObj = {commandName:commandName};
				
				switch (commandName) {
				case "FormatBlock":  
					this.btnEvent(eventElement,null,function(el){					
						addEvent(el.element,"onclick", function(event){
							self.selectFormatBlock(event);
						}) ;
					});
							
				break;						
				case "FontFamily":  
					this.btnEvent(eventElement,null,function(el){					
						addEvent(el.element,"onclick", function(event){
							self.selectFontFamily(event);
						}) ;
					});
							
				break;
				case "FontSize":          	
					this.btnEvent(eventElement,null,function(el){					
						addEvent(el.element,"onclick", function(event){
							self.selectFontSize(event);
						}) ;
					});
				break;
				case "ForeColor":          	
					this.btnEvent(eventElement,null,function(el){					
						addEvent(el.element,"onclick", function(event){
							self.selectForeColor(event);
						}) ;
					});
				break;
				
				case "BackColor":          	
					this.btnEvent(eventElement,null,function(el){					
						addEvent(el.element,"onclick", function(event){
							self.selectBackColor(event);
						}) ;
					});
				break;
				
				case "CreateLink":          	

					this.btnEvent(eventElement,null,function(el){					
						addEvent(el.element,"onclick", function(event){
							self.popupCreateLink(event);
						}) ;
					});
				break;
				case "Quotation":          	

					this.btnEvent(eventElement,null,function(el){					
						addEvent(el.element,"onclick", function(event){
							self.popupQuotation(event);
						}) ;
					});
				break;		
				
				case "Emoticon":          	

					this.btnEvent(eventElement,null,function(el){					
						addEvent(el.element,"onclick", function(event){
							self.popupEmoticon(event);
						}) ;
					});
				break;					
				case "Scharacter":      	
					this.btnEvent(eventElement,null,function(el){					
						addEvent(el.element,"onclick", function(event){
							self.popupScharacter(event);
						}) ;
					});
				break;	
				case "Table":          
					this.btnEvent(eventElement,null,function(el){					
						addEvent(el.element,"onclick", function(event){
							self.popupTable(event);
						}) ;
					});
				break;	
				case "Picture":          
					this.btnEvent(eventElement,null,function(el){					
						addEvent(el.element,"onclick", function(event){
							self.popupPicture(event);
						}) ;
					});
				break;		
				case "Flash":          
					this.btnEvent(eventElement,null,function(el){					
						addEvent(el.element,"onclick", function(event){
							self.popupFlash(event);
						}) ;
					});
				break;						
				case "Preview":          
					this.btnEvent(eventElement,null,function(el){					
						addEvent(el.element,"onclick", function(event){
							self.popupPreview(event);
						}) ;
					});
				break;						
				default : 				  

					//롤오버 이미지를 등록한다. true이면 버튼 클릭 효과.		  
					if (toolBarInfo[commandName][5]) {
			
		  				var btnSpanId = this.getBtnSpanId(commandName);
						var btnSpanElement  = document.getElementById(btnSpanId);
					
						this.rolloverEvent(btnSpanElement, "onmousedown", toolBarInfo[commandName][2]);
						this.rolloverEvent(btnSpanElement, "onmouseup", toolBarInfo[commandName][1]);						
					}
				  
				   this.btnEvent(eventElement,infoObj,function(el){					
						addEvent(el.element,"onclick", function(event){
							self.execCommand(event, el.infoObj.commandName, null);			
						}) ;
					});
	
				break;
				}   	
			}
		}
	},
	
	/**
	 * 에디터 모드에 현재 적용되어 있는 편집 이벤트를 체크하여 버튼을 활성 및 비활성 버튼으로 변경
	 *
	 * @param ifrmDoc 아이프레임..에디터 모드 엘리먼트
	 * @param textAreaId textarea아이디
	 */
	btnState :  function (ifrmDoc,textAreaId) 
	{
		try {

			for (var mName in this.toolBarInfo) {
				
				if (!this.config.hideButton[mName]) {			
				
					var active = false;
					var regx = /FormatBlock|FontFamily|FontSize|ForeColor|BackColor|Outdent|Indent|CreateLink|UnLink|Htmlmode|NewDocument|Undo|Redo|Cut|Paste|Copy|SelectAll|SubScript|SuperScript|RemoveFormat|Quotation|Emoticon|Scharacter|Table|Picture|Flash|Inserthorizontalrule|PrintLine|Preview|Print|FullScreen/;
					if (!regx.test(mName)) {
						active = this.ifrmDoc.queryCommandState(mName);
					}
					var element = $J("#"+textAreaId+"-"+mName+"-span");
	
					switch (mName) {
					case "FormatBlock":
						var commandParam =	 this.ifrmDoc.queryCommandValue("FormatBlock");
							if (commandParam != "" && commandParam != null) {
								if (Browser.type !="MSIE") {
									commandParam = this.formatblockInfo[commandParam.toLowerCase()];	
									if (!commandParam) {
										commandParam = "스타일";
									}
								}
								
								if (commandParam =="표준") {
									commandParam="기본 문단";
								}
								
								if (commandParam =="서식 있음") {
									commandParam="Formatted";
								}
								
								$J("#"+this.getBtnId("FormatBlock")).innerHTML=commandParam;
							}else{
								$J("#"+this.getBtnId("FormatBlock")).innerHTML="스타일";						
							}
							
						break;				
					case "FontFamily":
						var commandParam = this.ifrmDoc.queryCommandValue("FontName");
						if (commandParam != "" && commandParam != null) {
							$J("#"+this.getBtnId("FontFamily")).innerHTML=commandParam.substr(0,8);	
						}else{
							$J("#"+this.getBtnId("FontFamily")).innerHTML="글꼴";						
						}
						
						break;
					case "FontSize":
						var commandParam =	 this.ifrmDoc.queryCommandValue("FontSize");
							if (commandParam != "" && commandParam != null) {
								commandParam = this.fontSizeInfo[commandParam];
								$J("#"+this.getBtnId("FontSize")).innerHTML=commandParam;
							}else{
								$J("#"+this.getBtnId("FontSize")).innerHTML="10pt";						
							}
							
						break;
					case "ForeColor":
						var commandParam =	 this.ifrmDoc.queryCommandValue("ForeColor");
							
						break;
					case "BackColor":
						var commandParam =	 this.ifrmDoc.queryCommandValue("ForeColor");
							
						break;
					case "Htmlmode":
						
						break;
					case "Quotation":
						
						break;		
					case "Scharacter":
						
						break;	
					default:							
							if (active) {this.btnClassChange(element,active);} else{this.btnClassChange(element,active);}
					
						break;
					}   
				}
			}
		} catch (e) {
			if (e.message.indexOf("NS_ERROR_INVALID_POINTER") != -1) {
				this.getFocusPosition();
			}else{				
				window.alert("BtnState 를 진행하는 중에 "+e.type+" : "+e.message+"에러가 발생하였습니다");
			}
		}
	},
	
	/**
	 * 특정태그가 감지되면 일부 메뉴를 제외한 나머지 메뉴는 잠군다.
	 * @param boolean 버튼을 회색바탕으로 disabled 를 실행할지 결정한다. true이면 버튼잠금.
	 * @param menuName 일부 메뉴를 잠금 해제 할 경우 사용.
	 * @returns
	 */
	
	btnLock :function (boolean,menuName){	
		
		var regx = "";
	
		if (menuName =="Htmlmode") {
			regx= /Htmlmode/;		
		}else{
			regx = /Htmlmode|Justifyleft|Justifycenter|Justifyright|Justifyfull/;			
		}		

		if (boolean) {
			var i = 0;

			for ( var id in this.toolBarInfo) {
				if (!this.config.hideButton[id]) {		
					if (!regx.test(id)) {
						var btnId = this.getBtnId(id);
						var spanId = this.getBtnSpanId(id);
						$J("#"+btnId).disabled = true;
						$J("#"+btnId).style.cssText=";cursor: default;";
						$J("#"+spanId).className = this.toolBarInfo[id][3];
					}
					i++;		
				}
			}			
		}else{
			
			var i = 0;

			for ( var id in this.toolBarInfo) {
				if (!this.config.hideButton[id]) {		
					if (!regx.test(id)) {
						var btnId = this.getBtnId(id);
						var spanId = this.getBtnSpanId(id);				
						$J("#"+btnId).disabled = false;
						$J("#"+btnId).style.cssText=";cursor: pointer;";					
						$J("#"+spanId).className = this.toolBarInfo[id][1];
					}
					i++;								
				}		
			}
		}
	},
	/**
	 * 메뉴버튼을 클릭하면 해당 이벤트에 대한 실행은 이곳에서 이루어 진다.
	 *
	 * @param event 이벤트객체
	 * @param commandName 명령어
	 * @param commandParam 명령어에 필요한 인자 값   ex) FontFamily 나 FontSize 등과 같이 인자값이 필요한 경우.
	 */		
	execCommand : function (event, commandName, commandParam) {
		event = event ? event : window.event;
		
		this.btnDisabledCancel(event);		
		this.cancelEventBubbling(event);

		try {
				switch (commandName) {
					case "FormatBlock":            			  this.formatblock(event, commandParam);                break;
					case "FontFamily":            			  this.fontFamily(event, commandParam);                break;
					case "FontSize":             		 		  this.fontSize(event, commandParam);                break;
					case "ForeColor":                          this.foreColor(event,commandParam);               break;
					case "BackColor":                      	  this.getSelection();    this.backColor(event,commandParam);               break;
					case "CreateLink":             		 	  this.getSelection();    this.createLink(event,commandParam);              break;
					case "UnLink":             		 		  this.getSelection();    this.unLink(event,commandParam);              break;
					case "Htmlmode":               		  this.htmlmode(event);                break;
					case "NewDocument":     			  this.newDocument(event);                break;
					case "Undo":               				  this.undo(event);                break;
					case "Redo":               		 		  this.redo(event);                break;
					case "Quotation":               		 	  this.quotation(event,commandParam);                break;
					case "Emoticon":               		 	  this.emoticon(event,commandParam);    	               break;
					case "Scharacter":               		 	  this.scharacter(event,commandParam);    	               break;
					case "Table":               		 		  this.table(event,commandParam);    	               break;
					case "Picture":               		 		  this.picture(event,commandParam);    	               break;
					case "Flash":               		 		  this.flash(event,commandParam);    	               break;
					case "PrintLine":               		 	  this.printLine(event,commandParam);                break;
					case "Print":               		 	 	  if(Browser.type=="MSIE" && Browser.version < 8){this.editCommand(event, "print", null);}else{this.print(event,commandParam);}                break;
					case "FullScreen":           		 	 	  this.fullscreen(event);               break;
					case "Preview":           		 	 	  this.preview(event);               break;
					default : 
				

					this.viewToggle();				
					this.editCommand(event,commandName,commandParam); this.btnState(this.ifrmDoc, this.textAreaId);
		
				break;
				}            

		} catch (e) {
			window.alert(e.message+ " : 에디터를 조작할 수 있는 함수나 명령어에 문제가 발생하였습니다.");
			return;
		}
	},

	/**
	 * 다른 조작이 필요하지 않는 기본 명령어들을 실행 한다.
	 *
	 * @param event 엘리먼트이벤트 객체
	 * @param commandName  명렁어.
	 * @commandParam commandName 명령어에 필요한 인자 값.
	 */
	editCommand : function (event, commandName, commandParam) {
		this.getFocusPosition();
		
		if ((commandName == "Cut"|| 
			commandName == "Paste"||
			commandName == "Copy") && Browser.type != "MSIE") {
		
			if(commandName == "Cut"){
				window.alert("브라우저의 보안설정 때문에 잘라내기 기능을 실행할 수 없습니다. 키보드 명령을 사용하십시요. (Ctrl+X).");
			}else if(commandName == "Copy"){
				window.alert("브라우저의 보안설정 때문에 복사하기 기능을 실행할 수 없습니다. 키보드 명령을 사용하십시요. (Ctrl+C).");			
			}else if(commandName == "Paste"){
				window.alert("브라우저의 보안설정 때문에 복사하기 기능을 실행할 수 없습니다. 키보드 명령을 사용하십시요. (Ctrl+V).");		
			}			
			return;			
		}else{
					
			if (!commandParam) {commandParam = null;}	
			this.ifrmDoc.execCommand(commandName, false, commandParam);		
		}
		

		
	},
	
	
	
	/**
	* Table 오른쪽 마우스 클릭스 contextMenu 출력
	* @param event 이벤트 객체
	*/

	contextMenu : function (event) 
	{
		event = event ? event : window.event;
		var obj = (event.target) ? event.target : event.srcElement;
		
		var layerId = this.getLayerId("contextMenu","Layer");

		var contextMenu = $J("#"+layerId);

		if (!contextMenu) {
			new this.plugin.ContextMenu(this);
		}
		
		try {			
			contextMenu = $J("#"+layerId);
			
			if (contextMenu.style.display=="none") {
				contextMenu.style.display="block";
			}
			
			this.clickTableObj = obj.parentNode.parentNode;
			while (this.clickTableObj != null && this.clickTableObj.tagName.toLowerCase() != "table") this.clickTableObj = this.clickTableObj.parentNode;
			this.currRowIndex = (obj.parentNode.tagName.toLowerCase()=="tr")? obj.parentNode.rowIndex : null;
			this.currColIndex  = (obj.tagName.toLowerCase()=="td")? obj.cellIndex : null;
			
			
			if (this.clickTableObj === null || this.currRowIndex === null  || this.currColIndex === null) {
				window.alert("테이블 선택이 올바르지 않습니다.");
				return;
			}		
			
			var toolBarOffset = 	this.elementOffset($J("#"+this.textAreaId,"cTable").getElementsByTagName("tr")[0]).height;
			
			contextMenu.style.marginTop = (toolBarOffset+event.clientY-10)+"px";
			contextMenu.style.marginLeft = (event.clientX-10)+"px";
			//마우스 우측 버튼 눌렀을 때 기본 contextmenu 실행을 해제 한다.
			if (Browser.type=="Firefox") {
				contextMenu.addEventListener("contextmenu", function(event){event.preventDefault();}, false);
			}else{
				contextMenu.oncontextmenu = function (evt) {return false;};					
			}

			

		} finally {
			obj = null;
		}		
	},
	
	/**
	 * 테이블 행 삽입
	 * 
	 * @param insertDiv 삽입 방향.
	 */
	addRow : function(insertDiv){
		
		if(this.currRowIndex != null) {
			var rowLength = this.clickTableObj.rows.length;
			var colLength = this.clickTableObj.rows[this.currRowIndex].cells.length;
			var insertRowIdx = (insertDiv == "bottomRow")?  this.currRowIndex+1 : this.currRowIndex;

			var objRow	= this.clickTableObj.insertRow(insertRowIdx);	
			
			var objCell;
			for(var i = 0; i < colLength; i++) {
				objCell = objRow.insertCell(i);
				objCell.style.cssText = this.clickTableObj.rows[(insertDiv == "bottomRow")? insertRowIdx -1 : insertRowIdx+1].cells[i].style.cssText;
			}
		}
		this.hideContext();
	},
	
	/**
	 * 테이블 칸 삽입
	 * 
	 * @param insertDiv 삽입 방향.
	 */
	addCell : function(insertDiv){
		
		if(this.currRowIndex != null && this.currColIndex != null) {
			var rowLength = this.clickTableObj.rows.length;
			var colLength = this.clickTableObj.rows[this.currRowIndex].cells.length;
			var insertColIdx = (insertDiv == "rightCol")?  this.currColIndex+1 : this.currColIndex;
			
			var objCell;
			
			for(var i = 0; i < rowLength; i++) {
				objCell = this.clickTableObj.rows[i].insertCell(insertColIdx);
				objCell.style.cssText = this.clickTableObj.rows[i].cells[(insertDiv == "rightCol")? insertColIdx -1 : insertColIdx+1].style.cssText;
			}
		}
		this.hideContext();
	},
	
	/**
	 * 테이블행 지우기
	 * 
	 * @param insertDiv 삽입 방향.
	 */	
	deleteRow : function(){
	
		if(this.currRowIndex != null ) {
			var rowLength = this.clickTableObj.rows.length;
			if(rowLength < 2) {
				window.alert("삭제 할 행이 더 이상 없습니다.");
			} else {
				this.clickTableObj.deleteRow(this.currRowIndex);	
			}
		}
		this.hideContext();		
	},
	
	/**
	 * 테이블 칸 지우기
	 * 
	 */	
	deleteCol : function(){
	
		if(this.currRowIndex != null && this.currColIndex != null) {
			var rowLength = this.clickTableObj.rows.length;
			var colLength = this.clickTableObj.rows[0].cells.length;

			if(colLength < 2) {
				window.alert("삭제 할 칸이 더 이상 없습니다.");
			} else {
				for(var i = 0; i < rowLength; i++) {
					this.clickTableObj.rows[i].deleteCell(this.currColIndex);
				}
			}
		}		
		
		this.hideContext();

	},
	
	
	/**
	 * 테이블 칸 병합
	 * @param mergeDiv 병합.
	 */	
	
	mergeCell : function(mergeDiv){
		
		if(this.currRowIndex != null && this.currColIndex != null) {

			var rowLength = this.clickTableObj.rows.length;
			var colLength = this.clickTableObj.rows[0].cells.length;
			var mergeRowSpan = this.clickTableObj.rows[this.currRowIndex].cells[this.currColIndex].rowSpan;
			var mergeColSpan = this.clickTableObj.rows[this.currRowIndex].cells[this.currColIndex].colSpan;
			
			if (mergeDiv == "rightCellMerge" && this.currColIndex+mergeColSpan >= colLength ) {
				window.alert("더이상 병합 할 열이 없습니다.");
				this.hideContext();
				return;
			}
			if (mergeDiv == "bottomCellMerge" && this.currRowIndex+mergeRowSpan >= rowLength ) {
				window.alert("더이상 병합 할 행이 없습니다.");
				this.hideContext();
				return;
			}
			
			if (mergeDiv == "bottomCellMerge"){
				
				var currCell = this.clickTableObj.rows[this.currRowIndex].cells[this.currColIndex];
				var deleteCellRow = this.clickTableObj.rows[this.currRowIndex+currCell.rowSpan];
				var deleteCellRowSpan = deleteCellRow.cells[this.currColIndex].rowSpan;
				
				
			
				if (currCell.colSpan > 1) {
					window.alert("열 병합 후 같은 행 병합은 지원 하지 않습니다.");
					this.hideContext();
					return;
				}
			
				if (this.clickTableObj.rows[this.currRowIndex+1].cells[this.currColIndex].colSpan > 1) {
					window.alert("열 병합으로 인하여 행 병합이 지원하지 않습니다.");
					this.hideContext();
					return;
				}
				
				var currClone = currCell.cloneNode(true);
				var mergeClone = deleteCellRow.cells[this.currColIndex].cloneNode(true);
				
				deleteCellRow.cells[this.currColIndex].innerHTML="";
				deleteCellRow.deleteCell(this.currColIndex);
				currCell.rowSpan = currCell.rowSpan+deleteCellRowSpan;
		
				currCell.innerHTML = currClone.innerHTML +=mergeClone.innerHTML;

				
			}else{
				
				var currRows = this.clickTableObj.rows[this.currRowIndex];
				var currCell = currRows.cells[this.currColIndex];
				var deleteCellCol = currRows.cells[this.currColIndex+1];
				
				if (currCell.rowSpan > 1) {
					window.alert("행 병합 후 같은 열 병합은 지원 하지 않습니다.");
					this.hideContext();
					return;
				}
				
				if (deleteCellCol.rowSpan > 1) {
					window.alert("행 병합으로 인하여 열 병합이 지원하지 않습니다.");
					this.hideContext();
					return;
				}

				var currClone = currCell.cloneNode(true);
				var mergeClone = deleteCellCol.cloneNode(true);
				currCell.innerHTML="";
				deleteCellCol.innerHTML="";
				currCell.colSpan = currCell.colSpan +deleteCellCol.colSpan;
				currRows.deleteCell(this.currColIndex+1);
				
				currCell.innerHTML = currClone.innerHTML +=mergeClone.innerHTML;
			}
		}
		this.hideContext();
	},
	
	mergeCancel : function (){		
		
		var currCol = this.clickTableObj.rows[this.currRowIndex].cells[this.currColIndex];
		
		var colSpan =currCol.colSpan;
		var rowSpan =currCol.rowSpan;
		
		if (colSpan > 1 || rowSpan >1) {
			
			objCell = this.clickTableObj.rows[this.currRowIndex].deleteCell(this.currColIndex);

			
			for(var i = 0; i < rowSpan; i++) {
				for(var j = 0; j < colSpan; j++) {
					
					var tempContent = currCol.innerHTML;
					var objCell = this.clickTableObj.rows[this.currRowIndex+i].insertCell(this.currColIndex+j);
					if(i ==0 && j == 0) {
						objCell.innerHTML					= tempContent;
					}
					objCell.style.cssText = this.clickTableObj.rows[this.currRowIndex -1].cells[this.currColIndex].style.cssText;
				}
			}
		}else{
			window.alert("병합된 셀이 아닙니다.");
		}
		
	},
	
	
	/**
	 * 컨텍스트 메뉴를 없앤다.
	 * 
	 */
	
	hideContext : function(){
		
		var layerId = this.getLayerId("contextMenu","Layer");
		
		if ($J("#"+layerId)) {
			var contextMenu = $J("#"+layerId);
			contextMenu.style.display = "none";
			contextMenu.style.marginTop = "0";
			contextMenu.style.marginLeft = "0";				
		}
		
	},
	
	/**
	* ToolBar에 등록된 [스타일]  버튼 을 누르면 DropDown 레이어 출력.
	* @param event 이벤트 객체
	*/

	selectFormatBlock : function (event) 
	{

		this.btnDisabledCancel(event);
	
		this.getFocusPosition();
		var dropDownId = this.getLayerId("FormatBlock","DropDown");

		var obj = $J("#"+dropDownId);

		if (!obj) {
			new this.plugin.FormatBlock(this);
		}
		
		try {			
			obj = $J("#"+dropDownId);
			var toggleReturn =  this.viewToggle(dropDownId);    
			var parentNode = (obj.parentNode)? obj.parentNode : obj.parentElement;
			this.dropDownClassChange(toggleReturn, parentNode);    		
		} finally {
			obj = null;
		}		
	},

	/**
	*  [스타일] DropDown 레이어 에서 실행되는 명령 함수.
	* @param event 이벤트 객체
	* @param commandParam 명령값.
	*/
	
	formatblock : function (event, commandParam) 
	{
		this.getFocusPosition();
		var dropDownId =this.getLayerId("FormatBlock","DropDown");
		
		var formatTag  = (Browser.type=="MSIE")?"<"+commandParam+">":commandParam;

		this.ifrmDoc.execCommand("removeFormat", false, null);
		
		if (Browser.type=="Firefox" && commandParam =="pre") {
			this.ifrmDoc.execCommand("FontName", false, "Courier New");
		}
		this.ifrmDoc.execCommand("formatblock", false, formatTag);
		
		commandParam = this.formatblockInfo[commandParam];		

		$J("#"+this.getBtnId("FormatBlock")).innerHTML=commandParam.substr(0,8);	

		var id = this.getLayerId("FormatBlock","DropDown");		
		this.pluginClose(id);
	},
		
		
	
	/**
	* ToolBar에 등록된 [글꼴]  버튼 을 누르면 DropDown 레이어 출력.
	* @param event 이벤트 객체
	*/

	selectFontFamily : function (event) 
	{

		this.btnDisabledCancel(event);
	
		this.getFocusPosition();
		var dropDownId = this.getLayerId("FontFamily","DropDown");

		var obj = $J("#"+dropDownId);

		if (!obj) {
			new this.plugin.FontFamily(this);
		}
		
		try {			
			obj = $J("#"+dropDownId);
			var toggleReturn =  this.viewToggle(dropDownId);    
			var parentNode = (obj.parentNode)? obj.parentNode : obj.parentElement;
			this.dropDownClassChange(toggleReturn, parentNode);    		
		} finally {
			obj = null;
		}		
	},

	/**
	*  [글꼴] DropDown 레이어 에서 실행되는 명령 함수.
	* @param event 이벤트 객체
	* @param commandParam 명령값.
	*/
	
	fontFamily : function (event, commandParam) 
	{
		this.getFocusPosition();
		var dropDownId =this.getLayerId("FontFamily","DropDown");
		this.ifrmDoc.execCommand("FontName", false, commandParam);
		
		$J("#"+this.getBtnId("FontFamily")).innerHTML=commandParam.substr(0,8);	

		var id = this.getLayerId("FontFamily","DropDown");		
		this.pluginClose(id);
	},
	
	
	/**
	* ToolBar에 등록된 [크기]  버튼 을 누르면 DropDown 레이어 출력.
	* @param event 이벤트 객체
	*/	
	selectFontSize :  function (event) 
	{
		this.btnDisabledCancel(event);
	
		this.getFocusPosition();
		var dropDownId = this.getLayerId("FontSize","DropDown");

		var obj = $J("#"+dropDownId);

		if (!obj) {
			new this.plugin.FontSize(this);
		}
		
		try {			
			obj = $J("#"+dropDownId);
			var toggleReturn =  this.viewToggle(dropDownId);    
			var parentNode = (obj.parentNode)? obj.parentNode : obj.parentElement;
			this.dropDownClassChange(toggleReturn, parentNode);    		
		} finally {
			obj = null;
		}
	},

	/**
	*  [크기] DropDown 레이어 에서 실행되는 명령 함수.
	* @param event 이벤트 객체
	* @param commandParam 명령값.
	*/

	fontSize : function (event, commandParam) 
	{	
		this.getFocusPosition();
		var dropDownId =this.getLayerId("FontSize","DropDown");
		this.ifrmDoc.execCommand("FontSize", false, commandParam);		

		$J("#"+this.getBtnId("FontSize")).innerHTML=this.fontSizeInfo[commandParam].substr(0,8);			
		var id = this.getLayerId("FontSize","DropDown");		
		this.pluginClose(id);
	},
	
	
	/**
	* ToolBar에 등록된 [글자색]  버튼 을 누르면 DropDown 레이어 출력.
	* @param event 이벤트 객체
	*/	
	
	selectForeColor : function (event) 
	{
		this.btnDisabledCancel(event);
	
		this.getFocusPosition();		
		var dropDownId = this.getLayerId("ForeColor","DropDown");

		var obj = $J("#"+dropDownId);

		if (!obj) {
			new this.plugin.ForeColor(this);
		}
		
		try {			
			obj = $J("#"+dropDownId);
			var toggleReturn =  this.viewToggle(dropDownId);    
			var parentNode = (obj.parentNode)? obj.parentNode : obj.parentElement;
			this.dropDownClassChange(toggleReturn, parentNode);    		
		} finally {
			obj = null;
		}
	},
	
	/**
	*  [글자색] DropDown 레이어 에서 실행되는 명령 함수.
	* @param event 이벤트 객체
	* @param commandParam 명령값.
	*/
		
	foreColor : function (event, commandParam) 
	{
		this.getFocusPosition();
		this.ifrmDoc.execCommand("ForeColor", false, commandParam);
		
		var id = this.getLayerId("ForeColor","DropDown");		
		this.pluginClose(id);
	},

	/**
	* ToolBar에 등록된 [배경색]  버튼 을 누르면 DropDown 레이어 출력.
	* @param event 이벤트 객체
	*/	
	
	selectBackColor : function (event) 
	{
		this.btnDisabledCancel(event);
	
		this.getFocusPosition();		
		var dropDownId = this.getLayerId("BackColor","DropDown");

		var obj = $J("#"+dropDownId);

		if (!obj) {
			new this.plugin.BackColor(this);
		}
		
		try {			
			obj = $J("#"+dropDownId);
			var toggleReturn =  this.viewToggle(dropDownId);    
			var parentNode = (obj.parentNode)? obj.parentNode : obj.parentElement;
			this.dropDownClassChange(toggleReturn, parentNode);    		
		} finally {
			obj = null;
		}
	},


	/**
	* [배경색] DropDown 레이어 에서 실행되는 명령 함수.
	* IE 에서는 글자색을 ForeColor로 지정 하지만 FireFox나 Opera 는 문서 배경색을 지정하는 용도로 쓰임.
	* webkit 계열은 HiliteColor 명령을 주면 글자 배경색이 잘 바뀜.
	*
	* @param event 이벤트 객체
	* @param commandParam 명령값.
	*/
	
	backColor : function (event, commandParam) 
	{
	
		this.getFocusPosition();
		var command = "BackColor"; //IE,Chrome,Safari
		if ((Browser.type=="Firefox") ||(Browser.type=="Opera")) {
			command = "HiliteColor"; //FireFox ,Safari		
		}
		this.ifrmDoc.execCommand(command, false, commandParam);	
		
		var id = this.getLayerId("BackColor","DropDown");		
		this.pluginClose(id);

	},
	
	
	
	/**
	* ToolBar에 등록된 [링크]  버튼 을 누르면 팝업 레이어 출력.
	* @param event 이벤트 객체
	*/	
	
	popupCreateLink : function (event) 
	{
		this.btnDisabledCancel(event);
		
		this.getFocusPosition();		
		var popupId = this.getLayerId("CreateLink","Popup");

		var obj = $J("#"+popupId);

		if (!obj) {
			new this.plugin.CreateLink(this);
		}
		
		try {			
			obj = $J("#"+popupId);

			var toggleReturn =  this.viewToggle(popupId);    

			var parentNode = (obj.parentNode)? obj.parentNode : obj.parentElement;
			this.dropDownClassChange(toggleReturn, parentNode);    		


		} finally {
			obj = null;
			
		}
	},


	/**
	* [링크] 링크를 생성한다.
	* 해당 텍스트에 링크를 생성함.
	*
	* @param event 이벤트 객체
	* @param commandParam 명령값.
	*/
	
	createLink : function (event, commandParam) 
	{

		this.getFocusPosition();
		
		var html = "<a href=\""+commandParam.url+"\" ";		
		
		if (commandParam.target) {
			html += "target=\""+commandParam.target+"\" ";
		}
		
		if (commandParam.caption) {
			html += "alt=\""+commandParam.caption+"\" ";
		}
		
		html += ">"+this.selection.selectionText+"</a>";
		
		this.pasteHTML(html);
				
		var id = this.getLayerId("CreateLink","Popup");
		this.pluginClose(id);

	},	
	
	
	/**
	* [링크해제] 링크를 해제한다.
	* 해당 텍스트에 링크를 해제함.
	*
	* @param event 이벤트 객체
	* @param commandParam 명령값.
	*/
	
	unLink : function (event, commandParam) 
	{	
	
		this.viewToggle();
		this.getFocusPosition();
		if (this.selection.selectionText.length == 0){
			window.alert("문자열이 선택되어 있지 않습니다.");
			return;
		}else{			
			
			if (Browser.type=="MSIE") {
				this.selection.selection.execCommand('UnLink');
			}else{
				this.ifrmDoc.execCommand('UnLink', false, null);
			}
		}
	},	
	
	
	/**
	*  [HTML모드] DropDown 레이어 에서 실행되는 명령 함수.
	* @param event 이벤트 객체
	*/
	htmlmode : function (event) 
	{
		var self = this;
		
		var obj = (event.target) ? event.target : event.srcElement;
		var parentNode = (obj.parentNode)? obj.parentNode : obj.parentElement;
		this.btnClassChange(parentNode);
		var iframe = $J("#" + this.textAreaId, "ifrm");
		var iframeObj = iframe.iframe;
		var iframeBody =iframe.body()[0];
		var textAreaObj = $J("#" + this.textAreaId);

		this.viewToggle();		
		
		if (textAreaObj.style.display == "none" || textAreaObj.style.display == "") {
		
			textAreaObj.style.display = "block";
			iframeObj.style.display = "none";

			textAreaObj.value =	this.getContent();
			textAreaObj.focus();
			
			var i = 0;
			for ( var id in this.toolBarInfo) {			
				this.btnLock(true,"Htmlmode");					
			}			

		} else {

			var i = 0;
			
			for ( var id in this.toolBarInfo) {
				this.btnLock(false,"Htmlmode");					
			}
			
			textAreaObj.style.display = "none";
			iframeObj.style.display = "block";
			iframeBody.innerHTML = textAreaObj.value;
			this.ifrmContent.focus();

		}
	},		
	
		
	/**
	* [새 문서] 에디터 내용과 history 데이터를 모두 지운다.
	*
	* @param event 이벤트 객체
	*/
		
	newDocument : function(){

		this.ifrmDoc.getElementsByTagName("body")[0].innerHTML="";		
		this.history = this.history.slice(this.history.length);
		this.historyPos = -1;
		
		this.viewToggle();			
	},
	
	/**
	* [되돌리기] 현재 작성된 글의 이전 내용을 복구한다.
	*
	* @param event 이벤트 객체
	*/
				
	undo : function(){

		this.viewToggle();	    

	    if (this.historyPos > 0) {
	        var txt = this.history[--this.historyPos];
	        if (txt) this.ifrmDoc.getElementsByTagName("body")[0].innerHTML=txt;
	        else++this.historyPos;
	    }else{
	    	window.alert("되돌리기 할  내용이 없습니다.");	    	
	    	return;
	    }	
	},
	
	/**
	* [다시실행] 이전 글을 복구 하였을 때 복구하기 전 상태로 되돌린다.
	*
	* @param event 이벤트 객체
	*/
	redo : function(){
		this.viewToggle();	    
		
	    if (this.historyPos < this.history.length - 1) {
	        var txt = this.history[++this.historyPos];
	        if (txt) this.ifrmDoc.getElementsByTagName("body")[0].innerHTML=txt;
	        else--this.historyPos;
	    }else{
	    	window.alert("다시 실행 할 내용이 없습니다.");
	    	return;	    	
	    }
		
	},
	
	
	/**
	* ToolBar에 등록된 [인용구]  버튼 을 누르면 팝업 레이어 출력.
	* @param event 이벤트 객체
	*/	
	
	popupQuotation : function (event) 
	{
		this.btnDisabledCancel(event);
		
		this.getFocusPosition();		
		var popupId = this.getLayerId("Quotation","Popup");

		var obj = $J("#"+popupId);

		if (!obj) {
			new this.plugin.Quotation(this);
		}
		
		try {			
			obj = $J("#"+popupId);

			var toggleReturn =  this.viewToggle(popupId);    

			var parentNode = (obj.parentNode)? obj.parentNode : obj.parentElement;
			this.dropDownClassChange(toggleReturn, parentNode);    		


		} finally {
			obj = null;
			
		}
	},	
	
	
	/**
	* [인용구]인용구 서식을 추가한다.
	*
	* @param event 이벤트 객체
	*/
	
	quotation : function(event,commandParam){
		
		this.getFocusPosition();
		this.pasteHTML(commandParam);
		
		var id = this.getLayerId("Quotation","Popup");
		this.pluginClose(id);
	},
	
	/**
	* ToolBar에 등록된 [인용구]  버튼 을 누르면 팝업 레이어 출력.
	* @param event 이벤트 객체
	*/	
	
	popupEmoticon : function (event) 
	{
		this.btnDisabledCancel(event);
		
		this.getFocusPosition();		
		var popupId = this.getLayerId("Emoticon","Popup");

		var obj = $J("#"+popupId);

		if (!obj) {
			new this.plugin.Emoticon(this);
		}
		
		try {			
			obj = $J("#"+popupId);

			var toggleReturn =  this.viewToggle(popupId);    

			var parentNode = (obj.parentNode)? obj.parentNode : obj.parentElement;
			this.dropDownClassChange(toggleReturn, parentNode);    		


		} finally {
			obj = null;
			
		}
	},	
	
	
	/**
	* [이모티콘]이모티콘을 추가한다.
	*
	* @param event 이벤트 객체
	*/
	
	emoticon : function(event,commandParam){
		
		this.getFocusPosition();
		this.pasteHTML(commandParam);
		
		var id = this.getLayerId("Emoticon","Popup");
		this.pluginClose(id);
	},
		
	
	
	
	/**
	* ToolBar에 등록된 [인용구]  버튼 을 누르면 팝업 레이어 출력.
	* @param event 이벤트 객체
	*/	
	
	popupScharacter : function (event) 
	{
		this.btnDisabledCancel(event);
		
		this.getFocusPosition();		
		var popupId = this.getLayerId("Scharacter","Popup");

		var obj = $J("#"+popupId);

		if (!obj) {
			new this.plugin.Scharacter(this);
		}
		
		try {			
			obj = $J("#"+popupId);

			var toggleReturn =  this.viewToggle(popupId);    

			var parentNode = (obj.parentNode)? obj.parentNode : obj.parentElement;
			this.dropDownClassChange(toggleReturn, parentNode);    		


		} finally {
			obj = null;
			
		}
	},	
	
	
	/**
	* [특수문자]특수문자를 추가한다.
	*
	* @param event 이벤트 객체
	*/
	
	scharacter : function(event,commandParam){
		
		this.getFocusPosition();
		this.pasteHTML(commandParam);
		
		var id = this.getLayerId("Scharacter","Popup");
		this.pluginClose(id);
	},
		
	
	
	/**
	* ToolBar에 등록된 [사진]  버튼 을 누르면 팝업 레이어 출력.
	* @param event 이벤트 객체
	*/	
	
	popupPicture : function (event) 
	{
		this.btnDisabledCancel(event);
		
		this.getFocusPosition();		
		var popupId = this.getLayerId("Picture","Popup");

		var obj = $J("#"+popupId);

		if (!obj) {
			new this.plugin.Picture(this);
		}
		
		try {			
			obj = $J("#"+popupId);

			var toggleReturn =  this.viewToggle(popupId);    

			var parentNode = (obj.parentNode)? obj.parentNode : obj.parentElement;
			this.dropDownClassChange(toggleReturn, parentNode);    		


		} finally {
			obj = null;
			
		}
	},	
	
	
	/**
	* [사진]사진을 추가한다.
	*
	* @param event 이벤트 객체
	*/
	
	picture : function(event,commandParam){
		
		this.getFocusPosition();
		this.pasteHTML(commandParam);
		
		var id = this.getLayerId("Picture","Popup");
		this.pluginClose(id);
	},
	
	
	/**
	* ToolBar에 등록된 [사진]  버튼 을 누르면 팝업 레이어 출력.
	* @param event 이벤트 객체
	*/	
	
	popupTable : function (event) 
	{
		this.btnDisabledCancel(event);
		
		this.getFocusPosition();		
		var popupId = this.getLayerId("Table","Popup");

		var obj = $J("#"+popupId);

		if (!obj) {
			new this.plugin.Table(this);
		}
		
		try {			
			obj = $J("#"+popupId);

			var toggleReturn =  this.viewToggle(popupId);    

			var parentNode = (obj.parentNode)? obj.parentNode : obj.parentElement;
			this.dropDownClassChange(toggleReturn, parentNode);    		


		} finally {
			obj = null;
			
		}
	},	
	
	
	/**
	* [테이블]테이블을 추가한다.
	*
	* @param event 이벤트 객체
	*/
	
	table : function(event,commandParam){
		
		this.getFocusPosition();
		this.pasteHTML(commandParam);
		
		var id = this.getLayerId("Table","Popup");
		this.pluginClose(id);
	},
		
	
	/**
	* ToolBar에 등록된 [플래시]  버튼 을 누르면 팝업 레이어 출력.
	* @param event 이벤트 객체
	*/	
	
	popupFlash : function (event) 
	{
		this.btnDisabledCancel(event);
		
		this.getFocusPosition();		
		var popupId = this.getLayerId("Flash","Popup");

		var obj = $J("#"+popupId);

		if (!obj) {
			new this.plugin.Flash(this);
		}
		
		try {			
			obj = $J("#"+popupId);

			var toggleReturn =  this.viewToggle(popupId);    

			var parentNode = (obj.parentNode)? obj.parentNode : obj.parentElement;
			this.dropDownClassChange(toggleReturn, parentNode);    		


		} finally {
			obj = null;
			
		}
	},	
	
	
	/**
	* [플래시]사진을 추가한다.
	*
	* @param event 이벤트 객체
	*/
	
	flash : function(event,commandParam){
		
		this.getFocusPosition();
		this.pasteHTML(commandParam);
		
		var id = this.getLayerId("Flash","Popup");
		this.pluginClose(id);
	},
		
	
	/**
	* ToolBar에 등록된 [미리보기]  버튼 을 누르면 팝업 레이어 출력.
	* @param event 이벤트 객체
	*/	
	
	popupPreview : function (event) 
	{
		this.btnDisabledCancel(event);
		
		this.getFocusPosition();		
		var popupId = this.getLayerId("Preview","Popup");

		var obj = $J("#"+popupId);

		if (!obj) {
			new this.plugin.Preview(this);
		}
		
		try {			
			obj = $J("#"+popupId);

			var toggleReturn =  this.viewToggle(popupId);    

			var parentNode = (obj.parentNode)? obj.parentNode : obj.parentElement;
			this.dropDownClassChange(toggleReturn, parentNode);    		

		} finally {
			obj = null;
			
		}
	},	
	
	
	
	/**
	* [인쇄 나눔선]인쇄를 할때 페이지를 나누는 선.
	*
	* @param event 이벤트 객체
	*/	
	printLine : function(event,commandParam){
		
		this.getFocusPosition();
		this.pasteHTML("<hr style=\"page-break-after: always; border-bottom: #999 1px dotted; border-left: #999 1px dotted; border-top: #999 1px dotted; border-right: #999 1px dotted\"></hr>");
		this.viewToggle();

	},	
	
	/**
	* [인쇄]인쇄 팝업창을 오픈한다.
	*
	* @param event 이벤트 객체
	*/	
	print : function(event,commandParam){
		
		this.getFocusPosition();
		
		var ifrmWindow =$J("#" + this.textAreaId, "ifrm").contentWindow();
		ifrmWindow.print();
		this.viewToggle();
	},
	
	/**
	*  [전체화면모드] DropDown 레이어 에서 실행되는 명령 함수.
	* @param event 이벤트 객체
	*/
	
	fullscreen : function (event) 
	{
		var self = this;
		
		var obj = (event.target) ? event.target : event.srcElement;
		var parentNode = (obj.parentNode)? obj.parentNode : obj.parentElement;
		this.btnClassChange(parentNode);
		
		var wrap  = $J("#"+this.textAreaId,"wrap");
		var cTable  = $J("#"+this.textAreaId,"cTable");
		var ifrm =$J("#"+this.ifrmId);
		var textarea =$J("#"+this.textAreaId);
		
		if (!this.fullMode) {
			
			var container = this.elementOffset(cTable);
			
			this.fullModeElOffset.containerWidth = container.width;
			this.fullModeElOffset.containerHeight = container.height ;
						
			var contentDoc = this.elementOffset(cTable.getElementsByTagName("tr")[2]);
			this.fullModeElOffset.contentWidth = contentDoc.width;
			this.fullModeElOffset.contentHeight = contentDoc.height;
					
			this.fullMode = true;		
			wrap.style.cssText = "position:absolute;display:block;top:0;left:0;height:100%;width:100%;z-index:1000";
			cTable.style.cssText = "position:absolute;top:0;left:0;height:100%;width:100%;z-index:1000";			
			
			contentDoc = this.elementOffset(cTable.getElementsByTagName("tr")[2]);
			
			ifrm.style.cssText ="width:"+contentDoc.width+"px;height:"+contentDoc.height+"px;";
			textarea.style.cssText ="width:"+contentDoc.width+"px;height:"+contentDoc.height+"px;";

		}else{
			this.fullMode = false;
			
			wrap.style.cssText = "";
			cTable.style.cssText = "width:"+this.fullModeElOffset.containerWidth+"px;height:"+(this.fullModeElOffset.containerHeight-(this.fullModeElOffset.containerHeight-this.fullModeElOffset.contentHeight))+"px;";
			ifrm.style.cssText ="width:"+this.fullModeElOffset.contentWidth+"px;height:"+this.fullModeElOffset.contentHeight+"px;";
			textarea.style.cssText ="width:"+this.fullModeElOffset.contentWidth+"px;height:"+this.fullModeElOffset.contentHeight+"px;";
		}
		
		this.viewToggle();				
		this.getFocusPosition();
	}

};


/**
 *  에디터의 플러그인을 등록한다. 본 플러그인은 팝업 및 select 메뉴들을 지칭하며
 *  Select 메뉴는 Layer 팝업 다이얼로그 창은 IFrame으로 작동 한다. 팝업창 경우
 *  확인 및 취소 버튼 이벤트를 관리하며 확인 버튼을 눌렀을 때 JSON값으로 해당 
 *  데이터를 리턴한다. 
 * 
 * 
 * 
 */


JCEditor.prototype.plugin={};


/**
 * 플러그인을 컨트롤 할때 자주사용 되는 DOC객체들을 Json형식으로 반환. 
 *
 */

JCEditor.prototype.plugin.document = function(iframeObj){

	return {
		iframe : iframeObj,
		window : iframeObj.contentWindow,
		doc : iframeObj.contentWindow.document,
		body : iframeObj.contentWindow.document.getElementsByTagName("body")[0],
		form : iframeObj.contentWindow.document.getElementsByTagName("form")[0],
		confirmBtn : iframeObj.contentWindow.document.getElementById("jce_confirm"),
		cancelBtn : iframeObj.contentWindow.document.getElementById("jce_cancel")		
	};
	
};


/**
* Table 에서 보여줄 contextMenu
*
* @param oEditor 에디터 객체.
*/

JCEditor.prototype.plugin.ContextMenu = function(oEditor){
	this.oEditor = oEditor;
	var initialize = (function(obj){ 	
	
		var layerId = obj.oEditor.getLayerId("contextMenu","Layer");
		var layerObj = $J("#"+layerId);
		var tableTr = $J("#"+obj.oEditor.textAreaId,"wrap");
		//var tableTr = document.getElementsByTagName("body")[0];
		if (layerObj) {
		
			btnSpan.removeChild(dropDown);
		} else {
		
			var outlineUl = obj.outlineUl();
			var selectLi = obj.selectLi(outlineUl);
			
			var parentWrapDiv = document.createElement("div");
			parentWrapDiv.setAttribute("id",layerId);
			parentWrapDiv.style.display = "block";
			parentWrapDiv.className="jceditor-contextmenu-div";
			parentWrapDiv.appendChild(selectLi);
			
			tableTr.appendChild(parentWrapDiv);			
		}

	})(this);	
};

JCEditor.prototype.plugin.ContextMenu.prototype={
	
	outlineUl : function(){
		var ulElement = document.createElement("ul");
		ulElement.className="jceditor-contextmenu-ul";
		return ulElement;
	},
	
	
	
	selectLi : function(outlineUl){
		var oEditor = this.oEditor;
		
		var contextMenuInfo ={
				topRow : "윗 쪽에 행 삽입",
				bottomRow : "아래 쪽에 행 삽입",
				leftCol : "왼 쪽에 열 삽입",
				rightCol : "오른 쪽에 열삽입",
				currRowDel : "현재 행 삭제",
				currColDel : "현재 열 삭제",
				rightCellMerge : "오른 쪽셀과 병합",
				bottomCellMerge : "아래 쪽셀과 병합",
				cellMergeCancel : "셀 병합 취소"
		};

		for ( var key in contextMenuInfo) {
			var liElement = document.createElement("li");
			liElement.className="jceditor-selectFont-off";
			
			
			var spanId = oEditor.textAreaId+"-selectFormatBlock-span";
			var span = document.createElement("span");
			var text = document.createTextNode(contextMenuInfo[key]);
			span.appendChild(text);
			//command 이벤트에 등록할 정보를 담은 json 객체.
			var infoObj = {commandName:key };
			//command 이벤트를 등록한다.
			oEditor.btnEvent(liElement,infoObj,function(el){					
				addEvent(el.element,"onclick", function(event){
					
					if (el.infoObj.commandName =="topRow" || el.infoObj.commandName =="bottomRow") {
						oEditor.addRow(el.infoObj.commandName);
					}
					
					if (el.infoObj.commandName =="leftCol" || el.infoObj.commandName =="rightCol") {
						oEditor.addCell(el.infoObj.commandName);
					}			
					
					if (el.infoObj.commandName =="currRowDel") {
						oEditor.deleteRow(el.infoObj.commandName);
					}	
					
					if (el.infoObj.commandName =="currColDel") {
						oEditor.deleteCol(el.infoObj.commandName);
					}		
					
					if (el.infoObj.commandName =="bottomCellMerge" || el.infoObj.commandName =="rightCellMerge") {
						oEditor.mergeCell(el.infoObj.commandName);
					}	
					
					if (el.infoObj.commandName =="cellMergeCancel" ) {
						oEditor.mergeCancel();
					}
									
				}) ;
			});
			
			liElement.appendChild(span);
			
			oEditor.rolloverEvent(liElement, "onmousemove", "jceditor-selectFont-on");
			oEditor.rolloverEvent(liElement, "onmouseout", "jceditor-selectFont-off");

			outlineUl.appendChild(liElement);			
		}	
		return outlineUl;
	}

};

/**
* 글자폰트를 지정하는 드롭다운 플러그인.
*
* @param oEditor 에디터 객체.
*/

JCEditor.prototype.plugin.FormatBlock = function(oEditor){
	this.oEditor = oEditor;
	var initialize = (function(obj){ 	
	
		var dropDownId = obj.oEditor.getLayerId("FormatBlock","DropDown");
		var dropDownObj = $J("#"+dropDownId);
		var btnSpan = $J("#"+obj.oEditor.getBtnSpanId("FormatBlock"));
		if (dropDownObj) {
		
			btnSpan.removeChild(dropDown);
		} else {
		
			var outlineUl = obj.outlineUl();
			var selectLi = obj.selectLi(outlineUl);
			
			var parentWrapDiv = document.createElement("div");
			parentWrapDiv.setAttribute("id",dropDownId);
			parentWrapDiv.style.display = "none";
			parentWrapDiv.appendChild(selectLi);
			
			btnSpan.appendChild(parentWrapDiv);			
		}

	})(this);	
};

JCEditor.prototype.plugin.FormatBlock.prototype={
	
	outlineUl : function(){
		var ulElement = document.createElement("ul");
		ulElement.className="jceditor-selectFormatBlockList-ul";
		return ulElement;
	},
	
	
	selectLi : function(outlineUl){
		var oEditor = this.oEditor;
		var formatblockInfo = oEditor.formatblockInfo;
		for ( var key in formatblockInfo) {
			var liElement = document.createElement("li");
			liElement.className="jceditor-selectFont-off";
			
			
			var spanId = oEditor.textAreaId+"-selectFormatBlock-span";
			var spanElement = document.createElement(key);
			spanElement.setAttribute("id",spanId);
			spanElement.style.cssText = ";font-family:돋움;";	
			var text = document.createTextNode(formatblockInfo[key]);
			//command 이벤트에 등록할 정보를 담은 json 객체.
			var infoObj = {commandName:"FormatBlock",commandValue :key };
			//command 이벤트를 등록한다.
			oEditor.btnEvent(spanElement,infoObj,function(el){					
				addEvent(el.element,"onclick", function(event){
						oEditor.execCommand(event, el.infoObj.commandName, el.infoObj.commandValue);			
				}) ;
			});
			
			spanElement.appendChild(text);
			liElement.appendChild(spanElement);
			
			oEditor.rolloverEvent(liElement, "onmousemove", "jceditor-selectFont-on");
			oEditor.rolloverEvent(liElement, "onmouseout", "jceditor-selectFont-off");

			outlineUl.appendChild(liElement);			
		}	
		return outlineUl;
	}

};




/**
* 글자폰트를 지정하는 드롭다운 플러그인.
*
* @param oEditor 에디터 객체.
*/

JCEditor.prototype.plugin.FontFamily = function(oEditor){
	this.oEditor = oEditor;
	var initialize = (function(obj){ 	
	
		var dropDownId = obj.oEditor.getLayerId("FontFamily","DropDown");
		var dropDownObj = $J("#"+dropDownId);
		var btnSpan = $J("#"+obj.oEditor.getBtnSpanId("FontFamily"));
		if (dropDownObj) {
		
			btnSpan.removeChild(dropDown);
		} else {
		
			var outlineUl = obj.outlineUl();
			var selectLi = obj.selectLi(outlineUl);
			
			var parentWrapDiv = document.createElement("div");
			parentWrapDiv.setAttribute("id",dropDownId);
			parentWrapDiv.style.display = "none";
			parentWrapDiv.appendChild(selectLi);
			
			btnSpan.appendChild(parentWrapDiv);
			
		}

	})(this);	
};

JCEditor.prototype.plugin.FontFamily.prototype={
	
	outlineUl : function(){
		var ulElement = document.createElement("ul");
		ulElement.className="jceditor-selectFontFamilyList-ul";
		return ulElement;
	},
	
	
	selectLi : function(outlineUl){
		var oEditor = this.oEditor;
		var fontFamilyInfo = oEditor.fontFamilyInfo;
		for ( var i = 0 ; i<fontFamilyInfo.length; i++) {
			var liElement = document.createElement("li");
			liElement.className="jceditor-selectFont-off";
			
			
			var spanId = oEditor.textAreaId+"-selectFontFamily-span";
			var spanElement = document.createElement("span");
			spanElement.setAttribute("id",spanId);
			spanElement.style.cssText = ";font-family:"+fontFamilyInfo[i] ;	
			
			var text = document.createTextNode(fontFamilyInfo[i]);
			//command 이벤트에 등록할 정보를 담은 json 객체.
			var infoObj = {commandName:"FontFamily",commandValue :fontFamilyInfo[i] };
			//command 이벤트를 등록한다.
			oEditor.btnEvent(spanElement,infoObj,function(el){					
				addEvent(el.element,"onclick", function(event){
						oEditor.execCommand(event, el.infoObj.commandName, el.infoObj.commandValue);			
				}) ;
			});
			
			spanElement.appendChild(text);
			liElement.appendChild(spanElement);
			
			oEditor.rolloverEvent(liElement, "onmousemove", "jceditor-selectFont-on");
			oEditor.rolloverEvent(liElement, "onmouseout", "jceditor-selectFont-off");

			outlineUl.appendChild(liElement);			
		}	
		return outlineUl;
	}

};

/**
* 글자크기를 지정하는 드롭다운 플러그인.
*
* @param oEditor 에디터 객체.
*/

JCEditor.prototype.plugin.FontSize= function(oEditor){
	
	this.oEditor = oEditor;
	var initialize = (function(obj){ 	
	
		var dropDownId = obj.oEditor.getLayerId("FontSize","DropDown");
		var dropDownObj = $J("#"+dropDownId);
		var btnSpan = $J("#"+obj.oEditor.getBtnSpanId("FontSize"));
		if (dropDownObj) {		
			btnSpan.removeChild(dropDown);
		} else {
		
			var outlineUl = obj.outlineUl();
			var selectLi = obj.selectLi(outlineUl);
			
			var parentWrapDiv = document.createElement("div");
			parentWrapDiv.setAttribute("id",dropDownId);
			parentWrapDiv.style.display = "none";
			parentWrapDiv.appendChild(selectLi);
			
			btnSpan.appendChild(parentWrapDiv);
			
		}

	})(this);	
};

JCEditor.prototype.plugin.FontSize.prototype={
	
	outlineUl : function(){
		var ulElement = document.createElement("ul");
		ulElement.className="jceditor-selectFontSizeList-ul";
		return ulElement;
	},
	
	
	selectLi : function(outlineUl){
		var oEditor = this.oEditor;
		var fontSizeInfo = oEditor.fontSizeInfo;
		for ( var size in  fontSizeInfo) {
			var liElement = document.createElement("li");
			liElement.className="jceditor-selectFont-off";
			
			var spanId = this.textAreaId+"-selectFontSize-span";
			var spanElement = document.createElement("span");
			spanElement.setAttribute("id",spanId);
			spanElement.style.cssText = ";font-size:"+fontSizeInfo[size];
			
			var text = document.createTextNode(fontSizeInfo[size]+" (가나다라)");
			//command 이벤트에 등록할 정보를 담은 json 객체.
			var infoObj = {commandName:"FontSize",commandValue :size};
			//command 이벤트를 등록한다.
			oEditor.btnEvent(spanElement,infoObj,function(el){					
				addEvent(el.element,"onclick", function(event){
						oEditor.execCommand(event, el.infoObj.commandName, el.infoObj.commandValue);	
				}) ;
			});
			spanElement.appendChild(text);
			liElement.appendChild(spanElement);
			
			oEditor.rolloverEvent(liElement, "onmousemove", "jceditor-selectFont-on");
			oEditor.rolloverEvent(liElement, "onmouseout", "jceditor-selectFont-off");
			outlineUl.appendChild(liElement);
			
		}
		return outlineUl;
	}

};

/**
* 글자색을 지정하는 드롭다운 플러그인.
*
* @param oEditor 에디터 객체.
*/
JCEditor.prototype.plugin.ForeColor = function(oEditor){
	
	this.oEditor = oEditor;
	var initialize = (function(obj){ 	
	
		var dropDown = $J("#"+obj.oEditor.getLayerId("ForeColor","DropDown"));
		var btnSpan = $J("#"+obj.oEditor.getBtnSpanId("ForeColor"));
		if (dropDown) {
		
			btnSpan.removeChild(dropDown);
			
		} else {
		
			var table = obj.table();
			var tbody = obj.tbody();
			var top = obj.top();
			tbody.appendChild(top);
	
			var middle = obj.middle(tbody);
			var bottom = obj.bottom();
			middle.appendChild(bottom);
			table.appendChild(middle);
			
	
			var dropDownDiv = document.createElement("div");
			dropDownDiv.className="jceditor-color-palate";
			dropDownDiv.appendChild(table);
			
			var parentWrapDiv = document.createElement("div");
			parentWrapDiv.setAttribute("id",obj.oEditor.getLayerId("ForeColor","DropDown"));
			parentWrapDiv.style.display = "none";
			parentWrapDiv.appendChild(dropDownDiv);
			
			btnSpan.appendChild(parentWrapDiv);
			
		}

	})(this);	
};

JCEditor.prototype.plugin.ForeColor.prototype={
	
	table : function(){
		var tableElement = document.createElement("table");
		return tableElement;
	},
	
	tbody : function(){
		var tableElement = document.createElement("tbody");
		
		return tableElement;
	},
		
	top : function(){
		var topTr = document.createElement("tr");
			  topTr.className="jceditor-top-tr";		
		var td = document.createElement("td");		  
			  td.setAttribute("colSpan","8");
		var textColorDiv = document.createElement("div");	
			 textColorDiv.setAttribute("id",this.oEditor.textAreaId+"-textForeColor-box");
			 textColorDiv.className="jceditor-textcolor-div";
		var textColorbabyDiv = document.createElement("div");	
		var textColorText = document.createTextNode("#000000");	
			 textColorbabyDiv.appendChild(textColorText);	 
			 textColorDiv.appendChild(textColorbabyDiv);
			 td.appendChild(textColorDiv);
			 topTr.appendChild(td);
		return topTr;
	},
	
	middle : function(tbody){
	
		var oEditor = this.oEditor;
		var x = 0;	 
		for ( var i = 0; i < 5; i++) {
			var middleTr = document.createElement("tr");
				 middleTr.className="jceditor-color-tr";		
			
			for (var j = 0; j < this.oEditor.fontcolorpalate.length; j++) {
				var middleTd = document.createElement("td");
				var middlea = document.createElement("a");
				
				var fontColor = this.oEditor.fontcolorpalate[x];
				
				if (Browser.type=="MSIE") {
					middlea.style.cssText=";background-color:"+fontColor;			
				}else{
					middlea.setAttribute("style","background-color:"+fontColor);
				}		   
				middlea.className="jceditor-color-palate off";
				
				var infoObj = {color : fontColor};	
				this.oEditor.btnEvent(middlea,infoObj,function(el){					
					addEvent(el.element,"onmouseover", function(event){
						event = (event.target) ? event.target : event.srcElement;
						event.className = "jceditor-color-palate on";	
						$J("#"+oEditor.textAreaId+"-textForeColor-box").innerHTML="<div>"+el.infoObj.color+"</div>";
						$J("#"+oEditor.textAreaId+"-viewForeColor-box").innerHTML="<font style=color:"+el.infoObj.color+">가나다라마바</font>";	
								
					}) ;
				});
				
			   this.oEditor.btnEvent(middlea,null,function(el){					
					addEvent(el.element,"onmouseout", function(event){
						event = (event.target) ? event.target : event.srcElement;
						event.className = "jceditor-color-palate off";			
					}) ;
				});
				
				

				this.oEditor.btnEvent(middlea,infoObj,function(el){		
					addEvent(el.element,"onclick", function(event){
						oEditor.execCommand(event,"ForeColor",el.infoObj.color);		
						$J("#"+oEditor.textAreaId+"-textForeColor-box").innerHTML="<div>#000000</div>";
						$J("#"+oEditor.textAreaId+"-viewForeColor-box").innerHTML="<font style=\"color:#000000\">가나다라마바</font>";	
					}) ;
				});
				middleTd.appendChild(middlea);
				middleTr.appendChild(middleTd);
				x++;
				
				if (x%8==0) {
					break;
				}
				
				
			}
			tbody.appendChild(middleTr);
		}	 
			return	tbody;

	},
	
	
	bottom : function(){
	
			// 글자 색이 적용된 모습을 보여주는 미리보기 화면.	  
		var bottomTr = document.createElement("tr");
			  bottomTr.className="jceditor-bottom-tr";		
		var bottomTd = document.createElement("td");		  
			  bottomTd.setAttribute("colSpan","8");
		var fieldSet = document.createElement("fieldset");	
		var legend = document.createElement("legend");	
		var legendText = document.createTextNode("미리보기");	
		var textviewDiv = document.createElement("div");	
			 textviewDiv.setAttribute("id",this.oEditor.textAreaId+"-viewForeColor-box");
			 textviewDiv.className="jceditor-textview-div";
		var font = document.createElement("font");	
		var fontText = document.createTextNode("가나다라마바");	
			font.appendChild(fontText);
			textviewDiv.appendChild(font);
			legend.appendChild(legendText);
			fieldSet.appendChild(legend);
			fieldSet.appendChild(textviewDiv);
			bottomTd.appendChild(fieldSet);
			bottomTr.appendChild(bottomTd);
		return bottomTr;
	}
};


/**
* 글자배경색을 지정하는 드롭다운 플러그인.
*
* @param oEditor 에디터 객체.
*/
JCEditor.prototype.plugin.BackColor = function(oEditor){
	
	this.oEditor = oEditor;
	var initialize = (function(obj){ 	
	
		var dropDown = $J("#"+obj.oEditor.getLayerId("BackColor","DropDown"));
		var btnSpan = $J("#"+obj.oEditor.getBtnSpanId("BackColor"));
		if (dropDown) {
		
			btnSpan.removeChild(dropDown);
			
		} else {
		
			var table = obj.table();
			var tbody = obj.tbody();
			var top = obj.top();
			tbody.appendChild(top);
	
			var middle = obj.middle(tbody);
			var bottom = obj.bottom();
			middle.appendChild(bottom);
			table.appendChild(middle);
			
	
			var dropDownDiv = document.createElement("div");
			dropDownDiv.className="jceditor-color-palate";
			dropDownDiv.appendChild(table);
			
			var parentWrapDiv = document.createElement("div");
			parentWrapDiv.setAttribute("id",obj.oEditor.getLayerId("BackColor","DropDown"));
			parentWrapDiv.style.display = "none";
			parentWrapDiv.appendChild(dropDownDiv);
			
			btnSpan.appendChild(parentWrapDiv);
			
		}

	})(this);	
};

JCEditor.prototype.plugin.BackColor.prototype={
	
	table : function(){
		var tableElement = document.createElement("table");
		return tableElement;
	},
	
	tbody : function(){
		var tableElement = document.createElement("tbody");
		
		return tableElement;
	},
		
	top : function(){
		var topTr = document.createElement("tr");
			  topTr.className="jceditor-top-tr";		
		var td = document.createElement("td");		  
			  td.setAttribute("colSpan","8");
		var textColorDiv = document.createElement("div");	
			 textColorDiv.setAttribute("id",this.oEditor.textAreaId+"-textBackColor-box");
			 textColorDiv.className="jceditor-textcolor-div";
		var textColorbabyDiv = document.createElement("div");	
		var textColorText = document.createTextNode("#FFFFFF");	
			 textColorbabyDiv.appendChild(textColorText);	 
			 textColorDiv.appendChild(textColorbabyDiv);
			 td.appendChild(textColorDiv);
			 topTr.appendChild(td);
		return topTr;
	},
	
	middle : function(tbody){
	
		var oEditor = this.oEditor;
		var x = 0;	 
		for ( var i = 0; i < 5; i++) {
			var middleTr = document.createElement("tr");
				 middleTr.className="jceditor-color-tr";		
			
			for (var j = 0; j < this.oEditor.fontcolorpalate.length; j++) {
				var middleTd = document.createElement("td");
				var middlea = document.createElement("a");
				
				var fontColor = this.oEditor.fontcolorpalate[x];
				
				if (Browser.type=="MSIE") {
					middlea.style.cssText=";background-color:"+fontColor;			
				}else{
					middlea.setAttribute("style","background-color:"+fontColor);
				}		   
				middlea.className="jceditor-color-palate off";
				
				var infoObj = {color : fontColor};	
				this.oEditor.btnEvent(middlea,infoObj,function(el){					
					addEvent(el.element,"onmouseover", function(event){
						event = (event.target) ? event.target : event.srcElement;
						event.className = "jceditor-color-palate on";	
						$J("#"+oEditor.textAreaId+"-textBackColor-box").innerHTML="<div>"+el.infoObj.color+"</div>";
						$J("#"+oEditor.textAreaId+"-viewBackColor-box").innerHTML="<font style=\"background-color:"+el.infoObj.color+"\">가나다라마바</font>";	
								
					}) ;
				});
				
			   this.oEditor.btnEvent(middlea,null,function(el){					
					addEvent(el.element,"onmouseout", function(event){
						event = (event.target) ? event.target : event.srcElement;
						event.className = "jceditor-color-palate off";			
					}) ;
				});
				
				

				this.oEditor.btnEvent(middlea,infoObj,function(el){		
					addEvent(el.element,"onclick", function(event){
						oEditor.execCommand(event,"BackColor",el.infoObj.color);			
						$J("#"+oEditor.textAreaId+"-textBackColor-box").innerHTML="<div>#FFFFFF</div>";
						$J("#"+oEditor.textAreaId+"-viewBackColor-box").innerHTML="<font style=\"color:#FFFFFF\">가나다라마바</font>";	
					}) ;
				});
				middleTd.appendChild(middlea);
				middleTr.appendChild(middleTd);
				x++;
				
				if (x%8==0) {
					break;
				}				
			}
			tbody.appendChild(middleTr);
		}	 
			return	tbody;

	},
	
	
	bottom : function(){
	
			// 글자 색이 적용된 모습을 보여주는 미리보기 화면.	  
		var bottomTr = document.createElement("tr");
			  bottomTr.className="jceditor-bottom-tr";		
		var bottomTd = document.createElement("td");		  
			  bottomTd.setAttribute("colSpan","8");
		var fieldSet = document.createElement("fieldset");	
		var legend = document.createElement("legend");	
		var legendText = document.createTextNode("미리보기");	
		var textviewDiv = document.createElement("div");	
			 textviewDiv.setAttribute("id",this.oEditor.textAreaId+"-viewBackColor-box");
			 textviewDiv.className="jceditor-textview-div";
		var font = document.createElement("font");	
		var fontText = document.createTextNode("가나다라마바");	
			font.appendChild(fontText);
			textviewDiv.appendChild(font);
			legend.appendChild(legendText);
			fieldSet.appendChild(legend);
			fieldSet.appendChild(textviewDiv);
			bottomTd.appendChild(fieldSet);
			bottomTr.appendChild(bottomTd);
		return bottomTr;
	}
};



/**
* 링크를 생성한다.
*
* @param oEditor 에디터 객체.
*/

JCEditor.prototype.plugin.CreateLink = function(oEditor){
	this.oEditor = oEditor;
	this.pluginDiv = null;
	var initialize = (function(obj){ 	
	
		var popupId = obj.oEditor.getLayerId("CreateLink","Popup");
		var popupObj = $J("#"+popupId);
		var btnSpan = $J("#"+obj.oEditor.getBtnSpanId("CreateLink"));
		
		obj.pluginDiv = popupId;
		
		if (popupObj) {
		
			btnSpan.removeChild(popupObj);
		} else {
			var pluginPopup = oEditor.pluginIframe(popupId,"하이퍼링크");			
			btnSpan.appendChild(pluginPopup);
			
			oEditor.setPlugin(365,250,"plugin/hyperlink/hyperlink.html",popupId);
			var pluginDoc = $J("#"+popupId.replace("-div","-iframe"));		

			obj.onLoadEvent(pluginDoc);
		}

	})(this);	
};

JCEditor.prototype.plugin.CreateLink.prototype={
	
	onLoadEvent : function (pluginDoc)
	{
	
		var oEditor = this.oEditor;
		var self = this;
	
		addEvent(pluginDoc,"onload",function(event){
				
			var pluginIfrmDoc = oEditor.plugin.document(pluginDoc);		
			addEvent(pluginIfrmDoc.confirmBtn,"onclick", function(event){
			
				if (self.oEditor.selection.selectionText.length == 0){
					window.alert("문자열이 선택되어 있지 않습니다.");
					oEditor.pluginClose(self.pluginDiv);					
					return;
				}

				var valueObject = pluginIfrmDoc.window.editorInsert();
				
				if (valueObject) {
					oEditor.execCommand(event, "CreateLink", valueObject);
					pluginIfrmDoc.window.pluginReset();
					
				}
			});
						
			addEvent(pluginIfrmDoc.cancelBtn,"onclick",function(event){
					pluginIfrmDoc.window.pluginReset();
					oEditor.pluginClose(self.pluginDiv);
			});					
		});		
	}

};




/**
* 링크를 생성한다.
*
* @param oEditor 에디터 객체.
*/

JCEditor.prototype.plugin.Quotation = function(oEditor){
	this.oEditor = oEditor;
	this.pluginDiv = null;
	var initialize = (function(obj){ 	
	
		var popupId = obj.oEditor.getLayerId("Quotation","Popup");
		var popupObj = $J("#"+popupId);
		var btnSpan = $J("#"+obj.oEditor.getBtnSpanId("Quotation"));
		
		obj.pluginDiv = popupId;
		
		if (popupObj) {
		
			btnSpan.removeChild(popupObj);
		} else {
			var pluginPopup = oEditor.pluginIframe(popupId,"인용구");			
			btnSpan.appendChild(pluginPopup);			
			
			var width = 275;
			var height =((Browser.type=="MSIE" && Browser.version< 8) ||(Browser.type=="Opera") )? ((Browser.type=="MSIE" && Browser.version== 6))?460:420 : 440;
			
			oEditor.setPlugin(width,height,"/JCEditor/plugin/quotation/quotation.html",popupId);
			var pluginDoc = $J("#"+popupId.replace("-div","-iframe"));		

			obj.onLoadEvent(pluginDoc);
		}

	})(this);	
};

JCEditor.prototype.plugin.Quotation.prototype={
	
	onLoadEvent : function (pluginDoc)
	{
	
		var oEditor = this.oEditor;
		var self = this;
	
		addEvent(pluginDoc,"onload",function(event){
				
			var pluginIfrmDoc = oEditor.plugin.document(pluginDoc);		

			addEvent(pluginIfrmDoc.confirmBtn,"onclick", function(event){
			
				var valueObject = pluginIfrmDoc.window.editorInsert();
				
				if (valueObject) {
					oEditor.execCommand(event, "Quotation", valueObject.html);
					pluginIfrmDoc.window.pluginReset();
					
				}
			});
						
			addEvent(pluginIfrmDoc.cancelBtn,"onclick",function(event){
					pluginIfrmDoc.window.pluginReset();
					oEditor.pluginClose(self.pluginDiv);
			});					
		});		
	}

};

/**
* 이모티콘을 생성한다.
*
* @param oEditor 에디터 객체.
*/

JCEditor.prototype.plugin.Emoticon = function(oEditor){
	this.oEditor = oEditor;
	this.pluginDiv = null;
	var initialize = (function(obj){ 	
	
		var popupId = obj.oEditor.getLayerId("Emoticon","Popup");
		var popupObj = $J("#"+popupId);
		var btnSpan = $J("#"+obj.oEditor.getBtnSpanId("Emoticon"));
		
		obj.pluginDiv = popupId;
		
		if (popupObj) {
		
			btnSpan.removeChild(popupObj);
		} else {
			var pluginPopup = oEditor.pluginIframe(popupId,"이모티콘");			
			btnSpan.appendChild(pluginPopup);						
			
			var width = 402;
			var height =((Browser.type=="MSIE" && Browser.version< 9) ||(Browser.type=="Opera") )? 300 : 310;
			
			oEditor.setPlugin(width,height,"/JCEditor/plugin/emoticon/emoticon.html",popupId);
			var pluginDoc = $J("#"+popupId.replace("-div","-iframe"));		

			obj.onLoadEvent(pluginDoc);
		}

	})(this);	
};

JCEditor.prototype.plugin.Emoticon.prototype={
	
	onLoadEvent : function (pluginDoc)
	{
	
		var oEditor = this.oEditor;
		var self = this;
	
		addEvent(pluginDoc,"onload",function(event){
				
			var pluginIfrmDoc = oEditor.plugin.document(pluginDoc);		
			
			var ddCollection = pluginIfrmDoc.body.getElementsByTagName("dd");
			
			for ( var i = 0; i < ddCollection.length; i++) {				
				var imgCollection = ddCollection[i].getElementsByTagName("td");
				
				for ( var j = 0; j < imgCollection.length; j++) {
					
					addEvent(imgCollection[j].firstChild,"onclick", function(event){
						var eventEl = (event.target) ? event.target : event.srcElement;
												
						var value ="";
						
						if (eventEl.tagName.toUpperCase() =="SPAN") {
							value=eventEl.firstChild.nodeValue;
						}else if(eventEl.tagName.toUpperCase() =="IMG") {
							value ="<img src=\""+eventEl.src+"\" border=\"0\"></img>";
						}						
						eventEl.parentNode.className=eventEl.parentNode.className.replace("-on","-off");
						oEditor.execCommand(event, "Emoticon",value);
						pluginIfrmDoc.window.pluginReset();

					}); 
				}
			}
			
			addEvent(pluginIfrmDoc.cancelBtn,"onclick",function(event){
				pluginIfrmDoc.window.pluginReset();
				oEditor.pluginClose(self.pluginDiv);
			});							
		});		
	}

};


/**
* 특수문자를 생성한다.
*
* @param oEditor 에디터 객체.
*/

JCEditor.prototype.plugin.Scharacter = function(oEditor){
	this.oEditor = oEditor;
	this.pluginDiv = null;
	var initialize = (function(obj){ 	
	
		var popupId = obj.oEditor.getLayerId("Scharacter","Popup");
		var popupObj = $J("#"+popupId);
		var btnSpan = $J("#"+obj.oEditor.getBtnSpanId("Scharacter"));
		
		obj.pluginDiv = popupId;
		
		if (popupObj) {
		
			btnSpan.removeChild(popupObj);
		} else {
			var pluginPopup = oEditor.pluginIframe(popupId,"특수문자");			
			btnSpan.appendChild(pluginPopup);						
			
			var width = 382;
			var height =((Browser.type=="MSIE" && Browser.version< 9) ||(Browser.type=="Opera") )? 320 : 330;
			
			oEditor.setPlugin(width,height,"/JCEditor/plugin/s_character/s_character.html",popupId);
			var pluginDoc = $J("#"+popupId.replace("-div","-iframe"));		

			obj.onLoadEvent(pluginDoc);
		}

	})(this);	
};

JCEditor.prototype.plugin.Scharacter.prototype={
	
	onLoadEvent : function (pluginDoc)
	{
	
		var oEditor = this.oEditor;
		var self = this;
	
		addEvent(pluginDoc,"onload",function(event){
				
			var pluginIfrmDoc = oEditor.plugin.document(pluginDoc);		
			
			var ddCollection = pluginIfrmDoc.body.getElementsByTagName("dd");
			
			for ( var i = 0; i < ddCollection.length; i++) {				
				var spanCollection = ddCollection[i].getElementsByTagName("span");
				
				for ( var j = 0; j < spanCollection.length; j++) {
					
					addEvent(spanCollection[j],"onclick", function(event){
						var eventEl = (event.target) ? event.target : event.srcElement;
						
						eventEl.parentNode.className="";
						
						var value = eventEl.firstChild.nodeValue;
						oEditor.execCommand(event, "Scharacter", value);
						pluginIfrmDoc.window.pluginReset();
					});
				}
				
			}
			
			addEvent(pluginIfrmDoc.cancelBtn,"onclick",function(event){
				pluginIfrmDoc.window.pluginReset();
				oEditor.pluginClose(self.pluginDiv);
			});							
		});		
	}

};

/**
* 테이블을 생성한다.
*
* @param oEditor 에디터 객체.
*/

JCEditor.prototype.plugin.Table = function(oEditor){
	this.oEditor = oEditor;
	this.pluginDiv = null;
	var initialize = (function(obj){ 	
	
		var popupId = obj.oEditor.getLayerId("Table","Popup");
		var popupObj = $J("#"+popupId);
		var btnSpan = $J("#"+obj.oEditor.getBtnSpanId("Table"));
		
		obj.pluginDiv = popupId;
		
		if (popupObj) {
		
			btnSpan.removeChild(popupObj);
		} else {
			var pluginPopup = oEditor.pluginIframe(popupId,"테이블");			
			btnSpan.appendChild(pluginPopup);						
			
			var width = 362;
			var height =((Browser.type=="MSIE" && Browser.version< 8) ||(Browser.type=="Opera") )? ((Browser.type=="MSIE" && Browser.version== 6))?485:470 : 474;

			oEditor.setPlugin(width,height,"/JCEditor/plugin/table/table.html",popupId);
			var pluginDoc = $J("#"+popupId.replace("-div","-iframe"));		

			obj.onLoadEvent(pluginDoc);
		}

	})(this);	
};

JCEditor.prototype.plugin.Table.prototype={
	
	onLoadEvent : function (pluginDoc)
	{
	
		var oEditor = this.oEditor;
		var self = this;
	
		addEvent(pluginDoc,"onload",function(event){
			
			var pluginIfrmDoc = oEditor.plugin.document(pluginDoc);		
			addEvent(pluginIfrmDoc.confirmBtn,"onclick", function(event){
			
				var value = pluginIfrmDoc.window.editorInsert();			

				oEditor.execCommand(event, "Table", value);
				pluginIfrmDoc.window.pluginReset();
		
			});
						
			addEvent(pluginIfrmDoc.cancelBtn,"onclick",function(event){
					pluginIfrmDoc.window.pluginReset();
					oEditor.pluginClose(self.pluginDiv);
			});			
		});		
	}

};



/**
* 그림 사진을 생성한다.
*
* @param oEditor 에디터 객체.
*/

JCEditor.prototype.plugin.Picture = function(oEditor){
	this.oEditor = oEditor;
	this.pluginDiv = null;
	var initialize = (function(obj){ 	
	
		var popupId = obj.oEditor.getLayerId("Picture","Popup");
		var popupObj = $J("#"+popupId);
		var btnSpan = $J("#"+obj.oEditor.getBtnSpanId("Picture"));
		
		obj.pluginDiv = popupId;
		
		if (popupObj) {
		
			btnSpan.removeChild(popupObj);
		} else {
			var pluginPopup = oEditor.pluginIframe(popupId,"사진/이미지");			
			btnSpan.appendChild(pluginPopup);						
			
			var width = 362;
			var height =((Browser.type=="MSIE" && Browser.version< 8) ||(Browser.type=="Opera") )? 520 : 530;
			
			oEditor.setPlugin(width,height,"/JCEditor/plugin/picture/picture.html",popupId);
			var pluginDoc = $J("#"+popupId.replace("-div","-iframe"));		

			obj.onLoadEvent(pluginDoc);
		}

	})(this);	
};

JCEditor.prototype.plugin.Picture.prototype={
	
	onLoadEvent : function (pluginDoc)
	{
	
		var oEditor = this.oEditor;
		var self = this;
	
		addEvent(pluginDoc,"onload",function(event){
			
			var pluginIfrmDoc = oEditor.plugin.document(pluginDoc);		
			addEvent(pluginIfrmDoc.confirmBtn,"onclick", function(event){
			
				var valueObject = pluginIfrmDoc.window.editorInsert();				
				
				var value ="";
				
				if (valueObject) {
					return;
				}
				
				
				if (Browser.type=="MSIE"|| Browser.type=="Opera") {
					value +="<p align=\""+valueObject.direction+"\">";					
				}else{					
					value +="<p style=\"text-align: "+valueObject.direction+"\">";
				}
				
				value +="<img src="+valueObject.url+" style=\"";
				if (valueObject.width > 0) {
					value+=" width : "+valueObject.width+";";
				}
				
				if (valueObject.height > 0) {
					value+=" height : "+valueObject.height+";";
				}
				
				if (valueObject.border > 0) {
					value+=" border : "+valueObject.border+"px solid #ccc;";
				}
				
				value +="\"/></p>";

				if (valueObject) {
					oEditor.execCommand(event, "Picture", value);
					pluginIfrmDoc.window.pluginReset();
					
				}
			});
						
			addEvent(pluginIfrmDoc.cancelBtn,"onclick",function(event){
					pluginIfrmDoc.window.pluginReset();
					oEditor.pluginClose(self.pluginDiv);
			});			
		});		
	}

};


/**
* 플래시를 생성한다.
*
* @param oEditor 에디터 객체.
*/

JCEditor.prototype.plugin.Flash = function(oEditor){
	this.oEditor = oEditor;
	this.pluginDiv = null;
	var initialize = (function(obj){ 	
	
		var popupId = obj.oEditor.getLayerId("Flash","Popup");
		var popupObj = $J("#"+popupId);
		var btnSpan = $J("#"+obj.oEditor.getBtnSpanId("Flash"));
		
		obj.pluginDiv = popupId;
		
		if (popupObj) {
		
			btnSpan.removeChild(popupObj);
		} else {
			var pluginPopup = oEditor.pluginIframe(popupId,"플래시");			
			btnSpan.appendChild(pluginPopup);						
			
			var width = 362;
			var height =((Browser.type=="MSIE" && Browser.version< 8) ||(Browser.type=="Opera") )? 580 : 590;
			
			oEditor.setPlugin(width,height,"/JCEditor/plugin/flash/flash.html",popupId);
			var pluginDoc = $J("#"+popupId.replace("-div","-iframe"));		

			obj.onLoadEvent(pluginDoc);
		}

	})(this);	
};

JCEditor.prototype.plugin.Flash.prototype={
	
	onLoadEvent : function (pluginDoc)
	{
	
		var oEditor = this.oEditor;
		var self = this;
	
		addEvent(pluginDoc,"onload",function(event){
			
			var pluginIfrmDoc = oEditor.plugin.document(pluginDoc);		
			addEvent(pluginIfrmDoc.confirmBtn,"onclick", function(event){
			
				var valueObject = pluginIfrmDoc.window.editorInsert();				
				if (valueObject) {
					oEditor.execCommand(event, "Flash", valueObject);
					pluginIfrmDoc.window.pluginReset();
					
				}
			});
						
			addEvent(pluginIfrmDoc.cancelBtn,"onclick",function(event){
					pluginIfrmDoc.window.pluginReset();
					oEditor.pluginClose(self.pluginDiv);
			});			
		});		
	}

};


/**
* Preview를 생성한다.
*
* @param oEditor 에디터 객체.
*/

JCEditor.prototype.plugin.Preview = function(oEditor){
	this.oEditor = oEditor;
	this.pluginDiv = null;
	var initialize = (function(obj){ 	
	
		var popupId = obj.oEditor.getLayerId("Preview","Popup");
		var popupObj = $J("#"+popupId);
		var btnSpan = $J("#"+obj.oEditor.getBtnSpanId("Preview"));
		obj.pluginDiv = popupId;
		
		if (popupObj) {
		
			btnSpan.removeChild(popupObj);
		} else {
			var pluginPopup = oEditor.pluginIframe(popupId,"미리보기");			
			btnSpan.appendChild(pluginPopup);						
			
			var width = 640;
			var height =((Browser.type=="MSIE" && Browser.version< 9) ||(Browser.type=="Opera") )? 464 : 476;
			
			oEditor.setPlugin(width,height,"/JCEditor/plugin/preview/preview.html",popupId);
			var pluginDoc = $J("#"+popupId.replace("-div","-iframe"));		
			
			var popupobj = $J("#"+popupId);
			popupobj.style.backgroundColor="#ffffff";

			obj.onLoadEvent(pluginDoc);
		}

	})(this);	
};

JCEditor.prototype.plugin.Preview.prototype={
	
	onLoadEvent : function (pluginDoc)
	{
	
		var oEditor = this.oEditor;
		var self = this;
	
		addEvent(pluginDoc,"onload",function(event){
			
			var pluginIfrmDoc = oEditor.plugin.document(pluginDoc);		
			var btn = $J("#"+oEditor.getBtnId("Preview"));
			pluginIfrmDoc.doc.getElementById("preview").innerHTML = $J("#"+oEditor.textAreaId,"ifrm").body()[0].innerHTML;

			addEvent(btn,"onclick",function(event){
				pluginIfrmDoc.doc.getElementById("preview").innerHTML = $J("#"+oEditor.textAreaId,"ifrm").body()[0].innerHTML;				
			});	
						
			addEvent(pluginIfrmDoc.cancelBtn,"onclick",function(event){
					pluginIfrmDoc.window.pluginReset();
					oEditor.pluginClose(self.pluginDiv);
			});			
		});		
	}

};

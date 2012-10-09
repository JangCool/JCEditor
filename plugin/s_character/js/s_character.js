function drawSpeicalCharacter(){
	
	var letterSet = new Object();
	letterSet["normal"] = ["＃","＆","＊","＠","§","※","☆","○","●","◎","◇","◆","□","■","△","▲","▽","▼",
	                             "→","←","↑","↓","↔","〓","◁","◀","▷","▶","♤","♠","♡","♥","♧","♣","⊙","◈",
	                             "▣","◐","◑","▒","▤","▥","▨","▧","▦","▩","♨","☏","☎","☜","☞","¶","†","‡",
	                             "↕","↗","↙","↖","↘","♭","♩","♪","♬","㉿","㈜","№","㏇","™","㏂","㏘","℡","\u00AE",
	                             "ª","º","＂","（","）","［","］","｛","｝","‘","’","“","”","〔","〕","〈","〉","《",
	                             "》","「","」","『","』","【","】","！","＇","，","．","／","：","；","？","＾","＿","｀",
	                             "｜","￣","、","。","·","‥","…","¨","〃","―","∥","＼","∼","´","～","ˇ","˘","˝",
	                             "˚","˙","¸","˛","¡","¿","ː"
	                            ];
	letterSet["math"] = ["＋", "－", "＜", "＝", "＞", "±", "×", "÷", "≠", "≤", "≥", "∞", "∴", "♂", "♀", "∠", "⊥", "⌒", "∂", "∇",
	                                 "≡", "≒", "≪", "≫", "√", "∽", "∝", "∵", "∫", "∬", "∈", "∋", "⊆", "⊇", "⊂", "⊃", "∪", "∩", "∧", "∨",
	                                 "￢", "⇒", "⇔", "∀", "∃", "∮", "∑", "∏", "＄", "％", "￦", "Ｆ", "′", "″", "℃", "Å", "￠", "￡", "￥", "¤", "℉",
	                                 "‰", "?", "㎕", "㎖", "㎗", "ℓ", "㎘", "㏄", "㎣", "㎤", "㎥", "㎥", "㎦", "㎙", "㎚", "㎛", "㎜", "㎝", "㎞", "㎟",
	                                 "㎠", "㎡", "㎢", "㏊", "㎍", "㎎", "㎏", "㏏", "㎈", "㎉", "㏈", "㎧", "㎨", "㎰", "㎱", "㎲", "㎳", "㎴", "㎵", "㎶",
	                                 "㎷", "㎸", "㎹", "㎀", "㎁", "㎂", "㎃", "㎄", "㎺", "㎻", "㎼", "㎽", "㎾", "㎿", "㎐", "㎑", "㎒", "㎓", "㎔", "Ω",
	                                 "㏀", "㏁", "㎊", "㎋", "㎌", "㏖", "㏅", "㎭", "㎮", "㎯", "㏛", "㎩", "㎪", "㎫", "㎬", "㏝", "㏐", "㏓", "㏃", "㏉",
	                                 "㏜", "㏆"
	                               ];
	letterSet["circle"] = ["㉠", "㉡", "㉢", "㉣", "㉤", "㉥", "㉦", "㉧", "㉨", "㉩", "㉪", "㉫", "㉬", "㉭", "㉮", "㉯", "㉰", "㉱", "㉲", "㉳",
	                                "㉴", "㉵", "㉶", "㉷", "㉸", "㉹", "㉺", "㉻", "㈀", "㈁", "㈂", "㈃", "㈄", "㈅", "㈆", "㈇", "㈈", "㈉", "㈊", "㈋",
	                                "㈌", "㈍", "㈎", "㈏", "㈐", "㈑", "㈒", "㈓", "㈔", "㈕", "㈖", "㈗", "㈘", "㈙", "㈚", "㈛", "ⓐ", "ⓑ", "ⓒ", "ⓓ",
	                                "ⓔ", "ⓕ", "ⓖ", "ⓗ", "ⓘ", "ⓙ", "ⓚ", "ⓛ", "ⓜ", "ⓝ", "ⓞ", "ⓞ", "ⓟ", "ⓠ", "ⓡ", "ⓢ", "ⓣ", "ⓤ", "ⓥ", "ⓦ",
	                                "ⓧ", "ⓨ", "ⓩ", "①", "②", "③", "④", "⑤", "⑥", "⑦", "⑧", "⑨", "⑩", "⑪", "⑫", "⑬", "⑭", "⑮", "⒜", "⒝",
	                                "⒞", "⒟", "⒠", "⒡", "⒢", "⒣", "⒤", "⒥", "⒦", "⒧", "⒨", "⒩", "⒪", "⒫", "⒬", "⒭", "⒮", "⒯", "⒰", "⒱",
	                                "⒲", "⒳", "⒴", "⒵", "⑴", "⑵", "⑶", "⑷", "⑸", "⑹", "⑺", "⑻", "⑼", "⑽", "⑾", "⑿", "⒀", "⒁", "⒂"
	                              ];
	
	
	var keyName={	
		normal : "일반기호",
		math : "수학부호/단위",
		circle : "원/괄호문자"		
	};
	
	var html = "";
	                              
	for ( var key in letterSet) {
		
	 	html +="<dt id=\"sc_"+key+"\" "+((key=="normal") ? "class=\"active\"":"" )+"><a href=\"javascript:void(0)\" onclick=\"rollover('sc_"+key+"')\"><span>"+keyName[key]+"</span></a></dt>";
	 	html +="<dd>	<div class=\"tabs-content-each\">";
		html += '<table border="0" cellpadding="2" cellspacing="0" ><tr>';
		
		var cellCnt = 18;
			
		for(var i = 0; i < letterSet[key].length; i++){
			html += '<td align="center" class="rollover-off" onmouseover="tdRollover(this)" onmouseout="tdRollover(this)">';
		    html += '<span style="cursor:pointer;font-size:12px;">' + letterSet[key][i] + '</span>';
		    html += '</td>';
		    if((i+1)%cellCnt == 0){
				html += '</tr><tr>';
		    }
		}
		html += "</tr></table>";	 
		html +="</div></dd>";		
	}	                 
	
	document.getElementById("sc_tabs").innerHTML=html;       
	
	rollover("sc_normal");
}


function rollover(id){
	
	var dt = document.getElementsByTagName("dt");
	
	for(var i = 0 ; i < dt.length ; i++){
	
		var dtId = dt[i].getAttribute("id");
		
		if (id == dtId) {
			dt[i].className="active";
			dt[i].parentNode.getElementsByTagName("div")[i].style.display="block";
		} else {
			dt[i].className="";
			dt[i].parentNode.getElementsByTagName("div")[i].style.display="none";
		}	
	}	
}


function tdRollover(classObj){
	if (classObj.className.indexOf("-on") == -1) {
		classObj.className = classObj.className.replace("-off", "-on");
	}else{
		classObj.className =  classObj.className.replace("-on", "-off");
	}
}


function pluginReset(){
	rollover("sc_normal");	
}

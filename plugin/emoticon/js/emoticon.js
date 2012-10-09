

function drawEmoticon(){

	
	var emoticonSet = new Object();

	emoticonSet["msn"] = ["msn001","msn002","msn003","msn004","msn005","msn006","msn007","msn008",
                            		"msn009","msn010","msn011","msn012","msn013","msn014","msn015","msn016",
                            	 	"msn017","msn018","msn019","msn020","msn021","msn022","msn023","msn024",
                          	  		"msn025","msn026","msn027","msn028","msn029","msn030","msn031","msn032",
                          	  		"msn033","msn034","msn035","msn036","msn037","msn038","msn039","msn040"];
                          	  		
	emoticonSet["msn_ani"]  = ["01","02","03","04","05","06","07","08","09","10","11","12","13","14","15","16"];
	emoticonSet["char_emo"] = ["s(￣▽￣)/", "(*￣ .￣)a", "o(T^T)o", "♬(^0^)~♪", "＼(*｀Д´)/",
	                                "(/ㅡ_-)/~", "∠(- o -)", "(ㅡㅡ^)", "s(￣▽￣)v", "o(^-^)o", "s(￣へ￣ )z", "(づ_-)",
	                                "(-_ど)", "(づ_ど)", "s(ごoご)グ", "(づ_T)", "☞^.^☜","ㅡ..ㅡㆀ",
	                                "(*^.☜)", "(/^o^)/♡", "[(￣.￣)]zZ", "┏(;-_-)┛",
	                                "(-.-)凸", "☞(>.<)☜", "＼(^0^*)/",
	                                "(ㅜ.ㅜ)", "☜(^^*)☞", "(ㅠ.ㅠ)", "(@.@)", "↖(^▽^)↗", "(☞^o^☜)",
	                                "ミⓛㅅⓛミ", "=^ⓛㅅⓛ^=", "s(￣ 3￣)す=33", "へ(￣⌒￣へ)"
	                              ];
	var keyName={	
		msn : "MSN",
		msn_ani : "MSN_ANI",
		char_emo : "문자이모티콘"
	};
	
	var html = "";
	                              
	for ( var key in emoticonSet) {
		
	 	html +="<dt id=\"ec_"+key+"\" "+((key=="msn") ? "class=\"active\"":"" )+"><a href=\"javascript:void(0)\" onclick=\"rollover('ec_"+key+"')\"><span>"+keyName[key]+"</span></a></dt>";
	 	html +="<dd>	<div class=\"tabs-content-each\">";
		html += "<table border=\"0\" cellpadding=\"2\" cellspacing=\"0\" ><tr>";
		
		var cellCnt = 14;
		
		if (key =="msn_ani" ) {
			cellCnt = 6;
		}else if(key =="char_emo" ){
			cellCnt = 5;
		
		}
			
		for(var i = 0; i < emoticonSet[key].length; i++){
			var emoticonSrc =location.protocol+"//"+ location.host+"/JCEditor/plugin/emoticon/images/" + key.toUpperCase() + "/" + emoticonSet[key][i] + ".gif";		
			
			html += "<td align=\"center\" class=\"rollover-off\" onmouseover=\"tdRollover(this)\" onmouseout=\"tdRollover(this)\">";

			if (key =="char_emo" ) {
				html += '<span style="cursor:pointer;font-size:9pt;">' + emoticonSet[key][i] + '</span>';
			}else{
				html += "<img src=\""+emoticonSrc+"\" style=\"cursor:pointer\"></img>";			
			}
			
		    html += "</td>";
		    if((i+1)%cellCnt == 0){
				html += "</tr><tr>";
		    }
		}
		html += "</tr></table>";	 
		html +="</div></dd>";		
	}	                 
	
	document.getElementById("ec_tabs").innerHTML=html;       
	
	rollover("ec_msn");
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
	rollover("ec_msn");	
}
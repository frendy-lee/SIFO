function popupCenter(url, width, height, resizable, scrollbars) {
	var popupTop = Math.ceil((window.screen.height/2)  - (height/2) - 24);
	var popupLeft = Math.ceil((window.screen.width/2) - (width/2) - 6);
	var popupProperties = "location=0,menubar=0,toolbar=0,status=1";
	if (resizable!=undefined) {
		popupProperties += ",resizable=";
		popupProperties += (resizable ? "yes" : "no");
	}
	if (scrollbars!=undefined) {
		popupProperties += ",scrollbars=";
		popupProperties += (resizable ? "yes" : "no");
	}
	popupProperties += (",width="+width);
	popupProperties += (",height="+height);
	popupProperties += (",top="+popupTop);
	popupProperties += (",left="+popupLeft);
	var popupWin = window.open(url, "popupWindow", popupProperties);
	popupWin.focus();
}

function getTimeZone() {
	var tzo=(new Date().getTimezoneOffset()/60)*(-1);
	var prefix = "GMT ";
	if (tzo >= 0) {
  	prefix += "+";
	}
	tzo = prefix + tzo;
	return tzo;
}

function setCookie(name, value, expires, path, domain, secure) {
    document.cookie= name + "=" + escape(value) +
        ((expires) ? "; expires=" + expires.toGMTString() : "") +
        ((path) ? "; path=" + path : "") +
        ((domain) ? "; domain=" + domain : "") +
        ((secure) ? "; secure" : "");
}

function getCookie(name) {
    var dc = document.cookie;
    var prefix = name + "=";
    var begin = dc.indexOf("; " + prefix);
    if (begin == -1) {
        begin = dc.indexOf(prefix);
        if (begin != 0) return null;
    }
    else { begin += 2; }
    var end = document.cookie.indexOf(";", begin);
    if (end == -1) { end = dc.length; }
    return unescape(dc.substring(begin + prefix.length, end));
}

function removeCookie(name) {
	var date = new Date();
	date.setTime(date.getTime()+(-1*24*60*60*1000));
	setCookie(name, "", date, "/");
}

Array.prototype.contains = function(value) {
	var i;
	for (var i = 0, loopCnt = this.length; i < loopCnt; i++) {
		if (this[i] === value) {
			return true;
		}
	}
	return false;
}

function moveVerticalBg(objectId, index) {
	var obj = document.getElementById(objectId);
	if (obj==null) {
		return;
	}
	var offsetHeight = obj.height * index;
	obj.style.backgroundPosition='0 -'+offsetHeight+'px';
}

function setFocus(textFieldObj) {
	var pos = textFieldObj.value.length;
	if(textFieldObj.setSelectionRange) {
		textFieldObj.focus();
		textFieldObj.setSelectionRange(pos,pos);
		
	} else if (textFieldObj.createTextRange) {
		var range = textFieldObj.createTextRange();
		range.collapse(true);
		range.moveEnd('character', pos);
		range.moveStart('character', pos);
		range.select();
	}
}

function bookmark(url, title){
	if (window.sidebar) // firefox
	    window.sidebar.addPanel(title, url, "");
	else if(window.opera && window.print){ // opera
	    var elem = document.createElement('a');
	    elem.setAttribute('href',url);
	    elem.setAttribute('title',title);
	    elem.setAttribute('rel','sidebar');
	    elem.click();
	}
	else if(document.all)// ie 
	    window.external.AddFavorite(url, title);
	else {
	    var ua=navigator.userAgent.toLowerCase();
	    var isKonq=(ua.indexOf('konqueror')!=-1);
	    var isSafari=(ua.indexOf('webkit')!=-1);
	    var isMac=(ua.indexOf('mac')!=-1);
	    var buttonStr=isMac?'Command/Cmd':'CTRL';
			if(isKonq) {
			    alert('You need to press CTRL + B to bookmark our site.');
			} else if(window.home || isSafari) { // Firefox, Netscape, Safari, iCab
			  alert('You need to press '+buttonStr+' + D to bookmark our site.');
			} else if(!window.print || isMac) { // IE5/Mac and Safari 1.0
			  alert('You need to press Command/Cmd + D to bookmark our site.');    
			} else {
			  alert('In order to bookmark this site you need to do so manually '+
			    'through your browser.');
			}
	}
}

String.prototype.endsWith = function(pattern) {
    var d = this.length - pattern.length;
    return d >= 0 && this.lastIndexOf(pattern) === d;
};

function emailValid(emailAddress) {
    var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
    return pattern.test(emailAddress);
}

function refreshCaptcha() {
	var img = document.getElementById("jc_captchaImg");
	var path = "/servlet/captcha?rand="+randomStr(4);
	img.src = path;
}
var chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
function randomStr(len) {
	var result = "";
	for (var i=0;i<len;i++) {
		result += chars.charAt(Math.random()*chars.length);
	}
	return result;
}

jQuery.fn.getFlashVars = function() {
		var flashVarObj = new Object();
		var flashObj = $(this);
		flashObj.children("a").each(function() {
			var flashParam = $(this);
			flashVarObj[flashParam.html()] = flashParam.attr("href");
		});
		var flashObjVars = flashObj.attr("vars");
		if (flashObjVars!=undefined) {
			var flashVars = flashObjVars.split("|");
			for (var i=0,count=flashVars.length; i<count; i++) {
				var param = flashVars[i].split(":");
				flashVarObj[param[0]] = param[1];
			}
		}
		return flashVarObj;
	};
	
jQuery.fn.toFlash = function(attachToElem) {
		var crawlFlashObj = $(this);
		if (attachToElem==undefined) {
			attachToElem = crawlFlashObj.parent()[0];
		}
		var requiredVersion = crawlFlashObj.attr("ver");
		var failToShowElemId = null;
		if (requiredVersion==undefined) {
			requiredVersion = null;
		} else {
			requiredVersion = [ requiredVersion, 0 ];
			failToShowElemId = crawlFlashObj.attr("failShow");
		}
		flashembed(attachToElem, { src: crawlFlashObj.attr("flash"), wmode: "transparent", version: requiredVersion, onFail: function() { $("#"+failToShowElemId).css("display", ""); } }, crawlFlashObj.getFlashVars());
	};
	
jQuery.fn.scrollTo = function(speed, objHeight, offset) {
		if (offset==undefined) { offset = 0; }
		var pageObj = $('html,body');
		var targetObj = $(this);
		if (objHeight==undefined) { objHeight = targetObj.height(); }
		if ((pageObj.height()+pageObj.scrollTop())<(targetObj.position().top)+offset) {
			var scrollOffset = targetObj.position().top-pageObj.height() + offset + Math.min(objHeight, pageObj.height());
			if (scrollOffset>0) {
				pageObj.animate({scrollTop: scrollOffset}, speed);
			}
		}
	}

function scrollPage(pageScrollTop, speed, callback) {
	$('html,body').animate({scrollTop: pageScrollTop}, speed, callback);
}

jQuery.fn.marquee = function(offset, duration, delayStart, delayRepeat) {
		var thisObj = $(this);
		thisObj.css("text-indent", 0);
		setTimeout(function() {
			thisObj.animate({textIndent: "-="+offset}, duration, function() {
				setTimeout(function() {
					thisObj.marquee(offset, duration, delayStart, delayRepeat);
				}, delayRepeat)});
			}, delayStart);
	
	}

jQuery.fn.floating = function(lFloatingStyleClass, aParentSelector, aAlignRight) {
	var msie6 = $.browser.msie && $.browser.version<8;
	if (msie6) {
		return;
	}
	var targetObj = $(this);
	if (targetObj.length==0) {
		return;
	}
	var top = targetObj.offset().top - parseFloat(targetObj.css('margin-top').replace(/auto/, 0));
	var bottom = (aParentSelector) ? (top + $(aParentSelector).height()) : -1;
	var scrollListener = function(event) {
		var y = $(this).scrollTop();
		if (y >= top) {
			targetObj.addClass(lFloatingStyleClass);
			var x = $(this).scrollLeft();
			if (x>0) {
				if (aAlignRight) {
					var left = $(document).width() - (targetObj.width()+3) - x;
					targetObj.css('left', left+"px");
				} else {
					targetObj.css('left', -x+"px");
				}
			} else {
				targetObj.css('left', '');
			}
		} else {
			targetObj.removeClass(lFloatingStyleClass);
			targetObj.css('left', '');
		}
		if (bottom>top) {
			var floatingHeight = targetObj.height();
			var offset = bottom - y - floatingHeight;
			if (offset<0) {
				targetObj.css('margin-top', offset+'px');
			} else {
				targetObj.css('margin-top', '');
			}
		} else {
			
		}
	}
	$(window).bind("scroll", scrollListener);
	scrollListener();
}

$(document).ready(function() {
	$("a.window-popup").click(function() {
		var anchor = $(this);
		var url = anchor.attr("href");
		var width = anchor.attr("popWidth");
		var height = anchor.attr("popHeight");
		popupCenter(url, width, height, true, true);
		return false;
	});
	
	$(".directory-block .send-btn").click(function() {
		sendCommentMessage(".directory-block");
	});
	
	$(".directory-block textarea, .directory-block input, input.optional").focus(function() {
		if ($(this).hasClass("text-normal")) {
			return;
		}
		$(this).val("");
		$(this).addClass("text-normal");
	});
});

function sendCommentMessage(prefix) {
	var msgTxt = $(prefix +" textarea.text-normal").val();
	if (msgTxt==null || msgTxt.length==0) {
		alert("Please leave your message.");
		return;
	}
	var fromAddr = $(prefix +" input[name='email'].text-normal").val();
	if (fromAddr==undefined) {
		fromAddr = "";
	}
	var aboutTxt = $(prefix +" input[name='about']").val();
	
	$(prefix +" .send-btn").css("display", "none");
	$(prefix +" .msg-status").css("display", "block");
	var data = eval("({ msg: '"+encodeURI(msgTxt)+"', from: '"+encodeURI(fromAddr)+"', about: '"+aboutTxt+"' })");
	$.ajax({
		  type: 'POST',
		  url: "/servlet/message?type=comment",
		  data: data,
		  success: function() {
				$(prefix +" input").css("display", "none");
				$(prefix +" .msg-status").css("display", "none");
				$(prefix +" .msg-thankyou").css("display", "block");
			},
		  error: function() {
				$(prefix +" input").css("display", "none");
				$(prefix +" .msg-status").css("display", "none");
				$(prefix +" .msg-thankyou").text("Fail to send.").css("display", "block");
			},
		  dataType: "json"
		});
}

function reinitCommentMessage(prefix, blankText) {
	if ($(prefix +" .send-btn").css("display")!="none") {
		return;
	}

	var msgTxt = "";
	if (!blankText) {
		$(prefix +" textarea.text-normal").removeClass("text-normal");
		msgTxt = "If you want to receive feedback, please also enter your email address below.";
	}
	$(prefix +" textarea").val(msgTxt);
	
	$(prefix +" input[name='email']").removeClass("text-normal").css("display", "block").val("My email address (optional)");
	$(prefix +" input[name='about']").val("");
	$(prefix +" .send-btn").css("display", "block");
	$(prefix +" .msg-thankyou").css("display", "none");
}

function validateForm(aCallback, aAlertRequiredMessage) {
	try {
		var missingObj = null, invalidObj = null;
		$("th .reqfield, td .reqfield").each(function() {
			var lReqFieldLabel = $(this);
			var lIsEmailField = lReqFieldLabel.hasClass("reqfield-email");
			var columnId = lReqFieldLabel.parent().attr("id");
			if (columnId!=null && columnId.length>0) {
				$("input[name^='"+columnId+"']").each(function() {
					var fieldObj = $(this);
					if (fieldObj.attr("disabled")) {
						return;
					}
					if (""==$.trim(fieldObj.val())) {
						if (missingObj==null) {
							missingObj = fieldObj;
						}
						fieldObj.css("background-color", "red");
					} else if (lIsEmailField && !emailValid(fieldObj.val())) {
						if (invalidObj==null) {
							invalidObj = fieldObj;
						}
						fieldObj.css("background-color", "red");
					} else {
						fieldObj.css("background-color", "");
					}
				});
			}
		});
		$("td p .reqfield").each(function() {
			var fieldObj = $(this).parent().next("input");
			if (fieldObj.length!=1) {
				fieldObj = $(this).parent().next("select");
			} 
			if (fieldObj.length!=1) {
				fieldObj = $(this).parent().next("textarea");
			}
			if (fieldObj.length!=1 || fieldObj.attr("disabled")) {
				return;
			}
			if (""==$.trim(fieldObj.val())) {
				if (missingObj==null) {
					missingObj = fieldObj;
				}
				fieldObj.css("background-color", "red");
			} else if ($(this).hasClass("reqfield-email") && !emailValid(fieldObj.val())) {
				if (invalidObj==null) {
					invalidObj = fieldObj;
				}
				fieldObj.css("background-color", "red");
			} else {
				fieldObj.css("background-color", "");
			}
		});
		
		if (missingObj!=null) {
			if (aAlertRequiredMessage==null) {
				aAlertRequiredMessage = "Please fill required information.";
			}
			window.alert(aAlertRequiredMessage);
			missingObj.focus();
		} else if (invalidObj!=null) {
			window.alert("Please fill valid information.");
			invalidObj.focus();
		}

		$("input[type='text'][_maxlength]").each(function() {
			var fieldObj = $(this);
			var maxlength = fieldObj.attr("_maxlength");
			if (maxlength>0 && fieldObj.val().length>maxlength) {
				alert("Value is too longer than "+maxlength+". Please fill the correct value.");
				fieldObj.focus();
				missingObj = fieldObj;
			}
		});
		
		$("textarea[_maxlength]").each(function() {
			var lVal = this.value;
			var lValLen = lVal.length - (lVal.split(/\r/).length - 1) + (lVal.split(/\n/).length - 1);
			var fieldObj = $(this);
			var maxlength = fieldObj.attr("_maxlength");
			if (maxlength>0 && lValLen>maxlength) {
				alert("Value is too long. Please fill the correct value.");
				fieldObj.focus();
				missingObj = fieldObj;
			}
		});
		
		if (aCallback!=null) {
			if (missingObj!=null) {
				aCallback(missingObj);
			} else if (invalidObj!=null) {
				aCallback(invalidObj);
			}
		}
		
		return (missingObj==null) && (invalidObj==null);
		
	} catch (err) {
		window.alert("Found invalid information. Please contact our support.");
	}
	return false;
}

function ajaxFormSubmit(submitform, callback) {
	var formObj = $(submitform);
	var url = formObj.attr("action");
	var data = "";
	formObj.find("input, select, textarea").each(function(index) {
		var inputObj = $(this);
		if (index>0) {
			data += ", ";
		}
//		data += (inputObj.attr("name")+": \""+inputObj.val()+"\"");
		data += inputObj.attr("name");
		data += ": ";
		var val = inputObj.val();
		if (val.charAt(0)=='[') {
			data += val;
		} else {
			data += "\"";
			data += val;
			data += "\"";
		}
	});
	data = eval("({ " + data +" })");
	$.post(url, data, callback, "text");
}

function trackPageConversion() {
	$(".google-conversion").each(function() {
		var imgObj = document.createElement('img');
		imgObj.className = 'google-conversion-image';
		imgObj.width = 1
		imgObj.height = 1;
		imgObj.src = $(this).attr("__src");
		this.appendChild(imgObj);
	});
}
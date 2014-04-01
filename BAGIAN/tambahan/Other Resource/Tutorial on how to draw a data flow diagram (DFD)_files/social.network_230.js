$(document).ready(function() {
	var lSocialLoginToolbox = $(".sociallogin_toolbox");
	if (lSocialLoginToolbox.length>0 && !lSocialLoginToolbox.hasClass("sociallogin_toolbox_fake")) {
		initSocialLoginToolbox();
	}
});

var socialPopup = null;
function closeSocialPopup() {
	if (socialPopup==null || socialPopup.closed) {
		return;
	}
	socialPopup.close();
	socialPopup = null;
}
function initSocialLoginToolbox() {
	$(".sociallogin_toolbox .google").attr("title", "Google").click(function() {
		closeSocialPopup();
		socialPopup = window.open("/servlet/social/google", "social", "menubar=0,width=420,height=520,top=100,left=100");
	});
	$(".sociallogin_toolbox .linkedin").attr("title", "LinkedIn").click(function() {
		closeSocialPopup();
		socialPopup = window.open("/profile/social/linkedin.jsp", "social", "menubar=0,width=440,height=280,top=100,left=100");
	});
	$(".sociallogin_toolbox .twitter").attr("title", "Twitter").click(function() {
		closeSocialPopup();
		socialPopup = window.open("/profile/social/twitter.jsp", "social", "menubar=0,width=710,height=720,top=100,left=100");
	});
/*
	$(".sociallogin_toolbox .facebook").attr("title", "Send to Facebook").attr("target", "_blank");
	$(".sociallogin_toolbox .digg").attr("title", "Digg This").attr("target", "_blank");
	$(".sociallogin_toolbox .delicious").attr("title", "Send to Delicious").attr("target", "_blank");
	$(".sociallogin_toolbox .gmail").attr("title", "Send by Gmail").attr("target", "_blank");
	$(".sociallogin_toolbox .email").attr("title", "Send by Email").addClass("layer-inline iframe").attr("layerWidth", "300").attr("layerHeight", "350");
*/
}

function socialLoginCallback(aSocial, aFirstName, aLastName, aEmail, aId) {
	var action = $(".sociallogin_toolbox").attr("id");
	if ("only-request-key"==action) {
		$(".keyForm").addClass("keyForm-social");
		var lFormObj = $(document.forms['requestKeyWithSocialForm']);
		lFormObj.find(".field-value-name").text(aFirstName + " " + aLastName);
		lFormObj.find("input[name='mail']").val(aEmail);
		if (aEmail.length>0) {
			lFormObj.find("button[type='submit']").click();
		} else {
			lFormObj.find("input[name='mail']").focus();
		}
	} else if ("login-request-key"==action) {
		$(document.forms['loginRequestKeyWithSocialForm']).submit();
	} else if ("login-comment"==action) {
		var lTableObj = $("#login-comment-table");
		lTableObj.addClass("login-comment-table-social");
		if (aEmail.length==0) {
			$("#login-comment-table .login-box").addClass("name-focused");
			lTableObj.find("input[name='email']").focus();
		} else {
			lTableObj.find(".login-box").removeClass("name-focused");
			lTableObj.find("input[name='email']").val(aEmail);
			$("div.writeComment #comment").focus();
		}
		var lFullName = aFirstName + " " +aLastName;
		lTableObj.find("input[name='name']").val(lFullName).css({display:'none'}).parent().prev().html("Name: <span class='field-value'>"+lFullName+"</span>");
		lTableObj.find("input[name='socialNetwork']").val(aSocial);
		$("#captcha-box").remove();
	}
	closeSocialPopup();
}

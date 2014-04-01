$(document).ready(function() {
	$("#rate-article .ratingStars a").click(function() {
		var ratingVal = $(this).attr("__rate");
		var ratingValueObj = $("#ratingValue");
		ratingValueObj.val(ratingVal);
		$("#rating-rate").css("display", "none");
		$("#rating-send").css("display", "");
		ajaxFormSubmit(ratingValueObj.parent(), function() {
			$("#rating-send").css("display", "none");
			$("#rating-done").css("display", "");
		});
		
		return false;
	});
	$("a.this-link").click(function() {
		var lDialogArea = $("div.this-link-dialog textarea");
		var lDialog = lDialogArea.parent();
		lDialogArea.text(lDialog.attr("__title")+"\r\n"+lDialog.attr("__link"));
		lDialog.css("display","block");
		lDialogArea.focus();
		lDialogArea.select();
		lDialogArea.blur(function() {
			$("div.this-link-dialog").css("display", "none");
		});
	});
});
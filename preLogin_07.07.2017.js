var loggedIn = false;
$(document).ready(function(){
	var starmyriAppID = 448772061955380;
	function allowAccess(data) {
		$("#overlay").hide();
		$("#loading-spinner").hide();
		loggedIn = true;
		$("#calendar").weekCalendar("refresh");
		$("#fb-login").hide();
		socket.emit('getUsernames');
		if(data.balance < 0)
		   $('.rentBalance').html('<img src="../Icons/Red_X.png" alt="Leiga ekki greidd" height="42" width="42"><p class="balanceAmountRed">'  + data.name + " <br>" + data.balance + " kr. </p>");
		else if(data.balance > 0)
		   $('.rentBalance').html('<img src="../Icons/Check_mark.png" alt="Inneign" height="42" width="42"><p class="balanceAmountGreen">' + data.name + " <br>+" + data.balance + " kr. </p>");
		else if(data.balance == 0)
		   $('.rentBalance').html('<img src="../Icons/Check_mark.png" alt="Leiga greidd" height="42" width="42"><p class="balanceAmountGreen">' + data.name + " <br>" + data.balance + " kr. </p>");
		if(data.band && data.balance != null)
		   $('.rentBalance').append(data.band);
		if(data.name == "Starmýri")
			$('#page-title').css("display", "block");
    }
	socket.on('connect_failed', function(){
	    console.log('Connection Failed');
	});

	socket.on('checkLogin', function (data){
		if(data.response)
			allowAccess(data);
		else
			denyAccess(data.id, name);
	});
	var denyAccess = function(id, name) {
	    $("#fbName").html(name);
		$("#fb-login").hide();
	    $(".accessDenied").fadeIn();
		$("#loading-spinner").hide();
	};
	function checkLogin(reqId, reqName){
		name = reqName;
		socket.emit('checkLogin', {id: reqId, name: reqName});
	}

	function updateGroup(){
	    socket.emit("updateGroup", {accessToken: accessToken});
	}

	$("#loading-spinner").show();
	window.fbAsyncInit = function() {
	    FB.init({
	        appId      : starmyriAppID,
	        cookie     : true,
	        xfbml      : true,
	        version    : 'v2.9'
	    });

	    FB.getLoginStatus(function(response) {
	        statusChangeCallback(response);
	    });

	};

	function processInfo() {
	    FB.api('/me', function(response) {
	        updateGroup();
	    	checkLogin(response.id, response.name);
	    });
	}
	window.processInfo = processInfo;
});

function checkLoginState() {
	$("#loading-spinner").show();
	FB.getLoginStatus(function(response) {
		statusChangeCallback(response);
	});
}

// This is called with the results from from FB.getLoginStatus().
function statusChangeCallback(response) {
	if (response.status === 'connected') {
		processInfo();
		accessToken = response.authResponse.accessToken;
	} else if (response.status === 'not_authorized') {
		$("#loading-spinner").hide();
	} else {
		$("#loading-spinner").hide();
	}
}
function logout() {
    FB.logout(function(response) {
		location.reload();
	});
}

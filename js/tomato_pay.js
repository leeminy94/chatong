// 이토마토: 0, 증권통: 1, 뉴스통: 2, 통통: 3
var vNowDate = fnNowDate(); //// 오늘날짜 구해서 오늘날짜 아닌 경우 캐시 갱신
var vTomatoID = getCookie('oneid'); //// 로그인 정보 쿠키 확인
var vTomatoGroup = localStorage.getItem('tomato'); //// 로컬스토리지(쿠키) : 토마토 사이드바 정보
var vTomatoGroupNo = localStorage.getItem('tomatoGroupNo'); //// 로컬스토리지(쿠키) : 개인 별 토마토 사이드바 순서
var vTomatoDate = localStorage.getItem('tomatoDate'); //// 로컬스토리지(쿠키) : 스토리지 저장 일시
var vTomatoRef = localStorage.getItem('tomatoRef'); //// 로컬스토리지(쿠키) : 현재 토마토 그룹 JSON 모두 저장
var vTomatoRefNo = localStorage.getItem('tomatoRefNo'); //// 로컬스토리지(쿠키) : RefferNo 저장
//var vTomatoDomain = localStorage.getItem('tomatoDomain');						//// 로컬스토리지(쿠키) : 토마토그룹 도메인 모두 저장

var vTomatoWeb = localStorage.getItem('tomatoWeb'); //// 토마토그룹 Html 태그 통으로 저장 (pc)
//var vTomatoWebMenu = localStorage.getItem('tomatoWebM');						//// 토마토그룹 Html 태그 통으로 저장 (pc)
var vTomatoMobile = localStorage.getItem('tomatoMobile'); //// 토마토그룹 Html 태그 통으로 저장 (mobile)

var vTimeStamp = new Date().getTime();
var vReferrer = document.referrer; //// 이전 도메인 가져오기
var divString = '';
var divSlide = '';
var divMenu = '';
var vNoSetting = '';
var vRefNoSetting = '';
var tomatoGroupZIndex = 1100;

$(document).ready(function() {

    // 모바일
    if (isMobile()) {
        //fnMobileCssJsImport();

        // 무조건 그려줘야함
        //fnMobileMakeHmtl();
        $('#tomatoWeb').hide();
        $('#tomatoMobile').show();

        if (vTomatoGroup == null || vNowDate != vTomatoDate)
            tomatoJsonSetting();
        else {
            if (vTomatoGroupNo == null)
                DefaultMobileMakeHtml();
            else
                TomatoMobileNoMakeHtml();
        }

    } else {
        //fnCssJsImport();

        // 무조건 그려줘야함
        //fnMakeHmtl();
        $('#tomatoWeb').show();
        $('#tomatoMobile').hide();

        if (vTomatoGroup == null || vNowDate != vTomatoDate)
            tomatoJsonSetting();
        else {
            if (vTomatoGroupNo == null)
                DefaultMakeHtml();
            else
                TomatoNoMakeHtml();
        }

    }

});

// ** 모바일 ** //
function fnMobileCssJsImport() {
    var sideCss = '<link rel="stylesheet" type="text/css" href="https://tomato.etomato.com/css/bottom_tab_bar.css?v=' + vTimeStamp + '" />';
    $("head").append(sideCss);
}

// ** 모바일 ** //
// html 영역 잡아주기 위한 html 1순위 셋팅
function fnMobileMakeHmtl() {

    $('#divTomato').addClass('btab_case2');

    divString += '<div id="bottom_nav" class="swiper-container">';
    divString += '<div class="swiper-wrapper">';
    //divString += '<div class="swiper-slide w20p item">';
    //divString += '<span onClick=""><img src="https://tomato.etomato.com/images/etomato.png" alt=""></span>';
    //divString += '</div>';

    //설정
    divString += '<div id="setID" class="swiper-slide w20p item">';
    divString += '<span onClick="location.href=\'/tomato.html\';"><img src="https://tomato.etomato.com/images/icon/icon_set_b.png" alt="" style="width: 30px;"></span>';
    divString += '</div>';

    divString += '</div>';
    divString += '<div class="bottom-prev swiper-button-prev"></div>';
    divString += '<div class="bottom-next swiper-button-next"></div>';
    divString += '</div>';

    $('#divTomato').html(divString);
}
// ** 모바일 ** //
// 기존 사이드바 html 모두 지우기
function fnBottomDeleteHtml() {
    // 기존에 그려진 슬라이드 모두 지우기
    $('.slideClass').remove();
    $('#sortable li').remove();
    $('#sortable2 li').remove();
}

// ** 모바일 ** /
// ** 하단 탭 그리기 ** /
function fnBottomMakeHmtl(jsonID, jsonNameK, jsonNameE, jsonUrl, jsonImage) {

    var divBottom = '';
    divBottom += '<div class="swiper-slide w20p item">';
    divBottom += '<span onClick="javascript:fnMove(\'' + jsonUrl + '\');"><img src="' + jsonImage + '" alt=""></span>';
    divBottom += '</div>';

    $('#setID').before(divBottom);
}

// ** 모바일 ** //
// 기본 html 그리기
function DefaultMobileMakeHtml(paramData) {
    var tomGroup = paramData == null ? vTomatoGroup : paramData;

    fnBottomDeleteHtml();

    var jsonObj = JSON.parse(tomGroup);
    // Reffer 사이드바 1번째로 그리기
    if (vTomatoRefNo != null)
        fnBottomMakeHmtl(jsonObj["tomatogroup"][vTomatoRefNo]["id"], jsonObj["tomatogroup"][vTomatoRefNo]["nameK"], jsonObj["tomatogroup"][vTomatoRefNo]["nameE"], jsonObj["tomatogroup"][vTomatoRefNo]["url"], jsonObj["tomatogroup"][vTomatoRefNo]["image"]);

    // 2번부터 사이드바 그리기
    for (var i = 0; i < jsonObj["tomatogroup"].length; i++) {

        // Reffer인 경우 넘어가기
        // 미리 1번에 그려놓긴때문에
        //alert(vTomatoRefNo);
        if (vTomatoRefNo == i)
            continue;

        // 여기서 Bar 영역을 만들어서 넣자
        var vJsonID = jsonObj["tomatogroup"][i]["id"];
        var vJsonNameK = jsonObj["tomatogroup"][i]["nameK"];
        var vJsonNameE = jsonObj["tomatogroup"][i]["nameE"];
        var vJsonUrl = jsonObj["tomatogroup"][i]["url"];
        var vJsonImage = jsonObj["tomatogroup"][i]["image"];

        fnBottomMakeHmtl(vJsonID, vJsonNameK, vJsonNameE, vJsonUrl, vJsonImage);

    }

    localStorage.setItem("tomatoMobile", $('tomatoMobile').html());
}

// ** 모바일 ** //
// 그룹번호가 있는 경우 html 그리기
function TomatoMobileNoMakeHtml(paramData) {
    var tomGroupNo = paramData == null ? vTomatoGroupNo : paramData;

    var arrTomato = tomGroupNo.split(',');

    fnBottomDeleteHtml();

    var jsonObj = JSON.parse(localStorage.getItem('tomato'));
    // Reffer 사이드바 1번째로 그리기
    if (vTomatoRefNo != null)
        fnBottomMakeHmtl(jsonObj["tomatogroup"][vTomatoRefNo]["id"], jsonObj["tomatogroup"][vTomatoRefNo]["nameK"], jsonObj["tomatogroup"][vTomatoRefNo]["nameE"], jsonObj["tomatogroup"][vTomatoRefNo]["url"], jsonObj["tomatogroup"][vTomatoRefNo]["image"]);

    // 2번부터 사이드바 그리기
    for (var i = 0; i < arrTomato.length; i++) {
        var arrNo = 0;

        if (arrTomato[i] == null || arrTomato[i] == '')
            arrNo = 0;
        else
            arrNo = arrTomato[i];

        // Reffer인 경우 넘어가기
        // 미리 1번에 그려놓긴때문에
        if (vTomatoRefNo == jsonObj["tomatogroup"][arrNo]["id"])
            continue;

        // 여기서 Bar 영역을 만들어서 넣자
        var vJsonID = jsonObj["tomatogroup"][arrNo]["id"];
        var vJsonNameK = jsonObj["tomatogroup"][arrNo]["nameK"];
        var vJsonNameE = jsonObj["tomatogroup"][arrNo]["nameE"];
        var vJsonUrl = jsonObj["tomatogroup"][arrNo]["url"];
        var vJsonImage = jsonObj["tomatogroup"][arrNo]["image"];

        fnBottomMakeHmtl(vJsonID, vJsonNameK, vJsonNameE, vJsonUrl, vJsonImage);
    }

    localStorage.setItem("tomatoMobile", $('tomatoMobile').html());
}


// Json 파일 저장하기
function tomatoJsonSetting() {
    readJSON("https://tomato.etomato.com/tomatogroup.json?v=' + vTimeStamp + '", function(text) {
        localStorage.setItem("tomato", text);
        localStorage.setItem("tomatoDate", fnNowDate());

        // Reffer 순번 json 만들기
        fnJosnRefferNo(JSON.parse(text));

        vNoSetting = text;

        if (isMobile()) {
            if (vTomatoGroupNo == null)
                DefaultMobileMakeHtml(text);
            else
                TomatoMobileNoMakeHtml();
        } else {
            if (vTomatoGroupNo == null)
                DefaultMakeHtml(text);
            else
                TomatoNoMakeHtml();
        }

    });
}

// 여기서 부터는 PcWeb
function fnCssJsImport() {
    var sideCss = '<link rel="stylesheet" type="text/css" href="https://tomato.etomato.com/css/side_menu.css?v=' + vTimeStamp + '" />';
    $("head").prepend(sideCss);
}


// 기본 html 그리기
function DefaultMakeHtml(paramData) {
    var tomGroup = paramData == null ? vTomatoGroup : paramData;

    fnSideDeleteHtml();

    var jsonObj = JSON.parse(tomGroup);
    // Reffer 사이드바 1번째로 그리기
    if (vTomatoRefNo != null)
        fnSideMakeHmtl(jsonObj["tomatogroup"][vTomatoRefNo]["id"], jsonObj["tomatogroup"][vTomatoRefNo]["nameK"], jsonObj["tomatogroup"][vTomatoRefNo]["nameE"], jsonObj["tomatogroup"][vTomatoRefNo]["url"], jsonObj["tomatogroup"][vTomatoRefNo]["image"]);

    // 2번부터 사이드바 그리기
    for (var i = 0; i < jsonObj["tomatogroup"].length; i++) {

        // Reffer인 경우 넘어가기
        // 미리 1번에 그려놓긴때문에
        //alert(vTomatoRefNo);
        if (vTomatoRefNo == i)
            continue;

        // 여기서 Bar 영역을 만들어서 넣자
        var vJsonID = jsonObj["tomatogroup"][i]["id"];
        var vJsonNameK = jsonObj["tomatogroup"][i]["nameK"];
        var vJsonNameE = jsonObj["tomatogroup"][i]["nameE"];
        var vJsonUrl = jsonObj["tomatogroup"][i]["url"];
        var vJsonImage = jsonObj["tomatogroup"][i]["image"];

        fnSideMakeHmtl(vJsonID, vJsonNameK, vJsonNameE, vJsonUrl, vJsonImage);
    }

    var vTomWeb = $('#tomatoWeb').html();
    localStorage.setItem("tomatoWeb", vTomWeb);


}

// 그룹번호가 있는 경우 html 그리기
function TomatoNoMakeHtml(paramData) {
    var tomGroupNo = paramData == null ? vTomatoGroupNo : paramData;

    var arrTomato = tomGroupNo.split(',');

    fnSideDeleteHtml();


    var jsonObj = JSON.parse(localStorage.getItem('tomato'));
    // Reffer 사이드바 1번째로 그리기
    if (vTomatoRefNo != null)
        fnSideMakeHmtl(jsonObj["tomatogroup"][vTomatoRefNo]["id"], jsonObj["tomatogroup"][vTomatoRefNo]["nameK"], jsonObj["tomatogroup"][vTomatoRefNo]["nameE"], jsonObj["tomatogroup"][vTomatoRefNo]["url"], jsonObj["tomatogroup"][vTomatoRefNo]["image"]);

    // 2번부터 사이드바 그리기
    for (var i = 0; i < arrTomato.length; i++) {
        var arrNo = 0;

        if (arrTomato[i] == null || arrTomato[i] == '')
            arrNo = 0;
        else
            arrNo = arrTomato[i];

        // Reffer인 경우 넘어가기
        // 미리 1번에 그려놓긴때문에
        if (vTomatoRefNo == jsonObj["tomatogroup"][arrNo]["id"])
            continue;

        // 여기서 Bar 영역을 만들어서 넣자
        var vJsonID = jsonObj["tomatogroup"][arrNo]["id"];
        var vJsonNameK = jsonObj["tomatogroup"][arrNo]["nameK"];
        var vJsonNameE = jsonObj["tomatogroup"][arrNo]["nameE"];
        var vJsonUrl = jsonObj["tomatogroup"][arrNo]["url"];
        var vJsonImage = jsonObj["tomatogroup"][arrNo]["image"];

        fnSideMakeHmtl(vJsonID, vJsonNameK, vJsonNameE, vJsonUrl, vJsonImage);
    }
    var vTomWeb = $('#tomatoWeb').html();
    localStorage.setItem("tomatoWeb", vTomWeb);


}


// 로컬스토리지에 저장된 값이 있는 경우 Html만 뿌려주기
function TomatoJsonSetting(tomatoGroup) {
    //alert('TomatoJsonSetting');
    $('#divTomato').html(tomatoGroup);
}

// JSON 파일 읽어오기
function readJSON(file, callback) {
    var rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function() {
        if (rawFile.readyState === 4 && rawFile.status == "200") {
            callback(rawFile.responseText);
        }
    }
    rawFile.send(null);
}


// html 영역 잡아주기 위한 html 1순위 셋팅
function fnMakeHmtl() {
    // slider 메뉴
    divString += '<div id="mySidenav" class="sidenav">';
    divString += '<a href="javascript:void(0)" id="open_btn" class="openbtn" onclick="openNav()"><i class="fas fa-plus-circle"></i></a>';
    divString += '<a href="javascript:void(0)" id="close_btn" class="closebtn" onclick="closeNav()" style="display: none;"><i class="fas fa-times-circle"></i></a>';
    divString += '</div>';


    // Menu설정
    divString += '<div id="sortable-list" class="sidenav2" style="display:none;" >';
    divString += '<h3>메뉴설정</h3>';
    divString += '<ul id="sortable" class="connectedSortable" style="list-style:none; padding:0;" >';
    divString += '</ul>';

    //divString += '<ul id="sortable2" class="connectedSortable" style="list-style:none; padding:0;" >';
    //divString += '<h3 style="border-top:1px solid rgb(206, 204, 204);" class="ui-state-disabled" >추가 가능한 메뉴</h3>';
    //divString += '</ul>';
    divString += '</div>';

    $('#divTomato').html(divString);
}

/* 사이드바 html 그리기 */
function fnSideMakeHmtl(jsonID, jsonNameK, jsonNameE, jsonUrl, jsonImage) {

    // 이건 슬라이드 바
    divSlide = '';
    divSlide += '<a class="slideClass" href="javascript:fnMove(\'' + jsonUrl + '\');" data-tooltip="' + jsonNameK + '" style="z-index:' + tomatoGroupZIndex + ' !important;"><img src="' + jsonImage + '" style="width: 20px; z-index: 1005 !important;" alt=""></a>'
    $('#open_btn').before(divSlide);
    //$('#mySidenav').append(divSlide);


    //divMenu += jsonID;
    // 이건 메뉴설정
    divMenu = ''
    divMenu += '<li class="ui-state-default" value="' + jsonID + '" >';
    divMenu += '<span><i class="fas fa-bars"></i><img src="' + jsonImage + '" style="width: 30px;" alt="">' + jsonNameK + '</span>';
    divMenu += '</li>';
    $('#sortable').append(divMenu);

    tomatoGroupZIndex--;

}

// 기존 사이드바 html 모두 지우기
function fnSideDeleteHtml() {
    // 기존에 그려진 슬라이드 모두 지우기
    $('.slideClass').remove();
    $('#sortable li').remove();
    $('#sortable2 li').remove();
}

/* 이전 도메인 체크 */
/*function fnReferCheck() {
	var vHost = window.location.hostname;

	if (vReferrer != '') {
		var vReferrerHost = vReferrer.split('/')[2];
		//alert(1 + vHost);
		//alert(2 + vReferrerHost);
		// 동일하지 않은 경우에만
		if (vHost != vReferrerHost) {
			// indexof 로 체크하여 RefNo 가져오기
			var jsonObj = JSON.parse(vTomatoRef);
			for (var i = 0; i < jsonObj.length; i++) {
				//alert(1 + jsonObj[i]["url"]);
				//alert(2 + RemoveDomain(vReferrerHost));
				console.log('RemoveDomain : ' + RemoveDomain(vReferrerHost));
				if (jsonObj[i]["url"].indexOf(RemoveDomain(vReferrerHost)) != -1) {
					console.log('tomatoRefNo : ' + i);
					localStorage.setItem("tomatoRefNo", i);
				}
			}
			// 바로 셋팅하기 위해서 값 셋팅
			vTomatoRefNo = localStorage.getItem('tomatoRefNo');
		}
	}
} */

// Reffer Json으로 만들기
function fnJosnRefferNo(jsonObj) {
    var tempGroupNo = '';
    var arrJsonList = new Array();
    for (var i = 0; i < jsonObj["tomatogroup"].length; i++) {

        // 객체 생성
        var data = new Object();

        var vUrl = jsonObj["tomatogroup"][i]["url"];
        if (vUrl != '')
            vUrl = vUrl.split('/')[2];

        data.url = RemoveDomain(vUrl);

        // 리스트에 생성된 객체 삽입
        arrJsonList.push(data);

        if (vTomatoGroupNo != null) {
            if (vTomatoGroupNo.indexOf(jsonObj["tomatogroup"][i]["id"]) == -1) {
                tempGroupNo += ',' + jsonObj["tomatogroup"][i]["id"];
            }
        }

    }
    var jsonData = JSON.stringify(arrJsonList);

    // Json 파일 형식 저장 하기
    console.log('tempGroupNo : ' + tempGroupNo);
    console.log('vTomatoGroupNo : ' + vTomatoGroupNo);
    localStorage.setItem("tomatoRef", jsonData);


    var vTomatoGroupNoTemp = vTomatoGroupNo + tempGroupNo;
    if (vTomatoGroupNo != null) {
        localStorage.setItem("tomatoGroupNo", vTomatoGroupNoTemp);
    }


    vRefNoSetting = jsonData;
}



// 도메인 URL 내 http, https, www등 서브도메인 제거
function RemoveDomain(url) {
    var returnUrl = url;

    returnUrl = returnUrl.replace(/^(www\.)?/, '');
    returnUrl = returnUrl.replace(/^(m\.)?/, '');
    returnUrl = returnUrl.replace(/^(test\.)?/, '');
    returnUrl = returnUrl.replace(/^(wtest\.)?/, '');
    returnUrl = returnUrl.replace(/^(mtest\.)?/, '');
    returnUrl = returnUrl.replace(/^(mnew\.)?/, '');
    returnUrl = returnUrl.replace(/^(www12\.)?/, '');

    return returnUrl;
}

// 현재 날짜 구하기 (yyyyMMdd)
function fnNowDate() {
    var todaytomato = new Date();

    var monthtomato = todaytomato.getMonth() + 1;
    var daytomato = todaytomato.getDate();
    var hourtomato = todaytomato.getHours();
    var minutetomato = todaytomato.getMinutes();
    var secondtomato = todaytomato.getSeconds();

    monthtomato = monthtomato >= 10 ? monthtomato : '0' + monthtomato;
    daytomato = daytomato >= 10 ? daytomato : '0' + daytomato;
    hourtomato = hourtomato >= 10 ? hourtomato : '0' + hourtomato;
    minutetomato = minutetomato >= 10 ? minutetomato : '0' + minutetomato;
    secondtomato = secondtomato >= 10 ? secondtomato : '0' + secondtomato;

    return todaytomato.getFullYear() + monthtomato + daytomato;
}

// 현재 시간 구하기 (yyyyMMddhhmmdd)
function fnNowDateTime() {
    var todaytomato = new Date();

    var monthtomato = todaytomato.getMonth() + 1;
    var daytomato = todaytomato.getDate();
    var hourtomato = todaytomato.getHours();
    var minutetomato = todaytomato.getMinutes();
    var secondtomato = todaytomato.getSeconds();

    monthtomato = monthtomato >= 10 ? monthtomato : '0' + monthtomato;
    daytomato = daytomato >= 10 ? daytomato : '0' + daytomato;
    hourtomato = hourtomato >= 10 ? hourtomato : '0' + hourtomato;
    minutetomato = minutetomato >= 10 ? minutetomato : '0' + minutetomato;
    secondtomato = secondtomato >= 10 ? secondtomato : '0' + secondtomato;

    return todaytomato.getFullYear() + monthtomato + daytomato + hourtomato + minutetomato + secondtomato;
}

/* 암복호화 함수 */
function fnAESEnc() {
    var localTomatoNo = localStorage.getItem('tomatoGroupNo') == null ? DefaultGroupNo() : localStorage.getItem('tomatoGroupNo');
    var cookieID = getCookie('tomatoid') == null ? '' : getCookie('tomatoid');
    var key = 'tomatogroup pass';
    //var key = 'tomato;
    var iv = '';
    var param = 'tomatoid=' + cookieID + '&tomatoGroupNo=' + localTomatoNo + '&tomatoRefNo=' + fnNowReferNoCheck();

    //var vEnc = CryptoJS.AES.encrypt(param, 'tomato').toString();
    var vEnc = encodeURIComponent(fnEncrypt(param, key, iv).toString());

    vEnc = '?tomatoEnc=' + vEnc;

    return vEnc;
}

function fnEncrypt(pText, init_key, init_iv) {
    var key = CryptoJS.enc.Utf8.parse(init_key);
    var iv = CryptoJS.enc.Utf8.parse(init_iv);

    var cipherData = CryptoJS.AES.encrypt(pText, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
        //format: CryptoJS.format.OpenSSL

    });

    return cipherData
}

/* 현재 도메인 체크 */
function fnNowReferNoCheck() {
    var vNowHost = window.location.hostname;
    var vTomatoRefCheck = vTomatoRef == null ? vRefNoSetting : vTomatoRef;

    var returnValue = '';
    console.log('fnNowReferNoCheck : ' + vTomatoRefCheck);
    if (vTomatoRefCheck != null) {
        var jsonObj = JSON.parse(vTomatoRefCheck);
        for (var i = 0; i < jsonObj.length; i++) {
            if (jsonObj[i]["url"].indexOf(RemoveDomain(vNowHost)) != -1) {
                console.log('TomatoNowDomain : ' + i);
                localStorage.setItem("tomatoRefNo", i);
                returnValue = i;
            }
        }
    }
    return returnValue;

}

// 모바일 여부 체크
function isMobile() {
    var UserAgent = navigator.userAgent;
    if (UserAgent.match(/iPhone|iPod|Android|Windows CE|BlackBerry|Symbian|Windows Phone|webOS|Opera Mini|Opera Mobi|POLARIS|IEMobile|lgtelecom|nokia|SonyEricsson/i) != null || UserAgent.match(/LG|SAMSUNG|Samsung/) != null) {
        return true;
    } else {
        return false;
    }
}
//function isMobile() {
//	var agent = window.navigator.userAgent;
//	const mobileRegex = [
//		/Android/i,
//		/iPhone/i,
//		/iPad/i,
//		/iPod/i,
//		/BlackBerry/i,
//		/Windows Phone/i
//	]

//	//return mobileRegex.some(mobile => agent.match(mobile));
//	alert(agent);
//	alert(mobileRegex.some(function (mobile) { agent.match(mobile) }));
//	return mobileRegex.some(function (mobile) { agent.match(mobile) });

//}

// 토마토 그룹 번호 생성
function DefaultGroupNo() {
    var no = '';
    var jsonData = vTomatoGroup == null ? vNoSetting : vTomatoGroup;

    //console.log('DefaultGroupNo : ' + jsonData);
    var jsonObj = JSON.parse(jsonData);
    for (var i = 0; i < jsonObj["tomatogroup"].length; i++) {
        no += jsonObj["tomatogroup"][i]["id"] + ',';
    }

    if (no != '') {
        no = no.slice(0, -1);
    }

    return no;
}

// 홈페이지 이동 함수
function fnMove(corpUrl) {
    location.href = corpUrl + fnAESEnc();
    return false;
}


// 쿠키 생성 함수
function setCookie(cName, cValue, cDay) {
    var expire = new Date();

    expire.setTime(expire.getTime() + (cDay * 24 * 60 * 60 * 1000));
    cookies = cName + '=' + escape(cValue) + '; path=/ '; // 한글 깨짐을 막기위해 escape(cValue)를 합니다.
    if (typeof cDay != 'undefined') cookies += ';expires=' + expire.toGMTString() + ';';
    document.cookie = cookies;
}
// 쿠키 가져오기 함수
function getCookie(cName) {
    cName = cName + '=';
    var cookieData = document.cookie;
    var start = cookieData.indexOf(cName);
    var cValue = '';

    if (start != -1) {
        start += cName.length;
        var end = cookieData.indexOf(';', start);
        if (end == -1) end = cookieData.length;
        cValue = cookieData.substring(start, end);
    }

    return unescape(cValue);
}





/* 퍼블리싱 기본 스크립트 */
function openNav() {
    document.getElementById("sortable-list").style.width = "200px";
    document.getElementById("sortable-list").style.display = "block";
    document.getElementById("open_btn").style.display = "none";
    document.getElementById("close_btn").style.display = "block";
}

function closeNav() {
    document.getElementById("sortable-list").style.width = "0";
    document.getElementById("mySidenav").style.marginLeft = "0";
    document.getElementById("close_btn").style.display = "none";
    document.getElementById("open_btn").style.display = "block";
}

$(function() {
    if (isMobile()) {
        // Swiper: Slider
        new Swiper('#bottom_nav', {
            slidesPerView: 5,
            spaceBetween: 1,
            navigation: {
                nextEl: '.bottom-next',
                prevEl: '.bottom-prev'
            }
        });
    } else {
        $("#sortable, #sortable2").sortable({
            cursor: "move",
            //이동시 커서 왼쪽에서 5px 위치에 항상 요소가 위치함
            cursorAt: { left: 5 },
            //sort-list2로 요소 이동가능..
            //sort-list2에서 sort-list1로는 이동불가 - 따로 또 써주어야함.
            connectWith: ".connectedSortable",
            update: function(event, ui) {
                //순서가 바뀌면
                var listArray = $("#sortable").sortable('toArray', { attribute: 'value' }).toString();
                //alert(listArray);
                //배열로 저장한다.
                localStorage.setItem("tomatoGroupNo", listArray);
                TomatoNoMakeHtml(listArray);

                //var listArray2 = $("#sortable2").sortable('toArray', { attribute: 'value' }).toString();
                //alert(listArray2);

            },
        });
    }
});
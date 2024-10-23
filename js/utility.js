/**
 * 유틸리티 자바스크립트 클래스
 * 
 * 
 */

const agent = navigator.userAgent.toLowerCase();
/*
 * json데이터를 form데이터로 인코딩
 *
 * */
function jsonConvert(jsonObject) {
    let result = '';
    let token = '';

    Object.keys(jsonObject).map((key, idx) => {
        if (idx === 1) {
            token = '&';
        }

        result += `${token}${key}=${jsonObject[key]}`
    })

    return result;
}

/*
 * 숫자앞붙이에 0 추가하기
 *
 * */
function numberPad(n, width) {
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join('0') + n;
}

// back 이벤트일 경우 아이폰, 사파리에서 refresh안되는것을 처리하는 함수
$(window).bind("pageshow", function(event) {
    //back 이벤트 일 경우
    if (event.originalEvent && event.originalEvent.persisted) {
        $('#spinner_overay').css('display', 'block');

        if (isMobile()) {
            if (agent.search('iphone') !== -1) { // 아이폰이라면
                window.location.reload();
            }
        } else {
            const is_safari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent); // 사파리 체크

            if (is_safari) {
                window.location.reload();
            }
        }
    }
})

/*
 * 쿠키 설정
 *
 * */
function setCookie(key, value) {
    $.cookie(key, value, {
        expires: 90,
        path: '/'
    });
}

/*
 * 쿠기 얻기
 *
 * */
function getCookie(key) {
    return $.cookie(key);
}

/*
 * 쿠키 삭제
 *
 * */
function clearCookie(key) {
    const expireDate = new Date();
    expireDate.setDate(expireDate.getDate() - 1);

    $.cookie(key, '', {
        expires: expireDate,
        path: '/'
    });
}

/*
 * 스키마방식으로 호출
 *
 * */
function callScheme(request) {
    try {
        let iframe = document.createElement('IFRAME');
        iframe.setAttribute('src', request);
        document.documentElement.appendChild(iframe);
        iframe.parentNode.removeChild(iframe);
        iframe = null;
    } catch (e) {}
}

/*
 * 페이지 리로드
 *
 * */
function reloadPage() {
    window.location.reload();
}

/*
 * 날짜 비교하기
 *
 * */
function compareDate(date1, date2) {
    let ret;
    const startdate = new Date(date1);
    const enddate = new Date(date2);

    if (startdate > enddate) {
        ret = date1;
    } else {
        ret = date2;
    }

    return ret;
}

/*
 * 마지막날짜가 시작날짜보다 작으면 시작날짜를 마지막날짜에 넣기
 *
 * */
function setChangeDate() {
    const startdate = $('#from-date').val();
    const enddate = $('#to-date').val();

    if (startdate !== '' && enddate !== '') {
        $('#to-date').val(compareDate(startdate, enddate));
    }
}

/*
 * 날짜구간 선택 함수
 *
 * */
function setAdminDateSection(element, date) {
    $(element).parent().find('button').removeClass('my-custom');
    $(element).addClass('my-custom');

    if (date === '') { // 전체
        $('#from-date').val('');
        $('#to-date').val('');
    } else if (date === '0') {
        $('#from-date').val(moment(new Date()).format('YYYY-MM-DD'));
        $('#to-date').val(moment(new Date()).format('YYYY-MM-DD'));
    } else {
        $('#from-date').val(moment(new Date()).subtract(parseInt(date), 'month').format('YYYY-MM-DD'));
        $('#to-date').val(moment(new Date()).format('YYYY-MM-DD'));
    }
}

/*
 * 영문, 숫자, 특수문자 조합 체크
 *
 * */
function checkPassword(password) {
    if (!/^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{6,15}$/.test(password)) {
        return 1;
    }

    const checkNumber = password.search(/[0-9]/g);
    const checkEnglish = password.search(/[a-z]/ig);

    if (checkNumber < 0 || checkEnglish < 0) {
        return 2;
    }

    if (/(\w)\1\1\1/.test(password)) {
        return 3;
    }
}

/*
 * 관리자페이지 warning 다이얼로그
 *
 * */
function showWarningForAdmin(text) {
    $('#warning-dialog').modal();
    $('#warning-content').html(text);
}

/*
 * 관리자페이지 확인 다이얼로그
 *
 * */
function showConfirmForAdmin(text, value) {
    $('#confirm-dialog').modal();
    $('#confirm-content').html(text);
    $('#btn-confirm').attr('onclick', value);
}

/*
 * 웹토스트 띄우기
 *
 * */
function showToast(index, text, width) {
    $.toast.config.align = 'center';
    $.toast.config.width = width;

    switch (index) {
        case 'warning':
            $.toast(text, {
                duration: 2000,
                type: 'danger'
            });
            break;
        case 'info':
            $.toast(text, {
                duration: 2000,
                type: 'info'
            });
            break;
        case 'success':
            $.toast(text, {
                duration: 2000,
                type: 'success'
            });
            break;
        case 'normal':
            $.toast(text, {
                duration: 2000
            });
            break;
    }
}

/*
 * 숫자 1000단위에 콤마 추가
 *
 * */
function addComma(num) {
    const parts = num.toString().split('.');
    return parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',') + (parts[1] ? '.' + parts[1] : '');
}

/*
 * 문자열에서 콤마 삭제
 *
 * */
function removeComma(str) {
    return str.replace(/,/g, "");
}

/*
 * 이전 히스토리의 값을 얻어서 해당 처리를 진행
 *
 * */
function goBack(url, count) {
    const referrer = document.referrer;

    switch (referrer) {
        default: window.history.go(count);
        break;
    }
}

/*
 * 화면스크롤이벤트
 *
 * */
let lastScrollTop = 0;
let deltaScroll = 5;

$(window).on('scroll', function() {
    const st = $(this).scrollTop();

    if (Math.abs(lastScrollTop - st) <= deltaScroll) {
        return;
    }

    if (st > lastScrollTop && st > $('.header').outerHeight()) {
        $('.header').removeClass('collapsed');
        $('#menu').removeClass('collapsed');
        $('.divTomato').removeClass('collapsed');
        $('.v-garage-content').removeClass('collapsed');
        $('.more-action-kind-content').removeClass('collapsed');
    } else {
        $('.header').addClass('collapsed');
        $('#menu').addClass('collapsed');
        $('.divTomato').addClass('collapsed');
        $('.v-garage-content').addClass('collapsed');
        $('.more-action-kind-content').addClass('collapsed');
    }

    lastScrollTop = st

    // 리뷰정렬옵션선택뷰 닫기
    if ($('#company-review').length !== 0) {
        $('#company-review').find('.info-option').slideUp(200);
        $('#company-review').find('.review-sort-arrow').removeClass('active');
    }

    // 더보기페이지에서 나의 활동종류
    if ($('.more-action-kind-content').length !== 0) {
        $('.more-action-kind-content').find('.more-action-subkind').slideUp(200);
        $('.more-action-kind-content').find('.garage-arrow').removeClass('active');
    }
})

/*
 * 이메일형식인가를 체크
 *
 * */
function validateEmail(val) {
    const ret = false;
    const filter = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

    if (filter.test(val)) {
        return true;
    }

    return ret;
}

/*
 * 탑버튼 클릭시 스크롤 맨위로 올리기
 *
 * */
function setViewTop() {
    $('html, body').animate({
        scrollTop: 0
    }, 0);
}

/*
 * 클립보드 복사
 *
 * */
function clipboardData(value) {
    const element = document.createElement('textarea');
    document.body.appendChild(element);
    element.value = value;
    element.select();
    document.execCommand('copy');
    document.body.removeChild(element);
}

/*
 * 모바일여부 체크
 *
 * */
function isMobile() {
    let ret = false;
    const UserAgent = navigator.userAgent;

    if (UserAgent.match(/iPhone|iPod|Android|Windows CE|BlackBerry|Symbian|Windows Phone|webOS|Opera Mini|Opera Mobi|POLARIS|IEMobile|lgtelecom|nokia|SonyEricsson/i) != null || UserAgent.match(/LG|SAMSUNG|Samsung/) != null) {
        ret = true;
    }

    return ret;
}

/*
 * 이미지 사이즈 설정부분
 *
 * */
function setResizeImage(settings) {
    return new Promise(function(resolve) {
        const file = settings.file;
        const maxSize = settings.maxSize;
        const fileType = settings.file.type;
        const fileName = settings.file.name;
        const reader = new FileReader()
        const image = new Image();

        reader.onload = function(e) {
            image.onload = function() {
                resolve(setCreateFileByReSize(image, fileType, fileName, maxSize));
            }

            image.src = e.target.result;
        }

        reader.readAsDataURL(file);
    })
}

/*
 * base64 URI형식을 파일로 창조
 *
 * */
function dataURItoBlob(dataURI, fileType) {
    const bytes = dataURI.split(',')[0].indexOf('base64') >= 0 ? atob(dataURI.split(',')[1]) : decodeURI(dataURI.split(',')[1]);
    const max = bytes.length;
    const ia = new Uint8Array(max);

    for (let i = 0; i < max; i++) {
        ia[i] = bytes.charCodeAt(i);
    }

    return new Blob([ia], {
        type: fileType
    });
}

/*
 * 이미지사이즈가 변경된 파일 창조
 *
 * */
function setCreateFileByReSize(image, fileType, fileName, maxSize) {
    const canvas = document.createElement('canvas');
    let width = image.width;
    let height = image.height;

    if (width > height) {
        if (width > maxSize) {
            height *= maxSize / width;
            width = maxSize;
        }
    } else {
        if (height > maxSize) {
            width *= maxSize / height;
            height = maxSize;
        }
    }

    canvas.width = width;
    canvas.height = height;
    canvas.getContext('2d').drawImage(image, 0, 0, width, height);
    const dataUrl = canvas.toDataURL(fileType);
    const blob = dataURItoBlob(dataUrl, fileType);

    return new File([blob], fileName, {
        type: fileType
    });
}

/**
 * 금액을 한글로 표시
 * 
 * @param {변환할 가격} price 
 */
function setConvertPrice(price) {
    const inputNumber = price < 0 ? false : price;
    const unitWords = ['', '만', '억', '조', '경'];
    const splitUnit = 10000;
    const splitCount = unitWords.length;
    let resultArray = [];
    let resultString = '';

    for (let i = 0; i < splitCount; i++) {
        let unitResult = (inputNumber % Math.pow(splitUnit, i + 1)) / Math.pow(splitUnit, i);
        unitResult = Math.floor(unitResult);

        if (unitResult > 0) {
            resultArray[i] = unitResult;
        }
    }

    for (let i = 0; i < resultArray.length; i++) {
        if (!resultArray[i]) continue;
        resultString = String(addComma(resultArray[i])) + unitWords[i] + resultString;
    }

    return resultString;
}

/*
 * 왼쪽메뉴 노출 설정
 * 
 * */
function setShowLeftMenu(element, index) {
    if ($('#moreview-menu').attr('style')) {
        if ($('#moreview-menu').attr('style').search('display: none') !== -1) {
            $('#moreview-menu').animate({
                width: 'toggle'
            }, 200);
        }
    } else {
        $('#moreview-menu').animate({
            width: 'toggle'
        }, 200);
    }

    if (index !== '') {
        $(element).find('img').attr('src', base_url + 'assets/user/images/ico_more_selected.svg');
        $(element).find('p').addClass('active');
    }

    $('.background-overlay').show();
    $('.background-overlay').attr('onclick', 'closeLeftMenuOverlay(' + "'" + index + "'" + ');');
    $('body').css('overflow', 'hidden');
    $('body').on('scroll touchmove mousewheel', function(e) {});
}

/*
 * 왼쪽메뉴 닫기 설정
 * 
 * */
function closeLeftMenuOverlay(index) {
    $('.background-overlay').hide();
    $('#moreview-menu').animate({
        width: 'toggle'
    }, 200);

    if (index !== '나의 활동' && index !== '나의 리뷰' && index !== '내차 관리' && index !== '공지사항' && index !== '나의 차통' && index !== '차통 NFT몰' && index !== '시세조회' && index !== '보유 NFT목록' && index !== '판매하기'&& index !== 'NFT 발행') {
        $('#moremenu-item').find('img').attr('src', base_url + 'assets/user/images/ico_more_unselected.png');
        $('#moremenu-item').find('p').removeClass('active');
    }

    $('body').css('overflow', 'visible');
    $('body').off('scroll touchmove mousewheel');
}

/*
 * 더보기에서 해당 메뉴 클릭
 *
 * */
function setClickMenuItem(element, index, param) {
    clearCookie('action_kind');
    clearCookie('review_kind');
    clearCookie('vehicle_kind');
    $(element).parent().find('.menu-item').removeClass('active');
    $(element).parent().find('img').attr('src', base_url + 'assets/user/images/ico_minuse.svg');
    $(element).addClass('active');
    $(element).find('img').attr('src', base_url + 'assets/user/images/ico_right_arrow_1.svg');

    closeLeftMenuOverlay(index);

    setTimeout(function() {
        switch (index) {
            case '홈':
                window.location.href = base_url + 'main';
                break;
            case '알림':
                setConnectTongTongApp('menu', 'notice', '');
                break;
            case '글쓰기':
                window.location.href = base_url + 'community_write';
                break;
            case '내차 등록':
                if (parseInt(param) !== 0) {
                    window.location.href = base_url + 'vehicle_info?vid=' + param;
                } else {
                    window.location.href = base_url + 'vehicle_register';
                }
                break;
            case '나의 차통':
                window.location.href = base_url + 'mypage';
                break;
            case '나의 활동':
                window.location.href = base_url + 'myaction';
                break;
            case '나의 리뷰':
                window.location.href = base_url + 'myreview';
                break;
            case '내차 관리':
                window.location.href = base_url + 'myvehicles';
                break;
            case '시세조회':
                window.location.href = base_url + 'prices/vehicle_info'
                break;
            case '차통 NFT몰':
                window.location.href = base_url + 'nft_mall';
                break;
            case '차통 NFT 통합몰':
             //   window.location.href = base_url + 'nft_integration_mall'; 
                url =  'https://ttnft.io?nft_integration_mall?'+param;
                window.webkit.messageHandlers.setTTNFTMall.postMessage({ url : url });
                break;
            case '토마토그룹 통합몰':
                window.location.href = base_url + 'nft_integration_mall'; 
                break;
            case '공지사항':
                window.location.href = base_url + 'notice_list';
                break;
        }
    }, 250);
}

/*
 * 일반 다이얼로그
 *
 * */
function showWarningDialog(title, content, align, btn_txt, btn_value, isScroll) {
    $('body').css('overflow', 'hidden');
    $('body').on('scroll touchmove mousewheel', function(e) {});

    $('.dialog-overlay').fadeIn();
    $('.dialog-normal').fadeIn();
    $('.dialog-normal .tag-title').html(title);

    if (content === '') {
        $('.dialog-normal .dialog-content').css('display', 'none');
    } else {
        $('.dialog-normal .dialog-content').css('display', 'block');
        $('.dialog-normal .dialog-content').html(content);
        $('.dialog-normal .dialog-content').css('text-align', align);
    }

    $('.dialog-overlay').attr('onclick', 'closeDialog(' + isScroll + ')');
    $('.dialog-normal .dialog-footer .btn').css('display', 'block');
    $('.dialog-normal .dialog-footer .btn-1').css('display', 'none');
    $('.dialog-normal .dialog-footer .btn').text(btn_txt);
    $('.dialog-normal .dialog-footer .btn').attr('onclick', btn_value);
}

/*
 * 일반 NFT통합 다이얼로그
 *
 * */
function showIntergrationWarningDialog(title, content, align, btn_txt, btn_value, isScroll) {
    $('body').css('overflow', 'hidden');
    $('body').on('scroll touchmove mousewheel', function(e) {});

    $('.dialog-overlay').fadeIn();
    $('.nft-dialog-normal').fadeIn();
    $('.nft-dialog-normal .nft-tag-title').html(title);

    if (content === '') {
        $('.nft-dialog-normal .nft-dialog-content').css('display', 'none');
    } else {
        $('.nft-dialog-normal .nft-dialog-content').css('display', 'block');
        $('.nft-dialog-normal .nft-dialog-content').html(content);
        $('.nft-dialog-normal .nft-dialog-content').css('text-align', align);
    }

    $('.dialog-overlay').attr('onclick', 'closeDialog(' + isScroll + ')');
    $('.nft-dialog-normal .nft-dialog-footer .btn').css('display', 'block');
    $('.nft-dialog-normal .nft-dialog-footer .btn-1').css('display', 'none');
    $('.nft-dialog-normal .nft-dialog-footer .btn').text(btn_txt);
    if($('.nft-dialog-normal .nft-dialog-footer .btn').text() == 'OK!')
    {
        $('.nft-dialog-normal .nft-dialog-footer .btn').css('background','#fff');
        $('.nft-dialog-normal .nft-dialog-footer .btn').css('color','#0085ff');
        $('.nft-dialog-normal .nft-dialog-footer .btn').css('border-top','1px solid #d9d9d9');
        $('.nft-dialog-normal .nft-dialog-footer .btn').css('font-size','16px');
    }
    $('.nft-dialog-normal .nft-dialog-footer .btn').attr('onclick', btn_value);
}
/*
 * NFT통합 설정 다이얼로그
 *
 * */
function showIntergrationSettingDialog(title, content, align, btn_txt1, btn_txt2, btn_val1, btn_val2, isScroll) {
    $('body').css('overflow', 'hidden');
    $('body').on('scroll touchmove mousewheel', function(e) {});

    $('.dialog-overlay').fadeIn();
    $('.nft-dialog-normal').fadeIn();
    $('.nft-dialog-normal .nft-tag-title').html(title);

    if (content === '') {
        $('.nft-dialog-normal .nft-dialog-content').css('display', 'none');
    } else {
        $('.nft-dialog-normal .nft-dialog-content').css('display', 'block');
        $('.nft-dialog-normal .nft-dialog-content').html(content);
        $('.nft-dialog-normal .nft-dialog-content').css('text-align', align);
    }

    $('.dialog-overlay').attr('onclick', 'closeDialog(' + isScroll + ')');
    $('.nft-dialog-normal .nft-dialog-footer .btn').css('display', 'none');
    $('.nft-dialog-normal .nft-dialog-footer .btn-1').css('display', 'block');
    $('.nft-dialog-normal .nft-dialog-footer > div:nth-child(2)').text(btn_txt1);
    $('.nft-dialog-normal .nft-dialog-footer > div:nth-child(3)').text(btn_txt2);
    $('.nft-dialog-normal .nft-dialog-footer > div:nth-child(2)').attr('onclick', btn_val1);
    $('.nft-dialog-normal .nft-dialog-footer > div:nth-child(3)').attr('onclick', btn_val2);
}


/*
 * 설정 다이얼로그
 *
 * */
function showSettingDialog(title, content, align, btn_txt1, btn_txt2, btn_val1, btn_val2, isScroll) {
    $('body').css('overflow', 'hidden');
    $('body').on('scroll touchmove mousewheel', function(e) {});

    $('.dialog-overlay').fadeIn();
    $('.dialog-normal').fadeIn();
    $('.dialog-normal .tag-title').html(title);

    if (content === '') {
        $('.dialog-normal .dialog-content').css('display', 'none');
    } else {
        $('.dialog-normal .dialog-content').css('display', 'block');
        $('.dialog-normal .dialog-content').html(content);
        $('.dialog-normal .dialog-content').css('text-align', align);
    }

    $('.dialog-overlay').attr('onclick', 'closeDialog(' + isScroll + ')');
    $('.dialog-normal .dialog-footer .btn').css('display', 'none');
    $('.dialog-normal .dialog-footer .btn-1').css('display', 'block');
    $('.dialog-normal .dialog-footer > div:nth-child(2)').text(btn_txt1);
    $('.dialog-normal .dialog-footer > div:nth-child(3)').text(btn_txt2);
    $('.dialog-normal .dialog-footer > div:nth-child(2)').attr('onclick', btn_val1);
    $('.dialog-normal .dialog-footer > div:nth-child(3)').attr('onclick', btn_val2);
}

/*
 * 주소 다이얼로그
 * 
 * */
function showAddressDialog() {
    $('body').css('overflow', 'hidden');
    $('body').on('scroll touchmove mousewheel', function(e) {});
    $('.dialog-overlay').fadeIn();
    $('.dialog-address').fadeIn();

    daumPostcode();
}

/*
 * 다이얼로그 닫기
 *
 * */
function closeDialog(isScroll) {
    if (isScroll) {
        $('body').css('overflow', 'visible');
        $('body').off('scroll touchmove mousewheel');
    }

    $('.dialog-normal').fadeOut();
    $('.dialog-buying').fadeOut();
    $('.dialog-vehicles-agree').fadeOut();
    $('.dialog-vehicles-calc').fadeOut();
    $('.dialog-address').fadeOut();
    $('.dialog-overlay').fadeOut();
    $('.intergration-dialog-buying').fadeOut();
    $('.nft-dialog-normal').fadeOut();
    $('.intergration-dialog-normal').fadeOut();
    $('.intergration-dialog-normal-confirm').fadeOut();
    $('.intergration-ndialog-buying').fadeOut();
    $('.ndialog-buying').fadeOut();
    clearCookie('show_event');
    if (document.getElementById('wrap')) {
        document.getElementById('wrap').style.display = 'none';
    }
}

function closeOtherDialog(isScroll) {
    if (isScroll) {
        $('body').css('overflow', 'visible');
        $('body').off('scroll touchmove mousewheel');
    }

    $('.background-overlay').fadeOut();
    $('.community-comment-content .input-tag').fadeOut();
    $('.search-filter').removeClass('collapsed');
    $('.search-filter').removeClass('collapsed_1');
    $('.community-comment-content').removeClass('collapsed');
}

/*
 * 모바일웹일 때 차통앱으로 유도
 *
 * */
function redirectApp() {
    if (navigator.userAgent.match(/android/i)) { // 안드로이드라면
        if (navigator.userAgent.match(/Chrome/)) { // 크롬브라우저이면
            setTimeout(function() {
                window.location.href = 'Intent://main#Intent;scheme=chatong;action=android.intent.action.VIEW;category=android.intent.category.BROWSABLE;package=com.tongtong.chatong;end';
            }, 100);
        } else { // 아니면
            callScheme('Intent://main#Intent;scheme=chatong;action=android.intent.action.VIEW;category=android.intent.category.BROWSABLE;package=com.tongtong.chatong;end');
        }
    } else if (navigator.userAgent.match(/(iphone)|(ipod)|(ipad)/i)) { // 아이폰이라면
        setTimeout(function() {
            window.location.href = 'https://itunes.apple.com/app/id1539259482?mt=8';
        }, 5000);

        setTimeout(function() {
            window.location.href = 'chatong://main';
        }, 100);
    } else {
        closeDialog(true);
    }
}

/**
 * 통통월렛앱 실행
 * 
 */
 function openWalletApp() {
    if (navigator.userAgent.match(/android/i)) { // 안드로이드라면
        if (navigator.userAgent.match(/Chrome/)) { // 크롬브라우저이면
            setTimeout(function() {
                window.location.href = 'Intent://tradenft#Intent;scheme=tongtongwallet;action=android.intent.action.VIEW;category=android.intent.category.BROWSABLE;package=com.tongtong.wallet;end';
            }, 100);
        } else { // 아니면
            callScheme('Intent://tradenft#Intent;scheme=tongtongwallet;action=android.intent.action.VIEW;category=android.intent.category.BROWSABLE;package=com.tongtong.wallet;end');
        }
    } else if (navigator.userAgent.match(/(iphone)|(ipod)|(ipad)/i)) { // 아이폰이라면
        setTimeout(function() {
            window.location.href = 'https://itunes.apple.com/app/id1618695778?mt=8';
        }, 5000);

        setTimeout(function() {
            window.location.href = 'tongtongwallet://Intent';
        }, 100);
    } else {
        if (isMobile()) {
            showSettingDialog('앱에서 이용이 가능한 서비스입니다.<br>앱을 설치하시겠습니까?', '', '', '아니요', '네', 'closeDialog(true);', `showWarningDialog('차통앱을<br>설치하시겠습니까?', '', '', '설치하기', 'redirectApp();', true);`, true);
        } else {
            showSettingDialog('통통 설치가 필요한 서비스입니다.<br>통통을 설치하시겠습니까?', '', '', '아니요', '네', 'closeDialog(true);', `showWarningDialog('통통 설치화면으로<br>이동하시겠습니까?', '', '', '설치하기', 'redirectTongtongForPc();', true);`, true);
        }
    }
}
/**
 * 통통월렛앱 실행
 * 
 */
function redirectWalletApp(index) {
    if (navigator.userAgent.match(/android/i)) { // 안드로이드라면
        if (navigator.userAgent.match(/Chrome/)) { // 크롬브라우저이면
            setTimeout(function() {
                window.location.href = 'Intent://main#Intent;scheme=tongtongwallet;action=android.intent.action.VIEW;category=android.intent.category.BROWSABLE;package=com.tongtong.wallet;end';
            }, 100);
        } else { // 아니면
            callScheme('Intent://main#Intent;scheme=tongtongwallet;action=android.intent.action.VIEW;category=android.intent.category.BROWSABLE;package=com.tongtong.wallet;end');
        }
    } else if (navigator.userAgent.match(/(iphone)|(ipod)|(ipad)/i)) { // 아이폰이라면
        setTimeout(function() {
            window.location.href = 'https://itunes.apple.com/app/id1618695778?mt=8';
        }, 5000);

        setTimeout(function() {
            window.location.href = 'tongtongwallet://main';
        }, 100);
    } else {
        if (index === 'vehicle_info') {
            reloadPage();
        } else {
            closeDialog(true);
        }
    }
}

/*
 * 페이지 리로드
 *
 * */
function reloadPage() {
    window.location.reload();
}

/*
 * 로그인페이지로 리다이렉트
 *
 * */
function redirectLogin() {
    window.location.href = base_url + 'logout?index=auth';
}

/*
 * 메인페이지에로 리다이렉트
 *
 * */
function redirectMain() {
    window.location.href = base_url + 'main';
}

/*
 * PC용 통통 웹페이지로 리다이렉트
 * 
 * */
function redirectTongtongForPc() {
    window.location.href = 'https://tongtongmessenger.com';
}

/**
 * PC용 통통지갑 웹페이지로 리다이렉트
 * 
 */
function redirectWalletForPc(params) {
    window.location.href = 'https://tongtongwallet.com';
}

/*
 * 로그아웃 처리
 *
 * */
function redirectLogOut(status) {
    closeDialog(status);
    setTimeout(function() {
        setConnectTongTongApp('logout', 'logout', '');
    }, 300);
}

/*
 * 통통지갑 연동 프로세스
 * 
 * @param {해당 페이지 인덱스} index 
 * @param {통통월렛앱연동타겟} kind 
 * @param {통통앱의 사용자키} userkey 
 * 
 * */
function setConnectTongTongApp(index, kind, userkey) {
    $('#spinner_overay').css('display', 'block');
    switch (kind) {
        case 'tongtong':
            if (agent.search('app_android') !== -1) { // 안드로이드
                setTimeout(function() {
                    setTongTongWalletConnectForAndroid(index, kind);
                }, 100);
            } else if (agent.search('app_iphone') !== -1) { // 아이폰
                setTimeout(function() {
                    setTongTongWalletConnectForIphone(index, kind);
                }, 100);
            } else {
                $('#spinner_overay').css('display', 'none');

                if (isMobile()) {
                    showSettingDialog('앱에서 이용이 가능한 서비스입니다.<br>앱을 설치하시겠습니까?', '', '', '아니요', '네', 'closeDialog(true);', `showWarningDialog('차통앱을<br>설치하시겠습니까?', '', '', '설치하기', 'redirectApp();', true);`, true);
                } else {
                    showSettingDialog('앱에서 이용이 가능한 서비스입니다.<br>앱을 설치하시겠습니까?', '', '', '아니요', '네', 'closeDialog(true);', `showWarningDialog('차통앱  설치화면으로<br>이동하시겠습니까?', '', '', '설치하기', 'redirectDownloadChartong();', true);`, true);
                   // showSettingDialog('통통지갑 설치가 필요한 서비스입니다.<br>통통지갑을 설치하시겠습니까?', '', '', '아니요', '네', 'closeDialog(true);', `showWarningDialog('통통지갑 설치화면으로<br>이동하시겠습니까?', '', '', '설치하기', 'redirectWalletForPc();', true);`, true);
                }
            }

            break;
        case 'intergration-tongtong':
            if (agent.search('app_android') !== -1) { // 안드로이드
                setTimeout(function() {
                    setTongTongWalletConnectForAndroid(index, kind);
                }, 100);
            } else if (agent.search('app_iphone') !== -1) { // 아이폰
                setTimeout(function() {
                    setTongTongWalletConnectForIphone(index, kind);
                }, 100);
            } else {
                $('#spinner_overay').css('display', 'none');

                if (isMobile()) {
                    showIntergrationSettingDialog('앱에서 이용이 가능한 서비스입니다.<br>앱을 설치하시겠습니까?', '', '', '아니요', '네', 'closeDialog(true);', `showIntergrationWarningDialog('차통앱을<br>설치하시겠습니까?', '', '', '설치하기', 'redirectApp();', true);`, true);
                } else {
                    showIntergrationSettingDialog('NFT 구매를 위해서는<br>통통지갑 설치가 필요합니다 .<br><br><span style="color:#7288e2;">통통지갑을 설치하시겠습니까?</span>', '', '', '아니요', '네', 'closeDialog(true);', `showIntergrationWarningDialog('통통지갑 설치화면으로<br>이동하시겠습니까?', '', '', '설치하기', 'redirectWalletForPc();', true);`, true);
                }
            }

            break;
        case 'charting': // 통통앱채팅
            $('#spinner_overay').css('display', 'none');

            if (agent.search('app_android') !== -1) { // 안드로이드
                setTimeout(function() {
                    window.location.href = 'Intent://m.etomato.com?userkey=' + encodeURIComponent(userkey) + '&from=4#Intent;scheme=tongtong;action=android.intent.action.VIEW;category=android.intent.category.BROWSABLE;package=tomato.solution.tongtong;end';
                }, 100);
            } else if (agent.search('app_iphone') !== -1) { // 아이폰
                setTimeout(function() {
                    setTimeout(function() {
                        window.location.href = 'https://itunes.apple.com/app/id982895719?mt=8';
                    }, 5000);

                    setTimeout(function() {
                        window.location.href = 'tongtongios://okta?userkey=' + encodeURIComponent(userkey);
                    }, 100);
                }, 100);
            } else {
                if (isMobile()) {
                    showSettingDialog('앱에서 이용이 가능한 서비스입니다.<br>앱을 설치하시겠습니까?', '', '', '아니요', '네', 'closeDialog(true);', `showWarningDialog('차통앱을<br>설치하시겠습니까?', '', '', '설치하기', 'redirectApp();', true);`, true);
                } else {
                    showSettingDialog('통통 설치가 필요한 서비스입니다.<br>통통을 설치하시겠습니까?', '', '', '아니요', '네', 'closeDialog(true);', `showWarningDialog('통통 설치화면으로<br>이동하시겠습니까?', '', '', '설치하기', 'redirectTongtongForPc();', true);`, true);
                }
            }

            break;
        case 'myprofile': // 내 프로필 수정
            $('#spinner_overay').css('display', 'none');

            if (agent.search('app_android') !== -1) { // 안드로이드
                setTimeout(function() {
                    window.location.href = 'Intent://m.etomato.com?open=profile#Intent;scheme=tongtong;action=android.intent.action.VIEW;category=android.intent.category.BROWSABLE;package=tomato.solution.tongtong;end';
                }, 100);
            } else if (agent.search('app_iphone') !== -1) { // 아이폰
                setTimeout(function() {
                    setTimeout(function() {
                        window.location.href = 'https://itunes.apple.com/app/id982895719?mt=8';
                    }, 5000);

                    setTimeout(function() {
                        window.location.href = 'tongtongiOS://profile';
                    }, 100);
                }, 100)
            } else {
                showWarningDialog('앱에서 이용 가능한 서비스입니다.', '', '', '확인', 'closeDialog(true);', true);
            }

            break;
        case 'profile': // 프로필상세정보
            $('#spinner_overay').css('display', 'none');

            if (agent.search('app_android') !== -1) { // 안드로이드
                setTimeout(function() {
                    window.location.href = 'Intent://m.etomato.com?open=userprofile&userkey=' + encodeURIComponent(userkey) + '#Intent;scheme=tongtong;action=android.intent.action.VIEW;category=android.intent.category.BROWSABLE;package=tomato.solution.tongtong;end';
                }, 100);
            } else if (agent.search('app_iphone') !== -1) { // 아이폰
                setTimeout(function() {
                    setTimeout(function() {
                        window.location.href = 'https://itunes.apple.com/app/id982895719?mt=8';
                    }, 5000);

                    setTimeout(function() {
                        window.location.href = 'tongtongios://userprofile?userkey=' + encodeURIComponent(userkey);
                    }, 100);
                }, 100);
            } else {
                showWarningDialog('앱에서 이용 가능한 서비스입니다.', '', '', '확인', 'closeDialog(true);', true);
            }

            break;
        case 'notice': // 알림 리스트
            $('#spinner_overay').css('display', 'none');

            if (agent.search('app_android') !== -1) { // 안드로이드
                setTimeout(function() {
                    window.location.href = 'Intent://m.etomato.com?open=openlist#Intent;scheme=tongtong;action=android.intent.action.VIEW;category=android.intent.category.BROWSABLE;package=tomato.solution.tongtong;end';
                }, 100);
            } else if (agent.search('app_iphone') !== -1) { // 아이폰
                setTimeout(function() {
                    setTimeout(function() {
                        window.location.href = 'https://itunes.apple.com/app/id982895719?mt=8'
                    }, 5000);

                    setTimeout(function() {
                        window.location.href = 'tongtongios://openlist';
                    }, 100);
                }, 100);
            } else {
                if (isMobile()) {
                    showSettingDialog('앱에서 이용이 가능한 서비스입니다.<br>앱을 설치하시겠습니까?', '', '', '아니요', '네', 'closeDialog(true);', `showWarningDialog('차통앱을<br>설치하시겠습니까?', '', '', '설치하기', 'redirectApp();', true);`, true);
                } else {
                    showSettingDialog('통통 설치가 필요한 서비스입니다.<br>통통을 설치하시겠습니까?', '', '', '아니요', '네', 'closeDialog(true);', `showWarningDialog('통통 설치화면으로<br>이동하시겠습니까?', '', '', '설치하기', 'redirectTongtongForPc();', true);`, true);
                }
            }
            break;
        case 'logout': // 로그아웃
            // 폰, PC에 저장된 자동로그인 정보 클리어
            if (agent.search('app_android') != -1) { // 안드로이드
                chatong.setClearLoginInfo();
            } else if (agent.search('app_iphone') != -1) { // 아이폰
                window.webkit.messageHandlers.setClearWalletInfo.postMessage({});
            }

            setIndexProcess('', '', '', '', '', '', index, kind);
            break;
    }
}

/*
 * 안드로이드용 통통지갑 연동 프로세스
 *
 * @param {페이지 인덱스} index
 * @param {통통월렛앱연동타겟} kind
 * 
 * */
async function setTongTongWalletConnectForAndroid(index, kind) {
    try {
        const walletinfo = chatong.setConnectTongTongWalletInfo();
      //  alert(walletinfo.split('-')[1]);

        if (walletinfo !== '') { // 통통지갑과 연동이 되었다면
            const walletname = walletinfo.split('-')[0];
            const walletpassword = walletinfo.split('-')[1];
            const res = await httpRequest(base_url + 'manage_coin/getCoinInfo', 'POST', {}, false);

            if (res.data.length !== 0) {
                setIndexProcess(res.data.wallet_addr, walletname, walletpassword, res.data.coin_amount, res.data.gtc_amount, res.data.ctc_amount, index, kind);
            } else {
                $('#spinner_overay').css('display', 'none');
                showWarningDialog('지갑연동에 실패하였습니다.<br>다시 시도해주세요.', '', '', '확인', 'closeDialog(true);', true);
                return;
            }
        } else { // 통통지갑과 연동이 안되었다면
            $('#spinner_overay').css('display', 'none');

            if (index === 'nft_detail') {
                showSettingDialog('NFT 구매를 위해<br>통통지갑을 연동하거나<br>생성해주세요.', '', '', '취소', '연동하기', 'closeDialog(true);', 'redirectTongtongWalletApp(' + "'" + index + "'" + ', ' + "'" + kind + "'" + ');', true);
            } else {
                showSettingDialog('지갑정보가 없습니다.<br>통통 월렛앱에서 확인해 주세요.', '', '', '취소', '확인', 'closeDialog(true);', 'redirectTongtongWalletApp(' + "'" + index + "'" + ', ' + "'" + kind + "'" + ');', true);
            }

            return;
        }
    } catch (e) {
        $('#spinner_overay').css('display', 'none');
        showWarningDialog('네트워크상태가 불안정합니다.<br>다시 시도해주세요.', '', '', '확인', 'closeDialog(true);', true);
        return;
    }
}

/*
 * 아이폰용 통통지갑 연동 프로세스
 *
 * @param {페이지 인덱스} index 
 * @param {통통월렛앱연동타겟} kind 
 * 
 * */
function setTongTongWalletConnectForIphone(index, kind) {
    window.webkit.messageHandlers.checkTongTongWallet.postMessage({
        index: index,
        kind: kind
    });
}

/*
 * 아이폰용 통통월렛앱 유무체크
 * 
 * @param {통통월렛앱설치여부 판단(0: 설치되지 않은 경우, 1: 설지되어있는 경우)} res 
 * @param {페이지 인덱스} index 
 * @param {통통월렛앱연동타겟} kind 
 * @returns 
 * 
 * */
function setTongTongWallet(res, index, kind) {
    if (res == '1') { // 통통월렛앱이 존재한다면
        window.webkit.messageHandlers.runTongTongWallet.postMessage({
            status: 1,
            index: index,
            kind: kind
        });
    } else { // 통통월렛앱이 존재하지 않는다면
        $('#spinner_overay').css('display', 'none');

        if (index === 'nft_detail') {
            showSettingDialog('NFT 구매를 위해<br>통통지갑을 연동하거나<br>생성해주세요.', '', '', '취소', '연동하기', 'closeDialog(true);', 'redirectTongtongWalletApp(' + "'" + index + "'" + ', ' + "'" + kind + "'" + ');', true);
        } else {
            showSettingDialog('지갑정보가 없습니다.<br>통통 월렛앱에서 확인해 주세요.', '', '', '취소', '확인', 'closeDialog(true);', 'redirectTongtongWalletApp(' + "'" + index + "'" + ', ' + "'" + kind + "'" + ');', true);
        }

        return;
    }
}
/**
 *
 * AES256 복호화
 *
 * walletname: 통통지갑명
 * walletpassword: 통통지갑비번
 *
 */
 function setAESDecrypt(walletname, walletpassword) {
    var ret = '';

    $.ajax({
        url: base_url + 'manage_coin/setAESDecrypt',
        type: 'POST',
        dataType: 'json',
        data: {
            walletname: walletname,
            walletpassword: walletpassword
        },
        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        async: false,
        success: function(res) {
            if (res.length != 0) {
                ret = res.name + '-' + res.password;
            }
        }
    });

    return ret;
}
/*
 * 통통코인지갑 프로세스
 * 
 * @param {AES256으로 인코딩된 지갑명과 지갑비번} encrypt 
 * @param {페이지 인덱스} index 
 * @param {통통월렛앱연동타겟} kind 
 * 
 * */
async function setWalletProcess(encrypt, index, kind) {
    if (encrypt !== '-1' && encrypt !== '') { // AES256으로 인코딩된 지갑명과 지갑비번을 얻었다면
         try { 
            $.ajax({
                url: base_url + 'manage_coin/getCoinInfo',
                type: 'POST',
                dataType: 'json',
                data: {
                    walletname: encrypt.split('-')[0],
                    walletpassword: encrypt.split('-')[1],
                },
                contentType: "application/x-www-form-urlencoded; charset=UTF-8",
                async: false,
                success: function(res) {
                    if (res.data.length !== 0) {
                          setIndexProcess(res.data.wallet_addr, res.data.walletname, res.data.walletpassword, res.data.coin_amount, res.data.gtc_amount, res.data.ctc_amount, index, kind);
                       } else {
                          $('#spinner_overay').css('display', 'none');
                          showWarningDialog('지갑연동에 실패하였습니다.<br>다시 시도해주세요.', '', '', '확인', 'closeDialog(true);', true);
                          return;
                      }
                }
            }); 
        } catch (e) {
            $('#spinner_overay').css('display', 'none');
            showWarningDialog('네트워크상태가 불안정합니다.<br>다시 시도해주세요.', '', '', '확인', 'closeDialog(true);', true);
            return;
        }
    } else { // AES256으로 인코딩된 지갑명과 지갑비번을 얻지 못했다면
        $('#spinner_overay').css('display', 'none');
        showWarningDialog('지갑연동에 실패하였습니다.<br>다시 시도해주세요.', '', '', '확인', 'closeDialog(true);', true);
        return;
    }
}

/*
 * 통통월렛앱 설치 및 실행
 * 
 * */
function redirectTongtongWalletApp(index, kind) {
    closeDialog(true);

    if (agent.search('app_android') !== -1) { // 안드로이드
        setTimeout(function() {
            window.location.href = 'Intent://m.etomato.com#Intent;scheme=tongtongwallet;action=android.intent.action.VIEW;category=android.intent.category.BROWSABLE;package=com.tongtong.wallet;end';
        }, 300);
    } else if (agent.search('app_iphone') !== -1) { // 아이폰
        setTimeout(function() {
            window.webkit.messageHandlers.runTongTongWallet.postMessage({
                status: 0,
                index: index,
                kind: kind
            });
        }, 300);
    }
}

/*
 * 해당 페이지 인덱스에 따라 리다이렉트
 * 
 * @param {통통지갑주소} walletaddress 
 * @param {통통코인 잔고} balance_ttcoin 
 * @param {통통지갑명} walletname 
 * @param {통통지갑비번} walletpassword 
 * @param {통통마일몰 잔고} balance_gtc 
 * @param {통통머니 잔고} balance_ctc 
 * @param {페이지 인덱스} index 
 * @param {통통앱연동타겟} kind
 * 
 * */
function setIndexProcess(walletaddress, walletname, walletpassword, balance_ttcoin, balance_gtc, balance_ctc, index, kind) {
    switch (index) {
        case 'mypage':
            $('#spinner_overay').css('display', 'none');
            showWarningDialog('지갑연동에 성공하였습니다.', '', '', '확인', 'closeDialog(true);', true);
            $('#coin-info').addClass('active');
            $('#coin-info').text('지갑 갱신하기');
            $('#ttcoin').html(addComma(parseFloat(balance_ttcoin).toFixed(1)));
            $('#ttm').html(addComma(parseFloat(balance_ctc).toFixed(1)));
            $('#ttmi').html(addComma(parseFloat(balance_gtc).toFixed(1)));
            break;
        case 'nft_detail':
        case 'nft_sale':
        case 'community_detail':

            setCoinInfo(walletaddress, walletname, walletpassword, balance_ttcoin, balance_gtc, balance_ctc);
           
            break;
        case 'nft_image_publishing':
            setCoinInfo(walletaddress, walletname, walletpassword, balance_ttcoin, balance_gtc, balance_ctc); 
            break;
        case 'verify_wallet':
            setCoinInfo(walletaddress, walletname, walletpassword, balance_ttcoin, balance_gtc, balance_ctc);
            break;
        case 'owner_list':
            setCancelSale(walletaddress);
            break;
        case 'logout':
            setTimeout(function() {
                $('#spinner_overay').css('display', 'none');
            }, 5000);

            window.location.replace(base_url + 'logout');
            break;
    }
}
function redirectDownloadChartong(){
    window.location.href = base_url + "download"
}
let swiperVertical;
let swiperHorizontal;
let lockStatus = '0071'; // 비밀댓글 상태값
let memid = 0; // 게시글작성자아이디
let commid = 0; // 커뮤니티게시글아이디
let userid = 0; // 로그인을 한 사용자아이디
let interval;
let tempFunc = '';
let eventmember = '';
$(function() {
    $('#spinner_overay').css('display', 'none');

    swiperVertical = new Swiper('#swiper-vertical', {
        direction: 'vertical',
        centeredSlides: true
    });

    // swiperHorizontal = new Swiper('#swiper-horizontal-0', {
    //     centeredSlides: true
    // });

    setPlayVideo(swiperHorizontal.realIndex);

    // 스와이프(수직) 슬라이드 변경 이벤트
    swiperVertical.on('slideChange', function() {
        clearInterval(interval);
        $('.community-ico-mute').css('transition', 'opacity 0s ease-in-out');
        $('.community-ico-mute').removeClass('active');
        $('.community-ico-mute').attr('src', base_url + 'assets/user/images/ico_mute_off.png');
        $('.community-ico-mute').attr('onclick', '');
        tempFunc = '';
        // swiperHorizontal = new Swiper('#swiper-horizontal-' + this.realIndex, {
        //     centeredSlides: true
        // });
        setPlayVideo(swiperHorizontal.realIndex);
    });

    // 스와이프(수평) 슬라이드 변경 이벤트
    swiperHorizontal.on('slideChange', function() {
        clearInterval(interval);
        $('.community-ico-mute').css('transition', 'opacity 0s ease-in-out');
        $('.community-ico-mute').removeClass('active');
        $('.community-ico-mute').attr('src', base_url + 'assets/user/images/ico_mute_off.png');
        $('.community-ico-mute').attr('onclick', '');
        tempFunc = '';
        // setPlayVideo(this.realIndex);

        $(document).ready(function() {
            var startX, startY, endX, endY;

            $('#test').on('dragstart', function(e) {
                startX = e.pageX;
                startY = e.pageY;
            });

            $('#test').on('dragend', function(e) {
                endX = e.pageX;
                endY = e.pageY;

                var distance = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));

                if (distance > 1) {
                    window.history.back();
                }
            });



        });


    });
});

/*
 * 동영상 플레이 설정
 *
 * */
function setPlayVideo(position) {
    let video = $(swiperHorizontal.slides[position]).find('video');

    $('.media-detail').each(function() {
        if ($(this)[0].nodeName === 'VIDEO') {
            $(this)[0].pause();
            $(this)[0].currentTime = 0.5
            $(this)[0].muted = true;
        }
    });

    if (video.length !== 0) {
        video[0].muted = true;
        video[0].play();
    }
}

/*
 * 음성소거 설정
 *
 * */
function setVideoMute(element, index) {
    const video = $(swiperHorizontal.slides[swiperHorizontal.realIndex]).find('video');
    clearInterval(interval);
    interval = setInterval(function() {
        if ($('.community-ico-mute').attr('class').search('active') !== -1) {
            $('.community-ico-mute').removeClass('active');
        }
    }, 5000);

    if (index === 'on') {
        $(element).attr('src', base_url + 'assets/user/images/ico_mute_on.png');
        $(element).attr('onclick', 'setVideoMute(this, ' + "'off'" + ');');
        video[0].muted = false;
        tempFunc = 'setVideoMute(this, ' + "'off'" + ');';
    }

    if (index === 'off') {
        $(element).attr('src', base_url + 'assets/user/images/ico_mute_off.png');
        $(element).attr('onclick', 'setVideoMute(this, ' + "'on'" + ');');
        video[0].muted = true;
        tempFunc = 'setVideoMute(this, ' + "'on'" + ');';
    }
}

/*
 * 음성소거아이콘 노출설정
 *
 * */
function setShowMute() {
    const video = $(swiperHorizontal.slides[swiperHorizontal.realIndex]).find('video');

    if (video.length !== 0) {
        $('.community-ico-mute').css('transition', 'opacity 1s ease-in-out');
        clearInterval(interval);

        if ($('.community-ico-mute').attr('class').search('active') !== -1) {
            $('.community-ico-mute').removeClass('active');
            $('.community-ico-mute').attr('onclick', '');
        } else {
            $('.community-ico-mute').addClass('active');

            if (tempFunc === '') {
                $('.community-ico-mute').attr('onclick', 'setVideoMute(this, ' + "'on'" + ');');
            } else {
                $('.community-ico-mute').attr('onclick', tempFunc);
            }

            interval = setInterval(function() {
                if ($('.community-ico-mute').attr('class').search('active') !== -1) {
                    $('.community-ico-mute').removeClass('active');
                }
            }, 5000);
        }
    }
}

/*
 * 게시글 좋아요 설정
 *
 * */
function setLikeCommunity(element, likeCnt, communityid, index) {
    $('#spinner_overay').css('display', 'block');

    setTimeout(async function() {
        try {
            await ajaxRequest(base_url + 'user/community/community_detail/setLikeCommunity', 'POST', {
                index: index,
                communityid: communityid
            }, 'json');

            $('#spinner_overay').css('display', 'none');

            if (index === '0') {
                $(element).attr('src', base_url + 'assets/user/images/ico_heart_unselected.svg');
                $(element).parent().find('.txt-cnt').html(parseInt(likeCnt) - 1);
                $(element).attr('onclick', 'setLikeCommunity(this, ' + "'" + (parseInt(likeCnt) - 1) + "'" + ', ' + "'" + communityid + "'" + ', ' + "'1'" + ');');
            } else {
                $(element).attr('src', base_url + 'assets/user/images/ico_heart_selected.svg');
                $(element).parent().find('.txt-cnt').html(parseInt(likeCnt) + 1);
                $(element).attr('onclick', 'setLikeCommunity(this, ' + "'" + (parseInt(likeCnt) + 1) + "'" + ', ' + "'" + communityid + "'" + ', ' + "'0'" + ');');
            }
        } catch (e) {
            $('#spinner_overay').css('display', 'none');
            showWarningDialog('네트워크상태가 불안정합니다.<br>다시 시도해주세요.', '', '', '확인', 'closeDialog(true);', true);
        }
    }, 100);
}

/*
 * 게시글 댓글 확인
 *
 * */
async function setShowComment(communityid, memberid) {
    try {
        const res = await ajaxRequest(base_url + 'user/community/community_detail/setShowComment', 'POST', {
            communityid: communityid
        }, 'json');

        let html = '';

        for (let i = 0; i < res.data.comments.length; i++) {
            html += '<div class="row-item" data-commentid="' + res.data.comments[i].commentid + '">';

            if (res.data.comments[i].avatar !== '') {
                if (res.data.comments[i].avatar.search('api.otongtong.net') !== -1) {
                    html += '<img class="avatar" src="' + res.data.comments[i].avatar + '" alt="">';
                } else {
                    html += '<img class="avatar" src="' + base_image + res.data.comments[i].avatar + '" alt="">';
                }
            } else {
                html += '<img class="avatar" src="' + base_url + 'assets/user/images/ico_avatar.svg" alt="">';
            }

            html += '<div class="right-content">';
            html += '<div class="row-section mb-3">';
            html += '<div class="left-section">';
            html += '<div style="display: flex; align-items: center;">';

            if (res.data.comments[i].private_status === '0072') {
                html += '<span class="txt-name" style="color: #999999;">' + res.data.comments[i].username + '</span>';
                html += '<img id="txt-key" class="ml-4" src="' + base_url + 'assets/user/images/ico_lock_1.svg" alt="" style="width: 12px; height: 12px; display: block;">';
            } else {
                html += '<span class="txt-name">' + res.data.comments[i].username + '</span>';
                html += '<img id="txt-key" class="ml-4" src="' + base_url + 'assets/user/images/ico_lock_1.svg" alt="" style="width: 12px; height: 12px; display: none;">';
            }

            html += '</div>';
            html += '</div>';
            html += '<div class="right-section">';

            // 로그인이 되어있으면 댓글 더보기 노출
            if (res.data.memberid !== 0) {
                html += '<img class="pointer" src="' + base_url + 'assets/user/images/ico_more.svg" alt="" style="width: 15px; height: 15px;" onclick="setShowMoreComment(this);">';
                html += '<div class="info-option" style="display: none;">';

                // 댓글작성자인 경우
                if (res.data.memberid === res.data.comments[i].memberid) {
                    html += '<a href="javascript:void(0)" class="txt" onclick="setSettingAddAnswerComment(this, ' + "'" + res.data.comments[i].commentid + "'" + ', ' + "'" + res.data.comments[i].username + "'" + ', ' + "'" + communityid + "'" + ', ' + "'" + res.data.memberid + "'" + ');">답댓글</a>';
                    html += '<a href="javascript:void(0)" id="update-comment" class="txt" onclick="setSettingUpdateComment(this, ' + "'" + res.data.comments[i].commentid + "'" + ', ' + "'" + res.data.comments[i].private_status + "'" + ', ' + "'" + communityid + "'" + ', ' + "'" + res.data.memberid + "'" + ');">수정</a>';
                    html += '<a href="javascript:void(0)" class="txt" onclick="showSettingDialog(' + "'댓글을 삭제하시겠습니까?'" + ', ' + "''" + ', ' + "''" + ', ' + "'취소'" + ', ' + "'확인'" + ', ' + "'closeDialog(false);'" + ', ' + "'setRemoveComment(" + res.data.comments[i].commentid + ", " + communityid + ", " + res.data.memberid + ");', false" + ');">삭제</a>';
                    html += '<a href="javascript:void(0)" class="txt" onclick="setCloseMoreComment(this, ' + "'" + communityid + "'" + ', ' + "'" + res.data.memberid + "'" + ', ' + "'comment'" + ');">취소</a>';
                } else { // 댓글작성자가 아닌 경우
                    html += '<a href="javascript:void(0)" class="txt" onclick="setSettingAddAnswerComment(this, ' + "'" + res.data.comments[i].commentid + "'" + ', ' + "'" + res.data.comments[i].username + "'" + ', ' + "'" + communityid + "'" + ', ' + "'" + res.data.memberid + "'" + ');">답댓글</a>';
                    html += '<a href="javascript:void(0)" class="txt" onclick="setCloseMoreComment(this, ' + "'" + communityid + "'" + ', ' + "'" + res.data.memberid + "'" + ', ' + "'comment'" + ');">취소</a>';
                }

                html += '</div>';
            }

            html += '</div>';
            html += '</div>';
            html += '<div class="row-section">';
            html += '<div class="left-section active">';

            if (res.data.comments[i].private_status === '0072') { // 비밀댓글이면
                // 댓글작성자와 게시글작성자만 내용 확인
                if (res.data.memberid === res.data.comments[i].memberid || res.data.memberid === res.data.comments[i].memid) {
                    html += '<textarea id="txt-comment-' + i + '" class="txt-comment" placeholder="" readonly>' + res.data.comments[i].content + '</textarea>';
                }
            } else { // 비밀댓글이 아니면
                html += '<textarea id="txt-comment-' + i + '" class="txt-comment" placeholder="" readonly>' + res.data.comments[i].content + '</textarea>';
            }

            html += '</div>';
            html += '</div>';
            html += '<div class="row-section">';
            html += '<div class="left-section active">';
            html += '<div class="answer-comment-info">';

            if (res.data.memberid !== 0) {
                if (res.data.comments[i].like_status !== '0') {
                    html += '<img class="heart pointer" src="' + base_url + 'assets/user/images/ico_like_comment_on.svg" alt="" onclick="setLikeComment(this, ' + "'" + res.data.comments[i].like_cnt + "'" + ', ' + "'" + res.data.comments[i].commentid + "'" + ', ' + "'0'" + ');">';
                } else {
                    html += '<img class="heart pointer" src="' + base_url + 'assets/user/images/ico_like_comment_off.svg" alt="" onclick="setLikeComment(this, ' + "'" + res.data.comments[i].like_cnt + "'" + ', ' + "'" + res.data.comments[i].commentid + "'" + ', ' + "'1'" + ');">';
                }
            } else {
                html += '<img class="heart pointer" src="' + base_url + 'assets/user/images/ico_like_comment_off.svg" alt="" onclick="window.location.href=' + "'" + base_url + "login'" + '">';
            }

            html += '<span class="cnt">' + res.data.comments[i].like_cnt + '</span>';

            if (res.data.comments[i].answer_cnt !== '0') {
                html += '<span id="answer-cnt" class="ml-15 pointer" onclick="setConfirmAnswerComment(this, ' + "'" + communityid + "'" + ', ' + "'" + res.data.comments[i].commentid + "'" + ', ' + "'" + res.data.comments[i].answer_cnt + "'" + ');" style="font-size: 11px; color: #999999; display: inline-block;">답댓글 ' + res.data.comments[i].answer_cnt + '개 보기</span>';
            } else {
                html += '<span id="answer-cnt" class="ml-15 pointer" onclick="setConfirmAnswerComment(this, ' + "'" + communityid + "'" + ', ' + "'" + res.data.comments[i].commentid + "'" + ', ' + "'" + res.data.comments[i].answer_cnt + "'" + ');" style="font-size: 11px; color: #999999; display: none;">답댓글 ' + res.data.comments[i].answer_cnt + '개 보기</span>';
            }

            html += '</div>';
            html += '<div class="answer-content" style="display: none;">';
            html += '</div>';
            html += '</div>';
            html += '</div>';
            html += '</div>';
            html += '</div>';
        }

        $('.community-comment-content .comment-content').html(html);

        for (let i = 0; i < res.data.comments.length; i++) {
            if (document.getElementById('txt-comment-' + i)) {
                $('#txt-comment-' + i).css('height', document.getElementById('txt-comment-' + i).scrollHeight);
                $('#txt-comment-' + i).on('focus', function() {
                    $(this).attr('style', 'border: 0 !important; height: ' + document.getElementById('txt-comment-' + i).scrollHeight + 'px;');
                });
            }
        }

        $('body').css('overflow', 'hidden');
        $('body').on('scroll touchmove mousewheel', function(e) {});
        $('.background-overlay').fadeIn();
        $('.background-overlay').attr('onclick', 'closeOtherDialog(true);');
        $('.community-comment-content .header-tag a').attr('href', 'javascript:closeOtherDialog(true)');
        $('.community-comment-content').addClass('collapsed');
        $('.community-comment-content .input-tag').fadeIn();
        $('.community-comment-content .input-tag').css('display', 'flex');
        $('#comment-content').val('');
        $('.community-submit-comment').text('등록');
        $('#private-status').attr('src', base_url + 'assets/user/images/ico_unlock.svg');
        $('#private-status').attr('onclick', 'setLockComment(this, ' + "'1'" + ');');

        // 로그인이 되어있으면
        if (res.data.memberid !== 0) {
            $('.community-submit-comment').attr('onclick', 'setAddComment(' + "'" + communityid + "'" + ', ' + "'" + res.data.memberid + "'" + ');');
        } else {
            $('.community-submit-comment').attr('onclick', 'redirectLogin();');
        }

        commid = communityid;
        memid = memberid;
    } catch (e) {
        showWarningDialog('네트워크상태가 불안정합니다.<br>다시 시도해주세요.', '', '', '확인', 'closeDialog(true);', true);
    }
}

/* 
 * 댓글 더보기뷰 노출설정
 *
 * */
function setShowMoreSubComment(element) {
    $(element).closest('.comment-content').find('.info-option').slideUp(200);
    const value = $(element).closest('.right-info').find('.info-option').attr('style');

    if (value.search('display: none') != -1) {
        $(element).closest('.right-info').find('.info-option').slideDown(200);
    } else {
        $(element).closest('.right-info').find('.info-option').slideUp(200);
    }
}

/* 
 * 댓글 더보기뷰 노출설정
 *
 * */
function setShowMoreComment(element) {
    $(element).closest('.comment-content').find('.info-option').slideUp(200);
    const value = $(element).closest('.right-section').find('.info-option').attr('style');

    if (value.search('display: none') != -1) {
        $(element).closest('.right-section').find('.info-option').slideDown(200);
    } else {
        $(element).closest('.right-section').find('.info-option').slideUp(200);
    }
}

/* 
 * 댓글 더보기뷰에서 답댓글 설정
 *
 * */
let elemTarget;

function setSettingAddAnswerComment(element, commentid, username, communityid, memberid) {
    elemTarget = element
    commid = communityid;
    userid = memberid;
    $(element).closest('.right-section').find('.info-option').slideUp(200);
    $('#comment-input-content').append('<p class="community-text-username">@' + username + '</p>');
    $('#comment-content').attr('placeholder', '');
    $('#comment-content').trigger('focus');
    $('#comment-content').css({
        'height': '36px',
        'background-color': '#fff',
        'padding': '7px 50px 0 ' + ($('.community-text-username').width() + 10) + 'px'
    });
    $('#comment-content').val('');
    $('.community-submit-comment').attr('onclick', 'setAddAnswerComment(' + "'" + commentid + "'" + ', ' + "'" + communityid + "'" + ', ' + "'" + memberid + "'" + ');');
    $('.community-submit-comment').text('등록');
    $('#private-status').attr('src', base_url + 'assets/user/images/ico_unlock.svg');
    $('#private-status').attr('onclick', 'setLockComment(this, ' + "'1'" + ');');
}
/* 
 * 댓글 더보기뷰에서 답댓글 등록
 *
 * */
function setAddAnswerComment(commentid, communityid, memberid) {
    if ($('#comment-content').val().trim() === '') {
        showToast('warning', '댓글내용을 입력해주세요.', 260);
        return;
    }

    $('#spinner_overay').css('display', 'block');

    setTimeout(async function() {
        try {
            const res = await ajaxRequest(base_url + 'user/community/community_detail/setAddAnswerComment', 'POST', {
                commentid: commentid,
                communityid: communityid,
                content: $('#comment-content').val(),
                lockStatus: lockStatus
            }, 'json');

            $('#spinner_overay').css('display', 'none');

            if (res.data.answer.length !== 0) {
                $(elemTarget).closest('.row-item').find('#answer-cnt').css('display', 'inline-block');

                if ($(elemTarget).closest('.row-item').find('.answer-content').attr('style').search('display: none;') !== -1) {
                    $(elemTarget).closest('.row-item').find('#answer-cnt').text('답댓글 ' + res.data.answer.length + '개 보기');
                } else {
                    $(elemTarget).closest('.row-item').find('#answer-cnt').text('답댓글 숨기기');
                }

                $(elemTarget).closest('.row-item').find('#answer-cnt').attr('onclick', 'setConfirmAnswerComment(this, ' + "'" + communityid + "'" + ', ' + "'" + commentid + "'" + ', ' + "'" + res.data.answer.length + "'" + ');');
            }

            let html = '';

            for (let i = 0; i < res.data.answer.length; i++) {
                html += '<div class="answer-item" data-subcommentid="' + res.data.answer[i].commentid + '">';

                if (res.data.answer[i].avatar !== '') {
                    if (res.data.answer[i].avatar.search('api.otongtong.net') !== -1) {
                        html += '<img class="answer-avatar" src="' + res.data.answer[i].avatar + '" alt="">';
                    } else {
                        html += '<img class="answer-avatar" src="' + base_image + res.data.answer[i].avatar + '" alt="">';
                    }
                } else {
                    html += '<img class="answer-avatar" src="' + base_url + 'assets/user/images/ico_avatar.svg" alt="">';
                }

                html += '<div class="answer-info">';


                html += '<div class="row-info mb-3">';
                html += '<div class="left-info" style="display: flex; align-items: center;">';

                if (res.data.answer[i].private_status === '0072') {
                    html += '<span class="answer-name" style="color: #999999;">' + res.data.answer[i].username + '</span>';
                    html += '<img id="answer-key" class="ml-4" src="' + base_url + 'assets/user/images/ico_lock_1.svg" alt="" style="width: 12px; height: 12px; display: block;">';
                } else {
                    html += '<span class="answer-name">' + res.data.answer[i].username + '</span>';
                    html += '<img id="answer-key" class="ml-4" src="' + base_url + 'assets/user/images/ico_lock_1.svg" alt="" style="width: 12px; height: 12px; display: none;">';
                }

                html += '</div>';
                html += '<div class="right-info">';

                // 로그인이 되어있으면 댓글 더보기 노출
                if (res.data.memberid !== 0) {
                    if (res.data.memberid === res.data.answer[i].memberid) {
                        html += '<img class="pointer" src="' + base_url + 'assets/user/images/ico_more.svg" alt="" style="width: 15px; height: 15px;" onclick="setShowMoreSubComment(this);">';
                        html += '<div class="info-option" style="display: none;">';
                        html += '<a id="update-subcomment" href="javascript:void(0)" class="txt" onclick="setSettingUpdateSubComment(this, ' + "'" + res.data.answer[i].commentid + "'" + ', ' + "'" + res.data.answer[i].private_status + "'" + ', ' + "'" + communityid + "'" + ', ' + "'" + res.data.memberid + "'" + ');">수정</a>';
                        html += '<a href="javascript:void(0)" class="txt" onclick="showSettingDialog(' + "'답댓글을 삭제하시겠습니까?'" + ', ' + "''" + ', ' + "''" + ', ' + "'취소'" + ', ' + "'확인'" + ', ' + "'closeDialog(false);'" + ', ' + "'setRemoveSubComment(" + res.data.answer[i].commentid + ", " + communityid + ", " + res.data.memberid + ", " + commentid + ");', false" + ');">삭제</a>';
                        html += '<a href="javascript:void(0)" class="txt" onclick="setCloseMoreComment(this, ' + "'" + communityid + "'" + ', ' + "'" + res.data.memberid + "'" + ', ' + "'subcomment'" + ');">취소</a>';
                        html += '</div>';
                    }
                }

                html += '</div>';
                html += '</div>';
                html += '<div class="row-info">';
                html += '<div class="left-info active">';

                if (res.data.answer[i].private_status === '0072') { // 비밀댓글이면
                    // 댓글작성자와 게시글작성자만 내용 확인
                    if (res.data.memberid === res.data.answer[i].memberid || res.data.memberid === res.data.answer[i].memid) {
                        html += '<textarea id="answer-comment-' + i + '" class="answer-comment" placeholder="" readonly>' + res.data.answer[i].content + '</textarea>';
                    }
                } else { // 비밀댓글이 아니면
                    html += '<textarea id="answer-comment-' + i + '" class="answer-comment" placeholder="" readonly>' + res.data.answer[i].content + '</textarea>';
                }

                html += '</div>';
                html += '</div>';

                html += '<div class="row-info">';
                html += '<div class="left-info active">';

                if (res.data.memberid !== 0) {
                    if (res.data.answer[i].like_status !== '0') {
                        html += '<img class="answer-heart pointer" src="' + base_url + 'assets/user/images/ico_like_comment_on.svg" alt="" onclick="setLikeComment(this, ' + "'" + res.data.answer[i].like_cnt + "'" + ', ' + "'" + res.data.answer[i].commentid + "'" + ', ' + "'0'" + ');">';
                    } else {
                        html += '<img class="answer-heart pointer" src="' + base_url + 'assets/user/images/ico_like_comment_off.svg" alt="" onclick="setLikeComment(this, ' + "'" + res.data.answer[i].like_cnt + "'" + ', ' + "'" + res.data.answer[i].commentid + "'" + ', ' + "'1'" + ');">';
                    }
                } else {
                    html += '<img class="answer-heart pointer" src="' + base_url + 'assets/user/images/ico_like_comment_off.svg" alt="" onclick="window.location.href=' + "'" + base_url + "login'" + '">';
                }

                html += '<span class="cnt answer-cnt">' + res.data.answer[i].like_cnt + '</span>';

                html += '</div>';
                html += '</div>';
                html += '</div>';
                html += '</div>';
            }

            $(elemTarget).closest('.row-item').find('.answer-content').html(html);

            for (let i = 0; i < res.data.answer.length; i++) {
                if ($(elemTarget).closest('.row-item').find('#answer-comment-' + i).length !== 0) {
                    $(elemTarget).closest('.row-item').find('#answer-comment-' + i).css('height', $(elemTarget).closest('.row-item').find('#answer-comment-' + i)[0].scrollHeight);
                    $(elemTarget).closest('.row-item').find('#answer-comment-' + i).on('focus', function() {
                        $(this).attr('style', 'border: 0 !important; height: ' + $(elemTarget).closest('.row-item').find('#answer-comment-' + i)[0].scrollHeight + 'px;');
                    });
                }
            }

            $('#comment-content').val('');
            $('.community-submit-comment').text('등록');
            $('#private-status').attr('src', base_url + 'assets/user/images/ico_unlock.svg');
            $('#private-status').attr('onclick', 'setLockComment(this, ' + "'1'" + ');');
            $('.community-submit-comment').attr('onclick', 'setAddComment(' + "'" + communityid + "'" + ', ' + "'" + memberid + "'" + ');');
            $('.community-text-username').remove();
            $('#comment-content').attr('placeholder', '댓글을 입력해주세요.');
            $('#comment-content').css({
                'height': '36px',
                'background-color': '#fff',
                'padding': '7px 50px 0 15px'
            });
        } catch (e) {
            console.log(e);
            $('#spinner_overay').css('display', 'none');
            showWarningDialog('네트워크상태가 불안정합니다.<br>다시 시도해주세요.', '', '', '확인', 'closeDialog(false);', false);
        }
    }, 100);
}
/* 
 * 답댓글 더보기뷰에서 수정 설정
 *
 * */
function setSettingUpdateSubComment(element, commentid, private_status, communityid, memberid) {
    $(element).parent().slideUp(200);
    const content = $(element).closest('.answer-info').find('.answer-comment').val();
    $('#comment-content').val(content);
    $('#comment-content').trigger('focus');

    if (private_status === '0071') {
        $('#private-status').attr('src', base_url + 'assets/user/images/ico_unlock.svg');
        $('#private-status').attr('onclick', 'setLockComment(this, ' + "'1'" + ');');
        lockStatus = private_status;
    }

    if (private_status === '0072') {
        $('#private-status').attr('src', base_url + 'assets/user/images/ico_lock.svg');
        $('#private-status').attr('onclick', 'setLockComment(this, ' + "'0'" + ');');
        lockStatus = private_status;
    }

    $('.community-text-username').remove();
    $('#comment-content').attr('placeholder', '댓글을 입력해주세요.');
    $('#comment-content').css({
        'height': '36px',
        'background-color': '#fff',
        'padding': '7px 50px 0 15px'
    });
    $('.community-submit-comment').text('수정');
    $('.community-submit-comment').attr('onclick', 'setUpdateComment(' + "'" + commentid + "'" + ', ' + "'" + communityid + "'" + ', ' + "'" + memberid + "'" + ', ' + "'subcomment'" + ');');
}
/* 
 * 댓글 더보기뷰에서 수정 설정
 *
 * */
function setSettingUpdateComment(element, commentid, private_status, communityid, memberid) {
    $(element).closest('.right-section').find('.info-option').slideUp(200);
    const content = $(element).closest('.row-item').find('.txt-comment').val();
    $('#comment-content').val(content);
    $('#comment-content').trigger('focus');

    if (private_status === '0071') {
        $('#private-status').attr('src', base_url + 'assets/user/images/ico_unlock.svg');
        $('#private-status').attr('onclick', 'setLockComment(this, ' + "'1'" + ');');
        lockStatus = private_status;
    }

    if (private_status === '0072') {
        $('#private-status').attr('src', base_url + 'assets/user/images/ico_lock.svg');
        $('#private-status').attr('onclick', 'setLockComment(this, ' + "'0'" + ');');
        lockStatus = private_status;
    }

    $('.community-text-username').remove();
    $('#comment-content').attr('placeholder', '댓글을 입력해주세요.');
    $('#comment-content').css({
        'height': '36px',
        'background-color': '#fff',
        'padding': '7px 50px 0 15px'
    });
    $('.community-submit-comment').text('수정');
    $('.community-submit-comment').attr('onclick', 'setUpdateComment(' + "'" + commentid + "'" + ', ' + "'" + communityid + "'" + ', ' + "'" + memberid + "'" + ', ' + "'comment'" + ');');
}

/* 
 * 댓글 수정
 *
 * */
function setUpdateComment(commentid, communityid, memberid, index) {
    if ($('#comment-content').val().trim() === '') {
        showToast('warning', '댓글내용을 입력해주세요.', 260);
        return;
    }

    $('#spinner_overay').css('display', 'block');

    setTimeout(async function() {
        try {
            const res = await ajaxRequest(base_url + 'user/community/community_detail/setUpdateComment', 'POST', {
                commentid: commentid,
                content: $('#comment-content').val(),
                lockStatus: lockStatus
            }, 'json');

            $('#spinner_overay').css('display', 'none');
            const rows = $('.comment-content').find('.row-item');

            $(rows).each(function(idx) {
                if (index === 'comment') {
                    if (parseInt($(this).data('commentid')) === parseInt(res.data.commentid)) {
                        $(this).find('#txt-comment-' + idx).val(res.data.content);

                        if (lockStatus === '0071') {
                            $(this).find('.txt-name').attr('style', '');
                            $(this).find('#txt-key').css('display', 'none');
                        } else {
                            $(this).find('.txt-name').css('color', '#999999');
                            $(this).find('#txt-key').css('display', 'block');
                        }

                        $(this).find('#update-comment').attr('onclick', 'setSettingUpdateComment(this, ' + "'" + res.data.commentid + "'" + ', ' + "'" + lockStatus + "'" + ', ' + "'" + communityid + "'" + ', ' + "'" + memberid + "'" + ');');
                    }
                }

                if (index === 'subcomment') {
                    if (parseInt($(this).data('commentid')) === parseInt(res.data.pid)) {
                        const subrows = $(this).find('.answer-item');

                        $(subrows).each(function(idx) {
                            if (parseInt($(this).data('subcommentid')) === parseInt(res.data.commentid)) {
                                $(this).find('#answer-comment-' + idx).val(res.data.content);

                                if (lockStatus === '0071') {
                                    $(this).find('.answer-name').attr('style', '');
                                    $(this).find('#answer-key').css('display', 'none');
                                } else {
                                    $(this).find('.answer-name').css('color', '#999999');
                                    $(this).find('#answer-key').css('display', 'block');
                                }

                                $(this).find('#update-subcomment').attr('onclick', 'setSettingUpdateSubComment(this, ' + "'" + res.data.commentid + "'" + ', ' + "'" + lockStatus + "'" + ', ' + "'" + communityid + "'" + ', ' + "'" + memberid + "'" + ');');
                            }
                        })
                    }
                }

            });

            $('#comment-content').val('');
            $('.community-submit-comment').text('등록');
            $('#private-status').attr('src', base_url + 'assets/user/images/ico_unlock.svg');
            $('#private-status').attr('onclick', 'setLockComment(this, ' + "'1'" + ');');
            $('.community-submit-comment').attr('onclick', 'setAddComment(' + "'" + communityid + "'" + ', ' + "'" + memberid + "'" + ');');
        } catch (e) {
            $('#spinner_overay').css('display', 'none');
            showWarningDialog('네트워크상태가 불안정합니다.<br>다시 시도해주세요.', '', '', '확인', 'closeDialog(false);', false);
        }
    }, 100);
}

/* 
 * 답댓글 더보기뷰에서 삭제 설정
 *
 * */
function setRemoveSubComment(subcommentid, communityid, memberid, commentid) {
    closeDialog(false);
    $('#spinner_overay').css('display', 'block');

    setTimeout(async function() {
        try {
            await ajaxRequest(base_url + 'user/community/community_detail/setRemoveSubComment', 'POST', {
                commentid: subcommentid
            }, 'json');

            $('#spinner_overay').css('display', 'none');
            const rows = $('.comment-content').find('.row-item');

            $(rows).each(function() {
                if (parseInt($(this).data('commentid')) === parseInt(commentid)) {
                    const subrows = $(this).find('.answer-item');

                    $(subrows).each(function() {
                        if (parseInt($(this).data('subcommentid')) === parseInt(subcommentid)) {
                            $(this).closest('.left-section').find('#answer-cnt').attr('onclick', 'setConfirmAnswerComment(this, ' + "'" + communityid + "'" + ', ' + "'" + commentid + "'" + ', ' + "'" + (subrows.length - 1) + "'" + ');');

                            if (subrows.length - 1 === 0) {
                                $(this).closest('.left-section').find('#answer-cnt').css('display', 'none');
                                $(this).parent().css('display', 'none');
                            }

                            $(this).remove();
                        }
                    });
                }
            });

            $('#comment-content').val('');
            $('.community-text-username').remove();
            $('#comment-content').attr('placeholder', '댓글을 입력해주세요.');
            $('#comment-content').css({
                'height': '36px',
                'background-color': '#fff',
                'padding': '7px 50px 0 15px'
            });
            $('.community-submit-comment').text('등록');
            $('#private-status').attr('src', base_url + 'assets/user/images/ico_unlock.svg');
            $('#private-status').attr('onclick', 'setLockComment(this, ' + "'1'" + ');');
            $('.community-submit-comment').attr('onclick', 'setAddComment(' + "'" + communityid + "'" + ', ' + "'" + memberid + "'" + ');');
        } catch (e) {
            $('#spinner_overay').css('display', 'none');
            showWarningDialog('네트워크상태가 불안정합니다.<br>다시 시도해주세요.', '', '', '확인', 'closeDialog(false);', false);
        }
    }, 300);
}

/* 
 * 댓글 더보기뷰에서 삭제 설정
 *
 * */
function setRemoveComment(commentid, communityid, memberid) {
    closeDialog(false);
    $('#spinner_overay').css('display', 'block');

    setTimeout(async function() {
        try {
            await ajaxRequest(base_url + 'user/community/community_detail/setRemoveComment', 'POST', {
                commentid: commentid
            }, 'json');

            $('#spinner_overay').css('display', 'none');
            const rows = $('.comment-content').find('.row-item');

            $(rows).each(function() {
                if (parseInt($(this).data('commentid')) === parseInt(commentid)) {
                    $(this).remove();
                }
            });

            $('#comment-cnt').text(parseInt($('#comment-cnt').text()) - 1);
            $('#comment-content').val('');
            $('.community-text-username').remove();
            $('#comment-content').attr('placeholder', '댓글을 입력해주세요.');
            $('#comment-content').css({
                'height': '36px',
                'background-color': '#fff',
                'padding': '7px 50px 0 15px'
            });
            $('.community-submit-comment').text('등록');
            $('#private-status').attr('src', base_url + 'assets/user/images/ico_unlock.svg');
            $('#private-status').attr('onclick', 'setLockComment(this, ' + "'1'" + ');');
            $('.community-submit-comment').attr('onclick', 'setAddComment(' + "'" + communityid + "'" + ', ' + "'" + memberid + "'" + ');');
        } catch (e) {
            $('#spinner_overay').css('display', 'none');
            showWarningDialog('네트워크상태가 불안정합니다.<br>다시 시도해주세요.', '', '', '확인', 'closeDialog(false);', false);
        }
    }, 300);
}

/* 
 * 댓글 더보기뷰 취소(비노출)설정
 *
 * */
function setCloseMoreComment(element, communityid, memberid, index) {
    if (index === 'comment') {
        const value = $(element).closest('.right-section').find('.info-option').attr('style');

        if (value.search('display: none') == -1) {
            $(element).closest('.right-section').find('.info-option').slideUp(200);
        }
    }

    if (index === 'subcomment') {
        const value = $(element).closest('.right-info').find('.info-option').attr('style');

        if (value.search('display: none') == -1) {
            $(element).closest('.right-info').find('.info-option').slideUp(200);
        }
    }

    $('#comment-content').val('');
    $('.community-text-username').remove();
    $('#comment-content').attr('placeholder', '댓글을 입력해주세요.');
    $('#comment-content').css({
        'height': '36px',
        'background-color': '#fff',
        'padding': '7px 50px 0 15px'
    });
    $('.community-submit-comment').text('등록');
    $('#private-status').attr('src', base_url + 'assets/user/images/ico_unlock.svg');
    $('#private-status').attr('onclick', 'setLockComment(this, ' + "'1'" + ');');
    $('.community-submit-comment').attr('onclick', 'setAddComment(' + "'" + communityid + "'" + ', ' + "'" + memberid + "'" + ');');
}

/*
 * 답댓글 확인
 *
 * */
async function setConfirmAnswerComment(element, communityid, commentid, answer_cnt) {
    try {
        if ($(element).closest('.left-section').find('.answer-content').attr('style').search('display: none;') === -1) {
            $(element).closest('.left-section').find('.answer-content').slideUp();
            setTimeout(function() {
                $(element).closest('.left-section').find('.answer-content').css('display', 'none');
                $(element).text('답댓글 ' + answer_cnt + '개 보기');
            }, 300);
        } else {
            const res = await ajaxRequest(base_url + 'user/community/community_detail/setConfirmAnswerComment', 'POST', {
                commentid: commentid
            }, 'json');

            let html = '';

            for (let i = 0; i < res.data.answer.length; i++) {
                html += '<div class="answer-item" data-subcommentid="' + res.data.answer[i].commentid + '">';

                if (res.data.answer[i].avatar !== '') {
                    if (res.data.answer[i].avatar.search('api.otongtong.net') !== -1) {
                        html += '<img class="answer-avatar" src="' + res.data.answer[i].avatar + '" alt="">';
                    } else {
                        html += '<img class="answer-avatar" src="' + base_image + res.data.answer[i].avatar + '" alt="">';
                    }
                } else {
                    html += '<img class="answer-avatar" src="' + base_url + 'assets/user/images/ico_avatar.svg" alt="">';
                }

                html += '<div class="answer-info">';


                html += '<div class="row-info mb-3">';
                html += '<div class="left-info" style="display: flex; align-items: center;">';

                if (res.data.answer[i].private_status === '0072') {
                    html += '<span class="answer-name" style="color: #999999;">' + res.data.answer[i].username + '</span>';
                    html += '<img id="answer-key" class="ml-4" src="' + base_url + 'assets/user/images/ico_lock_1.svg" alt="" style="width: 12px; height: 12px; display: block;">';
                } else {
                    html += '<span class="answer-name">' + res.data.answer[i].username + '</span>';
                    html += '<img id="answer-key" class="ml-4" src="' + base_url + 'assets/user/images/ico_lock_1.svg" alt="" style="width: 12px; height: 12px; display: none;">';
                }

                html += '</div>';
                html += '<div class="right-info">';

                // 로그인이 되어있으면 댓글 더보기 노출
                if (res.data.memberid !== 0) {
                    if (res.data.memberid === res.data.answer[i].memberid) {
                        html += '<img class="pointer" src="' + base_url + 'assets/user/images/ico_more.svg" alt="" style="width: 15px; height: 15px;" onclick="setShowMoreSubComment(this);">';
                        html += '<div class="info-option" style="display: none;">';
                        html += '<a id="update-subcomment" href="javascript:void(0)" class="txt" onclick="setSettingUpdateSubComment(this, ' + "'" + res.data.answer[i].commentid + "'" + ', ' + "'" + res.data.answer[i].private_status + "'" + ', ' + "'" + communityid + "'" + ', ' + "'" + res.data.memberid + "'" + ');">수정</a>';
                        html += '<a href="javascript:void(0)" class="txt" onclick="showSettingDialog(' + "'답댓글을 삭제하시겠습니까?'" + ', ' + "''" + ', ' + "''" + ', ' + "'취소'" + ', ' + "'확인'" + ', ' + "'closeDialog(false);'" + ', ' + "'setRemoveSubComment(" + res.data.answer[i].commentid + ", " + communityid + ", " + res.data.memberid + ", " + commentid + ");', false" + ');">삭제</a>';
                        html += '<a href="javascript:void(0)" class="txt" onclick="setCloseMoreComment(this, ' + "'" + communityid + "'" + ', ' + "'" + res.data.memberid + "'" + ', ' + "'subcomment'" + ');">취소</a>';
                        html += '</div>';
                    }
                }

                html += '</div>';
                html += '</div>';
                html += '<div class="row-info">';
                html += '<div class="left-info active">';

                if (res.data.answer[i].private_status === '0072') { // 비밀댓글이면
                    // 댓글작성자와 게시글작성자만 내용 확인
                    if (res.data.memberid === res.data.answer[i].memberid || res.data.memberid === res.data.answer[i].memid) {
                        html += '<textarea id="answer-comment-' + i + '" class="answer-comment" placeholder="" readonly>' + res.data.answer[i].content + '</textarea>';
                    }
                } else { // 비밀댓글이 아니면
                    html += '<textarea id="answer-comment-' + i + '" class="answer-comment" placeholder="" readonly>' + res.data.answer[i].content + '</textarea>';
                }

                html += '</div>';
                html += '</div>';

                html += '<div class="row-info">';
                html += '<div class="left-info active">';

                if (res.data.memberid !== 0) {
                    if (res.data.answer[i].like_status !== '0') {
                        html += '<img class="answer-heart pointer" src="' + base_url + 'assets/user/images/ico_like_comment_on.svg" alt="" onclick="setLikeComment(this, ' + "'" + res.data.answer[i].like_cnt + "'" + ', ' + "'" + res.data.answer[i].commentid + "'" + ', ' + "'0'" + ');">';
                    } else {
                        html += '<img class="answer-heart pointer" src="' + base_url + 'assets/user/images/ico_like_comment_off.svg" alt="" onclick="setLikeComment(this, ' + "'" + res.data.answer[i].like_cnt + "'" + ', ' + "'" + res.data.answer[i].commentid + "'" + ', ' + "'1'" + ');">';
                    }
                } else {
                    html += '<img class="answer-heart pointer" src="' + base_url + 'assets/user/images/ico_like_comment_off.svg" alt="" onclick="window.location.href=' + "'" + base_url + "login'" + '">';
                }

                html += '<span class="cnt answer-cnt">' + res.data.answer[i].like_cnt + '</span>';

                html += '</div>';
                html += '</div>';
                html += '</div>';
                html += '</div>';
            }

            $(element).closest('.left-section').find('.answer-content').html(html);
            $(element).closest('.left-section').find('.answer-content').slideDown();
            $(element).text('답댓글 숨기기');

            for (let i = 0; i < res.data.answer.length; i++) {
                if ($(element).closest('.left-section').find('#answer-comment-' + i).length !== 0) {
                    $(element).closest('.left-section').find('#answer-comment-' + i).css('height', $(element).closest('.left-section').find('#answer-comment-' + i)[0].scrollHeight);
                    $(element).closest('.left-section').find('#answer-comment-' + i).on('focus', function() {
                        $(this).attr('style', 'border: 0 !important; height: ' + $(element).closest('.left-section').find('#answer-comment-' + i)[0].scrollHeight + 'px;');
                    });
                }
            }
        }
    } catch (e) {
        showWarningDialog('네트워크상태가 불안정합니다.<br>다시 시도해주세요.', '', '', '확인', 'closeDialog(false);', false);
    }
}

/*
 * 게시글 댓글 좋아요 설정
 *
 * */
function setLikeComment(element, likeCnt, commentid, index) {

    setTimeout(async function() {
        try {
            await ajaxRequest(base_url + 'user/community/community_detail/setLikeComment', 'POST', {
                index: index,
                commentid: commentid
            }, 'json');

            if (index === '0') {
                $(element).attr('src', base_url + 'assets/user/images/ico_like_comment_off.svg');
                $(element).parent().find('.cnt').html(parseInt(likeCnt) - 1);
                $(element).attr('onclick', 'setLikeComment(this, ' + "'" + (parseInt(likeCnt) - 1) + "'" + ', ' + "'" + commentid + "'" + ', ' + "'1'" + ');');
            } else {
                $(element).attr('src', base_url + 'assets/user/images/ico_like_comment_on.svg');
                $(element).parent().find('.cnt').html(parseInt(likeCnt) + 1);
                $(element).attr('onclick', 'setLikeComment(this, ' + "'" + (parseInt(likeCnt) + 1) + "'" + ', ' + "'" + commentid + "'" + ', ' + "'0'" + ');');
            }
        } catch (e) {
            showWarningDialog('네트워크상태가 불안정합니다.<br>다시 시도해주세요.', '', '', '확인', 'closeDialog(false);', false);
        }
    }, 100);
}

/*
 * 게시글 정렬순 설정
 *
 * */
function setSortData(element, index) {
    $('#spinner_overay').css('display', 'block');
    $(element).parent().find('.active').removeClass('active');
    $(element).addClass('active');
    
    setTimeout(async function() {
        try {
            const res = await ajaxRequest(base_url + 'user/community/community_detail/setSortData', 'POST', {
                index: index
            }, 'json');

            $('#spinner_overay').css('display', 'none');
            let html = '';

            for (let i = 0; i < res.data.data.length; i++) {
                html += '<div class="swiper-slide">';
                html += '<div id="swiper-horizontal-' + i + '" class="swiper-container community-detail-background" style="height: 100%; " onclick="setShowMute();">';
                html += '<div class="swiper-wrapper">';

                for (let j = 0; j < res.data.images.length; j++) {
                    if (res.data.images[j].communityid === res.data.data[i].communityid) {
                         if(res.data.images[j]['url'] == null || res.data.images[j]['url'] == '' ){ /**add by hj 2022/08/12  */
                            html += '<div class="swiper-slide"  style=" display: flex; justify-content: center; align-items: center;">';

                            html += '<img class="lazy" data-original="' + base_url + '/assets/user/images/placeholder_chartong.png" src="' + base_url + '/assets/user/images/placeholder_chartong.png" alt="" style="width:100%; height: auto;">';
                            html += '</div>';

                        }else{
                            html += '<div class="swiper-slide"  style=" display: flex; justify-content: center; align-items: center; background:#000;">';

                            if (res.data.images[j].kind === '0061') {
                                html += '<img class="media-detail" src="' + base_image + res.data.images[j].url + '" alt="" style="width: 100%; height: auto;">';
                            } else {
                                html += '<video class="media-detail" autoplay muted loop="loop" preload="metadata" playsinline poster="' + base_url + 'assets/user/images/placeholder_chartong.png" style="width: 100%; height: auto ; ">';
                                html += '<source src="' + base_image + res.data.images[j].url + '#t=0.1" type=video/mp4>';
                                html += '</video>';
                            }
                            html += '</div>';

                        }

                    }
                }

                html += '</div>';
                html += '</div>';
                html += '<img class="community-ico-mute" src="' + base_url + 'assets/user/images/ico_mute_off.png" alt="" onclick="">';
                html += '<div class="community-detail">';
                html += '<div></div>';
                html += '<div class="community-detail-info">';

                html += '<div>';

                if (res.data.memberid !== 0) {
                    html += '<img class="icons pointer" src="' + base_url + 'assets/user/images/ico_profile.svg" alt="" onclick="window.location.href=' + "'" + base_url + "myprofile?memberid=" + res.data.data[i].memberid + "'" + '">';
                } else {
                    html += '<img class="icons pointer" src="' + base_url + 'assets/user/images/ico_profile.svg" alt="" onclick="window.location.href=' + "'" + base_url + "login'" + '">';
                }

                html += '</div>';

                html += '<div>';

                if (res.data.memberid !== 0) {
                    if (res.data.data[i].like_status !== '0') {
                        html += '<img class="icons pointer" src="' + base_url + 'assets/user/images/ico_heart_selected.svg" alt="" onclick="setLikeCommunity(this, ' + "'" + res.data.data[i].commlike_cnt + "'" + ', ' + "'" + res.data.data[i].communityid + "'" + ', ' + "'0'" + ');">';
                    } else {
                        html += '<img class="icons pointer" src="' + base_url + 'assets/user/images/ico_heart_unselected.svg" alt="" onclick="setLikeCommunity(this, ' + "'" + res.data.data[i].commlike_cnt + "'" + ', ' + "'" + res.data.data[i].communityid + "'" + ', ' + "'1'" + ');">';
                    }
                } else {
                    html += '<img class="icons pointer" src="' + base_url + 'assets/user/images/ico_heart_unselected.svg" alt="" onclick="window.location.href=' + "'" + base_url + "login'" + '">';
                }

                html += '<p class="txt-cnt">' + res.data.data[i].commlike_cnt + '</p>';
                html += '</div>';

                if (res.data.data[i].iscomment === '1') {
                    html += '<div>';
                    html += '<img class="icons pointer" src="' + base_url + 'assets/user/images/ico_comment.svg" alt="" onclick="setShowComment(' + "'" + res.data.data[i].communityid + "'" + ', ' + "'" + res.data.data[i].memberid + "'" + ');">';
                    html += '<p id="comment-cnt" class="txt-cnt">' + res.data.data[i].commcoment_cnt + '</p>';
                    html += '</div>';
                }

                if (res.data.data[i].ismessage === '1') {
                    html += '<div>';
                    html += '<img class="icons pointer" src="' + base_url + 'assets/user/images/ico_message.svg" alt="" onclick="setConnectTongTongApp(' + "'community_detail'" + ', ' + "'charting'" + ', ' + "'" + res.data.data[i].userkey + "'" + ');">';
                    html += '</div>';
                }

                if (res.data.memberid !== 0 && res.data.memberid == res.data.data[i].memberid) {
                    html += '<div>';
                    html += '<img class="icons pointer" src="' + base_url + 'assets/user/images/ico_community.png" alt="" onclick="window.location.href=' + "'" + base_url + "community_update?communityid=" + res.data.data[i].communityid + "'" + '">';
                    html += '</div>';
                    html += '<div>';
                    html += '<img class="icons pointer" src="' + base_url + 'assets/user/images/ico_delete.svg" alt="" onclick="showSettingDialog(' + "'게시글을 삭제하시겠습니까?'" + ', ' + "''" + ', ' + "''" + ', ' + "'취소'" + ', ' + "'확인'" + ', ' + "'closeDialog(true);'" + ', ' + "'setDeleteCommunity(" + res.data.data[i].communityid + ");', false" + ');">';
                    html += '</div>';
                }

                html += '</div>';
                html += '<div class="community-detail-desc">';
                html += '<p class="memberinfo">' + res.data.data[i].username + '</p>';
                html += '<p class="comm-title">' + res.data.data[i].title + '</p>';
                html += '<p class="description">' + res.data.data[i].content + '</p>';
                if (res.data.data[i].tags  !== '#'){
                html += '<p class="description">' + res.data.data[i].tags + '</p>'; 
                }
                if(res.data.data[i].memberid == $('#community-detail').data('memberid')){ 
                    if(res.data.data[i].is_nft_publish== '1'){
                    } 
                    else if(res.data.data[i].is_nft_publish== '0'){
                       html += '<p class="community-buttons"> <img class="ml-3 pointer" src="' + base_url + 'assets/user/images/ico_help.png" alt="" style="width: 20px; height: 20px;margin-right:5px;" onclick="setShowUpdateHelp();">';
                       html += '  <a href="javascript:void(0)" id="nft-info" onclick="setNFTPublishing('+ res.data.data[i].communityid+');" class="btn-action active">NFT 발행</a>' ;
                    }
            
                    html += '</p>'; 
                     
                   /*  for (let j = 0; j < res.data.images.length; j++) {
                        if (res.data.images[j].communityid === res.data.data[i].communityid) {
                            
                            if(res.data.images[j]['url'] != null || res.data.images[j]['url'] != ''){   */
                           /*      if(res.data.data[i].is_nft_publish== '1'){
                                } 
                                else if(res.data.data[i].is_nft_publish== '0'){
                                    html += '<p class="community-buttons"> <img class="ml-3 pointer" src="' + base_url + 'assets/user/images/ico_help.png" alt="" style="width: 20px; height: 20px;margin-right:5px;" onclick="setShowUpdateHelp();">';
                                    html += '  <a href="javascript:void(0)" id="nft-info" onclick="setNFTPublishing('+ res.data.data[i].communityid+');" class="btn-action active">NFT 발행</a>' ;
                                }
                       
                                html += '</p>'; */
                       /*        }
                            }
                        } */
                            
                }
                html += '</div>';
                html += '</div>';
                html += '</div>';
            }

            $('#swiper-vertical .swiper-wrapper').html(html);

            swiperVertical = new Swiper('#swiper-vertical', {
                direction: 'vertical',
                centeredSlides: true
            });

            // swiperHorizontal = new Swiper('#swiper-horizontal-0', {
            //     centeredSlides: true
            // });
        } catch (e) {
            $('#spinner_overay').css('display', 'none');
            showWarningDialog('네트워크상태가 불안정합니다.<br>다시 시도해주세요.', '', '', '확인', 'closeDialog(true);', true);
        }
    }, 100);
}

/*
 * 비밀댓글 설정
 *
 * */
function setLockComment(element, index) {
    if (index === '0') {
        $(element).attr('src', base_url + 'assets/user/images/ico_unlock.svg');
        $(element).attr('onclick', 'setLockComment(this, ' + "'1'" + ');');
        lockStatus = '0071';
    }

    if (index === '1') {
        $(element).attr('src', base_url + 'assets/user/images/ico_lock.svg');
        $(element).attr('onclick', 'setLockComment(this, ' + "'0'" + ');');
        lockStatus = '0072';
    }
}

/*
 * 댓글 추가
 *
 * */
function setAddComment(communityid, memberid) {
    if ($('#comment-content').val().trim() === '') {
        showToast('warning', '댓글내용을 입력해주세요.', 260);
        return;
    }

    setTimeout(async function() {
        try {
            const res = await ajaxRequest(base_url + 'user/community/community_detail/setAddComment', 'POST', {
                lock_status: lockStatus,
                content: $('#comment-content').val().trim(),
                communityid: communityid
            }, 'json');

            if (res.data.reward) {
                showToast('success', '댓글 10회 작성완료!<br>' + res.data.amount + 'TTC 지급되었습니다.', 260);
            }

            let html = '';

            for (let i = 0; i < res.data.comments.length; i++) {
                html += '<div class="row-item" data-commentid="' + res.data.comments[i].commentid + '">';

                if (res.data.comments[i].avatar !== '') {
                    if (res.data.comments[i].avatar.search('api.otongtong.net') !== -1) {
                        html += '<img class="avatar" src="' + res.data.comments[i].avatar + '" alt="">';
                    } else {
                        html += '<img class="avatar" src="' + base_image + res.data.comments[i].avatar + '" alt="">';
                    }
                } else {
                    html += '<img class="avatar" src="' + base_url + 'assets/user/images/ico_avatar.svg" alt="">';
                }

                html += '<div class="right-content">';
                html += '<div class="row-section mb-3">';
                html += '<div class="left-section">';
                html += '<div style="display: flex; align-items: center;">';

                if (res.data.comments[i].private_status === '0072') {
                    html += '<span class="txt-name" style="color: #999999;">' + res.data.comments[i].username + '</span>';
                    html += '<img id="txt-key" class="ml-4" src="' + base_url + 'assets/user/images/ico_lock_1.svg" alt="" style="width: 12px; height: 12px; display: block;">';
                } else {
                    html += '<span class="txt-name">' + res.data.comments[i].username + '</span>';
                    html += '<img id="txt-key" class="ml-4" src="' + base_url + 'assets/user/images/ico_lock_1.svg" alt="" style="width: 12px; height: 12px; display: none;">';
                }

                html += '</div>';
                html += '</div>';
                html += '<div class="right-section">';

                // 로그인이 되어있으면 댓글 더보기 노출
                if (res.data.memberid !== 0) {
                    html += '<img class="pointer" src="' + base_url + 'assets/user/images/ico_more.svg" alt="" style="width: 15px; height: 15px;" onclick="setShowMoreComment(this);">';
                    html += '<div class="info-option" style="display: none;">';

                    // 댓글작성자인 경우
                    if (res.data.memberid === res.data.comments[i].memberid) {
                        html += '<a href="javascript:void(0)" class="txt" onclick="setSettingAddAnswerComment(this, ' + "'" + res.data.comments[i].commentid + "'" + ', ' + "'" + res.data.comments[i].username + "'" + ', ' + "'" + communityid + "'" + ', ' + "'" + res.data.memberid + "'" + ');">답댓글</a>';
                        html += '<a href="javascript:void(0)" id="update-comment" class="txt" onclick="setSettingUpdateComment(this, ' + "'" + res.data.comments[i].commentid + "'" + ', ' + "'" + res.data.comments[i].private_status + "'" + ', ' + "'" + communityid + "'" + ', ' + "'" + res.data.memberid + "'" + ');">수정</a>';
                        html += '<a href="javascript:void(0)" class="txt" onclick="showSettingDialog(' + "'댓글을 삭제하시겠습니까?'" + ', ' + "''" + ', ' + "''" + ', ' + "'취소'" + ', ' + "'확인'" + ', ' + "'closeDialog(false);'" + ', ' + "'setRemoveComment(" + res.data.comments[i].commentid + ", " + communityid + ", " + res.data.memberid + ");', false" + ');">삭제</a>';
                        html += '<a href="javascript:void(0)" class="txt" onclick="setCloseMoreComment(this, ' + "'" + communityid + "'" + ', ' + "'" + res.data.memberid + "'" + ', ' + "'comment'" + ');">취소</a>';
                    } else { // 댓글작성자가 아닌 경우
                        html += '<a href="javascript:void(0)" class="txt" onclick="setSettingAddAnswerComment(this, ' + "'" + res.data.comments[i].commentid + "'" + ', ' + "'" + res.data.comments[i].username + "'" + ', ' + "'" + communityid + "'" + ', ' + "'" + res.data.memberid + "'" + ');">답댓글</a>';
                        html += '<a href="javascript:void(0)" class="txt" onclick="setCloseMoreComment(this, ' + "'" + communityid + "'" + ', ' + "'" + res.data.memberid + "'" + ', ' + "'comment'" + ');">취소</a>';
                    }

                    html += '</div>';
                }

                html += '</div>';
                html += '</div>';
                html += '<div class="row-section">';
                html += '<div class="left-section active">';

                if (res.data.comments[i].private_status === '0072') { // 비밀댓글이면
                    // 댓글작성자와 게시글작성자만 내용 확인
                    if (res.data.memberid === res.data.comments[i].memberid || res.data.memberid === res.data.comments[i].memid) {
                        html += '<textarea id="txt-comment-' + i + '" class="txt-comment" placeholder="" readonly>' + res.data.comments[i].content + '</textarea>';
                    }
                } else { // 비밀댓글이 아니면
                    html += '<textarea id="txt-comment-' + i + '" class="txt-comment" placeholder="" readonly>' + res.data.comments[i].content + '</textarea>';
                }

                html += '</div>';
                html += '</div>';
                html += '<div class="row-section">';
                html += '<div class="left-section active">';

                html += '<div class="answer-comment-info">';

                if (res.data.memberid !== 0) {
                    if (res.data.comments[i].like_status !== '0') {
                        html += '<img class="heart pointer" src="' + base_url + 'assets/user/images/ico_like_comment_on.svg" alt="" onclick="setLikeComment(this, ' + "'" + res.data.comments[i].like_cnt + "'" + ', ' + "'" + res.data.comments[i].commentid + "'" + ', ' + "'0'" + ');">';
                    } else {
                        html += '<img class="heart pointer" src="' + base_url + 'assets/user/images/ico_like_comment_off.svg" alt="" onclick="setLikeComment(this, ' + "'" + res.data.comments[i].like_cnt + "'" + ', ' + "'" + res.data.comments[i].commentid + "'" + ', ' + "'1'" + ');">';
                    }
                } else {
                    html += '<img class="heart pointer" src="' + base_url + 'assets/user/images/ico_like_comment_off.svg" alt="" onclick="window.location.href=' + "'" + base_url + "login'" + '">';
                }

                html += '<span class="cnt">' + res.data.comments[i].like_cnt + '</span>';

                if (res.data.comments[i].answer_cnt !== '0') {
                    html += '<span id="answer-cnt" class="ml-15 pointer" onclick="setConfirmAnswerComment(this, ' + "'" + communityid + "'" + ', ' + "'" + res.data.comments[i].commentid + "'" + ', ' + "'0'" + ');" style="font-size: 11px; color: #999999; display: inline-block;">답댓글 ' + res.data.comments[i].answer_cnt + '개 보기</span>';
                } else {
                    html += '<span id="answer-cnt" class="ml-15 pointer" onclick="setConfirmAnswerComment(this, ' + "'" + communityid + "'" + ', ' + "'" + res.data.comments[i].commentid + "'" + ', ' + "'" + res.data.comments[i].answer_cnt + "'" + ');" style="font-size: 11px; color: #999999; display: none;">답댓글 ' + res.data.comments[i].answer_cnt + '개 보기</span>';
                }

                html += '</div>';
                html += '<div class="answer-content" style="display: none;">';
                html += '</div>';
                html += '</div>';
                html += '</div>';
                html += '</div>';
                html += '</div>';
            }

            $('.community-comment-content .comment-content').html(html);

            for (let i = 0; i < res.data.comments.length; i++) {
                if (document.getElementById('txt-comment-' + i)) {
                    $('#txt-comment-' + i).css('height', document.getElementById('txt-comment-' + i).scrollHeight);
                    $('#txt-comment-' + i).on('focus', function() {
                        $(this).attr('style', 'border: 0 !important; height: ' + document.getElementById('txt-comment-' + i).scrollHeight + 'px;');
                    });
                }
            }

            $('#comment-content').val('');
            $('#comment-cnt').text(parseInt($('#comment-cnt').text()) + 1);
        } catch (e) {
            showWarningDialog('네트워크상태가 불안정합니다.<br>다시 시도해주세요.', '', '', '확인', 'closeDialog(false);', false);
        }
    }, 100);
}

/*
 * 게시글 삭제
 *
 * */
function setDeleteCommunity(communityid) {
    closeDialog(true);
    $('#spinner_overay').css('display', 'block');

    setTimeout(async function() {
        try {
            await ajaxRequest(base_url + 'user/community/community_detail/setDeleteCommunity', 'POST', {
                communityid: communityid
            }, 'json');

            reloadPage();
        } catch (e) {
            $('#spinner_overay').css('display', 'none');
            showWarningDialog('네트워크상태가 불안정합니다.<br>다시 시도해주세요.', '', '', '확인', 'closeDialog(true);', true);
        }
    }, 600);
}

/*
 * 스크롤 이벤트 처리
 *
 * */
$('.comment-content').on('scroll', function() {
    // 스크롤 시 댓글 더보기 뷰 전체 닫기
    $(this).find('.info-option').slideUp(200);
});

/*
 * 댓글등록입력창에서 포커스가 해제될 때의 이벤트 처리
 *
 * */ 
$('#comment-content').on('focusout', function(e) {});

/**? 클릭시 관련 문구 */
function setShowUpdateHelp() {
    showWarningDialog('-자신이 올린 차량 관련 이미지를 NFT<br>로 발행하여 보유, 판매할 수 있습니다.<br>   1회 발행시  <span style="color: #2b19dd;">10TTC </span> 가 소진됩니다<br>(<span style="color: #2b19dd;">통통지갑 </span>  설치 필요)    ', '', '', '확인', 'closeDialog(true);', true);
    //$('.dialog-footer').css('display', 'none');
}

 /**NFT 발행 문구 */
function  setNFTPublishing(id){
    commid =id;
    setTimeout(async function() {
        try { 
            setConnectTongTongApp('community_detail', 'tongtong', ''); 
        } catch (e) {
            $('#spinner_overay').css('display', 'none');
            showWarningDialog('네트워크상태가 불안정합니다.<br>다시 시도해주세요.', '', '', '확인', 'closeDialog(true);', true);
        }
    }, 200);
 }

/**발행완료 문구 */
function NFTPublishingmsg()
{
    showWarningDialog('NFT가 이미 발행 신청이 되었습니다.<br><br>   <span style="color: #2b19dd;">최대 10분 후 보유 NFT목록에서 </span>  <br><span style="color: #2b19dd;">확인 가능합니다. </span><br>   ', '', '', '확인', 'closeDialog(true);', true);
}

function setCoinInfo(walletaddress, walletname, walletpassword, balance_ttcoin, balance_gtc, balance_ctc) {
    eventmember = $('#community-detail').data('eventmember')
    if(eventmember == "Y"){
        setTimeout(async function() {
            try {
                const res = await ajaxRequest(base_url + 'user/community/community_detail/nft_publishing', 'POST', {
                    walletaddress : walletaddress,
                    walletname : walletname,
                    walletpassword : walletpassword,
                    balance_ttcoin : balance_ttcoin,
                    balance_gtc : balance_gtc ,
                    balance_ctc : balance_ctc,
                    communityid: commid ,
                    coin_amount :0.0002,
                 }, 'json');

                $('#spinner_overay').css('display', 'none');
                showWarningDialog(' NFT가 발행되었습니다. <br><br><span style="color: #2b19dd;"> 10분 뒤 보유 NFT목록에서</span> <br><span style="color: #2b19dd;">확인 가능합니다 .</span>', '', '', '확인', 'closeDialog(true);', true); 
                $('.community-buttons').html('');
            } catch (e) {
                $('#spinner_overay').css('display', 'none');

                if (e.status === 402  || e.status === 404) {
                    showWarningDialog(e.message ? e.message : e.responseText, '', '', '확인', 'closeDialog(true);', true);
                } else {
                    showWarningDialog('네트워크상태가 불안정합니다.<br>다시 시도해주세요.', '', '', '확인', 'closeDialog(true);', true);
                }
            }
        }, 200);
    }else { 
        if (balance_ttcoin <= 10) {
            $('#spinner_overay').css('display', 'none');
            showWarningDialog(' <span style="color: #2b19dd;">통통지갑 잔고가 부족합니다 .</span><br><br> NFT 발행에는 10TTC가 소진됩니다.<br>통통지갑 잔고를 확인해주세요.', '', '', '확인', 'closeDialog(true);', true); 
        } else {
            setTimeout(async function() {
                try {
                    const res = await ajaxRequest(base_url + 'user/community/community_detail/nft_publishing', 'POST', {
                        walletaddress : walletaddress,
                        walletname : walletname,
                        walletpassword : walletpassword,
                        balance_ttcoin : balance_ttcoin,
                        balance_gtc : balance_gtc ,
                        balance_ctc : balance_ctc,
                        communityid: commid ,
                        coin_amount :10,
                     }, 'json');

                    $('#spinner_overay').css('display', 'none');
                    showWarningDialog(' NFT가 발행되었습니다. <br><br><span style="color: #2b19dd;"> 10분 뒤 보유 NFT목록에서</span> <br><span style="color: #2b19dd;">확인 가능합니다 .</span>', '', '', '확인', 'closeDialog(true);', true); 
                    $('.community-buttons').html('');
                } catch (e) {
                    $('#spinner_overay').css('display', 'none');

                    if (e.status === 402  || e.status === 404) {
                        showWarningDialog(e.message ? e.message : e.responseText, '', '', '확인', 'closeDialog(true);', true);
                    } else {
                        showWarningDialog('네트워크상태가 불안정합니다.<br>다시 시도해주세요.', '', '', '확인', 'closeDialog(true);', true);
                    }
                }
            }, 200);
        }
    }
}
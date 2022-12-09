/*
 * API : YouTube IFrame Player API
 * 참조 문서 : https://developers.google.com/youtube/iframe_api_reference?hl=ko#Playback_status
 * youtube Iframe API 함수화
 * 사용법 : youtubeIframeApi({videoOption 객체 참조}); 호출 후 download() 또는 play()
 * @param
 * param 객체
    {
        vid(필수, 문자) : youtube video id(defaultl: M7lc1UVf-VE)
        pid(필수, 문자) : 부모 id 입력(부모 element 하위에 생성 될 것이기 때문)
        cid(필수, 문자) : 생성할 element의 id(부모 element 하위에 생성 될 element의 id)
        height(숫자) : 생성될 elemente의 높이(default: 360px)
        width(숫자) : 생성될 elemente의 폭(default: 640px)
    }
 * @return
 * videoOption 객체
    {
        player(): youtube 영상 객체
        download(): 영상을 가져와 player 객체에 데이터 삽입하는 함수
        ready(): 영상이 준비되었으면 실행하는 함수
        url: 영상 원본의 url 주소
        duration: 영상의 전체 시간(길이, 재생 전에는 0으로 나옴)
        currentTime(): 영상 재생 시간(위치)
        state(): 현재 영상 상태
        stop(): 영상 멈춤
        pasuse(): 영상 일시정지
        start(): 영상 재생
        destroy(): 영상을 갖고있는 iframe 제거(div로 돌아감)
    }
*/
const youtubeIframeApi = (param) => {
    if (!param || !param.pid || !param.cid) {
        console.log(
            "실행 불가, 필수 값을 입력해주세요(pid, cid)\nparam: " + param.pid,
            param.cid
        );
        return;
    }

    const cidElement = document.getElementById(param.cId);
    if (cidElement) {
        console.log("이미 존재하는 cid 값 입니다.");
        return;
    }

    const parentElement = document.getElementById(param.pid);
    const newChildElement = document.createElement("div");
    newChildElement.id = param.cid;
    parentElement.appendChild(newChildElement);

    // 1. The <iframe> (and video player) will replace this <div> tag.
    //<div id="player"></div>

    // 2. This code loads the IFrame Player API code asynchronously.
    const firstScriptTag = document.getElementsByTagName("script")[0];
    const youtubeApiSrc = "https://www.youtube.com/iframe_api";
    if (firstScriptTag.src !== youtubeApiSrc) {
        const tag = document.createElement("script");
        tag.src = youtubeApiSrc;
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }
    // 4. The API will call this function when the video player is ready.
    function onPlayerReady(event) {
        event.target.playVideo();
    }
    // 5. The API calls this function when the player's state changes.
    //    The function indicates that when playing a video (state=1),
    //    the player should play for six seconds and then stop.
    let done = false;
    function onPlayerStateChange(event) {
        if (event.data == YT.PlayerState.PLAYING && !done) {
            setTimeout(videoOption.stop(), 6000);
            done = true;
        }
    }

    function consolePrint(str) {
        console.log(str);
    }

    function onPlayerError(event) {
        consolePrint(event);
    }

    function stateConfirm(p) {
        switch (p.getPlayerState()) {
            case 0:
                consolePrint("종료");
                break;
            case 1:
                consolePrint("재생 중");
                break;
            case 2:
                consolePrint("일시중지");
                break;
            case 3:
                consolePrint("버퍼링");
                break;
            case 5:
                consolePrint("동영상 신호(재생 가능)");
                break;
            default:
                consolePrint("시작되지 않음");
                break;
        }
    }

    const videoOption = {
        // 3. This function creates an <iframe> (and YouTube player)
        //    after the API code downloads.
        player: null,
        pid: param.pid,
        cid: param.cid,
        download: function onYouTubeIframeAPIReady() {
            if (!this.player) {
                this.player = new YT.Player(param.cid, {
                    height: param.height ? param.height : "360",
                    width: param.width ? param.width : "640",
                    videoId: param.vid ? param.vid : "M7lc1UVf-VE", //tvVzmFu9gX8
                    events: {
                        onReady: onPlayerReady,
                        onStateChange: onPlayerStateChange,
                        onError: onPlayerError,
                    },
                });
            }
        },
        url: function getVideoUrl() {
            return this.player.getVideoUrl();
        },
        duration: function getDuration() {
            return this.player.getDuration();
        },
        currentTime: function getCurrentTime() {
            return this.player.getCurrentTime();
        },
        state: function stateVideo() {
            stateConfirm(this.player);
        },
        stop: function stopVideo() {
            this.player.stopVideo();
        },
        pause: function pauseVideo() {
            this.player.pauseVideo();
        },
        play: function playVideo() {
            if (!this.player) {
                this.download();
            }
            this.player.playVideo();
        },
        destroy: function videoDestroy() {
            this.player.destroy();
            this.player = null;
            document.getElementById(this.cid).remove();
        },
    };

    return videoOption;
};

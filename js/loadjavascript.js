let base_url = '';
let base_image = '';

function loadJavascript(url, charset) {
    base_url = url.split('/')[0] + '//' + url.split('/')[2] + '/';
    base_image =( base_url.search('chatong.kr') !== -1|| base_url.search('chatong.ttnft.io')!==-1) ? 'https://image.chatong.kr/' : base_url;  
//    base_image = base_url.search('chatong.ttnft.io') !== -1 ? 'https://image.chatong.kr/' : base_url;
    const head = document.getElementsByTagName('head')[0];
    const script = document.createElement('script');
    script.type = 'text/javascript';

    if (charset !== null) {
        script.charset = "euc-kr";
    }

    script.src = url;
    head.appendChild(script);
}
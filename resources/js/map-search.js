let renderMap = (lat, log) => {
    return new Promise((resolve, reject)=>{
        var container = document.querySelector('#map'); //지도를 담을 영역의 DOM 레퍼런스
        var options = { //지도를 생성할 때 필요한 기본 옵션
            center: new kakao.maps.LatLng(lat, log), //지도의 중심좌표.
            level: 3 //지도의 레벨(확대, 축소 정도)
        };

        var map = new kakao.maps.Map(container, options); //지도 생성 및 객체 리턴
        var marker = new kakao.maps.Marker({
                    map: map,
                    position: new kakao.maps.LatLng(lat, log)
        });

        resolve(map);
    })
}

export let getUserXY = () => {
    return new Promise((resolve, reject)=>{
        let success = pos => {
            resolve({lat:pos.coords.latitude, log:pos.coords.longitude});
        }

        let error = error => {
            reject(error);
            console.log(`error code : ${error.code} , ${error.message}`);
        }

        var options = {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        };

        let geo = navigator.geolocation;
        geo.getCurrentPosition(success, error, options);
    })
}


let getKeywordXY = (lat, log) => {
    return new Promise((resolve, reject)=>{
        // 비동기 통신을 위한 XHR 객체 생성
        let xhr = new XMLHttpRequest();
        
        // 시작줄 작성  : http method, url, protocol
        let query = '편의점';

        //https://dapi.kakao.com/v2/local/search/keyword?query=편의점 &x=127.0735263&y=37.5481267
        let url = `https://dapi.kakao.com/v2/local/search/keyword?query=${query}&x=${log}&y=${lat}`;
        console.dir(url);
        xhr.open('get', url);

        //json타입으로 응답받은 데이터를 javaScript 객체로 파싱
        xhr.responseType='json';

        // http header 작성
        xhr.setRequestHeader('Authorization', 'KakaoAK fece723708634228bc6d90c3319a90ce');
        xhr.send();

        xhr.addEventListener('load', ()=>{
            resolve(xhr.response);
        });
    })
}

export let init = async ()=>{
    let userXY = await getUserXY();
    let keywordXY;
    let map; 

    // 두 개의 promise 객체를 먼저 생성해 비동기 작업을 시작
    let p1 = renderMap(userXY.lat, userXY.log);
    let p2 = getKeywordXY(userXY.lat, userXY.log);

    //p1의 resolve()와 p2의 resolve()가 호출 되기를 대기
    map = await p1;
    keywordXY = await p2;

    console.dir(keywordXY);
    console.dir(map);

    let xys = keywordXY.documents.map(e => {return {log:e.x, lat:e.y}});
    
    xys.forEach(e => {
            new kakao.maps.Marker({
            map: map,
            position: new kakao.maps.LatLng(e.lat, e.log)
        });
    });
};
// firebase -> -문서(docs) -> 웹 시작하기 ->아래로 내려서 인증클릭-> 내려서 구글로 로그인 ->var provider = new firebase.auth.GoogleAuthProvider(); 붙이기

const auth = firebase.auth(); //firebase 안에 auth라는 곳을 auth로 만든다
const google = new firebase.auth.GoogleAuthProvider(); //firebase에서 계약하여 이용자들에게 사이트를 사용할수 있도록 넣어둔것이다.
const db = firebase.database();
var user = null; // 로그인한 사용자의 정보를 저장하는 변수
var nowKey= null;
const _btLogin = document.querySelector("#btLogin");
const _btLogout = document.querySelector("#btLogout");
const _btSave = document.querySelector("#btSave");
const _content = document.querySelector("#noteTxt");
const _lists = document.querySelector(".lists");

// 인증기능 만들기
// $("#btLogin").click(function(e){});
auth.onAuthStateChanged(data => {
    console.log(data);
    user = data;
    console.log(user);
    if (user == null) viewChg('');
    else {
        viewChg('R');
        dbInit();
    }
});
_btLogin.addEventListener("click", e => {
    auth.signInWithPopup(google); // 팝업창이 떠서 로그인할수있는것
    //auth.signInWithRedirect(google); 구글사이트로 넘어가는것
});
_btLogout.addEventListener("click", e => {
    auth.signOut();
});

//note 추가하기 ,수정하기
_btSave.addEventListener("click", (e) => {
    var content = _content.value.trim();
    console.log(content)
    if (content === "") {
        alert("내용을 입력하세요");
        _content.focus();
        return false;

    }
    db.ref("root/notes/" + user.uid).push({
        content: content,
        time: new Date().getTime(),
        icon: content.substring(0, 1) //내용에서 0번째 자리에서1번째 자리까지 가져와
    }).key;
    _content.value = "";
});


//Database init
function dbInit() {
    _lists.innerHTML = "";
    db.ref("root/notes/" + user.uid).on("child_added", onAdd);
    db.ref("root/notes/" + user.uid).on("child_removed", onRev); //데이터가 삭제 되면 child_removed 가 시작되면 onRev 함수를 실행해주세요
    db.ref("root/notes/" + user.uid).on("child_changed", onChg);
};

//Database onAdd,onRev,onChg 콜백함수
function onAdd(data) {
    /*  console.log(data) */
    var html = '';
    html += '<ul class="list border border-white rounded p-3 mt-3 bg-primary text-light position-relative" id="' + data.key + '"onclick="dataGet(this)">'; //data.key는 메모장에 씌여진 메모 하나하나의 key이다
    html += '<li class="d-flex">';
    html += '<h1 class="bg-light text-primary rounded-circle text-center mr-3 flex-shring-0" style="width:56px; height: 56px; line-height: 55px;">' + data.val().icon + '</h1>';
    html += '<div>' + data.val().content.substring(0, 60) + '</div>';
    html += '</li>';
    html += '<li>' + dspDate(new Date(data.val().time)) + '</li>';
    html += '<li class="position-absolute" style="bottom:5px; right:10px; cursor: pointer;">';
    html += '<i class="fas fa-trash-alt" onclick="dataRev(this);"></i>';
    html += '</li>';
    html += '</ul>';
    _lists.innerHTML = html + _lists.innerHTML; //val 는 제이쿼리의 val가 아닌 data안에 __proto__배열 안에있는 함수 val의 값이다.
} 


// onRev 콜백함수
function onRev(data) {
    var id = data.key;
    document.querySelector("#" + id).remove(); //reomve는 자바스크립트의 매소드 이다
};
// onChg 콜백함수
function onChg(data) {

}

//onclick 함수: dataRev()
function dataRev(obj) {
    event.stopPropagation(); // 이벤트의 번식을 막아라 즉 아래의 문제(dataGet)를 해결하기위해 넣는것
    console.log(obj.parentNode.parentNode.getAttribute("id"))
    if (confirm("삭제하시겠습니까?")) {
        var key = obj.parentNode.parentNode.getAttribute("id")
        db.ref("root/notes/" + user.uid + "/" + key).remove() //firebase 데이터가 삭제된다 그 데이터를 콜백함수로 받아야 실제 화면에서 삭제된다.  여기서 remove는 파이어베이스의 romove이다
    }
}


//onclick 함수: dataGet()
function dataGet(obj) {
    console.log(obj.getAttribute("id")) //메모 하나하나의 id가 들어오지만 위에 dataRev 도 먹기때문에 쓰레기통을 누르면 두개의 id값이 리턴된다
nowKey =obj.getAttribute("id")  //저장이라는 버튼은 신규 저장과 수정이라는 두개의 역활을 하기때문에 나누기위해 변수로 지정
    db.ref("root/notes/"+user.uid+"/"+nowKey).once("value").then((data)=>{
_content.value =data.val().content
}); //once는 단한번만 실행시켜줄때 사용, 즉 value데이타를 한번만 가져오고 난후에(then) 함수를 실행시켜주세요 라는뜻
}



//화면 전환 함수
function viewChg(state) {
    switch (state) {
        case "R":
            console.log(user.photoURL);
            imagesLoaded(document.querySelector('.email img'), () => {
                document.querySelector(".email img").setAttribute("src", user.photoURL);
                document.querySelector(".email-txt").innerHTML = user.email;
                document.querySelector(".email").style.display = "flex";
                document.querySelector("#btLogin").style.display = "none";
            });
            document.querySelector(".email img").setAttribute("src", user.photoURL);
            break;
        default:
            document.querySelector(".email-txt").innerHTML = "";
            document.querySelector(".email").style.display = "none";
            document.querySelector("#btLogin").style.display = "inline-block";
            break;
    }

}
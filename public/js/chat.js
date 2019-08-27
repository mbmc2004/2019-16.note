//전역변수
const auth = firebase.auth();
const googleAuth = new firebase.auth.GoogleAuthProvider();
var user= null;

/*  
현존하는 Database 는 두가지가 있다 SQL(80%) / noSQL(20%)-not only SQL             (시장점유율)
SQL = 데이터가 엑셀처럼 저장된다     noSQL = json로 저장된다 
*/
const db = firebase.database();



//인증관련 전역변수
const _btLogin = document.querySelector("#btLogin")
const _btLogout = document.querySelector("#btLogout")
const _email = document.querySelector("#email")


//데이터베이스 관련 전역변수
const _btSave = document.querySelector("#btSave");
const _content= document.querySelector("#content")
const _lists = document.querySelector(".lists");


//인증관련 이벤트
_btLogin.addEventListener("click", function () { // 자바스크립트
    auth.signInWithPopup(googleAuth);
})
_btLogout.addEventListener("click", function() {
	auth.signOut();
});
auth.onAuthStateChanged(function (data) { //auth에 data를 담아주세요
    console.log(data);
    user = data;
    if (data){  
     _email.innerHTML = data.email+ "/"+ data.uid;  //uid는 구글에서 제공한 나의 실제 아이디값이다 즉 유일하다
     _lists.innerHTML ="";
     dbInit();
    }
    else _email.innerHTML = "";
});

/* 
addEventListener,querySelector :  자바스크립트가 갖고있는 매서드
signInwithPopup : firebase auth 안에있는 매서드 firebase 가 없을때는 사용 x  
*/


//데이터베이스 관련 이벤트 
function dbInit(){
    db.ref("root/notes/" +user.uid).on("child_added", onAdd);   //firebase에서 addEventListener 와같은 메서드가 on이다
    db.ref("root/notes/" +user.uid).on("child_removed",onRev);   
    db.ref("root/notes/" +user.uid).on("child_changed",onChg);   
}



// 데이터가 추가 이벤트 후 실행되는 콜백함수
function onAdd(data){
console.log(data.val().content+ "/" +data.val().time);
var html =`           
            <ul class="list row border-bottom border-primary">
            <li class="col-8 p-2">${data.val().content}</li>
            <li class="col-4 p-2">${dspDate(new Date(data.val().time))}</li>
            </ul>`
            _lists.innerHTML = html + _lists.innerHTML;
}

// 데이터가 삭제 이벤트 후 실행되는 콜백함수
function onRev(data){

}

//데이터가 변경 이벤트 후 실행되는 콜백함수
function onChg(data){

}


//실제 데이터 저장 구현
_btSave.addEventListener("click", function (e) {
	var content = _content.value.trim();
	if(content == "") {
		alert("글을 작성하세요.");
		_content.focus();
		return false;
	}
	db.ref("root/notes/"+user.uid).push({
		content: content,
		time: new Date().getTime()
	}).key;
});
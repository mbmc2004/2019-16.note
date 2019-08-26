const auth = firebase.auth();
const google = new firebase.auth.GoogleAuthProvider();
var user = null;	// 로그인한 사용자의 정보를 저장하는 변수

// 인증기능 만들기
// $("#btLogin").click(function(e){});
auth.onAuthStateChanged(data => {
    console.log(data);
    user = data;
    console.log(user);
    if(user == null) viewChg('');
    else viewChg('R');
});
document.querySelector("#btLogin").addEventListener("click", e => {
	auth.signInWithPopup(google);  // 팝업창이 떠서 로그인할수있는것
    //auth.signInWithRedirect(google); 구글사이트로 넘어가는것
});
document.querySelector("#btLogout").addEventListener("click", e => {
	auth.signOut();
});



//화면 전환 함수
function viewChg(state){
    switch(state){
        case "R":
            console.log(user.photoURL);
            imagesLoaded( document.querySelector('.email img'), () => {
                document.querySelector(".email img").setAttribute("src",user.photoURL);  
                document.querySelector(".email-txt").innerHTML=user.email;
                document.querySelector(".email").style.display="flex";
                document.querySelector("#btLogin").style.display="none";
              });
            document.querySelector(".email img").setAttribute("src",user.photoURL);
            break;
        default:
                document.querySelector(".email-txt").innerHTML="";
                document.querySelector(".email").style.display="none";
                document.querySelector("#btLogin").style.display="flex";
            break;    
    }
    
}
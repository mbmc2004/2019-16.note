// '2019년 8월 11일 9시 8분 11초'형식으로 보내주는 함수
function dspDate(d,type=1){
    var monthArr=["1월","2월","3월","4월","5월","6월","7월","8월","9월","10월","11월"]
    var year = d.getFullYear()+"년"; // 현재 년도 (2019)
    var month = monthArr[d.getMonth()]+[]; // 현재월-1 (0~11) 배열이기때문이다
    var day = d.getDate()+"일"; //현재 일  (1~31)
    var hour = d.getHours()+"시"; //현재시간 (0~23)
    var min = d.getMinutes()+"분"; //현재분 (0~59)
    var sec = d.getSeconds()+"초"; //현재초 (0~59)
    var returnStr;
    /* 
    type 0 : '2019년 8월 11일 9시 8분 11초'
    type 1 : '2019년 8월 11일 9시 8분'
    type 2 : '2019년 8월 11일 9시'
    type 3 : '2019년 8월 11일'
    type 4 : '8월 11일'
    */
    switch(type){
       case 1:
           returnStr = year +month +day +hour +min;
           break;
       case 2:
           returnStr = year +month +day +hour;
           break;
       case 3:
           returnStr = year +month +day;
           break;
       case 4:
           returnStr = month +day;
           break;
       default:
           returnStr = year +month +day +hour +min +sec;
           break;
    }



     return returnStr;
}

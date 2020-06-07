var express = require('express');
const mongoose = require('mongoose');
var app = express();
const cors= require('cors');
const bodyParser = require('body-parser');
var server = app.listen(3001, function(){
    console.log("aaaaaaaa");
})

app.get('/', function(req,res){
    res.send("hello");
})

app.use(cors());
app.use('/api', (req,res)=>  res.json({username:'aaaaa'}));


var database;
var db = mongoose.connection;
db.on('error', console.error);

db.once('open', function(){
    // CONNECTED TO MONGODB SERVER
    console.log("Connected to mongod server");
});

mongoose.connect('mongodb+srv://cdp12:cdp12@cdp12-eqgsf.mongodb.net/test?retryWrites=true&w=majority',function(err,database){

    if(err){
        console.error("연결 실패",err);
        return;
    }
    database= database;
    
});

var population = mongoose.Schema({ //보드에서 들어오는 유동인구 측정 데이터를 위한 스키마 생성
    camera_id: {
        type: String,
        unique : true
      },
    date: {
        type: String,
    },
    hour: {
        type: String,
      },
    counting: {
        type: String,
      },
})

module.exports = mongoose.model('p_data',population);//유동인구

var curpop = mongoose.model('p_data',population); //피플스키마의 모델 생성


var arr = [ 
  { camera_id: '1', date: "200607", hour: '21', counting: '4'},
  { camera_id: '1', date: "200607", hour: '21', counting: '5'},
  { camera_id: '1', date: "200607", hour: '22', counting: '2'},
  { camera_id: '1', date: "200607", hour: '22', counting: '1'},
  { camera_id: '1', date: "200608", hour: '21', counting: '1'},
  { camera_id: '1', date: "200608", hour: '21', counting: '4'},
  { camera_id: '1', date: "200608", hour: '22', counting: '9'},
  { camera_id: '1', date: "200608", hour: '22', counting: '1'},
  { camera_id: '2', date: "200607", hour: '21', counting: '3'},
  { camera_id: '2', date: "200607", hour: '21', counting: '1'},
  { camera_id: '2', date: "200607", hour: '22', counting: '2'},
  { camera_id: '2', date: "200608", hour: '21', counting: '1'},
  { camera_id: '2', date: "200608", hour: '22', counting: '0'},
  { camera_id: '3', date: "200607", hour: '21', counting: '1'},
  { camera_id: '3', date: "200607", hour: '21', counting: '1'},
  { camera_id: '3', date: "200607", hour: '22', counting: '2'},
  { camera_id: '3', date: "200608", hour: '21', counting: '7'},
  { camera_id: '3', date: "200608", hour: '22', counting: '8'},
 
];

var count =0
var groupBy = (arr, camera_id, date, hour) => {

var temparr = [];
var resultarr = [];

arr.map((item)=>{
var pushed = false;
temparr.map((ele)=>{
 if(ele===item.camera_id){
   pushed = true;
 }
})
if(!pushed){
 temparr.push(item.camera_id);
}     
})

    temparr.map((item)=>{
      var countarr1 = [];
      var countarr2 = [];
      

      arr.map((item1)=>{
        var pushed = false;
        countarr1.map((ele)=>{
          if(ele===item1.date){
            pushed = true;
          }
        })
        if(!pushed){
          countarr1.push(item1.date);
        } 
      })

      arr.map((item2)=>{
        var pushed = false;
        countarr2.map((ele)=>{
          if(ele===item2.hour){
            pushed = true;
          }
        })
        if(!pushed){
          countarr2.push(item2.hour);
        } 
      })

      countarr1.map((item1)=>{
        countarr2.map((item2)=>{
        var sum = 0;
        arr.map((ele)=>{
          if(ele.date===item1 && ele.camera_id===item && ele.hour===item2){
            sum += parseFloat(ele.counting)
          }
        })
        resultarr.push({
          camera_id: item,
          date: item1,
          hour: item2,
          counting: sum
         })
       })
      })
  })

return resultarr
}   

var rawresult = groupBy(arr, 'camera_id', 'date','hour');

var result = rawresult.filter((arr, index, self) =>
index === self.findIndex((t) => (t.camera_id === arr.camera_id && t.date === arr.date && t.hour === arr.hour)))

//console.log(clean[0].Phase);
  
for(var i=0; i<result.length; i++){
          var test= new curpop({ 
              camera_id: result[i].camera_id,
              date: result[i].date,
              hour : result[i].hour,
              counting: result[i].counting,
          },
          {
            unique: true
          })
          console.log(test);
          /*test.save(function(err, test){ //DB에 저장 이걸 막아놔도 create는 못막지만 사용시 접근을 id갯수만큼만 하니까 그닥 상관 없음
              if(err) return console.log("디비에 저장에러");
              //console.dir(test)*/
}

import React, { Component } from 'react';
import { Line } from 'react-chartjs-2';
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';
import { getStyle } from '@coreui/coreui/dist/js/coreui-utilities'
const brandSuccess = getStyle('--success')
const brandInfo = getStyle('--info')
const brandDanger = getStyle('--danger')


class TotalLine extends Component {
    
    constructor(props) {
        super(props);

        //렌더링 되기 전으로 setState 바꾸기
        var today = new Date();

       var time = today.getHours();
       var day = today.getDate();
       var month = today.getMonth();
       month +=1;    
       var year = today.getFullYear();

       day = String(day);
       if(month<10)
       {
         month = String(month);
         month = '0'+month;
       }
       
       else
       month = String(month);

        year = String(year);
        year = year.substr(2,2);
        day = year+month+day;
       console.log(day);
       
        this.state = {
          //현재 시간
          time: 0,
          day: 8
        };

      }

      


 //today - 200611
 //i - 알아내고자 하는 시간(현재시간 한시간 직전까지 반복문을 통해 증가)
 //cam - 카메라 아이디..
  callApi = async (today,i,cam) => {
    var cnt;
    const response = await fetch('https://jsonplaceholder.typicode.com/todos/1');
    await response.json()
    .then(res => 
      {
        //from String to Numbe
        res.id *=1;
        res.id = res.id*15;
        cnt = res.id;
        
        console.log(cnt);


      })
    .catch(err => console.log(err));
  
    return cnt;
    };

    
    componentWillMount = () => {  
      //  setInterval(() => {
        
          this.setState({time: new Date().getHours()});
            console.log(this.state.time+'시');
  //        }, 5000);

    }

    getData1 = ()=>{
        var data1 = [];
        //서버에 요청한 데이터로 업뎃;
        // for(var i=0;i<this.state.time;i++)
        // {
        //    data1.push(this.callApi(this.state.day,i,1));
        //    console.log(i+'시 설정');
        // }

        data1=[4,3,2,2,3,5,7,11,37,39,21,23,38,26,21,23,30,28,42,26,15,11,6,5];
        console.log('하루 유동인구 설정 오나료');
        console.log(data1[0]+'data1[0]');
        return data1;
    };
    getData2 = ()=>{
        //서버에 요청한 데이터로 업뎃;
        var data2 =[];
        // for(var i=0;i<this.state.time;i++)
        // {
        //    data2.push(this.callApi(this.state.day,i,2));
        //    console.log(i+'시 설정');

        // }
        
        data2 = [4,3,2,1,1,2,5,7,29,37,31,24,36,31,23,19,21,15,39,24,11,9,8,5]
        console.log(data2[0]+'data2[0]');
           console.log('하루 유동인구 설정 오나료');
        return data2;
    };
    getData3 = ()=>{
                //서버에 요청한 데이터로 업뎃;

        var data3 = [];
        // for(var i=0;i<this.state.time;i++)
        // {
        //   data3.push(this.callApi(this.state.day,i,3));
        //   console.log(i+'시 설정');

        // }
        
        data3=[3,2,1,2,3,2,4,8,21,32,28,21,35,20,22,18,16,21,34,19,15,10,8,5]

          console.log(data3+'data3[0]');
           console.log('하루 유동인구 설정 오나료');
        return data3;
    };

 getData = () => {
     return ({
    labels: ['0-1', '1-2', '2-3', '3-4', '4-5', '5-6', '6-7','7-8','8-9', '9-10','10-11', '11-12', '12-13', '13-14', '14-15', '15-16', '16-17', '17-18', '18-19', '19-20', '20-21', '21-22', '22-23', '23-24'],
    datasets: [
      {
        label: 'IT 융복합관',
        backgroundColor: 'transparent',
        borderColor: brandInfo,
        pointHoverBackgroundColor: '#fff',
        borderWidth: 2,
        data: this.getData1()
      },
      {
        label: 'IT 4호관',
        backgroundColor: 'transparent',
        borderColor: brandSuccess,
        pointHoverBackgroundColor: '#fff',
        borderWidth: 2,
        data: this.getData2()
      },
      {
        label: '공대 9호관',
        backgroundColor: 'transparent',
        borderColor: brandDanger,
        pointHoverBackgroundColor: '#fff',
        borderWidth: 2,
        data: this.getData3()
      },
    ]
});
};

getMainChartOpts = () => {
 return ({
    tooltips: {
      enabled: false,
      custom: CustomTooltips,
      intersect: true,
      mode: 'index',
      position: 'nearest',
      callbacks: {
        labelColor: function(tooltipItem, chart) {
          return { backgroundColor: chart.data.datasets[tooltipItem.datasetIndex].borderColor }
        }
      }
    },
    maintainAspectRatio: false,
    legend: {
      display: false,
    },
    scales: {
      xAxes: [
        {
          gridLines: {
            drawOnChartArea: false,
          },
        }],
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
            maxTicksLimit: 5,
            stepSize: Math.ceil(40 / 5),
            max: 100,
          },
        }],
    },
    elements: {
      point: {
        radius: 0,
        hitRadius: 10,
        hoverRadius: 4,
        hoverBorderWidth: 3,
      },
    },
  });
  
};


    render() {
        return (
            <div>
                <Line data={this.getData()} options={this.getMainChartOpts()} height={300} />
            </div>
        );
    }
}

export default TotalLine;
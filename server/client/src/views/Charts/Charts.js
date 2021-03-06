import React, { Component } from 'react';
import { Bar } from 'react-chartjs-2';
import { Card, CardBody, Row, Col, CardTitle } from 'reactstrap';
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';

import "react-datepicker/dist/react-datepicker.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import DatePicker from 'react-datepicker';
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from 'reactstrap';

const options = {
  tooltips: {
    enabled: false,
    custom: CustomTooltips
  },
  scales: {
    yAxes: [{
      ticks: {
        beginAtZero: true,
        min: 0,
      }
    }],
    xAxes: [{
      barPercentage: 0.8
    }]
  },
  maintainAspectRatio: false,
  legend: {
    onClick: null
  }
}

class DropDownItem extends Component {
  
  render() {
    const id = [1,2,3];
    const title = ['IT 융복합관', 'IT 4호관', '공대 9호관'];
    var dropdownItem = [];
    for (var i = 0; i < id.length; i++) {
      dropdownItem.push(<DropdownItem key={id[i]} data-id={id[i]} data-title={title[i]} onClick={function (e) {
        e.preventDefault();
        this.props.onClick(e.target.dataset.id, e.target.dataset.title);
      }.bind(this)}>
        {title[i]}
      </DropdownItem>)
    }
    return (
      <div>
        {dropdownItem}
      </div>

    );
  }
}

class Charts extends Component {

  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.setChart = this.setChart.bind(this);

    this.state = {
      dropdownOpen: false,
      dropDownValue: '구역 선택',
      list: [],
      cam_id: 0,
      startDate: new Date(),
      barBackground: [],
      date: '',
      cardTitleValue:{
        date: '날짜 선택',
        area: '(구역 선택)',
      },
      bar: {
        labels: ['0-1', '1-2', '2-3', '3-4', '4-5', '5-6', '6-7', '7-8', '8-9', '9-10', '10-11', '11-12', '12-13', '13-14', '14-15', '15-16', '16-17', '17-18', '18-19', '19-20', '20-21', '21-22', '22-23', '23-24'],
        datasets: [
          {
            label: '유동인구 수',
            backgroundColor: 'rgba(18,171,184,0.5)',
            borderColor: 'rgba(12,119,128,1)',
            borderWidth: 1,
            hoverBackgroundColor: 'rgba(18,171,184,0.5)',
            hoverBorderColor: 'rgba(12,119,128,1)',
            data: [],
          },
        ],
      }
    };
  }
  setChart(id, title, count) {
    var range;
    var barBackground = [];

    console.log(count);
    
    var max = Math.max.apply(null, count);
    var min = Math.min.apply(null, count);
    console.log(max);
    console.log(min);
    range = (max - min) / 5;

    //console.log(count[0]);

    for (var i = 0; i < 24; i++){
        if(count[i] < min + (range * 1))
          barBackground[i] = 'rgba(18,171,184,0.2)';
        else if(count[i] >= min + (range * 1) && count[i] < min + (range * 2))
          barBackground[i] = 'rgba(18,171,184,0.4)';
        else if(count[i] >= min + (range * 2) && count[i] < min + (range * 3))
          barBackground[i] = 'rgba(18,171,184,0.6)';
        else if(count[i] >= min + (range * 3) && count[i] < min + (range * 4))
          barBackground[i] = 'rgba(18,171,184,0.7)';
        else if(count[i] >= min + (range * 4) && count[i] <= min + (range * 5))
          barBackground[i] = 'rgba(18,171,184,0.8)';
      
    }

    console.log(barBackground);

    this.setState({
      dropdownOpen: this.state.dropdownOpen,
      dropDownValue: title,
      list: this.state.list,
      cam_id: id,
      date: this.state.date, 
      cardTitleValue: {
        date: this.state.startDate.getFullYear() +'.'+ (this.state.startDate.getMonth() + 1) + '.' + this.state.startDate.getDate(),
        area: title
      },
      bar: {
        labels: ['0-1', '1-2', '2-3', '3-4', '4-5', '5-6', '6-7', '7-8', '8-9', '9-10', '10-11', '11-12', '12-13', '13-14', '14-15', '15-16', '16-17', '17-18', '18-19', '19-20', '20-21', '21-22', '22-23', '23-24'],
        datasets: [
          {
            label: '유동인구 수',
            backgroundColor: barBackground,
            borderColor: 'rgba(12,119,128,1)',
            borderWidth: 1,
            hoverBackgroundColor: 'rgba(18,171,184,0.5)',
            hoverBorderColor: 'rgba(12,119,128,1)',
            data: count,
          },
        ],
      }
    })
    

  }
  toggle() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen,
    });
  }
  getDate = inputDate => {
    var strdate, year, month, date = '';

    year = inputDate.getFullYear();
    if ((inputDate.getMonth() + 1) < 10)
      month = '0' + (inputDate.getMonth() + 1);
    else
      month = '' + (inputDate.getMonth() + 1);
    if (inputDate.getDate() < 10)
      date = '0' + (inputDate.getDate());
    else
      date = '' + inputDate.getDate();

    strdate = year + month + date;

    this.setState({
      startDate: inputDate,
      date: strdate
    })

   // console.log(this.state.date + "strdate");
  }

  callApi() {
    var counting = [];
    fetch('http://localhost:3001/api/charts/',{ //api 사용
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        'date': this.state.date,
        'camera_id': this.state.cam_id //date랑 카메라 id 보냄
      })
    })
    .then(response => response.json()) 
    .then(response =>{ //api에서 카운팅 배열(?) 받아옴,,,
        console.log("값"+response.counting);

        if(!response.counting[0]){
          alert('해당 날짜와 지역에 데이터가 없습니다!')
          return;
        }
        counting=response.counting;

       console.log(counting);
    })
    .then(response =>{
      this.setChart(this.state.cam_id, this.state.dropDownValue, counting) //읽어온 카운팅 값으로 차트 그리기?
    })
    .catch(error => alert('해당 날짜와 지역에 데이터가 없습니다!'))
  
  }

  handleChange
  render() {
    return (
      <div className="animated fadeIn">
        <Row  style={{ paddingTop: 50 + 'px', height: 80 + '%' }} className="align-items-center">
          <Col style={{height: "100%"}}>
            <Card style={{backgroundColor: '#f7f9fb'}}>
              <CardTitle className="text-center" tag="h3" style={{ marginTop: 20 + 'px' }}>
                [{this.state.cardTitleValue.date}] {this.state.cardTitleValue.area}
              </CardTitle>
              <CardBody>
                <div className="chart-wrapper">
                  <Bar data={this.state.bar} options={options} height="400px"/>
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col xs="auto">
            <DatePicker 
              placeholderText="날짜 선택"
              selected={this.state.startDate}
              onChange={this.getDate}
              className="form-control"
              maxDate={new Date()}
              dateFormat="yyyy년 MM월 dd일"
              inline
              fixedHeight
            />

            <Dropdown id='card1' isOpen={this.state.card1} toggle={() => { this.setState({ card1: !this.state.card1 }); }} style={{ marginBottom: "80px"}}>
              <DropdownToggle caret style={{ width: 100 + '%'}} color="info">
                {this.state.dropDownValue}
              </DropdownToggle>
              <DropdownMenu style={{ width: 100 + '%'}}>
                <DropdownItem disabled>구역 선택</DropdownItem>
                <DropdownItem divider />
                <DropDownItem onClick={function (id, title) {
                  console.log(id);
                  if (this.state.date === '')
                    alert('날짜를 먼저 선택해 주세요.');
                  else {
                    //

                      this.setState({
                        dropdownOpen: this.state.dropdownOpen,
                        dropDownValue: title,
                        list: this.state.list,
                        cam_id: id,
                        date: this.state.date, 
                        cardTitleValue: {
                          date: this.state.startDate.getFullYear() +'.'+ (this.state.startDate.getMonth() + 1) + '.' + this.state.startDate.getDate(),
                          area: title
                        },
                        bar: {
                          labels: ['0-1', '1-2', '2-3', '3-4', '4-5', '5-6', '6-7', '7-8', '8-9', '9-10', '10-11', '11-12', '12-13', '13-14', '14-15', '15-16', '16-17', '17-18', '18-19', '19-20', '20-21', '21-22', '22-23', '23-24'],
                          datasets: [
                            {
                              label: '유동인구 수',
                              backgroundColor: 'rgba(18,171,184,0.5)',
                              borderColor: 'rgba(12,119,128,1)',
                              borderWidth: 1,
                              hoverBackgroundColor: 'rgba(18,171,184,0.5)',
                              hoverBorderColor: 'rgba(12,119,128,1)',
                              data: this.state.data,
                            },
                          ],
                        }
                      },this.callApi)                     
                  }

                }.bind(this)}></DropDownItem>
              </DropdownMenu>
            </Dropdown>
          </Col>
        </Row>



      </div>
    );
  }
}

export default Charts;
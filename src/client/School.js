import React, {Component} from 'react';
import {Doughnut} from 'react-chartjs-2';
import {HorizontalBar} from 'react-chartjs-2';

class School extends Component {

      constructor(props) {
		 super(props);
		 let schoolData = null;
		 let programsData = null;
		 let reData = null;
		 let costData = null;
		 this.state = { schoolData: schoolData }  
	  }
	  
	  componentWillReceiveProps (nextProps) {
		   if(this.props.schoolID != nextProps.schoolID) {
				this.getSchoolData(nextProps.schoolID)
		   }
	  }
	  
	  getSchoolData(schoolID) {
	      let url = '/api/school/' + schoolID
	      fetch(url)
          .then(res => res.json())
          .then(res => { 
               this.setState({
                  schoolData: res
               })
          })
          return true;
      }
      
      getChartData(data,i=0) {
		//sort data by values
		var tmpData = {};
		while (Object.keys(data).length) {
			var key = Object.keys(data).reduce((a, b) => data[a] > data[b] ? a : b);
			tmpData[key] = data[key];
			delete data[key];
		}
		data = tmpData;
		const colors = ['#e6194b', '#3cb44b', '#ffe119', '#4363d8', '#f58231', '#911eb4', '#46f0f0', '#f032e6', '#bcf60c', '#fabebe', '#008080', '#e6beff', '#9a6324', '#fffac8', '#800000', '#aaffc3', '#808000', '#ffd8b1', '#000075', '#808080', '#ffffff', '#000000'];
		let chartData = {
			labels: [],
			datasets: []
		};
		let dataset = {
			data: [],
			backgroundColor: [],
			hoverBackgroundColor: []
		};
		for(const key in data) {
			if(data[key]) {
				let numValue  = (100*data[key]).toFixed(2);
				let label = key + ' (' + numValue + '%)';
				chartData['labels'].push(label);
				dataset['data'].push(data[key]);
				dataset['backgroundColor'].push(colors[i]);
				dataset['hoverBackgroundColor'].push(colors[i]);
				if(i == data.length + 1) {
					i = 0;
				} else {
				    i = i + 1;
				}
		    }
		}
		if(dataset['data'].length == 0) {
			return null;
		}
		chartData['datasets'].push(dataset);  
		return chartData;
	  }

      render() {
	    if(this.state.schoolData) {
	    const data = this.state.schoolData;
	    let programsData = null;
	    let reData = null;
	    let costData = null;
		programsData = this.getChartData(data.latest.academics.program_percentage);
		reData = this.getChartData(data.latest.student.demographics.race_ethnicity,3);
		costData = this.getChartData(data.latest.cost.net_price.public.by_income_level);
		return(
		  <div>
		    <h3 className="text-secondary">{ data.school.name  }</h3>
		    { data.school.alias ? ( <span>({ data.school.alias })</span> ) : null  }
		    <table className="table table-sm table-striped table-bordered">
			  <tbody>
				<tr>
				  <td>City</td><td>{ data.school.city }</td>
				</tr>
				<tr>
				  <td>State</td><td>{ data.school.state }</td>
				</tr>
				<tr>
				  <td>Zip</td><td>{ data.school.zip }</td>
				</tr>
				<tr>
				  <td>Website</td><td><a href={ 'http://' + data.school.school_url }>{ data.school.school_url }</a></td>
				</tr>
				<tr>
				  <td>Current Enrollment</td><td>{ data.latest.student.enrollment.all }</td>
				</tr>
			  </tbody>
		    </table>
		    <div className="border border-info rounded p-4">
		     <h4 className="text-secondary">Program Percentages out of 100</h4>
		     { programsData ? ( <Doughnut data={programsData} /> ) : ( <span className="bg-warning">No data available.</span> )}
		    </div>
		    <div className="border border-info rounded p-4">
		     <h3 className="text-secondary">Race/Ethnicity</h3>
   		     { reData ? ( <Doughnut data={reData} /> ) : ( <span className="bg-warning">No data available.</span> )}
   		    </div>
   		    <div className="border border-info rounded p-4">
		     <h3 className="text-secondary">Price by Income Level</h3>
   		     { costData ? ( <HorizontalBar data={costData} /> ) : ( <span className="bg-warning">No data available.</span> )}
   		    </div>
		  </div>
		)
	   } else {
		 return ( null )   
	   }
      }

}
export default School;

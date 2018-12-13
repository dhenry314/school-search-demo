import React, {Component} from 'react';
import {Doughnut} from 'react-chartjs-2';
import {HorizontalBar} from 'react-chartjs-2';
import Page from './Page';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const pxToMm = (px) => {
  return Math.floor(px/document.getElementById('myMm').offsetHeight);
};

const mmToPx = (mm) => {
  return document.getElementById('myMm').offsetHeight*mm;
};

const range = (start, end) => {
    return Array(end-start).join(0).split(0).map(function(val, id) {return id+start});
};


class PrintSchool extends Component {

      constructor(props) {
		 super(props);
		 let schoolData = null;
		 let printedID = null;
		 let programsData = null;
		 let reData = null;
		 let costData = null;
		 this.state = { schoolData: schoolData }  
	  }
	  
	  componentDidUpdate(prevProps, prevState) {
		    if ( this.props.schoolID && (this.state.schoolData != prevState.schoolData) ) {
			  let filename = this.props.schoolID + "_collegeRpt.pdf";
			  const input = document.getElementById('multiPage');
			  const inputHeightMm = pxToMm(input.offsetHeight);
			  const a4WidthMm = 210;
			  const a4HeightMm = 297; 
			  const a4HeightPx = mmToPx(a4HeightMm); 
			  const numPages = inputHeightMm <= a4HeightMm ? 1 : Math.floor(inputHeightMm/a4HeightMm) + 1;

			  html2canvas(input)
				.then((canvas) => {
				  const imgData = canvas.toDataURL('image/png');
				  let pdf = null;
				  // Document of a4WidthMm wide and inputHeightMm high
				  if (inputHeightMm > a4HeightMm) {
					// elongated a4 (system print dialog will handle page breaks)
					pdf = new jsPDF('p', 'mm', [inputHeightMm+16, a4WidthMm]);
				  } else {
					// standard a4
					pdf = new jsPDF();
				  }
				  pdf.addImage(imgData, 'PNG', 0, 0);
				  pdf.save(`${filename}`);
				  
				});
			  ;
	       }
      }
	  
	  componentWillReceiveProps (nextProps) {
		   console.log(nextProps);
		   if( nextProps.schoolID && (this.props.schoolID != nextProps.schoolID) ) {
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
      
      getChartData(data,i=0,percents=true) {
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
				let label = key;
				if(percents) {
				    let numValue  = (100*data[key]).toFixed(2);
				    label = key + ' (' + numValue + '%)';
			    } 
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
	    if(this.props.schoolID && this.state.schoolData) {
	    const data = this.state.schoolData;
	    let programsData = null;
	    let reData = null;
	    let costData = null;
		programsData = this.getChartData(data.latest.academics.program_percentage,0);
		reData = this.getChartData(data.latest.student.demographics.race_ethnicity,3);
		costData = this.getChartData(data.latest.cost.net_price.public.by_income_level,6,false);
		let chartStyle = {
            pageBreakInside: "avoid"
        };
        let chartOptions = {
			animation: false
		};
		let barChartOptions = {
			legend: {
				display: false,
			},
			scales: {
				yAxes: [{
				  scaleLabel: {
					display: true,
					labelString: 'Income Level'
				  }
				}],
				xAxes: [{
				  scaleLabel: {
					display: true,
					labelString: 'Price'
				  }
				}],
			}
		};
		return(
		<div id={"multiPage"} className="bg-white shadow-1 center pa4"  style={{width: "210mm", height: ""}}>
 		  <div className="p-4">
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
		    <div className="border border-info rounded p-4" style={chartStyle}>
		     <h4 className="text-secondary">Program Percentages out of 100</h4>
		     { programsData ? ( <Doughnut data={programsData} options={ chartOptions } /> ) : ( <span className="bg-warning">No data available.</span> )}
		    </div>
		    <div className="border border-info rounded p-4" style={chartStyle}>
		     <h3 className="text-secondary">Race/Ethnicity</h3>
   		     { reData ? ( <Doughnut data={reData} options={ chartOptions }/> ) : ( <span className="bg-warning">No data available.</span> )}
   		    </div>
   		    <div className="border border-info rounded p-4" style={chartStyle}>
		     <h3 className="text-secondary">Price by Income Level</h3>
   		     { costData ? ( <HorizontalBar data={costData} options={ barChartOptions }/> ) : ( <span className="bg-warning">No data available.</span> )}
   		    </div>
		  </div>
		  <div id="myMm" style={{height: "1mm"}} />
		  </div>
		)
	   } else {
		 return ( null )   
	   }
      }

}
export default PrintSchool;

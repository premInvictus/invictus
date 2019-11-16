import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SmartService, ExamService, SisService, CommonAPIService } from '../../_services';
import { TranslateService } from '@ngx-translate/core';
import {
	GridOption, Column, AngularGridInstance, Grouping, Aggregators,
	FieldType,
	Filters,
	Formatters,
	DelimiterType,
	FileType
} from 'angular-slickgrid';
import { DomSanitizer } from '@angular/platform-browser';
import { TitleCasePipe } from '@angular/common';
@Component({
	selector: 'app-cbse-marks-analysis',
	templateUrl: './cbse-marks-analysis.component.html',
	styleUrls: ['./cbse-marks-analysis.component.css']
})
export class CbseMarksAnalysisComponent implements OnInit {
	headerCumulative: any[] = [];
	constructor(public dialog: MatDialog, private smart: SmartService, private exam: ExamService,
		public sanitizer: DomSanitizer,
		public common: CommonAPIService,
		private sis: SisService) { }
	classArray: any[] = [];
	sessionArray: any[] = [];
	secondFlag = false;
	subjectArray: any[] = [];
	stuDetailsArray: any[] = [];
	tabSubArray: any[] = [];
	selectedGroupingFields: string[] = ['', '', ''];
	tabHeaderArray: any[] = [];
	tableFlag = false;
	tabSubDataArray: any[] = [];
	totalRow: any;
	columnDefinitions1: Column[] = [];
	columnDefinitions2: Column[] = [];
	gridOptions1: GridOption;
	gridOptions2: GridOption;
	dataset1: any[];
	gridHeight: any;
	exportColumnDefinitions: any[] = [];
	dataset2: any[];
	gridObj: any;
	gridObj2: any;
	initgrid = false;
	columnDefinitions: Column[] = [];
	gridOptions: GridOption = {};
	dataset: any[] = [];
	angularGrid: AngularGridInstance;
	angularGrid2: AngularGridInstance;
	dataviewObj: any;
	dataviewObj2: any;
	draggableGroupingPlugin: any;
	percentSeries: any[] = [];
	markRegisterxSeries: any[] = [];
	topFiveChart: any = {};
	marksRegisterChart: any = {
		chart: {
			type: 'column',
			height: '400px'
		},
		title: {
			text: ''
		},
		xAxis: {
			categories: []
		},
		yAxis: {
			title: {
				text: '<b>Marks (in %) </b>'
			},
			max: 100
		},
		tooltip: {
			useHTML: true,
			formatter: function () {
				return '<b>' + this.x + '</b><br/>' +
					this.series.name + ': ' + this.y;
			}
		},
		plotOptions: {
			column: {
				pointPadding: 0.2,
				borderWidth: 0,
				dataLabels: {
					enabled: true
				},
				enableMouseTracking: true
			},
		},
		series: [{
			name: 'Students',
			data: this.percentSeries
		}]
	};
	header: any = 'Analysis';
	succImg = '/assets/images/examination/successful.svg';
	cardArray: any[] = [{
		id: '1',
		class: 'cbse-box-two',
		initialState: 'cbse-report-box disabled-box text-center',
		img: '/assets/images/examination/marks_register.svg',
		header: 'Marks Register'
	},
	{
		id: '2',
		class: 'cbse-box-two',
		initialState: 'cbse-report-box disabled-box text-center',
		img: '/assets/images/examination/best_five_subjects.svg',
		header: 'Best Five Subjects'
	},
	{
		id: '3',
		class: 'cbse-box-two',
		initialState: 'cbse-report-box disabled-box text-center',
		img: '/assets/images/examination/subject_wise_analysis.svg',
		header: 'Subject Wise Analysis'
	},
	// {
	//   id: '4',
	//   class: 'cbse-box-two',
	//   initialState: 'cbse-report-box disabled-box text-center',
	//   img: '/assets/images/examination/trend_analysis.svg',
	//   header: 'Stream Wise Analysis'
	// },
	{
		id: '5',
		class: 'cbse-box-two',
		initialState: 'cbse-report-box disabled-box text-center',
		img: '/assets/images/examination/trend_analysis.svg',
		header: 'Trend Wise Analysis'
	}];
	cardArray2: any[] = [{
		id: '1',
		class: 'cbse-box-two',
		initialState: 'cbse-report-box disabled-box text-center',
		img: '/assets/images/examination/marks_register.svg',
		header: 'Marks Register'
	},
	{
		id: '2',
		class: 'cbse-box-two',
		initialState: 'cbse-report-box disabled-box text-center',
		img: '/assets/images/examination/best_five_subjects.svg',
		header: 'Best Five Subjects'
	},
	{
		id: '3',
		class: 'cbse-box-two',
		initialState: 'cbse-report-box disabled-box text-center',
		img: '/assets/images/examination/subject_wise_analysis.svg',
		header: 'Subject Wise Analysis'
	},
	// {
	//   id: '4',
	//   class: 'cbse-box-two',
	//   initialState: 'cbse-report-box disabled-box text-center',
	//   img: '/assets/images/examination/trend_analysis.svg',
	//   header: 'Stream Wise Analysis'
	// },
	{
		id: '5',
		class: 'cbse-box-two',
		initialState: 'cbse-report-box disabled-box text-center',
		img: '/assets/images/examination/trend_analysis.svg',
		header: 'Trend Wise Analysis'
	}];
	previousIndex: any = 0;
	groupColumns: Grouping[];
	aggregatearray: any[] = [];
	markJSON: any[] = [];
	totalMarks: number;
	class_id: any;
	stuDetailsArray2: any[] = [];
	gridHeight2: number;
	sub1Arr: any[] = [];
	sub2Arr: any[] = [];
	sub3Arr: any[] = [];
	sub4Arr: any[] = [];
	sub5Arr: any[] = [];
	dataArray: any[] = [];
	seriesArray: any[] = [];
	cumulativeDataArray: any[] = [];
	topTenDataArray: any[] = [];
	ngOnInit() {
		this.getSubjects();
		this.getIsBoardClass();
		this.getSession();
	}
	angularGridReady(angularGrid: AngularGridInstance) {
		this.angularGrid = angularGrid;
		this.gridObj = angularGrid.slickGrid; // grid object
		this.dataviewObj = angularGrid.dataView;
		this.updateTotalRow(angularGrid.slickGrid);
	}
	angularGridReady2(angularGrid: AngularGridInstance) {
		this.angularGrid2 = angularGrid;
		this.gridObj2 = angularGrid.slickGrid; // grid object
		this.dataviewObj2 = angularGrid.dataView;
		this.updateTotalRow(angularGrid.slickGrid);
	}
	updateTotalRow(grid: any) {
		let columnIdx = grid.getColumns().length;
		while (columnIdx--) {
			const columnId = grid.getColumns()[columnIdx].id;
			const columnElement: HTMLElement = grid.getFooterRowColumn(columnId);
			columnElement.innerHTML = '<b>' + (this.totalRow[columnId] ? this.totalRow[columnId] : '') + '<b>';
		}
	}
	getSubjects() {
		this.smart.getSubject({}).subscribe((res: any) => {
			if (res && res.status === 'ok') {
				this.subjectArray = [];
				this.subjectArray = res.data;
			}
		});
	}
	repopulateTopFiveChart() {
		this.sub1Arr = [];
		this.sub2Arr = [];
		this.sub3Arr = [];
		this.sub4Arr = [];
		this.sub5Arr = [];
		this.dataArray = [];
		this.seriesArray = [];
		this.topFiveChart = {
			chart: {
				type: 'column',
			},
			title: {
				text: ''
			},
			xAxis: {
				categories: []
			},
			yAxis: {
				allowDecimals: false,
				min: 0,
				max: 100,
				title: {
					text: 'Percentage'
				}
			},
			tooltip: {
				formatter: function () {
					return '<b>' + this.x + '</b><br/>' +
						this.series.name + ': ' + this.y;
				}
			},
			plotOptions: {
				column: {
					pointPadding: 0.1,
					borderWidth: 0
				}
			},
			series: []
		};
	}
	checkColor(value) {
		if (value >= 70) {
			return 'green';
		}
		if (value > 50 && value < 70) {
			return '#b7b734';
		} else {
			return 'red';
		}
	}
	convertFloat(value) {
		const parseValue = Math.round(value * 100) / 100;
		return parseValue;
	}
	sumTotalsFormatter(totals, columnDef) {
		const val = totals.sum && totals.sum[columnDef.field];
		if (val != null) {
			return '<b class="total-footer-report">' + (Math.round(parseFloat(val) * 100) / 100) + '</b>';
		}
		return '';
	}
	srnTotalsFormatter(totals, columnDef) {
		if (totals.group.level === 0) {
			return '<b class="total-footer-report">Total</b>';
		}
		if (totals.group.level > 0) {
			return '<b class="total-footer-report">Sub Total (' + totals.group.value + ') </b>';
		}
	}
	countTotalsFormatter(totals, columnDef) {
		return '<b class="total-footer-report">' + totals.group.rows.length + '</b>';
	}
	checkNumberFormatter(row, cell, value, columnDef, dataContext) {
		if (value === 0) {
			return '-';
		} else {
			return value;
		}
	}
	checkSubjectCodeIndex(value) {
		const findex = this.subjectArray.findIndex((f: any) => f.sub_code.toString() === value.toString());
		return findex;
	}
	getSubjectName(value) {
		const findex = this.subjectArray.findIndex((f: any) => f.sub_code.toString() === value.toString());
		if (findex !== -1) {
			return this.subjectArray[findex].sub_name;
		}
	}
	getSubjectColor(value) {
		const findex = this.subjectArray.findIndex((f: any) => f.sub_code.toString() === value.toString());
		if (findex !== -1) {
			return this.subjectArray[findex].sub_color;
		}
	}
	checkStatusColor(status) {
		if (status && status === 'pass') {
			return 'green';
		}
		if (status && status === 'comp') {
			return '#b7b734';
		} else {
			return 'red';
		}
	}
	getbtnbg(value) {
		if (Number(value) >= 90) {
			return '#009688';
		} else if (Number(value) >= 80) {
			return '#4caf50';
		} else if (Number(value) >= 70) {
			return '#04cde4';
		} else if (Number(value) >= 60) {
			return '#ccdb39';
		} else if (Number(value) >= 50) {
			return '#fe9800';
		} else if (Number(value) >= 40) {
			return '#fe756d';
		} else if (Number(value) >= 32) {
			return '#e81e63';
		} else {
			return '#EB1010';
		}
	}
	excecuteCard(index) {
		this.tableFlag = false;
		this.secondFlag = false;
		if (this.previousIndex) {
			this.cardArray[this.previousIndex].class = 'cbse-box-two';
			this.cardArray[this.previousIndex].img = this.cardArray2[this.previousIndex].img;
		}
		this.previousIndex = index;
		this.cardArray[index].class = 'cbse-check';
		this.cardArray[index].img = this.succImg;
		this.header = this.cardArray[index].header;
		if (index === 0) {
			setTimeout(() => this.tableFlag = true, 100);
			setTimeout(() => this.secondFlag = true, 100);
		}
		if (index === 1) {
			this.repopulateTopFiveChart();
			this.getGridOptions();
			this.getTopFiveSubjects(this.class_id);
		}
		if (index === 2) {
			if (this.topTenDataArray.length === 0) {
				this.getTopTenDataPerSubject(this.class_id);
			} else {
				this.tableFlag = true;
				this.secondFlag = true;
			}
			if (this.cumulativeDataArray.length === 0) {
				this.getSubjectWiseAnalysis(this.class_id);
			} else {
				this.tableFlag = true;
				this.secondFlag = true;
			}
		}
	}
	getSubjectWiseAnalysis(class_id) {
		this.tableFlag = false;
		this.exam.getSubjectWiseAnalysis({ class_id: class_id }).subscribe((res: any) => {
			if (res && res.status === 'ok') {
				this.cumulativeDataArray = [];
				this.headerCumulative = [];
				this.cumulativeDataArray = res.data;
				let index = 0;
				for (const item of this.cumulativeDataArray) {
					for (const titem of item.analysisData) {
						if (index === 0) {
							this.headerCumulative.push(titem.egs_grade_name);
						}
					}
					index++;
				}
				setTimeout(() => this.secondFlag = true, 50);
				this.tableFlag = true;

			}
		});
	}
	getTopTenDataPerSubject(class_id) {
		this.exam.getTopTenDataPerSubject({ class_id: class_id }).subscribe((res: any) => {
			if (res && res.status === 'ok') {
				this.topTenDataArray = [];
				this.topTenDataArray = res.data;
			}
		});
	}
	getMarksAnalysis(class_id) {
		this.getGridOptions();
		this.previousIndex = 0;
		this.header = 'Analysis';
		this.secondFlag = false;
		this.tableFlag = false;
		this.tabSubDataArray = [];
		this.tabSubArray = [];
		this.markJSON = [];
		this.totalMarks = 0;
		this.tabHeaderArray = [];
		this.stuDetailsArray = [];
		this.aggregatearray = [];
		this.columnDefinitions = [];
		this.dataset = [];
		this.tableFlag = false;
		this.totalRow = {};
		this.aggregatearray = [];
		this.cardArray = [{
			id: '1',
			class: 'cbse-box-two',
			initialState: 'cbse-report-box disabled-box text-center',
			img: '/assets/images/examination/marks_register.svg',
			header: 'Marks Register'
		},
		{
			id: '2',
			class: 'cbse-box-two',
			initialState: 'cbse-report-box disabled-box text-center',
			img: '/assets/images/examination/best_five_subjects.svg',
			header: 'Best Five Subjects'
		},
		{
			id: '3',
			class: 'cbse-box-two',
			initialState: 'cbse-report-box disabled-box text-center',
			img: '/assets/images/examination/subject_wise_analysis.svg',
			header: 'Subject Wise Analysis'
		},
		// {
		//   id: '4',
		//   class: 'cbse-box-two',
		//   initialState: 'cbse-report-box disabled-box text-center',
		//   img: '/assets/images/examination/trend_analysis.svg',
		//   header: 'Stream Wise Analysis'
		// },
		{
			id: '5',
			class: 'cbse-box-two',
			initialState: 'cbse-report-box disabled-box text-center',
			img: '/assets/images/examination/trend_analysis.svg',
			header: 'Trend Wise Analysis'
		}];
		this.exam.getMarksAnalysis({
			class_id: class_id
		}).subscribe((res: any) => {
			if (res && res.status === 'ok') {
				for (const titem of this.cardArray) {
					titem.initialState = 'cbse-report-box text-center';
				}
				this.columnDefinitions = [
					{
						id: 'cma_rollno',
						name: 'Roll No',
						field: 'cma_rollno',
						sortable: true,
						filterable: true,
						grouping: {
							getter: 'cma_rollno',
							formatter: (g) => {
								return `${g.value} <span style="color:green"> (${g.count})</span>`;
							},
							aggregators: this.aggregatearray,
							aggregateCollapsed: true,
							collapsed: false
						},
						groupTotalsFormatter: this.srnTotalsFormatter
					},
					{
						id: 'cma_sex',
						name: 'Sex',
						field: 'cma_sex',
						sortable: true,
						filterable: true,
						grouping: {
							getter: 'cma_sex',
							formatter: (g) => {
								return `${g.value} <span style="color:green"> (${g.count})</span>`;
							},
							aggregators: this.aggregatearray,
							aggregateCollapsed: true,
							collapsed: false
						}
					},
					{
						id: 'cma_student_name',
						name: 'Student Name',
						field: 'cma_student_name',
						sortable: true,
						filterable: true,
						grouping: {
							getter: 'cma_student_name',
							formatter: (g) => {
								return `${g.value} <span style="color:green"> (${g.count})</span>`;
							},
							aggregators: this.aggregatearray,
							aggregateCollapsed: true,
							collapsed: false
						}
					}];
				this.stuDetailsArray = [];
				this.stuDetailsArray = res.data;
				let ind = 0;
				for (const item of this.stuDetailsArray) {
					Object.keys(this.stuDetailsArray[ind]).forEach((key: any) => {
						for (const titem of this.subjectArray) {
							if (titem.sub_code.toString() === key.toString()) {
								const findex = this.tabSubArray.findIndex(f => f.sub_code.toString() === key.toString());
								if (findex === -1) {
									this.tabSubArray.push(this.stuDetailsArray[ind][key]);
								}
							}
						}
					});
					ind++;
				}
				console.log(this.tabSubArray);
				this.totalMarks = this.tabSubArray.length * 100;
				let ind2 = 0;
				for (const item of this.stuDetailsArray) {
					const markObj: any = {};
					const sub_data: any[] = [];
					let indext = 0;
					const obj: any = {};
					obj['id'] = ind2 + item['cma_student_name'];
					obj['cma_rollno'] = item['cma_rollno'];
					obj['cma_sex'] = item['cma_sex'];
					obj['cma_student_name'] = new TitleCasePipe().transform(item['cma_student_name']);
					obj['total'] = item['total'];
					obj['per'] = this.convertFloat((item['total'] / (item['sub_count'] * 100)) * 100);
					obj['cma_status'] = item['cma_status'] ? item['cma_status'].toUpperCase() : '-';
					obj['cma_internal_grades'] = item['cma_internal_grades'] ? item['cma_internal_grades'] : '';
					this.markRegisterxSeries.push(new TitleCasePipe().transform(item['cma_student_name']));
					this.marksRegisterChart.xAxis.categories = this.markRegisterxSeries;
					this.percentSeries.push({
						y: obj['per'],
						color: this.checkColor(Number(obj['per']))
					});
					for (const titem of this.tabSubArray) {
						if (this.stuDetailsArray[ind2][titem.sub_code]) {
							sub_data.push(this.stuDetailsArray[ind2][titem.sub_code]);
							obj[titem.sub_code] = this.stuDetailsArray[ind2][titem.sub_code].subject;
							obj['marks' + indext] = Number(this.stuDetailsArray[ind2][titem.sub_code].marks);
							obj['grade' + indext] = this.stuDetailsArray[ind2][titem.sub_code].grade;
						} else {
							sub_data.push({
								grade: '-',
								marks: '-',
								sub_code: titem.sub_code,
								subject: titem.subject,
							});
							obj[titem.sub_code] = this.stuDetailsArray[ind2][titem.sub_code] ? this.stuDetailsArray[ind2][titem.sub_code].subject : '-';
							obj['marks' + indext] = 0;
							obj['grade' + indext] = 0;
						}
						if (ind2 === 0) {
							this.columnDefinitions.push({
								id: titem.sub_code,
								name: titem.subject,
								field: titem.sub_code,
								filterable: true,
								sortable: true
							});
							this.columnDefinitions.push({
								id: 'marks' + indext,
								name: 'Marks',
								cssClass: 'amount-report-fee',
								field: 'marks' + indext,
								filterable: true,
								sortable: true,
								formatter: this.checkNumberFormatter
							});
							markObj['marks' + indext] = '';
							markObj['grade' + indext] = '';
							markObj[titem.sub_code] = '';
							if (indext === 0) {
								this.markJSON.push(markObj);
							}
							this.columnDefinitions.push({
								id: 'grade' + indext,
								name: 'Grade',
								field: 'grade' + indext,
								filterable: true,
								sortable: true,
								formatter: this.checkNumberFormatter
							});
						}
						indext++;
					}
					this.dataset.push(obj);
					const findex = this.tabSubDataArray.findIndex(f => Number(f.index) === ind2);
					if (findex === -1) {
						this.tabSubDataArray.push({
							index: ind2,
							sub_data: sub_data
						});
					}
					ind2++;
				}
				this.columnDefinitions.push({
					id: 'cma_internal_grades',
					name: 'Internal Grades',
					field: 'cma_internal_grades',
					sortable: true,
					filterable: true
				});
				this.columnDefinitions.push({
					id: 'total',
					name: 'Total',
					field: 'total',
					sortable: true,
					filterable: true,
					groupTotalsFormatter: this.sumTotalsFormatter
				});
				this.columnDefinitions.push({
					id: 'per',
					name: '% Scored',
					field: 'per',
					sortable: true,
					filterable: true,
				});
				this.columnDefinitions.push({
					id: 'cma_status',
					name: 'Status',
					field: 'cma_status',
					sortable: true,
					filterable: true,
					grouping: {
						getter: 'cma_status',
						formatter: (g) => {
							return `${g.value} <span style="color:green"> (${g.count})</span>`;
						},
						aggregators: this.aggregatearray,
						aggregateCollapsed: true,
						collapsed: false
					},
					groupTotalsFormatter: this.countTotalsFormatter
				});
				this.totalRow = {};
				const obj3: any = {};
				obj3['id'] = '';
				obj3['cma_rollno'] = this.common.htmlToText('<b>Grand Total</b>');
				obj3['cma_sex'] = '';
				obj3['cma_student_name'] = '';
				Object.keys(this.markJSON).forEach((key: any) => {
					Object.keys(this.markJSON[key]).forEach((key2: any) => {
						Object.keys(this.dataset).forEach((key3: any) => {
							Object.keys(this.dataset[key3]).forEach((key4: any) => {
								if (key4.toString() === key2.toString()) {
									if (key4.toString().match(/marks/)) {
										obj3[key2] = this.dataset.map(f => f[key2]).reduce((acc, val) => acc + val, 0);
									} else {
										obj3[key2] = '';
									}
								}
							});
						});
					});
				});
				obj3['cma_internal_grades'] = '';
				obj3['total'] = this.dataset.map(f => f.total).reduce((acc, val) => acc + val, 0);
				obj3['per'] = '';
				obj3['cma_status'] = '';
				this.totalRow = obj3;
				this.aggregatearray.push(new Aggregators.Sum('total'));
				this.tableFlag = true;
				if (this.dataset.length > 2 && this.dataset.length <= 5) {
					this.gridHeight = 300;
				} else if (this.dataset.length <= 10 && this.dataset.length > 5) {
					this.gridHeight = 400;
				} else if (this.dataset.length > 10 && this.dataset.length <= 20) {
					this.gridHeight = 550;
				} else if (this.dataset.length > 20) {
					this.gridHeight = 750;
				} else {
					this.gridHeight = 250;
				}
			} else {
				for (const titem of this.cardArray) {
					titem.initialState = 'cbse-report-box disabled-box text-center';
				}
			}
		});
	}
	getMarks(class_id) {
		this.class_id = class_id;
		this.getMarksAnalysis(class_id);
	}
	getTopFiveSubjects(class_id) {
		this.tabSubDataArray = [];
		this.tabSubArray = [];
		this.totalMarks = 0;
		this.tabHeaderArray = [];
		this.stuDetailsArray2 = [];
		this.markJSON = [];
		this.aggregatearray = [];
		this.columnDefinitions2 = [];
		this.dataset2 = [];
		let dataArr: any[] = [];
		this.tableFlag = false;
		this.totalRow = {};
		this.exam.getTopFiveSubjects({ class_id: class_id }).subscribe((res: any) => {
			if (res && res.status === 'ok') {
				this.stuDetailsArray2 = [];
				this.stuDetailsArray2 = res.data;
				this.columnDefinitions2 = [
					{
						id: 'cma_rollno',
						name: 'Roll No',
						field: 'cma_rollno',
						sortable: true,
						filterable: true,
						grouping: {
							getter: 'cma_rollno',
							formatter: (g) => {
								return `${g.value} <span style="color:green"> (${g.count})</span>`;
							},
							aggregators: this.aggregatearray,
							aggregateCollapsed: true,
							collapsed: false
						},
						groupTotalsFormatter: this.srnTotalsFormatter
					},
					{
						id: 'cma_sex',
						name: 'Sex',
						field: 'cma_sex',
						sortable: true,
						filterable: true,
						grouping: {
							getter: 'cma_sex',
							formatter: (g) => {
								return `${g.value} <span style="color:green"> (${g.count})</span>`;
							},
							aggregators: this.aggregatearray,
							aggregateCollapsed: true,
							collapsed: false
						}
					},
					{
						id: 'cma_student_name',
						name: 'Student Name',
						field: 'cma_student_name',
						sortable: true,
						filterable: true,
						grouping: {
							getter: 'cma_student_name',
							formatter: (g) => {
								return `${g.value} <span style="color:green"> (${g.count})</span>`;
							},
							aggregators: this.aggregatearray,
							aggregateCollapsed: true,
							collapsed: false
						}
					}];
				let ind = 0;
				for (const item of this.stuDetailsArray2) {
					Object.keys(this.stuDetailsArray2[ind]).forEach((key: any) => {
						for (const titem of this.subjectArray) {
							if (titem.sub_code.toString() === key.toString()) {
								const findex = this.tabSubArray.findIndex(f => f.sub_code.toString() === key.toString());
								if (findex === -1) {
									this.stuDetailsArray2[ind][key]['sub_color'] = titem.sub_color;
									this.tabSubArray.push(this.stuDetailsArray2[ind][key]);
								}
							}
						}
					});
					ind++;
				}
				console.log(this.tabSubArray);
				for (const item of this.tabSubArray) {
					this.seriesArray.push({
						name: item.subject,
						data: this.getSubjetDataTopFive(item.sub_code),
						color: item.sub_color
					});
				}
				this.topFiveChart.series = this.seriesArray;
				let ind2 = 0;
				for (const item of this.stuDetailsArray2) {
					const markObj: any = {};
					const sub_data: any[] = [];
					let indext = 0;
					const obj: any = {};
					obj['id'] = ind2 + item['cma_student_name'];
					obj['cma_rollno'] = item['cma_rollno'];
					obj['cma_sex'] = item['cma_sex'];
					obj['cma_student_name'] = new TitleCasePipe().transform(item['cma_student_name']);
					obj['total'] = item['total'];
					obj['per'] = this.convertFloat((item['total'] / (item['sub_count'] * 100)) * 100);
					obj['cma_status'] = item['cma_status'] ? item['cma_status'].toUpperCase() : '-';
					this.topFiveChart.xAxis.categories.push(new TitleCasePipe().transform(item['cma_student_name']));
					for (const titem of this.tabSubArray) {
						if (this.stuDetailsArray2[ind2][titem.sub_code]) {
							sub_data.push(this.stuDetailsArray2[ind2][titem.sub_code]);
							obj[titem.sub_code] = this.stuDetailsArray2[ind2][titem.sub_code].subject;
							obj['marks' + indext] = Number(this.stuDetailsArray2[ind2][titem.sub_code].marks);
							obj['grade' + indext] = this.stuDetailsArray2[ind2][titem.sub_code].grade;
						} else {
							sub_data.push({
								grade: '-',
								marks: '-',
								sub_code: titem.sub_code,
								subject: titem.subject,
							});
							obj[titem.sub_code] = this.stuDetailsArray2[ind2][titem.sub_code] ? this.stuDetailsArray2[ind2][titem.sub_code].subject : '-';
							obj['marks' + indext] = 0;
							obj['grade' + indext] = 0;
						}
						if (ind2 === 0) {
							this.columnDefinitions2.push({
								id: titem.sub_code,
								name: titem.subject,
								field: titem.sub_code,
								filterable: true,
								sortable: true
							});
							this.columnDefinitions2.push({
								id: 'marks' + indext,
								name: 'Marks',
								cssClass: 'amount-report-fee',
								field: 'marks' + indext,
								filterable: true,
								sortable: true,
								formatter: this.checkNumberFormatter
							});
							markObj['marks' + indext] = '';
							markObj['grade' + indext] = '';
							markObj[titem.sub_code] = '';
							if (indext === 0) {
								this.markJSON.push(markObj);
							}
							this.columnDefinitions2.push({
								id: 'grade' + indext,
								name: 'Grade',
								field: 'grade' + indext,
								filterable: true,
								sortable: true,
								formatter: this.checkNumberFormatter
							});
						}
						indext++;
					}
					this.dataset2.push(obj);
					const findex = this.tabSubDataArray.findIndex(f => Number(f.index) === ind2);
					if (findex === -1) {
						this.tabSubDataArray.push({
							index: ind2,
							sub_data: sub_data
						});
					}
					ind2++;
				}
				this.columnDefinitions2.push({
					id: 'total',
					name: 'Total',
					field: 'total',
					sortable: true,
					filterable: true,
					groupTotalsFormatter: this.sumTotalsFormatter
				});
				this.columnDefinitions2.push({
					id: 'per',
					name: '% Scored',
					field: 'per',
					sortable: true,
					filterable: true,
				});
				this.columnDefinitions2.push({
					id: 'cma_status',
					name: 'Status',
					field: 'cma_status',
					sortable: true,
					filterable: true,
					grouping: {
						getter: 'cma_status',
						formatter: (g) => {
							return `${g.value} <span style="color:green"> (${g.count})</span>`;
						},
						aggregators: this.aggregatearray,
						aggregateCollapsed: true,
						collapsed: false
					},
					groupTotalsFormatter: this.countTotalsFormatter
				});
				this.totalRow = {};
				const obj3: any = {};
				obj3['id'] = '';
				obj3['cma_rollno'] = this.common.htmlToText('<b>Grand Total</b>');
				obj3['cma_sex'] = '';
				obj3['cma_student_name'] = '';
				Object.keys(this.markJSON).forEach((key: any) => {
					Object.keys(this.markJSON[key]).forEach((key2: any) => {
						Object.keys(this.dataset2).forEach((key3: any) => {
							Object.keys(this.dataset2[key3]).forEach((key4: any) => {
								if (key4.toString() === key2.toString()) {
									if (key4.toString().match(/marks/)) {
										obj3[key2] = this.dataset2.map(f => f[key2]).reduce((acc, val) => acc + val, 0);
									} else {
										obj3[key2] = '';
									}
								}
							});
						});
					});
				});
				obj3['total'] = this.dataset2.map(f => f.total).reduce((acc, val) => acc + val, 0);
				obj3['per'] = '';
				obj3['cma_status'] = '';
				this.totalRow = obj3;
				this.aggregatearray.push(new Aggregators.Sum('total'));
				this.tableFlag = true;
				if (this.dataset2.length > 2 && this.dataset2.length <= 5) {
					this.gridHeight2 = 300;
				} else if (this.dataset2.length <= 10 && this.dataset2.length > 5) {
					this.gridHeight2 = 400;
				} else if (this.dataset2.length > 10 && this.dataset2.length <= 20) {
					this.gridHeight2 = 550;
				} else if (this.dataset2.length > 20) {
					this.gridHeight2 = 750;
				} else {
					this.gridHeight2 = 250;
				}
				setTimeout(() => this.secondFlag = true, 100);
			}
		});
	}
	getSubjetDataTopFive(sub_code) {
		const array: any[] = [];
		for (const item of this.stuDetailsArray2) {
			if (item[sub_code]) {
				array.push(Number(item[sub_code].marks));
			} else {
				array.push(Number(0));
			}
		}
		return array;
	}
	openUploadDialog(): void {
		// tslint:disable-next-line: no-use-before-declare
		const dialogRef = this.dialog.open(CbseMarksUploadDialog, {
			width: '35%',
			data: {
				classArray: this.classArray,
				sessionArray: this.sessionArray
			}
		});

		dialogRef.afterClosed().subscribe(result => {
			console.log('The dialog was closed');
		});
	}
	getIsBoardClass() {
		this.exam.getIsBoardClass({ is_board: '1' }).subscribe((res: any) => {
			if (res && res.status === 'ok') {
				this.classArray = [];
				this.classArray = res.data;
			}
		});
	}
	getSession() {
		this.sis.getSession().subscribe((res: any) => {
			if (res && res.status === 'ok') {
				this.sessionArray = [];
				this.sessionArray = res.data;
			}
		});
	}
	getGridOptions() {
		this.gridOptions = {
			enableDraggableGrouping: true,
			createPreHeaderPanel: true,
			showPreHeaderPanel: true,
			enableHeaderMenu: true,
			preHeaderPanelHeight: 40,
			enableFiltering: true,
			enableSorting: true,
			enableColumnReorder: true,
			createFooterRow: true,
			showFooterRow: true,
			footerRowHeight: 35,
			enableExcelCopyBuffer: true,
			enableAutoTooltip: true,
			enableCellNavigation: true,
			fullWidthRows: true,
			headerMenu: {
				iconColumnHideCommand: 'fas fa-times',
				iconSortAscCommand: 'fas fa-sort-up',
				iconSortDescCommand: 'fas fa-sort-down',
				title: 'Sort'
			},
			exportOptions: {
				sanitizeDataExport: true,
				exportWithFormatter: true
			},
			gridMenu: {
				customItems: [{
					title: 'pdf',
					titleKey: 'Export as PDF',
					command: 'exportAsPDF',
					iconCssClass: 'fas fa-download'
				},
				{
					title: 'excel',
					titleKey: 'Export Excel',
					command: 'exportAsExcel',
					iconCssClass: 'fas fa-download'
				},
				{
					title: 'expand',
					titleKey: 'Expand Groups',
					command: 'expandGroup',
					iconCssClass: 'fas fa-expand-arrows-alt'
				},
				{
					title: 'collapse',
					titleKey: 'Collapse Groups',
					command: 'collapseGroup',
					iconCssClass: 'fas fa-compress'
				},
				{
					title: 'cleargroup',
					titleKey: 'Clear Groups',
					command: 'cleargroup',
					iconCssClass: 'fas fa-eraser'
				}
				],
				onCommand: (e, args) => {
					if (args.command === 'toggle-preheader') {
						// in addition to the grid menu pre-header toggling (internally), we will also clear grouping
						this.clearGrouping();
					}
					if (args.command === 'exportAsPDF') {
						// in addition to the grid menu pre-header toggling (internally), we will also clear grouping
					}
					if (args.command === 'expandGroup') {
						// in addition to the grid menu pre-header toggling (internally), we will also clear grouping
						this.expandAllGroups();
					}
					if (args.command === 'collapseGroup') {
						// in addition to the grid menu pre-header toggling (internally), we will also clear grouping
						this.collapseAllGroups();
					}
					if (args.command === 'cleargroup') {
						// in addition to the grid menu pre-header toggling (internally), we will also clear grouping
						this.clearGrouping();
					}
					if (args.command === 'exportAsExcel') {
						// in addition to the grid menu pre-header toggling (internally), we will also clear grouping
					}
					if (args.command === 'export-csv') {
					}
				},
				onColumnsChanged: (e, args) => {
					this.updateTotalRow(this.angularGrid.slickGrid);
				},
			},
			draggableGrouping: {
				dropPlaceHolderText: 'Drop a column header here to group by the column',
				// groupIconCssClass: 'fa fa-outdent',
				deleteIconCssClass: 'fa fa-times',
				onGroupChanged: (e, args) => {
					this.groupColumns = [];
					this.groupColumns = args.groupColumns;
					this.onGroupChanged(args && args.groupColumns);
					setTimeout(() => {
						this.updateTotalRow(this.angularGrid.slickGrid);
					}, 100);
				},
				onExtensionRegistered: (extension) => this.draggableGroupingPlugin = extension,
			}
		};
	}
	clearGroupsAndSelects() {
		this.selectedGroupingFields.forEach((g, i) => this.selectedGroupingFields[i] = '');
		this.clearGrouping();
	}

	clearGrouping() {
		if (this.draggableGroupingPlugin && this.draggableGroupingPlugin.setDroppedGroups) {
			this.draggableGroupingPlugin.clearDroppedGroups();
		}
	}

	collapseAllGroups() {
		this.dataviewObj.collapseAllGroups();
		this.updateTotalRow(this.angularGrid.slickGrid);
	}

	expandAllGroups() {
		this.dataviewObj.expandAllGroups();
		this.updateTotalRow(this.angularGrid.slickGrid);
	}
	onGroupChanged(groups: Grouping[]) {
		if (Array.isArray(this.selectedGroupingFields) && Array.isArray(groups) && groups.length > 0) {
			// update all Group By select dropdown
			this.selectedGroupingFields.forEach((g, i) => {
				this.selectedGroupingFields[i] = groups[i] && groups[i].getter || '';
			});
		}
	}

}

@Component({
	selector: 'cbse-marks-upload-dialog',
	templateUrl: 'cbse-marks-upload-dialog.html',
})
export class CbseMarksUploadDialog implements OnInit {
	classArray: any[] = [];
	sessionArray: any[] = [];
	subjectArray: any[] = [];
	stuDetailsArray: any[] = [];
	tabSubArray: any[] = [];
	tabHeaderArray: any[] = [];
	tableFlag = false;
	tabSubDataArray: any[] = [];
	class_id = '';
	ses_id = '';
	subjectClassArray: any[];
	currentUser: any = {};
	constructor(
		public dialogRef: MatDialogRef<CbseMarksUploadDialog>,
		private smart: SmartService,
		private exam: ExamService,
		@Inject(MAT_DIALOG_DATA) public data: any) { }

	onNoClick(): void {
		this.dialogRef.close();
	}
	ngOnInit() {
		this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
		this.classArray = this.data.classArray;
		this.sessionArray = this.data.sessionArray;
		this.getSubjects();
	}
	getSubjects() {
		this.smart.getSubject({}).subscribe((res: any) => {
			if (res && res.status === 'ok') {
				this.subjectArray = [];
				this.subjectArray = res.data;
			}
		});
	}
	getSubjectByClass(class_id) {
		this.smart.getSubject({
			class_id: class_id
		}).subscribe((res: any) => {
			if (res && res.status === 'ok') {
				this.subjectClassArray = [];
				this.subjectClassArray = res.data;
			}
		});
	}
	getClass(value) {
		this.class_id = value;
		this.getSubjectByClass(this.class_id);
	}
	getSession(value) {
		this.ses_id = value;
	}
	upload($event) {
		this.tableFlag = false;
		this.tabSubDataArray = [];
		this.tabSubArray = [];
		this.tabHeaderArray = [];
		this.stuDetailsArray = [];
		const file = $event.target.files[0];
		const reader: FileReader = new FileReader();
		const finalArray: any[] = [];
		reader.onloadend = (e: any) => {
			const dataArr: any[] = e.target.result.split(/\r?\n/);
			const studentArray: any[] = [];
			let certFlag = false;
			for (const item of dataArr) {
				if (item.match(/CERTIFICATE/)) {
					certFlag = true;
					break;
				}
			}
			for (const item of dataArr) {
				if (!item.match(/ROLL/) && !item.match(/MKS/)
					&& !item.match(/------------/)
					&& !item.match(/REGION/) && !item.match(/SCHOOL/) &&
					!item.match(/DATE/) && item) {
					studentArray.push(item);
				}
			}
			for (const titem of studentArray) {
				const stu: any[] = titem.split(' ');
				const tempArray: any[] = [];
				for (const ti of stu) {
					if (ti) {
						tempArray.push(ti);
					}
				}
				if (tempArray.length > 1) {
					finalArray.push(tempArray);
				}
			}
			console.log(finalArray);
			let i = 0;
			for (const item of finalArray) {
				let j = 0;
				let internalGrades: any = [];
				for (const titem of finalArray[i]) {
					if (j < 2 && (finalArray[i][j].match(/M/) || finalArray[i][j].match(/F/))) {
						this.stuDetailsArray.push({
							cma_rollno: finalArray[i][j - 1],
							cma_sex: finalArray[i][j],
							cma_class_id: this.class_id,
							cma_ses_id: this.ses_id,
							cma_created_by: this.currentUser.login_id
						});
					}
					let k = 0;
					let stuName = '';
					for (const tt of finalArray[i]) {
						if (this.checkSubjectCodeIndex(tt) !== -1) {
							break;
						} else {
							if (k > 1) {
								stuName = stuName + finalArray[i][k] + ' ';
							}
							k++;
						}
					}
					if (
						(j >= k && Number(finalArray[i][j - 1])
							&& (this.checkSubjectCodeIndex(finalArray[i][j - 2]) !== -1)
							&&
							(finalArray[i][j].match(/A1/) ||
								finalArray[i][j].match(/A2/) ||
								finalArray[i][j].match(/B1/) ||
								finalArray[i][j].match(/B2/) ||
								finalArray[i][j].match(/C1/) ||
								finalArray[i][j].match(/E/) ||
								finalArray[i][j].match(/D/) ||
								finalArray[i][j].match(/C2/) ||
								finalArray[i][j].match(/D1/) ||
								finalArray[i][j].match(/D2/) ||
								finalArray[i][j].match(/E1/) ||
								finalArray[i][j].match(/E2/) ||
								finalArray[i][j].match(/F1/) ||
								finalArray[i][j].match(/FE/) ||
								finalArray[i][j].match(/FTE/) ||
								finalArray[i][j].match(/F2/)))) {
						this.stuDetailsArray[i][finalArray[i][j - 2]] = {
							marks: finalArray[i][j - 1],
							grade: finalArray[i][j],
							sub_code: finalArray[i][j - 2],
							subject: this.getSubjectName(finalArray[i][j - 2])
						};
					} else {
						if (finalArray[i][j].match(/PASS/)
							|| finalArray[i][j].match(/FAIL/)
							|| finalArray[i][j].match(/ABST/)
							|| finalArray[i][j].match(/COMP/)) {
							console.log(j);
							if (certFlag) {
								internalGrades.push(finalArray[i][j - 3]);
								internalGrades.push(finalArray[i][j - 2]);
								internalGrades.push(finalArray[i][j - 1]);
							}
						}
					}
					if (j === finalArray[i].length - 1) {
						this.stuDetailsArray[i]['cma_internal_grades'] = internalGrades;
					}
					j++;
				}
				i++;
			}
			let indext = 0;
			for (const item of this.stuDetailsArray) {
				const subjectMarkArray: any[] = [];
				Object.keys(this.stuDetailsArray[indext]).forEach((key: any) => {
					if (this.checkSubjectCodeIndex(key) !== -1) {
						subjectMarkArray.push(this.stuDetailsArray[indext][key]['marks']
							? Number(this.stuDetailsArray[indext][key]['marks']) : 0);
					}
				});
				let count = 0;
				for (const subM of subjectMarkArray) {
					if (subM >= 33) {
						count++;
					}
				}
				let status = '';
				if (count === subjectMarkArray.length) {
					status = 'pass';
				} else if (count === 0) {
					status = 'fail';
				} else {
					status = 'comp';
				}
				this.stuDetailsArray[indext]['cma_status'] = status;
				indext++;
			}
			console.log(this.stuDetailsArray);
			this.exam.insertMarksAnalysis({
				studentData: this.stuDetailsArray,
				subjects: this.subjectClassArray,
				class_id: this.class_id,
				ses_id: this.ses_id
			}).subscribe((res: any) => {
				if (res && res.status === 'ok') {
				} else {
				}
			});
		};
		reader.readAsText(file);
	}
	checkSubjectCodeIndex(value) {
		const findex = this.subjectArray.findIndex((f: any) => f.sub_code.toString() === value.toString());
		return findex;
	}
	getSubjectName(value) {
		const findex = this.subjectArray.findIndex((f: any) => f.sub_code.toString() === value.toString());
		if (findex !== -1) {
			return this.subjectArray[findex].sub_name;
		}
	}
}

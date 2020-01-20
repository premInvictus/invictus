export const slctable = {
		PendingSlc: {
				tablleHeader: 'List of pending SLC/ TC',
				columnDef: ['requestno', 'requestdate', 'admissionno', 'studentname', 'classsection', 'status', 'action'],
				colunmHeader: ['Request No.', 'Request Date', 'Admission No.', 'Student name', 'Class - Section', 'Status', 'Action'],
				data: [],
				actions: [
						{ actionname: 'Approve', actionclass: 'btn-success  btn-promote', actionfunction: 'pendingapprove', actionpermission: '263' },
						{
								actionname: 'View', actionclass: 'btn-neutral btn-navspacer ', actionfunction: 'pendingaview',
								actionpermission: ''
						},
						{
								actionname: 'Cancel', actionclass: 'btn-danger btn-navspacer btn-promote canc-btn', actionfunction: 'pendingdelete',
								actionpermission: ''
						}
				]
		},
		IssuedSlc: {
				tablleHeader: 'List of Issued SLC/ TC',
				columnDef: ['certificateno', 'certificatedate', 'admissionno', 'studentname', 'classsection', 'status', 'action'],
				colunmHeader: ['Request No.', 'Request Date', 'Admission No.', 'Student name', 'Class - Section', 'Status', 'Action'],
				data: [],
				actions: [
						{ actionname: 'Issue', actionclass: 'btn-brown btn-navspacer btn-promote', actionfunction: 'issuedissue', actionpermission: '' },
						{
								actionname: 'Reissue', actionclass: 'btn-setting btn-navspacer btn-promote', actionfunction: 'issuedreissue',
								actionpermission: ''
						},
						{
								actionname: 'Print', actionclass: 'btn-setting btn-navspacer btn-promote', actionfunction: 'issuedprint',
								actionpermission: ''
						},
						{
								actionname: 'View', actionclass: 'btn-neutral btn-navspacer btn-promote', actionfunction: 'issuedview',
								actionpermission: ''
						},
						{
								actionname: 'Cancel', actionclass: 'btn-danger btn-navspacer btn-promote canc-btn', actionfunction: 'issueddelete',
								actionpermission: ''
						}
				]
		}
};

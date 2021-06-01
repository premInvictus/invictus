export const ckconfig = {
	allowedContent: true,
	pasteFromWordRemoveFontStyles: false,
	contentsCss: ['https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css'],
	disallowedContent: 'm:omathpara',
	// tslint:disable-next-line:max-line-length
	extraPlugins: 'strinsert',
	scayt_multiLanguageMod: true,
	toolbar: [
		// tslint:disable-next-line:max-line-length
		['Font', 'FontSize', 'Subscript', 'Superscript', 'Videoembed', 'Bold', 'Italic', 'Underline', 'Strikethrough', 'Image', 'Table', 'Templates',
			{ name: 'strinsert', items: ['strinsert'] }
		]
	],
	removeDialogTabs: 'image:advanced;image:Link'
};
 

// this.ckeConfig = {
// 			allowedContent: true,
// 			pasteFromWordRemoveFontStyles: false,
// 			contentsCss: ['https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css'],
// 			disallowedContent: 'm:omathpara',
// 			height: '150',
// 			width: '100%',
// 			// tslint:disable-next-line:max-line-length 
// 			extraPlugins: 'language,html5audio,html5video,clipboard,undo,uploadfile,uploadimage,uploadwidget,filetools,notificationaggregator,notification,simpleImageUpload',
// 			scayt_multiLanguageMod: true,
// 			mathJaxLib: '//cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.4/MathJax.js?config=TeX-AMS_HTML',
// 			language_list: ['fr:French', 'es:Spanish', 'it:Italian', 'he:Hebrew:rtl', 'pt:Portuguese', 'de:German', 'hi:Hindi'],
// 			filebrowserUploadMethod: 'form',
// 			uploadUrl: 'https://apiaxiom.invictusdigisoft.com/upload.php',
// 			filebrowserImageUploadUrl: 'https://apiaxiom.invictusdigisoft.com/upload.php',
// 			filebrowserUploadUrl: 'https://apiaxiom.invictusdigisoft.com/upload.php',
// 			filebrowserBrowseUrl: 'https://apiaxiom.invictusdigisoft.com/upload.php',
// 			filebrowserImageBrowseUrl: 'https://apiaxiom.invictusdigisoft.com/upload.php',
// 			toolbar: [
// 				// tslint:disable-next-line:max-line-length
// 				['Font', 'FontSize', 'Subscript', 'Superscript', 'Bold', 'Italic', 'Underline', 'StrikeThrough', 'Image', 'Table',
// 					// { name: 'Html5audio', items: [ 'Html5audio' ] },
// 					// { name: 'Html5video', items: [ 'Html5video' ] },
// 					{ name: 'UploadFile', items: ['UploadFile'] },
// 					{ name: 'UploadImage', items: ['UploadImage'] },
// 					{ name: 'UploadWidget', items: ['UploadWidget'] },
// 					{ name: 'FileTools', items: ['FileTools'] },
// 					{ name: 'Notificationsggregator', items: ['Notificationaggregator'] },
// 					{ name: 'Notification', items: ['Notification'] },
// 					{ name: 'SimpleImageUpload', items: ['SimpleImageUpload'] }
// 				]
// 			],
// 			removeDialogTabs: 'image:advanced;image:Link;html5video:advanced;html5audio:advanced'
// 		};
export const ckconfig = {
		allowedContent: true,
		pasteFromWordRemoveFontStyles : false,
		disallowedContent : 'm:omathpara',
		// tslint:disable-next-line:max-line-length
		extraPlugins: 'mathjax,language,html5audio,html5video,videoembed,pramukhime,pastefromword,clipboard,undo,uploadfile,uploadimage,uploadwidget,filetools,notificationaggregator,notification,simpleImageUpload,simpleVideoUpload,simpleAudioUpload,keystrokes',
		scayt_multiLanguageMod : true,
		mathJaxLib : '//cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.4/MathJax.js?config=TeX-AMS_HTML',
		language_list : [ 'fr:French', 'es:Spanish', 'it:Italian',  'he:Hebrew:rtl', 'pt:Portuguese', 'de:German', 'hi:Hindi' ],
		filebrowserUploadMethod : 'form',
		uploadUrl : 'https://apiaxiom.invictusdigisoft.com/upload.php',
		filebrowserImageUploadUrl : 'https://apiaxiom.invictusdigisoft.com/upload.php',
		filebrowserUploadUrl : 'https://apiaxiom.invictusdigisoft.com/upload.php',
		filebrowserBrowseUrl : 'https://apiaxiom.invictusdigisoft.com/upload.php',
		filebrowserImageBrowseUrl : 'https://apiaxiom.invictusdigisoft.com/upload.php',
		toolbar : [
					// tslint:disable-next-line:max-line-length
					['Font', 'FontSize', 'Subscript', 'Superscript', 'Videoembed', 'Bold', 'Italic', 'Underline', 'StrikeThrough', 'Image', 'Table', '-', 'PramukhIME', 'PramukhIMEClick', 'PramukhIMEConvert', 'PramukhIMEHelp', { name: 'Mathjax', items: [ 'Mathjax' ] },
					// { name: 'Html5audio', items: [ 'Html5audio' ] },
					// { name: 'Html5video', items: [ 'Html5video' ] },
					{ name: 'VideoEmbed', items: [ 'VideoEmbed' ] },
					{ name: 'PasteFromWord', items: [ 'PasteFromWord' ] },
					{ name: 'clipboard', groups: [ 'clipboard', 'undo' ] },
					{ name: 'UploadFile', items: [ 'UploadFile' ] },
					{ name: 'UploadImage', items: [ 'UploadImage' ] },
					{ name: 'UploadWidget', items: [ 'UploadWidget' ] },
					{ name: 'FileTools', items: [ 'FileTools' ] },
					{ name: 'Notificationsggregator', items: [ 'Notificationaggregator' ] },
					{ name: 'Notification', items: [ 'Notification' ] },
					{ name: 'SimpleImageUpload', items: [ 'SimpleImageUpload' ] },
					{ name: 'SimpleVideoUpload', items: [ 'SimpleVideoUpload' ] },
					{ name: 'SimpleAudioUpload', items: [ 'SimpleAudioUpload' ] },
					{ name: 'KeyStrokes', items: [ 'keystrokes' ] }
			]
			] ,
		removeDialogTabs : 'image:advanced;image:Link;html5video:advanced;html5audio:advanced'
};

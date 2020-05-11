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

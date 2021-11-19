/**
 * @license Copyright © 2013 Stuart Sillitoe <stuart@vericode.co.uk>
 * This work is mine, and yours. You can modify it as you wish.
 *
 * Stuart Sillitoe
 * stuartsillitoe.co.uk
 *
 */

CKEDITOR.plugins.add('strinsert',
{
	requires : ['richcombo'],
	init : function( editor )
	{
		//  array of strings to choose from that'll be inserted into the editor
		var strings = [];
		strings.push(['{{class_name}}', 'Class Name', 'Enter Class Label']);
		strings.push(['{{sec_name}}', 'Section Name', 'Enter Section Label']);
		strings.push(['{{teacher_name}}', 'Teacher Name', 'Enter Teacher Name Label']);
		strings.push(['{{student_name}}', 'Student Name', 'Enter Student Name Label']);
		strings.push(['{{authority_name}}', 'Authority Name', 'Enter Authority Name Label']);

		// add the menu to the editor
		editor.ui.addRichCombo('strinsert',
		{
			label: 		'Choose Label',
			title: 		'Choose Label',
			voiceLabel: 'Choose Label',
			className: 	'Choose Label',
			multiSelect:false,
			panel:
			{
				css: [ editor.config.contentsCss, CKEDITOR.skin.getPath('editor') ],
				voiceLabel: editor.lang.panelVoiceLabel
			},

			init: function()
			{
				this.startGroup( "Choose Label" );
				for (var i in strings)
				{
					this.add(strings[i][0], strings[i][1], strings[i][2]);
				}
			},

			onClick: function( value )
			{
				editor.focus();
				editor.fire( 'saveSnapshot' );
				editor.insertHtml(value);
				editor.fire( 'saveSnapshot' );
			}
		});
	}
});
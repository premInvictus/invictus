CKEDITOR.plugins.add( 'simpleAudioUpload', {
    init: function( editor ) {
        var audiofileDialog = $('<input type="file" id="audio" name="audio">');
        //console.log('editor', editor);
        audiofileDialog.on('change', function (e) {
            //console.log('e.target',e);
            var uploadUrl = editor.config.filebrowserUploadUrl;
			var file = audiofileDialog[0].files[0];
            
            var filename;
            if (file) {
                filename = file.name;    
            }
            
            var fileExt = filename.split('.').pop();
            console.log('fileExt--', fileExt);
			var imageData = new FormData();
			imageData.append('file', file);

			$.ajax({
				url: uploadUrl,
				type: 'POST',
				contentType: false,
				processData: false,
				data: imageData,
			}).done(function(done) {
                var ele;
                if (fileExt === "mp3") {
                    ele = editor.document.createElement('audio');
                    ele.setAttribute('src', done);
                    ele.setAttribute('controls', true);
                    editor.insertElement(ele);
                } else if (fileExt === "mp4") {
                    ele = editor.document.createElement('video');
                    ele.setAttribute('src', done);
                    ele.setAttribute('controls', true);
                    editor.insertElement(ele);
                } else if (fileExt === "jpg" || fileExt === "JPG" || fileExt.toLowerCase() === "bmp"  || fileExt === "JPEG" || fileExt === "png" || fileExt === "gif") {
                    ele = editor.document.createElement('img');
                    ele.setAttribute('src', done);
                    editor.insertElement(ele);
                }
                e.target.value = '';
				
			});

        })
        editor.ui.addButton( 'SimpleAudioUpload', {
            label: 'Insert Audio',
            command: 'openDialog',
            toolbar: 'insert',
            icon: CKEDITOR.plugins.getPath('simpleAudioUpload')+'audio.png'
        });
        editor.addCommand('openDialog', {
            exec: function(editor) {
                audiofileDialog.click();
            }
        })
    }
});
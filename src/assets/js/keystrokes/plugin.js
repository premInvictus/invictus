( function() {    
    CKEDITOR.plugins.add( 'keystrokes', {
        init: function( editor ) {	    
            editor.setKeystroke( CKEDITOR.ALT + 73 , 'bold'  );
        }
    });
} )();

var saemail = window.saemail || {}

saemail.config = {
    editableTextNodes: [],
    editableImages: [],
    mediumElements: [],
    removableElements: [],
}

saemail.controller = {

    init: function() {
       //$('body').addClass('loading');
    },

    defineEditableTextNodes: function() {

        $('.right_side table *').each(function(){
            if($(this).text().length){
                saemail.config.editableTextNodes.push($(this));
            }
        });

    },

    defineEditableImages: function() {

        $('.right_side img').each(function(){
            if($(this).css('display') !== 'none'){
               saemail.config.editableImages.push($(this));
            }
        });

        $('.right_side td, .right_side tr, .right_side div, .right_side span').each(function(){
            if($(this).css('background-image') !== 'none') {
               saemail.config.editableImages.push($(this));
            }
        });

        $.each(saemail.config.editableImages, function( i, element) {
            element.attr('data-img', 'img-' + i);
        });

    },

    defineRemovableElements: function() {

        $('.main_container > table').each(function(){
            saemail.config.removableElements.push($(this));
        });

    },

    addEditableClass: function() {

        $.each(saemail.config.editableTextNodes, function( i, value ) {
          var editor = new MediumEditor(value, {
                paste: {
                    forcePlainText: true
                },
                toolbar: {
                    allowMultiParagraphSelection: true,
                    buttons: ['bold', 'italic', 'anchor', 'image'],
                }
            });
          saemail.config.mediumElements.push(editor);
        });

    },

    removeEditableClass: function() {

        $.each(saemail.config.editableTextNodes, function( i, element ) {
          element.removeClass('editable').removeAttr( 'contentEditable data-editable spellcheck data-medium-editor-element role aria-multiline medium-editor-index data-placeholder' );
        });

        $.each(saemail.config.mediumElements, function( i, node ) {
            node.destroy();
        });

    },

    addRemovableClass: function() {

        $.each(saemail.config.removableElements, function( i, element ) {
            element.hover(
              function() {
                $('<a class="delete fa fa-trash-o"></a>').prependTo($(this));
              }, function() {
                $('.delete').remove();
              }
            );
        });

    },

    populateImageInputFields: function() {

        $.each(saemail.config.editableImages, function( i, element) {

             var $attr = $(this).data('img');

             if($(this).is('img')) {
                $image = $(this).attr('src');
                $alt = $(this).attr('alt');
            } else {
                $bg = $(this).css('background-image');
                $image = $bg.replace('url(','').replace(')','');
                $alt = null;
            }

            if($image == null) {
                $image = 'http://';
                $alt = null;
            }



            var num = i+1;

            if($alt) {

                $('<label>Image ' + num + ' URL</label><input type="text" class="img-edit" data-edit="'+ $attr +'" value="' + $image + '"><label>Alt Text</label><input type="text" class="img-edit" data-alt="'+ $attr +'" value="' + $alt + '"><hr />').appendTo('.left_menu_images');
            } else {

                $('<label>Background Image ' + num + ' URL</label><input type="text" class="img-edit" data-edit="'+ $attr +'" value="' + $image + '"><hr />').appendTo('.left_menu_images');
            }

        });

    },

    scrollToImage: function() {

        $('.img-edit').each(function(){

            $(this).on('click', function(e){
                e.preventDefault();
                $('[data-img]').each(function(){
                    $(this).removeClass('active');
                });
                var attr = $(this).data('edit');
                var target = $('body').find('[data-img="'+ attr +'"]');
                target.addClass('active');
                $('html, body').animate({
                    scrollTop: $(target).offset().top - 100
                }, 800);
            });

            $(this).keyup(function(){
               var $target = $(this).data('edit');
               var $img = $(this).val();
                $('td').each(function(){
                    if($(this).data('img') == $target) {
                        $(this).css('background-image','url('+$img+')');
                        $(this).attr('background',$img);
                    }
                });
                $('img').each(function(){
                    if($(this).data('img') == $target) {
                        $(this).attr('src',$img);
                    }
                });
            });
        });

    },

    select: function(el) {
        var doc = document;
        var element = el[0];
        var selection = window.getSelection();        
        var range = document.createRange();
        range.selectNodeContents(element);
        selection.removeAllRanges();
        selection.addRange(range);
    },

    exportCode: function() {
        var filteredContents = $('.right_side').html();
        $('<a class="close"><i class="fa fa-times-circle-o"></i></a>').appendTo('body');
        $("<pre />", {
                "html":filteredContents.replace(/[<>]/g, function(m) { return {'<':'&lt;','>':'&gt;'}[m]})
                    .replace(/((ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?)/gi,'<a href="$1">$1</a>') +
                        '\n&lt;/html>',
                "class": "prettyprint"
            }).appendTo(".html-output");

            prettyPrint();
    }

}



$(document).ready(function(){

    saemail.controller.init();

    saemail.controller.defineEditableTextNodes();
    saemail.controller.defineEditableImages();

    saemail.controller.addEditableClass();
    saemail.controller.populateImageInputFields();
    saemail.controller.scrollToImage();

    saemail.controller.defineRemovableElements();
    saemail.controller.addRemovableClass();


    $(document).on('click', '.delete', function(){ 
        $(this).parent().remove();
    });

    $(function() {
      $('.toggle[href^="/' + location.pathname.split("/")[1] + '"]').addClass('active');
    });
    

    $('.html-output pre a').on('click', function(e){
    	e.preventDefault();
    });

    $('.view-source').on('click', function(e){
        e.preventDefault();
        saemail.controller.removeEditableClass();
        saemail.controller.exportCode();

       $('.html-output').addClass('shown');
       $('.site-wrap').addClass('transparent');
    });

    $('.download-source').on('click', function(e){
        e.preventDefault();
        saemail.controller.exportCode();
        var today = new Date();
        var UTC_TIMESTAMP = today.toLocaleString();
        var code = $('.html-output').text();
        download(code, "code-"+ UTC_TIMESTAMP +".txt", "text/plain");
    });

    $(document).mouseup(function (e)
		{

		var flyoutContainer = $(".html-output, .delete");

		if (!flyoutContainer.is(e.target) // if the target of the click isn't the container...
			&& flyoutContainer.has(e.target).length === 0) // ... nor a descendant of the container
		{
			$('.html-output').removeClass('shown').empty();
	       	$('.site-wrap').removeClass('transparent');
	       	$('.close').remove();
            saemail.controller.addEditableClass();
            saemail.controller.defineRemovableElements();
            saemail.controller.addRemovableClass();
		}
	});

    $('.html-output').on('click', function(){
    	saemail.controller.select($(this));
    });

    $('body').removeClass('loading');

});

var saemail = window.saemail || {}

saemail.config = {
    editableTextNodes: [],
    editableLinks: [],
    editableImages: [],
    mediumElements: [],
    removableElements: [],
}

saemail.controller = {

    init: function() {
       $('body').addClass('loading');
    },

    defineEditableTextNodes: function() {

        $('.right_side span, .right_side td, .right_side a').each(function(i){
            if($(this).text().length){
                $(this).addClass('editable' + i);
                saemail.config.editableTextNodes.push( {
                    className: $(this).context.className,
                    nodeName: $(this).context.nodeName
                });
            }
        });
        var collection = JSON.stringify(saemail.config.editableTextNodes);
        localStorage.setItem('editable', collection);

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
            saemail.config.removableElements.push( {
                className: $(this).context.className,
                nodeName: $(this).context.nodeName
            });
        });

        var collection = JSON.stringify(saemail.config.removableElements);
        localStorage.setItem('removable', collection);

    },

    addEditableClass: function() {

        var editable = JSON.parse(localStorage.getItem("editable"));
        $.each(editable, function( i, value ) {
            $('.' + value.className).prop('contentEditable',true);
        });
    },

    editWorkflow: function() {
        var editable = JSON.parse(localStorage.getItem("editable"));
        $.each(editable, function( i, value ) {
            $('.' + value.className).removeClass('editing');
            $('.' + value.className).on('click', function(){
                $(this).addClass('editing');
            });
        });
    },

    removeEditWorkflow: function() {
        var editable = JSON.parse(localStorage.getItem("editable"));
        $.each(editable, function( i, value ) {
            $('.' + value.className).removeClass('editing');
        });
    },

    defineLinks: function() {
        var editable = JSON.parse(localStorage.getItem("editable"));
        $.each(editable, function( i, value ) {
            if(value.nodeName == "A") {
                saemail.config.editableLinks.push($('.' + value.className));
            }
        });

        var links = JSON.stringify(saemail.config.editableLinks);
        localStorage.setItem('links', links);
    },

    removeEditableClass: function() {

        var editable = JSON.parse(localStorage.getItem("editable"));
        $.each(editable, function( i, value ) {
            $('.' + value.className).prop('contentEditable',false);
        });

    },

    addRemovableClass: function() {

        var removable = JSON.parse(localStorage.getItem("removable"));
        $.each(removable, function( i, value ) {
            $('.' + value.className).hover(
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

    editLinks: function() {

        var editable = JSON.parse(localStorage.getItem("links"));
        $.each(editable, function( i, value ) {
            $(value.selector).on('click', function(e){
                e.preventDefault();
                $('.link-editor').remove();
                $(this).addClass('relative');
                var link = $(this).attr('href');
                var text = $(this).text();
                $('body').append('<div class="link-editor">"' + text + '"" link:<br ><input class="edit-link" type="text" value="'+ link + '"><a class="save-link"><i class="fa fa-check"></i></a><a class="delete-link"><i class="fa fa-ban"></i></a></div>');
                
                $('.save-link').on('click', function(e){
                    e.preventDefault();
                    var link = $('.edit-link').val();
                    $(value.selector).attr('href',link);
                    $('.link-editor').addClass('slide-back');
                });

                $('.delete-link').on('click', function(e){
                    e.preventDefault();
                    $('.edit-link').attr('href','http://').val('http://');
                    $(value.selector).attr('href', 'http://');
                })

            });
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


    $.when( saemail.controller.defineEditableTextNodes() ).done(function() {
        saemail.controller.addEditableClass();
        saemail.controller.editWorkflow();
        $.when( saemail.controller.defineLinks() ).done(function(){
            saemail.controller.editLinks();
        });
    });
    saemail.controller.defineEditableImages();

    
    $.when( saemail.controller.populateImageInputFields() ).done(function(){
        saemail.controller.scrollToImage();
        $('body').removeClass('loading');
    });

    
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
        saemail.controller.removeEditWorkflow();
        saemail.controller.removeEditableClass();
        saemail.controller.exportCode();

       $('.html-output').addClass('shown');
       $('.site-wrap').addClass('transparent');
    });

    $('.download-source').on('click', function(e){
        e.preventDefault();
        saemail.controller.removeEditWorkflow();
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
            saemail.controller.removeEditWorkflow();
            saemail.controller.addEditableClass();
            saemail.controller.defineRemovableElements();
            saemail.controller.addRemovableClass();
		}
	});

    $('.html-output').on('click', function(){
    	saemail.controller.select($(this));
    });

    

});

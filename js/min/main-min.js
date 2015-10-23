var saemail = window.saemail || {}

saemail.config = {

    api: {
        postal: "//public.api.gdos.salvationarmy.org/geocode/postal?",
        search: "//public.api.gdos.salvationarmy.org/search?",
        geocode: "https://maps.googleapis.com/maps/api/geocode/json?"
    },
    results: $('.zip-results--container'),
    opaqueItem: $('.js-opacity'),
    trigger: $('.js-trigger'),
    storedResults: localStorage.getItem("zipResults"),
    navbar: $('.navbar'),
    url: '//' + location.host + location.pathname,
    locations: []
}

saemail.controller = {

    init: function(zip) {
       
    },

    defineEditableTextNodes: function() {

        editableTextNodes = [];

        $('.right_side table *').each(function(){
            if($(this).text().length){
                editableTextNodes.push($(this));
            }
        });

    },

    defineEditableImages: function() {

        editableImages = [];

        $('.right_side img').each(function(){
            if($(this).css('display') !== 'none'){
               editableImages.push($(this));
            }
        });

        console.log(editableImages);

    },

    addEditableClass: function() {

        mediumElements = [];

        $.each(editableTextNodes, function( i, value ) {
          var editor = new MediumEditor(value, {
                paste: {
                    forcePlainText: true
                },
                toolbar: {
                    allowMultiParagraphSelection: true,
                    buttons: ['bold', 'italic', 'anchor', 'image'],
                }
            });
          mediumElements.push(editor);
        });

    },

    removeEditableClass: function() {

        $.each(editableTextNodes, function( i, element ) {
          element.removeClass('editable').removeAttr( 'contentEditable data-editable spellcheck data-medium-editor-element role aria-multiline medium-editor-index data-placeholder' );
        });

        $.each(mediumElements, function( i, node ) {
            node.destroy();
        });

    },

    select: function() {
        var doc = document;
        var element = this[0];
        var selection = window.getSelection();        
        var range = document.createRange();
        range.selectNodeContents(element);
        selection.removeAllRanges();
        selection.addRange(range);
    }

}

$(document).ready(function(){


    saemail.controller.defineEditableTextNodes();
    saemail.controller.defineEditableImages();

    saemail.controller.addEditableClass();

    // $('table').hover(
    //   function() {
    //     $('<a class="delete fa fa-trash-o"></a>').prependTo($(this));
    //   }, function() {
    //     $('.delete').remove();
    //   }
    // );

    $(document).on('click', '.delete', function(){ 
        $(this).parent().remove();
    }); 
    

    // $('[data-editable="true"]').on('click', function(e){
    //     e.preventDefault();
    //     $(this).attr('contenteditable', function(index, attr){
    //         return attr == false ? null : true;
    //     });
    // });

    $('.html-output pre a').on('click', function(e){
    	e.preventDefault();
    });

    $('.view-source').on('click', function(e){
        e.preventDefault();
        saemail.controller.removeEditableClass();
        var filteredContents = $('.right_side').html();
        $('<a class="close"><i class="fa fa-times-circle-o"></i></a>').appendTo('body');
        $("<pre />", {
				"html":filteredContents.replace(/[<>]/g, function(m) { return {'<':'&lt;','>':'&gt;'}[m]})
					.replace(/((ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?)/gi,'<a href="$1">$1</a>') +
						'\n&lt;/html>',
				"class": "prettyprint"
			}).appendTo(".html-output");

			prettyPrint();

       $('.html-output').addClass('shown');
       $('.site-wrap').addClass('transparent');
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
		}
	});

    $('.html-output').on('click', function(){
    	//$(this).selectText();
    });

    var i = 1;

    $('[data-img]').each(function(){
    	$attr = $(this).data('img');
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

        if($alt) {

            $('<label>Image ' + i + ' URL</label><input type="text" class="img-edit" data-edit="'+ $attr +'" value="' + $image + '"><label>Alt Text</label><input type="text" class="img-edit" data-alt="'+ $attr +'" value="' + $alt + '"><hr />').appendTo('.left_menu_images');
        } else {

            $('<label>Image ' + i + ' URL</label><input type="text" class="img-edit" data-edit="'+ $attr +'" value="' + $image + '"><hr />').appendTo('.left_menu_images');
        }

        i++;
     	
    	
    });

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


    });



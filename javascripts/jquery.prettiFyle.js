// PrettiFyle jQuery Plugin
(function( $ ){
    "use strict";
    var methods = {
        init : function( options ){
            return this.each(function() {
                var $this   = $(this),
            		parent	= $this.parent(),
                	id		= $this.attr( "id" ),
                    data    = $this.data("slideEverything"),
                    wrap    = $( "<div></div>" ),
                    newIn   = $( "<input type=\"text\" />" ),
                    newBu   = $( "<button type=\"button\"></button>" ),
                    iFrame	= $( "<iframe></iframe>" );

                //set defaults
                if ( !data ){
                    $(this).data("prettiFyle", {
                        "pre" : "PF_",
                        "style" : "prettiFyle",
                        "text" : "Browse...",
                        "ajax" : {
                        	"active" : false,
                        	"action" : undefined,
                        	"callback" : undefined
                        }
                    });
                }

                //extend data with options object
                data = $.extend($this.data("prettiFyle"), options);
                $this.data("prettiFyle", data);

                $this
                    .addClass( data.style + "-original" )
                    .css({
                        "visibility": "hidden",
                        "position": "absolute"
                    })

                // insert the new input wrapper
                wrap.hide();
                $this.after( wrap );
                wrap
                    .append( $this )
                    .append(
                        newIn
                            .prop( "id", data.pre + id )
                            .addClass( data.style + "-input" )
                            .css({
                                "marginRight": ".5em"
                            })
                    )
                    .append(
                        newBu
                            .html( data.text )
                            .addClass( data.style + "-button" )
                    )
                    .addClass( data.style + "-wrapper" );

                if( data.ajax.active ){
	                // Assign the callback ino the global namespace so we can use it from the iframe
                	wrap
                		.append(
                			iFrame
                				.prop( "name", id + "-target-iFrame" )
                				.hide()
                		);
                	$this
                		.closest( "form" )
                			.prop( "target", id + "-target-iFrame" )
                			.prop( "action", data.ajax.action);
                }

                // bind click transferrers
                $( newIn ).add( newBu )
                    .on( "click", function( e ){
                        e.stopPropagation();
                        $this.click();
                        return false;
                    });

                // bind change on the iframe to catch returned data
                parent.on( "change", function( e ){
                	if( $( e.target ).prop( 'id' ) == id + "-target-iFrame" ){
	                	var data = $( e.target ).find( "body" ).text();
	                	console.log( data );
	                	data.ajax.callback( data );
	                }
                })

                $this.change( function(){
                    newIn.val( $this.val() );
                })

                // show the fake clickable
                wrap.show();
            });
        },

        destroy : function(){
            return this.each(function() {
                var $this = $(this),
                data = $this.data("prettiFyle");

                $(window).unbind(".prettiFyle");
                data.prettiFyle.remove();
                $this.removeData("prettiFyle");
            });
        },

        debug : function(){
            return this.each(function() {
                var $this = $(this),
                data = $this.data("prettiFyle");

                console.log(data);
            });
        }
    };

    $.fn.prettiFyle = function( method ) {
        if ( methods[method] ){
            return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        }
        else if ( typeof method === "object" || ! method ){
            return methods.init.apply( this, arguments );
        }
        else{
            $.error( "Method " + method + " does not exist on jQuery.prettiFyle" );
        }
    };
})( jQuery );

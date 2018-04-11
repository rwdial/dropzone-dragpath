let dz_dragpath = {

    dropProperties: {},
    containerSelector: '',
    containerHeight: 150,

    init: function(targetSelector, rowHeight, properties){
        containerSelector = targetSelector;
        if(rowHeight) containerHeight = rowHeight;

        dz_dragpath.createTargets(properties);
        dz_dragpath.initDragActions();
    },

    createTargets: function(properties){
        var numProperties = properties.length;
        var targetWidthPercentage = (1 / numProperties) * 100;

        $(properties).each(function (index, property){

            var left = index * targetWidthPercentage;

            var propertyContainer = $('<div></div>').addClass('dzOverlay')
                                                    .css('left', left + '%')
                                                    .css('width', targetWidthPercentage + '%')
                                                    .css('height', containerHeight + 'px')
                                                    .data('field', property.field)
                                                    .data('property', property.name)
                                                    .data('value', property.value)
                                                    .html($('<span></span>').html(property.field + ' - ' + property.name));

            $(containerSelector).append(propertyContainer);

            if(property.children){
                dz_dragpath.createChildrenTargets(property.children, property.name);
            }
        });
    },

    createChildrenTargets: function(properties, parentProperty){
        var row = 1;
        
        $(properties).each(function (index, property){
            var top = containerHeight * row++;

            var propertyOverlay = $('<div></div>').addClass('dzPropertyOverlay')
            .css('top', top + 'px')
            .css('height', containerHeight + 'px')
            .data('parent-property', parentProperty);

            var numOptions = property.options.length;
            var targetWidthPercentage = (1 / numOptions) * 100;

            var left = index * targetWidthPercentage;                
            
            $(property.options).each(function(propIndex, option){
                var target = $('<div></div>')
                            .addClass('dzPropertyOverlayTarget')
                            .css('left', left + '%')
                            .css('width', targetWidthPercentage + '%')
                            .css('height', containerHeight + 'px')
                            .data('property', property.field)
                            .data('value', option.value)
                            .html($('<span></span>').html(property.field + ' - ' + option.name));

                $(propertyOverlay).append(target);
            });

            $(containerSelector).append(propertyOverlay);
        });
    },

    initDragActions: function() {
        $(containerSelector).on("dragbetterenter", function () {
            $(containerSelector).addClass("dz-active");
        });
        $(containerSelector).on("dragbetterleave", function () {
            $(containerSelector).removeClass("dz-active");
    
            $(".dzOverlay").each(function (index, prop) { $(prop).removeClass("dz-type-active") });
            $(".dzPropertyOverlay").each(function (index, prop) { $(prop).removeClass("dz-property-active") });
            $(".dzPropertyOverlayTarget").each(function (index, prop) { $(prop).removeClass("dz-property-selected") });
        });
    
        $(containerSelector + " .dzOverlay").on("dragbetterenter", function () {
            $(containerSelector + " .dzOverlay").each(function (index, prop) { $(prop).removeClass("dz-type-active") });
            $(containerSelector + " .dzPropertyOverlay").each(function (index, item) { $(item).removeClass("dz-property-active") });
    
            field = $(this).data("field");
            val = $(this).data("value");

            dz_dragpath.dropProperties = {};
            dz_dragpath.dropProperties[field] = val;

            parentProperty = $(this).data("property");

            $(this).addClass("dz-type-active");
            $(containerSelector + " .dzPropertyOverlayTarget").each(function (index, prop) { $(prop).removeClass("dz-property-selected") });
            $(containerSelector + " .dzPropertyOverlay").filterByData('parent-property', parentProperty).addClass("dz-property-active");
        });
        $(containerSelector + " .dzOverlay").on("dragbetterleave", function () {
    
        });
    
        $(containerSelector + " .dzPropertyOverlayTarget").on("dragbetterenter", function () {
            var prop = $(this).data("property");
            var val = $(this).data("value");
            dz_dragpath.dropProperties[prop] = val;
    
            $(containerSelector + " .dzPropertyOverlayTarget").filterByData('property', prop).each(function (index, prop) { $(prop).removeClass("dz-property-selected") });
            $(this).addClass("dz-property-selected");        
        });
        $(containerSelector + " .dzPropertyOverlayTarget").on("dragbetterleave", function () {
            
        });
    }
};

$.fn.filterByData = function(prop, val) {
    return this.filter(
        function() { return $(this).data(prop)==val; }
    );
}
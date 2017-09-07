function addMarker(location, map) {
    // Add the marker at the clicked location, and add the next-available label
    // from the array of alphabetical characters.
    var image = $('.pallete-selected').attr('data-image');
    var label = $('.pallete-selected').attr('data-name');
    var marker = new google.maps.Marker({
        position: location,
        //label: label,
        icon: image,
        map: map
    });
    markersData.push({type: map.getMapTypeId(), position: {lat: location.lat(), lng: location.lng()}, label: label, icon: image, object: marker});
}
$(document).ready(function () {
    $.each(monsters, function (key, value) {
        if (value.image)
        {
            $('#monster-list')
                    .append($("<option></option>")
                            .attr("value", value.name)
                            .text(value.name));
        }
    });
    $(".chosen-select").chosen({disable_search_threshold: 10});
    $('.update-pallete').on('click', function (event) {
        event.preventDefault();
        $('.pallete').html('');
        $("#monster-list option:selected").each(function () {
            var optionVal = $(this).val();
            console.log($(this).val());
            $.each(monsters, function (key, value) {
                if (value.name == optionVal)
                {
                    $('.pallete').append($("<button class=\"pallete-item\" data-name=\"" + value.name + "\"><img src=\"" + 'data/monster_images/' + value.image + "\"></button>"));
                }
            });
        });
        $('.pallete-item').on('click', function (event) {
            $('.pallete-selected').html('');
            $('.pallete-selected').attr('data-name', $(this).attr('data-name'));
            $('.pallete-selected').attr('data-image', $(this).find('img').attr('src'));
            $(this).find('img').clone().appendTo(".pallete-selected");
        });
    });
});
function exportMarkers()
{
    var exportData = [];
    $.each(markersData, function (key, value) {
        exportData.push({type: value.type, position: value.position, label: value.label, icon: value.icon});

    });
    var exportResult = {name: 'test', markers: exportData};
    $('.export-result').val(JSON.stringify(exportResult));
    $('.export-result').removeClass('hidden');
}
function importMarkers()
{
    var importData = JSON.parse($('#import-data').val());
    $.each(markersData, function (key, value) {
        markersData[key].object.setMap(null);

    });
    markersData = [];
    $.each(importData.markers, function (key, value) {
        if (value.type == map.getMapTypeId())
        {
            var marker = new google.maps.Marker({
                position: value.position,
                //label: label,
                icon: value.icon,
                map: map
            });
        } else
        {
            var marker = new google.maps.Marker({
                position: value.position,
                //label: label,
                icon: value.icon,
                map: null
            });
        }
        markersData.push({type: value.type, position: value.position, label: value.label, icon: value.icon, object: marker});
    });
}
// map.getCenter().lat()
// map.getCenter().lng()
// map.setCenter({lat:43.32517767999296, lng:93.1640625});
// map.getZoom()
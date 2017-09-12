var StorageEngine = {
    get: function( $name )
    {
        return JSON.parse( localStorage.getItem( $name ) );
    },
    store: function( $name, $value )
    {
        localStorage.setItem( $name, JSON.stringify( $value ) );
    }
}

var MonsterDB = {
	monsters: new Array(),
	load: function()
	{
		for( var x in monsters )
		{
			if (!monsters[x].image)
			{
				monsters[x].image = '14px-Cross3.jpg';
			}
			monsters[x].image = 'data/monster_images/' + monsters[x].image;
			this.monsters[monsters[x].name] = monsters[x];
		}
	},
	get:function( name ){
		return this.monsters[name];
	},
}

var MapPallete = {
	selected: false,
    pallete: new Array()
}

var MapEditor = {
	addMarker: function (location, map) {
		var marker = new google.maps.Marker( { position: location, icon: MapPallete.selected.image, map: map } );
		markersData.push({
            type: map.getMapTypeId(),
            position: {lat: location.lat(),lng: location.lng()},
            label: MapPallete.selected.name,
            icon: MapPallete.selected.image,
            object: marker
        });
	},
    init: function()
    {
        
    }
}

$(document).ready(function () {
	MonsterDB.load();
    MapEditor.init();
	for( var x in MonsterDB.monsters )
	{
		$('#monster-list')
                    .append($("<option></option>")
                            .attr("value", MonsterDB.monsters[x].name)
                            .text(MonsterDB.monsters[x].name));
	}

    $(".chosen-select").chosen({disable_search_threshold: 10});
    $('.update-pallete').on('click', function (event) {
        event.preventDefault();
        $('.pallete').html('');
        MapPallete.pallete = new Array();
        $("#monster-list option:selected").each(function () {
            var optionVal = $(this).val();
			var monster = MonsterDB.get( optionVal );
			if( typeof monster != 'undefined' )
			{
                MapPallete.pallete.push( monster );
				$('.pallete').append($("<button class=\"pallete-item\" data-name=\"" + monster.name + "\"><img src=\"" + monster.image + "\"></button>"));
			}
        });
        $('.pallete-item').on('click', function (event) {
            MapPallete.selected = MonsterDB.get( $(this).attr('data-name') );
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
    var exportTitle = $('#export-title').val();
    if( exportTitle == '' )
        exportTitle = 'Test';
    var exportResult = {
        name: exportTitle,
        markers: exportData,
        zoom: map.getZoom(),
        center: {lat: map.getCenter().lat(), lng: map.getCenter().lng()},
        type: map.getMapTypeId()
    };
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
    if( typeof importData.type != 'undefined' )
        map.setMapTypeId(importData.type);
    if( typeof importData.center != 'undefined' )
        map.setCenter(importData.center);
    if( typeof importData.zoom != 'undefined' )
        map.setZoom(importData.zoom);
}

var heatmap = null;
function heatMap()
{
    if(heatmap)
        heatmap.setMap(null);
    if( $('#heatmap-toggle').attr('data-active') == 'on' )
    {
        $('#heatmap-toggle').attr('data-active', 'off');
        $('#heatmap-toggle').html('Heatmap is off');
    }
    else
    {
        $('#heatmap-toggle').attr('data-active', 'on');
        $('#heatmap-toggle').html('Heatmap is on');
        var heatMapData = [];
        $.each(markersData, function (key, value) {
            if (value.type == map.getMapTypeId())
                heatMapData.push({location: new google.maps.LatLng(value.position.lat, value.position.lng), weight: 2});
        });
        heatmap = new google.maps.visualization.HeatmapLayer({
          data: heatMapData,
          radius: 35
        });
        heatmap.setMap(map);
    }
}
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

var ImageDB = {
    get: function( name )
    {
        var monster = MonsterDB.get(name);
        if( typeof monster != 'undefined' )
        {
            return monster.image;
        }
        return false;
    }
}

var MapPallete = {
	selected: false,
    pallete: new Array()
}

var MapEditor = {
	addMarker: function (location, map, name, imagePath, mapType) {
        if( typeof name == "undefined")
            name =  MapPallete.selected.name;
        if( typeof imagePath == "undefined")
            imagePath =  MapPallete.selected.image;
        if( typeof mapType == "undefined")
            mapType =  map.getMapTypeId();
        var icon = {
            url: imagePath,
            scaledSize: new google.maps.Size(32, 32), // scaled size
            origin: new google.maps.Point(0,0), // origin
            anchor: new google.maps.Point(16, 16) // anchor
        };
		var marker = new google.maps.Marker( { position: location, icon: icon, map: map } );
        marker.editor_id = new Date().getTime() + '_' + Math.random().toString(36).substr(2, 10);
        marker.monster_name = name;
		markersData.push({
            type: mapType,
            position: {lat: location.lat(),lng: location.lng()},
            label: name,
            icon: imagePath,
            object: marker
        });
        marker.addListener('click', function() {
            var currentMonster = MonsterDB.get(marker.monster_name);
            var contentString = currentMonster.name;
            contentString += "<div>HP: " + currentMonster.hp + "</div>";
            contentString += "<div>XP: " + currentMonster.exp + "</div>";
            contentString += "<div>Death: " + currentMonster.death + "</div>";
            contentString += "<div>Earth: " + currentMonster.earth + "</div>";
            contentString += "<div>Energy: " + currentMonster.energy + "</div>";
            contentString += "<div>Fire: " + currentMonster.fire + "</div>";
            contentString += "<div>Holy: " + currentMonster.holy + "</div>";
            contentString += "<div>Ice: " + currentMonster.ice + "</div>";
            contentString += "<div>Physical: " + currentMonster.physical + "</div>";
            contentString += "<div>Average Loot: " + currentMonster.loot_value + "</div>";
            contentString += "<button onclick=\"removeMarker('" +marker.editor_id + "')\">Remove Marker</button>";
            var infowindow = new google.maps.InfoWindow({
              content: contentString
            });
           infowindow.open(map, marker);
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
    $('.import-link').on('click', function (event) {
        var script = document.createElement('script');
        script.src = $(this).attr('data-file');
        document.body.appendChild(script);
    });
});
function exportMarkers()
{
    var exportData = [];
    $.each(markersData, function (key, value) {
        exportData.push({type: value.type, position: value.position, label: value.label});
    });
    var exportTitle = $('#export-title').val();
    var exportDescription = $('#export-description').val();
    if( exportTitle == '' )
        exportTitle = 'Test';
    var palleteItems = new Array();
    for( var x in MapPallete.pallete )
        palleteItems.push(MapPallete.pallete[x].name);
    var exportResult = {
        name: exportTitle,
        description: exportDescription,
        markers: exportData,
        zoom: map.getZoom(),
        center: {lat: map.getCenter().lat(), lng: map.getCenter().lng()},
        type: map.getMapTypeId(),
        pallete: palleteItems
    };
    $('.export-result').val(JSON.stringify(exportResult));
    $('.export-result').removeClass('hidden');
}
function importMarkers( importData )
{
    if(typeof importData == 'undefined')
        importData = JSON.parse($('#import-data').val());
    $.each(markersData, function (key, value) {
        markersData[key].object.setMap(null);

    });
    markersData = [];
    $.each(importData.markers, function (key, value) {
        if (value.type == map.getMapTypeId())
        {
            MapEditor.addMarker(new google.maps.LatLng(value.position.lat, value.position.lng), map, value.label, ImageDB.get(value.label), value.type);
        } else
        {
            MapEditor.addMarker(new google.maps.LatLng(value.position.lat, value.position.lng), null, value.label, ImageDB.get(value.label), value.type);
        }
    });
    if( typeof importData.type != 'undefined' )
        map.setMapTypeId(importData.type);
    if( typeof importData.center != 'undefined' )
        map.setCenter(importData.center);
    if( typeof importData.zoom != 'undefined' )
        map.setZoom(importData.zoom);
    if( typeof importData.name != 'undefined' )
        $('#hunt-title').html(importData.name);
    if( typeof importData.description != 'undefined' )
        $('#hunt-description').html(importData.description);
    if( typeof importData.pallete != 'undefined' )
    {
        $('#monster-list').val(importData.pallete).trigger('chosen:updated');
        $('.update-pallete').click();
    }
}

function removeMarker( marker_id )
{
    for(var x in markersData)
    {
        if( markersData[x].object.editor_id == marker_id )
        {
            markersData[x].object.setMap(null);
            markersData.splice(x, 1);
        }
    }
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

function huntStats()
{
    var totalVisibleXP = 0;
    var totalVisibleHP = 0;
    var countVisible = 0;
    var totalVisibleLoot = 0;
    var totalXP = 0;
    var totalHP = 0;
    var totalLoot = 0;
    var count = 0;
    for(var x in markersData)
    {
        var monster = MonsterDB.get(markersData[x].label);
        if( typeof monster != 'undefined')
        {
            count++;
            if( monster.exp )
                totalXP += parseInt( monster.exp );
            if( monster.hp )
                totalHP += parseInt( monster.hp );
            if( monster.loot_value )
                totalLoot += parseInt( monster.loot_value );
            if( markersData[x].type == map.getMapTypeId() )
            {
                countVisible++;
                if( monster.exp )
                    totalVisibleXP += parseInt( monster.exp );
                if( monster.hp )
                    totalVisibleHP += parseInt( monster.hp );
                if( monster.loot_value )
                    totalVisibleLoot += parseInt( monster.loot_value );
            }
        }
    }
    var statsContent = '<h4>Visible Monsters Stats</h4>';
    statsContent += '<p>Average XP/HP: ' + ( totalVisibleXP / totalVisibleHP ) + '</p>';
    statsContent += '<p>Average HP: ' + parseInt( totalVisibleHP / countVisible ) + '</p>';
    statsContent += '<p>Average XP: ' + parseInt( totalVisibleXP / countVisible ) + '</p>';
    statsContent += '<p>Average Loot: ' + parseInt( totalVisibleLoot / countVisible ) + '</p>';
    statsContent += '<p>Total XP: ' + parseInt( totalVisibleXP ) + '</p>';
    statsContent += '<p>Total HP: ' + parseInt( totalVisibleHP ) + '</p>';
    statsContent += '<p>Total Loot: ' + ( totalVisibleLoot ) + '</p>';
    statsContent += '<h4>All Monsters Stats</h4>';
    statsContent += '<p>Average XP/HP: ' + ( totalXP / totalHP ) + '</p>';
    statsContent += '<p>Average HP: ' + parseInt( totalHP / count ) + '</p>';
    statsContent += '<p>Average XP: ' + parseInt( totalXP / count ) + '</p>';
    statsContent += '<p>Average Loot: ' + parseInt( totalLoot / count ) + '</p>';
    statsContent += '<p>Total XP: ' + parseInt( totalXP ) + '</p>';
    statsContent += '<p>Total HP: ' + parseInt( totalHP ) + '</p>';
    statsContent += '<p>Total Loot: ' + ( totalLoot ) + '</p>';
    $('#map-modal .modal-body').html( statsContent );
    $('#map-modal').modal('show');
}
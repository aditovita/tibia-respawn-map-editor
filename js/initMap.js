var map = false;
var markersData = [];
function getMapFolder()
{
    if (map.getMapTypeId() == 'Ground')
        return 'floor-07-map';
    else if (map.getMapTypeId() == '+1')
        return 'floor-06-map';
    else if (map.getMapTypeId() == '+2')
        return 'floor-05-map';
    else if (map.getMapTypeId() == '+3')
        return 'floor-04-map';
    else if (map.getMapTypeId() == '+4')
        return 'floor-03-map';
    else if (map.getMapTypeId() == '+5')
        return 'floor-02-map';
    else if (map.getMapTypeId() == '+6')
        return 'floor-01-map';
    else if (map.getMapTypeId() == '+7')
        return 'floor-00-map';
    else if (map.getMapTypeId() == '-1')
        return 'floor-08-map';
    else if (map.getMapTypeId() == '-2')
        return 'floor-09-map';
    else if (map.getMapTypeId() == '-3')
        return 'floor-10-map';
    else if (map.getMapTypeId() == '-4')
        return 'floor-11-map';
    else if (map.getMapTypeId() == '-5')
        return 'floor-12-map';
    else if (map.getMapTypeId() == '-6')
        return 'floor-13-map';
    else if (map.getMapTypeId() == '-7')
        return 'floor-14-map';
    else if (map.getMapTypeId() == '-8')
        return 'floor-15-map';
}
// Normalizes the coords that tiles repeat across the x axis (horizontally)
// like the standard Google map tiles.
function getNormalizedCoord(coord, zoom) {
    var y = coord.y;
    var x = coord.x;

    // tile range in one direction range is dependent on zoom level
    // 0 = 1 tile, 1 = 2 tiles, 2 = 4 tiles, 3 = 8 tiles, etc
    var tileRange = 1 << zoom;

    // don't repeat across y-axis (vertically)
    if (y < 0 || y >= tileRange) {
        return null;
    }

    // repeat across x-axis
    if (x < 0 || x >= tileRange) {
        x = (x % tileRange + tileRange) % tileRange;
    }

    return {x: x, y: y};
}
function getTileURL(coord, zoom) {
    var normalizedCoord = getNormalizedCoord(coord, zoom);
    if (!normalizedCoord) {
        return null;
    }
    var bound = Math.pow(2, zoom);
    $.each(markersData, function (key, value) {
        if (value.type == map.getMapTypeId())
        {
            markersData[key].object.setMap(map);
        } else
        {
            markersData[key].object.setMap(null);
        }
    });
    return 'data/maptiles/' + getMapFolder() + '/' + zoom + '/' + normalizedCoord.x + '/' + (bound - normalizedCoord.y - 1) + '.png';
}
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 0, lng: 0},
        zoom: 3,
        streetViewControl: false,
        mapTypeControlOptions: {
            mapTypeIds: ['-8', '-7', '-6', '-5', '-4', '-3', '-2', '-1', 'Ground', '+1', '+2', '+3', '+4', '+5', '+6', '+7']
        }
    });
    var s8MapType = new google.maps.ImageMapType({
        getTileUrl: getTileURL,
        tileSize: new google.maps.Size(256, 256),
        maxZoom: 6,
        minZoom: 0,
        radius: 1738000,
        name: '-8'
    });
    var s7MapType = new google.maps.ImageMapType({
        getTileUrl: getTileURL,
        tileSize: new google.maps.Size(256, 256),
        maxZoom: 6,
        minZoom: 0,
        radius: 1738000,
        name: '-7'
    });
    var s6MapType = new google.maps.ImageMapType({
        getTileUrl: getTileURL,
        tileSize: new google.maps.Size(256, 256),
        maxZoom: 6,
        minZoom: 0,
        radius: 1738000,
        name: '-6'
    });
    var s5MapType = new google.maps.ImageMapType({
        getTileUrl: getTileURL,
        tileSize: new google.maps.Size(256, 256),
        maxZoom: 6,
        minZoom: 0,
        radius: 1738000,
        name: '-5'
    });
    var s4MapType = new google.maps.ImageMapType({
        getTileUrl: getTileURL,
        tileSize: new google.maps.Size(256, 256),
        maxZoom: 6,
        minZoom: 0,
        radius: 1738000,
        name: '-4'
    });
    var s3MapType = new google.maps.ImageMapType({
        getTileUrl: getTileURL,
        tileSize: new google.maps.Size(256, 256),
        maxZoom: 6,
        minZoom: 0,
        radius: 1738000,
        name: '-3'
    });
    var s2MapType = new google.maps.ImageMapType({
        getTileUrl: getTileURL,
        tileSize: new google.maps.Size(256, 256),
        maxZoom: 6,
        minZoom: 0,
        radius: 1738000,
        name: '-2'
    });
    var s1MapType = new google.maps.ImageMapType({
        getTileUrl: getTileURL,
        tileSize: new google.maps.Size(256, 256),
        maxZoom: 6,
        minZoom: 0,
        radius: 1738000,
        name: '-1'
    });
    var g0MapType = new google.maps.ImageMapType({
        getTileUrl: getTileURL,
        tileSize: new google.maps.Size(256, 256),
        maxZoom: 6,
        minZoom: 0,
        radius: 1738000,
        name: 'Ground'
    });
    var g1MapType = new google.maps.ImageMapType({
        getTileUrl: getTileURL,
        tileSize: new google.maps.Size(256, 256),
        maxZoom: 6,
        minZoom: 0,
        radius: 1738000,
        name: '+1'
    });
    var g2MapType = new google.maps.ImageMapType({
        getTileUrl: getTileURL,
        tileSize: new google.maps.Size(256, 256),
        maxZoom: 6,
        minZoom: 0,
        radius: 1738000,
        name: '+2'
    });
    var g3MapType = new google.maps.ImageMapType({
        getTileUrl: getTileURL,
        tileSize: new google.maps.Size(256, 256),
        maxZoom: 6,
        minZoom: 0,
        radius: 1738000,
        name: '+3'
    });
    var g4MapType = new google.maps.ImageMapType({
        getTileUrl: getTileURL,
        tileSize: new google.maps.Size(256, 256),
        maxZoom: 6,
        minZoom: 0,
        radius: 1738000,
        name: '+4'
    });
    var g5MapType = new google.maps.ImageMapType({
        getTileUrl: getTileURL,
        tileSize: new google.maps.Size(256, 256),
        maxZoom: 6,
        minZoom: 0,
        radius: 1738000,
        name: '+5'
    });
    var g6MapType = new google.maps.ImageMapType({
        getTileUrl: getTileURL,
        tileSize: new google.maps.Size(256, 256),
        maxZoom: 6,
        minZoom: 0,
        radius: 1738000,
        name: '+6'
    });
    var g7MapType = new google.maps.ImageMapType({
        getTileUrl: getTileURL,
        tileSize: new google.maps.Size(256, 256),
        maxZoom: 6,
        minZoom: 0,
        radius: 1738000,
        name: '+7'
    });
    map.mapTypes.set('-8', s8MapType);
    map.mapTypes.set('-7', s7MapType);
    map.mapTypes.set('-6', s6MapType);
    map.mapTypes.set('-5', s5MapType);
    map.mapTypes.set('-4', s4MapType);
    map.mapTypes.set('-3', s3MapType);
    map.mapTypes.set('-2', s2MapType);
    map.mapTypes.set('-1', s1MapType);
    map.mapTypes.set('Ground', g0MapType);
    map.mapTypes.set('+1', g1MapType);
    map.mapTypes.set('+2', g2MapType);
    map.mapTypes.set('+3', g3MapType);
    map.mapTypes.set('+4', g4MapType);
    map.mapTypes.set('+5', g5MapType);
    map.mapTypes.set('+6', g6MapType);
    map.mapTypes.set('+7', g7MapType);
    map.setMapTypeId('Ground');
    google.maps.event.addListener(map, 'click', function (event) {
        if(MapPallete.selected !== false )
            MapEditor.addMarker(event.latLng, map);
    });
}


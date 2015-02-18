var turf = require('turf');
turf.squareGrid = require('turf-square-grid');
turf.triangleGrid = require('turf-triangle-grid');
var fs = require('fs');

var paths = JSON.parse(fs.readFileSync('./hail-paths.geojson'));

console.log('calculating centroids..');
var hail = turf.featurecollection([]);
hail.features = paths.features.map(function(path, k){
    var cent = turf.centroid(path);
    cent.properties.y = path.properties.YR;
    return cent;
})

fs.writeFileSync('./hail.geojson', JSON.stringify(hail, null, 2))

var bbox = [-126,25,-66,50];
var tribin = turf.triangleGrid(bbox, 100, 'miles');
var hexbin = turf.hex(bbox, 1);
var squarebin = turf.squareGrid(bbox, 100, 'miles');

console.log('processing tribin..');
tribin = timeExpand(tribin, hail, 'tribin');
console.log('processing hexbin..');
hexbin = timeExpand(hexbin, hail, 'hexbin');
console.log('processing squarebin..');
squarebin = timeExpand(squarebin, hail, 'squarebin');

console.log('processing pointbin..');
var pointbin = turf.featurecollection([]);
pointbin.features = squarebin.features.map(function(square, k){
    var cent = turf.centroid(square);
    cent.properties = square.properties;
    return cent;
});

console.log('saving grids..');
fs.writeFileSync('./tribin.geojson', JSON.stringify(tribin));
fs.writeFileSync('./hexbin.geojson', JSON.stringify(hexbin));
fs.writeFileSync('./squarebin.geojson', JSON.stringify(squarebin));
fs.writeFileSync('./pointbin.geojson', JSON.stringify(pointbin));

console.log('..complete');

function timeExpand (grid, hail, name) {
    var expanded = turf.featurecollection([]);
    expanded.features = grid.features.map(function(cell,k) {
        var years = [];
        var year = 1955;
        while(year <= 2013){
            cell.properties[year.toString()] = 0;
            year++;
        }

        for(var i = 0; i < hail.features.length; i++) {
            if(turf.inside(hail.features[i], cell)){
                cell.properties[hail.features[i].properties.y]++;
            }
        }
        return cell;
    });
    return expanded;
}
hail-data
---

This repo contains hail analysis data generated from [NOAA](http://www.spc.noaa.gov/gis/svrgis/), using [Turf](turfjs.org) and [node.js](http://nodejs.org/). The processing script generates several grids (hex, triangles, squares, & points), and aggregates hail centroid counts per year. It then classifies the cells for simple visualization.

To reproduce the results:

```sh
npm install
node index.js
```

This will take the raw data (hail-paths.geojson), and write the 4 grids plus the centroids out to geojson files.
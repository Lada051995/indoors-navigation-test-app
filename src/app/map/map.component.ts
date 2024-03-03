import { environment } from '../../environments/environment';
import { Component, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})

export class MapComponent implements OnInit {
  map: mapboxgl.Map | undefined;
  draw: MapboxDraw | undefined;
  style = 'mapbox://styles/mapbox/outdoors-v11';
  lat: number = 30.2672;
  lng: number = -97.7431;

  ngOnInit() {
    this.map = new mapboxgl.Map({
      accessToken: environment.mapbox.accessToken,
      container: 'map',
      style: this.style,
      zoom: 11,
      center: [this.lng, this.lat],
      pitch: 45,
      bearing: -17.6
    });

    this.map.on('load', () => {
      this.draw = new MapboxDraw({
        displayControlsDefault: false,
        controls: {
          point: true,
          polygon: true,
          line_string: true,
          trash: true
        },
        defaultMode: 'draw_polygon'
      });

      this.map!.addControl(this.draw, 'top-left');

      this.map.on('draw.create', (event) => {
        const polygon = event.features[0];
        const extrusionHeight = this.promptExtrusionHeight();
        const extrusionOptions = {
          'fill-extrusion-height': extrusionHeight,
          'fill-extrusion-color': '#f00',
          'fill-extrusion-opacity': 0.6
        };
        this.map!.addLayer({
          'id': polygon.id,
          'type': 'fill-extrusion',
          'source': {
            'type': 'geojson',
            'data': {
              'type': 'Feature',
              'geometry': polygon.geometry,
              'properties': {}
            }
          },
          'paint': extrusionOptions
        });
      });
    });
  }

  promptExtrusionHeight(): number {
    const input = window.prompt('Введите высоту вытягивания в метрах:');
    if (input === null) {
      return 0;
    }
    const height = parseFloat(input);
    return isNaN(height) ? 0 : height;
  }
}

import React, {Component} from 'react';
import MapGL from 'react-map-gl';
import Immutable from 'immutable';

import ScatterplotOverlay from './scatterplot-overlay';
import ChoroplethOverlay from './choropleth-overlay';

import ZIPCODES_SF from './data/feature-example-sf.json';
import CITIES from './data/cities.json';

const MAPBOX_TOKEN = 'pk.eyJ1IjoibXVkaXR5YWRhdiIsImEiOiJjazR5MzlmbXAwNnk1M2xsanRmNDVrZWV5In0.Rg_zHFJc1DKOcE3iROUCIA'; // Set your mapbox token here

const ZIPCODES = Immutable.fromJS(ZIPCODES_SF.features).map(f =>
  f.setIn(['properties', 'value'], Math.random() * 1000)
);

const CITY_LOCATIONS = Immutable.fromJS(CITIES.map(c => [c.longitude, c.latitude]));

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      viewport: {
        latitude: 37.785164,
        longitude: -122.41669,
        zoom: 8,
        bearing: 0,
        pitch: 0,
        width: window.innerWidth,
        height: window.innerHeight
      }
    };
  }

  render() {
    const {viewport} = this.state;

    return (
      <MapGL
        {...viewport}
        mapStyle="mapbox://styles/mapbox/light-v9"
        onViewportChange={v => this.setState({viewport: v})}
        mapboxApiAccessToken={MAPBOX_TOKEN}
      >
        <ChoroplethOverlay
          key="choropleth"
          globalOpacity={0.8}
          colorDomain={[0, 500, 1000]}
          colorRange={['#31a354', '#addd8e', '#f7fcb9']}
          renderWhileDragging={false}
          features={ZIPCODES}
        />

        <ScatterplotOverlay
          key="scatterplot"
          locations={CITY_LOCATIONS}
          dotRadius={10}
          globalOpacity={0.8}
          compositeOperation="lighter"
          dotFill="#00a8fe"
          renderWhileDragging={true}
        />
      </MapGL>
    );
  }
}

export default App;
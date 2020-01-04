import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';

import Immutable from 'immutable';
import {CanvasOverlay} from 'react-map-gl';

function round(x, n) {
  const tenN = Math.pow(10, n);
  return Math.round(x * tenN) / tenN;
}

const propTypes = {
  locations: PropTypes.instanceOf(Immutable.List).isRequired,
  lngLatAccessor: PropTypes.func,
  renderWhileDragging: PropTypes.bool,
  globalOpacity: PropTypes.number,
  dotRadius: PropTypes.number,
  dotFill: PropTypes.string,
  compositeOperation: PropTypes.string
};

const defaultProps = {
  lngLatAccessor: location => [location.get(0), location.get(1)],
  renderWhileDragging: true,
  dotRadius: 4,
  dotFill: '#1FBAD6',
  globalOpacity: 1,
  compositeOperation: 'source-over'
};

export default class ScatterplotOverlay extends PureComponent {
  _redraw = ({width, height, ctx, isDragging, project, unproject}) => {
    const {
      dotRadius,
      dotFill,
      compositeOperation,
      renderWhileDragging,
      locations,
      lngLatAccessor
    } = this.props;

    ctx.clearRect(0, 0, width, height);
    ctx.globalCompositeOperation = compositeOperation;

    if ((renderWhileDragging || !isDragging) && locations) {
      for (const location of locations) {
        const pixel = project(lngLatAccessor(location));
        const pixelRounded = [round(pixel[0], 1), round(pixel[1], 1)];
        if (
          pixelRounded[0] + dotRadius >= 0 &&
          pixelRounded[0] - dotRadius < width &&
          pixelRounded[1] + dotRadius >= 0 &&
          pixelRounded[1] - dotRadius < height
        ) {
          ctx.fillStyle = dotFill;
          ctx.beginPath();
          ctx.arc(pixelRounded[0], pixelRounded[1], dotRadius, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
  };
  /* eslint-enable max-statements */

  render() {
    return <CanvasOverlay redraw={this._redraw} />;
  }
}

ScatterplotOverlay.displayName = 'ScatterplotOverlay';
ScatterplotOverlay.propTypes = propTypes;
ScatterplotOverlay.defaultProps = defaultProps;
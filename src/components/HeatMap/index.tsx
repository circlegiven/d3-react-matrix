import React, { useEffect, useRef } from 'react';
import { select } from 'd3-selection';
import {
  appendRectToSelection,
  appendTextToSelection,
  generateGradationColorScale,
  generateXScale,
  generateYScale,
  RectColor,
} from '../../utils/matrix-util';

type Data = Record<string | number, any>;
type DataKey = string | number;

export interface HeatMapProp {
  data: Data[];
  xAxis: DataKey[];
  yAxis: DataKey[];
  rectColor: RectColor;
  xDimensionKey: DataKey;
  yDimensionKey: DataKey;
  measureKey: DataKey;
}

/**
 *
 * Author: circlegiven
 * Date: 2022-04-27
 */
const HeatMap = ({
  xAxis,
  yAxis,
  data,
  rectColor,
  xDimensionKey,
  yDimensionKey,
  measureKey,
}: HeatMapProp) => {
  /******************************************
   * Constant / State
   * ****************************************/

  const svgRef = useRef<SVGSVGElement>(null);

  /******************************************
   * Global State
   * ****************************************/

  /******************************************
   * Handler
   * ****************************************/

  /******************************************
   * Function
   * ****************************************/

  function isEmptyData(d: any[]) {
    return (d ?? []).length === 0;
  }

  const svgElementOf = (ref: React.RefObject<SVGSVGElement>) => {
    return ref?.current;
  };

  const parentElementOf = (ref: React.RefObject<SVGSVGElement>) => {
    return svgElementOf(ref)?.parentElement;
  };

  const parentElementWidthOf = (ref: React.RefObject<SVGSVGElement>) => {
    return parentElementOf(ref)?.clientWidth;
  };

  const parentElementHeightOf = (ref: React.RefObject<SVGSVGElement>) => {
    return parentElementOf(ref)?.clientHeight;
  };

  /********************************
   * **********
   * Lifecycle
   * ****************************************/

  useEffect(() => {
    if (isEmptyData(data) || isEmptyData(xAxis) || isEmptyData(yAxis)) {
      return;
    }

    const width = parentElementWidthOf(svgRef);
    const height = parentElementHeightOf(svgRef);

    const svg = select(svgElementOf(svgRef));
    svg.attr('viewBox', `0 0 ${width} ${height}`);

    if (width === undefined || height === undefined) {
      return;
    }

    // calculate scale
    const xScale = generateXScale(width, xAxis);
    const yScale = generateYScale(height, yAxis);
    const colorScale = generateGradationColorScale(
      rectColor,
      data.map((d) => d[measureKey]),
    );

    const heatMap = svg.selectAll().data(data).enter().append('g');
    appendRectToSelection({
      selection: heatMap,
      xScale,
      yScale,
      colorScale,
      xDimensionKey,
      yDimensionKey,
      measureKey,
    });
    appendTextToSelection({
      selection: heatMap,
      xScale,
      yScale,
      xDimensionKey,
      yDimensionKey,
      measureKey,
    });
  }, [xDimensionKey, yDimensionKey, measureKey, data, xAxis, yAxis]);

  /******************************************
   * Render
   * ****************************************/
  return (
    <svg
      viewBox={'0 0 100 28'}
      preserveAspectRatio="none"
      ref={svgRef}></svg>
  );
};

export default HeatMap;

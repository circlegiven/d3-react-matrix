import React, { useEffect, useRef } from 'react';
import { select } from 'd3-selection';
import * as d3 from 'd3';
import {
  appendRectToSelection,
  appendTextToSelection,
  generateGradationColorScale,
  generateXScale,
  generateYScale,
  getDataFromCoordinate,
  getDataListFromRects,
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
  fontSize?: number;
  enableBrush?: boolean;
  onClick?: (data: Data | null | undefined) => void;
  onBrushed?: (data: Data | null | undefined) => void;
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
  fontSize,
  enableBrush,
  onClick,
  onBrushed,
}: HeatMapProp) => {
  /******************************************
   * Constant / State
   * ****************************************/

  const svgRef = useRef<SVGSVGElement>(null);
  const mouseCoordinates = useRef<{
    x?: number;
    y?: number;
  }>({});

  /******************************************
   * Global State
   * ****************************************/

  /******************************************
   * Handler
   * ****************************************/

  /******************************************
   * Function
   * ****************************************/

  function updateMouseCoordinates(x: number, y: number) {
    mouseCoordinates.current = {
      x,
      y,
    };
  }

  function getMouseCoordinates() {
    return mouseCoordinates.current;
  }

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

    const heatMap = svg
      .selectAll()
      .data(data)
      .enter()
      .append('g')
      .on('click', (_, d) => {
        if (onClick) {
          onClick(d);
        }
      });
    const rects = appendRectToSelection({
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
      fontSize,
    });

    if (enableBrush) {
      svg.append('g').call(
        d3
          .brush()
          .extent([
            [0, 0],
            [width, height],
          ])
          .on('start', ({ selection }) => {
            const [[x, y]] = selection;
            updateMouseCoordinates(x, y);
          })
          .on('end', ({ selection }) => {
            // click
            if (!selection && onClick) {
              onClick(
                getDataFromCoordinate({
                  selection: rects,
                  x0: getMouseCoordinates().x,
                  y0: getMouseCoordinates().y,
                  xScale,
                  yScale,
                  xDimensionKey,
                  yDimensionKey,
                }),
              );
            }
            if (!selection && onBrushed) {
              onBrushed(null);
            }
            if (selection && onBrushed) {
              const [[x0, y0], [x1, y1]] = selection;
              onBrushed(
                getDataListFromRects({
                  selection: rects,
                  x0,
                  x1,
                  y0,
                  y1,
                  xScale,
                  yScale,
                  xDimensionKey,
                  yDimensionKey,
                }),
              );
            }
          }),
      );
    }
  }, [
    xDimensionKey,
    yDimensionKey,
    measureKey,
    data,
    xAxis,
    yAxis,
    enableBrush,
  ]);

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

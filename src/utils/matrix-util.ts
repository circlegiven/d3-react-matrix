import { scaleBand, scaleLinear, ScaleBand, ScaleLinear } from 'd3-scale';
import { max, mean, min } from 'd3-array';
import { Selection } from 'd3-selection';

export type RectColor = {
  lowColor: string;
  midColor: string;
  highColor: string;
};
type DataKey = string | number;
type Data = Record<DataKey, any>;
type D3Selection<T> = Selection<SVGGElement, T, SVGSVGElement | null, unknown>;

export const generateXScale = (width: number, domains: any[]) => {
  return scaleBand().range([0, width]).domain(domains);
};

export const generateYScale = (height: number, domains: any[]) => {
  return scaleBand().range([height, 0]).domain(domains);
};

export function generateGradationColorScale(
  rectColor: RectColor,
  values: number[],
) {
  return scaleLinear<string>()
    .domain(extentValues(values))
    .range([rectColor.lowColor, rectColor.midColor, rectColor.highColor]);
}

interface MatrixSelection {
  selection: D3Selection<Data>;
  xScale: ScaleBand<any>;
  yScale: ScaleBand<any>;
  colorScale: ScaleLinear<string, string>;
  xDimensionKey: DataKey;
  yDimensionKey: DataKey;
  measureKey: DataKey;
}

interface MatrixTextSelection extends Omit<MatrixSelection, 'colorScale'> {
  fontSize?: number;
}

interface MatrixCoordinateSelection
  extends Omit<MatrixSelection, 'selection' | 'colorScale' | 'measureKey'> {
  selection: Selection<SVGRectElement, Data, SVGSVGElement | null, unknown>;
  x0?: number;
  x1?: number;
  y0?: number;
  y1?: number;
}

export const appendRectToSelection = ({
  selection,
  xScale,
  yScale,
  colorScale,
  xDimensionKey,
  yDimensionKey,
  measureKey,
}: MatrixSelection) =>
  selection
    .append('rect')
    .attr('x', (d) => xScale(d[xDimensionKey]) as number)
    .attr('y', (d) => yScale(d[yDimensionKey]) as number)
    .attr('width', xScale.bandwidth())
    .attr('height', yScale.bandwidth())
    .style('fill', (d) => colorScale(d[measureKey]));

export const appendTextToSelection = ({
  selection,
  xScale,
  yScale,
  xDimensionKey,
  yDimensionKey,
  measureKey,
  fontSize = 10,
}: MatrixTextSelection) =>
  selection
    .append('text')
    .attr('x', (d) => (xScale(d[xDimensionKey]) ?? 0) + xScale.bandwidth() / 2)
    .attr('y', (d) => (yScale(d[yDimensionKey]) ?? 0) + yScale.bandwidth() / 2)
    .attr('font-size', fontSize)
    .attr('text-anchor', 'middle')
    .attr('dominant-baseline', 'middle')
    .text((d) => d[measureKey]);

export const getDataFromCoordinate = ({
  selection,
  x0,
  y0,
  xScale,
  yScale,
  xDimensionKey,
  yDimensionKey,
}: Omit<MatrixCoordinateSelection, 'x1' | 'y1'>) => {
  if (x0 === undefined || y0 === undefined) {
    return null;
  }
  const [data] = selection
    .filter((d: Data) => {
      const dataX0 = xScale(d[xDimensionKey]) as number;
      const dataX1 = dataX0 + xScale.bandwidth();
      const dataY0 = yScale(d[yDimensionKey]) as number;
      const dataY1 = dataY0 + yScale.bandwidth();
      return x0 >= dataX0 && x0 <= dataX1 && y0 >= dataY0 && y0 <= dataY1;
    })
    .data();
  return data;
};

export const getDataListFromRects = ({
  selection,
  x0,
  x1,
  y0,
  y1,
  xScale,
  yScale,
  xDimensionKey,
  yDimensionKey,
}: MatrixCoordinateSelection) => {
  if (
    x0 === undefined ||
    y0 === undefined ||
    x1 === undefined ||
    y1 === undefined
  ) {
    return null;
  }
  return selection
    .filter((d: Data) => {
      const dataX0 = xScale(d[xDimensionKey]) as number;
      const dataX1 = dataX0 + xScale.bandwidth();
      const dataY0 = yScale(d[yDimensionKey]) as number;
      const dataY1 = dataY0 + yScale.bandwidth();
      const centerX = (dataX0 + dataX1) / 2;
      const centerY = (dataY0 + dataY1) / 2;
      return x0 <= centerX && x1 >= centerX && y0 <= centerY && y1 >= centerY;
    })
    .data();
};

function extentValues(values: number[]) {
  const minValue = min(values);
  const meanValue = mean(values);
  const maxValue = max(values);

  const result = new Array<number>();

  if (minValue !== undefined) {
    result.push(minValue);
  }

  if (meanValue !== undefined) {
    result.push(meanValue);
  }

  if (maxValue !== undefined) {
    result.push(maxValue);
  }

  return result;
}

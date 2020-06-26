import * as React from 'react'
import Cell from './Cell'
import Row from './Row'
import XLabels from './XLabels'
import Column from './Column'
import YLabels from './YLabels'
import YLabelAligner from './YLabelAligner'

interface Props {
  xLabels: string[]
  yLabels: string[]
  data: number[][]
  cellHeight?: string
  square?: boolean
  xLabelsPos?: 'top' | 'bottom'
  yLabelsPos?: 'left' | 'right'
  xLabelsStyle?: (index: number) => {}
  yLabelsStyle?: (index: number) => {}
  cellStyle?: (x: number, y: number, ratio: number) => {}
  cellRender?: (x: number, y: number, ratio: number) => {}
}

interface ClientHeight {
  clientHeight: number
}

function getMinMax(data: number[][]): [number, number] {
  const flatArray = data.reduce((i, o) => [...o, ...i], [])
  const max = Math.max(...flatArray)
  const min = Math.min(...flatArray)
  return [min, max]
}

export const HeatMapGrid = ({
  data,
  xLabels,
  yLabels,
  xLabelsPos = 'top',
  yLabelsPos = 'left',
  square = false,
  cellHeight = '2px',
  xLabelsStyle,
  yLabelsStyle,
  cellStyle,
  cellRender
}: Props) => {
  const [xLabelHeight, setXLabelHeight] = React.useState<number>(22)
  const xLabelRef = React.useRef(null)
  const [min, max] = getMinMax(data)
  const minMaxDiff = max - min
  const isXLabelReverse = xLabelsPos === 'bottom'
  const isYLabelReverse = yLabelsPos === 'right'

  console.log(minMaxDiff)

  // TODO: move to custom hook
  React.useEffect(() => {
    if (xLabelRef.current) {
      const height = ((xLabelRef.current || {}) as ClientHeight).clientHeight
      setXLabelHeight(height)
    }
  })

  return (
    <Row reverse={isYLabelReverse}>
      <YLabelAligner
        xLabelHeight={xLabelHeight}
        isXLabelReverse={isXLabelReverse}
      >
        <YLabels
          reverse={isYLabelReverse}
          labels={yLabels}
          height={cellHeight}
          yLabelsStyle={yLabelsStyle}
        />
      </YLabelAligner>
      <Column reverse={isXLabelReverse}>
        <div ref={xLabelRef}>
          <XLabels
            labels={xLabels}
            xLabelsStyle={xLabelsStyle}
            height={cellHeight}
            square={square}
          />
        </div>
        <Column>
          {data.map((rowItems, xi) => (
            <Row key={xi}>
              {rowItems.map((value, yi) => (
                <Cell
                  key={`${xi}-${yi}`}
                  posX={xi}
                  posY={yi}
                  value={value}
                  height={cellHeight}
                  square={square}
                  render={cellRender}
                  style={cellStyle}
                  ratio={(value - min) / minMaxDiff}
                />
              ))}
            </Row>
          ))}
        </Column>
      </Column>
    </Row>
  )
}
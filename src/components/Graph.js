import { getBarHSL } from '../helpers.js';

export default function Graph(props) {
  const bars = props.values.map(el => {
    const barStyle = {
      backgroundColor: getBarHSL(el.hue),
      height: `${el[props.graphProperty] / props.maxValue * 100}%`
    }
    const barClass = el.id === props.highlight ? 'highlight-bar' : ''
    return (
      <div 
        style={barStyle} 
        key={el.id}
        providerid={el.id}
        className={barClass}
        onPointerOver={(e) => props.onBarOver(el.id)}
        onPointerLeave={(e) => props.onBarOver(null)}
      ></div>
    )
  })
  return(
    <div className="pane">
      <h2>{props.header}</h2>
      <div className="pane-contents graph">
        {bars}
      </div>
    </div>
  )
}

import { getBarHSL, toggleDetails } from '../helpers.js';

export default function ProviderItem(props) {
  let itemClass = 'item '
  if (props.id === props.highlight) {
    itemClass += 'highlight-item'
  }
  let priceBadge = props.bestPrice ? <div>#1 price</div> : null
  let clusterBadge = props.bestClusters ? <div>#1 clusters</div> : null
  let memoryBadge = props.bestMemory ? <div>#1 memory</div> : null
  return (
    <div 
      className={itemClass}
      onPointerOver={(e) => props.onItemOver(props.id)}
      onPointerLeave={(e) => props.onItemOver(null)}
    >
      <div className="item-header">
        <div>{props.name}</div>
        <div className="badges">
          {priceBadge}
          {clusterBadge}
          {memoryBadge}
          <div className="round" style={{backgroundColor: getBarHSL(props.hue)}}/>
        </div>
      </div>
      <div className="item-info">
        <div>
          <strong>${props.price.toString()}</strong>
          <br/>
          <span>per month</span>
        </div>
        <div>
          <strong>{props.clusters.toString()}</strong>
          <br/>
          <span>clusters</span>
        </div>
        <div>
          <strong>{props.memory.toString()}</strong>
          <br/>
          <span>MB/cluster</span>
        </div>
      </div>
      <div className="item-details hidden transparent" id={`${props.id}-details`}>
        {props.info}
      </div>
      <div className="item-buttons">
        {/* using external onClick function cause I really want to keep it stateless */}
        <button 
          className="expand" 
          type="button" 
          onClick={() => toggleDetails(props.id)}
        >
          <span id={`${props.id}-button-more`}>See more</span>
          <span id={`${props.id}-button-less`} className="hidden">Hide details</span>
        </button>
        <button className="contact">
          Contact provider
        </button>
      </div>
    </div>
  )
}
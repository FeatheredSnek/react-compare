import ProviderItem from './ProviderItem.js';

export default function ProvidersList(props) {
  const currentProviders = props.providers
  const providerItems = currentProviders.map((provider) => {
    let bestPrice = false
    let bestClusters = false
    let bestMemory = false
    if (provider.id === props.bestPriceId) bestPrice = true
    if (provider.id === props.bestClustersId) bestClusters = true
    if (provider.id === props.bestMemoryId) bestMemory = true
    return (
      <ProviderItem 
        key={provider.id}
        id={provider.id}
        name={provider.name}
        price={provider.price}
        clusters={provider.clusters}
        memory={provider.memory}
        info={provider.info}
        hue={provider.hue}
        onItemOver={props.hoverHandler}
        highlight={props.highlight}
        bestPrice={bestPrice}
        bestClusters={bestClusters}
        bestMemory={bestMemory}
      />
    )
  })
  if (providerItems.length > 0) {
    return (
      <div className="list">
        {providerItems}
      </div>
    )
  }
  else {
    return(
      <div>
        <h3>
          No matches found, try changing filter criteria
        </h3>
      </div>
    )
  }
}

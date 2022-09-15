import providersData from "/data.js";


function getMinMax(providersList, propName) {
  let items = providersList.map(item => {
    return {
      id: item.id,
      value: item[propName]
    }
  })
  items.sort((a, b) => a.value - b.value)
  return {
    min: items[0].value,
    max: items[items.length-1].value,
    minId: items[0].id,
    maxId: items[items.length-1].id,
  }
  // returns minId and maxId rather randomly when there are 
  // two items with the same value, a real world implementation 
  // would surely need some additional logic for granting 'best of' badges
}


function sortByObjectProperty(objectsArray, propName) {
  return objectsArray.sort((objectA, objectB) => {
    let a = objectA[propName]
    let b = objectB[propName]
    if (isNaN(a) || isNaN(b)) {
      if (a < b) return -1
      if (a > b) return 1
      return 0
    }
    else {
      return a - b
    }
  })
}


function sortItemsBy(arr, propName) {
  if (propName == 'price') {
    return sortByObjectProperty(arr, propName)
  }
  else if (propName == 'clusters' || propName == 'memory') {
    return sortByObjectProperty(arr, propName).reverse()
  }
  else {
    return arr
  }
}


function addColors(objectsArray, totalShift, baseHue) {
  const hues = []
  const shift = totalShift / objectsArray.length
  for (let i = 0; i < objectsArray.length; i++) {
    hues.push(Math.floor(shift * i) + baseHue)
  }
  // shuffle hues a bit so the graphs look better for the initial presentation
  // also laughing at dudes using Fisher-Yates to display 4 out of 10 dog pictures
  hues.sort(() => 0.5 - Math.random())
  objectsArray.forEach(element => {
    element.hue = hues[objectsArray.indexOf(element)]
  })
}


// quickly set base saturation and lightness for graph bars
function getBarHSL(hue) {
  const s = 0.5
  const l = 0.7
  return `hsl(${hue}, ${s*100}%, ${l*100}%)`
}


// item details toggler
function toggleDetails(providerId) {
  const toggled = document.getElementById(`${providerId}-details`)
  const buttonTextMore = document.getElementById(`${providerId}-button-more`)
  const buttonTextLess = document.getElementById(`${providerId}-button-less`)
  toggled.classList.toggle('hidden')
  buttonTextMore.classList.toggle('hidden')
  buttonTextLess.classList.toggle('hidden')
}


class App extends React.Component {
  constructor(props){
    super(props);
    // load mock
    const data = providersData
    // the data has already been preloaded so I can set the values here 
    // if it's not the case then compute min/max vals in componentDidMount 
    const priceMinMax = getMinMax(data, 'price')
    const clustersMinMax = getMinMax(data, 'clusters')
    const memoryMinMax = getMinMax(data, 'memory')
    this.minPrice = Math.ceil(priceMinMax.min)
    this.maxPrice = Math.floor(priceMinMax.max)
    this.minClusters = clustersMinMax.min
    this.maxClusters = clustersMinMax.max
    this.maxMemory = memoryMinMax.max
    // see the comment @ getMinMax about multiple best cases
    this.bestPriceId = priceMinMax.minId
    this.bestClustersId = clustersMinMax.maxId
    this.bestMemoryId = memoryMinMax.maxId
    addColors(data, 90, 155)
    this.state = {
      providers: data,
      displayedProviders: data,
      priceFilterValue: null,
      clustersFilterValue: null,
      sorting: 'name',
      highlightedProviderId: null,
    }
  }

  handleHighlightChange = (id) => {
    if (id === null) {
      this.setState({highlightedProviderId: null})
    }
    else {
      this.setState({highlightedProviderId: id})
    }
  }

  handleFilterPriceChange = (userMaxPrice) => {
    this.setState({
      priceFilterValue: userMaxPrice,
      displayedProviders: this.filterProviderList(userMaxPrice, this.state.clustersFilterValue)
    })
  }

  handleFilterClustersChange = (userClusters) => {
    this.setState({
      clustersFilterValue: userClusters,
      displayedProviders: this.filterProviderList(this.state.priceFilterValue, userClusters)
    })
  }

  handleSortingChange = (userSorting) => {
    this.setState({
      sorting: userSorting,
      displayedProviders: this.sortProviderList(userSorting)
    })
  }

  handleFilterReset = () => {
    this.setState({
      priceFilterValue: null,
      clustersFilterValue: null,
      displayedProviders: this.filterProviderList(null, null)
    })
  }

  filterProviderList = (priceFilterValue, clustersFilterValue) => {
    let providerList = this.state.providers
    if (!(isNaN(priceFilterValue) || priceFilterValue === null)) {
      providerList = this.state.providers.filter(
        el => el.price <= priceFilterValue
      )
    }
    if (!(isNaN(clustersFilterValue) || clustersFilterValue === null)) {
      providerList = providerList.filter(
        el => el.clusters >= clustersFilterValue
      )
    }
    providerList = sortItemsBy(providerList, this.state.sorting)
    return providerList
  }

  sortProviderList = (sorting) => {
    return sortItemsBy(this.state.displayedProviders, sorting)
  }

  render() {
    return (
      <div className="app">
        <div className="options">
          <Filters 
            minPrice={this.minPrice} 
            maxPrice={this.maxPrice}
            minClusters={this.minClusters}
            maxClusters={this.maxClusters}
            onFilterPriceChange={this.handleFilterPriceChange}
            onFilterClustersChange={this.handleFilterClustersChange}
            onFilterReset={this.handleFilterReset}
          />
          <Sorting 
            onSortingChange={this.handleSortingChange}
          />
        </div>
        <div className="graphs">
          <Graph
            header="Cost per month"
            graphProperty="price"
            maxValue={this.maxPrice}
            values={this.state.displayedProviders}
            onBarOver={this.handleHighlightChange}
            highlight={this.state.highlightedProviderId}
          />
          <Graph
            header="Available clusters"
            graphProperty="clusters"
            maxValue={this.maxClusters}
            values={this.state.displayedProviders}
            onBarOver={this.handleHighlightChange}
            highlight={this.state.highlightedProviderId}
          />
          <Graph
            header="Memory per cluster"
            graphProperty="memory"
            maxValue={this.maxMemory}
            values={this.state.displayedProviders}
            onBarOver={this.handleHighlightChange}
            highlight={this.state.highlightedProviderId}
          />
        </div>
        <ProvidersList 
          providers={this.state.displayedProviders} 
          sorting={this.state.sorting}
          bestPriceId={this.bestPriceId}
          bestClustersId={this.bestClustersId}
          bestMemoryId={this.bestMemoryId}
          hoverHandler={this.handleHighlightChange}
          highlight={this.state.highlightedProviderId}
        />
      </div>
    )
  }
}


function ProvidersList(props) {
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


function ProviderItem(props) {
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
      <div className="item-details hidden" id={`${props.id}-details`}>
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


// TODO separate filters wrapper and single filter control components
class Filters extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      currentPriceFilterValue: props.maxPrice,
      currentClustersFilterValue: props.minClusters,
      priceFilterActive: false,
      clustersFilterActive: false
    }
  }

  handlePriceChange = (e) => {
    let isActive = e.target.value != this.props.maxPrice ? true : false
    this.setState({
      currentPriceFilterValue: e.target.value,
      priceFilterActive: isActive
    })
    this.props.onFilterPriceChange(e.target.value)
  }

  handleClustersChange = (e) => {
    let isActive = e.target.value != this.props.minClusters ? true : false
    this.setState({
      currentClustersFilterValue: e.target.value,
      clustersFilterActive: isActive
    })
    this.props.onFilterClustersChange(e.target.value)
  }

  handleResetClick = () => {
    this.setState({
      currentPriceFilterValue: this.props.maxPrice,
      currentClustersFilterValue: this.props.minClusters,
      priceFilterActive: false,
      clustersFilterActive: false
    })
    this.props.onFilterReset()
  }

  clearButton = () => {
    if (this.state.priceFilterActive || this.state.clustersFilterActive) {
      return (
        <button id="clear" type="button" onClick={this.handleResetClick}>
          Clear
        </button>
      )
    }
    else {
      return null
    }
  }

  render() {
    return (
      <div className="pane">
        {/*TODO collapsable panes?*/}
        <h2>
          <span>Filters</span>
          {this.clearButton()}
        </h2>
        <fieldset className="pane-contents filter-settings">
          <div className="setting">
            <input 
              id="price-range" 
              type="range"
              step="1"
              min={this.props.minPrice} 
              max={this.props.maxPrice}
              value={this.state.currentPriceFilterValue}
              onChange={this.handlePriceChange}
            />
            <div className="filter-setting-label">
              <label htmlFor="price-range">
                Cost per month 
              </label>
              <label htmlFor="price-range">
                max <strong>${this.state.currentPriceFilterValue}</strong>
              </label>
            </div>
          </div>
          <div className="setting">
            <input 
              id="cluster-range" 
              type="range"
              step="1"
              min={this.props.minClusters} 
              max={this.props.maxClusters}
              value={this.state.currentClustersFilterValue}
              onChange={this.handleClustersChange}
            />
            <div className="filter-setting-label">
              <label htmlFor="cluster-range">
                Available clusters 
              </label>
              <label htmlFor="cluster-range">
                min <strong>{this.state.currentClustersFilterValue}</strong>
              </label>
            </div>
          </div>
        </fieldset>
      </div>
    )
  }
}


class Sorting extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      sorting: 'name'
    }
  }

  handleSelectionChange = (e) => {
    this.setState({sorting: e.target.id})
    this.props.onSortingChange(e.target.id)
  }

  render() {
    return (
      <div className="pane">
        <h2>Sort by:</h2>
        <fieldset className="pane-contents sorting-options">
          <div>
            <input 
              type="radio" 
              id="name" 
              name="sorting" 
              onChange={this.handleSelectionChange}
              defaultChecked
            />
            <label htmlFor="name">Provider name</label>
          </div>
          <div>
            <input 
              type="radio" 
              id="price" 
              name="sorting" 
              onChange={this.handleSelectionChange}
            />
            <label htmlFor="price">Price per month</label>
          </div>
          <div>
            <input 
              type="radio" 
              id="clusters" 
              name="sorting" 
              onChange={this.handleSelectionChange}
            />
            <label htmlFor="clusters">Available clusters</label>
          </div>
          <div>
            <input 
              type="radio" 
              id="memory" 
              name="sorting" 
              onChange={this.handleSelectionChange}
            />
            <label htmlFor="memory">Memory per cluster</label>
          </div>
        </fieldset>
      </div>
    )
  }
}


function Graph(props) {
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


const appRoot = ReactDOM.createRoot(document.getElementById('root'));
appRoot.render(<App/>);

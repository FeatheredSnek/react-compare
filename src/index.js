import providersData from "/data.js";


function getValueBounds(providersList, propName) {
  let values = providersList.map(item => item[propName])
  values.sort((a, b) => a - b)
  return {
    min: values[0],
    max: values[values.length-1]
  }
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
    this.minPrice = Math.ceil(getValueBounds(data, 'price').min)
    this.maxPrice = Math.floor(getValueBounds(data, 'price').max)
    this.minClusters = getValueBounds(data, 'clusters').min
    this.maxClusters = getValueBounds(data, 'clusters').max
    this.maxMemory = getValueBounds(data, 'memory').max
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
    providerList = sortByObjectProperty(providerList, this.state.sorting)
    return providerList
  }

  sortProviderList = (sorting) => {
    return sortByObjectProperty(this.state.displayedProviders, sorting)
  }

  computeMinPrice = () => {
    return Math.floor(getValueBounds(this.state.providers, 'price').min)
  }

  computeMaxPrice = () => {
    return Math.ceil(getValueBounds(this.state.providers, 'price').max)
  }

  computeMinClusters = () => {
    return getValueBounds(this.state.providers, 'clusters').min
  }

  computeMaxClusters = () => {
    return getValueBounds(this.state.providers, 'clusters').max
  }

  computeMaxMemory = () => {
    return getValueBounds(this.state.providers, 'memory').max
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
          hoverHandler={this.handleHighlightChange}
          highlight={this.state.highlightedProviderId}
        />
      </div>
    )
  }
}


function ProvidersList(props) {
  const currentProviders = props.providers
  const providerItems = currentProviders.map((provider) => 
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
    />
  )
  if (providerItems.length > 0) {
    return (
      <div className="list">
        {providerItems}
      </div>
    )
  }
  else {
    // TODO style error message?
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
  return (
    <div 
      className={itemClass}
      onPointerOver={(e) => props.onItemOver(props.id)}
      onPointerLeave={(e) => props.onItemOver(null)}
    >
      <div className="item-header">
        <div>{props.name}</div>
        <div className="badges">
          <div>{/* TODO best price/clusters/memory badges */}</div>
          <div style={{backgroundColor: getBarHSL(props.hue)}}/>
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
      <div class="item-details hidden" id={`${props.id}-details`}>
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
          <span id={`${props.id}-button-less`} class="hidden">Hide details</span>
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
      currentPriceFilterValue: null,
      currentClustersFilterValue: null
    }
  }

  handlePriceChange = (e) => {
    this.setState({currentPriceFilterValue: e.target.value})
    this.props.onFilterPriceChange(e.target.value)
  }

  handleClustersChange = (e) => {
    this.setState({currentClustersFilterValue: e.target.value})
    this.props.onFilterClustersChange(e.target.value)
  }

  handleResetClick = () => {
    this.setState({
      currentPriceFilterValue: null,
      currentClustersFilterValue: null
    })
    this.props.onFilterReset()
  }

  render() {
    return (
      <div className="pane">
        <h2>Filters {/*TODO collapsable panes?*/}</h2>
        <fieldset className="pane-contents filter-settings">
          <div className="setting">
            <input 
              id="price-range" 
              type="range"
              step="1"
              min={this.props.minPrice} 
              max={this.props.maxPrice}
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
              onChange={this.handleClustersChange}
            />
            <div className="filter-setting-label">
              <label htmlFor="cluster-range">
                Available clusters 
              </label>
              <label htmlFor="cluster-range">
                {/* TODO initialize at minimum */}
                min <strong>{this.state.currentClustersFilterValue} clusters</strong>
              </label>
            </div>
          </div>
          {/* TODO clear filters button 
            <button id="clear" type="button" onClick={this.handleResetClick}>
            Clear filters
          </button> */}
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

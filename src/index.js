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
  objectsArray.sort((objectA, objectB) => {
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


class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      providers: providersData,
      displayedProviders: providersData,
      priceFilterValue: null,
      clustersFilterValue: null,
      sorting: 'name',
      // the data has already been preloaded, compute min/max values
      // through componentDidMount if it's not the case
      minPrice: Math.ceil(getValueBounds(providersData, 'price').min),
      maxPrice: Math.floor(getValueBounds(providersData, 'price').max),
      minClusters: getValueBounds(providersData, 'clusters').min,
      maxClusters: getValueBounds(providersData, 'clusters').max,
      maxMemory: getValueBounds(providersData, 'memory').max,
    }
  }

  handleFilterPriceChange = (userMaxPrice) => {
    this.setState({priceFilterValue: userMaxPrice})
    this.updateProviderList()
  }

  handleFilterClustersChange = (userClusters) => {
    this.setState({clustersFilterValue: userClusters})
    this.updateProviderList()
  }

  handleSortingChange = (userSorting) => {
    this.setState({sorting: userSorting})
    this.updateProviderList()
  }

  handleFilterReset = () => {
    this.setState({
      priceFilterValue: null,
      clustersFilterValue: null
    })
    this.updateProviderList()
  }

  // this helper is a separate setState call that is always fired 
  // after a certain state filter/sort setting has been applied
  updateProviderList = () => {
    this.setState({displayedProviders: this.computeProviders()})
  }
  
  computeProviders = () => {
    let filtered
    if (!(isNaN(this.state.priceFilterValue) || this.state.priceFilterValue === null)) {
      filtered = this.state.providers.filter(
        el => el.price <= this.state.priceFilterValue
      )
    }
    else {
      filtered = this.state.providers
    }
    if (!(isNaN(this.state.clustersFilterValue) || this.state.clustersFilterValue === null)) {
      filtered = filtered.filter(
        el => el.clusters >= this.state.clustersFilterValue
      )
    }
    sortByObjectProperty(filtered, this.state.sorting)
    return filtered
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
            minPrice={this.state.minPrice} 
            maxPrice={this.state.maxPrice}
            minClusters={this.state.minClusters}
            maxClusters={this.state.maxClusters}
            onFilterPriceChange={this.handleFilterPriceChange}
            onFilterClustersChange={this.handleFilterClustersChange}
            onFilterReset={this.handleFilterReset}
          />
          <Sorting 
            onSortingChange={this.handleSortingChange}
          />
        </div>
        <ProvidersList 
          providers={this.state.displayedProviders} 
          sorting={this.state.sorting}
        />
        <div className="graphs">
          <Graph
            header="Cost per month"
            graphProperty="price"
            maxValue={this.state.maxPrice}
            values={this.state.displayedProviders}
          />
          <Graph
            header="Available clusters"
            graphProperty="clusters"
            maxValue={this.state.maxClusters}
            values={this.state.displayedProviders}
          />
          <Graph
            header="Memory per cluster"
            graphProperty="memory"
            maxValue={this.state.maxMemory}
            values={this.state.displayedProviders}
          />
        </div>
      </div>
    )
  }
}


function ProvidersList(props) {
  const currentProviders = props.providers
  const currentSorting = props.sorting
  // sortByObjectProperty(currentProviders, currentSorting)
  const providerItems = currentProviders.map((provider) => 
    <ProviderItem 
      key={provider.id}
      id={provider.id}
      name={provider.name}
      price={provider.price}
      clusters={provider.clusters}
      memory={provider.memory}
      info={provider.info}
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
  return (
    <div className="item">
      <div className="item-header">
        <div>{props.name}</div>
        <div className="badges">
          <div/>
          <div/>
        </div>
      </div>
      <div className="item-info">
        <div>
          <strong>${props.price.toString()}</strong>
          <br/>
          per month
        </div>
        <div>
          <strong>{props.clusters.toString()}</strong>
          <br/>
          clusters
        </div>
        <div>
          <strong>{props.memory.toString()}</strong>
          <br/>
          MB/cluster
        </div>
      </div>
      <div className="item-buttons">
        <button className="expand">
          See more
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
  //{`(from ${this.props.minPrice} to ${this.props.maxPrice})`}
  render() {
    return (
      <div className="pane">
        <h2>Filters</h2>
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
                min <strong>${this.state.currentClustersFilterValue}</strong>
              </label>
            </div>
          </div>
          {/* <button id="clear" type="button" onClick={this.handleResetClick}>
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
    console.log(e.target.id);
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
      backgroundColor: '#79D9D9',
      height: `${el[props.graphProperty] / props.maxValue * 100}%`
    }
    return (
      <div style={barStyle} key={el.id}></div>
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

// class Graph extends React.Component {
//   constructor(props) {
//     super(props)

//   }
// }

const appRoot = ReactDOM.createRoot(document.getElementById('root'));
appRoot.render(<App/>);

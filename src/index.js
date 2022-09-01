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
      priceFilterValue: null,
      clustersFilterValue: null,
      sorting: 'name'
    }
  }

  handleFilterPriceChange = (userMaxPrice) => {
    this.setState({priceFilterValue: userMaxPrice})
  }

  handleFilterClustersChange = (userClusters) => {
    this.setState({clustersFilterValue: userClusters})
  }

  handleSortingChange = (userSorting) => {
    this.setState({sorting: userSorting})
  }

  handleFilterReset = () => {
    this.setState({
      priceFilterValue: null,
      clustersFilterValue: null
    })
  }
  
  computeProviders = () => {
    let filtered = [...this.state.providers];
    if (!(isNaN(this.state.priceFilterValue) || this.state.priceFilterValue === null)) {
      filtered = filtered.filter(
        el => el.price <= this.state.priceFilterValue
      )
    }
    if (!(isNaN(this.state.clustersFilterValue) || this.state.clustersFilterValue === null)) {
      filtered = filtered.filter(
        el => el.clusters >= this.state.clustersFilterValue
      )
    }
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

  render() {
    return (
      <div class="app">
        <div class="options">
          <Filters 
            minPrice={this.computeMinPrice()} 
            maxPrice={this.computeMaxPrice()}
            minClusters={this.computeMinClusters()}
            maxClusters={this.computeMaxClusters()}
            onFilterPriceChange={this.handleFilterPriceChange}
            onFilterClustersChange={this.handleFilterClustersChange}
            onFilterReset={this.handleFilterReset}
          />
          <Sorting 
            onSortingChange={this.handleSortingChange}
          />
        </div>
        <ProvidersList 
          providers={this.computeProviders()} 
          sorting={this.state.sorting}
        />
        <div class="graphs">
          <Graph
            header="Cost per month"
          />
          <Graph
            header="Available clusters"
          />
          <Graph
            header="Memory per cluster"
          />
        </div>
      </div>
    )
  }
}


function ProvidersList(props) {
  const currentProviders = props.providers
  const currentSorting = props.sorting
  sortByObjectProperty(currentProviders, currentSorting)
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
      <div class="list">
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
    <div class="item">
      <div class="item-header">
        <div>{props.name}</div>
        <div class="badges">
          <div/>
          <div/>
        </div>
      </div>
      <div class="item-info">
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
      <div class="item-buttons">
        <button class="expand">
          See more
        </button>
        <button class="contact">
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
      <div class="pane">
        <h2>Filters</h2>
        <fieldset class="pane-contents filter-settings">
          <div class="setting">
            <input 
              id="price-range" 
              type="range"
              step="1"
              min={this.props.minPrice} 
              max={this.props.maxPrice}
              onChange={this.handlePriceChange}
            />
            <div class="filter-setting-label">
              <label htmlFor="price-range">
                Cost per month 
              </label>
              <label htmlFor="price-range">
                max <strong>${this.state.currentPriceFilterValue}</strong>
              </label>
            </div>
          </div>
          <div class="setting">
            <input 
              id="cluster-range" 
              type="range"
              step="1"
              min={this.props.minClusters} 
              max={this.props.maxClusters}
              onChange={this.handleClustersChange}
            />
            <div class="filter-setting-label">
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
      <div class="pane">
        <h2>Sort by:</h2>
        <fieldset class="pane-contents sorting-options">
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
  return(
    <div class="pane">
      <h2>{props.header}</h2>
      <div class="pane-contents graph">
        <div class="v0"></div>
        <div class="v1"></div>
        <div class="v2"></div>
        <div class="v3"></div>
      </div>
    </div>
  )
}

const appRoot = ReactDOM.createRoot(document.getElementById('root'));
appRoot.render(<App/>);

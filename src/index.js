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
      <div>
        <div>
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
      <div>
        <h3>List sorted by {currentSorting}</h3>
        <div>
          {providerItems}
        </div>
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
    <div>
      <h2>name: {props.name}, id: {props.id}</h2>
      <h3>Cost per month: {props.price.toString()}</h3>
      <h3>Available clusters: {props.clusters.toString()}</h3>
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
      <fieldset>
        <legend>Filters:</legend>
        <div>
          <input 
            id="price-range" 
            type="range"
            step="1"
            min={this.props.minPrice} 
            max={this.props.maxPrice}
            onChange={this.handlePriceChange}
          />
          <strong>
            {this.state.currentPriceFilterValue}
          </strong>
          <label htmlFor="price-range">
            Max price {`(from ${this.props.minPrice} to ${this.props.maxPrice})`}
          </label>
        </div>
        <div>
          <input 
            id="cluster-range" 
            type="range"
            step="1"
            min={this.props.minClusters} 
            max={this.props.maxClusters}
            onChange={this.handleClustersChange}
          />
          <label htmlFor="cluster-range">
            <strong>
              {this.state.currentClustersFilterValue}
            </strong>
            Clusters {`(from ${this.props.minClusters} to ${this.props.maxClusters})`}
          </label>
        </div>
        <button id="clear" type="button" onClick={this.handleResetClick}>
          Clear filters
        </button>
      </fieldset>
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
      <fieldset>
        <legend>Sort by:</legend>
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
    )
  }
}

const appRoot = ReactDOM.createRoot(document.getElementById('app'));
appRoot.render(<App/>);

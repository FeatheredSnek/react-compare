import Filters from './Filters.js';
import Sorting from './Sorting.js';
import Graph from './Graph.js';
import ProvidersList from './ProvidersList.js';
import { getMinMax, addColors, sortItemsBy } from '../helpers.js'

import providersData from '../data.js';

class App extends React.Component {
  constructor(props){
    super(props);
    // load mock
    const data = sortItemsBy(providersData, 'name')
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

export default App
import { togglePane } from '../helpers.js';


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
        <h2 onClick={() => togglePane('filter')}>
          <span>Filters</span>
          {this.clearButton()}
        </h2>
        <fieldset id="filter" className="pane-contents filter-settings">
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

export default Filters
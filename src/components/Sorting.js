import { togglePane } from '../helpers.js';


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
        <h2 onClick={() => togglePane('sorting')}>Sort by:</h2>
        <fieldset id="sorting" className="pane-contents sorting-options">
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

export default Sorting
import {Component} from 'react'
import Loader from 'react-loader-spinner'
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'
import Projects from './components/Projects'

import './App.css'

// This is the list (static data) used in the application. You can move it to any component if needed.

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

// Replace your code here
const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class App extends Component {
  state = {
    projectsList: [],
    apiStatus: apiStatusConstants.initial,
    activeOption: categoriesList[0].id,
  }

  componentDidMount() {
    this.getProjects()
  }

  onChangeSelectOption = event => {
    this.setState(
      {
        activeOption: event.target.value,
      },
      this.getProjects,
    )
  }

  getProjects = async () => {
    const {activeOption} = this.state
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })
    const url = `https://apis.ccbp.in/ps/projects?category=${activeOption}`
    const options = {
      method: 'GET',
    }
    const response = await fetch(url, options)
    if (response.ok === true) {
      const projectsData = await response.json()
      const updatedData = projectsData.projects.map(eachProject => ({
        id: eachProject.id,
        name: eachProject.name,
        imageUrl: eachProject.image_url,
      }))
      this.setState({
        projectsList: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  loadingView = () => (
    <div data-testid="loader" className="loader">
      <Loader type="ThreeDots" color="#00BFFF" height={50} width={50} />
    </div>
  )

  successView = () => {
    const {projectsList} = this.state
    return (
      <ul className="projects-container">
        {projectsList.map(eachProject => (
          <Projects key={eachProject.id} projectDetails={eachProject} />
        ))}
      </ul>
    )
  }

  failureView = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        className="failure-img"
        alt="failure view"
      />
      <h1 className="heading">Oops! Something Went Wrong</h1>
      <p className="description">
        We cannot seem to find the page you are looking for
      </p>
      <button className="button" type="button" onClick={this.getProjects}>
        Retry
      </button>
    </div>
  )

  results = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.successView()
      case apiStatusConstants.inProgress:
        return this.loadingView()
      case apiStatusConstants.failure:
        return this.failureView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="bg-container">
        <div className="nav-bar">
          <img
            src="https://assets.ccbp.in/frontend/react-js/projects-showcase/website-logo-img.png"
            alt="website logo"
            className="logo"
          />
        </div>
        <select className="select" onChange={this.onChangeSelectOption}>
          {categoriesList.map(eachCategory => (
            <option
              key={eachCategory.id}
              value={eachCategory.id}
              className="option"
            >
              {eachCategory.displayText}
            </option>
          ))}
        </select>
        {this.results()}
      </div>
    )
  }
}
export default App

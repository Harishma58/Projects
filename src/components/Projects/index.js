import './index.css'

const Projects = props => {
  const {projectDetails} = props
  const {name, imageUrl} = projectDetails

  return (
    <li className="list-item">
      <img src={imageUrl} className="project" alt={name} />
      <p className="title">{name}</p>
    </li>
  )
}
export default Projects

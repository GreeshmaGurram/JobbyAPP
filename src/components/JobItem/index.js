import {Link} from 'react-router-dom'
import {AiFillStar} from 'react-icons/ai'
import {IoLocationSharp} from 'react-icons/io5'
import {BsBriefcase} from 'react-icons/bs'

import './index.css'

const JobItem = props => {
  const {job} = props
  return (
    <Link to={`/jobs/${job.id}`}>
      {' '}
      <div className="job-item-container">
        <div className="job-item-intro-container">
          <div>
            <img
              className="job-item-company-logo"
              src={job.companyLogoUrl}
              alt="company logo"
            />
          </div>
          <div className="job-item-intro-heading-container">
            <h3 className="job-item-intro-heading">{job.title}</h3>
            <div className="job-item-intro-rating-container">
              <AiFillStar className="star" />
              <p>{job.rating}</p>
            </div>
          </div>
        </div>
        <div className="location-container">
          <div className="job-item-intro-rating-container">
            <IoLocationSharp className="icon" />
            <p className="extra-spacing">{job.location}</p>
          </div>
          <div className="job-item-intro-rating-container">
            <BsBriefcase className="icon" />
            <p className="extra-spacing">{job.employmentType}</p>
          </div>
          <div className="job-item-intro-rating-container">
            <p className="extra-spacing">{job.packagePerAnnum}</p>
          </div>
        </div>
        <hr />
        <h4 className="description">Description</h4>
        <p className="description">{job.jobDescription}</p>
      </div>
    </Link>
  )
}

export default JobItem

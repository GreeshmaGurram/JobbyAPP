import {Component} from 'react'
import {Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {AiFillStar} from 'react-icons/ai'
import {IoLocationSharp} from 'react-icons/io5'
import {BsBriefcase} from 'react-icons/bs'
import Header from '../Header/index'

import './index.css'

export default class JobDetails extends Component {
  state = {
    jobDetailsFetchStatus: 'INITIAL',
    job: {},
  }

  componentDidMount() {
    this.getJobDetails()
  }

  getJobDetails = async () => {
    this.setState({jobDetailsFetchStatus: 'LOADING'})
    const {match} = this.props
    const {params} = match
    const {id} = params
    const jwtToken = Cookies.get('jwt_token')
    const jobDetailsApi = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(jobDetailsApi, options)
    const data = await response.json()
    if (response.ok) {
      this.setState({
        jobDetailsFetchStatus: 'SUCCESS',
        job: {
          title: data.job_details.title,
          rating: data.job_details.rating,
          companyLogoUrl: data.job_details.company_logo_url,
          companyWebsiteUrl: data.job_details.company_website_url,
          employmentType: data.job_details.employment_type,
          id: data.job_details.id,
          jobDescription: data.job_details.job_description,
          skills: data.job_details.skills.map(each => ({
            skillName: each.name,
            skillUrl: each.image_url,
          })),
          lifeAtCompany: {
            description: data.job_details.life_at_company.description,
            imageUrl: data.job_details.life_at_company.image_url,
          },
          location: data.job_details.location,
          packagePerAnnum: data.job_details.package_per_annum,
          similarJobs: data.similar_jobs.map(each => ({
            title: each.title,
            rating: each.rating,
            companyLogoUrl: each.company_logo_url,
            employmentType: each.employment_type,
            id: each.id,
            location: each.location,
            jobDescription: each.job_description,
          })),
        },
      })
    } else {
      this.setState({jobDetailsFetchStatus: 'FAILURE'})
    }
  }

  returnLoader = () => (
    <div className="loader-container-job-details" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  onJobDetailsRetryButtonClicked = () => {
    this.getJobDetails()
  }

  returnJobFetchFailureView = () => (
    <div className="loader-container-job-details">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <h2>Oops! Something Went Wrong</h2>
      <p>We cannot seem to find the page you are looking for</p>
      <button
        type="button"
        className="retry-button"
        onClick={this.onJobDetailsRetryButtonClicked}
      >
        Retry
      </button>
    </div>
  )

  returnJobDetail = () => {
    const {job} = this.state
    return (
      <div className="job-detail-container-background">
        <div className="job-detail-container">
          <div className="job-detail-intro-container">
            <div>
              <img
                className="job-detail-company-logo"
                src={job.companyLogoUrl}
                alt="job details company logo"
              />
            </div>
            <div className="job-detail-intro-heading-container">
              <h3 className="job-detail-intro-heading">{job.title}</h3>
              <div className="job-detail-intro-rating-container">
                <AiFillStar className="star" />
                <p>{job.rating}</p>
              </div>
            </div>
          </div>
          <ul className="location-container">
            <li className="job-detail-intro-rating-container">
              <IoLocationSharp className="icon" />
              <p className="extra-spacing">{job.location}</p>
            </li>
            <li className="job-detail-intro-rating-container">
              <BsBriefcase className="icon" />
              <p className="extra-spacing">{job.employmentType}</p>
            </li>
            <li className="job-detail-intro-rating-container">
              <p className="extra-spacing">{job.packagePerAnnum}</p>
            </li>
          </ul>
          <hr />
          <div className="description-heading-container">
            <h4 className="description">Description</h4>
            <a href={job.companyWebsiteUrl} className="visit-link">
              Visit
            </a>
          </div>

          <p className="description">{job.jobDescription}</p>
          <h4 className="description">Skills</h4>
          <ul className="skills-list">
            {job.skills.map(each => (
              <li key={each.skillName} className="skill-item">
                <img
                  alt={each.skillName}
                  src={each.skillUrl}
                  className="icon"
                />
                <p>{each.skillName}</p>
              </li>
            ))}
          </ul>
          <h4 className="description">Life at Company</h4>
          <div className="life-at-company-container">
            <p className="life-at-company-container-para">
              {job.lifeAtCompany.description}
            </p>
            <img
              className="life-at-company-container-image"
              src={job.lifeAtCompany.imageUrl}
              alt="life at company"
            />
          </div>
        </div>
        {this.returnSimilarJobsView()}
      </div>
    )
  }

  returnSimilarJobsView = () => {
    const {job} = this.state
    return (
      <div>
        <h2 className="description">Similar Jobs</h2>
        <ul className="similar-jobs-list">
          {job.similarJobs.map(each => (
            <li key={each.id} className="similar-job-item link-jobs">
              <Link to={`/jobs/${each.id}`}>
                <div className="job-detail-intro-container">
                  <div>
                    <img
                      className="job-detail-company-logo"
                      src={each.companyLogoUrl}
                      alt="similar job company logo"
                    />
                  </div>
                  <div className="job-detail-intro-heading-container">
                    <h3 className="job-detail-intro-heading">{each.title}</h3>
                    <div className="job-detail-intro-rating-container">
                      <AiFillStar className="star" />
                      <p>{each.rating}</p>
                    </div>
                  </div>
                </div>
                <h3>Description</h3>
                <p>{each.jobDescription}</p>
                <div className="location-container">
                  <div className="job-detail-intro-rating-container">
                    <IoLocationSharp className="icon" />
                    <p className="extra-spacing">{each.location}</p>
                  </div>
                  <div className="job-detail-intro-rating-container">
                    <BsBriefcase className="icon" />
                    <p className="extra-spacing">{each.employmentType}</p>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  renderJobDetailsView = () => {
    const {jobDetailsFetchStatus} = this.state
    switch (jobDetailsFetchStatus) {
      case 'LOADING':
        return this.returnLoader()
      case 'SUCCESS':
        return this.returnJobDetail()
      case 'FAILURE':
        return this.returnJobFetchFailureView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        {this.renderJobDetailsView()}
      </>
    )
  }
}

import {Component} from 'react'
import Cookies from 'js-cookie'
import {BsSearch} from 'react-icons/bs'

import Loader from 'react-loader-spinner'
import Header from '../Header/index'
import JobItem from '../JobItem/index'

import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

export default class Jobs extends Component {
  state = {
    profileFetchStatus: 'INITIAL',
    jobsFetchStatus: 'INITIAL',
    profileData: {},
    jobItemsData: [],
    employmentType: '',
    minimumPackage: '',
    search: '',
  }

  componentDidMount() {
    this.getProfileData()
    this.getJobItemsData()
  }

  getProfileData = async () => {
    this.setState({profileFetchStatus: 'LOADING'})
    const jwtToken = Cookies.get('jwt_token')
    const profileUrl = 'https://apis.ccbp.in/profile'
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(profileUrl, options)
    const data = await response.json()
    if (response.ok) {
      this.setState({
        profileFetchStatus: 'SUCCESS',
        profileData: {
          name: data.profile_details.name,
          profileImageUrl: data.profile_details.profile_image_url,
          shortBio: data.profile_details.short_bio,
        },
      })
    } else {
      this.setState({
        profileFetchStatus: 'FAILURE',
      })
    }
  }

  getJobItemsData = async () => {
    this.setState({jobsFetchStatus: 'LOADING'})
    const {employmentType, minimumPackage, search} = this.state
    const jwtToken = Cookies.get('jwt_token')
    const jobsAPI = `https://apis.ccbp.in/jobs?employment_type=${employmentType}&minimum_package=${minimumPackage}&search=${search}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(jobsAPI, options)
    const data = await response.json()
    if (response.ok) {
      const formattedJobsList = data.jobs.map(job => ({
        companyLogoUrl: job.company_logo_url,
        employmentType: job.employment_type,
        id: job.id,
        jobDescription: job.job_description,
        location: job.location,
        packagePerAnnum: job.package_per_annum,
        rating: job.rating,
        title: job.title,
      }))
      this.setState({
        jobsFetchStatus: 'SUCCESS',
        jobItemsData: formattedJobsList,
      })
    } else {
      this.setState({jobsFetchStatus: 'FAILURE'})
    }
  }

  onProfileRetryButtonClicked = () => {
    this.getProfileData()
  }

  onJobsRetryButtonClicked = () => {
    this.getJobItemsData()
  }

  renderProfile = () => {
    const {profileData} = this.state
    return (
      <div className="profile-container">
        <img
          className="profile-img"
          src={profileData.profileImageUrl}
          alt="profile"
        />
        <h3 className="profile-name">{profileData.name}</h3>
        <p>{profileData.shortBio}</p>
      </div>
    )
  }

  renderNoJobsFoundPage = () => (
    <div className="loader-container jobs-loader-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
        alt="no jobs"
      />
      <h2>No Jobs Found</h2>
      <p>We could not find any jobs. Try other filters!</p>
    </div>
  )

  renderJobItems = () => {
    const {jobItemsData} = this.state
    return jobItemsData.length !== 0
      ? jobItemsData.map(job => <JobItem key={job.id} job={job} />)
      : this.renderNoJobsFoundPage()
  }

  renderJobsLoader = () => (
    <div
      className="loader-container jobs-loader-container"
      data-testid="loader"
    >
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderLoader = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderProfileFailureView = () => (
    <div className="loader-container">
      <button
        type="button"
        className="retry-button"
        onClick={this.onProfileRetryButtonClicked}
      >
        Retry
      </button>
    </div>
  )

  renderJobFetchFailureView = () => (
    <div className="loader-container jobs-loader-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <h2>Oops! Something Went Wrong</h2>
      <p>We cannot seem to find the page you are looking for</p>
      <button
        type="button"
        className="retry-button"
        onClick={this.onJobsRetryButtonClicked}
      >
        Retry
      </button>
    </div>
  )

  renderJobItemsView = () => {
    const {jobsFetchStatus} = this.state
    switch (jobsFetchStatus) {
      case 'LOADING':
        return this.renderJobsLoader()
      case 'SUCCESS':
        return this.renderJobItems()
      case 'FAILURE':
        return this.renderJobFetchFailureView()
      default:
        return null
    }
  }

  renderProfileView = () => {
    const {profileFetchStatus} = this.state
    switch (profileFetchStatus) {
      case 'LOADING':
        return this.renderLoader()
      case 'SUCCESS':
        return this.renderProfile()
      case 'FAILURE':
        return this.renderProfileFailureView()
      default:
        return null
    }
  }

  renderTypeOfEmploymentView = () => {
    const {employmentType} = this.state
    const selectedTypes = employmentType.split(',')
    return (
      <div className="typeOfEmployment-container">
        <h2 className="typeOfEmployment-container-heading">
          Type of Employment
        </h2>
        {employmentTypesList.map(eachType => (
          <li
            key={eachType.employmentTypeId}
            className="typeOfEmployment-container-options"
          >
            <input
              onChange={this.onEmploymentTypeChanged}
              checked={
                selectedTypes.filter(
                  filterType =>
                    eachType.employmentTypeId === filterType.employmentTypeId,
                ).length !== 0
                  ? console.log('yes')
                  : console.log('no')
              }
              value={eachType.employmentTypeId}
              type="checkbox"
              name="employmentType"
              id={eachType.employmentTypeId}
            />
            <label htmlFor={eachType.employmentTypeId}>{eachType.label}</label>
          </li>
        ))}
      </div>
    )
  }

  renderSalaryRangeView = () => (
    <div className="typeOfEmployment-container">
      <h2 className="typeOfEmployment-container-heading">Salary Range</h2>
      {salaryRangesList.map(eachType => (
        <li
          className="typeOfEmployment-container-options"
          key={eachType.salaryRangeId}
        >
          <input
            onChange={this.onSalaryRangeChanged}
            value={eachType.salaryRangeId}
            type="radio"
            name="salaryRange"
            id={eachType.salaryRangeId}
          />
          <label htmlFor={eachType.salaryRangeId}>{eachType.label}</label>
        </li>
      ))}
    </div>
  )

  onSalaryRangeChanged = e => {
    this.setState({minimumPackage: e.target.value}, this.getJobItemsData)
  }

  onSearchChanged = e => {
    this.setState({search: e.target.value}, this.getJobItemsData)
  }

  onEmploymentTypeChanged = e => {
    const checkedType = e.target.value
    const {employmentType} = this.state
    if (employmentType !== '') {
      const selectedEmploymentTypes = employmentType.split(',')
      const isCheckedTypePresent = selectedEmploymentTypes.find(
        eachType => eachType === checkedType,
      )
      if (isCheckedTypePresent === undefined) {
        selectedEmploymentTypes.push(checkedType)
      } else {
        selectedEmploymentTypes.pop(checkedType)
      }
      this.setState(
        {employmentType: selectedEmploymentTypes.join(',')},
        this.getJobItemsData,
      )
    } else {
      this.setState({employmentType: checkedType}, this.getJobItemsData)
    }
  }

  render() {
    const {search} = this.state
    return (
      <>
        <Header />
        <div className="jobs-main-container">
          <div>
            <>{this.renderProfileView()}</>
            <hr className="horizontal-line-styles" />
            <>{this.renderTypeOfEmploymentView()}</>
            <hr className="horizontal-line-styles" />
            <>{this.renderSalaryRangeView()}</>
            <hr className="horizontal-line-styles" />
          </div>
          <div className="jobs-display-container">
            <div className="search-input-div">
              <input
                onChange={this.onSearchChanged}
                value={search}
                className="search-input"
                type="search"
                placeholder="Search"
              />
              <button
                className="search-input-button"
                type="button"
                aria-label="search"
                data-testid="searchButton"
              >
                <BsSearch className="search-icon" />
              </button>
            </div>
            <div>{this.renderJobItemsView()}</div>
          </div>
        </div>
      </>
    )
  }
}

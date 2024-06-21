import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

export default class LoginForm extends Component {
  state = {
    username: '',
    password: '',
    errorMsg: '',
    isLoginFailure: false,
  }

  onUsernameChanged = e => {
    this.setState({username: e.target.value})
  }

  onPasswordChanged = e => {
    this.setState({password: e.target.value})
  }

  onSubmitSuccess = jwtToken => {
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {expires: 3})
    history.replace('/')
  }

  onSubmitFailure = errorMsg => {
    this.setState({errorMsg, isLoginFailure: true})
  }

  onFormSubmitted = async e => {
    e.preventDefault()
    const {username, password} = this.state
    const userDetails = {username, password}
    const loginUrl = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(loginUrl, options)
    const data = await response.json()
    if (response.ok === true) {
      this.onSubmitSuccess(data.jwt_token)
    } else {
      this.onSubmitFailure(data.error_msg)
    }
  }

  render() {
    const {errorMsg, username, password, isLoginFailure} = this.state
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <div className="background-container">
        <div className="login-form-container">
          <img
            className="website-img"
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
          />
          <form onSubmit={this.onFormSubmitted}>
            <div className="form-fields">
              <label className="form-fields-labels" htmlFor="username">
                USERNAME
              </label>
              <input
                className="form-fields-inputs"
                onChange={this.onUsernameChanged}
                type="text"
                id="username"
                placeholder="Username"
                value={username}
              />
            </div>
            <div className="form-fields">
              <label className="form-fields-labels" htmlFor="password">
                PASSWORD
              </label>
              <input
                className="form-fields-inputs"
                onChange={this.onPasswordChanged}
                type="password"
                id="password"
                placeholder="Username"
                value={password}
              />
            </div>
            <button type="submit" className="login-button">
              Login
            </button>
            {isLoginFailure && <p className="error-msg">*{errorMsg}</p>}
          </form>
        </div>
      </div>
    )
  }
}

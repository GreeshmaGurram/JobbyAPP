import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

const Header = props => {
  const onLogoutClicked = () => {
    const {history} = props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  return (
    <div className="header-container">
      <Link to="/">
        <li className="custom-link-styles">
          <img
            className="website-logo-in-header"
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
          />
        </li>
      </Link>
      <div>
        <ul className="unordered-links">
          <Link to="/">
            <li className="each-link custom-link-styles">Home</li>
          </Link>
          <Link to="/jobs">
            <li className="custom-link-styles">Jobs</li>
          </Link>
        </ul>
      </div>
      <button type="button" className="logout-button" onClick={onLogoutClicked}>
        Logout
      </button>
    </div>
  )
}
export default withRouter(Header)

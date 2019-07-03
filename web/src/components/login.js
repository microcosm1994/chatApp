import React, {Component} from 'react'
import { Switch } from 'react-router-dom'
import { renderRoutes } from 'react-router-config'
import bg from '../img/bg.jpg'
import '../css/login.css'

class Login extends Component{
    constructor (props) {
        super(props)
        this.state = {
            route: props.route.routes
        }
    }
    render () {
        return (
            <div className="login">
                <div className='login-bg'>
                    <img src={bg} alt=""/>
                </div>
                <Switch>
                    {renderRoutes(this.state.route)}
                </Switch>
            </div>
        )
    }
}
export default Login

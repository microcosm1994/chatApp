import React, {Component} from 'react'
import { Switch } from 'react-router-dom'
import { renderRoutes } from 'react-router-config'
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
                <Switch>
                    {renderRoutes(this.state.route)}
                </Switch>
            </div>
        )
    }
}
export default Login

import React, {Component} from 'react'
import {Form, Icon, Input, Button, message} from 'antd'
import {$axios} from "../lib/interceptors";
import cookie from 'react-cookies'
import title from '../img/title.png'
import db from '../lib/db/index'
import '../css/login.css'

class Login extends Component{
    constructor (props) {
        super(props)
        this.state = {
            ip: ''
        }
    }
    componentDidMount () {
        // 获取ip
        db.getlocalIP().then(res => {
            this.setState({
                ip: res
            })
        })
    }
    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let form = {}
                let ip = this.state.ip.replace(/(\.)/g, '')
                form.username = ip
                form.password = ip
                form.nickname = values.nickname
                $axios.post('/api/user/register', form).then((res) => {
                    if (res.status === 200) {
                        // 保存用户信息到cookie
                        cookie.save('nickname', res.data.nickname)
                    } else {
                        this.login({username: form.username, password: form.password})
                    }
                })
            } else {
                console.log(err)
            }
        });
    }
    login = (form) => {
        $axios.post('/api/user/login', form).then((res) => {
            if (res.status === 200) {
                // 保存用户信息到cookie
                cookie.save('nickname', res.data.nickname)
                this.props.history.push('/')
            }
        })
    }
    render () {
        const { getFieldDecorator } = this.props.form;
        return (
            <div className="login-form">
                <div className='login-form-title'>
                    <img src={title} alt=""/>
                </div>
                <div className='login-form-body'>
                    <Form onSubmit={this.handleSubmit}>
                        <Form.Item>
                            {getFieldDecorator('nickname', {
                                rules: [{ required: true, message: '请输入昵称!' }],
                            })(
                                <Input
                                    prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    placeholder="请输入昵称"
                                />,
                            )}
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" className="login-form-button">
                                进入网站
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        )
    }
}
export default Form.create({ name: 'login' })(Login)

import React, {Component} from 'react'
import {Form, Icon, Input, Button, Checkbox} from 'antd'
import {$axios} from "../lib/interceptors";
import cookie from 'react-cookies'
import '../css/login.css'

class Login extends Component{
    constructor (props) {
        super(props)
        this.state = {}
    }
    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let form = {}
                form.username = values.username
                form.password = values.password
                $axios.post('/api/user/login', form).then((res) => {
                    if (res.status === 200) {
                        // 保存用户信息到cookie
                        cookie.save('nickname', res.data.nickname)
                        this.props.history.push('/home')
                    }
                })
            } else {
                console.log(err)
            }
        });
    }
    register = e => {
        console.log(this.props);
        this.props.history.push('/login/register')
    }
    render () {
        const { getFieldDecorator } = this.props.form;
        return (
            <div className="login-form">
                <div className='login-form-title'>
                    <p>Message</p>
                </div>
                <div className='login-form-body'>
                    <Form onSubmit={this.handleSubmit}>
                        <Form.Item>
                            {getFieldDecorator('username', {
                                rules: [{ required: true, message: '请输入账号!' }],
                            })(
                                <Input
                                    prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    placeholder="账号"
                                />,
                            )}
                        </Form.Item>
                        <Form.Item>
                            {getFieldDecorator('password', {
                                rules: [{ required: true, message: '请输入密码!' }],
                            })(
                                <Input
                                    prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    type="password"
                                    placeholder="6~30位密码"
                                />,
                            )}
                        </Form.Item>
                        <Form.Item>
                            {getFieldDecorator('remember', {
                                valuePropName: 'checked',
                                initialValue: true,
                            })(<Checkbox>记住账号</Checkbox>)}
                            <a className="login-form-forgot" href="">
                                忘记密码
                            </a>
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" className="login-form-button">
                                登 录
                            </Button>
                            <Button type="link" onClick={this.register}>现在注册</Button>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        )
    }
}
export default Form.create({ name: 'login' })(Login)

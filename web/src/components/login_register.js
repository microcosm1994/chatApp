import React, {Component} from 'react'
import {Form, Icon, Input, Button, message} from 'antd'
import {$axios} from "../lib/interceptors";
import '../css/login.css'

class Register extends Component{
    constructor (props) {
        super(props)
        this.state = {}
    }
    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let form = {}
                form.nickname = values.nickname
                form.username = values.username
                form.password = values.password
                $axios.post('/api/user/register', form).then((res) => {
                    if (res.status === 200) {
                        message.success('账号注册成功')
                        this.props.history.push('/login')
                    }
                })
            } else {
                console.log(err)
            }
        });
    }
    // 跳转到登陆页
    login = e => {
        this.props.history.push('/login')
    }
    handleConfirmBlur = e => {
        const value = e.target.value;
        this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    }
    compareToFirstPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && value !== form.getFieldValue('password')) {
            callback('俩次密码输入不一致!');
        } else {
            callback();
        }
    };
    render () {
        const { getFieldDecorator } = this.props.form;
        return (
            <div className="login-form">
                <div className='login-form-title'>
                    <p>注册账号</p>
                </div>
                <div className='login-form-body'>
                    <Form onSubmit={this.handleSubmit}>
                        <Form.Item>
                            {getFieldDecorator('nickname', {
                                rules: [{ required: true, message: '请输入用户名!' }],
                            })(
                                <Input placeholder="用户名"/>,
                            )}
                        </Form.Item>
                        <Form.Item>
                            {getFieldDecorator('username', {
                                rules: [{ required: true, message: '请输入账号!' }],
                            })(
                                <Input placeholder="账号"
                                />,
                            )}
                        </Form.Item>
                        <Form.Item>
                            {getFieldDecorator('password', {
                                rules: [{ required: true, message: '请输入密码!' }],
                            })(
                                <Input type="password" placeholder="6~30位密码"/>,
                            )}
                        </Form.Item>
                        <Form.Item>
                            {getFieldDecorator('checkPassword', {
                                rules: [
                                    {
                                        required: true,
                                        message: '俩次密码输入不一致!',
                                    },
                                    {
                                        validator: this.compareToFirstPassword,
                                    },
                                ],
                            })(<Input type='password' onBlur={this.handleConfirmBlur} placeholder='再次输入密码'/>)}
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" className="login-form-button">
                                注 册
                            </Button>
                            <Button type="link" onClick={this.login}>现在登陆</Button>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        )
    }
}
export default Form.create({ name: 'register' })(Register)

import React, {Component} from 'react'
import {Icon, Avatar, Tabs } from 'antd'
import '../css/userList.css'

const TabPane = Tabs.TabPane;
export default class userList extends Component{
    constructor (props) {
        super(props)
        this.state = {}
    }
    tabHandler (key) {
        console.log(key)
    }
    smallFullscreen () {
        this.refs.userListSmallWindow.style.display = 'none'
        this.refs.userListBigWindow.style.display = 'block'
    }
    bigFullscreen () {
        this.refs.userListBigWindow.style.display = 'none'
        this.refs.userListSmallWindow.style.display = 'block'
    }
    render () {
        return (
            <div className='userList'>
                <div className='userList-smallWindow' ref='userListSmallWindow'>
                    <div className='userList-smallWindow-info'>
                        <div className='userList-smallWindow-info-avator'>
                            <Avatar size="small" src='../img/avator.jpg' />
                        </div>
                        <div className='userList-smallWindow-info-name'>
                            小宇宙
                        </div>
                    </div>
                    <div className='userList-smallWindow-fullscreen' onClick={this.smallFullscreen.bind(this)}>
                        <Icon type="fullscreen" />
                    </div>
                </div>
                <div className='userList-bigWindow' ref='userListBigWindow'>
                    <div className='userList-bigWindow-info'>
                        <div className='userList-bigWindow-info-menu'>
                            <div className='userList-bigWindow-info-menu-fullscreen' onClick={this.bigFullscreen.bind(this)}>
                                <Icon type="fullscreen-exit" />
                            </div>
                        </div>
                        <div className='userList-bigWindow-info-container'>
                            <div className='userList-bigWindow-info-container-avator'>
                                <Avatar shape='square' size={30}  src='../img/avator.jpg' />
                            </div>
                            <div className='userList-bigWindow-info-container-name'>
                                小宇宙
                            </div>
                        </div>
                    </div>
                    <div className='userList-bigWindow-container'>
                        <Tabs defaultActiveKey="1" onChange={this.tabHandler}>
                            <TabPane tab="用户" key="1">
                                Content of Tab Pane 1
                            </TabPane>
                            <TabPane tab="聊天组" key="2">
                                Content of Tab Pane 2
                            </TabPane>
                        </Tabs>,
                    </div>
                </div>
            </div>
        )
    }
}

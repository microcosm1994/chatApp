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
        console.log(key);
    }
    render () {
        return (
            <div className='userList'>
                <div className='userList-smallWindow'>
                    <div className='userList-smallWindow-info'>
                        <div className='userList-smallWindow-info-avator'>
                            <Avatar size="small" src='../img/avator.jpg' />
                        </div>
                        <div className='userList-smallWindow-info-name'>
                            小宇宙
                        </div>
                    </div>
                    <div className='userList-smallWindow-fullscreen'>
                        <Icon type="fullscreen" />
                    </div>
                </div>
                <div className='userList-bigWindow'>
                    <div className='userList-bigWindow-info'>
                        <div className='userList-bigWindow-info-menu'>
                            <div className='userList-bigWindow-info-menu-fullscreen'>
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

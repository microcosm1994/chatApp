import React, {Component} from 'react'
import {Icon, Avatar, Tabs } from 'antd'
import {$axios} from "../lib/interceptors";
import cookie from 'react-cookies'
import '../css/friends.css'

const TabPane = Tabs.TabPane;
export default class friends extends Component{
    constructor (props) {
        super(props)
        this.state = {
            uid: props.uid
        }
    }
    // 切换tab栏
    tabHandler (key) {
        console.log(key)
    }
    // 添加好友
    addFriends () {
        console.log(this.state);
    }
    // 放大窗口
    smallFullscreen () {
        this.refs.friendsSmallWindow.style.display = 'none'
        this.refs.friendsBigWindow.style.display = 'block'
    }
    // 缩小窗口
    bigFullscreen () {
        this.refs.friendsBigWindow.style.display = 'none'
        this.refs.friendsSmallWindow.style.display = 'block'
    }
    render () {
        return (
            <div className='friends'>
                <div className='friends-smallWindow' ref='friendsSmallWindow'>
                    <div className='friends-smallWindow-info'>
                        <div className='friends-smallWindow-info-avator'>
                            <Avatar size="small" src='../img/avator.jpg' />
                        </div>
                        <div className='friends-smallWindow-info-name'>
                            小宇宙
                        </div>
                    </div>
                    <div className='friends-smallWindow-fullscreen' onClick={this.smallFullscreen.bind(this)}>
                        <Icon type="fullscreen" />
                    </div>
                </div>
                <div className='friends-bigWindow' ref='friendsBigWindow'>
                    <div className='friends-bigWindow-info'>
                        <div className='friends-bigWindow-info-menu'>
                            <div className='friends-bigWindow-info-menu-fullscreen' onClick={this.bigFullscreen.bind(this)}>
                                <Icon type="fullscreen-exit" />
                            </div>
                        </div>
                        <div className='friends-bigWindow-info-container'>
                            <div className='friends-bigWindow-info-container-avator'>
                                <Avatar shape='square' size={30}  src='../img/avator.jpg' />
                            </div>
                            <div className='friends-bigWindow-info-container-name'>
                                小宇宙
                            </div>
                        </div>
                    </div>
                    <div className='friends-bigWindow-container'>
                        <Tabs defaultActiveKey="1" onChange={this.tabHandler}>
                            <TabPane tab="用户" key="1">
                                Content of Tab Pane 1
                            </TabPane>
                            <TabPane tab="聊天组" key="2">
                                Content of Tab Pane 2
                            </TabPane>
                        </Tabs>
                    </div>
                    <div className='friends-bigWindow-tool'>
                        {/*{添加按钮}*/}
                        <div className='friends-bigWindow-tool-menu' onClick={this.addFriends.bind(this)}>
                            <Icon type="plus" />
                        </div>
                        {/*{搜索按钮}*/}
                        <div className='friends-bigWindow-tool-menu'>
                            <Icon type="search" />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

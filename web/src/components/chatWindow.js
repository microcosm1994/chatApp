import React, {Component} from 'react'
import {Button, Input, Icon } from 'antd'
import '../css/chatWindow.css'

const { TextArea } = Input;
export default class chatWindow extends Component{
    constructor (props) {
        super(props)
        this.state = {}
    }
    componentDidMount () {
        console.log(this);
    }
    drag (e) {
        let self = this
        let flag = true
        let clientX = e.clientX - this.refs.chatWindow.offsetLeft
        let clientY = e.clientY - this.refs.chatWindow.offsetTop
        document.onmousemove = (event) => {
            if (!flag) return false
            let domX = event.clientX
            let domY = event.clientY
            let flowTop = domY - clientY
            let flowLeft = domX - clientX
            let windowWidth = document.documentElement.clientWidth
            let windowHeight = document.documentElement.clientHeight
            // 左侧边界
            if (flowLeft < -600) {
                flowLeft = -600
            }
            // 右侧边界
            if ((windowWidth - flowLeft) < 100) {
                flowLeft = windowWidth - 100
            }
            // 上方边界
            if (flowTop < 0) {
                flowTop = 0
            }
            // 下方边界
            if ((windowHeight - flowTop) < 50) {
                flowTop = windowHeight - 50
            }
            self.refs.chatWindow.style.top = flowTop + 'px'
            self.refs.chatWindow.style.left = flowLeft + 'px'
            event.target.onmouseup = (e) => {
                flag = false
            }
        }
        document.onmouseup = (e) => {
            flag = false
        }
    }
    close () {
        console.log(this);
        this.refs.chatWindow.style.display = 'none'
    }
    render () {
        return(
            <div className='chatWindow' ref='chatWindow'>
                <div className='chatWindow-header' onMouseDown={this.drag.bind(this)}>
                    <div className='chatWindow-header-name'>
                        ssadsad
                    </div>
                    <div className='chatWindow-header-close' onClick={this.close.bind(this)}>
                        <Icon type="close" />
                    </div>
                </div>
                <div className='chatWindow-body'>
                    <div className='chatWindow-body-chat'>

                    </div>
                    <div className='chatWindow-body-toolbar'>

                    </div>
                    <div className='chatWindow-body-reply' contentEditable='true'></div>
                    <div className='chatWindow-body-btnBox'>
                        <Button size='small' type="primary">发送</Button>
                    </div>
                </div>
            </div>
        )
    }
}

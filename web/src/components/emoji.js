import React, {Component} from 'react'
import '../css/emoji.css'
import '../iconFont/iconfont.css'

class emoji extends Component{
    constructor (props) {
        super(props)
        this.state = {
            emoji: [],
            collect: [],
        }
    }
    componentDidMount () {
        this.iconFont()
        this.addEvent()
    }
    // 显示表情
    iconFont() {
        let html = ''
        for (let i = 0; i < 36; i++) {
            // html += '<span class="iconfont icon-Expression_' + i + '"></span>'
            html += '<svg class="icon" aria-hidden="true"><use xlink:href="#icon-Expression_' + (i === 0 ? '' : i) + '"></use></svg>'
        }
        document.getElementsByClassName('emoji-box')[0].innerHTML = html
    }

    // 给表情添加监听事件
    addEvent () {
        console.log(this.refs.emoji.childNodes);
        let nodeList = this.refs.emoji.childNodes
        for (let i = 0; i < nodeList.length; i++) {
            nodeList[i].addEventListener('click', (e) => {
                let deepNode = nodeList[i].cloneNode(true)
                this.props.input.appendChild(deepNode)
            })
        }
    }

    // 发送表情
    sendEmoji (e) {
        console.log(e.target);
        console.log(this.props.input);
        this.props.input.appendChild(e.target)
    }

    render () {
        return (
            <div className='emoji-box' ref='emoji'></div>
        )
    }
}

export default emoji

import React, {Component} from 'react'
import '../css/emoji.css'

const requireContext = require.context('../img', true, /^\.\/.*\.svg$/)
const images = requireContext.keys().map(requireContext)
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
        for (let i = 0; i < 36; i++) {
            let img = document.createElement("img")
            img.src = images[i]
            img.className = 'icon'
            document.getElementsByClassName('emoji-box')[0].appendChild(img)
        }
    }

    // 给表情添加监听事件
    addEvent () {
        let nodeList = this.refs.emoji.childNodes
        for (let i = 0; i < nodeList.length; i++) {
            nodeList[i].addEventListener('click', (e) => {
                let deepNode = nodeList[i].cloneNode(true)
                let selection = window.getSelection()
                let range = this.props.range
                if (!range) {
                    range = document.createRange()
                    range.selectNodeContents(this.props.input)
                }
                range.setStart(range.endContainer, range.endOffset)
                range.insertNode(deepNode)
                range.setEnd(range.endContainer, range.endOffset)
                selection.selectAllChildren(this.props.input)
                selection.collapseToEnd()
            })
        }
    }

    render () {
        return (
            <div className='emoji-box' ref='emoji'></div>
        )
    }
}

export default emoji

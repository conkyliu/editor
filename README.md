直接下载使用，在需要的页面的引入组件即可。
默认监听输入事件
````
/**
 * @Description:
 * @author Conky Liu
 * @date 2020/1/3 5:37 下午
 */

import Taro, {Component} from '@tarojs/taro'
import {View, Text} from '@tarojs/components'


export default class index extends Component {

    config = {
        navigationBarTitleText: '编辑器',
        usingComponents: {
            "my-editor": "/components/editor/editor"
        }

    };
    state = {};

    componentWillMount() {
    }

    componentDidMount() {
    }

    componentWillUnmount() {
    }

    componentDidShow() {
    }

    componentDidHide() {
    }

    onMyEvent = (w) => {
        console.log(w.detail, '11111')
    };

    render() {
        return (
            <View>
                <my-editor onMyevent={this.onMyEvent} />
            </View>
        )
    }
}
````

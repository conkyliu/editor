Component({

    behaviors: [],

    // 属性定义（详情参见下文）
    properties: {
        myProperty: { // 属性名
            type: String,
            value: ''
        },
        myProperty2: String // 简化的定义方式
    },

    data: {
        formats: {},
        readOnly: false,
        placeholder: '开始输入...',
        editorHeight: 300,
        keyboardHeight: 0,
        isIOS: false
    },
    lifetimes: {
        created: function () {
            console.log('created');
        },
        attached: function () {
            // 在组件实例进入页面节点树时执行
            console.log('attached');
        },
        detached: function () {
            // 在组件实例被从页面节点树移除时执行
            console.log('detached')
        },
    },

    pageLifetimes: {
        // 组件所在页面的生命周期函数
        show: function () {
            console.log('show');
        },
        hide: function () {
        },
        resize: function () {
        },
    },
    ready() {
        console.log('ready');
        this.onLoad();
    },

    methods: {
        readOnlyChange() {
            this.setData({
                readOnly: !this.data.readOnly
            })
        },
        onLoad() {
            const platform = wx.getSystemInfoSync().platform;
            const isIOS = platform === 'ios';
            this.setData({isIOS});
            const that = this;
            this.updatePosition(0);
            let keyboardHeight = 0;
            wx.onKeyboardHeightChange(res => {
                if (res.height === keyboardHeight) return
                const duration = res.height > 0 ? res.duration * 1000 : 0;
                keyboardHeight = res.height;
                setTimeout(() => {
                    wx.pageScrollTo({
                        scrollTop: 0,
                        success() {
                            that.updatePosition(keyboardHeight);
                            that.editorCtx.scrollIntoView()
                        }
                    })
                }, duration)

            })
        },
        updatePosition(keyboardHeight) {
            const toolbarHeight = 50;
            const {windowHeight, platform} = wx.getSystemInfoSync();
            let editorHeight = keyboardHeight > 0 ? (windowHeight - keyboardHeight - toolbarHeight) : windowHeight;
            this.setData({editorHeight, keyboardHeight})
        },
        calNavigationBarAndStatusBar() {
            const systemInfo = wx.getSystemInfoSync();
            const {statusBarHeight, platform} = systemInfo;
            const isIOS = platform === 'ios';
            const navigationBarHeight = isIOS ? 44 : 48;
            return statusBarHeight + navigationBarHeight
        },
        onEditorReady() {
            const that = this;
            that.createSelectorQuery().select('#myeditor').context(function (res) {
                console.log(res);
                that.editorCtx = res.context
            }).exec()
        },
        blur() {
            this.editorCtx.blur()
        },
        format(e) {
            let {name, value} = e.target.dataset
            if (!name) return
            // console.log('format', name, value)
            this.editorCtx.format(name, value)

        },
        onStatusChange(e) {
            const formats = e.detail;
            this.setData({formats})
        },
        insertDivider() {
            this.editorCtx.insertDivider({
                success: function () {
                    console.log('insert divider success')
                }
            })
        },
        clear() {
            this.editorCtx.clear({
                success: function (res) {
                    console.log("clear success")
                }
            })
        },
        removeFormat() {
            this.editorCtx.removeFormat()
        },
        insertDate() {
            const date = new Date();
            const formatDate = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
            this.editorCtx.insertText({
                text: formatDate
            })
        },
        insertImage() {
            const that = this;
            wx.chooseImage({
                count: 1,
                success: function (res) {
                    that.editorCtx.insertImage({
                        src: res.tempFilePaths[0],
                        success: function () {
                            console.log('insert image success')
                        }
                    })
                }
            })
        },

        onInput(detail) {
            this.triggerEvent('myevent', detail)
        }
    },

});

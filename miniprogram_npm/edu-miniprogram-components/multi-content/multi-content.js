// components/multi-media/multi-media.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        type: {
            type: String,
            value: "text"
        },
        detail: {
            type: String,
            value: "this is a multi-media component."
        },
        link: {
            type: String,
            value: null
        },
        style: {
            type: String,
            value: ""
        },
    },

    /**
     * 组件的初始数据
     */
    data: {
        custom_style: "position: fixed; width:100rpx; height:100rpx; background-color: #EFEFEF; border-radius: 50%; bottom: 50rpx; right: 50rpx;",
    },

    lifetimes: {
        attached: function () {
            switch (this.properties.type) {
                case "callout": this.init_callout(); break;
                case "popup": this.init_popup(); break;
                case "audio": this.init_audio(false); break;
                case "audio-auto": this.init_audio(true); break;
                default: break;
            }
        }
    },

    /**
     * 组件的方法列表
     */
    methods: {
        init_floating: function () {
            // handle custom style (position only)
            if (this.properties.style) {
                var style = this.properties.style;
                var custom_style = ""
                style = style.split(";");
                for (let s of style) {
                    if (s == "") continue;
                    let k = s.split(":")[0].replace(/^\s*|\s*$/g, "");
                    if (k=="top"||k=="left"||k=="bottom"||k=="right") {
                        custom_style += k+": "+s.split(":")[1].replace(/^\s*|\s*$/g, "")+"; ";
                    }
                }
                if (custom_style) {
                    custom_style += "position: fixed; width:100rpx; height:100rpx; background-color: #EFEFEF; border-radius: 50%";
                    this.setData({custom_style});
                }
            }
        },

        init_audio: function (auto) {
            this.init_floating();
            this.data.audioContext = wx.createInnerAudioContext({
                useWebAudioImplement: false
            });
            this.data.audioContext.src = this.properties.detail;
            this.data.audioContext.onEnded(function () {
                this.setData({isAudioPlay: false});
            }.bind(this));
            this.setData({isAudioPlay: auto});
            if (auto) {
                this.data.audioContext.autoplay = true;
                this.data.audioContext.loop = true;
            }
        },

        init_callout: function () {
            var image_data = {};
            image_data.icon = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgZmlsbD0iY3VycmVudENvbG9yIiBjbGFzcz0iYmkgYmktaW5mby1jaXJjbGUiIHZpZXdCb3g9IjAgMCAxNiAxNiI+CiAgPHBhdGggZD0iTTggMTVBNyA3IDAgMSAxIDggMWE3IDcgMCAwIDEgMCAxNHptMCAxQTggOCAwIDEgMCA4IDBhOCA4IDAgMCAwIDAgMTZ6Ii8+CiAgPHBhdGggZD0ibTguOTMgNi41ODgtMi4yOS4yODctLjA4Mi4zOC40NS4wODNjLjI5NC4wNy4zNTIuMTc2LjI4OC40NjlsLS43MzggMy40NjhjLS4xOTQuODk3LjEwNSAxLjMxOS44MDggMS4zMTkuNTQ1IDAgMS4xNzgtLjI1MiAxLjQ2NS0uNTk4bC4wODgtLjQxNmMtLjIuMTc2LS40OTIuMjQ2LS42ODYuMjQ2LS4yNzUgMC0uMzc1LS4xOTMtLjMwNC0uNTMzTDguOTMgNi41ODh6TTkgNC41YTEgMSAwIDEgMS0yIDAgMSAxIDAgMCAxIDIgMHoiLz4KPC9zdmc+";
            this.setData({ image_data });
        },

        init_popup: function () {
            wx.getSystemInfo({
                success: function (res) {
                    var h = res.windowHeight;
                    var w = res.windowWidth;
                    var h_rpx = Math.floor(750/w*h);
                    this.setData({popup_style: "max-height: "+String(h_rpx-120)+"rpx;"});
                }.bind(this),
                fail: function (res) {
                    this.setData({popup_style: "max-height: 1200rpx;"});
                }.bind(this)
            });
            this.setData({
                show_popup: false,
                popup_switch_pos_top: -1,
                popup_switch_pos_bottom: -1
            });
            this.animate("#popup", [
                { scale: [0, 0] }
            ], 1, function () {console.log("done");});
        },

        onTap: function () {
            if (this.properties.link) {
                if (this.properties.link == "back") {
                    wx.navigateBack();
                    return;
                }
                var pages = getCurrentPages();
                pages = pages.map(item => "/" + item.route);
                const index = pages.indexOf(this.properties.link);
                if (index == -1) {
                    wx.navigateTo({
                        url: this.properties.link,
                    });
                } else {
                    const delta = pages.length - index - 1;
                    wx.navigateBack({ delta });
                }

            }
        },

        onPopup: function (e) {
            if (!this.data.show_popup) {
                this.animate("#popup", [
                    { scale: [0, 0] },
                    { scale: [1.04, 1.04] },
                    { scale: [1, 1] },
                ], 200, function () {});
                this.setData({show_popup: true});
            } else {
                this.animate("#popup", [
                    { scale: [1, 1] },
                    { scale: [1.04, 1.04] },
                    { scale: [0, 0] },
                ], 200, function () {
                    this.setData({show_popup: false});
                }.bind(this));
            }
        },

        onTouchMove: function (e) {
            console.log(e);
        },

        onImageLoaded: function (e) {
            var dstyle = "";
            var ratio = e.detail.height / e.detail.width;
            if (this.properties.style.indexOf("height") == -1) {
                dstyle += "height: " + String(ratio * 100) + "vw;";
            } else {
                dstyle += "height: 100%;";
            }

            if (this.properties.style.indexOf("width") == -1) {
                dstyle += "width: 100vw;";
            }

            this.setData({ dstyle });
        },

        onAudio: function (e) {
            if (this.data.isAudioPlay) {
                this.data.audioContext.pause();
                this.setData({isAudioPlay: false});
            } else {
                this.data.audioContext.play();
                this.setData({isAudioPlay: true});
            }
        }
    }
})
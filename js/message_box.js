(function(window, document) {
    'use strict';

    function Message() {
        this.timer = null;
    };


    Message.prototype = {
        parentDocument: function() {
            return window.parent.document || window.document;
        },
        idNode: function(id) {
            return this.parentDocument().getElementById(id);
        },
        eleNode: function(ele) {
            return this.parentDocument().getElementsByTagName(ele)[0];
        },
        getEvent: function(event) {
            return event || window.event;
        },
        createEle: function() {
            var params = arguments;
            var newEle = document.createElement(params[0]);
            if (params.length >= 4) {
                newEle.className = params[1];
                newEle.id = params[2];
                if (params.length === 5 && params[3].indexOf('_') != -1) {
                    var t = document.createTextNode(params[4]);
                    newEle.appendChild(t);
                };
                if (params[3].indexOf('_') === -1) {
                    newEle.style.backgroundColor = params[4];
                    this.eleNode(params[3]).appendChild(newEle);
                } else {
                    this.idNode(params[3]).appendChild(newEle);
                };
            };

        },
        bindEventOfID: function(bindEle, bindType, fn) {
            var idEle = this.idNode(bindEle);
            if (idEle.addEventListener) {
                idEle.addEventListener(bindType, fn, false);
            } else if (id.attachEvent) {
                idEle.attachEvent("on" + bindType, fn);
            }
        },
        stopEvent: function(event) {
            var event = this.getEvent(event);
            if (event.preventDefault) {
                return event.preventDefault();
            } else {
                return event.returnValue = false;
            }
        },
        stopBubble: function(event) {
            var event = this.getEvent(event);
            if (event.stopPropagation) {
                event.stopPropagation();
            } else {
                event.cancelBubble = true;
            }
        },
        removeEle: function(clickEleID, removeEle, animationStyle, timer, confirm, cancel) {
            var that = this;
            this.bindEventOfID(clickEleID, "click", function(event) {
                if (confirm) {
                    confirm();
                }
                if (cancel) {
                    cancel();
                }

                var clickParentClassName = that.idNode(clickEleID).parentNode;
                var parentClassNameArray = clickParentClassName.className.split(' ');
                parentClassNameArray.length > 1 ? clickParentClassName.className = parentClassNameArray[0] + " " + animationStyle : parentClassNameArray.className = clickParentClassName;
                setTimeout(function() {
                    var node = that.idNode(removeEle);
                    node.parentNode.removeChild(node);
                    that.stopBubble(event);
                }, timer);
            });
        },
        timeoutRemoveEle: function(removeEle, animationStyle, timer) {
            var clickParentClassName = this.idNode(removeEle);
            var parentClassNameArray = clickParentClassName.className.split(' ');
            parentClassNameArray.length > 1 ? clickParentClassName.className = parentClassNameArray[0] + " " + animationStyle : parentClassNameArray.className = clickParentClassName;
            setTimeout(function() {
                clickParentClassName.parentNode.removeChild(clickParentClassName);
            }, timer);
        },
        hideEle: function(clickEle, hideEle, confirm, cancel) {
            var that = this;
            this.bindEventOfID(clickEle, "click", function() {
                if (confirm) {
                    confirm();
                };
                if (cancel) {
                    cancel()
                };

                that.idNode(hideEle).setAttribute("style", "display:none");

            })
        }
    };

    Message.prototype.showAlert = function(title, msg) {
        //层
        this.createEle("div", "alert-layer", "alert_layer", "body");
        //盒子
        this.createEle("div", "alert-box add-alert-box", "alert_box", "alert_layer");

        this.createEle("span", "box-title", "box_title", "alert_box", title);

        this.createEle("div", "box-content", "box_content", "alert_box", msg);

        this.createEle("button", "box-button", "box_button", "alert_box", "确 定");

        this.removeEle("box_button", "alert_layer", "remove-alert-box", 310);

    };

    Message.prototype.showRightBottom = function(option) {
        var title = option.title || "";
        var msg = option.msg || "默认值";
        var showTime = option.showTime || 2;
        var bgc = option.bgc || "rgba(0, 0, 0, .1)";
        var fontColor = option.fc || "";

        if (title !== "") {
            this.createEle("div", "right-bottom-main right-bottom-main-show", "right_bottom_main", "body");
            this.createEle("span", "right-bottom-text", "right_bottom_text", "right_bottom_main", title);
            this.createEle("span", "right-bottom-hide", "right_bottom_hide", "right_bottom_main", "×");
        } else {
            //main-no-title 
            this.createEle("div", "right-bottom-main main-no-title right-bottom-main-show ", "right_bottom_main", "body", bgc);
            this.createEle("span", "right-bottom-hide no-title", "right_bottom_hide", "right_bottom_main", "×");
        }
        this.createEle("div", "right-bottom-centent", "right_bottom_centent", "right_bottom_main", msg);
        if (fontColor !== "" && title === "") {
            this.idNode("right_bottom_centent").style.color = fontColor;

        }
        this.removeEle("right_bottom_hide", "right_bottom_main", (title === "" ? "main-no-title " : "") + " right-bottom-main-hide", 300);
        var a = this;
        setTimeout(function() {
            a.timeoutRemoveEle("right_bottom_main", (title === "" ? "main-no-title " : "") + " right-bottom-main-hide", 300);
        }, showTime * 1000);

    };
    Message.prototype.showConfirm = function(cllickEle, title, msg, confirm, cancel) {
        var that = this;
        this.bindEventOfID(cllickEle, "click", function(event) {
            that.stopEvent(event);
            //层
            that.createEle("div", "alert-layer", "alert_layer", "body");
            //盒子
            that.createEle("div", "alert-box-confirm add-alert-box", "alert_box", "alert_layer");

            that.createEle("span", "box-title", "box_title", "alert_box", title);

            that.createEle("div", "box-content", "box_content", "alert_box", msg);

            that.createEle("button", "box-button-cancel", "box_button_cancel", "alert_box", "取 消");

            that.createEle("button", "box-button", "box_button", "alert_box", "确 定");

            that.removeEle("box_button", "alert_layer", "remove-alert-box", 300, confirm);

            that.removeEle("box_button_cancel", "alert_layer", "remove-alert-box", 300, cancel);

        });
    };

    Message.prototype.showMode = function(modeID, title, confirm, cancel) {
        var myMode = this.idNode(modeID);
        if (myMode === null) {
            console.log('是不是忘加mode节点或id写错了^_^');
            return;
        };
        var model = this.idNode(modeID + "_mode_box");
        if (model != null) {
            model.setAttribute("style", "display:block");
            return;
        };
        myMode.setAttribute("style", "display:block;");
        this.createEle("div", "mode-box", modeID + "_mode_box", "body");
        this.createEle("div", "mode-content", modeID + "_mode_content", modeID + "_mode_box");
        this.createEle("div", "mode-title", modeID + "_mode_title", modeID + "_mode_content", title);
        var modeContent = this.idNode(modeID + "_mode_content");
        modeContent.appendChild(myMode);
        this.createEle("div", "mode-bottom", modeID + "_mode_bottom", modeID + "_mode_content");
        this.createEle("button", "mode-cancel", modeID + "_mode_cancel", modeID + "_mode_bottom", "取 消");
        this.createEle("button", "mode-submit", modeID + "_mode_submit", modeID + "_mode_bottom", "确 定");

        this.hideEle(modeID + "_mode_submit", modeID + "_mode_box", confirm);
        this.hideEle(modeID + "_mode_cancel", modeID + "_mode_box", cancel);
    };
    Message.prototype.showLoading = function() {
        this.createEle("div", "load-box", "load_box", "body");
        this.createEle("div", "load-content ball-spin-fade-loader", "load_content", "load_box");
        for (var i = 0; i < 8; i++) {
            this.createEle("div", "", "", "load_content");
        };
        var that = this;
        this.timer = setTimeout(function() {
            console.log('请求超时');
            that.hideLoading();
            that.showRightBottom({
                msg: "请求超时",
                fc: "#fff",
                bgc: "red"
            })
        }, 30000);
    };

    Message.prototype.hideLoading = function() {
        this.eleNode("body").removeChild(this.idNode("load_box"));
        window.clearTimeout(this.timer);
    };


    window.message_box = new Message();

})(window, document);
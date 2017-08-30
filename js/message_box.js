(function(window, document) {
    'use strict';

    function Message() {
        // this.i = 0;
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


    window.message_box = new Message();

})(window, document);
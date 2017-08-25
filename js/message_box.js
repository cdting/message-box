(function(window, document) {
    'use strict';

    function Message() {

    };

    Message.prototype = {
        idNode: function(id) {
            return document.getElementById(id);
        },
        eleNode: function(ele) {
            return document.getElementsByTagName(ele)[0];
        },
        getEvent: function(event) {
            return event || window.event;
        },
        createEle: function(ele, className, id, parentEle, text) {
            var newEle = document.createElement(ele);
            newEle.className = className;
            newEle.id = id;

            if (text) {
                var t = document.createTextNode(text);
                newEle.appendChild(t);
            };

            if (parentEle.indexOf('_') === -1) {
                this.eleNode(parentEle).appendChild(newEle);
            } else {
                this.idNode(parentEle).appendChild(newEle);
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
        stopBubble: function(event) {
            var event = this.getEvent(event);
            if (event.stopPropagation) {
                event.stopPropagation();
            } else {
                event.cancelBubble = true;
            }
        },
        removeEle: function(clickEleID, removeEle) {
            var that = this;
            this.bindEventOfID(clickEleID, "click", function(event) {
                var clickParentClassName = that.idNode(clickEleID).parentNode;
                var parentClassNameArray = clickParentClassName.className.split(' ');
                parentClassNameArray.length > 1 ? clickParentClassName.className = parentClassNameArray[0] + " remove-alert-box" : parentClassNameArray.className = clickParentClassName;
                setTimeout(function() {
                    var node = that.idNode(removeEle);
                    node.parentNode.removeChild(node);
                    that.stopBubble(event);
                }, 300);
            });
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

        this.removeEle("box_button", "alert_layer");

        // this.removeEle("alert_layer", "alert_layer");
    };

    window.message_box = new Message();

})(window, document);
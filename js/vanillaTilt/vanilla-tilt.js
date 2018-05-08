var VanillaTilt = (function () {
    'use strict';

    /**
     * Created by Șandor Sergiu (micku7zu) on 1/27/2017.
     * Original idea: https://github.com/gijsroge/tilt.js
     * MIT License.
     * Version 1.4.1
     */

    class VanillaTilt {
        // 构造函数-提供变量初始化
        // 对每一个元素进行初始化
        constructor(element, settings = {}) {
            // 再次检测
            // 防止使用手动模式进行初始化
            if (!(element instanceof Node)) {
                throw ("Can't initialize VanillaTilt because " + element + " is not a Node.");
            }

            // 元素的宽度
            this.width = null;
            // 元素的高度
            this.height = null;
            // 到 ? 左边的距离？
            this.left = null;
            // 到 ? 顶部的距离?
            this.top = null;
            // 过渡使用时长
            this.transitionTimeout = null;
            // ?
            this.updateCall = null;


            this.updateBind = this.update.bind(this);
            this.resetBind = this.reset.bind(this);

            this.element = element;
            // 初始化 settings
            this.settings = this.extendSettings(settings);

            // 是否翻转倾斜方向
            // 为啥要转化为数字？方便处理？
            // 原因：通过数值的正负来确定是正向倾斜，还是反向；见 function getValues():174
            this.reverse = this.settings.reverse ? -1 : 1;

            // 这些属性为啥又要设置到类的属性上
            this.glare = this.isSettingTrue(this.settings.glare);
            this.glarePrerender = this.isSettingTrue(this.settings["glare-prerender"]);

            if (this.glare) {
                // 眩光处理
                this.prepareGlare();
            }

            // 绑定事件
            this.addEventListeners();
        }

        // 检测设置值是否为 true
        // setting === "" 情况出现在用户设置在 HTML 中指定 data-tilt-reverse=""
        isSettingTrue(setting) {
            return setting === "" || setting === true || setting === 1;
        }

        // 事件绑定方法
        addEventListeners() {
            this.onMouseEnterBind = this.onMouseEnter.bind(this);
            this.onMouseMoveBind = this.onMouseMove.bind(this);
            this.onMouseLeaveBind = this.onMouseLeave.bind(this);
            this.onWindowResizeBind = this.onWindowResizeBind.bind(this);

            this.element.addEventListener("mouseenter", this.onMouseEnterBind);
            this.element.addEventListener("mousemove", this.onMouseMoveBind);
            this.element.addEventListener("mouseleave", this.onMouseLeaveBind);
            if (this.glare) {
                window.addEventListener("resize", this.onWindowResizeBind);
            }
        }

        /**
         * 移出绑定的事件
         */
        removeEventListeners() {
            this.element.removeEventListener("mouseenter", this.onMouseEnterBind);
            this.element.removeEventListener("mousemove", this.onMouseMoveBind);
            this.element.removeEventListener("mouseleave", this.onMouseLeaveBind);
            if (this.glare) {
                window.removeEventListener("resize", this.onWindowResizeBind);
            }
        }

        /**
         * 清除事件
         */
        destroy() {
            // 清除（最后一个）动画定时器
            clearTimeout(this.transitionTimeout);
            // 如果仍有鼠标移动更新事件，则干掉
            if (this.updateCall !== null) {
                cancelAnimationFrame(this.updateCall);
            }

            // 重置元素位置
            this.reset();

            // 清除绑定的事件
            this.removeEventListeners();
            // 清除元素的 vanillaTilt 属性值
            this.element.vanillaTilt = null;
            // 删除元素的 vanillaTilt 属性
            delete this.element.vanillaTilt;

            // 清除元素
            this.element = null;
        }

        /**
         * 鼠标移入
         * @param {Object} event 
         */
        onMouseEnter(event) {
            this.updateElementPosition();
            //  will-change 为web开发者提供了一种告知浏览器该元素会有哪些变化的方法，
            // 这样浏览器可以在元素属性真正发生变化之前提前做好对应的优化准备工作。 
            // 这种优化可以将一部分复杂的计算工作提前准备好，使页面的反应更为快速灵敏。
            // 1. 不要将 will-change 设置到太多元素上
            // 2. 有节制地使用
            // 3. 不要过早地应用 will-change 优化
            // 4. 给它足够的工作时间
            this.element.style.willChange = "transform";
            this.setTransition();
        }

        /**
         * 鼠标移动
         * @param {Object} event 
         */
        onMouseMove(event) {
            // 下一帧事件到来之后，先清除上一次添加的动画帧
            if (this.updateCall !== null) {
                cancelAnimationFrame(this.updateCall);
            }

            this.event = event;
            this.updateCall = requestAnimationFrame(this.updateBind);
            // console.log(this.updateCall);
        }

        /**
         * 鼠标移出
         * @param {Object} event 
         */
        onMouseLeave(event) {
            this.setTransition();

            if (this.settings.reset) {
                requestAnimationFrame(this.resetBind);
            }
        }

        /**
         * 重置元素旋转
         */
        reset() {
            // pageX/pageY： 获取元素的中点
            this.event = {
                pageX: this.left + this.width / 2,
                pageY: this.top + this.height / 2
            };

            // 重置透视值
            // 沿 X 轴方向翻转角度
            // 沿 Y 轴方向翻转角度
            // 放大比例
            this.element.style.transform = "perspective(" + this.settings.perspective + "px) " +
                "rotateX(0deg) " +
                "rotateY(0deg) " +
                "scale3d(1, 1, 1)";
            // 重置眩光位置
            if (this.glare) {
                this.glareElement.style.transform = 'rotate(180deg) translate(-50%, -50%)';
                this.glareElement.style.opacity = '0';
            }
        }

        /**
         * 获取参数值
         */
        getValues() {
            // event.clientX/clientY：鼠标到视口左上角的距离
            // 计算得到的 x/y 表示鼠标点击位置占被点击元素的比例
            let x = (this.event.clientX - this.left) / this.width;
            let y = (this.event.clientY - this.top) / this.height;

            // 将 x/y 的值限制在区间 [0, 1] 中
            x = Math.min(Math.max(x, 0), 1);
            y = Math.min(Math.max(y, 0), 1);

            // 计算倾斜值：this.settings.max / 2 - x * this.settings.max 相当于，从中点开始计算
            // 问题：为啥要保留两位小数
            let tiltX = (this.reverse * (this.settings.max / 2 - x * this.settings.max)).toFixed(2);
            let tiltY = (this.reverse * (y * this.settings.max - this.settings.max / 2)).toFixed(2);
            // console.log(tiltX, tiltY);
            // 计算角度
            let angle = Math.atan2(this.event.clientX - (this.left + this.width / 2), -(this.event.clientY - (this.top + this.height / 2))) * (180 / Math.PI);
            // console.log(angle);

            return {
                tiltX: tiltX,
                tiltY: tiltY,
                percentageX: x * 100,
                percentageY: y * 100,
                angle: angle
            };
        }

        /**
         * 确定元素位置
         */
        updateElementPosition() {
            // 方法返回元素的大小及其相对于视口的位置
            // top,left,right,bottom 相对于视口左上角
            let rect = this.element.getBoundingClientRect();

            // offsetWidth: 元素的宽度 = border + padding + scrollWidth + contentWidth(width)
            // offsetHeight: 元素的高度 = border + padding + scrollWidth + contentHeight(height)
            this.width = this.element.offsetWidth;
            this.height = this.element.offsetHeight;
            this.left = rect.left;
            this.top = rect.top;
        }

        /**
         * 更新动画处理函数
         */
        update() {
            let values = this.getValues();

            // perspective：透视；指定观察者到 z=0 平面的距离，使具有三维变换的元素产生透视效果
            this.element.style.transform = "perspective(" + this.settings.perspective + "px) " +
                "rotateX(" + (this.settings.axis === "x" ? 0 : values.tiltY) + "deg) " +
                "rotateY(" + (this.settings.axis === "y" ? 0 : values.tiltX) + "deg) " +
                "scale3d(" + this.settings.scale + ", " + this.settings.scale + ", " + this.settings.scale + ")";

            if (this.glare) {
                this.glareElement.style.transform = `rotate(${values.angle}deg) translate(-50%, -50%)`;
                this.glareElement.style.opacity = `${values.percentageY * this.settings["max-glare"] / 100}`;
            }

            // 问题：这里为啥会有一个事件
            // 对外暴露
            this.element.dispatchEvent(new CustomEvent("tiltChange", {
                "detail": values
            }));

            this.updateCall = null;
        }

        /**
         * Appends the glare element (if glarePrerender equals false)
         * and sets the default style
         * 
         * 添加眩光元素（当 glarePrerender = false 时）
         * 同时设置默认样式
         */
        prepareGlare() {
            // If option pre-render is enabled we assume all html/css is present for an optimal glare effect.
            if (!this.glarePrerender) {
                // Create glare element
                // 创建眩光元素
                const jsTiltGlare = document.createElement("div");
                jsTiltGlare.classList.add("js-tilt-glare");

                const jsTiltGlareInner = document.createElement("div");
                jsTiltGlareInner.classList.add("js-tilt-glare-inner");

                jsTiltGlare.appendChild(jsTiltGlareInner);
                this.element.appendChild(jsTiltGlare);
            }

            this.glareElementWrapper = this.element.querySelector(".js-tilt-glare");
            this.glareElement = this.element.querySelector(".js-tilt-glare-inner");

            // 如果用户指定自定义眩光，直接返回，不做处理
            if (this.glarePrerender) {
                return;
            }

            // 设置 wrapper 的默认样式
            Object.assign(this.glareElementWrapper.style, {
                "position": "absolute",
                "top": "0",
                "left": "0",
                "width": "100%",
                "height": "100%",
                "overflow": "hidden"
            });

            // 设置眩光元素的默认样式
            Object.assign(this.glareElement.style, {
                'position': 'absolute',
                'top': '50%',
                'left': '50%',
                // CSS 属性指定在什么情况下 (如果有) 某个特定的图形元素可以成为鼠标事件的 target。
                'pointer-events': 'none',
                'background-image': `linear-gradient(0deg, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 100%)`,
                'width': `${this.element.offsetWidth * 2}px`,
                'height': `${this.element.offsetWidth * 2}px`,
                'transform': 'rotate(180deg) translate(-50%, -50%)',
                // 改变图形变形原点
                'transform-origin': '0% 0%',
                'opacity': '0',
            });
        }

        /**
         * 更新眩光尺寸
         * 问题：为什么都是 width * 2
         */
        updateGlareSize() {
            Object.assign(this.glareElement.style, {
                'width': `${this.element.offsetWidth * 2}`,
                'height': `${this.element.offsetWidth * 2}`,
            });
        }

        /**
         * 窗口大小改变处理函数
         * 窗口大小改变 -> 眩光大小
         */
        onWindowResizeBind() {
            this.updateGlareSize();
        }

        /**
         * 设置过渡
         * 在动画执行完毕后，清除元素的 transition
         * 问题：为啥要清除？
         * 原因：不移除会导致每次移动都有一个 duration，从而导致动画卡顿
         * speed 值不宜过大，长时间不清除transition，同样会导致动画卡顿
         * 这里边有一个节流? OR 防抖?
         * 这个是防抖
         */
        setTransition() {
            clearTimeout(this.transitionTimeout);
            this.element.style.transition = this.settings.speed + "ms " + this.settings.easing;
            if (this.glare) {
                this.glareElement.style.transition = `opacity ${this.settings.speed}ms ${this.settings.easing}`;
            }
            this.transitionTimeout = setTimeout(() => {
                this.element.style.transition = "";
                if (this.glare) {
                    this.glareElement.style.transition = "";
                }
            }, this.settings.speed);
        }

        /**
         * 
         * @param {Object} settings 用户设置的 settings
         */
        extendSettings(settings) {
            // 初始值
            let defaultSettings = {
                // 倾斜方向
                reverse: false,
                // 倾斜的最大角度
                max: 35,
                // 透视，值越小透视越严重
                perspective: 1000,
                // 动画中变换速度
                easing: "cubic-bezier(.03,.98,.52,.99)",
                // 放大比例
                scale: "1",
                // 进入/退出的过渡用时
                speed: "300",
                // 是否添加进入/退出过渡效果
                transition: true,
                // 禁用轴
                axis: null,
                // 是否开启眩光效果
                glare: false,
                // 眩光最大透明度 (1=100%, .5 = 50%)
                "max-glare": 1,
                // 是否自定义眩光效果：false：VanillaTilt 帮你创建一个眩光效果元素；true：需要自己添加一个.js-tilt-glare>.js-tilt-glare-inner
                "glare-prerender": false,
                // 当移出后时候回复默认状态
                reset: true
            };

            // 新设置值
            let newSettings = {};
            // 循环全量的 defaultSettings
            for (var property in defaultSettings) {
                if (property in settings) {
                    // 通过对象传入 settings；检测用户是否指定对应的属性值
                    newSettings[property] = settings[property];
                } else if (this.element.hasAttribute("data-tilt-" + property)) {
                    // 通过 HTML 属性方式传入属性值
                    let attribute = this.element.getAttribute("data-tilt-" + property);
                    // 这里为啥要使用 try/catch，防止 JSON.parse 解析失败？
                    // JSON.parse 解析可能失败的情况，举个栗子
                    // 在 HTML 中 这样设置 data-tilt-reverse="" 时；使用 JSON.parse 会报错
                    // 但是在这种情况下该框架认为设置的 reverse 值为 true；同时自己实现了一个 function isSettingTrue 来检测
                    try {
                        // 通过 getAttribute 获取的值是 String；使用 JSON.parse 将结果转化为 Javascript 值
                        newSettings[property] = JSON.parse(attribute);
                    } catch (e) {
                        // JSON.parse 失败， 直接将获取的属性值赋值给新属性值
                        newSettings[property] = attribute;
                    }
                } else {
                    // 没有指定有关属性，直接使用默认值
                    newSettings[property] = defaultSettings[property];
                }
            }

            return newSettings;
        }

        /**
         * 入口
         */
        static init(elements, settings) {
            // 将element 处理成数组形式
            if (elements instanceof Node) {
                elements = [elements];
            }

            // nodeList 转化为数组
            if (elements instanceof NodeList) {
                elements = [].slice.call(elements);
            }

            if (!(elements instanceof Array)) {
                return;
            }

            // 检测元素是否含有 'vanillaTilt' 属性
            elements.forEach((element) => {
                if (!("vanillaTilt" in element)) {
                    element.vanillaTilt = new VanillaTilt(element, settings);
                }
            });
        }
    }

    // 检测是否是浏览器环境
    if (typeof document !== "undefined") {
        /* expose the class to window */
        // 将 VanillaTilt 添加到全局对象 window 上
        window.VanillaTilt = VanillaTilt;

        /**
         * Auto load
         */
        // 自动加载
        // 初始化元素的属性
        VanillaTilt.init(document.querySelectorAll("[data-tilt]"));
    }

    return VanillaTilt;

}());

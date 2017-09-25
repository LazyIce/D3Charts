define(["require", "exports", "../../../Core/Util"], function (require, exports, Util_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var BarLoader = (function () {
        function BarLoader(width, height) {
            this.id = "barLoader";
            this.width = Util_1.Util.toPixel(width);
            this.height = Util_1.Util.toPixel(height);
        }
        BarLoader.prototype.setWidth = function (width) {
            this.width = Util_1.Util.toPixel(width);
            return this;
        };
        BarLoader.prototype.setHeight = function (height) {
            this.height = Util_1.Util.toPixel(height);
            return this;
        };
        BarLoader.prototype.makeSVG = function (tag, attributes) {
            var elem = document.createElementNS("http://www.w3.org/2000/svg", tag);
            for (var attribute in attributes) {
                var name_1 = attribute;
                var value = attributes[attribute];
                elem.setAttribute(name_1, value);
            }
            return elem;
        };
        BarLoader.prototype.addTo = function (el) {
            this.el.style.transform = "translate(-100%,0)";
            this.oldRatio = 0;
            this.interval = 1000;
            el.appendChild(this.el);
            return this;
        };
        BarLoader.prototype.toElement = function () {
            this.el = document.createElementNS("http://www.w3.org/1999/xhtml", "div");
            this.el.setAttribute("id", this.id);
            this.el.setAttribute("class", "barLoaderContainer");
            var svgNode = this.makeSVG("svg", { width: this.width, height: this.height });
            var defs = this.makeSVG("defs", {});
            var linearGradient = this.makeSVG("linearGradient", { id: "color-gradient", x1: "0", y1: "0%", x2: "99.33%", y2: "0%", gradientUnits: "userSpaceOnUse" });
            var stop1 = this.makeSVG("stop", { offset: "0%", style: "stop-color:yellow" });
            var stop2 = this.makeSVG("stop", { offset: "100%", style: "stop-color:aqua" });
            linearGradient.appendChild(stop1);
            linearGradient.appendChild(stop2);
            defs.appendChild(linearGradient);
            svgNode.appendChild(defs);
            var lineBase = this.makeSVG("line", { id: "lineBase", x1: "0", y1: this.height / 3, x2: "100%", y2: this.height / 3 + 0.001 });
            var lineColor = this.makeSVG("line", { id: "colorful", x1: "0", y1: this.height / 3, x2: "0%", y2: this.height / 3 + 0.001 });
            svgNode.appendChild(lineBase);
            svgNode.appendChild(lineColor);
            var text = this.makeSVG("text", { transform: "translate(" + this.width / 2 + ", " + this.height / 3 * 2 + ")" });
            var str = "Loading...";
            for (var i = 0; i < str.length; i++) {
                var tspan = this.makeSVG("tspan", {});
                tspan.textContent = str.charAt(i);
                var animateSize = void 0, animateColor = void 0;
                if (i == 0) {
                    animateSize = this.makeSVG("animate", { id: "ani" + i, attributeName: "font-size", values: "20;24;20", begin: "0s;ani9.end", dur: "0.5s" });
                    animateColor = this.makeSVG("animate", { attributeName: "fill", from: "yellow", to: "aqua", begin: "0s;ani" + str.length + ".end", dur: "0.5s", fill: "freeze" });
                }
                else {
                    animateSize = this.makeSVG("animate", { id: "ani" + i, attributeName: "font-size", values: "20;24;20", begin: ("ani" + (i - 1) + ".end"), dur: "0.5s" });
                    animateColor = this.makeSVG("animate", { attributeName: "fill", from: "yellow", to: "aqua", begin: ("ani" + (i - 1) + ".end"), dur: "0.5s", fill: "freeze" });
                }
                tspan.appendChild(animateSize);
                tspan.appendChild(animateColor);
                text.appendChild(tspan);
            }
            svgNode.appendChild(text);
            this.el.appendChild(svgNode);
            return this.el;
        };
        BarLoader.prototype.show = function () {
            var _this = this;
            requestAnimationFrame(function () {
                _this.el.style.transform = "translate(0,0)";
            });
            return this;
        };
        BarLoader.prototype.setProgress = function (ratio) {
            var _this = this;
            var temp = this.oldRatio;
            if (this.intervalIndex) {
                clearInterval(this.intervalIndex);
                this.intervalIndex = 0;
            }
            this.intervalIndex = setInterval(function () {
                if (_this.oldRatio < ratio) {
                    document.getElementById("colorful").setAttribute("x2", _this.oldRatio + "%");
                    _this.oldRatio += 1;
                }
                else {
                    clearInterval(_this.intervalIndex);
                    _this.intervalIndex = 0;
                    if (ratio == 100) {
                        return _this;
                    }
                    else
                        return _this;
                }
            }, 50);
            this.interval = (ratio - temp) * 50;
            return this;
        };
        BarLoader.prototype.remove = function () {
            var _this = this;
            requestAnimationFrame(function () {
                _this.el.style.transform = "translate(-100%,0)";
            });
            setTimeout(function () {
                _this.oldRatio = 0;
                _this.el.remove();
            }, 1000);
            return this;
        };
        return BarLoader;
    }());
    exports.BarLoader = BarLoader;
});

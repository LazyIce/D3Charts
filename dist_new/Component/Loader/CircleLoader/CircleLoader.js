define(["require", "exports", "../../../Core/Util"], function (require, exports, Util_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var CircleLoader = (function () {
        function CircleLoader(width, height, strokeWidth) {
            this.id = "loader";
            this.width = Util_1.Util.toPixel(width);
            this.height = Util_1.Util.toPixel(height);
            this.strokeWidth = Util_1.Util.toPixel(strokeWidth);
        }
        CircleLoader.prototype.setWidth = function (width) {
            this.width = Util_1.Util.toPixel(width);
            return this;
        };
        CircleLoader.prototype.setHeight = function (height) {
            this.height = Util_1.Util.toPixel(height);
            return this;
        };
        CircleLoader.prototype.setStrokeWidth = function (strokeWidth) {
            this.height = Util_1.Util.toPixel(strokeWidth);
            return this;
        };
        CircleLoader.prototype.makeSVG = function (tag, attributes) {
            var elem = document.createElementNS("http://www.w3.org/2000/svg", tag);
            for (var attribute in attributes) {
                var name_1 = attribute;
                var value = attributes[attribute];
                elem.setAttribute(name_1, value);
            }
            return elem;
        };
        CircleLoader.prototype.addTo = function (el) {
            this.el.style.transform = "translate(-100%,0)";
            this.oldRatio = 0;
            this.interval = 1000;
            el.appendChild(this.el);
            return this;
        };
        CircleLoader.prototype.toElement = function () {
            this.el = document.createElementNS("http://www.w3.org/1999/xhtml", "div");
            this.el.setAttribute("id", this.id);
            this.el.setAttribute("class", "circleLoaderContainer");
            var centerX = this.width / 2, centerY = this.width / 2, radius1 = this.width / 2 - this.strokeWidth, radius2 = radius1 - this.strokeWidth * 3;
            var svgNode = this.makeSVG("svg", { width: this.width, height: this.height });
            var group = this.makeSVG("g", {});
            var circle1 = this.makeSVG("circle", { cx: centerX, cy: centerY, r: radius1 });
            group.appendChild(circle1);
            var path1 = this.makeSVG("path", { class: "path1", d: "M" + centerX + " " + this.strokeWidth + " " + "A" + radius1 + " " + radius1 + " 0 0 1 " + centerX + " " + (centerY + radius1) });
            var animateTransform1 = this.makeSVG("animateTransform", { attributeName: "transform", type: "rotate", from: "0" + " " + centerX + " " + centerY, to: "360" + " " + centerX + " " + centerY, dur: "2s", repeatCount: "indefinite" });
            path1.appendChild(animateTransform1);
            group.appendChild(path1);
            var circle2 = this.makeSVG("circle", { cx: centerX, cy: centerY, r: radius2 });
            group.appendChild(circle2);
            var path2 = this.makeSVG("path", { class: "path2", d: "M" + centerX + " " + (centerY + radius2) + " " + "A" + radius2 + " " + radius2 + " 0 0 1 " + centerX + " " + (centerY - radius2) });
            var animateTransform2 = this.makeSVG("animateTransform", { attributeName: "transform", type: "rotate", from: "360" + " " + centerX + " " + centerY, to: "0" + " " + centerX + " " + centerY, dur: "2s", repeatCount: "indefinite" });
            path2.appendChild(animateTransform2);
            group.appendChild(path2);
            var ratio = this.makeSVG("text", { transform: "translate(" + centerX + "," + centerY + ")", class: "loaderRatio" });
            ratio.textContent = "0%";
            group.appendChild(ratio);
            var text = this.makeSVG("text", { transform: "translate(" + centerX + "," + ((this.height + this.width) / 2) + ")", class: "loaderText" });
            var str = "Calculating...";
            for (var i = 0; i < str.length; i++) {
                var tspan = this.makeSVG("tspan", {});
                tspan.textContent = str.charAt(i);
                var animateSize = void 0, animateColor = void 0;
                if (i == 0) {
                    animateSize = this.makeSVG("animate", { id: "ani" + i, attributeName: "font-size", values: "20;24;20", begin: "0s;ani13.end", dur: "0.5s" });
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
            group.appendChild(text);
            svgNode.appendChild(group);
            this.el.appendChild(svgNode);
            return this.el;
        };
        CircleLoader.prototype.show = function () {
            var _this = this;
            requestAnimationFrame(function () {
                _this.el.style.transform = "translate(0,0)";
            });
            return this;
        };
        CircleLoader.prototype.setProgress = function (ratio) {
            var _this = this;
            var temp = this.oldRatio;
            if (this.intervalIndex) {
                clearInterval(this.intervalIndex);
                this.intervalIndex = 0;
            }
            this.intervalIndex = setInterval(function () {
                if (_this.oldRatio < ratio) {
                    document.getElementsByClassName("loaderRatio")[0].textContent = _this.oldRatio + 1 + "%";
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
        CircleLoader.prototype.remove = function () {
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
        return CircleLoader;
    }());
    exports.CircleLoader = CircleLoader;
});

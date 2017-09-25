define(["require", "exports", "../../../Core/Util"], function (require, exports, Util_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ShanghaiLoader = (function () {
        function ShanghaiLoader(width, height) {
            this.id = "shanghaiLoader";
            this.width = Util_1.Util.toPixel(width);
            this.height = Util_1.Util.toPixel(height);
        }
        ShanghaiLoader.prototype.setWidth = function (width) {
            this.width = Util_1.Util.toPixel(width);
            return this;
        };
        ShanghaiLoader.prototype.setHeight = function (height) {
            this.height = Util_1.Util.toPixel(height);
            return this;
        };
        ShanghaiLoader.prototype.makeSVG = function (tag, attributes) {
            var elem = document.createElementNS("http://www.w3.org/2000/svg", tag);
            for (var attribute in attributes) {
                var name_1 = attribute;
                var value = attributes[attribute];
                elem.setAttribute(name_1, value);
            }
            return elem;
        };
        ShanghaiLoader.prototype.addTo = function (el) {
            this.el.style.transform = "translate(-100%,0)";
            el.appendChild(this.el);
            return this;
        };
        ShanghaiLoader.prototype.toElement = function () {
            this.el = document.createElementNS("http://www.w3.org/1999/xhtml", "div");
            this.el.setAttribute("id", this.id);
            this.el.setAttribute("class", "shanghaiLoaderContainer");
            var svgNode = this.makeSVG("svg", { width: this.width, height: this.height });
            var shanghaiPath = this.makeSVG("path", { id: "shanghaiPath", d: "m0 250 h5 v-50 l5 -5 v-50 l20 5 v90 " +
                    "h5 v-45 h20 v60 " +
                    "h8 v-50 l20 -10 v55" +
                    "h12 v-80 h25 v70" +
                    "h3 v-40 l18 5 v45" +
                    "h8 v-50 h22 v55 h3 v10 h13 v10" +
                    "q10 3 20 0 q5 -5 0 -12 q-15 -23 10 -35 v-60 q-20 -20 5 -35 v-30 q-12 -15 5 -25 v-20 q-8 -8 0 -15 l3 -20" +
                    "l3 20 q8 8 0 15 v20 q17 10 5 25 v30 q25 15 5 35 v60 q25 12 10 35 q-5 7 0 12 q10 3 20 0" +
                    "v-10 h20 v-18 h20 v8 h5 v-25 h20 v40" +
                    "q5 5 10 0 l-10 -100 l30 -50 l5 150" +
                    "h5 v-10 h15 v-40 h20 v40" +
                    "h8 l5 -30 q10 -10 20 0 l5 30" +
                    "h8 v-62 h20 v60" +
                    "q8 5 15 0 v-220 h5 v-8 h5 v-8 h5 v-8 h5 l3 -15 l3 15 h5 v8 h5 v8 h5 v8 h5 v220 h10"
            });
            var shanghaiText = this.makeSVG("text", { transform: "translate(" + this.width / 2 + ", 320)" });
            shanghaiText.textContent = "Loading...";
            svgNode.appendChild(shanghaiPath);
            svgNode.appendChild(shanghaiText);
            this.el.appendChild(svgNode);
            return this.el;
        };
        ShanghaiLoader.prototype.show = function () {
            var _this = this;
            requestAnimationFrame(function () {
                _this.el.style.transform = "translate(0,0)";
            });
            return this;
        };
        ShanghaiLoader.prototype.remove = function () {
            var _this = this;
            requestAnimationFrame(function () {
                _this.el.style.transform = "translate(-100%,0)";
            });
            setTimeout(function () {
                _this.el.remove();
            }, 1000);
            return this;
        };
        ShanghaiLoader.prototype.setProgress = function (ratio) {
            document.getElementById("shanghaiPath").style.strokeDashoffset = (2997 - (ratio / 100 * 2997)).toString();
            return this;
        };
        return ShanghaiLoader;
    }());
    exports.ShanghaiLoader = ShanghaiLoader;
});

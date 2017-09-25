var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define(["require", "exports", "lodash", "./Util", "./View"], function (require, exports, _, Util_1, View_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var BaseLayer = (function (_super) {
        __extends(BaseLayer, _super);
        function BaseLayer(id, conf) {
            var _this = _super.call(this, conf) || this;
            _this.rendered = false;
            _this.id = id == undefined ? _.uniqueId("layer") : id;
            _this.updateStyle();
            return _this;
        }
        BaseLayer.prototype.defaultConfig = function () {
            return {
                tagName: "svg",
                className: "layer",
                style: {
                    top: "0px",
                    left: "0px",
                    bottom: null,
                    right: null,
                    position: "absolute",
                    zindex: 0,
                    width: "300px",
                    height: "300px",
                }
            };
        };
        BaseLayer.prototype.setConfig = function (c) {
            this.config = Util_1.Util.deepExtend(this.config, c);
            this.render();
            return this;
        };
        BaseLayer.prototype.setStyle = function (s) {
            this.config.style = _.extend(this.config.style, s);
            this.updateStyle();
        };
        BaseLayer.prototype.evaluateStyle = function () {
            return {
                top: Util_1.Util.toPixel(this.config.style.top) + "px",
                left: Util_1.Util.toPixel(this.config.style.left) + "px",
                bottom: Util_1.Util.toPixel(this.config.style.bottom) + "px",
                right: Util_1.Util.toPixel(this.config.style.right) + "px",
                width: Util_1.Util.toPixel(this.config.style.width) + "px",
                height: Util_1.Util.toPixel(this.config.style.height) + "px",
                zindex: this.config.style.zindex,
                position: this.config.style.position
            };
        };
        BaseLayer.prototype.updateStyle = function () {
            var s = this.evaluateStyle();
            s["z-index"] = s.zindex;
            this.style(s);
        };
        BaseLayer.prototype.addTo = function (c) {
            c.addLayer(this);
            return this;
        };
        BaseLayer.prototype._onAdd = function (c) {
            this.chart = c;
            this.chart.whenReady(this.renderAtMap, this);
            this.fire("addToChart", { map: c });
        };
        BaseLayer.prototype.render = function () {
            this.el.innerHTML = "";
            return this;
        };
        BaseLayer.prototype.renderAtMap = function (dom) {
            this.chart.getLayerContainer().append(this.el);
            this.render();
        };
        BaseLayer.prototype.clear = function () {
            this.el.remove();
            this.el = null;
            _super.prototype.off.call(this, "*");
        };
        BaseLayer.prototype.getNode = function () {
            return this.el;
        };
        BaseLayer.prototype.update = function () {
            this.updateStyle();
            this.render();
        };
        return BaseLayer;
    }(View_1.View));
    exports.BaseLayer = BaseLayer;
});

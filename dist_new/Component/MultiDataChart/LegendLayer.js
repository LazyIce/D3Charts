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
define(["require", "exports", "lodash", "../../Core/Util", "../../Core/BaseLayer"], function (require, exports, _, Util_1, BaseLayer_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var LegendLayer = (function (_super) {
        __extends(LegendLayer, _super);
        function LegendLayer(id, conf) {
            var _this = _super.call(this, id, conf) || this;
            _this.on("addToChart", function () {
                _this.chart.on("style_change measure_change", function () {
                    _this.update();
                });
            });
            return _this;
        }
        LegendLayer.prototype.defaultConfig = function () {
            return Util_1.Util.deepExtend(_super.prototype.defaultConfig.call(this), {
                tagName: "div",
                className: "legend",
                style: {
                    width: "20rem",
                    height: "2rem"
                }
            });
        };
        LegendLayer.prototype.render = function () {
            var _this = this;
            this.el.innerHTML = "";
            var ds = this.chart.getAllMeasure();
            var legendGroup = this.elD3.append("div").attr("class", "legendGroup");
            _.each(ds, function (d, i) {
                var legendUnit = legendGroup.append("div").attr("class", "legendUnit legendUnit" + i);
                legendUnit.append("span").style("background-color", _this.chart.getColor(d.id)).classed("iconSpan", true);
                legendUnit.append("span").text(d.id).classed("textSpan", true);
            });
            return this;
        };
        return LegendLayer;
    }(BaseLayer_1.BaseLayer));
    exports.LegendLayer = LegendLayer;
});

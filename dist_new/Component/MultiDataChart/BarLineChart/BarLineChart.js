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
define(["require", "exports", "d3", "../../../Core/Util", "../../MultiDataChart/MultiDataChart", "../../MultiDataChart/AxisLayer", "../../Layer/TooltipLayer", "../../MultiDataChart/LegendLayer", "../../MultiDataChart/LineChart/LineChart", "../../MultiDataChart/BarChart/BarChart"], function (require, exports, d3, Util_1, MultiDataChart_1, AxisLayer_1, TooltipLayer_1, LegendLayer_1, LineChart_1, BarChart_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var BarLineChart = (function (_super) {
        __extends(BarLineChart, _super);
        function BarLineChart(conf) {
            var _this = _super.call(this, conf) || this;
            _this.axisLayer = new AxisLayer_1.AxisLayer("axis", {
                style: {
                    width: function () { return _this.config.style.width; },
                    height: function () { return _this.config.style.height; }
                },
                axis: {
                    format: {
                        x: d3.timeFormat("%H:%M")
                    },
                    ticks: {
                        x: 6
                    }
                },
                type: "time"
            });
            _this.barLayer = new BarChart_1.BarLayer("bar", {
                style: {
                    top: _this.axisLayer.config.padding.top,
                    left: _this.axisLayer.config.padding.left,
                    width: Util_1.Util.toPixel(_this.config.style.width) - Util_1.Util.toPixel(_this.axisLayer.config.padding.left) - Util_1.Util.toPixel(_this.axisLayer.config.padding.right),
                    height: Util_1.Util.toPixel(_this.config.style.height) - Util_1.Util.toPixel(_this.axisLayer.config.padding.top) - Util_1.Util.toPixel(_this.axisLayer.config.padding.bottom)
                }
            });
            _this.lineLayer = new LineChart_1.LineLayer("line", {
                style: {
                    top: function () { return Util_1.Util.toPixel(_this.axisLayer.config.padding.top) - _this.axisLayer.config.borderPadding; },
                    left: function () { return Util_1.Util.toPixel(_this.axisLayer.config.padding.left) - _this.axisLayer.config.borderPadding; },
                    width: function () { return Util_1.Util.toPixel(_this.config.style.width) - Util_1.Util.toPixel(_this.axisLayer.config.padding.left) - Util_1.Util.toPixel(_this.axisLayer.config.padding.right) + _this.axisLayer.config.borderPadding * 2; },
                    height: function () { return Util_1.Util.toPixel(_this.config.style.height) - Util_1.Util.toPixel(_this.axisLayer.config.padding.top) - Util_1.Util.toPixel(_this.axisLayer.config.padding.bottom) + _this.axisLayer.config.borderPadding * 2; }
                }
            });
            _this.tooltipLayer = new TooltipLayer_1.TooltipLayer("tooltip", {
                style: {
                    top: function () { return Util_1.Util.toPixel(_this.axisLayer.config.padding.top) - _this.axisLayer.config.borderPadding; },
                    left: function () { return Util_1.Util.toPixel(_this.axisLayer.config.padding.left) - _this.axisLayer.config.borderPadding; },
                    width: function () { return Util_1.Util.toPixel(_this.config.style.width) - Util_1.Util.toPixel(_this.axisLayer.config.padding.left) - Util_1.Util.toPixel(_this.axisLayer.config.padding.right) + _this.axisLayer.config.borderPadding * 2; },
                    height: function () { return Util_1.Util.toPixel(_this.config.style.height) - Util_1.Util.toPixel(_this.axisLayer.config.padding.top) - Util_1.Util.toPixel(_this.axisLayer.config.padding.bottom) + _this.axisLayer.config.borderPadding * 2; }
                }
            });
            _this.legendLayer = new LegendLayer_1.LegendLayer("legend", {
                style: {
                    top: function () { return _this.axisLayer.config.style.height; },
                    left: function () { return _this.axisLayer.config.padding.left; },
                    width: function () { return Util_1.Util.toPixel(_this.axisLayer.config.style.width) - Util_1.Util.toPixel(_this.axisLayer.config.padding.left) - Util_1.Util.toPixel(_this.axisLayer.config.padding.right); }
                }
            });
            _this.axisLayer.addTo(_this);
            _this.barLayer.addTo(_this);
            _this.lineLayer.addTo(_this);
            _this.tooltipLayer.addTo(_this);
            _this.legendLayer.addTo(_this);
            return _this;
        }
        return BarLineChart;
    }(MultiDataChart_1.MultiDataChart));
    exports.BarLineChart = BarLineChart;
});

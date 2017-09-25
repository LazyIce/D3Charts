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
define(["require", "exports", "d3", "lodash", "../../../Core/Util", "../../MultiDataChart/MultiDataChart", "../../../Core/BaseLayer", "../../MultiDataChart/AxisLayer"], function (require, exports, d3, _, Util_1, MultiDataChart_1, BaseLayer_1, AxisLayer_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var RangeLayer = (function (_super) {
        __extends(RangeLayer, _super);
        function RangeLayer(id, conf) {
            var _this = _super.call(this, id, conf) || this;
            _this.on("addToChart", function () {
                _this.chart.on("style_change measure_change", function () {
                    _this.update();
                });
            });
            return _this;
        }
        RangeLayer.prototype.defaultConfig = function () {
            return Util_1.Util.deepExtend(_super.prototype.defaultConfig.call(this), {
                className: "rangeChart",
            });
        };
        RangeLayer.prototype.drawer = function (svgNode) {
            var ds = this.chart.getAllMeasure()[0];
            if (!ds) {
                return;
            }
            var maxY = this.chart.max("max"), minY = this.chart.min("min");
            var width = Util_1.Util.toPixel(this.config.style.width), height = Util_1.Util.toPixel(this.config.style.height);
            var xScale = d3.scaleTime()
                .domain(this.chart.getDomain("time"))
                .range([0, width]);
            var yScale = d3.scaleLinear()
                .domain([0, maxY])
                .range([height, 0]);
            var gradientColor = svgNode.append("defs").append("linearGradient").attr("id", "linearColor")
                .attr("x1", "0%").attr("y1", "0%")
                .attr("x2", "0%").attr("y2", "100%");
            gradientColor.append("stop").attr("offset", "0%").attr("style", "stop-color:steelblue;stop-opacity:1");
            gradientColor.append("stop").attr("offset", "100%").attr("style", "stop-color:aqua;stop-opacity:1");
            var area = d3.area()
                .x(function (d) { return xScale(d.time); })
                .y0(function (d) { return yScale(d.min); })
                .y1(function (d) { return yScale(d.max); });
            svgNode.append("g")
                .attr("class", "areaGroup")
                .append("path")
                .attr("class", "area")
                .attr("d", area(ds.data))
                .attr("fill", "url(#linearColor)");
            svgNode.append("line").attr("class", "focusLine")
                .attr("x1", xScale(d3.timeParse("%H")("12")))
                .attr("y1", height)
                .attr("x2", xScale(d3.timeParse("%H")("12")))
                .attr("y2", 0);
            this.chart.on("dragLine", function (d) {
                svgNode.select(".focusLine").attr("x1", xScale(d.time)).attr("x2", xScale(d.time));
            });
        };
        RangeLayer.prototype.render = function () {
            this.el.innerHTML = "";
            this.drawer(this.elD3);
            return this;
        };
        return RangeLayer;
    }(BaseLayer_1.BaseLayer));
    exports.RangeLayer = RangeLayer;
    var RangeChart = (function (_super) {
        __extends(RangeChart, _super);
        function RangeChart(conf) {
            var _this = _super.call(this, conf) || this;
            _this.axisLayer = new AxisLayer_1.AxisLayer("axis", {
                style: {
                    width: _this.config.style.width,
                    height: _this.config.style.height
                },
                axis: {
                    format: {
                        x: d3.timeFormat("%H:%M")
                    },
                    key: {
                        x: "time",
                        y: "max"
                    },
                    ticks: {
                        x: 24
                    }
                },
                type: "time",
                verticalGridLine: false
            });
            _this.rangeLayer = new RangeLayer("range", {
                style: {
                    top: _this.axisLayer.config.padding.top,
                    left: _this.axisLayer.config.padding.left,
                    width: Util_1.Util.toPixel(_this.config.style.width) - Util_1.Util.toPixel(_this.axisLayer.config.padding.left) - Util_1.Util.toPixel(_this.axisLayer.config.padding.right),
                    height: Util_1.Util.toPixel(_this.config.style.height) - Util_1.Util.toPixel(_this.axisLayer.config.padding.top) - Util_1.Util.toPixel(_this.axisLayer.config.padding.bottom)
                }
            });
            _this.axisLayer.addTo(_this);
            _this.rangeLayer.addTo(_this);
            return _this;
        }
        RangeChart.prototype.setConfig = function (c) {
            this.rangeLayer.setConfig(_.pick(c, "key"));
            this.axisLayer.setConfig(_.pick(c, "key"));
        };
        return RangeChart;
    }(MultiDataChart_1.MultiDataChart));
    exports.RangeChart = RangeChart;
});

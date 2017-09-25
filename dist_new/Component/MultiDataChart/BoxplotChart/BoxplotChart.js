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
define(["require", "exports", "d3", "lodash", "../../../Core/Util", "../../MultiDataChart/MultiDataChart", "../../../Core/BaseLayer"], function (require, exports, d3, _, Util_1, MultiDataChart_1, BaseLayer_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var BoxplotLayer = (function (_super) {
        __extends(BoxplotLayer, _super);
        function BoxplotLayer(id, conf) {
            var _this = _super.call(this, id, conf) || this;
            _this.on("addToChart", function () {
                _this.chart.on("style_change measure_change", function () {
                    _this.update();
                });
            });
            return _this;
        }
        BoxplotLayer.prototype.defaultConfig = function () {
            return Util_1.Util.deepExtend(_super.prototype.defaultConfig.call(this), {
                className: "boxplotChart",
                boxPadding: {
                    top: 20,
                    right: 50,
                    bottom: 20,
                    left: 50
                },
                rectWidth: 20
            });
        };
        BoxplotLayer.prototype.processData = function (data) {
            var sortedData = _.sortBy(data, function (num) { return num; });
            var len = sortedData.length;
            var min = sortedData[0], max = sortedData[len - 1];
            var lowerQuartile, median, largerQuartile;
            var getMeadian = function (ds) {
                if (ds.length % 2 == 0) {
                    return (ds[ds.length / 2 - 1] + ds[ds.length / 2]) / 2;
                }
                else {
                    return ds[(ds.length - 1) / 2];
                }
            };
            if (len % 2 == 0) {
                lowerQuartile = getMeadian(sortedData.slice(0, len / 2));
                largerQuartile = getMeadian(sortedData.slice(len / 2));
            }
            else {
                lowerQuartile = getMeadian(sortedData.slice(0, (len - 1) / 2));
                largerQuartile = getMeadian(sortedData.slice((len - 1) / 2 + 2));
            }
            median = getMeadian(sortedData);
            return { min: min, lowerQuartile: lowerQuartile, median: median, largerQuartile: largerQuartile, max: max };
        };
        BoxplotLayer.prototype.drawer = function (svgNode) {
            var _this = this;
            var self = this;
            var ds = this.chart.getMeasure("boxplot");
            if (!ds || typeof (ds) == undefined || ds.length == 0) {
                return;
            }
            var processDs = [], min = Infinity, max = -Infinity;
            _.each(ds, function (d) {
                var newData = _this.processData(d.data);
                min = min > newData.min ? newData.min : min;
                max = max < newData.max ? newData.max : max;
                processDs.push({ id: d.id, data: newData, type: d.type });
            });
            var xScale = d3.scaleBand()
                .domain(_.range(processDs.length).map(function (d) { return d.toString(); }))
                .rangeRound([0, Util_1.Util.toPixel(this.config.style.width)])
                .paddingInner(0.1).paddingOuter(0.5);
            var yScale = d3.scaleLinear()
                .domain([min, max])
                .range([this.config.boxPadding.top, Util_1.Util.toPixel(this.config.style.height) - this.config.boxPadding.bottom]);
            _.each(processDs, function (d, i) {
                var box = svgNode.append("g").classed("box box" + i, true);
                box.append("line").classed("centerLine", true)
                    .attr("x1", xScale(i.toString()))
                    .attr("y1", yScale(d.data.min))
                    .attr("x2", xScale(i.toString()))
                    .attr("y2", yScale(d.data.max));
                box.append("rect").classed("boxRect", true)
                    .attr("x", xScale(i.toString()) - _this.config.rectWidth / 2)
                    .attr("y", yScale(d.data.lowerQuartile))
                    .attr("width", _this.config.rectWidth)
                    .attr("height", yScale(d.data.largerQuartile) - yScale(d.data.lowerQuartile));
                box.append("line").classed("minLine", true)
                    .attr("x1", xScale(i.toString()) - _this.config.rectWidth / 2)
                    .attr("y1", yScale(d.data.min))
                    .attr("x2", xScale(i.toString()) + _this.config.rectWidth / 2)
                    .attr("y2", yScale(d.data.min));
                box.append("line").classed("maxLine", true)
                    .attr("x1", xScale(i.toString()) - _this.config.rectWidth / 2)
                    .attr("y1", yScale(d.data.max))
                    .attr("x2", xScale(i.toString()) + _this.config.rectWidth / 2)
                    .attr("y2", yScale(d.data.max));
                box.append("line").classed("medianLine", true)
                    .attr("x1", xScale(i.toString()) - _this.config.rectWidth / 2)
                    .attr("y1", yScale(d.data.median))
                    .attr("x2", xScale(i.toString()) + _this.config.rectWidth / 2)
                    .attr("y2", yScale(d.data.median));
                box.append("text").classed("rightText", true)
                    .text(d.data.min)
                    .attr("x", xScale(i.toString()) + _this.config.rectWidth / 2)
                    .attr("y", yScale(d.data.min))
                    .attr("dx", 5);
                box.append("text").classed("rightText", true)
                    .text(d.data.median)
                    .attr("x", xScale(i.toString()) + _this.config.rectWidth / 2)
                    .attr("y", yScale(d.data.median))
                    .attr("dx", 5);
                box.append("text").classed("rightText", true)
                    .text(d.data.max)
                    .attr("x", xScale(i.toString()) + _this.config.rectWidth / 2)
                    .attr("y", yScale(d.data.max))
                    .attr("dx", 5);
                box.append("text").classed("leftText", true)
                    .text(d.data.lowerQuartile)
                    .attr("x", xScale(i.toString()) - _this.config.rectWidth / 2)
                    .attr("y", yScale(d.data.lowerQuartile))
                    .attr("dx", -5);
                box.append("text").classed("leftText", true)
                    .text(d.data.largerQuartile)
                    .attr("x", xScale(i.toString()) - _this.config.rectWidth / 2)
                    .attr("y", yScale(d.data.largerQuartile))
                    .attr("dx", -5);
            });
            return this;
        };
        BoxplotLayer.prototype.render = function () {
            this.el.innerHTML = "";
            this.drawer(this.elD3);
            return this;
        };
        return BoxplotLayer;
    }(BaseLayer_1.BaseLayer));
    exports.BoxplotLayer = BoxplotLayer;
    var BoxplotChart = (function (_super) {
        __extends(BoxplotChart, _super);
        function BoxplotChart(conf) {
            var _this = _super.call(this, conf) || this;
            _this.boxplotLayer = new BoxplotLayer("boxplot", {
                style: {
                    width: function () { return Util_1.Util.toPixel(_this.config.style.width); },
                    height: function () { return Util_1.Util.toPixel(_this.config.style.height); }
                }
            });
            _this.boxplotLayer.addTo(_this);
            return _this;
        }
        BoxplotChart.prototype.setConfig = function (c) {
            this.boxplotLayer.setConfig(_.pick(c, "key"));
        };
        return BoxplotChart;
    }(MultiDataChart_1.MultiDataChart));
    exports.BoxplotChart = BoxplotChart;
});

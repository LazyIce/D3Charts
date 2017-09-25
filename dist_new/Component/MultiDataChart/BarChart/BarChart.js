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
define(["require", "exports", "d3", "lodash", "../../../Core/Util", "../../MultiDataChart/MultiDataChart", "../../../Core/BaseLayer", "../../MultiDataChart/AxisLayer", "../../Layer/TooltipLayer", "../../MultiDataChart/LegendLayer", "../../../Component/Layer/TitleLayer"], function (require, exports, d3, _, Util_1, MultiDataChart_1, BaseLayer_1, AxisLayer_1, TooltipLayer_1, LegendLayer_1, TitleLayer_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var BarLayer = (function (_super) {
        __extends(BarLayer, _super);
        function BarLayer(id, conf) {
            var _this = _super.call(this, id, conf) || this;
            _this.on("addToChart", function () {
                _this.chart.on("style_change measure_change", function () {
                    _this.update();
                });
            });
            return _this;
        }
        BarLayer.prototype.defaultConfig = function () {
            return Util_1.Util.deepExtend(_super.prototype.defaultConfig.call(this), { className: "barChart" });
        };
        BarLayer.prototype.drawer = function (svgNode) {
            var _this = this;
            var self = this;
            var ds = this.chart.getMeasure("bar");
            if (!ds || typeof (ds) == undefined || ds.length == 0) {
                return;
            }
            var xMarks = ds[0].data.length;
            var series = ds.length;
            var maxY = this.chart.max("y");
            var xScale = d3.scaleBand()
                .domain(_.range(xMarks).map(function (d) { return d.toString(); }))
                .rangeRound([0, Util_1.Util.toPixel(this.config.style.width)])
                .paddingInner(0.1).paddingOuter(0.2);
            var seriesScale = d3.scaleBand()
                .domain(_.range(series).map(function (d) { return d.toString(); }))
                .rangeRound([0, xScale.bandwidth()]);
            var yScale = d3.scaleLinear()
                .domain([0, maxY])
                .range([0, Util_1.Util.toPixel(this.config.style.height)]);
            _.each(ds, function (d, i) {
                var group = svgNode.append("g")
                    .attr("class", "barSeries")
                    .attr("id", "barSeries" + i)
                    .attr("transform", "translate(" + (i * seriesScale.bandwidth()) + ",0)");
                _.each(d.data, function (v, k) {
                    group.append("rect")
                        .attr("class", "rect" + k)
                        .attr("x", xScale(k.toString()))
                        .attr("y", Util_1.Util.toPixel(_this.config.style.height))
                        .attr("width", seriesScale.bandwidth())
                        .attr("height", yScale(v.y))
                        .attr("fill", _this.chart.getColor(d.id))
                        .on("mouseenter", function () {
                        self.chart.fire("showSingleTooltip", { xMark: v.x, series: d.id, value: v.y });
                    })
                        .on("mousemove", function () {
                        self.chart.fire("moveTooltip");
                    })
                        .on("mouseleave", function () {
                        self.chart.fire("hideTooltip");
                    })
                        .transition().duration(1000)
                        .attr("y", Util_1.Util.toPixel(_this.config.style.height) - yScale(v.y));
                });
            });
            return this;
        };
        BarLayer.prototype.render = function () {
            this.el.innerHTML = "";
            this.drawer(this.elD3);
            return this;
        };
        return BarLayer;
    }(BaseLayer_1.BaseLayer));
    exports.BarLayer = BarLayer;
    var BarChart = (function (_super) {
        __extends(BarChart, _super);
        function BarChart(conf) {
            var _this = _super.call(this, conf) || this;
            _this.chartTitleLayer = new TitleLayer_1.TitleLayer("chartTitle", {
                className: "chartTitle",
                style: {
                    width: function () { return _this.config.style.width; },
                },
                value: "Bar Chart"
            });
            _this.axisLayer = new AxisLayer_1.AxisLayer("axis", {
                style: {
                    top: function () { return _this.config.chartTitle.style.height; },
                    width: function () { return _this.config.style.width; },
                    height: function () { return Util_1.Util.toPixel(_this.config.style.height) - Util_1.Util.toPixel(_this.config.legend.style.height) - Util_1.Util.toPixel(_this.config.chartTitle.style.height); }
                },
                type: "ordinal",
                verticalGridLine: false
            });
            _this.barLayer = new BarLayer("bar", {
                style: {
                    top: function () { return Util_1.Util.toPixel(_this.config.axis.padding.top) + Util_1.Util.toPixel(_this.config.chartTitle.style.height); },
                    left: function () { return Util_1.Util.toPixel(_this.config.axis.padding.left); },
                    width: function () { return Util_1.Util.toPixel(_this.config.style.width) - Util_1.Util.toPixel(_this.config.axis.padding.left) - Util_1.Util.toPixel(_this.config.axis.padding.right); },
                    height: function () { return Util_1.Util.toPixel(_this.config.style.height) - Util_1.Util.toPixel(_this.config.axis.padding.top) - Util_1.Util.toPixel(_this.config.axis.padding.bottom) - Util_1.Util.toPixel(_this.config.legend.style.height) - Util_1.Util.toPixel(_this.config.chartTitle.style.height); }
                }
            });
            _this.tooltipLayer = new TooltipLayer_1.TooltipLayer("tooltip", {
                style: {
                    top: function () { return Util_1.Util.toPixel(_this.config.axis.padding.top) + Util_1.Util.toPixel(_this.config.chartTitle.style.height); },
                    left: function () { return Util_1.Util.toPixel(_this.config.axis.padding.left); },
                    width: function () { return Util_1.Util.toPixel(_this.config.style.width) - Util_1.Util.toPixel(_this.config.axis.padding.left) - Util_1.Util.toPixel(_this.config.axis.padding.right); },
                    height: function () { return Util_1.Util.toPixel(_this.config.style.height) - Util_1.Util.toPixel(_this.config.axis.padding.top) - Util_1.Util.toPixel(_this.config.axis.padding.bottom) - Util_1.Util.toPixel(_this.config.legend.style.height) - Util_1.Util.toPixel(_this.config.chartTitle.style.height); }
                }
            });
            _this.legendLayer = new LegendLayer_1.LegendLayer("legend", {
                style: {
                    top: function () { return Util_1.Util.toPixel(_this.config.style.height) - Util_1.Util.toPixel(_this.config.legend.style.height); },
                    left: function () { return _this.config.axis.padding.left; },
                    width: function () { return Util_1.Util.toPixel(_this.config.style.width) - Util_1.Util.toPixel(_this.config.axis.padding.left) - Util_1.Util.toPixel(_this.config.axis.padding.right); }
                }
            });
            _this.chartTitleLayer.addTo(_this);
            _this.axisLayer.addTo(_this);
            _this.barLayer.addTo(_this);
            _this.tooltipLayer.addTo(_this);
            _this.legendLayer.addTo(_this);
            return _this;
        }
        BarChart.prototype.defaultConfig = function () {
            return {
                className: "chart",
                style: {
                    width: "40rem",
                    height: "30rem",
                    position: "relative"
                },
                el: null,
                bar: {},
                axis: {
                    style: {
                        width: "40rem",
                        height: "30rem"
                    },
                    borderPadding: 6,
                    padding: {
                        top: "10px",
                        right: "20px",
                        bottom: "40px",
                        left: "50px"
                    }
                },
                tooltip: {
                    style: {
                        width: "40rem",
                        height: "30rem"
                    }
                },
                legend: {
                    style: {
                        width: "40rem",
                        height: "2rem"
                    }
                },
                chartTitle: {
                    style: {
                        width: "40rem",
                        height: "2rem",
                    }
                }
            };
        };
        BarChart.prototype.setConfig = function (c) {
            this.barLayer.setConfig(_.toArray(_.pick(c, "bar")));
            this.axisLayer.setConfig(_.toArray(_.pick(c, "axis")));
            this.legendLayer.setConfig(_.toArray(_.pick(c, "legend")));
            this.tooltipLayer.setConfig(_.toArray(_.pick(c, "tooltip")));
            this.chartTitleLayer.setConfig(_.toArray(_.pick(c, "chartTitle")));
        };
        return BarChart;
    }(MultiDataChart_1.MultiDataChart));
    exports.BarChart = BarChart;
});

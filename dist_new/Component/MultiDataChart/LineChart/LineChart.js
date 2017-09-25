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
    var LineLayer = (function (_super) {
        __extends(LineLayer, _super);
        function LineLayer(id, conf) {
            var _this = _super.call(this, id, conf) || this;
            _this.curveTypeMap = {
                linear: d3.curveLinear,
                basis: d3.curveBasis,
                cardinal: d3.curveCardinal,
                step: d3.curveStep
            };
            _this.on("addToChart", function () {
                _this.chart.on("style_change measure_change", function () {
                    _this.update();
                });
            });
            return _this;
        }
        LineLayer.prototype.defaultConfig = function () {
            return Util_1.Util.deepExtend(_super.prototype.defaultConfig.call(this), {
                className: "lineChart",
                borderPadding: 6,
                curveType: "linear",
                hasDot: true,
                hasArea: false,
                hasTooltip: true,
                hasTimeAdjust: true,
                yAxisTitleType: "time"
            });
        };
        LineLayer.prototype.getScale = function () {
            var ds = this.chart.getMeasure("line");
            if (!ds || typeof (ds) == undefined || ds.length == 0 || !ds[0].data || ds[0].data.length == 0) {
                return;
            }
            var maxX = this.chart.max("x"), minX = this.chart.min("x"), maxY = this.chart.max("y");
            var width = Util_1.Util.toPixel(this.config.style.width), height = Util_1.Util.toPixel(this.config.style.height);
            var xScale;
            if (typeof (ds[0].data[0].x) == "string") {
                xScale = d3.scaleTime()
                    .domain([minX, maxX])
                    .range([this.config.borderPadding, width - this.config.borderPadding]);
            }
            else {
                xScale = d3.scaleLinear()
                    .domain([minX, maxX])
                    .range([this.config.borderPadding, width - this.config.borderPadding]);
            }
            ds = this.chart.getMeasure("line");
            var yScale = d3.scaleLinear()
                .domain([0, maxY * 1.1])
                .range([height - this.config.borderPadding, this.config.borderPadding]);
            return { xScale: xScale, yScale: yScale };
        };
        LineLayer.prototype.drawer = function (svgNode) {
            var _this = this;
            var self = this;
            var ds = this.chart.getMeasure("line");
            if (!ds || typeof (ds) == undefined || ds.length == 0 || !ds[0].data || ds[0].data.length == 0) {
                return;
            }
            var series = ds.length;
            var maxX = this.chart.max("x"), minX = this.chart.min("x"), maxY = this.chart.max("y");
            var width = Util_1.Util.toPixel(this.config.style.width), height = Util_1.Util.toPixel(this.config.style.height);
            var xScale = this.getScale().xScale, yScale = this.getScale().yScale;
            var line = d3.line()
                .x(function (v) { return xScale(v.x); })
                .y(function (v) { return yScale(v.y); })
                .curve(this.curveTypeMap[this.config.curveType]);
            _.each(ds, function (d, i) {
                var group = svgNode.append("svg:g")
                    .attr("class", "lineSeries")
                    .attr("id", "lineSeries" + i);
                group.append("path")
                    .attr("class", "line" + i)
                    .attr("d", line(d.data))
                    .attr("stroke", _this.chart.getColor(d.id));
                if (_this.config.hasDot) {
                    _.each(d.data, function (v, k) {
                        group.append("circle")
                            .attr("class", "circle" + i + k)
                            .attr("cx", xScale(v.x))
                            .attr("cy", yScale(v.y))
                            .attr("r", "4")
                            .attr("fill", _this.chart.getColor(d.id));
                    });
                }
                if (_this.config.hasArea) {
                    var area = d3.area()
                        .x(function (d) { return xScale(d.x); })
                        .y0(Util_1.Util.toPixel(_this.config.style.height))
                        .y1(function (d) { return yScale(d.y); });
                    group.append("g")
                        .attr("class", "lineArea")
                        .append("path")
                        .attr("d", area(d.data))
                        .attr("fill", _this.chart.getColor(d.id));
                }
            });
            if (this.config.hasTooltip) {
                var allRect_1 = [], allRectX_1 = [], allRectInterval = [];
                _.each(ds, function (d, i) {
                    allRectX_1 = _.union(allRectX_1, _.map(d.data, "x"));
                });
                allRectX_1 = allRectX_1.sort(function (a, b) {
                    return a > b ? 1 : -1;
                });
                var re = [allRectX_1[0]];
                for (var i = 1; i < allRectX_1.length; i++) {
                    if (allRectX_1[i].toString() != allRectX_1[i - 1].toString())
                        re.push(allRectX_1[i]);
                }
                allRectX_1 = re;
                for (var i = 1; i < allRectX_1.length; i++) {
                    allRectInterval.push(allRectX_1[i] - allRectX_1[i - 1]);
                }
                var rectWidth_1 = ((_.min(allRectInterval)) / (maxX - minX)) * (width - this.config.borderPadding) / 3 * 2;
                _.each(allRectX_1, function (x) {
                    var data = [];
                    _.each(ds, function (d) {
                        var value = _.filter(d.data, function (dd) { return dd.x.toString() == x.toString(); })[0];
                        if (value != undefined) {
                            if (_this.config.yAxisTitleType == "time") {
                                data.push({ id: d.id, value: d3.format(".1f")(value.y) + "s" });
                            }
                            else if (_this.config.yAxisTitleType == "speed") {
                                data.push({ id: d.id, value: d3.format(".1f")(value.y) + "km/h" });
                            }
                        }
                    });
                    allRect_1.push({ xMark: x, data: data });
                });
                var focusLine_1 = svgNode.append("line").attr("class", "focusLine");
                var overlay_1 = svgNode.append("g").attr("class", "overlay");
                _.each(allRect_1, function (d, i) {
                    overlay_1.append("rect")
                        .attr("class", "eventRect" + i)
                        .attr("x", xScale(d.xMark) - rectWidth_1 / 2)
                        .attr("y", _this.config.borderPadding)
                        .attr("width", rectWidth_1)
                        .attr("height", height - _this.config.borderPadding * 2)
                        .on("mouseenter", function () {
                        focusLine_1.style("display", null);
                        self.chart.fire("showGroupTooltip", { xMark: d3.timeFormat("%H:%M")(d.xMark), data: d.data });
                    })
                        .on("mousemove", function () {
                        focusLine_1.attr("x1", xScale(d.xMark))
                            .attr("y1", self.config.borderPadding)
                            .attr("x2", xScale(d.xMark))
                            .attr("y2", height - self.config.borderPadding);
                        self.chart.fire("moveTooltip");
                    })
                        .on("mouseleave", function () {
                        focusLine_1.style("display", "none");
                        self.chart.fire("hideTooltip");
                    });
                });
            }
            if (this.config.hasTimeAdjust) {
                var adjustLine = svgNode.append("line")
                    .attr("class", "adjustLine")
                    .attr("x1", xScale(minX))
                    .attr("y1", this.config.borderPadding)
                    .attr("x2", xScale(minX))
                    .attr("y2", height - self.config.borderPadding);
            }
            return this;
        };
        LineLayer.prototype.setTime = function (time) {
            var xScale = this.getScale().xScale;
            if (typeof (time) == "string") {
                time = new Date(time);
            }
            d3.select(".adjustLine")
                .attr("x1", xScale(time))
                .attr("x2", xScale(time));
        };
        LineLayer.prototype.render = function () {
            this.el.innerHTML = "";
            this.drawer(this.elD3);
            return this;
        };
        return LineLayer;
    }(BaseLayer_1.BaseLayer));
    exports.LineLayer = LineLayer;
    var LineChart = (function (_super) {
        __extends(LineChart, _super);
        function LineChart(conf) {
            var _this = _super.call(this, conf) || this;
            _this.chartTitleLayer = new TitleLayer_1.TitleLayer("chartTitle", {
                className: "chartTitle",
                style: {
                    width: function () { return _this.config.style.width; },
                },
                value: "Line Chart"
            });
            _this.chartTitleLayer.addTo(_this);
            _this.axisLayer = new AxisLayer_1.AxisLayer("axis", {
                style: {
                    top: function () { return _this.config.chartTitle.style.height; },
                    width: function () { return _this.config.style.width; },
                    height: function () { return Util_1.Util.toPixel(_this.config.style.height) - Util_1.Util.toPixel(_this.config.legend.style.height) - Util_1.Util.toPixel(_this.config.chartTitle.style.height); }
                },
                axis: {
                    format: {
                        x: d3.timeFormat("%H:%M")
                    }
                },
                type: "time"
            });
            _this.axisLayer.addTo(_this);
            _this.lineLayer = new LineLayer("line", {
                style: {
                    top: function () { return Util_1.Util.toPixel(_this.config.axis.padding.top) - _this.config.axis.borderPadding + Util_1.Util.toPixel(_this.config.chartTitle.style.height); },
                    left: function () { return Util_1.Util.toPixel(_this.config.axis.padding.left) - _this.config.axis.borderPadding; },
                    width: function () { return Util_1.Util.toPixel(_this.config.style.width) - Util_1.Util.toPixel(_this.config.axis.padding.left) - Util_1.Util.toPixel(_this.config.axis.padding.right) + _this.config.axis.borderPadding * 2; },
                    height: function () { return Util_1.Util.toPixel(_this.config.style.height) - Util_1.Util.toPixel(_this.config.axis.padding.top) - Util_1.Util.toPixel(_this.config.axis.padding.bottom) - Util_1.Util.toPixel(_this.config.legend.style.height) - Util_1.Util.toPixel(_this.config.chartTitle.style.height) + _this.config.axis.borderPadding * 2; }
                }
            });
            _this.lineLayer.addTo(_this);
            if (_this.config.line.hasTooltip) {
                _this.tooltipLayer = new TooltipLayer_1.TooltipLayer("tooltip", {
                    style: {
                        top: function () { return Util_1.Util.toPixel(_this.config.axis.padding.top) - _this.config.axis.borderPadding + Util_1.Util.toPixel(_this.config.chartTitle.style.height); },
                        left: function () { return Util_1.Util.toPixel(_this.config.axis.padding.left) - _this.config.axis.borderPadding; },
                        width: function () { return Util_1.Util.toPixel(_this.config.style.width) - Util_1.Util.toPixel(_this.config.axis.padding.left) - Util_1.Util.toPixel(_this.config.axis.padding.right) + _this.config.axis.borderPadding * 2; },
                        height: function () { return Util_1.Util.toPixel(_this.config.style.height) - Util_1.Util.toPixel(_this.config.axis.padding.top) - Util_1.Util.toPixel(_this.config.axis.padding.bottom) - Util_1.Util.toPixel(_this.config.legend.style.height) - Util_1.Util.toPixel(_this.config.chartTitle.style.height) + _this.config.axis.borderPadding * 2; }
                    }
                });
                _this.tooltipLayer.addTo(_this);
            }
            _this.legendLayer = new LegendLayer_1.LegendLayer("legend", {
                style: {
                    top: function () { return Util_1.Util.toPixel(_this.config.style.height) - Util_1.Util.toPixel(_this.config.legend.style.height); },
                    left: function () { return _this.config.axis.padding.left; },
                    width: function () { return Util_1.Util.toPixel(_this.config.style.width) - Util_1.Util.toPixel(_this.config.axis.padding.left) - Util_1.Util.toPixel(_this.config.axis.padding.right); }
                }
            });
            _this.legendLayer.addTo(_this);
            return _this;
        }
        LineChart.prototype.defaultConfig = function () {
            return {
                className: "chart",
                style: {
                    width: "40rem",
                    height: "30rem",
                    position: "relative"
                },
                el: null,
                line: {
                    borderPadding: 6,
                    curveType: "linear",
                    hasDot: true,
                    hasArea: false,
                    hasTooltip: true,
                    hasTimeAdjust: true,
                    yAxisTitleType: "time"
                },
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
        LineChart.prototype.setConfig = function (c) {
            this.lineLayer.setConfig(_.toArray(_.pick(c, "line")));
            this.axisLayer.setConfig(_.toArray(_.pick(c, "axis")));
            this.legendLayer.setConfig(_.toArray(_.pick(c, "legend")));
            this.tooltipLayer.setConfig(_.toArray(_.pick(c, "tooltip")));
            this.chartTitleLayer.setConfig(_.toArray(_.pick(c, "chartTitle")));
        };
        LineChart.prototype.setTimeAdjust = function (time) {
            this.lineLayer.setTime(time);
        };
        return LineChart;
    }(MultiDataChart_1.MultiDataChart));
    exports.LineChart = LineChart;
});

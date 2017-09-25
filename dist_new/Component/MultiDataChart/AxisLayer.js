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
define(["require", "exports", "d3", "lodash", "../../Core/Util", "../../Core/BaseLayer"], function (require, exports, d3, _, Util_1, BaseLayer_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var AxisLayer = (function (_super) {
        __extends(AxisLayer, _super);
        function AxisLayer(id, conf) {
            var _this = _super.call(this, id, conf) || this;
            _this.on("addToChart", function () {
                _this.chart.on("style_change measure_change", function () {
                    _this.update();
                });
            });
            return _this;
        }
        AxisLayer.prototype.defaultConfig = function () {
            return Util_1.Util.deepExtend(_super.prototype.defaultConfig.call(this), {
                className: "axis",
                axis: {
                    format: { x: null, y: null },
                    key: { x: "x", y: "y" },
                    ticks: { x: null, y: null },
                },
                borderPadding: 6,
                padding: {
                    top: "10px",
                    right: "20px",
                    bottom: "40px",
                    left: "50px"
                },
                type: "line",
                verticalGridLine: false,
                horizontalGridLine: true,
                yAxisTitleType: "time"
            });
        };
        AxisLayer.prototype.render = function () {
            this.el.innerHTML = "";
            if (this.chart.measures.length != 0) {
                var maxX = this.chart.max(this.config.axis.key.x), maxY = this.chart.max(this.config.axis.key.y);
                var xScale = void 0, yScale = d3.scaleLinear()
                    .domain([0, maxY])
                    .range([(Util_1.Util.toPixel(this.config.style.height) - Util_1.Util.toPixel(this.config.padding.bottom)),
                    Util_1.Util.toPixel(this.config.padding.top)]);
                if (this.config.type == "line") {
                    xScale = d3.scaleLinear()
                        .domain([0, this.chart.max(this.config.axis.key.x)])
                        .range([Util_1.Util.toPixel(this.config.padding.left),
                        (Util_1.Util.toPixel(this.config.style.width) - Util_1.Util.toPixel(this.config.padding.right))]);
                }
                else if (this.config.type == "ordinal") {
                    var domain_1 = [], ds = this.chart.measures[0].data;
                    _.each(ds, function (d, i) {
                        domain_1.push(d.x);
                    });
                    xScale = d3.scaleBand()
                        .domain(domain_1)
                        .range([Util_1.Util.toPixel(this.config.padding.left),
                        Util_1.Util.toPixel(this.config.style.width) - Util_1.Util.toPixel(this.config.padding.right)])
                        .paddingInner(0.1)
                        .paddingOuter(0.2);
                }
                else if (this.config.type == "time") {
                    xScale = d3.scaleTime()
                        .domain([this.chart.min(this.config.axis.key.x), (this.chart.max(this.config.axis.key.x))])
                        .range([Util_1.Util.toPixel(this.config.padding.left),
                        Util_1.Util.toPixel(this.config.style.width) - Util_1.Util.toPixel(this.config.padding.right)]);
                }
                if (this.config.verticalGridLine) {
                    var xGridLine = d3.axisBottom(xScale)
                        .tickSize(Util_1.Util.toPixel(this.config.style.height) - Util_1.Util.toPixel(this.config.padding.top) - Util_1.Util.toPixel(this.config.padding.bottom))
                        .tickFormat(function (d, i) { return ""; });
                    this.elD3.append("g")
                        .call(xGridLine)
                        .attr("transform", "translate(0, " + Util_1.Util.toPixel(this.config.padding.top) + ")")
                        .attr("class", "grid-line");
                }
                if (this.config.horizontalGridLine) {
                    var yGridLine = d3.axisLeft(yScale)
                        .tickSize(Util_1.Util.toPixel(this.config.style.width) - Util_1.Util.toPixel(this.config.padding.left) - Util_1.Util.toPixel(this.config.padding.right))
                        .tickFormat(function (d, i) { return ""; });
                    this.elD3.append("g")
                        .call(yGridLine)
                        .attr("transform", "translate(" + (Util_1.Util.toPixel(this.config.style.width) - Util_1.Util.toPixel(this.config.padding.right)) + ", 0)")
                        .attr("class", "grid-line");
                }
                var xAxis = d3.axisBottom(xScale)
                    .tickFormat(this.config.axis.format.x)
                    .ticks(this.config.axis.ticks.x);
                this.elD3.append("g")
                    .classed("xAxis axis", true)
                    .call(xAxis)
                    .attr("transform", "translate(0," + (Util_1.Util.toPixel(this.config.style.height) - Util_1.Util.toPixel(this.config.padding.bottom)) + ")");
                var yAxisTitle = void 0, yAxisTickFormat = void 0;
                if (this.config.yAxisTitleType == "time") {
                    if (maxY <= 60) {
                        yAxisTitle = "seconds";
                        yAxisTickFormat = function (d) {
                            return d.toString();
                        };
                    }
                    else if (maxY <= 3600) {
                        yAxisTitle = "minutes";
                        yAxisTickFormat = function (d) {
                            return d3.format(".1f")(d / 60);
                        };
                    }
                    else {
                        yAxisTitle = "hours";
                        yAxisTickFormat = function (d) {
                            return d3.format(".1f")(d / 3600);
                        };
                    }
                }
                else if (this.config.yAxisTitleType == "speed") {
                    yAxisTitle = "km/h";
                    yAxisTickFormat = function (d) {
                        return d3.format(".1f")(d);
                    };
                }
                var yAxis = d3.axisLeft(yScale)
                    .ticks(this.config.axis.ticks.y)
                    .tickFormat(yAxisTickFormat);
                this.elD3.append("g")
                    .classed("yAxis axis", true)
                    .call(yAxis)
                    .attr("transform", "translate(" + Util_1.Util.toPixel(this.config.padding.left) + ",0)");
                this.elD3.append("text")
                    .classed("yAxisTitle", true)
                    .attr("x", -70)
                    .attr("y", 0)
                    .attr("transform", "rotate(-90)")
                    .attr("alignment-baseline", "hanging")
                    .text(yAxisTitle);
            }
            return this;
        };
        return AxisLayer;
    }(BaseLayer_1.BaseLayer));
    exports.AxisLayer = AxisLayer;
});

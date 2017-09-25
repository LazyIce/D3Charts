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
    var HeatLayer = (function (_super) {
        __extends(HeatLayer, _super);
        function HeatLayer(id, conf) {
            var _this = _super.call(this, id, conf) || this;
            _this.on("addToChart", function () {
                _this.chart.on("style_change measure_change", function () {
                    _this.update();
                });
            });
            return _this;
        }
        HeatLayer.prototype.defaultConfig = function () {
            return {
                tagName: "svg",
                className: "heatChart",
                style: {
                    top: "0px",
                    left: "0px",
                    bottom: null,
                    right: null,
                    position: "absolute",
                    zindex: 0,
                    width: "400rem",
                    height: "200rem"
                },
                heatBar: {
                    width: "50px",
                    maxHeat: 50
                },
                heatPadding: {
                    top: 10,
                    right: 20,
                    bottom: 50,
                    left: 50
                }
            };
        };
        HeatLayer.prototype.drawer = function (svgNode) {
            var self = this;
            var ds = this.chart.getMeasure("heat");
            if (!ds || typeof (ds) == undefined || ds.length == 0) {
                return;
            }
            var xMarks = ds[0].data.length, yMarks = ds.length;
            var width = Util_1.Util.toPixel(this.config.style.width), height = Util_1.Util.toPixel(this.config.style.height), topPadding = this.config.heatPadding.top, rightPadding = this.config.heatPadding.right, bottomPadding = this.config.heatPadding.bottom, leftPadding = this.config.heatPadding.left, barWidth = Util_1.Util.toPixel(this.config.heatBar.width), barHeight = height - bottomPadding - topPadding, maxHeat = this.config.heatBar.maxHeat, triangleSide = 8, barSegment = 5;
            var xScale = d3.scaleBand()
                .domain(_.range(xMarks).map(function (d) { return d.toString(); }))
                .rangeRound([leftPadding, width - rightPadding - barWidth]);
            var yScale = d3.scaleBand()
                .domain(_.range(yMarks).map(function (d) { return d.toString(); }))
                .rangeRound([topPadding, height - bottomPadding]);
            var barScale = d3.scaleLinear()
                .domain([0, maxHeat])
                .range([topPadding, height - bottomPadding]);
            var color = d3.interpolate("white", "lightblue");
            var rectGroup = svgNode.append("g").classed("rectGroup", true), textGroup = svgNode.append("g").classed("textGroup", true), heatBar = svgNode.append("g").classed("heatBar", true);
            _.each(ds, function (d, i) {
                textGroup.append("text").classed("heatYText", true)
                    .text(d.id)
                    .attr("x", 0)
                    .attr("y", xScale(i.toString()));
                _.each(d.data, function (v, k) {
                    rectGroup.append("rect").classed("heatRect", true)
                        .attr("x", xScale(k.toString()))
                        .attr("y", yScale(i.toString()))
                        .attr("width", xScale.bandwidth())
                        .attr("height", yScale.bandwidth())
                        .attr("fill", color(v.value / maxHeat))
                        .on("mouseover", function () {
                        heatBar.append("path").classed("heatBarTriangle", true)
                            .attr("d", "M" + (width - barWidth - triangleSide) + " " + (barScale(v.value) - triangleSide) + " L" + (width - barWidth - triangleSide) + " " + (barScale(v.value) + triangleSide) + " L" + (width - barWidth) + " " + barScale(v.value) + " Z");
                    })
                        .on("mouseout", function () {
                        svgNode.select(".heatBarTriangle").remove();
                    });
                    rectGroup.append("text").classed("heatRectText", true)
                        .text(v.value)
                        .attr("x", xScale(k.toString()))
                        .attr("y", yScale(i.toString()))
                        .attr("dx", xScale.bandwidth() / 2)
                        .attr("dy", yScale.bandwidth() / 2)
                        .on("mouseover", function () {
                        heatBar.append("path").classed("heatBarTriangle", true)
                            .attr("d", "M" + (width - barWidth - triangleSide) + " " + (barScale(v.value) - triangleSide) + " L" + (width - barWidth - triangleSide) + " " + (barScale(v.value) + triangleSide) + " L" + (width - barWidth) + " " + barScale(v.value) + " Z");
                    })
                        .on("mouseout", function () {
                        svgNode.select(".heatBarTriangle").remove();
                    });
                });
            });
            _.each(ds[0].data, function (d, i) {
                textGroup.append("text").classed("heatXText", true)
                    .text(d.day)
                    .attr("x", xScale(i.toString()))
                    .attr("dx", xScale.bandwidth() / 2)
                    .attr("dy", bottomPadding / 2)
                    .attr("y", height - bottomPadding);
            });
            var gradient = svgNode.append("defs").append("linearGradient")
                .attr("id", "gradientColor")
                .attr("x1", "0%").attr("y1", "0%")
                .attr("x2", "0%").attr("y2", "100%");
            gradient.append("stop").attr("offset", "0%").style("stop-color", "white");
            gradient.append("stop").attr("offset", "100%").style("stop-color", "lightblue");
            heatBar.append("rect").classed("heatBarRect", true)
                .attr("x", width - barWidth)
                .attr("y", topPadding)
                .attr("width", barWidth / 2)
                .attr("height", barHeight)
                .attr("fill", "url(#gradientColor)");
            for (var i = 0; i < barSegment + 1; i++) {
                heatBar.append("line").classed("heatBarLine", true)
                    .attr("x1", width - barWidth)
                    .attr("y1", topPadding + i * barHeight / barSegment)
                    .attr("x2", width - barWidth / 2)
                    .attr("y2", topPadding + i * barHeight / barSegment);
                heatBar.append("text").classed("heatBarText", true)
                    .attr("x", width - barWidth / 2 + 5)
                    .attr("y", topPadding + i * barHeight / 5)
                    .text(maxHeat / barSegment * i);
            }
            return this;
        };
        HeatLayer.prototype.render = function () {
            this.el.innerHTML = "";
            this.drawer(this.elD3);
            return this;
        };
        return HeatLayer;
    }(BaseLayer_1.BaseLayer));
    exports.HeatLayer = HeatLayer;
    var HeatChart = (function (_super) {
        __extends(HeatChart, _super);
        function HeatChart(conf) {
            var _this = _super.call(this, conf) || this;
            _this.boxplotLayer = new HeatLayer("heat", {
                style: {
                    width: function () { return Util_1.Util.toPixel(_this.config.style.width); },
                    height: function () { return Util_1.Util.toPixel(_this.config.style.height); }
                }
            });
            _this.boxplotLayer.addTo(_this);
            return _this;
        }
        HeatChart.prototype.setConfig = function (c) {
            this.boxplotLayer.setConfig(_.pick(c, "key"));
        };
        return HeatChart;
    }(MultiDataChart_1.MultiDataChart));
    exports.HeatChart = HeatChart;
});

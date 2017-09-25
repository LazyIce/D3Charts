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
define(["require", "exports", "d3", "lodash", "../../../Core/Util", "../../../Core/BaseChart", "../../../Core/BaseLayer"], function (require, exports, d3, _, Util_1, BaseChart_1, BaseLayer_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var PieLayer = (function (_super) {
        __extends(PieLayer, _super);
        function PieLayer(id, conf) {
            var _this = _super.call(this, id, conf) || this;
            _this.on("addToChart", function () {
                _this.chart.on("style_change data_change", function () {
                    _this.update();
                });
            });
            return _this;
        }
        PieLayer.prototype.defaultConfig = function () {
            return Util_1.Util.deepExtend(_super.prototype.defaultConfig.call(this), {
                className: "pieChart",
                segmentCount: 12,
                segmentStart: 18,
                padding: 10,
                colorDomain: [0, 50, 100],
                colorRange: ["red", "yellow", "green"]
            });
        };
        PieLayer.prototype.getParseData = function () {
            var data = this.chart.getData();
            if (_.isNaN(data) || _.isUndefined(data)) {
                return [];
            }
            else if (_.isArray(data)) {
                var count = this.config.segmentCount, start = this.config.segmentStart;
                var dataset = [];
                for (var i = 0; i < count; i++) {
                    dataset.push({ "time": (start + i) > 24 ? (start + i - 24) : (start + i), "value": null });
                }
                for (var i = 0; i < data.length; i++) {
                    var index = _.findIndex(dataset, { "time": data[i].time });
                    dataset[index] = data[i];
                }
                return dataset;
            }
            else {
                return [];
            }
        };
        PieLayer.prototype.drawer = function (svgNode) {
            var smartArcGen = function (startAngle, endAngle, innerRadius, outerRadius) {
                var largeArc = ((endAngle - startAngle) % (Math.PI * 2)) > Math.PI ? 1 : 0, startX = centerX + Math.cos(startAngle) * outerRadius, startY = centerY + Math.sin(startAngle) * outerRadius, endX2 = centerX + Math.cos(startAngle) * innerRadius, endY2 = centerY + Math.sin(startAngle) * innerRadius, endX = centerX + Math.cos(endAngle) * outerRadius, endY = centerY + Math.sin(endAngle) * outerRadius, startX2 = centerX + Math.cos(endAngle) * innerRadius, startY2 = centerY + Math.sin(endAngle) * innerRadius;
                var cmd = [
                    'M', startX, startY,
                    'A', outerRadius, outerRadius, 0, largeArc, 1, endX, endY,
                    'L', startX2, startY2,
                    'A', innerRadius, innerRadius, 0, largeArc, 0, endX2, endY2,
                    'Z'
                ];
                return cmd.join(' ');
            };
            var width = Util_1.Util.toPixel(this.config.style.width), height = Util_1.Util.toPixel(this.config.style.height);
            var centerX = width / 2, centerY = height / 2, outerRadius = Math.min(width, height) / 2 - this.config.padding, innerRadius = outerRadius / 2, segmentAngle = 2 * Math.PI / this.config.segmentCount;
            var ds = this.getParseData();
            if (!ds) {
                return;
            }
            var colorScale = d3.scaleLinear().domain(this.config.colorDomain).range(this.config.colorRange);
            var doughnutGroup = svgNode.append("g").attr("class", "doughnutGroup");
            _.each(ds, function (d, i) {
                var startAngle = -Math.PI / 2 + segmentAngle * i, endAngle = startAngle + segmentAngle;
                doughnutGroup.append("path")
                    .attr("class", "doughnut doughnut" + i)
                    .attr("fill", d.value == null ? "#d6d6d6" : colorScale(d.value))
                    .attr("d", smartArcGen(startAngle, startAngle, innerRadius, outerRadius))
                    .attr("stroke-width", "0px")
                    .attr("stroke", d.value == null ? "#d6d6d6" : colorScale(d.value))
                    .on("mouseenter", function (e) {
                    svgNode.select(".doughnut" + i)
                        .transition().duration(100)
                        .attr("d", smartArcGen(startAngle, endAngle, innerRadius, (outerRadius + 20)));
                })
                    .on("mousemove", function (e) {
                })
                    .on("mouseleave", function () {
                    svgNode.select(".doughnut" + i)
                        .transition().duration(100)
                        .attr("d", smartArcGen(startAngle, endAngle, innerRadius, outerRadius));
                })
                    .transition().duration(100).ease(d3.easeLinear).delay(100 * i)
                    .tween("pieTran", function () {
                    var node = d3.select(this);
                    return function (t) {
                        node.attr("stroke-width", "0.5px");
                        var interpolate = d3.interpolate(startAngle, endAngle);
                        node.attr("d", smartArcGen(startAngle, interpolate(t), innerRadius, outerRadius));
                    };
                });
            });
            return this;
        };
        PieLayer.prototype.render = function () {
            this.el.innerHTML = "";
            this.drawer(this.elD3);
            return this;
        };
        return PieLayer;
    }(BaseLayer_1.BaseLayer));
    exports.PieLayer = PieLayer;
    var PieChart = (function (_super) {
        __extends(PieChart, _super);
        function PieChart(conf) {
            var _this = _super.call(this, conf) || this;
            _this.pieLayer = new PieLayer("pie", {
                style: {
                    width: function () { return _this.config.style.width; },
                    height: function () { return _this.config.style.height; }
                },
                padding: Util_1.Util.toPixel("1.5rem")
            });
            _this.pieLayer.addTo(_this);
            return _this;
        }
        PieChart.prototype.setConfig = function (c) {
            this.pieLayer.setConfig(_.pick(c, "segmentCount", "segmentStart", "padding", "colorDomain", "colorRange"));
        };
        return PieChart;
    }(BaseChart_1.SingleDataChart));
    exports.PieChart = PieChart;
});

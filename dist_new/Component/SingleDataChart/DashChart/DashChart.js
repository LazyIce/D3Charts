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
    var DashLayer = (function (_super) {
        __extends(DashLayer, _super);
        function DashLayer(id, conf) {
            var _this = _super.call(this, id, conf) || this;
            _this.on("addToChart", function () {
                _this.chart.on("style_change data_change", function () {
                    _this.update();
                });
            });
            return _this;
        }
        DashLayer.prototype.defaultConfig = function () {
            return Util_1.Util.deepExtend(_super.prototype.defaultConfig.call(this), {
                className: "dashpie",
                padding: 25,
                dataFomate: function (v) {
                    return (+v).toFixed(1) + "Km/H";
                },
                rangeMax: 100,
                oldData: 0,
                colorDomain: [0, 0.5, 1],
                colorRange: ["red", "yellow", "green"]
            });
        };
        DashLayer.prototype.drawer = function (svgNode) {
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
            var width = Util_1.Util.toPixel(this.config.style.width);
            var height = Util_1.Util.toPixel(this.config.style.height);
            var outerRadius = width / 2 - this.config.padding, innerRadius = width / 5, centerX = width / 2, centerY = height - this.config.padding;
            var self = this;
            var ds = this.chart.getData();
            if (!ds) {
                return;
            }
            var curRadio = ds / this.config.rangeMax > 1 ? 1 : ds / this.config.rangeMax;
            var oldRadio = this.config.oldData / this.config.rangeMax > 1 ? 1 : this.config.oldData / this.config.rangeMax;
            var startAngle = -Math.PI, curEndAngle = startAngle + curRadio * Math.PI, oldEndAngle = startAngle + oldRadio * Math.PI;
            var dashGroup = svgNode.append("g").attr("class", "dashGroup");
            dashGroup.append("path").attr("d", smartArcGen(-Math.PI, 0, innerRadius, outerRadius))
                .classed("basebackground", true);
            dashGroup.append("path").attr("d", smartArcGen(startAngle, oldEndAngle, innerRadius, outerRadius))
                .attr("fill", "none")
                .classed("dashvaluebackground", true)
                .transition().duration(1000).ease(d3.easeLinear)
                .tween("dashTran", function () {
                var node = d3.select(this);
                var angleInterpolate = d3.interpolate(oldEndAngle, curEndAngle), colorInterpolate = d3.interpolate(oldRadio, curRadio);
                return function (t) {
                    node.attr("fill", d3.scaleLinear().domain(self.config.colorDomain).range(self.config.colorRange)(colorInterpolate(t)));
                    node.attr("d", smartArcGen(startAngle, angleInterpolate(t), innerRadius, outerRadius));
                };
            });
            this.config.oldData = ds;
            dashGroup.append("text").attr("class", "dataValue")
                .attr("x", centerX)
                .attr("y", centerY)
                .text(this.config.dataFomate(ds));
            dashGroup.append("text").attr("class", "rangeMin")
                .attr("x", centerX - innerRadius - (outerRadius - innerRadius) / 2)
                .attr("y", centerY)
                .attr("dy", Util_1.Util.getStringRect("0", "", 14).height)
                .text("0");
            dashGroup.append("text").attr("class", "rangeMax")
                .attr("x", centerX + innerRadius + (outerRadius - innerRadius) / 2)
                .attr("y", centerY)
                .attr("dy", Util_1.Util.getStringRect("0", "", 14).height)
                .text(this.config.rangeMax);
        };
        DashLayer.prototype.render = function () {
            this.el.innerHTML = "";
            this.drawer(this.elD3);
            return this;
        };
        return DashLayer;
    }(BaseLayer_1.BaseLayer));
    exports.DashLayer = DashLayer;
    var DashChart = (function (_super) {
        __extends(DashChart, _super);
        function DashChart(conf) {
            var _this = _super.call(this, conf) || this;
            _this.dashLayer = new DashLayer("dashpie", {
                style: {
                    width: function () { return _this.config.style.width; },
                    height: function () { return _this.config.style.height; }
                },
                padding: Util_1.Util.toPixel("2rem")
            });
            _this.dashLayer.addTo(_this);
            return _this;
        }
        DashChart.prototype.setConfig = function (c) {
            this.dashLayer.setConfig(_.pick(c, "rangeMax"));
        };
        return DashChart;
    }(BaseChart_1.SingleDataChart));
    exports.DashChart = DashChart;
});

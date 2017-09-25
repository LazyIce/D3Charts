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
    var TooltipLayer = (function (_super) {
        __extends(TooltipLayer, _super);
        function TooltipLayer(id, conf) {
            var _this = _super.call(this, id, conf) || this;
            _this.on("addToChart", function () {
                _this.chart.on("style_change data_change", function () {
                    _this.update();
                });
            });
            return _this;
        }
        TooltipLayer.prototype.defaultConfig = function () {
            return Util_1.Util.deepExtend(_super.prototype.defaultConfig.call(this), { tagName: "div", className: "tooltipContainer", style: { width: "150px", height: "100px" } });
        };
        TooltipLayer.prototype.getSingleTooltipContent = function (ds) {
            var textStart = "<table class='tooltip'><tbody><tr><th colspan='2'>" + ds.xMark + "</th></tr>";
            var text = "<tr><td class='name'><span style='background-color:" + this.chart.getColor(ds.series) + "'></span>" + ds.series + "</td><td class='value'>" + ds.value + "</td></tr>";
            var textEnd = "</tbody></table>";
            return textStart + text + textEnd;
        };
        TooltipLayer.prototype.getGroupTooltipContent = function (ds) {
            var _this = this;
            var textStart = "<table class='tooltip'><tbody><tr><th colspan='2'>" + ds.xMark + "</th></tr>";
            var text = "";
            _.each(ds.data, function (d) {
                text += "<tr><td class='name'><span style='background-color:" + _this.chart.getColor(d.id) + "'></span>" + d.id + "</td><td class='value'>" + d.value + "</td></tr>";
            });
            var textEnd = "</tbody></table>";
            return textStart + text + textEnd;
        };
        TooltipLayer.prototype.render = function () {
            var _this = this;
            this.el.innerHTML = "";
            var tooltipBox = this.elD3.append("div");
            this.chart.on("showSingleTooltip", function (d) {
                tooltipBox.style("display", "block")
                    .html(_this.getSingleTooltipContent(d));
            });
            this.chart.on("showGroupTooltip", function (d) {
                tooltipBox.style("display", "block")
                    .html(_this.getGroupTooltipContent(d));
            });
            this.chart.on("moveTooltip", function () {
                if (d3.mouse(_this.el)[0] > Util_1.Util.toPixel(_this.config.style.width) / 2) {
                    tooltipBox.style("top", d3.mouse(_this.el)[1] + "px")
                        .style("left", d3.mouse(_this.el)[0] - Util_1.Util.toPixel(tooltipBox.style("width")) + "px")
                        .style("position", "absolute");
                }
                else {
                    tooltipBox.style("top", d3.mouse(_this.el)[1] + "px")
                        .style("left", d3.mouse(_this.el)[0] + "px")
                        .style("position", "absolute");
                }
            });
            this.chart.on("hideTooltip", function () {
                tooltipBox.style("display", "none");
            });
            return this;
        };
        return TooltipLayer;
    }(BaseLayer_1.BaseLayer));
    exports.TooltipLayer = TooltipLayer;
});

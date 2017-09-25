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
    var TimeAdjustLayer = (function (_super) {
        __extends(TimeAdjustLayer, _super);
        function TimeAdjustLayer(id, conf) {
            var _this = _super.call(this, id, conf) || this;
            _this.on("addToChart", function () {
                _this.chart.on("style_change data_change", function () {
                    _this.updateStyle();
                    _this.render();
                });
            });
            return _this;
        }
        TimeAdjustLayer.prototype.parseData = function (d) {
            return _.extend({
                rangeMin: "2017/07/01 06:00",
                rangeMax: "2017/07/01 18:00",
                focusTime: "2017/07/01 12:00",
                axisHeight: "20px",
                timeFormat: "%H:%M",
                lineTextPadding: "20px",
                timeRound: 15
            }, d);
        };
        TimeAdjustLayer.prototype.drawer = function (svgNode) {
            var data = this.parseData(this.chart.getData());
            var width = Util_1.Util.toPixel(this.evaluateStyle().width);
            var height = Util_1.Util.toPixel(this.evaluateStyle().height);
            svgNode.append("rect").attr("class", "panel")
                .attr("x", 0)
                .attr("y", 0)
                .attr("width", width)
                .attr("height", height - Util_1.Util.toPixel(data.axisHeight));
            var self = this;
            var formatTime = d3.timeFormat(data.timeFormat);
            var focusTime = new Date(data.focusTime);
            var xScale = d3.scaleTime()
                .domain([new Date(data.rangeMin), new Date(data.rangeMax)])
                .range([6, width - 6]);
            svgNode.append("rect")
                .attr("class", "axisBackground")
                .attr("x", "0")
                .attr("y", height - Util_1.Util.toPixel(data.axisHeight))
                .attr("width", width)
                .attr("height", Util_1.Util.toPixel(data.axisHeight));
            var axis = svgNode.append("g")
                .attr("class", "axis xAxis")
                .attr("transform", "translate(0," + (Util_1.Util.toPixel(this.config.style.height) - Util_1.Util.toPixel(data.axisHeight)) + ")");
            axis.append("path")
                .attr("class", "domain")
                .attr("stroke", "#000")
                .attr("stroke-width", "1")
                .attr("d", "M 0.5,0 H " + (Util_1.Util.toPixel(this.config.style.width) - 0.5));
            var tick1 = axis.append("g")
                .attr("class", "tick")
                .attr("transform", "translate(0.5,0)");
            tick1.append("text")
                .attr("dy", "3")
                .attr("alignment-baseline", "hanging")
                .attr("text-anchor", "start")
                .text(formatTime(new Date(data.rangeMin)));
            var tick2 = axis.append("g")
                .attr("class", "tick")
                .attr("transform", "translate(" + Util_1.Util.toPixel(this.config.style.width) / 2 + ", 0)");
            tick2.append("text")
                .attr("dy", "3")
                .attr("alignment-baseline", "hanging")
                .attr("text-anchor", "middle")
                .text(formatTime(xScale.invert(Util_1.Util.toPixel(this.config.style.width) / 2)));
            var tick3 = axis.append("g")
                .attr("class", "tick")
                .attr("transform", "translate(" + (Util_1.Util.toPixel(this.config.style.width) - 0.5) + ", 0)");
            tick3.append("text")
                .attr("dy", "3")
                .attr("alignment-baseline", "hanging")
                .attr("text-anchor", "end")
                .text(formatTime(new Date(data.rangeMax)));
            var drag = d3.drag()
                .on("start", function () {
                svgNode.style("cursor", "col-resize");
            })
                .on("drag", function () {
                if (d3.event.x >= xScale(new Date(data.rangeMin)) && d3.event.x <= xScale(new Date(data.rangeMax))) {
                    var currentTime = xScale.invert(d3.event.x);
                    svgNode.select(".focusLine").attr("x1", d3.event.x).attr("x2", d3.event.x);
                    svgNode.select(".focusRect").attr("x", d3.event.x - 6);
                    svgNode.selectAll(".focusRectLine").attr("x1", d3.event.x - 4).attr("x2", d3.event.x + 4);
                    if (d3.event.x > Util_1.Util.toPixel(self.config.style.width) / 2)
                        svgNode.select(".focusText").text(formatTime(currentTime)).attr("x", (xScale(currentTime) - Util_1.Util.toPixel(data.lineTextPadding))).attr("class", "focusText leftSide");
                    else
                        svgNode.select(".focusText").text(formatTime(currentTime)).attr("x", (xScale(currentTime) + Util_1.Util.toPixel(data.lineTextPadding))).attr("class", "focusText rightSide");
                    self.fire("draging", { dateTime: currentTime });
                }
            })
                .on("end", function () {
                var currentTime;
                if (d3.event.x >= xScale(new Date(data.rangeMin)) && d3.event.x <= xScale(new Date(data.rangeMax))) {
                    currentTime = xScale.invert(d3.event.x);
                    currentTime.setSeconds(0, 0);
                    var currentMinutes = currentTime.getMinutes();
                    var remainderTime = currentMinutes % data.timeRound;
                    if (remainderTime != 0) {
                        if (remainderTime <= data.timeRound / 2) {
                            currentTime.setMinutes(currentMinutes - remainderTime);
                        }
                        else {
                            currentTime.setMinutes(currentMinutes + data.timeRound - remainderTime);
                        }
                    }
                    self.currentTime = currentTime;
                    svgNode.select(".focusLine").attr("x1", xScale(currentTime)).attr("x2", xScale(currentTime));
                    svgNode.select(".focusRect").attr("x", xScale(currentTime) - 6);
                    svgNode.selectAll(".focusRectLine").attr("x1", xScale(currentTime) - 4).attr("x2", xScale(currentTime) + 4);
                    if (d3.event.x > Util_1.Util.toPixel(self.config.style.width) / 2)
                        svgNode.select(".focusText").text(formatTime(currentTime)).attr("x", (xScale(currentTime) - Util_1.Util.toPixel(data.lineTextPadding))).attr("class", "focusText leftSide");
                    else
                        svgNode.select(".focusText").text(formatTime(currentTime)).attr("x", (xScale(currentTime) + Util_1.Util.toPixel(data.lineTextPadding))).attr("class", "focusText rightSide");
                }
                else if (d3.event.x < xScale(new Date(data.rangeMin))) {
                    currentTime = new Date(data.rangeMin);
                    self.currentTime = currentTime;
                    svgNode.select(".focusLine").attr("x1", xScale(currentTime)).attr("x2", xScale(currentTime));
                    svgNode.select(".focusRect").attr("x", xScale(currentTime) - 6);
                    svgNode.selectAll(".focusRectLine").attr("x1", xScale(currentTime) - 4).attr("x2", xScale(currentTime) + 4);
                    svgNode.select(".focusText").text(formatTime(currentTime)).attr("x", (xScale(currentTime) + Util_1.Util.toPixel(data.lineTextPadding))).attr("class", "focusText rightSide");
                }
                else if (d3.event.x > xScale(new Date(data.rangeMax))) {
                    currentTime = new Date(data.rangeMax);
                    self.currentTime = currentTime;
                    svgNode.select(".focusLine").attr("x1", xScale(currentTime)).attr("x2", xScale(currentTime));
                    svgNode.select(".focusRect").attr("x", xScale(currentTime) - 6);
                    svgNode.selectAll(".focusRectLine").attr("x1", xScale(currentTime) - 4).attr("x2", xScale(currentTime) + 4);
                    svgNode.select(".focusText").text(formatTime(currentTime)).attr("x", (xScale(currentTime) - Util_1.Util.toPixel(data.lineTextPadding))).attr("class", "focusText leftSide");
                }
                svgNode.style("cursor", "default");
                self.fire("dragend", { dateTime: self.currentTime });
            });
            svgNode.append("text")
                .attr("class", (xScale(focusTime) > Util_1.Util.toPixel(this.config.style.width) / 2) ? "focusText leftSide" : "focusText rightSide")
                .text(formatTime(new Date(data.focusTime)))
                .attr("x", (xScale(focusTime) > Util_1.Util.toPixel(this.config.style.width) / 2) ? (xScale(focusTime) - Util_1.Util.toPixel(data.lineTextPadding)) : (xScale(focusTime) + Util_1.Util.toPixel(data.lineTextPadding)))
                .attr("y", (Util_1.Util.toPixel(this.config.style.height) - Util_1.Util.toPixel(data.axisHeight)) / 2);
            var focusGroup = svgNode.append("g")
                .attr("class", "focusGroup")
                .on("mouseenter", function () {
                svgNode.style("cursor", "col-resize");
            })
                .on("mouseleave", function () {
                svgNode.style("cursor", "default");
            })
                .call(drag);
            focusGroup.append("line")
                .attr("class", "focusLine")
                .attr("x1", xScale(focusTime))
                .attr("y1", 0)
                .attr("x2", xScale(focusTime))
                .attr("y2", Util_1.Util.toPixel(this.config.style.height) - Util_1.Util.toPixel(data.axisHeight));
            var focusButton = focusGroup.append("g").attr("class", "focusButton");
            focusButton.append("rect")
                .attr("class", "focusRect")
                .attr("x", xScale(focusTime) - 6)
                .attr("y", ((Util_1.Util.toPixel(this.config.style.height) - Util_1.Util.toPixel(data.axisHeight)) / 2 - 10))
                .attr("rx", "3").attr("ry", "3")
                .attr("width", "12")
                .attr("height", "20");
            focusButton.append("line")
                .attr("class", "focusRectLine")
                .attr("x1", xScale(focusTime) - 4)
                .attr("y1", ((Util_1.Util.toPixel(this.config.style.height) - Util_1.Util.toPixel(data.axisHeight)) / 2 - 5))
                .attr("x2", xScale(focusTime) + 4)
                .attr("y2", ((Util_1.Util.toPixel(this.config.style.height) - Util_1.Util.toPixel(data.axisHeight)) / 2 - 5));
            focusButton.append("line")
                .attr("class", "focusRectLine")
                .attr("x1", xScale(focusTime) - 4)
                .attr("y1", ((Util_1.Util.toPixel(this.config.style.height) - Util_1.Util.toPixel(data.axisHeight)) / 2))
                .attr("x2", xScale(focusTime) + 4)
                .attr("y2", ((Util_1.Util.toPixel(this.config.style.height) - Util_1.Util.toPixel(data.axisHeight)) / 2));
            focusButton.append("line")
                .attr("class", "focusRectLine")
                .attr("x1", xScale(focusTime) - 4)
                .attr("y1", ((Util_1.Util.toPixel(this.config.style.height) - Util_1.Util.toPixel(data.axisHeight)) / 2 + 5))
                .attr("x2", xScale(focusTime) + 4)
                .attr("y2", ((Util_1.Util.toPixel(this.config.style.height) - Util_1.Util.toPixel(data.axisHeight)) / 2 + 5));
        };
        TimeAdjustLayer.prototype.render = function () {
            this.el.innerHTML = "";
            this.drawer(this.elD3);
            return this;
        };
        return TimeAdjustLayer;
    }(BaseLayer_1.BaseLayer));
    exports.TimeAdjustLayer = TimeAdjustLayer;
    var TimeAdjust = (function (_super) {
        __extends(TimeAdjust, _super);
        function TimeAdjust(conf) {
            var _this = _super.call(this, conf) || this;
            _this.timelayer = new TimeAdjustLayer("timelayer", {
                style: {
                    width: function () { return _this.config.style.width; },
                    height: function () { return _this.config.style.height; }
                }
            });
            _this.timelayer.addTo(_this);
            _this.proxyEvents(_this.timelayer, "draging", "dragend");
            return _this;
        }
        TimeAdjust.prototype.defaultConfig = function () {
            return {
                style: {
                    width: "300px",
                    height: "300px",
                    position: "relative"
                },
                className: "timeAdjuster",
                el: null
            };
        };
        TimeAdjust.prototype.setData = function (d) {
            this.data = d;
            this.fire("data_change");
        };
        return TimeAdjust;
    }(BaseChart_1.SingleDataChart));
    exports.TimeAdjust = TimeAdjust;
});

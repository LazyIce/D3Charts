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
define(["require", "exports", "d3", "lodash", "../../Core/BaseChart", "./MultiTypeMeasure", "../../Core/DataFilter"], function (require, exports, d3, _, BaseChart_1, MultiTypeMeasure_1, DataFilter_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var MultiDataChart = (function (_super) {
        __extends(MultiDataChart, _super);
        function MultiDataChart() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.measures = [];
            _this.colorManager = {};
            _this.colorIndex = 0;
            return _this;
        }
        MultiDataChart.prototype.addMeasure = function (d, type) {
            d = DataFilter_1.DataFilter.dataFilter(d, type);
            var m = new MultiTypeMeasure_1.MultiDataMeasure(d.id, d.data, type);
            var i = _.findIndex(this.measures, function (mm) { return mm.id == m.id; });
            if (i != -1) {
                this.measures[i] = m;
            }
            else {
                this.measures.push(m);
            }
            this.fire("measure_change measure_add", { measure: m });
            return this;
        };
        MultiDataChart.prototype.addMeasures = function (ds, type) {
            var _this = this;
            _.each(ds, function (d) {
                d = DataFilter_1.DataFilter.dataFilter(d, type);
                var m = new MultiTypeMeasure_1.MultiDataMeasure(d.id, d.data, type);
                var i = _.findIndex(_this.measures, function (mm) { return mm.id == m.id; });
                if (i != -1) {
                    _this.measures[i] = m;
                }
                else {
                    _this.measures.push(m);
                }
            });
            this.fire("measure_change measure_add");
            return this;
        };
        MultiDataChart.prototype.clearMeasure = function () {
            this.measures = [];
            this.fire("measure_change measure_clear");
        };
        MultiDataChart.prototype.loadMeasures = function (ds, type) {
            var measures = [];
            if (ds == null || ds == undefined || !_.isArray(ds))
                console.log("Data wrong!");
            else {
                _.each(ds, function (d) {
                    d = DataFilter_1.DataFilter.dataFilter(d, type);
                    var measure = new MultiTypeMeasure_1.MultiDataMeasure(d.id, d.data, type);
                    measures.push(measure);
                });
                this.measures = measures;
                this.fire("measure_change");
            }
            return this;
        };
        MultiDataChart.prototype.removeMeasure = function (m) {
            if (_.some(this.measures, function (mm) { return mm.id == m; })) {
                var rm = _.find(this.measures, { id: m });
                this.measures = _.filter(this.measures, function (mm) { return mm.id != m; });
                this.fire("measure_change measure_remove", { measure: rm });
            }
            else if (_.some(this.measures, function (mm) { return mm.type == m; })) {
                this.measures = _.filter(this.measures, function (mm) { return mm.type != m; });
                this.fire("measure_change measure_remove");
            }
            else {
                var rm = _.last(this.measures);
                this.measures = _.initial(this.measures);
                this.fire("measure_change measure_remove", { measure: rm });
            }
            return this;
        };
        MultiDataChart.prototype.getMeasure = function (type) {
            return _.filter(this.measures, function (mm) { return mm.type == type; });
        };
        MultiDataChart.prototype.getAllMeasure = function () {
            return this.measures;
        };
        MultiDataChart.prototype.getDomain = function (k) {
            return [this.min(k), this.max(k)];
        };
        MultiDataChart.prototype.max = function (k) {
            var max;
            _.each(this.measures, function (mm) {
                var _max = mm.max(k);
                if (!max) {
                    max = _max;
                }
                else {
                    if (_max > max) {
                        max = _max;
                    }
                }
            });
            return max;
        };
        MultiDataChart.prototype.min = function (k) {
            var min;
            _.each(this.measures, function (mm) {
                var _min = mm.min(k);
                if (!min) {
                    min = _min;
                }
                else {
                    if (_min < min) {
                        min = _min;
                    }
                }
            });
            return min;
        };
        MultiDataChart.prototype.getColor = function (id) {
            if (this.colorManager[id]) {
                return this.colorManager[id];
            }
            else {
                this.colorManager[id] = d3.schemeCategory10[this.colorIndex++ % 10];
                return this.colorManager[id];
            }
        };
        return MultiDataChart;
    }(BaseChart_1.BaseChart));
    exports.MultiDataChart = MultiDataChart;
});

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
define(["require", "exports", "../../Core/BaseMeasure", "lodash"], function (require, exports, BaseMeasure_1, _) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var MultiDataMeasure = (function (_super) {
        __extends(MultiDataMeasure, _super);
        function MultiDataMeasure() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        MultiDataMeasure.prototype.max = function (k) {
            return _.max(_.map(this.data, k));
        };
        MultiDataMeasure.prototype.min = function (k) {
            return _.min(_.map(this.data, k));
        };
        MultiDataMeasure.prototype.getDomain = function (k) {
            return [this.min(k), this.max(k)];
        };
        return MultiDataMeasure;
    }(BaseMeasure_1.BaseMeasure));
    exports.MultiDataMeasure = MultiDataMeasure;
});

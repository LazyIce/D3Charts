define(["require", "exports", "lodash"], function (require, exports, _) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var BaseMeasure = (function () {
        function BaseMeasure(id, data, type, style) {
            this.id = id == undefined ? _.uniqueId("measure") : id;
            this.data = data || [];
            this.type = type || "line";
            this.style = style || {};
        }
        return BaseMeasure;
    }());
    exports.BaseMeasure = BaseMeasure;
});

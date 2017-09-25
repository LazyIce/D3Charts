define(["require", "exports", "lodash"], function (require, exports, _) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var DataFilter;
    (function (DataFilter) {
        function dataFilter(ds, type) {
            switch (type) {
                case "line":
                    return lineFilter(ds);
                case "bar":
                    return barFilter(ds);
                default:
                    return ds;
            }
        }
        DataFilter.dataFilter = dataFilter;
        function lineFilter(ds) {
            ds.data = _.sortBy(ds.data, function (m) { return m.x; });
            _.each(ds.data, function (v, k) {
                if (typeof (v.x) == "string")
                    v.x = new Date(v.x);
            });
            return ds;
        }
        function barFilter(ds) {
            ds.data = _.sortBy(ds.data, function (m) { return m.x; });
            return ds;
        }
    })(DataFilter = exports.DataFilter || (exports.DataFilter = {}));
});

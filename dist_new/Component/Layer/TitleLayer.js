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
define(["require", "exports", "../../Core/Util", "../../Core/BaseLayer"], function (require, exports, Util_1, BaseLayer_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var TitleLayer = (function (_super) {
        __extends(TitleLayer, _super);
        function TitleLayer() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        TitleLayer.prototype.defaultConfig = function () {
            return Util_1.Util.deepExtend(_super.prototype.defaultConfig.call(this), {
                tagName: "div",
                className: "title",
                style: { height: "2rem" },
                value: ""
            });
        };
        TitleLayer.prototype.setTitle = function (t) {
            this.config.value = t;
            this.render();
        };
        TitleLayer.prototype.render = function () {
            var t = this.config.value;
            var node = this.elD3.select("p");
            if (node.empty()) {
                node = this.elD3.append("p");
            }
            node.text(t);
            return this;
        };
        return TitleLayer;
    }(BaseLayer_1.BaseLayer));
    exports.TitleLayer = TitleLayer;
});

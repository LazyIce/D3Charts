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
define(["require", "exports", "d3", "lodash", "./Evented", "./Util"], function (require, exports, d3, _, Evented_1, Util_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var styles = Util_1.Util.d3Invoke("style");
    var attrs = Util_1.Util.d3Invoke("attr");
    var View = (function (_super) {
        __extends(View, _super);
        function View(conf) {
            var _this = _super.call(this) || this;
            _this.config = Util_1.Util.deepExtend(_this.defaultConfig(), conf);
            _this.initView();
            return _this;
        }
        View.prototype.defaultConfig = function () {
            return { tagName: "div", className: "view" };
        };
        View.prototype.setConfig = function (c) {
            this.config = _.extend(this.defaultConfig(), this.config, c);
            return this;
        };
        View.prototype.initView = function () {
            if (this.config.tagName == "svg") {
                this.el = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            }
            else {
                this.el = document.createElementNS("http://www.w3.org/1999/xhtml", this.config.tagName);
            }
            this.elD3 = d3.select(this.el);
            this.elD3.classed(this.config.className, true);
            return this;
        };
        View.prototype.appendTo = function (dom) {
            dom.node().appendChild(this.el);
            return this;
        };
        View.prototype.append = function (element) {
            this.el.appendChild(element);
        };
        View.prototype.style = function (s) {
            this.elD3.call(styles(s));
            return this;
        };
        View.prototype.attr = function (a) {
            this.elD3.call(attrs(a));
            return this;
        };
        View.prototype.render = function (ctx) {
            return this;
        };
        View.prototype.addClass = function (c) {
            this.elD3.classed(c, true);
            return this;
        };
        View.prototype.removeClass = function (c) {
            this.elD3.classed(c, false);
            return this;
        };
        return View;
    }(Evented_1.Evented));
    exports.View = View;
});

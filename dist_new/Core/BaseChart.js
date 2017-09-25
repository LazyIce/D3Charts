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
define(["require", "exports", "d3", "lodash", "./Evented", "./Util", "./View"], function (require, exports, d3, _, Evented_1, Util_1, View_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var BaseChart = (function (_super) {
        __extends(BaseChart, _super);
        function BaseChart(conf) {
            var _this = _super.call(this) || this;
            _this.isRender = false;
            _this.layers = [];
            _this.config = Util_1.Util.deepExtend(_this.defaultConfig(), conf);
            _this.rootView = new View_1.View({ tagName: "div", className: _this.config.className });
            _this.rootView.style(_this.config.style);
            if (_this.config.el) {
                _this.renderAt(_this.config.el);
            }
            return _this;
        }
        BaseChart.prototype.getLayerContainer = function () {
            return this.rootView;
        };
        BaseChart.prototype.addClass = function (c) {
            this.rootView.addClass(c);
            this.fire("classchange");
            return this;
        };
        BaseChart.prototype.removeClass = function (c) {
            this.rootView.removeClass(c);
            this.fire("classchange");
            return this;
        };
        BaseChart.prototype.defaultConfig = function () {
            return {
                style: {
                    width: "300px",
                    height: "300px",
                    position: "relative"
                },
                className: "chart",
                el: null
            };
        };
        BaseChart.prototype.setStyle = function (c) {
            this.config.style = _.extend(this.config.style, c);
            this.fire("style_change", { style: this.config.style });
        };
        BaseChart.prototype.renderAt = function (dom) {
            if (_.isString(dom)) {
                var n = d3.select(dom).node();
                n.appendChild(this.rootView.el);
            }
            else {
                dom.appendChild(this.rootView.el);
            }
            this.fire("rendered");
            this.isRender = true;
        };
        BaseChart.prototype.toElement = function () {
            if (this.isRender) {
                return this.rootView.el;
            }
            this.fire("rendered");
            this.isRender = true;
            return this.rootView.el;
        };
        // loadMeasures(measures:any[]) {
        //     _.each(measures, (d)=>{
        //         let measure = new Measure(d.id, d.data, d.type)
        //         let i=_.findIndex(this.measures,(mm)=>mm.id==d.id)
        //         if(i!=-1){
        //             this.measures[i]=d
        //         }else{
        //             this.measures.push(d)
        //         }
        //     })
        //     this.fire("measure_change")
        // }
        // addMeasure(m:Measure){
        //     let i=_.findIndex(this.measures,(mm)=>mm.id==m.id)
        //     if(i!=-1){
        //         this.measures[i]=m
        //     }else{
        //         this.measures.push(m)
        //     }
        //     this.fire("measure_change")
        // }
        BaseChart.prototype.addLayer = function (l) {
            var i = _.findIndex(this.layers, function (ll) { return ll.id == l.id; });
            if (i != -1) {
                this._clearLayer(this.layers[i]);
                this.layers[i] = l;
            }
            else {
                this.layers.push(l);
            }
            l._onAdd(this);
            this.fire("layer_add layer_change", l);
            return this;
        };
        BaseChart.prototype.removeLayer = function (id) {
            if (_.isObject(id)) {
                var i = _.findIndex(this.layers, function (ll) { return ll.id == id.id; });
                if (i != -1) {
                    this._clearLayer(this.layers[i]);
                    this.layers = _.filter(this.layers, function (ll) { return ll.id != id.id; });
                }
                this.fire("layer_remove layer_change", { layer: this.layers[i] });
            }
            else {
                var i = _.findIndex(this.layers, function (ll) { return ll.id == id; });
                if (i != -1) {
                    this._clearLayer(this.layers[i]);
                    this.layers = _.filter(this.layers, function (ll) { return ll.id != id; });
                }
                this.fire("layer_remove layer_change", { layer: this.layers[i] });
            }
            return this;
        };
        BaseChart.prototype._clearLayer = function (l) {
            l.clear();
            //clear callback
            return this;
        };
        // stringRectCache:any=Util.CacheAble(Util.getStringRect,(s,cls,fontSize)=>s.toString().length+" "+cls+fontSize)
        // getStringRect(s,cls?,fontSize?){
        //     let rect=this.stringRectCache(s,cls,fontSize)
        //     return {width:rect.width,height:rect.height}
        // }
        // getColor(color?){
        //     if(color === undefined)
        //         return d3.schemeCategory20[Math.round(Math.random()*20)]
        //     else if(typeof(color) == "number")
        //         return d3.schemeCategory20[color]
        //     else 
        //         return color
        // }
        BaseChart.prototype.whenReady = function (callback, ctx) {
            if (this.isRender) {
                callback.call(ctx, null);
            }
            this.on("rendered", callback, ctx);
        };
        return BaseChart;
    }(Evented_1.Evented));
    exports.BaseChart = BaseChart;
    var SingleDataChart = (function (_super) {
        __extends(SingleDataChart, _super);
        function SingleDataChart() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        SingleDataChart.prototype.getData = function () {
            return this.data;
        };
        SingleDataChart.prototype.setData = function (d) {
            this.fire("data_change", { data: d, oldData: this.data = d });
            this.data = d;
        };
        return SingleDataChart;
    }(BaseChart));
    exports.SingleDataChart = SingleDataChart;
});

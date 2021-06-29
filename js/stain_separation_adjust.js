var BUAAFactor = function(i, a) {
  var l;
  IFactor.apply(this);
  var n = this;
  function e(e) {
    return e < 2 ? e.toFixed(2) : e.toFixed(1)
  }
  this.s1 = 1,
      this.s2 = 1,
      this.s3 = 1,
      function() {
        for (var e in l = i,
            a) {
          var t = a[e];
          "function" != typeof t && (n[e] = t)
        }
      }(),
      this.isDefault = function() {
        return !(void 0 !== n.s1 && 1 !== n.s1 || void 0 !== n.s2 && 1 !== n.s2 || void 0 !== n.s3 && 1 !== n.s3)
      }
      ,
      this.getParam = function() {
        return n.isDefault() ? "" : "&buaa=1.0&s=" + l + "&s1=" + e(n.s1) + "&s2=" + e(n.s2) + "&s3=" + e(n.s3)
      }
      ,
      this.reset = function() {
        n.s1 = 1,
            n.s2 = 1,
            n.s3 = 1
      }
}
    , Advanced_BUAA = function(i) {
  Advanced_Base.apply(this, [i, "BUAA", "A3D39E3C-CA5F-E711-AFA7-005056B50E11"]);
  function o(e) {
    return e < 40 ? (2 * e / 40).toFixed(2) : (2 + 3 * (e - 40) / 10).toFixed(1)
  }
  function d(e) {
    return (2 < e ? 40 + 10 * (e - 2) / 3 : 40 * e / 2).toFixed(0)
  }
  var u = this
      , c = (Math.asin(1),
      [])
      , f = [];
  function b(e, t) {
    var i = "filter:progid:DXImageTransform.Microsoft.Gradient(startColorStr='" + e + "',endColorStr='" + t + "',gradientType='1');";
    return i += "background: linear-gradient(to right, " + e + ", " + t + ");",
        i += "background: -moz-linear-gradient(left, " + e + "," + t + ");",
        i += "background: -o-linear-gradient(left," + e + "," + t + ");",
        i += "background: -webkit-gradient(linear, 0% 0%, 100% 0%, from(" + e + "), to(" + t + "));"
  }
  this.bind("init", function() {
    var e = u.init(u.title, '<div class="stain_slide hidden">            <label class="label label-default">A</label>            <span>0</span>            <div></div>        </div>        <div class="stain_slide hidden">            <label class="label label-default">B</label>            <span>0</span>            <div></div>        </div>        <div class="stain_slide hidden">            <label class="label label-default">C</label>            <span>0</span>            <div></div>        </div>        <p class="border-top"></p>        <div class="text-right"><button class="btn btn-primary"></button></div>')
        , r = {
      HE: [{
        label: "H",
        color: "blue"
      }, {
        label: "E",
        color: "red"
      }],
      Feulgen_Light_Green: [{
        label: "F",
        color: "blue"
      }, {
        label: "G",
        color: "green"
      }],
      FE: [{
        label: "F",
        color: "blue"
      }, {
        label: "E",
        color: "red"
      }],
      FPap: [{
        label: "F",
        color: "blue"
      }, {
        label: "G",
        color: "green"
      }, {
        label: "E",
        color: "red"
      }]
    }[i.getCurrentSlide().stain];
    if (void 0 !== r) {
      for (var s = e.find(".stain_slide"), t = 0; t < r.length; t++)
        !function(e) {
          var i = "s" + (e + 1)
              , t = parseFloat(u.factor[i])
              , a = d(t)
              , l = s.eq(e)
              , n = l.find("span").html(t < 2 ? t.toFixed(2) : t.toFixed(1));
          f.push(n),
              c.push(l.find("div").slider({
                min: 0,
                max: 50,
                value: a,
                slide: function(e, t) {
                  u.adjusting = !0,
                      n.html(o(t.value))
                },
                stop: function(e, t) {
                  u.adjusting = !1,
                  a != t.value && (u.factor[i] = parseFloat(o(t.value)),
                      u.updateFactor(),
                      a = t.value)
                }
              }).attr("style", b("#FFFFFF", r[e].color))),
              l.find("label").html(r[e].label),
              l.removeClass("hidden")
        }(t);
      e.find("button.btn").on("click", function() {
        u.factor.reset();
        for (var e = 0; e < c.length; e++) {
          var t = u.factor["s" + (e + 1)];
          c[e].slider("value", d(t)),
              f[e].html(t.toFixed(2))
        }
        u.updateFactor()
      }).html(SlideViewerStrings.getString("Buttons.Reset"))
    } else
      e.find(".popover-content").html("<h4>" + MMDSSlideViewerStrings.getString("Labels.a_stain_no") + "</h4>")
  })
};
SV_APPS.push({
  premise: function() {
    return !0
  },
  instance: Advanced_BUAA
});
//# sourceMappingURL=stain_separation_adjust.js.map

var APP_Track = function(l) {
  AppBase.apply(this, [l, "DC8F8344-8FEB-46C3-87E4-3CC2B49B957F", "track"]);
  var c, s, g, w, b, p, u, v, e = this, f = [], y = l.getCurrentImage().scanObjective, x = e.data("alpha") || .5, k = null, i = '<div id="trackApp" style="text-align: center">            <button id="track_re" class="btn btn-primary hidden">录制</button>            <button id="track_st" class="btn btn-primary hidden" disabled>停止</button>            <button id="track_sa" class="btn btn-primary hidden" disabled>保存</button>            <button id="track_pl" class="btn btn-primary hidden" disabled>播放</button>            <div id="trackView" style="width:170px;display:inline-block;position:relative;overflow:hidden;border:1px solid #319DCE;">                <canvas></canvas>                <div id="trackViewRect" style="position:absolute;border:0.5px solid #FF0000;background:rgba(255, 255, 255, 0.5)"></div>                <div id="trackHLine" style="position:absolute;border-top:1px solid #FF0000;width:100%;"></div>                <div id="trackVLine" style="position:absolute;border-left:1px solid #FF0000;height:100%;top:0"></div>            </div>            <div id="alphaSlider" style="margin-top:5px;"></div>        </div>';
  function h() {
    var t = l.viewport.getBounds(!0)
        , i = l.getCurrentImage();
    t.x = Math.floor(t.x * i.width * p / i.width),
        t.y = Math.floor(t.y * i.width * u / i.height),
        t.width = Math.ceil(t.width * i.width * p / i.width),
        t.height = Math.ceil(t.height * i.width * u / i.height);
    var e = {
      object: l.getScale() * y + 1e-6,
      rect: t
    };
    f.push(e),
        a()
  }
  function a() {
    var t = s.getContext("2d");
    t.clearRect(0, 0, s.width, s.height),
        t.save();
    var i = l.viewport.getBounds(!0)
        , e = l.getCurrentImage();
    i.x = i.x * e.width * p / e.width,
        i.y = i.y * e.width * u / e.height,
        i.width = i.width * e.width * p / e.width,
        i.height = i.height * e.width * u / e.height;
    var h = l.rotate()
        , a = v;
    if (null != h) {
      a = v.rotate(h, v.getCenter());
      var d = new SeadragonPoint(a.width / 2,a.height / 2)
          , n = new SeadragonPoint((a.width - p) / 2,(a.height - u) / 2)
          , r = new SeadragonPoint(n.x,n.y).rotate(h, d);
      s.width = a.width,
          s.height = a.height,
          c.css({
            width: a.width,
            height: a.height
          }),
          t.translate(r.x, r.y),
          t.rotate(-h);
      var o = i.getCenter().plus(n).rotate(h, d);
      i.x = o.x - i.width / 2,
          i.y = o.y - i.height / 2
    } else
      s.width = a.width,
          s.height = a.height,
          c.css({
            width: a.width,
            height: a.height
          });
    !function(t) {
      t.fillStyle = "black",
          t.globalAlpha = x,
          t.fillRect(0, 0, p, u),
          f.sort(function(t, i) {
            return t.object - i.object
          });
      for (var i = 0; i < f.length; i++)
        if (!(f[i].object < 2)) {
          var e = 0;
          e = f[i].object >= y ? 0 : f[i].object >= y / 2 ? .25 * x : f[i].object >= y / 4 ? .5 * x : .75 * x,
              t.globalAlpha = e;
          var h = f[i].rect;
          t.clearRect(h.x, h.y, h.width, h.height),
              t.fillRect(h.x, h.y, h.width, h.height),
              console.log(f[i].object + ":" + e)
        }
      t.globalAlpha = 1,
          t.strokeStyle = "#319DCE",
          t.lineWidth = 1,
          t.strokeRect(0, 0, p, u),
          t.globalCompositeOperation = "destination-atop",
          t.drawImage(k, 0, 0, k.width, k.height, 0, 0, p, u)
    }(t),
        t.restore(),
        g.css("top", Math.floor(i.y + i.height / 2) + "px"),
        w.css("left", Math.floor(i.x + i.width / 2) + "px"),
        b.css({
          left: Math.floor(i.x),
          top: Math.floor(i.y),
          width: Math.ceil(i.width),
          height: Math.ceil(i.height)
        })
  }
  this.bind("init", function() {
    if (i = $(i),
    !1 !== e.initDialog(e.title, i)) {
      var t = l.getCurrentImage();
      (k = new Image).onload = h,
          k.src = l.provider.getThumbnailUrl(l.getCurrentSlide().id, t.id, !0, !0),
          t.width > t.height ? (p = 170,
              u = Math.floor(p * t.height / t.width)) : (u = 170,
              p = Math.floor(u * t.width / t.height)),
          v = new SeadragonRect(0,0,p,u),
          c = i.find("#trackView"),
          s = i.find("canvas")[0],
          g = i.find("#trackHLine"),
          w = i.find("#trackVLine"),
          b = i.find("#trackViewRect"),
          l.addEventListener("animationfinish", h),
          l.bind("rotate", function() {
            a()
          }),
          i.find("#alphaSlider").slider({
            min: 40,
            max: 60,
            value: 100 * x,
            change: function(t, i) {
              x = i.value / 100,
                  e.data("alpha", x),
                  a()
            }
          })
    }
  })
};
SV_APPS.push({
  premise: function() {
    return !0
  },
  instance: APP_Track
});
//# sourceMappingURL=track.js.map

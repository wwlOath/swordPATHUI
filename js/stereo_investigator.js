RectangleMarquee.prototype.isInArea = function(t) {
  var e = this.startPoint
      , a = this.endPoint;
  if (a.x < e.x) {
    var n = e;
    e = a,
        a = n
  }
  return t.x > e.x && t.x < a.x && t.y > e.y && t.y < a.y
}
    ,
    PolygonMarquee.prototype.isInArea = CurveRoundedMarquee.prototype.isInArea = function(t) {
      var e, a = this.points, n = a.length - 1, i = 0;
      for (e = 0; e < a.length; e++)
        (a[e].y < t.y && a[n].y >= t.y || a[n].y < t.y && a[e].y >= t.y) && (a[e].x <= t.x || a[n].x <= t.x) && a[e].x + (t.y - a[e].y) / (a[n].y - a[e].y) * (a[n].x - a[e].x) < t.x && i++,
            n = e;
      return 1 & i
    }
    ,
    RectangleMarquee.prototype.area = function() {
      var t = Math.abs(this.startPoint.x - this.endPoint.x)
          , e = Math.abs(this.startPoint.y - this.endPoint.y);
      return floatRound(t * this.calibration * e * this.calibration)
    }
    ,
    CurveRoundedMarquee.prototype.area = PolygonMarquee.prototype.area = function() {
      return floatRound(CalcArea(this.points) * this.calibration * this.calibration)
    }
    ,
    $.fn.serializeObject = function() {
      var t = {}
          , e = this.serializeArray();
      return $.each(e, function() {
        void 0 !== t[this.name] ? (t[this.name].push || (t[this.name] = [t[this.name]]),
            t[this.name].push(this.value || "")) : t[this.name] = this.value || ""
      }),
          t
    }
    ,
    SlideProvider.prototype.getStereoMark = function(t) {
      this.getRequest("Advanced/Stereos", !0, {}, function(t, e) {
        t.marks = e
      }, t)
    }
    ,
    SlideProvider.prototype.addStereoMark = function(t, e) {
      var a = this.getActionUrl("Advanced/Stereos");
      this.request(a, "POST", {
        x: t.x,
        y: t.y
      }, !0, {}, function(t, e, a) {
        t.id = e
      }, e)
    }
    ,
    SlideProvider.prototype.delStereoMark = function(t, e) {
      this.updateRequest("Advanced/Stereos/" + t, "DELETE", {}, !0, e)
    }
;
var Advanced_Stereo = function(s) {
  var e = "6389664A-CA5F-E711-AFA7-005056B50E11";
  AdvancedDialog.apply(this, [s, "TSX", e]);
  var l, a = {
    en: {
      mark_count: "MarkCount:",
      confirm_clear: "Confirm Clear",
      confirm_clear_desc: "Delete all mark, this operation is irrevocable.",
      step1: {
        title: "1. Draw ROI",
        tip: "Please draw ROI from the annotation menu."
      },
      step2: {
        title: "2. Disector Configuration",
        width: "CountingFrameWidth(um):",
        height: "CountingFrameHeight(um):",
        auto: "AutoLayout:",
        horizonal: "Horizonal(um):",
        vertical: "Vertical(um):",
        count: "CountingFrame:",
        scale: "Scale:",
        avg_th: "AVGThickness(um):",
        tip1: "Scan ",
        tip2: " tier,space ",
        tip3: " um,scan thickness ",
        tip4: " um.Slide thickness must be within the scope of the scan thickness.",
        tip: "Need to set a sufficient range of ROI, and reasonably configure the parameters of the disector to ensure that there are more than one counting frame for cell mark."
      },
      step3: {
        title: "3. Mark Cells",
        style: "MarkStyle:",
        nav: "Navigation:",
        redo: "Redo",
        undo: "Undo",
        clear: "ClearAll",
        m2t: "Use mouse wheel change tier"
      },
      step4: {
        title: "4. Result",
        area: "ROIArea(um²):",
        volume: "ROIVolume(um³):",
        density: "CellDensity:",
        totalCount: "CellCount:"
      }
    },
    zh: {
      mark_count: "标记细胞数：",
      confirm_clear: "确认删除",
      confirm_clear_desc: "将删除全部标记，此操作不可撤销。",
      step1: {
        title: "1. 绘制ROI选区",
        tip: "请从标注菜单中选择并绘制ROI"
      },
      step2: {
        title: "2. 配置Disector体视框",
        width: "计数框宽度(um)：",
        height: "计数框高度(um)：",
        auto: "自动布局：",
        horizonal: "水平间距(um)：",
        vertical: "垂直间距(um)：",
        others: "其它选项",
        count: "计数框总数：",
        scale: "缩减倍数：",
        avg_th: "切片厚度(um)：",
        tip1: "共扫描",
        tip2: "层，间隔",
        tip3: "um，扫描厚度",
        tip4: "um。切片厚度应在扫描厚度范围内。",
        tip: "需设置足够的ROI范围，并合理配置体视框参数，以保证有1个以上的计数框，才能进行细胞标记。"
      },
      step3: {
        title: "3. 标记细胞",
        style: "标记样式：",
        nav: "计数框导航：",
        redo: "重做",
        undo: "撤销",
        clear: "清除所有",
        m2t: "&nbsp使用鼠标滚轮切换层"
      },
      step4: {
        title: "4. 统计结果",
        area: "ROI面积(um²)：",
        volume: "ROI体积(um³)：",
        density: "细胞体数密度：",
        totalCount: "ROI内细胞总数："
      }
    }
  }, d = .7, t = this, c = '<ul class="stereo">        <li class="active" data-index="0"><h5  data-lang="step1.title"></h5>            <div><span class="arrow1"//><span data-lang="step1.tip"/></div>        </li>        <li data-index="1"><h5 data-lang="step2.title"></h5>            <div>            <span class="arrow1"/>            <form><table>            <tr><td><nobr data-lang="step2.width"></nobr></td><td><input name="width" type="text"></td></tr>            <tr><td><nobr data-lang="step2.height"></nobr></td><td><input name="height" type="text"></td></tr>            <tr><td class="space"></td></tr>            <tr><td><nobr data-lang="step2.auto"></nobr></td><td><input name="autoSpace" type="checkbox"></td></tr>            <tr class="space hidden"><td><nobr data-lang="step2.horizonal"></nobr></td><td><input name="xSpace" type="text"></td></tr>            <tr class="space hidden"><td><nobr data-lang="step2.vertical"></nobr></td><td><input name="ySpace" type="text"></td></tr>            <tr><td><nobr data-lang="step2.scale"></nobr></td><td><input name="scale" type="number" min="1" step="1"></td></tr>            <tr><td><nobr data-lang="step2.count"></nobr></td><td id="stereoCount"></td></tr>            <tr><td colspan="3" class="note"><span data-lang="step2.tip"/></td></tr>            <tr><td class="space"></td></tr>            <tr><td><nobr data-lang="step2.avg_th"></nobr></td><td><input name="avgThickness" type="text"></td></tr>            <tr><td colspan="3" class="note hidden"><span data-lang="step2.tip1"/><span id="tierCount"/><span data-lang="step2.tip2"/><span id="tierSpace"/><span data-lang="step2.tip3"/><span id="oThickness"/><span data-lang="step2.tip4"/></td></tr>            </table></form>            </div>        </li>        <li data-index="2">            <h5 data-lang="step3.title"></h5>            <div class="mark">                <span class="arrow1"/>                <table style="width:100%">                <tr><td data-lang="mark_count"></td><td class="mark-btn"><span id="markCellCount"/><span class="pull-right">                <button data-val="-1" disabled data-title="step3.undo" class="btn btn-xs btn-default"><i class="ico undo"/></button>                <button data-val="1" disabled data-title="step3.redo" class="btn btn-xs btn-default"><i class="ico redo"/></button>                <button data-val="0" disabled data-title="step3.clear" class="btn btn-xs btn-default"><i class="ico clear"></button></span></td></tr>                <tr><td data-lang="step3.style"></td><td class="mark-style"><button id="s_plus" class="active btn btn-sm btn-default" style="color: red">✚</button><button id="s_circle" style="color: yellow" class="btn btn-xs btn-default">○</button><button id="s_star"  style="color: blue" class="btn btn-xs btn-default">★</button><button id="s_dot" style="color: green" class="btn btn-xs btn-default">●</button></td></tr>                <tr><td data-lang="step3.nav"></td><td class="mark-nav"><button id="pre" class="btn btn-xs btn-default"><i class="ico arrow-left"/></button><span style="margin:0 10px;" id="stepText"/><button id="next" class="btn btn-xs btn-default"><i class="ico arrow-right"/></button></td></tr>                <tr><td colspan="2" class="text-left"><input type="checkbox" checked="true" id="wheel4Tier"><label for="wheel4Tier" data-lang="step3.m2t" style="font-weight:normal;margin:0;"></label></td></tr>                </table>            </div>        </li>        <li data-index="3"><h5 data-lang="step4.title"></h5>            <div style="margin-bottom:-9px;border-bottom:0;">                <span class="arrow1"/>                <table>                <tr><td data-lang="step4.area"></td><td id="roiArea">0</td></tr>                <tr><td data-lang="step4.volume"></td><td id="roiVolume">0</td></tr>                <tr><td data-lang="mark_count"></td><td id="markCellCount2">0</td><td></td></tr>                <tr><td data-lang="step4.density"></td><td id="cellDensity"></td><td></td></tr>                <tr><td data-lang="step4.totalCount"></td><td id="cellCount"></td><td></td></tr>                </table>            </div>        </li>    </ul>', u = (c = $(c)).find("form"), h = !1, p = 0, v = [], g = 0, r = 1, o = [0, 0], f = [], m = 0, b = s.getShapeCanvas(), n = b.getCommonCanvas(), y = n.getContext("2d"), x = s.getCurrentImage().tierCount, S = s.getCurrentSlide().baseImage.tierSpacing, k = Math.round((x - 1) * S * 1e4) / 1e4, C = {
    autoSpace: !0,
    avgThickness: k,
    height: 200,
    width: 200,
    xSpace: 1e3,
    ySpace: 1e3,
    scale: 1
  };
  function T() {
    MedLang.interpretElem(c, a),
        c.find("[data-title]").attr("title", function() {
          return MedLang.getString($(this).attr("data-title"), a)
        }),
    1 < x && (c.find(".note").removeClass("hidden"),
        c.find("#tierCount").html(x),
        c.find("#tierSpace").html(S),
        c.find("#oThickness").html(k)),
        c.delegate("li", "click", function() {
          var t = parseInt($(this).attr("data-index"));
          if (p < t) {
            for (var e = 1 < t - p, a = p + 1; a <= t; a++)
              if (!N(a, e))
                return !1
          } else
            t < p && N(t)
        }),
        c.find("input").bind("change", function() {
          if ("checkbox" == this.type) {
            if (this.checked) {
              var t = O();
              u[0].xSpace.value = t.xSpace,
                  u[0].ySpace.value = t.ySpace
            }
            c.find("tr.space").toggleClass("hidden")
          } else
            "width" == this.name && (u[0].height.value = this.value);
          u[0].xSpace.value < u[0].width.value && (u[0].xSpace.value = u[0].width.value),
          u[0].ySpace.value < u[0].height.value && (u[0].ySpace.value = u[0].height.value),
              O(u.serializeObject()),
              w(g)
        }),
        c.find(".mark-btn").delegate("button", "click", function() {
          !function(t) {
            switch (t) {
              case -1:
                0 < m && q(f[--m], "DEL");
                break;
              case 1:
                m < f.length && q(f[++m - 1], "ADD");
                break;
              case 0:
                return MsgBox.confirm(MedLang.getString("confirm_clear", a), MedLang.getString("confirm_clear_desc", a), function() {
                  for (var t = 0; t < m; t++)
                    q(f[t], "DEL");
                  m = f.length = 0,
                      b.renderCommonCanvas(),
                      G(m, f)
                })
            }
            b.renderCommonCanvas(),
                G(m, f)
          }(parseInt($(this).attr("data-val")))
        }),
        c.find(".mark-style").delegate("button", "click", function() {
          J(this.id),
              C.style = this.id,
              M()
        }),
        c.find(".mark-nav").delegate("button", "click", function() {
          Y(this.id)
        });
    var i, r = c.find("#wheel4Tier")[0], o = null;
    $(n).mousewheel(function(t, e, a, n) {
      if (2 == p && r.checked && h)
        return null == o && (i = 0),
            i -= n,
            clearTimeout(o),
            o = setTimeout(function() {
              o = null;
              var t = s.getCurrent3DTierIndex() + (0 < i ? 1 : -1);
              t < 0 ? t = 0 : x - 1 < t && (t = x - 1),
                  s.change3DTierIndex(t)
            }, 200),
            !1
    })
  }
  function w() {
    $("#stereoCount").html(g)
  }
  this.bind("init", function() {
    t.initDialog(t.title, c),
        T(),
        b.bind("renderComCav", function() {
          if (h) {
            !function() {
              var t = 0
                  , e = b.getAnnotations();
              if (e.length !== V) {
                for (var a = v.length, n = v.length = 0; n < e.length; n++)
                  e[n].isROI && e[n].isROI() && v.push(e[n]);
                V = e.length,
                    a > v.length ? t = -1 : a < v.length && (t = 1)
              }
              if (F) {
                F = !1;
                for (n = g = 0; n < v.length; n++)
                  g += W(v[n])
              } else {
                var i = b.getActiveShape();
                if (null != i && i.isEndDrawing && i.isROI && i.isROI() && (i.isSelected || 0 != t)) {
                  var r, o = i.stereo ? i.stereo.points.length : 0;
                  t < 0 ? g -= o : (r = W(i)) != o && (g += r - o,
                      t++)
                }
              }
              0 != t && function(t) {
                0 == t.length && 0 < p ? N(0) : 0 < t.length && 0 == p ? N(1) : 1 == p && w()
              }(v)
            }();
            for (var t = 0; t < v.length; t++) {
              K(v[t])
            }
            y.globalAlpha = d;
            for (t = 0; t < m; t++) {
              var e = imgToCanvasPoint(f[t], b.getCavScale(), b.getCavOffset(), s.rotate(), b.getRotateOriginPoint(), !0);
              l(e)
            }
            y.globalAlpha = 1
          }
        }),
        t.bind("close", function() {
          j(!1)
        }),
        J(C.style)
  });
  var P = 0;
  function A() {
    0 < P++ && (j(!0),
    p < 1 && N(1))
  }
  this.bind("show", A),
      setTimeout(function() {
        s.provider.getAppConfig(e, function(t) {
          if (P = 1,
              F = !0,
              t.success)
            if (t.data) {
              var e = t.data
                  , a = e.conf
                  , n = e.marks;
              a.width && (a.avgThickness > k && delete a.avgThickness,
                  $.extend(C, a));
              for (var i = 0; i < n.length; i++) {
                var r = n[i]
                    , o = new SeadragonPoint(r.x,r.y);
                o.id = r.id,
                    f.push(o),
                    m++
              }
              G(m, f),
                  A()
            } else
              A()
        })
      }, 500);
  var I = null;
  function M() {
    clearTimeout(I),
        I = setTimeout(function() {
          var t = $.extend({}, C);
          t.autoSpace && (delete t.xSpace,
              delete t.ySpace),
              s.provider.updateAppConfig(e, JSON.stringify({
                conf: t,
                marks: f.slice(0, m)
              }), function(t) {
                console.log(t)
              })
        }, 2e3)
  }
  function O(t) {
    return t && ($.extend(C, t),
        C.autoSpace = !!t.autoSpace,
        F = !0,
        s.getShapeCanvas().renderCommonCanvas(),
        M()),
        C
  }
  var R = 0
      , _ = !1;
  function D(t) {
    var e = R;
    if (R = 0,
    h && _ && !(2 < e)) {
      for (var a = getXYfromEvent(t), n = b.getCavPosition(), i = new SeadragonPoint(a[0].x - n.x,a[0].y - n.y), r = cavToImagePoint(i, b.getCavScale(), b.getCavOffset(), -s.rotate(), b.getRotateOriginPoint(), !0), o = 0; o < m; o++)
        if (f[o].distanceTo(r) < 5)
          return;
      f.length = m++,
          r = new SeadragonPoint(Math.round(r.x),Math.round(r.y)),
          f.push(r),
          G(m, f),
          y.globalAlpha = d,
          l(i),
          y.globalAlpha = 1,
      null == I && M(),
          q(r, "ADD")
    }
  }
  function q() {
    M()
  }
  var E, z = !1;
  function L(t) {
    t && !z && (z = !0,
        $(n).bind("click", D).bind("touchstart mousedown", function(t) {
          R = 1,
              E = t
        }).bind("touchmove mousemove", function(t) {
          0 < R && R++
        }).bind("touchend", function() {
          D(E)
        })),
        _ = t
  }
  var V = 0
      , F = !0;
  function W(t) {
    t.stereo || (t.stereo = {},
        t.stereo.points = []);
    var e = cavToImagePoint(t.leftTopPoint || t.rsPoint, t.cavScale, t.cavOffset, -t.rotateRadian, t.rotateOriginPoint, !0)
        , a = cavToImagePoint(t.rightBottomPoint || t.rePoint, t.cavScale, t.cavOffset, -t.rotateRadian, t.rotateOriginPoint, !0);
    if (a.x < e.x) {
      var n = e;
      e = a,
          a = n
    }
    var i = a.x - e.x
        , r = a.y - e.y;
    C.autoSpace && (C.xSpace = 7 * C.width,
        C.ySpace = Math.round(C.xSpace / i * r * 1e4) / 1e4);
    var o = C.xSpace
        , s = C.ySpace;
    o /= t.calibration,
        s /= t.calibration;
    var l = o / 2 + e.x
        , d = s / 2 + e.y
        , c = t.stereo.points;
    c.length = 0;
    var u = 1;
    1 < parseInt(C.scale) && (u = Math.ceil(Math.sqrt(parseInt(C.scale))));
    for (var h = l, p = 0; h < a.x; h += o,
        p++)
      if (p % u == 0)
        for (var v = d, g = 0; v < a.y; v += s,
            g++)
          if (g % u == 0) {
            var f = new Point(h,v);
            t.isInArea(f) && c.push(f)
          }
    return c.length
  }
  function j(t) {
    h != t && (h = t,
        F = !0,
        s.getShapeCanvas().renderCommonCanvas())
  }
  var B = !0;
  function N(t, e) {
    switch (L(!1),
        t) {
      case 0:
        break;
      case 1:
        if (0 == v.length)
          return !1;
        var a = O()
            , n = u[0];
        n.width.value = a.width,
            n.height.value = a.height,
            n.autoSpace.checked = a.autoSpace,
        a.autoSpace || c.find(".space").removeClass("hidden"),
            n.xSpace.value = a.xSpace,
            n.ySpace.value = a.ySpace,
            n.scale.value = a.scale,
            n.avgThickness.value = a.avgThickness,
            w(),
            B = !0;
        break;
      case 2:
        if (L(!0),
        !e && !1 === Y(B))
          return;
        B = !1;
        break;
      case 3:
        var i = function() {
          for (var t = m / (C.width * C.height * v.length * C.avgThickness), e = 0, a = 0; a < v.length; a++)
            e += v[a].area();
          var n = e * C.avgThickness;
          return {
            area: e,
            volume: n,
            markCount: m,
            density: t,
            count: t * n
          }
        }();
        $("#roiArea").text(Math.round(i.area)),
            $("#roiVolume").text(Math.round(i.volume)),
            $("#markCellCount2").text(i.markCount),
            $("#cellDensity").text(Math.round(1e8 * i.density) / 1e8),
            $("#cellCount").text(Math.round(100 * i.count) / 100)
    }
    return c.find("li").removeClass("ok").removeClass("active").eq(t).addClass("active").prevAll().addClass("ok"),
        p = t,
        !0
  }
  var U = c.find(".mark-btn button[data-val=-1]")
      , H = c.find(".mark-btn button[data-val=1]")
      , X = c.find(".mark-btn button[data-val=0]");
  function G(t, e) {
    0 == t && t == e.length ? (U.attr("disabled", "true"),
        H.attr("disabled", "true"),
        X.attr("disabled", "true")) : (t == e.length ? (U.removeAttr("disabled"),
        H.attr("disabled", "true")) : (0 == t ? U.attr("disabled", "true") : U.removeAttr("disabled"),
        H.removeAttr("disabled")),
        X.removeAttr("disabled")),
        c.find("#markCellCount").html(t)
  }
  function J(t) {
    switch (t) {
      case "s_dot":
        l = tt;
        break;
      case "s_circle":
        l = et;
        break;
      case "s_star":
        l = Z;
        break;
      default:
        l = at,
            t = "s_plus"
    }
    c.find(".mark-style>button").removeClass("active"),
        c.find("#" + t).addClass("active"),
        b.renderCommonCanvas()
  }
  function Y(t, e) {
    var a = v;
    "pre" == t ? (--o[1] < 0 && (--o[0] < 0 && (o[0] = a.length - 1),
        o[1] = a[o[0]].stereo.points.length - 1),
    !e && --r < 1 && (r = g)) : "next" == t ? (++o[1] >= a[o[0]].stereo.points.length && (o[1] = 0,
    ++o[0] >= a.length && (o[0] = 0)),
    !e && ++r > g && (r = 1)) : (o[1] >= a[o[0]].stereo.points.length && (o[1] = 0),
    o[0] >= a.length && (o[0] = 0)),
    t && s.change3DTierIndex(0);
    var n = s.getCurrentImage().width
        , i = a[o[0]].stereo.points[o[1]];
    if (!i)
      return 0 < g && (!0 === t && o[0]++,
          Y(t, !0)),
          !1;
    i = new Point(i.x / n,i.y / n),
        s.zoomToObj(s.getCurrentImage().scanObjective),
        s.viewport.panTo(i),
        c.find("#stepText").html(r + "/" + g)
  }
  function K(t) {
    for (var e = t.stereo.points, a = C.width / t.calibration * t.cavScale, n = C.height / t.calibration * t.cavScale, i = 0; i < e.length; i++)
      Q(y, t.toCanvasPoint(e[i]), a, n)
  }
  function Q(t, e, a, n) {
    a *= .5,
        n *= .5,
        t.save(),
        t.beginPath(),
        t.translate(e.x, e.y),
        t.lineWidth = 2,
        t.strokeStyle = "red";
    var i = .1 * (n < a ? n : a);
    t.moveTo(-i, 0),
        t.lineTo(i, 0),
        t.moveTo(0, -i),
        t.lineTo(0, i),
        t.moveTo(-a, -2 * n),
        t.lineTo(-a, n),
        t.lineTo(a, n),
        t.lineTo(a, 2 * n),
        t.stroke(),
        t.beginPath(),
        t.strokeStyle = "green",
        t.moveTo(-a, -n),
        t.lineTo(a, -n),
        t.lineTo(a, n),
        t.stroke(),
        t.restore()
  }
  function Z(t) {
    var e = Math.PI / 2 * 3
        , a = t.x
        , n = t.y
        , r = a
        , o = n
        , s = Math.PI / 5;
    for (y.beginPath(),
             y.moveTo(a, n - 2),
             i = 0; i < 5; i++)
      r = a + 2 * Math.cos(e),
          o = n + 2 * Math.sin(e),
          y.lineTo(r, o),
          e += s,
          r = a + 1 * Math.cos(e),
          o = n + 1 * Math.sin(e),
          y.lineTo(r, o),
          e += s;
    y.lineTo(a, n - 2),
        y.closePath(),
        y.lineWidth = 5,
        y.strokeStyle = "blue",
        y.stroke()
  }
  function tt(t) {
    y.beginPath(),
        y.fillStyle = "green",
        y.arc(t.x, t.y, 5, 0, 2 * Math.PI, !1),
        y.fill()
  }
  function et(t) {
    y.beginPath(),
        y.lineWidth = 4,
        y.strokeStyle = "yellow",
        y.arc(t.x, t.y, 4, 0, 2 * Math.PI, !1),
        y.stroke()
  }
  function at(t) {
    y.save(),
        y.beginPath(),
        y.lineWidth = 2,
        y.strokeStyle = "red",
        y.translate(t.x, t.y);
    y.moveTo(-5, 0),
        y.lineTo(5, 0),
        y.moveTo(0, -5),
        y.lineTo(0, 5),
        y.stroke(),
        y.restore()
  }
};
SV_APPS.push({
  premise: function() {
    return SlideViewerSupport.canvas
  },
  instance: Advanced_Stereo
});
//# sourceMappingURL=stereo_investigator.js.map

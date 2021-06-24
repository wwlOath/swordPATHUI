var Advanced_slideSearch = function(l) {
  AppBase.apply(this, [l, "630F8B63-CA5F-E711-AFA7-005056B50E11", "is"]);
  var o = {
    zh: {
      detail: "搜索20倍，以当前视野为中心，1536x1536像素尺寸的相似区域。",
      search: "搜索",
      cancel: "取消"
    },
    en: {
      detail: "Search under 20X, with the current view as the center, 1536x1536 pixel size of the area.",
      search: "Search",
      cancel: "Cancel"
    }
  }
      , u = this
      , h = $.query.get("R")
      , b = !1
      , g = l.getCurrentImage()
      , m = '<div>        <p data-lang="detail"></p>        <div class="search-regions"></div>        <div class="text-right">            <form target="_blank" method="post" style="display: inline-block;margin-bottom: 5px">            <input type="hidden" name="slideId">            <input type="hidden" name="taskId">            <input type="hidden" name="page" value="1">            <input type="hidden" name="c" value="0">            <input type="hidden" name="storageId">            <input type="hidden" name="tier">            <input type="hidden" name="imageId">            <input type="hidden" name="groupSize">            <input type="hidden" name="scanObject">            <input type="hidden" name="tileSize">            <input type="hidden" name="width">            <input type="hidden" name="height">            <input type="hidden" name="cx">            <input type="hidden" name="cy">            <button id="btn1" class="btn btn-primary app_btn" type="button"><span data-lang="search"></span><span class="app_pro" ></span></button>            <button id="submit" class="hidden"></button>             </form>            <button type="button" class="btn btn-primary app_cancel" data-lang="cancel" disabled ></button>        </div>    </div>'
      , v = new TaskList(l,u.appId,{
    selectable: function(e) {
      return !1
    }
  });
  this.bind("init", function() {
    m = $(m),
        u.initDialog(u.title, m, v.elmt),
        MedLang.interpretElem(m, o),
        m.find("#btn1").bind("click", function() {
          if (u.getAppStatus()) {
            var e = "search_" + (new Date).getTime();
            window.open("about:blank", e);
            n.target = e,
                u.createAppTask({}, function(e) {
                  n.taskId.value = e.id,
                      m.find("#submit").click()
                })
          }
        }),
        m.find(".app_cancel").bind("click", function() {
          u.updateTaskStatus("CANCEL")
        });
    var n = m.find("form").bind("submit", function(e) {
      var t = l.getCurrentSlide()
          , a = l.viewport.getCenter(!0).times(l.getCurrentImage().width);
      n.slideId.value = t.id,
          n.storageId.value = t.storageId,
          n.imageId.value = g.id,
          n.groupSize.value = t.groupSize,
          n.scanObject.value = g.scanObjective,
          n.tileSize.value = g.tileSize,
          n.width.value = g.width,
          n.height.value = g.height,
          n.cx.value = parseInt(a.x),
          n.cy.value = parseInt(a.y),
          n.tier.value = l.getCurrent3DTierIndex(),
          n.tier.disabled = !(1 < t.baseImage.tierCount)
    }).attr("action", "/MoticGallery/Search")[0];
    if (u.registerNewTask(),
        h) {
      for (var e = "", t = g.width, a = 0; a < h.length; a++) {
        var i = h[a]
            , d = i.x2 - i.x1 + 1
            , p = i.y2 - i.y1 + 1
            , r = g.scanObjective / i.o
            , s = (i.x1 + d / 2) * r / t
            , c = (i.y1 + p / 2) * r / t;
        e += ['<span data-o="' + i.o + '" data-x="', s, '" data-y="', c, '">', a + 1, "</span>"].join("")
      }
      e += '<div class="clearfix"></div>',
          m.find(".search-regions").append(e).delegate("span", "click", function() {
            var e = $(this);
            l.zoomToObj(parseInt(e.attr("data-o"))),
                l.viewport.panTo(new SeadragonPoint(parseFloat(e.attr("data-x")),parseFloat(e.attr("data-y"))))
          }).find("span").eq($.query.get("ri")).click(),
          b = !0
    }
  }),
      this.bind("show", function() {
        b || (b = !1,
            l.zoomToObj(20))
      }),
      this.progressUI = function(e, t, a) {
        m.find(".app_btn").prop("disabled", e),
            m.find(".app_pro").html(e ? "(" + a + ")" : ""),
            m.find(".app_cancel").prop("disabled", !e)
      }
      ,
  h && setTimeout(function() {
    u.show()
  }, 100)
};
SV_APPS.push({
  premise: function() {
    return !0
  },
  instance: Advanced_slideSearch
});
//# sourceMappingURL=similar_slide_search.js.map

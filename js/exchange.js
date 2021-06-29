var Advanced_Exchange = function(t) {
  AppBase.apply(this, [t, "E712329A-C94D-E811-B7D9-005056B50E11", "exchange"]);
  var i, s, a, c = {
    zh: {
      link: "复制分享此地址",
      online: "在线人数：",
      btn_close: "停止",
      expired: "已失效",
      tip_del: "确认停止同步浏览",
      duplex: "允许浏览者移动"
    },
    en: {
      link: "Copy share link",
      online: "Online: ",
      btn_close: "Stop",
      expired: "Expired",
      tip_del: "Confirm stop browsing",
      duplex: "Allow visitors move"
    }
  }, o = '<div><div class="text-center" style="position:relative"><img style="max-width: 160px"><div><a class="exc_url" data-lang="link" target="_blank"></a>    </div><label class="checkbox" style="text-align:left;margin-left:20px;margin-bottom:0;"><input type="checkbox"><span data-lang="duplex"></span></label>    <div class="exc_shade exc_disable" data-lang="expired"></div><div class="exc_shade exc_del"><button class="btn btn-danger app_close" data-lang="tip_del"></button></div></div>    </div>', d = '<div class="text-right  footer-wrap"><span class="pull-left" style="margin-top: 8px;"><span data-lang="online"></span><span class="ex_count">0</span></span>    <button type="button" class="btn btn-danger app_close" data-lang="btn_close"></button></div>', l = this, p = t.getCurrentSlide().id;
  o = $(o);
  var e = t.provider.getExtPromise();
  this.bind("init", function() {
    function e() {
      clearTimeout(a),
          a = setTimeout(function() {
            s.fadeOut("fast", function() {
              s.css("display", "")
            })
          }, 2e3)
    }
    d = $(d),
        MedLang.interpretElem(o, c),
        MedLang.interpretElem(d, c),
        l.initDialog(l.title, o, d),
        s = o.find(".exc_del").bind("mouseenter", function() {
          clearTimeout(a)
        }).bind("mouseleave", e),
        o.find(".app_close").bind("click", h);
    var n = o.find("input[type=checkbox]").bind("change", function() {
      this.checked,
          t.provider.send("/Tasks/" + i + "/Exchange/" + p + "/Event", this.checked ? "DUPLEX" : "SIMPLEX")
    })[0];
    d.find(".app_close").bind("click", function() {
      i && (s.show(),
          e())
    }),
        t.exchange.registerStatus(function(e) {
          d.find(".ex_count").html(e.count),
              n.checked = e.duplex
        })
  });
  var n = 0;
  function r() {
    3 == n && (i ? u() : function(n) {
      l.getAppStatus() && l.createAppTask({
        slides: null
      }, function(e) {
        x(i = e.id),
            o.find(".exc_disable").hide(),
            t.exchange.setTaskId(i),
        "function" == typeof n && n()
      })
    }(u))
  }
  function u() {
    t.provider.send("/Tasks/" + i + "/Exchange/" + p + "/Event", "START"),
        t.exchange.start(i)
  }
  function h() {
    i && (t.provider.send("/Tasks/" + i + "/Exchange/" + p + "/Event", "FINISHED"),
        t.exchange.stop(),
        o.find(".exc_disable").show(),
        l.hide(!0),
        i = null,
        s.css("display", ""))
  }
  function x(i) {
    e.done(function(e) {
      var n = e.syncBrowseUrl
          , t = n + (-1 == n.indexOf("?") ? "?" : "&");
      t += "room=" + i,
          o.find(".exc_url").attr("href", t),
      t.startsWith("http:") || t.startsWith("https:") || t.startsWith("//") || (t = location.protocol + "//" + location.host + t),
          o.find("img").attr("src", "/MoticKit/Utils/QR/" + i + ".png?content=" + encodeURIComponent(t))
    })
  }
  this.bind("show", function() {
    n |= 1,
        r()
  }),
      t.bind("SlideTasks", function() {
        n |= 2,
            r()
      }),
      this.bind("close", function() {
        i && (t.provider.send("/Tasks/" + i + "/Exchange/" + p + "/Event", "PAUSE"),
            t.exchange.pause())
      }),
      l.getTask(function(e) {
        x(i = e.id),
            t.exchange.setTaskId(i),
        "STARTED" == e.status && l.show()
      }),
      this.subscribeTask = function(e, n) {}
      ,
      this.isShowBaseLocal = function(e) {
        return !1
      }
};
SV_APPS.push({
  premise: function() {
    return !0
  },
  instance: Advanced_Exchange
});
//# sourceMappingURL=exchange.js.map

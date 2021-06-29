var Advanced_mpcc = function(u) {
  AdvancedDialog.apply(this, [u, "mpcc", "D6C7AFC6-947E-E811-9AD9-005056B50E11"]);
  var p = {
    en: {
      disabled: "Only support with MoticFlow",
      setting: {
        title: "Slide image adjustment",
        adjust_case: "Case",
        adjust_hos: "Using hospital default adjustment",
        adjust_save: "Using default adjustment and saved"
      },
      slide: {
        title: "Case slide"
      },
      capture: {
        title: "Case capture",
        btn: "Capture"
      },
      ihc: {
        title: "IHC",
        stain: "Stain：",
        result: "Result："
      },
      cyto: {
        title: "TBS Report",
        Specimen: "Specimen：",
        result: "Result："
      },
      histo: {
        title: "Diagnosis"
      }
    },
    zh: {
      disabled: "该应用仅支持在远程会诊系统中使用",
      setting: {
        title: "切片图像调节",
        adjust_case: "病例",
        adjust_hos: "医院默认图像调节参数",
        adjust_save: "已应用默认图像调节参数，并保存成功。"
      },
      slide: {
        title: "病例切片"
      },
      capture: {
        title: "病例截图",
        btn: "截图"
      },
      ihc: {
        title: "免疫组化",
        stain: "抗体：",
        result: "结果："
      },
      cyto: {
        title: "TBS报告",
        Specimen: "标本：",
        result: "结果："
      },
      histo: {
        title: "诊断意见"
      }
    }
  }
      , h = this
      , f = u.getCurrentSlide().id
      , v = '<ul class="stereo mpcc hidden" style="margin-bottom:-9px;border-bottom:0;">        <li class="settting hidden1" data-index="0"><h5  data-lang="setting.title"></h5>            <div><span class="arrow1"></span>                <div class="adjust">                    <label><input type="checkbox" data-index="2"> <span data-lang="setting.adjust_hos"></span></label>                </div>            </div>        </li>        <li class="slide hidden" data-index="1"><h5 data-lang="slide.title"></h5>            <div style="padding:0"><span class="arrow1"></span><div class="relevant-slides hy"><table><tr></tr></table></div></div>        </li>        <li class="capture" data-index="2"><h5 ><span data-lang="capture.title"></span><button class="btn btn-primary btn-xs pull-right" data-lang="capture.btn"></button></h5>            <div><span class="arrow1"></span><ul class="snapshots"></ul></div>        </li>        <li class="ihc hidden" data-index="3"><h5 data-lang="ihc.title"></h5>            <div><span class="arrow1"></span>            <div style="display: inline-block;padding-right: 20px;"><table><tr><td data-lang="ihc.stain"></td><td>Ki-67</td><td style="width:15px;"> </td><td data-lang="ihc.result"></td><td><select><option>+++</option></select></td></tr></table></div>            </div>        </li>         <li class="cyto hidden" data-index="4"><h5 ><span data-lang="cyto.title"></span></h5>            <div><span class="arrow1"></span>            <ul class="list-unstyled rpt-items"><form><fieldset>            </fieldset></form></ul></div>        </li>        <li class="histo hidden" data-index="4"><h5 data-lang="histo.title"></h5>            <div style="border-bottom: 0;"><span class="arrow1"></span>            <form><fieldset><ul class="list-unstyled rpt-items">            </ul></fieldset></form></div>        </li>    </ul>';
  v = $(v);
  this.isShowBaseLocal = function(t) {
    return null != t && 0 != t
  }
      ,
      this.bind("init", function() {
        MedLang.interpretElem(v, p),
            h.initDialog(h.title, v),
            v.before("<span>" + MedLang.getString("disabled", p) + "</span>").addClass("hidden"),
            u.provider.getExtPromise().done(function(t) {
              t.caseId && (function(t) {
                g = t.caseId;
                var e = t.nodeId
                    , i = $.query.get("mpcc_dis");
                if (0 < i)
                  for (var a = i, n = 0; 0 < a; a >>= 1,
                      n++)
                    !0 & a && (v.find("li[data-index=" + n + "]").addClass("hidden"),
                    4 == n && v.find(".capture>div").css("borderBottom", "0"));
                var s = parseInt(h.data("collapse"));
                isNaN(s) && (s = 65535);
                v.delegate("li>h5", "click", function() {
                  var t = $(this)
                      , e = t.parent().toggleClass("active").attr("data-index");
                  1 == e && t.parent().find(".relevant-slides").trigger("scroll"),
                      e = Math.pow(2, e),
                      (s & e) == e ? s -= e : s |= e,
                      h.data("collapse", s)
                });
                for (a = s,
                         n = 0; 0 < a; a >>= 1,
                         n++)
                  !0 & a && v.find("li[data-index=" + n + "]").addClass("active");
                var o = parseInt(h.data("adjust") || 0);
                if (3 < o)
                  for (a = o,
                           n = 0; 0 < a; a >>= 1,
                           n++)
                    !0 & a && (v.find(".adjust input[data-index=" + n + "]").prop("checked", !0),
                    2 == n && v.find(".adjust input[data-index=1]").prop("disabled", !0));
                k(o, e, g);
                var r = v.find(".adjust input").bind("change", function() {
                  o = 0,
                      r.each(function() {
                        if (this.checked) {
                          var t = parseInt($(this).attr("data-index"));
                          o |= Math.pow(2, t)
                        }
                      }),
                      h.data("adjust", o),
                      k(o, e, g)
                });
                u.bind("m.SaveImageAdjust", function(t) {
                  w && t.isEquals(w) && (w = null,
                      u.showMessage(MedLang.getString("setting.adjust_save", p))),
                      C.put("C_" + g, t),
                  e && C.put("H_" + e, t)
                }),
                    function(t) {
                      if (1 < t.length) {
                        window.sessionStorage,
                            $.query.remove("i").remove("s").remove("t").remove("x").remove("y").remove("w").remove("h").remove("sia").remove("p").toString();
                        for (var e = v.find(".slide").removeClass("hidden").find("tr"), i = v.find(".relevant-slides"), a = 0; a < t.length; a++) {
                          var n = t[a]
                              , s = n.id.toLowerCase()
                              , o = $(y);
                          o.find("a").attr("href", n.url).attr("title", n.Name).bind("click", function() {
                            u.broadcast({
                              type: "[Page]",
                              idx: this.idx
                            }, 1)
                          })[0].idx = a,
                              o.find("img").attr("data-original", n.imgSrc),
                              o.find(".ref-index").html(a + 1),
                          n.visited && o.find(".ref-index").css("font-weight", "normal"),
                          f == s && (o.find(".relevant-slide").addClass("active"),
                              x = a < t.length - 3 ? a + 2 : t.length - 1),
                              e.append(o),
                          1 < x && x == a && (i[0].scrollLeft = i[0].scrollWidth)
                        }
                        e.find("img").lazyload({
                          container: i
                        }),
                            setTimeout(function() {
                              i.trigger("scroll")
                            }, 10)
                      } else
                        1 == t.length && (t[0].isCurrent = !0)
                    }(t.relevantSlide.slides),
                    v.find(".capture button").bind("click", function(t) {
                      t.stopPropagation(),
                          u.trigger("Capture")
                    }),
                    u.bind("AddSnapshot", function(t) {
                      (g && g == t.case || t.slideId == f) && u.capturer.updateUI(t.id, v.find(".snapshots"))
                    }),
                    u.bind("ListCapture", function() {
                      u.capturer.updateUI(!1, v.find(".snapshots"))
                    }),
                    u.capturer.updateUI(!1, v.find(".snapshots"));
                var l = {}
                    , d = !1
                    , c = "";
                u.bind("mpcc-ui", function(t) {
                  g && g == t.case && !d && (d = !0,
                      c = t.caseType,
                      v.find("." + t.caseType).removeClass("hidden").find("fieldset").append(function(t) {
                        return t && 0 != t.length ? function t(e, i) {
                          var a = "";
                          for (var n = 0; n < e.length; n++) {
                            var s = e[n];
                            switch (a += i ? "<li>" : "<div>",
                            s.title && (a += "<label>" + s.title + "</label>"),
                                s.type) {
                              case "select":
                              case "combox":
                                a += o(s, "combox" == s.type, s.category);
                                break;
                              case "checkbox":
                                a += r(s);
                                break;
                              default:
                                0 < s.children.length && (a += t(s.children))
                            }
                            a += i ? "</li>" : "</div>"
                          }
                          return a
                        }(t, !0) : "";
                        function o(t, e, i) {
                          var a = t.option
                              , n = '<select name="' + t.name + '" ';
                          if (e && (n += ' class="combox"',
                          i && (n += ' data-category="' + i + '"'),
                              n += ' data-replace="' + t.replace + '"'),
                              n += ">",
                              e)
                            for (var s = 0; s < a.length; s++) {
                              var o = a[s];
                              n += '<optgroup label="' + o.title + '">';
                              for (var r = 0; r < o.items.length; r++)
                                n += '<option value="' + o.items[r].val + '">' + o.items[r].key + "</option>";
                              n += "</optgroup>"
                            }
                          else
                            for (s = 0; s < a.length; s++)
                              n += '<option value="' + a[s].val + '">' + a[s].key + "</option>";
                          return n += "</select>"
                        }
                        function r(t) {
                          for (var e = t.option, i = "", a = 0; a < e.length; a++)
                            i += '<div><label><input type="checkbox" name="' + t.name + '" value="' + e[a].val + '">' + e[a].key + "</label></div>";
                          return i
                        }
                      }(t.items)).find("input,select:not(.combox)").bind("change", function() {
                        if ("checkbox" == this.type) {
                          var t = $(this).closest("form").serializeArray()
                              , e = this.name;
                          l[this.name] = $.map(t, function(t) {
                            if (t.name == e)
                              return t.value
                          })
                        } else
                          "SELECT" == this.tagName && (l[this.name] = this.value);
                        b(l)
                      }).end().find("select.combox").each(function() {
                        var t = $(this)
                            , e = $("<span style='cursor: pointer;font-weight: bold;font-size: 110%;'>...</span>");
                        t.before(e),
                            t.mCombox({
                              locale: SlideViewerConfig.locale,
                              optBtn: e,
                              origin: SlideViewerConfig.accountLocal
                            }).bind("change", function(t, e, i) {
                              l[this.name] = {
                                id: e,
                                name: i
                              },
                                  b(l)
                            })
                      }))
                }),
                    u.bind("mpcc-report", function(t) {
                      g && g == t.case && (m = !0,
                          l = $.extend(l, t.items),
                          function(t, e) {
                            for (var i in e) {
                              var a = t[i];
                              if (a) {
                                var n = e[i];
                                Array.isArray(n) ? $.each(a, function() {
                                  this.checked = s(this.value, n)
                                }) : "object" == typeof n ? $(a).mCombox("value", n.name) : a.value = n
                              }
                            }
                            function s(t, e) {
                              for (var i = 0; i < e.length; i++)
                                if (t == e[i])
                                  return !0;
                              return !1
                            }
                          }(v.find("." + c + " form")[0], l))
                    }),
                    u.bind("mpcc-enable", function(t) {
                      v.find("." + c + " fieldset").prop("disabled", !t.enable).find("select.combox").mCombox("disable", !t.enable)
                    }),
                    u.broadcast({
                      type: "mpcc-init",
                      case: g
                    }, 1)
              }(t),
                  v.removeClass("hidden").prev().remove())
            })
      });
  var g, m = !1;
  function b(t) {
    m && u.broadcast({
      type: "mpcc-report",
      case: g,
      items: t
    }, 1)
  }
  var x = 0
      , y = '<td><div class="ref-index"></div><a><div class="relevant-slide hy"><div><img></div></div></a></td>';
  var w, C = new AdjustIDB;
  function k(e, i, t) {
    var a = u.slideImageAdjustments;
    a.getAdjustFactor().isChanged() || C.get("C_" + t, function(t) {
      t ? a.getAdjustFactor().isEquals(t) || (a.update(t, !0),
          w = t) : 0 < (4 & e) && C.get("H_" + i, function(t) {
        t && !a.getAdjustFactor().isEquals(t) && (a.update(t, !0),
            w = t)
      })
    })
  }
};
!function(l) {
  var o = "mCombox"
      , i = {
    locale: "zh_CN",
    inputClass: "",
    disabled: !1,
    placeholder: "",
    defaultId: null,
    value: null,
    optBtn: null,
    replace: 1,
    origin: "",
    sourceUrl: "/MoticAccount/Dict"
  };
  function r(t, e) {
    this.items = [],
        this.elem = l(t),
        this.options = l.extend({}, i, e),
        this.init()
  }
  function d(t, e) {
    return '<li><a style="white-space: normal;cursor: pointer;" data-val="' + t + '">' + e + "</a></li>"
  }
  function c(t) {
    return '<li role="separator" class="divider"><span>' + t + "</span></li>"
  }
  function u(t, e) {
    t.style.height = "1px",
        t.style.height = (t.scrollHeight || 39) + (e ? 2 : 22) + "px"
  }
  l("head").append('<style type="text/css">@charset "UTF-8";.combox-option li.divider{display: none} .combox-option li+li.divider{display: block}</style>'),
      r.prototype = {
        init: function() {
          if (1 === this.options.replace) {
            var t = this.elem.attr("data-replace");
            "true" == t ? this.options.replace = !0 : "false" == t && (this.options.replace = !1)
          }
          var r = this
              , e = l('<div style="position: relative" class="combox-group"><textarea  style="width: 100%;resize: none;" placeholder="' + this.options.placeholder + '" class="' + this.options.inputClass + '"></textarea>        <span style="position: absolute;bottom: 0;right: 0;padding: 0 8px 6px;cursor: pointer;display: none;font-weight: bold;font-size: 110%;">...</span></div>');
          !function(t, e) {
            var i = {
              account: "/Account/Login"
            }
                , a = document.getElementById("login_iframe_" + t);
            if (a)
              return a.callbacks.push(e),
              a.login && n(a.callbacks);
            function n(t) {
              for (var e = 0; e < t.length; e++)
                t[e]();
              t.length = 0
            }
            (a = l("<iframe></iframe>").attr("id", "login_iframe_" + t).bind("load", function() {
              -1 < this.src.indexOf(i[t]) && (a.login = !0,
                  n(a.callbacks))
            }).appendTo("body").attr("src", i[t])[0]).callbacks = [e]
          }("account", function() {
            r._loadRemote(function(t) {
              var e = ""
                  , i = "name_" + r.options.locale;
              e += c("title");
              for (var a = 0; a < t.length; a++)
                e += d(t[a].id, t[a][i]),
                    r._checkAndSetDefault(t[a].id, t[a][i]);
              r.menu.find("ul").append(e),
              0 < t.length && r.btn.show()
            })
          }),
              this.elem.after(e).hide(),
              this.textarea = e.find("textarea").bind("input propertychange", function(t, e) {
                u(this),
                    r.elem.html("").append('<option selected="selected" value="' + this.value + '"></option>'),
                    r.elem.trigger("change", [e, this.value])
              }).val(this.options.value),
              setTimeout(function() {
                r.textarea.trigger("propertychange")
              }, 1);
          var i = this.elem.find("optgroup").remove();
          return this.menu = l(function(a, n, s) {
            var o = '<div style="max-width: 100%;width: 400px;max-height: 500px;"><ul class="dropdown-menu combox-option" style="display: block;float: none;position: relative;border: 0;box-shadow: none;" class1="list-unstyled">';
            return a.each(function(t, e) {
              var i = a.eq(t);
              o += c(i.attr("label")),
                  i.find("option").each(function() {
                    o += d(this.value, this.innerText),
                        n.apply(s, [this.value, this.innerText])
                  })
            }),
                o += "</ul></div>"
          }(i, this._checkAndSetDefault, this)).delegate("a", "click", function(t) {
            var e = l(this)
                , i = e.text()
                , a = i.length;
            if (!r.options.replace) {
              var n = r.textarea.focus().prop("selectionStart")
                  , s = r.textarea.prop("selectionEnd")
                  , o = r.textarea.val();
              i = o.substring(0, n) + i + o.substring(s),
                  a += n
            }
            r.textarea.val(i).trigger("propertychange", e.attr("data-val")),
                r.btn.tooltipster("hide"),
                function(t, e) {
                  if (t.setSelectionRange)
                    t.setSelectionRange(e, e);
                  else if (t.createTextRange) {
                    var i = t.createTextRange();
                    i.collapse(!0),
                        i.moveEnd("character", e),
                        i.moveStart("character", e),
                        i.select()
                  }
                }(r.textarea[0], a)
          }),
              this.btn = l(this.options.optBtn).hide().tooltipster({
                theme: "tooltipster-shadow",
                interactive: !0,
                contentCloning: !1,
                trigger: "click",
                side: ["right", "top", "bottom", "left"],
                delay: 0,
                distance: 0,
                content: this.menu,
                trackOrigin: !0
              }),
          0 < i.find("option").length && (i = null,
              this.btn.show()),
          this.options.disabled && this.disable(!0),
              this
        },
        disable: function(t) {
          return t ? (this.textarea.attr("disabled", "disabled"),
              this.btn.tooltipster("disable")) : (this.textarea.removeAttr("disabled"),
              this.btn.tooltipster("enable")),
              this
        },
        value: function(t, e) {
          if (null == t && null == e)
            return this.textarea.val();
          if (null == t) {
            for (var i = 0, a = this.items; i < a.length; i++)
              if (a[i].id == e) {
                var n = this
                    , s = a[i].id
                    , o = a[i].text;
                setTimeout(function() {
                  n.textarea.val(o).trigger("propertychange", s)
                }, 1);
                break
              }
          } else
            this.textarea.val(t),
                this.options.value = t;
          return u(this.textarea[0]),
              this
        },
        addGroup: function(t, e) {
          for (var i = c(t), a = 0; a < e.length; a++)
            i += d(e[a].id, e[a].text);
          this.menu.find("ul.combox-option").prepend(i),
              this.btn.show()
        },
        _loadRemote: function(t) {
          if (this.options.category || (this.options.category = this.elem.attr("data-category"))) {
            var e = this.options.sourceUrl + "?category=" + this.options.category;
            return l.ajax({
              dataType: "json",
              url: e,
              xhrFields: {
                withCredentials: !0
              },
              success: t
            }),
                this
          }
        },
        _checkAndSetDefault: function(t, e) {
          if (this.items.push({
            id: t,
            text: e
          }),
          null === this.options.value && this.options.defaultId == t) {
            var i = this;
            setTimeout(function() {
              i.textarea.val(e).trigger("propertychange", t)
            }, 1)
          }
        }
      },
      l.fn[o] = function(a) {
        var n = arguments
            , s = "!@~》#$%^";
        return this.map(function() {
          var t = "plugin_" + o;
          l.data(this, t) || l.data(this, t, new r(this,a));
          var e = l(this).data(t);
          if (e[a]) {
            var i = e[a].apply(e, Array.prototype.slice.call(n, 1));
            i !== e && (s = i)
          }
        }),
            "!@~》#$%^" == s ? this : s
      }
}(jQuery);
var AdjustIDB = function() {
  if (window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB,
      window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction,
      window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange,
      window.indexedDB) {
    var n, s = "SV_ImageAdjust", t = window.indexedDB.open("MG", 1), a = [], o = this;
    t.onsuccess = function(t) {
      n = t.target.result;
      for (var e = 0; e < a.length; e++) {
        var i = a[e];
        o[i.type](i.key, i.callback)
      }
    }
        ,
        t.onupgradeneeded = function(t) {
          this.result.createObjectStore(s, {
            keyPath: "id"
          })
        }
        ,
        this.put = function(t, e) {
          var i = n.transaction([s], "readwrite").objectStore(s);
          e.id = t;
          var a = i.put(e);
          a.onerror = function(t) {
            console.error("[IndexedDB]" + t.target.error)
          }
              ,
              a.onsuccess = function(t) {}
        }
        ,
        this.get = function(t, e) {
          if (null != n) {
            var i = n.transaction([s]).objectStore(s).get(t);
            i.onerror = function(t) {
              console.error("[IndexedDB]" + t.target.error)
            }
                ,
                i.onsuccess = function(t) {
                  e(t.target.result)
                }
          } else
            a.push({
              type: "get",
              key: t,
              callback: e
            })
        }
  } else
    console.error("Your browser doesn't support a stable version of IndexedDB. Such and such feature will not be available.")
};
SV_APPS.push({
  premise: function() {
    return !0
  },
  instance: Advanced_mpcc
}),
    SlideProvider.prototype.getContact = function(t, e, i, a) {
      var n = [e, "API/Case/Contact", t, i].join("/");
      this.jsonpRequest(n, new ContactResult, function(t, e) {
        null != e && (t.contacter = e.ContactPerson,
            t.tel = e.Phone,
            t.mobilephone = e.Mobile,
            t.hospital = e.Hospital)
      }, a)
    }
;
//# sourceMappingURL=mpcc.js.map

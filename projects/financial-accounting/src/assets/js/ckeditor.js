/*
Copyright (c) 2003-2018, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
*/
(function() {
  window.CKEDITOR && window.CKEDITOR.dom || (window.CKEDITOR || (window.CKEDITOR = function() {
      var a = /(^|.*[\\\/])ckeditor\.js(?:\?.*|;.*)?$/i,
        d = {
          timestamp: "I3I7",
          version: "4.9.2 (Full)",
          revision: "95e5d83",
          rnd: Math.floor(900 * Math.random()) + 100,
          _: { pending: [], basePathSrcPattern: a },
          status: "unloaded",
          basePath: function() {
            var c = window.CKEDITOR_BASEPATH || "";
            if (!c)
              for (var b = document.getElementsByTagName("script"), d = 0; d < b.length; d++) { var e = b[d].src.match(a); if (e) { c = e[1]; break } } - 1 == c.indexOf(":/") && "//" != c.slice(0,
                2) && (c = 0 === c.indexOf("/") ? location.href.match(/^.*?:\/\/[^\/]*/)[0] + c : location.href.match(/^[^\?]*\/(?:)/)[0] + c);
            if (!c) throw 'The CKEditor installation path could not be automatically detected. Please set the global variable "CKEDITOR_BASEPATH" before creating editor instances.';
            return c
          }(),
          getUrl: function(a) {-1 == a.indexOf(":/") && 0 !== a.indexOf("/") && (a = this.basePath + a);
            this.timestamp && "/" != a.charAt(a.length - 1) && !/[&?]t=/.test(a) && (a += (0 <= a.indexOf("?") ? "\x26" : "?") + "t\x3d" + this.timestamp); return a },
          domReady: function() {
            function a() { try { document.addEventListener ? (document.removeEventListener("DOMContentLoaded", a, !1), c()) : document.attachEvent && "complete" === document.readyState && (document.detachEvent("onreadystatechange", a), c()) } catch (e) {} }

            function c() { for (var a; a = b.shift();) a() }
            var b = [];
            return function(e) {
              function c() { try { document.documentElement.doScroll("left") } catch (f) { setTimeout(c, 1); return } a() } b.push(e);
              "complete" === document.readyState && setTimeout(a, 1);
              if (1 == b.length)
                if (document.addEventListener) document.addEventListener("DOMContentLoaded",
                  a, !1), window.addEventListener("load", a, !1);
                else if (document.attachEvent) { document.attachEvent("onreadystatechange", a);
                window.attachEvent("onload", a);
                e = !1; try { e = !window.frameElement } catch (m) {} document.documentElement.doScroll && e && c() }
            }
          }()
        },
        b = window.CKEDITOR_GETURL;
      if (b) { var c = d.getUrl;
        d.getUrl = function(a) { return b.call(d, a) || c.call(d, a) } }
      return d
    }()), CKEDITOR.event || (CKEDITOR.event = function() {}, CKEDITOR.event.implementOn = function(a) { var d = CKEDITOR.event.prototype,
          b; for (b in d) null == a[b] && (a[b] = d[b]) },
      CKEDITOR.event.prototype = function() {
        function a(a) { var g = d(this); return g[a] || (g[a] = new b(a)) }
        var d = function(a) { a = a.getPrivate && a.getPrivate() || a._ || (a._ = {}); return a.events || (a.events = {}) },
          b = function(a) { this.name = a;
            this.listeners = [] };
        b.prototype = { getListenerIndex: function(a) { for (var b = 0, d = this.listeners; b < d.length; b++)
              if (d[b].fn == a) return b; return -1 } };
        return {
          define: function(c, b) { var d = a.call(this, c);
            CKEDITOR.tools.extend(d, b, !0) },
          on: function(c, b, d, k, e) {
            function h(f, a, e, h) {
              f = {
                name: c,
                sender: this,
                editor: f,
                data: a,
                listenerData: k,
                stop: e,
                cancel: h,
                removeListener: m
              };
              return !1 === b.call(d, f) ? !1 : f.data
            }

            function m() { n.removeListener(c, b) }
            var f = a.call(this, c);
            if (0 > f.getListenerIndex(b)) { f = f.listeners;
              d || (d = this);
              isNaN(e) && (e = 10); var n = this;
              h.fn = b;
              h.priority = e; for (var p = f.length - 1; 0 <= p; p--)
                if (f[p].priority <= e) return f.splice(p + 1, 0, h), { removeListener: m };
              f.unshift(h) }
            return { removeListener: m }
          },
          once: function() {
            var a = Array.prototype.slice.call(arguments),
              b = a[1];
            a[1] = function(a) {
              a.removeListener();
              return b.apply(this,
                arguments)
            };
            return this.on.apply(this, a)
          },
          capture: function() { CKEDITOR.event.useCapture = 1; var a = this.on.apply(this, arguments);
            CKEDITOR.event.useCapture = 0; return a },
          fire: function() {
            var a = 0,
              b = function() { a = 1 },
              l = 0,
              k = function() { l = 1 };
            return function(e, h, m) {
              var f = d(this)[e];
              e = a;
              var n = l;
              a = l = 0;
              if (f) { var p = f.listeners; if (p.length)
                  for (var p = p.slice(0), q, w = 0; w < p.length; w++) { if (f.errorProof) try { q = p[w].call(this, m, h, b, k) } catch (v) {} else q = p[w].call(this, m, h, b, k);!1 === q ? l = 1 : "undefined" != typeof q && (h = q); if (a || l) break } } h =
                l ? !1 : "undefined" == typeof h ? !0 : h;
              a = e;
              l = n;
              return h
            }
          }(),
          fireOnce: function(a, b, l) { b = this.fire(a, b, l);
            delete d(this)[a]; return b },
          removeListener: function(a, b) { var l = d(this)[a]; if (l) { var k = l.getListenerIndex(b);
              0 <= k && l.listeners.splice(k, 1) } },
          removeAllListeners: function() { var a = d(this),
              b; for (b in a) delete a[b] },
          hasListeners: function(a) { return (a = d(this)[a]) && 0 < a.listeners.length }
        }
      }()), CKEDITOR.editor || (CKEDITOR.editor = function() { CKEDITOR._.pending.push([this, arguments]);
        CKEDITOR.event.call(this) }, CKEDITOR.editor.prototype.fire =
      function(a, d) { a in { instanceReady: 1, loaded: 1 } && (this[a] = !0); return CKEDITOR.event.prototype.fire.call(this, a, d, this) }, CKEDITOR.editor.prototype.fireOnce = function(a, d) { a in { instanceReady: 1, loaded: 1 } && (this[a] = !0); return CKEDITOR.event.prototype.fireOnce.call(this, a, d, this) }, CKEDITOR.event.implementOn(CKEDITOR.editor.prototype)), CKEDITOR.env || (CKEDITOR.env = function() {
      var a = navigator.userAgent.toLowerCase(),
        d = a.match(/edge[ \/](\d+.?\d*)/),
        b = -1 < a.indexOf("trident/"),
        b = !(!d && !b),
        b = {
          ie: b,
          edge: !!d,
          webkit: !b &&
            -1 < a.indexOf(" applewebkit/"),
          air: -1 < a.indexOf(" adobeair/"),
          mac: -1 < a.indexOf("macintosh"),
          quirks: "BackCompat" == document.compatMode && (!document.documentMode || 10 > document.documentMode),
          mobile: -1 < a.indexOf("mobile"),
          iOS: /(ipad|iphone|ipod)/.test(a),
          isCustomDomain: function() { if (!this.ie) return !1; var a = document.domain,
              b = window.location.hostname; return a != b && a != "[" + b + "]" },
          secure: "https:" == location.protocol
        };
      b.gecko = "Gecko" == navigator.product && !b.webkit && !b.ie;
      b.webkit && (-1 < a.indexOf("chrome") ? b.chrome = !0 : b.safari = !0);
      var c = 0;
      b.ie && (c = d ? parseFloat(d[1]) : b.quirks || !document.documentMode ? parseFloat(a.match(/msie (\d+)/)[1]) : document.documentMode, b.ie9Compat = 9 == c, b.ie8Compat = 8 == c, b.ie7Compat = 7 == c, b.ie6Compat = 7 > c || b.quirks);
      b.gecko && (d = a.match(/rv:([\d\.]+)/)) && (d = d[1].split("."), c = 1E4 * d[0] + 100 * (d[1] || 0) + 1 * (d[2] || 0));
      b.air && (c = parseFloat(a.match(/ adobeair\/(\d+)/)[1]));
      b.webkit && (c = parseFloat(a.match(/ applewebkit\/(\d+)/)[1]));
      b.version = c;
      b.isCompatible = !(b.ie && 7 > c) && !(b.gecko && 4E4 > c) && !(b.webkit &&
        534 > c);
      b.hidpi = 2 <= window.devicePixelRatio;
      b.needsBrFiller = b.gecko || b.webkit || b.ie && 10 < c;
      b.needsNbspFiller = b.ie && 11 > c;
      b.cssClass = "cke_browser_" + (b.ie ? "ie" : b.gecko ? "gecko" : b.webkit ? "webkit" : "unknown");
      b.quirks && (b.cssClass += " cke_browser_quirks");
      b.ie && (b.cssClass += " cke_browser_ie" + (b.quirks ? "6 cke_browser_iequirks" : b.version));
      b.air && (b.cssClass += " cke_browser_air");
      b.iOS && (b.cssClass += " cke_browser_ios");
      b.hidpi && (b.cssClass += " cke_hidpi");
      return b
    }()), "unloaded" == CKEDITOR.status && function() {
      CKEDITOR.event.implementOn(CKEDITOR);
      CKEDITOR.loadFullCore = function() { if ("basic_ready" != CKEDITOR.status) CKEDITOR.loadFullCore._load = 1;
        else { delete CKEDITOR.loadFullCore; var a = document.createElement("script");
          a.type = "text/javascript";
          a.src = CKEDITOR.basePath + "ckeditor.js";
          document.getElementsByTagName("head")[0].appendChild(a) } };
      CKEDITOR.loadFullCoreTimeout = 0;
      CKEDITOR.add = function(a) {
        (this._.pending || (this._.pending = [])).push(a) };
      (function() {
        CKEDITOR.domReady(function() {
          var a = CKEDITOR.loadFullCore,
            d = CKEDITOR.loadFullCoreTimeout;
          a && (CKEDITOR.status =
            "basic_ready", a && a._load ? a() : d && setTimeout(function() { CKEDITOR.loadFullCore && CKEDITOR.loadFullCore() }, 1E3 * d))
        })
      })();
      CKEDITOR.status = "basic_loaded"
    }(), "use strict", CKEDITOR.VERBOSITY_WARN = 1, CKEDITOR.VERBOSITY_ERROR = 2, CKEDITOR.verbosity = CKEDITOR.VERBOSITY_WARN | CKEDITOR.VERBOSITY_ERROR, CKEDITOR.warn = function(a, d) { CKEDITOR.verbosity & CKEDITOR.VERBOSITY_WARN && CKEDITOR.fire("log", { type: "warn", errorCode: a, additionalData: d }) }, CKEDITOR.error = function(a, d) {
      CKEDITOR.verbosity & CKEDITOR.VERBOSITY_ERROR && CKEDITOR.fire("log", { type: "error", errorCode: a, additionalData: d })
    }, CKEDITOR.on("log", function(a) { if (window.console && window.console.log) { var d = console[a.data.type] ? a.data.type : "log",
          b = a.data.errorCode; if (a = a.data.additionalData) console[d]("[CKEDITOR] Error code: " + b + ".", a);
        else console[d]("[CKEDITOR] Error code: " + b + ".");
        console[d]("[CKEDITOR] For more information about this error go to https://docs.ckeditor.com/ckeditor4/docs/#!/guide/dev_errors-section-" + b) } }, null, null, 999), CKEDITOR.dom = {}, function() {
      var a = [],
        d = CKEDITOR.env.gecko ?
        "-moz-" : CKEDITOR.env.webkit ? "-webkit-" : CKEDITOR.env.ie ? "-ms-" : "",
        b = /&/g,
        c = />/g,
        g = /</g,
        l = /"/g,
        k = /&(lt|gt|amp|quot|nbsp|shy|#\d{1,5});/g,
        e = { lt: "\x3c", gt: "\x3e", amp: "\x26", quot: '"', nbsp: " ", shy: "­" },
        h = function(a, f) { return "#" == f[0] ? String.fromCharCode(parseInt(f.slice(1), 10)) : e[f] };
      CKEDITOR.on("reset", function() { a = [] });
      CKEDITOR.tools = {
        arrayCompare: function(a, f) { if (!a && !f) return !0; if (!a || !f || a.length != f.length) return !1; for (var e = 0; e < a.length; e++)
            if (a[e] != f[e]) return !1; return !0 },
        getIndex: function(a, f) {
          for (var e =
              0; e < a.length; ++e)
            if (f(a[e])) return e;
          return -1
        },
        clone: function(a) { var f; if (a && a instanceof Array) { f = []; for (var e = 0; e < a.length; e++) f[e] = CKEDITOR.tools.clone(a[e]); return f } if (null === a || "object" != typeof a || a instanceof String || a instanceof Number || a instanceof Boolean || a instanceof Date || a instanceof RegExp || a.nodeType || a.window === a) return a;
          f = new a.constructor; for (e in a) f[e] = CKEDITOR.tools.clone(a[e]); return f },
        capitalize: function(a, f) { return a.charAt(0).toUpperCase() + (f ? a.slice(1) : a.slice(1).toLowerCase()) },
        extend: function(a) { var f = arguments.length,
            e, b; "boolean" == typeof(e = arguments[f - 1]) ? f-- : "boolean" == typeof(e = arguments[f - 2]) && (b = arguments[f - 1], f -= 2); for (var h = 1; h < f; h++) { var c = arguments[h],
              g; for (g in c)
              if (!0 === e || null == a[g])
                if (!b || g in b) a[g] = c[g] } return a },
        prototypedCopy: function(a) { var f = function() {};
          f.prototype = a; return new f },
        copy: function(a) { var f = {},
            e; for (e in a) f[e] = a[e]; return f },
        isArray: function(a) { return "[object Array]" == Object.prototype.toString.call(a) },
        isEmpty: function(a) {
          for (var f in a)
            if (a.hasOwnProperty(f)) return !1;
          return !0
        },
        cssVendorPrefix: function(a, f, e) { if (e) return d + a + ":" + f + ";" + a + ":" + f;
          e = {};
          e[a] = f;
          e[d + a] = f; return e },
        cssStyleToDomStyle: function() { var a = document.createElement("div").style,
            f = "undefined" != typeof a.cssFloat ? "cssFloat" : "undefined" != typeof a.styleFloat ? "styleFloat" : "float"; return function(a) { return "float" == a ? f : a.replace(/-./g, function(f) { return f.substr(1).toUpperCase() }) } }(),
        buildStyleHtml: function(a) {
          a = [].concat(a);
          for (var f, e = [], b = 0; b < a.length; b++)
            if (f = a[b]) /@import|[{}]/.test(f) ? e.push("\x3cstyle\x3e" +
              f + "\x3c/style\x3e") : e.push('\x3clink type\x3d"text/css" rel\x3dstylesheet href\x3d"' + f + '"\x3e');
          return e.join("")
        },
        htmlEncode: function(a) { return void 0 === a || null === a ? "" : String(a).replace(b, "\x26amp;").replace(c, "\x26gt;").replace(g, "\x26lt;") },
        htmlDecode: function(a) { return a.replace(k, h) },
        htmlEncodeAttr: function(a) { return CKEDITOR.tools.htmlEncode(a).replace(l, "\x26quot;") },
        htmlDecodeAttr: function(a) { return CKEDITOR.tools.htmlDecode(a) },
        transformPlainTextToHtml: function(a, f) {
          var e = f == CKEDITOR.ENTER_BR,
            b = this.htmlEncode(a.replace(/\r\n/g, "\n")),
            b = b.replace(/\t/g, "\x26nbsp;\x26nbsp; \x26nbsp;"),
            h = f == CKEDITOR.ENTER_P ? "p" : "div";
          if (!e) { var c = /\n{2}/g; if (c.test(b)) var g = "\x3c" + h + "\x3e",
              d = "\x3c/" + h + "\x3e",
              b = g + b.replace(c, function() { return d + g }) + d } b = b.replace(/\n/g, "\x3cbr\x3e");
          e || (b = b.replace(new RegExp("\x3cbr\x3e(?\x3d\x3c/" + h + "\x3e)"), function(f) { return CKEDITOR.tools.repeat(f, 2) }));
          b = b.replace(/^ | $/g, "\x26nbsp;");
          return b = b.replace(/(>|\s) /g, function(f, a) { return a + "\x26nbsp;" }).replace(/ (?=<)/g,
            "\x26nbsp;")
        },
        getNextNumber: function() { var a = 0; return function() { return ++a } }(),
        getNextId: function() { return "cke_" + this.getNextNumber() },
        getUniqueId: function() { for (var a = "e", f = 0; 8 > f; f++) a += Math.floor(65536 * (1 + Math.random())).toString(16).substring(1); return a },
        override: function(a, f) { var e = f(a);
          e.prototype = a.prototype; return e },
        setTimeout: function(a, f, e, b, h) { h || (h = window);
          e || (e = h); return h.setTimeout(function() { b ? a.apply(e, [].concat(b)) : a.apply(e) }, f || 0) },
        trim: function() {
          var a = /(?:^[ \t\n\r]+)|(?:[ \t\n\r]+$)/g;
          return function(f) { return f.replace(a, "") }
        }(),
        ltrim: function() { var a = /^[ \t\n\r]+/g; return function(f) { return f.replace(a, "") } }(),
        rtrim: function() { var a = /[ \t\n\r]+$/g; return function(f) { return f.replace(a, "") } }(),
        indexOf: function(a, f) { if ("function" == typeof f)
            for (var e = 0, b = a.length; e < b; e++) { if (f(a[e])) return e } else { if (a.indexOf) return a.indexOf(f);
              e = 0; for (b = a.length; e < b; e++)
                if (a[e] === f) return e }
          return -1 },
        search: function(a, f) { var e = CKEDITOR.tools.indexOf(a, f); return 0 <= e ? a[e] : null },
        bind: function(a,
          f) { return function() { return a.apply(f, arguments) } },
        createClass: function(a) {
          var f = a.$,
            e = a.base,
            b = a.privates || a._,
            h = a.proto;
          a = a.statics;
          !f && (f = function() { e && this.base.apply(this, arguments) });
          if (b) var c = f,
            f = function() { var f = this._ || (this._ = {}),
                a; for (a in b) { var e = b[a];
                f[a] = "function" == typeof e ? CKEDITOR.tools.bind(e, this) : e } c.apply(this, arguments) };
          e && (f.prototype = this.prototypedCopy(e.prototype), f.prototype.constructor = f, f.base = e, f.baseProto = e.prototype, f.prototype.base = function() {
            this.base = e.prototype.base;
            e.apply(this, arguments);
            this.base = arguments.callee
          });
          h && this.extend(f.prototype, h, !0);
          a && this.extend(f, a, !0);
          return f
        },
        addFunction: function(e, f) { return a.push(function() { return e.apply(f || this, arguments) }) - 1 },
        removeFunction: function(e) { a[e] = null },
        callFunction: function(e) { var f = a[e]; return f && f.apply(window, Array.prototype.slice.call(arguments, 1)) },
        cssLength: function() { var a = /^-?\d+\.?\d*px$/,
            f; return function(e) { f = CKEDITOR.tools.trim(e + "") + "px"; return a.test(f) ? f : e || "" } }(),
        convertToPx: function() {
          var a;
          return function(f) { a || (a = CKEDITOR.dom.element.createFromHtml('\x3cdiv style\x3d"position:absolute;left:-9999px;top:-9999px;margin:0px;padding:0px;border:0px;"\x3e\x3c/div\x3e', CKEDITOR.document), CKEDITOR.document.getBody().append(a)); return /%$/.test(f) ? f : (a.setStyle("width", f), a.$.clientWidth) }
        }(),
        repeat: function(a, f) { return Array(f + 1).join(a) },
        tryThese: function() { for (var a, f = 0, e = arguments.length; f < e; f++) { var b = arguments[f]; try { a = b(); break } catch (h) {} } return a },
        genKey: function() { return Array.prototype.slice.call(arguments).join("-") },
        defer: function(a) { return function() { var f = arguments,
              e = this;
            window.setTimeout(function() { a.apply(e, f) }, 0) } },
        normalizeCssText: function(a, f) { var e = [],
            b, h = CKEDITOR.tools.parseCssText(a, !0, f); for (b in h) e.push(b + ":" + h[b]);
          e.sort(); return e.length ? e.join(";") + ";" : "" },
        convertRgbToHex: function(a) { return a.replace(/(?:rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\))/gi, function(f, a, e, b) { f = [a, e, b]; for (a = 0; 3 > a; a++) f[a] = ("0" + parseInt(f[a], 10).toString(16)).slice(-2); return "#" + f.join("") }) },
        normalizeHex: function(a) {
          return a.replace(/#(([0-9a-f]{3}){1,2})($|;|\s+)/gi,
            function(f, a, e, b) { f = a.toLowerCase();
              3 == f.length && (f = f.split(""), f = [f[0], f[0], f[1], f[1], f[2], f[2]].join("")); return "#" + f + b })
        },
        parseCssText: function(a, f, e) {
          var b = {};
          e && (a = (new CKEDITOR.dom.element("span")).setAttribute("style", a).getAttribute("style") || "");
          a && (a = CKEDITOR.tools.normalizeHex(CKEDITOR.tools.convertRgbToHex(a)));
          if (!a || ";" == a) return b;
          a.replace(/&quot;/g, '"').replace(/\s*([^:;\s]+)\s*:\s*([^;]+)\s*(?=;|$)/g, function(a, e, m) {
            f && (e = e.toLowerCase(), "font-family" == e && (m = m.replace(/\s*,\s*/g,
              ",")), m = CKEDITOR.tools.trim(m));
            b[e] = m
          });
          return b
        },
        writeCssText: function(a, f) { var e, b = []; for (e in a) b.push(e + ":" + a[e]);
          f && b.sort(); return b.join("; ") },
        objectCompare: function(a, f, e) { var b; if (!a && !f) return !0; if (!a || !f) return !1; for (b in a)
            if (a[b] != f[b]) return !1; if (!e)
            for (b in f)
              if (a[b] != f[b]) return !1; return !0 },
        objectKeys: function(a) { var f = [],
            e; for (e in a) f.push(e); return f },
        convertArrayToObject: function(a, f) { var e = {};
          1 == arguments.length && (f = !0); for (var b = 0, h = a.length; b < h; ++b) e[a[b]] = f; return e },
        fixDomain: function() {
          for (var a;;) try {
            a =
              window.parent.document.domain;
            break
          } catch (f) { a = a ? a.replace(/.+?(?:\.|$)/, "") : document.domain; if (!a) break;
            document.domain = a }
          return !!a
        },
        eventsBuffer: function(a, f, e) {
          function b() { c = (new Date).getTime();
            h = !1;
            e ? f.call(e) : f() } var h, c = 0; return { input: function() { if (!h) { var f = (new Date).getTime() - c;
                f < a ? h = setTimeout(b, a - f) : b() } }, reset: function() { h && clearTimeout(h);
              h = c = 0 } } },
        enableHtml5Elements: function(a, f) {
          for (var e = "abbr article aside audio bdi canvas data datalist details figcaption figure footer header hgroup main mark meter nav output progress section summary time video".split(" "),
              b = e.length, h; b--;) h = a.createElement(e[b]), f && a.appendChild(h)
        },
        checkIfAnyArrayItemMatches: function(a, f) { for (var e = 0, b = a.length; e < b; ++e)
            if (a[e].match(f)) return !0; return !1 },
        checkIfAnyObjectPropertyMatches: function(a, f) { for (var e in a)
            if (e.match(f)) return !0; return !1 },
        keystrokeToString: function(a, f) { var e = this.keystrokeToArray(a, f);
          e.display = e.display.join("+");
          e.aria = e.aria.join("+"); return e },
        keystrokeToArray: function(a, f) {
          var e = f & 16711680,
            b = f & 65535,
            h = CKEDITOR.env.mac,
            c = [],
            g = [];
            if (a) {
          e & CKEDITOR.CTRL && (c.push(h ?
            "⌘" : a[17]), g.push(h ? a[224] : a[17]));
          e & CKEDITOR.ALT && (c.push(h ? "⌥" : a[18]), g.push(a[18]));
          e & CKEDITOR.SHIFT && (c.push(h ? "⇧" : a[16]), g.push(a[16]));
          b && (a[b] ? (c.push(a[b]), g.push(a[b])) : (c.push(String.fromCharCode(b)), g.push(String.fromCharCode(b))));
        }
          return { display: c, aria: g }
        },
        transparentImageData: "data:image/gif;base64,R0lGODlhAQABAPABAP///wAAACH5BAEKAAAALAAAAAABAAEAAAICRAEAOw\x3d\x3d",
        getCookie: function(a) {
          a = a.toLowerCase();
          for (var f = document.cookie.split(";"), e, b, h = 0; h < f.length; h++)
            if (e = f[h].split("\x3d"),
              b = decodeURIComponent(CKEDITOR.tools.trim(e[0]).toLowerCase()), b === a) return decodeURIComponent(1 < e.length ? e[1] : "");
          return null
        },
        setCookie: function(a, f) { document.cookie = encodeURIComponent(a) + "\x3d" + encodeURIComponent(f) + ";path\x3d/" },
        getCsrfToken: function() {
          var a = CKEDITOR.tools.getCookie("ckCsrfToken");
          if (!a || 40 != a.length) {
            var a = [],
              f = "";
            if (window.crypto && window.crypto.getRandomValues) a = new Uint8Array(40), window.crypto.getRandomValues(a);
            else
              for (var e = 0; 40 > e; e++) a.push(Math.floor(256 * Math.random()));
            for (e = 0; e < a.length; e++) var b = "abcdefghijklmnopqrstuvwxyz0123456789".charAt(a[e] % 36),
              f = f + (.5 < Math.random() ? b.toUpperCase() : b);
            a = f;
            CKEDITOR.tools.setCookie("ckCsrfToken", a)
          }
          return a
        },
        escapeCss: function(a) { return a ? window.CSS && CSS.escape ? CSS.escape(a) : isNaN(parseInt(a.charAt(0), 10)) ? a : "\\3" + a.charAt(0) + " " + a.substring(1, a.length) : "" },
        getMouseButton: function(a) {
          var f = (a = a.data) && a.$;
          return a && f ? CKEDITOR.env.ie && 9 > CKEDITOR.env.version ? 4 === f.button ? CKEDITOR.MOUSE_BUTTON_MIDDLE : 1 === f.button ? CKEDITOR.MOUSE_BUTTON_LEFT :
            CKEDITOR.MOUSE_BUTTON_RIGHT : f.button : !1
        },
        convertHexStringToBytes: function(a) { var f = [],
            e = a.length / 2,
            b; for (b = 0; b < e; b++) f.push(parseInt(a.substr(2 * b, 2), 16)); return f },
        convertBytesToBase64: function(a) {
          var f = "",
            e = a.length,
            b;
          for (b = 0; b < e; b += 3) {
            var h = a.slice(b, b + 3),
              c = h.length,
              g = [],
              d;
            if (3 > c)
              for (d = c; 3 > d; d++) h[d] = 0;
            g[0] = (h[0] & 252) >> 2;
            g[1] = (h[0] & 3) << 4 | h[1] >> 4;
            g[2] = (h[1] & 15) << 2 | (h[2] & 192) >> 6;
            g[3] = h[2] & 63;
            for (d = 0; 4 > d; d++) f = d <= c ? f + "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(g[d]) : f +
              "\x3d"
          }
          return f
        },
        style: {
          parse: {
            _colors: {
              aliceblue: "#F0F8FF",
              antiquewhite: "#FAEBD7",
              aqua: "#00FFFF",
              aquamarine: "#7FFFD4",
              azure: "#F0FFFF",
              beige: "#F5F5DC",
              bisque: "#FFE4C4",
              black: "#000000",
              blanchedalmond: "#FFEBCD",
              blue: "#0000FF",
              blueviolet: "#8A2BE2",
              brown: "#A52A2A",
              burlywood: "#DEB887",
              cadetblue: "#5F9EA0",
              chartreuse: "#7FFF00",
              chocolate: "#D2691E",
              coral: "#FF7F50",
              cornflowerblue: "#6495ED",
              cornsilk: "#FFF8DC",
              crimson: "#DC143C",
              cyan: "#00FFFF",
              darkblue: "#00008B",
              darkcyan: "#008B8B",
              darkgoldenrod: "#B8860B",
              darkgray: "#A9A9A9",
              darkgreen: "#006400",
              darkgrey: "#A9A9A9",
              darkkhaki: "#BDB76B",
              darkmagenta: "#8B008B",
              darkolivegreen: "#556B2F",
              darkorange: "#FF8C00",
              darkorchid: "#9932CC",
              darkred: "#8B0000",
              darksalmon: "#E9967A",
              darkseagreen: "#8FBC8F",
              darkslateblue: "#483D8B",
              darkslategray: "#2F4F4F",
              darkslategrey: "#2F4F4F",
              darkturquoise: "#00CED1",
              darkviolet: "#9400D3",
              deeppink: "#FF1493",
              deepskyblue: "#00BFFF",
              dimgray: "#696969",
              dimgrey: "#696969",
              dodgerblue: "#1E90FF",
              firebrick: "#B22222",
              floralwhite: "#FFFAF0",
              forestgreen: "#228B22",
              fuchsia: "#FF00FF",
              gainsboro: "#DCDCDC",
              ghostwhite: "#F8F8FF",
              gold: "#FFD700",
              goldenrod: "#DAA520",
              gray: "#808080",
              green: "#008000",
              greenyellow: "#ADFF2F",
              grey: "#808080",
              honeydew: "#F0FFF0",
              hotpink: "#FF69B4",
              indianred: "#CD5C5C",
              indigo: "#4B0082",
              ivory: "#FFFFF0",
              khaki: "#F0E68C",
              lavender: "#E6E6FA",
              lavenderblush: "#FFF0F5",
              lawngreen: "#7CFC00",
              lemonchiffon: "#FFFACD",
              lightblue: "#ADD8E6",
              lightcoral: "#F08080",
              lightcyan: "#E0FFFF",
              lightgoldenrodyellow: "#FAFAD2",
              lightgray: "#D3D3D3",
              lightgreen: "#90EE90",
              lightgrey: "#D3D3D3",
              lightpink: "#FFB6C1",
              lightsalmon: "#FFA07A",
              lightseagreen: "#20B2AA",
              lightskyblue: "#87CEFA",
              lightslategray: "#778899",
              lightslategrey: "#778899",
              lightsteelblue: "#B0C4DE",
              lightyellow: "#FFFFE0",
              lime: "#00FF00",
              limegreen: "#32CD32",
              linen: "#FAF0E6",
              magenta: "#FF00FF",
              maroon: "#800000",
              mediumaquamarine: "#66CDAA",
              mediumblue: "#0000CD",
              mediumorchid: "#BA55D3",
              mediumpurple: "#9370DB",
              mediumseagreen: "#3CB371",
              mediumslateblue: "#7B68EE",
              mediumspringgreen: "#00FA9A",
              mediumturquoise: "#48D1CC",
              mediumvioletred: "#C71585",
              midnightblue: "#191970",
              mintcream: "#F5FFFA",
              mistyrose: "#FFE4E1",
              moccasin: "#FFE4B5",
              navajowhite: "#FFDEAD",
              navy: "#000080",
              oldlace: "#FDF5E6",
              olive: "#808000",
              olivedrab: "#6B8E23",
              orange: "#FFA500",
              orangered: "#FF4500",
              orchid: "#DA70D6",
              palegoldenrod: "#EEE8AA",
              palegreen: "#98FB98",
              paleturquoise: "#AFEEEE",
              palevioletred: "#DB7093",
              papayawhip: "#FFEFD5",
              peachpuff: "#FFDAB9",
              peru: "#CD853F",
              pink: "#FFC0CB",
              plum: "#DDA0DD",
              powderblue: "#B0E0E6",
              purple: "#800080",
              rebeccapurple: "#663399",
              red: "#FF0000",
              rosybrown: "#BC8F8F",
              royalblue: "#4169E1",
              saddlebrown: "#8B4513",
              salmon: "#FA8072",
              sandybrown: "#F4A460",
              seagreen: "#2E8B57",
              seashell: "#FFF5EE",
              sienna: "#A0522D",
              silver: "#C0C0C0",
              skyblue: "#87CEEB",
              slateblue: "#6A5ACD",
              slategray: "#708090",
              slategrey: "#708090",
              snow: "#FFFAFA",
              springgreen: "#00FF7F",
              steelblue: "#4682B4",
              tan: "#D2B48C",
              teal: "#008080",
              thistle: "#D8BFD8",
              tomato: "#FF6347",
              turquoise: "#40E0D0",
              violet: "#EE82EE",
              wheat: "#F5DEB3",
              white: "#FFFFFF",
              whitesmoke: "#F5F5F5",
              yellow: "#FFFF00",
              yellowgreen: "#9ACD32"
            },
            _borderStyle: "none hidden dotted dashed solid double groove ridge inset outset".split(" "),
            _widthRegExp: /^(thin|medium|thick|[\+-]?\d+(\.\d+)?[a-z%]+|[\+-]?0+(\.0+)?|\.\d+[a-z%]+)$/,
            _rgbaRegExp: /rgba?\(\s*\d+%?\s*,\s*\d+%?\s*,\s*\d+%?\s*(?:,\s*[0-9.]+\s*)?\)/gi,
            _hslaRegExp: /hsla?\(\s*[0-9.]+\s*,\s*\d+%\s*,\s*\d+%\s*(?:,\s*[0-9.]+\s*)?\)/gi,
            background: function(a) { var f = {},
                e = this._findColor(a);
              e.length && (f.color = e[0], CKEDITOR.tools.array.forEach(e, function(f) { a = a.replace(f, "") })); if (a = CKEDITOR.tools.trim(a)) f.unprocessed = a; return f },
            margin: function(a) {
              function f(a) {
                e.top = b[a[0]];
                e.right =
                  b[a[1]];
                e.bottom = b[a[2]];
                e.left = b[a[3]]
              }
              var e = {},
                b = a.match(/(?:\-?[\.\d]+(?:%|\w*)|auto|inherit|initial|unset)/g) || ["0px"];
              switch (b.length) {
                case 1:
                  f([0, 0, 0, 0]); break;
                case 2:
                  f([0, 1, 0, 1]); break;
                case 3:
                  f([0, 1, 2, 1]); break;
                case 4:
                  f([0, 1, 2, 3]) }
              return e
            },
            border: function(a) {
              var f = {},
                e = a.split(/\s+/g);
              a = CKEDITOR.tools.style.parse._findColor(a);
              a.length && (f.color = a[0]);
              CKEDITOR.tools.array.forEach(e, function(a) {
                f.style || -1 === CKEDITOR.tools.indexOf(CKEDITOR.tools.style.parse._borderStyle, a) ? !f.width && CKEDITOR.tools.style.parse._widthRegExp.test(a) &&
                  (f.width = a) : f.style = a
              });
              return f
            },
            _findColor: function(a) { var f = [],
                e = CKEDITOR.tools.array,
                f = f.concat(a.match(this._rgbaRegExp) || []),
                f = f.concat(a.match(this._hslaRegExp) || []); return f = f.concat(e.filter(a.split(/\s+/), function(a) { return a.match(/^\#[a-f0-9]{3}(?:[a-f0-9]{3})?$/gi) ? !0 : a.toLowerCase() in CKEDITOR.tools.style.parse._colors })) }
          }
        },
        array: {
          filter: function(a, f, e) { var b = [];
            this.forEach(a, function(h, c) { f.call(e, h, c, a) && b.push(h) }); return b },
          forEach: function(a, f, e) {
            var b = a.length,
              h;
            for (h = 0; h < b; h++) f.call(e,
              a[h], h, a)
          },
          map: function(a, f, e) { for (var b = [], h = 0; h < a.length; h++) b.push(f.call(e, a[h], h, a)); return b },
          reduce: function(a, f, e, b) { for (var h = 0; h < a.length; h++) e = f.call(b, e, a[h], h, a); return e },
          every: function(a, f, e) { if (!a.length) return !0;
            f = this.filter(a, f, e); return a.length === f.length }
        },
        object: {
          findKey: function(a, f) { if ("object" !== typeof a) return null; for (var e in a)
              if (a[e] === f) return e; return null },
          merge: function(a, f) {
            var e = CKEDITOR.tools,
              b = e.clone(a),
              h = e.clone(f);
            e.array.forEach(e.objectKeys(h), function(a) {
              b[a] =
                "object" === typeof h[a] && "object" === typeof b[a] ? e.object.merge(b[a], h[a]) : h[a]
            });
            return b
          }
        }
      };
      CKEDITOR.tools.array.indexOf = CKEDITOR.tools.indexOf;
      CKEDITOR.tools.array.isArray = CKEDITOR.tools.isArray;
      CKEDITOR.MOUSE_BUTTON_LEFT = 0;
      CKEDITOR.MOUSE_BUTTON_MIDDLE = 1;
      CKEDITOR.MOUSE_BUTTON_RIGHT = 2
    }(), CKEDITOR.dtd = function() {
      var a = CKEDITOR.tools.extend,
        d = function(a, f) { for (var e = CKEDITOR.tools.clone(a), b = 1; b < arguments.length; b++) { f = arguments[b]; for (var h in f) delete e[h] } return e },
        b = {},
        c = {},
        g = {
          address: 1,
          article: 1,
          aside: 1,
          blockquote: 1,
          details: 1,
          div: 1,
          dl: 1,
          fieldset: 1,
          figure: 1,
          footer: 1,
          form: 1,
          h1: 1,
          h2: 1,
          h3: 1,
          h4: 1,
          h5: 1,
          h6: 1,
          header: 1,
          hgroup: 1,
          hr: 1,
          main: 1,
          menu: 1,
          nav: 1,
          ol: 1,
          p: 1,
          pre: 1,
          section: 1,
          table: 1,
          ul: 1
        },
        l = { command: 1, link: 1, meta: 1, noscript: 1, script: 1, style: 1 },
        k = {},
        e = { "#": 1 },
        h = { center: 1, dir: 1, noframes: 1 };
      a(b, {
        a: 1,
        abbr: 1,
        area: 1,
        audio: 1,
        b: 1,
        bdi: 1,
        bdo: 1,
        br: 1,
        button: 1,
        canvas: 1,
        cite: 1,
        code: 1,
        command: 1,
        datalist: 1,
        del: 1,
        dfn: 1,
        em: 1,
        embed: 1,
        i: 1,
        iframe: 1,
        img: 1,
        input: 1,
        ins: 1,
        kbd: 1,
        keygen: 1,
        label: 1,
        map: 1,
        mark: 1,
        meter: 1,
        noscript: 1,
        object: 1,
        output: 1,
        progress: 1,
        q: 1,
        ruby: 1,
        s: 1,
        samp: 1,
        script: 1,
        select: 1,
        small: 1,
        span: 1,
        strong: 1,
        sub: 1,
        sup: 1,
        textarea: 1,
        time: 1,
        u: 1,
        "var": 1,
        video: 1,
        wbr: 1
      }, e, { acronym: 1, applet: 1, basefont: 1, big: 1, font: 1, isindex: 1, strike: 1, style: 1, tt: 1 });
      a(c, g, b, h);
      d = {
        a: d(b, { a: 1, button: 1 }),
        abbr: b,
        address: c,
        area: k,
        article: c,
        aside: c,
        audio: a({ source: 1, track: 1 }, c),
        b: b,
        base: k,
        bdi: b,
        bdo: b,
        blockquote: c,
        body: c,
        br: k,
        button: d(b, { a: 1, button: 1 }),
        canvas: b,
        caption: c,
        cite: b,
        code: b,
        col: k,
        colgroup: { col: 1 },
        command: k,
        datalist: a({ option: 1 },
          b),
        dd: c,
        del: b,
        details: a({ summary: 1 }, c),
        dfn: b,
        div: c,
        dl: { dt: 1, dd: 1 },
        dt: c,
        em: b,
        embed: k,
        fieldset: a({ legend: 1 }, c),
        figcaption: c,
        figure: a({ figcaption: 1 }, c),
        footer: c,
        form: c,
        h1: b,
        h2: b,
        h3: b,
        h4: b,
        h5: b,
        h6: b,
        head: a({ title: 1, base: 1 }, l),
        header: c,
        hgroup: { h1: 1, h2: 1, h3: 1, h4: 1, h5: 1, h6: 1 },
        hr: k,
        html: a({ head: 1, body: 1 }, c, l),
        i: b,
        iframe: e,
        img: k,
        input: k,
        ins: b,
        kbd: b,
        keygen: k,
        label: b,
        legend: b,
        li: c,
        link: k,
        main: c,
        map: c,
        mark: b,
        menu: a({ li: 1 }, c),
        meta: k,
        meter: d(b, { meter: 1 }),
        nav: c,
        noscript: a({ link: 1, meta: 1, style: 1 }, b),
        object: a({ param: 1 },
          b),
        ol: { li: 1 },
        optgroup: { option: 1 },
        option: e,
        output: b,
        p: b,
        param: k,
        pre: b,
        progress: d(b, { progress: 1 }),
        q: b,
        rp: b,
        rt: b,
        ruby: a({ rp: 1, rt: 1 }, b),
        s: b,
        samp: b,
        script: e,
        section: c,
        select: { optgroup: 1, option: 1 },
        small: b,
        source: k,
        span: b,
        strong: b,
        style: e,
        sub: b,
        summary: a({ h1: 1, h2: 1, h3: 1, h4: 1, h5: 1, h6: 1 }, b),
        sup: b,
        table: { caption: 1, colgroup: 1, thead: 1, tfoot: 1, tbody: 1, tr: 1 },
        tbody: { tr: 1 },
        td: c,
        textarea: e,
        tfoot: { tr: 1 },
        th: c,
        thead: { tr: 1 },
        time: d(b, { time: 1 }),
        title: e,
        tr: { th: 1, td: 1 },
        track: k,
        u: b,
        ul: { li: 1 },
        "var": b,
        video: a({ source: 1, track: 1 },
          c),
        wbr: k,
        acronym: b,
        applet: a({ param: 1 }, c),
        basefont: k,
        big: b,
        center: c,
        dialog: k,
        dir: { li: 1 },
        font: b,
        isindex: k,
        noframes: c,
        strike: b,
        tt: b
      };
      a(d, {
        $block: a({ audio: 1, dd: 1, dt: 1, figcaption: 1, li: 1, video: 1 }, g, h),
        $blockLimit: { article: 1, aside: 1, audio: 1, body: 1, caption: 1, details: 1, dir: 1, div: 1, dl: 1, fieldset: 1, figcaption: 1, figure: 1, footer: 1, form: 1, header: 1, hgroup: 1, main: 1, menu: 1, nav: 1, ol: 1, section: 1, table: 1, td: 1, th: 1, tr: 1, ul: 1, video: 1 },
        $cdata: { script: 1, style: 1 },
        $editable: {
          address: 1,
          article: 1,
          aside: 1,
          blockquote: 1,
          body: 1,
          details: 1,
          div: 1,
          fieldset: 1,
          figcaption: 1,
          footer: 1,
          form: 1,
          h1: 1,
          h2: 1,
          h3: 1,
          h4: 1,
          h5: 1,
          h6: 1,
          header: 1,
          hgroup: 1,
          main: 1,
          nav: 1,
          p: 1,
          pre: 1,
          section: 1
        },
        $empty: { area: 1, base: 1, basefont: 1, br: 1, col: 1, command: 1, dialog: 1, embed: 1, hr: 1, img: 1, input: 1, isindex: 1, keygen: 1, link: 1, meta: 1, param: 1, source: 1, track: 1, wbr: 1 },
        $inline: b,
        $list: { dl: 1, ol: 1, ul: 1 },
        $listItem: { dd: 1, dt: 1, li: 1 },
        $nonBodyContent: a({ body: 1, head: 1, html: 1 }, d.head),
        $nonEditable: {
          applet: 1,
          audio: 1,
          button: 1,
          embed: 1,
          iframe: 1,
          map: 1,
          object: 1,
          option: 1,
          param: 1,
          script: 1,
          textarea: 1,
          video: 1
        },
        $object: { applet: 1, audio: 1, button: 1, hr: 1, iframe: 1, img: 1, input: 1, object: 1, select: 1, table: 1, textarea: 1, video: 1 },
        $removeEmpty: { abbr: 1, acronym: 1, b: 1, bdi: 1, bdo: 1, big: 1, cite: 1, code: 1, del: 1, dfn: 1, em: 1, font: 1, i: 1, ins: 1, label: 1, kbd: 1, mark: 1, meter: 1, output: 1, q: 1, ruby: 1, s: 1, samp: 1, small: 1, span: 1, strike: 1, strong: 1, sub: 1, sup: 1, time: 1, tt: 1, u: 1, "var": 1 },
        $tabIndex: { a: 1, area: 1, button: 1, input: 1, object: 1, select: 1, textarea: 1 },
        $tableContent: { caption: 1, col: 1, colgroup: 1, tbody: 1, td: 1, tfoot: 1, th: 1, thead: 1, tr: 1 },
        $transparent: {
          a: 1,
          audio: 1,
          canvas: 1,
          del: 1,
          ins: 1,
          map: 1,
          noscript: 1,
          object: 1,
          video: 1
        },
        $intermediate: { caption: 1, colgroup: 1, dd: 1, dt: 1, figcaption: 1, legend: 1, li: 1, optgroup: 1, option: 1, rp: 1, rt: 1, summary: 1, tbody: 1, td: 1, tfoot: 1, th: 1, thead: 1, tr: 1 }
      });
      return d
    }(), CKEDITOR.dom.event = function(a) { this.$ = a }, CKEDITOR.dom.event.prototype = {
      getKey: function() { return this.$.keyCode || this.$.which },
      getKeystroke: function() {
        var a = this.getKey();
        if (this.$.ctrlKey || this.$.metaKey) a += CKEDITOR.CTRL;
        this.$.shiftKey && (a += CKEDITOR.SHIFT);
        this.$.altKey &&
          (a += CKEDITOR.ALT);
        return a
      },
      preventDefault: function(a) { var d = this.$;
        d.preventDefault ? d.preventDefault() : d.returnValue = !1;
        a && this.stopPropagation() },
      stopPropagation: function() { var a = this.$;
        a.stopPropagation ? a.stopPropagation() : a.cancelBubble = !0 },
      getTarget: function() { var a = this.$.target || this.$.srcElement; return a ? new CKEDITOR.dom.node(a) : null },
      getPhase: function() { return this.$.eventPhase || 2 },
      getPageOffset: function() {
        var a = this.getTarget().getDocument().$;
        return {
          x: this.$.pageX || this.$.clientX + (a.documentElement.scrollLeft ||
            a.body.scrollLeft),
          y: this.$.pageY || this.$.clientY + (a.documentElement.scrollTop || a.body.scrollTop)
        }
      }
    }, CKEDITOR.CTRL = 1114112, CKEDITOR.SHIFT = 2228224, CKEDITOR.ALT = 4456448, CKEDITOR.EVENT_PHASE_CAPTURING = 1, CKEDITOR.EVENT_PHASE_AT_TARGET = 2, CKEDITOR.EVENT_PHASE_BUBBLING = 3, CKEDITOR.dom.domObject = function(a) { a && (this.$ = a) }, CKEDITOR.dom.domObject.prototype = function() {
      var a = function(a, b) { return function(c) { "undefined" != typeof CKEDITOR && a.fire(b, new CKEDITOR.dom.event(c)) } };
      return {
        getPrivate: function() {
          var a;
          (a = this.getCustomData("_")) || this.setCustomData("_", a = {});
          return a
        },
        on: function(d) { var b = this.getCustomData("_cke_nativeListeners");
          b || (b = {}, this.setCustomData("_cke_nativeListeners", b));
          b[d] || (b = b[d] = a(this, d), this.$.addEventListener ? this.$.addEventListener(d, b, !!CKEDITOR.event.useCapture) : this.$.attachEvent && this.$.attachEvent("on" + d, b)); return CKEDITOR.event.prototype.on.apply(this, arguments) },
        removeListener: function(a) {
          CKEDITOR.event.prototype.removeListener.apply(this, arguments);
          if (!this.hasListeners(a)) {
            var b =
              this.getCustomData("_cke_nativeListeners"),
              c = b && b[a];
            c && (this.$.removeEventListener ? this.$.removeEventListener(a, c, !1) : this.$.detachEvent && this.$.detachEvent("on" + a, c), delete b[a])
          }
        },
        removeAllListeners: function() { var a = this.getCustomData("_cke_nativeListeners"),
            b; for (b in a) { var c = a[b];
            this.$.detachEvent ? this.$.detachEvent("on" + b, c) : this.$.removeEventListener && this.$.removeEventListener(b, c, !1);
            delete a[b] } CKEDITOR.event.prototype.removeAllListeners.call(this) }
      }
    }(), function(a) {
      var d = {};
      CKEDITOR.on("reset",
        function() { d = {} });
      a.equals = function(a) { try { return a && a.$ === this.$ } catch (c) { return !1 } };
      a.setCustomData = function(a, c) { var g = this.getUniqueId();
        (d[g] || (d[g] = {}))[a] = c; return this };
      a.getCustomData = function(a) { var c = this.$["data-cke-expando"]; return (c = c && d[c]) && a in c ? c[a] : null };
      a.removeCustomData = function(a) { var c = this.$["data-cke-expando"],
          c = c && d[c],
          g, l;
        c && (g = c[a], l = a in c, delete c[a]); return l ? g : null };
      a.clearCustomData = function() { this.removeAllListeners(); var a = this.$["data-cke-expando"];
        a && delete d[a] };
      a.getUniqueId = function() { return this.$["data-cke-expando"] || (this.$["data-cke-expando"] = CKEDITOR.tools.getNextNumber()) };
      CKEDITOR.event.implementOn(a)
    }(CKEDITOR.dom.domObject.prototype), CKEDITOR.dom.node = function(a) { return a ? new CKEDITOR.dom[a.nodeType == CKEDITOR.NODE_DOCUMENT ? "document" : a.nodeType == CKEDITOR.NODE_ELEMENT ? "element" : a.nodeType == CKEDITOR.NODE_TEXT ? "text" : a.nodeType == CKEDITOR.NODE_COMMENT ? "comment" : a.nodeType == CKEDITOR.NODE_DOCUMENT_FRAGMENT ? "documentFragment" : "domObject"](a) : this }, CKEDITOR.dom.node.prototype =
    new CKEDITOR.dom.domObject, CKEDITOR.NODE_ELEMENT = 1, CKEDITOR.NODE_DOCUMENT = 9, CKEDITOR.NODE_TEXT = 3, CKEDITOR.NODE_COMMENT = 8, CKEDITOR.NODE_DOCUMENT_FRAGMENT = 11, CKEDITOR.POSITION_IDENTICAL = 0, CKEDITOR.POSITION_DISCONNECTED = 1, CKEDITOR.POSITION_FOLLOWING = 2, CKEDITOR.POSITION_PRECEDING = 4, CKEDITOR.POSITION_IS_CONTAINED = 8, CKEDITOR.POSITION_CONTAINS = 16, CKEDITOR.tools.extend(CKEDITOR.dom.node.prototype, {
      appendTo: function(a, d) { a.append(this, d); return a },
      clone: function(a, d) {
        function b(c) {
          c["data-cke-expando"] && (c["data-cke-expando"] = !1);
          if (c.nodeType == CKEDITOR.NODE_ELEMENT || c.nodeType == CKEDITOR.NODE_DOCUMENT_FRAGMENT)
            if (d || c.nodeType != CKEDITOR.NODE_ELEMENT || c.removeAttribute("id", !1), a) { c = c.childNodes; for (var g = 0; g < c.length; g++) b(c[g]) }
        }

        function c(b) { if (b.type == CKEDITOR.NODE_ELEMENT || b.type == CKEDITOR.NODE_DOCUMENT_FRAGMENT) { if (b.type != CKEDITOR.NODE_DOCUMENT_FRAGMENT) { var g = b.getName(); ":" == g[0] && b.renameNode(g.substring(1)) } if (a)
              for (g = 0; g < b.getChildCount(); g++) c(b.getChild(g)) } }
        var g = this.$.cloneNode(a);
        b(g);
        g = new CKEDITOR.dom.node(g);
        CKEDITOR.env.ie && 9 > CKEDITOR.env.version && (this.type == CKEDITOR.NODE_ELEMENT || this.type == CKEDITOR.NODE_DOCUMENT_FRAGMENT) && c(g);
        return g
      },
      hasPrevious: function() { return !!this.$.previousSibling },
      hasNext: function() { return !!this.$.nextSibling },
      insertAfter: function(a) { a.$.parentNode.insertBefore(this.$, a.$.nextSibling); return a },
      insertBefore: function(a) { a.$.parentNode.insertBefore(this.$, a.$); return a },
      insertBeforeMe: function(a) { this.$.parentNode.insertBefore(a.$, this.$); return a },
      getAddress: function(a) {
        for (var d = [], b = this.getDocument().$.documentElement, c = this.$; c && c != b;) { var g = c.parentNode;
          g && d.unshift(this.getIndex.call({ $: c }, a));
          c = g }
        return d
      },
      getDocument: function() { return new CKEDITOR.dom.document(this.$.ownerDocument || this.$.parentNode.ownerDocument) },
      getIndex: function(a) {
        function d(a, e) { var h = e ? a.nextSibling : a.previousSibling; return h && h.nodeType == CKEDITOR.NODE_TEXT ? b(h) ? d(h, e) : h : null }

        function b(a) { return !a.nodeValue || a.nodeValue == CKEDITOR.dom.selection.FILLING_CHAR_SEQUENCE }
        var c = this.$,
          g = -1,
          l;
        if (!this.$.parentNode ||
          a && c.nodeType == CKEDITOR.NODE_TEXT && b(c) && !d(c) && !d(c, !0)) return -1;
        do a && c != this.$ && c.nodeType == CKEDITOR.NODE_TEXT && (l || b(c)) || (g++, l = c.nodeType == CKEDITOR.NODE_TEXT); while (c = c.previousSibling);
        return g
      },
      getNextSourceNode: function(a, d, b) {
        if (b && !b.call) { var c = b;
          b = function(a) { return !a.equals(c) } } a = !a && this.getFirst && this.getFirst();
        var g;
        if (!a) { if (this.type == CKEDITOR.NODE_ELEMENT && b && !1 === b(this, !0)) return null;
          a = this.getNext() }
        for (; !a && (g = (g || this).getParent());) { if (b && !1 === b(g, !0)) return null;
          a = g.getNext() }
        return !a ||
          b && !1 === b(a) ? null : d && d != a.type ? a.getNextSourceNode(!1, d, b) : a
      },
      getPreviousSourceNode: function(a, d, b) { if (b && !b.call) { var c = b;
          b = function(a) { return !a.equals(c) } } a = !a && this.getLast && this.getLast(); var g; if (!a) { if (this.type == CKEDITOR.NODE_ELEMENT && b && !1 === b(this, !0)) return null;
          a = this.getPrevious() } for (; !a && (g = (g || this).getParent());) { if (b && !1 === b(g, !0)) return null;
          a = g.getPrevious() } return !a || b && !1 === b(a) ? null : d && a.type != d ? a.getPreviousSourceNode(!1, d, b) : a },
      getPrevious: function(a) {
        var d = this.$,
          b;
        do b = (d =
          d.previousSibling) && 10 != d.nodeType && new CKEDITOR.dom.node(d); while (b && a && !a(b));
        return b
      },
      getNext: function(a) { var d = this.$,
          b;
        do b = (d = d.nextSibling) && new CKEDITOR.dom.node(d); while (b && a && !a(b)); return b },
      getParent: function(a) { var d = this.$.parentNode; return d && (d.nodeType == CKEDITOR.NODE_ELEMENT || a && d.nodeType == CKEDITOR.NODE_DOCUMENT_FRAGMENT) ? new CKEDITOR.dom.node(d) : null },
      getParents: function(a) { var d = this,
          b = [];
        do b[a ? "push" : "unshift"](d); while (d = d.getParent()); return b },
      getCommonAncestor: function(a) {
        if (a.equals(this)) return this;
        if (a.contains && a.contains(this)) return a;
        var d = this.contains ? this : this.getParent();
        do
          if (d.contains(a)) return d; while (d = d.getParent());
        return null
      },
      getPosition: function(a) {
        var d = this.$,
          b = a.$;
        if (d.compareDocumentPosition) return d.compareDocumentPosition(b);
        if (d == b) return CKEDITOR.POSITION_IDENTICAL;
        if (this.type == CKEDITOR.NODE_ELEMENT && a.type == CKEDITOR.NODE_ELEMENT) {
          if (d.contains) {
            if (d.contains(b)) return CKEDITOR.POSITION_CONTAINS + CKEDITOR.POSITION_PRECEDING;
            if (b.contains(d)) return CKEDITOR.POSITION_IS_CONTAINED +
              CKEDITOR.POSITION_FOLLOWING
          }
          if ("sourceIndex" in d) return 0 > d.sourceIndex || 0 > b.sourceIndex ? CKEDITOR.POSITION_DISCONNECTED : d.sourceIndex < b.sourceIndex ? CKEDITOR.POSITION_PRECEDING : CKEDITOR.POSITION_FOLLOWING
        }
        d = this.getAddress();
        a = a.getAddress();
        for (var b = Math.min(d.length, a.length), c = 0; c < b; c++)
          if (d[c] != a[c]) return d[c] < a[c] ? CKEDITOR.POSITION_PRECEDING : CKEDITOR.POSITION_FOLLOWING;
        return d.length < a.length ? CKEDITOR.POSITION_CONTAINS + CKEDITOR.POSITION_PRECEDING : CKEDITOR.POSITION_IS_CONTAINED + CKEDITOR.POSITION_FOLLOWING
      },
      getAscendant: function(a, d) { var b = this.$,
          c, g;
        d || (b = b.parentNode); "function" == typeof a ? (g = !0, c = a) : (g = !1, c = function(b) { b = "string" == typeof b.nodeName ? b.nodeName.toLowerCase() : ""; return "string" == typeof a ? b == a : b in a }); for (; b;) { if (c(g ? new CKEDITOR.dom.node(b) : b)) return new CKEDITOR.dom.node(b); try { b = b.parentNode } catch (l) { b = null } } return null },
      hasAscendant: function(a, d) { var b = this.$;
        d || (b = b.parentNode); for (; b;) { if (b.nodeName && b.nodeName.toLowerCase() == a) return !0;
          b = b.parentNode } return !1 },
      move: function(a, d) {
        a.append(this.remove(),
          d)
      },
      remove: function(a) { var d = this.$,
          b = d.parentNode; if (b) { if (a)
            for (; a = d.firstChild;) b.insertBefore(d.removeChild(a), d);
          b.removeChild(d) } return this },
      replace: function(a) { this.insertBefore(a);
        a.remove() },
      trim: function() { this.ltrim();
        this.rtrim() },
      ltrim: function() { for (var a; this.getFirst && (a = this.getFirst());) { if (a.type == CKEDITOR.NODE_TEXT) { var d = CKEDITOR.tools.ltrim(a.getText()),
              b = a.getLength(); if (d) d.length < b && (a.split(b - d.length), this.$.removeChild(this.$.firstChild));
            else { a.remove(); continue } } break } },
      rtrim: function() { for (var a; this.getLast && (a = this.getLast());) { if (a.type == CKEDITOR.NODE_TEXT) { var d = CKEDITOR.tools.rtrim(a.getText()),
              b = a.getLength(); if (d) d.length < b && (a.split(d.length), this.$.lastChild.parentNode.removeChild(this.$.lastChild));
            else { a.remove(); continue } } break } CKEDITOR.env.needsBrFiller && (a = this.$.lastChild) && 1 == a.type && "br" == a.nodeName.toLowerCase() && a.parentNode.removeChild(a) },
      isReadOnly: function(a) {
        var d = this;
        this.type != CKEDITOR.NODE_ELEMENT && (d = this.getParent());
        CKEDITOR.env.edge &&
          d && d.is("textarea", "input") && (a = !0);
        if (!a && d && "undefined" != typeof d.$.isContentEditable) return !(d.$.isContentEditable || d.data("cke-editable"));
        for (; d;) { if (d.data("cke-editable")) return !1; if (d.hasAttribute("contenteditable")) return "false" == d.getAttribute("contenteditable");
          d = d.getParent() }
        return !0
      }
    }), CKEDITOR.dom.window = function(a) { CKEDITOR.dom.domObject.call(this, a) }, CKEDITOR.dom.window.prototype = new CKEDITOR.dom.domObject, CKEDITOR.tools.extend(CKEDITOR.dom.window.prototype, {
      focus: function() { this.$.focus() },
      getViewPaneSize: function() { var a = this.$.document,
          d = "CSS1Compat" == a.compatMode; return { width: (d ? a.documentElement.clientWidth : a.body.clientWidth) || 0, height: (d ? a.documentElement.clientHeight : a.body.clientHeight) || 0 } },
      getScrollPosition: function() { var a = this.$; if ("pageXOffset" in a) return { x: a.pageXOffset || 0, y: a.pageYOffset || 0 };
        a = a.document; return { x: a.documentElement.scrollLeft || a.body.scrollLeft || 0, y: a.documentElement.scrollTop || a.body.scrollTop || 0 } },
      getFrame: function() {
        var a = this.$.frameElement;
        return a ?
          new CKEDITOR.dom.element.get(a) : null
      }
    }), CKEDITOR.dom.document = function(a) { CKEDITOR.dom.domObject.call(this, a) }, CKEDITOR.dom.document.prototype = new CKEDITOR.dom.domObject, CKEDITOR.tools.extend(CKEDITOR.dom.document.prototype, {
      type: CKEDITOR.NODE_DOCUMENT,
      appendStyleSheet: function(a) { if (this.$.createStyleSheet) this.$.createStyleSheet(a);
        else { var d = new CKEDITOR.dom.element("link");
          d.setAttributes({ rel: "stylesheet", type: "text/css", href: a });
          this.getHead().append(d) } },
      appendStyleText: function(a) {
        if (this.$.createStyleSheet) {
          var d =
            this.$.createStyleSheet("");
          d.cssText = a
        } else { var b = new CKEDITOR.dom.element("style", this);
          b.append(new CKEDITOR.dom.text(a, this));
          this.getHead().append(b) }
        return d || b.$.sheet
      },
      createElement: function(a, d) { var b = new CKEDITOR.dom.element(a, this);
        d && (d.attributes && b.setAttributes(d.attributes), d.styles && b.setStyles(d.styles)); return b },
      createText: function(a) { return new CKEDITOR.dom.text(a, this) },
      focus: function() { this.getWindow().focus() },
      getActive: function() { var a; try { a = this.$.activeElement } catch (d) { return null } return new CKEDITOR.dom.element(a) },
      getById: function(a) { return (a = this.$.getElementById(a)) ? new CKEDITOR.dom.element(a) : null },
      getByAddress: function(a, d) { for (var b = this.$.documentElement, c = 0; b && c < a.length; c++) { var g = a[c]; if (d)
            for (var l = -1, k = 0; k < b.childNodes.length; k++) { var e = b.childNodes[k]; if (!0 !== d || 3 != e.nodeType || !e.previousSibling || 3 != e.previousSibling.nodeType)
                if (l++, l == g) { b = e; break } } else b = b.childNodes[g] } return b ? new CKEDITOR.dom.node(b) : null },
      getElementsByTag: function(a, d) {
        CKEDITOR.env.ie && 8 >= document.documentMode || !d || (a = d + ":" +
          a);
        return new CKEDITOR.dom.nodeList(this.$.getElementsByTagName(a))
      },
      getHead: function() { var a = this.$.getElementsByTagName("head")[0]; return a = a ? new CKEDITOR.dom.element(a) : this.getDocumentElement().append(new CKEDITOR.dom.element("head"), !0) },
      getBody: function() { return new CKEDITOR.dom.element(this.$.body) },
      getDocumentElement: function() { return new CKEDITOR.dom.element(this.$.documentElement) },
      getWindow: function() { return new CKEDITOR.dom.window(this.$.parentWindow || this.$.defaultView) },
      write: function(a) {
        this.$.open("text/html",
          "replace");
        CKEDITOR.env.ie && (a = a.replace(/(?:^\s*<!DOCTYPE[^>]*?>)|^/i, '$\x26\n\x3cscript data-cke-temp\x3d"1"\x3e(' + CKEDITOR.tools.fixDomain + ")();\x3c/script\x3e"));
        this.$.write(a);
        this.$.close()
      },
      find: function(a) { return new CKEDITOR.dom.nodeList(this.$.querySelectorAll(a)) },
      findOne: function(a) { return (a = this.$.querySelector(a)) ? new CKEDITOR.dom.element(a) : null },
      _getHtml5ShivFrag: function() {
        var a = this.getCustomData("html5ShivFrag");
        a || (a = this.$.createDocumentFragment(), CKEDITOR.tools.enableHtml5Elements(a, !0), this.setCustomData("html5ShivFrag", a));
        return a
      }
    }), CKEDITOR.dom.nodeList = function(a) { this.$ = a }, CKEDITOR.dom.nodeList.prototype = { count: function() { return this.$.length }, getItem: function(a) { return 0 > a || a >= this.$.length ? null : (a = this.$[a]) ? new CKEDITOR.dom.node(a) : null }, toArray: function() { return CKEDITOR.tools.array.map(this.$, function(a) { return new CKEDITOR.dom.node(a) }) } }, CKEDITOR.dom.element = function(a, d) {
      "string" == typeof a && (a = (d ? d.$ : document).createElement(a));
      CKEDITOR.dom.domObject.call(this,
        a)
    }, CKEDITOR.dom.element.get = function(a) { return (a = "string" == typeof a ? document.getElementById(a) || document.getElementsByName(a)[0] : a) && (a.$ ? a : new CKEDITOR.dom.element(a)) }, CKEDITOR.dom.element.prototype = new CKEDITOR.dom.node, CKEDITOR.dom.element.createFromHtml = function(a, d) { var b = new CKEDITOR.dom.element("div", d);
      b.setHtml(a); return b.getFirst().remove() }, CKEDITOR.dom.element.setMarker = function(a, d, b, c) {
      var g = d.getCustomData("list_marker_id") || d.setCustomData("list_marker_id", CKEDITOR.tools.getNextNumber()).getCustomData("list_marker_id"),
        l = d.getCustomData("list_marker_names") || d.setCustomData("list_marker_names", {}).getCustomData("list_marker_names");
      a[g] = d;
      l[b] = 1;
      return d.setCustomData(b, c)
    }, CKEDITOR.dom.element.clearAllMarkers = function(a) { for (var d in a) CKEDITOR.dom.element.clearMarkers(a, a[d], 1) }, CKEDITOR.dom.element.clearMarkers = function(a, d, b) {
      var c = d.getCustomData("list_marker_names"),
        g = d.getCustomData("list_marker_id"),
        l;
      for (l in c) d.removeCustomData(l);
      d.removeCustomData("list_marker_names");
      b && (d.removeCustomData("list_marker_id"),
        delete a[g])
    },
    function() {
      function a(a, b) { return -1 < (" " + a + " ").replace(l, " ").indexOf(" " + b + " ") }

      function d(a) { var b = !0;
        a.$.id || (a.$.id = "cke_tmp_" + CKEDITOR.tools.getNextNumber(), b = !1); return function() { b || a.removeAttribute("id") } }

      function b(a, b) { var c = CKEDITOR.tools.escapeCss(a.$.id); return "#" + c + " " + b.split(/,\s*/).join(", #" + c + " ") }

      function c(a) { for (var b = 0, c = 0, f = k[a].length; c < f; c++) b += parseFloat(this.getComputedStyle(k[a][c]) || 0, 10) || 0; return b }
      var g = document.createElement("_").classList,
        g = "undefined" !==
        typeof g && null !== String(g.add).match(/\[Native code\]/gi),
        l = /[\n\t\r]/g;
      CKEDITOR.tools.extend(CKEDITOR.dom.element.prototype, {
        type: CKEDITOR.NODE_ELEMENT,
        addClass: g ? function(a) { this.$.classList.add(a); return this } : function(e) { var b = this.$.className;
          b && (a(b, e) || (b += " " + e));
          this.$.className = b || e; return this },
        removeClass: g ? function(a) { var b = this.$;
          b.classList.remove(a);
          b.className || b.removeAttribute("class"); return this } : function(e) {
          var b = this.getAttribute("class");
          b && a(b, e) && ((b = b.replace(new RegExp("(?:^|\\s+)" +
            e + "(?\x3d\\s|$)"), "").replace(/^\s+/, "")) ? this.setAttribute("class", b) : this.removeAttribute("class"));
          return this
        },
        hasClass: function(e) { return a(this.$.className, e) },
        append: function(a, b) { "string" == typeof a && (a = this.getDocument().createElement(a));
          b ? this.$.insertBefore(a.$, this.$.firstChild) : this.$.appendChild(a.$); return a },
        appendHtml: function(a) { if (this.$.childNodes.length) { var b = new CKEDITOR.dom.element("div", this.getDocument());
            b.setHtml(a);
            b.moveChildren(this) } else this.setHtml(a) },
        appendText: function(a) {
          null !=
            this.$.text && CKEDITOR.env.ie && 9 > CKEDITOR.env.version ? this.$.text += a : this.append(new CKEDITOR.dom.text(a))
        },
        appendBogus: function(a) { if (a || CKEDITOR.env.needsBrFiller) { for (a = this.getLast(); a && a.type == CKEDITOR.NODE_TEXT && !CKEDITOR.tools.rtrim(a.getText());) a = a.getPrevious();
            a && a.is && a.is("br") || (a = this.getDocument().createElement("br"), CKEDITOR.env.gecko && a.setAttribute("type", "_moz"), this.append(a)) } },
        breakParent: function(a, b) {
          var c = new CKEDITOR.dom.range(this.getDocument());
          c.setStartAfter(this);
          c.setEndAfter(a);
          var f = c.extractContents(!1, b || !1),
            g;
          c.insertNode(this.remove());
          if (CKEDITOR.env.ie && !CKEDITOR.env.edge) { for (c = new CKEDITOR.dom.element("div"); g = f.getFirst();) g.$.style.backgroundColor && (g.$.style.backgroundColor = g.$.style.backgroundColor), c.append(g);
            c.insertAfter(this);
            c.remove(!0) } else f.insertAfterNode(this)
        },
        contains: document.compareDocumentPosition ? function(a) { return !!(this.$.compareDocumentPosition(a.$) & 16) } : function(a) {
          var b = this.$;
          return a.type != CKEDITOR.NODE_ELEMENT ? b.contains(a.getParent().$) :
            b != a.$ && b.contains(a.$)
        },
        focus: function() {
          function a() { try { this.$.focus() } catch (e) {} } return function(b) { b ? CKEDITOR.tools.setTimeout(a, 100, this) : a.call(this) } }(),
        getHtml: function() { var a = this.$.innerHTML; return CKEDITOR.env.ie ? a.replace(/<\?[^>]*>/g, "") : a },
        getOuterHtml: function() { if (this.$.outerHTML) return this.$.outerHTML.replace(/<\?[^>]*>/, ""); var a = this.$.ownerDocument.createElement("div");
          a.appendChild(this.$.cloneNode(!0)); return a.innerHTML },
        getClientRect: function() {
          var a = CKEDITOR.tools.extend({},
            this.$.getBoundingClientRect());
          !a.width && (a.width = a.right - a.left);
          !a.height && (a.height = a.bottom - a.top);
          return a
        },
        setHtml: CKEDITOR.env.ie && 9 > CKEDITOR.env.version ? function(a) { try { var b = this.$; if (this.getParent()) return b.innerHTML = a; var c = this.getDocument()._getHtml5ShivFrag();
            c.appendChild(b);
            b.innerHTML = a;
            c.removeChild(b); return a } catch (f) { this.$.innerHTML = "";
            b = new CKEDITOR.dom.element("body", this.getDocument());
            b.$.innerHTML = a; for (b = b.getChildren(); b.count();) this.append(b.getItem(0)); return a } } : function(a) { return this.$.innerHTML = a },
        setText: function() { var a = document.createElement("p");
          a.innerHTML = "x";
          a = a.textContent; return function(b) { this.$[a ? "textContent" : "innerText"] = b } }(),
        getAttribute: function() {
          var a = function(a) { return this.$.getAttribute(a, 2) };
          return CKEDITOR.env.ie && (CKEDITOR.env.ie7Compat || CKEDITOR.env.quirks) ? function(a) {
            switch (a) {
              case "class":
                a = "className";
                break;
              case "http-equiv":
                a = "httpEquiv";
                break;
              case "name":
                return this.$.name;
              case "tabindex":
                return a = this.$.getAttribute(a,
                  2), 0 !== a && 0 === this.$.tabIndex && (a = null), a;
              case "checked":
                return a = this.$.attributes.getNamedItem(a), (a.specified ? a.nodeValue : this.$.checked) ? "checked" : null;
              case "hspace":
              case "value":
                return this.$[a];
              case "style":
                return this.$.style.cssText;
              case "contenteditable":
              case "contentEditable":
                return this.$.attributes.getNamedItem("contentEditable").specified ? this.$.getAttribute("contentEditable") : null
            }
            return this.$.getAttribute(a, 2)
          } : a
        }(),
        getAttributes: function(a) {
          var b = {},
            c = this.$.attributes,
            f;
          a = CKEDITOR.tools.isArray(a) ?
            a : [];
          for (f = 0; f < c.length; f++) - 1 === CKEDITOR.tools.indexOf(a, c[f].name) && (b[c[f].name] = c[f].value);
          return b
        },
        getChildren: function() { return new CKEDITOR.dom.nodeList(this.$.childNodes) },
        getComputedStyle: document.defaultView && document.defaultView.getComputedStyle ? function(a) { var b = this.getWindow().$.getComputedStyle(this.$, null); return b ? b.getPropertyValue(a) : "" } : function(a) { return this.$.currentStyle[CKEDITOR.tools.cssStyleToDomStyle(a)] },
        getDtd: function() {
          var a = CKEDITOR.dtd[this.getName()];
          this.getDtd =
            function() { return a };
          return a
        },
        getElementsByTag: CKEDITOR.dom.document.prototype.getElementsByTag,
        getTabIndex: function() { var a = this.$.tabIndex; return 0 !== a || CKEDITOR.dtd.$tabIndex[this.getName()] || 0 === parseInt(this.getAttribute("tabindex"), 10) ? a : -1 },
        getText: function() { return this.$.textContent || this.$.innerText || "" },
        getWindow: function() { return this.getDocument().getWindow() },
        getId: function() { return this.$.id || null },
        getNameAtt: function() { return this.$.name || null },
        getName: function() {
          var a = this.$.nodeName.toLowerCase();
          if (CKEDITOR.env.ie && 8 >= document.documentMode) { var b = this.$.scopeName; "HTML" != b && (a = b.toLowerCase() + ":" + a) } this.getName = function() { return a };
          return this.getName()
        },
        getValue: function() { return this.$.value },
        getFirst: function(a) { var b = this.$.firstChild;
          (b = b && new CKEDITOR.dom.node(b)) && a && !a(b) && (b = b.getNext(a)); return b },
        getLast: function(a) { var b = this.$.lastChild;
          (b = b && new CKEDITOR.dom.node(b)) && a && !a(b) && (b = b.getPrevious(a)); return b },
        getStyle: function(a) { return this.$.style[CKEDITOR.tools.cssStyleToDomStyle(a)] },
        is: function() { var a = this.getName(); if ("object" == typeof arguments[0]) return !!arguments[0][a]; for (var b = 0; b < arguments.length; b++)
            if (arguments[b] == a) return !0; return !1 },
        isEditable: function(a) {
          var b = this.getName();
          return this.isReadOnly() || "none" == this.getComputedStyle("display") || "hidden" == this.getComputedStyle("visibility") || CKEDITOR.dtd.$nonEditable[b] || CKEDITOR.dtd.$empty[b] || this.is("a") && (this.data("cke-saved-name") || this.hasAttribute("name")) && !this.getChildCount() ? !1 : !1 !== a ? (a = CKEDITOR.dtd[b] ||
            CKEDITOR.dtd.span, !(!a || !a["#"])) : !0
        },
        isIdentical: function(a) {
          var b = this.clone(0, 1);
          a = a.clone(0, 1);
          b.removeAttributes(["_moz_dirty", "data-cke-expando", "data-cke-saved-href", "data-cke-saved-name"]);
          a.removeAttributes(["_moz_dirty", "data-cke-expando", "data-cke-saved-href", "data-cke-saved-name"]);
          if (b.$.isEqualNode) return b.$.style.cssText = CKEDITOR.tools.normalizeCssText(b.$.style.cssText), a.$.style.cssText = CKEDITOR.tools.normalizeCssText(a.$.style.cssText), b.$.isEqualNode(a.$);
          b = b.getOuterHtml();
          a =
            a.getOuterHtml();
          if (CKEDITOR.env.ie && 9 > CKEDITOR.env.version && this.is("a")) { var c = this.getParent();
            c.type == CKEDITOR.NODE_ELEMENT && (c = c.clone(), c.setHtml(b), b = c.getHtml(), c.setHtml(a), a = c.getHtml()) }
          return b == a
        },
        isVisible: function() { var a = (this.$.offsetHeight || this.$.offsetWidth) && "hidden" != this.getComputedStyle("visibility"),
            b, c;
          a && CKEDITOR.env.webkit && (b = this.getWindow(), !b.equals(CKEDITOR.document.getWindow()) && (c = b.$.frameElement) && (a = (new CKEDITOR.dom.element(c)).isVisible())); return !!a },
        isEmptyInlineRemoveable: function() {
          if (!CKEDITOR.dtd.$removeEmpty[this.getName()]) return !1;
          for (var a = this.getChildren(), b = 0, c = a.count(); b < c; b++) { var f = a.getItem(b); if (f.type != CKEDITOR.NODE_ELEMENT || !f.data("cke-bookmark"))
              if (f.type == CKEDITOR.NODE_ELEMENT && !f.isEmptyInlineRemoveable() || f.type == CKEDITOR.NODE_TEXT && CKEDITOR.tools.trim(f.getText())) return !1 }
          return !0
        },
        hasAttributes: CKEDITOR.env.ie && (CKEDITOR.env.ie7Compat || CKEDITOR.env.quirks) ? function() {
          for (var a = this.$.attributes, b = 0; b < a.length; b++) {
            var c = a[b];
            switch (c.nodeName) {
              case "class":
                if (this.getAttribute("class")) return !0;
              case "data-cke-expando":
                continue;
              default:
                if (c.specified) return !0
            }
          }
          return !1
        } : function() { var a = this.$.attributes,
            b = a.length,
            c = { "data-cke-expando": 1, _moz_dirty: 1 }; return 0 < b && (2 < b || !c[a[0].nodeName] || 2 == b && !c[a[1].nodeName]) },
        hasAttribute: function() {
          function a(b) {
            var e = this.$.attributes.getNamedItem(b);
            if ("input" == this.getName()) switch (b) {
              case "class":
                return 0 < this.$.className.length;
              case "checked":
                return !!this.$.checked;
              case "value":
                return b = this.getAttribute("type"), "checkbox" == b || "radio" == b ? "on" != this.$.value : !!this.$.value }
            return e ?
              e.specified : !1
          }
          return CKEDITOR.env.ie ? 8 > CKEDITOR.env.version ? function(b) { return "name" == b ? !!this.$.name : a.call(this, b) } : a : function(a) { return !!this.$.attributes.getNamedItem(a) }
        }(),
        hide: function() { this.setStyle("display", "none") },
        moveChildren: function(a, b) { var c = this.$;
          a = a.$; if (c != a) { var f; if (b)
              for (; f = c.lastChild;) a.insertBefore(c.removeChild(f), a.firstChild);
            else
              for (; f = c.firstChild;) a.appendChild(c.removeChild(f)) } },
        mergeSiblings: function() {
          function a(b, e, f) {
            if (e && e.type == CKEDITOR.NODE_ELEMENT) {
              for (var c = []; e.data("cke-bookmark") || e.isEmptyInlineRemoveable();)
                if (c.push(e), e = f ? e.getNext() : e.getPrevious(), !e || e.type != CKEDITOR.NODE_ELEMENT) return;
              if (b.isIdentical(e)) { for (var g = f ? b.getLast() : b.getFirst(); c.length;) c.shift().move(b, !f);
                e.moveChildren(b, !f);
                e.remove();
                g && g.type == CKEDITOR.NODE_ELEMENT && g.mergeSiblings() }
            }
          }
          return function(b) { if (!1 === b || CKEDITOR.dtd.$removeEmpty[this.getName()] || this.is("a")) a(this, this.getNext(), !0), a(this, this.getPrevious()) }
        }(),
        show: function() {
          this.setStyles({
            display: "",
            visibility: ""
          })
        },
        setAttribute: function() {
          var a = function(a, b) { this.$.setAttribute(a, b); return this };
          return CKEDITOR.env.ie && (CKEDITOR.env.ie7Compat || CKEDITOR.env.quirks) ? function(b, c) { "class" == b ? this.$.className = c : "style" == b ? this.$.style.cssText = c : "tabindex" == b ? this.$.tabIndex = c : "checked" == b ? this.$.checked = c : "contenteditable" == b ? a.call(this, "contentEditable", c) : a.apply(this, arguments); return this } : CKEDITOR.env.ie8Compat && CKEDITOR.env.secure ? function(b, c) {
            if ("src" == b && c.match(/^http:\/\//)) try {
              a.apply(this,
                arguments)
            } catch (f) {} else a.apply(this, arguments);
            return this
          } : a
        }(),
        setAttributes: function(a) { for (var b in a) this.setAttribute(b, a[b]); return this },
        setValue: function(a) { this.$.value = a; return this },
        removeAttribute: function() { var a = function(a) { this.$.removeAttribute(a) }; return CKEDITOR.env.ie && (CKEDITOR.env.ie7Compat || CKEDITOR.env.quirks) ? function(a) { "class" == a ? a = "className" : "tabindex" == a ? a = "tabIndex" : "contenteditable" == a && (a = "contentEditable");
            this.$.removeAttribute(a) } : a }(),
        removeAttributes: function(a) {
          if (CKEDITOR.tools.isArray(a))
            for (var b =
                0; b < a.length; b++) this.removeAttribute(a[b]);
          else
            for (b in a = a || this.getAttributes(), a) a.hasOwnProperty(b) && this.removeAttribute(b)
        },
        removeStyle: function(a) {
          var b = this.$.style;
          if (b.removeProperty || "border" != a && "margin" != a && "padding" != a) b.removeProperty ? b.removeProperty(a) : b.removeAttribute(CKEDITOR.tools.cssStyleToDomStyle(a)), this.$.style.cssText || this.removeAttribute("style");
          else {
            var c = ["top", "left", "right", "bottom"],
              f;
            "border" == a && (f = ["color", "style", "width"]);
            for (var b = [], g = 0; g < c.length; g++)
              if (f)
                for (var d =
                    0; d < f.length; d++) b.push([a, c[g], f[d]].join("-"));
              else b.push([a, c[g]].join("-"));
            for (a = 0; a < b.length; a++) this.removeStyle(b[a])
          }
        },
        setStyle: function(a, b) { this.$.style[CKEDITOR.tools.cssStyleToDomStyle(a)] = b; return this },
        setStyles: function(a) { for (var b in a) this.setStyle(b, a[b]); return this },
        setOpacity: function(a) { CKEDITOR.env.ie && 9 > CKEDITOR.env.version ? (a = Math.round(100 * a), this.setStyle("filter", 100 <= a ? "" : "progid:DXImageTransform.Microsoft.Alpha(opacity\x3d" + a + ")")) : this.setStyle("opacity", a) },
        unselectable: function() {
          this.setStyles(CKEDITOR.tools.cssVendorPrefix("user-select",
            "none"));
          if (CKEDITOR.env.ie) { this.setAttribute("unselectable", "on"); for (var a, b = this.getElementsByTag("*"), c = 0, f = b.count(); c < f; c++) a = b.getItem(c), a.setAttribute("unselectable", "on") }
        },
        getPositionedAncestor: function() { for (var a = this;
            "html" != a.getName();) { if ("static" != a.getComputedStyle("position")) return a;
            a = a.getParent() } return null },
        getDocumentPosition: function(a) {
          var b = 0,
            c = 0,
            f = this.getDocument(),
            g = f.getBody(),
            d = "BackCompat" == f.$.compatMode;
          if (document.documentElement.getBoundingClientRect && (CKEDITOR.env.ie ?
              8 !== CKEDITOR.env.version : 1)) { var k = this.$.getBoundingClientRect(),
              l = f.$.documentElement,
              v = l.clientTop || g.$.clientTop || 0,
              t = l.clientLeft || g.$.clientLeft || 0,
              u = !0;
            CKEDITOR.env.ie && (u = f.getDocumentElement().contains(this), f = f.getBody().contains(this), u = d && f || !d && u);
            u && (CKEDITOR.env.webkit || CKEDITOR.env.ie && 12 <= CKEDITOR.env.version ? (b = g.$.scrollLeft || l.scrollLeft, c = g.$.scrollTop || l.scrollTop) : (c = d ? g.$ : l, b = c.scrollLeft, c = c.scrollTop), b = k.left + b - t, c = k.top + c - v) } else
            for (v = this, t = null; v && "body" != v.getName() &&
              "html" != v.getName();) { b += v.$.offsetLeft - v.$.scrollLeft;
              c += v.$.offsetTop - v.$.scrollTop;
              v.equals(this) || (b += v.$.clientLeft || 0, c += v.$.clientTop || 0); for (; t && !t.equals(v);) b -= t.$.scrollLeft, c -= t.$.scrollTop, t = t.getParent();
              t = v;
              v = (k = v.$.offsetParent) ? new CKEDITOR.dom.element(k) : null } a && (k = this.getWindow(), v = a.getWindow(), !k.equals(v) && k.$.frameElement && (a = (new CKEDITOR.dom.element(k.$.frameElement)).getDocumentPosition(a), b += a.x, c += a.y));
          document.documentElement.getBoundingClientRect || !CKEDITOR.env.gecko ||
            d || (b += this.$.clientLeft ? 1 : 0, c += this.$.clientTop ? 1 : 0);
          return { x: b, y: c }
        },
        scrollIntoView: function(a) { var b = this.getParent(); if (b) { do
              if ((b.$.clientWidth && b.$.clientWidth < b.$.scrollWidth || b.$.clientHeight && b.$.clientHeight < b.$.scrollHeight) && !b.is("body") && this.scrollIntoParent(b, a, 1), b.is("html")) { var c = b.getWindow(); try { var f = c.$.frameElement;
                  f && (b = new CKEDITOR.dom.element(f)) } catch (g) {} } while (b = b.getParent()) } },
        scrollIntoParent: function(a, b, c) {
          var f, g, d, k;

          function l(f, b) {
            /body|html/.test(a.getName()) ?
              a.getWindow().$.scrollBy(f, b) : (a.$.scrollLeft += f, a.$.scrollTop += b)
          }

          function v(a, f) { var b = { x: 0, y: 0 }; if (!a.is(u ? "body" : "html")) { var c = a.$.getBoundingClientRect();
              b.x = c.left;
              b.y = c.top } c = a.getWindow();
            c.equals(f) || (c = v(CKEDITOR.dom.element.get(c.$.frameElement), f), b.x += c.x, b.y += c.y); return b }

          function t(a, f) { return parseInt(a.getComputedStyle("margin-" + f) || 0, 10) || 0 }!a && (a = this.getWindow());
          d = a.getDocument();
          var u = "BackCompat" == d.$.compatMode;
          a instanceof CKEDITOR.dom.window && (a = u ? d.getBody() : d.getDocumentElement());
          CKEDITOR.env.webkit && (d = this.getEditor(!1)) && (d._.previousScrollTop = null);
          d = a.getWindow();
          g = v(this, d);
          var r = v(a, d),
            B = this.$.offsetHeight;
          f = this.$.offsetWidth;
          var x = a.$.clientHeight,
            y = a.$.clientWidth;
          d = g.x - t(this, "left") - r.x || 0;
          k = g.y - t(this, "top") - r.y || 0;
          f = g.x + f + t(this, "right") - (r.x + y) || 0;
          g = g.y + B + t(this, "bottom") - (r.y + x) || 0;
          (0 > k || 0 < g) && l(0, !0 === b ? k : !1 === b ? g : 0 > k ? k : g);
          c && (0 > d || 0 < f) && l(0 > d ? d : f, 0)
        },
        setState: function(a, b, c) {
          b = b || "cke";
          switch (a) {
            case CKEDITOR.TRISTATE_ON:
              this.addClass(b + "_on");
              this.removeClass(b +
                "_off");
              this.removeClass(b + "_disabled");
              c && this.setAttribute("aria-pressed", !0);
              c && this.removeAttribute("aria-disabled");
              break;
            case CKEDITOR.TRISTATE_DISABLED:
              this.addClass(b + "_disabled");
              this.removeClass(b + "_off");
              this.removeClass(b + "_on");
              c && this.setAttribute("aria-disabled", !0);
              c && this.removeAttribute("aria-pressed");
              break;
            default:
              this.addClass(b + "_off"), this.removeClass(b + "_on"), this.removeClass(b + "_disabled"), c && this.removeAttribute("aria-pressed"), c && this.removeAttribute("aria-disabled")
          }
        },
        getFrameDocument: function() { var a = this.$; try { a.contentWindow.document } catch (b) { a.src = a.src } return a && new CKEDITOR.dom.document(a.contentWindow.document) },
        copyAttributes: function(a, b) {
          var c = this.$.attributes;
          b = b || {};
          for (var f = 0; f < c.length; f++) { var g = c[f],
              d = g.nodeName.toLowerCase(),
              k; if (!(d in b))
              if ("checked" == d && (k = this.getAttribute(d))) a.setAttribute(d, k);
              else if (!CKEDITOR.env.ie || this.hasAttribute(d)) k = this.getAttribute(d), null === k && (k = g.nodeValue), a.setAttribute(d, k) }
          "" !== this.$.style.cssText &&
            (a.$.style.cssText = this.$.style.cssText)
        },
        renameNode: function(a) { if (this.getName() != a) { var b = this.getDocument();
            a = new CKEDITOR.dom.element(a, b);
            this.copyAttributes(a);
            this.moveChildren(a);
            this.getParent(!0) && this.$.parentNode.replaceChild(a.$, this.$);
            a.$["data-cke-expando"] = this.$["data-cke-expando"];
            this.$ = a.$;
            delete this.getName } },
        getChild: function() {
          function a(b, c) { var f = b.childNodes; if (0 <= c && c < f.length) return f[c] }
          return function(b) {
            var c = this.$;
            if (b.slice)
              for (b = b.slice(); 0 < b.length && c;) c = a(c,
                b.shift());
            else c = a(c, b);
            return c ? new CKEDITOR.dom.node(c) : null
          }
        }(),
        getChildCount: function() { return this.$.childNodes.length },
        disableContextMenu: function() {
          function a(b) { return b.type == CKEDITOR.NODE_ELEMENT && b.hasClass("cke_enable_context_menu") } this.on("contextmenu", function(b) { b.data.getTarget().getAscendant(a, !0) || b.data.preventDefault() }) },
        getDirection: function(a) {
          return a ? this.getComputedStyle("direction") || this.getDirection() || this.getParent() && this.getParent().getDirection(1) || this.getDocument().$.dir ||
            "ltr" : this.getStyle("direction") || this.getAttribute("dir")
        },
        data: function(a, b) { a = "data-" + a; if (void 0 === b) return this.getAttribute(a);!1 === b ? this.removeAttribute(a) : this.setAttribute(a, b); return null },
        getEditor: function(a) { var b = CKEDITOR.instances,
            c, f, g;
          a = a || void 0 === a; for (c in b)
            if (f = b[c], f.element.equals(this) && f.elementMode != CKEDITOR.ELEMENT_MODE_APPENDTO || !a && (g = f.editable()) && (g.equals(this) || g.contains(this))) return f; return null },
        find: function(a) {
          var c = d(this);
          a = new CKEDITOR.dom.nodeList(this.$.querySelectorAll(b(this,
            a)));
          c();
          return a
        },
        findOne: function(a) { var c = d(this);
          a = this.$.querySelector(b(this, a));
          c(); return a ? new CKEDITOR.dom.element(a) : null },
        forEach: function(a, b, c) { if (!(c || b && this.type != b)) var f = a(this); if (!1 !== f) { c = this.getChildren(); for (var g = 0; g < c.count(); g++) f = c.getItem(g), f.type == CKEDITOR.NODE_ELEMENT ? f.forEach(a, b) : b && f.type != b || a(f) } }
      });
      var k = { width: ["border-left-width", "border-right-width", "padding-left", "padding-right"], height: ["border-top-width", "border-bottom-width", "padding-top", "padding-bottom"] };
      CKEDITOR.dom.element.prototype.setSize = function(a, b, g) { "number" == typeof b && (!g || CKEDITOR.env.ie && CKEDITOR.env.quirks || (b -= c.call(this, a)), this.setStyle(a, b + "px")) };
      CKEDITOR.dom.element.prototype.getSize = function(a, b) { var g = Math.max(this.$["offset" + CKEDITOR.tools.capitalize(a)], this.$["client" + CKEDITOR.tools.capitalize(a)]) || 0;
        b && (g -= c.call(this, a)); return g }
    }(), CKEDITOR.dom.documentFragment = function(a) { a = a || CKEDITOR.document;
      this.$ = a.type == CKEDITOR.NODE_DOCUMENT ? a.$.createDocumentFragment() : a }, CKEDITOR.tools.extend(CKEDITOR.dom.documentFragment.prototype,
      CKEDITOR.dom.element.prototype, { type: CKEDITOR.NODE_DOCUMENT_FRAGMENT, insertAfterNode: function(a) { a = a.$;
          a.parentNode.insertBefore(this.$, a.nextSibling) }, getHtml: function() { var a = new CKEDITOR.dom.element("div");
          this.clone(1, 1).appendTo(a); return a.getHtml().replace(/\s*data-cke-expando=".*?"/g, "") } }, !0, {
        append: 1,
        appendBogus: 1,
        clone: 1,
        getFirst: 1,
        getHtml: 1,
        getLast: 1,
        getParent: 1,
        getNext: 1,
        getPrevious: 1,
        appendTo: 1,
        moveChildren: 1,
        insertBefore: 1,
        insertAfterNode: 1,
        replace: 1,
        trim: 1,
        type: 1,
        ltrim: 1,
        rtrim: 1,
        getDocument: 1,
        getChildCount: 1,
        getChild: 1,
        getChildren: 1
      }),
    function() {
      function a(a, f) {
        var b = this.range;
        if (this._.end) return null;
        if (!this._.start) { this._.start = 1; if (b.collapsed) return this.end(), null;
          b.optimize() }
        var c, e = b.startContainer;
        c = b.endContainer;
        var g = b.startOffset,
          d = b.endOffset,
          h, m = this.guard,
          n = this.type,
          k = a ? "getPreviousSourceNode" : "getNextSourceNode";
        if (!a && !this._.guardLTR) {
          var l = c.type == CKEDITOR.NODE_ELEMENT ? c : c.getParent(),
            A = c.type == CKEDITOR.NODE_ELEMENT ? c.getChild(d) : c.getNext();
          this._.guardLTR = function(a,
            f) { return (!f || !l.equals(a)) && (!A || !a.equals(A)) && (a.type != CKEDITOR.NODE_ELEMENT || !f || !a.equals(b.root)) }
        }
        if (a && !this._.guardRTL) { var G = e.type == CKEDITOR.NODE_ELEMENT ? e : e.getParent(),
            D = e.type == CKEDITOR.NODE_ELEMENT ? g ? e.getChild(g - 1) : null : e.getPrevious();
          this._.guardRTL = function(a, f) { return (!f || !G.equals(a)) && (!D || !a.equals(D)) && (a.type != CKEDITOR.NODE_ELEMENT || !f || !a.equals(b.root)) } }
        var F = a ? this._.guardRTL : this._.guardLTR;
        h = m ? function(a, f) { return !1 === F(a, f) ? !1 : m(a, f) } : F;
        this.current ? c = this.current[k](!1,
          n, h) : (a ? c.type == CKEDITOR.NODE_ELEMENT && (c = 0 < d ? c.getChild(d - 1) : !1 === h(c, !0) ? null : c.getPreviousSourceNode(!0, n, h)) : (c = e, c.type == CKEDITOR.NODE_ELEMENT && ((c = c.getChild(g)) || (c = !1 === h(e, !0) ? null : e.getNextSourceNode(!0, n, h)))), c && !1 === h(c) && (c = null));
        for (; c && !this._.end;) { this.current = c; if (!this.evaluator || !1 !== this.evaluator(c)) { if (!f) return c } else if (f && this.evaluator) return !1;
          c = c[k](!1, n, h) } this.end();
        return this.current = null
      }

      function d(f) { for (var b, c = null; b = a.call(this, f);) c = b; return c } CKEDITOR.dom.walker =
        CKEDITOR.tools.createClass({ $: function(a) { this.range = a;
            this._ = {} }, proto: { end: function() { this._.end = 1 }, next: function() { return a.call(this) }, previous: function() { return a.call(this, 1) }, checkForward: function() { return !1 !== a.call(this, 0, 1) }, checkBackward: function() { return !1 !== a.call(this, 1, 1) }, lastForward: function() { return d.call(this) }, lastBackward: function() { return d.call(this, 1) }, reset: function() { delete this.current;
              this._ = {} } } });
      var b = {
          block: 1,
          "list-item": 1,
          table: 1,
          "table-row-group": 1,
          "table-header-group": 1,
          "table-footer-group": 1,
          "table-row": 1,
          "table-column-group": 1,
          "table-column": 1,
          "table-cell": 1,
          "table-caption": 1
        },
        c = { absolute: 1, fixed: 1 };
      CKEDITOR.dom.element.prototype.isBlockBoundary = function(a) { return "none" != this.getComputedStyle("float") || this.getComputedStyle("position") in c || !b[this.getComputedStyle("display")] ? !!(this.is(CKEDITOR.dtd.$block) || a && this.is(a)) : !0 };
      CKEDITOR.dom.walker.blockBoundary = function(a) { return function(f) { return !(f.type == CKEDITOR.NODE_ELEMENT && f.isBlockBoundary(a)) } };
      CKEDITOR.dom.walker.listItemBoundary =
        function() { return this.blockBoundary({ br: 1 }) };
      CKEDITOR.dom.walker.bookmark = function(a, f) {
        function b(a) { return a && a.getName && "span" == a.getName() && a.data("cke-bookmark") } return function(c) { var e, g;
          e = c && c.type != CKEDITOR.NODE_ELEMENT && (g = c.getParent()) && b(g);
          e = a ? e : e || b(c); return !!(f ^ e) } };
      CKEDITOR.dom.walker.whitespaces = function(a) {
        return function(f) {
          var b;
          f && f.type == CKEDITOR.NODE_TEXT && (b = !CKEDITOR.tools.trim(f.getText()) || CKEDITOR.env.webkit && f.getText() == CKEDITOR.dom.selection.FILLING_CHAR_SEQUENCE);
          return !!(a ^ b)
        }
      };
      CKEDITOR.dom.walker.invisible = function(a) { var f = CKEDITOR.dom.walker.whitespaces(),
          b = CKEDITOR.env.webkit ? 1 : 0; return function(c) { f(c) ? c = 1 : (c.type == CKEDITOR.NODE_TEXT && (c = c.getParent()), c = c.$.offsetWidth <= b); return !!(a ^ c) } };
      CKEDITOR.dom.walker.nodeType = function(a, f) { return function(b) { return !!(f ^ b.type == a) } };
      CKEDITOR.dom.walker.bogus = function(a) {
        function f(a) { return !l(a) && !k(a) }
        return function(b) {
          var c = CKEDITOR.env.needsBrFiller ? b.is && b.is("br") : b.getText && g.test(b.getText());
          c && (c = b.getParent(),
            b = b.getNext(f), c = c.isBlockBoundary() && (!b || b.type == CKEDITOR.NODE_ELEMENT && b.isBlockBoundary()));
          return !!(a ^ c)
        }
      };
      CKEDITOR.dom.walker.temp = function(a) { return function(f) { f.type != CKEDITOR.NODE_ELEMENT && (f = f.getParent());
          f = f && f.hasAttribute("data-cke-temp"); return !!(a ^ f) } };
      var g = /^[\t\r\n ]*(?:&nbsp;|\xa0)$/,
        l = CKEDITOR.dom.walker.whitespaces(),
        k = CKEDITOR.dom.walker.bookmark(),
        e = CKEDITOR.dom.walker.temp(),
        h = function(a) { return k(a) || l(a) || a.type == CKEDITOR.NODE_ELEMENT && a.is(CKEDITOR.dtd.$inline) && !a.is(CKEDITOR.dtd.$empty) };
      CKEDITOR.dom.walker.ignored = function(a) { return function(f) { f = l(f) || k(f) || e(f); return !!(a ^ f) } };
      var m = CKEDITOR.dom.walker.ignored();
      CKEDITOR.dom.walker.empty = function(a) { return function(f) { for (var b = 0, c = f.getChildCount(); b < c; ++b)
            if (!m(f.getChild(b))) return !!a; return !a } };
      var f = CKEDITOR.dom.walker.empty(),
        n = CKEDITOR.dom.walker.validEmptyBlockContainers = CKEDITOR.tools.extend(function(a) { var f = {},
            b; for (b in a) CKEDITOR.dtd[b]["#"] && (f[b] = 1); return f }(CKEDITOR.dtd.$block), { caption: 1, td: 1, th: 1 });
      CKEDITOR.dom.walker.editable =
        function(a) { return function(b) { b = m(b) ? !1 : b.type == CKEDITOR.NODE_TEXT || b.type == CKEDITOR.NODE_ELEMENT && (b.is(CKEDITOR.dtd.$inline) || b.is("hr") || "false" == b.getAttribute("contenteditable") || !CKEDITOR.env.needsBrFiller && b.is(n) && f(b)) ? !0 : !1; return !!(a ^ b) } };
      CKEDITOR.dom.element.prototype.getBogus = function() { var a = this;
        do a = a.getPreviousSourceNode(); while (h(a)); return a && (CKEDITOR.env.needsBrFiller ? a.is && a.is("br") : a.getText && g.test(a.getText())) ? a : !1 }
    }(), CKEDITOR.dom.range = function(a) {
      this.endOffset = this.endContainer =
        this.startOffset = this.startContainer = null;
      this.collapsed = !0;
      var d = a instanceof CKEDITOR.dom.document;
      this.document = d ? a : a.getDocument();
      this.root = d ? a.getBody() : a
    },
    function() {
      function a(a) { a.collapsed = a.startContainer && a.endContainer && a.startContainer.equals(a.endContainer) && a.startOffset == a.endOffset }

      function d(a, b, c, e, g) {
        function d(a, f, b, c) { var e = b ? a.getPrevious() : a.getNext(); if (c && k) return e;
          x || c ? f.append(a.clone(!0, g), b) : (a.remove(), l && f.append(a, b)); return e }

        function h() {
          var a, f, b, c = Math.min(J.length,
            E.length);
          for (a = 0; a < c; a++)
            if (f = J[a], b = E[a], !f.equals(b)) return a;
          return a - 1
        }

        function m() {
          var b = R - 1,
            c = F && I && !y.equals(C);
          b < O - 1 || b < S - 1 || c ? (c ? a.moveToPosition(C, CKEDITOR.POSITION_BEFORE_START) : S == b + 1 && D ? a.moveToPosition(E[b], CKEDITOR.POSITION_BEFORE_END) : a.moveToPosition(E[b + 1], CKEDITOR.POSITION_BEFORE_START), e && (b = J[b + 1]) && b.type == CKEDITOR.NODE_ELEMENT && (c = CKEDITOR.dom.element.createFromHtml('\x3cspan data-cke-bookmark\x3d"1" style\x3d"display:none"\x3e\x26nbsp;\x3c/span\x3e', a.document), c.insertAfter(b),
            b.mergeSiblings(!1), a.moveToBookmark({ startNode: c }))) : a.collapse(!0)
        }
        a.optimizeBookmark();
        var k = 0 === b,
          l = 1 == b,
          x = 2 == b;
        b = x || l;
        var y = a.startContainer,
          C = a.endContainer,
          z = a.startOffset,
          A = a.endOffset,
          G, D, F, I, H, K;
        if (x && C.type == CKEDITOR.NODE_TEXT && (y.equals(C) || y.type === CKEDITOR.NODE_ELEMENT && y.getFirst().equals(C))) c.append(a.document.createText(C.substring(z, A)));
        else {
          C.type == CKEDITOR.NODE_TEXT ? x ? K = !0 : C = C.split(A) : 0 < C.getChildCount() ? A >= C.getChildCount() ? (C = C.getChild(A - 1), D = !0) : C = C.getChild(A) : I = D = !0;
          y.type ==
            CKEDITOR.NODE_TEXT ? x ? H = !0 : y.split(z) : 0 < y.getChildCount() ? 0 === z ? (y = y.getChild(z), G = !0) : y = y.getChild(z - 1) : F = G = !0;
          for (var J = y.getParents(), E = C.getParents(), R = h(), O = J.length - 1, S = E.length - 1, L = c, V, Z, X, da = -1, P = R; P <= O; P++) { Z = J[P];
            X = Z.getNext(); for (P != O || Z.equals(E[P]) && O < S ? b && (V = L.append(Z.clone(0, g))) : G ? d(Z, L, !1, F) : H && L.append(a.document.createText(Z.substring(z))); X;) { if (X.equals(E[P])) { da = P; break } X = d(X, L) } L = V } L = c;
          for (P = R; P <= S; P++)
            if (c = E[P], X = c.getPrevious(), c.equals(J[P])) b && (L = L.getChild(0));
            else {
              P !=
                S || c.equals(J[P]) && S < O ? b && (V = L.append(c.clone(0, g))) : D ? d(c, L, !1, I) : K && L.append(a.document.createText(c.substring(0, A)));
              if (P > da)
                for (; X;) X = d(X, L, !0);
              L = V
            }
          x || m()
        }
      }

      function b() { var a = !1,
          b = CKEDITOR.dom.walker.whitespaces(),
          c = CKEDITOR.dom.walker.bookmark(!0),
          e = CKEDITOR.dom.walker.bogus(); return function(g) { return c(g) || b(g) ? !0 : e(g) && !a ? a = !0 : g.type == CKEDITOR.NODE_TEXT && (g.hasAscendant("pre") || CKEDITOR.tools.trim(g.getText()).length) || g.type == CKEDITOR.NODE_ELEMENT && !g.is(l) ? !1 : !0 } }

      function c(a) {
        var b = CKEDITOR.dom.walker.whitespaces(),
          c = CKEDITOR.dom.walker.bookmark(1);
        return function(e) { return c(e) || b(e) ? !0 : !a && k(e) || e.type == CKEDITOR.NODE_ELEMENT && e.is(CKEDITOR.dtd.$removeEmpty) }
      }

      function g(a) { return function() { var b; return this[a ? "getPreviousNode" : "getNextNode"](function(a) {!b && m(a) && (b = a); return h(a) && !(k(a) && a.equals(b)) }) } }
      var l = { abbr: 1, acronym: 1, b: 1, bdo: 1, big: 1, cite: 1, code: 1, del: 1, dfn: 1, em: 1, font: 1, i: 1, ins: 1, label: 1, kbd: 1, q: 1, samp: 1, small: 1, span: 1, strike: 1, strong: 1, sub: 1, sup: 1, tt: 1, u: 1, "var": 1 },
        k = CKEDITOR.dom.walker.bogus(),
        e = /^[\t\r\n ]*(?:&nbsp;|\xa0)$/,
        h = CKEDITOR.dom.walker.editable(),
        m = CKEDITOR.dom.walker.ignored(!0);
      CKEDITOR.dom.range.prototype = {
        clone: function() { var a = new CKEDITOR.dom.range(this.root);
          a._setStartContainer(this.startContainer);
          a.startOffset = this.startOffset;
          a._setEndContainer(this.endContainer);
          a.endOffset = this.endOffset;
          a.collapsed = this.collapsed; return a },
        collapse: function(a) {
          a ? (this._setEndContainer(this.startContainer), this.endOffset = this.startOffset) : (this._setStartContainer(this.endContainer),
            this.startOffset = this.endOffset);
          this.collapsed = !0
        },
        cloneContents: function(a) { var b = new CKEDITOR.dom.documentFragment(this.document);
          this.collapsed || d(this, 2, b, !1, "undefined" == typeof a ? !0 : a); return b },
        deleteContents: function(a) { this.collapsed || d(this, 0, null, a) },
        extractContents: function(a, b) { var c = new CKEDITOR.dom.documentFragment(this.document);
          this.collapsed || d(this, 1, c, a, "undefined" == typeof b ? !0 : b); return c },
        createBookmark: function(a) {
          var b, c, e, g, d = this.collapsed;
          b = this.document.createElement("span");
          b.data("cke-bookmark", 1);
          b.setStyle("display", "none");
          b.setHtml("\x26nbsp;");
          a && (e = "cke_bm_" + CKEDITOR.tools.getNextNumber(), b.setAttribute("id", e + (d ? "C" : "S")));
          d || (c = b.clone(), c.setHtml("\x26nbsp;"), a && c.setAttribute("id", e + "E"), g = this.clone(), g.collapse(), g.insertNode(c));
          g = this.clone();
          g.collapse(!0);
          g.insertNode(b);
          c ? (this.setStartAfter(b), this.setEndBefore(c)) : this.moveToPosition(b, CKEDITOR.POSITION_AFTER_END);
          return { startNode: a ? e + (d ? "C" : "S") : b, endNode: a ? e + "E" : c, serializable: a, collapsed: d }
        },
        createBookmark2: function() {
          function a(b) {
            var f =
              b.container,
              e = b.offset,
              g;
            g = f;
            var d = e;
            g = g.type != CKEDITOR.NODE_ELEMENT || 0 === d || d == g.getChildCount() ? 0 : g.getChild(d - 1).type == CKEDITOR.NODE_TEXT && g.getChild(d).type == CKEDITOR.NODE_TEXT;
            g && (f = f.getChild(e - 1), e = f.getLength());
            if (f.type == CKEDITOR.NODE_ELEMENT && 0 < e) { a: { for (g = f; e--;)
                  if (d = g.getChild(e).getIndex(!0), 0 <= d) { e = d; break a }
                e = -1 } e += 1 }
            if (f.type == CKEDITOR.NODE_TEXT) {
              g = f;
              for (d = 0;
                (g = g.getPrevious()) && g.type == CKEDITOR.NODE_TEXT;) d += g.getText().replace(CKEDITOR.dom.selection.FILLING_CHAR_SEQUENCE, "").length;
              g = d;
              f.getText() ? e += g : (d = f.getPrevious(c), g ? (e = g, f = d ? d.getNext() : f.getParent().getFirst()) : (f = f.getParent(), e = d ? d.getIndex(!0) + 1 : 0))
            }
            b.container = f;
            b.offset = e
          }

          function b(a, f) { var c = f.getCustomData("cke-fillingChar"); if (c) { var e = a.container;
              c.equals(e) && (a.offset -= CKEDITOR.dom.selection.FILLING_CHAR_SEQUENCE.length, 0 >= a.offset && (a.offset = e.getIndex(), a.container = e.getParent())) } }
          var c = CKEDITOR.dom.walker.nodeType(CKEDITOR.NODE_TEXT, !0);
          return function(c) {
            var e = this.collapsed,
              g = {
                container: this.startContainer,
                offset: this.startOffset
              },
              d = { container: this.endContainer, offset: this.endOffset };
            c && (a(g), b(g, this.root), e || (a(d), b(d, this.root)));
            return { start: g.container.getAddress(c), end: e ? null : d.container.getAddress(c), startOffset: g.offset, endOffset: d.offset, normalized: c, collapsed: e, is2: !0 }
          }
        }(),
        moveToBookmark: function(a) {
          if (a.is2) { var b = this.document.getByAddress(a.start, a.normalized),
              c = a.startOffset,
              e = a.end && this.document.getByAddress(a.end, a.normalized);
            a = a.endOffset;
            this.setStart(b, c);
            e ? this.setEnd(e, a) : this.collapse(!0) } else b =
            (c = a.serializable) ? this.document.getById(a.startNode) : a.startNode, a = c ? this.document.getById(a.endNode) : a.endNode, this.setStartBefore(b), b.remove(), a ? (this.setEndBefore(a), a.remove()) : this.collapse(!0)
        },
        getBoundaryNodes: function() {
          var a = this.startContainer,
            b = this.endContainer,
            c = this.startOffset,
            e = this.endOffset,
            g;
          if (a.type == CKEDITOR.NODE_ELEMENT)
            if (g = a.getChildCount(), g > c) a = a.getChild(c);
            else if (1 > g) a = a.getPreviousSourceNode();
          else {
            for (a = a.$; a.lastChild;) a = a.lastChild;
            a = new CKEDITOR.dom.node(a);
            a =
              a.getNextSourceNode() || a
          }
          if (b.type == CKEDITOR.NODE_ELEMENT)
            if (g = b.getChildCount(), g > e) b = b.getChild(e).getPreviousSourceNode(!0);
            else if (1 > g) b = b.getPreviousSourceNode();
          else { for (b = b.$; b.lastChild;) b = b.lastChild;
            b = new CKEDITOR.dom.node(b) } a.getPosition(b) & CKEDITOR.POSITION_FOLLOWING && (a = b);
          return { startNode: a, endNode: b }
        },
        getCommonAncestor: function(a, b) {
          var c = this.startContainer,
            e = this.endContainer,
            c = c.equals(e) ? a && c.type == CKEDITOR.NODE_ELEMENT && this.startOffset == this.endOffset - 1 ? c.getChild(this.startOffset) :
            c : c.getCommonAncestor(e);
          return b && !c.is ? c.getParent() : c
        },
        optimize: function() { var a = this.startContainer,
            b = this.startOffset;
          a.type != CKEDITOR.NODE_ELEMENT && (b ? b >= a.getLength() && this.setStartAfter(a) : this.setStartBefore(a));
          a = this.endContainer;
          b = this.endOffset;
          a.type != CKEDITOR.NODE_ELEMENT && (b ? b >= a.getLength() && this.setEndAfter(a) : this.setEndBefore(a)) },
        optimizeBookmark: function() {
          var a = this.startContainer,
            b = this.endContainer;
          a.is && a.is("span") && a.data("cke-bookmark") && this.setStartAt(a, CKEDITOR.POSITION_BEFORE_START);
          b && b.is && b.is("span") && b.data("cke-bookmark") && this.setEndAt(b, CKEDITOR.POSITION_AFTER_END)
        },
        trim: function(a, b) {
          var c = this.startContainer,
            e = this.startOffset,
            g = this.collapsed;
          if ((!a || g) && c && c.type == CKEDITOR.NODE_TEXT) {
            if (e)
              if (e >= c.getLength()) e = c.getIndex() + 1, c = c.getParent();
              else { var d = c.split(e),
                  e = c.getIndex() + 1,
                  c = c.getParent();
                this.startContainer.equals(this.endContainer) ? this.setEnd(d, this.endOffset - this.startOffset) : c.equals(this.endContainer) && (this.endOffset += 1) }
            else e = c.getIndex(), c = c.getParent();
            this.setStart(c, e);
            if (g) { this.collapse(!0); return }
          }
          c = this.endContainer;
          e = this.endOffset;
          b || g || !c || c.type != CKEDITOR.NODE_TEXT || (e ? (e >= c.getLength() || c.split(e), e = c.getIndex() + 1) : e = c.getIndex(), c = c.getParent(), this.setEnd(c, e))
        },
        enlarge: function(a, b) {
          function c(a) { return a && a.type == CKEDITOR.NODE_ELEMENT && a.hasAttribute("contenteditable") ? null : a }
          var e = new RegExp(/[^\s\ufeff]/);
          switch (a) {
            case CKEDITOR.ENLARGE_INLINE:
              var g = 1;
            case CKEDITOR.ENLARGE_ELEMENT:
              var d = function(a, b) {
                var f = new CKEDITOR.dom.range(m);
                f.setStart(a, b);
                f.setEndAt(m, CKEDITOR.POSITION_BEFORE_END);
                var f = new CKEDITOR.dom.walker(f),
                  c;
                for (f.guard = function(a) { return !(a.type == CKEDITOR.NODE_ELEMENT && a.isBlockBoundary()) }; c = f.next();) { if (c.type != CKEDITOR.NODE_TEXT) return !1;
                  G = c != a ? c.getText() : c.substring(b); if (e.test(G)) return !1 }
                return !0
              };
              if (this.collapsed) break;
              var h = this.getCommonAncestor(),
                m = this.root,
                k, l, x, y, C, z = !1,
                A, G;
              A = this.startContainer;
              var D = this.startOffset;
              A.type == CKEDITOR.NODE_TEXT ? (D && (A = !CKEDITOR.tools.trim(A.substring(0, D)).length &&
                A, z = !!A), A && ((y = A.getPrevious()) || (x = A.getParent()))) : (D && (y = A.getChild(D - 1) || A.getLast()), y || (x = A));
              for (x = c(x); x || y;) {
                if (x && !y) {!C && x.equals(h) && (C = !0); if (g ? x.isBlockBoundary() : !m.contains(x)) break;
                  z && "inline" == x.getComputedStyle("display") || (z = !1, C ? k = x : this.setStartBefore(x));
                  y = x.getPrevious() }
                for (; y;)
                  if (A = !1, y.type == CKEDITOR.NODE_COMMENT) y = y.getPrevious();
                  else {
                    if (y.type == CKEDITOR.NODE_TEXT) G = y.getText(), e.test(G) && (y = null), A = /[\s\ufeff]$/.test(G);
                    else if ((y.$.offsetWidth > (CKEDITOR.env.webkit ? 1 :
                        0) || b && y.is("br")) && !y.data("cke-bookmark"))
                      if (z && CKEDITOR.dtd.$removeEmpty[y.getName()]) { G = y.getText(); if (e.test(G)) y = null;
                        else
                          for (var D = y.$.getElementsByTagName("*"), F = 0, I; I = D[F++];)
                            if (!CKEDITOR.dtd.$removeEmpty[I.nodeName.toLowerCase()]) { y = null; break }
                        y && (A = !!G.length) } else y = null;
                    A && (z ? C ? k = x : x && this.setStartBefore(x) : z = !0);
                    if (y) { A = y.getPrevious(); if (!x && !A) { x = y;
                        y = null; break } y = A } else x = null
                  }
                x && (x = c(x.getParent()))
              }
              A = this.endContainer;
              D = this.endOffset;
              x = y = null;
              C = z = !1;
              A.type == CKEDITOR.NODE_TEXT ?
                CKEDITOR.tools.trim(A.substring(D)).length ? z = !0 : (z = !A.getLength(), D == A.getLength() ? (y = A.getNext()) || (x = A.getParent()) : d(A, D) && (x = A.getParent())) : (y = A.getChild(D)) || (x = A);
              for (; x || y;) {
                if (x && !y) {!C && x.equals(h) && (C = !0); if (g ? x.isBlockBoundary() : !m.contains(x)) break;
                  z && "inline" == x.getComputedStyle("display") || (z = !1, C ? l = x : x && this.setEndAfter(x));
                  y = x.getNext() }
                for (; y;) {
                  A = !1;
                  if (y.type == CKEDITOR.NODE_TEXT) G = y.getText(), d(y, 0) || (y = null), A = /^[\s\ufeff]/.test(G);
                  else if (y.type == CKEDITOR.NODE_ELEMENT) {
                    if ((0 < y.$.offsetWidth ||
                        b && y.is("br")) && !y.data("cke-bookmark"))
                      if (z && CKEDITOR.dtd.$removeEmpty[y.getName()]) { G = y.getText(); if (e.test(G)) y = null;
                        else
                          for (D = y.$.getElementsByTagName("*"), F = 0; I = D[F++];)
                            if (!CKEDITOR.dtd.$removeEmpty[I.nodeName.toLowerCase()]) { y = null; break }
                        y && (A = !!G.length) } else y = null
                  } else A = 1;
                  A && z && (C ? l = x : this.setEndAfter(x));
                  if (y) { A = y.getNext(); if (!x && !A) { x = y;
                      y = null; break } y = A } else x = null
                }
                x && (x = c(x.getParent()))
              }
              k && l && (h = k.contains(l) ? l : k, this.setStartBefore(h), this.setEndAfter(h));
              break;
            case CKEDITOR.ENLARGE_BLOCK_CONTENTS:
            case CKEDITOR.ENLARGE_LIST_ITEM_CONTENTS:
              x =
                new CKEDITOR.dom.range(this.root);
              m = this.root;
              x.setStartAt(m, CKEDITOR.POSITION_AFTER_START);
              x.setEnd(this.startContainer, this.startOffset);
              x = new CKEDITOR.dom.walker(x);
              var H, K, J = CKEDITOR.dom.walker.blockBoundary(a == CKEDITOR.ENLARGE_LIST_ITEM_CONTENTS ? { br: 1 } : null),
                E = null,
                R = function(a) { if (a.type == CKEDITOR.NODE_ELEMENT && "false" == a.getAttribute("contenteditable"))
                    if (E) { if (E.equals(a)) { E = null; return } } else E = a;
                  else if (E) return; var b = J(a);
                  b || (H = a); return b },
                g = function(a) {
                  var b = R(a);
                  !b && a.is && a.is("br") &&
                    (K = a);
                  return b
                };
              x.guard = R;
              x = x.lastBackward();
              H = H || m;
              this.setStartAt(H, !H.is("br") && (!x && this.checkStartOfBlock() || x && H.contains(x)) ? CKEDITOR.POSITION_AFTER_START : CKEDITOR.POSITION_AFTER_END);
              if (a == CKEDITOR.ENLARGE_LIST_ITEM_CONTENTS) { x = this.clone();
                x = new CKEDITOR.dom.walker(x); var O = CKEDITOR.dom.walker.whitespaces(),
                  S = CKEDITOR.dom.walker.bookmark();
                x.evaluator = function(a) { return !O(a) && !S(a) }; if ((x = x.previous()) && x.type == CKEDITOR.NODE_ELEMENT && x.is("br")) break } x = this.clone();
              x.collapse();
              x.setEndAt(m,
                CKEDITOR.POSITION_BEFORE_END);
              x = new CKEDITOR.dom.walker(x);
              x.guard = a == CKEDITOR.ENLARGE_LIST_ITEM_CONTENTS ? g : R;
              H = E = K = null;
              x = x.lastForward();
              H = H || m;
              this.setEndAt(H, !x && this.checkEndOfBlock() || x && H.contains(x) ? CKEDITOR.POSITION_BEFORE_END : CKEDITOR.POSITION_BEFORE_START);
              K && this.setEndAfter(K)
          }
        },
        shrink: function(a, b, c) {
          var e = "boolean" === typeof c ? c : c && "boolean" === typeof c.shrinkOnBlockBoundary ? c.shrinkOnBlockBoundary : !0,
            g = c && c.skipBogus;
          if (!this.collapsed) {
            a = a || CKEDITOR.SHRINK_TEXT;
            var d = this.clone(),
              h =
              this.startContainer,
              m = this.endContainer,
              k = this.startOffset,
              l = this.endOffset,
              x = c = 1;
            h && h.type == CKEDITOR.NODE_TEXT && (k ? k >= h.getLength() ? d.setStartAfter(h) : (d.setStartBefore(h), c = 0) : d.setStartBefore(h));
            m && m.type == CKEDITOR.NODE_TEXT && (l ? l >= m.getLength() ? d.setEndAfter(m) : (d.setEndAfter(m), x = 0) : d.setEndBefore(m));
            var d = new CKEDITOR.dom.walker(d),
              y = CKEDITOR.dom.walker.bookmark(),
              C = CKEDITOR.dom.walker.bogus();
            d.evaluator = function(b) { return b.type == (a == CKEDITOR.SHRINK_ELEMENT ? CKEDITOR.NODE_ELEMENT : CKEDITOR.NODE_TEXT) };
            var z;
            d.guard = function(b, c) { if (g && C(b) || y(b)) return !0; if (a == CKEDITOR.SHRINK_ELEMENT && b.type == CKEDITOR.NODE_TEXT || c && b.equals(z) || !1 === e && b.type == CKEDITOR.NODE_ELEMENT && b.isBlockBoundary() || b.type == CKEDITOR.NODE_ELEMENT && b.hasAttribute("contenteditable")) return !1;
              c || b.type != CKEDITOR.NODE_ELEMENT || (z = b); return !0 };
            c && (h = d[a == CKEDITOR.SHRINK_ELEMENT ? "lastForward" : "next"]()) && this.setStartAt(h, b ? CKEDITOR.POSITION_AFTER_START : CKEDITOR.POSITION_BEFORE_START);
            x && (d.reset(), (d = d[a == CKEDITOR.SHRINK_ELEMENT ?
              "lastBackward" : "previous"]()) && this.setEndAt(d, b ? CKEDITOR.POSITION_BEFORE_END : CKEDITOR.POSITION_AFTER_END));
            return !(!c && !x)
          }
        },
        insertNode: function(a) { this.optimizeBookmark();
          this.trim(!1, !0); var b = this.startContainer,
            c = b.getChild(this.startOffset);
          c ? a.insertBefore(c) : b.append(a);
          a.getParent() && a.getParent().equals(this.endContainer) && this.endOffset++;
          this.setStartBefore(a) },
        moveToPosition: function(a, b) { this.setStartAt(a, b);
          this.collapse(!0) },
        moveToRange: function(a) {
          this.setStart(a.startContainer, a.startOffset);
          this.setEnd(a.endContainer, a.endOffset)
        },
        selectNodeContents: function(a) { this.setStart(a, 0);
          this.setEnd(a, a.type == CKEDITOR.NODE_TEXT ? a.getLength() : a.getChildCount()) },
        setStart: function(b, c) { b.type == CKEDITOR.NODE_ELEMENT && CKEDITOR.dtd.$empty[b.getName()] && (c = b.getIndex(), b = b.getParent());
          this._setStartContainer(b);
          this.startOffset = c;
          this.endContainer || (this._setEndContainer(b), this.endOffset = c);
          a(this) },
        setEnd: function(b, c) {
          b.type == CKEDITOR.NODE_ELEMENT && CKEDITOR.dtd.$empty[b.getName()] && (c = b.getIndex() +
            1, b = b.getParent());
          this._setEndContainer(b);
          this.endOffset = c;
          this.startContainer || (this._setStartContainer(b), this.startOffset = c);
          a(this)
        },
        setStartAfter: function(a) { this.setStart(a.getParent(), a.getIndex() + 1) },
        setStartBefore: function(a) { this.setStart(a.getParent(), a.getIndex()) },
        setEndAfter: function(a) { this.setEnd(a.getParent(), a.getIndex() + 1) },
        setEndBefore: function(a) { this.setEnd(a.getParent(), a.getIndex()) },
        setStartAt: function(b, c) {
          switch (c) {
            case CKEDITOR.POSITION_AFTER_START:
              this.setStart(b, 0);
              break;
            case CKEDITOR.POSITION_BEFORE_END:
              b.type == CKEDITOR.NODE_TEXT ? this.setStart(b, b.getLength()) : this.setStart(b, b.getChildCount());
              break;
            case CKEDITOR.POSITION_BEFORE_START:
              this.setStartBefore(b);
              break;
            case CKEDITOR.POSITION_AFTER_END:
              this.setStartAfter(b)
          }
          a(this)
        },
        setEndAt: function(b, c) {
          switch (c) {
            case CKEDITOR.POSITION_AFTER_START:
              this.setEnd(b, 0);
              break;
            case CKEDITOR.POSITION_BEFORE_END:
              b.type == CKEDITOR.NODE_TEXT ? this.setEnd(b, b.getLength()) : this.setEnd(b, b.getChildCount());
              break;
            case CKEDITOR.POSITION_BEFORE_START:
              this.setEndBefore(b);
              break;
            case CKEDITOR.POSITION_AFTER_END:
              this.setEndAfter(b)
          }
          a(this)
        },
        fixBlock: function(a, b) { var c = this.createBookmark(),
            e = this.document.createElement(b);
          this.collapse(a);
          this.enlarge(CKEDITOR.ENLARGE_BLOCK_CONTENTS);
          this.extractContents().appendTo(e);
          e.trim();
          this.insertNode(e); var g = e.getBogus();
          g && g.remove();
          e.appendBogus();
          this.moveToBookmark(c); return e },
        splitBlock: function(a, b) {
          var c = new CKEDITOR.dom.elementPath(this.startContainer, this.root),
            e = new CKEDITOR.dom.elementPath(this.endContainer, this.root),
            g = c.block,
            d = e.block,
            h = null;
          if (!c.blockLimit.equals(e.blockLimit)) return null;
          "br" != a && (g || (g = this.fixBlock(!0, a), d = (new CKEDITOR.dom.elementPath(this.endContainer, this.root)).block), d || (d = this.fixBlock(!1, a)));
          c = g && this.checkStartOfBlock();
          e = d && this.checkEndOfBlock();
          this.deleteContents();
          g && g.equals(d) && (e ? (h = new CKEDITOR.dom.elementPath(this.startContainer, this.root), this.moveToPosition(d, CKEDITOR.POSITION_AFTER_END), d = null) : c ? (h = new CKEDITOR.dom.elementPath(this.startContainer, this.root), this.moveToPosition(g,
            CKEDITOR.POSITION_BEFORE_START), g = null) : (d = this.splitElement(g, b || !1), g.is("ul", "ol") || g.appendBogus()));
          return { previousBlock: g, nextBlock: d, wasStartOfBlock: c, wasEndOfBlock: e, elementPath: h }
        },
        splitElement: function(a, b) { if (!this.collapsed) return null;
          this.setEndAt(a, CKEDITOR.POSITION_BEFORE_END); var c = this.extractContents(!1, b || !1),
            e = a.clone(!1, b || !1);
          c.appendTo(e);
          e.insertAfter(a);
          this.moveToPosition(a, CKEDITOR.POSITION_AFTER_END); return e },
        removeEmptyBlocksAtEnd: function() {
          function a(f) {
            return function(a) {
              return b(a) ||
                c(a) || a.type == CKEDITOR.NODE_ELEMENT && a.isEmptyInlineRemoveable() || f.is("table") && a.is("caption") ? !1 : !0
            }
          }
          var b = CKEDITOR.dom.walker.whitespaces(),
            c = CKEDITOR.dom.walker.bookmark(!1);
          return function(b) { for (var c = this.createBookmark(), e = this[b ? "endPath" : "startPath"](), g = e.block || e.blockLimit, d; g && !g.equals(e.root) && !g.getFirst(a(g));) d = g.getParent(), this[b ? "setEndAt" : "setStartAt"](g, CKEDITOR.POSITION_AFTER_END), g.remove(1), g = d;
            this.moveToBookmark(c) }
        }(),
        startPath: function() {
          return new CKEDITOR.dom.elementPath(this.startContainer,
            this.root)
        },
        endPath: function() { return new CKEDITOR.dom.elementPath(this.endContainer, this.root) },
        checkBoundaryOfElement: function(a, b) { var e = b == CKEDITOR.START,
            g = this.clone();
          g.collapse(e);
          g[e ? "setStartAt" : "setEndAt"](a, e ? CKEDITOR.POSITION_AFTER_START : CKEDITOR.POSITION_BEFORE_END);
          g = new CKEDITOR.dom.walker(g);
          g.evaluator = c(e); return g[e ? "checkBackward" : "checkForward"]() },
        checkStartOfBlock: function() {
          var a = this.startContainer,
            c = this.startOffset;
          CKEDITOR.env.ie && c && a.type == CKEDITOR.NODE_TEXT && (a = CKEDITOR.tools.ltrim(a.substring(0,
            c)), e.test(a) && this.trim(0, 1));
          this.trim();
          a = new CKEDITOR.dom.elementPath(this.startContainer, this.root);
          c = this.clone();
          c.collapse(!0);
          c.setStartAt(a.block || a.blockLimit, CKEDITOR.POSITION_AFTER_START);
          a = new CKEDITOR.dom.walker(c);
          a.evaluator = b();
          return a.checkBackward()
        },
        checkEndOfBlock: function() {
          var a = this.endContainer,
            c = this.endOffset;
          CKEDITOR.env.ie && a.type == CKEDITOR.NODE_TEXT && (a = CKEDITOR.tools.rtrim(a.substring(c)), e.test(a) && this.trim(1, 0));
          this.trim();
          a = new CKEDITOR.dom.elementPath(this.endContainer,
            this.root);
          c = this.clone();
          c.collapse(!1);
          c.setEndAt(a.block || a.blockLimit, CKEDITOR.POSITION_BEFORE_END);
          a = new CKEDITOR.dom.walker(c);
          a.evaluator = b();
          return a.checkForward()
        },
        getPreviousNode: function(a, b, c) { var e = this.clone();
          e.collapse(1);
          e.setStartAt(c || this.root, CKEDITOR.POSITION_AFTER_START);
          c = new CKEDITOR.dom.walker(e);
          c.evaluator = a;
          c.guard = b; return c.previous() },
        getNextNode: function(a, b, c) {
          var e = this.clone();
          e.collapse();
          e.setEndAt(c || this.root, CKEDITOR.POSITION_BEFORE_END);
          c = new CKEDITOR.dom.walker(e);
          c.evaluator = a;
          c.guard = b;
          return c.next()
        },
        checkReadOnly: function() {
          function a(b, c) { for (; b;) { if (b.type == CKEDITOR.NODE_ELEMENT) { if ("false" == b.getAttribute("contentEditable") && !b.data("cke-editable")) return 0; if (b.is("html") || "true" == b.getAttribute("contentEditable") && (b.contains(c) || b.equals(c))) break } b = b.getParent() } return 1 } return function() { var b = this.startContainer,
              c = this.endContainer; return !(a(b, c) && a(c, b)) } }(),
        moveToElementEditablePosition: function(a, b) {
          if (a.type == CKEDITOR.NODE_ELEMENT && !a.isEditable(!1)) return this.moveToPosition(a,
            b ? CKEDITOR.POSITION_AFTER_END : CKEDITOR.POSITION_BEFORE_START), !0;
          for (var c = 0; a;) {
            if (a.type == CKEDITOR.NODE_TEXT) { b && this.endContainer && this.checkEndOfBlock() && e.test(a.getText()) ? this.moveToPosition(a, CKEDITOR.POSITION_BEFORE_START) : this.moveToPosition(a, b ? CKEDITOR.POSITION_AFTER_END : CKEDITOR.POSITION_BEFORE_START);
              c = 1; break }
            if (a.type == CKEDITOR.NODE_ELEMENT)
              if (a.isEditable()) this.moveToPosition(a, b ? CKEDITOR.POSITION_BEFORE_END : CKEDITOR.POSITION_AFTER_START), c = 1;
              else if (b && a.is("br") && this.endContainer &&
              this.checkEndOfBlock()) this.moveToPosition(a, CKEDITOR.POSITION_BEFORE_START);
            else if ("false" == a.getAttribute("contenteditable") && a.is(CKEDITOR.dtd.$block)) return this.setStartBefore(a), this.setEndAfter(a), !0;
            var g = a,
              d = c,
              h = void 0;
            g.type == CKEDITOR.NODE_ELEMENT && g.isEditable(!1) && (h = g[b ? "getLast" : "getFirst"](m));
            d || h || (h = g[b ? "getPrevious" : "getNext"](m));
            a = h
          }
          return !!c
        },
        moveToClosestEditablePosition: function(a, b) {
          var c, e = 0,
            g, d, h = [CKEDITOR.POSITION_AFTER_END, CKEDITOR.POSITION_BEFORE_START];
          a ? (c = new CKEDITOR.dom.range(this.root),
            c.moveToPosition(a, h[b ? 0 : 1])) : c = this.clone();
          if (a && !a.is(CKEDITOR.dtd.$block)) e = 1;
          else if (g = c[b ? "getNextEditableNode" : "getPreviousEditableNode"]()) e = 1, (d = g.type == CKEDITOR.NODE_ELEMENT) && g.is(CKEDITOR.dtd.$block) && "false" == g.getAttribute("contenteditable") ? (c.setStartAt(g, CKEDITOR.POSITION_BEFORE_START), c.setEndAt(g, CKEDITOR.POSITION_AFTER_END)) : !CKEDITOR.env.needsBrFiller && d && g.is(CKEDITOR.dom.walker.validEmptyBlockContainers) ? (c.setEnd(g, 0), c.collapse()) : c.moveToPosition(g, h[b ? 1 : 0]);
          e && this.moveToRange(c);
          return !!e
        },
        moveToElementEditStart: function(a) { return this.moveToElementEditablePosition(a) },
        moveToElementEditEnd: function(a) { return this.moveToElementEditablePosition(a, !0) },
        getEnclosedNode: function() {
          var a = this.clone();
          a.optimize();
          if (a.startContainer.type != CKEDITOR.NODE_ELEMENT || a.endContainer.type != CKEDITOR.NODE_ELEMENT) return null;
          var a = new CKEDITOR.dom.walker(a),
            b = CKEDITOR.dom.walker.bookmark(!1, !0),
            c = CKEDITOR.dom.walker.whitespaces(!0);
          a.evaluator = function(a) { return c(a) && b(a) };
          var e = a.next();
          a.reset();
          return e && e.equals(a.previous()) ? e : null
        },
        getTouchedStartNode: function() { var a = this.startContainer; return this.collapsed || a.type != CKEDITOR.NODE_ELEMENT ? a : a.getChild(this.startOffset) || a },
        getTouchedEndNode: function() { var a = this.endContainer; return this.collapsed || a.type != CKEDITOR.NODE_ELEMENT ? a : a.getChild(this.endOffset - 1) || a },
        getNextEditableNode: g(),
        getPreviousEditableNode: g(1),
        _getTableElement: function(a) {
          a = a || { td: 1, th: 1, tr: 1, tbody: 1, thead: 1, tfoot: 1, table: 1 };
          var b = this.startContainer,
            c =
            this.endContainer,
            e = b.getAscendant("table", !0),
            g = c.getAscendant("table", !0);
          return CKEDITOR.env.safari && e && c.equals(this.root) ? b.getAscendant(a, !0) : this.getEnclosedNode() ? this.getEnclosedNode().getAscendant(a, !0) : e && g && (e.equals(g) || e.contains(g) || g.contains(e)) ? b.getAscendant(a, !0) : null
        },
        scrollIntoView: function() {
          var a = new CKEDITOR.dom.element.createFromHtml("\x3cspan\x3e\x26nbsp;\x3c/span\x3e", this.document),
            b, c, e, g = this.clone();
          g.optimize();
          (e = g.startContainer.type == CKEDITOR.NODE_TEXT) ? (c = g.startContainer.getText(),
            b = g.startContainer.split(g.startOffset), a.insertAfter(g.startContainer)) : g.insertNode(a);
          a.scrollIntoView();
          e && (g.startContainer.setText(c), b.remove());
          a.remove()
        },
        _setStartContainer: function(a) { this.startContainer = a },
        _setEndContainer: function(a) { this.endContainer = a },
        _find: function(a, b) {
          var c = this.getCommonAncestor(),
            e = this.getBoundaryNodes(),
            g = [],
            d, h, m, k;
          if (c && c.find)
            for (h = c.find(a), d = 0; d < h.count(); d++)
              if (c = h.getItem(d), b || !c.isReadOnly()) m = c.getPosition(e.startNode) & CKEDITOR.POSITION_FOLLOWING ||
                e.startNode.equals(c), k = c.getPosition(e.endNode) & CKEDITOR.POSITION_PRECEDING + CKEDITOR.POSITION_IS_CONTAINED || e.endNode.equals(c), m && k && g.push(c);
          return g
        }
      };
      CKEDITOR.dom.range.mergeRanges = function(a) {
        return CKEDITOR.tools.array.reduce(a, function(a, b) {
          var c = a[a.length - 1],
            f = !1;
          b = b.clone();
          b.enlarge(CKEDITOR.ENLARGE_ELEMENT);
          if (c) {
            var e = new CKEDITOR.dom.range(b.root),
              f = new CKEDITOR.dom.walker(e),
              g = CKEDITOR.dom.walker.whitespaces();
            e.setStart(c.endContainer, c.endOffset);
            e.setEnd(b.startContainer, b.startOffset);
            for (e = f.next(); g(e) || b.endContainer.equals(e);) e = f.next();
            f = !e
          }
          f ? c.setEnd(b.endContainer, b.endOffset) : a.push(b);
          return a
        }, [])
      }
    }(), CKEDITOR.POSITION_AFTER_START = 1, CKEDITOR.POSITION_BEFORE_END = 2, CKEDITOR.POSITION_BEFORE_START = 3, CKEDITOR.POSITION_AFTER_END = 4, CKEDITOR.ENLARGE_ELEMENT = 1, CKEDITOR.ENLARGE_BLOCK_CONTENTS = 2, CKEDITOR.ENLARGE_LIST_ITEM_CONTENTS = 3, CKEDITOR.ENLARGE_INLINE = 4, CKEDITOR.START = 1, CKEDITOR.END = 2, CKEDITOR.SHRINK_ELEMENT = 1, CKEDITOR.SHRINK_TEXT = 2, "use strict",
    function() {
      function a(a) {
        1 >
          arguments.length || (this.range = a, this.forceBrBreak = 0, this.enlargeBr = 1, this.enforceRealBlocks = 0, this._ || (this._ = {}))
      }

      function d(a) { var b = [];
        a.forEach(function(a) { if ("true" == a.getAttribute("contenteditable")) return b.push(a), !1 }, CKEDITOR.NODE_ELEMENT, !0); return b }

      function b(a, c, e, g) {
        a: { null == g && (g = d(e)); for (var h; h = g.shift();)
            if (h.getDtd().p) { g = { element: h, remaining: g }; break a }
          g = null }
        if (!g) return 0;
        if ((h = CKEDITOR.filter.instances[g.element.data("cke-filter")]) && !h.check(c)) return b(a, c, e, g.remaining);
        c = new CKEDITOR.dom.range(g.element);c.selectNodeContents(g.element);c = c.createIterator();c.enlargeBr = a.enlargeBr;c.enforceRealBlocks = a.enforceRealBlocks;c.activeFilter = c.filter = h;a._.nestedEditable = { element: g.element, container: e, remaining: g.remaining, iterator: c };
        return 1
      }

      function c(a, b, c) { if (!b) return !1;
        a = a.clone();
        a.collapse(!c); return a.checkBoundaryOfElement(b, c ? CKEDITOR.START : CKEDITOR.END) }
      var g = /^[\r\n\t ]+$/,
        l = CKEDITOR.dom.walker.bookmark(!1, !0),
        k = CKEDITOR.dom.walker.whitespaces(!0),
        e = function(a) {
          return l(a) &&
            k(a)
        },
        h = { dd: 1, dt: 1, li: 1 };
      a.prototype = {
        getNextParagraph: function(a) {
          var f, d, k, q, w;
          a = a || "p";
          if (this._.nestedEditable) { if (f = this._.nestedEditable.iterator.getNextParagraph(a)) return this.activeFilter = this._.nestedEditable.iterator.activeFilter, f;
            this.activeFilter = this.filter; if (b(this, a, this._.nestedEditable.container, this._.nestedEditable.remaining)) return this.activeFilter = this._.nestedEditable.iterator.activeFilter, this._.nestedEditable.iterator.getNextParagraph(a);
            this._.nestedEditable = null }
          if (!this.range.root.getDtd()[a]) return null;
          if (!this._.started) {
            var v = this.range.clone();
            d = v.startPath();
            var t = v.endPath(),
              u = !v.collapsed && c(v, d.block),
              r = !v.collapsed && c(v, t.block, 1);
            v.shrink(CKEDITOR.SHRINK_ELEMENT, !0);
            u && v.setStartAt(d.block, CKEDITOR.POSITION_BEFORE_END);
            r && v.setEndAt(t.block, CKEDITOR.POSITION_AFTER_START);
            d = v.endContainer.hasAscendant("pre", !0) || v.startContainer.hasAscendant("pre", !0);
            v.enlarge(this.forceBrBreak && !d || !this.enlargeBr ? CKEDITOR.ENLARGE_LIST_ITEM_CONTENTS : CKEDITOR.ENLARGE_BLOCK_CONTENTS);
            v.collapsed || (d = new CKEDITOR.dom.walker(v.clone()),
              t = CKEDITOR.dom.walker.bookmark(!0, !0), d.evaluator = t, this._.nextNode = d.next(), d = new CKEDITOR.dom.walker(v.clone()), d.evaluator = t, d = d.previous(), this._.lastNode = d.getNextSourceNode(!0, null, v.root), this._.lastNode && this._.lastNode.type == CKEDITOR.NODE_TEXT && !CKEDITOR.tools.trim(this._.lastNode.getText()) && this._.lastNode.getParent().isBlockBoundary() && (t = this.range.clone(), t.moveToPosition(this._.lastNode, CKEDITOR.POSITION_AFTER_END), t.checkEndOfBlock() && (t = new CKEDITOR.dom.elementPath(t.endContainer,
                t.root), this._.lastNode = (t.block || t.blockLimit).getNextSourceNode(!0))), this._.lastNode && v.root.contains(this._.lastNode) || (this._.lastNode = this._.docEndMarker = v.document.createText(""), this._.lastNode.insertAfter(d)), v = null);
            this._.started = 1;
            d = v
          }
          t = this._.nextNode;
          v = this._.lastNode;
          for (this._.nextNode = null; t;) {
            var u = 0,
              r = t.hasAscendant("pre"),
              B = t.type != CKEDITOR.NODE_ELEMENT,
              x = 0;
            if (B) t.type == CKEDITOR.NODE_TEXT && g.test(t.getText()) && (B = 0);
            else {
              var y = t.getName();
              if (CKEDITOR.dtd.$block[y] && "false" == t.getAttribute("contenteditable")) {
                f =
                  t;
                b(this, a, f);
                break
              } else if (t.isBlockBoundary(this.forceBrBreak && !r && { br: 1 })) { if ("br" == y) B = 1;
                else if (!d && !t.getChildCount() && "hr" != y) { f = t;
                  k = t.equals(v); break } d && (d.setEndAt(t, CKEDITOR.POSITION_BEFORE_START), "br" != y && (this._.nextNode = t));
                u = 1 } else { if (t.getFirst()) { d || (d = this.range.clone(), d.setStartAt(t, CKEDITOR.POSITION_BEFORE_START));
                  t = t.getFirst(); continue } B = 1 }
            }
            B && !d && (d = this.range.clone(), d.setStartAt(t, CKEDITOR.POSITION_BEFORE_START));
            k = (!u || B) && t.equals(v);
            if (d && !u)
              for (; !t.getNext(e) && !k;) {
                y =
                  t.getParent();
                if (y.isBlockBoundary(this.forceBrBreak && !r && { br: 1 })) { u = 1;
                  B = 0;
                  k || y.equals(v);
                  d.setEndAt(y, CKEDITOR.POSITION_BEFORE_END); break } t = y;
                B = 1;
                k = t.equals(v);
                x = 1
              }
            B && d.setEndAt(t, CKEDITOR.POSITION_AFTER_END);
            t = this._getNextSourceNode(t, x, v);
            if ((k = !t) || u && d) break
          }
          if (!f) {
            if (!d) return this._.docEndMarker && this._.docEndMarker.remove(), this._.nextNode = null;
            f = new CKEDITOR.dom.elementPath(d.startContainer, d.root);
            t = f.blockLimit;
            u = { div: 1, th: 1, td: 1 };
            f = f.block;
            !f && t && !this.enforceRealBlocks && u[t.getName()] &&
              d.checkStartOfBlock() && d.checkEndOfBlock() && !t.equals(d.root) ? f = t : !f || this.enforceRealBlocks && f.is(h) ? (f = this.range.document.createElement(a), d.extractContents().appendTo(f), f.trim(), d.insertNode(f), q = w = !0) : "li" != f.getName() ? d.checkStartOfBlock() && d.checkEndOfBlock() || (f = f.clone(!1), d.extractContents().appendTo(f), f.trim(), w = d.splitBlock(), q = !w.wasStartOfBlock, w = !w.wasEndOfBlock, d.insertNode(f)) : k || (this._.nextNode = f.equals(v) ? null : this._getNextSourceNode(d.getBoundaryNodes().endNode, 1, v))
          }
          q && (q =
            f.getPrevious()) && q.type == CKEDITOR.NODE_ELEMENT && ("br" == q.getName() ? q.remove() : q.getLast() && "br" == q.getLast().$.nodeName.toLowerCase() && q.getLast().remove());
          w && (q = f.getLast()) && q.type == CKEDITOR.NODE_ELEMENT && "br" == q.getName() && (!CKEDITOR.env.needsBrFiller || q.getPrevious(l) || q.getNext(l)) && q.remove();
          this._.nextNode || (this._.nextNode = k || f.equals(v) || !v ? null : this._getNextSourceNode(f, 1, v));
          return f
        },
        _getNextSourceNode: function(a, b, c) {
          function e(a) { return !(a.equals(c) || a.equals(g)) }
          var g = this.range.root;
          for (a = a.getNextSourceNode(b, null, e); !l(a);) a = a.getNextSourceNode(b, null, e);
          return a
        }
      };
      CKEDITOR.dom.range.prototype.createIterator = function() { return new a(this) }
    }(), CKEDITOR.command = function(a, d) {
      this.uiItems = [];
      this.exec = function(b) { if (this.state == CKEDITOR.TRISTATE_DISABLED || !this.checkAllowed()) return !1;
        this.editorFocus && a.focus(); return !1 === this.fire("exec") ? !0 : !1 !== d.exec.call(this, a, b) };
      this.refresh = function(a, b) {
        if (!this.readOnly && a.readOnly) return !0;
        if (this.context && !b.isContextFor(this.context) ||
          !this.checkAllowed(!0)) return this.disable(), !0;
        this.startDisabled || this.enable();
        this.modes && !this.modes[a.mode] && this.disable();
        return !1 === this.fire("refresh", { editor: a, path: b }) ? !0 : d.refresh && !1 !== d.refresh.apply(this, arguments)
      };
      var b;
      this.checkAllowed = function(c) { return c || "boolean" != typeof b ? b = a.activeFilter.checkFeature(this) : b };
      CKEDITOR.tools.extend(this, d, { modes: { wysiwyg: 1 }, editorFocus: 1, contextSensitive: !!d.context, state: CKEDITOR.TRISTATE_DISABLED });
      CKEDITOR.event.call(this)
    }, CKEDITOR.command.prototype = {
      enable: function() { this.state == CKEDITOR.TRISTATE_DISABLED && this.checkAllowed() && this.setState(this.preserveState && "undefined" != typeof this.previousState ? this.previousState : CKEDITOR.TRISTATE_OFF) },
      disable: function() { this.setState(CKEDITOR.TRISTATE_DISABLED) },
      setState: function(a) { if (this.state == a || a != CKEDITOR.TRISTATE_DISABLED && !this.checkAllowed()) return !1;
        this.previousState = this.state;
        this.state = a;
        this.fire("state"); return !0 },
      toggleState: function() {
        this.state == CKEDITOR.TRISTATE_OFF ? this.setState(CKEDITOR.TRISTATE_ON) :
          this.state == CKEDITOR.TRISTATE_ON && this.setState(CKEDITOR.TRISTATE_OFF)
      }
    }, CKEDITOR.event.implementOn(CKEDITOR.command.prototype), CKEDITOR.ENTER_P = 1, CKEDITOR.ENTER_BR = 2, CKEDITOR.ENTER_DIV = 3, CKEDITOR.config = {
      customConfig: "config.js",
      autoUpdateElement: !0,
      language: "",
      defaultLanguage: "en",
      contentsLangDirection: "",
      enterMode: CKEDITOR.ENTER_P,
      forceEnterMode: !1,
      shiftEnterMode: CKEDITOR.ENTER_BR,
      docType: "\x3c!DOCTYPE html\x3e",
      bodyId: "",
      bodyClass: "",
      fullPage: !1,
      height: 200,
      contentsCss: CKEDITOR.getUrl("contents.css"),
      extraPlugins: "",
      removePlugins: "",
      protectedSource: [],
      tabIndex: 0,
      width: "",
      baseFloatZIndex: 1E4,
      blockedKeystrokes: [CKEDITOR.CTRL + 66, CKEDITOR.CTRL + 73, CKEDITOR.CTRL + 85]
    },
    function() {
      function a(a, b, c, f, e) {
        var g, d;
        a = [];
        for (g in b) {
          d = b[g];
          d = "boolean" == typeof d ? {} : "function" == typeof d ? { match: d } : F(d);
          "$" != g.charAt(0) && (d.elements = g);
          c && (d.featureName = c.toLowerCase());
          var h = d;
          h.elements = k(h.elements, /\s+/) || null;
          h.propertiesOnly = h.propertiesOnly || !0 === h.elements;
          var m = /\s*,\s*/,
            l = void 0;
          for (l in K) {
            h[l] = k(h[l],
              m) || null;
            var n = h,
              t = J[l],
              y = k(h[J[l]], m),
              x = h[l],
              E = [],
              p = !0,
              r = void 0;
            y ? p = !1 : y = {};
            for (r in x) "!" == r.charAt(0) && (r = r.slice(1), E.push(r), y[r] = !0, p = !1);
            for (; r = E.pop();) x[r] = x["!" + r], delete x["!" + r];
            n[t] = (p ? !1 : y) || null
          }
          h.match = h.match || null;
          f.push(d);
          a.push(d)
        }
        b = e.elements;
        e = e.generic;
        var z;
        c = 0;
        for (f = a.length; c < f; ++c) {
          g = F(a[c]);
          d = !0 === g.classes || !0 === g.styles || !0 === g.attributes;
          h = g;
          l = t = m = void 0;
          for (m in K) h[m] = u(h[m]);
          n = !0;
          for (l in J) {
            m = J[l];
            t = h[m];
            y = [];
            x = void 0;
            for (x in t) - 1 < x.indexOf("*") ? y.push(new RegExp("^" +
              x.replace(/\*/g, ".*") + "$")) : y.push(x);
            t = y;
            t.length && (h[m] = t, n = !1)
          }
          h.nothingRequired = n;
          h.noProperties = !(h.attributes || h.classes || h.styles);
          if (!0 === g.elements || null === g.elements) e[d ? "unshift" : "push"](g);
          else
            for (z in h = g.elements, delete g.elements, h)
              if (b[z]) b[z][d ? "unshift" : "push"](g);
              else b[z] = [g]
        }
      }

      function d(a, c, f, g) {
        if (!a.match || a.match(c))
          if (g || e(a, c))
            if (a.propertiesOnly || (f.valid = !0), f.allAttributes || (f.allAttributes = b(a.attributes, c.attributes, f.validAttributes)), f.allStyles || (f.allStyles = b(a.styles,
                c.styles, f.validStyles)), !f.allClasses) { a = a.classes;
              c = c.classes;
              g = f.validClasses; if (a)
                if (!0 === a) a = !0;
                else { for (var d = 0, h = c.length, m; d < h; ++d) m = c[d], g[m] || (g[m] = a(m));
                  a = !1 } else a = !1;
              f.allClasses = a }
      }

      function b(a, b, c) { if (!a) return !1; if (!0 === a) return !0; for (var f in b) c[f] || (c[f] = a(f)); return !1 }

      function c(a, b, c) {
        if (!a.match || a.match(b)) {
          if (a.noProperties) return !1;
          c.hadInvalidAttribute = g(a.attributes, b.attributes) || c.hadInvalidAttribute;
          c.hadInvalidStyle = g(a.styles, b.styles) || c.hadInvalidStyle;
          a = a.classes;
          b = b.classes;
          if (a) { for (var f = !1, e = !0 === a, d = b.length; d--;)
              if (e || a(b[d])) b.splice(d, 1), f = !0;
            a = f } else a = !1;
          c.hadInvalidClass = a || c.hadInvalidClass
        }
      }

      function g(a, b) { if (!a) return !1; var c = !1,
          f = !0 === a,
          e; for (e in b)
          if (f || a(e)) delete b[e], c = !0; return c }

      function l(a, b, c) { if (a.disabled || a.customConfig && !c || !b) return !1;
        a._.cachedChecks = {}; return !0 }

      function k(a, b) {
        if (!a) return !1;
        if (!0 === a) return a;
        if ("string" == typeof a) return a = I(a), "*" == a ? !0 : CKEDITOR.tools.convertArrayToObject(a.split(b));
        if (CKEDITOR.tools.isArray(a)) return a.length ?
          CKEDITOR.tools.convertArrayToObject(a) : !1;
        var c = {},
          f = 0,
          e;
        for (e in a) c[e] = a[e], f++;
        return f ? c : !1
      }

      function e(a, b) { if (a.nothingRequired) return !0; var c, f, e, g; if (e = a.requiredClasses)
          for (g = b.classes, c = 0; c < e.length; ++c)
            if (f = e[c], "string" == typeof f) { if (-1 == CKEDITOR.tools.indexOf(g, f)) return !1 } else if (!CKEDITOR.tools.checkIfAnyArrayItemMatches(g, f)) return !1; return h(b.styles, a.requiredStyles) && h(b.attributes, a.requiredAttributes) }

      function h(a, b) {
        if (!b) return !0;
        for (var c = 0, f; c < b.length; ++c)
          if (f = b[c], "string" ==
            typeof f) { if (!(f in a)) return !1 } else if (!CKEDITOR.tools.checkIfAnyObjectPropertyMatches(a, f)) return !1;
        return !0
      }

      function m(a) { if (!a) return {};
        a = a.split(/\s*,\s*/).sort(); for (var b = {}; a.length;) b[a.shift()] = "cke-test"; return b }

      function f(a) { var b, c, f, e, g = {},
          d = 1; for (a = I(a); b = a.match(E);)(c = b[2]) ? (f = n(c, "styles"), e = n(c, "attrs"), c = n(c, "classes")) : f = e = c = null, g["$" + d++] = { elements: b[1], classes: c, styles: f, attributes: e }, a = a.slice(b[0].length); return g }

      function n(a, b) { var c = a.match(R[b]); return c ? I(c[1]) : null }

      function p(a) { var b = a.styleBackup = a.attributes.style,
          c = a.classBackup = a.attributes["class"];
        a.styles || (a.styles = CKEDITOR.tools.parseCssText(b || "", 1));
        a.classes || (a.classes = c ? c.split(/\s+/) : []) }

      function q(a, b, f, e) {
        var g = 0,
          h;
        e.toHtml && (b.name = b.name.replace(O, "$1"));
        if (e.doCallbacks && a.elementCallbacks) { a: { h = a.elementCallbacks; for (var m = 0, k = h.length, l; m < k; ++m)
              if (l = h[m](b)) { h = l; break a }
            h = void 0 } if (h) return h }
        if (e.doTransform && (h = a._.transformations[b.name])) { p(b); for (m = 0; m < h.length; ++m) y(a, b, h[m]);
          v(b) }
        if (e.doFilter) {
          a: {
            m =
            b.name;k = a._;a = k.allowedRules.elements[m];h = k.allowedRules.generic;m = k.disallowedRules.elements[m];k = k.disallowedRules.generic;l = e.skipRequired;
            var n = { valid: !1, validAttributes: {}, validClasses: {}, validStyles: {}, allAttributes: !1, allClasses: !1, allStyles: !1, hadInvalidAttribute: !1, hadInvalidClass: !1, hadInvalidStyle: !1 },
              x, E;
            if (a || h) {
              p(b);
              if (m)
                for (x = 0, E = m.length; x < E; ++x)
                  if (!1 === c(m[x], b, n)) { a = null; break a }
              if (k)
                for (x = 0, E = k.length; x < E; ++x) c(k[x], b, n);
              if (a)
                for (x = 0, E = a.length; x < E; ++x) d(a[x], b, n, l);
              if (h)
                for (x =
                  0, E = h.length; x < E; ++x) d(h[x], b, n, l);
              a = n
            } else a = null
          }
          if (!a || !a.valid) return f.push(b), 1;E = a.validAttributes;
          var r = a.validStyles;h = a.validClasses;
          var m = b.attributes,
            u = b.styles,
            k = b.classes;l = b.classBackup;
          var z = b.styleBackup,
            J, w, C = [],
            n = [],
            D = /^data-cke-/;x = !1;delete m.style;delete m["class"];delete b.classBackup;delete b.styleBackup;
          if (!a.allAttributes)
            for (J in m) E[J] || (D.test(J) ? J == (w = J.replace(/^data-cke-saved-/, "")) || E[w] || (delete m[J], x = !0) : (delete m[J], x = !0));
          if (!a.allStyles || a.hadInvalidStyle) {
            for (J in u) a.allStyles ||
              r[J] ? C.push(J + ":" + u[J]) : x = !0;
            C.length && (m.style = C.sort().join("; "))
          } else z && (m.style = z);
          if (!a.allClasses || a.hadInvalidClass) { for (J = 0; J < k.length; ++J)(a.allClasses || h[k[J]]) && n.push(k[J]);
            n.length && (m["class"] = n.sort().join(" "));
            l && n.length < l.split(/\s+/).length && (x = !0) } else l && (m["class"] = l);x && (g = 1);
          if (!e.skipFinalValidation && !t(b)) return f.push(b), 1
        }
        e.toHtml && (b.name = b.name.replace(S, "cke:$1"));
        return g
      }

      function w(a) {
        var b = [],
          c;
        for (c in a) - 1 < c.indexOf("*") && b.push(c.replace(/\*/g, ".*"));
        return b.length ?
          new RegExp("^(?:" + b.join("|") + ")$") : null
      }

      function v(a) { var b = a.attributes,
          c;
        delete b.style;
        delete b["class"]; if (c = CKEDITOR.tools.writeCssText(a.styles, !0)) b.style = c;
        a.classes.length && (b["class"] = a.classes.sort().join(" ")) }

      function t(a) { switch (a.name) {
          case "a":
            if (!(a.children.length || a.attributes.name || a.attributes.id)) return !1; break;
          case "img":
            if (!a.attributes.src) return !1 } return !0 }

      function u(a) { if (!a) return !1; if (!0 === a) return !0; var b = w(a); return function(c) { return c in a || b && c.match(b) } }

      function r() { return new CKEDITOR.htmlParser.element("br") }

      function B(a) { return a.type == CKEDITOR.NODE_ELEMENT && ("br" == a.name || D.$block[a.name]) }

      function x(a, b, c) {
        var f = a.name;
        if (D.$empty[f] || !a.children.length) "hr" == f && "br" == b ? a.replaceWith(r()) : (a.parent && c.push({ check: "it", el: a.parent }), a.remove());
        else if (D.$block[f] || "tr" == f)
          if ("br" == b) a.previous && !B(a.previous) && (b = r(), b.insertBefore(a)), a.next && !B(a.next) && (b = r(), b.insertAfter(a)), a.replaceWithChildren();
          else {
            var f = a.children,
              e;
            b: {
              e = D[b];
              for (var g = 0, d = f.length, h; g < d; ++g)
                if (h = f[g], h.type == CKEDITOR.NODE_ELEMENT &&
                  !e[h.name]) { e = !1; break b }
              e = !0
            }
            if (e) a.name = b, a.attributes = {}, c.push({ check: "parent-down", el: a });
            else {
              e = a.parent;
              for (var g = e.type == CKEDITOR.NODE_DOCUMENT_FRAGMENT || "body" == e.name, m, k, d = f.length; 0 < d;) h = f[--d], g && (h.type == CKEDITOR.NODE_TEXT || h.type == CKEDITOR.NODE_ELEMENT && D.$inline[h.name]) ? (m || (m = new CKEDITOR.htmlParser.element(b), m.insertAfter(a), c.push({ check: "parent-down", el: m })), m.add(h, 0)) : (m = null, k = D[e.name] || D.span, h.insertAfter(a), e.type == CKEDITOR.NODE_DOCUMENT_FRAGMENT || h.type != CKEDITOR.NODE_ELEMENT ||
                k[h.name] || c.push({ check: "el-up", el: h }));
              a.remove()
            }
          }
        else f in { style: 1, script: 1 } ? a.remove() : (a.parent && c.push({ check: "it", el: a.parent }), a.replaceWithChildren())
      }

      function y(a, b, c) { var f, e; for (f = 0; f < c.length; ++f)
          if (e = c[f], !(e.check && !a.check(e.check, !1) || e.left && !e.left(b))) { e.right(b, L); break } }

      function C(a, b) {
        var c = b.getDefinition(),
          f = c.attributes,
          e = c.styles,
          g, d, h, m;
        if (a.name != c.element) return !1;
        for (g in f)
          if ("class" == g)
            for (c = f[g].split(/\s+/), h = a.classes.join("|"); m = c.pop();) { if (-1 == h.indexOf(m)) return !1 } else if (a.attributes[g] !=
              f[g]) return !1;
        for (d in e)
          if (a.styles[d] != e[d]) return !1;
        return !0
      }

      function z(a, b) { var c, f; "string" == typeof a ? c = a : a instanceof CKEDITOR.style ? f = a : (c = a[0], f = a[1]); return [{ element: c, left: f, right: function(a, c) { c.transform(a, b) } }] }

      function A(a) { return function(b) { return C(b, a) } }

      function G(a) { return function(b, c) { c[a](b) } }
      var D = CKEDITOR.dtd,
        F = CKEDITOR.tools.copy,
        I = CKEDITOR.tools.trim,
        H = ["", "p", "br", "div"];
      CKEDITOR.FILTER_SKIP_TREE = 2;
      CKEDITOR.filter = function(a) {
        this.allowedContent = [];
        this.disallowedContent = [];
        this.elementCallbacks = null;
        this.disabled = !1;
        this.editor = null;
        this.id = CKEDITOR.tools.getNextNumber();
        this._ = { allowedRules: { elements: {}, generic: [] }, disallowedRules: { elements: {}, generic: [] }, transformations: {}, cachedTests: {}, cachedChecks: {} };
        CKEDITOR.filter.instances[this.id] = this;
        if (a instanceof CKEDITOR.editor) {
          a = this.editor = a;
          this.customConfig = !0;
          var b = a.config.allowedContent;
          !0 === b ? this.disabled = !0 : (b || (this.customConfig = !1), this.allow(b, "config", 1), this.allow(a.config.extraAllowedContent, "extra",
            1), this.allow(H[a.enterMode] + " " + H[a.shiftEnterMode], "default", 1), this.disallow(a.config.disallowedContent))
        } else this.customConfig = !1, this.allow(a, "default", 1)
      };
      CKEDITOR.filter.instances = {};
      CKEDITOR.filter.prototype = {
        allow: function(b, c, e) {
          if (!l(this, b, e)) return !1;
          var g, d;
          if ("string" == typeof b) b = f(b);
          else if (b instanceof CKEDITOR.style) {
            if (b.toAllowedContentRules) return this.allow(b.toAllowedContentRules(this.editor), c, e);
            g = b.getDefinition();
            b = {};
            e = g.attributes;
            b[g.element] = g = {
              styles: g.styles,
              requiredStyles: g.styles &&
                CKEDITOR.tools.objectKeys(g.styles)
            };
            e && (e = F(e), g.classes = e["class"] ? e["class"].split(/\s+/) : null, g.requiredClasses = g.classes, delete e["class"], g.attributes = e, g.requiredAttributes = e && CKEDITOR.tools.objectKeys(e))
          } else if (CKEDITOR.tools.isArray(b)) { for (g = 0; g < b.length; ++g) d = this.allow(b[g], c, e); return d } a(this, b, c, this.allowedContent, this._.allowedRules);
          return !0
        },
        applyTo: function(a, b, c, f) {
          if (this.disabled) return !1;
          var e = this,
            g = [],
            d = this.editor && this.editor.config.protectedSource,
            h, m = !1,
            k = {
              doFilter: !c,
              doTransform: !0,
              doCallbacks: !0,
              toHtml: b
            };
          a.forEach(function(a) {
            if (a.type == CKEDITOR.NODE_ELEMENT) { if ("off" == a.attributes["data-cke-filter"]) return !1; if (!b || "span" != a.name || !~CKEDITOR.tools.objectKeys(a.attributes).join("|").indexOf("data-cke-"))
                if (h = q(e, a, g, k), h & 1) m = !0;
                else if (h & 2) return !1 } else if (a.type == CKEDITOR.NODE_COMMENT && a.value.match(/^\{cke_protected\}(?!\{C\})/)) {
              var c;
              a: {
                var f = decodeURIComponent(a.value.replace(/^\{cke_protected\}/, ""));c = [];
                var l, n, t;
                if (d)
                  for (n = 0; n < d.length; ++n)
                    if ((t = f.match(d[n])) &&
                      t[0].length == f.length) { c = !0; break a }
                f = CKEDITOR.htmlParser.fragment.fromHtml(f);1 == f.children.length && (l = f.children[0]).type == CKEDITOR.NODE_ELEMENT && q(e, l, c, k);c = !c.length
              }
              c || g.push(a)
            }
          }, null, !0);
          g.length && (m = !0);
          var l;
          a = [];
          f = H[f || (this.editor ? this.editor.enterMode : CKEDITOR.ENTER_P)];
          for (var n; c = g.pop();) c.type == CKEDITOR.NODE_ELEMENT ? x(c, f, a) : c.remove();
          for (; l = a.pop();)
            if (c = l.el, c.parent) switch (n = D[c.parent.name] || D.span, l.check) {
              case "it":
                D.$removeEmpty[c.name] && !c.children.length ? x(c, f, a) : t(c) ||
                  x(c, f, a);
                break;
              case "el-up":
                c.parent.type == CKEDITOR.NODE_DOCUMENT_FRAGMENT || n[c.name] || x(c, f, a);
                break;
              case "parent-down":
                c.parent.type == CKEDITOR.NODE_DOCUMENT_FRAGMENT || n[c.name] || x(c.parent, f, a)
            }
          return m
        },
        checkFeature: function(a) { if (this.disabled || !a) return !0;
          a.toFeature && (a = a.toFeature(this.editor)); return !a.requiredContent || this.check(a.requiredContent) },
        disable: function() { this.disabled = !0 },
        disallow: function(b) {
          if (!l(this, b, !0)) return !1;
          "string" == typeof b && (b = f(b));
          a(this, b, null, this.disallowedContent,
            this._.disallowedRules);
          return !0
        },
        addContentForms: function(a) { if (!this.disabled && a) { var b, c, f = [],
              e; for (b = 0; b < a.length && !e; ++b) c = a[b], ("string" == typeof c || c instanceof CKEDITOR.style) && this.check(c) && (e = c); if (e) { for (b = 0; b < a.length; ++b) f.push(z(a[b], e));
              this.addTransformations(f) } } },
        addElementCallback: function(a) { this.elementCallbacks || (this.elementCallbacks = []);
          this.elementCallbacks.push(a) },
        addFeature: function(a) {
          if (this.disabled || !a) return !0;
          a.toFeature && (a = a.toFeature(this.editor));
          this.allow(a.allowedContent,
            a.name);
          this.addTransformations(a.contentTransformations);
          this.addContentForms(a.contentForms);
          return a.requiredContent && (this.customConfig || this.disallowedContent.length) ? this.check(a.requiredContent) : !0
        },
        addTransformations: function(a) {
          var b, c;
          if (!this.disabled && a) {
            var f = this._.transformations,
              e;
            for (e = 0; e < a.length; ++e) {
              b = a[e];
              var g = void 0,
                d = void 0,
                h = void 0,
                m = void 0,
                k = void 0,
                l = void 0;
              c = [];
              for (d = 0; d < b.length; ++d) h = b[d], "string" == typeof h ? (h = h.split(/\s*:\s*/), m = h[0], k = null, l = h[1]) : (m = h.check, k = h.left,
                l = h.right), g || (g = h, g = g.element ? g.element : m ? m.match(/^([a-z0-9]+)/i)[0] : g.left.getDefinition().element), k instanceof CKEDITOR.style && (k = A(k)), c.push({ check: m == g ? null : m, left: k, right: "string" == typeof l ? G(l) : l });
              b = g;
              f[b] || (f[b] = []);
              f[b].push(c)
            }
          }
        },
        check: function(a, b, c) {
          if (this.disabled) return !0;
          if (CKEDITOR.tools.isArray(a)) { for (var e = a.length; e--;)
              if (this.check(a[e], b, c)) return !0; return !1 }
          var g, d;
          if ("string" == typeof a) {
            d = a + "\x3c" + (!1 === b ? "0" : "1") + (c ? "1" : "0") + "\x3e";
            if (d in this._.cachedChecks) return this._.cachedChecks[d];
            e = f(a).$1;
            g = e.styles;
            var h = e.classes;
            e.name = e.elements;
            e.classes = h = h ? h.split(/\s*,\s*/) : [];
            e.styles = m(g);
            e.attributes = m(e.attributes);
            e.children = [];
            h.length && (e.attributes["class"] = h.join(" "));
            g && (e.attributes.style = CKEDITOR.tools.writeCssText(e.styles));
            g = e
          } else e = a.getDefinition(), g = e.styles, h = e.attributes || {}, g && !CKEDITOR.tools.isEmpty(g) ? (g = F(g), h.style = CKEDITOR.tools.writeCssText(g, !0)) : g = {}, g = { name: e.element, attributes: h, classes: h["class"] ? h["class"].split(/\s+/) : [], styles: g, children: [] };
          var h =
            CKEDITOR.tools.clone(g),
            k = [],
            l;
          if (!1 !== b && (l = this._.transformations[g.name])) { for (e = 0; e < l.length; ++e) y(this, g, l[e]);
            v(g) } q(this, h, k, { doFilter: !0, doTransform: !1 !== b, skipRequired: !c, skipFinalValidation: !c });
          b = 0 < k.length ? !1 : CKEDITOR.tools.objectCompare(g.attributes, h.attributes, !0) ? !0 : !1;
          "string" == typeof a && (this._.cachedChecks[d] = b);
          return b
        },
        getAllowedEnterMode: function() {
          var a = ["p", "div", "br"],
            b = { p: CKEDITOR.ENTER_P, div: CKEDITOR.ENTER_DIV, br: CKEDITOR.ENTER_BR };
          return function(c, f) {
            var e = a.slice(),
              g;
            if (this.check(H[c])) return c;
            for (f || (e = e.reverse()); g = e.pop();)
              if (this.check(g)) return b[g];
            return CKEDITOR.ENTER_BR
          }
        }(),
        clone: function() { var a = new CKEDITOR.filter,
            b = CKEDITOR.tools.clone;
          a.allowedContent = b(this.allowedContent);
          a._.allowedRules = b(this._.allowedRules);
          a.disallowedContent = b(this.disallowedContent);
          a._.disallowedRules = b(this._.disallowedRules);
          a._.transformations = b(this._.transformations);
          a.disabled = this.disabled;
          a.editor = this.editor; return a },
        destroy: function() {
          delete CKEDITOR.filter.instances[this.id];
          delete this._;
          delete this.allowedContent;
          delete this.disallowedContent
        }
      };
      var K = { styles: 1, attributes: 1, classes: 1 },
        J = { styles: "requiredStyles", attributes: "requiredAttributes", classes: "requiredClasses" },
        E = /^([a-z0-9\-*\s]+)((?:\s*\{[!\w\-,\s\*]+\}\s*|\s*\[[!\w\-,\s\*]+\]\s*|\s*\([!\w\-,\s\*]+\)\s*){0,3})(?:;\s*|$)/i,
        R = { styles: /{([^}]+)}/, attrs: /\[([^\]]+)\]/, classes: /\(([^\)]+)\)/ },
        O = /^cke:(object|embed|param)$/,
        S = /^(object|embed|param)$/,
        L;
      L = CKEDITOR.filter.transformationsTools = {
        sizeToStyle: function(a) {
          this.lengthToStyle(a,
            "width");
          this.lengthToStyle(a, "height")
        },
        sizeToAttribute: function(a) { this.lengthToAttribute(a, "width");
          this.lengthToAttribute(a, "height") },
        lengthToStyle: function(a, b, c) { c = c || b; if (!(c in a.styles)) { var f = a.attributes[b];
            f && (/^\d+$/.test(f) && (f += "px"), a.styles[c] = f) } delete a.attributes[b] },
        lengthToAttribute: function(a, b, c) { c = c || b; if (!(c in a.attributes)) { var f = a.styles[b],
              e = f && f.match(/^(\d+)(?:\.\d*)?px$/);
            e ? a.attributes[c] = e[1] : "cke-test" == f && (a.attributes[c] = "cke-test") } delete a.styles[b] },
        alignmentToStyle: function(a) {
          if (!("float" in
              a.styles)) { var b = a.attributes.align; if ("left" == b || "right" == b) a.styles["float"] = b } delete a.attributes.align
        },
        alignmentToAttribute: function(a) { if (!("align" in a.attributes)) { var b = a.styles["float"]; if ("left" == b || "right" == b) a.attributes.align = b } delete a.styles["float"] },
        splitBorderShorthand: function(a) {
          if (a.styles.border) {
            var b = CKEDITOR.tools.style.parse.border(a.styles.border);
            b.color && (a.styles["border-color"] = b.color);
            b.style && (a.styles["border-style"] = b.style);
            b.width && (a.styles["border-width"] = b.width);
            delete a.styles.border
          }
        },
        listTypeToStyle: function(a) { if (a.attributes.type) switch (a.attributes.type) {
            case "a":
              a.styles["list-style-type"] = "lower-alpha"; break;
            case "A":
              a.styles["list-style-type"] = "upper-alpha"; break;
            case "i":
              a.styles["list-style-type"] = "lower-roman"; break;
            case "I":
              a.styles["list-style-type"] = "upper-roman"; break;
            case "1":
              a.styles["list-style-type"] = "decimal"; break;
            default:
              a.styles["list-style-type"] = a.attributes.type } },
        splitMarginShorthand: function(a) {
          function b(f) {
            a.styles["margin-top"] =
              c[f[0]];
            a.styles["margin-right"] = c[f[1]];
            a.styles["margin-bottom"] = c[f[2]];
            a.styles["margin-left"] = c[f[3]]
          }
          if (a.styles.margin) { var c = a.styles.margin.match(/(\-?[\.\d]+\w+)/g) || ["0px"]; switch (c.length) {
              case 1:
                b([0, 0, 0, 0]); break;
              case 2:
                b([0, 1, 0, 1]); break;
              case 3:
                b([0, 1, 2, 1]); break;
              case 4:
                b([0, 1, 2, 3]) } delete a.styles.margin }
        },
        matchesStyle: C,
        transform: function(a, b) {
          if ("string" == typeof b) a.name = b;
          else {
            var c = b.getDefinition(),
              f = c.styles,
              e = c.attributes,
              g, d, h, m;
            a.name = c.element;
            for (g in e)
              if ("class" == g)
                for (c =
                  a.classes.join("|"), h = e[g].split(/\s+/); m = h.pop();) - 1 == c.indexOf(m) && a.classes.push(m);
              else a.attributes[g] = e[g];
            for (d in f) a.styles[d] = f[d]
          }
        }
      }
    }(),
    function() {
      CKEDITOR.focusManager = function(a) { if (a.focusManager) return a.focusManager;
        this.hasFocus = !1;
        this.currentActive = null;
        this._ = { editor: a }; return this };
      CKEDITOR.focusManager._ = { blurDelay: 200 };
      CKEDITOR.focusManager.prototype = {
        focus: function(a) {
          this._.timer && clearTimeout(this._.timer);
          a && (this.currentActive = a);
          this.hasFocus || this._.locked || ((a = CKEDITOR.currentInstance) &&
            a.focusManager.blur(1), this.hasFocus = !0, (a = this._.editor.container) && a.addClass("cke_focus"), this._.editor.fire("focus"))
        },
        lock: function() { this._.locked = 1 },
        unlock: function() { delete this._.locked },
        blur: function(a) {
          function d() { if (this.hasFocus) { this.hasFocus = !1; var a = this._.editor.container;
              a && a.removeClass("cke_focus");
              this._.editor.fire("blur") } }
          if (!this._.locked) {
            this._.timer && clearTimeout(this._.timer);
            var b = CKEDITOR.focusManager._.blurDelay;
            a || !b ? d.call(this) : this._.timer = CKEDITOR.tools.setTimeout(function() {
              delete this._.timer;
              d.call(this)
            }, b, this)
          }
        },
        add: function(a, d) { var b = a.getCustomData("focusmanager"); if (!b || b != this) { b && b.remove(a); var b = "focus",
              c = "blur";
            d && (CKEDITOR.env.ie ? (b = "focusin", c = "focusout") : CKEDITOR.event.useCapture = 1); var g = { blur: function() { a.equals(this.currentActive) && this.blur() }, focus: function() { this.focus(a) } };
            a.on(b, g.focus, this);
            a.on(c, g.blur, this);
            d && (CKEDITOR.event.useCapture = 0);
            a.setCustomData("focusmanager", this);
            a.setCustomData("focusmanager_handlers", g) } },
        remove: function(a) {
          a.removeCustomData("focusmanager");
          var d = a.removeCustomData("focusmanager_handlers");
          a.removeListener("blur", d.blur);
          a.removeListener("focus", d.focus)
        }
      }
    }(), CKEDITOR.keystrokeHandler = function(a) { if (a.keystrokeHandler) return a.keystrokeHandler;
      this.keystrokes = {};
      this.blockedKeystrokes = {};
      this._ = { editor: a }; return this },
    function() {
      var a, d = function(b) {
          b = b.data;
          var g = b.getKeystroke(),
            d = this.keystrokes[g],
            k = this._.editor;
          a = !1 === k.fire("key", { keyCode: g, domEvent: b });
          a || (d && (a = !1 !== k.execCommand(d, { from: "keystrokeHandler" })), a || (a = !!this.blockedKeystrokes[g]));
          a && b.preventDefault(!0);
          return !a
        },
        b = function(b) { a && (a = !1, b.data.preventDefault(!0)) };
      CKEDITOR.keystrokeHandler.prototype = { attach: function(a) { a.on("keydown", d, this); if (CKEDITOR.env.gecko && CKEDITOR.env.mac) a.on("keypress", b, this) } }
    }(),
    function() {
      CKEDITOR.lang = {
        languages: {
          af: 1,
          ar: 1,
          az: 1,
          bg: 1,
          bn: 1,
          bs: 1,
          ca: 1,
          cs: 1,
          cy: 1,
          da: 1,
          de: 1,
          "de-ch": 1,
          el: 1,
          "en-au": 1,
          "en-ca": 1,
          "en-gb": 1,
          en: 1,
          eo: 1,
          es: 1,
          "es-mx": 1,
          et: 1,
          eu: 1,
          fa: 1,
          fi: 1,
          fo: 1,
          "fr-ca": 1,
          fr: 1,
          gl: 1,
          gu: 1,
          he: 1,
          hi: 1,
          hr: 1,
          hu: 1,
          id: 1,
          is: 1,
          it: 1,
          ja: 1,
          ka: 1,
          km: 1,
          ko: 1,
          ku: 1,
          lt: 1,
          lv: 1,
          mk: 1,
          mn: 1,
          ms: 1,
          nb: 1,
          nl: 1,
          no: 1,
          oc: 1,
          pl: 1,
          "pt-br": 1,
          pt: 1,
          ro: 1,
          ru: 1,
          si: 1,
          sk: 1,
          sl: 1,
          sq: 1,
          "sr-latn": 1,
          sr: 1,
          sv: 1,
          th: 1,
          tr: 1,
          tt: 1,
          ug: 1,
          uk: 1,
          vi: 1,
          "zh-cn": 1,
          zh: 1
        },
        rtl: { ar: 1, fa: 1, he: 1, ku: 1, ug: 1 },
        load: function(a, d, b) { a && CKEDITOR.lang.languages[a] || (a = this.detect(d, a)); var c = this;
          d = function() { c[a].dir = c.rtl[a] ? "rtl" : "ltr";
            b(a, c[a]) };
          this[a] ? d() : CKEDITOR.scriptLoader.load(CKEDITOR.getUrl("lang/" + a + ".js"), d, this) },
        detect: function(a, d) {
          var b = this.languages;
          d = d || navigator.userLanguage || navigator.language ||
            a;
          var c = d.toLowerCase().match(/([a-z]+)(?:-([a-z]+))?/),
            g = c[1],
            c = c[2];
          b[g + "-" + c] ? g = g + "-" + c : b[g] || (g = null);
          CKEDITOR.lang.detect = g ? function() { return g } : function(a) { return a };
          return g || a
        }
      }
    }(), CKEDITOR.scriptLoader = function() {
      var a = {},
        d = {};
      return {
        load: function(b, c, g, l) {
          var k = "string" == typeof b;
          k && (b = [b]);
          g || (g = CKEDITOR);
          var e = b.length,
            h = [],
            m = [],
            f = function(a) { c && (k ? c.call(g, a) : c.call(g, h, m)) };
          if (0 === e) f(!0);
          else {
            var n = function(a, b) {
                (b ? h : m).push(a);
                0 >= --e && (l && CKEDITOR.document.getDocumentElement().removeStyle("cursor"),
                  f(b))
              },
              p = function(b, c) { a[b] = 1; var f = d[b];
                delete d[b]; for (var e = 0; e < f.length; e++) f[e](b, c) },
              q = function(b) {
                if (a[b]) n(b, !0);
                else {
                  var f = d[b] || (d[b] = []);
                  f.push(n);
                  if (!(1 < f.length)) {
                    var e = new CKEDITOR.dom.element("script");
                    e.setAttributes({ type: "text/javascript", src: b });
                    c && (CKEDITOR.env.ie && (8 >= CKEDITOR.env.version || CKEDITOR.env.ie9Compat) ? e.$.onreadystatechange = function() { if ("loaded" == e.$.readyState || "complete" == e.$.readyState) e.$.onreadystatechange = null, p(b, !0) } : (e.$.onload = function() {
                      setTimeout(function() {
                        p(b, !0)
                      }, 0)
                    }, e.$.onerror = function() { p(b, !1) }));
                    e.appendTo(CKEDITOR.document.getHead())
                  }
                }
              };
            l && CKEDITOR.document.getDocumentElement().setStyle("cursor", "wait");
            for (var w = 0; w < e; w++) q(b[w])
          }
        },
        queue: function() {
          function a() { var b;
            (b = c[0]) && this.load(b.scriptUrl, b.callback, CKEDITOR, 0) } var c = []; return function(g, d) { var k = this;
            c.push({ scriptUrl: g, callback: function() { d && d.apply(this, arguments);
                c.shift();
                a.call(k) } });
            1 == c.length && a.call(this) } }()
      }
    }(), CKEDITOR.resourceManager = function(a, d) {
      this.basePath = a;
      this.fileName =
        d;
      this.registered = {};
      this.loaded = {};
      this.externals = {};
      this._ = { waitingList: {} }
    }, CKEDITOR.resourceManager.prototype = {
      add: function(a, d) { if (this.registered[a]) throw Error('[CKEDITOR.resourceManager.add] The resource name "' + a + '" is already registered.'); var b = this.registered[a] = d || {};
        b.name = a;
        b.path = this.getPath(a);
        CKEDITOR.fire(a + CKEDITOR.tools.capitalize(this.fileName) + "Ready", b); return this.get(a) },
      get: function(a) { return this.registered[a] || null },
      getPath: function(a) {
        var d = this.externals[a];
        return CKEDITOR.getUrl(d &&
          d.dir || this.basePath + a + "/")
      },
      getFilePath: function(a) { var d = this.externals[a]; return CKEDITOR.getUrl(this.getPath(a) + (d ? d.file : this.fileName + ".js")) },
      addExternal: function(a, d, b) { a = a.split(","); for (var c = 0; c < a.length; c++) { var g = a[c];
          b || (d = d.replace(/[^\/]+$/, function(a) { b = a; return "" }));
          this.externals[g] = { dir: d, file: b || this.fileName + ".js" } } },
      load: function(a, d, b) {
        CKEDITOR.tools.isArray(a) || (a = a ? [a] : []);
        for (var c = this.loaded, g = this.registered, l = [], k = {}, e = {}, h = 0; h < a.length; h++) {
          var m = a[h];
          if (m)
            if (c[m] ||
              g[m]) e[m] = this.get(m);
            else { var f = this.getFilePath(m);
              l.push(f);
              f in k || (k[f] = []);
              k[f].push(m) }
        }
        CKEDITOR.scriptLoader.load(l, function(a, f) { if (f.length) throw Error('[CKEDITOR.resourceManager.load] Resource name "' + k[f[0]].join(",") + '" was not found at "' + f[0] + '".'); for (var g = 0; g < a.length; g++)
            for (var h = k[a[g]], m = 0; m < h.length; m++) { var l = h[m];
              e[l] = this.get(l);
              c[l] = 1 } d.call(b, e) }, this)
      }
    }, CKEDITOR.plugins = new CKEDITOR.resourceManager("plugins/", "plugin"), CKEDITOR.plugins.load = CKEDITOR.tools.override(CKEDITOR.plugins.load,
      function(a) {
        var d = {};
        return function(b, c, g) {
          var l = {},
            k = function(b) {
              a.call(this, b, function(a) {
                CKEDITOR.tools.extend(l, a);
                var b = [],
                  f;
                for (f in a) { var e = a[f],
                    p = e && e.requires; if (!d[f]) { if (e && e.icons)
                      for (var q = e.icons.split(","), w = q.length; w--;) CKEDITOR.skin.addIcon(q[w], e.path + "icons/" + (CKEDITOR.env.hidpi && e.hidpi ? "hidpi/" : "") + q[w] + ".png");
                    d[f] = 1 } if (p)
                    for (p.split && (p = p.split(",")), e = 0; e < p.length; e++) l[p[e]] || b.push(p[e]) }
                if (b.length) k.call(this, b);
                else {
                  for (f in l) e = l[f], e.onLoad && !e.onLoad._called && (!1 ===
                    e.onLoad() && delete l[f], e.onLoad._called = 1);
                  c && c.call(g || window, l)
                }
              }, this)
            };
          k.call(this, b)
        }
      }), CKEDITOR.plugins.setLang = function(a, d, b) { var c = this.get(a);
      a = c.langEntries || (c.langEntries = {});
      c = c.lang || (c.lang = []);
      c.split && (c = c.split(",")); - 1 == CKEDITOR.tools.indexOf(c, d) && c.push(d);
      a[d] = b }, CKEDITOR.ui = function(a) { if (a.ui) return a.ui;
      this.items = {};
      this.instances = {};
      this.editor = a;
      this._ = { handlers: {} }; return this }, CKEDITOR.ui.prototype = {
      add: function(a, d, b) {
        b.name = a.toLowerCase();
        var c = this.items[a] = {
          type: d,
          command: b.command || null,
          args: Array.prototype.slice.call(arguments, 2)
        };
        CKEDITOR.tools.extend(c, b)
      },
      get: function(a) { return this.instances[a] },
      create: function(a) { var d = this.items[a],
          b = d && this._.handlers[d.type],
          c = d && d.command && this.editor.getCommand(d.command),
          b = b && b.create.apply(this, d.args);
        this.instances[a] = b;
        c && c.uiItems.push(b);
        b && !b.type && (b.type = d.type); return b },
      addHandler: function(a, d) { this._.handlers[a] = d },
      space: function(a) { return CKEDITOR.document.getById(this.spaceId(a)) },
      spaceId: function(a) {
        return this.editor.id +
          "_" + a
      }
    }, CKEDITOR.event.implementOn(CKEDITOR.ui),
    function() {
      function a(a, f, g) {
        CKEDITOR.event.call(this);
        a = a && CKEDITOR.tools.clone(a);
        if (void 0 !== f) {
          if (!(f instanceof CKEDITOR.dom.element)) throw Error("Expect element of type CKEDITOR.dom.element.");
          if (!g) throw Error("One of the element modes must be specified.");
          if (CKEDITOR.env.ie && CKEDITOR.env.quirks && g == CKEDITOR.ELEMENT_MODE_INLINE) throw Error("Inline element mode is not supported on IE quirks.");
          if (!b(f, g)) throw Error('The specified element mode is not supported on element: "' +
            f.getName() + '".');
          this.element = f;
          this.elementMode = g;
          this.name = this.elementMode != CKEDITOR.ELEMENT_MODE_APPENDTO && (f.getId() || f.getNameAtt())
        } else this.elementMode = CKEDITOR.ELEMENT_MODE_NONE;
        this._ = {};
        this.commands = {};
        this.templates = {};
        this.name = this.name || d();
        this.id = CKEDITOR.tools.getNextId();
        this.status = "unloaded";
        this.config = CKEDITOR.tools.prototypedCopy(CKEDITOR.config);
        this.ui = new CKEDITOR.ui(this);
        this.focusManager = new CKEDITOR.focusManager(this);
        this.keystrokeHandler = new CKEDITOR.keystrokeHandler(this);
        this.on("readOnly", c);
        this.on("selectionChange", function(a) { l(this, a.data.path) });
        this.on("activeFilterChange", function() { l(this, this.elementPath(), !0) });
        this.on("mode", c);
        this.on("instanceReady", function() { if (this.config.startupFocus) { if ("end" === this.config.startupFocus) { var a = this.createRange();
              a.selectNodeContents(this.editable());
              a.shrink(CKEDITOR.SHRINK_ELEMENT, !0);
              a.collapse();
              this.getSelection().selectRanges([a]) } this.focus() } });
        CKEDITOR.fire("instanceCreated", null, this);
        CKEDITOR.add(this);
        CKEDITOR.tools.setTimeout(function() { "destroyed" !== this.status ? e(this, a) : CKEDITOR.warn("editor-incorrect-destroy") }, 0, this)
      }

      function d() { do var a = "editor" + ++w; while (CKEDITOR.instances[a]); return a }

      function b(a, b) { return b == CKEDITOR.ELEMENT_MODE_INLINE ? a.is(CKEDITOR.dtd.$editable) || a.is("textarea") : b == CKEDITOR.ELEMENT_MODE_REPLACE ? !a.is(CKEDITOR.dtd.$nonBodyContent) : 1 }

      function c() { var a = this.commands,
          b; for (b in a) g(this, a[b]) }

      function g(a, b) {
        b[b.startDisabled ? "disable" : a.readOnly && !b.readOnly ? "disable" :
          b.modes[a.mode] ? "enable" : "disable"]()
      }

      function l(a, b, c) { if (b) { var f, e, g = a.commands; for (e in g) f = g[e], (c || f.contextSensitive) && f.refresh(a, b) } }

      function k(a) { var b = a.config.customConfig; if (!b) return !1; var b = CKEDITOR.getUrl(b),
          c = v[b] || (v[b] = {});
        c.fn ? (c.fn.call(a, a.config), CKEDITOR.getUrl(a.config.customConfig) != b && k(a) || a.fireOnce("customConfigLoaded")) : CKEDITOR.scriptLoader.queue(b, function() { c.fn = CKEDITOR.editorConfig ? CKEDITOR.editorConfig : function() {};
          k(a) }); return !0 }

      function e(a, b) {
        a.on("customConfigLoaded",
          function() {
            if (b) { if (b.on)
                for (var c in b.on) a.on(c, b.on[c]);
              CKEDITOR.tools.extend(a.config, b, !0);
              delete a.config.on } c = a.config;
            a.readOnly = c.readOnly ? !0 : a.elementMode == CKEDITOR.ELEMENT_MODE_INLINE ? a.element.is("textarea") ? a.element.hasAttribute("disabled") || a.element.hasAttribute("readonly") : a.element.isReadOnly() : a.elementMode == CKEDITOR.ELEMENT_MODE_REPLACE ? a.element.hasAttribute("disabled") || a.element.hasAttribute("readonly") : !1;
            a.blockless = a.elementMode == CKEDITOR.ELEMENT_MODE_INLINE ? !(a.element.is("textarea") ||
              CKEDITOR.dtd[a.element.getName()].p) : !1;
            a.tabIndex = c.tabIndex || a.element && a.element.getAttribute("tabindex") || 0;
            a.activeEnterMode = a.enterMode = a.blockless ? CKEDITOR.ENTER_BR : c.enterMode;
            a.activeShiftEnterMode = a.shiftEnterMode = a.blockless ? CKEDITOR.ENTER_BR : c.shiftEnterMode;
            c.skin && (CKEDITOR.skinName = c.skin);
            a.fireOnce("configLoaded");
            a.dataProcessor = new CKEDITOR.htmlDataProcessor(a);
            a.filter = a.activeFilter = new CKEDITOR.filter(a);
            h(a)
          });
        b && null != b.customConfig && (a.config.customConfig = b.customConfig);
        k(a) || a.fireOnce("customConfigLoaded")
      }

      function h(a) { CKEDITOR.skin.loadPart("editor", function() { m(a) }) }

      function m(a) {
        CKEDITOR.lang.load(a.config.language, a.config.defaultLanguage, function(b, c) {
          var e = a.config.title;
          a.langCode = b;
          a.lang = CKEDITOR.tools.prototypedCopy(c);
          a.title = "string" == typeof e || !1 === e ? e : [a.lang.editor, a.name].join(", ");
          a.config.contentsLangDirection || (a.config.contentsLangDirection = a.elementMode == CKEDITOR.ELEMENT_MODE_INLINE ? a.element.getDirection(1) : a.lang.dir);
          a.fire("langLoaded");
          f(a)
        })
      }

      function f(a) { a.getStylesSet(function(b) { a.once("loaded", function() { a.fire("stylesSet", { styles: b }) }, null, null, 1);
          n(a) }) }

      function n(a) {
        var b = a.config,
          c = b.plugins,
          f = b.extraPlugins,
          e = b.removePlugins;
        if (f) var g = new RegExp("(?:^|,)(?:" + f.replace(/\s*,\s*/g, "|") + ")(?\x3d,|$)", "g"),
          c = c.replace(g, ""),
          c = c + ("," + f);
        if (e) var d = new RegExp("(?:^|,)(?:" + e.replace(/\s*,\s*/g, "|") + ")(?\x3d,|$)", "g"),
          c = c.replace(d, "");
        CKEDITOR.env.air && (c += ",adobeair");
        CKEDITOR.plugins.load(c.split(","), function(c) {
          var f = [],
            e = [],
            g = [];
          a.plugins = c;
          for (var h in c) {
            var m = c[h],
              k = m.lang,
              l = null,
              n = m.requires,
              x;
            CKEDITOR.tools.isArray(n) && (n = n.join(","));
            if (n && (x = n.match(d)))
              for (; n = x.pop();) CKEDITOR.error("editor-plugin-required", { plugin: n.replace(",", ""), requiredBy: h });
            k && !a.lang[h] && (k.split && (k = k.split(",")), 0 <= CKEDITOR.tools.indexOf(k, a.langCode) ? l = a.langCode : (l = a.langCode.replace(/-.*/, ""), l = l != a.langCode && 0 <= CKEDITOR.tools.indexOf(k, l) ? l : 0 <= CKEDITOR.tools.indexOf(k, "en") ? "en" : k[0]), m.langEntries && m.langEntries[l] ? (a.lang[h] =
              m.langEntries[l], l = null) : g.push(CKEDITOR.getUrl(m.path + "lang/" + l + ".js")));
            e.push(l);
            f.push(m)
          }
          CKEDITOR.scriptLoader.load(g, function() {
            for (var c = ["beforeInit", "init", "afterInit"], g = 0; g < c.length; g++)
              for (var d = 0; d < f.length; d++) { var h = f[d];
                0 === g && e[d] && h.lang && h.langEntries && (a.lang[h.name] = h.langEntries[e[d]]); if (h[c[g]]) h[c[g]](a) } a.fireOnce("pluginsLoaded");
            b.keystrokes && a.setKeystroke(a.config.keystrokes);
            for (d = 0; d < a.config.blockedKeystrokes.length; d++) a.keystrokeHandler.blockedKeystrokes[a.config.blockedKeystrokes[d]] =
              1;
            a.status = "loaded";
            a.fireOnce("loaded");
            CKEDITOR.fire("instanceLoaded", null, a)
          })
        })
      }

      function p() { var a = this.element; if (a && this.elementMode != CKEDITOR.ELEMENT_MODE_APPENDTO) { var b = this.getData();
          this.config.htmlEncodeOutput && (b = CKEDITOR.tools.htmlEncode(b));
          a.is("textarea") ? a.setValue(b) : a.setHtml(b); return !0 } return !1 }

      function q(a, b) {
        function c(a) { var b = a.startContainer,
            f = a.endContainer; return b.is && (b.is("tr") || b.is("td") && b.equals(f) && a.endOffset === b.getChildCount()) ? !0 : !1 }

        function f(a) {
          var b = a.startContainer;
          return b.is("tr") ? a.cloneContents() : b.clone(!0)
        }
        for (var e = new CKEDITOR.dom.documentFragment, g, d, h, m = 0; m < a.length; m++) { var k = a[m],
            l = k.startContainer.getAscendant("tr", !0);
          c(k) ? (g || (g = l.getAscendant("table").clone(), g.append(l.getAscendant({ thead: 1, tbody: 1, tfoot: 1 }).clone()), e.append(g), g = g.findOne("thead, tbody, tfoot")), d && d.equals(l) || (d = l, h = l.clone(), g.append(h)), h.append(f(k))) : e.append(k.cloneContents()) }
        return g ? e : b.getHtmlFromRange(a[0])
      }
      a.prototype = CKEDITOR.editor.prototype;
      CKEDITOR.editor =
        a;
      var w = 0,
        v = {};
      CKEDITOR.tools.extend(CKEDITOR.editor.prototype, {
        addCommand: function(a, b) { b.name = a.toLowerCase(); var c = new CKEDITOR.command(this, b);
          this.mode && g(this, c); return this.commands[a] = c },
        _attachToForm: function() {
          function a(b) { c.updateElement();
            c._.required && !f.getValue() && !1 === c.fire("required") && b.data.preventDefault() }

          function b(a) { return !!(a && a.call && a.apply) }
          var c = this,
            f = c.element,
            e = new CKEDITOR.dom.element(f.$.form);
          f.is("textarea") && e && (e.on("submit", a), b(e.$.submit) && (e.$.submit = CKEDITOR.tools.override(e.$.submit,
            function(b) { return function() { a();
                b.apply ? b.apply(this) : b() } })), c.on("destroy", function() { e.removeListener("submit", a) }))
        },
        destroy: function(a) { this.fire("beforeDestroy");!a && p.call(this);
          this.editable(null);
          this.filter && (this.filter.destroy(), delete this.filter);
          delete this.activeFilter;
          this.status = "destroyed";
          this.fire("destroy");
          this.removeAllListeners();
          CKEDITOR.remove(this);
          CKEDITOR.fire("instanceDestroyed", null, this) },
        elementPath: function(a) {
          if (!a) { a = this.getSelection(); if (!a) return null;
            a = a.getStartElement() }
          return a ?
            new CKEDITOR.dom.elementPath(a, this.editable()) : null
        },
        createRange: function() { var a = this.editable(); return a ? new CKEDITOR.dom.range(a) : null },
        execCommand: function(a, b) { var c = this.getCommand(a),
            f = { name: a, commandData: b || {}, command: c }; return c && c.state != CKEDITOR.TRISTATE_DISABLED && !1 !== this.fire("beforeCommandExec", f) && (f.returnValue = c.exec(f.commandData), !c.async && !1 !== this.fire("afterCommandExec", f)) ? f.returnValue : !1 },
        getCommand: function(a) { return this.commands[a] },
        getData: function(a) {
          !a && this.fire("beforeGetData");
          var b = this._.data;
          "string" != typeof b && (b = (b = this.element) && this.elementMode == CKEDITOR.ELEMENT_MODE_REPLACE ? b.is("textarea") ? b.getValue() : b.getHtml() : "");
          b = { dataValue: b };
          !a && this.fire("getData", b);
          return b.dataValue
        },
        getSnapshot: function() { var a = this.fire("getSnapshot"); "string" != typeof a && (a = (a = this.element) && this.elementMode == CKEDITOR.ELEMENT_MODE_REPLACE ? a.is("textarea") ? a.getValue() : a.getHtml() : ""); return a },
        loadSnapshot: function(a) { this.fire("loadSnapshot", a) },
        setData: function(a, b, c) {
          var f = !0,
            e = b;
          b && "object" == typeof b && (c = b.internal, e = b.callback, f = !b.noSnapshot);
          !c && f && this.fire("saveSnapshot");
          if (e || !c) this.once("dataReady", function(a) {!c && f && this.fire("saveSnapshot");
            e && e.call(a.editor) });
          a = { dataValue: a };
          !c && this.fire("setData", a);
          this._.data = a.dataValue;
          !c && this.fire("afterSetData", a)
        },
        setReadOnly: function(a) { a = null == a || a;
          this.readOnly != a && (this.readOnly = a, this.keystrokeHandler.blockedKeystrokes[8] = +a, this.editable().setReadOnly(a), this.fire("readOnly")) },
        insertHtml: function(a, b, c) {
          this.fire("insertHtml", { dataValue: a, mode: b, range: c })
        },
        insertText: function(a) { this.fire("insertText", a) },
        insertElement: function(a) { this.fire("insertElement", a) },
        getSelectedHtml: function(a) { var b = this.editable(),
            c = this.getSelection(),
            c = c && c.getRanges(); if (!b || !c || 0 === c.length) return null;
          b = q(c, b); return a ? b.getHtml() : b },
        extractSelectedHtml: function(a, b) {
          var c = this.editable(),
            f = this.getSelection().getRanges(),
            e = new CKEDITOR.dom.documentFragment,
            g;
          if (!c || 0 === f.length) return null;
          for (g = 0; g < f.length; g++) e.append(c.extractHtmlFromRange(f[g],
            b));
          b || this.getSelection().selectRanges([f[0]]);
          return a ? e.getHtml() : e
        },
        focus: function() { this.fire("beforeFocus") },
        checkDirty: function() { return "ready" == this.status && this._.previousValue !== this.getSnapshot() },
        resetDirty: function() { this._.previousValue = this.getSnapshot() },
        updateElement: function() { return p.call(this) },
        setKeystroke: function() {
          for (var a = this.keystrokeHandler.keystrokes, b = CKEDITOR.tools.isArray(arguments[0]) ? arguments[0] : [
              [].slice.call(arguments, 0)
            ], c, f, e = b.length; e--;) c = b[e], f = 0, CKEDITOR.tools.isArray(c) &&
            (f = c[1], c = c[0]), f ? a[c] = f : delete a[c]
        },
        getCommandKeystroke: function(a) { if (a = "string" === typeof a ? this.getCommand(a) : a) { var b = CKEDITOR.tools.object.findKey(this.commands, a),
              c = this.keystrokeHandler.keystrokes,
              f; if (a.fakeKeystroke) return a.fakeKeystroke; for (f in c)
              if (c.hasOwnProperty(f) && c[f] == b) return f } return null },
        addFeature: function(a) { return this.filter.addFeature(a) },
        setActiveFilter: function(a) {
          a || (a = this.filter);
          this.activeFilter !== a && (this.activeFilter = a, this.fire("activeFilterChange"), a === this.filter ?
            this.setActiveEnterMode(null, null) : this.setActiveEnterMode(a.getAllowedEnterMode(this.enterMode), a.getAllowedEnterMode(this.shiftEnterMode, !0)))
        },
        setActiveEnterMode: function(a, b) { a = a ? this.blockless ? CKEDITOR.ENTER_BR : a : this.enterMode;
          b = b ? this.blockless ? CKEDITOR.ENTER_BR : b : this.shiftEnterMode; if (this.activeEnterMode != a || this.activeShiftEnterMode != b) this.activeEnterMode = a, this.activeShiftEnterMode = b, this.fire("activeEnterModeChange") },
        showNotification: function(a) { alert(a) }
      })
    }(), CKEDITOR.ELEMENT_MODE_NONE =
    0, CKEDITOR.ELEMENT_MODE_REPLACE = 1, CKEDITOR.ELEMENT_MODE_APPENDTO = 2, CKEDITOR.ELEMENT_MODE_INLINE = 3, CKEDITOR.htmlParser = function() { this._ = { htmlPartsRegex: /<(?:(?:\/([^>]+)>)|(?:!--([\S|\s]*?)--\x3e)|(?:([^\/\s>]+)((?:\s+[\w\-:.]+(?:\s*=\s*?(?:(?:"[^"]*")|(?:'[^']*')|[^\s"'\/>]+))?)*)[\S\s]*?(\/?)>))/g } },
    function() {
      var a = /([\w\-:.]+)(?:(?:\s*=\s*(?:(?:"([^"]*)")|(?:'([^']*)')|([^\s>]+)))|(?=\s|$))/g,
        d = {
          checked: 1,
          compact: 1,
          declare: 1,
          defer: 1,
          disabled: 1,
          ismap: 1,
          multiple: 1,
          nohref: 1,
          noresize: 1,
          noshade: 1,
          nowrap: 1,
          readonly: 1,
          selected: 1
        };
      CKEDITOR.htmlParser.prototype = {
        onTagOpen: function() {},
        onTagClose: function() {},
        onText: function() {},
        onCDATA: function() {},
        onComment: function() {},
        parse: function(b) {
          for (var c, g, l = 0, k; c = this._.htmlPartsRegex.exec(b);) {
            g = c.index;
            if (g > l)
              if (l = b.substring(l, g), k) k.push(l);
              else this.onText(l);
            l = this._.htmlPartsRegex.lastIndex;
            if (g = c[1])
              if (g = g.toLowerCase(), k && CKEDITOR.dtd.$cdata[g] && (this.onCDATA(k.join("")), k = null), !k) { this.onTagClose(g); continue }
            if (k) k.push(c[0]);
            else if (g =
              c[3]) { if (g = g.toLowerCase(), !/="/.test(g)) { var e = {},
                  h, m = c[4];
                c = !!c[5]; if (m)
                  for (; h = a.exec(m);) { var f = h[1].toLowerCase();
                    h = h[2] || h[3] || h[4] || "";
                    e[f] = !h && d[f] ? f : CKEDITOR.tools.htmlDecodeAttr(h) } this.onTagOpen(g, e, c);!k && CKEDITOR.dtd.$cdata[g] && (k = []) } } else if (g = c[2]) this.onComment(g)
          }
          if (b.length > l) this.onText(b.substring(l, b.length))
        }
      }
    }(), CKEDITOR.htmlParser.basicWriter = CKEDITOR.tools.createClass({
      $: function() { this._ = { output: [] } },
      proto: {
        openTag: function(a) { this._.output.push("\x3c", a) },
        openTagClose: function(a,
          d) { d ? this._.output.push(" /\x3e") : this._.output.push("\x3e") },
        attribute: function(a, d) { "string" == typeof d && (d = CKEDITOR.tools.htmlEncodeAttr(d));
          this._.output.push(" ", a, '\x3d"', d, '"') },
        closeTag: function(a) { this._.output.push("\x3c/", a, "\x3e") },
        text: function(a) { this._.output.push(a) },
        comment: function(a) { this._.output.push("\x3c!--", a, "--\x3e") },
        write: function(a) { this._.output.push(a) },
        reset: function() { this._.output = [];
          this._.indent = !1 },
        getHtml: function(a) {
          var d = this._.output.join("");
          a && this.reset();
          return d
        }
      }
    }), "use strict",
    function() {
      CKEDITOR.htmlParser.node = function() {};
      CKEDITOR.htmlParser.node.prototype = {
        remove: function() { var a = this.parent.children,
            d = CKEDITOR.tools.indexOf(a, this),
            b = this.previous,
            c = this.next;
          b && (b.next = c);
          c && (c.previous = b);
          a.splice(d, 1);
          this.parent = null },
        replaceWith: function(a) { var d = this.parent.children,
            b = CKEDITOR.tools.indexOf(d, this),
            c = a.previous = this.previous,
            g = a.next = this.next;
          c && (c.next = a);
          g && (g.previous = a);
          d[b] = a;
          a.parent = this.parent;
          this.parent = null },
        insertAfter: function(a) {
          var d =
            a.parent.children,
            b = CKEDITOR.tools.indexOf(d, a),
            c = a.next;
          d.splice(b + 1, 0, this);
          this.next = a.next;
          this.previous = a;
          a.next = this;
          c && (c.previous = this);
          this.parent = a.parent
        },
        insertBefore: function(a) { var d = a.parent.children,
            b = CKEDITOR.tools.indexOf(d, a);
          d.splice(b, 0, this);
          this.next = a;
          (this.previous = a.previous) && (a.previous.next = this);
          a.previous = this;
          this.parent = a.parent },
        getAscendant: function(a) {
          var d = "function" == typeof a ? a : "string" == typeof a ? function(b) { return b.name == a } : function(b) { return b.name in a },
            b =
            this.parent;
          for (; b && b.type == CKEDITOR.NODE_ELEMENT;) { if (d(b)) return b;
            b = b.parent }
          return null
        },
        wrapWith: function(a) { this.replaceWith(a);
          a.add(this); return a },
        getIndex: function() { return CKEDITOR.tools.indexOf(this.parent.children, this) },
        getFilterContext: function(a) { return a || {} }
      }
    }(), "use strict", CKEDITOR.htmlParser.comment = function(a) { this.value = a;
      this._ = { isBlockLike: !1 } }, CKEDITOR.htmlParser.comment.prototype = CKEDITOR.tools.extend(new CKEDITOR.htmlParser.node, {
      type: CKEDITOR.NODE_COMMENT,
      filter: function(a,
        d) { var b = this.value; if (!(b = a.onComment(d, b, this))) return this.remove(), !1; if ("string" != typeof b) return this.replaceWith(b), !1;
        this.value = b; return !0 },
      writeHtml: function(a, d) { d && this.filter(d);
        a.comment(this.value) }
    }), "use strict",
    function() {
      CKEDITOR.htmlParser.text = function(a) { this.value = a;
        this._ = { isBlockLike: !1 } };
      CKEDITOR.htmlParser.text.prototype = CKEDITOR.tools.extend(new CKEDITOR.htmlParser.node, {
        type: CKEDITOR.NODE_TEXT,
        filter: function(a, d) {
          if (!(this.value = a.onText(d, this.value, this))) return this.remove(), !1
        },
        writeHtml: function(a, d) { d && this.filter(d);
          a.text(this.value) }
      })
    }(), "use strict",
    function() { CKEDITOR.htmlParser.cdata = function(a) { this.value = a };
      CKEDITOR.htmlParser.cdata.prototype = CKEDITOR.tools.extend(new CKEDITOR.htmlParser.node, { type: CKEDITOR.NODE_TEXT, filter: function() {}, writeHtml: function(a) { a.write(this.value) } }) }(), "use strict", CKEDITOR.htmlParser.fragment = function() { this.children = [];
      this.parent = null;
      this._ = { isBlockLike: !0, hasInlineStarted: !1 } },
    function() {
      function a(a) {
        return a.attributes["data-cke-survive"] ?
          !1 : "a" == a.name && a.attributes.href || CKEDITOR.dtd.$removeEmpty[a.name]
      }
      var d = CKEDITOR.tools.extend({ table: 1, ul: 1, ol: 1, dl: 1 }, CKEDITOR.dtd.table, CKEDITOR.dtd.ul, CKEDITOR.dtd.ol, CKEDITOR.dtd.dl),
        b = { ol: 1, ul: 1 },
        c = CKEDITOR.tools.extend({}, { html: 1 }, CKEDITOR.dtd.html, CKEDITOR.dtd.body, CKEDITOR.dtd.head, { style: 1, script: 1 }),
        g = { ul: "li", ol: "li", dl: "dd", table: "tbody", tbody: "tr", thead: "tr", tfoot: "tr", tr: "td" };
      CKEDITOR.htmlParser.fragment.fromHtml = function(l, k, e) {
        function h(a) {
          var b;
          if (0 < t.length)
            for (var c = 0; c < t.length; c++) {
              var f =
                t[c],
                e = f.name,
                g = CKEDITOR.dtd[e],
                d = r.name && CKEDITOR.dtd[r.name];
              d && !d[e] || a && g && !g[a] && CKEDITOR.dtd[a] ? e == r.name && (n(r, r.parent, 1), c--) : (b || (m(), b = 1), f = f.clone(), f.parent = r, r = f, t.splice(c, 1), c--)
            }
        }

        function m() { for (; u.length;) n(u.shift(), r) }

        function f(a) { if (a._.isBlockLike && "pre" != a.name && "textarea" != a.name) { var b = a.children.length,
              c = a.children[b - 1],
              f;
            c && c.type == CKEDITOR.NODE_TEXT && ((f = CKEDITOR.tools.rtrim(c.value)) ? c.value = f : a.children.length = b - 1) } }

        function n(b, c, g) {
          c = c || r || v;
          var d = r;
          void 0 === b.previous &&
            (p(c, b) && (r = c, w.onTagOpen(e, {}), b.returnPoint = c = r), f(b), a(b) && !b.children.length || c.add(b), "pre" == b.name && (x = !1), "textarea" == b.name && (B = !1));
          b.returnPoint ? (r = b.returnPoint, delete b.returnPoint) : r = g ? c : d
        }

        function p(a, b) { if ((a == v || "body" == a.name) && e && (!a.name || CKEDITOR.dtd[a.name][e])) { var c, f; return (c = b.attributes && (f = b.attributes["data-cke-real-element-type"]) ? f : b.name) && c in CKEDITOR.dtd.$inline && !(c in CKEDITOR.dtd.head) && !b.isOrphan || b.type == CKEDITOR.NODE_TEXT } }

        function q(a, b) {
          return a in CKEDITOR.dtd.$listItem ||
            a in CKEDITOR.dtd.$tableContent ? a == b || "dt" == a && "dd" == b || "dd" == a && "dt" == b : !1
        }
        var w = new CKEDITOR.htmlParser,
          v = k instanceof CKEDITOR.htmlParser.element ? k : "string" == typeof k ? new CKEDITOR.htmlParser.element(k) : new CKEDITOR.htmlParser.fragment,
          t = [],
          u = [],
          r = v,
          B = "textarea" == v.name,
          x = "pre" == v.name;
        w.onTagOpen = function(f, e, g, k) {
          e = new CKEDITOR.htmlParser.element(f, e);
          e.isUnknown && g && (e.isEmpty = !0);
          e.isOptionalClose = k;
          if (a(e)) t.push(e);
          else {
            if ("pre" == f) x = !0;
            else {
              if ("br" == f && x) {
                r.add(new CKEDITOR.htmlParser.text("\n"));
                return
              }
              "textarea" == f && (B = !0)
            }
            if ("br" == f) u.push(e);
            else {
              for (; !(k = (g = r.name) ? CKEDITOR.dtd[g] || (r._.isBlockLike ? CKEDITOR.dtd.div : CKEDITOR.dtd.span) : c, e.isUnknown || r.isUnknown || k[f]);)
                if (r.isOptionalClose) w.onTagClose(g);
                else if (f in b && g in b) g = r.children, (g = g[g.length - 1]) && "li" == g.name || n(g = new CKEDITOR.htmlParser.element("li"), r), !e.returnPoint && (e.returnPoint = r), r = g;
              else if (f in CKEDITOR.dtd.$listItem && !q(f, g)) w.onTagOpen("li" == f ? "ul" : "dl", {}, 0, 1);
              else if (g in d && !q(f, g)) !e.returnPoint && (e.returnPoint =
                r), r = r.parent;
              else if (g in CKEDITOR.dtd.$inline && t.unshift(r), r.parent) n(r, r.parent, 1);
              else { e.isOrphan = 1; break } h(f);
              m();
              e.parent = r;
              e.isEmpty ? n(e) : r = e
            }
          }
        };
        w.onTagClose = function(a) { for (var b = t.length - 1; 0 <= b; b--)
            if (a == t[b].name) { t.splice(b, 1); return }
          for (var c = [], f = [], g = r; g != v && g.name != a;) g._.isBlockLike || f.unshift(g), c.push(g), g = g.returnPoint || g.parent; if (g != v) { for (b = 0; b < c.length; b++) { var d = c[b];
              n(d, d.parent) } r = g;
            g._.isBlockLike && m();
            n(g, g.parent);
            g == r && (r = r.parent);
            t = t.concat(f) } "body" == a && (e = !1) };
        w.onText =
          function(a) { if (!(r._.hasInlineStarted && !u.length || x || B) && (a = CKEDITOR.tools.ltrim(a), 0 === a.length)) return; var b = r.name,
              f = b ? CKEDITOR.dtd[b] || (r._.isBlockLike ? CKEDITOR.dtd.div : CKEDITOR.dtd.span) : c; if (!B && !f["#"] && b in d) w.onTagOpen(g[b] || ""), w.onText(a);
            else { m();
              h();
              x || B || (a = a.replace(/[\t\r\n ]{2,}|[\t\r\n]/g, " "));
              a = new CKEDITOR.htmlParser.text(a); if (p(r, a)) this.onTagOpen(e, {}, 0, 1);
              r.add(a) } };
        w.onCDATA = function(a) { r.add(new CKEDITOR.htmlParser.cdata(a)) };
        w.onComment = function(a) { m();
          h();
          r.add(new CKEDITOR.htmlParser.comment(a)) };
        w.parse(l);
        for (m(); r != v;) n(r, r.parent, 1);
        f(v);
        return v
      };
      CKEDITOR.htmlParser.fragment.prototype = {
        type: CKEDITOR.NODE_DOCUMENT_FRAGMENT,
        add: function(a, b) {
          isNaN(b) && (b = this.children.length);
          var c = 0 < b ? this.children[b - 1] : null;
          if (c) { if (a._.isBlockLike && c.type == CKEDITOR.NODE_TEXT && (c.value = CKEDITOR.tools.rtrim(c.value), 0 === c.value.length)) { this.children.pop();
              this.add(a); return } c.next = a } a.previous = c;
          a.parent = this;
          this.children.splice(b, 0, a);
          this._.hasInlineStarted || (this._.hasInlineStarted = a.type == CKEDITOR.NODE_TEXT ||
            a.type == CKEDITOR.NODE_ELEMENT && !a._.isBlockLike)
        },
        filter: function(a, b) { b = this.getFilterContext(b);
          a.onRoot(b, this);
          this.filterChildren(a, !1, b) },
        filterChildren: function(a, b, c) { if (this.childrenFilteredBy != a.id) { c = this.getFilterContext(c); if (b && !this.parent) a.onRoot(c, this);
            this.childrenFilteredBy = a.id; for (b = 0; b < this.children.length; b++) !1 === this.children[b].filter(a, c) && b-- } },
        writeHtml: function(a, b) { b && this.filter(b);
          this.writeChildrenHtml(a) },
        writeChildrenHtml: function(a, b, c) {
          var g = this.getFilterContext();
          if (c && !this.parent && b) b.onRoot(g, this);
          b && this.filterChildren(b, !1, g);
          b = 0;
          c = this.children;
          for (g = c.length; b < g; b++) c[b].writeHtml(a)
        },
        forEach: function(a, b, c) { if (!(c || b && this.type != b)) var g = a(this); if (!1 !== g) { c = this.children; for (var d = 0; d < c.length; d++) g = c[d], g.type == CKEDITOR.NODE_ELEMENT ? g.forEach(a, b) : b && g.type != b || a(g) } },
        getFilterContext: function(a) { return a || {} }
      }
    }(), "use strict",
    function() {
      function a() { this.rules = [] }

      function d(b, c, g, d) { var k, e; for (k in c)(e = b[k]) || (e = b[k] = new a), e.add(c[k], g, d) } CKEDITOR.htmlParser.filter =
        CKEDITOR.tools.createClass({
          $: function(b) { this.id = CKEDITOR.tools.getNextNumber();
            this.elementNameRules = new a;
            this.attributeNameRules = new a;
            this.elementsRules = {};
            this.attributesRules = {};
            this.textRules = new a;
            this.commentRules = new a;
            this.rootRules = new a;
            b && this.addRules(b, 10) },
          proto: {
            addRules: function(a, c) {
              var g;
              "number" == typeof c ? g = c : c && "priority" in c && (g = c.priority);
              "number" != typeof g && (g = 10);
              "object" != typeof c && (c = {});
              a.elementNames && this.elementNameRules.addMany(a.elementNames, g, c);
              a.attributeNames &&
                this.attributeNameRules.addMany(a.attributeNames, g, c);
              a.elements && d(this.elementsRules, a.elements, g, c);
              a.attributes && d(this.attributesRules, a.attributes, g, c);
              a.text && this.textRules.add(a.text, g, c);
              a.comment && this.commentRules.add(a.comment, g, c);
              a.root && this.rootRules.add(a.root, g, c)
            },
            applyTo: function(a) { a.filter(this) },
            onElementName: function(a, c) { return this.elementNameRules.execOnName(a, c) },
            onAttributeName: function(a, c) { return this.attributeNameRules.execOnName(a, c) },
            onText: function(a, c, g) {
              return this.textRules.exec(a,
                c, g)
            },
            onComment: function(a, c, g) { return this.commentRules.exec(a, c, g) },
            onRoot: function(a, c) { return this.rootRules.exec(a, c) },
            onElement: function(a, c) { for (var g = [this.elementsRules["^"], this.elementsRules[c.name], this.elementsRules.$], d, k = 0; 3 > k; k++)
                if (d = g[k]) { d = d.exec(a, c, this); if (!1 === d) return null; if (d && d != c) return this.onNode(a, d); if (c.parent && !c.name) break }
              return c },
            onNode: function(a, c) {
              var g = c.type;
              return g == CKEDITOR.NODE_ELEMENT ? this.onElement(a, c) : g == CKEDITOR.NODE_TEXT ? new CKEDITOR.htmlParser.text(this.onText(a,
                c.value)) : g == CKEDITOR.NODE_COMMENT ? new CKEDITOR.htmlParser.comment(this.onComment(a, c.value)) : null
            },
            onAttribute: function(a, c, g, d) { return (g = this.attributesRules[g]) ? g.exec(a, d, c, this) : d }
          }
        });
      CKEDITOR.htmlParser.filterRulesGroup = a;
      a.prototype = {
        add: function(a, c, g) { this.rules.splice(this.findIndex(c), 0, { value: a, priority: c, options: g }) },
        addMany: function(a, c, g) { for (var d = [this.findIndex(c), 0], k = 0, e = a.length; k < e; k++) d.push({ value: a[k], priority: c, options: g });
          this.rules.splice.apply(this.rules, d) },
        findIndex: function(a) {
          for (var c =
              this.rules, g = c.length - 1; 0 <= g && a < c[g].priority;) g--;
          return g + 1
        },
        exec: function(a, c) { var g = c instanceof CKEDITOR.htmlParser.node || c instanceof CKEDITOR.htmlParser.fragment,
            d = Array.prototype.slice.call(arguments, 1),
            k = this.rules,
            e = k.length,
            h, m, f, n; for (n = 0; n < e; n++)
            if (g && (h = c.type, m = c.name), f = k[n], !(a.nonEditable && !f.options.applyToAll || a.nestedEditable && f.options.excludeNestedEditable)) { f = f.value.apply(null, d); if (!1 === f || g && f && (f.name != m || f.type != h)) return f;
              null != f && (d[0] = c = f) }
          return c },
        execOnName: function(a,
          c) { for (var g = 0, d = this.rules, k = d.length, e; c && g < k; g++) e = d[g], a.nonEditable && !e.options.applyToAll || a.nestedEditable && e.options.excludeNestedEditable || (c = c.replace(e.value[0], e.value[1])); return c }
      }
    }(),
    function() {
      function a(a, f) {
        function e(a) { return a || CKEDITOR.env.needsNbspFiller ? new CKEDITOR.htmlParser.text(" ") : new CKEDITOR.htmlParser.element("br", { "data-cke-bogus": 1 }) }

        function d(a, f) {
          return function(g) {
            if (g.type != CKEDITOR.NODE_DOCUMENT_FRAGMENT) {
              var d = [],
                m = b(g),
                k, x;
              if (m)
                for (h(m, 1) && d.push(m); m;) l(m) &&
                  (k = c(m)) && h(k) && ((x = c(k)) && !l(x) ? d.push(k) : (e(n).insertAfter(k), k.remove())), m = m.previous;
              for (m = 0; m < d.length; m++) d[m].remove();
              if (d = !a || !1 !== ("function" == typeof f ? f(g) : f)) n || CKEDITOR.env.needsBrFiller || g.type != CKEDITOR.NODE_DOCUMENT_FRAGMENT ? n || CKEDITOR.env.needsBrFiller || !(7 < document.documentMode || g.name in CKEDITOR.dtd.tr || g.name in CKEDITOR.dtd.$listItem) ? (d = b(g), d = !d || "form" == g.name && "input" == d.name) : d = !1 : d = !1;
              d && g.add(e(a))
            }
          }
        }

        function h(a, b) {
          if ((!n || CKEDITOR.env.needsBrFiller) && a.type == CKEDITOR.NODE_ELEMENT &&
            "br" == a.name && !a.attributes["data-cke-eol"]) return !0;
          var c;
          return a.type == CKEDITOR.NODE_TEXT && (c = a.value.match(t)) && (c.index && ((new CKEDITOR.htmlParser.text(a.value.substring(0, c.index))).insertBefore(a), a.value = c[0]), !CKEDITOR.env.needsBrFiller && n && (!b || a.parent.name in E) || !n && ((c = a.previous) && "br" == c.name || !c || l(c))) ? !0 : !1
        }
        var m = { elements: {} },
          n = "html" == f,
          E = CKEDITOR.tools.extend({}, x),
          p;
        for (p in E) "#" in r[p] || delete E[p];
        for (p in E) m.elements[p] = d(n, a.config.fillEmptyBlocks);
        m.root = d(n, !1);
        m.elements.br =
          function(a) { return function(b) { if (b.parent.type != CKEDITOR.NODE_DOCUMENT_FRAGMENT) { var f = b.attributes; if ("data-cke-bogus" in f || "data-cke-eol" in f) delete f["data-cke-bogus"];
                else { for (f = b.next; f && g(f);) f = f.next; var d = c(b);!f && l(b.parent) ? k(b.parent, e(a)) : l(f) && d && !l(d) && e(a).insertBefore(f) } } } }(n);
        return m
      }

      function d(a, b) { return a != CKEDITOR.ENTER_BR && !1 !== b ? a == CKEDITOR.ENTER_DIV ? "div" : "p" : !1 }

      function b(a) { for (a = a.children[a.children.length - 1]; a && g(a);) a = a.previous; return a }

      function c(a) {
        for (a = a.previous; a &&
          g(a);) a = a.previous;
        return a
      }

      function g(a) { return a.type == CKEDITOR.NODE_TEXT && !CKEDITOR.tools.trim(a.value) || a.type == CKEDITOR.NODE_ELEMENT && a.attributes["data-cke-bookmark"] }

      function l(a) { return a && (a.type == CKEDITOR.NODE_ELEMENT && a.name in x || a.type == CKEDITOR.NODE_DOCUMENT_FRAGMENT) }

      function k(a, b) { var c = a.children[a.children.length - 1];
        a.children.push(b);
        b.parent = a;
        c && (c.next = b, b.previous = c) }

      function e(a) {
        a = a.attributes;
        "false" != a.contenteditable && (a["data-cke-editable"] = a.contenteditable ? "true" : 1);
        a.contenteditable = "false"
      }

      function h(a) { a = a.attributes; switch (a["data-cke-editable"]) {
          case "true":
            a.contenteditable = "true"; break;
          case "1":
            delete a.contenteditable } }

      function m(a) { return a.replace(G, function(a, b, c) { return "\x3c" + b + c.replace(D, function(a, b) { return F.test(b) && -1 == c.indexOf("data-cke-saved-" + b) ? " data-cke-saved-" + a + " data-cke-" + CKEDITOR.rnd + "-" + a : a }) + "\x3e" }) }

      function f(a, b) {
        return a.replace(b, function(a, b, c) {
          0 === a.indexOf("\x3ctextarea") && (a = b + q(c).replace(/</g, "\x26lt;").replace(/>/g,
            "\x26gt;") + "\x3c/textarea\x3e");
          return "\x3ccke:encoded\x3e" + encodeURIComponent(a) + "\x3c/cke:encoded\x3e"
        })
      }

      function n(a) { return a.replace(K, function(a, b) { return decodeURIComponent(b) }) }

      function p(a) { return a.replace(/\x3c!--(?!{cke_protected})[\s\S]+?--\x3e/g, function(a) { return "\x3c!--" + u + "{C}" + encodeURIComponent(a).replace(/--/g, "%2D%2D") + "--\x3e" }) }

      function q(a) { return a.replace(/\x3c!--\{cke_protected\}\{C\}([\s\S]+?)--\x3e/g, function(a, b) { return decodeURIComponent(b) }) }

      function w(a, b) {
        var c = b._.dataStore;
        return a.replace(/\x3c!--\{cke_protected\}([\s\S]+?)--\x3e/g, function(a, b) { return decodeURIComponent(b) }).replace(/\{cke_protected_(\d+)\}/g, function(a, b) { return c && c[b] || "" })
      }

      function v(a, b) {
        var c = [],
          f = b.config.protectedSource,
          e = b._.dataStore || (b._.dataStore = { id: 1 }),
          g = /<\!--\{cke_temp(comment)?\}(\d*?)--\x3e/g,
          f = [/<script[\s\S]*?(<\/script>|$)/gi, /<noscript[\s\S]*?<\/noscript>/gi, /<meta[\s\S]*?\/?>/gi].concat(f);
        a = a.replace(/\x3c!--[\s\S]*?--\x3e/g, function(a) {
          return "\x3c!--{cke_tempcomment}" + (c.push(a) -
            1) + "--\x3e"
        });
        for (var d = 0; d < f.length; d++) a = a.replace(f[d], function(a) { a = a.replace(g, function(a, b, f) { return c[f] }); return /cke_temp(comment)?/.test(a) ? a : "\x3c!--{cke_temp}" + (c.push(a) - 1) + "--\x3e" });
        a = a.replace(g, function(a, b, f) { return "\x3c!--" + u + (b ? "{C}" : "") + encodeURIComponent(c[f]).replace(/--/g, "%2D%2D") + "--\x3e" });
        a = a.replace(/<\w+(?:\s+(?:(?:[^\s=>]+\s*=\s*(?:[^'"\s>]+|'[^']*'|"[^"]*"))|[^\s=\/>]+))+\s*\/?>/g, function(a) {
          return a.replace(/\x3c!--\{cke_protected\}([^>]*)--\x3e/g, function(a, b) {
            e[e.id] =
              decodeURIComponent(b);
            return "{cke_protected_" + e.id++ + "}"
          })
        });
        return a = a.replace(/<(title|iframe|textarea)([^>]*)>([\s\S]*?)<\/\1>/g, function(a, c, f, e) { return "\x3c" + c + f + "\x3e" + w(q(e), b) + "\x3c/" + c + "\x3e" })
      }
      CKEDITOR.htmlDataProcessor = function(b) {
        var c, e, g = this;
        this.editor = b;
        this.dataFilter = c = new CKEDITOR.htmlParser.filter;
        this.htmlFilter = e = new CKEDITOR.htmlParser.filter;
        this.writer = new CKEDITOR.htmlParser.basicWriter;
        c.addRules(y);
        c.addRules(C, { applyToAll: !0 });
        c.addRules(a(b, "data"), { applyToAll: !0 });
        e.addRules(z);
        e.addRules(A, { applyToAll: !0 });
        e.addRules(a(b, "html"), { applyToAll: !0 });
        b.on("toHtml", function(a) {
          a = a.data;
          var c = a.dataValue,
            e, c = v(c, b),
            c = f(c, H),
            c = m(c),
            c = f(c, I),
            c = c.replace(J, "$1cke:$2"),
            c = c.replace(R, "\x3ccke:$1$2\x3e\x3c/cke:$1\x3e"),
            c = c.replace(/(<pre\b[^>]*>)(\r\n|\n)/g, "$1$2$2"),
            c = c.replace(/([^a-z0-9<\-])(on\w{3,})(?!>)/gi, "$1data-cke-" + CKEDITOR.rnd + "-$2");
          e = a.context || b.editable().getName();
          var g;
          CKEDITOR.env.ie && 9 > CKEDITOR.env.version && "pre" == e && (e = "div", c = "\x3cpre\x3e" + c + "\x3c/pre\x3e",
            g = 1);
          e = b.document.createElement(e);
          e.setHtml("a" + c);
          c = e.getHtml().substr(1);
          c = c.replace(new RegExp("data-cke-" + CKEDITOR.rnd + "-", "ig"), "");
          g && (c = c.replace(/^<pre>|<\/pre>$/gi, ""));
          c = c.replace(E, "$1$2");
          c = n(c);
          c = q(c);
          e = !1 === a.fixForBody ? !1 : d(a.enterMode, b.config.autoParagraph);
          c = CKEDITOR.htmlParser.fragment.fromHtml(c, a.context, e);
          e && (g = c, !g.children.length && CKEDITOR.dtd[g.name][e] && (e = new CKEDITOR.htmlParser.element(e), g.add(e)));
          a.dataValue = c
        }, null, null, 5);
        b.on("toHtml", function(a) {
          a.data.filter.applyTo(a.data.dataValue, !0, a.data.dontFilter, a.data.enterMode) && b.fire("dataFiltered")
        }, null, null, 6);
        b.on("toHtml", function(a) { a.data.dataValue.filterChildren(g.dataFilter, !0) }, null, null, 10);
        b.on("toHtml", function(a) { a = a.data; var b = a.dataValue,
            c = new CKEDITOR.htmlParser.basicWriter;
          b.writeChildrenHtml(c);
          b = c.getHtml(!0);
          a.dataValue = p(b) }, null, null, 15);
        b.on("toDataFormat", function(a) {
          var c = a.data.dataValue;
          a.data.enterMode != CKEDITOR.ENTER_BR && (c = c.replace(/^<br *\/?>/i, ""));
          a.data.dataValue = CKEDITOR.htmlParser.fragment.fromHtml(c,
            a.data.context, d(a.data.enterMode, b.config.autoParagraph))
        }, null, null, 5);
        b.on("toDataFormat", function(a) { a.data.dataValue.filterChildren(g.htmlFilter, !0) }, null, null, 10);
        b.on("toDataFormat", function(a) { a.data.filter.applyTo(a.data.dataValue, !1, !0) }, null, null, 11);
        b.on("toDataFormat", function(a) { var c = a.data.dataValue,
            f = g.writer;
          f.reset();
          c.writeChildrenHtml(f);
          c = f.getHtml(!0);
          c = q(c);
          c = w(c, b);
          a.data.dataValue = c }, null, null, 15)
      };
      CKEDITOR.htmlDataProcessor.prototype = {
        toHtml: function(a, b, c, f) {
          var e = this.editor,
            g, d, h, m;
          b && "object" == typeof b ? (g = b.context, c = b.fixForBody, f = b.dontFilter, d = b.filter, h = b.enterMode, m = b.protectedWhitespaces) : g = b;
          g || null === g || (g = e.editable().getName());
          return e.fire("toHtml", { dataValue: a, context: g, fixForBody: c, dontFilter: f, filter: d || e.filter, enterMode: h || e.enterMode, protectedWhitespaces: m }).dataValue
        },
        toDataFormat: function(a, b) {
          var c, f, e;
          b && (c = b.context, f = b.filter, e = b.enterMode);
          c || null === c || (c = this.editor.editable().getName());
          return this.editor.fire("toDataFormat", {
            dataValue: a,
            filter: f || this.editor.filter,
            context: c,
            enterMode: e || this.editor.enterMode
          }).dataValue
        }
      };
      var t = /(?:&nbsp;|\xa0)$/,
        u = "{cke_protected}",
        r = CKEDITOR.dtd,
        B = "caption colgroup col thead tfoot tbody".split(" "),
        x = CKEDITOR.tools.extend({}, r.$blockLimit, r.$block),
        y = { elements: { input: e, textarea: e } },
        C = {
          attributeNames: [
            [/^on/, "data-cke-pa-on"],
            [/^srcdoc/, "data-cke-pa-srcdoc"],
            [/^data-cke-expando$/, ""]
          ],
          elements: {
            iframe: function(a) {
              if (a.attributes && a.attributes.src) {
                var b = a.attributes.src.toLowerCase().replace(/[^a-z]/gi,
                  "");
                if (0 === b.indexOf("javascript") || 0 === b.indexOf("data")) a.attributes["data-cke-pa-src"] = a.attributes.src, delete a.attributes.src
              }
            }
          }
        },
        z = { elements: { embed: function(a) { var b = a.parent; if (b && "object" == b.name) { var c = b.attributes.width,
                  b = b.attributes.height;
                c && (a.attributes.width = c);
                b && (a.attributes.height = b) } }, a: function(a) { var b = a.attributes; if (!(a.children.length || b.name || b.id || a.attributes["data-cke-saved-name"])) return !1 } } },
        A = {
          elementNames: [
            [/^cke:/, ""],
            [/^\?xml:namespace$/, ""]
          ],
          attributeNames: [
            [/^data-cke-(saved|pa)-/,
              ""
            ],
            [/^data-cke-.*/, ""],
            ["hidefocus", ""]
          ],
          elements: {
            $: function(a) { var b = a.attributes; if (b) { if (b["data-cke-temp"]) return !1; for (var c = ["name", "href"], f, e = 0; e < c.length; e++) f = "data-cke-saved-" + c[e], f in b && delete b[c[e]] } return a },
            table: function(a) {
              a.children.slice(0).sort(function(a, b) {
                var c, f;
                a.type == CKEDITOR.NODE_ELEMENT && b.type == a.type && (c = CKEDITOR.tools.indexOf(B, a.name), f = CKEDITOR.tools.indexOf(B, b.name)); - 1 < c && -1 < f && c != f || (c = a.parent ? a.getIndex() : -1, f = b.parent ? b.getIndex() : -1);
                return c > f ?
                  1 : -1
              })
            },
            param: function(a) { a.children = [];
              a.isEmpty = !0; return a },
            span: function(a) { "Apple-style-span" == a.attributes["class"] && delete a.name },
            html: function(a) { delete a.attributes.contenteditable;
              delete a.attributes["class"] },
            body: function(a) { delete a.attributes.spellcheck;
              delete a.attributes.contenteditable },
            style: function(a) { var b = a.children[0];
              b && b.value && (b.value = CKEDITOR.tools.trim(b.value));
              a.attributes.type || (a.attributes.type = "text/css") },
            title: function(a) {
              var b = a.children[0];
              !b && k(a, b = new CKEDITOR.htmlParser.text);
              b.value = a.attributes["data-cke-title"] || ""
            },
            input: h,
            textarea: h
          },
          attributes: { "class": function(a) { return CKEDITOR.tools.ltrim(a.replace(/(?:^|\s+)cke_[^\s]*/g, "")) || !1 } }
        };
      CKEDITOR.env.ie && (A.attributes.style = function(a) { return a.replace(/(^|;)([^\:]+)/g, function(a) { return a.toLowerCase() }) });
      var G = /<(a|area|img|input|source)\b([^>]*)>/gi,
        D = /([\w-:]+)\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|(?:[^ "'>]+))/gi,
        F = /^(href|src|name)$/i,
        I = /(?:<style(?=[ >])[^>]*>[\s\S]*?<\/style>)|(?:<(:?link|meta|base)[^>]*>)/gi,
        H = /(<textarea(?=[ >])[^>]*>)([\s\S]*?)(?:<\/textarea>)/gi,
        K = /<cke:encoded>([^<]*)<\/cke:encoded>/gi,
        J = /(<\/?)((?:object|embed|param|html|body|head|title)[^>]*>)/gi,
        E = /(<\/?)cke:((?:html|body|head|title)[^>]*>)/gi,
        R = /<cke:(param|embed)([^>]*?)\/?>(?!\s*<\/cke:\1)/gi
    }(), "use strict", CKEDITOR.htmlParser.element = function(a, d) {
      this.name = a;
      this.attributes = d || {};
      this.children = [];
      var b = a || "",
        c = b.match(/^cke:(.*)/);
      c && (b = c[1]);
      b = !!(CKEDITOR.dtd.$nonBodyContent[b] || CKEDITOR.dtd.$block[b] || CKEDITOR.dtd.$listItem[b] ||
        CKEDITOR.dtd.$tableContent[b] || CKEDITOR.dtd.$nonEditable[b] || "br" == b);
      this.isEmpty = !!CKEDITOR.dtd.$empty[a];
      this.isUnknown = !CKEDITOR.dtd[a];
      this._ = { isBlockLike: b, hasInlineStarted: this.isEmpty || !b }
    }, CKEDITOR.htmlParser.cssStyle = function(a) {
      var d = {};
      ((a instanceof CKEDITOR.htmlParser.element ? a.attributes.style : a) || "").replace(/&quot;/g, '"').replace(/\s*([^ :;]+)\s*:\s*([^;]+)\s*(?=;|$)/g, function(a, c, g) { "font-family" == c && (g = g.replace(/["']/g, ""));
        d[c.toLowerCase()] = g });
      return {
        rules: d,
        populate: function(a) {
          var c =
            this.toString();
          c && (a instanceof CKEDITOR.dom.element ? a.setAttribute("style", c) : a instanceof CKEDITOR.htmlParser.element ? a.attributes.style = c : a.style = c)
        },
        toString: function() { var a = [],
            c; for (c in d) d[c] && a.push(c, ":", d[c], ";"); return a.join("") }
      }
    },
    function() {
      function a(a) { return function(b) { return b.type == CKEDITOR.NODE_ELEMENT && ("string" == typeof a ? b.name == a : b.name in a) } }
      var d = function(a, b) { a = a[0];
          b = b[0]; return a < b ? -1 : a > b ? 1 : 0 },
        b = CKEDITOR.htmlParser.fragment.prototype;
      CKEDITOR.htmlParser.element.prototype =
        CKEDITOR.tools.extend(new CKEDITOR.htmlParser.node, {
          type: CKEDITOR.NODE_ELEMENT,
          add: b.add,
          clone: function() { return new CKEDITOR.htmlParser.element(this.name, this.attributes) },
          filter: function(a, b) {
            var d = this,
              k, e;
            b = d.getFilterContext(b);
            if (b.off) return !0;
            if (!d.parent) a.onRoot(b, d);
            for (;;) {
              k = d.name;
              if (!(e = a.onElementName(b, k))) return this.remove(), !1;
              d.name = e;
              if (!(d = a.onElement(b, d))) return this.remove(), !1;
              if (d !== this) return this.replaceWith(d), !1;
              if (d.name == k) break;
              if (d.type != CKEDITOR.NODE_ELEMENT) return this.replaceWith(d), !1;
              if (!d.name) return this.replaceWithChildren(), !1
            }
            k = d.attributes;
            var h, m;
            for (h in k) { for (e = k[h];;)
                if (m = a.onAttributeName(b, h))
                  if (m != h) delete k[h], h = m;
                  else break;
              else { delete k[h]; break } m && (!1 === (e = a.onAttribute(b, d, m, e)) ? delete k[m] : k[m] = e) } d.isEmpty || this.filterChildren(a, !1, b);
            return !0
          },
          filterChildren: b.filterChildren,
          writeHtml: function(a, b) {
            b && this.filter(b);
            var l = this.name,
              k = [],
              e = this.attributes,
              h, m;
            a.openTag(l, e);
            for (h in e) k.push([h, e[h]]);
            a.sortAttributes && k.sort(d);
            h = 0;
            for (m = k.length; h < m; h++) e =
              k[h], a.attribute(e[0], e[1]);
            a.openTagClose(l, this.isEmpty);
            this.writeChildrenHtml(a);
            this.isEmpty || a.closeTag(l)
          },
          writeChildrenHtml: b.writeChildrenHtml,
          replaceWithChildren: function() { for (var a = this.children, b = a.length; b;) a[--b].insertAfter(this);
            this.remove() },
          forEach: b.forEach,
          getFirst: function(b) { if (!b) return this.children.length ? this.children[0] : null; "function" != typeof b && (b = a(b)); for (var g = 0, d = this.children.length; g < d; ++g)
              if (b(this.children[g])) return this.children[g]; return null },
          getHtml: function() {
            var a =
              new CKEDITOR.htmlParser.basicWriter;
            this.writeChildrenHtml(a);
            return a.getHtml()
          },
          setHtml: function(a) { a = this.children = CKEDITOR.htmlParser.fragment.fromHtml(a).children; for (var b = 0, d = a.length; b < d; ++b) a[b].parent = this },
          getOuterHtml: function() { var a = new CKEDITOR.htmlParser.basicWriter;
            this.writeHtml(a); return a.getHtml() },
          split: function(a) {
            for (var b = this.children.splice(a, this.children.length - a), d = this.clone(), k = 0; k < b.length; ++k) b[k].parent = d;
            d.children = b;
            b[0] && (b[0].previous = null);
            0 < a && (this.children[a -
              1].next = null);
            this.parent.add(d, this.getIndex() + 1);
            return d
          },
          find: function(a, b) { void 0 === b && (b = !1); var d = [],
              k; for (k = 0; k < this.children.length; k++) { var e = this.children[k]; "function" == typeof a && a(e) ? d.push(e) : "string" == typeof a && e.name === a && d.push(e);
              b && e.find && (d = d.concat(e.find(a, b))) } return d },
          addClass: function(a) { if (!this.hasClass(a)) { var b = this.attributes["class"] || "";
              this.attributes["class"] = b + (b ? " " : "") + a } },
          removeClass: function(a) {
            var b = this.attributes["class"];
            b && ((b = CKEDITOR.tools.trim(b.replace(new RegExp("(?:\\s+|^)" +
              a + "(?:\\s+|$)"), " "))) ? this.attributes["class"] = b : delete this.attributes["class"])
          },
          hasClass: function(a) { var b = this.attributes["class"]; return b ? (new RegExp("(?:^|\\s)" + a + "(?\x3d\\s|$)")).test(b) : !1 },
          getFilterContext: function(a) {
            var b = [];
            a || (a = { off: !1, nonEditable: !1, nestedEditable: !1 });
            a.off || "off" != this.attributes["data-cke-processor"] || b.push("off", !0);
            a.nonEditable || "false" != this.attributes.contenteditable ? a.nonEditable && !a.nestedEditable && "true" == this.attributes.contenteditable && b.push("nestedEditable", !0) : b.push("nonEditable", !0);
            if (b.length) { a = CKEDITOR.tools.copy(a); for (var d = 0; d < b.length; d += 2) a[b[d]] = b[d + 1] }
            return a
          }
        }, !0)
    }(),
    function() { var a = /{([^}]+)}/g;
      CKEDITOR.template = function(a) { this.source = String(a) };
      CKEDITOR.template.prototype.output = function(d, b) { var c = this.source.replace(a, function(a, b) { return void 0 !== d[b] ? d[b] : a }); return b ? b.push(c) : c } }(), delete CKEDITOR.loadFullCore, CKEDITOR.instances = {}, CKEDITOR.document = new CKEDITOR.dom.document(document), CKEDITOR.add = function(a) {
      CKEDITOR.instances[a.name] =
        a;
      a.on("focus", function() { CKEDITOR.currentInstance != a && (CKEDITOR.currentInstance = a, CKEDITOR.fire("currentInstance")) });
      a.on("blur", function() { CKEDITOR.currentInstance == a && (CKEDITOR.currentInstance = null, CKEDITOR.fire("currentInstance")) });
      CKEDITOR.fire("instance", null, a)
    }, CKEDITOR.remove = function(a) { delete CKEDITOR.instances[a.name] },
    function() {
      var a = {};
      CKEDITOR.addTemplate = function(d, b) { var c = a[d]; if (c) return c;
        c = { name: d, source: b };
        CKEDITOR.fire("template", c); return a[d] = new CKEDITOR.template(c.source) };
      CKEDITOR.getTemplate = function(d) { return a[d] }
    }(),
    function() { var a = [];
      CKEDITOR.addCss = function(d) { a.push(d) };
      CKEDITOR.getCss = function() { return a.join("\n") } }(), CKEDITOR.on("instanceDestroyed", function() { CKEDITOR.tools.isEmpty(this.instances) && CKEDITOR.fire("reset") }), CKEDITOR.TRISTATE_ON = 1, CKEDITOR.TRISTATE_OFF = 2, CKEDITOR.TRISTATE_DISABLED = 0,
    function() {
      CKEDITOR.inline = function(a, d) {
        if (!CKEDITOR.env.isCompatible) return null;
        a = CKEDITOR.dom.element.get(a);
        if (a.getEditor()) throw 'The editor instance "' +
          a.getEditor().name + '" is already attached to the provided element.';
        var b = new CKEDITOR.editor(d, a, CKEDITOR.ELEMENT_MODE_INLINE),
          c = a.is("textarea") ? a : null;
        c ? (b.setData(c.getValue(), null, !0), a = CKEDITOR.dom.element.createFromHtml('\x3cdiv contenteditable\x3d"' + !!b.readOnly + '" class\x3d"cke_textarea_inline"\x3e' + c.getValue() + "\x3c/div\x3e", CKEDITOR.document), a.insertAfter(c), c.hide(), c.$.form && b._attachToForm()) : b.setData(a.getHtml(), null, !0);
        b.on("loaded", function() {
          b.fire("uiReady");
          b.editable(a);
          b.container =
            a;
          b.ui.contentsElement = a;
          b.setData(b.getData(1));
          b.resetDirty();
          b.fire("contentDom");
          b.mode = "wysiwyg";
          b.fire("mode");
          b.status = "ready";
          b.fireOnce("instanceReady");
          CKEDITOR.fire("instanceReady", null, b)
        }, null, null, 1E4);
        b.on("destroy", function() { c && (b.container.clearCustomData(), b.container.remove(), c.show());
          b.element.clearCustomData();
          delete b.element });
        return b
      };
      CKEDITOR.inlineAll = function() {
        var a, d, b;
        for (b in CKEDITOR.dtd.$editable)
          for (var c = CKEDITOR.document.getElementsByTag(b), g = 0, l = c.count(); g <
            l; g++) a = c.getItem(g), "true" == a.getAttribute("contenteditable") && (d = { element: a, config: {} }, !1 !== CKEDITOR.fire("inline", d) && CKEDITOR.inline(a, d.config))
      };
      CKEDITOR.domReady(function() {!CKEDITOR.disableAutoInline && CKEDITOR.inlineAll() })
    }(), CKEDITOR.replaceClass = "ckeditor",
    function() {
      function a(a, g, l, k) {
        if (!CKEDITOR.env.isCompatible) return null;
        a = CKEDITOR.dom.element.get(a);
        if (a.getEditor()) throw 'The editor instance "' + a.getEditor().name + '" is already attached to the provided element.';
        var e = new CKEDITOR.editor(g,
          a, k);
        k == CKEDITOR.ELEMENT_MODE_REPLACE && (a.setStyle("visibility", "hidden"), e._.required = a.hasAttribute("required"), a.removeAttribute("required"));
        l && e.setData(l, null, !0);
        e.on("loaded", function() { b(e);
          k == CKEDITOR.ELEMENT_MODE_REPLACE && e.config.autoUpdateElement && a.$.form && e._attachToForm();
          e.setMode(e.config.startupMode, function() { e.resetDirty();
            e.status = "ready";
            e.fireOnce("instanceReady");
            CKEDITOR.fire("instanceReady", null, e) }) });
        e.on("destroy", d);
        return e
      }

      function d() {
        var a = this.container,
          b = this.element;
        a && (a.clearCustomData(), a.remove());
        b && (b.clearCustomData(), this.elementMode == CKEDITOR.ELEMENT_MODE_REPLACE && (b.show(), this._.required && b.setAttribute("required", "required")), delete this.element)
      }

      function b(a) {
        var b = a.name,
          d = a.element,
          k = a.elementMode,
          e = a.fire("uiSpace", { space: "top", html: "" }).html,
          h = a.fire("uiSpace", { space: "bottom", html: "" }).html,
          m = new CKEDITOR.template('\x3c{outerEl} id\x3d"cke_{name}" class\x3d"{id} cke cke_reset cke_chrome cke_editor_{name} cke_{langDir} ' + CKEDITOR.env.cssClass +
            '"  dir\x3d"{langDir}" lang\x3d"{langCode}" role\x3d"application"' + (a.title ? ' aria-labelledby\x3d"cke_{name}_arialbl"' : "") + "\x3e" + (a.title ? '\x3cspan id\x3d"cke_{name}_arialbl" class\x3d"cke_voice_label"\x3e{voiceLabel}\x3c/span\x3e' : "") + '\x3c{outerEl} class\x3d"cke_inner cke_reset" role\x3d"presentation"\x3e{topHtml}\x3c{outerEl} id\x3d"{contentId}" class\x3d"cke_contents cke_reset" role\x3d"presentation"\x3e\x3c/{outerEl}\x3e{bottomHtml}\x3c/{outerEl}\x3e\x3c/{outerEl}\x3e'),
          b = CKEDITOR.dom.element.createFromHtml(m.output({
            id: a.id,
            name: b,
            langDir: a.lang.dir,
            langCode: a.langCode,
            voiceLabel: a.title,
            topHtml: e ? '\x3cspan id\x3d"' + a.ui.spaceId("top") + '" class\x3d"cke_top cke_reset_all" role\x3d"presentation" style\x3d"height:auto"\x3e' + e + "\x3c/span\x3e" : "",
            contentId: a.ui.spaceId("contents"),
            bottomHtml: h ? '\x3cspan id\x3d"' + a.ui.spaceId("bottom") + '" class\x3d"cke_bottom cke_reset_all" role\x3d"presentation"\x3e' + h + "\x3c/span\x3e" : "",
            outerEl: CKEDITOR.env.ie ? "span" : "div"
          }));
        k == CKEDITOR.ELEMENT_MODE_REPLACE ? (d.hide(), b.insertAfter(d)) :
          d.append(b);
        a.container = b;
        a.ui.contentsElement = a.ui.space("contents");
        e && a.ui.space("top").unselectable();
        h && a.ui.space("bottom").unselectable();
        d = a.config.width;
        k = a.config.height;
        d && b.setStyle("width", CKEDITOR.tools.cssLength(d));
        k && a.ui.space("contents").setStyle("height", CKEDITOR.tools.cssLength(k));
        b.disableContextMenu();
        CKEDITOR.env.webkit && b.on("focus", function() { a.focus() });
        a.fireOnce("uiReady")
      }
      CKEDITOR.replace = function(b, g) { return a(b, g, null, CKEDITOR.ELEMENT_MODE_REPLACE) };
      CKEDITOR.appendTo =
        function(b, g, d) { return a(b, g, d, CKEDITOR.ELEMENT_MODE_APPENDTO) };
      CKEDITOR.replaceAll = function() { for (var a = document.getElementsByTagName("textarea"), b = 0; b < a.length; b++) { var d = null,
            k = a[b]; if (k.name || k.id) { if ("string" == typeof arguments[0]) { if (!(new RegExp("(?:^|\\s)" + arguments[0] + "(?:$|\\s)")).test(k.className)) continue } else if ("function" == typeof arguments[0] && (d = {}, !1 === arguments[0](k, d))) continue;
            this.replace(k, d) } } };
      CKEDITOR.editor.prototype.addMode = function(a, b) {
        (this._.modes || (this._.modes = {}))[a] =
        b
      };
      CKEDITOR.editor.prototype.setMode = function(a, b) {
        var d = this,
          k = this._.modes;
        if (a != d.mode && k && k[a]) {
          d.fire("beforeSetMode", a);
          if (d.mode) { var e = d.checkDirty(),
              k = d._.previousModeData,
              h, m = 0;
            d.fire("beforeModeUnload");
            d.editable(0);
            d._.previousMode = d.mode;
            d._.previousModeData = h = d.getData(1); "source" == d.mode && k == h && (d.fire("lockSnapshot", { forceUpdate: !0 }), m = 1);
            d.ui.space("contents").setHtml("");
            d.mode = "" } else d._.previousModeData = d.getData(1);
          this._.modes[a](function() {
            d.mode = a;
            void 0 !== e && !e && d.resetDirty();
            m ? d.fire("unlockSnapshot") : "wysiwyg" == a && d.fire("saveSnapshot");
            setTimeout(function() { d.fire("mode");
              b && b.call(d) }, 0)
          })
        }
      };
      CKEDITOR.editor.prototype.resize = function(a, b, d, k) {
        var e = this.container,
          h = this.ui.space("contents"),
          m = CKEDITOR.env.webkit && this.document && this.document.getWindow().$.frameElement;
        k = k ? this.container.getFirst(function(a) { return a.type == CKEDITOR.NODE_ELEMENT && a.hasClass("cke_inner") }) : e;
        k.setSize("width", a, !0);
        m && (m.style.width = "1%");
        var f = (k.$.offsetHeight || 0) - (h.$.clientHeight ||
            0),
          e = Math.max(b - (d ? 0 : f), 0);
        b = d ? b + f : b;
        h.setStyle("height", e + "px");
        m && (m.style.width = "100%");
        this.fire("resize", { outerHeight: b, contentsHeight: e, outerWidth: a || k.getSize("width") })
      };
      CKEDITOR.editor.prototype.getResizable = function(a) { return a ? this.ui.space("contents") : this.container };
      CKEDITOR.domReady(function() { CKEDITOR.replaceClass && CKEDITOR.replaceAll(CKEDITOR.replaceClass) })
    }(), CKEDITOR.config.startupMode = "wysiwyg",
    function() {
      function a(a) {
        var b = a.editor,
          f = a.data.path,
          e = f.blockLimit,
          g = a.data.selection,
          h = g.getRanges()[0],
          m;
        if (CKEDITOR.env.gecko || CKEDITOR.env.ie && CKEDITOR.env.needsBrFiller)
          if (g = d(g, f)) g.appendBogus(), m = CKEDITOR.env.ie;
        k(b, f.block, e) && h.collapsed && !h.getCommonAncestor().isReadOnly() && (f = h.clone(), f.enlarge(CKEDITOR.ENLARGE_BLOCK_CONTENTS), e = new CKEDITOR.dom.walker(f), e.guard = function(a) { return !c(a) || a.type == CKEDITOR.NODE_COMMENT || a.isReadOnly() }, !e.checkForward() || f.checkStartOfBlock() && f.checkEndOfBlock()) && (b = h.fixBlock(!0, b.activeEnterMode == CKEDITOR.ENTER_DIV ? "div" : "p"), CKEDITOR.env.needsBrFiller ||
          (b = b.getFirst(c)) && b.type == CKEDITOR.NODE_TEXT && CKEDITOR.tools.trim(b.getText()).match(/^(?:&nbsp;|\xa0)$/) && b.remove(), m = 1, a.cancel());
        m && h.select()
      }

      function d(a, b) { if (a.isFake) return 0; var f = b.block || b.blockLimit,
          e = f && f.getLast(c); if (!(!f || !f.isBlockBoundary() || e && e.type == CKEDITOR.NODE_ELEMENT && e.isBlockBoundary() || f.is("pre") || f.getBogus())) return f }

      function b(a) { var b = a.data.getTarget();
        b.is("input") && (b = b.getAttribute("type"), "submit" != b && "reset" != b || a.data.preventDefault()) }

      function c(a) {
        return f(a) &&
          n(a)
      }

      function g(a, b) { return function(c) { var f = c.data.$.toElement || c.data.$.fromElement || c.data.$.relatedTarget;
          (f = f && f.nodeType == CKEDITOR.NODE_ELEMENT ? new CKEDITOR.dom.element(f) : null) && (b.equals(f) || b.contains(f)) || a.call(this, c) } }

      function l(a) {
        function b(a) { return function(b, e) { e && b.type == CKEDITOR.NODE_ELEMENT && b.is(g) && (f = b); if (!(e || !c(b) || a && q(b))) return !1 } }
        var f, e = a.getRanges()[0];
        a = a.root;
        var g = { table: 1, ul: 1, ol: 1, dl: 1 };
        if (e.startPath().contains(g)) {
          var d = e.clone();
          d.collapse(1);
          d.setStartAt(a,
            CKEDITOR.POSITION_AFTER_START);
          a = new CKEDITOR.dom.walker(d);
          a.guard = b();
          a.checkBackward();
          if (f) return d = e.clone(), d.collapse(), d.setEndAt(f, CKEDITOR.POSITION_AFTER_END), a = new CKEDITOR.dom.walker(d), a.guard = b(!0), f = !1, a.checkForward(), f
        }
        return null
      }

      function k(a, b, c) { return !1 !== a.config.autoParagraph && a.activeEnterMode != CKEDITOR.ENTER_BR && (a.editable().equals(c) && !b || b && "true" == b.getAttribute("contenteditable")) }

      function e(a) {
        return a.activeEnterMode != CKEDITOR.ENTER_BR && !1 !== a.config.autoParagraph ?
          a.activeEnterMode == CKEDITOR.ENTER_DIV ? "div" : "p" : !1
      }

      function h(a) { var b = a.editor;
        b.getSelection().scrollIntoView();
        setTimeout(function() { b.fire("saveSnapshot") }, 0) }

      function m(a, b, c) { var f = a.getCommonAncestor(b); for (b = a = c ? b : a;
          (a = a.getParent()) && !f.equals(a) && 1 == a.getChildCount();) b = a;
        b.remove() }
      var f, n, p, q, w, v, t, u, r, B;
      CKEDITOR.editable = CKEDITOR.tools.createClass({
        base: CKEDITOR.dom.element,
        $: function(a, b) { this.base(b.$ || b);
          this.editor = a;
          this.status = "unloaded";
          this.hasFocus = !1;
          this.setup() },
        proto: {
          focus: function() {
            var a;
            if (CKEDITOR.env.webkit && !this.hasFocus && (a = this.editor._.previousActive || this.getDocument().getActive(), this.contains(a))) { a.focus(); return } CKEDITOR.env.edge && 14 < CKEDITOR.env.version && !this.hasFocus && this.getDocument().equals(CKEDITOR.document) && (this.editor._.previousScrollTop = this.$.scrollTop);
            try {
              if (!CKEDITOR.env.ie || CKEDITOR.env.edge && 14 < CKEDITOR.env.version || !this.getDocument().equals(CKEDITOR.document))
                if (CKEDITOR.env.chrome) { var b = this.$.scrollTop;
                  this.$.focus();
                  this.$.scrollTop = b } else this.$.focus();
              else this.$.setActive()
            } catch (c) { if (!CKEDITOR.env.ie) throw c; } CKEDITOR.env.safari && !this.isInline() && (a = CKEDITOR.document.getActive(), a.equals(this.getWindow().getFrame()) || this.getWindow().focus())
          },
          on: function(a, b) { var c = Array.prototype.slice.call(arguments, 0);
            CKEDITOR.env.ie && /^focus|blur$/.exec(a) && (a = "focus" == a ? "focusin" : "focusout", b = g(b, this), c[0] = a, c[1] = b); return CKEDITOR.dom.element.prototype.on.apply(this, c) },
          attachListener: function(a) {
            !this._.listeners && (this._.listeners = []);
            var b = Array.prototype.slice.call(arguments,
                1),
              b = a.on.apply(a, b);
            this._.listeners.push(b);
            return b
          },
          clearListeners: function() { var a = this._.listeners; try { for (; a.length;) a.pop().removeListener() } catch (b) {} },
          restoreAttrs: function() { var a = this._.attrChanges,
              b, c; for (c in a) a.hasOwnProperty(c) && (b = a[c], null !== b ? this.setAttribute(c, b) : this.removeAttribute(c)) },
          attachClass: function(a) { var b = this.getCustomData("classes");
            this.hasClass(a) || (!b && (b = []), b.push(a), this.setCustomData("classes", b), this.addClass(a)) },
          changeAttr: function(a, b) {
            var c = this.getAttribute(a);
            b !== c && (!this._.attrChanges && (this._.attrChanges = {}), a in this._.attrChanges || (this._.attrChanges[a] = c), this.setAttribute(a, b))
          },
          insertText: function(a) { this.editor.focus();
            this.insertHtml(this.transformPlainTextToHtml(a), "text") },
          transformPlainTextToHtml: function(a) { var b = this.editor.getSelection().getStartElement().hasAscendant("pre", !0) ? CKEDITOR.ENTER_BR : this.editor.activeEnterMode; return CKEDITOR.tools.transformPlainTextToHtml(a, b) },
          insertHtml: function(a, b, c) {
            var f = this.editor;
            f.focus();
            f.fire("saveSnapshot");
            c || (c = f.getSelection().getRanges()[0]);
            v(this, b || "html", a, c);
            c.select();
            h(this);
            this.editor.fire("afterInsertHtml", {})
          },
          insertHtmlIntoRange: function(a, b, c) { v(this, c || "html", a, b);
            this.editor.fire("afterInsertHtml", { intoRange: b }) },
          insertElement: function(a, b) {
            var f = this.editor;
            f.focus();
            f.fire("saveSnapshot");
            var e = f.activeEnterMode,
              f = f.getSelection(),
              g = a.getName(),
              g = CKEDITOR.dtd.$block[g];
            b || (b = f.getRanges()[0]);
            this.insertElementIntoRange(a, b) && (b.moveToPosition(a, CKEDITOR.POSITION_AFTER_END), g && ((g =
              a.getNext(function(a) { return c(a) && !q(a) })) && g.type == CKEDITOR.NODE_ELEMENT && g.is(CKEDITOR.dtd.$block) ? g.getDtd()["#"] ? b.moveToElementEditStart(g) : b.moveToElementEditEnd(a) : g || e == CKEDITOR.ENTER_BR || (g = b.fixBlock(!0, e == CKEDITOR.ENTER_DIV ? "div" : "p"), b.moveToElementEditStart(g))));
            f.selectRanges([b]);
            h(this)
          },
          insertElementIntoSelection: function(a) { this.insertElement(a) },
          insertElementIntoRange: function(a, b) {
            var c = this.editor,
              f = c.config.enterMode,
              e = a.getName(),
              g = CKEDITOR.dtd.$block[e];
            if (b.checkReadOnly()) return !1;
            b.deleteContents(1);
            b.startContainer.type == CKEDITOR.NODE_ELEMENT && (b.startContainer.is({ tr: 1, table: 1, tbody: 1, thead: 1, tfoot: 1 }) ? t(b) : b.startContainer.is(CKEDITOR.dtd.$list) && u(b));
            var d, h;
            if (g)
              for (;
                (d = b.getCommonAncestor(0, 1)) && (h = CKEDITOR.dtd[d.getName()]) && (!h || !h[e]);) d.getName() in CKEDITOR.dtd.span ? b.splitElement(d) : b.checkStartOfBlock() && b.checkEndOfBlock() ? (b.setStartBefore(d), b.collapse(!0), d.remove()) : b.splitBlock(f == CKEDITOR.ENTER_DIV ? "div" : "p", c.editable());
            b.insertNode(a);
            return !0
          },
          setData: function(a,
            b) { b || (a = this.editor.dataProcessor.toHtml(a));
            this.setHtml(a);
            this.fixInitialSelection(); "unloaded" == this.status && (this.status = "ready");
            this.editor.fire("dataReady") },
          getData: function(a) { var b = this.getHtml();
            a || (b = this.editor.dataProcessor.toDataFormat(b)); return b },
          setReadOnly: function(a) { this.setAttribute("contenteditable", !a) },
          detach: function() { this.removeClass("cke_editable");
            this.status = "detached"; var a = this.editor;
            this._.detach();
            delete a.document;
            delete a.window },
          isInline: function() { return this.getDocument().equals(CKEDITOR.document) },
          fixInitialSelection: function() {
            function a() { var b = c.getDocument().$,
                f = b.getSelection(),
                e;
              a: if (f.anchorNode && f.anchorNode == c.$) e = !0;
                else { if (CKEDITOR.env.webkit && (e = c.getDocument().getActive()) && e.equals(c) && !f.anchorNode) { e = !0; break a } e = void 0 }
              e && (e = new CKEDITOR.dom.range(c), e.moveToElementEditStart(c), b = b.createRange(), b.setStart(e.startContainer.$, e.startOffset), b.collapse(!0), f.removeAllRanges(), f.addRange(b)) }

            function b() {
              var a = c.getDocument().$,
                f = a.selection,
                e = c.getDocument().getActive();
              "None" ==
              f.type && e.equals(c) && (f = new CKEDITOR.dom.range(c), a = a.body.createTextRange(), f.moveToElementEditStart(c), f = f.startContainer, f.type != CKEDITOR.NODE_ELEMENT && (f = f.getParent()), a.moveToElementText(f.$), a.collapse(!0), a.select())
            }
            var c = this;
            if (CKEDITOR.env.ie && (9 > CKEDITOR.env.version || CKEDITOR.env.quirks)) this.hasFocus && (this.focus(), b());
            else if (this.hasFocus) this.focus(), a();
            else this.once("focus", function() { a() }, null, null, -999)
          },
          getHtmlFromRange: function(a) {
            if (a.collapsed) return new CKEDITOR.dom.documentFragment(a.document);
            a = { doc: this.getDocument(), range: a.clone() };
            r.eol.detect(a, this);
            r.bogus.exclude(a);
            r.cell.shrink(a);
            a.fragment = a.range.cloneContents();
            r.tree.rebuild(a, this);
            r.eol.fix(a, this);
            return new CKEDITOR.dom.documentFragment(a.fragment.$)
          },
          extractHtmlFromRange: function(a, b) {
            var c = B,
              f = { range: a, doc: a.document },
              e = this.getHtmlFromRange(a);
            if (a.collapsed) return a.optimize(), e;
            a.enlarge(CKEDITOR.ENLARGE_INLINE, 1);
            c.table.detectPurge(f);
            f.bookmark = a.createBookmark();
            delete f.range;
            var g = this.editor.createRange();
            g.moveToPosition(f.bookmark.startNode, CKEDITOR.POSITION_BEFORE_START);
            f.targetBookmark = g.createBookmark();
            c.list.detectMerge(f, this);
            c.table.detectRanges(f, this);
            c.block.detectMerge(f, this);
            f.tableContentsRanges ? (c.table.deleteRanges(f), a.moveToBookmark(f.bookmark), f.range = a) : (a.moveToBookmark(f.bookmark), f.range = a, a.extractContents(c.detectExtractMerge(f)));
            a.moveToBookmark(f.targetBookmark);
            a.optimize();
            c.fixUneditableRangePosition(a);
            c.list.merge(f, this);
            c.table.purge(f, this);
            c.block.merge(f, this);
            if (b) { c = a.startPath(); if (f = a.checkStartOfBlock() && a.checkEndOfBlock() && c.block && !a.root.equals(c.block)) { a: { var f = c.block.getElementsByTag("span"),
                    g = 0,
                    d; if (f)
                    for (; d = f.getItem(g++);)
                      if (!n(d)) { f = !0; break a }
                  f = !1 } f = !f } f && (a.moveToPosition(c.block, CKEDITOR.POSITION_BEFORE_START), c.block.remove()) } else c.autoParagraph(this.editor, a), p(a.startContainer) && a.startContainer.appendBogus();
            a.startContainer.mergeSiblings();
            return e
          },
          setup: function() {
            var a = this.editor;
            this.attachListener(a, "beforeGetData", function() {
              var b =
                this.getData();
              this.is("textarea") || !1 !== a.config.ignoreEmptyParagraph && (b = b.replace(w, function(a, b) { return b }));
              a.setData(b, null, 1)
            }, this);
            this.attachListener(a, "getSnapshot", function(a) { a.data = this.getData(1) }, this);
            this.attachListener(a, "afterSetData", function() { this.setData(a.getData(1)) }, this);
            this.attachListener(a, "loadSnapshot", function(a) { this.setData(a.data, 1) }, this);
            this.attachListener(a, "beforeFocus", function() { var b = a.getSelection();
                (b = b && b.getNative()) && "Control" == b.type || this.focus() },
              this);
            this.attachListener(a, "insertHtml", function(a) { this.insertHtml(a.data.dataValue, a.data.mode, a.data.range) }, this);
            this.attachListener(a, "insertElement", function(a) { this.insertElement(a.data) }, this);
            this.attachListener(a, "insertText", function(a) { this.insertText(a.data) }, this);
            this.setReadOnly(a.readOnly);
            this.attachClass("cke_editable");
            a.elementMode == CKEDITOR.ELEMENT_MODE_INLINE ? this.attachClass("cke_editable_inline") : a.elementMode != CKEDITOR.ELEMENT_MODE_REPLACE && a.elementMode != CKEDITOR.ELEMENT_MODE_APPENDTO ||
              this.attachClass("cke_editable_themed");
            this.attachClass("cke_contents_" + a.config.contentsLangDirection);
            a.keystrokeHandler.blockedKeystrokes[8] = +a.readOnly;
            a.keystrokeHandler.attach(this);
            this.on("blur", function() { this.hasFocus = !1 }, null, null, -1);
            this.on("focus", function() { this.hasFocus = !0 }, null, null, -1);
            if (CKEDITOR.env.webkit) this.on("scroll", function() { a._.previousScrollTop = a.editable().$.scrollTop }, null, null, -1);
            if (CKEDITOR.env.edge && 14 < CKEDITOR.env.version) {
              var e = function() {
                var b = a.editable();
                null != a._.previousScrollTop && b.getDocument().equals(CKEDITOR.document) && (b.$.scrollTop = a._.previousScrollTop, a._.previousScrollTop = null, this.removeListener("scroll", e))
              };
              this.on("scroll", e)
            }
            a.focusManager.add(this);
            this.equals(CKEDITOR.document.getActive()) && (this.hasFocus = !0, a.once("contentDom", function() { a.focusManager.focus(this) }, this));
            this.isInline() && this.changeAttr("tabindex", a.tabIndex);
            if (!this.is("textarea")) {
              a.document = this.getDocument();
              a.window = this.getWindow();
              var g = a.document;
              this.changeAttr("spellcheck", !a.config.disableNativeSpellChecker);
              var d = a.config.contentsLangDirection;
              this.getDirection(1) != d && this.changeAttr("dir", d);
              var h = CKEDITOR.getCss();
              if (h) { var d = g.getHead(),
                  k = d.getCustomData("stylesheet");
                k ? h != k.getText() && (CKEDITOR.env.ie && 9 > CKEDITOR.env.version ? k.$.styleSheet.cssText = h : k.setText(h)) : (h = g.appendStyleText(h), h = new CKEDITOR.dom.element(h.ownerNode || h.owningElement), d.setCustomData("stylesheet", h), h.data("cke-temp", 1)) } d = g.getCustomData("stylesheet_ref") || 0;
              g.setCustomData("stylesheet_ref",
                d + 1);
              this.setCustomData("cke_includeReadonly", !a.config.disableReadonlyStyling);
              this.attachListener(this, "click", function(a) { a = a.data; var b = (new CKEDITOR.dom.elementPath(a.getTarget(), this)).contains("a");
                b && 2 != a.$.button && b.isReadOnly() && a.preventDefault() });
              var n = { 8: 1, 46: 1 };
              this.attachListener(a, "key", function(b) {
                if (a.readOnly) return !0;
                var c = b.data.domEvent.getKey(),
                  e;
                b = a.getSelection();
                if (0 !== b.getRanges().length) {
                  if (c in n) {
                    var g, d = b.getRanges()[0],
                      h = d.startPath(),
                      m, k, p, c = 8 == c;
                    CKEDITOR.env.ie &&
                      11 > CKEDITOR.env.version && (g = b.getSelectedElement()) || (g = l(b)) ? (a.fire("saveSnapshot"), d.moveToPosition(g, CKEDITOR.POSITION_BEFORE_START), g.remove(), d.select(), a.fire("saveSnapshot"), e = 1) : d.collapsed && ((m = h.block) && (p = m[c ? "getPrevious" : "getNext"](f)) && p.type == CKEDITOR.NODE_ELEMENT && p.is("table") && d[c ? "checkStartOfBlock" : "checkEndOfBlock"]() ? (a.fire("saveSnapshot"), d[c ? "checkEndOfBlock" : "checkStartOfBlock"]() && m.remove(), d["moveToElementEdit" + (c ? "End" : "Start")](p), d.select(), a.fire("saveSnapshot"),
                        e = 1) : h.blockLimit && h.blockLimit.is("td") && (k = h.blockLimit.getAscendant("table")) && d.checkBoundaryOfElement(k, c ? CKEDITOR.START : CKEDITOR.END) && (p = k[c ? "getPrevious" : "getNext"](f)) ? (a.fire("saveSnapshot"), d["moveToElementEdit" + (c ? "End" : "Start")](p), d.checkStartOfBlock() && d.checkEndOfBlock() ? p.remove() : d.select(), a.fire("saveSnapshot"), e = 1) : (k = h.contains(["td", "th", "caption"])) && d.checkBoundaryOfElement(k, c ? CKEDITOR.START : CKEDITOR.END) && (e = 1))
                  }
                  return !e
                }
              });
              a.blockless && CKEDITOR.env.ie && CKEDITOR.env.needsBrFiller &&
                this.attachListener(this, "keyup", function(b) { b.data.getKeystroke() in n && !this.getFirst(c) && (this.appendBogus(), b = a.createRange(), b.moveToPosition(this, CKEDITOR.POSITION_AFTER_START), b.select()) });
              this.attachListener(this, "dblclick", function(b) { if (a.readOnly) return !1;
                b = { element: b.data.getTarget() };
                a.fire("doubleclick", b) });
              CKEDITOR.env.ie && this.attachListener(this, "click", b);
              CKEDITOR.env.ie && !CKEDITOR.env.edge || this.attachListener(this, "mousedown", function(b) {
                var c = b.data.getTarget();
                c.is("img", "hr",
                  "input", "textarea", "select") && !c.isReadOnly() && (a.getSelection().selectElement(c), c.is("input", "textarea", "select") && b.data.preventDefault())
              });
              CKEDITOR.env.edge && this.attachListener(this, "mouseup", function(b) {
                (b = b.data.getTarget()) && b.is("img") && a.getSelection().selectElement(b) });
              CKEDITOR.env.gecko && this.attachListener(this, "mouseup", function(b) { if (2 == b.data.$.button && (b = b.data.getTarget(), !b.getOuterHtml().replace(w, ""))) { var c = a.createRange();
                  c.moveToElementEditStart(b);
                  c.select(!0) } });
              CKEDITOR.env.webkit &&
                (this.attachListener(this, "click", function(a) { a.data.getTarget().is("input", "select") && a.data.preventDefault() }), this.attachListener(this, "mouseup", function(a) { a.data.getTarget().is("input", "textarea") && a.data.preventDefault() }));
              CKEDITOR.env.webkit && this.attachListener(a, "key", function(b) {
                if (a.readOnly) return !0;
                var c = b.data.domEvent.getKey();
                if (c in n && (b = a.getSelection(), 0 !== b.getRanges().length)) {
                  var c = 8 == c,
                    f = b.getRanges()[0];
                  b = f.startPath();
                  if (f.collapsed) a: {
                    var e = b.block;
                    if (e && f[c ? "checkStartOfBlock" :
                        "checkEndOfBlock"]() && f.moveToClosestEditablePosition(e, !c) && f.collapsed) {
                      if (f.startContainer.type == CKEDITOR.NODE_ELEMENT) { var g = f.startContainer.getChild(f.startOffset - (c ? 1 : 0)); if (g && g.type == CKEDITOR.NODE_ELEMENT && g.is("hr")) { a.fire("saveSnapshot");
                          g.remove();
                          b = !0; break a } } f = f.startPath().block;
                      if (!f || f && f.contains(e)) b = void 0;
                      else {
                        a.fire("saveSnapshot");
                        var d;
                        (d = (c ? f : e).getBogus()) && d.remove();
                        d = a.getSelection();
                        g = d.createBookmarks();
                        (c ? e : f).moveChildren(c ? f : e, !1);
                        b.lastElement.mergeSiblings();
                        m(e, f, !c);
                        d.selectBookmarks(g);
                        b = !0
                      }
                    } else b = !1
                  }
                  else c = f, d = b.block, f = c.endPath().block, d && f && !d.equals(f) ? (a.fire("saveSnapshot"), (e = d.getBogus()) && e.remove(), c.enlarge(CKEDITOR.ENLARGE_INLINE), c.deleteContents(), f.getParent() && (f.moveChildren(d, !1), b.lastElement.mergeSiblings(), m(d, f, !0)), c = a.getSelection().getRanges()[0], c.collapse(1), c.optimize(), "" === c.startContainer.getHtml() && c.startContainer.appendBogus(), c.select(), b = !0) : b = !1;
                  if (!b) return;
                  a.getSelection().scrollIntoView();
                  a.fire("saveSnapshot");
                  return !1
                }
              }, this, null, 100)
            }
          }
        },
        _: {
          detach: function() {
            this.editor.setData(this.editor.getData(), 0, 1);
            this.clearListeners();
            this.restoreAttrs();
            var a;
            if (a = this.removeCustomData("classes"))
              for (; a.length;) this.removeClass(a.pop());
            if (!this.is("textarea")) { a = this.getDocument(); var b = a.getHead(); if (b.getCustomData("stylesheet")) { var c = a.getCustomData("stylesheet_ref");--c ? a.setCustomData("stylesheet_ref", c) : (a.removeCustomData("stylesheet_ref"), b.removeCustomData("stylesheet").remove()) } } this.editor.fire("contentDomUnload");
            delete this.editor
          }
        }
      });
      CKEDITOR.editor.prototype.editable = function(a) { var b = this._.editable; if (b && a) return 0;
        arguments.length && (b = this._.editable = a ? a instanceof CKEDITOR.editable ? a : new CKEDITOR.editable(this, a) : (b && b.detach(), null)); return b };
      CKEDITOR.on("instanceLoaded", function(b) {
        var c = b.editor;
        c.on("insertElement", function(a) {
          a = a.data;
          a.type == CKEDITOR.NODE_ELEMENT && (a.is("input") || a.is("textarea")) && ("false" != a.getAttribute("contentEditable") && a.data("cke-editable", a.hasAttribute("contenteditable") ?
            "true" : "1"), a.setAttribute("contentEditable", !1))
        });
        c.on("selectionChange", function(b) { if (!c.readOnly) { var f = c.getSelection();
            f && !f.isLocked && (f = c.checkDirty(), c.fire("lockSnapshot"), a(b), c.fire("unlockSnapshot"), !f && c.resetDirty()) } })
      });
      CKEDITOR.on("instanceCreated", function(a) {
        var b = a.editor;
        b.on("mode", function() {
          var a = b.editable();
          if (a && a.isInline()) {
            var c = b.title;
            a.changeAttr("role", "textbox");
            a.changeAttr("aria-label", c);
            c && a.changeAttr("title", c);
            var f = b.fire("ariaEditorHelpLabel", {}).label;
            if (f && (c = this.ui.space(this.elementMode == CKEDITOR.ELEMENT_MODE_INLINE ? "top" : "contents"))) { var e = CKEDITOR.tools.getNextId(),
                f = CKEDITOR.dom.element.createFromHtml('\x3cspan id\x3d"' + e + '" class\x3d"cke_voice_label"\x3e' + f + "\x3c/span\x3e");
              c.append(f);
              a.changeAttr("aria-describedby", e) }
          }
        })
      });
      CKEDITOR.addCss(".cke_editable{cursor:text}.cke_editable img,.cke_editable input,.cke_editable textarea{cursor:default}");
      f = CKEDITOR.dom.walker.whitespaces(!0);
      n = CKEDITOR.dom.walker.bookmark(!1, !0);
      p = CKEDITOR.dom.walker.empty();
      q = CKEDITOR.dom.walker.bogus();
      w = /(^|<body\b[^>]*>)\s*<(p|div|address|h\d|center|pre)[^>]*>\s*(?:<br[^>]*>|&nbsp;|\u00A0|&#160;)?\s*(:?<\/\2>)?\s*(?=$|<\/body>)/gi;
      v = function() {
        function a(b) { return b.type == CKEDITOR.NODE_ELEMENT }

        function b(c, f) {
          var e, g, d, h, m = [],
            k = f.range.startContainer;
          e = f.range.startPath();
          for (var k = n[k.getName()], l = 0, p = c.getChildren(), t = p.count(), r = -1, u = -1, w = 0, q = e.contains(n.$list); l < t; ++l) e = p.getItem(l), a(e) ? (d = e.getName(), q && d in CKEDITOR.dtd.$list ? m = m.concat(b(e, f)) : (h = !!k[d],
            "br" != d || !e.data("cke-eol") || l && l != t - 1 || (w = (g = l ? m[l - 1].node : p.getItem(l + 1)) && (!a(g) || !g.is("br")), g = g && a(g) && n.$block[g.getName()]), -1 != r || h || (r = l), h || (u = l), m.push({ isElement: 1, isLineBreak: w, isBlock: e.isBlockBoundary(), hasBlockSibling: g, node: e, name: d, allowed: h }), g = w = 0)) : m.push({ isElement: 0, node: e, allowed: 1 }); - 1 < r && (m[r].firstNotAllowed = 1); - 1 < u && (m[u].lastNotAllowed = 1);
          return m
        }

        function f(b, c) {
          var e = [],
            g = b.getChildren(),
            d = g.count(),
            h, m = 0,
            k = n[c],
            l = !b.is(n.$inline) || b.is("br");
          for (l && e.push(" "); m < d; m++) h =
            g.getItem(m), a(h) && !h.is(k) ? e = e.concat(f(h, c)) : e.push(h);
          l && e.push(" ");
          return e
        }

        function g(b) { return a(b.startContainer) && b.startContainer.getChild(b.startOffset - 1) }

        function d(b) { return b && a(b) && (b.is(n.$removeEmpty) || b.is("a") && !b.isBlockBoundary()) }

        function h(b, c, f, e) {
          var g = b.clone(),
            d, m;
          g.setEndAt(c, CKEDITOR.POSITION_BEFORE_END);
          (d = (new CKEDITOR.dom.walker(g)).next()) && a(d) && l[d.getName()] && (m = d.getPrevious()) && a(m) && !m.getParent().equals(b.startContainer) && f.contains(m) && e.contains(d) && d.isIdentical(m) &&
            (d.moveChildren(m), d.remove(), h(b, c, f, e))
        }

        function m(b, c) {
          function f(b, c) { if (c.isBlock && c.isElement && !c.node.is("br") && a(b) && b.is("br")) return b.remove(), 1 } var e = c.endContainer.getChild(c.endOffset),
            g = c.endContainer.getChild(c.endOffset - 1);
          e && f(e, b[b.length - 1]);
          g && f(g, b[0]) && (c.setEnd(c.endContainer, c.endOffset - 1), c.collapse()) }
        var n = CKEDITOR.dtd,
          l = { p: 1, div: 1, h1: 1, h2: 1, h3: 1, h4: 1, h5: 1, h6: 1, ul: 1, ol: 1, li: 1, pre: 1, dl: 1, blockquote: 1 },
          p = { p: 1, div: 1, h1: 1, h2: 1, h3: 1, h4: 1, h5: 1, h6: 1 },
          t = CKEDITOR.tools.extend({},
            n.$inline);
        delete t.br;
        return function(l, E, r, u) {
          var w = l.editor,
            q = !1;
          "unfiltered_html" == E && (E = "html", q = !0);
          if (!u.checkReadOnly()) {
            var B = (new CKEDITOR.dom.elementPath(u.startContainer, u.root)).blockLimit || u.root;
            l = { type: E, dontFilter: q, editable: l, editor: w, range: u, blockLimit: B, mergeCandidates: [], zombies: [] };
            E = l.range;
            u = l.mergeCandidates;
            var v, I;
            "text" == l.type && E.shrink(CKEDITOR.SHRINK_ELEMENT, !0, !1) && (v = CKEDITOR.dom.element.createFromHtml("\x3cspan\x3e\x26nbsp;\x3c/span\x3e", E.document), E.insertNode(v),
              E.setStartAfter(v));
            q = new CKEDITOR.dom.elementPath(E.startContainer);
            l.endPath = B = new CKEDITOR.dom.elementPath(E.endContainer);
            if (!E.collapsed) { var w = B.block || B.blockLimit,
                da = E.getCommonAncestor();
              w && !w.equals(da) && !w.contains(da) && E.checkEndOfBlock() && l.zombies.push(w);
              E.deleteContents() }
            for (;
              (I = g(E)) && a(I) && I.isBlockBoundary() && q.contains(I);) E.moveToPosition(I, CKEDITOR.POSITION_BEFORE_END);
            h(E, l.blockLimit, q, B);
            v && (E.setEndBefore(v), E.collapse(), v.remove());
            v = E.startPath();
            if (w = v.contains(d, !1,
                1)) E.splitElement(w), l.inlineStylesRoot = w, l.inlineStylesPeak = v.lastElement;
            v = E.createBookmark();
            (w = v.startNode.getPrevious(c)) && a(w) && d(w) && u.push(w);
            (w = v.startNode.getNext(c)) && a(w) && d(w) && u.push(w);
            for (w = v.startNode;
              (w = w.getParent()) && d(w);) u.push(w);
            E.moveToBookmark(v);
            if (v = r) {
              v = l.range;
              if ("text" == l.type && l.inlineStylesRoot) { I = l.inlineStylesPeak;
                E = I.getDocument().createText("{cke-peak}"); for (u = l.inlineStylesRoot.getParent(); !I.equals(u);) E = E.appendTo(I.clone()), I = I.getParent();
                r = E.getOuterHtml().split("{cke-peak}").join(r) } I =
                l.blockLimit.getName();
              if (/^\s+|\s+$/.test(r) && "span" in CKEDITOR.dtd[I]) { var P = '\x3cspan data-cke-marker\x3d"1"\x3e\x26nbsp;\x3c/span\x3e';
                r = P + r + P } r = l.editor.dataProcessor.toHtml(r, { context: null, fixForBody: !1, protectedWhitespaces: !!P, dontFilter: l.dontFilter, filter: l.editor.activeFilter, enterMode: l.editor.activeEnterMode });
              I = v.document.createElement("body");
              I.setHtml(r);
              P && (I.getFirst().remove(), I.getLast().remove());
              if ((P = v.startPath().block) && (1 != P.getChildCount() || !P.getBogus())) a: {
                var Q;
                if (1 ==
                  I.getChildCount() && a(Q = I.getFirst()) && Q.is(p) && !Q.hasAttribute("contenteditable")) { P = Q.getElementsByTag("*");
                  v = 0; for (u = P.count(); v < u; v++)
                    if (E = P.getItem(v), !E.is(t)) break a;
                  Q.moveChildren(Q.getParent(1));
                  Q.remove() }
              }
              l.dataWrapper = I;
              v = r
            }
            if (v) {
              Q = l.range;
              v = Q.document;
              var M;
              I = l.blockLimit;
              u = 0;
              var U, P = [],
                T, N;
              r = w = 0;
              var W, aa;
              E = Q.startContainer;
              var q = l.endPath.elements[0],
                ba, B = q.getPosition(E),
                da = !!q.getCommonAncestor(E) && B != CKEDITOR.POSITION_IDENTICAL && !(B & CKEDITOR.POSITION_CONTAINS + CKEDITOR.POSITION_IS_CONTAINED);
              E = b(l.dataWrapper, l);
              for (m(E, Q); u < E.length; u++) {
                B = E[u];
                if (M = B.isLineBreak) { M = Q;
                  W = I; var Y = void 0,
                    ca = void 0;
                  B.hasBlockSibling ? M = 1 : (Y = M.startContainer.getAscendant(n.$block, 1)) && Y.is({ div: 1, p: 1 }) ? (ca = Y.getPosition(W), ca == CKEDITOR.POSITION_IDENTICAL || ca == CKEDITOR.POSITION_CONTAINS ? M = 0 : (W = M.splitElement(Y), M.moveToPosition(W, CKEDITOR.POSITION_AFTER_START), M = 1)) : M = 0 }
                if (M) r = 0 < u;
                else {
                  M = Q.startPath();
                  !B.isBlock && k(l.editor, M.block, M.blockLimit) && (N = e(l.editor)) && (N = v.createElement(N), N.appendBogus(), Q.insertNode(N),
                    CKEDITOR.env.needsBrFiller && (U = N.getBogus()) && U.remove(), Q.moveToPosition(N, CKEDITOR.POSITION_BEFORE_END));
                  if ((M = Q.startPath().block) && !M.equals(T)) { if (U = M.getBogus()) U.remove(), P.push(M);
                    T = M } B.firstNotAllowed && (w = 1);
                  if (w && B.isElement) {
                    M = Q.startContainer;
                    for (W = null; M && !n[M.getName()][B.name];) { if (M.equals(I)) { M = null; break } W = M;
                      M = M.getParent() }
                    if (M) W && (aa = Q.splitElement(W), l.zombies.push(aa), l.zombies.push(W));
                    else {
                      W = I.getName();
                      ba = !u;
                      M = u == E.length - 1;
                      W = f(B.node, W);
                      for (var Y = [], ca = W.length, ea = 0, ia = void 0,
                          ja = 0, fa = -1; ea < ca; ea++) ia = W[ea], " " == ia ? (ja || ba && !ea || (Y.push(new CKEDITOR.dom.text(" ")), fa = Y.length), ja = 1) : (Y.push(ia), ja = 0);
                      M && fa == Y.length && Y.pop();
                      ba = Y
                    }
                  }
                  if (ba) { for (; M = ba.pop();) Q.insertNode(M);
                    ba = 0 } else Q.insertNode(B.node);
                  B.lastNotAllowed && u < E.length - 1 && ((aa = da ? q : aa) && Q.setEndAt(aa, CKEDITOR.POSITION_AFTER_START), w = 0);
                  Q.collapse()
                }
              }
              1 != E.length ? U = !1 : (U = E[0], U = U.isElement && "false" == U.node.getAttribute("contenteditable"));
              U && (r = !0, M = E[0].node, Q.setStartAt(M, CKEDITOR.POSITION_BEFORE_START), Q.setEndAt(M,
                CKEDITOR.POSITION_AFTER_END));
              l.dontMoveCaret = r;
              l.bogusNeededBlocks = P
            }
            U = l.range;
            var ga;
            aa = l.bogusNeededBlocks;
            for (ba = U.createBookmark(); T = l.zombies.pop();) T.getParent() && (N = U.clone(), N.moveToElementEditStart(T), N.removeEmptyBlocksAtEnd());
            if (aa)
              for (; T = aa.pop();) CKEDITOR.env.needsBrFiller ? T.appendBogus() : T.append(U.document.createText(" "));
            for (; T = l.mergeCandidates.pop();) T.mergeSiblings();
            U.moveToBookmark(ba);
            if (!l.dontMoveCaret) {
              for (T = g(U); T && a(T) && !T.is(n.$empty);) {
                if (T.isBlockBoundary()) U.moveToPosition(T,
                  CKEDITOR.POSITION_BEFORE_END);
                else { if (d(T) && T.getHtml().match(/(\s|&nbsp;)$/g)) { ga = null; break } ga = U.clone();
                  ga.moveToPosition(T, CKEDITOR.POSITION_BEFORE_END) } T = T.getLast(c)
              }
              ga && U.moveToRange(ga)
            }
          }
        }
      }();
      t = function() {
        function a(b) { b = new CKEDITOR.dom.walker(b);
          b.guard = function(a, b) { if (b) return !1; if (a.type == CKEDITOR.NODE_ELEMENT) return a.is(CKEDITOR.dtd.$tableContent) };
          b.evaluator = function(a) { return a.type == CKEDITOR.NODE_ELEMENT }; return b }

        function b(a, c, f) {
          c = a.getDocument().createElement(c);
          a.append(c,
            f);
          return c
        }

        function c(a) { var b = a.count(),
            f; for (b; 0 < b--;) f = a.getItem(b), CKEDITOR.tools.trim(f.getHtml()) || (f.appendBogus(), CKEDITOR.env.ie && 9 > CKEDITOR.env.version && f.getChildCount() && f.getFirst().remove()) }
        return function(f) {
          var e = f.startContainer,
            g = e.getAscendant("table", 1),
            d = !1;
          c(g.getElementsByTag("td"));
          c(g.getElementsByTag("th"));
          g = f.clone();
          g.setStart(e, 0);
          g = a(g).lastBackward();
          g || (g = f.clone(), g.setEndAt(e, CKEDITOR.POSITION_BEFORE_END), g = a(g).lastForward(), d = !0);
          g || (g = e);
          g.is("table") ? (f.setStartAt(g,
            CKEDITOR.POSITION_BEFORE_START), f.collapse(!0), g.remove()) : (g.is({ tbody: 1, thead: 1, tfoot: 1 }) && (g = b(g, "tr", d)), g.is("tr") && (g = b(g, g.getParent().is("thead") ? "th" : "td", d)), (e = g.getBogus()) && e.remove(), f.moveToPosition(g, d ? CKEDITOR.POSITION_AFTER_START : CKEDITOR.POSITION_BEFORE_END))
        }
      }();
      u = function() {
        function a(b) {
          b = new CKEDITOR.dom.walker(b);
          b.guard = function(a, b) { if (b) return !1; if (a.type == CKEDITOR.NODE_ELEMENT) return a.is(CKEDITOR.dtd.$list) || a.is(CKEDITOR.dtd.$listItem) };
          b.evaluator = function(a) {
            return a.type ==
              CKEDITOR.NODE_ELEMENT && a.is(CKEDITOR.dtd.$listItem)
          };
          return b
        }
        return function(b) { var c = b.startContainer,
            f = !1,
            e;
          e = b.clone();
          e.setStart(c, 0);
          e = a(e).lastBackward();
          e || (e = b.clone(), e.setEndAt(c, CKEDITOR.POSITION_BEFORE_END), e = a(e).lastForward(), f = !0);
          e || (e = c);
          e.is(CKEDITOR.dtd.$list) ? (b.setStartAt(e, CKEDITOR.POSITION_BEFORE_START), b.collapse(!0), e.remove()) : ((c = e.getBogus()) && c.remove(), b.moveToPosition(e, f ? CKEDITOR.POSITION_AFTER_START : CKEDITOR.POSITION_BEFORE_END), b.select()) }
      }();
      r = {
        eol: {
          detect: function(a,
            b) { var c = a.range,
              f = c.clone(),
              e = c.clone(),
              g = new CKEDITOR.dom.elementPath(c.startContainer, b),
              d = new CKEDITOR.dom.elementPath(c.endContainer, b);
            f.collapse(1);
            e.collapse();
            g.block && f.checkBoundaryOfElement(g.block, CKEDITOR.END) && (c.setStartAfter(g.block), a.prependEolBr = 1);
            d.block && e.checkBoundaryOfElement(d.block, CKEDITOR.START) && (c.setEndBefore(d.block), a.appendEolBr = 1) },
          fix: function(a, b) {
            var c = b.getDocument(),
              f;
            a.appendEolBr && (f = this.createEolBr(c), a.fragment.append(f));
            !a.prependEolBr || f && !f.getPrevious() ||
              a.fragment.append(this.createEolBr(c), 1)
          },
          createEolBr: function(a) { return a.createElement("br", { attributes: { "data-cke-eol": 1 } }) }
        },
        bogus: { exclude: function(a) { var b = a.range.getBoundaryNodes(),
              c = b.startNode,
              b = b.endNode;!b || !q(b) || c && c.equals(b) || a.range.setEndBefore(b) } },
        tree: {
          rebuild: function(a, b) {
            var c = a.range,
              f = c.getCommonAncestor(),
              e = new CKEDITOR.dom.elementPath(f, b),
              g = new CKEDITOR.dom.elementPath(c.startContainer, b),
              c = new CKEDITOR.dom.elementPath(c.endContainer, b),
              d;
            f.type == CKEDITOR.NODE_TEXT && (f =
              f.getParent());
            if (e.blockLimit.is({ tr: 1, table: 1 })) { var h = e.contains("table").getParent();
              d = function(a) { return !a.equals(h) } } else if (e.block && e.block.is(CKEDITOR.dtd.$listItem) && (g = g.contains(CKEDITOR.dtd.$list), c = c.contains(CKEDITOR.dtd.$list), !g.equals(c))) { var m = e.contains(CKEDITOR.dtd.$list).getParent();
              d = function(a) { return !a.equals(m) } } d || (d = function(a) { return !a.equals(e.block) && !a.equals(e.blockLimit) });
            this.rebuildFragment(a, b, f, d)
          },
          rebuildFragment: function(a, b, c, f) {
            for (var e; c && !c.equals(b) &&
              f(c);) e = c.clone(0, 1), a.fragment.appendTo(e), a.fragment = e, c = c.getParent()
          }
        },
        cell: { shrink: function(a) { a = a.range; var b = a.startContainer,
              c = a.endContainer,
              f = a.startOffset,
              e = a.endOffset;
            b.type == CKEDITOR.NODE_ELEMENT && b.equals(c) && b.is("tr") && ++f == e && a.shrink(CKEDITOR.SHRINK_TEXT) } }
      };
      B = function() {
        function a(b, c) { var f = b.getParent(); if (f.is(CKEDITOR.dtd.$inline)) b[c ? "insertBefore" : "insertAfter"](f) }

        function b(c, f, e) { a(f);
          a(e, 1); for (var g; g = e.getNext();) g.insertAfter(f), f = g;
          p(c) && c.remove() }

        function c(a, b) {
          var f =
            new CKEDITOR.dom.range(a);
          f.setStartAfter(b.startNode);
          f.setEndBefore(b.endNode);
          return f
        }
        return {
          list: {
            detectMerge: function(a, b) {
              var f = c(b, a.bookmark),
                e = f.startPath(),
                g = f.endPath(),
                d = e.contains(CKEDITOR.dtd.$list),
                h = g.contains(CKEDITOR.dtd.$list);
              a.mergeList = d && h && d.getParent().equals(h.getParent()) && !d.equals(h);
              a.mergeListItems = e.block && g.block && e.block.is(CKEDITOR.dtd.$listItem) && g.block.is(CKEDITOR.dtd.$listItem);
              if (a.mergeList || a.mergeListItems) f = f.clone(), f.setStartBefore(a.bookmark.startNode),
                f.setEndAfter(a.bookmark.endNode), a.mergeListBookmark = f.createBookmark()
            },
            merge: function(a, c) {
              if (a.mergeListBookmark) {
                var f = a.mergeListBookmark.startNode,
                  e = a.mergeListBookmark.endNode,
                  g = new CKEDITOR.dom.elementPath(f, c),
                  d = new CKEDITOR.dom.elementPath(e, c);
                if (a.mergeList) { var h = g.contains(CKEDITOR.dtd.$list),
                    m = d.contains(CKEDITOR.dtd.$list);
                  h.equals(m) || (m.moveChildren(h), m.remove()) } a.mergeListItems && (g = g.contains(CKEDITOR.dtd.$listItem), d = d.contains(CKEDITOR.dtd.$listItem), g.equals(d) || b(d, f, e));
                f.remove();
                e.remove()
              }
            }
          },
          block: {
            detectMerge: function(a, b) { if (!a.tableContentsRanges && !a.mergeListBookmark) { var c = new CKEDITOR.dom.range(b);
                c.setStartBefore(a.bookmark.startNode);
                c.setEndAfter(a.bookmark.endNode);
                a.mergeBlockBookmark = c.createBookmark() } },
            merge: function(a, c) {
              if (a.mergeBlockBookmark && !a.purgeTableBookmark) {
                var f = a.mergeBlockBookmark.startNode,
                  e = a.mergeBlockBookmark.endNode,
                  g = new CKEDITOR.dom.elementPath(f, c),
                  d = new CKEDITOR.dom.elementPath(e, c),
                  g = g.block,
                  d = d.block;
                g && d && !g.equals(d) &&
                  b(d, f, e);
                f.remove();
                e.remove()
              }
            }
          },
          table: function() {
            function a(c) {
              var e = [],
                g, d = new CKEDITOR.dom.walker(c),
                h = c.startPath().contains(f),
                m = c.endPath().contains(f),
                k = {};
              d.guard = function(a, d) {
                if (a.type == CKEDITOR.NODE_ELEMENT) { var l = "visited_" + (d ? "out" : "in"); if (a.getCustomData(l)) return;
                  CKEDITOR.dom.element.setMarker(k, a, l, 1) }
                if (d && h && a.equals(h)) g = c.clone(), g.setEndAt(h, CKEDITOR.POSITION_BEFORE_END), e.push(g);
                else if (!d && m && a.equals(m)) g = c.clone(), g.setStartAt(m, CKEDITOR.POSITION_AFTER_START), e.push(g);
                else { if (l = !d) l = a.type == CKEDITOR.NODE_ELEMENT && a.is(f) && (!h || b(a, h)) && (!m || b(a, m)); if (!l && (l = d))
                    if (a.is(f)) var l = h && h.getAscendant("table", !0),
                      n = m && m.getAscendant("table", !0),
                      p = a.getAscendant("table", !0),
                      l = l && l.contains(p) || n && n.contains(p);
                    else l = void 0;
                  l && (g = c.clone(), g.selectNodeContents(a), e.push(g)) }
              };
              d.lastForward();
              CKEDITOR.dom.element.clearAllMarkers(k);
              return e
            }

            function b(a, c) {
              var f = CKEDITOR.POSITION_CONTAINS + CKEDITOR.POSITION_IS_CONTAINED,
                e = a.getPosition(c);
              return e === CKEDITOR.POSITION_IDENTICAL ?
                !1 : 0 === (e & f)
            }
            var f = { td: 1, th: 1, caption: 1 };
            return {
              detectPurge: function(a) {
                var b = a.range,
                  c = b.clone();
                c.enlarge(CKEDITOR.ENLARGE_ELEMENT);
                var c = new CKEDITOR.dom.walker(c),
                  e = 0;
                c.evaluator = function(a) { a.type == CKEDITOR.NODE_ELEMENT && a.is(f) && ++e };
                c.checkForward();
                if (1 < e) {
                  var c = b.startPath().contains("table"),
                    g = b.endPath().contains("table");
                  c && g && b.checkBoundaryOfElement(c, CKEDITOR.START) && b.checkBoundaryOfElement(g, CKEDITOR.END) && (b = a.range.clone(), b.setStartBefore(c), b.setEndAfter(g), a.purgeTableBookmark =
                    b.createBookmark())
                }
              },
              detectRanges: function(e, g) {
                var d = c(g, e.bookmark),
                  h = d.clone(),
                  m, k, l = d.getCommonAncestor();
                l.is(CKEDITOR.dtd.$tableContent) && !l.is(f) && (l = l.getAscendant("table", !0));
                k = l;
                l = new CKEDITOR.dom.elementPath(d.startContainer, k);
                k = new CKEDITOR.dom.elementPath(d.endContainer, k);
                l = l.contains("table");
                k = k.contains("table");
                if (l || k) l && k && b(l, k) ? (e.tableSurroundingRange = h, h.setStartAt(l, CKEDITOR.POSITION_AFTER_END), h.setEndAt(k, CKEDITOR.POSITION_BEFORE_START), h = d.clone(), h.setEndAt(l, CKEDITOR.POSITION_AFTER_END),
                  m = d.clone(), m.setStartAt(k, CKEDITOR.POSITION_BEFORE_START), m = a(h).concat(a(m))) : l ? k || (e.tableSurroundingRange = h, h.setStartAt(l, CKEDITOR.POSITION_AFTER_END), d.setEndAt(l, CKEDITOR.POSITION_AFTER_END)) : (e.tableSurroundingRange = h, h.setEndAt(k, CKEDITOR.POSITION_BEFORE_START), d.setStartAt(k, CKEDITOR.POSITION_AFTER_START)), e.tableContentsRanges = m ? m : a(d)
              },
              deleteRanges: function(a) {
                for (var b; b = a.tableContentsRanges.pop();) b.extractContents(), p(b.startContainer) && b.startContainer.appendBogus();
                a.tableSurroundingRange &&
                  a.tableSurroundingRange.extractContents()
              },
              purge: function(a) { if (a.purgeTableBookmark) { var b = a.doc,
                    c = a.range.clone(),
                    b = b.createElement("p");
                  b.insertBefore(a.purgeTableBookmark.startNode);
                  c.moveToBookmark(a.purgeTableBookmark);
                  c.deleteContents();
                  a.range.moveToPosition(b, CKEDITOR.POSITION_AFTER_START) } }
            }
          }(),
          detectExtractMerge: function(a) { return !(a.range.startPath().contains(CKEDITOR.dtd.$listItem) && a.range.endPath().contains(CKEDITOR.dtd.$listItem)) },
          fixUneditableRangePosition: function(a) {
            a.startContainer.getDtd()["#"] ||
              a.moveToClosestEditablePosition(null, !0)
          },
          autoParagraph: function(a, b) { var c = b.startPath(),
              f;
            k(a, c.block, c.blockLimit) && (f = e(a)) && (f = b.document.createElement(f), f.appendBogus(), b.insertNode(f), b.moveToPosition(f, CKEDITOR.POSITION_AFTER_START)) }
        }
      }()
    }(),
    function() {
      function a(a) { return CKEDITOR.plugins.widget && CKEDITOR.plugins.widget.isDomWidget(a) }

      function d(b, c) {
        if (0 === b.length || a(b[0].getEnclosedNode())) return !1;
        var f, e;
        if ((f = !c && 1 === b.length) && !(f = b[0].collapsed)) {
          var g = b[0];
          f = g.startContainer.getAscendant({
            td: 1,
            th: 1
          }, !0);
          var d = g.endContainer.getAscendant({ td: 1, th: 1 }, !0);
          e = CKEDITOR.tools.trim;
          f && f.equals(d) && !f.findOne("td, th, tr, tbody, table") ? (g = g.cloneContents(), f = g.getFirst() ? e(g.getFirst().getText()) !== e(f.getText()) : !0) : f = !1
        }
        if (f) return !1;
        for (e = 0; e < b.length; e++)
          if (f = b[e]._getTableElement(), !f) return !1;
        return !0
      }

      function b(a) {
        function b(a) { a = a.find("td, th"); var c = [],
            f; for (f = 0; f < a.count(); f++) c.push(a.getItem(f)); return c }
        var c = [],
          f, e;
        for (e = 0; e < a.length; e++) f = a[e]._getTableElement(), f.is && f.is({
          td: 1,
          th: 1
        }) ? c.push(f) : c = c.concat(b(f));
        return c
      }

      function c(a) { a = b(a); var c = "",
          f = [],
          e, g; for (g = 0; g < a.length; g++) e && !e.equals(a[g].getAscendant("tr")) ? (c += f.join("\t") + "\n", e = a[g].getAscendant("tr"), f = []) : 0 === g && (e = a[g].getAscendant("tr")), f.push(a[g].getText()); return c += f.join("\t") }

      function g(a) {
        var b = this.root.editor,
          f = b.getSelection(1);
        this.reset();
        x = !0;
        f.root.once("selectionchange", function(a) { a.cancel() }, null, null, 0);
        f.selectRanges([a[0]]);
        f = this._.cache;
        f.ranges = new CKEDITOR.dom.rangeList(a);
        f.type =
          CKEDITOR.SELECTION_TEXT;
        f.selectedElement = a[0]._getTableElement();
        f.selectedText = c(a);
        f.nativeSel = null;
        this.isFake = 1;
        this.rev = u++;
        b._.fakeSelection = this;
        x = !1;
        this.root.fire("selectionchange")
      }

      function l() {
        var b = this._.fakeSelection,
          c;
        if (b) {
          c = this.getSelection(1);
          var f;
          if (!(f = !c) && (f = !c.isHidden())) {
            f = b;
            var e = c.getRanges(),
              g = f.getRanges(),
              h = e.length && e[0]._getTableElement() && e[0]._getTableElement().getAscendant("table", !0),
              m = g.length && g[0]._getTableElement() && g[0]._getTableElement().getAscendant("table", !0),
              k = 1 === e.length && e[0]._getTableElement() && e[0]._getTableElement().is("table"),
              l = 1 === g.length && g[0]._getTableElement() && g[0]._getTableElement().is("table");
            if (a(f.getSelectedElement())) f = !1;
            else { var n = 1 === e.length && e[0].collapsed,
                g = d(e, !!CKEDITOR.env.webkit) && d(g);
              h = h && m ? h.equals(m) || m.contains(h) : !1;
              h && (n || g) ? (k && !l && f.selectRanges(e), f = !0) : f = !1 } f = !f
          }
          f && (b.reset(), b = 0)
        }
        if (!b && (b = c || this.getSelection(1), !b || b.getType() == CKEDITOR.SELECTION_NONE)) return;
        this.fire("selectionCheck", b);
        c = this.elementPath();
        c.compare(this._.selectionPreviousPath) || (f = this._.selectionPreviousPath && this._.selectionPreviousPath.blockLimit.equals(c.blockLimit), CKEDITOR.env.webkit && !f && (this._.previousActive = this.document.getActive()), this._.selectionPreviousPath = c, this.fire("selectionChange", { selection: b, path: c }))
      }

      function k() { C = !0;
        y || (e.call(this), y = CKEDITOR.tools.setTimeout(e, 200, this)) }

      function e() { y = null;
        C && (CKEDITOR.tools.setTimeout(l, 0, this), C = !1) }

      function h(a) {
        return z(a) || a.type == CKEDITOR.NODE_ELEMENT && !a.is(CKEDITOR.dtd.$empty) ?
          !0 : !1
      }

      function m(a) {
        function b(c, f) { return c && c.type != CKEDITOR.NODE_TEXT ? a.clone()["moveToElementEdit" + (f ? "End" : "Start")](c) : !1 } if (!(a.root instanceof CKEDITOR.editable)) return !1; var c = a.startContainer,
          f = a.getPreviousNode(h, null, c),
          e = a.getNextNode(h, null, c); return b(f) || b(e, 1) || !(f || e || c.type == CKEDITOR.NODE_ELEMENT && c.isBlockBoundary() && c.getBogus()) ? !0 : !1 }

      function f(a) { n(a, !1); var b = a.getDocument().createText(r);
        a.setCustomData("cke-fillingChar", b); return b }

      function n(a, b) {
        var c = a && a.removeCustomData("cke-fillingChar");
        if (c) {
          if (!1 !== b) { var f = a.getDocument().getSelection().getNative(),
              e = f && "None" != f.type && f.getRangeAt(0),
              g = r.length; if (c.getLength() > g && e && e.intersectsNode(c.$)) { var d = [{ node: f.anchorNode, offset: f.anchorOffset }, { node: f.focusNode, offset: f.focusOffset }];
              f.anchorNode == c.$ && f.anchorOffset > g && (d[0].offset -= g);
              f.focusNode == c.$ && f.focusOffset > g && (d[1].offset -= g) } } c.setText(p(c.getText(), 1));
          d && (c = a.getDocument().$, f = c.getSelection(), c = c.createRange(), c.setStart(d[0].node, d[0].offset), c.collapse(!0), f.removeAllRanges(),
            f.addRange(c), f.extend(d[1].node, d[1].offset))
        }
      }

      function p(a, b) { return b ? a.replace(B, function(a, b) { return b ? " " : "" }) : a.replace(r, "") }

      function q(a, b) {
        var c = b && CKEDITOR.tools.htmlEncode(b) || "\x26nbsp;",
          c = CKEDITOR.dom.element.createFromHtml('\x3cdiv data-cke-hidden-sel\x3d"1" data-cke-temp\x3d"1" style\x3d"' + (CKEDITOR.env.ie && 14 > CKEDITOR.env.version ? "display:none" : "position:fixed;top:0;left:-1000px") + '"\x3e' + c + "\x3c/div\x3e", a.document);
        a.fire("lockSnapshot");
        a.editable().append(c);
        var f = a.getSelection(1),
          e = a.createRange(),
          g = f.root.on("selectionchange", function(a) { a.cancel() }, null, null, 0);
        e.setStartAt(c, CKEDITOR.POSITION_AFTER_START);
        e.setEndAt(c, CKEDITOR.POSITION_BEFORE_END);
        f.selectRanges([e]);
        g.removeListener();
        a.fire("unlockSnapshot");
        a._.hiddenSelectionContainer = c
      }

      function w(a) {
        var b = { 37: 1, 39: 1, 8: 1, 46: 1 };
        return function(c) {
          var f = c.data.getKeystroke();
          if (b[f]) {
            var e = a.getSelection().getRanges(),
              g = e[0];
            1 == e.length && g.collapsed && (f = g[38 > f ? "getPreviousEditableNode" : "getNextEditableNode"]()) && f.type ==
              CKEDITOR.NODE_ELEMENT && "false" == f.getAttribute("contenteditable") && (a.getSelection().fake(f), c.data.preventDefault(), c.cancel())
          }
        }
      }

      function v(a) {
        for (var b = 0; b < a.length; b++) {
          var c = a[b];
          c.getCommonAncestor().isReadOnly() && a.splice(b, 1);
          if (!c.collapsed) {
            if (c.startContainer.isReadOnly())
              for (var f = c.startContainer, e; f && !((e = f.type == CKEDITOR.NODE_ELEMENT) && f.is("body") || !f.isReadOnly());) e && "false" == f.getAttribute("contentEditable") && c.setStartAfter(f), f = f.getParent();
            f = c.startContainer;
            e = c.endContainer;
            var g = c.startOffset,
              d = c.endOffset,
              h = c.clone();
            f && f.type == CKEDITOR.NODE_TEXT && (g >= f.getLength() ? h.setStartAfter(f) : h.setStartBefore(f));
            e && e.type == CKEDITOR.NODE_TEXT && (d ? h.setEndAfter(e) : h.setEndBefore(e));
            f = new CKEDITOR.dom.walker(h);
            f.evaluator = function(f) { if (f.type == CKEDITOR.NODE_ELEMENT && f.isReadOnly()) { var e = c.clone();
                c.setEndBefore(f);
                c.collapsed && a.splice(b--, 1);
                f.getPosition(h.endContainer) & CKEDITOR.POSITION_CONTAINS || (e.setStartAfter(f), e.collapsed || a.splice(b + 1, 0, e)); return !0 } return !1 };
            f.next()
          }
        }
        return a
      }
      var t = "function" != typeof window.getSelection,
        u = 1,
        r = CKEDITOR.tools.repeat("​", 7),
        B = new RegExp(r + "( )?", "g"),
        x, y, C, z = CKEDITOR.dom.walker.invisible(1),
        A = function() {
          function a(b) { return function(a) { var c = a.editor.createRange();
              c.moveToClosestEditablePosition(a.selected, b) && a.editor.getSelection().selectRanges([c]); return !1 } }

          function b(a) {
            return function(b) {
              var c = b.editor,
                f = c.createRange(),
                e;
              if (!c.readOnly) return (e = f.moveToClosestEditablePosition(b.selected, a)) || (e = f.moveToClosestEditablePosition(b.selected, !a)), e && c.getSelection().selectRanges([f]), c.fire("saveSnapshot"), b.selected.remove(), e || (f.moveToElementEditablePosition(c.editable()), c.getSelection().selectRanges([f])), c.fire("saveSnapshot"), !1
            }
          }
          var c = a(),
            f = a(1);
          return { 37: c, 38: c, 39: f, 40: f, 8: b(), 46: b(1) }
        }();
      CKEDITOR.on("instanceCreated", function(a) {
        function b() { var a = c.getSelection();
          a && a.removeAllRanges() }
        var c = a.editor;
        c.on("contentDom", function() {
          function a() { u = new CKEDITOR.dom.selection(c.getSelection());
            u.lock() }

          function b() {
            g.removeListener("mouseup",
              b);
            m.removeListener("mouseup", b);
            var a = CKEDITOR.document.$.selection,
              c = a.createRange();
            "None" != a.type && c.parentElement() && c.parentElement().ownerDocument == e.$ && c.select()
          }

          function f(a) { if (CKEDITOR.env.ie) { var b = (a = a.getRanges()[0]) ? a.startContainer.getAscendant(function(a) { return a.type == CKEDITOR.NODE_ELEMENT && ("false" == a.getAttribute("contenteditable") || "true" == a.getAttribute("contenteditable")) }, !0) : null; return a && "false" == b.getAttribute("contenteditable") && b } }
          var e = c.document,
            g = CKEDITOR.document,
            d = c.editable(),
            h = e.getBody(),
            m = e.getDocumentElement(),
            p = d.isInline(),
            r, u;
          CKEDITOR.env.gecko && d.attachListener(d, "focus", function(a) { a.removeListener();
            0 !== r && (a = c.getSelection().getNative()) && a.isCollapsed && a.anchorNode == d.$ && (a = c.createRange(), a.moveToElementEditStart(d), a.select()) }, null, null, -2);
          d.attachListener(d, CKEDITOR.env.webkit ? "DOMFocusIn" : "focus", function() {
            r && CKEDITOR.env.webkit && (r = c._.previousActive && c._.previousActive.equals(e.getActive())) && null != c._.previousScrollTop && c._.previousScrollTop !=
              d.$.scrollTop && (d.$.scrollTop = c._.previousScrollTop);
            c.unlockSelection(r);
            r = 0
          }, null, null, -1);
          d.attachListener(d, "mousedown", function() { r = 0 });
          if (CKEDITOR.env.ie || p) t ? d.attachListener(d, "beforedeactivate", a, null, null, -1) : d.attachListener(c, "selectionCheck", a, null, null, -1), d.attachListener(d, CKEDITOR.env.webkit ? "DOMFocusOut" : "blur", function() { c.lockSelection(u);
            r = 1 }, null, null, -1), d.attachListener(d, "mousedown", function() { r = 0 });
          if (CKEDITOR.env.ie && !p) {
            var q;
            d.attachListener(d, "mousedown", function(a) {
              2 ==
                a.data.$.button && ((a = c.document.getSelection()) && a.getType() != CKEDITOR.SELECTION_NONE || (q = c.window.getScrollPosition()))
            });
            d.attachListener(d, "mouseup", function(a) { 2 == a.data.$.button && q && (c.document.$.documentElement.scrollLeft = q.x, c.document.$.documentElement.scrollTop = q.y);
              q = null });
            if ("BackCompat" != e.$.compatMode) {
              if (CKEDITOR.env.ie7Compat || CKEDITOR.env.ie6Compat) {
                var v, y;
                m.on("mousedown", function(a) {
                  function b(a) {
                    a = a.data.$;
                    if (v) {
                      var c = h.$.createTextRange();
                      try { c.moveToPoint(a.clientX, a.clientY) } catch (f) {} v.setEndPoint(0 >
                        y.compareEndPoints("StartToStart", c) ? "EndToEnd" : "StartToStart", c);
                      v.select()
                    }
                  }

                  function c() { m.removeListener("mousemove", b);
                    g.removeListener("mouseup", c);
                    m.removeListener("mouseup", c);
                    v.select() } a = a.data;
                  if (a.getTarget().is("html") && a.$.y < m.$.clientHeight && a.$.x < m.$.clientWidth) { v = h.$.createTextRange(); try { v.moveToPoint(a.$.clientX, a.$.clientY) } catch (f) {} y = v.duplicate();
                    m.on("mousemove", b);
                    g.on("mouseup", c);
                    m.on("mouseup", c) }
                })
              }
              if (7 < CKEDITOR.env.version && 11 > CKEDITOR.env.version) m.on("mousedown", function(a) {
                a.data.getTarget().is("html") &&
                  (g.on("mouseup", b), m.on("mouseup", b))
              })
            }
          }
          d.attachListener(d, "selectionchange", l, c);
          d.attachListener(d, "keyup", k, c);
          d.attachListener(d, "keydown", function(a) { var b = this.getSelection(1);
            f(b) && (b.selectElement(f(b)), a.data.preventDefault()) }, c);
          d.attachListener(d, CKEDITOR.env.webkit ? "DOMFocusIn" : "focus", function() { c.forceNextSelectionCheck();
            c.selectionChange(1) });
          if (p && (CKEDITOR.env.webkit || CKEDITOR.env.gecko)) {
            var B;
            d.attachListener(d, "mousedown", function() { B = 1 });
            d.attachListener(e.getDocumentElement(),
              "mouseup",
              function() { B && k.call(c);
                B = 0 })
          } else d.attachListener(CKEDITOR.env.ie ? d : e.getDocumentElement(), "mouseup", k, c);
          CKEDITOR.env.webkit && d.attachListener(e, "keydown", function(a) { switch (a.data.getKey()) {
              case 13:
              case 33:
              case 34:
              case 35:
              case 36:
              case 37:
              case 39:
              case 8:
              case 45:
              case 46:
                d.hasFocus && n(d) } }, null, null, -1);
          d.attachListener(d, "keydown", w(c), null, null, -1)
        });
        c.on("setData", function() { c.unlockSelection();
          CKEDITOR.env.webkit && b() });
        c.on("contentDomUnload", function() { c.unlockSelection() });
        if (CKEDITOR.env.ie9Compat) c.on("beforeDestroy",
          b, null, null, 9);
        c.on("dataReady", function() { delete c._.fakeSelection;
          delete c._.hiddenSelectionContainer;
          c.selectionChange(1) });
        c.on("loadSnapshot", function() { var a = CKEDITOR.dom.walker.nodeType(CKEDITOR.NODE_ELEMENT),
            b = c.editable().getLast(a);
          b && b.hasAttribute("data-cke-hidden-sel") && (b.remove(), CKEDITOR.env.gecko && (a = c.editable().getFirst(a)) && a.is("br") && a.getAttribute("_moz_editor_bogus_node") && a.remove()) }, null, null, 100);
        c.on("key", function(a) {
          if ("wysiwyg" == c.mode) {
            var b = c.getSelection();
            if (b.isFake) {
              var f =
                A[a.data.keyCode];
              if (f) return f({ editor: c, selected: b.getSelectedElement(), selection: b, keyEvent: a })
            }
          }
        })
      });
      if (CKEDITOR.env.webkit) CKEDITOR.on("instanceReady", function(a) {
        var b = a.editor;
        b.on("selectionChange", function() { var a = b.editable(),
            c = a.getCustomData("cke-fillingChar");
          c && (c.getCustomData("ready") ? (n(a), a.editor.fire("selectionCheck")) : c.setCustomData("ready", 1)) }, null, null, -1);
        b.on("beforeSetMode", function() { n(b.editable()) }, null, null, -1);
        b.on("getSnapshot", function(a) { a.data && (a.data = p(a.data)) },
          b, null, 20);
        b.on("toDataFormat", function(a) { a.data.dataValue = p(a.data.dataValue) }, null, null, 0)
      });
      CKEDITOR.editor.prototype.selectionChange = function(a) {
        (a ? l : k).call(this) };
      CKEDITOR.editor.prototype.getSelection = function(a) { return !this._.savedSelection && !this._.fakeSelection || a ? (a = this.editable()) && "wysiwyg" == this.mode ? new CKEDITOR.dom.selection(a) : null : this._.savedSelection || this._.fakeSelection };
      CKEDITOR.editor.prototype.lockSelection = function(a) {
        a = a || this.getSelection(1);
        return a.getType() != CKEDITOR.SELECTION_NONE ?
          (!a.isLocked && a.lock(), this._.savedSelection = a, !0) : !1
      };
      CKEDITOR.editor.prototype.unlockSelection = function(a) { var b = this._.savedSelection; return b ? (b.unlock(a), delete this._.savedSelection, !0) : !1 };
      CKEDITOR.editor.prototype.forceNextSelectionCheck = function() { delete this._.selectionPreviousPath };
      CKEDITOR.dom.document.prototype.getSelection = function() { return new CKEDITOR.dom.selection(this) };
      CKEDITOR.dom.range.prototype.select = function() {
        var a = this.root instanceof CKEDITOR.editable ? this.root.editor.getSelection() :
          new CKEDITOR.dom.selection(this.root);
        a.selectRanges([this]);
        return a
      };
      CKEDITOR.SELECTION_NONE = 1;
      CKEDITOR.SELECTION_TEXT = 2;
      CKEDITOR.SELECTION_ELEMENT = 3;
      CKEDITOR.dom.selection = function(a) {
        if (a instanceof CKEDITOR.dom.selection) { var b = a;
          a = a.root }
        var c = a instanceof CKEDITOR.dom.element;
        this.rev = b ? b.rev : u++;
        this.document = a instanceof CKEDITOR.dom.document ? a : a.getDocument();
        this.root = c ? a : this.document.getBody();
        this.isLocked = 0;
        this._ = { cache: {} };
        if (b) return CKEDITOR.tools.extend(this._.cache, b._.cache),
          this.isFake = b.isFake, this.isLocked = b.isLocked, this;
        a = this.getNative();
        var f, e;
        if (a)
          if (a.getRangeAt) f = (e = a.rangeCount && a.getRangeAt(0)) && new CKEDITOR.dom.node(e.commonAncestorContainer);
          else { try { e = a.createRange() } catch (g) {} f = e && CKEDITOR.dom.element.get(e.item && e.item(0) || e.parentElement()) }
        if (!f || f.type != CKEDITOR.NODE_ELEMENT && f.type != CKEDITOR.NODE_TEXT || !this.root.equals(f) && !this.root.contains(f)) this._.cache.type = CKEDITOR.SELECTION_NONE, this._.cache.startElement = null, this._.cache.selectedElement =
          null, this._.cache.selectedText = "", this._.cache.ranges = new CKEDITOR.dom.rangeList;
        return this
      };
      var G = { img: 1, hr: 1, li: 1, table: 1, tr: 1, td: 1, th: 1, embed: 1, object: 1, ol: 1, ul: 1, a: 1, input: 1, form: 1, select: 1, textarea: 1, button: 1, fieldset: 1, thead: 1, tfoot: 1 };
      CKEDITOR.tools.extend(CKEDITOR.dom.selection, { _removeFillingCharSequenceString: p, _createFillingCharSequenceNode: f, FILLING_CHAR_SEQUENCE: r });
      CKEDITOR.dom.selection.prototype = {
        getNative: function() {
          return void 0 !== this._.cache.nativeSel ? this._.cache.nativeSel : this._.cache.nativeSel =
            t ? this.document.$.selection : this.document.getWindow().$.getSelection()
        },
        getType: t ? function() { var a = this._.cache; if (a.type) return a.type; var b = CKEDITOR.SELECTION_NONE; try { var c = this.getNative(),
              f = c.type; "Text" == f && (b = CKEDITOR.SELECTION_TEXT); "Control" == f && (b = CKEDITOR.SELECTION_ELEMENT);
            c.createRange().parentElement() && (b = CKEDITOR.SELECTION_TEXT) } catch (e) {} return a.type = b } : function() {
          var a = this._.cache;
          if (a.type) return a.type;
          var b = CKEDITOR.SELECTION_TEXT,
            c = this.getNative();
          if (!c || !c.rangeCount) b = CKEDITOR.SELECTION_NONE;
          else if (1 == c.rangeCount) { var c = c.getRangeAt(0),
              f = c.startContainer;
            f == c.endContainer && 1 == f.nodeType && 1 == c.endOffset - c.startOffset && G[f.childNodes[c.startOffset].nodeName.toLowerCase()] && (b = CKEDITOR.SELECTION_ELEMENT) }
          return a.type = b
        },
        getRanges: function() {
          var a = t ? function() {
            function a(b) { return (new CKEDITOR.dom.node(b)).getIndex() }
            var b = function(b, c) {
              b = b.duplicate();
              b.collapse(c);
              var f = b.parentElement();
              if (!f.hasChildNodes()) return { container: f, offset: 0 };
              for (var e = f.children, g, d, h = b.duplicate(), m = 0,
                  k = e.length - 1, l = -1, n, p; m <= k;)
                if (l = Math.floor((m + k) / 2), g = e[l], h.moveToElementText(g), n = h.compareEndPoints("StartToStart", b), 0 < n) k = l - 1;
                else if (0 > n) m = l + 1;
              else return { container: f, offset: a(g) };
              if (-1 == l || l == e.length - 1 && 0 > n) {
                h.moveToElementText(f);
                h.setEndPoint("StartToStart", b);
                h = h.text.replace(/(\r\n|\r)/g, "\n").length;
                e = f.childNodes;
                if (!h) return g = e[e.length - 1], g.nodeType != CKEDITOR.NODE_TEXT ? { container: f, offset: e.length } : { container: g, offset: g.nodeValue.length };
                for (f = e.length; 0 < h && 0 < f;) d = e[--f], d.nodeType ==
                  CKEDITOR.NODE_TEXT && (p = d, h -= d.nodeValue.length);
                return { container: p, offset: -h }
              }
              h.collapse(0 < n ? !0 : !1);
              h.setEndPoint(0 < n ? "StartToStart" : "EndToStart", b);
              h = h.text.replace(/(\r\n|\r)/g, "\n").length;
              if (!h) return { container: f, offset: a(g) + (0 < n ? 0 : 1) };
              for (; 0 < h;) try { d = g[0 < n ? "previousSibling" : "nextSibling"], d.nodeType == CKEDITOR.NODE_TEXT && (h -= d.nodeValue.length, p = d), g = d } catch (t) { return { container: f, offset: a(g) } }
              return { container: p, offset: 0 < n ? -h : p.nodeValue.length + h }
            };
            return function() {
              var a = this.getNative(),
                c = a &&
                a.createRange(),
                f = this.getType();
              if (!a) return [];
              if (f == CKEDITOR.SELECTION_TEXT) return a = new CKEDITOR.dom.range(this.root), f = b(c, !0), a.setStart(new CKEDITOR.dom.node(f.container), f.offset), f = b(c), a.setEnd(new CKEDITOR.dom.node(f.container), f.offset), a.endContainer.getPosition(a.startContainer) & CKEDITOR.POSITION_PRECEDING && a.endOffset <= a.startContainer.getIndex() && a.collapse(), [a];
              if (f == CKEDITOR.SELECTION_ELEMENT) {
                for (var f = [], e = 0; e < c.length; e++) {
                  for (var g = c.item(e), d = g.parentNode, h = 0, a = new CKEDITOR.dom.range(this.root); h <
                    d.childNodes.length && d.childNodes[h] != g; h++);
                  a.setStart(new CKEDITOR.dom.node(d), h);
                  a.setEnd(new CKEDITOR.dom.node(d), h + 1);
                  f.push(a)
                }
                return f
              }
              return []
            }
          }() : function() { var a = [],
              b, c = this.getNative(); if (!c) return a; for (var f = 0; f < c.rangeCount; f++) { var e = c.getRangeAt(f);
              b = new CKEDITOR.dom.range(this.root);
              b.setStart(new CKEDITOR.dom.node(e.startContainer), e.startOffset);
              b.setEnd(new CKEDITOR.dom.node(e.endContainer), e.endOffset);
              a.push(b) } return a };
          return function(b) {
            var c = this._.cache,
              f = c.ranges;
            f || (c.ranges =
              f = new CKEDITOR.dom.rangeList(a.call(this)));
            return b ? v(new CKEDITOR.dom.rangeList(f.slice())) : f
          }
        }(),
        getStartElement: function() {
          var a = this._.cache;
          if (void 0 !== a.startElement) return a.startElement;
          var b;
          switch (this.getType()) {
            case CKEDITOR.SELECTION_ELEMENT:
              return this.getSelectedElement();
            case CKEDITOR.SELECTION_TEXT:
              var c = this.getRanges()[0];
              if (c) {
                if (c.collapsed) b = c.startContainer, b.type != CKEDITOR.NODE_ELEMENT && (b = b.getParent());
                else {
                  for (c.optimize(); b = c.startContainer, c.startOffset == (b.getChildCount ?
                      b.getChildCount() : b.getLength()) && !b.isBlockBoundary();) c.setStartAfter(b);
                  b = c.startContainer;
                  if (b.type != CKEDITOR.NODE_ELEMENT) return b.getParent();
                  if ((b = b.getChild(c.startOffset)) && b.type == CKEDITOR.NODE_ELEMENT)
                    for (c = b.getFirst(); c && c.type == CKEDITOR.NODE_ELEMENT;) b = c, c = c.getFirst();
                  else b = c.startContainer
                }
                b = b.$
              }
          }
          return a.startElement = b ? new CKEDITOR.dom.element(b) : null
        },
        getSelectedElement: function() {
          var a = this._.cache;
          if (void 0 !== a.selectedElement) return a.selectedElement;
          var b = this,
            c = CKEDITOR.tools.tryThese(function() { return b.getNative().createRange().item(0) },
              function() { for (var a = b.getRanges()[0].clone(), c, f, e = 2; e && !((c = a.getEnclosedNode()) && c.type == CKEDITOR.NODE_ELEMENT && G[c.getName()] && (f = c)); e--) a.shrink(CKEDITOR.SHRINK_ELEMENT); return f && f.$ });
          return a.selectedElement = c ? new CKEDITOR.dom.element(c) : null
        },
        getSelectedText: function() { var a = this._.cache; if (void 0 !== a.selectedText) return a.selectedText; var b = this.getNative(),
            b = t ? "Control" == b.type ? "" : b.createRange().text : b.toString(); return a.selectedText = b },
        lock: function() {
          this.getRanges();
          this.getStartElement();
          this.getSelectedElement();
          this.getSelectedText();
          this._.cache.nativeSel = null;
          this.isLocked = 1
        },
        unlock: function(a) { if (this.isLocked) { if (a) var b = this.getSelectedElement(),
              c = this.getRanges(),
              f = this.isFake;
            this.isLocked = 0;
            this.reset();
            a && (a = b || c[0] && c[0].getCommonAncestor()) && a.getAscendant("body", 1) && (d(c) ? g.call(this, c) : f ? this.fake(b) : b ? this.selectElement(b) : this.selectRanges(c)) } },
        reset: function() {
          this._.cache = {};
          this.isFake = 0;
          var a = this.root.editor;
          if (a && a._.fakeSelection)
            if (this.rev == a._.fakeSelection.rev) {
              delete a._.fakeSelection;
              var b = a._.hiddenSelectionContainer;
              if (b) { var c = a.checkDirty();
                a.fire("lockSnapshot");
                b.remove();
                a.fire("unlockSnapshot");!c && a.resetDirty() } delete a._.hiddenSelectionContainer
            } else CKEDITOR.warn("selection-fake-reset");
          this.rev = u++
        },
        selectElement: function(a) { var b = new CKEDITOR.dom.range(this.root);
          b.setStartBefore(a);
          b.setEndAfter(a);
          this.selectRanges([b]) },
        selectRanges: function(a) {
          var b = this.root.editor,
            c = b && b._.hiddenSelectionContainer;
          this.reset();
          if (c)
            for (var c = this.root, e, h = 0; h < a.length; ++h) e =
              a[h], e.endContainer.equals(c) && (e.endOffset = Math.min(e.endOffset, c.getChildCount()));
          if (a.length)
            if (this.isLocked) { var k = CKEDITOR.document.getActive();
              this.unlock();
              this.selectRanges(a);
              this.lock();
              k && !k.equals(this.root) && k.focus() } else {
              var l;
              a: {
                var p, r;
                if (1 == a.length && !(r = a[0]).collapsed && (l = r.getEnclosedNode()) && l.type == CKEDITOR.NODE_ELEMENT && (r = r.clone(), r.shrink(CKEDITOR.SHRINK_ELEMENT, !0), (p = r.getEnclosedNode()) && p.type == CKEDITOR.NODE_ELEMENT && (l = p), "false" == l.getAttribute("contenteditable"))) break a;
                l = void 0
              }
              if (l) this.fake(l);
              else if (b && b.plugins.tableselection && CKEDITOR.plugins.tableselection.isSupportedEnvironment && d(a) && !x) g.call(this, a);
              else {
                if (t) {
                  p = CKEDITOR.dom.walker.whitespaces(!0);
                  l = /\ufeff|\u00a0/;
                  r = { table: 1, tbody: 1, tr: 1 };
                  1 < a.length && (b = a[a.length - 1], a[0].setEnd(b.endContainer, b.endOffset));
                  b = a[0];
                  a = b.collapsed;
                  var u, w, q;
                  if ((c = b.getEnclosedNode()) && c.type == CKEDITOR.NODE_ELEMENT && c.getName() in G && (!c.is("a") || !c.getText())) try { q = c.$.createControlRange();
                    q.addElement(c.$);
                    q.select(); return } catch (v) {}
                  if (b.startContainer.type ==
                    CKEDITOR.NODE_ELEMENT && b.startContainer.getName() in r || b.endContainer.type == CKEDITOR.NODE_ELEMENT && b.endContainer.getName() in r) b.shrink(CKEDITOR.NODE_ELEMENT, !0), a = b.collapsed;
                  q = b.createBookmark();
                  r = q.startNode;
                  a || (k = q.endNode);
                  q = b.document.$.body.createTextRange();
                  q.moveToElementText(r.$);
                  q.moveStart("character", 1);
                  k ? (l = b.document.$.body.createTextRange(), l.moveToElementText(k.$), q.setEndPoint("EndToEnd", l), q.moveEnd("character", -1)) : (u = r.getNext(p), w = r.hasAscendant("pre"), u = !(u && u.getText && u.getText().match(l)) &&
                    (w || !r.hasPrevious() || r.getPrevious().is && r.getPrevious().is("br")), w = b.document.createElement("span"), w.setHtml("\x26#65279;"), w.insertBefore(r), u && b.document.createText("﻿").insertBefore(r));
                  b.setStartBefore(r);
                  r.remove();
                  a ? (u ? (q.moveStart("character", -1), q.select(), b.document.$.selection.clear()) : q.select(), b.moveToPosition(w, CKEDITOR.POSITION_BEFORE_START), w.remove()) : (b.setEndBefore(k), k.remove(), q.select())
                } else {
                  k = this.getNative();
                  if (!k) return;
                  this.removeAllRanges();
                  for (q = 0; q < a.length; q++) {
                    if (q <
                      a.length - 1 && (u = a[q], w = a[q + 1], l = u.clone(), l.setStart(u.endContainer, u.endOffset), l.setEnd(w.startContainer, w.startOffset), !l.collapsed && (l.shrink(CKEDITOR.NODE_ELEMENT, !0), b = l.getCommonAncestor(), l = l.getEnclosedNode(), b.isReadOnly() || l && l.isReadOnly()))) { w.setStart(u.startContainer, u.startOffset);
                      a.splice(q--, 1); continue } b = a[q];
                    w = this.document.$.createRange();
                    b.collapsed && CKEDITOR.env.webkit && m(b) && (l = f(this.root), b.insertNode(l), (u = l.getNext()) && !l.getPrevious() && u.type == CKEDITOR.NODE_ELEMENT && "br" ==
                      u.getName() ? (n(this.root), b.moveToPosition(u, CKEDITOR.POSITION_BEFORE_START)) : b.moveToPosition(l, CKEDITOR.POSITION_AFTER_END));
                    w.setStart(b.startContainer.$, b.startOffset);
                    try { w.setEnd(b.endContainer.$, b.endOffset) } catch (B) { if (0 <= B.toString().indexOf("NS_ERROR_ILLEGAL_VALUE")) b.collapse(1), w.setEnd(b.endContainer.$, b.endOffset);
                      else throw B; } k.addRange(w)
                  }
                }
                this.reset();
                this.root.fire("selectionchange")
              }
            }
        },
        fake: function(a, b) {
          var c = this.root.editor;
          void 0 === b && a.hasAttribute("aria-label") && (b = a.getAttribute("aria-label"));
          this.reset();
          q(c, b);
          var f = this._.cache,
            e = new CKEDITOR.dom.range(this.root);
          e.setStartBefore(a);
          e.setEndAfter(a);
          f.ranges = new CKEDITOR.dom.rangeList(e);
          f.selectedElement = f.startElement = a;
          f.type = CKEDITOR.SELECTION_ELEMENT;
          f.selectedText = f.nativeSel = null;
          this.isFake = 1;
          this.rev = u++;
          c._.fakeSelection = this;
          this.root.fire("selectionchange")
        },
        isHidden: function() { var a = this.getCommonAncestor();
          a && a.type == CKEDITOR.NODE_TEXT && (a = a.getParent()); return !(!a || !a.data("cke-hidden-sel")) },
        isInTable: function(a) {
          return d(this.getRanges(),
            a)
        },
        isCollapsed: function() { var a = this.getRanges(); return 1 === a.length && a[0].collapsed },
        createBookmarks: function(a) { a = this.getRanges().createBookmarks(a);
          this.isFake && (a.isFake = 1); return a },
        createBookmarks2: function(a) { a = this.getRanges().createBookmarks2(a);
          this.isFake && (a.isFake = 1); return a },
        selectBookmarks: function(a) {
          for (var b = [], c, f = 0; f < a.length; f++) { var e = new CKEDITOR.dom.range(this.root);
            e.moveToBookmark(a[f]);
            b.push(e) } a.isFake && (c = d(b) ? b[0]._getTableElement() : b[0].getEnclosedNode(), c && c.type ==
            CKEDITOR.NODE_ELEMENT || (CKEDITOR.warn("selection-not-fake"), a.isFake = 0));
          a.isFake && !d(b) ? this.fake(c) : this.selectRanges(b);
          return this
        },
        getCommonAncestor: function() { var a = this.getRanges(); return a.length ? a[0].startContainer.getCommonAncestor(a[a.length - 1].endContainer) : null },
        scrollIntoView: function() { this.type != CKEDITOR.SELECTION_NONE && this.getRanges()[0].scrollIntoView() },
        removeAllRanges: function() { if (this.getType() != CKEDITOR.SELECTION_NONE) { var a = this.getNative(); try { a && a[t ? "empty" : "removeAllRanges"]() } catch (b) {} this.reset() } }
      }
    }(),
    "use strict", CKEDITOR.STYLE_BLOCK = 1, CKEDITOR.STYLE_INLINE = 2, CKEDITOR.STYLE_OBJECT = 3,
    function() {
      function a(a, b) { for (var c, f;
          (a = a.getParent()) && !a.equals(b);)
          if (a.getAttribute("data-nostyle")) c = a;
          else if (!f) { var e = a.getAttribute("contentEditable"); "false" == e ? c = a : "true" == e && (f = 1) } return c }

      function d(a, b, c, f) { return (a.getPosition(b) | f) == f && (!c.childRule || c.childRule(a)) }

      function b(c) {
        var f = c.document;
        if (c.collapsed) f = u(this, f), c.insertNode(f), c.moveToPosition(f, CKEDITOR.POSITION_BEFORE_END);
        else {
          var e =
            this.element,
            h = this._.definition,
            m, k = h.ignoreReadonly,
            l = k || h.includeReadonly;
          null == l && (l = c.root.getCustomData("cke_includeReadonly"));
          var n = CKEDITOR.dtd[e];
          n || (m = !0, n = CKEDITOR.dtd.span);
          c.enlarge(CKEDITOR.ENLARGE_INLINE, 1);
          c.trim();
          var p = c.createBookmark(),
            r = p.startNode,
            t = p.endNode,
            q = r,
            v;
          if (!k) { var B = c.getCommonAncestor(),
              k = a(r, B),
              B = a(t, B);
            k && (q = k.getNextSourceNode(!0));
            B && (t = B) }
          for (q.getPosition(t) == CKEDITOR.POSITION_FOLLOWING && (q = 0); q;) {
            k = !1;
            if (q.equals(t)) q = null, k = !0;
            else {
              var y = q.type == CKEDITOR.NODE_ELEMENT ?
                q.getName() : null,
                B = y && "false" == q.getAttribute("contentEditable"),
                x = y && q.getAttribute("data-nostyle");
              if (y && q.data("cke-bookmark")) { q = q.getNextSourceNode(!0); continue }
              if (B && l && CKEDITOR.dtd.$block[y])
                for (var z = q, A = g(z), C = void 0, G = A.length, ea = 0, z = G && new CKEDITOR.dom.range(z.getDocument()); ea < G; ++ea) { var C = A[ea],
                    D = CKEDITOR.filter.instances[C.data("cke-filter")]; if (D ? D.check(this) : 1) z.selectNodeContents(C), b.call(this, z) } A = y ? !n[y] || x ? 0 : B && !l ? 0 : d(q, t, h, K) : 1;
              if (A)
                if (C = q.getParent(), A = h, G = e, ea = m, !C || !(C.getDtd() ||
                    CKEDITOR.dtd.span)[G] && !ea || A.parentRule && !A.parentRule(C)) k = !0;
                else { if (v || y && CKEDITOR.dtd.$removeEmpty[y] && (q.getPosition(t) | K) != K || (v = c.clone(), v.setStartBefore(q)), y = q.type, y == CKEDITOR.NODE_TEXT || B || y == CKEDITOR.NODE_ELEMENT && !q.getChildCount()) { for (var y = q, F;
                      (k = !y.getNext(I)) && (F = y.getParent(), n[F.getName()]) && d(F, r, h, J);) y = F;
                    v.setEndAfter(y) } }
              else k = !0;
              q = q.getNextSourceNode(x || B)
            }
            if (k && v && !v.collapsed) {
              for (var k = u(this, f), B = k.hasAttributes(), x = v.getCommonAncestor(), y = {}, A = {}, C = {}, G = {}, fa, H, ha; k &&
                x;) { if (x.getName() == e) { for (fa in h.attributes) !G[fa] && (ha = x.getAttribute(H)) && (k.getAttribute(fa) == ha ? A[fa] = 1 : G[fa] = 1); for (H in h.styles) !C[H] && (ha = x.getStyle(H)) && (k.getStyle(H) == ha ? y[H] = 1 : C[H] = 1) } x = x.getParent() }
              for (fa in A) k.removeAttribute(fa);
              for (H in y) k.removeStyle(H);
              B && !k.hasAttributes() && (k = null);
              k ? (v.extractContents().appendTo(k), v.insertNode(k), w.call(this, k), k.mergeSiblings(), CKEDITOR.env.ie || k.$.normalize()) : (k = new CKEDITOR.dom.element("span"), v.extractContents().appendTo(k), v.insertNode(k),
                w.call(this, k), k.remove(!0));
              v = null
            }
          }
          c.moveToBookmark(p);
          c.shrink(CKEDITOR.SHRINK_TEXT);
          c.shrink(CKEDITOR.NODE_ELEMENT, !0)
        }
      }

      function c(a) {
        function b() {
          for (var a = new CKEDITOR.dom.elementPath(f.getParent()), c = new CKEDITOR.dom.elementPath(l.getParent()), e = null, g = null, d = 0; d < a.elements.length; d++) { var h = a.elements[d]; if (h == a.block || h == a.blockLimit) break;
            n.checkElementRemovable(h, !0) && (e = h) }
          for (d = 0; d < c.elements.length; d++) {
            h = c.elements[d];
            if (h == c.block || h == c.blockLimit) break;
            n.checkElementRemovable(h, !0) &&
              (g = h)
          }
          g && l.breakParent(g);
          e && f.breakParent(e)
        }
        a.enlarge(CKEDITOR.ENLARGE_INLINE, 1);
        var c = a.createBookmark(),
          f = c.startNode,
          e = this._.definition.alwaysRemoveElement;
        if (a.collapsed) {
          for (var g = new CKEDITOR.dom.elementPath(f.getParent(), a.root), d, h = 0, m; h < g.elements.length && (m = g.elements[h]) && m != g.block && m != g.blockLimit; h++)
            if (this.checkElementRemovable(m)) {
              var k;
              !e && a.collapsed && (a.checkBoundaryOfElement(m, CKEDITOR.END) || (k = a.checkBoundaryOfElement(m, CKEDITOR.START))) ? (d = m, d.match = k ? "start" : "end") : (m.mergeSiblings(),
                m.is(this.element) ? q.call(this, m) : v(m, x(this)[m.getName()]))
            }
          if (d) { e = f; for (h = 0;; h++) { m = g.elements[h]; if (m.equals(d)) break;
              else if (m.match) continue;
              else m = m.clone();
              m.append(e);
              e = m } e["start" == d.match ? "insertBefore" : "insertAfter"](d) }
        } else {
          var l = c.endNode,
            n = this;
          b();
          for (g = f; !g.equals(l);) d = g.getNextSourceNode(), g.type == CKEDITOR.NODE_ELEMENT && this.checkElementRemovable(g) && (g.getName() == this.element ? q.call(this, g) : v(g, x(this)[g.getName()]), d.type == CKEDITOR.NODE_ELEMENT && d.contains(f) && (b(), d = f.getNext())),
            g = d
        }
        a.moveToBookmark(c);
        a.shrink(CKEDITOR.NODE_ELEMENT, !0)
      }

      function g(a) { var b = [];
        a.forEach(function(a) { if ("true" == a.getAttribute("contenteditable")) return b.push(a), !1 }, CKEDITOR.NODE_ELEMENT, !0); return b }

      function l(a) { var b = a.getEnclosedNode() || a.getCommonAncestor(!1, !0);
        (a = (new CKEDITOR.dom.elementPath(b, a.root)).contains(this.element, 1)) && !a.isReadOnly() && r(a, this) }

      function k(a) {
        var b = a.getCommonAncestor(!0, !0);
        if (a = (new CKEDITOR.dom.elementPath(b, a.root)).contains(this.element, 1)) {
          var b = this._.definition,
            c = b.attributes;
          if (c)
            for (var f in c) a.removeAttribute(f, c[f]);
          if (b.styles)
            for (var e in b.styles) b.styles.hasOwnProperty(e) && a.removeStyle(e)
        }
      }

      function e(a) { var b = a.createBookmark(!0),
          c = a.createIterator();
        c.enforceRealBlocks = !0;
        this._.enterMode && (c.enlargeBr = this._.enterMode != CKEDITOR.ENTER_BR); for (var f, e = a.document, g; f = c.getNextParagraph();) !f.isReadOnly() && (c.activeFilter ? c.activeFilter.check(this) : 1) && (g = u(this, e, f), m(f, g));
        a.moveToBookmark(b) }

      function h(a) {
        var b = a.createBookmark(1),
          c = a.createIterator();
        c.enforceRealBlocks = !0;
        c.enlargeBr = this._.enterMode != CKEDITOR.ENTER_BR;
        for (var f, e; f = c.getNextParagraph();) this.checkElementRemovable(f) && (f.is("pre") ? ((e = this._.enterMode == CKEDITOR.ENTER_BR ? null : a.document.createElement(this._.enterMode == CKEDITOR.ENTER_P ? "p" : "div")) && f.copyAttributes(e), m(f, e)) : q.call(this, f));
        a.moveToBookmark(b)
      }

      function m(a, b) {
        var c = !b;
        c && (b = a.getDocument().createElement("div"), a.copyAttributes(b));
        var e = b && b.is("pre"),
          g = a.is("pre"),
          d = !e && g;
        if (e && !g) {
          g = b;
          (d = a.getBogus()) && d.remove();
          d = a.getHtml();
          d = n(d, /(?:^[ \t\n\r]+)|(?:[ \t\n\r]+$)/g, "");
          d = d.replace(/[ \t\r\n]*(<br[^>]*>)[ \t\r\n]*/gi, "$1");
          d = d.replace(/([ \t\n\r]+|&nbsp;)/g, " ");
          d = d.replace(/<br\b[^>]*>/gi, "\n");
          if (CKEDITOR.env.ie) { var h = a.getDocument().createElement("div");
            h.append(g);
            g.$.outerHTML = "\x3cpre\x3e" + d + "\x3c/pre\x3e";
            g.copyAttributes(h.getFirst());
            g = h.getFirst().remove() } else g.setHtml(d);
          b = g
        } else d ? b = p(c ? [a.getHtml()] : f(a), b) : a.moveChildren(b);
        b.replace(a);
        if (e) {
          var c = b,
            m;
          (m = c.getPrevious(H)) && m.type == CKEDITOR.NODE_ELEMENT &&
            m.is("pre") && (e = n(m.getHtml(), /\n$/, "") + "\n\n" + n(c.getHtml(), /^\n/, ""), CKEDITOR.env.ie ? c.$.outerHTML = "\x3cpre\x3e" + e + "\x3c/pre\x3e" : c.setHtml(e), m.remove())
        } else c && t(b)
      }

      function f(a) { var b = [];
        n(a.getOuterHtml(), /(\S\s*)\n(?:\s|(<span[^>]+data-cke-bookmark.*?\/span>))*\n(?!$)/gi, function(a, b, c) { return b + "\x3c/pre\x3e" + c + "\x3cpre\x3e" }).replace(/<pre\b.*?>([\s\S]*?)<\/pre>/gi, function(a, c) { b.push(c) }); return b }

      function n(a, b, c) {
        var f = "",
          e = "";
        a = a.replace(/(^<span[^>]+data-cke-bookmark.*?\/span>)|(<span[^>]+data-cke-bookmark.*?\/span>$)/gi,
          function(a, b, c) { b && (f = b);
            c && (e = c); return "" });
        return f + a.replace(b, c) + e
      }

      function p(a, b) {
        var c;
        1 < a.length && (c = new CKEDITOR.dom.documentFragment(b.getDocument()));
        for (var f = 0; f < a.length; f++) {
          var e = a[f],
            e = e.replace(/(\r\n|\r)/g, "\n"),
            e = n(e, /^[ \t]*\n/, ""),
            e = n(e, /\n$/, ""),
            e = n(e, /^[ \t]+|[ \t]+$/g, function(a, b) { return 1 == a.length ? "\x26nbsp;" : b ? " " + CKEDITOR.tools.repeat("\x26nbsp;", a.length - 1) : CKEDITOR.tools.repeat("\x26nbsp;", a.length - 1) + " " }),
            e = e.replace(/\n/g, "\x3cbr\x3e"),
            e = e.replace(/[ \t]{2,}/g, function(a) {
              return CKEDITOR.tools.repeat("\x26nbsp;",
                a.length - 1) + " "
            });
          if (c) { var g = b.clone();
            g.setHtml(e);
            c.append(g) } else b.setHtml(e)
        }
        return c || b
      }

      function q(a, b) {
        var c = this._.definition,
          f = c.attributes,
          c = c.styles,
          e = x(this)[a.getName()],
          g = CKEDITOR.tools.isEmpty(f) && CKEDITOR.tools.isEmpty(c),
          d;
        for (d in f)
          if ("class" != d && !this._.definition.fullMatch || a.getAttribute(d) == y(d, f[d])) b && "data-" == d.slice(0, 5) || (g = a.hasAttribute(d), a.removeAttribute(d));
        for (var h in c) this._.definition.fullMatch && a.getStyle(h) != y(h, c[h], !0) || (g = g || !!a.getStyle(h), a.removeStyle(h));
        v(a, e, A[a.getName()]);
        g && (this._.definition.alwaysRemoveElement ? t(a, 1) : !CKEDITOR.dtd.$block[a.getName()] || this._.enterMode == CKEDITOR.ENTER_BR && !a.hasAttributes() ? t(a) : a.renameNode(this._.enterMode == CKEDITOR.ENTER_P ? "p" : "div"))
      }

      function w(a) { for (var b = x(this), c = a.getElementsByTag(this.element), f, e = c.count(); 0 <= --e;) f = c.getItem(e), f.isReadOnly() || q.call(this, f, !0); for (var g in b)
          if (g != this.element)
            for (c = a.getElementsByTag(g), e = c.count() - 1; 0 <= e; e--) f = c.getItem(e), f.isReadOnly() || v(f, b[g]) }

      function v(a,
        b, c) { if (b = b && b.attributes)
          for (var f = 0; f < b.length; f++) { var e = b[f][0],
              g; if (g = a.getAttribute(e)) { var d = b[f][1];
              (null === d || d.test && d.test(g) || "string" == typeof d && g == d) && a.removeAttribute(e) } } c || t(a) }

      function t(a, b) {
        if (!a.hasAttributes() || b)
          if (CKEDITOR.dtd.$block[a.getName()]) { var c = a.getPrevious(H),
              f = a.getNext(H);!c || c.type != CKEDITOR.NODE_TEXT && c.isBlockBoundary({ br: 1 }) || a.append("br", 1);!f || f.type != CKEDITOR.NODE_TEXT && f.isBlockBoundary({ br: 1 }) || a.append("br");
            a.remove(!0) } else c = a.getFirst(), f = a.getLast(),
            a.remove(!0), c && (c.type == CKEDITOR.NODE_ELEMENT && c.mergeSiblings(), f && !c.equals(f) && f.type == CKEDITOR.NODE_ELEMENT && f.mergeSiblings())
      }

      function u(a, b, c) { var f;
        f = a.element; "*" == f && (f = "span");
        f = new CKEDITOR.dom.element(f, b);
        c && c.copyAttributes(f);
        f = r(f, a);
        b.getCustomData("doc_processing_style") && f.hasAttribute("id") ? f.removeAttribute("id") : b.setCustomData("doc_processing_style", 1); return f }

      function r(a, b) {
        var c = b._.definition,
          f = c.attributes,
          c = CKEDITOR.style.getStyleText(c);
        if (f)
          for (var e in f) a.setAttribute(e,
            f[e]);
        c && a.setAttribute("style", c);
        return a
      }

      function B(a, b) { for (var c in a) a[c] = a[c].replace(F, function(a, c) { return b[c] }) }

      function x(a) {
        if (a._.overrides) return a._.overrides;
        var b = a._.overrides = {},
          c = a._.definition.overrides;
        if (c) {
          CKEDITOR.tools.isArray(c) || (c = [c]);
          for (var f = 0; f < c.length; f++) {
            var e = c[f],
              g, d;
            "string" == typeof e ? g = e.toLowerCase() : (g = e.element ? e.element.toLowerCase() : a.element, d = e.attributes);
            e = b[g] || (b[g] = {});
            if (d) {
              var e = e.attributes = e.attributes || [],
                h;
              for (h in d) e.push([h.toLowerCase(),
                d[h]
              ])
            }
          }
        }
        return b
      }

      function y(a, b, c) { var f = new CKEDITOR.dom.element("span");
        f[c ? "setStyle" : "setAttribute"](a, b); return f[c ? "getStyle" : "getAttribute"](a) }

      function C(a, b) {
        function c(a, b) { return "font-family" == b.toLowerCase() ? a.replace(/["']/g, "") : a } "string" == typeof a && (a = CKEDITOR.tools.parseCssText(a)); "string" == typeof b && (b = CKEDITOR.tools.parseCssText(b, !0)); for (var f in a)
          if (!(f in b) || c(b[f], f) != c(a[f], f) && "inherit" != a[f] && "inherit" != b[f]) return !1; return !0 }

      function z(a, b, c) {
        var f = a.document,
          e = a.getRanges();
        b = b ? this.removeFromRange : this.applyToRange;
        var g, d;
        if (a.isFake && a.isInTable())
          for (g = [], d = 0; d < e.length; d++) g.push(e[d].clone());
        for (var h = e.createIterator(); d = h.getNextRange();) b.call(this, d, c);
        a.selectRanges(g || e);
        f.removeCustomData("doc_processing_style")
      }
      var A = { address: 1, div: 1, h1: 1, h2: 1, h3: 1, h4: 1, h5: 1, h6: 1, p: 1, pre: 1, section: 1, header: 1, footer: 1, nav: 1, article: 1, aside: 1, figure: 1, dialog: 1, hgroup: 1, time: 1, meter: 1, menu: 1, command: 1, keygen: 1, output: 1, progress: 1, details: 1, datagrid: 1, datalist: 1 },
        G = {
          a: 1,
          blockquote: 1,
          embed: 1,
          hr: 1,
          img: 1,
          li: 1,
          object: 1,
          ol: 1,
          table: 1,
          td: 1,
          tr: 1,
          th: 1,
          ul: 1,
          dl: 1,
          dt: 1,
          dd: 1,
          form: 1,
          audio: 1,
          video: 1
        },
        D = /\s*(?:;\s*|$)/,
        F = /#\((.+?)\)/g,
        I = CKEDITOR.dom.walker.bookmark(0, 1),
        H = CKEDITOR.dom.walker.whitespaces(1);
      CKEDITOR.style = function(a, b) {
        if ("string" == typeof a.type) return new CKEDITOR.style.customHandlers[a.type](a);
        var c = a.attributes;
        c && c.style && (a.styles = CKEDITOR.tools.extend({}, a.styles, CKEDITOR.tools.parseCssText(c.style)), delete c.style);
        b && (a = CKEDITOR.tools.clone(a), B(a.attributes, b), B(a.styles,
          b));
        c = this.element = a.element ? "string" == typeof a.element ? a.element.toLowerCase() : a.element : "*";
        this.type = a.type || (A[c] ? CKEDITOR.STYLE_BLOCK : G[c] ? CKEDITOR.STYLE_OBJECT : CKEDITOR.STYLE_INLINE);
        "object" == typeof this.element && (this.type = CKEDITOR.STYLE_OBJECT);
        this._ = { definition: a }
      };
      CKEDITOR.style.prototype = {
        apply: function(a) {
          if (a instanceof CKEDITOR.dom.document) return z.call(this, a.getSelection());
          if (this.checkApplicable(a.elementPath(), a)) {
            var b = this._.enterMode;
            b || (this._.enterMode = a.activeEnterMode);
            z.call(this, a.getSelection(), 0, a);
            this._.enterMode = b
          }
        },
        remove: function(a) { if (a instanceof CKEDITOR.dom.document) return z.call(this, a.getSelection(), 1); if (this.checkApplicable(a.elementPath(), a)) { var b = this._.enterMode;
            b || (this._.enterMode = a.activeEnterMode);
            z.call(this, a.getSelection(), 1, a);
            this._.enterMode = b } },
        applyToRange: function(a) { this.applyToRange = this.type == CKEDITOR.STYLE_INLINE ? b : this.type == CKEDITOR.STYLE_BLOCK ? e : this.type == CKEDITOR.STYLE_OBJECT ? l : null; return this.applyToRange(a) },
        removeFromRange: function(a) {
          this.removeFromRange =
            this.type == CKEDITOR.STYLE_INLINE ? c : this.type == CKEDITOR.STYLE_BLOCK ? h : this.type == CKEDITOR.STYLE_OBJECT ? k : null;
          return this.removeFromRange(a)
        },
        applyToObject: function(a) { r(a, this) },
        checkActive: function(a, b) {
          switch (this.type) {
            case CKEDITOR.STYLE_BLOCK:
              return this.checkElementRemovable(a.block || a.blockLimit, !0, b);
            case CKEDITOR.STYLE_OBJECT:
            case CKEDITOR.STYLE_INLINE:
              for (var c = a.elements, f = 0, e; f < c.length; f++)
                if (e = c[f], this.type != CKEDITOR.STYLE_INLINE || e != a.block && e != a.blockLimit) {
                  if (this.type == CKEDITOR.STYLE_OBJECT) {
                    var g =
                      e.getName();
                    if (!("string" == typeof this.element ? g == this.element : g in this.element)) continue
                  }
                  if (this.checkElementRemovable(e, !0, b)) return !0
                }
          }
          return !1
        },
        checkApplicable: function(a, b, c) { b && b instanceof CKEDITOR.filter && (c = b); if (c && !c.check(this)) return !1; switch (this.type) {
            case CKEDITOR.STYLE_OBJECT:
              return !!a.contains(this.element);
            case CKEDITOR.STYLE_BLOCK:
              return !!a.blockLimit.getDtd()[this.element] } return !0 },
        checkElementMatch: function(a, b) {
          var c = this._.definition;
          if (!a || !c.ignoreReadonly && a.isReadOnly()) return !1;
          var f = a.getName();
          if ("string" == typeof this.element ? f == this.element : f in this.element) { if (!b && !a.hasAttributes()) return !0; if (f = c._AC) c = f;
            else { var f = {},
                e = 0,
                g = c.attributes; if (g)
                for (var d in g) e++, f[d] = g[d]; if (d = CKEDITOR.style.getStyleText(c)) f.style || e++, f.style = d;
              f._length = e;
              c = c._AC = f } if (c._length) { for (var h in c)
                if ("_length" != h)
                  if (f = a.getAttribute(h) || "", "style" == h ? C(c[h], f) : c[h] == f) { if (!b) return !0 } else if (b) return !1; if (b) return !0 } else return !0 }
          return !1
        },
        checkElementRemovable: function(a, b, c) {
          if (this.checkElementMatch(a,
              b, c)) return !0;
          if (b = x(this)[a.getName()]) { var f; if (!(b = b.attributes)) return !0; for (c = 0; c < b.length; c++)
              if (f = b[c][0], f = a.getAttribute(f)) { var e = b[c][1]; if (null === e) return !0; if ("string" == typeof e) { if (f == e) return !0 } else if (e.test(f)) return !0 } }
          return !1
        },
        buildPreview: function(a) {
          var b = this._.definition,
            c = [],
            f = b.element;
          "bdo" == f && (f = "span");
          var c = ["\x3c", f],
            e = b.attributes;
          if (e)
            for (var g in e) c.push(" ", g, '\x3d"', e[g], '"');
          (e = CKEDITOR.style.getStyleText(b)) && c.push(' style\x3d"', e, '"');
          c.push("\x3e", a || b.name,
            "\x3c/", f, "\x3e");
          return c.join("")
        },
        getDefinition: function() { return this._.definition }
      };
      CKEDITOR.style.getStyleText = function(a) { var b = a._ST; if (b) return b; var b = a.styles,
          c = a.attributes && a.attributes.style || "",
          f = "";
        c.length && (c = c.replace(D, ";")); for (var e in b) { var g = b[e],
            d = (e + ":" + g).replace(D, ";"); "inherit" == g ? f += d : c += d } c.length && (c = CKEDITOR.tools.normalizeCssText(c, !0)); return a._ST = c + f };
      CKEDITOR.style.customHandlers = {};
      CKEDITOR.style.addCustomHandler = function(a) {
        var b = function(a) {
          this._ = { definition: a };
          this.setup && this.setup(a)
        };
        b.prototype = CKEDITOR.tools.extend(CKEDITOR.tools.prototypedCopy(CKEDITOR.style.prototype), { assignedTo: CKEDITOR.STYLE_OBJECT }, a, !0);
        return this.customHandlers[a.type] = b
      };
      var K = CKEDITOR.POSITION_PRECEDING | CKEDITOR.POSITION_IDENTICAL | CKEDITOR.POSITION_IS_CONTAINED,
        J = CKEDITOR.POSITION_FOLLOWING | CKEDITOR.POSITION_IDENTICAL | CKEDITOR.POSITION_IS_CONTAINED
    }(), CKEDITOR.styleCommand = function(a, d) { this.requiredContent = this.allowedContent = this.style = a;
      CKEDITOR.tools.extend(this, d, !0) },
    CKEDITOR.styleCommand.prototype.exec = function(a) { a.focus();
      this.state == CKEDITOR.TRISTATE_OFF ? a.applyStyle(this.style) : this.state == CKEDITOR.TRISTATE_ON && a.removeStyle(this.style) }, CKEDITOR.stylesSet = new CKEDITOR.resourceManager("", "stylesSet"), CKEDITOR.addStylesSet = CKEDITOR.tools.bind(CKEDITOR.stylesSet.add, CKEDITOR.stylesSet), CKEDITOR.loadStylesSet = function(a, d, b) { CKEDITOR.stylesSet.addExternal(a, d, "");
      CKEDITOR.stylesSet.load(a, b) }, CKEDITOR.tools.extend(CKEDITOR.editor.prototype, {
      attachStyleStateChange: function(a,
        d) { var b = this._.styleStateChangeCallbacks;
        b || (b = this._.styleStateChangeCallbacks = [], this.on("selectionChange", function(a) { for (var g = 0; g < b.length; g++) { var d = b[g],
              k = d.style.checkActive(a.data.path, this) ? CKEDITOR.TRISTATE_ON : CKEDITOR.TRISTATE_OFF;
            d.fn.call(this, k) } }));
        b.push({ style: a, fn: d }) },
      applyStyle: function(a) { a.apply(this) },
      removeStyle: function(a) { a.remove(this) },
      getStylesSet: function(a) {
        if (this._.stylesDefinitions) a(this._.stylesDefinitions);
        else {
          var d = this,
            b = d.config.stylesCombo_stylesSet || d.config.stylesSet;
          if (!1 === b) a(null);
          else if (b instanceof Array) d._.stylesDefinitions = b, a(b);
          else { b || (b = "default"); var b = b.split(":"),
              c = b[0];
            CKEDITOR.stylesSet.addExternal(c, b[1] ? b.slice(1).join(":") : CKEDITOR.getUrl("styles.js"), "");
            CKEDITOR.stylesSet.load(c, function(b) { d._.stylesDefinitions = b[c];
              a(d._.stylesDefinitions) }) }
        }
      }
    }), CKEDITOR.dom.comment = function(a, d) { "string" == typeof a && (a = (d ? d.$ : document).createComment(a));
      CKEDITOR.dom.domObject.call(this, a) }, CKEDITOR.dom.comment.prototype = new CKEDITOR.dom.node, CKEDITOR.tools.extend(CKEDITOR.dom.comment.prototype, { type: CKEDITOR.NODE_COMMENT, getOuterHtml: function() { return "\x3c!--" + this.$.nodeValue + "--\x3e" } }), "use strict",
    function() {
      var a = {},
        d = {},
        b;
      for (b in CKEDITOR.dtd.$blockLimit) b in CKEDITOR.dtd.$list || (a[b] = 1);
      for (b in CKEDITOR.dtd.$block) b in CKEDITOR.dtd.$blockLimit || b in CKEDITOR.dtd.$empty || (d[b] = 1);
      CKEDITOR.dom.elementPath = function(b, g) {
        var l = null,
          k = null,
          e = [],
          h = b,
          m;
        g = g || b.getDocument().getBody();
        h || (h = g);
        do
          if (h.type == CKEDITOR.NODE_ELEMENT) {
            e.push(h);
            if (!this.lastElement && (this.lastElement = h, h.is(CKEDITOR.dtd.$object) ||
                "false" == h.getAttribute("contenteditable"))) continue;
            if (h.equals(g)) break;
            if (!k && (m = h.getName(), "true" == h.getAttribute("contenteditable") ? k = h : !l && d[m] && (l = h), a[m])) { if (m = !l && "div" == m) { a: { m = h.getChildren(); for (var f = 0, n = m.count(); f < n; f++) { var p = m.getItem(f); if (p.type == CKEDITOR.NODE_ELEMENT && CKEDITOR.dtd.$block[p.getName()]) { m = !0; break a } } m = !1 } m = !m } m ? l = h : k = h }
          }
        while (h = h.getParent());
        k || (k = g);
        this.block = l;
        this.blockLimit = k;
        this.root = g;
        this.elements = e
      }
    }(), CKEDITOR.dom.elementPath.prototype = {
      compare: function(a) {
        var d =
          this.elements;
        a = a && a.elements;
        if (!a || d.length != a.length) return !1;
        for (var b = 0; b < d.length; b++)
          if (!d[b].equals(a[b])) return !1;
        return !0
      },
      contains: function(a, d, b) {
        var c = 0,
          g;
        "string" == typeof a && (g = function(b) { return b.getName() == a });
        a instanceof CKEDITOR.dom.element ? g = function(b) { return b.equals(a) } : CKEDITOR.tools.isArray(a) ? g = function(b) { return -1 < CKEDITOR.tools.indexOf(a, b.getName()) } : "function" == typeof a ? g = a : "object" == typeof a && (g = function(b) { return b.getName() in a });
        var l = this.elements,
          k = l.length;
        d &&
          (b ? c += 1 : --k);
        b && (l = Array.prototype.slice.call(l, 0), l.reverse());
        for (; c < k; c++)
          if (g(l[c])) return l[c];
        return null
      },
      isContextFor: function(a) { var d; return a in CKEDITOR.dtd.$block ? (d = this.contains(CKEDITOR.dtd.$intermediate) || this.root.equals(this.block) && this.block || this.blockLimit, !!d.getDtd()[a]) : !0 },
      direction: function() { return (this.block || this.blockLimit || this.root).getDirection(1) }
    }, CKEDITOR.dom.text = function(a, d) { "string" == typeof a && (a = (d ? d.$ : document).createTextNode(a));
      this.$ = a }, CKEDITOR.dom.text.prototype =
    new CKEDITOR.dom.node, CKEDITOR.tools.extend(CKEDITOR.dom.text.prototype, {
      type: CKEDITOR.NODE_TEXT,
      getLength: function() { return this.$.nodeValue.length },
      getText: function() { return this.$.nodeValue },
      setText: function(a) { this.$.nodeValue = a },
      split: function(a) {
        var d = this.$.parentNode,
          b = d.childNodes.length,
          c = this.getLength(),
          g = this.getDocument(),
          l = new CKEDITOR.dom.text(this.$.splitText(a), g);
        d.childNodes.length == b && (a >= c ? (l = g.createText(""), l.insertAfter(this)) : (a = g.createText(""), a.insertAfter(l), a.remove()));
        return l
      },
      substring: function(a, d) { return "number" != typeof d ? this.$.nodeValue.substr(a) : this.$.nodeValue.substring(a, d) }
    }),
    function() {
      function a(a, c, g) {
        var d = a.serializable,
          k = c[g ? "endContainer" : "startContainer"],
          e = g ? "endOffset" : "startOffset",
          h = d ? c.document.getById(a.startNode) : a.startNode;
        a = d ? c.document.getById(a.endNode) : a.endNode;
        k.equals(h.getPrevious()) ? (c.startOffset = c.startOffset - k.getLength() - a.getPrevious().getLength(), k = a.getNext()) : k.equals(a.getPrevious()) && (c.startOffset -= k.getLength(),
          k = a.getNext());
        k.equals(h.getParent()) && c[e]++;
        k.equals(a.getParent()) && c[e]++;
        c[g ? "endContainer" : "startContainer"] = k;
        return c
      }
      CKEDITOR.dom.rangeList = function(a) { if (a instanceof CKEDITOR.dom.rangeList) return a;
        a ? a instanceof CKEDITOR.dom.range && (a = [a]) : a = []; return CKEDITOR.tools.extend(a, d) };
      var d = {
        createIterator: function() {
          var a = this,
            c = CKEDITOR.dom.walker.bookmark(),
            g = [],
            d;
          return {
            getNextRange: function(k) {
              d = void 0 === d ? 0 : d + 1;
              var e = a[d];
              if (e && 1 < a.length) {
                if (!d)
                  for (var h = a.length - 1; 0 <= h; h--) g.unshift(a[h].createBookmark(!0));
                if (k)
                  for (var m = 0; a[d + m + 1];) { var f = e.document;
                    k = 0;
                    h = f.getById(g[m].endNode); for (f = f.getById(g[m + 1].startNode);;) { h = h.getNextSourceNode(!1); if (f.equals(h)) k = 1;
                      else if (c(h) || h.type == CKEDITOR.NODE_ELEMENT && h.isBlockBoundary()) continue; break } if (!k) break;
                    m++ }
                for (e.moveToBookmark(g.shift()); m--;) h = a[++d], h.moveToBookmark(g.shift()), e.setEnd(h.endContainer, h.endOffset)
              }
              return e
            }
          }
        },
        createBookmarks: function(b) {
          for (var c = [], g, d = 0; d < this.length; d++) {
            c.push(g = this[d].createBookmark(b, !0));
            for (var k = d + 1; k < this.length; k++) this[k] =
              a(g, this[k]), this[k] = a(g, this[k], !0)
          }
          return c
        },
        createBookmarks2: function(a) { for (var c = [], g = 0; g < this.length; g++) c.push(this[g].createBookmark2(a)); return c },
        moveToBookmarks: function(a) { for (var c = 0; c < this.length; c++) this[c].moveToBookmark(a[c]) }
      }
    }(),
    function() {
      function a() { return CKEDITOR.getUrl(CKEDITOR.skinName.split(",")[1] || "skins/" + CKEDITOR.skinName.split(",")[0] + "/") }

      function d(b) {
        var c = CKEDITOR.skin["ua_" + b],
          e = CKEDITOR.env;
        if (c)
          for (var c = c.split(",").sort(function(a, b) { return a > b ? -1 : 1 }), g = 0,
              d; g < c.length; g++)
            if (d = c[g], e.ie && (d.replace(/^ie/, "") == e.version || e.quirks && "iequirks" == d) && (d = "ie"), e[d]) { b += "_" + c[g]; break }
        return CKEDITOR.getUrl(a() + b + ".css")
      }

      function b(a, b) { l[a] || (CKEDITOR.document.appendStyleSheet(d(a)), l[a] = 1);
        b && b() }

      function c(a) { var b = a.getById(k);
        b || (b = a.getHead().append("style"), b.setAttribute("id", k), b.setAttribute("type", "text/css")); return b }

      function g(a, b, c) {
        var e, g, d;
        if (CKEDITOR.env.webkit)
          for (b = b.split("}").slice(0, -1), g = 0; g < b.length; g++) b[g] = b[g].split("{");
        for (var h =
            0; h < a.length; h++)
          if (CKEDITOR.env.webkit)
            for (g = 0; g < b.length; g++) { d = b[g][1]; for (e = 0; e < c.length; e++) d = d.replace(c[e][0], c[e][1]);
              a[h].$.sheet.addRule(b[g][0], d) } else { d = b; for (e = 0; e < c.length; e++) d = d.replace(c[e][0], c[e][1]);
              CKEDITOR.env.ie && 11 > CKEDITOR.env.version ? a[h].$.styleSheet.cssText += d : a[h].$.innerHTML += d }
      }
      var l = {};
      CKEDITOR.skin = {
        path: a,
        loadPart: function(c, f) { CKEDITOR.skin.name != CKEDITOR.skinName.split(",")[0] ? CKEDITOR.scriptLoader.load(CKEDITOR.getUrl(a() + "skin.js"), function() { b(c, f) }) : b(c, f) },
        getPath: function(a) { return CKEDITOR.getUrl(d(a)) },
        icons: {},
        addIcon: function(a, b, c, e) { a = a.toLowerCase();
          this.icons[a] || (this.icons[a] = { path: b, offset: c || 0, bgsize: e || "16px" }) },
        getIconStyle: function(a, b, c, e, g) { var d;
          a && (a = a.toLowerCase(), b && (d = this.icons[a + "-rtl"]), d || (d = this.icons[a]));
          a = c || d && d.path || "";
          e = e || d && d.offset;
          g = g || d && d.bgsize || "16px";
          a && (a = a.replace(/'/g, "\\'")); return a && "background-image:url('" + CKEDITOR.getUrl(a) + "');background-position:0 " + e + "px;background-size:" + g + ";" }
      };
      CKEDITOR.tools.extend(CKEDITOR.editor.prototype, { getUiColor: function() { return this.uiColor }, setUiColor: function(a) { var b = c(CKEDITOR.document); return (this.setUiColor = function(a) { this.uiColor = a; var c = CKEDITOR.skin.chameleon,
              d = "",
              m = ""; "function" == typeof c && (d = c(this, "editor"), m = c(this, "panel"));
            a = [
              [h, a]
            ];
            g([b], d, a);
            g(e, m, a) }).call(this, a) } });
      var k = "cke_ui_color",
        e = [],
        h = /\$color/g;
      CKEDITOR.on("instanceLoaded", function(a) {
        if (!CKEDITOR.env.ie || !CKEDITOR.env.quirks) {
          var b = a.editor;
          a = function(a) {
            a = (a.data[0] || a.data).element.getElementsByTag("iframe").getItem(0).getFrameDocument();
            if (!a.getById("cke_ui_color")) { a = c(a);
              e.push(a); var d = b.getUiColor();
              d && g([a], CKEDITOR.skin.chameleon(b, "panel"), [
                [h, d]
              ]) }
          };
          b.on("panelShow", a);
          b.on("menuShow", a);
          b.config.uiColor && b.setUiColor(b.config.uiColor)
        }
      })
    }(),
    function() {
      if (CKEDITOR.env.webkit) CKEDITOR.env.hc = !1;
      else {
        var a = CKEDITOR.dom.element.createFromHtml('\x3cdiv style\x3d"width:0;height:0;position:absolute;left:-10000px;border:1px solid;border-color:red blue"\x3e\x3c/div\x3e', CKEDITOR.document);
        a.appendTo(CKEDITOR.document.getHead());
        try { var d = a.getComputedStyle("border-top-color"),
            b = a.getComputedStyle("border-right-color");
          CKEDITOR.env.hc = !(!d || d != b) } catch (c) { CKEDITOR.env.hc = !1 } a.remove()
      }
      CKEDITOR.env.hc && (CKEDITOR.env.cssClass += " cke_hc");
      CKEDITOR.document.appendStyleText(".cke{visibility:hidden;}");
      CKEDITOR.status = "loaded";
      CKEDITOR.fireOnce("loaded");
      if (a = CKEDITOR._.pending)
        for (delete CKEDITOR._.pending, d = 0; d < a.length; d++) CKEDITOR.editor.prototype.constructor.apply(a[d][0], a[d][1]), CKEDITOR.add(a[d][0])
    }(), CKEDITOR.skin.name =
    "moono-lisa", CKEDITOR.skin.ua_editor = "ie,iequirks,ie8,gecko", CKEDITOR.skin.ua_dialog = "ie,iequirks,ie8", CKEDITOR.skin.chameleon = function() {
      var a = function() { return function(a, c) { for (var g = a.match(/[^#]./g), d = 0; 3 > d; d++) { var k = d,
                e;
              e = parseInt(g[d], 16);
              e = ("0" + (0 > c ? 0 | e * (1 + c) : 0 | e + (255 - e) * c).toString(16)).slice(-2);
              g[k] = e } return "#" + g.join("") } }(),
        d = {
          editor: new CKEDITOR.template("{id}.cke_chrome [border-color:{defaultBorder};] {id} .cke_top [ background-color:{defaultBackground};border-bottom-color:{defaultBorder};] {id} .cke_bottom [background-color:{defaultBackground};border-top-color:{defaultBorder};] {id} .cke_resizer [border-right-color:{ckeResizer}] {id} .cke_dialog_title [background-color:{defaultBackground};border-bottom-color:{defaultBorder};] {id} .cke_dialog_footer [background-color:{defaultBackground};outline-color:{defaultBorder};] {id} .cke_dialog_tab [background-color:{dialogTab};border-color:{defaultBorder};] {id} .cke_dialog_tab:hover [background-color:{lightBackground};] {id} .cke_dialog_contents [border-top-color:{defaultBorder};] {id} .cke_dialog_tab_selected, {id} .cke_dialog_tab_selected:hover [background:{dialogTabSelected};border-bottom-color:{dialogTabSelectedBorder};] {id} .cke_dialog_body [background:{dialogBody};border-color:{defaultBorder};] {id} a.cke_button_off:hover,{id} a.cke_button_off:focus,{id} a.cke_button_off:active [background-color:{darkBackground};border-color:{toolbarElementsBorder};] {id} .cke_button_on [background-color:{ckeButtonOn};border-color:{toolbarElementsBorder};] {id} .cke_toolbar_separator,{id} .cke_toolgroup a.cke_button:last-child:after,{id} .cke_toolgroup a.cke_button.cke_button_disabled:hover:last-child:after [background-color: {toolbarElementsBorder};border-color: {toolbarElementsBorder};] {id} a.cke_combo_button:hover,{id} a.cke_combo_button:focus,{id} .cke_combo_on a.cke_combo_button [border-color:{toolbarElementsBorder};background-color:{darkBackground};] {id} .cke_combo:after [border-color:{toolbarElementsBorder};] {id} .cke_path_item [color:{elementsPathColor};] {id} a.cke_path_item:hover,{id} a.cke_path_item:focus,{id} a.cke_path_item:active [background-color:{darkBackground};] {id}.cke_panel [border-color:{defaultBorder};] "),
          panel: new CKEDITOR.template(".cke_panel_grouptitle [background-color:{lightBackground};border-color:{defaultBorder};] .cke_menubutton_icon [background-color:{menubuttonIcon};] .cke_menubutton:hover,.cke_menubutton:focus,.cke_menubutton:active [background-color:{menubuttonHover};] .cke_menubutton:hover .cke_menubutton_icon, .cke_menubutton:focus .cke_menubutton_icon, .cke_menubutton:active .cke_menubutton_icon [background-color:{menubuttonIconHover};] .cke_menubutton_disabled:hover .cke_menubutton_icon,.cke_menubutton_disabled:focus .cke_menubutton_icon,.cke_menubutton_disabled:active .cke_menubutton_icon [background-color:{menubuttonIcon};] .cke_menuseparator [background-color:{menubuttonIcon};] a:hover.cke_colorbox, a:active.cke_colorbox [border-color:{defaultBorder};] a:hover.cke_colorauto, a:hover.cke_colormore, a:active.cke_colorauto, a:active.cke_colormore [background-color:{ckeColorauto};border-color:{defaultBorder};] ")
        };
      return function(b, c) { var g = a(b.uiColor, .4),
          g = { id: "." + b.id, defaultBorder: a(g, -.2), toolbarElementsBorder: a(g, -.25), defaultBackground: g, lightBackground: a(g, .8), darkBackground: a(g, -.15), ckeButtonOn: a(g, .4), ckeResizer: a(g, -.4), ckeColorauto: a(g, .8), dialogBody: a(g, .7), dialogTab: a(g, .65), dialogTabSelected: "#FFF", dialogTabSelectedBorder: "#FFF", elementsPathColor: a(g, -.6), menubuttonHover: a(g, .1), menubuttonIcon: a(g, .5), menubuttonIconHover: a(g, .3) }; return d[c].output(g).replace(/\[/g, "{").replace(/\]/g, "}") }
    }(),
    CKEDITOR.plugins.add("dialogui", {
      onLoad: function() {
        var a = function(a) { this._ || (this._ = {});
            this._["default"] = this._.initValue = a["default"] || "";
            this._.required = a.required || !1; for (var b = [this._], c = 1; c < arguments.length; c++) b.push(arguments[c]);
            b.push(!0);
            CKEDITOR.tools.extend.apply(CKEDITOR.tools, b); return this._ },
          d = { build: function(a, b, c) { return new CKEDITOR.ui.dialog.textInput(a, b, c) } },
          b = { build: function(a, b, c) { return new CKEDITOR.ui.dialog[b.type](a, b, c) } },
          c = {
            isChanged: function() {
              return this.getValue() !=
                this.getInitValue()
            },
            reset: function(a) { this.setValue(this.getInitValue(), a) },
            setInitValue: function() { this._.initValue = this.getValue() },
            resetInitValue: function() { this._.initValue = this._["default"] },
            getInitValue: function() { return this._.initValue }
          },
          g = CKEDITOR.tools.extend({}, CKEDITOR.ui.dialog.uiElement.prototype.eventProcessors, {
            onChange: function(a, b) {
              this._.domOnChangeRegistered || (a.on("load", function() {
                this.getInputElement().on("change", function() { a.parts.dialog.isVisible() && this.fire("change", { value: this.getValue() }) },
                  this)
              }, this), this._.domOnChangeRegistered = !0);
              this.on("change", b)
            }
          }, !0),
          l = /^on([A-Z]\w+)/,
          k = function(a) { for (var b in a)(l.test(b) || "title" == b || "type" == b) && delete a[b]; return a },
          e = function(a) { a = a.data.getKeystroke();
            a == CKEDITOR.SHIFT + CKEDITOR.ALT + 36 ? this.setDirectionMarker("ltr") : a == CKEDITOR.SHIFT + CKEDITOR.ALT + 35 && this.setDirectionMarker("rtl") };
        CKEDITOR.tools.extend(CKEDITOR.ui.dialog, {
          labeledElement: function(b, c, f, e) {
            if (!(4 > arguments.length)) {
              var g = a.call(this, c);
              g.labelId = CKEDITOR.tools.getNextId() +
                "_label";
              this._.children = [];
              var d = { role: c.role || "presentation" };
              c.includeLabel && (d["aria-labelledby"] = g.labelId);
              CKEDITOR.ui.dialog.uiElement.call(this, b, c, f, "div", null, d, function() {
                var a = [],
                  f = c.required ? " cke_required" : "";
                "horizontal" != c.labelLayout ? a.push('\x3clabel class\x3d"cke_dialog_ui_labeled_label' + f + '" ', ' id\x3d"' + g.labelId + '"', g.inputId ? ' for\x3d"' + g.inputId + '"' : "", (c.labelStyle ? ' style\x3d"' + c.labelStyle + '"' : "") + "\x3e", c.label, "\x3c/label\x3e", '\x3cdiv class\x3d"cke_dialog_ui_labeled_content"',
                  c.controlStyle ? ' style\x3d"' + c.controlStyle + '"' : "", ' role\x3d"presentation"\x3e', e.call(this, b, c), "\x3c/div\x3e") : (f = {
                  type: "hbox",
                  widths: c.widths,
                  padding: 0,
                  children: [{ type: "html", html: '\x3clabel class\x3d"cke_dialog_ui_labeled_label' + f + '" id\x3d"' + g.labelId + '" for\x3d"' + g.inputId + '"' + (c.labelStyle ? ' style\x3d"' + c.labelStyle + '"' : "") + "\x3e" + CKEDITOR.tools.htmlEncode(c.label) + "\x3c/label\x3e" }, {
                    type: "html",
                    html: '\x3cspan class\x3d"cke_dialog_ui_labeled_content"' + (c.controlStyle ? ' style\x3d"' + c.controlStyle +
                      '"' : "") + "\x3e" + e.call(this, b, c) + "\x3c/span\x3e"
                  }]
                }, CKEDITOR.dialog._.uiElementBuilders.hbox.build(b, f, a));
                return a.join("")
              })
            }
          },
          textInput: function(b, c, f) {
            if (!(3 > arguments.length)) {
              a.call(this, c);
              var g = this._.inputId = CKEDITOR.tools.getNextId() + "_textInput",
                d = { "class": "cke_dialog_ui_input_" + c.type, id: g, type: c.type };
              c.validate && (this.validate = c.validate);
              c.maxLength && (d.maxlength = c.maxLength);
              c.size && (d.size = c.size);
              c.inputStyle && (d.style = c.inputStyle);
              var k = this,
                l = !1;
              b.on("load", function() {
                k.getInputElement().on("keydown",
                  function(a) { 13 == a.data.getKeystroke() && (l = !0) });
                k.getInputElement().on("keyup", function(a) { 13 == a.data.getKeystroke() && l && (b.getButton("ok") && setTimeout(function() { b.getButton("ok").click() }, 0), l = !1);
                  k.bidi && e.call(k, a) }, null, null, 1E3)
              });
              CKEDITOR.ui.dialog.labeledElement.call(this, b, c, f, function() {
                var a = ['\x3cdiv class\x3d"cke_dialog_ui_input_', c.type, '" role\x3d"presentation"'];
                c.width && a.push('style\x3d"width:' + c.width + '" ');
                a.push("\x3e\x3cinput ");
                d["aria-labelledby"] = this._.labelId;
                this._.required &&
                  (d["aria-required"] = this._.required);
                for (var b in d) a.push(b + '\x3d"' + d[b] + '" ');
                a.push(" /\x3e\x3c/div\x3e");
                return a.join("")
              })
            }
          },
          textarea: function(b, c, f) {
            if (!(3 > arguments.length)) {
              a.call(this, c);
              var g = this,
                d = this._.inputId = CKEDITOR.tools.getNextId() + "_textarea",
                k = {};
              c.validate && (this.validate = c.validate);
              k.rows = c.rows || 5;
              k.cols = c.cols || 20;
              k["class"] = "cke_dialog_ui_input_textarea " + (c["class"] || "");
              "undefined" != typeof c.inputStyle && (k.style = c.inputStyle);
              c.dir && (k.dir = c.dir);
              if (g.bidi) b.on("load",
                function() { g.getInputElement().on("keyup", e) }, g);
              CKEDITOR.ui.dialog.labeledElement.call(this, b, c, f, function() { k["aria-labelledby"] = this._.labelId;
                this._.required && (k["aria-required"] = this._.required); var a = ['\x3cdiv class\x3d"cke_dialog_ui_input_textarea" role\x3d"presentation"\x3e\x3ctextarea id\x3d"', d, '" '],
                  b; for (b in k) a.push(b + '\x3d"' + CKEDITOR.tools.htmlEncode(k[b]) + '" ');
                a.push("\x3e", CKEDITOR.tools.htmlEncode(g._["default"]), "\x3c/textarea\x3e\x3c/div\x3e"); return a.join("") })
            }
          },
          checkbox: function(b,
            c, f) {
            if (!(3 > arguments.length)) {
              var e = a.call(this, c, { "default": !!c["default"] });
              c.validate && (this.validate = c.validate);
              CKEDITOR.ui.dialog.uiElement.call(this, b, c, f, "span", null, null, function() {
                var a = CKEDITOR.tools.extend({}, c, { id: c.id ? c.id + "_checkbox" : CKEDITOR.tools.getNextId() + "_checkbox" }, !0),
                  f = [],
                  g = CKEDITOR.tools.getNextId() + "_label",
                  d = { "class": "cke_dialog_ui_checkbox_input", type: "checkbox", "aria-labelledby": g };
                k(a);
                c["default"] && (d.checked = "checked");
                "undefined" != typeof a.inputStyle && (a.style = a.inputStyle);
                e.checkbox = new CKEDITOR.ui.dialog.uiElement(b, a, f, "input", null, d);
                f.push(' \x3clabel id\x3d"', g, '" for\x3d"', d.id, '"' + (c.labelStyle ? ' style\x3d"' + c.labelStyle + '"' : "") + "\x3e", CKEDITOR.tools.htmlEncode(c.label), "\x3c/label\x3e");
                return f.join("")
              })
            }
          },
          radio: function(b, c, f) {
            if (!(3 > arguments.length)) {
              a.call(this, c);
              this._["default"] || (this._["default"] = this._.initValue = c.items[0][1]);
              c.validate && (this.validate = c.validate);
              var e = [],
                g = this;
              c.role = "radiogroup";
              c.includeLabel = !0;
              CKEDITOR.ui.dialog.labeledElement.call(this,
                b, c, f,
                function() {
                  for (var a = [], f = [], d = (c.id ? c.id : CKEDITOR.tools.getNextId()) + "_radio", l = 0; l < c.items.length; l++) {
                    var u = c.items[l],
                      r = void 0 !== u[2] ? u[2] : u[0],
                      B = void 0 !== u[1] ? u[1] : u[0],
                      x = CKEDITOR.tools.getNextId() + "_radio_input",
                      y = x + "_label",
                      x = CKEDITOR.tools.extend({}, c, { id: x, title: null, type: null }, !0),
                      r = CKEDITOR.tools.extend({}, x, { title: r }, !0),
                      C = { type: "radio", "class": "cke_dialog_ui_radio_input", name: d, value: B, "aria-labelledby": y },
                      z = [];
                    g._["default"] == B && (C.checked = "checked");
                    k(x);
                    k(r);
                    "undefined" != typeof x.inputStyle &&
                      (x.style = x.inputStyle);
                    x.keyboardFocusable = !0;
                    e.push(new CKEDITOR.ui.dialog.uiElement(b, x, z, "input", null, C));
                    z.push(" ");
                    new CKEDITOR.ui.dialog.uiElement(b, r, z, "label", null, { id: y, "for": C.id }, u[0]);
                    a.push(z.join(""))
                  }
                  new CKEDITOR.ui.dialog.hbox(b, e, a, f);
                  return f.join("")
                });
              this._.children = e
            }
          },
          button: function(b, c, f) {
            if (arguments.length) {
              "function" == typeof c && (c = c(b.getParentEditor()));
              a.call(this, c, { disabled: c.disabled || !1 });
              CKEDITOR.event.implementOn(this);
              var e = this;
              b.on("load", function() {
                var a = this.getElement();
                (function() { a.on("click", function(a) { e.click();
                    a.data.preventDefault() });
                  a.on("keydown", function(a) { a.data.getKeystroke() in { 32: 1 } && (e.click(), a.data.preventDefault()) }) })();
                a.unselectable()
              }, this);
              var g = CKEDITOR.tools.extend({}, c);
              delete g.style;
              var d = CKEDITOR.tools.getNextId() + "_label";
              CKEDITOR.ui.dialog.uiElement.call(this, b, g, f, "a", null, { style: c.style, href: "javascript:void(0)", title: c.label, hidefocus: "true", "class": c["class"], role: "button", "aria-labelledby": d }, '\x3cspan id\x3d"' + d + '" class\x3d"cke_dialog_ui_button"\x3e' +
                CKEDITOR.tools.htmlEncode(c.label) + "\x3c/span\x3e")
            }
          },
          select: function(b, c, f) {
            if (!(3 > arguments.length)) {
              var e = a.call(this, c);
              c.validate && (this.validate = c.validate);
              e.inputId = CKEDITOR.tools.getNextId() + "_select";
              CKEDITOR.ui.dialog.labeledElement.call(this, b, c, f, function() {
                var a = CKEDITOR.tools.extend({}, c, { id: c.id ? c.id + "_select" : CKEDITOR.tools.getNextId() + "_select" }, !0),
                  f = [],
                  g = [],
                  d = { id: e.inputId, "class": "cke_dialog_ui_input_select", "aria-labelledby": this._.labelId };
                f.push('\x3cdiv class\x3d"cke_dialog_ui_input_',
                  c.type, '" role\x3d"presentation"');
                c.width && f.push('style\x3d"width:' + c.width + '" ');
                f.push("\x3e");
                void 0 !== c.size && (d.size = c.size);
                void 0 !== c.multiple && (d.multiple = c.multiple);
                k(a);
                for (var l = 0, u; l < c.items.length && (u = c.items[l]); l++) g.push('\x3coption value\x3d"', CKEDITOR.tools.htmlEncode(void 0 !== u[1] ? u[1] : u[0]).replace(/"/g, "\x26quot;"), '" /\x3e ', CKEDITOR.tools.htmlEncode(u[0]));
                "undefined" != typeof a.inputStyle && (a.style = a.inputStyle);
                e.select = new CKEDITOR.ui.dialog.uiElement(b, a, f, "select", null,
                  d, g.join(""));
                f.push("\x3c/div\x3e");
                return f.join("")
              })
            }
          },
          file: function(b, c, f) {
            if (!(3 > arguments.length)) {
              void 0 === c["default"] && (c["default"] = "");
              var e = CKEDITOR.tools.extend(a.call(this, c), { definition: c, buttons: [] });
              c.validate && (this.validate = c.validate);
              b.on("load", function() { CKEDITOR.document.getById(e.frameId).getParent().addClass("cke_dialog_ui_input_file") });
              CKEDITOR.ui.dialog.labeledElement.call(this, b, c, f, function() {
                e.frameId = CKEDITOR.tools.getNextId() + "_fileInput";
                var a = ['\x3ciframe frameborder\x3d"0" allowtransparency\x3d"0" class\x3d"cke_dialog_ui_input_file" role\x3d"presentation" id\x3d"',
                  e.frameId, '" title\x3d"', c.label, '" src\x3d"javascript:void('
                ];
                a.push(CKEDITOR.env.ie ? "(function(){" + encodeURIComponent("document.open();(" + CKEDITOR.tools.fixDomain + ")();document.close();") + "})()" : "0");
                a.push(')"\x3e\x3c/iframe\x3e');
                return a.join("")
              })
            }
          },
          fileButton: function(b, c, f) {
            var e = this;
            if (!(3 > arguments.length)) {
              a.call(this, c);
              c.validate && (this.validate = c.validate);
              var g = CKEDITOR.tools.extend({}, c),
                d = g.onClick;
              g.className = (g.className ? g.className + " " : "") + "cke_dialog_ui_button";
              g.onClick = function(a) {
                var f =
                  c["for"];
                a = d ? d.call(this, a) : !1;
                !1 !== a && ("xhr" !== a && b.getContentElement(f[0], f[1]).submit(), this.disable())
              };
              b.on("load", function() { b.getContentElement(c["for"][0], c["for"][1])._.buttons.push(e) });
              CKEDITOR.ui.dialog.button.call(this, b, g, f)
            }
          },
          html: function() {
            var a = /^\s*<[\w:]+\s+([^>]*)?>/,
              b = /^(\s*<[\w:]+(?:\s+[^>]*)?)((?:.|\r|\n)+)$/,
              c = /\/$/;
            return function(e, g, d) {
              if (!(3 > arguments.length)) {
                var k = [],
                  l = g.html;
                "\x3c" != l.charAt(0) && (l = "\x3cspan\x3e" + l + "\x3c/span\x3e");
                var t = g.focus;
                if (t) {
                  var u = this.focus;
                  this.focus = function() {
                    ("function" == typeof t ? t : u).call(this);
                    this.fire("focus") };
                  g.isFocusable && (this.isFocusable = this.isFocusable);
                  this.keyboardFocusable = !0
                }
                CKEDITOR.ui.dialog.uiElement.call(this, e, g, k, "span", null, null, "");
                k = k.join("").match(a);
                l = l.match(b) || ["", "", ""];
                c.test(l[1]) && (l[1] = l[1].slice(0, -1), l[2] = "/" + l[2]);
                d.push([l[1], " ", k[1] || "", l[2]].join(""))
              }
            }
          }(),
          fieldset: function(a, b, c, e, g) {
            var d = g.label;
            this._ = { children: b };
            CKEDITOR.ui.dialog.uiElement.call(this, a, g, e, "fieldset", null, null, function() {
              var a = [];
              d && a.push("\x3clegend" + (g.labelStyle ? ' style\x3d"' + g.labelStyle + '"' : "") + "\x3e" + d + "\x3c/legend\x3e");
              for (var b = 0; b < c.length; b++) a.push(c[b]);
              return a.join("")
            })
          }
        }, !0);
        CKEDITOR.ui.dialog.html.prototype = new CKEDITOR.ui.dialog.uiElement;
        CKEDITOR.ui.dialog.labeledElement.prototype = CKEDITOR.tools.extend(new CKEDITOR.ui.dialog.uiElement, {
          setLabel: function(a) {
            var b = CKEDITOR.document.getById(this._.labelId);
            1 > b.getChildCount() ? (new CKEDITOR.dom.text(a, CKEDITOR.document)).appendTo(b) : b.getChild(0).$.nodeValue =
              a;
            return this
          },
          getLabel: function() { var a = CKEDITOR.document.getById(this._.labelId); return !a || 1 > a.getChildCount() ? "" : a.getChild(0).getText() },
          eventProcessors: g
        }, !0);
        CKEDITOR.ui.dialog.button.prototype = CKEDITOR.tools.extend(new CKEDITOR.ui.dialog.uiElement, {
          click: function() { return this._.disabled ? !1 : this.fire("click", { dialog: this._.dialog }) },
          enable: function() { this._.disabled = !1; var a = this.getElement();
            a && a.removeClass("cke_disabled") },
          disable: function() { this._.disabled = !0;
            this.getElement().addClass("cke_disabled") },
          isVisible: function() { return this.getElement().getFirst().isVisible() },
          isEnabled: function() { return !this._.disabled },
          eventProcessors: CKEDITOR.tools.extend({}, CKEDITOR.ui.dialog.uiElement.prototype.eventProcessors, { onClick: function(a, b) { this.on("click", function() { b.apply(this, arguments) }) } }, !0),
          accessKeyUp: function() { this.click() },
          accessKeyDown: function() { this.focus() },
          keyboardFocusable: !0
        }, !0);
        CKEDITOR.ui.dialog.textInput.prototype = CKEDITOR.tools.extend(new CKEDITOR.ui.dialog.labeledElement, {
          getInputElement: function() { return CKEDITOR.document.getById(this._.inputId) },
          focus: function() { var a = this.selectParentTab();
            setTimeout(function() { var b = a.getInputElement();
              b && b.$.focus() }, 0) },
          select: function() { var a = this.selectParentTab();
            setTimeout(function() { var b = a.getInputElement();
              b && (b.$.focus(), b.$.select()) }, 0) },
          accessKeyUp: function() { this.select() },
          setValue: function(a) { if (this.bidi) { var b = a && a.charAt(0);
              (b = "‪" == b ? "ltr" : "‫" == b ? "rtl" : null) && (a = a.slice(1));
              this.setDirectionMarker(b) } a || (a = ""); return CKEDITOR.ui.dialog.uiElement.prototype.setValue.apply(this, arguments) },
          getValue: function() { var a = CKEDITOR.ui.dialog.uiElement.prototype.getValue.call(this); if (this.bidi && a) { var b = this.getDirectionMarker();
              b && (a = ("ltr" == b ? "‪" : "‫") + a) } return a },
          setDirectionMarker: function(a) { var b = this.getInputElement();
            a ? b.setAttributes({ dir: a, "data-cke-dir-marker": a }) : this.getDirectionMarker() && b.removeAttributes(["dir", "data-cke-dir-marker"]) },
          getDirectionMarker: function() { return this.getInputElement().data("cke-dir-marker") },
          keyboardFocusable: !0
        }, c, !0);
        CKEDITOR.ui.dialog.textarea.prototype =
          new CKEDITOR.ui.dialog.textInput;
        CKEDITOR.ui.dialog.select.prototype = CKEDITOR.tools.extend(new CKEDITOR.ui.dialog.labeledElement, {
          getInputElement: function() { return this._.select.getElement() },
          add: function(a, b, c) { var e = new CKEDITOR.dom.element("option", this.getDialog().getParentEditor().document),
              g = this.getInputElement().$;
            e.$.text = a;
            e.$.value = void 0 === b || null === b ? a : b;
            void 0 === c || null === c ? CKEDITOR.env.ie ? g.add(e.$) : g.add(e.$, null) : g.add(e.$, c); return this },
          remove: function(a) {
            this.getInputElement().$.remove(a);
            return this
          },
          clear: function() { for (var a = this.getInputElement().$; 0 < a.length;) a.remove(0); return this },
          keyboardFocusable: !0
        }, c, !0);
        CKEDITOR.ui.dialog.checkbox.prototype = CKEDITOR.tools.extend(new CKEDITOR.ui.dialog.uiElement, {
          getInputElement: function() { return this._.checkbox.getElement() },
          setValue: function(a, b) { this.getInputElement().$.checked = a;!b && this.fire("change", { value: a }) },
          getValue: function() { return this.getInputElement().$.checked },
          accessKeyUp: function() { this.setValue(!this.getValue()) },
          eventProcessors: {
            onChange: function(a,
              b) { if (!CKEDITOR.env.ie || 8 < CKEDITOR.env.version) return g.onChange.apply(this, arguments);
              a.on("load", function() { var a = this._.checkbox.getElement();
                a.on("propertychange", function(b) { b = b.data.$; "checked" == b.propertyName && this.fire("change", { value: a.$.checked }) }, this) }, this);
              this.on("change", b); return null }
          },
          keyboardFocusable: !0
        }, c, !0);
        CKEDITOR.ui.dialog.radio.prototype = CKEDITOR.tools.extend(new CKEDITOR.ui.dialog.uiElement, {
          setValue: function(a, b) {
            for (var c = this._.children, e, g = 0; g < c.length && (e = c[g]); g++) e.getElement().$.checked =
              e.getValue() == a;
            !b && this.fire("change", { value: a })
          },
          getValue: function() { for (var a = this._.children, b = 0; b < a.length; b++)
              if (a[b].getElement().$.checked) return a[b].getValue(); return null },
          accessKeyUp: function() { var a = this._.children,
              b; for (b = 0; b < a.length; b++)
              if (a[b].getElement().$.checked) { a[b].getElement().focus(); return }
            a[0].getElement().focus() },
          eventProcessors: {
            onChange: function(a, b) {
              if (!CKEDITOR.env.ie || 8 < CKEDITOR.env.version) return g.onChange.apply(this, arguments);
              a.on("load", function() {
                for (var a =
                    this._.children, b = this, c = 0; c < a.length; c++) a[c].getElement().on("propertychange", function(a) { a = a.data.$; "checked" == a.propertyName && this.$.checked && b.fire("change", { value: this.getAttribute("value") }) })
              }, this);
              this.on("change", b);
              return null
            }
          }
        }, c, !0);
        CKEDITOR.ui.dialog.file.prototype = CKEDITOR.tools.extend(new CKEDITOR.ui.dialog.labeledElement, c, {
          getInputElement: function() {
            var a = CKEDITOR.document.getById(this._.frameId).getFrameDocument();
            return 0 < a.$.forms.length ? new CKEDITOR.dom.element(a.$.forms[0].elements[0]) :
              this.getElement()
          },
          submit: function() { this.getInputElement().getParent().$.submit(); return this },
          getAction: function() { return this.getInputElement().getParent().$.action },
          registerEvents: function(a) { var b = /^on([A-Z]\w+)/,
              c, e = function(a, b, c, f) { a.on("formLoaded", function() { a.getInputElement().on(c, f, a) }) },
              g; for (g in a)
              if (c = g.match(b)) this.eventProcessors[g] ? this.eventProcessors[g].call(this, this._.dialog, a[g]) : e(this, this._.dialog, c[1].toLowerCase(), a[g]); return this },
          reset: function() {
            function a() {
              c.$.open();
              var h = "";
              e.size && (h = e.size - (CKEDITOR.env.ie ? 7 : 0));
              var r = b.frameId + "_input";
              c.$.write(['\x3chtml dir\x3d"' + l + '" lang\x3d"' + t + '"\x3e\x3chead\x3e\x3ctitle\x3e\x3c/title\x3e\x3c/head\x3e\x3cbody style\x3d"margin: 0; overflow: hidden; background: transparent;"\x3e', '\x3cform enctype\x3d"multipart/form-data" method\x3d"POST" dir\x3d"' + l + '" lang\x3d"' + t + '" action\x3d"', CKEDITOR.tools.htmlEncode(e.action), '"\x3e\x3clabel id\x3d"', b.labelId, '" for\x3d"', r, '" style\x3d"display:none"\x3e', CKEDITOR.tools.htmlEncode(e.label),
                '\x3c/label\x3e\x3cinput style\x3d"width:100%" id\x3d"', r, '" aria-labelledby\x3d"', b.labelId, '" type\x3d"file" name\x3d"', CKEDITOR.tools.htmlEncode(e.id || "cke_upload"), '" size\x3d"', CKEDITOR.tools.htmlEncode(0 < h ? h : ""), '" /\x3e\x3c/form\x3e\x3c/body\x3e\x3c/html\x3e\x3cscript\x3e', CKEDITOR.env.ie ? "(" + CKEDITOR.tools.fixDomain + ")();" : "", "window.parent.CKEDITOR.tools.callFunction(" + d + ");", "window.onbeforeunload \x3d function() {window.parent.CKEDITOR.tools.callFunction(" + k + ")}", "\x3c/script\x3e"
              ].join(""));
              c.$.close();
              for (h = 0; h < g.length; h++) g[h].enable()
            }
            var b = this._,
              c = CKEDITOR.document.getById(b.frameId).getFrameDocument(),
              e = b.definition,
              g = b.buttons,
              d = this.formLoadedNumber,
              k = this.formUnloadNumber,
              l = b.dialog._.editor.lang.dir,
              t = b.dialog._.editor.langCode;
            d || (d = this.formLoadedNumber = CKEDITOR.tools.addFunction(function() { this.fire("formLoaded") }, this), k = this.formUnloadNumber = CKEDITOR.tools.addFunction(function() { this.getInputElement().clearCustomData() }, this), this.getDialog()._.editor.on("destroy", function() {
              CKEDITOR.tools.removeFunction(d);
              CKEDITOR.tools.removeFunction(k)
            }));
            CKEDITOR.env.gecko ? setTimeout(a, 500) : a()
          },
          getValue: function() { return this.getInputElement().$.value || "" },
          setInitValue: function() { this._.initValue = "" },
          eventProcessors: { onChange: function(a, b) { this._.domOnChangeRegistered || (this.on("formLoaded", function() { this.getInputElement().on("change", function() { this.fire("change", { value: this.getValue() }) }, this) }, this), this._.domOnChangeRegistered = !0);
              this.on("change", b) } },
          keyboardFocusable: !0
        }, !0);
        CKEDITOR.ui.dialog.fileButton.prototype =
          new CKEDITOR.ui.dialog.button;
        CKEDITOR.ui.dialog.fieldset.prototype = CKEDITOR.tools.clone(CKEDITOR.ui.dialog.hbox.prototype);
        CKEDITOR.dialog.addUIElement("text", d);
        CKEDITOR.dialog.addUIElement("password", d);
        CKEDITOR.dialog.addUIElement("textarea", b);
        CKEDITOR.dialog.addUIElement("checkbox", b);
        CKEDITOR.dialog.addUIElement("radio", b);
        CKEDITOR.dialog.addUIElement("button", b);
        CKEDITOR.dialog.addUIElement("select", b);
        CKEDITOR.dialog.addUIElement("file", b);
        CKEDITOR.dialog.addUIElement("fileButton", b);
        CKEDITOR.dialog.addUIElement("html",
          b);
        CKEDITOR.dialog.addUIElement("fieldset", { build: function(a, b, c) { for (var e = b.children, g, d = [], k = [], l = 0; l < e.length && (g = e[l]); l++) { var t = [];
              d.push(t);
              k.push(CKEDITOR.dialog._.uiElementBuilders[g.type].build(a, g, t)) } return new CKEDITOR.ui.dialog[b.type](a, k, d, c, b) } })
      }
    }), CKEDITOR.DIALOG_RESIZE_NONE = 0, CKEDITOR.DIALOG_RESIZE_WIDTH = 1, CKEDITOR.DIALOG_RESIZE_HEIGHT = 2, CKEDITOR.DIALOG_RESIZE_BOTH = 3, CKEDITOR.DIALOG_STATE_IDLE = 1, CKEDITOR.DIALOG_STATE_BUSY = 2,
    function() {
      function a() {
        for (var a = this._.tabIdList.length,
            b = CKEDITOR.tools.indexOf(this._.tabIdList, this._.currentTabId) + a, c = b - 1; c > b - a; c--)
          if (this._.tabs[this._.tabIdList[c % a]][0].$.offsetHeight) return this._.tabIdList[c % a];
        return null
      }

      function d() { for (var a = this._.tabIdList.length, b = CKEDITOR.tools.indexOf(this._.tabIdList, this._.currentTabId), c = b + 1; c < b + a; c++)
          if (this._.tabs[this._.tabIdList[c % a]][0].$.offsetHeight) return this._.tabIdList[c % a]; return null }

      function b(a, b) {
        for (var c = a.$.getElementsByTagName("input"), f = 0, e = c.length; f < e; f++) {
          var g = new CKEDITOR.dom.element(c[f]);
          "text" == g.getAttribute("type").toLowerCase() && (b ? (g.setAttribute("value", g.getCustomData("fake_value") || ""), g.removeCustomData("fake_value")) : (g.setCustomData("fake_value", g.getAttribute("value")), g.setAttribute("value", "")))
        }
      }

      function c(a, b) { var c = this.getInputElement();
        c && (a ? c.removeAttribute("aria-invalid") : c.setAttribute("aria-invalid", !0));
        a || (this.select ? this.select() : this.focus());
        b && alert(b);
        this.fire("validated", { valid: a, msg: b }) }

      function g() { var a = this.getInputElement();
        a && a.removeAttribute("aria-invalid") }

      function l(a) {
        var b = CKEDITOR.dom.element.createFromHtml(CKEDITOR.addTemplate("dialog", v).output({ id: CKEDITOR.tools.getNextNumber(), editorId: a.id, langDir: a.lang.dir, langCode: a.langCode, editorDialogClass: "cke_editor_" + a.name.replace(/\./g, "\\.") + "_dialog", closeTitle: a.lang.common.close, hidpi: CKEDITOR.env.hidpi ? "cke_hidpi" : "" })),
          c = b.getChild([0, 0, 0, 0, 0]),
          f = c.getChild(0),
          e = c.getChild(1);
        a.plugins.clipboard && CKEDITOR.plugins.clipboard.preventDefaultDropOnElement(c);
        !CKEDITOR.env.ie || CKEDITOR.env.quirks ||
          CKEDITOR.env.edge || (a = "javascript:void(function(){" + encodeURIComponent("document.open();(" + CKEDITOR.tools.fixDomain + ")();document.close();") + "}())", CKEDITOR.dom.element.createFromHtml('\x3ciframe frameBorder\x3d"0" class\x3d"cke_iframe_shim" src\x3d"' + a + '" tabIndex\x3d"-1"\x3e\x3c/iframe\x3e').appendTo(c.getParent()));
        f.unselectable();
        e.unselectable();
        return { element: b, parts: { dialog: b.getChild(0), title: f, close: e, tabs: c.getChild(2), contents: c.getChild([3, 0, 0, 0]), footer: c.getChild([3, 0, 1, 0]) } }
      }

      function k(a,
        b, c) { this.element = b;
        this.focusIndex = c;
        this.tabIndex = 0;
        this.isFocusable = function() { return !b.getAttribute("disabled") && b.isVisible() };
        this.focus = function() { a._.currentFocusIndex = this.focusIndex;
          this.element.focus() };
        b.on("keydown", function(a) { a.data.getKeystroke() in { 32: 1, 13: 1 } && this.fire("click") });
        b.on("focus", function() { this.fire("mouseover") });
        b.on("blur", function() { this.fire("mouseout") }) }

      function e(a) {
        function b() { a.layout() }
        var c = CKEDITOR.document.getWindow();
        c.on("resize", b);
        a.on("hide", function() {
          c.removeListener("resize",
            b)
        })
      }

      function h(a, b) { this._ = { dialog: a };
        CKEDITOR.tools.extend(this, b) }

      function m(a) {
        function b(c) { var k = a.getSize(),
            m = CKEDITOR.document.getWindow().getViewPaneSize(),
            l = c.data.$.screenX,
            n = c.data.$.screenY,
            r = l - f.x,
            t = n - f.y;
          f = { x: l, y: n };
          e.x += r;
          e.y += t;
          a.move(e.x + h[3] < d ? -h[3] : e.x - h[1] > m.width - k.width - d ? m.width - k.width + ("rtl" == g.lang.dir ? 0 : h[1]) : e.x, e.y + h[0] < d ? -h[0] : e.y - h[2] > m.height - k.height - d ? m.height - k.height + h[2] : e.y, 1);
          c.data.preventDefault() }

        function c() {
          CKEDITOR.document.removeListener("mousemove",
            b);
          CKEDITOR.document.removeListener("mouseup", c);
          if (CKEDITOR.env.ie6Compat) { var a = z.getChild(0).getFrameDocument();
            a.removeListener("mousemove", b);
            a.removeListener("mouseup", c) }
        }
        var f = null,
          e = null,
          g = a.getParentEditor(),
          d = g.config.dialog_magnetDistance,
          h = CKEDITOR.skin.margins || [0, 0, 0, 0];
        "undefined" == typeof d && (d = 20);
        a.parts.title.on("mousedown", function(g) {
          f = { x: g.data.$.screenX, y: g.data.$.screenY };
          CKEDITOR.document.on("mousemove", b);
          CKEDITOR.document.on("mouseup", c);
          e = a.getPosition();
          if (CKEDITOR.env.ie6Compat) {
            var d =
              z.getChild(0).getFrameDocument();
            d.on("mousemove", b);
            d.on("mouseup", c)
          }
          g.data.preventDefault()
        }, a)
      }

      function f(a) {
        function b(c) {
          var n = "rtl" == g.lang.dir,
            r = l.width,
            t = l.height,
            p = r + (c.data.$.screenX - m.x) * (n ? -1 : 1) * (a._.moved ? 1 : 2),
            u = t + (c.data.$.screenY - m.y) * (a._.moved ? 1 : 2),
            w = a._.element.getFirst(),
            w = n && w.getComputedStyle("right"),
            q = a.getPosition();
          q.y + u > k.height && (u = k.height - q.y);
          (n ? w : q.x) + p > k.width && (p = k.width - (n ? w : q.x));
          if (e == CKEDITOR.DIALOG_RESIZE_WIDTH || e == CKEDITOR.DIALOG_RESIZE_BOTH) r = Math.max(f.minWidth ||
            0, p - d);
          if (e == CKEDITOR.DIALOG_RESIZE_HEIGHT || e == CKEDITOR.DIALOG_RESIZE_BOTH) t = Math.max(f.minHeight || 0, u - h);
          a.resize(r, t);
          a._.moved || a.layout();
          c.data.preventDefault()
        }

        function c() { CKEDITOR.document.removeListener("mouseup", c);
          CKEDITOR.document.removeListener("mousemove", b);
          n && (n.remove(), n = null); if (CKEDITOR.env.ie6Compat) { var a = z.getChild(0).getFrameDocument();
            a.removeListener("mouseup", c);
            a.removeListener("mousemove", b) } }
        var f = a.definition,
          e = f.resizable;
        if (e != CKEDITOR.DIALOG_RESIZE_NONE) {
          var g = a.getParentEditor(),
            d, h, k, m, l, n, r = CKEDITOR.tools.addFunction(function(f) {
              l = a.getSize();
              var e = a.parts.contents;
              e.$.getElementsByTagName("iframe").length && (n = CKEDITOR.dom.element.createFromHtml('\x3cdiv class\x3d"cke_dialog_resize_cover" style\x3d"height: 100%; position: absolute; width: 100%;"\x3e\x3c/div\x3e'), e.append(n));
              h = l.height - a.parts.contents.getSize("height", !(CKEDITOR.env.gecko || CKEDITOR.env.ie && CKEDITOR.env.quirks));
              d = l.width - a.parts.contents.getSize("width", 1);
              m = { x: f.screenX, y: f.screenY };
              k = CKEDITOR.document.getWindow().getViewPaneSize();
              CKEDITOR.document.on("mousemove", b);
              CKEDITOR.document.on("mouseup", c);
              CKEDITOR.env.ie6Compat && (e = z.getChild(0).getFrameDocument(), e.on("mousemove", b), e.on("mouseup", c));
              f.preventDefault && f.preventDefault()
            });
          a.on("load", function() {
            var b = "";
            e == CKEDITOR.DIALOG_RESIZE_WIDTH ? b = " cke_resizer_horizontal" : e == CKEDITOR.DIALOG_RESIZE_HEIGHT && (b = " cke_resizer_vertical");
            b = CKEDITOR.dom.element.createFromHtml('\x3cdiv class\x3d"cke_resizer' + b + " cke_resizer_" + g.lang.dir + '" title\x3d"' + CKEDITOR.tools.htmlEncode(g.lang.common.resize) +
              '" onmousedown\x3d"CKEDITOR.tools.callFunction(' + r + ', event )"\x3e' + ("ltr" == g.lang.dir ? "◢" : "◣") + "\x3c/div\x3e");
            a.parts.footer.append(b, 1)
          });
          g.on("destroy", function() { CKEDITOR.tools.removeFunction(r) })
        }
      }

      function n(a) { a.data.preventDefault(1) }

      function p(a) {
        var b = CKEDITOR.document.getWindow(),
          c = a.config,
          f = CKEDITOR.skinName || a.config.skin,
          e = c.dialog_backgroundCoverColor || ("moono-lisa" == f ? "black" : "white"),
          f = c.dialog_backgroundCoverOpacity,
          g = c.baseFloatZIndex,
          c = CKEDITOR.tools.genKey(e, f, g),
          d = C[c];
        d ? d.show() :
          (g = ['\x3cdiv tabIndex\x3d"-1" style\x3d"position: ', CKEDITOR.env.ie6Compat ? "absolute" : "fixed", "; z-index: ", g, "; top: 0px; left: 0px; ", CKEDITOR.env.ie6Compat ? "" : "background-color: " + e, '" class\x3d"cke_dialog_background_cover"\x3e'], CKEDITOR.env.ie6Compat && (e = "\x3chtml\x3e\x3cbody style\x3d\\'background-color:" + e + ";\\'\x3e\x3c/body\x3e\x3c/html\x3e", g.push('\x3ciframe hidefocus\x3d"true" frameborder\x3d"0" id\x3d"cke_dialog_background_iframe" src\x3d"javascript:'), g.push("void((function(){" + encodeURIComponent("document.open();(" +
            CKEDITOR.tools.fixDomain + ")();document.write( '" + e + "' );document.close();") + "})())"), g.push('" style\x3d"position:absolute;left:0;top:0;width:100%;height: 100%;filter: progid:DXImageTransform.Microsoft.Alpha(opacity\x3d0)"\x3e\x3c/iframe\x3e')), g.push("\x3c/div\x3e"), d = CKEDITOR.dom.element.createFromHtml(g.join("")), d.setOpacity(void 0 !== f ? f : .5), d.on("keydown", n), d.on("keypress", n), d.on("keyup", n), d.appendTo(CKEDITOR.document.getBody()), C[c] = d);
        a.focusManager.add(d);
        z = d;
        a = function() {
          var a = b.getViewPaneSize();
          d.setStyles({ width: a.width + "px", height: a.height + "px" })
        };
        var h = function() { var a = b.getScrollPosition(),
            c = CKEDITOR.dialog._.currentTop;
          d.setStyles({ left: a.x + "px", top: a.y + "px" }); if (c) { do a = c.getPosition(), c.move(a.x, a.y); while (c = c._.parentDialog) } };
        y = a;
        b.on("resize", a);
        a();
        CKEDITOR.env.mac && CKEDITOR.env.webkit || d.focus();
        if (CKEDITOR.env.ie6Compat) {
          var k = function() { h();
            arguments.callee.prevScrollHandler.apply(this, arguments) };
          b.$.setTimeout(function() {
            k.prevScrollHandler = window.onscroll || function() {};
            window.onscroll = k
          }, 0);
          h()
        }
      }

      function q(a) { z && (a.focusManager.remove(z), a = CKEDITOR.document.getWindow(), z.hide(), a.removeListener("resize", y), CKEDITOR.env.ie6Compat && a.$.setTimeout(function() { window.onscroll = window.onscroll && window.onscroll.prevScrollHandler || null }, 0), y = null) }
      var w = CKEDITOR.tools.cssLength,
        v = '\x3cdiv class\x3d"cke_reset_all {editorId} {editorDialogClass} {hidpi}" dir\x3d"{langDir}" lang\x3d"{langCode}" role\x3d"dialog" aria-labelledby\x3d"cke_dialog_title_{id}"\x3e\x3ctable class\x3d"cke_dialog ' +
        CKEDITOR.env.cssClass + ' cke_{langDir}" style\x3d"position:absolute" role\x3d"presentation"\x3e\x3ctr\x3e\x3ctd role\x3d"presentation"\x3e\x3cdiv class\x3d"cke_dialog_body" role\x3d"presentation"\x3e\x3cdiv id\x3d"cke_dialog_title_{id}" class\x3d"cke_dialog_title" role\x3d"presentation"\x3e\x3c/div\x3e\x3ca id\x3d"cke_dialog_close_button_{id}" class\x3d"cke_dialog_close_button" href\x3d"javascript:void(0)" title\x3d"{closeTitle}" role\x3d"button"\x3e\x3cspan class\x3d"cke_label"\x3eX\x3c/span\x3e\x3c/a\x3e\x3cdiv id\x3d"cke_dialog_tabs_{id}" class\x3d"cke_dialog_tabs" role\x3d"tablist"\x3e\x3c/div\x3e\x3ctable class\x3d"cke_dialog_contents" role\x3d"presentation"\x3e\x3ctr\x3e\x3ctd id\x3d"cke_dialog_contents_{id}" class\x3d"cke_dialog_contents_body" role\x3d"presentation"\x3e\x3c/td\x3e\x3c/tr\x3e\x3ctr\x3e\x3ctd id\x3d"cke_dialog_footer_{id}" class\x3d"cke_dialog_footer" role\x3d"presentation"\x3e\x3c/td\x3e\x3c/tr\x3e\x3c/table\x3e\x3c/div\x3e\x3c/td\x3e\x3c/tr\x3e\x3c/table\x3e\x3c/div\x3e';
      CKEDITOR.dialog = function(b, e) {
        function h() { var a = A._.focusList;
          a.sort(function(a, b) { return a.tabIndex != b.tabIndex ? b.tabIndex - a.tabIndex : a.focusIndex - b.focusIndex }); for (var b = a.length, c = 0; c < b; c++) a[c].focusIndex = c }

        function k(a) {
          var b = A._.focusList;
          a = a || 0;
          if (!(1 > b.length)) {
            var c = A._.currentFocusIndex;
            A._.tabBarMode && 0 > a && (c = 0);
            try { b[c].getInputElement().$.blur() } catch (f) {}
            var e = c,
              g = 1 < A._.pageCount;
            do {
              e += a;
              if (g && !A._.tabBarMode && (e == b.length || -1 == e)) {
                A._.tabBarMode = !0;
                A._.tabs[A._.currentTabId][0].focus();
                A._.currentFocusIndex = -1;
                return
              }
              e = (e + b.length) % b.length;
              if (e == c) break
            } while (a && !b[e].isFocusable());
            b[e].focus();
            "text" == b[e].type && b[e].select()
          }
        }

        function n(c) {
          if (A == CKEDITOR.dialog._.currentTop) {
            var f = c.data.getKeystroke(),
              e = "rtl" == b.lang.dir,
              g = [37, 38, 39, 40];
            B = v = 0;
            if (9 == f || f == CKEDITOR.SHIFT + 9) k(f == CKEDITOR.SHIFT + 9 ? -1 : 1), B = 1;
            else if (f == CKEDITOR.ALT + 121 && !A._.tabBarMode && 1 < A.getPageCount()) A._.tabBarMode = !0, A._.tabs[A._.currentTabId][0].focus(), A._.currentFocusIndex = -1, B = 1;
            else if (-1 != CKEDITOR.tools.indexOf(g,
                f) && A._.tabBarMode) f = -1 != CKEDITOR.tools.indexOf([e ? 39 : 37, 38], f) ? a.call(A) : d.call(A), A.selectPage(f), A._.tabs[f][0].focus(), B = 1;
            else if (13 != f && 32 != f || !A._.tabBarMode)
              if (13 == f) f = c.data.getTarget(), f.is("a", "button", "select", "textarea") || f.is("input") && "button" == f.$.type || ((f = this.getButton("ok")) && CKEDITOR.tools.setTimeout(f.click, 0, f), B = 1), v = 1;
              else if (27 == f)(f = this.getButton("cancel")) ? CKEDITOR.tools.setTimeout(f.click, 0, f) : !1 !== this.fire("cancel", { hide: !0 }).hide && this.hide(), v = 1;
            else return;
            else this.selectPage(this._.currentTabId),
              this._.tabBarMode = !1, this._.currentFocusIndex = -1, k(1), B = 1;
            r(c)
          }
        }

        function r(a) { B ? a.data.preventDefault(1) : v && a.data.stopPropagation() }
        var p = CKEDITOR.dialog._.dialogDefinitions[e],
          u = CKEDITOR.tools.clone(t),
          w = b.config.dialog_buttonsOrder || "OS",
          q = b.lang.dir,
          y = {},
          B, v;
        ("OS" == w && CKEDITOR.env.mac || "rtl" == w && "ltr" == q || "ltr" == w && "rtl" == q) && u.buttons.reverse();
        p = CKEDITOR.tools.extend(p(b), u);
        p = CKEDITOR.tools.clone(p);
        p = new x(this, p);
        u = l(b);
        this._ = {
          editor: b,
          element: u.element,
          name: e,
          contentSize: { width: 0, height: 0 },
          size: { width: 0, height: 0 },
          contents: {},
          buttons: {},
          accessKeyMap: {},
          tabs: {},
          tabIdList: [],
          currentTabId: null,
          currentTabIndex: null,
          pageCount: 0,
          lastTab: null,
          tabBarMode: !1,
          focusList: [],
          currentFocusIndex: 0,
          hasFocus: !1
        };
        this.parts = u.parts;
        CKEDITOR.tools.setTimeout(function() { b.fire("ariaWidget", this.parts.contents) }, 0, this);
        u = { position: CKEDITOR.env.ie6Compat ? "absolute" : "fixed", top: 0, visibility: "hidden" };
        u["rtl" == q ? "right" : "left"] = 0;
        this.parts.dialog.setStyles(u);
        CKEDITOR.event.call(this);
        this.definition = p = CKEDITOR.fire("dialogDefinition", { name: e, definition: p }, b).definition;
        if (!("removeDialogTabs" in b._) && b.config.removeDialogTabs) { u = b.config.removeDialogTabs.split(";"); for (q = 0; q < u.length; q++)
            if (w = u[q].split(":"), 2 == w.length) { var z = w[0];
              y[z] || (y[z] = []);
              y[z].push(w[1]) }
          b._.removeDialogTabs = y }
        if (b._.removeDialogTabs && (y = b._.removeDialogTabs[e]))
          for (q = 0; q < y.length; q++) p.removeContents(y[q]);
        if (p.onLoad) this.on("load", p.onLoad);
        if (p.onShow) this.on("show", p.onShow);
        if (p.onHide) this.on("hide", p.onHide);
        if (p.onOk) this.on("ok", function(a) {
          b.fire("saveSnapshot");
          setTimeout(function() { b.fire("saveSnapshot") }, 0);
          !1 === p.onOk.call(this, a) && (a.data.hide = !1)
        });
        this.state = CKEDITOR.DIALOG_STATE_IDLE;
        if (p.onCancel) this.on("cancel", function(a) {!1 === p.onCancel.call(this, a) && (a.data.hide = !1) });
        var A = this,
          N = function(a) { var b = A._.contents,
              c = !1,
              f; for (f in b)
              for (var e in b[f])
                if (c = a.call(this, b[f][e])) return };
        this.on("ok", function(a) {
          N(function(b) {
            if (b.validate) {
              var f = b.validate(this),
                e = "string" == typeof f || !1 === f;
              e && (a.data.hide = !1, a.stop());
              c.call(b, !e, "string" == typeof f ?
                f : void 0);
              return e
            }
          })
        }, this, null, 0);
        this.on("cancel", function(a) { N(function(c) { if (c.isChanged()) return b.config.dialog_noConfirmCancel || confirm(b.lang.common.confirmCancel) || (a.data.hide = !1), !0 }) }, this, null, 0);
        this.parts.close.on("click", function(a) {!1 !== this.fire("cancel", { hide: !0 }).hide && this.hide();
          a.data.preventDefault() }, this);
        this.changeFocus = k;
        var C = this._.element;
        b.focusManager.add(C, 1);
        this.on("show", function() { C.on("keydown", n, this); if (CKEDITOR.env.gecko) C.on("keypress", r, this) });
        this.on("hide",
          function() { C.removeListener("keydown", n);
            CKEDITOR.env.gecko && C.removeListener("keypress", r);
            N(function(a) { g.apply(a) }) });
        this.on("iframeAdded", function(a) {
          (new CKEDITOR.dom.document(a.data.iframe.$.contentWindow.document)).on("keydown", n, this, null, 0) });
        this.on("show", function() {
          h();
          var a = 1 < A._.pageCount;
          b.config.dialog_startupFocusTab && a ? (A._.tabBarMode = !0, A._.tabs[A._.currentTabId][0].focus(), A._.currentFocusIndex = -1) : this._.hasFocus || (this._.currentFocusIndex = a ? -1 : this._.focusList.length - 1, p.onFocus ?
            (a = p.onFocus.call(this)) && a.focus() : k(1))
        }, this, null, 4294967295);
        if (CKEDITOR.env.ie6Compat) this.on("load", function() { var a = this.getElement(),
            b = a.getFirst();
          b.remove();
          b.appendTo(a) }, this);
        m(this);
        f(this);
        (new CKEDITOR.dom.text(p.title, CKEDITOR.document)).appendTo(this.parts.title);
        for (q = 0; q < p.contents.length; q++)(y = p.contents[q]) && this.addPage(y);
        this.parts.tabs.on("click", function(a) {
          var b = a.data.getTarget();
          b.hasClass("cke_dialog_tab") && (b = b.$.id, this.selectPage(b.substring(4, b.lastIndexOf("_"))),
            this._.tabBarMode && (this._.tabBarMode = !1, this._.currentFocusIndex = -1, k(1)), a.data.preventDefault())
        }, this);
        q = [];
        y = CKEDITOR.dialog._.uiElementBuilders.hbox.build(this, { type: "hbox", className: "cke_dialog_footer_buttons", widths: [], children: p.buttons }, q).getChild();
        this.parts.footer.setHtml(q.join(""));
        for (q = 0; q < y.length; q++) this._.buttons[y[q].id] = y[q]
      };
      CKEDITOR.dialog.prototype = {
        destroy: function() { this.hide();
          this._.element.remove() },
        resize: function() {
          return function(a, b) {
            this._.contentSize && this._.contentSize.width ==
              a && this._.contentSize.height == b || (CKEDITOR.dialog.fire("resize", { dialog: this, width: a, height: b }, this._.editor), this.fire("resize", { width: a, height: b }, this._.editor), this.parts.contents.setStyles({ width: a + "px", height: b + "px" }), "rtl" == this._.editor.lang.dir && this._.position && (this._.position.x = CKEDITOR.document.getWindow().getViewPaneSize().width - this._.contentSize.width - parseInt(this._.element.getFirst().getStyle("right"), 10)), this._.contentSize = { width: a, height: b })
          }
        }(),
        getSize: function() {
          var a = this._.element.getFirst();
          return { width: a.$.offsetWidth || 0, height: a.$.offsetHeight || 0 }
        },
        move: function(a, b, c) {
          var f = this._.element.getFirst(),
            e = "rtl" == this._.editor.lang.dir,
            g = "fixed" == f.getComputedStyle("position");
          CKEDITOR.env.ie && f.setStyle("zoom", "100%");
          g && this._.position && this._.position.x == a && this._.position.y == b || (this._.position = { x: a, y: b }, g || (g = CKEDITOR.document.getWindow().getScrollPosition(), a += g.x, b += g.y), e && (g = this.getSize(), a = CKEDITOR.document.getWindow().getViewPaneSize().width - g.width - a), b = { top: (0 < b ? b : 0) + "px" },
            b[e ? "right" : "left"] = (0 < a ? a : 0) + "px", f.setStyles(b), c && (this._.moved = 1))
        },
        getPosition: function() { return CKEDITOR.tools.extend({}, this._.position) },
        show: function() {
          var a = this._.element,
            b = this.definition;
          a.getParent() && a.getParent().equals(CKEDITOR.document.getBody()) ? a.setStyle("display", "block") : a.appendTo(CKEDITOR.document.getBody());
          this.resize(this._.contentSize && this._.contentSize.width || b.width || b.minWidth, this._.contentSize && this._.contentSize.height || b.height || b.minHeight);
          this.reset();
          null ===
            this._.currentTabId && this.selectPage(this.definition.contents[0].id);
          null === CKEDITOR.dialog._.currentZIndex && (CKEDITOR.dialog._.currentZIndex = this._.editor.config.baseFloatZIndex);
          this._.element.getFirst().setStyle("z-index", CKEDITOR.dialog._.currentZIndex += 10);
          null === CKEDITOR.dialog._.currentTop ? (CKEDITOR.dialog._.currentTop = this, this._.parentDialog = null, p(this._.editor)) : (this._.parentDialog = CKEDITOR.dialog._.currentTop, this._.parentDialog.getElement().getFirst().$.style.zIndex -= Math.floor(this._.editor.config.baseFloatZIndex /
            2), CKEDITOR.dialog._.currentTop = this);
          a.on("keydown", G);
          a.on("keyup", D);
          this._.hasFocus = !1;
          for (var c in b.contents)
            if (b.contents[c]) {
              var a = b.contents[c],
                f = this._.tabs[a.id],
                g = a.requiredContent,
                d = 0;
              if (f) {
                for (var h in this._.contents[a.id]) { var k = this._.contents[a.id][h]; "hbox" != k.type && "vbox" != k.type && k.getInputElement() && (k.requiredContent && !this._.editor.activeFilter.check(k.requiredContent) ? k.disable() : (k.enable(), d++)) }!d || g && !this._.editor.activeFilter.check(g) ? f[0].addClass("cke_dialog_tab_disabled") :
                  f[0].removeClass("cke_dialog_tab_disabled")
              }
            }
          CKEDITOR.tools.setTimeout(function() { this.layout();
            e(this);
            this.parts.dialog.setStyle("visibility", "");
            this.fireOnce("load", {});
            CKEDITOR.ui.fire("ready", this);
            this.fire("show", {});
            this._.editor.fire("dialogShow", this);
            this._.parentDialog || this._.editor.focusManager.lock();
            this.foreach(function(a) { a.setInitValue && a.setInitValue() }) }, 100, this)
        },
        layout: function() {
          var a = this.parts.dialog,
            b = this.getSize(),
            c = CKEDITOR.document.getWindow().getViewPaneSize(),
            f =
            (c.width - b.width) / 2,
            e = (c.height - b.height) / 2;
          CKEDITOR.env.ie6Compat || (b.height + (0 < e ? e : 0) > c.height || b.width + (0 < f ? f : 0) > c.width ? a.setStyle("position", "absolute") : a.setStyle("position", "fixed"));
          this.move(this._.moved ? this._.position.x : f, this._.moved ? this._.position.y : e)
        },
        foreach: function(a) { for (var b in this._.contents)
            for (var c in this._.contents[b]) a.call(this, this._.contents[b][c]); return this },
        reset: function() { var a = function(a) { a.reset && a.reset(1) }; return function() { this.foreach(a); return this } }(),
        setupContent: function() { var a = arguments;
          this.foreach(function(b) { b.setup && b.setup.apply(b, a) }) },
        commitContent: function() { var a = arguments;
          this.foreach(function(b) { CKEDITOR.env.ie && this._.currentFocusIndex == b.focusIndex && b.getInputElement().$.blur();
            b.commit && b.commit.apply(b, a) }) },
        hide: function() {
          if (this.parts.dialog.isVisible()) {
            this.fire("hide", {});
            this._.editor.fire("dialogHide", this);
            this.selectPage(this._.tabIdList[0]);
            var a = this._.element;
            a.setStyle("display", "none");
            this.parts.dialog.setStyle("visibility",
              "hidden");
            for (I(this); CKEDITOR.dialog._.currentTop != this;) CKEDITOR.dialog._.currentTop.hide();
            if (this._.parentDialog) { var b = this._.parentDialog.getElement().getFirst();
              b.setStyle("z-index", parseInt(b.$.style.zIndex, 10) + Math.floor(this._.editor.config.baseFloatZIndex / 2)) } else q(this._.editor);
            if (CKEDITOR.dialog._.currentTop = this._.parentDialog) CKEDITOR.dialog._.currentZIndex -= 10;
            else {
              CKEDITOR.dialog._.currentZIndex = null;
              a.removeListener("keydown", G);
              a.removeListener("keyup", D);
              var c = this._.editor;
              c.focus();
              setTimeout(function() { c.focusManager.unlock();
                CKEDITOR.env.iOS && c.window.focus() }, 0)
            }
            delete this._.parentDialog;
            this.foreach(function(a) { a.resetInitValue && a.resetInitValue() });
            this.setState(CKEDITOR.DIALOG_STATE_IDLE)
          }
        },
        addPage: function(a) {
          if (!a.requiredContent || this._.editor.filter.check(a.requiredContent)) {
            for (var b = [], c = a.label ? ' title\x3d"' + CKEDITOR.tools.htmlEncode(a.label) + '"' : "", f = CKEDITOR.dialog._.uiElementBuilders.vbox.build(this, {
                type: "vbox",
                className: "cke_dialog_page_contents",
                children: a.elements,
                expand: !!a.expand,
                padding: a.padding,
                style: a.style || "width: 100%;"
              }, b), e = this._.contents[a.id] = {}, g = f.getChild(), d = 0; f = g.shift();) f.notAllowed || "hbox" == f.type || "vbox" == f.type || d++, e[f.id] = f, "function" == typeof f.getChild && g.push.apply(g, f.getChild());
            d || (a.hidden = !0);
            b = CKEDITOR.dom.element.createFromHtml(b.join(""));
            b.setAttribute("role", "tabpanel");
            f = CKEDITOR.env;
            e = "cke_" + a.id + "_" + CKEDITOR.tools.getNextNumber();
            c = CKEDITOR.dom.element.createFromHtml(['\x3ca class\x3d"cke_dialog_tab"',
              0 < this._.pageCount ? " cke_last" : "cke_first", c, a.hidden ? ' style\x3d"display:none"' : "", ' id\x3d"', e, '"', f.gecko && !f.hc ? "" : ' href\x3d"javascript:void(0)"', ' tabIndex\x3d"-1" hidefocus\x3d"true" role\x3d"tab"\x3e', a.label, "\x3c/a\x3e"
            ].join(""));
            b.setAttribute("aria-labelledby", e);
            this._.tabs[a.id] = [c, b];
            this._.tabIdList.push(a.id);
            !a.hidden && this._.pageCount++;
            this._.lastTab = c;
            this.updateStyle();
            b.setAttribute("name", a.id);
            b.appendTo(this.parts.contents);
            c.unselectable();
            this.parts.tabs.append(c);
            a.accessKey &&
              (F(this, this, "CTRL+" + a.accessKey, K, H), this._.accessKeyMap["CTRL+" + a.accessKey] = a.id)
          }
        },
        selectPage: function(a) {
          if (this._.currentTabId != a && !this._.tabs[a][0].hasClass("cke_dialog_tab_disabled") && !1 !== this.fire("selectPage", { page: a, currentPage: this._.currentTabId })) {
            for (var c in this._.tabs) { var f = this._.tabs[c][0],
                e = this._.tabs[c][1];
              c != a && (f.removeClass("cke_dialog_tab_selected"), e.hide());
              e.setAttribute("aria-hidden", c != a) }
            var g = this._.tabs[a];
            g[0].addClass("cke_dialog_tab_selected");
            CKEDITOR.env.ie6Compat ||
              CKEDITOR.env.ie7Compat ? (b(g[1]), g[1].show(), setTimeout(function() { b(g[1], 1) }, 0)) : g[1].show();
            this._.currentTabId = a;
            this._.currentTabIndex = CKEDITOR.tools.indexOf(this._.tabIdList, a)
          }
        },
        updateStyle: function() { this.parts.dialog[(1 === this._.pageCount ? "add" : "remove") + "Class"]("cke_single_page") },
        hidePage: function(b) { var c = this._.tabs[b] && this._.tabs[b][0];
          c && 1 != this._.pageCount && c.isVisible() && (b == this._.currentTabId && this.selectPage(a.call(this)), c.hide(), this._.pageCount--, this.updateStyle()) },
        showPage: function(a) {
          if (a =
            this._.tabs[a] && this._.tabs[a][0]) a.show(), this._.pageCount++, this.updateStyle()
        },
        getElement: function() { return this._.element },
        getName: function() { return this._.name },
        getContentElement: function(a, b) { var c = this._.contents[a]; return c && c[b] },
        getValueOf: function(a, b) { return this.getContentElement(a, b).getValue() },
        setValueOf: function(a, b, c) { return this.getContentElement(a, b).setValue(c) },
        getButton: function(a) { return this._.buttons[a] },
        click: function(a) { return this._.buttons[a].click() },
        disableButton: function(a) { return this._.buttons[a].disable() },
        enableButton: function(a) { return this._.buttons[a].enable() },
        getPageCount: function() { return this._.pageCount },
        getParentEditor: function() { return this._.editor },
        getSelectedElement: function() { return this.getParentEditor().getSelection().getSelectedElement() },
        addFocusable: function(a, b) { if ("undefined" == typeof b) b = this._.focusList.length, this._.focusList.push(new k(this, a, b));
          else { this._.focusList.splice(b, 0, new k(this, a, b)); for (var c = b + 1; c < this._.focusList.length; c++) this._.focusList[c].focusIndex++ } },
        setState: function(a) {
          if (this.state != a) {
            this.state = a;
            if (a == CKEDITOR.DIALOG_STATE_BUSY) { if (!this.parts.spinner) { var b = this.getParentEditor().lang.dir,
                  c = { attributes: { "class": "cke_dialog_spinner" }, styles: { "float": "rtl" == b ? "right" : "left" } };
                c.styles["margin-" + ("rtl" == b ? "left" : "right")] = "8px";
                this.parts.spinner = CKEDITOR.document.createElement("div", c);
                this.parts.spinner.setHtml("\x26#8987;");
                this.parts.spinner.appendTo(this.parts.title, 1) } this.parts.spinner.show();
              this.getButton("ok").disable() } else a ==
              CKEDITOR.DIALOG_STATE_IDLE && (this.parts.spinner && this.parts.spinner.hide(), this.getButton("ok").enable());
            this.fire("state", a)
          }
        }
      };
      CKEDITOR.tools.extend(CKEDITOR.dialog, {
        add: function(a, b) { this._.dialogDefinitions[a] && "function" != typeof b || (this._.dialogDefinitions[a] = b) },
        exists: function(a) { return !!this._.dialogDefinitions[a] },
        getCurrent: function() { return CKEDITOR.dialog._.currentTop },
        isTabEnabled: function(a, b, c) {
          a = a.config.removeDialogTabs;
          return !(a && a.match(new RegExp("(?:^|;)" + b + ":" + c + "(?:$|;)",
            "i")))
        },
        okButton: function() { var a = function(a, b) { b = b || {}; return CKEDITOR.tools.extend({ id: "ok", type: "button", label: a.lang.common.ok, "class": "cke_dialog_ui_button_ok", onClick: function(a) { a = a.data.dialog;!1 !== a.fire("ok", { hide: !0 }).hide && a.hide() } }, b, !0) };
          a.type = "button";
          a.override = function(b) { return CKEDITOR.tools.extend(function(c) { return a(c, b) }, { type: "button" }, !0) }; return a }(),
        cancelButton: function() {
          var a = function(a, b) {
            b = b || {};
            return CKEDITOR.tools.extend({
              id: "cancel",
              type: "button",
              label: a.lang.common.cancel,
              "class": "cke_dialog_ui_button_cancel",
              onClick: function(a) { a = a.data.dialog;!1 !== a.fire("cancel", { hide: !0 }).hide && a.hide() }
            }, b, !0)
          };
          a.type = "button";
          a.override = function(b) { return CKEDITOR.tools.extend(function(c) { return a(c, b) }, { type: "button" }, !0) };
          return a
        }(),
        addUIElement: function(a, b) { this._.uiElementBuilders[a] = b }
      });
      CKEDITOR.dialog._ = { uiElementBuilders: {}, dialogDefinitions: {}, currentTop: null, currentZIndex: null };
      CKEDITOR.event.implementOn(CKEDITOR.dialog);
      CKEDITOR.event.implementOn(CKEDITOR.dialog.prototype);
      var t = { resizable: CKEDITOR.DIALOG_RESIZE_BOTH, minWidth: 600, minHeight: 400, buttons: [CKEDITOR.dialog.okButton, CKEDITOR.dialog.cancelButton] },
        u = function(a, b, c) { for (var f = 0, e; e = a[f]; f++)
            if (e.id == b || c && e[c] && (e = u(e[c], b, c))) return e; return null },
        r = function(a, b, c, f, e) { if (c) { for (var g = 0, d; d = a[g]; g++) { if (d.id == c) return a.splice(g, 0, b), b; if (f && d[f] && (d = r(d[f], b, c, f, !0))) return d } if (e) return null } a.push(b); return b },
        B = function(a, b, c) {
          for (var f = 0, e; e = a[f]; f++) {
            if (e.id == b) return a.splice(f, 1);
            if (c && e[c] && (e = B(e[c],
                b, c))) return e
          }
          return null
        },
        x = function(a, b) { this.dialog = a; for (var c = b.contents, f = 0, e; e = c[f]; f++) c[f] = e && new h(a, e);
          CKEDITOR.tools.extend(this, b) };
      x.prototype = { getContents: function(a) { return u(this.contents, a) }, getButton: function(a) { return u(this.buttons, a) }, addContents: function(a, b) { return r(this.contents, a, b) }, addButton: function(a, b) { return r(this.buttons, a, b) }, removeContents: function(a) { B(this.contents, a) }, removeButton: function(a) { B(this.buttons, a) } };
      h.prototype = {
        get: function(a) {
          return u(this.elements,
            a, "children")
        },
        add: function(a, b) { return r(this.elements, a, b, "children") },
        remove: function(a) { B(this.elements, a, "children") }
      };
      var y, C = {},
        z, A = {},
        G = function(a) { var b = a.data.$.ctrlKey || a.data.$.metaKey,
            c = a.data.$.altKey,
            f = a.data.$.shiftKey,
            e = String.fromCharCode(a.data.$.keyCode);
          (b = A[(b ? "CTRL+" : "") + (c ? "ALT+" : "") + (f ? "SHIFT+" : "") + e]) && b.length && (b = b[b.length - 1], b.keydown && b.keydown.call(b.uiElement, b.dialog, b.key), a.data.preventDefault()) },
        D = function(a) {
          var b = a.data.$.ctrlKey || a.data.$.metaKey,
            c = a.data.$.altKey,
            f = a.data.$.shiftKey,
            e = String.fromCharCode(a.data.$.keyCode);
          (b = A[(b ? "CTRL+" : "") + (c ? "ALT+" : "") + (f ? "SHIFT+" : "") + e]) && b.length && (b = b[b.length - 1], b.keyup && (b.keyup.call(b.uiElement, b.dialog, b.key), a.data.preventDefault()))
        },
        F = function(a, b, c, f, e) {
          (A[c] || (A[c] = [])).push({ uiElement: a, dialog: b, key: c, keyup: e || a.accessKeyUp, keydown: f || a.accessKeyDown }) },
        I = function(a) { for (var b in A) { for (var c = A[b], f = c.length - 1; 0 <= f; f--) c[f].dialog != a && c[f].uiElement != a || c.splice(f, 1);
            0 === c.length && delete A[b] } },
        H = function(a,
          b) { a._.accessKeyMap[b] && a.selectPage(a._.accessKeyMap[b]) },
        K = function() {};
      (function() {
        CKEDITOR.ui.dialog = {
          uiElement: function(a, b, c, f, e, g, d) {
            if (!(4 > arguments.length)) {
              var h = (f.call ? f(b) : f) || "div",
                k = ["\x3c", h, " "],
                m = (e && e.call ? e(b) : e) || {},
                l = (g && g.call ? g(b) : g) || {},
                n = (d && d.call ? d.call(this, a, b) : d) || "",
                r = this.domId = l.id || CKEDITOR.tools.getNextId() + "_uiElement";
              b.requiredContent && !a.getParentEditor().filter.check(b.requiredContent) && (m.display = "none", this.notAllowed = !0);
              l.id = r;
              var p = {};
              b.type && (p["cke_dialog_ui_" +
                b.type] = 1);
              b.className && (p[b.className] = 1);
              b.disabled && (p.cke_disabled = 1);
              for (var t = l["class"] && l["class"].split ? l["class"].split(" ") : [], r = 0; r < t.length; r++) t[r] && (p[t[r]] = 1);
              t = [];
              for (r in p) t.push(r);
              l["class"] = t.join(" ");
              b.title && (l.title = b.title);
              p = (b.style || "").split(";");
              b.align && (t = b.align, m["margin-left"] = "left" == t ? 0 : "auto", m["margin-right"] = "right" == t ? 0 : "auto");
              for (r in m) p.push(r + ":" + m[r]);
              b.hidden && p.push("display:none");
              for (r = p.length - 1; 0 <= r; r--) "" === p[r] && p.splice(r, 1);
              0 < p.length && (l.style =
                (l.style ? l.style + "; " : "") + p.join("; "));
              for (r in l) k.push(r + '\x3d"' + CKEDITOR.tools.htmlEncode(l[r]) + '" ');
              k.push("\x3e", n, "\x3c/", h, "\x3e");
              c.push(k.join(""));
              (this._ || (this._ = {})).dialog = a;
              "boolean" == typeof b.isChanged && (this.isChanged = function() { return b.isChanged });
              "function" == typeof b.isChanged && (this.isChanged = b.isChanged);
              "function" == typeof b.setValue && (this.setValue = CKEDITOR.tools.override(this.setValue, function(a) { return function(c) { a.call(this, b.setValue.call(this, c)) } }));
              "function" == typeof b.getValue &&
                (this.getValue = CKEDITOR.tools.override(this.getValue, function(a) { return function() { return b.getValue.call(this, a.call(this)) } }));
              CKEDITOR.event.implementOn(this);
              this.registerEvents(b);
              this.accessKeyUp && this.accessKeyDown && b.accessKey && F(this, a, "CTRL+" + b.accessKey);
              var u = this;
              a.on("load", function() {
                var b = u.getInputElement();
                if (b) {
                  var c = u.type in { checkbox: 1, ratio: 1 } && CKEDITOR.env.ie && 8 > CKEDITOR.env.version ? "cke_dialog_ui_focused" : "";
                  b.on("focus", function() {
                    a._.tabBarMode = !1;
                    a._.hasFocus = !0;
                    u.fire("focus");
                    c && this.addClass(c)
                  });
                  b.on("blur", function() { u.fire("blur");
                    c && this.removeClass(c) })
                }
              });
              CKEDITOR.tools.extend(this, b);
              this.keyboardFocusable && (this.tabIndex = b.tabIndex || 0, this.focusIndex = a._.focusList.push(this) - 1, this.on("focus", function() { a._.currentFocusIndex = u.focusIndex }))
            }
          },
          hbox: function(a, b, c, f, e) {
            if (!(4 > arguments.length)) {
              this._ || (this._ = {});
              var g = this._.children = b,
                d = e && e.widths || null,
                h = e && e.height || null,
                k, m = { role: "presentation" };
              e && e.align && (m.align = e.align);
              CKEDITOR.ui.dialog.uiElement.call(this,
                a, e || { type: "hbox" }, f, "table", {}, m,
                function() {
                  var a = ['\x3ctbody\x3e\x3ctr class\x3d"cke_dialog_ui_hbox"\x3e'];
                  for (k = 0; k < c.length; k++) {
                    var b = "cke_dialog_ui_hbox_child",
                      f = [];
                    0 === k && (b = "cke_dialog_ui_hbox_first");
                    k == c.length - 1 && (b = "cke_dialog_ui_hbox_last");
                    a.push('\x3ctd class\x3d"', b, '" role\x3d"presentation" ');
                    d ? d[k] && f.push("width:" + w(d[k])) : f.push("width:" + Math.floor(100 / c.length) + "%");
                    h && f.push("height:" + w(h));
                    e && void 0 !== e.padding && f.push("padding:" + w(e.padding));
                    CKEDITOR.env.ie && CKEDITOR.env.quirks &&
                      g[k].align && f.push("text-align:" + g[k].align);
                    0 < f.length && a.push('style\x3d"' + f.join("; ") + '" ');
                    a.push("\x3e", c[k], "\x3c/td\x3e")
                  }
                  a.push("\x3c/tr\x3e\x3c/tbody\x3e");
                  return a.join("")
                })
            }
          },
          vbox: function(a, b, c, f, e) {
            if (!(3 > arguments.length)) {
              this._ || (this._ = {});
              var g = this._.children = b,
                d = e && e.width || null,
                h = e && e.heights || null;
              CKEDITOR.ui.dialog.uiElement.call(this, a, e || { type: "vbox" }, f, "div", null, { role: "presentation" }, function() {
                var b = ['\x3ctable role\x3d"presentation" cellspacing\x3d"0" border\x3d"0" '];
                b.push('style\x3d"');
                e && e.expand && b.push("height:100%;");
                b.push("width:" + w(d || "100%"), ";");
                CKEDITOR.env.webkit && b.push("float:none;");
                b.push('"');
                b.push('align\x3d"', CKEDITOR.tools.htmlEncode(e && e.align || ("ltr" == a.getParentEditor().lang.dir ? "left" : "right")), '" ');
                b.push("\x3e\x3ctbody\x3e");
                for (var f = 0; f < c.length; f++) {
                  var k = [];
                  b.push('\x3ctr\x3e\x3ctd role\x3d"presentation" ');
                  d && k.push("width:" + w(d || "100%"));
                  h ? k.push("height:" + w(h[f])) : e && e.expand && k.push("height:" + Math.floor(100 / c.length) + "%");
                  e && void 0 !== e.padding && k.push("padding:" + w(e.padding));
                  CKEDITOR.env.ie && CKEDITOR.env.quirks && g[f].align && k.push("text-align:" + g[f].align);
                  0 < k.length && b.push('style\x3d"', k.join("; "), '" ');
                  b.push(' class\x3d"cke_dialog_ui_vbox_child"\x3e', c[f], "\x3c/td\x3e\x3c/tr\x3e")
                }
                b.push("\x3c/tbody\x3e\x3c/table\x3e");
                return b.join("")
              })
            }
          }
        }
      })();
      CKEDITOR.ui.dialog.uiElement.prototype = {
        getElement: function() { return CKEDITOR.document.getById(this.domId) },
        getInputElement: function() { return this.getElement() },
        getDialog: function() { return this._.dialog },
        setValue: function(a, b) { this.getInputElement().setValue(a);!b && this.fire("change", { value: a }); return this },
        getValue: function() { return this.getInputElement().getValue() },
        isChanged: function() { return !1 },
        selectParentTab: function() { for (var a = this.getInputElement();
            (a = a.getParent()) && -1 == a.$.className.search("cke_dialog_page_contents");); if (!a) return this;
          a = a.getAttribute("name");
          this._.dialog._.currentTabId != a && this._.dialog.selectPage(a); return this },
        focus: function() {
          this.selectParentTab().getInputElement().focus();
          return this
        },
        registerEvents: function(a) { var b = /^on([A-Z]\w+)/,
            c, f = function(a, b, c, f) { b.on("load", function() { a.getInputElement().on(c, f, a) }) },
            e; for (e in a)
            if (c = e.match(b)) this.eventProcessors[e] ? this.eventProcessors[e].call(this, this._.dialog, a[e]) : f(this, this._.dialog, c[1].toLowerCase(), a[e]); return this },
        eventProcessors: { onLoad: function(a, b) { a.on("load", b, this) }, onShow: function(a, b) { a.on("show", b, this) }, onHide: function(a, b) { a.on("hide", b, this) } },
        accessKeyDown: function() { this.focus() },
        accessKeyUp: function() {},
        disable: function() { var a = this.getElement();
          this.getInputElement().setAttribute("disabled", "true");
          a.addClass("cke_disabled") },
        enable: function() { var a = this.getElement();
          this.getInputElement().removeAttribute("disabled");
          a.removeClass("cke_disabled") },
        isEnabled: function() { return !this.getElement().hasClass("cke_disabled") },
        isVisible: function() { return this.getInputElement().isVisible() },
        isFocusable: function() { return this.isEnabled() && this.isVisible() ? !0 : !1 }
      };
      CKEDITOR.ui.dialog.hbox.prototype = CKEDITOR.tools.extend(new CKEDITOR.ui.dialog.uiElement, { getChild: function(a) { if (1 > arguments.length) return this._.children.concat();
          a.splice || (a = [a]); return 2 > a.length ? this._.children[a[0]] : this._.children[a[0]] && this._.children[a[0]].getChild ? this._.children[a[0]].getChild(a.slice(1, a.length)) : null } }, !0);
      CKEDITOR.ui.dialog.vbox.prototype = new CKEDITOR.ui.dialog.hbox;
      (function() {
        var a = {
          build: function(a, b, c) {
            for (var f = b.children, e, g = [], d = [], h = 0; h < f.length && (e = f[h]); h++) { var k = [];
              g.push(k);
              d.push(CKEDITOR.dialog._.uiElementBuilders[e.type].build(a, e, k)) }
            return new CKEDITOR.ui.dialog[b.type](a,
              d, g, c, b)
          }
        };
        CKEDITOR.dialog.addUIElement("hbox", a);
        CKEDITOR.dialog.addUIElement("vbox", a)
      })();
      CKEDITOR.dialogCommand = function(a, b) { this.dialogName = a;
        CKEDITOR.tools.extend(this, b, !0) };
      CKEDITOR.dialogCommand.prototype = { exec: function(a) { var b = this.tabId;
          a.openDialog(this.dialogName, function(a) { b && a.selectPage(b) }) }, canUndo: !1, editorFocus: 1 };
      (function() {
        var a = /^([a]|[^a])+$/,
          b = /^\d*$/,
          c = /^\d*(?:\.\d+)?$/,
          f = /^(((\d*(\.\d+))|(\d*))(px|\%)?)?$/,
          e = /^(((\d*(\.\d+))|(\d*))(px|em|ex|in|cm|mm|pt|pc|\%)?)?$/i,
          g = /^(\s*[\w-]+\s*:\s*[^:;]+(?:;|$))*$/;
        CKEDITOR.VALIDATE_OR = 1;
        CKEDITOR.VALIDATE_AND = 2;
        CKEDITOR.dialog.validate = {
          functions: function() {
            var a = arguments;
            return function() {
              var b = this && this.getValue ? this.getValue() : a[0],
                c, f = CKEDITOR.VALIDATE_AND,
                e = [],
                g;
              for (g = 0; g < a.length; g++)
                if ("function" == typeof a[g]) e.push(a[g]);
                else break;
              g < a.length && "string" == typeof a[g] && (c = a[g], g++);
              g < a.length && "number" == typeof a[g] && (f = a[g]);
              var d = f == CKEDITOR.VALIDATE_AND ? !0 : !1;
              for (g = 0; g < e.length; g++) d = f == CKEDITOR.VALIDATE_AND ? d &&
                e[g](b) : d || e[g](b);
              return d ? !0 : c
            }
          },
          regex: function(a, b) { return function(c) { c = this && this.getValue ? this.getValue() : c; return a.test(c) ? !0 : b } },
          notEmpty: function(b) { return this.regex(a, b) },
          integer: function(a) { return this.regex(b, a) },
          number: function(a) { return this.regex(c, a) },
          cssLength: function(a) { return this.functions(function(a) { return e.test(CKEDITOR.tools.trim(a)) }, a) },
          htmlLength: function(a) { return this.functions(function(a) { return f.test(CKEDITOR.tools.trim(a)) }, a) },
          inlineStyle: function(a) {
            return this.functions(function(a) { return g.test(CKEDITOR.tools.trim(a)) },
              a)
          },
          equals: function(a, b) { return this.functions(function(b) { return b == a }, b) },
          notEqual: function(a, b) { return this.functions(function(b) { return b != a }, b) }
        };
        CKEDITOR.on("instanceDestroyed", function(a) { if (CKEDITOR.tools.isEmpty(CKEDITOR.instances)) { for (var b; b = CKEDITOR.dialog._.currentTop;) b.hide(); for (var c in C) C[c].remove();
            C = {} } a = a.editor._.storedDialogs; for (var f in a) a[f].destroy() })
      })();
      CKEDITOR.tools.extend(CKEDITOR.editor.prototype, {
        openDialog: function(a, b) {
          var c = null,
            f = CKEDITOR.dialog._.dialogDefinitions[a];
          null === CKEDITOR.dialog._.currentTop && p(this);
          if ("function" == typeof f) c = this._.storedDialogs || (this._.storedDialogs = {}), c = c[a] || (c[a] = new CKEDITOR.dialog(this, a)), b && b.call(c, c), c.show();
          else {
            if ("failed" == f) throw q(this), Error('[CKEDITOR.dialog.openDialog] Dialog "' + a + '" failed when loading definition.');
            "string" == typeof f && CKEDITOR.scriptLoader.load(CKEDITOR.getUrl(f), function() {
              "function" != typeof CKEDITOR.dialog._.dialogDefinitions[a] && (CKEDITOR.dialog._.dialogDefinitions[a] = "failed");
              this.openDialog(a,
                b)
            }, this, 0, 1)
          }
          CKEDITOR.skin.loadPart("dialog");
          return c
        }
      })
    }(), CKEDITOR.plugins.add("dialog", { requires: "dialogui", init: function(a) { a.on("doubleclick", function(d) { d.data.dialog && a.openDialog(d.data.dialog) }, null, null, 999) } }),
    function() {
      CKEDITOR.plugins.add("a11yhelp", {
        requires: "dialog",
        availableLangs: {
          af: 1,
          ar: 1,
          az: 1,
          bg: 1,
          ca: 1,
          cs: 1,
          cy: 1,
          da: 1,
          de: 1,
          "de-ch": 1,
          el: 1,
          en: 1,
          "en-au": 1,
          "en-gb": 1,
          eo: 1,
          es: 1,
          "es-mx": 1,
          et: 1,
          eu: 1,
          fa: 1,
          fi: 1,
          fo: 1,
          fr: 1,
          "fr-ca": 1,
          gl: 1,
          gu: 1,
          he: 1,
          hi: 1,
          hr: 1,
          hu: 1,
          id: 1,
          it: 1,
          ja: 1,
          km: 1,
          ko: 1,
          ku: 1,
          lt: 1,
          lv: 1,
          mk: 1,
          mn: 1,
          nb: 1,
          nl: 1,
          no: 1,
          oc: 1,
          pl: 1,
          pt: 1,
          "pt-br": 1,
          ro: 1,
          ru: 1,
          si: 1,
          sk: 1,
          sl: 1,
          sq: 1,
          sr: 1,
          "sr-latn": 1,
          sv: 1,
          th: 1,
          tr: 1,
          tt: 1,
          ug: 1,
          uk: 1,
          vi: 1,
          zh: 1,
          "zh-cn": 1
        },
        init: function(a) {
          var d = this;
          a.addCommand("a11yHelp", {
            exec: function() { var b = a.langCode,
                b = d.availableLangs[b] ? b : d.availableLangs[b.replace(/-.*/, "")] ? b.replace(/-.*/, "") : "en";
              CKEDITOR.scriptLoader.load(CKEDITOR.getUrl(d.path + "dialogs/lang/" + b + ".js"), function() { a.lang.a11yhelp = d.langEntries[b];
                a.openDialog("a11yHelp") }) },
            modes: { wysiwyg: 1, source: 1 },
            readOnly: 1,
            canUndo: !1
          });
          a.setKeystroke(CKEDITOR.ALT + 48, "a11yHelp");
          CKEDITOR.dialog.add("a11yHelp", this.path + "dialogs/a11yhelp.js");
          a.on("ariaEditorHelpLabel", function(b) { b.data.label = a.lang.common.editorHelp })
        }
      })
    }(), CKEDITOR.plugins.add("about", {
      requires: "dialog",
      init: function(a) {
        var d = a.addCommand("about", new CKEDITOR.dialogCommand("about"));
        d.modes = { wysiwyg: 1, source: 1 };
        d.canUndo = !1;
        d.readOnly = 1;
        a.ui.addButton && a.ui.addButton("About", { label: a.lang.about.dlgTitle, command: "about", toolbar: "about" });
        CKEDITOR.dialog.add("about", this.path + "dialogs/about.js")
      }
    }), CKEDITOR.plugins.add("basicstyles", {
      init: function(a) {
        var d = 0,
          b = function(b, e, g, m) { if (m) { m = new CKEDITOR.style(m); var f = c[g];
              f.unshift(m);
              a.attachStyleStateChange(m, function(b) {!a.readOnly && a.getCommand(g).setState(b) });
              a.addCommand(g, new CKEDITOR.styleCommand(m, { contentForms: f }));
              a.ui.addButton && a.ui.addButton(b, { label: e, command: g, toolbar: "basicstyles," + (d += 10) }) } },
          c = {
            bold: ["strong", "b", ["span", function(a) {
              a = a.styles["font-weight"];
              return "bold" ==
                a || 700 <= +a
            }]],
            italic: ["em", "i", ["span", function(a) { return "italic" == a.styles["font-style"] }]],
            underline: ["u", ["span", function(a) { return "underline" == a.styles["text-decoration"] }]],
            strike: ["s", "strike", ["span", function(a) { return "line-through" == a.styles["text-decoration"] }]],
            subscript: ["sub"],
            superscript: ["sup"]
          },
          g = a.config,
          l = a.lang.basicstyles;
        b("Bold", l.bold, "bold", g.coreStyles_bold);
        b("Italic", l.italic, "italic", g.coreStyles_italic);
        b("Underline", l.underline, "underline", g.coreStyles_underline);
        b("Strike",
          l.strike, "strike", g.coreStyles_strike);
        b("Subscript", l.subscript, "subscript", g.coreStyles_subscript);
        b("Superscript", l.superscript, "superscript", g.coreStyles_superscript);
        a.setKeystroke([
          [CKEDITOR.CTRL + 66, "bold"],
          [CKEDITOR.CTRL + 73, "italic"],
          [CKEDITOR.CTRL + 85, "underline"]
        ])
      }
    }), CKEDITOR.config.coreStyles_bold = { element: "strong", overrides: "b" }, CKEDITOR.config.coreStyles_italic = { element: "em", overrides: "i" }, CKEDITOR.config.coreStyles_underline = { element: "u" }, CKEDITOR.config.coreStyles_strike = {
      element: "s",
      overrides: "strike"
    }, CKEDITOR.config.coreStyles_subscript = { element: "sub" }, CKEDITOR.config.coreStyles_superscript = { element: "sup" },
    function() {
      function a(a, b, c, e) {
        if (!a.isReadOnly() && !a.equals(c.editable())) {
          CKEDITOR.dom.element.setMarker(e, a, "bidi_processed", 1);
          e = a;
          for (var g = c.editable();
            (e = e.getParent()) && !e.equals(g);)
            if (e.getCustomData("bidi_processed")) { a.removeStyle("direction");
              a.removeAttribute("dir"); return }
          e = "useComputedState" in c.config ? c.config.useComputedState : 1;
          (e ? a.getComputedStyle("direction") :
            a.getStyle("direction") || a.hasAttribute("dir")) != b && (a.removeStyle("direction"), e ? (a.removeAttribute("dir"), b != a.getComputedStyle("direction") && a.setAttribute("dir", b)) : a.setAttribute("dir", b), c.forceNextSelectionCheck())
        }
      }

      function d(a, b, c) {
        var e = a.getCommonAncestor(!1, !0);
        a = a.clone();
        a.enlarge(c == CKEDITOR.ENTER_BR ? CKEDITOR.ENLARGE_LIST_ITEM_CONTENTS : CKEDITOR.ENLARGE_BLOCK_CONTENTS);
        if (a.checkBoundaryOfElement(e, CKEDITOR.START) && a.checkBoundaryOfElement(e, CKEDITOR.END)) {
          for (var g; e && e.type == CKEDITOR.NODE_ELEMENT &&
            (g = e.getParent()) && 1 == g.getChildCount() && !(e.getName() in b);) e = g;
          return e.type == CKEDITOR.NODE_ELEMENT && e.getName() in b && e
        }
      }

      function b(b) {
        return {
          context: "p",
          allowedContent: { "h1 h2 h3 h4 h5 h6 table ul ol blockquote div tr p div li td": { propertiesOnly: !0, attributes: "dir" } },
          requiredContent: "p[dir]",
          refresh: function(a, b) {
            var c = a.config.useComputedState,
              f, c = void 0 === c || c;
            if (!c) { f = b.lastElement; for (var e = a.editable(); f && !(f.getName() in k || f.equals(e));) { var g = f.getParent(); if (!g) break;
                f = g } } f = f || b.block ||
              b.blockLimit;
            f.equals(a.editable()) && (e = a.getSelection().getRanges()[0].getEnclosedNode()) && e.type == CKEDITOR.NODE_ELEMENT && (f = e);
            f && (c = c ? f.getComputedStyle("direction") : f.getStyle("direction") || f.getAttribute("dir"), a.getCommand("bidirtl").setState("rtl" == c ? CKEDITOR.TRISTATE_ON : CKEDITOR.TRISTATE_OFF), a.getCommand("bidiltr").setState("ltr" == c ? CKEDITOR.TRISTATE_ON : CKEDITOR.TRISTATE_OFF));
            c = (b.block || b.blockLimit || a.editable()).getDirection(1);
            c != (a._.selDir || a.lang.dir) && (a._.selDir = c, a.fire("contentDirChanged",
              c))
          },
          exec: function(c) {
            var e = c.getSelection(),
              h = c.config.enterMode,
              k = e.getRanges();
            if (k && k.length) {
              for (var m = {}, t = e.createBookmarks(), k = k.createIterator(), u, r = 0; u = k.getNextRange(1);) {
                var B = u.getEnclosedNode();
                B && (!B || B.type == CKEDITOR.NODE_ELEMENT && B.getName() in l) || (B = d(u, g, h));
                B && a(B, b, c, m);
                var x = new CKEDITOR.dom.walker(u),
                  y = t[r].startNode,
                  C = t[r++].endNode;
                x.evaluator = function(a) {
                  var b = h == CKEDITOR.ENTER_P ? "p" : "div",
                    c;
                  if (c = (a ? a.type == CKEDITOR.NODE_ELEMENT : !1) && a.getName() in g) {
                    if (b = a.is(b)) b = (b = a.getParent()) ?
                      b.type == CKEDITOR.NODE_ELEMENT : !1;
                    c = !(b && a.getParent().is("blockquote"))
                  }
                  return !!(c && a.getPosition(y) & CKEDITOR.POSITION_FOLLOWING && (a.getPosition(C) & CKEDITOR.POSITION_PRECEDING + CKEDITOR.POSITION_CONTAINS) == CKEDITOR.POSITION_PRECEDING)
                };
                for (; B = x.next();) a(B, b, c, m);
                u = u.createIterator();
                for (u.enlargeBr = h != CKEDITOR.ENTER_BR; B = u.getNextParagraph(h == CKEDITOR.ENTER_P ? "p" : "div");) a(B, b, c, m)
              }
              CKEDITOR.dom.element.clearAllMarkers(m);
              c.forceNextSelectionCheck();
              e.selectBookmarks(t);
              c.focus()
            }
          }
        }
      }

      function c(a) {
        var b =
          a == e.setAttribute,
          c = a == e.removeAttribute,
          g = /\bdirection\s*:\s*(.*?)\s*(:?$|;)/;
        return function(e, d) { if (!this.isReadOnly()) { var h; if (h = e == (b || c ? "dir" : "direction") || "style" == e && (c || g.test(d))) { a: { h = this; for (var k = h.getDocument().getBody().getParent(); h;) { if (h.equals(k)) { h = !1; break a } h = h.getParent() } h = !0 } h = !h } if (h && (h = this.getDirection(1), k = a.apply(this, arguments), h != this.getDirection(1))) return this.getDocument().fire("dirChanged", this), k } return a.apply(this, arguments) }
      }
      var g = {
          table: 1,
          ul: 1,
          ol: 1,
          blockquote: 1,
          div: 1
        },
        l = {},
        k = {};
      CKEDITOR.tools.extend(l, g, { tr: 1, p: 1, div: 1, li: 1 });
      CKEDITOR.tools.extend(k, l, { td: 1 });
      CKEDITOR.plugins.add("bidi", {
        init: function(a) {
          function c(b, e, g, d, h) { a.addCommand(g, new CKEDITOR.command(a, d));
            a.ui.addButton && a.ui.addButton(b, { label: e, command: g, toolbar: "bidi," + h }) }
          if (!a.blockless) {
            var e = a.lang.bidi;
            c("BidiLtr", e.ltr, "bidiltr", b("ltr"), 10);
            c("BidiRtl", e.rtl, "bidirtl", b("rtl"), 20);
            a.on("contentDom", function() { a.document.on("dirChanged", function(b) { a.fire("dirChanged", { node: b.data, dir: b.data.getDirection(1) }) }) });
            a.on("contentDirChanged", function(b) { b = (a.lang.dir != b.data ? "add" : "remove") + "Class"; var c = a.ui.space(a.config.toolbarLocation); if (c) c[b]("cke_mixed_dir_content") })
          }
        }
      });
      for (var e = CKEDITOR.dom.element.prototype, h = ["setStyle", "removeStyle", "setAttribute", "removeAttribute"], m = 0; m < h.length; m++) e[h[m]] = CKEDITOR.tools.override(e[h[m]], c)
    }(),
    function() {
      var a = {
        exec: function(a) {
          var b = a.getCommand("blockquote").state,
            c = a.getSelection(),
            g = c && c.getRanges()[0];
          if (g) {
            var l = c.createBookmarks();
            if (CKEDITOR.env.ie) {
              var k =
                l[0].startNode,
                e = l[0].endNode,
                h;
              if (k && "blockquote" == k.getParent().getName())
                for (h = k; h = h.getNext();)
                  if (h.type == CKEDITOR.NODE_ELEMENT && h.isBlockBoundary()) { k.move(h, !0); break }
              if (e && "blockquote" == e.getParent().getName())
                for (h = e; h = h.getPrevious();)
                  if (h.type == CKEDITOR.NODE_ELEMENT && h.isBlockBoundary()) { e.move(h); break }
            }
            var m = g.createIterator();
            m.enlargeBr = a.config.enterMode != CKEDITOR.ENTER_BR;
            if (b == CKEDITOR.TRISTATE_OFF) {
              for (k = []; b = m.getNextParagraph();) k.push(b);
              1 > k.length && (b = a.document.createElement(a.config.enterMode ==
                CKEDITOR.ENTER_P ? "p" : "div"), e = l.shift(), g.insertNode(b), b.append(new CKEDITOR.dom.text("﻿", a.document)), g.moveToBookmark(e), g.selectNodeContents(b), g.collapse(!0), e = g.createBookmark(), k.push(b), l.unshift(e));
              h = k[0].getParent();
              g = [];
              for (e = 0; e < k.length; e++) b = k[e], h = h.getCommonAncestor(b.getParent());
              for (b = { table: 1, tbody: 1, tr: 1, ol: 1, ul: 1 }; b[h.getName()];) h = h.getParent();
              for (e = null; 0 < k.length;) { for (b = k.shift(); !b.getParent().equals(h);) b = b.getParent();
                b.equals(e) || g.push(b);
                e = b }
              for (; 0 < g.length;)
                if (b =
                  g.shift(), "blockquote" == b.getName()) { for (e = new CKEDITOR.dom.documentFragment(a.document); b.getFirst();) e.append(b.getFirst().remove()), k.push(e.getLast());
                  e.replace(b) } else k.push(b);
              g = a.document.createElement("blockquote");
              for (g.insertBefore(k[0]); 0 < k.length;) b = k.shift(), g.append(b)
            } else if (b == CKEDITOR.TRISTATE_ON) {
              e = [];
              for (h = {}; b = m.getNextParagraph();) {
                for (k = g = null; b.getParent();) { if ("blockquote" == b.getParent().getName()) { g = b.getParent();
                    k = b; break } b = b.getParent() } g && k && !k.getCustomData("blockquote_moveout") &&
                  (e.push(k), CKEDITOR.dom.element.setMarker(h, k, "blockquote_moveout", !0))
              }
              CKEDITOR.dom.element.clearAllMarkers(h);
              b = [];
              k = [];
              for (h = {}; 0 < e.length;) m = e.shift(), g = m.getParent(), m.getPrevious() ? m.getNext() ? (m.breakParent(m.getParent()), k.push(m.getNext())) : m.remove().insertAfter(g) : m.remove().insertBefore(g), g.getCustomData("blockquote_processed") || (k.push(g), CKEDITOR.dom.element.setMarker(h, g, "blockquote_processed", !0)), b.push(m);
              CKEDITOR.dom.element.clearAllMarkers(h);
              for (e = k.length - 1; 0 <= e; e--) {
                g = k[e];
                a: { h = g; for (var m = 0, f = h.getChildCount(), n = void 0; m < f && (n = h.getChild(m)); m++)
                    if (n.type == CKEDITOR.NODE_ELEMENT && n.isBlockBoundary()) { h = !1; break a }
                  h = !0 } h && g.remove()
              }
              if (a.config.enterMode == CKEDITOR.ENTER_BR)
                for (g = !0; b.length;)
                  if (m = b.shift(), "div" == m.getName()) {
                    e = new CKEDITOR.dom.documentFragment(a.document);
                    !g || !m.getPrevious() || m.getPrevious().type == CKEDITOR.NODE_ELEMENT && m.getPrevious().isBlockBoundary() || e.append(a.document.createElement("br"));
                    for (g = m.getNext() && !(m.getNext().type == CKEDITOR.NODE_ELEMENT &&
                        m.getNext().isBlockBoundary()); m.getFirst();) m.getFirst().remove().appendTo(e);
                    g && e.append(a.document.createElement("br"));
                    e.replace(m);
                    g = !1
                  }
            }
            c.selectBookmarks(l);
            a.focus()
          }
        },
        refresh: function(a, b) { this.setState(a.elementPath(b.block || b.blockLimit).contains("blockquote", 1) ? CKEDITOR.TRISTATE_ON : CKEDITOR.TRISTATE_OFF) },
        context: "blockquote",
        allowedContent: "blockquote",
        requiredContent: "blockquote"
      };
      CKEDITOR.plugins.add("blockquote", {
        init: function(d) {
          d.blockless || (d.addCommand("blockquote", a), d.ui.addButton &&
            d.ui.addButton("Blockquote", { label: d.lang.blockquote.toolbar, command: "blockquote", toolbar: "blocks,10" }))
        }
      })
    }(), "use strict",
    function() {
      function a(a, c) { CKEDITOR.tools.extend(this, c, { editor: a, id: "cke-" + CKEDITOR.tools.getUniqueId(), area: a._.notificationArea });
        c.type || (this.type = "info");
        this.element = this._createElement();
        a.plugins.clipboard && CKEDITOR.plugins.clipboard.preventDefaultDropOnElement(this.element) }

      function d(a) {
        var c = this;
        this.editor = a;
        this.notifications = [];
        this.element = this._createElement();
        this._uiBuffer = CKEDITOR.tools.eventsBuffer(10, this._layout, this);
        this._changeBuffer = CKEDITOR.tools.eventsBuffer(500, this._layout, this);
        a.on("destroy", function() { c._removeListeners();
          c.element.remove() })
      }
      CKEDITOR.plugins.add("notification", {
        init: function(a) {
          function c(a) {
            var b = new CKEDITOR.dom.element("div");
            b.setStyles({ position: "fixed", "margin-left": "-9999px" });
            b.setAttributes({ "aria-live": "assertive", "aria-atomic": "true" });
            b.setText(a);
            CKEDITOR.document.getBody().append(b);
            setTimeout(function() { b.remove() },
              100)
          }
          a._.notificationArea = new d(a);
          a.showNotification = function(c, d, k) { var e, h; "progress" == d ? e = k : h = k;
            c = new CKEDITOR.plugins.notification(a, { message: c, type: d, progress: e, duration: h });
            c.show(); return c };
          a.on("key", function(g) { if (27 == g.data.keyCode) { var d = a._.notificationArea.notifications;
              d.length && (c(a.lang.notification.closed), d[d.length - 1].hide(), g.cancel()) } })
        }
      });
      a.prototype = {
        show: function() {!1 !== this.editor.fire("notificationShow", { notification: this }) && (this.area.add(this), this._hideAfterTimeout()) },
        update: function(a) {
          var c = !0;
          !1 === this.editor.fire("notificationUpdate", { notification: this, options: a }) && (c = !1);
          var g = this.element,
            d = g.findOne(".cke_notification_message"),
            k = g.findOne(".cke_notification_progress"),
            e = a.type;
          g.removeAttribute("role");
          a.progress && "progress" != this.type && (e = "progress");
          e && (g.removeClass(this._getClass()), g.removeAttribute("aria-label"), this.type = e, g.addClass(this._getClass()), g.setAttribute("aria-label", this.type), "progress" != this.type || k ? "progress" != this.type && k && k.remove() :
            (k = this._createProgressElement(), k.insertBefore(d)));
          void 0 !== a.message && (this.message = a.message, d.setHtml(this.message));
          void 0 !== a.progress && (this.progress = a.progress, k && k.setStyle("width", this._getPercentageProgress()));
          c && a.important && (g.setAttribute("role", "alert"), this.isVisible() || this.area.add(this));
          this.duration = a.duration;
          this._hideAfterTimeout()
        },
        hide: function() {!1 !== this.editor.fire("notificationHide", { notification: this }) && this.area.remove(this) },
        isVisible: function() {
          return 0 <= CKEDITOR.tools.indexOf(this.area.notifications,
            this)
        },
        _createElement: function() {
          var a = this,
            c, g, d = this.editor.lang.common.close;
          c = new CKEDITOR.dom.element("div");
          c.addClass("cke_notification");
          c.addClass(this._getClass());
          c.setAttributes({ id: this.id, role: "alert", "aria-label": this.type });
          "progress" == this.type && c.append(this._createProgressElement());
          g = new CKEDITOR.dom.element("p");
          g.addClass("cke_notification_message");
          g.setHtml(this.message);
          c.append(g);
          g = CKEDITOR.dom.element.createFromHtml('\x3ca class\x3d"cke_notification_close" href\x3d"javascript:void(0)" title\x3d"' +
            d + '" role\x3d"button" tabindex\x3d"-1"\x3e\x3cspan class\x3d"cke_label"\x3eX\x3c/span\x3e\x3c/a\x3e');
          c.append(g);
          g.on("click", function() { a.editor.focus();
            a.hide() });
          return c
        },
        _getClass: function() { return "progress" == this.type ? "cke_notification_info" : "cke_notification_" + this.type },
        _createProgressElement: function() { var a = new CKEDITOR.dom.element("span");
          a.addClass("cke_notification_progress");
          a.setStyle("width", this._getPercentageProgress()); return a },
        _getPercentageProgress: function() {
          return Math.round(100 *
            (this.progress || 0)) + "%"
        },
        _hideAfterTimeout: function() { var a = this,
            c;
          this._hideTimeoutId && clearTimeout(this._hideTimeoutId); if ("number" == typeof this.duration) c = this.duration;
          else if ("info" == this.type || "success" == this.type) c = "number" == typeof this.editor.config.notification_duration ? this.editor.config.notification_duration : 5E3;
          c && (a._hideTimeoutId = setTimeout(function() { a.hide() }, c)) }
      };
      d.prototype = {
        add: function(a) {
          this.notifications.push(a);
          this.element.append(a.element);
          1 == this.element.getChildCount() &&
            (CKEDITOR.document.getBody().append(this.element), this._attachListeners());
          this._layout()
        },
        remove: function(a) { var c = CKEDITOR.tools.indexOf(this.notifications, a);
          0 > c || (this.notifications.splice(c, 1), a.element.remove(), this.element.getChildCount() || (this._removeListeners(), this.element.remove())) },
        _createElement: function() {
          var a = this.editor,
            c = a.config,
            g = new CKEDITOR.dom.element("div");
          g.addClass("cke_notifications_area");
          g.setAttribute("id", "cke_notifications_area_" + a.name);
          g.setStyle("z-index", c.baseFloatZIndex -
            2);
          return g
        },
        _attachListeners: function() { var a = CKEDITOR.document.getWindow(),
            c = this.editor;
          a.on("scroll", this._uiBuffer.input);
          a.on("resize", this._uiBuffer.input);
          c.on("change", this._changeBuffer.input);
          c.on("floatingSpaceLayout", this._layout, this, null, 20);
          c.on("blur", this._layout, this, null, 20) },
        _removeListeners: function() {
          var a = CKEDITOR.document.getWindow(),
            c = this.editor;
          a.removeListener("scroll", this._uiBuffer.input);
          a.removeListener("resize", this._uiBuffer.input);
          c.removeListener("change", this._changeBuffer.input);
          c.removeListener("floatingSpaceLayout", this._layout);
          c.removeListener("blur", this._layout)
        },
        _layout: function() {
          function a() { c.setStyle("left", u(r + d.width - n - p)) }
          var c = this.element,
            g = this.editor,
            d = g.ui.contentsElement.getClientRect(),
            k = g.ui.contentsElement.getDocumentPosition(),
            e, h, m = c.getClientRect(),
            f, n = this._notificationWidth,
            p = this._notificationMargin;
          f = CKEDITOR.document.getWindow();
          var q = f.getScrollPosition(),
            w = f.getViewPaneSize(),
            v = CKEDITOR.document.getBody(),
            t = v.getDocumentPosition(),
            u = CKEDITOR.tools.cssLength;
          n && p || (f = this.element.getChild(0), n = this._notificationWidth = f.getClientRect().width, p = this._notificationMargin = parseInt(f.getComputedStyle("margin-left"), 10) + parseInt(f.getComputedStyle("margin-right"), 10));
          g.toolbar && (e = g.ui.space("top"), h = e.getClientRect());
          e && e.isVisible() && h.bottom > d.top && h.bottom < d.bottom - m.height ? c.setStyles({ position: "fixed", top: u(h.bottom) }) : 0 < d.top ? c.setStyles({ position: "absolute", top: u(k.y) }) : k.y + d.height - m.height > q.y ? c.setStyles({ position: "fixed", top: 0 }) : c.setStyles({
            position: "absolute",
            top: u(k.y + d.height - m.height)
          });
          var r = "fixed" == c.getStyle("position") ? d.left : "static" != v.getComputedStyle("position") ? k.x - t.x : k.x;
          d.width < n + p ? k.x + n + p > q.x + w.width ? a() : c.setStyle("left", u(r)) : k.x + n + p > q.x + w.width ? c.setStyle("left", u(r)) : k.x + d.width / 2 + n / 2 + p > q.x + w.width ? c.setStyle("left", u(r - k.x + q.x + w.width - n - p)) : 0 > d.left + d.width - n - p ? a() : 0 > d.left + d.width / 2 - n / 2 ? c.setStyle("left", u(r - k.x + q.x)) : c.setStyle("left", u(r + d.width / 2 - n / 2 - p / 2))
        }
      };
      CKEDITOR.plugins.notification = a
    }(),
    function() {
      var a = '\x3ca id\x3d"{id}" class\x3d"cke_button cke_button__{name} cke_button_{state} {cls}"' +
        (CKEDITOR.env.gecko && !CKEDITOR.env.hc ? "" : " href\x3d\"javascript:void('{titleJs}')\"") + ' title\x3d"{title}" tabindex\x3d"-1" hidefocus\x3d"true" role\x3d"button" aria-labelledby\x3d"{id}_label" aria-describedby\x3d"{id}_description" aria-haspopup\x3d"{hasArrow}" aria-disabled\x3d"{ariaDisabled}"';
      CKEDITOR.env.gecko && CKEDITOR.env.mac && (a += ' onkeypress\x3d"return false;"');
      CKEDITOR.env.gecko && (a += ' onblur\x3d"this.style.cssText \x3d this.style.cssText;"');
      var a = a + (' onkeydown\x3d"return CKEDITOR.tools.callFunction({keydownFn},event);" onfocus\x3d"return CKEDITOR.tools.callFunction({focusFn},event);" ' +
          (CKEDITOR.env.ie ? 'onclick\x3d"return false;" onmouseup' : "onclick") + '\x3d"CKEDITOR.tools.callFunction({clickFn},this);return false;"\x3e\x3cspan class\x3d"cke_button_icon cke_button__{iconName}_icon" style\x3d"{style}"'),
        a = a + '\x3e\x26nbsp;\x3c/span\x3e\x3cspan id\x3d"{id}_label" class\x3d"cke_button_label cke_button__{name}_label" aria-hidden\x3d"false"\x3e{label}\x3c/span\x3e\x3cspan id\x3d"{id}_description" class\x3d"cke_button_label" aria-hidden\x3d"false"\x3e{ariaShortcut}\x3c/span\x3e{arrowHtml}\x3c/a\x3e',
        d = CKEDITOR.addTemplate("buttonArrow", '\x3cspan class\x3d"cke_button_arrow"\x3e' + (CKEDITOR.env.hc ? "\x26#9660;" : "") + "\x3c/span\x3e"),
        b = CKEDITOR.addTemplate("button", a);
      CKEDITOR.plugins.add("button", { beforeInit: function(a) { a.ui.addHandler(CKEDITOR.UI_BUTTON, CKEDITOR.ui.button.handler) } });
      CKEDITOR.UI_BUTTON = "button";
      CKEDITOR.ui.button = function(a) { CKEDITOR.tools.extend(this, a, { title: a.label, click: a.click || function(b) { b.execCommand(a.command) } });
        this._ = {} };
      CKEDITOR.ui.button.handler = { create: function(a) { return new CKEDITOR.ui.button(a) } };
      CKEDITOR.ui.button.prototype = {
        render: function(a, g) {
          function l() { var b = a.mode;
            b && (b = this.modes[b] ? void 0 !== k[b] ? k[b] : CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED, b = a.readOnly && !this.readOnly ? CKEDITOR.TRISTATE_DISABLED : b, this.setState(b), this.refresh && this.refresh()) }
          var k = null,
            e = CKEDITOR.env,
            h = this._.id = CKEDITOR.tools.getNextId(),
            m = "",
            f = this.command,
            n, p, q;
          this._.editor = a;
          var w = {
              id: h,
              button: this,
              editor: a,
              focus: function() { CKEDITOR.document.getById(h).focus() },
              execute: function() { this.button.click(a) },
              attach: function(a) { this.button.attach(a) }
            },
            v = CKEDITOR.tools.addFunction(function(a) { if (w.onkey) return a = new CKEDITOR.dom.event(a), !1 !== w.onkey(w, a.getKeystroke()) }),
            t = CKEDITOR.tools.addFunction(function(a) { var b;
              w.onfocus && (b = !1 !== w.onfocus(w, new CKEDITOR.dom.event(a))); return b }),
            u = 0;
          w.clickFn = n = CKEDITOR.tools.addFunction(function() { u && (a.unlockSelection(1), u = 0);
            w.execute();
            e.iOS && a.focus() });
          this.modes ? (k = {}, a.on("beforeModeUnload", function() {
            a.mode && this._.state != CKEDITOR.TRISTATE_DISABLED && (k[a.mode] =
              this._.state)
          }, this), a.on("activeFilterChange", l, this), a.on("mode", l, this), !this.readOnly && a.on("readOnly", l, this)) : f && (f = a.getCommand(f)) && (f.on("state", function() { this.setState(f.state) }, this), m += f.state == CKEDITOR.TRISTATE_ON ? "on" : f.state == CKEDITOR.TRISTATE_DISABLED ? "disabled" : "off");
          var r;
          if (this.directional) a.on("contentDirChanged", function(b) {
            var f = CKEDITOR.document.getById(this._.id),
              e = f.getFirst();
            b = b.data;
            b != a.lang.dir ? f.addClass("cke_" + b) : f.removeClass("cke_ltr").removeClass("cke_rtl");
            e.setAttribute("style",
              CKEDITOR.skin.getIconStyle(r, "rtl" == b, this.icon, this.iconOffset))
          }, this);
          f ? (p = a.getCommandKeystroke(f)) && (q = CKEDITOR.tools.keystrokeToString(a.lang.common.keyboard, p)) : m += "off";
          p = this.name || this.command;
          var B = null,
            x = this.icon;
          r = p;
          this.icon && !/\./.test(this.icon) ? (r = this.icon, x = null) : (this.icon && (B = this.icon), CKEDITOR.env.hidpi && this.iconHiDpi && (B = this.iconHiDpi));
          B ? (CKEDITOR.skin.addIcon(B, B), x = null) : B = r;
          m = {
            id: h,
            name: p,
            iconName: r,
            label: this.label,
            cls: this.className || "",
            state: m,
            ariaDisabled: "disabled" ==
              m ? "true" : "false",
            title: this.title + (q ? " (" + q.display + ")" : ""),
            ariaShortcut: q ? a.lang.common.keyboardShortcut + " " + q.aria : "",
            titleJs: e.gecko && !e.hc ? "" : (this.title || "").replace("'", ""),
            hasArrow: this.hasArrow ? "true" : "false",
            keydownFn: v,
            focusFn: t,
            clickFn: n,
            style: CKEDITOR.skin.getIconStyle(B, "rtl" == a.lang.dir, x, this.iconOffset),
            arrowHtml: this.hasArrow ? d.output() : ""
          };
          b.output(m, g);
          if (this.onRender) this.onRender();
          return w
        },
        setState: function(a) {
          if (this._.state == a) return !1;
          this._.state = a;
          var b = CKEDITOR.document.getById(this._.id);
          return b ? (b.setState(a, "cke_button"), a == CKEDITOR.TRISTATE_DISABLED ? b.setAttribute("aria-disabled", !0) : b.removeAttribute("aria-disabled"), this.hasArrow ? (a = a == CKEDITOR.TRISTATE_ON ? this._.editor.lang.button.selectedLabel.replace(/%1/g, this.label) : this.label, CKEDITOR.document.getById(this._.id + "_label").setText(a)) : a == CKEDITOR.TRISTATE_ON ? b.setAttribute("aria-pressed", !0) : b.removeAttribute("aria-pressed"), !0) : !1
        },
        getState: function() { return this._.state },
        toFeature: function(a) {
          if (this._.feature) return this._.feature;
          var b = this;
          this.allowedContent || this.requiredContent || !this.command || (b = a.getCommand(this.command) || b);
          return this._.feature = b
        }
      };
      CKEDITOR.ui.prototype.addButton = function(a, b) { this.add(a, CKEDITOR.UI_BUTTON, b) }
    }(),
    function() {
      function a(a) {
        function b() { for (var f = c(), h = CKEDITOR.tools.clone(a.config.toolbarGroups) || d(a), m = 0; m < h.length; m++) { var l = h[m]; if ("/" != l) { "string" == typeof l && (l = h[m] = { name: l }); var v, t = l.groups; if (t)
                for (var u = 0; u < t.length; u++) v = t[u], (v = f[v]) && e(l, v);
              (v = f[l.name]) && e(l, v) } } return h }

        function c() { var b = {},
            f, e, d; for (f in a.ui.items) e = a.ui.items[f], d = e.toolbar || "others", d = d.split(","), e = d[0], d = parseInt(d[1] || -1, 10), b[e] || (b[e] = []), b[e].push({ name: f, order: d }); for (e in b) b[e] = b[e].sort(function(a, b) { return a.order == b.order ? 0 : 0 > b.order ? -1 : 0 > a.order ? 1 : a.order < b.order ? -1 : 1 }); return b }

        function e(b, c) {
          if (c.length) {
            b.items ? b.items.push(a.ui.create("-")) : b.items = [];
            for (var f; f = c.shift();) f = "string" == typeof f ? f : f.name, m && -1 != CKEDITOR.tools.indexOf(m, f) || (f = a.ui.create(f)) && a.addFeature(f) &&
              b.items.push(f)
          }
        }

        function h(a) { var b = [],
            c, f, g; for (c = 0; c < a.length; ++c) f = a[c], g = {}, "/" == f ? b.push(f) : CKEDITOR.tools.isArray(f) ? (e(g, CKEDITOR.tools.clone(f)), b.push(g)) : f.items && (e(g, CKEDITOR.tools.clone(f.items)), g.name = f.name, b.push(g)); return b }
        var m = a.config.removeButtons,
          m = m && m.split(","),
          f = a.config.toolbar;
        "string" == typeof f && (f = a.config["toolbar_" + f]);
        return a.toolbar = f ? h(f) : b()
      }

      function d(a) {
        return a._.toolbarGroups || (a._.toolbarGroups = [{ name: "document", groups: ["mode", "document", "doctools"] },
          { name: "clipboard", groups: ["clipboard", "undo"] }, { name: "editing", groups: ["find", "selection", "spellchecker"] }, { name: "forms" }, "/", { name: "basicstyles", groups: ["basicstyles", "cleanup"] }, { name: "paragraph", groups: ["list", "indent", "blocks", "align", "bidi"] }, { name: "links" }, { name: "insert" }, "/", { name: "styles" }, { name: "colors" }, { name: "tools" }, { name: "others" }, { name: "about" }
        ])
      }
      var b = function() { this.toolbars = [];
        this.focusCommandExecuted = !1 };
      b.prototype.focus = function() {
        for (var a = 0, b; b = this.toolbars[a++];)
          for (var c =
              0, e; e = b.items[c++];)
            if (e.focus) { e.focus(); return }
      };
      var c = { modes: { wysiwyg: 1, source: 1 }, readOnly: 1, exec: function(a) { a.toolbox && (a.toolbox.focusCommandExecuted = !0, CKEDITOR.env.ie || CKEDITOR.env.air ? setTimeout(function() { a.toolbox.focus() }, 100) : a.toolbox.focus()) } };
      CKEDITOR.plugins.add("toolbar", {
        requires: "button",
        init: function(g) {
          var d, k = function(a, b) {
            var c, f = "rtl" == g.lang.dir,
              n = g.config.toolbarGroupCycling,
              p = f ? 37 : 39,
              f = f ? 39 : 37,
              n = void 0 === n || n;
            switch (b) {
              case 9:
              case CKEDITOR.SHIFT + 9:
                for (; !c || !c.items.length;)
                  if (c =
                    9 == b ? (c ? c.next : a.toolbar.next) || g.toolbox.toolbars[0] : (c ? c.previous : a.toolbar.previous) || g.toolbox.toolbars[g.toolbox.toolbars.length - 1], c.items.length)
                    for (a = c.items[d ? c.items.length - 1 : 0]; a && !a.focus;)(a = d ? a.previous : a.next) || (c = 0);
                a && a.focus();
                return !1;
              case p:
                c = a;
                do c = c.next, !c && n && (c = a.toolbar.items[0]); while (c && !c.focus);
                c ? c.focus() : k(a, 9);
                return !1;
              case 40:
                return a.button && a.button.hasArrow ? a.execute() : k(a, 40 == b ? p : f), !1;
              case f:
              case 38:
                c = a;
                do c = c.previous, !c && n && (c = a.toolbar.items[a.toolbar.items.length -
                  1]); while (c && !c.focus);
                c ? c.focus() : (d = 1, k(a, CKEDITOR.SHIFT + 9), d = 0);
                return !1;
              case 27:
                return g.focus(), !1;
              case 13:
              case 32:
                return a.execute(), !1
            }
            return !0
          };
          g.on("uiSpace", function(c) {
            if (c.data.space == g.config.toolbarLocation) {
              c.removeListener();
              g.toolbox = new b;
              var d = CKEDITOR.tools.getNextId(),
                m = ['\x3cspan id\x3d"', d, '" class\x3d"cke_voice_label"\x3e', g.lang.toolbar.toolbars, "\x3c/span\x3e", '\x3cspan id\x3d"' + g.ui.spaceId("toolbox") + '" class\x3d"cke_toolbox" role\x3d"group" aria-labelledby\x3d"', d, '" onmousedown\x3d"return false;"\x3e'],
                d = !1 !== g.config.toolbarStartupExpanded,
                f, l;
              g.config.toolbarCanCollapse && g.elementMode != CKEDITOR.ELEMENT_MODE_INLINE && m.push('\x3cspan class\x3d"cke_toolbox_main"' + (d ? "\x3e" : ' style\x3d"display:none"\x3e'));
              for (var p = g.toolbox.toolbars, q = a(g), w = q.length, v = 0; v < w; v++) {
                var t, u = 0,
                  r, B = q[v],
                  x = "/" !== B && ("/" === q[v + 1] || v == w - 1),
                  y;
                if (B)
                  if (f && (m.push("\x3c/span\x3e"), l = f = 0), "/" === B) m.push('\x3cspan class\x3d"cke_toolbar_break"\x3e\x3c/span\x3e');
                  else {
                    y = B.items || B;
                    for (var C = 0; C < y.length; C++) {
                      var z = y[C],
                        A;
                      if (z) {
                        var G =
                          function(a) { a = a.render(g, m);
                            D = u.items.push(a) - 1;
                            0 < D && (a.previous = u.items[D - 1], a.previous.next = a);
                            a.toolbar = u;
                            a.onkey = k;
                            a.onfocus = function() { g.toolbox.focusCommandExecuted || g.focus() } };
                        if (z.type == CKEDITOR.UI_SEPARATOR) l = f && z;
                        else {
                          A = !1 !== z.canGroup;
                          if (!u) {
                            t = CKEDITOR.tools.getNextId();
                            u = { id: t, items: [] };
                            r = B.name && (g.lang.toolbar.toolbarGroups[B.name] || B.name);
                            m.push('\x3cspan id\x3d"', t, '" class\x3d"cke_toolbar' + (x ? ' cke_toolbar_last"' : '"'), r ? ' aria-labelledby\x3d"' + t + '_label"' : "", ' role\x3d"toolbar"\x3e');
                            r && m.push('\x3cspan id\x3d"', t, '_label" class\x3d"cke_voice_label"\x3e', r, "\x3c/span\x3e");
                            m.push('\x3cspan class\x3d"cke_toolbar_start"\x3e\x3c/span\x3e');
                            var D = p.push(u) - 1;
                            0 < D && (u.previous = p[D - 1], u.previous.next = u)
                          }
                          A ? f || (m.push('\x3cspan class\x3d"cke_toolgroup" role\x3d"presentation"\x3e'), f = 1) : f && (m.push("\x3c/span\x3e"), f = 0);
                          l && (G(l), l = 0);
                          G(z)
                        }
                      }
                    }
                    f && (m.push("\x3c/span\x3e"), l = f = 0);
                    u && m.push('\x3cspan class\x3d"cke_toolbar_end"\x3e\x3c/span\x3e\x3c/span\x3e')
                  }
              }
              g.config.toolbarCanCollapse && m.push("\x3c/span\x3e");
              if (g.config.toolbarCanCollapse && g.elementMode != CKEDITOR.ELEMENT_MODE_INLINE) {
                var F = CKEDITOR.tools.addFunction(function() { g.execCommand("toolbarCollapse") });
                g.on("destroy", function() { CKEDITOR.tools.removeFunction(F) });
                g.addCommand("toolbarCollapse", {
                  readOnly: 1,
                  exec: function(a) {
                    var b = a.ui.space("toolbar_collapser"),
                      c = b.getPrevious(),
                      f = a.ui.space("contents"),
                      e = c.getParent(),
                      g = parseInt(f.$.style.height, 10),
                      d = e.$.offsetHeight,
                      h = b.hasClass("cke_toolbox_collapser_min");
                    h ? (c.show(), b.removeClass("cke_toolbox_collapser_min"),
                      b.setAttribute("title", a.lang.toolbar.toolbarCollapse)) : (c.hide(), b.addClass("cke_toolbox_collapser_min"), b.setAttribute("title", a.lang.toolbar.toolbarExpand));
                    b.getFirst().setText(h ? "▲" : "◀");
                    f.setStyle("height", g - (e.$.offsetHeight - d) + "px");
                    a.fire("resize", { outerHeight: a.container.$.offsetHeight, contentsHeight: f.$.offsetHeight, outerWidth: a.container.$.offsetWidth })
                  },
                  modes: { wysiwyg: 1, source: 1 }
                });
                g.setKeystroke(CKEDITOR.ALT + (CKEDITOR.env.ie || CKEDITOR.env.webkit ? 189 : 109), "toolbarCollapse");
                m.push('\x3ca title\x3d"' +
                  (d ? g.lang.toolbar.toolbarCollapse : g.lang.toolbar.toolbarExpand) + '" id\x3d"' + g.ui.spaceId("toolbar_collapser") + '" tabIndex\x3d"-1" class\x3d"cke_toolbox_collapser');
                d || m.push(" cke_toolbox_collapser_min");
                m.push('" onclick\x3d"CKEDITOR.tools.callFunction(' + F + ')"\x3e', '\x3cspan class\x3d"cke_arrow"\x3e\x26#9650;\x3c/span\x3e', "\x3c/a\x3e")
              }
              m.push("\x3c/span\x3e");
              c.data.html += m.join("")
            }
          });
          g.on("destroy", function() {
            if (this.toolbox) {
              var a, b = 0,
                c, f, g;
              for (a = this.toolbox.toolbars; b < a.length; b++)
                for (f = a[b].items,
                  c = 0; c < f.length; c++) g = f[c], g.clickFn && CKEDITOR.tools.removeFunction(g.clickFn), g.keyDownFn && CKEDITOR.tools.removeFunction(g.keyDownFn)
            }
          });
          g.on("uiReady", function() { var a = g.ui.space("toolbox");
            a && g.focusManager.add(a, 1) });
          g.addCommand("toolbarFocus", c);
          g.setKeystroke(CKEDITOR.ALT + 121, "toolbarFocus");
          g.ui.add("-", CKEDITOR.UI_SEPARATOR, {});
          g.ui.addHandler(CKEDITOR.UI_SEPARATOR, {
            create: function() {
              return {
                render: function(a, b) {
                  b.push('\x3cspan class\x3d"cke_toolbar_separator" role\x3d"separator"\x3e\x3c/span\x3e');
                  return {}
                }
              }
            }
          })
        }
      });
      CKEDITOR.ui.prototype.addToolbarGroup = function(a, b, c) { var e = d(this.editor),
          h = 0 === b,
          m = { name: a }; if (c) { if (c = CKEDITOR.tools.search(e, function(a) { return a.name == c })) {!c.groups && (c.groups = []); if (b && (b = CKEDITOR.tools.indexOf(c.groups, b), 0 <= b)) { c.groups.splice(b + 1, 0, a); return } h ? c.groups.splice(0, 0, a) : c.groups.push(a); return } b = null } b && (b = CKEDITOR.tools.indexOf(e, function(a) { return a.name == b }));
        h ? e.splice(0, 0, a) : "number" == typeof b ? e.splice(b + 1, 0, m) : e.push(a) }
    }(), CKEDITOR.UI_SEPARATOR = "separator",
    CKEDITOR.config.toolbarLocation = "top", "use strict",
    function() {
      function a(a, b, c) { b.type || (b.type = "auto"); if (c && !1 === a.fire("beforePaste", b) || !b.dataValue && b.dataTransfer.isEmpty()) return !1;
        b.dataValue || (b.dataValue = ""); if (CKEDITOR.env.gecko && "drop" == b.method && a.toolbox) a.once("afterPaste", function() { a.toolbox.focus() }); return a.fire("paste", b) }

      function d(b) {
        function c() {
          var a = b.editable();
          if (CKEDITOR.plugins.clipboard.isCustomCopyCutSupported) {
            var e = function(a) {
              b.getSelection().isCollapsed() || (b.readOnly &&
                "cut" == a.name || A.initPasteDataTransfer(a, b), a.data.preventDefault())
            };
            a.on("copy", e);
            a.on("cut", e);
            a.on("cut", function() { b.readOnly || b.extractSelectedHtml() }, null, null, 999)
          }
          a.on(A.mainPasteEvent, function(a) { "beforepaste" == A.mainPasteEvent && G || y(a) });
          "beforepaste" == A.mainPasteEvent && (a.on("paste", function(a) { D || (d(), a.data.preventDefault(), y(a), k("paste")) }), a.on("contextmenu", h, null, null, 0), a.on("beforepaste", function(a) {!a.data || a.data.$.ctrlKey || a.data.$.shiftKey || h() }, null, null, 0));
          a.on("beforecut",
            function() {!G && m(b) });
          var g;
          a.attachListener(CKEDITOR.env.ie ? a : b.document.getDocumentElement(), "mouseup", function() { g = setTimeout(function() { C() }, 0) });
          b.on("destroy", function() { clearTimeout(g) });
          a.on("keyup", C)
        }

        function e(a) {
          return {
            type: a,
            canUndo: "cut" == a,
            startDisabled: !0,
            fakeKeystroke: "cut" == a ? CKEDITOR.CTRL + 88 : CKEDITOR.CTRL + 67,
            exec: function() {
              "cut" == this.type && m();
              var a;
              var c = this.type;
              if (CKEDITOR.env.ie) a = k(c);
              else try { a = b.document.$.execCommand(c, !1, null) } catch (e) { a = !1 } a || b.showNotification(b.lang.clipboard[this.type +
                "Error"]);
              return a
            }
          }
        }

        function g() {
          return {
            canUndo: !1,
            async: !0,
            fakeKeystroke: CKEDITOR.CTRL + 86,
            exec: function(b, c) {
              function f(c, d) { d = "undefined" !== typeof d ? d : !0;
                c ? (c.method = "paste", c.dataTransfer || (c.dataTransfer = A.initPasteDataTransfer()), a(b, c, d)) : g && !b._.forcePasteDialog && b.showNotification(k, "info", b.config.clipboard_notificationDuration);
                b._.forcePasteDialog = !1;
                b.fire("afterCommandExec", { name: "paste", command: e, returnValue: !!c }) } c = "undefined" !== typeof c && null !== c ? c : {};
              var e = this,
                g = "undefined" !== typeof c.notification ?
                c.notification : !0,
                d = c.type,
                h = CKEDITOR.tools.keystrokeToString(b.lang.common.keyboard, b.getCommandKeystroke(this)),
                k = "string" === typeof g ? g : b.lang.clipboard.pasteNotification ? b.lang.clipboard.pasteNotification.replace(/%1/, '\x3ckbd aria-label\x3d"' + h.aria + '"\x3e' + h.display + "\x3c/kbd\x3e") : '',
                h = "string" === typeof c ? c : c.dataValue;
              d && !0 !== b.config.forcePasteAsPlainText && "allow-word" !== b.config.forcePasteAsPlainText ? b._.nextPasteType = d : delete b._.nextPasteType;
              "string" === typeof h ? f({ dataValue: h }) : b.getClipboardData(f)
            }
          }
        }

        function d() {
          D = 1;
          setTimeout(function() {
            D =
              0
          }, 100)
        }

        function h() { G = 1;
          setTimeout(function() { G = 0 }, 10) }

        function k(a) { var c = b.document,
            e = c.getBody(),
            g = !1,
            d = function() { g = !0 };
          e.on(a, d);
          7 < CKEDITOR.env.version ? c.$.execCommand(a) : c.$.selection.createRange().execCommand(a);
          e.removeListener(a, d); return g }

        function m() {
          if (CKEDITOR.env.ie && !CKEDITOR.env.quirks) {
            var a = b.getSelection(),
              c, e, g;
            a.getType() == CKEDITOR.SELECTION_ELEMENT && (c = a.getSelectedElement()) && (e = a.getRanges()[0], g = b.document.createText(""), g.insertBefore(c), e.setStartBefore(g), e.setEndAfter(c),
              a.selectRanges([e]), setTimeout(function() { c.getParent() && (g.remove(), a.selectElement(c)) }, 0))
          }
        }

        function l(a, c) {
          var e = b.document,
            g = b.editable(),
            d = function(a) { a.cancel() },
            h;
          if (!e.getById("cke_pastebin")) {
            var k = b.getSelection(),
              m = k.createBookmarks();
            CKEDITOR.env.ie && k.root.fire("selectionchange");
            var n = new CKEDITOR.dom.element(!CKEDITOR.env.webkit && !g.is("body") || CKEDITOR.env.ie ? "div" : "body", e);
            n.setAttributes({ id: "cke_pastebin", "data-cke-temp": "1" });
            var r = 0,
              e = e.getWindow();
            CKEDITOR.env.webkit ? (g.append(n),
              n.addClass("cke_editable"), g.is("body") || (r = "static" != g.getComputedStyle("position") ? g : CKEDITOR.dom.element.get(g.$.offsetParent), r = r.getDocumentPosition().y)) : g.getAscendant(CKEDITOR.env.ie ? "body" : "html", 1).append(n);
            n.setStyles({ position: "absolute", top: e.getScrollPosition().y - r + 10 + "px", width: "1px", height: Math.max(1, e.getViewPaneSize().height - 20) + "px", overflow: "hidden", margin: 0, padding: 0 });
            CKEDITOR.env.safari && n.setStyles(CKEDITOR.tools.cssVendorPrefix("user-select", "text"));
            (r = n.getParent().isReadOnly()) ?
            (n.setOpacity(0), n.setAttribute("contenteditable", !0)) : n.setStyle("ltr" == b.config.contentsLangDirection ? "left" : "right", "-10000px");
            b.on("selectionChange", d, null, null, 0);
            if (CKEDITOR.env.webkit || CKEDITOR.env.gecko) h = g.once("blur", d, null, null, -100);
            r && n.focus();
            r = new CKEDITOR.dom.range(n);
            r.selectNodeContents(n);
            var u = r.select();
            CKEDITOR.env.ie && (h = g.once("blur", function() { b.lockSelection(u) }));
            var t = CKEDITOR.document.getWindow().getScrollPosition().y;
            setTimeout(function() {
              CKEDITOR.env.webkit && (CKEDITOR.document.getBody().$.scrollTop =
                t);
              h && h.removeListener();
              CKEDITOR.env.ie && g.focus();
              k.selectBookmarks(m);
              n.remove();
              var a;
              CKEDITOR.env.webkit && (a = n.getFirst()) && a.is && a.hasClass("Apple-style-span") && (n = a);
              b.removeListener("selectionChange", d);
              c(n.getHtml())
            }, 0)
          }
        }

        function B() { if ("paste" == A.mainPasteEvent) return b.fire("beforePaste", { type: "auto", method: "paste" }), !1;
          b.focus();
          d(); var a = b.focusManager;
          a.lock(); if (b.editable().fire(A.mainPasteEvent) && !k("paste")) return a.unlock(), !1;
          a.unlock(); return !0 }

        function x(a) {
          if ("wysiwyg" == b.mode) switch (a.data.keyCode) {
            case CKEDITOR.CTRL +
            86:
            case CKEDITOR.SHIFT + 45:
              a = b.editable();
              d();
              "paste" == A.mainPasteEvent && a.fire("beforepaste");
              break;
            case CKEDITOR.CTRL + 88:
            case CKEDITOR.SHIFT + 46:
              b.fire("saveSnapshot"), setTimeout(function() { b.fire("saveSnapshot") }, 50)
          }
        }

        function y(c) {
          var e = { type: "auto", method: "paste", dataTransfer: A.initPasteDataTransfer(c) };
          e.dataTransfer.cacheData();
          var g = !1 !== b.fire("beforePaste", e);
          g && A.canClipboardApiBeTrusted(e.dataTransfer, b) ? (c.data.preventDefault(), setTimeout(function() { a(b, e) }, 0)) : l(c, function(c) {
            e.dataValue =
              c.replace(/<span[^>]+data-cke-bookmark[^<]*?<\/span>/ig, "");
            g && a(b, e)
          })
        }

        function C() { if ("wysiwyg" == b.mode) { var a = z("paste");
            b.getCommand("cut").setState(z("cut"));
            b.getCommand("copy").setState(z("copy"));
            b.getCommand("paste").setState(a);
            b.fire("pasteState", a) } }

        function z(a) {
          if (F && a in { paste: 1, cut: 1 }) return CKEDITOR.TRISTATE_DISABLED;
          if ("paste" == a) return CKEDITOR.TRISTATE_OFF;
          a = b.getSelection();
          var c = a.getRanges();
          return a.getType() == CKEDITOR.SELECTION_NONE || 1 == c.length && c[0].collapsed ? CKEDITOR.TRISTATE_DISABLED :
            CKEDITOR.TRISTATE_OFF
        }
        var A = CKEDITOR.plugins.clipboard,
          G = 0,
          D = 0,
          F = 0;
        (function() {
          b.on("key", x);
          b.on("contentDom", c);
          b.on("selectionChange", function(a) { F = a.data.selection.getRanges()[0].checkReadOnly();
            C() });
          if (b.contextMenu) {
            b.contextMenu.addListener(function(a, b) { F = b.getRanges()[0].checkReadOnly(); return { cut: z("cut"), copy: z("copy"), paste: z("paste") } });
            var a = null;
            b.on("menuShow", function() {
              a && (a.removeListener(), a = null);
              var c = b.contextMenu.findItemByCommandName("paste");
              c && c.element && (a = c.element.on("touchend",
                function() { b._.forcePasteDialog = !0 }))
            })
          }
          if (b.ui.addButton) b.once("instanceReady", function() { b._.pasteButtons && CKEDITOR.tools.array.forEach(b._.pasteButtons, function(a) { if (a = b.ui.get(a)) CKEDITOR.document.getById(a._.id).on("touchend", function() { b._.forcePasteDialog = !0 }) }) })
        })();
        (function() {
          function a(c, e, g, d, h) {
            var k = b.lang.clipboard[e];
            b.addCommand(e, g);
            b.ui.addButton && b.ui.addButton(c, { label: k, command: e, toolbar: "clipboard," + d });
            b.addMenuItems && b.addMenuItem(e, {
              label: k,
              command: e,
              group: "clipboard",
              order: h
            })
          }
          a("Cut", "cut", e("cut"), 10, 1);
          a("Copy", "copy", e("copy"), 20, 4);
          a("Paste", "paste", g(), 30, 8);
          b._.pasteButtons || (b._.pasteButtons = []);
          b._.pasteButtons.push("Paste")
        })();
        b.getClipboardData = function(a, c) {
          function e(a) { a.removeListener();
            a.cancel();
            c(a.data) }

          function g(a) { a.removeListener();
            a.cancel();
            c({ type: h, dataValue: a.data.dataValue, dataTransfer: a.data.dataTransfer, method: "paste" }) }
          var d = !1,
            h = "auto";
          c || (c = a, a = null);
          b.on("beforePaste", function(a) { a.removeListener();
              d = !0;
              h = a.data.type }, null,
            null, 1E3);
          b.on("paste", e, null, null, 0);
          !1 === B() && (b.removeListener("paste", e), b._.forcePasteDialog && d && b.fire("pasteDialog") ? (b.on("pasteDialogCommit", g), b.on("dialogHide", function(a) { a.removeListener();
            a.data.removeListener("pasteDialogCommit", g);
            a.data._.committed || c(null) })) : c(null))
        }
      }

      function b(a) {
        if (CKEDITOR.env.webkit) { if (!a.match(/^[^<]*$/g) && !a.match(/^(<div><br( ?\/)?><\/div>|<div>[^<]*<\/div>)*$/gi)) return "html" } else if (CKEDITOR.env.ie) { if (!a.match(/^([^<]|<br( ?\/)?>)*$/gi) && !a.match(/^(<p>([^<]|<br( ?\/)?>)*<\/p>|(\r\n))*$/gi)) return "html" } else if (CKEDITOR.env.gecko) { if (!a.match(/^([^<]|<br( ?\/)?>)*$/gi)) return "html" } else return "html";
        return "htmlifiedtext"
      }

      function c(a, b) {
        function c(a) { return CKEDITOR.tools.repeat("\x3c/p\x3e\x3cp\x3e", ~~(a / 2)) + (1 == a % 2 ? "\x3cbr\x3e" : "") } b = b.replace(/\s+/g, " ").replace(/> +</g, "\x3e\x3c").replace(/<br ?\/>/gi, "\x3cbr\x3e");
        b = b.replace(/<\/?[A-Z]+>/g, function(a) { return a.toLowerCase() });
        if (b.match(/^[^<]$/)) return b;
        CKEDITOR.env.webkit && -1 < b.indexOf("\x3cdiv\x3e") && (b = b.replace(/^(<div>(<br>|)<\/div>)(?!$|(<div>(<br>|)<\/div>))/g, "\x3cbr\x3e").replace(/^(<div>(<br>|)<\/div>){2}(?!$)/g, "\x3cdiv\x3e\x3c/div\x3e"),
          b.match(/<div>(<br>|)<\/div>/) && (b = "\x3cp\x3e" + b.replace(/(<div>(<br>|)<\/div>)+/g, function(a) { return c(a.split("\x3c/div\x3e\x3cdiv\x3e").length + 1) }) + "\x3c/p\x3e"), b = b.replace(/<\/div><div>/g, "\x3cbr\x3e"), b = b.replace(/<\/?div>/g, ""));
        CKEDITOR.env.gecko && a.enterMode != CKEDITOR.ENTER_BR && (CKEDITOR.env.gecko && (b = b.replace(/^<br><br>$/, "\x3cbr\x3e")), -1 < b.indexOf("\x3cbr\x3e\x3cbr\x3e") && (b = "\x3cp\x3e" + b.replace(/(<br>){2,}/g, function(a) { return c(a.length / 4) }) + "\x3c/p\x3e"));
        return k(a, b)
      }

      function g() {
        function a() {
          var b = {},
            c;
          for (c in CKEDITOR.dtd) "$" != c.charAt(0) && "div" != c && "span" != c && (b[c] = 1);
          return b
        }
        var b = {};
        return { get: function(c) { return "plain-text" == c ? b.plainText || (b.plainText = new CKEDITOR.filter("br")) : "semantic-content" == c ? ((c = b.semanticContent) || (c = new CKEDITOR.filter, c.allow({ $1: { elements: a(), attributes: !0, styles: !1, classes: !1 } }), c = b.semanticContent = c), c) : c ? new CKEDITOR.filter(c) : null } }
      }

      function l(a, b, c) {
        b = CKEDITOR.htmlParser.fragment.fromHtml(b);
        var e = new CKEDITOR.htmlParser.basicWriter;
        c.applyTo(b, !0, !1,
          a.activeEnterMode);
        b.writeHtml(e);
        return e.getHtml()
      }

      function k(a, b) { a.enterMode == CKEDITOR.ENTER_BR ? b = b.replace(/(<\/p><p>)+/g, function(a) { return CKEDITOR.tools.repeat("\x3cbr\x3e", a.length / 7 * 2) }).replace(/<\/?p>/g, "") : a.enterMode == CKEDITOR.ENTER_DIV && (b = b.replace(/<(\/)?p>/g, "\x3c$1div\x3e")); return b }

      function e(a) { a.data.preventDefault();
        a.data.$.dataTransfer.dropEffect = "none" }

      function h(b) {
        var c = CKEDITOR.plugins.clipboard;
        b.on("contentDom", function() {
          function e(c, g, d) {
            g.select();
            a(b, {
              dataTransfer: d,
              method: "drop"
            }, 1);
            d.sourceEditor.fire("saveSnapshot");
            d.sourceEditor.editable().extractHtmlFromRange(c);
            d.sourceEditor.getSelection().selectRanges([c]);
            d.sourceEditor.fire("saveSnapshot")
          }

          function g(e, d) { e.select();
            a(b, { dataTransfer: d, method: "drop" }, 1);
            c.resetDragDataTransfer() }

          function d(a, c, e) { var g = { $: a.data.$, target: a.data.getTarget() };
            c && (g.dragRange = c);
            e && (g.dropRange = e);!1 === b.fire(a.name, g) && a.data.preventDefault() }

          function h(a) { a.type != CKEDITOR.NODE_ELEMENT && (a = a.getParent()); return a.getChildCount() }
          var k = b.editable(),
            m = CKEDITOR.plugins.clipboard.getDropTarget(b),
            l = b.ui.space("top"),
            B = b.ui.space("bottom");
          c.preventDefaultDropOnElement(l);
          c.preventDefaultDropOnElement(B);
          k.attachListener(m, "dragstart", d);
          k.attachListener(b, "dragstart", c.resetDragDataTransfer, c, null, 1);
          k.attachListener(b, "dragstart", function(a) { c.initDragDataTransfer(a, b) }, null, null, 2);
          k.attachListener(b, "dragstart", function() {
            var a = c.dragRange = b.getSelection().getRanges()[0];
            CKEDITOR.env.ie && 10 > CKEDITOR.env.version && (c.dragStartContainerChildCount =
              a ? h(a.startContainer) : null, c.dragEndContainerChildCount = a ? h(a.endContainer) : null)
          }, null, null, 100);
          k.attachListener(m, "dragend", d);
          k.attachListener(b, "dragend", c.initDragDataTransfer, c, null, 1);
          k.attachListener(b, "dragend", c.resetDragDataTransfer, c, null, 100);
          k.attachListener(m, "dragover", function(a) {
            if (CKEDITOR.env.edge) a.data.preventDefault();
            else {
              var b = a.data.getTarget();
              b && b.is && b.is("html") ? a.data.preventDefault() : CKEDITOR.env.ie && CKEDITOR.plugins.clipboard.isFileApiSupported && a.data.$.dataTransfer.types.contains("Files") &&
                a.data.preventDefault()
            }
          });
          k.attachListener(m, "drop", function(a) { if (!a.data.$.defaultPrevented) { a.data.preventDefault(); var e = a.data.getTarget(); if (!e.isReadOnly() || e.type == CKEDITOR.NODE_ELEMENT && e.is("html")) { var e = c.getRangeAtDropPosition(a, b),
                  g = c.dragRange;
                e && d(a, g, e) } } }, null, null, 9999);
          k.attachListener(b, "drop", c.initDragDataTransfer, c, null, 1);
          k.attachListener(b, "drop", function(a) {
            if (a = a.data) {
              var d = a.dropRange,
                h = a.dragRange,
                k = a.dataTransfer;
              k.getTransferType(b) == CKEDITOR.DATA_TRANSFER_INTERNAL ?
                setTimeout(function() { c.internalDrop(h, d, k, b) }, 0) : k.getTransferType(b) == CKEDITOR.DATA_TRANSFER_CROSS_EDITORS ? e(h, d, k) : g(d, k)
            }
          }, null, null, 9999)
        })
      }
      var m;
      CKEDITOR.plugins.add("clipboard", {
        requires: "dialog,notification,toolbar",
        init: function(a) {
          var e, k = g();
          a.config.forcePasteAsPlainText ? e = "plain-text" : a.config.pasteFilter ? e = a.config.pasteFilter : !CKEDITOR.env.webkit || "pasteFilter" in a.config || (e = "semantic-content");
          a.pasteFilter = k.get(e);
          d(a);
          h(a);
          CKEDITOR.dialog.add("paste", CKEDITOR.getUrl(this.path +
            "dialogs/paste.js"));
          if (CKEDITOR.env.gecko) {
            var m = ["image/png", "image/jpeg", "image/gif"],
              w;
            a.on("paste", function(b) {
              var c = b.data,
                e = c.dataTransfer;
              if (!c.dataValue && "paste" == c.method && e && 1 == e.getFilesCount() && w != e.id && (e = e.getFile(0), -1 != CKEDITOR.tools.indexOf(m, e.type))) {
                var g = new FileReader;
                g.addEventListener("load", function() { b.data.dataValue = '\x3cimg src\x3d"' + g.result + '" /\x3e';
                  a.fire("paste", b.data) }, !1);
                g.addEventListener("abort", function() { a.fire("paste", b.data) }, !1);
                g.addEventListener("error",
                  function() { a.fire("paste", b.data) }, !1);
                g.readAsDataURL(e);
                w = c.dataTransfer.id;
                b.stop()
              }
            }, null, null, 1)
          }
          a.on("paste", function(b) { b.data.dataTransfer || (b.data.dataTransfer = new CKEDITOR.plugins.clipboard.dataTransfer); if (!b.data.dataValue) { var c = b.data.dataTransfer,
                e = c.getData("text/html"); if (e) b.data.dataValue = e, b.data.type = "html";
              else if (e = c.getData("text/plain")) b.data.dataValue = a.editable().transformPlainTextToHtml(e), b.data.type = "text" } }, null, null, 1);
          a.on("paste", function(a) {
            var b = a.data.dataValue,
              c = CKEDITOR.dtd.$block; - 1 < b.indexOf("Apple-") && (b = b.replace(/<span class="Apple-converted-space">&nbsp;<\/span>/gi, " "), "html" != a.data.type && (b = b.replace(/<span class="Apple-tab-span"[^>]*>([^<]*)<\/span>/gi, function(a, b) { return b.replace(/\t/g, "\x26nbsp;\x26nbsp; \x26nbsp;") })), -1 < b.indexOf('\x3cbr class\x3d"Apple-interchange-newline"\x3e') && (a.data.startsWithEOL = 1, a.data.preSniffing = "html", b = b.replace(/<br class="Apple-interchange-newline">/, "")), b = b.replace(/(<[^>]+) class="Apple-[^"]*"/gi, "$1"));
            if (b.match(/^<[^<]+cke_(editable|contents)/i)) { var e, f, g = new CKEDITOR.dom.element("div"); for (g.setHtml(b); 1 == g.getChildCount() && (e = g.getFirst()) && e.type == CKEDITOR.NODE_ELEMENT && (e.hasClass("cke_editable") || e.hasClass("cke_contents"));) g = f = e;
              f && (b = f.getHtml().replace(/<br>$/i, "")) } CKEDITOR.env.ie ? b = b.replace(/^&nbsp;(?: |\r\n)?<(\w+)/g, function(b, e) { return e.toLowerCase() in c ? (a.data.preSniffing = "html", "\x3c" + e) : b }) : CKEDITOR.env.webkit ? b = b.replace(/<\/(\w+)><div><br><\/div>$/, function(b, e) {
              return e in
                c ? (a.data.endsWithEOL = 1, "\x3c/" + e + "\x3e") : b
            }) : CKEDITOR.env.gecko && (b = b.replace(/(\s)<br>$/, "$1"));
            a.data.dataValue = b
          }, null, null, 3);
          a.on("paste", function(e) {
            e = e.data;
            var g = a._.nextPasteType || e.type,
              d = e.dataValue,
              h, m = a.config.clipboard_defaultContentType || "html",
              n = e.dataTransfer.getTransferType(a);
            h = "html" == g || "html" == e.preSniffing ? "html" : b(d);
            delete a._.nextPasteType;
            "htmlifiedtext" == h && (d = c(a.config, d));
            "text" == g && "html" == h ? d = l(a, d, k.get("plain-text")) : n == CKEDITOR.DATA_TRANSFER_EXTERNAL && a.pasteFilter &&
              !e.dontFilter && (d = l(a, d, a.pasteFilter));
            e.startsWithEOL && (d = '\x3cbr data-cke-eol\x3d"1"\x3e' + d);
            e.endsWithEOL && (d += '\x3cbr data-cke-eol\x3d"1"\x3e');
            "auto" == g && (g = "html" == h || "html" == m ? "html" : "text");
            e.type = g;
            e.dataValue = d;
            delete e.preSniffing;
            delete e.startsWithEOL;
            delete e.endsWithEOL
          }, null, null, 6);
          a.on("paste", function(b) { b = b.data;
            b.dataValue && (a.insertHtml(b.dataValue, b.type, b.range), setTimeout(function() { a.fire("afterPaste") }, 0)) }, null, null, 1E3);
          a.on("pasteDialog", function(b) {
            setTimeout(function() {
              a.openDialog("paste",
                b.data)
            }, 0)
          })
        }
      });
      CKEDITOR.plugins.clipboard = {
        isCustomCopyCutSupported: (!CKEDITOR.env.ie || 16 <= CKEDITOR.env.version) && !CKEDITOR.env.iOS,
        isCustomDataTypesSupported: !CKEDITOR.env.ie || 16 <= CKEDITOR.env.version,
        isFileApiSupported: !CKEDITOR.env.ie || 9 < CKEDITOR.env.version,
        mainPasteEvent: CKEDITOR.env.ie && !CKEDITOR.env.edge ? "beforepaste" : "paste",
        addPasteButton: function(a, b, c) { a.ui.addButton && (a.ui.addButton(b, c), a._.pasteButtons || (a._.pasteButtons = []), a._.pasteButtons.push(b)) },
        canClipboardApiBeTrusted: function(a,
          b) { return a.getTransferType(b) != CKEDITOR.DATA_TRANSFER_EXTERNAL || CKEDITOR.env.chrome && !a.isEmpty() || CKEDITOR.env.gecko && (a.getData("text/html") || a.getFilesCount()) || CKEDITOR.env.safari && 603 <= CKEDITOR.env.version && !CKEDITOR.env.iOS || CKEDITOR.env.edge && 16 <= CKEDITOR.env.version ? !0 : !1 },
        getDropTarget: function(a) { var b = a.editable(); return CKEDITOR.env.ie && 9 > CKEDITOR.env.version || b.isInline() ? b : a.document },
        fixSplitNodesAfterDrop: function(a, b, c, e) {
          function g(a, c, e) {
            var f = a;
            f.type == CKEDITOR.NODE_TEXT && (f =
              a.getParent());
            if (f.equals(c) && e != c.getChildCount()) return a = b.startContainer.getChild(b.startOffset - 1), c = b.startContainer.getChild(b.startOffset), a && a.type == CKEDITOR.NODE_TEXT && c && c.type == CKEDITOR.NODE_TEXT && (e = a.getLength(), a.setText(a.getText() + c.getText()), c.remove(), b.setStart(a, e), b.collapse(!0)), !0
          }
          var d = b.startContainer;
          "number" == typeof e && "number" == typeof c && d.type == CKEDITOR.NODE_ELEMENT && (g(a.startContainer, d, c) || g(a.endContainer, d, e))
        },
        isDropRangeAffectedByDragRange: function(a, b) {
          var c =
            b.startContainer,
            e = b.endOffset;
          return a.endContainer.equals(c) && a.endOffset <= e || a.startContainer.getParent().equals(c) && a.startContainer.getIndex() < e || a.endContainer.getParent().equals(c) && a.endContainer.getIndex() < e ? !0 : !1
        },
        internalDrop: function(b, c, e, g) {
          var d = CKEDITOR.plugins.clipboard,
            h = g.editable(),
            k, m;
          g.fire("saveSnapshot");
          g.fire("lockSnapshot", { dontUpdate: 1 });
          CKEDITOR.env.ie && 10 > CKEDITOR.env.version && this.fixSplitNodesAfterDrop(b, c, d.dragStartContainerChildCount, d.dragEndContainerChildCount);
          (m = this.isDropRangeAffectedByDragRange(b, c)) || (k = b.createBookmark(!1));
          d = c.clone().createBookmark(!1);
          m && (k = b.createBookmark(!1));
          b = k.startNode;
          c = k.endNode;
          m = d.startNode;
          c && b.getPosition(m) & CKEDITOR.POSITION_PRECEDING && c.getPosition(m) & CKEDITOR.POSITION_FOLLOWING && m.insertBefore(b);
          b = g.createRange();
          b.moveToBookmark(k);
          h.extractHtmlFromRange(b, 1);
          c = g.createRange();
          c.moveToBookmark(d);
          a(g, { dataTransfer: e, method: "drop", range: c }, 1);
          g.fire("unlockSnapshot")
        },
        getRangeAtDropPosition: function(a, b) {
          var c =
            a.data.$,
            e = c.clientX,
            g = c.clientY,
            d = b.getSelection(!0).getRanges()[0],
            h = b.createRange();
          if (a.data.testRange) return a.data.testRange;
          if (document.caretRangeFromPoint && b.document.$.caretRangeFromPoint(e, g)) c = b.document.$.caretRangeFromPoint(e, g), h.setStart(CKEDITOR.dom.node(c.startContainer), c.startOffset), h.collapse(!0);
          else if (c.rangeParent) h.setStart(CKEDITOR.dom.node(c.rangeParent), c.rangeOffset), h.collapse(!0);
          else {
            if (CKEDITOR.env.ie && 8 < CKEDITOR.env.version && d && b.editable().hasFocus) return d;
            if (document.body.createTextRange) {
              b.focus();
              c = b.document.getBody().$.createTextRange();
              try {
                for (var k = !1, m = 0; 20 > m && !k; m++) { if (!k) try { c.moveToPoint(e, g - m), k = !0 } catch (l) {}
                  if (!k) try { c.moveToPoint(e, g + m), k = !0 } catch (x) {} }
                if (k) { var y = "cke-temp-" + (new Date).getTime();
                  c.pasteHTML('\x3cspan id\x3d"' + y + '"\x3e​\x3c/span\x3e'); var C = b.document.getById(y);
                  h.moveToPosition(C, CKEDITOR.POSITION_BEFORE_START);
                  C.remove() } else {
                  var z = b.document.$.elementFromPoint(e, g),
                    A = new CKEDITOR.dom.element(z),
                    G;
                  if (A.equals(b.editable()) || "html" == A.getName()) return d && d.startContainer &&
                    !d.startContainer.equals(b.editable()) ? d : null;
                  G = A.getClientRect();
                  e < G.left ? h.setStartAt(A, CKEDITOR.POSITION_AFTER_START) : h.setStartAt(A, CKEDITOR.POSITION_BEFORE_END);
                  h.collapse(!0)
                }
              } catch (D) { return null }
            } else return null
          }
          return h
        },
        initDragDataTransfer: function(a, b) {
          var c = a.data.$ ? a.data.$.dataTransfer : null,
            e = new this.dataTransfer(c, b);
          "dragstart" === a.name && e.storeId();
          c ? this.dragData && e.id == this.dragData.id ? e = this.dragData : this.dragData = e : this.dragData ? e = this.dragData : this.dragData = e;
          a.data.dataTransfer =
            e
        },
        resetDragDataTransfer: function() { this.dragData = null },
        initPasteDataTransfer: function(a, b) { if (this.isCustomCopyCutSupported) { if (a && a.data && a.data.$) { var c = a.data.$.clipboardData,
                e = new this.dataTransfer(c, b); "copy" !== a.name && "cut" !== a.name || e.storeId();
              this.copyCutData && e.id == this.copyCutData.id ? (e = this.copyCutData, e.$ = c) : this.copyCutData = e; return e } return new this.dataTransfer(null, b) } return new this.dataTransfer(CKEDITOR.env.edge && a && a.data.$ && a.data.$.clipboardData || null, b) },
        preventDefaultDropOnElement: function(a) {
          a &&
            a.on("dragover", e)
        }
      };
      m = CKEDITOR.plugins.clipboard.isCustomDataTypesSupported ? "cke/id" : "Text";
      CKEDITOR.plugins.clipboard.dataTransfer = function(a, b) {
        a && (this.$ = a);
        this._ = { metaRegExp: /^<meta.*?>/i, bodyRegExp: /<body(?:[\s\S]*?)>([\s\S]*)<\/body>/i, fragmentRegExp: /\x3c!--(?:Start|End)Fragment--\x3e/g, data: {}, files: [], nativeHtmlCache: "", normalizeType: function(a) { a = a.toLowerCase(); return "text" == a || "text/plain" == a ? "Text" : "url" == a ? "URL" : a } };
        this._.fallbackDataTransfer = new CKEDITOR.plugins.clipboard.fallbackDataTransfer(this);
        this.id = this.getData(m);
        this.id || (this.id = "Text" == m ? "" : "cke-" + CKEDITOR.tools.getUniqueId());
        b && (this.sourceEditor = b, this.setData("text/html", b.getSelectedHtml(1)), "Text" == m || this.getData("text/plain") || this.setData("text/plain", b.getSelection().getSelectedText()))
      };
      CKEDITOR.DATA_TRANSFER_INTERNAL = 1;
      CKEDITOR.DATA_TRANSFER_CROSS_EDITORS = 2;
      CKEDITOR.DATA_TRANSFER_EXTERNAL = 3;
      CKEDITOR.plugins.clipboard.dataTransfer.prototype = {
        getData: function(a, b) {
          a = this._.normalizeType(a);
          var c = "text/html" == a && b ? this._.nativeHtmlCache :
            this._.data[a];
          if (void 0 === c || null === c || "" === c) { if (this._.fallbackDataTransfer.isRequired()) c = this._.fallbackDataTransfer.getData(a, b);
            else try { c = this.$.getData(a) || "" } catch (e) { c = "" }
            "text/html" != a || b || (c = this._stripHtml(c)) }
          "Text" == a && CKEDITOR.env.gecko && this.getFilesCount() && "file://" == c.substring(0, 7) && (c = "");
          if ("string" === typeof c) var g = c.indexOf("\x3c/html\x3e"),
            c = -1 !== g ? c.substring(0, g + 7) : c;
          return c
        },
        setData: function(a, b) {
          a = this._.normalizeType(a);
          "text/html" == a ? (this._.data[a] = this._stripHtml(b),
            this._.nativeHtmlCache = b) : this._.data[a] = b;
          if (CKEDITOR.plugins.clipboard.isCustomDataTypesSupported || "URL" == a || "Text" == a)
            if ("Text" == m && "Text" == a && (this.id = b), this._.fallbackDataTransfer.isRequired()) this._.fallbackDataTransfer.setData(a, b);
            else try { this.$.setData(a, b) } catch (c) {}
        },
        storeId: function() { "Text" !== m && this.setData(m, this.id) },
        getTransferType: function(a) { return this.sourceEditor ? this.sourceEditor == a ? CKEDITOR.DATA_TRANSFER_INTERNAL : CKEDITOR.DATA_TRANSFER_CROSS_EDITORS : CKEDITOR.DATA_TRANSFER_EXTERNAL },
        cacheData: function() {
          function a(c) { c = b._.normalizeType(c); var e = b.getData(c); "text/html" == c && (b._.nativeHtmlCache = b.getData(c, !0), e = b._stripHtml(e));
            e && (b._.data[c] = e) }
          if (this.$) {
            var b = this,
              c, e;
            if (CKEDITOR.plugins.clipboard.isCustomDataTypesSupported) { if (this.$.types)
                for (c = 0; c < this.$.types.length; c++) a(this.$.types[c]) } else a("Text"), a("URL");
            e = this._getImageFromClipboard();
            if (this.$ && this.$.files || e) {
              this._.files = [];
              if (this.$.files && this.$.files.length)
                for (c = 0; c < this.$.files.length; c++) this._.files.push(this.$.files[c]);
              0 === this._.files.length && e && this._.files.push(e)
            }
          }
        },
        getFilesCount: function() { return this._.files.length ? this._.files.length : this.$ && this.$.files && this.$.files.length ? this.$.files.length : this._getImageFromClipboard() ? 1 : 0 },
        getFile: function(a) { return this._.files.length ? this._.files[a] : this.$ && this.$.files && this.$.files.length ? this.$.files[a] : 0 === a ? this._getImageFromClipboard() : void 0 },
        isEmpty: function() {
          var a = {},
            b;
          if (this.getFilesCount()) return !1;
          CKEDITOR.tools.array.forEach(CKEDITOR.tools.objectKeys(this._.data),
            function(b) { a[b] = 1 });
          if (this.$)
            if (CKEDITOR.plugins.clipboard.isCustomDataTypesSupported) { if (this.$.types)
                for (var c = 0; c < this.$.types.length; c++) a[this.$.types[c]] = 1 } else a.Text = 1, a.URL = 1;
          "Text" != m && (a[m] = 0);
          for (b in a)
            if (a[b] && "" !== this.getData(b)) return !1;
          return !0
        },
        _getImageFromClipboard: function() { var a; if (this.$ && this.$.items && this.$.items[0]) try { if ((a = this.$.items[0].getAsFile()) && a.type) return a } catch (b) {} },
        _stripHtml: function(a) {
          if (a && a.length) {
            a = a.replace(this._.metaRegExp, "");
            var b = this._.bodyRegExp.exec(a);
            b && b.length && (a = b[1], a = a.replace(this._.fragmentRegExp, ""))
          }
          return a
        }
      };
      CKEDITOR.plugins.clipboard.fallbackDataTransfer = function(a) { this._dataTransfer = a;
        this._customDataFallbackType = "text/html" };
      CKEDITOR.plugins.clipboard.fallbackDataTransfer._isCustomMimeTypeSupported = null;
      CKEDITOR.plugins.clipboard.fallbackDataTransfer._customTypes = [];
      CKEDITOR.plugins.clipboard.fallbackDataTransfer.prototype = {
        isRequired: function() {
          var a = CKEDITOR.plugins.clipboard.fallbackDataTransfer,
            b = this._dataTransfer.$;
          if (null ===
            a._isCustomMimeTypeSupported)
            if (b) { a._isCustomMimeTypeSupported = !1; try { b.setData("cke/mimetypetest", "cke test value"), a._isCustomMimeTypeSupported = "cke test value" === b.getData("cke/mimetypetest"), b.clearData("cke/mimetypetest") } catch (c) {} } else return !1;
          return !a._isCustomMimeTypeSupported
        },
        getData: function(a, b) {
          var c = this._getData(this._customDataFallbackType, !0);
          if (b) return c;
          var c = this._extractDataComment(c),
            e = null,
            e = a === this._customDataFallbackType ? c.content : c.data && c.data[a] ? c.data[a] : this._getData(a, !0);
          return null !== e ? e : ""
        },
        setData: function(a, b) {
          var c = a === this._customDataFallbackType;
          c && (b = this._applyDataComment(b, this._getFallbackTypeData()));
          var e = b,
            g = this._dataTransfer.$;
          try { g.setData(a, e), c && (this._dataTransfer._.nativeHtmlCache = e) } catch (d) {
            if (this._isUnsupportedMimeTypeError(d)) {
              c = CKEDITOR.plugins.clipboard.fallbackDataTransfer; - 1 === CKEDITOR.tools.indexOf(c._customTypes, a) && c._customTypes.push(a);
              var c = this._getFallbackTypeContent(),
                h = this._getFallbackTypeData();
              h[a] = e;
              try {
                e = this._applyDataComment(c,
                  h), g.setData(this._customDataFallbackType, e), this._dataTransfer._.nativeHtmlCache = e
              } catch (k) { e = "" }
            }
          }
          return e
        },
        _getData: function(a, b) { var c = this._dataTransfer._.data; if (!b && c[a]) return c[a]; try { return this._dataTransfer.$.getData(a) } catch (e) { return null } },
        _getFallbackTypeContent: function() { var a = this._dataTransfer._.data[this._customDataFallbackType];
          a || (a = this._extractDataComment(this._getData(this._customDataFallbackType, !0)).content); return a },
        _getFallbackTypeData: function() {
          var a = CKEDITOR.plugins.clipboard.fallbackDataTransfer._customTypes,
            b = this._extractDataComment(this._getData(this._customDataFallbackType, !0)).data || {},
            c = this._dataTransfer._.data;
          CKEDITOR.tools.array.forEach(a, function(a) { void 0 !== c[a] ? b[a] = c[a] : void 0 !== b[a] && (b[a] = b[a]) }, this);
          return b
        },
        _isUnsupportedMimeTypeError: function(a) { return a.message && -1 !== a.message.search(/element not found/gi) },
        _extractDataComment: function(a) {
          var b = { data: null, content: a || "" };
          if (a && 16 < a.length) {
            var c;
            (c = /\x3c!--cke-data:(.*?)--\x3e/g.exec(a)) && c[1] && (b.data = JSON.parse(decodeURIComponent(c[1])),
              b.content = a.replace(c[0], ""))
          }
          return b
        },
        _applyDataComment: function(a, b) { var c = "";
          b && CKEDITOR.tools.objectKeys(b).length && (c = "\x3c!--cke-data:" + encodeURIComponent(JSON.stringify(b)) + "--\x3e"); return c + (a && a.length ? a : "") }
      }
    }(), CKEDITOR.config.clipboard_notificationDuration = 1E4, CKEDITOR.plugins.add("panelbutton", {
      requires: "button",
      onLoad: function() {
        function a(a) {
          var b = this._;
          b.state != CKEDITOR.TRISTATE_DISABLED && (this.createPanel(a), b.on ? b.panel.hide() : b.panel.showBlock(this._.id, this.document.getById(this._.id),
            4))
        }
        CKEDITOR.ui.panelButton = CKEDITOR.tools.createClass({
          base: CKEDITOR.ui.button,
          $: function(d) { var b = d.panel || {};
            delete d.panel;
            this.base(d);
            this.document = b.parent && b.parent.getDocument() || CKEDITOR.document;
            b.block = { attributes: b.attributes };
            this.hasArrow = b.toolbarRelated = !0;
            this.click = a;
            this._ = { panelDefinition: b } },
          statics: { handler: { create: function(a) { return new CKEDITOR.ui.panelButton(a) } } },
          proto: {
            createPanel: function(a) {
              var b = this._;
              if (!b.panel) {
                var c = this._.panelDefinition,
                  g = this._.panelDefinition.block,
                  l = c.parent || CKEDITOR.document.getBody(),
                  k = this._.panel = new CKEDITOR.ui.floatPanel(a, l, c),
                  c = k.addBlock(b.id, g),
                  e = this;
                k.onShow = function() { e.className && this.element.addClass(e.className + "_panel");
                  e.setState(CKEDITOR.TRISTATE_ON);
                  b.on = 1;
                  e.editorFocus && a.focus(); if (e.onOpen) e.onOpen() };
                k.onHide = function(c) { e.className && this.element.getFirst().removeClass(e.className + "_panel");
                  e.setState(e.modes && e.modes[a.mode] ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED);
                  b.on = 0; if (!c && e.onClose) e.onClose() };
                k.onEscape =
                  function() { k.hide(1);
                    e.document.getById(b.id).focus() };
                if (this.onBlock) this.onBlock(k, c);
                c.onHide = function() { b.on = 0;
                  e.setState(CKEDITOR.TRISTATE_OFF) }
              }
            }
          }
        })
      },
      beforeInit: function(a) { a.ui.addHandler(CKEDITOR.UI_PANELBUTTON, CKEDITOR.ui.panelButton.handler) }
    }), CKEDITOR.UI_PANELBUTTON = "panelbutton",
    function() {
      CKEDITOR.plugins.add("panel", { beforeInit: function(a) { a.ui.addHandler(CKEDITOR.UI_PANEL, CKEDITOR.ui.panel.handler) } });
      CKEDITOR.UI_PANEL = "panel";
      CKEDITOR.ui.panel = function(a, b) {
        b && CKEDITOR.tools.extend(this,
          b);
        CKEDITOR.tools.extend(this, { className: "", css: [] });
        this.id = CKEDITOR.tools.getNextId();
        this.document = a;
        this.isFramed = this.forceIFrame || this.css.length;
        this._ = { blocks: {} }
      };
      CKEDITOR.ui.panel.handler = { create: function(a) { return new CKEDITOR.ui.panel(a) } };
      var a = CKEDITOR.addTemplate("panel", '\x3cdiv lang\x3d"{langCode}" id\x3d"{id}" dir\x3d{dir} class\x3d"cke cke_reset_all {editorId} cke_panel cke_panel {cls} cke_{dir}" style\x3d"z-index:{z-index}" role\x3d"presentation"\x3e{frame}\x3c/div\x3e'),
        d = CKEDITOR.addTemplate("panel-frame",
          '\x3ciframe id\x3d"{id}" class\x3d"cke_panel_frame" role\x3d"presentation" frameborder\x3d"0" src\x3d"{src}"\x3e\x3c/iframe\x3e'),
        b = CKEDITOR.addTemplate("panel-frame-inner", '\x3c!DOCTYPE html\x3e\x3chtml class\x3d"cke_panel_container {env}" dir\x3d"{dir}" lang\x3d"{langCode}"\x3e\x3chead\x3e{css}\x3c/head\x3e\x3cbody class\x3d"cke_{dir}" style\x3d"margin:0;padding:0" onload\x3d"{onload}"\x3e\x3c/body\x3e\x3c/html\x3e');
      CKEDITOR.ui.panel.prototype = {
        render: function(c, g) {
          this.getHolderElement = function() {
            var a =
              this._.holder;
            if (!a) {
              if (this.isFramed) {
                var a = this.document.getById(this.id + "_frame"),
                  c = a.getParent(),
                  a = a.getFrameDocument();
                CKEDITOR.env.iOS && c.setStyles({ overflow: "scroll", "-webkit-overflow-scrolling": "touch" });
                c = CKEDITOR.tools.addFunction(CKEDITOR.tools.bind(function() { this.isLoaded = !0; if (this.onLoad) this.onLoad() }, this));
                a.write(b.output(CKEDITOR.tools.extend({ css: CKEDITOR.tools.buildStyleHtml(this.css), onload: "window.parent.CKEDITOR.tools.callFunction(" + c + ");" }, l)));
                a.getWindow().$.CKEDITOR = CKEDITOR;
                a.on("keydown", function(a) { var b = a.data.getKeystroke(),
                    c = this.document.getById(this.id).getAttribute("dir");
                  this._.onKeyDown && !1 === this._.onKeyDown(b) ? a.data.preventDefault() : (27 == b || b == ("rtl" == c ? 39 : 37)) && this.onEscape && !1 === this.onEscape(b) && a.data.preventDefault() }, this);
                a = a.getBody();
                a.unselectable();
                CKEDITOR.env.air && CKEDITOR.tools.callFunction(c)
              } else a = this.document.getById(this.id);
              this._.holder = a
            }
            return a
          };
          var l = {
            editorId: c.id,
            id: this.id,
            langCode: c.langCode,
            dir: c.lang.dir,
            cls: this.className,
            frame: "",
            env: CKEDITOR.env.cssClass,
            "z-index": c.config.baseFloatZIndex + 1
          };
          if (this.isFramed) { var k = CKEDITOR.env.air ? "javascript:void(0)" : CKEDITOR.env.ie ? "javascript:void(function(){" + encodeURIComponent("document.open();(" + CKEDITOR.tools.fixDomain + ")();document.close();") + "}())" : "";
            l.frame = d.output({ id: this.id + "_frame", src: k }) } k = a.output(l);
          g && g.push(k);
          return k
        },
        addBlock: function(a, b) {
          b = this._.blocks[a] = b instanceof CKEDITOR.ui.panel.block ? b : new CKEDITOR.ui.panel.block(this.getHolderElement(), b);
          this._.currentBlock ||
            this.showBlock(a);
          return b
        },
        getBlock: function(a) { return this._.blocks[a] },
        showBlock: function(a) { a = this._.blocks[a]; var b = this._.currentBlock,
            d = !this.forceIFrame || CKEDITOR.env.ie ? this._.holder : this.document.getById(this.id + "_frame");
          b && b.hide();
          this._.currentBlock = a;
          CKEDITOR.fire("ariaWidget", d);
          a._.focusIndex = -1;
          this._.onKeyDown = a.onKeyDown && CKEDITOR.tools.bind(a.onKeyDown, a);
          a.show(); return a },
        destroy: function() { this.element && this.element.remove() }
      };
      CKEDITOR.ui.panel.block = CKEDITOR.tools.createClass({
        $: function(a,
          b) { this.element = a.append(a.getDocument().createElement("div", { attributes: { tabindex: -1, "class": "cke_panel_block" }, styles: { display: "none" } }));
          b && CKEDITOR.tools.extend(this, b);
          this.element.setAttributes({ role: this.attributes.role || "presentation", "aria-label": this.attributes["aria-label"], title: this.attributes.title || this.attributes["aria-label"] });
          this.keys = {};
          this._.focusIndex = -1;
          this.element.disableContextMenu() },
        _: {
          markItem: function(a) {
            -1 != a && (a = this.element.getElementsByTag("a").getItem(this._.focusIndex =
              a), CKEDITOR.env.webkit && a.getDocument().getWindow().focus(), a.focus(), this.onMark && this.onMark(a))
          },
          markFirstDisplayed: function(a) { for (var b = function(a) { return a.type == CKEDITOR.NODE_ELEMENT && "none" == a.getStyle("display") }, d = this._.getItems(), k, e, h = d.count() - 1; 0 <= h; h--)
              if (k = d.getItem(h), k.getAscendant(b) || (e = k, this._.focusIndex = h), "true" == k.getAttribute("aria-selected")) { e = k;
                this._.focusIndex = h; break }
            e && (a && a(), CKEDITOR.env.webkit && e.getDocument().getWindow().focus(), e.focus(), this.onMark && this.onMark(e)) },
          getItems: function() { return this.element.getElementsByTag("a") }
        },
        proto: {
          show: function() { this.element.setStyle("display", "") },
          hide: function() { this.onHide && !0 === this.onHide.call(this) || this.element.setStyle("display", "none") },
          onKeyDown: function(a, b) {
            var d = this.keys[a];
            switch (d) {
              case "next":
                for (var k = this._.focusIndex, d = this.element.getElementsByTag("a"), e; e = d.getItem(++k);)
                  if (e.getAttribute("_cke_focus") && e.$.offsetWidth) { this._.focusIndex = k;
                    e.focus(); break }
                return e || b ? !1 : (this._.focusIndex = -1, this.onKeyDown(a,
                  1));
              case "prev":
                k = this._.focusIndex;
                for (d = this.element.getElementsByTag("a"); 0 < k && (e = d.getItem(--k));) { if (e.getAttribute("_cke_focus") && e.$.offsetWidth) { this._.focusIndex = k;
                    e.focus(); break } e = null }
                return e || b ? !1 : (this._.focusIndex = d.count(), this.onKeyDown(a, 1));
              case "click":
              case "mouseup":
                return k = this._.focusIndex, (e = 0 <= k && this.element.getElementsByTag("a").getItem(k)) && (e.$[d] ? e.$[d]() : e.$["on" + d]()), !1
            }
            return !0
          }
        }
      })
    }(), CKEDITOR.plugins.add("floatpanel", { requires: "panel" }),
    function() {
      function a(a,
        c, g, l, k) { k = CKEDITOR.tools.genKey(c.getUniqueId(), g.getUniqueId(), a.lang.dir, a.uiColor || "", l.css || "", k || ""); var e = d[k];
        e || (e = d[k] = new CKEDITOR.ui.panel(c, l), e.element = g.append(CKEDITOR.dom.element.createFromHtml(e.render(a), c)), e.element.setStyles({ display: "none", position: "absolute" })); return e }
      var d = {};
      CKEDITOR.ui.floatPanel = CKEDITOR.tools.createClass({
        $: function(b, c, g, d) {
          function k() { f.hide() } g.forceIFrame = 1;
          g.toolbarRelated && b.elementMode == CKEDITOR.ELEMENT_MODE_INLINE && (c = CKEDITOR.document.getById("cke_" +
            b.name));
          var e = c.getDocument();
          d = a(b, e, c, g, d || 0);
          var h = d.element,
            m = h.getFirst(),
            f = this;
          h.disableContextMenu();
          this.element = h;
          this._ = { editor: b, panel: d, parentElement: c, definition: g, document: e, iframe: m, children: [], dir: b.lang.dir, showBlockParams: null };
          b.on("mode", k);
          b.on("resize", k);
          e.getWindow().on("resize", function() { this.reposition() }, this)
        },
        proto: {
          addBlock: function(a, c) { return this._.panel.addBlock(a, c) },
          addListBlock: function(a, c) { return this._.panel.addListBlock(a, c) },
          getBlock: function(a) { return this._.panel.getBlock(a) },
          showBlock: function(a, c, g, d, k, e) {
            var h = this._.panel,
              m = h.showBlock(a);
            this._.showBlockParams = [].slice.call(arguments);
            this.allowBlur(!1);
            var f = this._.editor.editable();
            this._.returnFocus = f.hasFocus ? f : new CKEDITOR.dom.element(CKEDITOR.document.$.activeElement);
            this._.hideTimeout = 0;
            var n = this.element,
              f = this._.iframe,
              f = CKEDITOR.env.ie && !CKEDITOR.env.edge ? f : new CKEDITOR.dom.window(f.$.contentWindow),
              p = n.getDocument(),
              q = this._.parentElement.getPositionedAncestor(),
              w = c.getDocumentPosition(p),
              p = q ? q.getDocumentPosition(p) : { x: 0, y: 0 },
              v = "rtl" == this._.dir,
              t = w.x + (d || 0) - p.x,
              u = w.y + (k || 0) - p.y;
            !v || 1 != g && 4 != g ? v || 2 != g && 3 != g || (t += c.$.offsetWidth - 1) : t += c.$.offsetWidth;
            if (3 == g || 4 == g) u += c.$.offsetHeight - 1;
            this._.panel._.offsetParentId = c.getId();
            n.setStyles({ top: u + "px", left: 0, display: "" });
            n.setOpacity(0);
            n.getFirst().removeStyle("width");
            this._.editor.focusManager.add(f);
            this._.blurSet || (CKEDITOR.event.useCapture = !0, f.on("blur", function(a) {
              function b() { delete this._.returnFocus;
                this.hide() } this.allowBlur() && a.data.getPhase() == CKEDITOR.EVENT_PHASE_AT_TARGET &&
                this.visible && !this._.activeChild && (CKEDITOR.env.iOS ? this._.hideTimeout || (this._.hideTimeout = CKEDITOR.tools.setTimeout(b, 0, this)) : b.call(this))
            }, this), f.on("focus", function() { this._.focused = !0;
              this.hideChild();
              this.allowBlur(!0) }, this), CKEDITOR.env.iOS && (f.on("touchstart", function() { clearTimeout(this._.hideTimeout) }, this), f.on("touchend", function() { this._.hideTimeout = 0;
              this.focus() }, this)), CKEDITOR.event.useCapture = !1, this._.blurSet = 1);
            h.onEscape = CKEDITOR.tools.bind(function(a) {
              if (this.onEscape &&
                !1 === this.onEscape(a)) return !1
            }, this);
            CKEDITOR.tools.setTimeout(function() {
              var a = CKEDITOR.tools.bind(function() {
                var a = n;
                a.removeStyle("width");
                if (m.autoSize) {
                  var b = m.element.getDocument(),
                    b = (CKEDITOR.env.webkit || CKEDITOR.env.edge ? m.element : b.getBody()).$.scrollWidth;
                  CKEDITOR.env.ie && CKEDITOR.env.quirks && 0 < b && (b += (a.$.offsetWidth || 0) - (a.$.clientWidth || 0) + 3);
                  a.setStyle("width", b + 10 + "px");
                  b = m.element.$.scrollHeight;
                  CKEDITOR.env.ie && CKEDITOR.env.quirks && 0 < b && (b += (a.$.offsetHeight || 0) - (a.$.clientHeight ||
                    0) + 3);
                  a.setStyle("height", b + "px");
                  h._.currentBlock.element.setStyle("display", "none").removeStyle("display")
                } else a.removeStyle("height");
                v && (t -= n.$.offsetWidth);
                n.setStyle("left", t + "px");
                var b = h.element.getWindow(),
                  a = n.$.getBoundingClientRect(),
                  b = b.getViewPaneSize(),
                  c = a.width || a.right - a.left,
                  f = a.height || a.bottom - a.top,
                  g = v ? a.right : b.width - a.left,
                  d = v ? b.width - a.right : a.left;
                v ? g < c && (t = d > c ? t + c : b.width > c ? t - a.left : t - a.right + b.width) : g < c && (t = d > c ? t - c : b.width > c ? t - a.right + b.width : t - a.left);
                c = a.top;
                b.height -
                  a.top < f && (u = c > f ? u - f : b.height > f ? u - a.bottom + b.height : u - a.top);
                CKEDITOR.env.ie && (b = a = new CKEDITOR.dom.element(n.$.offsetParent), "html" == b.getName() && (b = b.getDocument().getBody()), "rtl" == b.getComputedStyle("direction") && (t = CKEDITOR.env.ie8Compat ? t - 2 * n.getDocument().getDocumentElement().$.scrollLeft : t - (a.$.scrollWidth - a.$.clientWidth)));
                var a = n.getFirst(),
                  k;
                (k = a.getCustomData("activePanel")) && k.onHide && k.onHide.call(this, 1);
                a.setCustomData("activePanel", this);
                n.setStyles({ top: u + "px", left: t + "px" });
                n.setOpacity(1);
                e && e()
              }, this);
              h.isLoaded ? a() : h.onLoad = a;
              CKEDITOR.tools.setTimeout(function() { var a = CKEDITOR.env.webkit && CKEDITOR.document.getWindow().getScrollPosition().y;
                  this.focus();
                  m.element.focus();
                  CKEDITOR.env.webkit && (CKEDITOR.document.getBody().$.scrollTop = a);
                  this.allowBlur(!0);
                  CKEDITOR.env.ie ? CKEDITOR.tools.setTimeout(function() { m.markFirstDisplayed ? m.markFirstDisplayed() : m._.markFirstDisplayed() }, 0) : m.markFirstDisplayed ? m.markFirstDisplayed() : m._.markFirstDisplayed();
                  this._.editor.fire("panelShow", this) },
                0, this)
            }, CKEDITOR.env.air ? 200 : 0, this);
            this.visible = 1;
            this.onShow && this.onShow.call(this)
          },
          reposition: function() { var a = this._.showBlockParams;
            this.visible && this._.showBlockParams && (this.hide(), this.showBlock.apply(this, a)) },
          focus: function() { if (CKEDITOR.env.webkit) { var a = CKEDITOR.document.getActive();
              a && !a.equals(this._.iframe) && a.$.blur() }(this._.lastFocused || this._.iframe.getFrameDocument().getWindow()).focus() },
          blur: function() {
            var a = this._.iframe.getFrameDocument().getActive();
            a && a.is("a") && (this._.lastFocused =
              a)
          },
          hide: function(a) { if (this.visible && (!this.onHide || !0 !== this.onHide.call(this))) { this.hideChild();
              CKEDITOR.env.gecko && this._.iframe.getFrameDocument().$.activeElement.blur();
              this.element.setStyle("display", "none");
              this.visible = 0;
              this.element.getFirst().removeCustomData("activePanel"); if (a = a && this._.returnFocus) CKEDITOR.env.webkit && a.type && a.getWindow().$.focus(), a.focus();
              delete this._.lastFocused;
              this._.showBlockParams = null;
              this._.editor.fire("panelHide", this) } },
          allowBlur: function(a) {
            var c = this._.panel;
            void 0 !== a && (c.allowBlur = a);
            return c.allowBlur
          },
          showAsChild: function(a, c, g, d, k, e) { if (this._.activeChild != a || a._.panel._.offsetParentId != g.getId()) this.hideChild(), a.onHide = CKEDITOR.tools.bind(function() { CKEDITOR.tools.setTimeout(function() { this._.focused || this.hide() }, 0, this) }, this), this._.activeChild = a, this._.focused = !1, a.showBlock(c, g, d, k, e), this.blur(), (CKEDITOR.env.ie7Compat || CKEDITOR.env.ie6Compat) && setTimeout(function() { a.element.getChild(0).$.style.cssText += "" }, 100) },
          hideChild: function(a) {
            var c =
              this._.activeChild;
            c && (delete c.onHide, delete this._.activeChild, c.hide(), a && this.focus())
          }
        }
      });
      CKEDITOR.on("instanceDestroyed", function() { var a = CKEDITOR.tools.isEmpty(CKEDITOR.instances),
          c; for (c in d) { var g = d[c];
          a ? g.destroy() : g.element.hide() } a && (d = {}) })
    }(), CKEDITOR.plugins.add("colorbutton", {
      requires: "panelbutton,floatpanel",
      init: function(a) {
        function d(c, e, d, h, q) {
          var w = new CKEDITOR.style(l["colorButton_" + e + "Style"]),
            v = CKEDITOR.tools.getNextId() + "_colorBox",
            t;
          q = q || {};
          a.ui.add(c, CKEDITOR.UI_PANELBUTTON, {
            label: d,
            title: d,
            modes: { wysiwyg: 1 },
            editorFocus: 0,
            toolbar: "colors," + h,
            allowedContent: w,
            requiredContent: w,
            contentTransformations: q.contentTransformations,
            panel: { css: CKEDITOR.skin.getPath("editor"), attributes: { role: "listbox", "aria-label": k.panelTitle } },
            onBlock: function(c, g) {
              t = g;
              g.autoSize = !0;
              g.element.addClass("cke_colorblock");
              g.element.setHtml(b(c, e, v));
              g.element.getDocument().getBody().setStyle("overflow", "hidden");
              CKEDITOR.ui.fire("ready", this);
              var d = g.keys,
                h = "rtl" == a.lang.dir;
              d[h ? 37 : 39] = "next";
              d[40] = "next";
              d[9] = "next";
              d[h ? 39 : 37] = "prev";
              d[38] = "prev";
              d[CKEDITOR.SHIFT + 9] = "prev";
              d[32] = "click"
            },
            refresh: function() { a.activeFilter.check(w) || this.setState(CKEDITOR.TRISTATE_DISABLED) },
            onOpen: function() {
              var b = a.getSelection(),
                c = b && b.getStartElement(),
                d = a.elementPath(c);
              if (d) {
                c = d.block || d.blockLimit || a.document.getBody();
                do d = c && c.getComputedStyle("back" == e ? "background-color" : "color") || "transparent"; while ("back" == e && "transparent" == d && c && (c = c.getParent()));
                d && "transparent" != d || (d = "#ffffff");
                !1 !== l.colorButton_enableAutomatic &&
                  this._.panel._.iframe.getFrameDocument().getById(v).setStyle("background-color", d);
                if (c = b && b.getRanges()[0]) {
                  for (var b = new CKEDITOR.dom.walker(c), h = c.collapsed ? c.startContainer : b.next(), c = ""; h;) { h.type === CKEDITOR.NODE_TEXT && (h = h.getParent());
                    h = g(h.getComputedStyle("back" == e ? "background-color" : "color"));
                    c = c || h; if (c !== h) { c = ""; break } h = b.next() } b = c;
                  c = t._.getItems();
                  for (h = 0; h < c.count(); h++) {
                    var k = c.getItem(h);
                    k.removeAttribute("aria-selected");
                    b && b == g(k.getAttribute("data-value")) && k.setAttribute("aria-selected", !0)
                  }
                }
                return d
              }
            }
          })
        }

        function b(b, e, d) {
          b = [];
          var g = l.colorButton_colors.split(","),
            h = l.colorButton_colorsPerRow || 6,
            w = a.plugins.colordialog && !1 !== l.colorButton_enableMore,
            v = g.length + (w ? 2 : 1),
            t = CKEDITOR.tools.addFunction(function(b, e) {
              function f(b) {
                a.removeStyle(new CKEDITOR.style(l["colorButton_" + e + "Style"], { color: "inherit" }));
                var d = l["colorButton_" + e + "Style"];
                d.childRule = "back" == e ? function(a) { return c(a) } : function(a) { return !(a.is("a") || a.getElementsByTag("a").count()) || c(a) };
                a.focus();
                a.applyStyle(new CKEDITOR.style(d, { color: b }));
                a.fire("saveSnapshot")
              }
              a.focus();
              a.fire("saveSnapshot");
              if ("?" == b) a.getColorFromDialog(function(a) { if (a) return f(a) });
              else return f(b)
            });
          !1 !== l.colorButton_enableAutomatic && b.push('\x3ca class\x3d"cke_colorauto" _cke_focus\x3d1 hidefocus\x3dtrue title\x3d"', k.auto, '" onclick\x3d"CKEDITOR.tools.callFunction(', t, ",null,'", e, "');return false;\" href\x3d\"javascript:void('", k.auto, '\')" role\x3d"option" aria-posinset\x3d"1" aria-setsize\x3d"', v, '"\x3e\x3ctable role\x3d"presentation" cellspacing\x3d0 cellpadding\x3d0 width\x3d"100%"\x3e\x3ctr\x3e\x3ctd colspan\x3d"' +
            h + '" align\x3d"center"\x3e\x3cspan class\x3d"cke_colorbox" id\x3d"', d, '"\x3e\x3c/span\x3e', k.auto, "\x3c/td\x3e\x3c/tr\x3e\x3c/table\x3e\x3c/a\x3e");
          b.push('\x3ctable role\x3d"presentation" cellspacing\x3d0 cellpadding\x3d0 width\x3d"100%"\x3e');
          for (d = 0; d < g.length; d++) {
            0 === d % h && b.push("\x3c/tr\x3e\x3ctr\x3e");
            var u = g[d].split("/"),
              r = u[0],
              B = u[1] || r;
            u[1] || (r = "#" + r.replace(/^(.)(.)(.)$/, "$1$1$2$2$3$3"));
            u = a.lang.colorbutton.colors[B] || B;
            b.push('\x3ctd\x3e\x3ca class\x3d"cke_colorbox" _cke_focus\x3d1 hidefocus\x3dtrue title\x3d"',
              u, '" onclick\x3d"CKEDITOR.tools.callFunction(', t, ",'", r, "','", e, "'); return false;\" href\x3d\"javascript:void('", u, '\')" data-value\x3d"' + B + '" role\x3d"option" aria-posinset\x3d"', d + 2, '" aria-setsize\x3d"', v, '"\x3e\x3cspan class\x3d"cke_colorbox" style\x3d"background-color:#', B, '"\x3e\x3c/span\x3e\x3c/a\x3e\x3c/td\x3e')
          }
          w && b.push('\x3c/tr\x3e\x3ctr\x3e\x3ctd colspan\x3d"' + h + '" align\x3d"center"\x3e\x3ca class\x3d"cke_colormore" _cke_focus\x3d1 hidefocus\x3dtrue title\x3d"', k.more, '" onclick\x3d"CKEDITOR.tools.callFunction(',
            t, ",'?','", e, "');return false;\" href\x3d\"javascript:void('", k.more, "')\"", ' role\x3d"option" aria-posinset\x3d"', v, '" aria-setsize\x3d"', v, '"\x3e', k.more, "\x3c/a\x3e\x3c/td\x3e");
          b.push("\x3c/tr\x3e\x3c/table\x3e");
          return b.join("")
        }

        function c(a) { return "false" == a.getAttribute("contentEditable") || a.getAttribute("data-nostyle") }

        function g(a) { return CKEDITOR.tools.normalizeHex("#" + CKEDITOR.tools.convertRgbToHex(a || "")).replace(/#/g, "") }
        var l = a.config,
          k = a.lang.colorbutton;
        if (!CKEDITOR.env.hc) {
          d("TextColor",
            "fore", k.textColorTitle, 10, { contentTransformations: [
                [{ element: "font", check: "span{color}", left: function(a) { return !!a.attributes.color }, right: function(a) { a.name = "span";
                    a.attributes.color && (a.styles.color = a.attributes.color);
                    delete a.attributes.color } }]
              ] });
          var e = {},
            h = a.config.colorButton_normalizeBackground;
          if (void 0 === h || h) e.contentTransformations = [
            [{
              element: "span",
              left: function(a) {
                var b = CKEDITOR.tools;
                if ("span" != a.name || !a.styles || !a.styles.background) return !1;
                a = b.style.parse.background(a.styles.background);
                return a.color && 1 === b.objectKeys(a).length
              },
              right: function(b) { var c = (new CKEDITOR.style(a.config.colorButton_backStyle, { color: b.styles.background })).getDefinition();
                b.name = c.element;
                b.styles = c.styles;
                b.attributes = c.attributes || {}; return b }
            }]
          ];
          d("BGColor", "back", k.bgColorTitle, 20, e)
        }
      }
    }), CKEDITOR.config.colorButton_colors = "1ABC9C,2ECC71,3498DB,9B59B6,4E5F70,F1C40F,16A085,27AE60,2980B9,8E44AD,2C3E50,F39C12,E67E22,E74C3C,ECF0F1,95A5A6,DDD,FFF,D35400,C0392B,BDC3C7,7F8C8D,999,000", CKEDITOR.config.colorButton_foreStyle = { element: "span", styles: { color: "#(color)" }, overrides: [{ element: "font", attributes: { color: null } }] }, CKEDITOR.config.colorButton_backStyle = { element: "span", styles: { "background-color": "#(color)" } }, CKEDITOR.plugins.colordialog = {
      requires: "dialog",
      init: function(a) {
        var d = new CKEDITOR.dialogCommand("colordialog");
        d.editorFocus = !1;
        a.addCommand("colordialog", d);
        CKEDITOR.dialog.add("colordialog", this.path + "dialogs/colordialog.js");
        a.getColorFromDialog = function(b, c) {
          var d, l, k;
          d = function(a) {
            l(this);
            a = "ok" == a.name ?
              this.getValueOf("picker", "selectedColor") : null;
            /^[0-9a-f]{3}([0-9a-f]{3})?$/i.test(a) && (a = "#" + a);
            b.call(c, a)
          };
          l = function(a) { a.removeListener("ok", d);
            a.removeListener("cancel", d) };
          k = function(a) { a.on("ok", d);
            a.on("cancel", d) };
          a.execCommand("colordialog");
          if (a._.storedDialogs && a._.storedDialogs.colordialog) k(a._.storedDialogs.colordialog);
          else CKEDITOR.on("dialogDefinition", function(a) {
            if ("colordialog" == a.data.name) {
              var b = a.data.definition;
              a.removeListener();
              b.onLoad = CKEDITOR.tools.override(b.onLoad,
                function(a) { return function() { k(this);
                    b.onLoad = a; "function" == typeof a && a.call(this) } })
            }
          })
        }
      }
    }, CKEDITOR.plugins.add("colordialog", CKEDITOR.plugins.colordialog),
    function() {
      function a(a, b, c, d) { var f = new CKEDITOR.dom.walker(a); if (a = a.startContainer.getAscendant(b, !0) || a.endContainer.getAscendant(b, !0))
          if (c(a), d) return; for (; a = f.next();)
          if (a = a.getAscendant(b, !0))
            if (c(a), d) break }

      function d(a, b) { var d = { ul: "ol", ol: "ul" }; return -1 !== c(b, function(b) { return b.element === a || b.element === d[a] }) }

      function b(a) {
        this.styles =
          null;
        this.sticky = !1;
        this.editor = a;
        this.filter = new CKEDITOR.filter(a.config.copyFormatting_allowRules);
        !0 === a.config.copyFormatting_allowRules && (this.filter.disabled = !0);
        a.config.copyFormatting_disallowRules && this.filter.disallow(a.config.copyFormatting_disallowRules)
      }
      var c = CKEDITOR.tools.indexOf,
        g = CKEDITOR.tools.getMouseButton,
        l = !1;
      CKEDITOR.plugins.add("copyformatting", {
        lang: "az,de,en,it,ja,nb,nl,oc,pl,pt-br,ru,sv,tr,zh,zh-cn",
        icons: "copyformatting",
        hidpi: !0,
        init: function(a) {
          var b = CKEDITOR.plugins.copyformatting;
          b._addScreenReaderContainer();
          l || (CKEDITOR.document.appendStyleSheet(this.path + "styles/copyformatting.css"), l = !0);
          a.addContentsCss && a.addContentsCss(this.path + "styles/copyformatting.css");
          a.copyFormatting = new b.state(a);
          a.addCommand("copyFormatting", b.commands.copyFormatting);
          a.addCommand("applyFormatting", b.commands.applyFormatting);
          a.ui.addButton("CopyFormatting", { label: a.lang.copyformatting.label, command: "copyFormatting", toolbar: "cleanup,0" });
          a.on("contentDom", function() {
            var b = a.editable(),
              c = b.isInline() ?
              b : a.document,
              e = a.ui.get("CopyFormatting");
            b.attachListener(c, "mouseup", function(b) { g(b) === CKEDITOR.MOUSE_BUTTON_LEFT && a.execCommand("applyFormatting") });
            b.attachListener(CKEDITOR.document, "mouseup", function(c) { var e = a.getCommand("copyFormatting");
              g(c) !== CKEDITOR.MOUSE_BUTTON_LEFT || e.state !== CKEDITOR.TRISTATE_ON || b.contains(c.data.getTarget()) || a.execCommand("copyFormatting") });
            e && (c = CKEDITOR.document.getById(e._.id), b.attachListener(c, "dblclick", function() { a.execCommand("copyFormatting", { sticky: !0 }) }),
              b.attachListener(c, "mouseup", function(a) { a.data.stopPropagation() }))
          });
          a.config.copyFormatting_keystrokeCopy && a.setKeystroke(a.config.copyFormatting_keystrokeCopy, "copyFormatting");
          a.on("key", function(b) { var c = a.getCommand("copyFormatting");
            b = b.data.domEvent;
            b.getKeystroke && 27 === b.getKeystroke() && c.state === CKEDITOR.TRISTATE_ON && a.execCommand("copyFormatting") });
          a.copyFormatting.on("extractFormatting", function(c) {
            var d = c.data.element;
            if (d.contains(a.editable()) || d.equals(a.editable())) return c.cancel();
            d = b._convertElementToStyleDef(d);
            if (!a.copyFormatting.filter.check(new CKEDITOR.style(d), !0, !0)) return c.cancel();
            c.data.styleDef = d
          });
          a.copyFormatting.on("applyFormatting", function(g) {
            if (!g.data.preventFormatStripping) {
              var m = g.data.range,
                f = b._extractStylesFromRange(a, m),
                l = b._determineContext(m),
                p, q;
              if (a.copyFormatting._isContextAllowed(l))
                for (q = 0; q < f.length; q++) l = f[q], p = m.createBookmark(), -1 === c(b.preservedElements, l.element) ? CKEDITOR.env.webkit && !CKEDITOR.env.chrome ? f[q].removeFromRange(g.data.range,
                  g.editor) : f[q].remove(g.editor) : d(l.element, g.data.styles) && b._removeStylesFromElementInRange(m, l.element), m.moveToBookmark(p)
            }
          });
          a.copyFormatting.on("applyFormatting", function(b) {
            var c = CKEDITOR.plugins.copyformatting,
              e = c._determineContext(b.data.range);
            "list" === e && a.copyFormatting._isContextAllowed("list") ? c._applyStylesToListContext(b.editor, b.data.range, b.data.styles) : "table" === e && a.copyFormatting._isContextAllowed("table") ? c._applyStylesToTableContext(b.editor, b.data.range, b.data.styles) : a.copyFormatting._isContextAllowed("text") &&
              c._applyStylesToTextContext(b.editor, b.data.range, b.data.styles)
          }, null, null, 999)
        }
      });
      b.prototype._isContextAllowed = function(a) { var b = this.editor.config.copyFormatting_allowedContexts; return !0 === b || -1 !== c(b, a) };
      CKEDITOR.event.implementOn(b.prototype);
      CKEDITOR.plugins.copyformatting = {
        state: b,
        inlineBoundary: "h1 h2 h3 h4 h5 h6 p div".split(" "),
        excludedAttributes: ["id", "style", "href", "data-cke-saved-href", "dir"],
        elementsForInlineTransform: ["li"],
        excludedElementsFromInlineTransform: ["table", "thead", "tbody",
          "ul", "ol"
        ],
        excludedAttributesFromInlineTransform: ["value", "type"],
        preservedElements: "ul ol li td th tr thead tbody table".split(" "),
        breakOnElements: ["ul", "ol", "table"],
        _initialKeystrokePasteCommand: null,
        commands: {
          copyFormatting: {
            exec: function(a, b) {
              var c = CKEDITOR.plugins.copyformatting,
                d = a.copyFormatting,
                f = b ? "keystrokeHandler" == b.from : !1,
                g = b ? b.sticky || f : !1,
                l = c._getCursorContainer(a),
                q = CKEDITOR.document.getDocumentElement();
              if (this.state === CKEDITOR.TRISTATE_ON) return d.styles = null, d.sticky = !1, l.removeClass("cke_copyformatting_active"),
                q.removeClass("cke_copyformatting_disabled"), q.removeClass("cke_copyformatting_tableresize_cursor"), c._putScreenReaderMessage(a, "canceled"), c._detachPasteKeystrokeHandler(a), this.setState(CKEDITOR.TRISTATE_OFF);
              d.styles = c._extractStylesFromElement(a, a.elementPath().lastElement);
              this.setState(CKEDITOR.TRISTATE_ON);
              f || (l.addClass("cke_copyformatting_active"), q.addClass("cke_copyformatting_tableresize_cursor"), a.config.copyFormatting_outerCursor && q.addClass("cke_copyformatting_disabled"));
              d.sticky = g;
              c._putScreenReaderMessage(a, "copied");
              c._attachPasteKeystrokeHandler(a)
            }
          },
          applyFormatting: {
            editorFocus: !1,
            exec: function(a, b) {
              var c = a.getCommand("copyFormatting"),
                d = b ? "keystrokeHandler" == b.from : !1,
                f = CKEDITOR.plugins.copyformatting,
                g = a.copyFormatting,
                l = f._getCursorContainer(a),
                q = CKEDITOR.document.getDocumentElement();
              if (d || c.state === CKEDITOR.TRISTATE_ON) {
                if (d && !g.styles) return f._putScreenReaderMessage(a, "failed"), f._detachPasteKeystrokeHandler(a), !1;
                d = f._applyFormat(a, g.styles);
                g.sticky || (g.styles =
                  null, l.removeClass("cke_copyformatting_active"), q.removeClass("cke_copyformatting_disabled"), q.removeClass("cke_copyformatting_tableresize_cursor"), c.setState(CKEDITOR.TRISTATE_OFF), f._detachPasteKeystrokeHandler(a));
                f._putScreenReaderMessage(a, d ? "applied" : "canceled")
              }
            }
          }
        },
        _getCursorContainer: function(a) { return a.elementMode === CKEDITOR.ELEMENT_MODE_INLINE ? a.editable() : a.editable().getParent() },
        _convertElementToStyleDef: function(a) {
          var b = CKEDITOR.tools,
            c = a.getAttributes(CKEDITOR.plugins.copyformatting.excludedAttributes),
            b = b.parseCssText(a.getAttribute("style"), !0, !0);
          return { element: a.getName(), type: CKEDITOR.STYLE_INLINE, attributes: c, styles: b }
        },
        _extractStylesFromElement: function(a, b) {
          var d = {},
            g = [];
          do
            if (b.type === CKEDITOR.NODE_ELEMENT && !b.hasAttribute("data-cke-bookmark") && (d.element = b, a.copyFormatting.fire("extractFormatting", d, a) && d.styleDef && g.push(new CKEDITOR.style(d.styleDef)), b.getName && -1 !== c(CKEDITOR.plugins.copyformatting.breakOnElements, b.getName()))) break; while ((b = b.getParent()) && b.type === CKEDITOR.NODE_ELEMENT);
          return g
        },
        _extractStylesFromRange: function(a, b) { for (var c = [], d = new CKEDITOR.dom.walker(b), f; f = d.next();) c = c.concat(CKEDITOR.plugins.copyformatting._extractStylesFromElement(a, f)); return c },
        _removeStylesFromElementInRange: function(a, b) { for (var d = -1 !== c(["ol", "ul", "table"], b), g = new CKEDITOR.dom.walker(a), f; f = g.next();)
            if (f = f.getAscendant(b, !0))
              if (f.removeAttributes(f.getAttributes()), d) break },
        _getSelectedWordOffset: function(a) {
          function b(a, c) {
            return a[c ? "getPrevious" : "getNext"](function(a) {
              return a.type !==
                CKEDITOR.NODE_COMMENT
            })
          }

          function d(a) { return a.type == CKEDITOR.NODE_ELEMENT ? (a = a.getHtml().replace(/<span.*?>&nbsp;<\/span>/g, ""), a.replace(/<.*?>/g, "")) : a.getText() }

          function g(a, f) {
            var k = a,
              l = /\s/g,
              n = "p br ol ul li td th div caption body".split(" "),
              p = !1,
              w = !1,
              z, A;
            do { for (z = b(k, f); !z && k.getParent();) { k = k.getParent(); if (-1 !== c(n, k.getName())) { w = p = !0; break } z = b(k, f) } if (z && z.getName && -1 !== c(n, z.getName())) { p = !0; break } k = z } while (k && k.getStyle && ("none" == k.getStyle("display") || !k.getText()));
            for (k || (k = a); k.type !==
              CKEDITOR.NODE_TEXT;) k = !p || f || w ? k.getChild(0) : k.getChild(k.getChildCount() - 1);
            for (n = d(k); null != (w = l.exec(n)) && (A = w.index, f););
            if ("number" !== typeof A && !p) return g(k, f);
            if (p) f ? A = 0 : (l = /([\.\b]*$)/, A = (w = l.exec(n)) ? w.index : n.length);
            else if (f && (A += 1, A > n.length)) return g(k);
            return { node: k, offset: A }
          }
          var f = /\b\w+\b/ig,
            l, p, q, w, v;
          q = w = v = a.startContainer;
          for (l = d(q); null != (p = f.exec(l));)
            if (p.index + p[0].length >= a.startOffset) return a = p.index, f = p.index + p[0].length, 0 === p.index && (p = g(q, !0), w = p.node, a = p.offset), f >= l.length &&
              (l = g(q), v = l.node, f = l.offset), { startNode: w, startOffset: a, endNode: v, endOffset: f };
          return null
        },
        _filterStyles: function(a) { var b = CKEDITOR.tools.isEmpty,
            c = [],
            d, f; for (f = 0; f < a.length; f++) d = a[f]._.definition, -1 !== CKEDITOR.tools.indexOf(CKEDITOR.plugins.copyformatting.inlineBoundary, d.element) && (d.element = a[f].element = "span"), "span" === d.element && b(d.attributes) && b(d.styles) || c.push(a[f]); return c },
        _determineContext: function(a) {
          function b(c) {
            var e = new CKEDITOR.dom.walker(a),
              f;
            if (a.startContainer.getAscendant(c, !0) || a.endContainer.getAscendant(c, !0)) return !0;
            for (; f = e.next();)
              if (f.getAscendant(c, !0)) return !0
          }
          return b({ ul: 1, ol: 1 }) ? "list" : b("table") ? "table" : "text"
        },
        _applyStylesToTextContext: function(a, b, d) {
          var g = CKEDITOR.plugins.copyformatting,
            f = g.excludedAttributesFromInlineTransform,
            l, p;
          CKEDITOR.env.webkit && !CKEDITOR.env.chrome && a.getSelection().selectRanges([b]);
          for (l = 0; l < d.length; l++)
            if (b = d[l], -1 === c(g.excludedElementsFromInlineTransform, b.element)) {
              if (-1 !== c(g.elementsForInlineTransform, b.element))
                for (b.element =
                  b._.definition.element = "span", p = 0; p < f.length; p++) b._.definition.attributes[f[p]] && delete b._.definition.attributes[f[p]];
              b.apply(a)
            }
        },
        _applyStylesToListContext: function(b, c, d) {
          var g, f, l;
          for (l = 0; l < d.length; l++) g = d[l], f = c.createBookmark(), "ol" === g.element || "ul" === g.element ? a(c, { ul: 1, ol: 1 }, function(a) { var b = g;
            a.getName() !== b.element && a.renameNode(b.element);
            b.applyToObject(a) }, !0) : "li" === g.element ? a(c, "li", function(a) { g.applyToObject(a) }) : CKEDITOR.plugins.copyformatting._applyStylesToTextContext(b, c, [g]), c.moveToBookmark(f)
        },
        _applyStylesToTableContext: function(b, e, d) {
          function g(a, b) { a.getName() !== b.element && (b = b.getDefinition(), b.element = a.getName(), b = new CKEDITOR.style(b));
            b.applyToObject(a) }
          var f, l, p;
          for (p = 0; p < d.length; p++) f = d[p], l = e.createBookmark(), -1 !== c(["table", "tr"], f.element) ? a(e, f.element, function(a) { f.applyToObject(a) }) : -1 !== c(["td", "th"], f.element) ? a(e, { td: 1, th: 1 }, function(a) { g(a, f) }) : -1 !== c(["thead", "tbody"], f.element) ? a(e, { thead: 1, tbody: 1 }, function(a) { g(a, f) }) : CKEDITOR.plugins.copyformatting._applyStylesToTextContext(b,
            e, [f]), e.moveToBookmark(l)
        },
        _applyFormat: function(a, b) {
          var c = a.getSelection().getRanges()[0],
            d = CKEDITOR.plugins.copyformatting,
            f, g;
          if (!c) return !1;
          if (c.collapsed) { g = a.getSelection().createBookmarks(); if (!(f = d._getSelectedWordOffset(c))) return;
            c = a.createRange();
            c.setStart(f.startNode, f.startOffset);
            c.setEnd(f.endNode, f.endOffset);
            c.select() } b = d._filterStyles(b);
          if (!a.copyFormatting.fire("applyFormatting", { styles: b, range: c, preventFormatStripping: !1 }, a)) return !1;
          g && a.getSelection().selectBookmarks(g);
          return !0
        },
        _putScreenReaderMessage: function(a, b) { var c = this._getScreenReaderContainer();
          c && c.setText(a.lang.copyformatting.notification[b]) },
        _addScreenReaderContainer: function() { if (this._getScreenReaderContainer()) return this._getScreenReaderContainer(); if (!CKEDITOR.env.ie6Compat && !CKEDITOR.env.ie7Compat) return CKEDITOR.document.getBody().append(CKEDITOR.dom.element.createFromHtml('\x3cdiv class\x3d"cke_screen_reader_only cke_copyformatting_notification"\x3e\x3cdiv aria-live\x3d"polite"\x3e\x3c/div\x3e\x3c/div\x3e')).getChild(0) },
        _getScreenReaderContainer: function() { if (!CKEDITOR.env.ie6Compat && !CKEDITOR.env.ie7Compat) return CKEDITOR.document.getBody().findOne(".cke_copyformatting_notification div[aria-live]") },
        _attachPasteKeystrokeHandler: function(a) { var b = a.config.copyFormatting_keystrokePaste;
          b && (this._initialKeystrokePasteCommand = a.keystrokeHandler.keystrokes[b], a.setKeystroke(b, "applyFormatting")) },
        _detachPasteKeystrokeHandler: function(a) {
          var b = a.config.copyFormatting_keystrokePaste;
          b && a.setKeystroke(b, this._initialKeystrokePasteCommand ||
            !1)
        }
      };
      CKEDITOR.config.copyFormatting_outerCursor = !0;
      CKEDITOR.config.copyFormatting_allowRules = "b s u i em strong span p div td th ol ul li(*)[*]{*}";
      CKEDITOR.config.copyFormatting_disallowRules = "*[data-cke-widget*,data-widget*,data-cke-realelement](cke_widget*)";
      CKEDITOR.config.copyFormatting_allowedContexts = !0;
      CKEDITOR.config.copyFormatting_keystrokeCopy = CKEDITOR.CTRL + CKEDITOR.SHIFT + 67;
      CKEDITOR.config.copyFormatting_keystrokePaste = CKEDITOR.CTRL + CKEDITOR.SHIFT + 86
    }(), CKEDITOR.plugins.add("menu", {
      requires: "floatpanel",
      beforeInit: function(a) { for (var d = a.config.menu_groups.split(","), b = a._.menuGroups = {}, c = a._.menuItems = {}, g = 0; g < d.length; g++) b[d[g]] = g + 1;
        a.addMenuGroup = function(a, c) { b[a] = c || 100 };
        a.addMenuItem = function(a, d) { b[d.group] && (c[a] = new CKEDITOR.menuItem(this, a, d)) };
        a.addMenuItems = function(a) { for (var b in a) this.addMenuItem(b, a[b]) };
        a.getMenuItem = function(a) { return c[a] };
        a.removeMenuItem = function(a) { delete c[a] } }
    }),
    function() {
      function a(a) {
        a.sort(function(a, b) {
          return a.group < b.group ? -1 : a.group > b.group ? 1 : a.order <
            b.order ? -1 : a.order > b.order ? 1 : 0
        })
      }
      var d = '\x3cspan class\x3d"cke_menuitem"\x3e\x3ca id\x3d"{id}" class\x3d"cke_menubutton cke_menubutton__{name} cke_menubutton_{state} {cls}" href\x3d"{href}" title\x3d"{title}" tabindex\x3d"-1" _cke_focus\x3d1 hidefocus\x3d"true" role\x3d"{role}" aria-label\x3d"{label}" aria-describedby\x3d"{id}_description" aria-haspopup\x3d"{hasPopup}" aria-disabled\x3d"{disabled}" {ariaChecked} draggable\x3d"false"';
      CKEDITOR.env.gecko && CKEDITOR.env.mac && (d += ' onkeypress\x3d"return false;"');
      CKEDITOR.env.gecko && (d += ' onblur\x3d"this.style.cssText \x3d this.style.cssText;" ondragstart\x3d"return false;"');
      var d = d + (' onmouseover\x3d"CKEDITOR.tools.callFunction({hoverFn},{index});" onmouseout\x3d"CKEDITOR.tools.callFunction({moveOutFn},{index});" ' + (CKEDITOR.env.ie ? 'onclick\x3d"return false;" onmouseup' : "onclick") + '\x3d"CKEDITOR.tools.callFunction({clickFn},{index}); return false;"\x3e'),
        b = CKEDITOR.addTemplate("menuItem", d + '\x3cspan class\x3d"cke_menubutton_inner"\x3e\x3cspan class\x3d"cke_menubutton_icon"\x3e\x3cspan class\x3d"cke_button_icon cke_button__{iconName}_icon" style\x3d"{iconStyle}"\x3e\x3c/span\x3e\x3c/span\x3e\x3cspan class\x3d"cke_menubutton_label"\x3e{label}\x3c/span\x3e{shortcutHtml}{arrowHtml}\x3c/span\x3e\x3c/a\x3e\x3cspan id\x3d"{id}_description" class\x3d"cke_voice_label" aria-hidden\x3d"false"\x3e{ariaShortcut}\x3c/span\x3e\x3c/span\x3e'),
        c = CKEDITOR.addTemplate("menuArrow", '\x3cspan class\x3d"cke_menuarrow"\x3e\x3cspan\x3e{label}\x3c/span\x3e\x3c/span\x3e'),
        g = CKEDITOR.addTemplate("menuShortcut", '\x3cspan class\x3d"cke_menubutton_label cke_menubutton_shortcut"\x3e{shortcut}\x3c/span\x3e');
      CKEDITOR.menu = CKEDITOR.tools.createClass({
        $: function(a, b) {
          b = this._.definition = b || {};
          this.id = CKEDITOR.tools.getNextId();
          this.editor = a;
          this.items = [];
          this._.listeners = [];
          this._.level = b.level || 1;
          var c = CKEDITOR.tools.extend({}, b.panel, {
              css: [CKEDITOR.skin.getPath("editor")],
              level: this._.level - 1,
              block: {}
            }),
            d = c.block.attributes = c.attributes || {};
          !d.role && (d.role = "menu");
          this._.panelDefinition = c
        },
        _: {
          onShow: function() { var a = this.editor.getSelection(),
              b = a && a.getStartElement(),
              c = this.editor.elementPath(),
              d = this._.listeners;
            this.removeAll(); for (var g = 0; g < d.length; g++) { var f = d[g](b, a, c); if (f)
                for (var n in f) { var p = this.editor.getMenuItem(n);!p || p.command && !this.editor.getCommand(p.command).state || (p.state = f[n], this.add(p)) } } },
          onClick: function(a) {
            this.hide();
            if (a.onClick) a.onClick();
            else a.command && this.editor.execCommand(a.command)
          },
          onEscape: function(a) { var b = this.parent;
            b ? b._.panel.hideChild(1) : 27 == a && this.hide(1); return !1 },
          onHide: function() { this.onHide && this.onHide() },
          showSubMenu: function(a) {
            var b = this._.subMenu,
              c = this.items[a];
            if (c = c.getItems && c.getItems()) {
              b ? b.removeAll() : (b = this._.subMenu = new CKEDITOR.menu(this.editor, CKEDITOR.tools.extend({}, this._.definition, { level: this._.level + 1 }, !0)), b.parent = this, b._.onClick = CKEDITOR.tools.bind(this._.onClick, this));
              for (var d in c) {
                var g =
                  this.editor.getMenuItem(d);
                g && (g.state = c[d], b.add(g))
              }
              var f = this._.panel.getBlock(this.id).element.getDocument().getById(this.id + String(a));
              setTimeout(function() { b.show(f, 2) }, 0)
            } else this._.panel.hideChild(1)
          }
        },
        proto: {
          add: function(a) { a.order || (a.order = this.items.length);
            this.items.push(a) },
          removeAll: function() { this.items = [] },
          show: function(b, c, e, d) {
            if (!this.parent && (this._.onShow(), !this.items.length)) return;
            c = c || ("rtl" == this.editor.lang.dir ? 2 : 1);
            var g = this.items,
              f = this.editor,
              n = this._.panel,
              p = this._.element;
            if (!n) {
              n = this._.panel = new CKEDITOR.ui.floatPanel(this.editor, CKEDITOR.document.getBody(), this._.panelDefinition, this._.level);
              n.onEscape = CKEDITOR.tools.bind(function(a) { if (!1 === this._.onEscape(a)) return !1 }, this);
              n.onShow = function() { n._.panel.getHolderElement().getParent().addClass("cke").addClass("cke_reset_all") };
              n.onHide = CKEDITOR.tools.bind(function() { this._.onHide && this._.onHide() }, this);
              p = n.addBlock(this.id, this._.panelDefinition.block);
              p.autoSize = !0;
              var q = p.keys;
              q[40] = "next";
              q[9] = "next";
              q[38] =
                "prev";
              q[CKEDITOR.SHIFT + 9] = "prev";
              q["rtl" == f.lang.dir ? 37 : 39] = CKEDITOR.env.ie ? "mouseup" : "click";
              q[32] = CKEDITOR.env.ie ? "mouseup" : "click";
              CKEDITOR.env.ie && (q[13] = "mouseup");
              p = this._.element = p.element;
              q = p.getDocument();
              q.getBody().setStyle("overflow", "hidden");
              q.getElementsByTag("html").getItem(0).setStyle("overflow", "hidden");
              this._.itemOverFn = CKEDITOR.tools.addFunction(function(a) {
                clearTimeout(this._.showSubTimeout);
                this._.showSubTimeout = CKEDITOR.tools.setTimeout(this._.showSubMenu, f.config.menu_subMenuDelay ||
                  400, this, [a])
              }, this);
              this._.itemOutFn = CKEDITOR.tools.addFunction(function() { clearTimeout(this._.showSubTimeout) }, this);
              this._.itemClickFn = CKEDITOR.tools.addFunction(function(a) { var b = this.items[a]; if (b.state == CKEDITOR.TRISTATE_DISABLED) this.hide(1);
                else if (b.getItems) this._.showSubMenu(a);
                else this._.onClick(b) }, this)
            }
            a(g);
            for (var q = f.elementPath(), q = ['\x3cdiv class\x3d"cke_menu' + (q && q.direction() != f.lang.dir ? " cke_mixed_dir_content" : "") + '" role\x3d"presentation"\x3e'], w = g.length, v = w && g[0].group,
                t = 0; t < w; t++) { var u = g[t];
              v != u.group && (q.push('\x3cdiv class\x3d"cke_menuseparator" role\x3d"separator"\x3e\x3c/div\x3e'), v = u.group);
              u.render(this, t, q) } q.push("\x3c/div\x3e");
            p.setHtml(q.join(""));
            CKEDITOR.ui.fire("ready", this);
            this.parent ? this.parent._.panel.showAsChild(n, this.id, b, c, e, d) : n.showBlock(this.id, b, c, e, d);
            f.fire("menuShow", [n])
          },
          addListener: function(a) { this._.listeners.push(a) },
          hide: function(a) { this._.onHide && this._.onHide();
            this._.panel && this._.panel.hide(a) },
          findItemByCommandName: function(a) {
            var b =
              CKEDITOR.tools.array.filter(this.items, function(b) { return a === b.command });
            return b.length ? (b = b[0], { item: b, element: this._.element.findOne("." + b.className) }) : null
          }
        }
      });
      CKEDITOR.menuItem = CKEDITOR.tools.createClass({
        $: function(a, b, c) { CKEDITOR.tools.extend(this, c, { order: 0, className: "cke_menubutton__" + b });
          this.group = a._.menuGroups[this.group];
          this.editor = a;
          this.name = b },
        proto: {
          render: function(a, d, e) {
            var h = a.id + String(d),
              m = "undefined" == typeof this.state ? CKEDITOR.TRISTATE_OFF : this.state,
              f = "",
              n = this.editor,
              p, q, w = m == CKEDITOR.TRISTATE_ON ? "on" : m == CKEDITOR.TRISTATE_DISABLED ? "disabled" : "off";
            this.role in { menuitemcheckbox: 1, menuitemradio: 1 } && (f = ' aria-checked\x3d"' + (m == CKEDITOR.TRISTATE_ON ? "true" : "false") + '"');
            var v = this.getItems,
              t = "\x26#" + ("rtl" == this.editor.lang.dir ? "9668" : "9658") + ";",
              u = this.name;
            this.icon && !/\./.test(this.icon) && (u = this.icon);
            this.command && (p = n.getCommand(this.command), (p = n.getCommandKeystroke(p)) && (q = CKEDITOR.tools.keystrokeToString(n.lang.common.keyboard, p)));
            a = {
              id: h,
              name: this.name,
              iconName: u,
              label: this.label,
              cls: this.className || "",
              state: w,
              hasPopup: v ? "true" : "false",
              disabled: m == CKEDITOR.TRISTATE_DISABLED,
              title: this.label + (q ? " (" + q.display + ")" : ""),
              ariaShortcut: q ? n.lang.common.keyboardShortcut + " " + q.aria : "",
              href: "javascript:void('" + (this.label || "").replace("'") + "')",
              hoverFn: a._.itemOverFn,
              moveOutFn: a._.itemOutFn,
              clickFn: a._.itemClickFn,
              index: d,
              iconStyle: CKEDITOR.skin.getIconStyle(u, "rtl" == this.editor.lang.dir, u == this.icon ? null : this.icon, this.iconOffset),
              shortcutHtml: q ? g.output({ shortcut: q.display }) : "",
              arrowHtml: v ? c.output({ label: t }) : "",
              role: this.role ? this.role : "menuitem",
              ariaChecked: f
            };
            b.output(a, e)
          }
        }
      })
    }(), CKEDITOR.config.menu_groups = "clipboard,form,tablecell,tablecellproperties,tablerow,tablecolumn,table,anchor,link,image,flash,checkbox,radio,textfield,hiddenfield,imagebutton,button,select,textarea,div", CKEDITOR.plugins.add("contextmenu", {
      requires: "menu",
      onLoad: function() {
        CKEDITOR.plugins.contextMenu = CKEDITOR.tools.createClass({
          base: CKEDITOR.menu,
          $: function(a) {
            this.base.call(this, a, {
              panel: {
                className: "cke_menu_panel",
                attributes: { "aria-label": a.lang.contextmenu.options }
              }
            })
          },
          proto: {
            addTarget: function(a, d) {
              a.on("contextmenu", function(a) {
                a = a.data;
                var c = CKEDITOR.env.webkit ? b : CKEDITOR.env.mac ? a.$.metaKey : a.$.ctrlKey;
                if (!d || !c) {
                  a.preventDefault();
                  if (CKEDITOR.env.mac && CKEDITOR.env.webkit) { var c = this.editor,
                      k = (new CKEDITOR.dom.elementPath(a.getTarget(), c.editable())).contains(function(a) { return a.hasAttribute("contenteditable") }, !0);
                    k && "false" == k.getAttribute("contenteditable") && c.getSelection().fake(k) }
                  var k = a.getTarget().getDocument(),
                    e = a.getTarget().getDocument().getDocumentElement(),
                    c = !k.equals(CKEDITOR.document),
                    k = k.getWindow().getScrollPosition(),
                    h = c ? a.$.clientX : a.$.pageX || k.x + a.$.clientX,
                    m = c ? a.$.clientY : a.$.pageY || k.y + a.$.clientY;
                  CKEDITOR.tools.setTimeout(function() { this.open(e, null, h, m) }, CKEDITOR.env.ie ? 200 : 0, this)
                }
              }, this);
              if (CKEDITOR.env.webkit) { var b, c = function() { b = 0 };
                a.on("keydown", function(a) { b = CKEDITOR.env.mac ? a.data.$.metaKey : a.data.$.ctrlKey });
                a.on("keyup", c);
                a.on("contextmenu", c) }
            },
            open: function(a, d, b, c) {
              !1 !== this.editor.config.enableContextMenu &&
                (this.editor.focus(), a = a || CKEDITOR.document.getDocumentElement(), this.editor.selectionChange(1), this.show(a, d, b, c))
            }
          }
        })
      },
      beforeInit: function(a) { var d = a.contextMenu = new CKEDITOR.plugins.contextMenu(a);
        a.on("contentDom", function() { d.addTarget(a.editable(), !1 !== a.config.browserContextMenuOnCtrl) });
        a.addCommand("contextMenu", { exec: function() { a.contextMenu.open(a.document.getBody()) } });
        a.setKeystroke(CKEDITOR.SHIFT + 121, "contextMenu");
        a.setKeystroke(CKEDITOR.CTRL + CKEDITOR.SHIFT + 121, "contextMenu") }
    }),
    function() {
      function a(a) {
        var b =
          this.att;
        a = a && a.hasAttribute(b) && a.getAttribute(b) || "";
        void 0 !== a && this.setValue(a)
      }

      function d() { for (var a, b = 0; b < arguments.length; b++)
          if (arguments[b] instanceof CKEDITOR.dom.element) { a = arguments[b]; break }
        if (a) { var b = this.att,
            d = this.getValue();
          d ? a.setAttribute(b, d) : a.removeAttribute(b, d) } }
      var b = { id: 1, dir: 1, classes: 1, styles: 1 };
      CKEDITOR.plugins.add("dialogadvtab", {
        requires: "dialog",
        allowedContent: function(a) {
          a || (a = b);
          var d = [];
          a.id && d.push("id");
          a.dir && d.push("dir");
          var l = "";
          d.length && (l += "[" + d.join(",") +
            "]");
          a.classes && (l += "(*)");
          a.styles && (l += "{*}");
          return l
        },
        createAdvancedTab: function(c, g, l) {
          g || (g = b);
          var k = c.lang.common,
            e = { id: "advanced", label: k.advancedTab, title: k.advancedTab, elements: [{ type: "vbox", padding: 1, children: [] }] },
            h = [];
          if (g.id || g.dir) g.id && h.push({ id: "advId", att: "id", type: "text", requiredContent: l ? l + "[id]" : null, label: k.id, setup: a, commit: d }), g.dir && h.push({
            id: "advLangDir",
            att: "dir",
            type: "select",
            requiredContent: l ? l + "[dir]" : null,
            label: k.langDir,
            "default": "",
            style: "width:100%",
            items: [
              [k.notSet,
                ""
              ],
              [k.langDirLTR, "ltr"],
              [k.langDirRTL, "rtl"]
            ],
            setup: a,
            commit: d
          }), e.elements[0].children.push({ type: "hbox", widths: ["50%", "50%"], children: [].concat(h) });
          if (g.styles || g.classes) h = [], g.styles && h.push({
            id: "advStyles",
            att: "style",
            type: "text",
            requiredContent: l ? l + "{cke-xyz}" : null,
            label: k.styles,
            "default": "",
            validate: CKEDITOR.dialog.validate.inlineStyle(k.invalidInlineStyle),
            onChange: function() {},
            getStyle: function(a, b) {
              var c = this.getValue().match(new RegExp("(?:^|;)\\s*" + a + "\\s*:\\s*([^;]*)", "i"));
              return c ?
                c[1] : b
            },
            updateStyle: function(a, b) { var e = this.getValue(),
                d = c.document.createElement("span");
              d.setAttribute("style", e);
              d.setStyle(a, b);
              e = CKEDITOR.tools.normalizeCssText(d.getAttribute("style"));
              this.setValue(e, 1) },
            setup: a,
            commit: d
          }), g.classes && h.push({ type: "hbox", widths: ["45%", "55%"], children: [{ id: "advCSSClasses", att: "class", type: "text", requiredContent: l ? l + "(cke-xyz)" : null, label: k.cssClasses, "default": "", setup: a, commit: d }] }), e.elements[0].children.push({ type: "hbox", widths: ["50%", "50%"], children: [].concat(h) });
          return e
        }
      })
    }(),
    function() {
      CKEDITOR.plugins.add("div", {
        requires: "dialog",
        init: function(a) {
          if (!a.blockless) {
            var d = a.lang.div,
              b = "div(*)";
            CKEDITOR.dialog.isTabEnabled(a, "editdiv", "advanced") && (b += ";div[dir,id,lang,title]{*}");
            a.addCommand("creatediv", new CKEDITOR.dialogCommand("creatediv", {
              allowedContent: b,
              requiredContent: "div",
              contextSensitive: !0,
              contentTransformations: [
                ["div: alignmentToStyle"]
              ],
              refresh: function(a, b) {
                this.setState("div" in (a.config.div_wrapTable ? b.root : b.blockLimit).getDtd() ? CKEDITOR.TRISTATE_OFF :
                  CKEDITOR.TRISTATE_DISABLED)
              }
            }));
            a.addCommand("editdiv", new CKEDITOR.dialogCommand("editdiv", { requiredContent: "div" }));
            a.addCommand("removediv", {
              requiredContent: "div",
              exec: function(a) {
                function b(e) {
                  (e = CKEDITOR.plugins.div.getSurroundDiv(a, e)) && !e.data("cke-div-added") && (m.push(e), e.data("cke-div-added")) }
                for (var d = a.getSelection(), k = d && d.getRanges(), e, h = d.createBookmarks(), m = [], f = 0; f < k.length; f++) e = k[f], e.collapsed ? b(d.getStartElement()) : (e = new CKEDITOR.dom.walker(e), e.evaluator = b, e.lastForward());
                for (f = 0; f < m.length; f++) m[f].remove(!0);
                d.selectBookmarks(h)
              }
            });
            a.ui.addButton && a.ui.addButton("CreateDiv", { label: d.toolbar, command: "creatediv", toolbar: "blocks,50" });
            a.addMenuItems && (a.addMenuItems({ editdiv: { label: d.edit, command: "editdiv", group: "div", order: 1 }, removediv: { label: d.remove, command: "removediv", group: "div", order: 5 } }), a.contextMenu && a.contextMenu.addListener(function(b) {
              return !b || b.isReadOnly() ? null : CKEDITOR.plugins.div.getSurroundDiv(a) ? { editdiv: CKEDITOR.TRISTATE_OFF, removediv: CKEDITOR.TRISTATE_OFF } :
                null
            }));
            CKEDITOR.dialog.add("creatediv", this.path + "dialogs/div.js");
            CKEDITOR.dialog.add("editdiv", this.path + "dialogs/div.js")
          }
        }
      });
      CKEDITOR.plugins.div = { getSurroundDiv: function(a, d) { var b = a.elementPath(d); return a.elementPath(b.blockLimit).contains(function(a) { return a.is("div") && !a.isReadOnly() }, 1) } }
    }(),
    function() {
      function a(a, b) {
        function k(b) {
          b = f.list[b];
          var c;
          b.equals(a.editable()) || "true" == b.getAttribute("contenteditable") ? (c = a.createRange(), c.selectNodeContents(b), c = c.select()) : (c = a.getSelection(),
            c.selectElement(b));
          CKEDITOR.env.ie && a.fire("selectionChange", { selection: c, path: new CKEDITOR.dom.elementPath(b) });
          a.focus()
        }

        function e() { m && m.setHtml('\x3cspan class\x3d"cke_path_empty"\x3e\x26nbsp;\x3c/span\x3e');
          delete f.list }
        var h = a.ui.spaceId("path"),
          m, f = a._.elementsPath,
          n = f.idBase;
        b.html += '\x3cspan id\x3d"' + h + '_label" class\x3d"cke_voice_label"\x3e' + a.lang.elementspath.eleLabel + '\x3c/span\x3e\x3cspan id\x3d"' + h + '" class\x3d"cke_path" role\x3d"group" aria-labelledby\x3d"' + h + '_label"\x3e\x3cspan class\x3d"cke_path_empty"\x3e\x26nbsp;\x3c/span\x3e\x3c/span\x3e';
        a.on("uiReady", function() { var b = a.ui.space("path");
          b && a.focusManager.add(b, 1) });
        f.onClick = k;
        var p = CKEDITOR.tools.addFunction(k),
          q = CKEDITOR.tools.addFunction(function(b, c) {
            var e = f.idBase,
              d;
            c = new CKEDITOR.dom.event(c);
            d = "rtl" == a.lang.dir;
            switch (c.getKeystroke()) {
              case d ? 39:
                37:
                  case 9:
                return (d = CKEDITOR.document.getById(e + (b + 1))) || (d = CKEDITOR.document.getById(e + "0")), d.focus(), !1;
              case d ? 37:
                39:
                  case CKEDITOR.SHIFT + 9:
                return (d = CKEDITOR.document.getById(e + (b - 1))) || (d = CKEDITOR.document.getById(e + (f.list.length -
                  1))), d.focus(), !1;
              case 27:
                return a.focus(), !1;
              case 13:
              case 32:
                return k(b), !1
            }
            return !0
          });
        a.on("selectionChange", function(b) {
          for (var e = [], d = f.list = [], k = [], l = f.filters, B = !0, x = b.data.path.elements, y = x.length; y--;) {
            var C = x[y],
              z = 0;
            b = C.data("cke-display-name") ? C.data("cke-display-name") : C.data("cke-real-element-type") ? C.data("cke-real-element-type") : C.getName();
            (B = C.hasAttribute("contenteditable") ? "true" == C.getAttribute("contenteditable") : B) || C.hasAttribute("contenteditable") || (z = 1);
            for (var A = 0; A < l.length; A++) {
              var G =
                l[A](C, b);
              if (!1 === G) { z = 1; break } b = G || b
            }
            z || (d.unshift(C), k.unshift(b))
          }
          d = d.length;
          for (l = 0; l < d; l++) b = k[l], B = a.lang.elementspath.eleTitle.replace(/%1/, b), b = c.output({ id: n + l, label: B, text: b, jsTitle: "javascript:void('" + b + "')", index: l, keyDownFn: q, clickFn: p }), e.unshift(b);
          m || (m = CKEDITOR.document.getById(h));
          k = m;
          k.setHtml(e.join("") + '\x3cspan class\x3d"cke_path_empty"\x3e\x26nbsp;\x3c/span\x3e');
          a.fire("elementsPathUpdate", { space: k })
        });
        a.on("readOnly", e);
        a.on("contentDomUnload", e);
        a.addCommand("elementsPathFocus",
          d.toolbarFocus);
        a.setKeystroke(CKEDITOR.ALT + 122, "elementsPathFocus")
      }
      var d = { toolbarFocus: { editorFocus: !1, readOnly: 1, exec: function(a) {
              (a = CKEDITOR.document.getById(a._.elementsPath.idBase + "0")) && a.focus(CKEDITOR.env.ie || CKEDITOR.env.air) } } },
        b = "";
      CKEDITOR.env.gecko && CKEDITOR.env.mac && (b += ' onkeypress\x3d"return false;"');
      CKEDITOR.env.gecko && (b += ' onblur\x3d"this.style.cssText \x3d this.style.cssText;"');
      var c = CKEDITOR.addTemplate("pathItem", '\x3ca id\x3d"{id}" href\x3d"{jsTitle}" tabindex\x3d"-1" class\x3d"cke_path_item" title\x3d"{label}"' +
        b + ' hidefocus\x3d"true"  onkeydown\x3d"return CKEDITOR.tools.callFunction({keyDownFn},{index}, event );" onclick\x3d"CKEDITOR.tools.callFunction({clickFn},{index}); return false;" role\x3d"button" aria-label\x3d"{label}"\x3e{text}\x3c/a\x3e');
      CKEDITOR.plugins.add("elementspath", { init: function(b) { b._.elementsPath = { idBase: "cke_elementspath_" + CKEDITOR.tools.getNextNumber() + "_", filters: [] };
          b.on("uiSpace", function(c) { "bottom" == c.data.space && a(b, c.data) }) } })
    }(),
    function() {
      function a(a, b, c) {
        c = a.config.forceEnterMode ||
          c;
        if ("wysiwyg" == a.mode) { b || (b = a.activeEnterMode); var d = a.elementPath();
          d && !d.isContextFor("p") && (b = CKEDITOR.ENTER_BR, c = 1);
          a.fire("saveSnapshot");
          b == CKEDITOR.ENTER_BR ? k(a, b, null, c) : e(a, b, null, c);
          a.fire("saveSnapshot") }
      }

      function d(a) { a = a.getSelection().getRanges(!0); for (var b = a.length - 1; 0 < b; b--) a[b].deleteContents(); return a[0] }

      function b(a) {
        var b = a.startContainer.getAscendant(function(a) { return a.type == CKEDITOR.NODE_ELEMENT && "true" == a.getAttribute("contenteditable") }, !0);
        if (a.root.equals(b)) return a;
        b = new CKEDITOR.dom.range(b);
        b.moveToRange(a);
        return b
      }
      CKEDITOR.plugins.add("enterkey", { init: function(b) { b.addCommand("enter", { modes: { wysiwyg: 1 }, editorFocus: !1, exec: function(b) { a(b) } });
          b.addCommand("shiftEnter", { modes: { wysiwyg: 1 }, editorFocus: !1, exec: function(b) { a(b, b.activeShiftEnterMode, 1) } });
          b.setKeystroke([
            [13, "enter"],
            [CKEDITOR.SHIFT + 13, "shiftEnter"]
          ]) } });
      var c = CKEDITOR.dom.walker.whitespaces(),
        g = CKEDITOR.dom.walker.bookmark();
      CKEDITOR.plugins.enterkey = {
        enterBlock: function(a, e, l, p) {
          if (l = l || d(a)) {
            l =
              b(l);
            var q = l.document,
              w = l.checkStartOfBlock(),
              v = l.checkEndOfBlock(),
              t = a.elementPath(l.startContainer),
              u = t.block,
              r = e == CKEDITOR.ENTER_DIV ? "div" : "p",
              B;
            if (w && v) {
              if (u && (u.is("li") || u.getParent().is("li"))) {
                u.is("li") || (u = u.getParent());
                l = u.getParent();
                B = l.getParent();
                p = !u.hasPrevious();
                var x = !u.hasNext(),
                  r = a.getSelection(),
                  y = r.createBookmarks(),
                  w = u.getDirection(1),
                  v = u.getAttribute("class"),
                  C = u.getAttribute("style"),
                  z = B.getDirection(1) != w;
                a = a.enterMode != CKEDITOR.ENTER_BR || z || C || v;
                if (B.is("li")) p || x ? (p &&
                  x && l.remove(), u[x ? "insertAfter" : "insertBefore"](B)) : u.breakParent(B);
                else {
                  if (a)
                    if (t.block.is("li") ? (B = q.createElement(e == CKEDITOR.ENTER_P ? "p" : "div"), z && B.setAttribute("dir", w), C && B.setAttribute("style", C), v && B.setAttribute("class", v), u.moveChildren(B)) : B = t.block, p || x) B[p ? "insertBefore" : "insertAfter"](l);
                    else u.breakParent(l), B.insertAfter(l);
                  else if (u.appendBogus(!0), p || x)
                    for (; q = u[p ? "getFirst" : "getLast"]();) q[p ? "insertBefore" : "insertAfter"](l);
                  else
                    for (u.breakParent(l); q = u.getLast();) q.insertAfter(l);
                  u.remove()
                }
                r.selectBookmarks(y);
                return
              }
              if (u && u.getParent().is("blockquote")) { u.breakParent(u.getParent());
                u.getPrevious().getFirst(CKEDITOR.dom.walker.invisible(1)) || u.getPrevious().remove();
                u.getNext().getFirst(CKEDITOR.dom.walker.invisible(1)) || u.getNext().remove();
                l.moveToElementEditStart(u);
                l.select(); return }
            } else if (u && u.is("pre") && !v) { k(a, e, l, p); return }
            if (w = l.splitBlock(r)) {
              e = w.previousBlock;
              u = w.nextBlock;
              t = w.wasStartOfBlock;
              a = w.wasEndOfBlock;
              u ? (y = u.getParent(), y.is("li") && (u.breakParent(y),
                u.move(u.getNext(), 1))) : e && (y = e.getParent()) && y.is("li") && (e.breakParent(y), y = e.getNext(), l.moveToElementEditStart(y), e.move(e.getPrevious()));
              if (t || a) {
                if (e) { if (e.is("li") || !h.test(e.getName()) && !e.is("pre")) B = e.clone() } else u && (B = u.clone());
                B ? p && !B.is("li") && B.renameNode(r) : y && y.is("li") ? B = y : (B = q.createElement(r), e && (x = e.getDirection()) && B.setAttribute("dir", x));
                if (q = w.elementPath)
                  for (p = 0, r = q.elements.length; p < r; p++) {
                    y = q.elements[p];
                    if (y.equals(q.block) || y.equals(q.blockLimit)) break;
                    CKEDITOR.dtd.$removeEmpty[y.getName()] &&
                      (y = y.clone(), B.moveChildren(y), B.append(y))
                  }
                B.appendBogus();
                B.getParent() || l.insertNode(B);
                B.is("li") && B.removeAttribute("value");
                !CKEDITOR.env.ie || !t || a && e.getChildCount() || (l.moveToElementEditStart(a ? e : B), l.select());
                l.moveToElementEditStart(t && !a ? u : B)
              } else u.is("li") && (B = l.clone(), B.selectNodeContents(u), B = new CKEDITOR.dom.walker(B), B.evaluator = function(a) { return !(g(a) || c(a) || a.type == CKEDITOR.NODE_ELEMENT && a.getName() in CKEDITOR.dtd.$inline && !(a.getName() in CKEDITOR.dtd.$empty)) }, (y = B.next()) &&
                y.type == CKEDITOR.NODE_ELEMENT && y.is("ul", "ol") && (CKEDITOR.env.needsBrFiller ? q.createElement("br") : q.createText(" ")).insertBefore(y)), u && l.moveToElementEditStart(u);
              l.select();
              l.scrollIntoView()
            }
          }
        },
        enterBr: function(a, b, c, g) {
          if (c = c || d(a)) {
            var k = c.document,
              l = c.checkEndOfBlock(),
              v = new CKEDITOR.dom.elementPath(a.getSelection().getStartElement()),
              t = v.block,
              u = t && v.block.getName();
            g || "li" != u ? (!g && l && h.test(u) ? (l = t.getDirection()) ? (k = k.createElement("div"), k.setAttribute("dir", l), k.insertAfter(t), c.setStart(k,
              0)) : (k.createElement("br").insertAfter(t), CKEDITOR.env.gecko && k.createText("").insertAfter(t), c.setStartAt(t.getNext(), CKEDITOR.env.ie ? CKEDITOR.POSITION_BEFORE_START : CKEDITOR.POSITION_AFTER_START)) : (a = "pre" == u && CKEDITOR.env.ie && 8 > CKEDITOR.env.version ? k.createText("\r") : k.createElement("br"), c.deleteContents(), c.insertNode(a), CKEDITOR.env.needsBrFiller ? (k.createText("﻿").insertAfter(a), l && (t || v.blockLimit).appendBogus(), a.getNext().$.nodeValue = "", c.setStartAt(a.getNext(), CKEDITOR.POSITION_AFTER_START)) :
              c.setStartAt(a, CKEDITOR.POSITION_AFTER_END)), c.collapse(!0), c.select(), c.scrollIntoView()) : e(a, b, c, g)
          }
        }
      };
      var l = CKEDITOR.plugins.enterkey,
        k = l.enterBr,
        e = l.enterBlock,
        h = /^h[1-6]$/
    }(),
    function() {
      function a(a, b) {
        var c = {},
          g = [],
          l = { nbsp: " ", shy: "­", gt: "\x3e", lt: "\x3c", amp: "\x26", apos: "'", quot: '"' };
        a = a.replace(/\b(nbsp|shy|gt|lt|amp|apos|quot)(?:,|$)/g, function(a, e) { var d = b ? "\x26" + e + ";" : l[e];
          c[d] = b ? l[e] : "\x26" + e + ";";
          g.push(d); return "" });
        if (!b && a) {
          a = a.split(",");
          var k = document.createElement("div"),
            e;
          k.innerHTML =
            "\x26" + a.join(";\x26") + ";";
          e = k.innerHTML;
          k = null;
          for (k = 0; k < e.length; k++) { var h = e.charAt(k);
            c[h] = "\x26" + a[k] + ";";
            g.push(h) }
        }
        c.regex = g.join(b ? "|" : "");
        return c
      }
      CKEDITOR.plugins.add("entities", {
        afterInit: function(d) {
          function b(a) { return h[a] }

          function c(a) { return "force" != g.entities_processNumerical && k[a] ? k[a] : "\x26#" + a.charCodeAt(0) + ";" }
          var g = d.config;
          if (d = (d = d.dataProcessor) && d.htmlFilter) {
            var l = [];
            !1 !== g.basicEntities && l.push("nbsp,gt,lt,amp");
            g.entities && (l.length && l.push("quot,iexcl,cent,pound,curren,yen,brvbar,sect,uml,copy,ordf,laquo,not,shy,reg,macr,deg,plusmn,sup2,sup3,acute,micro,para,middot,cedil,sup1,ordm,raquo,frac14,frac12,frac34,iquest,times,divide,fnof,bull,hellip,prime,Prime,oline,frasl,weierp,image,real,trade,alefsym,larr,uarr,rarr,darr,harr,crarr,lArr,uArr,rArr,dArr,hArr,forall,part,exist,empty,nabla,isin,notin,ni,prod,sum,minus,lowast,radic,prop,infin,ang,and,or,cap,cup,int,there4,sim,cong,asymp,ne,equiv,le,ge,sub,sup,nsub,sube,supe,oplus,otimes,perp,sdot,lceil,rceil,lfloor,rfloor,lang,rang,loz,spades,clubs,hearts,diams,circ,tilde,ensp,emsp,thinsp,zwnj,zwj,lrm,rlm,ndash,mdash,lsquo,rsquo,sbquo,ldquo,rdquo,bdquo,dagger,Dagger,permil,lsaquo,rsaquo,euro"),
              g.entities_latin && l.push("Agrave,Aacute,Acirc,Atilde,Auml,Aring,AElig,Ccedil,Egrave,Eacute,Ecirc,Euml,Igrave,Iacute,Icirc,Iuml,ETH,Ntilde,Ograve,Oacute,Ocirc,Otilde,Ouml,Oslash,Ugrave,Uacute,Ucirc,Uuml,Yacute,THORN,szlig,agrave,aacute,acirc,atilde,auml,aring,aelig,ccedil,egrave,eacute,ecirc,euml,igrave,iacute,icirc,iuml,eth,ntilde,ograve,oacute,ocirc,otilde,ouml,oslash,ugrave,uacute,ucirc,uuml,yacute,thorn,yuml,OElig,oelig,Scaron,scaron,Yuml"), g.entities_greek && l.push("Alpha,Beta,Gamma,Delta,Epsilon,Zeta,Eta,Theta,Iota,Kappa,Lambda,Mu,Nu,Xi,Omicron,Pi,Rho,Sigma,Tau,Upsilon,Phi,Chi,Psi,Omega,alpha,beta,gamma,delta,epsilon,zeta,eta,theta,iota,kappa,lambda,mu,nu,xi,omicron,pi,rho,sigmaf,sigma,tau,upsilon,phi,chi,psi,omega,thetasym,upsih,piv"),
              g.entities_additional && l.push(g.entities_additional));
            var k = a(l.join(",")),
              e = k.regex ? "[" + k.regex + "]" : "a^";
            delete k.regex;
            g.entities && g.entities_processNumerical && (e = "[^ -~]|" + e);
            var e = new RegExp(e, "g"),
              h = a("nbsp,gt,lt,amp,shy", !0),
              m = new RegExp(h.regex, "g");
            d.addRules({ text: function(a) { return a.replace(m, b).replace(e, c) } }, { applyToAll: !0, excludeNestedEditable: !0 })
          }
        }
      })
    }(), CKEDITOR.config.basicEntities = !0, CKEDITOR.config.entities = !0, CKEDITOR.config.entities_latin = !0, CKEDITOR.config.entities_greek = !0,
    CKEDITOR.config.entities_additional = "#39", CKEDITOR.plugins.add("popup"), CKEDITOR.tools.extend(CKEDITOR.editor.prototype, {
      popup: function(a, d, b, c) {
        d = d || "80%";
        b = b || "70%";
        "string" == typeof d && 1 < d.length && "%" == d.substr(d.length - 1, 1) && (d = parseInt(window.screen.width * parseInt(d, 10) / 100, 10));
        "string" == typeof b && 1 < b.length && "%" == b.substr(b.length - 1, 1) && (b = parseInt(window.screen.height * parseInt(b, 10) / 100, 10));
        640 > d && (d = 640);
        420 > b && (b = 420);
        var g = parseInt((window.screen.height - b) / 2, 10),
          l = parseInt((window.screen.width -
            d) / 2, 10);
        c = (c || "location\x3dno,menubar\x3dno,toolbar\x3dno,dependent\x3dyes,minimizable\x3dno,modal\x3dyes,alwaysRaised\x3dyes,resizable\x3dyes,scrollbars\x3dyes") + ",width\x3d" + d + ",height\x3d" + b + ",top\x3d" + g + ",left\x3d" + l;
        var k = window.open("", null, c, !0);
        if (!k) return !1;
        try {-1 == navigator.userAgent.toLowerCase().indexOf(" chrome/") && (k.moveTo(l, g), k.resizeTo(d, b)), k.focus(), k.location.href = a } catch (e) { window.open(a, null, c, !0) }
        return !0
      }
    }), "use strict",
    function() {
      function a(a) {
        this.editor = a;
        this.loaders = []
      }

      function d(a, c, d) { var e = a.config.fileTools_defaultFileName;
        this.editor = a;
        this.lang = a.lang; "string" === typeof c ? (this.data = c, this.file = b(this.data), this.loaded = this.total = this.file.size) : (this.data = null, this.file = c, this.total = this.file.size, this.loaded = 0);
        d ? this.fileName = d : this.file.name ? this.fileName = this.file.name : (a = this.file.type.split("/"), e && (a[0] = e), this.fileName = a.join("."));
        this.uploaded = 0;
        this.responseData = this.uploadTotal = null;
        this.status = "created";
        this.abort = function() { this.changeStatus("abort") } }

      function b(a) { var b = a.match(c)[1];
        a = a.replace(c, "");
        a = atob(a); var d = [],
          e, h, m, f; for (e = 0; e < a.length; e += 512) { h = a.slice(e, e + 512);
          m = Array(h.length); for (f = 0; f < h.length; f++) m[f] = h.charCodeAt(f);
          h = new Uint8Array(m);
          d.push(h) } return new Blob(d, { type: b }) } CKEDITOR.plugins.add("filetools", {
        beforeInit: function(b) {
          b.uploadRepository = new a(b);
          b.on("fileUploadRequest", function(a) { var b = a.data.fileLoader;
            b.xhr.open("POST", b.uploadUrl, !0);
            a.data.requestData.upload = { file: b.file, name: b.fileName } }, null, null, 5);
          b.on("fileUploadRequest",
            function(a) { var c = a.data.fileLoader,
                e = new FormData;
              a = a.data.requestData; var d = b.config.fileTools_requestHeaders,
                m, f; for (f in a) { var n = a[f]; "object" === typeof n && n.file ? e.append(f, n.file, n.name) : e.append(f, n) } e.append("ckCsrfToken", CKEDITOR.tools.getCsrfToken()); if (d)
                for (m in d) c.xhr.setRequestHeader(m, d[m]);
              c.xhr.send(e) }, null, null, 999);
          b.on("fileUploadResponse", function(a) {
            var b = a.data.fileLoader,
              c = b.xhr,
              d = a.data;
            try {
              var g = JSON.parse(c.responseText);
              g.error && g.error.message && (d.message = g.error.message);
              if (g.uploaded)
                for (var f in g) d[f] = g[f];
              else a.cancel()
            } catch (n) { d.message = b.lang.filetools.responseError, CKEDITOR.warn("filetools-response-error", { responseText: c.responseText }), a.cancel() }
          }, null, null, 999)
        }
      });
      a.prototype = { create: function(a, b, c) { c = c || d; var e = this.loaders.length;
          a = new c(this.editor, a, b);
          a.id = e;
          this.loaders[e] = a;
          this.fire("instanceCreated", a); return a }, isFinished: function() { for (var a = 0; a < this.loaders.length; ++a)
            if (!this.loaders[a].isFinished()) return !1; return !0 } };
      d.prototype = {
        loadAndUpload: function(a,
          b) { var c = this;
          this.once("loaded", function(e) { e.cancel();
            c.once("update", function(a) { a.cancel() }, null, null, 0);
            c.upload(a, b) }, null, null, 0);
          this.load() },
        load: function() {
          var a = this,
            b = this.reader = new FileReader;
          a.changeStatus("loading");
          this.abort = function() { a.reader.abort() };
          b.onabort = function() { a.changeStatus("abort") };
          b.onerror = function() { a.message = a.lang.filetools.loadError;
            a.changeStatus("error") };
          b.onprogress = function(b) { a.loaded = b.loaded;
            a.update() };
          b.onload = function() {
            a.loaded = a.total;
            a.data = b.result;
            a.changeStatus("loaded")
          };
          b.readAsDataURL(this.file)
        },
        upload: function(a, b) { var c = b || {};
          a ? (this.uploadUrl = a, this.xhr = new XMLHttpRequest, this.attachRequestListeners(), this.editor.fire("fileUploadRequest", { fileLoader: this, requestData: c }) && this.changeStatus("uploading")) : (this.message = this.lang.filetools.noUrlError, this.changeStatus("error")) },
        attachRequestListeners: function() {
          function a() { "error" != c.status && (c.message = c.lang.filetools.networkError, c.changeStatus("error")) }

          function b() {
            "abort" != c.status &&
              c.changeStatus("abort")
          }
          var c = this,
            e = this.xhr;
          c.abort = function() { e.abort();
            b() };
          e.onerror = a;
          e.onabort = b;
          e.upload ? (e.upload.onprogress = function(a) { a.lengthComputable && (c.uploadTotal || (c.uploadTotal = a.total), c.uploaded = a.loaded, c.update()) }, e.upload.onerror = a, e.upload.onabort = b) : (c.uploadTotal = c.total, c.update());
          e.onload = function() {
            c.update();
            if ("abort" != c.status)
              if (c.uploaded = c.uploadTotal, 200 > e.status || 299 < e.status) c.message = c.lang.filetools["httpError" + e.status], c.message || (c.message = c.lang.filetools.httpError.replace("%1",
                e.status)), c.changeStatus("error");
              else { for (var a = { fileLoader: c }, b = ["message", "fileName", "url"], d = c.editor.fire("fileUploadResponse", a), g = 0; g < b.length; g++) { var l = b[g]; "string" === typeof a[l] && (c[l] = a[l]) } c.responseData = a;
                delete c.responseData.fileLoader;!1 === d ? c.changeStatus("error") : c.changeStatus("uploaded") }
          }
        },
        changeStatus: function(a) { this.status = a; if ("error" == a || "abort" == a || "loaded" == a || "uploaded" == a) this.abort = function() {};
          this.fire(a);
          this.update() },
        update: function() { this.fire("update") },
        isFinished: function() { return !!this.status.match(/^(?:loaded|uploaded|error|abort)$/) }
      };
      CKEDITOR.event.implementOn(a.prototype);
      CKEDITOR.event.implementOn(d.prototype);
      var c = /^data:(\S*?);base64,/;
      CKEDITOR.fileTools || (CKEDITOR.fileTools = {});
      CKEDITOR.tools.extend(CKEDITOR.fileTools, {
        uploadRepository: a,
        fileLoader: d,
        getUploadUrl: function(a, b) {
          var c = CKEDITOR.tools.capitalize;
          return b && a[b + "UploadUrl"] ? a[b + "UploadUrl"] : a.uploadUrl ? a.uploadUrl : b && a["filebrowser" + c(b, 1) + "UploadUrl"] ? a["filebrowser" + c(b, 1) + "UploadUrl"] + "\x26responseType\x3djson" : a.filebrowserUploadUrl ? a.filebrowserUploadUrl +
            "\x26responseType\x3djson" : null
        },
        isTypeSupported: function(a, b) { return !!a.type.match(b) },
        isFileUploadSupported: "function" === typeof FileReader && "function" === typeof(new FileReader).readAsDataURL && "function" === typeof FormData && "function" === typeof(new FormData).append && "function" === typeof XMLHttpRequest && "function" === typeof Blob
      })
    }(),
    function() {
      function a(a, b) { var c = []; if (b)
          for (var e in b) c.push(e + "\x3d" + encodeURIComponent(b[e]));
        else return a; return a + (-1 != a.indexOf("?") ? "\x26" : "?") + c.join("\x26") }

      function d(b) {
        return !b.match(/command=QuickUpload/) ||
          b.match(/(\?|&)responseType=json/) ? b : a(b, { responseType: "json" })
      }

      function b(a) { a += ""; return a.charAt(0).toUpperCase() + a.substr(1) }

      function c() {
        var c = this.getDialog(),
          e = c.getParentEditor();
        e._.filebrowserSe = this;
        var d = e.config["filebrowser" + b(c.getName()) + "WindowWidth"] || e.config.filebrowserWindowWidth || "80%",
          c = e.config["filebrowser" + b(c.getName()) + "WindowHeight"] || e.config.filebrowserWindowHeight || "70%",
          f = this.filebrowser.params || {};
        f.CKEditor = e.name;
        f.CKEditorFuncNum = e._.filebrowserFn;
        f.langCode ||
          (f.langCode = e.langCode);
        f = a(this.filebrowser.url, f);
        e.popup(f, d, c, e.config.filebrowserWindowFeatures || e.config.fileBrowserWindowFeatures)
      }

      function g(a) { var b = new CKEDITOR.dom.element(a.$.form);
        b && ((a = b.$.elements.ckCsrfToken) ? a = new CKEDITOR.dom.element(a) : (a = new CKEDITOR.dom.element("input"), a.setAttributes({ name: "ckCsrfToken", type: "hidden" }), b.append(a)), a.setAttribute("value", CKEDITOR.tools.getCsrfToken())) }

      function l() {
        var a = this.getDialog();
        a.getParentEditor()._.filebrowserSe = this;
        return a.getContentElement(this["for"][0],
          this["for"][1]).getInputElement().$.value && a.getContentElement(this["for"][0], this["for"][1]).getAction() ? !0 : !1
      }

      function k(b, c, e) { var d = e.params || {};
        d.CKEditor = b.name;
        d.CKEditorFuncNum = b._.filebrowserFn;
        d.langCode || (d.langCode = b.langCode);
        c.action = a(e.url, d);
        c.filebrowser = e }

      function e(a, m, q, w) {
        if (w && w.length)
          for (var v, t = w.length; t--;)
            if (v = w[t], "hbox" != v.type && "vbox" != v.type && "fieldset" != v.type || e(a, m, q, v.children), v.filebrowser)
              if ("string" == typeof v.filebrowser && (v.filebrowser = {
                  action: "fileButton" ==
                    v.type ? "QuickUpload" : "Browse",
                  target: v.filebrowser
                }), "Browse" == v.filebrowser.action) { var u = v.filebrowser.url;
                void 0 === u && (u = a.config["filebrowser" + b(m) + "BrowseUrl"], void 0 === u && (u = a.config.filebrowserBrowseUrl));
                u && (v.onClick = c, v.filebrowser.url = u, v.hidden = !1) } else if ("QuickUpload" == v.filebrowser.action && v["for"] && (u = v.filebrowser.url, void 0 === u && (u = a.config["filebrowser" + b(m) + "UploadUrl"], void 0 === u && (u = a.config.filebrowserUploadUrl)), u)) {
          var r = v.onClick;
          v.onClick = function(b) {
            var c = b.sender,
              e = c.getDialog().getContentElement(this["for"][0],
                this["for"][1]).getInputElement(),
              k = CKEDITOR.fileTools && CKEDITOR.fileTools.isFileUploadSupported;
            if (r && !1 === r.call(c, b)) return !1;
            if (l.call(c, b)) { if ("form" !== a.config.filebrowserUploadMethod && k) return b = a.uploadRepository.create(e.$.files[0]), b.on("uploaded", function(a) { var b = a.sender.responseData;
                f.call(a.sender.editor, b.url, b.message) }), b.on("error", h.bind(this)), b.on("abort", h.bind(this)), b.loadAndUpload(d(u)), "xhr";
              g(e); return !0 }
            return !1
          };
          v.filebrowser.url = u;
          v.hidden = !1;
          k(a, q.getContents(v["for"][0]).get(v["for"][1]),
            v.filebrowser)
        }
      }

      function h(a) { var b = {}; try { b = JSON.parse(a.sender.xhr.response) || {} } catch (c) {} this.enable();
        alert(b.error ? b.error.message : a.sender.message) }

      function m(a, b, c) { if (-1 !== c.indexOf(";")) { c = c.split(";"); for (var e = 0; e < c.length; e++)
            if (m(a, b, c[e])) return !0; return !1 } return (a = a.getContents(b).get(c).filebrowser) && a.url }

      function f(a, b) {
        var c = this._.filebrowserSe.getDialog(),
          e = this._.filebrowserSe["for"],
          d = this._.filebrowserSe.filebrowser.onSelect;
        e && c.getContentElement(e[0], e[1]).reset();
        if ("function" !=
          typeof b || !1 !== b.call(this._.filebrowserSe))
          if (!d || !1 !== d.call(this._.filebrowserSe, a, b))
            if ("string" == typeof b && b && alert(b), a && (e = this._.filebrowserSe, c = e.getDialog(), e = e.filebrowser.target || null))
              if (e = e.split(":"), d = c.getContentElement(e[0], e[1])) d.setValue(a), c.selectPage(e[0])
      }
      CKEDITOR.plugins.add("filebrowser", { requires: "popup,filetools", init: function(a) { a._.filebrowserFn = CKEDITOR.tools.addFunction(f, a);
          a.on("destroy", function() { CKEDITOR.tools.removeFunction(this._.filebrowserFn) }) } });
      CKEDITOR.on("dialogDefinition",
        function(a) { if (a.editor.plugins.filebrowser)
            for (var b = a.data.definition, c, d = 0; d < b.contents.length; ++d)
              if (c = b.contents[d]) e(a.editor, a.data.name, b, c.elements), c.hidden && c.filebrowser && (c.hidden = !m(b, c.id, c.filebrowser)) })
    }(), CKEDITOR.plugins.add("find", {
      requires: "dialog",
      init: function(a) {
        var d = a.addCommand("find", new CKEDITOR.dialogCommand("find"));
        d.canUndo = !1;
        d.readOnly = 1;
        a.addCommand("replace", new CKEDITOR.dialogCommand("replace")).canUndo = !1;
        a.ui.addButton && (a.ui.addButton("Find", {
          label: a.lang.find.find,
          command: "find",
          toolbar: "find,10"
        }), a.ui.addButton("Replace", { label: a.lang.find.replace, command: "replace", toolbar: "find,20" }));
        CKEDITOR.dialog.add("find", this.path + "dialogs/find.js");
        CKEDITOR.dialog.add("replace", this.path + "dialogs/find.js")
      }
    }), CKEDITOR.config.find_highlight = { element: "span", styles: { "background-color": "#004", color: "#fff" } },
    function() {
      function a(a, b) { var e = c.exec(a),
          d = c.exec(b); if (e) { if (!e[2] && "px" == d[2]) return d[1]; if ("px" == e[2] && !d[2]) return d[1] + "px" } return b }
      var d = CKEDITOR.htmlParser.cssStyle,
        b = CKEDITOR.tools.cssLength,
        c = /^((?:\d*(?:\.\d+))|(?:\d+))(.*)?$/i,
        g = { elements: { $: function(b) { var c = b.attributes; if ((c = (c = (c = c && c["data-cke-realelement"]) && new CKEDITOR.htmlParser.fragment.fromHtml(decodeURIComponent(c))) && c.children[0]) && b.attributes["data-cke-resizable"]) { var e = (new d(b)).rules;
                b = c.attributes; var g = e.width,
                  e = e.height;
                g && (b.width = a(b.width, g));
                e && (b.height = a(b.height, e)) } return c } } };
      CKEDITOR.plugins.add("fakeobjects", {
        init: function(a) {
          a.filter.allow("img[!data-cke-realelement,src,alt,title](*){*}",
            "fakeobjects")
        },
        afterInit: function(a) {
          (a = (a = a.dataProcessor) && a.htmlFilter) && a.addRules(g, { applyToAll: !0 }) }
      });
      CKEDITOR.editor.prototype.createFakeElement = function(a, c, e, g) {
        var m = this.lang.fakeobjects,
          m = m[e] || m.unknown;
        c = { "class": c, "data-cke-realelement": encodeURIComponent(a.getOuterHtml()), "data-cke-real-node-type": a.type, alt: m, title: m, align: a.getAttribute("align") || "" };
        CKEDITOR.env.hc || (c.src = CKEDITOR.tools.transparentImageData);
        e && (c["data-cke-real-element-type"] = e);
        g && (c["data-cke-resizable"] =
          g, e = new d, g = a.getAttribute("width"), a = a.getAttribute("height"), g && (e.rules.width = b(g)), a && (e.rules.height = b(a)), e.populate(c));
        return this.document.createElement("img", { attributes: c })
      };
      CKEDITOR.editor.prototype.createFakeParserElement = function(a, c, e, g) {
        var m = this.lang.fakeobjects,
          m = m[e] || m.unknown,
          f;
        f = new CKEDITOR.htmlParser.basicWriter;
        a.writeHtml(f);
        f = f.getHtml();
        c = { "class": c, "data-cke-realelement": encodeURIComponent(f), "data-cke-real-node-type": a.type, alt: m, title: m, align: a.attributes.align || "" };
        CKEDITOR.env.hc || (c.src = CKEDITOR.tools.transparentImageData);
        e && (c["data-cke-real-element-type"] = e);
        g && (c["data-cke-resizable"] = g, g = a.attributes, a = new d, e = g.width, g = g.height, void 0 !== e && (a.rules.width = b(e)), void 0 !== g && (a.rules.height = b(g)), a.populate(c));
        return new CKEDITOR.htmlParser.element("img", c)
      };
      CKEDITOR.editor.prototype.restoreRealElement = function(b) {
        if (b.data("cke-real-node-type") != CKEDITOR.NODE_ELEMENT) return null;
        var c = CKEDITOR.dom.element.createFromHtml(decodeURIComponent(b.data("cke-realelement")),
          this.document);
        if (b.data("cke-resizable")) { var e = b.getStyle("width");
          b = b.getStyle("height");
          e && c.setAttribute("width", a(c.getAttribute("width"), e));
          b && c.setAttribute("height", a(c.getAttribute("height"), b)) }
        return c
      }
    }(),
    function() {
      function a(a) { a = a.attributes; return "application/x-shockwave-flash" == a.type || b.test(a.src || "") }

      function d(a, b) { return a.createFakeParserElement(b, "cke_flash", "flash", !0) }
      var b = /\.swf(?:$|\?)/i;
      CKEDITOR.plugins.add("flash", {
        requires: "dialog,fakeobjects",
        onLoad: function() {
          CKEDITOR.addCss("img.cke_flash{background-image: url(" +
            CKEDITOR.getUrl(this.path + "images/placeholder.png") + ");background-position: center center;background-repeat: no-repeat;border: 1px solid #a9a9a9;width: 80px;height: 80px;}")
        },
        init: function(a) {
          var b = "object[classid,codebase,height,hspace,vspace,width];param[name,value];embed[height,hspace,pluginspage,src,type,vspace,width]";
          CKEDITOR.dialog.isTabEnabled(a, "flash", "properties") && (b += ";object[align]; embed[allowscriptaccess,quality,scale,wmode]");
          CKEDITOR.dialog.isTabEnabled(a, "flash", "advanced") && (b +=
            ";object[id]{*}; embed[bgcolor]{*}(*)");
          a.addCommand("flash", new CKEDITOR.dialogCommand("flash", { allowedContent: b, requiredContent: "embed" }));
          a.ui.addButton && a.ui.addButton("Flash", { label: a.lang.common.flash, command: "flash", toolbar: "insert,20" });
          CKEDITOR.dialog.add("flash", this.path + "dialogs/flash.js");
          a.addMenuItems && a.addMenuItems({ flash: { label: a.lang.flash.properties, command: "flash", group: "flash" } });
          a.on("doubleclick", function(a) {
            var b = a.data.element;
            b.is("img") && "flash" == b.data("cke-real-element-type") &&
              (a.data.dialog = "flash")
          });
          a.contextMenu && a.contextMenu.addListener(function(a) { if (a && a.is("img") && !a.isReadOnly() && "flash" == a.data("cke-real-element-type")) return { flash: CKEDITOR.TRISTATE_OFF } })
        },
        afterInit: function(b) {
          var g = b.dataProcessor;
          (g = g && g.dataFilter) && g.addRules({
            elements: {
              "cke:object": function(g) {
                var k = g.attributes;
                if (!(k.classid && String(k.classid).toLowerCase() || a(g))) { for (k = 0; k < g.children.length; k++)
                    if ("cke:embed" == g.children[k].name) { if (!a(g.children[k])) break; return d(b, g) }
                  return null }
                return d(b,
                  g)
              },
              "cke:embed": function(g) { return a(g) ? d(b, g) : null }
            }
          }, 5)
        }
      })
    }(), CKEDITOR.tools.extend(CKEDITOR.config, { flashEmbedTagOnly: !1, flashAddEmbedTag: !0, flashConvertOnEdit: !1 }),
    function() {
      function a(a) {
        var g = a.config,
          l = a.fire("uiSpace", { space: "top", html: "" }).html,
          k = function() {
            function e(a, c, d) { h.setStyle(c, b(d));
              h.setStyle("position", a) }

            function f(a) {
              var b = m.getDocumentPosition();
              switch (a) {
                case "top":
                  e("absolute", "top", b.y - r - y);
                  break;
                case "pin":
                  e("fixed", "top", z);
                  break;
                case "bottom":
                  e("absolute", "top", b.y +
                    (t.height || t.bottom - t.top) + y)
              }
              l = a
            }
            var l, m, v, t, u, r, B, x = g.floatSpaceDockedOffsetX || 0,
              y = g.floatSpaceDockedOffsetY || 0,
              C = g.floatSpacePinnedOffsetX || 0,
              z = g.floatSpacePinnedOffsetY || 0;
            return function(e) {
              if (m = a.editable()) {
                var n = e && "focus" == e.name;
                n && h.show();
                a.fire("floatingSpaceLayout", { show: n });
                h.removeStyle("left");
                h.removeStyle("right");
                v = h.getClientRect();
                t = m.getClientRect();
                u = d.getViewPaneSize();
                r = v.height;
                B = "pageXOffset" in d.$ ? d.$.pageXOffset : CKEDITOR.document.$.documentElement.scrollLeft;
                l ? (r + y <=
                  t.top ? f("top") : r + y > u.height - t.bottom ? f("pin") : f("bottom"), e = u.width / 2, e = g.floatSpacePreferRight ? "right" : 0 < t.left && t.right < u.width && t.width > v.width ? "rtl" == g.contentsLangDirection ? "right" : "left" : e - t.left > t.right - e ? "left" : "right", v.width > u.width ? (e = "left", n = 0) : (n = "left" == e ? 0 < t.left ? t.left : 0 : t.right < u.width ? u.width - t.right : 0, n + v.width > u.width && (e = "left" == e ? "right" : "left", n = 0)), h.setStyle(e, b(("pin" == l ? C : x) + n + ("pin" == l ? 0 : "left" == e ? B : -B)))) : (l = "pin", f("pin"), k(e))
              }
            }
          }();
        if (l) {
          var e = new CKEDITOR.template('\x3cdiv id\x3d"cke_{name}" class\x3d"cke {id} cke_reset_all cke_chrome cke_editor_{name} cke_float cke_{langDir} ' +
              CKEDITOR.env.cssClass + '" dir\x3d"{langDir}" title\x3d"' + (CKEDITOR.env.gecko ? " " : "") + '" lang\x3d"{langCode}" role\x3d"application" style\x3d"{style}"' + (a.title ? ' aria-labelledby\x3d"cke_{name}_arialbl"' : " ") + "\x3e" + (a.title ? '\x3cspan id\x3d"cke_{name}_arialbl" class\x3d"cke_voice_label"\x3e{voiceLabel}\x3c/span\x3e' : " ") + '\x3cdiv class\x3d"cke_inner"\x3e\x3cdiv id\x3d"{topId}" class\x3d"cke_top" role\x3d"presentation"\x3e{content}\x3c/div\x3e\x3c/div\x3e\x3c/div\x3e'),
            h = CKEDITOR.document.getBody().append(CKEDITOR.dom.element.createFromHtml(e.output({
              content: l,
              id: a.id,
              langDir: a.lang.dir,
              langCode: a.langCode,
              name: a.name,
              style: "display:none;z-index:" + (g.baseFloatZIndex - 1),
              topId: a.ui.spaceId("top"),
              voiceLabel: a.title
            }))),
            m = CKEDITOR.tools.eventsBuffer(500, k),
            f = CKEDITOR.tools.eventsBuffer(100, k);
          h.unselectable();
          h.on("mousedown", function(a) { a = a.data;
            a.getTarget().hasAscendant("a", 1) || a.preventDefault() });
          a.on("focus", function(b) { k(b);
            a.on("change", m.input);
            d.on("scroll", f.input);
            d.on("resize", f.input) });
          a.on("blur", function() {
            h.hide();
            a.removeListener("change",
              m.input);
            d.removeListener("scroll", f.input);
            d.removeListener("resize", f.input)
          });
          a.on("destroy", function() { d.removeListener("scroll", f.input);
            d.removeListener("resize", f.input);
            h.clearCustomData();
            h.remove() });
          a.focusManager.hasFocus && h.show();
          a.focusManager.add(h, 1)
        }
      }
      var d = CKEDITOR.document.getWindow(),
        b = CKEDITOR.tools.cssLength;
      CKEDITOR.plugins.add("floatingspace", { init: function(b) { b.on("loaded", function() { a(this) }, null, null, 20) } })
    }(), CKEDITOR.plugins.add("listblock", {
      requires: "panel",
      onLoad: function() {
        var a =
          CKEDITOR.addTemplate("panel-list", '\x3cul role\x3d"presentation" class\x3d"cke_panel_list"\x3e{items}\x3c/ul\x3e'),
          d = CKEDITOR.addTemplate("panel-list-item", '\x3cli id\x3d"{id}" class\x3d"cke_panel_listItem" role\x3dpresentation\x3e\x3ca id\x3d"{id}_option" _cke_focus\x3d1 hidefocus\x3dtrue title\x3d"{title}" href\x3d"javascript:void(\'{val}\')"  {onclick}\x3d"CKEDITOR.tools.callFunction({clickFn},\'{val}\'); return false;" role\x3d"option"\x3e{text}\x3c/a\x3e\x3c/li\x3e'),
          b = CKEDITOR.addTemplate("panel-list-group",
            '\x3ch1 id\x3d"{id}" class\x3d"cke_panel_grouptitle" role\x3d"presentation" \x3e{label}\x3c/h1\x3e'),
          c = /\'/g;
        CKEDITOR.ui.panel.prototype.addListBlock = function(a, b) { return this.addBlock(a, new CKEDITOR.ui.listBlock(this.getHolderElement(), b)) };
        CKEDITOR.ui.listBlock = CKEDITOR.tools.createClass({
          base: CKEDITOR.ui.panel.block,
          $: function(a, b) {
            b = b || {};
            var c = b.attributes || (b.attributes = {});
            (this.multiSelect = !!b.multiSelect) && (c["aria-multiselectable"] = !0);
            !c.role && (c.role = "listbox");
            this.base.apply(this, arguments);
            this.element.setAttribute("role", c.role);
            c = this.keys;
            c[40] = "next";
            c[9] = "next";
            c[38] = "prev";
            c[CKEDITOR.SHIFT + 9] = "prev";
            c[32] = CKEDITOR.env.ie ? "mouseup" : "click";
            CKEDITOR.env.ie && (c[13] = "mouseup");
            this._.pendingHtml = [];
            this._.pendingList = [];
            this._.items = {};
            this._.groups = {}
          },
          _: {
            close: function() { if (this._.started) { var b = a.output({ items: this._.pendingList.join("") });
                this._.pendingList = [];
                this._.pendingHtml.push(b);
                delete this._.started } },
            getClick: function() {
              this._.click || (this._.click = CKEDITOR.tools.addFunction(function(a) {
                var b =
                  this.toggle(a);
                if (this.onClick) this.onClick(a, b)
              }, this));
              return this._.click
            }
          },
          proto: {
            add: function(a, b, k) { var e = CKEDITOR.tools.getNextId();
              this._.started || (this._.started = 1, this._.size = this._.size || 0);
              this._.items[a] = e; var h;
              h = CKEDITOR.tools.htmlEncodeAttr(a).replace(c, "\\'");
              a = { id: e, val: h, onclick: CKEDITOR.env.ie ? 'onclick\x3d"return false;" onmouseup' : "onclick", clickFn: this._.getClick(), title: CKEDITOR.tools.htmlEncodeAttr(k || a), text: b || a };
              this._.pendingList.push(d.output(a)) },
            startGroup: function(a) {
              this._.close();
              var c = CKEDITOR.tools.getNextId();
              this._.groups[a] = c;
              this._.pendingHtml.push(b.output({ id: c, label: a }))
            },
            commit: function() { this._.close();
              this.element.appendHtml(this._.pendingHtml.join(""));
              delete this._.size;
              this._.pendingHtml = [] },
            toggle: function(a) { var b = this.isMarked(a);
              b ? this.unmark(a) : this.mark(a); return !b },
            hideGroup: function(a) { var b = (a = this.element.getDocument().getById(this._.groups[a])) && a.getNext();
              a && (a.setStyle("display", "none"), b && "ul" == b.getName() && b.setStyle("display", "none")) },
            hideItem: function(a) {
              this.element.getDocument().getById(this._.items[a]).setStyle("display",
                "none")
            },
            showAll: function() { var a = this._.items,
                b = this._.groups,
                c = this.element.getDocument(),
                e; for (e in a) c.getById(a[e]).setStyle("display", ""); for (var d in b) a = c.getById(b[d]), e = a.getNext(), a.setStyle("display", ""), e && "ul" == e.getName() && e.setStyle("display", "") },
            mark: function(a) { this.multiSelect || this.unmarkAll();
              a = this._.items[a]; var b = this.element.getDocument().getById(a);
              b.addClass("cke_selected");
              this.element.getDocument().getById(a + "_option").setAttribute("aria-selected", !0);
              this.onMark && this.onMark(b) },
            markFirstDisplayed: function() { var a = this;
              this._.markFirstDisplayed(function() { a.multiSelect || a.unmarkAll() }) },
            unmark: function(a) { var b = this.element.getDocument();
              a = this._.items[a]; var c = b.getById(a);
              c.removeClass("cke_selected");
              b.getById(a + "_option").removeAttribute("aria-selected");
              this.onUnmark && this.onUnmark(c) },
            unmarkAll: function() {
              var a = this._.items,
                b = this.element.getDocument(),
                c;
              for (c in a) { var e = a[c];
                b.getById(e).removeClass("cke_selected");
                b.getById(e + "_option").removeAttribute("aria-selected") } this.onUnmark &&
                this.onUnmark()
            },
            isMarked: function(a) { return this.element.getDocument().getById(this._.items[a]).hasClass("cke_selected") },
            focus: function(a) { this._.focusIndex = -1; var b = this.element.getElementsByTag("a"),
                c, e = -1; if (a)
                for (c = this.element.getDocument().getById(this._.items[a]).getFirst(); a = b.getItem(++e);) { if (a.equals(c)) { this._.focusIndex = e; break } } else this.element.focus();
              c && setTimeout(function() { c.focus() }, 0) }
          }
        })
      }
    }), CKEDITOR.plugins.add("richcombo", {
      requires: "floatpanel,listblock,button",
      beforeInit: function(a) {
        a.ui.addHandler(CKEDITOR.UI_RICHCOMBO,
          CKEDITOR.ui.richCombo.handler)
      }
    }),
    function() {
      var a = '\x3cspan id\x3d"{id}" class\x3d"cke_combo cke_combo__{name} {cls}" role\x3d"presentation"\x3e\x3cspan id\x3d"{id}_label" class\x3d"cke_combo_label"\x3e{label}\x3c/span\x3e\x3ca class\x3d"cke_combo_button" title\x3d"{title}" tabindex\x3d"-1"' + (CKEDITOR.env.gecko && !CKEDITOR.env.hc ? "" : " href\x3d\"javascript:void('{titleJs}')\"") + ' hidefocus\x3d"true" role\x3d"button" aria-labelledby\x3d"{id}_label" aria-haspopup\x3d"true"';
      CKEDITOR.env.gecko && CKEDITOR.env.mac &&
        (a += ' onkeypress\x3d"return false;"');
      CKEDITOR.env.gecko && (a += ' onblur\x3d"this.style.cssText \x3d this.style.cssText;"');
      var a = a + (' onkeydown\x3d"return CKEDITOR.tools.callFunction({keydownFn},event,this);" onfocus\x3d"return CKEDITOR.tools.callFunction({focusFn},event);" ' + (CKEDITOR.env.ie ? 'onclick\x3d"return false;" onmouseup' : "onclick") + '\x3d"CKEDITOR.tools.callFunction({clickFn},this);return false;"\x3e\x3cspan id\x3d"{id}_text" class\x3d"cke_combo_text cke_combo_inlinelabel"\x3e{label}\x3c/span\x3e\x3cspan class\x3d"cke_combo_open"\x3e\x3cspan class\x3d"cke_combo_arrow"\x3e' +
          (CKEDITOR.env.hc ? "\x26#9660;" : CKEDITOR.env.air ? "\x26nbsp;" : "") + "\x3c/span\x3e\x3c/span\x3e\x3c/a\x3e\x3c/span\x3e"),
        d = CKEDITOR.addTemplate("combo", a);
      CKEDITOR.UI_RICHCOMBO = "richcombo";
      CKEDITOR.ui.richCombo = CKEDITOR.tools.createClass({
        $: function(a) {
          CKEDITOR.tools.extend(this, a, { canGroup: !1, title: a.label, modes: { wysiwyg: 1 }, editorFocus: 1 });
          a = this.panel || {};
          delete this.panel;
          this.id = CKEDITOR.tools.getNextNumber();
          this.document = a.parent && a.parent.getDocument() || CKEDITOR.document;
          a.className = "cke_combopanel";
          a.block = { multiSelect: a.multiSelect, attributes: a.attributes };
          a.toolbarRelated = !0;
          this._ = { panelDefinition: a, items: {} }
        },
        proto: {
          renderHtml: function(a) { var c = [];
            this.render(a, c); return c.join("") },
          render: function(a, c) {
            function g() { if (this.getState() != CKEDITOR.TRISTATE_ON) { var c = this.modes[a.mode] ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED;
                a.readOnly && !this.readOnly && (c = CKEDITOR.TRISTATE_DISABLED);
                this.setState(c);
                this.setValue("");
                c != CKEDITOR.TRISTATE_DISABLED && this.refresh && this.refresh() } }
            var l =
              CKEDITOR.env,
              k = "cke_" + this.id,
              e = CKEDITOR.tools.addFunction(function(c) { p && (a.unlockSelection(1), p = 0);
                m.execute(c) }, this),
              h = this,
              m = { id: k, combo: this, focus: function() { CKEDITOR.document.getById(k).getChild(1).focus() }, execute: function(c) { var e = h._; if (e.state != CKEDITOR.TRISTATE_DISABLED)
                    if (h.createPanel(a), e.on) e.panel.hide();
                    else { h.commit(); var d = h.getValue();
                      d ? e.list.mark(d) : e.list.unmarkAll();
                      e.panel.showBlock(h.id, new CKEDITOR.dom.element(c), 4) } }, clickFn: e };
            a.on("activeFilterChange", g, this);
            a.on("mode",
              g, this);
            a.on("selectionChange", g, this);
            !this.readOnly && a.on("readOnly", g, this);
            var f = CKEDITOR.tools.addFunction(function(a, b) { a = new CKEDITOR.dom.event(a); var c = a.getKeystroke(); switch (c) {
                  case 13:
                  case 32:
                  case 40:
                    CKEDITOR.tools.callFunction(e, b); break;
                  default:
                    m.onkey(m, c) } a.preventDefault() }),
              n = CKEDITOR.tools.addFunction(function() { m.onfocus && m.onfocus() }),
              p = 0;
            m.keyDownFn = f;
            l = {
              id: k,
              name: this.name || this.command,
              label: this.label,
              title: this.title,
              cls: this.className || "",
              titleJs: l.gecko && !l.hc ? "" : (this.title ||
                "").replace("'", ""),
              keydownFn: f,
              focusFn: n,
              clickFn: e
            };
            d.output(l, c);
            if (this.onRender) this.onRender();
            return m
          },
          createPanel: function(a) {
            if (!this._.panel) {
              var c = this._.panelDefinition,
                d = this._.panelDefinition.block,
                l = c.parent || CKEDITOR.document.getBody(),
                k = "cke_combopanel__" + this.name,
                e = new CKEDITOR.ui.floatPanel(a, l, c),
                c = e.addListBlock(this.id, d),
                h = this;
              e.onShow = function() { this.element.addClass(k);
                h.setState(CKEDITOR.TRISTATE_ON);
                h._.on = 1;
                h.editorFocus && !a.focusManager.hasFocus && a.focus(); if (h.onOpen) h.onOpen() };
              e.onHide = function(c) { this.element.removeClass(k);
                h.setState(h.modes && h.modes[a.mode] ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED);
                h._.on = 0; if (!c && h.onClose) h.onClose() };
              e.onEscape = function() { e.hide(1) };
              c.onClick = function(a, b) { h.onClick && h.onClick.call(h, a, b);
                e.hide() };
              this._.panel = e;
              this._.list = c;
              e.getBlock(this.id).onHide = function() { h._.on = 0;
                h.setState(CKEDITOR.TRISTATE_OFF) };
              this.init && this.init()
            }
          },
          setValue: function(a, c) {
            this._.value = a;
            var d = this.document.getById("cke_" + this.id + "_text");
            d &&
              (a || c ? d.removeClass("cke_combo_inlinelabel") : (c = this.label, d.addClass("cke_combo_inlinelabel")), d.setText("undefined" != typeof c ? c : a))
          },
          getValue: function() { return this._.value || "" },
          unmarkAll: function() { this._.list.unmarkAll() },
          mark: function(a) { this._.list.mark(a) },
          hideItem: function(a) { this._.list.hideItem(a) },
          hideGroup: function(a) { this._.list.hideGroup(a) },
          showAll: function() { this._.list.showAll() },
          add: function(a, c, d) { this._.items[a] = d || a;
            this._.list.add(a, c, d) },
          startGroup: function(a) { this._.list.startGroup(a) },
          commit: function() { this._.committed || (this._.list.commit(), this._.committed = 1, CKEDITOR.ui.fire("ready", this));
            this._.committed = 1 },
          setState: function(a) { if (this._.state != a) { var c = this.document.getById("cke_" + this.id);
              c.setState(a, "cke_combo");
              a == CKEDITOR.TRISTATE_DISABLED ? c.setAttribute("aria-disabled", !0) : c.removeAttribute("aria-disabled");
              this._.state = a } },
          getState: function() { return this._.state },
          enable: function() { this._.state == CKEDITOR.TRISTATE_DISABLED && this.setState(this._.lastState) },
          disable: function() {
            this._.state !=
              CKEDITOR.TRISTATE_DISABLED && (this._.lastState = this._.state, this.setState(CKEDITOR.TRISTATE_DISABLED))
          }
        },
        statics: { handler: { create: function(a) { return new CKEDITOR.ui.richCombo(a) } } }
      });
      CKEDITOR.ui.prototype.addRichCombo = function(a, c) { this.add(a, CKEDITOR.UI_RICHCOMBO, c) }
    }(),
    function() {
      function a(a, c, g, l, k, e, h, m) {
        var f = a.config,
          n = new CKEDITOR.style(h),
          p = k.split(";");
        k = [];
        for (var q = {}, w = 0; w < p.length; w++) {
          var v = p[w];
          if (v) {
            var v = v.split("/"),
              t = {},
              u = p[w] = v[0];
            t[g] = k[w] = v[1] || u;
            q[u] = new CKEDITOR.style(h, t);
            q[u]._.definition.name = u
          } else p.splice(w--, 1)
        }
        a.ui.addRichCombo(c, {
          label: l.label,
          title: l.panelTitle,
          toolbar: "styles," + m,
          defaultValue: "cke-default",
          allowedContent: n,
          requiredContent: n,
          contentTransformations: [
            [{
              element: "font",
              check: "span",
              left: function(a) { return !!a.attributes.size || !!a.attributes.align || !!a.attributes.face },
              right: function(a) {
                var b = " x-small small medium large x-large xx-large 48px".split(" ");
                a.name = "span";
                a.attributes.size && (a.styles["font-size"] = b[a.attributes.size], delete a.attributes.size);
                a.attributes.align && (a.styles["text-align"] = a.attributes.align, delete a.attributes.align);
                a.attributes.face && (a.styles["font-family"] = a.attributes.face, delete a.attributes.face)
              }
            }]
          ],
          panel: { css: [CKEDITOR.skin.getPath("editor")].concat(f.contentsCss), multiSelect: !1, attributes: { "aria-label": l.panelTitle } },
          init: function() { var c;
            c = "(" + a.lang.common.optionDefault + ")";
            this.startGroup(l.panelTitle);
            this.add(this.defaultValue, c, c); for (var e = 0; e < p.length; e++) c = p[e], this.add(c, q[c].buildPreview(), c) },
          onClick: function(c) {
            a.focus();
            a.fire("saveSnapshot");
            var e = this.getValue(),
              f = q[c],
              g, h, k, m, l;
            if (e && c != e)
              if (g = q[e], e = a.getSelection().getRanges()[0], e.collapsed) {
                if (h = a.elementPath(), k = h.contains(function(a) { return g.checkElementRemovable(a) })) {
                  m = e.checkBoundaryOfElement(k, CKEDITOR.START);
                  l = e.checkBoundaryOfElement(k, CKEDITOR.END);
                  if (m && l) { for (m = e.createBookmark(); h = k.getFirst();) h.insertBefore(k);
                    k.remove();
                    e.moveToBookmark(m) } else m || l ? e.moveToPosition(k, m ? CKEDITOR.POSITION_BEFORE_START : CKEDITOR.POSITION_AFTER_END) : (e.splitElement(k),
                    e.moveToPosition(k, CKEDITOR.POSITION_AFTER_END)), d(e, h.elements.slice(), k);
                  a.getSelection().selectRanges([e])
                }
              } else a.removeStyle(g);
            c === this.defaultValue ? g && a.removeStyle(g) : a.applyStyle(f);
            a.fire("saveSnapshot")
          },
          onRender: function() { a.on("selectionChange", function(c) { var d = this.getValue();
              c = c.data.path.elements; for (var f = 0, g; f < c.length; f++) { g = c[f]; for (var h in q)
                  if (q[h].checkElementMatch(g, !0, a)) { h != d && this.setValue(h); return } } this.setValue("", e) }, this) },
          refresh: function() {
            a.activeFilter.check(n) ||
              this.setState(CKEDITOR.TRISTATE_DISABLED)
          }
        })
      }

      function d(a, c, g) { var l = c.pop(); if (l) { if (g) return d(a, c, l.equals(g) ? null : g);
          g = l.clone();
          a.insertNode(g);
          a.moveToPosition(g, CKEDITOR.POSITION_AFTER_START);
          d(a, c) } } CKEDITOR.plugins.add("font", { requires: "richcombo", init: function(b) { var c = b.config;
          a(b, "Font", "family", b.lang.font, c.font_names, c.font_defaultLabel, c.font_style, 30);
          a(b, "FontSize", "size", b.lang.font.fontSize, c.fontSize_sizes, c.fontSize_defaultLabel, c.fontSize_style, 40) } })
    }(), CKEDITOR.config.font_names =
    "Arial/Arial, Helvetica, sans-serif;Comic Sans MS/Comic Sans MS, cursive;Courier New/Courier New, Courier, monospace;Georgia/Georgia, serif;Lucida Sans Unicode/Lucida Sans Unicode, Lucida Grande, sans-serif;Tahoma/Tahoma, Geneva, sans-serif;Times New Roman/Times New Roman, Times, serif;Trebuchet MS/Trebuchet MS, Helvetica, sans-serif;Verdana/Verdana, Geneva, sans-serif", CKEDITOR.config.font_defaultLabel = "", CKEDITOR.config.font_style = {
      element: "span",
      styles: { "font-family": "#(family)" },
      overrides: [{
        element: "font",
        attributes: { face: null }
      }]
    }, CKEDITOR.config.fontSize_sizes = "8/8px;9/9px;10/10px;11/11px;12/12px;14/14px;16/16px;18/18px;20/20px;22/22px;24/24px;26/26px;28/28px;36/36px;48/48px;72/72px", CKEDITOR.config.fontSize_defaultLabel = "", CKEDITOR.config.fontSize_style = { element: "span", styles: { "font-size": "#(size)" }, overrides: [{ element: "font", attributes: { size: null } }] }, CKEDITOR.plugins.add("format", {
      requires: "richcombo",
      init: function(a) {
        if (!a.blockless) {
          for (var d = a.config, b = a.lang.format, c = d.format_tags.split(";"),
              g = {}, l = 0, k = [], e = 0; e < c.length; e++) { var h = c[e],
              m = new CKEDITOR.style(d["format_" + h]); if (!a.filter.customConfig || a.filter.check(m)) l++, g[h] = m, g[h]._.enterMode = a.config.enterMode, k.push(m) } 0 !== l && a.ui.addRichCombo("Format", {
            label: b.label,
            title: b.panelTitle,
            toolbar: "styles,20",
            allowedContent: k,
            panel: { css: [CKEDITOR.skin.getPath("editor")].concat(d.contentsCss), multiSelect: !1, attributes: { "aria-label": b.panelTitle } },
            init: function() {
              this.startGroup(b.panelTitle);
              for (var a in g) {
                var c = b["tag_" + a];
                this.add(a,
                  g[a].buildPreview(c), c)
              }
            },
            onClick: function(b) { a.focus();
              a.fire("saveSnapshot");
              b = g[b]; var c = a.elementPath();
              b.checkActive(c, a) || a.applyStyle(b);
              setTimeout(function() { a.fire("saveSnapshot") }, 0) },
            onRender: function() { a.on("selectionChange", function(b) { var c = this.getValue();
                b = b.data.path;
                this.refresh(); for (var e in g)
                  if (g[e].checkActive(b, a)) { e != c && this.setValue(e, a.lang.format["tag_" + e]); return }
                this.setValue("") }, this) },
            onOpen: function() { this.showAll(); for (var b in g) a.activeFilter.check(g[b]) || this.hideItem(b) },
            refresh: function() { var b = a.elementPath(); if (b) { if (b.isContextFor("p"))
                  for (var c in g)
                    if (a.activeFilter.check(g[c])) return;
                this.setState(CKEDITOR.TRISTATE_DISABLED) } }
          })
        }
      }
    }), CKEDITOR.config.format_tags = "p;h1;h2;h3;h4;h5;h6;pre;address;div", CKEDITOR.config.format_p = { element: "p" }, CKEDITOR.config.format_div = { element: "div" }, CKEDITOR.config.format_pre = { element: "pre" }, CKEDITOR.config.format_address = { element: "address" }, CKEDITOR.config.format_h1 = { element: "h1" }, CKEDITOR.config.format_h2 = { element: "h2" }, CKEDITOR.config.format_h3 = { element: "h3" }, CKEDITOR.config.format_h4 = { element: "h4" }, CKEDITOR.config.format_h5 = { element: "h5" }, CKEDITOR.config.format_h6 = { element: "h6" }, CKEDITOR.plugins.add("forms", {
      requires: "dialog,fakeobjects",
      onLoad: function() { CKEDITOR.addCss(".cke_editable form{border: 1px dotted #FF0000;padding: 2px;}\n");
        CKEDITOR.addCss("img.cke_hidden{background-image: url(" + CKEDITOR.getUrl(this.path + "images/hiddenfield.gif") + ");background-position: center center;background-repeat: no-repeat;border: 1px solid #a9a9a9;width: 16px !important;height: 16px !important;}") },
      init: function(a) {
        var d = a.lang,
          b = 0,
          c = { email: 1, password: 1, search: 1, tel: 1, text: 1, url: 1 },
          g = { checkbox: "input[type,name,checked,required]", radio: "input[type,name,checked,required]", textfield: "input[type,name,value,size,maxlength,required]", textarea: "textarea[cols,rows,name,required]", select: "select[name,size,multiple,required]; option[value,selected]", button: "input[type,name,value]", form: "form[action,name,id,enctype,target,method]", hiddenfield: "input[type,name,value]", imagebutton: "input[type,alt,src]{width,height,border,border-width,border-style,margin,float}" },
          l = { checkbox: "input", radio: "input", textfield: "input", textarea: "textarea", select: "select", button: "input", form: "form", hiddenfield: "input", imagebutton: "input" },
          k = function(c, e, h) { var k = { allowedContent: g[e], requiredContent: l[e] }; "form" == e && (k.context = "form");
            a.addCommand(e, new CKEDITOR.dialogCommand(e, k));
            a.ui.addButton && a.ui.addButton(c, { label: d.common[c.charAt(0).toLowerCase() + c.slice(1)], command: e, toolbar: "forms," + (b += 10) });
            CKEDITOR.dialog.add(e, h) },
          e = this.path + "dialogs/";
        !a.blockless && k("Form", "form",
          e + "form.js");
        k("Checkbox", "checkbox", e + "checkbox.js");
        k("Radio", "radio", e + "radio.js");
        k("TextField", "textfield", e + "textfield.js");
        k("Textarea", "textarea", e + "textarea.js");
        k("Select", "select", e + "select.js");
        k("Button", "button", e + "button.js");
        var h = a.plugins.image;
        h && !a.plugins.image2 && k("ImageButton", "imagebutton", CKEDITOR.plugins.getPath("image") + "dialogs/image.js");
        k("HiddenField", "hiddenfield", e + "hiddenfield.js");
        a.addMenuItems && (k = {
          checkbox: {
            label: d.forms.checkboxAndRadio.checkboxTitle,
            command: "checkbox",
            group: "checkbox"
          },
          radio: { label: d.forms.checkboxAndRadio.radioTitle, command: "radio", group: "radio" },
          textfield: { label: d.forms.textfield.title, command: "textfield", group: "textfield" },
          hiddenfield: { label: d.forms.hidden.title, command: "hiddenfield", group: "hiddenfield" },
          button: { label: d.forms.button.title, command: "button", group: "button" },
          select: { label: d.forms.select.title, command: "select", group: "select" },
          textarea: { label: d.forms.textarea.title, command: "textarea", group: "textarea" }
        }, h && (k.imagebutton = {
          label: d.image.titleButton,
          command: "imagebutton",
          group: "imagebutton"
        }), !a.blockless && (k.form = { label: d.forms.form.menu, command: "form", group: "form" }), a.addMenuItems(k));
        a.contextMenu && (!a.blockless && a.contextMenu.addListener(function(a, b, c) { if ((a = c.contains("form", 1)) && !a.isReadOnly()) return { form: CKEDITOR.TRISTATE_OFF } }), a.contextMenu.addListener(function(a) {
          if (a && !a.isReadOnly()) {
            var b = a.getName();
            if ("select" == b) return { select: CKEDITOR.TRISTATE_OFF };
            if ("textarea" == b) return { textarea: CKEDITOR.TRISTATE_OFF };
            if ("input" == b) {
              var e =
                a.getAttribute("type") || "text";
              switch (e) {
                case "button":
                case "submit":
                case "reset":
                  return { button: CKEDITOR.TRISTATE_OFF };
                case "checkbox":
                  return { checkbox: CKEDITOR.TRISTATE_OFF };
                case "radio":
                  return { radio: CKEDITOR.TRISTATE_OFF };
                case "image":
                  return h ? { imagebutton: CKEDITOR.TRISTATE_OFF } : null }
              if (c[e]) return { textfield: CKEDITOR.TRISTATE_OFF }
            }
            if ("img" == b && "hiddenfield" == a.data("cke-real-element-type")) return { hiddenfield: CKEDITOR.TRISTATE_OFF }
          }
        }));
        a.on("doubleclick", function(b) {
          var e = b.data.element;
          if (!a.blockless &&
            e.is("form")) b.data.dialog = "form";
          else if (e.is("select")) b.data.dialog = "select";
          else if (e.is("textarea")) b.data.dialog = "textarea";
          else if (e.is("img") && "hiddenfield" == e.data("cke-real-element-type")) b.data.dialog = "hiddenfield";
          else if (e.is("input")) {
            e = e.getAttribute("type") || "text";
            switch (e) {
              case "button":
              case "submit":
              case "reset":
                b.data.dialog = "button"; break;
              case "checkbox":
                b.data.dialog = "checkbox"; break;
              case "radio":
                b.data.dialog = "radio"; break;
              case "image":
                b.data.dialog = "imagebutton" } c[e] && (b.data.dialog =
              "textfield")
          }
        })
      },
      afterInit: function(a) { var d = a.dataProcessor,
          b = d && d.htmlFilter,
          d = d && d.dataFilter;
        CKEDITOR.env.ie && b && b.addRules({ elements: { input: function(a) { a = a.attributes; var b = a.type;
              b || (a.type = "text"); "checkbox" != b && "radio" != b || "on" != a.value || delete a.value } } }, { applyToAll: !0 });
        d && d.addRules({ elements: { input: function(b) { if ("hidden" == b.attributes.type) return a.createFakeParserElement(b, "cke_hidden", "hiddenfield") } } }, { applyToAll: !0 }) }
    }),
    function() {
      var a = {
        canUndo: !1,
        exec: function(a) {
          var b = a.document.createElement("hr");
          a.insertElement(b)
        },
        allowedContent: "hr",
        requiredContent: "hr"
      };
      CKEDITOR.plugins.add("horizontalrule", { init: function(d) { d.blockless || (d.addCommand("horizontalrule", a), d.ui.addButton && d.ui.addButton("HorizontalRule", { label: d.lang.horizontalrule.toolbar, command: "horizontalrule", toolbar: "insert,40" })) } })
    }(), CKEDITOR.plugins.add("htmlwriter", {
      init: function(a) {
        var d = new CKEDITOR.htmlWriter;
        d.forceSimpleAmpersand = a.config.forceSimpleAmpersand;
        d.indentationChars = a.config.dataIndentationChars || "\t";
        a.dataProcessor.writer =
          d
      }
    }), CKEDITOR.htmlWriter = CKEDITOR.tools.createClass({
      base: CKEDITOR.htmlParser.basicWriter,
      $: function() {
        this.base();
        this.indentationChars = "\t";
        this.selfClosingEnd = " /\x3e";
        this.lineBreakChars = "\n";
        this.sortAttributes = 1;
        this._.indent = 0;
        this._.indentation = "";
        this._.inPre = 0;
        this._.rules = {};
        var a = CKEDITOR.dtd,
          d;
        for (d in CKEDITOR.tools.extend({}, a.$nonBodyContent, a.$block, a.$listItem, a.$tableContent)) this.setRules(d, {
          indent: !a[d]["#"],
          breakBeforeOpen: 1,
          breakBeforeClose: !a[d]["#"],
          breakAfterClose: 1,
          needsSpace: d in
            a.$block && !(d in { li: 1, dt: 1, dd: 1 })
        });
        this.setRules("br", { breakAfterOpen: 1 });
        this.setRules("title", { indent: 0, breakAfterOpen: 0 });
        this.setRules("style", { indent: 0, breakBeforeClose: 1 });
        this.setRules("pre", { breakAfterOpen: 1, indent: 0 })
      },
      proto: {
        openTag: function(a) { var d = this._.rules[a];
          this._.afterCloser && d && d.needsSpace && this._.needsSpace && this._.output.push("\n");
          this._.indent ? this.indentation() : d && d.breakBeforeOpen && (this.lineBreak(), this.indentation());
          this._.output.push("\x3c", a);
          this._.afterCloser = 0 },
        openTagClose: function(a, d) { var b = this._.rules[a];
          d ? (this._.output.push(this.selfClosingEnd), b && b.breakAfterClose && (this._.needsSpace = b.needsSpace)) : (this._.output.push("\x3e"), b && b.indent && (this._.indentation += this.indentationChars));
          b && b.breakAfterOpen && this.lineBreak(); "pre" == a && (this._.inPre = 1) },
        attribute: function(a, d) { "string" == typeof d && (this.forceSimpleAmpersand && (d = d.replace(/&amp;/g, "\x26")), d = CKEDITOR.tools.htmlEncodeAttr(d));
          this._.output.push(" ", a, '\x3d"', d, '"') },
        closeTag: function(a) {
          var d =
            this._.rules[a];
          d && d.indent && (this._.indentation = this._.indentation.substr(this.indentationChars.length));
          this._.indent ? this.indentation() : d && d.breakBeforeClose && (this.lineBreak(), this.indentation());
          this._.output.push("\x3c/", a, "\x3e");
          "pre" == a && (this._.inPre = 0);
          d && d.breakAfterClose && (this.lineBreak(), this._.needsSpace = d.needsSpace);
          this._.afterCloser = 1
        },
        text: function(a) { this._.indent && (this.indentation(), !this._.inPre && (a = CKEDITOR.tools.ltrim(a)));
          this._.output.push(a) },
        comment: function(a) {
          this._.indent &&
            this.indentation();
          this._.output.push("\x3c!--", a, "--\x3e")
        },
        lineBreak: function() {!this._.inPre && 0 < this._.output.length && this._.output.push(this.lineBreakChars);
          this._.indent = 1 },
        indentation: function() {!this._.inPre && this._.indentation && this._.output.push(this._.indentation);
          this._.indent = 0 },
        reset: function() { this._.output = [];
          this._.indent = 0;
          this._.indentation = "";
          this._.afterCloser = 0;
          this._.inPre = 0;
          this._.needsSpace = 0 },
        setRules: function(a, d) {
          var b = this._.rules[a];
          b ? CKEDITOR.tools.extend(b, d, !0) : this._.rules[a] =
            d
        }
      }
    }),
    function() {
      CKEDITOR.plugins.add("iframe", {
        requires: "dialog,fakeobjects",
        onLoad: function() { CKEDITOR.addCss("img.cke_iframe{background-image: url(" + CKEDITOR.getUrl(this.path + "images/placeholder.png") + ");background-position: center center;background-repeat: no-repeat;border: 1px solid #a9a9a9;width: 80px;height: 80px;}") },
        init: function(a) {
          var d = a.lang.iframe,
            b = "iframe[align,longdesc,frameborder,height,name,scrolling,src,title,width]";
          a.plugins.dialogadvtab && (b += ";iframe" + a.plugins.dialogadvtab.allowedContent({
            id: 1,
            classes: 1,
            styles: 1
          }));
          CKEDITOR.dialog.add("iframe", this.path + "dialogs/iframe.js");
          a.addCommand("iframe", new CKEDITOR.dialogCommand("iframe", { allowedContent: b, requiredContent: "iframe" }));
          a.ui.addButton && a.ui.addButton("Iframe", { label: d.toolbar, command: "iframe", toolbar: "insert,80" });
          a.on("doubleclick", function(a) { var b = a.data.element;
            b.is("img") && "iframe" == b.data("cke-real-element-type") && (a.data.dialog = "iframe") });
          a.addMenuItems && a.addMenuItems({ iframe: { label: d.title, command: "iframe", group: "image" } });
          a.contextMenu && a.contextMenu.addListener(function(a) { if (a && a.is("img") && "iframe" == a.data("cke-real-element-type")) return { iframe: CKEDITOR.TRISTATE_OFF } })
        },
        afterInit: function(a) { var d = a.dataProcessor;
          (d = d && d.dataFilter) && d.addRules({ elements: { iframe: function(b) { return a.createFakeParserElement(b, "cke_iframe", "iframe", !0) } } }) }
      })
    }(),
    function() {
      function a(a, c) { c || (c = a.getSelection().getSelectedElement()); if (c && c.is("img") && !c.data("cke-realelement") && !c.isReadOnly()) return c }

      function d(a) {
        var c = a.getStyle("float");
        if ("inherit" == c || "none" == c) c = 0;
        c || (c = a.getAttribute("align"));
        return c
      }
      CKEDITOR.plugins.add("image", {
        requires: "dialog",
        init: function(b) {
          if (!b.plugins.image2) {
            CKEDITOR.dialog.add("image", this.path + "dialogs/image.js");
            var c = "img[alt,!src]{border-style,border-width,float,height,margin,margin-bottom,margin-left,margin-right,margin-top,width}";
            CKEDITOR.dialog.isTabEnabled(b, "image", "advanced") && (c = "img[alt,dir,id,lang,longdesc,!src,title]{*}(*)");
            b.addCommand("image", new CKEDITOR.dialogCommand("image", { allowedContent: c, requiredContent: "img[alt,src]", contentTransformations: [
                ["img{width}: sizeToStyle", "img[width]: sizeToAttribute"],
                ["img{float}: alignmentToStyle", "img[align]: alignmentToAttribute"]
              ] }));
            b.ui.addButton && b.ui.addButton("Image", { label: b.lang.common.image, command: "image", toolbar: "insert,10" });
            b.on("doubleclick", function(a) { var b = a.data.element;!b.is("img") || b.data("cke-realelement") || b.isReadOnly() || (a.data.dialog = "image") });
            b.addMenuItems && b.addMenuItems({
              image: {
                label: b.lang.image.menu,
                command: "image",
                group: "image"
              }
            });
            b.contextMenu && b.contextMenu.addListener(function(c) { if (a(b, c)) return { image: CKEDITOR.TRISTATE_OFF } })
          }
        },
        afterInit: function(b) {
          function c(c) {
            var l = b.getCommand("justify" + c);
            if (l) {
              if ("left" == c || "right" == c) l.on("exec", function(k) { var e = a(b),
                  h;
                e && (h = d(e), h == c ? (e.removeStyle("float"), c == d(e) && e.removeAttribute("align")) : e.setStyle("float", c), k.cancel()) });
              l.on("refresh", function(k) {
                var e = a(b);
                e && (e = d(e), this.setState(e == c ? CKEDITOR.TRISTATE_ON : "right" == c || "left" == c ? CKEDITOR.TRISTATE_OFF :
                  CKEDITOR.TRISTATE_DISABLED), k.cancel())
              })
            }
          }
          b.plugins.image2 || (c("left"), c("right"), c("center"), c("block"))
        }
      })
    }(), CKEDITOR.config.image_removeLinkByEmptyURL = !0,
    function() {
      function a(a, g) {
        var l, k;
        g.on("refresh", function(a) { var c = [d],
            g; for (g in a.data.states) c.push(a.data.states[g]);
          this.setState(CKEDITOR.tools.search(c, b) ? b : d) }, g, null, 100);
        g.on("exec", function(b) { l = a.getSelection();
          k = l.createBookmarks(1);
          b.data || (b.data = {});
          b.data.done = !1 }, g, null, 0);
        g.on("exec", function() {
          a.forceNextSelectionCheck();
          l.selectBookmarks(k)
        }, g, null, 100)
      }
      var d = CKEDITOR.TRISTATE_DISABLED,
        b = CKEDITOR.TRISTATE_OFF;
      CKEDITOR.plugins.add("indent", {
        init: function(b) {
          var d = CKEDITOR.plugins.indent.genericDefinition;
          a(b, b.addCommand("indent", new d(!0)));
          a(b, b.addCommand("outdent", new d));
          b.ui.addButton && (b.ui.addButton("Indent", { label: b.lang.indent.indent, command: "indent", directional: !0, toolbar: "indent,20" }), b.ui.addButton("Outdent", { label: b.lang.indent.outdent, command: "outdent", directional: !0, toolbar: "indent,10" }));
          b.on("dirChanged",
            function(a) {
              var d = b.createRange(),
                e = a.data.node;
              d.setStartBefore(e);
              d.setEndAfter(e);
              for (var g = new CKEDITOR.dom.walker(d), m; m = g.next();)
                if (m.type == CKEDITOR.NODE_ELEMENT)
                  if (!m.equals(e) && m.getDirection()) d.setStartAfter(m), g = new CKEDITOR.dom.walker(d);
                  else {
                    var f = b.config.indentClasses;
                    if (f)
                      for (var n = "ltr" == a.data.dir ? ["_rtl", ""] : ["", "_rtl"], p = 0; p < f.length; p++) m.hasClass(f[p] + n[0]) && (m.removeClass(f[p] + n[0]), m.addClass(f[p] + n[1]));
                    f = m.getStyle("margin-right");
                    n = m.getStyle("margin-left");
                    f ? m.setStyle("margin-left",
                      f) : m.removeStyle("margin-left");
                    n ? m.setStyle("margin-right", n) : m.removeStyle("margin-right")
                  }
            })
        }
      });
      CKEDITOR.plugins.indent = {
        genericDefinition: function(a) { this.isIndent = !!a;
          this.startDisabled = !this.isIndent },
        specificDefinition: function(a, b, d) { this.name = b;
          this.editor = a;
          this.jobs = {};
          this.enterBr = a.config.enterMode == CKEDITOR.ENTER_BR;
          this.isIndent = !!d;
          this.relatedGlobal = d ? "indent" : "outdent";
          this.indentKey = d ? 9 : CKEDITOR.SHIFT + 9;
          this.database = {} },
        registerCommands: function(a, b) {
          a.on("pluginsLoaded", function() {
            for (var a in b)(function(a,
              b) { var c = a.getCommand(b.relatedGlobal),
                d; for (d in b.jobs) c.on("exec", function(c) { c.data.done || (a.fire("lockSnapshot"), b.execJob(a, d) && (c.data.done = !0), a.fire("unlockSnapshot"), CKEDITOR.dom.element.clearAllMarkers(b.database)) }, this, null, d), c.on("refresh", function(c) { c.data.states || (c.data.states = {});
                c.data.states[b.name + "@" + d] = b.refreshJob(a, d, c.data.path) }, this, null, d);
              a.addFeature(b) })(this, b[a])
          })
        }
      };
      CKEDITOR.plugins.indent.genericDefinition.prototype = { context: "p", exec: function() {} };
      CKEDITOR.plugins.indent.specificDefinition.prototype = { execJob: function(a, b) { var l = this.jobs[b]; if (l.state != d) return l.exec.call(this, a) }, refreshJob: function(a, b, l) { b = this.jobs[b];
          a.activeFilter.checkFeature(this) ? b.state = b.refresh.call(this, a, l) : b.state = d; return b.state }, getContext: function(a) { return a.contains(this.context) } }
    }(),
    function() {
      function a(a, b, c) {
        if (!a.getCustomData("indent_processed")) {
          var g = this.editor,
            f = this.isIndent;
          if (b) {
            g = a.$.className.match(this.classNameRegex);
            c = 0;
            g && (g = g[1], c = CKEDITOR.tools.indexOf(b, g) + 1);
            if (0 > (c += f ? 1 : -1)) return;
            c = Math.min(c, b.length);
            c = Math.max(c, 0);
            a.$.className = CKEDITOR.tools.ltrim(a.$.className.replace(this.classNameRegex, ""));
            0 < c && a.addClass(b[c - 1])
          } else { b = d(a, c);
            c = parseInt(a.getStyle(b), 10); var l = g.config.indentOffset || 40;
            isNaN(c) && (c = 0);
            c += (f ? 1 : -1) * l; if (0 > c) return;
            c = Math.max(c, 0);
            c = Math.ceil(c / l) * l;
            a.setStyle(b, c ? c + (g.config.indentUnit || "px") : ""); "" === a.getAttribute("style") && a.removeAttribute("style") } CKEDITOR.dom.element.setMarker(this.database, a, "indent_processed", 1)
        }
      }

      function d(a, b) {
        return "ltr" ==
          (b || a.getComputedStyle("direction")) ? "margin-left" : "margin-right"
      }
      var b = CKEDITOR.dtd.$listItem,
        c = CKEDITOR.dtd.$list,
        g = CKEDITOR.TRISTATE_DISABLED,
        l = CKEDITOR.TRISTATE_OFF;
      CKEDITOR.plugins.add("indentblock", {
        requires: "indent",
        init: function(k) {
          function e() {
            h.specificDefinition.apply(this, arguments);
            this.allowedContent = { "div h1 h2 h3 h4 h5 h6 ol p pre ul": { propertiesOnly: !0, styles: m ? null : "margin-left,margin-right", classes: m || null } };
            this.contentTransformations = [
              ["div: splitMarginShorthand"],
              ["h1: splitMarginShorthand"],
              ["h2: splitMarginShorthand"],
              ["h3: splitMarginShorthand"],
              ["h4: splitMarginShorthand"],
              ["h5: splitMarginShorthand"],
              ["h6: splitMarginShorthand"],
              ["ol: splitMarginShorthand"],
              ["p: splitMarginShorthand"],
              ["pre: splitMarginShorthand"],
              ["ul: splitMarginShorthand"]
            ];
            this.enterBr && (this.allowedContent.div = !0);
            this.requiredContent = (this.enterBr ? "div" : "p") + (m ? "(" + m.join(",") + ")" : "{margin-left}");
            this.jobs = {
              20: {
                refresh: function(a, c) {
                  var e = c.block || c.blockLimit;
                  if (!e.is(b)) var h = e.getAscendant(b),
                    e = h && c.contains(h) ||
                    e;
                  e.is(b) && (e = e.getParent());
                  if (this.enterBr || this.getContext(c)) { if (m) { var h = m,
                        e = e.$.className.match(this.classNameRegex),
                        k = this.isIndent,
                        h = e ? k ? e[1] != h.slice(-1) : !0 : k; return h ? l : g } return this.isIndent ? l : e ? CKEDITOR[0 >= (parseInt(e.getStyle(d(e)), 10) || 0) ? "TRISTATE_DISABLED" : "TRISTATE_OFF"] : g }
                  return g
                },
                exec: function(b) {
                  var e = b.getSelection(),
                    e = e && e.getRanges()[0],
                    d;
                  if (d = b.elementPath().contains(c)) a.call(this, d, m);
                  else
                    for (e = e.createIterator(), b = b.config.enterMode, e.enforceRealBlocks = !0, e.enlargeBr =
                      b != CKEDITOR.ENTER_BR; d = e.getNextParagraph(b == CKEDITOR.ENTER_P ? "p" : "div");) d.isReadOnly() || a.call(this, d, m);
                  return !0
                }
              }
            }
          }
          var h = CKEDITOR.plugins.indent,
            m = k.config.indentClasses;
          h.registerCommands(k, { indentblock: new e(k, "indentblock", !0), outdentblock: new e(k, "outdentblock") });
          CKEDITOR.tools.extend(e.prototype, h.specificDefinition.prototype, { context: { div: 1, dl: 1, h1: 1, h2: 1, h3: 1, h4: 1, h5: 1, h6: 1, ul: 1, ol: 1, p: 1, pre: 1, table: 1 }, classNameRegex: m ? new RegExp("(?:^|\\s+)(" + m.join("|") + ")(?\x3d$|\\s)") : null })
        }
      })
    }(),
    function() {
      function a(a) {
        function c(d) {
          for (var h = l.startContainer, r = l.endContainer; h && !h.getParent().equals(d);) h = h.getParent();
          for (; r && !r.getParent().equals(d);) r = r.getParent();
          if (!h || !r) return !1;
          for (var B = [], x = !1; !x;) h.equals(r) && (x = !0), B.push(h), h = h.getNext();
          if (1 > B.length) return !1;
          h = d.getParents(!0);
          for (r = 0; r < h.length; r++)
            if (h[r].getName && k[h[r].getName()]) { d = h[r]; break }
          for (var h = g.isIndent ? 1 : -1, r = B[0], B = B[B.length - 1], x = CKEDITOR.plugins.list.listToArray(d, f), y = x[B.getCustomData("listarray_index")].indent,
              r = r.getCustomData("listarray_index"); r <= B.getCustomData("listarray_index"); r++)
            if (x[r].indent += h, 0 < h) { for (var w = x[r].parent, z = r - 1; 0 <= z; z--)
                if (x[z].indent === h) { w = x[z].parent; break }
              x[r].parent = new CKEDITOR.dom.element(w.getName(), w.getDocument()) }
          for (r = B.getCustomData("listarray_index") + 1; r < x.length && x[r].indent > y; r++) x[r].indent += h;
          h = CKEDITOR.plugins.list.arrayToList(x, f, null, a.config.enterMode, d.getDirection());
          if (!g.isIndent) {
            var A;
            if ((A = d.getParent()) && A.is("li"))
              for (var B = h.listNode.getChildren(),
                  v = [], q, r = B.count() - 1; 0 <= r; r--)(q = B.getItem(r)) && q.is && q.is("li") && v.push(q)
          }
          h && h.listNode.replace(d);
          if (v && v.length)
            for (r = 0; r < v.length; r++) { for (q = d = v[r];
                (q = q.getNext()) && q.is && q.getName() in k;) CKEDITOR.env.needsNbspFiller && !d.getFirst(b) && d.append(l.document.createText(" ")), d.append(q);
              d.insertAfter(A) } h && a.fire("contentDomInvalidated");
          return !0
        }
        for (var g = this, f = this.database, k = this.context, l, q = a.getSelection(), q = (q && q.getRanges()).createIterator(); l = q.getNextRange();) {
          for (var w = l.getCommonAncestor(); w &&
            (w.type != CKEDITOR.NODE_ELEMENT || !k[w.getName()]);) { if (a.editable().equals(w)) { w = !1; break } w = w.getParent() } w || (w = l.startPath().contains(k)) && l.setEndAt(w, CKEDITOR.POSITION_BEFORE_END);
          if (!w) { var v = l.getEnclosedNode();
            v && v.type == CKEDITOR.NODE_ELEMENT && v.getName() in k && (l.setStartAt(v, CKEDITOR.POSITION_AFTER_START), l.setEndAt(v, CKEDITOR.POSITION_BEFORE_END), w = v) } w && l.startContainer.type == CKEDITOR.NODE_ELEMENT && l.startContainer.getName() in k && (v = new CKEDITOR.dom.walker(l), v.evaluator = d, l.startContainer =
            v.next());
          w && l.endContainer.type == CKEDITOR.NODE_ELEMENT && l.endContainer.getName() in k && (v = new CKEDITOR.dom.walker(l), v.evaluator = d, l.endContainer = v.previous());
          if (w) return c(w)
        }
        return 0
      }

      function d(a) { return a.type == CKEDITOR.NODE_ELEMENT && a.is("li") }

      function b(a) { return c(a) && g(a) }
      var c = CKEDITOR.dom.walker.whitespaces(!0),
        g = CKEDITOR.dom.walker.bookmark(!1, !0),
        l = CKEDITOR.TRISTATE_DISABLED,
        k = CKEDITOR.TRISTATE_OFF;
      CKEDITOR.plugins.add("indentlist", {
        requires: "indent",
        init: function(b) {
          function c(b) {
            d.specificDefinition.apply(this,
              arguments);
            this.requiredContent = ["ul", "ol"];
            b.on("key", function(a) { var c = b.elementPath(); if ("wysiwyg" == b.mode && a.data.keyCode == this.indentKey && c) { var e = this.getContext(c);!e || this.isIndent && CKEDITOR.plugins.indentList.firstItemInPath(this.context, c, e) || (b.execCommand(this.relatedGlobal), a.cancel()) } }, this);
            this.jobs[this.isIndent ? 10 : 30] = {
              refresh: this.isIndent ? function(a, b) { var c = this.getContext(b),
                  e = CKEDITOR.plugins.indentList.firstItemInPath(this.context, b, c); return c && this.isIndent && !e ? k : l } : function(a,
                b) { return !this.getContext(b) || this.isIndent ? l : k },
              exec: CKEDITOR.tools.bind(a, this)
            }
          }
          var d = CKEDITOR.plugins.indent;
          d.registerCommands(b, { indentlist: new c(b, "indentlist", !0), outdentlist: new c(b, "outdentlist") });
          CKEDITOR.tools.extend(c.prototype, d.specificDefinition.prototype, { context: { ol: 1, ul: 1 } })
        }
      });
      CKEDITOR.plugins.indentList = {};
      CKEDITOR.plugins.indentList.firstItemInPath = function(a, b, c) { var f = b.contains(d);
        c || (c = b.contains(a)); return c && f && f.equals(c.getFirst(d)) }
    }(),
    function() {
      function a(a, b) {
        b =
          void 0 === b || b;
        var d;
        if (b) d = a.getComputedStyle("text-align");
        else { for (; !a.hasAttribute || !a.hasAttribute("align") && !a.getStyle("text-align");) { d = a.getParent(); if (!d) break;
            a = d } d = a.getStyle("text-align") || a.getAttribute("align") || "" } d && (d = d.replace(/(?:-(?:moz|webkit)-)?(?:start|auto)/i, ""));
        !d && b && (d = "rtl" == a.getComputedStyle("direction") ? "right" : "left");
        return d
      }

      function d(a, b, d) {
        this.editor = a;
        this.name = b;
        this.value = d;
        this.context = "p";
        b = a.config.justifyClasses;
        var k = a.config.enterMode == CKEDITOR.ENTER_P ?
          "p" : "div";
        if (b) { switch (d) {
            case "left":
              this.cssClassName = b[0]; break;
            case "center":
              this.cssClassName = b[1]; break;
            case "right":
              this.cssClassName = b[2]; break;
            case "justify":
              this.cssClassName = b[3] } this.cssClassRegex = new RegExp("(?:^|\\s+)(?:" + b.join("|") + ")(?\x3d$|\\s)");
          this.requiredContent = k + "(" + this.cssClassName + ")" } else this.requiredContent = k + "{text-align}";
        this.allowedContent = {
          "caption div h1 h2 h3 h4 h5 h6 p pre td th li": {
            propertiesOnly: !0,
            styles: this.cssClassName ? null : "text-align",
            classes: this.cssClassName ||
              null
          }
        };
        a.config.enterMode == CKEDITOR.ENTER_BR && (this.allowedContent.div = !0)
      }

      function b(a) {
        var b = a.editor,
          d = b.createRange();
        d.setStartBefore(a.data.node);
        d.setEndAfter(a.data.node);
        for (var k = new CKEDITOR.dom.walker(d), e; e = k.next();)
          if (e.type == CKEDITOR.NODE_ELEMENT)
            if (!e.equals(a.data.node) && e.getDirection()) d.setStartAfter(e), k = new CKEDITOR.dom.walker(d);
            else {
              var h = b.config.justifyClasses;
              h && (e.hasClass(h[0]) ? (e.removeClass(h[0]), e.addClass(h[2])) : e.hasClass(h[2]) && (e.removeClass(h[2]), e.addClass(h[0])));
              h = e.getStyle("text-align");
              "left" == h ? e.setStyle("text-align", "right") : "right" == h && e.setStyle("text-align", "left")
            }
      }
      d.prototype = {
        exec: function(b) {
          var d = b.getSelection(),
            l = b.config.enterMode;
          if (d) {
            for (var k = d.createBookmarks(), e = d.getRanges(), h = this.cssClassName, m, f, n = b.config.useComputedState, n = void 0 === n || n, p = e.length - 1; 0 <= p; p--)
              for (m = e[p].createIterator(), m.enlargeBr = l != CKEDITOR.ENTER_BR; f = m.getNextParagraph(l == CKEDITOR.ENTER_P ? "p" : "div");)
                if (!f.isReadOnly()) {
                  var q = f.getName(),
                    w;
                  w = b.activeFilter.check(q +
                    "{text-align}");
                  if ((q = b.activeFilter.check(q + "(" + h + ")")) || w) { f.removeAttribute("align");
                    f.removeStyle("text-align"); var v = h && (f.$.className = CKEDITOR.tools.ltrim(f.$.className.replace(this.cssClassRegex, ""))),
                      t = this.state == CKEDITOR.TRISTATE_OFF && (!n || a(f, !0) != this.value);
                    h && q ? t ? f.addClass(h) : v || f.removeAttribute("class") : t && w && f.setStyle("text-align", this.value) }
                }
            b.focus();
            b.forceNextSelectionCheck();
            d.selectBookmarks(k)
          }
        },
        refresh: function(b, d) {
          var l = d.block || d.blockLimit,
            k = l.getName(),
            e = l.equals(b.editable()),
            k = this.cssClassName ? b.activeFilter.check(k + "(" + this.cssClassName + ")") : b.activeFilter.check(k + "{text-align}");
          e && 1 === d.elements.length ? this.setState(CKEDITOR.TRISTATE_OFF) : !e && k ? this.setState(a(l, this.editor.config.useComputedState) == this.value ? CKEDITOR.TRISTATE_ON : CKEDITOR.TRISTATE_OFF) : this.setState(CKEDITOR.TRISTATE_DISABLED)
        }
      };
      CKEDITOR.plugins.add("justify", {
        init: function(a) {
          if (!a.blockless) {
            var g = new d(a, "justifyleft", "left"),
              l = new d(a, "justifycenter", "center"),
              k = new d(a, "justifyright", "right"),
              e = new d(a, "justifyblock", "justify");
            a.addCommand("justifyleft", g);
            a.addCommand("justifycenter", l);
            a.addCommand("justifyright", k);
            a.addCommand("justifyblock", e);
            a.ui.addButton && (a.ui.addButton("JustifyLeft", { label: a.lang.common.alignLeft, command: "justifyleft", toolbar: "align,10" }), a.ui.addButton("JustifyCenter", { label: a.lang.common.center, command: "justifycenter", toolbar: "align,20" }), a.ui.addButton("JustifyRight", { label: a.lang.common.alignRight, command: "justifyright", toolbar: "align,30" }), a.ui.addButton("JustifyBlock", { label: a.lang.common.justify, command: "justifyblock", toolbar: "align,40" }));
            a.on("dirChanged", b)
          }
        }
      })
    }(), CKEDITOR.plugins.add("menubutton", {
      requires: "button,menu",
      onLoad: function() {
        var a = function(a) {
          var b = this._,
            c = b.menu;
          b.state !== CKEDITOR.TRISTATE_DISABLED && (b.on && c ? c.hide() : (b.previousState = b.state, c || (c = b.menu = new CKEDITOR.menu(a, { panel: { className: "cke_menu_panel", attributes: { "aria-label": a.lang.common.options } } }), c.onHide = CKEDITOR.tools.bind(function() {
            var c = this.command ? a.getCommand(this.command).modes :
              this.modes;
            this.setState(!c || c[a.mode] ? b.previousState : CKEDITOR.TRISTATE_DISABLED);
            b.on = 0
          }, this), this.onMenu && c.addListener(this.onMenu)), this.setState(CKEDITOR.TRISTATE_ON), b.on = 1, setTimeout(function() { c.show(CKEDITOR.document.getById(b.id), 4) }, 0)))
        };
        CKEDITOR.ui.menuButton = CKEDITOR.tools.createClass({ base: CKEDITOR.ui.button, $: function(d) { delete d.panel;
            this.base(d);
            this.hasArrow = !0;
            this.click = a }, statics: { handler: { create: function(a) { return new CKEDITOR.ui.menuButton(a) } } } })
      },
      beforeInit: function(a) {
        a.ui.addHandler(CKEDITOR.UI_MENUBUTTON,
          CKEDITOR.ui.menuButton.handler)
      }
    }), CKEDITOR.UI_MENUBUTTON = "menubutton", "use strict",
    function() {
      CKEDITOR.plugins.add("language", {
        requires: "menubutton",
        init: function(a) {
          var d = a.config.language_list || ["ar:Arabic:rtl", "fr:French", "es:Spanish"],
            b = this,
            c = a.lang.language,
            g = {},
            l, k, e, h;
          a.addCommand("language", {
            allowedContent: "span[!lang,!dir]",
            requiredContent: "span[lang,dir]",
            contextSensitive: !0,
            exec: function(a, b) { var c = g["language_" + b]; if (c) a[c.style.checkActive(a.elementPath(), a) ? "removeStyle" : "applyStyle"](c.style) },
            refresh: function(a) { this.setState(b.getCurrentLangElement(a) ? CKEDITOR.TRISTATE_ON : CKEDITOR.TRISTATE_OFF) }
          });
          for (h = 0; h < d.length; h++) l = d[h].split(":"), k = l[0], e = "language_" + k, g[e] = { label: l[1], langId: k, group: "language", order: h, ltr: "rtl" != ("" + l[2]).toLowerCase(), onClick: function() { a.execCommand("language", this.langId) }, role: "menuitemcheckbox" }, g[e].style = new CKEDITOR.style({ element: "span", attributes: { lang: k, dir: g[e].ltr ? "ltr" : "rtl" } });
          g.language_remove = {
            label: c.remove,
            group: "language_remove",
            state: CKEDITOR.TRISTATE_DISABLED,
            order: g.length,
            onClick: function() { var c = b.getCurrentLangElement(a);
              c && a.execCommand("language", c.getAttribute("lang")) }
          };
          a.addMenuGroup("language", 1);
          a.addMenuGroup("language_remove");
          a.addMenuItems(g);
          a.ui.add("Language", CKEDITOR.UI_MENUBUTTON, {
            label: c.button,
            allowedContent: "span[!lang,!dir]",
            requiredContent: "span[lang,dir]",
            toolbar: "bidi,30",
            command: "language",
            onMenu: function() {
              var c = {},
                e = b.getCurrentLangElement(a),
                d;
              for (d in g) c[d] = CKEDITOR.TRISTATE_OFF;
              c.language_remove = e ? CKEDITOR.TRISTATE_OFF :
                CKEDITOR.TRISTATE_DISABLED;
              e && (c["language_" + e.getAttribute("lang")] = CKEDITOR.TRISTATE_ON);
              return c
            }
          });
          a.addRemoveFormatFilter && a.addRemoveFormatFilter(function(a) { return !(a.is("span") && a.getAttribute("dir") && a.getAttribute("lang")) })
        },
        getCurrentLangElement: function(a) { var d = a.elementPath();
          a = d && d.elements; var b; if (d)
            for (var c = 0; c < a.length; c++) d = a[c], !b && "span" == d.getName() && d.hasAttribute("dir") && d.hasAttribute("lang") && (b = d); return b }
      })
    }(), "use strict",
    function() {
      function a(a) {
        return a.replace(/'/g,
          "\\$\x26")
      }

      function d(a) { for (var b, c = a.length, e = [], d = 0; d < c; d++) b = a.charCodeAt(d), e.push(b); return "String.fromCharCode(" + e.join(",") + ")" }

      function b(b, c) { var e = b.plugins.link,
          d = e.compiledProtectionFunction.params,
          f, g;
        g = [e.compiledProtectionFunction.name, "("]; for (var h = 0; h < d.length; h++) e = d[h].toLowerCase(), f = c[e], 0 < h && g.push(","), g.push("'", f ? a(encodeURIComponent(c[e])) : "", "'");
        g.push(")"); return g.join("") }

      function c(a) {
        a = a.config.emailProtection || "";
        var b;
        a && "encode" != a && (b = {}, a.replace(/^([^(]+)\(([^)]+)\)$/,
          function(a, c, e) { b.name = c;
            b.params = [];
            e.replace(/[^,\s]+/g, function(a) { b.params.push(a) }) }));
        return b
      }
      CKEDITOR.plugins.add("link", {
        requires: "dialog,fakeobjects",
        onLoad: function() {
          function a(b) { return c.replace(/%1/g, "rtl" == b ? "right" : "left").replace(/%2/g, "cke_contents_" + b) }
          var b = "background:url(" + CKEDITOR.getUrl(this.path + "images" + (CKEDITOR.env.hidpi ? "/hidpi" : "") + "/anchor.png") + ") no-repeat %1 center;border:1px dotted #00f;background-size:16px;",
            c = ".%2 a.cke_anchor,.%2 a.cke_anchor_empty,.cke_editable.%2 a[name],.cke_editable.%2 a[data-cke-saved-name]{" +
            b + "padding-%1:18px;cursor:auto;}.%2 img.cke_anchor{" + b + "width:16px;min-height:15px;height:1.15em;vertical-align:text-bottom;}";
          CKEDITOR.addCss(a("ltr") + a("rtl"))
        },
        init: function(a) {
          var b = "a[!href]";
          CKEDITOR.dialog.isTabEnabled(a, "link", "advanced") && (b = b.replace("]", ",accesskey,charset,dir,id,lang,name,rel,tabindex,title,type,download]{*}(*)"));
          CKEDITOR.dialog.isTabEnabled(a, "link", "target") && (b = b.replace("]", ",target,onclick]"));
          a.addCommand("link", new CKEDITOR.dialogCommand("link", {
            allowedContent: b,
            requiredContent: "a[href]"
          }));
          a.addCommand("anchor", new CKEDITOR.dialogCommand("anchor", { allowedContent: "a[!name,id]", requiredContent: "a[name]" }));
          a.addCommand("unlink", new CKEDITOR.unlinkCommand);
          a.addCommand("removeAnchor", new CKEDITOR.removeAnchorCommand);
          a.setKeystroke(CKEDITOR.CTRL + 76, "link");
          a.ui.addButton && (a.ui.addButton("Link", { label: a.lang.link.toolbar, command: "link", toolbar: "links,10" }), a.ui.addButton("Unlink", { label: a.lang.link.unlink, command: "unlink", toolbar: "links,20" }), a.ui.addButton("Anchor", { label: a.lang.link.anchor.toolbar, command: "anchor", toolbar: "links,30" }));
          CKEDITOR.dialog.add("link", this.path + "dialogs/link.js");
          CKEDITOR.dialog.add("anchor", this.path + "dialogs/anchor.js");
          a.on("doubleclick", function(b) { var c = b.data.element.getAscendant({ a: 1, img: 1 }, !0);
            c && !c.isReadOnly() && (c.is("a") ? (b.data.dialog = !c.getAttribute("name") || c.getAttribute("href") && c.getChildCount() ? "link" : "anchor", b.data.link = c) : CKEDITOR.plugins.link.tryRestoreFakeAnchor(a, c) && (b.data.dialog = "anchor")) }, null, null, 0);
          a.on("doubleclick", function(b) { b.data.dialog in { link: 1, anchor: 1 } && b.data.link && a.getSelection().selectElement(b.data.link) }, null, null, 20);
          a.addMenuItems && a.addMenuItems({ anchor: { label: a.lang.link.anchor.menu, command: "anchor", group: "anchor", order: 1 }, removeAnchor: { label: a.lang.link.anchor.remove, command: "removeAnchor", group: "anchor", order: 5 }, link: { label: a.lang.link.menu, command: "link", group: "link", order: 1 }, unlink: { label: a.lang.link.unlink, command: "unlink", group: "link", order: 5 } });
          a.contextMenu && a.contextMenu.addListener(function(b) {
            if (!b ||
              b.isReadOnly()) return null;
            b = CKEDITOR.plugins.link.tryRestoreFakeAnchor(a, b);
            if (!b && !(b = CKEDITOR.plugins.link.getSelectedLink(a))) return null;
            var c = {};
            b.getAttribute("href") && b.getChildCount() && (c = { link: CKEDITOR.TRISTATE_OFF, unlink: CKEDITOR.TRISTATE_OFF });
            b && b.hasAttribute("name") && (c.anchor = c.removeAnchor = CKEDITOR.TRISTATE_OFF);
            return c
          });
          this.compiledProtectionFunction = c(a)
        },
        afterInit: function(a) {
          a.dataProcessor.dataFilter.addRules({
            elements: {
              a: function(b) {
                return b.attributes.name ? b.children.length ?
                  null : a.createFakeParserElement(b, "cke_anchor", "anchor") : null
              }
            }
          });
          var b = a._.elementsPath && a._.elementsPath.filters;
          b && b.push(function(b, c) { if ("a" == c && (CKEDITOR.plugins.link.tryRestoreFakeAnchor(a, b) || b.getAttribute("name") && (!b.getAttribute("href") || !b.getChildCount()))) return "anchor" })
        }
      });
      var g = /^javascript:/,
        l = /^mailto:([^?]+)(?:\?(.+))?$/,
        k = /subject=([^;?:@&=$,\/]*)/i,
        e = /body=([^;?:@&=$,\/]*)/i,
        h = /^#(.*)$/,
        m = /^((?:http|https|ftp|news):\/\/)?(.*)$/,
        f = /^(_(?:self|top|parent|blank))$/,
        n = /^javascript:void\(location\.href='mailto:'\+String\.fromCharCode\(([^)]+)\)(?:\+'(.*)')?\)$/,
        p = /^javascript:([^(]+)\(([^)]+)\)$/,
        q = /\s*window.open\(\s*this\.href\s*,\s*(?:'([^']*)'|null)\s*,\s*'([^']*)'\s*\)\s*;\s*return\s*false;*\s*/,
        w = /(?:^|,)([^=]+)=(\d+|yes|no)/gi,
        v = { id: "advId", dir: "advLangDir", accessKey: "advAccessKey", name: "advName", lang: "advLangCode", tabindex: "advTabIndex", title: "advTitle", type: "advContentType", "class": "advCSSClasses", charset: "advCharset", style: "advStyles", rel: "advRel" };
      CKEDITOR.plugins.link = {
        getSelectedLink: function(a, b) {
          var c = a.getSelection(),
            e = c.getSelectedElement(),
            d = c.getRanges(),
            f = [],
            g;
          if (!b && e && e.is("a")) return e;
          for (e = 0; e < d.length; e++)
            if (g = c.getRanges()[e], g.shrink(CKEDITOR.SHRINK_ELEMENT, !0, { skipBogus: !0 }), (g = a.elementPath(g.getCommonAncestor()).contains("a", 1)) && b) f.push(g);
            else if (g) return g;
          return b ? f : null
        },
        getEditorAnchors: function(a) {
          for (var b = a.editable(), c = b.isInline() && !a.plugins.divarea ? a.document : b, b = c.getElementsByTag("a"), c = c.getElementsByTag("img"), e = [], d = 0, f; f = b.getItem(d++);)(f.data("cke-saved-name") || f.hasAttribute("name")) && e.push({
            name: f.data("cke-saved-name") ||
              f.getAttribute("name"),
            id: f.getAttribute("id")
          });
          for (d = 0; f = c.getItem(d++);)(f = this.tryRestoreFakeAnchor(a, f)) && e.push({ name: f.getAttribute("name"), id: f.getAttribute("id") });
          return e
        },
        fakeAnchor: !0,
        tryRestoreFakeAnchor: function(a, b) { if (b && b.data("cke-real-element-type") && "anchor" == b.data("cke-real-element-type")) { var c = a.restoreRealElement(b); if (c.data("cke-saved-name")) return c } },
        parseLinkAttributes: function(a, b) {
          var c = b && (b.data("cke-saved-href") || b.getAttribute("href")) || "",
            d = a.plugins.link.compiledProtectionFunction,
            x = a.config.emailProtection,
            y, C = {};
          c.match(g) && ("encode" == x ? c = c.replace(n, function(a, b, c) { c = c || ""; return "mailto:" + String.fromCharCode.apply(String, b.split(",")) + c.replace(/\\'/g, "'") }) : x && c.replace(p, function(a, b, c) { if (b == d.name) { C.type = "email";
              a = C.email = {};
              b = /(^')|('$)/g;
              c = c.match(/[^,\s]+/g); for (var e = c.length, f, g, h = 0; h < e; h++) f = decodeURIComponent, g = c[h].replace(b, "").replace(/\\'/g, "'"), g = f(g), f = d.params[h].toLowerCase(), a[f] = g;
              a.address = [a.name, a.domain].join("@") } }));
          if (!C.type)
            if (x = c.match(h)) C.type =
              "anchor", C.anchor = {}, C.anchor.name = C.anchor.id = x[1];
            else if (x = c.match(l)) { y = c.match(k);
            c = c.match(e);
            C.type = "email"; var z = C.email = {};
            z.address = x[1];
            y && (z.subject = decodeURIComponent(y[1]));
            c && (z.body = decodeURIComponent(c[1])) } else c && (y = c.match(m)) && (C.type = "url", C.url = {}, C.url.protocol = y[1], C.url.url = y[2]);
          if (b) {
            if (c = b.getAttribute("target")) C.target = { type: c.match(f) ? c : "frame", name: c };
            else if (c = (c = b.data("cke-pa-onclick") || b.getAttribute("onclick")) && c.match(q))
              for (C.target = { type: "popup", name: c[1] }; x =
                w.exec(c[2]);) "yes" != x[2] && "1" != x[2] || x[1] in { height: 1, width: 1, top: 1, left: 1 } ? isFinite(x[2]) && (C.target[x[1]] = x[2]) : C.target[x[1]] = !0;
            null !== b.getAttribute("download") && (C.download = !0);
            var c = {},
              A;
            for (A in v)(x = b.getAttribute(A)) && (c[v[A]] = x);
            if (A = b.data("cke-saved-name") || c.advName) c.advName = A;
            CKEDITOR.tools.isEmpty(c) || (C.advanced = c)
          }
          return C
        },
        getLinkAttributes: function(c, e) {
          var f = c.config.emailProtection || "",
            g = {};
          switch (e.type) {
            case "url":
              var f = e.url && void 0 !== e.url.protocol ? e.url.protocol : "http://",
                h = e.url && CKEDITOR.tools.trim(e.url.url) || "";
              g["data-cke-saved-href"] = 0 === h.indexOf("/") ? h : f + h;
              break;
            case "anchor":
              f = e.anchor && e.anchor.id;
              g["data-cke-saved-href"] = "#" + (e.anchor && e.anchor.name || f || "");
              break;
            case "email":
              var k = e.email,
                h = k.address;
              switch (f) {
                case "":
                case "encode":
                  var l = encodeURIComponent(k.subject || ""),
                    m = encodeURIComponent(k.body || ""),
                    k = [];
                  l && k.push("subject\x3d" + l);
                  m && k.push("body\x3d" + m);
                  k = k.length ? "?" + k.join("\x26") : "";
                  "encode" == f ? (f = ["javascript:void(location.href\x3d'mailto:'+",
                    d(h)
                  ], k && f.push("+'", a(k), "'"), f.push(")")) : f = ["mailto:", h, k];
                  break;
                default:
                  f = h.split("@", 2), k.name = f[0], k.domain = f[1], f = ["javascript:", b(c, k)]
              }
              g["data-cke-saved-href"] = f.join("")
          }
          if (e.target)
            if ("popup" == e.target.type) {
              for (var f = ["window.open(this.href, '", e.target.name || "", "', '"], n = "resizable status location toolbar menubar fullscreen scrollbars dependent".split(" "), h = n.length, l = function(a) { e.target[a] && n.push(a + "\x3d" + e.target[a]) }, k = 0; k < h; k++) n[k] += e.target[n[k]] ? "\x3dyes" : "\x3dno";
              l("width");
              l("left");
              l("height");
              l("top");
              f.push(n.join(","), "'); return false;");
              g["data-cke-pa-onclick"] = f.join("")
            } else "notSet" != e.target.type && e.target.name && (g.target = e.target.name);
          e.download && (g.download = "");
          if (e.advanced) { for (var w in v)(f = e.advanced[v[w]]) && (g[w] = f);
            g.name && (g["data-cke-saved-name"] = g.name) } g["data-cke-saved-href"] && (g.href = g["data-cke-saved-href"]);
          w = { target: 1, onclick: 1, "data-cke-pa-onclick": 1, "data-cke-saved-name": 1, download: 1 };
          e.advanced && CKEDITOR.tools.extend(w, v);
          for (var p in g) delete w[p];
          return { set: g, removed: CKEDITOR.tools.objectKeys(w) }
        },
        showDisplayTextForElement: function(a, b) { var c = { img: 1, table: 1, tbody: 1, thead: 1, tfoot: 1, input: 1, select: 1, textarea: 1 },
            e = b.getSelection(); return b.widgets && b.widgets.focused || e && 1 < e.getRanges().length ? !1 : !a || !a.getName || !a.is(c) }
      };
      CKEDITOR.unlinkCommand = function() {};
      CKEDITOR.unlinkCommand.prototype = {
        exec: function(a) {
          if (CKEDITOR.env.ie) {
            var b = a.getSelection().getRanges()[0],
              c = b.getPreviousEditableNode() && b.getPreviousEditableNode().getAscendant("a", !0) ||
              b.getNextEditableNode() && b.getNextEditableNode().getAscendant("a", !0),
              e;
            b.collapsed && c && (e = b.createBookmark(), b.selectNodeContents(c), b.select())
          }
          c = new CKEDITOR.style({ element: "a", type: CKEDITOR.STYLE_INLINE, alwaysRemoveElement: 1 });
          a.removeStyle(c);
          e && (b.moveToBookmark(e), b.select())
        },
        refresh: function(a, b) { var c = b.lastElement && b.lastElement.getAscendant("a", !0);
          c && "a" == c.getName() && c.getAttribute("href") && c.getChildCount() ? this.setState(CKEDITOR.TRISTATE_OFF) : this.setState(CKEDITOR.TRISTATE_DISABLED) },
        contextSensitive: 1,
        startDisabled: 1,
        requiredContent: "a[href]",
        editorFocus: 1
      };
      CKEDITOR.removeAnchorCommand = function() {};
      CKEDITOR.removeAnchorCommand.prototype = {
        exec: function(a) {
          var b = a.getSelection(),
            c = b.createBookmarks(),
            e;
          if (b && (e = b.getSelectedElement()) && (e.getChildCount() ? e.is("a") : CKEDITOR.plugins.link.tryRestoreFakeAnchor(a, e))) e.remove(1);
          else if (e = CKEDITOR.plugins.link.getSelectedLink(a)) e.hasAttribute("href") ? (e.removeAttributes({ name: 1, "data-cke-saved-name": 1 }), e.removeClass("cke_anchor")) :
            e.remove(1);
          b.selectBookmarks(c)
        },
        requiredContent: "a[name]"
      };
      CKEDITOR.tools.extend(CKEDITOR.config, { linkShowAdvancedTab: !0, linkShowTargetTab: !0 })
    }(),
    function() {
      function a(a, b, c) {
        function e(c) { if (!(!(l = k[c ? "getFirst" : "getLast"]()) || l.is && l.isBlockBoundary() || !(m = b.root[c ? "getPrevious" : "getNext"](CKEDITOR.dom.walker.invisible(!0))) || m.is && m.isBlockBoundary({ br: 1 }))) a.document.createElement("br")[c ? "insertBefore" : "insertAfter"](l) }
        for (var d = CKEDITOR.plugins.list.listToArray(b.root, c), f = [], g = 0; g < b.contents.length; g++) {
          var h =
            b.contents[g];
          (h = h.getAscendant("li", !0)) && !h.getCustomData("list_item_processed") && (f.push(h), CKEDITOR.dom.element.setMarker(c, h, "list_item_processed", !0))
        }
        h = null;
        for (g = 0; g < f.length; g++) h = f[g].getCustomData("listarray_index"), d[h].indent = -1;
        for (g = h + 1; g < d.length; g++)
          if (d[g].indent > d[g - 1].indent + 1) { f = d[g - 1].indent + 1 - d[g].indent; for (h = d[g].indent; d[g] && d[g].indent >= h;) d[g].indent += f, g++;
            g-- }
        var k = CKEDITOR.plugins.list.arrayToList(d, c, null, a.config.enterMode, b.root.getAttribute("dir")).listNode,
          l, m;
        e(!0);
        e();
        k.replace(b.root);
        a.fire("contentDomInvalidated")
      }

      function d(a, b) { this.name = a;
        this.context = this.type = b;
        this.allowedContent = b + " li";
        this.requiredContent = b }

      function b(a, b, c, e) { for (var d, f; d = a[e ? "getLast" : "getFirst"](q);)(f = d.getDirection(1)) !== b.getDirection(1) && d.setAttribute("dir", f), d.remove(), c ? d[e ? "insertBefore" : "insertAfter"](c) : b.append(d, e) }

      function c(a) {
        function c(e) {
          var d = a[e ? "getPrevious" : "getNext"](f);
          d && d.type == CKEDITOR.NODE_ELEMENT && d.is(a.getName()) && (b(a, d, null, !e), a.remove(),
            a = d)
        }
        c();
        c(1)
      }

      function g(a) { return a.type == CKEDITOR.NODE_ELEMENT && (a.getName() in CKEDITOR.dtd.$block || a.getName() in CKEDITOR.dtd.$listItem) && CKEDITOR.dtd[a.getName()]["#"] }

      function l(a, e, d) {
        a.fire("saveSnapshot");
        d.enlarge(CKEDITOR.ENLARGE_LIST_ITEM_CONTENTS);
        var g = d.extractContents();
        e.trim(!1, !0);
        var h = e.createBookmark(),
          l = new CKEDITOR.dom.elementPath(e.startContainer),
          m = l.block,
          l = l.lastElement.getAscendant("li", 1) || m,
          y = new CKEDITOR.dom.elementPath(d.startContainer),
          p = y.contains(CKEDITOR.dtd.$listItem),
          y = y.contains(CKEDITOR.dtd.$list);
        m ? (m = m.getBogus()) && m.remove() : y && (m = y.getPrevious(f)) && n(m) && m.remove();
        (m = g.getLast()) && m.type == CKEDITOR.NODE_ELEMENT && m.is("br") && m.remove();
        (m = e.startContainer.getChild(e.startOffset)) ? g.insertBefore(m): e.startContainer.append(g);
        p && (g = k(p)) && (l.contains(p) ? (b(g, p.getParent(), p), g.remove()) : l.append(g));
        for (; d.checkStartOfBlock() && d.checkEndOfBlock();) {
          y = d.startPath();
          g = y.block;
          if (!g) break;
          g.is("li") && (l = g.getParent(), g.equals(l.getLast(f)) && g.equals(l.getFirst(f)) &&
            (g = l));
          d.moveToPosition(g, CKEDITOR.POSITION_BEFORE_START);
          g.remove()
        }
        d = d.clone();
        g = a.editable();
        d.setEndAt(g, CKEDITOR.POSITION_BEFORE_END);
        d = new CKEDITOR.dom.walker(d);
        d.evaluator = function(a) { return f(a) && !n(a) };
        (d = d.next()) && d.type == CKEDITOR.NODE_ELEMENT && d.getName() in CKEDITOR.dtd.$list && c(d);
        e.moveToBookmark(h);
        e.select();
        a.fire("saveSnapshot")
      }

      function k(a) { return (a = a.getLast(f)) && a.type == CKEDITOR.NODE_ELEMENT && a.getName() in e ? a : null }
      var e = { ol: 1, ul: 1 },
        h = CKEDITOR.dom.walker.whitespaces(),
        m = CKEDITOR.dom.walker.bookmark(),
        f = function(a) { return !(h(a) || m(a)) },
        n = CKEDITOR.dom.walker.bogus();
      CKEDITOR.plugins.list = {
        listToArray: function(a, b, c, d, f) {
          if (!e[a.getName()]) return [];
          d || (d = 0);
          c || (c = []);
          for (var g = 0, h = a.getChildCount(); g < h; g++) {
            var k = a.getChild(g);
            k.type == CKEDITOR.NODE_ELEMENT && k.getName() in CKEDITOR.dtd.$list && CKEDITOR.plugins.list.listToArray(k, b, c, d + 1);
            if ("li" == k.$.nodeName.toLowerCase()) {
              var l = { parent: a, indent: d, element: k, contents: [] };
              f ? l.grandparent = f : (l.grandparent = a.getParent(), l.grandparent && "li" == l.grandparent.$.nodeName.toLowerCase() &&
                (l.grandparent = l.grandparent.getParent()));
              b && CKEDITOR.dom.element.setMarker(b, k, "listarray_index", c.length);
              c.push(l);
              for (var m = 0, n = k.getChildCount(), p; m < n; m++) p = k.getChild(m), p.type == CKEDITOR.NODE_ELEMENT && e[p.getName()] ? CKEDITOR.plugins.list.listToArray(p, b, c, d + 1, l.grandparent) : l.contents.push(p)
            }
          }
          return c
        },
        arrayToList: function(a, b, c, d, g) {
          c || (c = 0);
          if (!a || a.length < c + 1) return null;
          for (var h, k = a[c].parent.getDocument(), l = new CKEDITOR.dom.documentFragment(k), n = null, p = c, A = Math.max(a[c].indent, 0), q =
              null, D, F, I = d == CKEDITOR.ENTER_P ? "p" : "div";;) {
            var H = a[p];
            h = H.grandparent;
            D = H.element.getDirection(1);
            if (H.indent == A) { n && a[p].parent.getName() == n.getName() || (n = a[p].parent.clone(!1, 1), g && n.setAttribute("dir", g), l.append(n));
              q = n.append(H.element.clone(0, 1));
              D != n.getDirection(1) && q.setAttribute("dir", D); for (h = 0; h < H.contents.length; h++) q.append(H.contents[h].clone(1, 1));
              p++ } else if (H.indent == Math.max(A, 0) + 1) H = a[p - 1].element.getDirection(1), p = CKEDITOR.plugins.list.arrayToList(a, null, p, d, H != D ? D : null), !q.getChildCount() &&
              CKEDITOR.env.needsNbspFiller && 7 >= k.$.documentMode && q.append(k.createText(" ")), q.append(p.listNode), p = p.nextIndex;
            else if (-1 == H.indent && !c && h) {
              e[h.getName()] ? (q = H.element.clone(!1, !0), D != h.getDirection(1) && q.setAttribute("dir", D)) : q = new CKEDITOR.dom.documentFragment(k);
              var n = h.getDirection(1) != D,
                K = H.element,
                J = K.getAttribute("class"),
                E = K.getAttribute("style"),
                R = q.type == CKEDITOR.NODE_DOCUMENT_FRAGMENT && (d != CKEDITOR.ENTER_BR || n || E || J),
                O, S = H.contents.length,
                L;
              for (h = 0; h < S; h++)
                if (O = H.contents[h], m(O) &&
                  1 < S) R ? L = O.clone(1, 1) : q.append(O.clone(1, 1));
                else if (O.type == CKEDITOR.NODE_ELEMENT && O.isBlockBoundary()) { n && !O.getDirection() && O.setAttribute("dir", D);
                F = O; var V = K.getAttribute("style");
                V && F.setAttribute("style", V.replace(/([^;])$/, "$1;") + (F.getAttribute("style") || ""));
                J && O.addClass(J);
                F = null;
                L && (q.append(L), L = null);
                q.append(O.clone(1, 1)) } else R ? (F || (F = k.createElement(I), q.append(F), n && F.setAttribute("dir", D)), E && F.setAttribute("style", E), J && F.setAttribute("class", J), L && (F.append(L), L = null), F.append(O.clone(1,
                1))) : q.append(O.clone(1, 1));
              L && ((F || q).append(L), L = null);
              q.type == CKEDITOR.NODE_DOCUMENT_FRAGMENT && p != a.length - 1 && (CKEDITOR.env.needsBrFiller && (D = q.getLast()) && D.type == CKEDITOR.NODE_ELEMENT && D.is("br") && D.remove(), (D = q.getLast(f)) && D.type == CKEDITOR.NODE_ELEMENT && D.is(CKEDITOR.dtd.$block) || q.append(k.createElement("br")));
              D = q.$.nodeName.toLowerCase();
              "div" != D && "p" != D || q.appendBogus();
              l.append(q);
              n = null;
              p++
            } else return null;
            F = null;
            if (a.length <= p || Math.max(a[p].indent, 0) < A) break
          }
          if (b)
            for (a = l.getFirst(); a;) {
              if (a.type ==
                CKEDITOR.NODE_ELEMENT && (CKEDITOR.dom.element.clearMarkers(b, a), a.getName() in CKEDITOR.dtd.$listItem && (c = a, k = g = d = void 0, d = c.getDirection()))) { for (g = c.getParent(); g && !(k = g.getDirection());) g = g.getParent();
                d == k && c.removeAttribute("dir") } a = a.getNextSourceNode()
            }
          return { listNode: l, nextIndex: p }
        }
      };
      var p = /^h[1-6]$/,
        q = CKEDITOR.dom.walker.nodeType(CKEDITOR.NODE_ELEMENT);
      d.prototype = {
        exec: function(b) {
          this.refresh(b, b.elementPath());
          var d = b.config,
            g = b.getSelection(),
            h = g && g.getRanges();
          if (this.state == CKEDITOR.TRISTATE_OFF) {
            var k =
              b.editable();
            if (k.getFirst(f)) { var l = 1 == h.length && h[0];
              (d = l && l.getEnclosedNode()) && d.is && this.type == d.getName() && this.setState(CKEDITOR.TRISTATE_ON) } else d.enterMode == CKEDITOR.ENTER_BR ? k.appendBogus() : h[0].fixBlock(1, d.enterMode == CKEDITOR.ENTER_P ? "p" : "div"), g.selectRanges(h)
          }
          for (var d = g.createBookmarks(!0), k = [], m = {}, h = h.createIterator(), n = 0;
            (l = h.getNextRange()) && ++n;) {
            var q = l.getBoundaryNodes(),
              z = q.startNode,
              A = q.endNode;
            z.type == CKEDITOR.NODE_ELEMENT && "td" == z.getName() && l.setStartAt(q.startNode, CKEDITOR.POSITION_AFTER_START);
            A.type == CKEDITOR.NODE_ELEMENT && "td" == A.getName() && l.setEndAt(q.endNode, CKEDITOR.POSITION_BEFORE_END);
            l = l.createIterator();
            for (l.forceBrBreak = this.state == CKEDITOR.TRISTATE_OFF; q = l.getNextParagraph();)
              if (!q.getCustomData("list_block")) {
                CKEDITOR.dom.element.setMarker(m, q, "list_block", 1);
                for (var G = b.elementPath(q), z = G.elements, A = 0, G = G.blockLimit, D, F = z.length - 1; 0 <= F && (D = z[F]); F--)
                  if (e[D.getName()] && G.contains(D)) {
                    G.removeCustomData("list_group_object_" + n);
                    (z = D.getCustomData("list_group_object")) ? z.contents.push(q):
                      (z = { root: D, contents: [q] }, k.push(z), CKEDITOR.dom.element.setMarker(m, D, "list_group_object", z));
                    A = 1;
                    break
                  }
                A || (A = G, A.getCustomData("list_group_object_" + n) ? A.getCustomData("list_group_object_" + n).contents.push(q) : (z = { root: A, contents: [q] }, CKEDITOR.dom.element.setMarker(m, A, "list_group_object_" + n, z), k.push(z)))
              }
          }
          for (D = []; 0 < k.length;)
            if (z = k.shift(), this.state == CKEDITOR.TRISTATE_OFF)
              if (e[z.root.getName()]) {
                h = b;
                n = z;
                z = m;
                l = D;
                A = CKEDITOR.plugins.list.listToArray(n.root, z);
                G = [];
                for (q = 0; q < n.contents.length; q++) F =
                  n.contents[q], (F = F.getAscendant("li", !0)) && !F.getCustomData("list_item_processed") && (G.push(F), CKEDITOR.dom.element.setMarker(z, F, "list_item_processed", !0));
                for (var F = n.root.getDocument(), I = void 0, H = void 0, q = 0; q < G.length; q++) { var K = G[q].getCustomData("listarray_index"),
                    I = A[K].parent;
                  I.is(this.type) || (H = F.createElement(this.type), I.copyAttributes(H, { start: 1, type: 1 }), H.removeStyle("list-style-type"), A[K].parent = H) } z = CKEDITOR.plugins.list.arrayToList(A, z, null, h.config.enterMode);
                A = void 0;
                G = z.listNode.getChildCount();
                for (q = 0; q < G && (A = z.listNode.getChild(q)); q++) A.getName() == this.type && l.push(A);
                z.listNode.replace(n.root);
                h.fire("contentDomInvalidated")
              } else {
                A = b;
                l = z;
                q = D;
                G = l.contents;
                h = l.root.getDocument();
                n = [];
                1 == G.length && G[0].equals(l.root) && (z = h.createElement("div"), G[0].moveChildren && G[0].moveChildren(z), G[0].append(z), G[0] = z);
                l = l.contents[0].getParent();
                for (F = 0; F < G.length; F++) l = l.getCommonAncestor(G[F].getParent());
                I = A.config.useComputedState;
                A = z = void 0;
                I = void 0 === I || I;
                for (F = 0; F < G.length; F++)
                  for (H = G[F]; K = H.getParent();) {
                    if (K.equals(l)) {
                      n.push(H);
                      !A && H.getDirection() && (A = 1);
                      H = H.getDirection(I);
                      null !== z && (z = z && z != H ? null : H);
                      break
                    }
                    H = K
                  }
                if (!(1 > n.length)) {
                  G = n[n.length - 1].getNext();
                  F = h.createElement(this.type);
                  q.push(F);
                  for (I = q = void 0; n.length;) q = n.shift(), I = h.createElement("li"), H = q, H.is("pre") || p.test(H.getName()) || "false" == H.getAttribute("contenteditable") ? q.appendTo(I) : (q.copyAttributes(I), z && q.getDirection() && (I.removeStyle("direction"), I.removeAttribute("dir")), q.moveChildren(I), q.remove()), I.appendTo(F);
                  z && A && F.setAttribute("dir", z);
                  G ? F.insertBefore(G) :
                    F.appendTo(l)
                }
              }
          else this.state == CKEDITOR.TRISTATE_ON && e[z.root.getName()] && a.call(this, b, z, m);
          for (F = 0; F < D.length; F++) c(D[F]);
          CKEDITOR.dom.element.clearAllMarkers(m);
          g.selectBookmarks(d);
          b.focus()
        },
        refresh: function(a, b) { var c = b.contains(e, 1),
            d = b.blockLimit || b.root;
          c && d.contains(c) ? this.setState(c.is(this.type) ? CKEDITOR.TRISTATE_ON : CKEDITOR.TRISTATE_OFF) : this.setState(CKEDITOR.TRISTATE_OFF) }
      };
      CKEDITOR.plugins.add("list", {
        requires: "indentlist",
        init: function(a) {
          a.blockless || (a.addCommand("numberedlist",
            new d("numberedlist", "ol")), a.addCommand("bulletedlist", new d("bulletedlist", "ul")), a.ui.addButton && (a.ui.addButton("NumberedList", { label: a.lang.list.numberedlist, command: "numberedlist", directional: !0, toolbar: "list,10" }), a.ui.addButton("BulletedList", { label: a.lang.list.bulletedlist, command: "bulletedlist", directional: !0, toolbar: "list,20" })), a.on("key", function(b) {
            var c = b.data.domEvent.getKey(),
              d;
            if ("wysiwyg" == a.mode && c in { 8: 1, 46: 1 }) {
              var h = a.getSelection().getRanges()[0],
                m = h && h.startPath();
              if (h && h.collapsed) {
                var p =
                  8 == c,
                  q = a.editable(),
                  C = new CKEDITOR.dom.walker(h.clone());
                C.evaluator = function(a) { return f(a) && !n(a) };
                C.guard = function(a, b) { return !(b && a.type == CKEDITOR.NODE_ELEMENT && a.is("table")) };
                c = h.clone();
                if (p) {
                  var z;
                  (z = m.contains(e)) && h.checkBoundaryOfElement(z, CKEDITOR.START) && (z = z.getParent()) && z.is("li") && (z = k(z)) ? (d = z, z = z.getPrevious(f), c.moveToPosition(z && n(z) ? z : d, CKEDITOR.POSITION_BEFORE_START)) : (C.range.setStartAt(q, CKEDITOR.POSITION_AFTER_START), C.range.setEnd(h.startContainer, h.startOffset), (z = C.previous()) &&
                    z.type == CKEDITOR.NODE_ELEMENT && (z.getName() in e || z.is("li")) && (z.is("li") || (C.range.selectNodeContents(z), C.reset(), C.evaluator = g, z = C.previous()), d = z, c.moveToElementEditEnd(d), c.moveToPosition(c.endPath().block, CKEDITOR.POSITION_BEFORE_END)));
                  if (d) l(a, c, h), b.cancel();
                  else { var A = m.contains(e);
                    A && h.checkBoundaryOfElement(A, CKEDITOR.START) && (d = A.getFirst(f), h.checkBoundaryOfElement(d, CKEDITOR.START) && (z = A.getPrevious(f), k(d) ? z && (h.moveToElementEditEnd(z), h.select()) : a.execCommand("outdent"), b.cancel())) }
                } else if (d =
                  m.contains("li")) {
                  if (C.range.setEndAt(q, CKEDITOR.POSITION_BEFORE_END), p = (q = d.getLast(f)) && g(q) ? q : d, m = 0, (z = C.next()) && z.type == CKEDITOR.NODE_ELEMENT && z.getName() in e && z.equals(q) ? (m = 1, z = C.next()) : h.checkBoundaryOfElement(p, CKEDITOR.END) && (m = 2), m && z) {
                    h = h.clone();
                    h.moveToElementEditStart(z);
                    if (1 == m && (c.optimize(), !c.startContainer.equals(d))) { for (d = c.startContainer; d.is(CKEDITOR.dtd.$inline);) A = d, d = d.getParent();
                      A && c.moveToPosition(A, CKEDITOR.POSITION_AFTER_END) } 2 == m && (c.moveToPosition(c.endPath().block,
                      CKEDITOR.POSITION_BEFORE_END), h.endPath().block && h.moveToPosition(h.endPath().block, CKEDITOR.POSITION_AFTER_START));
                    l(a, c, h);
                    b.cancel()
                  }
                } else C.range.setEndAt(q, CKEDITOR.POSITION_BEFORE_END), (z = C.next()) && z.type == CKEDITOR.NODE_ELEMENT && z.is(e) && (z = z.getFirst(f), m.block && h.checkStartOfBlock() && h.checkEndOfBlock() ? (m.block.remove(), h.moveToElementEditStart(z), h.select()) : k(z) ? (h.moveToElementEditStart(z), h.select()) : (h = h.clone(), h.moveToElementEditStart(z), l(a, c, h)), b.cancel());
                setTimeout(function() { a.selectionChange(1) })
              }
            }
          }))
        }
      })
    }(),
    function() {
      CKEDITOR.plugins.liststyle = {
        requires: "dialog,contextmenu",
        init: function(a) {
          if (!a.blockless) {
            var d;
            d = new CKEDITOR.dialogCommand("numberedListStyle", { requiredContent: "ol", allowedContent: "ol{list-style-type}[start]; li{list-style-type}[value]", contentTransformations: [
                ["ol: listTypeToStyle"]
              ] });
            d = a.addCommand("numberedListStyle", d);
            a.addFeature(d);
            CKEDITOR.dialog.add("numberedListStyle", this.path + "dialogs/liststyle.js");
            d = new CKEDITOR.dialogCommand("bulletedListStyle", {
              requiredContent: "ul",
              allowedContent: "ul{list-style-type}",
              contentTransformations: [
                ["ul: listTypeToStyle"]
              ]
            });
            d = a.addCommand("bulletedListStyle", d);
            a.addFeature(d);
            CKEDITOR.dialog.add("bulletedListStyle", this.path + "dialogs/liststyle.js");
            a.addMenuGroup("list", 108);
            a.addMenuItems({ numberedlist: { label: a.lang.liststyle.numberedTitle, group: "list", command: "numberedListStyle" }, bulletedlist: { label: a.lang.liststyle.bulletedTitle, group: "list", command: "bulletedListStyle" } });
            a.contextMenu.addListener(function(a) {
              if (!a || a.isReadOnly()) return null;
              for (; a;) { var c = a.getName(); if ("ol" == c) return { numberedlist: CKEDITOR.TRISTATE_OFF }; if ("ul" == c) return { bulletedlist: CKEDITOR.TRISTATE_OFF };
                a = a.getParent() }
              return null
            })
          }
        }
      };
      CKEDITOR.plugins.add("liststyle", CKEDITOR.plugins.liststyle)
    }(), "use strict",
    function() {
      function a(a, b, c) { return n(b) && n(c) && c.equals(b.getNext(function(a) { return !(aa(a) || ba(a) || p(a)) })) }

      function d(a) { this.upper = a[0];
        this.lower = a[1];
        this.set.apply(this, a.slice(2)) }

      function b(a) {
        var b = a.element;
        if (b && n(b) && (b = b.getAscendant(a.triggers, !0)) && a.editable.contains(b)) { var c = k(b); if ("true" == c.getAttribute("contenteditable")) return b; if (c.is(a.triggers)) return c }
        return null
      }

      function c(a, b, c) { x(a, b);
        x(a, c);
        a = b.size.bottom;
        c = c.size.top; return a && c ? 0 | (a + c) / 2 : a || c }

      function g(a, b, c) { return b = b[c ? "getPrevious" : "getNext"](function(b) { return b && b.type == CKEDITOR.NODE_TEXT && !aa(b) || n(b) && !p(b) && !f(a, b) }) }

      function l(a, b, c) { return a > b && a < c }

      function k(a, b) {
        if (a.data("cke-editable")) return null;
        for (b || (a = a.getParent()); a && !a.data("cke-editable");) {
          if (a.hasAttribute("contenteditable")) return a;
          a = a.getParent()
        }
        return null
      }

      function e(a) {
        var b = a.doc,
          c = D('\x3cspan contenteditable\x3d"false" data-cke-magic-line\x3d"1" style\x3d"' + U + "position:absolute;border-top:1px dashed " + a.boxColor + '"\x3e\x3c/span\x3e', b),
          e = CKEDITOR.getUrl(this.path + "images/" + (F.hidpi ? "hidpi/" : "") + "icon" + (a.rtl ? "-rtl" : "") + ".png");
        A(c, {
          attach: function() { this.wrap.getParent() || this.wrap.appendTo(a.editable, !0); return this },
          lineChildren: [A(D('\x3cspan title\x3d"' + a.editor.lang.magicline.title + '" contenteditable\x3d"false"\x3e\x26#8629;\x3c/span\x3e',
            b), { base: U + "height:17px;width:17px;" + (a.rtl ? "left" : "right") + ":17px;background:url(" + e + ") center no-repeat " + a.boxColor + ";cursor:pointer;" + (F.hc ? "font-size: 15px;line-height:14px;border:1px solid #fff;text-align:center;" : "") + (F.hidpi ? "background-size: 9px 10px;" : ""), looks: ["top:-8px; border-radius: 2px;", "top:-17px; border-radius: 2px 2px 0px 0px;", "top:-1px; border-radius: 0px 0px 2px 2px;"] }), A(D(N, b), {
            base: T + "left:0px;border-left-color:" + a.boxColor + ";",
            looks: ["border-width:8px 0 8px 8px;top:-8px",
              "border-width:8px 0 0 8px;top:-8px", "border-width:0 0 8px 8px;top:0px"
            ]
          }), A(D(N, b), { base: T + "right:0px;border-right-color:" + a.boxColor + ";", looks: ["border-width:8px 8px 8px 0;top:-8px", "border-width:8px 8px 0 0;top:-8px", "border-width:0 8px 8px 0;top:0px"] })],
          detach: function() { this.wrap.getParent() && this.wrap.remove(); return this },
          mouseNear: function() { x(a, this); var b = a.holdDistance,
              c = this.size; return c && l(a.mouse.y, c.top - b, c.bottom + b) && l(a.mouse.x, c.left - b, c.right + b) ? !0 : !1 },
          place: function() {
            var b = a.view,
              c = a.editable,
              e = a.trigger,
              d = e.upper,
              f = e.lower,
              g = d || f,
              h = g.getParent(),
              k = {};
            this.trigger = e;
            d && x(a, d, !0);
            f && x(a, f, !0);
            x(a, h, !0);
            a.inInlineMode && y(a, !0);
            h.equals(c) ? (k.left = b.scroll.x, k.right = -b.scroll.x, k.width = "") : (k.left = g.size.left - g.size.margin.left + b.scroll.x - (a.inInlineMode ? b.editable.left + b.editable.border.left : 0), k.width = g.size.outerWidth + g.size.margin.left + g.size.margin.right + b.scroll.x, k.right = "");
            d && f ? k.top = d.size.margin.bottom === f.size.margin.top ? 0 | d.size.bottom + d.size.margin.bottom / 2 : d.size.margin.bottom <
              f.size.margin.top ? d.size.bottom + d.size.margin.bottom : d.size.bottom + d.size.margin.bottom - f.size.margin.top : d ? f || (k.top = d.size.bottom + d.size.margin.bottom) : k.top = f.size.top - f.size.margin.top;
            e.is(S) || l(k.top, b.scroll.y - 15, b.scroll.y + 5) ? (k.top = a.inInlineMode ? 0 : b.scroll.y, this.look(S)) : e.is(L) || l(k.top, b.pane.bottom - 5, b.pane.bottom + 15) ? (k.top = a.inInlineMode ? b.editable.height + b.editable.padding.top + b.editable.padding.bottom : b.pane.bottom - 1, this.look(L)) : (a.inInlineMode && (k.top -= b.editable.top + b.editable.border.top),
              this.look(V));
            a.inInlineMode && (k.top--, k.top += b.editable.scroll.top, k.left += b.editable.scroll.left);
            for (var m in k) k[m] = CKEDITOR.tools.cssLength(k[m]);
            this.setStyles(k)
          },
          look: function(a) { if (this.oldLook != a) { for (var b = this.lineChildren.length, c; b--;)(c = this.lineChildren[b]).setAttribute("style", c.base + c.looks[0 | a / 2]);
              this.oldLook = a } },
          wrap: new G("span", a.doc)
        });
        for (b = c.lineChildren.length; b--;) c.lineChildren[b].appendTo(c);
        c.look(V);
        c.appendTo(c.wrap);
        c.unselectable();
        c.lineChildren[0].on("mouseup",
          function(b) { c.detach();
            h(a, function(b) { var c = a.line.trigger;
              b[c.is(J) ? "insertBefore" : "insertAfter"](c.is(J) ? c.lower : c.upper) }, !0);
            a.editor.focus();
            F.ie || a.enterMode == CKEDITOR.ENTER_BR || a.hotNode.scrollIntoView();
            b.data.preventDefault(!0) });
        c.on("mousedown", function(a) { a.data.preventDefault(!0) });
        a.line = c
      }

      function h(a, b, c) {
        var e = new CKEDITOR.dom.range(a.doc),
          d = a.editor,
          f;
        F.ie && a.enterMode == CKEDITOR.ENTER_BR ? f = a.doc.createText(Z) : (f = (f = k(a.element, !0)) && f.data("cke-enter-mode") || a.enterMode, f = new G(K[f],
          a.doc), f.is("br") || a.doc.createText(Z).appendTo(f));
        c && d.fire("saveSnapshot");
        b(f);
        e.moveToPosition(f, CKEDITOR.POSITION_AFTER_START);
        d.getSelection().selectRanges([e]);
        a.hotNode = f;
        c && d.fire("saveSnapshot")
      }

      function m(a, c) {
        return {
          canUndo: !0,
          modes: { wysiwyg: 1 },
          exec: function() {
            function e(b) {
              var d = F.ie && 9 > F.version ? " " : Z,
                f = a.hotNode && a.hotNode.getText() == d && a.element.equals(a.hotNode) && a.lastCmdDirection === !!c;
              h(a, function(e) {
                f && a.hotNode && a.hotNode.remove();
                e[c ? "insertAfter" : "insertBefore"](b);
                e.setAttributes({
                  "data-cke-magicline-hot": 1,
                  "data-cke-magicline-dir": !!c
                });
                a.lastCmdDirection = !!c
              });
              F.ie || a.enterMode == CKEDITOR.ENTER_BR || a.hotNode.scrollIntoView();
              a.line.detach()
            }
            return function(d) {
              d = d.getSelection().getStartElement();
              var f;
              d = d.getAscendant(Q, 1);
              if (!v(a, d) && d && !d.equals(a.editable) && !d.contains(a.editable)) {
                (f = k(d)) && "false" == f.getAttribute("contenteditable") && (d = f);
                a.element = d;
                f = g(a, d, !c);
                var h;
                n(f) && f.is(a.triggers) && f.is(P) && (!g(a, f, !c) || (h = g(a, f, !c)) && n(h) && h.is(a.triggers)) ? e(f) : (h = b(a, d), n(h) && (g(a, h, !c) ? (d = g(a, h, !c)) &&
                  n(d) && d.is(a.triggers) && e(h) : e(h)))
              }
            }
          }()
        }
      }

      function f(a, b) { if (!b || b.type != CKEDITOR.NODE_ELEMENT || !b.$) return !1; var c = a.line; return c.wrap.equals(b) || c.wrap.contains(b) }

      function n(a) { return a && a.type == CKEDITOR.NODE_ELEMENT && a.$ }

      function p(a) { if (!n(a)) return !1; var b;
        (b = q(a)) || (n(a) ? (b = { left: 1, right: 1, center: 1 }, b = !(!b[a.getComputedStyle("float")] && !b[a.getAttribute("align")])) : b = !1); return b }

      function q(a) { return !!{ absolute: 1, fixed: 1 }[a.getComputedStyle("position")] }

      function w(a, b) {
        return n(b) ? b.is(a.triggers) :
          null
      }

      function v(a, b) { if (!b) return !1; for (var c = b.getParents(1), e = c.length; e--;)
          for (var d = a.tabuList.length; d--;)
            if (c[e].hasAttribute(a.tabuList[d])) return !0; return !1 }

      function t(a, b, c) { b = b[c ? "getLast" : "getFirst"](function(b) { return a.isRelevant(b) && !b.is(da) }); if (!b) return !1;
        x(a, b); return c ? b.size.top > a.mouse.y : b.size.bottom < a.mouse.y }

      function u(a) {
        var b = a.editable,
          c = a.mouse,
          e = a.view,
          g = a.triggerOffset;
        y(a);
        var h = c.y > (a.inInlineMode ? e.editable.top + e.editable.height / 2 : Math.min(e.editable.height, e.pane.height) /
            2),
          b = b[h ? "getLast" : "getFirst"](function(a) { return !(aa(a) || ba(a)) });
        if (!b) return null;
        f(a, b) && (b = a.line.wrap[h ? "getPrevious" : "getNext"](function(a) { return !(aa(a) || ba(a)) }));
        if (!n(b) || p(b) || !w(a, b)) return null;
        x(a, b);
        return !h && 0 <= b.size.top && l(c.y, 0, b.size.top + g) ? (a = a.inInlineMode || 0 === e.scroll.y ? S : V, new d([null, b, J, O, a])) : h && b.size.bottom <= e.pane.height && l(c.y, b.size.bottom - g, e.pane.height) ? (a = a.inInlineMode || l(b.size.bottom, e.pane.height - g, e.pane.height) ? L : V, new d([b, null, E, O, a])) : null
      }

      function r(a) {
        var c =
          a.mouse,
          e = a.view,
          f = a.triggerOffset,
          h = b(a);
        if (!h) return null;
        x(a, h);
        var f = Math.min(f, 0 | h.size.outerHeight / 2),
          k = [],
          m, N;
        if (l(c.y, h.size.top - 1, h.size.top + f)) N = !1;
        else if (l(c.y, h.size.bottom - f, h.size.bottom + 1)) N = !0;
        else return null;
        if (p(h) || t(a, h, N) || h.getParent().is(X)) return null;
        var r = g(a, h, !N);
        if (r) { if (r && r.type == CKEDITOR.NODE_TEXT) return null; if (n(r)) { if (p(r) || !w(a, r) || r.getParent().is(X)) return null;
            k = [r, h][N ? "reverse" : "concat"]().concat([R, O]) } } else h.equals(a.editable[N ? "getLast" : "getFirst"](a.isRelevant)) ?
          (y(a), N && l(c.y, h.size.bottom - f, e.pane.height) && l(h.size.bottom, e.pane.height - f, e.pane.height) ? m = L : l(c.y, 0, h.size.top + f) && (m = S)) : m = V, k = [null, h][N ? "reverse" : "concat"]().concat([N ? E : J, O, m, h.equals(a.editable[N ? "getLast" : "getFirst"](a.isRelevant)) ? N ? L : S : V]);
        return 0 in k ? new d(k) : null
      }

      function B(a, b, c, e) {
        for (var d = b.getDocumentPosition(), f = {}, g = {}, h = {}, k = {}, l = ca.length; l--;) f[ca[l]] = parseInt(b.getComputedStyle.call(b, "border-" + ca[l] + "-width"), 10) || 0, h[ca[l]] = parseInt(b.getComputedStyle.call(b, "padding-" +
          ca[l]), 10) || 0, g[ca[l]] = parseInt(b.getComputedStyle.call(b, "margin-" + ca[l]), 10) || 0;
        c && !e || C(a, e);
        k.top = d.y - (c ? 0 : a.view.scroll.y);
        k.left = d.x - (c ? 0 : a.view.scroll.x);
        k.outerWidth = b.$.offsetWidth;
        k.outerHeight = b.$.offsetHeight;
        k.height = k.outerHeight - (h.top + h.bottom + f.top + f.bottom);
        k.width = k.outerWidth - (h.left + h.right + f.left + f.right);
        k.bottom = k.top + k.outerHeight;
        k.right = k.left + k.outerWidth;
        a.inInlineMode && (k.scroll = { top: b.$.scrollTop, left: b.$.scrollLeft });
        return A({ border: f, padding: h, margin: g, ignoreScroll: c },
          k, !0)
      }

      function x(a, b, c) { if (!n(b)) return b.size = null; if (!b.size) b.size = {};
        else if (b.size.ignoreScroll == c && b.size.date > new Date - M) return null; return A(b.size, B(a, b, c), { date: +new Date }, !0) }

      function y(a, b) { a.view.editable = B(a, a.editable, b, !0) }

      function C(a, b) {
        a.view || (a.view = {});
        var c = a.view;
        if (!(!b && c && c.date > new Date - M)) {
          var e = a.win,
            c = e.getScrollPosition(),
            e = e.getViewPaneSize();
          A(a.view, {
            scroll: {
              x: c.x,
              y: c.y,
              width: a.doc.$.documentElement.scrollWidth - e.width,
              height: a.doc.$.documentElement.scrollHeight -
                e.height
            },
            pane: { width: e.width, height: e.height, bottom: e.height + c.y },
            date: +new Date
          }, !0)
        }
      }

      function z(a, b, c, e) { for (var f = e, g = e, h = 0, k = !1, l = !1, m = a.view.pane.height, n = a.mouse; n.y + h < m && 0 < n.y - h;) { k || (k = b(f, e));
          l || (l = b(g, e));!k && 0 < n.y - h && (f = c(a, { x: n.x, y: n.y - h }));!l && n.y + h < m && (g = c(a, { x: n.x, y: n.y + h })); if (k && l) break;
          h += 2 } return new d([f, g, null, null]) } CKEDITOR.plugins.add("magicline", {
        init: function(a) {
          var c = a.config,
            k = c.magicline_triggerOffset || 30,
            l = {
              editor: a,
              enterMode: c.enterMode,
              triggerOffset: k,
              holdDistance: 0 |
                k * (c.magicline_holdDistance || .5),
              boxColor: c.magicline_color || "#ff0000",
              rtl: "rtl" == c.contentsLangDirection,
              tabuList: ["data-cke-hidden-sel"].concat(c.magicline_tabuList || []),
              triggers: c.magicline_everywhere ? Q : { table: 1, hr: 1, div: 1, ul: 1, ol: 1, dl: 1, form: 1, blockquote: 1 }
            },
            N, t, z;
          l.isRelevant = function(a) { return n(a) && !f(l, a) && !p(a) };
          a.on("contentDom", function() {
            var k = a.editable(),
              n = a.document,
              p = a.window;
            A(l, { editable: k, inInlineMode: k.isInline(), doc: n, win: p, hotNode: null }, !0);
            l.boundary = l.inInlineMode ? l.editable :
              l.doc.getDocumentElement();
            k.is(H.$inline) || (l.inInlineMode && !q(k) && k.setStyles({ position: "relative", top: null, left: null }), e.call(this, l), C(l), k.attachListener(a, "beforeUndoImage", function() { l.line.detach() }), k.attachListener(a, "beforeGetData", function() { l.line.wrap.getParent() && (l.line.detach(), a.once("getData", function() { l.line.attach() }, null, null, 1E3)) }, null, null, 0), k.attachListener(l.inInlineMode ? n : n.getWindow().getFrame(), "mouseout", function(b) {
              if ("wysiwyg" == a.mode)
                if (l.inInlineMode) {
                  var c = b.data.$.clientX;
                  b = b.data.$.clientY;
                  C(l);
                  y(l, !0);
                  var e = l.view.editable,
                    d = l.view.scroll;
                  c > e.left - d.x && c < e.right - d.x && b > e.top - d.y && b < e.bottom - d.y || (clearTimeout(z), z = null, l.line.detach())
                } else clearTimeout(z), z = null, l.line.detach()
            }), k.attachListener(k, "keyup", function() { l.hiddenMode = 0 }), k.attachListener(k, "keydown", function(b) { if ("wysiwyg" == a.mode) switch (b.data.getKeystroke()) {
                case 2228240:
                case 16:
                  l.hiddenMode = 1, l.line.detach() } }), k.attachListener(l.inInlineMode ? k : n, "mousemove", function(b) {
              t = !0;
              if ("wysiwyg" == a.mode &&
                !a.readOnly && !z) { var c = { x: b.data.$.clientX, y: b.data.$.clientY };
                z = setTimeout(function() { l.mouse = c;
                  z = l.trigger = null;
                  C(l);
                  t && !l.hiddenMode && a.focusManager.hasFocus && !l.line.mouseNear() && (l.element = W(l, !0)) && ((l.trigger = u(l) || r(l) || Y(l)) && !v(l, l.trigger.upper || l.trigger.lower) ? l.line.attach().place() : (l.trigger = null, l.line.detach()), t = !1) }, 30) }
            }), k.attachListener(p, "scroll", function() {
              "wysiwyg" == a.mode && (l.line.detach(), F.webkit && (l.hiddenMode = 1, clearTimeout(N), N = setTimeout(function() {
                l.mouseDown || (l.hiddenMode =
                  0)
              }, 50)))
            }), k.attachListener(I ? n : p, "mousedown", function() { "wysiwyg" == a.mode && (l.line.detach(), l.hiddenMode = 1, l.mouseDown = 1) }), k.attachListener(I ? n : p, "mouseup", function() { l.hiddenMode = 0;
              l.mouseDown = 0 }), a.addCommand("accessPreviousSpace", m(l)), a.addCommand("accessNextSpace", m(l, !0)), a.setKeystroke([
              [c.magicline_keystrokePrevious, "accessPreviousSpace"],
              [c.magicline_keystrokeNext, "accessNextSpace"]
            ]), a.on("loadSnapshot", function() {
              var b, c, e, d;
              for (d in { p: 1, br: 1, div: 1 })
                for (b = a.document.getElementsByTag(d),
                  e = b.count(); e--;)
                  if ((c = b.getItem(e)).data("cke-magicline-hot")) { l.hotNode = c;
                    l.lastCmdDirection = "true" === c.data("cke-magicline-dir") ? !0 : !1; return }
            }), this.backdoor = { accessFocusSpace: h, boxTrigger: d, isLine: f, getAscendantTrigger: b, getNonEmptyNeighbour: g, getSize: B, that: l, triggerEdge: r, triggerEditable: u, triggerExpand: Y })
          }, this)
        }
      });
      var A = CKEDITOR.tools.extend,
        G = CKEDITOR.dom.element,
        D = G.createFromHtml,
        F = CKEDITOR.env,
        I = CKEDITOR.env.ie && 9 > CKEDITOR.env.version,
        H = CKEDITOR.dtd,
        K = {},
        J = 128,
        E = 64,
        R = 32,
        O = 16,
        S = 4,
        L = 2,
        V = 1,
        Z = " ",
        X = H.$listItem,
        da = H.$tableContent,
        P = A({}, H.$nonEditable, H.$empty),
        Q = H.$block,
        M = 100,
        U = "width:0px;height:0px;padding:0px;margin:0px;display:block;z-index:9999;color:#fff;position:absolute;font-size: 0px;line-height:0px;",
        T = U + "border-color:transparent;display:block;border-style:solid;",
        N = "\x3cspan\x3e" + Z + "\x3c/span\x3e";
      K[CKEDITOR.ENTER_BR] = "br";
      K[CKEDITOR.ENTER_P] = "p";
      K[CKEDITOR.ENTER_DIV] = "div";
      d.prototype = {
        set: function(a, b, c) { this.properties = a + b + (c || V); return this },
        is: function(a) {
          return (this.properties &
            a) == a
        }
      };
      var W = function() {
          function a(b, c) { var e = b.$.elementFromPoint(c.x, c.y); return e && e.nodeType ? new CKEDITOR.dom.element(e) : null } return function(b, c, e) { if (!b.mouse) return null; var d = b.doc,
              g = b.line.wrap;
            e = e || b.mouse; var h = a(d, e);
            c && f(b, h) && (g.hide(), h = a(d, e), g.show()); return !h || h.type != CKEDITOR.NODE_ELEMENT || !h.$ || F.ie && 9 > F.version && !b.boundary.equals(h) && !b.boundary.contains(h) ? null : h } }(),
        aa = CKEDITOR.dom.walker.whitespaces(),
        ba = CKEDITOR.dom.walker.nodeType(CKEDITOR.NODE_COMMENT),
        Y = function() {
          function b(d) {
            var f =
              d.element,
              g, h, k;
            if (!n(f) || f.contains(d.editable) || f.isReadOnly()) return null;
            k = z(d, function(a, b) { return !b.equals(a) }, function(a, b) { return W(a, !0, b) }, f);
            g = k.upper;
            h = k.lower;
            if (a(d, g, h)) return k.set(R, 8);
            if (g && f.contains(g))
              for (; !g.getParent().equals(f);) g = g.getParent();
            else g = f.getFirst(function(a) { return e(d, a) });
            if (h && f.contains(h))
              for (; !h.getParent().equals(f);) h = h.getParent();
            else h = f.getLast(function(a) { return e(d, a) });
            if (!g || !h) return null;
            x(d, g);
            x(d, h);
            if (!l(d.mouse.y, g.size.top, h.size.bottom)) return null;
            for (var f = Number.MAX_VALUE, m, N, p, r; h && !h.equals(g) && (N = g.getNext(d.isRelevant));) m = Math.abs(c(d, g, N) - d.mouse.y), m < f && (f = m, p = g, r = N), g = N, x(d, g);
            if (!p || !r || !l(d.mouse.y, p.size.top, r.size.bottom)) return null;
            k.upper = p;
            k.lower = r;
            return k.set(R, 8)
          }

          function e(a, b) { return !(b && b.type == CKEDITOR.NODE_TEXT || ba(b) || p(b) || f(a, b) || b.type == CKEDITOR.NODE_ELEMENT && b.$ && b.is("br")) }
          return function(c) {
            var e = b(c),
              d;
            if (d = e) {
              d = e.upper;
              var f = e.lower;
              d = !d || !f || p(f) || p(d) || f.equals(d) || d.equals(f) || f.contains(d) || d.contains(f) ?
                !1 : w(c, d) && w(c, f) && a(c, d, f) ? !0 : !1
            }
            return d ? e : null
          }
        }(),
        ca = ["top", "left", "right", "bottom"]
    }(), CKEDITOR.config.magicline_keystrokePrevious = CKEDITOR.CTRL + CKEDITOR.SHIFT + 51, CKEDITOR.config.magicline_keystrokeNext = CKEDITOR.CTRL + CKEDITOR.SHIFT + 52,
    function() {
      function a(a) { if (!a || a.type != CKEDITOR.NODE_ELEMENT || "form" != a.getName()) return []; for (var b = [], c = ["style", "className"], d = 0; d < c.length; d++) { var g = a.$.elements.namedItem(c[d]);
          g && (g = new CKEDITOR.dom.element(g), b.push([g, g.nextSibling]), g.remove()) } return b }

      function d(a, b) { if (a && a.type == CKEDITOR.NODE_ELEMENT && "form" == a.getName() && 0 < b.length)
          for (var c = b.length - 1; 0 <= c; c--) { var d = b[c][0],
              g = b[c][1];
            g ? d.insertBefore(g) : d.appendTo(a) } }

      function b(b, c) { var e = a(b),
          g = {},
          m = b.$;
        c || (g["class"] = m.className || "", m.className = "");
        g.inline = m.style.cssText || "";
        c || (m.style.cssText = "position: static; overflow: visible");
        d(e); return g }

      function c(b, c) { var e = a(b),
          g = b.$; "class" in c && (g.className = c["class"]); "inline" in c && (g.style.cssText = c.inline);
        d(e) }

      function g(a) {
        if (!a.editable().isInline()) {
          var b =
            CKEDITOR.instances,
            c;
          for (c in b) { var d = b[c]; "wysiwyg" != d.mode || d.readOnly || (d = d.document.getBody(), d.setAttribute("contentEditable", !1), d.setAttribute("contentEditable", !0)) } a.editable().hasFocus && (a.toolbox.focus(), a.focus())
        }
      }
      CKEDITOR.plugins.add("maximize", {
        init: function(a) {
          function d() { var b = m.getViewPaneSize();
            a.resize(b.width, b.height, null, !0) }
          if (a.elementMode != CKEDITOR.ELEMENT_MODE_INLINE) {
            var e = a.lang,
              h = CKEDITOR.document,
              m = h.getWindow(),
              f, n, p, q = CKEDITOR.TRISTATE_OFF;
            a.addCommand("maximize", {
              modes: { wysiwyg: !CKEDITOR.env.iOS, source: !CKEDITOR.env.iOS },
              readOnly: 1,
              editorFocus: !1,
              exec: function() {
                var w = a.container.getFirst(function(a) { return a.type == CKEDITOR.NODE_ELEMENT && a.hasClass("cke_inner") }),
                  v = a.ui.space("contents");
                if ("wysiwyg" == a.mode) { var t = a.getSelection();
                  f = t && t.getRanges();
                  n = m.getScrollPosition() } else { var u = a.editable().$;
                  f = !CKEDITOR.env.ie && [u.selectionStart, u.selectionEnd];
                  n = [u.scrollLeft, u.scrollTop] }
                if (this.state == CKEDITOR.TRISTATE_OFF) {
                  m.on("resize", d);
                  p = m.getScrollPosition();
                  for (t = a.container; t = t.getParent();) t.setCustomData("maximize_saved_styles", b(t)), t.setStyle("z-index", a.config.baseFloatZIndex - 5);
                  v.setCustomData("maximize_saved_styles", b(v, !0));
                  w.setCustomData("maximize_saved_styles", b(w, !0));
                  v = { overflow: CKEDITOR.env.webkit ? "" : "hidden", width: 0, height: 0 };
                  h.getDocumentElement().setStyles(v);
                  !CKEDITOR.env.gecko && h.getDocumentElement().setStyle("position", "fixed");
                  CKEDITOR.env.gecko && CKEDITOR.env.quirks || h.getBody().setStyles(v);
                  CKEDITOR.env.ie ? setTimeout(function() {
                    m.$.scrollTo(0,
                      0)
                  }, 0) : m.$.scrollTo(0, 0);
                  w.setStyle("position", CKEDITOR.env.gecko && CKEDITOR.env.quirks ? "fixed" : "absolute");
                  w.$.offsetLeft;
                  w.setStyles({ "z-index": a.config.baseFloatZIndex - 5, left: "0px", top: "0px" });
                  w.addClass("cke_maximized");
                  d();
                  v = w.getDocumentPosition();
                  w.setStyles({ left: -1 * v.x + "px", top: -1 * v.y + "px" });
                  CKEDITOR.env.gecko && g(a)
                } else if (this.state == CKEDITOR.TRISTATE_ON) {
                  m.removeListener("resize", d);
                  for (var t = [v, w], r = 0; r < t.length; r++) c(t[r], t[r].getCustomData("maximize_saved_styles")), t[r].removeCustomData("maximize_saved_styles");
                  for (t = a.container; t = t.getParent();) c(t, t.getCustomData("maximize_saved_styles")), t.removeCustomData("maximize_saved_styles");
                  CKEDITOR.env.ie ? setTimeout(function() { m.$.scrollTo(p.x, p.y) }, 0) : m.$.scrollTo(p.x, p.y);
                  w.removeClass("cke_maximized");
                  CKEDITOR.env.webkit && (w.setStyle("display", "inline"), setTimeout(function() { w.setStyle("display", "block") }, 0));
                  a.fire("resize", { outerHeight: a.container.$.offsetHeight, contentsHeight: v.$.offsetHeight, outerWidth: a.container.$.offsetWidth })
                }
                this.toggleState();
                if (t =
                  this.uiItems[0]) v = this.state == CKEDITOR.TRISTATE_OFF ? e.maximize.maximize : e.maximize.minimize, t = CKEDITOR.document.getById(t._.id), t.getChild(1).setHtml(v), t.setAttribute("title", v), t.setAttribute("href", 'javascript:void("' + v + '");');
                "wysiwyg" == a.mode ? f ? (CKEDITOR.env.gecko && g(a), a.getSelection().selectRanges(f), (u = a.getSelection().getStartElement()) && u.scrollIntoView(!0)) : m.$.scrollTo(n.x, n.y) : (f && (u.selectionStart = f[0], u.selectionEnd = f[1]), u.scrollLeft = n[0], u.scrollTop = n[1]);
                f = n = null;
                q = this.state;
                a.fire("maximize",
                  this.state)
              },
              canUndo: !1
            });
            a.ui.addButton && a.ui.addButton("Maximize", { label: e.maximize.maximize, command: "maximize", toolbar: "tools,10" });
            a.on("mode", function() { var b = a.getCommand("maximize");
              b.setState(b.state == CKEDITOR.TRISTATE_DISABLED ? CKEDITOR.TRISTATE_DISABLED : q) }, null, null, 100)
          }
        }
      })
    }(), CKEDITOR.plugins.add("newpage", {
      init: function(a) {
        a.addCommand("newpage", {
          modes: { wysiwyg: 1, source: 1 },
          exec: function(a) {
            var b = this;
            a.setData(a.config.newpage_html || "", function() {
              a.focus();
              setTimeout(function() {
                a.fire("afterCommandExec", { name: "newpage", command: b });
                a.selectionChange()
              }, 200)
            })
          },
          async: !0
        });
        a.ui.addButton && a.ui.addButton("NewPage", { label: a.lang.newpage.toolbar, command: "newpage", toolbar: "document,20" })
      }
    }), "use strict",
    function() {
      function a(a) { return { "aria-label": a, "class": "cke_pagebreak", contenteditable: "false", "data-cke-display-name": "pagebreak", "data-cke-pagebreak": 1, style: "page-break-after: always", title: a } } CKEDITOR.plugins.add("pagebreak", {
        requires: "fakeobjects",
        onLoad: function() {
          var a = ("background:url(" + CKEDITOR.getUrl(this.path +
            "images/pagebreak.gif") + ") no-repeat center center;clear:both;width:100%;border-top:#999 1px dotted;border-bottom:#999 1px dotted;padding:0;height:7px;cursor:default;").replace(/;/g, " !important;");
          CKEDITOR.addCss("div.cke_pagebreak{" + a + "}")
        },
        init: function(a) {
          a.blockless || (a.addCommand("pagebreak", CKEDITOR.plugins.pagebreakCmd), a.ui.addButton && a.ui.addButton("PageBreak", { label: a.lang.pagebreak.toolbar, command: "pagebreak", toolbar: "insert,70" }), CKEDITOR.env.webkit && a.on("contentDom", function() {
            a.document.on("click",
              function(b) { b = b.data.getTarget();
                b.is("div") && b.hasClass("cke_pagebreak") && a.getSelection().selectElement(b) })
          }))
        },
        afterInit: function(d) {
          function b(b) { CKEDITOR.tools.extend(b.attributes, a(d.lang.pagebreak.alt), !0);
            b.children.length = 0 }
          var c = d.dataProcessor,
            g = c && c.dataFilter,
            c = c && c.htmlFilter,
            l = /page-break-after\s*:\s*always/i,
            k = /display\s*:\s*none/i;
          c && c.addRules({
            attributes: {
              "class": function(a, b) {
                var c = a.replace("cke_pagebreak", "");
                if (c != a) {
                  var d = CKEDITOR.htmlParser.fragment.fromHtml('\x3cspan style\x3d"display: none;"\x3e\x26nbsp;\x3c/span\x3e').children[0];
                  b.children.length = 0;
                  b.add(d);
                  d = b.attributes;
                  delete d["aria-label"];
                  delete d.contenteditable;
                  delete d.title
                }
                return c
              }
            }
          }, { applyToAll: !0, priority: 5 });
          g && g.addRules({ elements: { div: function(a) { if (a.attributes["data-cke-pagebreak"]) b(a);
                else if (l.test(a.attributes.style)) { var c = a.children[0];
                  c && "span" == c.name && k.test(c.attributes.style) && b(a) } } } })
        }
      });
      CKEDITOR.plugins.pagebreakCmd = {
        exec: function(d) { var b = d.document.createElement("div", { attributes: a(d.lang.pagebreak.alt) });
          d.insertElement(b) },
        context: "div",
        allowedContent: { div: { styles: "!page-break-after" }, span: { match: function(a) { return (a = a.parent) && "div" == a.name && a.styles && a.styles["page-break-after"] }, styles: "display" } },
        requiredContent: "div{page-break-after}"
      }
    }(),
    function() {
      function a(a, b, c) { var g = CKEDITOR.cleanWord;
        g ? c() : (a = CKEDITOR.getUrl(a.config.pasteFromWordCleanupFile || b + "filter/default.js"), CKEDITOR.scriptLoader.load(a, c, null, !0)); return !g } CKEDITOR.plugins.add("pastefromword", {
        requires: "clipboard",
        init: function(d) {
          function b(a) {
            var b = CKEDITOR.plugins.pastefromword &&
              CKEDITOR.plugins.pastefromword.images,
              c, d = [];
            if (b && a.editor.filter.check("img[src]") && (c = b.extractTagsFromHtml(a.data.dataValue), 0 !== c.length && (b = b.extractFromRtf(a.data.dataTransfer["text/rtf"]), 0 !== b.length && (CKEDITOR.tools.array.forEach(b, function(a) { d.push(a.type ? "data:" + a.type + ";base64," + CKEDITOR.tools.convertBytesToBase64(CKEDITOR.tools.convertHexStringToBytes(a.hex)) : null) }, this), c.length === d.length))))
              for (b = 0; b < c.length; b++) 0 === c[b].indexOf("file://") && d[b] && (a.data.dataValue = a.data.dataValue.replace(c[b],
                d[b]))
          }
          var c = 0,
            g = this.path,
            l = void 0 === d.config.pasteFromWord_inlineImages ? !0 : d.config.pasteFromWord_inlineImages;
          d.addCommand("pastefromword", { canUndo: !1, async: !0, exec: function(a, b) { c = 1;
              a.execCommand("paste", { type: "html", notification: b && "undefined" !== typeof b.notification ? b.notification : !0 }) } });
          CKEDITOR.plugins.clipboard.addPasteButton(d, "PasteFromWord", { label: d.lang.pastefromword.toolbar, command: "pastefromword", toolbar: "clipboard,50" });
          d.on("paste", function(b) {
            var e = b.data,
              h = CKEDITOR.plugins.clipboard.isCustomDataTypesSupported ?
              e.dataTransfer.getData("text/html", !0) : null,
              l = CKEDITOR.plugins.clipboard.isCustomDataTypesSupported ? e.dataTransfer.getData("text/rtf") : null,
              h = h || e.dataValue,
              f = { dataValue: h, dataTransfer: { "text/rtf": l } },
              l = /(class=\"?Mso|style=(?:\"|\')[^\"]*?\bmso\-|w:WordDocument|<o:\w+>|<\/font>)/,
              l = /<meta\s*name=(?:\"|\')?generator(?:\"|\')?\s*content=(?:\"|\')?microsoft/gi.test(h) || l.test(h);
            if (h && (c || l) && (!1 !== d.fire("pasteFromWord", f) || c)) {
              e.dontFilter = !0;
              var n = a(d, g, function() {
                if (n) d.fire("paste", e);
                else if (!d.config.pasteFromWordPromptCleanup ||
                  c || confirm(d.lang.pastefromword.confirmCleanup)) f.dataValue = CKEDITOR.cleanWord(f.dataValue, d), d.fire("afterPasteFromWord", f), e.dataValue = f.dataValue, !0 === d.config.forcePasteAsPlainText ? e.type = "text" : CKEDITOR.env.ie && "allow-word" === d.config.forcePasteAsPlainText && (e.type = "html");
                c = 0
              });
              n && b.cancel()
            }
          }, null, null, 3);
          if (CKEDITOR.plugins.clipboard.isCustomDataTypesSupported && l) d.on("afterPasteFromWord", b)
        }
      })
    }(),
    function() {
      var a = {
        canUndo: !1,
        async: !0,
        exec: function(a, b) {
          var c = a.lang,
            g = CKEDITOR.tools.keystrokeToString(c.common.keyboard,
              a.getCommandKeystroke(CKEDITOR.env.ie ? a.commands.paste : this)),
            l = b && "undefined" !== typeof b.notification ? b.notification : !b || !b.from || "keystrokeHandler" === b.from && CKEDITOR.env.ie,
            c = l && "string" === typeof l ? l : c.pastetext.pasteNotification.replace(/%1/, '\x3ckbd aria-label\x3d"' + g.aria + '"\x3e' + g.display + "\x3c/kbd\x3e");
          a.execCommand("paste", { type: "text", notification: l ? c : !1 })
        }
      };
      CKEDITOR.plugins.add("pastetext", {
        requires: "clipboard",
        init: function(d) {
          var b = CKEDITOR.env.safari ? CKEDITOR.CTRL + CKEDITOR.ALT + CKEDITOR.SHIFT +
            86 : CKEDITOR.CTRL + CKEDITOR.SHIFT + 86;
          d.addCommand("pastetext", a);
          d.setKeystroke(b, "pastetext");
          CKEDITOR.plugins.clipboard.addPasteButton(d, "PasteText", { label: d.lang.pastetext.button, command: "pastetext", toolbar: "clipboard,40" });
          if (d.config.forcePasteAsPlainText) d.on("beforePaste", function(a) { "html" != a.data.type && (a.data.type = "text") });
          d.on("pasteState", function(a) { d.getCommand("pastetext").setState(a.data) })
        }
      })
    }(),
    function() {
      var a, d = {
        modes: { wysiwyg: 1, source: 1 },
        canUndo: !1,
        readOnly: 1,
        exec: function(b) {
          var c,
            d = b.config,
            l = d.baseHref ? '\x3cbase href\x3d"' + d.baseHref + '"/\x3e' : "";
          if (d.fullPage) c = b.getData().replace(/<head>/, "$\x26" + l).replace(/[^>]*(?=<\/title>)/, "$\x26 \x26mdash; " + b.lang.preview.preview);
          else {
            var d = "\x3cbody ",
              k = b.document && b.document.getBody();
            k && (k.getAttribute("id") && (d += 'id\x3d"' + k.getAttribute("id") + '" '), k.getAttribute("class") && (d += 'class\x3d"' + k.getAttribute("class") + '" '));
            d += "\x3e";
            c = b.config.docType + '\x3chtml dir\x3d"' + b.config.contentsLangDirection + '"\x3e\x3chead\x3e' + l + "\x3ctitle\x3e" +
              b.lang.preview.preview + "\x3c/title\x3e" + CKEDITOR.tools.buildStyleHtml(b.config.contentsCss) + "\x3c/head\x3e" + d + b.getData() + "\x3c/body\x3e\x3c/html\x3e"
          }
          l = 640;
          d = 420;
          k = 80;
          try { var e = window.screen,
              l = Math.round(.8 * e.width),
              d = Math.round(.7 * e.height),
              k = Math.round(.1 * e.width) } catch (h) {}
          if (!1 === b.fire("contentPreview", b = { dataValue: c })) return !1;
          var e = "",
            m;
          CKEDITOR.env.ie && (window._cke_htmlToLoad = b.dataValue, m = "javascript:void( (function(){document.open();" + ("(" + CKEDITOR.tools.fixDomain + ")();").replace(/\/\/.*?\n/g,
            "").replace(/parent\./g, "window.opener.") + "document.write( window.opener._cke_htmlToLoad );document.close();window.opener._cke_htmlToLoad \x3d null;})() )", e = "");
          CKEDITOR.env.gecko && (window._cke_htmlToLoad = b.dataValue, e = CKEDITOR.getUrl(a + "preview.html"));
          e = window.open(e, null, "toolbar\x3dyes,location\x3dno,status\x3dyes,menubar\x3dyes,scrollbars\x3dyes,resizable\x3dyes,width\x3d" + l + ",height\x3d" + d + ",left\x3d" + k);
          CKEDITOR.env.ie && e && (e.location = m);
          CKEDITOR.env.ie || CKEDITOR.env.gecko || (m = e.document,
            m.open(), m.write(b.dataValue), m.close());
          return !0
        }
      };
      CKEDITOR.plugins.add("preview", { init: function(b) { b.elementMode != CKEDITOR.ELEMENT_MODE_INLINE && (a = this.path, b.addCommand("preview", d), b.ui.addButton && b.ui.addButton("Preview", { label: b.lang.preview.preview, command: "preview", toolbar: "document,40" })) } })
    }(), CKEDITOR.plugins.add("print", {
      init: function(a) {
        a.elementMode != CKEDITOR.ELEMENT_MODE_INLINE && (a.addCommand("print", CKEDITOR.plugins.print), a.ui.addButton && a.ui.addButton("Print", {
          label: a.lang.print.toolbar,
          command: "print",
          toolbar: "document,50"
        }))
      }
    }), CKEDITOR.plugins.print = { exec: function(a) { CKEDITOR.env.gecko ? a.window.$.print() : a.document.$.execCommand("Print") }, canUndo: !1, readOnly: 1, modes: { wysiwyg: 1 } }, CKEDITOR.plugins.add("removeformat", { init: function(a) { a.addCommand("removeFormat", CKEDITOR.plugins.removeformat.commands.removeformat);
        a.ui.addButton && a.ui.addButton("RemoveFormat", { label: a.lang.removeformat.toolbar, command: "removeFormat", toolbar: "cleanup,10" }) } }), CKEDITOR.plugins.removeformat = {
      commands: {
        removeformat: {
          exec: function(a) {
            for (var d =
                a._.removeFormatRegex || (a._.removeFormatRegex = new RegExp("^(?:" + a.config.removeFormatTags.replace(/,/g, "|") + ")$", "i")), b = a._.removeAttributes || (a._.removeAttributes = a.config.removeFormatAttributes.split(",")), c = CKEDITOR.plugins.removeformat.filter, g = a.getSelection().getRanges(), l = g.createIterator(), k = function(a) { return a.type == CKEDITOR.NODE_ELEMENT }, e; e = l.getNextRange();) {
              e.collapsed || e.enlarge(CKEDITOR.ENLARGE_ELEMENT);
              var h = e.createBookmark(),
                m = h.startNode,
                f = h.endNode,
                n = function(b) {
                  for (var e = a.elementPath(b),
                      f = e.elements, g = 1, h;
                    (h = f[g]) && !h.equals(e.block) && !h.equals(e.blockLimit); g++) d.test(h.getName()) && c(a, h) && b.breakParent(h)
                };
              n(m);
              if (f)
                for (n(f), m = m.getNextSourceNode(!0, CKEDITOR.NODE_ELEMENT); m && !m.equals(f);)
                  if (m.isReadOnly()) { if (m.getPosition(f) & CKEDITOR.POSITION_CONTAINS) break;
                    m = m.getNext(k) } else n = m.getNextSourceNode(!1, CKEDITOR.NODE_ELEMENT), "img" == m.getName() && m.data("cke-realelement") || !c(a, m) || (d.test(m.getName()) ? m.remove(1) : (m.removeAttributes(b), a.fire("removeFormatCleanup", m))), m = n;
              e.moveToBookmark(h)
            }
            a.forceNextSelectionCheck();
            a.getSelection().selectRanges(g)
          }
        }
      },
      filter: function(a, d) { for (var b = a._.removeFormatFilters || [], c = 0; c < b.length; c++)
          if (!1 === b[c](d)) return !1; return !0 }
    }, CKEDITOR.editor.prototype.addRemoveFormatFilter = function(a) { this._.removeFormatFilters || (this._.removeFormatFilters = []);
      this._.removeFormatFilters.push(a) }, CKEDITOR.config.removeFormatTags = "b,big,cite,code,del,dfn,em,font,i,ins,kbd,q,s,samp,small,span,strike,strong,sub,sup,tt,u,var", CKEDITOR.config.removeFormatAttributes = "class,style,lang,width,height,align,hspace,valign",
    CKEDITOR.plugins.add("resize", {
      init: function(a) {
        function d(b) { var d = h.width,
            g = h.height,
            k = d + (b.data.$.screenX - e.x) * ("rtl" == l ? -1 : 1);
          b = g + (b.data.$.screenY - e.y);
          m && (d = Math.max(c.resize_minWidth, Math.min(k, c.resize_maxWidth)));
          f && (g = Math.max(c.resize_minHeight, Math.min(b, c.resize_maxHeight)));
          a.resize(m ? d : null, g) }

        function b() {
          CKEDITOR.document.removeListener("mousemove", d);
          CKEDITOR.document.removeListener("mouseup", b);
          a.document && (a.document.removeListener("mousemove", d), a.document.removeListener("mouseup",
            b))
        }
        var c = a.config,
          g = a.ui.spaceId("resizer"),
          l = a.element ? a.element.getDirection(1) : "ltr";
        !c.resize_dir && (c.resize_dir = "vertical");
        void 0 === c.resize_maxWidth && (c.resize_maxWidth = 3E3);
        void 0 === c.resize_maxHeight && (c.resize_maxHeight = 3E3);
        void 0 === c.resize_minWidth && (c.resize_minWidth = 750);
        void 0 === c.resize_minHeight && (c.resize_minHeight = 250);
        if (!1 !== c.resize_enabled) {
          var k = null,
            e, h, m = ("both" == c.resize_dir || "horizontal" == c.resize_dir) && c.resize_minWidth != c.resize_maxWidth,
            f = ("both" == c.resize_dir || "vertical" ==
              c.resize_dir) && c.resize_minHeight != c.resize_maxHeight,
            n = CKEDITOR.tools.addFunction(function(f) { k || (k = a.getResizable());
              h = { width: k.$.offsetWidth || 0, height: k.$.offsetHeight || 0 };
              e = { x: f.screenX, y: f.screenY };
              c.resize_minWidth > h.width && (c.resize_minWidth = h.width);
              c.resize_minHeight > h.height && (c.resize_minHeight = h.height);
              CKEDITOR.document.on("mousemove", d);
              CKEDITOR.document.on("mouseup", b);
              a.document && (a.document.on("mousemove", d), a.document.on("mouseup", b));
              f.preventDefault && f.preventDefault() });
          a.on("destroy",
            function() { CKEDITOR.tools.removeFunction(n) });
          a.on("uiSpace", function(b) { if ("bottom" == b.data.space) { var c = "";
              m && !f && (c = " cke_resizer_horizontal");!m && f && (c = " cke_resizer_vertical"); var e = '\x3cspan id\x3d"' + g + '" class\x3d"cke_resizer' + c + " cke_resizer_" + l + '" title\x3d"' + CKEDITOR.tools.htmlEncode(a.lang.common.resize) + '" onmousedown\x3d"CKEDITOR.tools.callFunction(' + n + ', event)"\x3e' + ("ltr" == l ? "◢" : "◣") + "\x3c/span\x3e"; "ltr" == l && "ltr" == c ? b.data.html += e : b.data.html = e + b.data.html } }, a, null, 100);
          a.on("maximize",
            function(b) { a.ui.space("resizer")[b.data == CKEDITOR.TRISTATE_ON ? "hide" : "show"]() })
        }
      }
    }),
    function() { var a = { readOnly: 1, modes: { wysiwyg: 1, source: 1 }, exec: function(a) { if (a.fire("save") && (a = a.element.$.form)) try { a.submit() } catch (b) { a.submit.click && a.submit.click() } } };
      CKEDITOR.plugins.add("save", { init: function(d) { d.elementMode == CKEDITOR.ELEMENT_MODE_REPLACE && (d.addCommand("save", a).startDisabled = !d.element.$.form, d.ui.addButton && d.ui.addButton("Save", { label: d.lang.save.toolbar, command: "save", toolbar: "document,10" })) } }) }(),
    "use strict", CKEDITOR.plugins.add("scayt", {
      requires: "menubutton,dialog",
      tabToOpen: null,
      dialogName: "scaytDialog",
      onLoad: function(a) { CKEDITOR.plugins.scayt.onLoadTimestamp = (new Date).getTime(); "moono-lisa" == (CKEDITOR.skinName || a.config.skin) && CKEDITOR.document.appendStyleSheet(this.path + "skins/" + CKEDITOR.skin.name + "/scayt.css");
        CKEDITOR.document.appendStyleSheet(this.path + "dialogs/dialog.css") },
      init: function(a) {
        var d = this,
          b = CKEDITOR.plugins.scayt;
        this.bindEvents(a);
        this.parseConfig(a);
        this.addRule(a);
        CKEDITOR.dialog.add(this.dialogName, CKEDITOR.getUrl(this.path + "dialogs/options.js"));
        this.addMenuItems(a);
        var c = a.lang.scayt,
          g = CKEDITOR.env;
        a.ui.add("Scayt", CKEDITOR.UI_MENUBUTTON, {
          label: c.text_title,
          title: a.plugins.wsc ? a.lang.wsc.title : c.text_title,
          modes: { wysiwyg: !(g.ie && (8 > g.version || g.quirks)) },
          toolbar: "spellchecker,20",
          refresh: function() { var c = a.ui.instances.Scayt.getState();
            a.scayt && (c = b.state.scayt[a.name] ? CKEDITOR.TRISTATE_ON : CKEDITOR.TRISTATE_OFF);
            a.fire("scaytButtonState", c) },
          onRender: function() {
            var b =
              this;
            a.on("scaytButtonState", function(a) { void 0 !== typeof a.data && b.setState(a.data) })
          },
          onMenu: function() {
            var c = a.scayt;
            a.getMenuItem("scaytToggle").label = a.lang.scayt[c && b.state.scayt[a.name] ? "btn_disable" : "btn_enable"];
            var d = {
              scaytToggle: CKEDITOR.TRISTATE_OFF,
              scaytOptions: c ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED,
              scaytLangs: c ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED,
              scaytDict: c ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED,
              scaytAbout: c ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED,
              WSC: a.plugins.wsc ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED
            };
            a.config.scayt_uiTabs[0] || delete d.scaytOptions;
            a.config.scayt_uiTabs[1] || delete d.scaytLangs;
            a.config.scayt_uiTabs[2] || delete d.scaytDict;
            c && !CKEDITOR.plugins.scayt.isNewUdSupported(c) && (delete d.scaytDict, a.config.scayt_uiTabs[2] = 0, CKEDITOR.plugins.scayt.alarmCompatibilityMessage());
            return d
          }
        });
        a.contextMenu && a.addMenuItems && (a.contextMenu.addListener(function(b, c) {
          var e = a.scayt,
            g, m;
          e && (m = e.getSelectionNode()) && (g = d.menuGenerator(a,
            m), e.showBanner("." + a.contextMenu._.definition.panel.className.split(" ").join(" .")));
          return g
        }), a.contextMenu._.onHide = CKEDITOR.tools.override(a.contextMenu._.onHide, function(b) { return function() { var c = a.scayt;
            c && c.hideBanner(); return b.apply(this) } }))
      },
      addMenuItems: function(a) {
        var d = this,
          b = CKEDITOR.plugins.scayt;
        a.addMenuGroup("scaytButton");
        for (var c = a.config.scayt_contextMenuItemsOrder.split("|"), g = 0; g < c.length; g++) c[g] = "scayt_" + c[g];
        if ((c = ["grayt_description", "grayt_suggest", "grayt_control"].concat(c)) &&
          c.length)
          for (g = 0; g < c.length; g++) a.addMenuGroup(c[g], g - 10);
        a.addCommand("scaytToggle", { exec: function(a) { var c = a.scayt;
            b.state.scayt[a.name] = !b.state.scayt[a.name];!0 === b.state.scayt[a.name] ? c || b.createScayt(a) : c && b.destroy(a) } });
        a.addCommand("scaytAbout", { exec: function(a) { a.scayt.tabToOpen = "about";
            a.lockSelection();
            a.openDialog(d.dialogName) } });
        a.addCommand("scaytOptions", { exec: function(a) { a.scayt.tabToOpen = "options";
            a.lockSelection();
            a.openDialog(d.dialogName) } });
        a.addCommand("scaytLangs", {
          exec: function(a) {
            a.scayt.tabToOpen =
              "langs";
            a.lockSelection();
            a.openDialog(d.dialogName)
          }
        });
        a.addCommand("scaytDict", { exec: function(a) { a.scayt.tabToOpen = "dictionaries";
            a.lockSelection();
            a.openDialog(d.dialogName) } });
        c = {
          scaytToggle: { label: a.lang.scayt.btn_enable, group: "scaytButton", command: "scaytToggle" },
          scaytAbout: { label: a.lang.scayt.btn_about, group: "scaytButton", command: "scaytAbout" },
          scaytOptions: { label: a.lang.scayt.btn_options, group: "scaytButton", command: "scaytOptions" },
          scaytLangs: {
            label: a.lang.scayt.btn_langs,
            group: "scaytButton",
            command: "scaytLangs"
          },
          scaytDict: { label: a.lang.scayt.btn_dictionaries, group: "scaytButton", command: "scaytDict" }
        };
        a.plugins.wsc && (c.WSC = { label: a.lang.wsc.toolbar, group: "scaytButton", onClick: function() { var b = CKEDITOR.plugins.scayt,
              c = a.scayt,
              e = a.elementMode == CKEDITOR.ELEMENT_MODE_INLINE ? a.container.getText() : a.document.getBody().getText();
            (e = e.replace(/\s/g, "")) ? (c && b.state.scayt[a.name] && c.setMarkupPaused && c.setMarkupPaused(!0), a.lockSelection(), a.execCommand("checkspell")) : alert("Nothing to check!") } });
        a.addMenuItems(c)
      },
      bindEvents: function(a) {
        var d = CKEDITOR.plugins.scayt,
          b = a.elementMode == CKEDITOR.ELEMENT_MODE_INLINE,
          c = function() { d.destroy(a) },
          g = function() {!d.state.scayt[a.name] || a.readOnly || a.scayt || d.createScayt(a) },
          l = function() {
            var c = a.editable();
            c.attachListener(c, "focus", function(c) {
              CKEDITOR.plugins.scayt && !a.scayt && setTimeout(g, 0);
              c = CKEDITOR.plugins.scayt && CKEDITOR.plugins.scayt.state.scayt[a.name] && a.scayt;
              var e, d;
              if ((b || c) && a._.savedSelection) {
                c = a._.savedSelection.getSelectedElement();
                c = !c && a._.savedSelection.getRanges();
                for (var k = 0; k < c.length; k++) d = c[k], "string" === typeof d.startContainer.$.nodeValue && (e = d.startContainer.getText().length, (e < d.startOffset || e < d.endOffset) && a.unlockSelection(!1))
              }
            }, this, null, -10)
          },
          k = function() {
            b ? a.config.scayt_inlineModeImmediateMarkup ? g() : (a.on("blur", function() { setTimeout(c, 0) }), a.on("focus", g), a.focusManager.hasFocus && g()) : g();
            l();
            var e = a.editable();
            e.attachListener(e, "mousedown", function(b) {
              b = b.data.getTarget();
              var c = a.widgets && a.widgets.getByElement(b);
              c && (c.wrapper = b.getAscendant(function(a) { return a.hasAttribute("data-cke-widget-wrapper") }, !0))
            }, this, null, -10)
          };
        a.on("contentDom", k);
        a.on("beforeCommandExec", function(b) {
          var c = a.scayt,
            g = !1,
            f = !1,
            k = !0;
          b.data.name in d.options.disablingCommandExec && "wysiwyg" == a.mode ? c && (d.destroy(a), a.fire("scaytButtonState", CKEDITOR.TRISTATE_DISABLED)) : "bold" !== b.data.name && "italic" !== b.data.name && "underline" !== b.data.name && "strike" !== b.data.name && "subscript" !== b.data.name && "superscript" !== b.data.name && "enter" !== b.data.name &&
            "cut" !== b.data.name && "language" !== b.data.name || !c || ("cut" === b.data.name && (k = !1, f = !0), "language" === b.data.name && (f = g = !0), a.fire("reloadMarkupScayt", { removeOptions: { removeInside: k, forceBookmark: f, language: g }, timeout: 0 }))
        });
        a.on("beforeSetMode", function(b) { if ("source" == b.data) { if (b = a.scayt) d.destroy(a), a.fire("scaytButtonState", CKEDITOR.TRISTATE_DISABLED);
            a.document && a.document.getBody().removeAttribute("_jquid") } });
        a.on("afterCommandExec", function(b) {
          "wysiwyg" != a.mode || "undo" != b.data.name && "redo" !=
            b.data.name || setTimeout(function() { d.reloadMarkup(a.scayt) }, 250)
        });
        a.on("readOnly", function(b) { var c;
          b && (c = a.scayt, !0 === b.editor.readOnly ? c && c.fire("removeMarkupInDocument", {}) : c ? d.reloadMarkup(c) : "wysiwyg" == b.editor.mode && !0 === d.state.scayt[b.editor.name] && (d.createScayt(a), b.editor.fire("scaytButtonState", CKEDITOR.TRISTATE_ON))) });
        a.on("beforeDestroy", c);
        a.on("setData", function() { c();
          (a.elementMode == CKEDITOR.ELEMENT_MODE_INLINE || a.plugins.divarea) && k() }, this, null, 50);
        a.on("reloadMarkupScayt", function(b) {
          var c =
            b.data && b.data.removeOptions,
            g = b.data && b.data.timeout,
            f = b.data && b.data.language,
            k = a.scayt;
          k && setTimeout(function() { f && (c.selectionNode = a.plugins.language.getCurrentLangElement(a), c.selectionNode = c.selectionNode && c.selectionNode.$ || null);
            k.removeMarkupInSelectionNode(c);
            d.reloadMarkup(k) }, g || 0)
        });
        a.on("insertElement", function() { a.fire("reloadMarkupScayt", { removeOptions: { forceBookmark: !0 } }) }, this, null, 50);
        a.on("insertHtml", function() { a.scayt && a.scayt.setFocused && a.scayt.setFocused(!0);
            a.fire("reloadMarkupScayt") },
          this, null, 50);
        a.on("insertText", function() { a.scayt && a.scayt.setFocused && a.scayt.setFocused(!0);
          a.fire("reloadMarkupScayt") }, this, null, 50);
        a.on("scaytDialogShown", function(b) { b.data.selectPage(a.scayt.tabToOpen) })
      },
      parseConfig: function(a) {
        var d = CKEDITOR.plugins.scayt;
        d.replaceOldOptionsNames(a.config);
        "boolean" !== typeof a.config.scayt_autoStartup && (a.config.scayt_autoStartup = !1);
        d.state.scayt[a.name] = a.config.scayt_autoStartup;
        "boolean" !== typeof a.config.grayt_autoStartup && (a.config.grayt_autoStartup = !1);
        "boolean" !== typeof a.config.scayt_inlineModeImmediateMarkup && (a.config.scayt_inlineModeImmediateMarkup = !1);
        d.state.grayt[a.name] = a.config.grayt_autoStartup;
        a.config.scayt_contextCommands || (a.config.scayt_contextCommands = "ignoreall|add");
        a.config.scayt_contextMenuItemsOrder || (a.config.scayt_contextMenuItemsOrder = "suggest|moresuggest|control");
        a.config.scayt_sLang || (a.config.scayt_sLang = "en_US");
        if (void 0 === a.config.scayt_maxSuggestions || "number" != typeof a.config.scayt_maxSuggestions || 0 > a.config.scayt_maxSuggestions) a.config.scayt_maxSuggestions =
          3;
        if (void 0 === a.config.scayt_minWordLength || "number" != typeof a.config.scayt_minWordLength || 1 > a.config.scayt_minWordLength) a.config.scayt_minWordLength = 3;
        if (void 0 === a.config.scayt_customDictionaryIds || "string" !== typeof a.config.scayt_customDictionaryIds) a.config.scayt_customDictionaryIds = "";
        if (void 0 === a.config.scayt_userDictionaryName || "string" !== typeof a.config.scayt_userDictionaryName) a.config.scayt_userDictionaryName = null;
        if ("string" === typeof a.config.scayt_uiTabs && 3 === a.config.scayt_uiTabs.split(",").length) {
          var b = [],
            c = [];
          a.config.scayt_uiTabs = a.config.scayt_uiTabs.split(",");
          CKEDITOR.tools.search(a.config.scayt_uiTabs, function(a) { 1 === Number(a) || 0 === Number(a) ? (c.push(!0), b.push(Number(a))) : c.push(!1) });
          null === CKEDITOR.tools.search(c, !1) ? a.config.scayt_uiTabs = b : a.config.scayt_uiTabs = [1, 1, 1]
        } else a.config.scayt_uiTabs = [1, 1, 1];
        "string" != typeof a.config.scayt_serviceProtocol && (a.config.scayt_serviceProtocol = null);
        "string" != typeof a.config.scayt_serviceHost && (a.config.scayt_serviceHost = null);
        "string" != typeof a.config.scayt_servicePort &&
          (a.config.scayt_servicePort = null);
        "string" != typeof a.config.scayt_servicePath && (a.config.scayt_servicePath = null);
        a.config.scayt_moreSuggestions || (a.config.scayt_moreSuggestions = "on");
        "string" !== typeof a.config.scayt_customerId && (a.config.scayt_customerId = "1:WvF0D4-UtPqN1-43nkD4-NKvUm2-daQqk3-LmNiI-z7Ysb4-mwry24-T8YrS3-Q2tpq2");
        "string" !== typeof a.config.scayt_customPunctuation && (a.config.scayt_customPunctuation = "-");
        "string" !== typeof a.config.scayt_srcUrl && (d = document.location.protocol, d = -1 != d.search(/https?:/) ?
          d : "http:", a.config.scayt_srcUrl = d + "//svc.webspellchecker.net/spellcheck31/lf/scayt3/ckscayt/ckscayt.js");
        "boolean" !== typeof CKEDITOR.config.scayt_handleCheckDirty && (CKEDITOR.config.scayt_handleCheckDirty = !0);
        "boolean" !== typeof CKEDITOR.config.scayt_handleUndoRedo && (CKEDITOR.config.scayt_handleUndoRedo = !0);
        CKEDITOR.config.scayt_handleUndoRedo = CKEDITOR.plugins.undo ? CKEDITOR.config.scayt_handleUndoRedo : !1;
        "boolean" !== typeof a.config.scayt_multiLanguageMode && (a.config.scayt_multiLanguageMode = !1);
        "object" !==
        typeof a.config.scayt_multiLanguageStyles && (a.config.scayt_multiLanguageStyles = {});
        a.config.scayt_ignoreAllCapsWords && "boolean" !== typeof a.config.scayt_ignoreAllCapsWords && (a.config.scayt_ignoreAllCapsWords = !1);
        a.config.scayt_ignoreDomainNames && "boolean" !== typeof a.config.scayt_ignoreDomainNames && (a.config.scayt_ignoreDomainNames = !1);
        a.config.scayt_ignoreWordsWithMixedCases && "boolean" !== typeof a.config.scayt_ignoreWordsWithMixedCases && (a.config.scayt_ignoreWordsWithMixedCases = !1);
        a.config.scayt_ignoreWordsWithNumbers &&
          "boolean" !== typeof a.config.scayt_ignoreWordsWithNumbers && (a.config.scayt_ignoreWordsWithNumbers = !1);
        if (a.config.scayt_disableOptionsStorage) {
          var d = CKEDITOR.tools.isArray(a.config.scayt_disableOptionsStorage) ? a.config.scayt_disableOptionsStorage : "string" === typeof a.config.scayt_disableOptionsStorage ? [a.config.scayt_disableOptionsStorage] : void 0,
            g = "all options lang ignore-all-caps-words ignore-domain-names ignore-words-with-mixed-cases ignore-words-with-numbers".split(" "),
            l = ["lang", "ignore-all-caps-words",
              "ignore-domain-names", "ignore-words-with-mixed-cases", "ignore-words-with-numbers"
            ],
            k = CKEDITOR.tools.search,
            e = CKEDITOR.tools.indexOf;
          a.config.scayt_disableOptionsStorage = function(a) { for (var b = [], c = 0; c < a.length; c++) { var d = a[c],
                p = !!k(a, "options"); if (!k(g, d) || p && k(l, function(a) { if ("lang" === a) return !1 })) return;
              k(l, d) && l.splice(e(l, d), 1); if ("all" === d || p && k(a, "lang")) return []; "options" === d && (l = ["lang"]) } return b = b.concat(l) }(d)
        }
      },
      addRule: function(a) {
        var d = CKEDITOR.plugins.scayt,
          b = a.dataProcessor,
          c = b && b.htmlFilter,
          g = a._.elementsPath && a._.elementsPath.filters,
          b = b && b.dataFilter,
          l = a.addRemoveFormatFilter,
          k = function(b) { if (a.scayt && (b.hasAttribute(d.options.data_attribute_name) || b.hasAttribute(d.options.problem_grammar_data_attribute))) return !1 },
          e = function(b) { var c = !0;
            a.scayt && (b.hasAttribute(d.options.data_attribute_name) || b.hasAttribute(d.options.problem_grammar_data_attribute)) && (c = !1); return c };
        g && g.push(k);
        b && b.addRules({
          elements: {
            span: function(a) {
              var b = a.hasClass(d.options.misspelled_word_class) && a.attributes[d.options.data_attribute_name],
                c = a.hasClass(d.options.problem_grammar_class) && a.attributes[d.options.problem_grammar_data_attribute];
              d && (b || c) && delete a.name;
              return a
            }
          }
        });
        c && c.addRules({ elements: { span: function(a) { var b = a.hasClass(d.options.misspelled_word_class) && a.attributes[d.options.data_attribute_name],
                c = a.hasClass(d.options.problem_grammar_class) && a.attributes[d.options.problem_grammar_data_attribute];
              d && (b || c) && delete a.name; return a } } });
        l && l.call(a, e)
      },
      scaytMenuDefinition: function(a) {
        var d = this;
        a = a.scayt;
        return {
          scayt: {
            scayt_ignore: {
              label: a.getLocal("btn_ignore"),
              group: "scayt_control",
              order: 1,
              exec: function(a) { a.scayt.ignoreWord() }
            },
            scayt_ignoreall: { label: a.getLocal("btn_ignoreAll"), group: "scayt_control", order: 2, exec: function(a) { a.scayt.ignoreAllWords() } },
            scayt_add: { label: a.getLocal("btn_addWord"), group: "scayt_control", order: 3, exec: function(a) { var c = a.scayt;
                setTimeout(function() { c.addWordToUserDictionary() }, 10) } },
            scayt_option: {
              label: a.getLocal("btn_options"),
              group: "scayt_control",
              order: 4,
              exec: function(a) { a.scayt.tabToOpen = "options";
                a.lockSelection();
                a.openDialog(d.dialogName) },
              verification: function(a) { return 1 == a.config.scayt_uiTabs[0] ? !0 : !1 }
            },
            scayt_language: { label: a.getLocal("btn_langs"), group: "scayt_control", order: 5, exec: function(a) { a.scayt.tabToOpen = "langs";
                a.lockSelection();
                a.openDialog(d.dialogName) }, verification: function(a) { return 1 == a.config.scayt_uiTabs[1] ? !0 : !1 } },
            scayt_dictionary: {
              label: a.getLocal("btn_dictionaries"),
              group: "scayt_control",
              order: 6,
              exec: function(a) { a.scayt.tabToOpen = "dictionaries";
                a.lockSelection();
                a.openDialog(d.dialogName) },
              verification: function(a) {
                return 1 ==
                  a.config.scayt_uiTabs[2] ? !0 : !1
              }
            },
            scayt_about: { label: a.getLocal("btn_about"), group: "scayt_control", order: 7, exec: function(a) { a.scayt.tabToOpen = "about";
                a.lockSelection();
                a.openDialog(d.dialogName) } }
          },
          grayt: {
            grayt_problemdescription: { label: "Grammar problem description", group: "grayt_description", order: 1, state: CKEDITOR.TRISTATE_DISABLED, exec: function(a) {} },
            grayt_ignore: { label: a.getLocal("btn_ignore"), group: "grayt_control", order: 2, exec: function(a) { a.scayt.ignorePhrase() } },
            grayt_ignoreall: {
              label: a.getLocal("btn_ignoreAll"),
              group: "grayt_control",
              order: 3,
              exec: function(a) { a.scayt.ignoreAllPhrases() }
            }
          }
        }
      },
      buildSuggestionMenuItems: function(a, d, b) {
        var c = {},
          g = {},
          l = b ? "word" : "phrase",
          k = b ? "startGrammarCheck" : "startSpellCheck",
          e = a.scayt;
        if (0 < d.length && "no_any_suggestions" !== d[0])
          if (b)
            for (b = 0; b < d.length; b++) {
              var h = "scayt_suggest_" + CKEDITOR.plugins.scayt.suggestions[b].replace(" ", "_");
              a.addCommand(h, this.createCommand(CKEDITOR.plugins.scayt.suggestions[b], l, k));
              b < a.config.scayt_maxSuggestions ? (a.addMenuItem(h, {
                label: d[b],
                command: h,
                group: "scayt_suggest",
                order: b + 1
              }), c[h] = CKEDITOR.TRISTATE_OFF) : (a.addMenuItem(h, { label: d[b], command: h, group: "scayt_moresuggest", order: b + 1 }), g[h] = CKEDITOR.TRISTATE_OFF, "on" === a.config.scayt_moreSuggestions && (a.addMenuItem("scayt_moresuggest", { label: e.getLocal("btn_moreSuggestions"), group: "scayt_moresuggest", order: 10, getItems: function() { return g } }), c.scayt_moresuggest = CKEDITOR.TRISTATE_OFF))
            } else
              for (b = 0; b < d.length; b++) h = "grayt_suggest_" + CKEDITOR.plugins.scayt.suggestions[b].replace(" ", "_"), a.addCommand(h,
                this.createCommand(CKEDITOR.plugins.scayt.suggestions[b], l, k)), a.addMenuItem(h, { label: d[b], command: h, group: "grayt_suggest", order: b + 1 }), c[h] = CKEDITOR.TRISTATE_OFF;
          else c.no_scayt_suggest = CKEDITOR.TRISTATE_DISABLED, a.addCommand("no_scayt_suggest", { exec: function() {} }), a.addMenuItem("no_scayt_suggest", { label: e.getLocal("btn_noSuggestions") || "no_scayt_suggest", command: "no_scayt_suggest", group: "scayt_suggest", order: 0 });
        return c
      },
      menuGenerator: function(a, d) {
        var b = a.scayt,
          c = this.scaytMenuDefinition(a),
          g = {},
          l = a.config.scayt_contextCommands.split("|"),
          k = d.getAttribute(b.getLangAttribute()) || b.getLang(),
          e, h, m;
        e = b.isScaytNode(d);
        h = b.isGraytNode(d);
        e ? (c = c.scayt, g = d.getAttribute(b.getScaytNodeAttributeName()), b.fire("getSuggestionsList", { lang: k, word: g }), g = this.buildSuggestionMenuItems(a, CKEDITOR.plugins.scayt.suggestions, e)) : h && (c = c.grayt, g = d.getAttribute(b.getGraytNodeAttributeName()), m = b.getProblemDescriptionText(g, k), c.grayt_problemdescription && m && (c.grayt_problemdescription.label = m), b.fire("getGrammarSuggestionsList", { lang: k, phrase: g }), g = this.buildSuggestionMenuItems(a, CKEDITOR.plugins.scayt.suggestions, e));
        if (e && "off" == a.config.scayt_contextCommands) return g;
        for (var f in c) e && -1 == CKEDITOR.tools.indexOf(l, f.replace("scayt_", "")) && "all" != a.config.scayt_contextCommands || h && "grayt_problemdescription" !== f && -1 == CKEDITOR.tools.indexOf(l, f.replace("grayt_", "")) && "all" != a.config.scayt_contextCommands || (g[f] = "undefined" != typeof c[f].state ? c[f].state : CKEDITOR.TRISTATE_OFF, "function" !== typeof c[f].verification || c[f].verification(a) ||
          delete g[f], a.addCommand(f, { exec: c[f].exec }), a.addMenuItem(f, { label: a.lang.scayt[c[f].label] || c[f].label, command: f, group: c[f].group, order: c[f].order }));
        return g
      },
      createCommand: function(a, d, b) { return { exec: function(c) { c = c.scayt; var g = {};
            g[d] = a;
            c.replaceSelectionNode(g); "startGrammarCheck" === b && c.removeMarkupInSelectionNode({ grammarOnly: !0 });
            c.fire(b) } } }
    }), CKEDITOR.plugins.scayt = {
      charsToObserve: [{
        charName: "cke-fillingChar",
        charCode: function() {
          var a = CKEDITOR.version.match(/^\d(\.\d*)*/),
            a = a && a[0],
            d;
          if (a) {
            d =
              "4.5.7";
            var b, a = a.replace(/\./g, "");
            d = d.replace(/\./g, "");
            b = a.length - d.length;
            b = 0 <= b ? b : 0;
            d = parseInt(a) >= parseInt(d) * Math.pow(10, b)
          }
          return d ? Array(7).join(String.fromCharCode(8203)) : String.fromCharCode(8203)
        }()
      }],
      onLoadTimestamp: "",
      state: { scayt: {}, grayt: {} },
      warningCounter: 0,
      suggestions: [],
      options: { disablingCommandExec: { source: !0, newpage: !0, templates: !0 }, data_attribute_name: "data-scayt-word", misspelled_word_class: "scayt-misspell-word", problem_grammar_data_attribute: "data-grayt-phrase", problem_grammar_class: "gramm-problem" },
      backCompatibilityMap: { scayt_service_protocol: "scayt_serviceProtocol", scayt_service_host: "scayt_serviceHost", scayt_service_port: "scayt_servicePort", scayt_service_path: "scayt_servicePath", scayt_customerid: "scayt_customerId" },
      alarmCompatibilityMessage: function() {
        5 > this.warningCounter && (console.warn("You are using the latest version of SCAYT plugin for CKEditor with the old application version. In order to have access to the newest features, it is recommended to upgrade the application version to latest one as well. Contact us for more details at support@webspellchecker.net."),
          this.warningCounter += 1)
      },
      isNewUdSupported: function(a) { return a.getUserDictionary ? !0 : !1 },
      reloadMarkup: function(a) { var d;
        a && (d = a.getScaytLangList(), a.reloadMarkup ? a.reloadMarkup() : (this.alarmCompatibilityMessage(), d && d.ltr && d.rtl && a.fire("startSpellCheck, startGrammarCheck"))) },
      replaceOldOptionsNames: function(a) { for (var d in a) d in this.backCompatibilityMap && (a[this.backCompatibilityMap[d]] = a[d], delete a[d]) },
      createScayt: function(a) {
        var d = this,
          b = CKEDITOR.plugins.scayt;
        this.loadScaytLibrary(a, function(a) {
          function g(a) {
            return new SCAYT.CKSCAYT(a,
              function() {},
              function() {})
          }
          var l = a.window && a.window.getFrame() || a.editable();
          if (l) {
            l = {
              lang: a.config.scayt_sLang,
              container: l.$,
              customDictionary: a.config.scayt_customDictionaryIds,
              userDictionaryName: a.config.scayt_userDictionaryName,
              localization: a.langCode,
              customer_id: a.config.scayt_customerId,
              customPunctuation: a.config.scayt_customPunctuation,
              debug: a.config.scayt_debug,
              data_attribute_name: d.options.data_attribute_name,
              misspelled_word_class: d.options.misspelled_word_class,
              problem_grammar_data_attribute: d.options.problem_grammar_data_attribute,
              problem_grammar_class: d.options.problem_grammar_class,
              "options-to-restore": a.config.scayt_disableOptionsStorage,
              focused: a.editable().hasFocus,
              ignoreElementsRegex: a.config.scayt_elementsToIgnore,
              ignoreGraytElementsRegex: a.config.grayt_elementsToIgnore,
              minWordLength: a.config.scayt_minWordLength,
              multiLanguageMode: a.config.scayt_multiLanguageMode,
              multiLanguageStyles: a.config.scayt_multiLanguageStyles,
              graytAutoStartup: a.config.grayt_autoStartup,
              charsToObserve: b.charsToObserve
            };
            a.config.scayt_serviceProtocol &&
              (l.service_protocol = a.config.scayt_serviceProtocol);
            a.config.scayt_serviceHost && (l.service_host = a.config.scayt_serviceHost);
            a.config.scayt_servicePort && (l.service_port = a.config.scayt_servicePort);
            a.config.scayt_servicePath && (l.service_path = a.config.scayt_servicePath);
            "boolean" === typeof a.config.scayt_ignoreAllCapsWords && (l["ignore-all-caps-words"] = a.config.scayt_ignoreAllCapsWords);
            "boolean" === typeof a.config.scayt_ignoreDomainNames && (l["ignore-domain-names"] = a.config.scayt_ignoreDomainNames);
            "boolean" ===
            typeof a.config.scayt_ignoreWordsWithMixedCases && (l["ignore-words-with-mixed-cases"] = a.config.scayt_ignoreWordsWithMixedCases);
            "boolean" === typeof a.config.scayt_ignoreWordsWithNumbers && (l["ignore-words-with-numbers"] = a.config.scayt_ignoreWordsWithNumbers);
            var k;
            try { k = g(l) } catch (e) { d.alarmCompatibilityMessage(), delete l.charsToObserve, k = g(l) } k.subscribe("suggestionListSend", function(a) {
              for (var b = {}, c = [], e = 0; e < a.suggestionList.length; e++) b["word_" + a.suggestionList[e]] || (b["word_" + a.suggestionList[e]] =
                a.suggestionList[e], c.push(a.suggestionList[e]));
              CKEDITOR.plugins.scayt.suggestions = c
            });
            k.subscribe("selectionIsChanged", function(b) { a.getSelection().isLocked && "restoreSelection" !== b.action && a.lockSelection(); "restoreSelection" === b.action && a.selectionChange(!0) });
            k.subscribe("graytStateChanged", function(e) { b.state.grayt[a.name] = e.state });
            k.addMarkupHandler && k.addMarkupHandler(function(b) { var e = a.editable(),
                d = e.getCustomData(b.charName);
              d && (d.$ = b.node, e.setCustomData(b.charName, d)) });
            a.scayt = k;
            a.fire("scaytButtonState",
              a.readOnly ? CKEDITOR.TRISTATE_DISABLED : CKEDITOR.TRISTATE_ON)
          } else b.state.scayt[a.name] = !1
        })
      },
      destroy: function(a) { a.scayt && a.scayt.destroy();
        delete a.scayt;
        a.fire("scaytButtonState", CKEDITOR.TRISTATE_OFF) },
      loadScaytLibrary: function(a, d) {
        var b, c = function() { CKEDITOR.fireOnce("scaytReady");
          a.scayt || "function" === typeof d && d(a) };
        "undefined" === typeof window.SCAYT || "function" !== typeof window.SCAYT.CKSCAYT ? (b = a.config.scayt_srcUrl + "?" + this.onLoadTimestamp, CKEDITOR.scriptLoader.load(b, function(a) { a && c() })) :
          window.SCAYT && "function" === typeof window.SCAYT.CKSCAYT && c()
      }
    }, CKEDITOR.on("dialogDefinition", function(a) {
      var d = a.data.name;
      a = a.data.definition.dialog;
      "scaytDialog" !== d && "checkspell" !== d && (a.on("show", function(a) { a = a.sender && a.sender.getParentEditor(); var c = CKEDITOR.plugins.scayt,
          d = a.scayt;
        d && c.state.scayt[a.name] && d.setMarkupPaused && d.setMarkupPaused(!0) }), a.on("hide", function(a) {
        a = a.sender && a.sender.getParentEditor();
        var c = CKEDITOR.plugins.scayt,
          d = a.scayt;
        d && c.state.scayt[a.name] && d.setMarkupPaused &&
          d.setMarkupPaused(!1)
      }));
      if ("scaytDialog" === d) a.on("cancel", function(a) { return !1 }, this, null, -1);
      if ("checkspell" === d) a.on("cancel", function(a) { a = a.sender && a.sender.getParentEditor(); var c = CKEDITOR.plugins.scayt,
          d = a.scayt;
        d && c.state.scayt[a.name] && d.setMarkupPaused && d.setMarkupPaused(!1);
        a.unlockSelection() }, this, null, -2);
      if ("link" === d) a.on("ok", function(a) {
        var c = a.sender && a.sender.getParentEditor();
        c && setTimeout(function() {
          c.fire("reloadMarkupScayt", {
            removeOptions: { removeInside: !0, forceBookmark: !0 },
            timeout: 0
          })
        }, 0)
      });
      if ("replace" === d) a.on("hide", function(a) { a = a.sender && a.sender.getParentEditor(); var c = CKEDITOR.plugins.scayt,
          d = a.scayt;
        a && setTimeout(function() { d && (d.fire("removeMarkupInDocument", {}), c.reloadMarkup(d)) }, 0) })
    }), CKEDITOR.on("scaytReady", function() {
      if (!0 === CKEDITOR.config.scayt_handleCheckDirty) {
        var a = CKEDITOR.editor.prototype;
        a.checkDirty = CKEDITOR.tools.override(a.checkDirty, function(a) {
          return function() {
            var c = null,
              d = this.scayt;
            if (CKEDITOR.plugins.scayt && CKEDITOR.plugins.scayt.state.scayt[this.name] &&
              this.scayt) { if (c = "ready" == this.status) var l = d.removeMarkupFromString(this.getSnapshot()),
                d = d.removeMarkupFromString(this._.previousValue),
                c = c && d !== l } else c = a.call(this);
            return c
          }
        });
        a.resetDirty = CKEDITOR.tools.override(a.resetDirty, function(a) { return function() { var c = this.scayt;
            CKEDITOR.plugins.scayt && CKEDITOR.plugins.scayt.state.scayt[this.name] && this.scayt ? this._.previousValue = c.removeMarkupFromString(this.getSnapshot()) : a.call(this) } })
      }
      if (!0 === CKEDITOR.config.scayt_handleUndoRedo) {
        var a = CKEDITOR.plugins.undo.Image.prototype,
          d = "function" == typeof a.equalsContent ? "equalsContent" : "equals";
        a[d] = CKEDITOR.tools.override(a[d], function(a) { return function(c) { var d = c.editor.scayt,
              l = this.contents,
              k = c.contents,
              e = null;
            CKEDITOR.plugins.scayt && CKEDITOR.plugins.scayt.state.scayt[c.editor.name] && c.editor.scayt && (this.contents = d.removeMarkupFromString(l) || "", c.contents = d.removeMarkupFromString(k) || "");
            e = a.apply(this, arguments);
            this.contents = l;
            c.contents = k; return e } })
      }
    }),
    function() {
      CKEDITOR.plugins.add("selectall", {
        init: function(a) {
          a.addCommand("selectAll", { modes: { wysiwyg: 1, source: 1 }, exec: function(a) { var b = a.editable(); if (b.is("textarea")) a = b.$, CKEDITOR.env.ie && a.createTextRange ? a.createTextRange().execCommand("SelectAll") : (a.selectionStart = 0, a.selectionEnd = a.value.length), a.focus();
              else { if (b.is("body")) a.document.$.execCommand("SelectAll", !1, null);
                else { var c = a.createRange();
                  c.selectNodeContents(b);
                  c.select() } a.forceNextSelectionCheck();
                a.selectionChange() } }, canUndo: !1 });
          a.ui.addButton && a.ui.addButton("SelectAll", {
            label: a.lang.selectall.toolbar,
            command: "selectAll",
            toolbar: "selection,10"
          })
        }
      })
    }(),
    function() {
      var a = { readOnly: 1, preserveState: !0, editorFocus: !1, exec: function(a) { this.toggleState();
          this.refresh(a) }, refresh: function(a) { if (a.document) { var b = this.state != CKEDITOR.TRISTATE_ON || a.elementMode == CKEDITOR.ELEMENT_MODE_INLINE && !a.focusManager.hasFocus ? "removeClass" : "attachClass";
            a.editable()[b]("cke_show_blocks") } } };
      CKEDITOR.plugins.add("showblocks", {
        onLoad: function() {
          var a = "p div pre address blockquote h1 h2 h3 h4 h5 h6".split(" "),
            b, c, g, l, k = CKEDITOR.getUrl(this.path),
            e = !(CKEDITOR.env.ie && 9 > CKEDITOR.env.version),
            h = e ? ":not([contenteditable\x3dfalse]):not(.cke_show_blocks_off)" : "",
            m, f;
          for (b = c = g = l = ""; m = a.pop();) f = a.length ? "," : "", b += ".cke_show_blocks " + m + h + f, g += ".cke_show_blocks.cke_contents_ltr " + m + h + f, l += ".cke_show_blocks.cke_contents_rtl " + m + h + f, c += ".cke_show_blocks " + m + h + "{background-image:url(" + CKEDITOR.getUrl(k + "images/block_" + m + ".png") + ")}";
          CKEDITOR.addCss((b + "{background-repeat:no-repeat;border:1px dotted gray;padding-top:8px}").concat(c, g + "{background-position:top left;padding-left:8px}",
            l + "{background-position:top right;padding-right:8px}"));
          e || CKEDITOR.addCss(".cke_show_blocks [contenteditable\x3dfalse],.cke_show_blocks .cke_show_blocks_off{border:none;padding-top:0;background-image:none}.cke_show_blocks.cke_contents_rtl [contenteditable\x3dfalse],.cke_show_blocks.cke_contents_rtl .cke_show_blocks_off{padding-right:0}.cke_show_blocks.cke_contents_ltr [contenteditable\x3dfalse],.cke_show_blocks.cke_contents_ltr .cke_show_blocks_off{padding-left:0}")
        },
        init: function(d) {
          function b() { c.refresh(d) }
          if (!d.blockless) { var c = d.addCommand("showblocks", a);
            c.canUndo = !1;
            d.config.startupOutlineBlocks && c.setState(CKEDITOR.TRISTATE_ON);
            d.ui.addButton && d.ui.addButton("ShowBlocks", { label: d.lang.showblocks.toolbar, command: "showblocks", toolbar: "tools,20" });
            d.on("mode", function() { c.state != CKEDITOR.TRISTATE_DISABLED && c.refresh(d) });
            d.elementMode == CKEDITOR.ELEMENT_MODE_INLINE && (d.on("focus", b), d.on("blur", b));
            d.on("contentDom", function() { c.state != CKEDITOR.TRISTATE_DISABLED && c.refresh(d) }) }
        }
      })
    }(),
    function() {
      var a = { preserveState: !0, editorFocus: !1, readOnly: 1, exec: function(a) { this.toggleState();
          this.refresh(a) }, refresh: function(a) { if (a.document) { var b = this.state == CKEDITOR.TRISTATE_ON ? "attachClass" : "removeClass";
            a.editable()[b]("cke_show_borders") } } };
      CKEDITOR.plugins.add("showborders", {
        modes: { wysiwyg: 1 },
        onLoad: function() {
          var a;
          a = (CKEDITOR.env.ie6Compat ? [".%1 table.%2,", ".%1 table.%2 td, .%1 table.%2 th", "{", "border : #d3d3d3 1px dotted", "}"] : ".%1 table.%2,;.%1 table.%2 \x3e tr \x3e td, .%1 table.%2 \x3e tr \x3e th,;.%1 table.%2 \x3e tbody \x3e tr \x3e td, .%1 table.%2 \x3e tbody \x3e tr \x3e th,;.%1 table.%2 \x3e thead \x3e tr \x3e td, .%1 table.%2 \x3e thead \x3e tr \x3e th,;.%1 table.%2 \x3e tfoot \x3e tr \x3e td, .%1 table.%2 \x3e tfoot \x3e tr \x3e th;{;border : #d3d3d3 1px dotted;}".split(";")).join("").replace(/%2/g,
            "cke_show_border").replace(/%1/g, "cke_show_borders ");
          CKEDITOR.addCss(a)
        },
        init: function(d) {
          var b = d.addCommand("showborders", a);
          b.canUndo = !1;
          !1 !== d.config.startupShowBorders && b.setState(CKEDITOR.TRISTATE_ON);
          d.on("mode", function() { b.state != CKEDITOR.TRISTATE_DISABLED && b.refresh(d) }, null, null, 100);
          d.on("contentDom", function() { b.state != CKEDITOR.TRISTATE_DISABLED && b.refresh(d) });
          d.on("removeFormatCleanup", function(a) {
            a = a.data;
            d.getCommand("showborders").state == CKEDITOR.TRISTATE_ON && a.is("table") && (!a.hasAttribute("border") ||
              0 >= parseInt(a.getAttribute("border"), 10)) && a.addClass("cke_show_border")
          })
        },
        afterInit: function(a) {
          var b = a.dataProcessor;
          a = b && b.dataFilter;
          b = b && b.htmlFilter;
          a && a.addRules({ elements: { table: function(a) { a = a.attributes; var b = a["class"],
                  d = parseInt(a.border, 10);
                d && !(0 >= d) || b && -1 != b.indexOf("cke_show_border") || (a["class"] = (b || "") + " cke_show_border") } } });
          b && b.addRules({
            elements: {
              table: function(a) {
                a = a.attributes;
                var b = a["class"];
                b && (a["class"] = b.replace("cke_show_border", "").replace(/\s{2}/, " ").replace(/^\s+|\s+$/,
                  ""))
              }
            }
          })
        }
      });
      CKEDITOR.on("dialogDefinition", function(a) {
        var b = a.data.name;
        if ("table" == b || "tableProperties" == b)
          if (a = a.data.definition, b = a.getContents("info").get("txtBorder"), b.commit = CKEDITOR.tools.override(b.commit, function(a) { return function(b, d) { a.apply(this, arguments); var k = parseInt(this.getValue(), 10);
                d[!k || 0 >= k ? "addClass" : "removeClass"]("cke_show_border") } }), a = (a = a.getContents("advanced")) && a.get("advCSSClasses")) a.setup = CKEDITOR.tools.override(a.setup, function(a) {
            return function() {
              a.apply(this,
                arguments);
              this.setValue(this.getValue().replace(/cke_show_border/, ""))
            }
          }), a.commit = CKEDITOR.tools.override(a.commit, function(a) { return function(b, d) { a.apply(this, arguments);
              parseInt(d.getAttribute("border"), 10) || d.addClass("cke_show_border") } })
      })
    }(), CKEDITOR.plugins.add("smiley", {
      requires: "dialog",
      init: function(a) {
        a.config.smiley_path = a.config.smiley_path || this.path + "images/";
        a.addCommand("smiley", new CKEDITOR.dialogCommand("smiley", { allowedContent: "img[alt,height,!src,title,width]", requiredContent: "img" }));
        a.ui.addButton && a.ui.addButton("Smiley", { label: a.lang.smiley.toolbar, command: "smiley", toolbar: "insert,50" });
        CKEDITOR.dialog.add("smiley", this.path + "dialogs/smiley.js")
      }
    }), CKEDITOR.config.smiley_images = "regular_smile.png sad_smile.png wink_smile.png teeth_smile.png confused_smile.png tongue_smile.png embarrassed_smile.png omg_smile.png whatchutalkingabout_smile.png angry_smile.png angel_smile.png shades_smile.png devil_smile.png cry_smile.png lightbulb.png thumbs_down.png thumbs_up.png heart.png broken_heart.png kiss.png envelope.png".split(" "),
    CKEDITOR.config.smiley_descriptions = "smiley;sad;wink;laugh;frown;cheeky;blush;surprise;indecision;angry;angel;cool;devil;crying;enlightened;no;yes;heart;broken heart;kiss;mail".split(";"),
    function() {
      CKEDITOR.plugins.add("sourcearea", {
        init: function(d) {
          function b() { var a = g && this.equals(CKEDITOR.document.getActive());
            this.hide();
            this.setStyle("height", this.getParent().$.clientHeight + "px");
            this.setStyle("width", this.getParent().$.clientWidth + "px");
            this.show();
            a && this.focus() }
          if (d.elementMode != CKEDITOR.ELEMENT_MODE_INLINE) {
            var c =
              CKEDITOR.plugins.sourcearea;
            d.addMode("source", function(c) {
              var g = d.ui.space("contents").getDocument().createElement("textarea");
              g.setStyles(CKEDITOR.tools.extend({ width: CKEDITOR.env.ie7Compat ? "99%" : "100%", height: "100%", resize: "none", outline: "none", "text-align": "left" }, CKEDITOR.tools.cssVendorPrefix("tab-size", d.config.sourceAreaTabSize || 4)));
              g.setAttribute("dir", "ltr");
              g.addClass("cke_source").addClass("cke_reset").addClass("cke_enable_context_menu");
              d.ui.space("contents").append(g);
              g = d.editable(new a(d,
                g));
              g.setData(d.getData(1));
              CKEDITOR.env.ie && (g.attachListener(d, "resize", b, g), g.attachListener(CKEDITOR.document.getWindow(), "resize", b, g), CKEDITOR.tools.setTimeout(b, 0, g));
              d.fire("ariaWidget", this);
              c()
            });
            d.addCommand("source", c.commands.source);
            d.ui.addButton && d.ui.addButton("Source", { label: d.lang.sourcearea.toolbar, command: "source", toolbar: "mode,10" });
            d.on("mode", function() { d.getCommand("source").setState("source" == d.mode ? CKEDITOR.TRISTATE_ON : CKEDITOR.TRISTATE_OFF) });
            var g = CKEDITOR.env.ie && 9 ==
              CKEDITOR.env.version
          }
        }
      });
      var a = CKEDITOR.tools.createClass({ base: CKEDITOR.editable, proto: { setData: function(a) { this.setValue(a);
            this.status = "ready";
            this.editor.fire("dataReady") }, getData: function() { return this.getValue() }, insertHtml: function() {}, insertElement: function() {}, insertText: function() {}, setReadOnly: function(a) { this[(a ? "set" : "remove") + "Attribute"]("readOnly", "readonly") }, detach: function() { a.baseProto.detach.call(this);
            this.clearCustomData();
            this.remove() } } })
    }(), CKEDITOR.plugins.sourcearea = {
      commands: {
        source: {
          modes: {
            wysiwyg: 1,
            source: 1
          },
          editorFocus: !1,
          readOnly: 1,
          exec: function(a) { "wysiwyg" == a.mode && a.fire("saveSnapshot");
            a.getCommand("source").setState(CKEDITOR.TRISTATE_DISABLED);
            a.setMode("source" == a.mode ? "wysiwyg" : "source") },
          canUndo: !1
        }
      }
    }, CKEDITOR.plugins.add("specialchar", {
      availableLangs: {
        af: 1,
        ar: 1,
        az: 1,
        bg: 1,
        ca: 1,
        cs: 1,
        cy: 1,
        da: 1,
        de: 1,
        "de-ch": 1,
        el: 1,
        en: 1,
        "en-au": 1,
        "en-ca": 1,
        "en-gb": 1,
        eo: 1,
        es: 1,
        "es-mx": 1,
        et: 1,
        eu: 1,
        fa: 1,
        fi: 1,
        fr: 1,
        "fr-ca": 1,
        gl: 1,
        he: 1,
        hr: 1,
        hu: 1,
        id: 1,
        it: 1,
        ja: 1,
        km: 1,
        ko: 1,
        ku: 1,
        lt: 1,
        lv: 1,
        nb: 1,
        nl: 1,
        no: 1,
        oc: 1,
        pl: 1,
        pt: 1,
        "pt-br": 1,
        ro: 1,
        ru: 1,
        si: 1,
        sk: 1,
        sl: 1,
        sq: 1,
        sv: 1,
        th: 1,
        tr: 1,
        tt: 1,
        ug: 1,
        uk: 1,
        vi: 1,
        zh: 1,
        "zh-cn": 1
      },
      requires: "dialog",
      init: function(a) {
        var d = this;
        CKEDITOR.dialog.add("specialchar", this.path + "dialogs/specialchar.js");
        a.addCommand("specialchar", {
          exec: function() {
            var b = a.langCode,
              b = d.availableLangs[b] ? b : d.availableLangs[b.replace(/-.*/, "")] ? b.replace(/-.*/, "") : "en";
            CKEDITOR.scriptLoader.load(CKEDITOR.getUrl(d.path + "dialogs/lang/" + b + ".js"), function() {
              CKEDITOR.tools.extend(a.lang.specialchar, d.langEntries[b]);
              a.openDialog("specialchar")
            })
          },
          modes: { wysiwyg: 1 },
          canUndo: !1
        });
        a.ui.addButton && a.ui.addButton("SpecialChar", { label: a.lang.specialchar.toolbar, command: "specialchar", toolbar: "insert,50" })
      }
    }), CKEDITOR.config.specialChars = "! \x26quot; # $ % \x26amp; ' ( ) * + - . / 0 1 2 3 4 5 6 7 8 9 : ; \x26lt; \x3d \x26gt; ? @ A B C D E F G H I J K L M N O P Q R S T U V W X Y Z [ ] ^ _ ` a b c d e f g h i j k l m n o p q r s t u v w x y z { | } ~ \x26euro; \x26lsquo; \x26rsquo; \x26ldquo; \x26rdquo; \x26ndash; \x26mdash; \x26iexcl; \x26cent; \x26pound; \x26curren; \x26yen; \x26brvbar; \x26sect; \x26uml; \x26copy; \x26ordf; \x26laquo; \x26not; \x26reg; \x26macr; \x26deg; \x26sup2; \x26sup3; \x26acute; \x26micro; \x26para; \x26middot; \x26cedil; \x26sup1; \x26ordm; \x26raquo; \x26frac14; \x26frac12; \x26frac34; \x26iquest; \x26Agrave; \x26Aacute; \x26Acirc; \x26Atilde; \x26Auml; \x26Aring; \x26AElig; \x26Ccedil; \x26Egrave; \x26Eacute; \x26Ecirc; \x26Euml; \x26Igrave; \x26Iacute; \x26Icirc; \x26Iuml; \x26ETH; \x26Ntilde; \x26Ograve; \x26Oacute; \x26Ocirc; \x26Otilde; \x26Ouml; \x26times; \x26Oslash; \x26Ugrave; \x26Uacute; \x26Ucirc; \x26Uuml; \x26Yacute; \x26THORN; \x26szlig; \x26agrave; \x26aacute; \x26acirc; \x26atilde; \x26auml; \x26aring; \x26aelig; \x26ccedil; \x26egrave; \x26eacute; \x26ecirc; \x26euml; \x26igrave; \x26iacute; \x26icirc; \x26iuml; \x26eth; \x26ntilde; \x26ograve; \x26oacute; \x26ocirc; \x26otilde; \x26ouml; \x26divide; \x26oslash; \x26ugrave; \x26uacute; \x26ucirc; \x26uuml; \x26yacute; \x26thorn; \x26yuml; \x26OElig; \x26oelig; \x26#372; \x26#374 \x26#373 \x26#375; \x26sbquo; \x26#8219; \x26bdquo; \x26hellip; \x26trade; \x26#9658; \x26bull; \x26rarr; \x26rArr; \x26hArr; \x26diams; \x26asymp;".split(" "),
    function() {
      CKEDITOR.plugins.add("stylescombo", {
        requires: "richcombo",
        init: function(a) {
          var d = a.config,
            b = a.lang.stylescombo,
            c = {},
            g = [],
            l = [];
          a.on("stylesSet", function(b) {
            if (b = b.data.styles) {
              for (var e, h, m, f = 0, n = b.length; f < n; f++)(e = b[f], a.blockless && e.element in CKEDITOR.dtd.$block || "string" == typeof e.type && !CKEDITOR.style.customHandlers[e.type] || (h = e.name, e = new CKEDITOR.style(e), a.filter.customConfig && !a.filter.check(e))) || (e._name = h, e._.enterMode = d.enterMode, e._.type = m = e.assignedTo || e.type, e._.weight =
                f + 1E3 * (m == CKEDITOR.STYLE_OBJECT ? 1 : m == CKEDITOR.STYLE_BLOCK ? 2 : 3), c[h] = e, g.push(e), l.push(e));
              g.sort(function(a, b) { return a._.weight - b._.weight })
            }
          });
          a.ui.addRichCombo("Styles", {
            label: b.label,
            title: b.panelTitle,
            toolbar: "styles,10",
            allowedContent: l,
            panel: { css: [CKEDITOR.skin.getPath("editor")].concat(d.contentsCss), multiSelect: !0, attributes: { "aria-label": b.panelTitle } },
            init: function() {
              var a, c, d, l, f, n;
              f = 0;
              for (n = g.length; f < n; f++) a = g[f], c = a._name, l = a._.type, l != d && (this.startGroup(b["panelTitle" + String(l)]),
                d = l), this.add(c, a.type == CKEDITOR.STYLE_OBJECT ? c : a.buildPreview(), c);
              this.commit()
            },
            onClick: function(b) { a.focus();
              a.fire("saveSnapshot");
              b = c[b]; var e = a.elementPath(); if (b.group && b.removeStylesFromSameGroup(a)) a.applyStyle(b);
              else a[b.checkActive(e, a) ? "removeStyle" : "applyStyle"](b);
              a.fire("saveSnapshot") },
            onRender: function() {
              a.on("selectionChange", function(b) {
                var e = this.getValue();
                b = b.data.path.elements;
                for (var d = 0, g = b.length, f; d < g; d++) {
                  f = b[d];
                  for (var l in c)
                    if (c[l].checkElementRemovable(f, !0, a)) {
                      l !=
                        e && this.setValue(l);
                      return
                    }
                }
                this.setValue("")
              }, this)
            },
            onOpen: function() {
              var d = a.getSelection(),
                d = d.getSelectedElement() || d.getStartElement() || a.editable(),
                d = a.elementPath(d),
                e = [0, 0, 0, 0];
              this.showAll();
              this.unmarkAll();
              for (var g in c) { var l = c[g],
                  f = l._.type;
                l.checkApplicable(d, a, a.activeFilter) ? e[f]++ : this.hideItem(g);
                l.checkActive(d, a) && this.mark(g) } e[CKEDITOR.STYLE_BLOCK] || this.hideGroup(b["panelTitle" + String(CKEDITOR.STYLE_BLOCK)]);
              e[CKEDITOR.STYLE_INLINE] || this.hideGroup(b["panelTitle" + String(CKEDITOR.STYLE_INLINE)]);
              e[CKEDITOR.STYLE_OBJECT] || this.hideGroup(b["panelTitle" + String(CKEDITOR.STYLE_OBJECT)])
            },
            refresh: function() { var b = a.elementPath(); if (b) { for (var e in c)
                  if (c[e].checkApplicable(b, a, a.activeFilter)) return;
                this.setState(CKEDITOR.TRISTATE_DISABLED) } },
            reset: function() { c = {};
              g = [] }
          })
        }
      })
    }(),
    function() {
      function a(a) {
        return {
          editorFocus: !1,
          canUndo: !1,
          modes: { wysiwyg: 1 },
          exec: function(b) {
            if (b.editable().hasFocus) {
              var c = b.getSelection(),
                e;
              if (e = (new CKEDITOR.dom.elementPath(c.getCommonAncestor(), c.root)).contains({
                  td: 1,
                  th: 1
                }, 1)) {
                var c = b.createRange(),
                  d = CKEDITOR.tools.tryThese(function() { var b = e.getParent().$.cells[e.$.cellIndex + (a ? -1 : 1)];
                    b.parentNode.parentNode; return b }, function() { var b = e.getParent(),
                      b = b.getAscendant("table").$.rows[b.$.rowIndex + (a ? -1 : 1)]; return b.cells[a ? b.cells.length - 1 : 0] });
                if (d || a)
                  if (d) d = new CKEDITOR.dom.element(d), c.moveToElementEditStart(d), c.checkStartOfBlock() && c.checkEndOfBlock() || c.selectNodeContents(d);
                  else return !0;
                else {
                  for (var m = e.getAscendant("table").$, d = e.getParent().$.cells, m =
                      new CKEDITOR.dom.element(m.insertRow(-1), b.document), f = 0, n = d.length; f < n; f++) m.append((new CKEDITOR.dom.element(d[f], b.document)).clone(!1, !1)).appendBogus();
                  c.moveToElementEditStart(m)
                }
                c.select(!0);
                return !0
              }
            }
            return !1
          }
        }
      }
      var d = { editorFocus: !1, modes: { wysiwyg: 1, source: 1 } },
        b = { exec: function(a) { a.container.focusNext(!0, a.tabIndex) } },
        c = { exec: function(a) { a.container.focusPrevious(!0, a.tabIndex) } };
      CKEDITOR.plugins.add("tab", {
        init: function(g) {
          for (var l = !1 !== g.config.enableTabKeyTools, k = g.config.tabSpaces || 0,
              e = ""; k--;) e += " ";
          if (e) g.on("key", function(a) { 9 == a.data.keyCode && (g.insertText(e), a.cancel()) });
          if (l) g.on("key", function(a) {
            (9 == a.data.keyCode && g.execCommand("selectNextCell") || a.data.keyCode == CKEDITOR.SHIFT + 9 && g.execCommand("selectPreviousCell")) && a.cancel() });
          g.addCommand("blur", CKEDITOR.tools.extend(b, d));
          g.addCommand("blurBack", CKEDITOR.tools.extend(c, d));
          g.addCommand("selectNextCell", a());
          g.addCommand("selectPreviousCell", a(!0))
        }
      })
    }(), CKEDITOR.dom.element.prototype.focusNext = function(a, d) {
      var b =
        void 0 === d ? this.getTabIndex() : d,
        c, g, l, k, e, h;
      if (0 >= b)
        for (e = this.getNextSourceNode(a, CKEDITOR.NODE_ELEMENT); e;) { if (e.isVisible() && 0 === e.getTabIndex()) { l = e; break } e = e.getNextSourceNode(!1, CKEDITOR.NODE_ELEMENT) } else
          for (e = this.getDocument().getBody().getFirst(); e = e.getNextSourceNode(!1, CKEDITOR.NODE_ELEMENT);) {
            if (!c)
              if (!g && e.equals(this)) { if (g = !0, a) { if (!(e = e.getNextSourceNode(!0, CKEDITOR.NODE_ELEMENT))) break;
                  c = 1 } } else g && !this.contains(e) && (c = 1);
            if (e.isVisible() && !(0 > (h = e.getTabIndex()))) {
              if (c && h == b) {
                l =
                  e;
                break
              }
              h > b && (!l || !k || h < k) ? (l = e, k = h) : l || 0 !== h || (l = e, k = h)
            }
          }
      l && l.focus()
    }, CKEDITOR.dom.element.prototype.focusPrevious = function(a, d) {
      for (var b = void 0 === d ? this.getTabIndex() : d, c, g, l, k = 0, e, h = this.getDocument().getBody().getLast(); h = h.getPreviousSourceNode(!1, CKEDITOR.NODE_ELEMENT);) {
        if (!c)
          if (!g && h.equals(this)) { if (g = !0, a) { if (!(h = h.getPreviousSourceNode(!0, CKEDITOR.NODE_ELEMENT))) break;
              c = 1 } } else g && !this.contains(h) && (c = 1);
        if (h.isVisible() && !(0 > (e = h.getTabIndex())))
          if (0 >= b) {
            if (c && 0 === e) { l = h; break } e > k &&
              (l = h, k = e)
          } else { if (c && e == b) { l = h; break } e < b && (!l || e > k) && (l = h, k = e) }
      }
      l && l.focus()
    }, CKEDITOR.plugins.add("table", {
      requires: "dialog",
      init: function(a) {
        function d(a) { return CKEDITOR.tools.extend(a || {}, { contextSensitive: 1, refresh: function(a, b) { this.setState(b.contains("table", 1) ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED) } }) }
        if (!a.blockless) {
          var b = a.lang.table;
          a.addCommand("table", new CKEDITOR.dialogCommand("table", {
            context: "table",
            allowedContent: "table{width,height}[align,border,cellpadding,cellspacing,summary];caption tbody thead tfoot;th td tr[scope];" +
              (a.plugins.dialogadvtab ? "table" + a.plugins.dialogadvtab.allowedContent() : ""),
            requiredContent: "table",
            contentTransformations: [
              ["table{width}: sizeToStyle", "table[width]: sizeToAttribute"],
              ["td: splitBorderShorthand"],
              [{
                element: "table",
                right: function(a) {
                  if (a.styles) {
                    var b;
                    if (a.styles.border) b = CKEDITOR.tools.style.parse.border(a.styles.border);
                    else if (CKEDITOR.env.ie && 8 === CKEDITOR.env.version) {
                      var d = a.styles;
                      d["border-left"] && d["border-left"] === d["border-right"] && d["border-right"] === d["border-top"] &&
                        d["border-top"] === d["border-bottom"] && (b = CKEDITOR.tools.style.parse.border(d["border-top"]))
                    }
                    b && b.style && "solid" === b.style && b.width && 0 !== parseFloat(b.width) && (a.attributes.border = 1);
                    "collapse" == a.styles["border-collapse"] && (a.attributes.cellspacing = 0)
                  }
                }
              }]
            ]
          }));
          a.addCommand("tableProperties", new CKEDITOR.dialogCommand("tableProperties", d()));
          a.addCommand("tableDelete", d({
            exec: function(a) {
              var b = a.elementPath().contains("table", 1);
              if (b) {
                var d = b.getParent(),
                  k = a.editable();
                1 != d.getChildCount() || d.is("td",
                  "th") || d.equals(k) || (b = d);
                a = a.createRange();
                a.moveToPosition(b, CKEDITOR.POSITION_BEFORE_START);
                b.remove();
                a.select()
              }
            }
          }));
          a.ui.addButton && a.ui.addButton("Table", { label: b.toolbar, command: "table", toolbar: "insert,30" });
          CKEDITOR.dialog.add("table", this.path + "dialogs/table.js");
          CKEDITOR.dialog.add("tableProperties", this.path + "dialogs/table.js");
          a.addMenuItems && a.addMenuItems({
            table: { label: b.menu, command: "tableProperties", group: "table", order: 5 },
            tabledelete: {
              label: b.deleteTable,
              command: "tableDelete",
              group: "table",
              order: 1
            }
          });
          a.on("doubleclick", function(a) { a.data.element.is("table") && (a.data.dialog = "tableProperties") });
          a.contextMenu && a.contextMenu.addListener(function() { return { tabledelete: CKEDITOR.TRISTATE_OFF, table: CKEDITOR.TRISTATE_OFF } })
        }
      }
    }),
    function() {
      function a(a, b) {
        function c(a) { return b ? b.contains(a) && a.getAscendant("table", !0).equals(b) : !0 }

        function e(a) {
          0 < d.length || a.type != CKEDITOR.NODE_ELEMENT || !w.test(a.getName()) || a.getCustomData("selected_cell") || (CKEDITOR.dom.element.setMarker(f, a, "selected_cell", !0), d.push(a))
        }
        var d = [],
          f = {};
        if (!a) return d;
        for (var g = a.getRanges(), h = 0; h < g.length; h++) { var k = g[h]; if (k.collapsed)(k = k.getCommonAncestor().getAscendant({ td: 1, th: 1 }, !0)) && c(k) && d.push(k);
          else { var k = new CKEDITOR.dom.walker(k),
              l; for (k.guard = e; l = k.next();) l.type == CKEDITOR.NODE_ELEMENT && l.is(CKEDITOR.dtd.table) || (l = l.getAscendant({ td: 1, th: 1 }, !0)) && !l.getCustomData("selected_cell") && c(l) && (CKEDITOR.dom.element.setMarker(f, l, "selected_cell", !0), d.push(l)) } } CKEDITOR.dom.element.clearAllMarkers(f);
        return d
      }

      function d(b, c) {
        for (var e = v(b) ? b : a(b), d = e[0], f = d.getAscendant("table"), d = d.getDocument(), g = e[0].getParent(), h = g.$.rowIndex, e = e[e.length - 1], k = e.getParent().$.rowIndex + e.$.rowSpan - 1, e = new CKEDITOR.dom.element(f.$.rows[k]), h = c ? h : k, g = c ? g : e, e = CKEDITOR.tools.buildTableMap(f), f = e[h], h = c ? e[h - 1] : e[h + 1], e = e[0].length, d = d.createElement("tr"), k = 0; f[k] && k < e; k++) {
          var l;
          1 < f[k].rowSpan && h && f[k] == h[k] ? (l = f[k], l.rowSpan += 1) : (l = (new CKEDITOR.dom.element(f[k])).clone(), l.removeAttribute("rowSpan"), l.appendBogus(), d.append(l),
            l = l.$);
          k += l.colSpan - 1
        }
        c ? d.insertBefore(g) : d.insertAfter(g);
        return d
      }

      function b(c) {
        if (c instanceof CKEDITOR.dom.selection) {
          var e = c.getRanges(),
            d = a(c),
            f = d[0].getAscendant("table"),
            g = CKEDITOR.tools.buildTableMap(f),
            h = d[0].getParent().$.rowIndex,
            d = d[d.length - 1],
            k = d.getParent().$.rowIndex + d.$.rowSpan - 1,
            d = [];
          c.reset();
          for (c = h; c <= k; c++) {
            for (var l = g[c], m = new CKEDITOR.dom.element(f.$.rows[c]), n = 0; n < l.length; n++) {
              var p = new CKEDITOR.dom.element(l[n]),
                q = p.getParent().$.rowIndex;
              1 == p.$.rowSpan ? p.remove() : (--p.$.rowSpan,
                q == c && (q = g[c + 1], q[n - 1] ? p.insertAfter(new CKEDITOR.dom.element(q[n - 1])) : (new CKEDITOR.dom.element(f.$.rows[c + 1])).append(p, 1)));
              n += p.$.colSpan - 1
            }
            d.push(m)
          }
          g = f.$.rows;
          e[0].moveToPosition(f, CKEDITOR.POSITION_BEFORE_START);
          h = new CKEDITOR.dom.element(g[k + 1] || (0 < h ? g[h - 1] : null) || f.$.parentNode);
          for (c = d.length; 0 <= c; c--) b(d[c]);
          return f.$.parentNode ? h : (e[0].select(), null)
        }
        c instanceof CKEDITOR.dom.element && (f = c.getAscendant("table"), 1 == f.$.rows.length ? f.remove() : c.remove());
        return null
      }

      function c(a) {
        for (var b =
            a.getParent().$.cells, c = 0, e = 0; e < b.length; e++) { var d = b[e],
            c = c + d.colSpan; if (d == a.$) break }
        return c - 1
      }

      function g(a, b) { for (var e = b ? Infinity : 0, d = 0; d < a.length; d++) { var f = c(a[d]); if (b ? f < e : f > e) e = f } return e }

      function l(b, c) {
        for (var e = v(b) ? b : a(b), d = e[0].getAscendant("table"), f = g(e, 1), e = g(e), h = c ? f : e, k = CKEDITOR.tools.buildTableMap(d), d = [], f = [], e = [], l = k.length, m = 0; m < l; m++) d.push(k[m][h]), f.push(c ? k[m][h - 1] : k[m][h + 1]);
        for (m = 0; m < l; m++) d[m] && (1 < d[m].colSpan && f[m] == d[m] ? (k = d[m], k.colSpan += 1) : (h = new CKEDITOR.dom.element(d[m]),
          k = h.clone(), k.removeAttribute("colSpan"), k.appendBogus(), k[c ? "insertBefore" : "insertAfter"].call(k, h), e.push(k), k = k.$), m += k.rowSpan - 1);
        return e
      }

      function k(b) {
        function c(a) {
          var b, e, d;
          b = a.getRanges();
          if (1 !== b.length) return a;
          b = b[0];
          if (b.collapsed || 0 !== b.endOffset) return a;
          e = b.endContainer;
          d = e.getName().toLowerCase();
          if ("td" !== d && "th" !== d) return a;
          for ((d = e.getPrevious()) || (d = e.getParent().getPrevious().getLast()); d.type !== CKEDITOR.NODE_TEXT && "br" !== d.getName().toLowerCase();)
            if (d = d.getLast(), !d) return a;
          b.setEndAt(d, CKEDITOR.POSITION_BEFORE_END);
          return b.select()
        }
        CKEDITOR.env.webkit && !b.isFake && (b = c(b));
        var e = b.getRanges(),
          d = a(b),
          f = d[0],
          g = d[d.length - 1],
          d = f.getAscendant("table"),
          h = CKEDITOR.tools.buildTableMap(d),
          k, l, m = [];
        b.reset();
        var n = 0;
        for (b = h.length; n < b; n++)
          for (var p = 0, q = h[n].length; p < q; p++) void 0 === k && h[n][p] == f.$ && (k = p), h[n][p] == g.$ && (l = p);
        for (n = k; n <= l; n++)
          for (p = 0; p < h.length; p++) g = h[p], f = new CKEDITOR.dom.element(d.$.rows[p]), g = new CKEDITOR.dom.element(g[n]), g.$ && (1 == g.$.colSpan ? g.remove() : --g.$.colSpan,
            p += g.$.rowSpan - 1, f.$.cells.length || m.push(f));
        k = h[0].length - 1 > l ? new CKEDITOR.dom.element(h[0][l + 1]) : k && -1 !== h[0][k - 1].cellIndex ? new CKEDITOR.dom.element(h[0][k - 1]) : new CKEDITOR.dom.element(d.$.parentNode);
        m.length == b && (e[0].moveToPosition(d, CKEDITOR.POSITION_AFTER_END), e[0].select(), d.remove());
        return k
      }

      function e(a, b) { var c = a.getStartElement().getAscendant({ td: 1, th: 1 }, !0); if (c) { var e = c.clone();
          e.appendBogus();
          b ? e.insertBefore(c) : e.insertAfter(c) } }

      function h(b) {
        if (b instanceof CKEDITOR.dom.selection) {
          var c =
            b.getRanges(),
            e = a(b),
            d = e[0] && e[0].getAscendant("table"),
            f;
          a: { var g = 0;f = e.length - 1; for (var k = {}, l, n; l = e[g++];) CKEDITOR.dom.element.setMarker(k, l, "delete_cell", !0); for (g = 0; l = e[g++];)
              if ((n = l.getPrevious()) && !n.getCustomData("delete_cell") || (n = l.getNext()) && !n.getCustomData("delete_cell")) { CKEDITOR.dom.element.clearAllMarkers(k);
                f = n; break a }
            CKEDITOR.dom.element.clearAllMarkers(k);g = e[0].getParent();
            (g = g.getPrevious()) ? f = g.getLast() : (g = e[f].getParent(), f = (g = g.getNext()) ? g.getChild(0) : null) } b.reset();
          for (b =
            e.length - 1; 0 <= b; b--) h(e[b]);
          f ? m(f, !0) : d && (c[0].moveToPosition(d, CKEDITOR.POSITION_BEFORE_START), c[0].select(), d.remove())
        } else b instanceof CKEDITOR.dom.element && (c = b.getParent(), 1 == c.getChildCount() ? c.remove() : b.remove())
      }

      function m(a, b) { var c = a.getDocument(),
          e = CKEDITOR.document;
        CKEDITOR.env.ie && 10 == CKEDITOR.env.version && (e.focus(), c.focus());
        c = new CKEDITOR.dom.range(c);
        c["moveToElementEdit" + (b ? "End" : "Start")](a) || (c.selectNodeContents(a), c.collapse(b ? !1 : !0));
        c.select(!0) }

      function f(a, b, c) {
        a = a[b];
        if ("undefined" == typeof c) return a;
        for (b = 0; a && b < a.length; b++) { if (c.is && a[b] == c.$) return b; if (b == c) return new CKEDITOR.dom.element(a[b]) }
        return c.is ? -1 : null
      }

      function n(b, c, e) {
        var d = a(b),
          g;
        if ((c ? 1 != d.length : 2 > d.length) || (g = b.getCommonAncestor()) && g.type == CKEDITOR.NODE_ELEMENT && g.is("table")) return !1;
        var h;
        b = d[0];
        g = b.getAscendant("table");
        var k = CKEDITOR.tools.buildTableMap(g),
          l = k.length,
          m = k[0].length,
          n = b.getParent().$.rowIndex,
          p = f(k, n, b);
        if (c) {
          var q;
          try {
            var w = parseInt(b.getAttribute("rowspan"), 10) || 1;
            h = parseInt(b.getAttribute("colspan"), 10) || 1;
            q = k["up" == c ? n - w : "down" == c ? n + w : n]["left" == c ? p - h : "right" == c ? p + h : p]
          } catch (v) { return !1 }
          if (!q || b.$ == q) return !1;
          d["up" == c || "left" == c ? "unshift" : "push"](new CKEDITOR.dom.element(q))
        }
        c = b.getDocument();
        var K = n,
          w = q = 0,
          J = !e && new CKEDITOR.dom.documentFragment(c),
          E = 0;
        for (c = 0; c < d.length; c++) {
          h = d[c];
          var R = h.getParent(),
            O = h.getFirst(),
            S = h.$.colSpan,
            L = h.$.rowSpan,
            R = R.$.rowIndex,
            V = f(k, R, h),
            E = E + S * L,
            w = Math.max(w, V - p + S);
          q = Math.max(q, R - n + L);
          e || (S = h, (L = S.getBogus()) && L.remove(),
            S.trim(), h.getChildren().count() && (R == K || !O || O.isBlockBoundary && O.isBlockBoundary({ br: 1 }) || (K = J.getLast(CKEDITOR.dom.walker.whitespaces(!0)), !K || K.is && K.is("br") || J.append("br")), h.moveChildren(J)), c ? h.remove() : h.setHtml(""));
          K = R
        }
        if (e) return q * w == E;
        J.moveChildren(b);
        b.appendBogus();
        w >= m ? b.removeAttribute("rowSpan") : b.$.rowSpan = q;
        q >= l ? b.removeAttribute("colSpan") : b.$.colSpan = w;
        e = new CKEDITOR.dom.nodeList(g.$.rows);
        d = e.count();
        for (c = d - 1; 0 <= c; c--) g = e.getItem(c), g.$.cells.length || (g.remove(), d++);
        return b
      }

      function p(b, c) {
        var e = a(b);
        if (1 < e.length) return !1;
        if (c) return !0;
        var e = e[0],
          d = e.getParent(),
          g = d.getAscendant("table"),
          h = CKEDITOR.tools.buildTableMap(g),
          k = d.$.rowIndex,
          l = f(h, k, e),
          m = e.$.rowSpan,
          n;
        if (1 < m) { n = Math.ceil(m / 2); for (var m = Math.floor(m / 2), d = k + n, g = new CKEDITOR.dom.element(g.$.rows[d]), h = f(h, d), p, d = e.clone(), k = 0; k < h.length; k++)
            if (p = h[k], p.parentNode == g.$ && k > l) { d.insertBefore(new CKEDITOR.dom.element(p)); break } else p = null;
          p || g.append(d) } else
          for (m = n = 1, g = d.clone(), g.insertAfter(d), g.append(d = e.clone()),
            p = f(h, k), l = 0; l < p.length; l++) p[l].rowSpan++;
        d.appendBogus();
        e.$.rowSpan = n;
        d.$.rowSpan = m;
        1 == n && e.removeAttribute("rowSpan");
        1 == m && d.removeAttribute("rowSpan");
        return d
      }

      function q(b, c) {
        var e = a(b);
        if (1 < e.length) return !1;
        if (c) return !0;
        var e = e[0],
          d = e.getParent(),
          g = d.getAscendant("table"),
          g = CKEDITOR.tools.buildTableMap(g),
          h = f(g, d.$.rowIndex, e),
          k = e.$.colSpan;
        if (1 < k) d = Math.ceil(k / 2), k = Math.floor(k / 2);
        else {
          for (var k = d = 1, l = [], m = 0; m < g.length; m++) { var n = g[m];
            l.push(n[h]);
            1 < n[h].rowSpan && (m += n[h].rowSpan - 1) }
          for (g =
            0; g < l.length; g++) l[g].colSpan++
        }
        g = e.clone();
        g.insertAfter(e);
        g.appendBogus();
        e.$.colSpan = d;
        g.$.colSpan = k;
        1 == d && e.removeAttribute("colSpan");
        1 == k && g.removeAttribute("colSpan");
        return g
      }
      var w = /^(?:td|th)$/,
        v = CKEDITOR.tools.isArray;
      CKEDITOR.plugins.tabletools = {
        requires: "table,dialog,contextmenu",
        init: function(c) {
          function f(a) { return CKEDITOR.tools.extend(a || {}, { contextSensitive: 1, refresh: function(a, b) { this.setState(b.contains({ td: 1, th: 1 }, 1) ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED) } }) }

          function g(a,
            b) { var e = c.addCommand(a, b);
            c.addFeature(e) }
          var w = c.lang.table,
            v = CKEDITOR.tools.style.parse;
          g("cellProperties", new CKEDITOR.dialogCommand("cellProperties", f({
            allowedContent: "td th{width,height,border-color,background-color,white-space,vertical-align,text-align}[colspan,rowspan]",
            requiredContent: "table",
            contentTransformations: [
              [{ element: "td", left: function(a) { return a.styles.background && v.background(a.styles.background).color }, right: function(a) { a.styles["background-color"] = v.background(a.styles.background).color } },
                { element: "td", check: "td{vertical-align}", left: function(a) { return a.attributes && a.attributes.valign }, right: function(a) { a.styles["vertical-align"] = a.attributes.valign;
                    delete a.attributes.valign } }
              ],
              [{ element: "tr", check: "td{height}", left: function(a) { return a.styles && a.styles.height }, right: function(a) { CKEDITOR.tools.array.forEach(a.children, function(b) { b.name in { td: 1, th: 1 } && (b.attributes["cke-row-height"] = a.styles.height) });
                  delete a.styles.height } }],
              [{
                element: "td",
                check: "td{height}",
                left: function(a) {
                  return (a =
                    a.attributes) && a["cke-row-height"]
                },
                right: function(a) { a.styles.height = a.attributes["cke-row-height"];
                  delete a.attributes["cke-row-height"] }
              }]
            ]
          })));
          CKEDITOR.dialog.add("cellProperties", this.path + "dialogs/tableCell.js");
          g("rowDelete", f({ requiredContent: "table", exec: function(a) { a = a.getSelection();
              (a = b(a)) && m(a) } }));
          g("rowInsertBefore", f({ requiredContent: "table", exec: function(b) { b = b.getSelection();
              b = a(b);
              d(b, !0) } }));
          g("rowInsertAfter", f({
            requiredContent: "table",
            exec: function(b) {
              b = b.getSelection();
              b = a(b);
              d(b)
            }
          }));
          g("columnDelete", f({ requiredContent: "table", exec: function(a) { a = a.getSelection();
              (a = k(a)) && m(a, !0) } }));
          g("columnInsertBefore", f({ requiredContent: "table", exec: function(b) { b = b.getSelection();
              b = a(b);
              l(b, !0) } }));
          g("columnInsertAfter", f({ requiredContent: "table", exec: function(b) { b = b.getSelection();
              b = a(b);
              l(b) } }));
          g("cellDelete", f({ requiredContent: "table", exec: function(a) { a = a.getSelection();
              h(a) } }));
          g("cellMerge", f({
            allowedContent: "td[colspan,rowspan]",
            requiredContent: "td[colspan,rowspan]",
            exec: function(a,
              b) { b.cell = n(a.getSelection());
              m(b.cell, !0) }
          }));
          g("cellMergeRight", f({ allowedContent: "td[colspan]", requiredContent: "td[colspan]", exec: function(a, b) { b.cell = n(a.getSelection(), "right");
              m(b.cell, !0) } }));
          g("cellMergeDown", f({ allowedContent: "td[rowspan]", requiredContent: "td[rowspan]", exec: function(a, b) { b.cell = n(a.getSelection(), "down");
              m(b.cell, !0) } }));
          g("cellVerticalSplit", f({ allowedContent: "td[rowspan]", requiredContent: "td[rowspan]", exec: function(a) { m(q(a.getSelection())) } }));
          g("cellHorizontalSplit",
            f({ allowedContent: "td[colspan]", requiredContent: "td[colspan]", exec: function(a) { m(p(a.getSelection())) } }));
          g("cellInsertBefore", f({ requiredContent: "table", exec: function(a) { a = a.getSelection();
              e(a, !0) } }));
          g("cellInsertAfter", f({ requiredContent: "table", exec: function(a) { a = a.getSelection();
              e(a) } }));
          c.addMenuItems && c.addMenuItems({
            tablecell: {
              label: w.cell.menu,
              group: "tablecell",
              order: 1,
              getItems: function() {
                var b = c.getSelection(),
                  e = a(b);
                return {
                  tablecell_insertBefore: CKEDITOR.TRISTATE_OFF,
                  tablecell_insertAfter: CKEDITOR.TRISTATE_OFF,
                  tablecell_delete: CKEDITOR.TRISTATE_OFF,
                  tablecell_merge: n(b, null, !0) ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED,
                  tablecell_merge_right: n(b, "right", !0) ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED,
                  tablecell_merge_down: n(b, "down", !0) ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED,
                  tablecell_split_vertical: q(b, !0) ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED,
                  tablecell_split_horizontal: p(b, !0) ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED,
                  tablecell_properties: 0 < e.length ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED
                }
              }
            },
            tablecell_insertBefore: { label: w.cell.insertBefore, group: "tablecell", command: "cellInsertBefore", order: 5 },
            tablecell_insertAfter: { label: w.cell.insertAfter, group: "tablecell", command: "cellInsertAfter", order: 10 },
            tablecell_delete: { label: w.cell.deleteCell, group: "tablecell", command: "cellDelete", order: 15 },
            tablecell_merge: { label: w.cell.merge, group: "tablecell", command: "cellMerge", order: 16 },
            tablecell_merge_right: {
              label: w.cell.mergeRight,
              group: "tablecell",
              command: "cellMergeRight",
              order: 17
            },
            tablecell_merge_down: { label: w.cell.mergeDown, group: "tablecell", command: "cellMergeDown", order: 18 },
            tablecell_split_horizontal: { label: w.cell.splitHorizontal, group: "tablecell", command: "cellHorizontalSplit", order: 19 },
            tablecell_split_vertical: { label: w.cell.splitVertical, group: "tablecell", command: "cellVerticalSplit", order: 20 },
            tablecell_properties: { label: w.cell.title, group: "tablecellproperties", command: "cellProperties", order: 21 },
            tablerow: {
              label: w.row.menu,
              group: "tablerow",
              order: 1,
              getItems: function() {
                return {
                  tablerow_insertBefore: CKEDITOR.TRISTATE_OFF,
                  tablerow_insertAfter: CKEDITOR.TRISTATE_OFF,
                  tablerow_delete: CKEDITOR.TRISTATE_OFF
                }
              }
            },
            tablerow_insertBefore: { label: w.row.insertBefore, group: "tablerow", command: "rowInsertBefore", order: 5 },
            tablerow_insertAfter: { label: w.row.insertAfter, group: "tablerow", command: "rowInsertAfter", order: 10 },
            tablerow_delete: { label: w.row.deleteRow, group: "tablerow", command: "rowDelete", order: 15 },
            tablecolumn: {
              label: w.column.menu,
              group: "tablecolumn",
              order: 1,
              getItems: function() {
                return {
                  tablecolumn_insertBefore: CKEDITOR.TRISTATE_OFF,
                  tablecolumn_insertAfter: CKEDITOR.TRISTATE_OFF,
                  tablecolumn_delete: CKEDITOR.TRISTATE_OFF
                }
              }
            },
            tablecolumn_insertBefore: { label: w.column.insertBefore, group: "tablecolumn", command: "columnInsertBefore", order: 5 },
            tablecolumn_insertAfter: { label: w.column.insertAfter, group: "tablecolumn", command: "columnInsertAfter", order: 10 },
            tablecolumn_delete: { label: w.column.deleteColumn, group: "tablecolumn", command: "columnDelete", order: 15 }
          });
          c.contextMenu && c.contextMenu.addListener(function(a, b, c) {
            return (a = c.contains({ td: 1, th: 1 },
              1)) && !a.isReadOnly() ? { tablecell: CKEDITOR.TRISTATE_OFF, tablerow: CKEDITOR.TRISTATE_OFF, tablecolumn: CKEDITOR.TRISTATE_OFF } : null
          })
        },
        getCellColIndex: c,
        insertRow: d,
        insertColumn: l,
        getSelectedCells: a
      };
      CKEDITOR.plugins.add("tabletools", CKEDITOR.plugins.tabletools)
    }(), CKEDITOR.tools.buildTableMap = function(a, d, b, c, g) {
      a = a.$.rows;
      b = b || 0;
      c = "number" === typeof c ? c : a.length - 1;
      g = "number" === typeof g ? g : -1;
      var l = -1,
        k = [];
      for (d = d || 0; d <= c; d++) {
        l++;
        !k[l] && (k[l] = []);
        for (var e = -1, h = b; h <= (-1 === g ? a[d].cells.length - 1 : g); h++) {
          var m =
            a[d].cells[h];
          if (!m) break;
          for (e++; k[l][e];) e++;
          for (var f = isNaN(m.colSpan) ? 1 : m.colSpan, m = isNaN(m.rowSpan) ? 1 : m.rowSpan, n = 0; n < m && !(d + n > c); n++) { k[l + n] || (k[l + n] = []); for (var p = 0; p < f; p++) k[l + n][e + p] = a[d].cells[h] } e += f - 1;
          if (-1 !== g && e >= g) break
        }
      }
      return k
    },
    function() {
      function a(a) { return CKEDITOR.plugins.widget && CKEDITOR.plugins.widget.isDomWidget(a) }

      function d(a, b) {
        var c = a.getAscendant("table"),
          e = b.getAscendant("table"),
          d = CKEDITOR.tools.buildTableMap(c),
          f = m(a),
          g = m(b),
          h = [],
          k = {},
          l, n;
        c.contains(e) && (b = b.getAscendant({
          td: 1,
          th: 1
        }), g = m(b));
        f > g && (c = f, f = g, g = c, c = a, a = b, b = c);
        for (c = 0; c < d[f].length; c++)
          if (a.$ === d[f][c]) { l = c; break }
        for (c = 0; c < d[g].length; c++)
          if (b.$ === d[g][c]) { n = c; break }
        l > n && (c = l, l = n, n = c);
        for (c = f; c <= g; c++)
          for (f = l; f <= n; f++) e = new CKEDITOR.dom.element(d[c][f]), e.$ && !e.getCustomData("selected_cell") && (h.push(e), CKEDITOR.dom.element.setMarker(k, e, "selected_cell", !0));
        CKEDITOR.dom.element.clearAllMarkers(k);
        return h
      }

      function b(a) {
        if (a) return a = a.clone(), a.enlarge(CKEDITOR.ENLARGE_ELEMENT), (a = a.getEnclosedNode()) && a.is &&
          a.is(CKEDITOR.dtd.$tableContent)
      }

      function c(a) { return (a = a.editable().findOne(".cke_table-faked-selection")) && a.getAscendant("table") }

      function g(a, b) {
        var c = a.editable().find(".cke_table-faked-selection"),
          e;
        a.fire("lockSnapshot");
        a.editable().removeClass("cke_table-faked-selection-editor");
        for (e = 0; e < c.count(); e++) c.getItem(e).removeClass("cke_table-faked-selection");
        0 < c.count() && c.getItem(0).getAscendant("table").data("cke-table-faked-selection-table", !1);
        a.fire("unlockSnapshot");
        b && (t = { active: !1 },
          a.getSelection().isInTable() && a.getSelection().reset())
      }

      function l(a, b) { var c = [],
          e, d; for (d = 0; d < b.length; d++) e = a.createRange(), e.setStartBefore(b[d]), e.setEndAfter(b[d]), c.push(e);
        a.getSelection().selectRanges(c) }

      function k(a) { var b = a.editable().find(".cke_table-faked-selection");
        1 > b.count() || (b = d(b.getItem(0), b.getItem(b.count() - 1)), l(a, b)) }

      function e(b, c, e) {
        var f = r(b.getSelection(!0));
        c = c.is("table") ? null : c;
        var h;
        (h = t.active && !t.first) && !(h = c) && (h = b.getSelection().getRanges(), h = 1 < f.length || h[0] &&
          !h[0].collapsed ? !0 : !1);
        if (h) t.first = c || f[0], t.dirty = c ? !1 : 1 !== f.length;
        else if (t.active && c && t.first.getAscendant("table").equals(c.getAscendant("table"))) { f = d(t.first, c); if (!t.dirty && 1 === f.length && !a(e.data.getTarget())) return g(b, "mouseup" === e.name);
          t.dirty = !0;
          t.last = c;
          l(b, f) }
      }

      function h(a) {
        var b = (a = a.editor || a.sender.editor) && a.getSelection(),
          c = b && b.getRanges() || [],
          e;
        if (b && (g(a), b.isInTable() && b.isFake)) {
          1 === c.length && c[0]._getTableElement() && c[0]._getTableElement().is("table") && (e = c[0]._getTableElement());
          e = r(b, e);
          a.fire("lockSnapshot");
          for (b = 0; b < e.length; b++) e[b].addClass("cke_table-faked-selection");
          0 < e.length && (a.editable().addClass("cke_table-faked-selection-editor"), e[0].getAscendant("table").data("cke-table-faked-selection-table", ""));
          a.fire("unlockSnapshot")
        }
      }

      function m(a) { return a.getAscendant("tr", !0).$.rowIndex }

      function f(b) {
        function d(a, b) { return a && b ? a.equals(b) || a.contains(b) || b.contains(a) || a.getCommonAncestor(b).is(v) : !1 }

        function h(a) { return !a.getAscendant("table", !0) && a.getDocument().equals(m.document) }

        function l(a, b, c, e) { return ("mousedown" !== a.name || CKEDITOR.tools.getMouseButton(a) !== CKEDITOR.MOUSE_BUTTON_LEFT && e) && ("mouseup" !== a.name || h(a.data.getTarget()) || d(c, e)) ? !1 : !0 }
        if (b.data.getTarget().getName && ("mouseup" === b.name || !a(b.data.getTarget()))) {
          var m = b.editor || b.listenerData.editor,
            n = m.getSelection(1),
            p = c(m),
            q = b.data.getTarget(),
            w = q && q.getAscendant({ td: 1, th: 1 }, !0),
            q = q && q.getAscendant("table", !0),
            v = { table: 1, thead: 1, tbody: 1, tfoot: 1, tr: 1, td: 1, th: 1 };
          l(b, n, p, q) && g(m, !0);
          !t.active && "mousedown" ===
            b.name && CKEDITOR.tools.getMouseButton(b) === CKEDITOR.MOUSE_BUTTON_LEFT && q && (t = { active: !0 }, CKEDITOR.document.on("mouseup", f, null, { editor: m }));
          (w || q) && e(m, w || q, b);
          "mouseup" === b.name && (CKEDITOR.tools.getMouseButton(b) === CKEDITOR.MOUSE_BUTTON_LEFT && (h(b.data.getTarget()) || d(p, q)) && k(m), t = { active: !1 }, CKEDITOR.document.removeListener("mouseup", f))
        }
      }

      function n(a) { var b = a.data.getTarget().getAscendant({ td: 1, th: 1 }, !0);
        b && !b.hasClass("cke_table-faked-selection") && (a.cancel(), a.data.preventDefault()) }

      function p(a,
        b) {
        function c(a) { a.cancel() }
        var e = a.getSelection(),
          d = e.createBookmarks(),
          f = a.document,
          g = a.createRange(),
          h = f.getDocumentElement().$,
          k = CKEDITOR.env.ie && 9 > CKEDITOR.env.version,
          l = a.blockless || CKEDITOR.env.ie ? "span" : "div",
          m, n, p, q;
        f.getById("cke_table_copybin") || (m = f.createElement(l), n = f.createElement(l), n.setAttributes({ id: "cke_table_copybin", "data-cke-temp": "1" }), m.setStyles({ position: "absolute", width: "1px", height: "1px", overflow: "hidden" }), m.setStyle("ltr" == a.config.contentsLangDirection ? "left" : "right",
          "-5000px"), m.setHtml(a.getSelectedHtml(!0)), a.fire("lockSnapshot"), n.append(m), a.editable().append(n), q = a.on("selectionChange", c, null, null, 0), k && (p = h.scrollTop), g.selectNodeContents(m), g.select(), k && (h.scrollTop = p), setTimeout(function() { n.remove();
          e.selectBookmarks(d);
          q.removeListener();
          a.fire("unlockSnapshot");
          b && (a.extractSelectedHtml(), a.fire("saveSnapshot")) }, 100))
      }

      function q(a) { var b = a.editor || a.sender.editor;
        b.getSelection().isInTable() && p(b, "cut" === a.name) }

      function w(a) { this._reset();
        a && this.setSelectedCells(a) }

      function v(a, b, c) { a.on("beforeCommandExec", function(c) {-1 !== CKEDITOR.tools.array.indexOf(b, c.data.name) && (c.data.selectedCells = r(a.getSelection())) });
        a.on("afterCommandExec", function(e) {-1 !== CKEDITOR.tools.array.indexOf(b, e.data.name) && c(a, e.data) }) }
      var t = { active: !1 },
        u, r, B, x, y;
      w.prototype = {};
      w.prototype._reset = function() { this.cells = { first: null, last: null, all: [] };
        this.rows = { first: null, last: null } };
      w.prototype.setSelectedCells = function(a) {
        this._reset();
        a = a.slice(0);
        this._arraySortByDOMOrder(a);
        this.cells.all =
          a;
        this.cells.first = a[0];
        this.cells.last = a[a.length - 1];
        this.rows.first = a[0].getAscendant("tr");
        this.rows.last = this.cells.last.getAscendant("tr")
      };
      w.prototype.getTableMap = function() { var a = B(this.cells.first),
          b;
        a: { b = this.cells.last; var c = b.getAscendant("table"),
            e = m(b),
            c = CKEDITOR.tools.buildTableMap(c),
            d; for (d = 0; d < c[e].length; d++)
            if ((new CKEDITOR.dom.element(c[e][d])).equals(b)) { b = d; break a }
          b = void 0 }
        return CKEDITOR.tools.buildTableMap(this._getTable(), m(this.rows.first), a, m(this.rows.last), b) };
      w.prototype._getTable =
        function() { return this.rows.first.getAscendant("table") };
      w.prototype.insertRow = function(a, b, c) { if ("undefined" === typeof a) a = 1;
        else if (0 >= a) return; for (var e = this.cells.first.$.cellIndex, d = this.cells.last.$.cellIndex, f = c ? [] : this.cells.all, g, h = 0; h < a; h++) g = x(c ? this.cells.all : f, b), g = CKEDITOR.tools.array.filter(g.find("td, th").toArray(), function(a) { return c ? !0 : a.$.cellIndex >= e && a.$.cellIndex <= d }), f = b ? g.concat(f) : f.concat(g);
        this.setSelectedCells(f) };
      w.prototype.insertColumn = function(a) {
        function b(a) {
          a =
            m(a);
          return a >= d && a <= f
        }
        if ("undefined" === typeof a) a = 1;
        else if (0 >= a) return;
        for (var c = this.cells, e = c.all, d = m(c.first), f = m(c.last), c = 0; c < a; c++) e = e.concat(CKEDITOR.tools.array.filter(y(e), b));
        this.setSelectedCells(e)
      };
      w.prototype.emptyCells = function(a) { a = a || this.cells.all; for (var b = 0; b < a.length; b++) a[b].setHtml("") };
      w.prototype._arraySortByDOMOrder = function(a) { a.sort(function(a, b) { return a.getPosition(b) & CKEDITOR.POSITION_PRECEDING ? -1 : 1 }) };
      var C = {
        onPaste: function(a) {
          function c(a) {
            return Math.max.apply(null,
              CKEDITOR.tools.array.map(a, function(a) { return a.length }, 0))
          }

          function e(a) { var b = f.createRange();
            b.selectNodeContents(a);
            b.select() }
          var f = a.editor,
            g = f.getSelection(),
            h = r(g),
            k = this.findTableInPastedContent(f, a.data.dataValue),
            m = g.isInTable(!0) && this.isBoundarySelection(g),
            n, p;
          !h.length || 1 === h.length && !b(g.getRanges()[0]) && !m || m && !k || (h = h[0].getAscendant("table"), n = new w(r(g, h)), f.once("afterPaste", function() {
            var a;
            if (p) {
              a = new CKEDITOR.dom.element(p[0][0]);
              var b = p[p.length - 1];
              a = d(a, new CKEDITOR.dom.element(b[b.length -
                1]))
            } else a = n.cells.all;
            l(f, a)
          }), k ? (a.stop(), m ? (n.insertRow(1, 1 === m, !0), g.selectElement(n.rows.first)) : (n.emptyCells(), l(f, n.cells.all)), a = n.getTableMap(), p = CKEDITOR.tools.buildTableMap(k), n.insertRow(p.length - a.length), n.insertColumn(c(p) - c(a)), a = n.getTableMap(), this.pasteTable(n, a, p), f.fire("saveSnapshot"), setTimeout(function() { f.fire("afterPaste") }, 0)) : (e(n.cells.first), f.once("afterPaste", function() { f.fire("lockSnapshot");
            n.emptyCells(n.cells.all.slice(1));
            l(f, n.cells.all);
            f.fire("unlockSnapshot") })))
        },
        isBoundarySelection: function(a) { a = a.getRanges()[0]; var b = a.endContainer.getAscendant("tr", !0); if (b && a.collapsed) { if (a.checkBoundaryOfElement(b, CKEDITOR.START)) return 1; if (a.checkBoundaryOfElement(b, CKEDITOR.END)) return 2 } return 0 },
        findTableInPastedContent: function(a, b) { var c = a.dataProcessor,
            e = new CKEDITOR.dom.element("body");
          c || (c = new CKEDITOR.htmlDataProcessor(a));
          e.setHtml(c.toHtml(b), { fixForBody: !1 }); return 1 < e.getChildCount() ? null : e.findOne("table") },
        pasteTable: function(a, b, c) {
          var e, d = B(a.cells.first),
            f = a._getTable(),
            g = {},
            h, k, l, m;
          for (l = 0; l < c.length; l++)
            for (h = new CKEDITOR.dom.element(f.$.rows[a.rows.first.$.rowIndex + l]), m = 0; m < c[l].length; m++)
              if (k = new CKEDITOR.dom.element(c[l][m]), e = b[l] && b[l][m] ? new CKEDITOR.dom.element(b[l][m]) : null, k && !k.getCustomData("processed")) {
                if (e && e.getParent()) k.replace(e);
                else if (0 === m || c[l][m - 1])(e = 0 !== m ? new CKEDITOR.dom.element(c[l][m - 1]) : null) && h.equals(e.getParent()) ? k.insertAfter(e) : 0 < d ? h.$.cells[d] ? k.insertAfter(new CKEDITOR.dom.element(h.$.cells[d])) : h.append(k) :
                  h.append(k, !0);
                CKEDITOR.dom.element.setMarker(g, k, "processed", !0)
              } else k.getCustomData("processed") && e && e.remove();
          CKEDITOR.dom.element.clearAllMarkers(g)
        }
      };
      CKEDITOR.plugins.tableselection = {
        getCellsBetween: d,
        keyboardIntegration: function(a) {
          function b(a) { var c = a.getEnclosedNode();
            c && c.is({ td: 1, th: 1 }) ? a.getEnclosedNode().setText("") : a.deleteContents();
            CKEDITOR.tools.array.forEach(a._find("td"), function(a) { a.appendBogus() }) }
          var c = a.editable();
          c.attachListener(c, "keydown", function(a) {
            function c(b, e) {
              if (!e.length) return null;
              var f = a.createRange(),
                g = CKEDITOR.dom.range.mergeRanges(e);
              CKEDITOR.tools.array.forEach(g, function(a) { a.enlarge(CKEDITOR.ENLARGE_ELEMENT) });
              var h = g[0].getBoundaryNodes(),
                k = h.startNode,
                h = h.endNode;
              if (k && k.is && k.is(d)) {
                for (var l = k.getAscendant("table", !0), m = k.getPreviousSourceNode(!1, CKEDITOR.NODE_ELEMENT, l), n = !1, p = function(a) { return !k.contains(a) && a.is && a.is("td", "th") }; m && !p(m);) m = m.getPreviousSourceNode(!1, CKEDITOR.NODE_ELEMENT, l);
                !m && h && h.is && !h.is("table") && h.getNext() && (m = h.getNext().findOne("td, th"),
                  n = !0);
                if (m) f["moveToElementEdit" + (n ? "Start" : "End")](m);
                else f.setStartBefore(k.getAscendant("table", !0)), f.collapse(!0);
                g[0].deleteContents();
                return [f]
              }
              if (k) return f.moveToElementEditablePosition(k), [f]
            }
            var e = { 37: 1, 38: 1, 39: 1, 40: 1, 8: 1, 46: 1 },
              d = CKEDITOR.tools.extend({ table: 1 }, CKEDITOR.dtd.$tableContent);
            delete d.td;
            delete d.th;
            return function(d) {
              var f = d.data.getKey(),
                g, h = 37 === f || 38 == f,
                k, l, m;
              if (e[f] && (g = a.getSelection()) && g.isInTable() && g.isFake)
                if (k = g.getRanges(), l = k[0]._getTableElement(), m = k[k.length -
                    1]._getTableElement(), d.data.preventDefault(), d.cancel(), 8 < f && 46 > f) k[0].moveToElementEditablePosition(h ? l : m, !h), g.selectRanges([k[0]]);
                else { for (d = 0; d < k.length; d++) b(k[d]);
                  (d = c(l, k)) ? k = d: k[0].moveToElementEditablePosition(l);
                  g.selectRanges(k);
                  a.fire("saveSnapshot") }
            }
          }(a), null, null, -1);
          c.attachListener(c, "keypress", function(c) {
            var e = a.getSelection(),
              d = c.data.$.charCode || 13 === c.data.getKey(),
              f;
            if (e && e.isInTable() && e.isFake && d && !(c.data.getKeystroke() & CKEDITOR.CTRL)) {
              c = e.getRanges();
              d = c[0].getEnclosedNode().getAscendant({
                td: 1,
                th: 1
              }, !0);
              for (f = 0; f < c.length; f++) b(c[f]);
              d && (c[0].moveToElementEditablePosition(d), e.selectRanges([c[0]]))
            }
          }, null, null, -1)
        },
        isSupportedEnvironment: !(CKEDITOR.env.ie && 11 > CKEDITOR.env.version)
      };
      CKEDITOR.plugins.add("tableselection", {
        requires: "clipboard,tabletools",
        onLoad: function() { u = CKEDITOR.plugins.tabletools;
          r = u.getSelectedCells;
          B = u.getCellColIndex;
          x = u.insertRow;
          y = u.insertColumn;
          CKEDITOR.document.appendStyleSheet(this.path + "styles/tableselection.css") },
        init: function(a) {
          CKEDITOR.plugins.tableselection.isSupportedEnvironment &&
            (a.addContentsCss && a.addContentsCss(this.path + "styles/tableselection.css"), a.on("contentDom", function() {
              var b = a.editable(),
                c = b.isInline() ? b : a.document,
                e = { editor: a };
              b.attachListener(c, "mousedown", f, null, e);
              b.attachListener(c, "mousemove", f, null, e);
              b.attachListener(c, "mouseup", f, null, e);
              b.attachListener(b, "dragstart", n);
              b.attachListener(a, "selectionCheck", h);
              CKEDITOR.plugins.tableselection.keyboardIntegration(a);
              CKEDITOR.plugins.clipboard && !CKEDITOR.plugins.clipboard.isCustomCopyCutSupported && (b.attachListener(b,
                "cut", q), b.attachListener(b, "copy", q))
            }), a.on("paste", C.onPaste, C), v(a, "rowInsertBefore rowInsertAfter columnInsertBefore columnInsertAfter cellInsertBefore cellInsertAfter".split(" "), function(a, b) { l(a, b.selectedCells) }), v(a, ["cellMerge", "cellMergeRight", "cellMergeDown"], function(a, b) { l(a, [b.commandData.cell]) }), v(a, ["cellDelete"], function(a) { g(a, !0) }))
        }
      })
    }(),
    function() {
      CKEDITOR.plugins.add("templates", {
        requires: "dialog",
        init: function(a) {
          CKEDITOR.dialog.add("templates", CKEDITOR.getUrl(this.path +
            "dialogs/templates.js"));
          a.addCommand("templates", new CKEDITOR.dialogCommand("templates"));
          a.ui.addButton && a.ui.addButton("Templates", { label: a.lang.templates.button, command: "templates", toolbar: "doctools,10" })
        }
      });
      var a = {},
        d = {};
      CKEDITOR.addTemplates = function(b, c) { a[b] = c };
      CKEDITOR.getTemplates = function(b) { return a[b] };
      CKEDITOR.loadTemplates = function(a, c) { for (var g = [], l = 0, k = a.length; l < k; l++) d[a[l]] || (g.push(a[l]), d[a[l]] = 1);
        g.length ? CKEDITOR.scriptLoader.load(g, c) : setTimeout(c, 0) }
    }(), CKEDITOR.config.templates_files = [CKEDITOR.getUrl("plugins/templates/templates/default.js")], CKEDITOR.config.templates_replaceContent = !0, "use strict",
    function() {
      var a = [CKEDITOR.CTRL + 90, CKEDITOR.CTRL + 89, CKEDITOR.CTRL + CKEDITOR.SHIFT + 90],
        d = { 8: 1, 46: 1 };
      CKEDITOR.plugins.add("undo", {
        init: function(c) {
          function d(a) { f.enabled && !1 !== a.data.command.canUndo && f.save() }

          function g() { f.enabled = c.readOnly ? !1 : "wysiwyg" == c.mode;
            f.onChange() }
          var f = c.undoManager = new b(c),
            k = f.editingHandler = new l(f),
            p = c.addCommand("undo", {
              exec: function() {
                f.undo() && (c.selectionChange(),
                  this.fire("afterUndo"))
              },
              startDisabled: !0,
              canUndo: !1
            }),
            q = c.addCommand("redo", { exec: function() { f.redo() && (c.selectionChange(), this.fire("afterRedo")) }, startDisabled: !0, canUndo: !1 });
          c.setKeystroke([
            [a[0], "undo"],
            [a[1], "redo"],
            [a[2], "redo"]
          ]);
          f.onChange = function() { p.setState(f.undoable() ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED);
            q.setState(f.redoable() ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED) };
          c.on("beforeCommandExec", d);
          c.on("afterCommandExec", d);
          c.on("saveSnapshot", function(a) {
            f.save(a.data &&
              a.data.contentOnly)
          });
          c.on("contentDom", k.attachListeners, k);
          c.on("instanceReady", function() { c.fire("saveSnapshot") });
          c.on("beforeModeUnload", function() { "wysiwyg" == c.mode && f.save(!0) });
          c.on("mode", g);
          c.on("readOnly", g);
          c.ui.addButton && (c.ui.addButton("Undo", { label: c.lang.undo.undo, command: "undo", toolbar: "undo,10" }), c.ui.addButton("Redo", { label: c.lang.undo.redo, command: "redo", toolbar: "undo,20" }));
          c.resetUndo = function() { f.reset();
            c.fire("saveSnapshot") };
          c.on("updateSnapshot", function() {
            f.currentImage &&
              f.update()
          });
          c.on("lockSnapshot", function(a) { a = a.data;
            f.lock(a && a.dontUpdate, a && a.forceUpdate) });
          c.on("unlockSnapshot", f.unlock, f)
        }
      });
      CKEDITOR.plugins.undo = {};
      var b = CKEDITOR.plugins.undo.UndoManager = function(a) { this.strokesRecorded = [0, 0];
        this.locked = null;
        this.previousKeyGroup = -1;
        this.limit = a.config.undoStackSize || 20;
        this.strokesLimit = 25;
        this.editor = a;
        this.reset() };
      b.prototype = {
        type: function(a, c) {
          var d = b.getKeyGroup(a),
            f = this.strokesRecorded[d] + 1;
          c = c || f >= this.strokesLimit;
          this.typing || (this.hasUndo =
            this.typing = !0, this.hasRedo = !1, this.onChange());
          c ? (f = 0, this.editor.fire("saveSnapshot")) : this.editor.fire("change");
          this.strokesRecorded[d] = f;
          this.previousKeyGroup = d
        },
        keyGroupChanged: function(a) { return b.getKeyGroup(a) != this.previousKeyGroup },
        reset: function() { this.snapshots = [];
          this.index = -1;
          this.currentImage = null;
          this.hasRedo = this.hasUndo = !1;
          this.locked = null;
          this.resetType() },
        resetType: function() { this.strokesRecorded = [0, 0];
          this.typing = !1;
          this.previousKeyGroup = -1 },
        refreshState: function() {
          this.hasUndo = !!this.getNextImage(!0);
          this.hasRedo = !!this.getNextImage(!1);
          this.resetType();
          this.onChange()
        },
        save: function(a, b, d) {
          var f = this.editor;
          if (this.locked || "ready" != f.status || "wysiwyg" != f.mode) return !1;
          var g = f.editable();
          if (!g || "ready" != g.status) return !1;
          g = this.snapshots;
          b || (b = new c(f));
          if (!1 === b.contents) return !1;
          if (this.currentImage)
            if (b.equalsContent(this.currentImage)) { if (a || b.equalsSelection(this.currentImage)) return !1 } else !1 !== d && f.fire("change");
          g.splice(this.index + 1, g.length - this.index - 1);
          g.length ==
            this.limit && g.shift();
          this.index = g.push(b) - 1;
          this.currentImage = b;
          !1 !== d && this.refreshState();
          return !0
        },
        restoreImage: function(a) {
          var b = this.editor,
            c;
          a.bookmarks && (b.focus(), c = b.getSelection());
          this.locked = { level: 999 };
          this.editor.loadSnapshot(a.contents);
          a.bookmarks ? c.selectBookmarks(a.bookmarks) : CKEDITOR.env.ie && (c = this.editor.document.getBody().$.createTextRange(), c.collapse(!0), c.select());
          this.locked = null;
          this.index = a.index;
          this.currentImage = this.snapshots[this.index];
          this.update();
          this.refreshState();
          b.fire("change")
        },
        getNextImage: function(a) { var b = this.snapshots,
            c = this.currentImage,
            d; if (c)
            if (a)
              for (d = this.index - 1; 0 <= d; d--) { if (a = b[d], !c.equalsContent(a)) return a.index = d, a } else
                for (d = this.index + 1; d < b.length; d++)
                  if (a = b[d], !c.equalsContent(a)) return a.index = d, a; return null },
        redoable: function() { return this.enabled && this.hasRedo },
        undoable: function() { return this.enabled && this.hasUndo },
        undo: function() { if (this.undoable()) { this.save(!0); var a = this.getNextImage(!0); if (a) return this.restoreImage(a), !0 } return !1 },
        redo: function() { if (this.redoable() && (this.save(!0), this.redoable())) { var a = this.getNextImage(!1); if (a) return this.restoreImage(a), !0 } return !1 },
        update: function(a) { if (!this.locked) { a || (a = new c(this.editor)); for (var b = this.index, d = this.snapshots; 0 < b && this.currentImage.equalsContent(d[b - 1]);) --b;
            d.splice(b, this.index - b + 1, a);
            this.index = b;
            this.currentImage = a } },
        updateSelection: function(a) {
          if (!this.snapshots.length) return !1;
          var b = this.snapshots,
            c = b[b.length - 1];
          return c.equalsContent(a) && !c.equalsSelection(a) ?
            (this.currentImage = b[b.length - 1] = a, !0) : !1
        },
        lock: function(a, b) { if (this.locked) this.locked.level++;
          else if (a) this.locked = { level: 1 };
          else { var d = null; if (b) d = !0;
            else { var f = new c(this.editor, !0);
              this.currentImage && this.currentImage.equalsContent(f) && (d = f) } this.locked = { update: d, level: 1 } } },
        unlock: function() { if (this.locked && !--this.locked.level) { var a = this.locked.update;
            this.locked = null; if (!0 === a) this.update();
            else if (a) { var b = new c(this.editor, !0);
              a.equalsContent(b) || this.update() } } }
      };
      b.navigationKeyCodes = { 37: 1, 38: 1, 39: 1, 40: 1, 36: 1, 35: 1, 33: 1, 34: 1 };
      b.keyGroups = { PRINTABLE: 0, FUNCTIONAL: 1 };
      b.isNavigationKey = function(a) { return !!b.navigationKeyCodes[a] };
      b.getKeyGroup = function(a) { var c = b.keyGroups; return d[a] ? c.FUNCTIONAL : c.PRINTABLE };
      b.getOppositeKeyGroup = function(a) { var c = b.keyGroups; return a == c.FUNCTIONAL ? c.PRINTABLE : c.FUNCTIONAL };
      b.ieFunctionalKeysBug = function(a) { return CKEDITOR.env.ie && b.getKeyGroup(a) == b.keyGroups.FUNCTIONAL };
      var c = CKEDITOR.plugins.undo.Image = function(a, b) {
          this.editor = a;
          a.fire("beforeUndoImage");
          var c = a.getSnapshot();
          CKEDITOR.env.ie && c && (c = c.replace(/\s+data-cke-expando=".*?"/g, ""));
          this.contents = c;
          b || (this.bookmarks = (c = c && a.getSelection()) && c.createBookmarks2(!0));
          a.fire("afterUndoImage")
        },
        g = /\b(?:href|src|name)="[^"]*?"/gi;
      c.prototype = {
        equalsContent: function(a) { var b = this.contents;
          a = a.contents;
          CKEDITOR.env.ie && (CKEDITOR.env.ie7Compat || CKEDITOR.env.quirks) && (b = b.replace(g, ""), a = a.replace(g, "")); return b != a ? !1 : !0 },
        equalsSelection: function(a) {
          var b = this.bookmarks;
          a = a.bookmarks;
          if (b || a) {
            if (!b ||
              !a || b.length != a.length) return !1;
            for (var c = 0; c < b.length; c++) { var d = b[c],
                g = a[c]; if (d.startOffset != g.startOffset || d.endOffset != g.endOffset || !CKEDITOR.tools.arrayCompare(d.start, g.start) || !CKEDITOR.tools.arrayCompare(d.end, g.end)) return !1 }
          }
          return !0
        }
      };
      var l = CKEDITOR.plugins.undo.NativeEditingHandler = function(a) { this.undoManager = a;
        this.ignoreInputEvent = !1;
        this.keyEventsStack = new k;
        this.lastKeydownImage = null };
      l.prototype = {
        onKeydown: function(d) {
          var g = d.data.getKey();
          if (229 !== g)
            if (-1 < CKEDITOR.tools.indexOf(a,
                d.data.getKeystroke())) d.data.preventDefault();
            else if (this.keyEventsStack.cleanUp(d), d = this.undoManager, this.keyEventsStack.getLast(g) || this.keyEventsStack.push(g), this.lastKeydownImage = new c(d.editor), b.isNavigationKey(g) || this.undoManager.keyGroupChanged(g))
            if (d.strokesRecorded[0] || d.strokesRecorded[1]) d.save(!1, this.lastKeydownImage, !1), d.resetType()
        },
        onInput: function() {
          if (this.ignoreInputEvent) this.ignoreInputEvent = !1;
          else {
            var a = this.keyEventsStack.getLast();
            a || (a = this.keyEventsStack.push(0));
            this.keyEventsStack.increment(a.keyCode);
            this.keyEventsStack.getTotalInputs() >= this.undoManager.strokesLimit && (this.undoManager.type(a.keyCode, !0), this.keyEventsStack.resetInputs())
          }
        },
        onKeyup: function(a) { var d = this.undoManager;
          a = a.data.getKey(); var g = this.keyEventsStack.getTotalInputs();
          this.keyEventsStack.remove(a); if (!(b.ieFunctionalKeysBug(a) && this.lastKeydownImage && this.lastKeydownImage.equalsContent(new c(d.editor, !0))))
            if (0 < g) d.type(a);
            else if (b.isNavigationKey(a)) this.onNavigationKey(!0) },
        onNavigationKey: function(a) { var b = this.undoManager;!a && b.save(!0, null, !1) || b.updateSelection(new c(b.editor));
          b.resetType() },
        ignoreInputEventListener: function() { this.ignoreInputEvent = !0 },
        activateInputEventListener: function() { this.ignoreInputEvent = !1 },
        attachListeners: function() {
          var a = this.undoManager.editor,
            c = a.editable(),
            d = this;
          c.attachListener(c, "keydown", function(a) { d.onKeydown(a); if (b.ieFunctionalKeysBug(a.data.getKey())) d.onInput() }, null, null, 999);
          c.attachListener(c, CKEDITOR.env.ie ? "keypress" :
            "input", d.onInput, d, null, 999);
          c.attachListener(c, "keyup", d.onKeyup, d, null, 999);
          c.attachListener(c, "paste", d.ignoreInputEventListener, d, null, 999);
          c.attachListener(c, "drop", d.ignoreInputEventListener, d, null, 999);
          a.on("afterPaste", d.activateInputEventListener, d, null, 999);
          c.attachListener(c.isInline() ? c : a.document.getDocumentElement(), "click", function() { d.onNavigationKey() }, null, null, 999);
          c.attachListener(this.undoManager.editor, "blur", function() { d.keyEventsStack.remove(9) }, null, null, 999)
        }
      };
      var k = CKEDITOR.plugins.undo.KeyEventsStack =
        function() { this.stack = [] };
      k.prototype = {
        push: function(a) { a = this.stack.push({ keyCode: a, inputs: 0 }); return this.stack[a - 1] },
        getLastIndex: function(a) { if ("number" != typeof a) return this.stack.length - 1; for (var b = this.stack.length; b--;)
            if (this.stack[b].keyCode == a) return b; return -1 },
        getLast: function(a) { a = this.getLastIndex(a); return -1 != a ? this.stack[a] : null },
        increment: function(a) { this.getLast(a).inputs++ },
        remove: function(a) { a = this.getLastIndex(a); - 1 != a && this.stack.splice(a, 1) },
        resetInputs: function(a) {
          if ("number" ==
            typeof a) this.getLast(a).inputs = 0;
          else
            for (a = this.stack.length; a--;) this.stack[a].inputs = 0
        },
        getTotalInputs: function() { for (var a = this.stack.length, b = 0; a--;) b += this.stack[a].inputs; return b },
        cleanUp: function(a) { a = a.data.$;
          a.ctrlKey || a.metaKey || this.remove(17);
          a.shiftKey || this.remove(16);
          a.altKey || this.remove(18) }
      }
    }(), "use strict",
    function() {
      function a(a, b) {
        CKEDITOR.tools.extend(this, { editor: a, editable: a.editable(), doc: a.document, win: a.window }, b, !0);
        this.inline = this.editable.isInline();
        this.inline ||
          (this.frame = this.win.getFrame());
        this.target = this[this.inline ? "editable" : "doc"]
      }

      function d(a, b) { CKEDITOR.tools.extend(this, b, { editor: a }, !0) }

      function b(a, b) {
        var c = a.editable();
        CKEDITOR.tools.extend(this, { editor: a, editable: c, inline: c.isInline(), doc: a.document, win: a.window, container: CKEDITOR.document.getBody(), winTop: CKEDITOR.document.getWindow() }, b, !0);
        this.hidden = {};
        this.visible = {};
        this.inline || (this.frame = this.win.getFrame());
        this.queryViewport();
        var d = CKEDITOR.tools.bind(this.queryViewport, this),
          e = CKEDITOR.tools.bind(this.hideVisible, this),
          k = CKEDITOR.tools.bind(this.removeAll, this);
        c.attachListener(this.winTop, "resize", d);
        c.attachListener(this.winTop, "scroll", d);
        c.attachListener(this.winTop, "resize", e);
        c.attachListener(this.win, "scroll", e);
        c.attachListener(this.inline ? c : this.frame, "mouseout", function(a) {
          var b = a.data.$.clientX;
          a = a.data.$.clientY;
          this.queryViewport();
          (b <= this.rect.left || b >= this.rect.right || a <= this.rect.top || a >= this.rect.bottom) && this.hideVisible();
          (0 >= b || b >= this.winTopPane.width ||
            0 >= a || a >= this.winTopPane.height) && this.hideVisible()
        }, this);
        c.attachListener(a, "resize", d);
        c.attachListener(a, "mode", k);
        a.on("destroy", k);
        this.lineTpl = (new CKEDITOR.template('\x3cdiv data-cke-lineutils-line\x3d"1" class\x3d"cke_reset_all" style\x3d"{lineStyle}"\x3e\x3cspan style\x3d"{tipLeftStyle}"\x3e\x26nbsp;\x3c/span\x3e\x3cspan style\x3d"{tipRightStyle}"\x3e\x26nbsp;\x3c/span\x3e\x3c/div\x3e')).output({
          lineStyle: CKEDITOR.tools.writeCssText(CKEDITOR.tools.extend({}, l, this.lineStyle, !0)),
          tipLeftStyle: CKEDITOR.tools.writeCssText(CKEDITOR.tools.extend({},
            g, { left: "0px", "border-left-color": "red", "border-width": "6px 0 6px 6px" }, this.tipCss, this.tipLeftStyle, !0)),
          tipRightStyle: CKEDITOR.tools.writeCssText(CKEDITOR.tools.extend({}, g, { right: "0px", "border-right-color": "red", "border-width": "6px 6px 6px 0" }, this.tipCss, this.tipRightStyle, !0))
        })
      }

      function c(a) { var b; if (b = a && a.type == CKEDITOR.NODE_ELEMENT) b = !(k[a.getComputedStyle("float")] || k[a.getAttribute("align")]); return b && !e[a.getComputedStyle("position")] } CKEDITOR.plugins.add("lineutils");
      CKEDITOR.LINEUTILS_BEFORE =
        1;
      CKEDITOR.LINEUTILS_AFTER = 2;
      CKEDITOR.LINEUTILS_INSIDE = 4;
      a.prototype = {
        start: function(a) {
          var b = this,
            c = this.editor,
            d = this.doc,
            e, g, k, l, t = CKEDITOR.tools.eventsBuffer(50, function() { c.readOnly || "wysiwyg" != c.mode || (b.relations = {}, (g = d.$.elementFromPoint(k, l)) && g.nodeType && (e = new CKEDITOR.dom.element(g), b.traverseSearch(e), isNaN(k + l) || b.pixelSearch(e, k, l), a && a(b.relations, k, l))) });
          this.listener = this.editable.attachListener(this.target, "mousemove", function(a) { k = a.data.$.clientX;
            l = a.data.$.clientY;
            t.input() });
          this.editable.attachListener(this.inline ? this.editable : this.frame, "mouseout", function() { t.reset() })
        },
        stop: function() { this.listener && this.listener.removeListener() },
        getRange: function() { var a = {};
          a[CKEDITOR.LINEUTILS_BEFORE] = CKEDITOR.POSITION_BEFORE_START;
          a[CKEDITOR.LINEUTILS_AFTER] = CKEDITOR.POSITION_AFTER_END;
          a[CKEDITOR.LINEUTILS_INSIDE] = CKEDITOR.POSITION_AFTER_START; return function(b) { var c = this.editor.createRange();
            c.moveToPosition(this.relations[b.uid].element, a[b.type]); return c } }(),
        store: function() {
          function a(b,
            c, d) { var e = b.getUniqueId();
            e in d ? d[e].type |= c : d[e] = { element: b, type: c } }
          return function(b, d) { var e;
            d & CKEDITOR.LINEUTILS_AFTER && c(e = b.getNext()) && e.isVisible() && (a(e, CKEDITOR.LINEUTILS_BEFORE, this.relations), d ^= CKEDITOR.LINEUTILS_AFTER);
            d & CKEDITOR.LINEUTILS_INSIDE && c(e = b.getFirst()) && e.isVisible() && (a(e, CKEDITOR.LINEUTILS_BEFORE, this.relations), d ^= CKEDITOR.LINEUTILS_INSIDE);
            a(b, d, this.relations) }
        }(),
        traverseSearch: function(a) {
          var b, d, e;
          do
            if (e = a.$["data-cke-expando"], !(e && e in this.relations)) {
              if (a.equals(this.editable)) break;
              if (c(a))
                for (b in this.lookups)(d = this.lookups[b](a)) && this.store(a, d)
            }
          while ((!a || a.type != CKEDITOR.NODE_ELEMENT || "true" != a.getAttribute("contenteditable")) && (a = a.getParent()))
        },
        pixelSearch: function() {
          function a(d, e, g, h, k) { for (var l = 0, t; k(g);) { g += h; if (25 == ++l) break; if (t = this.doc.$.elementFromPoint(e, g))
                if (t == d) l = 0;
                else if (b(d, t) && (l = 0, c(t = new CKEDITOR.dom.element(t)))) return t } }
          var b = CKEDITOR.env.ie || CKEDITOR.env.webkit ? function(a, b) { return a.contains(b) } : function(a, b) {
            return !!(a.compareDocumentPosition(b) &
              16)
          };
          return function(b, d, e) { var g = this.win.getViewPaneSize().height,
              k = a.call(this, b.$, d, e, -1, function(a) { return 0 < a });
            d = a.call(this, b.$, d, e, 1, function(a) { return a < g }); if (k)
              for (this.traverseSearch(k); !k.getParent().equals(b);) k = k.getParent(); if (d)
              for (this.traverseSearch(d); !d.getParent().equals(b);) d = d.getParent(); for (; k || d;) { k && (k = k.getNext(c)); if (!k || k.equals(d)) break;
              this.traverseSearch(k);
              d && (d = d.getPrevious(c)); if (!d || d.equals(k)) break;
              this.traverseSearch(d) } }
        }(),
        greedySearch: function() {
          this.relations = {};
          for (var a = this.editable.getElementsByTag("*"), b = 0, d, e, g; d = a.getItem(b++);)
            if (!d.equals(this.editable) && d.type == CKEDITOR.NODE_ELEMENT && (d.hasAttribute("contenteditable") || !d.isReadOnly()) && c(d) && d.isVisible())
              for (g in this.lookups)(e = this.lookups[g](d)) && this.store(d, e);
          return this.relations
        }
      };
      d.prototype = {
        locate: function() {
          function a(b, d) {
            var e = b.element[d === CKEDITOR.LINEUTILS_BEFORE ? "getPrevious" : "getNext"]();
            return e && c(e) ? (b.siblingRect = e.getClientRect(), d == CKEDITOR.LINEUTILS_BEFORE ? (b.siblingRect.bottom +
              b.elementRect.top) / 2 : (b.elementRect.bottom + b.siblingRect.top) / 2) : d == CKEDITOR.LINEUTILS_BEFORE ? b.elementRect.top : b.elementRect.bottom
          }
          return function(b) {
            var c;
            this.locations = {};
            for (var d in b) c = b[d], c.elementRect = c.element.getClientRect(), c.type & CKEDITOR.LINEUTILS_BEFORE && this.store(d, CKEDITOR.LINEUTILS_BEFORE, a(c, CKEDITOR.LINEUTILS_BEFORE)), c.type & CKEDITOR.LINEUTILS_AFTER && this.store(d, CKEDITOR.LINEUTILS_AFTER, a(c, CKEDITOR.LINEUTILS_AFTER)), c.type & CKEDITOR.LINEUTILS_INSIDE && this.store(d, CKEDITOR.LINEUTILS_INSIDE,
              (c.elementRect.top + c.elementRect.bottom) / 2);
            return this.locations
          }
        }(),
        sort: function() { var a, b, c, d; return function(e, g) { a = this.locations;
            b = []; for (var k in a)
              for (var l in a[k])
                if (c = Math.abs(e - a[k][l]), b.length) { for (d = 0; d < b.length; d++)
                    if (c < b[d].dist) { b.splice(d, 0, { uid: +k, type: l, dist: c }); break }
                  d == b.length && b.push({ uid: +k, type: l, dist: c }) } else b.push({ uid: +k, type: l, dist: c }); return "undefined" != typeof g ? b.slice(0, g) : b } }(),
        store: function(a, b, c) {
          this.locations[a] || (this.locations[a] = {});
          this.locations[a][b] =
            c
        }
      };
      var g = { display: "block", width: "0px", height: "0px", "border-color": "transparent", "border-style": "solid", position: "absolute", top: "-6px" },
        l = { height: "0px", "border-top": "1px dashed red", position: "absolute", "z-index": 9999 };
      b.prototype = {
        removeAll: function() { for (var a in this.hidden) this.hidden[a].remove(), delete this.hidden[a]; for (a in this.visible) this.visible[a].remove(), delete this.visible[a] },
        hideLine: function(a) { var b = a.getUniqueId();
          a.hide();
          this.hidden[b] = a;
          delete this.visible[b] },
        showLine: function(a) {
          var b =
            a.getUniqueId();
          a.show();
          this.visible[b] = a;
          delete this.hidden[b]
        },
        hideVisible: function() { for (var a in this.visible) this.hideLine(this.visible[a]) },
        placeLine: function(a, b) {
          var c, d, e;
          if (c = this.getStyle(a.uid, a.type)) {
            for (e in this.visible)
              if (this.visible[e].getCustomData("hash") !== this.hash) { d = this.visible[e]; break }
            if (!d)
              for (e in this.hidden)
                if (this.hidden[e].getCustomData("hash") !== this.hash) { this.showLine(d = this.hidden[e]); break }
            d || this.showLine(d = this.addLine());
            d.setCustomData("hash", this.hash);
            this.visible[d.getUniqueId()] = d;
            d.setStyles(c);
            b && b(d)
          }
        },
        getStyle: function(a, b) {
          var c = this.relations[a],
            d = this.locations[a][b],
            e = {};
          e.width = c.siblingRect ? Math.max(c.siblingRect.width, c.elementRect.width) : c.elementRect.width;
          e.top = this.inline ? d + this.winTopScroll.y - this.rect.relativeY : this.rect.top + this.winTopScroll.y + d;
          if (e.top - this.winTopScroll.y < this.rect.top || e.top - this.winTopScroll.y > this.rect.bottom) return !1;
          this.inline ? e.left = c.elementRect.left - this.rect.relativeX : (0 < c.elementRect.left ? e.left =
            this.rect.left + c.elementRect.left : (e.width += c.elementRect.left, e.left = this.rect.left), 0 < (c = e.left + e.width - (this.rect.left + this.winPane.width)) && (e.width -= c));
          e.left += this.winTopScroll.x;
          for (var g in e) e[g] = CKEDITOR.tools.cssLength(e[g]);
          return e
        },
        addLine: function() { var a = CKEDITOR.dom.element.createFromHtml(this.lineTpl);
          a.appendTo(this.container); return a },
        prepare: function(a, b) { this.relations = a;
          this.locations = b;
          this.hash = Math.random() },
        cleanup: function() {
          var a, b;
          for (b in this.visible) a = this.visible[b],
            a.getCustomData("hash") !== this.hash && this.hideLine(a)
        },
        queryViewport: function() { this.winPane = this.win.getViewPaneSize();
          this.winTopScroll = this.winTop.getScrollPosition();
          this.winTopPane = this.winTop.getViewPaneSize();
          this.rect = this.getClientRect(this.inline ? this.editable : this.frame) },
        getClientRect: function(a) {
          a = a.getClientRect();
          var b = this.container.getDocumentPosition(),
            c = this.container.getComputedStyle("position");
          a.relativeX = a.relativeY = 0;
          "static" != c && (a.relativeY = b.y, a.relativeX = b.x, a.top -= a.relativeY,
            a.bottom -= a.relativeY, a.left -= a.relativeX, a.right -= a.relativeX);
          return a
        }
      };
      var k = { left: 1, right: 1, center: 1 },
        e = { absolute: 1, fixed: 1 };
      CKEDITOR.plugins.lineutils = { finder: a, locator: d, liner: b }
    }(),
    function() {
      function a(a) { return a.getName && !a.hasAttribute("data-cke-temp") } CKEDITOR.plugins.add("widgetselection", {
        init: function(a) {
          if (CKEDITOR.env.webkit) {
            var b = CKEDITOR.plugins.widgetselection;
            a.on("contentDom", function(a) {
              a = a.editor;
              var d = a.document,
                l = a.editable();
              l.attachListener(d, "keydown", function(a) {
                a.data.getKeystroke() ==
                  CKEDITOR.CTRL + 65 && CKEDITOR.tools.setTimeout(function() { b.addFillers(l) || b.removeFillers(l) }, 0)
              }, null, null, -1);
              a.on("selectionCheck", function(a) { b.removeFillers(a.editor.editable()) });
              a.on("paste", function(a) { a.data.dataValue = b.cleanPasteData(a.data.dataValue) });
              "selectall" in a.plugins && b.addSelectAllIntegration(a)
            })
          }
        }
      });
      CKEDITOR.plugins.widgetselection = {
        startFiller: null,
        endFiller: null,
        fillerAttribute: "data-cke-filler-webkit",
        fillerContent: "\x26nbsp;",
        fillerTagName: "div",
        addFillers: function(d) {
          var b =
            d.editor;
          if (!this.isWholeContentSelected(d) && 0 < d.getChildCount()) { var c = d.getFirst(a),
              g = d.getLast(a);
            c && c.type == CKEDITOR.NODE_ELEMENT && !c.isEditable() && (this.startFiller = this.createFiller(), d.append(this.startFiller, 1));
            g && g.type == CKEDITOR.NODE_ELEMENT && !g.isEditable() && (this.endFiller = this.createFiller(!0), d.append(this.endFiller, 0)); if (this.hasFiller(d)) return b = b.createRange(), b.selectNodeContents(d), b.select(), !0 }
          return !1
        },
        removeFillers: function(a) {
          if (this.hasFiller(a) && !this.isWholeContentSelected(a)) {
            var b =
              a.findOne(this.fillerTagName + "[" + this.fillerAttribute + "\x3dstart]"),
              c = a.findOne(this.fillerTagName + "[" + this.fillerAttribute + "\x3dend]");
            this.startFiller && b && this.startFiller.equals(b) ? this.removeFiller(this.startFiller, a) : this.startFiller = b;
            this.endFiller && c && this.endFiller.equals(c) ? this.removeFiller(this.endFiller, a) : this.endFiller = c
          }
        },
        cleanPasteData: function(a) { a && a.length && (a = a.replace(this.createFillerRegex(), "").replace(this.createFillerRegex(!0), "")); return a },
        isWholeContentSelected: function(a) {
          var b =
            a.editor.getSelection().getRanges()[0];
          return !b || b && b.collapsed ? !1 : (b = b.clone(), b.enlarge(CKEDITOR.ENLARGE_ELEMENT), !!(b && a && b.startContainer && b.endContainer && 0 === b.startOffset && b.endOffset === a.getChildCount() && b.startContainer.equals(a) && b.endContainer.equals(a)))
        },
        hasFiller: function(a) { return 0 < a.find(this.fillerTagName + "[" + this.fillerAttribute + "]").count() },
        createFiller: function(a) {
          var b = new CKEDITOR.dom.element(this.fillerTagName);
          b.setHtml(this.fillerContent);
          b.setAttribute(this.fillerAttribute,
            a ? "end" : "start");
          b.setAttribute("data-cke-temp", 1);
          b.setStyles({ display: "block", width: 0, height: 0, padding: 0, border: 0, margin: 0, position: "absolute", top: 0, left: "-9999px", opacity: 0, overflow: "hidden" });
          return b
        },
        removeFiller: function(a, b) {
          if (a) {
            var c = b.editor,
              g = b.editor.getSelection().getRanges()[0].startPath(),
              l = c.createRange(),
              k, e;
            g.contains(a) && (k = a.getHtml(), e = !0);
            g = "start" == a.getAttribute(this.fillerAttribute);
            a.remove();
            k && 0 < k.length && k != this.fillerContent ? (b.insertHtmlIntoRange(k, c.getSelection().getRanges()[0]),
              l.setStartAt(b.getChild(b.getChildCount() - 1), CKEDITOR.POSITION_BEFORE_END), c.getSelection().selectRanges([l])) : e && (g ? l.setStartAt(b.getFirst().getNext(), CKEDITOR.POSITION_AFTER_START) : l.setEndAt(b.getLast().getPrevious(), CKEDITOR.POSITION_BEFORE_END), b.editor.getSelection().selectRanges([l]))
          }
        },
        createFillerRegex: function(a) { var b = this.createFiller(a).getOuterHtml().replace(/style="[^"]*"/gi, 'style\x3d"[^"]*"').replace(/>[^<]*</gi, "\x3e[^\x3c]*\x3c"); return new RegExp((a ? "" : "^") + b + (a ? "$" : "")) },
        addSelectAllIntegration: function(a) {
          var b =
            this;
          a.editable().attachListener(a, "beforeCommandExec", function(c) { var g = a.editable(); "selectAll" == c.data.name && g && b.addFillers(g) }, null, null, 9999)
        }
      }
    }(), "use strict",
    function() {
      function a(a) {
        this.editor = a;
        this.registered = {};
        this.instances = {};
        this.selected = [];
        this.widgetHoldingFocusedEditable = this.focused = null;
        this._ = { nextId: 0, upcasts: [], upcastCallbacks: [], filters: {} };
        G(this);
        A(this);
        this.on("checkWidgets", k);
        this.editor.on("contentDomInvalidated", this.checkWidgets, this);
        z(this);
        x(this);
        y(this);
        B(this);
        C(this)
      }

      function d(a, b, c, e, g) {
        var f = a.editor;
        CKEDITOR.tools.extend(this, e, { editor: f, id: b, inline: "span" == c.getParent().getName(), element: c, data: CKEDITOR.tools.extend({}, "function" == typeof e.defaults ? e.defaults() : e.defaults), dataReady: !1, inited: !1, ready: !1, edit: d.prototype.edit, focusedEditable: null, definition: e, repository: a, draggable: !1 !== e.draggable, _: { downcastFn: e.downcast && "string" == typeof e.downcast ? e.downcasts[e.downcast] : e.downcast } }, !0);
        a.fire("instanceCreated", this);
        da(this, e);
        this.init && this.init();
        this.inited = !0;
        (a = this.element.data("cke-widget-data")) && this.setData(JSON.parse(decodeURIComponent(a)));
        g && this.setData(g);
        this.data.classes || this.setData("classes", this.getClasses());
        this.dataReady = !0;
        Q(this);
        this.fire("data", this.data);
        this.isInited() && f.editable().contains(this.wrapper) && (this.ready = !0, this.fire("ready"))
      }

      function b(a, b, c) {
        CKEDITOR.dom.element.call(this, b.$);
        this.editor = a;
        this._ = {};
        b = this.filter = c.filter;
        CKEDITOR.dtd[this.getName()].p ? (this.enterMode = b ? b.getAllowedEnterMode(a.enterMode) :
          a.enterMode, this.shiftEnterMode = b ? b.getAllowedEnterMode(a.shiftEnterMode, !0) : a.shiftEnterMode) : this.enterMode = this.shiftEnterMode = CKEDITOR.ENTER_BR
      }

      function c(a, b) {
        a.addCommand(b.name, {
          exec: function(a, c) {
            function d() { a.widgets.finalizeCreation(k) }
            var e = a.widgets.focused;
            if (e && e.name == b.name) e.edit();
            else if (b.insert) b.insert();
            else if (b.template) {
              var e = "function" == typeof b.defaults ? b.defaults() : b.defaults,
                e = CKEDITOR.dom.element.createFromHtml(b.template.output(e)),
                g, f = a.widgets.wrapElement(e, b.name),
                k = new CKEDITOR.dom.documentFragment(f.getDocument());
              k.append(f);
              (g = a.widgets.initOn(e, b, c && c.startupData)) ? (e = g.once("edit", function(b) { if (b.data.dialog) g.once("dialog", function(b) { b = b.data; var c, e;
                  c = b.once("ok", d, null, null, 20);
                  e = b.once("cancel", function(b) { b.data && !1 === b.data.hide || a.widgets.destroy(g, !0) });
                  b.once("hide", function() { c.removeListener();
                    e.removeListener() }) });
                else d() }, null, null, 999), g.edit(), e.removeListener()) : d()
            }
          },
          allowedContent: b.allowedContent,
          requiredContent: b.requiredContent,
          contentForms: b.contentForms,
          contentTransformations: b.contentTransformations
        })
      }

      function g(a, b) {
        function c(a, d) { var e = b.upcast.split(","),
            g, f; for (f = 0; f < e.length; f++)
            if (g = e[f], g === a.name) return b.upcasts[g].call(this, a, d); return !1 }

        function d(b, c, e) { var g = CKEDITOR.tools.getIndex(a._.upcasts, function(a) { return a[2] > e });
          0 > g && (g = a._.upcasts.length);
          a._.upcasts.splice(g, 0, [CKEDITOR.tools.bind(b, c), c.name, e]) } var e = b.upcast,
          g = b.upcastPriority || 10;
        e && ("string" == typeof e ? d(c, b, g) : d(e, b, g)) }

      function l(a, b) {
        a.focused =
          null;
        if (b.isInited()) { var c = b.editor.checkDirty();
          a.fire("widgetBlurred", { widget: b });
          b.setFocused(!1);!c && b.editor.resetDirty() }
      }

      function k(a) {
        a = a.data;
        if ("wysiwyg" == this.editor.mode) {
          var b = this.editor.editable(),
            c = this.instances,
            e, g, f, k;
          if (b) {
            for (e in c) c[e].isReady() && !b.contains(c[e].wrapper) && this.destroy(c[e], !0);
            if (a && a.initOnlyNew) c = this.initOnAll();
            else {
              var h = b.find(".cke_widget_wrapper"),
                c = [];
              e = 0;
              for (g = h.count(); e < g; e++) {
                f = h.getItem(e);
                if (k = !this.getByElement(f, !0)) {
                  a: {
                    k = v;
                    for (var l = f; l =
                      l.getParent();)
                      if (k(l)) { k = !0; break a }
                    k = !1
                  }
                  k = !k
                }
                k && b.contains(f) && (f.addClass("cke_widget_new"), c.push(this.initOn(f.getFirst(d.isDomWidgetElement))))
              }
            }
            a && a.focusInited && 1 == c.length && c[0].focus()
          }
        }
      }

      function e(a) {
        if ("undefined" != typeof a.attributes && a.attributes["data-widget"]) {
          var b = h(a),
            c = m(a),
            d = !1;
          b && b.value && b.value.match(/^\s/g) && (b.parent.attributes["data-cke-white-space-first"] = 1, b.value = b.value.replace(/^\s/g, "\x26nbsp;"), d = !0);
          c && c.value && c.value.match(/\s$/g) && (c.parent.attributes["data-cke-white-space-last"] =
            1, c.value = c.value.replace(/\s$/g, "\x26nbsp;"), d = !0);
          d && (a.attributes["data-cke-widget-white-space"] = 1)
        }
      }

      function h(a) { return a.find(function(a) { return 3 === a.type }, !0).shift() }

      function m(a) { return a.find(function(a) { return 3 === a.type }, !0).pop() }

      function f(a, b, c) {
        if (!c.allowedContent && !c.disallowedContent) return null;
        var d = this._.filters[a];
        d || (this._.filters[a] = d = {});
        a = d[b];
        a || (a = c.allowedContent ? new CKEDITOR.filter(c.allowedContent) : this.editor.filter.clone(), d[b] = a, c.disallowedContent && a.disallow(c.disallowedContent));
        return a
      }

      function n(a) {
        var b = [],
          c = a._.upcasts,
          e = a._.upcastCallbacks;
        return {
          toBeWrapped: b,
          iterator: function(a) {
            var g, f, k, h, l;
            if ("data-cke-widget-wrapper" in a.attributes) return (a = a.getFirst(d.isParserWidgetElement)) && b.push([a]), !1;
            if ("data-widget" in a.attributes) return b.push([a]), !1;
            if (l = c.length) {
              if (a.attributes["data-cke-widget-upcasted"]) return !1;
              h = 0;
              for (g = e.length; h < g; ++h)
                if (!1 === e[h](a)) return;
              for (h = 0; h < l; ++h)
                if (g = c[h], k = {}, f = g[0](a, k)) return f instanceof CKEDITOR.htmlParser.element && (a = f), a.attributes["data-cke-widget-data"] =
                  encodeURIComponent(JSON.stringify(k)), a.attributes["data-cke-widget-upcasted"] = 1, b.push([a, g[1]]), !1
            }
          }
        }
      }

      function p(a, b) { return { tabindex: -1, contenteditable: "false", "data-cke-widget-wrapper": 1, "data-cke-filter": "off", "class": "cke_widget_wrapper cke_widget_new cke_widget_" + (a ? "inline" : "block") + (b ? " cke_widget_" + b : "") } }

      function q(a, b, c) {
        if (a.type == CKEDITOR.NODE_ELEMENT) {
          var d = CKEDITOR.dtd[a.name];
          if (d && !d[c.name]) {
            var d = a.split(b),
              e = a.parent;
            b = d.getIndex();
            a.children.length || (--b, a.remove());
            d.children.length ||
              d.remove();
            return q(e, b, c)
          }
        }
        a.add(c, b)
      }

      function w(a, b) { return "boolean" == typeof a.inline ? a.inline : !!CKEDITOR.dtd.$inline[b] }

      function v(a) { return a.hasAttribute("data-cke-temp") }

      function t(a, b, c, d) {
        var e = a.editor;
        e.fire("lockSnapshot");
        c ? (d = c.data("cke-widget-editable"), d = b.editables[d], a.widgetHoldingFocusedEditable = b, b.focusedEditable = d, c.addClass("cke_widget_editable_focused"), d.filter && e.setActiveFilter(d.filter), e.setActiveEnterMode(d.enterMode, d.shiftEnterMode)) : (d || b.focusedEditable.removeClass("cke_widget_editable_focused"),
          b.focusedEditable = null, a.widgetHoldingFocusedEditable = null, e.setActiveFilter(null), e.setActiveEnterMode(null, null));
        e.fire("unlockSnapshot")
      }

      function u(a) { a.contextMenu && a.contextMenu.addListener(function(b) { if (b = a.widgets.getByElement(b, !0)) return b.fire("contextMenu", {}) }) }

      function r(a, b) { return CKEDITOR.tools.trim(b) }

      function B(a) {
        var b = a.editor,
          c = CKEDITOR.plugins.lineutils;
        b.on("dragstart", function(c) {
          var e = c.data.target;
          d.isDomDragHandler(e) && (e = a.getByElement(e), c.data.dataTransfer.setData("cke/widget-id",
            e.id), b.focus(), e.focus())
        });
        b.on("drop", function(c) {
          var d = c.data.dataTransfer,
            e = d.getData("cke/widget-id"),
            g = d.getTransferType(b),
            d = b.createRange();
          "" !== e && g === CKEDITOR.DATA_TRANSFER_CROSS_EDITORS ? c.cancel() : "" !== e && g == CKEDITOR.DATA_TRANSFER_INTERNAL && (e = a.instances[e]) && (d.setStartBefore(e.wrapper), d.setEndAfter(e.wrapper), c.data.dragRange = d, delete CKEDITOR.plugins.clipboard.dragStartContainerChildCount, delete CKEDITOR.plugins.clipboard.dragEndContainerChildCount, c.data.dataTransfer.setData("text/html",
            b.editable().getHtmlFromRange(d).getHtml()), b.widgets.destroy(e, !0))
        });
        b.on("contentDom", function() {
          var e = b.editable();
          CKEDITOR.tools.extend(a, {
            finder: new c.finder(b, {
              lookups: {
                "default": function(b) {
                  if (!b.is(CKEDITOR.dtd.$listItem) && b.is(CKEDITOR.dtd.$block) && !d.isDomNestedEditable(b) && !a._.draggedWidget.wrapper.contains(b)) {
                    var c = d.getNestedEditable(e, b);
                    if (c) { b = a._.draggedWidget; if (a.getByElement(c) == b) return;
                      c = CKEDITOR.filter.instances[c.data("cke-filter")];
                      b = b.requiredContent; if (c && b && !c.check(b)) return }
                    return CKEDITOR.LINEUTILS_BEFORE |
                      CKEDITOR.LINEUTILS_AFTER
                  }
                }
              }
            }),
            locator: new c.locator(b),
            liner: new c.liner(b, { lineStyle: { cursor: "move !important", "border-top-color": "#666" }, tipLeftStyle: { "border-left-color": "#666" }, tipRightStyle: { "border-right-color": "#666" } })
          }, !0)
        })
      }

      function x(a) {
        var b = a.editor;
        b.on("contentDom", function() {
          var c = b.editable(),
            e = c.isInline() ? c : b.document,
            g, f;
          c.attachListener(e, "mousedown", function(c) {
            var e = c.data.getTarget();
            g = e instanceof CKEDITOR.dom.element ? a.getByElement(e) : null;
            f = 0;
            g && (g.inline && e.type == CKEDITOR.NODE_ELEMENT &&
              e.hasAttribute("data-cke-widget-drag-handler") ? (f = 1, a.focused != g && b.getSelection().removeAllRanges()) : d.getNestedEditable(g.wrapper, e) ? g = null : (c.data.preventDefault(), CKEDITOR.env.ie || g.focus()))
          });
          c.attachListener(e, "mouseup", function() { f && g && g.wrapper && (f = 0, g.focus()) });
          CKEDITOR.env.ie && c.attachListener(e, "mouseup", function() { setTimeout(function() { g && g.wrapper && c.contains(g.wrapper) && (g.focus(), g = null) }) })
        });
        b.on("doubleclick", function(b) {
          var c = a.getByElement(b.data.element);
          if (c && !d.getNestedEditable(c.wrapper,
              b.data.element)) return c.fire("doubleclick", { element: b.data.element })
        }, null, null, 1)
      }

      function y(a) {
        a.editor.on("key", function(b) {
          var c = a.focused,
            d = a.widgetHoldingFocusedEditable,
            e;
          c ? e = c.fire("key", { keyCode: b.data.keyCode }) : d && (c = b.data.keyCode, b = d.focusedEditable, c == CKEDITOR.CTRL + 65 ? (c = b.getBogus(), d = d.editor.createRange(), d.selectNodeContents(b), c && d.setEndAt(c, CKEDITOR.POSITION_BEFORE_START), d.select(), e = !1) : 8 == c || 46 == c ? (e = d.editor.getSelection().getRanges(), d = e[0], e = !(1 == e.length && d.collapsed &&
            d.checkBoundaryOfElement(b, CKEDITOR[8 == c ? "START" : "END"]))) : e = void 0);
          return e
        }, null, null, 1)
      }

      function C(a) {
        function b(c) { a.focused && H(a.focused, "cut" == c.name) } var c = a.editor;
        c.on("contentDom", function() { var a = c.editable();
          a.attachListener(a, "copy", b);
          a.attachListener(a, "cut", b) }) }

      function z(a) {
        var b = a.editor;
        b.on("selectionCheck", function() { a.fire("checkSelection") });
        a.on("checkSelection", a.checkSelection, a);
        b.on("selectionChange", function(c) {
          var e = (c = d.getNestedEditable(b.editable(), c.data.selection.getStartElement())) &&
            a.getByElement(c),
            g = a.widgetHoldingFocusedEditable;
          g ? g === e && g.focusedEditable.equals(c) || (t(a, g, null), e && c && t(a, e, c)) : e && c && t(a, e, c)
        });
        b.on("dataReady", function() { D(a).commit() });
        b.on("blur", function() { var b;
          (b = a.focused) && l(a, b);
          (b = a.widgetHoldingFocusedEditable) && t(a, b, null) })
      }

      function A(a) {
        var b = a.editor,
          c = {};
        b.on("toDataFormat", function(b) {
          var e = CKEDITOR.tools.getNextNumber(),
            g = [];
          b.data.downcastingSessionId = e;
          c[e] = g;
          b.data.dataValue.forEach(function(b) {
            var c = b.attributes,
              e;
            if ("data-cke-widget-white-space" in
              c) { e = h(b); var f = m(b);
              e.parent.attributes["data-cke-white-space-first"] && (e.value = e.value.replace(/^&nbsp;/g, " "));
              f.parent.attributes["data-cke-white-space-last"] && (f.value = f.value.replace(/&nbsp;$/g, " ")) }
            if ("data-cke-widget-id" in c) { if (c = a.instances[c["data-cke-widget-id"]]) e = b.getFirst(d.isParserWidgetElement), g.push({ wrapper: b, element: e, widget: c, editables: {} }), "1" != e.attributes["data-cke-widget-keep-attr"] && delete e.attributes["data-widget"] } else if ("data-cke-widget-editable" in c) return g[g.length -
              1].editables[c["data-cke-widget-editable"]] = b, !1
          }, CKEDITOR.NODE_ELEMENT, !0)
        }, null, null, 8);
        b.on("toDataFormat", function(a) { if (a.data.downcastingSessionId) { a = c[a.data.downcastingSessionId]; for (var b, d, e, g, f, k; b = a.shift();) { d = b.widget;
              e = b.element;
              g = d._.downcastFn && d._.downcastFn.call(d, e); for (k in b.editables) f = b.editables[k], delete f.attributes.contenteditable, f.setHtml(d.editables[k].getData());
              g || (g = e);
              b.wrapper.replaceWith(g) } } }, null, null, 13);
        b.on("contentDomUnload", function() { a.destroyAll(!0) })
      }

      function G(a) {
        var b = a.editor,
          c, e;
        b.on("toHtml", function(b) { var e = n(a),
              g; for (b.data.dataValue.forEach(e.iterator, CKEDITOR.NODE_ELEMENT, !0); g = e.toBeWrapped.pop();) { var f = g[0],
                k = f.parent;
              k.type == CKEDITOR.NODE_ELEMENT && k.attributes["data-cke-widget-wrapper"] && k.replaceWith(f);
              a.wrapElement(g[0], g[1]) } c = b.data.protectedWhitespaces ? 3 == b.data.dataValue.children.length && d.isParserWidgetWrapper(b.data.dataValue.children[1]) : 1 == b.data.dataValue.children.length && d.isParserWidgetWrapper(b.data.dataValue.children[0]) },
          null, null, 8);
        b.on("dataReady", function() { if (e)
            for (var c = b.editable().find(".cke_widget_wrapper"), g, f, k = 0, h = c.count(); k < h; ++k) g = c.getItem(k), f = g.getFirst(d.isDomWidgetElement), f.type == CKEDITOR.NODE_ELEMENT && f.data("widget") ? (f.replace(g), a.wrapElement(f)) : g.remove();
          e = 0;
          a.destroyAll(!0);
          a.initOnAll() });
        b.on("loadSnapshot", function(b) { /data-cke-widget/.test(b.data) && (e = 1);
          a.destroyAll(!0) }, null, null, 9);
        b.on("paste", function(a) {
          a = a.data;
          a.dataValue = a.dataValue.replace(U, r);
          a.range && (a = d.getNestedEditable(b.editable(),
            a.range.startContainer)) && (a = CKEDITOR.filter.instances[a.data("cke-filter")]) && b.setActiveFilter(a)
        });
        b.on("afterInsertHtml", function(d) { d.data.intoRange ? a.checkWidgets({ initOnlyNew: !0 }) : (b.fire("lockSnapshot"), a.checkWidgets({ initOnlyNew: !0, focusInited: c }), b.fire("unlockSnapshot")) })
      }

      function D(a) {
        var b = a.selected,
          c = [],
          d = b.slice(0),
          e = null;
        return {
          select: function(a) { 0 > CKEDITOR.tools.indexOf(b, a) && c.push(a);
            a = CKEDITOR.tools.indexOf(d, a);
            0 <= a && d.splice(a, 1); return this },
          focus: function(a) { e = a; return this },
          commit: function() { var g = a.focused !== e,
              f, k;
            a.editor.fire("lockSnapshot"); for (g && (f = a.focused) && l(a, f); f = d.pop();) b.splice(CKEDITOR.tools.indexOf(b, f), 1), f.isInited() && (k = f.editor.checkDirty(), f.setSelected(!1), !k && f.editor.resetDirty());
            g && e && (k = a.editor.checkDirty(), a.focused = e, a.fire("widgetFocused", { widget: e }), e.setFocused(!0), !k && a.editor.resetDirty()); for (; f = c.pop();) b.push(f), f.setSelected(!0);
            a.editor.fire("unlockSnapshot") }
        }
      }

      function F(a, b, c) {
        var d = 0;
        b = K(b);
        var e = a.data.classes || {},
          g;
        if (b) {
          for (e =
            CKEDITOR.tools.clone(e); g = b.pop();) c ? e[g] || (d = e[g] = 1) : e[g] && (delete e[g], d = 1);
          d && a.setData("classes", e)
        }
      }

      function I(a) { a.cancel() }

      function H(a, b) {
        var c = a.editor,
          d = c.document,
          e = CKEDITOR.env.edge && 16 <= CKEDITOR.env.version;
        if (!d.getById("cke_copybin")) {
          var g = !c.blockless && !CKEDITOR.env.ie || e ? "div" : "span",
            e = d.createElement(g),
            f = d.createElement(g),
            g = CKEDITOR.env.ie && 9 > CKEDITOR.env.version;
          f.setAttributes({ id: "cke_copybin", "data-cke-temp": "1" });
          e.setStyles({
            position: "absolute",
            width: "1px",
            height: "1px",
            overflow: "hidden"
          });
          e.setStyle("ltr" == c.config.contentsLangDirection ? "left" : "right", "-5000px");
          var k = c.createRange();
          k.setStartBefore(a.wrapper);
          k.setEndAfter(a.wrapper);
          e.setHtml('\x3cspan data-cke-copybin-start\x3d"1"\x3e​\x3c/span\x3e' + c.editable().getHtmlFromRange(k).getHtml() + '\x3cspan data-cke-copybin-end\x3d"1"\x3e​\x3c/span\x3e');
          c.fire("saveSnapshot");
          c.fire("lockSnapshot");
          f.append(e);
          c.editable().append(f);
          var h = c.on("selectionChange", I, null, null, 0),
            l = a.repository.on("checkSelection", I,
              null, null, 0);
          if (g) var m = d.getDocumentElement().$,
            n = m.scrollTop;
          k = c.createRange();
          k.selectNodeContents(e);
          k.select();
          g && (m.scrollTop = n);
          setTimeout(function() { b || a.focus();
            f.remove();
            h.removeListener();
            l.removeListener();
            c.fire("unlockSnapshot");
            b && !c.readOnly && (a.repository.del(a), c.fire("saveSnapshot")) }, 100)
        }
      }

      function K(a) { return (a = (a = a.getDefinition().attributes) && a["class"]) ? a.split(/\s+/) : null }

      function J() {
        var a = CKEDITOR.document.getActive(),
          b = this.editor,
          c = b.editable();
        (c.isInline() ? c : b.document.getWindow().getFrame()).equals(a) &&
          b.focusManager.focus(c)
      }

      function E() { CKEDITOR.env.gecko && this.editor.unlockSelection();
        CKEDITOR.env.webkit || (this.editor.forceNextSelectionCheck(), this.editor.selectionChange(1)) }

      function R(a) { var b = null;
        a.on("data", function() { var a = this.data.classes,
            c; if (b != a) { for (c in b) a && a[c] || this.removeClass(c); for (c in a) this.addClass(c);
            b = a } }) }

      function O(a) {
        a.on("data", function() {
          if (a.wrapper && this.editor.lang.widget) {
            var b = this.getLabel ? this.getLabel() : this.editor.lang.widget.label.replace(/%1/, this.pathName || this.element.getName());
            a.wrapper.setAttribute("role", "region");
            a.wrapper.setAttribute("aria-label", b)
          }
        }, null, null, 9999)
      }

      function S(a) {
        if (a.draggable) {
          var b = a.editor,
            c = a.wrapper.getLast(d.isDomDragHandlerContainer),
            e;
            if (b && b.lang && b.lang.widget) {
          c ? e = c.findOne("img") : (c = new CKEDITOR.dom.element("span", b.document), c.setAttributes({ "class": "cke_reset cke_widget_drag_handler_container", style: "background:rgba(220,220,220,0.5);background-image:url(" + b.plugins.widget.path + "images/handle.png)" }), e = new CKEDITOR.dom.element("img", b.document), e.setAttributes({
            "class": "cke_reset cke_widget_drag_handler",
            "data-cke-widget-drag-handler": "1",
            src: CKEDITOR.tools.transparentImageData,
            width: 15,
            title: b.lang.widget.move,
            height: 15,
            role: "presentation"
          }), a.inline && e.setAttribute("draggable", "true"), c.append(e), a.wrapper.append(c));
          a.wrapper.on("dragover", function(a) { a.data.preventDefault() });
          a.wrapper.on("mouseenter", a.updateDragHandlerPosition, a);
          setTimeout(function() { a.on("data", a.updateDragHandlerPosition, a) }, 50);
          if (!a.inline && (e.on("mousedown", L, a), CKEDITOR.env.ie && 9 > CKEDITOR.env.version)) e.on("dragstart",
            function(a) { a.data.preventDefault(!0) });
          a.dragHandlerContainer = c
          }
        }
      }

      function L(a) {
        function b() { var c; for (p.reset(); c = k.pop();) c.removeListener(); var d = h;
          c = a.sender; var e = this.repository.finder,
            g = this.repository.liner,
            f = this.editor,
            l = this.editor.editable();
          CKEDITOR.tools.isEmpty(g.visible) || (d = e.getRange(d[0]), this.focus(), f.fire("drop", { dropRange: d, target: d.startContainer }));
          l.removeClass("cke_widget_dragging");
          g.hideVisible();
          f.fire("dragend", { target: c }) }
        if (CKEDITOR.tools.getMouseButton(a) === CKEDITOR.MOUSE_BUTTON_LEFT) {
          var c =
            this.repository.finder,
            d = this.repository.locator,
            e = this.repository.liner,
            g = this.editor,
            f = g.editable(),
            k = [],
            h = [],
            l, m;
          this.repository._.draggedWidget = this;
          var n = c.greedySearch(),
            p = CKEDITOR.tools.eventsBuffer(50, function() { l = d.locate(n);
              h = d.sort(m, 1);
              h.length && (e.prepare(n, l), e.placeLine(h[0]), e.cleanup()) });
          f.addClass("cke_widget_dragging");
          k.push(f.on("mousemove", function(a) { m = a.data.$.clientY;
            p.input() }));
          g.fire("dragstart", { target: a.sender });
          k.push(g.document.once("mouseup", b, this));
          f.isInline() ||
            k.push(CKEDITOR.document.once("mouseup", b, this))
        }
      }

      function V(a) { var b, c, d = a.editables;
        a.editables = {}; if (a.editables)
          for (b in d) c = d[b], a.initEditable(b, "string" == typeof c ? { selector: c } : c) }

      function Z(a) { if (a.mask) { var b = a.wrapper.findOne(".cke_widget_mask");
          b || (b = new CKEDITOR.dom.element("img", a.editor.document), b.setAttributes({ src: CKEDITOR.tools.transparentImageData, "class": "cke_reset cke_widget_mask" }), a.wrapper.append(b));
          a.mask = b } }

      function X(a) {
        if (a.parts) {
          var b = {},
            c, d;
          for (d in a.parts) c = a.wrapper.findOne(a.parts[d]),
            b[d] = c;
          a.parts = b
        }
      }

      function da(a, b) {
        P(a);
        X(a);
        V(a);
        Z(a);
        S(a);
        R(a);
        O(a);
        if (CKEDITOR.env.ie && 9 > CKEDITOR.env.version) a.wrapper.on("dragstart", function(b) { var c = b.data.getTarget();
          d.getNestedEditable(a, c) || a.inline && d.isDomDragHandler(c) || b.data.preventDefault() });
        a.wrapper.removeClass("cke_widget_new");
        a.element.addClass("cke_widget_element");
        a.on("key", function(b) {
          b = b.data.keyCode;
          if (13 == b) a.edit();
          else {
            if (b == CKEDITOR.CTRL + 67 || b == CKEDITOR.CTRL + 88) { H(a, b == CKEDITOR.CTRL + 88); return }
            if (b in T || CKEDITOR.CTRL &
              b || CKEDITOR.ALT & b) return
          }
          return !1
        }, null, null, 999);
        a.on("doubleclick", function(b) { a.edit() && b.cancel() });
        if (b.data) a.on("data", b.data);
        if (b.edit) a.on("edit", b.edit)
      }

      function P(a) {
        (a.wrapper = a.element.getParent()).setAttribute("data-cke-widget-id", a.id) }

      function Q(a) { a.element.data("cke-widget-data", encodeURIComponent(JSON.stringify(a.data))) }

      function M() {
        function a() {}

        function b(a, c, d) { return d && this.checkElement(a) ? (a = d.widgets.getByElement(a, !0)) && a.checkStyleActive(this) : !1 }
        var c = {};
        CKEDITOR.style.addCustomHandler({
          type: "widget",
          setup: function(a) { this.widget = a.widget; if (this.group = "string" == typeof a.group ? [a.group] : a.group) { a = this.widget; var b;
              c[a] || (c[a] = {}); for (var d = 0, e = this.group.length; d < e; d++) b = this.group[d], c[a][b] || (c[a][b] = []), c[a][b].push(this) } },
          apply: function(a) { var b;
            a instanceof CKEDITOR.editor && this.checkApplicable(a.elementPath(), a) && (b = a.widgets.focused, this.group && this.removeStylesFromSameGroup(a), b.applyStyle(this)) },
          remove: function(a) {
            a instanceof CKEDITOR.editor && this.checkApplicable(a.elementPath(),
              a) && a.widgets.focused.removeStyle(this)
          },
          removeStylesFromSameGroup: function(a) { var b, d, e = !1; if (!(a instanceof CKEDITOR.editor)) return !1;
            d = a.elementPath(); if (this.checkApplicable(d, a))
              for (var g = 0, f = this.group.length; g < f; g++) { b = c[this.widget][this.group[g]]; for (var k = 0; k < b.length; k++) b[k] !== this && b[k].checkActive(d, a) && (a.widgets.focused.removeStyle(b[k]), e = !0) }
            return e },
          checkActive: function(a, b) { return this.checkElementMatch(a.lastElement, 0, b) },
          checkApplicable: function(a, b) {
            return b instanceof CKEDITOR.editor ?
              this.checkElement(a.lastElement) : !1
          },
          checkElementMatch: b,
          checkElementRemovable: b,
          checkElement: function(a) { return d.isDomWidgetWrapper(a) ? (a = a.getFirst(d.isDomWidgetElement)) && a.data("widget") == this.widget : !1 },
          buildPreview: function(a) { return a || this._.definition.name },
          toAllowedContentRules: function(a) {
            if (!a) return null;
            a = a.widgets.registered[this.widget];
            var b, c = {};
            if (!a) return null;
            if (a.styleableElements) {
              b = this.getClassesArray();
              if (!b) return null;
              c[a.styleableElements] = { classes: b, propertiesOnly: !0 };
              return c
            }
            return a.styleToAllowedContentRules ? a.styleToAllowedContentRules(this) : null
          },
          getClassesArray: function() { var a = this._.definition.attributes && this._.definition.attributes["class"]; return a ? CKEDITOR.tools.trim(a).split(/\s+/) : null },
          applyToRange: a,
          removeFromRange: a,
          applyToObject: a
        })
      }
      CKEDITOR.plugins.add("widget", {
        requires: "lineutils,clipboard,widgetselection",
        onLoad: function() {
          void 0 !== CKEDITOR.document.$.querySelectorAll && (CKEDITOR.addCss(".cke_widget_wrapper{position:relative;outline:none}.cke_widget_inline{display:inline-block}.cke_widget_wrapper:hover\x3e.cke_widget_element{outline:2px solid #ffd25c;cursor:default}.cke_widget_wrapper:hover .cke_widget_editable{outline:2px solid #ffd25c}.cke_widget_wrapper.cke_widget_focused\x3e.cke_widget_element,.cke_widget_wrapper .cke_widget_editable.cke_widget_editable_focused{outline:2px solid #47a4f5}.cke_widget_editable{cursor:text}.cke_widget_drag_handler_container{position:absolute;width:15px;height:0;display:none;opacity:0.75;transition:height 0s 0.2s;line-height:0}.cke_widget_wrapper:hover\x3e.cke_widget_drag_handler_container{height:15px;transition:none}.cke_widget_drag_handler_container:hover{opacity:1}img.cke_widget_drag_handler{cursor:move;width:15px;height:15px;display:inline-block}.cke_widget_mask{position:absolute;top:0;left:0;width:100%;height:100%;display:block}.cke_editable.cke_widget_dragging, .cke_editable.cke_widget_dragging *{cursor:move !important}"),
            M())
        },
        beforeInit: function(b) { void 0 !== CKEDITOR.document.$.querySelectorAll && (b.widgets = new a(b)) },
        afterInit: function(a) { if (void 0 !== CKEDITOR.document.$.querySelectorAll) { var b = a.widgets.registered,
              c, d, e; for (d in b) c = b[d], (e = c.button) && a.ui.addButton && a.ui.addButton(CKEDITOR.tools.capitalize(c.name, !0), { label: e, command: c.name, toolbar: "insert,10" });
            u(a) } }
      });
      a.prototype = {
        MIN_SELECTION_CHECK_INTERVAL: 500,
        add: function(a, b) {
          b = CKEDITOR.tools.prototypedCopy(b);
          b.name = a;
          b._ = b._ || {};
          this.editor.fire("widgetDefinition",
            b);
          b.template && (b.template = new CKEDITOR.template(b.template));
          c(this.editor, b);
          g(this, b);
          return this.registered[a] = b
        },
        addUpcastCallback: function(a) { this._.upcastCallbacks.push(a) },
        checkSelection: function() {
          var a = this.editor.getSelection(),
            b = a.getSelectedElement(),
            c = D(this),
            e;
          if (b && (e = this.getByElement(b, !0))) return c.focus(e).select(e).commit();
          a = a.getRanges()[0];
          if (!a || a.collapsed) return c.commit();
          a = new CKEDITOR.dom.walker(a);
          for (a.evaluator = d.isDomWidgetWrapper; b = a.next();) c.select(this.getByElement(b));
          c.commit()
        },
        checkWidgets: function(a) { this.fire("checkWidgets", CKEDITOR.tools.copy(a || {})) },
        del: function(a) { if (this.focused === a) { var b = a.editor,
              c = b.createRange(),
              d;
            (d = c.moveToClosestEditablePosition(a.wrapper, !0)) || (d = c.moveToClosestEditablePosition(a.wrapper, !1));
            d && b.getSelection().selectRanges([c]) } a.wrapper.remove();
          this.destroy(a, !0) },
        destroy: function(a, b) { this.widgetHoldingFocusedEditable === a && t(this, a, null, b);
          a.destroy(b);
          delete this.instances[a.id];
          this.fire("instanceDestroyed", a) },
        destroyAll: function(a,
          b) { var c, d, e = this.instances; if (b && !a) { d = b.find(".cke_widget_wrapper"); for (var e = d.count(), g = 0; g < e; ++g)(c = this.getByElement(d.getItem(g), !0)) && this.destroy(c) } else
            for (d in e) c = e[d], this.destroy(c, a) },
        finalizeCreation: function(a) {
          (a = a.getFirst()) && d.isDomWidgetWrapper(a) && (this.editor.insertElement(a), a = this.getByElement(a), a.ready = !0, a.fire("ready"), a.focus()) },
        getByElement: function() {
          function a(c) { return c.is(b) && c.data("cke-widget-id") }
          var b = { div: 1, span: 1 };
          return function(b, c) {
            if (!b) return null;
            var d = a(b);
            if (!c && !d) { var e = this.editor.editable();
              do b = b.getParent(); while (b && !b.equals(e) && !(d = a(b))) }
            return this.instances[d] || null
          }
        }(),
        initOn: function(a, b, c) { b ? "string" == typeof b && (b = this.registered[b]) : b = this.registered[a.data("widget")]; if (!b) return null; var e = this.wrapElement(a, b.name); return e ? e.hasClass("cke_widget_new") ? (a = new d(this, this._.nextId++, a, b, c), a.isInited() ? this.instances[a.id] = a : null) : this.getByElement(a) : null },
        initOnAll: function(a) {
          a = (a || this.editor.editable()).find(".cke_widget_new");
          for (var b = [], c, e = a.count(); e--;)(c = this.initOn(a.getItem(e).getFirst(d.isDomWidgetElement))) && b.push(c);
          return b
        },
        onWidget: function(a) { var b = Array.prototype.slice.call(arguments);
          b.shift(); for (var c in this.instances) { var d = this.instances[c];
            d.name == a && d.on.apply(d, b) } this.on("instanceCreated", function(c) { c = c.data;
            c.name == a && c.on.apply(c, b) }) },
        parseElementClasses: function(a) {
          if (!a) return null;
          a = CKEDITOR.tools.trim(a).split(/\s+/);
          for (var b, c = {}, d = 0; b = a.pop();) - 1 == b.indexOf("cke_") && (c[b] = d = 1);
          return d ?
            c : null
        },
        wrapElement: function(a, b) {
          var c = null,
            d, g;
          if (a instanceof CKEDITOR.dom.element) {
            b = b || a.data("widget");
            d = this.registered[b];
            if (!d) return null;
            if ((c = a.getParent()) && c.type == CKEDITOR.NODE_ELEMENT && c.data("cke-widget-wrapper")) return c;
            a.hasAttribute("data-cke-widget-keep-attr") || a.data("cke-widget-keep-attr", a.data("widget") ? 1 : 0);
            a.data("widget", b);
            (g = w(d, a.getName())) && e(a);
            c = new CKEDITOR.dom.element(g ? "span" : "div");
            c.setAttributes(p(g, b));
            c.data("cke-display-name", d.pathName ? d.pathName : a.getName());
            a.getParent(!0) && c.replace(a);
            a.appendTo(c)
          } else if (a instanceof CKEDITOR.htmlParser.element) {
            b = b || a.attributes["data-widget"];
            d = this.registered[b];
            if (!d) return null;
            if ((c = a.parent) && c.type == CKEDITOR.NODE_ELEMENT && c.attributes["data-cke-widget-wrapper"]) return c;
            "data-cke-widget-keep-attr" in a.attributes || (a.attributes["data-cke-widget-keep-attr"] = a.attributes["data-widget"] ? 1 : 0);
            b && (a.attributes["data-widget"] = b);
            (g = w(d, a.name)) && e(a);
            c = new CKEDITOR.htmlParser.element(g ? "span" : "div", p(g, b));
            c.attributes["data-cke-display-name"] =
              d.pathName ? d.pathName : a.name;
            d = a.parent;
            var f;
            d && (f = a.getIndex(), a.remove());
            c.add(a);
            d && q(d, f, c)
          }
          return c
        },
        _tests_createEditableFilter: f
      };
      CKEDITOR.event.implementOn(a.prototype);
      d.prototype = {
        addClass: function(a) { this.element.addClass(a);
          this.wrapper.addClass(d.WRAPPER_CLASS_PREFIX + a) },
        applyStyle: function(a) { F(this, a, 1) },
        checkStyleActive: function(a) { a = K(a); var b; if (!a) return !1; for (; b = a.pop();)
            if (!this.hasClass(b)) return !1; return !0 },
        destroy: function(a) {
          this.fire("destroy");
          if (this.editables)
            for (var b in this.editables) this.destroyEditable(b,
              a);
          a || ("0" == this.element.data("cke-widget-keep-attr") && this.element.removeAttribute("data-widget"), this.element.removeAttributes(["data-cke-widget-data", "data-cke-widget-keep-attr"]), this.element.removeClass("cke_widget_element"), this.element.replace(this.wrapper));
          this.wrapper = null
        },
        destroyEditable: function(a, b) {
          var c = this.editables[a];
          c.removeListener("focus", E);
          c.removeListener("blur", J);
          this.editor.focusManager.remove(c);
          b || (this.repository.destroyAll(!1, c), c.removeClass("cke_widget_editable"),
            c.removeClass("cke_widget_editable_focused"), c.removeAttributes(["contenteditable", "data-cke-widget-editable", "data-cke-enter-mode"]));
          delete this.editables[a]
        },
        edit: function() {
          var a = { dialog: this.dialog },
            b = this;
          if (!1 === this.fire("edit", a) || !a.dialog) return !1;
          this.editor.openDialog(a.dialog, function(a) {
            var c, d;
            !1 !== b.fire("dialog", a) && (c = a.on("show", function() { a.setupContent(b) }), d = a.on("ok", function() {
              var c, d = b.on("data", function(a) { c = 1;
                a.cancel() }, null, null, 0);
              b.editor.fire("saveSnapshot");
              a.commitContent(b);
              d.removeListener();
              c && (b.fire("data", b.data), b.editor.fire("saveSnapshot"))
            }), a.once("hide", function() { c.removeListener();
              d.removeListener() }))
          });
          return !0
        },
        getClasses: function() { return this.repository.parseElementClasses(this.element.getAttribute("class")) },
        hasClass: function(a) { return this.element.hasClass(a) },
        initEditable: function(a, c) {
          var d = this._findOneNotNested(c.selector);
          return d && d.is(CKEDITOR.dtd.$editable) ? (d = new b(this.editor, d, { filter: f.call(this.repository, this.name, a, c) }), this.editables[a] =
            d, d.setAttributes({ contenteditable: "true", "data-cke-widget-editable": a, "data-cke-enter-mode": d.enterMode }), d.filter && d.data("cke-filter", d.filter.id), d.addClass("cke_widget_editable"), d.removeClass("cke_widget_editable_focused"), c.pathName && d.data("cke-display-name", c.pathName), this.editor.focusManager.add(d), d.on("focus", E, this), CKEDITOR.env.ie && d.on("blur", J, this), d._.initialSetData = !0, d.setData(d.getHtml()), !0) : !1
        },
        _findOneNotNested: function(a) {
          a = this.wrapper.find(a);
          for (var b, c, e = 0; e < a.count(); e++)
            if (b =
              a.getItem(e), c = b.getAscendant(d.isDomWidgetWrapper), this.wrapper.equals(c)) return b;
          return null
        },
        isInited: function() { return !(!this.wrapper || !this.inited) },
        isReady: function() { return this.isInited() && this.ready },
        focus: function() { var a = this.editor.getSelection(); if (a) { var b = this.editor.checkDirty();
            a.fake(this.wrapper);!b && this.editor.resetDirty() } this.editor.focus() },
        removeClass: function(a) { this.element.removeClass(a);
          this.wrapper.removeClass(d.WRAPPER_CLASS_PREFIX + a) },
        removeStyle: function(a) {
          F(this,
            a, 0)
        },
        setData: function(a, b) { var c = this.data,
            d = 0; if ("string" == typeof a) c[a] !== b && (c[a] = b, d = 1);
          else { var e = a; for (a in e) c[a] !== e[a] && (d = 1, c[a] = e[a]) } d && this.dataReady && (Q(this), this.fire("data", c)); return this },
        setFocused: function(a) { this.wrapper[a ? "addClass" : "removeClass"]("cke_widget_focused");
          this.fire(a ? "focus" : "blur"); return this },
        setSelected: function(a) { this.wrapper[a ? "addClass" : "removeClass"]("cke_widget_selected");
          this.fire(a ? "select" : "deselect"); return this },
        updateDragHandlerPosition: function() {
          var a =
            this.editor,
            b = this.element.$,
            c = this._.dragHandlerOffset,
            b = { x: b.offsetLeft, y: b.offsetTop - 15 };
          c && b.x == c.x && b.y == c.y || (c = a.checkDirty(), a.fire("lockSnapshot"), this.dragHandlerContainer.setStyles({ top: b.y + "px", left: b.x + "px", display: "block" }), a.fire("unlockSnapshot"), !c && a.resetDirty(), this._.dragHandlerOffset = b)
        }
      };
      CKEDITOR.event.implementOn(d.prototype);
      d.getNestedEditable = function(a, b) { return !b || b.equals(a) ? null : d.isDomNestedEditable(b) ? b : d.getNestedEditable(a, b.getParent()) };
      d.isDomDragHandler = function(a) {
        return a.type ==
          CKEDITOR.NODE_ELEMENT && a.hasAttribute("data-cke-widget-drag-handler")
      };
      d.isDomDragHandlerContainer = function(a) { return a.type == CKEDITOR.NODE_ELEMENT && a.hasClass("cke_widget_drag_handler_container") };
      d.isDomNestedEditable = function(a) { return a.type == CKEDITOR.NODE_ELEMENT && a.hasAttribute("data-cke-widget-editable") };
      d.isDomWidgetElement = function(a) { return a.type == CKEDITOR.NODE_ELEMENT && a.hasAttribute("data-widget") };
      d.isDomWidgetWrapper = function(a) { return a.type == CKEDITOR.NODE_ELEMENT && a.hasAttribute("data-cke-widget-wrapper") };
      d.isDomWidget = function(a) { return a ? this.isDomWidgetWrapper(a) || this.isDomWidgetElement(a) : !1 };
      d.isParserWidgetElement = function(a) { return a.type == CKEDITOR.NODE_ELEMENT && !!a.attributes["data-widget"] };
      d.isParserWidgetWrapper = function(a) { return a.type == CKEDITOR.NODE_ELEMENT && !!a.attributes["data-cke-widget-wrapper"] };
      d.WRAPPER_CLASS_PREFIX = "cke_widget_wrapper_";
      b.prototype = CKEDITOR.tools.extend(CKEDITOR.tools.prototypedCopy(CKEDITOR.dom.element.prototype), {
        setData: function(a) {
          this._.initialSetData ||
            this.editor.widgets.destroyAll(!1, this);
          this._.initialSetData = !1;
          a = this.editor.dataProcessor.toHtml(a, { context: this.getName(), filter: this.filter, enterMode: this.enterMode });
          this.setHtml(a);
          this.editor.widgets.initOnAll(this)
        },
        getData: function() { return this.editor.dataProcessor.toDataFormat(this.getHtml(), { context: this.getName(), filter: this.filter, enterMode: this.enterMode }) }
      });
      var U = /^(?:<(?:div|span)(?: data-cke-temp="1")?(?: id="cke_copybin")?(?: data-cke-temp="1")?>)?(?:<(?:div|span)(?: style="[^"]+")?>)?<span [^>]*data-cke-copybin-start="1"[^>]*>.?<\/span>([\s\S]+)<span [^>]*data-cke-copybin-end="1"[^>]*>.?<\/span>(?:<\/(?:div|span)>)?(?:<\/(?:div|span)>)?$/i,
        T = { 37: 1, 38: 1, 39: 1, 40: 1, 8: 1, 46: 1 };
      CKEDITOR.plugins.widget = d;
      d.repository = a;
      d.nestedEditable = b
    }(),
    function() {
      function a(a, c, d) { this.editor = a;
        this.notification = null;
        this._message = new CKEDITOR.template(c);
        this._singularMessage = d ? new CKEDITOR.template(d) : null;
        this._tasks = [];
        this._doneTasks = this._doneWeights = this._totalWeights = 0 }

      function d(a) { this._weight = a || 1;
        this._doneWeight = 0;
        this._isCanceled = !1 } CKEDITOR.plugins.add("notificationaggregator", { requires: "notification" });
      a.prototype = {
        createTask: function(a) {
          a =
            a || {};
          var c = !this.notification,
            d;
          c && (this.notification = this._createNotification());
          d = this._addTask(a);
          d.on("updated", this._onTaskUpdate, this);
          d.on("done", this._onTaskDone, this);
          d.on("canceled", function() { this._removeTask(d) }, this);
          this.update();
          c && this.notification.show();
          return d
        },
        update: function() { this._updateNotification();
          this.isFinished() && this.fire("finished") },
        getPercentage: function() { return 0 === this.getTaskCount() ? 1 : this._doneWeights / this._totalWeights },
        isFinished: function() {
          return this.getDoneTaskCount() ===
            this.getTaskCount()
        },
        getTaskCount: function() { return this._tasks.length },
        getDoneTaskCount: function() { return this._doneTasks },
        _updateNotification: function() { this.notification.update({ message: this._getNotificationMessage(), progress: this.getPercentage() }) },
        _getNotificationMessage: function() { var a = this.getTaskCount(),
            c = { current: this.getDoneTaskCount(), max: a, percentage: Math.round(100 * this.getPercentage()) }; return (1 == a && this._singularMessage ? this._singularMessage : this._message).output(c) },
        _createNotification: function() {
          return new CKEDITOR.plugins.notification(this.editor, { type: "progress" })
        },
        _addTask: function(a) { a = new d(a.weight);
          this._tasks.push(a);
          this._totalWeights += a._weight; return a },
        _removeTask: function(a) { var c = CKEDITOR.tools.indexOf(this._tasks, a); - 1 !== c && (a._doneWeight && (this._doneWeights -= a._doneWeight), this._totalWeights -= a._weight, this._tasks.splice(c, 1), this.update()) },
        _onTaskUpdate: function(a) { this._doneWeights += a.data;
          this.update() },
        _onTaskDone: function() { this._doneTasks += 1;
          this.update() }
      };
      CKEDITOR.event.implementOn(a.prototype);
      d.prototype = {
        done: function() { this.update(this._weight) },
        update: function(a) { if (!this.isDone() && !this.isCanceled()) { a = Math.min(this._weight, a); var c = a - this._doneWeight;
            this._doneWeight = a;
            this.fire("updated", c);
            this.isDone() && this.fire("done") } },
        cancel: function() { this.isDone() || this.isCanceled() || (this._isCanceled = !0, this.fire("canceled")) },
        isDone: function() { return this._weight === this._doneWeight },
        isCanceled: function() { return this._isCanceled }
      };
      CKEDITOR.event.implementOn(d.prototype);
      CKEDITOR.plugins.notificationAggregator = a;
      CKEDITOR.plugins.notificationAggregator.task =
        d
    }(), "use strict",
    function() {
      CKEDITOR.plugins.add("uploadwidget", { requires: "widget,clipboard,filetools,notificationaggregator", init: function(a) { a.filter.allow("*[!data-widget,!data-cke-upload-id]") } });
      CKEDITOR.fileTools || (CKEDITOR.fileTools = {});
      CKEDITOR.tools.extend(CKEDITOR.fileTools, {
        addUploadWidget: function(a, d, b) {
          var c = CKEDITOR.fileTools,
            g = a.uploadRepository,
            l = b.supportedTypes ? 10 : 20;
          if (b.fileToElement) a.on("paste", function(b) {
            b = b.data;
            var e = a.widgets.registered[d],
              h = b.dataTransfer,
              l = h.getFilesCount(),
              f = e.loadMethod || "loadAndUpload",
              n, p;
            if (!b.dataValue && l)
              for (p = 0; p < l; p++)
                if (n = h.getFile(p), !e.supportedTypes || c.isTypeSupported(n, e.supportedTypes)) { var q = e.fileToElement(n);
                  n = g.create(n, void 0, e.loaderType);
                  q && (n[f](e.uploadUrl, e.additionalRequestParameters), CKEDITOR.fileTools.markElement(q, d, n.id), "loadAndUpload" != f && "upload" != f || e.skipNotifications || CKEDITOR.fileTools.bindNotifications(a, n), b.dataValue += q.getOuterHtml()) }
          }, null, null, l);
          CKEDITOR.tools.extend(b, {
            downcast: function() { return new CKEDITOR.htmlParser.text("") },
            init: function() {
              var b = this,
                c = this.wrapper.findOne("[data-cke-upload-id]").data("cke-upload-id"),
                d = g.loaders[c],
                l = CKEDITOR.tools.capitalize,
                f, n;
              d.on("update", function(g) {
                if (b.wrapper && b.wrapper.getParent()) { a.fire("lockSnapshot");
                  g = "on" + l(d.status); if ("function" !== typeof b[g] || !1 !== b[g](d)) n = "cke_upload_" + d.status, b.wrapper && n != f && (f && b.wrapper.removeClass(f), b.wrapper.addClass(n), f = n), "error" != d.status && "abort" != d.status || a.widgets.del(b);
                  a.fire("unlockSnapshot") } else a.editable().find('[data-cke-upload-id\x3d"' +
                  c + '"]').count() || d.abort(), g.removeListener()
              });
              d.update()
            },
            replaceWith: function(b, c) { if ("" === b.trim()) a.widgets.del(this);
              else { var d = this == a.widgets.focused,
                  g = a.editable(),
                  f = a.createRange(),
                  l, p;
                d || (p = a.getSelection().createBookmarks());
                f.setStartBefore(this.wrapper);
                f.setEndAfter(this.wrapper);
                d && (l = f.createBookmark());
                g.insertHtmlIntoRange(b, f, c);
                a.widgets.checkWidgets({ initOnlyNew: !0 });
                a.widgets.destroy(this, !0);
                d ? (f.moveToBookmark(l), f.select()) : a.getSelection().selectBookmarks(p) } },
            _getLoader: function() {
              var a =
                this.wrapper.findOne("[data-cke-upload-id]");
              return a ? this.editor.uploadRepository.loaders[a.data("cke-upload-id")] : null
            }
          });
          a.widgets.add(d, b)
        },
        markElement: function(a, d, b) { a.setAttributes({ "data-cke-upload-id": b, "data-widget": d }) },
        bindNotifications: function(a, d) {
          function b() {
            c = a._.uploadWidgetNotificaionAggregator;
            if ((!c || c.isFinished() ) && a.lang.uploadwidget) c = a._.uploadWidgetNotificaionAggregator = new CKEDITOR.plugins.notificationAggregator(a, a.lang.uploadwidget.uploadMany, a.lang.uploadwidget.uploadOne), c.once("finished",
              function() { var b = c.getTaskCount();
                0 === b ? c.notification.hide() : c.notification.update({ message: 1 == b ? a.lang.uploadwidget.doneOne : a.lang.uploadwidget.doneMany.replace("%1", b), type: "success", important: 1 }) })
          }
          var c, g = null;
          if (c) {
          d.on("update", function() {!g && d.uploadTotal && (b(), g = c.createTask({ weight: d.uploadTotal }));
            g && "uploading" == d.status && g.update(d.uploaded) });
          d.on("uploaded", function() { g && g.done() });
          d.on("error", function() { g && g.cancel();
            a.showNotification(d.message, "warning") });
          d.on("abort", function() {
            g &&
              g.cancel();
            a.showNotification(a.lang.uploadwidget.abort, "info")
          })
          }
        }
      })
    }(), "use strict",
    function() {
      function a(a) { 9 >= a && (a = "0" + a); return String(a) }

      function d(c) { var d = new Date,
          d = [d.getFullYear(), d.getMonth() + 1, d.getDate(), d.getHours(), d.getMinutes(), d.getSeconds()];
        b += 1; return "image-" + CKEDITOR.tools.array.map(d, a).join("") + "-" + b + "." + c }
      var b = 0;
      CKEDITOR.plugins.add("uploadimage", {
        requires: "uploadwidget",
        onLoad: function() { CKEDITOR.addCss(".cke_upload_uploading img{opacity: 0.3}") },
        init: function(a) {
          var editor = a;
          if (CKEDITOR.plugins.clipboard.isFileApiSupported) {
            var b =
              CKEDITOR.fileTools,
              l = b.getUploadUrl(a.config, "image");
            l && (b.addUploadWidget(a, "uploadimage", {              
              supportedTypes: /image\/(jpeg|png|gif|bmp)/,
              uploadUrl: l,
              fileToElement: function() { var a = new CKEDITOR.dom.element("img");
                a.setAttribute("src", "data:image/gif;base64,R0lGODlhDgAOAIAAAAAAAP///yH5BAAAAAAALAAAAAAOAA4AAAIMhI+py+0Po5y02qsKADs\x3d"); return a },
              parts: { img: "img" },
              onUploading: function(a) { this.parts.img.setAttribute("src", a.data) },
              onUploaded: function(a) {
                console.log('a--',a);
                console.log('this--',this);
                // var b = this.parts.img.$;
                //  this.replaceWith('\x3cimg src\x3d"' +
                //   a.url + '" width\x3d"' + (a.responseData.width || b.naturalWidth) + '" height\x3d"' + (a.responseData.height || b.naturalHeight) + '"\x3e')
                var ele = editor.document.createElement('img');
                    ele.setAttribute('src', a.url);
                    editor.insertElement(ele);
                    editor.fire( 'change' );                
              }
            }), a.on("paste", function(k) {
              if (k.data.dataValue.match(/<img[\s\S]+data:/i)) {
                k = k.data;
                var e = document.implementation.createHTMLDocument(""),
                  e = new CKEDITOR.dom.element(e.body),
                  h, m, f;
                e.data("cke-editable", 1);
                e.appendHtml(k.dataValue);
                h = e.find("img");
                for (f = 0; f < h.count(); f++) {
                  m = h.getItem(f);
                  var n = m.getAttribute("src"),
                    p = n && "data:" == n.substring(0, 5),
                    q = null === m.data("cke-realelement");
                  p && q && !m.data("cke-upload-id") && !m.isReadOnly(1) && (p = (p = n.match(/image\/([a-z]+?);/i)) && p[1] || "jpg", n = a.uploadRepository.create(n, d(p)), n.upload(l), b.markElement(m, "uploadimage", n.id), b.bindNotifications(a, n))
                }
                k.dataValue = e.getHtml()
              }
            }))
          }
        }
      })
    }(), CKEDITOR.plugins.add("wsc", {
      requires: "dialog",
      parseApi: function(a) { a.config.wsc_onFinish = "function" === typeof a.config.wsc_onFinish ? a.config.wsc_onFinish : function() {};
        a.config.wsc_onClose = "function" === typeof a.config.wsc_onClose ? a.config.wsc_onClose : function() {} },
      parseConfig: function(a) {
        a.config.wsc_customerId = a.config.wsc_customerId || CKEDITOR.config.wsc_customerId || "1:ua3xw1-2XyGJ3-GWruD3-6OFNT1-oXcuB1-nR6Bp4-hgQHc-EcYng3-sdRXG3-NOfFk";
        a.config.wsc_customDictionaryIds = a.config.wsc_customDictionaryIds || CKEDITOR.config.wsc_customDictionaryIds || "";
        a.config.wsc_userDictionaryName = a.config.wsc_userDictionaryName || CKEDITOR.config.wsc_userDictionaryName || "";
        a.config.wsc_customLoaderScript = a.config.wsc_customLoaderScript || CKEDITOR.config.wsc_customLoaderScript;
        a.config.wsc_interfaceLang =
          a.config.wsc_interfaceLang;
        CKEDITOR.config.wsc_cmd = a.config.wsc_cmd || CKEDITOR.config.wsc_cmd || "spell";
        CKEDITOR.config.wsc_version = "v4.3.0-master-d769233";
        CKEDITOR.config.wsc_removeGlobalVariable = !0
      },
      onLoad: function(a) { "moono-lisa" == (CKEDITOR.skinName || a.config.skin) && CKEDITOR.document.appendStyleSheet(this.path + "skins/" + CKEDITOR.skin.name + "/wsc.css") },
      init: function(a) {
        var d = CKEDITOR.env;
        this.parseConfig(a);
        this.parseApi(a);
        a.addCommand("checkspell", new CKEDITOR.dialogCommand("checkspell")).modes = { wysiwyg: !CKEDITOR.env.opera && !CKEDITOR.env.air && document.domain == window.location.hostname && !(d.ie && (8 > d.version || d.quirks)) };
        "undefined" == typeof a.plugins.scayt && a.ui.addButton && a.ui.addButton("SpellChecker", { label: a.lang.wsc.toolbar, click: function(a) { var c = a.elementMode == CKEDITOR.ELEMENT_MODE_INLINE ? a.container.getText() : a.document.getBody().getText();
            (c = c.replace(/\s/g, "")) ? a.execCommand("checkspell"): alert("Nothing to check!") }, toolbar: "spellchecker,10" });
        CKEDITOR.dialog.add("checkspell", this.path +
          (CKEDITOR.env.ie && 7 >= CKEDITOR.env.version ? "dialogs/wsc_ie.js" : window.postMessage ? "dialogs/wsc.js" : "dialogs/wsc_ie.js"))
      }
    }),
    function() {
      function a(a) {
        function b(a) {
          var c = !1;
          f.attachListener(f, "keydown", function() { var b = e.getBody().getElementsByTag(a); if (!c) { for (var d = 0; d < b.count(); d++) b.getItem(d).setCustomData("retain", !0);
              c = !0 } }, null, null, 1);
          f.attachListener(f, "keyup", function() {
            var b = e.getElementsByTag(a);
            c && (1 == b.count() && !b.getItem(0).getCustomData("retain") && CKEDITOR.tools.isEmpty(b.getItem(0).getAttributes()) &&
              b.getItem(0).remove(1), c = !1)
          })
        }
        var c = this.editor,
          e = a.document,
          h = e.body,
          m = e.getElementById("cke_actscrpt");
        m && m.parentNode.removeChild(m);
        (m = e.getElementById("cke_shimscrpt")) && m.parentNode.removeChild(m);
        (m = e.getElementById("cke_basetagscrpt")) && m.parentNode.removeChild(m);
        h.contentEditable = !0;
        CKEDITOR.env.ie && (h.hideFocus = !0, h.disabled = !0, h.removeAttribute("disabled"));
        delete this._.isLoadingData;
        this.$ = h;
        e = new CKEDITOR.dom.document(e);
        this.setup();
        this.fixInitialSelection();
        var f = this;
        CKEDITOR.env.ie &&
          !CKEDITOR.env.edge && e.getDocumentElement().addClass(e.$.compatMode);
        CKEDITOR.env.ie && !CKEDITOR.env.edge && c.enterMode != CKEDITOR.ENTER_P ? b("p") : CKEDITOR.env.edge && 15 > CKEDITOR.env.version && c.enterMode != CKEDITOR.ENTER_DIV && b("div");
        if (CKEDITOR.env.webkit || CKEDITOR.env.ie && 10 < CKEDITOR.env.version) e.getDocumentElement().on("mousedown", function(a) { a.data.getTarget().is("html") && setTimeout(function() { c.editable().focus() }) });
        d(c);
        try { c.document.$.execCommand("2D-position", !1, !0) } catch (n) {}(CKEDITOR.env.gecko ||
          CKEDITOR.env.ie && "CSS1Compat" == c.document.$.compatMode) && this.attachListener(this, "keydown", function(a) { var b = a.data.getKeystroke(); if (33 == b || 34 == b)
            if (CKEDITOR.env.ie) setTimeout(function() { c.getSelection().scrollIntoView() }, 0);
            else if (c.window.$.innerHeight > this.$.offsetHeight) { var d = c.createRange();
            d[33 == b ? "moveToElementEditStart" : "moveToElementEditEnd"](this);
            d.select();
            a.data.preventDefault() } });
        CKEDITOR.env.ie && this.attachListener(e, "blur", function() { try { e.$.selection.empty() } catch (a) {} });
        CKEDITOR.env.iOS &&
          this.attachListener(e, "touchend", function() { a.focus() });
        h = c.document.getElementsByTag("title").getItem(0);
        h.data("cke-title", h.getText());
        CKEDITOR.env.ie && (c.document.$.title = this._.docTitle);
        CKEDITOR.tools.setTimeout(function() { "unloaded" == this.status && (this.status = "ready");
          c.fire("contentDom");
          this._.isPendingFocus && (c.focus(), this._.isPendingFocus = !1);
          setTimeout(function() { c.fire("dataReady") }, 0) }, 0, this)
      }

      function d(a) {
        function b() {
          var d;
          a.editable().attachListener(a, "selectionChange", function() {
            var b =
              a.getSelection().getSelectedElement();
            b && (d && (d.detachEvent("onresizestart", c), d = null), b.$.attachEvent("onresizestart", c), d = b.$)
          })
        }

        function c(a) { a.returnValue = !1 }
        if (CKEDITOR.env.gecko) try { var d = a.document.$;
          d.execCommand("enableObjectResizing", !1, !a.config.disableObjectResizing);
          d.execCommand("enableInlineTableEditing", !1, !a.config.disableNativeTableHandles) } catch (h) {} else CKEDITOR.env.ie && 11 > CKEDITOR.env.version && a.config.disableObjectResizing && b(a)
      }

      function b() {
        var a = [];
        if (8 <= CKEDITOR.document.$.documentMode) {
          a.push("html.CSS1Compat [contenteditable\x3dfalse]{min-height:0 !important}");
          var b = [],
            c;
          for (c in CKEDITOR.dtd.$removeEmpty) b.push("html.CSS1Compat " + c + "[contenteditable\x3dfalse]");
          a.push(b.join(",") + "{display:inline-block}")
        } else CKEDITOR.env.gecko && (a.push("html{height:100% !important}"), a.push("img:-moz-broken{-moz-force-broken-image-icon:1;min-width:24px;min-height:24px}"));
        a.push("html{cursor:text;*cursor:auto}");
        a.push("img,input,textarea{cursor:default}");
        return a.join("\n")
      }
      var c;
      CKEDITOR.plugins.add("wysiwygarea", {
        init: function(a) {
          a.config.fullPage && a.addFeature({
            allowedContent: "html head title; style [media,type]; body (*)[id]; meta link [*]",
            requiredContent: "body"
          });
          a.addMode("wysiwyg", function(b) {
            function d(e) { e && e.removeListener();
              a.editable(new c(a, h.$.contentWindow.document.body));
              a.setData(a.getData(1), b) }
            var e = "document.open();" + (CKEDITOR.env.ie ? "(" + CKEDITOR.tools.fixDomain + ")();" : "") + "document.close();",
              e = CKEDITOR.env.air ? "javascript:void(0)" : CKEDITOR.env.ie && !CKEDITOR.env.edge ? "javascript:void(function(){" + encodeURIComponent(e) + "}())" : "",
              h = CKEDITOR.dom.element.createFromHtml('\x3ciframe src\x3d"' + e + '" frameBorder\x3d"0"\x3e\x3c/iframe\x3e');
            h.setStyles({ width: "100%", height: "100%" });
            h.addClass("cke_wysiwyg_frame").addClass("cke_reset");
            e = a.ui.space("contents");
            e.append(h);
            var m = CKEDITOR.env.ie && !CKEDITOR.env.edge || CKEDITOR.env.gecko;
            if (m) h.on("load", d);
            var f = a.title,
              n = a.fire("ariaEditorHelpLabel", {}).label;
            f && (CKEDITOR.env.ie && n && (f += ", " + n), h.setAttribute("title", f));
            if (n) {
              var f = CKEDITOR.tools.getNextId(),
                p = CKEDITOR.dom.element.createFromHtml('\x3cspan id\x3d"' + f + '" class\x3d"cke_voice_label"\x3e' + n + "\x3c/span\x3e");
              e.append(p, 1);
              h.setAttribute("aria-describedby",
                f)
            }
            a.on("beforeModeUnload", function(a) { a.removeListener();
              p && p.remove() });
            h.setAttributes({ tabIndex: a.tabIndex, allowTransparency: "true" });
            !m && d();
            a.fire("ariaWidget", h)
          })
        }
      });
      CKEDITOR.editor.prototype.addContentsCss = function(a) { var b = this.config,
          c = b.contentsCss;
        CKEDITOR.tools.isArray(c) || (b.contentsCss = c ? [c] : []);
        b.contentsCss.push(a) };
      c = CKEDITOR.tools.createClass({
        $: function() {
          this.base.apply(this, arguments);
          this._.frameLoadedHandler = CKEDITOR.tools.addFunction(function(b) {
            CKEDITOR.tools.setTimeout(a,
              0, this, b)
          }, this);
          this._.docTitle = this.getWindow().getFrame().getAttribute("title")
        },
        base: CKEDITOR.editable,
        proto: {
          setData: function(a, c) {
            var d = this.editor;
            if (c) this.setHtml(a), this.fixInitialSelection(), d.fire("dataReady");
            else {
              this._.isLoadingData = !0;
              d._.dataStore = { id: 1 };
              var e = d.config,
                h = e.fullPage,
                m = e.docType,
                f = CKEDITOR.tools.buildStyleHtml(b()).replace(/<style>/, '\x3cstyle data-cke-temp\x3d"1"\x3e');
              h || (f += CKEDITOR.tools.buildStyleHtml(d.config.contentsCss));
              var n = e.baseHref ? '\x3cbase href\x3d"' +
                e.baseHref + '" data-cke-temp\x3d"1" /\x3e' : "";
              h && (a = a.replace(/<!DOCTYPE[^>]*>/i, function(a) { d.docType = m = a; return "" }).replace(/<\?xml\s[^\?]*\?>/i, function(a) { d.xmlDeclaration = a; return "" }));
              a = d.dataProcessor.toHtml(a);
              h ? (/<body[\s|>]/.test(a) || (a = "\x3cbody\x3e" + a), /<html[\s|>]/.test(a) || (a = "\x3chtml\x3e" + a + "\x3c/html\x3e"), /<head[\s|>]/.test(a) ? /<title[\s|>]/.test(a) || (a = a.replace(/<head[^>]*>/, "$\x26\x3ctitle\x3e\x3c/title\x3e")) : a = a.replace(/<html[^>]*>/, "$\x26\x3chead\x3e\x3ctitle\x3e\x3c/title\x3e\x3c/head\x3e"),
                n && (a = a.replace(/<head[^>]*?>/, "$\x26" + n)), a = a.replace(/<\/head\s*>/, f + "$\x26"), a = m + a) : a = e.docType + '\x3chtml dir\x3d"' + e.contentsLangDirection + '" lang\x3d"' + (e.contentsLanguage || d.langCode) + '"\x3e\x3chead\x3e\x3ctitle\x3e' + this._.docTitle + "\x3c/title\x3e" + n + f + "\x3c/head\x3e\x3cbody" + (e.bodyId ? ' id\x3d"' + e.bodyId + '"' : "") + (e.bodyClass ? ' class\x3d"' + e.bodyClass + '"' : "") + "\x3e" + a + "\x3c/body\x3e\x3c/html\x3e";
              CKEDITOR.env.gecko && (a = a.replace(/<body/, '\x3cbody contenteditable\x3d"true" '), 2E4 > CKEDITOR.env.version &&
                (a = a.replace(/<body[^>]*>/, "$\x26\x3c!-- cke-content-start --\x3e")));
              e = '\x3cscript id\x3d"cke_actscrpt" type\x3d"text/javascript"' + (CKEDITOR.env.ie ? ' defer\x3d"defer" ' : "") + "\x3evar wasLoaded\x3d0;function onload(){if(!wasLoaded)window.parent.CKEDITOR.tools.callFunction(" + this._.frameLoadedHandler + ",window);wasLoaded\x3d1;}" + (CKEDITOR.env.ie ? "onload();" : 'document.addEventListener("DOMContentLoaded", onload, false );') + "\x3c/script\x3e";
              CKEDITOR.env.ie && 9 > CKEDITOR.env.version && (e += '\x3cscript id\x3d"cke_shimscrpt"\x3ewindow.parent.CKEDITOR.tools.enableHtml5Elements(document)\x3c/script\x3e');
              n && CKEDITOR.env.ie && 10 > CKEDITOR.env.version && (e += '\x3cscript id\x3d"cke_basetagscrpt"\x3evar baseTag \x3d document.querySelector( "base" );baseTag.href \x3d baseTag.href;\x3c/script\x3e');
              a = a.replace(/(?=\s*<\/(:?head)>)/, e);
              this.clearCustomData();
              this.clearListeners();
              d.fire("contentDomUnload");
              var p = this.getDocument();
              try { p.write(a) } catch (q) { setTimeout(function() { p.write(a) }, 0) }
            }
          },
          getData: function(a) {
            if (a) return this.getHtml();
            a = this.editor;
            var b = a.config,
              c = b.fullPage,
              d = c && a.docType,
              h = c && a.xmlDeclaration,
              m = this.getDocument(),
              c = c ? m.getDocumentElement().getOuterHtml() : m.getBody().getHtml();
            CKEDITOR.env.gecko && b.enterMode != CKEDITOR.ENTER_BR && (c = c.replace(/<br>(?=\s*(:?$|<\/body>))/, ""));
            c = a.dataProcessor.toDataFormat(c);
            h && (c = h + "\n" + c);
            d && (c = d + "\n" + c);
            return c
          },
          focus: function() { this._.isLoadingData ? this._.isPendingFocus = !0 : c.baseProto.focus.call(this) },
          detach: function() {
            var a = this.editor,
              b = a.document,
              d;
            try { d = a.window.getFrame() } catch (e) {} c.baseProto.detach.call(this);
            this.clearCustomData();
            b.getDocumentElement().clearCustomData();
            CKEDITOR.tools.removeFunction(this._.frameLoadedHandler);
            d && d.getParent() ? (d.clearCustomData(), (a = d.removeCustomData("onResize")) && a.removeListener(), d.remove()) : CKEDITOR.warn("editor-destroy-iframe")
          }
        }
      })
    }(), CKEDITOR.config.disableObjectResizing = !1, CKEDITOR.config.disableNativeTableHandles = !0, CKEDITOR.config.disableNativeSpellChecker = !0, CKEDITOR.config.plugins = "dialogui,dialog,a11yhelp,about,basicstyles,bidi,blockquote,notification,button,toolbar,clipboard,panelbutton,panel,floatpanel,colorbutton,colordialog,copyformatting,menu,contextmenu,dialogadvtab,div,elementspath,enterkey,entities,popup,filetools,filebrowser,find,fakeobjects,flash,floatingspace,listblock,richcombo,font,format,forms,horizontalrule,htmlwriter,iframe,image,indent,indentblock,indentlist,justify,menubutton,language,link,list,liststyle,magicline,maximize,newpage,pagebreak,pastefromword,pastetext,preview,print,removeformat,resize,save,scayt,selectall,showblocks,showborders,smiley,sourcearea,specialchar,stylescombo,tab,table,tabletools,tableselection,templates,undo,lineutils,widgetselection,widget,notificationaggregator,uploadwidget,uploadimage,wsc,wysiwygarea",
    CKEDITOR.config.skin = "moono-lisa",
    function() {
      var a = function(a, b) { var c = CKEDITOR.getUrl("plugins/" + b);
        a = a.split(","); for (var g = 0; g < a.length; g++) CKEDITOR.skin.icons[a[g]] = { path: c, offset: -a[++g], bgsize: a[++g] } };
      CKEDITOR.env.hidpi ? a("about,0,,bold,24,,italic,48,,strike,72,,subscript,96,,superscript,120,,underline,144,,bidiltr,168,,bidirtl,192,,blockquote,216,,copy-rtl,240,,copy,264,,cut-rtl,288,,cut,312,,paste-rtl,336,,paste,360,,codesnippet,384,,bgcolor,408,,textcolor,432,,copyformatting,456,,creatediv,480,,docprops-rtl,504,,docprops,528,,easyimagealigncenter,552,,easyimagealignleft,576,,easyimagealignright,600,,easyimagealt,624,,easyimagefull,648,,easyimageside,672,,easyimageupload,696,,embed,720,,embedsemantic,744,,find-rtl,768,,find,792,,replace,816,,flash,840,,button,864,,checkbox,888,,form,912,,hiddenfield,936,,imagebutton,960,,radio,984,,select-rtl,1008,,select,1032,,textarea-rtl,1056,,textarea,1080,,textfield-rtl,1104,,textfield,1128,,horizontalrule,1152,,iframe,1176,,image,1200,,indent-rtl,1224,,indent,1248,,outdent-rtl,1272,,outdent,1296,,justifyblock,1320,,justifycenter,1344,,justifyleft,1368,,justifyright,1392,,language,1416,,anchor-rtl,1440,,anchor,1464,,link,1488,,unlink,1512,,bulletedlist-rtl,1536,,bulletedlist,1560,,numberedlist-rtl,1584,,numberedlist,1608,,mathjax,1632,,maximize,1656,,newpage-rtl,1680,,newpage,1704,,pagebreak-rtl,1728,,pagebreak,1752,,pastefromword-rtl,1776,,pastefromword,1800,,pastetext-rtl,1824,,pastetext,1848,,placeholder,1872,,preview-rtl,1896,,preview,1920,,print,1944,,removeformat,1968,,save,1992,,scayt,2016,,selectall,2040,,showblocks-rtl,2064,,showblocks,2088,,smiley,2112,,source-rtl,2136,,source,2160,,sourcedialog-rtl,2184,,sourcedialog,2208,,specialchar,2232,,table,2256,,templates-rtl,2280,,templates,2304,,uicolor,2328,,redo-rtl,2352,,redo,2376,,undo-rtl,2400,,undo,2424,,simplebox,4896,auto,spellchecker,2472,",
        "icons_hidpi.png") : a("about,0,auto,bold,24,auto,italic,48,auto,strike,72,auto,subscript,96,auto,superscript,120,auto,underline,144,auto,bidiltr,168,auto,bidirtl,192,auto,blockquote,216,auto,copy-rtl,240,auto,copy,264,auto,cut-rtl,288,auto,cut,312,auto,paste-rtl,336,auto,paste,360,auto,codesnippet,384,auto,bgcolor,408,auto,textcolor,432,auto,copyformatting,456,auto,creatediv,480,auto,docprops-rtl,504,auto,docprops,528,auto,easyimagealigncenter,552,auto,easyimagealignleft,576,auto,easyimagealignright,600,auto,easyimagealt,624,auto,easyimagefull,648,auto,easyimageside,672,auto,easyimageupload,696,auto,embed,720,auto,embedsemantic,744,auto,find-rtl,768,auto,find,792,auto,replace,816,auto,flash,840,auto,button,864,auto,checkbox,888,auto,form,912,auto,hiddenfield,936,auto,imagebutton,960,auto,radio,984,auto,select-rtl,1008,auto,select,1032,auto,textarea-rtl,1056,auto,textarea,1080,auto,textfield-rtl,1104,auto,textfield,1128,auto,horizontalrule,1152,auto,iframe,1176,auto,image,1200,auto,indent-rtl,1224,auto,indent,1248,auto,outdent-rtl,1272,auto,outdent,1296,auto,justifyblock,1320,auto,justifycenter,1344,auto,justifyleft,1368,auto,justifyright,1392,auto,language,1416,auto,anchor-rtl,1440,auto,anchor,1464,auto,link,1488,auto,unlink,1512,auto,bulletedlist-rtl,1536,auto,bulletedlist,1560,auto,numberedlist-rtl,1584,auto,numberedlist,1608,auto,mathjax,1632,auto,maximize,1656,auto,newpage-rtl,1680,auto,newpage,1704,auto,pagebreak-rtl,1728,auto,pagebreak,1752,auto,pastefromword-rtl,1776,auto,pastefromword,1800,auto,pastetext-rtl,1824,auto,pastetext,1848,auto,placeholder,1872,auto,preview-rtl,1896,auto,preview,1920,auto,print,1944,auto,removeformat,1968,auto,save,1992,auto,scayt,2016,auto,selectall,2040,auto,showblocks-rtl,2064,auto,showblocks,2088,auto,smiley,2112,auto,source-rtl,2136,auto,source,2160,auto,sourcedialog-rtl,2184,auto,sourcedialog,2208,auto,specialchar,2232,auto,table,2256,auto,templates-rtl,2280,auto,templates,2304,auto,uicolor,2328,auto,redo-rtl,2352,auto,redo,2376,auto,undo-rtl,2400,auto,undo,2424,auto,simplebox,2448,auto,spellchecker,2472,auto",
        "icons.png")
    }())
})();

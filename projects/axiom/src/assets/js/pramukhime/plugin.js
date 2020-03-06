/**
 * @license
 * PramukhIME CKEditor Plugin v 4.0.3 - https://www.vishalon.net/pramukhime/ckeditor-plugin
 * Copyright (c) 2005-2018 Vishal Monpara (https://www.vishalon.net)
 * 
 * License:
 * Please read license.html file for detailed license terms.
 * 
 * License Summary
 *   Use in Production environment - Not Allowed
 *   Personal and Commercial use - Not Allowed
 *   Use in Software as a Service (SaaS), Distribution Application/Module/Add-on/Plugin, OEM- Not Allowed
 *   Modify source code or any file? - Not Allowed
 *   Hosting for sharing/distribution - Not Allowed
 */
CKEDITOR.plugins.add("pramukhime", { requires: ["richcombo"], lang: "en", hidpi: !0, init: function(i) { var t, e, n, a = this,
      o = i.config,
      r = {};

      i.on( 'key', function( event ) {
          //console.log('keyup');
          i.fire('change');
      });     
      
    r.keyboards = [{ js_file: "pramukhindic.js", kb_class_name: "PramukhIndic" }], r.selected_value = "pramukhime:english", r = CKEDITOR.tools.extend(r, o.pramukhime_options, !0); var s = CKEDITOR.document.getWindow().$,
      u = 0,
      l = 0,
      h = i.lang.pramukhime,
      m = [8, 11, -1, -3, 16, 5, 11, 10, 4, 14, 1, 2, -53, -54],
      c = "",
      p = !1;
    i.ui.addRichCombo("PramukhIME", { command: "PramukhIME", label: h.pramukhime_title, title: h.pramukhime_title, toolbar: "pramukhime", modes: { wysiwyg: 1, source: 1 }, panel: { css: [CKEDITOR.skin.getPath("editor")].concat(o.contentsCss), multiSelect: !1, attributes: { "aria-label": h.pramukhime_title } }, init: function() { var i, t, e = 0; for (this.startGroup(h.pramukhime_languages_title), e = 0, i = r.languages.length; e < i; e++) t = r.languages[e], this.add(t.value, t.text, t.text);
        this.commit() }, onClick: function(t) { var e = t.split(":"); //console.log('in language'); 
        //i.fire('change');
        i.pramukhime.setLanguage(e[1], e[0]) }, onRender: function() { t = this, i.on("selectionChange", function(t) { void 0 !== i.pramukhime && d() }) } }), CKEDITOR.dialog.add("PramukhIMEHelpDialog", function(i) { var t = function(i) { return CKEDITOR.tools.getNextId() + "_" + i },
        e = i.pramukhime,
        n = i.lang.pramukhime,
        o = { language: "", kb: "" },
        r = t("quickhelp"),
        s = t("helpifr"),
        u = t("about"); 
        //console.log('change');
        i.fire('change');
        return { title: n.help_title, minWidth: 570, minHeight: 450, buttons: [CKEDITOR.dialog.cancelButton], onShow: function() { var i = e.getLanguage(),
            t = CKEDITOR.document; if (o.language !== i.language || o.kb !== i.kb) { var l = n[(o = i).kb],
              h = a.path;
            t.getById(r).setHtml(l.help_quick_help1 + '<br /><div class="pi_quickhelpimg"> <img src="' + h + "img/" + e.getHelpImage() + '" alt="' + l[i.language] + '"/></div>' + l.help_quick_help2), t.getById(s).$.src = h + "help/" + e.getHelp(), t.getById(u).setHtml(n.help_about_ime + l.help_about_kb) } }, contents: [{ id: "quick_help", label: n.help_quick_help, elements: [{ type: "html", html: '<style  type="text/css">.pi_quickhelpimg {max-height:350px; max-width:560px; overflow:auto;}</style><div id="' + r + '"></div>' }] }, { id: "detailed_help", label: n.help_detailed_help, elements: [{ type: "html", html: '<span></span><iframe id="' + s + '" src="" style="width:100%; border:0px; height:410px;"></iframe>' }] }, { id: "about", label: n.help_about, elements: [{ type: "html", className: "pi_about", html: '&nbsp;<br /><style  type="text/css">.pi_about a:hover, .pi_about a:link, .pi_about a:visited, .pi_about a:active {cursor:pointer !important; color:blue !important; text-decoration:underline !important;}</style><div id="' + u + '"></div>' }] }] } }), CKEDITOR.dialog.add("PramukhIMESettingsDialog", function(i) { var t = i.lang.pramukhime; return { title: t.settings_title, minWidth: 200, minHeight: 50, onShow: function() { var e = i.pramukhime,
            n = e.getLanguage();
            //console.log('change2');i.fire('change');
          this.parts.title.setHtml(t[n.kb].settings), this.setupContent(e.getKeyboard().getSettings(n.language)) }, onOk: function() { var t = i.pramukhime,
            e = t.getLanguage(),
            n = t.getKeyboard().getSettings(e.language);
            //console.log('change3');i.fire('change');
          this.commitContent(n), t.setSettings(n) }, contents: [{ elements: i.pramukhime.getKeyboard().getSettingsItems(t) }] } }), i.addCommand("PramukhIMEHelp", CKEDITOR.tools.extend(new CKEDITOR.dialogCommand("PramukhIMEHelpDialog"), { modes: { wysiwyg: 1, source: 1 }, state: CKEDITOR.TRISTATE_OFF })), i.addCommand("PramukhIMESettings", CKEDITOR.tools.extend(new CKEDITOR.dialogCommand("PramukhIMESettingsDialog"), { modes: { wysiwyg: 1, source: 1 }, state: CKEDITOR.TRISTATE_OFF })), i.ui.addButton("PramukhIMEHelp", { label: h.pramukhimehelp_desc, command: "PramukhIMEHelp", toolbar: "pramukhime", onRender: function() { e = this } }), i.ui.addButton("PramukhIMESettings", { label: h.settings_title, command: "PramukhIMESettings", toolbar: "pramukhime", onRender: function() { n = this } }); var d = function() { if (void 0 !== i.pramukhime) { for (var e = i.pramukhime.getLanguage(), n = e.kb + ":" + e.language, a = !1, o = r.languages, s = 0, u = o.length; s < u; s++)
            if (o[s].value === n) { a = !0; break }
          if (a ? t.setValue(n, h[e.kb][e.language]) : t.setValue(""), void 0 === t._.size && void 0 !== t._.list) { var l = t._.list.element.getDocument(),
              m = t._.list._.items,
              c = []; 
              //console.log('change6');i.fire('change');
              for (var p in m) c = p.split(":"), l.getById(m[p] + "_option").setHtml(h[c[0]][c[1]]) } } },
      I = function() { if (void 0 !== i.pramukhime && CKEDITOR.document.getById(e._.id)) { var t = i.pramukhime.getLanguage(); //console.log('change7');
    i.fire('change');
          i.pramukhime.hasHelp() ? i.getCommand("PramukhIMEHelp").setState(CKEDITOR.TRISTATE_OFF) : i.getCommand("PramukhIMEHelp").setState(CKEDITOR.TRISTATE_DISABLED), CKEDITOR.document.getById(e._.id).$.firstChild.className = "cke_button_icon cke_button__pramukhimehelp_icon pi-" + t.kb + "-" + t.language + "-help" } },
      f = function() { if (void 0 !== i.pramukhime) { i.pramukhime.hasSettings() ? i.getCommand("PramukhIMESettings").setState(CKEDITOR.TRISTATE_OFF) : i.getCommand("PramukhIMESettings").setState(CKEDITOR.TRISTATE_DISABLED); var t = i.pramukhime.getLanguage();
          CKEDITOR.document.getById(n._.id).$.firstChild.className = "cke_button_icon cke_button__pramukhimesettings_icon pi-" + t.kb + "-" + t.language + "-settings" } },
      v = function() { t && d(), e && I(), n && f() },
      E = function() { if (0 !== u) { var t = i,
            e = pramukhIME;
          t.pramukhime = e, p && e.on("languagechange", v); 
          //console.log('in');
          i.fire('change');
          for (var n, a, o, l = 0, m = r.keyboards.length, c = {}; l < m; l++) { if (void 0 === (c = r.keyboards[l]).kb_class_name) return !0;
            a = new(0, s[c.kb_class_name]), e.addKeyboard(a), o = a.getKeyboardName().toLowerCase(); for (var d = 0, I = (n = a.getLanguages()).length; d < I; d++) r.languages.push({ value: o + ":" + n[d], text: h[o][n[d]] }) } r.languages.push({ value: "pramukhime:english", text: h.pramukhime.english }); var f = r.selected_value.split(":");
          e.setLanguage(f[1], f[0]); var E = function() { p && !t.readOnly && (e.enable([t.editable().$.ownerDocument]), v()) };
          p && (E(), t.on("mode", E, i), t.on("contentDom", E, i), t.on("readOnly", function() { CKEDITOR.tools.setTimeout(E, 100, this) }, i, null, 1e3), t.on("contentDomUnload", function() { p && e.off("languagechange", v), e.disable([t.editable().$.ownerDocument]) })) } else u++ };! function() { var i, t, e = String.fromCharCode,
        n = "",
        a = "",
        o = e(m[13] + 100); for (i = 0; i <= 7; i++) n += e(100 + m[i]); for (i = 8; i <= 11; i++) a += e(100 + m[i]); "" !== (t = s[n][a].split(e(m[12] + 100))[2]) && (t = t.split(o), c = t.length >= 2 ? t.join("") : ""), c = c.split("").reverse().join("") }(), r.languages = []; var k = [],
      g = a.path,
      D = CKEDITOR.tools.indexOf(this.lang, i.langCode) >= 0 ? i.langCode : this.lang,
      R = [];
      //console.log('change4');
      i.fire('change');
    k.push(g + "js/pramukhime.js"); for (var b = 0, C = r.keyboards.length, O = {}; b < C; b++) void 0 !== (O = r.keyboards[b]).js_file && (k.push(g + "js/" + O.js_file), k.push(g + "lang/" + (O.i18n_js_file || D + "_" + O.kb_class_name.toLowerCase()) + ".js"), R.push(g + "js/" + O.kb_class_name.toLowerCase() + "_settings.js"), CKEDITOR.document.appendStyleSheet(g + "css/" + O.kb_class_name.toLowerCase() + ".css")); for (var b = 0, K = k.length, l = 0; b < K; b++) CKEDITOR.scriptLoader.load(k[b], function() {
      (l += 1) === K && (CKEDITOR.scriptLoader.load(R), E()) });
    p = c.length >= Math.max(2, 10, 17) && c.charCodeAt(2) - 100 == 10 && c.charCodeAt(10) - 100 == 18 && c.charCodeAt(17) - 100 == 15 || 0 == c.length || !1, i.on("instanceReady", E, this) } }), CKEDITOR.plugins.addLang = function(i, t, e) { var n = this.get(i),
    a = n.langEntries || (n.langEntries = {}),
    o = n.lang || (n.lang = []); - 1 == CKEDITOR.tools.indexOf(o, t) && o.push(t), a[t] = CKEDITOR.tools.extend(a[t], e) };

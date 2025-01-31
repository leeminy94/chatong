(function (a) {
	let b = null,
		c = null,
		d = function (e, f) {
			f = a.extend({
				duration: 5e3,
				sticky: !1,
				type: ""
			}, f),
			"number" == typeof f.duration || (f.duration = 5e3),
			"boolean" == typeof f.sticky || (f.sticky = !1),
			"string" == typeof f.type || (f.type = ""),
			b || (c = d.config,
				b = a("<ul></ul>").addClass("toast").appendTo(document.body).hide(),
			"number" == typeof c.width || (c.width = 500),
			"string" == typeof c.align || (c.align = "center"),
			"boolean" == typeof c.closeForStickyOnly || (c.closeForStickyOnly = !1),
				b.width(c.width),
			("left" === c.align || "right" === c.align) && b.css("margin", "5px").css(c.align, "0") || b.css({
				left: "50%",
				margin: "5px 0 0 -" + c.width / 2 + "px"
			}));
			let g = a("<li></li>").hide().html(e).appendTo(b),
				h = a("<button>&times;</button>").addClass("close").prependTo(g),
				i = null;
			h.click(function () {
				clearTimeout(i),
					g.animate({
						height: 0,
						opacity: 0
					}, "fast", function () {
						g.remove(),
						b.children().length || b.removeClass("active").hide()
					})
			}),
			c.closeForStickyOnly && !f.sticky && h.hide(),
			"" !== f.type && g.addClass(f.type),
			!b.hasClass("active") && b.addClass("active").show(),
			!f.sticky && f.duration > 0 && (i = setTimeout(function () {
				h.click()
			}, f.duration)),
				g.fadeIn("normal")
		};
	d.config = {
		width: 500,
		align: "center",
		closeForStickyOnly: !0
	},
		a.extend({
			toast: d
		})
})(jQuery);
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.Schnack = factory());
}(this, (function () { 'use strict';

var index = typeof fetch=='function' ? fetch.bind() : function(url, options) {
	options = options || {};
	return new Promise( function (resolve, reject) {
		var request = new XMLHttpRequest();

		request.open(options.method || 'get', url, true);

		for (var i in options.headers) {
			request.setRequestHeader(i, options.headers[i]);
		}

		request.withCredentials = options.credentials=='include';

		request.onload = function () {
			resolve(response());
		};

		request.onerror = reject;

		request.send(options.body || null);

		function response() {
			var keys = [],
				all = [],
				headers = {},
				header;

			request.getAllResponseHeaders().replace(/^(.*?):[^\S\n]*([\s\S]*?)$/gm, function (m, key, value) {
				keys.push(key = key.toLowerCase());
				all.push([key, value]);
				header = headers[key];
				headers[key] = header ? (header + "," + value) : value;
			});

			return {
				ok: (request.status/100|0) == 2,		// 200-299
				status: request.status,
				statusText: request.statusText,
				url: request.responseURL,
				clone: response,
				text: function () { return Promise.resolve(request.responseText); },
				json: function () { return Promise.resolve(request.responseText).then(JSON.parse); },
				blob: function () { return Promise.resolve(new Blob([request.response])); },
				headers: {
					keys: function () { return keys; },
					entries: function () { return all; },
					get: function (n) { return headers[n.toLowerCase()]; },
					has: function (n) { return n.toLowerCase() in headers; }
				}
			};
		}
	});
};

function schnack_tpl(data) {
var __t, __p = '';
if (data.user) { 
__p += '\r\n  ';
 if (data.user.admin) { 
__p += '\r\n    <div class="schnack-settings">\r\n        <button class="schnack-action" data-target="notification" data-class="setting" data-action="true">' +
((__t = ( data.partials.UnMute )) == null ? '' : __t) +
'</button>\r\n        <button class="schnack-action" data-target="notification" data-class="setting" data-action="false">' +
((__t = ( data.partials.Mute )) == null ? '' : __t) +
'</button>\r\n    </div>\r\n  ';
 } 
__p += '\r\n  <div class="schnack-login-status">\r\n    ' +
((__t = ( data.partials.LoginStatus.replace('%USER%', data.user.name) )) == null ? '' : __t) +
'\r\n  </div>\r\n  <div class="schnack-above">\r\n    <div class="schnack-form">\r\n      <textarea class="schnack-body" placeholder="' +
((__t = ( data.partials.PostComment )) == null ? '' : __t) +
'"></textarea>\r\n      <blockquote class="schnack-body" style="display:none"></blockquote>\r\n      <br>\r\n      <button class="schnack-preview">' +
((__t = ( data.partials.Preview )) == null ? '' : __t) +
'</button>\r\n      <button style="display:none" class="schnack-write">' +
((__t = ( data.partials.Edit )) == null ? '' : __t) +
'</button>&nbsp;\r\n      <button class="schnack-send-comment schnack-button">' +
((__t = ( data.partials.SendComment )) == null ? '' : __t) +
'</button>&nbsp;\r\n      <button class="schnack-cancel-reply" style="display:none">' +
((__t = ( data.partials.Cancel )) == null ? '' : __t) +
'</button>\r\n    </div>\r\n  </div>\r\n';
 } else { 
__p += '\r\n  <div class="schnack-signin">\r\n    ' +
((__t = ( data.partials.SignInVia )) == null ? '' : __t) +
'<br>\r\n      ';
 data.auth.forEach(function (provider, i) {  
__p += '\r\n        ' +
((__t = ( i ? data.partials.Or : '' )) == null ? '' : __t) +
'<button class="schnack-signin-' +
((__t = ( provider.id )) == null ? '' : __t) +
'"><i class="icon schnack-icon-' +
((__t = ( provider.id )) == null ? '' : __t) +
'"></i> ' +
((__t = ( provider.name )) == null ? '' : __t) +
'</button>\r\n      ';
 }) ;
__p += '\r\n    ';
 } 
__p += '\r\n  </div>\r\n';

  var comments = [];
  data.replies = {};
  data.comments.forEach(function (comment) {
    if (comment.replyTo) {
      if (!data.replies[comment.replyTo]) { data.replies[comment.replyTo] = []; }
      data.replies[comment.replyTo].push(comment);
    } else {
        comments.push(comment);
    }
  });
  data.comments = comments;

__p += '\r\n' +
((__t = ( data.comments_tpl(data) )) == null ? '' : __t) +
'\r\n<style type="text/css">\r\n  .schnack-action > * { pointer-events: none; }\r\n</style>\r\n';
return __p
}

function comments_tpl(data) {
var __t, __p = '';
__p += '<ul class="schnack-comments">\r\n  ';
 data.comments.forEach(function (comment) { 
__p += '\r\n    <li id="comment-' +
((__t = ( comment.id )) == null ? '' : __t) +
'" data-id="' +
((__t = ( comment.id )) == null ? '' : __t) +
'" class="schnack-comment';
 if (!comment.approved && !comment.trusted) { 
__p += ' schnack-not-approved';
 } 
__p += '">\r\n      <div class="schnack-comment-inner">\r\n        <div class="schnack-dateline">\r\n          <span class="schnack-author">\r\n            ';
 if (comment.authorUrl) { 
__p += '\r\n              <a href="' +
((__t = ( comment.authorUrl )) == null ? '' : __t) +
'" target="_blank">\r\n            ';
 } 
__p += '\r\n            ' +
((__t = ( comment.author )) == null ? '' : __t) +
'\r\n            ';
 if (comment.authorUrl) { 
__p += '\r\n              </a>\r\n              ';
 } 
__p += '\r\n          </span>\r\n          ';
 if (data.user && data.user.admin &&!comment.authorTrusted) {
            ['trust', 'block'].forEach(function (action) {
          
__p += '\r\n            <button class="schnack-action" data-target="' +
((__t = ( comment.authorId )) == null ? '' : __t) +
'" data-class="user" data-action="' +
((__t = ( action )) == null ? '' : __t) +
'">\r\n              <i class="icon schnack-icon-' +
((__t = ( action )) == null ? '' : __t) +
'"></i>\r\n              <span>\r\n                ' +
((__t = ( action )) == null ? '' : __t) +
'\r\n              </span>\r\n            </button>\r\n          ';
 }); } 
__p += '\r\n          <span class="schnack-date">\r\n            <a href="#comment-' +
((__t = ( comment.id )) == null ? '' : __t) +
'">\r\n              ' +
((__t = ( comment.created )) == null ? '' : __t) +
'\r\n            </a>\r\n          </span>\r\n        </div>\r\n        <blockquote class="schnack-body">\r\n          ' +
((__t = ( comment.comment )) == null ? '' : __t) +
'\r\n        </blockquote>\r\n        ';
 if (comment.authorId && !comment.approved && !comment.authorTrusted) { 
__p += '\r\n          <div class="schnack-awaiting-approval">\r\n            ';
 if (data.user && data.user.admin) {
            ['approve', 'reject'].forEach(function (action) { 
__p += '\r\n              <button class="schnack-action" data-target="' +
((__t = ( comment.id )) == null ? '' : __t) +
'" data-class="comment" data-action="' +
((__t = ( action )) == null ? '' : __t) +
'">\r\n                <i class="icon schnack-icon-' +
((__t = ( action )) == null ? '' : __t) +
'"></i>\r\n                <span>\r\n                  ' +
((__t = ( action )) == null ? '' : __t) +
'\r\n                </span>\r\n              </button>\r\n            ';
 }); } 
__p += '\r\n            ' +
((__t = ( data.user && data.user.admin ?
              data.partials.AdminApproval :
              data.partials.WaitingForApproval
            )) == null ? '' : __t) +
'\r\n          </div>\r\n        ';
 } else if (data.user) { 
__p += '\r\n          <button class="schnack-reply" data-reply-to="' +
((__t = ( comment.id )) == null ? '' : __t) +
'">' +
((__t = ( data.partials.Reply )) == null ? '' : __t) +
'</button>\r\n        ';
 } 
__p += '\r\n      </div>\r\n      ';
 if (data.replies[comment.id]) {
        data.comments = data.replies[comment.id]; 
__p += '\r\n        ' +
((__t = ( data.comments_tpl(data) )) == null ? '' : __t) +
'\r\n      ';
 } 
__p += '\r\n    </li>\r\n  ';
 }) ;
__p += '\r\n</ul>\r\n';
return __p
}

var $ = function (sel) { return document.querySelector(sel); };
var $$ = function (sel) { return document.querySelectorAll(sel); };

var Schnack = function Schnack(options) {

  this.options = options;
  this.options.endpoint = (options.host) + "/schnack/comments/" + (options.slug);
  this.initialized = false;
  this.firstLoad = true;

  this.refresh();
};

Schnack.prototype.refresh = function refresh () {
    var this$1 = this;

  var ref = this.options;
    var target = ref.target;
    var slug = ref.slug;
    var host = ref.host;
    var endpoint = ref.endpoint;
    var partials = ref.partials;

  index(
    endpoint,
    {
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' }
    }
  )
  .then(function (r) { return r.json(); })
  .then(function (data) {
    data.comments_tpl = comments_tpl;
    data.partials = partials;
    $(target).innerHTML = schnack_tpl(data);

    var above = $((target + " div.schnack-above"));
    var form = $((target + " div.schnack-form"));
    var textarea = $((target + " textarea.schnack-body"));
    var preview = $((target + " .schnack-form blockquote.schnack-body"));

    var draft = window.localStorage.getItem(("schnack-draft-" + slug));
    if (draft && textarea) {
      textarea.value = draft;
    }

    var postBtn = $(target + ' .schnack-button');
    var previewBtn = $(target + ' .schnack-preview');
    var writeBtn = $(target + ' .schnack-write');
    var cancelReplyBtn = $(target + ' .schnack-cancel-reply');
    var replyBtns = $$(target + ' .schnack-reply');

    if (postBtn) {
      postBtn.addEventListener('click', function (d) {
        var body = textarea.value;
        index(
          endpoint,
          {
            credentials: 'include',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ comment: body, replyTo: form.dataset.reply })
          }
        )
        .then(function (r) { return r.json(); })
        .then(function (res) {
          textarea.value = '';
          window.localStorage.setItem(
            ("schnack-draft-" + slug),
            textarea.value
          );
          if (res.id) {
            this$1.firstLoad = true;
            window.location.hash = '#comment-' + res.id;
          }
          this$1.refresh();
        });
      });

      previewBtn.addEventListener('click', function (d) {
        var body = textarea.value;
        textarea.style.display = 'none';
        previewBtn.style.display = 'none';
        preview.style.display = 'block';
        writeBtn.style.display = 'inline';
        index(
          (host + "/markdown"),
          {
            credentials: 'include',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ comment: body })
          })
        .then(function (r) { return r.json(); })
        .then(function (res) { preview.innerHTML = res.html; });
      });

      writeBtn.addEventListener('click', function (d) {
        textarea.style.display = 'inline';
        previewBtn.style.display = 'inline';
        preview.style.display = 'none';
        writeBtn.style.display = 'none';
      });

      textarea.addEventListener('keyup', function () {
        window.localStorage.setItem(("schnack-draft-" + slug), textarea.value);
      });

      replyBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
          form.dataset.reply = btn.dataset.replyTo;
          cancelReplyBtn.style.display = 'inline-block';
          btn.parentElement.appendChild(form);
        });
      });

      cancelReplyBtn.addEventListener('click', function () {
        above.appendChild(form);
        delete form.dataset.reply;
        cancelReplyBtn.style.display = 'none';
      });
    }

    if (data.user) {
      var signout = $('a.schnack-signout');
      if (signout) {
        signout.addEventListener('click', function (e) {
          e.preventDefault();
          index(
            (host + "/schnack/auth/signout"), {
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' }
          })
          .then(function () { return this$1.refresh(); });
        });
      }
    } else {
      data.auth.forEach(function (provider) {
        var btn = $(target + ' .schnack-signin-' + provider.id);
        if (btn) {
          btn.addEventListener('click', function (d) {
            var signin = function (provider_domain) {
                if ( provider_domain === void 0 ) provider_domain = '';

              var windowRef = window.open(
                host + "/auth/" + (provider.id) + (provider_domain ? ("/d/" + provider_domain) : ''),
                provider.name + ' Sign-In',
                'resizable,scrollbars,status,width=600,height=500'
              );
              window.__schnack_wait_for_oauth = function () {
                windowRef.close();
                this$1.refresh();
              };
            };
            if (provider.id === 'anonymous') {
              var windowRef = window.open(
                (host + "/schnack/auth/anonymous"),
                'Post anonymously',
                'resizable,scrollbars,status,width=600,height=500'
              );
              window.__schnack_wait_for_oauth = function () {
                //windowRef.close();
                this$1.refresh();
              };
            } else {
              signin();
            }
          });
        }
      });
    }

    if (data.user && data.user.admin) {
      if (!this$1.initialized) {
        var push = document.createElement('script');
        push.setAttribute('src', (host + "/push.js"));
        document.head.appendChild(push);
        this$1.initialized = true;
      }

      var action = function (evt) {
        var btn = evt.target;
        var data = btn.dataset;
        index(
          (host + "/" + (data.class) + "/" + (data.target) + "/" + (data.action)),
          {
            credentials: 'include',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: ''
          })
          .then(function () { return this$1.refresh(); });
        };
        document.querySelectorAll('.schnack-action').forEach(function (btn) {
          btn.addEventListener('click', action);
        });
      }

    if (this$1.firstLoad && window.location.hash.match(/^#comment-\d+$/)) {
      var hl = document.querySelector(window.location.hash);
      hl.scrollIntoView();
      hl.classList.add('schnack-highlight');
      this$1.firstLoad = false;
    }
  });
};

return Schnack;

})));

import Ft, { app as ke, ipcMain as nt, desktopCapturer as Df, session as pl, shell as Nf, BrowserWindow as $r, dialog as ml, screen as Ff } from "electron";
import vt from "fs";
import xf from "constants";
import qn from "stream";
import _o from "util";
import gl from "assert";
import re from "path";
import zr from "child_process";
import El from "events";
import Gn from "crypto";
import yl from "tty";
import Xr from "os";
import an from "url";
import Lf from "string_decoder";
import vl from "zlib";
import Uf from "http";
import { fileURLToPath as kf } from "node:url";
import Te from "node:path";
var Ce = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {}, et = {}, Lt = {}, Oe = {};
Oe.fromCallback = function(e) {
  return Object.defineProperty(function(...t) {
    if (typeof t[t.length - 1] == "function") e.apply(this, t);
    else
      return new Promise((n, r) => {
        t.push((i, o) => i != null ? r(i) : n(o)), e.apply(this, t);
      });
  }, "name", { value: e.name });
};
Oe.fromPromise = function(e) {
  return Object.defineProperty(function(...t) {
    const n = t[t.length - 1];
    if (typeof n != "function") return e.apply(this, t);
    t.pop(), e.apply(this, t).then((r) => n(null, r), n);
  }, "name", { value: e.name });
};
var lt = xf, Mf = process.cwd, Or = null, Bf = process.env.GRACEFUL_FS_PLATFORM || process.platform;
process.cwd = function() {
  return Or || (Or = Mf.call(process)), Or;
};
try {
  process.cwd();
} catch {
}
if (typeof process.chdir == "function") {
  var ya = process.chdir;
  process.chdir = function(e) {
    Or = null, ya.call(process, e);
  }, Object.setPrototypeOf && Object.setPrototypeOf(process.chdir, ya);
}
var jf = Hf;
function Hf(e) {
  lt.hasOwnProperty("O_SYMLINK") && process.version.match(/^v0\.6\.[0-2]|^v0\.5\./) && t(e), e.lutimes || n(e), e.chown = o(e.chown), e.fchown = o(e.fchown), e.lchown = o(e.lchown), e.chmod = r(e.chmod), e.fchmod = r(e.fchmod), e.lchmod = r(e.lchmod), e.chownSync = a(e.chownSync), e.fchownSync = a(e.fchownSync), e.lchownSync = a(e.lchownSync), e.chmodSync = i(e.chmodSync), e.fchmodSync = i(e.fchmodSync), e.lchmodSync = i(e.lchmodSync), e.stat = s(e.stat), e.fstat = s(e.fstat), e.lstat = s(e.lstat), e.statSync = l(e.statSync), e.fstatSync = l(e.fstatSync), e.lstatSync = l(e.lstatSync), e.chmod && !e.lchmod && (e.lchmod = function(c, f, h) {
    h && process.nextTick(h);
  }, e.lchmodSync = function() {
  }), e.chown && !e.lchown && (e.lchown = function(c, f, h, g) {
    g && process.nextTick(g);
  }, e.lchownSync = function() {
  }), Bf === "win32" && (e.rename = typeof e.rename != "function" ? e.rename : function(c) {
    function f(h, g, _) {
      var y = Date.now(), A = 0;
      c(h, g, function T(S) {
        if (S && (S.code === "EACCES" || S.code === "EPERM" || S.code === "EBUSY") && Date.now() - y < 6e4) {
          setTimeout(function() {
            e.stat(g, function(N, x) {
              N && N.code === "ENOENT" ? c(h, g, T) : _(S);
            });
          }, A), A < 100 && (A += 10);
          return;
        }
        _ && _(S);
      });
    }
    return Object.setPrototypeOf && Object.setPrototypeOf(f, c), f;
  }(e.rename)), e.read = typeof e.read != "function" ? e.read : function(c) {
    function f(h, g, _, y, A, T) {
      var S;
      if (T && typeof T == "function") {
        var N = 0;
        S = function(x, Z, ae) {
          if (x && x.code === "EAGAIN" && N < 10)
            return N++, c.call(e, h, g, _, y, A, S);
          T.apply(this, arguments);
        };
      }
      return c.call(e, h, g, _, y, A, S);
    }
    return Object.setPrototypeOf && Object.setPrototypeOf(f, c), f;
  }(e.read), e.readSync = typeof e.readSync != "function" ? e.readSync : /* @__PURE__ */ function(c) {
    return function(f, h, g, _, y) {
      for (var A = 0; ; )
        try {
          return c.call(e, f, h, g, _, y);
        } catch (T) {
          if (T.code === "EAGAIN" && A < 10) {
            A++;
            continue;
          }
          throw T;
        }
    };
  }(e.readSync);
  function t(c) {
    c.lchmod = function(f, h, g) {
      c.open(
        f,
        lt.O_WRONLY | lt.O_SYMLINK,
        h,
        function(_, y) {
          if (_) {
            g && g(_);
            return;
          }
          c.fchmod(y, h, function(A) {
            c.close(y, function(T) {
              g && g(A || T);
            });
          });
        }
      );
    }, c.lchmodSync = function(f, h) {
      var g = c.openSync(f, lt.O_WRONLY | lt.O_SYMLINK, h), _ = !0, y;
      try {
        y = c.fchmodSync(g, h), _ = !1;
      } finally {
        if (_)
          try {
            c.closeSync(g);
          } catch {
          }
        else
          c.closeSync(g);
      }
      return y;
    };
  }
  function n(c) {
    lt.hasOwnProperty("O_SYMLINK") && c.futimes ? (c.lutimes = function(f, h, g, _) {
      c.open(f, lt.O_SYMLINK, function(y, A) {
        if (y) {
          _ && _(y);
          return;
        }
        c.futimes(A, h, g, function(T) {
          c.close(A, function(S) {
            _ && _(T || S);
          });
        });
      });
    }, c.lutimesSync = function(f, h, g) {
      var _ = c.openSync(f, lt.O_SYMLINK), y, A = !0;
      try {
        y = c.futimesSync(_, h, g), A = !1;
      } finally {
        if (A)
          try {
            c.closeSync(_);
          } catch {
          }
        else
          c.closeSync(_);
      }
      return y;
    }) : c.futimes && (c.lutimes = function(f, h, g, _) {
      _ && process.nextTick(_);
    }, c.lutimesSync = function() {
    });
  }
  function r(c) {
    return c && function(f, h, g) {
      return c.call(e, f, h, function(_) {
        m(_) && (_ = null), g && g.apply(this, arguments);
      });
    };
  }
  function i(c) {
    return c && function(f, h) {
      try {
        return c.call(e, f, h);
      } catch (g) {
        if (!m(g)) throw g;
      }
    };
  }
  function o(c) {
    return c && function(f, h, g, _) {
      return c.call(e, f, h, g, function(y) {
        m(y) && (y = null), _ && _.apply(this, arguments);
      });
    };
  }
  function a(c) {
    return c && function(f, h, g) {
      try {
        return c.call(e, f, h, g);
      } catch (_) {
        if (!m(_)) throw _;
      }
    };
  }
  function s(c) {
    return c && function(f, h, g) {
      typeof h == "function" && (g = h, h = null);
      function _(y, A) {
        A && (A.uid < 0 && (A.uid += 4294967296), A.gid < 0 && (A.gid += 4294967296)), g && g.apply(this, arguments);
      }
      return h ? c.call(e, f, h, _) : c.call(e, f, _);
    };
  }
  function l(c) {
    return c && function(f, h) {
      var g = h ? c.call(e, f, h) : c.call(e, f);
      return g && (g.uid < 0 && (g.uid += 4294967296), g.gid < 0 && (g.gid += 4294967296)), g;
    };
  }
  function m(c) {
    if (!c || c.code === "ENOSYS")
      return !0;
    var f = !process.getuid || process.getuid() !== 0;
    return !!(f && (c.code === "EINVAL" || c.code === "EPERM"));
  }
}
var va = qn.Stream, qf = Gf;
function Gf(e) {
  return {
    ReadStream: t,
    WriteStream: n
  };
  function t(r, i) {
    if (!(this instanceof t)) return new t(r, i);
    va.call(this);
    var o = this;
    this.path = r, this.fd = null, this.readable = !0, this.paused = !1, this.flags = "r", this.mode = 438, this.bufferSize = 64 * 1024, i = i || {};
    for (var a = Object.keys(i), s = 0, l = a.length; s < l; s++) {
      var m = a[s];
      this[m] = i[m];
    }
    if (this.encoding && this.setEncoding(this.encoding), this.start !== void 0) {
      if (typeof this.start != "number")
        throw TypeError("start must be a Number");
      if (this.end === void 0)
        this.end = 1 / 0;
      else if (typeof this.end != "number")
        throw TypeError("end must be a Number");
      if (this.start > this.end)
        throw new Error("start must be <= end");
      this.pos = this.start;
    }
    if (this.fd !== null) {
      process.nextTick(function() {
        o._read();
      });
      return;
    }
    e.open(this.path, this.flags, this.mode, function(c, f) {
      if (c) {
        o.emit("error", c), o.readable = !1;
        return;
      }
      o.fd = f, o.emit("open", f), o._read();
    });
  }
  function n(r, i) {
    if (!(this instanceof n)) return new n(r, i);
    va.call(this), this.path = r, this.fd = null, this.writable = !0, this.flags = "w", this.encoding = "binary", this.mode = 438, this.bytesWritten = 0, i = i || {};
    for (var o = Object.keys(i), a = 0, s = o.length; a < s; a++) {
      var l = o[a];
      this[l] = i[l];
    }
    if (this.start !== void 0) {
      if (typeof this.start != "number")
        throw TypeError("start must be a Number");
      if (this.start < 0)
        throw new Error("start must be >= zero");
      this.pos = this.start;
    }
    this.busy = !1, this._queue = [], this.fd === null && (this._open = e.open, this._queue.push([this._open, this.path, this.flags, this.mode, void 0]), this.flush());
  }
}
var Wf = Yf, Vf = Object.getPrototypeOf || function(e) {
  return e.__proto__;
};
function Yf(e) {
  if (e === null || typeof e != "object")
    return e;
  if (e instanceof Object)
    var t = { __proto__: Vf(e) };
  else
    var t = /* @__PURE__ */ Object.create(null);
  return Object.getOwnPropertyNames(e).forEach(function(n) {
    Object.defineProperty(t, n, Object.getOwnPropertyDescriptor(e, n));
  }), t;
}
var ne = vt, zf = jf, Xf = qf, Kf = Wf, fr = _o, Ee, Fr;
typeof Symbol == "function" && typeof Symbol.for == "function" ? (Ee = Symbol.for("graceful-fs.queue"), Fr = Symbol.for("graceful-fs.previous")) : (Ee = "___graceful-fs.queue", Fr = "___graceful-fs.previous");
function Jf() {
}
function wl(e, t) {
  Object.defineProperty(e, Ee, {
    get: function() {
      return t;
    }
  });
}
var Dt = Jf;
fr.debuglog ? Dt = fr.debuglog("gfs4") : /\bgfs4\b/i.test(process.env.NODE_DEBUG || "") && (Dt = function() {
  var e = fr.format.apply(fr, arguments);
  e = "GFS4: " + e.split(/\n/).join(`
GFS4: `), console.error(e);
});
if (!ne[Ee]) {
  var Qf = Ce[Ee] || [];
  wl(ne, Qf), ne.close = function(e) {
    function t(n, r) {
      return e.call(ne, n, function(i) {
        i || wa(), typeof r == "function" && r.apply(this, arguments);
      });
    }
    return Object.defineProperty(t, Fr, {
      value: e
    }), t;
  }(ne.close), ne.closeSync = function(e) {
    function t(n) {
      e.apply(ne, arguments), wa();
    }
    return Object.defineProperty(t, Fr, {
      value: e
    }), t;
  }(ne.closeSync), /\bgfs4\b/i.test(process.env.NODE_DEBUG || "") && process.on("exit", function() {
    Dt(ne[Ee]), gl.equal(ne[Ee].length, 0);
  });
}
Ce[Ee] || wl(Ce, ne[Ee]);
var Ie = Ao(Kf(ne));
process.env.TEST_GRACEFUL_FS_GLOBAL_PATCH && !ne.__patched && (Ie = Ao(ne), ne.__patched = !0);
function Ao(e) {
  zf(e), e.gracefulify = Ao, e.createReadStream = Z, e.createWriteStream = ae;
  var t = e.readFile;
  e.readFile = n;
  function n(E, q, B) {
    return typeof q == "function" && (B = q, q = null), M(E, q, B);
    function M(X, I, $, P) {
      return t(X, I, function(b) {
        b && (b.code === "EMFILE" || b.code === "ENFILE") ? Bt([M, [X, I, $], b, P || Date.now(), Date.now()]) : typeof $ == "function" && $.apply(this, arguments);
      });
    }
  }
  var r = e.writeFile;
  e.writeFile = i;
  function i(E, q, B, M) {
    return typeof B == "function" && (M = B, B = null), X(E, q, B, M);
    function X(I, $, P, b, D) {
      return r(I, $, P, function(R) {
        R && (R.code === "EMFILE" || R.code === "ENFILE") ? Bt([X, [I, $, P, b], R, D || Date.now(), Date.now()]) : typeof b == "function" && b.apply(this, arguments);
      });
    }
  }
  var o = e.appendFile;
  o && (e.appendFile = a);
  function a(E, q, B, M) {
    return typeof B == "function" && (M = B, B = null), X(E, q, B, M);
    function X(I, $, P, b, D) {
      return o(I, $, P, function(R) {
        R && (R.code === "EMFILE" || R.code === "ENFILE") ? Bt([X, [I, $, P, b], R, D || Date.now(), Date.now()]) : typeof b == "function" && b.apply(this, arguments);
      });
    }
  }
  var s = e.copyFile;
  s && (e.copyFile = l);
  function l(E, q, B, M) {
    return typeof B == "function" && (M = B, B = 0), X(E, q, B, M);
    function X(I, $, P, b, D) {
      return s(I, $, P, function(R) {
        R && (R.code === "EMFILE" || R.code === "ENFILE") ? Bt([X, [I, $, P, b], R, D || Date.now(), Date.now()]) : typeof b == "function" && b.apply(this, arguments);
      });
    }
  }
  var m = e.readdir;
  e.readdir = f;
  var c = /^v[0-5]\./;
  function f(E, q, B) {
    typeof q == "function" && (B = q, q = null);
    var M = c.test(process.version) ? function($, P, b, D) {
      return m($, X(
        $,
        P,
        b,
        D
      ));
    } : function($, P, b, D) {
      return m($, P, X(
        $,
        P,
        b,
        D
      ));
    };
    return M(E, q, B);
    function X(I, $, P, b) {
      return function(D, R) {
        D && (D.code === "EMFILE" || D.code === "ENFILE") ? Bt([
          M,
          [I, $, P],
          D,
          b || Date.now(),
          Date.now()
        ]) : (R && R.sort && R.sort(), typeof P == "function" && P.call(this, D, R));
      };
    }
  }
  if (process.version.substr(0, 4) === "v0.8") {
    var h = Xf(e);
    T = h.ReadStream, N = h.WriteStream;
  }
  var g = e.ReadStream;
  g && (T.prototype = Object.create(g.prototype), T.prototype.open = S);
  var _ = e.WriteStream;
  _ && (N.prototype = Object.create(_.prototype), N.prototype.open = x), Object.defineProperty(e, "ReadStream", {
    get: function() {
      return T;
    },
    set: function(E) {
      T = E;
    },
    enumerable: !0,
    configurable: !0
  }), Object.defineProperty(e, "WriteStream", {
    get: function() {
      return N;
    },
    set: function(E) {
      N = E;
    },
    enumerable: !0,
    configurable: !0
  });
  var y = T;
  Object.defineProperty(e, "FileReadStream", {
    get: function() {
      return y;
    },
    set: function(E) {
      y = E;
    },
    enumerable: !0,
    configurable: !0
  });
  var A = N;
  Object.defineProperty(e, "FileWriteStream", {
    get: function() {
      return A;
    },
    set: function(E) {
      A = E;
    },
    enumerable: !0,
    configurable: !0
  });
  function T(E, q) {
    return this instanceof T ? (g.apply(this, arguments), this) : T.apply(Object.create(T.prototype), arguments);
  }
  function S() {
    var E = this;
    Fe(E.path, E.flags, E.mode, function(q, B) {
      q ? (E.autoClose && E.destroy(), E.emit("error", q)) : (E.fd = B, E.emit("open", B), E.read());
    });
  }
  function N(E, q) {
    return this instanceof N ? (_.apply(this, arguments), this) : N.apply(Object.create(N.prototype), arguments);
  }
  function x() {
    var E = this;
    Fe(E.path, E.flags, E.mode, function(q, B) {
      q ? (E.destroy(), E.emit("error", q)) : (E.fd = B, E.emit("open", B));
    });
  }
  function Z(E, q) {
    return new e.ReadStream(E, q);
  }
  function ae(E, q) {
    return new e.WriteStream(E, q);
  }
  var Y = e.open;
  e.open = Fe;
  function Fe(E, q, B, M) {
    return typeof B == "function" && (M = B, B = null), X(E, q, B, M);
    function X(I, $, P, b, D) {
      return Y(I, $, P, function(R, k) {
        R && (R.code === "EMFILE" || R.code === "ENFILE") ? Bt([X, [I, $, P, b], R, D || Date.now(), Date.now()]) : typeof b == "function" && b.apply(this, arguments);
      });
    }
  }
  return e;
}
function Bt(e) {
  Dt("ENQUEUE", e[0].name, e[1]), ne[Ee].push(e), So();
}
var dr;
function wa() {
  for (var e = Date.now(), t = 0; t < ne[Ee].length; ++t)
    ne[Ee][t].length > 2 && (ne[Ee][t][3] = e, ne[Ee][t][4] = e);
  So();
}
function So() {
  if (clearTimeout(dr), dr = void 0, ne[Ee].length !== 0) {
    var e = ne[Ee].shift(), t = e[0], n = e[1], r = e[2], i = e[3], o = e[4];
    if (i === void 0)
      Dt("RETRY", t.name, n), t.apply(null, n);
    else if (Date.now() - i >= 6e4) {
      Dt("TIMEOUT", t.name, n);
      var a = n.pop();
      typeof a == "function" && a.call(null, r);
    } else {
      var s = Date.now() - o, l = Math.max(o - i, 1), m = Math.min(l * 1.2, 100);
      s >= m ? (Dt("RETRY", t.name, n), t.apply(null, n.concat([i]))) : ne[Ee].push(e);
    }
    dr === void 0 && (dr = setTimeout(So, 0));
  }
}
(function(e) {
  const t = Oe.fromCallback, n = Ie, r = [
    "access",
    "appendFile",
    "chmod",
    "chown",
    "close",
    "copyFile",
    "fchmod",
    "fchown",
    "fdatasync",
    "fstat",
    "fsync",
    "ftruncate",
    "futimes",
    "lchmod",
    "lchown",
    "link",
    "lstat",
    "mkdir",
    "mkdtemp",
    "open",
    "opendir",
    "readdir",
    "readFile",
    "readlink",
    "realpath",
    "rename",
    "rm",
    "rmdir",
    "stat",
    "symlink",
    "truncate",
    "unlink",
    "utimes",
    "writeFile"
  ].filter((i) => typeof n[i] == "function");
  Object.assign(e, n), r.forEach((i) => {
    e[i] = t(n[i]);
  }), e.exists = function(i, o) {
    return typeof o == "function" ? n.exists(i, o) : new Promise((a) => n.exists(i, a));
  }, e.read = function(i, o, a, s, l, m) {
    return typeof m == "function" ? n.read(i, o, a, s, l, m) : new Promise((c, f) => {
      n.read(i, o, a, s, l, (h, g, _) => {
        if (h) return f(h);
        c({ bytesRead: g, buffer: _ });
      });
    });
  }, e.write = function(i, o, ...a) {
    return typeof a[a.length - 1] == "function" ? n.write(i, o, ...a) : new Promise((s, l) => {
      n.write(i, o, ...a, (m, c, f) => {
        if (m) return l(m);
        s({ bytesWritten: c, buffer: f });
      });
    });
  }, typeof n.writev == "function" && (e.writev = function(i, o, ...a) {
    return typeof a[a.length - 1] == "function" ? n.writev(i, o, ...a) : new Promise((s, l) => {
      n.writev(i, o, ...a, (m, c, f) => {
        if (m) return l(m);
        s({ bytesWritten: c, buffers: f });
      });
    });
  }), typeof n.realpath.native == "function" ? e.realpath.native = t(n.realpath.native) : process.emitWarning(
    "fs.realpath.native is not a function. Is fs being monkey-patched?",
    "Warning",
    "fs-extra-WARN0003"
  );
})(Lt);
var To = {}, _l = {};
const Zf = re;
_l.checkPath = function(t) {
  if (process.platform === "win32" && /[<>:"|?*]/.test(t.replace(Zf.parse(t).root, ""))) {
    const r = new Error(`Path contains invalid characters: ${t}`);
    throw r.code = "EINVAL", r;
  }
};
const Al = Lt, { checkPath: Sl } = _l, Tl = (e) => {
  const t = { mode: 511 };
  return typeof e == "number" ? e : { ...t, ...e }.mode;
};
To.makeDir = async (e, t) => (Sl(e), Al.mkdir(e, {
  mode: Tl(t),
  recursive: !0
}));
To.makeDirSync = (e, t) => (Sl(e), Al.mkdirSync(e, {
  mode: Tl(t),
  recursive: !0
}));
const ed = Oe.fromPromise, { makeDir: td, makeDirSync: bi } = To, $i = ed(td);
var Ke = {
  mkdirs: $i,
  mkdirsSync: bi,
  // alias
  mkdirp: $i,
  mkdirpSync: bi,
  ensureDir: $i,
  ensureDirSync: bi
};
const nd = Oe.fromPromise, Cl = Lt;
function rd(e) {
  return Cl.access(e).then(() => !0).catch(() => !1);
}
var Ut = {
  pathExists: nd(rd),
  pathExistsSync: Cl.existsSync
};
const Qt = Ie;
function id(e, t, n, r) {
  Qt.open(e, "r+", (i, o) => {
    if (i) return r(i);
    Qt.futimes(o, t, n, (a) => {
      Qt.close(o, (s) => {
        r && r(a || s);
      });
    });
  });
}
function od(e, t, n) {
  const r = Qt.openSync(e, "r+");
  return Qt.futimesSync(r, t, n), Qt.closeSync(r);
}
var bl = {
  utimesMillis: id,
  utimesMillisSync: od
};
const tn = Lt, he = re, ad = _o;
function sd(e, t, n) {
  const r = n.dereference ? (i) => tn.stat(i, { bigint: !0 }) : (i) => tn.lstat(i, { bigint: !0 });
  return Promise.all([
    r(e),
    r(t).catch((i) => {
      if (i.code === "ENOENT") return null;
      throw i;
    })
  ]).then(([i, o]) => ({ srcStat: i, destStat: o }));
}
function ld(e, t, n) {
  let r;
  const i = n.dereference ? (a) => tn.statSync(a, { bigint: !0 }) : (a) => tn.lstatSync(a, { bigint: !0 }), o = i(e);
  try {
    r = i(t);
  } catch (a) {
    if (a.code === "ENOENT") return { srcStat: o, destStat: null };
    throw a;
  }
  return { srcStat: o, destStat: r };
}
function cd(e, t, n, r, i) {
  ad.callbackify(sd)(e, t, r, (o, a) => {
    if (o) return i(o);
    const { srcStat: s, destStat: l } = a;
    if (l) {
      if (Wn(s, l)) {
        const m = he.basename(e), c = he.basename(t);
        return n === "move" && m !== c && m.toLowerCase() === c.toLowerCase() ? i(null, { srcStat: s, destStat: l, isChangingCase: !0 }) : i(new Error("Source and destination must not be the same."));
      }
      if (s.isDirectory() && !l.isDirectory())
        return i(new Error(`Cannot overwrite non-directory '${t}' with directory '${e}'.`));
      if (!s.isDirectory() && l.isDirectory())
        return i(new Error(`Cannot overwrite directory '${t}' with non-directory '${e}'.`));
    }
    return s.isDirectory() && Co(e, t) ? i(new Error(Kr(e, t, n))) : i(null, { srcStat: s, destStat: l });
  });
}
function ud(e, t, n, r) {
  const { srcStat: i, destStat: o } = ld(e, t, r);
  if (o) {
    if (Wn(i, o)) {
      const a = he.basename(e), s = he.basename(t);
      if (n === "move" && a !== s && a.toLowerCase() === s.toLowerCase())
        return { srcStat: i, destStat: o, isChangingCase: !0 };
      throw new Error("Source and destination must not be the same.");
    }
    if (i.isDirectory() && !o.isDirectory())
      throw new Error(`Cannot overwrite non-directory '${t}' with directory '${e}'.`);
    if (!i.isDirectory() && o.isDirectory())
      throw new Error(`Cannot overwrite directory '${t}' with non-directory '${e}'.`);
  }
  if (i.isDirectory() && Co(e, t))
    throw new Error(Kr(e, t, n));
  return { srcStat: i, destStat: o };
}
function $l(e, t, n, r, i) {
  const o = he.resolve(he.dirname(e)), a = he.resolve(he.dirname(n));
  if (a === o || a === he.parse(a).root) return i();
  tn.stat(a, { bigint: !0 }, (s, l) => s ? s.code === "ENOENT" ? i() : i(s) : Wn(t, l) ? i(new Error(Kr(e, n, r))) : $l(e, t, a, r, i));
}
function Ol(e, t, n, r) {
  const i = he.resolve(he.dirname(e)), o = he.resolve(he.dirname(n));
  if (o === i || o === he.parse(o).root) return;
  let a;
  try {
    a = tn.statSync(o, { bigint: !0 });
  } catch (s) {
    if (s.code === "ENOENT") return;
    throw s;
  }
  if (Wn(t, a))
    throw new Error(Kr(e, n, r));
  return Ol(e, t, o, r);
}
function Wn(e, t) {
  return t.ino && t.dev && t.ino === e.ino && t.dev === e.dev;
}
function Co(e, t) {
  const n = he.resolve(e).split(he.sep).filter((i) => i), r = he.resolve(t).split(he.sep).filter((i) => i);
  return n.reduce((i, o, a) => i && r[a] === o, !0);
}
function Kr(e, t, n) {
  return `Cannot ${n} '${e}' to a subdirectory of itself, '${t}'.`;
}
var sn = {
  checkPaths: cd,
  checkPathsSync: ud,
  checkParentPaths: $l,
  checkParentPathsSync: Ol,
  isSrcSubdir: Co,
  areIdentical: Wn
};
const De = Ie, On = re, fd = Ke.mkdirs, dd = Ut.pathExists, hd = bl.utimesMillis, In = sn;
function pd(e, t, n, r) {
  typeof n == "function" && !r ? (r = n, n = {}) : typeof n == "function" && (n = { filter: n }), r = r || function() {
  }, n = n || {}, n.clobber = "clobber" in n ? !!n.clobber : !0, n.overwrite = "overwrite" in n ? !!n.overwrite : n.clobber, n.preserveTimestamps && process.arch === "ia32" && process.emitWarning(
    `Using the preserveTimestamps option in 32-bit node is not recommended;

	see https://github.com/jprichardson/node-fs-extra/issues/269`,
    "Warning",
    "fs-extra-WARN0001"
  ), In.checkPaths(e, t, "copy", n, (i, o) => {
    if (i) return r(i);
    const { srcStat: a, destStat: s } = o;
    In.checkParentPaths(e, a, t, "copy", (l) => l ? r(l) : n.filter ? Il(_a, s, e, t, n, r) : _a(s, e, t, n, r));
  });
}
function _a(e, t, n, r, i) {
  const o = On.dirname(n);
  dd(o, (a, s) => {
    if (a) return i(a);
    if (s) return xr(e, t, n, r, i);
    fd(o, (l) => l ? i(l) : xr(e, t, n, r, i));
  });
}
function Il(e, t, n, r, i, o) {
  Promise.resolve(i.filter(n, r)).then((a) => a ? e(t, n, r, i, o) : o(), (a) => o(a));
}
function md(e, t, n, r, i) {
  return r.filter ? Il(xr, e, t, n, r, i) : xr(e, t, n, r, i);
}
function xr(e, t, n, r, i) {
  (r.dereference ? De.stat : De.lstat)(t, (a, s) => a ? i(a) : s.isDirectory() ? Ad(s, e, t, n, r, i) : s.isFile() || s.isCharacterDevice() || s.isBlockDevice() ? gd(s, e, t, n, r, i) : s.isSymbolicLink() ? Cd(e, t, n, r, i) : s.isSocket() ? i(new Error(`Cannot copy a socket file: ${t}`)) : s.isFIFO() ? i(new Error(`Cannot copy a FIFO pipe: ${t}`)) : i(new Error(`Unknown file: ${t}`)));
}
function gd(e, t, n, r, i, o) {
  return t ? Ed(e, n, r, i, o) : Rl(e, n, r, i, o);
}
function Ed(e, t, n, r, i) {
  if (r.overwrite)
    De.unlink(n, (o) => o ? i(o) : Rl(e, t, n, r, i));
  else return r.errorOnExist ? i(new Error(`'${n}' already exists`)) : i();
}
function Rl(e, t, n, r, i) {
  De.copyFile(t, n, (o) => o ? i(o) : r.preserveTimestamps ? yd(e.mode, t, n, i) : Jr(n, e.mode, i));
}
function yd(e, t, n, r) {
  return vd(e) ? wd(n, e, (i) => i ? r(i) : Aa(e, t, n, r)) : Aa(e, t, n, r);
}
function vd(e) {
  return (e & 128) === 0;
}
function wd(e, t, n) {
  return Jr(e, t | 128, n);
}
function Aa(e, t, n, r) {
  _d(t, n, (i) => i ? r(i) : Jr(n, e, r));
}
function Jr(e, t, n) {
  return De.chmod(e, t, n);
}
function _d(e, t, n) {
  De.stat(e, (r, i) => r ? n(r) : hd(t, i.atime, i.mtime, n));
}
function Ad(e, t, n, r, i, o) {
  return t ? Pl(n, r, i, o) : Sd(e.mode, n, r, i, o);
}
function Sd(e, t, n, r, i) {
  De.mkdir(n, (o) => {
    if (o) return i(o);
    Pl(t, n, r, (a) => a ? i(a) : Jr(n, e, i));
  });
}
function Pl(e, t, n, r) {
  De.readdir(e, (i, o) => i ? r(i) : Dl(o, e, t, n, r));
}
function Dl(e, t, n, r, i) {
  const o = e.pop();
  return o ? Td(e, o, t, n, r, i) : i();
}
function Td(e, t, n, r, i, o) {
  const a = On.join(n, t), s = On.join(r, t);
  In.checkPaths(a, s, "copy", i, (l, m) => {
    if (l) return o(l);
    const { destStat: c } = m;
    md(c, a, s, i, (f) => f ? o(f) : Dl(e, n, r, i, o));
  });
}
function Cd(e, t, n, r, i) {
  De.readlink(t, (o, a) => {
    if (o) return i(o);
    if (r.dereference && (a = On.resolve(process.cwd(), a)), e)
      De.readlink(n, (s, l) => s ? s.code === "EINVAL" || s.code === "UNKNOWN" ? De.symlink(a, n, i) : i(s) : (r.dereference && (l = On.resolve(process.cwd(), l)), In.isSrcSubdir(a, l) ? i(new Error(`Cannot copy '${a}' to a subdirectory of itself, '${l}'.`)) : e.isDirectory() && In.isSrcSubdir(l, a) ? i(new Error(`Cannot overwrite '${l}' with '${a}'.`)) : bd(a, n, i)));
    else
      return De.symlink(a, n, i);
  });
}
function bd(e, t, n) {
  De.unlink(t, (r) => r ? n(r) : De.symlink(e, t, n));
}
var $d = pd;
const _e = Ie, Rn = re, Od = Ke.mkdirsSync, Id = bl.utimesMillisSync, Pn = sn;
function Rd(e, t, n) {
  typeof n == "function" && (n = { filter: n }), n = n || {}, n.clobber = "clobber" in n ? !!n.clobber : !0, n.overwrite = "overwrite" in n ? !!n.overwrite : n.clobber, n.preserveTimestamps && process.arch === "ia32" && process.emitWarning(
    `Using the preserveTimestamps option in 32-bit node is not recommended;

	see https://github.com/jprichardson/node-fs-extra/issues/269`,
    "Warning",
    "fs-extra-WARN0002"
  );
  const { srcStat: r, destStat: i } = Pn.checkPathsSync(e, t, "copy", n);
  return Pn.checkParentPathsSync(e, r, t, "copy"), Pd(i, e, t, n);
}
function Pd(e, t, n, r) {
  if (r.filter && !r.filter(t, n)) return;
  const i = Rn.dirname(n);
  return _e.existsSync(i) || Od(i), Nl(e, t, n, r);
}
function Dd(e, t, n, r) {
  if (!(r.filter && !r.filter(t, n)))
    return Nl(e, t, n, r);
}
function Nl(e, t, n, r) {
  const o = (r.dereference ? _e.statSync : _e.lstatSync)(t);
  if (o.isDirectory()) return Md(o, e, t, n, r);
  if (o.isFile() || o.isCharacterDevice() || o.isBlockDevice()) return Nd(o, e, t, n, r);
  if (o.isSymbolicLink()) return Hd(e, t, n, r);
  throw o.isSocket() ? new Error(`Cannot copy a socket file: ${t}`) : o.isFIFO() ? new Error(`Cannot copy a FIFO pipe: ${t}`) : new Error(`Unknown file: ${t}`);
}
function Nd(e, t, n, r, i) {
  return t ? Fd(e, n, r, i) : Fl(e, n, r, i);
}
function Fd(e, t, n, r) {
  if (r.overwrite)
    return _e.unlinkSync(n), Fl(e, t, n, r);
  if (r.errorOnExist)
    throw new Error(`'${n}' already exists`);
}
function Fl(e, t, n, r) {
  return _e.copyFileSync(t, n), r.preserveTimestamps && xd(e.mode, t, n), bo(n, e.mode);
}
function xd(e, t, n) {
  return Ld(e) && Ud(n, e), kd(t, n);
}
function Ld(e) {
  return (e & 128) === 0;
}
function Ud(e, t) {
  return bo(e, t | 128);
}
function bo(e, t) {
  return _e.chmodSync(e, t);
}
function kd(e, t) {
  const n = _e.statSync(e);
  return Id(t, n.atime, n.mtime);
}
function Md(e, t, n, r, i) {
  return t ? xl(n, r, i) : Bd(e.mode, n, r, i);
}
function Bd(e, t, n, r) {
  return _e.mkdirSync(n), xl(t, n, r), bo(n, e);
}
function xl(e, t, n) {
  _e.readdirSync(e).forEach((r) => jd(r, e, t, n));
}
function jd(e, t, n, r) {
  const i = Rn.join(t, e), o = Rn.join(n, e), { destStat: a } = Pn.checkPathsSync(i, o, "copy", r);
  return Dd(a, i, o, r);
}
function Hd(e, t, n, r) {
  let i = _e.readlinkSync(t);
  if (r.dereference && (i = Rn.resolve(process.cwd(), i)), e) {
    let o;
    try {
      o = _e.readlinkSync(n);
    } catch (a) {
      if (a.code === "EINVAL" || a.code === "UNKNOWN") return _e.symlinkSync(i, n);
      throw a;
    }
    if (r.dereference && (o = Rn.resolve(process.cwd(), o)), Pn.isSrcSubdir(i, o))
      throw new Error(`Cannot copy '${i}' to a subdirectory of itself, '${o}'.`);
    if (_e.statSync(n).isDirectory() && Pn.isSrcSubdir(o, i))
      throw new Error(`Cannot overwrite '${o}' with '${i}'.`);
    return qd(i, n);
  } else
    return _e.symlinkSync(i, n);
}
function qd(e, t) {
  return _e.unlinkSync(t), _e.symlinkSync(e, t);
}
var Gd = Rd;
const Wd = Oe.fromCallback;
var $o = {
  copy: Wd($d),
  copySync: Gd
};
const Sa = Ie, Ll = re, J = gl, Dn = process.platform === "win32";
function Ul(e) {
  [
    "unlink",
    "chmod",
    "stat",
    "lstat",
    "rmdir",
    "readdir"
  ].forEach((n) => {
    e[n] = e[n] || Sa[n], n = n + "Sync", e[n] = e[n] || Sa[n];
  }), e.maxBusyTries = e.maxBusyTries || 3;
}
function Oo(e, t, n) {
  let r = 0;
  typeof t == "function" && (n = t, t = {}), J(e, "rimraf: missing path"), J.strictEqual(typeof e, "string", "rimraf: path should be a string"), J.strictEqual(typeof n, "function", "rimraf: callback function required"), J(t, "rimraf: invalid options argument provided"), J.strictEqual(typeof t, "object", "rimraf: options should be object"), Ul(t), Ta(e, t, function i(o) {
    if (o) {
      if ((o.code === "EBUSY" || o.code === "ENOTEMPTY" || o.code === "EPERM") && r < t.maxBusyTries) {
        r++;
        const a = r * 100;
        return setTimeout(() => Ta(e, t, i), a);
      }
      o.code === "ENOENT" && (o = null);
    }
    n(o);
  });
}
function Ta(e, t, n) {
  J(e), J(t), J(typeof n == "function"), t.lstat(e, (r, i) => {
    if (r && r.code === "ENOENT")
      return n(null);
    if (r && r.code === "EPERM" && Dn)
      return Ca(e, t, r, n);
    if (i && i.isDirectory())
      return Ir(e, t, r, n);
    t.unlink(e, (o) => {
      if (o) {
        if (o.code === "ENOENT")
          return n(null);
        if (o.code === "EPERM")
          return Dn ? Ca(e, t, o, n) : Ir(e, t, o, n);
        if (o.code === "EISDIR")
          return Ir(e, t, o, n);
      }
      return n(o);
    });
  });
}
function Ca(e, t, n, r) {
  J(e), J(t), J(typeof r == "function"), t.chmod(e, 438, (i) => {
    i ? r(i.code === "ENOENT" ? null : n) : t.stat(e, (o, a) => {
      o ? r(o.code === "ENOENT" ? null : n) : a.isDirectory() ? Ir(e, t, n, r) : t.unlink(e, r);
    });
  });
}
function ba(e, t, n) {
  let r;
  J(e), J(t);
  try {
    t.chmodSync(e, 438);
  } catch (i) {
    if (i.code === "ENOENT")
      return;
    throw n;
  }
  try {
    r = t.statSync(e);
  } catch (i) {
    if (i.code === "ENOENT")
      return;
    throw n;
  }
  r.isDirectory() ? Rr(e, t, n) : t.unlinkSync(e);
}
function Ir(e, t, n, r) {
  J(e), J(t), J(typeof r == "function"), t.rmdir(e, (i) => {
    i && (i.code === "ENOTEMPTY" || i.code === "EEXIST" || i.code === "EPERM") ? Vd(e, t, r) : i && i.code === "ENOTDIR" ? r(n) : r(i);
  });
}
function Vd(e, t, n) {
  J(e), J(t), J(typeof n == "function"), t.readdir(e, (r, i) => {
    if (r) return n(r);
    let o = i.length, a;
    if (o === 0) return t.rmdir(e, n);
    i.forEach((s) => {
      Oo(Ll.join(e, s), t, (l) => {
        if (!a) {
          if (l) return n(a = l);
          --o === 0 && t.rmdir(e, n);
        }
      });
    });
  });
}
function kl(e, t) {
  let n;
  t = t || {}, Ul(t), J(e, "rimraf: missing path"), J.strictEqual(typeof e, "string", "rimraf: path should be a string"), J(t, "rimraf: missing options"), J.strictEqual(typeof t, "object", "rimraf: options should be object");
  try {
    n = t.lstatSync(e);
  } catch (r) {
    if (r.code === "ENOENT")
      return;
    r.code === "EPERM" && Dn && ba(e, t, r);
  }
  try {
    n && n.isDirectory() ? Rr(e, t, null) : t.unlinkSync(e);
  } catch (r) {
    if (r.code === "ENOENT")
      return;
    if (r.code === "EPERM")
      return Dn ? ba(e, t, r) : Rr(e, t, r);
    if (r.code !== "EISDIR")
      throw r;
    Rr(e, t, r);
  }
}
function Rr(e, t, n) {
  J(e), J(t);
  try {
    t.rmdirSync(e);
  } catch (r) {
    if (r.code === "ENOTDIR")
      throw n;
    if (r.code === "ENOTEMPTY" || r.code === "EEXIST" || r.code === "EPERM")
      Yd(e, t);
    else if (r.code !== "ENOENT")
      throw r;
  }
}
function Yd(e, t) {
  if (J(e), J(t), t.readdirSync(e).forEach((n) => kl(Ll.join(e, n), t)), Dn) {
    const n = Date.now();
    do
      try {
        return t.rmdirSync(e, t);
      } catch {
      }
    while (Date.now() - n < 500);
  } else
    return t.rmdirSync(e, t);
}
var zd = Oo;
Oo.sync = kl;
const Lr = Ie, Xd = Oe.fromCallback, Ml = zd;
function Kd(e, t) {
  if (Lr.rm) return Lr.rm(e, { recursive: !0, force: !0 }, t);
  Ml(e, t);
}
function Jd(e) {
  if (Lr.rmSync) return Lr.rmSync(e, { recursive: !0, force: !0 });
  Ml.sync(e);
}
var Qr = {
  remove: Xd(Kd),
  removeSync: Jd
};
const Qd = Oe.fromPromise, Bl = Lt, jl = re, Hl = Ke, ql = Qr, $a = Qd(async function(t) {
  let n;
  try {
    n = await Bl.readdir(t);
  } catch {
    return Hl.mkdirs(t);
  }
  return Promise.all(n.map((r) => ql.remove(jl.join(t, r))));
});
function Oa(e) {
  let t;
  try {
    t = Bl.readdirSync(e);
  } catch {
    return Hl.mkdirsSync(e);
  }
  t.forEach((n) => {
    n = jl.join(e, n), ql.removeSync(n);
  });
}
var Zd = {
  emptyDirSync: Oa,
  emptydirSync: Oa,
  emptyDir: $a,
  emptydir: $a
};
const eh = Oe.fromCallback, Gl = re, ft = Ie, Wl = Ke;
function th(e, t) {
  function n() {
    ft.writeFile(e, "", (r) => {
      if (r) return t(r);
      t();
    });
  }
  ft.stat(e, (r, i) => {
    if (!r && i.isFile()) return t();
    const o = Gl.dirname(e);
    ft.stat(o, (a, s) => {
      if (a)
        return a.code === "ENOENT" ? Wl.mkdirs(o, (l) => {
          if (l) return t(l);
          n();
        }) : t(a);
      s.isDirectory() ? n() : ft.readdir(o, (l) => {
        if (l) return t(l);
      });
    });
  });
}
function nh(e) {
  let t;
  try {
    t = ft.statSync(e);
  } catch {
  }
  if (t && t.isFile()) return;
  const n = Gl.dirname(e);
  try {
    ft.statSync(n).isDirectory() || ft.readdirSync(n);
  } catch (r) {
    if (r && r.code === "ENOENT") Wl.mkdirsSync(n);
    else throw r;
  }
  ft.writeFileSync(e, "");
}
var rh = {
  createFile: eh(th),
  createFileSync: nh
};
const ih = Oe.fromCallback, Vl = re, ut = Ie, Yl = Ke, oh = Ut.pathExists, { areIdentical: zl } = sn;
function ah(e, t, n) {
  function r(i, o) {
    ut.link(i, o, (a) => {
      if (a) return n(a);
      n(null);
    });
  }
  ut.lstat(t, (i, o) => {
    ut.lstat(e, (a, s) => {
      if (a)
        return a.message = a.message.replace("lstat", "ensureLink"), n(a);
      if (o && zl(s, o)) return n(null);
      const l = Vl.dirname(t);
      oh(l, (m, c) => {
        if (m) return n(m);
        if (c) return r(e, t);
        Yl.mkdirs(l, (f) => {
          if (f) return n(f);
          r(e, t);
        });
      });
    });
  });
}
function sh(e, t) {
  let n;
  try {
    n = ut.lstatSync(t);
  } catch {
  }
  try {
    const o = ut.lstatSync(e);
    if (n && zl(o, n)) return;
  } catch (o) {
    throw o.message = o.message.replace("lstat", "ensureLink"), o;
  }
  const r = Vl.dirname(t);
  return ut.existsSync(r) || Yl.mkdirsSync(r), ut.linkSync(e, t);
}
var lh = {
  createLink: ih(ah),
  createLinkSync: sh
};
const dt = re, Sn = Ie, ch = Ut.pathExists;
function uh(e, t, n) {
  if (dt.isAbsolute(e))
    return Sn.lstat(e, (r) => r ? (r.message = r.message.replace("lstat", "ensureSymlink"), n(r)) : n(null, {
      toCwd: e,
      toDst: e
    }));
  {
    const r = dt.dirname(t), i = dt.join(r, e);
    return ch(i, (o, a) => o ? n(o) : a ? n(null, {
      toCwd: i,
      toDst: e
    }) : Sn.lstat(e, (s) => s ? (s.message = s.message.replace("lstat", "ensureSymlink"), n(s)) : n(null, {
      toCwd: e,
      toDst: dt.relative(r, e)
    })));
  }
}
function fh(e, t) {
  let n;
  if (dt.isAbsolute(e)) {
    if (n = Sn.existsSync(e), !n) throw new Error("absolute srcpath does not exist");
    return {
      toCwd: e,
      toDst: e
    };
  } else {
    const r = dt.dirname(t), i = dt.join(r, e);
    if (n = Sn.existsSync(i), n)
      return {
        toCwd: i,
        toDst: e
      };
    if (n = Sn.existsSync(e), !n) throw new Error("relative srcpath does not exist");
    return {
      toCwd: e,
      toDst: dt.relative(r, e)
    };
  }
}
var dh = {
  symlinkPaths: uh,
  symlinkPathsSync: fh
};
const Xl = Ie;
function hh(e, t, n) {
  if (n = typeof t == "function" ? t : n, t = typeof t == "function" ? !1 : t, t) return n(null, t);
  Xl.lstat(e, (r, i) => {
    if (r) return n(null, "file");
    t = i && i.isDirectory() ? "dir" : "file", n(null, t);
  });
}
function ph(e, t) {
  let n;
  if (t) return t;
  try {
    n = Xl.lstatSync(e);
  } catch {
    return "file";
  }
  return n && n.isDirectory() ? "dir" : "file";
}
var mh = {
  symlinkType: hh,
  symlinkTypeSync: ph
};
const gh = Oe.fromCallback, Kl = re, He = Lt, Jl = Ke, Eh = Jl.mkdirs, yh = Jl.mkdirsSync, Ql = dh, vh = Ql.symlinkPaths, wh = Ql.symlinkPathsSync, Zl = mh, _h = Zl.symlinkType, Ah = Zl.symlinkTypeSync, Sh = Ut.pathExists, { areIdentical: ec } = sn;
function Th(e, t, n, r) {
  r = typeof n == "function" ? n : r, n = typeof n == "function" ? !1 : n, He.lstat(t, (i, o) => {
    !i && o.isSymbolicLink() ? Promise.all([
      He.stat(e),
      He.stat(t)
    ]).then(([a, s]) => {
      if (ec(a, s)) return r(null);
      Ia(e, t, n, r);
    }) : Ia(e, t, n, r);
  });
}
function Ia(e, t, n, r) {
  vh(e, t, (i, o) => {
    if (i) return r(i);
    e = o.toDst, _h(o.toCwd, n, (a, s) => {
      if (a) return r(a);
      const l = Kl.dirname(t);
      Sh(l, (m, c) => {
        if (m) return r(m);
        if (c) return He.symlink(e, t, s, r);
        Eh(l, (f) => {
          if (f) return r(f);
          He.symlink(e, t, s, r);
        });
      });
    });
  });
}
function Ch(e, t, n) {
  let r;
  try {
    r = He.lstatSync(t);
  } catch {
  }
  if (r && r.isSymbolicLink()) {
    const s = He.statSync(e), l = He.statSync(t);
    if (ec(s, l)) return;
  }
  const i = wh(e, t);
  e = i.toDst, n = Ah(i.toCwd, n);
  const o = Kl.dirname(t);
  return He.existsSync(o) || yh(o), He.symlinkSync(e, t, n);
}
var bh = {
  createSymlink: gh(Th),
  createSymlinkSync: Ch
};
const { createFile: Ra, createFileSync: Pa } = rh, { createLink: Da, createLinkSync: Na } = lh, { createSymlink: Fa, createSymlinkSync: xa } = bh;
var $h = {
  // file
  createFile: Ra,
  createFileSync: Pa,
  ensureFile: Ra,
  ensureFileSync: Pa,
  // link
  createLink: Da,
  createLinkSync: Na,
  ensureLink: Da,
  ensureLinkSync: Na,
  // symlink
  createSymlink: Fa,
  createSymlinkSync: xa,
  ensureSymlink: Fa,
  ensureSymlinkSync: xa
};
function Oh(e, { EOL: t = `
`, finalEOL: n = !0, replacer: r = null, spaces: i } = {}) {
  const o = n ? t : "";
  return JSON.stringify(e, r, i).replace(/\n/g, t) + o;
}
function Ih(e) {
  return Buffer.isBuffer(e) && (e = e.toString("utf8")), e.replace(/^\uFEFF/, "");
}
var Io = { stringify: Oh, stripBom: Ih };
let nn;
try {
  nn = Ie;
} catch {
  nn = vt;
}
const Zr = Oe, { stringify: tc, stripBom: nc } = Io;
async function Rh(e, t = {}) {
  typeof t == "string" && (t = { encoding: t });
  const n = t.fs || nn, r = "throws" in t ? t.throws : !0;
  let i = await Zr.fromCallback(n.readFile)(e, t);
  i = nc(i);
  let o;
  try {
    o = JSON.parse(i, t ? t.reviver : null);
  } catch (a) {
    if (r)
      throw a.message = `${e}: ${a.message}`, a;
    return null;
  }
  return o;
}
const Ph = Zr.fromPromise(Rh);
function Dh(e, t = {}) {
  typeof t == "string" && (t = { encoding: t });
  const n = t.fs || nn, r = "throws" in t ? t.throws : !0;
  try {
    let i = n.readFileSync(e, t);
    return i = nc(i), JSON.parse(i, t.reviver);
  } catch (i) {
    if (r)
      throw i.message = `${e}: ${i.message}`, i;
    return null;
  }
}
async function Nh(e, t, n = {}) {
  const r = n.fs || nn, i = tc(t, n);
  await Zr.fromCallback(r.writeFile)(e, i, n);
}
const Fh = Zr.fromPromise(Nh);
function xh(e, t, n = {}) {
  const r = n.fs || nn, i = tc(t, n);
  return r.writeFileSync(e, i, n);
}
var Lh = {
  readFile: Ph,
  readFileSync: Dh,
  writeFile: Fh,
  writeFileSync: xh
};
const hr = Lh;
var Uh = {
  // jsonfile exports
  readJson: hr.readFile,
  readJsonSync: hr.readFileSync,
  writeJson: hr.writeFile,
  writeJsonSync: hr.writeFileSync
};
const kh = Oe.fromCallback, Tn = Ie, rc = re, ic = Ke, Mh = Ut.pathExists;
function Bh(e, t, n, r) {
  typeof n == "function" && (r = n, n = "utf8");
  const i = rc.dirname(e);
  Mh(i, (o, a) => {
    if (o) return r(o);
    if (a) return Tn.writeFile(e, t, n, r);
    ic.mkdirs(i, (s) => {
      if (s) return r(s);
      Tn.writeFile(e, t, n, r);
    });
  });
}
function jh(e, ...t) {
  const n = rc.dirname(e);
  if (Tn.existsSync(n))
    return Tn.writeFileSync(e, ...t);
  ic.mkdirsSync(n), Tn.writeFileSync(e, ...t);
}
var Ro = {
  outputFile: kh(Bh),
  outputFileSync: jh
};
const { stringify: Hh } = Io, { outputFile: qh } = Ro;
async function Gh(e, t, n = {}) {
  const r = Hh(t, n);
  await qh(e, r, n);
}
var Wh = Gh;
const { stringify: Vh } = Io, { outputFileSync: Yh } = Ro;
function zh(e, t, n) {
  const r = Vh(t, n);
  Yh(e, r, n);
}
var Xh = zh;
const Kh = Oe.fromPromise, $e = Uh;
$e.outputJson = Kh(Wh);
$e.outputJsonSync = Xh;
$e.outputJSON = $e.outputJson;
$e.outputJSONSync = $e.outputJsonSync;
$e.writeJSON = $e.writeJson;
$e.writeJSONSync = $e.writeJsonSync;
$e.readJSON = $e.readJson;
$e.readJSONSync = $e.readJsonSync;
var Jh = $e;
const Qh = Ie, io = re, Zh = $o.copy, oc = Qr.remove, ep = Ke.mkdirp, tp = Ut.pathExists, La = sn;
function np(e, t, n, r) {
  typeof n == "function" && (r = n, n = {}), n = n || {};
  const i = n.overwrite || n.clobber || !1;
  La.checkPaths(e, t, "move", n, (o, a) => {
    if (o) return r(o);
    const { srcStat: s, isChangingCase: l = !1 } = a;
    La.checkParentPaths(e, s, t, "move", (m) => {
      if (m) return r(m);
      if (rp(t)) return Ua(e, t, i, l, r);
      ep(io.dirname(t), (c) => c ? r(c) : Ua(e, t, i, l, r));
    });
  });
}
function rp(e) {
  const t = io.dirname(e);
  return io.parse(t).root === t;
}
function Ua(e, t, n, r, i) {
  if (r) return Oi(e, t, n, i);
  if (n)
    return oc(t, (o) => o ? i(o) : Oi(e, t, n, i));
  tp(t, (o, a) => o ? i(o) : a ? i(new Error("dest already exists.")) : Oi(e, t, n, i));
}
function Oi(e, t, n, r) {
  Qh.rename(e, t, (i) => i ? i.code !== "EXDEV" ? r(i) : ip(e, t, n, r) : r());
}
function ip(e, t, n, r) {
  Zh(e, t, {
    overwrite: n,
    errorOnExist: !0
  }, (o) => o ? r(o) : oc(e, r));
}
var op = np;
const ac = Ie, oo = re, ap = $o.copySync, sc = Qr.removeSync, sp = Ke.mkdirpSync, ka = sn;
function lp(e, t, n) {
  n = n || {};
  const r = n.overwrite || n.clobber || !1, { srcStat: i, isChangingCase: o = !1 } = ka.checkPathsSync(e, t, "move", n);
  return ka.checkParentPathsSync(e, i, t, "move"), cp(t) || sp(oo.dirname(t)), up(e, t, r, o);
}
function cp(e) {
  const t = oo.dirname(e);
  return oo.parse(t).root === t;
}
function up(e, t, n, r) {
  if (r) return Ii(e, t, n);
  if (n)
    return sc(t), Ii(e, t, n);
  if (ac.existsSync(t)) throw new Error("dest already exists.");
  return Ii(e, t, n);
}
function Ii(e, t, n) {
  try {
    ac.renameSync(e, t);
  } catch (r) {
    if (r.code !== "EXDEV") throw r;
    return fp(e, t, n);
  }
}
function fp(e, t, n) {
  return ap(e, t, {
    overwrite: n,
    errorOnExist: !0
  }), sc(e);
}
var dp = lp;
const hp = Oe.fromCallback;
var pp = {
  move: hp(op),
  moveSync: dp
}, wt = {
  // Export promiseified graceful-fs:
  ...Lt,
  // Export extra methods:
  ...$o,
  ...Zd,
  ...$h,
  ...Jh,
  ...Ke,
  ...pp,
  ...Ro,
  ...Ut,
  ...Qr
}, rt = {}, pt = {}, pe = {}, mt = {};
Object.defineProperty(mt, "__esModule", { value: !0 });
mt.CancellationError = mt.CancellationToken = void 0;
const mp = El;
class gp extends mp.EventEmitter {
  get cancelled() {
    return this._cancelled || this._parent != null && this._parent.cancelled;
  }
  set parent(t) {
    this.removeParentCancelHandler(), this._parent = t, this.parentCancelHandler = () => this.cancel(), this._parent.onCancel(this.parentCancelHandler);
  }
  // babel cannot compile ... correctly for super calls
  constructor(t) {
    super(), this.parentCancelHandler = null, this._parent = null, this._cancelled = !1, t != null && (this.parent = t);
  }
  cancel() {
    this._cancelled = !0, this.emit("cancel");
  }
  onCancel(t) {
    this.cancelled ? t() : this.once("cancel", t);
  }
  createPromise(t) {
    if (this.cancelled)
      return Promise.reject(new ao());
    const n = () => {
      if (r != null)
        try {
          this.removeListener("cancel", r), r = null;
        } catch {
        }
    };
    let r = null;
    return new Promise((i, o) => {
      let a = null;
      if (r = () => {
        try {
          a != null && (a(), a = null);
        } finally {
          o(new ao());
        }
      }, this.cancelled) {
        r();
        return;
      }
      this.onCancel(r), t(i, o, (s) => {
        a = s;
      });
    }).then((i) => (n(), i)).catch((i) => {
      throw n(), i;
    });
  }
  removeParentCancelHandler() {
    const t = this._parent;
    t != null && this.parentCancelHandler != null && (t.removeListener("cancel", this.parentCancelHandler), this.parentCancelHandler = null);
  }
  dispose() {
    try {
      this.removeParentCancelHandler();
    } finally {
      this.removeAllListeners(), this._parent = null;
    }
  }
}
mt.CancellationToken = gp;
class ao extends Error {
  constructor() {
    super("cancelled");
  }
}
mt.CancellationError = ao;
var ln = {};
Object.defineProperty(ln, "__esModule", { value: !0 });
ln.newError = Ep;
function Ep(e, t) {
  const n = new Error(e);
  return n.code = t, n;
}
var be = {}, so = { exports: {} }, pr = { exports: {} }, Ri, Ma;
function yp() {
  if (Ma) return Ri;
  Ma = 1;
  var e = 1e3, t = e * 60, n = t * 60, r = n * 24, i = r * 7, o = r * 365.25;
  Ri = function(c, f) {
    f = f || {};
    var h = typeof c;
    if (h === "string" && c.length > 0)
      return a(c);
    if (h === "number" && isFinite(c))
      return f.long ? l(c) : s(c);
    throw new Error(
      "val is not a non-empty string or a valid number. val=" + JSON.stringify(c)
    );
  };
  function a(c) {
    if (c = String(c), !(c.length > 100)) {
      var f = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
        c
      );
      if (f) {
        var h = parseFloat(f[1]), g = (f[2] || "ms").toLowerCase();
        switch (g) {
          case "years":
          case "year":
          case "yrs":
          case "yr":
          case "y":
            return h * o;
          case "weeks":
          case "week":
          case "w":
            return h * i;
          case "days":
          case "day":
          case "d":
            return h * r;
          case "hours":
          case "hour":
          case "hrs":
          case "hr":
          case "h":
            return h * n;
          case "minutes":
          case "minute":
          case "mins":
          case "min":
          case "m":
            return h * t;
          case "seconds":
          case "second":
          case "secs":
          case "sec":
          case "s":
            return h * e;
          case "milliseconds":
          case "millisecond":
          case "msecs":
          case "msec":
          case "ms":
            return h;
          default:
            return;
        }
      }
    }
  }
  function s(c) {
    var f = Math.abs(c);
    return f >= r ? Math.round(c / r) + "d" : f >= n ? Math.round(c / n) + "h" : f >= t ? Math.round(c / t) + "m" : f >= e ? Math.round(c / e) + "s" : c + "ms";
  }
  function l(c) {
    var f = Math.abs(c);
    return f >= r ? m(c, f, r, "day") : f >= n ? m(c, f, n, "hour") : f >= t ? m(c, f, t, "minute") : f >= e ? m(c, f, e, "second") : c + " ms";
  }
  function m(c, f, h, g) {
    var _ = f >= h * 1.5;
    return Math.round(c / h) + " " + g + (_ ? "s" : "");
  }
  return Ri;
}
var Pi, Ba;
function lc() {
  if (Ba) return Pi;
  Ba = 1;
  function e(t) {
    r.debug = r, r.default = r, r.coerce = m, r.disable = s, r.enable = o, r.enabled = l, r.humanize = yp(), r.destroy = c, Object.keys(t).forEach((f) => {
      r[f] = t[f];
    }), r.names = [], r.skips = [], r.formatters = {};
    function n(f) {
      let h = 0;
      for (let g = 0; g < f.length; g++)
        h = (h << 5) - h + f.charCodeAt(g), h |= 0;
      return r.colors[Math.abs(h) % r.colors.length];
    }
    r.selectColor = n;
    function r(f) {
      let h, g = null, _, y;
      function A(...T) {
        if (!A.enabled)
          return;
        const S = A, N = Number(/* @__PURE__ */ new Date()), x = N - (h || N);
        S.diff = x, S.prev = h, S.curr = N, h = N, T[0] = r.coerce(T[0]), typeof T[0] != "string" && T.unshift("%O");
        let Z = 0;
        T[0] = T[0].replace(/%([a-zA-Z%])/g, (Y, Fe) => {
          if (Y === "%%")
            return "%";
          Z++;
          const E = r.formatters[Fe];
          if (typeof E == "function") {
            const q = T[Z];
            Y = E.call(S, q), T.splice(Z, 1), Z--;
          }
          return Y;
        }), r.formatArgs.call(S, T), (S.log || r.log).apply(S, T);
      }
      return A.namespace = f, A.useColors = r.useColors(), A.color = r.selectColor(f), A.extend = i, A.destroy = r.destroy, Object.defineProperty(A, "enabled", {
        enumerable: !0,
        configurable: !1,
        get: () => g !== null ? g : (_ !== r.namespaces && (_ = r.namespaces, y = r.enabled(f)), y),
        set: (T) => {
          g = T;
        }
      }), typeof r.init == "function" && r.init(A), A;
    }
    function i(f, h) {
      const g = r(this.namespace + (typeof h > "u" ? ":" : h) + f);
      return g.log = this.log, g;
    }
    function o(f) {
      r.save(f), r.namespaces = f, r.names = [], r.skips = [];
      const h = (typeof f == "string" ? f : "").trim().replace(/\s+/g, ",").split(",").filter(Boolean);
      for (const g of h)
        g[0] === "-" ? r.skips.push(g.slice(1)) : r.names.push(g);
    }
    function a(f, h) {
      let g = 0, _ = 0, y = -1, A = 0;
      for (; g < f.length; )
        if (_ < h.length && (h[_] === f[g] || h[_] === "*"))
          h[_] === "*" ? (y = _, A = g, _++) : (g++, _++);
        else if (y !== -1)
          _ = y + 1, A++, g = A;
        else
          return !1;
      for (; _ < h.length && h[_] === "*"; )
        _++;
      return _ === h.length;
    }
    function s() {
      const f = [
        ...r.names,
        ...r.skips.map((h) => "-" + h)
      ].join(",");
      return r.enable(""), f;
    }
    function l(f) {
      for (const h of r.skips)
        if (a(f, h))
          return !1;
      for (const h of r.names)
        if (a(f, h))
          return !0;
      return !1;
    }
    function m(f) {
      return f instanceof Error ? f.stack || f.message : f;
    }
    function c() {
      console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
    }
    return r.enable(r.load()), r;
  }
  return Pi = e, Pi;
}
var ja;
function vp() {
  return ja || (ja = 1, function(e, t) {
    t.formatArgs = r, t.save = i, t.load = o, t.useColors = n, t.storage = a(), t.destroy = /* @__PURE__ */ (() => {
      let l = !1;
      return () => {
        l || (l = !0, console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`."));
      };
    })(), t.colors = [
      "#0000CC",
      "#0000FF",
      "#0033CC",
      "#0033FF",
      "#0066CC",
      "#0066FF",
      "#0099CC",
      "#0099FF",
      "#00CC00",
      "#00CC33",
      "#00CC66",
      "#00CC99",
      "#00CCCC",
      "#00CCFF",
      "#3300CC",
      "#3300FF",
      "#3333CC",
      "#3333FF",
      "#3366CC",
      "#3366FF",
      "#3399CC",
      "#3399FF",
      "#33CC00",
      "#33CC33",
      "#33CC66",
      "#33CC99",
      "#33CCCC",
      "#33CCFF",
      "#6600CC",
      "#6600FF",
      "#6633CC",
      "#6633FF",
      "#66CC00",
      "#66CC33",
      "#9900CC",
      "#9900FF",
      "#9933CC",
      "#9933FF",
      "#99CC00",
      "#99CC33",
      "#CC0000",
      "#CC0033",
      "#CC0066",
      "#CC0099",
      "#CC00CC",
      "#CC00FF",
      "#CC3300",
      "#CC3333",
      "#CC3366",
      "#CC3399",
      "#CC33CC",
      "#CC33FF",
      "#CC6600",
      "#CC6633",
      "#CC9900",
      "#CC9933",
      "#CCCC00",
      "#CCCC33",
      "#FF0000",
      "#FF0033",
      "#FF0066",
      "#FF0099",
      "#FF00CC",
      "#FF00FF",
      "#FF3300",
      "#FF3333",
      "#FF3366",
      "#FF3399",
      "#FF33CC",
      "#FF33FF",
      "#FF6600",
      "#FF6633",
      "#FF9900",
      "#FF9933",
      "#FFCC00",
      "#FFCC33"
    ];
    function n() {
      if (typeof window < "u" && window.process && (window.process.type === "renderer" || window.process.__nwjs))
        return !0;
      if (typeof navigator < "u" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/))
        return !1;
      let l;
      return typeof document < "u" && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || // Is firebug? http://stackoverflow.com/a/398120/376773
      typeof window < "u" && window.console && (window.console.firebug || window.console.exception && window.console.table) || // Is firefox >= v31?
      // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
      typeof navigator < "u" && navigator.userAgent && (l = navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/)) && parseInt(l[1], 10) >= 31 || // Double check webkit in userAgent just in case we are in a worker
      typeof navigator < "u" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
    }
    function r(l) {
      if (l[0] = (this.useColors ? "%c" : "") + this.namespace + (this.useColors ? " %c" : " ") + l[0] + (this.useColors ? "%c " : " ") + "+" + e.exports.humanize(this.diff), !this.useColors)
        return;
      const m = "color: " + this.color;
      l.splice(1, 0, m, "color: inherit");
      let c = 0, f = 0;
      l[0].replace(/%[a-zA-Z%]/g, (h) => {
        h !== "%%" && (c++, h === "%c" && (f = c));
      }), l.splice(f, 0, m);
    }
    t.log = console.debug || console.log || (() => {
    });
    function i(l) {
      try {
        l ? t.storage.setItem("debug", l) : t.storage.removeItem("debug");
      } catch {
      }
    }
    function o() {
      let l;
      try {
        l = t.storage.getItem("debug") || t.storage.getItem("DEBUG");
      } catch {
      }
      return !l && typeof process < "u" && "env" in process && (l = process.env.DEBUG), l;
    }
    function a() {
      try {
        return localStorage;
      } catch {
      }
    }
    e.exports = lc()(t);
    const { formatters: s } = e.exports;
    s.j = function(l) {
      try {
        return JSON.stringify(l);
      } catch (m) {
        return "[UnexpectedJSONParseError]: " + m.message;
      }
    };
  }(pr, pr.exports)), pr.exports;
}
var mr = { exports: {} }, Di, Ha;
function wp() {
  return Ha || (Ha = 1, Di = (e, t = process.argv) => {
    const n = e.startsWith("-") ? "" : e.length === 1 ? "-" : "--", r = t.indexOf(n + e), i = t.indexOf("--");
    return r !== -1 && (i === -1 || r < i);
  }), Di;
}
var Ni, qa;
function _p() {
  if (qa) return Ni;
  qa = 1;
  const e = Xr, t = yl, n = wp(), { env: r } = process;
  let i;
  n("no-color") || n("no-colors") || n("color=false") || n("color=never") ? i = 0 : (n("color") || n("colors") || n("color=true") || n("color=always")) && (i = 1), "FORCE_COLOR" in r && (r.FORCE_COLOR === "true" ? i = 1 : r.FORCE_COLOR === "false" ? i = 0 : i = r.FORCE_COLOR.length === 0 ? 1 : Math.min(parseInt(r.FORCE_COLOR, 10), 3));
  function o(l) {
    return l === 0 ? !1 : {
      level: l,
      hasBasic: !0,
      has256: l >= 2,
      has16m: l >= 3
    };
  }
  function a(l, m) {
    if (i === 0)
      return 0;
    if (n("color=16m") || n("color=full") || n("color=truecolor"))
      return 3;
    if (n("color=256"))
      return 2;
    if (l && !m && i === void 0)
      return 0;
    const c = i || 0;
    if (r.TERM === "dumb")
      return c;
    if (process.platform === "win32") {
      const f = e.release().split(".");
      return Number(f[0]) >= 10 && Number(f[2]) >= 10586 ? Number(f[2]) >= 14931 ? 3 : 2 : 1;
    }
    if ("CI" in r)
      return ["TRAVIS", "CIRCLECI", "APPVEYOR", "GITLAB_CI", "GITHUB_ACTIONS", "BUILDKITE"].some((f) => f in r) || r.CI_NAME === "codeship" ? 1 : c;
    if ("TEAMCITY_VERSION" in r)
      return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(r.TEAMCITY_VERSION) ? 1 : 0;
    if (r.COLORTERM === "truecolor")
      return 3;
    if ("TERM_PROGRAM" in r) {
      const f = parseInt((r.TERM_PROGRAM_VERSION || "").split(".")[0], 10);
      switch (r.TERM_PROGRAM) {
        case "iTerm.app":
          return f >= 3 ? 3 : 2;
        case "Apple_Terminal":
          return 2;
      }
    }
    return /-256(color)?$/i.test(r.TERM) ? 2 : /^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(r.TERM) || "COLORTERM" in r ? 1 : c;
  }
  function s(l) {
    const m = a(l, l && l.isTTY);
    return o(m);
  }
  return Ni = {
    supportsColor: s,
    stdout: o(a(!0, t.isatty(1))),
    stderr: o(a(!0, t.isatty(2)))
  }, Ni;
}
var Ga;
function Ap() {
  return Ga || (Ga = 1, function(e, t) {
    const n = yl, r = _o;
    t.init = c, t.log = s, t.formatArgs = o, t.save = l, t.load = m, t.useColors = i, t.destroy = r.deprecate(
      () => {
      },
      "Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`."
    ), t.colors = [6, 2, 3, 4, 5, 1];
    try {
      const h = _p();
      h && (h.stderr || h).level >= 2 && (t.colors = [
        20,
        21,
        26,
        27,
        32,
        33,
        38,
        39,
        40,
        41,
        42,
        43,
        44,
        45,
        56,
        57,
        62,
        63,
        68,
        69,
        74,
        75,
        76,
        77,
        78,
        79,
        80,
        81,
        92,
        93,
        98,
        99,
        112,
        113,
        128,
        129,
        134,
        135,
        148,
        149,
        160,
        161,
        162,
        163,
        164,
        165,
        166,
        167,
        168,
        169,
        170,
        171,
        172,
        173,
        178,
        179,
        184,
        185,
        196,
        197,
        198,
        199,
        200,
        201,
        202,
        203,
        204,
        205,
        206,
        207,
        208,
        209,
        214,
        215,
        220,
        221
      ]);
    } catch {
    }
    t.inspectOpts = Object.keys(process.env).filter((h) => /^debug_/i.test(h)).reduce((h, g) => {
      const _ = g.substring(6).toLowerCase().replace(/_([a-z])/g, (A, T) => T.toUpperCase());
      let y = process.env[g];
      return /^(yes|on|true|enabled)$/i.test(y) ? y = !0 : /^(no|off|false|disabled)$/i.test(y) ? y = !1 : y === "null" ? y = null : y = Number(y), h[_] = y, h;
    }, {});
    function i() {
      return "colors" in t.inspectOpts ? !!t.inspectOpts.colors : n.isatty(process.stderr.fd);
    }
    function o(h) {
      const { namespace: g, useColors: _ } = this;
      if (_) {
        const y = this.color, A = "\x1B[3" + (y < 8 ? y : "8;5;" + y), T = `  ${A};1m${g} \x1B[0m`;
        h[0] = T + h[0].split(`
`).join(`
` + T), h.push(A + "m+" + e.exports.humanize(this.diff) + "\x1B[0m");
      } else
        h[0] = a() + g + " " + h[0];
    }
    function a() {
      return t.inspectOpts.hideDate ? "" : (/* @__PURE__ */ new Date()).toISOString() + " ";
    }
    function s(...h) {
      return process.stderr.write(r.formatWithOptions(t.inspectOpts, ...h) + `
`);
    }
    function l(h) {
      h ? process.env.DEBUG = h : delete process.env.DEBUG;
    }
    function m() {
      return process.env.DEBUG;
    }
    function c(h) {
      h.inspectOpts = {};
      const g = Object.keys(t.inspectOpts);
      for (let _ = 0; _ < g.length; _++)
        h.inspectOpts[g[_]] = t.inspectOpts[g[_]];
    }
    e.exports = lc()(t);
    const { formatters: f } = e.exports;
    f.o = function(h) {
      return this.inspectOpts.colors = this.useColors, r.inspect(h, this.inspectOpts).split(`
`).map((g) => g.trim()).join(" ");
    }, f.O = function(h) {
      return this.inspectOpts.colors = this.useColors, r.inspect(h, this.inspectOpts);
    };
  }(mr, mr.exports)), mr.exports;
}
typeof process > "u" || process.type === "renderer" || process.browser === !0 || process.__nwjs ? so.exports = vp() : so.exports = Ap();
var Sp = so.exports, Vn = {};
Object.defineProperty(Vn, "__esModule", { value: !0 });
Vn.ProgressCallbackTransform = void 0;
const Tp = qn;
class Cp extends Tp.Transform {
  constructor(t, n, r) {
    super(), this.total = t, this.cancellationToken = n, this.onProgress = r, this.start = Date.now(), this.transferred = 0, this.delta = 0, this.nextUpdate = this.start + 1e3;
  }
  _transform(t, n, r) {
    if (this.cancellationToken.cancelled) {
      r(new Error("cancelled"), null);
      return;
    }
    this.transferred += t.length, this.delta += t.length;
    const i = Date.now();
    i >= this.nextUpdate && this.transferred !== this.total && (this.nextUpdate = i + 1e3, this.onProgress({
      total: this.total,
      delta: this.delta,
      transferred: this.transferred,
      percent: this.transferred / this.total * 100,
      bytesPerSecond: Math.round(this.transferred / ((i - this.start) / 1e3))
    }), this.delta = 0), r(null, t);
  }
  _flush(t) {
    if (this.cancellationToken.cancelled) {
      t(new Error("cancelled"));
      return;
    }
    this.onProgress({
      total: this.total,
      delta: this.delta,
      transferred: this.total,
      percent: 100,
      bytesPerSecond: Math.round(this.transferred / ((Date.now() - this.start) / 1e3))
    }), this.delta = 0, t(null);
  }
}
Vn.ProgressCallbackTransform = Cp;
Object.defineProperty(be, "__esModule", { value: !0 });
be.DigestTransform = be.HttpExecutor = be.HttpError = void 0;
be.createHttpError = lo;
be.parseJson = Np;
be.configureRequestOptionsFromUrl = uc;
be.configureRequestUrl = Do;
be.safeGetHeader = Zt;
be.configureRequestOptions = kr;
be.safeStringifyJson = Mr;
const bp = Gn, $p = Sp, Op = vt, Ip = qn, cc = an, Rp = mt, Wa = ln, Pp = Vn, gn = (0, $p.default)("electron-builder");
function lo(e, t = null) {
  return new Po(e.statusCode || -1, `${e.statusCode} ${e.statusMessage}` + (t == null ? "" : `
` + JSON.stringify(t, null, "  ")) + `
Headers: ` + Mr(e.headers), t);
}
const Dp = /* @__PURE__ */ new Map([
  [429, "Too many requests"],
  [400, "Bad request"],
  [403, "Forbidden"],
  [404, "Not found"],
  [405, "Method not allowed"],
  [406, "Not acceptable"],
  [408, "Request timeout"],
  [413, "Request entity too large"],
  [500, "Internal server error"],
  [502, "Bad gateway"],
  [503, "Service unavailable"],
  [504, "Gateway timeout"],
  [505, "HTTP version not supported"]
]);
class Po extends Error {
  constructor(t, n = `HTTP error: ${Dp.get(t) || t}`, r = null) {
    super(n), this.statusCode = t, this.description = r, this.name = "HttpError", this.code = `HTTP_ERROR_${t}`;
  }
  isServerError() {
    return this.statusCode >= 500 && this.statusCode <= 599;
  }
}
be.HttpError = Po;
function Np(e) {
  return e.then((t) => t == null || t.length === 0 ? null : JSON.parse(t));
}
class Ur {
  constructor() {
    this.maxRedirects = 10;
  }
  request(t, n = new Rp.CancellationToken(), r) {
    kr(t);
    const i = r == null ? void 0 : JSON.stringify(r), o = i ? Buffer.from(i) : void 0;
    if (o != null) {
      gn(i);
      const { headers: a, ...s } = t;
      t = {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": o.length,
          ...a
        },
        ...s
      };
    }
    return this.doApiRequest(t, n, (a) => a.end(o));
  }
  doApiRequest(t, n, r, i = 0) {
    return gn.enabled && gn(`Request: ${Mr(t)}`), n.createPromise((o, a, s) => {
      const l = this.createRequest(t, (m) => {
        try {
          this.handleResponse(m, t, n, o, a, i, r);
        } catch (c) {
          a(c);
        }
      });
      this.addErrorAndTimeoutHandlers(l, a, t.timeout), this.addRedirectHandlers(l, t, a, i, (m) => {
        this.doApiRequest(m, n, r, i).then(o).catch(a);
      }), r(l, a), s(() => l.abort());
    });
  }
  // noinspection JSUnusedLocalSymbols
  // eslint-disable-next-line
  addRedirectHandlers(t, n, r, i, o) {
  }
  addErrorAndTimeoutHandlers(t, n, r = 60 * 1e3) {
    this.addTimeOutHandler(t, n, r), t.on("error", n), t.on("aborted", () => {
      n(new Error("Request has been aborted by the server"));
    });
  }
  handleResponse(t, n, r, i, o, a, s) {
    var l;
    if (gn.enabled && gn(`Response: ${t.statusCode} ${t.statusMessage}, request options: ${Mr(n)}`), t.statusCode === 404) {
      o(lo(t, `method: ${n.method || "GET"} url: ${n.protocol || "https:"}//${n.hostname}${n.port ? `:${n.port}` : ""}${n.path}

Please double check that your authentication token is correct. Due to security reasons, actual status maybe not reported, but 404.
`));
      return;
    } else if (t.statusCode === 204) {
      i();
      return;
    }
    const m = (l = t.statusCode) !== null && l !== void 0 ? l : 0, c = m >= 300 && m < 400, f = Zt(t, "location");
    if (c && f != null) {
      if (a > this.maxRedirects) {
        o(this.createMaxRedirectError());
        return;
      }
      this.doApiRequest(Ur.prepareRedirectUrlOptions(f, n), r, s, a).then(i).catch(o);
      return;
    }
    t.setEncoding("utf8");
    let h = "";
    t.on("error", o), t.on("data", (g) => h += g), t.on("end", () => {
      try {
        if (t.statusCode != null && t.statusCode >= 400) {
          const g = Zt(t, "content-type"), _ = g != null && (Array.isArray(g) ? g.find((y) => y.includes("json")) != null : g.includes("json"));
          o(lo(t, `method: ${n.method || "GET"} url: ${n.protocol || "https:"}//${n.hostname}${n.port ? `:${n.port}` : ""}${n.path}

          Data:
          ${_ ? JSON.stringify(JSON.parse(h)) : h}
          `));
        } else
          i(h.length === 0 ? null : h);
      } catch (g) {
        o(g);
      }
    });
  }
  async downloadToBuffer(t, n) {
    return await n.cancellationToken.createPromise((r, i, o) => {
      const a = [], s = {
        headers: n.headers || void 0,
        // because PrivateGitHubProvider requires HttpExecutor.prepareRedirectUrlOptions logic, so, we need to redirect manually
        redirect: "manual"
      };
      Do(t, s), kr(s), this.doDownload(s, {
        destination: null,
        options: n,
        onCancel: o,
        callback: (l) => {
          l == null ? r(Buffer.concat(a)) : i(l);
        },
        responseHandler: (l, m) => {
          let c = 0;
          l.on("data", (f) => {
            if (c += f.length, c > 524288e3) {
              m(new Error("Maximum allowed size is 500 MB"));
              return;
            }
            a.push(f);
          }), l.on("end", () => {
            m(null);
          });
        }
      }, 0);
    });
  }
  doDownload(t, n, r) {
    const i = this.createRequest(t, (o) => {
      if (o.statusCode >= 400) {
        n.callback(new Error(`Cannot download "${t.protocol || "https:"}//${t.hostname}${t.path}", status ${o.statusCode}: ${o.statusMessage}`));
        return;
      }
      o.on("error", n.callback);
      const a = Zt(o, "location");
      if (a != null) {
        r < this.maxRedirects ? this.doDownload(Ur.prepareRedirectUrlOptions(a, t), n, r++) : n.callback(this.createMaxRedirectError());
        return;
      }
      n.responseHandler == null ? xp(n, o) : n.responseHandler(o, n.callback);
    });
    this.addErrorAndTimeoutHandlers(i, n.callback, t.timeout), this.addRedirectHandlers(i, t, n.callback, r, (o) => {
      this.doDownload(o, n, r++);
    }), i.end();
  }
  createMaxRedirectError() {
    return new Error(`Too many redirects (> ${this.maxRedirects})`);
  }
  addTimeOutHandler(t, n, r) {
    t.on("socket", (i) => {
      i.setTimeout(r, () => {
        t.abort(), n(new Error("Request timed out"));
      });
    });
  }
  static prepareRedirectUrlOptions(t, n) {
    const r = uc(t, { ...n }), i = r.headers;
    if (i != null && i.authorization) {
      const o = new cc.URL(t);
      (o.hostname.endsWith(".amazonaws.com") || o.searchParams.has("X-Amz-Credential")) && delete i.authorization;
    }
    return r;
  }
  static retryOnServerError(t, n = 3) {
    for (let r = 0; ; r++)
      try {
        return t();
      } catch (i) {
        if (r < n && (i instanceof Po && i.isServerError() || i.code === "EPIPE"))
          continue;
        throw i;
      }
  }
}
be.HttpExecutor = Ur;
function uc(e, t) {
  const n = kr(t);
  return Do(new cc.URL(e), n), n;
}
function Do(e, t) {
  t.protocol = e.protocol, t.hostname = e.hostname, e.port ? t.port = e.port : t.port && delete t.port, t.path = e.pathname + e.search;
}
class co extends Ip.Transform {
  // noinspection JSUnusedGlobalSymbols
  get actual() {
    return this._actual;
  }
  constructor(t, n = "sha512", r = "base64") {
    super(), this.expected = t, this.algorithm = n, this.encoding = r, this._actual = null, this.isValidateOnEnd = !0, this.digester = (0, bp.createHash)(n);
  }
  // noinspection JSUnusedGlobalSymbols
  _transform(t, n, r) {
    this.digester.update(t), r(null, t);
  }
  // noinspection JSUnusedGlobalSymbols
  _flush(t) {
    if (this._actual = this.digester.digest(this.encoding), this.isValidateOnEnd)
      try {
        this.validate();
      } catch (n) {
        t(n);
        return;
      }
    t(null);
  }
  validate() {
    if (this._actual == null)
      throw (0, Wa.newError)("Not finished yet", "ERR_STREAM_NOT_FINISHED");
    if (this._actual !== this.expected)
      throw (0, Wa.newError)(`${this.algorithm} checksum mismatch, expected ${this.expected}, got ${this._actual}`, "ERR_CHECKSUM_MISMATCH");
    return null;
  }
}
be.DigestTransform = co;
function Fp(e, t, n) {
  return e != null && t != null && e !== t ? (n(new Error(`checksum mismatch: expected ${t} but got ${e} (X-Checksum-Sha2 header)`)), !1) : !0;
}
function Zt(e, t) {
  const n = e.headers[t];
  return n == null ? null : Array.isArray(n) ? n.length === 0 ? null : n[n.length - 1] : n;
}
function xp(e, t) {
  if (!Fp(Zt(t, "X-Checksum-Sha2"), e.options.sha2, e.callback))
    return;
  const n = [];
  if (e.options.onProgress != null) {
    const a = Zt(t, "content-length");
    a != null && n.push(new Pp.ProgressCallbackTransform(parseInt(a, 10), e.options.cancellationToken, e.options.onProgress));
  }
  const r = e.options.sha512;
  r != null ? n.push(new co(r, "sha512", r.length === 128 && !r.includes("+") && !r.includes("Z") && !r.includes("=") ? "hex" : "base64")) : e.options.sha2 != null && n.push(new co(e.options.sha2, "sha256", "hex"));
  const i = (0, Op.createWriteStream)(e.destination);
  n.push(i);
  let o = t;
  for (const a of n)
    a.on("error", (s) => {
      i.close(), e.options.cancellationToken.cancelled || e.callback(s);
    }), o = o.pipe(a);
  i.on("finish", () => {
    i.close(e.callback);
  });
}
function kr(e, t, n) {
  n != null && (e.method = n), e.headers = { ...e.headers };
  const r = e.headers;
  return t != null && (r.authorization = t.startsWith("Basic") || t.startsWith("Bearer") ? t : `token ${t}`), r["User-Agent"] == null && (r["User-Agent"] = "electron-builder"), (n == null || n === "GET" || r["Cache-Control"] == null) && (r["Cache-Control"] = "no-cache"), e.protocol == null && process.versions.electron != null && (e.protocol = "https:"), e;
}
function Mr(e, t) {
  return JSON.stringify(e, (n, r) => n.endsWith("Authorization") || n.endsWith("authorization") || n.endsWith("Password") || n.endsWith("PASSWORD") || n.endsWith("Token") || n.includes("password") || n.includes("token") || t != null && t.has(n) ? "<stripped sensitive data>" : r, 2);
}
var ei = {};
Object.defineProperty(ei, "__esModule", { value: !0 });
ei.MemoLazy = void 0;
class Lp {
  constructor(t, n) {
    this.selector = t, this.creator = n, this.selected = void 0, this._value = void 0;
  }
  get hasValue() {
    return this._value !== void 0;
  }
  get value() {
    const t = this.selector();
    if (this._value !== void 0 && fc(this.selected, t))
      return this._value;
    this.selected = t;
    const n = this.creator(t);
    return this.value = n, n;
  }
  set value(t) {
    this._value = t;
  }
}
ei.MemoLazy = Lp;
function fc(e, t) {
  if (typeof e == "object" && e !== null && (typeof t == "object" && t !== null)) {
    const i = Object.keys(e), o = Object.keys(t);
    return i.length === o.length && i.every((a) => fc(e[a], t[a]));
  }
  return e === t;
}
var ti = {};
Object.defineProperty(ti, "__esModule", { value: !0 });
ti.githubUrl = Up;
ti.getS3LikeProviderBaseUrl = kp;
function Up(e, t = "github.com") {
  return `${e.protocol || "https"}://${e.host || t}`;
}
function kp(e) {
  const t = e.provider;
  if (t === "s3")
    return Mp(e);
  if (t === "spaces")
    return Bp(e);
  throw new Error(`Not supported provider: ${t}`);
}
function Mp(e) {
  let t;
  if (e.accelerate == !0)
    t = `https://${e.bucket}.s3-accelerate.amazonaws.com`;
  else if (e.endpoint != null)
    t = `${e.endpoint}/${e.bucket}`;
  else if (e.bucket.includes(".")) {
    if (e.region == null)
      throw new Error(`Bucket name "${e.bucket}" includes a dot, but S3 region is missing`);
    e.region === "us-east-1" ? t = `https://s3.amazonaws.com/${e.bucket}` : t = `https://s3-${e.region}.amazonaws.com/${e.bucket}`;
  } else e.region === "cn-north-1" ? t = `https://${e.bucket}.s3.${e.region}.amazonaws.com.cn` : t = `https://${e.bucket}.s3.amazonaws.com`;
  return dc(t, e.path);
}
function dc(e, t) {
  return t != null && t.length > 0 && (t.startsWith("/") || (e += "/"), e += t), e;
}
function Bp(e) {
  if (e.name == null)
    throw new Error("name is missing");
  if (e.region == null)
    throw new Error("region is missing");
  return dc(`https://${e.name}.${e.region}.digitaloceanspaces.com`, e.path);
}
var No = {};
Object.defineProperty(No, "__esModule", { value: !0 });
No.retry = hc;
const jp = mt;
async function hc(e, t, n, r = 0, i = 0, o) {
  var a;
  const s = new jp.CancellationToken();
  try {
    return await e();
  } catch (l) {
    if ((!((a = o == null ? void 0 : o(l)) !== null && a !== void 0) || a) && t > 0 && !s.cancelled)
      return await new Promise((m) => setTimeout(m, n + r * i)), await hc(e, t - 1, n, r, i + 1, o);
    throw l;
  }
}
var Fo = {};
Object.defineProperty(Fo, "__esModule", { value: !0 });
Fo.parseDn = Hp;
function Hp(e) {
  let t = !1, n = null, r = "", i = 0;
  e = e.trim();
  const o = /* @__PURE__ */ new Map();
  for (let a = 0; a <= e.length; a++) {
    if (a === e.length) {
      n !== null && o.set(n, r);
      break;
    }
    const s = e[a];
    if (t) {
      if (s === '"') {
        t = !1;
        continue;
      }
    } else {
      if (s === '"') {
        t = !0;
        continue;
      }
      if (s === "\\") {
        a++;
        const l = parseInt(e.slice(a, a + 2), 16);
        Number.isNaN(l) ? r += e[a] : (a++, r += String.fromCharCode(l));
        continue;
      }
      if (n === null && s === "=") {
        n = r, r = "";
        continue;
      }
      if (s === "," || s === ";" || s === "+") {
        n !== null && o.set(n, r), n = null, r = "";
        continue;
      }
    }
    if (s === " " && !t) {
      if (r.length === 0)
        continue;
      if (a > i) {
        let l = a;
        for (; e[l] === " "; )
          l++;
        i = l;
      }
      if (i >= e.length || e[i] === "," || e[i] === ";" || n === null && e[i] === "=" || n !== null && e[i] === "+") {
        a = i - 1;
        continue;
      }
    }
    r += s;
  }
  return o;
}
var rn = {};
Object.defineProperty(rn, "__esModule", { value: !0 });
rn.nil = rn.UUID = void 0;
const pc = Gn, mc = ln, qp = "options.name must be either a string or a Buffer", Va = (0, pc.randomBytes)(16);
Va[0] = Va[0] | 1;
const Pr = {}, V = [];
for (let e = 0; e < 256; e++) {
  const t = (e + 256).toString(16).substr(1);
  Pr[t] = e, V[e] = t;
}
class xt {
  constructor(t) {
    this.ascii = null, this.binary = null;
    const n = xt.check(t);
    if (!n)
      throw new Error("not a UUID");
    this.version = n.version, n.format === "ascii" ? this.ascii = t : this.binary = t;
  }
  static v5(t, n) {
    return Gp(t, "sha1", 80, n);
  }
  toString() {
    return this.ascii == null && (this.ascii = Wp(this.binary)), this.ascii;
  }
  inspect() {
    return `UUID v${this.version} ${this.toString()}`;
  }
  static check(t, n = 0) {
    if (typeof t == "string")
      return t = t.toLowerCase(), /^[a-f0-9]{8}(-[a-f0-9]{4}){3}-([a-f0-9]{12})$/.test(t) ? t === "00000000-0000-0000-0000-000000000000" ? { version: void 0, variant: "nil", format: "ascii" } : {
        version: (Pr[t[14] + t[15]] & 240) >> 4,
        variant: Ya((Pr[t[19] + t[20]] & 224) >> 5),
        format: "ascii"
      } : !1;
    if (Buffer.isBuffer(t)) {
      if (t.length < n + 16)
        return !1;
      let r = 0;
      for (; r < 16 && t[n + r] === 0; r++)
        ;
      return r === 16 ? { version: void 0, variant: "nil", format: "binary" } : {
        version: (t[n + 6] & 240) >> 4,
        variant: Ya((t[n + 8] & 224) >> 5),
        format: "binary"
      };
    }
    throw (0, mc.newError)("Unknown type of uuid", "ERR_UNKNOWN_UUID_TYPE");
  }
  // read stringified uuid into a Buffer
  static parse(t) {
    const n = Buffer.allocUnsafe(16);
    let r = 0;
    for (let i = 0; i < 16; i++)
      n[i] = Pr[t[r++] + t[r++]], (i === 3 || i === 5 || i === 7 || i === 9) && (r += 1);
    return n;
  }
}
rn.UUID = xt;
xt.OID = xt.parse("6ba7b812-9dad-11d1-80b4-00c04fd430c8");
function Ya(e) {
  switch (e) {
    case 0:
    case 1:
    case 3:
      return "ncs";
    case 4:
    case 5:
      return "rfc4122";
    case 6:
      return "microsoft";
    default:
      return "future";
  }
}
var Cn;
(function(e) {
  e[e.ASCII = 0] = "ASCII", e[e.BINARY = 1] = "BINARY", e[e.OBJECT = 2] = "OBJECT";
})(Cn || (Cn = {}));
function Gp(e, t, n, r, i = Cn.ASCII) {
  const o = (0, pc.createHash)(t);
  if (typeof e != "string" && !Buffer.isBuffer(e))
    throw (0, mc.newError)(qp, "ERR_INVALID_UUID_NAME");
  o.update(r), o.update(e);
  const s = o.digest();
  let l;
  switch (i) {
    case Cn.BINARY:
      s[6] = s[6] & 15 | n, s[8] = s[8] & 63 | 128, l = s;
      break;
    case Cn.OBJECT:
      s[6] = s[6] & 15 | n, s[8] = s[8] & 63 | 128, l = new xt(s);
      break;
    default:
      l = V[s[0]] + V[s[1]] + V[s[2]] + V[s[3]] + "-" + V[s[4]] + V[s[5]] + "-" + V[s[6] & 15 | n] + V[s[7]] + "-" + V[s[8] & 63 | 128] + V[s[9]] + "-" + V[s[10]] + V[s[11]] + V[s[12]] + V[s[13]] + V[s[14]] + V[s[15]];
      break;
  }
  return l;
}
function Wp(e) {
  return V[e[0]] + V[e[1]] + V[e[2]] + V[e[3]] + "-" + V[e[4]] + V[e[5]] + "-" + V[e[6]] + V[e[7]] + "-" + V[e[8]] + V[e[9]] + "-" + V[e[10]] + V[e[11]] + V[e[12]] + V[e[13]] + V[e[14]] + V[e[15]];
}
rn.nil = new xt("00000000-0000-0000-0000-000000000000");
var Yn = {}, gc = {};
(function(e) {
  (function(t) {
    t.parser = function(d, u) {
      return new r(d, u);
    }, t.SAXParser = r, t.SAXStream = c, t.createStream = m, t.MAX_BUFFER_LENGTH = 64 * 1024;
    var n = [
      "comment",
      "sgmlDecl",
      "textNode",
      "tagName",
      "doctype",
      "procInstName",
      "procInstBody",
      "entity",
      "attribName",
      "attribValue",
      "cdata",
      "script"
    ];
    t.EVENTS = [
      "text",
      "processinginstruction",
      "sgmldeclaration",
      "doctype",
      "comment",
      "opentagstart",
      "attribute",
      "opentag",
      "closetag",
      "opencdata",
      "cdata",
      "closecdata",
      "error",
      "end",
      "ready",
      "script",
      "opennamespace",
      "closenamespace"
    ];
    function r(d, u) {
      if (!(this instanceof r))
        return new r(d, u);
      var C = this;
      o(C), C.q = C.c = "", C.bufferCheckPosition = t.MAX_BUFFER_LENGTH, C.opt = u || {}, C.opt.lowercase = C.opt.lowercase || C.opt.lowercasetags, C.looseCase = C.opt.lowercase ? "toLowerCase" : "toUpperCase", C.tags = [], C.closed = C.closedRoot = C.sawRoot = !1, C.tag = C.error = null, C.strict = !!d, C.noscript = !!(d || C.opt.noscript), C.state = E.BEGIN, C.strictEntities = C.opt.strictEntities, C.ENTITIES = C.strictEntities ? Object.create(t.XML_ENTITIES) : Object.create(t.ENTITIES), C.attribList = [], C.opt.xmlns && (C.ns = Object.create(y)), C.opt.unquotedAttributeValues === void 0 && (C.opt.unquotedAttributeValues = !d), C.trackPosition = C.opt.position !== !1, C.trackPosition && (C.position = C.line = C.column = 0), B(C, "onready");
    }
    Object.create || (Object.create = function(d) {
      function u() {
      }
      u.prototype = d;
      var C = new u();
      return C;
    }), Object.keys || (Object.keys = function(d) {
      var u = [];
      for (var C in d) d.hasOwnProperty(C) && u.push(C);
      return u;
    });
    function i(d) {
      for (var u = Math.max(t.MAX_BUFFER_LENGTH, 10), C = 0, w = 0, z = n.length; w < z; w++) {
        var ee = d[n[w]].length;
        if (ee > u)
          switch (n[w]) {
            case "textNode":
              X(d);
              break;
            case "cdata":
              M(d, "oncdata", d.cdata), d.cdata = "";
              break;
            case "script":
              M(d, "onscript", d.script), d.script = "";
              break;
            default:
              $(d, "Max buffer length exceeded: " + n[w]);
          }
        C = Math.max(C, ee);
      }
      var ie = t.MAX_BUFFER_LENGTH - C;
      d.bufferCheckPosition = ie + d.position;
    }
    function o(d) {
      for (var u = 0, C = n.length; u < C; u++)
        d[n[u]] = "";
    }
    function a(d) {
      X(d), d.cdata !== "" && (M(d, "oncdata", d.cdata), d.cdata = ""), d.script !== "" && (M(d, "onscript", d.script), d.script = "");
    }
    r.prototype = {
      end: function() {
        P(this);
      },
      write: Ve,
      resume: function() {
        return this.error = null, this;
      },
      close: function() {
        return this.write(null);
      },
      flush: function() {
        a(this);
      }
    };
    var s;
    try {
      s = require("stream").Stream;
    } catch {
      s = function() {
      };
    }
    s || (s = function() {
    });
    var l = t.EVENTS.filter(function(d) {
      return d !== "error" && d !== "end";
    });
    function m(d, u) {
      return new c(d, u);
    }
    function c(d, u) {
      if (!(this instanceof c))
        return new c(d, u);
      s.apply(this), this._parser = new r(d, u), this.writable = !0, this.readable = !0;
      var C = this;
      this._parser.onend = function() {
        C.emit("end");
      }, this._parser.onerror = function(w) {
        C.emit("error", w), C._parser.error = null;
      }, this._decoder = null, l.forEach(function(w) {
        Object.defineProperty(C, "on" + w, {
          get: function() {
            return C._parser["on" + w];
          },
          set: function(z) {
            if (!z)
              return C.removeAllListeners(w), C._parser["on" + w] = z, z;
            C.on(w, z);
          },
          enumerable: !0,
          configurable: !1
        });
      });
    }
    c.prototype = Object.create(s.prototype, {
      constructor: {
        value: c
      }
    }), c.prototype.write = function(d) {
      if (typeof Buffer == "function" && typeof Buffer.isBuffer == "function" && Buffer.isBuffer(d)) {
        if (!this._decoder) {
          var u = Lf.StringDecoder;
          this._decoder = new u("utf8");
        }
        d = this._decoder.write(d);
      }
      return this._parser.write(d.toString()), this.emit("data", d), !0;
    }, c.prototype.end = function(d) {
      return d && d.length && this.write(d), this._parser.end(), !0;
    }, c.prototype.on = function(d, u) {
      var C = this;
      return !C._parser["on" + d] && l.indexOf(d) !== -1 && (C._parser["on" + d] = function() {
        var w = arguments.length === 1 ? [arguments[0]] : Array.apply(null, arguments);
        w.splice(0, 0, d), C.emit.apply(C, w);
      }), s.prototype.on.call(C, d, u);
    };
    var f = "[CDATA[", h = "DOCTYPE", g = "http://www.w3.org/XML/1998/namespace", _ = "http://www.w3.org/2000/xmlns/", y = { xml: g, xmlns: _ }, A = /[:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/, T = /[:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\u00B7\u0300-\u036F\u203F-\u2040.\d-]/, S = /[#:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/, N = /[#:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\u00B7\u0300-\u036F\u203F-\u2040.\d-]/;
    function x(d) {
      return d === " " || d === `
` || d === "\r" || d === "	";
    }
    function Z(d) {
      return d === '"' || d === "'";
    }
    function ae(d) {
      return d === ">" || x(d);
    }
    function Y(d, u) {
      return d.test(u);
    }
    function Fe(d, u) {
      return !Y(d, u);
    }
    var E = 0;
    t.STATE = {
      BEGIN: E++,
      // leading byte order mark or whitespace
      BEGIN_WHITESPACE: E++,
      // leading whitespace
      TEXT: E++,
      // general stuff
      TEXT_ENTITY: E++,
      // &amp and such.
      OPEN_WAKA: E++,
      // <
      SGML_DECL: E++,
      // <!BLARG
      SGML_DECL_QUOTED: E++,
      // <!BLARG foo "bar
      DOCTYPE: E++,
      // <!DOCTYPE
      DOCTYPE_QUOTED: E++,
      // <!DOCTYPE "//blah
      DOCTYPE_DTD: E++,
      // <!DOCTYPE "//blah" [ ...
      DOCTYPE_DTD_QUOTED: E++,
      // <!DOCTYPE "//blah" [ "foo
      COMMENT_STARTING: E++,
      // <!-
      COMMENT: E++,
      // <!--
      COMMENT_ENDING: E++,
      // <!-- blah -
      COMMENT_ENDED: E++,
      // <!-- blah --
      CDATA: E++,
      // <![CDATA[ something
      CDATA_ENDING: E++,
      // ]
      CDATA_ENDING_2: E++,
      // ]]
      PROC_INST: E++,
      // <?hi
      PROC_INST_BODY: E++,
      // <?hi there
      PROC_INST_ENDING: E++,
      // <?hi "there" ?
      OPEN_TAG: E++,
      // <strong
      OPEN_TAG_SLASH: E++,
      // <strong /
      ATTRIB: E++,
      // <a
      ATTRIB_NAME: E++,
      // <a foo
      ATTRIB_NAME_SAW_WHITE: E++,
      // <a foo _
      ATTRIB_VALUE: E++,
      // <a foo=
      ATTRIB_VALUE_QUOTED: E++,
      // <a foo="bar
      ATTRIB_VALUE_CLOSED: E++,
      // <a foo="bar"
      ATTRIB_VALUE_UNQUOTED: E++,
      // <a foo=bar
      ATTRIB_VALUE_ENTITY_Q: E++,
      // <foo bar="&quot;"
      ATTRIB_VALUE_ENTITY_U: E++,
      // <foo bar=&quot
      CLOSE_TAG: E++,
      // </a
      CLOSE_TAG_SAW_WHITE: E++,
      // </a   >
      SCRIPT: E++,
      // <script> ...
      SCRIPT_ENDING: E++
      // <script> ... <
    }, t.XML_ENTITIES = {
      amp: "&",
      gt: ">",
      lt: "<",
      quot: '"',
      apos: "'"
    }, t.ENTITIES = {
      amp: "&",
      gt: ">",
      lt: "<",
      quot: '"',
      apos: "'",
      AElig: 198,
      Aacute: 193,
      Acirc: 194,
      Agrave: 192,
      Aring: 197,
      Atilde: 195,
      Auml: 196,
      Ccedil: 199,
      ETH: 208,
      Eacute: 201,
      Ecirc: 202,
      Egrave: 200,
      Euml: 203,
      Iacute: 205,
      Icirc: 206,
      Igrave: 204,
      Iuml: 207,
      Ntilde: 209,
      Oacute: 211,
      Ocirc: 212,
      Ograve: 210,
      Oslash: 216,
      Otilde: 213,
      Ouml: 214,
      THORN: 222,
      Uacute: 218,
      Ucirc: 219,
      Ugrave: 217,
      Uuml: 220,
      Yacute: 221,
      aacute: 225,
      acirc: 226,
      aelig: 230,
      agrave: 224,
      aring: 229,
      atilde: 227,
      auml: 228,
      ccedil: 231,
      eacute: 233,
      ecirc: 234,
      egrave: 232,
      eth: 240,
      euml: 235,
      iacute: 237,
      icirc: 238,
      igrave: 236,
      iuml: 239,
      ntilde: 241,
      oacute: 243,
      ocirc: 244,
      ograve: 242,
      oslash: 248,
      otilde: 245,
      ouml: 246,
      szlig: 223,
      thorn: 254,
      uacute: 250,
      ucirc: 251,
      ugrave: 249,
      uuml: 252,
      yacute: 253,
      yuml: 255,
      copy: 169,
      reg: 174,
      nbsp: 160,
      iexcl: 161,
      cent: 162,
      pound: 163,
      curren: 164,
      yen: 165,
      brvbar: 166,
      sect: 167,
      uml: 168,
      ordf: 170,
      laquo: 171,
      not: 172,
      shy: 173,
      macr: 175,
      deg: 176,
      plusmn: 177,
      sup1: 185,
      sup2: 178,
      sup3: 179,
      acute: 180,
      micro: 181,
      para: 182,
      middot: 183,
      cedil: 184,
      ordm: 186,
      raquo: 187,
      frac14: 188,
      frac12: 189,
      frac34: 190,
      iquest: 191,
      times: 215,
      divide: 247,
      OElig: 338,
      oelig: 339,
      Scaron: 352,
      scaron: 353,
      Yuml: 376,
      fnof: 402,
      circ: 710,
      tilde: 732,
      Alpha: 913,
      Beta: 914,
      Gamma: 915,
      Delta: 916,
      Epsilon: 917,
      Zeta: 918,
      Eta: 919,
      Theta: 920,
      Iota: 921,
      Kappa: 922,
      Lambda: 923,
      Mu: 924,
      Nu: 925,
      Xi: 926,
      Omicron: 927,
      Pi: 928,
      Rho: 929,
      Sigma: 931,
      Tau: 932,
      Upsilon: 933,
      Phi: 934,
      Chi: 935,
      Psi: 936,
      Omega: 937,
      alpha: 945,
      beta: 946,
      gamma: 947,
      delta: 948,
      epsilon: 949,
      zeta: 950,
      eta: 951,
      theta: 952,
      iota: 953,
      kappa: 954,
      lambda: 955,
      mu: 956,
      nu: 957,
      xi: 958,
      omicron: 959,
      pi: 960,
      rho: 961,
      sigmaf: 962,
      sigma: 963,
      tau: 964,
      upsilon: 965,
      phi: 966,
      chi: 967,
      psi: 968,
      omega: 969,
      thetasym: 977,
      upsih: 978,
      piv: 982,
      ensp: 8194,
      emsp: 8195,
      thinsp: 8201,
      zwnj: 8204,
      zwj: 8205,
      lrm: 8206,
      rlm: 8207,
      ndash: 8211,
      mdash: 8212,
      lsquo: 8216,
      rsquo: 8217,
      sbquo: 8218,
      ldquo: 8220,
      rdquo: 8221,
      bdquo: 8222,
      dagger: 8224,
      Dagger: 8225,
      bull: 8226,
      hellip: 8230,
      permil: 8240,
      prime: 8242,
      Prime: 8243,
      lsaquo: 8249,
      rsaquo: 8250,
      oline: 8254,
      frasl: 8260,
      euro: 8364,
      image: 8465,
      weierp: 8472,
      real: 8476,
      trade: 8482,
      alefsym: 8501,
      larr: 8592,
      uarr: 8593,
      rarr: 8594,
      darr: 8595,
      harr: 8596,
      crarr: 8629,
      lArr: 8656,
      uArr: 8657,
      rArr: 8658,
      dArr: 8659,
      hArr: 8660,
      forall: 8704,
      part: 8706,
      exist: 8707,
      empty: 8709,
      nabla: 8711,
      isin: 8712,
      notin: 8713,
      ni: 8715,
      prod: 8719,
      sum: 8721,
      minus: 8722,
      lowast: 8727,
      radic: 8730,
      prop: 8733,
      infin: 8734,
      ang: 8736,
      and: 8743,
      or: 8744,
      cap: 8745,
      cup: 8746,
      int: 8747,
      there4: 8756,
      sim: 8764,
      cong: 8773,
      asymp: 8776,
      ne: 8800,
      equiv: 8801,
      le: 8804,
      ge: 8805,
      sub: 8834,
      sup: 8835,
      nsub: 8836,
      sube: 8838,
      supe: 8839,
      oplus: 8853,
      otimes: 8855,
      perp: 8869,
      sdot: 8901,
      lceil: 8968,
      rceil: 8969,
      lfloor: 8970,
      rfloor: 8971,
      lang: 9001,
      rang: 9002,
      loz: 9674,
      spades: 9824,
      clubs: 9827,
      hearts: 9829,
      diams: 9830
    }, Object.keys(t.ENTITIES).forEach(function(d) {
      var u = t.ENTITIES[d], C = typeof u == "number" ? String.fromCharCode(u) : u;
      t.ENTITIES[d] = C;
    });
    for (var q in t.STATE)
      t.STATE[t.STATE[q]] = q;
    E = t.STATE;
    function B(d, u, C) {
      d[u] && d[u](C);
    }
    function M(d, u, C) {
      d.textNode && X(d), B(d, u, C);
    }
    function X(d) {
      d.textNode = I(d.opt, d.textNode), d.textNode && B(d, "ontext", d.textNode), d.textNode = "";
    }
    function I(d, u) {
      return d.trim && (u = u.trim()), d.normalize && (u = u.replace(/\s+/g, " ")), u;
    }
    function $(d, u) {
      return X(d), d.trackPosition && (u += `
Line: ` + d.line + `
Column: ` + d.column + `
Char: ` + d.c), u = new Error(u), d.error = u, B(d, "onerror", u), d;
    }
    function P(d) {
      return d.sawRoot && !d.closedRoot && b(d, "Unclosed root tag"), d.state !== E.BEGIN && d.state !== E.BEGIN_WHITESPACE && d.state !== E.TEXT && $(d, "Unexpected end"), X(d), d.c = "", d.closed = !0, B(d, "onend"), r.call(d, d.strict, d.opt), d;
    }
    function b(d, u) {
      if (typeof d != "object" || !(d instanceof r))
        throw new Error("bad call to strictFail");
      d.strict && $(d, u);
    }
    function D(d) {
      d.strict || (d.tagName = d.tagName[d.looseCase]());
      var u = d.tags[d.tags.length - 1] || d, C = d.tag = { name: d.tagName, attributes: {} };
      d.opt.xmlns && (C.ns = u.ns), d.attribList.length = 0, M(d, "onopentagstart", C);
    }
    function R(d, u) {
      var C = d.indexOf(":"), w = C < 0 ? ["", d] : d.split(":"), z = w[0], ee = w[1];
      return u && d === "xmlns" && (z = "xmlns", ee = ""), { prefix: z, local: ee };
    }
    function k(d) {
      if (d.strict || (d.attribName = d.attribName[d.looseCase]()), d.attribList.indexOf(d.attribName) !== -1 || d.tag.attributes.hasOwnProperty(d.attribName)) {
        d.attribName = d.attribValue = "";
        return;
      }
      if (d.opt.xmlns) {
        var u = R(d.attribName, !0), C = u.prefix, w = u.local;
        if (C === "xmlns")
          if (w === "xml" && d.attribValue !== g)
            b(
              d,
              "xml: prefix must be bound to " + g + `
Actual: ` + d.attribValue
            );
          else if (w === "xmlns" && d.attribValue !== _)
            b(
              d,
              "xmlns: prefix must be bound to " + _ + `
Actual: ` + d.attribValue
            );
          else {
            var z = d.tag, ee = d.tags[d.tags.length - 1] || d;
            z.ns === ee.ns && (z.ns = Object.create(ee.ns)), z.ns[w] = d.attribValue;
          }
        d.attribList.push([d.attribName, d.attribValue]);
      } else
        d.tag.attributes[d.attribName] = d.attribValue, M(d, "onattribute", {
          name: d.attribName,
          value: d.attribValue
        });
      d.attribName = d.attribValue = "";
    }
    function G(d, u) {
      if (d.opt.xmlns) {
        var C = d.tag, w = R(d.tagName);
        C.prefix = w.prefix, C.local = w.local, C.uri = C.ns[w.prefix] || "", C.prefix && !C.uri && (b(d, "Unbound namespace prefix: " + JSON.stringify(d.tagName)), C.uri = w.prefix);
        var z = d.tags[d.tags.length - 1] || d;
        C.ns && z.ns !== C.ns && Object.keys(C.ns).forEach(function(nr) {
          M(d, "onopennamespace", {
            prefix: nr,
            uri: C.ns[nr]
          });
        });
        for (var ee = 0, ie = d.attribList.length; ee < ie; ee++) {
          var me = d.attribList[ee], ve = me[0], it = me[1], ce = R(ve, !0), Be = ce.prefix, yi = ce.local, tr = Be === "" ? "" : C.ns[Be] || "", fn = {
            name: ve,
            value: it,
            prefix: Be,
            local: yi,
            uri: tr
          };
          Be && Be !== "xmlns" && !tr && (b(d, "Unbound namespace prefix: " + JSON.stringify(Be)), fn.uri = Be), d.tag.attributes[ve] = fn, M(d, "onattribute", fn);
        }
        d.attribList.length = 0;
      }
      d.tag.isSelfClosing = !!u, d.sawRoot = !0, d.tags.push(d.tag), M(d, "onopentag", d.tag), u || (!d.noscript && d.tagName.toLowerCase() === "script" ? d.state = E.SCRIPT : d.state = E.TEXT, d.tag = null, d.tagName = ""), d.attribName = d.attribValue = "", d.attribList.length = 0;
    }
    function j(d) {
      if (!d.tagName) {
        b(d, "Weird empty close tag."), d.textNode += "</>", d.state = E.TEXT;
        return;
      }
      if (d.script) {
        if (d.tagName !== "script") {
          d.script += "</" + d.tagName + ">", d.tagName = "", d.state = E.SCRIPT;
          return;
        }
        M(d, "onscript", d.script), d.script = "";
      }
      var u = d.tags.length, C = d.tagName;
      d.strict || (C = C[d.looseCase]());
      for (var w = C; u--; ) {
        var z = d.tags[u];
        if (z.name !== w)
          b(d, "Unexpected close tag");
        else
          break;
      }
      if (u < 0) {
        b(d, "Unmatched closing tag: " + d.tagName), d.textNode += "</" + d.tagName + ">", d.state = E.TEXT;
        return;
      }
      d.tagName = C;
      for (var ee = d.tags.length; ee-- > u; ) {
        var ie = d.tag = d.tags.pop();
        d.tagName = d.tag.name, M(d, "onclosetag", d.tagName);
        var me = {};
        for (var ve in ie.ns)
          me[ve] = ie.ns[ve];
        var it = d.tags[d.tags.length - 1] || d;
        d.opt.xmlns && ie.ns !== it.ns && Object.keys(ie.ns).forEach(function(ce) {
          var Be = ie.ns[ce];
          M(d, "onclosenamespace", { prefix: ce, uri: Be });
        });
      }
      u === 0 && (d.closedRoot = !0), d.tagName = d.attribValue = d.attribName = "", d.attribList.length = 0, d.state = E.TEXT;
    }
    function K(d) {
      var u = d.entity, C = u.toLowerCase(), w, z = "";
      return d.ENTITIES[u] ? d.ENTITIES[u] : d.ENTITIES[C] ? d.ENTITIES[C] : (u = C, u.charAt(0) === "#" && (u.charAt(1) === "x" ? (u = u.slice(2), w = parseInt(u, 16), z = w.toString(16)) : (u = u.slice(1), w = parseInt(u, 10), z = w.toString(10))), u = u.replace(/^0+/, ""), isNaN(w) || z.toLowerCase() !== u ? (b(d, "Invalid character entity"), "&" + d.entity + ";") : String.fromCodePoint(w));
    }
    function fe(d, u) {
      u === "<" ? (d.state = E.OPEN_WAKA, d.startTagPosition = d.position) : x(u) || (b(d, "Non-whitespace before first tag."), d.textNode = u, d.state = E.TEXT);
    }
    function U(d, u) {
      var C = "";
      return u < d.length && (C = d.charAt(u)), C;
    }
    function Ve(d) {
      var u = this;
      if (this.error)
        throw this.error;
      if (u.closed)
        return $(
          u,
          "Cannot write after close. Assign an onready handler."
        );
      if (d === null)
        return P(u);
      typeof d == "object" && (d = d.toString());
      for (var C = 0, w = ""; w = U(d, C++), u.c = w, !!w; )
        switch (u.trackPosition && (u.position++, w === `
` ? (u.line++, u.column = 0) : u.column++), u.state) {
          case E.BEGIN:
            if (u.state = E.BEGIN_WHITESPACE, w === "\uFEFF")
              continue;
            fe(u, w);
            continue;
          case E.BEGIN_WHITESPACE:
            fe(u, w);
            continue;
          case E.TEXT:
            if (u.sawRoot && !u.closedRoot) {
              for (var z = C - 1; w && w !== "<" && w !== "&"; )
                w = U(d, C++), w && u.trackPosition && (u.position++, w === `
` ? (u.line++, u.column = 0) : u.column++);
              u.textNode += d.substring(z, C - 1);
            }
            w === "<" && !(u.sawRoot && u.closedRoot && !u.strict) ? (u.state = E.OPEN_WAKA, u.startTagPosition = u.position) : (!x(w) && (!u.sawRoot || u.closedRoot) && b(u, "Text data outside of root node."), w === "&" ? u.state = E.TEXT_ENTITY : u.textNode += w);
            continue;
          case E.SCRIPT:
            w === "<" ? u.state = E.SCRIPT_ENDING : u.script += w;
            continue;
          case E.SCRIPT_ENDING:
            w === "/" ? u.state = E.CLOSE_TAG : (u.script += "<" + w, u.state = E.SCRIPT);
            continue;
          case E.OPEN_WAKA:
            if (w === "!")
              u.state = E.SGML_DECL, u.sgmlDecl = "";
            else if (!x(w)) if (Y(A, w))
              u.state = E.OPEN_TAG, u.tagName = w;
            else if (w === "/")
              u.state = E.CLOSE_TAG, u.tagName = "";
            else if (w === "?")
              u.state = E.PROC_INST, u.procInstName = u.procInstBody = "";
            else {
              if (b(u, "Unencoded <"), u.startTagPosition + 1 < u.position) {
                var ee = u.position - u.startTagPosition;
                w = new Array(ee).join(" ") + w;
              }
              u.textNode += "<" + w, u.state = E.TEXT;
            }
            continue;
          case E.SGML_DECL:
            if (u.sgmlDecl + w === "--") {
              u.state = E.COMMENT, u.comment = "", u.sgmlDecl = "";
              continue;
            }
            u.doctype && u.doctype !== !0 && u.sgmlDecl ? (u.state = E.DOCTYPE_DTD, u.doctype += "<!" + u.sgmlDecl + w, u.sgmlDecl = "") : (u.sgmlDecl + w).toUpperCase() === f ? (M(u, "onopencdata"), u.state = E.CDATA, u.sgmlDecl = "", u.cdata = "") : (u.sgmlDecl + w).toUpperCase() === h ? (u.state = E.DOCTYPE, (u.doctype || u.sawRoot) && b(
              u,
              "Inappropriately located doctype declaration"
            ), u.doctype = "", u.sgmlDecl = "") : w === ">" ? (M(u, "onsgmldeclaration", u.sgmlDecl), u.sgmlDecl = "", u.state = E.TEXT) : (Z(w) && (u.state = E.SGML_DECL_QUOTED), u.sgmlDecl += w);
            continue;
          case E.SGML_DECL_QUOTED:
            w === u.q && (u.state = E.SGML_DECL, u.q = ""), u.sgmlDecl += w;
            continue;
          case E.DOCTYPE:
            w === ">" ? (u.state = E.TEXT, M(u, "ondoctype", u.doctype), u.doctype = !0) : (u.doctype += w, w === "[" ? u.state = E.DOCTYPE_DTD : Z(w) && (u.state = E.DOCTYPE_QUOTED, u.q = w));
            continue;
          case E.DOCTYPE_QUOTED:
            u.doctype += w, w === u.q && (u.q = "", u.state = E.DOCTYPE);
            continue;
          case E.DOCTYPE_DTD:
            w === "]" ? (u.doctype += w, u.state = E.DOCTYPE) : w === "<" ? (u.state = E.OPEN_WAKA, u.startTagPosition = u.position) : Z(w) ? (u.doctype += w, u.state = E.DOCTYPE_DTD_QUOTED, u.q = w) : u.doctype += w;
            continue;
          case E.DOCTYPE_DTD_QUOTED:
            u.doctype += w, w === u.q && (u.state = E.DOCTYPE_DTD, u.q = "");
            continue;
          case E.COMMENT:
            w === "-" ? u.state = E.COMMENT_ENDING : u.comment += w;
            continue;
          case E.COMMENT_ENDING:
            w === "-" ? (u.state = E.COMMENT_ENDED, u.comment = I(u.opt, u.comment), u.comment && M(u, "oncomment", u.comment), u.comment = "") : (u.comment += "-" + w, u.state = E.COMMENT);
            continue;
          case E.COMMENT_ENDED:
            w !== ">" ? (b(u, "Malformed comment"), u.comment += "--" + w, u.state = E.COMMENT) : u.doctype && u.doctype !== !0 ? u.state = E.DOCTYPE_DTD : u.state = E.TEXT;
            continue;
          case E.CDATA:
            w === "]" ? u.state = E.CDATA_ENDING : u.cdata += w;
            continue;
          case E.CDATA_ENDING:
            w === "]" ? u.state = E.CDATA_ENDING_2 : (u.cdata += "]" + w, u.state = E.CDATA);
            continue;
          case E.CDATA_ENDING_2:
            w === ">" ? (u.cdata && M(u, "oncdata", u.cdata), M(u, "onclosecdata"), u.cdata = "", u.state = E.TEXT) : w === "]" ? u.cdata += "]" : (u.cdata += "]]" + w, u.state = E.CDATA);
            continue;
          case E.PROC_INST:
            w === "?" ? u.state = E.PROC_INST_ENDING : x(w) ? u.state = E.PROC_INST_BODY : u.procInstName += w;
            continue;
          case E.PROC_INST_BODY:
            if (!u.procInstBody && x(w))
              continue;
            w === "?" ? u.state = E.PROC_INST_ENDING : u.procInstBody += w;
            continue;
          case E.PROC_INST_ENDING:
            w === ">" ? (M(u, "onprocessinginstruction", {
              name: u.procInstName,
              body: u.procInstBody
            }), u.procInstName = u.procInstBody = "", u.state = E.TEXT) : (u.procInstBody += "?" + w, u.state = E.PROC_INST_BODY);
            continue;
          case E.OPEN_TAG:
            Y(T, w) ? u.tagName += w : (D(u), w === ">" ? G(u) : w === "/" ? u.state = E.OPEN_TAG_SLASH : (x(w) || b(u, "Invalid character in tag name"), u.state = E.ATTRIB));
            continue;
          case E.OPEN_TAG_SLASH:
            w === ">" ? (G(u, !0), j(u)) : (b(u, "Forward-slash in opening tag not followed by >"), u.state = E.ATTRIB);
            continue;
          case E.ATTRIB:
            if (x(w))
              continue;
            w === ">" ? G(u) : w === "/" ? u.state = E.OPEN_TAG_SLASH : Y(A, w) ? (u.attribName = w, u.attribValue = "", u.state = E.ATTRIB_NAME) : b(u, "Invalid attribute name");
            continue;
          case E.ATTRIB_NAME:
            w === "=" ? u.state = E.ATTRIB_VALUE : w === ">" ? (b(u, "Attribute without value"), u.attribValue = u.attribName, k(u), G(u)) : x(w) ? u.state = E.ATTRIB_NAME_SAW_WHITE : Y(T, w) ? u.attribName += w : b(u, "Invalid attribute name");
            continue;
          case E.ATTRIB_NAME_SAW_WHITE:
            if (w === "=")
              u.state = E.ATTRIB_VALUE;
            else {
              if (x(w))
                continue;
              b(u, "Attribute without value"), u.tag.attributes[u.attribName] = "", u.attribValue = "", M(u, "onattribute", {
                name: u.attribName,
                value: ""
              }), u.attribName = "", w === ">" ? G(u) : Y(A, w) ? (u.attribName = w, u.state = E.ATTRIB_NAME) : (b(u, "Invalid attribute name"), u.state = E.ATTRIB);
            }
            continue;
          case E.ATTRIB_VALUE:
            if (x(w))
              continue;
            Z(w) ? (u.q = w, u.state = E.ATTRIB_VALUE_QUOTED) : (u.opt.unquotedAttributeValues || $(u, "Unquoted attribute value"), u.state = E.ATTRIB_VALUE_UNQUOTED, u.attribValue = w);
            continue;
          case E.ATTRIB_VALUE_QUOTED:
            if (w !== u.q) {
              w === "&" ? u.state = E.ATTRIB_VALUE_ENTITY_Q : u.attribValue += w;
              continue;
            }
            k(u), u.q = "", u.state = E.ATTRIB_VALUE_CLOSED;
            continue;
          case E.ATTRIB_VALUE_CLOSED:
            x(w) ? u.state = E.ATTRIB : w === ">" ? G(u) : w === "/" ? u.state = E.OPEN_TAG_SLASH : Y(A, w) ? (b(u, "No whitespace between attributes"), u.attribName = w, u.attribValue = "", u.state = E.ATTRIB_NAME) : b(u, "Invalid attribute name");
            continue;
          case E.ATTRIB_VALUE_UNQUOTED:
            if (!ae(w)) {
              w === "&" ? u.state = E.ATTRIB_VALUE_ENTITY_U : u.attribValue += w;
              continue;
            }
            k(u), w === ">" ? G(u) : u.state = E.ATTRIB;
            continue;
          case E.CLOSE_TAG:
            if (u.tagName)
              w === ">" ? j(u) : Y(T, w) ? u.tagName += w : u.script ? (u.script += "</" + u.tagName, u.tagName = "", u.state = E.SCRIPT) : (x(w) || b(u, "Invalid tagname in closing tag"), u.state = E.CLOSE_TAG_SAW_WHITE);
            else {
              if (x(w))
                continue;
              Fe(A, w) ? u.script ? (u.script += "</" + w, u.state = E.SCRIPT) : b(u, "Invalid tagname in closing tag.") : u.tagName = w;
            }
            continue;
          case E.CLOSE_TAG_SAW_WHITE:
            if (x(w))
              continue;
            w === ">" ? j(u) : b(u, "Invalid characters in closing tag");
            continue;
          case E.TEXT_ENTITY:
          case E.ATTRIB_VALUE_ENTITY_Q:
          case E.ATTRIB_VALUE_ENTITY_U:
            var ie, me;
            switch (u.state) {
              case E.TEXT_ENTITY:
                ie = E.TEXT, me = "textNode";
                break;
              case E.ATTRIB_VALUE_ENTITY_Q:
                ie = E.ATTRIB_VALUE_QUOTED, me = "attribValue";
                break;
              case E.ATTRIB_VALUE_ENTITY_U:
                ie = E.ATTRIB_VALUE_UNQUOTED, me = "attribValue";
                break;
            }
            if (w === ";") {
              var ve = K(u);
              u.opt.unparsedEntities && !Object.values(t.XML_ENTITIES).includes(ve) ? (u.entity = "", u.state = ie, u.write(ve)) : (u[me] += ve, u.entity = "", u.state = ie);
            } else Y(u.entity.length ? N : S, w) ? u.entity += w : (b(u, "Invalid character in entity name"), u[me] += "&" + u.entity + w, u.entity = "", u.state = ie);
            continue;
          default:
            throw new Error(u, "Unknown state: " + u.state);
        }
      return u.position >= u.bufferCheckPosition && i(u), u;
    }
    /*! http://mths.be/fromcodepoint v0.1.0 by @mathias */
    String.fromCodePoint || function() {
      var d = String.fromCharCode, u = Math.floor, C = function() {
        var w = 16384, z = [], ee, ie, me = -1, ve = arguments.length;
        if (!ve)
          return "";
        for (var it = ""; ++me < ve; ) {
          var ce = Number(arguments[me]);
          if (!isFinite(ce) || // `NaN`, `+Infinity`, or `-Infinity`
          ce < 0 || // not a valid Unicode code point
          ce > 1114111 || // not a valid Unicode code point
          u(ce) !== ce)
            throw RangeError("Invalid code point: " + ce);
          ce <= 65535 ? z.push(ce) : (ce -= 65536, ee = (ce >> 10) + 55296, ie = ce % 1024 + 56320, z.push(ee, ie)), (me + 1 === ve || z.length > w) && (it += d.apply(null, z), z.length = 0);
        }
        return it;
      };
      Object.defineProperty ? Object.defineProperty(String, "fromCodePoint", {
        value: C,
        configurable: !0,
        writable: !0
      }) : String.fromCodePoint = C;
    }();
  })(e);
})(gc);
Object.defineProperty(Yn, "__esModule", { value: !0 });
Yn.XElement = void 0;
Yn.parseXml = Xp;
const Vp = gc, gr = ln;
class Ec {
  constructor(t) {
    if (this.name = t, this.value = "", this.attributes = null, this.isCData = !1, this.elements = null, !t)
      throw (0, gr.newError)("Element name cannot be empty", "ERR_XML_ELEMENT_NAME_EMPTY");
    if (!zp(t))
      throw (0, gr.newError)(`Invalid element name: ${t}`, "ERR_XML_ELEMENT_INVALID_NAME");
  }
  attribute(t) {
    const n = this.attributes === null ? null : this.attributes[t];
    if (n == null)
      throw (0, gr.newError)(`No attribute "${t}"`, "ERR_XML_MISSED_ATTRIBUTE");
    return n;
  }
  removeAttribute(t) {
    this.attributes !== null && delete this.attributes[t];
  }
  element(t, n = !1, r = null) {
    const i = this.elementOrNull(t, n);
    if (i === null)
      throw (0, gr.newError)(r || `No element "${t}"`, "ERR_XML_MISSED_ELEMENT");
    return i;
  }
  elementOrNull(t, n = !1) {
    if (this.elements === null)
      return null;
    for (const r of this.elements)
      if (za(r, t, n))
        return r;
    return null;
  }
  getElements(t, n = !1) {
    return this.elements === null ? [] : this.elements.filter((r) => za(r, t, n));
  }
  elementValueOrEmpty(t, n = !1) {
    const r = this.elementOrNull(t, n);
    return r === null ? "" : r.value;
  }
}
Yn.XElement = Ec;
const Yp = new RegExp(/^[A-Za-z_][:A-Za-z0-9_-]*$/i);
function zp(e) {
  return Yp.test(e);
}
function za(e, t, n) {
  const r = e.name;
  return r === t || n === !0 && r.length === t.length && r.toLowerCase() === t.toLowerCase();
}
function Xp(e) {
  let t = null;
  const n = Vp.parser(!0, {}), r = [];
  return n.onopentag = (i) => {
    const o = new Ec(i.name);
    if (o.attributes = i.attributes, t === null)
      t = o;
    else {
      const a = r[r.length - 1];
      a.elements == null && (a.elements = []), a.elements.push(o);
    }
    r.push(o);
  }, n.onclosetag = () => {
    r.pop();
  }, n.ontext = (i) => {
    r.length > 0 && (r[r.length - 1].value = i);
  }, n.oncdata = (i) => {
    const o = r[r.length - 1];
    o.value = i, o.isCData = !0;
  }, n.onerror = (i) => {
    throw i;
  }, n.write(e), t;
}
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.CURRENT_APP_PACKAGE_FILE_NAME = e.CURRENT_APP_INSTALLER_FILE_NAME = e.XElement = e.parseXml = e.UUID = e.parseDn = e.retry = e.githubUrl = e.getS3LikeProviderBaseUrl = e.ProgressCallbackTransform = e.MemoLazy = e.safeStringifyJson = e.safeGetHeader = e.parseJson = e.HttpExecutor = e.HttpError = e.DigestTransform = e.createHttpError = e.configureRequestUrl = e.configureRequestOptionsFromUrl = e.configureRequestOptions = e.newError = e.CancellationToken = e.CancellationError = void 0, e.asArray = f;
  var t = mt;
  Object.defineProperty(e, "CancellationError", { enumerable: !0, get: function() {
    return t.CancellationError;
  } }), Object.defineProperty(e, "CancellationToken", { enumerable: !0, get: function() {
    return t.CancellationToken;
  } });
  var n = ln;
  Object.defineProperty(e, "newError", { enumerable: !0, get: function() {
    return n.newError;
  } });
  var r = be;
  Object.defineProperty(e, "configureRequestOptions", { enumerable: !0, get: function() {
    return r.configureRequestOptions;
  } }), Object.defineProperty(e, "configureRequestOptionsFromUrl", { enumerable: !0, get: function() {
    return r.configureRequestOptionsFromUrl;
  } }), Object.defineProperty(e, "configureRequestUrl", { enumerable: !0, get: function() {
    return r.configureRequestUrl;
  } }), Object.defineProperty(e, "createHttpError", { enumerable: !0, get: function() {
    return r.createHttpError;
  } }), Object.defineProperty(e, "DigestTransform", { enumerable: !0, get: function() {
    return r.DigestTransform;
  } }), Object.defineProperty(e, "HttpError", { enumerable: !0, get: function() {
    return r.HttpError;
  } }), Object.defineProperty(e, "HttpExecutor", { enumerable: !0, get: function() {
    return r.HttpExecutor;
  } }), Object.defineProperty(e, "parseJson", { enumerable: !0, get: function() {
    return r.parseJson;
  } }), Object.defineProperty(e, "safeGetHeader", { enumerable: !0, get: function() {
    return r.safeGetHeader;
  } }), Object.defineProperty(e, "safeStringifyJson", { enumerable: !0, get: function() {
    return r.safeStringifyJson;
  } });
  var i = ei;
  Object.defineProperty(e, "MemoLazy", { enumerable: !0, get: function() {
    return i.MemoLazy;
  } });
  var o = Vn;
  Object.defineProperty(e, "ProgressCallbackTransform", { enumerable: !0, get: function() {
    return o.ProgressCallbackTransform;
  } });
  var a = ti;
  Object.defineProperty(e, "getS3LikeProviderBaseUrl", { enumerable: !0, get: function() {
    return a.getS3LikeProviderBaseUrl;
  } }), Object.defineProperty(e, "githubUrl", { enumerable: !0, get: function() {
    return a.githubUrl;
  } });
  var s = No;
  Object.defineProperty(e, "retry", { enumerable: !0, get: function() {
    return s.retry;
  } });
  var l = Fo;
  Object.defineProperty(e, "parseDn", { enumerable: !0, get: function() {
    return l.parseDn;
  } });
  var m = rn;
  Object.defineProperty(e, "UUID", { enumerable: !0, get: function() {
    return m.UUID;
  } });
  var c = Yn;
  Object.defineProperty(e, "parseXml", { enumerable: !0, get: function() {
    return c.parseXml;
  } }), Object.defineProperty(e, "XElement", { enumerable: !0, get: function() {
    return c.XElement;
  } }), e.CURRENT_APP_INSTALLER_FILE_NAME = "installer.exe", e.CURRENT_APP_PACKAGE_FILE_NAME = "package.7z";
  function f(h) {
    return h == null ? [] : Array.isArray(h) ? h : [h];
  }
})(pe);
var ye = {}, xo = {}, qe = {};
function yc(e) {
  return typeof e > "u" || e === null;
}
function Kp(e) {
  return typeof e == "object" && e !== null;
}
function Jp(e) {
  return Array.isArray(e) ? e : yc(e) ? [] : [e];
}
function Qp(e, t) {
  var n, r, i, o;
  if (t)
    for (o = Object.keys(t), n = 0, r = o.length; n < r; n += 1)
      i = o[n], e[i] = t[i];
  return e;
}
function Zp(e, t) {
  var n = "", r;
  for (r = 0; r < t; r += 1)
    n += e;
  return n;
}
function em(e) {
  return e === 0 && Number.NEGATIVE_INFINITY === 1 / e;
}
qe.isNothing = yc;
qe.isObject = Kp;
qe.toArray = Jp;
qe.repeat = Zp;
qe.isNegativeZero = em;
qe.extend = Qp;
function vc(e, t) {
  var n = "", r = e.reason || "(unknown reason)";
  return e.mark ? (e.mark.name && (n += 'in "' + e.mark.name + '" '), n += "(" + (e.mark.line + 1) + ":" + (e.mark.column + 1) + ")", !t && e.mark.snippet && (n += `

` + e.mark.snippet), r + " " + n) : r;
}
function Nn(e, t) {
  Error.call(this), this.name = "YAMLException", this.reason = e, this.mark = t, this.message = vc(this, !1), Error.captureStackTrace ? Error.captureStackTrace(this, this.constructor) : this.stack = new Error().stack || "";
}
Nn.prototype = Object.create(Error.prototype);
Nn.prototype.constructor = Nn;
Nn.prototype.toString = function(t) {
  return this.name + ": " + vc(this, t);
};
var zn = Nn, _n = qe;
function Fi(e, t, n, r, i) {
  var o = "", a = "", s = Math.floor(i / 2) - 1;
  return r - t > s && (o = " ... ", t = r - s + o.length), n - r > s && (a = " ...", n = r + s - a.length), {
    str: o + e.slice(t, n).replace(/\t/g, "→") + a,
    pos: r - t + o.length
    // relative position
  };
}
function xi(e, t) {
  return _n.repeat(" ", t - e.length) + e;
}
function tm(e, t) {
  if (t = Object.create(t || null), !e.buffer) return null;
  t.maxLength || (t.maxLength = 79), typeof t.indent != "number" && (t.indent = 1), typeof t.linesBefore != "number" && (t.linesBefore = 3), typeof t.linesAfter != "number" && (t.linesAfter = 2);
  for (var n = /\r?\n|\r|\0/g, r = [0], i = [], o, a = -1; o = n.exec(e.buffer); )
    i.push(o.index), r.push(o.index + o[0].length), e.position <= o.index && a < 0 && (a = r.length - 2);
  a < 0 && (a = r.length - 1);
  var s = "", l, m, c = Math.min(e.line + t.linesAfter, i.length).toString().length, f = t.maxLength - (t.indent + c + 3);
  for (l = 1; l <= t.linesBefore && !(a - l < 0); l++)
    m = Fi(
      e.buffer,
      r[a - l],
      i[a - l],
      e.position - (r[a] - r[a - l]),
      f
    ), s = _n.repeat(" ", t.indent) + xi((e.line - l + 1).toString(), c) + " | " + m.str + `
` + s;
  for (m = Fi(e.buffer, r[a], i[a], e.position, f), s += _n.repeat(" ", t.indent) + xi((e.line + 1).toString(), c) + " | " + m.str + `
`, s += _n.repeat("-", t.indent + c + 3 + m.pos) + `^
`, l = 1; l <= t.linesAfter && !(a + l >= i.length); l++)
    m = Fi(
      e.buffer,
      r[a + l],
      i[a + l],
      e.position - (r[a] - r[a + l]),
      f
    ), s += _n.repeat(" ", t.indent) + xi((e.line + l + 1).toString(), c) + " | " + m.str + `
`;
  return s.replace(/\n$/, "");
}
var nm = tm, Xa = zn, rm = [
  "kind",
  "multi",
  "resolve",
  "construct",
  "instanceOf",
  "predicate",
  "represent",
  "representName",
  "defaultStyle",
  "styleAliases"
], im = [
  "scalar",
  "sequence",
  "mapping"
];
function om(e) {
  var t = {};
  return e !== null && Object.keys(e).forEach(function(n) {
    e[n].forEach(function(r) {
      t[String(r)] = n;
    });
  }), t;
}
function am(e, t) {
  if (t = t || {}, Object.keys(t).forEach(function(n) {
    if (rm.indexOf(n) === -1)
      throw new Xa('Unknown option "' + n + '" is met in definition of "' + e + '" YAML type.');
  }), this.options = t, this.tag = e, this.kind = t.kind || null, this.resolve = t.resolve || function() {
    return !0;
  }, this.construct = t.construct || function(n) {
    return n;
  }, this.instanceOf = t.instanceOf || null, this.predicate = t.predicate || null, this.represent = t.represent || null, this.representName = t.representName || null, this.defaultStyle = t.defaultStyle || null, this.multi = t.multi || !1, this.styleAliases = om(t.styleAliases || null), im.indexOf(this.kind) === -1)
    throw new Xa('Unknown kind "' + this.kind + '" is specified for "' + e + '" YAML type.');
}
var Re = am, En = zn, Li = Re;
function Ka(e, t) {
  var n = [];
  return e[t].forEach(function(r) {
    var i = n.length;
    n.forEach(function(o, a) {
      o.tag === r.tag && o.kind === r.kind && o.multi === r.multi && (i = a);
    }), n[i] = r;
  }), n;
}
function sm() {
  var e = {
    scalar: {},
    sequence: {},
    mapping: {},
    fallback: {},
    multi: {
      scalar: [],
      sequence: [],
      mapping: [],
      fallback: []
    }
  }, t, n;
  function r(i) {
    i.multi ? (e.multi[i.kind].push(i), e.multi.fallback.push(i)) : e[i.kind][i.tag] = e.fallback[i.tag] = i;
  }
  for (t = 0, n = arguments.length; t < n; t += 1)
    arguments[t].forEach(r);
  return e;
}
function uo(e) {
  return this.extend(e);
}
uo.prototype.extend = function(t) {
  var n = [], r = [];
  if (t instanceof Li)
    r.push(t);
  else if (Array.isArray(t))
    r = r.concat(t);
  else if (t && (Array.isArray(t.implicit) || Array.isArray(t.explicit)))
    t.implicit && (n = n.concat(t.implicit)), t.explicit && (r = r.concat(t.explicit));
  else
    throw new En("Schema.extend argument should be a Type, [ Type ], or a schema definition ({ implicit: [...], explicit: [...] })");
  n.forEach(function(o) {
    if (!(o instanceof Li))
      throw new En("Specified list of YAML types (or a single Type object) contains a non-Type object.");
    if (o.loadKind && o.loadKind !== "scalar")
      throw new En("There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported.");
    if (o.multi)
      throw new En("There is a multi type in the implicit list of a schema. Multi tags can only be listed as explicit.");
  }), r.forEach(function(o) {
    if (!(o instanceof Li))
      throw new En("Specified list of YAML types (or a single Type object) contains a non-Type object.");
  });
  var i = Object.create(uo.prototype);
  return i.implicit = (this.implicit || []).concat(n), i.explicit = (this.explicit || []).concat(r), i.compiledImplicit = Ka(i, "implicit"), i.compiledExplicit = Ka(i, "explicit"), i.compiledTypeMap = sm(i.compiledImplicit, i.compiledExplicit), i;
};
var wc = uo, lm = Re, _c = new lm("tag:yaml.org,2002:str", {
  kind: "scalar",
  construct: function(e) {
    return e !== null ? e : "";
  }
}), cm = Re, Ac = new cm("tag:yaml.org,2002:seq", {
  kind: "sequence",
  construct: function(e) {
    return e !== null ? e : [];
  }
}), um = Re, Sc = new um("tag:yaml.org,2002:map", {
  kind: "mapping",
  construct: function(e) {
    return e !== null ? e : {};
  }
}), fm = wc, Tc = new fm({
  explicit: [
    _c,
    Ac,
    Sc
  ]
}), dm = Re;
function hm(e) {
  if (e === null) return !0;
  var t = e.length;
  return t === 1 && e === "~" || t === 4 && (e === "null" || e === "Null" || e === "NULL");
}
function pm() {
  return null;
}
function mm(e) {
  return e === null;
}
var Cc = new dm("tag:yaml.org,2002:null", {
  kind: "scalar",
  resolve: hm,
  construct: pm,
  predicate: mm,
  represent: {
    canonical: function() {
      return "~";
    },
    lowercase: function() {
      return "null";
    },
    uppercase: function() {
      return "NULL";
    },
    camelcase: function() {
      return "Null";
    },
    empty: function() {
      return "";
    }
  },
  defaultStyle: "lowercase"
}), gm = Re;
function Em(e) {
  if (e === null) return !1;
  var t = e.length;
  return t === 4 && (e === "true" || e === "True" || e === "TRUE") || t === 5 && (e === "false" || e === "False" || e === "FALSE");
}
function ym(e) {
  return e === "true" || e === "True" || e === "TRUE";
}
function vm(e) {
  return Object.prototype.toString.call(e) === "[object Boolean]";
}
var bc = new gm("tag:yaml.org,2002:bool", {
  kind: "scalar",
  resolve: Em,
  construct: ym,
  predicate: vm,
  represent: {
    lowercase: function(e) {
      return e ? "true" : "false";
    },
    uppercase: function(e) {
      return e ? "TRUE" : "FALSE";
    },
    camelcase: function(e) {
      return e ? "True" : "False";
    }
  },
  defaultStyle: "lowercase"
}), wm = qe, _m = Re;
function Am(e) {
  return 48 <= e && e <= 57 || 65 <= e && e <= 70 || 97 <= e && e <= 102;
}
function Sm(e) {
  return 48 <= e && e <= 55;
}
function Tm(e) {
  return 48 <= e && e <= 57;
}
function Cm(e) {
  if (e === null) return !1;
  var t = e.length, n = 0, r = !1, i;
  if (!t) return !1;
  if (i = e[n], (i === "-" || i === "+") && (i = e[++n]), i === "0") {
    if (n + 1 === t) return !0;
    if (i = e[++n], i === "b") {
      for (n++; n < t; n++)
        if (i = e[n], i !== "_") {
          if (i !== "0" && i !== "1") return !1;
          r = !0;
        }
      return r && i !== "_";
    }
    if (i === "x") {
      for (n++; n < t; n++)
        if (i = e[n], i !== "_") {
          if (!Am(e.charCodeAt(n))) return !1;
          r = !0;
        }
      return r && i !== "_";
    }
    if (i === "o") {
      for (n++; n < t; n++)
        if (i = e[n], i !== "_") {
          if (!Sm(e.charCodeAt(n))) return !1;
          r = !0;
        }
      return r && i !== "_";
    }
  }
  if (i === "_") return !1;
  for (; n < t; n++)
    if (i = e[n], i !== "_") {
      if (!Tm(e.charCodeAt(n)))
        return !1;
      r = !0;
    }
  return !(!r || i === "_");
}
function bm(e) {
  var t = e, n = 1, r;
  if (t.indexOf("_") !== -1 && (t = t.replace(/_/g, "")), r = t[0], (r === "-" || r === "+") && (r === "-" && (n = -1), t = t.slice(1), r = t[0]), t === "0") return 0;
  if (r === "0") {
    if (t[1] === "b") return n * parseInt(t.slice(2), 2);
    if (t[1] === "x") return n * parseInt(t.slice(2), 16);
    if (t[1] === "o") return n * parseInt(t.slice(2), 8);
  }
  return n * parseInt(t, 10);
}
function $m(e) {
  return Object.prototype.toString.call(e) === "[object Number]" && e % 1 === 0 && !wm.isNegativeZero(e);
}
var $c = new _m("tag:yaml.org,2002:int", {
  kind: "scalar",
  resolve: Cm,
  construct: bm,
  predicate: $m,
  represent: {
    binary: function(e) {
      return e >= 0 ? "0b" + e.toString(2) : "-0b" + e.toString(2).slice(1);
    },
    octal: function(e) {
      return e >= 0 ? "0o" + e.toString(8) : "-0o" + e.toString(8).slice(1);
    },
    decimal: function(e) {
      return e.toString(10);
    },
    /* eslint-disable max-len */
    hexadecimal: function(e) {
      return e >= 0 ? "0x" + e.toString(16).toUpperCase() : "-0x" + e.toString(16).toUpperCase().slice(1);
    }
  },
  defaultStyle: "decimal",
  styleAliases: {
    binary: [2, "bin"],
    octal: [8, "oct"],
    decimal: [10, "dec"],
    hexadecimal: [16, "hex"]
  }
}), Oc = qe, Om = Re, Im = new RegExp(
  // 2.5e4, 2.5 and integers
  "^(?:[-+]?(?:[0-9][0-9_]*)(?:\\.[0-9_]*)?(?:[eE][-+]?[0-9]+)?|\\.[0-9_]+(?:[eE][-+]?[0-9]+)?|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$"
);
function Rm(e) {
  return !(e === null || !Im.test(e) || // Quick hack to not allow integers end with `_`
  // Probably should update regexp & check speed
  e[e.length - 1] === "_");
}
function Pm(e) {
  var t, n;
  return t = e.replace(/_/g, "").toLowerCase(), n = t[0] === "-" ? -1 : 1, "+-".indexOf(t[0]) >= 0 && (t = t.slice(1)), t === ".inf" ? n === 1 ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY : t === ".nan" ? NaN : n * parseFloat(t, 10);
}
var Dm = /^[-+]?[0-9]+e/;
function Nm(e, t) {
  var n;
  if (isNaN(e))
    switch (t) {
      case "lowercase":
        return ".nan";
      case "uppercase":
        return ".NAN";
      case "camelcase":
        return ".NaN";
    }
  else if (Number.POSITIVE_INFINITY === e)
    switch (t) {
      case "lowercase":
        return ".inf";
      case "uppercase":
        return ".INF";
      case "camelcase":
        return ".Inf";
    }
  else if (Number.NEGATIVE_INFINITY === e)
    switch (t) {
      case "lowercase":
        return "-.inf";
      case "uppercase":
        return "-.INF";
      case "camelcase":
        return "-.Inf";
    }
  else if (Oc.isNegativeZero(e))
    return "-0.0";
  return n = e.toString(10), Dm.test(n) ? n.replace("e", ".e") : n;
}
function Fm(e) {
  return Object.prototype.toString.call(e) === "[object Number]" && (e % 1 !== 0 || Oc.isNegativeZero(e));
}
var Ic = new Om("tag:yaml.org,2002:float", {
  kind: "scalar",
  resolve: Rm,
  construct: Pm,
  predicate: Fm,
  represent: Nm,
  defaultStyle: "lowercase"
}), Rc = Tc.extend({
  implicit: [
    Cc,
    bc,
    $c,
    Ic
  ]
}), Pc = Rc, xm = Re, Dc = new RegExp(
  "^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$"
), Nc = new RegExp(
  "^([0-9][0-9][0-9][0-9])-([0-9][0-9]?)-([0-9][0-9]?)(?:[Tt]|[ \\t]+)([0-9][0-9]?):([0-9][0-9]):([0-9][0-9])(?:\\.([0-9]*))?(?:[ \\t]*(Z|([-+])([0-9][0-9]?)(?::([0-9][0-9]))?))?$"
);
function Lm(e) {
  return e === null ? !1 : Dc.exec(e) !== null || Nc.exec(e) !== null;
}
function Um(e) {
  var t, n, r, i, o, a, s, l = 0, m = null, c, f, h;
  if (t = Dc.exec(e), t === null && (t = Nc.exec(e)), t === null) throw new Error("Date resolve error");
  if (n = +t[1], r = +t[2] - 1, i = +t[3], !t[4])
    return new Date(Date.UTC(n, r, i));
  if (o = +t[4], a = +t[5], s = +t[6], t[7]) {
    for (l = t[7].slice(0, 3); l.length < 3; )
      l += "0";
    l = +l;
  }
  return t[9] && (c = +t[10], f = +(t[11] || 0), m = (c * 60 + f) * 6e4, t[9] === "-" && (m = -m)), h = new Date(Date.UTC(n, r, i, o, a, s, l)), m && h.setTime(h.getTime() - m), h;
}
function km(e) {
  return e.toISOString();
}
var Fc = new xm("tag:yaml.org,2002:timestamp", {
  kind: "scalar",
  resolve: Lm,
  construct: Um,
  instanceOf: Date,
  represent: km
}), Mm = Re;
function Bm(e) {
  return e === "<<" || e === null;
}
var xc = new Mm("tag:yaml.org,2002:merge", {
  kind: "scalar",
  resolve: Bm
}), jm = Re, Lo = `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=
\r`;
function Hm(e) {
  if (e === null) return !1;
  var t, n, r = 0, i = e.length, o = Lo;
  for (n = 0; n < i; n++)
    if (t = o.indexOf(e.charAt(n)), !(t > 64)) {
      if (t < 0) return !1;
      r += 6;
    }
  return r % 8 === 0;
}
function qm(e) {
  var t, n, r = e.replace(/[\r\n=]/g, ""), i = r.length, o = Lo, a = 0, s = [];
  for (t = 0; t < i; t++)
    t % 4 === 0 && t && (s.push(a >> 16 & 255), s.push(a >> 8 & 255), s.push(a & 255)), a = a << 6 | o.indexOf(r.charAt(t));
  return n = i % 4 * 6, n === 0 ? (s.push(a >> 16 & 255), s.push(a >> 8 & 255), s.push(a & 255)) : n === 18 ? (s.push(a >> 10 & 255), s.push(a >> 2 & 255)) : n === 12 && s.push(a >> 4 & 255), new Uint8Array(s);
}
function Gm(e) {
  var t = "", n = 0, r, i, o = e.length, a = Lo;
  for (r = 0; r < o; r++)
    r % 3 === 0 && r && (t += a[n >> 18 & 63], t += a[n >> 12 & 63], t += a[n >> 6 & 63], t += a[n & 63]), n = (n << 8) + e[r];
  return i = o % 3, i === 0 ? (t += a[n >> 18 & 63], t += a[n >> 12 & 63], t += a[n >> 6 & 63], t += a[n & 63]) : i === 2 ? (t += a[n >> 10 & 63], t += a[n >> 4 & 63], t += a[n << 2 & 63], t += a[64]) : i === 1 && (t += a[n >> 2 & 63], t += a[n << 4 & 63], t += a[64], t += a[64]), t;
}
function Wm(e) {
  return Object.prototype.toString.call(e) === "[object Uint8Array]";
}
var Lc = new jm("tag:yaml.org,2002:binary", {
  kind: "scalar",
  resolve: Hm,
  construct: qm,
  predicate: Wm,
  represent: Gm
}), Vm = Re, Ym = Object.prototype.hasOwnProperty, zm = Object.prototype.toString;
function Xm(e) {
  if (e === null) return !0;
  var t = [], n, r, i, o, a, s = e;
  for (n = 0, r = s.length; n < r; n += 1) {
    if (i = s[n], a = !1, zm.call(i) !== "[object Object]") return !1;
    for (o in i)
      if (Ym.call(i, o))
        if (!a) a = !0;
        else return !1;
    if (!a) return !1;
    if (t.indexOf(o) === -1) t.push(o);
    else return !1;
  }
  return !0;
}
function Km(e) {
  return e !== null ? e : [];
}
var Uc = new Vm("tag:yaml.org,2002:omap", {
  kind: "sequence",
  resolve: Xm,
  construct: Km
}), Jm = Re, Qm = Object.prototype.toString;
function Zm(e) {
  if (e === null) return !0;
  var t, n, r, i, o, a = e;
  for (o = new Array(a.length), t = 0, n = a.length; t < n; t += 1) {
    if (r = a[t], Qm.call(r) !== "[object Object]" || (i = Object.keys(r), i.length !== 1)) return !1;
    o[t] = [i[0], r[i[0]]];
  }
  return !0;
}
function eg(e) {
  if (e === null) return [];
  var t, n, r, i, o, a = e;
  for (o = new Array(a.length), t = 0, n = a.length; t < n; t += 1)
    r = a[t], i = Object.keys(r), o[t] = [i[0], r[i[0]]];
  return o;
}
var kc = new Jm("tag:yaml.org,2002:pairs", {
  kind: "sequence",
  resolve: Zm,
  construct: eg
}), tg = Re, ng = Object.prototype.hasOwnProperty;
function rg(e) {
  if (e === null) return !0;
  var t, n = e;
  for (t in n)
    if (ng.call(n, t) && n[t] !== null)
      return !1;
  return !0;
}
function ig(e) {
  return e !== null ? e : {};
}
var Mc = new tg("tag:yaml.org,2002:set", {
  kind: "mapping",
  resolve: rg,
  construct: ig
}), Uo = Pc.extend({
  implicit: [
    Fc,
    xc
  ],
  explicit: [
    Lc,
    Uc,
    kc,
    Mc
  ]
}), Rt = qe, Bc = zn, og = nm, ag = Uo, gt = Object.prototype.hasOwnProperty, Br = 1, jc = 2, Hc = 3, jr = 4, Ui = 1, sg = 2, Ja = 3, lg = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/, cg = /[\x85\u2028\u2029]/, ug = /[,\[\]\{\}]/, qc = /^(?:!|!!|![a-z\-]+!)$/i, Gc = /^(?:!|[^,\[\]\{\}])(?:%[0-9a-f]{2}|[0-9a-z\-#;\/\?:@&=\+\$,_\.!~\*'\(\)\[\]])*$/i;
function Qa(e) {
  return Object.prototype.toString.call(e);
}
function Xe(e) {
  return e === 10 || e === 13;
}
function Nt(e) {
  return e === 9 || e === 32;
}
function Ne(e) {
  return e === 9 || e === 32 || e === 10 || e === 13;
}
function Yt(e) {
  return e === 44 || e === 91 || e === 93 || e === 123 || e === 125;
}
function fg(e) {
  var t;
  return 48 <= e && e <= 57 ? e - 48 : (t = e | 32, 97 <= t && t <= 102 ? t - 97 + 10 : -1);
}
function dg(e) {
  return e === 120 ? 2 : e === 117 ? 4 : e === 85 ? 8 : 0;
}
function hg(e) {
  return 48 <= e && e <= 57 ? e - 48 : -1;
}
function Za(e) {
  return e === 48 ? "\0" : e === 97 ? "\x07" : e === 98 ? "\b" : e === 116 || e === 9 ? "	" : e === 110 ? `
` : e === 118 ? "\v" : e === 102 ? "\f" : e === 114 ? "\r" : e === 101 ? "\x1B" : e === 32 ? " " : e === 34 ? '"' : e === 47 ? "/" : e === 92 ? "\\" : e === 78 ? "" : e === 95 ? " " : e === 76 ? "\u2028" : e === 80 ? "\u2029" : "";
}
function pg(e) {
  return e <= 65535 ? String.fromCharCode(e) : String.fromCharCode(
    (e - 65536 >> 10) + 55296,
    (e - 65536 & 1023) + 56320
  );
}
var Wc = new Array(256), Vc = new Array(256);
for (var jt = 0; jt < 256; jt++)
  Wc[jt] = Za(jt) ? 1 : 0, Vc[jt] = Za(jt);
function mg(e, t) {
  this.input = e, this.filename = t.filename || null, this.schema = t.schema || ag, this.onWarning = t.onWarning || null, this.legacy = t.legacy || !1, this.json = t.json || !1, this.listener = t.listener || null, this.implicitTypes = this.schema.compiledImplicit, this.typeMap = this.schema.compiledTypeMap, this.length = e.length, this.position = 0, this.line = 0, this.lineStart = 0, this.lineIndent = 0, this.firstTabInLine = -1, this.documents = [];
}
function Yc(e, t) {
  var n = {
    name: e.filename,
    buffer: e.input.slice(0, -1),
    // omit trailing \0
    position: e.position,
    line: e.line,
    column: e.position - e.lineStart
  };
  return n.snippet = og(n), new Bc(t, n);
}
function L(e, t) {
  throw Yc(e, t);
}
function Hr(e, t) {
  e.onWarning && e.onWarning.call(null, Yc(e, t));
}
var es = {
  YAML: function(t, n, r) {
    var i, o, a;
    t.version !== null && L(t, "duplication of %YAML directive"), r.length !== 1 && L(t, "YAML directive accepts exactly one argument"), i = /^([0-9]+)\.([0-9]+)$/.exec(r[0]), i === null && L(t, "ill-formed argument of the YAML directive"), o = parseInt(i[1], 10), a = parseInt(i[2], 10), o !== 1 && L(t, "unacceptable YAML version of the document"), t.version = r[0], t.checkLineBreaks = a < 2, a !== 1 && a !== 2 && Hr(t, "unsupported YAML version of the document");
  },
  TAG: function(t, n, r) {
    var i, o;
    r.length !== 2 && L(t, "TAG directive accepts exactly two arguments"), i = r[0], o = r[1], qc.test(i) || L(t, "ill-formed tag handle (first argument) of the TAG directive"), gt.call(t.tagMap, i) && L(t, 'there is a previously declared suffix for "' + i + '" tag handle'), Gc.test(o) || L(t, "ill-formed tag prefix (second argument) of the TAG directive");
    try {
      o = decodeURIComponent(o);
    } catch {
      L(t, "tag prefix is malformed: " + o);
    }
    t.tagMap[i] = o;
  }
};
function ht(e, t, n, r) {
  var i, o, a, s;
  if (t < n) {
    if (s = e.input.slice(t, n), r)
      for (i = 0, o = s.length; i < o; i += 1)
        a = s.charCodeAt(i), a === 9 || 32 <= a && a <= 1114111 || L(e, "expected valid JSON character");
    else lg.test(s) && L(e, "the stream contains non-printable characters");
    e.result += s;
  }
}
function ts(e, t, n, r) {
  var i, o, a, s;
  for (Rt.isObject(n) || L(e, "cannot merge mappings; the provided source object is unacceptable"), i = Object.keys(n), a = 0, s = i.length; a < s; a += 1)
    o = i[a], gt.call(t, o) || (t[o] = n[o], r[o] = !0);
}
function zt(e, t, n, r, i, o, a, s, l) {
  var m, c;
  if (Array.isArray(i))
    for (i = Array.prototype.slice.call(i), m = 0, c = i.length; m < c; m += 1)
      Array.isArray(i[m]) && L(e, "nested arrays are not supported inside keys"), typeof i == "object" && Qa(i[m]) === "[object Object]" && (i[m] = "[object Object]");
  if (typeof i == "object" && Qa(i) === "[object Object]" && (i = "[object Object]"), i = String(i), t === null && (t = {}), r === "tag:yaml.org,2002:merge")
    if (Array.isArray(o))
      for (m = 0, c = o.length; m < c; m += 1)
        ts(e, t, o[m], n);
    else
      ts(e, t, o, n);
  else
    !e.json && !gt.call(n, i) && gt.call(t, i) && (e.line = a || e.line, e.lineStart = s || e.lineStart, e.position = l || e.position, L(e, "duplicated mapping key")), i === "__proto__" ? Object.defineProperty(t, i, {
      configurable: !0,
      enumerable: !0,
      writable: !0,
      value: o
    }) : t[i] = o, delete n[i];
  return t;
}
function ko(e) {
  var t;
  t = e.input.charCodeAt(e.position), t === 10 ? e.position++ : t === 13 ? (e.position++, e.input.charCodeAt(e.position) === 10 && e.position++) : L(e, "a line break is expected"), e.line += 1, e.lineStart = e.position, e.firstTabInLine = -1;
}
function le(e, t, n) {
  for (var r = 0, i = e.input.charCodeAt(e.position); i !== 0; ) {
    for (; Nt(i); )
      i === 9 && e.firstTabInLine === -1 && (e.firstTabInLine = e.position), i = e.input.charCodeAt(++e.position);
    if (t && i === 35)
      do
        i = e.input.charCodeAt(++e.position);
      while (i !== 10 && i !== 13 && i !== 0);
    if (Xe(i))
      for (ko(e), i = e.input.charCodeAt(e.position), r++, e.lineIndent = 0; i === 32; )
        e.lineIndent++, i = e.input.charCodeAt(++e.position);
    else
      break;
  }
  return n !== -1 && r !== 0 && e.lineIndent < n && Hr(e, "deficient indentation"), r;
}
function ni(e) {
  var t = e.position, n;
  return n = e.input.charCodeAt(t), !!((n === 45 || n === 46) && n === e.input.charCodeAt(t + 1) && n === e.input.charCodeAt(t + 2) && (t += 3, n = e.input.charCodeAt(t), n === 0 || Ne(n)));
}
function Mo(e, t) {
  t === 1 ? e.result += " " : t > 1 && (e.result += Rt.repeat(`
`, t - 1));
}
function gg(e, t, n) {
  var r, i, o, a, s, l, m, c, f = e.kind, h = e.result, g;
  if (g = e.input.charCodeAt(e.position), Ne(g) || Yt(g) || g === 35 || g === 38 || g === 42 || g === 33 || g === 124 || g === 62 || g === 39 || g === 34 || g === 37 || g === 64 || g === 96 || (g === 63 || g === 45) && (i = e.input.charCodeAt(e.position + 1), Ne(i) || n && Yt(i)))
    return !1;
  for (e.kind = "scalar", e.result = "", o = a = e.position, s = !1; g !== 0; ) {
    if (g === 58) {
      if (i = e.input.charCodeAt(e.position + 1), Ne(i) || n && Yt(i))
        break;
    } else if (g === 35) {
      if (r = e.input.charCodeAt(e.position - 1), Ne(r))
        break;
    } else {
      if (e.position === e.lineStart && ni(e) || n && Yt(g))
        break;
      if (Xe(g))
        if (l = e.line, m = e.lineStart, c = e.lineIndent, le(e, !1, -1), e.lineIndent >= t) {
          s = !0, g = e.input.charCodeAt(e.position);
          continue;
        } else {
          e.position = a, e.line = l, e.lineStart = m, e.lineIndent = c;
          break;
        }
    }
    s && (ht(e, o, a, !1), Mo(e, e.line - l), o = a = e.position, s = !1), Nt(g) || (a = e.position + 1), g = e.input.charCodeAt(++e.position);
  }
  return ht(e, o, a, !1), e.result ? !0 : (e.kind = f, e.result = h, !1);
}
function Eg(e, t) {
  var n, r, i;
  if (n = e.input.charCodeAt(e.position), n !== 39)
    return !1;
  for (e.kind = "scalar", e.result = "", e.position++, r = i = e.position; (n = e.input.charCodeAt(e.position)) !== 0; )
    if (n === 39)
      if (ht(e, r, e.position, !0), n = e.input.charCodeAt(++e.position), n === 39)
        r = e.position, e.position++, i = e.position;
      else
        return !0;
    else Xe(n) ? (ht(e, r, i, !0), Mo(e, le(e, !1, t)), r = i = e.position) : e.position === e.lineStart && ni(e) ? L(e, "unexpected end of the document within a single quoted scalar") : (e.position++, i = e.position);
  L(e, "unexpected end of the stream within a single quoted scalar");
}
function yg(e, t) {
  var n, r, i, o, a, s;
  if (s = e.input.charCodeAt(e.position), s !== 34)
    return !1;
  for (e.kind = "scalar", e.result = "", e.position++, n = r = e.position; (s = e.input.charCodeAt(e.position)) !== 0; ) {
    if (s === 34)
      return ht(e, n, e.position, !0), e.position++, !0;
    if (s === 92) {
      if (ht(e, n, e.position, !0), s = e.input.charCodeAt(++e.position), Xe(s))
        le(e, !1, t);
      else if (s < 256 && Wc[s])
        e.result += Vc[s], e.position++;
      else if ((a = dg(s)) > 0) {
        for (i = a, o = 0; i > 0; i--)
          s = e.input.charCodeAt(++e.position), (a = fg(s)) >= 0 ? o = (o << 4) + a : L(e, "expected hexadecimal character");
        e.result += pg(o), e.position++;
      } else
        L(e, "unknown escape sequence");
      n = r = e.position;
    } else Xe(s) ? (ht(e, n, r, !0), Mo(e, le(e, !1, t)), n = r = e.position) : e.position === e.lineStart && ni(e) ? L(e, "unexpected end of the document within a double quoted scalar") : (e.position++, r = e.position);
  }
  L(e, "unexpected end of the stream within a double quoted scalar");
}
function vg(e, t) {
  var n = !0, r, i, o, a = e.tag, s, l = e.anchor, m, c, f, h, g, _ = /* @__PURE__ */ Object.create(null), y, A, T, S;
  if (S = e.input.charCodeAt(e.position), S === 91)
    c = 93, g = !1, s = [];
  else if (S === 123)
    c = 125, g = !0, s = {};
  else
    return !1;
  for (e.anchor !== null && (e.anchorMap[e.anchor] = s), S = e.input.charCodeAt(++e.position); S !== 0; ) {
    if (le(e, !0, t), S = e.input.charCodeAt(e.position), S === c)
      return e.position++, e.tag = a, e.anchor = l, e.kind = g ? "mapping" : "sequence", e.result = s, !0;
    n ? S === 44 && L(e, "expected the node content, but found ','") : L(e, "missed comma between flow collection entries"), A = y = T = null, f = h = !1, S === 63 && (m = e.input.charCodeAt(e.position + 1), Ne(m) && (f = h = !0, e.position++, le(e, !0, t))), r = e.line, i = e.lineStart, o = e.position, on(e, t, Br, !1, !0), A = e.tag, y = e.result, le(e, !0, t), S = e.input.charCodeAt(e.position), (h || e.line === r) && S === 58 && (f = !0, S = e.input.charCodeAt(++e.position), le(e, !0, t), on(e, t, Br, !1, !0), T = e.result), g ? zt(e, s, _, A, y, T, r, i, o) : f ? s.push(zt(e, null, _, A, y, T, r, i, o)) : s.push(y), le(e, !0, t), S = e.input.charCodeAt(e.position), S === 44 ? (n = !0, S = e.input.charCodeAt(++e.position)) : n = !1;
  }
  L(e, "unexpected end of the stream within a flow collection");
}
function wg(e, t) {
  var n, r, i = Ui, o = !1, a = !1, s = t, l = 0, m = !1, c, f;
  if (f = e.input.charCodeAt(e.position), f === 124)
    r = !1;
  else if (f === 62)
    r = !0;
  else
    return !1;
  for (e.kind = "scalar", e.result = ""; f !== 0; )
    if (f = e.input.charCodeAt(++e.position), f === 43 || f === 45)
      Ui === i ? i = f === 43 ? Ja : sg : L(e, "repeat of a chomping mode identifier");
    else if ((c = hg(f)) >= 0)
      c === 0 ? L(e, "bad explicit indentation width of a block scalar; it cannot be less than one") : a ? L(e, "repeat of an indentation width identifier") : (s = t + c - 1, a = !0);
    else
      break;
  if (Nt(f)) {
    do
      f = e.input.charCodeAt(++e.position);
    while (Nt(f));
    if (f === 35)
      do
        f = e.input.charCodeAt(++e.position);
      while (!Xe(f) && f !== 0);
  }
  for (; f !== 0; ) {
    for (ko(e), e.lineIndent = 0, f = e.input.charCodeAt(e.position); (!a || e.lineIndent < s) && f === 32; )
      e.lineIndent++, f = e.input.charCodeAt(++e.position);
    if (!a && e.lineIndent > s && (s = e.lineIndent), Xe(f)) {
      l++;
      continue;
    }
    if (e.lineIndent < s) {
      i === Ja ? e.result += Rt.repeat(`
`, o ? 1 + l : l) : i === Ui && o && (e.result += `
`);
      break;
    }
    for (r ? Nt(f) ? (m = !0, e.result += Rt.repeat(`
`, o ? 1 + l : l)) : m ? (m = !1, e.result += Rt.repeat(`
`, l + 1)) : l === 0 ? o && (e.result += " ") : e.result += Rt.repeat(`
`, l) : e.result += Rt.repeat(`
`, o ? 1 + l : l), o = !0, a = !0, l = 0, n = e.position; !Xe(f) && f !== 0; )
      f = e.input.charCodeAt(++e.position);
    ht(e, n, e.position, !1);
  }
  return !0;
}
function ns(e, t) {
  var n, r = e.tag, i = e.anchor, o = [], a, s = !1, l;
  if (e.firstTabInLine !== -1) return !1;
  for (e.anchor !== null && (e.anchorMap[e.anchor] = o), l = e.input.charCodeAt(e.position); l !== 0 && (e.firstTabInLine !== -1 && (e.position = e.firstTabInLine, L(e, "tab characters must not be used in indentation")), !(l !== 45 || (a = e.input.charCodeAt(e.position + 1), !Ne(a)))); ) {
    if (s = !0, e.position++, le(e, !0, -1) && e.lineIndent <= t) {
      o.push(null), l = e.input.charCodeAt(e.position);
      continue;
    }
    if (n = e.line, on(e, t, Hc, !1, !0), o.push(e.result), le(e, !0, -1), l = e.input.charCodeAt(e.position), (e.line === n || e.lineIndent > t) && l !== 0)
      L(e, "bad indentation of a sequence entry");
    else if (e.lineIndent < t)
      break;
  }
  return s ? (e.tag = r, e.anchor = i, e.kind = "sequence", e.result = o, !0) : !1;
}
function _g(e, t, n) {
  var r, i, o, a, s, l, m = e.tag, c = e.anchor, f = {}, h = /* @__PURE__ */ Object.create(null), g = null, _ = null, y = null, A = !1, T = !1, S;
  if (e.firstTabInLine !== -1) return !1;
  for (e.anchor !== null && (e.anchorMap[e.anchor] = f), S = e.input.charCodeAt(e.position); S !== 0; ) {
    if (!A && e.firstTabInLine !== -1 && (e.position = e.firstTabInLine, L(e, "tab characters must not be used in indentation")), r = e.input.charCodeAt(e.position + 1), o = e.line, (S === 63 || S === 58) && Ne(r))
      S === 63 ? (A && (zt(e, f, h, g, _, null, a, s, l), g = _ = y = null), T = !0, A = !0, i = !0) : A ? (A = !1, i = !0) : L(e, "incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulated empty line"), e.position += 1, S = r;
    else {
      if (a = e.line, s = e.lineStart, l = e.position, !on(e, n, jc, !1, !0))
        break;
      if (e.line === o) {
        for (S = e.input.charCodeAt(e.position); Nt(S); )
          S = e.input.charCodeAt(++e.position);
        if (S === 58)
          S = e.input.charCodeAt(++e.position), Ne(S) || L(e, "a whitespace character is expected after the key-value separator within a block mapping"), A && (zt(e, f, h, g, _, null, a, s, l), g = _ = y = null), T = !0, A = !1, i = !1, g = e.tag, _ = e.result;
        else if (T)
          L(e, "can not read an implicit mapping pair; a colon is missed");
        else
          return e.tag = m, e.anchor = c, !0;
      } else if (T)
        L(e, "can not read a block mapping entry; a multiline key may not be an implicit key");
      else
        return e.tag = m, e.anchor = c, !0;
    }
    if ((e.line === o || e.lineIndent > t) && (A && (a = e.line, s = e.lineStart, l = e.position), on(e, t, jr, !0, i) && (A ? _ = e.result : y = e.result), A || (zt(e, f, h, g, _, y, a, s, l), g = _ = y = null), le(e, !0, -1), S = e.input.charCodeAt(e.position)), (e.line === o || e.lineIndent > t) && S !== 0)
      L(e, "bad indentation of a mapping entry");
    else if (e.lineIndent < t)
      break;
  }
  return A && zt(e, f, h, g, _, null, a, s, l), T && (e.tag = m, e.anchor = c, e.kind = "mapping", e.result = f), T;
}
function Ag(e) {
  var t, n = !1, r = !1, i, o, a;
  if (a = e.input.charCodeAt(e.position), a !== 33) return !1;
  if (e.tag !== null && L(e, "duplication of a tag property"), a = e.input.charCodeAt(++e.position), a === 60 ? (n = !0, a = e.input.charCodeAt(++e.position)) : a === 33 ? (r = !0, i = "!!", a = e.input.charCodeAt(++e.position)) : i = "!", t = e.position, n) {
    do
      a = e.input.charCodeAt(++e.position);
    while (a !== 0 && a !== 62);
    e.position < e.length ? (o = e.input.slice(t, e.position), a = e.input.charCodeAt(++e.position)) : L(e, "unexpected end of the stream within a verbatim tag");
  } else {
    for (; a !== 0 && !Ne(a); )
      a === 33 && (r ? L(e, "tag suffix cannot contain exclamation marks") : (i = e.input.slice(t - 1, e.position + 1), qc.test(i) || L(e, "named tag handle cannot contain such characters"), r = !0, t = e.position + 1)), a = e.input.charCodeAt(++e.position);
    o = e.input.slice(t, e.position), ug.test(o) && L(e, "tag suffix cannot contain flow indicator characters");
  }
  o && !Gc.test(o) && L(e, "tag name cannot contain such characters: " + o);
  try {
    o = decodeURIComponent(o);
  } catch {
    L(e, "tag name is malformed: " + o);
  }
  return n ? e.tag = o : gt.call(e.tagMap, i) ? e.tag = e.tagMap[i] + o : i === "!" ? e.tag = "!" + o : i === "!!" ? e.tag = "tag:yaml.org,2002:" + o : L(e, 'undeclared tag handle "' + i + '"'), !0;
}
function Sg(e) {
  var t, n;
  if (n = e.input.charCodeAt(e.position), n !== 38) return !1;
  for (e.anchor !== null && L(e, "duplication of an anchor property"), n = e.input.charCodeAt(++e.position), t = e.position; n !== 0 && !Ne(n) && !Yt(n); )
    n = e.input.charCodeAt(++e.position);
  return e.position === t && L(e, "name of an anchor node must contain at least one character"), e.anchor = e.input.slice(t, e.position), !0;
}
function Tg(e) {
  var t, n, r;
  if (r = e.input.charCodeAt(e.position), r !== 42) return !1;
  for (r = e.input.charCodeAt(++e.position), t = e.position; r !== 0 && !Ne(r) && !Yt(r); )
    r = e.input.charCodeAt(++e.position);
  return e.position === t && L(e, "name of an alias node must contain at least one character"), n = e.input.slice(t, e.position), gt.call(e.anchorMap, n) || L(e, 'unidentified alias "' + n + '"'), e.result = e.anchorMap[n], le(e, !0, -1), !0;
}
function on(e, t, n, r, i) {
  var o, a, s, l = 1, m = !1, c = !1, f, h, g, _, y, A;
  if (e.listener !== null && e.listener("open", e), e.tag = null, e.anchor = null, e.kind = null, e.result = null, o = a = s = jr === n || Hc === n, r && le(e, !0, -1) && (m = !0, e.lineIndent > t ? l = 1 : e.lineIndent === t ? l = 0 : e.lineIndent < t && (l = -1)), l === 1)
    for (; Ag(e) || Sg(e); )
      le(e, !0, -1) ? (m = !0, s = o, e.lineIndent > t ? l = 1 : e.lineIndent === t ? l = 0 : e.lineIndent < t && (l = -1)) : s = !1;
  if (s && (s = m || i), (l === 1 || jr === n) && (Br === n || jc === n ? y = t : y = t + 1, A = e.position - e.lineStart, l === 1 ? s && (ns(e, A) || _g(e, A, y)) || vg(e, y) ? c = !0 : (a && wg(e, y) || Eg(e, y) || yg(e, y) ? c = !0 : Tg(e) ? (c = !0, (e.tag !== null || e.anchor !== null) && L(e, "alias node should not have any properties")) : gg(e, y, Br === n) && (c = !0, e.tag === null && (e.tag = "?")), e.anchor !== null && (e.anchorMap[e.anchor] = e.result)) : l === 0 && (c = s && ns(e, A))), e.tag === null)
    e.anchor !== null && (e.anchorMap[e.anchor] = e.result);
  else if (e.tag === "?") {
    for (e.result !== null && e.kind !== "scalar" && L(e, 'unacceptable node kind for !<?> tag; it should be "scalar", not "' + e.kind + '"'), f = 0, h = e.implicitTypes.length; f < h; f += 1)
      if (_ = e.implicitTypes[f], _.resolve(e.result)) {
        e.result = _.construct(e.result), e.tag = _.tag, e.anchor !== null && (e.anchorMap[e.anchor] = e.result);
        break;
      }
  } else if (e.tag !== "!") {
    if (gt.call(e.typeMap[e.kind || "fallback"], e.tag))
      _ = e.typeMap[e.kind || "fallback"][e.tag];
    else
      for (_ = null, g = e.typeMap.multi[e.kind || "fallback"], f = 0, h = g.length; f < h; f += 1)
        if (e.tag.slice(0, g[f].tag.length) === g[f].tag) {
          _ = g[f];
          break;
        }
    _ || L(e, "unknown tag !<" + e.tag + ">"), e.result !== null && _.kind !== e.kind && L(e, "unacceptable node kind for !<" + e.tag + '> tag; it should be "' + _.kind + '", not "' + e.kind + '"'), _.resolve(e.result, e.tag) ? (e.result = _.construct(e.result, e.tag), e.anchor !== null && (e.anchorMap[e.anchor] = e.result)) : L(e, "cannot resolve a node with !<" + e.tag + "> explicit tag");
  }
  return e.listener !== null && e.listener("close", e), e.tag !== null || e.anchor !== null || c;
}
function Cg(e) {
  var t = e.position, n, r, i, o = !1, a;
  for (e.version = null, e.checkLineBreaks = e.legacy, e.tagMap = /* @__PURE__ */ Object.create(null), e.anchorMap = /* @__PURE__ */ Object.create(null); (a = e.input.charCodeAt(e.position)) !== 0 && (le(e, !0, -1), a = e.input.charCodeAt(e.position), !(e.lineIndent > 0 || a !== 37)); ) {
    for (o = !0, a = e.input.charCodeAt(++e.position), n = e.position; a !== 0 && !Ne(a); )
      a = e.input.charCodeAt(++e.position);
    for (r = e.input.slice(n, e.position), i = [], r.length < 1 && L(e, "directive name must not be less than one character in length"); a !== 0; ) {
      for (; Nt(a); )
        a = e.input.charCodeAt(++e.position);
      if (a === 35) {
        do
          a = e.input.charCodeAt(++e.position);
        while (a !== 0 && !Xe(a));
        break;
      }
      if (Xe(a)) break;
      for (n = e.position; a !== 0 && !Ne(a); )
        a = e.input.charCodeAt(++e.position);
      i.push(e.input.slice(n, e.position));
    }
    a !== 0 && ko(e), gt.call(es, r) ? es[r](e, r, i) : Hr(e, 'unknown document directive "' + r + '"');
  }
  if (le(e, !0, -1), e.lineIndent === 0 && e.input.charCodeAt(e.position) === 45 && e.input.charCodeAt(e.position + 1) === 45 && e.input.charCodeAt(e.position + 2) === 45 ? (e.position += 3, le(e, !0, -1)) : o && L(e, "directives end mark is expected"), on(e, e.lineIndent - 1, jr, !1, !0), le(e, !0, -1), e.checkLineBreaks && cg.test(e.input.slice(t, e.position)) && Hr(e, "non-ASCII line breaks are interpreted as content"), e.documents.push(e.result), e.position === e.lineStart && ni(e)) {
    e.input.charCodeAt(e.position) === 46 && (e.position += 3, le(e, !0, -1));
    return;
  }
  if (e.position < e.length - 1)
    L(e, "end of the stream or a document separator is expected");
  else
    return;
}
function zc(e, t) {
  e = String(e), t = t || {}, e.length !== 0 && (e.charCodeAt(e.length - 1) !== 10 && e.charCodeAt(e.length - 1) !== 13 && (e += `
`), e.charCodeAt(0) === 65279 && (e = e.slice(1)));
  var n = new mg(e, t), r = e.indexOf("\0");
  for (r !== -1 && (n.position = r, L(n, "null byte is not allowed in input")), n.input += "\0"; n.input.charCodeAt(n.position) === 32; )
    n.lineIndent += 1, n.position += 1;
  for (; n.position < n.length - 1; )
    Cg(n);
  return n.documents;
}
function bg(e, t, n) {
  t !== null && typeof t == "object" && typeof n > "u" && (n = t, t = null);
  var r = zc(e, n);
  if (typeof t != "function")
    return r;
  for (var i = 0, o = r.length; i < o; i += 1)
    t(r[i]);
}
function $g(e, t) {
  var n = zc(e, t);
  if (n.length !== 0) {
    if (n.length === 1)
      return n[0];
    throw new Bc("expected a single document in the stream, but found more");
  }
}
xo.loadAll = bg;
xo.load = $g;
var Xc = {}, ri = qe, Xn = zn, Og = Uo, Kc = Object.prototype.toString, Jc = Object.prototype.hasOwnProperty, Bo = 65279, Ig = 9, Fn = 10, Rg = 13, Pg = 32, Dg = 33, Ng = 34, fo = 35, Fg = 37, xg = 38, Lg = 39, Ug = 42, Qc = 44, kg = 45, qr = 58, Mg = 61, Bg = 62, jg = 63, Hg = 64, Zc = 91, eu = 93, qg = 96, tu = 123, Gg = 124, nu = 125, Ae = {};
Ae[0] = "\\0";
Ae[7] = "\\a";
Ae[8] = "\\b";
Ae[9] = "\\t";
Ae[10] = "\\n";
Ae[11] = "\\v";
Ae[12] = "\\f";
Ae[13] = "\\r";
Ae[27] = "\\e";
Ae[34] = '\\"';
Ae[92] = "\\\\";
Ae[133] = "\\N";
Ae[160] = "\\_";
Ae[8232] = "\\L";
Ae[8233] = "\\P";
var Wg = [
  "y",
  "Y",
  "yes",
  "Yes",
  "YES",
  "on",
  "On",
  "ON",
  "n",
  "N",
  "no",
  "No",
  "NO",
  "off",
  "Off",
  "OFF"
], Vg = /^[-+]?[0-9_]+(?::[0-9_]+)+(?:\.[0-9_]*)?$/;
function Yg(e, t) {
  var n, r, i, o, a, s, l;
  if (t === null) return {};
  for (n = {}, r = Object.keys(t), i = 0, o = r.length; i < o; i += 1)
    a = r[i], s = String(t[a]), a.slice(0, 2) === "!!" && (a = "tag:yaml.org,2002:" + a.slice(2)), l = e.compiledTypeMap.fallback[a], l && Jc.call(l.styleAliases, s) && (s = l.styleAliases[s]), n[a] = s;
  return n;
}
function zg(e) {
  var t, n, r;
  if (t = e.toString(16).toUpperCase(), e <= 255)
    n = "x", r = 2;
  else if (e <= 65535)
    n = "u", r = 4;
  else if (e <= 4294967295)
    n = "U", r = 8;
  else
    throw new Xn("code point within a string may not be greater than 0xFFFFFFFF");
  return "\\" + n + ri.repeat("0", r - t.length) + t;
}
var Xg = 1, xn = 2;
function Kg(e) {
  this.schema = e.schema || Og, this.indent = Math.max(1, e.indent || 2), this.noArrayIndent = e.noArrayIndent || !1, this.skipInvalid = e.skipInvalid || !1, this.flowLevel = ri.isNothing(e.flowLevel) ? -1 : e.flowLevel, this.styleMap = Yg(this.schema, e.styles || null), this.sortKeys = e.sortKeys || !1, this.lineWidth = e.lineWidth || 80, this.noRefs = e.noRefs || !1, this.noCompatMode = e.noCompatMode || !1, this.condenseFlow = e.condenseFlow || !1, this.quotingType = e.quotingType === '"' ? xn : Xg, this.forceQuotes = e.forceQuotes || !1, this.replacer = typeof e.replacer == "function" ? e.replacer : null, this.implicitTypes = this.schema.compiledImplicit, this.explicitTypes = this.schema.compiledExplicit, this.tag = null, this.result = "", this.duplicates = [], this.usedDuplicates = null;
}
function rs(e, t) {
  for (var n = ri.repeat(" ", t), r = 0, i = -1, o = "", a, s = e.length; r < s; )
    i = e.indexOf(`
`, r), i === -1 ? (a = e.slice(r), r = s) : (a = e.slice(r, i + 1), r = i + 1), a.length && a !== `
` && (o += n), o += a;
  return o;
}
function ho(e, t) {
  return `
` + ri.repeat(" ", e.indent * t);
}
function Jg(e, t) {
  var n, r, i;
  for (n = 0, r = e.implicitTypes.length; n < r; n += 1)
    if (i = e.implicitTypes[n], i.resolve(t))
      return !0;
  return !1;
}
function Gr(e) {
  return e === Pg || e === Ig;
}
function Ln(e) {
  return 32 <= e && e <= 126 || 161 <= e && e <= 55295 && e !== 8232 && e !== 8233 || 57344 <= e && e <= 65533 && e !== Bo || 65536 <= e && e <= 1114111;
}
function is(e) {
  return Ln(e) && e !== Bo && e !== Rg && e !== Fn;
}
function os(e, t, n) {
  var r = is(e), i = r && !Gr(e);
  return (
    // ns-plain-safe
    (n ? (
      // c = flow-in
      r
    ) : r && e !== Qc && e !== Zc && e !== eu && e !== tu && e !== nu) && e !== fo && !(t === qr && !i) || is(t) && !Gr(t) && e === fo || t === qr && i
  );
}
function Qg(e) {
  return Ln(e) && e !== Bo && !Gr(e) && e !== kg && e !== jg && e !== qr && e !== Qc && e !== Zc && e !== eu && e !== tu && e !== nu && e !== fo && e !== xg && e !== Ug && e !== Dg && e !== Gg && e !== Mg && e !== Bg && e !== Lg && e !== Ng && e !== Fg && e !== Hg && e !== qg;
}
function Zg(e) {
  return !Gr(e) && e !== qr;
}
function An(e, t) {
  var n = e.charCodeAt(t), r;
  return n >= 55296 && n <= 56319 && t + 1 < e.length && (r = e.charCodeAt(t + 1), r >= 56320 && r <= 57343) ? (n - 55296) * 1024 + r - 56320 + 65536 : n;
}
function ru(e) {
  var t = /^\n* /;
  return t.test(e);
}
var iu = 1, po = 2, ou = 3, au = 4, Vt = 5;
function e0(e, t, n, r, i, o, a, s) {
  var l, m = 0, c = null, f = !1, h = !1, g = r !== -1, _ = -1, y = Qg(An(e, 0)) && Zg(An(e, e.length - 1));
  if (t || a)
    for (l = 0; l < e.length; m >= 65536 ? l += 2 : l++) {
      if (m = An(e, l), !Ln(m))
        return Vt;
      y = y && os(m, c, s), c = m;
    }
  else {
    for (l = 0; l < e.length; m >= 65536 ? l += 2 : l++) {
      if (m = An(e, l), m === Fn)
        f = !0, g && (h = h || // Foldable line = too long, and not more-indented.
        l - _ - 1 > r && e[_ + 1] !== " ", _ = l);
      else if (!Ln(m))
        return Vt;
      y = y && os(m, c, s), c = m;
    }
    h = h || g && l - _ - 1 > r && e[_ + 1] !== " ";
  }
  return !f && !h ? y && !a && !i(e) ? iu : o === xn ? Vt : po : n > 9 && ru(e) ? Vt : a ? o === xn ? Vt : po : h ? au : ou;
}
function t0(e, t, n, r, i) {
  e.dump = function() {
    if (t.length === 0)
      return e.quotingType === xn ? '""' : "''";
    if (!e.noCompatMode && (Wg.indexOf(t) !== -1 || Vg.test(t)))
      return e.quotingType === xn ? '"' + t + '"' : "'" + t + "'";
    var o = e.indent * Math.max(1, n), a = e.lineWidth === -1 ? -1 : Math.max(Math.min(e.lineWidth, 40), e.lineWidth - o), s = r || e.flowLevel > -1 && n >= e.flowLevel;
    function l(m) {
      return Jg(e, m);
    }
    switch (e0(
      t,
      s,
      e.indent,
      a,
      l,
      e.quotingType,
      e.forceQuotes && !r,
      i
    )) {
      case iu:
        return t;
      case po:
        return "'" + t.replace(/'/g, "''") + "'";
      case ou:
        return "|" + as(t, e.indent) + ss(rs(t, o));
      case au:
        return ">" + as(t, e.indent) + ss(rs(n0(t, a), o));
      case Vt:
        return '"' + r0(t) + '"';
      default:
        throw new Xn("impossible error: invalid scalar style");
    }
  }();
}
function as(e, t) {
  var n = ru(e) ? String(t) : "", r = e[e.length - 1] === `
`, i = r && (e[e.length - 2] === `
` || e === `
`), o = i ? "+" : r ? "" : "-";
  return n + o + `
`;
}
function ss(e) {
  return e[e.length - 1] === `
` ? e.slice(0, -1) : e;
}
function n0(e, t) {
  for (var n = /(\n+)([^\n]*)/g, r = function() {
    var m = e.indexOf(`
`);
    return m = m !== -1 ? m : e.length, n.lastIndex = m, ls(e.slice(0, m), t);
  }(), i = e[0] === `
` || e[0] === " ", o, a; a = n.exec(e); ) {
    var s = a[1], l = a[2];
    o = l[0] === " ", r += s + (!i && !o && l !== "" ? `
` : "") + ls(l, t), i = o;
  }
  return r;
}
function ls(e, t) {
  if (e === "" || e[0] === " ") return e;
  for (var n = / [^ ]/g, r, i = 0, o, a = 0, s = 0, l = ""; r = n.exec(e); )
    s = r.index, s - i > t && (o = a > i ? a : s, l += `
` + e.slice(i, o), i = o + 1), a = s;
  return l += `
`, e.length - i > t && a > i ? l += e.slice(i, a) + `
` + e.slice(a + 1) : l += e.slice(i), l.slice(1);
}
function r0(e) {
  for (var t = "", n = 0, r, i = 0; i < e.length; n >= 65536 ? i += 2 : i++)
    n = An(e, i), r = Ae[n], !r && Ln(n) ? (t += e[i], n >= 65536 && (t += e[i + 1])) : t += r || zg(n);
  return t;
}
function i0(e, t, n) {
  var r = "", i = e.tag, o, a, s;
  for (o = 0, a = n.length; o < a; o += 1)
    s = n[o], e.replacer && (s = e.replacer.call(n, String(o), s)), (tt(e, t, s, !1, !1) || typeof s > "u" && tt(e, t, null, !1, !1)) && (r !== "" && (r += "," + (e.condenseFlow ? "" : " ")), r += e.dump);
  e.tag = i, e.dump = "[" + r + "]";
}
function cs(e, t, n, r) {
  var i = "", o = e.tag, a, s, l;
  for (a = 0, s = n.length; a < s; a += 1)
    l = n[a], e.replacer && (l = e.replacer.call(n, String(a), l)), (tt(e, t + 1, l, !0, !0, !1, !0) || typeof l > "u" && tt(e, t + 1, null, !0, !0, !1, !0)) && ((!r || i !== "") && (i += ho(e, t)), e.dump && Fn === e.dump.charCodeAt(0) ? i += "-" : i += "- ", i += e.dump);
  e.tag = o, e.dump = i || "[]";
}
function o0(e, t, n) {
  var r = "", i = e.tag, o = Object.keys(n), a, s, l, m, c;
  for (a = 0, s = o.length; a < s; a += 1)
    c = "", r !== "" && (c += ", "), e.condenseFlow && (c += '"'), l = o[a], m = n[l], e.replacer && (m = e.replacer.call(n, l, m)), tt(e, t, l, !1, !1) && (e.dump.length > 1024 && (c += "? "), c += e.dump + (e.condenseFlow ? '"' : "") + ":" + (e.condenseFlow ? "" : " "), tt(e, t, m, !1, !1) && (c += e.dump, r += c));
  e.tag = i, e.dump = "{" + r + "}";
}
function a0(e, t, n, r) {
  var i = "", o = e.tag, a = Object.keys(n), s, l, m, c, f, h;
  if (e.sortKeys === !0)
    a.sort();
  else if (typeof e.sortKeys == "function")
    a.sort(e.sortKeys);
  else if (e.sortKeys)
    throw new Xn("sortKeys must be a boolean or a function");
  for (s = 0, l = a.length; s < l; s += 1)
    h = "", (!r || i !== "") && (h += ho(e, t)), m = a[s], c = n[m], e.replacer && (c = e.replacer.call(n, m, c)), tt(e, t + 1, m, !0, !0, !0) && (f = e.tag !== null && e.tag !== "?" || e.dump && e.dump.length > 1024, f && (e.dump && Fn === e.dump.charCodeAt(0) ? h += "?" : h += "? "), h += e.dump, f && (h += ho(e, t)), tt(e, t + 1, c, !0, f) && (e.dump && Fn === e.dump.charCodeAt(0) ? h += ":" : h += ": ", h += e.dump, i += h));
  e.tag = o, e.dump = i || "{}";
}
function us(e, t, n) {
  var r, i, o, a, s, l;
  for (i = n ? e.explicitTypes : e.implicitTypes, o = 0, a = i.length; o < a; o += 1)
    if (s = i[o], (s.instanceOf || s.predicate) && (!s.instanceOf || typeof t == "object" && t instanceof s.instanceOf) && (!s.predicate || s.predicate(t))) {
      if (n ? s.multi && s.representName ? e.tag = s.representName(t) : e.tag = s.tag : e.tag = "?", s.represent) {
        if (l = e.styleMap[s.tag] || s.defaultStyle, Kc.call(s.represent) === "[object Function]")
          r = s.represent(t, l);
        else if (Jc.call(s.represent, l))
          r = s.represent[l](t, l);
        else
          throw new Xn("!<" + s.tag + '> tag resolver accepts not "' + l + '" style');
        e.dump = r;
      }
      return !0;
    }
  return !1;
}
function tt(e, t, n, r, i, o, a) {
  e.tag = null, e.dump = n, us(e, n, !1) || us(e, n, !0);
  var s = Kc.call(e.dump), l = r, m;
  r && (r = e.flowLevel < 0 || e.flowLevel > t);
  var c = s === "[object Object]" || s === "[object Array]", f, h;
  if (c && (f = e.duplicates.indexOf(n), h = f !== -1), (e.tag !== null && e.tag !== "?" || h || e.indent !== 2 && t > 0) && (i = !1), h && e.usedDuplicates[f])
    e.dump = "*ref_" + f;
  else {
    if (c && h && !e.usedDuplicates[f] && (e.usedDuplicates[f] = !0), s === "[object Object]")
      r && Object.keys(e.dump).length !== 0 ? (a0(e, t, e.dump, i), h && (e.dump = "&ref_" + f + e.dump)) : (o0(e, t, e.dump), h && (e.dump = "&ref_" + f + " " + e.dump));
    else if (s === "[object Array]")
      r && e.dump.length !== 0 ? (e.noArrayIndent && !a && t > 0 ? cs(e, t - 1, e.dump, i) : cs(e, t, e.dump, i), h && (e.dump = "&ref_" + f + e.dump)) : (i0(e, t, e.dump), h && (e.dump = "&ref_" + f + " " + e.dump));
    else if (s === "[object String]")
      e.tag !== "?" && t0(e, e.dump, t, o, l);
    else {
      if (s === "[object Undefined]")
        return !1;
      if (e.skipInvalid) return !1;
      throw new Xn("unacceptable kind of an object to dump " + s);
    }
    e.tag !== null && e.tag !== "?" && (m = encodeURI(
      e.tag[0] === "!" ? e.tag.slice(1) : e.tag
    ).replace(/!/g, "%21"), e.tag[0] === "!" ? m = "!" + m : m.slice(0, 18) === "tag:yaml.org,2002:" ? m = "!!" + m.slice(18) : m = "!<" + m + ">", e.dump = m + " " + e.dump);
  }
  return !0;
}
function s0(e, t) {
  var n = [], r = [], i, o;
  for (mo(e, n, r), i = 0, o = r.length; i < o; i += 1)
    t.duplicates.push(n[r[i]]);
  t.usedDuplicates = new Array(o);
}
function mo(e, t, n) {
  var r, i, o;
  if (e !== null && typeof e == "object")
    if (i = t.indexOf(e), i !== -1)
      n.indexOf(i) === -1 && n.push(i);
    else if (t.push(e), Array.isArray(e))
      for (i = 0, o = e.length; i < o; i += 1)
        mo(e[i], t, n);
    else
      for (r = Object.keys(e), i = 0, o = r.length; i < o; i += 1)
        mo(e[r[i]], t, n);
}
function l0(e, t) {
  t = t || {};
  var n = new Kg(t);
  n.noRefs || s0(e, n);
  var r = e;
  return n.replacer && (r = n.replacer.call({ "": r }, "", r)), tt(n, 0, r, !0, !0) ? n.dump + `
` : "";
}
Xc.dump = l0;
var su = xo, c0 = Xc;
function jo(e, t) {
  return function() {
    throw new Error("Function yaml." + e + " is removed in js-yaml 4. Use yaml." + t + " instead, which is now safe by default.");
  };
}
ye.Type = Re;
ye.Schema = wc;
ye.FAILSAFE_SCHEMA = Tc;
ye.JSON_SCHEMA = Rc;
ye.CORE_SCHEMA = Pc;
ye.DEFAULT_SCHEMA = Uo;
ye.load = su.load;
ye.loadAll = su.loadAll;
ye.dump = c0.dump;
ye.YAMLException = zn;
ye.types = {
  binary: Lc,
  float: Ic,
  map: Sc,
  null: Cc,
  pairs: kc,
  set: Mc,
  timestamp: Fc,
  bool: bc,
  int: $c,
  merge: xc,
  omap: Uc,
  seq: Ac,
  str: _c
};
ye.safeLoad = jo("safeLoad", "load");
ye.safeLoadAll = jo("safeLoadAll", "loadAll");
ye.safeDump = jo("safeDump", "dump");
var ii = {};
Object.defineProperty(ii, "__esModule", { value: !0 });
ii.Lazy = void 0;
class u0 {
  constructor(t) {
    this._value = null, this.creator = t;
  }
  get hasValue() {
    return this.creator == null;
  }
  get value() {
    if (this.creator == null)
      return this._value;
    const t = this.creator();
    return this.value = t, t;
  }
  set value(t) {
    this._value = t, this.creator = null;
  }
}
ii.Lazy = u0;
var go = { exports: {} };
const f0 = "2.0.0", lu = 256, d0 = Number.MAX_SAFE_INTEGER || /* istanbul ignore next */
9007199254740991, h0 = 16, p0 = lu - 6, m0 = [
  "major",
  "premajor",
  "minor",
  "preminor",
  "patch",
  "prepatch",
  "prerelease"
];
var oi = {
  MAX_LENGTH: lu,
  MAX_SAFE_COMPONENT_LENGTH: h0,
  MAX_SAFE_BUILD_LENGTH: p0,
  MAX_SAFE_INTEGER: d0,
  RELEASE_TYPES: m0,
  SEMVER_SPEC_VERSION: f0,
  FLAG_INCLUDE_PRERELEASE: 1,
  FLAG_LOOSE: 2
};
const g0 = typeof process == "object" && process.env && process.env.NODE_DEBUG && /\bsemver\b/i.test(process.env.NODE_DEBUG) ? (...e) => console.error("SEMVER", ...e) : () => {
};
var ai = g0;
(function(e, t) {
  const {
    MAX_SAFE_COMPONENT_LENGTH: n,
    MAX_SAFE_BUILD_LENGTH: r,
    MAX_LENGTH: i
  } = oi, o = ai;
  t = e.exports = {};
  const a = t.re = [], s = t.safeRe = [], l = t.src = [], m = t.safeSrc = [], c = t.t = {};
  let f = 0;
  const h = "[a-zA-Z0-9-]", g = [
    ["\\s", 1],
    ["\\d", i],
    [h, r]
  ], _ = (A) => {
    for (const [T, S] of g)
      A = A.split(`${T}*`).join(`${T}{0,${S}}`).split(`${T}+`).join(`${T}{1,${S}}`);
    return A;
  }, y = (A, T, S) => {
    const N = _(T), x = f++;
    o(A, x, T), c[A] = x, l[x] = T, m[x] = N, a[x] = new RegExp(T, S ? "g" : void 0), s[x] = new RegExp(N, S ? "g" : void 0);
  };
  y("NUMERICIDENTIFIER", "0|[1-9]\\d*"), y("NUMERICIDENTIFIERLOOSE", "\\d+"), y("NONNUMERICIDENTIFIER", `\\d*[a-zA-Z-]${h}*`), y("MAINVERSION", `(${l[c.NUMERICIDENTIFIER]})\\.(${l[c.NUMERICIDENTIFIER]})\\.(${l[c.NUMERICIDENTIFIER]})`), y("MAINVERSIONLOOSE", `(${l[c.NUMERICIDENTIFIERLOOSE]})\\.(${l[c.NUMERICIDENTIFIERLOOSE]})\\.(${l[c.NUMERICIDENTIFIERLOOSE]})`), y("PRERELEASEIDENTIFIER", `(?:${l[c.NONNUMERICIDENTIFIER]}|${l[c.NUMERICIDENTIFIER]})`), y("PRERELEASEIDENTIFIERLOOSE", `(?:${l[c.NONNUMERICIDENTIFIER]}|${l[c.NUMERICIDENTIFIERLOOSE]})`), y("PRERELEASE", `(?:-(${l[c.PRERELEASEIDENTIFIER]}(?:\\.${l[c.PRERELEASEIDENTIFIER]})*))`), y("PRERELEASELOOSE", `(?:-?(${l[c.PRERELEASEIDENTIFIERLOOSE]}(?:\\.${l[c.PRERELEASEIDENTIFIERLOOSE]})*))`), y("BUILDIDENTIFIER", `${h}+`), y("BUILD", `(?:\\+(${l[c.BUILDIDENTIFIER]}(?:\\.${l[c.BUILDIDENTIFIER]})*))`), y("FULLPLAIN", `v?${l[c.MAINVERSION]}${l[c.PRERELEASE]}?${l[c.BUILD]}?`), y("FULL", `^${l[c.FULLPLAIN]}$`), y("LOOSEPLAIN", `[v=\\s]*${l[c.MAINVERSIONLOOSE]}${l[c.PRERELEASELOOSE]}?${l[c.BUILD]}?`), y("LOOSE", `^${l[c.LOOSEPLAIN]}$`), y("GTLT", "((?:<|>)?=?)"), y("XRANGEIDENTIFIERLOOSE", `${l[c.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`), y("XRANGEIDENTIFIER", `${l[c.NUMERICIDENTIFIER]}|x|X|\\*`), y("XRANGEPLAIN", `[v=\\s]*(${l[c.XRANGEIDENTIFIER]})(?:\\.(${l[c.XRANGEIDENTIFIER]})(?:\\.(${l[c.XRANGEIDENTIFIER]})(?:${l[c.PRERELEASE]})?${l[c.BUILD]}?)?)?`), y("XRANGEPLAINLOOSE", `[v=\\s]*(${l[c.XRANGEIDENTIFIERLOOSE]})(?:\\.(${l[c.XRANGEIDENTIFIERLOOSE]})(?:\\.(${l[c.XRANGEIDENTIFIERLOOSE]})(?:${l[c.PRERELEASELOOSE]})?${l[c.BUILD]}?)?)?`), y("XRANGE", `^${l[c.GTLT]}\\s*${l[c.XRANGEPLAIN]}$`), y("XRANGELOOSE", `^${l[c.GTLT]}\\s*${l[c.XRANGEPLAINLOOSE]}$`), y("COERCEPLAIN", `(^|[^\\d])(\\d{1,${n}})(?:\\.(\\d{1,${n}}))?(?:\\.(\\d{1,${n}}))?`), y("COERCE", `${l[c.COERCEPLAIN]}(?:$|[^\\d])`), y("COERCEFULL", l[c.COERCEPLAIN] + `(?:${l[c.PRERELEASE]})?(?:${l[c.BUILD]})?(?:$|[^\\d])`), y("COERCERTL", l[c.COERCE], !0), y("COERCERTLFULL", l[c.COERCEFULL], !0), y("LONETILDE", "(?:~>?)"), y("TILDETRIM", `(\\s*)${l[c.LONETILDE]}\\s+`, !0), t.tildeTrimReplace = "$1~", y("TILDE", `^${l[c.LONETILDE]}${l[c.XRANGEPLAIN]}$`), y("TILDELOOSE", `^${l[c.LONETILDE]}${l[c.XRANGEPLAINLOOSE]}$`), y("LONECARET", "(?:\\^)"), y("CARETTRIM", `(\\s*)${l[c.LONECARET]}\\s+`, !0), t.caretTrimReplace = "$1^", y("CARET", `^${l[c.LONECARET]}${l[c.XRANGEPLAIN]}$`), y("CARETLOOSE", `^${l[c.LONECARET]}${l[c.XRANGEPLAINLOOSE]}$`), y("COMPARATORLOOSE", `^${l[c.GTLT]}\\s*(${l[c.LOOSEPLAIN]})$|^$`), y("COMPARATOR", `^${l[c.GTLT]}\\s*(${l[c.FULLPLAIN]})$|^$`), y("COMPARATORTRIM", `(\\s*)${l[c.GTLT]}\\s*(${l[c.LOOSEPLAIN]}|${l[c.XRANGEPLAIN]})`, !0), t.comparatorTrimReplace = "$1$2$3", y("HYPHENRANGE", `^\\s*(${l[c.XRANGEPLAIN]})\\s+-\\s+(${l[c.XRANGEPLAIN]})\\s*$`), y("HYPHENRANGELOOSE", `^\\s*(${l[c.XRANGEPLAINLOOSE]})\\s+-\\s+(${l[c.XRANGEPLAINLOOSE]})\\s*$`), y("STAR", "(<|>)?=?\\s*\\*"), y("GTE0", "^\\s*>=\\s*0\\.0\\.0\\s*$"), y("GTE0PRE", "^\\s*>=\\s*0\\.0\\.0-0\\s*$");
})(go, go.exports);
var Kn = go.exports;
const E0 = Object.freeze({ loose: !0 }), y0 = Object.freeze({}), v0 = (e) => e ? typeof e != "object" ? E0 : e : y0;
var Ho = v0;
const fs = /^[0-9]+$/, cu = (e, t) => {
  if (typeof e == "number" && typeof t == "number")
    return e === t ? 0 : e < t ? -1 : 1;
  const n = fs.test(e), r = fs.test(t);
  return n && r && (e = +e, t = +t), e === t ? 0 : n && !r ? -1 : r && !n ? 1 : e < t ? -1 : 1;
}, w0 = (e, t) => cu(t, e);
var uu = {
  compareIdentifiers: cu,
  rcompareIdentifiers: w0
};
const Er = ai, { MAX_LENGTH: ds, MAX_SAFE_INTEGER: yr } = oi, { safeRe: vr, t: wr } = Kn, _0 = Ho, { compareIdentifiers: ki } = uu;
let A0 = class ze {
  constructor(t, n) {
    if (n = _0(n), t instanceof ze) {
      if (t.loose === !!n.loose && t.includePrerelease === !!n.includePrerelease)
        return t;
      t = t.version;
    } else if (typeof t != "string")
      throw new TypeError(`Invalid version. Must be a string. Got type "${typeof t}".`);
    if (t.length > ds)
      throw new TypeError(
        `version is longer than ${ds} characters`
      );
    Er("SemVer", t, n), this.options = n, this.loose = !!n.loose, this.includePrerelease = !!n.includePrerelease;
    const r = t.trim().match(n.loose ? vr[wr.LOOSE] : vr[wr.FULL]);
    if (!r)
      throw new TypeError(`Invalid Version: ${t}`);
    if (this.raw = t, this.major = +r[1], this.minor = +r[2], this.patch = +r[3], this.major > yr || this.major < 0)
      throw new TypeError("Invalid major version");
    if (this.minor > yr || this.minor < 0)
      throw new TypeError("Invalid minor version");
    if (this.patch > yr || this.patch < 0)
      throw new TypeError("Invalid patch version");
    r[4] ? this.prerelease = r[4].split(".").map((i) => {
      if (/^[0-9]+$/.test(i)) {
        const o = +i;
        if (o >= 0 && o < yr)
          return o;
      }
      return i;
    }) : this.prerelease = [], this.build = r[5] ? r[5].split(".") : [], this.format();
  }
  format() {
    return this.version = `${this.major}.${this.minor}.${this.patch}`, this.prerelease.length && (this.version += `-${this.prerelease.join(".")}`), this.version;
  }
  toString() {
    return this.version;
  }
  compare(t) {
    if (Er("SemVer.compare", this.version, this.options, t), !(t instanceof ze)) {
      if (typeof t == "string" && t === this.version)
        return 0;
      t = new ze(t, this.options);
    }
    return t.version === this.version ? 0 : this.compareMain(t) || this.comparePre(t);
  }
  compareMain(t) {
    return t instanceof ze || (t = new ze(t, this.options)), this.major < t.major ? -1 : this.major > t.major ? 1 : this.minor < t.minor ? -1 : this.minor > t.minor ? 1 : this.patch < t.patch ? -1 : this.patch > t.patch ? 1 : 0;
  }
  comparePre(t) {
    if (t instanceof ze || (t = new ze(t, this.options)), this.prerelease.length && !t.prerelease.length)
      return -1;
    if (!this.prerelease.length && t.prerelease.length)
      return 1;
    if (!this.prerelease.length && !t.prerelease.length)
      return 0;
    let n = 0;
    do {
      const r = this.prerelease[n], i = t.prerelease[n];
      if (Er("prerelease compare", n, r, i), r === void 0 && i === void 0)
        return 0;
      if (i === void 0)
        return 1;
      if (r === void 0)
        return -1;
      if (r === i)
        continue;
      return ki(r, i);
    } while (++n);
  }
  compareBuild(t) {
    t instanceof ze || (t = new ze(t, this.options));
    let n = 0;
    do {
      const r = this.build[n], i = t.build[n];
      if (Er("build compare", n, r, i), r === void 0 && i === void 0)
        return 0;
      if (i === void 0)
        return 1;
      if (r === void 0)
        return -1;
      if (r === i)
        continue;
      return ki(r, i);
    } while (++n);
  }
  // preminor will bump the version up to the next minor release, and immediately
  // down to pre-release. premajor and prepatch work the same way.
  inc(t, n, r) {
    if (t.startsWith("pre")) {
      if (!n && r === !1)
        throw new Error("invalid increment argument: identifier is empty");
      if (n) {
        const i = `-${n}`.match(this.options.loose ? vr[wr.PRERELEASELOOSE] : vr[wr.PRERELEASE]);
        if (!i || i[1] !== n)
          throw new Error(`invalid identifier: ${n}`);
      }
    }
    switch (t) {
      case "premajor":
        this.prerelease.length = 0, this.patch = 0, this.minor = 0, this.major++, this.inc("pre", n, r);
        break;
      case "preminor":
        this.prerelease.length = 0, this.patch = 0, this.minor++, this.inc("pre", n, r);
        break;
      case "prepatch":
        this.prerelease.length = 0, this.inc("patch", n, r), this.inc("pre", n, r);
        break;
      case "prerelease":
        this.prerelease.length === 0 && this.inc("patch", n, r), this.inc("pre", n, r);
        break;
      case "release":
        if (this.prerelease.length === 0)
          throw new Error(`version ${this.raw} is not a prerelease`);
        this.prerelease.length = 0;
        break;
      case "major":
        (this.minor !== 0 || this.patch !== 0 || this.prerelease.length === 0) && this.major++, this.minor = 0, this.patch = 0, this.prerelease = [];
        break;
      case "minor":
        (this.patch !== 0 || this.prerelease.length === 0) && this.minor++, this.patch = 0, this.prerelease = [];
        break;
      case "patch":
        this.prerelease.length === 0 && this.patch++, this.prerelease = [];
        break;
      case "pre": {
        const i = Number(r) ? 1 : 0;
        if (this.prerelease.length === 0)
          this.prerelease = [i];
        else {
          let o = this.prerelease.length;
          for (; --o >= 0; )
            typeof this.prerelease[o] == "number" && (this.prerelease[o]++, o = -2);
          if (o === -1) {
            if (n === this.prerelease.join(".") && r === !1)
              throw new Error("invalid increment argument: identifier already exists");
            this.prerelease.push(i);
          }
        }
        if (n) {
          let o = [n, i];
          r === !1 && (o = [n]), ki(this.prerelease[0], n) === 0 ? isNaN(this.prerelease[1]) && (this.prerelease = o) : this.prerelease = o;
        }
        break;
      }
      default:
        throw new Error(`invalid increment argument: ${t}`);
    }
    return this.raw = this.format(), this.build.length && (this.raw += `+${this.build.join(".")}`), this;
  }
};
var Pe = A0;
const hs = Pe, S0 = (e, t, n = !1) => {
  if (e instanceof hs)
    return e;
  try {
    return new hs(e, t);
  } catch (r) {
    if (!n)
      return null;
    throw r;
  }
};
var cn = S0;
const T0 = cn, C0 = (e, t) => {
  const n = T0(e, t);
  return n ? n.version : null;
};
var b0 = C0;
const $0 = cn, O0 = (e, t) => {
  const n = $0(e.trim().replace(/^[=v]+/, ""), t);
  return n ? n.version : null;
};
var I0 = O0;
const ps = Pe, R0 = (e, t, n, r, i) => {
  typeof n == "string" && (i = r, r = n, n = void 0);
  try {
    return new ps(
      e instanceof ps ? e.version : e,
      n
    ).inc(t, r, i).version;
  } catch {
    return null;
  }
};
var P0 = R0;
const ms = cn, D0 = (e, t) => {
  const n = ms(e, null, !0), r = ms(t, null, !0), i = n.compare(r);
  if (i === 0)
    return null;
  const o = i > 0, a = o ? n : r, s = o ? r : n, l = !!a.prerelease.length;
  if (!!s.prerelease.length && !l) {
    if (!s.patch && !s.minor)
      return "major";
    if (s.compareMain(a) === 0)
      return s.minor && !s.patch ? "minor" : "patch";
  }
  const c = l ? "pre" : "";
  return n.major !== r.major ? c + "major" : n.minor !== r.minor ? c + "minor" : n.patch !== r.patch ? c + "patch" : "prerelease";
};
var N0 = D0;
const F0 = Pe, x0 = (e, t) => new F0(e, t).major;
var L0 = x0;
const U0 = Pe, k0 = (e, t) => new U0(e, t).minor;
var M0 = k0;
const B0 = Pe, j0 = (e, t) => new B0(e, t).patch;
var H0 = j0;
const q0 = cn, G0 = (e, t) => {
  const n = q0(e, t);
  return n && n.prerelease.length ? n.prerelease : null;
};
var W0 = G0;
const gs = Pe, V0 = (e, t, n) => new gs(e, n).compare(new gs(t, n));
var Ge = V0;
const Y0 = Ge, z0 = (e, t, n) => Y0(t, e, n);
var X0 = z0;
const K0 = Ge, J0 = (e, t) => K0(e, t, !0);
var Q0 = J0;
const Es = Pe, Z0 = (e, t, n) => {
  const r = new Es(e, n), i = new Es(t, n);
  return r.compare(i) || r.compareBuild(i);
};
var qo = Z0;
const eE = qo, tE = (e, t) => e.sort((n, r) => eE(n, r, t));
var nE = tE;
const rE = qo, iE = (e, t) => e.sort((n, r) => rE(r, n, t));
var oE = iE;
const aE = Ge, sE = (e, t, n) => aE(e, t, n) > 0;
var si = sE;
const lE = Ge, cE = (e, t, n) => lE(e, t, n) < 0;
var Go = cE;
const uE = Ge, fE = (e, t, n) => uE(e, t, n) === 0;
var fu = fE;
const dE = Ge, hE = (e, t, n) => dE(e, t, n) !== 0;
var du = hE;
const pE = Ge, mE = (e, t, n) => pE(e, t, n) >= 0;
var Wo = mE;
const gE = Ge, EE = (e, t, n) => gE(e, t, n) <= 0;
var Vo = EE;
const yE = fu, vE = du, wE = si, _E = Wo, AE = Go, SE = Vo, TE = (e, t, n, r) => {
  switch (t) {
    case "===":
      return typeof e == "object" && (e = e.version), typeof n == "object" && (n = n.version), e === n;
    case "!==":
      return typeof e == "object" && (e = e.version), typeof n == "object" && (n = n.version), e !== n;
    case "":
    case "=":
    case "==":
      return yE(e, n, r);
    case "!=":
      return vE(e, n, r);
    case ">":
      return wE(e, n, r);
    case ">=":
      return _E(e, n, r);
    case "<":
      return AE(e, n, r);
    case "<=":
      return SE(e, n, r);
    default:
      throw new TypeError(`Invalid operator: ${t}`);
  }
};
var hu = TE;
const CE = Pe, bE = cn, { safeRe: _r, t: Ar } = Kn, $E = (e, t) => {
  if (e instanceof CE)
    return e;
  if (typeof e == "number" && (e = String(e)), typeof e != "string")
    return null;
  t = t || {};
  let n = null;
  if (!t.rtl)
    n = e.match(t.includePrerelease ? _r[Ar.COERCEFULL] : _r[Ar.COERCE]);
  else {
    const l = t.includePrerelease ? _r[Ar.COERCERTLFULL] : _r[Ar.COERCERTL];
    let m;
    for (; (m = l.exec(e)) && (!n || n.index + n[0].length !== e.length); )
      (!n || m.index + m[0].length !== n.index + n[0].length) && (n = m), l.lastIndex = m.index + m[1].length + m[2].length;
    l.lastIndex = -1;
  }
  if (n === null)
    return null;
  const r = n[2], i = n[3] || "0", o = n[4] || "0", a = t.includePrerelease && n[5] ? `-${n[5]}` : "", s = t.includePrerelease && n[6] ? `+${n[6]}` : "";
  return bE(`${r}.${i}.${o}${a}${s}`, t);
};
var OE = $E;
class IE {
  constructor() {
    this.max = 1e3, this.map = /* @__PURE__ */ new Map();
  }
  get(t) {
    const n = this.map.get(t);
    if (n !== void 0)
      return this.map.delete(t), this.map.set(t, n), n;
  }
  delete(t) {
    return this.map.delete(t);
  }
  set(t, n) {
    if (!this.delete(t) && n !== void 0) {
      if (this.map.size >= this.max) {
        const i = this.map.keys().next().value;
        this.delete(i);
      }
      this.map.set(t, n);
    }
    return this;
  }
}
var RE = IE, Mi, ys;
function We() {
  if (ys) return Mi;
  ys = 1;
  const e = /\s+/g;
  class t {
    constructor($, P) {
      if (P = i(P), $ instanceof t)
        return $.loose === !!P.loose && $.includePrerelease === !!P.includePrerelease ? $ : new t($.raw, P);
      if ($ instanceof o)
        return this.raw = $.value, this.set = [[$]], this.formatted = void 0, this;
      if (this.options = P, this.loose = !!P.loose, this.includePrerelease = !!P.includePrerelease, this.raw = $.trim().replace(e, " "), this.set = this.raw.split("||").map((b) => this.parseRange(b.trim())).filter((b) => b.length), !this.set.length)
        throw new TypeError(`Invalid SemVer Range: ${this.raw}`);
      if (this.set.length > 1) {
        const b = this.set[0];
        if (this.set = this.set.filter((D) => !y(D[0])), this.set.length === 0)
          this.set = [b];
        else if (this.set.length > 1) {
          for (const D of this.set)
            if (D.length === 1 && A(D[0])) {
              this.set = [D];
              break;
            }
        }
      }
      this.formatted = void 0;
    }
    get range() {
      if (this.formatted === void 0) {
        this.formatted = "";
        for (let $ = 0; $ < this.set.length; $++) {
          $ > 0 && (this.formatted += "||");
          const P = this.set[$];
          for (let b = 0; b < P.length; b++)
            b > 0 && (this.formatted += " "), this.formatted += P[b].toString().trim();
        }
      }
      return this.formatted;
    }
    format() {
      return this.range;
    }
    toString() {
      return this.range;
    }
    parseRange($) {
      const b = ((this.options.includePrerelease && g) | (this.options.loose && _)) + ":" + $, D = r.get(b);
      if (D)
        return D;
      const R = this.options.loose, k = R ? l[m.HYPHENRANGELOOSE] : l[m.HYPHENRANGE];
      $ = $.replace(k, M(this.options.includePrerelease)), a("hyphen replace", $), $ = $.replace(l[m.COMPARATORTRIM], c), a("comparator trim", $), $ = $.replace(l[m.TILDETRIM], f), a("tilde trim", $), $ = $.replace(l[m.CARETTRIM], h), a("caret trim", $);
      let G = $.split(" ").map((U) => S(U, this.options)).join(" ").split(/\s+/).map((U) => B(U, this.options));
      R && (G = G.filter((U) => (a("loose invalid filter", U, this.options), !!U.match(l[m.COMPARATORLOOSE])))), a("range list", G);
      const j = /* @__PURE__ */ new Map(), K = G.map((U) => new o(U, this.options));
      for (const U of K) {
        if (y(U))
          return [U];
        j.set(U.value, U);
      }
      j.size > 1 && j.has("") && j.delete("");
      const fe = [...j.values()];
      return r.set(b, fe), fe;
    }
    intersects($, P) {
      if (!($ instanceof t))
        throw new TypeError("a Range is required");
      return this.set.some((b) => T(b, P) && $.set.some((D) => T(D, P) && b.every((R) => D.every((k) => R.intersects(k, P)))));
    }
    // if ANY of the sets match ALL of its comparators, then pass
    test($) {
      if (!$)
        return !1;
      if (typeof $ == "string")
        try {
          $ = new s($, this.options);
        } catch {
          return !1;
        }
      for (let P = 0; P < this.set.length; P++)
        if (X(this.set[P], $, this.options))
          return !0;
      return !1;
    }
  }
  Mi = t;
  const n = RE, r = new n(), i = Ho, o = li(), a = ai, s = Pe, {
    safeRe: l,
    t: m,
    comparatorTrimReplace: c,
    tildeTrimReplace: f,
    caretTrimReplace: h
  } = Kn, { FLAG_INCLUDE_PRERELEASE: g, FLAG_LOOSE: _ } = oi, y = (I) => I.value === "<0.0.0-0", A = (I) => I.value === "", T = (I, $) => {
    let P = !0;
    const b = I.slice();
    let D = b.pop();
    for (; P && b.length; )
      P = b.every((R) => D.intersects(R, $)), D = b.pop();
    return P;
  }, S = (I, $) => (I = I.replace(l[m.BUILD], ""), a("comp", I, $), I = ae(I, $), a("caret", I), I = x(I, $), a("tildes", I), I = Fe(I, $), a("xrange", I), I = q(I, $), a("stars", I), I), N = (I) => !I || I.toLowerCase() === "x" || I === "*", x = (I, $) => I.trim().split(/\s+/).map((P) => Z(P, $)).join(" "), Z = (I, $) => {
    const P = $.loose ? l[m.TILDELOOSE] : l[m.TILDE];
    return I.replace(P, (b, D, R, k, G) => {
      a("tilde", I, b, D, R, k, G);
      let j;
      return N(D) ? j = "" : N(R) ? j = `>=${D}.0.0 <${+D + 1}.0.0-0` : N(k) ? j = `>=${D}.${R}.0 <${D}.${+R + 1}.0-0` : G ? (a("replaceTilde pr", G), j = `>=${D}.${R}.${k}-${G} <${D}.${+R + 1}.0-0`) : j = `>=${D}.${R}.${k} <${D}.${+R + 1}.0-0`, a("tilde return", j), j;
    });
  }, ae = (I, $) => I.trim().split(/\s+/).map((P) => Y(P, $)).join(" "), Y = (I, $) => {
    a("caret", I, $);
    const P = $.loose ? l[m.CARETLOOSE] : l[m.CARET], b = $.includePrerelease ? "-0" : "";
    return I.replace(P, (D, R, k, G, j) => {
      a("caret", I, D, R, k, G, j);
      let K;
      return N(R) ? K = "" : N(k) ? K = `>=${R}.0.0${b} <${+R + 1}.0.0-0` : N(G) ? R === "0" ? K = `>=${R}.${k}.0${b} <${R}.${+k + 1}.0-0` : K = `>=${R}.${k}.0${b} <${+R + 1}.0.0-0` : j ? (a("replaceCaret pr", j), R === "0" ? k === "0" ? K = `>=${R}.${k}.${G}-${j} <${R}.${k}.${+G + 1}-0` : K = `>=${R}.${k}.${G}-${j} <${R}.${+k + 1}.0-0` : K = `>=${R}.${k}.${G}-${j} <${+R + 1}.0.0-0`) : (a("no pr"), R === "0" ? k === "0" ? K = `>=${R}.${k}.${G}${b} <${R}.${k}.${+G + 1}-0` : K = `>=${R}.${k}.${G}${b} <${R}.${+k + 1}.0-0` : K = `>=${R}.${k}.${G} <${+R + 1}.0.0-0`), a("caret return", K), K;
    });
  }, Fe = (I, $) => (a("replaceXRanges", I, $), I.split(/\s+/).map((P) => E(P, $)).join(" ")), E = (I, $) => {
    I = I.trim();
    const P = $.loose ? l[m.XRANGELOOSE] : l[m.XRANGE];
    return I.replace(P, (b, D, R, k, G, j) => {
      a("xRange", I, b, D, R, k, G, j);
      const K = N(R), fe = K || N(k), U = fe || N(G), Ve = U;
      return D === "=" && Ve && (D = ""), j = $.includePrerelease ? "-0" : "", K ? D === ">" || D === "<" ? b = "<0.0.0-0" : b = "*" : D && Ve ? (fe && (k = 0), G = 0, D === ">" ? (D = ">=", fe ? (R = +R + 1, k = 0, G = 0) : (k = +k + 1, G = 0)) : D === "<=" && (D = "<", fe ? R = +R + 1 : k = +k + 1), D === "<" && (j = "-0"), b = `${D + R}.${k}.${G}${j}`) : fe ? b = `>=${R}.0.0${j} <${+R + 1}.0.0-0` : U && (b = `>=${R}.${k}.0${j} <${R}.${+k + 1}.0-0`), a("xRange return", b), b;
    });
  }, q = (I, $) => (a("replaceStars", I, $), I.trim().replace(l[m.STAR], "")), B = (I, $) => (a("replaceGTE0", I, $), I.trim().replace(l[$.includePrerelease ? m.GTE0PRE : m.GTE0], "")), M = (I) => ($, P, b, D, R, k, G, j, K, fe, U, Ve) => (N(b) ? P = "" : N(D) ? P = `>=${b}.0.0${I ? "-0" : ""}` : N(R) ? P = `>=${b}.${D}.0${I ? "-0" : ""}` : k ? P = `>=${P}` : P = `>=${P}${I ? "-0" : ""}`, N(K) ? j = "" : N(fe) ? j = `<${+K + 1}.0.0-0` : N(U) ? j = `<${K}.${+fe + 1}.0-0` : Ve ? j = `<=${K}.${fe}.${U}-${Ve}` : I ? j = `<${K}.${fe}.${+U + 1}-0` : j = `<=${j}`, `${P} ${j}`.trim()), X = (I, $, P) => {
    for (let b = 0; b < I.length; b++)
      if (!I[b].test($))
        return !1;
    if ($.prerelease.length && !P.includePrerelease) {
      for (let b = 0; b < I.length; b++)
        if (a(I[b].semver), I[b].semver !== o.ANY && I[b].semver.prerelease.length > 0) {
          const D = I[b].semver;
          if (D.major === $.major && D.minor === $.minor && D.patch === $.patch)
            return !0;
        }
      return !1;
    }
    return !0;
  };
  return Mi;
}
var Bi, vs;
function li() {
  if (vs) return Bi;
  vs = 1;
  const e = Symbol("SemVer ANY");
  class t {
    static get ANY() {
      return e;
    }
    constructor(c, f) {
      if (f = n(f), c instanceof t) {
        if (c.loose === !!f.loose)
          return c;
        c = c.value;
      }
      c = c.trim().split(/\s+/).join(" "), a("comparator", c, f), this.options = f, this.loose = !!f.loose, this.parse(c), this.semver === e ? this.value = "" : this.value = this.operator + this.semver.version, a("comp", this);
    }
    parse(c) {
      const f = this.options.loose ? r[i.COMPARATORLOOSE] : r[i.COMPARATOR], h = c.match(f);
      if (!h)
        throw new TypeError(`Invalid comparator: ${c}`);
      this.operator = h[1] !== void 0 ? h[1] : "", this.operator === "=" && (this.operator = ""), h[2] ? this.semver = new s(h[2], this.options.loose) : this.semver = e;
    }
    toString() {
      return this.value;
    }
    test(c) {
      if (a("Comparator.test", c, this.options.loose), this.semver === e || c === e)
        return !0;
      if (typeof c == "string")
        try {
          c = new s(c, this.options);
        } catch {
          return !1;
        }
      return o(c, this.operator, this.semver, this.options);
    }
    intersects(c, f) {
      if (!(c instanceof t))
        throw new TypeError("a Comparator is required");
      return this.operator === "" ? this.value === "" ? !0 : new l(c.value, f).test(this.value) : c.operator === "" ? c.value === "" ? !0 : new l(this.value, f).test(c.semver) : (f = n(f), f.includePrerelease && (this.value === "<0.0.0-0" || c.value === "<0.0.0-0") || !f.includePrerelease && (this.value.startsWith("<0.0.0") || c.value.startsWith("<0.0.0")) ? !1 : !!(this.operator.startsWith(">") && c.operator.startsWith(">") || this.operator.startsWith("<") && c.operator.startsWith("<") || this.semver.version === c.semver.version && this.operator.includes("=") && c.operator.includes("=") || o(this.semver, "<", c.semver, f) && this.operator.startsWith(">") && c.operator.startsWith("<") || o(this.semver, ">", c.semver, f) && this.operator.startsWith("<") && c.operator.startsWith(">")));
    }
  }
  Bi = t;
  const n = Ho, { safeRe: r, t: i } = Kn, o = hu, a = ai, s = Pe, l = We();
  return Bi;
}
const PE = We(), DE = (e, t, n) => {
  try {
    t = new PE(t, n);
  } catch {
    return !1;
  }
  return t.test(e);
};
var ci = DE;
const NE = We(), FE = (e, t) => new NE(e, t).set.map((n) => n.map((r) => r.value).join(" ").trim().split(" "));
var xE = FE;
const LE = Pe, UE = We(), kE = (e, t, n) => {
  let r = null, i = null, o = null;
  try {
    o = new UE(t, n);
  } catch {
    return null;
  }
  return e.forEach((a) => {
    o.test(a) && (!r || i.compare(a) === -1) && (r = a, i = new LE(r, n));
  }), r;
};
var ME = kE;
const BE = Pe, jE = We(), HE = (e, t, n) => {
  let r = null, i = null, o = null;
  try {
    o = new jE(t, n);
  } catch {
    return null;
  }
  return e.forEach((a) => {
    o.test(a) && (!r || i.compare(a) === 1) && (r = a, i = new BE(r, n));
  }), r;
};
var qE = HE;
const ji = Pe, GE = We(), ws = si, WE = (e, t) => {
  e = new GE(e, t);
  let n = new ji("0.0.0");
  if (e.test(n) || (n = new ji("0.0.0-0"), e.test(n)))
    return n;
  n = null;
  for (let r = 0; r < e.set.length; ++r) {
    const i = e.set[r];
    let o = null;
    i.forEach((a) => {
      const s = new ji(a.semver.version);
      switch (a.operator) {
        case ">":
          s.prerelease.length === 0 ? s.patch++ : s.prerelease.push(0), s.raw = s.format();
        case "":
        case ">=":
          (!o || ws(s, o)) && (o = s);
          break;
        case "<":
        case "<=":
          break;
        default:
          throw new Error(`Unexpected operation: ${a.operator}`);
      }
    }), o && (!n || ws(n, o)) && (n = o);
  }
  return n && e.test(n) ? n : null;
};
var VE = WE;
const YE = We(), zE = (e, t) => {
  try {
    return new YE(e, t).range || "*";
  } catch {
    return null;
  }
};
var XE = zE;
const KE = Pe, pu = li(), { ANY: JE } = pu, QE = We(), ZE = ci, _s = si, As = Go, ey = Vo, ty = Wo, ny = (e, t, n, r) => {
  e = new KE(e, r), t = new QE(t, r);
  let i, o, a, s, l;
  switch (n) {
    case ">":
      i = _s, o = ey, a = As, s = ">", l = ">=";
      break;
    case "<":
      i = As, o = ty, a = _s, s = "<", l = "<=";
      break;
    default:
      throw new TypeError('Must provide a hilo val of "<" or ">"');
  }
  if (ZE(e, t, r))
    return !1;
  for (let m = 0; m < t.set.length; ++m) {
    const c = t.set[m];
    let f = null, h = null;
    if (c.forEach((g) => {
      g.semver === JE && (g = new pu(">=0.0.0")), f = f || g, h = h || g, i(g.semver, f.semver, r) ? f = g : a(g.semver, h.semver, r) && (h = g);
    }), f.operator === s || f.operator === l || (!h.operator || h.operator === s) && o(e, h.semver))
      return !1;
    if (h.operator === l && a(e, h.semver))
      return !1;
  }
  return !0;
};
var Yo = ny;
const ry = Yo, iy = (e, t, n) => ry(e, t, ">", n);
var oy = iy;
const ay = Yo, sy = (e, t, n) => ay(e, t, "<", n);
var ly = sy;
const Ss = We(), cy = (e, t, n) => (e = new Ss(e, n), t = new Ss(t, n), e.intersects(t, n));
var uy = cy;
const fy = ci, dy = Ge;
var hy = (e, t, n) => {
  const r = [];
  let i = null, o = null;
  const a = e.sort((c, f) => dy(c, f, n));
  for (const c of a)
    fy(c, t, n) ? (o = c, i || (i = c)) : (o && r.push([i, o]), o = null, i = null);
  i && r.push([i, null]);
  const s = [];
  for (const [c, f] of r)
    c === f ? s.push(c) : !f && c === a[0] ? s.push("*") : f ? c === a[0] ? s.push(`<=${f}`) : s.push(`${c} - ${f}`) : s.push(`>=${c}`);
  const l = s.join(" || "), m = typeof t.raw == "string" ? t.raw : String(t);
  return l.length < m.length ? l : t;
};
const Ts = We(), zo = li(), { ANY: Hi } = zo, yn = ci, Xo = Ge, py = (e, t, n = {}) => {
  if (e === t)
    return !0;
  e = new Ts(e, n), t = new Ts(t, n);
  let r = !1;
  e: for (const i of e.set) {
    for (const o of t.set) {
      const a = gy(i, o, n);
      if (r = r || a !== null, a)
        continue e;
    }
    if (r)
      return !1;
  }
  return !0;
}, my = [new zo(">=0.0.0-0")], Cs = [new zo(">=0.0.0")], gy = (e, t, n) => {
  if (e === t)
    return !0;
  if (e.length === 1 && e[0].semver === Hi) {
    if (t.length === 1 && t[0].semver === Hi)
      return !0;
    n.includePrerelease ? e = my : e = Cs;
  }
  if (t.length === 1 && t[0].semver === Hi) {
    if (n.includePrerelease)
      return !0;
    t = Cs;
  }
  const r = /* @__PURE__ */ new Set();
  let i, o;
  for (const g of e)
    g.operator === ">" || g.operator === ">=" ? i = bs(i, g, n) : g.operator === "<" || g.operator === "<=" ? o = $s(o, g, n) : r.add(g.semver);
  if (r.size > 1)
    return null;
  let a;
  if (i && o) {
    if (a = Xo(i.semver, o.semver, n), a > 0)
      return null;
    if (a === 0 && (i.operator !== ">=" || o.operator !== "<="))
      return null;
  }
  for (const g of r) {
    if (i && !yn(g, String(i), n) || o && !yn(g, String(o), n))
      return null;
    for (const _ of t)
      if (!yn(g, String(_), n))
        return !1;
    return !0;
  }
  let s, l, m, c, f = o && !n.includePrerelease && o.semver.prerelease.length ? o.semver : !1, h = i && !n.includePrerelease && i.semver.prerelease.length ? i.semver : !1;
  f && f.prerelease.length === 1 && o.operator === "<" && f.prerelease[0] === 0 && (f = !1);
  for (const g of t) {
    if (c = c || g.operator === ">" || g.operator === ">=", m = m || g.operator === "<" || g.operator === "<=", i) {
      if (h && g.semver.prerelease && g.semver.prerelease.length && g.semver.major === h.major && g.semver.minor === h.minor && g.semver.patch === h.patch && (h = !1), g.operator === ">" || g.operator === ">=") {
        if (s = bs(i, g, n), s === g && s !== i)
          return !1;
      } else if (i.operator === ">=" && !yn(i.semver, String(g), n))
        return !1;
    }
    if (o) {
      if (f && g.semver.prerelease && g.semver.prerelease.length && g.semver.major === f.major && g.semver.minor === f.minor && g.semver.patch === f.patch && (f = !1), g.operator === "<" || g.operator === "<=") {
        if (l = $s(o, g, n), l === g && l !== o)
          return !1;
      } else if (o.operator === "<=" && !yn(o.semver, String(g), n))
        return !1;
    }
    if (!g.operator && (o || i) && a !== 0)
      return !1;
  }
  return !(i && m && !o && a !== 0 || o && c && !i && a !== 0 || h || f);
}, bs = (e, t, n) => {
  if (!e)
    return t;
  const r = Xo(e.semver, t.semver, n);
  return r > 0 ? e : r < 0 || t.operator === ">" && e.operator === ">=" ? t : e;
}, $s = (e, t, n) => {
  if (!e)
    return t;
  const r = Xo(e.semver, t.semver, n);
  return r < 0 ? e : r > 0 || t.operator === "<" && e.operator === "<=" ? t : e;
};
var Ey = py;
const qi = Kn, Os = oi, yy = Pe, Is = uu, vy = cn, wy = b0, _y = I0, Ay = P0, Sy = N0, Ty = L0, Cy = M0, by = H0, $y = W0, Oy = Ge, Iy = X0, Ry = Q0, Py = qo, Dy = nE, Ny = oE, Fy = si, xy = Go, Ly = fu, Uy = du, ky = Wo, My = Vo, By = hu, jy = OE, Hy = li(), qy = We(), Gy = ci, Wy = xE, Vy = ME, Yy = qE, zy = VE, Xy = XE, Ky = Yo, Jy = oy, Qy = ly, Zy = uy, ev = hy, tv = Ey;
var mu = {
  parse: vy,
  valid: wy,
  clean: _y,
  inc: Ay,
  diff: Sy,
  major: Ty,
  minor: Cy,
  patch: by,
  prerelease: $y,
  compare: Oy,
  rcompare: Iy,
  compareLoose: Ry,
  compareBuild: Py,
  sort: Dy,
  rsort: Ny,
  gt: Fy,
  lt: xy,
  eq: Ly,
  neq: Uy,
  gte: ky,
  lte: My,
  cmp: By,
  coerce: jy,
  Comparator: Hy,
  Range: qy,
  satisfies: Gy,
  toComparators: Wy,
  maxSatisfying: Vy,
  minSatisfying: Yy,
  minVersion: zy,
  validRange: Xy,
  outside: Ky,
  gtr: Jy,
  ltr: Qy,
  intersects: Zy,
  simplifyRange: ev,
  subset: tv,
  SemVer: yy,
  re: qi.re,
  src: qi.src,
  tokens: qi.t,
  SEMVER_SPEC_VERSION: Os.SEMVER_SPEC_VERSION,
  RELEASE_TYPES: Os.RELEASE_TYPES,
  compareIdentifiers: Is.compareIdentifiers,
  rcompareIdentifiers: Is.rcompareIdentifiers
}, Jn = {}, Wr = { exports: {} };
Wr.exports;
(function(e, t) {
  var n = 200, r = "__lodash_hash_undefined__", i = 1, o = 2, a = 9007199254740991, s = "[object Arguments]", l = "[object Array]", m = "[object AsyncFunction]", c = "[object Boolean]", f = "[object Date]", h = "[object Error]", g = "[object Function]", _ = "[object GeneratorFunction]", y = "[object Map]", A = "[object Number]", T = "[object Null]", S = "[object Object]", N = "[object Promise]", x = "[object Proxy]", Z = "[object RegExp]", ae = "[object Set]", Y = "[object String]", Fe = "[object Symbol]", E = "[object Undefined]", q = "[object WeakMap]", B = "[object ArrayBuffer]", M = "[object DataView]", X = "[object Float32Array]", I = "[object Float64Array]", $ = "[object Int8Array]", P = "[object Int16Array]", b = "[object Int32Array]", D = "[object Uint8Array]", R = "[object Uint8ClampedArray]", k = "[object Uint16Array]", G = "[object Uint32Array]", j = /[\\^$.*+?()[\]{}|]/g, K = /^\[object .+?Constructor\]$/, fe = /^(?:0|[1-9]\d*)$/, U = {};
  U[X] = U[I] = U[$] = U[P] = U[b] = U[D] = U[R] = U[k] = U[G] = !0, U[s] = U[l] = U[B] = U[c] = U[M] = U[f] = U[h] = U[g] = U[y] = U[A] = U[S] = U[Z] = U[ae] = U[Y] = U[q] = !1;
  var Ve = typeof Ce == "object" && Ce && Ce.Object === Object && Ce, d = typeof self == "object" && self && self.Object === Object && self, u = Ve || d || Function("return this")(), C = t && !t.nodeType && t, w = C && !0 && e && !e.nodeType && e, z = w && w.exports === C, ee = z && Ve.process, ie = function() {
    try {
      return ee && ee.binding && ee.binding("util");
    } catch {
    }
  }(), me = ie && ie.isTypedArray;
  function ve(p, v) {
    for (var O = -1, F = p == null ? 0 : p.length, Q = 0, H = []; ++O < F; ) {
      var oe = p[O];
      v(oe, O, p) && (H[Q++] = oe);
    }
    return H;
  }
  function it(p, v) {
    for (var O = -1, F = v.length, Q = p.length; ++O < F; )
      p[Q + O] = v[O];
    return p;
  }
  function ce(p, v) {
    for (var O = -1, F = p == null ? 0 : p.length; ++O < F; )
      if (v(p[O], O, p))
        return !0;
    return !1;
  }
  function Be(p, v) {
    for (var O = -1, F = Array(p); ++O < p; )
      F[O] = v(O);
    return F;
  }
  function yi(p) {
    return function(v) {
      return p(v);
    };
  }
  function tr(p, v) {
    return p.has(v);
  }
  function fn(p, v) {
    return p == null ? void 0 : p[v];
  }
  function nr(p) {
    var v = -1, O = Array(p.size);
    return p.forEach(function(F, Q) {
      O[++v] = [Q, F];
    }), O;
  }
  function Iu(p, v) {
    return function(O) {
      return p(v(O));
    };
  }
  function Ru(p) {
    var v = -1, O = Array(p.size);
    return p.forEach(function(F) {
      O[++v] = F;
    }), O;
  }
  var Pu = Array.prototype, Du = Function.prototype, rr = Object.prototype, vi = u["__core-js_shared__"], ea = Du.toString, Ye = rr.hasOwnProperty, ta = function() {
    var p = /[^.]+$/.exec(vi && vi.keys && vi.keys.IE_PROTO || "");
    return p ? "Symbol(src)_1." + p : "";
  }(), na = rr.toString, Nu = RegExp(
    "^" + ea.call(Ye).replace(j, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
  ), ra = z ? u.Buffer : void 0, ir = u.Symbol, ia = u.Uint8Array, oa = rr.propertyIsEnumerable, Fu = Pu.splice, At = ir ? ir.toStringTag : void 0, aa = Object.getOwnPropertySymbols, xu = ra ? ra.isBuffer : void 0, Lu = Iu(Object.keys, Object), wi = Mt(u, "DataView"), dn = Mt(u, "Map"), _i = Mt(u, "Promise"), Ai = Mt(u, "Set"), Si = Mt(u, "WeakMap"), hn = Mt(Object, "create"), Uu = Ct(wi), ku = Ct(dn), Mu = Ct(_i), Bu = Ct(Ai), ju = Ct(Si), sa = ir ? ir.prototype : void 0, Ti = sa ? sa.valueOf : void 0;
  function St(p) {
    var v = -1, O = p == null ? 0 : p.length;
    for (this.clear(); ++v < O; ) {
      var F = p[v];
      this.set(F[0], F[1]);
    }
  }
  function Hu() {
    this.__data__ = hn ? hn(null) : {}, this.size = 0;
  }
  function qu(p) {
    var v = this.has(p) && delete this.__data__[p];
    return this.size -= v ? 1 : 0, v;
  }
  function Gu(p) {
    var v = this.__data__;
    if (hn) {
      var O = v[p];
      return O === r ? void 0 : O;
    }
    return Ye.call(v, p) ? v[p] : void 0;
  }
  function Wu(p) {
    var v = this.__data__;
    return hn ? v[p] !== void 0 : Ye.call(v, p);
  }
  function Vu(p, v) {
    var O = this.__data__;
    return this.size += this.has(p) ? 0 : 1, O[p] = hn && v === void 0 ? r : v, this;
  }
  St.prototype.clear = Hu, St.prototype.delete = qu, St.prototype.get = Gu, St.prototype.has = Wu, St.prototype.set = Vu;
  function Je(p) {
    var v = -1, O = p == null ? 0 : p.length;
    for (this.clear(); ++v < O; ) {
      var F = p[v];
      this.set(F[0], F[1]);
    }
  }
  function Yu() {
    this.__data__ = [], this.size = 0;
  }
  function zu(p) {
    var v = this.__data__, O = ar(v, p);
    if (O < 0)
      return !1;
    var F = v.length - 1;
    return O == F ? v.pop() : Fu.call(v, O, 1), --this.size, !0;
  }
  function Xu(p) {
    var v = this.__data__, O = ar(v, p);
    return O < 0 ? void 0 : v[O][1];
  }
  function Ku(p) {
    return ar(this.__data__, p) > -1;
  }
  function Ju(p, v) {
    var O = this.__data__, F = ar(O, p);
    return F < 0 ? (++this.size, O.push([p, v])) : O[F][1] = v, this;
  }
  Je.prototype.clear = Yu, Je.prototype.delete = zu, Je.prototype.get = Xu, Je.prototype.has = Ku, Je.prototype.set = Ju;
  function Tt(p) {
    var v = -1, O = p == null ? 0 : p.length;
    for (this.clear(); ++v < O; ) {
      var F = p[v];
      this.set(F[0], F[1]);
    }
  }
  function Qu() {
    this.size = 0, this.__data__ = {
      hash: new St(),
      map: new (dn || Je)(),
      string: new St()
    };
  }
  function Zu(p) {
    var v = sr(this, p).delete(p);
    return this.size -= v ? 1 : 0, v;
  }
  function ef(p) {
    return sr(this, p).get(p);
  }
  function tf(p) {
    return sr(this, p).has(p);
  }
  function nf(p, v) {
    var O = sr(this, p), F = O.size;
    return O.set(p, v), this.size += O.size == F ? 0 : 1, this;
  }
  Tt.prototype.clear = Qu, Tt.prototype.delete = Zu, Tt.prototype.get = ef, Tt.prototype.has = tf, Tt.prototype.set = nf;
  function or(p) {
    var v = -1, O = p == null ? 0 : p.length;
    for (this.__data__ = new Tt(); ++v < O; )
      this.add(p[v]);
  }
  function rf(p) {
    return this.__data__.set(p, r), this;
  }
  function of(p) {
    return this.__data__.has(p);
  }
  or.prototype.add = or.prototype.push = rf, or.prototype.has = of;
  function ot(p) {
    var v = this.__data__ = new Je(p);
    this.size = v.size;
  }
  function af() {
    this.__data__ = new Je(), this.size = 0;
  }
  function sf(p) {
    var v = this.__data__, O = v.delete(p);
    return this.size = v.size, O;
  }
  function lf(p) {
    return this.__data__.get(p);
  }
  function cf(p) {
    return this.__data__.has(p);
  }
  function uf(p, v) {
    var O = this.__data__;
    if (O instanceof Je) {
      var F = O.__data__;
      if (!dn || F.length < n - 1)
        return F.push([p, v]), this.size = ++O.size, this;
      O = this.__data__ = new Tt(F);
    }
    return O.set(p, v), this.size = O.size, this;
  }
  ot.prototype.clear = af, ot.prototype.delete = sf, ot.prototype.get = lf, ot.prototype.has = cf, ot.prototype.set = uf;
  function ff(p, v) {
    var O = lr(p), F = !O && bf(p), Q = !O && !F && Ci(p), H = !O && !F && !Q && ga(p), oe = O || F || Q || H, de = oe ? Be(p.length, String) : [], ge = de.length;
    for (var te in p)
      Ye.call(p, te) && !(oe && // Safari 9 has enumerable `arguments.length` in strict mode.
      (te == "length" || // Node.js 0.10 has enumerable non-index properties on buffers.
      Q && (te == "offset" || te == "parent") || // PhantomJS 2 has enumerable non-index properties on typed arrays.
      H && (te == "buffer" || te == "byteLength" || te == "byteOffset") || // Skip index properties.
      _f(te, ge))) && de.push(te);
    return de;
  }
  function ar(p, v) {
    for (var O = p.length; O--; )
      if (da(p[O][0], v))
        return O;
    return -1;
  }
  function df(p, v, O) {
    var F = v(p);
    return lr(p) ? F : it(F, O(p));
  }
  function pn(p) {
    return p == null ? p === void 0 ? E : T : At && At in Object(p) ? vf(p) : Cf(p);
  }
  function la(p) {
    return mn(p) && pn(p) == s;
  }
  function ca(p, v, O, F, Q) {
    return p === v ? !0 : p == null || v == null || !mn(p) && !mn(v) ? p !== p && v !== v : hf(p, v, O, F, ca, Q);
  }
  function hf(p, v, O, F, Q, H) {
    var oe = lr(p), de = lr(v), ge = oe ? l : at(p), te = de ? l : at(v);
    ge = ge == s ? S : ge, te = te == s ? S : te;
    var xe = ge == S, je = te == S, we = ge == te;
    if (we && Ci(p)) {
      if (!Ci(v))
        return !1;
      oe = !0, xe = !1;
    }
    if (we && !xe)
      return H || (H = new ot()), oe || ga(p) ? ua(p, v, O, F, Q, H) : Ef(p, v, ge, O, F, Q, H);
    if (!(O & i)) {
      var Le = xe && Ye.call(p, "__wrapped__"), Ue = je && Ye.call(v, "__wrapped__");
      if (Le || Ue) {
        var st = Le ? p.value() : p, Qe = Ue ? v.value() : v;
        return H || (H = new ot()), Q(st, Qe, O, F, H);
      }
    }
    return we ? (H || (H = new ot()), yf(p, v, O, F, Q, H)) : !1;
  }
  function pf(p) {
    if (!ma(p) || Sf(p))
      return !1;
    var v = ha(p) ? Nu : K;
    return v.test(Ct(p));
  }
  function mf(p) {
    return mn(p) && pa(p.length) && !!U[pn(p)];
  }
  function gf(p) {
    if (!Tf(p))
      return Lu(p);
    var v = [];
    for (var O in Object(p))
      Ye.call(p, O) && O != "constructor" && v.push(O);
    return v;
  }
  function ua(p, v, O, F, Q, H) {
    var oe = O & i, de = p.length, ge = v.length;
    if (de != ge && !(oe && ge > de))
      return !1;
    var te = H.get(p);
    if (te && H.get(v))
      return te == v;
    var xe = -1, je = !0, we = O & o ? new or() : void 0;
    for (H.set(p, v), H.set(v, p); ++xe < de; ) {
      var Le = p[xe], Ue = v[xe];
      if (F)
        var st = oe ? F(Ue, Le, xe, v, p, H) : F(Le, Ue, xe, p, v, H);
      if (st !== void 0) {
        if (st)
          continue;
        je = !1;
        break;
      }
      if (we) {
        if (!ce(v, function(Qe, bt) {
          if (!tr(we, bt) && (Le === Qe || Q(Le, Qe, O, F, H)))
            return we.push(bt);
        })) {
          je = !1;
          break;
        }
      } else if (!(Le === Ue || Q(Le, Ue, O, F, H))) {
        je = !1;
        break;
      }
    }
    return H.delete(p), H.delete(v), je;
  }
  function Ef(p, v, O, F, Q, H, oe) {
    switch (O) {
      case M:
        if (p.byteLength != v.byteLength || p.byteOffset != v.byteOffset)
          return !1;
        p = p.buffer, v = v.buffer;
      case B:
        return !(p.byteLength != v.byteLength || !H(new ia(p), new ia(v)));
      case c:
      case f:
      case A:
        return da(+p, +v);
      case h:
        return p.name == v.name && p.message == v.message;
      case Z:
      case Y:
        return p == v + "";
      case y:
        var de = nr;
      case ae:
        var ge = F & i;
        if (de || (de = Ru), p.size != v.size && !ge)
          return !1;
        var te = oe.get(p);
        if (te)
          return te == v;
        F |= o, oe.set(p, v);
        var xe = ua(de(p), de(v), F, Q, H, oe);
        return oe.delete(p), xe;
      case Fe:
        if (Ti)
          return Ti.call(p) == Ti.call(v);
    }
    return !1;
  }
  function yf(p, v, O, F, Q, H) {
    var oe = O & i, de = fa(p), ge = de.length, te = fa(v), xe = te.length;
    if (ge != xe && !oe)
      return !1;
    for (var je = ge; je--; ) {
      var we = de[je];
      if (!(oe ? we in v : Ye.call(v, we)))
        return !1;
    }
    var Le = H.get(p);
    if (Le && H.get(v))
      return Le == v;
    var Ue = !0;
    H.set(p, v), H.set(v, p);
    for (var st = oe; ++je < ge; ) {
      we = de[je];
      var Qe = p[we], bt = v[we];
      if (F)
        var Ea = oe ? F(bt, Qe, we, v, p, H) : F(Qe, bt, we, p, v, H);
      if (!(Ea === void 0 ? Qe === bt || Q(Qe, bt, O, F, H) : Ea)) {
        Ue = !1;
        break;
      }
      st || (st = we == "constructor");
    }
    if (Ue && !st) {
      var cr = p.constructor, ur = v.constructor;
      cr != ur && "constructor" in p && "constructor" in v && !(typeof cr == "function" && cr instanceof cr && typeof ur == "function" && ur instanceof ur) && (Ue = !1);
    }
    return H.delete(p), H.delete(v), Ue;
  }
  function fa(p) {
    return df(p, If, wf);
  }
  function sr(p, v) {
    var O = p.__data__;
    return Af(v) ? O[typeof v == "string" ? "string" : "hash"] : O.map;
  }
  function Mt(p, v) {
    var O = fn(p, v);
    return pf(O) ? O : void 0;
  }
  function vf(p) {
    var v = Ye.call(p, At), O = p[At];
    try {
      p[At] = void 0;
      var F = !0;
    } catch {
    }
    var Q = na.call(p);
    return F && (v ? p[At] = O : delete p[At]), Q;
  }
  var wf = aa ? function(p) {
    return p == null ? [] : (p = Object(p), ve(aa(p), function(v) {
      return oa.call(p, v);
    }));
  } : Rf, at = pn;
  (wi && at(new wi(new ArrayBuffer(1))) != M || dn && at(new dn()) != y || _i && at(_i.resolve()) != N || Ai && at(new Ai()) != ae || Si && at(new Si()) != q) && (at = function(p) {
    var v = pn(p), O = v == S ? p.constructor : void 0, F = O ? Ct(O) : "";
    if (F)
      switch (F) {
        case Uu:
          return M;
        case ku:
          return y;
        case Mu:
          return N;
        case Bu:
          return ae;
        case ju:
          return q;
      }
    return v;
  });
  function _f(p, v) {
    return v = v ?? a, !!v && (typeof p == "number" || fe.test(p)) && p > -1 && p % 1 == 0 && p < v;
  }
  function Af(p) {
    var v = typeof p;
    return v == "string" || v == "number" || v == "symbol" || v == "boolean" ? p !== "__proto__" : p === null;
  }
  function Sf(p) {
    return !!ta && ta in p;
  }
  function Tf(p) {
    var v = p && p.constructor, O = typeof v == "function" && v.prototype || rr;
    return p === O;
  }
  function Cf(p) {
    return na.call(p);
  }
  function Ct(p) {
    if (p != null) {
      try {
        return ea.call(p);
      } catch {
      }
      try {
        return p + "";
      } catch {
      }
    }
    return "";
  }
  function da(p, v) {
    return p === v || p !== p && v !== v;
  }
  var bf = la(/* @__PURE__ */ function() {
    return arguments;
  }()) ? la : function(p) {
    return mn(p) && Ye.call(p, "callee") && !oa.call(p, "callee");
  }, lr = Array.isArray;
  function $f(p) {
    return p != null && pa(p.length) && !ha(p);
  }
  var Ci = xu || Pf;
  function Of(p, v) {
    return ca(p, v);
  }
  function ha(p) {
    if (!ma(p))
      return !1;
    var v = pn(p);
    return v == g || v == _ || v == m || v == x;
  }
  function pa(p) {
    return typeof p == "number" && p > -1 && p % 1 == 0 && p <= a;
  }
  function ma(p) {
    var v = typeof p;
    return p != null && (v == "object" || v == "function");
  }
  function mn(p) {
    return p != null && typeof p == "object";
  }
  var ga = me ? yi(me) : mf;
  function If(p) {
    return $f(p) ? ff(p) : gf(p);
  }
  function Rf() {
    return [];
  }
  function Pf() {
    return !1;
  }
  e.exports = Of;
})(Wr, Wr.exports);
var nv = Wr.exports;
Object.defineProperty(Jn, "__esModule", { value: !0 });
Jn.DownloadedUpdateHelper = void 0;
Jn.createTempUpdateFile = sv;
const rv = Gn, iv = vt, Rs = nv, Ot = wt, bn = re;
class ov {
  constructor(t) {
    this.cacheDir = t, this._file = null, this._packageFile = null, this.versionInfo = null, this.fileInfo = null, this._downloadedFileInfo = null;
  }
  get downloadedFileInfo() {
    return this._downloadedFileInfo;
  }
  get file() {
    return this._file;
  }
  get packageFile() {
    return this._packageFile;
  }
  get cacheDirForPendingUpdate() {
    return bn.join(this.cacheDir, "pending");
  }
  async validateDownloadedPath(t, n, r, i) {
    if (this.versionInfo != null && this.file === t && this.fileInfo != null)
      return Rs(this.versionInfo, n) && Rs(this.fileInfo.info, r.info) && await (0, Ot.pathExists)(t) ? t : null;
    const o = await this.getValidCachedUpdateFile(r, i);
    return o === null ? null : (i.info(`Update has already been downloaded to ${t}).`), this._file = o, o);
  }
  async setDownloadedFile(t, n, r, i, o, a) {
    this._file = t, this._packageFile = n, this.versionInfo = r, this.fileInfo = i, this._downloadedFileInfo = {
      fileName: o,
      sha512: i.info.sha512,
      isAdminRightsRequired: i.info.isAdminRightsRequired === !0
    }, a && await (0, Ot.outputJson)(this.getUpdateInfoFile(), this._downloadedFileInfo);
  }
  async clear() {
    this._file = null, this._packageFile = null, this.versionInfo = null, this.fileInfo = null, await this.cleanCacheDirForPendingUpdate();
  }
  async cleanCacheDirForPendingUpdate() {
    try {
      await (0, Ot.emptyDir)(this.cacheDirForPendingUpdate);
    } catch {
    }
  }
  /**
   * Returns "update-info.json" which is created in the update cache directory's "pending" subfolder after the first update is downloaded.  If the update file does not exist then the cache is cleared and recreated.  If the update file exists then its properties are validated.
   * @param fileInfo
   * @param logger
   */
  async getValidCachedUpdateFile(t, n) {
    const r = this.getUpdateInfoFile();
    if (!await (0, Ot.pathExists)(r))
      return null;
    let o;
    try {
      o = await (0, Ot.readJson)(r);
    } catch (m) {
      let c = "No cached update info available";
      return m.code !== "ENOENT" && (await this.cleanCacheDirForPendingUpdate(), c += ` (error on read: ${m.message})`), n.info(c), null;
    }
    if (!((o == null ? void 0 : o.fileName) !== null))
      return n.warn("Cached update info is corrupted: no fileName, directory for cached update will be cleaned"), await this.cleanCacheDirForPendingUpdate(), null;
    if (t.info.sha512 !== o.sha512)
      return n.info(`Cached update sha512 checksum doesn't match the latest available update. New update must be downloaded. Cached: ${o.sha512}, expected: ${t.info.sha512}. Directory for cached update will be cleaned`), await this.cleanCacheDirForPendingUpdate(), null;
    const s = bn.join(this.cacheDirForPendingUpdate, o.fileName);
    if (!await (0, Ot.pathExists)(s))
      return n.info("Cached update file doesn't exist"), null;
    const l = await av(s);
    return t.info.sha512 !== l ? (n.warn(`Sha512 checksum doesn't match the latest available update. New update must be downloaded. Cached: ${l}, expected: ${t.info.sha512}`), await this.cleanCacheDirForPendingUpdate(), null) : (this._downloadedFileInfo = o, s);
  }
  getUpdateInfoFile() {
    return bn.join(this.cacheDirForPendingUpdate, "update-info.json");
  }
}
Jn.DownloadedUpdateHelper = ov;
function av(e, t = "sha512", n = "base64", r) {
  return new Promise((i, o) => {
    const a = (0, rv.createHash)(t);
    a.on("error", o).setEncoding(n), (0, iv.createReadStream)(e, {
      ...r,
      highWaterMark: 1024 * 1024
      /* better to use more memory but hash faster */
    }).on("error", o).on("end", () => {
      a.end(), i(a.read());
    }).pipe(a, { end: !1 });
  });
}
async function sv(e, t, n) {
  let r = 0, i = bn.join(t, e);
  for (let o = 0; o < 3; o++)
    try {
      return await (0, Ot.unlink)(i), i;
    } catch (a) {
      if (a.code === "ENOENT")
        return i;
      n.warn(`Error on remove temp update file: ${a}`), i = bn.join(t, `${r++}-${e}`);
    }
  return i;
}
var ui = {}, Ko = {};
Object.defineProperty(Ko, "__esModule", { value: !0 });
Ko.getAppCacheDir = cv;
const Gi = re, lv = Xr;
function cv() {
  const e = (0, lv.homedir)();
  let t;
  return process.platform === "win32" ? t = process.env.LOCALAPPDATA || Gi.join(e, "AppData", "Local") : process.platform === "darwin" ? t = Gi.join(e, "Library", "Caches") : t = process.env.XDG_CACHE_HOME || Gi.join(e, ".cache"), t;
}
Object.defineProperty(ui, "__esModule", { value: !0 });
ui.ElectronAppAdapter = void 0;
const Ps = re, uv = Ko;
class fv {
  constructor(t = Ft.app) {
    this.app = t;
  }
  whenReady() {
    return this.app.whenReady();
  }
  get version() {
    return this.app.getVersion();
  }
  get name() {
    return this.app.getName();
  }
  get isPackaged() {
    return this.app.isPackaged === !0;
  }
  get appUpdateConfigPath() {
    return this.isPackaged ? Ps.join(process.resourcesPath, "app-update.yml") : Ps.join(this.app.getAppPath(), "dev-app-update.yml");
  }
  get userDataPath() {
    return this.app.getPath("userData");
  }
  get baseCachePath() {
    return (0, uv.getAppCacheDir)();
  }
  quit() {
    this.app.quit();
  }
  relaunch() {
    this.app.relaunch();
  }
  onQuit(t) {
    this.app.once("quit", (n, r) => t(r));
  }
}
ui.ElectronAppAdapter = fv;
var gu = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.ElectronHttpExecutor = e.NET_SESSION_NAME = void 0, e.getNetSession = n;
  const t = pe;
  e.NET_SESSION_NAME = "electron-updater";
  function n() {
    return Ft.session.fromPartition(e.NET_SESSION_NAME, {
      cache: !1
    });
  }
  class r extends t.HttpExecutor {
    constructor(o) {
      super(), this.proxyLoginCallback = o, this.cachedSession = null;
    }
    async download(o, a, s) {
      return await s.cancellationToken.createPromise((l, m, c) => {
        const f = {
          headers: s.headers || void 0,
          redirect: "manual"
        };
        (0, t.configureRequestUrl)(o, f), (0, t.configureRequestOptions)(f), this.doDownload(f, {
          destination: a,
          options: s,
          onCancel: c,
          callback: (h) => {
            h == null ? l(a) : m(h);
          },
          responseHandler: null
        }, 0);
      });
    }
    createRequest(o, a) {
      o.headers && o.headers.Host && (o.host = o.headers.Host, delete o.headers.Host), this.cachedSession == null && (this.cachedSession = n());
      const s = Ft.net.request({
        ...o,
        session: this.cachedSession
      });
      return s.on("response", a), this.proxyLoginCallback != null && s.on("login", this.proxyLoginCallback), s;
    }
    addRedirectHandlers(o, a, s, l, m) {
      o.on("redirect", (c, f, h) => {
        o.abort(), l > this.maxRedirects ? s(this.createMaxRedirectError()) : m(t.HttpExecutor.prepareRedirectUrlOptions(h, a));
      });
    }
  }
  e.ElectronHttpExecutor = r;
})(gu);
var Qn = {}, Me = {}, dv = "[object Symbol]", Eu = /[\\^$.*+?()[\]{}|]/g, hv = RegExp(Eu.source), pv = typeof Ce == "object" && Ce && Ce.Object === Object && Ce, mv = typeof self == "object" && self && self.Object === Object && self, gv = pv || mv || Function("return this")(), Ev = Object.prototype, yv = Ev.toString, Ds = gv.Symbol, Ns = Ds ? Ds.prototype : void 0, Fs = Ns ? Ns.toString : void 0;
function vv(e) {
  if (typeof e == "string")
    return e;
  if (_v(e))
    return Fs ? Fs.call(e) : "";
  var t = e + "";
  return t == "0" && 1 / e == -1 / 0 ? "-0" : t;
}
function wv(e) {
  return !!e && typeof e == "object";
}
function _v(e) {
  return typeof e == "symbol" || wv(e) && yv.call(e) == dv;
}
function Av(e) {
  return e == null ? "" : vv(e);
}
function Sv(e) {
  return e = Av(e), e && hv.test(e) ? e.replace(Eu, "\\$&") : e;
}
var Tv = Sv;
Object.defineProperty(Me, "__esModule", { value: !0 });
Me.newBaseUrl = bv;
Me.newUrlFromBase = Eo;
Me.getChannelFilename = $v;
Me.blockmapFiles = Ov;
const yu = an, Cv = Tv;
function bv(e) {
  const t = new yu.URL(e);
  return t.pathname.endsWith("/") || (t.pathname += "/"), t;
}
function Eo(e, t, n = !1) {
  const r = new yu.URL(e, t), i = t.search;
  return i != null && i.length !== 0 ? r.search = i : n && (r.search = `noCache=${Date.now().toString(32)}`), r;
}
function $v(e) {
  return `${e}.yml`;
}
function Ov(e, t, n) {
  const r = Eo(`${e.pathname}.blockmap`, e);
  return [Eo(`${e.pathname.replace(new RegExp(Cv(n), "g"), t)}.blockmap`, e), r];
}
var ue = {};
Object.defineProperty(ue, "__esModule", { value: !0 });
ue.Provider = void 0;
ue.findFile = Pv;
ue.parseUpdateInfo = Dv;
ue.getFileList = vu;
ue.resolveFiles = Nv;
const Et = pe, Iv = ye, xs = Me;
class Rv {
  constructor(t) {
    this.runtimeOptions = t, this.requestHeaders = null, this.executor = t.executor;
  }
  get isUseMultipleRangeRequest() {
    return this.runtimeOptions.isUseMultipleRangeRequest !== !1;
  }
  getChannelFilePrefix() {
    if (this.runtimeOptions.platform === "linux") {
      const t = process.env.TEST_UPDATER_ARCH || process.arch;
      return "-linux" + (t === "x64" ? "" : `-${t}`);
    } else
      return this.runtimeOptions.platform === "darwin" ? "-mac" : "";
  }
  // due to historical reasons for windows we use channel name without platform specifier
  getDefaultChannelName() {
    return this.getCustomChannelName("latest");
  }
  getCustomChannelName(t) {
    return `${t}${this.getChannelFilePrefix()}`;
  }
  get fileExtraDownloadHeaders() {
    return null;
  }
  setRequestHeaders(t) {
    this.requestHeaders = t;
  }
  /**
   * Method to perform API request only to resolve update info, but not to download update.
   */
  httpRequest(t, n, r) {
    return this.executor.request(this.createRequestOptions(t, n), r);
  }
  createRequestOptions(t, n) {
    const r = {};
    return this.requestHeaders == null ? n != null && (r.headers = n) : r.headers = n == null ? this.requestHeaders : { ...this.requestHeaders, ...n }, (0, Et.configureRequestUrl)(t, r), r;
  }
}
ue.Provider = Rv;
function Pv(e, t, n) {
  if (e.length === 0)
    throw (0, Et.newError)("No files provided", "ERR_UPDATER_NO_FILES_PROVIDED");
  const r = e.find((i) => i.url.pathname.toLowerCase().endsWith(`.${t}`));
  return r ?? (n == null ? e[0] : e.find((i) => !n.some((o) => i.url.pathname.toLowerCase().endsWith(`.${o}`))));
}
function Dv(e, t, n) {
  if (e == null)
    throw (0, Et.newError)(`Cannot parse update info from ${t} in the latest release artifacts (${n}): rawData: null`, "ERR_UPDATER_INVALID_UPDATE_INFO");
  let r;
  try {
    r = (0, Iv.load)(e);
  } catch (i) {
    throw (0, Et.newError)(`Cannot parse update info from ${t} in the latest release artifacts (${n}): ${i.stack || i.message}, rawData: ${e}`, "ERR_UPDATER_INVALID_UPDATE_INFO");
  }
  return r;
}
function vu(e) {
  const t = e.files;
  if (t != null && t.length > 0)
    return t;
  if (e.path != null)
    return [
      {
        url: e.path,
        sha2: e.sha2,
        sha512: e.sha512
      }
    ];
  throw (0, Et.newError)(`No files provided: ${(0, Et.safeStringifyJson)(e)}`, "ERR_UPDATER_NO_FILES_PROVIDED");
}
function Nv(e, t, n = (r) => r) {
  const i = vu(e).map((s) => {
    if (s.sha2 == null && s.sha512 == null)
      throw (0, Et.newError)(`Update info doesn't contain nor sha256 neither sha512 checksum: ${(0, Et.safeStringifyJson)(s)}`, "ERR_UPDATER_NO_CHECKSUM");
    return {
      url: (0, xs.newUrlFromBase)(n(s.url), t),
      info: s
    };
  }), o = e.packages, a = o == null ? null : o[process.arch] || o.ia32;
  return a != null && (i[0].packageInfo = {
    ...a,
    path: (0, xs.newUrlFromBase)(n(a.path), t).href
  }), i;
}
Object.defineProperty(Qn, "__esModule", { value: !0 });
Qn.GenericProvider = void 0;
const Ls = pe, Wi = Me, Vi = ue;
class Fv extends Vi.Provider {
  constructor(t, n, r) {
    super(r), this.configuration = t, this.updater = n, this.baseUrl = (0, Wi.newBaseUrl)(this.configuration.url);
  }
  get channel() {
    const t = this.updater.channel || this.configuration.channel;
    return t == null ? this.getDefaultChannelName() : this.getCustomChannelName(t);
  }
  async getLatestVersion() {
    const t = (0, Wi.getChannelFilename)(this.channel), n = (0, Wi.newUrlFromBase)(t, this.baseUrl, this.updater.isAddNoCacheQuery);
    for (let r = 0; ; r++)
      try {
        return (0, Vi.parseUpdateInfo)(await this.httpRequest(n), t, n);
      } catch (i) {
        if (i instanceof Ls.HttpError && i.statusCode === 404)
          throw (0, Ls.newError)(`Cannot find channel "${t}" update info: ${i.stack || i.message}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND");
        if (i.code === "ECONNREFUSED" && r < 3) {
          await new Promise((o, a) => {
            try {
              setTimeout(o, 1e3 * r);
            } catch (s) {
              a(s);
            }
          });
          continue;
        }
        throw i;
      }
  }
  resolveFiles(t) {
    return (0, Vi.resolveFiles)(t, this.baseUrl);
  }
}
Qn.GenericProvider = Fv;
var fi = {}, di = {};
Object.defineProperty(di, "__esModule", { value: !0 });
di.BitbucketProvider = void 0;
const Us = pe, Yi = Me, zi = ue;
class xv extends zi.Provider {
  constructor(t, n, r) {
    super({
      ...r,
      isUseMultipleRangeRequest: !1
    }), this.configuration = t, this.updater = n;
    const { owner: i, slug: o } = t;
    this.baseUrl = (0, Yi.newBaseUrl)(`https://api.bitbucket.org/2.0/repositories/${i}/${o}/downloads`);
  }
  get channel() {
    return this.updater.channel || this.configuration.channel || "latest";
  }
  async getLatestVersion() {
    const t = new Us.CancellationToken(), n = (0, Yi.getChannelFilename)(this.getCustomChannelName(this.channel)), r = (0, Yi.newUrlFromBase)(n, this.baseUrl, this.updater.isAddNoCacheQuery);
    try {
      const i = await this.httpRequest(r, void 0, t);
      return (0, zi.parseUpdateInfo)(i, n, r);
    } catch (i) {
      throw (0, Us.newError)(`Unable to find latest version on ${this.toString()}, please ensure release exists: ${i.stack || i.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
    }
  }
  resolveFiles(t) {
    return (0, zi.resolveFiles)(t, this.baseUrl);
  }
  toString() {
    const { owner: t, slug: n } = this.configuration;
    return `Bitbucket (owner: ${t}, slug: ${n}, channel: ${this.channel})`;
  }
}
di.BitbucketProvider = xv;
var yt = {};
Object.defineProperty(yt, "__esModule", { value: !0 });
yt.GitHubProvider = yt.BaseGitHubProvider = void 0;
yt.computeReleaseNotes = _u;
const Ze = pe, Xt = mu, Lv = an, Kt = Me, yo = ue, Xi = /\/tag\/([^/]+)$/;
class wu extends yo.Provider {
  constructor(t, n, r) {
    super({
      ...r,
      /* because GitHib uses S3 */
      isUseMultipleRangeRequest: !1
    }), this.options = t, this.baseUrl = (0, Kt.newBaseUrl)((0, Ze.githubUrl)(t, n));
    const i = n === "github.com" ? "api.github.com" : n;
    this.baseApiUrl = (0, Kt.newBaseUrl)((0, Ze.githubUrl)(t, i));
  }
  computeGithubBasePath(t) {
    const n = this.options.host;
    return n && !["github.com", "api.github.com"].includes(n) ? `/api/v3${t}` : t;
  }
}
yt.BaseGitHubProvider = wu;
class Uv extends wu {
  constructor(t, n, r) {
    super(t, "github.com", r), this.options = t, this.updater = n;
  }
  get channel() {
    const t = this.updater.channel || this.options.channel;
    return t == null ? this.getDefaultChannelName() : this.getCustomChannelName(t);
  }
  async getLatestVersion() {
    var t, n, r, i, o;
    const a = new Ze.CancellationToken(), s = await this.httpRequest((0, Kt.newUrlFromBase)(`${this.basePath}.atom`, this.baseUrl), {
      accept: "application/xml, application/atom+xml, text/xml, */*"
    }, a), l = (0, Ze.parseXml)(s);
    let m = l.element("entry", !1, "No published versions on GitHub"), c = null;
    try {
      if (this.updater.allowPrerelease) {
        const A = ((t = this.updater) === null || t === void 0 ? void 0 : t.channel) || ((n = Xt.prerelease(this.updater.currentVersion)) === null || n === void 0 ? void 0 : n[0]) || null;
        if (A === null)
          c = Xi.exec(m.element("link").attribute("href"))[1];
        else
          for (const T of l.getElements("entry")) {
            const S = Xi.exec(T.element("link").attribute("href"));
            if (S === null)
              continue;
            const N = S[1], x = ((r = Xt.prerelease(N)) === null || r === void 0 ? void 0 : r[0]) || null, Z = !A || ["alpha", "beta"].includes(A), ae = x !== null && !["alpha", "beta"].includes(String(x));
            if (Z && !ae && !(A === "beta" && x === "alpha")) {
              c = N;
              break;
            }
            if (x && x === A) {
              c = N;
              break;
            }
          }
      } else {
        c = await this.getLatestTagName(a);
        for (const A of l.getElements("entry"))
          if (Xi.exec(A.element("link").attribute("href"))[1] === c) {
            m = A;
            break;
          }
      }
    } catch (A) {
      throw (0, Ze.newError)(`Cannot parse releases feed: ${A.stack || A.message},
XML:
${s}`, "ERR_UPDATER_INVALID_RELEASE_FEED");
    }
    if (c == null)
      throw (0, Ze.newError)("No published versions on GitHub", "ERR_UPDATER_NO_PUBLISHED_VERSIONS");
    let f, h = "", g = "";
    const _ = async (A) => {
      h = (0, Kt.getChannelFilename)(A), g = (0, Kt.newUrlFromBase)(this.getBaseDownloadPath(String(c), h), this.baseUrl);
      const T = this.createRequestOptions(g);
      try {
        return await this.executor.request(T, a);
      } catch (S) {
        throw S instanceof Ze.HttpError && S.statusCode === 404 ? (0, Ze.newError)(`Cannot find ${h} in the latest release artifacts (${g}): ${S.stack || S.message}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND") : S;
      }
    };
    try {
      let A = this.channel;
      this.updater.allowPrerelease && (!((i = Xt.prerelease(c)) === null || i === void 0) && i[0]) && (A = this.getCustomChannelName(String((o = Xt.prerelease(c)) === null || o === void 0 ? void 0 : o[0]))), f = await _(A);
    } catch (A) {
      if (this.updater.allowPrerelease)
        f = await _(this.getDefaultChannelName());
      else
        throw A;
    }
    const y = (0, yo.parseUpdateInfo)(f, h, g);
    return y.releaseName == null && (y.releaseName = m.elementValueOrEmpty("title")), y.releaseNotes == null && (y.releaseNotes = _u(this.updater.currentVersion, this.updater.fullChangelog, l, m)), {
      tag: c,
      ...y
    };
  }
  async getLatestTagName(t) {
    const n = this.options, r = n.host == null || n.host === "github.com" ? (0, Kt.newUrlFromBase)(`${this.basePath}/latest`, this.baseUrl) : new Lv.URL(`${this.computeGithubBasePath(`/repos/${n.owner}/${n.repo}/releases`)}/latest`, this.baseApiUrl);
    try {
      const i = await this.httpRequest(r, { Accept: "application/json" }, t);
      return i == null ? null : JSON.parse(i).tag_name;
    } catch (i) {
      throw (0, Ze.newError)(`Unable to find latest version on GitHub (${r}), please ensure a production release exists: ${i.stack || i.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
    }
  }
  get basePath() {
    return `/${this.options.owner}/${this.options.repo}/releases`;
  }
  resolveFiles(t) {
    return (0, yo.resolveFiles)(t, this.baseUrl, (n) => this.getBaseDownloadPath(t.tag, n.replace(/ /g, "-")));
  }
  getBaseDownloadPath(t, n) {
    return `${this.basePath}/download/${t}/${n}`;
  }
}
yt.GitHubProvider = Uv;
function ks(e) {
  const t = e.elementValueOrEmpty("content");
  return t === "No content." ? "" : t;
}
function _u(e, t, n, r) {
  if (!t)
    return ks(r);
  const i = [];
  for (const o of n.getElements("entry")) {
    const a = /\/tag\/v?([^/]+)$/.exec(o.element("link").attribute("href"))[1];
    Xt.lt(e, a) && i.push({
      version: a,
      note: ks(o)
    });
  }
  return i.sort((o, a) => Xt.rcompare(o.version, a.version));
}
var hi = {};
Object.defineProperty(hi, "__esModule", { value: !0 });
hi.KeygenProvider = void 0;
const Ms = pe, Ki = Me, Ji = ue;
class kv extends Ji.Provider {
  constructor(t, n, r) {
    super({
      ...r,
      isUseMultipleRangeRequest: !1
    }), this.configuration = t, this.updater = n, this.defaultHostname = "api.keygen.sh";
    const i = this.configuration.host || this.defaultHostname;
    this.baseUrl = (0, Ki.newBaseUrl)(`https://${i}/v1/accounts/${this.configuration.account}/artifacts?product=${this.configuration.product}`);
  }
  get channel() {
    return this.updater.channel || this.configuration.channel || "stable";
  }
  async getLatestVersion() {
    const t = new Ms.CancellationToken(), n = (0, Ki.getChannelFilename)(this.getCustomChannelName(this.channel)), r = (0, Ki.newUrlFromBase)(n, this.baseUrl, this.updater.isAddNoCacheQuery);
    try {
      const i = await this.httpRequest(r, {
        Accept: "application/vnd.api+json",
        "Keygen-Version": "1.1"
      }, t);
      return (0, Ji.parseUpdateInfo)(i, n, r);
    } catch (i) {
      throw (0, Ms.newError)(`Unable to find latest version on ${this.toString()}, please ensure release exists: ${i.stack || i.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
    }
  }
  resolveFiles(t) {
    return (0, Ji.resolveFiles)(t, this.baseUrl);
  }
  toString() {
    const { account: t, product: n, platform: r } = this.configuration;
    return `Keygen (account: ${t}, product: ${n}, platform: ${r}, channel: ${this.channel})`;
  }
}
hi.KeygenProvider = kv;
var pi = {};
Object.defineProperty(pi, "__esModule", { value: !0 });
pi.PrivateGitHubProvider = void 0;
const Ht = pe, Mv = ye, Bv = re, Bs = an, js = Me, jv = yt, Hv = ue;
class qv extends jv.BaseGitHubProvider {
  constructor(t, n, r, i) {
    super(t, "api.github.com", i), this.updater = n, this.token = r;
  }
  createRequestOptions(t, n) {
    const r = super.createRequestOptions(t, n);
    return r.redirect = "manual", r;
  }
  async getLatestVersion() {
    const t = new Ht.CancellationToken(), n = (0, js.getChannelFilename)(this.getDefaultChannelName()), r = await this.getLatestVersionInfo(t), i = r.assets.find((s) => s.name === n);
    if (i == null)
      throw (0, Ht.newError)(`Cannot find ${n} in the release ${r.html_url || r.name}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND");
    const o = new Bs.URL(i.url);
    let a;
    try {
      a = (0, Mv.load)(await this.httpRequest(o, this.configureHeaders("application/octet-stream"), t));
    } catch (s) {
      throw s instanceof Ht.HttpError && s.statusCode === 404 ? (0, Ht.newError)(`Cannot find ${n} in the latest release artifacts (${o}): ${s.stack || s.message}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND") : s;
    }
    return a.assets = r.assets, a;
  }
  get fileExtraDownloadHeaders() {
    return this.configureHeaders("application/octet-stream");
  }
  configureHeaders(t) {
    return {
      accept: t,
      authorization: `token ${this.token}`
    };
  }
  async getLatestVersionInfo(t) {
    const n = this.updater.allowPrerelease;
    let r = this.basePath;
    n || (r = `${r}/latest`);
    const i = (0, js.newUrlFromBase)(r, this.baseUrl);
    try {
      const o = JSON.parse(await this.httpRequest(i, this.configureHeaders("application/vnd.github.v3+json"), t));
      return n ? o.find((a) => a.prerelease) || o[0] : o;
    } catch (o) {
      throw (0, Ht.newError)(`Unable to find latest version on GitHub (${i}), please ensure a production release exists: ${o.stack || o.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
    }
  }
  get basePath() {
    return this.computeGithubBasePath(`/repos/${this.options.owner}/${this.options.repo}/releases`);
  }
  resolveFiles(t) {
    return (0, Hv.getFileList)(t).map((n) => {
      const r = Bv.posix.basename(n.url).replace(/ /g, "-"), i = t.assets.find((o) => o != null && o.name === r);
      if (i == null)
        throw (0, Ht.newError)(`Cannot find asset "${r}" in: ${JSON.stringify(t.assets, null, 2)}`, "ERR_UPDATER_ASSET_NOT_FOUND");
      return {
        url: new Bs.URL(i.url),
        info: n
      };
    });
  }
}
pi.PrivateGitHubProvider = qv;
Object.defineProperty(fi, "__esModule", { value: !0 });
fi.isUrlProbablySupportMultiRangeRequests = Au;
fi.createClient = zv;
const Sr = pe, Gv = di, Hs = Qn, Wv = yt, Vv = hi, Yv = pi;
function Au(e) {
  return !e.includes("s3.amazonaws.com");
}
function zv(e, t, n) {
  if (typeof e == "string")
    throw (0, Sr.newError)("Please pass PublishConfiguration object", "ERR_UPDATER_INVALID_PROVIDER_CONFIGURATION");
  const r = e.provider;
  switch (r) {
    case "github": {
      const i = e, o = (i.private ? process.env.GH_TOKEN || process.env.GITHUB_TOKEN : null) || i.token;
      return o == null ? new Wv.GitHubProvider(i, t, n) : new Yv.PrivateGitHubProvider(i, t, o, n);
    }
    case "bitbucket":
      return new Gv.BitbucketProvider(e, t, n);
    case "keygen":
      return new Vv.KeygenProvider(e, t, n);
    case "s3":
    case "spaces":
      return new Hs.GenericProvider({
        provider: "generic",
        url: (0, Sr.getS3LikeProviderBaseUrl)(e),
        channel: e.channel || null
      }, t, {
        ...n,
        // https://github.com/minio/minio/issues/5285#issuecomment-350428955
        isUseMultipleRangeRequest: !1
      });
    case "generic": {
      const i = e;
      return new Hs.GenericProvider(i, t, {
        ...n,
        isUseMultipleRangeRequest: i.useMultipleRangeRequest !== !1 && Au(i.url)
      });
    }
    case "custom": {
      const i = e, o = i.updateProvider;
      if (!o)
        throw (0, Sr.newError)("Custom provider not specified", "ERR_UPDATER_INVALID_PROVIDER_CONFIGURATION");
      return new o(i, t, n);
    }
    default:
      throw (0, Sr.newError)(`Unsupported provider: ${r}`, "ERR_UPDATER_UNSUPPORTED_PROVIDER");
  }
}
var mi = {}, Zn = {}, un = {}, kt = {};
Object.defineProperty(kt, "__esModule", { value: !0 });
kt.OperationKind = void 0;
kt.computeOperations = Xv;
var Pt;
(function(e) {
  e[e.COPY = 0] = "COPY", e[e.DOWNLOAD = 1] = "DOWNLOAD";
})(Pt || (kt.OperationKind = Pt = {}));
function Xv(e, t, n) {
  const r = Gs(e.files), i = Gs(t.files);
  let o = null;
  const a = t.files[0], s = [], l = a.name, m = r.get(l);
  if (m == null)
    throw new Error(`no file ${l} in old blockmap`);
  const c = i.get(l);
  let f = 0;
  const { checksumToOffset: h, checksumToOldSize: g } = Jv(r.get(l), m.offset, n);
  let _ = a.offset;
  for (let y = 0; y < c.checksums.length; _ += c.sizes[y], y++) {
    const A = c.sizes[y], T = c.checksums[y];
    let S = h.get(T);
    S != null && g.get(T) !== A && (n.warn(`Checksum ("${T}") matches, but size differs (old: ${g.get(T)}, new: ${A})`), S = void 0), S === void 0 ? (f++, o != null && o.kind === Pt.DOWNLOAD && o.end === _ ? o.end += A : (o = {
      kind: Pt.DOWNLOAD,
      start: _,
      end: _ + A
      // oldBlocks: null,
    }, qs(o, s, T, y))) : o != null && o.kind === Pt.COPY && o.end === S ? o.end += A : (o = {
      kind: Pt.COPY,
      start: S,
      end: S + A
      // oldBlocks: [checksum]
    }, qs(o, s, T, y));
  }
  return f > 0 && n.info(`File${a.name === "file" ? "" : " " + a.name} has ${f} changed blocks`), s;
}
const Kv = process.env.DIFFERENTIAL_DOWNLOAD_PLAN_BUILDER_VALIDATE_RANGES === "true";
function qs(e, t, n, r) {
  if (Kv && t.length !== 0) {
    const i = t[t.length - 1];
    if (i.kind === e.kind && e.start < i.end && e.start > i.start) {
      const o = [i.start, i.end, e.start, e.end].reduce((a, s) => a < s ? a : s);
      throw new Error(`operation (block index: ${r}, checksum: ${n}, kind: ${Pt[e.kind]}) overlaps previous operation (checksum: ${n}):
abs: ${i.start} until ${i.end} and ${e.start} until ${e.end}
rel: ${i.start - o} until ${i.end - o} and ${e.start - o} until ${e.end - o}`);
    }
  }
  t.push(e);
}
function Jv(e, t, n) {
  const r = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map();
  let o = t;
  for (let a = 0; a < e.checksums.length; a++) {
    const s = e.checksums[a], l = e.sizes[a], m = i.get(s);
    if (m === void 0)
      r.set(s, o), i.set(s, l);
    else if (n.debug != null) {
      const c = m === l ? "(same size)" : `(size: ${m}, this size: ${l})`;
      n.debug(`${s} duplicated in blockmap ${c}, it doesn't lead to broken differential downloader, just corresponding block will be skipped)`);
    }
    o += l;
  }
  return { checksumToOffset: r, checksumToOldSize: i };
}
function Gs(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e)
    t.set(n.name, n);
  return t;
}
Object.defineProperty(un, "__esModule", { value: !0 });
un.DataSplitter = void 0;
un.copyData = Su;
const Tr = pe, Qv = vt, Zv = qn, ew = kt, Ws = Buffer.from(`\r
\r
`);
var ct;
(function(e) {
  e[e.INIT = 0] = "INIT", e[e.HEADER = 1] = "HEADER", e[e.BODY = 2] = "BODY";
})(ct || (ct = {}));
function Su(e, t, n, r, i) {
  const o = (0, Qv.createReadStream)("", {
    fd: n,
    autoClose: !1,
    start: e.start,
    // end is inclusive
    end: e.end - 1
  });
  o.on("error", r), o.once("end", i), o.pipe(t, {
    end: !1
  });
}
class tw extends Zv.Writable {
  constructor(t, n, r, i, o, a) {
    super(), this.out = t, this.options = n, this.partIndexToTaskIndex = r, this.partIndexToLength = o, this.finishHandler = a, this.partIndex = -1, this.headerListBuffer = null, this.readState = ct.INIT, this.ignoreByteCount = 0, this.remainingPartDataCount = 0, this.actualPartLength = 0, this.boundaryLength = i.length + 4, this.ignoreByteCount = this.boundaryLength - 2;
  }
  get isFinished() {
    return this.partIndex === this.partIndexToLength.length;
  }
  // noinspection JSUnusedGlobalSymbols
  _write(t, n, r) {
    if (this.isFinished) {
      console.error(`Trailing ignored data: ${t.length} bytes`);
      return;
    }
    this.handleData(t).then(r).catch(r);
  }
  async handleData(t) {
    let n = 0;
    if (this.ignoreByteCount !== 0 && this.remainingPartDataCount !== 0)
      throw (0, Tr.newError)("Internal error", "ERR_DATA_SPLITTER_BYTE_COUNT_MISMATCH");
    if (this.ignoreByteCount > 0) {
      const r = Math.min(this.ignoreByteCount, t.length);
      this.ignoreByteCount -= r, n = r;
    } else if (this.remainingPartDataCount > 0) {
      const r = Math.min(this.remainingPartDataCount, t.length);
      this.remainingPartDataCount -= r, await this.processPartData(t, 0, r), n = r;
    }
    if (n !== t.length) {
      if (this.readState === ct.HEADER) {
        const r = this.searchHeaderListEnd(t, n);
        if (r === -1)
          return;
        n = r, this.readState = ct.BODY, this.headerListBuffer = null;
      }
      for (; ; ) {
        if (this.readState === ct.BODY)
          this.readState = ct.INIT;
        else {
          this.partIndex++;
          let a = this.partIndexToTaskIndex.get(this.partIndex);
          if (a == null)
            if (this.isFinished)
              a = this.options.end;
            else
              throw (0, Tr.newError)("taskIndex is null", "ERR_DATA_SPLITTER_TASK_INDEX_IS_NULL");
          const s = this.partIndex === 0 ? this.options.start : this.partIndexToTaskIndex.get(this.partIndex - 1) + 1;
          if (s < a)
            await this.copyExistingData(s, a);
          else if (s > a)
            throw (0, Tr.newError)("prevTaskIndex must be < taskIndex", "ERR_DATA_SPLITTER_TASK_INDEX_ASSERT_FAILED");
          if (this.isFinished) {
            this.onPartEnd(), this.finishHandler();
            return;
          }
          if (n = this.searchHeaderListEnd(t, n), n === -1) {
            this.readState = ct.HEADER;
            return;
          }
        }
        const r = this.partIndexToLength[this.partIndex], i = n + r, o = Math.min(i, t.length);
        if (await this.processPartStarted(t, n, o), this.remainingPartDataCount = r - (o - n), this.remainingPartDataCount > 0)
          return;
        if (n = i + this.boundaryLength, n >= t.length) {
          this.ignoreByteCount = this.boundaryLength - (t.length - i);
          return;
        }
      }
    }
  }
  copyExistingData(t, n) {
    return new Promise((r, i) => {
      const o = () => {
        if (t === n) {
          r();
          return;
        }
        const a = this.options.tasks[t];
        if (a.kind !== ew.OperationKind.COPY) {
          i(new Error("Task kind must be COPY"));
          return;
        }
        Su(a, this.out, this.options.oldFileFd, i, () => {
          t++, o();
        });
      };
      o();
    });
  }
  searchHeaderListEnd(t, n) {
    const r = t.indexOf(Ws, n);
    if (r !== -1)
      return r + Ws.length;
    const i = n === 0 ? t : t.slice(n);
    return this.headerListBuffer == null ? this.headerListBuffer = i : this.headerListBuffer = Buffer.concat([this.headerListBuffer, i]), -1;
  }
  onPartEnd() {
    const t = this.partIndexToLength[this.partIndex - 1];
    if (this.actualPartLength !== t)
      throw (0, Tr.newError)(`Expected length: ${t} differs from actual: ${this.actualPartLength}`, "ERR_DATA_SPLITTER_LENGTH_MISMATCH");
    this.actualPartLength = 0;
  }
  processPartStarted(t, n, r) {
    return this.partIndex !== 0 && this.onPartEnd(), this.processPartData(t, n, r);
  }
  processPartData(t, n, r) {
    this.actualPartLength += r - n;
    const i = this.out;
    return i.write(n === 0 && t.length === r ? t : t.slice(n, r)) ? Promise.resolve() : new Promise((o, a) => {
      i.on("error", a), i.once("drain", () => {
        i.removeListener("error", a), o();
      });
    });
  }
}
un.DataSplitter = tw;
var gi = {};
Object.defineProperty(gi, "__esModule", { value: !0 });
gi.executeTasksUsingMultipleRangeRequests = nw;
gi.checkIsRangesSupported = wo;
const vo = pe, Vs = un, Ys = kt;
function nw(e, t, n, r, i) {
  const o = (a) => {
    if (a >= t.length) {
      e.fileMetadataBuffer != null && n.write(e.fileMetadataBuffer), n.end();
      return;
    }
    const s = a + 1e3;
    rw(e, {
      tasks: t,
      start: a,
      end: Math.min(t.length, s),
      oldFileFd: r
    }, n, () => o(s), i);
  };
  return o;
}
function rw(e, t, n, r, i) {
  let o = "bytes=", a = 0;
  const s = /* @__PURE__ */ new Map(), l = [];
  for (let f = t.start; f < t.end; f++) {
    const h = t.tasks[f];
    h.kind === Ys.OperationKind.DOWNLOAD && (o += `${h.start}-${h.end - 1}, `, s.set(a, f), a++, l.push(h.end - h.start));
  }
  if (a <= 1) {
    const f = (h) => {
      if (h >= t.end) {
        r();
        return;
      }
      const g = t.tasks[h++];
      if (g.kind === Ys.OperationKind.COPY)
        (0, Vs.copyData)(g, n, t.oldFileFd, i, () => f(h));
      else {
        const _ = e.createRequestOptions();
        _.headers.Range = `bytes=${g.start}-${g.end - 1}`;
        const y = e.httpExecutor.createRequest(_, (A) => {
          wo(A, i) && (A.pipe(n, {
            end: !1
          }), A.once("end", () => f(h)));
        });
        e.httpExecutor.addErrorAndTimeoutHandlers(y, i), y.end();
      }
    };
    f(t.start);
    return;
  }
  const m = e.createRequestOptions();
  m.headers.Range = o.substring(0, o.length - 2);
  const c = e.httpExecutor.createRequest(m, (f) => {
    if (!wo(f, i))
      return;
    const h = (0, vo.safeGetHeader)(f, "content-type"), g = /^multipart\/.+?(?:; boundary=(?:(?:"(.+)")|(?:([^\s]+))))$/i.exec(h);
    if (g == null) {
      i(new Error(`Content-Type "multipart/byteranges" is expected, but got "${h}"`));
      return;
    }
    const _ = new Vs.DataSplitter(n, t, s, g[1] || g[2], l, r);
    _.on("error", i), f.pipe(_), f.on("end", () => {
      setTimeout(() => {
        c.abort(), i(new Error("Response ends without calling any handlers"));
      }, 1e4);
    });
  });
  e.httpExecutor.addErrorAndTimeoutHandlers(c, i), c.end();
}
function wo(e, t) {
  if (e.statusCode >= 400)
    return t((0, vo.createHttpError)(e)), !1;
  if (e.statusCode !== 206) {
    const n = (0, vo.safeGetHeader)(e, "accept-ranges");
    if (n == null || n === "none")
      return t(new Error(`Server doesn't support Accept-Ranges (response code ${e.statusCode})`)), !1;
  }
  return !0;
}
var Ei = {};
Object.defineProperty(Ei, "__esModule", { value: !0 });
Ei.ProgressDifferentialDownloadCallbackTransform = void 0;
const iw = qn;
var Jt;
(function(e) {
  e[e.COPY = 0] = "COPY", e[e.DOWNLOAD = 1] = "DOWNLOAD";
})(Jt || (Jt = {}));
class ow extends iw.Transform {
  constructor(t, n, r) {
    super(), this.progressDifferentialDownloadInfo = t, this.cancellationToken = n, this.onProgress = r, this.start = Date.now(), this.transferred = 0, this.delta = 0, this.expectedBytes = 0, this.index = 0, this.operationType = Jt.COPY, this.nextUpdate = this.start + 1e3;
  }
  _transform(t, n, r) {
    if (this.cancellationToken.cancelled) {
      r(new Error("cancelled"), null);
      return;
    }
    if (this.operationType == Jt.COPY) {
      r(null, t);
      return;
    }
    this.transferred += t.length, this.delta += t.length;
    const i = Date.now();
    i >= this.nextUpdate && this.transferred !== this.expectedBytes && this.transferred !== this.progressDifferentialDownloadInfo.grandTotal && (this.nextUpdate = i + 1e3, this.onProgress({
      total: this.progressDifferentialDownloadInfo.grandTotal,
      delta: this.delta,
      transferred: this.transferred,
      percent: this.transferred / this.progressDifferentialDownloadInfo.grandTotal * 100,
      bytesPerSecond: Math.round(this.transferred / ((i - this.start) / 1e3))
    }), this.delta = 0), r(null, t);
  }
  beginFileCopy() {
    this.operationType = Jt.COPY;
  }
  beginRangeDownload() {
    this.operationType = Jt.DOWNLOAD, this.expectedBytes += this.progressDifferentialDownloadInfo.expectedByteCounts[this.index++];
  }
  endRangeDownload() {
    this.transferred !== this.progressDifferentialDownloadInfo.grandTotal && this.onProgress({
      total: this.progressDifferentialDownloadInfo.grandTotal,
      delta: this.delta,
      transferred: this.transferred,
      percent: this.transferred / this.progressDifferentialDownloadInfo.grandTotal * 100,
      bytesPerSecond: Math.round(this.transferred / ((Date.now() - this.start) / 1e3))
    });
  }
  // Called when we are 100% done with the connection/download
  _flush(t) {
    if (this.cancellationToken.cancelled) {
      t(new Error("cancelled"));
      return;
    }
    this.onProgress({
      total: this.progressDifferentialDownloadInfo.grandTotal,
      delta: this.delta,
      transferred: this.transferred,
      percent: 100,
      bytesPerSecond: Math.round(this.transferred / ((Date.now() - this.start) / 1e3))
    }), this.delta = 0, this.transferred = 0, t(null);
  }
}
Ei.ProgressDifferentialDownloadCallbackTransform = ow;
Object.defineProperty(Zn, "__esModule", { value: !0 });
Zn.DifferentialDownloader = void 0;
const vn = pe, Qi = wt, aw = vt, sw = un, lw = an, Cr = kt, zs = gi, cw = Ei;
class uw {
  // noinspection TypeScriptAbstractClassConstructorCanBeMadeProtected
  constructor(t, n, r) {
    this.blockAwareFileInfo = t, this.httpExecutor = n, this.options = r, this.fileMetadataBuffer = null, this.logger = r.logger;
  }
  createRequestOptions() {
    const t = {
      headers: {
        ...this.options.requestHeaders,
        accept: "*/*"
      }
    };
    return (0, vn.configureRequestUrl)(this.options.newUrl, t), (0, vn.configureRequestOptions)(t), t;
  }
  doDownload(t, n) {
    if (t.version !== n.version)
      throw new Error(`version is different (${t.version} - ${n.version}), full download is required`);
    const r = this.logger, i = (0, Cr.computeOperations)(t, n, r);
    r.debug != null && r.debug(JSON.stringify(i, null, 2));
    let o = 0, a = 0;
    for (const l of i) {
      const m = l.end - l.start;
      l.kind === Cr.OperationKind.DOWNLOAD ? o += m : a += m;
    }
    const s = this.blockAwareFileInfo.size;
    if (o + a + (this.fileMetadataBuffer == null ? 0 : this.fileMetadataBuffer.length) !== s)
      throw new Error(`Internal error, size mismatch: downloadSize: ${o}, copySize: ${a}, newSize: ${s}`);
    return r.info(`Full: ${Xs(s)}, To download: ${Xs(o)} (${Math.round(o / (s / 100))}%)`), this.downloadFile(i);
  }
  downloadFile(t) {
    const n = [], r = () => Promise.all(n.map((i) => (0, Qi.close)(i.descriptor).catch((o) => {
      this.logger.error(`cannot close file "${i.path}": ${o}`);
    })));
    return this.doDownloadFile(t, n).then(r).catch((i) => r().catch((o) => {
      try {
        this.logger.error(`cannot close files: ${o}`);
      } catch (a) {
        try {
          console.error(a);
        } catch {
        }
      }
      throw i;
    }).then(() => {
      throw i;
    }));
  }
  async doDownloadFile(t, n) {
    const r = await (0, Qi.open)(this.options.oldFile, "r");
    n.push({ descriptor: r, path: this.options.oldFile });
    const i = await (0, Qi.open)(this.options.newFile, "w");
    n.push({ descriptor: i, path: this.options.newFile });
    const o = (0, aw.createWriteStream)(this.options.newFile, { fd: i });
    await new Promise((a, s) => {
      const l = [];
      let m;
      if (!this.options.isUseMultipleRangeRequest && this.options.onProgress) {
        const T = [];
        let S = 0;
        for (const x of t)
          x.kind === Cr.OperationKind.DOWNLOAD && (T.push(x.end - x.start), S += x.end - x.start);
        const N = {
          expectedByteCounts: T,
          grandTotal: S
        };
        m = new cw.ProgressDifferentialDownloadCallbackTransform(N, this.options.cancellationToken, this.options.onProgress), l.push(m);
      }
      const c = new vn.DigestTransform(this.blockAwareFileInfo.sha512);
      c.isValidateOnEnd = !1, l.push(c), o.on("finish", () => {
        o.close(() => {
          n.splice(1, 1);
          try {
            c.validate();
          } catch (T) {
            s(T);
            return;
          }
          a(void 0);
        });
      }), l.push(o);
      let f = null;
      for (const T of l)
        T.on("error", s), f == null ? f = T : f = f.pipe(T);
      const h = l[0];
      let g;
      if (this.options.isUseMultipleRangeRequest) {
        g = (0, zs.executeTasksUsingMultipleRangeRequests)(this, t, h, r, s), g(0);
        return;
      }
      let _ = 0, y = null;
      this.logger.info(`Differential download: ${this.options.newUrl}`);
      const A = this.createRequestOptions();
      A.redirect = "manual", g = (T) => {
        var S, N;
        if (T >= t.length) {
          this.fileMetadataBuffer != null && h.write(this.fileMetadataBuffer), h.end();
          return;
        }
        const x = t[T++];
        if (x.kind === Cr.OperationKind.COPY) {
          m && m.beginFileCopy(), (0, sw.copyData)(x, h, r, s, () => g(T));
          return;
        }
        const Z = `bytes=${x.start}-${x.end - 1}`;
        A.headers.range = Z, (N = (S = this.logger) === null || S === void 0 ? void 0 : S.debug) === null || N === void 0 || N.call(S, `download range: ${Z}`), m && m.beginRangeDownload();
        const ae = this.httpExecutor.createRequest(A, (Y) => {
          Y.on("error", s), Y.on("aborted", () => {
            s(new Error("response has been aborted by the server"));
          }), Y.statusCode >= 400 && s((0, vn.createHttpError)(Y)), Y.pipe(h, {
            end: !1
          }), Y.once("end", () => {
            m && m.endRangeDownload(), ++_ === 100 ? (_ = 0, setTimeout(() => g(T), 1e3)) : g(T);
          });
        });
        ae.on("redirect", (Y, Fe, E) => {
          this.logger.info(`Redirect to ${fw(E)}`), y = E, (0, vn.configureRequestUrl)(new lw.URL(y), A), ae.followRedirect();
        }), this.httpExecutor.addErrorAndTimeoutHandlers(ae, s), ae.end();
      }, g(0);
    });
  }
  async readRemoteBytes(t, n) {
    const r = Buffer.allocUnsafe(n + 1 - t), i = this.createRequestOptions();
    i.headers.range = `bytes=${t}-${n}`;
    let o = 0;
    if (await this.request(i, (a) => {
      a.copy(r, o), o += a.length;
    }), o !== r.length)
      throw new Error(`Received data length ${o} is not equal to expected ${r.length}`);
    return r;
  }
  request(t, n) {
    return new Promise((r, i) => {
      const o = this.httpExecutor.createRequest(t, (a) => {
        (0, zs.checkIsRangesSupported)(a, i) && (a.on("error", i), a.on("aborted", () => {
          i(new Error("response has been aborted by the server"));
        }), a.on("data", n), a.on("end", () => r()));
      });
      this.httpExecutor.addErrorAndTimeoutHandlers(o, i), o.end();
    });
  }
}
Zn.DifferentialDownloader = uw;
function Xs(e, t = " KB") {
  return new Intl.NumberFormat("en").format((e / 1024).toFixed(2)) + t;
}
function fw(e) {
  const t = e.indexOf("?");
  return t < 0 ? e : e.substring(0, t);
}
Object.defineProperty(mi, "__esModule", { value: !0 });
mi.GenericDifferentialDownloader = void 0;
const dw = Zn;
class hw extends dw.DifferentialDownloader {
  download(t, n) {
    return this.doDownload(t, n);
  }
}
mi.GenericDifferentialDownloader = hw;
var _t = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.UpdaterSignal = e.UPDATE_DOWNLOADED = e.DOWNLOAD_PROGRESS = e.CancellationToken = void 0, e.addHandler = r;
  const t = pe;
  Object.defineProperty(e, "CancellationToken", { enumerable: !0, get: function() {
    return t.CancellationToken;
  } }), e.DOWNLOAD_PROGRESS = "download-progress", e.UPDATE_DOWNLOADED = "update-downloaded";
  class n {
    constructor(o) {
      this.emitter = o;
    }
    /**
     * Emitted when an authenticating proxy is [asking for user credentials](https://github.com/electron/electron/blob/master/docs/api/client-request.md#event-login).
     */
    login(o) {
      r(this.emitter, "login", o);
    }
    progress(o) {
      r(this.emitter, e.DOWNLOAD_PROGRESS, o);
    }
    updateDownloaded(o) {
      r(this.emitter, e.UPDATE_DOWNLOADED, o);
    }
    updateCancelled(o) {
      r(this.emitter, "update-cancelled", o);
    }
  }
  e.UpdaterSignal = n;
  function r(i, o, a) {
    i.on(o, a);
  }
})(_t);
Object.defineProperty(pt, "__esModule", { value: !0 });
pt.NoOpLogger = pt.AppUpdater = void 0;
const Se = pe, pw = Gn, mw = Xr, gw = El, qt = wt, Ew = ye, Zi = ii, $t = re, It = mu, Ks = Jn, yw = ui, Js = gu, vw = Qn, eo = fi, ww = vl, _w = Me, Aw = mi, Gt = _t;
class Jo extends gw.EventEmitter {
  /**
   * Get the update channel. Doesn't return `channel` from the update configuration, only if was previously set.
   */
  get channel() {
    return this._channel;
  }
  /**
   * Set the update channel. Overrides `channel` in the update configuration.
   *
   * `allowDowngrade` will be automatically set to `true`. If this behavior is not suitable for you, simple set `allowDowngrade` explicitly after.
   */
  set channel(t) {
    if (this._channel != null) {
      if (typeof t != "string")
        throw (0, Se.newError)(`Channel must be a string, but got: ${t}`, "ERR_UPDATER_INVALID_CHANNEL");
      if (t.length === 0)
        throw (0, Se.newError)("Channel must be not an empty string", "ERR_UPDATER_INVALID_CHANNEL");
    }
    this._channel = t, this.allowDowngrade = !0;
  }
  /**
   *  Shortcut for explicitly adding auth tokens to request headers
   */
  addAuthHeader(t) {
    this.requestHeaders = Object.assign({}, this.requestHeaders, {
      authorization: t
    });
  }
  // noinspection JSMethodCanBeStatic,JSUnusedGlobalSymbols
  get netSession() {
    return (0, Js.getNetSession)();
  }
  /**
   * The logger. You can pass [electron-log](https://github.com/megahertz/electron-log), [winston](https://github.com/winstonjs/winston) or another logger with the following interface: `{ info(), warn(), error() }`.
   * Set it to `null` if you would like to disable a logging feature.
   */
  get logger() {
    return this._logger;
  }
  set logger(t) {
    this._logger = t ?? new Tu();
  }
  // noinspection JSUnusedGlobalSymbols
  /**
   * test only
   * @private
   */
  set updateConfigPath(t) {
    this.clientPromise = null, this._appUpdateConfigPath = t, this.configOnDisk = new Zi.Lazy(() => this.loadUpdateConfig());
  }
  /**
   * Allows developer to override default logic for determining if an update is supported.
   * The default logic compares the `UpdateInfo` minimum system version against the `os.release()` with `semver` package
   */
  get isUpdateSupported() {
    return this._isUpdateSupported;
  }
  set isUpdateSupported(t) {
    t && (this._isUpdateSupported = t);
  }
  constructor(t, n) {
    super(), this.autoDownload = !0, this.autoInstallOnAppQuit = !0, this.autoRunAppAfterInstall = !0, this.allowPrerelease = !1, this.fullChangelog = !1, this.allowDowngrade = !1, this.disableWebInstaller = !1, this.disableDifferentialDownload = !1, this.forceDevUpdateConfig = !1, this._channel = null, this.downloadedUpdateHelper = null, this.requestHeaders = null, this._logger = console, this.signals = new Gt.UpdaterSignal(this), this._appUpdateConfigPath = null, this._isUpdateSupported = (o) => this.checkIfUpdateSupported(o), this.clientPromise = null, this.stagingUserIdPromise = new Zi.Lazy(() => this.getOrCreateStagingUserId()), this.configOnDisk = new Zi.Lazy(() => this.loadUpdateConfig()), this.checkForUpdatesPromise = null, this.downloadPromise = null, this.updateInfoAndProvider = null, this._testOnlyOptions = null, this.on("error", (o) => {
      this._logger.error(`Error: ${o.stack || o.message}`);
    }), n == null ? (this.app = new yw.ElectronAppAdapter(), this.httpExecutor = new Js.ElectronHttpExecutor((o, a) => this.emit("login", o, a))) : (this.app = n, this.httpExecutor = null);
    const r = this.app.version, i = (0, It.parse)(r);
    if (i == null)
      throw (0, Se.newError)(`App version is not a valid semver version: "${r}"`, "ERR_UPDATER_INVALID_VERSION");
    this.currentVersion = i, this.allowPrerelease = Sw(i), t != null && (this.setFeedURL(t), typeof t != "string" && t.requestHeaders && (this.requestHeaders = t.requestHeaders));
  }
  //noinspection JSMethodCanBeStatic,JSUnusedGlobalSymbols
  getFeedURL() {
    return "Deprecated. Do not use it.";
  }
  /**
   * Configure update provider. If value is `string`, [GenericServerOptions](./publish.md#genericserveroptions) will be set with value as `url`.
   * @param options If you want to override configuration in the `app-update.yml`.
   */
  setFeedURL(t) {
    const n = this.createProviderRuntimeOptions();
    let r;
    typeof t == "string" ? r = new vw.GenericProvider({ provider: "generic", url: t }, this, {
      ...n,
      isUseMultipleRangeRequest: (0, eo.isUrlProbablySupportMultiRangeRequests)(t)
    }) : r = (0, eo.createClient)(t, this, n), this.clientPromise = Promise.resolve(r);
  }
  /**
   * Asks the server whether there is an update.
   * @returns null if the updater is disabled, otherwise info about the latest version
   */
  checkForUpdates() {
    if (!this.isUpdaterActive())
      return Promise.resolve(null);
    let t = this.checkForUpdatesPromise;
    if (t != null)
      return this._logger.info("Checking for update (already in progress)"), t;
    const n = () => this.checkForUpdatesPromise = null;
    return this._logger.info("Checking for update"), t = this.doCheckForUpdates().then((r) => (n(), r)).catch((r) => {
      throw n(), this.emit("error", r, `Cannot check for updates: ${(r.stack || r).toString()}`), r;
    }), this.checkForUpdatesPromise = t, t;
  }
  isUpdaterActive() {
    return this.app.isPackaged || this.forceDevUpdateConfig ? !0 : (this._logger.info("Skip checkForUpdates because application is not packed and dev update config is not forced"), !1);
  }
  // noinspection JSUnusedGlobalSymbols
  checkForUpdatesAndNotify(t) {
    return this.checkForUpdates().then((n) => n != null && n.downloadPromise ? (n.downloadPromise.then(() => {
      const r = Jo.formatDownloadNotification(n.updateInfo.version, this.app.name, t);
      new Ft.Notification(r).show();
    }), n) : (this._logger.debug != null && this._logger.debug("checkForUpdatesAndNotify called, downloadPromise is null"), n));
  }
  static formatDownloadNotification(t, n, r) {
    return r == null && (r = {
      title: "A new update is ready to install",
      body: "{appName} version {version} has been downloaded and will be automatically installed on exit"
    }), r = {
      title: r.title.replace("{appName}", n).replace("{version}", t),
      body: r.body.replace("{appName}", n).replace("{version}", t)
    }, r;
  }
  async isStagingMatch(t) {
    const n = t.stagingPercentage;
    let r = n;
    if (r == null)
      return !0;
    if (r = parseInt(r, 10), isNaN(r))
      return this._logger.warn(`Staging percentage is NaN: ${n}`), !0;
    r = r / 100;
    const i = await this.stagingUserIdPromise.value, a = Se.UUID.parse(i).readUInt32BE(12) / 4294967295;
    return this._logger.info(`Staging percentage: ${r}, percentage: ${a}, user id: ${i}`), a < r;
  }
  computeFinalHeaders(t) {
    return this.requestHeaders != null && Object.assign(t, this.requestHeaders), t;
  }
  async isUpdateAvailable(t) {
    const n = (0, It.parse)(t.version);
    if (n == null)
      throw (0, Se.newError)(`This file could not be downloaded, or the latest version (from update server) does not have a valid semver version: "${t.version}"`, "ERR_UPDATER_INVALID_VERSION");
    const r = this.currentVersion;
    if ((0, It.eq)(n, r) || !await Promise.resolve(this.isUpdateSupported(t)) || !await this.isStagingMatch(t))
      return !1;
    const o = (0, It.gt)(n, r), a = (0, It.lt)(n, r);
    return o ? !0 : this.allowDowngrade && a;
  }
  checkIfUpdateSupported(t) {
    const n = t == null ? void 0 : t.minimumSystemVersion, r = (0, mw.release)();
    if (n)
      try {
        if ((0, It.lt)(r, n))
          return this._logger.info(`Current OS version ${r} is less than the minimum OS version required ${n} for version ${r}`), !1;
      } catch (i) {
        this._logger.warn(`Failed to compare current OS version(${r}) with minimum OS version(${n}): ${(i.message || i).toString()}`);
      }
    return !0;
  }
  async getUpdateInfoAndProvider() {
    await this.app.whenReady(), this.clientPromise == null && (this.clientPromise = this.configOnDisk.value.then((r) => (0, eo.createClient)(r, this, this.createProviderRuntimeOptions())));
    const t = await this.clientPromise, n = await this.stagingUserIdPromise.value;
    return t.setRequestHeaders(this.computeFinalHeaders({ "x-user-staging-id": n })), {
      info: await t.getLatestVersion(),
      provider: t
    };
  }
  createProviderRuntimeOptions() {
    return {
      isUseMultipleRangeRequest: !0,
      platform: this._testOnlyOptions == null ? process.platform : this._testOnlyOptions.platform,
      executor: this.httpExecutor
    };
  }
  async doCheckForUpdates() {
    this.emit("checking-for-update");
    const t = await this.getUpdateInfoAndProvider(), n = t.info;
    if (!await this.isUpdateAvailable(n))
      return this._logger.info(`Update for version ${this.currentVersion.format()} is not available (latest version: ${n.version}, downgrade is ${this.allowDowngrade ? "allowed" : "disallowed"}).`), this.emit("update-not-available", n), {
        isUpdateAvailable: !1,
        versionInfo: n,
        updateInfo: n
      };
    this.updateInfoAndProvider = t, this.onUpdateAvailable(n);
    const r = new Se.CancellationToken();
    return {
      isUpdateAvailable: !0,
      versionInfo: n,
      updateInfo: n,
      cancellationToken: r,
      downloadPromise: this.autoDownload ? this.downloadUpdate(r) : null
    };
  }
  onUpdateAvailable(t) {
    this._logger.info(`Found version ${t.version} (url: ${(0, Se.asArray)(t.files).map((n) => n.url).join(", ")})`), this.emit("update-available", t);
  }
  /**
   * Start downloading update manually. You can use this method if `autoDownload` option is set to `false`.
   * @returns {Promise<Array<string>>} Paths to downloaded files.
   */
  downloadUpdate(t = new Se.CancellationToken()) {
    const n = this.updateInfoAndProvider;
    if (n == null) {
      const i = new Error("Please check update first");
      return this.dispatchError(i), Promise.reject(i);
    }
    if (this.downloadPromise != null)
      return this._logger.info("Downloading update (already in progress)"), this.downloadPromise;
    this._logger.info(`Downloading update from ${(0, Se.asArray)(n.info.files).map((i) => i.url).join(", ")}`);
    const r = (i) => {
      if (!(i instanceof Se.CancellationError))
        try {
          this.dispatchError(i);
        } catch (o) {
          this._logger.warn(`Cannot dispatch error event: ${o.stack || o}`);
        }
      return i;
    };
    return this.downloadPromise = this.doDownloadUpdate({
      updateInfoAndProvider: n,
      requestHeaders: this.computeRequestHeaders(n.provider),
      cancellationToken: t,
      disableWebInstaller: this.disableWebInstaller,
      disableDifferentialDownload: this.disableDifferentialDownload
    }).catch((i) => {
      throw r(i);
    }).finally(() => {
      this.downloadPromise = null;
    }), this.downloadPromise;
  }
  dispatchError(t) {
    this.emit("error", t, (t.stack || t).toString());
  }
  dispatchUpdateDownloaded(t) {
    this.emit(Gt.UPDATE_DOWNLOADED, t);
  }
  async loadUpdateConfig() {
    return this._appUpdateConfigPath == null && (this._appUpdateConfigPath = this.app.appUpdateConfigPath), (0, Ew.load)(await (0, qt.readFile)(this._appUpdateConfigPath, "utf-8"));
  }
  computeRequestHeaders(t) {
    const n = t.fileExtraDownloadHeaders;
    if (n != null) {
      const r = this.requestHeaders;
      return r == null ? n : {
        ...n,
        ...r
      };
    }
    return this.computeFinalHeaders({ accept: "*/*" });
  }
  async getOrCreateStagingUserId() {
    const t = $t.join(this.app.userDataPath, ".updaterId");
    try {
      const r = await (0, qt.readFile)(t, "utf-8");
      if (Se.UUID.check(r))
        return r;
      this._logger.warn(`Staging user id file exists, but content was invalid: ${r}`);
    } catch (r) {
      r.code !== "ENOENT" && this._logger.warn(`Couldn't read staging user ID, creating a blank one: ${r}`);
    }
    const n = Se.UUID.v5((0, pw.randomBytes)(4096), Se.UUID.OID);
    this._logger.info(`Generated new staging user ID: ${n}`);
    try {
      await (0, qt.outputFile)(t, n);
    } catch (r) {
      this._logger.warn(`Couldn't write out staging user ID: ${r}`);
    }
    return n;
  }
  /** @internal */
  get isAddNoCacheQuery() {
    const t = this.requestHeaders;
    if (t == null)
      return !0;
    for (const n of Object.keys(t)) {
      const r = n.toLowerCase();
      if (r === "authorization" || r === "private-token")
        return !1;
    }
    return !0;
  }
  async getOrCreateDownloadHelper() {
    let t = this.downloadedUpdateHelper;
    if (t == null) {
      const n = (await this.configOnDisk.value).updaterCacheDirName, r = this._logger;
      n == null && r.error("updaterCacheDirName is not specified in app-update.yml Was app build using at least electron-builder 20.34.0?");
      const i = $t.join(this.app.baseCachePath, n || this.app.name);
      r.debug != null && r.debug(`updater cache dir: ${i}`), t = new Ks.DownloadedUpdateHelper(i), this.downloadedUpdateHelper = t;
    }
    return t;
  }
  async executeDownload(t) {
    const n = t.fileInfo, r = {
      headers: t.downloadUpdateOptions.requestHeaders,
      cancellationToken: t.downloadUpdateOptions.cancellationToken,
      sha2: n.info.sha2,
      sha512: n.info.sha512
    };
    this.listenerCount(Gt.DOWNLOAD_PROGRESS) > 0 && (r.onProgress = (S) => this.emit(Gt.DOWNLOAD_PROGRESS, S));
    const i = t.downloadUpdateOptions.updateInfoAndProvider.info, o = i.version, a = n.packageInfo;
    function s() {
      const S = decodeURIComponent(t.fileInfo.url.pathname);
      return S.endsWith(`.${t.fileExtension}`) ? $t.basename(S) : t.fileInfo.info.url;
    }
    const l = await this.getOrCreateDownloadHelper(), m = l.cacheDirForPendingUpdate;
    await (0, qt.mkdir)(m, { recursive: !0 });
    const c = s();
    let f = $t.join(m, c);
    const h = a == null ? null : $t.join(m, `package-${o}${$t.extname(a.path) || ".7z"}`), g = async (S) => (await l.setDownloadedFile(f, h, i, n, c, S), await t.done({
      ...i,
      downloadedFile: f
    }), h == null ? [f] : [f, h]), _ = this._logger, y = await l.validateDownloadedPath(f, i, n, _);
    if (y != null)
      return f = y, await g(!1);
    const A = async () => (await l.clear().catch(() => {
    }), await (0, qt.unlink)(f).catch(() => {
    })), T = await (0, Ks.createTempUpdateFile)(`temp-${c}`, m, _);
    try {
      await t.task(T, r, h, A), await (0, Se.retry)(() => (0, qt.rename)(T, f), 60, 500, 0, 0, (S) => S instanceof Error && /^EBUSY:/.test(S.message));
    } catch (S) {
      throw await A(), S instanceof Se.CancellationError && (_.info("cancelled"), this.emit("update-cancelled", i)), S;
    }
    return _.info(`New version ${o} has been downloaded to ${f}`), await g(!0);
  }
  async differentialDownloadInstaller(t, n, r, i, o) {
    try {
      if (this._testOnlyOptions != null && !this._testOnlyOptions.isUseDifferentialDownload)
        return !0;
      const a = (0, _w.blockmapFiles)(t.url, this.app.version, n.updateInfoAndProvider.info.version);
      this._logger.info(`Download block maps (old: "${a[0]}", new: ${a[1]})`);
      const s = async (c) => {
        const f = await this.httpExecutor.downloadToBuffer(c, {
          headers: n.requestHeaders,
          cancellationToken: n.cancellationToken
        });
        if (f == null || f.length === 0)
          throw new Error(`Blockmap "${c.href}" is empty`);
        try {
          return JSON.parse((0, ww.gunzipSync)(f).toString());
        } catch (h) {
          throw new Error(`Cannot parse blockmap "${c.href}", error: ${h}`);
        }
      }, l = {
        newUrl: t.url,
        oldFile: $t.join(this.downloadedUpdateHelper.cacheDir, o),
        logger: this._logger,
        newFile: r,
        isUseMultipleRangeRequest: i.isUseMultipleRangeRequest,
        requestHeaders: n.requestHeaders,
        cancellationToken: n.cancellationToken
      };
      this.listenerCount(Gt.DOWNLOAD_PROGRESS) > 0 && (l.onProgress = (c) => this.emit(Gt.DOWNLOAD_PROGRESS, c));
      const m = await Promise.all(a.map((c) => s(c)));
      return await new Aw.GenericDifferentialDownloader(t.info, this.httpExecutor, l).download(m[0], m[1]), !1;
    } catch (a) {
      if (this._logger.error(`Cannot download differentially, fallback to full download: ${a.stack || a}`), this._testOnlyOptions != null)
        throw a;
      return !0;
    }
  }
}
pt.AppUpdater = Jo;
function Sw(e) {
  const t = (0, It.prerelease)(e);
  return t != null && t.length > 0;
}
class Tu {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  info(t) {
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  warn(t) {
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  error(t) {
  }
}
pt.NoOpLogger = Tu;
Object.defineProperty(rt, "__esModule", { value: !0 });
rt.BaseUpdater = void 0;
const Qs = zr, Tw = pt;
class Cw extends Tw.AppUpdater {
  constructor(t, n) {
    super(t, n), this.quitAndInstallCalled = !1, this.quitHandlerAdded = !1;
  }
  quitAndInstall(t = !1, n = !1) {
    this._logger.info("Install on explicit quitAndInstall"), this.install(t, t ? n : this.autoRunAppAfterInstall) ? setImmediate(() => {
      Ft.autoUpdater.emit("before-quit-for-update"), this.app.quit();
    }) : this.quitAndInstallCalled = !1;
  }
  executeDownload(t) {
    return super.executeDownload({
      ...t,
      done: (n) => (this.dispatchUpdateDownloaded(n), this.addQuitHandler(), Promise.resolve())
    });
  }
  get installerPath() {
    return this.downloadedUpdateHelper == null ? null : this.downloadedUpdateHelper.file;
  }
  // must be sync (because quit even handler is not async)
  install(t = !1, n = !1) {
    if (this.quitAndInstallCalled)
      return this._logger.warn("install call ignored: quitAndInstallCalled is set to true"), !1;
    const r = this.downloadedUpdateHelper, i = this.installerPath, o = r == null ? null : r.downloadedFileInfo;
    if (i == null || o == null)
      return this.dispatchError(new Error("No valid update available, can't quit and install")), !1;
    this.quitAndInstallCalled = !0;
    try {
      return this._logger.info(`Install: isSilent: ${t}, isForceRunAfter: ${n}`), this.doInstall({
        isSilent: t,
        isForceRunAfter: n,
        isAdminRightsRequired: o.isAdminRightsRequired
      });
    } catch (a) {
      return this.dispatchError(a), !1;
    }
  }
  addQuitHandler() {
    this.quitHandlerAdded || !this.autoInstallOnAppQuit || (this.quitHandlerAdded = !0, this.app.onQuit((t) => {
      if (this.quitAndInstallCalled) {
        this._logger.info("Update installer has already been triggered. Quitting application.");
        return;
      }
      if (!this.autoInstallOnAppQuit) {
        this._logger.info("Update will not be installed on quit because autoInstallOnAppQuit is set to false.");
        return;
      }
      if (t !== 0) {
        this._logger.info(`Update will be not installed on quit because application is quitting with exit code ${t}`);
        return;
      }
      this._logger.info("Auto install update on quit"), this.install(!0, !1);
    }));
  }
  wrapSudo() {
    const { name: t } = this.app, n = `"${t} would like to update"`, r = this.spawnSyncLog("which gksudo || which kdesudo || which pkexec || which beesu"), i = [r];
    return /kdesudo/i.test(r) ? (i.push("--comment", n), i.push("-c")) : /gksudo/i.test(r) ? i.push("--message", n) : /pkexec/i.test(r) && i.push("--disable-internal-agent"), i.join(" ");
  }
  spawnSyncLog(t, n = [], r = {}) {
    this._logger.info(`Executing: ${t} with args: ${n}`);
    const i = (0, Qs.spawnSync)(t, n, {
      env: { ...process.env, ...r },
      encoding: "utf-8",
      shell: !0
    }), { error: o, status: a, stdout: s, stderr: l } = i;
    if (o != null)
      throw this._logger.error(l), o;
    if (a != null && a !== 0)
      throw this._logger.error(l), new Error(`Command ${t} exited with code ${a}`);
    return s.trim();
  }
  /**
   * This handles both node 8 and node 10 way of emitting error when spawning a process
   *   - node 8: Throws the error
   *   - node 10: Emit the error(Need to listen with on)
   */
  // https://github.com/electron-userland/electron-builder/issues/1129
  // Node 8 sends errors: https://nodejs.org/dist/latest-v8.x/docs/api/errors.html#errors_common_system_errors
  async spawnLog(t, n = [], r = void 0, i = "ignore") {
    return this._logger.info(`Executing: ${t} with args: ${n}`), new Promise((o, a) => {
      try {
        const s = { stdio: i, env: r, detached: !0 }, l = (0, Qs.spawn)(t, n, s);
        l.on("error", (m) => {
          a(m);
        }), l.unref(), l.pid !== void 0 && o(!0);
      } catch (s) {
        a(s);
      }
    });
  }
}
rt.BaseUpdater = Cw;
var Un = {}, er = {};
Object.defineProperty(er, "__esModule", { value: !0 });
er.FileWithEmbeddedBlockMapDifferentialDownloader = void 0;
const Wt = wt, bw = Zn, $w = vl;
class Ow extends bw.DifferentialDownloader {
  async download() {
    const t = this.blockAwareFileInfo, n = t.size, r = n - (t.blockMapSize + 4);
    this.fileMetadataBuffer = await this.readRemoteBytes(r, n - 1);
    const i = Cu(this.fileMetadataBuffer.slice(0, this.fileMetadataBuffer.length - 4));
    await this.doDownload(await Iw(this.options.oldFile), i);
  }
}
er.FileWithEmbeddedBlockMapDifferentialDownloader = Ow;
function Cu(e) {
  return JSON.parse((0, $w.inflateRawSync)(e).toString());
}
async function Iw(e) {
  const t = await (0, Wt.open)(e, "r");
  try {
    const n = (await (0, Wt.fstat)(t)).size, r = Buffer.allocUnsafe(4);
    await (0, Wt.read)(t, r, 0, r.length, n - r.length);
    const i = Buffer.allocUnsafe(r.readUInt32BE(0));
    return await (0, Wt.read)(t, i, 0, i.length, n - r.length - i.length), await (0, Wt.close)(t), Cu(i);
  } catch (n) {
    throw await (0, Wt.close)(t), n;
  }
}
Object.defineProperty(Un, "__esModule", { value: !0 });
Un.AppImageUpdater = void 0;
const Zs = pe, el = zr, Rw = wt, Pw = vt, wn = re, Dw = rt, Nw = er, Fw = ue, tl = _t;
class xw extends Dw.BaseUpdater {
  constructor(t, n) {
    super(t, n);
  }
  isUpdaterActive() {
    return process.env.APPIMAGE == null ? (process.env.SNAP == null ? this._logger.warn("APPIMAGE env is not defined, current application is not an AppImage") : this._logger.info("SNAP env is defined, updater is disabled"), !1) : super.isUpdaterActive();
  }
  /*** @private */
  doDownloadUpdate(t) {
    const n = t.updateInfoAndProvider.provider, r = (0, Fw.findFile)(n.resolveFiles(t.updateInfoAndProvider.info), "AppImage", ["rpm", "deb", "pacman"]);
    return this.executeDownload({
      fileExtension: "AppImage",
      fileInfo: r,
      downloadUpdateOptions: t,
      task: async (i, o) => {
        const a = process.env.APPIMAGE;
        if (a == null)
          throw (0, Zs.newError)("APPIMAGE env is not defined", "ERR_UPDATER_OLD_FILE_NOT_FOUND");
        (t.disableDifferentialDownload || await this.downloadDifferential(r, a, i, n, t)) && await this.httpExecutor.download(r.url, i, o), await (0, Rw.chmod)(i, 493);
      }
    });
  }
  async downloadDifferential(t, n, r, i, o) {
    try {
      const a = {
        newUrl: t.url,
        oldFile: n,
        logger: this._logger,
        newFile: r,
        isUseMultipleRangeRequest: i.isUseMultipleRangeRequest,
        requestHeaders: o.requestHeaders,
        cancellationToken: o.cancellationToken
      };
      return this.listenerCount(tl.DOWNLOAD_PROGRESS) > 0 && (a.onProgress = (s) => this.emit(tl.DOWNLOAD_PROGRESS, s)), await new Nw.FileWithEmbeddedBlockMapDifferentialDownloader(t.info, this.httpExecutor, a).download(), !1;
    } catch (a) {
      return this._logger.error(`Cannot download differentially, fallback to full download: ${a.stack || a}`), process.platform === "linux";
    }
  }
  doInstall(t) {
    const n = process.env.APPIMAGE;
    if (n == null)
      throw (0, Zs.newError)("APPIMAGE env is not defined", "ERR_UPDATER_OLD_FILE_NOT_FOUND");
    (0, Pw.unlinkSync)(n);
    let r;
    const i = wn.basename(n), o = this.installerPath;
    if (o == null)
      return this.dispatchError(new Error("No valid update available, can't quit and install")), !1;
    wn.basename(o) === i || !/\d+\.\d+\.\d+/.test(i) ? r = n : r = wn.join(wn.dirname(n), wn.basename(o)), (0, el.execFileSync)("mv", ["-f", o, r]), r !== n && this.emit("appimage-filename-updated", r);
    const a = {
      ...process.env,
      APPIMAGE_SILENT_INSTALL: "true"
    };
    return t.isForceRunAfter ? this.spawnLog(r, [], a) : (a.APPIMAGE_EXIT_AFTER_INSTALL = "true", (0, el.execFileSync)(r, [], { env: a })), !0;
  }
}
Un.AppImageUpdater = xw;
var kn = {};
Object.defineProperty(kn, "__esModule", { value: !0 });
kn.DebUpdater = void 0;
const Lw = rt, Uw = ue, nl = _t;
class kw extends Lw.BaseUpdater {
  constructor(t, n) {
    super(t, n);
  }
  /*** @private */
  doDownloadUpdate(t) {
    const n = t.updateInfoAndProvider.provider, r = (0, Uw.findFile)(n.resolveFiles(t.updateInfoAndProvider.info), "deb", ["AppImage", "rpm", "pacman"]);
    return this.executeDownload({
      fileExtension: "deb",
      fileInfo: r,
      downloadUpdateOptions: t,
      task: async (i, o) => {
        this.listenerCount(nl.DOWNLOAD_PROGRESS) > 0 && (o.onProgress = (a) => this.emit(nl.DOWNLOAD_PROGRESS, a)), await this.httpExecutor.download(r.url, i, o);
      }
    });
  }
  get installerPath() {
    var t, n;
    return (n = (t = super.installerPath) === null || t === void 0 ? void 0 : t.replace(/ /g, "\\ ")) !== null && n !== void 0 ? n : null;
  }
  doInstall(t) {
    const n = this.wrapSudo(), r = /pkexec/i.test(n) ? "" : '"', i = this.installerPath;
    if (i == null)
      return this.dispatchError(new Error("No valid update available, can't quit and install")), !1;
    const o = ["dpkg", "-i", i, "||", "apt-get", "install", "-f", "-y"];
    return this.spawnSyncLog(n, [`${r}/bin/bash`, "-c", `'${o.join(" ")}'${r}`]), t.isForceRunAfter && this.app.relaunch(), !0;
  }
}
kn.DebUpdater = kw;
var Mn = {};
Object.defineProperty(Mn, "__esModule", { value: !0 });
Mn.PacmanUpdater = void 0;
const Mw = rt, rl = _t, Bw = ue;
class jw extends Mw.BaseUpdater {
  constructor(t, n) {
    super(t, n);
  }
  /*** @private */
  doDownloadUpdate(t) {
    const n = t.updateInfoAndProvider.provider, r = (0, Bw.findFile)(n.resolveFiles(t.updateInfoAndProvider.info), "pacman", ["AppImage", "deb", "rpm"]);
    return this.executeDownload({
      fileExtension: "pacman",
      fileInfo: r,
      downloadUpdateOptions: t,
      task: async (i, o) => {
        this.listenerCount(rl.DOWNLOAD_PROGRESS) > 0 && (o.onProgress = (a) => this.emit(rl.DOWNLOAD_PROGRESS, a)), await this.httpExecutor.download(r.url, i, o);
      }
    });
  }
  get installerPath() {
    var t, n;
    return (n = (t = super.installerPath) === null || t === void 0 ? void 0 : t.replace(/ /g, "\\ ")) !== null && n !== void 0 ? n : null;
  }
  doInstall(t) {
    const n = this.wrapSudo(), r = /pkexec/i.test(n) ? "" : '"', i = this.installerPath;
    if (i == null)
      return this.dispatchError(new Error("No valid update available, can't quit and install")), !1;
    const o = ["pacman", "-U", "--noconfirm", i];
    return this.spawnSyncLog(n, [`${r}/bin/bash`, "-c", `'${o.join(" ")}'${r}`]), t.isForceRunAfter && this.app.relaunch(), !0;
  }
}
Mn.PacmanUpdater = jw;
var Bn = {};
Object.defineProperty(Bn, "__esModule", { value: !0 });
Bn.RpmUpdater = void 0;
const Hw = rt, il = _t, qw = ue;
class Gw extends Hw.BaseUpdater {
  constructor(t, n) {
    super(t, n);
  }
  /*** @private */
  doDownloadUpdate(t) {
    const n = t.updateInfoAndProvider.provider, r = (0, qw.findFile)(n.resolveFiles(t.updateInfoAndProvider.info), "rpm", ["AppImage", "deb", "pacman"]);
    return this.executeDownload({
      fileExtension: "rpm",
      fileInfo: r,
      downloadUpdateOptions: t,
      task: async (i, o) => {
        this.listenerCount(il.DOWNLOAD_PROGRESS) > 0 && (o.onProgress = (a) => this.emit(il.DOWNLOAD_PROGRESS, a)), await this.httpExecutor.download(r.url, i, o);
      }
    });
  }
  get installerPath() {
    var t, n;
    return (n = (t = super.installerPath) === null || t === void 0 ? void 0 : t.replace(/ /g, "\\ ")) !== null && n !== void 0 ? n : null;
  }
  doInstall(t) {
    const n = this.wrapSudo(), r = /pkexec/i.test(n) ? "" : '"', i = this.spawnSyncLog("which zypper"), o = this.installerPath;
    if (o == null)
      return this.dispatchError(new Error("No valid update available, can't quit and install")), !1;
    let a;
    return i ? a = [i, "--no-refresh", "install", "--allow-unsigned-rpm", "-y", "-f", o] : a = [this.spawnSyncLog("which dnf || which yum"), "-y", "install", o], this.spawnSyncLog(n, [`${r}/bin/bash`, "-c", `'${a.join(" ")}'${r}`]), t.isForceRunAfter && this.app.relaunch(), !0;
  }
}
Bn.RpmUpdater = Gw;
var jn = {};
Object.defineProperty(jn, "__esModule", { value: !0 });
jn.MacUpdater = void 0;
const ol = pe, to = wt, Ww = vt, al = re, Vw = Uf, Yw = pt, zw = ue, sl = zr, ll = Gn;
class Xw extends Yw.AppUpdater {
  constructor(t, n) {
    super(t, n), this.nativeUpdater = Ft.autoUpdater, this.squirrelDownloadedUpdate = !1, this.nativeUpdater.on("error", (r) => {
      this._logger.warn(r), this.emit("error", r);
    }), this.nativeUpdater.on("update-downloaded", () => {
      this.squirrelDownloadedUpdate = !0, this.debug("nativeUpdater.update-downloaded");
    });
  }
  debug(t) {
    this._logger.debug != null && this._logger.debug(t);
  }
  closeServerIfExists() {
    this.server && (this.debug("Closing proxy server"), this.server.close((t) => {
      t && this.debug("proxy server wasn't already open, probably attempted closing again as a safety check before quit");
    }));
  }
  async doDownloadUpdate(t) {
    let n = t.updateInfoAndProvider.provider.resolveFiles(t.updateInfoAndProvider.info);
    const r = this._logger, i = "sysctl.proc_translated";
    let o = !1;
    try {
      this.debug("Checking for macOS Rosetta environment"), o = (0, sl.execFileSync)("sysctl", [i], { encoding: "utf8" }).includes(`${i}: 1`), r.info(`Checked for macOS Rosetta environment (isRosetta=${o})`);
    } catch (f) {
      r.warn(`sysctl shell command to check for macOS Rosetta environment failed: ${f}`);
    }
    let a = !1;
    try {
      this.debug("Checking for arm64 in uname");
      const h = (0, sl.execFileSync)("uname", ["-a"], { encoding: "utf8" }).includes("ARM");
      r.info(`Checked 'uname -a': arm64=${h}`), a = a || h;
    } catch (f) {
      r.warn(`uname shell command to check for arm64 failed: ${f}`);
    }
    a = a || process.arch === "arm64" || o;
    const s = (f) => {
      var h;
      return f.url.pathname.includes("arm64") || ((h = f.info.url) === null || h === void 0 ? void 0 : h.includes("arm64"));
    };
    a && n.some(s) ? n = n.filter((f) => a === s(f)) : n = n.filter((f) => !s(f));
    const l = (0, zw.findFile)(n, "zip", ["pkg", "dmg"]);
    if (l == null)
      throw (0, ol.newError)(`ZIP file not provided: ${(0, ol.safeStringifyJson)(n)}`, "ERR_UPDATER_ZIP_FILE_NOT_FOUND");
    const m = t.updateInfoAndProvider.provider, c = "update.zip";
    return this.executeDownload({
      fileExtension: "zip",
      fileInfo: l,
      downloadUpdateOptions: t,
      task: async (f, h) => {
        const g = al.join(this.downloadedUpdateHelper.cacheDir, c), _ = () => (0, to.pathExistsSync)(g) ? !t.disableDifferentialDownload : (r.info("Unable to locate previous update.zip for differential download (is this first install?), falling back to full download"), !1);
        let y = !0;
        _() && (y = await this.differentialDownloadInstaller(l, t, f, m, c)), y && await this.httpExecutor.download(l.url, f, h);
      },
      done: async (f) => {
        if (!t.disableDifferentialDownload)
          try {
            const h = al.join(this.downloadedUpdateHelper.cacheDir, c);
            await (0, to.copyFile)(f.downloadedFile, h);
          } catch (h) {
            this._logger.warn(`Unable to copy file for caching for future differential downloads: ${h.message}`);
          }
        return this.updateDownloaded(l, f);
      }
    });
  }
  async updateDownloaded(t, n) {
    var r;
    const i = n.downloadedFile, o = (r = t.info.size) !== null && r !== void 0 ? r : (await (0, to.stat)(i)).size, a = this._logger, s = `fileToProxy=${t.url.href}`;
    this.closeServerIfExists(), this.debug(`Creating proxy server for native Squirrel.Mac (${s})`), this.server = (0, Vw.createServer)(), this.debug(`Proxy server for native Squirrel.Mac is created (${s})`), this.server.on("close", () => {
      a.info(`Proxy server for native Squirrel.Mac is closed (${s})`);
    });
    const l = (m) => {
      const c = m.address();
      return typeof c == "string" ? c : `http://127.0.0.1:${c == null ? void 0 : c.port}`;
    };
    return await new Promise((m, c) => {
      const f = (0, ll.randomBytes)(64).toString("base64").replace(/\//g, "_").replace(/\+/g, "-"), h = Buffer.from(`autoupdater:${f}`, "ascii"), g = `/${(0, ll.randomBytes)(64).toString("hex")}.zip`;
      this.server.on("request", (_, y) => {
        const A = _.url;
        if (a.info(`${A} requested`), A === "/") {
          if (!_.headers.authorization || _.headers.authorization.indexOf("Basic ") === -1) {
            y.statusCode = 401, y.statusMessage = "Invalid Authentication Credentials", y.end(), a.warn("No authenthication info");
            return;
          }
          const N = _.headers.authorization.split(" ")[1], x = Buffer.from(N, "base64").toString("ascii"), [Z, ae] = x.split(":");
          if (Z !== "autoupdater" || ae !== f) {
            y.statusCode = 401, y.statusMessage = "Invalid Authentication Credentials", y.end(), a.warn("Invalid authenthication credentials");
            return;
          }
          const Y = Buffer.from(`{ "url": "${l(this.server)}${g}" }`);
          y.writeHead(200, { "Content-Type": "application/json", "Content-Length": Y.length }), y.end(Y);
          return;
        }
        if (!A.startsWith(g)) {
          a.warn(`${A} requested, but not supported`), y.writeHead(404), y.end();
          return;
        }
        a.info(`${g} requested by Squirrel.Mac, pipe ${i}`);
        let T = !1;
        y.on("finish", () => {
          T || (this.nativeUpdater.removeListener("error", c), m([]));
        });
        const S = (0, Ww.createReadStream)(i);
        S.on("error", (N) => {
          try {
            y.end();
          } catch (x) {
            a.warn(`cannot end response: ${x}`);
          }
          T = !0, this.nativeUpdater.removeListener("error", c), c(new Error(`Cannot pipe "${i}": ${N}`));
        }), y.writeHead(200, {
          "Content-Type": "application/zip",
          "Content-Length": o
        }), S.pipe(y);
      }), this.debug(`Proxy server for native Squirrel.Mac is starting to listen (${s})`), this.server.listen(0, "127.0.0.1", () => {
        this.debug(`Proxy server for native Squirrel.Mac is listening (address=${l(this.server)}, ${s})`), this.nativeUpdater.setFeedURL({
          url: l(this.server),
          headers: {
            "Cache-Control": "no-cache",
            Authorization: `Basic ${h.toString("base64")}`
          }
        }), this.dispatchUpdateDownloaded(n), this.autoInstallOnAppQuit ? (this.nativeUpdater.once("error", c), this.nativeUpdater.checkForUpdates()) : m([]);
      });
    });
  }
  handleUpdateDownloaded() {
    this.autoRunAppAfterInstall ? this.nativeUpdater.quitAndInstall() : this.app.quit(), this.closeServerIfExists();
  }
  quitAndInstall() {
    this.squirrelDownloadedUpdate ? this.handleUpdateDownloaded() : (this.nativeUpdater.on("update-downloaded", () => this.handleUpdateDownloaded()), this.autoInstallOnAppQuit || this.nativeUpdater.checkForUpdates());
  }
}
jn.MacUpdater = Xw;
var Hn = {}, Qo = {};
Object.defineProperty(Qo, "__esModule", { value: !0 });
Qo.verifySignature = Jw;
const cl = pe, bu = zr, Kw = Xr, ul = re;
function Jw(e, t, n) {
  return new Promise((r, i) => {
    const o = t.replace(/'/g, "''");
    n.info(`Verifying signature ${o}`), (0, bu.execFile)('set "PSModulePath=" & chcp 65001 >NUL & powershell.exe', ["-NoProfile", "-NonInteractive", "-InputFormat", "None", "-Command", `"Get-AuthenticodeSignature -LiteralPath '${o}' | ConvertTo-Json -Compress"`], {
      shell: !0,
      timeout: 20 * 1e3
    }, (a, s, l) => {
      var m;
      try {
        if (a != null || l) {
          no(n, a, l, i), r(null);
          return;
        }
        const c = Qw(s);
        if (c.Status === 0) {
          try {
            const _ = ul.normalize(c.Path), y = ul.normalize(t);
            if (n.info(`LiteralPath: ${_}. Update Path: ${y}`), _ !== y) {
              no(n, new Error(`LiteralPath of ${_} is different than ${y}`), l, i), r(null);
              return;
            }
          } catch (_) {
            n.warn(`Unable to verify LiteralPath of update asset due to missing data.Path. Skipping this step of validation. Message: ${(m = _.message) !== null && m !== void 0 ? m : _.stack}`);
          }
          const h = (0, cl.parseDn)(c.SignerCertificate.Subject);
          let g = !1;
          for (const _ of e) {
            const y = (0, cl.parseDn)(_);
            if (y.size ? g = Array.from(y.keys()).every((T) => y.get(T) === h.get(T)) : _ === h.get("CN") && (n.warn(`Signature validated using only CN ${_}. Please add your full Distinguished Name (DN) to publisherNames configuration`), g = !0), g) {
              r(null);
              return;
            }
          }
        }
        const f = `publisherNames: ${e.join(" | ")}, raw info: ` + JSON.stringify(c, (h, g) => h === "RawData" ? void 0 : g, 2);
        n.warn(`Sign verification failed, installer signed with incorrect certificate: ${f}`), r(f);
      } catch (c) {
        no(n, c, null, i), r(null);
        return;
      }
    });
  });
}
function Qw(e) {
  const t = JSON.parse(e);
  delete t.PrivateKey, delete t.IsOSBinary, delete t.SignatureType;
  const n = t.SignerCertificate;
  return n != null && (delete n.Archived, delete n.Extensions, delete n.Handle, delete n.HasPrivateKey, delete n.SubjectName), t;
}
function no(e, t, n, r) {
  if (Zw()) {
    e.warn(`Cannot execute Get-AuthenticodeSignature: ${t || n}. Ignoring signature validation due to unsupported powershell version. Please upgrade to powershell 3 or higher.`);
    return;
  }
  try {
    (0, bu.execFileSync)("powershell.exe", ["-NoProfile", "-NonInteractive", "-Command", "ConvertTo-Json test"], { timeout: 10 * 1e3 });
  } catch (i) {
    e.warn(`Cannot execute ConvertTo-Json: ${i.message}. Ignoring signature validation due to unsupported powershell version. Please upgrade to powershell 3 or higher.`);
    return;
  }
  t != null && r(t), n && r(new Error(`Cannot execute Get-AuthenticodeSignature, stderr: ${n}. Failing signature validation due to unknown stderr.`));
}
function Zw() {
  const e = Kw.release();
  return e.startsWith("6.") && !e.startsWith("6.3");
}
Object.defineProperty(Hn, "__esModule", { value: !0 });
Hn.NsisUpdater = void 0;
const br = pe, fl = re, e_ = rt, t_ = er, dl = _t, n_ = ue, r_ = wt, i_ = Qo, hl = an;
class o_ extends e_.BaseUpdater {
  constructor(t, n) {
    super(t, n), this._verifyUpdateCodeSignature = (r, i) => (0, i_.verifySignature)(r, i, this._logger);
  }
  /**
   * The verifyUpdateCodeSignature. You can pass [win-verify-signature](https://github.com/beyondkmp/win-verify-trust) or another custom verify function: ` (publisherName: string[], path: string) => Promise<string | null>`.
   * The default verify function uses [windowsExecutableCodeSignatureVerifier](https://github.com/electron-userland/electron-builder/blob/master/packages/electron-updater/src/windowsExecutableCodeSignatureVerifier.ts)
   */
  get verifyUpdateCodeSignature() {
    return this._verifyUpdateCodeSignature;
  }
  set verifyUpdateCodeSignature(t) {
    t && (this._verifyUpdateCodeSignature = t);
  }
  /*** @private */
  doDownloadUpdate(t) {
    const n = t.updateInfoAndProvider.provider, r = (0, n_.findFile)(n.resolveFiles(t.updateInfoAndProvider.info), "exe");
    return this.executeDownload({
      fileExtension: "exe",
      downloadUpdateOptions: t,
      fileInfo: r,
      task: async (i, o, a, s) => {
        const l = r.packageInfo, m = l != null && a != null;
        if (m && t.disableWebInstaller)
          throw (0, br.newError)(`Unable to download new version ${t.updateInfoAndProvider.info.version}. Web Installers are disabled`, "ERR_UPDATER_WEB_INSTALLER_DISABLED");
        !m && !t.disableWebInstaller && this._logger.warn("disableWebInstaller is set to false, you should set it to true if you do not plan on using a web installer. This will default to true in a future version."), (m || t.disableDifferentialDownload || await this.differentialDownloadInstaller(r, t, i, n, br.CURRENT_APP_INSTALLER_FILE_NAME)) && await this.httpExecutor.download(r.url, i, o);
        const c = await this.verifySignature(i);
        if (c != null)
          throw await s(), (0, br.newError)(`New version ${t.updateInfoAndProvider.info.version} is not signed by the application owner: ${c}`, "ERR_UPDATER_INVALID_SIGNATURE");
        if (m && await this.differentialDownloadWebPackage(t, l, a, n))
          try {
            await this.httpExecutor.download(new hl.URL(l.path), a, {
              headers: t.requestHeaders,
              cancellationToken: t.cancellationToken,
              sha512: l.sha512
            });
          } catch (f) {
            try {
              await (0, r_.unlink)(a);
            } catch {
            }
            throw f;
          }
      }
    });
  }
  // $certificateInfo = (Get-AuthenticodeSignature 'xxx\yyy.exe'
  // | where {$_.Status.Equals([System.Management.Automation.SignatureStatus]::Valid) -and $_.SignerCertificate.Subject.Contains("CN=siemens.com")})
  // | Out-String ; if ($certificateInfo) { exit 0 } else { exit 1 }
  async verifySignature(t) {
    let n;
    try {
      if (n = (await this.configOnDisk.value).publisherName, n == null)
        return null;
    } catch (r) {
      if (r.code === "ENOENT")
        return null;
      throw r;
    }
    return await this._verifyUpdateCodeSignature(Array.isArray(n) ? n : [n], t);
  }
  doInstall(t) {
    const n = this.installerPath;
    if (n == null)
      return this.dispatchError(new Error("No valid update available, can't quit and install")), !1;
    const r = ["--updated"];
    t.isSilent && r.push("/S"), t.isForceRunAfter && r.push("--force-run"), this.installDirectory && r.push(`/D=${this.installDirectory}`);
    const i = this.downloadedUpdateHelper == null ? null : this.downloadedUpdateHelper.packageFile;
    i != null && r.push(`--package-file=${i}`);
    const o = () => {
      this.spawnLog(fl.join(process.resourcesPath, "elevate.exe"), [n].concat(r)).catch((a) => this.dispatchError(a));
    };
    return t.isAdminRightsRequired ? (this._logger.info("isAdminRightsRequired is set to true, run installer using elevate.exe"), o(), !0) : (this.spawnLog(n, r).catch((a) => {
      const s = a.code;
      this._logger.info(`Cannot run installer: error code: ${s}, error message: "${a.message}", will be executed again using elevate if EACCES, and will try to use electron.shell.openItem if ENOENT`), s === "UNKNOWN" || s === "EACCES" ? o() : s === "ENOENT" ? Ft.shell.openPath(n).catch((l) => this.dispatchError(l)) : this.dispatchError(a);
    }), !0);
  }
  async differentialDownloadWebPackage(t, n, r, i) {
    if (n.blockMapSize == null)
      return !0;
    try {
      const o = {
        newUrl: new hl.URL(n.path),
        oldFile: fl.join(this.downloadedUpdateHelper.cacheDir, br.CURRENT_APP_PACKAGE_FILE_NAME),
        logger: this._logger,
        newFile: r,
        requestHeaders: this.requestHeaders,
        isUseMultipleRangeRequest: i.isUseMultipleRangeRequest,
        cancellationToken: t.cancellationToken
      };
      this.listenerCount(dl.DOWNLOAD_PROGRESS) > 0 && (o.onProgress = (a) => this.emit(dl.DOWNLOAD_PROGRESS, a)), await new t_.FileWithEmbeddedBlockMapDifferentialDownloader(n, this.httpExecutor, o).download();
    } catch (o) {
      return this._logger.error(`Cannot download differentially, fallback to full download: ${o.stack || o}`), process.platform === "win32";
    }
    return !1;
  }
}
Hn.NsisUpdater = o_;
(function(e) {
  var t = Ce && Ce.__createBinding || (Object.create ? function(A, T, S, N) {
    N === void 0 && (N = S);
    var x = Object.getOwnPropertyDescriptor(T, S);
    (!x || ("get" in x ? !T.__esModule : x.writable || x.configurable)) && (x = { enumerable: !0, get: function() {
      return T[S];
    } }), Object.defineProperty(A, N, x);
  } : function(A, T, S, N) {
    N === void 0 && (N = S), A[N] = T[S];
  }), n = Ce && Ce.__exportStar || function(A, T) {
    for (var S in A) S !== "default" && !Object.prototype.hasOwnProperty.call(T, S) && t(T, A, S);
  };
  Object.defineProperty(e, "__esModule", { value: !0 }), e.NsisUpdater = e.MacUpdater = e.RpmUpdater = e.PacmanUpdater = e.DebUpdater = e.AppImageUpdater = e.Provider = e.NoOpLogger = e.AppUpdater = e.BaseUpdater = void 0;
  const r = wt, i = re;
  var o = rt;
  Object.defineProperty(e, "BaseUpdater", { enumerable: !0, get: function() {
    return o.BaseUpdater;
  } });
  var a = pt;
  Object.defineProperty(e, "AppUpdater", { enumerable: !0, get: function() {
    return a.AppUpdater;
  } }), Object.defineProperty(e, "NoOpLogger", { enumerable: !0, get: function() {
    return a.NoOpLogger;
  } });
  var s = ue;
  Object.defineProperty(e, "Provider", { enumerable: !0, get: function() {
    return s.Provider;
  } });
  var l = Un;
  Object.defineProperty(e, "AppImageUpdater", { enumerable: !0, get: function() {
    return l.AppImageUpdater;
  } });
  var m = kn;
  Object.defineProperty(e, "DebUpdater", { enumerable: !0, get: function() {
    return m.DebUpdater;
  } });
  var c = Mn;
  Object.defineProperty(e, "PacmanUpdater", { enumerable: !0, get: function() {
    return c.PacmanUpdater;
  } });
  var f = Bn;
  Object.defineProperty(e, "RpmUpdater", { enumerable: !0, get: function() {
    return f.RpmUpdater;
  } });
  var h = jn;
  Object.defineProperty(e, "MacUpdater", { enumerable: !0, get: function() {
    return h.MacUpdater;
  } });
  var g = Hn;
  Object.defineProperty(e, "NsisUpdater", { enumerable: !0, get: function() {
    return g.NsisUpdater;
  } }), n(_t, e);
  let _;
  function y() {
    if (process.platform === "win32")
      _ = new Hn.NsisUpdater();
    else if (process.platform === "darwin")
      _ = new jn.MacUpdater();
    else {
      _ = new Un.AppImageUpdater();
      try {
        const A = i.join(process.resourcesPath, "package-type");
        if (!(0, r.existsSync)(A))
          return _;
        console.info("Checking for beta autoupdate feature for deb/rpm distributions");
        const T = (0, r.readFileSync)(A).toString().trim();
        switch (console.info("Found package-type:", T), T) {
          case "deb":
            _ = new kn.DebUpdater();
            break;
          case "rpm":
            _ = new Bn.RpmUpdater();
            break;
          case "pacman":
            _ = new Mn.PacmanUpdater();
            break;
          default:
            break;
        }
      } catch (A) {
        console.warn("Unable to detect 'package-type' for autoUpdater (beta rpm/deb support). If you'd like to expand support, please consider contributing to electron-builder", A.message);
      }
    }
    return _;
  }
  Object.defineProperty(e, "autoUpdater", {
    enumerable: !0,
    get: () => _ || y()
  });
})(et);
const Dr = Te.dirname(kf(import.meta.url));
process.env.APP_ROOT = Te.join(Dr, "..");
const Vr = process.env.VITE_DEV_SERVER_URL, b_ = Te.join(process.env.APP_ROOT, "dist-electron"), Nr = Te.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = Vr ? Te.join(process.env.APP_ROOT, "public") : Nr;
const Yr = "crystalapp", a_ = "https://www.crystalapp.tech/auth/desktop-signin";
let en = null, W, se, $n;
function Zo(e, t = !0) {
  console.log("[Auth] Received deep link:", e);
  try {
    const n = new URL(e), r = `${n.host}${n.pathname}`;
    if (console.log("[Auth] Parsed URL - host:", n.host, "pathname:", n.pathname, "fullPath:", r), r === "auth/callback" || n.pathname === "/auth/callback" || n.pathname === "//auth/callback") {
      const i = n.searchParams.get("ticket");
      console.log("[Auth] Extracted ticket:", i ? "present" : "missing"), i && (t && W && !W.isDestroyed() ? (console.log("[Auth] Sending ticket to renderer immediately"), W.webContents.send("auth-callback", { ticket: i }), W.show(), W.focus()) : (console.log("[Auth] Window not ready, storing URL for later"), en = e));
    }
  } catch (n) {
    console.error("[Auth] Failed to parse callback URL:", n);
  }
}
function s_() {
  en && W && !W.isDestroyed() && (console.log("[Auth] Processing pending deep link"), Zo(en, !0), en = null);
}
process.defaultApp ? process.argv.length >= 2 && ke.setAsDefaultProtocolClient(Yr, process.execPath, [Te.resolve(process.argv[1])]) : ke.setAsDefaultProtocolClient(Yr);
console.log("[Auth] Launch args:", process.argv);
const ro = process.argv.find((e) => e.startsWith(`${Yr}://`));
ro && (console.log("[Auth] App launched with deep link:", ro), en = ro);
const $u = ke.requestSingleInstanceLock();
console.log("[Auth] Single instance lock:", $u ? "acquired" : "failed");
$u ? ke.on("second-instance", (e, t) => {
  console.log("[Auth] Second instance detected, commandLine:", t);
  const n = t.find((r) => r.startsWith(`${Yr}://`));
  n && Zo(n, !0), W && (W.isMinimized() && W.restore(), W.show(), W.focus());
}) : ke.quit();
ke.on("open-url", (e, t) => {
  e.preventDefault(), console.log("[Auth] macOS open-url event:", t), ke.isReady() && W && !W.isDestroyed() ? Zo(t, !0) : en = t;
});
function Ou() {
  const e = Ff.getPrimaryDisplay(), { width: t, height: n } = e.workAreaSize, r = 20, i = 480, o = 400, a = 320, s = 50, l = 192, m = Math.floor((t - i) / 2), c = Math.floor((n - o) / 2), f = t - a - 2 * r, h = n - 5 * s - 2 * r, g = r, _ = n - l - r;
  W = new $r({
    width: i,
    height: o,
    x: m,
    y: c,
    minWidth: 540,
    minHeight: 200,
    frame: !1,
    transparent: !0,
    alwaysOnTop: !0,
    focusable: !0,
    icon: Te.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      nodeIntegration: !1,
      contextIsolation: !0,
      devTools: !0,
      preload: Te.join(Dr, "preload.mjs")
    }
  }), se = new $r({
    width: a,
    height: s,
    x: f,
    y: h,
    minHeight: 70,
    maxHeight: 400,
    minWidth: a,
    maxWidth: a,
    frame: !1,
    transparent: !0,
    alwaysOnTop: !0,
    focusable: !1,
    icon: Te.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      nodeIntegration: !1,
      contextIsolation: !0,
      devTools: !0,
      preload: Te.join(Dr, "preload.mjs")
    }
  }), $n = new $r({
    width: l,
    height: l,
    x: g,
    y: _,
    minHeight: 192,
    maxHeight: 192,
    minWidth: 192,
    maxWidth: 192,
    frame: !1,
    transparent: !0,
    alwaysOnTop: !0,
    focusable: !1,
    icon: Te.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      nodeIntegration: !1,
      contextIsolation: !0,
      devTools: !0,
      preload: Te.join(Dr, "preload.mjs")
    }
  }), W.setVisibleOnAllWorkspaces(!0, { visibleOnFullScreen: !0 }), W.setAlwaysOnTop(!0, "screen-saver", 1), se.setVisibleOnAllWorkspaces(!0, { visibleOnFullScreen: !0 }), se.setAlwaysOnTop(!0, "screen-saver", 1), W.webContents.on("did-finish-load", () => {
    W == null || W.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString()), s_();
  }), se.webContents.on("did-finish-load", () => {
    se == null || se.webContents.send(
      "main-process-message",
      (/* @__PURE__ */ new Date()).toLocaleString()
    );
  }), Vr ? (W.loadURL(Vr), se.loadURL("http://localhost:5173/studio.html"), $n.loadURL("http://localhost:5173/webcam.html")) : (W.loadFile(Te.join(Nr, "index.html")), se.loadFile(Te.join(Nr, "studio.html")), $n.loadFile(Te.join(Nr, "webcam.html")));
}
ke.on("window-all-closed", () => {
  process.platform !== "darwin" && (ke.quit(), W = null, se = null, $n = null);
});
nt.on("closeApp", () => {
  process.platform !== "darwin" && (ke.quit(), W = null, se = null, $n = null);
});
nt.handle("getSources", async () => await Df.getSources({
  thumbnailSize: { height: 100, width: 150 },
  fetchWindowIcons: !0,
  types: ["window", "screen"]
}));
nt.on("media-sources", (e, t) => {
  console.log(e), se == null || se.webContents.send("profile-received", t);
});
nt.on("resize-studio", (e, t) => {
  console.log(e), t.shrink && (se == null || se.setSize(400, 100)), t.shrink || se == null || se.setSize(400, 250);
});
nt.on("hide-plugin", (e, t) => {
  console.log(e), W == null || W.webContents.send("hide-plugin", t);
});
nt.on("open-devtools", () => {
  W == null || W.webContents.openDevTools();
});
nt.on("minimize-window", () => {
  W == null || W.minimize();
});
nt.handle("clear-auth-cookies", async () => {
  var t, n, r;
  console.log("[Auth] Clearing auth cookies");
  const e = pl.defaultSession;
  try {
    const i = await e.cookies.get({});
    for (const o of i)
      if ((t = o.domain) != null && t.includes("clerk") || (n = o.domain) != null && n.includes("crystalapp")) {
        const a = `http${o.secure ? "s" : ""}://${(r = o.domain) != null && r.startsWith(".") ? o.domain.slice(1) : o.domain}${o.path}`;
        await e.cookies.remove(a, o.name), console.log("[Auth] Removed cookie:", o.name, "from", o.domain);
      }
    console.log("[Auth] Cookies cleared");
  } catch (i) {
    console.error("[Auth] Failed to clear cookies:", i);
  }
});
nt.handle("open-browser-signin", async () => {
  var t, n, r;
  console.log("[Auth] Opening browser for sign-in");
  const e = pl.defaultSession;
  try {
    const i = await e.cookies.get({});
    for (const o of i)
      if ((t = o.domain) != null && t.includes("clerk") || (n = o.domain) != null && n.includes("crystalapp")) {
        const a = `http${o.secure ? "s" : ""}://${(r = o.domain) != null && r.startsWith(".") ? o.domain.slice(1) : o.domain}${o.path}`;
        await e.cookies.remove(a, o.name);
      }
  } catch (i) {
    console.error("[Auth] Failed to clear cookies before sign-in:", i);
  }
  await Nf.openExternal(a_);
});
ke.on("activate", () => {
  $r.getAllWindows().length === 0 && Ou();
});
ke.whenReady().then(() => {
  try {
    Ou(), Vr || et.autoUpdater.checkForUpdatesAndNotify();
  } catch (e) {
    console.error("[App] Startup error:", e), ml.showErrorBox("Crystal Error", `Failed to start: ${e}`);
  }
});
et.autoUpdater.on("checking-for-update", () => {
  console.log("[AutoUpdater] Checking for updates...");
});
et.autoUpdater.on("update-available", (e) => {
  console.log("[AutoUpdater] Update available:", e.version);
});
et.autoUpdater.on("update-not-available", () => {
  console.log("[AutoUpdater] No updates available.");
});
et.autoUpdater.on("download-progress", (e) => {
  console.log(`[AutoUpdater] Download progress: ${e.percent.toFixed(1)}%`);
});
et.autoUpdater.on("update-downloaded", (e) => {
  console.log("[AutoUpdater] Update downloaded:", e.version), et.autoUpdater.quitAndInstall(!1, !0);
});
et.autoUpdater.on("error", (e) => {
  console.error("[AutoUpdater] Error:", e.message);
});
process.on("uncaughtException", (e) => {
  console.error("[Process] Uncaught exception:", e), ml.showErrorBox("Crystal Error", `Unexpected error: ${e.message}`);
});
process.on("unhandledRejection", (e) => {
  console.error("[Process] Unhandled rejection:", e);
});
export {
  b_ as MAIN_DIST,
  Nr as RENDERER_DIST,
  Vr as VITE_DEV_SERVER_URL
};

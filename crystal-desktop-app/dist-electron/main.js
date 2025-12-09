import Dt, { app as Cr, ipcMain as Ft, desktopCapturer as bf, BrowserWindow as bn, dialog as ul, screen as $f } from "electron";
import Et from "fs";
import Of from "constants";
import jr from "stream";
import yo from "util";
import fl from "assert";
import re from "path";
import Vn from "child_process";
import dl from "events";
import Hr from "crypto";
import hl from "tty";
import Yn from "os";
import nr from "url";
import If from "string_decoder";
import pl from "zlib";
import Rf from "http";
import { fileURLToPath as Pf } from "node:url";
import Pe from "node:path";
var Te = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {}, Ze = {}, xt = {}, $e = {};
$e.fromCallback = function(e) {
  return Object.defineProperty(function(...t) {
    if (typeof t[t.length - 1] == "function") e.apply(this, t);
    else
      return new Promise((r, n) => {
        t.push((i, o) => i != null ? n(i) : r(o)), e.apply(this, t);
      });
  }, "name", { value: e.name });
};
$e.fromPromise = function(e) {
  return Object.defineProperty(function(...t) {
    const r = t[t.length - 1];
    if (typeof r != "function") return e.apply(this, t);
    t.pop(), e.apply(this, t).then((n) => r(null, n), r);
  }, "name", { value: e.name });
};
var at = Of, Df = process.cwd, $n = null, Nf = process.env.GRACEFUL_FS_PLATFORM || process.platform;
process.cwd = function() {
  return $n || ($n = Df.call(process)), $n;
};
try {
  process.cwd();
} catch {
}
if (typeof process.chdir == "function") {
  var pa = process.chdir;
  process.chdir = function(e) {
    $n = null, pa.call(process, e);
  }, Object.setPrototypeOf && Object.setPrototypeOf(process.chdir, pa);
}
var Ff = xf;
function xf(e) {
  at.hasOwnProperty("O_SYMLINK") && process.version.match(/^v0\.6\.[0-2]|^v0\.5\./) && t(e), e.lutimes || r(e), e.chown = o(e.chown), e.fchown = o(e.fchown), e.lchown = o(e.lchown), e.chmod = n(e.chmod), e.fchmod = n(e.fchmod), e.lchmod = n(e.lchmod), e.chownSync = a(e.chownSync), e.fchownSync = a(e.fchownSync), e.lchownSync = a(e.lchownSync), e.chmodSync = i(e.chmodSync), e.fchmodSync = i(e.fchmodSync), e.lchmodSync = i(e.lchmodSync), e.stat = s(e.stat), e.fstat = s(e.fstat), e.lstat = s(e.lstat), e.statSync = l(e.statSync), e.fstatSync = l(e.fstatSync), e.lstatSync = l(e.lstatSync), e.chmod && !e.lchmod && (e.lchmod = function(c, f, h) {
    h && process.nextTick(h);
  }, e.lchmodSync = function() {
  }), e.chown && !e.lchown && (e.lchown = function(c, f, h, g) {
    g && process.nextTick(g);
  }, e.lchownSync = function() {
  }), Nf === "win32" && (e.rename = typeof e.rename != "function" ? e.rename : function(c) {
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
        S = function(x, Q, oe) {
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
        at.O_WRONLY | at.O_SYMLINK,
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
      var g = c.openSync(f, at.O_WRONLY | at.O_SYMLINK, h), _ = !0, y;
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
  function r(c) {
    at.hasOwnProperty("O_SYMLINK") && c.futimes ? (c.lutimes = function(f, h, g, _) {
      c.open(f, at.O_SYMLINK, function(y, A) {
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
      var _ = c.openSync(f, at.O_SYMLINK), y, A = !0;
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
  function n(c) {
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
var ma = jr.Stream, Lf = Uf;
function Uf(e) {
  return {
    ReadStream: t,
    WriteStream: r
  };
  function t(n, i) {
    if (!(this instanceof t)) return new t(n, i);
    ma.call(this);
    var o = this;
    this.path = n, this.fd = null, this.readable = !0, this.paused = !1, this.flags = "r", this.mode = 438, this.bufferSize = 64 * 1024, i = i || {};
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
  function r(n, i) {
    if (!(this instanceof r)) return new r(n, i);
    ma.call(this), this.path = n, this.fd = null, this.writable = !0, this.flags = "w", this.encoding = "binary", this.mode = 438, this.bytesWritten = 0, i = i || {};
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
var kf = Bf, Mf = Object.getPrototypeOf || function(e) {
  return e.__proto__;
};
function Bf(e) {
  if (e === null || typeof e != "object")
    return e;
  if (e instanceof Object)
    var t = { __proto__: Mf(e) };
  else
    var t = /* @__PURE__ */ Object.create(null);
  return Object.getOwnPropertyNames(e).forEach(function(r) {
    Object.defineProperty(t, r, Object.getOwnPropertyDescriptor(e, r));
  }), t;
}
var te = Et, jf = Ff, Hf = Lf, qf = kf, un = yo, Ee, Nn;
typeof Symbol == "function" && typeof Symbol.for == "function" ? (Ee = Symbol.for("graceful-fs.queue"), Nn = Symbol.for("graceful-fs.previous")) : (Ee = "___graceful-fs.queue", Nn = "___graceful-fs.previous");
function Gf() {
}
function ml(e, t) {
  Object.defineProperty(e, Ee, {
    get: function() {
      return t;
    }
  });
}
var Rt = Gf;
un.debuglog ? Rt = un.debuglog("gfs4") : /\bgfs4\b/i.test(process.env.NODE_DEBUG || "") && (Rt = function() {
  var e = un.format.apply(un, arguments);
  e = "GFS4: " + e.split(/\n/).join(`
GFS4: `), console.error(e);
});
if (!te[Ee]) {
  var Wf = Te[Ee] || [];
  ml(te, Wf), te.close = function(e) {
    function t(r, n) {
      return e.call(te, r, function(i) {
        i || ga(), typeof n == "function" && n.apply(this, arguments);
      });
    }
    return Object.defineProperty(t, Nn, {
      value: e
    }), t;
  }(te.close), te.closeSync = function(e) {
    function t(r) {
      e.apply(te, arguments), ga();
    }
    return Object.defineProperty(t, Nn, {
      value: e
    }), t;
  }(te.closeSync), /\bgfs4\b/i.test(process.env.NODE_DEBUG || "") && process.on("exit", function() {
    Rt(te[Ee]), fl.equal(te[Ee].length, 0);
  });
}
Te[Ee] || ml(Te, te[Ee]);
var Oe = vo(qf(te));
process.env.TEST_GRACEFUL_FS_GLOBAL_PATCH && !te.__patched && (Oe = vo(te), te.__patched = !0);
function vo(e) {
  jf(e), e.gracefulify = vo, e.createReadStream = Q, e.createWriteStream = oe;
  var t = e.readFile;
  e.readFile = r;
  function r(E, q, B) {
    return typeof q == "function" && (B = q, q = null), M(E, q, B);
    function M(z, I, $, P) {
      return t(z, I, function(b) {
        b && (b.code === "EMFILE" || b.code === "ENFILE") ? Mt([M, [z, I, $], b, P || Date.now(), Date.now()]) : typeof $ == "function" && $.apply(this, arguments);
      });
    }
  }
  var n = e.writeFile;
  e.writeFile = i;
  function i(E, q, B, M) {
    return typeof B == "function" && (M = B, B = null), z(E, q, B, M);
    function z(I, $, P, b, D) {
      return n(I, $, P, function(R) {
        R && (R.code === "EMFILE" || R.code === "ENFILE") ? Mt([z, [I, $, P, b], R, D || Date.now(), Date.now()]) : typeof b == "function" && b.apply(this, arguments);
      });
    }
  }
  var o = e.appendFile;
  o && (e.appendFile = a);
  function a(E, q, B, M) {
    return typeof B == "function" && (M = B, B = null), z(E, q, B, M);
    function z(I, $, P, b, D) {
      return o(I, $, P, function(R) {
        R && (R.code === "EMFILE" || R.code === "ENFILE") ? Mt([z, [I, $, P, b], R, D || Date.now(), Date.now()]) : typeof b == "function" && b.apply(this, arguments);
      });
    }
  }
  var s = e.copyFile;
  s && (e.copyFile = l);
  function l(E, q, B, M) {
    return typeof B == "function" && (M = B, B = 0), z(E, q, B, M);
    function z(I, $, P, b, D) {
      return s(I, $, P, function(R) {
        R && (R.code === "EMFILE" || R.code === "ENFILE") ? Mt([z, [I, $, P, b], R, D || Date.now(), Date.now()]) : typeof b == "function" && b.apply(this, arguments);
      });
    }
  }
  var m = e.readdir;
  e.readdir = f;
  var c = /^v[0-5]\./;
  function f(E, q, B) {
    typeof q == "function" && (B = q, q = null);
    var M = c.test(process.version) ? function($, P, b, D) {
      return m($, z(
        $,
        P,
        b,
        D
      ));
    } : function($, P, b, D) {
      return m($, P, z(
        $,
        P,
        b,
        D
      ));
    };
    return M(E, q, B);
    function z(I, $, P, b) {
      return function(D, R) {
        D && (D.code === "EMFILE" || D.code === "ENFILE") ? Mt([
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
    var h = Hf(e);
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
  function Q(E, q) {
    return new e.ReadStream(E, q);
  }
  function oe(E, q) {
    return new e.WriteStream(E, q);
  }
  var V = e.open;
  e.open = Fe;
  function Fe(E, q, B, M) {
    return typeof B == "function" && (M = B, B = null), z(E, q, B, M);
    function z(I, $, P, b, D) {
      return V(I, $, P, function(R, k) {
        R && (R.code === "EMFILE" || R.code === "ENFILE") ? Mt([z, [I, $, P, b], R, D || Date.now(), Date.now()]) : typeof b == "function" && b.apply(this, arguments);
      });
    }
  }
  return e;
}
function Mt(e) {
  Rt("ENQUEUE", e[0].name, e[1]), te[Ee].push(e), wo();
}
var fn;
function ga() {
  for (var e = Date.now(), t = 0; t < te[Ee].length; ++t)
    te[Ee][t].length > 2 && (te[Ee][t][3] = e, te[Ee][t][4] = e);
  wo();
}
function wo() {
  if (clearTimeout(fn), fn = void 0, te[Ee].length !== 0) {
    var e = te[Ee].shift(), t = e[0], r = e[1], n = e[2], i = e[3], o = e[4];
    if (i === void 0)
      Rt("RETRY", t.name, r), t.apply(null, r);
    else if (Date.now() - i >= 6e4) {
      Rt("TIMEOUT", t.name, r);
      var a = r.pop();
      typeof a == "function" && a.call(null, n);
    } else {
      var s = Date.now() - o, l = Math.max(o - i, 1), m = Math.min(l * 1.2, 100);
      s >= m ? (Rt("RETRY", t.name, r), t.apply(null, r.concat([i]))) : te[Ee].push(e);
    }
    fn === void 0 && (fn = setTimeout(wo, 0));
  }
}
(function(e) {
  const t = $e.fromCallback, r = Oe, n = [
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
  ].filter((i) => typeof r[i] == "function");
  Object.assign(e, r), n.forEach((i) => {
    e[i] = t(r[i]);
  }), e.exists = function(i, o) {
    return typeof o == "function" ? r.exists(i, o) : new Promise((a) => r.exists(i, a));
  }, e.read = function(i, o, a, s, l, m) {
    return typeof m == "function" ? r.read(i, o, a, s, l, m) : new Promise((c, f) => {
      r.read(i, o, a, s, l, (h, g, _) => {
        if (h) return f(h);
        c({ bytesRead: g, buffer: _ });
      });
    });
  }, e.write = function(i, o, ...a) {
    return typeof a[a.length - 1] == "function" ? r.write(i, o, ...a) : new Promise((s, l) => {
      r.write(i, o, ...a, (m, c, f) => {
        if (m) return l(m);
        s({ bytesWritten: c, buffer: f });
      });
    });
  }, typeof r.writev == "function" && (e.writev = function(i, o, ...a) {
    return typeof a[a.length - 1] == "function" ? r.writev(i, o, ...a) : new Promise((s, l) => {
      r.writev(i, o, ...a, (m, c, f) => {
        if (m) return l(m);
        s({ bytesWritten: c, buffers: f });
      });
    });
  }), typeof r.realpath.native == "function" ? e.realpath.native = t(r.realpath.native) : process.emitWarning(
    "fs.realpath.native is not a function. Is fs being monkey-patched?",
    "Warning",
    "fs-extra-WARN0003"
  );
})(xt);
var _o = {}, gl = {};
const Vf = re;
gl.checkPath = function(t) {
  if (process.platform === "win32" && /[<>:"|?*]/.test(t.replace(Vf.parse(t).root, ""))) {
    const n = new Error(`Path contains invalid characters: ${t}`);
    throw n.code = "EINVAL", n;
  }
};
const El = xt, { checkPath: yl } = gl, vl = (e) => {
  const t = { mode: 511 };
  return typeof e == "number" ? e : { ...t, ...e }.mode;
};
_o.makeDir = async (e, t) => (yl(e), El.mkdir(e, {
  mode: vl(t),
  recursive: !0
}));
_o.makeDirSync = (e, t) => (yl(e), El.mkdirSync(e, {
  mode: vl(t),
  recursive: !0
}));
const Yf = $e.fromPromise, { makeDir: zf, makeDirSync: Ti } = _o, Ci = Yf(zf);
var Xe = {
  mkdirs: Ci,
  mkdirsSync: Ti,
  // alias
  mkdirp: Ci,
  mkdirpSync: Ti,
  ensureDir: Ci,
  ensureDirSync: Ti
};
const Xf = $e.fromPromise, wl = xt;
function Kf(e) {
  return wl.access(e).then(() => !0).catch(() => !1);
}
var Lt = {
  pathExists: Xf(Kf),
  pathExistsSync: wl.existsSync
};
const Jt = Oe;
function Jf(e, t, r, n) {
  Jt.open(e, "r+", (i, o) => {
    if (i) return n(i);
    Jt.futimes(o, t, r, (a) => {
      Jt.close(o, (s) => {
        n && n(a || s);
      });
    });
  });
}
function Qf(e, t, r) {
  const n = Jt.openSync(e, "r+");
  return Jt.futimesSync(n, t, r), Jt.closeSync(n);
}
var _l = {
  utimesMillis: Jf,
  utimesMillisSync: Qf
};
const Zt = xt, he = re, Zf = yo;
function ed(e, t, r) {
  const n = r.dereference ? (i) => Zt.stat(i, { bigint: !0 }) : (i) => Zt.lstat(i, { bigint: !0 });
  return Promise.all([
    n(e),
    n(t).catch((i) => {
      if (i.code === "ENOENT") return null;
      throw i;
    })
  ]).then(([i, o]) => ({ srcStat: i, destStat: o }));
}
function td(e, t, r) {
  let n;
  const i = r.dereference ? (a) => Zt.statSync(a, { bigint: !0 }) : (a) => Zt.lstatSync(a, { bigint: !0 }), o = i(e);
  try {
    n = i(t);
  } catch (a) {
    if (a.code === "ENOENT") return { srcStat: o, destStat: null };
    throw a;
  }
  return { srcStat: o, destStat: n };
}
function rd(e, t, r, n, i) {
  Zf.callbackify(ed)(e, t, n, (o, a) => {
    if (o) return i(o);
    const { srcStat: s, destStat: l } = a;
    if (l) {
      if (qr(s, l)) {
        const m = he.basename(e), c = he.basename(t);
        return r === "move" && m !== c && m.toLowerCase() === c.toLowerCase() ? i(null, { srcStat: s, destStat: l, isChangingCase: !0 }) : i(new Error("Source and destination must not be the same."));
      }
      if (s.isDirectory() && !l.isDirectory())
        return i(new Error(`Cannot overwrite non-directory '${t}' with directory '${e}'.`));
      if (!s.isDirectory() && l.isDirectory())
        return i(new Error(`Cannot overwrite directory '${t}' with non-directory '${e}'.`));
    }
    return s.isDirectory() && Ao(e, t) ? i(new Error(zn(e, t, r))) : i(null, { srcStat: s, destStat: l });
  });
}
function nd(e, t, r, n) {
  const { srcStat: i, destStat: o } = td(e, t, n);
  if (o) {
    if (qr(i, o)) {
      const a = he.basename(e), s = he.basename(t);
      if (r === "move" && a !== s && a.toLowerCase() === s.toLowerCase())
        return { srcStat: i, destStat: o, isChangingCase: !0 };
      throw new Error("Source and destination must not be the same.");
    }
    if (i.isDirectory() && !o.isDirectory())
      throw new Error(`Cannot overwrite non-directory '${t}' with directory '${e}'.`);
    if (!i.isDirectory() && o.isDirectory())
      throw new Error(`Cannot overwrite directory '${t}' with non-directory '${e}'.`);
  }
  if (i.isDirectory() && Ao(e, t))
    throw new Error(zn(e, t, r));
  return { srcStat: i, destStat: o };
}
function Al(e, t, r, n, i) {
  const o = he.resolve(he.dirname(e)), a = he.resolve(he.dirname(r));
  if (a === o || a === he.parse(a).root) return i();
  Zt.stat(a, { bigint: !0 }, (s, l) => s ? s.code === "ENOENT" ? i() : i(s) : qr(t, l) ? i(new Error(zn(e, r, n))) : Al(e, t, a, n, i));
}
function Sl(e, t, r, n) {
  const i = he.resolve(he.dirname(e)), o = he.resolve(he.dirname(r));
  if (o === i || o === he.parse(o).root) return;
  let a;
  try {
    a = Zt.statSync(o, { bigint: !0 });
  } catch (s) {
    if (s.code === "ENOENT") return;
    throw s;
  }
  if (qr(t, a))
    throw new Error(zn(e, r, n));
  return Sl(e, t, o, n);
}
function qr(e, t) {
  return t.ino && t.dev && t.ino === e.ino && t.dev === e.dev;
}
function Ao(e, t) {
  const r = he.resolve(e).split(he.sep).filter((i) => i), n = he.resolve(t).split(he.sep).filter((i) => i);
  return r.reduce((i, o, a) => i && n[a] === o, !0);
}
function zn(e, t, r) {
  return `Cannot ${r} '${e}' to a subdirectory of itself, '${t}'.`;
}
var ir = {
  checkPaths: rd,
  checkPathsSync: nd,
  checkParentPaths: Al,
  checkParentPathsSync: Sl,
  isSrcSubdir: Ao,
  areIdentical: qr
};
const De = Oe, br = re, id = Xe.mkdirs, od = Lt.pathExists, ad = _l.utimesMillis, $r = ir;
function sd(e, t, r, n) {
  typeof r == "function" && !n ? (n = r, r = {}) : typeof r == "function" && (r = { filter: r }), n = n || function() {
  }, r = r || {}, r.clobber = "clobber" in r ? !!r.clobber : !0, r.overwrite = "overwrite" in r ? !!r.overwrite : r.clobber, r.preserveTimestamps && process.arch === "ia32" && process.emitWarning(
    `Using the preserveTimestamps option in 32-bit node is not recommended;

	see https://github.com/jprichardson/node-fs-extra/issues/269`,
    "Warning",
    "fs-extra-WARN0001"
  ), $r.checkPaths(e, t, "copy", r, (i, o) => {
    if (i) return n(i);
    const { srcStat: a, destStat: s } = o;
    $r.checkParentPaths(e, a, t, "copy", (l) => l ? n(l) : r.filter ? Tl(Ea, s, e, t, r, n) : Ea(s, e, t, r, n));
  });
}
function Ea(e, t, r, n, i) {
  const o = br.dirname(r);
  od(o, (a, s) => {
    if (a) return i(a);
    if (s) return Fn(e, t, r, n, i);
    id(o, (l) => l ? i(l) : Fn(e, t, r, n, i));
  });
}
function Tl(e, t, r, n, i, o) {
  Promise.resolve(i.filter(r, n)).then((a) => a ? e(t, r, n, i, o) : o(), (a) => o(a));
}
function ld(e, t, r, n, i) {
  return n.filter ? Tl(Fn, e, t, r, n, i) : Fn(e, t, r, n, i);
}
function Fn(e, t, r, n, i) {
  (n.dereference ? De.stat : De.lstat)(t, (a, s) => a ? i(a) : s.isDirectory() ? md(s, e, t, r, n, i) : s.isFile() || s.isCharacterDevice() || s.isBlockDevice() ? cd(s, e, t, r, n, i) : s.isSymbolicLink() ? yd(e, t, r, n, i) : s.isSocket() ? i(new Error(`Cannot copy a socket file: ${t}`)) : s.isFIFO() ? i(new Error(`Cannot copy a FIFO pipe: ${t}`)) : i(new Error(`Unknown file: ${t}`)));
}
function cd(e, t, r, n, i, o) {
  return t ? ud(e, r, n, i, o) : Cl(e, r, n, i, o);
}
function ud(e, t, r, n, i) {
  if (n.overwrite)
    De.unlink(r, (o) => o ? i(o) : Cl(e, t, r, n, i));
  else return n.errorOnExist ? i(new Error(`'${r}' already exists`)) : i();
}
function Cl(e, t, r, n, i) {
  De.copyFile(t, r, (o) => o ? i(o) : n.preserveTimestamps ? fd(e.mode, t, r, i) : Xn(r, e.mode, i));
}
function fd(e, t, r, n) {
  return dd(e) ? hd(r, e, (i) => i ? n(i) : ya(e, t, r, n)) : ya(e, t, r, n);
}
function dd(e) {
  return (e & 128) === 0;
}
function hd(e, t, r) {
  return Xn(e, t | 128, r);
}
function ya(e, t, r, n) {
  pd(t, r, (i) => i ? n(i) : Xn(r, e, n));
}
function Xn(e, t, r) {
  return De.chmod(e, t, r);
}
function pd(e, t, r) {
  De.stat(e, (n, i) => n ? r(n) : ad(t, i.atime, i.mtime, r));
}
function md(e, t, r, n, i, o) {
  return t ? bl(r, n, i, o) : gd(e.mode, r, n, i, o);
}
function gd(e, t, r, n, i) {
  De.mkdir(r, (o) => {
    if (o) return i(o);
    bl(t, r, n, (a) => a ? i(a) : Xn(r, e, i));
  });
}
function bl(e, t, r, n) {
  De.readdir(e, (i, o) => i ? n(i) : $l(o, e, t, r, n));
}
function $l(e, t, r, n, i) {
  const o = e.pop();
  return o ? Ed(e, o, t, r, n, i) : i();
}
function Ed(e, t, r, n, i, o) {
  const a = br.join(r, t), s = br.join(n, t);
  $r.checkPaths(a, s, "copy", i, (l, m) => {
    if (l) return o(l);
    const { destStat: c } = m;
    ld(c, a, s, i, (f) => f ? o(f) : $l(e, r, n, i, o));
  });
}
function yd(e, t, r, n, i) {
  De.readlink(t, (o, a) => {
    if (o) return i(o);
    if (n.dereference && (a = br.resolve(process.cwd(), a)), e)
      De.readlink(r, (s, l) => s ? s.code === "EINVAL" || s.code === "UNKNOWN" ? De.symlink(a, r, i) : i(s) : (n.dereference && (l = br.resolve(process.cwd(), l)), $r.isSrcSubdir(a, l) ? i(new Error(`Cannot copy '${a}' to a subdirectory of itself, '${l}'.`)) : e.isDirectory() && $r.isSrcSubdir(l, a) ? i(new Error(`Cannot overwrite '${l}' with '${a}'.`)) : vd(a, r, i)));
    else
      return De.symlink(a, r, i);
  });
}
function vd(e, t, r) {
  De.unlink(t, (n) => n ? r(n) : De.symlink(e, t, r));
}
var wd = sd;
const _e = Oe, Or = re, _d = Xe.mkdirsSync, Ad = _l.utimesMillisSync, Ir = ir;
function Sd(e, t, r) {
  typeof r == "function" && (r = { filter: r }), r = r || {}, r.clobber = "clobber" in r ? !!r.clobber : !0, r.overwrite = "overwrite" in r ? !!r.overwrite : r.clobber, r.preserveTimestamps && process.arch === "ia32" && process.emitWarning(
    `Using the preserveTimestamps option in 32-bit node is not recommended;

	see https://github.com/jprichardson/node-fs-extra/issues/269`,
    "Warning",
    "fs-extra-WARN0002"
  );
  const { srcStat: n, destStat: i } = Ir.checkPathsSync(e, t, "copy", r);
  return Ir.checkParentPathsSync(e, n, t, "copy"), Td(i, e, t, r);
}
function Td(e, t, r, n) {
  if (n.filter && !n.filter(t, r)) return;
  const i = Or.dirname(r);
  return _e.existsSync(i) || _d(i), Ol(e, t, r, n);
}
function Cd(e, t, r, n) {
  if (!(n.filter && !n.filter(t, r)))
    return Ol(e, t, r, n);
}
function Ol(e, t, r, n) {
  const o = (n.dereference ? _e.statSync : _e.lstatSync)(t);
  if (o.isDirectory()) return Dd(o, e, t, r, n);
  if (o.isFile() || o.isCharacterDevice() || o.isBlockDevice()) return bd(o, e, t, r, n);
  if (o.isSymbolicLink()) return xd(e, t, r, n);
  throw o.isSocket() ? new Error(`Cannot copy a socket file: ${t}`) : o.isFIFO() ? new Error(`Cannot copy a FIFO pipe: ${t}`) : new Error(`Unknown file: ${t}`);
}
function bd(e, t, r, n, i) {
  return t ? $d(e, r, n, i) : Il(e, r, n, i);
}
function $d(e, t, r, n) {
  if (n.overwrite)
    return _e.unlinkSync(r), Il(e, t, r, n);
  if (n.errorOnExist)
    throw new Error(`'${r}' already exists`);
}
function Il(e, t, r, n) {
  return _e.copyFileSync(t, r), n.preserveTimestamps && Od(e.mode, t, r), So(r, e.mode);
}
function Od(e, t, r) {
  return Id(e) && Rd(r, e), Pd(t, r);
}
function Id(e) {
  return (e & 128) === 0;
}
function Rd(e, t) {
  return So(e, t | 128);
}
function So(e, t) {
  return _e.chmodSync(e, t);
}
function Pd(e, t) {
  const r = _e.statSync(e);
  return Ad(t, r.atime, r.mtime);
}
function Dd(e, t, r, n, i) {
  return t ? Rl(r, n, i) : Nd(e.mode, r, n, i);
}
function Nd(e, t, r, n) {
  return _e.mkdirSync(r), Rl(t, r, n), So(r, e);
}
function Rl(e, t, r) {
  _e.readdirSync(e).forEach((n) => Fd(n, e, t, r));
}
function Fd(e, t, r, n) {
  const i = Or.join(t, e), o = Or.join(r, e), { destStat: a } = Ir.checkPathsSync(i, o, "copy", n);
  return Cd(a, i, o, n);
}
function xd(e, t, r, n) {
  let i = _e.readlinkSync(t);
  if (n.dereference && (i = Or.resolve(process.cwd(), i)), e) {
    let o;
    try {
      o = _e.readlinkSync(r);
    } catch (a) {
      if (a.code === "EINVAL" || a.code === "UNKNOWN") return _e.symlinkSync(i, r);
      throw a;
    }
    if (n.dereference && (o = Or.resolve(process.cwd(), o)), Ir.isSrcSubdir(i, o))
      throw new Error(`Cannot copy '${i}' to a subdirectory of itself, '${o}'.`);
    if (_e.statSync(r).isDirectory() && Ir.isSrcSubdir(o, i))
      throw new Error(`Cannot overwrite '${o}' with '${i}'.`);
    return Ld(i, r);
  } else
    return _e.symlinkSync(i, r);
}
function Ld(e, t) {
  return _e.unlinkSync(t), _e.symlinkSync(e, t);
}
var Ud = Sd;
const kd = $e.fromCallback;
var To = {
  copy: kd(wd),
  copySync: Ud
};
const va = Oe, Pl = re, K = fl, Rr = process.platform === "win32";
function Dl(e) {
  [
    "unlink",
    "chmod",
    "stat",
    "lstat",
    "rmdir",
    "readdir"
  ].forEach((r) => {
    e[r] = e[r] || va[r], r = r + "Sync", e[r] = e[r] || va[r];
  }), e.maxBusyTries = e.maxBusyTries || 3;
}
function Co(e, t, r) {
  let n = 0;
  typeof t == "function" && (r = t, t = {}), K(e, "rimraf: missing path"), K.strictEqual(typeof e, "string", "rimraf: path should be a string"), K.strictEqual(typeof r, "function", "rimraf: callback function required"), K(t, "rimraf: invalid options argument provided"), K.strictEqual(typeof t, "object", "rimraf: options should be object"), Dl(t), wa(e, t, function i(o) {
    if (o) {
      if ((o.code === "EBUSY" || o.code === "ENOTEMPTY" || o.code === "EPERM") && n < t.maxBusyTries) {
        n++;
        const a = n * 100;
        return setTimeout(() => wa(e, t, i), a);
      }
      o.code === "ENOENT" && (o = null);
    }
    r(o);
  });
}
function wa(e, t, r) {
  K(e), K(t), K(typeof r == "function"), t.lstat(e, (n, i) => {
    if (n && n.code === "ENOENT")
      return r(null);
    if (n && n.code === "EPERM" && Rr)
      return _a(e, t, n, r);
    if (i && i.isDirectory())
      return On(e, t, n, r);
    t.unlink(e, (o) => {
      if (o) {
        if (o.code === "ENOENT")
          return r(null);
        if (o.code === "EPERM")
          return Rr ? _a(e, t, o, r) : On(e, t, o, r);
        if (o.code === "EISDIR")
          return On(e, t, o, r);
      }
      return r(o);
    });
  });
}
function _a(e, t, r, n) {
  K(e), K(t), K(typeof n == "function"), t.chmod(e, 438, (i) => {
    i ? n(i.code === "ENOENT" ? null : r) : t.stat(e, (o, a) => {
      o ? n(o.code === "ENOENT" ? null : r) : a.isDirectory() ? On(e, t, r, n) : t.unlink(e, n);
    });
  });
}
function Aa(e, t, r) {
  let n;
  K(e), K(t);
  try {
    t.chmodSync(e, 438);
  } catch (i) {
    if (i.code === "ENOENT")
      return;
    throw r;
  }
  try {
    n = t.statSync(e);
  } catch (i) {
    if (i.code === "ENOENT")
      return;
    throw r;
  }
  n.isDirectory() ? In(e, t, r) : t.unlinkSync(e);
}
function On(e, t, r, n) {
  K(e), K(t), K(typeof n == "function"), t.rmdir(e, (i) => {
    i && (i.code === "ENOTEMPTY" || i.code === "EEXIST" || i.code === "EPERM") ? Md(e, t, n) : i && i.code === "ENOTDIR" ? n(r) : n(i);
  });
}
function Md(e, t, r) {
  K(e), K(t), K(typeof r == "function"), t.readdir(e, (n, i) => {
    if (n) return r(n);
    let o = i.length, a;
    if (o === 0) return t.rmdir(e, r);
    i.forEach((s) => {
      Co(Pl.join(e, s), t, (l) => {
        if (!a) {
          if (l) return r(a = l);
          --o === 0 && t.rmdir(e, r);
        }
      });
    });
  });
}
function Nl(e, t) {
  let r;
  t = t || {}, Dl(t), K(e, "rimraf: missing path"), K.strictEqual(typeof e, "string", "rimraf: path should be a string"), K(t, "rimraf: missing options"), K.strictEqual(typeof t, "object", "rimraf: options should be object");
  try {
    r = t.lstatSync(e);
  } catch (n) {
    if (n.code === "ENOENT")
      return;
    n.code === "EPERM" && Rr && Aa(e, t, n);
  }
  try {
    r && r.isDirectory() ? In(e, t, null) : t.unlinkSync(e);
  } catch (n) {
    if (n.code === "ENOENT")
      return;
    if (n.code === "EPERM")
      return Rr ? Aa(e, t, n) : In(e, t, n);
    if (n.code !== "EISDIR")
      throw n;
    In(e, t, n);
  }
}
function In(e, t, r) {
  K(e), K(t);
  try {
    t.rmdirSync(e);
  } catch (n) {
    if (n.code === "ENOTDIR")
      throw r;
    if (n.code === "ENOTEMPTY" || n.code === "EEXIST" || n.code === "EPERM")
      Bd(e, t);
    else if (n.code !== "ENOENT")
      throw n;
  }
}
function Bd(e, t) {
  if (K(e), K(t), t.readdirSync(e).forEach((r) => Nl(Pl.join(e, r), t)), Rr) {
    const r = Date.now();
    do
      try {
        return t.rmdirSync(e, t);
      } catch {
      }
    while (Date.now() - r < 500);
  } else
    return t.rmdirSync(e, t);
}
var jd = Co;
Co.sync = Nl;
const xn = Oe, Hd = $e.fromCallback, Fl = jd;
function qd(e, t) {
  if (xn.rm) return xn.rm(e, { recursive: !0, force: !0 }, t);
  Fl(e, t);
}
function Gd(e) {
  if (xn.rmSync) return xn.rmSync(e, { recursive: !0, force: !0 });
  Fl.sync(e);
}
var Kn = {
  remove: Hd(qd),
  removeSync: Gd
};
const Wd = $e.fromPromise, xl = xt, Ll = re, Ul = Xe, kl = Kn, Sa = Wd(async function(t) {
  let r;
  try {
    r = await xl.readdir(t);
  } catch {
    return Ul.mkdirs(t);
  }
  return Promise.all(r.map((n) => kl.remove(Ll.join(t, n))));
});
function Ta(e) {
  let t;
  try {
    t = xl.readdirSync(e);
  } catch {
    return Ul.mkdirsSync(e);
  }
  t.forEach((r) => {
    r = Ll.join(e, r), kl.removeSync(r);
  });
}
var Vd = {
  emptyDirSync: Ta,
  emptydirSync: Ta,
  emptyDir: Sa,
  emptydir: Sa
};
const Yd = $e.fromCallback, Ml = re, ct = Oe, Bl = Xe;
function zd(e, t) {
  function r() {
    ct.writeFile(e, "", (n) => {
      if (n) return t(n);
      t();
    });
  }
  ct.stat(e, (n, i) => {
    if (!n && i.isFile()) return t();
    const o = Ml.dirname(e);
    ct.stat(o, (a, s) => {
      if (a)
        return a.code === "ENOENT" ? Bl.mkdirs(o, (l) => {
          if (l) return t(l);
          r();
        }) : t(a);
      s.isDirectory() ? r() : ct.readdir(o, (l) => {
        if (l) return t(l);
      });
    });
  });
}
function Xd(e) {
  let t;
  try {
    t = ct.statSync(e);
  } catch {
  }
  if (t && t.isFile()) return;
  const r = Ml.dirname(e);
  try {
    ct.statSync(r).isDirectory() || ct.readdirSync(r);
  } catch (n) {
    if (n && n.code === "ENOENT") Bl.mkdirsSync(r);
    else throw n;
  }
  ct.writeFileSync(e, "");
}
var Kd = {
  createFile: Yd(zd),
  createFileSync: Xd
};
const Jd = $e.fromCallback, jl = re, lt = Oe, Hl = Xe, Qd = Lt.pathExists, { areIdentical: ql } = ir;
function Zd(e, t, r) {
  function n(i, o) {
    lt.link(i, o, (a) => {
      if (a) return r(a);
      r(null);
    });
  }
  lt.lstat(t, (i, o) => {
    lt.lstat(e, (a, s) => {
      if (a)
        return a.message = a.message.replace("lstat", "ensureLink"), r(a);
      if (o && ql(s, o)) return r(null);
      const l = jl.dirname(t);
      Qd(l, (m, c) => {
        if (m) return r(m);
        if (c) return n(e, t);
        Hl.mkdirs(l, (f) => {
          if (f) return r(f);
          n(e, t);
        });
      });
    });
  });
}
function eh(e, t) {
  let r;
  try {
    r = lt.lstatSync(t);
  } catch {
  }
  try {
    const o = lt.lstatSync(e);
    if (r && ql(o, r)) return;
  } catch (o) {
    throw o.message = o.message.replace("lstat", "ensureLink"), o;
  }
  const n = jl.dirname(t);
  return lt.existsSync(n) || Hl.mkdirsSync(n), lt.linkSync(e, t);
}
var th = {
  createLink: Jd(Zd),
  createLinkSync: eh
};
const ut = re, wr = Oe, rh = Lt.pathExists;
function nh(e, t, r) {
  if (ut.isAbsolute(e))
    return wr.lstat(e, (n) => n ? (n.message = n.message.replace("lstat", "ensureSymlink"), r(n)) : r(null, {
      toCwd: e,
      toDst: e
    }));
  {
    const n = ut.dirname(t), i = ut.join(n, e);
    return rh(i, (o, a) => o ? r(o) : a ? r(null, {
      toCwd: i,
      toDst: e
    }) : wr.lstat(e, (s) => s ? (s.message = s.message.replace("lstat", "ensureSymlink"), r(s)) : r(null, {
      toCwd: e,
      toDst: ut.relative(n, e)
    })));
  }
}
function ih(e, t) {
  let r;
  if (ut.isAbsolute(e)) {
    if (r = wr.existsSync(e), !r) throw new Error("absolute srcpath does not exist");
    return {
      toCwd: e,
      toDst: e
    };
  } else {
    const n = ut.dirname(t), i = ut.join(n, e);
    if (r = wr.existsSync(i), r)
      return {
        toCwd: i,
        toDst: e
      };
    if (r = wr.existsSync(e), !r) throw new Error("relative srcpath does not exist");
    return {
      toCwd: e,
      toDst: ut.relative(n, e)
    };
  }
}
var oh = {
  symlinkPaths: nh,
  symlinkPathsSync: ih
};
const Gl = Oe;
function ah(e, t, r) {
  if (r = typeof t == "function" ? t : r, t = typeof t == "function" ? !1 : t, t) return r(null, t);
  Gl.lstat(e, (n, i) => {
    if (n) return r(null, "file");
    t = i && i.isDirectory() ? "dir" : "file", r(null, t);
  });
}
function sh(e, t) {
  let r;
  if (t) return t;
  try {
    r = Gl.lstatSync(e);
  } catch {
    return "file";
  }
  return r && r.isDirectory() ? "dir" : "file";
}
var lh = {
  symlinkType: ah,
  symlinkTypeSync: sh
};
const ch = $e.fromCallback, Wl = re, je = xt, Vl = Xe, uh = Vl.mkdirs, fh = Vl.mkdirsSync, Yl = oh, dh = Yl.symlinkPaths, hh = Yl.symlinkPathsSync, zl = lh, ph = zl.symlinkType, mh = zl.symlinkTypeSync, gh = Lt.pathExists, { areIdentical: Xl } = ir;
function Eh(e, t, r, n) {
  n = typeof r == "function" ? r : n, r = typeof r == "function" ? !1 : r, je.lstat(t, (i, o) => {
    !i && o.isSymbolicLink() ? Promise.all([
      je.stat(e),
      je.stat(t)
    ]).then(([a, s]) => {
      if (Xl(a, s)) return n(null);
      Ca(e, t, r, n);
    }) : Ca(e, t, r, n);
  });
}
function Ca(e, t, r, n) {
  dh(e, t, (i, o) => {
    if (i) return n(i);
    e = o.toDst, ph(o.toCwd, r, (a, s) => {
      if (a) return n(a);
      const l = Wl.dirname(t);
      gh(l, (m, c) => {
        if (m) return n(m);
        if (c) return je.symlink(e, t, s, n);
        uh(l, (f) => {
          if (f) return n(f);
          je.symlink(e, t, s, n);
        });
      });
    });
  });
}
function yh(e, t, r) {
  let n;
  try {
    n = je.lstatSync(t);
  } catch {
  }
  if (n && n.isSymbolicLink()) {
    const s = je.statSync(e), l = je.statSync(t);
    if (Xl(s, l)) return;
  }
  const i = hh(e, t);
  e = i.toDst, r = mh(i.toCwd, r);
  const o = Wl.dirname(t);
  return je.existsSync(o) || fh(o), je.symlinkSync(e, t, r);
}
var vh = {
  createSymlink: ch(Eh),
  createSymlinkSync: yh
};
const { createFile: ba, createFileSync: $a } = Kd, { createLink: Oa, createLinkSync: Ia } = th, { createSymlink: Ra, createSymlinkSync: Pa } = vh;
var wh = {
  // file
  createFile: ba,
  createFileSync: $a,
  ensureFile: ba,
  ensureFileSync: $a,
  // link
  createLink: Oa,
  createLinkSync: Ia,
  ensureLink: Oa,
  ensureLinkSync: Ia,
  // symlink
  createSymlink: Ra,
  createSymlinkSync: Pa,
  ensureSymlink: Ra,
  ensureSymlinkSync: Pa
};
function _h(e, { EOL: t = `
`, finalEOL: r = !0, replacer: n = null, spaces: i } = {}) {
  const o = r ? t : "";
  return JSON.stringify(e, n, i).replace(/\n/g, t) + o;
}
function Ah(e) {
  return Buffer.isBuffer(e) && (e = e.toString("utf8")), e.replace(/^\uFEFF/, "");
}
var bo = { stringify: _h, stripBom: Ah };
let er;
try {
  er = Oe;
} catch {
  er = Et;
}
const Jn = $e, { stringify: Kl, stripBom: Jl } = bo;
async function Sh(e, t = {}) {
  typeof t == "string" && (t = { encoding: t });
  const r = t.fs || er, n = "throws" in t ? t.throws : !0;
  let i = await Jn.fromCallback(r.readFile)(e, t);
  i = Jl(i);
  let o;
  try {
    o = JSON.parse(i, t ? t.reviver : null);
  } catch (a) {
    if (n)
      throw a.message = `${e}: ${a.message}`, a;
    return null;
  }
  return o;
}
const Th = Jn.fromPromise(Sh);
function Ch(e, t = {}) {
  typeof t == "string" && (t = { encoding: t });
  const r = t.fs || er, n = "throws" in t ? t.throws : !0;
  try {
    let i = r.readFileSync(e, t);
    return i = Jl(i), JSON.parse(i, t.reviver);
  } catch (i) {
    if (n)
      throw i.message = `${e}: ${i.message}`, i;
    return null;
  }
}
async function bh(e, t, r = {}) {
  const n = r.fs || er, i = Kl(t, r);
  await Jn.fromCallback(n.writeFile)(e, i, r);
}
const $h = Jn.fromPromise(bh);
function Oh(e, t, r = {}) {
  const n = r.fs || er, i = Kl(t, r);
  return n.writeFileSync(e, i, r);
}
var Ih = {
  readFile: Th,
  readFileSync: Ch,
  writeFile: $h,
  writeFileSync: Oh
};
const dn = Ih;
var Rh = {
  // jsonfile exports
  readJson: dn.readFile,
  readJsonSync: dn.readFileSync,
  writeJson: dn.writeFile,
  writeJsonSync: dn.writeFileSync
};
const Ph = $e.fromCallback, _r = Oe, Ql = re, Zl = Xe, Dh = Lt.pathExists;
function Nh(e, t, r, n) {
  typeof r == "function" && (n = r, r = "utf8");
  const i = Ql.dirname(e);
  Dh(i, (o, a) => {
    if (o) return n(o);
    if (a) return _r.writeFile(e, t, r, n);
    Zl.mkdirs(i, (s) => {
      if (s) return n(s);
      _r.writeFile(e, t, r, n);
    });
  });
}
function Fh(e, ...t) {
  const r = Ql.dirname(e);
  if (_r.existsSync(r))
    return _r.writeFileSync(e, ...t);
  Zl.mkdirsSync(r), _r.writeFileSync(e, ...t);
}
var $o = {
  outputFile: Ph(Nh),
  outputFileSync: Fh
};
const { stringify: xh } = bo, { outputFile: Lh } = $o;
async function Uh(e, t, r = {}) {
  const n = xh(t, r);
  await Lh(e, n, r);
}
var kh = Uh;
const { stringify: Mh } = bo, { outputFileSync: Bh } = $o;
function jh(e, t, r) {
  const n = Mh(t, r);
  Bh(e, n, r);
}
var Hh = jh;
const qh = $e.fromPromise, be = Rh;
be.outputJson = qh(kh);
be.outputJsonSync = Hh;
be.outputJSON = be.outputJson;
be.outputJSONSync = be.outputJsonSync;
be.writeJSON = be.writeJson;
be.writeJSONSync = be.writeJsonSync;
be.readJSON = be.readJson;
be.readJSONSync = be.readJsonSync;
var Gh = be;
const Wh = Oe, to = re, Vh = To.copy, ec = Kn.remove, Yh = Xe.mkdirp, zh = Lt.pathExists, Da = ir;
function Xh(e, t, r, n) {
  typeof r == "function" && (n = r, r = {}), r = r || {};
  const i = r.overwrite || r.clobber || !1;
  Da.checkPaths(e, t, "move", r, (o, a) => {
    if (o) return n(o);
    const { srcStat: s, isChangingCase: l = !1 } = a;
    Da.checkParentPaths(e, s, t, "move", (m) => {
      if (m) return n(m);
      if (Kh(t)) return Na(e, t, i, l, n);
      Yh(to.dirname(t), (c) => c ? n(c) : Na(e, t, i, l, n));
    });
  });
}
function Kh(e) {
  const t = to.dirname(e);
  return to.parse(t).root === t;
}
function Na(e, t, r, n, i) {
  if (n) return bi(e, t, r, i);
  if (r)
    return ec(t, (o) => o ? i(o) : bi(e, t, r, i));
  zh(t, (o, a) => o ? i(o) : a ? i(new Error("dest already exists.")) : bi(e, t, r, i));
}
function bi(e, t, r, n) {
  Wh.rename(e, t, (i) => i ? i.code !== "EXDEV" ? n(i) : Jh(e, t, r, n) : n());
}
function Jh(e, t, r, n) {
  Vh(e, t, {
    overwrite: r,
    errorOnExist: !0
  }, (o) => o ? n(o) : ec(e, n));
}
var Qh = Xh;
const tc = Oe, ro = re, Zh = To.copySync, rc = Kn.removeSync, ep = Xe.mkdirpSync, Fa = ir;
function tp(e, t, r) {
  r = r || {};
  const n = r.overwrite || r.clobber || !1, { srcStat: i, isChangingCase: o = !1 } = Fa.checkPathsSync(e, t, "move", r);
  return Fa.checkParentPathsSync(e, i, t, "move"), rp(t) || ep(ro.dirname(t)), np(e, t, n, o);
}
function rp(e) {
  const t = ro.dirname(e);
  return ro.parse(t).root === t;
}
function np(e, t, r, n) {
  if (n) return $i(e, t, r);
  if (r)
    return rc(t), $i(e, t, r);
  if (tc.existsSync(t)) throw new Error("dest already exists.");
  return $i(e, t, r);
}
function $i(e, t, r) {
  try {
    tc.renameSync(e, t);
  } catch (n) {
    if (n.code !== "EXDEV") throw n;
    return ip(e, t, r);
  }
}
function ip(e, t, r) {
  return Zh(e, t, {
    overwrite: r,
    errorOnExist: !0
  }), rc(e);
}
var op = tp;
const ap = $e.fromCallback;
var sp = {
  move: ap(Qh),
  moveSync: op
}, yt = {
  // Export promiseified graceful-fs:
  ...xt,
  // Export extra methods:
  ...To,
  ...Vd,
  ...wh,
  ...Gh,
  ...Xe,
  ...sp,
  ...$o,
  ...Lt,
  ...Kn
}, tt = {}, dt = {}, pe = {}, ht = {};
Object.defineProperty(ht, "__esModule", { value: !0 });
ht.CancellationError = ht.CancellationToken = void 0;
const lp = dl;
class cp extends lp.EventEmitter {
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
      return Promise.reject(new no());
    const r = () => {
      if (n != null)
        try {
          this.removeListener("cancel", n), n = null;
        } catch {
        }
    };
    let n = null;
    return new Promise((i, o) => {
      let a = null;
      if (n = () => {
        try {
          a != null && (a(), a = null);
        } finally {
          o(new no());
        }
      }, this.cancelled) {
        n();
        return;
      }
      this.onCancel(n), t(i, o, (s) => {
        a = s;
      });
    }).then((i) => (r(), i)).catch((i) => {
      throw r(), i;
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
ht.CancellationToken = cp;
class no extends Error {
  constructor() {
    super("cancelled");
  }
}
ht.CancellationError = no;
var or = {};
Object.defineProperty(or, "__esModule", { value: !0 });
or.newError = up;
function up(e, t) {
  const r = new Error(e);
  return r.code = t, r;
}
var Ce = {}, io = { exports: {} }, hn = { exports: {} }, Oi, xa;
function fp() {
  if (xa) return Oi;
  xa = 1;
  var e = 1e3, t = e * 60, r = t * 60, n = r * 24, i = n * 7, o = n * 365.25;
  Oi = function(c, f) {
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
            return h * n;
          case "hours":
          case "hour":
          case "hrs":
          case "hr":
          case "h":
            return h * r;
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
    return f >= n ? Math.round(c / n) + "d" : f >= r ? Math.round(c / r) + "h" : f >= t ? Math.round(c / t) + "m" : f >= e ? Math.round(c / e) + "s" : c + "ms";
  }
  function l(c) {
    var f = Math.abs(c);
    return f >= n ? m(c, f, n, "day") : f >= r ? m(c, f, r, "hour") : f >= t ? m(c, f, t, "minute") : f >= e ? m(c, f, e, "second") : c + " ms";
  }
  function m(c, f, h, g) {
    var _ = f >= h * 1.5;
    return Math.round(c / h) + " " + g + (_ ? "s" : "");
  }
  return Oi;
}
var Ii, La;
function nc() {
  if (La) return Ii;
  La = 1;
  function e(t) {
    n.debug = n, n.default = n, n.coerce = m, n.disable = s, n.enable = o, n.enabled = l, n.humanize = fp(), n.destroy = c, Object.keys(t).forEach((f) => {
      n[f] = t[f];
    }), n.names = [], n.skips = [], n.formatters = {};
    function r(f) {
      let h = 0;
      for (let g = 0; g < f.length; g++)
        h = (h << 5) - h + f.charCodeAt(g), h |= 0;
      return n.colors[Math.abs(h) % n.colors.length];
    }
    n.selectColor = r;
    function n(f) {
      let h, g = null, _, y;
      function A(...T) {
        if (!A.enabled)
          return;
        const S = A, N = Number(/* @__PURE__ */ new Date()), x = N - (h || N);
        S.diff = x, S.prev = h, S.curr = N, h = N, T[0] = n.coerce(T[0]), typeof T[0] != "string" && T.unshift("%O");
        let Q = 0;
        T[0] = T[0].replace(/%([a-zA-Z%])/g, (V, Fe) => {
          if (V === "%%")
            return "%";
          Q++;
          const E = n.formatters[Fe];
          if (typeof E == "function") {
            const q = T[Q];
            V = E.call(S, q), T.splice(Q, 1), Q--;
          }
          return V;
        }), n.formatArgs.call(S, T), (S.log || n.log).apply(S, T);
      }
      return A.namespace = f, A.useColors = n.useColors(), A.color = n.selectColor(f), A.extend = i, A.destroy = n.destroy, Object.defineProperty(A, "enabled", {
        enumerable: !0,
        configurable: !1,
        get: () => g !== null ? g : (_ !== n.namespaces && (_ = n.namespaces, y = n.enabled(f)), y),
        set: (T) => {
          g = T;
        }
      }), typeof n.init == "function" && n.init(A), A;
    }
    function i(f, h) {
      const g = n(this.namespace + (typeof h > "u" ? ":" : h) + f);
      return g.log = this.log, g;
    }
    function o(f) {
      n.save(f), n.namespaces = f, n.names = [], n.skips = [];
      const h = (typeof f == "string" ? f : "").trim().replace(/\s+/g, ",").split(",").filter(Boolean);
      for (const g of h)
        g[0] === "-" ? n.skips.push(g.slice(1)) : n.names.push(g);
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
        ...n.names,
        ...n.skips.map((h) => "-" + h)
      ].join(",");
      return n.enable(""), f;
    }
    function l(f) {
      for (const h of n.skips)
        if (a(f, h))
          return !1;
      for (const h of n.names)
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
    return n.enable(n.load()), n;
  }
  return Ii = e, Ii;
}
var Ua;
function dp() {
  return Ua || (Ua = 1, function(e, t) {
    t.formatArgs = n, t.save = i, t.load = o, t.useColors = r, t.storage = a(), t.destroy = /* @__PURE__ */ (() => {
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
    function r() {
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
    function n(l) {
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
    e.exports = nc()(t);
    const { formatters: s } = e.exports;
    s.j = function(l) {
      try {
        return JSON.stringify(l);
      } catch (m) {
        return "[UnexpectedJSONParseError]: " + m.message;
      }
    };
  }(hn, hn.exports)), hn.exports;
}
var pn = { exports: {} }, Ri, ka;
function hp() {
  return ka || (ka = 1, Ri = (e, t = process.argv) => {
    const r = e.startsWith("-") ? "" : e.length === 1 ? "-" : "--", n = t.indexOf(r + e), i = t.indexOf("--");
    return n !== -1 && (i === -1 || n < i);
  }), Ri;
}
var Pi, Ma;
function pp() {
  if (Ma) return Pi;
  Ma = 1;
  const e = Yn, t = hl, r = hp(), { env: n } = process;
  let i;
  r("no-color") || r("no-colors") || r("color=false") || r("color=never") ? i = 0 : (r("color") || r("colors") || r("color=true") || r("color=always")) && (i = 1), "FORCE_COLOR" in n && (n.FORCE_COLOR === "true" ? i = 1 : n.FORCE_COLOR === "false" ? i = 0 : i = n.FORCE_COLOR.length === 0 ? 1 : Math.min(parseInt(n.FORCE_COLOR, 10), 3));
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
    if (r("color=16m") || r("color=full") || r("color=truecolor"))
      return 3;
    if (r("color=256"))
      return 2;
    if (l && !m && i === void 0)
      return 0;
    const c = i || 0;
    if (n.TERM === "dumb")
      return c;
    if (process.platform === "win32") {
      const f = e.release().split(".");
      return Number(f[0]) >= 10 && Number(f[2]) >= 10586 ? Number(f[2]) >= 14931 ? 3 : 2 : 1;
    }
    if ("CI" in n)
      return ["TRAVIS", "CIRCLECI", "APPVEYOR", "GITLAB_CI", "GITHUB_ACTIONS", "BUILDKITE"].some((f) => f in n) || n.CI_NAME === "codeship" ? 1 : c;
    if ("TEAMCITY_VERSION" in n)
      return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(n.TEAMCITY_VERSION) ? 1 : 0;
    if (n.COLORTERM === "truecolor")
      return 3;
    if ("TERM_PROGRAM" in n) {
      const f = parseInt((n.TERM_PROGRAM_VERSION || "").split(".")[0], 10);
      switch (n.TERM_PROGRAM) {
        case "iTerm.app":
          return f >= 3 ? 3 : 2;
        case "Apple_Terminal":
          return 2;
      }
    }
    return /-256(color)?$/i.test(n.TERM) ? 2 : /^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(n.TERM) || "COLORTERM" in n ? 1 : c;
  }
  function s(l) {
    const m = a(l, l && l.isTTY);
    return o(m);
  }
  return Pi = {
    supportsColor: s,
    stdout: o(a(!0, t.isatty(1))),
    stderr: o(a(!0, t.isatty(2)))
  }, Pi;
}
var Ba;
function mp() {
  return Ba || (Ba = 1, function(e, t) {
    const r = hl, n = yo;
    t.init = c, t.log = s, t.formatArgs = o, t.save = l, t.load = m, t.useColors = i, t.destroy = n.deprecate(
      () => {
      },
      "Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`."
    ), t.colors = [6, 2, 3, 4, 5, 1];
    try {
      const h = pp();
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
      return "colors" in t.inspectOpts ? !!t.inspectOpts.colors : r.isatty(process.stderr.fd);
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
      return process.stderr.write(n.formatWithOptions(t.inspectOpts, ...h) + `
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
    e.exports = nc()(t);
    const { formatters: f } = e.exports;
    f.o = function(h) {
      return this.inspectOpts.colors = this.useColors, n.inspect(h, this.inspectOpts).split(`
`).map((g) => g.trim()).join(" ");
    }, f.O = function(h) {
      return this.inspectOpts.colors = this.useColors, n.inspect(h, this.inspectOpts);
    };
  }(pn, pn.exports)), pn.exports;
}
typeof process > "u" || process.type === "renderer" || process.browser === !0 || process.__nwjs ? io.exports = dp() : io.exports = mp();
var gp = io.exports, Gr = {};
Object.defineProperty(Gr, "__esModule", { value: !0 });
Gr.ProgressCallbackTransform = void 0;
const Ep = jr;
class yp extends Ep.Transform {
  constructor(t, r, n) {
    super(), this.total = t, this.cancellationToken = r, this.onProgress = n, this.start = Date.now(), this.transferred = 0, this.delta = 0, this.nextUpdate = this.start + 1e3;
  }
  _transform(t, r, n) {
    if (this.cancellationToken.cancelled) {
      n(new Error("cancelled"), null);
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
    }), this.delta = 0), n(null, t);
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
Gr.ProgressCallbackTransform = yp;
Object.defineProperty(Ce, "__esModule", { value: !0 });
Ce.DigestTransform = Ce.HttpExecutor = Ce.HttpError = void 0;
Ce.createHttpError = oo;
Ce.parseJson = bp;
Ce.configureRequestOptionsFromUrl = oc;
Ce.configureRequestUrl = Io;
Ce.safeGetHeader = Qt;
Ce.configureRequestOptions = Un;
Ce.safeStringifyJson = kn;
const vp = Hr, wp = gp, _p = Et, Ap = jr, ic = nr, Sp = ht, ja = or, Tp = Gr, hr = (0, wp.default)("electron-builder");
function oo(e, t = null) {
  return new Oo(e.statusCode || -1, `${e.statusCode} ${e.statusMessage}` + (t == null ? "" : `
` + JSON.stringify(t, null, "  ")) + `
Headers: ` + kn(e.headers), t);
}
const Cp = /* @__PURE__ */ new Map([
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
class Oo extends Error {
  constructor(t, r = `HTTP error: ${Cp.get(t) || t}`, n = null) {
    super(r), this.statusCode = t, this.description = n, this.name = "HttpError", this.code = `HTTP_ERROR_${t}`;
  }
  isServerError() {
    return this.statusCode >= 500 && this.statusCode <= 599;
  }
}
Ce.HttpError = Oo;
function bp(e) {
  return e.then((t) => t == null || t.length === 0 ? null : JSON.parse(t));
}
class Ln {
  constructor() {
    this.maxRedirects = 10;
  }
  request(t, r = new Sp.CancellationToken(), n) {
    Un(t);
    const i = n == null ? void 0 : JSON.stringify(n), o = i ? Buffer.from(i) : void 0;
    if (o != null) {
      hr(i);
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
    return this.doApiRequest(t, r, (a) => a.end(o));
  }
  doApiRequest(t, r, n, i = 0) {
    return hr.enabled && hr(`Request: ${kn(t)}`), r.createPromise((o, a, s) => {
      const l = this.createRequest(t, (m) => {
        try {
          this.handleResponse(m, t, r, o, a, i, n);
        } catch (c) {
          a(c);
        }
      });
      this.addErrorAndTimeoutHandlers(l, a, t.timeout), this.addRedirectHandlers(l, t, a, i, (m) => {
        this.doApiRequest(m, r, n, i).then(o).catch(a);
      }), n(l, a), s(() => l.abort());
    });
  }
  // noinspection JSUnusedLocalSymbols
  // eslint-disable-next-line
  addRedirectHandlers(t, r, n, i, o) {
  }
  addErrorAndTimeoutHandlers(t, r, n = 60 * 1e3) {
    this.addTimeOutHandler(t, r, n), t.on("error", r), t.on("aborted", () => {
      r(new Error("Request has been aborted by the server"));
    });
  }
  handleResponse(t, r, n, i, o, a, s) {
    var l;
    if (hr.enabled && hr(`Response: ${t.statusCode} ${t.statusMessage}, request options: ${kn(r)}`), t.statusCode === 404) {
      o(oo(t, `method: ${r.method || "GET"} url: ${r.protocol || "https:"}//${r.hostname}${r.port ? `:${r.port}` : ""}${r.path}

Please double check that your authentication token is correct. Due to security reasons, actual status maybe not reported, but 404.
`));
      return;
    } else if (t.statusCode === 204) {
      i();
      return;
    }
    const m = (l = t.statusCode) !== null && l !== void 0 ? l : 0, c = m >= 300 && m < 400, f = Qt(t, "location");
    if (c && f != null) {
      if (a > this.maxRedirects) {
        o(this.createMaxRedirectError());
        return;
      }
      this.doApiRequest(Ln.prepareRedirectUrlOptions(f, r), n, s, a).then(i).catch(o);
      return;
    }
    t.setEncoding("utf8");
    let h = "";
    t.on("error", o), t.on("data", (g) => h += g), t.on("end", () => {
      try {
        if (t.statusCode != null && t.statusCode >= 400) {
          const g = Qt(t, "content-type"), _ = g != null && (Array.isArray(g) ? g.find((y) => y.includes("json")) != null : g.includes("json"));
          o(oo(t, `method: ${r.method || "GET"} url: ${r.protocol || "https:"}//${r.hostname}${r.port ? `:${r.port}` : ""}${r.path}

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
  async downloadToBuffer(t, r) {
    return await r.cancellationToken.createPromise((n, i, o) => {
      const a = [], s = {
        headers: r.headers || void 0,
        // because PrivateGitHubProvider requires HttpExecutor.prepareRedirectUrlOptions logic, so, we need to redirect manually
        redirect: "manual"
      };
      Io(t, s), Un(s), this.doDownload(s, {
        destination: null,
        options: r,
        onCancel: o,
        callback: (l) => {
          l == null ? n(Buffer.concat(a)) : i(l);
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
  doDownload(t, r, n) {
    const i = this.createRequest(t, (o) => {
      if (o.statusCode >= 400) {
        r.callback(new Error(`Cannot download "${t.protocol || "https:"}//${t.hostname}${t.path}", status ${o.statusCode}: ${o.statusMessage}`));
        return;
      }
      o.on("error", r.callback);
      const a = Qt(o, "location");
      if (a != null) {
        n < this.maxRedirects ? this.doDownload(Ln.prepareRedirectUrlOptions(a, t), r, n++) : r.callback(this.createMaxRedirectError());
        return;
      }
      r.responseHandler == null ? Op(r, o) : r.responseHandler(o, r.callback);
    });
    this.addErrorAndTimeoutHandlers(i, r.callback, t.timeout), this.addRedirectHandlers(i, t, r.callback, n, (o) => {
      this.doDownload(o, r, n++);
    }), i.end();
  }
  createMaxRedirectError() {
    return new Error(`Too many redirects (> ${this.maxRedirects})`);
  }
  addTimeOutHandler(t, r, n) {
    t.on("socket", (i) => {
      i.setTimeout(n, () => {
        t.abort(), r(new Error("Request timed out"));
      });
    });
  }
  static prepareRedirectUrlOptions(t, r) {
    const n = oc(t, { ...r }), i = n.headers;
    if (i != null && i.authorization) {
      const o = new ic.URL(t);
      (o.hostname.endsWith(".amazonaws.com") || o.searchParams.has("X-Amz-Credential")) && delete i.authorization;
    }
    return n;
  }
  static retryOnServerError(t, r = 3) {
    for (let n = 0; ; n++)
      try {
        return t();
      } catch (i) {
        if (n < r && (i instanceof Oo && i.isServerError() || i.code === "EPIPE"))
          continue;
        throw i;
      }
  }
}
Ce.HttpExecutor = Ln;
function oc(e, t) {
  const r = Un(t);
  return Io(new ic.URL(e), r), r;
}
function Io(e, t) {
  t.protocol = e.protocol, t.hostname = e.hostname, e.port ? t.port = e.port : t.port && delete t.port, t.path = e.pathname + e.search;
}
class ao extends Ap.Transform {
  // noinspection JSUnusedGlobalSymbols
  get actual() {
    return this._actual;
  }
  constructor(t, r = "sha512", n = "base64") {
    super(), this.expected = t, this.algorithm = r, this.encoding = n, this._actual = null, this.isValidateOnEnd = !0, this.digester = (0, vp.createHash)(r);
  }
  // noinspection JSUnusedGlobalSymbols
  _transform(t, r, n) {
    this.digester.update(t), n(null, t);
  }
  // noinspection JSUnusedGlobalSymbols
  _flush(t) {
    if (this._actual = this.digester.digest(this.encoding), this.isValidateOnEnd)
      try {
        this.validate();
      } catch (r) {
        t(r);
        return;
      }
    t(null);
  }
  validate() {
    if (this._actual == null)
      throw (0, ja.newError)("Not finished yet", "ERR_STREAM_NOT_FINISHED");
    if (this._actual !== this.expected)
      throw (0, ja.newError)(`${this.algorithm} checksum mismatch, expected ${this.expected}, got ${this._actual}`, "ERR_CHECKSUM_MISMATCH");
    return null;
  }
}
Ce.DigestTransform = ao;
function $p(e, t, r) {
  return e != null && t != null && e !== t ? (r(new Error(`checksum mismatch: expected ${t} but got ${e} (X-Checksum-Sha2 header)`)), !1) : !0;
}
function Qt(e, t) {
  const r = e.headers[t];
  return r == null ? null : Array.isArray(r) ? r.length === 0 ? null : r[r.length - 1] : r;
}
function Op(e, t) {
  if (!$p(Qt(t, "X-Checksum-Sha2"), e.options.sha2, e.callback))
    return;
  const r = [];
  if (e.options.onProgress != null) {
    const a = Qt(t, "content-length");
    a != null && r.push(new Tp.ProgressCallbackTransform(parseInt(a, 10), e.options.cancellationToken, e.options.onProgress));
  }
  const n = e.options.sha512;
  n != null ? r.push(new ao(n, "sha512", n.length === 128 && !n.includes("+") && !n.includes("Z") && !n.includes("=") ? "hex" : "base64")) : e.options.sha2 != null && r.push(new ao(e.options.sha2, "sha256", "hex"));
  const i = (0, _p.createWriteStream)(e.destination);
  r.push(i);
  let o = t;
  for (const a of r)
    a.on("error", (s) => {
      i.close(), e.options.cancellationToken.cancelled || e.callback(s);
    }), o = o.pipe(a);
  i.on("finish", () => {
    i.close(e.callback);
  });
}
function Un(e, t, r) {
  r != null && (e.method = r), e.headers = { ...e.headers };
  const n = e.headers;
  return t != null && (n.authorization = t.startsWith("Basic") || t.startsWith("Bearer") ? t : `token ${t}`), n["User-Agent"] == null && (n["User-Agent"] = "electron-builder"), (r == null || r === "GET" || n["Cache-Control"] == null) && (n["Cache-Control"] = "no-cache"), e.protocol == null && process.versions.electron != null && (e.protocol = "https:"), e;
}
function kn(e, t) {
  return JSON.stringify(e, (r, n) => r.endsWith("Authorization") || r.endsWith("authorization") || r.endsWith("Password") || r.endsWith("PASSWORD") || r.endsWith("Token") || r.includes("password") || r.includes("token") || t != null && t.has(r) ? "<stripped sensitive data>" : n, 2);
}
var Qn = {};
Object.defineProperty(Qn, "__esModule", { value: !0 });
Qn.MemoLazy = void 0;
class Ip {
  constructor(t, r) {
    this.selector = t, this.creator = r, this.selected = void 0, this._value = void 0;
  }
  get hasValue() {
    return this._value !== void 0;
  }
  get value() {
    const t = this.selector();
    if (this._value !== void 0 && ac(this.selected, t))
      return this._value;
    this.selected = t;
    const r = this.creator(t);
    return this.value = r, r;
  }
  set value(t) {
    this._value = t;
  }
}
Qn.MemoLazy = Ip;
function ac(e, t) {
  if (typeof e == "object" && e !== null && (typeof t == "object" && t !== null)) {
    const i = Object.keys(e), o = Object.keys(t);
    return i.length === o.length && i.every((a) => ac(e[a], t[a]));
  }
  return e === t;
}
var Zn = {};
Object.defineProperty(Zn, "__esModule", { value: !0 });
Zn.githubUrl = Rp;
Zn.getS3LikeProviderBaseUrl = Pp;
function Rp(e, t = "github.com") {
  return `${e.protocol || "https"}://${e.host || t}`;
}
function Pp(e) {
  const t = e.provider;
  if (t === "s3")
    return Dp(e);
  if (t === "spaces")
    return Np(e);
  throw new Error(`Not supported provider: ${t}`);
}
function Dp(e) {
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
  return sc(t, e.path);
}
function sc(e, t) {
  return t != null && t.length > 0 && (t.startsWith("/") || (e += "/"), e += t), e;
}
function Np(e) {
  if (e.name == null)
    throw new Error("name is missing");
  if (e.region == null)
    throw new Error("region is missing");
  return sc(`https://${e.name}.${e.region}.digitaloceanspaces.com`, e.path);
}
var Ro = {};
Object.defineProperty(Ro, "__esModule", { value: !0 });
Ro.retry = lc;
const Fp = ht;
async function lc(e, t, r, n = 0, i = 0, o) {
  var a;
  const s = new Fp.CancellationToken();
  try {
    return await e();
  } catch (l) {
    if ((!((a = o == null ? void 0 : o(l)) !== null && a !== void 0) || a) && t > 0 && !s.cancelled)
      return await new Promise((m) => setTimeout(m, r + n * i)), await lc(e, t - 1, r, n, i + 1, o);
    throw l;
  }
}
var Po = {};
Object.defineProperty(Po, "__esModule", { value: !0 });
Po.parseDn = xp;
function xp(e) {
  let t = !1, r = null, n = "", i = 0;
  e = e.trim();
  const o = /* @__PURE__ */ new Map();
  for (let a = 0; a <= e.length; a++) {
    if (a === e.length) {
      r !== null && o.set(r, n);
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
        Number.isNaN(l) ? n += e[a] : (a++, n += String.fromCharCode(l));
        continue;
      }
      if (r === null && s === "=") {
        r = n, n = "";
        continue;
      }
      if (s === "," || s === ";" || s === "+") {
        r !== null && o.set(r, n), r = null, n = "";
        continue;
      }
    }
    if (s === " " && !t) {
      if (n.length === 0)
        continue;
      if (a > i) {
        let l = a;
        for (; e[l] === " "; )
          l++;
        i = l;
      }
      if (i >= e.length || e[i] === "," || e[i] === ";" || r === null && e[i] === "=" || r !== null && e[i] === "+") {
        a = i - 1;
        continue;
      }
    }
    n += s;
  }
  return o;
}
var tr = {};
Object.defineProperty(tr, "__esModule", { value: !0 });
tr.nil = tr.UUID = void 0;
const cc = Hr, uc = or, Lp = "options.name must be either a string or a Buffer", Ha = (0, cc.randomBytes)(16);
Ha[0] = Ha[0] | 1;
const Rn = {}, W = [];
for (let e = 0; e < 256; e++) {
  const t = (e + 256).toString(16).substr(1);
  Rn[t] = e, W[e] = t;
}
class Nt {
  constructor(t) {
    this.ascii = null, this.binary = null;
    const r = Nt.check(t);
    if (!r)
      throw new Error("not a UUID");
    this.version = r.version, r.format === "ascii" ? this.ascii = t : this.binary = t;
  }
  static v5(t, r) {
    return Up(t, "sha1", 80, r);
  }
  toString() {
    return this.ascii == null && (this.ascii = kp(this.binary)), this.ascii;
  }
  inspect() {
    return `UUID v${this.version} ${this.toString()}`;
  }
  static check(t, r = 0) {
    if (typeof t == "string")
      return t = t.toLowerCase(), /^[a-f0-9]{8}(-[a-f0-9]{4}){3}-([a-f0-9]{12})$/.test(t) ? t === "00000000-0000-0000-0000-000000000000" ? { version: void 0, variant: "nil", format: "ascii" } : {
        version: (Rn[t[14] + t[15]] & 240) >> 4,
        variant: qa((Rn[t[19] + t[20]] & 224) >> 5),
        format: "ascii"
      } : !1;
    if (Buffer.isBuffer(t)) {
      if (t.length < r + 16)
        return !1;
      let n = 0;
      for (; n < 16 && t[r + n] === 0; n++)
        ;
      return n === 16 ? { version: void 0, variant: "nil", format: "binary" } : {
        version: (t[r + 6] & 240) >> 4,
        variant: qa((t[r + 8] & 224) >> 5),
        format: "binary"
      };
    }
    throw (0, uc.newError)("Unknown type of uuid", "ERR_UNKNOWN_UUID_TYPE");
  }
  // read stringified uuid into a Buffer
  static parse(t) {
    const r = Buffer.allocUnsafe(16);
    let n = 0;
    for (let i = 0; i < 16; i++)
      r[i] = Rn[t[n++] + t[n++]], (i === 3 || i === 5 || i === 7 || i === 9) && (n += 1);
    return r;
  }
}
tr.UUID = Nt;
Nt.OID = Nt.parse("6ba7b812-9dad-11d1-80b4-00c04fd430c8");
function qa(e) {
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
var Ar;
(function(e) {
  e[e.ASCII = 0] = "ASCII", e[e.BINARY = 1] = "BINARY", e[e.OBJECT = 2] = "OBJECT";
})(Ar || (Ar = {}));
function Up(e, t, r, n, i = Ar.ASCII) {
  const o = (0, cc.createHash)(t);
  if (typeof e != "string" && !Buffer.isBuffer(e))
    throw (0, uc.newError)(Lp, "ERR_INVALID_UUID_NAME");
  o.update(n), o.update(e);
  const s = o.digest();
  let l;
  switch (i) {
    case Ar.BINARY:
      s[6] = s[6] & 15 | r, s[8] = s[8] & 63 | 128, l = s;
      break;
    case Ar.OBJECT:
      s[6] = s[6] & 15 | r, s[8] = s[8] & 63 | 128, l = new Nt(s);
      break;
    default:
      l = W[s[0]] + W[s[1]] + W[s[2]] + W[s[3]] + "-" + W[s[4]] + W[s[5]] + "-" + W[s[6] & 15 | r] + W[s[7]] + "-" + W[s[8] & 63 | 128] + W[s[9]] + "-" + W[s[10]] + W[s[11]] + W[s[12]] + W[s[13]] + W[s[14]] + W[s[15]];
      break;
  }
  return l;
}
function kp(e) {
  return W[e[0]] + W[e[1]] + W[e[2]] + W[e[3]] + "-" + W[e[4]] + W[e[5]] + "-" + W[e[6]] + W[e[7]] + "-" + W[e[8]] + W[e[9]] + "-" + W[e[10]] + W[e[11]] + W[e[12]] + W[e[13]] + W[e[14]] + W[e[15]];
}
tr.nil = new Nt("00000000-0000-0000-0000-000000000000");
var Wr = {}, fc = {};
(function(e) {
  (function(t) {
    t.parser = function(d, u) {
      return new n(d, u);
    }, t.SAXParser = n, t.SAXStream = c, t.createStream = m, t.MAX_BUFFER_LENGTH = 64 * 1024;
    var r = [
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
    function n(d, u) {
      if (!(this instanceof n))
        return new n(d, u);
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
      for (var u = Math.max(t.MAX_BUFFER_LENGTH, 10), C = 0, w = 0, Y = r.length; w < Y; w++) {
        var Z = d[r[w]].length;
        if (Z > u)
          switch (r[w]) {
            case "textNode":
              z(d);
              break;
            case "cdata":
              M(d, "oncdata", d.cdata), d.cdata = "";
              break;
            case "script":
              M(d, "onscript", d.script), d.script = "";
              break;
            default:
              $(d, "Max buffer length exceeded: " + r[w]);
          }
        C = Math.max(C, Z);
      }
      var ne = t.MAX_BUFFER_LENGTH - C;
      d.bufferCheckPosition = ne + d.position;
    }
    function o(d) {
      for (var u = 0, C = r.length; u < C; u++)
        d[r[u]] = "";
    }
    function a(d) {
      z(d), d.cdata !== "" && (M(d, "oncdata", d.cdata), d.cdata = ""), d.script !== "" && (M(d, "onscript", d.script), d.script = "");
    }
    n.prototype = {
      end: function() {
        P(this);
      },
      write: We,
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
      s.apply(this), this._parser = new n(d, u), this.writable = !0, this.readable = !0;
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
          set: function(Y) {
            if (!Y)
              return C.removeAllListeners(w), C._parser["on" + w] = Y, Y;
            C.on(w, Y);
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
          var u = If.StringDecoder;
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
    function Q(d) {
      return d === '"' || d === "'";
    }
    function oe(d) {
      return d === ">" || x(d);
    }
    function V(d, u) {
      return d.test(u);
    }
    function Fe(d, u) {
      return !V(d, u);
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
      d.textNode && z(d), B(d, u, C);
    }
    function z(d) {
      d.textNode = I(d.opt, d.textNode), d.textNode && B(d, "ontext", d.textNode), d.textNode = "";
    }
    function I(d, u) {
      return d.trim && (u = u.trim()), d.normalize && (u = u.replace(/\s+/g, " ")), u;
    }
    function $(d, u) {
      return z(d), d.trackPosition && (u += `
Line: ` + d.line + `
Column: ` + d.column + `
Char: ` + d.c), u = new Error(u), d.error = u, B(d, "onerror", u), d;
    }
    function P(d) {
      return d.sawRoot && !d.closedRoot && b(d, "Unclosed root tag"), d.state !== E.BEGIN && d.state !== E.BEGIN_WHITESPACE && d.state !== E.TEXT && $(d, "Unexpected end"), z(d), d.c = "", d.closed = !0, B(d, "onend"), n.call(d, d.strict, d.opt), d;
    }
    function b(d, u) {
      if (typeof d != "object" || !(d instanceof n))
        throw new Error("bad call to strictFail");
      d.strict && $(d, u);
    }
    function D(d) {
      d.strict || (d.tagName = d.tagName[d.looseCase]());
      var u = d.tags[d.tags.length - 1] || d, C = d.tag = { name: d.tagName, attributes: {} };
      d.opt.xmlns && (C.ns = u.ns), d.attribList.length = 0, M(d, "onopentagstart", C);
    }
    function R(d, u) {
      var C = d.indexOf(":"), w = C < 0 ? ["", d] : d.split(":"), Y = w[0], Z = w[1];
      return u && d === "xmlns" && (Y = "xmlns", Z = ""), { prefix: Y, local: Z };
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
            var Y = d.tag, Z = d.tags[d.tags.length - 1] || d;
            Y.ns === Z.ns && (Y.ns = Object.create(Z.ns)), Y.ns[w] = d.attribValue;
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
        var Y = d.tags[d.tags.length - 1] || d;
        C.ns && Y.ns !== C.ns && Object.keys(C.ns).forEach(function(en) {
          M(d, "onopennamespace", {
            prefix: en,
            uri: C.ns[en]
          });
        });
        for (var Z = 0, ne = d.attribList.length; Z < ne; Z++) {
          var me = d.attribList[Z], ve = me[0], rt = me[1], ce = R(ve, !0), Me = ce.prefix, gi = ce.local, Zr = Me === "" ? "" : C.ns[Me] || "", lr = {
            name: ve,
            value: rt,
            prefix: Me,
            local: gi,
            uri: Zr
          };
          Me && Me !== "xmlns" && !Zr && (b(d, "Unbound namespace prefix: " + JSON.stringify(Me)), lr.uri = Me), d.tag.attributes[ve] = lr, M(d, "onattribute", lr);
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
        var Y = d.tags[u];
        if (Y.name !== w)
          b(d, "Unexpected close tag");
        else
          break;
      }
      if (u < 0) {
        b(d, "Unmatched closing tag: " + d.tagName), d.textNode += "</" + d.tagName + ">", d.state = E.TEXT;
        return;
      }
      d.tagName = C;
      for (var Z = d.tags.length; Z-- > u; ) {
        var ne = d.tag = d.tags.pop();
        d.tagName = d.tag.name, M(d, "onclosetag", d.tagName);
        var me = {};
        for (var ve in ne.ns)
          me[ve] = ne.ns[ve];
        var rt = d.tags[d.tags.length - 1] || d;
        d.opt.xmlns && ne.ns !== rt.ns && Object.keys(ne.ns).forEach(function(ce) {
          var Me = ne.ns[ce];
          M(d, "onclosenamespace", { prefix: ce, uri: Me });
        });
      }
      u === 0 && (d.closedRoot = !0), d.tagName = d.attribValue = d.attribName = "", d.attribList.length = 0, d.state = E.TEXT;
    }
    function X(d) {
      var u = d.entity, C = u.toLowerCase(), w, Y = "";
      return d.ENTITIES[u] ? d.ENTITIES[u] : d.ENTITIES[C] ? d.ENTITIES[C] : (u = C, u.charAt(0) === "#" && (u.charAt(1) === "x" ? (u = u.slice(2), w = parseInt(u, 16), Y = w.toString(16)) : (u = u.slice(1), w = parseInt(u, 10), Y = w.toString(10))), u = u.replace(/^0+/, ""), isNaN(w) || Y.toLowerCase() !== u ? (b(d, "Invalid character entity"), "&" + d.entity + ";") : String.fromCodePoint(w));
    }
    function fe(d, u) {
      u === "<" ? (d.state = E.OPEN_WAKA, d.startTagPosition = d.position) : x(u) || (b(d, "Non-whitespace before first tag."), d.textNode = u, d.state = E.TEXT);
    }
    function U(d, u) {
      var C = "";
      return u < d.length && (C = d.charAt(u)), C;
    }
    function We(d) {
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
              for (var Y = C - 1; w && w !== "<" && w !== "&"; )
                w = U(d, C++), w && u.trackPosition && (u.position++, w === `
` ? (u.line++, u.column = 0) : u.column++);
              u.textNode += d.substring(Y, C - 1);
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
            else if (!x(w)) if (V(A, w))
              u.state = E.OPEN_TAG, u.tagName = w;
            else if (w === "/")
              u.state = E.CLOSE_TAG, u.tagName = "";
            else if (w === "?")
              u.state = E.PROC_INST, u.procInstName = u.procInstBody = "";
            else {
              if (b(u, "Unencoded <"), u.startTagPosition + 1 < u.position) {
                var Z = u.position - u.startTagPosition;
                w = new Array(Z).join(" ") + w;
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
            ), u.doctype = "", u.sgmlDecl = "") : w === ">" ? (M(u, "onsgmldeclaration", u.sgmlDecl), u.sgmlDecl = "", u.state = E.TEXT) : (Q(w) && (u.state = E.SGML_DECL_QUOTED), u.sgmlDecl += w);
            continue;
          case E.SGML_DECL_QUOTED:
            w === u.q && (u.state = E.SGML_DECL, u.q = ""), u.sgmlDecl += w;
            continue;
          case E.DOCTYPE:
            w === ">" ? (u.state = E.TEXT, M(u, "ondoctype", u.doctype), u.doctype = !0) : (u.doctype += w, w === "[" ? u.state = E.DOCTYPE_DTD : Q(w) && (u.state = E.DOCTYPE_QUOTED, u.q = w));
            continue;
          case E.DOCTYPE_QUOTED:
            u.doctype += w, w === u.q && (u.q = "", u.state = E.DOCTYPE);
            continue;
          case E.DOCTYPE_DTD:
            w === "]" ? (u.doctype += w, u.state = E.DOCTYPE) : w === "<" ? (u.state = E.OPEN_WAKA, u.startTagPosition = u.position) : Q(w) ? (u.doctype += w, u.state = E.DOCTYPE_DTD_QUOTED, u.q = w) : u.doctype += w;
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
            V(T, w) ? u.tagName += w : (D(u), w === ">" ? G(u) : w === "/" ? u.state = E.OPEN_TAG_SLASH : (x(w) || b(u, "Invalid character in tag name"), u.state = E.ATTRIB));
            continue;
          case E.OPEN_TAG_SLASH:
            w === ">" ? (G(u, !0), j(u)) : (b(u, "Forward-slash in opening tag not followed by >"), u.state = E.ATTRIB);
            continue;
          case E.ATTRIB:
            if (x(w))
              continue;
            w === ">" ? G(u) : w === "/" ? u.state = E.OPEN_TAG_SLASH : V(A, w) ? (u.attribName = w, u.attribValue = "", u.state = E.ATTRIB_NAME) : b(u, "Invalid attribute name");
            continue;
          case E.ATTRIB_NAME:
            w === "=" ? u.state = E.ATTRIB_VALUE : w === ">" ? (b(u, "Attribute without value"), u.attribValue = u.attribName, k(u), G(u)) : x(w) ? u.state = E.ATTRIB_NAME_SAW_WHITE : V(T, w) ? u.attribName += w : b(u, "Invalid attribute name");
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
              }), u.attribName = "", w === ">" ? G(u) : V(A, w) ? (u.attribName = w, u.state = E.ATTRIB_NAME) : (b(u, "Invalid attribute name"), u.state = E.ATTRIB);
            }
            continue;
          case E.ATTRIB_VALUE:
            if (x(w))
              continue;
            Q(w) ? (u.q = w, u.state = E.ATTRIB_VALUE_QUOTED) : (u.opt.unquotedAttributeValues || $(u, "Unquoted attribute value"), u.state = E.ATTRIB_VALUE_UNQUOTED, u.attribValue = w);
            continue;
          case E.ATTRIB_VALUE_QUOTED:
            if (w !== u.q) {
              w === "&" ? u.state = E.ATTRIB_VALUE_ENTITY_Q : u.attribValue += w;
              continue;
            }
            k(u), u.q = "", u.state = E.ATTRIB_VALUE_CLOSED;
            continue;
          case E.ATTRIB_VALUE_CLOSED:
            x(w) ? u.state = E.ATTRIB : w === ">" ? G(u) : w === "/" ? u.state = E.OPEN_TAG_SLASH : V(A, w) ? (b(u, "No whitespace between attributes"), u.attribName = w, u.attribValue = "", u.state = E.ATTRIB_NAME) : b(u, "Invalid attribute name");
            continue;
          case E.ATTRIB_VALUE_UNQUOTED:
            if (!oe(w)) {
              w === "&" ? u.state = E.ATTRIB_VALUE_ENTITY_U : u.attribValue += w;
              continue;
            }
            k(u), w === ">" ? G(u) : u.state = E.ATTRIB;
            continue;
          case E.CLOSE_TAG:
            if (u.tagName)
              w === ">" ? j(u) : V(T, w) ? u.tagName += w : u.script ? (u.script += "</" + u.tagName, u.tagName = "", u.state = E.SCRIPT) : (x(w) || b(u, "Invalid tagname in closing tag"), u.state = E.CLOSE_TAG_SAW_WHITE);
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
            var ne, me;
            switch (u.state) {
              case E.TEXT_ENTITY:
                ne = E.TEXT, me = "textNode";
                break;
              case E.ATTRIB_VALUE_ENTITY_Q:
                ne = E.ATTRIB_VALUE_QUOTED, me = "attribValue";
                break;
              case E.ATTRIB_VALUE_ENTITY_U:
                ne = E.ATTRIB_VALUE_UNQUOTED, me = "attribValue";
                break;
            }
            if (w === ";") {
              var ve = X(u);
              u.opt.unparsedEntities && !Object.values(t.XML_ENTITIES).includes(ve) ? (u.entity = "", u.state = ne, u.write(ve)) : (u[me] += ve, u.entity = "", u.state = ne);
            } else V(u.entity.length ? N : S, w) ? u.entity += w : (b(u, "Invalid character in entity name"), u[me] += "&" + u.entity + w, u.entity = "", u.state = ne);
            continue;
          default:
            throw new Error(u, "Unknown state: " + u.state);
        }
      return u.position >= u.bufferCheckPosition && i(u), u;
    }
    /*! http://mths.be/fromcodepoint v0.1.0 by @mathias */
    String.fromCodePoint || function() {
      var d = String.fromCharCode, u = Math.floor, C = function() {
        var w = 16384, Y = [], Z, ne, me = -1, ve = arguments.length;
        if (!ve)
          return "";
        for (var rt = ""; ++me < ve; ) {
          var ce = Number(arguments[me]);
          if (!isFinite(ce) || // `NaN`, `+Infinity`, or `-Infinity`
          ce < 0 || // not a valid Unicode code point
          ce > 1114111 || // not a valid Unicode code point
          u(ce) !== ce)
            throw RangeError("Invalid code point: " + ce);
          ce <= 65535 ? Y.push(ce) : (ce -= 65536, Z = (ce >> 10) + 55296, ne = ce % 1024 + 56320, Y.push(Z, ne)), (me + 1 === ve || Y.length > w) && (rt += d.apply(null, Y), Y.length = 0);
        }
        return rt;
      };
      Object.defineProperty ? Object.defineProperty(String, "fromCodePoint", {
        value: C,
        configurable: !0,
        writable: !0
      }) : String.fromCodePoint = C;
    }();
  })(e);
})(fc);
Object.defineProperty(Wr, "__esModule", { value: !0 });
Wr.XElement = void 0;
Wr.parseXml = Hp;
const Mp = fc, mn = or;
class dc {
  constructor(t) {
    if (this.name = t, this.value = "", this.attributes = null, this.isCData = !1, this.elements = null, !t)
      throw (0, mn.newError)("Element name cannot be empty", "ERR_XML_ELEMENT_NAME_EMPTY");
    if (!jp(t))
      throw (0, mn.newError)(`Invalid element name: ${t}`, "ERR_XML_ELEMENT_INVALID_NAME");
  }
  attribute(t) {
    const r = this.attributes === null ? null : this.attributes[t];
    if (r == null)
      throw (0, mn.newError)(`No attribute "${t}"`, "ERR_XML_MISSED_ATTRIBUTE");
    return r;
  }
  removeAttribute(t) {
    this.attributes !== null && delete this.attributes[t];
  }
  element(t, r = !1, n = null) {
    const i = this.elementOrNull(t, r);
    if (i === null)
      throw (0, mn.newError)(n || `No element "${t}"`, "ERR_XML_MISSED_ELEMENT");
    return i;
  }
  elementOrNull(t, r = !1) {
    if (this.elements === null)
      return null;
    for (const n of this.elements)
      if (Ga(n, t, r))
        return n;
    return null;
  }
  getElements(t, r = !1) {
    return this.elements === null ? [] : this.elements.filter((n) => Ga(n, t, r));
  }
  elementValueOrEmpty(t, r = !1) {
    const n = this.elementOrNull(t, r);
    return n === null ? "" : n.value;
  }
}
Wr.XElement = dc;
const Bp = new RegExp(/^[A-Za-z_][:A-Za-z0-9_-]*$/i);
function jp(e) {
  return Bp.test(e);
}
function Ga(e, t, r) {
  const n = e.name;
  return n === t || r === !0 && n.length === t.length && n.toLowerCase() === t.toLowerCase();
}
function Hp(e) {
  let t = null;
  const r = Mp.parser(!0, {}), n = [];
  return r.onopentag = (i) => {
    const o = new dc(i.name);
    if (o.attributes = i.attributes, t === null)
      t = o;
    else {
      const a = n[n.length - 1];
      a.elements == null && (a.elements = []), a.elements.push(o);
    }
    n.push(o);
  }, r.onclosetag = () => {
    n.pop();
  }, r.ontext = (i) => {
    n.length > 0 && (n[n.length - 1].value = i);
  }, r.oncdata = (i) => {
    const o = n[n.length - 1];
    o.value = i, o.isCData = !0;
  }, r.onerror = (i) => {
    throw i;
  }, r.write(e), t;
}
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.CURRENT_APP_PACKAGE_FILE_NAME = e.CURRENT_APP_INSTALLER_FILE_NAME = e.XElement = e.parseXml = e.UUID = e.parseDn = e.retry = e.githubUrl = e.getS3LikeProviderBaseUrl = e.ProgressCallbackTransform = e.MemoLazy = e.safeStringifyJson = e.safeGetHeader = e.parseJson = e.HttpExecutor = e.HttpError = e.DigestTransform = e.createHttpError = e.configureRequestUrl = e.configureRequestOptionsFromUrl = e.configureRequestOptions = e.newError = e.CancellationToken = e.CancellationError = void 0, e.asArray = f;
  var t = ht;
  Object.defineProperty(e, "CancellationError", { enumerable: !0, get: function() {
    return t.CancellationError;
  } }), Object.defineProperty(e, "CancellationToken", { enumerable: !0, get: function() {
    return t.CancellationToken;
  } });
  var r = or;
  Object.defineProperty(e, "newError", { enumerable: !0, get: function() {
    return r.newError;
  } });
  var n = Ce;
  Object.defineProperty(e, "configureRequestOptions", { enumerable: !0, get: function() {
    return n.configureRequestOptions;
  } }), Object.defineProperty(e, "configureRequestOptionsFromUrl", { enumerable: !0, get: function() {
    return n.configureRequestOptionsFromUrl;
  } }), Object.defineProperty(e, "configureRequestUrl", { enumerable: !0, get: function() {
    return n.configureRequestUrl;
  } }), Object.defineProperty(e, "createHttpError", { enumerable: !0, get: function() {
    return n.createHttpError;
  } }), Object.defineProperty(e, "DigestTransform", { enumerable: !0, get: function() {
    return n.DigestTransform;
  } }), Object.defineProperty(e, "HttpError", { enumerable: !0, get: function() {
    return n.HttpError;
  } }), Object.defineProperty(e, "HttpExecutor", { enumerable: !0, get: function() {
    return n.HttpExecutor;
  } }), Object.defineProperty(e, "parseJson", { enumerable: !0, get: function() {
    return n.parseJson;
  } }), Object.defineProperty(e, "safeGetHeader", { enumerable: !0, get: function() {
    return n.safeGetHeader;
  } }), Object.defineProperty(e, "safeStringifyJson", { enumerable: !0, get: function() {
    return n.safeStringifyJson;
  } });
  var i = Qn;
  Object.defineProperty(e, "MemoLazy", { enumerable: !0, get: function() {
    return i.MemoLazy;
  } });
  var o = Gr;
  Object.defineProperty(e, "ProgressCallbackTransform", { enumerable: !0, get: function() {
    return o.ProgressCallbackTransform;
  } });
  var a = Zn;
  Object.defineProperty(e, "getS3LikeProviderBaseUrl", { enumerable: !0, get: function() {
    return a.getS3LikeProviderBaseUrl;
  } }), Object.defineProperty(e, "githubUrl", { enumerable: !0, get: function() {
    return a.githubUrl;
  } });
  var s = Ro;
  Object.defineProperty(e, "retry", { enumerable: !0, get: function() {
    return s.retry;
  } });
  var l = Po;
  Object.defineProperty(e, "parseDn", { enumerable: !0, get: function() {
    return l.parseDn;
  } });
  var m = tr;
  Object.defineProperty(e, "UUID", { enumerable: !0, get: function() {
    return m.UUID;
  } });
  var c = Wr;
  Object.defineProperty(e, "parseXml", { enumerable: !0, get: function() {
    return c.parseXml;
  } }), Object.defineProperty(e, "XElement", { enumerable: !0, get: function() {
    return c.XElement;
  } }), e.CURRENT_APP_INSTALLER_FILE_NAME = "installer.exe", e.CURRENT_APP_PACKAGE_FILE_NAME = "package.7z";
  function f(h) {
    return h == null ? [] : Array.isArray(h) ? h : [h];
  }
})(pe);
var ye = {}, Do = {}, He = {};
function hc(e) {
  return typeof e > "u" || e === null;
}
function qp(e) {
  return typeof e == "object" && e !== null;
}
function Gp(e) {
  return Array.isArray(e) ? e : hc(e) ? [] : [e];
}
function Wp(e, t) {
  var r, n, i, o;
  if (t)
    for (o = Object.keys(t), r = 0, n = o.length; r < n; r += 1)
      i = o[r], e[i] = t[i];
  return e;
}
function Vp(e, t) {
  var r = "", n;
  for (n = 0; n < t; n += 1)
    r += e;
  return r;
}
function Yp(e) {
  return e === 0 && Number.NEGATIVE_INFINITY === 1 / e;
}
He.isNothing = hc;
He.isObject = qp;
He.toArray = Gp;
He.repeat = Vp;
He.isNegativeZero = Yp;
He.extend = Wp;
function pc(e, t) {
  var r = "", n = e.reason || "(unknown reason)";
  return e.mark ? (e.mark.name && (r += 'in "' + e.mark.name + '" '), r += "(" + (e.mark.line + 1) + ":" + (e.mark.column + 1) + ")", !t && e.mark.snippet && (r += `

` + e.mark.snippet), n + " " + r) : n;
}
function Pr(e, t) {
  Error.call(this), this.name = "YAMLException", this.reason = e, this.mark = t, this.message = pc(this, !1), Error.captureStackTrace ? Error.captureStackTrace(this, this.constructor) : this.stack = new Error().stack || "";
}
Pr.prototype = Object.create(Error.prototype);
Pr.prototype.constructor = Pr;
Pr.prototype.toString = function(t) {
  return this.name + ": " + pc(this, t);
};
var Vr = Pr, yr = He;
function Di(e, t, r, n, i) {
  var o = "", a = "", s = Math.floor(i / 2) - 1;
  return n - t > s && (o = " ... ", t = n - s + o.length), r - n > s && (a = " ...", r = n + s - a.length), {
    str: o + e.slice(t, r).replace(/\t/g, "→") + a,
    pos: n - t + o.length
    // relative position
  };
}
function Ni(e, t) {
  return yr.repeat(" ", t - e.length) + e;
}
function zp(e, t) {
  if (t = Object.create(t || null), !e.buffer) return null;
  t.maxLength || (t.maxLength = 79), typeof t.indent != "number" && (t.indent = 1), typeof t.linesBefore != "number" && (t.linesBefore = 3), typeof t.linesAfter != "number" && (t.linesAfter = 2);
  for (var r = /\r?\n|\r|\0/g, n = [0], i = [], o, a = -1; o = r.exec(e.buffer); )
    i.push(o.index), n.push(o.index + o[0].length), e.position <= o.index && a < 0 && (a = n.length - 2);
  a < 0 && (a = n.length - 1);
  var s = "", l, m, c = Math.min(e.line + t.linesAfter, i.length).toString().length, f = t.maxLength - (t.indent + c + 3);
  for (l = 1; l <= t.linesBefore && !(a - l < 0); l++)
    m = Di(
      e.buffer,
      n[a - l],
      i[a - l],
      e.position - (n[a] - n[a - l]),
      f
    ), s = yr.repeat(" ", t.indent) + Ni((e.line - l + 1).toString(), c) + " | " + m.str + `
` + s;
  for (m = Di(e.buffer, n[a], i[a], e.position, f), s += yr.repeat(" ", t.indent) + Ni((e.line + 1).toString(), c) + " | " + m.str + `
`, s += yr.repeat("-", t.indent + c + 3 + m.pos) + `^
`, l = 1; l <= t.linesAfter && !(a + l >= i.length); l++)
    m = Di(
      e.buffer,
      n[a + l],
      i[a + l],
      e.position - (n[a] - n[a + l]),
      f
    ), s += yr.repeat(" ", t.indent) + Ni((e.line + l + 1).toString(), c) + " | " + m.str + `
`;
  return s.replace(/\n$/, "");
}
var Xp = zp, Wa = Vr, Kp = [
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
], Jp = [
  "scalar",
  "sequence",
  "mapping"
];
function Qp(e) {
  var t = {};
  return e !== null && Object.keys(e).forEach(function(r) {
    e[r].forEach(function(n) {
      t[String(n)] = r;
    });
  }), t;
}
function Zp(e, t) {
  if (t = t || {}, Object.keys(t).forEach(function(r) {
    if (Kp.indexOf(r) === -1)
      throw new Wa('Unknown option "' + r + '" is met in definition of "' + e + '" YAML type.');
  }), this.options = t, this.tag = e, this.kind = t.kind || null, this.resolve = t.resolve || function() {
    return !0;
  }, this.construct = t.construct || function(r) {
    return r;
  }, this.instanceOf = t.instanceOf || null, this.predicate = t.predicate || null, this.represent = t.represent || null, this.representName = t.representName || null, this.defaultStyle = t.defaultStyle || null, this.multi = t.multi || !1, this.styleAliases = Qp(t.styleAliases || null), Jp.indexOf(this.kind) === -1)
    throw new Wa('Unknown kind "' + this.kind + '" is specified for "' + e + '" YAML type.');
}
var Ie = Zp, pr = Vr, Fi = Ie;
function Va(e, t) {
  var r = [];
  return e[t].forEach(function(n) {
    var i = r.length;
    r.forEach(function(o, a) {
      o.tag === n.tag && o.kind === n.kind && o.multi === n.multi && (i = a);
    }), r[i] = n;
  }), r;
}
function em() {
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
  }, t, r;
  function n(i) {
    i.multi ? (e.multi[i.kind].push(i), e.multi.fallback.push(i)) : e[i.kind][i.tag] = e.fallback[i.tag] = i;
  }
  for (t = 0, r = arguments.length; t < r; t += 1)
    arguments[t].forEach(n);
  return e;
}
function so(e) {
  return this.extend(e);
}
so.prototype.extend = function(t) {
  var r = [], n = [];
  if (t instanceof Fi)
    n.push(t);
  else if (Array.isArray(t))
    n = n.concat(t);
  else if (t && (Array.isArray(t.implicit) || Array.isArray(t.explicit)))
    t.implicit && (r = r.concat(t.implicit)), t.explicit && (n = n.concat(t.explicit));
  else
    throw new pr("Schema.extend argument should be a Type, [ Type ], or a schema definition ({ implicit: [...], explicit: [...] })");
  r.forEach(function(o) {
    if (!(o instanceof Fi))
      throw new pr("Specified list of YAML types (or a single Type object) contains a non-Type object.");
    if (o.loadKind && o.loadKind !== "scalar")
      throw new pr("There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported.");
    if (o.multi)
      throw new pr("There is a multi type in the implicit list of a schema. Multi tags can only be listed as explicit.");
  }), n.forEach(function(o) {
    if (!(o instanceof Fi))
      throw new pr("Specified list of YAML types (or a single Type object) contains a non-Type object.");
  });
  var i = Object.create(so.prototype);
  return i.implicit = (this.implicit || []).concat(r), i.explicit = (this.explicit || []).concat(n), i.compiledImplicit = Va(i, "implicit"), i.compiledExplicit = Va(i, "explicit"), i.compiledTypeMap = em(i.compiledImplicit, i.compiledExplicit), i;
};
var mc = so, tm = Ie, gc = new tm("tag:yaml.org,2002:str", {
  kind: "scalar",
  construct: function(e) {
    return e !== null ? e : "";
  }
}), rm = Ie, Ec = new rm("tag:yaml.org,2002:seq", {
  kind: "sequence",
  construct: function(e) {
    return e !== null ? e : [];
  }
}), nm = Ie, yc = new nm("tag:yaml.org,2002:map", {
  kind: "mapping",
  construct: function(e) {
    return e !== null ? e : {};
  }
}), im = mc, vc = new im({
  explicit: [
    gc,
    Ec,
    yc
  ]
}), om = Ie;
function am(e) {
  if (e === null) return !0;
  var t = e.length;
  return t === 1 && e === "~" || t === 4 && (e === "null" || e === "Null" || e === "NULL");
}
function sm() {
  return null;
}
function lm(e) {
  return e === null;
}
var wc = new om("tag:yaml.org,2002:null", {
  kind: "scalar",
  resolve: am,
  construct: sm,
  predicate: lm,
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
}), cm = Ie;
function um(e) {
  if (e === null) return !1;
  var t = e.length;
  return t === 4 && (e === "true" || e === "True" || e === "TRUE") || t === 5 && (e === "false" || e === "False" || e === "FALSE");
}
function fm(e) {
  return e === "true" || e === "True" || e === "TRUE";
}
function dm(e) {
  return Object.prototype.toString.call(e) === "[object Boolean]";
}
var _c = new cm("tag:yaml.org,2002:bool", {
  kind: "scalar",
  resolve: um,
  construct: fm,
  predicate: dm,
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
}), hm = He, pm = Ie;
function mm(e) {
  return 48 <= e && e <= 57 || 65 <= e && e <= 70 || 97 <= e && e <= 102;
}
function gm(e) {
  return 48 <= e && e <= 55;
}
function Em(e) {
  return 48 <= e && e <= 57;
}
function ym(e) {
  if (e === null) return !1;
  var t = e.length, r = 0, n = !1, i;
  if (!t) return !1;
  if (i = e[r], (i === "-" || i === "+") && (i = e[++r]), i === "0") {
    if (r + 1 === t) return !0;
    if (i = e[++r], i === "b") {
      for (r++; r < t; r++)
        if (i = e[r], i !== "_") {
          if (i !== "0" && i !== "1") return !1;
          n = !0;
        }
      return n && i !== "_";
    }
    if (i === "x") {
      for (r++; r < t; r++)
        if (i = e[r], i !== "_") {
          if (!mm(e.charCodeAt(r))) return !1;
          n = !0;
        }
      return n && i !== "_";
    }
    if (i === "o") {
      for (r++; r < t; r++)
        if (i = e[r], i !== "_") {
          if (!gm(e.charCodeAt(r))) return !1;
          n = !0;
        }
      return n && i !== "_";
    }
  }
  if (i === "_") return !1;
  for (; r < t; r++)
    if (i = e[r], i !== "_") {
      if (!Em(e.charCodeAt(r)))
        return !1;
      n = !0;
    }
  return !(!n || i === "_");
}
function vm(e) {
  var t = e, r = 1, n;
  if (t.indexOf("_") !== -1 && (t = t.replace(/_/g, "")), n = t[0], (n === "-" || n === "+") && (n === "-" && (r = -1), t = t.slice(1), n = t[0]), t === "0") return 0;
  if (n === "0") {
    if (t[1] === "b") return r * parseInt(t.slice(2), 2);
    if (t[1] === "x") return r * parseInt(t.slice(2), 16);
    if (t[1] === "o") return r * parseInt(t.slice(2), 8);
  }
  return r * parseInt(t, 10);
}
function wm(e) {
  return Object.prototype.toString.call(e) === "[object Number]" && e % 1 === 0 && !hm.isNegativeZero(e);
}
var Ac = new pm("tag:yaml.org,2002:int", {
  kind: "scalar",
  resolve: ym,
  construct: vm,
  predicate: wm,
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
}), Sc = He, _m = Ie, Am = new RegExp(
  // 2.5e4, 2.5 and integers
  "^(?:[-+]?(?:[0-9][0-9_]*)(?:\\.[0-9_]*)?(?:[eE][-+]?[0-9]+)?|\\.[0-9_]+(?:[eE][-+]?[0-9]+)?|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$"
);
function Sm(e) {
  return !(e === null || !Am.test(e) || // Quick hack to not allow integers end with `_`
  // Probably should update regexp & check speed
  e[e.length - 1] === "_");
}
function Tm(e) {
  var t, r;
  return t = e.replace(/_/g, "").toLowerCase(), r = t[0] === "-" ? -1 : 1, "+-".indexOf(t[0]) >= 0 && (t = t.slice(1)), t === ".inf" ? r === 1 ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY : t === ".nan" ? NaN : r * parseFloat(t, 10);
}
var Cm = /^[-+]?[0-9]+e/;
function bm(e, t) {
  var r;
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
  else if (Sc.isNegativeZero(e))
    return "-0.0";
  return r = e.toString(10), Cm.test(r) ? r.replace("e", ".e") : r;
}
function $m(e) {
  return Object.prototype.toString.call(e) === "[object Number]" && (e % 1 !== 0 || Sc.isNegativeZero(e));
}
var Tc = new _m("tag:yaml.org,2002:float", {
  kind: "scalar",
  resolve: Sm,
  construct: Tm,
  predicate: $m,
  represent: bm,
  defaultStyle: "lowercase"
}), Cc = vc.extend({
  implicit: [
    wc,
    _c,
    Ac,
    Tc
  ]
}), bc = Cc, Om = Ie, $c = new RegExp(
  "^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$"
), Oc = new RegExp(
  "^([0-9][0-9][0-9][0-9])-([0-9][0-9]?)-([0-9][0-9]?)(?:[Tt]|[ \\t]+)([0-9][0-9]?):([0-9][0-9]):([0-9][0-9])(?:\\.([0-9]*))?(?:[ \\t]*(Z|([-+])([0-9][0-9]?)(?::([0-9][0-9]))?))?$"
);
function Im(e) {
  return e === null ? !1 : $c.exec(e) !== null || Oc.exec(e) !== null;
}
function Rm(e) {
  var t, r, n, i, o, a, s, l = 0, m = null, c, f, h;
  if (t = $c.exec(e), t === null && (t = Oc.exec(e)), t === null) throw new Error("Date resolve error");
  if (r = +t[1], n = +t[2] - 1, i = +t[3], !t[4])
    return new Date(Date.UTC(r, n, i));
  if (o = +t[4], a = +t[5], s = +t[6], t[7]) {
    for (l = t[7].slice(0, 3); l.length < 3; )
      l += "0";
    l = +l;
  }
  return t[9] && (c = +t[10], f = +(t[11] || 0), m = (c * 60 + f) * 6e4, t[9] === "-" && (m = -m)), h = new Date(Date.UTC(r, n, i, o, a, s, l)), m && h.setTime(h.getTime() - m), h;
}
function Pm(e) {
  return e.toISOString();
}
var Ic = new Om("tag:yaml.org,2002:timestamp", {
  kind: "scalar",
  resolve: Im,
  construct: Rm,
  instanceOf: Date,
  represent: Pm
}), Dm = Ie;
function Nm(e) {
  return e === "<<" || e === null;
}
var Rc = new Dm("tag:yaml.org,2002:merge", {
  kind: "scalar",
  resolve: Nm
}), Fm = Ie, No = `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=
\r`;
function xm(e) {
  if (e === null) return !1;
  var t, r, n = 0, i = e.length, o = No;
  for (r = 0; r < i; r++)
    if (t = o.indexOf(e.charAt(r)), !(t > 64)) {
      if (t < 0) return !1;
      n += 6;
    }
  return n % 8 === 0;
}
function Lm(e) {
  var t, r, n = e.replace(/[\r\n=]/g, ""), i = n.length, o = No, a = 0, s = [];
  for (t = 0; t < i; t++)
    t % 4 === 0 && t && (s.push(a >> 16 & 255), s.push(a >> 8 & 255), s.push(a & 255)), a = a << 6 | o.indexOf(n.charAt(t));
  return r = i % 4 * 6, r === 0 ? (s.push(a >> 16 & 255), s.push(a >> 8 & 255), s.push(a & 255)) : r === 18 ? (s.push(a >> 10 & 255), s.push(a >> 2 & 255)) : r === 12 && s.push(a >> 4 & 255), new Uint8Array(s);
}
function Um(e) {
  var t = "", r = 0, n, i, o = e.length, a = No;
  for (n = 0; n < o; n++)
    n % 3 === 0 && n && (t += a[r >> 18 & 63], t += a[r >> 12 & 63], t += a[r >> 6 & 63], t += a[r & 63]), r = (r << 8) + e[n];
  return i = o % 3, i === 0 ? (t += a[r >> 18 & 63], t += a[r >> 12 & 63], t += a[r >> 6 & 63], t += a[r & 63]) : i === 2 ? (t += a[r >> 10 & 63], t += a[r >> 4 & 63], t += a[r << 2 & 63], t += a[64]) : i === 1 && (t += a[r >> 2 & 63], t += a[r << 4 & 63], t += a[64], t += a[64]), t;
}
function km(e) {
  return Object.prototype.toString.call(e) === "[object Uint8Array]";
}
var Pc = new Fm("tag:yaml.org,2002:binary", {
  kind: "scalar",
  resolve: xm,
  construct: Lm,
  predicate: km,
  represent: Um
}), Mm = Ie, Bm = Object.prototype.hasOwnProperty, jm = Object.prototype.toString;
function Hm(e) {
  if (e === null) return !0;
  var t = [], r, n, i, o, a, s = e;
  for (r = 0, n = s.length; r < n; r += 1) {
    if (i = s[r], a = !1, jm.call(i) !== "[object Object]") return !1;
    for (o in i)
      if (Bm.call(i, o))
        if (!a) a = !0;
        else return !1;
    if (!a) return !1;
    if (t.indexOf(o) === -1) t.push(o);
    else return !1;
  }
  return !0;
}
function qm(e) {
  return e !== null ? e : [];
}
var Dc = new Mm("tag:yaml.org,2002:omap", {
  kind: "sequence",
  resolve: Hm,
  construct: qm
}), Gm = Ie, Wm = Object.prototype.toString;
function Vm(e) {
  if (e === null) return !0;
  var t, r, n, i, o, a = e;
  for (o = new Array(a.length), t = 0, r = a.length; t < r; t += 1) {
    if (n = a[t], Wm.call(n) !== "[object Object]" || (i = Object.keys(n), i.length !== 1)) return !1;
    o[t] = [i[0], n[i[0]]];
  }
  return !0;
}
function Ym(e) {
  if (e === null) return [];
  var t, r, n, i, o, a = e;
  for (o = new Array(a.length), t = 0, r = a.length; t < r; t += 1)
    n = a[t], i = Object.keys(n), o[t] = [i[0], n[i[0]]];
  return o;
}
var Nc = new Gm("tag:yaml.org,2002:pairs", {
  kind: "sequence",
  resolve: Vm,
  construct: Ym
}), zm = Ie, Xm = Object.prototype.hasOwnProperty;
function Km(e) {
  if (e === null) return !0;
  var t, r = e;
  for (t in r)
    if (Xm.call(r, t) && r[t] !== null)
      return !1;
  return !0;
}
function Jm(e) {
  return e !== null ? e : {};
}
var Fc = new zm("tag:yaml.org,2002:set", {
  kind: "mapping",
  resolve: Km,
  construct: Jm
}), Fo = bc.extend({
  implicit: [
    Ic,
    Rc
  ],
  explicit: [
    Pc,
    Dc,
    Nc,
    Fc
  ]
}), Ot = He, xc = Vr, Qm = Xp, Zm = Fo, pt = Object.prototype.hasOwnProperty, Mn = 1, Lc = 2, Uc = 3, Bn = 4, xi = 1, eg = 2, Ya = 3, tg = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/, rg = /[\x85\u2028\u2029]/, ng = /[,\[\]\{\}]/, kc = /^(?:!|!!|![a-z\-]+!)$/i, Mc = /^(?:!|[^,\[\]\{\}])(?:%[0-9a-f]{2}|[0-9a-z\-#;\/\?:@&=\+\$,_\.!~\*'\(\)\[\]])*$/i;
function za(e) {
  return Object.prototype.toString.call(e);
}
function ze(e) {
  return e === 10 || e === 13;
}
function Pt(e) {
  return e === 9 || e === 32;
}
function Ne(e) {
  return e === 9 || e === 32 || e === 10 || e === 13;
}
function Vt(e) {
  return e === 44 || e === 91 || e === 93 || e === 123 || e === 125;
}
function ig(e) {
  var t;
  return 48 <= e && e <= 57 ? e - 48 : (t = e | 32, 97 <= t && t <= 102 ? t - 97 + 10 : -1);
}
function og(e) {
  return e === 120 ? 2 : e === 117 ? 4 : e === 85 ? 8 : 0;
}
function ag(e) {
  return 48 <= e && e <= 57 ? e - 48 : -1;
}
function Xa(e) {
  return e === 48 ? "\0" : e === 97 ? "\x07" : e === 98 ? "\b" : e === 116 || e === 9 ? "	" : e === 110 ? `
` : e === 118 ? "\v" : e === 102 ? "\f" : e === 114 ? "\r" : e === 101 ? "\x1B" : e === 32 ? " " : e === 34 ? '"' : e === 47 ? "/" : e === 92 ? "\\" : e === 78 ? "" : e === 95 ? " " : e === 76 ? "\u2028" : e === 80 ? "\u2029" : "";
}
function sg(e) {
  return e <= 65535 ? String.fromCharCode(e) : String.fromCharCode(
    (e - 65536 >> 10) + 55296,
    (e - 65536 & 1023) + 56320
  );
}
var Bc = new Array(256), jc = new Array(256);
for (var Bt = 0; Bt < 256; Bt++)
  Bc[Bt] = Xa(Bt) ? 1 : 0, jc[Bt] = Xa(Bt);
function lg(e, t) {
  this.input = e, this.filename = t.filename || null, this.schema = t.schema || Zm, this.onWarning = t.onWarning || null, this.legacy = t.legacy || !1, this.json = t.json || !1, this.listener = t.listener || null, this.implicitTypes = this.schema.compiledImplicit, this.typeMap = this.schema.compiledTypeMap, this.length = e.length, this.position = 0, this.line = 0, this.lineStart = 0, this.lineIndent = 0, this.firstTabInLine = -1, this.documents = [];
}
function Hc(e, t) {
  var r = {
    name: e.filename,
    buffer: e.input.slice(0, -1),
    // omit trailing \0
    position: e.position,
    line: e.line,
    column: e.position - e.lineStart
  };
  return r.snippet = Qm(r), new xc(t, r);
}
function L(e, t) {
  throw Hc(e, t);
}
function jn(e, t) {
  e.onWarning && e.onWarning.call(null, Hc(e, t));
}
var Ka = {
  YAML: function(t, r, n) {
    var i, o, a;
    t.version !== null && L(t, "duplication of %YAML directive"), n.length !== 1 && L(t, "YAML directive accepts exactly one argument"), i = /^([0-9]+)\.([0-9]+)$/.exec(n[0]), i === null && L(t, "ill-formed argument of the YAML directive"), o = parseInt(i[1], 10), a = parseInt(i[2], 10), o !== 1 && L(t, "unacceptable YAML version of the document"), t.version = n[0], t.checkLineBreaks = a < 2, a !== 1 && a !== 2 && jn(t, "unsupported YAML version of the document");
  },
  TAG: function(t, r, n) {
    var i, o;
    n.length !== 2 && L(t, "TAG directive accepts exactly two arguments"), i = n[0], o = n[1], kc.test(i) || L(t, "ill-formed tag handle (first argument) of the TAG directive"), pt.call(t.tagMap, i) && L(t, 'there is a previously declared suffix for "' + i + '" tag handle'), Mc.test(o) || L(t, "ill-formed tag prefix (second argument) of the TAG directive");
    try {
      o = decodeURIComponent(o);
    } catch {
      L(t, "tag prefix is malformed: " + o);
    }
    t.tagMap[i] = o;
  }
};
function ft(e, t, r, n) {
  var i, o, a, s;
  if (t < r) {
    if (s = e.input.slice(t, r), n)
      for (i = 0, o = s.length; i < o; i += 1)
        a = s.charCodeAt(i), a === 9 || 32 <= a && a <= 1114111 || L(e, "expected valid JSON character");
    else tg.test(s) && L(e, "the stream contains non-printable characters");
    e.result += s;
  }
}
function Ja(e, t, r, n) {
  var i, o, a, s;
  for (Ot.isObject(r) || L(e, "cannot merge mappings; the provided source object is unacceptable"), i = Object.keys(r), a = 0, s = i.length; a < s; a += 1)
    o = i[a], pt.call(t, o) || (t[o] = r[o], n[o] = !0);
}
function Yt(e, t, r, n, i, o, a, s, l) {
  var m, c;
  if (Array.isArray(i))
    for (i = Array.prototype.slice.call(i), m = 0, c = i.length; m < c; m += 1)
      Array.isArray(i[m]) && L(e, "nested arrays are not supported inside keys"), typeof i == "object" && za(i[m]) === "[object Object]" && (i[m] = "[object Object]");
  if (typeof i == "object" && za(i) === "[object Object]" && (i = "[object Object]"), i = String(i), t === null && (t = {}), n === "tag:yaml.org,2002:merge")
    if (Array.isArray(o))
      for (m = 0, c = o.length; m < c; m += 1)
        Ja(e, t, o[m], r);
    else
      Ja(e, t, o, r);
  else
    !e.json && !pt.call(r, i) && pt.call(t, i) && (e.line = a || e.line, e.lineStart = s || e.lineStart, e.position = l || e.position, L(e, "duplicated mapping key")), i === "__proto__" ? Object.defineProperty(t, i, {
      configurable: !0,
      enumerable: !0,
      writable: !0,
      value: o
    }) : t[i] = o, delete r[i];
  return t;
}
function xo(e) {
  var t;
  t = e.input.charCodeAt(e.position), t === 10 ? e.position++ : t === 13 ? (e.position++, e.input.charCodeAt(e.position) === 10 && e.position++) : L(e, "a line break is expected"), e.line += 1, e.lineStart = e.position, e.firstTabInLine = -1;
}
function le(e, t, r) {
  for (var n = 0, i = e.input.charCodeAt(e.position); i !== 0; ) {
    for (; Pt(i); )
      i === 9 && e.firstTabInLine === -1 && (e.firstTabInLine = e.position), i = e.input.charCodeAt(++e.position);
    if (t && i === 35)
      do
        i = e.input.charCodeAt(++e.position);
      while (i !== 10 && i !== 13 && i !== 0);
    if (ze(i))
      for (xo(e), i = e.input.charCodeAt(e.position), n++, e.lineIndent = 0; i === 32; )
        e.lineIndent++, i = e.input.charCodeAt(++e.position);
    else
      break;
  }
  return r !== -1 && n !== 0 && e.lineIndent < r && jn(e, "deficient indentation"), n;
}
function ei(e) {
  var t = e.position, r;
  return r = e.input.charCodeAt(t), !!((r === 45 || r === 46) && r === e.input.charCodeAt(t + 1) && r === e.input.charCodeAt(t + 2) && (t += 3, r = e.input.charCodeAt(t), r === 0 || Ne(r)));
}
function Lo(e, t) {
  t === 1 ? e.result += " " : t > 1 && (e.result += Ot.repeat(`
`, t - 1));
}
function cg(e, t, r) {
  var n, i, o, a, s, l, m, c, f = e.kind, h = e.result, g;
  if (g = e.input.charCodeAt(e.position), Ne(g) || Vt(g) || g === 35 || g === 38 || g === 42 || g === 33 || g === 124 || g === 62 || g === 39 || g === 34 || g === 37 || g === 64 || g === 96 || (g === 63 || g === 45) && (i = e.input.charCodeAt(e.position + 1), Ne(i) || r && Vt(i)))
    return !1;
  for (e.kind = "scalar", e.result = "", o = a = e.position, s = !1; g !== 0; ) {
    if (g === 58) {
      if (i = e.input.charCodeAt(e.position + 1), Ne(i) || r && Vt(i))
        break;
    } else if (g === 35) {
      if (n = e.input.charCodeAt(e.position - 1), Ne(n))
        break;
    } else {
      if (e.position === e.lineStart && ei(e) || r && Vt(g))
        break;
      if (ze(g))
        if (l = e.line, m = e.lineStart, c = e.lineIndent, le(e, !1, -1), e.lineIndent >= t) {
          s = !0, g = e.input.charCodeAt(e.position);
          continue;
        } else {
          e.position = a, e.line = l, e.lineStart = m, e.lineIndent = c;
          break;
        }
    }
    s && (ft(e, o, a, !1), Lo(e, e.line - l), o = a = e.position, s = !1), Pt(g) || (a = e.position + 1), g = e.input.charCodeAt(++e.position);
  }
  return ft(e, o, a, !1), e.result ? !0 : (e.kind = f, e.result = h, !1);
}
function ug(e, t) {
  var r, n, i;
  if (r = e.input.charCodeAt(e.position), r !== 39)
    return !1;
  for (e.kind = "scalar", e.result = "", e.position++, n = i = e.position; (r = e.input.charCodeAt(e.position)) !== 0; )
    if (r === 39)
      if (ft(e, n, e.position, !0), r = e.input.charCodeAt(++e.position), r === 39)
        n = e.position, e.position++, i = e.position;
      else
        return !0;
    else ze(r) ? (ft(e, n, i, !0), Lo(e, le(e, !1, t)), n = i = e.position) : e.position === e.lineStart && ei(e) ? L(e, "unexpected end of the document within a single quoted scalar") : (e.position++, i = e.position);
  L(e, "unexpected end of the stream within a single quoted scalar");
}
function fg(e, t) {
  var r, n, i, o, a, s;
  if (s = e.input.charCodeAt(e.position), s !== 34)
    return !1;
  for (e.kind = "scalar", e.result = "", e.position++, r = n = e.position; (s = e.input.charCodeAt(e.position)) !== 0; ) {
    if (s === 34)
      return ft(e, r, e.position, !0), e.position++, !0;
    if (s === 92) {
      if (ft(e, r, e.position, !0), s = e.input.charCodeAt(++e.position), ze(s))
        le(e, !1, t);
      else if (s < 256 && Bc[s])
        e.result += jc[s], e.position++;
      else if ((a = og(s)) > 0) {
        for (i = a, o = 0; i > 0; i--)
          s = e.input.charCodeAt(++e.position), (a = ig(s)) >= 0 ? o = (o << 4) + a : L(e, "expected hexadecimal character");
        e.result += sg(o), e.position++;
      } else
        L(e, "unknown escape sequence");
      r = n = e.position;
    } else ze(s) ? (ft(e, r, n, !0), Lo(e, le(e, !1, t)), r = n = e.position) : e.position === e.lineStart && ei(e) ? L(e, "unexpected end of the document within a double quoted scalar") : (e.position++, n = e.position);
  }
  L(e, "unexpected end of the stream within a double quoted scalar");
}
function dg(e, t) {
  var r = !0, n, i, o, a = e.tag, s, l = e.anchor, m, c, f, h, g, _ = /* @__PURE__ */ Object.create(null), y, A, T, S;
  if (S = e.input.charCodeAt(e.position), S === 91)
    c = 93, g = !1, s = [];
  else if (S === 123)
    c = 125, g = !0, s = {};
  else
    return !1;
  for (e.anchor !== null && (e.anchorMap[e.anchor] = s), S = e.input.charCodeAt(++e.position); S !== 0; ) {
    if (le(e, !0, t), S = e.input.charCodeAt(e.position), S === c)
      return e.position++, e.tag = a, e.anchor = l, e.kind = g ? "mapping" : "sequence", e.result = s, !0;
    r ? S === 44 && L(e, "expected the node content, but found ','") : L(e, "missed comma between flow collection entries"), A = y = T = null, f = h = !1, S === 63 && (m = e.input.charCodeAt(e.position + 1), Ne(m) && (f = h = !0, e.position++, le(e, !0, t))), n = e.line, i = e.lineStart, o = e.position, rr(e, t, Mn, !1, !0), A = e.tag, y = e.result, le(e, !0, t), S = e.input.charCodeAt(e.position), (h || e.line === n) && S === 58 && (f = !0, S = e.input.charCodeAt(++e.position), le(e, !0, t), rr(e, t, Mn, !1, !0), T = e.result), g ? Yt(e, s, _, A, y, T, n, i, o) : f ? s.push(Yt(e, null, _, A, y, T, n, i, o)) : s.push(y), le(e, !0, t), S = e.input.charCodeAt(e.position), S === 44 ? (r = !0, S = e.input.charCodeAt(++e.position)) : r = !1;
  }
  L(e, "unexpected end of the stream within a flow collection");
}
function hg(e, t) {
  var r, n, i = xi, o = !1, a = !1, s = t, l = 0, m = !1, c, f;
  if (f = e.input.charCodeAt(e.position), f === 124)
    n = !1;
  else if (f === 62)
    n = !0;
  else
    return !1;
  for (e.kind = "scalar", e.result = ""; f !== 0; )
    if (f = e.input.charCodeAt(++e.position), f === 43 || f === 45)
      xi === i ? i = f === 43 ? Ya : eg : L(e, "repeat of a chomping mode identifier");
    else if ((c = ag(f)) >= 0)
      c === 0 ? L(e, "bad explicit indentation width of a block scalar; it cannot be less than one") : a ? L(e, "repeat of an indentation width identifier") : (s = t + c - 1, a = !0);
    else
      break;
  if (Pt(f)) {
    do
      f = e.input.charCodeAt(++e.position);
    while (Pt(f));
    if (f === 35)
      do
        f = e.input.charCodeAt(++e.position);
      while (!ze(f) && f !== 0);
  }
  for (; f !== 0; ) {
    for (xo(e), e.lineIndent = 0, f = e.input.charCodeAt(e.position); (!a || e.lineIndent < s) && f === 32; )
      e.lineIndent++, f = e.input.charCodeAt(++e.position);
    if (!a && e.lineIndent > s && (s = e.lineIndent), ze(f)) {
      l++;
      continue;
    }
    if (e.lineIndent < s) {
      i === Ya ? e.result += Ot.repeat(`
`, o ? 1 + l : l) : i === xi && o && (e.result += `
`);
      break;
    }
    for (n ? Pt(f) ? (m = !0, e.result += Ot.repeat(`
`, o ? 1 + l : l)) : m ? (m = !1, e.result += Ot.repeat(`
`, l + 1)) : l === 0 ? o && (e.result += " ") : e.result += Ot.repeat(`
`, l) : e.result += Ot.repeat(`
`, o ? 1 + l : l), o = !0, a = !0, l = 0, r = e.position; !ze(f) && f !== 0; )
      f = e.input.charCodeAt(++e.position);
    ft(e, r, e.position, !1);
  }
  return !0;
}
function Qa(e, t) {
  var r, n = e.tag, i = e.anchor, o = [], a, s = !1, l;
  if (e.firstTabInLine !== -1) return !1;
  for (e.anchor !== null && (e.anchorMap[e.anchor] = o), l = e.input.charCodeAt(e.position); l !== 0 && (e.firstTabInLine !== -1 && (e.position = e.firstTabInLine, L(e, "tab characters must not be used in indentation")), !(l !== 45 || (a = e.input.charCodeAt(e.position + 1), !Ne(a)))); ) {
    if (s = !0, e.position++, le(e, !0, -1) && e.lineIndent <= t) {
      o.push(null), l = e.input.charCodeAt(e.position);
      continue;
    }
    if (r = e.line, rr(e, t, Uc, !1, !0), o.push(e.result), le(e, !0, -1), l = e.input.charCodeAt(e.position), (e.line === r || e.lineIndent > t) && l !== 0)
      L(e, "bad indentation of a sequence entry");
    else if (e.lineIndent < t)
      break;
  }
  return s ? (e.tag = n, e.anchor = i, e.kind = "sequence", e.result = o, !0) : !1;
}
function pg(e, t, r) {
  var n, i, o, a, s, l, m = e.tag, c = e.anchor, f = {}, h = /* @__PURE__ */ Object.create(null), g = null, _ = null, y = null, A = !1, T = !1, S;
  if (e.firstTabInLine !== -1) return !1;
  for (e.anchor !== null && (e.anchorMap[e.anchor] = f), S = e.input.charCodeAt(e.position); S !== 0; ) {
    if (!A && e.firstTabInLine !== -1 && (e.position = e.firstTabInLine, L(e, "tab characters must not be used in indentation")), n = e.input.charCodeAt(e.position + 1), o = e.line, (S === 63 || S === 58) && Ne(n))
      S === 63 ? (A && (Yt(e, f, h, g, _, null, a, s, l), g = _ = y = null), T = !0, A = !0, i = !0) : A ? (A = !1, i = !0) : L(e, "incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulated empty line"), e.position += 1, S = n;
    else {
      if (a = e.line, s = e.lineStart, l = e.position, !rr(e, r, Lc, !1, !0))
        break;
      if (e.line === o) {
        for (S = e.input.charCodeAt(e.position); Pt(S); )
          S = e.input.charCodeAt(++e.position);
        if (S === 58)
          S = e.input.charCodeAt(++e.position), Ne(S) || L(e, "a whitespace character is expected after the key-value separator within a block mapping"), A && (Yt(e, f, h, g, _, null, a, s, l), g = _ = y = null), T = !0, A = !1, i = !1, g = e.tag, _ = e.result;
        else if (T)
          L(e, "can not read an implicit mapping pair; a colon is missed");
        else
          return e.tag = m, e.anchor = c, !0;
      } else if (T)
        L(e, "can not read a block mapping entry; a multiline key may not be an implicit key");
      else
        return e.tag = m, e.anchor = c, !0;
    }
    if ((e.line === o || e.lineIndent > t) && (A && (a = e.line, s = e.lineStart, l = e.position), rr(e, t, Bn, !0, i) && (A ? _ = e.result : y = e.result), A || (Yt(e, f, h, g, _, y, a, s, l), g = _ = y = null), le(e, !0, -1), S = e.input.charCodeAt(e.position)), (e.line === o || e.lineIndent > t) && S !== 0)
      L(e, "bad indentation of a mapping entry");
    else if (e.lineIndent < t)
      break;
  }
  return A && Yt(e, f, h, g, _, null, a, s, l), T && (e.tag = m, e.anchor = c, e.kind = "mapping", e.result = f), T;
}
function mg(e) {
  var t, r = !1, n = !1, i, o, a;
  if (a = e.input.charCodeAt(e.position), a !== 33) return !1;
  if (e.tag !== null && L(e, "duplication of a tag property"), a = e.input.charCodeAt(++e.position), a === 60 ? (r = !0, a = e.input.charCodeAt(++e.position)) : a === 33 ? (n = !0, i = "!!", a = e.input.charCodeAt(++e.position)) : i = "!", t = e.position, r) {
    do
      a = e.input.charCodeAt(++e.position);
    while (a !== 0 && a !== 62);
    e.position < e.length ? (o = e.input.slice(t, e.position), a = e.input.charCodeAt(++e.position)) : L(e, "unexpected end of the stream within a verbatim tag");
  } else {
    for (; a !== 0 && !Ne(a); )
      a === 33 && (n ? L(e, "tag suffix cannot contain exclamation marks") : (i = e.input.slice(t - 1, e.position + 1), kc.test(i) || L(e, "named tag handle cannot contain such characters"), n = !0, t = e.position + 1)), a = e.input.charCodeAt(++e.position);
    o = e.input.slice(t, e.position), ng.test(o) && L(e, "tag suffix cannot contain flow indicator characters");
  }
  o && !Mc.test(o) && L(e, "tag name cannot contain such characters: " + o);
  try {
    o = decodeURIComponent(o);
  } catch {
    L(e, "tag name is malformed: " + o);
  }
  return r ? e.tag = o : pt.call(e.tagMap, i) ? e.tag = e.tagMap[i] + o : i === "!" ? e.tag = "!" + o : i === "!!" ? e.tag = "tag:yaml.org,2002:" + o : L(e, 'undeclared tag handle "' + i + '"'), !0;
}
function gg(e) {
  var t, r;
  if (r = e.input.charCodeAt(e.position), r !== 38) return !1;
  for (e.anchor !== null && L(e, "duplication of an anchor property"), r = e.input.charCodeAt(++e.position), t = e.position; r !== 0 && !Ne(r) && !Vt(r); )
    r = e.input.charCodeAt(++e.position);
  return e.position === t && L(e, "name of an anchor node must contain at least one character"), e.anchor = e.input.slice(t, e.position), !0;
}
function Eg(e) {
  var t, r, n;
  if (n = e.input.charCodeAt(e.position), n !== 42) return !1;
  for (n = e.input.charCodeAt(++e.position), t = e.position; n !== 0 && !Ne(n) && !Vt(n); )
    n = e.input.charCodeAt(++e.position);
  return e.position === t && L(e, "name of an alias node must contain at least one character"), r = e.input.slice(t, e.position), pt.call(e.anchorMap, r) || L(e, 'unidentified alias "' + r + '"'), e.result = e.anchorMap[r], le(e, !0, -1), !0;
}
function rr(e, t, r, n, i) {
  var o, a, s, l = 1, m = !1, c = !1, f, h, g, _, y, A;
  if (e.listener !== null && e.listener("open", e), e.tag = null, e.anchor = null, e.kind = null, e.result = null, o = a = s = Bn === r || Uc === r, n && le(e, !0, -1) && (m = !0, e.lineIndent > t ? l = 1 : e.lineIndent === t ? l = 0 : e.lineIndent < t && (l = -1)), l === 1)
    for (; mg(e) || gg(e); )
      le(e, !0, -1) ? (m = !0, s = o, e.lineIndent > t ? l = 1 : e.lineIndent === t ? l = 0 : e.lineIndent < t && (l = -1)) : s = !1;
  if (s && (s = m || i), (l === 1 || Bn === r) && (Mn === r || Lc === r ? y = t : y = t + 1, A = e.position - e.lineStart, l === 1 ? s && (Qa(e, A) || pg(e, A, y)) || dg(e, y) ? c = !0 : (a && hg(e, y) || ug(e, y) || fg(e, y) ? c = !0 : Eg(e) ? (c = !0, (e.tag !== null || e.anchor !== null) && L(e, "alias node should not have any properties")) : cg(e, y, Mn === r) && (c = !0, e.tag === null && (e.tag = "?")), e.anchor !== null && (e.anchorMap[e.anchor] = e.result)) : l === 0 && (c = s && Qa(e, A))), e.tag === null)
    e.anchor !== null && (e.anchorMap[e.anchor] = e.result);
  else if (e.tag === "?") {
    for (e.result !== null && e.kind !== "scalar" && L(e, 'unacceptable node kind for !<?> tag; it should be "scalar", not "' + e.kind + '"'), f = 0, h = e.implicitTypes.length; f < h; f += 1)
      if (_ = e.implicitTypes[f], _.resolve(e.result)) {
        e.result = _.construct(e.result), e.tag = _.tag, e.anchor !== null && (e.anchorMap[e.anchor] = e.result);
        break;
      }
  } else if (e.tag !== "!") {
    if (pt.call(e.typeMap[e.kind || "fallback"], e.tag))
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
function yg(e) {
  var t = e.position, r, n, i, o = !1, a;
  for (e.version = null, e.checkLineBreaks = e.legacy, e.tagMap = /* @__PURE__ */ Object.create(null), e.anchorMap = /* @__PURE__ */ Object.create(null); (a = e.input.charCodeAt(e.position)) !== 0 && (le(e, !0, -1), a = e.input.charCodeAt(e.position), !(e.lineIndent > 0 || a !== 37)); ) {
    for (o = !0, a = e.input.charCodeAt(++e.position), r = e.position; a !== 0 && !Ne(a); )
      a = e.input.charCodeAt(++e.position);
    for (n = e.input.slice(r, e.position), i = [], n.length < 1 && L(e, "directive name must not be less than one character in length"); a !== 0; ) {
      for (; Pt(a); )
        a = e.input.charCodeAt(++e.position);
      if (a === 35) {
        do
          a = e.input.charCodeAt(++e.position);
        while (a !== 0 && !ze(a));
        break;
      }
      if (ze(a)) break;
      for (r = e.position; a !== 0 && !Ne(a); )
        a = e.input.charCodeAt(++e.position);
      i.push(e.input.slice(r, e.position));
    }
    a !== 0 && xo(e), pt.call(Ka, n) ? Ka[n](e, n, i) : jn(e, 'unknown document directive "' + n + '"');
  }
  if (le(e, !0, -1), e.lineIndent === 0 && e.input.charCodeAt(e.position) === 45 && e.input.charCodeAt(e.position + 1) === 45 && e.input.charCodeAt(e.position + 2) === 45 ? (e.position += 3, le(e, !0, -1)) : o && L(e, "directives end mark is expected"), rr(e, e.lineIndent - 1, Bn, !1, !0), le(e, !0, -1), e.checkLineBreaks && rg.test(e.input.slice(t, e.position)) && jn(e, "non-ASCII line breaks are interpreted as content"), e.documents.push(e.result), e.position === e.lineStart && ei(e)) {
    e.input.charCodeAt(e.position) === 46 && (e.position += 3, le(e, !0, -1));
    return;
  }
  if (e.position < e.length - 1)
    L(e, "end of the stream or a document separator is expected");
  else
    return;
}
function qc(e, t) {
  e = String(e), t = t || {}, e.length !== 0 && (e.charCodeAt(e.length - 1) !== 10 && e.charCodeAt(e.length - 1) !== 13 && (e += `
`), e.charCodeAt(0) === 65279 && (e = e.slice(1)));
  var r = new lg(e, t), n = e.indexOf("\0");
  for (n !== -1 && (r.position = n, L(r, "null byte is not allowed in input")), r.input += "\0"; r.input.charCodeAt(r.position) === 32; )
    r.lineIndent += 1, r.position += 1;
  for (; r.position < r.length - 1; )
    yg(r);
  return r.documents;
}
function vg(e, t, r) {
  t !== null && typeof t == "object" && typeof r > "u" && (r = t, t = null);
  var n = qc(e, r);
  if (typeof t != "function")
    return n;
  for (var i = 0, o = n.length; i < o; i += 1)
    t(n[i]);
}
function wg(e, t) {
  var r = qc(e, t);
  if (r.length !== 0) {
    if (r.length === 1)
      return r[0];
    throw new xc("expected a single document in the stream, but found more");
  }
}
Do.loadAll = vg;
Do.load = wg;
var Gc = {}, ti = He, Yr = Vr, _g = Fo, Wc = Object.prototype.toString, Vc = Object.prototype.hasOwnProperty, Uo = 65279, Ag = 9, Dr = 10, Sg = 13, Tg = 32, Cg = 33, bg = 34, lo = 35, $g = 37, Og = 38, Ig = 39, Rg = 42, Yc = 44, Pg = 45, Hn = 58, Dg = 61, Ng = 62, Fg = 63, xg = 64, zc = 91, Xc = 93, Lg = 96, Kc = 123, Ug = 124, Jc = 125, Ae = {};
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
var kg = [
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
], Mg = /^[-+]?[0-9_]+(?::[0-9_]+)+(?:\.[0-9_]*)?$/;
function Bg(e, t) {
  var r, n, i, o, a, s, l;
  if (t === null) return {};
  for (r = {}, n = Object.keys(t), i = 0, o = n.length; i < o; i += 1)
    a = n[i], s = String(t[a]), a.slice(0, 2) === "!!" && (a = "tag:yaml.org,2002:" + a.slice(2)), l = e.compiledTypeMap.fallback[a], l && Vc.call(l.styleAliases, s) && (s = l.styleAliases[s]), r[a] = s;
  return r;
}
function jg(e) {
  var t, r, n;
  if (t = e.toString(16).toUpperCase(), e <= 255)
    r = "x", n = 2;
  else if (e <= 65535)
    r = "u", n = 4;
  else if (e <= 4294967295)
    r = "U", n = 8;
  else
    throw new Yr("code point within a string may not be greater than 0xFFFFFFFF");
  return "\\" + r + ti.repeat("0", n - t.length) + t;
}
var Hg = 1, Nr = 2;
function qg(e) {
  this.schema = e.schema || _g, this.indent = Math.max(1, e.indent || 2), this.noArrayIndent = e.noArrayIndent || !1, this.skipInvalid = e.skipInvalid || !1, this.flowLevel = ti.isNothing(e.flowLevel) ? -1 : e.flowLevel, this.styleMap = Bg(this.schema, e.styles || null), this.sortKeys = e.sortKeys || !1, this.lineWidth = e.lineWidth || 80, this.noRefs = e.noRefs || !1, this.noCompatMode = e.noCompatMode || !1, this.condenseFlow = e.condenseFlow || !1, this.quotingType = e.quotingType === '"' ? Nr : Hg, this.forceQuotes = e.forceQuotes || !1, this.replacer = typeof e.replacer == "function" ? e.replacer : null, this.implicitTypes = this.schema.compiledImplicit, this.explicitTypes = this.schema.compiledExplicit, this.tag = null, this.result = "", this.duplicates = [], this.usedDuplicates = null;
}
function Za(e, t) {
  for (var r = ti.repeat(" ", t), n = 0, i = -1, o = "", a, s = e.length; n < s; )
    i = e.indexOf(`
`, n), i === -1 ? (a = e.slice(n), n = s) : (a = e.slice(n, i + 1), n = i + 1), a.length && a !== `
` && (o += r), o += a;
  return o;
}
function co(e, t) {
  return `
` + ti.repeat(" ", e.indent * t);
}
function Gg(e, t) {
  var r, n, i;
  for (r = 0, n = e.implicitTypes.length; r < n; r += 1)
    if (i = e.implicitTypes[r], i.resolve(t))
      return !0;
  return !1;
}
function qn(e) {
  return e === Tg || e === Ag;
}
function Fr(e) {
  return 32 <= e && e <= 126 || 161 <= e && e <= 55295 && e !== 8232 && e !== 8233 || 57344 <= e && e <= 65533 && e !== Uo || 65536 <= e && e <= 1114111;
}
function es(e) {
  return Fr(e) && e !== Uo && e !== Sg && e !== Dr;
}
function ts(e, t, r) {
  var n = es(e), i = n && !qn(e);
  return (
    // ns-plain-safe
    (r ? (
      // c = flow-in
      n
    ) : n && e !== Yc && e !== zc && e !== Xc && e !== Kc && e !== Jc) && e !== lo && !(t === Hn && !i) || es(t) && !qn(t) && e === lo || t === Hn && i
  );
}
function Wg(e) {
  return Fr(e) && e !== Uo && !qn(e) && e !== Pg && e !== Fg && e !== Hn && e !== Yc && e !== zc && e !== Xc && e !== Kc && e !== Jc && e !== lo && e !== Og && e !== Rg && e !== Cg && e !== Ug && e !== Dg && e !== Ng && e !== Ig && e !== bg && e !== $g && e !== xg && e !== Lg;
}
function Vg(e) {
  return !qn(e) && e !== Hn;
}
function vr(e, t) {
  var r = e.charCodeAt(t), n;
  return r >= 55296 && r <= 56319 && t + 1 < e.length && (n = e.charCodeAt(t + 1), n >= 56320 && n <= 57343) ? (r - 55296) * 1024 + n - 56320 + 65536 : r;
}
function Qc(e) {
  var t = /^\n* /;
  return t.test(e);
}
var Zc = 1, uo = 2, eu = 3, tu = 4, Wt = 5;
function Yg(e, t, r, n, i, o, a, s) {
  var l, m = 0, c = null, f = !1, h = !1, g = n !== -1, _ = -1, y = Wg(vr(e, 0)) && Vg(vr(e, e.length - 1));
  if (t || a)
    for (l = 0; l < e.length; m >= 65536 ? l += 2 : l++) {
      if (m = vr(e, l), !Fr(m))
        return Wt;
      y = y && ts(m, c, s), c = m;
    }
  else {
    for (l = 0; l < e.length; m >= 65536 ? l += 2 : l++) {
      if (m = vr(e, l), m === Dr)
        f = !0, g && (h = h || // Foldable line = too long, and not more-indented.
        l - _ - 1 > n && e[_ + 1] !== " ", _ = l);
      else if (!Fr(m))
        return Wt;
      y = y && ts(m, c, s), c = m;
    }
    h = h || g && l - _ - 1 > n && e[_ + 1] !== " ";
  }
  return !f && !h ? y && !a && !i(e) ? Zc : o === Nr ? Wt : uo : r > 9 && Qc(e) ? Wt : a ? o === Nr ? Wt : uo : h ? tu : eu;
}
function zg(e, t, r, n, i) {
  e.dump = function() {
    if (t.length === 0)
      return e.quotingType === Nr ? '""' : "''";
    if (!e.noCompatMode && (kg.indexOf(t) !== -1 || Mg.test(t)))
      return e.quotingType === Nr ? '"' + t + '"' : "'" + t + "'";
    var o = e.indent * Math.max(1, r), a = e.lineWidth === -1 ? -1 : Math.max(Math.min(e.lineWidth, 40), e.lineWidth - o), s = n || e.flowLevel > -1 && r >= e.flowLevel;
    function l(m) {
      return Gg(e, m);
    }
    switch (Yg(
      t,
      s,
      e.indent,
      a,
      l,
      e.quotingType,
      e.forceQuotes && !n,
      i
    )) {
      case Zc:
        return t;
      case uo:
        return "'" + t.replace(/'/g, "''") + "'";
      case eu:
        return "|" + rs(t, e.indent) + ns(Za(t, o));
      case tu:
        return ">" + rs(t, e.indent) + ns(Za(Xg(t, a), o));
      case Wt:
        return '"' + Kg(t) + '"';
      default:
        throw new Yr("impossible error: invalid scalar style");
    }
  }();
}
function rs(e, t) {
  var r = Qc(e) ? String(t) : "", n = e[e.length - 1] === `
`, i = n && (e[e.length - 2] === `
` || e === `
`), o = i ? "+" : n ? "" : "-";
  return r + o + `
`;
}
function ns(e) {
  return e[e.length - 1] === `
` ? e.slice(0, -1) : e;
}
function Xg(e, t) {
  for (var r = /(\n+)([^\n]*)/g, n = function() {
    var m = e.indexOf(`
`);
    return m = m !== -1 ? m : e.length, r.lastIndex = m, is(e.slice(0, m), t);
  }(), i = e[0] === `
` || e[0] === " ", o, a; a = r.exec(e); ) {
    var s = a[1], l = a[2];
    o = l[0] === " ", n += s + (!i && !o && l !== "" ? `
` : "") + is(l, t), i = o;
  }
  return n;
}
function is(e, t) {
  if (e === "" || e[0] === " ") return e;
  for (var r = / [^ ]/g, n, i = 0, o, a = 0, s = 0, l = ""; n = r.exec(e); )
    s = n.index, s - i > t && (o = a > i ? a : s, l += `
` + e.slice(i, o), i = o + 1), a = s;
  return l += `
`, e.length - i > t && a > i ? l += e.slice(i, a) + `
` + e.slice(a + 1) : l += e.slice(i), l.slice(1);
}
function Kg(e) {
  for (var t = "", r = 0, n, i = 0; i < e.length; r >= 65536 ? i += 2 : i++)
    r = vr(e, i), n = Ae[r], !n && Fr(r) ? (t += e[i], r >= 65536 && (t += e[i + 1])) : t += n || jg(r);
  return t;
}
function Jg(e, t, r) {
  var n = "", i = e.tag, o, a, s;
  for (o = 0, a = r.length; o < a; o += 1)
    s = r[o], e.replacer && (s = e.replacer.call(r, String(o), s)), (et(e, t, s, !1, !1) || typeof s > "u" && et(e, t, null, !1, !1)) && (n !== "" && (n += "," + (e.condenseFlow ? "" : " ")), n += e.dump);
  e.tag = i, e.dump = "[" + n + "]";
}
function os(e, t, r, n) {
  var i = "", o = e.tag, a, s, l;
  for (a = 0, s = r.length; a < s; a += 1)
    l = r[a], e.replacer && (l = e.replacer.call(r, String(a), l)), (et(e, t + 1, l, !0, !0, !1, !0) || typeof l > "u" && et(e, t + 1, null, !0, !0, !1, !0)) && ((!n || i !== "") && (i += co(e, t)), e.dump && Dr === e.dump.charCodeAt(0) ? i += "-" : i += "- ", i += e.dump);
  e.tag = o, e.dump = i || "[]";
}
function Qg(e, t, r) {
  var n = "", i = e.tag, o = Object.keys(r), a, s, l, m, c;
  for (a = 0, s = o.length; a < s; a += 1)
    c = "", n !== "" && (c += ", "), e.condenseFlow && (c += '"'), l = o[a], m = r[l], e.replacer && (m = e.replacer.call(r, l, m)), et(e, t, l, !1, !1) && (e.dump.length > 1024 && (c += "? "), c += e.dump + (e.condenseFlow ? '"' : "") + ":" + (e.condenseFlow ? "" : " "), et(e, t, m, !1, !1) && (c += e.dump, n += c));
  e.tag = i, e.dump = "{" + n + "}";
}
function Zg(e, t, r, n) {
  var i = "", o = e.tag, a = Object.keys(r), s, l, m, c, f, h;
  if (e.sortKeys === !0)
    a.sort();
  else if (typeof e.sortKeys == "function")
    a.sort(e.sortKeys);
  else if (e.sortKeys)
    throw new Yr("sortKeys must be a boolean or a function");
  for (s = 0, l = a.length; s < l; s += 1)
    h = "", (!n || i !== "") && (h += co(e, t)), m = a[s], c = r[m], e.replacer && (c = e.replacer.call(r, m, c)), et(e, t + 1, m, !0, !0, !0) && (f = e.tag !== null && e.tag !== "?" || e.dump && e.dump.length > 1024, f && (e.dump && Dr === e.dump.charCodeAt(0) ? h += "?" : h += "? "), h += e.dump, f && (h += co(e, t)), et(e, t + 1, c, !0, f) && (e.dump && Dr === e.dump.charCodeAt(0) ? h += ":" : h += ": ", h += e.dump, i += h));
  e.tag = o, e.dump = i || "{}";
}
function as(e, t, r) {
  var n, i, o, a, s, l;
  for (i = r ? e.explicitTypes : e.implicitTypes, o = 0, a = i.length; o < a; o += 1)
    if (s = i[o], (s.instanceOf || s.predicate) && (!s.instanceOf || typeof t == "object" && t instanceof s.instanceOf) && (!s.predicate || s.predicate(t))) {
      if (r ? s.multi && s.representName ? e.tag = s.representName(t) : e.tag = s.tag : e.tag = "?", s.represent) {
        if (l = e.styleMap[s.tag] || s.defaultStyle, Wc.call(s.represent) === "[object Function]")
          n = s.represent(t, l);
        else if (Vc.call(s.represent, l))
          n = s.represent[l](t, l);
        else
          throw new Yr("!<" + s.tag + '> tag resolver accepts not "' + l + '" style');
        e.dump = n;
      }
      return !0;
    }
  return !1;
}
function et(e, t, r, n, i, o, a) {
  e.tag = null, e.dump = r, as(e, r, !1) || as(e, r, !0);
  var s = Wc.call(e.dump), l = n, m;
  n && (n = e.flowLevel < 0 || e.flowLevel > t);
  var c = s === "[object Object]" || s === "[object Array]", f, h;
  if (c && (f = e.duplicates.indexOf(r), h = f !== -1), (e.tag !== null && e.tag !== "?" || h || e.indent !== 2 && t > 0) && (i = !1), h && e.usedDuplicates[f])
    e.dump = "*ref_" + f;
  else {
    if (c && h && !e.usedDuplicates[f] && (e.usedDuplicates[f] = !0), s === "[object Object]")
      n && Object.keys(e.dump).length !== 0 ? (Zg(e, t, e.dump, i), h && (e.dump = "&ref_" + f + e.dump)) : (Qg(e, t, e.dump), h && (e.dump = "&ref_" + f + " " + e.dump));
    else if (s === "[object Array]")
      n && e.dump.length !== 0 ? (e.noArrayIndent && !a && t > 0 ? os(e, t - 1, e.dump, i) : os(e, t, e.dump, i), h && (e.dump = "&ref_" + f + e.dump)) : (Jg(e, t, e.dump), h && (e.dump = "&ref_" + f + " " + e.dump));
    else if (s === "[object String]")
      e.tag !== "?" && zg(e, e.dump, t, o, l);
    else {
      if (s === "[object Undefined]")
        return !1;
      if (e.skipInvalid) return !1;
      throw new Yr("unacceptable kind of an object to dump " + s);
    }
    e.tag !== null && e.tag !== "?" && (m = encodeURI(
      e.tag[0] === "!" ? e.tag.slice(1) : e.tag
    ).replace(/!/g, "%21"), e.tag[0] === "!" ? m = "!" + m : m.slice(0, 18) === "tag:yaml.org,2002:" ? m = "!!" + m.slice(18) : m = "!<" + m + ">", e.dump = m + " " + e.dump);
  }
  return !0;
}
function e0(e, t) {
  var r = [], n = [], i, o;
  for (fo(e, r, n), i = 0, o = n.length; i < o; i += 1)
    t.duplicates.push(r[n[i]]);
  t.usedDuplicates = new Array(o);
}
function fo(e, t, r) {
  var n, i, o;
  if (e !== null && typeof e == "object")
    if (i = t.indexOf(e), i !== -1)
      r.indexOf(i) === -1 && r.push(i);
    else if (t.push(e), Array.isArray(e))
      for (i = 0, o = e.length; i < o; i += 1)
        fo(e[i], t, r);
    else
      for (n = Object.keys(e), i = 0, o = n.length; i < o; i += 1)
        fo(e[n[i]], t, r);
}
function t0(e, t) {
  t = t || {};
  var r = new qg(t);
  r.noRefs || e0(e, r);
  var n = e;
  return r.replacer && (n = r.replacer.call({ "": n }, "", n)), et(r, 0, n, !0, !0) ? r.dump + `
` : "";
}
Gc.dump = t0;
var ru = Do, r0 = Gc;
function ko(e, t) {
  return function() {
    throw new Error("Function yaml." + e + " is removed in js-yaml 4. Use yaml." + t + " instead, which is now safe by default.");
  };
}
ye.Type = Ie;
ye.Schema = mc;
ye.FAILSAFE_SCHEMA = vc;
ye.JSON_SCHEMA = Cc;
ye.CORE_SCHEMA = bc;
ye.DEFAULT_SCHEMA = Fo;
ye.load = ru.load;
ye.loadAll = ru.loadAll;
ye.dump = r0.dump;
ye.YAMLException = Vr;
ye.types = {
  binary: Pc,
  float: Tc,
  map: yc,
  null: wc,
  pairs: Nc,
  set: Fc,
  timestamp: Ic,
  bool: _c,
  int: Ac,
  merge: Rc,
  omap: Dc,
  seq: Ec,
  str: gc
};
ye.safeLoad = ko("safeLoad", "load");
ye.safeLoadAll = ko("safeLoadAll", "loadAll");
ye.safeDump = ko("safeDump", "dump");
var ri = {};
Object.defineProperty(ri, "__esModule", { value: !0 });
ri.Lazy = void 0;
class n0 {
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
ri.Lazy = n0;
var ho = { exports: {} };
const i0 = "2.0.0", nu = 256, o0 = Number.MAX_SAFE_INTEGER || /* istanbul ignore next */
9007199254740991, a0 = 16, s0 = nu - 6, l0 = [
  "major",
  "premajor",
  "minor",
  "preminor",
  "patch",
  "prepatch",
  "prerelease"
];
var ni = {
  MAX_LENGTH: nu,
  MAX_SAFE_COMPONENT_LENGTH: a0,
  MAX_SAFE_BUILD_LENGTH: s0,
  MAX_SAFE_INTEGER: o0,
  RELEASE_TYPES: l0,
  SEMVER_SPEC_VERSION: i0,
  FLAG_INCLUDE_PRERELEASE: 1,
  FLAG_LOOSE: 2
};
const c0 = typeof process == "object" && process.env && process.env.NODE_DEBUG && /\bsemver\b/i.test(process.env.NODE_DEBUG) ? (...e) => console.error("SEMVER", ...e) : () => {
};
var ii = c0;
(function(e, t) {
  const {
    MAX_SAFE_COMPONENT_LENGTH: r,
    MAX_SAFE_BUILD_LENGTH: n,
    MAX_LENGTH: i
  } = ni, o = ii;
  t = e.exports = {};
  const a = t.re = [], s = t.safeRe = [], l = t.src = [], m = t.safeSrc = [], c = t.t = {};
  let f = 0;
  const h = "[a-zA-Z0-9-]", g = [
    ["\\s", 1],
    ["\\d", i],
    [h, n]
  ], _ = (A) => {
    for (const [T, S] of g)
      A = A.split(`${T}*`).join(`${T}{0,${S}}`).split(`${T}+`).join(`${T}{1,${S}}`);
    return A;
  }, y = (A, T, S) => {
    const N = _(T), x = f++;
    o(A, x, T), c[A] = x, l[x] = T, m[x] = N, a[x] = new RegExp(T, S ? "g" : void 0), s[x] = new RegExp(N, S ? "g" : void 0);
  };
  y("NUMERICIDENTIFIER", "0|[1-9]\\d*"), y("NUMERICIDENTIFIERLOOSE", "\\d+"), y("NONNUMERICIDENTIFIER", `\\d*[a-zA-Z-]${h}*`), y("MAINVERSION", `(${l[c.NUMERICIDENTIFIER]})\\.(${l[c.NUMERICIDENTIFIER]})\\.(${l[c.NUMERICIDENTIFIER]})`), y("MAINVERSIONLOOSE", `(${l[c.NUMERICIDENTIFIERLOOSE]})\\.(${l[c.NUMERICIDENTIFIERLOOSE]})\\.(${l[c.NUMERICIDENTIFIERLOOSE]})`), y("PRERELEASEIDENTIFIER", `(?:${l[c.NONNUMERICIDENTIFIER]}|${l[c.NUMERICIDENTIFIER]})`), y("PRERELEASEIDENTIFIERLOOSE", `(?:${l[c.NONNUMERICIDENTIFIER]}|${l[c.NUMERICIDENTIFIERLOOSE]})`), y("PRERELEASE", `(?:-(${l[c.PRERELEASEIDENTIFIER]}(?:\\.${l[c.PRERELEASEIDENTIFIER]})*))`), y("PRERELEASELOOSE", `(?:-?(${l[c.PRERELEASEIDENTIFIERLOOSE]}(?:\\.${l[c.PRERELEASEIDENTIFIERLOOSE]})*))`), y("BUILDIDENTIFIER", `${h}+`), y("BUILD", `(?:\\+(${l[c.BUILDIDENTIFIER]}(?:\\.${l[c.BUILDIDENTIFIER]})*))`), y("FULLPLAIN", `v?${l[c.MAINVERSION]}${l[c.PRERELEASE]}?${l[c.BUILD]}?`), y("FULL", `^${l[c.FULLPLAIN]}$`), y("LOOSEPLAIN", `[v=\\s]*${l[c.MAINVERSIONLOOSE]}${l[c.PRERELEASELOOSE]}?${l[c.BUILD]}?`), y("LOOSE", `^${l[c.LOOSEPLAIN]}$`), y("GTLT", "((?:<|>)?=?)"), y("XRANGEIDENTIFIERLOOSE", `${l[c.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`), y("XRANGEIDENTIFIER", `${l[c.NUMERICIDENTIFIER]}|x|X|\\*`), y("XRANGEPLAIN", `[v=\\s]*(${l[c.XRANGEIDENTIFIER]})(?:\\.(${l[c.XRANGEIDENTIFIER]})(?:\\.(${l[c.XRANGEIDENTIFIER]})(?:${l[c.PRERELEASE]})?${l[c.BUILD]}?)?)?`), y("XRANGEPLAINLOOSE", `[v=\\s]*(${l[c.XRANGEIDENTIFIERLOOSE]})(?:\\.(${l[c.XRANGEIDENTIFIERLOOSE]})(?:\\.(${l[c.XRANGEIDENTIFIERLOOSE]})(?:${l[c.PRERELEASELOOSE]})?${l[c.BUILD]}?)?)?`), y("XRANGE", `^${l[c.GTLT]}\\s*${l[c.XRANGEPLAIN]}$`), y("XRANGELOOSE", `^${l[c.GTLT]}\\s*${l[c.XRANGEPLAINLOOSE]}$`), y("COERCEPLAIN", `(^|[^\\d])(\\d{1,${r}})(?:\\.(\\d{1,${r}}))?(?:\\.(\\d{1,${r}}))?`), y("COERCE", `${l[c.COERCEPLAIN]}(?:$|[^\\d])`), y("COERCEFULL", l[c.COERCEPLAIN] + `(?:${l[c.PRERELEASE]})?(?:${l[c.BUILD]})?(?:$|[^\\d])`), y("COERCERTL", l[c.COERCE], !0), y("COERCERTLFULL", l[c.COERCEFULL], !0), y("LONETILDE", "(?:~>?)"), y("TILDETRIM", `(\\s*)${l[c.LONETILDE]}\\s+`, !0), t.tildeTrimReplace = "$1~", y("TILDE", `^${l[c.LONETILDE]}${l[c.XRANGEPLAIN]}$`), y("TILDELOOSE", `^${l[c.LONETILDE]}${l[c.XRANGEPLAINLOOSE]}$`), y("LONECARET", "(?:\\^)"), y("CARETTRIM", `(\\s*)${l[c.LONECARET]}\\s+`, !0), t.caretTrimReplace = "$1^", y("CARET", `^${l[c.LONECARET]}${l[c.XRANGEPLAIN]}$`), y("CARETLOOSE", `^${l[c.LONECARET]}${l[c.XRANGEPLAINLOOSE]}$`), y("COMPARATORLOOSE", `^${l[c.GTLT]}\\s*(${l[c.LOOSEPLAIN]})$|^$`), y("COMPARATOR", `^${l[c.GTLT]}\\s*(${l[c.FULLPLAIN]})$|^$`), y("COMPARATORTRIM", `(\\s*)${l[c.GTLT]}\\s*(${l[c.LOOSEPLAIN]}|${l[c.XRANGEPLAIN]})`, !0), t.comparatorTrimReplace = "$1$2$3", y("HYPHENRANGE", `^\\s*(${l[c.XRANGEPLAIN]})\\s+-\\s+(${l[c.XRANGEPLAIN]})\\s*$`), y("HYPHENRANGELOOSE", `^\\s*(${l[c.XRANGEPLAINLOOSE]})\\s+-\\s+(${l[c.XRANGEPLAINLOOSE]})\\s*$`), y("STAR", "(<|>)?=?\\s*\\*"), y("GTE0", "^\\s*>=\\s*0\\.0\\.0\\s*$"), y("GTE0PRE", "^\\s*>=\\s*0\\.0\\.0-0\\s*$");
})(ho, ho.exports);
var zr = ho.exports;
const u0 = Object.freeze({ loose: !0 }), f0 = Object.freeze({}), d0 = (e) => e ? typeof e != "object" ? u0 : e : f0;
var Mo = d0;
const ss = /^[0-9]+$/, iu = (e, t) => {
  if (typeof e == "number" && typeof t == "number")
    return e === t ? 0 : e < t ? -1 : 1;
  const r = ss.test(e), n = ss.test(t);
  return r && n && (e = +e, t = +t), e === t ? 0 : r && !n ? -1 : n && !r ? 1 : e < t ? -1 : 1;
}, h0 = (e, t) => iu(t, e);
var ou = {
  compareIdentifiers: iu,
  rcompareIdentifiers: h0
};
const gn = ii, { MAX_LENGTH: ls, MAX_SAFE_INTEGER: En } = ni, { safeRe: yn, t: vn } = zr, p0 = Mo, { compareIdentifiers: Li } = ou;
let m0 = class Ye {
  constructor(t, r) {
    if (r = p0(r), t instanceof Ye) {
      if (t.loose === !!r.loose && t.includePrerelease === !!r.includePrerelease)
        return t;
      t = t.version;
    } else if (typeof t != "string")
      throw new TypeError(`Invalid version. Must be a string. Got type "${typeof t}".`);
    if (t.length > ls)
      throw new TypeError(
        `version is longer than ${ls} characters`
      );
    gn("SemVer", t, r), this.options = r, this.loose = !!r.loose, this.includePrerelease = !!r.includePrerelease;
    const n = t.trim().match(r.loose ? yn[vn.LOOSE] : yn[vn.FULL]);
    if (!n)
      throw new TypeError(`Invalid Version: ${t}`);
    if (this.raw = t, this.major = +n[1], this.minor = +n[2], this.patch = +n[3], this.major > En || this.major < 0)
      throw new TypeError("Invalid major version");
    if (this.minor > En || this.minor < 0)
      throw new TypeError("Invalid minor version");
    if (this.patch > En || this.patch < 0)
      throw new TypeError("Invalid patch version");
    n[4] ? this.prerelease = n[4].split(".").map((i) => {
      if (/^[0-9]+$/.test(i)) {
        const o = +i;
        if (o >= 0 && o < En)
          return o;
      }
      return i;
    }) : this.prerelease = [], this.build = n[5] ? n[5].split(".") : [], this.format();
  }
  format() {
    return this.version = `${this.major}.${this.minor}.${this.patch}`, this.prerelease.length && (this.version += `-${this.prerelease.join(".")}`), this.version;
  }
  toString() {
    return this.version;
  }
  compare(t) {
    if (gn("SemVer.compare", this.version, this.options, t), !(t instanceof Ye)) {
      if (typeof t == "string" && t === this.version)
        return 0;
      t = new Ye(t, this.options);
    }
    return t.version === this.version ? 0 : this.compareMain(t) || this.comparePre(t);
  }
  compareMain(t) {
    return t instanceof Ye || (t = new Ye(t, this.options)), this.major < t.major ? -1 : this.major > t.major ? 1 : this.minor < t.minor ? -1 : this.minor > t.minor ? 1 : this.patch < t.patch ? -1 : this.patch > t.patch ? 1 : 0;
  }
  comparePre(t) {
    if (t instanceof Ye || (t = new Ye(t, this.options)), this.prerelease.length && !t.prerelease.length)
      return -1;
    if (!this.prerelease.length && t.prerelease.length)
      return 1;
    if (!this.prerelease.length && !t.prerelease.length)
      return 0;
    let r = 0;
    do {
      const n = this.prerelease[r], i = t.prerelease[r];
      if (gn("prerelease compare", r, n, i), n === void 0 && i === void 0)
        return 0;
      if (i === void 0)
        return 1;
      if (n === void 0)
        return -1;
      if (n === i)
        continue;
      return Li(n, i);
    } while (++r);
  }
  compareBuild(t) {
    t instanceof Ye || (t = new Ye(t, this.options));
    let r = 0;
    do {
      const n = this.build[r], i = t.build[r];
      if (gn("build compare", r, n, i), n === void 0 && i === void 0)
        return 0;
      if (i === void 0)
        return 1;
      if (n === void 0)
        return -1;
      if (n === i)
        continue;
      return Li(n, i);
    } while (++r);
  }
  // preminor will bump the version up to the next minor release, and immediately
  // down to pre-release. premajor and prepatch work the same way.
  inc(t, r, n) {
    if (t.startsWith("pre")) {
      if (!r && n === !1)
        throw new Error("invalid increment argument: identifier is empty");
      if (r) {
        const i = `-${r}`.match(this.options.loose ? yn[vn.PRERELEASELOOSE] : yn[vn.PRERELEASE]);
        if (!i || i[1] !== r)
          throw new Error(`invalid identifier: ${r}`);
      }
    }
    switch (t) {
      case "premajor":
        this.prerelease.length = 0, this.patch = 0, this.minor = 0, this.major++, this.inc("pre", r, n);
        break;
      case "preminor":
        this.prerelease.length = 0, this.patch = 0, this.minor++, this.inc("pre", r, n);
        break;
      case "prepatch":
        this.prerelease.length = 0, this.inc("patch", r, n), this.inc("pre", r, n);
        break;
      case "prerelease":
        this.prerelease.length === 0 && this.inc("patch", r, n), this.inc("pre", r, n);
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
        const i = Number(n) ? 1 : 0;
        if (this.prerelease.length === 0)
          this.prerelease = [i];
        else {
          let o = this.prerelease.length;
          for (; --o >= 0; )
            typeof this.prerelease[o] == "number" && (this.prerelease[o]++, o = -2);
          if (o === -1) {
            if (r === this.prerelease.join(".") && n === !1)
              throw new Error("invalid increment argument: identifier already exists");
            this.prerelease.push(i);
          }
        }
        if (r) {
          let o = [r, i];
          n === !1 && (o = [r]), Li(this.prerelease[0], r) === 0 ? isNaN(this.prerelease[1]) && (this.prerelease = o) : this.prerelease = o;
        }
        break;
      }
      default:
        throw new Error(`invalid increment argument: ${t}`);
    }
    return this.raw = this.format(), this.build.length && (this.raw += `+${this.build.join(".")}`), this;
  }
};
var Re = m0;
const cs = Re, g0 = (e, t, r = !1) => {
  if (e instanceof cs)
    return e;
  try {
    return new cs(e, t);
  } catch (n) {
    if (!r)
      return null;
    throw n;
  }
};
var ar = g0;
const E0 = ar, y0 = (e, t) => {
  const r = E0(e, t);
  return r ? r.version : null;
};
var v0 = y0;
const w0 = ar, _0 = (e, t) => {
  const r = w0(e.trim().replace(/^[=v]+/, ""), t);
  return r ? r.version : null;
};
var A0 = _0;
const us = Re, S0 = (e, t, r, n, i) => {
  typeof r == "string" && (i = n, n = r, r = void 0);
  try {
    return new us(
      e instanceof us ? e.version : e,
      r
    ).inc(t, n, i).version;
  } catch {
    return null;
  }
};
var T0 = S0;
const fs = ar, C0 = (e, t) => {
  const r = fs(e, null, !0), n = fs(t, null, !0), i = r.compare(n);
  if (i === 0)
    return null;
  const o = i > 0, a = o ? r : n, s = o ? n : r, l = !!a.prerelease.length;
  if (!!s.prerelease.length && !l) {
    if (!s.patch && !s.minor)
      return "major";
    if (s.compareMain(a) === 0)
      return s.minor && !s.patch ? "minor" : "patch";
  }
  const c = l ? "pre" : "";
  return r.major !== n.major ? c + "major" : r.minor !== n.minor ? c + "minor" : r.patch !== n.patch ? c + "patch" : "prerelease";
};
var b0 = C0;
const $0 = Re, O0 = (e, t) => new $0(e, t).major;
var I0 = O0;
const R0 = Re, P0 = (e, t) => new R0(e, t).minor;
var D0 = P0;
const N0 = Re, F0 = (e, t) => new N0(e, t).patch;
var x0 = F0;
const L0 = ar, U0 = (e, t) => {
  const r = L0(e, t);
  return r && r.prerelease.length ? r.prerelease : null;
};
var k0 = U0;
const ds = Re, M0 = (e, t, r) => new ds(e, r).compare(new ds(t, r));
var qe = M0;
const B0 = qe, j0 = (e, t, r) => B0(t, e, r);
var H0 = j0;
const q0 = qe, G0 = (e, t) => q0(e, t, !0);
var W0 = G0;
const hs = Re, V0 = (e, t, r) => {
  const n = new hs(e, r), i = new hs(t, r);
  return n.compare(i) || n.compareBuild(i);
};
var Bo = V0;
const Y0 = Bo, z0 = (e, t) => e.sort((r, n) => Y0(r, n, t));
var X0 = z0;
const K0 = Bo, J0 = (e, t) => e.sort((r, n) => K0(n, r, t));
var Q0 = J0;
const Z0 = qe, eE = (e, t, r) => Z0(e, t, r) > 0;
var oi = eE;
const tE = qe, rE = (e, t, r) => tE(e, t, r) < 0;
var jo = rE;
const nE = qe, iE = (e, t, r) => nE(e, t, r) === 0;
var au = iE;
const oE = qe, aE = (e, t, r) => oE(e, t, r) !== 0;
var su = aE;
const sE = qe, lE = (e, t, r) => sE(e, t, r) >= 0;
var Ho = lE;
const cE = qe, uE = (e, t, r) => cE(e, t, r) <= 0;
var qo = uE;
const fE = au, dE = su, hE = oi, pE = Ho, mE = jo, gE = qo, EE = (e, t, r, n) => {
  switch (t) {
    case "===":
      return typeof e == "object" && (e = e.version), typeof r == "object" && (r = r.version), e === r;
    case "!==":
      return typeof e == "object" && (e = e.version), typeof r == "object" && (r = r.version), e !== r;
    case "":
    case "=":
    case "==":
      return fE(e, r, n);
    case "!=":
      return dE(e, r, n);
    case ">":
      return hE(e, r, n);
    case ">=":
      return pE(e, r, n);
    case "<":
      return mE(e, r, n);
    case "<=":
      return gE(e, r, n);
    default:
      throw new TypeError(`Invalid operator: ${t}`);
  }
};
var lu = EE;
const yE = Re, vE = ar, { safeRe: wn, t: _n } = zr, wE = (e, t) => {
  if (e instanceof yE)
    return e;
  if (typeof e == "number" && (e = String(e)), typeof e != "string")
    return null;
  t = t || {};
  let r = null;
  if (!t.rtl)
    r = e.match(t.includePrerelease ? wn[_n.COERCEFULL] : wn[_n.COERCE]);
  else {
    const l = t.includePrerelease ? wn[_n.COERCERTLFULL] : wn[_n.COERCERTL];
    let m;
    for (; (m = l.exec(e)) && (!r || r.index + r[0].length !== e.length); )
      (!r || m.index + m[0].length !== r.index + r[0].length) && (r = m), l.lastIndex = m.index + m[1].length + m[2].length;
    l.lastIndex = -1;
  }
  if (r === null)
    return null;
  const n = r[2], i = r[3] || "0", o = r[4] || "0", a = t.includePrerelease && r[5] ? `-${r[5]}` : "", s = t.includePrerelease && r[6] ? `+${r[6]}` : "";
  return vE(`${n}.${i}.${o}${a}${s}`, t);
};
var _E = wE;
class AE {
  constructor() {
    this.max = 1e3, this.map = /* @__PURE__ */ new Map();
  }
  get(t) {
    const r = this.map.get(t);
    if (r !== void 0)
      return this.map.delete(t), this.map.set(t, r), r;
  }
  delete(t) {
    return this.map.delete(t);
  }
  set(t, r) {
    if (!this.delete(t) && r !== void 0) {
      if (this.map.size >= this.max) {
        const i = this.map.keys().next().value;
        this.delete(i);
      }
      this.map.set(t, r);
    }
    return this;
  }
}
var SE = AE, Ui, ps;
function Ge() {
  if (ps) return Ui;
  ps = 1;
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
      const b = ((this.options.includePrerelease && g) | (this.options.loose && _)) + ":" + $, D = n.get(b);
      if (D)
        return D;
      const R = this.options.loose, k = R ? l[m.HYPHENRANGELOOSE] : l[m.HYPHENRANGE];
      $ = $.replace(k, M(this.options.includePrerelease)), a("hyphen replace", $), $ = $.replace(l[m.COMPARATORTRIM], c), a("comparator trim", $), $ = $.replace(l[m.TILDETRIM], f), a("tilde trim", $), $ = $.replace(l[m.CARETTRIM], h), a("caret trim", $);
      let G = $.split(" ").map((U) => S(U, this.options)).join(" ").split(/\s+/).map((U) => B(U, this.options));
      R && (G = G.filter((U) => (a("loose invalid filter", U, this.options), !!U.match(l[m.COMPARATORLOOSE])))), a("range list", G);
      const j = /* @__PURE__ */ new Map(), X = G.map((U) => new o(U, this.options));
      for (const U of X) {
        if (y(U))
          return [U];
        j.set(U.value, U);
      }
      j.size > 1 && j.has("") && j.delete("");
      const fe = [...j.values()];
      return n.set(b, fe), fe;
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
        if (z(this.set[P], $, this.options))
          return !0;
      return !1;
    }
  }
  Ui = t;
  const r = SE, n = new r(), i = Mo, o = ai(), a = ii, s = Re, {
    safeRe: l,
    t: m,
    comparatorTrimReplace: c,
    tildeTrimReplace: f,
    caretTrimReplace: h
  } = zr, { FLAG_INCLUDE_PRERELEASE: g, FLAG_LOOSE: _ } = ni, y = (I) => I.value === "<0.0.0-0", A = (I) => I.value === "", T = (I, $) => {
    let P = !0;
    const b = I.slice();
    let D = b.pop();
    for (; P && b.length; )
      P = b.every((R) => D.intersects(R, $)), D = b.pop();
    return P;
  }, S = (I, $) => (I = I.replace(l[m.BUILD], ""), a("comp", I, $), I = oe(I, $), a("caret", I), I = x(I, $), a("tildes", I), I = Fe(I, $), a("xrange", I), I = q(I, $), a("stars", I), I), N = (I) => !I || I.toLowerCase() === "x" || I === "*", x = (I, $) => I.trim().split(/\s+/).map((P) => Q(P, $)).join(" "), Q = (I, $) => {
    const P = $.loose ? l[m.TILDELOOSE] : l[m.TILDE];
    return I.replace(P, (b, D, R, k, G) => {
      a("tilde", I, b, D, R, k, G);
      let j;
      return N(D) ? j = "" : N(R) ? j = `>=${D}.0.0 <${+D + 1}.0.0-0` : N(k) ? j = `>=${D}.${R}.0 <${D}.${+R + 1}.0-0` : G ? (a("replaceTilde pr", G), j = `>=${D}.${R}.${k}-${G} <${D}.${+R + 1}.0-0`) : j = `>=${D}.${R}.${k} <${D}.${+R + 1}.0-0`, a("tilde return", j), j;
    });
  }, oe = (I, $) => I.trim().split(/\s+/).map((P) => V(P, $)).join(" "), V = (I, $) => {
    a("caret", I, $);
    const P = $.loose ? l[m.CARETLOOSE] : l[m.CARET], b = $.includePrerelease ? "-0" : "";
    return I.replace(P, (D, R, k, G, j) => {
      a("caret", I, D, R, k, G, j);
      let X;
      return N(R) ? X = "" : N(k) ? X = `>=${R}.0.0${b} <${+R + 1}.0.0-0` : N(G) ? R === "0" ? X = `>=${R}.${k}.0${b} <${R}.${+k + 1}.0-0` : X = `>=${R}.${k}.0${b} <${+R + 1}.0.0-0` : j ? (a("replaceCaret pr", j), R === "0" ? k === "0" ? X = `>=${R}.${k}.${G}-${j} <${R}.${k}.${+G + 1}-0` : X = `>=${R}.${k}.${G}-${j} <${R}.${+k + 1}.0-0` : X = `>=${R}.${k}.${G}-${j} <${+R + 1}.0.0-0`) : (a("no pr"), R === "0" ? k === "0" ? X = `>=${R}.${k}.${G}${b} <${R}.${k}.${+G + 1}-0` : X = `>=${R}.${k}.${G}${b} <${R}.${+k + 1}.0-0` : X = `>=${R}.${k}.${G} <${+R + 1}.0.0-0`), a("caret return", X), X;
    });
  }, Fe = (I, $) => (a("replaceXRanges", I, $), I.split(/\s+/).map((P) => E(P, $)).join(" ")), E = (I, $) => {
    I = I.trim();
    const P = $.loose ? l[m.XRANGELOOSE] : l[m.XRANGE];
    return I.replace(P, (b, D, R, k, G, j) => {
      a("xRange", I, b, D, R, k, G, j);
      const X = N(R), fe = X || N(k), U = fe || N(G), We = U;
      return D === "=" && We && (D = ""), j = $.includePrerelease ? "-0" : "", X ? D === ">" || D === "<" ? b = "<0.0.0-0" : b = "*" : D && We ? (fe && (k = 0), G = 0, D === ">" ? (D = ">=", fe ? (R = +R + 1, k = 0, G = 0) : (k = +k + 1, G = 0)) : D === "<=" && (D = "<", fe ? R = +R + 1 : k = +k + 1), D === "<" && (j = "-0"), b = `${D + R}.${k}.${G}${j}`) : fe ? b = `>=${R}.0.0${j} <${+R + 1}.0.0-0` : U && (b = `>=${R}.${k}.0${j} <${R}.${+k + 1}.0-0`), a("xRange return", b), b;
    });
  }, q = (I, $) => (a("replaceStars", I, $), I.trim().replace(l[m.STAR], "")), B = (I, $) => (a("replaceGTE0", I, $), I.trim().replace(l[$.includePrerelease ? m.GTE0PRE : m.GTE0], "")), M = (I) => ($, P, b, D, R, k, G, j, X, fe, U, We) => (N(b) ? P = "" : N(D) ? P = `>=${b}.0.0${I ? "-0" : ""}` : N(R) ? P = `>=${b}.${D}.0${I ? "-0" : ""}` : k ? P = `>=${P}` : P = `>=${P}${I ? "-0" : ""}`, N(X) ? j = "" : N(fe) ? j = `<${+X + 1}.0.0-0` : N(U) ? j = `<${X}.${+fe + 1}.0-0` : We ? j = `<=${X}.${fe}.${U}-${We}` : I ? j = `<${X}.${fe}.${+U + 1}-0` : j = `<=${j}`, `${P} ${j}`.trim()), z = (I, $, P) => {
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
  return Ui;
}
var ki, ms;
function ai() {
  if (ms) return ki;
  ms = 1;
  const e = Symbol("SemVer ANY");
  class t {
    static get ANY() {
      return e;
    }
    constructor(c, f) {
      if (f = r(f), c instanceof t) {
        if (c.loose === !!f.loose)
          return c;
        c = c.value;
      }
      c = c.trim().split(/\s+/).join(" "), a("comparator", c, f), this.options = f, this.loose = !!f.loose, this.parse(c), this.semver === e ? this.value = "" : this.value = this.operator + this.semver.version, a("comp", this);
    }
    parse(c) {
      const f = this.options.loose ? n[i.COMPARATORLOOSE] : n[i.COMPARATOR], h = c.match(f);
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
      return this.operator === "" ? this.value === "" ? !0 : new l(c.value, f).test(this.value) : c.operator === "" ? c.value === "" ? !0 : new l(this.value, f).test(c.semver) : (f = r(f), f.includePrerelease && (this.value === "<0.0.0-0" || c.value === "<0.0.0-0") || !f.includePrerelease && (this.value.startsWith("<0.0.0") || c.value.startsWith("<0.0.0")) ? !1 : !!(this.operator.startsWith(">") && c.operator.startsWith(">") || this.operator.startsWith("<") && c.operator.startsWith("<") || this.semver.version === c.semver.version && this.operator.includes("=") && c.operator.includes("=") || o(this.semver, "<", c.semver, f) && this.operator.startsWith(">") && c.operator.startsWith("<") || o(this.semver, ">", c.semver, f) && this.operator.startsWith("<") && c.operator.startsWith(">")));
    }
  }
  ki = t;
  const r = Mo, { safeRe: n, t: i } = zr, o = lu, a = ii, s = Re, l = Ge();
  return ki;
}
const TE = Ge(), CE = (e, t, r) => {
  try {
    t = new TE(t, r);
  } catch {
    return !1;
  }
  return t.test(e);
};
var si = CE;
const bE = Ge(), $E = (e, t) => new bE(e, t).set.map((r) => r.map((n) => n.value).join(" ").trim().split(" "));
var OE = $E;
const IE = Re, RE = Ge(), PE = (e, t, r) => {
  let n = null, i = null, o = null;
  try {
    o = new RE(t, r);
  } catch {
    return null;
  }
  return e.forEach((a) => {
    o.test(a) && (!n || i.compare(a) === -1) && (n = a, i = new IE(n, r));
  }), n;
};
var DE = PE;
const NE = Re, FE = Ge(), xE = (e, t, r) => {
  let n = null, i = null, o = null;
  try {
    o = new FE(t, r);
  } catch {
    return null;
  }
  return e.forEach((a) => {
    o.test(a) && (!n || i.compare(a) === 1) && (n = a, i = new NE(n, r));
  }), n;
};
var LE = xE;
const Mi = Re, UE = Ge(), gs = oi, kE = (e, t) => {
  e = new UE(e, t);
  let r = new Mi("0.0.0");
  if (e.test(r) || (r = new Mi("0.0.0-0"), e.test(r)))
    return r;
  r = null;
  for (let n = 0; n < e.set.length; ++n) {
    const i = e.set[n];
    let o = null;
    i.forEach((a) => {
      const s = new Mi(a.semver.version);
      switch (a.operator) {
        case ">":
          s.prerelease.length === 0 ? s.patch++ : s.prerelease.push(0), s.raw = s.format();
        case "":
        case ">=":
          (!o || gs(s, o)) && (o = s);
          break;
        case "<":
        case "<=":
          break;
        default:
          throw new Error(`Unexpected operation: ${a.operator}`);
      }
    }), o && (!r || gs(r, o)) && (r = o);
  }
  return r && e.test(r) ? r : null;
};
var ME = kE;
const BE = Ge(), jE = (e, t) => {
  try {
    return new BE(e, t).range || "*";
  } catch {
    return null;
  }
};
var HE = jE;
const qE = Re, cu = ai(), { ANY: GE } = cu, WE = Ge(), VE = si, Es = oi, ys = jo, YE = qo, zE = Ho, XE = (e, t, r, n) => {
  e = new qE(e, n), t = new WE(t, n);
  let i, o, a, s, l;
  switch (r) {
    case ">":
      i = Es, o = YE, a = ys, s = ">", l = ">=";
      break;
    case "<":
      i = ys, o = zE, a = Es, s = "<", l = "<=";
      break;
    default:
      throw new TypeError('Must provide a hilo val of "<" or ">"');
  }
  if (VE(e, t, n))
    return !1;
  for (let m = 0; m < t.set.length; ++m) {
    const c = t.set[m];
    let f = null, h = null;
    if (c.forEach((g) => {
      g.semver === GE && (g = new cu(">=0.0.0")), f = f || g, h = h || g, i(g.semver, f.semver, n) ? f = g : a(g.semver, h.semver, n) && (h = g);
    }), f.operator === s || f.operator === l || (!h.operator || h.operator === s) && o(e, h.semver))
      return !1;
    if (h.operator === l && a(e, h.semver))
      return !1;
  }
  return !0;
};
var Go = XE;
const KE = Go, JE = (e, t, r) => KE(e, t, ">", r);
var QE = JE;
const ZE = Go, ey = (e, t, r) => ZE(e, t, "<", r);
var ty = ey;
const vs = Ge(), ry = (e, t, r) => (e = new vs(e, r), t = new vs(t, r), e.intersects(t, r));
var ny = ry;
const iy = si, oy = qe;
var ay = (e, t, r) => {
  const n = [];
  let i = null, o = null;
  const a = e.sort((c, f) => oy(c, f, r));
  for (const c of a)
    iy(c, t, r) ? (o = c, i || (i = c)) : (o && n.push([i, o]), o = null, i = null);
  i && n.push([i, null]);
  const s = [];
  for (const [c, f] of n)
    c === f ? s.push(c) : !f && c === a[0] ? s.push("*") : f ? c === a[0] ? s.push(`<=${f}`) : s.push(`${c} - ${f}`) : s.push(`>=${c}`);
  const l = s.join(" || "), m = typeof t.raw == "string" ? t.raw : String(t);
  return l.length < m.length ? l : t;
};
const ws = Ge(), Wo = ai(), { ANY: Bi } = Wo, mr = si, Vo = qe, sy = (e, t, r = {}) => {
  if (e === t)
    return !0;
  e = new ws(e, r), t = new ws(t, r);
  let n = !1;
  e: for (const i of e.set) {
    for (const o of t.set) {
      const a = cy(i, o, r);
      if (n = n || a !== null, a)
        continue e;
    }
    if (n)
      return !1;
  }
  return !0;
}, ly = [new Wo(">=0.0.0-0")], _s = [new Wo(">=0.0.0")], cy = (e, t, r) => {
  if (e === t)
    return !0;
  if (e.length === 1 && e[0].semver === Bi) {
    if (t.length === 1 && t[0].semver === Bi)
      return !0;
    r.includePrerelease ? e = ly : e = _s;
  }
  if (t.length === 1 && t[0].semver === Bi) {
    if (r.includePrerelease)
      return !0;
    t = _s;
  }
  const n = /* @__PURE__ */ new Set();
  let i, o;
  for (const g of e)
    g.operator === ">" || g.operator === ">=" ? i = As(i, g, r) : g.operator === "<" || g.operator === "<=" ? o = Ss(o, g, r) : n.add(g.semver);
  if (n.size > 1)
    return null;
  let a;
  if (i && o) {
    if (a = Vo(i.semver, o.semver, r), a > 0)
      return null;
    if (a === 0 && (i.operator !== ">=" || o.operator !== "<="))
      return null;
  }
  for (const g of n) {
    if (i && !mr(g, String(i), r) || o && !mr(g, String(o), r))
      return null;
    for (const _ of t)
      if (!mr(g, String(_), r))
        return !1;
    return !0;
  }
  let s, l, m, c, f = o && !r.includePrerelease && o.semver.prerelease.length ? o.semver : !1, h = i && !r.includePrerelease && i.semver.prerelease.length ? i.semver : !1;
  f && f.prerelease.length === 1 && o.operator === "<" && f.prerelease[0] === 0 && (f = !1);
  for (const g of t) {
    if (c = c || g.operator === ">" || g.operator === ">=", m = m || g.operator === "<" || g.operator === "<=", i) {
      if (h && g.semver.prerelease && g.semver.prerelease.length && g.semver.major === h.major && g.semver.minor === h.minor && g.semver.patch === h.patch && (h = !1), g.operator === ">" || g.operator === ">=") {
        if (s = As(i, g, r), s === g && s !== i)
          return !1;
      } else if (i.operator === ">=" && !mr(i.semver, String(g), r))
        return !1;
    }
    if (o) {
      if (f && g.semver.prerelease && g.semver.prerelease.length && g.semver.major === f.major && g.semver.minor === f.minor && g.semver.patch === f.patch && (f = !1), g.operator === "<" || g.operator === "<=") {
        if (l = Ss(o, g, r), l === g && l !== o)
          return !1;
      } else if (o.operator === "<=" && !mr(o.semver, String(g), r))
        return !1;
    }
    if (!g.operator && (o || i) && a !== 0)
      return !1;
  }
  return !(i && m && !o && a !== 0 || o && c && !i && a !== 0 || h || f);
}, As = (e, t, r) => {
  if (!e)
    return t;
  const n = Vo(e.semver, t.semver, r);
  return n > 0 ? e : n < 0 || t.operator === ">" && e.operator === ">=" ? t : e;
}, Ss = (e, t, r) => {
  if (!e)
    return t;
  const n = Vo(e.semver, t.semver, r);
  return n < 0 ? e : n > 0 || t.operator === "<" && e.operator === "<=" ? t : e;
};
var uy = sy;
const ji = zr, Ts = ni, fy = Re, Cs = ou, dy = ar, hy = v0, py = A0, my = T0, gy = b0, Ey = I0, yy = D0, vy = x0, wy = k0, _y = qe, Ay = H0, Sy = W0, Ty = Bo, Cy = X0, by = Q0, $y = oi, Oy = jo, Iy = au, Ry = su, Py = Ho, Dy = qo, Ny = lu, Fy = _E, xy = ai(), Ly = Ge(), Uy = si, ky = OE, My = DE, By = LE, jy = ME, Hy = HE, qy = Go, Gy = QE, Wy = ty, Vy = ny, Yy = ay, zy = uy;
var uu = {
  parse: dy,
  valid: hy,
  clean: py,
  inc: my,
  diff: gy,
  major: Ey,
  minor: yy,
  patch: vy,
  prerelease: wy,
  compare: _y,
  rcompare: Ay,
  compareLoose: Sy,
  compareBuild: Ty,
  sort: Cy,
  rsort: by,
  gt: $y,
  lt: Oy,
  eq: Iy,
  neq: Ry,
  gte: Py,
  lte: Dy,
  cmp: Ny,
  coerce: Fy,
  Comparator: xy,
  Range: Ly,
  satisfies: Uy,
  toComparators: ky,
  maxSatisfying: My,
  minSatisfying: By,
  minVersion: jy,
  validRange: Hy,
  outside: qy,
  gtr: Gy,
  ltr: Wy,
  intersects: Vy,
  simplifyRange: Yy,
  subset: zy,
  SemVer: fy,
  re: ji.re,
  src: ji.src,
  tokens: ji.t,
  SEMVER_SPEC_VERSION: Ts.SEMVER_SPEC_VERSION,
  RELEASE_TYPES: Ts.RELEASE_TYPES,
  compareIdentifiers: Cs.compareIdentifiers,
  rcompareIdentifiers: Cs.rcompareIdentifiers
}, Xr = {}, Gn = { exports: {} };
Gn.exports;
(function(e, t) {
  var r = 200, n = "__lodash_hash_undefined__", i = 1, o = 2, a = 9007199254740991, s = "[object Arguments]", l = "[object Array]", m = "[object AsyncFunction]", c = "[object Boolean]", f = "[object Date]", h = "[object Error]", g = "[object Function]", _ = "[object GeneratorFunction]", y = "[object Map]", A = "[object Number]", T = "[object Null]", S = "[object Object]", N = "[object Promise]", x = "[object Proxy]", Q = "[object RegExp]", oe = "[object Set]", V = "[object String]", Fe = "[object Symbol]", E = "[object Undefined]", q = "[object WeakMap]", B = "[object ArrayBuffer]", M = "[object DataView]", z = "[object Float32Array]", I = "[object Float64Array]", $ = "[object Int8Array]", P = "[object Int16Array]", b = "[object Int32Array]", D = "[object Uint8Array]", R = "[object Uint8ClampedArray]", k = "[object Uint16Array]", G = "[object Uint32Array]", j = /[\\^$.*+?()[\]{}|]/g, X = /^\[object .+?Constructor\]$/, fe = /^(?:0|[1-9]\d*)$/, U = {};
  U[z] = U[I] = U[$] = U[P] = U[b] = U[D] = U[R] = U[k] = U[G] = !0, U[s] = U[l] = U[B] = U[c] = U[M] = U[f] = U[h] = U[g] = U[y] = U[A] = U[S] = U[Q] = U[oe] = U[V] = U[q] = !1;
  var We = typeof Te == "object" && Te && Te.Object === Object && Te, d = typeof self == "object" && self && self.Object === Object && self, u = We || d || Function("return this")(), C = t && !t.nodeType && t, w = C && !0 && e && !e.nodeType && e, Y = w && w.exports === C, Z = Y && We.process, ne = function() {
    try {
      return Z && Z.binding && Z.binding("util");
    } catch {
    }
  }(), me = ne && ne.isTypedArray;
  function ve(p, v) {
    for (var O = -1, F = p == null ? 0 : p.length, J = 0, H = []; ++O < F; ) {
      var ie = p[O];
      v(ie, O, p) && (H[J++] = ie);
    }
    return H;
  }
  function rt(p, v) {
    for (var O = -1, F = v.length, J = p.length; ++O < F; )
      p[J + O] = v[O];
    return p;
  }
  function ce(p, v) {
    for (var O = -1, F = p == null ? 0 : p.length; ++O < F; )
      if (v(p[O], O, p))
        return !0;
    return !1;
  }
  function Me(p, v) {
    for (var O = -1, F = Array(p); ++O < p; )
      F[O] = v(O);
    return F;
  }
  function gi(p) {
    return function(v) {
      return p(v);
    };
  }
  function Zr(p, v) {
    return p.has(v);
  }
  function lr(p, v) {
    return p == null ? void 0 : p[v];
  }
  function en(p) {
    var v = -1, O = Array(p.size);
    return p.forEach(function(F, J) {
      O[++v] = [J, F];
    }), O;
  }
  function Su(p, v) {
    return function(O) {
      return p(v(O));
    };
  }
  function Tu(p) {
    var v = -1, O = Array(p.size);
    return p.forEach(function(F) {
      O[++v] = F;
    }), O;
  }
  var Cu = Array.prototype, bu = Function.prototype, tn = Object.prototype, Ei = u["__core-js_shared__"], Ko = bu.toString, Ve = tn.hasOwnProperty, Jo = function() {
    var p = /[^.]+$/.exec(Ei && Ei.keys && Ei.keys.IE_PROTO || "");
    return p ? "Symbol(src)_1." + p : "";
  }(), Qo = tn.toString, $u = RegExp(
    "^" + Ko.call(Ve).replace(j, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
  ), Zo = Y ? u.Buffer : void 0, rn = u.Symbol, ea = u.Uint8Array, ta = tn.propertyIsEnumerable, Ou = Cu.splice, wt = rn ? rn.toStringTag : void 0, ra = Object.getOwnPropertySymbols, Iu = Zo ? Zo.isBuffer : void 0, Ru = Su(Object.keys, Object), yi = kt(u, "DataView"), cr = kt(u, "Map"), vi = kt(u, "Promise"), wi = kt(u, "Set"), _i = kt(u, "WeakMap"), ur = kt(Object, "create"), Pu = St(yi), Du = St(cr), Nu = St(vi), Fu = St(wi), xu = St(_i), na = rn ? rn.prototype : void 0, Ai = na ? na.valueOf : void 0;
  function _t(p) {
    var v = -1, O = p == null ? 0 : p.length;
    for (this.clear(); ++v < O; ) {
      var F = p[v];
      this.set(F[0], F[1]);
    }
  }
  function Lu() {
    this.__data__ = ur ? ur(null) : {}, this.size = 0;
  }
  function Uu(p) {
    var v = this.has(p) && delete this.__data__[p];
    return this.size -= v ? 1 : 0, v;
  }
  function ku(p) {
    var v = this.__data__;
    if (ur) {
      var O = v[p];
      return O === n ? void 0 : O;
    }
    return Ve.call(v, p) ? v[p] : void 0;
  }
  function Mu(p) {
    var v = this.__data__;
    return ur ? v[p] !== void 0 : Ve.call(v, p);
  }
  function Bu(p, v) {
    var O = this.__data__;
    return this.size += this.has(p) ? 0 : 1, O[p] = ur && v === void 0 ? n : v, this;
  }
  _t.prototype.clear = Lu, _t.prototype.delete = Uu, _t.prototype.get = ku, _t.prototype.has = Mu, _t.prototype.set = Bu;
  function Ke(p) {
    var v = -1, O = p == null ? 0 : p.length;
    for (this.clear(); ++v < O; ) {
      var F = p[v];
      this.set(F[0], F[1]);
    }
  }
  function ju() {
    this.__data__ = [], this.size = 0;
  }
  function Hu(p) {
    var v = this.__data__, O = on(v, p);
    if (O < 0)
      return !1;
    var F = v.length - 1;
    return O == F ? v.pop() : Ou.call(v, O, 1), --this.size, !0;
  }
  function qu(p) {
    var v = this.__data__, O = on(v, p);
    return O < 0 ? void 0 : v[O][1];
  }
  function Gu(p) {
    return on(this.__data__, p) > -1;
  }
  function Wu(p, v) {
    var O = this.__data__, F = on(O, p);
    return F < 0 ? (++this.size, O.push([p, v])) : O[F][1] = v, this;
  }
  Ke.prototype.clear = ju, Ke.prototype.delete = Hu, Ke.prototype.get = qu, Ke.prototype.has = Gu, Ke.prototype.set = Wu;
  function At(p) {
    var v = -1, O = p == null ? 0 : p.length;
    for (this.clear(); ++v < O; ) {
      var F = p[v];
      this.set(F[0], F[1]);
    }
  }
  function Vu() {
    this.size = 0, this.__data__ = {
      hash: new _t(),
      map: new (cr || Ke)(),
      string: new _t()
    };
  }
  function Yu(p) {
    var v = an(this, p).delete(p);
    return this.size -= v ? 1 : 0, v;
  }
  function zu(p) {
    return an(this, p).get(p);
  }
  function Xu(p) {
    return an(this, p).has(p);
  }
  function Ku(p, v) {
    var O = an(this, p), F = O.size;
    return O.set(p, v), this.size += O.size == F ? 0 : 1, this;
  }
  At.prototype.clear = Vu, At.prototype.delete = Yu, At.prototype.get = zu, At.prototype.has = Xu, At.prototype.set = Ku;
  function nn(p) {
    var v = -1, O = p == null ? 0 : p.length;
    for (this.__data__ = new At(); ++v < O; )
      this.add(p[v]);
  }
  function Ju(p) {
    return this.__data__.set(p, n), this;
  }
  function Qu(p) {
    return this.__data__.has(p);
  }
  nn.prototype.add = nn.prototype.push = Ju, nn.prototype.has = Qu;
  function nt(p) {
    var v = this.__data__ = new Ke(p);
    this.size = v.size;
  }
  function Zu() {
    this.__data__ = new Ke(), this.size = 0;
  }
  function ef(p) {
    var v = this.__data__, O = v.delete(p);
    return this.size = v.size, O;
  }
  function tf(p) {
    return this.__data__.get(p);
  }
  function rf(p) {
    return this.__data__.has(p);
  }
  function nf(p, v) {
    var O = this.__data__;
    if (O instanceof Ke) {
      var F = O.__data__;
      if (!cr || F.length < r - 1)
        return F.push([p, v]), this.size = ++O.size, this;
      O = this.__data__ = new At(F);
    }
    return O.set(p, v), this.size = O.size, this;
  }
  nt.prototype.clear = Zu, nt.prototype.delete = ef, nt.prototype.get = tf, nt.prototype.has = rf, nt.prototype.set = nf;
  function of(p, v) {
    var O = sn(p), F = !O && wf(p), J = !O && !F && Si(p), H = !O && !F && !J && da(p), ie = O || F || J || H, de = ie ? Me(p.length, String) : [], ge = de.length;
    for (var ee in p)
      Ve.call(p, ee) && !(ie && // Safari 9 has enumerable `arguments.length` in strict mode.
      (ee == "length" || // Node.js 0.10 has enumerable non-index properties on buffers.
      J && (ee == "offset" || ee == "parent") || // PhantomJS 2 has enumerable non-index properties on typed arrays.
      H && (ee == "buffer" || ee == "byteLength" || ee == "byteOffset") || // Skip index properties.
      mf(ee, ge))) && de.push(ee);
    return de;
  }
  function on(p, v) {
    for (var O = p.length; O--; )
      if (la(p[O][0], v))
        return O;
    return -1;
  }
  function af(p, v, O) {
    var F = v(p);
    return sn(p) ? F : rt(F, O(p));
  }
  function fr(p) {
    return p == null ? p === void 0 ? E : T : wt && wt in Object(p) ? hf(p) : vf(p);
  }
  function ia(p) {
    return dr(p) && fr(p) == s;
  }
  function oa(p, v, O, F, J) {
    return p === v ? !0 : p == null || v == null || !dr(p) && !dr(v) ? p !== p && v !== v : sf(p, v, O, F, oa, J);
  }
  function sf(p, v, O, F, J, H) {
    var ie = sn(p), de = sn(v), ge = ie ? l : it(p), ee = de ? l : it(v);
    ge = ge == s ? S : ge, ee = ee == s ? S : ee;
    var xe = ge == S, Be = ee == S, we = ge == ee;
    if (we && Si(p)) {
      if (!Si(v))
        return !1;
      ie = !0, xe = !1;
    }
    if (we && !xe)
      return H || (H = new nt()), ie || da(p) ? aa(p, v, O, F, J, H) : ff(p, v, ge, O, F, J, H);
    if (!(O & i)) {
      var Le = xe && Ve.call(p, "__wrapped__"), Ue = Be && Ve.call(v, "__wrapped__");
      if (Le || Ue) {
        var ot = Le ? p.value() : p, Je = Ue ? v.value() : v;
        return H || (H = new nt()), J(ot, Je, O, F, H);
      }
    }
    return we ? (H || (H = new nt()), df(p, v, O, F, J, H)) : !1;
  }
  function lf(p) {
    if (!fa(p) || Ef(p))
      return !1;
    var v = ca(p) ? $u : X;
    return v.test(St(p));
  }
  function cf(p) {
    return dr(p) && ua(p.length) && !!U[fr(p)];
  }
  function uf(p) {
    if (!yf(p))
      return Ru(p);
    var v = [];
    for (var O in Object(p))
      Ve.call(p, O) && O != "constructor" && v.push(O);
    return v;
  }
  function aa(p, v, O, F, J, H) {
    var ie = O & i, de = p.length, ge = v.length;
    if (de != ge && !(ie && ge > de))
      return !1;
    var ee = H.get(p);
    if (ee && H.get(v))
      return ee == v;
    var xe = -1, Be = !0, we = O & o ? new nn() : void 0;
    for (H.set(p, v), H.set(v, p); ++xe < de; ) {
      var Le = p[xe], Ue = v[xe];
      if (F)
        var ot = ie ? F(Ue, Le, xe, v, p, H) : F(Le, Ue, xe, p, v, H);
      if (ot !== void 0) {
        if (ot)
          continue;
        Be = !1;
        break;
      }
      if (we) {
        if (!ce(v, function(Je, Tt) {
          if (!Zr(we, Tt) && (Le === Je || J(Le, Je, O, F, H)))
            return we.push(Tt);
        })) {
          Be = !1;
          break;
        }
      } else if (!(Le === Ue || J(Le, Ue, O, F, H))) {
        Be = !1;
        break;
      }
    }
    return H.delete(p), H.delete(v), Be;
  }
  function ff(p, v, O, F, J, H, ie) {
    switch (O) {
      case M:
        if (p.byteLength != v.byteLength || p.byteOffset != v.byteOffset)
          return !1;
        p = p.buffer, v = v.buffer;
      case B:
        return !(p.byteLength != v.byteLength || !H(new ea(p), new ea(v)));
      case c:
      case f:
      case A:
        return la(+p, +v);
      case h:
        return p.name == v.name && p.message == v.message;
      case Q:
      case V:
        return p == v + "";
      case y:
        var de = en;
      case oe:
        var ge = F & i;
        if (de || (de = Tu), p.size != v.size && !ge)
          return !1;
        var ee = ie.get(p);
        if (ee)
          return ee == v;
        F |= o, ie.set(p, v);
        var xe = aa(de(p), de(v), F, J, H, ie);
        return ie.delete(p), xe;
      case Fe:
        if (Ai)
          return Ai.call(p) == Ai.call(v);
    }
    return !1;
  }
  function df(p, v, O, F, J, H) {
    var ie = O & i, de = sa(p), ge = de.length, ee = sa(v), xe = ee.length;
    if (ge != xe && !ie)
      return !1;
    for (var Be = ge; Be--; ) {
      var we = de[Be];
      if (!(ie ? we in v : Ve.call(v, we)))
        return !1;
    }
    var Le = H.get(p);
    if (Le && H.get(v))
      return Le == v;
    var Ue = !0;
    H.set(p, v), H.set(v, p);
    for (var ot = ie; ++Be < ge; ) {
      we = de[Be];
      var Je = p[we], Tt = v[we];
      if (F)
        var ha = ie ? F(Tt, Je, we, v, p, H) : F(Je, Tt, we, p, v, H);
      if (!(ha === void 0 ? Je === Tt || J(Je, Tt, O, F, H) : ha)) {
        Ue = !1;
        break;
      }
      ot || (ot = we == "constructor");
    }
    if (Ue && !ot) {
      var ln = p.constructor, cn = v.constructor;
      ln != cn && "constructor" in p && "constructor" in v && !(typeof ln == "function" && ln instanceof ln && typeof cn == "function" && cn instanceof cn) && (Ue = !1);
    }
    return H.delete(p), H.delete(v), Ue;
  }
  function sa(p) {
    return af(p, Sf, pf);
  }
  function an(p, v) {
    var O = p.__data__;
    return gf(v) ? O[typeof v == "string" ? "string" : "hash"] : O.map;
  }
  function kt(p, v) {
    var O = lr(p, v);
    return lf(O) ? O : void 0;
  }
  function hf(p) {
    var v = Ve.call(p, wt), O = p[wt];
    try {
      p[wt] = void 0;
      var F = !0;
    } catch {
    }
    var J = Qo.call(p);
    return F && (v ? p[wt] = O : delete p[wt]), J;
  }
  var pf = ra ? function(p) {
    return p == null ? [] : (p = Object(p), ve(ra(p), function(v) {
      return ta.call(p, v);
    }));
  } : Tf, it = fr;
  (yi && it(new yi(new ArrayBuffer(1))) != M || cr && it(new cr()) != y || vi && it(vi.resolve()) != N || wi && it(new wi()) != oe || _i && it(new _i()) != q) && (it = function(p) {
    var v = fr(p), O = v == S ? p.constructor : void 0, F = O ? St(O) : "";
    if (F)
      switch (F) {
        case Pu:
          return M;
        case Du:
          return y;
        case Nu:
          return N;
        case Fu:
          return oe;
        case xu:
          return q;
      }
    return v;
  });
  function mf(p, v) {
    return v = v ?? a, !!v && (typeof p == "number" || fe.test(p)) && p > -1 && p % 1 == 0 && p < v;
  }
  function gf(p) {
    var v = typeof p;
    return v == "string" || v == "number" || v == "symbol" || v == "boolean" ? p !== "__proto__" : p === null;
  }
  function Ef(p) {
    return !!Jo && Jo in p;
  }
  function yf(p) {
    var v = p && p.constructor, O = typeof v == "function" && v.prototype || tn;
    return p === O;
  }
  function vf(p) {
    return Qo.call(p);
  }
  function St(p) {
    if (p != null) {
      try {
        return Ko.call(p);
      } catch {
      }
      try {
        return p + "";
      } catch {
      }
    }
    return "";
  }
  function la(p, v) {
    return p === v || p !== p && v !== v;
  }
  var wf = ia(/* @__PURE__ */ function() {
    return arguments;
  }()) ? ia : function(p) {
    return dr(p) && Ve.call(p, "callee") && !ta.call(p, "callee");
  }, sn = Array.isArray;
  function _f(p) {
    return p != null && ua(p.length) && !ca(p);
  }
  var Si = Iu || Cf;
  function Af(p, v) {
    return oa(p, v);
  }
  function ca(p) {
    if (!fa(p))
      return !1;
    var v = fr(p);
    return v == g || v == _ || v == m || v == x;
  }
  function ua(p) {
    return typeof p == "number" && p > -1 && p % 1 == 0 && p <= a;
  }
  function fa(p) {
    var v = typeof p;
    return p != null && (v == "object" || v == "function");
  }
  function dr(p) {
    return p != null && typeof p == "object";
  }
  var da = me ? gi(me) : cf;
  function Sf(p) {
    return _f(p) ? of(p) : uf(p);
  }
  function Tf() {
    return [];
  }
  function Cf() {
    return !1;
  }
  e.exports = Af;
})(Gn, Gn.exports);
var Xy = Gn.exports;
Object.defineProperty(Xr, "__esModule", { value: !0 });
Xr.DownloadedUpdateHelper = void 0;
Xr.createTempUpdateFile = ev;
const Ky = Hr, Jy = Et, bs = Xy, bt = yt, Sr = re;
class Qy {
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
    return Sr.join(this.cacheDir, "pending");
  }
  async validateDownloadedPath(t, r, n, i) {
    if (this.versionInfo != null && this.file === t && this.fileInfo != null)
      return bs(this.versionInfo, r) && bs(this.fileInfo.info, n.info) && await (0, bt.pathExists)(t) ? t : null;
    const o = await this.getValidCachedUpdateFile(n, i);
    return o === null ? null : (i.info(`Update has already been downloaded to ${t}).`), this._file = o, o);
  }
  async setDownloadedFile(t, r, n, i, o, a) {
    this._file = t, this._packageFile = r, this.versionInfo = n, this.fileInfo = i, this._downloadedFileInfo = {
      fileName: o,
      sha512: i.info.sha512,
      isAdminRightsRequired: i.info.isAdminRightsRequired === !0
    }, a && await (0, bt.outputJson)(this.getUpdateInfoFile(), this._downloadedFileInfo);
  }
  async clear() {
    this._file = null, this._packageFile = null, this.versionInfo = null, this.fileInfo = null, await this.cleanCacheDirForPendingUpdate();
  }
  async cleanCacheDirForPendingUpdate() {
    try {
      await (0, bt.emptyDir)(this.cacheDirForPendingUpdate);
    } catch {
    }
  }
  /**
   * Returns "update-info.json" which is created in the update cache directory's "pending" subfolder after the first update is downloaded.  If the update file does not exist then the cache is cleared and recreated.  If the update file exists then its properties are validated.
   * @param fileInfo
   * @param logger
   */
  async getValidCachedUpdateFile(t, r) {
    const n = this.getUpdateInfoFile();
    if (!await (0, bt.pathExists)(n))
      return null;
    let o;
    try {
      o = await (0, bt.readJson)(n);
    } catch (m) {
      let c = "No cached update info available";
      return m.code !== "ENOENT" && (await this.cleanCacheDirForPendingUpdate(), c += ` (error on read: ${m.message})`), r.info(c), null;
    }
    if (!((o == null ? void 0 : o.fileName) !== null))
      return r.warn("Cached update info is corrupted: no fileName, directory for cached update will be cleaned"), await this.cleanCacheDirForPendingUpdate(), null;
    if (t.info.sha512 !== o.sha512)
      return r.info(`Cached update sha512 checksum doesn't match the latest available update. New update must be downloaded. Cached: ${o.sha512}, expected: ${t.info.sha512}. Directory for cached update will be cleaned`), await this.cleanCacheDirForPendingUpdate(), null;
    const s = Sr.join(this.cacheDirForPendingUpdate, o.fileName);
    if (!await (0, bt.pathExists)(s))
      return r.info("Cached update file doesn't exist"), null;
    const l = await Zy(s);
    return t.info.sha512 !== l ? (r.warn(`Sha512 checksum doesn't match the latest available update. New update must be downloaded. Cached: ${l}, expected: ${t.info.sha512}`), await this.cleanCacheDirForPendingUpdate(), null) : (this._downloadedFileInfo = o, s);
  }
  getUpdateInfoFile() {
    return Sr.join(this.cacheDirForPendingUpdate, "update-info.json");
  }
}
Xr.DownloadedUpdateHelper = Qy;
function Zy(e, t = "sha512", r = "base64", n) {
  return new Promise((i, o) => {
    const a = (0, Ky.createHash)(t);
    a.on("error", o).setEncoding(r), (0, Jy.createReadStream)(e, {
      ...n,
      highWaterMark: 1024 * 1024
      /* better to use more memory but hash faster */
    }).on("error", o).on("end", () => {
      a.end(), i(a.read());
    }).pipe(a, { end: !1 });
  });
}
async function ev(e, t, r) {
  let n = 0, i = Sr.join(t, e);
  for (let o = 0; o < 3; o++)
    try {
      return await (0, bt.unlink)(i), i;
    } catch (a) {
      if (a.code === "ENOENT")
        return i;
      r.warn(`Error on remove temp update file: ${a}`), i = Sr.join(t, `${n++}-${e}`);
    }
  return i;
}
var li = {}, Yo = {};
Object.defineProperty(Yo, "__esModule", { value: !0 });
Yo.getAppCacheDir = rv;
const Hi = re, tv = Yn;
function rv() {
  const e = (0, tv.homedir)();
  let t;
  return process.platform === "win32" ? t = process.env.LOCALAPPDATA || Hi.join(e, "AppData", "Local") : process.platform === "darwin" ? t = Hi.join(e, "Library", "Caches") : t = process.env.XDG_CACHE_HOME || Hi.join(e, ".cache"), t;
}
Object.defineProperty(li, "__esModule", { value: !0 });
li.ElectronAppAdapter = void 0;
const $s = re, nv = Yo;
class iv {
  constructor(t = Dt.app) {
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
    return this.isPackaged ? $s.join(process.resourcesPath, "app-update.yml") : $s.join(this.app.getAppPath(), "dev-app-update.yml");
  }
  get userDataPath() {
    return this.app.getPath("userData");
  }
  get baseCachePath() {
    return (0, nv.getAppCacheDir)();
  }
  quit() {
    this.app.quit();
  }
  relaunch() {
    this.app.relaunch();
  }
  onQuit(t) {
    this.app.once("quit", (r, n) => t(n));
  }
}
li.ElectronAppAdapter = iv;
var fu = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.ElectronHttpExecutor = e.NET_SESSION_NAME = void 0, e.getNetSession = r;
  const t = pe;
  e.NET_SESSION_NAME = "electron-updater";
  function r() {
    return Dt.session.fromPartition(e.NET_SESSION_NAME, {
      cache: !1
    });
  }
  class n extends t.HttpExecutor {
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
      o.headers && o.headers.Host && (o.host = o.headers.Host, delete o.headers.Host), this.cachedSession == null && (this.cachedSession = r());
      const s = Dt.net.request({
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
  e.ElectronHttpExecutor = n;
})(fu);
var Kr = {}, ke = {}, ov = "[object Symbol]", du = /[\\^$.*+?()[\]{}|]/g, av = RegExp(du.source), sv = typeof Te == "object" && Te && Te.Object === Object && Te, lv = typeof self == "object" && self && self.Object === Object && self, cv = sv || lv || Function("return this")(), uv = Object.prototype, fv = uv.toString, Os = cv.Symbol, Is = Os ? Os.prototype : void 0, Rs = Is ? Is.toString : void 0;
function dv(e) {
  if (typeof e == "string")
    return e;
  if (pv(e))
    return Rs ? Rs.call(e) : "";
  var t = e + "";
  return t == "0" && 1 / e == -1 / 0 ? "-0" : t;
}
function hv(e) {
  return !!e && typeof e == "object";
}
function pv(e) {
  return typeof e == "symbol" || hv(e) && fv.call(e) == ov;
}
function mv(e) {
  return e == null ? "" : dv(e);
}
function gv(e) {
  return e = mv(e), e && av.test(e) ? e.replace(du, "\\$&") : e;
}
var Ev = gv;
Object.defineProperty(ke, "__esModule", { value: !0 });
ke.newBaseUrl = vv;
ke.newUrlFromBase = po;
ke.getChannelFilename = wv;
ke.blockmapFiles = _v;
const hu = nr, yv = Ev;
function vv(e) {
  const t = new hu.URL(e);
  return t.pathname.endsWith("/") || (t.pathname += "/"), t;
}
function po(e, t, r = !1) {
  const n = new hu.URL(e, t), i = t.search;
  return i != null && i.length !== 0 ? n.search = i : r && (n.search = `noCache=${Date.now().toString(32)}`), n;
}
function wv(e) {
  return `${e}.yml`;
}
function _v(e, t, r) {
  const n = po(`${e.pathname}.blockmap`, e);
  return [po(`${e.pathname.replace(new RegExp(yv(r), "g"), t)}.blockmap`, e), n];
}
var ue = {};
Object.defineProperty(ue, "__esModule", { value: !0 });
ue.Provider = void 0;
ue.findFile = Tv;
ue.parseUpdateInfo = Cv;
ue.getFileList = pu;
ue.resolveFiles = bv;
const mt = pe, Av = ye, Ps = ke;
class Sv {
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
  httpRequest(t, r, n) {
    return this.executor.request(this.createRequestOptions(t, r), n);
  }
  createRequestOptions(t, r) {
    const n = {};
    return this.requestHeaders == null ? r != null && (n.headers = r) : n.headers = r == null ? this.requestHeaders : { ...this.requestHeaders, ...r }, (0, mt.configureRequestUrl)(t, n), n;
  }
}
ue.Provider = Sv;
function Tv(e, t, r) {
  if (e.length === 0)
    throw (0, mt.newError)("No files provided", "ERR_UPDATER_NO_FILES_PROVIDED");
  const n = e.find((i) => i.url.pathname.toLowerCase().endsWith(`.${t}`));
  return n ?? (r == null ? e[0] : e.find((i) => !r.some((o) => i.url.pathname.toLowerCase().endsWith(`.${o}`))));
}
function Cv(e, t, r) {
  if (e == null)
    throw (0, mt.newError)(`Cannot parse update info from ${t} in the latest release artifacts (${r}): rawData: null`, "ERR_UPDATER_INVALID_UPDATE_INFO");
  let n;
  try {
    n = (0, Av.load)(e);
  } catch (i) {
    throw (0, mt.newError)(`Cannot parse update info from ${t} in the latest release artifacts (${r}): ${i.stack || i.message}, rawData: ${e}`, "ERR_UPDATER_INVALID_UPDATE_INFO");
  }
  return n;
}
function pu(e) {
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
  throw (0, mt.newError)(`No files provided: ${(0, mt.safeStringifyJson)(e)}`, "ERR_UPDATER_NO_FILES_PROVIDED");
}
function bv(e, t, r = (n) => n) {
  const i = pu(e).map((s) => {
    if (s.sha2 == null && s.sha512 == null)
      throw (0, mt.newError)(`Update info doesn't contain nor sha256 neither sha512 checksum: ${(0, mt.safeStringifyJson)(s)}`, "ERR_UPDATER_NO_CHECKSUM");
    return {
      url: (0, Ps.newUrlFromBase)(r(s.url), t),
      info: s
    };
  }), o = e.packages, a = o == null ? null : o[process.arch] || o.ia32;
  return a != null && (i[0].packageInfo = {
    ...a,
    path: (0, Ps.newUrlFromBase)(r(a.path), t).href
  }), i;
}
Object.defineProperty(Kr, "__esModule", { value: !0 });
Kr.GenericProvider = void 0;
const Ds = pe, qi = ke, Gi = ue;
class $v extends Gi.Provider {
  constructor(t, r, n) {
    super(n), this.configuration = t, this.updater = r, this.baseUrl = (0, qi.newBaseUrl)(this.configuration.url);
  }
  get channel() {
    const t = this.updater.channel || this.configuration.channel;
    return t == null ? this.getDefaultChannelName() : this.getCustomChannelName(t);
  }
  async getLatestVersion() {
    const t = (0, qi.getChannelFilename)(this.channel), r = (0, qi.newUrlFromBase)(t, this.baseUrl, this.updater.isAddNoCacheQuery);
    for (let n = 0; ; n++)
      try {
        return (0, Gi.parseUpdateInfo)(await this.httpRequest(r), t, r);
      } catch (i) {
        if (i instanceof Ds.HttpError && i.statusCode === 404)
          throw (0, Ds.newError)(`Cannot find channel "${t}" update info: ${i.stack || i.message}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND");
        if (i.code === "ECONNREFUSED" && n < 3) {
          await new Promise((o, a) => {
            try {
              setTimeout(o, 1e3 * n);
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
    return (0, Gi.resolveFiles)(t, this.baseUrl);
  }
}
Kr.GenericProvider = $v;
var ci = {}, ui = {};
Object.defineProperty(ui, "__esModule", { value: !0 });
ui.BitbucketProvider = void 0;
const Ns = pe, Wi = ke, Vi = ue;
class Ov extends Vi.Provider {
  constructor(t, r, n) {
    super({
      ...n,
      isUseMultipleRangeRequest: !1
    }), this.configuration = t, this.updater = r;
    const { owner: i, slug: o } = t;
    this.baseUrl = (0, Wi.newBaseUrl)(`https://api.bitbucket.org/2.0/repositories/${i}/${o}/downloads`);
  }
  get channel() {
    return this.updater.channel || this.configuration.channel || "latest";
  }
  async getLatestVersion() {
    const t = new Ns.CancellationToken(), r = (0, Wi.getChannelFilename)(this.getCustomChannelName(this.channel)), n = (0, Wi.newUrlFromBase)(r, this.baseUrl, this.updater.isAddNoCacheQuery);
    try {
      const i = await this.httpRequest(n, void 0, t);
      return (0, Vi.parseUpdateInfo)(i, r, n);
    } catch (i) {
      throw (0, Ns.newError)(`Unable to find latest version on ${this.toString()}, please ensure release exists: ${i.stack || i.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
    }
  }
  resolveFiles(t) {
    return (0, Vi.resolveFiles)(t, this.baseUrl);
  }
  toString() {
    const { owner: t, slug: r } = this.configuration;
    return `Bitbucket (owner: ${t}, slug: ${r}, channel: ${this.channel})`;
  }
}
ui.BitbucketProvider = Ov;
var gt = {};
Object.defineProperty(gt, "__esModule", { value: !0 });
gt.GitHubProvider = gt.BaseGitHubProvider = void 0;
gt.computeReleaseNotes = gu;
const Qe = pe, zt = uu, Iv = nr, Xt = ke, mo = ue, Yi = /\/tag\/([^/]+)$/;
class mu extends mo.Provider {
  constructor(t, r, n) {
    super({
      ...n,
      /* because GitHib uses S3 */
      isUseMultipleRangeRequest: !1
    }), this.options = t, this.baseUrl = (0, Xt.newBaseUrl)((0, Qe.githubUrl)(t, r));
    const i = r === "github.com" ? "api.github.com" : r;
    this.baseApiUrl = (0, Xt.newBaseUrl)((0, Qe.githubUrl)(t, i));
  }
  computeGithubBasePath(t) {
    const r = this.options.host;
    return r && !["github.com", "api.github.com"].includes(r) ? `/api/v3${t}` : t;
  }
}
gt.BaseGitHubProvider = mu;
class Rv extends mu {
  constructor(t, r, n) {
    super(t, "github.com", n), this.options = t, this.updater = r;
  }
  get channel() {
    const t = this.updater.channel || this.options.channel;
    return t == null ? this.getDefaultChannelName() : this.getCustomChannelName(t);
  }
  async getLatestVersion() {
    var t, r, n, i, o;
    const a = new Qe.CancellationToken(), s = await this.httpRequest((0, Xt.newUrlFromBase)(`${this.basePath}.atom`, this.baseUrl), {
      accept: "application/xml, application/atom+xml, text/xml, */*"
    }, a), l = (0, Qe.parseXml)(s);
    let m = l.element("entry", !1, "No published versions on GitHub"), c = null;
    try {
      if (this.updater.allowPrerelease) {
        const A = ((t = this.updater) === null || t === void 0 ? void 0 : t.channel) || ((r = zt.prerelease(this.updater.currentVersion)) === null || r === void 0 ? void 0 : r[0]) || null;
        if (A === null)
          c = Yi.exec(m.element("link").attribute("href"))[1];
        else
          for (const T of l.getElements("entry")) {
            const S = Yi.exec(T.element("link").attribute("href"));
            if (S === null)
              continue;
            const N = S[1], x = ((n = zt.prerelease(N)) === null || n === void 0 ? void 0 : n[0]) || null, Q = !A || ["alpha", "beta"].includes(A), oe = x !== null && !["alpha", "beta"].includes(String(x));
            if (Q && !oe && !(A === "beta" && x === "alpha")) {
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
          if (Yi.exec(A.element("link").attribute("href"))[1] === c) {
            m = A;
            break;
          }
      }
    } catch (A) {
      throw (0, Qe.newError)(`Cannot parse releases feed: ${A.stack || A.message},
XML:
${s}`, "ERR_UPDATER_INVALID_RELEASE_FEED");
    }
    if (c == null)
      throw (0, Qe.newError)("No published versions on GitHub", "ERR_UPDATER_NO_PUBLISHED_VERSIONS");
    let f, h = "", g = "";
    const _ = async (A) => {
      h = (0, Xt.getChannelFilename)(A), g = (0, Xt.newUrlFromBase)(this.getBaseDownloadPath(String(c), h), this.baseUrl);
      const T = this.createRequestOptions(g);
      try {
        return await this.executor.request(T, a);
      } catch (S) {
        throw S instanceof Qe.HttpError && S.statusCode === 404 ? (0, Qe.newError)(`Cannot find ${h} in the latest release artifacts (${g}): ${S.stack || S.message}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND") : S;
      }
    };
    try {
      let A = this.channel;
      this.updater.allowPrerelease && (!((i = zt.prerelease(c)) === null || i === void 0) && i[0]) && (A = this.getCustomChannelName(String((o = zt.prerelease(c)) === null || o === void 0 ? void 0 : o[0]))), f = await _(A);
    } catch (A) {
      if (this.updater.allowPrerelease)
        f = await _(this.getDefaultChannelName());
      else
        throw A;
    }
    const y = (0, mo.parseUpdateInfo)(f, h, g);
    return y.releaseName == null && (y.releaseName = m.elementValueOrEmpty("title")), y.releaseNotes == null && (y.releaseNotes = gu(this.updater.currentVersion, this.updater.fullChangelog, l, m)), {
      tag: c,
      ...y
    };
  }
  async getLatestTagName(t) {
    const r = this.options, n = r.host == null || r.host === "github.com" ? (0, Xt.newUrlFromBase)(`${this.basePath}/latest`, this.baseUrl) : new Iv.URL(`${this.computeGithubBasePath(`/repos/${r.owner}/${r.repo}/releases`)}/latest`, this.baseApiUrl);
    try {
      const i = await this.httpRequest(n, { Accept: "application/json" }, t);
      return i == null ? null : JSON.parse(i).tag_name;
    } catch (i) {
      throw (0, Qe.newError)(`Unable to find latest version on GitHub (${n}), please ensure a production release exists: ${i.stack || i.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
    }
  }
  get basePath() {
    return `/${this.options.owner}/${this.options.repo}/releases`;
  }
  resolveFiles(t) {
    return (0, mo.resolveFiles)(t, this.baseUrl, (r) => this.getBaseDownloadPath(t.tag, r.replace(/ /g, "-")));
  }
  getBaseDownloadPath(t, r) {
    return `${this.basePath}/download/${t}/${r}`;
  }
}
gt.GitHubProvider = Rv;
function Fs(e) {
  const t = e.elementValueOrEmpty("content");
  return t === "No content." ? "" : t;
}
function gu(e, t, r, n) {
  if (!t)
    return Fs(n);
  const i = [];
  for (const o of r.getElements("entry")) {
    const a = /\/tag\/v?([^/]+)$/.exec(o.element("link").attribute("href"))[1];
    zt.lt(e, a) && i.push({
      version: a,
      note: Fs(o)
    });
  }
  return i.sort((o, a) => zt.rcompare(o.version, a.version));
}
var fi = {};
Object.defineProperty(fi, "__esModule", { value: !0 });
fi.KeygenProvider = void 0;
const xs = pe, zi = ke, Xi = ue;
class Pv extends Xi.Provider {
  constructor(t, r, n) {
    super({
      ...n,
      isUseMultipleRangeRequest: !1
    }), this.configuration = t, this.updater = r, this.defaultHostname = "api.keygen.sh";
    const i = this.configuration.host || this.defaultHostname;
    this.baseUrl = (0, zi.newBaseUrl)(`https://${i}/v1/accounts/${this.configuration.account}/artifacts?product=${this.configuration.product}`);
  }
  get channel() {
    return this.updater.channel || this.configuration.channel || "stable";
  }
  async getLatestVersion() {
    const t = new xs.CancellationToken(), r = (0, zi.getChannelFilename)(this.getCustomChannelName(this.channel)), n = (0, zi.newUrlFromBase)(r, this.baseUrl, this.updater.isAddNoCacheQuery);
    try {
      const i = await this.httpRequest(n, {
        Accept: "application/vnd.api+json",
        "Keygen-Version": "1.1"
      }, t);
      return (0, Xi.parseUpdateInfo)(i, r, n);
    } catch (i) {
      throw (0, xs.newError)(`Unable to find latest version on ${this.toString()}, please ensure release exists: ${i.stack || i.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
    }
  }
  resolveFiles(t) {
    return (0, Xi.resolveFiles)(t, this.baseUrl);
  }
  toString() {
    const { account: t, product: r, platform: n } = this.configuration;
    return `Keygen (account: ${t}, product: ${r}, platform: ${n}, channel: ${this.channel})`;
  }
}
fi.KeygenProvider = Pv;
var di = {};
Object.defineProperty(di, "__esModule", { value: !0 });
di.PrivateGitHubProvider = void 0;
const jt = pe, Dv = ye, Nv = re, Ls = nr, Us = ke, Fv = gt, xv = ue;
class Lv extends Fv.BaseGitHubProvider {
  constructor(t, r, n, i) {
    super(t, "api.github.com", i), this.updater = r, this.token = n;
  }
  createRequestOptions(t, r) {
    const n = super.createRequestOptions(t, r);
    return n.redirect = "manual", n;
  }
  async getLatestVersion() {
    const t = new jt.CancellationToken(), r = (0, Us.getChannelFilename)(this.getDefaultChannelName()), n = await this.getLatestVersionInfo(t), i = n.assets.find((s) => s.name === r);
    if (i == null)
      throw (0, jt.newError)(`Cannot find ${r} in the release ${n.html_url || n.name}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND");
    const o = new Ls.URL(i.url);
    let a;
    try {
      a = (0, Dv.load)(await this.httpRequest(o, this.configureHeaders("application/octet-stream"), t));
    } catch (s) {
      throw s instanceof jt.HttpError && s.statusCode === 404 ? (0, jt.newError)(`Cannot find ${r} in the latest release artifacts (${o}): ${s.stack || s.message}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND") : s;
    }
    return a.assets = n.assets, a;
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
    const r = this.updater.allowPrerelease;
    let n = this.basePath;
    r || (n = `${n}/latest`);
    const i = (0, Us.newUrlFromBase)(n, this.baseUrl);
    try {
      const o = JSON.parse(await this.httpRequest(i, this.configureHeaders("application/vnd.github.v3+json"), t));
      return r ? o.find((a) => a.prerelease) || o[0] : o;
    } catch (o) {
      throw (0, jt.newError)(`Unable to find latest version on GitHub (${i}), please ensure a production release exists: ${o.stack || o.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
    }
  }
  get basePath() {
    return this.computeGithubBasePath(`/repos/${this.options.owner}/${this.options.repo}/releases`);
  }
  resolveFiles(t) {
    return (0, xv.getFileList)(t).map((r) => {
      const n = Nv.posix.basename(r.url).replace(/ /g, "-"), i = t.assets.find((o) => o != null && o.name === n);
      if (i == null)
        throw (0, jt.newError)(`Cannot find asset "${n}" in: ${JSON.stringify(t.assets, null, 2)}`, "ERR_UPDATER_ASSET_NOT_FOUND");
      return {
        url: new Ls.URL(i.url),
        info: r
      };
    });
  }
}
di.PrivateGitHubProvider = Lv;
Object.defineProperty(ci, "__esModule", { value: !0 });
ci.isUrlProbablySupportMultiRangeRequests = Eu;
ci.createClient = jv;
const An = pe, Uv = ui, ks = Kr, kv = gt, Mv = fi, Bv = di;
function Eu(e) {
  return !e.includes("s3.amazonaws.com");
}
function jv(e, t, r) {
  if (typeof e == "string")
    throw (0, An.newError)("Please pass PublishConfiguration object", "ERR_UPDATER_INVALID_PROVIDER_CONFIGURATION");
  const n = e.provider;
  switch (n) {
    case "github": {
      const i = e, o = (i.private ? process.env.GH_TOKEN || process.env.GITHUB_TOKEN : null) || i.token;
      return o == null ? new kv.GitHubProvider(i, t, r) : new Bv.PrivateGitHubProvider(i, t, o, r);
    }
    case "bitbucket":
      return new Uv.BitbucketProvider(e, t, r);
    case "keygen":
      return new Mv.KeygenProvider(e, t, r);
    case "s3":
    case "spaces":
      return new ks.GenericProvider({
        provider: "generic",
        url: (0, An.getS3LikeProviderBaseUrl)(e),
        channel: e.channel || null
      }, t, {
        ...r,
        // https://github.com/minio/minio/issues/5285#issuecomment-350428955
        isUseMultipleRangeRequest: !1
      });
    case "generic": {
      const i = e;
      return new ks.GenericProvider(i, t, {
        ...r,
        isUseMultipleRangeRequest: i.useMultipleRangeRequest !== !1 && Eu(i.url)
      });
    }
    case "custom": {
      const i = e, o = i.updateProvider;
      if (!o)
        throw (0, An.newError)("Custom provider not specified", "ERR_UPDATER_INVALID_PROVIDER_CONFIGURATION");
      return new o(i, t, r);
    }
    default:
      throw (0, An.newError)(`Unsupported provider: ${n}`, "ERR_UPDATER_UNSUPPORTED_PROVIDER");
  }
}
var hi = {}, Jr = {}, sr = {}, Ut = {};
Object.defineProperty(Ut, "__esModule", { value: !0 });
Ut.OperationKind = void 0;
Ut.computeOperations = Hv;
var It;
(function(e) {
  e[e.COPY = 0] = "COPY", e[e.DOWNLOAD = 1] = "DOWNLOAD";
})(It || (Ut.OperationKind = It = {}));
function Hv(e, t, r) {
  const n = Bs(e.files), i = Bs(t.files);
  let o = null;
  const a = t.files[0], s = [], l = a.name, m = n.get(l);
  if (m == null)
    throw new Error(`no file ${l} in old blockmap`);
  const c = i.get(l);
  let f = 0;
  const { checksumToOffset: h, checksumToOldSize: g } = Gv(n.get(l), m.offset, r);
  let _ = a.offset;
  for (let y = 0; y < c.checksums.length; _ += c.sizes[y], y++) {
    const A = c.sizes[y], T = c.checksums[y];
    let S = h.get(T);
    S != null && g.get(T) !== A && (r.warn(`Checksum ("${T}") matches, but size differs (old: ${g.get(T)}, new: ${A})`), S = void 0), S === void 0 ? (f++, o != null && o.kind === It.DOWNLOAD && o.end === _ ? o.end += A : (o = {
      kind: It.DOWNLOAD,
      start: _,
      end: _ + A
      // oldBlocks: null,
    }, Ms(o, s, T, y))) : o != null && o.kind === It.COPY && o.end === S ? o.end += A : (o = {
      kind: It.COPY,
      start: S,
      end: S + A
      // oldBlocks: [checksum]
    }, Ms(o, s, T, y));
  }
  return f > 0 && r.info(`File${a.name === "file" ? "" : " " + a.name} has ${f} changed blocks`), s;
}
const qv = process.env.DIFFERENTIAL_DOWNLOAD_PLAN_BUILDER_VALIDATE_RANGES === "true";
function Ms(e, t, r, n) {
  if (qv && t.length !== 0) {
    const i = t[t.length - 1];
    if (i.kind === e.kind && e.start < i.end && e.start > i.start) {
      const o = [i.start, i.end, e.start, e.end].reduce((a, s) => a < s ? a : s);
      throw new Error(`operation (block index: ${n}, checksum: ${r}, kind: ${It[e.kind]}) overlaps previous operation (checksum: ${r}):
abs: ${i.start} until ${i.end} and ${e.start} until ${e.end}
rel: ${i.start - o} until ${i.end - o} and ${e.start - o} until ${e.end - o}`);
    }
  }
  t.push(e);
}
function Gv(e, t, r) {
  const n = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map();
  let o = t;
  for (let a = 0; a < e.checksums.length; a++) {
    const s = e.checksums[a], l = e.sizes[a], m = i.get(s);
    if (m === void 0)
      n.set(s, o), i.set(s, l);
    else if (r.debug != null) {
      const c = m === l ? "(same size)" : `(size: ${m}, this size: ${l})`;
      r.debug(`${s} duplicated in blockmap ${c}, it doesn't lead to broken differential downloader, just corresponding block will be skipped)`);
    }
    o += l;
  }
  return { checksumToOffset: n, checksumToOldSize: i };
}
function Bs(e) {
  const t = /* @__PURE__ */ new Map();
  for (const r of e)
    t.set(r.name, r);
  return t;
}
Object.defineProperty(sr, "__esModule", { value: !0 });
sr.DataSplitter = void 0;
sr.copyData = yu;
const Sn = pe, Wv = Et, Vv = jr, Yv = Ut, js = Buffer.from(`\r
\r
`);
var st;
(function(e) {
  e[e.INIT = 0] = "INIT", e[e.HEADER = 1] = "HEADER", e[e.BODY = 2] = "BODY";
})(st || (st = {}));
function yu(e, t, r, n, i) {
  const o = (0, Wv.createReadStream)("", {
    fd: r,
    autoClose: !1,
    start: e.start,
    // end is inclusive
    end: e.end - 1
  });
  o.on("error", n), o.once("end", i), o.pipe(t, {
    end: !1
  });
}
class zv extends Vv.Writable {
  constructor(t, r, n, i, o, a) {
    super(), this.out = t, this.options = r, this.partIndexToTaskIndex = n, this.partIndexToLength = o, this.finishHandler = a, this.partIndex = -1, this.headerListBuffer = null, this.readState = st.INIT, this.ignoreByteCount = 0, this.remainingPartDataCount = 0, this.actualPartLength = 0, this.boundaryLength = i.length + 4, this.ignoreByteCount = this.boundaryLength - 2;
  }
  get isFinished() {
    return this.partIndex === this.partIndexToLength.length;
  }
  // noinspection JSUnusedGlobalSymbols
  _write(t, r, n) {
    if (this.isFinished) {
      console.error(`Trailing ignored data: ${t.length} bytes`);
      return;
    }
    this.handleData(t).then(n).catch(n);
  }
  async handleData(t) {
    let r = 0;
    if (this.ignoreByteCount !== 0 && this.remainingPartDataCount !== 0)
      throw (0, Sn.newError)("Internal error", "ERR_DATA_SPLITTER_BYTE_COUNT_MISMATCH");
    if (this.ignoreByteCount > 0) {
      const n = Math.min(this.ignoreByteCount, t.length);
      this.ignoreByteCount -= n, r = n;
    } else if (this.remainingPartDataCount > 0) {
      const n = Math.min(this.remainingPartDataCount, t.length);
      this.remainingPartDataCount -= n, await this.processPartData(t, 0, n), r = n;
    }
    if (r !== t.length) {
      if (this.readState === st.HEADER) {
        const n = this.searchHeaderListEnd(t, r);
        if (n === -1)
          return;
        r = n, this.readState = st.BODY, this.headerListBuffer = null;
      }
      for (; ; ) {
        if (this.readState === st.BODY)
          this.readState = st.INIT;
        else {
          this.partIndex++;
          let a = this.partIndexToTaskIndex.get(this.partIndex);
          if (a == null)
            if (this.isFinished)
              a = this.options.end;
            else
              throw (0, Sn.newError)("taskIndex is null", "ERR_DATA_SPLITTER_TASK_INDEX_IS_NULL");
          const s = this.partIndex === 0 ? this.options.start : this.partIndexToTaskIndex.get(this.partIndex - 1) + 1;
          if (s < a)
            await this.copyExistingData(s, a);
          else if (s > a)
            throw (0, Sn.newError)("prevTaskIndex must be < taskIndex", "ERR_DATA_SPLITTER_TASK_INDEX_ASSERT_FAILED");
          if (this.isFinished) {
            this.onPartEnd(), this.finishHandler();
            return;
          }
          if (r = this.searchHeaderListEnd(t, r), r === -1) {
            this.readState = st.HEADER;
            return;
          }
        }
        const n = this.partIndexToLength[this.partIndex], i = r + n, o = Math.min(i, t.length);
        if (await this.processPartStarted(t, r, o), this.remainingPartDataCount = n - (o - r), this.remainingPartDataCount > 0)
          return;
        if (r = i + this.boundaryLength, r >= t.length) {
          this.ignoreByteCount = this.boundaryLength - (t.length - i);
          return;
        }
      }
    }
  }
  copyExistingData(t, r) {
    return new Promise((n, i) => {
      const o = () => {
        if (t === r) {
          n();
          return;
        }
        const a = this.options.tasks[t];
        if (a.kind !== Yv.OperationKind.COPY) {
          i(new Error("Task kind must be COPY"));
          return;
        }
        yu(a, this.out, this.options.oldFileFd, i, () => {
          t++, o();
        });
      };
      o();
    });
  }
  searchHeaderListEnd(t, r) {
    const n = t.indexOf(js, r);
    if (n !== -1)
      return n + js.length;
    const i = r === 0 ? t : t.slice(r);
    return this.headerListBuffer == null ? this.headerListBuffer = i : this.headerListBuffer = Buffer.concat([this.headerListBuffer, i]), -1;
  }
  onPartEnd() {
    const t = this.partIndexToLength[this.partIndex - 1];
    if (this.actualPartLength !== t)
      throw (0, Sn.newError)(`Expected length: ${t} differs from actual: ${this.actualPartLength}`, "ERR_DATA_SPLITTER_LENGTH_MISMATCH");
    this.actualPartLength = 0;
  }
  processPartStarted(t, r, n) {
    return this.partIndex !== 0 && this.onPartEnd(), this.processPartData(t, r, n);
  }
  processPartData(t, r, n) {
    this.actualPartLength += n - r;
    const i = this.out;
    return i.write(r === 0 && t.length === n ? t : t.slice(r, n)) ? Promise.resolve() : new Promise((o, a) => {
      i.on("error", a), i.once("drain", () => {
        i.removeListener("error", a), o();
      });
    });
  }
}
sr.DataSplitter = zv;
var pi = {};
Object.defineProperty(pi, "__esModule", { value: !0 });
pi.executeTasksUsingMultipleRangeRequests = Xv;
pi.checkIsRangesSupported = Eo;
const go = pe, Hs = sr, qs = Ut;
function Xv(e, t, r, n, i) {
  const o = (a) => {
    if (a >= t.length) {
      e.fileMetadataBuffer != null && r.write(e.fileMetadataBuffer), r.end();
      return;
    }
    const s = a + 1e3;
    Kv(e, {
      tasks: t,
      start: a,
      end: Math.min(t.length, s),
      oldFileFd: n
    }, r, () => o(s), i);
  };
  return o;
}
function Kv(e, t, r, n, i) {
  let o = "bytes=", a = 0;
  const s = /* @__PURE__ */ new Map(), l = [];
  for (let f = t.start; f < t.end; f++) {
    const h = t.tasks[f];
    h.kind === qs.OperationKind.DOWNLOAD && (o += `${h.start}-${h.end - 1}, `, s.set(a, f), a++, l.push(h.end - h.start));
  }
  if (a <= 1) {
    const f = (h) => {
      if (h >= t.end) {
        n();
        return;
      }
      const g = t.tasks[h++];
      if (g.kind === qs.OperationKind.COPY)
        (0, Hs.copyData)(g, r, t.oldFileFd, i, () => f(h));
      else {
        const _ = e.createRequestOptions();
        _.headers.Range = `bytes=${g.start}-${g.end - 1}`;
        const y = e.httpExecutor.createRequest(_, (A) => {
          Eo(A, i) && (A.pipe(r, {
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
    if (!Eo(f, i))
      return;
    const h = (0, go.safeGetHeader)(f, "content-type"), g = /^multipart\/.+?(?:; boundary=(?:(?:"(.+)")|(?:([^\s]+))))$/i.exec(h);
    if (g == null) {
      i(new Error(`Content-Type "multipart/byteranges" is expected, but got "${h}"`));
      return;
    }
    const _ = new Hs.DataSplitter(r, t, s, g[1] || g[2], l, n);
    _.on("error", i), f.pipe(_), f.on("end", () => {
      setTimeout(() => {
        c.abort(), i(new Error("Response ends without calling any handlers"));
      }, 1e4);
    });
  });
  e.httpExecutor.addErrorAndTimeoutHandlers(c, i), c.end();
}
function Eo(e, t) {
  if (e.statusCode >= 400)
    return t((0, go.createHttpError)(e)), !1;
  if (e.statusCode !== 206) {
    const r = (0, go.safeGetHeader)(e, "accept-ranges");
    if (r == null || r === "none")
      return t(new Error(`Server doesn't support Accept-Ranges (response code ${e.statusCode})`)), !1;
  }
  return !0;
}
var mi = {};
Object.defineProperty(mi, "__esModule", { value: !0 });
mi.ProgressDifferentialDownloadCallbackTransform = void 0;
const Jv = jr;
var Kt;
(function(e) {
  e[e.COPY = 0] = "COPY", e[e.DOWNLOAD = 1] = "DOWNLOAD";
})(Kt || (Kt = {}));
class Qv extends Jv.Transform {
  constructor(t, r, n) {
    super(), this.progressDifferentialDownloadInfo = t, this.cancellationToken = r, this.onProgress = n, this.start = Date.now(), this.transferred = 0, this.delta = 0, this.expectedBytes = 0, this.index = 0, this.operationType = Kt.COPY, this.nextUpdate = this.start + 1e3;
  }
  _transform(t, r, n) {
    if (this.cancellationToken.cancelled) {
      n(new Error("cancelled"), null);
      return;
    }
    if (this.operationType == Kt.COPY) {
      n(null, t);
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
    }), this.delta = 0), n(null, t);
  }
  beginFileCopy() {
    this.operationType = Kt.COPY;
  }
  beginRangeDownload() {
    this.operationType = Kt.DOWNLOAD, this.expectedBytes += this.progressDifferentialDownloadInfo.expectedByteCounts[this.index++];
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
mi.ProgressDifferentialDownloadCallbackTransform = Qv;
Object.defineProperty(Jr, "__esModule", { value: !0 });
Jr.DifferentialDownloader = void 0;
const gr = pe, Ki = yt, Zv = Et, ew = sr, tw = nr, Tn = Ut, Gs = pi, rw = mi;
class nw {
  // noinspection TypeScriptAbstractClassConstructorCanBeMadeProtected
  constructor(t, r, n) {
    this.blockAwareFileInfo = t, this.httpExecutor = r, this.options = n, this.fileMetadataBuffer = null, this.logger = n.logger;
  }
  createRequestOptions() {
    const t = {
      headers: {
        ...this.options.requestHeaders,
        accept: "*/*"
      }
    };
    return (0, gr.configureRequestUrl)(this.options.newUrl, t), (0, gr.configureRequestOptions)(t), t;
  }
  doDownload(t, r) {
    if (t.version !== r.version)
      throw new Error(`version is different (${t.version} - ${r.version}), full download is required`);
    const n = this.logger, i = (0, Tn.computeOperations)(t, r, n);
    n.debug != null && n.debug(JSON.stringify(i, null, 2));
    let o = 0, a = 0;
    for (const l of i) {
      const m = l.end - l.start;
      l.kind === Tn.OperationKind.DOWNLOAD ? o += m : a += m;
    }
    const s = this.blockAwareFileInfo.size;
    if (o + a + (this.fileMetadataBuffer == null ? 0 : this.fileMetadataBuffer.length) !== s)
      throw new Error(`Internal error, size mismatch: downloadSize: ${o}, copySize: ${a}, newSize: ${s}`);
    return n.info(`Full: ${Ws(s)}, To download: ${Ws(o)} (${Math.round(o / (s / 100))}%)`), this.downloadFile(i);
  }
  downloadFile(t) {
    const r = [], n = () => Promise.all(r.map((i) => (0, Ki.close)(i.descriptor).catch((o) => {
      this.logger.error(`cannot close file "${i.path}": ${o}`);
    })));
    return this.doDownloadFile(t, r).then(n).catch((i) => n().catch((o) => {
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
  async doDownloadFile(t, r) {
    const n = await (0, Ki.open)(this.options.oldFile, "r");
    r.push({ descriptor: n, path: this.options.oldFile });
    const i = await (0, Ki.open)(this.options.newFile, "w");
    r.push({ descriptor: i, path: this.options.newFile });
    const o = (0, Zv.createWriteStream)(this.options.newFile, { fd: i });
    await new Promise((a, s) => {
      const l = [];
      let m;
      if (!this.options.isUseMultipleRangeRequest && this.options.onProgress) {
        const T = [];
        let S = 0;
        for (const x of t)
          x.kind === Tn.OperationKind.DOWNLOAD && (T.push(x.end - x.start), S += x.end - x.start);
        const N = {
          expectedByteCounts: T,
          grandTotal: S
        };
        m = new rw.ProgressDifferentialDownloadCallbackTransform(N, this.options.cancellationToken, this.options.onProgress), l.push(m);
      }
      const c = new gr.DigestTransform(this.blockAwareFileInfo.sha512);
      c.isValidateOnEnd = !1, l.push(c), o.on("finish", () => {
        o.close(() => {
          r.splice(1, 1);
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
        g = (0, Gs.executeTasksUsingMultipleRangeRequests)(this, t, h, n, s), g(0);
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
        if (x.kind === Tn.OperationKind.COPY) {
          m && m.beginFileCopy(), (0, ew.copyData)(x, h, n, s, () => g(T));
          return;
        }
        const Q = `bytes=${x.start}-${x.end - 1}`;
        A.headers.range = Q, (N = (S = this.logger) === null || S === void 0 ? void 0 : S.debug) === null || N === void 0 || N.call(S, `download range: ${Q}`), m && m.beginRangeDownload();
        const oe = this.httpExecutor.createRequest(A, (V) => {
          V.on("error", s), V.on("aborted", () => {
            s(new Error("response has been aborted by the server"));
          }), V.statusCode >= 400 && s((0, gr.createHttpError)(V)), V.pipe(h, {
            end: !1
          }), V.once("end", () => {
            m && m.endRangeDownload(), ++_ === 100 ? (_ = 0, setTimeout(() => g(T), 1e3)) : g(T);
          });
        });
        oe.on("redirect", (V, Fe, E) => {
          this.logger.info(`Redirect to ${iw(E)}`), y = E, (0, gr.configureRequestUrl)(new tw.URL(y), A), oe.followRedirect();
        }), this.httpExecutor.addErrorAndTimeoutHandlers(oe, s), oe.end();
      }, g(0);
    });
  }
  async readRemoteBytes(t, r) {
    const n = Buffer.allocUnsafe(r + 1 - t), i = this.createRequestOptions();
    i.headers.range = `bytes=${t}-${r}`;
    let o = 0;
    if (await this.request(i, (a) => {
      a.copy(n, o), o += a.length;
    }), o !== n.length)
      throw new Error(`Received data length ${o} is not equal to expected ${n.length}`);
    return n;
  }
  request(t, r) {
    return new Promise((n, i) => {
      const o = this.httpExecutor.createRequest(t, (a) => {
        (0, Gs.checkIsRangesSupported)(a, i) && (a.on("error", i), a.on("aborted", () => {
          i(new Error("response has been aborted by the server"));
        }), a.on("data", r), a.on("end", () => n()));
      });
      this.httpExecutor.addErrorAndTimeoutHandlers(o, i), o.end();
    });
  }
}
Jr.DifferentialDownloader = nw;
function Ws(e, t = " KB") {
  return new Intl.NumberFormat("en").format((e / 1024).toFixed(2)) + t;
}
function iw(e) {
  const t = e.indexOf("?");
  return t < 0 ? e : e.substring(0, t);
}
Object.defineProperty(hi, "__esModule", { value: !0 });
hi.GenericDifferentialDownloader = void 0;
const ow = Jr;
class aw extends ow.DifferentialDownloader {
  download(t, r) {
    return this.doDownload(t, r);
  }
}
hi.GenericDifferentialDownloader = aw;
var vt = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.UpdaterSignal = e.UPDATE_DOWNLOADED = e.DOWNLOAD_PROGRESS = e.CancellationToken = void 0, e.addHandler = n;
  const t = pe;
  Object.defineProperty(e, "CancellationToken", { enumerable: !0, get: function() {
    return t.CancellationToken;
  } }), e.DOWNLOAD_PROGRESS = "download-progress", e.UPDATE_DOWNLOADED = "update-downloaded";
  class r {
    constructor(o) {
      this.emitter = o;
    }
    /**
     * Emitted when an authenticating proxy is [asking for user credentials](https://github.com/electron/electron/blob/master/docs/api/client-request.md#event-login).
     */
    login(o) {
      n(this.emitter, "login", o);
    }
    progress(o) {
      n(this.emitter, e.DOWNLOAD_PROGRESS, o);
    }
    updateDownloaded(o) {
      n(this.emitter, e.UPDATE_DOWNLOADED, o);
    }
    updateCancelled(o) {
      n(this.emitter, "update-cancelled", o);
    }
  }
  e.UpdaterSignal = r;
  function n(i, o, a) {
    i.on(o, a);
  }
})(vt);
Object.defineProperty(dt, "__esModule", { value: !0 });
dt.NoOpLogger = dt.AppUpdater = void 0;
const Se = pe, sw = Hr, lw = Yn, cw = dl, Ht = yt, uw = ye, Ji = ri, Ct = re, $t = uu, Vs = Xr, fw = li, Ys = fu, dw = Kr, Qi = ci, hw = pl, pw = ke, mw = hi, qt = vt;
class zo extends cw.EventEmitter {
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
    return (0, Ys.getNetSession)();
  }
  /**
   * The logger. You can pass [electron-log](https://github.com/megahertz/electron-log), [winston](https://github.com/winstonjs/winston) or another logger with the following interface: `{ info(), warn(), error() }`.
   * Set it to `null` if you would like to disable a logging feature.
   */
  get logger() {
    return this._logger;
  }
  set logger(t) {
    this._logger = t ?? new vu();
  }
  // noinspection JSUnusedGlobalSymbols
  /**
   * test only
   * @private
   */
  set updateConfigPath(t) {
    this.clientPromise = null, this._appUpdateConfigPath = t, this.configOnDisk = new Ji.Lazy(() => this.loadUpdateConfig());
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
  constructor(t, r) {
    super(), this.autoDownload = !0, this.autoInstallOnAppQuit = !0, this.autoRunAppAfterInstall = !0, this.allowPrerelease = !1, this.fullChangelog = !1, this.allowDowngrade = !1, this.disableWebInstaller = !1, this.disableDifferentialDownload = !1, this.forceDevUpdateConfig = !1, this._channel = null, this.downloadedUpdateHelper = null, this.requestHeaders = null, this._logger = console, this.signals = new qt.UpdaterSignal(this), this._appUpdateConfigPath = null, this._isUpdateSupported = (o) => this.checkIfUpdateSupported(o), this.clientPromise = null, this.stagingUserIdPromise = new Ji.Lazy(() => this.getOrCreateStagingUserId()), this.configOnDisk = new Ji.Lazy(() => this.loadUpdateConfig()), this.checkForUpdatesPromise = null, this.downloadPromise = null, this.updateInfoAndProvider = null, this._testOnlyOptions = null, this.on("error", (o) => {
      this._logger.error(`Error: ${o.stack || o.message}`);
    }), r == null ? (this.app = new fw.ElectronAppAdapter(), this.httpExecutor = new Ys.ElectronHttpExecutor((o, a) => this.emit("login", o, a))) : (this.app = r, this.httpExecutor = null);
    const n = this.app.version, i = (0, $t.parse)(n);
    if (i == null)
      throw (0, Se.newError)(`App version is not a valid semver version: "${n}"`, "ERR_UPDATER_INVALID_VERSION");
    this.currentVersion = i, this.allowPrerelease = gw(i), t != null && (this.setFeedURL(t), typeof t != "string" && t.requestHeaders && (this.requestHeaders = t.requestHeaders));
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
    const r = this.createProviderRuntimeOptions();
    let n;
    typeof t == "string" ? n = new dw.GenericProvider({ provider: "generic", url: t }, this, {
      ...r,
      isUseMultipleRangeRequest: (0, Qi.isUrlProbablySupportMultiRangeRequests)(t)
    }) : n = (0, Qi.createClient)(t, this, r), this.clientPromise = Promise.resolve(n);
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
    const r = () => this.checkForUpdatesPromise = null;
    return this._logger.info("Checking for update"), t = this.doCheckForUpdates().then((n) => (r(), n)).catch((n) => {
      throw r(), this.emit("error", n, `Cannot check for updates: ${(n.stack || n).toString()}`), n;
    }), this.checkForUpdatesPromise = t, t;
  }
  isUpdaterActive() {
    return this.app.isPackaged || this.forceDevUpdateConfig ? !0 : (this._logger.info("Skip checkForUpdates because application is not packed and dev update config is not forced"), !1);
  }
  // noinspection JSUnusedGlobalSymbols
  checkForUpdatesAndNotify(t) {
    return this.checkForUpdates().then((r) => r != null && r.downloadPromise ? (r.downloadPromise.then(() => {
      const n = zo.formatDownloadNotification(r.updateInfo.version, this.app.name, t);
      new Dt.Notification(n).show();
    }), r) : (this._logger.debug != null && this._logger.debug("checkForUpdatesAndNotify called, downloadPromise is null"), r));
  }
  static formatDownloadNotification(t, r, n) {
    return n == null && (n = {
      title: "A new update is ready to install",
      body: "{appName} version {version} has been downloaded and will be automatically installed on exit"
    }), n = {
      title: n.title.replace("{appName}", r).replace("{version}", t),
      body: n.body.replace("{appName}", r).replace("{version}", t)
    }, n;
  }
  async isStagingMatch(t) {
    const r = t.stagingPercentage;
    let n = r;
    if (n == null)
      return !0;
    if (n = parseInt(n, 10), isNaN(n))
      return this._logger.warn(`Staging percentage is NaN: ${r}`), !0;
    n = n / 100;
    const i = await this.stagingUserIdPromise.value, a = Se.UUID.parse(i).readUInt32BE(12) / 4294967295;
    return this._logger.info(`Staging percentage: ${n}, percentage: ${a}, user id: ${i}`), a < n;
  }
  computeFinalHeaders(t) {
    return this.requestHeaders != null && Object.assign(t, this.requestHeaders), t;
  }
  async isUpdateAvailable(t) {
    const r = (0, $t.parse)(t.version);
    if (r == null)
      throw (0, Se.newError)(`This file could not be downloaded, or the latest version (from update server) does not have a valid semver version: "${t.version}"`, "ERR_UPDATER_INVALID_VERSION");
    const n = this.currentVersion;
    if ((0, $t.eq)(r, n) || !await Promise.resolve(this.isUpdateSupported(t)) || !await this.isStagingMatch(t))
      return !1;
    const o = (0, $t.gt)(r, n), a = (0, $t.lt)(r, n);
    return o ? !0 : this.allowDowngrade && a;
  }
  checkIfUpdateSupported(t) {
    const r = t == null ? void 0 : t.minimumSystemVersion, n = (0, lw.release)();
    if (r)
      try {
        if ((0, $t.lt)(n, r))
          return this._logger.info(`Current OS version ${n} is less than the minimum OS version required ${r} for version ${n}`), !1;
      } catch (i) {
        this._logger.warn(`Failed to compare current OS version(${n}) with minimum OS version(${r}): ${(i.message || i).toString()}`);
      }
    return !0;
  }
  async getUpdateInfoAndProvider() {
    await this.app.whenReady(), this.clientPromise == null && (this.clientPromise = this.configOnDisk.value.then((n) => (0, Qi.createClient)(n, this, this.createProviderRuntimeOptions())));
    const t = await this.clientPromise, r = await this.stagingUserIdPromise.value;
    return t.setRequestHeaders(this.computeFinalHeaders({ "x-user-staging-id": r })), {
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
    const t = await this.getUpdateInfoAndProvider(), r = t.info;
    if (!await this.isUpdateAvailable(r))
      return this._logger.info(`Update for version ${this.currentVersion.format()} is not available (latest version: ${r.version}, downgrade is ${this.allowDowngrade ? "allowed" : "disallowed"}).`), this.emit("update-not-available", r), {
        isUpdateAvailable: !1,
        versionInfo: r,
        updateInfo: r
      };
    this.updateInfoAndProvider = t, this.onUpdateAvailable(r);
    const n = new Se.CancellationToken();
    return {
      isUpdateAvailable: !0,
      versionInfo: r,
      updateInfo: r,
      cancellationToken: n,
      downloadPromise: this.autoDownload ? this.downloadUpdate(n) : null
    };
  }
  onUpdateAvailable(t) {
    this._logger.info(`Found version ${t.version} (url: ${(0, Se.asArray)(t.files).map((r) => r.url).join(", ")})`), this.emit("update-available", t);
  }
  /**
   * Start downloading update manually. You can use this method if `autoDownload` option is set to `false`.
   * @returns {Promise<Array<string>>} Paths to downloaded files.
   */
  downloadUpdate(t = new Se.CancellationToken()) {
    const r = this.updateInfoAndProvider;
    if (r == null) {
      const i = new Error("Please check update first");
      return this.dispatchError(i), Promise.reject(i);
    }
    if (this.downloadPromise != null)
      return this._logger.info("Downloading update (already in progress)"), this.downloadPromise;
    this._logger.info(`Downloading update from ${(0, Se.asArray)(r.info.files).map((i) => i.url).join(", ")}`);
    const n = (i) => {
      if (!(i instanceof Se.CancellationError))
        try {
          this.dispatchError(i);
        } catch (o) {
          this._logger.warn(`Cannot dispatch error event: ${o.stack || o}`);
        }
      return i;
    };
    return this.downloadPromise = this.doDownloadUpdate({
      updateInfoAndProvider: r,
      requestHeaders: this.computeRequestHeaders(r.provider),
      cancellationToken: t,
      disableWebInstaller: this.disableWebInstaller,
      disableDifferentialDownload: this.disableDifferentialDownload
    }).catch((i) => {
      throw n(i);
    }).finally(() => {
      this.downloadPromise = null;
    }), this.downloadPromise;
  }
  dispatchError(t) {
    this.emit("error", t, (t.stack || t).toString());
  }
  dispatchUpdateDownloaded(t) {
    this.emit(qt.UPDATE_DOWNLOADED, t);
  }
  async loadUpdateConfig() {
    return this._appUpdateConfigPath == null && (this._appUpdateConfigPath = this.app.appUpdateConfigPath), (0, uw.load)(await (0, Ht.readFile)(this._appUpdateConfigPath, "utf-8"));
  }
  computeRequestHeaders(t) {
    const r = t.fileExtraDownloadHeaders;
    if (r != null) {
      const n = this.requestHeaders;
      return n == null ? r : {
        ...r,
        ...n
      };
    }
    return this.computeFinalHeaders({ accept: "*/*" });
  }
  async getOrCreateStagingUserId() {
    const t = Ct.join(this.app.userDataPath, ".updaterId");
    try {
      const n = await (0, Ht.readFile)(t, "utf-8");
      if (Se.UUID.check(n))
        return n;
      this._logger.warn(`Staging user id file exists, but content was invalid: ${n}`);
    } catch (n) {
      n.code !== "ENOENT" && this._logger.warn(`Couldn't read staging user ID, creating a blank one: ${n}`);
    }
    const r = Se.UUID.v5((0, sw.randomBytes)(4096), Se.UUID.OID);
    this._logger.info(`Generated new staging user ID: ${r}`);
    try {
      await (0, Ht.outputFile)(t, r);
    } catch (n) {
      this._logger.warn(`Couldn't write out staging user ID: ${n}`);
    }
    return r;
  }
  /** @internal */
  get isAddNoCacheQuery() {
    const t = this.requestHeaders;
    if (t == null)
      return !0;
    for (const r of Object.keys(t)) {
      const n = r.toLowerCase();
      if (n === "authorization" || n === "private-token")
        return !1;
    }
    return !0;
  }
  async getOrCreateDownloadHelper() {
    let t = this.downloadedUpdateHelper;
    if (t == null) {
      const r = (await this.configOnDisk.value).updaterCacheDirName, n = this._logger;
      r == null && n.error("updaterCacheDirName is not specified in app-update.yml Was app build using at least electron-builder 20.34.0?");
      const i = Ct.join(this.app.baseCachePath, r || this.app.name);
      n.debug != null && n.debug(`updater cache dir: ${i}`), t = new Vs.DownloadedUpdateHelper(i), this.downloadedUpdateHelper = t;
    }
    return t;
  }
  async executeDownload(t) {
    const r = t.fileInfo, n = {
      headers: t.downloadUpdateOptions.requestHeaders,
      cancellationToken: t.downloadUpdateOptions.cancellationToken,
      sha2: r.info.sha2,
      sha512: r.info.sha512
    };
    this.listenerCount(qt.DOWNLOAD_PROGRESS) > 0 && (n.onProgress = (S) => this.emit(qt.DOWNLOAD_PROGRESS, S));
    const i = t.downloadUpdateOptions.updateInfoAndProvider.info, o = i.version, a = r.packageInfo;
    function s() {
      const S = decodeURIComponent(t.fileInfo.url.pathname);
      return S.endsWith(`.${t.fileExtension}`) ? Ct.basename(S) : t.fileInfo.info.url;
    }
    const l = await this.getOrCreateDownloadHelper(), m = l.cacheDirForPendingUpdate;
    await (0, Ht.mkdir)(m, { recursive: !0 });
    const c = s();
    let f = Ct.join(m, c);
    const h = a == null ? null : Ct.join(m, `package-${o}${Ct.extname(a.path) || ".7z"}`), g = async (S) => (await l.setDownloadedFile(f, h, i, r, c, S), await t.done({
      ...i,
      downloadedFile: f
    }), h == null ? [f] : [f, h]), _ = this._logger, y = await l.validateDownloadedPath(f, i, r, _);
    if (y != null)
      return f = y, await g(!1);
    const A = async () => (await l.clear().catch(() => {
    }), await (0, Ht.unlink)(f).catch(() => {
    })), T = await (0, Vs.createTempUpdateFile)(`temp-${c}`, m, _);
    try {
      await t.task(T, n, h, A), await (0, Se.retry)(() => (0, Ht.rename)(T, f), 60, 500, 0, 0, (S) => S instanceof Error && /^EBUSY:/.test(S.message));
    } catch (S) {
      throw await A(), S instanceof Se.CancellationError && (_.info("cancelled"), this.emit("update-cancelled", i)), S;
    }
    return _.info(`New version ${o} has been downloaded to ${f}`), await g(!0);
  }
  async differentialDownloadInstaller(t, r, n, i, o) {
    try {
      if (this._testOnlyOptions != null && !this._testOnlyOptions.isUseDifferentialDownload)
        return !0;
      const a = (0, pw.blockmapFiles)(t.url, this.app.version, r.updateInfoAndProvider.info.version);
      this._logger.info(`Download block maps (old: "${a[0]}", new: ${a[1]})`);
      const s = async (c) => {
        const f = await this.httpExecutor.downloadToBuffer(c, {
          headers: r.requestHeaders,
          cancellationToken: r.cancellationToken
        });
        if (f == null || f.length === 0)
          throw new Error(`Blockmap "${c.href}" is empty`);
        try {
          return JSON.parse((0, hw.gunzipSync)(f).toString());
        } catch (h) {
          throw new Error(`Cannot parse blockmap "${c.href}", error: ${h}`);
        }
      }, l = {
        newUrl: t.url,
        oldFile: Ct.join(this.downloadedUpdateHelper.cacheDir, o),
        logger: this._logger,
        newFile: n,
        isUseMultipleRangeRequest: i.isUseMultipleRangeRequest,
        requestHeaders: r.requestHeaders,
        cancellationToken: r.cancellationToken
      };
      this.listenerCount(qt.DOWNLOAD_PROGRESS) > 0 && (l.onProgress = (c) => this.emit(qt.DOWNLOAD_PROGRESS, c));
      const m = await Promise.all(a.map((c) => s(c)));
      return await new mw.GenericDifferentialDownloader(t.info, this.httpExecutor, l).download(m[0], m[1]), !1;
    } catch (a) {
      if (this._logger.error(`Cannot download differentially, fallback to full download: ${a.stack || a}`), this._testOnlyOptions != null)
        throw a;
      return !0;
    }
  }
}
dt.AppUpdater = zo;
function gw(e) {
  const t = (0, $t.prerelease)(e);
  return t != null && t.length > 0;
}
class vu {
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
dt.NoOpLogger = vu;
Object.defineProperty(tt, "__esModule", { value: !0 });
tt.BaseUpdater = void 0;
const zs = Vn, Ew = dt;
class yw extends Ew.AppUpdater {
  constructor(t, r) {
    super(t, r), this.quitAndInstallCalled = !1, this.quitHandlerAdded = !1;
  }
  quitAndInstall(t = !1, r = !1) {
    this._logger.info("Install on explicit quitAndInstall"), this.install(t, t ? r : this.autoRunAppAfterInstall) ? setImmediate(() => {
      Dt.autoUpdater.emit("before-quit-for-update"), this.app.quit();
    }) : this.quitAndInstallCalled = !1;
  }
  executeDownload(t) {
    return super.executeDownload({
      ...t,
      done: (r) => (this.dispatchUpdateDownloaded(r), this.addQuitHandler(), Promise.resolve())
    });
  }
  get installerPath() {
    return this.downloadedUpdateHelper == null ? null : this.downloadedUpdateHelper.file;
  }
  // must be sync (because quit even handler is not async)
  install(t = !1, r = !1) {
    if (this.quitAndInstallCalled)
      return this._logger.warn("install call ignored: quitAndInstallCalled is set to true"), !1;
    const n = this.downloadedUpdateHelper, i = this.installerPath, o = n == null ? null : n.downloadedFileInfo;
    if (i == null || o == null)
      return this.dispatchError(new Error("No valid update available, can't quit and install")), !1;
    this.quitAndInstallCalled = !0;
    try {
      return this._logger.info(`Install: isSilent: ${t}, isForceRunAfter: ${r}`), this.doInstall({
        isSilent: t,
        isForceRunAfter: r,
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
    const { name: t } = this.app, r = `"${t} would like to update"`, n = this.spawnSyncLog("which gksudo || which kdesudo || which pkexec || which beesu"), i = [n];
    return /kdesudo/i.test(n) ? (i.push("--comment", r), i.push("-c")) : /gksudo/i.test(n) ? i.push("--message", r) : /pkexec/i.test(n) && i.push("--disable-internal-agent"), i.join(" ");
  }
  spawnSyncLog(t, r = [], n = {}) {
    this._logger.info(`Executing: ${t} with args: ${r}`);
    const i = (0, zs.spawnSync)(t, r, {
      env: { ...process.env, ...n },
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
  async spawnLog(t, r = [], n = void 0, i = "ignore") {
    return this._logger.info(`Executing: ${t} with args: ${r}`), new Promise((o, a) => {
      try {
        const s = { stdio: i, env: n, detached: !0 }, l = (0, zs.spawn)(t, r, s);
        l.on("error", (m) => {
          a(m);
        }), l.unref(), l.pid !== void 0 && o(!0);
      } catch (s) {
        a(s);
      }
    });
  }
}
tt.BaseUpdater = yw;
var xr = {}, Qr = {};
Object.defineProperty(Qr, "__esModule", { value: !0 });
Qr.FileWithEmbeddedBlockMapDifferentialDownloader = void 0;
const Gt = yt, vw = Jr, ww = pl;
class _w extends vw.DifferentialDownloader {
  async download() {
    const t = this.blockAwareFileInfo, r = t.size, n = r - (t.blockMapSize + 4);
    this.fileMetadataBuffer = await this.readRemoteBytes(n, r - 1);
    const i = wu(this.fileMetadataBuffer.slice(0, this.fileMetadataBuffer.length - 4));
    await this.doDownload(await Aw(this.options.oldFile), i);
  }
}
Qr.FileWithEmbeddedBlockMapDifferentialDownloader = _w;
function wu(e) {
  return JSON.parse((0, ww.inflateRawSync)(e).toString());
}
async function Aw(e) {
  const t = await (0, Gt.open)(e, "r");
  try {
    const r = (await (0, Gt.fstat)(t)).size, n = Buffer.allocUnsafe(4);
    await (0, Gt.read)(t, n, 0, n.length, r - n.length);
    const i = Buffer.allocUnsafe(n.readUInt32BE(0));
    return await (0, Gt.read)(t, i, 0, i.length, r - n.length - i.length), await (0, Gt.close)(t), wu(i);
  } catch (r) {
    throw await (0, Gt.close)(t), r;
  }
}
Object.defineProperty(xr, "__esModule", { value: !0 });
xr.AppImageUpdater = void 0;
const Xs = pe, Ks = Vn, Sw = yt, Tw = Et, Er = re, Cw = tt, bw = Qr, $w = ue, Js = vt;
class Ow extends Cw.BaseUpdater {
  constructor(t, r) {
    super(t, r);
  }
  isUpdaterActive() {
    return process.env.APPIMAGE == null ? (process.env.SNAP == null ? this._logger.warn("APPIMAGE env is not defined, current application is not an AppImage") : this._logger.info("SNAP env is defined, updater is disabled"), !1) : super.isUpdaterActive();
  }
  /*** @private */
  doDownloadUpdate(t) {
    const r = t.updateInfoAndProvider.provider, n = (0, $w.findFile)(r.resolveFiles(t.updateInfoAndProvider.info), "AppImage", ["rpm", "deb", "pacman"]);
    return this.executeDownload({
      fileExtension: "AppImage",
      fileInfo: n,
      downloadUpdateOptions: t,
      task: async (i, o) => {
        const a = process.env.APPIMAGE;
        if (a == null)
          throw (0, Xs.newError)("APPIMAGE env is not defined", "ERR_UPDATER_OLD_FILE_NOT_FOUND");
        (t.disableDifferentialDownload || await this.downloadDifferential(n, a, i, r, t)) && await this.httpExecutor.download(n.url, i, o), await (0, Sw.chmod)(i, 493);
      }
    });
  }
  async downloadDifferential(t, r, n, i, o) {
    try {
      const a = {
        newUrl: t.url,
        oldFile: r,
        logger: this._logger,
        newFile: n,
        isUseMultipleRangeRequest: i.isUseMultipleRangeRequest,
        requestHeaders: o.requestHeaders,
        cancellationToken: o.cancellationToken
      };
      return this.listenerCount(Js.DOWNLOAD_PROGRESS) > 0 && (a.onProgress = (s) => this.emit(Js.DOWNLOAD_PROGRESS, s)), await new bw.FileWithEmbeddedBlockMapDifferentialDownloader(t.info, this.httpExecutor, a).download(), !1;
    } catch (a) {
      return this._logger.error(`Cannot download differentially, fallback to full download: ${a.stack || a}`), process.platform === "linux";
    }
  }
  doInstall(t) {
    const r = process.env.APPIMAGE;
    if (r == null)
      throw (0, Xs.newError)("APPIMAGE env is not defined", "ERR_UPDATER_OLD_FILE_NOT_FOUND");
    (0, Tw.unlinkSync)(r);
    let n;
    const i = Er.basename(r), o = this.installerPath;
    if (o == null)
      return this.dispatchError(new Error("No valid update available, can't quit and install")), !1;
    Er.basename(o) === i || !/\d+\.\d+\.\d+/.test(i) ? n = r : n = Er.join(Er.dirname(r), Er.basename(o)), (0, Ks.execFileSync)("mv", ["-f", o, n]), n !== r && this.emit("appimage-filename-updated", n);
    const a = {
      ...process.env,
      APPIMAGE_SILENT_INSTALL: "true"
    };
    return t.isForceRunAfter ? this.spawnLog(n, [], a) : (a.APPIMAGE_EXIT_AFTER_INSTALL = "true", (0, Ks.execFileSync)(n, [], { env: a })), !0;
  }
}
xr.AppImageUpdater = Ow;
var Lr = {};
Object.defineProperty(Lr, "__esModule", { value: !0 });
Lr.DebUpdater = void 0;
const Iw = tt, Rw = ue, Qs = vt;
class Pw extends Iw.BaseUpdater {
  constructor(t, r) {
    super(t, r);
  }
  /*** @private */
  doDownloadUpdate(t) {
    const r = t.updateInfoAndProvider.provider, n = (0, Rw.findFile)(r.resolveFiles(t.updateInfoAndProvider.info), "deb", ["AppImage", "rpm", "pacman"]);
    return this.executeDownload({
      fileExtension: "deb",
      fileInfo: n,
      downloadUpdateOptions: t,
      task: async (i, o) => {
        this.listenerCount(Qs.DOWNLOAD_PROGRESS) > 0 && (o.onProgress = (a) => this.emit(Qs.DOWNLOAD_PROGRESS, a)), await this.httpExecutor.download(n.url, i, o);
      }
    });
  }
  get installerPath() {
    var t, r;
    return (r = (t = super.installerPath) === null || t === void 0 ? void 0 : t.replace(/ /g, "\\ ")) !== null && r !== void 0 ? r : null;
  }
  doInstall(t) {
    const r = this.wrapSudo(), n = /pkexec/i.test(r) ? "" : '"', i = this.installerPath;
    if (i == null)
      return this.dispatchError(new Error("No valid update available, can't quit and install")), !1;
    const o = ["dpkg", "-i", i, "||", "apt-get", "install", "-f", "-y"];
    return this.spawnSyncLog(r, [`${n}/bin/bash`, "-c", `'${o.join(" ")}'${n}`]), t.isForceRunAfter && this.app.relaunch(), !0;
  }
}
Lr.DebUpdater = Pw;
var Ur = {};
Object.defineProperty(Ur, "__esModule", { value: !0 });
Ur.PacmanUpdater = void 0;
const Dw = tt, Zs = vt, Nw = ue;
class Fw extends Dw.BaseUpdater {
  constructor(t, r) {
    super(t, r);
  }
  /*** @private */
  doDownloadUpdate(t) {
    const r = t.updateInfoAndProvider.provider, n = (0, Nw.findFile)(r.resolveFiles(t.updateInfoAndProvider.info), "pacman", ["AppImage", "deb", "rpm"]);
    return this.executeDownload({
      fileExtension: "pacman",
      fileInfo: n,
      downloadUpdateOptions: t,
      task: async (i, o) => {
        this.listenerCount(Zs.DOWNLOAD_PROGRESS) > 0 && (o.onProgress = (a) => this.emit(Zs.DOWNLOAD_PROGRESS, a)), await this.httpExecutor.download(n.url, i, o);
      }
    });
  }
  get installerPath() {
    var t, r;
    return (r = (t = super.installerPath) === null || t === void 0 ? void 0 : t.replace(/ /g, "\\ ")) !== null && r !== void 0 ? r : null;
  }
  doInstall(t) {
    const r = this.wrapSudo(), n = /pkexec/i.test(r) ? "" : '"', i = this.installerPath;
    if (i == null)
      return this.dispatchError(new Error("No valid update available, can't quit and install")), !1;
    const o = ["pacman", "-U", "--noconfirm", i];
    return this.spawnSyncLog(r, [`${n}/bin/bash`, "-c", `'${o.join(" ")}'${n}`]), t.isForceRunAfter && this.app.relaunch(), !0;
  }
}
Ur.PacmanUpdater = Fw;
var kr = {};
Object.defineProperty(kr, "__esModule", { value: !0 });
kr.RpmUpdater = void 0;
const xw = tt, el = vt, Lw = ue;
class Uw extends xw.BaseUpdater {
  constructor(t, r) {
    super(t, r);
  }
  /*** @private */
  doDownloadUpdate(t) {
    const r = t.updateInfoAndProvider.provider, n = (0, Lw.findFile)(r.resolveFiles(t.updateInfoAndProvider.info), "rpm", ["AppImage", "deb", "pacman"]);
    return this.executeDownload({
      fileExtension: "rpm",
      fileInfo: n,
      downloadUpdateOptions: t,
      task: async (i, o) => {
        this.listenerCount(el.DOWNLOAD_PROGRESS) > 0 && (o.onProgress = (a) => this.emit(el.DOWNLOAD_PROGRESS, a)), await this.httpExecutor.download(n.url, i, o);
      }
    });
  }
  get installerPath() {
    var t, r;
    return (r = (t = super.installerPath) === null || t === void 0 ? void 0 : t.replace(/ /g, "\\ ")) !== null && r !== void 0 ? r : null;
  }
  doInstall(t) {
    const r = this.wrapSudo(), n = /pkexec/i.test(r) ? "" : '"', i = this.spawnSyncLog("which zypper"), o = this.installerPath;
    if (o == null)
      return this.dispatchError(new Error("No valid update available, can't quit and install")), !1;
    let a;
    return i ? a = [i, "--no-refresh", "install", "--allow-unsigned-rpm", "-y", "-f", o] : a = [this.spawnSyncLog("which dnf || which yum"), "-y", "install", o], this.spawnSyncLog(r, [`${n}/bin/bash`, "-c", `'${a.join(" ")}'${n}`]), t.isForceRunAfter && this.app.relaunch(), !0;
  }
}
kr.RpmUpdater = Uw;
var Mr = {};
Object.defineProperty(Mr, "__esModule", { value: !0 });
Mr.MacUpdater = void 0;
const tl = pe, Zi = yt, kw = Et, rl = re, Mw = Rf, Bw = dt, jw = ue, nl = Vn, il = Hr;
class Hw extends Bw.AppUpdater {
  constructor(t, r) {
    super(t, r), this.nativeUpdater = Dt.autoUpdater, this.squirrelDownloadedUpdate = !1, this.nativeUpdater.on("error", (n) => {
      this._logger.warn(n), this.emit("error", n);
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
    let r = t.updateInfoAndProvider.provider.resolveFiles(t.updateInfoAndProvider.info);
    const n = this._logger, i = "sysctl.proc_translated";
    let o = !1;
    try {
      this.debug("Checking for macOS Rosetta environment"), o = (0, nl.execFileSync)("sysctl", [i], { encoding: "utf8" }).includes(`${i}: 1`), n.info(`Checked for macOS Rosetta environment (isRosetta=${o})`);
    } catch (f) {
      n.warn(`sysctl shell command to check for macOS Rosetta environment failed: ${f}`);
    }
    let a = !1;
    try {
      this.debug("Checking for arm64 in uname");
      const h = (0, nl.execFileSync)("uname", ["-a"], { encoding: "utf8" }).includes("ARM");
      n.info(`Checked 'uname -a': arm64=${h}`), a = a || h;
    } catch (f) {
      n.warn(`uname shell command to check for arm64 failed: ${f}`);
    }
    a = a || process.arch === "arm64" || o;
    const s = (f) => {
      var h;
      return f.url.pathname.includes("arm64") || ((h = f.info.url) === null || h === void 0 ? void 0 : h.includes("arm64"));
    };
    a && r.some(s) ? r = r.filter((f) => a === s(f)) : r = r.filter((f) => !s(f));
    const l = (0, jw.findFile)(r, "zip", ["pkg", "dmg"]);
    if (l == null)
      throw (0, tl.newError)(`ZIP file not provided: ${(0, tl.safeStringifyJson)(r)}`, "ERR_UPDATER_ZIP_FILE_NOT_FOUND");
    const m = t.updateInfoAndProvider.provider, c = "update.zip";
    return this.executeDownload({
      fileExtension: "zip",
      fileInfo: l,
      downloadUpdateOptions: t,
      task: async (f, h) => {
        const g = rl.join(this.downloadedUpdateHelper.cacheDir, c), _ = () => (0, Zi.pathExistsSync)(g) ? !t.disableDifferentialDownload : (n.info("Unable to locate previous update.zip for differential download (is this first install?), falling back to full download"), !1);
        let y = !0;
        _() && (y = await this.differentialDownloadInstaller(l, t, f, m, c)), y && await this.httpExecutor.download(l.url, f, h);
      },
      done: async (f) => {
        if (!t.disableDifferentialDownload)
          try {
            const h = rl.join(this.downloadedUpdateHelper.cacheDir, c);
            await (0, Zi.copyFile)(f.downloadedFile, h);
          } catch (h) {
            this._logger.warn(`Unable to copy file for caching for future differential downloads: ${h.message}`);
          }
        return this.updateDownloaded(l, f);
      }
    });
  }
  async updateDownloaded(t, r) {
    var n;
    const i = r.downloadedFile, o = (n = t.info.size) !== null && n !== void 0 ? n : (await (0, Zi.stat)(i)).size, a = this._logger, s = `fileToProxy=${t.url.href}`;
    this.closeServerIfExists(), this.debug(`Creating proxy server for native Squirrel.Mac (${s})`), this.server = (0, Mw.createServer)(), this.debug(`Proxy server for native Squirrel.Mac is created (${s})`), this.server.on("close", () => {
      a.info(`Proxy server for native Squirrel.Mac is closed (${s})`);
    });
    const l = (m) => {
      const c = m.address();
      return typeof c == "string" ? c : `http://127.0.0.1:${c == null ? void 0 : c.port}`;
    };
    return await new Promise((m, c) => {
      const f = (0, il.randomBytes)(64).toString("base64").replace(/\//g, "_").replace(/\+/g, "-"), h = Buffer.from(`autoupdater:${f}`, "ascii"), g = `/${(0, il.randomBytes)(64).toString("hex")}.zip`;
      this.server.on("request", (_, y) => {
        const A = _.url;
        if (a.info(`${A} requested`), A === "/") {
          if (!_.headers.authorization || _.headers.authorization.indexOf("Basic ") === -1) {
            y.statusCode = 401, y.statusMessage = "Invalid Authentication Credentials", y.end(), a.warn("No authenthication info");
            return;
          }
          const N = _.headers.authorization.split(" ")[1], x = Buffer.from(N, "base64").toString("ascii"), [Q, oe] = x.split(":");
          if (Q !== "autoupdater" || oe !== f) {
            y.statusCode = 401, y.statusMessage = "Invalid Authentication Credentials", y.end(), a.warn("Invalid authenthication credentials");
            return;
          }
          const V = Buffer.from(`{ "url": "${l(this.server)}${g}" }`);
          y.writeHead(200, { "Content-Type": "application/json", "Content-Length": V.length }), y.end(V);
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
        const S = (0, kw.createReadStream)(i);
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
        }), this.dispatchUpdateDownloaded(r), this.autoInstallOnAppQuit ? (this.nativeUpdater.once("error", c), this.nativeUpdater.checkForUpdates()) : m([]);
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
Mr.MacUpdater = Hw;
var Br = {}, Xo = {};
Object.defineProperty(Xo, "__esModule", { value: !0 });
Xo.verifySignature = Gw;
const ol = pe, _u = Vn, qw = Yn, al = re;
function Gw(e, t, r) {
  return new Promise((n, i) => {
    const o = t.replace(/'/g, "''");
    r.info(`Verifying signature ${o}`), (0, _u.execFile)('set "PSModulePath=" & chcp 65001 >NUL & powershell.exe', ["-NoProfile", "-NonInteractive", "-InputFormat", "None", "-Command", `"Get-AuthenticodeSignature -LiteralPath '${o}' | ConvertTo-Json -Compress"`], {
      shell: !0,
      timeout: 20 * 1e3
    }, (a, s, l) => {
      var m;
      try {
        if (a != null || l) {
          eo(r, a, l, i), n(null);
          return;
        }
        const c = Ww(s);
        if (c.Status === 0) {
          try {
            const _ = al.normalize(c.Path), y = al.normalize(t);
            if (r.info(`LiteralPath: ${_}. Update Path: ${y}`), _ !== y) {
              eo(r, new Error(`LiteralPath of ${_} is different than ${y}`), l, i), n(null);
              return;
            }
          } catch (_) {
            r.warn(`Unable to verify LiteralPath of update asset due to missing data.Path. Skipping this step of validation. Message: ${(m = _.message) !== null && m !== void 0 ? m : _.stack}`);
          }
          const h = (0, ol.parseDn)(c.SignerCertificate.Subject);
          let g = !1;
          for (const _ of e) {
            const y = (0, ol.parseDn)(_);
            if (y.size ? g = Array.from(y.keys()).every((T) => y.get(T) === h.get(T)) : _ === h.get("CN") && (r.warn(`Signature validated using only CN ${_}. Please add your full Distinguished Name (DN) to publisherNames configuration`), g = !0), g) {
              n(null);
              return;
            }
          }
        }
        const f = `publisherNames: ${e.join(" | ")}, raw info: ` + JSON.stringify(c, (h, g) => h === "RawData" ? void 0 : g, 2);
        r.warn(`Sign verification failed, installer signed with incorrect certificate: ${f}`), n(f);
      } catch (c) {
        eo(r, c, null, i), n(null);
        return;
      }
    });
  });
}
function Ww(e) {
  const t = JSON.parse(e);
  delete t.PrivateKey, delete t.IsOSBinary, delete t.SignatureType;
  const r = t.SignerCertificate;
  return r != null && (delete r.Archived, delete r.Extensions, delete r.Handle, delete r.HasPrivateKey, delete r.SubjectName), t;
}
function eo(e, t, r, n) {
  if (Vw()) {
    e.warn(`Cannot execute Get-AuthenticodeSignature: ${t || r}. Ignoring signature validation due to unsupported powershell version. Please upgrade to powershell 3 or higher.`);
    return;
  }
  try {
    (0, _u.execFileSync)("powershell.exe", ["-NoProfile", "-NonInteractive", "-Command", "ConvertTo-Json test"], { timeout: 10 * 1e3 });
  } catch (i) {
    e.warn(`Cannot execute ConvertTo-Json: ${i.message}. Ignoring signature validation due to unsupported powershell version. Please upgrade to powershell 3 or higher.`);
    return;
  }
  t != null && n(t), r && n(new Error(`Cannot execute Get-AuthenticodeSignature, stderr: ${r}. Failing signature validation due to unknown stderr.`));
}
function Vw() {
  const e = qw.release();
  return e.startsWith("6.") && !e.startsWith("6.3");
}
Object.defineProperty(Br, "__esModule", { value: !0 });
Br.NsisUpdater = void 0;
const Cn = pe, sl = re, Yw = tt, zw = Qr, ll = vt, Xw = ue, Kw = yt, Jw = Xo, cl = nr;
class Qw extends Yw.BaseUpdater {
  constructor(t, r) {
    super(t, r), this._verifyUpdateCodeSignature = (n, i) => (0, Jw.verifySignature)(n, i, this._logger);
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
    const r = t.updateInfoAndProvider.provider, n = (0, Xw.findFile)(r.resolveFiles(t.updateInfoAndProvider.info), "exe");
    return this.executeDownload({
      fileExtension: "exe",
      downloadUpdateOptions: t,
      fileInfo: n,
      task: async (i, o, a, s) => {
        const l = n.packageInfo, m = l != null && a != null;
        if (m && t.disableWebInstaller)
          throw (0, Cn.newError)(`Unable to download new version ${t.updateInfoAndProvider.info.version}. Web Installers are disabled`, "ERR_UPDATER_WEB_INSTALLER_DISABLED");
        !m && !t.disableWebInstaller && this._logger.warn("disableWebInstaller is set to false, you should set it to true if you do not plan on using a web installer. This will default to true in a future version."), (m || t.disableDifferentialDownload || await this.differentialDownloadInstaller(n, t, i, r, Cn.CURRENT_APP_INSTALLER_FILE_NAME)) && await this.httpExecutor.download(n.url, i, o);
        const c = await this.verifySignature(i);
        if (c != null)
          throw await s(), (0, Cn.newError)(`New version ${t.updateInfoAndProvider.info.version} is not signed by the application owner: ${c}`, "ERR_UPDATER_INVALID_SIGNATURE");
        if (m && await this.differentialDownloadWebPackage(t, l, a, r))
          try {
            await this.httpExecutor.download(new cl.URL(l.path), a, {
              headers: t.requestHeaders,
              cancellationToken: t.cancellationToken,
              sha512: l.sha512
            });
          } catch (f) {
            try {
              await (0, Kw.unlink)(a);
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
    let r;
    try {
      if (r = (await this.configOnDisk.value).publisherName, r == null)
        return null;
    } catch (n) {
      if (n.code === "ENOENT")
        return null;
      throw n;
    }
    return await this._verifyUpdateCodeSignature(Array.isArray(r) ? r : [r], t);
  }
  doInstall(t) {
    const r = this.installerPath;
    if (r == null)
      return this.dispatchError(new Error("No valid update available, can't quit and install")), !1;
    const n = ["--updated"];
    t.isSilent && n.push("/S"), t.isForceRunAfter && n.push("--force-run"), this.installDirectory && n.push(`/D=${this.installDirectory}`);
    const i = this.downloadedUpdateHelper == null ? null : this.downloadedUpdateHelper.packageFile;
    i != null && n.push(`--package-file=${i}`);
    const o = () => {
      this.spawnLog(sl.join(process.resourcesPath, "elevate.exe"), [r].concat(n)).catch((a) => this.dispatchError(a));
    };
    return t.isAdminRightsRequired ? (this._logger.info("isAdminRightsRequired is set to true, run installer using elevate.exe"), o(), !0) : (this.spawnLog(r, n).catch((a) => {
      const s = a.code;
      this._logger.info(`Cannot run installer: error code: ${s}, error message: "${a.message}", will be executed again using elevate if EACCES, and will try to use electron.shell.openItem if ENOENT`), s === "UNKNOWN" || s === "EACCES" ? o() : s === "ENOENT" ? Dt.shell.openPath(r).catch((l) => this.dispatchError(l)) : this.dispatchError(a);
    }), !0);
  }
  async differentialDownloadWebPackage(t, r, n, i) {
    if (r.blockMapSize == null)
      return !0;
    try {
      const o = {
        newUrl: new cl.URL(r.path),
        oldFile: sl.join(this.downloadedUpdateHelper.cacheDir, Cn.CURRENT_APP_PACKAGE_FILE_NAME),
        logger: this._logger,
        newFile: n,
        requestHeaders: this.requestHeaders,
        isUseMultipleRangeRequest: i.isUseMultipleRangeRequest,
        cancellationToken: t.cancellationToken
      };
      this.listenerCount(ll.DOWNLOAD_PROGRESS) > 0 && (o.onProgress = (a) => this.emit(ll.DOWNLOAD_PROGRESS, a)), await new zw.FileWithEmbeddedBlockMapDifferentialDownloader(r, this.httpExecutor, o).download();
    } catch (o) {
      return this._logger.error(`Cannot download differentially, fallback to full download: ${o.stack || o}`), process.platform === "win32";
    }
    return !1;
  }
}
Br.NsisUpdater = Qw;
(function(e) {
  var t = Te && Te.__createBinding || (Object.create ? function(A, T, S, N) {
    N === void 0 && (N = S);
    var x = Object.getOwnPropertyDescriptor(T, S);
    (!x || ("get" in x ? !T.__esModule : x.writable || x.configurable)) && (x = { enumerable: !0, get: function() {
      return T[S];
    } }), Object.defineProperty(A, N, x);
  } : function(A, T, S, N) {
    N === void 0 && (N = S), A[N] = T[S];
  }), r = Te && Te.__exportStar || function(A, T) {
    for (var S in A) S !== "default" && !Object.prototype.hasOwnProperty.call(T, S) && t(T, A, S);
  };
  Object.defineProperty(e, "__esModule", { value: !0 }), e.NsisUpdater = e.MacUpdater = e.RpmUpdater = e.PacmanUpdater = e.DebUpdater = e.AppImageUpdater = e.Provider = e.NoOpLogger = e.AppUpdater = e.BaseUpdater = void 0;
  const n = yt, i = re;
  var o = tt;
  Object.defineProperty(e, "BaseUpdater", { enumerable: !0, get: function() {
    return o.BaseUpdater;
  } });
  var a = dt;
  Object.defineProperty(e, "AppUpdater", { enumerable: !0, get: function() {
    return a.AppUpdater;
  } }), Object.defineProperty(e, "NoOpLogger", { enumerable: !0, get: function() {
    return a.NoOpLogger;
  } });
  var s = ue;
  Object.defineProperty(e, "Provider", { enumerable: !0, get: function() {
    return s.Provider;
  } });
  var l = xr;
  Object.defineProperty(e, "AppImageUpdater", { enumerable: !0, get: function() {
    return l.AppImageUpdater;
  } });
  var m = Lr;
  Object.defineProperty(e, "DebUpdater", { enumerable: !0, get: function() {
    return m.DebUpdater;
  } });
  var c = Ur;
  Object.defineProperty(e, "PacmanUpdater", { enumerable: !0, get: function() {
    return c.PacmanUpdater;
  } });
  var f = kr;
  Object.defineProperty(e, "RpmUpdater", { enumerable: !0, get: function() {
    return f.RpmUpdater;
  } });
  var h = Mr;
  Object.defineProperty(e, "MacUpdater", { enumerable: !0, get: function() {
    return h.MacUpdater;
  } });
  var g = Br;
  Object.defineProperty(e, "NsisUpdater", { enumerable: !0, get: function() {
    return g.NsisUpdater;
  } }), r(vt, e);
  let _;
  function y() {
    if (process.platform === "win32")
      _ = new Br.NsisUpdater();
    else if (process.platform === "darwin")
      _ = new Mr.MacUpdater();
    else {
      _ = new xr.AppImageUpdater();
      try {
        const A = i.join(process.resourcesPath, "package-type");
        if (!(0, n.existsSync)(A))
          return _;
        console.info("Checking for beta autoupdate feature for deb/rpm distributions");
        const T = (0, n.readFileSync)(A).toString().trim();
        switch (console.info("Found package-type:", T), T) {
          case "deb":
            _ = new Lr.DebUpdater();
            break;
          case "rpm":
            _ = new kr.RpmUpdater();
            break;
          case "pacman":
            _ = new Ur.PacmanUpdater();
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
})(Ze);
const Pn = Pe.dirname(Pf(import.meta.url));
process.env.APP_ROOT = Pe.join(Pn, "..");
const Wn = process.env.VITE_DEV_SERVER_URL, E_ = Pe.join(process.env.APP_ROOT, "dist-electron"), Dn = Pe.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = Wn ? Pe.join(process.env.APP_ROOT, "public") : Dn;
let ae, se, Tr;
function Au() {
  const e = $f.getPrimaryDisplay(), { width: t, height: r } = e.workAreaSize, n = 20, i = 480, o = 400, a = 320, s = 50, l = 192, m = Math.floor((t - i) / 2), c = Math.floor((r - o) / 2), f = t - a - 2 * n, h = r - 5 * s - 2 * n, g = n, _ = r - l - n;
  ae = new bn({
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
    icon: Pe.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      nodeIntegration: !1,
      contextIsolation: !0,
      devTools: !0,
      preload: Pe.join(Pn, "preload.mjs")
    }
  }), se = new bn({
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
    icon: Pe.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      nodeIntegration: !1,
      contextIsolation: !0,
      devTools: !0,
      preload: Pe.join(Pn, "preload.mjs")
    }
  }), Tr = new bn({
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
    icon: Pe.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      nodeIntegration: !1,
      contextIsolation: !0,
      devTools: !0,
      preload: Pe.join(Pn, "preload.mjs")
    }
  }), ae.setVisibleOnAllWorkspaces(!0, { visibleOnFullScreen: !0 }), ae.setAlwaysOnTop(!0, "screen-saver", 1), se.setVisibleOnAllWorkspaces(!0, { visibleOnFullScreen: !0 }), se.setAlwaysOnTop(!0, "screen-saver", 1), ae.webContents.on("did-finish-load", () => {
    ae == null || ae.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  }), se.webContents.on("did-finish-load", () => {
    se == null || se.webContents.send(
      "main-process-message",
      (/* @__PURE__ */ new Date()).toLocaleString()
    );
  }), Wn ? (ae.loadURL(Wn), se.loadURL("http://localhost:5173/studio.html"), Tr.loadURL("http://localhost:5173/webcam.html")) : (ae.loadFile(Pe.join(Dn, "index.html")), se.loadFile(Pe.join(Dn, "studio.html")), Tr.loadFile(Pe.join(Dn, "webcam.html")));
}
Cr.on("window-all-closed", () => {
  process.platform !== "darwin" && (Cr.quit(), ae = null, se = null, Tr = null);
});
Ft.on("closeApp", () => {
  process.platform !== "darwin" && (Cr.quit(), ae = null, se = null, Tr = null);
});
Ft.handle("getSources", async () => await bf.getSources({
  thumbnailSize: { height: 100, width: 150 },
  fetchWindowIcons: !0,
  types: ["window", "screen"]
}));
Ft.on("media-sources", (e, t) => {
  console.log(e), se == null || se.webContents.send("profile-received", t);
});
Ft.on("resize-studio", (e, t) => {
  console.log(e), t.shrink && (se == null || se.setSize(400, 100)), t.shrink || se == null || se.setSize(400, 250);
});
Ft.on("hide-plugin", (e, t) => {
  console.log(e), ae == null || ae.webContents.send("hide-plugin", t);
});
Ft.on("open-devtools", () => {
  ae == null || ae.webContents.openDevTools();
});
Ft.on("minimize-window", () => {
  ae == null || ae.minimize();
});
Cr.on("activate", () => {
  bn.getAllWindows().length === 0 && Au();
});
Cr.whenReady().then(() => {
  try {
    Au(), Wn || Ze.autoUpdater.checkForUpdatesAndNotify();
  } catch (e) {
    console.error("[App] Startup error:", e), ul.showErrorBox("Crystal Error", `Failed to start: ${e}`);
  }
});
Ze.autoUpdater.on("checking-for-update", () => {
  console.log("[AutoUpdater] Checking for updates...");
});
Ze.autoUpdater.on("update-available", (e) => {
  console.log("[AutoUpdater] Update available:", e.version);
});
Ze.autoUpdater.on("update-not-available", () => {
  console.log("[AutoUpdater] No updates available.");
});
Ze.autoUpdater.on("download-progress", (e) => {
  console.log(`[AutoUpdater] Download progress: ${e.percent.toFixed(1)}%`);
});
Ze.autoUpdater.on("update-downloaded", (e) => {
  console.log("[AutoUpdater] Update downloaded:", e.version), Ze.autoUpdater.quitAndInstall(!1, !0);
});
Ze.autoUpdater.on("error", (e) => {
  console.error("[AutoUpdater] Error:", e.message);
});
process.on("uncaughtException", (e) => {
  console.error("[Process] Uncaught exception:", e), ul.showErrorBox("Crystal Error", `Unexpected error: ${e.message}`);
});
process.on("unhandledRejection", (e) => {
  console.error("[Process] Unhandled rejection:", e);
});
export {
  E_ as MAIN_DIST,
  Dn as RENDERER_DIST,
  Wn as VITE_DEV_SERVER_URL
};

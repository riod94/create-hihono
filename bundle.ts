#!/usr/bin/env bun
// @bun
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getProtoOf = Object.getPrototypeOf;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __toESM = (mod, isNodeMode, target) => {
  target = mod != null ? __create(__getProtoOf(mod)) : {};
  const to = isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target;
  for (let key of __getOwnPropNames(mod))
    if (!__hasOwnProp.call(to, key))
      __defProp(to, key, {
        get: () => mod[key],
        enumerable: true
      });
  return to;
};
var __toCommonJS = (from) => {
  const moduleCache = __toCommonJS.moduleCache ??= new WeakMap;
  var cached = moduleCache.get(from);
  if (cached)
    return cached;
  var to = __defProp({}, "__esModule", { value: true });
  var desc = { enumerable: false };
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key))
        __defProp(to, key, {
          get: () => from[key],
          enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
        });
  }
  moduleCache.set(from, to);
  return to;
};
var __commonJS = (cb, mod) => () => (mod || cb((mod = { exports: {} }).exports, mod), mod.exports);
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, {
      get: all[name],
      enumerable: true,
      configurable: true,
      set: (newValue) => all[name] = () => newValue
    });
};
var __esm = (fn, res) => () => (fn && (res = fn(fn = 0)), res);
var __require = ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined")
    return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});

// node_modules/isexe/windows.js
var require_windows = __commonJS((exports, module) => {
  var checkPathExt = function(path, options) {
    var pathext = options.pathExt !== undefined ? options.pathExt : process.env.PATHEXT;
    if (!pathext) {
      return true;
    }
    pathext = pathext.split(";");
    if (pathext.indexOf("") !== -1) {
      return true;
    }
    for (var i = 0;i < pathext.length; i++) {
      var p = pathext[i].toLowerCase();
      if (p && path.substr(-p.length).toLowerCase() === p) {
        return true;
      }
    }
    return false;
  };
  var checkStat = function(stat, path, options) {
    if (!stat.isSymbolicLink() && !stat.isFile()) {
      return false;
    }
    return checkPathExt(path, options);
  };
  var isexe = function(path, options, cb) {
    fs.stat(path, function(er, stat) {
      cb(er, er ? false : checkStat(stat, path, options));
    });
  };
  var sync = function(path, options) {
    return checkStat(fs.statSync(path), path, options);
  };
  module.exports = isexe;
  isexe.sync = sync;
  var fs = import.meta.require("fs");
});

// node_modules/isexe/mode.js
var require_mode = __commonJS((exports, module) => {
  var isexe = function(path, options, cb) {
    fs.stat(path, function(er, stat) {
      cb(er, er ? false : checkStat(stat, options));
    });
  };
  var sync = function(path, options) {
    return checkStat(fs.statSync(path), options);
  };
  var checkStat = function(stat, options) {
    return stat.isFile() && checkMode(stat, options);
  };
  var checkMode = function(stat, options) {
    var mod = stat.mode;
    var uid = stat.uid;
    var gid = stat.gid;
    var myUid = options.uid !== undefined ? options.uid : process.getuid && process.getuid();
    var myGid = options.gid !== undefined ? options.gid : process.getgid && process.getgid();
    var u = parseInt("100", 8);
    var g = parseInt("010", 8);
    var o = parseInt("001", 8);
    var ug = u | g;
    var ret = mod & o || mod & g && gid === myGid || mod & u && uid === myUid || mod & ug && myUid === 0;
    return ret;
  };
  module.exports = isexe;
  isexe.sync = sync;
  var fs = import.meta.require("fs");
});

// node_modules/isexe/index.js
var require_isexe = __commonJS((exports, module) => {
  var isexe = function(path, options, cb) {
    if (typeof options === "function") {
      cb = options;
      options = {};
    }
    if (!cb) {
      if (typeof Promise !== "function") {
        throw new TypeError("callback not provided");
      }
      return new Promise(function(resolve, reject) {
        isexe(path, options || {}, function(er, is) {
          if (er) {
            reject(er);
          } else {
            resolve(is);
          }
        });
      });
    }
    core(path, options || {}, function(er, is) {
      if (er) {
        if (er.code === "EACCES" || options && options.ignoreErrors) {
          er = null;
          is = false;
        }
      }
      cb(er, is);
    });
  };
  var sync = function(path, options) {
    try {
      return core.sync(path, options || {});
    } catch (er) {
      if (options && options.ignoreErrors || er.code === "EACCES") {
        return false;
      } else {
        throw er;
      }
    }
  };
  var fs = import.meta.require("fs");
  var core;
  if (process.platform === "win32" || global.TESTING_WINDOWS) {
    core = require_windows();
  } else {
    core = require_mode();
  }
  module.exports = isexe;
  isexe.sync = sync;
});

// node_modules/which/which.js
var require_which = __commonJS((exports, module) => {
  var isWindows = process.platform === "win32" || process.env.OSTYPE === "cygwin" || process.env.OSTYPE === "msys";
  var path = import.meta.require("path");
  var COLON = isWindows ? ";" : ":";
  var isexe = require_isexe();
  var getNotFoundError = (cmd) => Object.assign(new Error(`not found: ${cmd}`), { code: "ENOENT" });
  var getPathInfo = (cmd, opt) => {
    const colon = opt.colon || COLON;
    const pathEnv = cmd.match(/\//) || isWindows && cmd.match(/\\/) ? [""] : [
      ...isWindows ? [process.cwd()] : [],
      ...(opt.path || process.env.PATH || "").split(colon)
    ];
    const pathExtExe = isWindows ? opt.pathExt || process.env.PATHEXT || ".EXE;.CMD;.BAT;.COM" : "";
    const pathExt = isWindows ? pathExtExe.split(colon) : [""];
    if (isWindows) {
      if (cmd.indexOf(".") !== -1 && pathExt[0] !== "")
        pathExt.unshift("");
    }
    return {
      pathEnv,
      pathExt,
      pathExtExe
    };
  };
  var which = (cmd, opt, cb) => {
    if (typeof opt === "function") {
      cb = opt;
      opt = {};
    }
    if (!opt)
      opt = {};
    const { pathEnv, pathExt, pathExtExe } = getPathInfo(cmd, opt);
    const found = [];
    const step = (i) => new Promise((resolve, reject) => {
      if (i === pathEnv.length)
        return opt.all && found.length ? resolve(found) : reject(getNotFoundError(cmd));
      const ppRaw = pathEnv[i];
      const pathPart = /^".*"$/.test(ppRaw) ? ppRaw.slice(1, -1) : ppRaw;
      const pCmd = path.join(pathPart, cmd);
      const p = !pathPart && /^\.[\\\/]/.test(cmd) ? cmd.slice(0, 2) + pCmd : pCmd;
      resolve(subStep(p, i, 0));
    });
    const subStep = (p, i, ii) => new Promise((resolve, reject) => {
      if (ii === pathExt.length)
        return resolve(step(i + 1));
      const ext = pathExt[ii];
      isexe(p + ext, { pathExt: pathExtExe }, (er, is) => {
        if (!er && is) {
          if (opt.all)
            found.push(p + ext);
          else
            return resolve(p + ext);
        }
        return resolve(subStep(p, i, ii + 1));
      });
    });
    return cb ? step(0).then((res) => cb(null, res), cb) : step(0);
  };
  var whichSync = (cmd, opt) => {
    opt = opt || {};
    const { pathEnv, pathExt, pathExtExe } = getPathInfo(cmd, opt);
    const found = [];
    for (let i = 0;i < pathEnv.length; i++) {
      const ppRaw = pathEnv[i];
      const pathPart = /^".*"$/.test(ppRaw) ? ppRaw.slice(1, -1) : ppRaw;
      const pCmd = path.join(pathPart, cmd);
      const p = !pathPart && /^\.[\\\/]/.test(cmd) ? cmd.slice(0, 2) + pCmd : pCmd;
      for (let j = 0;j < pathExt.length; j++) {
        const cur = p + pathExt[j];
        try {
          const is = isexe.sync(cur, { pathExt: pathExtExe });
          if (is) {
            if (opt.all)
              found.push(cur);
            else
              return cur;
          }
        } catch (ex) {
        }
      }
    }
    if (opt.all && found.length)
      return found;
    if (opt.nothrow)
      return null;
    throw getNotFoundError(cmd);
  };
  module.exports = which;
  which.sync = whichSync;
});

// node_modules/path-key/index.js
var require_path_key = __commonJS((exports, module) => {
  var pathKey = (options = {}) => {
    const environment = options.env || process.env;
    const platform = options.platform || process.platform;
    if (platform !== "win32") {
      return "PATH";
    }
    return Object.keys(environment).reverse().find((key) => key.toUpperCase() === "PATH") || "Path";
  };
  module.exports = pathKey;
  module.exports.default = pathKey;
});

// node_modules/cross-spawn/lib/util/resolveCommand.js
var require_resolveCommand = __commonJS((exports, module) => {
  var resolveCommandAttempt = function(parsed, withoutPathExt) {
    const env = parsed.options.env || process.env;
    const cwd = process.cwd();
    const hasCustomCwd = parsed.options.cwd != null;
    const shouldSwitchCwd = hasCustomCwd && process.chdir !== undefined && !process.chdir.disabled;
    if (shouldSwitchCwd) {
      try {
        process.chdir(parsed.options.cwd);
      } catch (err) {
      }
    }
    let resolved;
    try {
      resolved = which.sync(parsed.command, {
        path: env[getPathKey({ env })],
        pathExt: withoutPathExt ? path.delimiter : undefined
      });
    } catch (e) {
    } finally {
      if (shouldSwitchCwd) {
        process.chdir(cwd);
      }
    }
    if (resolved) {
      resolved = path.resolve(hasCustomCwd ? parsed.options.cwd : "", resolved);
    }
    return resolved;
  };
  var resolveCommand = function(parsed) {
    return resolveCommandAttempt(parsed) || resolveCommandAttempt(parsed, true);
  };
  var path = import.meta.require("path");
  var which = require_which();
  var getPathKey = require_path_key();
  module.exports = resolveCommand;
});

// node_modules/cross-spawn/lib/util/escape.js
var require_escape = __commonJS((exports, module) => {
  var escapeCommand = function(arg) {
    arg = arg.replace(metaCharsRegExp, "^$1");
    return arg;
  };
  var escapeArgument = function(arg, doubleEscapeMetaChars) {
    arg = `${arg}`;
    arg = arg.replace(/(\\*)"/g, '$1$1\\"');
    arg = arg.replace(/(\\*)$/, "$1$1");
    arg = `"${arg}"`;
    arg = arg.replace(metaCharsRegExp, "^$1");
    if (doubleEscapeMetaChars) {
      arg = arg.replace(metaCharsRegExp, "^$1");
    }
    return arg;
  };
  var metaCharsRegExp = /([()\][%!^"`<>&|;, *?])/g;
  exports.command = escapeCommand;
  exports.argument = escapeArgument;
});

// node_modules/shebang-regex/index.js
var require_shebang_regex = __commonJS((exports, module) => {
  module.exports = /^#!(.*)/;
});

// node_modules/shebang-command/index.js
var require_shebang_command = __commonJS((exports, module) => {
  var shebangRegex = require_shebang_regex();
  module.exports = (string = "") => {
    const match = string.match(shebangRegex);
    if (!match) {
      return null;
    }
    const [path, argument] = match[0].replace(/#! ?/, "").split(" ");
    const binary = path.split("/").pop();
    if (binary === "env") {
      return argument;
    }
    return argument ? `${binary} ${argument}` : binary;
  };
});

// node_modules/cross-spawn/lib/util/readShebang.js
var require_readShebang = __commonJS((exports, module) => {
  var readShebang = function(command) {
    const size = 150;
    const buffer = Buffer.alloc(size);
    let fd;
    try {
      fd = fs.openSync(command, "r");
      fs.readSync(fd, buffer, 0, size, 0);
      fs.closeSync(fd);
    } catch (e) {
    }
    return shebangCommand(buffer.toString());
  };
  var fs = import.meta.require("fs");
  var shebangCommand = require_shebang_command();
  module.exports = readShebang;
});

// node_modules/cross-spawn/lib/parse.js
var require_parse = __commonJS((exports, module) => {
  var detectShebang = function(parsed) {
    parsed.file = resolveCommand(parsed);
    const shebang = parsed.file && readShebang(parsed.file);
    if (shebang) {
      parsed.args.unshift(parsed.file);
      parsed.command = shebang;
      return resolveCommand(parsed);
    }
    return parsed.file;
  };
  var parseNonShell = function(parsed) {
    if (!isWin) {
      return parsed;
    }
    const commandFile = detectShebang(parsed);
    const needsShell = !isExecutableRegExp.test(commandFile);
    if (parsed.options.forceShell || needsShell) {
      const needsDoubleEscapeMetaChars = isCmdShimRegExp.test(commandFile);
      parsed.command = path.normalize(parsed.command);
      parsed.command = escape.command(parsed.command);
      parsed.args = parsed.args.map((arg) => escape.argument(arg, needsDoubleEscapeMetaChars));
      const shellCommand = [parsed.command].concat(parsed.args).join(" ");
      parsed.args = ["/d", "/s", "/c", `"${shellCommand}"`];
      parsed.command = process.env.comspec || "cmd.exe";
      parsed.options.windowsVerbatimArguments = true;
    }
    return parsed;
  };
  var parse = function(command, args, options) {
    if (args && !Array.isArray(args)) {
      options = args;
      args = null;
    }
    args = args ? args.slice(0) : [];
    options = Object.assign({}, options);
    const parsed = {
      command,
      args,
      options,
      file: undefined,
      original: {
        command,
        args
      }
    };
    return options.shell ? parsed : parseNonShell(parsed);
  };
  var path = import.meta.require("path");
  var resolveCommand = require_resolveCommand();
  var escape = require_escape();
  var readShebang = require_readShebang();
  var isWin = process.platform === "win32";
  var isExecutableRegExp = /\.(?:com|exe)$/i;
  var isCmdShimRegExp = /node_modules[\\/].bin[\\/][^\\/]+\.cmd$/i;
  module.exports = parse;
});

// node_modules/cross-spawn/lib/enoent.js
var require_enoent = __commonJS((exports, module) => {
  var notFoundError = function(original, syscall) {
    return Object.assign(new Error(`${syscall} ${original.command} ENOENT`), {
      code: "ENOENT",
      errno: "ENOENT",
      syscall: `${syscall} ${original.command}`,
      path: original.command,
      spawnargs: original.args
    });
  };
  var hookChildProcess = function(cp, parsed) {
    if (!isWin) {
      return;
    }
    const originalEmit = cp.emit;
    cp.emit = function(name2, arg1) {
      if (name2 === "exit") {
        const err = verifyENOENT(arg1, parsed, "spawn");
        if (err) {
          return originalEmit.call(cp, "error", err);
        }
      }
      return originalEmit.apply(cp, arguments);
    };
  };
  var verifyENOENT = function(status, parsed) {
    if (isWin && status === 1 && !parsed.file) {
      return notFoundError(parsed.original, "spawn");
    }
    return null;
  };
  var verifyENOENTSync = function(status, parsed) {
    if (isWin && status === 1 && !parsed.file) {
      return notFoundError(parsed.original, "spawnSync");
    }
    return null;
  };
  var isWin = process.platform === "win32";
  module.exports = {
    hookChildProcess,
    verifyENOENT,
    verifyENOENTSync,
    notFoundError
  };
});

// node_modules/cross-spawn/index.js
var require_cross_spawn = __commonJS((exports, module) => {
  var spawn = function(command, args, options) {
    const parsed = parse(command, args, options);
    const spawned = cp.spawn(parsed.command, parsed.args, parsed.options);
    enoent.hookChildProcess(spawned, parsed);
    return spawned;
  };
  var spawnSync = function(command, args, options) {
    const parsed = parse(command, args, options);
    const result = cp.spawnSync(parsed.command, parsed.args, parsed.options);
    result.error = result.error || enoent.verifyENOENTSync(result.status, parsed);
    return result;
  };
  var cp = import.meta.require("child_process");
  var parse = require_parse();
  var enoent = require_enoent();
  module.exports = spawn;
  module.exports.spawn = spawn;
  module.exports.sync = spawnSync;
  module.exports._parse = parse;
  module.exports._enoent = enoent;
});

// node_modules/merge-stream/index.js
var require_merge_stream = __commonJS((exports, module) => {
  var { PassThrough } = import.meta.require("stream");
  module.exports = function() {
    var sources = [];
    var output = new PassThrough({ objectMode: true });
    output.setMaxListeners(0);
    output.add = add;
    output.isEmpty = isEmpty;
    output.on("unpipe", remove);
    Array.prototype.slice.call(arguments).forEach(add);
    return output;
    function add(source) {
      if (Array.isArray(source)) {
        source.forEach(add);
        return this;
      }
      sources.push(source);
      source.once("end", remove.bind(null, source));
      source.once("error", output.emit.bind(output, "error"));
      source.pipe(output, { end: false });
      return this;
    }
    function isEmpty() {
      return sources.length == 0;
    }
    function remove(source) {
      sources = sources.filter(function(it) {
        return it !== source;
      });
      if (!sources.length && output.readable) {
        output.end();
      }
    }
  };
});

// node_modules/picocolors/picocolors.browser.js
var require_picocolors_browser = __commonJS((exports, module) => {
  var x = String;
  var create = function() {
    return { isColorSupported: false, reset: x, bold: x, dim: x, italic: x, underline: x, inverse: x, hidden: x, strikethrough: x, black: x, red: x, green: x, yellow: x, blue: x, magenta: x, cyan: x, white: x, gray: x, bgBlack: x, bgRed: x, bgGreen: x, bgYellow: x, bgBlue: x, bgMagenta: x, bgCyan: x, bgWhite: x };
  };
  module.exports = create();
  module.exports.createColors = create;
});

// node_modules/nanospinner/consts.js
var require_consts = __commonJS((exports, module) => {
  var tty = import.meta.require("tty");
  var isCI = process.env.CI || process.env.WT_SESSION || process.env.ConEmuTask === "{cmd::Cmder}" || process.env.TERM_PROGRAM === "vscode" || process.env.TERM === "xterm-256color" || process.env.TERM === "alacritty";
  var isTTY = tty.isatty(1) && process.env.TERM !== "dumb" && !("CI" in process.env);
  var supportUnicode = process.platform !== "win32" ? process.env.TERM !== "linux" : isCI;
  var symbols = {
    frames: isTTY ? supportUnicode ? ["\u280B", "\u2819", "\u2839", "\u2838", "\u283C", "\u2834", "\u2826", "\u2827", "\u2807", "\u280F"] : ["-", "\\", "|", "/"] : ["-"],
    tick: supportUnicode ? "\u2714" : "\u221A",
    cross: supportUnicode ? "\u2716" : "\xD7",
    warn: supportUnicode ? "\u26A0" : "!!"
  };
  module.exports = { isTTY, symbols };
});

// node_modules/nanospinner/index.js
var require_nanospinner = __commonJS((exports, module) => {
  var getLines = function(str = "", width = 80) {
    return str.replace(/\u001b[^m]*?m/g, "").split("\n").reduce((col, line) => col += Math.max(1, Math.ceil(line.length / width)), 0);
  };
  var createSpinner = function(text = "", opts = {}) {
    let current = 0, interval = opts.interval || 50, stream2 = opts.stream || process.stderr, frames = opts.frames && opts.frames.length ? opts.frames : symbols.frames, color = opts.color || "yellow", lines = 0, timer;
    let spinner = {
      reset() {
        current = 0;
        lines = 0;
        timer = clearTimeout(timer);
      },
      clear() {
        spinner.write("\x1B[1G");
        for (let i = 0;i < lines; i++) {
          i > 0 && spinner.write("\x1B[1A");
          spinner.write("\x1B[2K\x1B[1G");
        }
        lines = 0;
        return spinner;
      },
      write(str, clear = false) {
        if (clear && isTTY) {
          spinner.clear();
        }
        stream2.write(str);
        return spinner;
      },
      render() {
        let mark = pico[color](frames[current]);
        let str = `${mark} ${text}`;
        isTTY ? spinner.write(`\x1B[?25l`) : str += "\n";
        spinner.write(str, true);
        isTTY && (lines = getLines(str, stream2.columns));
      },
      spin() {
        spinner.render();
        current = ++current % frames.length;
        return spinner;
      },
      update(opts2 = {}) {
        text = opts2.text || text;
        frames = opts2.frames && opts2.frames.length ? opts2.frames : frames;
        interval = opts2.interval || interval;
        color = opts2.color || color;
        if (frames.length - 1 < current) {
          current = 0;
        }
        return spinner;
      },
      loop() {
        isTTY && (timer = setTimeout(() => spinner.loop(), interval));
        return spinner.spin();
      },
      start(opts2 = {}) {
        timer && spinner.reset();
        return spinner.update({ text: opts2.text, color: opts2.color }).loop();
      },
      stop(opts2 = {}) {
        timer = clearTimeout(timer);
        let mark = pico[opts2.color || color](frames[current]);
        let optsMark = opts2.mark && opts2.color ? pico[opts2.color](opts2.mark) : opts2.mark;
        spinner.write(`${optsMark || mark} ${opts2.text || text}\n`, true);
        return isTTY ? spinner.write(`\x1B[?25h`) : spinner;
      },
      success(opts2 = {}) {
        let mark = green(symbols.tick);
        return spinner.stop({ mark, ...opts2 });
      },
      error(opts2 = {}) {
        let mark = red(symbols.cross);
        return spinner.stop({ mark, ...opts2 });
      },
      warn(opts2 = {}) {
        let mark = yellow(symbols.warn);
        return spinner.stop({ mark, ...opts2 });
      }
    };
    return spinner;
  };
  var pico = require_picocolors_browser();
  var { isTTY, symbols } = require_consts();
  var { green, red, yellow } = pico;
  module.exports = {
    createSpinner
  };
});

// node_modules/proto-list/proto-list.js
var require_proto_list = __commonJS((exports, module) => {
  var setProto = function(obj, proto) {
    if (typeof Object.setPrototypeOf === "function")
      return Object.setPrototypeOf(obj, proto);
    else
      obj.__proto__ = proto;
  };
  var ProtoList = function() {
    this.list = [];
    var root = null;
    Object.defineProperty(this, "root", {
      get: function() {
        return root;
      },
      set: function(r) {
        root = r;
        if (this.list.length) {
          setProto(this.list[this.list.length - 1], r);
        }
      },
      enumerable: true,
      configurable: true
    });
  };
  module.exports = ProtoList;
  ProtoList.prototype = {
    get length() {
      return this.list.length;
    },
    get keys() {
      var k = [];
      for (var i in this.list[0])
        k.push(i);
      return k;
    },
    get snapshot() {
      var o = {};
      this.keys.forEach(function(k) {
        o[k] = this.get(k);
      }, this);
      return o;
    },
    get store() {
      return this.list[0];
    },
    push: function(obj) {
      if (typeof obj !== "object")
        obj = { valueOf: obj };
      if (this.list.length >= 1) {
        setProto(this.list[this.list.length - 1], obj);
      }
      setProto(obj, this.root);
      return this.list.push(obj);
    },
    pop: function() {
      if (this.list.length >= 2) {
        setProto(this.list[this.list.length - 2], this.root);
      }
      return this.list.pop();
    },
    unshift: function(obj) {
      setProto(obj, this.list[0] || this.root);
      return this.list.unshift(obj);
    },
    shift: function() {
      if (this.list.length === 1) {
        setProto(this.list[0], this.root);
      }
      return this.list.shift();
    },
    get: function(key) {
      return this.list[0][key];
    },
    set: function(key, val, save) {
      if (!this.length)
        this.push({});
      if (save && this.list[0].hasOwnProperty(key))
        this.push({});
      return this.list[0][key] = val;
    },
    forEach: function(fn, thisp) {
      for (var key in this.list[0])
        fn.call(thisp, key, this.list[0][key]);
    },
    slice: function() {
      return this.list.slice.apply(this.list, arguments);
    },
    splice: function() {
      var ret = this.list.splice.apply(this.list, arguments);
      for (var i = 0, l = this.list.length;i < l; i++) {
        setProto(this.list[i], this.list[i + 1] || this.root);
      }
      return ret;
    }
  };
});

// node_modules/config-chain/node_modules/ini/ini.js
var require_ini = __commonJS((exports) => {
  var encode = function(obj, opt) {
    var children = [];
    var out = "";
    if (typeof opt === "string") {
      opt = {
        section: opt,
        whitespace: false
      };
    } else {
      opt = opt || {};
      opt.whitespace = opt.whitespace === true;
    }
    var separator = opt.whitespace ? " = " : "=";
    Object.keys(obj).forEach(function(k, _, __) {
      var val = obj[k];
      if (val && Array.isArray(val)) {
        val.forEach(function(item) {
          out += safe(k + "[]") + separator + safe(item) + "\n";
        });
      } else if (val && typeof val === "object")
        children.push(k);
      else
        out += safe(k) + separator + safe(val) + eol;
    });
    if (opt.section && out.length)
      out = "[" + safe(opt.section) + "]" + eol + out;
    children.forEach(function(k, _, __) {
      var nk = dotSplit(k).join("\\.");
      var section = (opt.section ? opt.section + "." : "") + nk;
      var child = encode(obj[k], {
        section,
        whitespace: opt.whitespace
      });
      if (out.length && child.length)
        out += eol;
      out += child;
    });
    return out;
  };
  var dotSplit = function(str) {
    return str.replace(/\1/g, "\x02LITERAL\\1LITERAL\x02").replace(/\\\./g, "\x01").split(/\./).map(function(part) {
      return part.replace(/\1/g, "\\.").replace(/\2LITERAL\\1LITERAL\2/g, "\x01");
    });
  };
  var decode = function(str) {
    var out = {};
    var p = out;
    var section = null;
    var re = /^\[([^\]]*)\]$|^([^=]+)(=(.*))?$/i;
    var lines = str.split(/[\r\n]+/g);
    lines.forEach(function(line, _, __) {
      if (!line || line.match(/^\s*[;#]/))
        return;
      var match = line.match(re);
      if (!match)
        return;
      if (match[1] !== undefined) {
        section = unsafe(match[1]);
        if (section === "__proto__") {
          p = {};
          return;
        }
        p = out[section] = out[section] || {};
        return;
      }
      var key = unsafe(match[2]);
      if (key === "__proto__")
        return;
      var value = match[3] ? unsafe(match[4]) : true;
      switch (value) {
        case "true":
        case "false":
        case "null":
          value = JSON.parse(value);
      }
      if (key.length > 2 && key.slice(-2) === "[]") {
        key = key.substring(0, key.length - 2);
        if (key === "__proto__")
          return;
        if (!p[key])
          p[key] = [];
        else if (!Array.isArray(p[key]))
          p[key] = [p[key]];
      }
      if (Array.isArray(p[key]))
        p[key].push(value);
      else
        p[key] = value;
    });
    Object.keys(out).filter(function(k, _, __) {
      if (!out[k] || typeof out[k] !== "object" || Array.isArray(out[k]))
        return false;
      var parts = dotSplit(k);
      var p2 = out;
      var l = parts.pop();
      var nl = l.replace(/\\\./g, ".");
      parts.forEach(function(part, _2, __2) {
        if (part === "__proto__")
          return;
        if (!p2[part] || typeof p2[part] !== "object")
          p2[part] = {};
        p2 = p2[part];
      });
      if (p2 === out && nl === l)
        return false;
      p2[nl] = out[k];
      return true;
    }).forEach(function(del, _, __) {
      delete out[del];
    });
    return out;
  };
  var isQuoted = function(val) {
    return val.charAt(0) === '"' && val.slice(-1) === '"' || val.charAt(0) === "'" && val.slice(-1) === "'";
  };
  var safe = function(val) {
    return typeof val !== "string" || val.match(/[=\r\n]/) || val.match(/^\[/) || val.length > 1 && isQuoted(val) || val !== val.trim() ? JSON.stringify(val) : val.replace(/;/g, "\\;").replace(/#/g, "\\#");
  };
  var unsafe = function(val, doUnesc) {
    val = (val || "").trim();
    if (isQuoted(val)) {
      if (val.charAt(0) === "'")
        val = val.substr(1, val.length - 2);
      try {
        val = JSON.parse(val);
      } catch (_) {
      }
    } else {
      var esc = false;
      var unesc = "";
      for (var i = 0, l = val.length;i < l; i++) {
        var c = val.charAt(i);
        if (esc) {
          if ("\\;#".indexOf(c) !== -1)
            unesc += c;
          else
            unesc += "\\" + c;
          esc = false;
        } else if (";#".indexOf(c) !== -1)
          break;
        else if (c === "\\")
          esc = true;
        else
          unesc += c;
      }
      if (esc)
        unesc += "\\";
      return unesc.trim();
    }
    return val;
  };
  exports.parse = exports.decode = decode;
  exports.stringify = exports.encode = encode;
  exports.safe = safe;
  exports.unsafe = unsafe;
  var eol = typeof process !== "undefined" && process.platform === "win32" ? "\r\n" : "\n";
});

// node_modules/config-chain/index.js
var require_config_chain = __commonJS((exports, module) => {
  var ConfigChain = function() {
    EE.apply(this);
    ProtoList.apply(this, arguments);
    this._awaiting = 0;
    this._saving = 0;
    this.sources = {};
  };
  var __dirname = "/Users/riodprabowo/Learning/create-hihono/node_modules/config-chain";
  var ProtoList = require_proto_list();
  var path3 = import.meta.require("path");
  var fs = import.meta.require("fs");
  var ini = require_ini();
  var EE = import.meta.require("events").EventEmitter;
  var url = import.meta.require("url");
  var http = import.meta.require("http");
  var exports = module.exports = function() {
    var args = [].slice.call(arguments), conf = new ConfigChain;
    while (args.length) {
      var a = args.shift();
      if (a)
        conf.push(typeof a === "string" ? json(a) : a);
    }
    return conf;
  };
  var find = exports.find = function() {
    var rel = path3.join.apply(null, [].slice.call(arguments));
    function find2(start, rel2) {
      var file = path3.join(start, rel2);
      try {
        fs.statSync(file);
        return file;
      } catch (err) {
        if (path3.dirname(start) !== start)
          return find2(path3.dirname(start), rel2);
      }
    }
    return find2(__dirname, rel);
  };
  var parse = exports.parse = function(content, file, type) {
    content = "" + content;
    if (!type) {
      try {
        return JSON.parse(content);
      } catch (er) {
        return ini.parse(content);
      }
    } else if (type === "json") {
      if (this.emit) {
        try {
          return JSON.parse(content);
        } catch (er) {
          this.emit("error", er);
        }
      } else {
        return JSON.parse(content);
      }
    } else {
      return ini.parse(content);
    }
  };
  var json = exports.json = function() {
    var args = [].slice.call(arguments).filter(function(arg) {
      return arg != null;
    });
    var file = path3.join.apply(null, args);
    var content;
    try {
      content = fs.readFileSync(file, "utf-8");
    } catch (err) {
      return;
    }
    return parse(content, file, "json");
  };
  var env2 = exports.env = function(prefix, env3) {
    env3 = env3 || process.env;
    var obj = {};
    var l = prefix.length;
    for (var k in env3) {
      if (k.indexOf(prefix) === 0)
        obj[k.substring(l)] = env3[k];
    }
    return obj;
  };
  exports.ConfigChain = ConfigChain;
  var extras = {
    constructor: { value: ConfigChain }
  };
  Object.keys(EE.prototype).forEach(function(k) {
    extras[k] = Object.getOwnPropertyDescriptor(EE.prototype, k);
  });
  ConfigChain.prototype = Object.create(ProtoList.prototype, extras);
  ConfigChain.prototype.del = function(key, where) {
    if (where) {
      var target = this.sources[where];
      target = target && target.data;
      if (!target) {
        return this.emit("error", new Error("not found " + where));
      }
      delete target[key];
    } else {
      for (var i = 0, l = this.list.length;i < l; i++) {
        delete this.list[i][key];
      }
    }
    return this;
  };
  ConfigChain.prototype.set = function(key, value, where) {
    var target;
    if (where) {
      target = this.sources[where];
      target = target && target.data;
      if (!target) {
        return this.emit("error", new Error("not found " + where));
      }
    } else {
      target = this.list[0];
      if (!target) {
        return this.emit("error", new Error("cannot set, no confs!"));
      }
    }
    target[key] = value;
    return this;
  };
  ConfigChain.prototype.get = function(key, where) {
    if (where) {
      where = this.sources[where];
      if (where)
        where = where.data;
      if (where && Object.hasOwnProperty.call(where, key))
        return where[key];
      return;
    }
    return this.list[0][key];
  };
  ConfigChain.prototype.save = function(where, type, cb) {
    if (typeof type === "function")
      cb = type, type = null;
    var target = this.sources[where];
    if (!target || !(target.path || target.source) || !target.data) {
      return this.emit("error", new Error("bad save target: " + where));
    }
    if (target.source) {
      var pref = target.prefix || "";
      Object.keys(target.data).forEach(function(k) {
        target.source[pref + k] = target.data[k];
      });
      return this;
    }
    var type = type || target.type;
    var data = target.data;
    if (target.type === "json") {
      data = JSON.stringify(data);
    } else {
      data = ini.stringify(data);
    }
    this._saving++;
    fs.writeFile(target.path, data, "utf8", function(er) {
      this._saving--;
      if (er) {
        if (cb)
          return cb(er);
        else
          return this.emit("error", er);
      }
      if (this._saving === 0) {
        if (cb)
          cb();
        this.emit("save");
      }
    }.bind(this));
    return this;
  };
  ConfigChain.prototype.addFile = function(file, type, name2) {
    name2 = name2 || file;
    var marker = { __source__: name2 };
    this.sources[name2] = { path: file, type };
    this.push(marker);
    this._await();
    fs.readFile(file, "utf8", function(er, data) {
      if (er)
        this.emit("error", er);
      this.addString(data, file, type, marker);
    }.bind(this));
    return this;
  };
  ConfigChain.prototype.addEnv = function(prefix, env3, name2) {
    name2 = name2 || "env";
    var data = exports.env(prefix, env3);
    this.sources[name2] = { data, source: env3, prefix };
    return this.add(data, name2);
  };
  ConfigChain.prototype.addUrl = function(req, type, name2) {
    this._await();
    var href = url.format(req);
    name2 = name2 || href;
    var marker = { __source__: name2 };
    this.sources[name2] = { href, type };
    this.push(marker);
    http.request(req, function(res) {
      var c = [];
      var ct = res.headers["content-type"];
      if (!type) {
        type = ct.indexOf("json") !== -1 ? "json" : ct.indexOf("ini") !== -1 ? "ini" : href.match(/\.json$/) ? "json" : href.match(/\.ini$/) ? "ini" : null;
        marker.type = type;
      }
      res.on("data", c.push.bind(c)).on("end", function() {
        this.addString(Buffer.concat(c), href, type, marker);
      }.bind(this)).on("error", this.emit.bind(this, "error"));
    }.bind(this)).on("error", this.emit.bind(this, "error")).end();
    return this;
  };
  ConfigChain.prototype.addString = function(data, file, type, marker) {
    data = this.parse(data, file, type);
    this.add(data, marker);
    return this;
  };
  ConfigChain.prototype.add = function(data, marker) {
    if (marker && typeof marker === "object") {
      var i = this.list.indexOf(marker);
      if (i === -1) {
        return this.emit("error", new Error("bad marker"));
      }
      this.splice(i, 1, data);
      marker = marker.__source__;
      this.sources[marker] = this.sources[marker] || {};
      this.sources[marker].data = data;
      this._resolve();
    } else {
      if (typeof marker === "string") {
        this.sources[marker] = this.sources[marker] || {};
        this.sources[marker].data = data;
      }
      this._await();
      this.push(data);
      process.nextTick(this._resolve.bind(this));
    }
    return this;
  };
  ConfigChain.prototype.parse = exports.parse;
  ConfigChain.prototype._await = function() {
    this._awaiting++;
  };
  ConfigChain.prototype._resolve = function() {
    this._awaiting--;
    if (this._awaiting === 0)
      this.emit("load", this);
  };
});

// node_modules/npm-conf/lib/types.js
var require_types = __commonJS((exports) => {
  var path3 = import.meta.require("path");
  var Stream = import.meta.require("stream").Stream;
  var url = import.meta.require("url");
  var Umask = () => {
  };
  var getLocalAddresses = () => [];
  var semver = () => {
  };
  exports.types = {
    access: [null, "restricted", "public"],
    "allow-same-version": Boolean,
    "always-auth": Boolean,
    also: [null, "dev", "development"],
    "auth-type": ["legacy", "sso", "saml", "oauth"],
    "bin-links": Boolean,
    browser: [null, String],
    ca: [null, String, Array],
    cafile: path3,
    cache: path3,
    "cache-lock-stale": Number,
    "cache-lock-retries": Number,
    "cache-lock-wait": Number,
    "cache-max": Number,
    "cache-min": Number,
    cert: [null, String],
    color: ["always", Boolean],
    depth: Number,
    description: Boolean,
    dev: Boolean,
    "dry-run": Boolean,
    editor: String,
    "engine-strict": Boolean,
    force: Boolean,
    "fetch-retries": Number,
    "fetch-retry-factor": Number,
    "fetch-retry-mintimeout": Number,
    "fetch-retry-maxtimeout": Number,
    git: String,
    "git-tag-version": Boolean,
    global: Boolean,
    globalconfig: path3,
    "global-style": Boolean,
    group: [Number, String],
    "https-proxy": [null, url],
    "user-agent": String,
    "ham-it-up": Boolean,
    heading: String,
    "if-present": Boolean,
    "ignore-prepublish": Boolean,
    "ignore-scripts": Boolean,
    "init-module": path3,
    "init-author-name": String,
    "init-author-email": String,
    "init-author-url": ["", url],
    "init-license": String,
    "init-version": semver,
    json: Boolean,
    key: [null, String],
    "legacy-bundling": Boolean,
    link: Boolean,
    "local-address": getLocalAddresses(),
    loglevel: ["silent", "error", "warn", "notice", "http", "timing", "info", "verbose", "silly"],
    logstream: Stream,
    "logs-max": Number,
    long: Boolean,
    maxsockets: Number,
    message: String,
    "metrics-registry": [null, String],
    "node-version": [null, semver],
    offline: Boolean,
    "onload-script": [null, String],
    only: [null, "dev", "development", "prod", "production"],
    optional: Boolean,
    "package-lock": Boolean,
    parseable: Boolean,
    "prefer-offline": Boolean,
    "prefer-online": Boolean,
    prefix: path3,
    production: Boolean,
    progress: Boolean,
    "proprietary-attribs": Boolean,
    proxy: [null, false, url],
    "rebuild-bundle": Boolean,
    registry: [null, url],
    rollback: Boolean,
    save: Boolean,
    "save-bundle": Boolean,
    "save-dev": Boolean,
    "save-exact": Boolean,
    "save-optional": Boolean,
    "save-prefix": String,
    "save-prod": Boolean,
    scope: String,
    "script-shell": [null, String],
    "scripts-prepend-node-path": [false, true, "auto", "warn-only"],
    searchopts: String,
    searchexclude: [null, String],
    searchlimit: Number,
    searchstaleness: Number,
    "send-metrics": Boolean,
    shell: String,
    shrinkwrap: Boolean,
    "sign-git-tag": Boolean,
    "sso-poll-frequency": Number,
    "sso-type": [null, "oauth", "saml"],
    "strict-ssl": Boolean,
    tag: String,
    timing: Boolean,
    tmp: path3,
    unicode: Boolean,
    "unsafe-perm": Boolean,
    usage: Boolean,
    user: [Number, String],
    userconfig: path3,
    umask: Umask,
    version: Boolean,
    "tag-version-prefix": String,
    versions: Boolean,
    viewer: String,
    _exit: Boolean
  };
});

// node_modules/npm-conf/lib/util.js
var require_util = __commonJS((exports) => {
  var fs = import.meta.require("fs");
  var path3 = import.meta.require("path");
  var types = require_types();
  var envReplace = (str) => {
    if (typeof str !== "string" || !str) {
      return str;
    }
    const regex = /(\\*)\$\{([^}]+)\}/g;
    return str.replace(regex, (orig, esc, name2) => {
      esc = esc.length > 0 && esc.length % 2;
      if (esc) {
        return orig;
      }
      if (process.env[name2] === undefined) {
        throw new Error(`Failed to replace env in config: ${orig}`);
      }
      return process.env[name2];
    });
  };
  var parseField = (field, key) => {
    if (typeof field !== "string") {
      return field;
    }
    const typeList = [].concat(types[key]);
    const isPath = typeList.indexOf(path3) !== -1;
    const isBool = typeList.indexOf(Boolean) !== -1;
    const isString = typeList.indexOf(String) !== -1;
    const isNumber = typeList.indexOf(Number) !== -1;
    field = `${field}`.trim();
    if (/^".*"$/.test(field)) {
      try {
        field = JSON.parse(field);
      } catch (err) {
        throw new Error(`Failed parsing JSON config key ${key}: ${field}`);
      }
    }
    if (isBool && !isString && field === "") {
      return true;
    }
    switch (field) {
      case "true": {
        return true;
      }
      case "false": {
        return false;
      }
      case "null": {
        return null;
      }
      case "undefined": {
        return;
      }
    }
    field = envReplace(field);
    if (isPath) {
      const regex = process.platform === "win32" ? /^~(\/|\\)/ : /^~\//;
      if (regex.test(field) && process.env.HOME) {
        field = path3.resolve(process.env.HOME, field.substr(2));
      }
      field = path3.resolve(field);
    }
    if (isNumber && !field.isNan()) {
      field = Number(field);
    }
    return field;
  };
  var findPrefix = (name2) => {
    name2 = path3.resolve(name2);
    let walkedUp = false;
    while (path3.basename(name2) === "node_modules") {
      name2 = path3.dirname(name2);
      walkedUp = true;
    }
    if (walkedUp) {
      return name2;
    }
    const find = (name3, original) => {
      const regex = /^[a-zA-Z]:(\\|\/)?$/;
      if (name3 === "/" || process.platform === "win32" && regex.test(name3)) {
        return original;
      }
      try {
        const files = fs.readdirSync(name3);
        if (files.indexOf("node_modules") !== -1 || files.indexOf("package.json") !== -1) {
          return name3;
        }
        const dirname = path3.dirname(name3);
        if (dirname === name3) {
          return original;
        }
        return find(dirname, original);
      } catch (err) {
        if (name3 === original) {
          if (err.code === "ENOENT") {
            return original;
          }
          throw err;
        }
        return original;
      }
    };
    return find(name2, name2);
  };
  exports.envReplace = envReplace;
  exports.findPrefix = findPrefix;
  exports.parseField = parseField;
});

// node_modules/npm-conf/lib/conf.js
var require_conf = __commonJS((exports, module) => {
  var fs = import.meta.require("fs");
  var path3 = import.meta.require("path");
  var ConfigChain = require_config_chain().ConfigChain;
  var util = require_util();

  class Conf extends ConfigChain {
    constructor(base) {
      super(base);
      this.root = base;
    }
    add(data, marker) {
      try {
        for (const x of Object.keys(data)) {
          data[x] = util.parseField(data[x], x);
        }
      } catch (err) {
        throw err;
      }
      return super.add(data, marker);
    }
    addFile(file, name2) {
      name2 = name2 || file;
      const marker = { __source__: name2 };
      this.sources[name2] = { path: file, type: "ini" };
      this.push(marker);
      this._await();
      try {
        const contents4 = fs.readFileSync(file, "utf8");
        this.addString(contents4, file, "ini", marker);
      } catch (err) {
        this.add({}, marker);
      }
      return this;
    }
    addEnv(env2) {
      env2 = env2 || process.env;
      const conf = {};
      Object.keys(env2).filter((x) => /^npm_config_/i.test(x)).forEach((x) => {
        if (!env2[x]) {
          return;
        }
        const p = x.toLowerCase().replace(/^npm_config_/, "").replace(/(?!^)_/g, "-");
        conf[p] = env2[x];
      });
      return super.addEnv("", conf, "env");
    }
    loadPrefix() {
      const cli2 = this.list[0];
      Object.defineProperty(this, "prefix", {
        enumerable: true,
        set: (prefix) => {
          const g = this.get("global");
          this[g ? "globalPrefix" : "localPrefix"] = prefix;
        },
        get: () => {
          const g = this.get("global");
          return g ? this.globalPrefix : this.localPrefix;
        }
      });
      Object.defineProperty(this, "globalPrefix", {
        enumerable: true,
        set: (prefix) => {
          this.set("prefix", prefix);
        },
        get: () => {
          return path3.resolve(this.get("prefix"));
        }
      });
      let p;
      Object.defineProperty(this, "localPrefix", {
        enumerable: true,
        set: (prefix) => {
          p = prefix;
        },
        get: () => {
          return p;
        }
      });
      if (Object.prototype.hasOwnProperty.call(cli2, "prefix")) {
        p = path3.resolve(cli2.prefix);
      } else {
        try {
          const prefix = util.findPrefix(process.cwd());
          p = prefix;
        } catch (err) {
          throw err;
        }
      }
      return p;
    }
    loadCAFile(file) {
      if (!file) {
        return;
      }
      try {
        const contents4 = fs.readFileSync(file, "utf8");
        const delim = "-----END CERTIFICATE-----";
        const output = contents4.split(delim).filter((x) => Boolean(x.trim())).map((x) => x.trimLeft() + delim);
        this.set("ca", output);
      } catch (err) {
        if (err.code === "ENOENT") {
          return;
        }
        throw err;
      }
    }
    loadUser() {
      const defConf = this.root;
      if (this.get("global")) {
        return;
      }
      if (process.env.SUDO_UID) {
        defConf.user = Number(process.env.SUDO_UID);
        return;
      }
      const prefix = path3.resolve(this.get("prefix"));
      try {
        const stats = fs.statSync(prefix);
        defConf.user = stats.uid;
      } catch (err) {
        if (err.code === "ENOENT") {
          return;
        }
        throw err;
      }
    }
  }
  module.exports = Conf;
});

// node_modules/npm-conf/lib/defaults.js
var require_defaults = __commonJS((exports) => {
  var os2 = import.meta.require("os");
  var path3 = import.meta.require("path");
  var temp = os2.tmpdir();
  var uidOrPid = process.getuid ? process.getuid() : process.pid;
  var hasUnicode = () => true;
  var isWindows = process.platform === "win32";
  var osenv = {
    editor: () => process.env.EDITOR || process.env.VISUAL || (isWindows ? "notepad.exe" : "vi"),
    shell: () => isWindows ? process.env.COMSPEC || "cmd.exe" : process.env.SHELL || "/bin/bash"
  };
  var umask = {
    fromString: () => process.umask()
  };
  var home = os2.homedir();
  if (home) {
    process.env.HOME = home;
  } else {
    home = path3.resolve(temp, "npm-" + uidOrPid);
  }
  var cacheExtra = process.platform === "win32" ? "npm-cache" : ".npm";
  var cacheRoot = process.platform === "win32" ? process.env.APPDATA : home;
  var cache = path3.resolve(cacheRoot, cacheExtra);
  var defaults;
  var globalPrefix;
  Object.defineProperty(exports, "defaults", {
    get: function() {
      if (defaults)
        return defaults;
      if (process.env.PREFIX) {
        globalPrefix = process.env.PREFIX;
      } else if (process.platform === "win32") {
        globalPrefix = path3.dirname(process.execPath);
      } else {
        globalPrefix = path3.dirname(path3.dirname(process.execPath));
        if (process.env.DESTDIR) {
          globalPrefix = path3.join(process.env.DESTDIR, globalPrefix);
        }
      }
      defaults = {
        access: null,
        "allow-same-version": false,
        "always-auth": false,
        also: null,
        "auth-type": "legacy",
        "bin-links": true,
        browser: null,
        ca: null,
        cafile: null,
        cache,
        "cache-lock-stale": 60000,
        "cache-lock-retries": 10,
        "cache-lock-wait": 1e4,
        "cache-max": Infinity,
        "cache-min": 10,
        cert: null,
        color: true,
        depth: Infinity,
        description: true,
        dev: false,
        "dry-run": false,
        editor: osenv.editor(),
        "engine-strict": false,
        force: false,
        "fetch-retries": 2,
        "fetch-retry-factor": 10,
        "fetch-retry-mintimeout": 1e4,
        "fetch-retry-maxtimeout": 60000,
        git: "git",
        "git-tag-version": true,
        global: false,
        globalconfig: path3.resolve(globalPrefix, "etc", "npmrc"),
        "global-style": false,
        group: process.platform === "win32" ? 0 : process.env.SUDO_GID || process.getgid && process.getgid(),
        "ham-it-up": false,
        heading: "npm",
        "if-present": false,
        "ignore-prepublish": false,
        "ignore-scripts": false,
        "init-module": path3.resolve(home, ".npm-init.js"),
        "init-author-name": "",
        "init-author-email": "",
        "init-author-url": "",
        "init-version": "1.0.0",
        "init-license": "ISC",
        json: false,
        key: null,
        "legacy-bundling": false,
        link: false,
        "local-address": undefined,
        loglevel: "notice",
        logstream: process.stderr,
        "logs-max": 10,
        long: false,
        maxsockets: 50,
        message: "%s",
        "metrics-registry": null,
        "node-version": process.version,
        offline: false,
        "onload-script": false,
        only: null,
        optional: true,
        "package-lock": true,
        parseable: false,
        "prefer-offline": false,
        "prefer-online": false,
        prefix: globalPrefix,
        production: false,
        progress: !process.env.TRAVIS && !process.env.CI,
        "proprietary-attribs": true,
        proxy: null,
        "https-proxy": null,
        "user-agent": "npm/{npm-version} " + "node/{node-version} " + "{platform} " + "{arch}",
        "rebuild-bundle": true,
        registry: "https://registry.npmjs.org/",
        rollback: true,
        save: true,
        "save-bundle": false,
        "save-dev": false,
        "save-exact": false,
        "save-optional": false,
        "save-prefix": "^",
        "save-prod": false,
        scope: "",
        "script-shell": null,
        "scripts-prepend-node-path": "warn-only",
        searchopts: "",
        searchexclude: null,
        searchlimit: 20,
        searchstaleness: 15 * 60,
        "send-metrics": false,
        shell: osenv.shell(),
        shrinkwrap: true,
        "sign-git-tag": false,
        "sso-poll-frequency": 500,
        "sso-type": "oauth",
        "strict-ssl": true,
        tag: "latest",
        "tag-version-prefix": "v",
        timing: false,
        tmp: temp,
        unicode: hasUnicode(),
        "unsafe-perm": process.platform === "win32" || process.platform === "cygwin" || !(process.getuid && process.setuid && process.getgid && process.setgid) || process.getuid() !== 0,
        usage: false,
        user: process.platform === "win32" ? 0 : "nobody",
        userconfig: path3.resolve(home, ".npmrc"),
        umask: process.umask ? process.umask() : umask.fromString("022"),
        version: false,
        versions: false,
        viewer: process.platform === "win32" ? "browser" : "man",
        _exit: true
      };
      return defaults;
    }
  });
});

// node_modules/npm-conf/index.js
var require_npm_conf = __commonJS((exports, module) => {
  var path3 = import.meta.require("path");
  var Conf = require_conf();
  var defaults = require_defaults();
  module.exports = (opts) => {
    const conf = new Conf(Object.assign({}, defaults.defaults));
    conf.add(Object.assign({}, opts), "cli");
    conf.addEnv();
    conf.loadPrefix();
    const projectConf = path3.resolve(conf.localPrefix, ".npmrc");
    const userConf = conf.get("userconfig");
    if (!conf.get("global") && projectConf !== userConf) {
      conf.addFile(projectConf, "project");
    } else {
      conf.add({}, "project");
    }
    conf.addFile(conf.get("userconfig"), "user");
    if (conf.get("prefix")) {
      const etc = path3.resolve(conf.get("prefix"), "etc");
      conf.root.globalconfig = path3.resolve(etc, "npmrc");
      conf.root.globalignorefile = path3.resolve(etc, "npmignore");
    }
    conf.addFile(conf.get("globalconfig"), "global");
    conf.loadUser();
    const caFile = conf.get("cafile");
    if (caFile) {
      conf.loadCAFile(caFile);
    }
    return conf;
  };
  module.exports.defaults = Object.assign({}, defaults.defaults);
});

// node_modules/get-proxy/index.js
var require_get_proxy = __commonJS((exports, module) => {
  var npmConf = require_npm_conf()();
  module.exports = () => {
    return process.env.HTTPS_PROXY || process.env.https_proxy || process.env.HTTP_PROXY || process.env.http_proxy || npmConf.get("https-proxy") || npmConf.get("http-proxy") || npmConf.get("proxy") || null;
  };
});

// node_modules/has-symbol-support-x/index.js
var require_has_symbol_support_x = __commonJS((exports, module) => {
  module.exports = typeof Symbol === "function" && typeof Symbol("") === "symbol";
});

// node_modules/has-to-string-tag-x/index.js
var require_has_to_string_tag_x = __commonJS((exports, module) => {
  module.exports = require_has_symbol_support_x() && typeof Symbol.toStringTag === "symbol";
});

// node_modules/is-object/index.js
var require_is_object = __commonJS((exports, module) => {
  module.exports = function isObject(x) {
    return typeof x === "object" && x !== null;
  };
});

// node_modules/isurl/index.js
var require_isurl = __commonJS((exports, module) => {
  var hasToStringTag = require_has_to_string_tag_x();
  var isObject = require_is_object();
  var toString = Object.prototype.toString;
  var urlClass = "[object URL]";
  var hash = "hash";
  var host = "host";
  var hostname = "hostname";
  var href = "href";
  var password = "password";
  var pathname = "pathname";
  var port = "port";
  var protocol = "protocol";
  var search = "search";
  var username = "username";
  var isURL = (url, supportIncomplete) => {
    if (!isObject(url))
      return false;
    if (!hasToStringTag && toString.call(url) === urlClass)
      return true;
    if (!(href in url))
      return false;
    if (!(protocol in url))
      return false;
    if (!(username in url))
      return false;
    if (!(password in url))
      return false;
    if (!(hostname in url))
      return false;
    if (!(port in url))
      return false;
    if (!(host in url))
      return false;
    if (!(pathname in url))
      return false;
    if (!(search in url))
      return false;
    if (!(hash in url))
      return false;
    if (supportIncomplete !== true) {
      if (!isObject(url.searchParams))
        return false;
    }
    return true;
  };
  isURL.lenient = (url) => {
    return isURL(url, true);
  };
  module.exports = isURL;
});

// node_modules/safe-buffer/index.js
var require_safe_buffer = __commonJS((exports, module) => {
  var copyProps = function(src, dst) {
    for (var key in src) {
      dst[key] = src[key];
    }
  };
  var SafeBuffer = function(arg, encodingOrOffset, length) {
    return Buffer4(arg, encodingOrOffset, length);
  };
  /*! safe-buffer. MIT License. Feross Aboukhadijeh <https://feross.org/opensource> */
  var buffer = import.meta.require("buffer");
  var Buffer4 = buffer.Buffer;
  if (Buffer4.from && Buffer4.alloc && Buffer4.allocUnsafe && Buffer4.allocUnsafeSlow) {
    module.exports = buffer;
  } else {
    copyProps(buffer, exports);
    exports.Buffer = SafeBuffer;
  }
  SafeBuffer.prototype = Object.create(Buffer4.prototype);
  copyProps(Buffer4, SafeBuffer);
  SafeBuffer.from = function(arg, encodingOrOffset, length) {
    if (typeof arg === "number") {
      throw new TypeError("Argument must not be a number");
    }
    return Buffer4(arg, encodingOrOffset, length);
  };
  SafeBuffer.alloc = function(size, fill, encoding) {
    if (typeof size !== "number") {
      throw new TypeError("Argument must be a number");
    }
    var buf = Buffer4(size);
    if (fill !== undefined) {
      if (typeof encoding === "string") {
        buf.fill(fill, encoding);
      } else {
        buf.fill(fill);
      }
    } else {
      buf.fill(0);
    }
    return buf;
  };
  SafeBuffer.allocUnsafe = function(size) {
    if (typeof size !== "number") {
      throw new TypeError("Argument must be a number");
    }
    return Buffer4(size);
  };
  SafeBuffer.allocUnsafeSlow = function(size) {
    if (typeof size !== "number") {
      throw new TypeError("Argument must be a number");
    }
    return buffer.SlowBuffer(size);
  };
});

// node_modules/tunnel-agent/index.js
var require_tunnel_agent = __commonJS((exports) => {
  var httpOverHttp = function(options) {
    var agent = new TunnelingAgent(options);
    agent.request = http.request;
    return agent;
  };
  var httpsOverHttp = function(options) {
    var agent = new TunnelingAgent(options);
    agent.request = http.request;
    agent.createSocket = createSecureSocket;
    agent.defaultPort = 443;
    return agent;
  };
  var httpOverHttps = function(options) {
    var agent = new TunnelingAgent(options);
    agent.request = https.request;
    return agent;
  };
  var httpsOverHttps = function(options) {
    var agent = new TunnelingAgent(options);
    agent.request = https.request;
    agent.createSocket = createSecureSocket;
    agent.defaultPort = 443;
    return agent;
  };
  var TunnelingAgent = function(options) {
    var self2 = this;
    self2.options = options || {};
    self2.proxyOptions = self2.options.proxy || {};
    self2.maxSockets = self2.options.maxSockets || http.Agent.defaultMaxSockets;
    self2.requests = [];
    self2.sockets = [];
    self2.on("free", function onFree(socket, host, port) {
      for (var i = 0, len = self2.requests.length;i < len; ++i) {
        var pending = self2.requests[i];
        if (pending.host === host && pending.port === port) {
          self2.requests.splice(i, 1);
          pending.request.onSocket(socket);
          return;
        }
      }
      socket.destroy();
      self2.removeSocket(socket);
    });
  };
  var createSecureSocket = function(options, cb) {
    var self2 = this;
    TunnelingAgent.prototype.createSocket.call(self2, options, function(socket) {
      var secureSocket = tls.connect(0, mergeOptions({}, self2.options, {
        servername: options.host,
        socket
      }));
      self2.sockets[self2.sockets.indexOf(socket)] = secureSocket;
      cb(secureSocket);
    });
  };
  var mergeOptions = function(target) {
    for (var i = 1, len = arguments.length;i < len; ++i) {
      var overrides = arguments[i];
      if (typeof overrides === "object") {
        var keys = Object.keys(overrides);
        for (var j = 0, keyLen = keys.length;j < keyLen; ++j) {
          var k = keys[j];
          if (overrides[k] !== undefined) {
            target[k] = overrides[k];
          }
        }
      }
    }
    return target;
  };
  var net = import.meta.require("net");
  var tls = import.meta.require("tls");
  var http = import.meta.require("http");
  var https = import.meta.require("https");
  var events = import.meta.require("events");
  var assert = import.meta.require("assert");
  var util = import.meta.require("util");
  var Buffer4 = require_safe_buffer().Buffer;
  exports.httpOverHttp = httpOverHttp;
  exports.httpsOverHttp = httpsOverHttp;
  exports.httpOverHttps = httpOverHttps;
  exports.httpsOverHttps = httpsOverHttps;
  util.inherits(TunnelingAgent, events.EventEmitter);
  TunnelingAgent.prototype.addRequest = function addRequest(req, options) {
    var self2 = this;
    if (typeof options === "string") {
      options = {
        host: options,
        port: arguments[2],
        path: arguments[3]
      };
    }
    if (self2.sockets.length >= this.maxSockets) {
      self2.requests.push({ host: options.host, port: options.port, request: req });
      return;
    }
    self2.createConnection({ host: options.host, port: options.port, request: req });
  };
  TunnelingAgent.prototype.createConnection = function createConnection(pending) {
    var self2 = this;
    self2.createSocket(pending, function(socket) {
      socket.on("free", onFree);
      socket.on("close", onCloseOrRemove);
      socket.on("agentRemove", onCloseOrRemove);
      pending.request.onSocket(socket);
      function onFree() {
        self2.emit("free", socket, pending.host, pending.port);
      }
      function onCloseOrRemove(err) {
        self2.removeSocket(socket);
        socket.removeListener("free", onFree);
        socket.removeListener("close", onCloseOrRemove);
        socket.removeListener("agentRemove", onCloseOrRemove);
      }
    });
  };
  TunnelingAgent.prototype.createSocket = function createSocket(options, cb) {
    var self2 = this;
    var placeholder = {};
    self2.sockets.push(placeholder);
    var connectOptions = mergeOptions({}, self2.proxyOptions, {
      method: "CONNECT",
      path: options.host + ":" + options.port,
      agent: false
    });
    if (connectOptions.proxyAuth) {
      connectOptions.headers = connectOptions.headers || {};
      connectOptions.headers["Proxy-Authorization"] = "Basic " + Buffer4.from(connectOptions.proxyAuth).toString("base64");
    }
    debug("making CONNECT request");
    var connectReq = self2.request(connectOptions);
    connectReq.useChunkedEncodingByDefault = false;
    connectReq.once("response", onResponse);
    connectReq.once("upgrade", onUpgrade);
    connectReq.once("connect", onConnect);
    connectReq.once("error", onError);
    connectReq.end();
    function onResponse(res) {
      res.upgrade = true;
    }
    function onUpgrade(res, socket, head) {
      process.nextTick(function() {
        onConnect(res, socket, head);
      });
    }
    function onConnect(res, socket, head) {
      connectReq.removeAllListeners();
      socket.removeAllListeners();
      if (res.statusCode === 200) {
        assert.equal(head.length, 0);
        debug("tunneling connection has established");
        self2.sockets[self2.sockets.indexOf(placeholder)] = socket;
        cb(socket);
      } else {
        debug("tunneling socket could not be established, statusCode=%d", res.statusCode);
        var error2 = new Error("tunneling socket could not be established, " + "statusCode=" + res.statusCode);
        error2.code = "ECONNRESET";
        options.request.emit("error", error2);
        self2.removeSocket(placeholder);
      }
    }
    function onError(cause) {
      connectReq.removeAllListeners();
      debug("tunneling socket could not be established, cause=%s\n", cause.message, cause.stack);
      var error2 = new Error("tunneling socket could not be established, " + "cause=" + cause.message);
      error2.code = "ECONNRESET";
      options.request.emit("error", error2);
      self2.removeSocket(placeholder);
    }
  };
  TunnelingAgent.prototype.removeSocket = function removeSocket(socket) {
    var pos = this.sockets.indexOf(socket);
    if (pos === -1)
      return;
    this.sockets.splice(pos, 1);
    var pending = this.requests.shift();
    if (pending) {
      this.createConnection(pending);
    }
  };
  var debug;
  if (process.env.NODE_DEBUG && /\btunnel\b/.test(process.env.NODE_DEBUG)) {
    debug = function() {
      var args = Array.prototype.slice.call(arguments);
      if (typeof args[0] === "string") {
        args[0] = "TUNNEL: " + args[0];
      } else {
        args.unshift("TUNNEL:");
      }
      console.error.apply(console, args);
    };
  } else {
    debug = function() {
    };
  }
  exports.debug = debug;
});

// node_modules/url-to-options/index.js
var require_url_to_options = __commonJS((exports, module) => {
  var urlToOptions = function(url) {
    var options = {
      protocol: url.protocol,
      hostname: url.hostname,
      hash: url.hash,
      search: url.search,
      pathname: url.pathname,
      path: `${url.pathname}${url.search}`,
      href: url.href
    };
    if (url.port !== "") {
      options.port = Number(url.port);
    }
    if (url.username || url.password) {
      options.auth = `${url.username}:${url.password}`;
    }
    return options;
  };
  module.exports = urlToOptions;
});

// node_modules/caw/index.js
var require_caw = __commonJS((exports, module) => {
  var url = import.meta.require("url");
  var getProxy = require_get_proxy();
  var isurl = require_isurl();
  var tunnelAgent = require_tunnel_agent();
  var urlToOptions = require_url_to_options();
  module.exports = (proxy, opts) => {
    proxy = proxy || getProxy();
    opts = Object.assign({}, opts);
    if (typeof proxy === "object") {
      opts = proxy;
      proxy = getProxy();
    }
    if (!proxy) {
      return null;
    }
    proxy = isurl.lenient(proxy) ? urlToOptions(proxy) : url.parse(proxy);
    const uriProtocol = opts.protocol === "https" ? "https" : "http";
    const proxyProtocol = proxy.protocol === "https:" ? "Https" : "Http";
    const port = proxy.port || (proxyProtocol === "Https" ? 443 : 80);
    const method = `${uriProtocol}Over${proxyProtocol}`;
    delete opts.protocol;
    return tunnelAgent[method](Object.assign({
      proxy: {
        port,
        host: proxy.hostname,
        proxyAuth: proxy.auth
      }
    }, opts));
  };
});

// node_modules/content-disposition/index.js
var require_content_disposition = __commonJS((exports, module) => {
  var contentDisposition = function(filename, options) {
    var opts = options || {};
    var type = opts.type || "attachment";
    var params = createparams(filename, opts.fallback);
    return format2(new ContentDisposition(type, params));
  };
  var createparams = function(filename, fallback) {
    if (filename === undefined) {
      return;
    }
    var params = {};
    if (typeof filename !== "string") {
      throw new TypeError("filename must be a string");
    }
    if (fallback === undefined) {
      fallback = true;
    }
    if (typeof fallback !== "string" && typeof fallback !== "boolean") {
      throw new TypeError("fallback must be a string or boolean");
    }
    if (typeof fallback === "string" && NON_LATIN1_REGEXP.test(fallback)) {
      throw new TypeError("fallback must be ISO-8859-1 string");
    }
    var name2 = basename(filename);
    var isQuotedString = TEXT_REGEXP.test(name2);
    var fallbackName = typeof fallback !== "string" ? fallback && getlatin1(name2) : basename(fallback);
    var hasFallback = typeof fallbackName === "string" && fallbackName !== name2;
    if (hasFallback || !isQuotedString || HEX_ESCAPE_REGEXP.test(name2)) {
      params["filename*"] = name2;
    }
    if (isQuotedString || hasFallback) {
      params.filename = hasFallback ? fallbackName : name2;
    }
    return params;
  };
  var format2 = function(obj) {
    var parameters = obj.parameters;
    var type = obj.type;
    if (!type || typeof type !== "string" || !TOKEN_REGEXP.test(type)) {
      throw new TypeError("invalid type");
    }
    var string = String(type).toLowerCase();
    if (parameters && typeof parameters === "object") {
      var param;
      var params = Object.keys(parameters).sort();
      for (var i = 0;i < params.length; i++) {
        param = params[i];
        var val = param.substr(-1) === "*" ? ustring(parameters[param]) : qstring(parameters[param]);
        string += "; " + param + "=" + val;
      }
    }
    return string;
  };
  var decodefield = function(str) {
    var match = EXT_VALUE_REGEXP.exec(str);
    if (!match) {
      throw new TypeError("invalid extended field value");
    }
    var charset = match[1].toLowerCase();
    var encoded = match[2];
    var value;
    var binary = encoded.replace(HEX_ESCAPE_REPLACE_REGEXP, pdecode);
    switch (charset) {
      case "iso-8859-1":
        value = getlatin1(binary);
        break;
      case "utf-8":
        value = Buffer4.from(binary, "binary").toString("utf8");
        break;
      default:
        throw new TypeError("unsupported charset in extended field");
    }
    return value;
  };
  var getlatin1 = function(val) {
    return String(val).replace(NON_LATIN1_REGEXP, "?");
  };
  var parse = function(string) {
    if (!string || typeof string !== "string") {
      throw new TypeError("argument string is required");
    }
    var match = DISPOSITION_TYPE_REGEXP.exec(string);
    if (!match) {
      throw new TypeError("invalid type format");
    }
    var index = match[0].length;
    var type = match[1].toLowerCase();
    var key;
    var names = [];
    var params = {};
    var value;
    index = PARAM_REGEXP.lastIndex = match[0].substr(-1) === ";" ? index - 1 : index;
    while (match = PARAM_REGEXP.exec(string)) {
      if (match.index !== index) {
        throw new TypeError("invalid parameter format");
      }
      index += match[0].length;
      key = match[1].toLowerCase();
      value = match[2];
      if (names.indexOf(key) !== -1) {
        throw new TypeError("invalid duplicate parameter");
      }
      names.push(key);
      if (key.indexOf("*") + 1 === key.length) {
        key = key.slice(0, -1);
        value = decodefield(value);
        params[key] = value;
        continue;
      }
      if (typeof params[key] === "string") {
        continue;
      }
      if (value[0] === '"') {
        value = value.substr(1, value.length - 2).replace(QESC_REGEXP, "$1");
      }
      params[key] = value;
    }
    if (index !== -1 && index !== string.length) {
      throw new TypeError("invalid parameter format");
    }
    return new ContentDisposition(type, params);
  };
  var pdecode = function(str, hex) {
    return String.fromCharCode(parseInt(hex, 16));
  };
  var pencode = function(char) {
    return "%" + String(char).charCodeAt(0).toString(16).toUpperCase();
  };
  var qstring = function(val) {
    var str = String(val);
    return '"' + str.replace(QUOTE_REGEXP, "\\$1") + '"';
  };
  var ustring = function(val) {
    var str = String(val);
    var encoded = encodeURIComponent(str).replace(ENCODE_URL_ATTR_CHAR_REGEXP, pencode);
    return "UTF-8\'\'" + encoded;
  };
  var ContentDisposition = function(type, parameters) {
    this.type = type;
    this.parameters = parameters;
  };
  /*!
   * content-disposition
   * Copyright(c) 2014-2017 Douglas Christopher Wilson
   * MIT Licensed
   */
  module.exports = contentDisposition;
  module.exports.parse = parse;
  var basename = import.meta.require("path").basename;
  var Buffer4 = require_safe_buffer().Buffer;
  var ENCODE_URL_ATTR_CHAR_REGEXP = /[\x00-\x20"'()*,/:;<=>?@[\\\]{}\x7f]/g;
  var HEX_ESCAPE_REGEXP = /%[0-9A-Fa-f]{2}/;
  var HEX_ESCAPE_REPLACE_REGEXP = /%([0-9A-Fa-f]{2})/g;
  var NON_LATIN1_REGEXP = /[^\x20-\x7e\xa0-\xff]/g;
  var QESC_REGEXP = /\\([\u0000-\u007f])/g;
  var QUOTE_REGEXP = /([\\"])/g;
  var PARAM_REGEXP = /;[\x09\x20]*([!#$%&'*+.0-9A-Z^_`a-z|~-]+)[\x09\x20]*=[\x09\x20]*("(?:[\x20!\x23-\x5b\x5d-\x7e\x80-\xff]|\\[\x20-\x7e])*"|[!#$%&'*+.0-9A-Z^_`a-z|~-]+)[\x09\x20]*/g;
  var TEXT_REGEXP = /^[\x20-\x7e\x80-\xff]+$/;
  var TOKEN_REGEXP = /^[!#$%&'*+.0-9A-Z^_`a-z|~-]+$/;
  var EXT_VALUE_REGEXP = /^([A-Za-z0-9!#$%&+\-^_`{}~]+)'(?:[A-Za-z]{2,3}(?:-[A-Za-z]{3}){0,3}|[A-Za-z]{4,8}|)'((?:%[0-9A-Fa-f]{2}|[A-Za-z0-9!#$&+.^_`|~-])+)$/;
  var DISPOSITION_TYPE_REGEXP = /^([!#$%&'*+.0-9A-Z^_`a-z|~-]+)[\x09\x20]*(?:$|;)/;
});

// node_modules/archive-type/node_modules/file-type/index.js
var require_file_type = __commonJS((exports, module) => {
  module.exports = (input) => {
    const buf = new Uint8Array(input);
    if (!(buf && buf.length > 1)) {
      return null;
    }
    const check = (header, opts) => {
      opts = Object.assign({
        offset: 0
      }, opts);
      for (let i = 0;i < header.length; i++) {
        if (header[i] !== buf[i + opts.offset]) {
          return false;
        }
      }
      return true;
    };
    if (check([255, 216, 255])) {
      return {
        ext: "jpg",
        mime: "image/jpeg"
      };
    }
    if (check([137, 80, 78, 71, 13, 10, 26, 10])) {
      return {
        ext: "png",
        mime: "image/png"
      };
    }
    if (check([71, 73, 70])) {
      return {
        ext: "gif",
        mime: "image/gif"
      };
    }
    if (check([87, 69, 66, 80], { offset: 8 })) {
      return {
        ext: "webp",
        mime: "image/webp"
      };
    }
    if (check([70, 76, 73, 70])) {
      return {
        ext: "flif",
        mime: "image/flif"
      };
    }
    if ((check([73, 73, 42, 0]) || check([77, 77, 0, 42])) && check([67, 82], { offset: 8 })) {
      return {
        ext: "cr2",
        mime: "image/x-canon-cr2"
      };
    }
    if (check([73, 73, 42, 0]) || check([77, 77, 0, 42])) {
      return {
        ext: "tif",
        mime: "image/tiff"
      };
    }
    if (check([66, 77])) {
      return {
        ext: "bmp",
        mime: "image/bmp"
      };
    }
    if (check([73, 73, 188])) {
      return {
        ext: "jxr",
        mime: "image/vnd.ms-photo"
      };
    }
    if (check([56, 66, 80, 83])) {
      return {
        ext: "psd",
        mime: "image/vnd.adobe.photoshop"
      };
    }
    if (check([80, 75, 3, 4]) && check([109, 105, 109, 101, 116, 121, 112, 101, 97, 112, 112, 108, 105, 99, 97, 116, 105, 111, 110, 47, 101, 112, 117, 98, 43, 122, 105, 112], { offset: 30 })) {
      return {
        ext: "epub",
        mime: "application/epub+zip"
      };
    }
    if (check([80, 75, 3, 4]) && check([77, 69, 84, 65, 45, 73, 78, 70, 47, 109, 111, 122, 105, 108, 108, 97, 46, 114, 115, 97], { offset: 30 })) {
      return {
        ext: "xpi",
        mime: "application/x-xpinstall"
      };
    }
    if (check([80, 75]) && (buf[2] === 3 || buf[2] === 5 || buf[2] === 7) && (buf[3] === 4 || buf[3] === 6 || buf[3] === 8)) {
      return {
        ext: "zip",
        mime: "application/zip"
      };
    }
    if (check([117, 115, 116, 97, 114], { offset: 257 })) {
      return {
        ext: "tar",
        mime: "application/x-tar"
      };
    }
    if (check([82, 97, 114, 33, 26, 7]) && (buf[6] === 0 || buf[6] === 1)) {
      return {
        ext: "rar",
        mime: "application/x-rar-compressed"
      };
    }
    if (check([31, 139, 8])) {
      return {
        ext: "gz",
        mime: "application/gzip"
      };
    }
    if (check([66, 90, 104])) {
      return {
        ext: "bz2",
        mime: "application/x-bzip2"
      };
    }
    if (check([55, 122, 188, 175, 39, 28])) {
      return {
        ext: "7z",
        mime: "application/x-7z-compressed"
      };
    }
    if (check([120, 1])) {
      return {
        ext: "dmg",
        mime: "application/x-apple-diskimage"
      };
    }
    if (check([0, 0, 0]) && (buf[3] === 24 || buf[3] === 32) && check([102, 116, 121, 112], { offset: 4 }) || check([51, 103, 112, 53]) || check([0, 0, 0, 28, 102, 116, 121, 112, 109, 112, 52, 50]) && check([109, 112, 52, 49, 109, 112, 52, 50, 105, 115, 111, 109], { offset: 16 }) || check([0, 0, 0, 28, 102, 116, 121, 112, 105, 115, 111, 109]) || check([0, 0, 0, 28, 102, 116, 121, 112, 109, 112, 52, 50, 0, 0, 0, 0])) {
      return {
        ext: "mp4",
        mime: "video/mp4"
      };
    }
    if (check([0, 0, 0, 28, 102, 116, 121, 112, 77, 52, 86])) {
      return {
        ext: "m4v",
        mime: "video/x-m4v"
      };
    }
    if (check([77, 84, 104, 100])) {
      return {
        ext: "mid",
        mime: "audio/midi"
      };
    }
    if (check([26, 69, 223, 163])) {
      const sliced = buf.subarray(4, 4 + 4096);
      const idPos = sliced.findIndex((el, i, arr) => arr[i] === 66 && arr[i + 1] === 130);
      if (idPos >= 0) {
        const docTypePos = idPos + 3;
        const findDocType = (type) => Array.from(type).every((c, i) => sliced[docTypePos + i] === c.charCodeAt(0));
        if (findDocType("matroska")) {
          return {
            ext: "mkv",
            mime: "video/x-matroska"
          };
        }
        if (findDocType("webm")) {
          return {
            ext: "webm",
            mime: "video/webm"
          };
        }
      }
    }
    if (check([0, 0, 0, 20, 102, 116, 121, 112, 113, 116, 32, 32]) || check([102, 114, 101, 101], { offset: 4 }) || check([102, 116, 121, 112, 113, 116, 32, 32], { offset: 4 }) || check([109, 100, 97, 116], { offset: 4 }) || check([119, 105, 100, 101], { offset: 4 })) {
      return {
        ext: "mov",
        mime: "video/quicktime"
      };
    }
    if (check([82, 73, 70, 70]) && check([65, 86, 73], { offset: 8 })) {
      return {
        ext: "avi",
        mime: "video/x-msvideo"
      };
    }
    if (check([48, 38, 178, 117, 142, 102, 207, 17, 166, 217])) {
      return {
        ext: "wmv",
        mime: "video/x-ms-wmv"
      };
    }
    if (check([0, 0, 1, 186])) {
      return {
        ext: "mpg",
        mime: "video/mpeg"
      };
    }
    if (check([73, 68, 51]) || check([255, 251])) {
      return {
        ext: "mp3",
        mime: "audio/mpeg"
      };
    }
    if (check([102, 116, 121, 112, 77, 52, 65], { offset: 4 }) || check([77, 52, 65, 32])) {
      return {
        ext: "m4a",
        mime: "audio/m4a"
      };
    }
    if (check([79, 112, 117, 115, 72, 101, 97, 100], { offset: 28 })) {
      return {
        ext: "opus",
        mime: "audio/opus"
      };
    }
    if (check([79, 103, 103, 83])) {
      return {
        ext: "ogg",
        mime: "audio/ogg"
      };
    }
    if (check([102, 76, 97, 67])) {
      return {
        ext: "flac",
        mime: "audio/x-flac"
      };
    }
    if (check([82, 73, 70, 70]) && check([87, 65, 86, 69], { offset: 8 })) {
      return {
        ext: "wav",
        mime: "audio/x-wav"
      };
    }
    if (check([35, 33, 65, 77, 82, 10])) {
      return {
        ext: "amr",
        mime: "audio/amr"
      };
    }
    if (check([37, 80, 68, 70])) {
      return {
        ext: "pdf",
        mime: "application/pdf"
      };
    }
    if (check([77, 90])) {
      return {
        ext: "exe",
        mime: "application/x-msdownload"
      };
    }
    if ((buf[0] === 67 || buf[0] === 70) && check([87, 83], { offset: 1 })) {
      return {
        ext: "swf",
        mime: "application/x-shockwave-flash"
      };
    }
    if (check([123, 92, 114, 116, 102])) {
      return {
        ext: "rtf",
        mime: "application/rtf"
      };
    }
    if (check([0, 97, 115, 109])) {
      return {
        ext: "wasm",
        mime: "application/wasm"
      };
    }
    if (check([119, 79, 70, 70]) && (check([0, 1, 0, 0], { offset: 4 }) || check([79, 84, 84, 79], { offset: 4 }))) {
      return {
        ext: "woff",
        mime: "application/font-woff"
      };
    }
    if (check([119, 79, 70, 50]) && (check([0, 1, 0, 0], { offset: 4 }) || check([79, 84, 84, 79], { offset: 4 }))) {
      return {
        ext: "woff2",
        mime: "application/font-woff"
      };
    }
    if (check([76, 80], { offset: 34 }) && (check([0, 0, 1], { offset: 8 }) || check([1, 0, 2], { offset: 8 }) || check([2, 0, 2], { offset: 8 }))) {
      return {
        ext: "eot",
        mime: "application/octet-stream"
      };
    }
    if (check([0, 1, 0, 0, 0])) {
      return {
        ext: "ttf",
        mime: "application/font-sfnt"
      };
    }
    if (check([79, 84, 84, 79, 0])) {
      return {
        ext: "otf",
        mime: "application/font-sfnt"
      };
    }
    if (check([0, 0, 1, 0])) {
      return {
        ext: "ico",
        mime: "image/x-icon"
      };
    }
    if (check([70, 76, 86, 1])) {
      return {
        ext: "flv",
        mime: "video/x-flv"
      };
    }
    if (check([37, 33])) {
      return {
        ext: "ps",
        mime: "application/postscript"
      };
    }
    if (check([253, 55, 122, 88, 90, 0])) {
      return {
        ext: "xz",
        mime: "application/x-xz"
      };
    }
    if (check([83, 81, 76, 105])) {
      return {
        ext: "sqlite",
        mime: "application/x-sqlite3"
      };
    }
    if (check([78, 69, 83, 26])) {
      return {
        ext: "nes",
        mime: "application/x-nintendo-nes-rom"
      };
    }
    if (check([67, 114, 50, 52])) {
      return {
        ext: "crx",
        mime: "application/x-google-chrome-extension"
      };
    }
    if (check([77, 83, 67, 70]) || check([73, 83, 99, 40])) {
      return {
        ext: "cab",
        mime: "application/vnd.ms-cab-compressed"
      };
    }
    if (check([33, 60, 97, 114, 99, 104, 62, 10, 100, 101, 98, 105, 97, 110, 45, 98, 105, 110, 97, 114, 121])) {
      return {
        ext: "deb",
        mime: "application/x-deb"
      };
    }
    if (check([33, 60, 97, 114, 99, 104, 62])) {
      return {
        ext: "ar",
        mime: "application/x-unix-archive"
      };
    }
    if (check([237, 171, 238, 219])) {
      return {
        ext: "rpm",
        mime: "application/x-rpm"
      };
    }
    if (check([31, 160]) || check([31, 157])) {
      return {
        ext: "Z",
        mime: "application/x-compress"
      };
    }
    if (check([76, 90, 73, 80])) {
      return {
        ext: "lz",
        mime: "application/x-lzip"
      };
    }
    if (check([208, 207, 17, 224, 161, 177, 26, 225])) {
      return {
        ext: "msi",
        mime: "application/x-msi"
      };
    }
    if (check([6, 14, 43, 52, 2, 5, 1, 1, 13, 1, 2, 1, 1, 2])) {
      return {
        ext: "mxf",
        mime: "application/mxf"
      };
    }
    if (check([66, 76, 69, 78, 68, 69, 82])) {
      return {
        ext: "blend",
        mime: "application/x-blender"
      };
    }
    return null;
  };
});

// node_modules/archive-type/index.js
var require_archive_type = __commonJS((exports, module) => {
  var fileType = require_file_type();
  var exts = new Set([
    "7z",
    "bz2",
    "gz",
    "rar",
    "tar",
    "zip",
    "xz",
    "gz"
  ]);
  module.exports = (input) => {
    const ret = fileType(input);
    return exts.has(ret && ret.ext) ? ret : null;
  };
});

// node_modules/graceful-fs/polyfills.js
var require_polyfills = __commonJS((exports, module) => {
  var patch = function(fs) {
    if (constants3.hasOwnProperty("O_SYMLINK") && process.version.match(/^v0\.6\.[0-2]|^v0\.5\./)) {
      patchLchmod(fs);
    }
    if (!fs.lutimes) {
      patchLutimes(fs);
    }
    fs.chown = chownFix(fs.chown);
    fs.fchown = chownFix(fs.fchown);
    fs.lchown = chownFix(fs.lchown);
    fs.chmod = chmodFix(fs.chmod);
    fs.fchmod = chmodFix(fs.fchmod);
    fs.lchmod = chmodFix(fs.lchmod);
    fs.chownSync = chownFixSync(fs.chownSync);
    fs.fchownSync = chownFixSync(fs.fchownSync);
    fs.lchownSync = chownFixSync(fs.lchownSync);
    fs.chmodSync = chmodFixSync(fs.chmodSync);
    fs.fchmodSync = chmodFixSync(fs.fchmodSync);
    fs.lchmodSync = chmodFixSync(fs.lchmodSync);
    fs.stat = statFix(fs.stat);
    fs.fstat = statFix(fs.fstat);
    fs.lstat = statFix(fs.lstat);
    fs.statSync = statFixSync(fs.statSync);
    fs.fstatSync = statFixSync(fs.fstatSync);
    fs.lstatSync = statFixSync(fs.lstatSync);
    if (fs.chmod && !fs.lchmod) {
      fs.lchmod = function(path3, mode, cb) {
        if (cb)
          process.nextTick(cb);
      };
      fs.lchmodSync = function() {
      };
    }
    if (fs.chown && !fs.lchown) {
      fs.lchown = function(path3, uid, gid, cb) {
        if (cb)
          process.nextTick(cb);
      };
      fs.lchownSync = function() {
      };
    }
    if (platform === "win32") {
      fs.rename = typeof fs.rename !== "function" ? fs.rename : function(fs$rename) {
        function rename(from, to, cb) {
          var start = Date.now();
          var backoff = 0;
          fs$rename(from, to, function CB(er) {
            if (er && (er.code === "EACCES" || er.code === "EPERM" || er.code === "EBUSY") && Date.now() - start < 60000) {
              setTimeout(function() {
                fs.stat(to, function(stater, st) {
                  if (stater && stater.code === "ENOENT")
                    fs$rename(from, to, CB);
                  else
                    cb(er);
                });
              }, backoff);
              if (backoff < 100)
                backoff += 10;
              return;
            }
            if (cb)
              cb(er);
          });
        }
        if (Object.setPrototypeOf)
          Object.setPrototypeOf(rename, fs$rename);
        return rename;
      }(fs.rename);
    }
    fs.read = typeof fs.read !== "function" ? fs.read : function(fs$read) {
      function read(fd, buffer, offset, length, position, callback_) {
        var callback;
        if (callback_ && typeof callback_ === "function") {
          var eagCounter = 0;
          callback = function(er, _, __) {
            if (er && er.code === "EAGAIN" && eagCounter < 10) {
              eagCounter++;
              return fs$read.call(fs, fd, buffer, offset, length, position, callback);
            }
            callback_.apply(this, arguments);
          };
        }
        return fs$read.call(fs, fd, buffer, offset, length, position, callback);
      }
      if (Object.setPrototypeOf)
        Object.setPrototypeOf(read, fs$read);
      return read;
    }(fs.read);
    fs.readSync = typeof fs.readSync !== "function" ? fs.readSync : function(fs$readSync) {
      return function(fd, buffer, offset, length, position) {
        var eagCounter = 0;
        while (true) {
          try {
            return fs$readSync.call(fs, fd, buffer, offset, length, position);
          } catch (er) {
            if (er.code === "EAGAIN" && eagCounter < 10) {
              eagCounter++;
              continue;
            }
            throw er;
          }
        }
      };
    }(fs.readSync);
    function patchLchmod(fs2) {
      fs2.lchmod = function(path3, mode, callback) {
        fs2.open(path3, constants3.O_WRONLY | constants3.O_SYMLINK, mode, function(err, fd) {
          if (err) {
            if (callback)
              callback(err);
            return;
          }
          fs2.fchmod(fd, mode, function(err2) {
            fs2.close(fd, function(err22) {
              if (callback)
                callback(err2 || err22);
            });
          });
        });
      };
      fs2.lchmodSync = function(path3, mode) {
        var fd = fs2.openSync(path3, constants3.O_WRONLY | constants3.O_SYMLINK, mode);
        var threw = true;
        var ret;
        try {
          ret = fs2.fchmodSync(fd, mode);
          threw = false;
        } finally {
          if (threw) {
            try {
              fs2.closeSync(fd);
            } catch (er) {
            }
          } else {
            fs2.closeSync(fd);
          }
        }
        return ret;
      };
    }
    function patchLutimes(fs2) {
      if (constants3.hasOwnProperty("O_SYMLINK") && fs2.futimes) {
        fs2.lutimes = function(path3, at, mt, cb) {
          fs2.open(path3, constants3.O_SYMLINK, function(er, fd) {
            if (er) {
              if (cb)
                cb(er);
              return;
            }
            fs2.futimes(fd, at, mt, function(er2) {
              fs2.close(fd, function(er22) {
                if (cb)
                  cb(er2 || er22);
              });
            });
          });
        };
        fs2.lutimesSync = function(path3, at, mt) {
          var fd = fs2.openSync(path3, constants3.O_SYMLINK);
          var ret;
          var threw = true;
          try {
            ret = fs2.futimesSync(fd, at, mt);
            threw = false;
          } finally {
            if (threw) {
              try {
                fs2.closeSync(fd);
              } catch (er) {
              }
            } else {
              fs2.closeSync(fd);
            }
          }
          return ret;
        };
      } else if (fs2.futimes) {
        fs2.lutimes = function(_a2, _b2, _c2, cb) {
          if (cb)
            process.nextTick(cb);
        };
        fs2.lutimesSync = function() {
        };
      }
    }
    function chmodFix(orig) {
      if (!orig)
        return orig;
      return function(target, mode, cb) {
        return orig.call(fs, target, mode, function(er) {
          if (chownErOk(er))
            er = null;
          if (cb)
            cb.apply(this, arguments);
        });
      };
    }
    function chmodFixSync(orig) {
      if (!orig)
        return orig;
      return function(target, mode) {
        try {
          return orig.call(fs, target, mode);
        } catch (er) {
          if (!chownErOk(er))
            throw er;
        }
      };
    }
    function chownFix(orig) {
      if (!orig)
        return orig;
      return function(target, uid, gid, cb) {
        return orig.call(fs, target, uid, gid, function(er) {
          if (chownErOk(er))
            er = null;
          if (cb)
            cb.apply(this, arguments);
        });
      };
    }
    function chownFixSync(orig) {
      if (!orig)
        return orig;
      return function(target, uid, gid) {
        try {
          return orig.call(fs, target, uid, gid);
        } catch (er) {
          if (!chownErOk(er))
            throw er;
        }
      };
    }
    function statFix(orig) {
      if (!orig)
        return orig;
      return function(target, options, cb) {
        if (typeof options === "function") {
          cb = options;
          options = null;
        }
        function callback(er, stats) {
          if (stats) {
            if (stats.uid < 0)
              stats.uid += 4294967296;
            if (stats.gid < 0)
              stats.gid += 4294967296;
          }
          if (cb)
            cb.apply(this, arguments);
        }
        return options ? orig.call(fs, target, options, callback) : orig.call(fs, target, callback);
      };
    }
    function statFixSync(orig) {
      if (!orig)
        return orig;
      return function(target, options) {
        var stats = options ? orig.call(fs, target, options) : orig.call(fs, target);
        if (stats) {
          if (stats.uid < 0)
            stats.uid += 4294967296;
          if (stats.gid < 0)
            stats.gid += 4294967296;
        }
        return stats;
      };
    }
    function chownErOk(er) {
      if (!er)
        return true;
      if (er.code === "ENOSYS")
        return true;
      var nonroot = !process.getuid || process.getuid() !== 0;
      if (nonroot) {
        if (er.code === "EINVAL" || er.code === "EPERM")
          return true;
      }
      return false;
    }
  };
  var constants3 = import.meta.require("constants");
  var origCwd = process.cwd;
  var cwd = null;
  var platform = process.env.GRACEFUL_FS_PLATFORM || process.platform;
  process.cwd = function() {
    if (!cwd)
      cwd = origCwd.call(process);
    return cwd;
  };
  try {
    process.cwd();
  } catch (er) {
  }
  if (typeof process.chdir === "function") {
    chdir2 = process.chdir;
    process.chdir = function(d) {
      cwd = null;
      chdir2.call(process, d);
    };
    if (Object.setPrototypeOf)
      Object.setPrototypeOf(process.chdir, chdir2);
  }
  var chdir2;
  module.exports = patch;
});

// node_modules/graceful-fs/legacy-streams.js
var require_legacy_streams = __commonJS((exports, module) => {
  var legacy = function(fs) {
    return {
      ReadStream,
      WriteStream
    };
    function ReadStream(path3, options) {
      if (!(this instanceof ReadStream))
        return new ReadStream(path3, options);
      Stream.call(this);
      var self2 = this;
      this.path = path3;
      this.fd = null;
      this.readable = true;
      this.paused = false;
      this.flags = "r";
      this.mode = 438;
      this.bufferSize = 64 * 1024;
      options = options || {};
      var keys = Object.keys(options);
      for (var index = 0, length = keys.length;index < length; index++) {
        var key = keys[index];
        this[key] = options[key];
      }
      if (this.encoding)
        this.setEncoding(this.encoding);
      if (this.start !== undefined) {
        if (typeof this.start !== "number") {
          throw TypeError("start must be a Number");
        }
        if (this.end === undefined) {
          this.end = Infinity;
        } else if (typeof this.end !== "number") {
          throw TypeError("end must be a Number");
        }
        if (this.start > this.end) {
          throw new Error("start must be <= end");
        }
        this.pos = this.start;
      }
      if (this.fd !== null) {
        process.nextTick(function() {
          self2._read();
        });
        return;
      }
      fs.open(this.path, this.flags, this.mode, function(err, fd) {
        if (err) {
          self2.emit("error", err);
          self2.readable = false;
          return;
        }
        self2.fd = fd;
        self2.emit("open", fd);
        self2._read();
      });
    }
    function WriteStream(path3, options) {
      if (!(this instanceof WriteStream))
        return new WriteStream(path3, options);
      Stream.call(this);
      this.path = path3;
      this.fd = null;
      this.writable = true;
      this.flags = "w";
      this.encoding = "binary";
      this.mode = 438;
      this.bytesWritten = 0;
      options = options || {};
      var keys = Object.keys(options);
      for (var index = 0, length = keys.length;index < length; index++) {
        var key = keys[index];
        this[key] = options[key];
      }
      if (this.start !== undefined) {
        if (typeof this.start !== "number") {
          throw TypeError("start must be a Number");
        }
        if (this.start < 0) {
          throw new Error("start must be >= zero");
        }
        this.pos = this.start;
      }
      this.busy = false;
      this._queue = [];
      if (this.fd === null) {
        this._open = fs.open;
        this._queue.push([this._open, this.path, this.flags, this.mode, undefined]);
        this.flush();
      }
    }
  };
  var Stream = import.meta.require("stream").Stream;
  module.exports = legacy;
});

// node_modules/graceful-fs/clone.js
var require_clone = __commonJS((exports, module) => {
  var clone = function(obj) {
    if (obj === null || typeof obj !== "object")
      return obj;
    if (obj instanceof Object)
      var copy = { __proto__: getPrototypeOf(obj) };
    else
      var copy = Object.create(null);
    Object.getOwnPropertyNames(obj).forEach(function(key) {
      Object.defineProperty(copy, key, Object.getOwnPropertyDescriptor(obj, key));
    });
    return copy;
  };
  module.exports = clone;
  var getPrototypeOf = Object.getPrototypeOf || function(obj) {
    return obj.__proto__;
  };
});

// node_modules/graceful-fs/graceful-fs.js
var require_graceful_fs = __commonJS((exports, module) => {
  var noop2 = function() {
  };
  var publishQueue = function(context, queue2) {
    Object.defineProperty(context, gracefulQueue, {
      get: function() {
        return queue2;
      }
    });
  };
  var patch = function(fs2) {
    polyfills(fs2);
    fs2.gracefulify = patch;
    fs2.createReadStream = createReadStream2;
    fs2.createWriteStream = createWriteStream2;
    var fs$readFile = fs2.readFile;
    fs2.readFile = readFile;
    function readFile(path3, options, cb) {
      if (typeof options === "function")
        cb = options, options = null;
      return go$readFile(path3, options, cb);
      function go$readFile(path4, options2, cb2, startTime) {
        return fs$readFile(path4, options2, function(err) {
          if (err && (err.code === "EMFILE" || err.code === "ENFILE"))
            enqueue([go$readFile, [path4, options2, cb2], err, startTime || Date.now(), Date.now()]);
          else {
            if (typeof cb2 === "function")
              cb2.apply(this, arguments);
          }
        });
      }
    }
    var fs$writeFile = fs2.writeFile;
    fs2.writeFile = writeFile;
    function writeFile(path3, data, options, cb) {
      if (typeof options === "function")
        cb = options, options = null;
      return go$writeFile(path3, data, options, cb);
      function go$writeFile(path4, data2, options2, cb2, startTime) {
        return fs$writeFile(path4, data2, options2, function(err) {
          if (err && (err.code === "EMFILE" || err.code === "ENFILE"))
            enqueue([go$writeFile, [path4, data2, options2, cb2], err, startTime || Date.now(), Date.now()]);
          else {
            if (typeof cb2 === "function")
              cb2.apply(this, arguments);
          }
        });
      }
    }
    var fs$appendFile = fs2.appendFile;
    if (fs$appendFile)
      fs2.appendFile = appendFile;
    function appendFile(path3, data, options, cb) {
      if (typeof options === "function")
        cb = options, options = null;
      return go$appendFile(path3, data, options, cb);
      function go$appendFile(path4, data2, options2, cb2, startTime) {
        return fs$appendFile(path4, data2, options2, function(err) {
          if (err && (err.code === "EMFILE" || err.code === "ENFILE"))
            enqueue([go$appendFile, [path4, data2, options2, cb2], err, startTime || Date.now(), Date.now()]);
          else {
            if (typeof cb2 === "function")
              cb2.apply(this, arguments);
          }
        });
      }
    }
    var fs$copyFile = fs2.copyFile;
    if (fs$copyFile)
      fs2.copyFile = copyFile;
    function copyFile(src, dest, flags, cb) {
      if (typeof flags === "function") {
        cb = flags;
        flags = 0;
      }
      return go$copyFile(src, dest, flags, cb);
      function go$copyFile(src2, dest2, flags2, cb2, startTime) {
        return fs$copyFile(src2, dest2, flags2, function(err) {
          if (err && (err.code === "EMFILE" || err.code === "ENFILE"))
            enqueue([go$copyFile, [src2, dest2, flags2, cb2], err, startTime || Date.now(), Date.now()]);
          else {
            if (typeof cb2 === "function")
              cb2.apply(this, arguments);
          }
        });
      }
    }
    var fs$readdir = fs2.readdir;
    fs2.readdir = readdir;
    var noReaddirOptionVersions = /^v[0-5]\./;
    function readdir(path3, options, cb) {
      if (typeof options === "function")
        cb = options, options = null;
      var go$readdir = noReaddirOptionVersions.test(process.version) ? function go$readdir(path4, options2, cb2, startTime) {
        return fs$readdir(path4, fs$readdirCallback(path4, options2, cb2, startTime));
      } : function go$readdir(path4, options2, cb2, startTime) {
        return fs$readdir(path4, options2, fs$readdirCallback(path4, options2, cb2, startTime));
      };
      return go$readdir(path3, options, cb);
      function fs$readdirCallback(path4, options2, cb2, startTime) {
        return function(err, files) {
          if (err && (err.code === "EMFILE" || err.code === "ENFILE"))
            enqueue([
              go$readdir,
              [path4, options2, cb2],
              err,
              startTime || Date.now(),
              Date.now()
            ]);
          else {
            if (files && files.sort)
              files.sort();
            if (typeof cb2 === "function")
              cb2.call(this, err, files);
          }
        };
      }
    }
    if (process.version.substr(0, 4) === "v0.8") {
      var legStreams = legacy(fs2);
      ReadStream = legStreams.ReadStream;
      WriteStream = legStreams.WriteStream;
    }
    var fs$ReadStream = fs2.ReadStream;
    if (fs$ReadStream) {
      ReadStream.prototype = Object.create(fs$ReadStream.prototype);
      ReadStream.prototype.open = ReadStream$open;
    }
    var fs$WriteStream = fs2.WriteStream;
    if (fs$WriteStream) {
      WriteStream.prototype = Object.create(fs$WriteStream.prototype);
      WriteStream.prototype.open = WriteStream$open;
    }
    Object.defineProperty(fs2, "ReadStream", {
      get: function() {
        return ReadStream;
      },
      set: function(val) {
        ReadStream = val;
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(fs2, "WriteStream", {
      get: function() {
        return WriteStream;
      },
      set: function(val) {
        WriteStream = val;
      },
      enumerable: true,
      configurable: true
    });
    var FileReadStream = ReadStream;
    Object.defineProperty(fs2, "FileReadStream", {
      get: function() {
        return FileReadStream;
      },
      set: function(val) {
        FileReadStream = val;
      },
      enumerable: true,
      configurable: true
    });
    var FileWriteStream = WriteStream;
    Object.defineProperty(fs2, "FileWriteStream", {
      get: function() {
        return FileWriteStream;
      },
      set: function(val) {
        FileWriteStream = val;
      },
      enumerable: true,
      configurable: true
    });
    function ReadStream(path3, options) {
      if (this instanceof ReadStream)
        return fs$ReadStream.apply(this, arguments), this;
      else
        return ReadStream.apply(Object.create(ReadStream.prototype), arguments);
    }
    function ReadStream$open() {
      var that = this;
      open(that.path, that.flags, that.mode, function(err, fd) {
        if (err) {
          if (that.autoClose)
            that.destroy();
          that.emit("error", err);
        } else {
          that.fd = fd;
          that.emit("open", fd);
          that.read();
        }
      });
    }
    function WriteStream(path3, options) {
      if (this instanceof WriteStream)
        return fs$WriteStream.apply(this, arguments), this;
      else
        return WriteStream.apply(Object.create(WriteStream.prototype), arguments);
    }
    function WriteStream$open() {
      var that = this;
      open(that.path, that.flags, that.mode, function(err, fd) {
        if (err) {
          that.destroy();
          that.emit("error", err);
        } else {
          that.fd = fd;
          that.emit("open", fd);
        }
      });
    }
    function createReadStream2(path3, options) {
      return new fs2.ReadStream(path3, options);
    }
    function createWriteStream2(path3, options) {
      return new fs2.WriteStream(path3, options);
    }
    var fs$open = fs2.open;
    fs2.open = open;
    function open(path3, flags, mode, cb) {
      if (typeof mode === "function")
        cb = mode, mode = null;
      return go$open(path3, flags, mode, cb);
      function go$open(path4, flags2, mode2, cb2, startTime) {
        return fs$open(path4, flags2, mode2, function(err, fd) {
          if (err && (err.code === "EMFILE" || err.code === "ENFILE"))
            enqueue([go$open, [path4, flags2, mode2, cb2], err, startTime || Date.now(), Date.now()]);
          else {
            if (typeof cb2 === "function")
              cb2.apply(this, arguments);
          }
        });
      }
    }
    return fs2;
  };
  var enqueue = function(elem) {
    debug("ENQUEUE", elem[0].name, elem[1]);
    fs[gracefulQueue].push(elem);
    retry();
  };
  var resetQueue = function() {
    var now = Date.now();
    for (var i = 0;i < fs[gracefulQueue].length; ++i) {
      if (fs[gracefulQueue][i].length > 2) {
        fs[gracefulQueue][i][3] = now;
        fs[gracefulQueue][i][4] = now;
      }
    }
    retry();
  };
  var retry = function() {
    clearTimeout(retryTimer);
    retryTimer = undefined;
    if (fs[gracefulQueue].length === 0)
      return;
    var elem = fs[gracefulQueue].shift();
    var fn = elem[0];
    var args = elem[1];
    var err = elem[2];
    var startTime = elem[3];
    var lastTime = elem[4];
    if (startTime === undefined) {
      debug("RETRY", fn.name, args);
      fn.apply(null, args);
    } else if (Date.now() - startTime >= 60000) {
      debug("TIMEOUT", fn.name, args);
      var cb = args.pop();
      if (typeof cb === "function")
        cb.call(null, err);
    } else {
      var sinceAttempt = Date.now() - lastTime;
      var sinceStart = Math.max(lastTime - startTime, 1);
      var desiredDelay = Math.min(sinceStart * 1.2, 100);
      if (sinceAttempt >= desiredDelay) {
        debug("RETRY", fn.name, args);
        fn.apply(null, args.concat([startTime]));
      } else {
        fs[gracefulQueue].push(elem);
      }
    }
    if (retryTimer === undefined) {
      retryTimer = setTimeout(retry, 0);
    }
  };
  var fs = import.meta.require("fs");
  var polyfills = require_polyfills();
  var legacy = require_legacy_streams();
  var clone = require_clone();
  var util = import.meta.require("util");
  var gracefulQueue;
  var previousSymbol;
  if (typeof Symbol === "function" && typeof Symbol.for === "function") {
    gracefulQueue = Symbol.for("graceful-fs.queue");
    previousSymbol = Symbol.for("graceful-fs.previous");
  } else {
    gracefulQueue = "___graceful-fs.queue";
    previousSymbol = "___graceful-fs.previous";
  }
  var debug = noop2;
  if (util.debuglog)
    debug = util.debuglog("gfs4");
  else if (/\bgfs4\b/i.test(process.env.NODE_DEBUG || ""))
    debug = function() {
      var m = util.format.apply(util, arguments);
      m = "GFS4: " + m.split(/\n/).join("\nGFS4: ");
      console.error(m);
    };
  if (!fs[gracefulQueue]) {
    queue = global[gracefulQueue] || [];
    publishQueue(fs, queue);
    fs.close = function(fs$close) {
      function close(fd, cb) {
        return fs$close.call(fs, fd, function(err) {
          if (!err) {
            resetQueue();
          }
          if (typeof cb === "function")
            cb.apply(this, arguments);
        });
      }
      Object.defineProperty(close, previousSymbol, {
        value: fs$close
      });
      return close;
    }(fs.close);
    fs.closeSync = function(fs$closeSync) {
      function closeSync(fd) {
        fs$closeSync.apply(fs, arguments);
        resetQueue();
      }
      Object.defineProperty(closeSync, previousSymbol, {
        value: fs$closeSync
      });
      return closeSync;
    }(fs.closeSync);
    if (/\bgfs4\b/i.test(process.env.NODE_DEBUG || "")) {
      process.on("exit", function() {
        debug(fs[gracefulQueue]);
        import.meta.require("assert").equal(fs[gracefulQueue].length, 0);
      });
    }
  }
  var queue;
  if (!global[gracefulQueue]) {
    publishQueue(global, fs[gracefulQueue]);
  }
  module.exports = patch(clone(fs));
  if (process.env.TEST_GRACEFUL_FS_GLOBAL_PATCH && !fs.__patched) {
    module.exports = patch(fs);
    fs.__patched = true;
  }
  var retryTimer;
});

// node_modules/decompress-tar/node_modules/file-type/index.js
var require_file_type2 = __commonJS((exports, module) => {
  module.exports = (input) => {
    const buf = new Uint8Array(input);
    if (!(buf && buf.length > 1)) {
      return null;
    }
    const check = (header, opts) => {
      opts = Object.assign({
        offset: 0
      }, opts);
      for (let i = 0;i < header.length; i++) {
        if (header[i] !== buf[i + opts.offset]) {
          return false;
        }
      }
      return true;
    };
    if (check([255, 216, 255])) {
      return {
        ext: "jpg",
        mime: "image/jpeg"
      };
    }
    if (check([137, 80, 78, 71, 13, 10, 26, 10])) {
      return {
        ext: "png",
        mime: "image/png"
      };
    }
    if (check([71, 73, 70])) {
      return {
        ext: "gif",
        mime: "image/gif"
      };
    }
    if (check([87, 69, 66, 80], { offset: 8 })) {
      return {
        ext: "webp",
        mime: "image/webp"
      };
    }
    if (check([70, 76, 73, 70])) {
      return {
        ext: "flif",
        mime: "image/flif"
      };
    }
    if ((check([73, 73, 42, 0]) || check([77, 77, 0, 42])) && check([67, 82], { offset: 8 })) {
      return {
        ext: "cr2",
        mime: "image/x-canon-cr2"
      };
    }
    if (check([73, 73, 42, 0]) || check([77, 77, 0, 42])) {
      return {
        ext: "tif",
        mime: "image/tiff"
      };
    }
    if (check([66, 77])) {
      return {
        ext: "bmp",
        mime: "image/bmp"
      };
    }
    if (check([73, 73, 188])) {
      return {
        ext: "jxr",
        mime: "image/vnd.ms-photo"
      };
    }
    if (check([56, 66, 80, 83])) {
      return {
        ext: "psd",
        mime: "image/vnd.adobe.photoshop"
      };
    }
    if (check([80, 75, 3, 4]) && check([109, 105, 109, 101, 116, 121, 112, 101, 97, 112, 112, 108, 105, 99, 97, 116, 105, 111, 110, 47, 101, 112, 117, 98, 43, 122, 105, 112], { offset: 30 })) {
      return {
        ext: "epub",
        mime: "application/epub+zip"
      };
    }
    if (check([80, 75, 3, 4]) && check([77, 69, 84, 65, 45, 73, 78, 70, 47, 109, 111, 122, 105, 108, 108, 97, 46, 114, 115, 97], { offset: 30 })) {
      return {
        ext: "xpi",
        mime: "application/x-xpinstall"
      };
    }
    if (check([80, 75]) && (buf[2] === 3 || buf[2] === 5 || buf[2] === 7) && (buf[3] === 4 || buf[3] === 6 || buf[3] === 8)) {
      return {
        ext: "zip",
        mime: "application/zip"
      };
    }
    if (check([117, 115, 116, 97, 114], { offset: 257 })) {
      return {
        ext: "tar",
        mime: "application/x-tar"
      };
    }
    if (check([82, 97, 114, 33, 26, 7]) && (buf[6] === 0 || buf[6] === 1)) {
      return {
        ext: "rar",
        mime: "application/x-rar-compressed"
      };
    }
    if (check([31, 139, 8])) {
      return {
        ext: "gz",
        mime: "application/gzip"
      };
    }
    if (check([66, 90, 104])) {
      return {
        ext: "bz2",
        mime: "application/x-bzip2"
      };
    }
    if (check([55, 122, 188, 175, 39, 28])) {
      return {
        ext: "7z",
        mime: "application/x-7z-compressed"
      };
    }
    if (check([120, 1])) {
      return {
        ext: "dmg",
        mime: "application/x-apple-diskimage"
      };
    }
    if (check([0, 0, 0]) && (buf[3] === 24 || buf[3] === 32) && check([102, 116, 121, 112], { offset: 4 }) || check([51, 103, 112, 53]) || check([0, 0, 0, 28, 102, 116, 121, 112, 109, 112, 52, 50]) && check([109, 112, 52, 49, 109, 112, 52, 50, 105, 115, 111, 109], { offset: 16 }) || check([0, 0, 0, 28, 102, 116, 121, 112, 105, 115, 111, 109]) || check([0, 0, 0, 28, 102, 116, 121, 112, 109, 112, 52, 50, 0, 0, 0, 0])) {
      return {
        ext: "mp4",
        mime: "video/mp4"
      };
    }
    if (check([0, 0, 0, 28, 102, 116, 121, 112, 77, 52, 86])) {
      return {
        ext: "m4v",
        mime: "video/x-m4v"
      };
    }
    if (check([77, 84, 104, 100])) {
      return {
        ext: "mid",
        mime: "audio/midi"
      };
    }
    if (check([26, 69, 223, 163])) {
      const sliced = buf.subarray(4, 4 + 4096);
      const idPos = sliced.findIndex((el, i, arr) => arr[i] === 66 && arr[i + 1] === 130);
      if (idPos >= 0) {
        const docTypePos = idPos + 3;
        const findDocType = (type) => Array.from(type).every((c, i) => sliced[docTypePos + i] === c.charCodeAt(0));
        if (findDocType("matroska")) {
          return {
            ext: "mkv",
            mime: "video/x-matroska"
          };
        }
        if (findDocType("webm")) {
          return {
            ext: "webm",
            mime: "video/webm"
          };
        }
      }
    }
    if (check([0, 0, 0, 20, 102, 116, 121, 112, 113, 116, 32, 32]) || check([102, 114, 101, 101], { offset: 4 }) || check([102, 116, 121, 112, 113, 116, 32, 32], { offset: 4 }) || check([109, 100, 97, 116], { offset: 4 }) || check([119, 105, 100, 101], { offset: 4 })) {
      return {
        ext: "mov",
        mime: "video/quicktime"
      };
    }
    if (check([82, 73, 70, 70]) && check([65, 86, 73], { offset: 8 })) {
      return {
        ext: "avi",
        mime: "video/x-msvideo"
      };
    }
    if (check([48, 38, 178, 117, 142, 102, 207, 17, 166, 217])) {
      return {
        ext: "wmv",
        mime: "video/x-ms-wmv"
      };
    }
    if (check([0, 0, 1, 186])) {
      return {
        ext: "mpg",
        mime: "video/mpeg"
      };
    }
    if (check([73, 68, 51]) || check([255, 251])) {
      return {
        ext: "mp3",
        mime: "audio/mpeg"
      };
    }
    if (check([102, 116, 121, 112, 77, 52, 65], { offset: 4 }) || check([77, 52, 65, 32])) {
      return {
        ext: "m4a",
        mime: "audio/m4a"
      };
    }
    if (check([79, 112, 117, 115, 72, 101, 97, 100], { offset: 28 })) {
      return {
        ext: "opus",
        mime: "audio/opus"
      };
    }
    if (check([79, 103, 103, 83])) {
      return {
        ext: "ogg",
        mime: "audio/ogg"
      };
    }
    if (check([102, 76, 97, 67])) {
      return {
        ext: "flac",
        mime: "audio/x-flac"
      };
    }
    if (check([82, 73, 70, 70]) && check([87, 65, 86, 69], { offset: 8 })) {
      return {
        ext: "wav",
        mime: "audio/x-wav"
      };
    }
    if (check([35, 33, 65, 77, 82, 10])) {
      return {
        ext: "amr",
        mime: "audio/amr"
      };
    }
    if (check([37, 80, 68, 70])) {
      return {
        ext: "pdf",
        mime: "application/pdf"
      };
    }
    if (check([77, 90])) {
      return {
        ext: "exe",
        mime: "application/x-msdownload"
      };
    }
    if ((buf[0] === 67 || buf[0] === 70) && check([87, 83], { offset: 1 })) {
      return {
        ext: "swf",
        mime: "application/x-shockwave-flash"
      };
    }
    if (check([123, 92, 114, 116, 102])) {
      return {
        ext: "rtf",
        mime: "application/rtf"
      };
    }
    if (check([0, 97, 115, 109])) {
      return {
        ext: "wasm",
        mime: "application/wasm"
      };
    }
    if (check([119, 79, 70, 70]) && (check([0, 1, 0, 0], { offset: 4 }) || check([79, 84, 84, 79], { offset: 4 }))) {
      return {
        ext: "woff",
        mime: "font/woff"
      };
    }
    if (check([119, 79, 70, 50]) && (check([0, 1, 0, 0], { offset: 4 }) || check([79, 84, 84, 79], { offset: 4 }))) {
      return {
        ext: "woff2",
        mime: "font/woff2"
      };
    }
    if (check([76, 80], { offset: 34 }) && (check([0, 0, 1], { offset: 8 }) || check([1, 0, 2], { offset: 8 }) || check([2, 0, 2], { offset: 8 }))) {
      return {
        ext: "eot",
        mime: "application/octet-stream"
      };
    }
    if (check([0, 1, 0, 0, 0])) {
      return {
        ext: "ttf",
        mime: "font/ttf"
      };
    }
    if (check([79, 84, 84, 79, 0])) {
      return {
        ext: "otf",
        mime: "font/otf"
      };
    }
    if (check([0, 0, 1, 0])) {
      return {
        ext: "ico",
        mime: "image/x-icon"
      };
    }
    if (check([70, 76, 86, 1])) {
      return {
        ext: "flv",
        mime: "video/x-flv"
      };
    }
    if (check([37, 33])) {
      return {
        ext: "ps",
        mime: "application/postscript"
      };
    }
    if (check([253, 55, 122, 88, 90, 0])) {
      return {
        ext: "xz",
        mime: "application/x-xz"
      };
    }
    if (check([83, 81, 76, 105])) {
      return {
        ext: "sqlite",
        mime: "application/x-sqlite3"
      };
    }
    if (check([78, 69, 83, 26])) {
      return {
        ext: "nes",
        mime: "application/x-nintendo-nes-rom"
      };
    }
    if (check([67, 114, 50, 52])) {
      return {
        ext: "crx",
        mime: "application/x-google-chrome-extension"
      };
    }
    if (check([77, 83, 67, 70]) || check([73, 83, 99, 40])) {
      return {
        ext: "cab",
        mime: "application/vnd.ms-cab-compressed"
      };
    }
    if (check([33, 60, 97, 114, 99, 104, 62, 10, 100, 101, 98, 105, 97, 110, 45, 98, 105, 110, 97, 114, 121])) {
      return {
        ext: "deb",
        mime: "application/x-deb"
      };
    }
    if (check([33, 60, 97, 114, 99, 104, 62])) {
      return {
        ext: "ar",
        mime: "application/x-unix-archive"
      };
    }
    if (check([237, 171, 238, 219])) {
      return {
        ext: "rpm",
        mime: "application/x-rpm"
      };
    }
    if (check([31, 160]) || check([31, 157])) {
      return {
        ext: "Z",
        mime: "application/x-compress"
      };
    }
    if (check([76, 90, 73, 80])) {
      return {
        ext: "lz",
        mime: "application/x-lzip"
      };
    }
    if (check([208, 207, 17, 224, 161, 177, 26, 225])) {
      return {
        ext: "msi",
        mime: "application/x-msi"
      };
    }
    if (check([6, 14, 43, 52, 2, 5, 1, 1, 13, 1, 2, 1, 1, 2])) {
      return {
        ext: "mxf",
        mime: "application/mxf"
      };
    }
    if (check([71], { offset: 4 }) && (check([71], { offset: 192 }) || check([71], { offset: 196 }))) {
      return {
        ext: "mts",
        mime: "video/mp2t"
      };
    }
    if (check([66, 76, 69, 78, 68, 69, 82])) {
      return {
        ext: "blend",
        mime: "application/x-blender"
      };
    }
    if (check([66, 80, 71, 251])) {
      return {
        ext: "bpg",
        mime: "image/bpg"
      };
    }
    return null;
  };
});

// node_modules/decompress-tar/node_modules/is-stream/index.js
var require_is_stream = __commonJS((exports, module) => {
  var isStream2 = module.exports = function(stream2) {
    return stream2 !== null && typeof stream2 === "object" && typeof stream2.pipe === "function";
  };
  isStream2.writable = function(stream2) {
    return isStream2(stream2) && stream2.writable !== false && typeof stream2._write === "function" && typeof stream2._writableState === "object";
  };
  isStream2.readable = function(stream2) {
    return isStream2(stream2) && stream2.readable !== false && typeof stream2._read === "function" && typeof stream2._readableState === "object";
  };
  isStream2.duplex = function(stream2) {
    return isStream2.writable(stream2) && isStream2.readable(stream2);
  };
  isStream2.transform = function(stream2) {
    return isStream2.duplex(stream2) && typeof stream2._transform === "function" && typeof stream2._transformState === "object";
  };
});

// node_modules/process-nextick-args/index.js
var require_process_nextick_args = __commonJS((exports, module) => {
  var nextTick = function(fn, arg1, arg2, arg3) {
    if (typeof fn !== "function") {
      throw new TypeError('"callback" argument must be a function');
    }
    var len = arguments.length;
    var args, i;
    switch (len) {
      case 0:
      case 1:
        return process.nextTick(fn);
      case 2:
        return process.nextTick(function afterTickOne() {
          fn.call(null, arg1);
        });
      case 3:
        return process.nextTick(function afterTickTwo() {
          fn.call(null, arg1, arg2);
        });
      case 4:
        return process.nextTick(function afterTickThree() {
          fn.call(null, arg1, arg2, arg3);
        });
      default:
        args = new Array(len - 1);
        i = 0;
        while (i < args.length) {
          args[i++] = arguments[i];
        }
        return process.nextTick(function afterTick() {
          fn.apply(null, args);
        });
    }
  };
  if (typeof process === "undefined" || !process.version || process.version.indexOf("v0.") === 0 || process.version.indexOf("v1.") === 0 && process.version.indexOf("v1.8.") !== 0) {
    module.exports = { nextTick };
  } else {
    module.exports = process;
  }
});

// node_modules/core-util-is/lib/util.js
var require_util2 = __commonJS((exports) => {
  var isArray = function(arg) {
    if (Array.isArray) {
      return Array.isArray(arg);
    }
    return objectToString2(arg) === "[object Array]";
  };
  var isBoolean = function(arg) {
    return typeof arg === "boolean";
  };
  var isNull = function(arg) {
    return arg === null;
  };
  var isNullOrUndefined = function(arg) {
    return arg == null;
  };
  var isNumber = function(arg) {
    return typeof arg === "number";
  };
  var isString = function(arg) {
    return typeof arg === "string";
  };
  var isSymbol = function(arg) {
    return typeof arg === "symbol";
  };
  var isUndefined = function(arg) {
    return arg === undefined;
  };
  var isRegExp = function(re) {
    return objectToString2(re) === "[object RegExp]";
  };
  var isObject = function(arg) {
    return typeof arg === "object" && arg !== null;
  };
  var isDate = function(d) {
    return objectToString2(d) === "[object Date]";
  };
  var isError = function(e) {
    return objectToString2(e) === "[object Error]" || e instanceof Error;
  };
  var isFunction = function(arg) {
    return typeof arg === "function";
  };
  var isPrimitive = function(arg) {
    return arg === null || typeof arg === "boolean" || typeof arg === "number" || typeof arg === "string" || typeof arg === "symbol" || typeof arg === "undefined";
  };
  var objectToString2 = function(o) {
    return Object.prototype.toString.call(o);
  };
  exports.isArray = isArray;
  exports.isBoolean = isBoolean;
  exports.isNull = isNull;
  exports.isNullOrUndefined = isNullOrUndefined;
  exports.isNumber = isNumber;
  exports.isString = isString;
  exports.isSymbol = isSymbol;
  exports.isUndefined = isUndefined;
  exports.isRegExp = isRegExp;
  exports.isObject = isObject;
  exports.isDate = isDate;
  exports.isError = isError;
  exports.isFunction = isFunction;
  exports.isPrimitive = isPrimitive;
  exports.isBuffer = import.meta.require("buffer").Buffer.isBuffer;
});

// node_modules/inherits/inherits_browser.js
var require_inherits_browser = __commonJS((exports, module) => {
  if (typeof Object.create === "function") {
    module.exports = function inherits(ctor, superCtor) {
      if (superCtor) {
        ctor.super_ = superCtor;
        ctor.prototype = Object.create(superCtor.prototype, {
          constructor: {
            value: ctor,
            enumerable: false,
            writable: true,
            configurable: true
          }
        });
      }
    };
  } else {
    module.exports = function inherits(ctor, superCtor) {
      if (superCtor) {
        ctor.super_ = superCtor;
        var TempCtor = function() {
        };
        TempCtor.prototype = superCtor.prototype;
        ctor.prototype = new TempCtor;
        ctor.prototype.constructor = ctor;
      }
    };
  }
});

// node_modules/string_decoder/node_modules/safe-buffer/index.js
var require_safe_buffer2 = __commonJS((exports, module) => {
  var copyProps = function(src, dst) {
    for (var key in src) {
      dst[key] = src[key];
    }
  };
  var SafeBuffer = function(arg, encodingOrOffset, length) {
    return Buffer4(arg, encodingOrOffset, length);
  };
  var buffer = import.meta.require("buffer");
  var Buffer4 = buffer.Buffer;
  if (Buffer4.from && Buffer4.alloc && Buffer4.allocUnsafe && Buffer4.allocUnsafeSlow) {
    module.exports = buffer;
  } else {
    copyProps(buffer, exports);
    exports.Buffer = SafeBuffer;
  }
  copyProps(Buffer4, SafeBuffer);
  SafeBuffer.from = function(arg, encodingOrOffset, length) {
    if (typeof arg === "number") {
      throw new TypeError("Argument must not be a number");
    }
    return Buffer4(arg, encodingOrOffset, length);
  };
  SafeBuffer.alloc = function(size, fill, encoding) {
    if (typeof size !== "number") {
      throw new TypeError("Argument must be a number");
    }
    var buf = Buffer4(size);
    if (fill !== undefined) {
      if (typeof encoding === "string") {
        buf.fill(fill, encoding);
      } else {
        buf.fill(fill);
      }
    } else {
      buf.fill(0);
    }
    return buf;
  };
  SafeBuffer.allocUnsafe = function(size) {
    if (typeof size !== "number") {
      throw new TypeError("Argument must be a number");
    }
    return Buffer4(size);
  };
  SafeBuffer.allocUnsafeSlow = function(size) {
    if (typeof size !== "number") {
      throw new TypeError("Argument must be a number");
    }
    return buffer.SlowBuffer(size);
  };
});

// node_modules/string_decoder/lib/string_decoder.js
var require_string_decoder = __commonJS((exports) => {
  var _normalizeEncoding = function(enc) {
    if (!enc)
      return "utf8";
    var retried;
    while (true) {
      switch (enc) {
        case "utf8":
        case "utf-8":
          return "utf8";
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return "utf16le";
        case "latin1":
        case "binary":
          return "latin1";
        case "base64":
        case "ascii":
        case "hex":
          return enc;
        default:
          if (retried)
            return;
          enc = ("" + enc).toLowerCase();
          retried = true;
      }
    }
  };
  var normalizeEncoding = function(enc) {
    var nenc = _normalizeEncoding(enc);
    if (typeof nenc !== "string" && (Buffer4.isEncoding === isEncoding || !isEncoding(enc)))
      throw new Error("Unknown encoding: " + enc);
    return nenc || enc;
  };
  var StringDecoder = function(encoding) {
    this.encoding = normalizeEncoding(encoding);
    var nb;
    switch (this.encoding) {
      case "utf16le":
        this.text = utf16Text;
        this.end = utf16End;
        nb = 4;
        break;
      case "utf8":
        this.fillLast = utf8FillLast;
        nb = 4;
        break;
      case "base64":
        this.text = base64Text;
        this.end = base64End;
        nb = 3;
        break;
      default:
        this.write = simpleWrite;
        this.end = simpleEnd;
        return;
    }
    this.lastNeed = 0;
    this.lastTotal = 0;
    this.lastChar = Buffer4.allocUnsafe(nb);
  };
  var utf8CheckByte = function(byte) {
    if (byte <= 127)
      return 0;
    else if (byte >> 5 === 6)
      return 2;
    else if (byte >> 4 === 14)
      return 3;
    else if (byte >> 3 === 30)
      return 4;
    return byte >> 6 === 2 ? -1 : -2;
  };
  var utf8CheckIncomplete = function(self2, buf, i) {
    var j = buf.length - 1;
    if (j < i)
      return 0;
    var nb = utf8CheckByte(buf[j]);
    if (nb >= 0) {
      if (nb > 0)
        self2.lastNeed = nb - 1;
      return nb;
    }
    if (--j < i || nb === -2)
      return 0;
    nb = utf8CheckByte(buf[j]);
    if (nb >= 0) {
      if (nb > 0)
        self2.lastNeed = nb - 2;
      return nb;
    }
    if (--j < i || nb === -2)
      return 0;
    nb = utf8CheckByte(buf[j]);
    if (nb >= 0) {
      if (nb > 0) {
        if (nb === 2)
          nb = 0;
        else
          self2.lastNeed = nb - 3;
      }
      return nb;
    }
    return 0;
  };
  var utf8CheckExtraBytes = function(self2, buf, p) {
    if ((buf[0] & 192) !== 128) {
      self2.lastNeed = 0;
      return "\uFFFD";
    }
    if (self2.lastNeed > 1 && buf.length > 1) {
      if ((buf[1] & 192) !== 128) {
        self2.lastNeed = 1;
        return "\uFFFD";
      }
      if (self2.lastNeed > 2 && buf.length > 2) {
        if ((buf[2] & 192) !== 128) {
          self2.lastNeed = 2;
          return "\uFFFD";
        }
      }
    }
  };
  var utf8FillLast = function(buf) {
    var p = this.lastTotal - this.lastNeed;
    var r = utf8CheckExtraBytes(this, buf, p);
    if (r !== undefined)
      return r;
    if (this.lastNeed <= buf.length) {
      buf.copy(this.lastChar, p, 0, this.lastNeed);
      return this.lastChar.toString(this.encoding, 0, this.lastTotal);
    }
    buf.copy(this.lastChar, p, 0, buf.length);
    this.lastNeed -= buf.length;
  };
  var utf8Text = function(buf, i) {
    var total = utf8CheckIncomplete(this, buf, i);
    if (!this.lastNeed)
      return buf.toString("utf8", i);
    this.lastTotal = total;
    var end = buf.length - (total - this.lastNeed);
    buf.copy(this.lastChar, 0, end);
    return buf.toString("utf8", i, end);
  };
  var utf8End = function(buf) {
    var r = buf && buf.length ? this.write(buf) : "";
    if (this.lastNeed)
      return r + "\uFFFD";
    return r;
  };
  var utf16Text = function(buf, i) {
    if ((buf.length - i) % 2 === 0) {
      var r = buf.toString("utf16le", i);
      if (r) {
        var c = r.charCodeAt(r.length - 1);
        if (c >= 55296 && c <= 56319) {
          this.lastNeed = 2;
          this.lastTotal = 4;
          this.lastChar[0] = buf[buf.length - 2];
          this.lastChar[1] = buf[buf.length - 1];
          return r.slice(0, -1);
        }
      }
      return r;
    }
    this.lastNeed = 1;
    this.lastTotal = 2;
    this.lastChar[0] = buf[buf.length - 1];
    return buf.toString("utf16le", i, buf.length - 1);
  };
  var utf16End = function(buf) {
    var r = buf && buf.length ? this.write(buf) : "";
    if (this.lastNeed) {
      var end = this.lastTotal - this.lastNeed;
      return r + this.lastChar.toString("utf16le", 0, end);
    }
    return r;
  };
  var base64Text = function(buf, i) {
    var n = (buf.length - i) % 3;
    if (n === 0)
      return buf.toString("base64", i);
    this.lastNeed = 3 - n;
    this.lastTotal = 3;
    if (n === 1) {
      this.lastChar[0] = buf[buf.length - 1];
    } else {
      this.lastChar[0] = buf[buf.length - 2];
      this.lastChar[1] = buf[buf.length - 1];
    }
    return buf.toString("base64", i, buf.length - n);
  };
  var base64End = function(buf) {
    var r = buf && buf.length ? this.write(buf) : "";
    if (this.lastNeed)
      return r + this.lastChar.toString("base64", 0, 3 - this.lastNeed);
    return r;
  };
  var simpleWrite = function(buf) {
    return buf.toString(this.encoding);
  };
  var simpleEnd = function(buf) {
    return buf && buf.length ? this.write(buf) : "";
  };
  var Buffer4 = require_safe_buffer2().Buffer;
  var isEncoding = Buffer4.isEncoding || function(encoding) {
    encoding = "" + encoding;
    switch (encoding && encoding.toLowerCase()) {
      case "hex":
      case "utf8":
      case "utf-8":
      case "ascii":
      case "binary":
      case "base64":
      case "ucs2":
      case "ucs-2":
      case "utf16le":
      case "utf-16le":
      case "raw":
        return true;
      default:
        return false;
    }
  };
  exports.StringDecoder = StringDecoder;
  StringDecoder.prototype.write = function(buf) {
    if (buf.length === 0)
      return "";
    var r;
    var i;
    if (this.lastNeed) {
      r = this.fillLast(buf);
      if (r === undefined)
        return "";
      i = this.lastNeed;
      this.lastNeed = 0;
    } else {
      i = 0;
    }
    if (i < buf.length)
      return r ? r + this.text(buf, i) : this.text(buf, i);
    return r || "";
  };
  StringDecoder.prototype.end = utf8End;
  StringDecoder.prototype.text = utf8Text;
  StringDecoder.prototype.fillLast = function(buf) {
    if (this.lastNeed <= buf.length) {
      buf.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, this.lastNeed);
      return this.lastChar.toString(this.encoding, 0, this.lastTotal);
    }
    buf.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, buf.length);
    this.lastNeed -= buf.length;
  };
});

// node_modules/isarray/index.js
var require_isarray = __commonJS((exports, module) => {
  var toString = {}.toString;
  module.exports = Array.isArray || function(arr) {
    return toString.call(arr) == "[object Array]";
  };
});

// node_modules/tar-stream/node_modules/readable-stream/lib/internal/streams/stream-browser.js
var require_stream_browser = __commonJS((exports, module) => {
  module.exports = import.meta.require("events").EventEmitter;
});

// node_modules/tar-stream/node_modules/readable-stream/node_modules/safe-buffer/index.js
var require_safe_buffer3 = __commonJS((exports, module) => {
  var copyProps = function(src, dst) {
    for (var key in src) {
      dst[key] = src[key];
    }
  };
  var SafeBuffer = function(arg, encodingOrOffset, length) {
    return Buffer4(arg, encodingOrOffset, length);
  };
  var buffer = import.meta.require("buffer");
  var Buffer4 = buffer.Buffer;
  if (Buffer4.from && Buffer4.alloc && Buffer4.allocUnsafe && Buffer4.allocUnsafeSlow) {
    module.exports = buffer;
  } else {
    copyProps(buffer, exports);
    exports.Buffer = SafeBuffer;
  }
  copyProps(Buffer4, SafeBuffer);
  SafeBuffer.from = function(arg, encodingOrOffset, length) {
    if (typeof arg === "number") {
      throw new TypeError("Argument must not be a number");
    }
    return Buffer4(arg, encodingOrOffset, length);
  };
  SafeBuffer.alloc = function(size, fill, encoding) {
    if (typeof size !== "number") {
      throw new TypeError("Argument must be a number");
    }
    var buf = Buffer4(size);
    if (fill !== undefined) {
      if (typeof encoding === "string") {
        buf.fill(fill, encoding);
      } else {
        buf.fill(fill);
      }
    } else {
      buf.fill(0);
    }
    return buf;
  };
  SafeBuffer.allocUnsafe = function(size) {
    if (typeof size !== "number") {
      throw new TypeError("Argument must be a number");
    }
    return Buffer4(size);
  };
  SafeBuffer.allocUnsafeSlow = function(size) {
    if (typeof size !== "number") {
      throw new TypeError("Argument must be a number");
    }
    return buffer.SlowBuffer(size);
  };
});

// node_modules/tar-stream/node_modules/readable-stream/lib/internal/streams/BufferList.js
var require_BufferList = __commonJS((exports, module) => {
  var _classCallCheck = function(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };
  var copyBuffer = function(src, target, offset) {
    src.copy(target, offset);
  };
  var Buffer4 = require_safe_buffer3().Buffer;
  var util = import.meta.require("util");
  module.exports = function() {
    function BufferList() {
      _classCallCheck(this, BufferList);
      this.head = null;
      this.tail = null;
      this.length = 0;
    }
    BufferList.prototype.push = function push(v) {
      var entry = { data: v, next: null };
      if (this.length > 0)
        this.tail.next = entry;
      else
        this.head = entry;
      this.tail = entry;
      ++this.length;
    };
    BufferList.prototype.unshift = function unshift(v) {
      var entry = { data: v, next: this.head };
      if (this.length === 0)
        this.tail = entry;
      this.head = entry;
      ++this.length;
    };
    BufferList.prototype.shift = function shift() {
      if (this.length === 0)
        return;
      var ret = this.head.data;
      if (this.length === 1)
        this.head = this.tail = null;
      else
        this.head = this.head.next;
      --this.length;
      return ret;
    };
    BufferList.prototype.clear = function clear() {
      this.head = this.tail = null;
      this.length = 0;
    };
    BufferList.prototype.join = function join(s) {
      if (this.length === 0)
        return "";
      var p = this.head;
      var ret = "" + p.data;
      while (p = p.next) {
        ret += s + p.data;
      }
      return ret;
    };
    BufferList.prototype.concat = function concat(n) {
      if (this.length === 0)
        return Buffer4.alloc(0);
      var ret = Buffer4.allocUnsafe(n >>> 0);
      var p = this.head;
      var i = 0;
      while (p) {
        copyBuffer(p.data, ret, i);
        i += p.data.length;
        p = p.next;
      }
      return ret;
    };
    return BufferList;
  }();
  if (util && util.inspect && util.inspect.custom) {
    module.exports.prototype[util.inspect.custom] = function() {
      var obj = util.inspect({ length: this.length });
      return this.constructor.name + " " + obj;
    };
  }
});

// node_modules/tar-stream/node_modules/readable-stream/lib/internal/streams/destroy.js
var require_destroy = __commonJS((exports, module) => {
  var destroy = function(err, cb) {
    var _this = this;
    var readableDestroyed = this._readableState && this._readableState.destroyed;
    var writableDestroyed = this._writableState && this._writableState.destroyed;
    if (readableDestroyed || writableDestroyed) {
      if (cb) {
        cb(err);
      } else if (err) {
        if (!this._writableState) {
          pna.nextTick(emitErrorNT, this, err);
        } else if (!this._writableState.errorEmitted) {
          this._writableState.errorEmitted = true;
          pna.nextTick(emitErrorNT, this, err);
        }
      }
      return this;
    }
    if (this._readableState) {
      this._readableState.destroyed = true;
    }
    if (this._writableState) {
      this._writableState.destroyed = true;
    }
    this._destroy(err || null, function(err2) {
      if (!cb && err2) {
        if (!_this._writableState) {
          pna.nextTick(emitErrorNT, _this, err2);
        } else if (!_this._writableState.errorEmitted) {
          _this._writableState.errorEmitted = true;
          pna.nextTick(emitErrorNT, _this, err2);
        }
      } else if (cb) {
        cb(err2);
      }
    });
    return this;
  };
  var undestroy = function() {
    if (this._readableState) {
      this._readableState.destroyed = false;
      this._readableState.reading = false;
      this._readableState.ended = false;
      this._readableState.endEmitted = false;
    }
    if (this._writableState) {
      this._writableState.destroyed = false;
      this._writableState.ended = false;
      this._writableState.ending = false;
      this._writableState.finalCalled = false;
      this._writableState.prefinished = false;
      this._writableState.finished = false;
      this._writableState.errorEmitted = false;
    }
  };
  var emitErrorNT = function(self2, err) {
    self2.emit("error", err);
  };
  var pna = require_process_nextick_args();
  module.exports = {
    destroy,
    undestroy
  };
});

// node_modules/tar-stream/node_modules/readable-stream/lib/_stream_readable.js
var require__stream_readable = __commonJS((exports, module) => {
  var _uint8ArrayToBuffer = function(chunk) {
    return Buffer4.from(chunk);
  };
  var _isUint8Array = function(obj) {
    return Buffer4.isBuffer(obj) || obj instanceof OurUint8Array;
  };
  var prependListener = function(emitter, event, fn) {
    if (typeof emitter.prependListener === "function")
      return emitter.prependListener(event, fn);
    if (!emitter._events || !emitter._events[event])
      emitter.on(event, fn);
    else if (isArray(emitter._events[event]))
      emitter._events[event].unshift(fn);
    else
      emitter._events[event] = [fn, emitter._events[event]];
  };
  var ReadableState = function(options, stream2) {
    Duplex = Duplex || require__stream_duplex();
    options = options || {};
    var isDuplex = stream2 instanceof Duplex;
    this.objectMode = !!options.objectMode;
    if (isDuplex)
      this.objectMode = this.objectMode || !!options.readableObjectMode;
    var hwm = options.highWaterMark;
    var readableHwm = options.readableHighWaterMark;
    var defaultHwm = this.objectMode ? 16 : 16 * 1024;
    if (hwm || hwm === 0)
      this.highWaterMark = hwm;
    else if (isDuplex && (readableHwm || readableHwm === 0))
      this.highWaterMark = readableHwm;
    else
      this.highWaterMark = defaultHwm;
    this.highWaterMark = Math.floor(this.highWaterMark);
    this.buffer = new BufferList;
    this.length = 0;
    this.pipes = null;
    this.pipesCount = 0;
    this.flowing = null;
    this.ended = false;
    this.endEmitted = false;
    this.reading = false;
    this.sync = true;
    this.needReadable = false;
    this.emittedReadable = false;
    this.readableListening = false;
    this.resumeScheduled = false;
    this.destroyed = false;
    this.defaultEncoding = options.defaultEncoding || "utf8";
    this.awaitDrain = 0;
    this.readingMore = false;
    this.decoder = null;
    this.encoding = null;
    if (options.encoding) {
      if (!StringDecoder)
        StringDecoder = require_string_decoder().StringDecoder;
      this.decoder = new StringDecoder(options.encoding);
      this.encoding = options.encoding;
    }
  };
  var Readable = function(options) {
    Duplex = Duplex || require__stream_duplex();
    if (!(this instanceof Readable))
      return new Readable(options);
    this._readableState = new ReadableState(options, this);
    this.readable = true;
    if (options) {
      if (typeof options.read === "function")
        this._read = options.read;
      if (typeof options.destroy === "function")
        this._destroy = options.destroy;
    }
    Stream.call(this);
  };
  var readableAddChunk = function(stream2, chunk, encoding, addToFront, skipChunkCheck) {
    var state = stream2._readableState;
    if (chunk === null) {
      state.reading = false;
      onEofChunk(stream2, state);
    } else {
      var er;
      if (!skipChunkCheck)
        er = chunkInvalid(state, chunk);
      if (er) {
        stream2.emit("error", er);
      } else if (state.objectMode || chunk && chunk.length > 0) {
        if (typeof chunk !== "string" && !state.objectMode && Object.getPrototypeOf(chunk) !== Buffer4.prototype) {
          chunk = _uint8ArrayToBuffer(chunk);
        }
        if (addToFront) {
          if (state.endEmitted)
            stream2.emit("error", new Error("stream.unshift() after end event"));
          else
            addChunk(stream2, state, chunk, true);
        } else if (state.ended) {
          stream2.emit("error", new Error("stream.push() after EOF"));
        } else {
          state.reading = false;
          if (state.decoder && !encoding) {
            chunk = state.decoder.write(chunk);
            if (state.objectMode || chunk.length !== 0)
              addChunk(stream2, state, chunk, false);
            else
              maybeReadMore(stream2, state);
          } else {
            addChunk(stream2, state, chunk, false);
          }
        }
      } else if (!addToFront) {
        state.reading = false;
      }
    }
    return needMoreData(state);
  };
  var addChunk = function(stream2, state, chunk, addToFront) {
    if (state.flowing && state.length === 0 && !state.sync) {
      stream2.emit("data", chunk);
      stream2.read(0);
    } else {
      state.length += state.objectMode ? 1 : chunk.length;
      if (addToFront)
        state.buffer.unshift(chunk);
      else
        state.buffer.push(chunk);
      if (state.needReadable)
        emitReadable(stream2);
    }
    maybeReadMore(stream2, state);
  };
  var chunkInvalid = function(state, chunk) {
    var er;
    if (!_isUint8Array(chunk) && typeof chunk !== "string" && chunk !== undefined && !state.objectMode) {
      er = new TypeError("Invalid non-string/buffer chunk");
    }
    return er;
  };
  var needMoreData = function(state) {
    return !state.ended && (state.needReadable || state.length < state.highWaterMark || state.length === 0);
  };
  var computeNewHighWaterMark = function(n) {
    if (n >= MAX_HWM) {
      n = MAX_HWM;
    } else {
      n--;
      n |= n >>> 1;
      n |= n >>> 2;
      n |= n >>> 4;
      n |= n >>> 8;
      n |= n >>> 16;
      n++;
    }
    return n;
  };
  var howMuchToRead = function(n, state) {
    if (n <= 0 || state.length === 0 && state.ended)
      return 0;
    if (state.objectMode)
      return 1;
    if (n !== n) {
      if (state.flowing && state.length)
        return state.buffer.head.data.length;
      else
        return state.length;
    }
    if (n > state.highWaterMark)
      state.highWaterMark = computeNewHighWaterMark(n);
    if (n <= state.length)
      return n;
    if (!state.ended) {
      state.needReadable = true;
      return 0;
    }
    return state.length;
  };
  var onEofChunk = function(stream2, state) {
    if (state.ended)
      return;
    if (state.decoder) {
      var chunk = state.decoder.end();
      if (chunk && chunk.length) {
        state.buffer.push(chunk);
        state.length += state.objectMode ? 1 : chunk.length;
      }
    }
    state.ended = true;
    emitReadable(stream2);
  };
  var emitReadable = function(stream2) {
    var state = stream2._readableState;
    state.needReadable = false;
    if (!state.emittedReadable) {
      debug("emitReadable", state.flowing);
      state.emittedReadable = true;
      if (state.sync)
        pna.nextTick(emitReadable_, stream2);
      else
        emitReadable_(stream2);
    }
  };
  var emitReadable_ = function(stream2) {
    debug("emit readable");
    stream2.emit("readable");
    flow(stream2);
  };
  var maybeReadMore = function(stream2, state) {
    if (!state.readingMore) {
      state.readingMore = true;
      pna.nextTick(maybeReadMore_, stream2, state);
    }
  };
  var maybeReadMore_ = function(stream2, state) {
    var len = state.length;
    while (!state.reading && !state.flowing && !state.ended && state.length < state.highWaterMark) {
      debug("maybeReadMore read 0");
      stream2.read(0);
      if (len === state.length)
        break;
      else
        len = state.length;
    }
    state.readingMore = false;
  };
  var pipeOnDrain = function(src) {
    return function() {
      var state = src._readableState;
      debug("pipeOnDrain", state.awaitDrain);
      if (state.awaitDrain)
        state.awaitDrain--;
      if (state.awaitDrain === 0 && EElistenerCount(src, "data")) {
        state.flowing = true;
        flow(src);
      }
    };
  };
  var nReadingNextTick = function(self2) {
    debug("readable nexttick read 0");
    self2.read(0);
  };
  var resume = function(stream2, state) {
    if (!state.resumeScheduled) {
      state.resumeScheduled = true;
      pna.nextTick(resume_, stream2, state);
    }
  };
  var resume_ = function(stream2, state) {
    if (!state.reading) {
      debug("resume read 0");
      stream2.read(0);
    }
    state.resumeScheduled = false;
    state.awaitDrain = 0;
    stream2.emit("resume");
    flow(stream2);
    if (state.flowing && !state.reading)
      stream2.read(0);
  };
  var flow = function(stream2) {
    var state = stream2._readableState;
    debug("flow", state.flowing);
    while (state.flowing && stream2.read() !== null) {
    }
  };
  var fromList = function(n, state) {
    if (state.length === 0)
      return null;
    var ret;
    if (state.objectMode)
      ret = state.buffer.shift();
    else if (!n || n >= state.length) {
      if (state.decoder)
        ret = state.buffer.join("");
      else if (state.buffer.length === 1)
        ret = state.buffer.head.data;
      else
        ret = state.buffer.concat(state.length);
      state.buffer.clear();
    } else {
      ret = fromListPartial(n, state.buffer, state.decoder);
    }
    return ret;
  };
  var fromListPartial = function(n, list, hasStrings) {
    var ret;
    if (n < list.head.data.length) {
      ret = list.head.data.slice(0, n);
      list.head.data = list.head.data.slice(n);
    } else if (n === list.head.data.length) {
      ret = list.shift();
    } else {
      ret = hasStrings ? copyFromBufferString(n, list) : copyFromBuffer(n, list);
    }
    return ret;
  };
  var copyFromBufferString = function(n, list) {
    var p = list.head;
    var c = 1;
    var ret = p.data;
    n -= ret.length;
    while (p = p.next) {
      var str = p.data;
      var nb = n > str.length ? str.length : n;
      if (nb === str.length)
        ret += str;
      else
        ret += str.slice(0, n);
      n -= nb;
      if (n === 0) {
        if (nb === str.length) {
          ++c;
          if (p.next)
            list.head = p.next;
          else
            list.head = list.tail = null;
        } else {
          list.head = p;
          p.data = str.slice(nb);
        }
        break;
      }
      ++c;
    }
    list.length -= c;
    return ret;
  };
  var copyFromBuffer = function(n, list) {
    var ret = Buffer4.allocUnsafe(n);
    var p = list.head;
    var c = 1;
    p.data.copy(ret);
    n -= p.data.length;
    while (p = p.next) {
      var buf = p.data;
      var nb = n > buf.length ? buf.length : n;
      buf.copy(ret, ret.length - n, 0, nb);
      n -= nb;
      if (n === 0) {
        if (nb === buf.length) {
          ++c;
          if (p.next)
            list.head = p.next;
          else
            list.head = list.tail = null;
        } else {
          list.head = p;
          p.data = buf.slice(nb);
        }
        break;
      }
      ++c;
    }
    list.length -= c;
    return ret;
  };
  var endReadable = function(stream2) {
    var state = stream2._readableState;
    if (state.length > 0)
      throw new Error('"endReadable()" called on non-empty stream');
    if (!state.endEmitted) {
      state.ended = true;
      pna.nextTick(endReadableNT, state, stream2);
    }
  };
  var endReadableNT = function(state, stream2) {
    if (!state.endEmitted && state.length === 0) {
      state.endEmitted = true;
      stream2.readable = false;
      stream2.emit("end");
    }
  };
  var indexOf = function(xs, x) {
    for (var i = 0, l = xs.length;i < l; i++) {
      if (xs[i] === x)
        return i;
    }
    return -1;
  };
  var pna = require_process_nextick_args();
  module.exports = Readable;
  var isArray = require_isarray();
  var Duplex;
  Readable.ReadableState = ReadableState;
  var EE = import.meta.require("events").EventEmitter;
  var EElistenerCount = function(emitter, type) {
    return emitter.listeners(type).length;
  };
  var Stream = require_stream_browser();
  var Buffer4 = require_safe_buffer3().Buffer;
  var OurUint8Array = (typeof global !== "undefined" ? global : typeof window !== "undefined" ? window : typeof self !== "undefined" ? self : {}).Uint8Array || function() {
  };
  var util = Object.create(require_util2());
  util.inherits = require_inherits_browser();
  var debugUtil = import.meta.require("util");
  var debug = undefined;
  if (debugUtil && debugUtil.debuglog) {
    debug = debugUtil.debuglog("stream");
  } else {
    debug = function() {
    };
  }
  var BufferList = require_BufferList();
  var destroyImpl = require_destroy();
  var StringDecoder;
  util.inherits(Readable, Stream);
  var kProxyEvents = ["error", "close", "destroy", "pause", "resume"];
  Object.defineProperty(Readable.prototype, "destroyed", {
    get: function() {
      if (this._readableState === undefined) {
        return false;
      }
      return this._readableState.destroyed;
    },
    set: function(value) {
      if (!this._readableState) {
        return;
      }
      this._readableState.destroyed = value;
    }
  });
  Readable.prototype.destroy = destroyImpl.destroy;
  Readable.prototype._undestroy = destroyImpl.undestroy;
  Readable.prototype._destroy = function(err, cb) {
    this.push(null);
    cb(err);
  };
  Readable.prototype.push = function(chunk, encoding) {
    var state = this._readableState;
    var skipChunkCheck;
    if (!state.objectMode) {
      if (typeof chunk === "string") {
        encoding = encoding || state.defaultEncoding;
        if (encoding !== state.encoding) {
          chunk = Buffer4.from(chunk, encoding);
          encoding = "";
        }
        skipChunkCheck = true;
      }
    } else {
      skipChunkCheck = true;
    }
    return readableAddChunk(this, chunk, encoding, false, skipChunkCheck);
  };
  Readable.prototype.unshift = function(chunk) {
    return readableAddChunk(this, chunk, null, true, false);
  };
  Readable.prototype.isPaused = function() {
    return this._readableState.flowing === false;
  };
  Readable.prototype.setEncoding = function(enc) {
    if (!StringDecoder)
      StringDecoder = require_string_decoder().StringDecoder;
    this._readableState.decoder = new StringDecoder(enc);
    this._readableState.encoding = enc;
    return this;
  };
  var MAX_HWM = 8388608;
  Readable.prototype.read = function(n) {
    debug("read", n);
    n = parseInt(n, 10);
    var state = this._readableState;
    var nOrig = n;
    if (n !== 0)
      state.emittedReadable = false;
    if (n === 0 && state.needReadable && (state.length >= state.highWaterMark || state.ended)) {
      debug("read: emitReadable", state.length, state.ended);
      if (state.length === 0 && state.ended)
        endReadable(this);
      else
        emitReadable(this);
      return null;
    }
    n = howMuchToRead(n, state);
    if (n === 0 && state.ended) {
      if (state.length === 0)
        endReadable(this);
      return null;
    }
    var doRead = state.needReadable;
    debug("need readable", doRead);
    if (state.length === 0 || state.length - n < state.highWaterMark) {
      doRead = true;
      debug("length less than watermark", doRead);
    }
    if (state.ended || state.reading) {
      doRead = false;
      debug("reading or ended", doRead);
    } else if (doRead) {
      debug("do read");
      state.reading = true;
      state.sync = true;
      if (state.length === 0)
        state.needReadable = true;
      this._read(state.highWaterMark);
      state.sync = false;
      if (!state.reading)
        n = howMuchToRead(nOrig, state);
    }
    var ret;
    if (n > 0)
      ret = fromList(n, state);
    else
      ret = null;
    if (ret === null) {
      state.needReadable = true;
      n = 0;
    } else {
      state.length -= n;
    }
    if (state.length === 0) {
      if (!state.ended)
        state.needReadable = true;
      if (nOrig !== n && state.ended)
        endReadable(this);
    }
    if (ret !== null)
      this.emit("data", ret);
    return ret;
  };
  Readable.prototype._read = function(n) {
    this.emit("error", new Error("_read() is not implemented"));
  };
  Readable.prototype.pipe = function(dest, pipeOpts) {
    var src = this;
    var state = this._readableState;
    switch (state.pipesCount) {
      case 0:
        state.pipes = dest;
        break;
      case 1:
        state.pipes = [state.pipes, dest];
        break;
      default:
        state.pipes.push(dest);
        break;
    }
    state.pipesCount += 1;
    debug("pipe count=%d opts=%j", state.pipesCount, pipeOpts);
    var doEnd = (!pipeOpts || pipeOpts.end !== false) && dest !== process.stdout && dest !== process.stderr;
    var endFn = doEnd ? onend : unpipe;
    if (state.endEmitted)
      pna.nextTick(endFn);
    else
      src.once("end", endFn);
    dest.on("unpipe", onunpipe);
    function onunpipe(readable, unpipeInfo) {
      debug("onunpipe");
      if (readable === src) {
        if (unpipeInfo && unpipeInfo.hasUnpiped === false) {
          unpipeInfo.hasUnpiped = true;
          cleanup();
        }
      }
    }
    function onend() {
      debug("onend");
      dest.end();
    }
    var ondrain = pipeOnDrain(src);
    dest.on("drain", ondrain);
    var cleanedUp = false;
    function cleanup() {
      debug("cleanup");
      dest.removeListener("close", onclose);
      dest.removeListener("finish", onfinish);
      dest.removeListener("drain", ondrain);
      dest.removeListener("error", onerror);
      dest.removeListener("unpipe", onunpipe);
      src.removeListener("end", onend);
      src.removeListener("end", unpipe);
      src.removeListener("data", ondata);
      cleanedUp = true;
      if (state.awaitDrain && (!dest._writableState || dest._writableState.needDrain))
        ondrain();
    }
    var increasedAwaitDrain = false;
    src.on("data", ondata);
    function ondata(chunk) {
      debug("ondata");
      increasedAwaitDrain = false;
      var ret = dest.write(chunk);
      if (ret === false && !increasedAwaitDrain) {
        if ((state.pipesCount === 1 && state.pipes === dest || state.pipesCount > 1 && indexOf(state.pipes, dest) !== -1) && !cleanedUp) {
          debug("false write response, pause", state.awaitDrain);
          state.awaitDrain++;
          increasedAwaitDrain = true;
        }
        src.pause();
      }
    }
    function onerror(er) {
      debug("onerror", er);
      unpipe();
      dest.removeListener("error", onerror);
      if (EElistenerCount(dest, "error") === 0)
        dest.emit("error", er);
    }
    prependListener(dest, "error", onerror);
    function onclose() {
      dest.removeListener("finish", onfinish);
      unpipe();
    }
    dest.once("close", onclose);
    function onfinish() {
      debug("onfinish");
      dest.removeListener("close", onclose);
      unpipe();
    }
    dest.once("finish", onfinish);
    function unpipe() {
      debug("unpipe");
      src.unpipe(dest);
    }
    dest.emit("pipe", src);
    if (!state.flowing) {
      debug("pipe resume");
      src.resume();
    }
    return dest;
  };
  Readable.prototype.unpipe = function(dest) {
    var state = this._readableState;
    var unpipeInfo = { hasUnpiped: false };
    if (state.pipesCount === 0)
      return this;
    if (state.pipesCount === 1) {
      if (dest && dest !== state.pipes)
        return this;
      if (!dest)
        dest = state.pipes;
      state.pipes = null;
      state.pipesCount = 0;
      state.flowing = false;
      if (dest)
        dest.emit("unpipe", this, unpipeInfo);
      return this;
    }
    if (!dest) {
      var dests = state.pipes;
      var len = state.pipesCount;
      state.pipes = null;
      state.pipesCount = 0;
      state.flowing = false;
      for (var i = 0;i < len; i++) {
        dests[i].emit("unpipe", this, { hasUnpiped: false });
      }
      return this;
    }
    var index = indexOf(state.pipes, dest);
    if (index === -1)
      return this;
    state.pipes.splice(index, 1);
    state.pipesCount -= 1;
    if (state.pipesCount === 1)
      state.pipes = state.pipes[0];
    dest.emit("unpipe", this, unpipeInfo);
    return this;
  };
  Readable.prototype.on = function(ev, fn) {
    var res = Stream.prototype.on.call(this, ev, fn);
    if (ev === "data") {
      if (this._readableState.flowing !== false)
        this.resume();
    } else if (ev === "readable") {
      var state = this._readableState;
      if (!state.endEmitted && !state.readableListening) {
        state.readableListening = state.needReadable = true;
        state.emittedReadable = false;
        if (!state.reading) {
          pna.nextTick(nReadingNextTick, this);
        } else if (state.length) {
          emitReadable(this);
        }
      }
    }
    return res;
  };
  Readable.prototype.addListener = Readable.prototype.on;
  Readable.prototype.resume = function() {
    var state = this._readableState;
    if (!state.flowing) {
      debug("resume");
      state.flowing = true;
      resume(this, state);
    }
    return this;
  };
  Readable.prototype.pause = function() {
    debug("call pause flowing=%j", this._readableState.flowing);
    if (this._readableState.flowing !== false) {
      debug("pause");
      this._readableState.flowing = false;
      this.emit("pause");
    }
    return this;
  };
  Readable.prototype.wrap = function(stream2) {
    var _this = this;
    var state = this._readableState;
    var paused = false;
    stream2.on("end", function() {
      debug("wrapped end");
      if (state.decoder && !state.ended) {
        var chunk = state.decoder.end();
        if (chunk && chunk.length)
          _this.push(chunk);
      }
      _this.push(null);
    });
    stream2.on("data", function(chunk) {
      debug("wrapped data");
      if (state.decoder)
        chunk = state.decoder.write(chunk);
      if (state.objectMode && (chunk === null || chunk === undefined))
        return;
      else if (!state.objectMode && (!chunk || !chunk.length))
        return;
      var ret = _this.push(chunk);
      if (!ret) {
        paused = true;
        stream2.pause();
      }
    });
    for (var i in stream2) {
      if (this[i] === undefined && typeof stream2[i] === "function") {
        this[i] = function(method) {
          return function() {
            return stream2[method].apply(stream2, arguments);
          };
        }(i);
      }
    }
    for (var n = 0;n < kProxyEvents.length; n++) {
      stream2.on(kProxyEvents[n], this.emit.bind(this, kProxyEvents[n]));
    }
    this._read = function(n2) {
      debug("wrapped _read", n2);
      if (paused) {
        paused = false;
        stream2.resume();
      }
    };
    return this;
  };
  Object.defineProperty(Readable.prototype, "readableHighWaterMark", {
    enumerable: false,
    get: function() {
      return this._readableState.highWaterMark;
    }
  });
  Readable._fromList = fromList;
});

// node_modules/util-deprecate/browser.js
var require_browser = __commonJS((exports, module) => {
  var deprecate = function(fn, msg) {
    if (config("noDeprecation")) {
      return fn;
    }
    var warned = false;
    function deprecated() {
      if (!warned) {
        if (config("throwDeprecation")) {
          throw new Error(msg);
        } else if (config("traceDeprecation")) {
          console.trace(msg);
        } else {
          console.warn(msg);
        }
        warned = true;
      }
      return fn.apply(this, arguments);
    }
    return deprecated;
  };
  var config = function(name2) {
    try {
      if (!global.localStorage)
        return false;
    } catch (_) {
      return false;
    }
    var val = global.localStorage[name2];
    if (val == null)
      return false;
    return String(val).toLowerCase() === "true";
  };
  module.exports = deprecate;
});

// node_modules/tar-stream/node_modules/readable-stream/lib/_stream_writable.js
var require__stream_writable = __commonJS((exports, module) => {
  var CorkedRequest = function(state) {
    var _this = this;
    this.next = null;
    this.entry = null;
    this.finish = function() {
      onCorkedFinish(_this, state);
    };
  };
  var _uint8ArrayToBuffer = function(chunk) {
    return Buffer4.from(chunk);
  };
  var _isUint8Array = function(obj) {
    return Buffer4.isBuffer(obj) || obj instanceof OurUint8Array;
  };
  var nop = function() {
  };
  var WritableState = function(options, stream2) {
    Duplex = Duplex || require__stream_duplex();
    options = options || {};
    var isDuplex = stream2 instanceof Duplex;
    this.objectMode = !!options.objectMode;
    if (isDuplex)
      this.objectMode = this.objectMode || !!options.writableObjectMode;
    var hwm = options.highWaterMark;
    var writableHwm = options.writableHighWaterMark;
    var defaultHwm = this.objectMode ? 16 : 16 * 1024;
    if (hwm || hwm === 0)
      this.highWaterMark = hwm;
    else if (isDuplex && (writableHwm || writableHwm === 0))
      this.highWaterMark = writableHwm;
    else
      this.highWaterMark = defaultHwm;
    this.highWaterMark = Math.floor(this.highWaterMark);
    this.finalCalled = false;
    this.needDrain = false;
    this.ending = false;
    this.ended = false;
    this.finished = false;
    this.destroyed = false;
    var noDecode = options.decodeStrings === false;
    this.decodeStrings = !noDecode;
    this.defaultEncoding = options.defaultEncoding || "utf8";
    this.length = 0;
    this.writing = false;
    this.corked = 0;
    this.sync = true;
    this.bufferProcessing = false;
    this.onwrite = function(er) {
      onwrite(stream2, er);
    };
    this.writecb = null;
    this.writelen = 0;
    this.bufferedRequest = null;
    this.lastBufferedRequest = null;
    this.pendingcb = 0;
    this.prefinished = false;
    this.errorEmitted = false;
    this.bufferedRequestCount = 0;
    this.corkedRequestsFree = new CorkedRequest(this);
  };
  var Writable = function(options) {
    Duplex = Duplex || require__stream_duplex();
    if (!realHasInstance.call(Writable, this) && !(this instanceof Duplex)) {
      return new Writable(options);
    }
    this._writableState = new WritableState(options, this);
    this.writable = true;
    if (options) {
      if (typeof options.write === "function")
        this._write = options.write;
      if (typeof options.writev === "function")
        this._writev = options.writev;
      if (typeof options.destroy === "function")
        this._destroy = options.destroy;
      if (typeof options.final === "function")
        this._final = options.final;
    }
    Stream.call(this);
  };
  var writeAfterEnd = function(stream2, cb) {
    var er = new Error("write after end");
    stream2.emit("error", er);
    pna.nextTick(cb, er);
  };
  var validChunk = function(stream2, state, chunk, cb) {
    var valid = true;
    var er = false;
    if (chunk === null) {
      er = new TypeError("May not write null values to stream");
    } else if (typeof chunk !== "string" && chunk !== undefined && !state.objectMode) {
      er = new TypeError("Invalid non-string/buffer chunk");
    }
    if (er) {
      stream2.emit("error", er);
      pna.nextTick(cb, er);
      valid = false;
    }
    return valid;
  };
  var decodeChunk = function(state, chunk, encoding) {
    if (!state.objectMode && state.decodeStrings !== false && typeof chunk === "string") {
      chunk = Buffer4.from(chunk, encoding);
    }
    return chunk;
  };
  var writeOrBuffer = function(stream2, state, isBuf, chunk, encoding, cb) {
    if (!isBuf) {
      var newChunk = decodeChunk(state, chunk, encoding);
      if (chunk !== newChunk) {
        isBuf = true;
        encoding = "buffer";
        chunk = newChunk;
      }
    }
    var len = state.objectMode ? 1 : chunk.length;
    state.length += len;
    var ret = state.length < state.highWaterMark;
    if (!ret)
      state.needDrain = true;
    if (state.writing || state.corked) {
      var last = state.lastBufferedRequest;
      state.lastBufferedRequest = {
        chunk,
        encoding,
        isBuf,
        callback: cb,
        next: null
      };
      if (last) {
        last.next = state.lastBufferedRequest;
      } else {
        state.bufferedRequest = state.lastBufferedRequest;
      }
      state.bufferedRequestCount += 1;
    } else {
      doWrite(stream2, state, false, len, chunk, encoding, cb);
    }
    return ret;
  };
  var doWrite = function(stream2, state, writev, len, chunk, encoding, cb) {
    state.writelen = len;
    state.writecb = cb;
    state.writing = true;
    state.sync = true;
    if (writev)
      stream2._writev(chunk, state.onwrite);
    else
      stream2._write(chunk, encoding, state.onwrite);
    state.sync = false;
  };
  var onwriteError = function(stream2, state, sync, er, cb) {
    --state.pendingcb;
    if (sync) {
      pna.nextTick(cb, er);
      pna.nextTick(finishMaybe, stream2, state);
      stream2._writableState.errorEmitted = true;
      stream2.emit("error", er);
    } else {
      cb(er);
      stream2._writableState.errorEmitted = true;
      stream2.emit("error", er);
      finishMaybe(stream2, state);
    }
  };
  var onwriteStateUpdate = function(state) {
    state.writing = false;
    state.writecb = null;
    state.length -= state.writelen;
    state.writelen = 0;
  };
  var onwrite = function(stream2, er) {
    var state = stream2._writableState;
    var sync = state.sync;
    var cb = state.writecb;
    onwriteStateUpdate(state);
    if (er)
      onwriteError(stream2, state, sync, er, cb);
    else {
      var finished = needFinish(state);
      if (!finished && !state.corked && !state.bufferProcessing && state.bufferedRequest) {
        clearBuffer(stream2, state);
      }
      if (sync) {
        asyncWrite(afterWrite, stream2, state, finished, cb);
      } else {
        afterWrite(stream2, state, finished, cb);
      }
    }
  };
  var afterWrite = function(stream2, state, finished, cb) {
    if (!finished)
      onwriteDrain(stream2, state);
    state.pendingcb--;
    cb();
    finishMaybe(stream2, state);
  };
  var onwriteDrain = function(stream2, state) {
    if (state.length === 0 && state.needDrain) {
      state.needDrain = false;
      stream2.emit("drain");
    }
  };
  var clearBuffer = function(stream2, state) {
    state.bufferProcessing = true;
    var entry = state.bufferedRequest;
    if (stream2._writev && entry && entry.next) {
      var l = state.bufferedRequestCount;
      var buffer = new Array(l);
      var holder = state.corkedRequestsFree;
      holder.entry = entry;
      var count = 0;
      var allBuffers = true;
      while (entry) {
        buffer[count] = entry;
        if (!entry.isBuf)
          allBuffers = false;
        entry = entry.next;
        count += 1;
      }
      buffer.allBuffers = allBuffers;
      doWrite(stream2, state, true, state.length, buffer, "", holder.finish);
      state.pendingcb++;
      state.lastBufferedRequest = null;
      if (holder.next) {
        state.corkedRequestsFree = holder.next;
        holder.next = null;
      } else {
        state.corkedRequestsFree = new CorkedRequest(state);
      }
      state.bufferedRequestCount = 0;
    } else {
      while (entry) {
        var chunk = entry.chunk;
        var encoding = entry.encoding;
        var cb = entry.callback;
        var len = state.objectMode ? 1 : chunk.length;
        doWrite(stream2, state, false, len, chunk, encoding, cb);
        entry = entry.next;
        state.bufferedRequestCount--;
        if (state.writing) {
          break;
        }
      }
      if (entry === null)
        state.lastBufferedRequest = null;
    }
    state.bufferedRequest = entry;
    state.bufferProcessing = false;
  };
  var needFinish = function(state) {
    return state.ending && state.length === 0 && state.bufferedRequest === null && !state.finished && !state.writing;
  };
  var callFinal = function(stream2, state) {
    stream2._final(function(err) {
      state.pendingcb--;
      if (err) {
        stream2.emit("error", err);
      }
      state.prefinished = true;
      stream2.emit("prefinish");
      finishMaybe(stream2, state);
    });
  };
  var prefinish = function(stream2, state) {
    if (!state.prefinished && !state.finalCalled) {
      if (typeof stream2._final === "function") {
        state.pendingcb++;
        state.finalCalled = true;
        pna.nextTick(callFinal, stream2, state);
      } else {
        state.prefinished = true;
        stream2.emit("prefinish");
      }
    }
  };
  var finishMaybe = function(stream2, state) {
    var need = needFinish(state);
    if (need) {
      prefinish(stream2, state);
      if (state.pendingcb === 0) {
        state.finished = true;
        stream2.emit("finish");
      }
    }
    return need;
  };
  var endWritable = function(stream2, state, cb) {
    state.ending = true;
    finishMaybe(stream2, state);
    if (cb) {
      if (state.finished)
        pna.nextTick(cb);
      else
        stream2.once("finish", cb);
    }
    state.ended = true;
    stream2.writable = false;
  };
  var onCorkedFinish = function(corkReq, state, err) {
    var entry = corkReq.entry;
    corkReq.entry = null;
    while (entry) {
      var cb = entry.callback;
      state.pendingcb--;
      cb(err);
      entry = entry.next;
    }
    state.corkedRequestsFree.next = corkReq;
  };
  var pna = require_process_nextick_args();
  module.exports = Writable;
  var asyncWrite = pna.nextTick;
  var Duplex;
  Writable.WritableState = WritableState;
  var util = Object.create(require_util2());
  util.inherits = require_inherits_browser();
  var internalUtil = {
    deprecate: require_browser()
  };
  var Stream = require_stream_browser();
  var Buffer4 = require_safe_buffer3().Buffer;
  var OurUint8Array = (typeof global !== "undefined" ? global : typeof window !== "undefined" ? window : typeof self !== "undefined" ? self : {}).Uint8Array || function() {
  };
  var destroyImpl = require_destroy();
  util.inherits(Writable, Stream);
  WritableState.prototype.getBuffer = function getBuffer() {
    var current = this.bufferedRequest;
    var out = [];
    while (current) {
      out.push(current);
      current = current.next;
    }
    return out;
  };
  (function() {
    try {
      Object.defineProperty(WritableState.prototype, "buffer", {
        get: internalUtil.deprecate(function() {
          return this.getBuffer();
        }, "_writableState.buffer is deprecated. Use _writableState.getBuffer " + "instead.", "DEP0003")
      });
    } catch (_) {
    }
  })();
  var realHasInstance;
  if (typeof Symbol === "function" && Symbol.hasInstance && typeof Function.prototype[Symbol.hasInstance] === "function") {
    realHasInstance = Function.prototype[Symbol.hasInstance];
    Object.defineProperty(Writable, Symbol.hasInstance, {
      value: function(object) {
        if (realHasInstance.call(this, object))
          return true;
        if (this !== Writable)
          return false;
        return object && object._writableState instanceof WritableState;
      }
    });
  } else {
    realHasInstance = function(object) {
      return object instanceof this;
    };
  }
  Writable.prototype.pipe = function() {
    this.emit("error", new Error("Cannot pipe, not readable"));
  };
  Writable.prototype.write = function(chunk, encoding, cb) {
    var state = this._writableState;
    var ret = false;
    var isBuf = !state.objectMode && _isUint8Array(chunk);
    if (isBuf && !Buffer4.isBuffer(chunk)) {
      chunk = _uint8ArrayToBuffer(chunk);
    }
    if (typeof encoding === "function") {
      cb = encoding;
      encoding = null;
    }
    if (isBuf)
      encoding = "buffer";
    else if (!encoding)
      encoding = state.defaultEncoding;
    if (typeof cb !== "function")
      cb = nop;
    if (state.ended)
      writeAfterEnd(this, cb);
    else if (isBuf || validChunk(this, state, chunk, cb)) {
      state.pendingcb++;
      ret = writeOrBuffer(this, state, isBuf, chunk, encoding, cb);
    }
    return ret;
  };
  Writable.prototype.cork = function() {
    var state = this._writableState;
    state.corked++;
  };
  Writable.prototype.uncork = function() {
    var state = this._writableState;
    if (state.corked) {
      state.corked--;
      if (!state.writing && !state.corked && !state.bufferProcessing && state.bufferedRequest)
        clearBuffer(this, state);
    }
  };
  Writable.prototype.setDefaultEncoding = function setDefaultEncoding(encoding) {
    if (typeof encoding === "string")
      encoding = encoding.toLowerCase();
    if (!(["hex", "utf8", "utf-8", "ascii", "binary", "base64", "ucs2", "ucs-2", "utf16le", "utf-16le", "raw"].indexOf((encoding + "").toLowerCase()) > -1))
      throw new TypeError("Unknown encoding: " + encoding);
    this._writableState.defaultEncoding = encoding;
    return this;
  };
  Object.defineProperty(Writable.prototype, "writableHighWaterMark", {
    enumerable: false,
    get: function() {
      return this._writableState.highWaterMark;
    }
  });
  Writable.prototype._write = function(chunk, encoding, cb) {
    cb(new Error("_write() is not implemented"));
  };
  Writable.prototype._writev = null;
  Writable.prototype.end = function(chunk, encoding, cb) {
    var state = this._writableState;
    if (typeof chunk === "function") {
      cb = chunk;
      chunk = null;
      encoding = null;
    } else if (typeof encoding === "function") {
      cb = encoding;
      encoding = null;
    }
    if (chunk !== null && chunk !== undefined)
      this.write(chunk, encoding);
    if (state.corked) {
      state.corked = 1;
      this.uncork();
    }
    if (!state.ending)
      endWritable(this, state, cb);
  };
  Object.defineProperty(Writable.prototype, "destroyed", {
    get: function() {
      if (this._writableState === undefined) {
        return false;
      }
      return this._writableState.destroyed;
    },
    set: function(value) {
      if (!this._writableState) {
        return;
      }
      this._writableState.destroyed = value;
    }
  });
  Writable.prototype.destroy = destroyImpl.destroy;
  Writable.prototype._undestroy = destroyImpl.undestroy;
  Writable.prototype._destroy = function(err, cb) {
    this.end();
    cb(err);
  };
});

// node_modules/tar-stream/node_modules/readable-stream/lib/_stream_duplex.js
var require__stream_duplex = __commonJS((exports, module) => {
  var Duplex = function(options) {
    if (!(this instanceof Duplex))
      return new Duplex(options);
    Readable.call(this, options);
    Writable.call(this, options);
    if (options && options.readable === false)
      this.readable = false;
    if (options && options.writable === false)
      this.writable = false;
    this.allowHalfOpen = true;
    if (options && options.allowHalfOpen === false)
      this.allowHalfOpen = false;
    this.once("end", onend);
  };
  var onend = function() {
    if (this.allowHalfOpen || this._writableState.ended)
      return;
    pna.nextTick(onEndNT, this);
  };
  var onEndNT = function(self2) {
    self2.end();
  };
  var pna = require_process_nextick_args();
  var objectKeys = Object.keys || function(obj) {
    var keys2 = [];
    for (var key in obj) {
      keys2.push(key);
    }
    return keys2;
  };
  module.exports = Duplex;
  var util = Object.create(require_util2());
  util.inherits = require_inherits_browser();
  var Readable = require__stream_readable();
  var Writable = require__stream_writable();
  util.inherits(Duplex, Readable);
  {
    keys = objectKeys(Writable.prototype);
    for (v = 0;v < keys.length; v++) {
      method = keys[v];
      if (!Duplex.prototype[method])
        Duplex.prototype[method] = Writable.prototype[method];
    }
  }
  var keys;
  var method;
  var v;
  Object.defineProperty(Duplex.prototype, "writableHighWaterMark", {
    enumerable: false,
    get: function() {
      return this._writableState.highWaterMark;
    }
  });
  Object.defineProperty(Duplex.prototype, "destroyed", {
    get: function() {
      if (this._readableState === undefined || this._writableState === undefined) {
        return false;
      }
      return this._readableState.destroyed && this._writableState.destroyed;
    },
    set: function(value) {
      if (this._readableState === undefined || this._writableState === undefined) {
        return;
      }
      this._readableState.destroyed = value;
      this._writableState.destroyed = value;
    }
  });
  Duplex.prototype._destroy = function(err, cb) {
    this.push(null);
    this.end();
    pna.nextTick(cb, err);
  };
});

// node_modules/tar-stream/node_modules/bl/bl.js
var require_bl = __commonJS((exports, module) => {
  var BufferList = function(callback) {
    if (!(this instanceof BufferList))
      return new BufferList(callback);
    this._bufs = [];
    this.length = 0;
    if (typeof callback == "function") {
      this._callback = callback;
      var piper = function piper(err) {
        if (this._callback) {
          this._callback(err);
          this._callback = null;
        }
      }.bind(this);
      this.on("pipe", function onPipe(src) {
        src.on("error", piper);
      });
      this.on("unpipe", function onUnpipe(src) {
        src.removeListener("error", piper);
      });
    } else {
      this.append(callback);
    }
    DuplexStream.call(this);
  };
  var DuplexStream = require__stream_duplex();
  var util = import.meta.require("util");
  var Buffer4 = require_safe_buffer().Buffer;
  util.inherits(BufferList, DuplexStream);
  BufferList.prototype._offset = function _offset(offset) {
    var tot = 0, i = 0, _t;
    if (offset === 0)
      return [0, 0];
    for (;i < this._bufs.length; i++) {
      _t = tot + this._bufs[i].length;
      if (offset < _t || i == this._bufs.length - 1)
        return [i, offset - tot];
      tot = _t;
    }
  };
  BufferList.prototype.append = function append(buf) {
    var i = 0;
    if (Buffer4.isBuffer(buf)) {
      this._appendBuffer(buf);
    } else if (Array.isArray(buf)) {
      for (;i < buf.length; i++)
        this.append(buf[i]);
    } else if (buf instanceof BufferList) {
      for (;i < buf._bufs.length; i++)
        this.append(buf._bufs[i]);
    } else if (buf != null) {
      if (typeof buf == "number")
        buf = buf.toString();
      this._appendBuffer(Buffer4.from(buf));
    }
    return this;
  };
  BufferList.prototype._appendBuffer = function appendBuffer(buf) {
    this._bufs.push(buf);
    this.length += buf.length;
  };
  BufferList.prototype._write = function _write(buf, encoding, callback) {
    this._appendBuffer(buf);
    if (typeof callback == "function")
      callback();
  };
  BufferList.prototype._read = function _read(size) {
    if (!this.length)
      return this.push(null);
    size = Math.min(size, this.length);
    this.push(this.slice(0, size));
    this.consume(size);
  };
  BufferList.prototype.end = function end(chunk) {
    DuplexStream.prototype.end.call(this, chunk);
    if (this._callback) {
      this._callback(null, this.slice());
      this._callback = null;
    }
  };
  BufferList.prototype.get = function get(index) {
    return this.slice(index, index + 1)[0];
  };
  BufferList.prototype.slice = function slice(start, end) {
    if (typeof start == "number" && start < 0)
      start += this.length;
    if (typeof end == "number" && end < 0)
      end += this.length;
    return this.copy(null, 0, start, end);
  };
  BufferList.prototype.copy = function copy(dst, dstStart, srcStart, srcEnd) {
    if (typeof srcStart != "number" || srcStart < 0)
      srcStart = 0;
    if (typeof srcEnd != "number" || srcEnd > this.length)
      srcEnd = this.length;
    if (srcStart >= this.length)
      return dst || Buffer4.alloc(0);
    if (srcEnd <= 0)
      return dst || Buffer4.alloc(0);
    var copy = !!dst, off = this._offset(srcStart), len = srcEnd - srcStart, bytes = len, bufoff = copy && dstStart || 0, start = off[1], l, i;
    if (srcStart === 0 && srcEnd == this.length) {
      if (!copy) {
        return this._bufs.length === 1 ? this._bufs[0] : Buffer4.concat(this._bufs, this.length);
      }
      for (i = 0;i < this._bufs.length; i++) {
        this._bufs[i].copy(dst, bufoff);
        bufoff += this._bufs[i].length;
      }
      return dst;
    }
    if (bytes <= this._bufs[off[0]].length - start) {
      return copy ? this._bufs[off[0]].copy(dst, dstStart, start, start + bytes) : this._bufs[off[0]].slice(start, start + bytes);
    }
    if (!copy)
      dst = Buffer4.allocUnsafe(len);
    for (i = off[0];i < this._bufs.length; i++) {
      l = this._bufs[i].length - start;
      if (bytes > l) {
        this._bufs[i].copy(dst, bufoff, start);
        bufoff += l;
      } else {
        this._bufs[i].copy(dst, bufoff, start, start + bytes);
        bufoff += l;
        break;
      }
      bytes -= l;
      if (start)
        start = 0;
    }
    if (dst.length > bufoff)
      return dst.slice(0, bufoff);
    return dst;
  };
  BufferList.prototype.shallowSlice = function shallowSlice(start, end) {
    start = start || 0;
    end = end || this.length;
    if (start < 0)
      start += this.length;
    if (end < 0)
      end += this.length;
    var startOffset = this._offset(start), endOffset = this._offset(end), buffers = this._bufs.slice(startOffset[0], endOffset[0] + 1);
    if (endOffset[1] == 0)
      buffers.pop();
    else
      buffers[buffers.length - 1] = buffers[buffers.length - 1].slice(0, endOffset[1]);
    if (startOffset[1] != 0)
      buffers[0] = buffers[0].slice(startOffset[1]);
    return new BufferList(buffers);
  };
  BufferList.prototype.toString = function toString(encoding, start, end) {
    return this.slice(start, end).toString(encoding);
  };
  BufferList.prototype.consume = function consume(bytes) {
    bytes = Math.trunc(bytes);
    if (Number.isNaN(bytes) || bytes <= 0)
      return this;
    while (this._bufs.length) {
      if (bytes >= this._bufs[0].length) {
        bytes -= this._bufs[0].length;
        this.length -= this._bufs[0].length;
        this._bufs.shift();
      } else {
        this._bufs[0] = this._bufs[0].slice(bytes);
        this.length -= bytes;
        break;
      }
    }
    return this;
  };
  BufferList.prototype.duplicate = function duplicate() {
    var i = 0, copy = new BufferList;
    for (;i < this._bufs.length; i++)
      copy.append(this._bufs[i]);
    return copy;
  };
  BufferList.prototype.destroy = function destroy() {
    this._bufs.length = 0;
    this.length = 0;
    this.push(null);
  };
  (function() {
    var methods = {
      readDoubleBE: 8,
      readDoubleLE: 8,
      readFloatBE: 4,
      readFloatLE: 4,
      readInt32BE: 4,
      readInt32LE: 4,
      readUInt32BE: 4,
      readUInt32LE: 4,
      readInt16BE: 2,
      readInt16LE: 2,
      readUInt16BE: 2,
      readUInt16LE: 2,
      readInt8: 1,
      readUInt8: 1
    };
    for (var m in methods) {
      (function(m2) {
        BufferList.prototype[m2] = function(offset) {
          return this.slice(offset, offset + methods[m2])[m2](0);
        };
      })(m);
    }
  })();
  module.exports = BufferList;
});

// node_modules/xtend/immutable.js
var require_immutable = __commonJS((exports, module) => {
  var extend = function() {
    var target = {};
    for (var i = 0;i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  module.exports = extend;
  var hasOwnProperty = Object.prototype.hasOwnProperty;
});

// node_modules/to-buffer/index.js
var require_to_buffer = __commonJS((exports, module) => {
  var bufferFrom = function(buf, enc) {
    return new Buffer(buf, enc);
  };
  var toBuffer = function(buf, enc) {
    if (Buffer.isBuffer(buf))
      return buf;
    if (typeof buf === "string")
      return makeBuffer(buf, enc);
    if (Array.isArray(buf))
      return makeBuffer(buf);
    throw new Error("Input should be a buffer or a string");
  };
  module.exports = toBuffer;
  var makeBuffer = Buffer.from && Buffer.from !== Uint8Array.from ? Buffer.from : bufferFrom;
});

// node_modules/buffer-fill/index.js
var require_buffer_fill = __commonJS((exports, module) => {
  var isSingleByte = function(val) {
    return val.length === 1 && val.charCodeAt(0) < 256;
  };
  var fillWithNumber = function(buffer, val, start, end) {
    if (start < 0 || end > buffer.length) {
      throw new RangeError("Out of range index");
    }
    start = start >>> 0;
    end = end === undefined ? buffer.length : end >>> 0;
    if (end > start) {
      buffer.fill(val, start, end);
    }
    return buffer;
  };
  var fillWithBuffer = function(buffer, val, start, end) {
    if (start < 0 || end > buffer.length) {
      throw new RangeError("Out of range index");
    }
    if (end <= start) {
      return buffer;
    }
    start = start >>> 0;
    end = end === undefined ? buffer.length : end >>> 0;
    var pos = start;
    var len = val.length;
    while (pos <= end - len) {
      val.copy(buffer, pos);
      pos += len;
    }
    if (pos !== end) {
      val.copy(buffer, pos, 0, end - pos);
    }
    return buffer;
  };
  var fill = function(buffer, val, start, end, encoding) {
    if (hasFullSupport) {
      return buffer.fill(val, start, end, encoding);
    }
    if (typeof val === "number") {
      return fillWithNumber(buffer, val, start, end);
    }
    if (typeof val === "string") {
      if (typeof start === "string") {
        encoding = start;
        start = 0;
        end = buffer.length;
      } else if (typeof end === "string") {
        encoding = end;
        end = buffer.length;
      }
      if (encoding !== undefined && typeof encoding !== "string") {
        throw new TypeError("encoding must be a string");
      }
      if (encoding === "latin1") {
        encoding = "binary";
      }
      if (typeof encoding === "string" && !Buffer.isEncoding(encoding)) {
        throw new TypeError("Unknown encoding: " + encoding);
      }
      if (val === "") {
        return fillWithNumber(buffer, 0, start, end);
      }
      if (isSingleByte(val)) {
        return fillWithNumber(buffer, val.charCodeAt(0), start, end);
      }
      val = new Buffer(val, encoding);
    }
    if (Buffer.isBuffer(val)) {
      return fillWithBuffer(buffer, val, start, end);
    }
    return fillWithNumber(buffer, 0, start, end);
  };
  var hasFullSupport = function() {
    try {
      if (!Buffer.isEncoding("latin1")) {
        return false;
      }
      var buf = Buffer.alloc ? Buffer.alloc(4) : new Buffer(4);
      buf.fill("ab", "ucs2");
      return buf.toString("hex") === "61006200";
    } catch (_) {
      return false;
    }
  }();
  module.exports = fill;
});

// node_modules/buffer-alloc-unsafe/index.js
var require_buffer_alloc_unsafe = __commonJS((exports, module) => {
  var allocUnsafe = function(size) {
    if (typeof size !== "number") {
      throw new TypeError('"size" argument must be a number');
    }
    if (size < 0) {
      throw new RangeError('"size" argument must not be negative');
    }
    if (Buffer.allocUnsafe) {
      return Buffer.allocUnsafe(size);
    } else {
      return new Buffer(size);
    }
  };
  module.exports = allocUnsafe;
});

// node_modules/buffer-alloc/index.js
var require_buffer_alloc = __commonJS((exports, module) => {
  var bufferFill = require_buffer_fill();
  var allocUnsafe = require_buffer_alloc_unsafe();
  module.exports = function alloc(size, fill, encoding) {
    if (typeof size !== "number") {
      throw new TypeError('"size" argument must be a number');
    }
    if (size < 0) {
      throw new RangeError('"size" argument must not be negative');
    }
    if (Buffer.alloc) {
      return Buffer.alloc(size, fill, encoding);
    }
    var buffer = allocUnsafe(size);
    if (size === 0) {
      return buffer;
    }
    if (fill === undefined) {
      return bufferFill(buffer, 0);
    }
    if (typeof encoding !== "string") {
      encoding = undefined;
    }
    return bufferFill(buffer, fill, encoding);
  };
});

// node_modules/tar-stream/headers.js
var require_headers = __commonJS((exports) => {
  var parse256 = function(buf) {
    var positive;
    if (buf[0] === 128)
      positive = true;
    else if (buf[0] === 255)
      positive = false;
    else
      return null;
    var zero = false;
    var tuple = [];
    for (var i = buf.length - 1;i > 0; i--) {
      var byte = buf[i];
      if (positive)
        tuple.push(byte);
      else if (zero && byte === 0)
        tuple.push(0);
      else if (zero) {
        zero = false;
        tuple.push(256 - byte);
      } else
        tuple.push(255 - byte);
    }
    var sum = 0;
    var l = tuple.length;
    for (i = 0;i < l; i++) {
      sum += tuple[i] * Math.pow(256, i);
    }
    return positive ? sum : -1 * sum;
  };
  var toBuffer = require_to_buffer();
  var alloc = require_buffer_alloc();
  var ZEROS = "0000000000000000000";
  var SEVENS = "7777777777777777777";
  var ZERO_OFFSET = "0".charCodeAt(0);
  var USTAR = "ustar\x0000";
  var MASK = parseInt("7777", 8);
  var clamp = function(index, len, defaultValue) {
    if (typeof index !== "number")
      return defaultValue;
    index = ~~index;
    if (index >= len)
      return len;
    if (index >= 0)
      return index;
    index += len;
    if (index >= 0)
      return index;
    return 0;
  };
  var toType = function(flag) {
    switch (flag) {
      case 0:
        return "file";
      case 1:
        return "link";
      case 2:
        return "symlink";
      case 3:
        return "character-device";
      case 4:
        return "block-device";
      case 5:
        return "directory";
      case 6:
        return "fifo";
      case 7:
        return "contiguous-file";
      case 72:
        return "pax-header";
      case 55:
        return "pax-global-header";
      case 27:
        return "gnu-long-link-path";
      case 28:
      case 30:
        return "gnu-long-path";
    }
    return null;
  };
  var toTypeflag = function(flag) {
    switch (flag) {
      case "file":
        return 0;
      case "link":
        return 1;
      case "symlink":
        return 2;
      case "character-device":
        return 3;
      case "block-device":
        return 4;
      case "directory":
        return 5;
      case "fifo":
        return 6;
      case "contiguous-file":
        return 7;
      case "pax-header":
        return 72;
    }
    return 0;
  };
  var indexOf = function(block, num, offset, end) {
    for (;offset < end; offset++) {
      if (block[offset] === num)
        return offset;
    }
    return end;
  };
  var cksum = function(block) {
    var sum = 8 * 32;
    for (var i = 0;i < 148; i++)
      sum += block[i];
    for (var j = 156;j < 512; j++)
      sum += block[j];
    return sum;
  };
  var encodeOct = function(val, n) {
    val = val.toString(8);
    if (val.length > n)
      return SEVENS.slice(0, n) + " ";
    else
      return ZEROS.slice(0, n - val.length) + val + " ";
  };
  var decodeOct = function(val, offset, length) {
    val = val.slice(offset, offset + length);
    offset = 0;
    if (val[offset] & 128) {
      return parse256(val);
    } else {
      while (offset < val.length && val[offset] === 32)
        offset++;
      var end = clamp(indexOf(val, 32, offset, val.length), val.length, val.length);
      while (offset < end && val[offset] === 0)
        offset++;
      if (end === offset)
        return 0;
      return parseInt(val.slice(offset, end).toString(), 8);
    }
  };
  var decodeStr = function(val, offset, length, encoding) {
    return val.slice(offset, indexOf(val, 0, offset, offset + length)).toString(encoding);
  };
  var addLength = function(str) {
    var len = Buffer.byteLength(str);
    var digits = Math.floor(Math.log(len) / Math.log(10)) + 1;
    if (len + digits >= Math.pow(10, digits))
      digits++;
    return len + digits + str;
  };
  exports.decodeLongPath = function(buf, encoding) {
    return decodeStr(buf, 0, buf.length, encoding);
  };
  exports.encodePax = function(opts) {
    var result = "";
    if (opts.name)
      result += addLength(" path=" + opts.name + "\n");
    if (opts.linkname)
      result += addLength(" linkpath=" + opts.linkname + "\n");
    var pax = opts.pax;
    if (pax) {
      for (var key in pax) {
        result += addLength(" " + key + "=" + pax[key] + "\n");
      }
    }
    return toBuffer(result);
  };
  exports.decodePax = function(buf) {
    var result = {};
    while (buf.length) {
      var i = 0;
      while (i < buf.length && buf[i] !== 32)
        i++;
      var len = parseInt(buf.slice(0, i).toString(), 10);
      if (!len)
        return result;
      var b = buf.slice(i + 1, len - 1).toString();
      var keyIndex = b.indexOf("=");
      if (keyIndex === -1)
        return result;
      result[b.slice(0, keyIndex)] = b.slice(keyIndex + 1);
      buf = buf.slice(len);
    }
    return result;
  };
  exports.encode = function(opts) {
    var buf = alloc(512);
    var name2 = opts.name;
    var prefix = "";
    if (opts.typeflag === 5 && name2[name2.length - 1] !== "/")
      name2 += "/";
    if (Buffer.byteLength(name2) !== name2.length)
      return null;
    while (Buffer.byteLength(name2) > 100) {
      var i = name2.indexOf("/");
      if (i === -1)
        return null;
      prefix += prefix ? "/" + name2.slice(0, i) : name2.slice(0, i);
      name2 = name2.slice(i + 1);
    }
    if (Buffer.byteLength(name2) > 100 || Buffer.byteLength(prefix) > 155)
      return null;
    if (opts.linkname && Buffer.byteLength(opts.linkname) > 100)
      return null;
    buf.write(name2);
    buf.write(encodeOct(opts.mode & MASK, 6), 100);
    buf.write(encodeOct(opts.uid, 6), 108);
    buf.write(encodeOct(opts.gid, 6), 116);
    buf.write(encodeOct(opts.size, 11), 124);
    buf.write(encodeOct(opts.mtime.getTime() / 1000 | 0, 11), 136);
    buf[156] = ZERO_OFFSET + toTypeflag(opts.type);
    if (opts.linkname)
      buf.write(opts.linkname, 157);
    buf.write(USTAR, 257);
    if (opts.uname)
      buf.write(opts.uname, 265);
    if (opts.gname)
      buf.write(opts.gname, 297);
    buf.write(encodeOct(opts.devmajor || 0, 6), 329);
    buf.write(encodeOct(opts.devminor || 0, 6), 337);
    if (prefix)
      buf.write(prefix, 345);
    buf.write(encodeOct(cksum(buf), 6), 148);
    return buf;
  };
  exports.decode = function(buf, filenameEncoding) {
    var typeflag = buf[156] === 0 ? 0 : buf[156] - ZERO_OFFSET;
    var name2 = decodeStr(buf, 0, 100, filenameEncoding);
    var mode = decodeOct(buf, 100, 8);
    var uid = decodeOct(buf, 108, 8);
    var gid = decodeOct(buf, 116, 8);
    var size = decodeOct(buf, 124, 12);
    var mtime = decodeOct(buf, 136, 12);
    var type = toType(typeflag);
    var linkname = buf[157] === 0 ? null : decodeStr(buf, 157, 100, filenameEncoding);
    var uname = decodeStr(buf, 265, 32);
    var gname = decodeStr(buf, 297, 32);
    var devmajor = decodeOct(buf, 329, 8);
    var devminor = decodeOct(buf, 337, 8);
    if (buf[345])
      name2 = decodeStr(buf, 345, 155, filenameEncoding) + "/" + name2;
    if (typeflag === 0 && name2 && name2[name2.length - 1] === "/")
      typeflag = 5;
    var c = cksum(buf);
    if (c === 8 * 32)
      return null;
    if (c !== decodeOct(buf, 148, 8))
      throw new Error("Invalid tar header. Maybe the tar is corrupted or it needs to be gunzipped?");
    return {
      name: name2,
      mode,
      uid,
      gid,
      size,
      mtime: new Date(1000 * mtime),
      type,
      linkname,
      uname,
      gname,
      devmajor,
      devminor
    };
  };
});

// node_modules/tar-stream/node_modules/readable-stream/lib/_stream_transform.js
var require__stream_transform = __commonJS((exports, module) => {
  var afterTransform = function(er, data) {
    var ts = this._transformState;
    ts.transforming = false;
    var cb = ts.writecb;
    if (!cb) {
      return this.emit("error", new Error("write callback called multiple times"));
    }
    ts.writechunk = null;
    ts.writecb = null;
    if (data != null)
      this.push(data);
    cb(er);
    var rs = this._readableState;
    rs.reading = false;
    if (rs.needReadable || rs.length < rs.highWaterMark) {
      this._read(rs.highWaterMark);
    }
  };
  var Transform = function(options) {
    if (!(this instanceof Transform))
      return new Transform(options);
    Duplex.call(this, options);
    this._transformState = {
      afterTransform: afterTransform.bind(this),
      needTransform: false,
      transforming: false,
      writecb: null,
      writechunk: null,
      writeencoding: null
    };
    this._readableState.needReadable = true;
    this._readableState.sync = false;
    if (options) {
      if (typeof options.transform === "function")
        this._transform = options.transform;
      if (typeof options.flush === "function")
        this._flush = options.flush;
    }
    this.on("prefinish", prefinish);
  };
  var prefinish = function() {
    var _this = this;
    if (typeof this._flush === "function") {
      this._flush(function(er, data) {
        done(_this, er, data);
      });
    } else {
      done(this, null, null);
    }
  };
  var done = function(stream2, er, data) {
    if (er)
      return stream2.emit("error", er);
    if (data != null)
      stream2.push(data);
    if (stream2._writableState.length)
      throw new Error("Calling transform done when ws.length != 0");
    if (stream2._transformState.transforming)
      throw new Error("Calling transform done when still transforming");
    return stream2.push(null);
  };
  module.exports = Transform;
  var Duplex = require__stream_duplex();
  var util = Object.create(require_util2());
  util.inherits = require_inherits_browser();
  util.inherits(Transform, Duplex);
  Transform.prototype.push = function(chunk, encoding) {
    this._transformState.needTransform = false;
    return Duplex.prototype.push.call(this, chunk, encoding);
  };
  Transform.prototype._transform = function(chunk, encoding, cb) {
    throw new Error("_transform() is not implemented");
  };
  Transform.prototype._write = function(chunk, encoding, cb) {
    var ts = this._transformState;
    ts.writecb = cb;
    ts.writechunk = chunk;
    ts.writeencoding = encoding;
    if (!ts.transforming) {
      var rs = this._readableState;
      if (ts.needTransform || rs.needReadable || rs.length < rs.highWaterMark)
        this._read(rs.highWaterMark);
    }
  };
  Transform.prototype._read = function(n) {
    var ts = this._transformState;
    if (ts.writechunk !== null && ts.writecb && !ts.transforming) {
      ts.transforming = true;
      this._transform(ts.writechunk, ts.writeencoding, ts.afterTransform);
    } else {
      ts.needTransform = true;
    }
  };
  Transform.prototype._destroy = function(err, cb) {
    var _this2 = this;
    Duplex.prototype._destroy.call(this, err, function(err2) {
      cb(err2);
      _this2.emit("close");
    });
  };
});

// node_modules/tar-stream/node_modules/readable-stream/lib/_stream_passthrough.js
var require__stream_passthrough = __commonJS((exports, module) => {
  var PassThrough = function(options) {
    if (!(this instanceof PassThrough))
      return new PassThrough(options);
    Transform.call(this, options);
  };
  module.exports = PassThrough;
  var Transform = require__stream_transform();
  var util = Object.create(require_util2());
  util.inherits = require_inherits_browser();
  util.inherits(PassThrough, Transform);
  PassThrough.prototype._transform = function(chunk, encoding, cb) {
    cb(null, chunk);
  };
});

// node_modules/tar-stream/node_modules/readable-stream/readable-browser.js
var require_readable_browser = __commonJS((exports, module) => {
  exports = module.exports = require__stream_readable();
  exports.Stream = exports;
  exports.Readable = exports;
  exports.Writable = require__stream_writable();
  exports.Duplex = require__stream_duplex();
  exports.Transform = require__stream_transform();
  exports.PassThrough = require__stream_passthrough();
});

// node_modules/tar-stream/extract.js
var require_extract = __commonJS((exports, module) => {
  var util = import.meta.require("util");
  var bl = require_bl();
  var xtend = require_immutable();
  var headers = require_headers();
  var Writable = require_readable_browser().Writable;
  var PassThrough = require_readable_browser().PassThrough;
  var noop2 = function() {
  };
  var overflow = function(size) {
    size &= 511;
    return size && 512 - size;
  };
  var emptyStream = function(self2, offset) {
    var s = new Source(self2, offset);
    s.end();
    return s;
  };
  var mixinPax = function(header, pax) {
    if (pax.path)
      header.name = pax.path;
    if (pax.linkpath)
      header.linkname = pax.linkpath;
    if (pax.size)
      header.size = parseInt(pax.size, 10);
    header.pax = pax;
    return header;
  };
  var Source = function(self2, offset) {
    this._parent = self2;
    this.offset = offset;
    PassThrough.call(this);
  };
  util.inherits(Source, PassThrough);
  Source.prototype.destroy = function(err) {
    this._parent.destroy(err);
  };
  var Extract = function(opts) {
    if (!(this instanceof Extract))
      return new Extract(opts);
    Writable.call(this, opts);
    opts = opts || {};
    this._offset = 0;
    this._buffer = bl();
    this._missing = 0;
    this._partial = false;
    this._onparse = noop2;
    this._header = null;
    this._stream = null;
    this._overflow = null;
    this._cb = null;
    this._locked = false;
    this._destroyed = false;
    this._pax = null;
    this._paxGlobal = null;
    this._gnuLongPath = null;
    this._gnuLongLinkPath = null;
    var self2 = this;
    var b = self2._buffer;
    var oncontinue = function() {
      self2._continue();
    };
    var onunlock = function(err) {
      self2._locked = false;
      if (err)
        return self2.destroy(err);
      if (!self2._stream)
        oncontinue();
    };
    var onstreamend = function() {
      self2._stream = null;
      var drain = overflow(self2._header.size);
      if (drain)
        self2._parse(drain, ondrain);
      else
        self2._parse(512, onheader);
      if (!self2._locked)
        oncontinue();
    };
    var ondrain = function() {
      self2._buffer.consume(overflow(self2._header.size));
      self2._parse(512, onheader);
      oncontinue();
    };
    var onpaxglobalheader = function() {
      var size = self2._header.size;
      self2._paxGlobal = headers.decodePax(b.slice(0, size));
      b.consume(size);
      onstreamend();
    };
    var onpaxheader = function() {
      var size = self2._header.size;
      self2._pax = headers.decodePax(b.slice(0, size));
      if (self2._paxGlobal)
        self2._pax = xtend(self2._paxGlobal, self2._pax);
      b.consume(size);
      onstreamend();
    };
    var ongnulongpath = function() {
      var size = self2._header.size;
      this._gnuLongPath = headers.decodeLongPath(b.slice(0, size), opts.filenameEncoding);
      b.consume(size);
      onstreamend();
    };
    var ongnulonglinkpath = function() {
      var size = self2._header.size;
      this._gnuLongLinkPath = headers.decodeLongPath(b.slice(0, size), opts.filenameEncoding);
      b.consume(size);
      onstreamend();
    };
    var onheader = function() {
      var offset = self2._offset;
      var header;
      try {
        header = self2._header = headers.decode(b.slice(0, 512), opts.filenameEncoding);
      } catch (err) {
        self2.emit("error", err);
      }
      b.consume(512);
      if (!header) {
        self2._parse(512, onheader);
        oncontinue();
        return;
      }
      if (header.type === "gnu-long-path") {
        self2._parse(header.size, ongnulongpath);
        oncontinue();
        return;
      }
      if (header.type === "gnu-long-link-path") {
        self2._parse(header.size, ongnulonglinkpath);
        oncontinue();
        return;
      }
      if (header.type === "pax-global-header") {
        self2._parse(header.size, onpaxglobalheader);
        oncontinue();
        return;
      }
      if (header.type === "pax-header") {
        self2._parse(header.size, onpaxheader);
        oncontinue();
        return;
      }
      if (self2._gnuLongPath) {
        header.name = self2._gnuLongPath;
        self2._gnuLongPath = null;
      }
      if (self2._gnuLongLinkPath) {
        header.linkname = self2._gnuLongLinkPath;
        self2._gnuLongLinkPath = null;
      }
      if (self2._pax) {
        self2._header = header = mixinPax(header, self2._pax);
        self2._pax = null;
      }
      self2._locked = true;
      if (!header.size || header.type === "directory") {
        self2._parse(512, onheader);
        self2.emit("entry", header, emptyStream(self2, offset), onunlock);
        return;
      }
      self2._stream = new Source(self2, offset);
      self2.emit("entry", header, self2._stream, onunlock);
      self2._parse(header.size, onstreamend);
      oncontinue();
    };
    this._onheader = onheader;
    this._parse(512, onheader);
  };
  util.inherits(Extract, Writable);
  Extract.prototype.destroy = function(err) {
    if (this._destroyed)
      return;
    this._destroyed = true;
    if (err)
      this.emit("error", err);
    this.emit("close");
    if (this._stream)
      this._stream.emit("close");
  };
  Extract.prototype._parse = function(size, onparse) {
    if (this._destroyed)
      return;
    this._offset += size;
    this._missing = size;
    if (onparse === this._onheader)
      this._partial = false;
    this._onparse = onparse;
  };
  Extract.prototype._continue = function() {
    if (this._destroyed)
      return;
    var cb = this._cb;
    this._cb = noop2;
    if (this._overflow)
      this._write(this._overflow, undefined, cb);
    else
      cb();
  };
  Extract.prototype._write = function(data, enc, cb) {
    if (this._destroyed)
      return;
    var s = this._stream;
    var b = this._buffer;
    var missing = this._missing;
    if (data.length)
      this._partial = true;
    if (data.length < missing) {
      this._missing -= data.length;
      this._overflow = null;
      if (s)
        return s.write(data, cb);
      b.append(data);
      return cb();
    }
    this._cb = cb;
    this._missing = 0;
    var overflow2 = null;
    if (data.length > missing) {
      overflow2 = data.slice(missing);
      data = data.slice(0, missing);
    }
    if (s)
      s.end(data);
    else
      b.append(data);
    this._overflow = overflow2;
    this._onparse();
  };
  Extract.prototype._final = function(cb) {
    if (this._partial)
      return this.destroy(new Error("Unexpected end of data"));
    cb();
  };
  module.exports = Extract;
});

// node_modules/wrappy/wrappy.js
var require_wrappy = __commonJS((exports, module) => {
  var wrappy = function(fn, cb) {
    if (fn && cb)
      return wrappy(fn)(cb);
    if (typeof fn !== "function")
      throw new TypeError("need wrapper function");
    Object.keys(fn).forEach(function(k) {
      wrapper[k] = fn[k];
    });
    return wrapper;
    function wrapper() {
      var args = new Array(arguments.length);
      for (var i = 0;i < args.length; i++) {
        args[i] = arguments[i];
      }
      var ret = fn.apply(this, args);
      var cb2 = args[args.length - 1];
      if (typeof ret === "function" && ret !== cb2) {
        Object.keys(cb2).forEach(function(k) {
          ret[k] = cb2[k];
        });
      }
      return ret;
    }
  };
  module.exports = wrappy;
});

// node_modules/once/once.js
var require_once = __commonJS((exports, module) => {
  var once = function(fn) {
    var f = function() {
      if (f.called)
        return f.value;
      f.called = true;
      return f.value = fn.apply(this, arguments);
    };
    f.called = false;
    return f;
  };
  var onceStrict = function(fn) {
    var f = function() {
      if (f.called)
        throw new Error(f.onceError);
      f.called = true;
      return f.value = fn.apply(this, arguments);
    };
    var name2 = fn.name || "Function wrapped with `once`";
    f.onceError = name2 + " shouldn't be called more than once";
    f.called = false;
    return f;
  };
  var wrappy = require_wrappy();
  module.exports = wrappy(once);
  module.exports.strict = wrappy(onceStrict);
  once.proto = once(function() {
    Object.defineProperty(Function.prototype, "once", {
      value: function() {
        return once(this);
      },
      configurable: true
    });
    Object.defineProperty(Function.prototype, "onceStrict", {
      value: function() {
        return onceStrict(this);
      },
      configurable: true
    });
  });
});

// node_modules/end-of-stream/index.js
var require_end_of_stream = __commonJS((exports, module) => {
  var once = require_once();
  var noop2 = function() {
  };
  var isRequest = function(stream2) {
    return stream2.setHeader && typeof stream2.abort === "function";
  };
  var isChildProcess = function(stream2) {
    return stream2.stdio && Array.isArray(stream2.stdio) && stream2.stdio.length === 3;
  };
  var eos = function(stream2, opts, callback) {
    if (typeof opts === "function")
      return eos(stream2, null, opts);
    if (!opts)
      opts = {};
    callback = once(callback || noop2);
    var ws = stream2._writableState;
    var rs = stream2._readableState;
    var readable = opts.readable || opts.readable !== false && stream2.readable;
    var writable = opts.writable || opts.writable !== false && stream2.writable;
    var cancelled = false;
    var onlegacyfinish = function() {
      if (!stream2.writable)
        onfinish();
    };
    var onfinish = function() {
      writable = false;
      if (!readable)
        callback.call(stream2);
    };
    var onend = function() {
      readable = false;
      if (!writable)
        callback.call(stream2);
    };
    var onexit = function(exitCode) {
      callback.call(stream2, exitCode ? new Error("exited with error code: " + exitCode) : null);
    };
    var onerror = function(err) {
      callback.call(stream2, err);
    };
    var onclose = function() {
      process.nextTick(onclosenexttick);
    };
    var onclosenexttick = function() {
      if (cancelled)
        return;
      if (readable && !(rs && (rs.ended && !rs.destroyed)))
        return callback.call(stream2, new Error("premature close"));
      if (writable && !(ws && (ws.ended && !ws.destroyed)))
        return callback.call(stream2, new Error("premature close"));
    };
    var onrequest = function() {
      stream2.req.on("finish", onfinish);
    };
    if (isRequest(stream2)) {
      stream2.on("complete", onfinish);
      stream2.on("abort", onclose);
      if (stream2.req)
        onrequest();
      else
        stream2.on("request", onrequest);
    } else if (writable && !ws) {
      stream2.on("end", onlegacyfinish);
      stream2.on("close", onlegacyfinish);
    }
    if (isChildProcess(stream2))
      stream2.on("exit", onexit);
    stream2.on("end", onend);
    stream2.on("finish", onfinish);
    if (opts.error !== false)
      stream2.on("error", onerror);
    stream2.on("close", onclose);
    return function() {
      cancelled = true;
      stream2.removeListener("complete", onfinish);
      stream2.removeListener("abort", onclose);
      stream2.removeListener("request", onrequest);
      if (stream2.req)
        stream2.req.removeListener("finish", onfinish);
      stream2.removeListener("end", onlegacyfinish);
      stream2.removeListener("close", onlegacyfinish);
      stream2.removeListener("finish", onfinish);
      stream2.removeListener("exit", onexit);
      stream2.removeListener("end", onend);
      stream2.removeListener("error", onerror);
      stream2.removeListener("close", onclose);
    };
  };
  module.exports = eos;
});

// node_modules/tar-stream/pack.js
var require_pack = __commonJS((exports, module) => {
  var modeToType = function(mode) {
    switch (mode & constants3.S_IFMT) {
      case constants3.S_IFBLK:
        return "block-device";
      case constants3.S_IFCHR:
        return "character-device";
      case constants3.S_IFDIR:
        return "directory";
      case constants3.S_IFIFO:
        return "fifo";
      case constants3.S_IFLNK:
        return "symlink";
    }
    return "file";
  };
  var constants3 = import.meta.require("constants");
  var eos = require_end_of_stream();
  var util = import.meta.require("util");
  var alloc = require_buffer_alloc();
  var toBuffer = require_to_buffer();
  var Readable = require_readable_browser().Readable;
  var Writable = require_readable_browser().Writable;
  var StringDecoder = import.meta.require("string_decoder").StringDecoder;
  var headers = require_headers();
  var DMODE = parseInt("755", 8);
  var FMODE = parseInt("644", 8);
  var END_OF_TAR = alloc(1024);
  var noop2 = function() {
  };
  var overflow = function(self2, size) {
    size &= 511;
    if (size)
      self2.push(END_OF_TAR.slice(0, 512 - size));
  };
  var Sink = function(to) {
    Writable.call(this);
    this.written = 0;
    this._to = to;
    this._destroyed = false;
  };
  util.inherits(Sink, Writable);
  Sink.prototype._write = function(data, enc, cb) {
    this.written += data.length;
    if (this._to.push(data))
      return cb();
    this._to._drain = cb;
  };
  Sink.prototype.destroy = function() {
    if (this._destroyed)
      return;
    this._destroyed = true;
    this.emit("close");
  };
  var LinkSink = function() {
    Writable.call(this);
    this.linkname = "";
    this._decoder = new StringDecoder("utf-8");
    this._destroyed = false;
  };
  util.inherits(LinkSink, Writable);
  LinkSink.prototype._write = function(data, enc, cb) {
    this.linkname += this._decoder.write(data);
    cb();
  };
  LinkSink.prototype.destroy = function() {
    if (this._destroyed)
      return;
    this._destroyed = true;
    this.emit("close");
  };
  var Void = function() {
    Writable.call(this);
    this._destroyed = false;
  };
  util.inherits(Void, Writable);
  Void.prototype._write = function(data, enc, cb) {
    cb(new Error("No body allowed for this entry"));
  };
  Void.prototype.destroy = function() {
    if (this._destroyed)
      return;
    this._destroyed = true;
    this.emit("close");
  };
  var Pack = function(opts) {
    if (!(this instanceof Pack))
      return new Pack(opts);
    Readable.call(this, opts);
    this._drain = noop2;
    this._finalized = false;
    this._finalizing = false;
    this._destroyed = false;
    this._stream = null;
  };
  util.inherits(Pack, Readable);
  Pack.prototype.entry = function(header, buffer, callback) {
    if (this._stream)
      throw new Error("already piping an entry");
    if (this._finalized || this._destroyed)
      return;
    if (typeof buffer === "function") {
      callback = buffer;
      buffer = null;
    }
    if (!callback)
      callback = noop2;
    var self2 = this;
    if (!header.size || header.type === "symlink")
      header.size = 0;
    if (!header.type)
      header.type = modeToType(header.mode);
    if (!header.mode)
      header.mode = header.type === "directory" ? DMODE : FMODE;
    if (!header.uid)
      header.uid = 0;
    if (!header.gid)
      header.gid = 0;
    if (!header.mtime)
      header.mtime = new Date;
    if (typeof buffer === "string")
      buffer = toBuffer(buffer);
    if (Buffer.isBuffer(buffer)) {
      header.size = buffer.length;
      this._encode(header);
      this.push(buffer);
      overflow(self2, header.size);
      process.nextTick(callback);
      return new Void;
    }
    if (header.type === "symlink" && !header.linkname) {
      var linkSink = new LinkSink;
      eos(linkSink, function(err) {
        if (err) {
          self2.destroy();
          return callback(err);
        }
        header.linkname = linkSink.linkname;
        self2._encode(header);
        callback();
      });
      return linkSink;
    }
    this._encode(header);
    if (header.type !== "file" && header.type !== "contiguous-file") {
      process.nextTick(callback);
      return new Void;
    }
    var sink = new Sink(this);
    this._stream = sink;
    eos(sink, function(err) {
      self2._stream = null;
      if (err) {
        self2.destroy();
        return callback(err);
      }
      if (sink.written !== header.size) {
        self2.destroy();
        return callback(new Error("size mismatch"));
      }
      overflow(self2, header.size);
      if (self2._finalizing)
        self2.finalize();
      callback();
    });
    return sink;
  };
  Pack.prototype.finalize = function() {
    if (this._stream) {
      this._finalizing = true;
      return;
    }
    if (this._finalized)
      return;
    this._finalized = true;
    this.push(END_OF_TAR);
    this.push(null);
  };
  Pack.prototype.destroy = function(err) {
    if (this._destroyed)
      return;
    this._destroyed = true;
    if (err)
      this.emit("error", err);
    this.emit("close");
    if (this._stream && this._stream.destroy)
      this._stream.destroy();
  };
  Pack.prototype._encode = function(header) {
    if (!header.pax) {
      var buf = headers.encode(header);
      if (buf) {
        this.push(buf);
        return;
      }
    }
    this._encodePax(header);
  };
  Pack.prototype._encodePax = function(header) {
    var paxHeader = headers.encodePax({
      name: header.name,
      linkname: header.linkname,
      pax: header.pax
    });
    var newHeader = {
      name: "PaxHeader",
      mode: header.mode,
      uid: header.uid,
      gid: header.gid,
      size: paxHeader.length,
      mtime: header.mtime,
      type: "pax-header",
      linkname: header.linkname && "PaxHeader",
      uname: header.uname,
      gname: header.gname,
      devmajor: header.devmajor,
      devminor: header.devminor
    };
    this.push(headers.encode(newHeader));
    this.push(paxHeader);
    overflow(this, paxHeader.length);
    newHeader.size = header.size;
    newHeader.type = header.type;
    this.push(headers.encode(newHeader));
  };
  Pack.prototype._read = function(n) {
    var drain = this._drain;
    this._drain = noop2;
    drain();
  };
  module.exports = Pack;
});

// node_modules/tar-stream/index.js
var require_tar_stream = __commonJS((exports) => {
  exports.extract = require_extract();
  exports.pack = require_pack();
});

// node_modules/decompress-tar/index.js
var require_decompress_tar = __commonJS((exports, module) => {
  var fileType = require_file_type2();
  var isStream2 = require_is_stream();
  var tarStream = require_tar_stream();
  module.exports = () => (input) => {
    if (!Buffer.isBuffer(input) && !isStream2(input)) {
      return Promise.reject(new TypeError(`Expected a Buffer or Stream, got ${typeof input}`));
    }
    if (Buffer.isBuffer(input) && (!fileType(input) || fileType(input).ext !== "tar")) {
      return Promise.resolve([]);
    }
    const extract = tarStream.extract();
    const files = [];
    extract.on("entry", (header, stream2, cb) => {
      const chunk = [];
      stream2.on("data", (data) => chunk.push(data));
      stream2.on("end", () => {
        const file = {
          data: Buffer.concat(chunk),
          mode: header.mode,
          mtime: header.mtime,
          path: header.name,
          type: header.type
        };
        if (header.type === "symlink" || header.type === "link") {
          file.linkname = header.linkname;
        }
        files.push(file);
        cb();
      });
    });
    const promise2 = new Promise((resolve2, reject) => {
      if (!Buffer.isBuffer(input)) {
        input.on("error", reject);
      }
      extract.on("finish", () => resolve2(files));
      extract.on("error", reject);
    });
    extract.then = promise2.then.bind(promise2);
    extract.catch = promise2.catch.bind(promise2);
    if (Buffer.isBuffer(input)) {
      extract.end(input);
    } else {
      input.pipe(extract);
    }
    return extract;
  };
});

// node_modules/decompress-tarbz2/node_modules/file-type/index.js
var require_file_type3 = __commonJS((exports, module) => {
  var toBytes = (s) => Array.from(s).map((c) => c.charCodeAt(0));
  var xpiZipFilename = toBytes("META-INF/mozilla.rsa");
  var oxmlContentTypes = toBytes("[Content_Types].xml");
  var oxmlRels = toBytes("_rels/.rels");
  module.exports = (input) => {
    const buf = new Uint8Array(input);
    if (!(buf && buf.length > 1)) {
      return null;
    }
    const check = (header, opts) => {
      opts = Object.assign({
        offset: 0
      }, opts);
      for (let i = 0;i < header.length; i++) {
        if (opts.mask) {
          if (header[i] !== (opts.mask[i] & buf[i + opts.offset])) {
            return false;
          }
        } else if (header[i] !== buf[i + opts.offset]) {
          return false;
        }
      }
      return true;
    };
    if (check([255, 216, 255])) {
      return {
        ext: "jpg",
        mime: "image/jpeg"
      };
    }
    if (check([137, 80, 78, 71, 13, 10, 26, 10])) {
      return {
        ext: "png",
        mime: "image/png"
      };
    }
    if (check([71, 73, 70])) {
      return {
        ext: "gif",
        mime: "image/gif"
      };
    }
    if (check([87, 69, 66, 80], { offset: 8 })) {
      return {
        ext: "webp",
        mime: "image/webp"
      };
    }
    if (check([70, 76, 73, 70])) {
      return {
        ext: "flif",
        mime: "image/flif"
      };
    }
    if ((check([73, 73, 42, 0]) || check([77, 77, 0, 42])) && check([67, 82], { offset: 8 })) {
      return {
        ext: "cr2",
        mime: "image/x-canon-cr2"
      };
    }
    if (check([73, 73, 42, 0]) || check([77, 77, 0, 42])) {
      return {
        ext: "tif",
        mime: "image/tiff"
      };
    }
    if (check([66, 77])) {
      return {
        ext: "bmp",
        mime: "image/bmp"
      };
    }
    if (check([73, 73, 188])) {
      return {
        ext: "jxr",
        mime: "image/vnd.ms-photo"
      };
    }
    if (check([56, 66, 80, 83])) {
      return {
        ext: "psd",
        mime: "image/vnd.adobe.photoshop"
      };
    }
    if (check([80, 75, 3, 4])) {
      if (check([109, 105, 109, 101, 116, 121, 112, 101, 97, 112, 112, 108, 105, 99, 97, 116, 105, 111, 110, 47, 101, 112, 117, 98, 43, 122, 105, 112], { offset: 30 })) {
        return {
          ext: "epub",
          mime: "application/epub+zip"
        };
      }
      if (check(xpiZipFilename, { offset: 30 })) {
        return {
          ext: "xpi",
          mime: "application/x-xpinstall"
        };
      }
      if (check(oxmlContentTypes, { offset: 30 }) || check(oxmlRels, { offset: 30 })) {
        const sliced = buf.subarray(4, 4 + 2000);
        const nextZipHeaderIndex = (arr) => arr.findIndex((el, i, arr2) => arr2[i] === 80 && arr2[i + 1] === 75 && arr2[i + 2] === 3 && arr2[i + 3] === 4);
        const header2Pos = nextZipHeaderIndex(sliced);
        if (header2Pos !== -1) {
          const slicedAgain = buf.subarray(header2Pos + 8, header2Pos + 8 + 1000);
          const header3Pos = nextZipHeaderIndex(slicedAgain);
          if (header3Pos !== -1) {
            const offset = 8 + header2Pos + header3Pos + 30;
            if (check(toBytes("word/"), { offset })) {
              return {
                ext: "docx",
                mime: "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              };
            }
            if (check(toBytes("ppt/"), { offset })) {
              return {
                ext: "pptx",
                mime: "application/vnd.openxmlformats-officedocument.presentationml.presentation"
              };
            }
            if (check(toBytes("xl/"), { offset })) {
              return {
                ext: "xlsx",
                mime: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              };
            }
          }
        }
      }
    }
    if (check([80, 75]) && (buf[2] === 3 || buf[2] === 5 || buf[2] === 7) && (buf[3] === 4 || buf[3] === 6 || buf[3] === 8)) {
      return {
        ext: "zip",
        mime: "application/zip"
      };
    }
    if (check([117, 115, 116, 97, 114], { offset: 257 })) {
      return {
        ext: "tar",
        mime: "application/x-tar"
      };
    }
    if (check([82, 97, 114, 33, 26, 7]) && (buf[6] === 0 || buf[6] === 1)) {
      return {
        ext: "rar",
        mime: "application/x-rar-compressed"
      };
    }
    if (check([31, 139, 8])) {
      return {
        ext: "gz",
        mime: "application/gzip"
      };
    }
    if (check([66, 90, 104])) {
      return {
        ext: "bz2",
        mime: "application/x-bzip2"
      };
    }
    if (check([55, 122, 188, 175, 39, 28])) {
      return {
        ext: "7z",
        mime: "application/x-7z-compressed"
      };
    }
    if (check([120, 1])) {
      return {
        ext: "dmg",
        mime: "application/x-apple-diskimage"
      };
    }
    if (check([51, 103, 112, 53]) || check([0, 0, 0]) && check([102, 116, 121, 112], { offset: 4 }) && (check([109, 112, 52, 49], { offset: 8 }) || check([109, 112, 52, 50], { offset: 8 }) || check([105, 115, 111, 109], { offset: 8 }) || check([105, 115, 111, 50], { offset: 8 }) || check([109, 109, 112, 52], { offset: 8 }) || check([77, 52, 86], { offset: 8 }) || check([100, 97, 115, 104], { offset: 8 }))) {
      return {
        ext: "mp4",
        mime: "video/mp4"
      };
    }
    if (check([77, 84, 104, 100])) {
      return {
        ext: "mid",
        mime: "audio/midi"
      };
    }
    if (check([26, 69, 223, 163])) {
      const sliced = buf.subarray(4, 4 + 4096);
      const idPos = sliced.findIndex((el, i, arr) => arr[i] === 66 && arr[i + 1] === 130);
      if (idPos !== -1) {
        const docTypePos = idPos + 3;
        const findDocType = (type) => Array.from(type).every((c, i) => sliced[docTypePos + i] === c.charCodeAt(0));
        if (findDocType("matroska")) {
          return {
            ext: "mkv",
            mime: "video/x-matroska"
          };
        }
        if (findDocType("webm")) {
          return {
            ext: "webm",
            mime: "video/webm"
          };
        }
      }
    }
    if (check([0, 0, 0, 20, 102, 116, 121, 112, 113, 116, 32, 32]) || check([102, 114, 101, 101], { offset: 4 }) || check([102, 116, 121, 112, 113, 116, 32, 32], { offset: 4 }) || check([109, 100, 97, 116], { offset: 4 }) || check([119, 105, 100, 101], { offset: 4 })) {
      return {
        ext: "mov",
        mime: "video/quicktime"
      };
    }
    if (check([82, 73, 70, 70]) && check([65, 86, 73], { offset: 8 })) {
      return {
        ext: "avi",
        mime: "video/x-msvideo"
      };
    }
    if (check([48, 38, 178, 117, 142, 102, 207, 17, 166, 217])) {
      return {
        ext: "wmv",
        mime: "video/x-ms-wmv"
      };
    }
    if (check([0, 0, 1, 186])) {
      return {
        ext: "mpg",
        mime: "video/mpeg"
      };
    }
    for (let start = 0;start < 2 && start < buf.length - 16; start++) {
      if (check([73, 68, 51], { offset: start }) || check([255, 226], { offset: start, mask: [255, 226] })) {
        return {
          ext: "mp3",
          mime: "audio/mpeg"
        };
      }
    }
    if (check([102, 116, 121, 112, 77, 52, 65], { offset: 4 }) || check([77, 52, 65, 32])) {
      return {
        ext: "m4a",
        mime: "audio/m4a"
      };
    }
    if (check([79, 112, 117, 115, 72, 101, 97, 100], { offset: 28 })) {
      return {
        ext: "opus",
        mime: "audio/opus"
      };
    }
    if (check([79, 103, 103, 83])) {
      return {
        ext: "ogg",
        mime: "audio/ogg"
      };
    }
    if (check([102, 76, 97, 67])) {
      return {
        ext: "flac",
        mime: "audio/x-flac"
      };
    }
    if (check([82, 73, 70, 70]) && check([87, 65, 86, 69], { offset: 8 })) {
      return {
        ext: "wav",
        mime: "audio/x-wav"
      };
    }
    if (check([35, 33, 65, 77, 82, 10])) {
      return {
        ext: "amr",
        mime: "audio/amr"
      };
    }
    if (check([37, 80, 68, 70])) {
      return {
        ext: "pdf",
        mime: "application/pdf"
      };
    }
    if (check([77, 90])) {
      return {
        ext: "exe",
        mime: "application/x-msdownload"
      };
    }
    if ((buf[0] === 67 || buf[0] === 70) && check([87, 83], { offset: 1 })) {
      return {
        ext: "swf",
        mime: "application/x-shockwave-flash"
      };
    }
    if (check([123, 92, 114, 116, 102])) {
      return {
        ext: "rtf",
        mime: "application/rtf"
      };
    }
    if (check([0, 97, 115, 109])) {
      return {
        ext: "wasm",
        mime: "application/wasm"
      };
    }
    if (check([119, 79, 70, 70]) && (check([0, 1, 0, 0], { offset: 4 }) || check([79, 84, 84, 79], { offset: 4 }))) {
      return {
        ext: "woff",
        mime: "font/woff"
      };
    }
    if (check([119, 79, 70, 50]) && (check([0, 1, 0, 0], { offset: 4 }) || check([79, 84, 84, 79], { offset: 4 }))) {
      return {
        ext: "woff2",
        mime: "font/woff2"
      };
    }
    if (check([76, 80], { offset: 34 }) && (check([0, 0, 1], { offset: 8 }) || check([1, 0, 2], { offset: 8 }) || check([2, 0, 2], { offset: 8 }))) {
      return {
        ext: "eot",
        mime: "application/octet-stream"
      };
    }
    if (check([0, 1, 0, 0, 0])) {
      return {
        ext: "ttf",
        mime: "font/ttf"
      };
    }
    if (check([79, 84, 84, 79, 0])) {
      return {
        ext: "otf",
        mime: "font/otf"
      };
    }
    if (check([0, 0, 1, 0])) {
      return {
        ext: "ico",
        mime: "image/x-icon"
      };
    }
    if (check([70, 76, 86, 1])) {
      return {
        ext: "flv",
        mime: "video/x-flv"
      };
    }
    if (check([37, 33])) {
      return {
        ext: "ps",
        mime: "application/postscript"
      };
    }
    if (check([253, 55, 122, 88, 90, 0])) {
      return {
        ext: "xz",
        mime: "application/x-xz"
      };
    }
    if (check([83, 81, 76, 105])) {
      return {
        ext: "sqlite",
        mime: "application/x-sqlite3"
      };
    }
    if (check([78, 69, 83, 26])) {
      return {
        ext: "nes",
        mime: "application/x-nintendo-nes-rom"
      };
    }
    if (check([67, 114, 50, 52])) {
      return {
        ext: "crx",
        mime: "application/x-google-chrome-extension"
      };
    }
    if (check([77, 83, 67, 70]) || check([73, 83, 99, 40])) {
      return {
        ext: "cab",
        mime: "application/vnd.ms-cab-compressed"
      };
    }
    if (check([33, 60, 97, 114, 99, 104, 62, 10, 100, 101, 98, 105, 97, 110, 45, 98, 105, 110, 97, 114, 121])) {
      return {
        ext: "deb",
        mime: "application/x-deb"
      };
    }
    if (check([33, 60, 97, 114, 99, 104, 62])) {
      return {
        ext: "ar",
        mime: "application/x-unix-archive"
      };
    }
    if (check([237, 171, 238, 219])) {
      return {
        ext: "rpm",
        mime: "application/x-rpm"
      };
    }
    if (check([31, 160]) || check([31, 157])) {
      return {
        ext: "Z",
        mime: "application/x-compress"
      };
    }
    if (check([76, 90, 73, 80])) {
      return {
        ext: "lz",
        mime: "application/x-lzip"
      };
    }
    if (check([208, 207, 17, 224, 161, 177, 26, 225])) {
      return {
        ext: "msi",
        mime: "application/x-msi"
      };
    }
    if (check([6, 14, 43, 52, 2, 5, 1, 1, 13, 1, 2, 1, 1, 2])) {
      return {
        ext: "mxf",
        mime: "application/mxf"
      };
    }
    if (check([71], { offset: 4 }) && (check([71], { offset: 192 }) || check([71], { offset: 196 }))) {
      return {
        ext: "mts",
        mime: "video/mp2t"
      };
    }
    if (check([66, 76, 69, 78, 68, 69, 82])) {
      return {
        ext: "blend",
        mime: "application/x-blender"
      };
    }
    if (check([66, 80, 71, 251])) {
      return {
        ext: "bpg",
        mime: "image/bpg"
      };
    }
    return null;
  };
});

// node_modules/decompress-tarbz2/node_modules/is-stream/index.js
var require_is_stream2 = __commonJS((exports, module) => {
  var isStream2 = module.exports = function(stream2) {
    return stream2 !== null && typeof stream2 === "object" && typeof stream2.pipe === "function";
  };
  isStream2.writable = function(stream2) {
    return isStream2(stream2) && stream2.writable !== false && typeof stream2._write === "function" && typeof stream2._writableState === "object";
  };
  isStream2.readable = function(stream2) {
    return isStream2(stream2) && stream2.readable !== false && typeof stream2._read === "function" && typeof stream2._readableState === "object";
  };
  isStream2.duplex = function(stream2) {
    return isStream2.writable(stream2) && isStream2.readable(stream2);
  };
  isStream2.transform = function(stream2) {
    return isStream2.duplex(stream2) && typeof stream2._transform === "function" && typeof stream2._transformState === "object";
  };
});

// node_modules/seek-bzip/lib/bitreader.js
var require_bitreader = __commonJS((exports, module) => {
  var BITMASK = [0, 1, 3, 7, 15, 31, 63, 127, 255];
  var BitReader = function(stream2) {
    this.stream = stream2;
    this.bitOffset = 0;
    this.curByte = 0;
    this.hasByte = false;
  };
  BitReader.prototype._ensureByte = function() {
    if (!this.hasByte) {
      this.curByte = this.stream.readByte();
      this.hasByte = true;
    }
  };
  BitReader.prototype.read = function(bits) {
    var result = 0;
    while (bits > 0) {
      this._ensureByte();
      var remaining = 8 - this.bitOffset;
      if (bits >= remaining) {
        result <<= remaining;
        result |= BITMASK[remaining] & this.curByte;
        this.hasByte = false;
        this.bitOffset = 0;
        bits -= remaining;
      } else {
        result <<= bits;
        var shift = remaining - bits;
        result |= (this.curByte & BITMASK[bits] << shift) >> shift;
        this.bitOffset += bits;
        bits = 0;
      }
    }
    return result;
  };
  BitReader.prototype.seek = function(pos) {
    var n_bit = pos % 8;
    var n_byte = (pos - n_bit) / 8;
    this.bitOffset = n_bit;
    this.stream.seek(n_byte);
    this.hasByte = false;
  };
  BitReader.prototype.pi = function() {
    var buf = new Buffer(6), i;
    for (i = 0;i < buf.length; i++) {
      buf[i] = this.read(8);
    }
    return buf.toString("hex");
  };
  module.exports = BitReader;
});

// node_modules/seek-bzip/lib/stream.js
var require_stream = __commonJS((exports, module) => {
  var Stream = function() {
  };
  Stream.prototype.readByte = function() {
    throw new Error("abstract method readByte() not implemented");
  };
  Stream.prototype.read = function(buffer, bufOffset, length) {
    var bytesRead = 0;
    while (bytesRead < length) {
      var c = this.readByte();
      if (c < 0) {
        return bytesRead === 0 ? -1 : bytesRead;
      }
      buffer[bufOffset++] = c;
      bytesRead++;
    }
    return bytesRead;
  };
  Stream.prototype.seek = function(new_pos) {
    throw new Error("abstract method seek() not implemented");
  };
  Stream.prototype.writeByte = function(_byte) {
    throw new Error("abstract method readByte() not implemented");
  };
  Stream.prototype.write = function(buffer, bufOffset, length) {
    var i;
    for (i = 0;i < length; i++) {
      this.writeByte(buffer[bufOffset++]);
    }
    return length;
  };
  Stream.prototype.flush = function() {
  };
  module.exports = Stream;
});

// node_modules/seek-bzip/lib/crc32.js
var require_crc32 = __commonJS((exports, module) => {
  module.exports = function() {
    var crc32Lookup = new Uint32Array([
      0,
      79764919,
      159529838,
      222504665,
      319059676,
      398814059,
      445009330,
      507990021,
      638119352,
      583659535,
      797628118,
      726387553,
      890018660,
      835552979,
      1015980042,
      944750013,
      1276238704,
      1221641927,
      1167319070,
      1095957929,
      1595256236,
      1540665371,
      1452775106,
      1381403509,
      1780037320,
      1859660671,
      1671105958,
      1733955601,
      2031960084,
      2111593891,
      1889500026,
      1952343757,
      2552477408,
      2632100695,
      2443283854,
      2506133561,
      2334638140,
      2414271883,
      2191915858,
      2254759653,
      3190512472,
      3135915759,
      3081330742,
      3009969537,
      2905550212,
      2850959411,
      2762807018,
      2691435357,
      3560074640,
      3505614887,
      3719321342,
      3648080713,
      3342211916,
      3287746299,
      3467911202,
      3396681109,
      4063920168,
      4143685023,
      4223187782,
      4286162673,
      3779000052,
      3858754371,
      3904687514,
      3967668269,
      881225847,
      809987520,
      1023691545,
      969234094,
      662832811,
      591600412,
      771767749,
      717299826,
      311336399,
      374308984,
      453813921,
      533576470,
      25881363,
      88864420,
      134795389,
      214552010,
      2023205639,
      2086057648,
      1897238633,
      1976864222,
      1804852699,
      1867694188,
      1645340341,
      1724971778,
      1587496639,
      1516133128,
      1461550545,
      1406951526,
      1302016099,
      1230646740,
      1142491917,
      1087903418,
      2896545431,
      2825181984,
      2770861561,
      2716262478,
      3215044683,
      3143675388,
      3055782693,
      3001194130,
      2326604591,
      2389456536,
      2200899649,
      2280525302,
      2578013683,
      2640855108,
      2418763421,
      2498394922,
      3769900519,
      3832873040,
      3912640137,
      3992402750,
      4088425275,
      4151408268,
      4197601365,
      4277358050,
      3334271071,
      3263032808,
      3476998961,
      3422541446,
      3585640067,
      3514407732,
      3694837229,
      3640369242,
      1762451694,
      1842216281,
      1619975040,
      1682949687,
      2047383090,
      2127137669,
      1938468188,
      2001449195,
      1325665622,
      1271206113,
      1183200824,
      1111960463,
      1543535498,
      1489069629,
      1434599652,
      1363369299,
      622672798,
      568075817,
      748617968,
      677256519,
      907627842,
      853037301,
      1067152940,
      995781531,
      51762726,
      131386257,
      177728840,
      240578815,
      269590778,
      349224269,
      429104020,
      491947555,
      4046411278,
      4126034873,
      4172115296,
      4234965207,
      3794477266,
      3874110821,
      3953728444,
      4016571915,
      3609705398,
      3555108353,
      3735388376,
      3664026991,
      3290680682,
      3236090077,
      3449943556,
      3378572211,
      3174993278,
      3120533705,
      3032266256,
      2961025959,
      2923101090,
      2868635157,
      2813903052,
      2742672763,
      2604032198,
      2683796849,
      2461293480,
      2524268063,
      2284983834,
      2364738477,
      2175806836,
      2238787779,
      1569362073,
      1498123566,
      1409854455,
      1355396672,
      1317987909,
      1246755826,
      1192025387,
      1137557660,
      2072149281,
      2135122070,
      1912620623,
      1992383480,
      1753615357,
      1816598090,
      1627664531,
      1707420964,
      295390185,
      358241886,
      404320391,
      483945776,
      43990325,
      106832002,
      186451547,
      266083308,
      932423249,
      861060070,
      1041341759,
      986742920,
      613929101,
      542559546,
      756411363,
      701822548,
      3316196985,
      3244833742,
      3425377559,
      3370778784,
      3601682597,
      3530312978,
      3744426955,
      3689838204,
      3819031489,
      3881883254,
      3928223919,
      4007849240,
      4037393693,
      4100235434,
      4180117107,
      4259748804,
      2310601993,
      2373574846,
      2151335527,
      2231098320,
      2596047829,
      2659030626,
      2470359227,
      2550115596,
      2947551409,
      2876312838,
      2788305887,
      2733848168,
      3165939309,
      3094707162,
      3040238851,
      2985771188
    ]);
    var CRC32 = function() {
      var crc = 4294967295;
      this.getCRC = function() {
        return ~crc >>> 0;
      };
      this.updateCRC = function(value) {
        crc = crc << 8 ^ crc32Lookup[(crc >>> 24 ^ value) & 255];
      };
      this.updateCRCRun = function(value, count) {
        while (count-- > 0) {
          crc = crc << 8 ^ crc32Lookup[(crc >>> 24 ^ value) & 255];
        }
      };
    };
    return CRC32;
  }();
});

// node_modules/seek-bzip/package.json
var require_package = __commonJS((exports, module) => {
  module.exports = {
    name: "seek-bzip",
    version: "1.0.6",
    contributors: [
      "C. Scott Ananian (http://cscott.net)",
      "Eli Skeggs",
      "Kevin Kwok",
      "Rob Landley (http://landley.net)"
    ],
    description: "a pure-JavaScript Node.JS module for random-access decoding bzip2 data",
    main: "./lib/index.js",
    repository: {
      type: "git",
      url: "https://github.com/cscott/seek-bzip.git"
    },
    license: "MIT",
    bin: {
      "seek-bunzip": "./bin/seek-bunzip",
      "seek-table": "./bin/seek-bzip-table"
    },
    directories: {
      test: "test"
    },
    dependencies: {
      commander: "^2.8.1"
    },
    devDependencies: {
      fibers: "~1.0.6",
      mocha: "~2.2.5"
    },
    scripts: {
      test: "mocha"
    }
  };
});

// node_modules/seek-bzip/lib/index.js
var require_lib = __commonJS((exports, module) => {
  var BitReader = require_bitreader();
  var Stream = require_stream();
  var CRC32 = require_crc32();
  var pjson = require_package();
  var MAX_HUFCODE_BITS = 20;
  var MAX_SYMBOLS = 258;
  var SYMBOL_RUNA = 0;
  var SYMBOL_RUNB = 1;
  var MIN_GROUPS = 2;
  var MAX_GROUPS = 6;
  var GROUP_SIZE = 50;
  var WHOLEPI = "314159265359";
  var SQRTPI = "177245385090";
  var mtf = function(array, index) {
    var src = array[index], i;
    for (i = index;i > 0; i--) {
      array[i] = array[i - 1];
    }
    array[0] = src;
    return src;
  };
  var Err = {
    OK: 0,
    LAST_BLOCK: -1,
    NOT_BZIP_DATA: -2,
    UNEXPECTED_INPUT_EOF: -3,
    UNEXPECTED_OUTPUT_EOF: -4,
    DATA_ERROR: -5,
    OUT_OF_MEMORY: -6,
    OBSOLETE_INPUT: -7,
    END_OF_BLOCK: -8
  };
  var ErrorMessages = {};
  ErrorMessages[Err.LAST_BLOCK] = "Bad file checksum";
  ErrorMessages[Err.NOT_BZIP_DATA] = "Not bzip data";
  ErrorMessages[Err.UNEXPECTED_INPUT_EOF] = "Unexpected input EOF";
  ErrorMessages[Err.UNEXPECTED_OUTPUT_EOF] = "Unexpected output EOF";
  ErrorMessages[Err.DATA_ERROR] = "Data error";
  ErrorMessages[Err.OUT_OF_MEMORY] = "Out of memory";
  ErrorMessages[Err.OBSOLETE_INPUT] = "Obsolete (pre 0.9.5) bzip format not supported.";
  var _throw = function(status, optDetail) {
    var msg = ErrorMessages[status] || "unknown error";
    if (optDetail) {
      msg += ": " + optDetail;
    }
    var e = new TypeError(msg);
    e.errorCode = status;
    throw e;
  };
  var Bunzip = function(inputStream, outputStream) {
    this.writePos = this.writeCurrent = this.writeCount = 0;
    this._start_bunzip(inputStream, outputStream);
  };
  Bunzip.prototype._init_block = function() {
    var moreBlocks = this._get_next_block();
    if (!moreBlocks) {
      this.writeCount = -1;
      return false;
    }
    this.blockCRC = new CRC32;
    return true;
  };
  Bunzip.prototype._start_bunzip = function(inputStream, outputStream) {
    var buf = new Buffer(4);
    if (inputStream.read(buf, 0, 4) !== 4 || String.fromCharCode(buf[0], buf[1], buf[2]) !== "BZh")
      _throw(Err.NOT_BZIP_DATA, "bad magic");
    var level = buf[3] - 48;
    if (level < 1 || level > 9)
      _throw(Err.NOT_BZIP_DATA, "level out of range");
    this.reader = new BitReader(inputStream);
    this.dbufSize = 1e5 * level;
    this.nextoutput = 0;
    this.outputStream = outputStream;
    this.streamCRC = 0;
  };
  Bunzip.prototype._get_next_block = function() {
    var i, j, k;
    var reader = this.reader;
    var h = reader.pi();
    if (h === SQRTPI) {
      return false;
    }
    if (h !== WHOLEPI)
      _throw(Err.NOT_BZIP_DATA);
    this.targetBlockCRC = reader.read(32) >>> 0;
    this.streamCRC = (this.targetBlockCRC ^ (this.streamCRC << 1 | this.streamCRC >>> 31)) >>> 0;
    if (reader.read(1))
      _throw(Err.OBSOLETE_INPUT);
    var origPointer = reader.read(24);
    if (origPointer > this.dbufSize)
      _throw(Err.DATA_ERROR, "initial position out of bounds");
    var t = reader.read(16);
    var symToByte = new Buffer(256), symTotal = 0;
    for (i = 0;i < 16; i++) {
      if (t & 1 << 15 - i) {
        var o = i * 16;
        k = reader.read(16);
        for (j = 0;j < 16; j++)
          if (k & 1 << 15 - j)
            symToByte[symTotal++] = o + j;
      }
    }
    var groupCount = reader.read(3);
    if (groupCount < MIN_GROUPS || groupCount > MAX_GROUPS)
      _throw(Err.DATA_ERROR);
    var nSelectors = reader.read(15);
    if (nSelectors === 0)
      _throw(Err.DATA_ERROR);
    var mtfSymbol = new Buffer(256);
    for (i = 0;i < groupCount; i++)
      mtfSymbol[i] = i;
    var selectors = new Buffer(nSelectors);
    for (i = 0;i < nSelectors; i++) {
      for (j = 0;reader.read(1); j++)
        if (j >= groupCount)
          _throw(Err.DATA_ERROR);
      selectors[i] = mtf(mtfSymbol, j);
    }
    var symCount = symTotal + 2;
    var groups = [], hufGroup;
    for (j = 0;j < groupCount; j++) {
      var length = new Buffer(symCount), temp = new Uint16Array(MAX_HUFCODE_BITS + 1);
      t = reader.read(5);
      for (i = 0;i < symCount; i++) {
        for (;; ) {
          if (t < 1 || t > MAX_HUFCODE_BITS)
            _throw(Err.DATA_ERROR);
          if (!reader.read(1))
            break;
          if (!reader.read(1))
            t++;
          else
            t--;
        }
        length[i] = t;
      }
      var minLen, maxLen;
      minLen = maxLen = length[0];
      for (i = 1;i < symCount; i++) {
        if (length[i] > maxLen)
          maxLen = length[i];
        else if (length[i] < minLen)
          minLen = length[i];
      }
      hufGroup = {};
      groups.push(hufGroup);
      hufGroup.permute = new Uint16Array(MAX_SYMBOLS);
      hufGroup.limit = new Uint32Array(MAX_HUFCODE_BITS + 2);
      hufGroup.base = new Uint32Array(MAX_HUFCODE_BITS + 1);
      hufGroup.minLen = minLen;
      hufGroup.maxLen = maxLen;
      var pp = 0;
      for (i = minLen;i <= maxLen; i++) {
        temp[i] = hufGroup.limit[i] = 0;
        for (t = 0;t < symCount; t++)
          if (length[t] === i)
            hufGroup.permute[pp++] = t;
      }
      for (i = 0;i < symCount; i++)
        temp[length[i]]++;
      pp = t = 0;
      for (i = minLen;i < maxLen; i++) {
        pp += temp[i];
        hufGroup.limit[i] = pp - 1;
        pp <<= 1;
        t += temp[i];
        hufGroup.base[i + 1] = pp - t;
      }
      hufGroup.limit[maxLen + 1] = Number.MAX_VALUE;
      hufGroup.limit[maxLen] = pp + temp[maxLen] - 1;
      hufGroup.base[minLen] = 0;
    }
    var byteCount = new Uint32Array(256);
    for (i = 0;i < 256; i++)
      mtfSymbol[i] = i;
    var runPos = 0, dbufCount = 0, selector = 0, uc;
    var dbuf = this.dbuf = new Uint32Array(this.dbufSize);
    symCount = 0;
    for (;; ) {
      if (!symCount--) {
        symCount = GROUP_SIZE - 1;
        if (selector >= nSelectors) {
          _throw(Err.DATA_ERROR);
        }
        hufGroup = groups[selectors[selector++]];
      }
      i = hufGroup.minLen;
      j = reader.read(i);
      for (;; i++) {
        if (i > hufGroup.maxLen) {
          _throw(Err.DATA_ERROR);
        }
        if (j <= hufGroup.limit[i])
          break;
        j = j << 1 | reader.read(1);
      }
      j -= hufGroup.base[i];
      if (j < 0 || j >= MAX_SYMBOLS) {
        _throw(Err.DATA_ERROR);
      }
      var nextSym = hufGroup.permute[j];
      if (nextSym === SYMBOL_RUNA || nextSym === SYMBOL_RUNB) {
        if (!runPos) {
          runPos = 1;
          t = 0;
        }
        if (nextSym === SYMBOL_RUNA)
          t += runPos;
        else
          t += 2 * runPos;
        runPos <<= 1;
        continue;
      }
      if (runPos) {
        runPos = 0;
        if (dbufCount + t > this.dbufSize) {
          _throw(Err.DATA_ERROR);
        }
        uc = symToByte[mtfSymbol[0]];
        byteCount[uc] += t;
        while (t--)
          dbuf[dbufCount++] = uc;
      }
      if (nextSym > symTotal)
        break;
      if (dbufCount >= this.dbufSize) {
        _throw(Err.DATA_ERROR);
      }
      i = nextSym - 1;
      uc = mtf(mtfSymbol, i);
      uc = symToByte[uc];
      byteCount[uc]++;
      dbuf[dbufCount++] = uc;
    }
    if (origPointer < 0 || origPointer >= dbufCount) {
      _throw(Err.DATA_ERROR);
    }
    j = 0;
    for (i = 0;i < 256; i++) {
      k = j + byteCount[i];
      byteCount[i] = j;
      j = k;
    }
    for (i = 0;i < dbufCount; i++) {
      uc = dbuf[i] & 255;
      dbuf[byteCount[uc]] |= i << 8;
      byteCount[uc]++;
    }
    var pos = 0, current = 0, run = 0;
    if (dbufCount) {
      pos = dbuf[origPointer];
      current = pos & 255;
      pos >>= 8;
      run = -1;
    }
    this.writePos = pos;
    this.writeCurrent = current;
    this.writeCount = dbufCount;
    this.writeRun = run;
    return true;
  };
  Bunzip.prototype._read_bunzip = function(outputBuffer, len) {
    var copies, previous, outbyte;
    if (this.writeCount < 0) {
      return 0;
    }
    var gotcount = 0;
    var dbuf = this.dbuf, pos = this.writePos, current = this.writeCurrent;
    var dbufCount = this.writeCount, outputsize = this.outputsize;
    var run = this.writeRun;
    while (dbufCount) {
      dbufCount--;
      previous = current;
      pos = dbuf[pos];
      current = pos & 255;
      pos >>= 8;
      if (run++ === 3) {
        copies = current;
        outbyte = previous;
        current = -1;
      } else {
        copies = 1;
        outbyte = current;
      }
      this.blockCRC.updateCRCRun(outbyte, copies);
      while (copies--) {
        this.outputStream.writeByte(outbyte);
        this.nextoutput++;
      }
      if (current != previous)
        run = 0;
    }
    this.writeCount = dbufCount;
    if (this.blockCRC.getCRC() !== this.targetBlockCRC) {
      _throw(Err.DATA_ERROR, "Bad block CRC " + "(got " + this.blockCRC.getCRC().toString(16) + " expected " + this.targetBlockCRC.toString(16) + ")");
    }
    return this.nextoutput;
  };
  var coerceInputStream = function(input) {
    if ("readByte" in input) {
      return input;
    }
    var inputStream = new Stream;
    inputStream.pos = 0;
    inputStream.readByte = function() {
      return input[this.pos++];
    };
    inputStream.seek = function(pos) {
      this.pos = pos;
    };
    inputStream.eof = function() {
      return this.pos >= input.length;
    };
    return inputStream;
  };
  var coerceOutputStream = function(output) {
    var outputStream = new Stream;
    var resizeOk = true;
    if (output) {
      if (typeof output === "number") {
        outputStream.buffer = new Buffer(output);
        resizeOk = false;
      } else if ("writeByte" in output) {
        return output;
      } else {
        outputStream.buffer = output;
        resizeOk = false;
      }
    } else {
      outputStream.buffer = new Buffer(16384);
    }
    outputStream.pos = 0;
    outputStream.writeByte = function(_byte) {
      if (resizeOk && this.pos >= this.buffer.length) {
        var newBuffer = new Buffer(this.buffer.length * 2);
        this.buffer.copy(newBuffer);
        this.buffer = newBuffer;
      }
      this.buffer[this.pos++] = _byte;
    };
    outputStream.getBuffer = function() {
      if (this.pos !== this.buffer.length) {
        if (!resizeOk)
          throw new TypeError("outputsize does not match decoded input");
        var newBuffer = new Buffer(this.pos);
        this.buffer.copy(newBuffer, 0, 0, this.pos);
        this.buffer = newBuffer;
      }
      return this.buffer;
    };
    outputStream._coerced = true;
    return outputStream;
  };
  Bunzip.Err = Err;
  Bunzip.decode = function(input, output, multistream) {
    var inputStream = coerceInputStream(input);
    var outputStream = coerceOutputStream(output);
    var bz = new Bunzip(inputStream, outputStream);
    while (true) {
      if ("eof" in inputStream && inputStream.eof())
        break;
      if (bz._init_block()) {
        bz._read_bunzip();
      } else {
        var targetStreamCRC = bz.reader.read(32) >>> 0;
        if (targetStreamCRC !== bz.streamCRC) {
          _throw(Err.DATA_ERROR, "Bad stream CRC " + "(got " + bz.streamCRC.toString(16) + " expected " + targetStreamCRC.toString(16) + ")");
        }
        if (multistream && "eof" in inputStream && !inputStream.eof()) {
          bz._start_bunzip(inputStream, outputStream);
        } else
          break;
      }
    }
    if ("getBuffer" in outputStream)
      return outputStream.getBuffer();
  };
  Bunzip.decodeBlock = function(input, pos, output) {
    var inputStream = coerceInputStream(input);
    var outputStream = coerceOutputStream(output);
    var bz = new Bunzip(inputStream, outputStream);
    bz.reader.seek(pos);
    var moreBlocks = bz._get_next_block();
    if (moreBlocks) {
      bz.blockCRC = new CRC32;
      bz.writeCopies = 0;
      bz._read_bunzip();
    }
    if ("getBuffer" in outputStream)
      return outputStream.getBuffer();
  };
  Bunzip.table = function(input, callback, multistream) {
    var inputStream = new Stream;
    inputStream.delegate = coerceInputStream(input);
    inputStream.pos = 0;
    inputStream.readByte = function() {
      this.pos++;
      return this.delegate.readByte();
    };
    if (inputStream.delegate.eof) {
      inputStream.eof = inputStream.delegate.eof.bind(inputStream.delegate);
    }
    var outputStream = new Stream;
    outputStream.pos = 0;
    outputStream.writeByte = function() {
      this.pos++;
    };
    var bz = new Bunzip(inputStream, outputStream);
    var blockSize = bz.dbufSize;
    while (true) {
      if ("eof" in inputStream && inputStream.eof())
        break;
      var position = inputStream.pos * 8 + bz.reader.bitOffset;
      if (bz.reader.hasByte) {
        position -= 8;
      }
      if (bz._init_block()) {
        var start = outputStream.pos;
        bz._read_bunzip();
        callback(position, outputStream.pos - start);
      } else {
        var crc = bz.reader.read(32);
        if (multistream && "eof" in inputStream && !inputStream.eof()) {
          bz._start_bunzip(inputStream, outputStream);
          console.assert(bz.dbufSize === blockSize, "shouldn't change block size within multistream file");
        } else
          break;
      }
    }
  };
  Bunzip.Stream = Stream;
  Bunzip.version = pjson.version;
  Bunzip.license = pjson.license;
  module.exports = Bunzip;
});

// node_modules/through/index.js
var require_through = __commonJS((exports, module) => {
  var through = function(write, end, opts) {
    write = write || function(data) {
      this.queue(data);
    };
    end = end || function() {
      this.queue(null);
    };
    var ended = false, destroyed = false, buffer = [], _ended = false;
    var stream2 = new Stream;
    stream2.readable = stream2.writable = true;
    stream2.paused = false;
    stream2.autoDestroy = !(opts && opts.autoDestroy === false);
    stream2.write = function(data) {
      write.call(this, data);
      return !stream2.paused;
    };
    function drain() {
      while (buffer.length && !stream2.paused) {
        var data = buffer.shift();
        if (data === null)
          return stream2.emit("end");
        else
          stream2.emit("data", data);
      }
    }
    stream2.queue = stream2.push = function(data) {
      if (_ended)
        return stream2;
      if (data === null)
        _ended = true;
      buffer.push(data);
      drain();
      return stream2;
    };
    stream2.on("end", function() {
      stream2.readable = false;
      if (!stream2.writable && stream2.autoDestroy)
        process.nextTick(function() {
          stream2.destroy();
        });
    });
    function _end() {
      stream2.writable = false;
      end.call(stream2);
      if (!stream2.readable && stream2.autoDestroy)
        stream2.destroy();
    }
    stream2.end = function(data) {
      if (ended)
        return;
      ended = true;
      if (arguments.length)
        stream2.write(data);
      _end();
      return stream2;
    };
    stream2.destroy = function() {
      if (destroyed)
        return;
      destroyed = true;
      ended = true;
      buffer.length = 0;
      stream2.writable = stream2.readable = false;
      stream2.emit("close");
      return stream2;
    };
    stream2.pause = function() {
      if (stream2.paused)
        return;
      stream2.paused = true;
      return stream2;
    };
    stream2.resume = function() {
      if (stream2.paused) {
        stream2.paused = false;
        stream2.emit("resume");
      }
      drain();
      if (!stream2.paused)
        stream2.emit("drain");
      return stream2;
    };
    return stream2;
  };
  var Stream = import.meta.require("stream");
  exports = module.exports = through;
  through.through = through;
});

// node_modules/unbzip2-stream/lib/bzip2.js
var require_bzip2 = __commonJS((exports, module) => {
  var Bzip2Error = function(message2) {
    this.name = "Bzip2Error";
    this.message = message2;
    this.stack = new Error().stack;
  };
  Bzip2Error.prototype = new Error;
  var message = {
    Error: function(message2) {
      throw new Bzip2Error(message2);
    }
  };
  var bzip2 = {};
  bzip2.Bzip2Error = Bzip2Error;
  bzip2.crcTable = [
    0,
    79764919,
    159529838,
    222504665,
    319059676,
    398814059,
    445009330,
    507990021,
    638119352,
    583659535,
    797628118,
    726387553,
    890018660,
    835552979,
    1015980042,
    944750013,
    1276238704,
    1221641927,
    1167319070,
    1095957929,
    1595256236,
    1540665371,
    1452775106,
    1381403509,
    1780037320,
    1859660671,
    1671105958,
    1733955601,
    2031960084,
    2111593891,
    1889500026,
    1952343757,
    2552477408,
    2632100695,
    2443283854,
    2506133561,
    2334638140,
    2414271883,
    2191915858,
    2254759653,
    3190512472,
    3135915759,
    3081330742,
    3009969537,
    2905550212,
    2850959411,
    2762807018,
    2691435357,
    3560074640,
    3505614887,
    3719321342,
    3648080713,
    3342211916,
    3287746299,
    3467911202,
    3396681109,
    4063920168,
    4143685023,
    4223187782,
    4286162673,
    3779000052,
    3858754371,
    3904687514,
    3967668269,
    881225847,
    809987520,
    1023691545,
    969234094,
    662832811,
    591600412,
    771767749,
    717299826,
    311336399,
    374308984,
    453813921,
    533576470,
    25881363,
    88864420,
    134795389,
    214552010,
    2023205639,
    2086057648,
    1897238633,
    1976864222,
    1804852699,
    1867694188,
    1645340341,
    1724971778,
    1587496639,
    1516133128,
    1461550545,
    1406951526,
    1302016099,
    1230646740,
    1142491917,
    1087903418,
    2896545431,
    2825181984,
    2770861561,
    2716262478,
    3215044683,
    3143675388,
    3055782693,
    3001194130,
    2326604591,
    2389456536,
    2200899649,
    2280525302,
    2578013683,
    2640855108,
    2418763421,
    2498394922,
    3769900519,
    3832873040,
    3912640137,
    3992402750,
    4088425275,
    4151408268,
    4197601365,
    4277358050,
    3334271071,
    3263032808,
    3476998961,
    3422541446,
    3585640067,
    3514407732,
    3694837229,
    3640369242,
    1762451694,
    1842216281,
    1619975040,
    1682949687,
    2047383090,
    2127137669,
    1938468188,
    2001449195,
    1325665622,
    1271206113,
    1183200824,
    1111960463,
    1543535498,
    1489069629,
    1434599652,
    1363369299,
    622672798,
    568075817,
    748617968,
    677256519,
    907627842,
    853037301,
    1067152940,
    995781531,
    51762726,
    131386257,
    177728840,
    240578815,
    269590778,
    349224269,
    429104020,
    491947555,
    4046411278,
    4126034873,
    4172115296,
    4234965207,
    3794477266,
    3874110821,
    3953728444,
    4016571915,
    3609705398,
    3555108353,
    3735388376,
    3664026991,
    3290680682,
    3236090077,
    3449943556,
    3378572211,
    3174993278,
    3120533705,
    3032266256,
    2961025959,
    2923101090,
    2868635157,
    2813903052,
    2742672763,
    2604032198,
    2683796849,
    2461293480,
    2524268063,
    2284983834,
    2364738477,
    2175806836,
    2238787779,
    1569362073,
    1498123566,
    1409854455,
    1355396672,
    1317987909,
    1246755826,
    1192025387,
    1137557660,
    2072149281,
    2135122070,
    1912620623,
    1992383480,
    1753615357,
    1816598090,
    1627664531,
    1707420964,
    295390185,
    358241886,
    404320391,
    483945776,
    43990325,
    106832002,
    186451547,
    266083308,
    932423249,
    861060070,
    1041341759,
    986742920,
    613929101,
    542559546,
    756411363,
    701822548,
    3316196985,
    3244833742,
    3425377559,
    3370778784,
    3601682597,
    3530312978,
    3744426955,
    3689838204,
    3819031489,
    3881883254,
    3928223919,
    4007849240,
    4037393693,
    4100235434,
    4180117107,
    4259748804,
    2310601993,
    2373574846,
    2151335527,
    2231098320,
    2596047829,
    2659030626,
    2470359227,
    2550115596,
    2947551409,
    2876312838,
    2788305887,
    2733848168,
    3165939309,
    3094707162,
    3040238851,
    2985771188
  ];
  bzip2.array = function(bytes) {
    var bit = 0, byte = 0;
    var BITMASK = [0, 1, 3, 7, 15, 31, 63, 127, 255];
    return function(n) {
      var result = 0;
      while (n > 0) {
        var left = 8 - bit;
        if (n >= left) {
          result <<= left;
          result |= BITMASK[left] & bytes[byte++];
          bit = 0;
          n -= left;
        } else {
          result <<= n;
          result |= (bytes[byte] & BITMASK[n] << 8 - n - bit) >> 8 - n - bit;
          bit += n;
          n = 0;
        }
      }
      return result;
    };
  };
  bzip2.simple = function(srcbuffer, stream2) {
    var bits = bzip2.array(srcbuffer);
    var size = bzip2.header(bits);
    var ret = false;
    var bufsize = 1e5 * size;
    var buf = new Int32Array(bufsize);
    do {
      ret = bzip2.decompress(bits, stream2, buf, bufsize);
    } while (!ret);
  };
  bzip2.header = function(bits) {
    this.byteCount = new Int32Array(256);
    this.symToByte = new Uint8Array(256);
    this.mtfSymbol = new Int32Array(256);
    this.selectors = new Uint8Array(32768);
    if (bits(8 * 3) != 4348520)
      message.Error("No magic number found");
    var i = bits(8) - 48;
    if (i < 1 || i > 9)
      message.Error("Not a BZIP archive");
    return i;
  };
  bzip2.decompress = function(bits, stream2, buf, bufsize, streamCRC) {
    var MAX_HUFCODE_BITS = 20;
    var MAX_SYMBOLS = 258;
    var SYMBOL_RUNA = 0;
    var SYMBOL_RUNB = 1;
    var GROUP_SIZE = 50;
    var crc = 0 ^ -1;
    for (var h = "", i = 0;i < 6; i++)
      h += bits(8).toString(16);
    if (h == "177245385090") {
      var finalCRC = bits(32) | 0;
      if (finalCRC !== streamCRC)
        message.Error("Error in bzip2: crc32 do not match");
      bits(null);
      return null;
    }
    if (h != "314159265359")
      message.Error("eek not valid bzip data");
    var crcblock = bits(32) | 0;
    if (bits(1))
      message.Error("unsupported obsolete version");
    var origPtr = bits(24);
    if (origPtr > bufsize)
      message.Error("Initial position larger than buffer size");
    var t = bits(16);
    var symTotal = 0;
    for (i = 0;i < 16; i++) {
      if (t & 1 << 15 - i) {
        var k = bits(16);
        for (j = 0;j < 16; j++) {
          if (k & 1 << 15 - j) {
            this.symToByte[symTotal++] = 16 * i + j;
          }
        }
      }
    }
    var groupCount = bits(3);
    if (groupCount < 2 || groupCount > 6)
      message.Error("another error");
    var nSelectors = bits(15);
    if (nSelectors == 0)
      message.Error("meh");
    for (var i = 0;i < groupCount; i++)
      this.mtfSymbol[i] = i;
    for (var i = 0;i < nSelectors; i++) {
      for (var j = 0;bits(1); j++)
        if (j >= groupCount)
          message.Error("whoops another error");
      var uc = this.mtfSymbol[j];
      for (var k = j - 1;k >= 0; k--) {
        this.mtfSymbol[k + 1] = this.mtfSymbol[k];
      }
      this.mtfSymbol[0] = uc;
      this.selectors[i] = uc;
    }
    var symCount = symTotal + 2;
    var groups = [];
    var length = new Uint8Array(MAX_SYMBOLS), temp = new Uint16Array(MAX_HUFCODE_BITS + 1);
    var hufGroup;
    for (var j = 0;j < groupCount; j++) {
      t = bits(5);
      for (var i = 0;i < symCount; i++) {
        while (true) {
          if (t < 1 || t > MAX_HUFCODE_BITS)
            message.Error("I gave up a while ago on writing error messages");
          if (!bits(1))
            break;
          if (!bits(1))
            t++;
          else
            t--;
        }
        length[i] = t;
      }
      var minLen, maxLen;
      minLen = maxLen = length[0];
      for (var i = 1;i < symCount; i++) {
        if (length[i] > maxLen)
          maxLen = length[i];
        else if (length[i] < minLen)
          minLen = length[i];
      }
      hufGroup = groups[j] = {};
      hufGroup.permute = new Int32Array(MAX_SYMBOLS);
      hufGroup.limit = new Int32Array(MAX_HUFCODE_BITS + 1);
      hufGroup.base = new Int32Array(MAX_HUFCODE_BITS + 1);
      hufGroup.minLen = minLen;
      hufGroup.maxLen = maxLen;
      var base = hufGroup.base;
      var limit = hufGroup.limit;
      var pp = 0;
      for (var i = minLen;i <= maxLen; i++)
        for (var t = 0;t < symCount; t++)
          if (length[t] == i)
            hufGroup.permute[pp++] = t;
      for (i = minLen;i <= maxLen; i++)
        temp[i] = limit[i] = 0;
      for (i = 0;i < symCount; i++)
        temp[length[i]]++;
      pp = t = 0;
      for (i = minLen;i < maxLen; i++) {
        pp += temp[i];
        limit[i] = pp - 1;
        pp <<= 1;
        base[i + 1] = pp - (t += temp[i]);
      }
      limit[maxLen] = pp + temp[maxLen] - 1;
      base[minLen] = 0;
    }
    for (var i = 0;i < 256; i++) {
      this.mtfSymbol[i] = i;
      this.byteCount[i] = 0;
    }
    var runPos, count, symCount, selector;
    runPos = count = symCount = selector = 0;
    while (true) {
      if (!symCount--) {
        symCount = GROUP_SIZE - 1;
        if (selector >= nSelectors)
          message.Error("meow i'm a kitty, that's an error");
        hufGroup = groups[this.selectors[selector++]];
        base = hufGroup.base;
        limit = hufGroup.limit;
      }
      i = hufGroup.minLen;
      j = bits(i);
      while (true) {
        if (i > hufGroup.maxLen)
          message.Error("rawr i'm a dinosaur");
        if (j <= limit[i])
          break;
        i++;
        j = j << 1 | bits(1);
      }
      j -= base[i];
      if (j < 0 || j >= MAX_SYMBOLS)
        message.Error("moo i'm a cow");
      var nextSym = hufGroup.permute[j];
      if (nextSym == SYMBOL_RUNA || nextSym == SYMBOL_RUNB) {
        if (!runPos) {
          runPos = 1;
          t = 0;
        }
        if (nextSym == SYMBOL_RUNA)
          t += runPos;
        else
          t += 2 * runPos;
        runPos <<= 1;
        continue;
      }
      if (runPos) {
        runPos = 0;
        if (count + t > bufsize)
          message.Error("Boom.");
        uc = this.symToByte[this.mtfSymbol[0]];
        this.byteCount[uc] += t;
        while (t--)
          buf[count++] = uc;
      }
      if (nextSym > symTotal)
        break;
      if (count >= bufsize)
        message.Error("I can't think of anything. Error");
      i = nextSym - 1;
      uc = this.mtfSymbol[i];
      for (var k = i - 1;k >= 0; k--) {
        this.mtfSymbol[k + 1] = this.mtfSymbol[k];
      }
      this.mtfSymbol[0] = uc;
      uc = this.symToByte[uc];
      this.byteCount[uc]++;
      buf[count++] = uc;
    }
    if (origPtr < 0 || origPtr >= count)
      message.Error("I'm a monkey and I'm throwing something at someone, namely you");
    var j = 0;
    for (var i = 0;i < 256; i++) {
      k = j + this.byteCount[i];
      this.byteCount[i] = j;
      j = k;
    }
    for (var i = 0;i < count; i++) {
      uc = buf[i] & 255;
      buf[this.byteCount[uc]] |= i << 8;
      this.byteCount[uc]++;
    }
    var pos = 0, current = 0, run = 0;
    if (count) {
      pos = buf[origPtr];
      current = pos & 255;
      pos >>= 8;
      run = -1;
    }
    count = count;
    var copies, previous, outbyte;
    while (count) {
      count--;
      previous = current;
      pos = buf[pos];
      current = pos & 255;
      pos >>= 8;
      if (run++ == 3) {
        copies = current;
        outbyte = previous;
        current = -1;
      } else {
        copies = 1;
        outbyte = current;
      }
      while (copies--) {
        crc = (crc << 8 ^ this.crcTable[(crc >> 24 ^ outbyte) & 255]) & 4294967295;
        stream2(outbyte);
      }
      if (current != previous)
        run = 0;
    }
    crc = (crc ^ -1) >>> 0;
    if ((crc | 0) != (crcblock | 0))
      message.Error("Error in bzip2: crc32 do not match");
    streamCRC = (crc ^ (streamCRC << 1 | streamCRC >>> 31)) & 4294967295;
    return streamCRC;
  };
  module.exports = bzip2;
});

// node_modules/unbzip2-stream/lib/bit_iterator.js
var require_bit_iterator = __commonJS((exports, module) => {
  var BITMASK = [0, 1, 3, 7, 15, 31, 63, 127, 255];
  module.exports = function bitIterator(nextBuffer) {
    var bit = 0, byte = 0;
    var bytes = nextBuffer();
    var f = function(n) {
      if (n === null && bit != 0) {
        bit = 0;
        byte++;
        return;
      }
      var result = 0;
      while (n > 0) {
        if (byte >= bytes.length) {
          byte = 0;
          bytes = nextBuffer();
        }
        var left = 8 - bit;
        if (bit === 0 && n > 0)
          f.bytesRead++;
        if (n >= left) {
          result <<= left;
          result |= BITMASK[left] & bytes[byte++];
          bit = 0;
          n -= left;
        } else {
          result <<= n;
          result |= (bytes[byte] & BITMASK[n] << 8 - n - bit) >> 8 - n - bit;
          bit += n;
          n = 0;
        }
      }
      return result;
    };
    f.bytesRead = 0;
    return f;
  };
});

// node_modules/unbzip2-stream/index.js
var require_unbzip2_stream = __commonJS((exports, module) => {
  var unbzip2Stream = function() {
    var bufferQueue = [];
    var hasBytes = 0;
    var blockSize = 0;
    var broken = false;
    var done = false;
    var bitReader = null;
    var streamCRC = null;
    function decompressBlock(push) {
      if (!blockSize) {
        blockSize = bz2.header(bitReader);
        streamCRC = 0;
        return true;
      } else {
        var bufsize = 1e5 * blockSize;
        var buf = new Int32Array(bufsize);
        var chunk = [];
        var f = function(b) {
          chunk.push(b);
        };
        streamCRC = bz2.decompress(bitReader, f, buf, bufsize, streamCRC);
        if (streamCRC === null) {
          blockSize = 0;
          return false;
        } else {
          push(Buffer.from(chunk));
          return true;
        }
      }
    }
    var outlength = 0;
    function decompressAndQueue(stream2) {
      if (broken)
        return;
      try {
        return decompressBlock(function(d) {
          stream2.queue(d);
          if (d !== null) {
            outlength += d.length;
          } else {
          }
        });
      } catch (e) {
        stream2.emit("error", e);
        broken = true;
        return false;
      }
    }
    return through(function write(data) {
      bufferQueue.push(data);
      hasBytes += data.length;
      if (bitReader === null) {
        bitReader = bitIterator(function() {
          return bufferQueue.shift();
        });
      }
      while (!broken && hasBytes - bitReader.bytesRead + 1 >= (25000 + 1e5 * blockSize || 4)) {
        decompressAndQueue(this);
      }
    }, function end(x) {
      while (!broken && bitReader && hasBytes > bitReader.bytesRead) {
        decompressAndQueue(this);
      }
      if (!broken) {
        if (streamCRC !== null)
          this.emit("error", new Error("input stream ended prematurely"));
        this.queue(null);
      }
    });
  };
  var through = require_through();
  var bz2 = require_bzip2();
  var bitIterator = require_bit_iterator();
  module.exports = unbzip2Stream;
});

// node_modules/decompress-tarbz2/index.js
var require_decompress_tarbz2 = __commonJS((exports, module) => {
  var decompressTar = require_decompress_tar();
  var fileType = require_file_type3();
  var isStream2 = require_is_stream2();
  var seekBzip = require_lib();
  var unbzip2Stream = require_unbzip2_stream();
  module.exports = () => (input) => {
    if (!Buffer.isBuffer(input) && !isStream2(input)) {
      return Promise.reject(new TypeError(`Expected a Buffer or Stream, got ${typeof input}`));
    }
    if (Buffer.isBuffer(input) && (!fileType(input) || fileType(input).ext !== "bz2")) {
      return Promise.resolve([]);
    }
    if (Buffer.isBuffer(input)) {
      return decompressTar()(seekBzip.decode(input));
    }
    return decompressTar()(input.pipe(unbzip2Stream()));
  };
});

// node_modules/decompress-targz/node_modules/file-type/index.js
var require_file_type4 = __commonJS((exports, module) => {
  module.exports = (input) => {
    const buf = new Uint8Array(input);
    if (!(buf && buf.length > 1)) {
      return null;
    }
    const check = (header, opts) => {
      opts = Object.assign({
        offset: 0
      }, opts);
      for (let i = 0;i < header.length; i++) {
        if (header[i] !== buf[i + opts.offset]) {
          return false;
        }
      }
      return true;
    };
    if (check([255, 216, 255])) {
      return {
        ext: "jpg",
        mime: "image/jpeg"
      };
    }
    if (check([137, 80, 78, 71, 13, 10, 26, 10])) {
      return {
        ext: "png",
        mime: "image/png"
      };
    }
    if (check([71, 73, 70])) {
      return {
        ext: "gif",
        mime: "image/gif"
      };
    }
    if (check([87, 69, 66, 80], { offset: 8 })) {
      return {
        ext: "webp",
        mime: "image/webp"
      };
    }
    if (check([70, 76, 73, 70])) {
      return {
        ext: "flif",
        mime: "image/flif"
      };
    }
    if ((check([73, 73, 42, 0]) || check([77, 77, 0, 42])) && check([67, 82], { offset: 8 })) {
      return {
        ext: "cr2",
        mime: "image/x-canon-cr2"
      };
    }
    if (check([73, 73, 42, 0]) || check([77, 77, 0, 42])) {
      return {
        ext: "tif",
        mime: "image/tiff"
      };
    }
    if (check([66, 77])) {
      return {
        ext: "bmp",
        mime: "image/bmp"
      };
    }
    if (check([73, 73, 188])) {
      return {
        ext: "jxr",
        mime: "image/vnd.ms-photo"
      };
    }
    if (check([56, 66, 80, 83])) {
      return {
        ext: "psd",
        mime: "image/vnd.adobe.photoshop"
      };
    }
    if (check([80, 75, 3, 4]) && check([109, 105, 109, 101, 116, 121, 112, 101, 97, 112, 112, 108, 105, 99, 97, 116, 105, 111, 110, 47, 101, 112, 117, 98, 43, 122, 105, 112], { offset: 30 })) {
      return {
        ext: "epub",
        mime: "application/epub+zip"
      };
    }
    if (check([80, 75, 3, 4]) && check([77, 69, 84, 65, 45, 73, 78, 70, 47, 109, 111, 122, 105, 108, 108, 97, 46, 114, 115, 97], { offset: 30 })) {
      return {
        ext: "xpi",
        mime: "application/x-xpinstall"
      };
    }
    if (check([80, 75]) && (buf[2] === 3 || buf[2] === 5 || buf[2] === 7) && (buf[3] === 4 || buf[3] === 6 || buf[3] === 8)) {
      return {
        ext: "zip",
        mime: "application/zip"
      };
    }
    if (check([117, 115, 116, 97, 114], { offset: 257 })) {
      return {
        ext: "tar",
        mime: "application/x-tar"
      };
    }
    if (check([82, 97, 114, 33, 26, 7]) && (buf[6] === 0 || buf[6] === 1)) {
      return {
        ext: "rar",
        mime: "application/x-rar-compressed"
      };
    }
    if (check([31, 139, 8])) {
      return {
        ext: "gz",
        mime: "application/gzip"
      };
    }
    if (check([66, 90, 104])) {
      return {
        ext: "bz2",
        mime: "application/x-bzip2"
      };
    }
    if (check([55, 122, 188, 175, 39, 28])) {
      return {
        ext: "7z",
        mime: "application/x-7z-compressed"
      };
    }
    if (check([120, 1])) {
      return {
        ext: "dmg",
        mime: "application/x-apple-diskimage"
      };
    }
    if (check([0, 0, 0]) && (buf[3] === 24 || buf[3] === 32) && check([102, 116, 121, 112], { offset: 4 }) || check([51, 103, 112, 53]) || check([0, 0, 0, 28, 102, 116, 121, 112, 109, 112, 52, 50]) && check([109, 112, 52, 49, 109, 112, 52, 50, 105, 115, 111, 109], { offset: 16 }) || check([0, 0, 0, 28, 102, 116, 121, 112, 105, 115, 111, 109]) || check([0, 0, 0, 28, 102, 116, 121, 112, 109, 112, 52, 50, 0, 0, 0, 0])) {
      return {
        ext: "mp4",
        mime: "video/mp4"
      };
    }
    if (check([0, 0, 0, 28, 102, 116, 121, 112, 77, 52, 86])) {
      return {
        ext: "m4v",
        mime: "video/x-m4v"
      };
    }
    if (check([77, 84, 104, 100])) {
      return {
        ext: "mid",
        mime: "audio/midi"
      };
    }
    if (check([26, 69, 223, 163])) {
      const sliced = buf.subarray(4, 4 + 4096);
      const idPos = sliced.findIndex((el, i, arr) => arr[i] === 66 && arr[i + 1] === 130);
      if (idPos >= 0) {
        const docTypePos = idPos + 3;
        const findDocType = (type) => Array.from(type).every((c, i) => sliced[docTypePos + i] === c.charCodeAt(0));
        if (findDocType("matroska")) {
          return {
            ext: "mkv",
            mime: "video/x-matroska"
          };
        }
        if (findDocType("webm")) {
          return {
            ext: "webm",
            mime: "video/webm"
          };
        }
      }
    }
    if (check([0, 0, 0, 20, 102, 116, 121, 112, 113, 116, 32, 32]) || check([102, 114, 101, 101], { offset: 4 }) || check([102, 116, 121, 112, 113, 116, 32, 32], { offset: 4 }) || check([109, 100, 97, 116], { offset: 4 }) || check([119, 105, 100, 101], { offset: 4 })) {
      return {
        ext: "mov",
        mime: "video/quicktime"
      };
    }
    if (check([82, 73, 70, 70]) && check([65, 86, 73], { offset: 8 })) {
      return {
        ext: "avi",
        mime: "video/x-msvideo"
      };
    }
    if (check([48, 38, 178, 117, 142, 102, 207, 17, 166, 217])) {
      return {
        ext: "wmv",
        mime: "video/x-ms-wmv"
      };
    }
    if (check([0, 0, 1, 186])) {
      return {
        ext: "mpg",
        mime: "video/mpeg"
      };
    }
    if (check([73, 68, 51]) || check([255, 251])) {
      return {
        ext: "mp3",
        mime: "audio/mpeg"
      };
    }
    if (check([102, 116, 121, 112, 77, 52, 65], { offset: 4 }) || check([77, 52, 65, 32])) {
      return {
        ext: "m4a",
        mime: "audio/m4a"
      };
    }
    if (check([79, 112, 117, 115, 72, 101, 97, 100], { offset: 28 })) {
      return {
        ext: "opus",
        mime: "audio/opus"
      };
    }
    if (check([79, 103, 103, 83])) {
      return {
        ext: "ogg",
        mime: "audio/ogg"
      };
    }
    if (check([102, 76, 97, 67])) {
      return {
        ext: "flac",
        mime: "audio/x-flac"
      };
    }
    if (check([82, 73, 70, 70]) && check([87, 65, 86, 69], { offset: 8 })) {
      return {
        ext: "wav",
        mime: "audio/x-wav"
      };
    }
    if (check([35, 33, 65, 77, 82, 10])) {
      return {
        ext: "amr",
        mime: "audio/amr"
      };
    }
    if (check([37, 80, 68, 70])) {
      return {
        ext: "pdf",
        mime: "application/pdf"
      };
    }
    if (check([77, 90])) {
      return {
        ext: "exe",
        mime: "application/x-msdownload"
      };
    }
    if ((buf[0] === 67 || buf[0] === 70) && check([87, 83], { offset: 1 })) {
      return {
        ext: "swf",
        mime: "application/x-shockwave-flash"
      };
    }
    if (check([123, 92, 114, 116, 102])) {
      return {
        ext: "rtf",
        mime: "application/rtf"
      };
    }
    if (check([0, 97, 115, 109])) {
      return {
        ext: "wasm",
        mime: "application/wasm"
      };
    }
    if (check([119, 79, 70, 70]) && (check([0, 1, 0, 0], { offset: 4 }) || check([79, 84, 84, 79], { offset: 4 }))) {
      return {
        ext: "woff",
        mime: "font/woff"
      };
    }
    if (check([119, 79, 70, 50]) && (check([0, 1, 0, 0], { offset: 4 }) || check([79, 84, 84, 79], { offset: 4 }))) {
      return {
        ext: "woff2",
        mime: "font/woff2"
      };
    }
    if (check([76, 80], { offset: 34 }) && (check([0, 0, 1], { offset: 8 }) || check([1, 0, 2], { offset: 8 }) || check([2, 0, 2], { offset: 8 }))) {
      return {
        ext: "eot",
        mime: "application/octet-stream"
      };
    }
    if (check([0, 1, 0, 0, 0])) {
      return {
        ext: "ttf",
        mime: "font/ttf"
      };
    }
    if (check([79, 84, 84, 79, 0])) {
      return {
        ext: "otf",
        mime: "font/otf"
      };
    }
    if (check([0, 0, 1, 0])) {
      return {
        ext: "ico",
        mime: "image/x-icon"
      };
    }
    if (check([70, 76, 86, 1])) {
      return {
        ext: "flv",
        mime: "video/x-flv"
      };
    }
    if (check([37, 33])) {
      return {
        ext: "ps",
        mime: "application/postscript"
      };
    }
    if (check([253, 55, 122, 88, 90, 0])) {
      return {
        ext: "xz",
        mime: "application/x-xz"
      };
    }
    if (check([83, 81, 76, 105])) {
      return {
        ext: "sqlite",
        mime: "application/x-sqlite3"
      };
    }
    if (check([78, 69, 83, 26])) {
      return {
        ext: "nes",
        mime: "application/x-nintendo-nes-rom"
      };
    }
    if (check([67, 114, 50, 52])) {
      return {
        ext: "crx",
        mime: "application/x-google-chrome-extension"
      };
    }
    if (check([77, 83, 67, 70]) || check([73, 83, 99, 40])) {
      return {
        ext: "cab",
        mime: "application/vnd.ms-cab-compressed"
      };
    }
    if (check([33, 60, 97, 114, 99, 104, 62, 10, 100, 101, 98, 105, 97, 110, 45, 98, 105, 110, 97, 114, 121])) {
      return {
        ext: "deb",
        mime: "application/x-deb"
      };
    }
    if (check([33, 60, 97, 114, 99, 104, 62])) {
      return {
        ext: "ar",
        mime: "application/x-unix-archive"
      };
    }
    if (check([237, 171, 238, 219])) {
      return {
        ext: "rpm",
        mime: "application/x-rpm"
      };
    }
    if (check([31, 160]) || check([31, 157])) {
      return {
        ext: "Z",
        mime: "application/x-compress"
      };
    }
    if (check([76, 90, 73, 80])) {
      return {
        ext: "lz",
        mime: "application/x-lzip"
      };
    }
    if (check([208, 207, 17, 224, 161, 177, 26, 225])) {
      return {
        ext: "msi",
        mime: "application/x-msi"
      };
    }
    if (check([6, 14, 43, 52, 2, 5, 1, 1, 13, 1, 2, 1, 1, 2])) {
      return {
        ext: "mxf",
        mime: "application/mxf"
      };
    }
    if (check([71], { offset: 4 }) && (check([71], { offset: 192 }) || check([71], { offset: 196 }))) {
      return {
        ext: "mts",
        mime: "video/mp2t"
      };
    }
    if (check([66, 76, 69, 78, 68, 69, 82])) {
      return {
        ext: "blend",
        mime: "application/x-blender"
      };
    }
    if (check([66, 80, 71, 251])) {
      return {
        ext: "bpg",
        mime: "image/bpg"
      };
    }
    return null;
  };
});

// node_modules/decompress-targz/node_modules/is-stream/index.js
var require_is_stream3 = __commonJS((exports, module) => {
  var isStream2 = module.exports = function(stream2) {
    return stream2 !== null && typeof stream2 === "object" && typeof stream2.pipe === "function";
  };
  isStream2.writable = function(stream2) {
    return isStream2(stream2) && stream2.writable !== false && typeof stream2._write === "function" && typeof stream2._writableState === "object";
  };
  isStream2.readable = function(stream2) {
    return isStream2(stream2) && stream2.readable !== false && typeof stream2._read === "function" && typeof stream2._readableState === "object";
  };
  isStream2.duplex = function(stream2) {
    return isStream2.writable(stream2) && isStream2.readable(stream2);
  };
  isStream2.transform = function(stream2) {
    return isStream2.duplex(stream2) && typeof stream2._transform === "function" && typeof stream2._transformState === "object";
  };
});

// node_modules/decompress-targz/index.js
var require_decompress_targz = __commonJS((exports, module) => {
  var zlib = import.meta.require("zlib");
  var decompressTar = require_decompress_tar();
  var fileType = require_file_type4();
  var isStream2 = require_is_stream3();
  module.exports = () => (input) => {
    if (!Buffer.isBuffer(input) && !isStream2(input)) {
      return Promise.reject(new TypeError(`Expected a Buffer or Stream, got ${typeof input}`));
    }
    if (Buffer.isBuffer(input) && (!fileType(input) || fileType(input).ext !== "gz")) {
      return Promise.resolve([]);
    }
    const unzip = zlib.createGunzip();
    const result = decompressTar()(unzip);
    if (Buffer.isBuffer(input)) {
      unzip.end(input);
    } else {
      input.pipe(unzip);
    }
    return result;
  };
});

// node_modules/decompress-unzip/node_modules/file-type/index.js
var require_file_type5 = __commonJS((exports, module) => {
  module.exports = function(buf) {
    if (!(buf && buf.length > 1)) {
      return null;
    }
    if (buf[0] === 255 && buf[1] === 216 && buf[2] === 255) {
      return {
        ext: "jpg",
        mime: "image/jpeg"
      };
    }
    if (buf[0] === 137 && buf[1] === 80 && buf[2] === 78 && buf[3] === 71) {
      return {
        ext: "png",
        mime: "image/png"
      };
    }
    if (buf[0] === 71 && buf[1] === 73 && buf[2] === 70) {
      return {
        ext: "gif",
        mime: "image/gif"
      };
    }
    if (buf[8] === 87 && buf[9] === 69 && buf[10] === 66 && buf[11] === 80) {
      return {
        ext: "webp",
        mime: "image/webp"
      };
    }
    if (buf[0] === 70 && buf[1] === 76 && buf[2] === 73 && buf[3] === 70) {
      return {
        ext: "flif",
        mime: "image/flif"
      };
    }
    if ((buf[0] === 73 && buf[1] === 73 && buf[2] === 42 && buf[3] === 0 || buf[0] === 77 && buf[1] === 77 && buf[2] === 0 && buf[3] === 42) && buf[8] === 67 && buf[9] === 82) {
      return {
        ext: "cr2",
        mime: "image/x-canon-cr2"
      };
    }
    if (buf[0] === 73 && buf[1] === 73 && buf[2] === 42 && buf[3] === 0 || buf[0] === 77 && buf[1] === 77 && buf[2] === 0 && buf[3] === 42) {
      return {
        ext: "tif",
        mime: "image/tiff"
      };
    }
    if (buf[0] === 66 && buf[1] === 77) {
      return {
        ext: "bmp",
        mime: "image/bmp"
      };
    }
    if (buf[0] === 73 && buf[1] === 73 && buf[2] === 188) {
      return {
        ext: "jxr",
        mime: "image/vnd.ms-photo"
      };
    }
    if (buf[0] === 56 && buf[1] === 66 && buf[2] === 80 && buf[3] === 83) {
      return {
        ext: "psd",
        mime: "image/vnd.adobe.photoshop"
      };
    }
    if (buf[0] === 80 && buf[1] === 75 && buf[2] === 3 && buf[3] === 4 && buf[30] === 109 && buf[31] === 105 && buf[32] === 109 && buf[33] === 101 && buf[34] === 116 && buf[35] === 121 && buf[36] === 112 && buf[37] === 101 && buf[38] === 97 && buf[39] === 112 && buf[40] === 112 && buf[41] === 108 && buf[42] === 105 && buf[43] === 99 && buf[44] === 97 && buf[45] === 116 && buf[46] === 105 && buf[47] === 111 && buf[48] === 110 && buf[49] === 47 && buf[50] === 101 && buf[51] === 112 && buf[52] === 117 && buf[53] === 98 && buf[54] === 43 && buf[55] === 122 && buf[56] === 105 && buf[57] === 112) {
      return {
        ext: "epub",
        mime: "application/epub+zip"
      };
    }
    if (buf[0] === 80 && buf[1] === 75 && buf[2] === 3 && buf[3] === 4 && buf[30] === 77 && buf[31] === 69 && buf[32] === 84 && buf[33] === 65 && buf[34] === 45 && buf[35] === 73 && buf[36] === 78 && buf[37] === 70 && buf[38] === 47 && buf[39] === 109 && buf[40] === 111 && buf[41] === 122 && buf[42] === 105 && buf[43] === 108 && buf[44] === 108 && buf[45] === 97 && buf[46] === 46 && buf[47] === 114 && buf[48] === 115 && buf[49] === 97) {
      return {
        ext: "xpi",
        mime: "application/x-xpinstall"
      };
    }
    if (buf[0] === 80 && buf[1] === 75 && (buf[2] === 3 || buf[2] === 5 || buf[2] === 7) && (buf[3] === 4 || buf[3] === 6 || buf[3] === 8)) {
      return {
        ext: "zip",
        mime: "application/zip"
      };
    }
    if (buf[257] === 117 && buf[258] === 115 && buf[259] === 116 && buf[260] === 97 && buf[261] === 114) {
      return {
        ext: "tar",
        mime: "application/x-tar"
      };
    }
    if (buf[0] === 82 && buf[1] === 97 && buf[2] === 114 && buf[3] === 33 && buf[4] === 26 && buf[5] === 7 && (buf[6] === 0 || buf[6] === 1)) {
      return {
        ext: "rar",
        mime: "application/x-rar-compressed"
      };
    }
    if (buf[0] === 31 && buf[1] === 139 && buf[2] === 8) {
      return {
        ext: "gz",
        mime: "application/gzip"
      };
    }
    if (buf[0] === 66 && buf[1] === 90 && buf[2] === 104) {
      return {
        ext: "bz2",
        mime: "application/x-bzip2"
      };
    }
    if (buf[0] === 55 && buf[1] === 122 && buf[2] === 188 && buf[3] === 175 && buf[4] === 39 && buf[5] === 28) {
      return {
        ext: "7z",
        mime: "application/x-7z-compressed"
      };
    }
    if (buf[0] === 120 && buf[1] === 1) {
      return {
        ext: "dmg",
        mime: "application/x-apple-diskimage"
      };
    }
    if (buf[0] === 0 && buf[1] === 0 && buf[2] === 0 && (buf[3] === 24 || buf[3] === 32) && buf[4] === 102 && buf[5] === 116 && buf[6] === 121 && buf[7] === 112 || buf[0] === 51 && buf[1] === 103 && buf[2] === 112 && buf[3] === 53 || buf[0] === 0 && buf[1] === 0 && buf[2] === 0 && buf[3] === 28 && buf[4] === 102 && buf[5] === 116 && buf[6] === 121 && buf[7] === 112 && buf[8] === 109 && buf[9] === 112 && buf[10] === 52 && buf[11] === 50 && buf[16] === 109 && buf[17] === 112 && buf[18] === 52 && buf[19] === 49 && buf[20] === 109 && buf[21] === 112 && buf[22] === 52 && buf[23] === 50 && buf[24] === 105 && buf[25] === 115 && buf[26] === 111 && buf[27] === 109 || buf[0] === 0 && buf[1] === 0 && buf[2] === 0 && buf[3] === 28 && buf[4] === 102 && buf[5] === 116 && buf[6] === 121 && buf[7] === 112 && buf[8] === 105 && buf[9] === 115 && buf[10] === 111 && buf[11] === 109 || buf[0] === 0 && buf[1] === 0 && buf[2] === 0 && buf[3] === 28 && buf[4] === 102 && buf[5] === 116 && buf[6] === 121 && buf[7] === 112 && buf[8] === 109 && buf[9] === 112 && buf[10] === 52 && buf[11] === 50 && buf[12] === 0 && buf[13] === 0 && buf[14] === 0 && buf[15] === 0) {
      return {
        ext: "mp4",
        mime: "video/mp4"
      };
    }
    if (buf[0] === 0 && buf[1] === 0 && buf[2] === 0 && buf[3] === 28 && buf[4] === 102 && buf[5] === 116 && buf[6] === 121 && buf[7] === 112 && buf[8] === 77 && buf[9] === 52 && buf[10] === 86) {
      return {
        ext: "m4v",
        mime: "video/x-m4v"
      };
    }
    if (buf[0] === 77 && buf[1] === 84 && buf[2] === 104 && buf[3] === 100) {
      return {
        ext: "mid",
        mime: "audio/midi"
      };
    }
    if (buf[31] === 109 && buf[32] === 97 && buf[33] === 116 && buf[34] === 114 && buf[35] === 111 && buf[36] === 115 && buf[37] === 107 && buf[38] === 97) {
      return {
        ext: "mkv",
        mime: "video/x-matroska"
      };
    }
    if (buf[0] === 26 && buf[1] === 69 && buf[2] === 223 && buf[3] === 163) {
      return {
        ext: "webm",
        mime: "video/webm"
      };
    }
    if (buf[0] === 0 && buf[1] === 0 && buf[2] === 0 && buf[3] === 20 && buf[4] === 102 && buf[5] === 116 && buf[6] === 121 && buf[7] === 112) {
      return {
        ext: "mov",
        mime: "video/quicktime"
      };
    }
    if (buf[0] === 82 && buf[1] === 73 && buf[2] === 70 && buf[3] === 70 && buf[8] === 65 && buf[9] === 86 && buf[10] === 73) {
      return {
        ext: "avi",
        mime: "video/x-msvideo"
      };
    }
    if (buf[0] === 48 && buf[1] === 38 && buf[2] === 178 && buf[3] === 117 && buf[4] === 142 && buf[5] === 102 && buf[6] === 207 && buf[7] === 17 && buf[8] === 166 && buf[9] === 217) {
      return {
        ext: "wmv",
        mime: "video/x-ms-wmv"
      };
    }
    if (buf[0] === 0 && buf[1] === 0 && buf[2] === 1 && buf[3].toString(16)[0] === "b") {
      return {
        ext: "mpg",
        mime: "video/mpeg"
      };
    }
    if (buf[0] === 73 && buf[1] === 68 && buf[2] === 51 || buf[0] === 255 && buf[1] === 251) {
      return {
        ext: "mp3",
        mime: "audio/mpeg"
      };
    }
    if (buf[4] === 102 && buf[5] === 116 && buf[6] === 121 && buf[7] === 112 && buf[8] === 77 && buf[9] === 52 && buf[10] === 65 || buf[0] === 77 && buf[1] === 52 && buf[2] === 65 && buf[3] === 32) {
      return {
        ext: "m4a",
        mime: "audio/m4a"
      };
    }
    if (buf[28] === 79 && buf[29] === 112 && buf[30] === 117 && buf[31] === 115 && buf[32] === 72 && buf[33] === 101 && buf[34] === 97 && buf[35] === 100) {
      return {
        ext: "opus",
        mime: "audio/opus"
      };
    }
    if (buf[0] === 79 && buf[1] === 103 && buf[2] === 103 && buf[3] === 83) {
      return {
        ext: "ogg",
        mime: "audio/ogg"
      };
    }
    if (buf[0] === 102 && buf[1] === 76 && buf[2] === 97 && buf[3] === 67) {
      return {
        ext: "flac",
        mime: "audio/x-flac"
      };
    }
    if (buf[0] === 82 && buf[1] === 73 && buf[2] === 70 && buf[3] === 70 && buf[8] === 87 && buf[9] === 65 && buf[10] === 86 && buf[11] === 69) {
      return {
        ext: "wav",
        mime: "audio/x-wav"
      };
    }
    if (buf[0] === 35 && buf[1] === 33 && buf[2] === 65 && buf[3] === 77 && buf[4] === 82 && buf[5] === 10) {
      return {
        ext: "amr",
        mime: "audio/amr"
      };
    }
    if (buf[0] === 37 && buf[1] === 80 && buf[2] === 68 && buf[3] === 70) {
      return {
        ext: "pdf",
        mime: "application/pdf"
      };
    }
    if (buf[0] === 77 && buf[1] === 90) {
      return {
        ext: "exe",
        mime: "application/x-msdownload"
      };
    }
    if ((buf[0] === 67 || buf[0] === 70) && buf[1] === 87 && buf[2] === 83) {
      return {
        ext: "swf",
        mime: "application/x-shockwave-flash"
      };
    }
    if (buf[0] === 123 && buf[1] === 92 && buf[2] === 114 && buf[3] === 116 && buf[4] === 102) {
      return {
        ext: "rtf",
        mime: "application/rtf"
      };
    }
    if (buf[0] === 119 && buf[1] === 79 && buf[2] === 70 && buf[3] === 70 && (buf[4] === 0 && buf[5] === 1 && buf[6] === 0 && buf[7] === 0 || buf[4] === 79 && buf[5] === 84 && buf[6] === 84 && buf[7] === 79)) {
      return {
        ext: "woff",
        mime: "application/font-woff"
      };
    }
    if (buf[0] === 119 && buf[1] === 79 && buf[2] === 70 && buf[3] === 50 && (buf[4] === 0 && buf[5] === 1 && buf[6] === 0 && buf[7] === 0 || buf[4] === 79 && buf[5] === 84 && buf[6] === 84 && buf[7] === 79)) {
      return {
        ext: "woff2",
        mime: "application/font-woff"
      };
    }
    if (buf[34] === 76 && buf[35] === 80 && (buf[8] === 0 && buf[9] === 0 && buf[10] === 1 || buf[8] === 1 && buf[9] === 0 && buf[10] === 2 || buf[8] === 2 && buf[9] === 0 && buf[10] === 2)) {
      return {
        ext: "eot",
        mime: "application/octet-stream"
      };
    }
    if (buf[0] === 0 && buf[1] === 1 && buf[2] === 0 && buf[3] === 0 && buf[4] === 0) {
      return {
        ext: "ttf",
        mime: "application/font-sfnt"
      };
    }
    if (buf[0] === 79 && buf[1] === 84 && buf[2] === 84 && buf[3] === 79 && buf[4] === 0) {
      return {
        ext: "otf",
        mime: "application/font-sfnt"
      };
    }
    if (buf[0] === 0 && buf[1] === 0 && buf[2] === 1 && buf[3] === 0) {
      return {
        ext: "ico",
        mime: "image/x-icon"
      };
    }
    if (buf[0] === 70 && buf[1] === 76 && buf[2] === 86 && buf[3] === 1) {
      return {
        ext: "flv",
        mime: "video/x-flv"
      };
    }
    if (buf[0] === 37 && buf[1] === 33) {
      return {
        ext: "ps",
        mime: "application/postscript"
      };
    }
    if (buf[0] === 253 && buf[1] === 55 && buf[2] === 122 && buf[3] === 88 && buf[4] === 90 && buf[5] === 0) {
      return {
        ext: "xz",
        mime: "application/x-xz"
      };
    }
    if (buf[0] === 83 && buf[1] === 81 && buf[2] === 76 && buf[3] === 105) {
      return {
        ext: "sqlite",
        mime: "application/x-sqlite3"
      };
    }
    if (buf[0] === 78 && buf[1] === 69 && buf[2] === 83 && buf[3] === 26) {
      return {
        ext: "nes",
        mime: "application/x-nintendo-nes-rom"
      };
    }
    if (buf[0] === 67 && buf[1] === 114 && buf[2] === 50 && buf[3] === 52) {
      return {
        ext: "crx",
        mime: "application/x-google-chrome-extension"
      };
    }
    if (buf[0] === 77 && buf[1] === 83 && buf[2] === 67 && buf[3] === 70 || buf[0] === 73 && buf[1] === 83 && buf[2] === 99 && buf[3] === 40) {
      return {
        ext: "cab",
        mime: "application/vnd.ms-cab-compressed"
      };
    }
    if (buf[0] === 33 && buf[1] === 60 && buf[2] === 97 && buf[3] === 114 && buf[4] === 99 && buf[5] === 104 && buf[6] === 62 && buf[7] === 10 && buf[8] === 100 && buf[9] === 101 && buf[10] === 98 && buf[11] === 105 && buf[12] === 97 && buf[13] === 110 && buf[14] === 45 && buf[15] === 98 && buf[16] === 105 && buf[17] === 110 && buf[18] === 97 && buf[19] === 114 && buf[20] === 121) {
      return {
        ext: "deb",
        mime: "application/x-deb"
      };
    }
    if (buf[0] === 33 && buf[1] === 60 && buf[2] === 97 && buf[3] === 114 && buf[4] === 99 && buf[5] === 104 && buf[6] === 62) {
      return {
        ext: "ar",
        mime: "application/x-unix-archive"
      };
    }
    if (buf[0] === 237 && buf[1] === 171 && buf[2] === 238 && buf[3] === 219) {
      return {
        ext: "rpm",
        mime: "application/x-rpm"
      };
    }
    if (buf[0] === 31 && buf[1] === 160 || buf[0] === 31 && buf[1] === 157) {
      return {
        ext: "Z",
        mime: "application/x-compress"
      };
    }
    if (buf[0] === 76 && buf[1] === 90 && buf[2] === 73 && buf[3] === 80) {
      return {
        ext: "lz",
        mime: "application/x-lzip"
      };
    }
    if (buf[0] === 208 && buf[1] === 207 && buf[2] === 17 && buf[3] === 224 && buf[4] === 161 && buf[5] === 177 && buf[6] === 26 && buf[7] === 225) {
      return {
        ext: "msi",
        mime: "application/x-msi"
      };
    }
    return null;
  };
});

// node_modules/pinkie/index.js
var require_pinkie = __commonJS((exports, module) => {
  var asyncFlush = function() {
    for (var i = 0;i < asyncQueue.length; i++) {
      asyncQueue[i][0](asyncQueue[i][1]);
    }
    asyncQueue = [];
    asyncTimer = false;
  };
  var asyncCall = function(callback, arg) {
    asyncQueue.push([callback, arg]);
    if (!asyncTimer) {
      asyncTimer = true;
      asyncSetTimer(asyncFlush, 0);
    }
  };
  var invokeResolver = function(resolver, promise2) {
    function resolvePromise(value) {
      resolve2(promise2, value);
    }
    function rejectPromise(reason) {
      reject(promise2, reason);
    }
    try {
      resolver(resolvePromise, rejectPromise);
    } catch (e) {
      rejectPromise(e);
    }
  };
  var invokeCallback = function(subscriber) {
    var owner = subscriber.owner;
    var settled = owner._state;
    var value = owner._data;
    var callback = subscriber[settled];
    var promise2 = subscriber.then;
    if (typeof callback === "function") {
      settled = FULFILLED;
      try {
        value = callback(value);
      } catch (e) {
        reject(promise2, e);
      }
    }
    if (!handleThenable(promise2, value)) {
      if (settled === FULFILLED) {
        resolve2(promise2, value);
      }
      if (settled === REJECTED) {
        reject(promise2, value);
      }
    }
  };
  var handleThenable = function(promise2, value) {
    var resolved;
    try {
      if (promise2 === value) {
        throw new TypeError("A promises callback cannot return that same promise.");
      }
      if (value && (typeof value === "function" || typeof value === "object")) {
        var then = value.then;
        if (typeof then === "function") {
          then.call(value, function(val) {
            if (!resolved) {
              resolved = true;
              if (value === val) {
                fulfill(promise2, val);
              } else {
                resolve2(promise2, val);
              }
            }
          }, function(reason) {
            if (!resolved) {
              resolved = true;
              reject(promise2, reason);
            }
          });
          return true;
        }
      }
    } catch (e) {
      if (!resolved) {
        reject(promise2, e);
      }
      return true;
    }
    return false;
  };
  var resolve2 = function(promise2, value) {
    if (promise2 === value || !handleThenable(promise2, value)) {
      fulfill(promise2, value);
    }
  };
  var fulfill = function(promise2, value) {
    if (promise2._state === PENDING) {
      promise2._state = SETTLED;
      promise2._data = value;
      asyncCall(publishFulfillment, promise2);
    }
  };
  var reject = function(promise2, reason) {
    if (promise2._state === PENDING) {
      promise2._state = SETTLED;
      promise2._data = reason;
      asyncCall(publishRejection, promise2);
    }
  };
  var publish = function(promise2) {
    promise2._then = promise2._then.forEach(invokeCallback);
  };
  var publishFulfillment = function(promise2) {
    promise2._state = FULFILLED;
    publish(promise2);
  };
  var publishRejection = function(promise2) {
    promise2._state = REJECTED;
    publish(promise2);
    if (!promise2._handled && isNode) {
      global.process.emit("unhandledRejection", promise2._data, promise2);
    }
  };
  var notifyRejectionHandled = function(promise2) {
    global.process.emit("rejectionHandled", promise2);
  };
  var Promise2 = function(resolver) {
    if (typeof resolver !== "function") {
      throw new TypeError("Promise resolver " + resolver + " is not a function");
    }
    if (this instanceof Promise2 === false) {
      throw new TypeError("Failed to construct \'Promise\': Please use the \'new\' operator, this object constructor cannot be called as a function.");
    }
    this._then = [];
    invokeResolver(resolver, this);
  };
  var PENDING = "pending";
  var SETTLED = "settled";
  var FULFILLED = "fulfilled";
  var REJECTED = "rejected";
  var NOOP = function() {
  };
  var isNode = typeof global !== "undefined" && typeof global.process !== "undefined" && typeof global.process.emit === "function";
  var asyncSetTimer = typeof setImmediate === "undefined" ? setTimeout : setImmediate;
  var asyncQueue = [];
  var asyncTimer;
  Promise2.prototype = {
    constructor: Promise2,
    _state: PENDING,
    _then: null,
    _data: undefined,
    _handled: false,
    then: function(onFulfillment, onRejection) {
      var subscriber = {
        owner: this,
        then: new this.constructor(NOOP),
        fulfilled: onFulfillment,
        rejected: onRejection
      };
      if ((onRejection || onFulfillment) && !this._handled) {
        this._handled = true;
        if (this._state === REJECTED && isNode) {
          asyncCall(notifyRejectionHandled, this);
        }
      }
      if (this._state === FULFILLED || this._state === REJECTED) {
        asyncCall(invokeCallback, subscriber);
      } else {
        this._then.push(subscriber);
      }
      return subscriber.then;
    },
    catch: function(onRejection) {
      return this.then(null, onRejection);
    }
  };
  Promise2.all = function(promises2) {
    if (!Array.isArray(promises2)) {
      throw new TypeError("You must pass an array to Promise.all().");
    }
    return new Promise2(function(resolve3, reject2) {
      var results = [];
      var remaining = 0;
      function resolver(index) {
        remaining++;
        return function(value) {
          results[index] = value;
          if (!--remaining) {
            resolve3(results);
          }
        };
      }
      for (var i = 0, promise2;i < promises2.length; i++) {
        promise2 = promises2[i];
        if (promise2 && typeof promise2.then === "function") {
          promise2.then(resolver(i), reject2);
        } else {
          results[i] = promise2;
        }
      }
      if (!remaining) {
        resolve3(results);
      }
    });
  };
  Promise2.race = function(promises2) {
    if (!Array.isArray(promises2)) {
      throw new TypeError("You must pass an array to Promise.race().");
    }
    return new Promise2(function(resolve3, reject2) {
      for (var i = 0, promise2;i < promises2.length; i++) {
        promise2 = promises2[i];
        if (promise2 && typeof promise2.then === "function") {
          promise2.then(resolve3, reject2);
        } else {
          resolve3(promise2);
        }
      }
    });
  };
  Promise2.resolve = function(value) {
    if (value && typeof value === "object" && value.constructor === Promise2) {
      return value;
    }
    return new Promise2(function(resolve3) {
      resolve3(value);
    });
  };
  Promise2.reject = function(reason) {
    return new Promise2(function(resolve3, reject2) {
      reject2(reason);
    });
  };
  module.exports = Promise2;
});

// node_modules/pinkie-promise/index.js
var require_pinkie_promise = __commonJS((exports, module) => {
  module.exports = typeof Promise === "function" ? Promise : require_pinkie();
});

// node_modules/object-assign/index.js
var require_object_assign = __commonJS((exports, module) => {
  var toObject = function(val) {
    if (val === null || val === undefined) {
      throw new TypeError("Object.assign cannot be called with null or undefined");
    }
    return Object(val);
  };
  var shouldUseNative = function() {
    try {
      if (!Object.assign) {
        return false;
      }
      var test1 = new String("abc");
      test1[5] = "de";
      if (Object.getOwnPropertyNames(test1)[0] === "5") {
        return false;
      }
      var test2 = {};
      for (var i = 0;i < 10; i++) {
        test2["_" + String.fromCharCode(i)] = i;
      }
      var order2 = Object.getOwnPropertyNames(test2).map(function(n) {
        return test2[n];
      });
      if (order2.join("") !== "0123456789") {
        return false;
      }
      var test3 = {};
      "abcdefghijklmnopqrst".split("").forEach(function(letter) {
        test3[letter] = letter;
      });
      if (Object.keys(Object.assign({}, test3)).join("") !== "abcdefghijklmnopqrst") {
        return false;
      }
      return true;
    } catch (err) {
      return false;
    }
  };
  var getOwnPropertySymbols = Object.getOwnPropertySymbols;
  var hasOwnProperty = Object.prototype.hasOwnProperty;
  var propIsEnumerable = Object.prototype.propertyIsEnumerable;
  module.exports = shouldUseNative() ? Object.assign : function(target, source) {
    var from;
    var to = toObject(target);
    var symbols;
    for (var s = 1;s < arguments.length; s++) {
      from = Object(arguments[s]);
      for (var key in from) {
        if (hasOwnProperty.call(from, key)) {
          to[key] = from[key];
        }
      }
      if (getOwnPropertySymbols) {
        symbols = getOwnPropertySymbols(from);
        for (var i = 0;i < symbols.length; i++) {
          if (propIsEnumerable.call(from, symbols[i])) {
            to[symbols[i]] = from[symbols[i]];
          }
        }
      }
    }
    return to;
  };
});

// node_modules/decompress-unzip/node_modules/get-stream/buffer-stream.js
var require_buffer_stream = __commonJS((exports, module) => {
  var PassThrough = import.meta.require("stream").PassThrough;
  var objectAssign = require_object_assign();
  module.exports = function(opts) {
    opts = objectAssign({}, opts);
    var array = opts.array;
    var encoding = opts.encoding;
    var buffer = encoding === "buffer";
    var objectMode = false;
    if (array) {
      objectMode = !(encoding || buffer);
    } else {
      encoding = encoding || "utf8";
    }
    if (buffer) {
      encoding = null;
    }
    var len = 0;
    var ret = [];
    var stream2 = new PassThrough({ objectMode });
    if (encoding) {
      stream2.setEncoding(encoding);
    }
    stream2.on("data", function(chunk) {
      ret.push(chunk);
      if (objectMode) {
        len = ret.length;
      } else {
        len += chunk.length;
      }
    });
    stream2.getBufferedValue = function() {
      if (array) {
        return ret;
      }
      return buffer ? Buffer.concat(ret, len) : ret.join("");
    };
    stream2.getBufferedLength = function() {
      return len;
    };
    return stream2;
  };
});

// node_modules/decompress-unzip/node_modules/get-stream/index.js
var require_get_stream = __commonJS((exports, module) => {
  var getStream = function(inputStream, opts) {
    if (!inputStream) {
      return Promise2.reject(new Error("Expected a stream"));
    }
    opts = objectAssign({ maxBuffer: Infinity }, opts);
    var maxBuffer = opts.maxBuffer;
    var stream2;
    var clean;
    var p = new Promise2(function(resolve2, reject) {
      stream2 = bufferStream(opts);
      inputStream.once("error", error2);
      inputStream.pipe(stream2);
      stream2.on("data", function() {
        if (stream2.getBufferedLength() > maxBuffer) {
          reject(new Error("maxBuffer exceeded"));
        }
      });
      stream2.once("error", error2);
      stream2.on("end", resolve2);
      clean = function() {
        if (inputStream.unpipe) {
          inputStream.unpipe(stream2);
        }
      };
      function error2(err) {
        if (err) {
          err.bufferedData = stream2.getBufferedValue();
        }
        reject(err);
      }
    });
    p.then(clean, clean);
    return p.then(function() {
      return stream2.getBufferedValue();
    });
  };
  var Promise2 = require_pinkie_promise();
  var objectAssign = require_object_assign();
  var bufferStream = require_buffer_stream();
  module.exports = getStream;
  module.exports.buffer = function(stream2, opts) {
    return getStream(stream2, objectAssign({}, opts, { encoding: "buffer" }));
  };
  module.exports.array = function(stream2, opts) {
    return getStream(stream2, objectAssign({}, opts, { array: true }));
  };
});

// node_modules/decompress-unzip/node_modules/pify/index.js
var require_pify = __commonJS((exports, module) => {
  var processFn = function(fn, P, opts) {
    return function() {
      var that = this;
      var args = new Array(arguments.length);
      for (var i = 0;i < arguments.length; i++) {
        args[i] = arguments[i];
      }
      return new P(function(resolve2, reject) {
        args.push(function(err, result) {
          if (err) {
            reject(err);
          } else if (opts.multiArgs) {
            var results = new Array(arguments.length - 1);
            for (var i2 = 1;i2 < arguments.length; i2++) {
              results[i2 - 1] = arguments[i2];
            }
            resolve2(results);
          } else {
            resolve2(result);
          }
        });
        fn.apply(that, args);
      });
    };
  };
  var pify = module.exports = function(obj, P, opts) {
    if (typeof P !== "function") {
      opts = P;
      P = Promise;
    }
    opts = opts || {};
    opts.exclude = opts.exclude || [/.+Sync$/];
    var filter = function(key) {
      var match = function(pattern) {
        return typeof pattern === "string" ? key === pattern : pattern.test(key);
      };
      return opts.include ? opts.include.some(match) : !opts.exclude.some(match);
    };
    var ret = typeof obj === "function" ? function() {
      if (opts.excludeMain) {
        return obj.apply(this, arguments);
      }
      return processFn(obj, P, opts).apply(this, arguments);
    } : {};
    return Object.keys(obj).reduce(function(ret2, key) {
      var x = obj[key];
      ret2[key] = typeof x === "function" && filter(key) ? processFn(x, P, opts) : x;
      return ret2;
    }, ret);
  };
  pify.all = pify;
});

// node_modules/pend/index.js
var require_pend = __commonJS((exports, module) => {
  var Pend = function() {
    this.pending = 0;
    this.max = Infinity;
    this.listeners = [];
    this.waiting = [];
    this.error = null;
  };
  var pendHold = function(self2) {
    self2.pending += 1;
    var called = false;
    return onCb;
    function onCb(err) {
      if (called)
        throw new Error("callback called twice");
      called = true;
      self2.error = self2.error || err;
      self2.pending -= 1;
      if (self2.waiting.length > 0 && self2.pending < self2.max) {
        pendGo(self2, self2.waiting.shift());
      } else if (self2.pending === 0) {
        var listeners = self2.listeners;
        self2.listeners = [];
        listeners.forEach(cbListener);
      }
    }
    function cbListener(listener) {
      listener(self2.error);
    }
  };
  var pendGo = function(self2, fn) {
    fn(pendHold(self2));
  };
  module.exports = Pend;
  Pend.prototype.go = function(fn) {
    if (this.pending < this.max) {
      pendGo(this, fn);
    } else {
      this.waiting.push(fn);
    }
  };
  Pend.prototype.wait = function(cb) {
    if (this.pending === 0) {
      cb(this.error);
    } else {
      this.listeners.push(cb);
    }
  };
  Pend.prototype.hold = function() {
    return pendHold(this);
  };
});

// node_modules/fd-slicer/index.js
var require_fd_slicer = __commonJS((exports) => {
  var FdSlicer = function(fd, options) {
    options = options || {};
    EventEmitter.call(this);
    this.fd = fd;
    this.pend = new Pend;
    this.pend.max = 1;
    this.refCount = 0;
    this.autoClose = !!options.autoClose;
  };
  var ReadStream = function(context, options) {
    options = options || {};
    Readable.call(this, options);
    this.context = context;
    this.context.ref();
    this.start = options.start || 0;
    this.endOffset = options.end;
    this.pos = this.start;
    this.destroyed = false;
  };
  var WriteStream = function(context, options) {
    options = options || {};
    Writable.call(this, options);
    this.context = context;
    this.context.ref();
    this.start = options.start || 0;
    this.endOffset = options.end == null ? Infinity : +options.end;
    this.bytesWritten = 0;
    this.pos = this.start;
    this.destroyed = false;
    this.on("finish", this.destroy.bind(this));
  };
  var BufferSlicer = function(buffer, options) {
    EventEmitter.call(this);
    options = options || {};
    this.refCount = 0;
    this.buffer = buffer;
    this.maxChunkSize = options.maxChunkSize || Number.MAX_SAFE_INTEGER;
  };
  var createFromBuffer = function(buffer, options) {
    return new BufferSlicer(buffer, options);
  };
  var createFromFd = function(fd, options) {
    return new FdSlicer(fd, options);
  };
  var fs = import.meta.require("fs");
  var util = import.meta.require("util");
  var stream2 = import.meta.require("stream");
  var Readable = stream2.Readable;
  var Writable = stream2.Writable;
  var PassThrough = stream2.PassThrough;
  var Pend = require_pend();
  var EventEmitter = import.meta.require("events").EventEmitter;
  exports.createFromBuffer = createFromBuffer;
  exports.createFromFd = createFromFd;
  exports.BufferSlicer = BufferSlicer;
  exports.FdSlicer = FdSlicer;
  util.inherits(FdSlicer, EventEmitter);
  FdSlicer.prototype.read = function(buffer, offset, length, position, callback) {
    var self2 = this;
    self2.pend.go(function(cb) {
      fs.read(self2.fd, buffer, offset, length, position, function(err, bytesRead, buffer2) {
        cb();
        callback(err, bytesRead, buffer2);
      });
    });
  };
  FdSlicer.prototype.write = function(buffer, offset, length, position, callback) {
    var self2 = this;
    self2.pend.go(function(cb) {
      fs.write(self2.fd, buffer, offset, length, position, function(err, written, buffer2) {
        cb();
        callback(err, written, buffer2);
      });
    });
  };
  FdSlicer.prototype.createReadStream = function(options) {
    return new ReadStream(this, options);
  };
  FdSlicer.prototype.createWriteStream = function(options) {
    return new WriteStream(this, options);
  };
  FdSlicer.prototype.ref = function() {
    this.refCount += 1;
  };
  FdSlicer.prototype.unref = function() {
    var self2 = this;
    self2.refCount -= 1;
    if (self2.refCount > 0)
      return;
    if (self2.refCount < 0)
      throw new Error("invalid unref");
    if (self2.autoClose) {
      fs.close(self2.fd, onCloseDone);
    }
    function onCloseDone(err) {
      if (err) {
        self2.emit("error", err);
      } else {
        self2.emit("close");
      }
    }
  };
  util.inherits(ReadStream, Readable);
  ReadStream.prototype._read = function(n) {
    var self2 = this;
    if (self2.destroyed)
      return;
    var toRead = Math.min(self2._readableState.highWaterMark, n);
    if (self2.endOffset != null) {
      toRead = Math.min(toRead, self2.endOffset - self2.pos);
    }
    if (toRead <= 0) {
      self2.destroyed = true;
      self2.push(null);
      self2.context.unref();
      return;
    }
    self2.context.pend.go(function(cb) {
      if (self2.destroyed)
        return cb();
      var buffer = new Buffer(toRead);
      fs.read(self2.context.fd, buffer, 0, toRead, self2.pos, function(err, bytesRead) {
        if (err) {
          self2.destroy(err);
        } else if (bytesRead === 0) {
          self2.destroyed = true;
          self2.push(null);
          self2.context.unref();
        } else {
          self2.pos += bytesRead;
          self2.push(buffer.slice(0, bytesRead));
        }
        cb();
      });
    });
  };
  ReadStream.prototype.destroy = function(err) {
    if (this.destroyed)
      return;
    err = err || new Error("stream destroyed");
    this.destroyed = true;
    this.emit("error", err);
    this.context.unref();
  };
  util.inherits(WriteStream, Writable);
  WriteStream.prototype._write = function(buffer, encoding, callback) {
    var self2 = this;
    if (self2.destroyed)
      return;
    if (self2.pos + buffer.length > self2.endOffset) {
      var err = new Error("maximum file length exceeded");
      err.code = "ETOOBIG";
      self2.destroy();
      callback(err);
      return;
    }
    self2.context.pend.go(function(cb) {
      if (self2.destroyed)
        return cb();
      fs.write(self2.context.fd, buffer, 0, buffer.length, self2.pos, function(err2, bytes) {
        if (err2) {
          self2.destroy();
          cb();
          callback(err2);
        } else {
          self2.bytesWritten += bytes;
          self2.pos += bytes;
          self2.emit("progress");
          cb();
          callback();
        }
      });
    });
  };
  WriteStream.prototype.destroy = function() {
    if (this.destroyed)
      return;
    this.destroyed = true;
    this.context.unref();
  };
  util.inherits(BufferSlicer, EventEmitter);
  BufferSlicer.prototype.read = function(buffer, offset, length, position, callback) {
    var end = position + length;
    var delta = end - this.buffer.length;
    var written = delta > 0 ? delta : length;
    this.buffer.copy(buffer, offset, position, end);
    setImmediate(function() {
      callback(null, written);
    });
  };
  BufferSlicer.prototype.write = function(buffer, offset, length, position, callback) {
    buffer.copy(this.buffer, position, offset, offset + length);
    setImmediate(function() {
      callback(null, length, buffer);
    });
  };
  BufferSlicer.prototype.createReadStream = function(options) {
    options = options || {};
    var readStream = new PassThrough(options);
    readStream.destroyed = false;
    readStream.start = options.start || 0;
    readStream.endOffset = options.end;
    readStream.pos = readStream.endOffset || this.buffer.length;
    var entireSlice = this.buffer.slice(readStream.start, readStream.pos);
    var offset = 0;
    while (true) {
      var nextOffset = offset + this.maxChunkSize;
      if (nextOffset >= entireSlice.length) {
        if (offset < entireSlice.length) {
          readStream.write(entireSlice.slice(offset, entireSlice.length));
        }
        break;
      }
      readStream.write(entireSlice.slice(offset, nextOffset));
      offset = nextOffset;
    }
    readStream.end();
    readStream.destroy = function() {
      readStream.destroyed = true;
    };
    return readStream;
  };
  BufferSlicer.prototype.createWriteStream = function(options) {
    var bufferSlicer = this;
    options = options || {};
    var writeStream = new Writable(options);
    writeStream.start = options.start || 0;
    writeStream.endOffset = options.end == null ? this.buffer.length : +options.end;
    writeStream.bytesWritten = 0;
    writeStream.pos = writeStream.start;
    writeStream.destroyed = false;
    writeStream._write = function(buffer, encoding, callback) {
      if (writeStream.destroyed)
        return;
      var end = writeStream.pos + buffer.length;
      if (end > writeStream.endOffset) {
        var err = new Error("maximum file length exceeded");
        err.code = "ETOOBIG";
        writeStream.destroyed = true;
        callback(err);
        return;
      }
      buffer.copy(bufferSlicer.buffer, writeStream.pos, 0, buffer.length);
      writeStream.bytesWritten += buffer.length;
      writeStream.pos = end;
      writeStream.emit("progress");
      callback();
    };
    writeStream.destroy = function() {
      writeStream.destroyed = true;
    };
    return writeStream;
  };
  BufferSlicer.prototype.ref = function() {
    this.refCount += 1;
  };
  BufferSlicer.prototype.unref = function() {
    this.refCount -= 1;
    if (this.refCount < 0) {
      throw new Error("invalid unref");
    }
  };
});

// node_modules/buffer-crc32/index.js
var require_buffer_crc32 = __commonJS((exports, module) => {
  var ensureBuffer = function(input) {
    if (Buffer4.isBuffer(input)) {
      return input;
    }
    var hasNewBufferAPI = typeof Buffer4.alloc === "function" && typeof Buffer4.from === "function";
    if (typeof input === "number") {
      return hasNewBufferAPI ? Buffer4.alloc(input) : new Buffer4(input);
    } else if (typeof input === "string") {
      return hasNewBufferAPI ? Buffer4.from(input) : new Buffer4(input);
    } else {
      throw new Error("input must be buffer, number, or string, received " + typeof input);
    }
  };
  var bufferizeInt = function(num) {
    var tmp = ensureBuffer(4);
    tmp.writeInt32BE(num, 0);
    return tmp;
  };
  var _crc32 = function(buf, previous) {
    buf = ensureBuffer(buf);
    if (Buffer4.isBuffer(previous)) {
      previous = previous.readUInt32BE(0);
    }
    var crc = ~~previous ^ -1;
    for (var n = 0;n < buf.length; n++) {
      crc = CRC_TABLE[(crc ^ buf[n]) & 255] ^ crc >>> 8;
    }
    return crc ^ -1;
  };
  var crc32 = function() {
    return bufferizeInt(_crc32.apply(null, arguments));
  };
  var Buffer4 = import.meta.require("buffer").Buffer;
  var CRC_TABLE = [
    0,
    1996959894,
    3993919788,
    2567524794,
    124634137,
    1886057615,
    3915621685,
    2657392035,
    249268274,
    2044508324,
    3772115230,
    2547177864,
    162941995,
    2125561021,
    3887607047,
    2428444049,
    498536548,
    1789927666,
    4089016648,
    2227061214,
    450548861,
    1843258603,
    4107580753,
    2211677639,
    325883990,
    1684777152,
    4251122042,
    2321926636,
    335633487,
    1661365465,
    4195302755,
    2366115317,
    997073096,
    1281953886,
    3579855332,
    2724688242,
    1006888145,
    1258607687,
    3524101629,
    2768942443,
    901097722,
    1119000684,
    3686517206,
    2898065728,
    853044451,
    1172266101,
    3705015759,
    2882616665,
    651767980,
    1373503546,
    3369554304,
    3218104598,
    565507253,
    1454621731,
    3485111705,
    3099436303,
    671266974,
    1594198024,
    3322730930,
    2970347812,
    795835527,
    1483230225,
    3244367275,
    3060149565,
    1994146192,
    31158534,
    2563907772,
    4023717930,
    1907459465,
    112637215,
    2680153253,
    3904427059,
    2013776290,
    251722036,
    2517215374,
    3775830040,
    2137656763,
    141376813,
    2439277719,
    3865271297,
    1802195444,
    476864866,
    2238001368,
    4066508878,
    1812370925,
    453092731,
    2181625025,
    4111451223,
    1706088902,
    314042704,
    2344532202,
    4240017532,
    1658658271,
    366619977,
    2362670323,
    4224994405,
    1303535960,
    984961486,
    2747007092,
    3569037538,
    1256170817,
    1037604311,
    2765210733,
    3554079995,
    1131014506,
    879679996,
    2909243462,
    3663771856,
    1141124467,
    855842277,
    2852801631,
    3708648649,
    1342533948,
    654459306,
    3188396048,
    3373015174,
    1466479909,
    544179635,
    3110523913,
    3462522015,
    1591671054,
    702138776,
    2966460450,
    3352799412,
    1504918807,
    783551873,
    3082640443,
    3233442989,
    3988292384,
    2596254646,
    62317068,
    1957810842,
    3939845945,
    2647816111,
    81470997,
    1943803523,
    3814918930,
    2489596804,
    225274430,
    2053790376,
    3826175755,
    2466906013,
    167816743,
    2097651377,
    4027552580,
    2265490386,
    503444072,
    1762050814,
    4150417245,
    2154129355,
    426522225,
    1852507879,
    4275313526,
    2312317920,
    282753626,
    1742555852,
    4189708143,
    2394877945,
    397917763,
    1622183637,
    3604390888,
    2714866558,
    953729732,
    1340076626,
    3518719985,
    2797360999,
    1068828381,
    1219638859,
    3624741850,
    2936675148,
    906185462,
    1090812512,
    3747672003,
    2825379669,
    829329135,
    1181335161,
    3412177804,
    3160834842,
    628085408,
    1382605366,
    3423369109,
    3138078467,
    570562233,
    1426400815,
    3317316542,
    2998733608,
    733239954,
    1555261956,
    3268935591,
    3050360625,
    752459403,
    1541320221,
    2607071920,
    3965973030,
    1969922972,
    40735498,
    2617837225,
    3943577151,
    1913087877,
    83908371,
    2512341634,
    3803740692,
    2075208622,
    213261112,
    2463272603,
    3855990285,
    2094854071,
    198958881,
    2262029012,
    4057260610,
    1759359992,
    534414190,
    2176718541,
    4139329115,
    1873836001,
    414664567,
    2282248934,
    4279200368,
    1711684554,
    285281116,
    2405801727,
    4167216745,
    1634467795,
    376229701,
    2685067896,
    3608007406,
    1308918612,
    956543938,
    2808555105,
    3495958263,
    1231636301,
    1047427035,
    2932959818,
    3654703836,
    1088359270,
    936918000,
    2847714899,
    3736837829,
    1202900863,
    817233897,
    3183342108,
    3401237130,
    1404277552,
    615818150,
    3134207493,
    3453421203,
    1423857449,
    601450431,
    3009837614,
    3294710456,
    1567103746,
    711928724,
    3020668471,
    3272380065,
    1510334235,
    755167117
  ];
  if (typeof Int32Array !== "undefined") {
    CRC_TABLE = new Int32Array(CRC_TABLE);
  }
  crc32.signed = function() {
    return _crc32.apply(null, arguments);
  };
  crc32.unsigned = function() {
    return _crc32.apply(null, arguments) >>> 0;
  };
  module.exports = crc32;
});

// node_modules/yauzl/index.js
var require_yauzl = __commonJS((exports) => {
  var open = function(path3, options, callback) {
    if (typeof options === "function") {
      callback = options;
      options = null;
    }
    if (options == null)
      options = {};
    if (options.autoClose == null)
      options.autoClose = true;
    if (options.lazyEntries == null)
      options.lazyEntries = false;
    if (options.decodeStrings == null)
      options.decodeStrings = true;
    if (options.validateEntrySizes == null)
      options.validateEntrySizes = true;
    if (options.strictFileNames == null)
      options.strictFileNames = false;
    if (callback == null)
      callback = defaultCallback;
    fs.open(path3, "r", function(err, fd) {
      if (err)
        return callback(err);
      fromFd(fd, options, function(err2, zipfile) {
        if (err2)
          fs.close(fd, defaultCallback);
        callback(err2, zipfile);
      });
    });
  };
  var fromFd = function(fd, options, callback) {
    if (typeof options === "function") {
      callback = options;
      options = null;
    }
    if (options == null)
      options = {};
    if (options.autoClose == null)
      options.autoClose = false;
    if (options.lazyEntries == null)
      options.lazyEntries = false;
    if (options.decodeStrings == null)
      options.decodeStrings = true;
    if (options.validateEntrySizes == null)
      options.validateEntrySizes = true;
    if (options.strictFileNames == null)
      options.strictFileNames = false;
    if (callback == null)
      callback = defaultCallback;
    fs.fstat(fd, function(err, stats) {
      if (err)
        return callback(err);
      var reader = fd_slicer.createFromFd(fd, { autoClose: true });
      fromRandomAccessReader(reader, stats.size, options, callback);
    });
  };
  var fromBuffer = function(buffer, options, callback) {
    if (typeof options === "function") {
      callback = options;
      options = null;
    }
    if (options == null)
      options = {};
    options.autoClose = false;
    if (options.lazyEntries == null)
      options.lazyEntries = false;
    if (options.decodeStrings == null)
      options.decodeStrings = true;
    if (options.validateEntrySizes == null)
      options.validateEntrySizes = true;
    if (options.strictFileNames == null)
      options.strictFileNames = false;
    var reader = fd_slicer.createFromBuffer(buffer, { maxChunkSize: 65536 });
    fromRandomAccessReader(reader, buffer.length, options, callback);
  };
  var fromRandomAccessReader = function(reader, totalSize, options, callback) {
    if (typeof options === "function") {
      callback = options;
      options = null;
    }
    if (options == null)
      options = {};
    if (options.autoClose == null)
      options.autoClose = true;
    if (options.lazyEntries == null)
      options.lazyEntries = false;
    if (options.decodeStrings == null)
      options.decodeStrings = true;
    var decodeStrings = !!options.decodeStrings;
    if (options.validateEntrySizes == null)
      options.validateEntrySizes = true;
    if (options.strictFileNames == null)
      options.strictFileNames = false;
    if (callback == null)
      callback = defaultCallback;
    if (typeof totalSize !== "number")
      throw new Error("expected totalSize parameter to be a number");
    if (totalSize > Number.MAX_SAFE_INTEGER) {
      throw new Error("zip file too large. only file sizes up to 2^52 are supported due to JavaScript's Number type being an IEEE 754 double.");
    }
    reader.ref();
    var eocdrWithoutCommentSize = 22;
    var maxCommentSize = 65535;
    var bufferSize = Math.min(eocdrWithoutCommentSize + maxCommentSize, totalSize);
    var buffer = newBuffer(bufferSize);
    var bufferReadStart = totalSize - buffer.length;
    readAndAssertNoEof(reader, buffer, 0, bufferSize, bufferReadStart, function(err) {
      if (err)
        return callback(err);
      for (var i = bufferSize - eocdrWithoutCommentSize;i >= 0; i -= 1) {
        if (buffer.readUInt32LE(i) !== 101010256)
          continue;
        var eocdrBuffer = buffer.slice(i);
        var diskNumber = eocdrBuffer.readUInt16LE(4);
        if (diskNumber !== 0) {
          return callback(new Error("multi-disk zip files are not supported: found disk number: " + diskNumber));
        }
        var entryCount = eocdrBuffer.readUInt16LE(10);
        var centralDirectoryOffset = eocdrBuffer.readUInt32LE(16);
        var commentLength = eocdrBuffer.readUInt16LE(20);
        var expectedCommentLength = eocdrBuffer.length - eocdrWithoutCommentSize;
        if (commentLength !== expectedCommentLength) {
          return callback(new Error("invalid comment length. expected: " + expectedCommentLength + ". found: " + commentLength));
        }
        var comment = decodeStrings ? decodeBuffer(eocdrBuffer, 22, eocdrBuffer.length, false) : eocdrBuffer.slice(22);
        if (!(entryCount === 65535 || centralDirectoryOffset === 4294967295)) {
          return callback(null, new ZipFile(reader, centralDirectoryOffset, totalSize, entryCount, comment, options.autoClose, options.lazyEntries, decodeStrings, options.validateEntrySizes, options.strictFileNames));
        }
        var zip64EocdlBuffer = newBuffer(20);
        var zip64EocdlOffset = bufferReadStart + i - zip64EocdlBuffer.length;
        readAndAssertNoEof(reader, zip64EocdlBuffer, 0, zip64EocdlBuffer.length, zip64EocdlOffset, function(err2) {
          if (err2)
            return callback(err2);
          if (zip64EocdlBuffer.readUInt32LE(0) !== 117853008) {
            return callback(new Error("invalid zip64 end of central directory locator signature"));
          }
          var zip64EocdrOffset = readUInt64LE(zip64EocdlBuffer, 8);
          var zip64EocdrBuffer = newBuffer(56);
          readAndAssertNoEof(reader, zip64EocdrBuffer, 0, zip64EocdrBuffer.length, zip64EocdrOffset, function(err3) {
            if (err3)
              return callback(err3);
            if (zip64EocdrBuffer.readUInt32LE(0) !== 101075792) {
              return callback(new Error("invalid zip64 end of central directory record signature"));
            }
            entryCount = readUInt64LE(zip64EocdrBuffer, 32);
            centralDirectoryOffset = readUInt64LE(zip64EocdrBuffer, 48);
            return callback(null, new ZipFile(reader, centralDirectoryOffset, totalSize, entryCount, comment, options.autoClose, options.lazyEntries, decodeStrings, options.validateEntrySizes, options.strictFileNames));
          });
        });
        return;
      }
      callback(new Error("end of central directory record signature not found"));
    });
  };
  var ZipFile = function(reader, centralDirectoryOffset, fileSize, entryCount, comment, autoClose, lazyEntries, decodeStrings, validateEntrySizes, strictFileNames) {
    var self2 = this;
    EventEmitter.call(self2);
    self2.reader = reader;
    self2.reader.on("error", function(err) {
      emitError(self2, err);
    });
    self2.reader.once("close", function() {
      self2.emit("close");
    });
    self2.readEntryCursor = centralDirectoryOffset;
    self2.fileSize = fileSize;
    self2.entryCount = entryCount;
    self2.comment = comment;
    self2.entriesRead = 0;
    self2.autoClose = !!autoClose;
    self2.lazyEntries = !!lazyEntries;
    self2.decodeStrings = !!decodeStrings;
    self2.validateEntrySizes = !!validateEntrySizes;
    self2.strictFileNames = !!strictFileNames;
    self2.isOpen = true;
    self2.emittedError = false;
    if (!self2.lazyEntries)
      self2._readEntry();
  };
  var emitErrorAndAutoClose = function(self2, err) {
    if (self2.autoClose)
      self2.close();
    emitError(self2, err);
  };
  var emitError = function(self2, err) {
    if (self2.emittedError)
      return;
    self2.emittedError = true;
    self2.emit("error", err);
  };
  var Entry = function() {
  };
  var dosDateTimeToDate = function(date, time) {
    var day = date & 31;
    var month = (date >> 5 & 15) - 1;
    var year = (date >> 9 & 127) + 1980;
    var millisecond = 0;
    var second = (time & 31) * 2;
    var minute = time >> 5 & 63;
    var hour = time >> 11 & 31;
    return new Date(year, month, day, hour, minute, second, millisecond);
  };
  var validateFileName = function(fileName) {
    if (fileName.indexOf("\\") !== -1) {
      return "invalid characters in fileName: " + fileName;
    }
    if (/^[a-zA-Z]:/.test(fileName) || /^\//.test(fileName)) {
      return "absolute path: " + fileName;
    }
    if (fileName.split("/").indexOf("..") !== -1) {
      return "invalid relative path: " + fileName;
    }
    return null;
  };
  var readAndAssertNoEof = function(reader, buffer, offset, length, position, callback) {
    if (length === 0) {
      return setImmediate(function() {
        callback(null, newBuffer(0));
      });
    }
    reader.read(buffer, offset, length, position, function(err, bytesRead) {
      if (err)
        return callback(err);
      if (bytesRead < length) {
        return callback(new Error("unexpected EOF"));
      }
      callback();
    });
  };
  var AssertByteCountStream = function(byteCount) {
    Transform.call(this);
    this.actualByteCount = 0;
    this.expectedByteCount = byteCount;
  };
  var RandomAccessReader = function() {
    EventEmitter.call(this);
    this.refCount = 0;
  };
  var RefUnrefFilter = function(context) {
    PassThrough.call(this);
    this.context = context;
    this.context.ref();
    this.unreffedYet = false;
  };
  var decodeBuffer = function(buffer, start, end, isUtf8) {
    if (isUtf8) {
      return buffer.toString("utf8", start, end);
    } else {
      var result = "";
      for (var i = start;i < end; i++) {
        result += cp437[buffer[i]];
      }
      return result;
    }
  };
  var readUInt64LE = function(buffer, offset) {
    var lower32 = buffer.readUInt32LE(offset);
    var upper32 = buffer.readUInt32LE(offset + 4);
    return upper32 * 4294967296 + lower32;
  };
  var defaultCallback = function(err) {
    if (err)
      throw err;
  };
  var fs = import.meta.require("fs");
  var zlib = import.meta.require("zlib");
  var fd_slicer = require_fd_slicer();
  var crc32 = require_buffer_crc32();
  var util = import.meta.require("util");
  var EventEmitter = import.meta.require("events").EventEmitter;
  var Transform = import.meta.require("stream").Transform;
  var PassThrough = import.meta.require("stream").PassThrough;
  var Writable = import.meta.require("stream").Writable;
  exports.open = open;
  exports.fromFd = fromFd;
  exports.fromBuffer = fromBuffer;
  exports.fromRandomAccessReader = fromRandomAccessReader;
  exports.dosDateTimeToDate = dosDateTimeToDate;
  exports.validateFileName = validateFileName;
  exports.ZipFile = ZipFile;
  exports.Entry = Entry;
  exports.RandomAccessReader = RandomAccessReader;
  util.inherits(ZipFile, EventEmitter);
  ZipFile.prototype.close = function() {
    if (!this.isOpen)
      return;
    this.isOpen = false;
    this.reader.unref();
  };
  ZipFile.prototype.readEntry = function() {
    if (!this.lazyEntries)
      throw new Error("readEntry() called without lazyEntries:true");
    this._readEntry();
  };
  ZipFile.prototype._readEntry = function() {
    var self2 = this;
    if (self2.entryCount === self2.entriesRead) {
      setImmediate(function() {
        if (self2.autoClose)
          self2.close();
        if (self2.emittedError)
          return;
        self2.emit("end");
      });
      return;
    }
    if (self2.emittedError)
      return;
    var buffer = newBuffer(46);
    readAndAssertNoEof(self2.reader, buffer, 0, buffer.length, self2.readEntryCursor, function(err) {
      if (err)
        return emitErrorAndAutoClose(self2, err);
      if (self2.emittedError)
        return;
      var entry = new Entry;
      var signature = buffer.readUInt32LE(0);
      if (signature !== 33639248)
        return emitErrorAndAutoClose(self2, new Error("invalid central directory file header signature: 0x" + signature.toString(16)));
      entry.versionMadeBy = buffer.readUInt16LE(4);
      entry.versionNeededToExtract = buffer.readUInt16LE(6);
      entry.generalPurposeBitFlag = buffer.readUInt16LE(8);
      entry.compressionMethod = buffer.readUInt16LE(10);
      entry.lastModFileTime = buffer.readUInt16LE(12);
      entry.lastModFileDate = buffer.readUInt16LE(14);
      entry.crc32 = buffer.readUInt32LE(16);
      entry.compressedSize = buffer.readUInt32LE(20);
      entry.uncompressedSize = buffer.readUInt32LE(24);
      entry.fileNameLength = buffer.readUInt16LE(28);
      entry.extraFieldLength = buffer.readUInt16LE(30);
      entry.fileCommentLength = buffer.readUInt16LE(32);
      entry.internalFileAttributes = buffer.readUInt16LE(36);
      entry.externalFileAttributes = buffer.readUInt32LE(38);
      entry.relativeOffsetOfLocalHeader = buffer.readUInt32LE(42);
      if (entry.generalPurposeBitFlag & 64)
        return emitErrorAndAutoClose(self2, new Error("strong encryption is not supported"));
      self2.readEntryCursor += 46;
      buffer = newBuffer(entry.fileNameLength + entry.extraFieldLength + entry.fileCommentLength);
      readAndAssertNoEof(self2.reader, buffer, 0, buffer.length, self2.readEntryCursor, function(err2) {
        if (err2)
          return emitErrorAndAutoClose(self2, err2);
        if (self2.emittedError)
          return;
        var isUtf8 = (entry.generalPurposeBitFlag & 2048) !== 0;
        entry.fileName = self2.decodeStrings ? decodeBuffer(buffer, 0, entry.fileNameLength, isUtf8) : buffer.slice(0, entry.fileNameLength);
        var fileCommentStart = entry.fileNameLength + entry.extraFieldLength;
        var extraFieldBuffer = buffer.slice(entry.fileNameLength, fileCommentStart);
        entry.extraFields = [];
        var i = 0;
        while (i < extraFieldBuffer.length - 3) {
          var headerId = extraFieldBuffer.readUInt16LE(i + 0);
          var dataSize = extraFieldBuffer.readUInt16LE(i + 2);
          var dataStart = i + 4;
          var dataEnd = dataStart + dataSize;
          if (dataEnd > extraFieldBuffer.length)
            return emitErrorAndAutoClose(self2, new Error("extra field length exceeds extra field buffer size"));
          var dataBuffer = newBuffer(dataSize);
          extraFieldBuffer.copy(dataBuffer, 0, dataStart, dataEnd);
          entry.extraFields.push({
            id: headerId,
            data: dataBuffer
          });
          i = dataEnd;
        }
        entry.fileComment = self2.decodeStrings ? decodeBuffer(buffer, fileCommentStart, fileCommentStart + entry.fileCommentLength, isUtf8) : buffer.slice(fileCommentStart, fileCommentStart + entry.fileCommentLength);
        entry.comment = entry.fileComment;
        self2.readEntryCursor += buffer.length;
        self2.entriesRead += 1;
        if (entry.uncompressedSize === 4294967295 || entry.compressedSize === 4294967295 || entry.relativeOffsetOfLocalHeader === 4294967295) {
          var zip64EiefBuffer = null;
          for (var i = 0;i < entry.extraFields.length; i++) {
            var extraField = entry.extraFields[i];
            if (extraField.id === 1) {
              zip64EiefBuffer = extraField.data;
              break;
            }
          }
          if (zip64EiefBuffer == null) {
            return emitErrorAndAutoClose(self2, new Error("expected zip64 extended information extra field"));
          }
          var index = 0;
          if (entry.uncompressedSize === 4294967295) {
            if (index + 8 > zip64EiefBuffer.length) {
              return emitErrorAndAutoClose(self2, new Error("zip64 extended information extra field does not include uncompressed size"));
            }
            entry.uncompressedSize = readUInt64LE(zip64EiefBuffer, index);
            index += 8;
          }
          if (entry.compressedSize === 4294967295) {
            if (index + 8 > zip64EiefBuffer.length) {
              return emitErrorAndAutoClose(self2, new Error("zip64 extended information extra field does not include compressed size"));
            }
            entry.compressedSize = readUInt64LE(zip64EiefBuffer, index);
            index += 8;
          }
          if (entry.relativeOffsetOfLocalHeader === 4294967295) {
            if (index + 8 > zip64EiefBuffer.length) {
              return emitErrorAndAutoClose(self2, new Error("zip64 extended information extra field does not include relative header offset"));
            }
            entry.relativeOffsetOfLocalHeader = readUInt64LE(zip64EiefBuffer, index);
            index += 8;
          }
        }
        if (self2.decodeStrings) {
          for (var i = 0;i < entry.extraFields.length; i++) {
            var extraField = entry.extraFields[i];
            if (extraField.id === 28789) {
              if (extraField.data.length < 6) {
                continue;
              }
              if (extraField.data.readUInt8(0) !== 1) {
                continue;
              }
              var oldNameCrc32 = extraField.data.readUInt32LE(1);
              if (crc32.unsigned(buffer.slice(0, entry.fileNameLength)) !== oldNameCrc32) {
                continue;
              }
              entry.fileName = decodeBuffer(extraField.data, 5, extraField.data.length, true);
              break;
            }
          }
        }
        if (self2.validateEntrySizes && entry.compressionMethod === 0) {
          var expectedCompressedSize = entry.uncompressedSize;
          if (entry.isEncrypted()) {
            expectedCompressedSize += 12;
          }
          if (entry.compressedSize !== expectedCompressedSize) {
            var msg = "compressed/uncompressed size mismatch for stored file: " + entry.compressedSize + " != " + entry.uncompressedSize;
            return emitErrorAndAutoClose(self2, new Error(msg));
          }
        }
        if (self2.decodeStrings) {
          if (!self2.strictFileNames) {
            entry.fileName = entry.fileName.replace(/\\/g, "/");
          }
          var errorMessage = validateFileName(entry.fileName, self2.validateFileNameOptions);
          if (errorMessage != null)
            return emitErrorAndAutoClose(self2, new Error(errorMessage));
        }
        self2.emit("entry", entry);
        if (!self2.lazyEntries)
          self2._readEntry();
      });
    });
  };
  ZipFile.prototype.openReadStream = function(entry, options, callback) {
    var self2 = this;
    var relativeStart = 0;
    var relativeEnd = entry.compressedSize;
    if (callback == null) {
      callback = options;
      options = {};
    } else {
      if (options.decrypt != null) {
        if (!entry.isEncrypted()) {
          throw new Error("options.decrypt can only be specified for encrypted entries");
        }
        if (options.decrypt !== false)
          throw new Error("invalid options.decrypt value: " + options.decrypt);
        if (entry.isCompressed()) {
          if (options.decompress !== false)
            throw new Error("entry is encrypted and compressed, and options.decompress !== false");
        }
      }
      if (options.decompress != null) {
        if (!entry.isCompressed()) {
          throw new Error("options.decompress can only be specified for compressed entries");
        }
        if (!(options.decompress === false || options.decompress === true)) {
          throw new Error("invalid options.decompress value: " + options.decompress);
        }
      }
      if (options.start != null || options.end != null) {
        if (entry.isCompressed() && options.decompress !== false) {
          throw new Error("start/end range not allowed for compressed entry without options.decompress === false");
        }
        if (entry.isEncrypted() && options.decrypt !== false) {
          throw new Error("start/end range not allowed for encrypted entry without options.decrypt === false");
        }
      }
      if (options.start != null) {
        relativeStart = options.start;
        if (relativeStart < 0)
          throw new Error("options.start < 0");
        if (relativeStart > entry.compressedSize)
          throw new Error("options.start > entry.compressedSize");
      }
      if (options.end != null) {
        relativeEnd = options.end;
        if (relativeEnd < 0)
          throw new Error("options.end < 0");
        if (relativeEnd > entry.compressedSize)
          throw new Error("options.end > entry.compressedSize");
        if (relativeEnd < relativeStart)
          throw new Error("options.end < options.start");
      }
    }
    if (!self2.isOpen)
      return callback(new Error("closed"));
    if (entry.isEncrypted()) {
      if (options.decrypt !== false)
        return callback(new Error("entry is encrypted, and options.decrypt !== false"));
    }
    self2.reader.ref();
    var buffer = newBuffer(30);
    readAndAssertNoEof(self2.reader, buffer, 0, buffer.length, entry.relativeOffsetOfLocalHeader, function(err) {
      try {
        if (err)
          return callback(err);
        var signature = buffer.readUInt32LE(0);
        if (signature !== 67324752) {
          return callback(new Error("invalid local file header signature: 0x" + signature.toString(16)));
        }
        var fileNameLength = buffer.readUInt16LE(26);
        var extraFieldLength = buffer.readUInt16LE(28);
        var localFileHeaderEnd = entry.relativeOffsetOfLocalHeader + buffer.length + fileNameLength + extraFieldLength;
        var decompress;
        if (entry.compressionMethod === 0) {
          decompress = false;
        } else if (entry.compressionMethod === 8) {
          decompress = options.decompress != null ? options.decompress : true;
        } else {
          return callback(new Error("unsupported compression method: " + entry.compressionMethod));
        }
        var fileDataStart = localFileHeaderEnd;
        var fileDataEnd = fileDataStart + entry.compressedSize;
        if (entry.compressedSize !== 0) {
          if (fileDataEnd > self2.fileSize) {
            return callback(new Error("file data overflows file bounds: " + fileDataStart + " + " + entry.compressedSize + " > " + self2.fileSize));
          }
        }
        var readStream = self2.reader.createReadStream({
          start: fileDataStart + relativeStart,
          end: fileDataStart + relativeEnd
        });
        var endpointStream = readStream;
        if (decompress) {
          var destroyed = false;
          var inflateFilter = zlib.createInflateRaw();
          readStream.on("error", function(err2) {
            setImmediate(function() {
              if (!destroyed)
                inflateFilter.emit("error", err2);
            });
          });
          readStream.pipe(inflateFilter);
          if (self2.validateEntrySizes) {
            endpointStream = new AssertByteCountStream(entry.uncompressedSize);
            inflateFilter.on("error", function(err2) {
              setImmediate(function() {
                if (!destroyed)
                  endpointStream.emit("error", err2);
              });
            });
            inflateFilter.pipe(endpointStream);
          } else {
            endpointStream = inflateFilter;
          }
          endpointStream.destroy = function() {
            destroyed = true;
            if (inflateFilter !== endpointStream)
              inflateFilter.unpipe(endpointStream);
            readStream.unpipe(inflateFilter);
            readStream.destroy();
          };
        }
        callback(null, endpointStream);
      } finally {
        self2.reader.unref();
      }
    });
  };
  Entry.prototype.getLastModDate = function() {
    return dosDateTimeToDate(this.lastModFileDate, this.lastModFileTime);
  };
  Entry.prototype.isEncrypted = function() {
    return (this.generalPurposeBitFlag & 1) !== 0;
  };
  Entry.prototype.isCompressed = function() {
    return this.compressionMethod === 8;
  };
  util.inherits(AssertByteCountStream, Transform);
  AssertByteCountStream.prototype._transform = function(chunk, encoding, cb) {
    this.actualByteCount += chunk.length;
    if (this.actualByteCount > this.expectedByteCount) {
      var msg = "too many bytes in the stream. expected " + this.expectedByteCount + ". got at least " + this.actualByteCount;
      return cb(new Error(msg));
    }
    cb(null, chunk);
  };
  AssertByteCountStream.prototype._flush = function(cb) {
    if (this.actualByteCount < this.expectedByteCount) {
      var msg = "not enough bytes in the stream. expected " + this.expectedByteCount + ". got only " + this.actualByteCount;
      return cb(new Error(msg));
    }
    cb();
  };
  util.inherits(RandomAccessReader, EventEmitter);
  RandomAccessReader.prototype.ref = function() {
    this.refCount += 1;
  };
  RandomAccessReader.prototype.unref = function() {
    var self2 = this;
    self2.refCount -= 1;
    if (self2.refCount > 0)
      return;
    if (self2.refCount < 0)
      throw new Error("invalid unref");
    self2.close(onCloseDone);
    function onCloseDone(err) {
      if (err)
        return self2.emit("error", err);
      self2.emit("close");
    }
  };
  RandomAccessReader.prototype.createReadStream = function(options) {
    var start = options.start;
    var end = options.end;
    if (start === end) {
      var emptyStream = new PassThrough;
      setImmediate(function() {
        emptyStream.end();
      });
      return emptyStream;
    }
    var stream2 = this._readStreamForRange(start, end);
    var destroyed = false;
    var refUnrefFilter = new RefUnrefFilter(this);
    stream2.on("error", function(err) {
      setImmediate(function() {
        if (!destroyed)
          refUnrefFilter.emit("error", err);
      });
    });
    refUnrefFilter.destroy = function() {
      stream2.unpipe(refUnrefFilter);
      refUnrefFilter.unref();
      stream2.destroy();
    };
    var byteCounter = new AssertByteCountStream(end - start);
    refUnrefFilter.on("error", function(err) {
      setImmediate(function() {
        if (!destroyed)
          byteCounter.emit("error", err);
      });
    });
    byteCounter.destroy = function() {
      destroyed = true;
      refUnrefFilter.unpipe(byteCounter);
      refUnrefFilter.destroy();
    };
    return stream2.pipe(refUnrefFilter).pipe(byteCounter);
  };
  RandomAccessReader.prototype._readStreamForRange = function(start, end) {
    throw new Error("not implemented");
  };
  RandomAccessReader.prototype.read = function(buffer, offset, length, position, callback) {
    var readStream = this.createReadStream({ start: position, end: position + length });
    var writeStream = new Writable;
    var written = 0;
    writeStream._write = function(chunk, encoding, cb) {
      chunk.copy(buffer, offset + written, 0, chunk.length);
      written += chunk.length;
      cb();
    };
    writeStream.on("finish", callback);
    readStream.on("error", function(error2) {
      callback(error2);
    });
    readStream.pipe(writeStream);
  };
  RandomAccessReader.prototype.close = function(callback) {
    setImmediate(callback);
  };
  util.inherits(RefUnrefFilter, PassThrough);
  RefUnrefFilter.prototype._flush = function(cb) {
    this.unref();
    cb();
  };
  RefUnrefFilter.prototype.unref = function(cb) {
    if (this.unreffedYet)
      return;
    this.unreffedYet = true;
    this.context.unref();
  };
  var cp437 = "\0\u263A\u263B\u2665\u2666\u2663\u2660\u2022\u25D8\u25CB\u25D9\u2642\u2640\u266A\u266B\u263C\u25BA\u25C4\u2195\u203C\xB6\xA7\u25AC\u21A8\u2191\u2193\u2192\u2190\u221F\u2194\u25B2\u25BC !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~\u2302\xC7\xFC\xE9\xE2\xE4\xE0\xE5\xE7\xEA\xEB\xE8\xEF\xEE\xEC\xC4\xC5\xC9\xE6\xC6\xF4\xF6\xF2\xFB\xF9\xFF\xD6\xDC\xA2\xA3\xA5\u20A7\u0192\xE1\xED\xF3\xFA\xF1\xD1\xAA\xBA\xBF\u2310\xAC\xBD\xBC\xA1\xAB\xBB\u2591\u2592\u2593\u2502\u2524\u2561\u2562\u2556\u2555\u2563\u2551\u2557\u255D\u255C\u255B\u2510\u2514\u2534\u252C\u251C\u2500\u253C\u255E\u255F\u255A\u2554\u2569\u2566\u2560\u2550\u256C\u2567\u2568\u2564\u2565\u2559\u2558\u2552\u2553\u256B\u256A\u2518\u250C\u2588\u2584\u258C\u2590\u2580\u03B1\xDF\u0393\u03C0\u03A3\u03C3\xB5\u03C4\u03A6\u0398\u03A9\u03B4\u221E\u03C6\u03B5\u2229\u2261\xB1\u2265\u2264\u2320\u2321\xF7\u2248\xB0\u2219\xB7\u221A\u207F\xB2\u25A0\xA0";
  var newBuffer;
  if (typeof Buffer.allocUnsafe === "function") {
    newBuffer = function(len) {
      return Buffer.allocUnsafe(len);
    };
  } else {
    newBuffer = function(len) {
      return new Buffer(len);
    };
  }
});

// node_modules/decompress-unzip/index.js
var require_decompress_unzip = __commonJS((exports, module) => {
  var fileType = require_file_type5();
  var getStream = require_get_stream();
  var pify = require_pify();
  var yauzl = require_yauzl();
  var getType = (entry, mode) => {
    const IFMT = 61440;
    const IFDIR = 16384;
    const IFLNK = 40960;
    const madeBy = entry.versionMadeBy >> 8;
    if ((mode & IFMT) === IFLNK) {
      return "symlink";
    }
    if ((mode & IFMT) === IFDIR || madeBy === 0 && entry.externalFileAttributes === 16) {
      return "directory";
    }
    return "file";
  };
  var extractEntry = (entry, zip) => {
    const file = {
      mode: entry.externalFileAttributes >> 16 & 65535,
      mtime: entry.getLastModDate(),
      path: entry.fileName
    };
    file.type = getType(entry, file.mode);
    if (file.mode === 0 && file.type === "directory") {
      file.mode = 493;
    }
    if (file.mode === 0) {
      file.mode = 420;
    }
    return pify(zip.openReadStream.bind(zip))(entry).then(getStream.buffer).then((buf) => {
      file.data = buf;
      if (file.type === "symlink") {
        file.linkname = buf.toString();
      }
      return file;
    }).catch((err) => {
      zip.close();
      throw err;
    });
  };
  var extractFile = (zip) => new Promise((resolve2, reject) => {
    const files = [];
    zip.readEntry();
    zip.on("entry", (entry) => {
      extractEntry(entry, zip).catch(reject).then((file) => {
        files.push(file);
        zip.readEntry();
      });
    });
    zip.on("error", reject);
    zip.on("end", () => resolve2(files));
  });
  module.exports = () => (buf) => {
    if (!Buffer.isBuffer(buf)) {
      return Promise.reject(new TypeError(`Expected a Buffer, got ${typeof buf}`));
    }
    if (!fileType(buf) || fileType(buf).ext !== "zip") {
      return Promise.resolve([]);
    }
    return pify(yauzl.fromBuffer)(buf, { lazyEntries: true }).then(extractFile);
  };
});

// node_modules/pify/index.js
var require_pify2 = __commonJS((exports, module) => {
  var processFn = (fn, opts) => function() {
    const P = opts.promiseModule;
    const args = new Array(arguments.length);
    for (let i = 0;i < arguments.length; i++) {
      args[i] = arguments[i];
    }
    return new P((resolve2, reject) => {
      if (opts.errorFirst) {
        args.push(function(err, result) {
          if (opts.multiArgs) {
            const results = new Array(arguments.length - 1);
            for (let i = 1;i < arguments.length; i++) {
              results[i - 1] = arguments[i];
            }
            if (err) {
              results.unshift(err);
              reject(results);
            } else {
              resolve2(results);
            }
          } else if (err) {
            reject(err);
          } else {
            resolve2(result);
          }
        });
      } else {
        args.push(function(result) {
          if (opts.multiArgs) {
            const results = new Array(arguments.length - 1);
            for (let i = 0;i < arguments.length; i++) {
              results[i] = arguments[i];
            }
            resolve2(results);
          } else {
            resolve2(result);
          }
        });
      }
      fn.apply(this, args);
    });
  };
  module.exports = (obj, opts) => {
    opts = Object.assign({
      exclude: [/.+(Sync|Stream)$/],
      errorFirst: true,
      promiseModule: Promise
    }, opts);
    const filter = (key) => {
      const match = (pattern) => typeof pattern === "string" ? key === pattern : pattern.test(key);
      return opts.include ? opts.include.some(match) : !opts.exclude.some(match);
    };
    let ret;
    if (typeof obj === "function") {
      ret = function() {
        if (opts.excludeMain) {
          return obj.apply(this, arguments);
        }
        return processFn(obj, opts).apply(this, arguments);
      };
    } else {
      ret = Object.create(Object.getPrototypeOf(obj));
    }
    for (const key in obj) {
      const x = obj[key];
      ret[key] = typeof x === "function" && filter(key) ? processFn(x, opts) : x;
    }
    return ret;
  };
});

// node_modules/make-dir/index.js
var require_make_dir = __commonJS((exports, module) => {
  var fs = import.meta.require("fs");
  var path3 = import.meta.require("path");
  var pify = require_pify2();
  var defaults = {
    mode: 511 & ~process.umask(),
    fs
  };
  var checkPath = (pth) => {
    if (process.platform === "win32") {
      const pathHasInvalidWinCharacters = /[<>:"|?*]/.test(pth.replace(path3.parse(pth).root, ""));
      if (pathHasInvalidWinCharacters) {
        const err = new Error(`Path contains invalid characters: ${pth}`);
        err.code = "EINVAL";
        throw err;
      }
    }
  };
  module.exports = (input, opts) => Promise.resolve().then(() => {
    checkPath(input);
    opts = Object.assign({}, defaults, opts);
    const mkdir = pify(opts.fs.mkdir);
    const stat = pify(opts.fs.stat);
    const make = (pth) => {
      return mkdir(pth, opts.mode).then(() => pth).catch((err) => {
        if (err.code === "ENOENT") {
          if (err.message.includes("null bytes") || path3.dirname(pth) === pth) {
            throw err;
          }
          return make(path3.dirname(pth)).then(() => make(pth));
        }
        return stat(pth).then((stats) => stats.isDirectory() ? pth : Promise.reject()).catch(() => {
          throw err;
        });
      });
    };
    return make(path3.resolve(input));
  });
  module.exports.sync = (input, opts) => {
    checkPath(input);
    opts = Object.assign({}, defaults, opts);
    const make = (pth) => {
      try {
        opts.fs.mkdirSync(pth, opts.mode);
      } catch (err) {
        if (err.code === "ENOENT") {
          if (err.message.includes("null bytes") || path3.dirname(pth) === pth) {
            throw err;
          }
          make(path3.dirname(pth));
          return make(pth);
        }
        try {
          if (!opts.fs.statSync(pth).isDirectory()) {
            throw new Error("The path is not a directory");
          }
        } catch (_) {
          throw err;
        }
      }
      return pth;
    };
    return make(path3.resolve(input));
  };
});

// node_modules/decompress/node_modules/pify/index.js
var require_pify3 = __commonJS((exports, module) => {
  var processFn = function(fn, P, opts) {
    return function() {
      var that = this;
      var args = new Array(arguments.length);
      for (var i = 0;i < arguments.length; i++) {
        args[i] = arguments[i];
      }
      return new P(function(resolve2, reject) {
        args.push(function(err, result) {
          if (err) {
            reject(err);
          } else if (opts.multiArgs) {
            var results = new Array(arguments.length - 1);
            for (var i2 = 1;i2 < arguments.length; i2++) {
              results[i2 - 1] = arguments[i2];
            }
            resolve2(results);
          } else {
            resolve2(result);
          }
        });
        fn.apply(that, args);
      });
    };
  };
  var pify = module.exports = function(obj, P, opts) {
    if (typeof P !== "function") {
      opts = P;
      P = Promise;
    }
    opts = opts || {};
    opts.exclude = opts.exclude || [/.+Sync$/];
    var filter = function(key) {
      var match = function(pattern) {
        return typeof pattern === "string" ? key === pattern : pattern.test(key);
      };
      return opts.include ? opts.include.some(match) : !opts.exclude.some(match);
    };
    var ret = typeof obj === "function" ? function() {
      if (opts.excludeMain) {
        return obj.apply(this, arguments);
      }
      return processFn(obj, P, opts).apply(this, arguments);
    } : {};
    return Object.keys(obj).reduce(function(ret2, key) {
      var x = obj[key];
      ret2[key] = typeof x === "function" && filter(key) ? processFn(x, P, opts) : x;
      return ret2;
    }, ret);
  };
  pify.all = pify;
});

// node_modules/is-natural-number/index.jsnext.js
var exports_index_jsnext = {};
__export(exports_index_jsnext, {
  default: () => isNaturalNumber
});
function isNaturalNumber(val, option) {
  if (option) {
    if (typeof option !== "object") {
      throw new TypeError(String(option) + " is not an object. Expected an object that has boolean `includeZero` property.");
    }
    if ("includeZero" in option) {
      if (typeof option.includeZero !== "boolean") {
        throw new TypeError(String(option.includeZero) + " is neither true nor false. `includeZero` option must be a Boolean value.");
      }
      if (option.includeZero && val === 0) {
        return true;
      }
    }
  }
  return Number.isSafeInteger(val) && val >= 1;
}
var init_index_jsnext = __esm(() => {
  /*!
   * is-natural-number.js | MIT (c) Shinnosuke Watanabe
   * https://github.com/shinnn/is-natural-number.js
  */
});

// node_modules/strip-dirs/index.js
var require_strip_dirs = __commonJS((exports, module) => {
  /*!
   * strip-dirs | MIT (c) Shinnosuke Watanabe
   * https://github.com/shinnn/node-strip-dirs
  */
  var path3 = import.meta.require("path");
  var util = import.meta.require("util");
  var isNaturalNumber2 = (init_index_jsnext(), __toCommonJS(exports_index_jsnext));
  module.exports = function stripDirs(pathStr, count, option) {
    if (typeof pathStr !== "string") {
      throw new TypeError(util.inspect(pathStr) + " is not a string. First argument to strip-dirs must be a path string.");
    }
    if (path3.posix.isAbsolute(pathStr) || path3.win32.isAbsolute(pathStr)) {
      throw new Error(`${pathStr} is an absolute path. strip-dirs requires a relative path.`);
    }
    if (!isNaturalNumber2(count, { includeZero: true })) {
      throw new Error("The Second argument of strip-dirs must be a natural number or 0, but received " + util.inspect(count) + ".");
    }
    if (option) {
      if (typeof option !== "object") {
        throw new TypeError(util.inspect(option) + " is not an object. Expected an object with a boolean `disallowOverflow` property.");
      }
      if (Array.isArray(option)) {
        throw new TypeError(util.inspect(option) + " is an array. Expected an object with a boolean `disallowOverflow` property.");
      }
      if ("disallowOverflow" in option && typeof option.disallowOverflow !== "boolean") {
        throw new TypeError(util.inspect(option.disallowOverflow) + " is neither true nor false. `disallowOverflow` option must be a Boolean value.");
      }
    } else {
      option = { disallowOverflow: false };
    }
    const pathComponents = path3.normalize(pathStr).split(path3.sep);
    if (pathComponents.length > 1 && pathComponents[0] === ".") {
      pathComponents.shift();
    }
    if (count > pathComponents.length - 1) {
      if (option.disallowOverflow) {
        throw new RangeError("Cannot strip more directories than there are.");
      }
      count = pathComponents.length - 1;
    }
    return path3.join.apply(null, pathComponents.slice(count));
  };
});

// node_modules/decompress/index.js
var require_decompress = __commonJS((exports, module) => {
  var path3 = import.meta.require("path");
  var fs = require_graceful_fs();
  var decompressTar = require_decompress_tar();
  var decompressTarbz2 = require_decompress_tarbz2();
  var decompressTargz = require_decompress_targz();
  var decompressUnzip = require_decompress_unzip();
  var makeDir = require_make_dir();
  var pify = require_pify3();
  var stripDirs = require_strip_dirs();
  var fsP = pify(fs);
  var runPlugins = (input, opts) => {
    if (opts.plugins.length === 0) {
      return Promise.resolve([]);
    }
    return Promise.all(opts.plugins.map((x) => x(input, opts))).then((files) => files.reduce((a, b) => a.concat(b)));
  };
  var safeMakeDir = (dir, realOutputPath) => {
    return fsP.realpath(dir).catch((_) => {
      const parent = path3.dirname(dir);
      return safeMakeDir(parent, realOutputPath);
    }).then((realParentPath) => {
      if (realParentPath.indexOf(realOutputPath) !== 0) {
        throw new Error("Refusing to create a directory outside the output path.");
      }
      return makeDir(dir).then(fsP.realpath);
    });
  };
  var preventWritingThroughSymlink = (destination, realOutputPath) => {
    return fsP.readlink(destination).catch((_) => {
      return null;
    }).then((symlinkPointsTo) => {
      if (symlinkPointsTo) {
        throw new Error("Refusing to write into a symlink");
      }
      return realOutputPath;
    });
  };
  var extractFile = (input, output, opts) => runPlugins(input, opts).then((files) => {
    if (opts.strip > 0) {
      files = files.map((x) => {
        x.path = stripDirs(x.path, opts.strip);
        return x;
      }).filter((x) => x.path !== ".");
    }
    if (typeof opts.filter === "function") {
      files = files.filter(opts.filter);
    }
    if (typeof opts.map === "function") {
      files = files.map(opts.map);
    }
    if (!output) {
      return files;
    }
    return Promise.all(files.map((x) => {
      const dest = path3.join(output, x.path);
      const mode = x.mode & ~process.umask();
      const now = new Date;
      if (x.type === "directory") {
        return makeDir(output).then((outputPath) => fsP.realpath(outputPath)).then((realOutputPath) => safeMakeDir(dest, realOutputPath)).then(() => fsP.utimes(dest, now, x.mtime)).then(() => x);
      }
      return makeDir(output).then((outputPath) => fsP.realpath(outputPath)).then((realOutputPath) => {
        return safeMakeDir(path3.dirname(dest), realOutputPath).then(() => realOutputPath);
      }).then((realOutputPath) => {
        if (x.type === "file") {
          return preventWritingThroughSymlink(dest, realOutputPath);
        }
        return realOutputPath;
      }).then((realOutputPath) => {
        return fsP.realpath(path3.dirname(dest)).then((realDestinationDir) => {
          if (realDestinationDir.indexOf(realOutputPath) !== 0) {
            throw new Error("Refusing to write outside output directory: " + realDestinationDir);
          }
        });
      }).then(() => {
        if (x.type === "link") {
          return fsP.link(x.linkname, dest);
        }
        if (x.type === "symlink" && process.platform === "win32") {
          return fsP.link(x.linkname, dest);
        }
        if (x.type === "symlink") {
          return fsP.symlink(x.linkname, dest);
        }
        return fsP.writeFile(dest, x.data, { mode });
      }).then(() => x.type === "file" && fsP.utimes(dest, now, x.mtime)).then(() => x);
    }));
  });
  module.exports = (input, output, opts) => {
    if (typeof input !== "string" && !Buffer.isBuffer(input)) {
      return Promise.reject(new TypeError("Input file required"));
    }
    if (typeof output === "object") {
      opts = output;
      output = null;
    }
    opts = Object.assign({ plugins: [
      decompressTar(),
      decompressTarbz2(),
      decompressTargz(),
      decompressUnzip()
    ] }, opts);
    const read = typeof input === "string" ? fsP.readFile(input) : Promise.resolve(input);
    return read.then((buf) => extractFile(buf, output, opts));
  };
});

// node_modules/trim-repeated/node_modules/escape-string-regexp/index.js
var require_escape_string_regexp = __commonJS((exports, module) => {
  var matchOperatorsRe = /[|\\{}()[\]^$+*?.]/g;
  module.exports = function(str) {
    if (typeof str !== "string") {
      throw new TypeError("Expected a string");
    }
    return str.replace(matchOperatorsRe, "\\$&");
  };
});

// node_modules/trim-repeated/index.js
var require_trim_repeated = __commonJS((exports, module) => {
  var escapeStringRegexp = require_escape_string_regexp();
  module.exports = function(str, target) {
    if (typeof str !== "string" || typeof target !== "string") {
      throw new TypeError("Expected a string");
    }
    return str.replace(new RegExp("(?:" + escapeStringRegexp(target) + "){2,}", "g"), target);
  };
});

// node_modules/filename-reserved-regex/index.js
var require_filename_reserved_regex = __commonJS((exports, module) => {
  module.exports = () => /[<>:"\/\\|?*\x00-\x1F]/g;
  module.exports.windowsNames = () => /^(con|prn|aux|nul|com[0-9]|lpt[0-9])$/i;
});

// node_modules/strip-outer/node_modules/escape-string-regexp/index.js
var require_escape_string_regexp2 = __commonJS((exports, module) => {
  var matchOperatorsRe = /[|\\{}()[\]^$+*?.]/g;
  module.exports = function(str) {
    if (typeof str !== "string") {
      throw new TypeError("Expected a string");
    }
    return str.replace(matchOperatorsRe, "\\$&");
  };
});

// node_modules/strip-outer/index.js
var require_strip_outer = __commonJS((exports, module) => {
  var escapeStringRegexp = require_escape_string_regexp2();
  module.exports = function(str, sub) {
    if (typeof str !== "string" || typeof sub !== "string") {
      throw new TypeError;
    }
    sub = escapeStringRegexp(sub);
    return str.replace(new RegExp("^" + sub + "|" + sub + "$", "g"), "");
  };
});

// node_modules/filenamify/index.js
var require_filenamify = __commonJS((exports, module) => {
  var path3 = import.meta.require("path");
  var trimRepeated = require_trim_repeated();
  var filenameReservedRegex = require_filename_reserved_regex();
  var stripOuter = require_strip_outer();
  var MAX_FILENAME_LENGTH = 100;
  var reControlChars = /[\u0000-\u001f\u0080-\u009f]/g;
  var reRelativePath = /^\.+/;
  var fn = (string, options) => {
    if (typeof string !== "string") {
      throw new TypeError("Expected a string");
    }
    options = options || {};
    const replacement = options.replacement === undefined ? "!" : options.replacement;
    if (filenameReservedRegex().test(replacement) && reControlChars.test(replacement)) {
      throw new Error("Replacement string cannot contain reserved filename characters");
    }
    string = string.replace(filenameReservedRegex(), replacement);
    string = string.replace(reControlChars, replacement);
    string = string.replace(reRelativePath, replacement);
    if (replacement.length > 0) {
      string = trimRepeated(string, replacement);
      string = string.length > 1 ? stripOuter(string, replacement) : string;
    }
    string = filenameReservedRegex.windowsNames().test(string) ? string + replacement : string;
    string = string.slice(0, MAX_FILENAME_LENGTH);
    return string;
  };
  fn.path = (pth, options) => {
    pth = path3.resolve(pth);
    return path3.join(path3.dirname(pth), fn(path3.basename(pth), options));
  };
  module.exports = fn;
});

// node_modules/download/node_modules/get-stream/buffer-stream.js
var require_buffer_stream2 = __commonJS((exports, module) => {
  var PassThrough = import.meta.require("stream").PassThrough;
  module.exports = (opts) => {
    opts = Object.assign({}, opts);
    const array = opts.array;
    let encoding = opts.encoding;
    const buffer = encoding === "buffer";
    let objectMode = false;
    if (array) {
      objectMode = !(encoding || buffer);
    } else {
      encoding = encoding || "utf8";
    }
    if (buffer) {
      encoding = null;
    }
    let len = 0;
    const ret = [];
    const stream2 = new PassThrough({ objectMode });
    if (encoding) {
      stream2.setEncoding(encoding);
    }
    stream2.on("data", (chunk) => {
      ret.push(chunk);
      if (objectMode) {
        len = ret.length;
      } else {
        len += chunk.length;
      }
    });
    stream2.getBufferedValue = () => {
      if (array) {
        return ret;
      }
      return buffer ? Buffer.concat(ret, len) : ret.join("");
    };
    stream2.getBufferedLength = () => len;
    return stream2;
  };
});

// node_modules/download/node_modules/get-stream/index.js
var require_get_stream2 = __commonJS((exports, module) => {
  var getStream = function(inputStream, opts) {
    if (!inputStream) {
      return Promise.reject(new Error("Expected a stream"));
    }
    opts = Object.assign({ maxBuffer: Infinity }, opts);
    const maxBuffer = opts.maxBuffer;
    let stream2;
    let clean;
    const p = new Promise((resolve2, reject) => {
      const error2 = (err) => {
        if (err) {
          err.bufferedData = stream2.getBufferedValue();
        }
        reject(err);
      };
      stream2 = bufferStream(opts);
      inputStream.once("error", error2);
      inputStream.pipe(stream2);
      stream2.on("data", () => {
        if (stream2.getBufferedLength() > maxBuffer) {
          reject(new Error("maxBuffer exceeded"));
        }
      });
      stream2.once("error", error2);
      stream2.on("end", resolve2);
      clean = () => {
        if (inputStream.unpipe) {
          inputStream.unpipe(stream2);
        }
      };
    });
    p.then(clean, clean);
    return p.then(() => stream2.getBufferedValue());
  };
  var bufferStream = require_buffer_stream2();
  module.exports = getStream;
  module.exports.buffer = (stream2, opts) => getStream(stream2, Object.assign({}, opts, { encoding: "buffer" }));
  module.exports.array = (stream2, opts) => getStream(stream2, Object.assign({}, opts, { array: true }));
});

// node_modules/strict-uri-encode/index.js
var require_strict_uri_encode = __commonJS((exports, module) => {
  module.exports = function(str) {
    return encodeURIComponent(str).replace(/[!'()*]/g, function(c) {
      return "%" + c.charCodeAt(0).toString(16).toUpperCase();
    });
  };
});

// node_modules/decode-uri-component/index.js
var require_decode_uri_component = __commonJS((exports, module) => {
  var decodeComponents = function(components, split) {
    try {
      return [decodeURIComponent(components.join(""))];
    } catch (err) {
    }
    if (components.length === 1) {
      return components;
    }
    split = split || 1;
    var left = components.slice(0, split);
    var right = components.slice(split);
    return Array.prototype.concat.call([], decodeComponents(left), decodeComponents(right));
  };
  var decode = function(input) {
    try {
      return decodeURIComponent(input);
    } catch (err) {
      var tokens = input.match(singleMatcher) || [];
      for (var i = 1;i < tokens.length; i++) {
        input = decodeComponents(tokens, i).join("");
        tokens = input.match(singleMatcher) || [];
      }
      return input;
    }
  };
  var customDecodeURIComponent = function(input) {
    var replaceMap = {
      "%FE%FF": "\uFFFD\uFFFD",
      "%FF%FE": "\uFFFD\uFFFD"
    };
    var match = multiMatcher.exec(input);
    while (match) {
      try {
        replaceMap[match[0]] = decodeURIComponent(match[0]);
      } catch (err) {
        var result = decode(match[0]);
        if (result !== match[0]) {
          replaceMap[match[0]] = result;
        }
      }
      match = multiMatcher.exec(input);
    }
    replaceMap["%C2"] = "\uFFFD";
    var entries = Object.keys(replaceMap);
    for (var i = 0;i < entries.length; i++) {
      var key = entries[i];
      input = input.replace(new RegExp(key, "g"), replaceMap[key]);
    }
    return input;
  };
  var token = "%[a-f0-9]{2}";
  var singleMatcher = new RegExp("(" + token + ")|([^%]+?)", "gi");
  var multiMatcher = new RegExp("(" + token + ")+", "gi");
  module.exports = function(encodedURI) {
    if (typeof encodedURI !== "string") {
      throw new TypeError("Expected `encodedURI` to be of type `string`, got `" + typeof encodedURI + "`");
    }
    try {
      encodedURI = encodedURI.replace(/\+/g, " ");
      return decodeURIComponent(encodedURI);
    } catch (err) {
      return customDecodeURIComponent(encodedURI);
    }
  };
});

// node_modules/query-string/index.js
var require_query_string = __commonJS((exports) => {
  var encoderForArrayFormat = function(opts) {
    switch (opts.arrayFormat) {
      case "index":
        return function(key, value, index) {
          return value === null ? [
            encode(key, opts),
            "[",
            index,
            "]"
          ].join("") : [
            encode(key, opts),
            "[",
            encode(index, opts),
            "]=",
            encode(value, opts)
          ].join("");
        };
      case "bracket":
        return function(key, value) {
          return value === null ? encode(key, opts) : [
            encode(key, opts),
            "[]=",
            encode(value, opts)
          ].join("");
        };
      default:
        return function(key, value) {
          return value === null ? encode(key, opts) : [
            encode(key, opts),
            "=",
            encode(value, opts)
          ].join("");
        };
    }
  };
  var parserForArrayFormat = function(opts) {
    var result;
    switch (opts.arrayFormat) {
      case "index":
        return function(key, value, accumulator) {
          result = /\[(\d*)\]$/.exec(key);
          key = key.replace(/\[\d*\]$/, "");
          if (!result) {
            accumulator[key] = value;
            return;
          }
          if (accumulator[key] === undefined) {
            accumulator[key] = {};
          }
          accumulator[key][result[1]] = value;
        };
      case "bracket":
        return function(key, value, accumulator) {
          result = /(\[\])$/.exec(key);
          key = key.replace(/\[\]$/, "");
          if (!result) {
            accumulator[key] = value;
            return;
          } else if (accumulator[key] === undefined) {
            accumulator[key] = [value];
            return;
          }
          accumulator[key] = [].concat(accumulator[key], value);
        };
      default:
        return function(key, value, accumulator) {
          if (accumulator[key] === undefined) {
            accumulator[key] = value;
            return;
          }
          accumulator[key] = [].concat(accumulator[key], value);
        };
    }
  };
  var encode = function(value, opts) {
    if (opts.encode) {
      return opts.strict ? strictUriEncode(value) : encodeURIComponent(value);
    }
    return value;
  };
  var keysSorter = function(input) {
    if (Array.isArray(input)) {
      return input.sort();
    } else if (typeof input === "object") {
      return keysSorter(Object.keys(input)).sort(function(a, b) {
        return Number(a) - Number(b);
      }).map(function(key) {
        return input[key];
      });
    }
    return input;
  };
  var extract = function(str) {
    var queryStart = str.indexOf("?");
    if (queryStart === -1) {
      return "";
    }
    return str.slice(queryStart + 1);
  };
  var parse = function(str, opts) {
    opts = objectAssign({ arrayFormat: "none" }, opts);
    var formatter = parserForArrayFormat(opts);
    var ret = Object.create(null);
    if (typeof str !== "string") {
      return ret;
    }
    str = str.trim().replace(/^[?#&]/, "");
    if (!str) {
      return ret;
    }
    str.split("&").forEach(function(param) {
      var parts = param.replace(/\+/g, " ").split("=");
      var key = parts.shift();
      var val = parts.length > 0 ? parts.join("=") : undefined;
      val = val === undefined ? null : decodeComponent(val);
      formatter(decodeComponent(key), val, ret);
    });
    return Object.keys(ret).sort().reduce(function(result, key) {
      var val = ret[key];
      if (Boolean(val) && typeof val === "object" && !Array.isArray(val)) {
        result[key] = keysSorter(val);
      } else {
        result[key] = val;
      }
      return result;
    }, Object.create(null));
  };
  var strictUriEncode = require_strict_uri_encode();
  var objectAssign = require_object_assign();
  var decodeComponent = require_decode_uri_component();
  exports.extract = extract;
  exports.parse = parse;
  exports.stringify = function(obj, opts) {
    var defaults = {
      encode: true,
      strict: true,
      arrayFormat: "none"
    };
    opts = objectAssign(defaults, opts);
    if (opts.sort === false) {
      opts.sort = function() {
      };
    }
    var formatter = encoderForArrayFormat(opts);
    return obj ? Object.keys(obj).sort(opts.sort).map(function(key) {
      var val = obj[key];
      if (val === undefined) {
        return "";
      }
      if (val === null) {
        return encode(key, opts);
      }
      if (Array.isArray(val)) {
        var result = [];
        val.slice().forEach(function(val2) {
          if (val2 === undefined) {
            return;
          }
          result.push(formatter(key, val2, result.length));
        });
        return result.join("&");
      }
      return encode(key, opts) + "=" + encode(val, opts);
    }).filter(function(x) {
      return x.length > 0;
    }).join("&") : "";
  };
  exports.parseUrl = function(str, opts) {
    return {
      url: str.split("?")[0] || "",
      query: parse(extract(str), opts)
    };
  };
});

// node_modules/prepend-http/index.js
var require_prepend_http = __commonJS((exports, module) => {
  module.exports = (url, opts) => {
    if (typeof url !== "string") {
      throw new TypeError(`Expected \`url\` to be of type \`string\`, got \`${typeof url}\``);
    }
    url = url.trim();
    opts = Object.assign({ https: false }, opts);
    if (/^\.*\/|^(?!localhost)\w+:/.test(url)) {
      return url;
    }
    return url.replace(/^(?!(?:\w+:)?\/\/)/, opts.https ? "https://" : "http://");
  };
});

// node_modules/normalize-url/node_modules/sort-keys/node_modules/is-plain-obj/index.js
var require_is_plain_obj = __commonJS((exports, module) => {
  var toString = Object.prototype.toString;
  module.exports = function(x) {
    var prototype;
    return toString.call(x) === "[object Object]" && (prototype = Object.getPrototypeOf(x), prototype === null || prototype === Object.getPrototypeOf({}));
  };
});

// node_modules/normalize-url/node_modules/sort-keys/index.js
var require_sort_keys = __commonJS((exports, module) => {
  var isPlainObj = require_is_plain_obj();
  module.exports = (obj, opts) => {
    if (!isPlainObj(obj)) {
      throw new TypeError("Expected a plain object");
    }
    opts = opts || {};
    if (typeof opts === "function") {
      throw new TypeError("Specify the compare function as an option instead");
    }
    const deep = opts.deep;
    const seenInput = [];
    const seenOutput = [];
    const sortKeys = (x) => {
      const seenIndex = seenInput.indexOf(x);
      if (seenIndex !== -1) {
        return seenOutput[seenIndex];
      }
      const ret = {};
      const keys = Object.keys(x).sort(opts.compare);
      seenInput.push(x);
      seenOutput.push(ret);
      for (let i = 0;i < keys.length; i++) {
        const key = keys[i];
        const val = x[key];
        if (deep && Array.isArray(val)) {
          const retArr = [];
          for (let j = 0;j < val.length; j++) {
            retArr[j] = isPlainObj(val[j]) ? sortKeys(val[j]) : val[j];
          }
          ret[key] = retArr;
          continue;
        }
        ret[key] = deep && isPlainObj(val) ? sortKeys(val) : val;
      }
      return ret;
    };
    return sortKeys(obj);
  };
});

// node_modules/normalize-url/index.js
var require_normalize_url = __commonJS((exports, module) => {
  var testParameter = function(name2, filters) {
    return filters.some((filter) => filter instanceof RegExp ? filter.test(name2) : filter === name2);
  };
  var url = import.meta.require("url");
  var punycode = import.meta.require("punycode");
  var queryString = require_query_string();
  var prependHttp = require_prepend_http();
  var sortKeys = require_sort_keys();
  var DEFAULT_PORTS = {
    "http:": 80,
    "https:": 443,
    "ftp:": 21
  };
  var slashedProtocol = {
    http: true,
    https: true,
    ftp: true,
    gopher: true,
    file: true,
    "http:": true,
    "https:": true,
    "ftp:": true,
    "gopher:": true,
    "file:": true
  };
  module.exports = (str, opts) => {
    opts = Object.assign({
      normalizeProtocol: true,
      normalizeHttps: false,
      stripFragment: true,
      stripWWW: true,
      removeQueryParameters: [/^utm_\w+/i],
      removeTrailingSlash: true,
      removeDirectoryIndex: false,
      sortQueryParameters: true
    }, opts);
    if (typeof str !== "string") {
      throw new TypeError("Expected a string");
    }
    const hasRelativeProtocol = str.startsWith("//");
    str = prependHttp(str.trim()).replace(/^\/\//, "http://");
    const urlObj = url.parse(str);
    if (opts.normalizeHttps && urlObj.protocol === "https:") {
      urlObj.protocol = "http:";
    }
    if (!urlObj.hostname && !urlObj.pathname) {
      throw new Error("Invalid URL");
    }
    delete urlObj.host;
    delete urlObj.query;
    if (opts.stripFragment) {
      delete urlObj.hash;
    }
    const port = DEFAULT_PORTS[urlObj.protocol];
    if (Number(urlObj.port) === port) {
      delete urlObj.port;
    }
    if (urlObj.pathname) {
      urlObj.pathname = urlObj.pathname.replace(/\/{2,}/g, "/");
    }
    if (urlObj.pathname) {
      urlObj.pathname = decodeURI(urlObj.pathname);
    }
    if (opts.removeDirectoryIndex === true) {
      opts.removeDirectoryIndex = [/^index\.[a-z]+$/];
    }
    if (Array.isArray(opts.removeDirectoryIndex) && opts.removeDirectoryIndex.length > 0) {
      let pathComponents = urlObj.pathname.split("/");
      const lastComponent = pathComponents[pathComponents.length - 1];
      if (testParameter(lastComponent, opts.removeDirectoryIndex)) {
        pathComponents = pathComponents.slice(0, pathComponents.length - 1);
        urlObj.pathname = pathComponents.slice(1).join("/") + "/";
      }
    }
    if (slashedProtocol[urlObj.protocol]) {
      const domain = urlObj.protocol + "//" + urlObj.hostname;
      const relative = url.resolve(domain, urlObj.pathname);
      urlObj.pathname = relative.replace(domain, "");
    }
    if (urlObj.hostname) {
      urlObj.hostname = punycode.toUnicode(urlObj.hostname).toLowerCase();
      urlObj.hostname = urlObj.hostname.replace(/\.$/, "");
      if (opts.stripWWW) {
        urlObj.hostname = urlObj.hostname.replace(/^www\./, "");
      }
    }
    if (urlObj.search === "?") {
      delete urlObj.search;
    }
    const queryParameters = queryString.parse(urlObj.search);
    if (Array.isArray(opts.removeQueryParameters)) {
      for (const key in queryParameters) {
        if (testParameter(key, opts.removeQueryParameters)) {
          delete queryParameters[key];
        }
      }
    }
    if (opts.sortQueryParameters) {
      urlObj.search = queryString.stringify(sortKeys(queryParameters));
    }
    if (urlObj.search !== null) {
      urlObj.search = decodeURIComponent(urlObj.search);
    }
    str = url.format(urlObj);
    if (opts.removeTrailingSlash || urlObj.pathname === "/") {
      str = str.replace(/\/$/, "");
    }
    if (hasRelativeProtocol && !opts.normalizeProtocol) {
      str = str.replace(/^http:\/\//, "//");
    }
    return str;
  };
});

// node_modules/cacheable-request/node_modules/get-stream/buffer-stream.js
var require_buffer_stream3 = __commonJS((exports, module) => {
  var PassThrough = import.meta.require("stream").PassThrough;
  module.exports = (opts) => {
    opts = Object.assign({}, opts);
    const array = opts.array;
    let encoding = opts.encoding;
    const buffer = encoding === "buffer";
    let objectMode = false;
    if (array) {
      objectMode = !(encoding || buffer);
    } else {
      encoding = encoding || "utf8";
    }
    if (buffer) {
      encoding = null;
    }
    let len = 0;
    const ret = [];
    const stream2 = new PassThrough({ objectMode });
    if (encoding) {
      stream2.setEncoding(encoding);
    }
    stream2.on("data", (chunk) => {
      ret.push(chunk);
      if (objectMode) {
        len = ret.length;
      } else {
        len += chunk.length;
      }
    });
    stream2.getBufferedValue = () => {
      if (array) {
        return ret;
      }
      return buffer ? Buffer.concat(ret, len) : ret.join("");
    };
    stream2.getBufferedLength = () => len;
    return stream2;
  };
});

// node_modules/cacheable-request/node_modules/get-stream/index.js
var require_get_stream3 = __commonJS((exports, module) => {
  var getStream = function(inputStream, opts) {
    if (!inputStream) {
      return Promise.reject(new Error("Expected a stream"));
    }
    opts = Object.assign({ maxBuffer: Infinity }, opts);
    const maxBuffer = opts.maxBuffer;
    let stream2;
    let clean;
    const p = new Promise((resolve2, reject) => {
      const error2 = (err) => {
        if (err) {
          err.bufferedData = stream2.getBufferedValue();
        }
        reject(err);
      };
      stream2 = bufferStream(opts);
      inputStream.once("error", error2);
      inputStream.pipe(stream2);
      stream2.on("data", () => {
        if (stream2.getBufferedLength() > maxBuffer) {
          reject(new Error("maxBuffer exceeded"));
        }
      });
      stream2.once("error", error2);
      stream2.on("end", resolve2);
      clean = () => {
        if (inputStream.unpipe) {
          inputStream.unpipe(stream2);
        }
      };
    });
    p.then(clean, clean);
    return p.then(() => stream2.getBufferedValue());
  };
  var bufferStream = require_buffer_stream3();
  module.exports = getStream;
  module.exports.buffer = (stream2, opts) => getStream(stream2, Object.assign({}, opts, { encoding: "buffer" }));
  module.exports.array = (stream2, opts) => getStream(stream2, Object.assign({}, opts, { array: true }));
});

// node_modules/http-cache-semantics/node4/index.js
var require_node4 = __commonJS((exports, module) => {
  var _classCallCheck = function(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };
  var parseCacheControl = function(header) {
    var cc = {};
    if (!header)
      return cc;
    var parts = header.trim().split(/\s*,\s*/);
    for (var _iterator = parts, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();; ) {
      var _ref;
      if (_isArray) {
        if (_i >= _iterator.length)
          break;
        _ref = _iterator[_i++];
      } else {
        _i = _iterator.next();
        if (_i.done)
          break;
        _ref = _i.value;
      }
      var part = _ref;
      var _part$split = part.split(/\s*=\s*/, 2), k = _part$split[0], v = _part$split[1];
      cc[k] = v === undefined ? true : v.replace(/^"|"$/g, "");
    }
    return cc;
  };
  var formatCacheControl = function(cc) {
    var parts = [];
    for (var k in cc) {
      var v = cc[k];
      parts.push(v === true ? k : k + "=" + v);
    }
    if (!parts.length) {
      return;
    }
    return parts.join(", ");
  };
  var statusCodeCacheableByDefault = [200, 203, 204, 206, 300, 301, 404, 405, 410, 414, 501];
  var understoodStatuses = [200, 203, 204, 300, 301, 302, 303, 307, 308, 404, 405, 410, 414, 501];
  var hopByHopHeaders = { connection: true, "keep-alive": true, "proxy-authenticate": true, "proxy-authorization": true, te: true, trailer: true, "transfer-encoding": true, upgrade: true };
  var excludedFromRevalidationUpdate = {
    "content-length": true,
    "content-encoding": true,
    "transfer-encoding": true,
    "content-range": true
  };
  module.exports = function() {
    function CachePolicy(req, res) {
      var _ref2 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {}, shared = _ref2.shared, cacheHeuristic = _ref2.cacheHeuristic, immutableMinTimeToLive = _ref2.immutableMinTimeToLive, ignoreCargoCult = _ref2.ignoreCargoCult, _fromObject = _ref2._fromObject;
      _classCallCheck(this, CachePolicy);
      if (_fromObject) {
        this._fromObject(_fromObject);
        return;
      }
      if (!res || !res.headers) {
        throw Error("Response headers missing");
      }
      this._assertRequestHasHeaders(req);
      this._responseTime = this.now();
      this._isShared = shared !== false;
      this._cacheHeuristic = cacheHeuristic !== undefined ? cacheHeuristic : 0.1;
      this._immutableMinTtl = immutableMinTimeToLive !== undefined ? immutableMinTimeToLive : 24 * 3600 * 1000;
      this._status = "status" in res ? res.status : 200;
      this._resHeaders = res.headers;
      this._rescc = parseCacheControl(res.headers["cache-control"]);
      this._method = "method" in req ? req.method : "GET";
      this._url = req.url;
      this._host = req.headers.host;
      this._noAuthorization = !req.headers.authorization;
      this._reqHeaders = res.headers.vary ? req.headers : null;
      this._reqcc = parseCacheControl(req.headers["cache-control"]);
      if (ignoreCargoCult && "pre-check" in this._rescc && "post-check" in this._rescc) {
        delete this._rescc["pre-check"];
        delete this._rescc["post-check"];
        delete this._rescc["no-cache"];
        delete this._rescc["no-store"];
        delete this._rescc["must-revalidate"];
        this._resHeaders = Object.assign({}, this._resHeaders, { "cache-control": formatCacheControl(this._rescc) });
        delete this._resHeaders.expires;
        delete this._resHeaders.pragma;
      }
      if (!res.headers["cache-control"] && /no-cache/.test(res.headers.pragma)) {
        this._rescc["no-cache"] = true;
      }
    }
    CachePolicy.prototype.now = function now() {
      return Date.now();
    };
    CachePolicy.prototype.storable = function storable() {
      return !!(!this._reqcc["no-store"] && (this._method === "GET" || this._method === "HEAD" || this._method === "POST" && this._hasExplicitExpiration()) && understoodStatuses.indexOf(this._status) !== -1 && !this._rescc["no-store"] && (!this._isShared || !this._rescc.private) && (!this._isShared || this._noAuthorization || this._allowsStoringAuthenticated()) && (this._resHeaders.expires || this._rescc.public || this._rescc["max-age"] || this._rescc["s-maxage"] || statusCodeCacheableByDefault.indexOf(this._status) !== -1));
    };
    CachePolicy.prototype._hasExplicitExpiration = function _hasExplicitExpiration() {
      return this._isShared && this._rescc["s-maxage"] || this._rescc["max-age"] || this._resHeaders.expires;
    };
    CachePolicy.prototype._assertRequestHasHeaders = function _assertRequestHasHeaders(req) {
      if (!req || !req.headers) {
        throw Error("Request headers missing");
      }
    };
    CachePolicy.prototype.satisfiesWithoutRevalidation = function satisfiesWithoutRevalidation(req) {
      this._assertRequestHasHeaders(req);
      var requestCC = parseCacheControl(req.headers["cache-control"]);
      if (requestCC["no-cache"] || /no-cache/.test(req.headers.pragma)) {
        return false;
      }
      if (requestCC["max-age"] && this.age() > requestCC["max-age"]) {
        return false;
      }
      if (requestCC["min-fresh"] && this.timeToLive() < 1000 * requestCC["min-fresh"]) {
        return false;
      }
      if (this.stale()) {
        var allowsStale = requestCC["max-stale"] && !this._rescc["must-revalidate"] && (requestCC["max-stale"] === true || requestCC["max-stale"] > this.age() - this.maxAge());
        if (!allowsStale) {
          return false;
        }
      }
      return this._requestMatches(req, false);
    };
    CachePolicy.prototype._requestMatches = function _requestMatches(req, allowHeadMethod) {
      return (!this._url || this._url === req.url) && this._host === req.headers.host && (!req.method || this._method === req.method || allowHeadMethod && req.method === "HEAD") && this._varyMatches(req);
    };
    CachePolicy.prototype._allowsStoringAuthenticated = function _allowsStoringAuthenticated() {
      return this._rescc["must-revalidate"] || this._rescc.public || this._rescc["s-maxage"];
    };
    CachePolicy.prototype._varyMatches = function _varyMatches(req) {
      if (!this._resHeaders.vary) {
        return true;
      }
      if (this._resHeaders.vary === "*") {
        return false;
      }
      var fields = this._resHeaders.vary.trim().toLowerCase().split(/\s*,\s*/);
      for (var _iterator2 = fields, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();; ) {
        var _ref3;
        if (_isArray2) {
          if (_i2 >= _iterator2.length)
            break;
          _ref3 = _iterator2[_i2++];
        } else {
          _i2 = _iterator2.next();
          if (_i2.done)
            break;
          _ref3 = _i2.value;
        }
        var name2 = _ref3;
        if (req.headers[name2] !== this._reqHeaders[name2])
          return false;
      }
      return true;
    };
    CachePolicy.prototype._copyWithoutHopByHopHeaders = function _copyWithoutHopByHopHeaders(inHeaders) {
      var headers = {};
      for (var name2 in inHeaders) {
        if (hopByHopHeaders[name2])
          continue;
        headers[name2] = inHeaders[name2];
      }
      if (inHeaders.connection) {
        var tokens = inHeaders.connection.trim().split(/\s*,\s*/);
        for (var _iterator3 = tokens, _isArray3 = Array.isArray(_iterator3), _i3 = 0, _iterator3 = _isArray3 ? _iterator3 : _iterator3[Symbol.iterator]();; ) {
          var _ref4;
          if (_isArray3) {
            if (_i3 >= _iterator3.length)
              break;
            _ref4 = _iterator3[_i3++];
          } else {
            _i3 = _iterator3.next();
            if (_i3.done)
              break;
            _ref4 = _i3.value;
          }
          var _name = _ref4;
          delete headers[_name];
        }
      }
      if (headers.warning) {
        var warnings = headers.warning.split(/,/).filter(function(warning) {
          return !/^\s*1[0-9][0-9]/.test(warning);
        });
        if (!warnings.length) {
          delete headers.warning;
        } else {
          headers.warning = warnings.join(",").trim();
        }
      }
      return headers;
    };
    CachePolicy.prototype.responseHeaders = function responseHeaders() {
      var headers = this._copyWithoutHopByHopHeaders(this._resHeaders);
      var age = this.age();
      if (age > 3600 * 24 && !this._hasExplicitExpiration() && this.maxAge() > 3600 * 24) {
        headers.warning = (headers.warning ? `${headers.warning}, ` : "") + '113 - "rfc7234 5.5.4"';
      }
      headers.age = `${Math.round(age)}`;
      return headers;
    };
    CachePolicy.prototype.date = function date() {
      var dateValue = Date.parse(this._resHeaders.date);
      var maxClockDrift = 8 * 3600 * 1000;
      if (Number.isNaN(dateValue) || dateValue < this._responseTime - maxClockDrift || dateValue > this._responseTime + maxClockDrift) {
        return this._responseTime;
      }
      return dateValue;
    };
    CachePolicy.prototype.age = function age() {
      var age = Math.max(0, (this._responseTime - this.date()) / 1000);
      if (this._resHeaders.age) {
        var ageValue = this._ageValue();
        if (ageValue > age)
          age = ageValue;
      }
      var residentTime = (this.now() - this._responseTime) / 1000;
      return age + residentTime;
    };
    CachePolicy.prototype._ageValue = function _ageValue() {
      var ageValue = parseInt(this._resHeaders.age);
      return isFinite(ageValue) ? ageValue : 0;
    };
    CachePolicy.prototype.maxAge = function maxAge() {
      if (!this.storable() || this._rescc["no-cache"]) {
        return 0;
      }
      if (this._isShared && this._resHeaders["set-cookie"] && !this._rescc.public && !this._rescc.immutable) {
        return 0;
      }
      if (this._resHeaders.vary === "*") {
        return 0;
      }
      if (this._isShared) {
        if (this._rescc["proxy-revalidate"]) {
          return 0;
        }
        if (this._rescc["s-maxage"]) {
          return parseInt(this._rescc["s-maxage"], 10);
        }
      }
      if (this._rescc["max-age"]) {
        return parseInt(this._rescc["max-age"], 10);
      }
      var defaultMinTtl = this._rescc.immutable ? this._immutableMinTtl : 0;
      var dateValue = this.date();
      if (this._resHeaders.expires) {
        var expires = Date.parse(this._resHeaders.expires);
        if (Number.isNaN(expires) || expires < dateValue) {
          return 0;
        }
        return Math.max(defaultMinTtl, (expires - dateValue) / 1000);
      }
      if (this._resHeaders["last-modified"]) {
        var lastModified = Date.parse(this._resHeaders["last-modified"]);
        if (isFinite(lastModified) && dateValue > lastModified) {
          return Math.max(defaultMinTtl, (dateValue - lastModified) / 1000 * this._cacheHeuristic);
        }
      }
      return defaultMinTtl;
    };
    CachePolicy.prototype.timeToLive = function timeToLive() {
      return Math.max(0, this.maxAge() - this.age()) * 1000;
    };
    CachePolicy.prototype.stale = function stale() {
      return this.maxAge() <= this.age();
    };
    CachePolicy.fromObject = function fromObject(obj) {
      return new this(undefined, undefined, { _fromObject: obj });
    };
    CachePolicy.prototype._fromObject = function _fromObject(obj) {
      if (this._responseTime)
        throw Error("Reinitialized");
      if (!obj || obj.v !== 1)
        throw Error("Invalid serialization");
      this._responseTime = obj.t;
      this._isShared = obj.sh;
      this._cacheHeuristic = obj.ch;
      this._immutableMinTtl = obj.imm !== undefined ? obj.imm : 24 * 3600 * 1000;
      this._status = obj.st;
      this._resHeaders = obj.resh;
      this._rescc = obj.rescc;
      this._method = obj.m;
      this._url = obj.u;
      this._host = obj.h;
      this._noAuthorization = obj.a;
      this._reqHeaders = obj.reqh;
      this._reqcc = obj.reqcc;
    };
    CachePolicy.prototype.toObject = function toObject() {
      return {
        v: 1,
        t: this._responseTime,
        sh: this._isShared,
        ch: this._cacheHeuristic,
        imm: this._immutableMinTtl,
        st: this._status,
        resh: this._resHeaders,
        rescc: this._rescc,
        m: this._method,
        u: this._url,
        h: this._host,
        a: this._noAuthorization,
        reqh: this._reqHeaders,
        reqcc: this._reqcc
      };
    };
    CachePolicy.prototype.revalidationHeaders = function revalidationHeaders(incomingReq) {
      this._assertRequestHasHeaders(incomingReq);
      var headers = this._copyWithoutHopByHopHeaders(incomingReq.headers);
      delete headers["if-range"];
      if (!this._requestMatches(incomingReq, true) || !this.storable()) {
        delete headers["if-none-match"];
        delete headers["if-modified-since"];
        return headers;
      }
      if (this._resHeaders.etag) {
        headers["if-none-match"] = headers["if-none-match"] ? `${headers["if-none-match"]}, ${this._resHeaders.etag}` : this._resHeaders.etag;
      }
      var forbidsWeakValidators = headers["accept-ranges"] || headers["if-match"] || headers["if-unmodified-since"] || this._method && this._method != "GET";
      if (forbidsWeakValidators) {
        delete headers["if-modified-since"];
        if (headers["if-none-match"]) {
          var etags = headers["if-none-match"].split(/,/).filter(function(etag) {
            return !/^\s*W\//.test(etag);
          });
          if (!etags.length) {
            delete headers["if-none-match"];
          } else {
            headers["if-none-match"] = etags.join(",").trim();
          }
        }
      } else if (this._resHeaders["last-modified"] && !headers["if-modified-since"]) {
        headers["if-modified-since"] = this._resHeaders["last-modified"];
      }
      return headers;
    };
    CachePolicy.prototype.revalidatedPolicy = function revalidatedPolicy(request, response) {
      this._assertRequestHasHeaders(request);
      if (!response || !response.headers) {
        throw Error("Response headers missing");
      }
      var matches = false;
      if (response.status !== undefined && response.status != 304) {
        matches = false;
      } else if (response.headers.etag && !/^\s*W\//.test(response.headers.etag)) {
        matches = this._resHeaders.etag && this._resHeaders.etag.replace(/^\s*W\//, "") === response.headers.etag;
      } else if (this._resHeaders.etag && response.headers.etag) {
        matches = this._resHeaders.etag.replace(/^\s*W\//, "") === response.headers.etag.replace(/^\s*W\//, "");
      } else if (this._resHeaders["last-modified"]) {
        matches = this._resHeaders["last-modified"] === response.headers["last-modified"];
      } else {
        if (!this._resHeaders.etag && !this._resHeaders["last-modified"] && !response.headers.etag && !response.headers["last-modified"]) {
          matches = true;
        }
      }
      if (!matches) {
        return {
          policy: new this.constructor(request, response),
          modified: true
        };
      }
      var headers = {};
      for (var k in this._resHeaders) {
        headers[k] = k in response.headers && !excludedFromRevalidationUpdate[k] ? response.headers[k] : this._resHeaders[k];
      }
      var newResponse = Object.assign({}, response, {
        status: this._status,
        method: this._method,
        headers
      });
      return {
        policy: new this.constructor(request, newResponse),
        modified: false
      };
    };
    return CachePolicy;
  }();
});

// node_modules/cacheable-request/node_modules/responselike/node_modules/lowercase-keys/index.js
var require_lowercase_keys = __commonJS((exports, module) => {
  module.exports = function(obj) {
    var ret = {};
    var keys = Object.keys(Object(obj));
    for (var i = 0;i < keys.length; i++) {
      ret[keys[i].toLowerCase()] = obj[keys[i]];
    }
    return ret;
  };
});

// node_modules/cacheable-request/node_modules/responselike/src/index.js
var require_src = __commonJS((exports, module) => {
  var Readable = import.meta.require("stream").Readable;
  var lowercaseKeys = require_lowercase_keys();

  class Response extends Readable {
    constructor(statusCode, headers, body, url) {
      if (typeof statusCode !== "number") {
        throw new TypeError("Argument `statusCode` should be a number");
      }
      if (typeof headers !== "object") {
        throw new TypeError("Argument `headers` should be an object");
      }
      if (!(body instanceof Buffer)) {
        throw new TypeError("Argument `body` should be a buffer");
      }
      if (typeof url !== "string") {
        throw new TypeError("Argument `url` should be a string");
      }
      super();
      this.statusCode = statusCode;
      this.headers = lowercaseKeys(headers);
      this.body = body;
      this.url = url;
    }
    _read() {
      this.push(this.body);
      this.push(null);
    }
  }
  module.exports = Response;
});

// node_modules/cacheable-request/node_modules/lowercase-keys/index.js
var require_lowercase_keys2 = __commonJS((exports, module) => {
  module.exports = function(obj) {
    var ret = {};
    var keys = Object.keys(Object(obj));
    for (var i = 0;i < keys.length; i++) {
      ret[keys[i].toLowerCase()] = obj[keys[i]];
    }
    return ret;
  };
});

// node_modules/mimic-response/index.js
var require_mimic_response = __commonJS((exports, module) => {
  var knownProps = [
    "destroy",
    "setTimeout",
    "socket",
    "headers",
    "trailers",
    "rawHeaders",
    "statusCode",
    "httpVersion",
    "httpVersionMinor",
    "httpVersionMajor",
    "rawTrailers",
    "statusMessage"
  ];
  module.exports = (fromStream, toStream) => {
    const fromProps = new Set(Object.keys(fromStream).concat(knownProps));
    for (const prop of fromProps) {
      if (prop in toStream) {
        continue;
      }
      toStream[prop] = typeof fromStream[prop] === "function" ? fromStream[prop].bind(fromStream) : fromStream[prop];
    }
  };
});

// node_modules/clone-response/src/index.js
var require_src2 = __commonJS((exports, module) => {
  var PassThrough = import.meta.require("stream").PassThrough;
  var mimicResponse = require_mimic_response();
  var cloneResponse = (response) => {
    if (!(response && response.pipe)) {
      throw new TypeError("Parameter `response` must be a response stream.");
    }
    const clone = new PassThrough;
    mimicResponse(response, clone);
    return response.pipe(clone);
  };
  module.exports = cloneResponse;
});

// node_modules/json-buffer/index.js
var require_json_buffer = __commonJS((exports) => {
  exports.stringify = function stringify(o) {
    if (typeof o == "undefined")
      return o;
    if (o && Buffer.isBuffer(o))
      return JSON.stringify(":base64:" + o.toString("base64"));
    if (o && o.toJSON)
      o = o.toJSON();
    if (o && typeof o === "object") {
      var s = "";
      var array = Array.isArray(o);
      s = array ? "[" : "{";
      var first = true;
      for (var k in o) {
        var ignore = typeof o[k] == "function" || !array && typeof o[k] === "undefined";
        if (Object.hasOwnProperty.call(o, k) && !ignore) {
          if (!first)
            s += ",";
          first = false;
          if (array) {
            if (o[k] == undefined)
              s += "null";
            else
              s += stringify(o[k]);
          } else if (o[k] !== undefined) {
            s += stringify(k) + ":" + stringify(o[k]);
          }
        }
      }
      s += array ? "]" : "}";
      return s;
    } else if (typeof o === "string") {
      return JSON.stringify(/^:/.test(o) ? ":" + o : o);
    } else if (typeof o === "undefined") {
      return "null";
    } else
      return JSON.stringify(o);
  };
  exports.parse = function(s) {
    return JSON.parse(s, function(key, value) {
      if (typeof value === "string") {
        if (/^:base64:/.test(value))
          return new Buffer(value.substring(8), "base64");
        else
          return /^:/.test(value) ? value.substring(1) : value;
      }
      return value;
    });
  };
});

// node_modules/keyv/src/index.js
var require_src3 = __commonJS((exports, module) => {
  var EventEmitter = import.meta.require("events");
  var JSONB = require_json_buffer();
  var loadStore = (opts) => {
    const adapters = {
      redis: "@keyv/redis",
      mongodb: "@keyv/mongo",
      mongo: "@keyv/mongo",
      sqlite: "@keyv/sqlite",
      postgresql: "@keyv/postgres",
      postgres: "@keyv/postgres",
      mysql: "@keyv/mysql"
    };
    if (opts.adapter || opts.uri) {
      const adapter = opts.adapter || /^[^:]*/.exec(opts.uri)[0];
      return new (import.meta.require(adapters[adapter]))(opts);
    }
    return new Map;
  };

  class Keyv extends EventEmitter {
    constructor(uri, opts) {
      super();
      this.opts = Object.assign({ namespace: "keyv" }, typeof uri === "string" ? { uri } : uri, opts);
      if (!this.opts.store) {
        const adapterOpts = Object.assign({}, this.opts);
        this.opts.store = loadStore(adapterOpts);
      }
      if (typeof this.opts.store.on === "function") {
        this.opts.store.on("error", (err) => this.emit("error", err));
      }
      this.opts.store.namespace = this.opts.namespace;
    }
    _getKeyPrefix(key) {
      return `${this.opts.namespace}:${key}`;
    }
    get(key) {
      key = this._getKeyPrefix(key);
      const store = this.opts.store;
      return Promise.resolve().then(() => store.get(key)).then((data) => {
        data = typeof data === "string" ? JSONB.parse(data) : data;
        if (data === undefined) {
          return;
        }
        if (typeof data.expires === "number" && Date.now() > data.expires) {
          this.delete(key);
          return;
        }
        return data.value;
      });
    }
    set(key, value, ttl) {
      key = this._getKeyPrefix(key);
      if (typeof ttl === "undefined") {
        ttl = this.opts.ttl;
      }
      if (ttl === 0) {
        ttl = undefined;
      }
      const store = this.opts.store;
      return Promise.resolve().then(() => {
        const expires = typeof ttl === "number" ? Date.now() + ttl : null;
        value = { value, expires };
        return store.set(key, JSONB.stringify(value), ttl);
      }).then(() => true);
    }
    delete(key) {
      key = this._getKeyPrefix(key);
      const store = this.opts.store;
      return Promise.resolve().then(() => store.delete(key));
    }
    clear() {
      const store = this.opts.store;
      return Promise.resolve().then(() => store.clear());
    }
  }
  module.exports = Keyv;
});

// node_modules/cacheable-request/src/index.js
var require_src4 = __commonJS((exports, module) => {
  var EventEmitter = import.meta.require("events");
  var urlLib = import.meta.require("url");
  var normalizeUrl = require_normalize_url();
  var getStream = require_get_stream3();
  var CachePolicy = require_node4();
  var Response = require_src();
  var lowercaseKeys = require_lowercase_keys2();
  var cloneResponse = require_src2();
  var Keyv = require_src3();

  class CacheableRequest {
    constructor(request, cacheAdapter) {
      if (typeof request !== "function") {
        throw new TypeError("Parameter `request` must be a function");
      }
      this.cache = new Keyv({
        uri: typeof cacheAdapter === "string" && cacheAdapter,
        store: typeof cacheAdapter !== "string" && cacheAdapter,
        namespace: "cacheable-request"
      });
      return this.createCacheableRequest(request);
    }
    createCacheableRequest(request) {
      return (opts, cb) => {
        if (typeof opts === "string") {
          opts = urlLib.parse(opts);
        }
        opts = Object.assign({
          headers: {},
          method: "GET",
          cache: true,
          strictTtl: false,
          automaticFailover: false
        }, opts);
        opts.headers = lowercaseKeys(opts.headers);
        const ee = new EventEmitter;
        const url = normalizeUrl(urlLib.format(opts));
        const key = `${opts.method}:${url}`;
        let revalidate = false;
        let madeRequest = false;
        const makeRequest = (opts2) => {
          madeRequest = true;
          const handler = (response) => {
            if (revalidate) {
              const revalidatedPolicy = CachePolicy.fromObject(revalidate.cachePolicy).revalidatedPolicy(opts2, response);
              if (!revalidatedPolicy.modified) {
                const headers = revalidatedPolicy.policy.responseHeaders();
                response = new Response(response.statusCode, headers, revalidate.body, revalidate.url);
                response.cachePolicy = revalidatedPolicy.policy;
                response.fromCache = true;
              }
            }
            if (!response.fromCache) {
              response.cachePolicy = new CachePolicy(opts2, response);
              response.fromCache = false;
            }
            let clonedResponse;
            if (opts2.cache && response.cachePolicy.storable()) {
              clonedResponse = cloneResponse(response);
              getStream.buffer(response).then((body) => {
                const value = {
                  cachePolicy: response.cachePolicy.toObject(),
                  url: response.url,
                  statusCode: response.fromCache ? revalidate.statusCode : response.statusCode,
                  body
                };
                const ttl = opts2.strictTtl ? response.cachePolicy.timeToLive() : undefined;
                return this.cache.set(key, value, ttl);
              }).catch((err) => ee.emit("error", new CacheableRequest.CacheError(err)));
            } else if (opts2.cache && revalidate) {
              this.cache.delete(key).catch((err) => ee.emit("error", new CacheableRequest.CacheError(err)));
            }
            ee.emit("response", clonedResponse || response);
            if (typeof cb === "function") {
              cb(clonedResponse || response);
            }
          };
          try {
            const req = request(opts2, handler);
            ee.emit("request", req);
          } catch (err) {
            ee.emit("error", new CacheableRequest.RequestError(err));
          }
        };
        const get = (opts2) => Promise.resolve().then(() => opts2.cache ? this.cache.get(key) : undefined).then((cacheEntry) => {
          if (typeof cacheEntry === "undefined") {
            return makeRequest(opts2);
          }
          const policy = CachePolicy.fromObject(cacheEntry.cachePolicy);
          if (policy.satisfiesWithoutRevalidation(opts2)) {
            const headers = policy.responseHeaders();
            const response = new Response(cacheEntry.statusCode, headers, cacheEntry.body, cacheEntry.url);
            response.cachePolicy = policy;
            response.fromCache = true;
            ee.emit("response", response);
            if (typeof cb === "function") {
              cb(response);
            }
          } else {
            revalidate = cacheEntry;
            opts2.headers = policy.revalidationHeaders(opts2);
            makeRequest(opts2);
          }
        });
        this.cache.on("error", (err) => ee.emit("error", new CacheableRequest.CacheError(err)));
        get(opts).catch((err) => {
          if (opts.automaticFailover && !madeRequest) {
            makeRequest(opts);
          }
          ee.emit("error", new CacheableRequest.CacheError(err));
        });
        return ee;
      };
    }
  }
  CacheableRequest.RequestError = class extends Error {
    constructor(err) {
      super(err.message);
      this.name = "RequestError";
      Object.assign(this, err);
    }
  };
  CacheableRequest.CacheError = class extends Error {
    constructor(err) {
      super(err.message);
      this.name = "CacheError";
      Object.assign(this, err);
    }
  };
  module.exports = CacheableRequest;
});

// node_modules/duplexer3/index.js
var require_duplexer3 = __commonJS((exports, module) => {
  var DuplexWrapper = function(options, writable, readable) {
    if (typeof readable === "undefined") {
      readable = writable;
      writable = options;
      options = null;
    }
    stream2.Duplex.call(this, options);
    if (typeof readable.read !== "function") {
      readable = new stream2.Readable(options).wrap(readable);
    }
    this._writable = writable;
    this._readable = readable;
    this._waiting = false;
    var self2 = this;
    writable.once("finish", function() {
      self2.end();
    });
    this.once("finish", function() {
      writable.end();
    });
    readable.on("readable", function() {
      if (self2._waiting) {
        self2._waiting = false;
        self2._read();
      }
    });
    readable.once("end", function() {
      self2.push(null);
    });
    if (!options || typeof options.bubbleErrors === "undefined" || options.bubbleErrors) {
      writable.on("error", function(err) {
        self2.emit("error", err);
      });
      readable.on("error", function(err) {
        self2.emit("error", err);
      });
    }
  };
  var stream2 = import.meta.require("stream");
  DuplexWrapper.prototype = Object.create(stream2.Duplex.prototype, { constructor: { value: DuplexWrapper } });
  DuplexWrapper.prototype._write = function _write(input, encoding, done) {
    this._writable.write(input, encoding, done);
  };
  DuplexWrapper.prototype._read = function _read() {
    var buf;
    var reads = 0;
    while ((buf = this._readable.read()) !== null) {
      this.push(buf);
      reads++;
    }
    if (reads === 0) {
      this._waiting = true;
    }
  };
  module.exports = function duplex2(options, writable, readable) {
    return new DuplexWrapper(options, writable, readable);
  };
  module.exports.DuplexWrapper = DuplexWrapper;
});

// node_modules/from2/node_modules/readable-stream/lib/internal/streams/stream-browser.js
var require_stream_browser2 = __commonJS((exports, module) => {
  module.exports = import.meta.require("events").EventEmitter;
});

// node_modules/from2/node_modules/readable-stream/node_modules/safe-buffer/index.js
var require_safe_buffer4 = __commonJS((exports, module) => {
  var copyProps = function(src, dst) {
    for (var key in src) {
      dst[key] = src[key];
    }
  };
  var SafeBuffer = function(arg, encodingOrOffset, length) {
    return Buffer4(arg, encodingOrOffset, length);
  };
  var buffer = import.meta.require("buffer");
  var Buffer4 = buffer.Buffer;
  if (Buffer4.from && Buffer4.alloc && Buffer4.allocUnsafe && Buffer4.allocUnsafeSlow) {
    module.exports = buffer;
  } else {
    copyProps(buffer, exports);
    exports.Buffer = SafeBuffer;
  }
  copyProps(Buffer4, SafeBuffer);
  SafeBuffer.from = function(arg, encodingOrOffset, length) {
    if (typeof arg === "number") {
      throw new TypeError("Argument must not be a number");
    }
    return Buffer4(arg, encodingOrOffset, length);
  };
  SafeBuffer.alloc = function(size, fill, encoding) {
    if (typeof size !== "number") {
      throw new TypeError("Argument must be a number");
    }
    var buf = Buffer4(size);
    if (fill !== undefined) {
      if (typeof encoding === "string") {
        buf.fill(fill, encoding);
      } else {
        buf.fill(fill);
      }
    } else {
      buf.fill(0);
    }
    return buf;
  };
  SafeBuffer.allocUnsafe = function(size) {
    if (typeof size !== "number") {
      throw new TypeError("Argument must be a number");
    }
    return Buffer4(size);
  };
  SafeBuffer.allocUnsafeSlow = function(size) {
    if (typeof size !== "number") {
      throw new TypeError("Argument must be a number");
    }
    return buffer.SlowBuffer(size);
  };
});

// node_modules/from2/node_modules/readable-stream/lib/internal/streams/destroy.js
var require_destroy2 = __commonJS((exports, module) => {
  var destroy = function(err, cb) {
    var _this = this;
    var readableDestroyed = this._readableState && this._readableState.destroyed;
    var writableDestroyed = this._writableState && this._writableState.destroyed;
    if (readableDestroyed || writableDestroyed) {
      if (cb) {
        cb(err);
      } else if (err) {
        if (!this._writableState) {
          pna.nextTick(emitErrorNT, this, err);
        } else if (!this._writableState.errorEmitted) {
          this._writableState.errorEmitted = true;
          pna.nextTick(emitErrorNT, this, err);
        }
      }
      return this;
    }
    if (this._readableState) {
      this._readableState.destroyed = true;
    }
    if (this._writableState) {
      this._writableState.destroyed = true;
    }
    this._destroy(err || null, function(err2) {
      if (!cb && err2) {
        if (!_this._writableState) {
          pna.nextTick(emitErrorNT, _this, err2);
        } else if (!_this._writableState.errorEmitted) {
          _this._writableState.errorEmitted = true;
          pna.nextTick(emitErrorNT, _this, err2);
        }
      } else if (cb) {
        cb(err2);
      }
    });
    return this;
  };
  var undestroy = function() {
    if (this._readableState) {
      this._readableState.destroyed = false;
      this._readableState.reading = false;
      this._readableState.ended = false;
      this._readableState.endEmitted = false;
    }
    if (this._writableState) {
      this._writableState.destroyed = false;
      this._writableState.ended = false;
      this._writableState.ending = false;
      this._writableState.finalCalled = false;
      this._writableState.prefinished = false;
      this._writableState.finished = false;
      this._writableState.errorEmitted = false;
    }
  };
  var emitErrorNT = function(self2, err) {
    self2.emit("error", err);
  };
  var pna = require_process_nextick_args();
  module.exports = {
    destroy,
    undestroy
  };
});

// node_modules/from2/node_modules/readable-stream/lib/_stream_writable.js
var require__stream_writable2 = __commonJS((exports, module) => {
  var CorkedRequest = function(state) {
    var _this = this;
    this.next = null;
    this.entry = null;
    this.finish = function() {
      onCorkedFinish(_this, state);
    };
  };
  var _uint8ArrayToBuffer = function(chunk) {
    return Buffer4.from(chunk);
  };
  var _isUint8Array = function(obj) {
    return Buffer4.isBuffer(obj) || obj instanceof OurUint8Array;
  };
  var nop = function() {
  };
  var WritableState = function(options, stream2) {
    Duplex = Duplex || require__stream_duplex2();
    options = options || {};
    var isDuplex = stream2 instanceof Duplex;
    this.objectMode = !!options.objectMode;
    if (isDuplex)
      this.objectMode = this.objectMode || !!options.writableObjectMode;
    var hwm = options.highWaterMark;
    var writableHwm = options.writableHighWaterMark;
    var defaultHwm = this.objectMode ? 16 : 16 * 1024;
    if (hwm || hwm === 0)
      this.highWaterMark = hwm;
    else if (isDuplex && (writableHwm || writableHwm === 0))
      this.highWaterMark = writableHwm;
    else
      this.highWaterMark = defaultHwm;
    this.highWaterMark = Math.floor(this.highWaterMark);
    this.finalCalled = false;
    this.needDrain = false;
    this.ending = false;
    this.ended = false;
    this.finished = false;
    this.destroyed = false;
    var noDecode = options.decodeStrings === false;
    this.decodeStrings = !noDecode;
    this.defaultEncoding = options.defaultEncoding || "utf8";
    this.length = 0;
    this.writing = false;
    this.corked = 0;
    this.sync = true;
    this.bufferProcessing = false;
    this.onwrite = function(er) {
      onwrite(stream2, er);
    };
    this.writecb = null;
    this.writelen = 0;
    this.bufferedRequest = null;
    this.lastBufferedRequest = null;
    this.pendingcb = 0;
    this.prefinished = false;
    this.errorEmitted = false;
    this.bufferedRequestCount = 0;
    this.corkedRequestsFree = new CorkedRequest(this);
  };
  var Writable = function(options) {
    Duplex = Duplex || require__stream_duplex2();
    if (!realHasInstance.call(Writable, this) && !(this instanceof Duplex)) {
      return new Writable(options);
    }
    this._writableState = new WritableState(options, this);
    this.writable = true;
    if (options) {
      if (typeof options.write === "function")
        this._write = options.write;
      if (typeof options.writev === "function")
        this._writev = options.writev;
      if (typeof options.destroy === "function")
        this._destroy = options.destroy;
      if (typeof options.final === "function")
        this._final = options.final;
    }
    Stream.call(this);
  };
  var writeAfterEnd = function(stream2, cb) {
    var er = new Error("write after end");
    stream2.emit("error", er);
    pna.nextTick(cb, er);
  };
  var validChunk = function(stream2, state, chunk, cb) {
    var valid = true;
    var er = false;
    if (chunk === null) {
      er = new TypeError("May not write null values to stream");
    } else if (typeof chunk !== "string" && chunk !== undefined && !state.objectMode) {
      er = new TypeError("Invalid non-string/buffer chunk");
    }
    if (er) {
      stream2.emit("error", er);
      pna.nextTick(cb, er);
      valid = false;
    }
    return valid;
  };
  var decodeChunk = function(state, chunk, encoding) {
    if (!state.objectMode && state.decodeStrings !== false && typeof chunk === "string") {
      chunk = Buffer4.from(chunk, encoding);
    }
    return chunk;
  };
  var writeOrBuffer = function(stream2, state, isBuf, chunk, encoding, cb) {
    if (!isBuf) {
      var newChunk = decodeChunk(state, chunk, encoding);
      if (chunk !== newChunk) {
        isBuf = true;
        encoding = "buffer";
        chunk = newChunk;
      }
    }
    var len = state.objectMode ? 1 : chunk.length;
    state.length += len;
    var ret = state.length < state.highWaterMark;
    if (!ret)
      state.needDrain = true;
    if (state.writing || state.corked) {
      var last = state.lastBufferedRequest;
      state.lastBufferedRequest = {
        chunk,
        encoding,
        isBuf,
        callback: cb,
        next: null
      };
      if (last) {
        last.next = state.lastBufferedRequest;
      } else {
        state.bufferedRequest = state.lastBufferedRequest;
      }
      state.bufferedRequestCount += 1;
    } else {
      doWrite(stream2, state, false, len, chunk, encoding, cb);
    }
    return ret;
  };
  var doWrite = function(stream2, state, writev, len, chunk, encoding, cb) {
    state.writelen = len;
    state.writecb = cb;
    state.writing = true;
    state.sync = true;
    if (writev)
      stream2._writev(chunk, state.onwrite);
    else
      stream2._write(chunk, encoding, state.onwrite);
    state.sync = false;
  };
  var onwriteError = function(stream2, state, sync, er, cb) {
    --state.pendingcb;
    if (sync) {
      pna.nextTick(cb, er);
      pna.nextTick(finishMaybe, stream2, state);
      stream2._writableState.errorEmitted = true;
      stream2.emit("error", er);
    } else {
      cb(er);
      stream2._writableState.errorEmitted = true;
      stream2.emit("error", er);
      finishMaybe(stream2, state);
    }
  };
  var onwriteStateUpdate = function(state) {
    state.writing = false;
    state.writecb = null;
    state.length -= state.writelen;
    state.writelen = 0;
  };
  var onwrite = function(stream2, er) {
    var state = stream2._writableState;
    var sync = state.sync;
    var cb = state.writecb;
    onwriteStateUpdate(state);
    if (er)
      onwriteError(stream2, state, sync, er, cb);
    else {
      var finished = needFinish(state);
      if (!finished && !state.corked && !state.bufferProcessing && state.bufferedRequest) {
        clearBuffer(stream2, state);
      }
      if (sync) {
        asyncWrite(afterWrite, stream2, state, finished, cb);
      } else {
        afterWrite(stream2, state, finished, cb);
      }
    }
  };
  var afterWrite = function(stream2, state, finished, cb) {
    if (!finished)
      onwriteDrain(stream2, state);
    state.pendingcb--;
    cb();
    finishMaybe(stream2, state);
  };
  var onwriteDrain = function(stream2, state) {
    if (state.length === 0 && state.needDrain) {
      state.needDrain = false;
      stream2.emit("drain");
    }
  };
  var clearBuffer = function(stream2, state) {
    state.bufferProcessing = true;
    var entry = state.bufferedRequest;
    if (stream2._writev && entry && entry.next) {
      var l = state.bufferedRequestCount;
      var buffer = new Array(l);
      var holder = state.corkedRequestsFree;
      holder.entry = entry;
      var count = 0;
      var allBuffers = true;
      while (entry) {
        buffer[count] = entry;
        if (!entry.isBuf)
          allBuffers = false;
        entry = entry.next;
        count += 1;
      }
      buffer.allBuffers = allBuffers;
      doWrite(stream2, state, true, state.length, buffer, "", holder.finish);
      state.pendingcb++;
      state.lastBufferedRequest = null;
      if (holder.next) {
        state.corkedRequestsFree = holder.next;
        holder.next = null;
      } else {
        state.corkedRequestsFree = new CorkedRequest(state);
      }
      state.bufferedRequestCount = 0;
    } else {
      while (entry) {
        var chunk = entry.chunk;
        var encoding = entry.encoding;
        var cb = entry.callback;
        var len = state.objectMode ? 1 : chunk.length;
        doWrite(stream2, state, false, len, chunk, encoding, cb);
        entry = entry.next;
        state.bufferedRequestCount--;
        if (state.writing) {
          break;
        }
      }
      if (entry === null)
        state.lastBufferedRequest = null;
    }
    state.bufferedRequest = entry;
    state.bufferProcessing = false;
  };
  var needFinish = function(state) {
    return state.ending && state.length === 0 && state.bufferedRequest === null && !state.finished && !state.writing;
  };
  var callFinal = function(stream2, state) {
    stream2._final(function(err) {
      state.pendingcb--;
      if (err) {
        stream2.emit("error", err);
      }
      state.prefinished = true;
      stream2.emit("prefinish");
      finishMaybe(stream2, state);
    });
  };
  var prefinish = function(stream2, state) {
    if (!state.prefinished && !state.finalCalled) {
      if (typeof stream2._final === "function") {
        state.pendingcb++;
        state.finalCalled = true;
        pna.nextTick(callFinal, stream2, state);
      } else {
        state.prefinished = true;
        stream2.emit("prefinish");
      }
    }
  };
  var finishMaybe = function(stream2, state) {
    var need = needFinish(state);
    if (need) {
      prefinish(stream2, state);
      if (state.pendingcb === 0) {
        state.finished = true;
        stream2.emit("finish");
      }
    }
    return need;
  };
  var endWritable = function(stream2, state, cb) {
    state.ending = true;
    finishMaybe(stream2, state);
    if (cb) {
      if (state.finished)
        pna.nextTick(cb);
      else
        stream2.once("finish", cb);
    }
    state.ended = true;
    stream2.writable = false;
  };
  var onCorkedFinish = function(corkReq, state, err) {
    var entry = corkReq.entry;
    corkReq.entry = null;
    while (entry) {
      var cb = entry.callback;
      state.pendingcb--;
      cb(err);
      entry = entry.next;
    }
    state.corkedRequestsFree.next = corkReq;
  };
  var pna = require_process_nextick_args();
  module.exports = Writable;
  var asyncWrite = pna.nextTick;
  var Duplex;
  Writable.WritableState = WritableState;
  var util = Object.create(require_util2());
  util.inherits = require_inherits_browser();
  var internalUtil = {
    deprecate: require_browser()
  };
  var Stream = require_stream_browser2();
  var Buffer4 = require_safe_buffer4().Buffer;
  var OurUint8Array = (typeof global !== "undefined" ? global : typeof window !== "undefined" ? window : typeof self !== "undefined" ? self : {}).Uint8Array || function() {
  };
  var destroyImpl = require_destroy2();
  util.inherits(Writable, Stream);
  WritableState.prototype.getBuffer = function getBuffer() {
    var current = this.bufferedRequest;
    var out = [];
    while (current) {
      out.push(current);
      current = current.next;
    }
    return out;
  };
  (function() {
    try {
      Object.defineProperty(WritableState.prototype, "buffer", {
        get: internalUtil.deprecate(function() {
          return this.getBuffer();
        }, "_writableState.buffer is deprecated. Use _writableState.getBuffer " + "instead.", "DEP0003")
      });
    } catch (_) {
    }
  })();
  var realHasInstance;
  if (typeof Symbol === "function" && Symbol.hasInstance && typeof Function.prototype[Symbol.hasInstance] === "function") {
    realHasInstance = Function.prototype[Symbol.hasInstance];
    Object.defineProperty(Writable, Symbol.hasInstance, {
      value: function(object) {
        if (realHasInstance.call(this, object))
          return true;
        if (this !== Writable)
          return false;
        return object && object._writableState instanceof WritableState;
      }
    });
  } else {
    realHasInstance = function(object) {
      return object instanceof this;
    };
  }
  Writable.prototype.pipe = function() {
    this.emit("error", new Error("Cannot pipe, not readable"));
  };
  Writable.prototype.write = function(chunk, encoding, cb) {
    var state = this._writableState;
    var ret = false;
    var isBuf = !state.objectMode && _isUint8Array(chunk);
    if (isBuf && !Buffer4.isBuffer(chunk)) {
      chunk = _uint8ArrayToBuffer(chunk);
    }
    if (typeof encoding === "function") {
      cb = encoding;
      encoding = null;
    }
    if (isBuf)
      encoding = "buffer";
    else if (!encoding)
      encoding = state.defaultEncoding;
    if (typeof cb !== "function")
      cb = nop;
    if (state.ended)
      writeAfterEnd(this, cb);
    else if (isBuf || validChunk(this, state, chunk, cb)) {
      state.pendingcb++;
      ret = writeOrBuffer(this, state, isBuf, chunk, encoding, cb);
    }
    return ret;
  };
  Writable.prototype.cork = function() {
    var state = this._writableState;
    state.corked++;
  };
  Writable.prototype.uncork = function() {
    var state = this._writableState;
    if (state.corked) {
      state.corked--;
      if (!state.writing && !state.corked && !state.bufferProcessing && state.bufferedRequest)
        clearBuffer(this, state);
    }
  };
  Writable.prototype.setDefaultEncoding = function setDefaultEncoding(encoding) {
    if (typeof encoding === "string")
      encoding = encoding.toLowerCase();
    if (!(["hex", "utf8", "utf-8", "ascii", "binary", "base64", "ucs2", "ucs-2", "utf16le", "utf-16le", "raw"].indexOf((encoding + "").toLowerCase()) > -1))
      throw new TypeError("Unknown encoding: " + encoding);
    this._writableState.defaultEncoding = encoding;
    return this;
  };
  Object.defineProperty(Writable.prototype, "writableHighWaterMark", {
    enumerable: false,
    get: function() {
      return this._writableState.highWaterMark;
    }
  });
  Writable.prototype._write = function(chunk, encoding, cb) {
    cb(new Error("_write() is not implemented"));
  };
  Writable.prototype._writev = null;
  Writable.prototype.end = function(chunk, encoding, cb) {
    var state = this._writableState;
    if (typeof chunk === "function") {
      cb = chunk;
      chunk = null;
      encoding = null;
    } else if (typeof encoding === "function") {
      cb = encoding;
      encoding = null;
    }
    if (chunk !== null && chunk !== undefined)
      this.write(chunk, encoding);
    if (state.corked) {
      state.corked = 1;
      this.uncork();
    }
    if (!state.ending)
      endWritable(this, state, cb);
  };
  Object.defineProperty(Writable.prototype, "destroyed", {
    get: function() {
      if (this._writableState === undefined) {
        return false;
      }
      return this._writableState.destroyed;
    },
    set: function(value) {
      if (!this._writableState) {
        return;
      }
      this._writableState.destroyed = value;
    }
  });
  Writable.prototype.destroy = destroyImpl.destroy;
  Writable.prototype._undestroy = destroyImpl.undestroy;
  Writable.prototype._destroy = function(err, cb) {
    this.end();
    cb(err);
  };
});

// node_modules/from2/node_modules/readable-stream/lib/_stream_duplex.js
var require__stream_duplex2 = __commonJS((exports, module) => {
  var Duplex = function(options) {
    if (!(this instanceof Duplex))
      return new Duplex(options);
    Readable.call(this, options);
    Writable.call(this, options);
    if (options && options.readable === false)
      this.readable = false;
    if (options && options.writable === false)
      this.writable = false;
    this.allowHalfOpen = true;
    if (options && options.allowHalfOpen === false)
      this.allowHalfOpen = false;
    this.once("end", onend);
  };
  var onend = function() {
    if (this.allowHalfOpen || this._writableState.ended)
      return;
    pna.nextTick(onEndNT, this);
  };
  var onEndNT = function(self2) {
    self2.end();
  };
  var pna = require_process_nextick_args();
  var objectKeys = Object.keys || function(obj) {
    var keys2 = [];
    for (var key in obj) {
      keys2.push(key);
    }
    return keys2;
  };
  module.exports = Duplex;
  var util = Object.create(require_util2());
  util.inherits = require_inherits_browser();
  var Readable = require__stream_readable2();
  var Writable = require__stream_writable2();
  util.inherits(Duplex, Readable);
  {
    keys = objectKeys(Writable.prototype);
    for (v = 0;v < keys.length; v++) {
      method = keys[v];
      if (!Duplex.prototype[method])
        Duplex.prototype[method] = Writable.prototype[method];
    }
  }
  var keys;
  var method;
  var v;
  Object.defineProperty(Duplex.prototype, "writableHighWaterMark", {
    enumerable: false,
    get: function() {
      return this._writableState.highWaterMark;
    }
  });
  Object.defineProperty(Duplex.prototype, "destroyed", {
    get: function() {
      if (this._readableState === undefined || this._writableState === undefined) {
        return false;
      }
      return this._readableState.destroyed && this._writableState.destroyed;
    },
    set: function(value) {
      if (this._readableState === undefined || this._writableState === undefined) {
        return;
      }
      this._readableState.destroyed = value;
      this._writableState.destroyed = value;
    }
  });
  Duplex.prototype._destroy = function(err, cb) {
    this.push(null);
    this.end();
    pna.nextTick(cb, err);
  };
});

// node_modules/from2/node_modules/readable-stream/lib/internal/streams/BufferList.js
var require_BufferList2 = __commonJS((exports, module) => {
  var _classCallCheck = function(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };
  var copyBuffer = function(src, target, offset) {
    src.copy(target, offset);
  };
  var Buffer4 = require_safe_buffer4().Buffer;
  var util = import.meta.require("util");
  module.exports = function() {
    function BufferList() {
      _classCallCheck(this, BufferList);
      this.head = null;
      this.tail = null;
      this.length = 0;
    }
    BufferList.prototype.push = function push(v) {
      var entry = { data: v, next: null };
      if (this.length > 0)
        this.tail.next = entry;
      else
        this.head = entry;
      this.tail = entry;
      ++this.length;
    };
    BufferList.prototype.unshift = function unshift(v) {
      var entry = { data: v, next: this.head };
      if (this.length === 0)
        this.tail = entry;
      this.head = entry;
      ++this.length;
    };
    BufferList.prototype.shift = function shift() {
      if (this.length === 0)
        return;
      var ret = this.head.data;
      if (this.length === 1)
        this.head = this.tail = null;
      else
        this.head = this.head.next;
      --this.length;
      return ret;
    };
    BufferList.prototype.clear = function clear() {
      this.head = this.tail = null;
      this.length = 0;
    };
    BufferList.prototype.join = function join(s) {
      if (this.length === 0)
        return "";
      var p = this.head;
      var ret = "" + p.data;
      while (p = p.next) {
        ret += s + p.data;
      }
      return ret;
    };
    BufferList.prototype.concat = function concat(n) {
      if (this.length === 0)
        return Buffer4.alloc(0);
      var ret = Buffer4.allocUnsafe(n >>> 0);
      var p = this.head;
      var i = 0;
      while (p) {
        copyBuffer(p.data, ret, i);
        i += p.data.length;
        p = p.next;
      }
      return ret;
    };
    return BufferList;
  }();
  if (util && util.inspect && util.inspect.custom) {
    module.exports.prototype[util.inspect.custom] = function() {
      var obj = util.inspect({ length: this.length });
      return this.constructor.name + " " + obj;
    };
  }
});

// node_modules/from2/node_modules/readable-stream/lib/_stream_readable.js
var require__stream_readable2 = __commonJS((exports, module) => {
  var _uint8ArrayToBuffer = function(chunk) {
    return Buffer4.from(chunk);
  };
  var _isUint8Array = function(obj) {
    return Buffer4.isBuffer(obj) || obj instanceof OurUint8Array;
  };
  var prependListener = function(emitter, event, fn) {
    if (typeof emitter.prependListener === "function")
      return emitter.prependListener(event, fn);
    if (!emitter._events || !emitter._events[event])
      emitter.on(event, fn);
    else if (isArray(emitter._events[event]))
      emitter._events[event].unshift(fn);
    else
      emitter._events[event] = [fn, emitter._events[event]];
  };
  var ReadableState = function(options, stream2) {
    Duplex = Duplex || require__stream_duplex2();
    options = options || {};
    var isDuplex = stream2 instanceof Duplex;
    this.objectMode = !!options.objectMode;
    if (isDuplex)
      this.objectMode = this.objectMode || !!options.readableObjectMode;
    var hwm = options.highWaterMark;
    var readableHwm = options.readableHighWaterMark;
    var defaultHwm = this.objectMode ? 16 : 16 * 1024;
    if (hwm || hwm === 0)
      this.highWaterMark = hwm;
    else if (isDuplex && (readableHwm || readableHwm === 0))
      this.highWaterMark = readableHwm;
    else
      this.highWaterMark = defaultHwm;
    this.highWaterMark = Math.floor(this.highWaterMark);
    this.buffer = new BufferList;
    this.length = 0;
    this.pipes = null;
    this.pipesCount = 0;
    this.flowing = null;
    this.ended = false;
    this.endEmitted = false;
    this.reading = false;
    this.sync = true;
    this.needReadable = false;
    this.emittedReadable = false;
    this.readableListening = false;
    this.resumeScheduled = false;
    this.destroyed = false;
    this.defaultEncoding = options.defaultEncoding || "utf8";
    this.awaitDrain = 0;
    this.readingMore = false;
    this.decoder = null;
    this.encoding = null;
    if (options.encoding) {
      if (!StringDecoder)
        StringDecoder = require_string_decoder().StringDecoder;
      this.decoder = new StringDecoder(options.encoding);
      this.encoding = options.encoding;
    }
  };
  var Readable = function(options) {
    Duplex = Duplex || require__stream_duplex2();
    if (!(this instanceof Readable))
      return new Readable(options);
    this._readableState = new ReadableState(options, this);
    this.readable = true;
    if (options) {
      if (typeof options.read === "function")
        this._read = options.read;
      if (typeof options.destroy === "function")
        this._destroy = options.destroy;
    }
    Stream.call(this);
  };
  var readableAddChunk = function(stream2, chunk, encoding, addToFront, skipChunkCheck) {
    var state = stream2._readableState;
    if (chunk === null) {
      state.reading = false;
      onEofChunk(stream2, state);
    } else {
      var er;
      if (!skipChunkCheck)
        er = chunkInvalid(state, chunk);
      if (er) {
        stream2.emit("error", er);
      } else if (state.objectMode || chunk && chunk.length > 0) {
        if (typeof chunk !== "string" && !state.objectMode && Object.getPrototypeOf(chunk) !== Buffer4.prototype) {
          chunk = _uint8ArrayToBuffer(chunk);
        }
        if (addToFront) {
          if (state.endEmitted)
            stream2.emit("error", new Error("stream.unshift() after end event"));
          else
            addChunk(stream2, state, chunk, true);
        } else if (state.ended) {
          stream2.emit("error", new Error("stream.push() after EOF"));
        } else {
          state.reading = false;
          if (state.decoder && !encoding) {
            chunk = state.decoder.write(chunk);
            if (state.objectMode || chunk.length !== 0)
              addChunk(stream2, state, chunk, false);
            else
              maybeReadMore(stream2, state);
          } else {
            addChunk(stream2, state, chunk, false);
          }
        }
      } else if (!addToFront) {
        state.reading = false;
      }
    }
    return needMoreData(state);
  };
  var addChunk = function(stream2, state, chunk, addToFront) {
    if (state.flowing && state.length === 0 && !state.sync) {
      stream2.emit("data", chunk);
      stream2.read(0);
    } else {
      state.length += state.objectMode ? 1 : chunk.length;
      if (addToFront)
        state.buffer.unshift(chunk);
      else
        state.buffer.push(chunk);
      if (state.needReadable)
        emitReadable(stream2);
    }
    maybeReadMore(stream2, state);
  };
  var chunkInvalid = function(state, chunk) {
    var er;
    if (!_isUint8Array(chunk) && typeof chunk !== "string" && chunk !== undefined && !state.objectMode) {
      er = new TypeError("Invalid non-string/buffer chunk");
    }
    return er;
  };
  var needMoreData = function(state) {
    return !state.ended && (state.needReadable || state.length < state.highWaterMark || state.length === 0);
  };
  var computeNewHighWaterMark = function(n) {
    if (n >= MAX_HWM) {
      n = MAX_HWM;
    } else {
      n--;
      n |= n >>> 1;
      n |= n >>> 2;
      n |= n >>> 4;
      n |= n >>> 8;
      n |= n >>> 16;
      n++;
    }
    return n;
  };
  var howMuchToRead = function(n, state) {
    if (n <= 0 || state.length === 0 && state.ended)
      return 0;
    if (state.objectMode)
      return 1;
    if (n !== n) {
      if (state.flowing && state.length)
        return state.buffer.head.data.length;
      else
        return state.length;
    }
    if (n > state.highWaterMark)
      state.highWaterMark = computeNewHighWaterMark(n);
    if (n <= state.length)
      return n;
    if (!state.ended) {
      state.needReadable = true;
      return 0;
    }
    return state.length;
  };
  var onEofChunk = function(stream2, state) {
    if (state.ended)
      return;
    if (state.decoder) {
      var chunk = state.decoder.end();
      if (chunk && chunk.length) {
        state.buffer.push(chunk);
        state.length += state.objectMode ? 1 : chunk.length;
      }
    }
    state.ended = true;
    emitReadable(stream2);
  };
  var emitReadable = function(stream2) {
    var state = stream2._readableState;
    state.needReadable = false;
    if (!state.emittedReadable) {
      debug("emitReadable", state.flowing);
      state.emittedReadable = true;
      if (state.sync)
        pna.nextTick(emitReadable_, stream2);
      else
        emitReadable_(stream2);
    }
  };
  var emitReadable_ = function(stream2) {
    debug("emit readable");
    stream2.emit("readable");
    flow(stream2);
  };
  var maybeReadMore = function(stream2, state) {
    if (!state.readingMore) {
      state.readingMore = true;
      pna.nextTick(maybeReadMore_, stream2, state);
    }
  };
  var maybeReadMore_ = function(stream2, state) {
    var len = state.length;
    while (!state.reading && !state.flowing && !state.ended && state.length < state.highWaterMark) {
      debug("maybeReadMore read 0");
      stream2.read(0);
      if (len === state.length)
        break;
      else
        len = state.length;
    }
    state.readingMore = false;
  };
  var pipeOnDrain = function(src) {
    return function() {
      var state = src._readableState;
      debug("pipeOnDrain", state.awaitDrain);
      if (state.awaitDrain)
        state.awaitDrain--;
      if (state.awaitDrain === 0 && EElistenerCount(src, "data")) {
        state.flowing = true;
        flow(src);
      }
    };
  };
  var nReadingNextTick = function(self2) {
    debug("readable nexttick read 0");
    self2.read(0);
  };
  var resume = function(stream2, state) {
    if (!state.resumeScheduled) {
      state.resumeScheduled = true;
      pna.nextTick(resume_, stream2, state);
    }
  };
  var resume_ = function(stream2, state) {
    if (!state.reading) {
      debug("resume read 0");
      stream2.read(0);
    }
    state.resumeScheduled = false;
    state.awaitDrain = 0;
    stream2.emit("resume");
    flow(stream2);
    if (state.flowing && !state.reading)
      stream2.read(0);
  };
  var flow = function(stream2) {
    var state = stream2._readableState;
    debug("flow", state.flowing);
    while (state.flowing && stream2.read() !== null) {
    }
  };
  var fromList = function(n, state) {
    if (state.length === 0)
      return null;
    var ret;
    if (state.objectMode)
      ret = state.buffer.shift();
    else if (!n || n >= state.length) {
      if (state.decoder)
        ret = state.buffer.join("");
      else if (state.buffer.length === 1)
        ret = state.buffer.head.data;
      else
        ret = state.buffer.concat(state.length);
      state.buffer.clear();
    } else {
      ret = fromListPartial(n, state.buffer, state.decoder);
    }
    return ret;
  };
  var fromListPartial = function(n, list, hasStrings) {
    var ret;
    if (n < list.head.data.length) {
      ret = list.head.data.slice(0, n);
      list.head.data = list.head.data.slice(n);
    } else if (n === list.head.data.length) {
      ret = list.shift();
    } else {
      ret = hasStrings ? copyFromBufferString(n, list) : copyFromBuffer(n, list);
    }
    return ret;
  };
  var copyFromBufferString = function(n, list) {
    var p = list.head;
    var c = 1;
    var ret = p.data;
    n -= ret.length;
    while (p = p.next) {
      var str = p.data;
      var nb = n > str.length ? str.length : n;
      if (nb === str.length)
        ret += str;
      else
        ret += str.slice(0, n);
      n -= nb;
      if (n === 0) {
        if (nb === str.length) {
          ++c;
          if (p.next)
            list.head = p.next;
          else
            list.head = list.tail = null;
        } else {
          list.head = p;
          p.data = str.slice(nb);
        }
        break;
      }
      ++c;
    }
    list.length -= c;
    return ret;
  };
  var copyFromBuffer = function(n, list) {
    var ret = Buffer4.allocUnsafe(n);
    var p = list.head;
    var c = 1;
    p.data.copy(ret);
    n -= p.data.length;
    while (p = p.next) {
      var buf = p.data;
      var nb = n > buf.length ? buf.length : n;
      buf.copy(ret, ret.length - n, 0, nb);
      n -= nb;
      if (n === 0) {
        if (nb === buf.length) {
          ++c;
          if (p.next)
            list.head = p.next;
          else
            list.head = list.tail = null;
        } else {
          list.head = p;
          p.data = buf.slice(nb);
        }
        break;
      }
      ++c;
    }
    list.length -= c;
    return ret;
  };
  var endReadable = function(stream2) {
    var state = stream2._readableState;
    if (state.length > 0)
      throw new Error('"endReadable()" called on non-empty stream');
    if (!state.endEmitted) {
      state.ended = true;
      pna.nextTick(endReadableNT, state, stream2);
    }
  };
  var endReadableNT = function(state, stream2) {
    if (!state.endEmitted && state.length === 0) {
      state.endEmitted = true;
      stream2.readable = false;
      stream2.emit("end");
    }
  };
  var indexOf = function(xs, x) {
    for (var i = 0, l = xs.length;i < l; i++) {
      if (xs[i] === x)
        return i;
    }
    return -1;
  };
  var pna = require_process_nextick_args();
  module.exports = Readable;
  var isArray = require_isarray();
  var Duplex;
  Readable.ReadableState = ReadableState;
  var EE = import.meta.require("events").EventEmitter;
  var EElistenerCount = function(emitter, type) {
    return emitter.listeners(type).length;
  };
  var Stream = require_stream_browser2();
  var Buffer4 = require_safe_buffer4().Buffer;
  var OurUint8Array = (typeof global !== "undefined" ? global : typeof window !== "undefined" ? window : typeof self !== "undefined" ? self : {}).Uint8Array || function() {
  };
  var util = Object.create(require_util2());
  util.inherits = require_inherits_browser();
  var debugUtil = import.meta.require("util");
  var debug = undefined;
  if (debugUtil && debugUtil.debuglog) {
    debug = debugUtil.debuglog("stream");
  } else {
    debug = function() {
    };
  }
  var BufferList = require_BufferList2();
  var destroyImpl = require_destroy2();
  var StringDecoder;
  util.inherits(Readable, Stream);
  var kProxyEvents = ["error", "close", "destroy", "pause", "resume"];
  Object.defineProperty(Readable.prototype, "destroyed", {
    get: function() {
      if (this._readableState === undefined) {
        return false;
      }
      return this._readableState.destroyed;
    },
    set: function(value) {
      if (!this._readableState) {
        return;
      }
      this._readableState.destroyed = value;
    }
  });
  Readable.prototype.destroy = destroyImpl.destroy;
  Readable.prototype._undestroy = destroyImpl.undestroy;
  Readable.prototype._destroy = function(err, cb) {
    this.push(null);
    cb(err);
  };
  Readable.prototype.push = function(chunk, encoding) {
    var state = this._readableState;
    var skipChunkCheck;
    if (!state.objectMode) {
      if (typeof chunk === "string") {
        encoding = encoding || state.defaultEncoding;
        if (encoding !== state.encoding) {
          chunk = Buffer4.from(chunk, encoding);
          encoding = "";
        }
        skipChunkCheck = true;
      }
    } else {
      skipChunkCheck = true;
    }
    return readableAddChunk(this, chunk, encoding, false, skipChunkCheck);
  };
  Readable.prototype.unshift = function(chunk) {
    return readableAddChunk(this, chunk, null, true, false);
  };
  Readable.prototype.isPaused = function() {
    return this._readableState.flowing === false;
  };
  Readable.prototype.setEncoding = function(enc) {
    if (!StringDecoder)
      StringDecoder = require_string_decoder().StringDecoder;
    this._readableState.decoder = new StringDecoder(enc);
    this._readableState.encoding = enc;
    return this;
  };
  var MAX_HWM = 8388608;
  Readable.prototype.read = function(n) {
    debug("read", n);
    n = parseInt(n, 10);
    var state = this._readableState;
    var nOrig = n;
    if (n !== 0)
      state.emittedReadable = false;
    if (n === 0 && state.needReadable && (state.length >= state.highWaterMark || state.ended)) {
      debug("read: emitReadable", state.length, state.ended);
      if (state.length === 0 && state.ended)
        endReadable(this);
      else
        emitReadable(this);
      return null;
    }
    n = howMuchToRead(n, state);
    if (n === 0 && state.ended) {
      if (state.length === 0)
        endReadable(this);
      return null;
    }
    var doRead = state.needReadable;
    debug("need readable", doRead);
    if (state.length === 0 || state.length - n < state.highWaterMark) {
      doRead = true;
      debug("length less than watermark", doRead);
    }
    if (state.ended || state.reading) {
      doRead = false;
      debug("reading or ended", doRead);
    } else if (doRead) {
      debug("do read");
      state.reading = true;
      state.sync = true;
      if (state.length === 0)
        state.needReadable = true;
      this._read(state.highWaterMark);
      state.sync = false;
      if (!state.reading)
        n = howMuchToRead(nOrig, state);
    }
    var ret;
    if (n > 0)
      ret = fromList(n, state);
    else
      ret = null;
    if (ret === null) {
      state.needReadable = true;
      n = 0;
    } else {
      state.length -= n;
    }
    if (state.length === 0) {
      if (!state.ended)
        state.needReadable = true;
      if (nOrig !== n && state.ended)
        endReadable(this);
    }
    if (ret !== null)
      this.emit("data", ret);
    return ret;
  };
  Readable.prototype._read = function(n) {
    this.emit("error", new Error("_read() is not implemented"));
  };
  Readable.prototype.pipe = function(dest, pipeOpts) {
    var src = this;
    var state = this._readableState;
    switch (state.pipesCount) {
      case 0:
        state.pipes = dest;
        break;
      case 1:
        state.pipes = [state.pipes, dest];
        break;
      default:
        state.pipes.push(dest);
        break;
    }
    state.pipesCount += 1;
    debug("pipe count=%d opts=%j", state.pipesCount, pipeOpts);
    var doEnd = (!pipeOpts || pipeOpts.end !== false) && dest !== process.stdout && dest !== process.stderr;
    var endFn = doEnd ? onend : unpipe;
    if (state.endEmitted)
      pna.nextTick(endFn);
    else
      src.once("end", endFn);
    dest.on("unpipe", onunpipe);
    function onunpipe(readable, unpipeInfo) {
      debug("onunpipe");
      if (readable === src) {
        if (unpipeInfo && unpipeInfo.hasUnpiped === false) {
          unpipeInfo.hasUnpiped = true;
          cleanup();
        }
      }
    }
    function onend() {
      debug("onend");
      dest.end();
    }
    var ondrain = pipeOnDrain(src);
    dest.on("drain", ondrain);
    var cleanedUp = false;
    function cleanup() {
      debug("cleanup");
      dest.removeListener("close", onclose);
      dest.removeListener("finish", onfinish);
      dest.removeListener("drain", ondrain);
      dest.removeListener("error", onerror);
      dest.removeListener("unpipe", onunpipe);
      src.removeListener("end", onend);
      src.removeListener("end", unpipe);
      src.removeListener("data", ondata);
      cleanedUp = true;
      if (state.awaitDrain && (!dest._writableState || dest._writableState.needDrain))
        ondrain();
    }
    var increasedAwaitDrain = false;
    src.on("data", ondata);
    function ondata(chunk) {
      debug("ondata");
      increasedAwaitDrain = false;
      var ret = dest.write(chunk);
      if (ret === false && !increasedAwaitDrain) {
        if ((state.pipesCount === 1 && state.pipes === dest || state.pipesCount > 1 && indexOf(state.pipes, dest) !== -1) && !cleanedUp) {
          debug("false write response, pause", state.awaitDrain);
          state.awaitDrain++;
          increasedAwaitDrain = true;
        }
        src.pause();
      }
    }
    function onerror(er) {
      debug("onerror", er);
      unpipe();
      dest.removeListener("error", onerror);
      if (EElistenerCount(dest, "error") === 0)
        dest.emit("error", er);
    }
    prependListener(dest, "error", onerror);
    function onclose() {
      dest.removeListener("finish", onfinish);
      unpipe();
    }
    dest.once("close", onclose);
    function onfinish() {
      debug("onfinish");
      dest.removeListener("close", onclose);
      unpipe();
    }
    dest.once("finish", onfinish);
    function unpipe() {
      debug("unpipe");
      src.unpipe(dest);
    }
    dest.emit("pipe", src);
    if (!state.flowing) {
      debug("pipe resume");
      src.resume();
    }
    return dest;
  };
  Readable.prototype.unpipe = function(dest) {
    var state = this._readableState;
    var unpipeInfo = { hasUnpiped: false };
    if (state.pipesCount === 0)
      return this;
    if (state.pipesCount === 1) {
      if (dest && dest !== state.pipes)
        return this;
      if (!dest)
        dest = state.pipes;
      state.pipes = null;
      state.pipesCount = 0;
      state.flowing = false;
      if (dest)
        dest.emit("unpipe", this, unpipeInfo);
      return this;
    }
    if (!dest) {
      var dests = state.pipes;
      var len = state.pipesCount;
      state.pipes = null;
      state.pipesCount = 0;
      state.flowing = false;
      for (var i = 0;i < len; i++) {
        dests[i].emit("unpipe", this, { hasUnpiped: false });
      }
      return this;
    }
    var index = indexOf(state.pipes, dest);
    if (index === -1)
      return this;
    state.pipes.splice(index, 1);
    state.pipesCount -= 1;
    if (state.pipesCount === 1)
      state.pipes = state.pipes[0];
    dest.emit("unpipe", this, unpipeInfo);
    return this;
  };
  Readable.prototype.on = function(ev, fn) {
    var res = Stream.prototype.on.call(this, ev, fn);
    if (ev === "data") {
      if (this._readableState.flowing !== false)
        this.resume();
    } else if (ev === "readable") {
      var state = this._readableState;
      if (!state.endEmitted && !state.readableListening) {
        state.readableListening = state.needReadable = true;
        state.emittedReadable = false;
        if (!state.reading) {
          pna.nextTick(nReadingNextTick, this);
        } else if (state.length) {
          emitReadable(this);
        }
      }
    }
    return res;
  };
  Readable.prototype.addListener = Readable.prototype.on;
  Readable.prototype.resume = function() {
    var state = this._readableState;
    if (!state.flowing) {
      debug("resume");
      state.flowing = true;
      resume(this, state);
    }
    return this;
  };
  Readable.prototype.pause = function() {
    debug("call pause flowing=%j", this._readableState.flowing);
    if (this._readableState.flowing !== false) {
      debug("pause");
      this._readableState.flowing = false;
      this.emit("pause");
    }
    return this;
  };
  Readable.prototype.wrap = function(stream2) {
    var _this = this;
    var state = this._readableState;
    var paused = false;
    stream2.on("end", function() {
      debug("wrapped end");
      if (state.decoder && !state.ended) {
        var chunk = state.decoder.end();
        if (chunk && chunk.length)
          _this.push(chunk);
      }
      _this.push(null);
    });
    stream2.on("data", function(chunk) {
      debug("wrapped data");
      if (state.decoder)
        chunk = state.decoder.write(chunk);
      if (state.objectMode && (chunk === null || chunk === undefined))
        return;
      else if (!state.objectMode && (!chunk || !chunk.length))
        return;
      var ret = _this.push(chunk);
      if (!ret) {
        paused = true;
        stream2.pause();
      }
    });
    for (var i in stream2) {
      if (this[i] === undefined && typeof stream2[i] === "function") {
        this[i] = function(method) {
          return function() {
            return stream2[method].apply(stream2, arguments);
          };
        }(i);
      }
    }
    for (var n = 0;n < kProxyEvents.length; n++) {
      stream2.on(kProxyEvents[n], this.emit.bind(this, kProxyEvents[n]));
    }
    this._read = function(n2) {
      debug("wrapped _read", n2);
      if (paused) {
        paused = false;
        stream2.resume();
      }
    };
    return this;
  };
  Object.defineProperty(Readable.prototype, "readableHighWaterMark", {
    enumerable: false,
    get: function() {
      return this._readableState.highWaterMark;
    }
  });
  Readable._fromList = fromList;
});

// node_modules/from2/node_modules/readable-stream/lib/_stream_transform.js
var require__stream_transform2 = __commonJS((exports, module) => {
  var afterTransform = function(er, data) {
    var ts = this._transformState;
    ts.transforming = false;
    var cb = ts.writecb;
    if (!cb) {
      return this.emit("error", new Error("write callback called multiple times"));
    }
    ts.writechunk = null;
    ts.writecb = null;
    if (data != null)
      this.push(data);
    cb(er);
    var rs = this._readableState;
    rs.reading = false;
    if (rs.needReadable || rs.length < rs.highWaterMark) {
      this._read(rs.highWaterMark);
    }
  };
  var Transform = function(options) {
    if (!(this instanceof Transform))
      return new Transform(options);
    Duplex.call(this, options);
    this._transformState = {
      afterTransform: afterTransform.bind(this),
      needTransform: false,
      transforming: false,
      writecb: null,
      writechunk: null,
      writeencoding: null
    };
    this._readableState.needReadable = true;
    this._readableState.sync = false;
    if (options) {
      if (typeof options.transform === "function")
        this._transform = options.transform;
      if (typeof options.flush === "function")
        this._flush = options.flush;
    }
    this.on("prefinish", prefinish);
  };
  var prefinish = function() {
    var _this = this;
    if (typeof this._flush === "function") {
      this._flush(function(er, data) {
        done(_this, er, data);
      });
    } else {
      done(this, null, null);
    }
  };
  var done = function(stream2, er, data) {
    if (er)
      return stream2.emit("error", er);
    if (data != null)
      stream2.push(data);
    if (stream2._writableState.length)
      throw new Error("Calling transform done when ws.length != 0");
    if (stream2._transformState.transforming)
      throw new Error("Calling transform done when still transforming");
    return stream2.push(null);
  };
  module.exports = Transform;
  var Duplex = require__stream_duplex2();
  var util = Object.create(require_util2());
  util.inherits = require_inherits_browser();
  util.inherits(Transform, Duplex);
  Transform.prototype.push = function(chunk, encoding) {
    this._transformState.needTransform = false;
    return Duplex.prototype.push.call(this, chunk, encoding);
  };
  Transform.prototype._transform = function(chunk, encoding, cb) {
    throw new Error("_transform() is not implemented");
  };
  Transform.prototype._write = function(chunk, encoding, cb) {
    var ts = this._transformState;
    ts.writecb = cb;
    ts.writechunk = chunk;
    ts.writeencoding = encoding;
    if (!ts.transforming) {
      var rs = this._readableState;
      if (ts.needTransform || rs.needReadable || rs.length < rs.highWaterMark)
        this._read(rs.highWaterMark);
    }
  };
  Transform.prototype._read = function(n) {
    var ts = this._transformState;
    if (ts.writechunk !== null && ts.writecb && !ts.transforming) {
      ts.transforming = true;
      this._transform(ts.writechunk, ts.writeencoding, ts.afterTransform);
    } else {
      ts.needTransform = true;
    }
  };
  Transform.prototype._destroy = function(err, cb) {
    var _this2 = this;
    Duplex.prototype._destroy.call(this, err, function(err2) {
      cb(err2);
      _this2.emit("close");
    });
  };
});

// node_modules/from2/node_modules/readable-stream/lib/_stream_passthrough.js
var require__stream_passthrough2 = __commonJS((exports, module) => {
  var PassThrough = function(options) {
    if (!(this instanceof PassThrough))
      return new PassThrough(options);
    Transform.call(this, options);
  };
  module.exports = PassThrough;
  var Transform = require__stream_transform2();
  var util = Object.create(require_util2());
  util.inherits = require_inherits_browser();
  util.inherits(PassThrough, Transform);
  PassThrough.prototype._transform = function(chunk, encoding, cb) {
    cb(null, chunk);
  };
});

// node_modules/from2/node_modules/readable-stream/readable-browser.js
var require_readable_browser2 = __commonJS((exports, module) => {
  exports = module.exports = require__stream_readable2();
  exports.Stream = exports;
  exports.Readable = exports;
  exports.Writable = require__stream_writable2();
  exports.Duplex = require__stream_duplex2();
  exports.Transform = require__stream_transform2();
  exports.PassThrough = require__stream_passthrough2();
});

// node_modules/from2/index.js
var require_from2 = __commonJS((exports, module) => {
  var toFunction = function(list) {
    list = list.slice();
    return function(_, cb) {
      var err = null;
      var item = list.length ? list.shift() : null;
      if (item instanceof Error) {
        err = item;
        item = null;
      }
      cb(err, item);
    };
  };
  var from2 = function(opts, read) {
    if (typeof opts !== "object" || Array.isArray(opts)) {
      read = opts;
      opts = {};
    }
    var rs = new Proto(opts);
    rs._from = Array.isArray(read) ? toFunction(read) : read || noop2;
    return rs;
  };
  var ctor = function(opts, read) {
    if (typeof opts === "function") {
      read = opts;
      opts = {};
    }
    opts = defaults(opts);
    inherits(Class, Readable);
    function Class(override) {
      if (!(this instanceof Class))
        return new Class(override);
      this._reading = false;
      this._callback = check;
      this.destroyed = false;
      Readable.call(this, override || opts);
      var self2 = this;
      var hwm = this._readableState.highWaterMark;
      function check(err, data) {
        if (self2.destroyed)
          return;
        if (err)
          return self2.destroy(err);
        if (data === null)
          return self2.push(null);
        self2._reading = false;
        if (self2.push(data))
          self2._read(hwm);
      }
    }
    Class.prototype._from = read || noop2;
    Class.prototype._read = function(size) {
      if (this._reading || this.destroyed)
        return;
      this._reading = true;
      this._from(size, this._callback);
    };
    Class.prototype.destroy = function(err) {
      if (this.destroyed)
        return;
      this.destroyed = true;
      var self2 = this;
      process.nextTick(function() {
        if (err)
          self2.emit("error", err);
        self2.emit("close");
      });
    };
    return Class;
  };
  var obj = function(opts, read) {
    if (typeof opts === "function" || Array.isArray(opts)) {
      read = opts;
      opts = {};
    }
    opts = defaults(opts);
    opts.objectMode = true;
    opts.highWaterMark = 16;
    return from2(opts, read);
  };
  var noop2 = function() {
  };
  var defaults = function(opts) {
    opts = opts || {};
    return opts;
  };
  var Readable = require_readable_browser2().Readable;
  var inherits = require_inherits_browser();
  module.exports = from2;
  from2.ctor = ctor;
  from2.obj = obj;
  var Proto = ctor();
});

// node_modules/p-is-promise/index.js
var require_p_is_promise = __commonJS((exports, module) => {
  module.exports = (x) => x instanceof Promise || x !== null && typeof x === "object" && typeof x.then === "function" && typeof x.catch === "function";
});

// node_modules/into-stream/index.js
var require_into_stream = __commonJS((exports, module) => {
  var from = require_from2();
  var pIsPromise = require_p_is_promise();
  module.exports = (x) => {
    if (Array.isArray(x)) {
      x = x.slice();
    }
    let promise2;
    let iterator;
    prepare(x);
    function prepare(value) {
      x = value;
      promise2 = pIsPromise(x) ? x : null;
      const shouldIterate = !promise2 && x[Symbol.iterator] && typeof x !== "string" && !Buffer.isBuffer(x);
      iterator = shouldIterate ? x[Symbol.iterator]() : null;
    }
    return from(function reader(size, cb) {
      if (promise2) {
        promise2.then(prepare).then(() => reader.call(this, size, cb), cb);
        return;
      }
      if (iterator) {
        const obj = iterator.next();
        setImmediate(cb, null, obj.done ? null : obj.value);
        return;
      }
      if (x.length === 0) {
        setImmediate(cb, null, null);
        return;
      }
      const chunk = x.slice(0, size);
      x = x.slice(size);
      setImmediate(cb, null, chunk);
    });
  };
  module.exports.obj = (x) => {
    if (Array.isArray(x)) {
      x = x.slice();
    }
    let promise2;
    let iterator;
    prepare(x);
    function prepare(value) {
      x = value;
      promise2 = pIsPromise(x) ? x : null;
      iterator = !promise2 && x[Symbol.iterator] ? x[Symbol.iterator]() : null;
    }
    return from.obj(function reader(size, cb) {
      if (promise2) {
        promise2.then(prepare).then(() => reader.call(this, size, cb), cb);
        return;
      }
      if (iterator) {
        const obj = iterator.next();
        setImmediate(cb, null, obj.done ? null : obj.value);
        return;
      }
      this.push(x);
      setImmediate(cb, null, null);
    });
  };
});

// node_modules/got/node_modules/@sindresorhus/is/dist/index.js
var require_dist = __commonJS((exports, module) => {
  var is = function(value) {
    if (value === null) {
      return "null";
    }
    if (value === true || value === false) {
      return "boolean";
    }
    const type = typeof value;
    if (type === "undefined") {
      return "undefined";
    }
    if (type === "string") {
      return "string";
    }
    if (type === "number") {
      return "number";
    }
    if (type === "symbol") {
      return "symbol";
    }
    if (is.function_(value)) {
      return "Function";
    }
    if (Array.isArray(value)) {
      return "Array";
    }
    if (Buffer.isBuffer(value)) {
      return "Buffer";
    }
    const tagType = getObjectType(value);
    if (tagType) {
      return tagType;
    }
    if (value instanceof String || value instanceof Boolean || value instanceof Number) {
      throw new TypeError("Please don\'t use object wrappers for primitive types");
    }
    return "Object";
  };
  Object.defineProperty(exports, "__esModule", { value: true });
  var util = import.meta.require("util");
  var toString = Object.prototype.toString;
  var isOfType = (type) => (value) => typeof value === type;
  var getObjectType = (value) => {
    const objectName = toString.call(value).slice(8, -1);
    if (objectName) {
      return objectName;
    }
    return null;
  };
  var isObjectOfType = (typeName) => (value) => {
    return getObjectType(value) === typeName;
  };
  (function(is2) {
    const isObject = (value) => typeof value === "object";
    is2.undefined = isOfType("undefined");
    is2.string = isOfType("string");
    is2.number = isOfType("number");
    is2.function_ = isOfType("function");
    is2.null_ = (value) => value === null;
    is2.class_ = (value) => is2.function_(value) && value.toString().startsWith("class ");
    is2.boolean = (value) => value === true || value === false;
    is2.symbol = isOfType("symbol");
    is2.array = Array.isArray;
    is2.buffer = Buffer.isBuffer;
    is2.nullOrUndefined = (value) => is2.null_(value) || is2.undefined(value);
    is2.object = (value) => !is2.nullOrUndefined(value) && (is2.function_(value) || isObject(value));
    is2.iterable = (value) => !is2.nullOrUndefined(value) && is2.function_(value[Symbol.iterator]);
    is2.generator = (value) => is2.iterable(value) && is2.function_(value.next) && is2.function_(value.throw);
    is2.nativePromise = isObjectOfType("Promise");
    const hasPromiseAPI = (value) => !is2.null_(value) && isObject(value) && is2.function_(value.then) && is2.function_(value.catch);
    is2.promise = (value) => is2.nativePromise(value) || hasPromiseAPI(value);
    const isFunctionOfType = (type) => (value) => is2.function_(value) && is2.function_(value.constructor) && value.constructor.name === type;
    is2.generatorFunction = isFunctionOfType("GeneratorFunction");
    is2.asyncFunction = isFunctionOfType("AsyncFunction");
    is2.boundFunction = (value) => is2.function_(value) && !value.hasOwnProperty("prototype");
    is2.regExp = isObjectOfType("RegExp");
    is2.date = isObjectOfType("Date");
    is2.error = isObjectOfType("Error");
    is2.map = isObjectOfType("Map");
    is2.set = isObjectOfType("Set");
    is2.weakMap = isObjectOfType("WeakMap");
    is2.weakSet = isObjectOfType("WeakSet");
    is2.int8Array = isObjectOfType("Int8Array");
    is2.uint8Array = isObjectOfType("Uint8Array");
    is2.uint8ClampedArray = isObjectOfType("Uint8ClampedArray");
    is2.int16Array = isObjectOfType("Int16Array");
    is2.uint16Array = isObjectOfType("Uint16Array");
    is2.int32Array = isObjectOfType("Int32Array");
    is2.uint32Array = isObjectOfType("Uint32Array");
    is2.float32Array = isObjectOfType("Float32Array");
    is2.float64Array = isObjectOfType("Float64Array");
    is2.arrayBuffer = isObjectOfType("ArrayBuffer");
    is2.sharedArrayBuffer = isObjectOfType("SharedArrayBuffer");
    is2.dataView = isObjectOfType("DataView");
    is2.directInstanceOf = (instance, klass) => is2.object(instance) && is2.object(klass) && Object.getPrototypeOf(instance) === klass.prototype;
    is2.truthy = (value) => Boolean(value);
    is2.falsy = (value) => !value;
    is2.nan = (value) => Number.isNaN(value);
    const primitiveTypes = new Set([
      "undefined",
      "string",
      "number",
      "boolean",
      "symbol"
    ]);
    is2.primitive = (value) => is2.null_(value) || primitiveTypes.has(typeof value);
    is2.integer = (value) => Number.isInteger(value);
    is2.safeInteger = (value) => Number.isSafeInteger(value);
    is2.plainObject = (value) => {
      let prototype;
      return getObjectType(value) === "Object" && (prototype = Object.getPrototypeOf(value), prototype === null || prototype === Object.getPrototypeOf({}));
    };
    const typedArrayTypes = new Set([
      "Int8Array",
      "Uint8Array",
      "Uint8ClampedArray",
      "Int16Array",
      "Uint16Array",
      "Int32Array",
      "Uint32Array",
      "Float32Array",
      "Float64Array"
    ]);
    is2.typedArray = (value) => {
      const objectType = getObjectType(value);
      if (objectType === null) {
        return false;
      }
      return typedArrayTypes.has(objectType);
    };
    const isValidLength = (value) => is2.safeInteger(value) && value > -1;
    is2.arrayLike = (value) => !is2.nullOrUndefined(value) && !is2.function_(value) && isValidLength(value.length);
    is2.inRange = (value, range) => {
      if (is2.number(range)) {
        return value >= Math.min(0, range) && value <= Math.max(range, 0);
      }
      if (is2.array(range) && range.length === 2) {
        return value >= Math.min.apply(null, range) && value <= Math.max.apply(null, range);
      }
      throw new TypeError(`Invalid range: ${util.inspect(range)}`);
    };
    const NODE_TYPE_ELEMENT = 1;
    const DOM_PROPERTIES_TO_CHECK = [
      "innerHTML",
      "ownerDocument",
      "style",
      "attributes",
      "nodeValue"
    ];
    is2.domElement = (value) => is2.object(value) && value.nodeType === NODE_TYPE_ELEMENT && is2.string(value.nodeName) && !is2.plainObject(value) && DOM_PROPERTIES_TO_CHECK.every((property) => (property in value));
    is2.nodeStream = (value) => !is2.nullOrUndefined(value) && isObject(value) && is2.function_(value.pipe);
    is2.infinite = (value) => value === Infinity || value === -Infinity;
    const isAbsoluteMod2 = (value) => (rem) => is2.integer(rem) && Math.abs(rem % 2) === value;
    is2.even = isAbsoluteMod2(0);
    is2.odd = isAbsoluteMod2(1);
    const isWhiteSpaceString = (value) => is2.string(value) && /\S/.test(value) === false;
    const isEmptyStringOrArray = (value) => (is2.string(value) || is2.array(value)) && value.length === 0;
    const isEmptyObject = (value) => !is2.map(value) && !is2.set(value) && is2.object(value) && Object.keys(value).length === 0;
    const isEmptyMapOrSet = (value) => (is2.map(value) || is2.set(value)) && value.size === 0;
    is2.empty = (value) => is2.falsy(value) || isEmptyStringOrArray(value) || isEmptyObject(value) || isEmptyMapOrSet(value);
    is2.emptyOrWhitespace = (value) => is2.empty(value) || isWhiteSpaceString(value);
    const predicateOnArray = (method, predicate, args) => {
      const values = Array.prototype.slice.call(args, 1);
      if (is2.function_(predicate) === false) {
        throw new TypeError(`Invalid predicate: ${util.inspect(predicate)}`);
      }
      if (values.length === 0) {
        throw new TypeError("Invalid number of values");
      }
      return method.call(values, predicate);
    };
    function any(predicate) {
      return predicateOnArray(Array.prototype.some, predicate, arguments);
    }
    is2.any = any;
    function all(predicate) {
      return predicateOnArray(Array.prototype.every, predicate, arguments);
    }
    is2.all = all;
  })(is || (is = {}));
  Object.defineProperties(is, {
    class: {
      value: is.class_
    },
    function: {
      value: is.function_
    },
    null: {
      value: is.null_
    }
  });
  exports.default = is;
  module.exports = is;
  module.exports.default = is;
});

// node_modules/got/node_modules/get-stream/buffer-stream.js
var require_buffer_stream4 = __commonJS((exports, module) => {
  var PassThrough = import.meta.require("stream").PassThrough;
  module.exports = (opts) => {
    opts = Object.assign({}, opts);
    const array = opts.array;
    let encoding = opts.encoding;
    const buffer = encoding === "buffer";
    let objectMode = false;
    if (array) {
      objectMode = !(encoding || buffer);
    } else {
      encoding = encoding || "utf8";
    }
    if (buffer) {
      encoding = null;
    }
    let len = 0;
    const ret = [];
    const stream2 = new PassThrough({ objectMode });
    if (encoding) {
      stream2.setEncoding(encoding);
    }
    stream2.on("data", (chunk) => {
      ret.push(chunk);
      if (objectMode) {
        len = ret.length;
      } else {
        len += chunk.length;
      }
    });
    stream2.getBufferedValue = () => {
      if (array) {
        return ret;
      }
      return buffer ? Buffer.concat(ret, len) : ret.join("");
    };
    stream2.getBufferedLength = () => len;
    return stream2;
  };
});

// node_modules/got/node_modules/get-stream/index.js
var require_get_stream4 = __commonJS((exports, module) => {
  var getStream = function(inputStream, opts) {
    if (!inputStream) {
      return Promise.reject(new Error("Expected a stream"));
    }
    opts = Object.assign({ maxBuffer: Infinity }, opts);
    const maxBuffer = opts.maxBuffer;
    let stream2;
    let clean;
    const p = new Promise((resolve2, reject) => {
      const error2 = (err) => {
        if (err) {
          err.bufferedData = stream2.getBufferedValue();
        }
        reject(err);
      };
      stream2 = bufferStream(opts);
      inputStream.once("error", error2);
      inputStream.pipe(stream2);
      stream2.on("data", () => {
        if (stream2.getBufferedLength() > maxBuffer) {
          reject(new Error("maxBuffer exceeded"));
        }
      });
      stream2.once("error", error2);
      stream2.on("end", resolve2);
      clean = () => {
        if (inputStream.unpipe) {
          inputStream.unpipe(stream2);
        }
      };
    });
    p.then(clean, clean);
    return p.then(() => stream2.getBufferedValue());
  };
  var bufferStream = require_buffer_stream4();
  module.exports = getStream;
  module.exports.buffer = (stream2, opts) => getStream(stream2, Object.assign({}, opts, { encoding: "buffer" }));
  module.exports.array = (stream2, opts) => getStream(stream2, Object.assign({}, opts, { array: true }));
});

// node_modules/timed-out/index.js
var require_timed_out = __commonJS((exports, module) => {
  module.exports = function(req, time) {
    if (req.timeoutTimer) {
      return req;
    }
    var delays = isNaN(time) ? time : { socket: time, connect: time };
    var host = req._headers ? " to " + req._headers.host : "";
    if (delays.connect !== undefined) {
      req.timeoutTimer = setTimeout(function timeoutHandler() {
        req.abort();
        var e = new Error("Connection timed out on request" + host);
        e.code = "ETIMEDOUT";
        req.emit("error", e);
      }, delays.connect);
    }
    req.on("socket", function assign(socket) {
      if (!(socket.connecting || socket._connecting)) {
        connect();
        return;
      }
      socket.once("connect", connect);
    });
    function clear() {
      if (req.timeoutTimer) {
        clearTimeout(req.timeoutTimer);
        req.timeoutTimer = null;
      }
    }
    function connect() {
      clear();
      if (delays.socket !== undefined) {
        req.setTimeout(delays.socket, function socketTimeoutHandler() {
          req.abort();
          var e = new Error("Socket timed out on request" + host);
          e.code = "ESOCKETTIMEDOUT";
          req.emit("error", e);
        });
      }
    }
    return req.on("error", clear);
  };
});

// node_modules/url-parse-lax/index.js
var require_url_parse_lax = __commonJS((exports, module) => {
  var url = import.meta.require("url");
  var prependHttp = require_prepend_http();
  module.exports = (input, options) => {
    if (typeof input !== "string") {
      throw new TypeError(`Expected \`url\` to be of type \`string\`, got \`${typeof input}\` instead.`);
    }
    const finalUrl = prependHttp(input, Object.assign({ https: true }, options));
    return url.parse(finalUrl);
  };
});

// node_modules/lowercase-keys/index.js
var require_lowercase_keys3 = __commonJS((exports, module) => {
  module.exports = function(obj) {
    var ret = {};
    var keys = Object.keys(Object(obj));
    for (var i = 0;i < keys.length; i++) {
      ret[keys[i].toLowerCase()] = obj[keys[i]];
    }
    return ret;
  };
});

// node_modules/is-retry-allowed/index.js
var require_is_retry_allowed = __commonJS((exports, module) => {
  var WHITELIST = [
    "ETIMEDOUT",
    "ECONNRESET",
    "EADDRINUSE",
    "ESOCKETTIMEDOUT",
    "ECONNREFUSED",
    "EPIPE",
    "EHOSTUNREACH",
    "EAI_AGAIN"
  ];
  var BLACKLIST = [
    "ENOTFOUND",
    "ENETUNREACH",
    "UNABLE_TO_GET_ISSUER_CERT",
    "UNABLE_TO_GET_CRL",
    "UNABLE_TO_DECRYPT_CERT_SIGNATURE",
    "UNABLE_TO_DECRYPT_CRL_SIGNATURE",
    "UNABLE_TO_DECODE_ISSUER_PUBLIC_KEY",
    "CERT_SIGNATURE_FAILURE",
    "CRL_SIGNATURE_FAILURE",
    "CERT_NOT_YET_VALID",
    "CERT_HAS_EXPIRED",
    "CRL_NOT_YET_VALID",
    "CRL_HAS_EXPIRED",
    "ERROR_IN_CERT_NOT_BEFORE_FIELD",
    "ERROR_IN_CERT_NOT_AFTER_FIELD",
    "ERROR_IN_CRL_LAST_UPDATE_FIELD",
    "ERROR_IN_CRL_NEXT_UPDATE_FIELD",
    "OUT_OF_MEM",
    "DEPTH_ZERO_SELF_SIGNED_CERT",
    "SELF_SIGNED_CERT_IN_CHAIN",
    "UNABLE_TO_GET_ISSUER_CERT_LOCALLY",
    "UNABLE_TO_VERIFY_LEAF_SIGNATURE",
    "CERT_CHAIN_TOO_LONG",
    "CERT_REVOKED",
    "INVALID_CA",
    "PATH_LENGTH_EXCEEDED",
    "INVALID_PURPOSE",
    "CERT_UNTRUSTED",
    "CERT_REJECTED"
  ];
  module.exports = function(err) {
    if (!err || !err.code) {
      return true;
    }
    if (WHITELIST.indexOf(err.code) !== -1) {
      return true;
    }
    if (BLACKLIST.indexOf(err.code) !== -1) {
      return false;
    }
    return true;
  };
});

// node_modules/p-cancelable/index.js
var require_p_cancelable = __commonJS((exports, module) => {
  class CancelError extends Error {
    constructor() {
      super("Promise was canceled");
      this.name = "CancelError";
    }
    get isCanceled() {
      return true;
    }
  }

  class PCancelable {
    static fn(userFn) {
      return function() {
        const args = [].slice.apply(arguments);
        return new PCancelable((resolve2, reject, onCancel) => {
          args.push(onCancel);
          userFn.apply(null, args).then(resolve2, reject);
        });
      };
    }
    constructor(executor) {
      this._cancelHandlers = [];
      this._isPending = true;
      this._isCanceled = false;
      this._promise = new Promise((resolve2, reject) => {
        this._reject = reject;
        return executor((value) => {
          this._isPending = false;
          resolve2(value);
        }, (error2) => {
          this._isPending = false;
          reject(error2);
        }, (handler) => {
          this._cancelHandlers.push(handler);
        });
      });
    }
    then(onFulfilled, onRejected) {
      return this._promise.then(onFulfilled, onRejected);
    }
    catch(onRejected) {
      return this._promise.catch(onRejected);
    }
    finally(onFinally) {
      return this._promise.finally(onFinally);
    }
    cancel() {
      if (!this._isPending || this._isCanceled) {
        return;
      }
      if (this._cancelHandlers.length > 0) {
        try {
          for (const handler of this._cancelHandlers) {
            handler();
          }
        } catch (err) {
          this._reject(err);
        }
      }
      this._isCanceled = true;
      this._reject(new CancelError);
    }
    get isCanceled() {
      return this._isCanceled;
    }
  }
  Object.setPrototypeOf(PCancelable.prototype, Promise.prototype);
  module.exports = PCancelable;
  module.exports.CancelError = CancelError;
});

// node_modules/p-finally/index.js
var require_p_finally = __commonJS((exports, module) => {
  module.exports = (promise2, onFinally) => {
    onFinally = onFinally || (() => {
    });
    return promise2.then((val) => new Promise((resolve2) => {
      resolve2(onFinally());
    }).then(() => val), (err) => new Promise((resolve2) => {
      resolve2(onFinally());
    }).then(() => {
      throw err;
    }));
  };
});

// node_modules/got/node_modules/p-timeout/index.js
var require_p_timeout = __commonJS((exports, module) => {
  var pFinally = require_p_finally();

  class TimeoutError extends Error {
    constructor(message) {
      super(message);
      this.name = "TimeoutError";
    }
  }
  module.exports = (promise2, ms, fallback) => new Promise((resolve2, reject) => {
    if (typeof ms !== "number" || ms < 0) {
      throw new TypeError("Expected `ms` to be a positive number");
    }
    const timer = setTimeout(() => {
      if (typeof fallback === "function") {
        try {
          resolve2(fallback());
        } catch (err2) {
          reject(err2);
        }
        return;
      }
      const message = typeof fallback === "string" ? fallback : `Promise timed out after ${ms} milliseconds`;
      const err = fallback instanceof Error ? fallback : new TimeoutError(message);
      if (typeof promise2.cancel === "function") {
        promise2.cancel();
      }
      reject(err);
    }, ms);
    pFinally(promise2.then(resolve2, reject), () => {
      clearTimeout(timer);
    });
  });
  module.exports.TimeoutError = TimeoutError;
});

// node_modules/got/package.json
var require_package2 = __commonJS((exports, module) => {
  module.exports = {
    name: "got",
    version: "8.3.2",
    description: "Simplified HTTP requests",
    license: "MIT",
    repository: "sindresorhus/got",
    maintainers: [
      {
        name: "Sindre Sorhus",
        email: "sindresorhus@gmail.com",
        url: "sindresorhus.com"
      },
      {
        name: "Vsevolod Strukchinsky",
        email: "floatdrop@gmail.com",
        url: "github.com/floatdrop"
      },
      {
        name: "Alexander Tesfamichael",
        email: "alex.tesfamichael@gmail.com",
        url: "alextes.me"
      }
    ],
    engines: {
      node: ">=4"
    },
    scripts: {
      test: "xo && nyc ava",
      coveralls: "nyc report --reporter=text-lcov | coveralls"
    },
    files: [
      "index.js",
      "errors.js"
    ],
    keywords: [
      "http",
      "https",
      "get",
      "got",
      "url",
      "uri",
      "request",
      "util",
      "utility",
      "simple",
      "curl",
      "wget",
      "fetch",
      "net",
      "network",
      "electron"
    ],
    dependencies: {
      "@sindresorhus/is": "^0.7.0",
      "cacheable-request": "^2.1.1",
      "decompress-response": "^3.3.0",
      duplexer3: "^0.1.4",
      "get-stream": "^3.0.0",
      "into-stream": "^3.1.0",
      "is-retry-allowed": "^1.1.0",
      isurl: "^1.0.0-alpha5",
      "lowercase-keys": "^1.0.0",
      "mimic-response": "^1.0.0",
      "p-cancelable": "^0.4.0",
      "p-timeout": "^2.0.1",
      pify: "^3.0.0",
      "safe-buffer": "^5.1.1",
      "timed-out": "^4.0.1",
      "url-parse-lax": "^3.0.0",
      "url-to-options": "^1.0.1"
    },
    devDependencies: {
      ava: "^0.25.0",
      coveralls: "^3.0.0",
      "form-data": "^2.1.1",
      "get-port": "^3.0.0",
      nyc: "^11.0.2",
      "p-event": "^1.3.0",
      pem: "^1.4.4",
      proxyquire: "^1.8.0",
      sinon: "^4.0.0",
      "slow-stream": "0.0.4",
      tempfile: "^2.0.0",
      tempy: "^0.2.1",
      "universal-url": "1.0.0-alpha",
      xo: "^0.20.0"
    },
    ava: {
      concurrency: 4
    },
    browser: {
      "decompress-response": false,
      electron: false
    }
  };
});

// node_modules/got/errors.js
var require_errors = __commonJS((exports, module) => {
  var urlLib = import.meta.require("url");
  var http = import.meta.require("http");
  var PCancelable = require_p_cancelable();
  var is = require_dist();

  class GotError extends Error {
    constructor(message, error2, opts) {
      super(message);
      Error.captureStackTrace(this, this.constructor);
      this.name = "GotError";
      if (!is.undefined(error2.code)) {
        this.code = error2.code;
      }
      Object.assign(this, {
        host: opts.host,
        hostname: opts.hostname,
        method: opts.method,
        path: opts.path,
        protocol: opts.protocol,
        url: opts.href
      });
    }
  }
  exports.GotError = GotError;
  exports.CacheError = class extends GotError {
    constructor(error2, opts) {
      super(error2.message, error2, opts);
      this.name = "CacheError";
    }
  };
  exports.RequestError = class extends GotError {
    constructor(error2, opts) {
      super(error2.message, error2, opts);
      this.name = "RequestError";
    }
  };
  exports.ReadError = class extends GotError {
    constructor(error2, opts) {
      super(error2.message, error2, opts);
      this.name = "ReadError";
    }
  };
  exports.ParseError = class extends GotError {
    constructor(error2, statusCode, opts, data) {
      super(`${error2.message} in "${urlLib.format(opts)}": \n${data.slice(0, 77)}...`, error2, opts);
      this.name = "ParseError";
      this.statusCode = statusCode;
      this.statusMessage = http.STATUS_CODES[this.statusCode];
    }
  };
  exports.HTTPError = class extends GotError {
    constructor(statusCode, statusMessage, headers, opts) {
      if (statusMessage) {
        statusMessage = statusMessage.replace(/\r?\n/g, " ").trim();
      } else {
        statusMessage = http.STATUS_CODES[statusCode];
      }
      super(`Response code ${statusCode} (${statusMessage})`, {}, opts);
      this.name = "HTTPError";
      this.statusCode = statusCode;
      this.statusMessage = statusMessage;
      this.headers = headers;
    }
  };
  exports.MaxRedirectsError = class extends GotError {
    constructor(statusCode, redirectUrls, opts) {
      super("Redirected 10 times. Aborting.", {}, opts);
      this.name = "MaxRedirectsError";
      this.statusCode = statusCode;
      this.statusMessage = http.STATUS_CODES[this.statusCode];
      this.redirectUrls = redirectUrls;
    }
  };
  exports.UnsupportedProtocolError = class extends GotError {
    constructor(opts) {
      super(`Unsupported protocol "${opts.protocol}"`, {}, opts);
      this.name = "UnsupportedProtocolError";
    }
  };
  exports.CancelError = PCancelable.CancelError;
});

// node_modules/got/index.js
var require_got = __commonJS((exports, module) => {
  var requestAsEventEmitter = function(opts) {
    opts = opts || {};
    const ee = new EventEmitter;
    const requestUrl = opts.href || urlLib.resolve(urlLib.format(opts), opts.path);
    const redirects = [];
    const agents = is.object(opts.agent) ? opts.agent : null;
    let retryCount = 0;
    let redirectUrl;
    let uploadBodySize;
    let uploaded = 0;
    const get = (opts2) => {
      if (opts2.protocol !== "http:" && opts2.protocol !== "https:") {
        ee.emit("error", new got.UnsupportedProtocolError(opts2));
        return;
      }
      let fn = opts2.protocol === "https:" ? https : http;
      if (agents) {
        const protocolName = opts2.protocol === "https:" ? "https" : "http";
        opts2.agent = agents[protocolName] || opts2.agent;
      }
      if (opts2.useElectronNet && process.versions.electron) {
        const electron = (()=>({}));
        fn = electron.net || electron.remote.net;
      }
      let progressInterval;
      const cacheableRequest = new CacheableRequest(fn.request, opts2.cache);
      const cacheReq = cacheableRequest(opts2, (res) => {
        clearInterval(progressInterval);
        ee.emit("uploadProgress", {
          percent: 1,
          transferred: uploaded,
          total: uploadBodySize
        });
        const statusCode = res.statusCode;
        res.url = redirectUrl || requestUrl;
        res.requestUrl = requestUrl;
        const followRedirect = opts2.followRedirect && "location" in res.headers;
        const redirectGet = followRedirect && getMethodRedirectCodes.has(statusCode);
        const redirectAll = followRedirect && allMethodRedirectCodes.has(statusCode);
        if (redirectAll || redirectGet && (opts2.method === "GET" || opts2.method === "HEAD")) {
          res.resume();
          if (statusCode === 303) {
            opts2.method = "GET";
          }
          if (redirects.length >= 10) {
            ee.emit("error", new got.MaxRedirectsError(statusCode, redirects, opts2), null, res);
            return;
          }
          const bufferString = Buffer4.from(res.headers.location, "binary").toString();
          redirectUrl = urlLib.resolve(urlLib.format(opts2), bufferString);
          redirects.push(redirectUrl);
          const redirectOpts = Object.assign({}, opts2, urlLib.parse(redirectUrl));
          ee.emit("redirect", res, redirectOpts);
          get(redirectOpts);
          return;
        }
        setImmediate(() => {
          try {
            getResponse(res, opts2, ee, redirects);
          } catch (e) {
            ee.emit("error", e);
          }
        });
      });
      cacheReq.on("error", (err) => {
        if (err instanceof CacheableRequest.RequestError) {
          ee.emit("error", new got.RequestError(err, opts2));
        } else {
          ee.emit("error", new got.CacheError(err, opts2));
        }
      });
      cacheReq.once("request", (req) => {
        let aborted = false;
        req.once("abort", (_) => {
          aborted = true;
        });
        req.once("error", (err) => {
          clearInterval(progressInterval);
          if (aborted) {
            return;
          }
          const backoff = opts2.retries(++retryCount, err);
          if (backoff) {
            setTimeout(get, backoff, opts2);
            return;
          }
          ee.emit("error", new got.RequestError(err, opts2));
        });
        ee.once("request", (req2) => {
          ee.emit("uploadProgress", {
            percent: 0,
            transferred: 0,
            total: uploadBodySize
          });
          const socket = req2.connection;
          if (socket) {
            const isConnecting = socket.connecting === undefined ? socket._connecting : socket.connecting;
            const onSocketConnect = () => {
              const uploadEventFrequency = 150;
              progressInterval = setInterval(() => {
                if (socket.destroyed) {
                  clearInterval(progressInterval);
                  return;
                }
                const lastUploaded = uploaded;
                const headersSize = req2._header ? Buffer4.byteLength(req2._header) : 0;
                uploaded = socket.bytesWritten - headersSize;
                if (uploadBodySize && uploaded > uploadBodySize) {
                  uploaded = uploadBodySize;
                }
                if (uploaded === lastUploaded || uploaded === uploadBodySize) {
                  return;
                }
                ee.emit("uploadProgress", {
                  percent: uploadBodySize ? uploaded / uploadBodySize : 0,
                  transferred: uploaded,
                  total: uploadBodySize
                });
              }, uploadEventFrequency);
            };
            if (isConnecting) {
              socket.once("connect", onSocketConnect);
            } else {
              onSocketConnect();
            }
          }
        });
        if (opts2.gotTimeout) {
          clearInterval(progressInterval);
          timedOut(req, opts2.gotTimeout);
        }
        setImmediate(() => {
          ee.emit("request", req);
        });
      });
    };
    setImmediate(() => {
      Promise.resolve(getBodySize(opts)).then((size) => {
        uploadBodySize = size;
        if (is.undefined(opts.headers["content-length"]) && is.undefined(opts.headers["transfer-encoding"]) && isFormData(opts.body)) {
          opts.headers["content-length"] = size;
        }
        get(opts);
      }).catch((err) => {
        ee.emit("error", err);
      });
    });
    return ee;
  };
  var getResponse = function(res, opts, ee, redirects) {
    const downloadBodySize = Number(res.headers["content-length"]) || null;
    let downloaded = 0;
    const progressStream = new Transform({
      transform(chunk, encoding, callback) {
        downloaded += chunk.length;
        const percent = downloadBodySize ? downloaded / downloadBodySize : 0;
        if (percent < 1) {
          ee.emit("downloadProgress", {
            percent,
            transferred: downloaded,
            total: downloadBodySize
          });
        }
        callback(null, chunk);
      },
      flush(callback) {
        ee.emit("downloadProgress", {
          percent: 1,
          transferred: downloaded,
          total: downloadBodySize
        });
        callback();
      }
    });
    mimicResponse(res, progressStream);
    progressStream.redirectUrls = redirects;
    const response = opts.decompress === true && is.function(decompressResponse) && opts.method !== "HEAD" ? decompressResponse(progressStream) : progressStream;
    if (!opts.decompress && ["gzip", "deflate"].indexOf(res.headers["content-encoding"]) !== -1) {
      opts.encoding = null;
    }
    ee.emit("response", response);
    ee.emit("downloadProgress", {
      percent: 0,
      transferred: 0,
      total: downloadBodySize
    });
    res.pipe(progressStream);
  };
  var asPromise = function(opts) {
    const timeoutFn = (requestPromise) => opts.gotTimeout && opts.gotTimeout.request ? pTimeout(requestPromise, opts.gotTimeout.request, new got.RequestError({ message: "Request timed out", code: "ETIMEDOUT" }, opts)) : requestPromise;
    const proxy = new EventEmitter;
    const cancelable = new PCancelable((resolve2, reject, onCancel) => {
      const ee = requestAsEventEmitter(opts);
      let cancelOnRequest = false;
      onCancel(() => {
        cancelOnRequest = true;
      });
      ee.on("request", (req) => {
        if (cancelOnRequest) {
          req.abort();
        }
        onCancel(() => {
          req.abort();
        });
        if (is.nodeStream(opts.body)) {
          opts.body.pipe(req);
          opts.body = undefined;
          return;
        }
        req.end(opts.body);
      });
      ee.on("response", (res) => {
        const stream2 = is.null(opts.encoding) ? getStream.buffer(res) : getStream(res, opts);
        stream2.catch((err) => reject(new got.ReadError(err, opts))).then((data) => {
          const statusCode = res.statusCode;
          const limitStatusCode = opts.followRedirect ? 299 : 399;
          res.body = data;
          if (opts.json && res.body) {
            try {
              res.body = JSON.parse(res.body);
            } catch (err) {
              if (statusCode >= 200 && statusCode < 300) {
                throw new got.ParseError(err, statusCode, opts, data);
              }
            }
          }
          if (opts.throwHttpErrors && statusCode !== 304 && (statusCode < 200 || statusCode > limitStatusCode)) {
            throw new got.HTTPError(statusCode, res.statusMessage, res.headers, opts);
          }
          resolve2(res);
        }).catch((err) => {
          Object.defineProperty(err, "response", { value: res });
          reject(err);
        });
      });
      ee.once("error", reject);
      ee.on("redirect", proxy.emit.bind(proxy, "redirect"));
      ee.on("uploadProgress", proxy.emit.bind(proxy, "uploadProgress"));
      ee.on("downloadProgress", proxy.emit.bind(proxy, "downloadProgress"));
    });
    Object.defineProperty(cancelable, "canceled", {
      get() {
        return cancelable.isCanceled;
      }
    });
    const promise2 = timeoutFn(cancelable);
    promise2.cancel = cancelable.cancel.bind(cancelable);
    promise2.on = (name2, fn) => {
      proxy.on(name2, fn);
      return promise2;
    };
    return promise2;
  };
  var asStream = function(opts) {
    opts.stream = true;
    const input = new PassThrough;
    const output = new PassThrough;
    const proxy = duplexer3(input, output);
    let timeout;
    if (opts.gotTimeout && opts.gotTimeout.request) {
      timeout = setTimeout(() => {
        proxy.emit("error", new got.RequestError({ message: "Request timed out", code: "ETIMEDOUT" }, opts));
      }, opts.gotTimeout.request);
    }
    if (opts.json) {
      throw new Error("Got can not be used as a stream when the `json` option is used");
    }
    if (opts.body) {
      proxy.write = () => {
        throw new Error("Got\'s stream is not writable when the `body` option is used");
      };
    }
    const ee = requestAsEventEmitter(opts);
    ee.on("request", (req) => {
      proxy.emit("request", req);
      if (is.nodeStream(opts.body)) {
        opts.body.pipe(req);
        return;
      }
      if (opts.body) {
        req.end(opts.body);
        return;
      }
      if (opts.method === "POST" || opts.method === "PUT" || opts.method === "PATCH") {
        input.pipe(req);
        return;
      }
      req.end();
    });
    ee.on("response", (res) => {
      clearTimeout(timeout);
      const statusCode = res.statusCode;
      res.on("error", (err) => {
        proxy.emit("error", new got.ReadError(err, opts));
      });
      res.pipe(output);
      if (opts.throwHttpErrors && statusCode !== 304 && (statusCode < 200 || statusCode > 299)) {
        proxy.emit("error", new got.HTTPError(statusCode, res.statusMessage, res.headers, opts), null, res);
        return;
      }
      proxy.emit("response", res);
    });
    ee.on("error", proxy.emit.bind(proxy, "error"));
    ee.on("redirect", proxy.emit.bind(proxy, "redirect"));
    ee.on("uploadProgress", proxy.emit.bind(proxy, "uploadProgress"));
    ee.on("downloadProgress", proxy.emit.bind(proxy, "downloadProgress"));
    return proxy;
  };
  var normalizeArguments = function(url, opts) {
    if (!is.string(url) && !is.object(url)) {
      throw new TypeError(`Parameter \`url\` must be a string or object, not ${is(url)}`);
    } else if (is.string(url)) {
      url = url.replace(/^unix:/, "http://$&");
      try {
        decodeURI(url);
      } catch (err) {
        throw new Error("Parameter `url` must contain valid UTF-8 character sequences");
      }
      url = urlParseLax(url);
      if (url.auth) {
        throw new Error("Basic authentication must be done with the `auth` option");
      }
    } else if (isURL.lenient(url)) {
      url = urlToOptions(url);
    }
    opts = Object.assign({
      path: "",
      retries: 2,
      cache: false,
      decompress: true,
      useElectronNet: false,
      throwHttpErrors: true
    }, url, {
      protocol: url.protocol || "http:"
    }, opts);
    const headers = lowercaseKeys(opts.headers);
    for (const key of Object.keys(headers)) {
      if (is.nullOrUndefined(headers[key])) {
        delete headers[key];
      }
    }
    opts.headers = Object.assign({
      "user-agent": `${pkg.name}/${pkg.version} (https://github.com/sindresorhus/got)`
    }, headers);
    if (opts.decompress && is.undefined(opts.headers["accept-encoding"])) {
      opts.headers["accept-encoding"] = "gzip, deflate";
    }
    const query = opts.query;
    if (query) {
      if (!is.string(query)) {
        opts.query = querystring.stringify(query);
      }
      opts.path = `${opts.path.split("?")[0]}?${opts.query}`;
      delete opts.query;
    }
    if (opts.json && is.undefined(opts.headers.accept)) {
      opts.headers.accept = "application/json";
    }
    const body = opts.body;
    if (is.nullOrUndefined(body)) {
      opts.method = (opts.method || "GET").toUpperCase();
    } else {
      const headers2 = opts.headers;
      if (!is.nodeStream(body) && !is.string(body) && !is.buffer(body) && !(opts.form || opts.json)) {
        throw new TypeError("The `body` option must be a stream.Readable, string, Buffer or plain Object");
      }
      const canBodyBeStringified = is.plainObject(body) || is.array(body);
      if ((opts.form || opts.json) && !canBodyBeStringified) {
        throw new TypeError("The `body` option must be a plain Object or Array when the `form` or `json` option is used");
      }
      if (isFormData(body)) {
        headers2["content-type"] = headers2["content-type"] || `multipart/form-data; boundary=${body.getBoundary()}`;
      } else if (opts.form && canBodyBeStringified) {
        headers2["content-type"] = headers2["content-type"] || "application/x-www-form-urlencoded";
        opts.body = querystring.stringify(body);
      } else if (opts.json && canBodyBeStringified) {
        headers2["content-type"] = headers2["content-type"] || "application/json";
        opts.body = JSON.stringify(body);
      }
      if (is.undefined(headers2["content-length"]) && is.undefined(headers2["transfer-encoding"]) && !is.nodeStream(body)) {
        const length = is.string(opts.body) ? Buffer4.byteLength(opts.body) : opts.body.length;
        headers2["content-length"] = length;
      }
      if (is.buffer(body)) {
        opts.body = intoStream(body);
        opts.body._buffer = body;
      }
      opts.method = (opts.method || "POST").toUpperCase();
    }
    if (opts.hostname === "unix") {
      const matches = /(.+?):(.+)/.exec(opts.path);
      if (matches) {
        opts.socketPath = matches[1];
        opts.path = matches[2];
        opts.host = null;
      }
    }
    if (!is.function(opts.retries)) {
      const retries = opts.retries;
      opts.retries = (iter, err) => {
        if (iter > retries || !isRetryAllowed(err)) {
          return 0;
        }
        const noise = Math.random() * 100;
        return (1 << iter) * 1000 + noise;
      };
    }
    if (is.undefined(opts.followRedirect)) {
      opts.followRedirect = true;
    }
    if (opts.timeout) {
      if (is.number(opts.timeout)) {
        opts.gotTimeout = { request: opts.timeout };
      } else {
        opts.gotTimeout = opts.timeout;
      }
      delete opts.timeout;
    }
    return opts;
  };
  var got = function(url, opts) {
    try {
      const normalizedArgs = normalizeArguments(url, opts);
      if (normalizedArgs.stream) {
        return asStream(normalizedArgs);
      }
      return asPromise(normalizedArgs);
    } catch (err) {
      return Promise.reject(err);
    }
  };
  var EventEmitter = import.meta.require("events");
  var http = import.meta.require("http");
  var https = import.meta.require("https");
  var PassThrough = import.meta.require("stream").PassThrough;
  var Transform = import.meta.require("stream").Transform;
  var urlLib = import.meta.require("url");
  var fs = import.meta.require("fs");
  var querystring = import.meta.require("querystring");
  var CacheableRequest = require_src4();
  var duplexer3 = require_duplexer3();
  var intoStream = require_into_stream();
  var is = require_dist();
  var getStream = require_get_stream4();
  var timedOut = require_timed_out();
  var urlParseLax = require_url_parse_lax();
  var urlToOptions = require_url_to_options();
  var lowercaseKeys = require_lowercase_keys3();
  var decompressResponse = (()=>({}));
  var mimicResponse = require_mimic_response();
  var isRetryAllowed = require_is_retry_allowed();
  var isURL = require_isurl();
  var PCancelable = require_p_cancelable();
  var pTimeout = require_p_timeout();
  var pify = require_pify2();
  var Buffer4 = require_safe_buffer().Buffer;
  var pkg = require_package2();
  var errors = require_errors();
  var getMethodRedirectCodes = new Set([300, 301, 302, 303, 304, 305, 307, 308]);
  var allMethodRedirectCodes = new Set([300, 303, 307, 308]);
  var isFormData = (body) => is.nodeStream(body) && is.function(body.getBoundary);
  var getBodySize = (opts) => {
    const body = opts.body;
    if (opts.headers["content-length"]) {
      return Number(opts.headers["content-length"]);
    }
    if (!body && !opts.stream) {
      return 0;
    }
    if (is.string(body)) {
      return Buffer4.byteLength(body);
    }
    if (isFormData(body)) {
      return pify(body.getLength.bind(body))();
    }
    if (body instanceof fs.ReadStream) {
      return pify(fs.stat)(body.path).then((stat) => stat.size);
    }
    if (is.nodeStream(body) && is.buffer(body._buffer)) {
      return body._buffer.length;
    }
    return null;
  };
  got.stream = (url, opts) => asStream(normalizeArguments(url, opts));
  var methods = [
    "get",
    "post",
    "put",
    "patch",
    "head",
    "delete"
  ];
  for (const method of methods) {
    got[method] = (url, opts) => got(url, Object.assign({}, opts, { method }));
    got.stream[method] = (url, opts) => got.stream(url, Object.assign({}, opts, { method }));
  }
  Object.assign(got, errors);
  module.exports = got;
});

// node_modules/p-event/node_modules/p-timeout/index.js
var require_p_timeout2 = __commonJS((exports, module) => {
  var pFinally = require_p_finally();

  class TimeoutError extends Error {
    constructor(message) {
      super(message);
      this.name = "TimeoutError";
    }
  }
  module.exports = (promise2, ms, fallback) => new Promise((resolve2, reject) => {
    if (typeof ms !== "number" || ms < 0) {
      throw new TypeError("Expected `ms` to be a positive number");
    }
    const timer = setTimeout(() => {
      if (typeof fallback === "function") {
        try {
          resolve2(fallback());
        } catch (err2) {
          reject(err2);
        }
        return;
      }
      const message = typeof fallback === "string" ? fallback : `Promise timed out after ${ms} milliseconds`;
      const err = fallback instanceof Error ? fallback : new TimeoutError(message);
      if (typeof promise2.cancel === "function") {
        promise2.cancel();
      }
      reject(err);
    }, ms);
    pFinally(promise2.then(resolve2, reject), () => {
      clearTimeout(timer);
    });
  });
  module.exports.TimeoutError = TimeoutError;
});

// node_modules/p-event/index.js
var require_p_event = __commonJS((exports, module) => {
  var pTimeout = require_p_timeout2();
  var symbolAsyncIterator = Symbol.asyncIterator || "@@asyncIterator";
  var normalizeEmitter = (emitter) => {
    const addListener = emitter.on || emitter.addListener || emitter.addEventListener;
    const removeListener = emitter.off || emitter.removeListener || emitter.removeEventListener;
    if (!addListener || !removeListener) {
      throw new TypeError("Emitter is not compatible");
    }
    return {
      addListener: addListener.bind(emitter),
      removeListener: removeListener.bind(emitter)
    };
  };
  var normalizeEvents = (event) => Array.isArray(event) ? event : [event];
  var multiple = (emitter, event, options) => {
    let cancel;
    const ret = new Promise((resolve2, reject) => {
      options = Object.assign({
        rejectionEvents: ["error"],
        multiArgs: false,
        resolveImmediately: false
      }, options);
      if (!(options.count >= 0 && (options.count === Infinity || Number.isInteger(options.count)))) {
        throw new TypeError("The `count` option should be at least 0 or more");
      }
      const events = normalizeEvents(event);
      const items = [];
      const { addListener, removeListener } = normalizeEmitter(emitter);
      const onItem = (...args) => {
        const value = options.multiArgs ? args : args[0];
        if (options.filter && !options.filter(value)) {
          return;
        }
        items.push(value);
        if (options.count === items.length) {
          cancel();
          resolve2(items);
        }
      };
      const rejectHandler = (error2) => {
        cancel();
        reject(error2);
      };
      cancel = () => {
        for (const event2 of events) {
          removeListener(event2, onItem);
        }
        for (const rejectionEvent of options.rejectionEvents) {
          removeListener(rejectionEvent, rejectHandler);
        }
      };
      for (const event2 of events) {
        addListener(event2, onItem);
      }
      for (const rejectionEvent of options.rejectionEvents) {
        addListener(rejectionEvent, rejectHandler);
      }
      if (options.resolveImmediately) {
        resolve2(items);
      }
    });
    ret.cancel = cancel;
    if (typeof options.timeout === "number") {
      const timeout = pTimeout(ret, options.timeout);
      timeout.cancel = cancel;
      return timeout;
    }
    return ret;
  };
  module.exports = (emitter, event, options) => {
    if (typeof options === "function") {
      options = { filter: options };
    }
    options = Object.assign({}, options, {
      count: 1,
      resolveImmediately: false
    });
    const arrayPromise = multiple(emitter, event, options);
    const promise2 = arrayPromise.then((array) => array[0]);
    promise2.cancel = arrayPromise.cancel;
    return promise2;
  };
  module.exports.multiple = multiple;
  module.exports.iterator = (emitter, event, options) => {
    if (typeof options === "function") {
      options = { filter: options };
    }
    const events = normalizeEvents(event);
    options = Object.assign({
      rejectionEvents: ["error"],
      resolutionEvents: [],
      limit: Infinity,
      multiArgs: false
    }, options);
    const { limit } = options;
    const isValidLimit = limit >= 0 && (limit === Infinity || Number.isInteger(limit));
    if (!isValidLimit) {
      throw new TypeError("The `limit` option should be a non-negative integer or Infinity");
    }
    if (limit === 0) {
      return {
        [Symbol.asyncIterator]() {
          return this;
        },
        next() {
          return Promise.resolve({ done: true, value: undefined });
        }
      };
    }
    let isLimitReached = false;
    const { addListener, removeListener } = normalizeEmitter(emitter);
    let done = false;
    let error2;
    let hasPendingError = false;
    const nextQueue = [];
    const valueQueue = [];
    let eventCount = 0;
    const valueHandler = (...args) => {
      eventCount++;
      isLimitReached = eventCount === limit;
      const value = options.multiArgs ? args : args[0];
      if (nextQueue.length > 0) {
        const { resolve: resolve2 } = nextQueue.shift();
        resolve2({ done: false, value });
        if (isLimitReached) {
          cancel();
        }
        return;
      }
      valueQueue.push(value);
      if (isLimitReached) {
        cancel();
      }
    };
    const cancel = () => {
      done = true;
      for (const event2 of events) {
        removeListener(event2, valueHandler);
      }
      for (const rejectionEvent of options.rejectionEvents) {
        removeListener(rejectionEvent, rejectHandler);
      }
      for (const resolutionEvent of options.resolutionEvents) {
        removeListener(resolutionEvent, resolveHandler);
      }
      while (nextQueue.length > 0) {
        const { resolve: resolve2 } = nextQueue.shift();
        resolve2({ done: true, value: undefined });
      }
    };
    const rejectHandler = (...args) => {
      error2 = options.multiArgs ? args : args[0];
      if (nextQueue.length > 0) {
        const { reject } = nextQueue.shift();
        reject(error2);
      } else {
        hasPendingError = true;
      }
      cancel();
    };
    const resolveHandler = (...args) => {
      const value = options.multiArgs ? args : args[0];
      if (options.filter && !options.filter(value)) {
        return;
      }
      if (nextQueue.length > 0) {
        const { resolve: resolve2 } = nextQueue.shift();
        resolve2({ done: true, value });
      } else {
        valueQueue.push(value);
      }
      cancel();
    };
    for (const event2 of events) {
      addListener(event2, valueHandler);
    }
    for (const rejectionEvent of options.rejectionEvents) {
      addListener(rejectionEvent, rejectHandler);
    }
    for (const resolutionEvent of options.resolutionEvents) {
      addListener(resolutionEvent, resolveHandler);
    }
    return {
      [symbolAsyncIterator]() {
        return this;
      },
      next() {
        if (valueQueue.length > 0) {
          const value = valueQueue.shift();
          return Promise.resolve({ done: done && valueQueue.length === 0 && !isLimitReached, value });
        }
        if (hasPendingError) {
          hasPendingError = false;
          return Promise.reject(error2);
        }
        if (done) {
          return Promise.resolve({ done: true, value: undefined });
        }
        return new Promise((resolve2, reject) => nextQueue.push({ resolve: resolve2, reject }));
      },
      return(value) {
        cancel();
        return Promise.resolve({ done, value });
      }
    };
  };
});

// node_modules/file-type/index.js
var require_file_type6 = __commonJS((exports, module) => {
  var toBytes = (s) => [...s].map((c) => c.charCodeAt(0));
  var xpiZipFilename = toBytes("META-INF/mozilla.rsa");
  var oxmlContentTypes = toBytes("[Content_Types].xml");
  var oxmlRels = toBytes("_rels/.rels");
  module.exports = (input) => {
    const buf = input instanceof Uint8Array ? input : new Uint8Array(input);
    if (!(buf && buf.length > 1)) {
      return null;
    }
    const check = (header, options) => {
      options = Object.assign({
        offset: 0
      }, options);
      for (let i = 0;i < header.length; i++) {
        if (options.mask) {
          if (header[i] !== (options.mask[i] & buf[i + options.offset])) {
            return false;
          }
        } else if (header[i] !== buf[i + options.offset]) {
          return false;
        }
      }
      return true;
    };
    const checkString = (header, options) => check(toBytes(header), options);
    if (check([255, 216, 255])) {
      return {
        ext: "jpg",
        mime: "image/jpeg"
      };
    }
    if (check([137, 80, 78, 71, 13, 10, 26, 10])) {
      return {
        ext: "png",
        mime: "image/png"
      };
    }
    if (check([71, 73, 70])) {
      return {
        ext: "gif",
        mime: "image/gif"
      };
    }
    if (check([87, 69, 66, 80], { offset: 8 })) {
      return {
        ext: "webp",
        mime: "image/webp"
      };
    }
    if (check([70, 76, 73, 70])) {
      return {
        ext: "flif",
        mime: "image/flif"
      };
    }
    if ((check([73, 73, 42, 0]) || check([77, 77, 0, 42])) && check([67, 82], { offset: 8 })) {
      return {
        ext: "cr2",
        mime: "image/x-canon-cr2"
      };
    }
    if (check([73, 73, 42, 0]) || check([77, 77, 0, 42])) {
      return {
        ext: "tif",
        mime: "image/tiff"
      };
    }
    if (check([66, 77])) {
      return {
        ext: "bmp",
        mime: "image/bmp"
      };
    }
    if (check([73, 73, 188])) {
      return {
        ext: "jxr",
        mime: "image/vnd.ms-photo"
      };
    }
    if (check([56, 66, 80, 83])) {
      return {
        ext: "psd",
        mime: "image/vnd.adobe.photoshop"
      };
    }
    if (check([80, 75, 3, 4])) {
      if (check([109, 105, 109, 101, 116, 121, 112, 101, 97, 112, 112, 108, 105, 99, 97, 116, 105, 111, 110, 47, 101, 112, 117, 98, 43, 122, 105, 112], { offset: 30 })) {
        return {
          ext: "epub",
          mime: "application/epub+zip"
        };
      }
      if (check(xpiZipFilename, { offset: 30 })) {
        return {
          ext: "xpi",
          mime: "application/x-xpinstall"
        };
      }
      if (checkString("mimetypeapplication/vnd.oasis.opendocument.text", { offset: 30 })) {
        return {
          ext: "odt",
          mime: "application/vnd.oasis.opendocument.text"
        };
      }
      if (checkString("mimetypeapplication/vnd.oasis.opendocument.spreadsheet", { offset: 30 })) {
        return {
          ext: "ods",
          mime: "application/vnd.oasis.opendocument.spreadsheet"
        };
      }
      if (checkString("mimetypeapplication/vnd.oasis.opendocument.presentation", { offset: 30 })) {
        return {
          ext: "odp",
          mime: "application/vnd.oasis.opendocument.presentation"
        };
      }
      if (check(oxmlContentTypes, { offset: 30 }) || check(oxmlRels, { offset: 30 })) {
        const sliced = buf.subarray(4, 4 + 2000);
        const nextZipHeaderIndex = (arr) => arr.findIndex((el, i, arr2) => arr2[i] === 80 && arr2[i + 1] === 75 && arr2[i + 2] === 3 && arr2[i + 3] === 4);
        const header2Pos = nextZipHeaderIndex(sliced);
        if (header2Pos !== -1) {
          const slicedAgain = buf.subarray(header2Pos + 8, header2Pos + 8 + 1000);
          const header3Pos = nextZipHeaderIndex(slicedAgain);
          if (header3Pos !== -1) {
            const offset = 8 + header2Pos + header3Pos + 30;
            if (checkString("word/", { offset })) {
              return {
                ext: "docx",
                mime: "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              };
            }
            if (checkString("ppt/", { offset })) {
              return {
                ext: "pptx",
                mime: "application/vnd.openxmlformats-officedocument.presentationml.presentation"
              };
            }
            if (checkString("xl/", { offset })) {
              return {
                ext: "xlsx",
                mime: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              };
            }
          }
        }
      }
    }
    if (check([80, 75]) && (buf[2] === 3 || buf[2] === 5 || buf[2] === 7) && (buf[3] === 4 || buf[3] === 6 || buf[3] === 8)) {
      return {
        ext: "zip",
        mime: "application/zip"
      };
    }
    if (check([117, 115, 116, 97, 114], { offset: 257 })) {
      return {
        ext: "tar",
        mime: "application/x-tar"
      };
    }
    if (check([82, 97, 114, 33, 26, 7]) && (buf[6] === 0 || buf[6] === 1)) {
      return {
        ext: "rar",
        mime: "application/x-rar-compressed"
      };
    }
    if (check([31, 139, 8])) {
      return {
        ext: "gz",
        mime: "application/gzip"
      };
    }
    if (check([66, 90, 104])) {
      return {
        ext: "bz2",
        mime: "application/x-bzip2"
      };
    }
    if (check([55, 122, 188, 175, 39, 28])) {
      return {
        ext: "7z",
        mime: "application/x-7z-compressed"
      };
    }
    if (check([120, 1])) {
      return {
        ext: "dmg",
        mime: "application/x-apple-diskimage"
      };
    }
    if (check([51, 103, 112, 53]) || check([0, 0, 0]) && check([102, 116, 121, 112], { offset: 4 }) && (check([109, 112, 52, 49], { offset: 8 }) || check([109, 112, 52, 50], { offset: 8 }) || check([105, 115, 111, 109], { offset: 8 }) || check([105, 115, 111, 50], { offset: 8 }) || check([109, 109, 112, 52], { offset: 8 }) || check([77, 52, 86], { offset: 8 }) || check([100, 97, 115, 104], { offset: 8 }))) {
      return {
        ext: "mp4",
        mime: "video/mp4"
      };
    }
    if (check([77, 84, 104, 100])) {
      return {
        ext: "mid",
        mime: "audio/midi"
      };
    }
    if (check([26, 69, 223, 163])) {
      const sliced = buf.subarray(4, 4 + 4096);
      const idPos = sliced.findIndex((el, i, arr) => arr[i] === 66 && arr[i + 1] === 130);
      if (idPos !== -1) {
        const docTypePos = idPos + 3;
        const findDocType = (type) => [...type].every((c, i) => sliced[docTypePos + i] === c.charCodeAt(0));
        if (findDocType("matroska")) {
          return {
            ext: "mkv",
            mime: "video/x-matroska"
          };
        }
        if (findDocType("webm")) {
          return {
            ext: "webm",
            mime: "video/webm"
          };
        }
      }
    }
    if (check([0, 0, 0, 20, 102, 116, 121, 112, 113, 116, 32, 32]) || check([102, 114, 101, 101], { offset: 4 }) || check([102, 116, 121, 112, 113, 116, 32, 32], { offset: 4 }) || check([109, 100, 97, 116], { offset: 4 }) || check([119, 105, 100, 101], { offset: 4 })) {
      return {
        ext: "mov",
        mime: "video/quicktime"
      };
    }
    if (check([82, 73, 70, 70])) {
      if (check([65, 86, 73], { offset: 8 })) {
        return {
          ext: "avi",
          mime: "video/x-msvideo"
        };
      }
      if (check([87, 65, 86, 69], { offset: 8 })) {
        return {
          ext: "wav",
          mime: "audio/x-wav"
        };
      }
      if (check([81, 76, 67, 77], { offset: 8 })) {
        return {
          ext: "qcp",
          mime: "audio/qcelp"
        };
      }
    }
    if (check([48, 38, 178, 117, 142, 102, 207, 17, 166, 217])) {
      return {
        ext: "wmv",
        mime: "video/x-ms-wmv"
      };
    }
    if (check([0, 0, 1, 186]) || check([0, 0, 1, 179])) {
      return {
        ext: "mpg",
        mime: "video/mpeg"
      };
    }
    if (check([102, 116, 121, 112, 51, 103], { offset: 4 })) {
      return {
        ext: "3gp",
        mime: "video/3gpp"
      };
    }
    for (let start = 0;start < 2 && start < buf.length - 16; start++) {
      if (check([73, 68, 51], { offset: start }) || check([255, 226], { offset: start, mask: [255, 226] })) {
        return {
          ext: "mp3",
          mime: "audio/mpeg"
        };
      }
      if (check([255, 228], { offset: start, mask: [255, 228] })) {
        return {
          ext: "mp2",
          mime: "audio/mpeg"
        };
      }
      if (check([255, 248], { offset: start, mask: [255, 252] })) {
        return {
          ext: "mp2",
          mime: "audio/mpeg"
        };
      }
      if (check([255, 240], { offset: start, mask: [255, 252] })) {
        return {
          ext: "mp4",
          mime: "audio/mpeg"
        };
      }
    }
    if (check([102, 116, 121, 112, 77, 52, 65], { offset: 4 }) || check([77, 52, 65, 32])) {
      return {
        ext: "m4a",
        mime: "audio/m4a"
      };
    }
    if (check([79, 112, 117, 115, 72, 101, 97, 100], { offset: 28 })) {
      return {
        ext: "opus",
        mime: "audio/opus"
      };
    }
    if (check([79, 103, 103, 83])) {
      if (check([128, 116, 104, 101, 111, 114, 97], { offset: 28 })) {
        return {
          ext: "ogv",
          mime: "video/ogg"
        };
      }
      if (check([1, 118, 105, 100, 101, 111, 0], { offset: 28 })) {
        return {
          ext: "ogm",
          mime: "video/ogg"
        };
      }
      if (check([127, 70, 76, 65, 67], { offset: 28 })) {
        return {
          ext: "oga",
          mime: "audio/ogg"
        };
      }
      if (check([83, 112, 101, 101, 120, 32, 32], { offset: 28 })) {
        return {
          ext: "spx",
          mime: "audio/ogg"
        };
      }
      if (check([1, 118, 111, 114, 98, 105, 115], { offset: 28 })) {
        return {
          ext: "ogg",
          mime: "audio/ogg"
        };
      }
      return {
        ext: "ogx",
        mime: "application/ogg"
      };
    }
    if (check([102, 76, 97, 67])) {
      return {
        ext: "flac",
        mime: "audio/x-flac"
      };
    }
    if (check([77, 65, 67, 32])) {
      return {
        ext: "ape",
        mime: "audio/ape"
      };
    }
    if (check([35, 33, 65, 77, 82, 10])) {
      return {
        ext: "amr",
        mime: "audio/amr"
      };
    }
    if (check([37, 80, 68, 70])) {
      return {
        ext: "pdf",
        mime: "application/pdf"
      };
    }
    if (check([77, 90])) {
      return {
        ext: "exe",
        mime: "application/x-msdownload"
      };
    }
    if ((buf[0] === 67 || buf[0] === 70) && check([87, 83], { offset: 1 })) {
      return {
        ext: "swf",
        mime: "application/x-shockwave-flash"
      };
    }
    if (check([123, 92, 114, 116, 102])) {
      return {
        ext: "rtf",
        mime: "application/rtf"
      };
    }
    if (check([0, 97, 115, 109])) {
      return {
        ext: "wasm",
        mime: "application/wasm"
      };
    }
    if (check([119, 79, 70, 70]) && (check([0, 1, 0, 0], { offset: 4 }) || check([79, 84, 84, 79], { offset: 4 }))) {
      return {
        ext: "woff",
        mime: "font/woff"
      };
    }
    if (check([119, 79, 70, 50]) && (check([0, 1, 0, 0], { offset: 4 }) || check([79, 84, 84, 79], { offset: 4 }))) {
      return {
        ext: "woff2",
        mime: "font/woff2"
      };
    }
    if (check([76, 80], { offset: 34 }) && (check([0, 0, 1], { offset: 8 }) || check([1, 0, 2], { offset: 8 }) || check([2, 0, 2], { offset: 8 }))) {
      return {
        ext: "eot",
        mime: "application/octet-stream"
      };
    }
    if (check([0, 1, 0, 0, 0])) {
      return {
        ext: "ttf",
        mime: "font/ttf"
      };
    }
    if (check([79, 84, 84, 79, 0])) {
      return {
        ext: "otf",
        mime: "font/otf"
      };
    }
    if (check([0, 0, 1, 0])) {
      return {
        ext: "ico",
        mime: "image/x-icon"
      };
    }
    if (check([0, 0, 2, 0])) {
      return {
        ext: "cur",
        mime: "image/x-icon"
      };
    }
    if (check([70, 76, 86, 1])) {
      return {
        ext: "flv",
        mime: "video/x-flv"
      };
    }
    if (check([37, 33])) {
      return {
        ext: "ps",
        mime: "application/postscript"
      };
    }
    if (check([253, 55, 122, 88, 90, 0])) {
      return {
        ext: "xz",
        mime: "application/x-xz"
      };
    }
    if (check([83, 81, 76, 105])) {
      return {
        ext: "sqlite",
        mime: "application/x-sqlite3"
      };
    }
    if (check([78, 69, 83, 26])) {
      return {
        ext: "nes",
        mime: "application/x-nintendo-nes-rom"
      };
    }
    if (check([67, 114, 50, 52])) {
      return {
        ext: "crx",
        mime: "application/x-google-chrome-extension"
      };
    }
    if (check([77, 83, 67, 70]) || check([73, 83, 99, 40])) {
      return {
        ext: "cab",
        mime: "application/vnd.ms-cab-compressed"
      };
    }
    if (check([33, 60, 97, 114, 99, 104, 62, 10, 100, 101, 98, 105, 97, 110, 45, 98, 105, 110, 97, 114, 121])) {
      return {
        ext: "deb",
        mime: "application/x-deb"
      };
    }
    if (check([33, 60, 97, 114, 99, 104, 62])) {
      return {
        ext: "ar",
        mime: "application/x-unix-archive"
      };
    }
    if (check([237, 171, 238, 219])) {
      return {
        ext: "rpm",
        mime: "application/x-rpm"
      };
    }
    if (check([31, 160]) || check([31, 157])) {
      return {
        ext: "Z",
        mime: "application/x-compress"
      };
    }
    if (check([76, 90, 73, 80])) {
      return {
        ext: "lz",
        mime: "application/x-lzip"
      };
    }
    if (check([208, 207, 17, 224, 161, 177, 26, 225])) {
      return {
        ext: "msi",
        mime: "application/x-msi"
      };
    }
    if (check([6, 14, 43, 52, 2, 5, 1, 1, 13, 1, 2, 1, 1, 2])) {
      return {
        ext: "mxf",
        mime: "application/mxf"
      };
    }
    if (check([71], { offset: 4 }) && (check([71], { offset: 192 }) || check([71], { offset: 196 }))) {
      return {
        ext: "mts",
        mime: "video/mp2t"
      };
    }
    if (check([66, 76, 69, 78, 68, 69, 82])) {
      return {
        ext: "blend",
        mime: "application/x-blender"
      };
    }
    if (check([66, 80, 71, 251])) {
      return {
        ext: "bpg",
        mime: "image/bpg"
      };
    }
    if (check([0, 0, 0, 12, 106, 80, 32, 32, 13, 10, 135, 10])) {
      if (check([106, 112, 50, 32], { offset: 20 })) {
        return {
          ext: "jp2",
          mime: "image/jp2"
        };
      }
      if (check([106, 112, 120, 32], { offset: 20 })) {
        return {
          ext: "jpx",
          mime: "image/jpx"
        };
      }
      if (check([106, 112, 109, 32], { offset: 20 })) {
        return {
          ext: "jpm",
          mime: "image/jpm"
        };
      }
      if (check([109, 106, 112, 50], { offset: 20 })) {
        return {
          ext: "mj2",
          mime: "image/mj2"
        };
      }
    }
    if (check([70, 79, 82, 77, 0])) {
      return {
        ext: "aif",
        mime: "audio/aiff"
      };
    }
    if (checkString("<?xml ")) {
      return {
        ext: "xml",
        mime: "application/xml"
      };
    }
    if (check([66, 79, 79, 75, 77, 79, 66, 73], { offset: 60 })) {
      return {
        ext: "mobi",
        mime: "application/x-mobipocket-ebook"
      };
    }
    if (check([102, 116, 121, 112], { offset: 4 })) {
      if (check([109, 105, 102, 49], { offset: 8 })) {
        return {
          ext: "heic",
          mime: "image/heif"
        };
      }
      if (check([109, 115, 102, 49], { offset: 8 })) {
        return {
          ext: "heic",
          mime: "image/heif-sequence"
        };
      }
      if (check([104, 101, 105, 99], { offset: 8 }) || check([104, 101, 105, 120], { offset: 8 })) {
        return {
          ext: "heic",
          mime: "image/heic"
        };
      }
      if (check([104, 101, 118, 99], { offset: 8 }) || check([104, 101, 118, 120], { offset: 8 })) {
        return {
          ext: "heic",
          mime: "image/heic-sequence"
        };
      }
    }
    if (check([171, 75, 84, 88, 32, 49, 49, 187, 13, 10, 26, 10])) {
      return {
        ext: "ktx",
        mime: "image/ktx"
      };
    }
    return null;
  };
});

// node_modules/mime-db/db.json
var require_db = __commonJS((exports, module) => {
  module.exports = {
    "application/1d-interleaved-parityfec": {
      source: "iana"
    },
    "application/3gpdash-qoe-report+xml": {
      source: "iana",
      charset: "UTF-8",
      compressible: true
    },
    "application/3gpp-ims+xml": {
      source: "iana",
      compressible: true
    },
    "application/3gpphal+json": {
      source: "iana",
      compressible: true
    },
    "application/3gpphalforms+json": {
      source: "iana",
      compressible: true
    },
    "application/a2l": {
      source: "iana"
    },
    "application/ace+cbor": {
      source: "iana"
    },
    "application/activemessage": {
      source: "iana"
    },
    "application/activity+json": {
      source: "iana",
      compressible: true
    },
    "application/alto-costmap+json": {
      source: "iana",
      compressible: true
    },
    "application/alto-costmapfilter+json": {
      source: "iana",
      compressible: true
    },
    "application/alto-directory+json": {
      source: "iana",
      compressible: true
    },
    "application/alto-endpointcost+json": {
      source: "iana",
      compressible: true
    },
    "application/alto-endpointcostparams+json": {
      source: "iana",
      compressible: true
    },
    "application/alto-endpointprop+json": {
      source: "iana",
      compressible: true
    },
    "application/alto-endpointpropparams+json": {
      source: "iana",
      compressible: true
    },
    "application/alto-error+json": {
      source: "iana",
      compressible: true
    },
    "application/alto-networkmap+json": {
      source: "iana",
      compressible: true
    },
    "application/alto-networkmapfilter+json": {
      source: "iana",
      compressible: true
    },
    "application/alto-updatestreamcontrol+json": {
      source: "iana",
      compressible: true
    },
    "application/alto-updatestreamparams+json": {
      source: "iana",
      compressible: true
    },
    "application/aml": {
      source: "iana"
    },
    "application/andrew-inset": {
      source: "iana",
      extensions: ["ez"]
    },
    "application/applefile": {
      source: "iana"
    },
    "application/applixware": {
      source: "apache",
      extensions: ["aw"]
    },
    "application/at+jwt": {
      source: "iana"
    },
    "application/atf": {
      source: "iana"
    },
    "application/atfx": {
      source: "iana"
    },
    "application/atom+xml": {
      source: "iana",
      compressible: true,
      extensions: ["atom"]
    },
    "application/atomcat+xml": {
      source: "iana",
      compressible: true,
      extensions: ["atomcat"]
    },
    "application/atomdeleted+xml": {
      source: "iana",
      compressible: true,
      extensions: ["atomdeleted"]
    },
    "application/atomicmail": {
      source: "iana"
    },
    "application/atomsvc+xml": {
      source: "iana",
      compressible: true,
      extensions: ["atomsvc"]
    },
    "application/atsc-dwd+xml": {
      source: "iana",
      compressible: true,
      extensions: ["dwd"]
    },
    "application/atsc-dynamic-event-message": {
      source: "iana"
    },
    "application/atsc-held+xml": {
      source: "iana",
      compressible: true,
      extensions: ["held"]
    },
    "application/atsc-rdt+json": {
      source: "iana",
      compressible: true
    },
    "application/atsc-rsat+xml": {
      source: "iana",
      compressible: true,
      extensions: ["rsat"]
    },
    "application/atxml": {
      source: "iana"
    },
    "application/auth-policy+xml": {
      source: "iana",
      compressible: true
    },
    "application/bacnet-xdd+zip": {
      source: "iana",
      compressible: false
    },
    "application/batch-smtp": {
      source: "iana"
    },
    "application/bdoc": {
      compressible: false,
      extensions: ["bdoc"]
    },
    "application/beep+xml": {
      source: "iana",
      charset: "UTF-8",
      compressible: true
    },
    "application/calendar+json": {
      source: "iana",
      compressible: true
    },
    "application/calendar+xml": {
      source: "iana",
      compressible: true,
      extensions: ["xcs"]
    },
    "application/call-completion": {
      source: "iana"
    },
    "application/cals-1840": {
      source: "iana"
    },
    "application/captive+json": {
      source: "iana",
      compressible: true
    },
    "application/cbor": {
      source: "iana"
    },
    "application/cbor-seq": {
      source: "iana"
    },
    "application/cccex": {
      source: "iana"
    },
    "application/ccmp+xml": {
      source: "iana",
      compressible: true
    },
    "application/ccxml+xml": {
      source: "iana",
      compressible: true,
      extensions: ["ccxml"]
    },
    "application/cdfx+xml": {
      source: "iana",
      compressible: true,
      extensions: ["cdfx"]
    },
    "application/cdmi-capability": {
      source: "iana",
      extensions: ["cdmia"]
    },
    "application/cdmi-container": {
      source: "iana",
      extensions: ["cdmic"]
    },
    "application/cdmi-domain": {
      source: "iana",
      extensions: ["cdmid"]
    },
    "application/cdmi-object": {
      source: "iana",
      extensions: ["cdmio"]
    },
    "application/cdmi-queue": {
      source: "iana",
      extensions: ["cdmiq"]
    },
    "application/cdni": {
      source: "iana"
    },
    "application/cea": {
      source: "iana"
    },
    "application/cea-2018+xml": {
      source: "iana",
      compressible: true
    },
    "application/cellml+xml": {
      source: "iana",
      compressible: true
    },
    "application/cfw": {
      source: "iana"
    },
    "application/city+json": {
      source: "iana",
      compressible: true
    },
    "application/clr": {
      source: "iana"
    },
    "application/clue+xml": {
      source: "iana",
      compressible: true
    },
    "application/clue_info+xml": {
      source: "iana",
      compressible: true
    },
    "application/cms": {
      source: "iana"
    },
    "application/cnrp+xml": {
      source: "iana",
      compressible: true
    },
    "application/coap-group+json": {
      source: "iana",
      compressible: true
    },
    "application/coap-payload": {
      source: "iana"
    },
    "application/commonground": {
      source: "iana"
    },
    "application/conference-info+xml": {
      source: "iana",
      compressible: true
    },
    "application/cose": {
      source: "iana"
    },
    "application/cose-key": {
      source: "iana"
    },
    "application/cose-key-set": {
      source: "iana"
    },
    "application/cpl+xml": {
      source: "iana",
      compressible: true,
      extensions: ["cpl"]
    },
    "application/csrattrs": {
      source: "iana"
    },
    "application/csta+xml": {
      source: "iana",
      compressible: true
    },
    "application/cstadata+xml": {
      source: "iana",
      compressible: true
    },
    "application/csvm+json": {
      source: "iana",
      compressible: true
    },
    "application/cu-seeme": {
      source: "apache",
      extensions: ["cu"]
    },
    "application/cwt": {
      source: "iana"
    },
    "application/cybercash": {
      source: "iana"
    },
    "application/dart": {
      compressible: true
    },
    "application/dash+xml": {
      source: "iana",
      compressible: true,
      extensions: ["mpd"]
    },
    "application/dash-patch+xml": {
      source: "iana",
      compressible: true,
      extensions: ["mpp"]
    },
    "application/dashdelta": {
      source: "iana"
    },
    "application/davmount+xml": {
      source: "iana",
      compressible: true,
      extensions: ["davmount"]
    },
    "application/dca-rft": {
      source: "iana"
    },
    "application/dcd": {
      source: "iana"
    },
    "application/dec-dx": {
      source: "iana"
    },
    "application/dialog-info+xml": {
      source: "iana",
      compressible: true
    },
    "application/dicom": {
      source: "iana"
    },
    "application/dicom+json": {
      source: "iana",
      compressible: true
    },
    "application/dicom+xml": {
      source: "iana",
      compressible: true
    },
    "application/dii": {
      source: "iana"
    },
    "application/dit": {
      source: "iana"
    },
    "application/dns": {
      source: "iana"
    },
    "application/dns+json": {
      source: "iana",
      compressible: true
    },
    "application/dns-message": {
      source: "iana"
    },
    "application/docbook+xml": {
      source: "apache",
      compressible: true,
      extensions: ["dbk"]
    },
    "application/dots+cbor": {
      source: "iana"
    },
    "application/dskpp+xml": {
      source: "iana",
      compressible: true
    },
    "application/dssc+der": {
      source: "iana",
      extensions: ["dssc"]
    },
    "application/dssc+xml": {
      source: "iana",
      compressible: true,
      extensions: ["xdssc"]
    },
    "application/dvcs": {
      source: "iana"
    },
    "application/ecmascript": {
      source: "iana",
      compressible: true,
      extensions: ["es", "ecma"]
    },
    "application/edi-consent": {
      source: "iana"
    },
    "application/edi-x12": {
      source: "iana",
      compressible: false
    },
    "application/edifact": {
      source: "iana",
      compressible: false
    },
    "application/efi": {
      source: "iana"
    },
    "application/elm+json": {
      source: "iana",
      charset: "UTF-8",
      compressible: true
    },
    "application/elm+xml": {
      source: "iana",
      compressible: true
    },
    "application/emergencycalldata.cap+xml": {
      source: "iana",
      charset: "UTF-8",
      compressible: true
    },
    "application/emergencycalldata.comment+xml": {
      source: "iana",
      compressible: true
    },
    "application/emergencycalldata.control+xml": {
      source: "iana",
      compressible: true
    },
    "application/emergencycalldata.deviceinfo+xml": {
      source: "iana",
      compressible: true
    },
    "application/emergencycalldata.ecall.msd": {
      source: "iana"
    },
    "application/emergencycalldata.providerinfo+xml": {
      source: "iana",
      compressible: true
    },
    "application/emergencycalldata.serviceinfo+xml": {
      source: "iana",
      compressible: true
    },
    "application/emergencycalldata.subscriberinfo+xml": {
      source: "iana",
      compressible: true
    },
    "application/emergencycalldata.veds+xml": {
      source: "iana",
      compressible: true
    },
    "application/emma+xml": {
      source: "iana",
      compressible: true,
      extensions: ["emma"]
    },
    "application/emotionml+xml": {
      source: "iana",
      compressible: true,
      extensions: ["emotionml"]
    },
    "application/encaprtp": {
      source: "iana"
    },
    "application/epp+xml": {
      source: "iana",
      compressible: true
    },
    "application/epub+zip": {
      source: "iana",
      compressible: false,
      extensions: ["epub"]
    },
    "application/eshop": {
      source: "iana"
    },
    "application/exi": {
      source: "iana",
      extensions: ["exi"]
    },
    "application/expect-ct-report+json": {
      source: "iana",
      compressible: true
    },
    "application/express": {
      source: "iana",
      extensions: ["exp"]
    },
    "application/fastinfoset": {
      source: "iana"
    },
    "application/fastsoap": {
      source: "iana"
    },
    "application/fdt+xml": {
      source: "iana",
      compressible: true,
      extensions: ["fdt"]
    },
    "application/fhir+json": {
      source: "iana",
      charset: "UTF-8",
      compressible: true
    },
    "application/fhir+xml": {
      source: "iana",
      charset: "UTF-8",
      compressible: true
    },
    "application/fido.trusted-apps+json": {
      compressible: true
    },
    "application/fits": {
      source: "iana"
    },
    "application/flexfec": {
      source: "iana"
    },
    "application/font-sfnt": {
      source: "iana"
    },
    "application/font-tdpfr": {
      source: "iana",
      extensions: ["pfr"]
    },
    "application/font-woff": {
      source: "iana",
      compressible: false
    },
    "application/framework-attributes+xml": {
      source: "iana",
      compressible: true
    },
    "application/geo+json": {
      source: "iana",
      compressible: true,
      extensions: ["geojson"]
    },
    "application/geo+json-seq": {
      source: "iana"
    },
    "application/geopackage+sqlite3": {
      source: "iana"
    },
    "application/geoxacml+xml": {
      source: "iana",
      compressible: true
    },
    "application/gltf-buffer": {
      source: "iana"
    },
    "application/gml+xml": {
      source: "iana",
      compressible: true,
      extensions: ["gml"]
    },
    "application/gpx+xml": {
      source: "apache",
      compressible: true,
      extensions: ["gpx"]
    },
    "application/gxf": {
      source: "apache",
      extensions: ["gxf"]
    },
    "application/gzip": {
      source: "iana",
      compressible: false,
      extensions: ["gz"]
    },
    "application/h224": {
      source: "iana"
    },
    "application/held+xml": {
      source: "iana",
      compressible: true
    },
    "application/hjson": {
      extensions: ["hjson"]
    },
    "application/http": {
      source: "iana"
    },
    "application/hyperstudio": {
      source: "iana",
      extensions: ["stk"]
    },
    "application/ibe-key-request+xml": {
      source: "iana",
      compressible: true
    },
    "application/ibe-pkg-reply+xml": {
      source: "iana",
      compressible: true
    },
    "application/ibe-pp-data": {
      source: "iana"
    },
    "application/iges": {
      source: "iana"
    },
    "application/im-iscomposing+xml": {
      source: "iana",
      charset: "UTF-8",
      compressible: true
    },
    "application/index": {
      source: "iana"
    },
    "application/index.cmd": {
      source: "iana"
    },
    "application/index.obj": {
      source: "iana"
    },
    "application/index.response": {
      source: "iana"
    },
    "application/index.vnd": {
      source: "iana"
    },
    "application/inkml+xml": {
      source: "iana",
      compressible: true,
      extensions: ["ink", "inkml"]
    },
    "application/iotp": {
      source: "iana"
    },
    "application/ipfix": {
      source: "iana",
      extensions: ["ipfix"]
    },
    "application/ipp": {
      source: "iana"
    },
    "application/isup": {
      source: "iana"
    },
    "application/its+xml": {
      source: "iana",
      compressible: true,
      extensions: ["its"]
    },
    "application/java-archive": {
      source: "apache",
      compressible: false,
      extensions: ["jar", "war", "ear"]
    },
    "application/java-serialized-object": {
      source: "apache",
      compressible: false,
      extensions: ["ser"]
    },
    "application/java-vm": {
      source: "apache",
      compressible: false,
      extensions: ["class"]
    },
    "application/javascript": {
      source: "iana",
      charset: "UTF-8",
      compressible: true,
      extensions: ["js", "mjs"]
    },
    "application/jf2feed+json": {
      source: "iana",
      compressible: true
    },
    "application/jose": {
      source: "iana"
    },
    "application/jose+json": {
      source: "iana",
      compressible: true
    },
    "application/jrd+json": {
      source: "iana",
      compressible: true
    },
    "application/jscalendar+json": {
      source: "iana",
      compressible: true
    },
    "application/json": {
      source: "iana",
      charset: "UTF-8",
      compressible: true,
      extensions: ["json", "map"]
    },
    "application/json-patch+json": {
      source: "iana",
      compressible: true
    },
    "application/json-seq": {
      source: "iana"
    },
    "application/json5": {
      extensions: ["json5"]
    },
    "application/jsonml+json": {
      source: "apache",
      compressible: true,
      extensions: ["jsonml"]
    },
    "application/jwk+json": {
      source: "iana",
      compressible: true
    },
    "application/jwk-set+json": {
      source: "iana",
      compressible: true
    },
    "application/jwt": {
      source: "iana"
    },
    "application/kpml-request+xml": {
      source: "iana",
      compressible: true
    },
    "application/kpml-response+xml": {
      source: "iana",
      compressible: true
    },
    "application/ld+json": {
      source: "iana",
      compressible: true,
      extensions: ["jsonld"]
    },
    "application/lgr+xml": {
      source: "iana",
      compressible: true,
      extensions: ["lgr"]
    },
    "application/link-format": {
      source: "iana"
    },
    "application/load-control+xml": {
      source: "iana",
      compressible: true
    },
    "application/lost+xml": {
      source: "iana",
      compressible: true,
      extensions: ["lostxml"]
    },
    "application/lostsync+xml": {
      source: "iana",
      compressible: true
    },
    "application/lpf+zip": {
      source: "iana",
      compressible: false
    },
    "application/lxf": {
      source: "iana"
    },
    "application/mac-binhex40": {
      source: "iana",
      extensions: ["hqx"]
    },
    "application/mac-compactpro": {
      source: "apache",
      extensions: ["cpt"]
    },
    "application/macwriteii": {
      source: "iana"
    },
    "application/mads+xml": {
      source: "iana",
      compressible: true,
      extensions: ["mads"]
    },
    "application/manifest+json": {
      source: "iana",
      charset: "UTF-8",
      compressible: true,
      extensions: ["webmanifest"]
    },
    "application/marc": {
      source: "iana",
      extensions: ["mrc"]
    },
    "application/marcxml+xml": {
      source: "iana",
      compressible: true,
      extensions: ["mrcx"]
    },
    "application/mathematica": {
      source: "iana",
      extensions: ["ma", "nb", "mb"]
    },
    "application/mathml+xml": {
      source: "iana",
      compressible: true,
      extensions: ["mathml"]
    },
    "application/mathml-content+xml": {
      source: "iana",
      compressible: true
    },
    "application/mathml-presentation+xml": {
      source: "iana",
      compressible: true
    },
    "application/mbms-associated-procedure-description+xml": {
      source: "iana",
      compressible: true
    },
    "application/mbms-deregister+xml": {
      source: "iana",
      compressible: true
    },
    "application/mbms-envelope+xml": {
      source: "iana",
      compressible: true
    },
    "application/mbms-msk+xml": {
      source: "iana",
      compressible: true
    },
    "application/mbms-msk-response+xml": {
      source: "iana",
      compressible: true
    },
    "application/mbms-protection-description+xml": {
      source: "iana",
      compressible: true
    },
    "application/mbms-reception-report+xml": {
      source: "iana",
      compressible: true
    },
    "application/mbms-register+xml": {
      source: "iana",
      compressible: true
    },
    "application/mbms-register-response+xml": {
      source: "iana",
      compressible: true
    },
    "application/mbms-schedule+xml": {
      source: "iana",
      compressible: true
    },
    "application/mbms-user-service-description+xml": {
      source: "iana",
      compressible: true
    },
    "application/mbox": {
      source: "iana",
      extensions: ["mbox"]
    },
    "application/media-policy-dataset+xml": {
      source: "iana",
      compressible: true,
      extensions: ["mpf"]
    },
    "application/media_control+xml": {
      source: "iana",
      compressible: true
    },
    "application/mediaservercontrol+xml": {
      source: "iana",
      compressible: true,
      extensions: ["mscml"]
    },
    "application/merge-patch+json": {
      source: "iana",
      compressible: true
    },
    "application/metalink+xml": {
      source: "apache",
      compressible: true,
      extensions: ["metalink"]
    },
    "application/metalink4+xml": {
      source: "iana",
      compressible: true,
      extensions: ["meta4"]
    },
    "application/mets+xml": {
      source: "iana",
      compressible: true,
      extensions: ["mets"]
    },
    "application/mf4": {
      source: "iana"
    },
    "application/mikey": {
      source: "iana"
    },
    "application/mipc": {
      source: "iana"
    },
    "application/missing-blocks+cbor-seq": {
      source: "iana"
    },
    "application/mmt-aei+xml": {
      source: "iana",
      compressible: true,
      extensions: ["maei"]
    },
    "application/mmt-usd+xml": {
      source: "iana",
      compressible: true,
      extensions: ["musd"]
    },
    "application/mods+xml": {
      source: "iana",
      compressible: true,
      extensions: ["mods"]
    },
    "application/moss-keys": {
      source: "iana"
    },
    "application/moss-signature": {
      source: "iana"
    },
    "application/mosskey-data": {
      source: "iana"
    },
    "application/mosskey-request": {
      source: "iana"
    },
    "application/mp21": {
      source: "iana",
      extensions: ["m21", "mp21"]
    },
    "application/mp4": {
      source: "iana",
      extensions: ["mp4s", "m4p"]
    },
    "application/mpeg4-generic": {
      source: "iana"
    },
    "application/mpeg4-iod": {
      source: "iana"
    },
    "application/mpeg4-iod-xmt": {
      source: "iana"
    },
    "application/mrb-consumer+xml": {
      source: "iana",
      compressible: true
    },
    "application/mrb-publish+xml": {
      source: "iana",
      compressible: true
    },
    "application/msc-ivr+xml": {
      source: "iana",
      charset: "UTF-8",
      compressible: true
    },
    "application/msc-mixer+xml": {
      source: "iana",
      charset: "UTF-8",
      compressible: true
    },
    "application/msword": {
      source: "iana",
      compressible: false,
      extensions: ["doc", "dot"]
    },
    "application/mud+json": {
      source: "iana",
      compressible: true
    },
    "application/multipart-core": {
      source: "iana"
    },
    "application/mxf": {
      source: "iana",
      extensions: ["mxf"]
    },
    "application/n-quads": {
      source: "iana",
      extensions: ["nq"]
    },
    "application/n-triples": {
      source: "iana",
      extensions: ["nt"]
    },
    "application/nasdata": {
      source: "iana"
    },
    "application/news-checkgroups": {
      source: "iana",
      charset: "US-ASCII"
    },
    "application/news-groupinfo": {
      source: "iana",
      charset: "US-ASCII"
    },
    "application/news-transmission": {
      source: "iana"
    },
    "application/nlsml+xml": {
      source: "iana",
      compressible: true
    },
    "application/node": {
      source: "iana",
      extensions: ["cjs"]
    },
    "application/nss": {
      source: "iana"
    },
    "application/oauth-authz-req+jwt": {
      source: "iana"
    },
    "application/oblivious-dns-message": {
      source: "iana"
    },
    "application/ocsp-request": {
      source: "iana"
    },
    "application/ocsp-response": {
      source: "iana"
    },
    "application/octet-stream": {
      source: "iana",
      compressible: false,
      extensions: ["bin", "dms", "lrf", "mar", "so", "dist", "distz", "pkg", "bpk", "dump", "elc", "deploy", "exe", "dll", "deb", "dmg", "iso", "img", "msi", "msp", "msm", "buffer"]
    },
    "application/oda": {
      source: "iana",
      extensions: ["oda"]
    },
    "application/odm+xml": {
      source: "iana",
      compressible: true
    },
    "application/odx": {
      source: "iana"
    },
    "application/oebps-package+xml": {
      source: "iana",
      compressible: true,
      extensions: ["opf"]
    },
    "application/ogg": {
      source: "iana",
      compressible: false,
      extensions: ["ogx"]
    },
    "application/omdoc+xml": {
      source: "apache",
      compressible: true,
      extensions: ["omdoc"]
    },
    "application/onenote": {
      source: "apache",
      extensions: ["onetoc", "onetoc2", "onetmp", "onepkg"]
    },
    "application/opc-nodeset+xml": {
      source: "iana",
      compressible: true
    },
    "application/oscore": {
      source: "iana"
    },
    "application/oxps": {
      source: "iana",
      extensions: ["oxps"]
    },
    "application/p21": {
      source: "iana"
    },
    "application/p21+zip": {
      source: "iana",
      compressible: false
    },
    "application/p2p-overlay+xml": {
      source: "iana",
      compressible: true,
      extensions: ["relo"]
    },
    "application/parityfec": {
      source: "iana"
    },
    "application/passport": {
      source: "iana"
    },
    "application/patch-ops-error+xml": {
      source: "iana",
      compressible: true,
      extensions: ["xer"]
    },
    "application/pdf": {
      source: "iana",
      compressible: false,
      extensions: ["pdf"]
    },
    "application/pdx": {
      source: "iana"
    },
    "application/pem-certificate-chain": {
      source: "iana"
    },
    "application/pgp-encrypted": {
      source: "iana",
      compressible: false,
      extensions: ["pgp"]
    },
    "application/pgp-keys": {
      source: "iana",
      extensions: ["asc"]
    },
    "application/pgp-signature": {
      source: "iana",
      extensions: ["asc", "sig"]
    },
    "application/pics-rules": {
      source: "apache",
      extensions: ["prf"]
    },
    "application/pidf+xml": {
      source: "iana",
      charset: "UTF-8",
      compressible: true
    },
    "application/pidf-diff+xml": {
      source: "iana",
      charset: "UTF-8",
      compressible: true
    },
    "application/pkcs10": {
      source: "iana",
      extensions: ["p10"]
    },
    "application/pkcs12": {
      source: "iana"
    },
    "application/pkcs7-mime": {
      source: "iana",
      extensions: ["p7m", "p7c"]
    },
    "application/pkcs7-signature": {
      source: "iana",
      extensions: ["p7s"]
    },
    "application/pkcs8": {
      source: "iana",
      extensions: ["p8"]
    },
    "application/pkcs8-encrypted": {
      source: "iana"
    },
    "application/pkix-attr-cert": {
      source: "iana",
      extensions: ["ac"]
    },
    "application/pkix-cert": {
      source: "iana",
      extensions: ["cer"]
    },
    "application/pkix-crl": {
      source: "iana",
      extensions: ["crl"]
    },
    "application/pkix-pkipath": {
      source: "iana",
      extensions: ["pkipath"]
    },
    "application/pkixcmp": {
      source: "iana",
      extensions: ["pki"]
    },
    "application/pls+xml": {
      source: "iana",
      compressible: true,
      extensions: ["pls"]
    },
    "application/poc-settings+xml": {
      source: "iana",
      charset: "UTF-8",
      compressible: true
    },
    "application/postscript": {
      source: "iana",
      compressible: true,
      extensions: ["ai", "eps", "ps"]
    },
    "application/ppsp-tracker+json": {
      source: "iana",
      compressible: true
    },
    "application/problem+json": {
      source: "iana",
      compressible: true
    },
    "application/problem+xml": {
      source: "iana",
      compressible: true
    },
    "application/provenance+xml": {
      source: "iana",
      compressible: true,
      extensions: ["provx"]
    },
    "application/prs.alvestrand.titrax-sheet": {
      source: "iana"
    },
    "application/prs.cww": {
      source: "iana",
      extensions: ["cww"]
    },
    "application/prs.cyn": {
      source: "iana",
      charset: "7-BIT"
    },
    "application/prs.hpub+zip": {
      source: "iana",
      compressible: false
    },
    "application/prs.nprend": {
      source: "iana"
    },
    "application/prs.plucker": {
      source: "iana"
    },
    "application/prs.rdf-xml-crypt": {
      source: "iana"
    },
    "application/prs.xsf+xml": {
      source: "iana",
      compressible: true
    },
    "application/pskc+xml": {
      source: "iana",
      compressible: true,
      extensions: ["pskcxml"]
    },
    "application/pvd+json": {
      source: "iana",
      compressible: true
    },
    "application/qsig": {
      source: "iana"
    },
    "application/raml+yaml": {
      compressible: true,
      extensions: ["raml"]
    },
    "application/raptorfec": {
      source: "iana"
    },
    "application/rdap+json": {
      source: "iana",
      compressible: true
    },
    "application/rdf+xml": {
      source: "iana",
      compressible: true,
      extensions: ["rdf", "owl"]
    },
    "application/reginfo+xml": {
      source: "iana",
      compressible: true,
      extensions: ["rif"]
    },
    "application/relax-ng-compact-syntax": {
      source: "iana",
      extensions: ["rnc"]
    },
    "application/remote-printing": {
      source: "iana"
    },
    "application/reputon+json": {
      source: "iana",
      compressible: true
    },
    "application/resource-lists+xml": {
      source: "iana",
      compressible: true,
      extensions: ["rl"]
    },
    "application/resource-lists-diff+xml": {
      source: "iana",
      compressible: true,
      extensions: ["rld"]
    },
    "application/rfc+xml": {
      source: "iana",
      compressible: true
    },
    "application/riscos": {
      source: "iana"
    },
    "application/rlmi+xml": {
      source: "iana",
      compressible: true
    },
    "application/rls-services+xml": {
      source: "iana",
      compressible: true,
      extensions: ["rs"]
    },
    "application/route-apd+xml": {
      source: "iana",
      compressible: true,
      extensions: ["rapd"]
    },
    "application/route-s-tsid+xml": {
      source: "iana",
      compressible: true,
      extensions: ["sls"]
    },
    "application/route-usd+xml": {
      source: "iana",
      compressible: true,
      extensions: ["rusd"]
    },
    "application/rpki-ghostbusters": {
      source: "iana",
      extensions: ["gbr"]
    },
    "application/rpki-manifest": {
      source: "iana",
      extensions: ["mft"]
    },
    "application/rpki-publication": {
      source: "iana"
    },
    "application/rpki-roa": {
      source: "iana",
      extensions: ["roa"]
    },
    "application/rpki-updown": {
      source: "iana"
    },
    "application/rsd+xml": {
      source: "apache",
      compressible: true,
      extensions: ["rsd"]
    },
    "application/rss+xml": {
      source: "apache",
      compressible: true,
      extensions: ["rss"]
    },
    "application/rtf": {
      source: "iana",
      compressible: true,
      extensions: ["rtf"]
    },
    "application/rtploopback": {
      source: "iana"
    },
    "application/rtx": {
      source: "iana"
    },
    "application/samlassertion+xml": {
      source: "iana",
      compressible: true
    },
    "application/samlmetadata+xml": {
      source: "iana",
      compressible: true
    },
    "application/sarif+json": {
      source: "iana",
      compressible: true
    },
    "application/sarif-external-properties+json": {
      source: "iana",
      compressible: true
    },
    "application/sbe": {
      source: "iana"
    },
    "application/sbml+xml": {
      source: "iana",
      compressible: true,
      extensions: ["sbml"]
    },
    "application/scaip+xml": {
      source: "iana",
      compressible: true
    },
    "application/scim+json": {
      source: "iana",
      compressible: true
    },
    "application/scvp-cv-request": {
      source: "iana",
      extensions: ["scq"]
    },
    "application/scvp-cv-response": {
      source: "iana",
      extensions: ["scs"]
    },
    "application/scvp-vp-request": {
      source: "iana",
      extensions: ["spq"]
    },
    "application/scvp-vp-response": {
      source: "iana",
      extensions: ["spp"]
    },
    "application/sdp": {
      source: "iana",
      extensions: ["sdp"]
    },
    "application/secevent+jwt": {
      source: "iana"
    },
    "application/senml+cbor": {
      source: "iana"
    },
    "application/senml+json": {
      source: "iana",
      compressible: true
    },
    "application/senml+xml": {
      source: "iana",
      compressible: true,
      extensions: ["senmlx"]
    },
    "application/senml-etch+cbor": {
      source: "iana"
    },
    "application/senml-etch+json": {
      source: "iana",
      compressible: true
    },
    "application/senml-exi": {
      source: "iana"
    },
    "application/sensml+cbor": {
      source: "iana"
    },
    "application/sensml+json": {
      source: "iana",
      compressible: true
    },
    "application/sensml+xml": {
      source: "iana",
      compressible: true,
      extensions: ["sensmlx"]
    },
    "application/sensml-exi": {
      source: "iana"
    },
    "application/sep+xml": {
      source: "iana",
      compressible: true
    },
    "application/sep-exi": {
      source: "iana"
    },
    "application/session-info": {
      source: "iana"
    },
    "application/set-payment": {
      source: "iana"
    },
    "application/set-payment-initiation": {
      source: "iana",
      extensions: ["setpay"]
    },
    "application/set-registration": {
      source: "iana"
    },
    "application/set-registration-initiation": {
      source: "iana",
      extensions: ["setreg"]
    },
    "application/sgml": {
      source: "iana"
    },
    "application/sgml-open-catalog": {
      source: "iana"
    },
    "application/shf+xml": {
      source: "iana",
      compressible: true,
      extensions: ["shf"]
    },
    "application/sieve": {
      source: "iana",
      extensions: ["siv", "sieve"]
    },
    "application/simple-filter+xml": {
      source: "iana",
      compressible: true
    },
    "application/simple-message-summary": {
      source: "iana"
    },
    "application/simplesymbolcontainer": {
      source: "iana"
    },
    "application/sipc": {
      source: "iana"
    },
    "application/slate": {
      source: "iana"
    },
    "application/smil": {
      source: "iana"
    },
    "application/smil+xml": {
      source: "iana",
      compressible: true,
      extensions: ["smi", "smil"]
    },
    "application/smpte336m": {
      source: "iana"
    },
    "application/soap+fastinfoset": {
      source: "iana"
    },
    "application/soap+xml": {
      source: "iana",
      compressible: true
    },
    "application/sparql-query": {
      source: "iana",
      extensions: ["rq"]
    },
    "application/sparql-results+xml": {
      source: "iana",
      compressible: true,
      extensions: ["srx"]
    },
    "application/spdx+json": {
      source: "iana",
      compressible: true
    },
    "application/spirits-event+xml": {
      source: "iana",
      compressible: true
    },
    "application/sql": {
      source: "iana"
    },
    "application/srgs": {
      source: "iana",
      extensions: ["gram"]
    },
    "application/srgs+xml": {
      source: "iana",
      compressible: true,
      extensions: ["grxml"]
    },
    "application/sru+xml": {
      source: "iana",
      compressible: true,
      extensions: ["sru"]
    },
    "application/ssdl+xml": {
      source: "apache",
      compressible: true,
      extensions: ["ssdl"]
    },
    "application/ssml+xml": {
      source: "iana",
      compressible: true,
      extensions: ["ssml"]
    },
    "application/stix+json": {
      source: "iana",
      compressible: true
    },
    "application/swid+xml": {
      source: "iana",
      compressible: true,
      extensions: ["swidtag"]
    },
    "application/tamp-apex-update": {
      source: "iana"
    },
    "application/tamp-apex-update-confirm": {
      source: "iana"
    },
    "application/tamp-community-update": {
      source: "iana"
    },
    "application/tamp-community-update-confirm": {
      source: "iana"
    },
    "application/tamp-error": {
      source: "iana"
    },
    "application/tamp-sequence-adjust": {
      source: "iana"
    },
    "application/tamp-sequence-adjust-confirm": {
      source: "iana"
    },
    "application/tamp-status-query": {
      source: "iana"
    },
    "application/tamp-status-response": {
      source: "iana"
    },
    "application/tamp-update": {
      source: "iana"
    },
    "application/tamp-update-confirm": {
      source: "iana"
    },
    "application/tar": {
      compressible: true
    },
    "application/taxii+json": {
      source: "iana",
      compressible: true
    },
    "application/td+json": {
      source: "iana",
      compressible: true
    },
    "application/tei+xml": {
      source: "iana",
      compressible: true,
      extensions: ["tei", "teicorpus"]
    },
    "application/tetra_isi": {
      source: "iana"
    },
    "application/thraud+xml": {
      source: "iana",
      compressible: true,
      extensions: ["tfi"]
    },
    "application/timestamp-query": {
      source: "iana"
    },
    "application/timestamp-reply": {
      source: "iana"
    },
    "application/timestamped-data": {
      source: "iana",
      extensions: ["tsd"]
    },
    "application/tlsrpt+gzip": {
      source: "iana"
    },
    "application/tlsrpt+json": {
      source: "iana",
      compressible: true
    },
    "application/tnauthlist": {
      source: "iana"
    },
    "application/token-introspection+jwt": {
      source: "iana"
    },
    "application/toml": {
      compressible: true,
      extensions: ["toml"]
    },
    "application/trickle-ice-sdpfrag": {
      source: "iana"
    },
    "application/trig": {
      source: "iana",
      extensions: ["trig"]
    },
    "application/ttml+xml": {
      source: "iana",
      compressible: true,
      extensions: ["ttml"]
    },
    "application/tve-trigger": {
      source: "iana"
    },
    "application/tzif": {
      source: "iana"
    },
    "application/tzif-leap": {
      source: "iana"
    },
    "application/ubjson": {
      compressible: false,
      extensions: ["ubj"]
    },
    "application/ulpfec": {
      source: "iana"
    },
    "application/urc-grpsheet+xml": {
      source: "iana",
      compressible: true
    },
    "application/urc-ressheet+xml": {
      source: "iana",
      compressible: true,
      extensions: ["rsheet"]
    },
    "application/urc-targetdesc+xml": {
      source: "iana",
      compressible: true,
      extensions: ["td"]
    },
    "application/urc-uisocketdesc+xml": {
      source: "iana",
      compressible: true
    },
    "application/vcard+json": {
      source: "iana",
      compressible: true
    },
    "application/vcard+xml": {
      source: "iana",
      compressible: true
    },
    "application/vemmi": {
      source: "iana"
    },
    "application/vividence.scriptfile": {
      source: "apache"
    },
    "application/vnd.1000minds.decision-model+xml": {
      source: "iana",
      compressible: true,
      extensions: ["1km"]
    },
    "application/vnd.3gpp-prose+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.3gpp-prose-pc3ch+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.3gpp-v2x-local-service-information": {
      source: "iana"
    },
    "application/vnd.3gpp.5gnas": {
      source: "iana"
    },
    "application/vnd.3gpp.access-transfer-events+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.3gpp.bsf+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.3gpp.gmop+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.3gpp.gtpc": {
      source: "iana"
    },
    "application/vnd.3gpp.interworking-data": {
      source: "iana"
    },
    "application/vnd.3gpp.lpp": {
      source: "iana"
    },
    "application/vnd.3gpp.mc-signalling-ear": {
      source: "iana"
    },
    "application/vnd.3gpp.mcdata-affiliation-command+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.3gpp.mcdata-info+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.3gpp.mcdata-payload": {
      source: "iana"
    },
    "application/vnd.3gpp.mcdata-service-config+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.3gpp.mcdata-signalling": {
      source: "iana"
    },
    "application/vnd.3gpp.mcdata-ue-config+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.3gpp.mcdata-user-profile+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.3gpp.mcptt-affiliation-command+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.3gpp.mcptt-floor-request+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.3gpp.mcptt-info+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.3gpp.mcptt-location-info+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.3gpp.mcptt-mbms-usage-info+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.3gpp.mcptt-service-config+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.3gpp.mcptt-signed+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.3gpp.mcptt-ue-config+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.3gpp.mcptt-ue-init-config+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.3gpp.mcptt-user-profile+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.3gpp.mcvideo-affiliation-command+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.3gpp.mcvideo-affiliation-info+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.3gpp.mcvideo-info+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.3gpp.mcvideo-location-info+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.3gpp.mcvideo-mbms-usage-info+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.3gpp.mcvideo-service-config+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.3gpp.mcvideo-transmission-request+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.3gpp.mcvideo-ue-config+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.3gpp.mcvideo-user-profile+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.3gpp.mid-call+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.3gpp.ngap": {
      source: "iana"
    },
    "application/vnd.3gpp.pfcp": {
      source: "iana"
    },
    "application/vnd.3gpp.pic-bw-large": {
      source: "iana",
      extensions: ["plb"]
    },
    "application/vnd.3gpp.pic-bw-small": {
      source: "iana",
      extensions: ["psb"]
    },
    "application/vnd.3gpp.pic-bw-var": {
      source: "iana",
      extensions: ["pvb"]
    },
    "application/vnd.3gpp.s1ap": {
      source: "iana"
    },
    "application/vnd.3gpp.sms": {
      source: "iana"
    },
    "application/vnd.3gpp.sms+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.3gpp.srvcc-ext+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.3gpp.srvcc-info+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.3gpp.state-and-event-info+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.3gpp.ussd+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.3gpp2.bcmcsinfo+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.3gpp2.sms": {
      source: "iana"
    },
    "application/vnd.3gpp2.tcap": {
      source: "iana",
      extensions: ["tcap"]
    },
    "application/vnd.3lightssoftware.imagescal": {
      source: "iana"
    },
    "application/vnd.3m.post-it-notes": {
      source: "iana",
      extensions: ["pwn"]
    },
    "application/vnd.accpac.simply.aso": {
      source: "iana",
      extensions: ["aso"]
    },
    "application/vnd.accpac.simply.imp": {
      source: "iana",
      extensions: ["imp"]
    },
    "application/vnd.acucobol": {
      source: "iana",
      extensions: ["acu"]
    },
    "application/vnd.acucorp": {
      source: "iana",
      extensions: ["atc", "acutc"]
    },
    "application/vnd.adobe.air-application-installer-package+zip": {
      source: "apache",
      compressible: false,
      extensions: ["air"]
    },
    "application/vnd.adobe.flash.movie": {
      source: "iana"
    },
    "application/vnd.adobe.formscentral.fcdt": {
      source: "iana",
      extensions: ["fcdt"]
    },
    "application/vnd.adobe.fxp": {
      source: "iana",
      extensions: ["fxp", "fxpl"]
    },
    "application/vnd.adobe.partial-upload": {
      source: "iana"
    },
    "application/vnd.adobe.xdp+xml": {
      source: "iana",
      compressible: true,
      extensions: ["xdp"]
    },
    "application/vnd.adobe.xfdf": {
      source: "iana",
      extensions: ["xfdf"]
    },
    "application/vnd.aether.imp": {
      source: "iana"
    },
    "application/vnd.afpc.afplinedata": {
      source: "iana"
    },
    "application/vnd.afpc.afplinedata-pagedef": {
      source: "iana"
    },
    "application/vnd.afpc.cmoca-cmresource": {
      source: "iana"
    },
    "application/vnd.afpc.foca-charset": {
      source: "iana"
    },
    "application/vnd.afpc.foca-codedfont": {
      source: "iana"
    },
    "application/vnd.afpc.foca-codepage": {
      source: "iana"
    },
    "application/vnd.afpc.modca": {
      source: "iana"
    },
    "application/vnd.afpc.modca-cmtable": {
      source: "iana"
    },
    "application/vnd.afpc.modca-formdef": {
      source: "iana"
    },
    "application/vnd.afpc.modca-mediummap": {
      source: "iana"
    },
    "application/vnd.afpc.modca-objectcontainer": {
      source: "iana"
    },
    "application/vnd.afpc.modca-overlay": {
      source: "iana"
    },
    "application/vnd.afpc.modca-pagesegment": {
      source: "iana"
    },
    "application/vnd.age": {
      source: "iana",
      extensions: ["age"]
    },
    "application/vnd.ah-barcode": {
      source: "iana"
    },
    "application/vnd.ahead.space": {
      source: "iana",
      extensions: ["ahead"]
    },
    "application/vnd.airzip.filesecure.azf": {
      source: "iana",
      extensions: ["azf"]
    },
    "application/vnd.airzip.filesecure.azs": {
      source: "iana",
      extensions: ["azs"]
    },
    "application/vnd.amadeus+json": {
      source: "iana",
      compressible: true
    },
    "application/vnd.amazon.ebook": {
      source: "apache",
      extensions: ["azw"]
    },
    "application/vnd.amazon.mobi8-ebook": {
      source: "iana"
    },
    "application/vnd.americandynamics.acc": {
      source: "iana",
      extensions: ["acc"]
    },
    "application/vnd.amiga.ami": {
      source: "iana",
      extensions: ["ami"]
    },
    "application/vnd.amundsen.maze+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.android.ota": {
      source: "iana"
    },
    "application/vnd.android.package-archive": {
      source: "apache",
      compressible: false,
      extensions: ["apk"]
    },
    "application/vnd.anki": {
      source: "iana"
    },
    "application/vnd.anser-web-certificate-issue-initiation": {
      source: "iana",
      extensions: ["cii"]
    },
    "application/vnd.anser-web-funds-transfer-initiation": {
      source: "apache",
      extensions: ["fti"]
    },
    "application/vnd.antix.game-component": {
      source: "iana",
      extensions: ["atx"]
    },
    "application/vnd.apache.arrow.file": {
      source: "iana"
    },
    "application/vnd.apache.arrow.stream": {
      source: "iana"
    },
    "application/vnd.apache.thrift.binary": {
      source: "iana"
    },
    "application/vnd.apache.thrift.compact": {
      source: "iana"
    },
    "application/vnd.apache.thrift.json": {
      source: "iana"
    },
    "application/vnd.api+json": {
      source: "iana",
      compressible: true
    },
    "application/vnd.aplextor.warrp+json": {
      source: "iana",
      compressible: true
    },
    "application/vnd.apothekende.reservation+json": {
      source: "iana",
      compressible: true
    },
    "application/vnd.apple.installer+xml": {
      source: "iana",
      compressible: true,
      extensions: ["mpkg"]
    },
    "application/vnd.apple.keynote": {
      source: "iana",
      extensions: ["key"]
    },
    "application/vnd.apple.mpegurl": {
      source: "iana",
      extensions: ["m3u8"]
    },
    "application/vnd.apple.numbers": {
      source: "iana",
      extensions: ["numbers"]
    },
    "application/vnd.apple.pages": {
      source: "iana",
      extensions: ["pages"]
    },
    "application/vnd.apple.pkpass": {
      compressible: false,
      extensions: ["pkpass"]
    },
    "application/vnd.arastra.swi": {
      source: "iana"
    },
    "application/vnd.aristanetworks.swi": {
      source: "iana",
      extensions: ["swi"]
    },
    "application/vnd.artisan+json": {
      source: "iana",
      compressible: true
    },
    "application/vnd.artsquare": {
      source: "iana"
    },
    "application/vnd.astraea-software.iota": {
      source: "iana",
      extensions: ["iota"]
    },
    "application/vnd.audiograph": {
      source: "iana",
      extensions: ["aep"]
    },
    "application/vnd.autopackage": {
      source: "iana"
    },
    "application/vnd.avalon+json": {
      source: "iana",
      compressible: true
    },
    "application/vnd.avistar+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.balsamiq.bmml+xml": {
      source: "iana",
      compressible: true,
      extensions: ["bmml"]
    },
    "application/vnd.balsamiq.bmpr": {
      source: "iana"
    },
    "application/vnd.banana-accounting": {
      source: "iana"
    },
    "application/vnd.bbf.usp.error": {
      source: "iana"
    },
    "application/vnd.bbf.usp.msg": {
      source: "iana"
    },
    "application/vnd.bbf.usp.msg+json": {
      source: "iana",
      compressible: true
    },
    "application/vnd.bekitzur-stech+json": {
      source: "iana",
      compressible: true
    },
    "application/vnd.bint.med-content": {
      source: "iana"
    },
    "application/vnd.biopax.rdf+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.blink-idb-value-wrapper": {
      source: "iana"
    },
    "application/vnd.blueice.multipass": {
      source: "iana",
      extensions: ["mpm"]
    },
    "application/vnd.bluetooth.ep.oob": {
      source: "iana"
    },
    "application/vnd.bluetooth.le.oob": {
      source: "iana"
    },
    "application/vnd.bmi": {
      source: "iana",
      extensions: ["bmi"]
    },
    "application/vnd.bpf": {
      source: "iana"
    },
    "application/vnd.bpf3": {
      source: "iana"
    },
    "application/vnd.businessobjects": {
      source: "iana",
      extensions: ["rep"]
    },
    "application/vnd.byu.uapi+json": {
      source: "iana",
      compressible: true
    },
    "application/vnd.cab-jscript": {
      source: "iana"
    },
    "application/vnd.canon-cpdl": {
      source: "iana"
    },
    "application/vnd.canon-lips": {
      source: "iana"
    },
    "application/vnd.capasystems-pg+json": {
      source: "iana",
      compressible: true
    },
    "application/vnd.cendio.thinlinc.clientconf": {
      source: "iana"
    },
    "application/vnd.century-systems.tcp_stream": {
      source: "iana"
    },
    "application/vnd.chemdraw+xml": {
      source: "iana",
      compressible: true,
      extensions: ["cdxml"]
    },
    "application/vnd.chess-pgn": {
      source: "iana"
    },
    "application/vnd.chipnuts.karaoke-mmd": {
      source: "iana",
      extensions: ["mmd"]
    },
    "application/vnd.ciedi": {
      source: "iana"
    },
    "application/vnd.cinderella": {
      source: "iana",
      extensions: ["cdy"]
    },
    "application/vnd.cirpack.isdn-ext": {
      source: "iana"
    },
    "application/vnd.citationstyles.style+xml": {
      source: "iana",
      compressible: true,
      extensions: ["csl"]
    },
    "application/vnd.claymore": {
      source: "iana",
      extensions: ["cla"]
    },
    "application/vnd.cloanto.rp9": {
      source: "iana",
      extensions: ["rp9"]
    },
    "application/vnd.clonk.c4group": {
      source: "iana",
      extensions: ["c4g", "c4d", "c4f", "c4p", "c4u"]
    },
    "application/vnd.cluetrust.cartomobile-config": {
      source: "iana",
      extensions: ["c11amc"]
    },
    "application/vnd.cluetrust.cartomobile-config-pkg": {
      source: "iana",
      extensions: ["c11amz"]
    },
    "application/vnd.coffeescript": {
      source: "iana"
    },
    "application/vnd.collabio.xodocuments.document": {
      source: "iana"
    },
    "application/vnd.collabio.xodocuments.document-template": {
      source: "iana"
    },
    "application/vnd.collabio.xodocuments.presentation": {
      source: "iana"
    },
    "application/vnd.collabio.xodocuments.presentation-template": {
      source: "iana"
    },
    "application/vnd.collabio.xodocuments.spreadsheet": {
      source: "iana"
    },
    "application/vnd.collabio.xodocuments.spreadsheet-template": {
      source: "iana"
    },
    "application/vnd.collection+json": {
      source: "iana",
      compressible: true
    },
    "application/vnd.collection.doc+json": {
      source: "iana",
      compressible: true
    },
    "application/vnd.collection.next+json": {
      source: "iana",
      compressible: true
    },
    "application/vnd.comicbook+zip": {
      source: "iana",
      compressible: false
    },
    "application/vnd.comicbook-rar": {
      source: "iana"
    },
    "application/vnd.commerce-battelle": {
      source: "iana"
    },
    "application/vnd.commonspace": {
      source: "iana",
      extensions: ["csp"]
    },
    "application/vnd.contact.cmsg": {
      source: "iana",
      extensions: ["cdbcmsg"]
    },
    "application/vnd.coreos.ignition+json": {
      source: "iana",
      compressible: true
    },
    "application/vnd.cosmocaller": {
      source: "iana",
      extensions: ["cmc"]
    },
    "application/vnd.crick.clicker": {
      source: "iana",
      extensions: ["clkx"]
    },
    "application/vnd.crick.clicker.keyboard": {
      source: "iana",
      extensions: ["clkk"]
    },
    "application/vnd.crick.clicker.palette": {
      source: "iana",
      extensions: ["clkp"]
    },
    "application/vnd.crick.clicker.template": {
      source: "iana",
      extensions: ["clkt"]
    },
    "application/vnd.crick.clicker.wordbank": {
      source: "iana",
      extensions: ["clkw"]
    },
    "application/vnd.criticaltools.wbs+xml": {
      source: "iana",
      compressible: true,
      extensions: ["wbs"]
    },
    "application/vnd.cryptii.pipe+json": {
      source: "iana",
      compressible: true
    },
    "application/vnd.crypto-shade-file": {
      source: "iana"
    },
    "application/vnd.cryptomator.encrypted": {
      source: "iana"
    },
    "application/vnd.cryptomator.vault": {
      source: "iana"
    },
    "application/vnd.ctc-posml": {
      source: "iana",
      extensions: ["pml"]
    },
    "application/vnd.ctct.ws+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.cups-pdf": {
      source: "iana"
    },
    "application/vnd.cups-postscript": {
      source: "iana"
    },
    "application/vnd.cups-ppd": {
      source: "iana",
      extensions: ["ppd"]
    },
    "application/vnd.cups-raster": {
      source: "iana"
    },
    "application/vnd.cups-raw": {
      source: "iana"
    },
    "application/vnd.curl": {
      source: "iana"
    },
    "application/vnd.curl.car": {
      source: "apache",
      extensions: ["car"]
    },
    "application/vnd.curl.pcurl": {
      source: "apache",
      extensions: ["pcurl"]
    },
    "application/vnd.cyan.dean.root+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.cybank": {
      source: "iana"
    },
    "application/vnd.cyclonedx+json": {
      source: "iana",
      compressible: true
    },
    "application/vnd.cyclonedx+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.d2l.coursepackage1p0+zip": {
      source: "iana",
      compressible: false
    },
    "application/vnd.d3m-dataset": {
      source: "iana"
    },
    "application/vnd.d3m-problem": {
      source: "iana"
    },
    "application/vnd.dart": {
      source: "iana",
      compressible: true,
      extensions: ["dart"]
    },
    "application/vnd.data-vision.rdz": {
      source: "iana",
      extensions: ["rdz"]
    },
    "application/vnd.datapackage+json": {
      source: "iana",
      compressible: true
    },
    "application/vnd.dataresource+json": {
      source: "iana",
      compressible: true
    },
    "application/vnd.dbf": {
      source: "iana",
      extensions: ["dbf"]
    },
    "application/vnd.debian.binary-package": {
      source: "iana"
    },
    "application/vnd.dece.data": {
      source: "iana",
      extensions: ["uvf", "uvvf", "uvd", "uvvd"]
    },
    "application/vnd.dece.ttml+xml": {
      source: "iana",
      compressible: true,
      extensions: ["uvt", "uvvt"]
    },
    "application/vnd.dece.unspecified": {
      source: "iana",
      extensions: ["uvx", "uvvx"]
    },
    "application/vnd.dece.zip": {
      source: "iana",
      extensions: ["uvz", "uvvz"]
    },
    "application/vnd.denovo.fcselayout-link": {
      source: "iana",
      extensions: ["fe_launch"]
    },
    "application/vnd.desmume.movie": {
      source: "iana"
    },
    "application/vnd.dir-bi.plate-dl-nosuffix": {
      source: "iana"
    },
    "application/vnd.dm.delegation+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.dna": {
      source: "iana",
      extensions: ["dna"]
    },
    "application/vnd.document+json": {
      source: "iana",
      compressible: true
    },
    "application/vnd.dolby.mlp": {
      source: "apache",
      extensions: ["mlp"]
    },
    "application/vnd.dolby.mobile.1": {
      source: "iana"
    },
    "application/vnd.dolby.mobile.2": {
      source: "iana"
    },
    "application/vnd.doremir.scorecloud-binary-document": {
      source: "iana"
    },
    "application/vnd.dpgraph": {
      source: "iana",
      extensions: ["dpg"]
    },
    "application/vnd.dreamfactory": {
      source: "iana",
      extensions: ["dfac"]
    },
    "application/vnd.drive+json": {
      source: "iana",
      compressible: true
    },
    "application/vnd.ds-keypoint": {
      source: "apache",
      extensions: ["kpxx"]
    },
    "application/vnd.dtg.local": {
      source: "iana"
    },
    "application/vnd.dtg.local.flash": {
      source: "iana"
    },
    "application/vnd.dtg.local.html": {
      source: "iana"
    },
    "application/vnd.dvb.ait": {
      source: "iana",
      extensions: ["ait"]
    },
    "application/vnd.dvb.dvbisl+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.dvb.dvbj": {
      source: "iana"
    },
    "application/vnd.dvb.esgcontainer": {
      source: "iana"
    },
    "application/vnd.dvb.ipdcdftnotifaccess": {
      source: "iana"
    },
    "application/vnd.dvb.ipdcesgaccess": {
      source: "iana"
    },
    "application/vnd.dvb.ipdcesgaccess2": {
      source: "iana"
    },
    "application/vnd.dvb.ipdcesgpdd": {
      source: "iana"
    },
    "application/vnd.dvb.ipdcroaming": {
      source: "iana"
    },
    "application/vnd.dvb.iptv.alfec-base": {
      source: "iana"
    },
    "application/vnd.dvb.iptv.alfec-enhancement": {
      source: "iana"
    },
    "application/vnd.dvb.notif-aggregate-root+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.dvb.notif-container+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.dvb.notif-generic+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.dvb.notif-ia-msglist+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.dvb.notif-ia-registration-request+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.dvb.notif-ia-registration-response+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.dvb.notif-init+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.dvb.pfr": {
      source: "iana"
    },
    "application/vnd.dvb.service": {
      source: "iana",
      extensions: ["svc"]
    },
    "application/vnd.dxr": {
      source: "iana"
    },
    "application/vnd.dynageo": {
      source: "iana",
      extensions: ["geo"]
    },
    "application/vnd.dzr": {
      source: "iana"
    },
    "application/vnd.easykaraoke.cdgdownload": {
      source: "iana"
    },
    "application/vnd.ecdis-update": {
      source: "iana"
    },
    "application/vnd.ecip.rlp": {
      source: "iana"
    },
    "application/vnd.eclipse.ditto+json": {
      source: "iana",
      compressible: true
    },
    "application/vnd.ecowin.chart": {
      source: "iana",
      extensions: ["mag"]
    },
    "application/vnd.ecowin.filerequest": {
      source: "iana"
    },
    "application/vnd.ecowin.fileupdate": {
      source: "iana"
    },
    "application/vnd.ecowin.series": {
      source: "iana"
    },
    "application/vnd.ecowin.seriesrequest": {
      source: "iana"
    },
    "application/vnd.ecowin.seriesupdate": {
      source: "iana"
    },
    "application/vnd.efi.img": {
      source: "iana"
    },
    "application/vnd.efi.iso": {
      source: "iana"
    },
    "application/vnd.emclient.accessrequest+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.enliven": {
      source: "iana",
      extensions: ["nml"]
    },
    "application/vnd.enphase.envoy": {
      source: "iana"
    },
    "application/vnd.eprints.data+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.epson.esf": {
      source: "iana",
      extensions: ["esf"]
    },
    "application/vnd.epson.msf": {
      source: "iana",
      extensions: ["msf"]
    },
    "application/vnd.epson.quickanime": {
      source: "iana",
      extensions: ["qam"]
    },
    "application/vnd.epson.salt": {
      source: "iana",
      extensions: ["slt"]
    },
    "application/vnd.epson.ssf": {
      source: "iana",
      extensions: ["ssf"]
    },
    "application/vnd.ericsson.quickcall": {
      source: "iana"
    },
    "application/vnd.espass-espass+zip": {
      source: "iana",
      compressible: false
    },
    "application/vnd.eszigno3+xml": {
      source: "iana",
      compressible: true,
      extensions: ["es3", "et3"]
    },
    "application/vnd.etsi.aoc+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.etsi.asic-e+zip": {
      source: "iana",
      compressible: false
    },
    "application/vnd.etsi.asic-s+zip": {
      source: "iana",
      compressible: false
    },
    "application/vnd.etsi.cug+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.etsi.iptvcommand+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.etsi.iptvdiscovery+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.etsi.iptvprofile+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.etsi.iptvsad-bc+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.etsi.iptvsad-cod+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.etsi.iptvsad-npvr+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.etsi.iptvservice+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.etsi.iptvsync+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.etsi.iptvueprofile+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.etsi.mcid+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.etsi.mheg5": {
      source: "iana"
    },
    "application/vnd.etsi.overload-control-policy-dataset+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.etsi.pstn+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.etsi.sci+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.etsi.simservs+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.etsi.timestamp-token": {
      source: "iana"
    },
    "application/vnd.etsi.tsl+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.etsi.tsl.der": {
      source: "iana"
    },
    "application/vnd.eu.kasparian.car+json": {
      source: "iana",
      compressible: true
    },
    "application/vnd.eudora.data": {
      source: "iana"
    },
    "application/vnd.evolv.ecig.profile": {
      source: "iana"
    },
    "application/vnd.evolv.ecig.settings": {
      source: "iana"
    },
    "application/vnd.evolv.ecig.theme": {
      source: "iana"
    },
    "application/vnd.exstream-empower+zip": {
      source: "iana",
      compressible: false
    },
    "application/vnd.exstream-package": {
      source: "iana"
    },
    "application/vnd.ezpix-album": {
      source: "iana",
      extensions: ["ez2"]
    },
    "application/vnd.ezpix-package": {
      source: "iana",
      extensions: ["ez3"]
    },
    "application/vnd.f-secure.mobile": {
      source: "iana"
    },
    "application/vnd.familysearch.gedcom+zip": {
      source: "iana",
      compressible: false
    },
    "application/vnd.fastcopy-disk-image": {
      source: "iana"
    },
    "application/vnd.fdf": {
      source: "iana",
      extensions: ["fdf"]
    },
    "application/vnd.fdsn.mseed": {
      source: "iana",
      extensions: ["mseed"]
    },
    "application/vnd.fdsn.seed": {
      source: "iana",
      extensions: ["seed", "dataless"]
    },
    "application/vnd.ffsns": {
      source: "iana"
    },
    "application/vnd.ficlab.flb+zip": {
      source: "iana",
      compressible: false
    },
    "application/vnd.filmit.zfc": {
      source: "iana"
    },
    "application/vnd.fints": {
      source: "iana"
    },
    "application/vnd.firemonkeys.cloudcell": {
      source: "iana"
    },
    "application/vnd.flographit": {
      source: "iana",
      extensions: ["gph"]
    },
    "application/vnd.fluxtime.clip": {
      source: "iana",
      extensions: ["ftc"]
    },
    "application/vnd.font-fontforge-sfd": {
      source: "iana"
    },
    "application/vnd.framemaker": {
      source: "iana",
      extensions: ["fm", "frame", "maker", "book"]
    },
    "application/vnd.frogans.fnc": {
      source: "iana",
      extensions: ["fnc"]
    },
    "application/vnd.frogans.ltf": {
      source: "iana",
      extensions: ["ltf"]
    },
    "application/vnd.fsc.weblaunch": {
      source: "iana",
      extensions: ["fsc"]
    },
    "application/vnd.fujifilm.fb.docuworks": {
      source: "iana"
    },
    "application/vnd.fujifilm.fb.docuworks.binder": {
      source: "iana"
    },
    "application/vnd.fujifilm.fb.docuworks.container": {
      source: "iana"
    },
    "application/vnd.fujifilm.fb.jfi+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.fujitsu.oasys": {
      source: "iana",
      extensions: ["oas"]
    },
    "application/vnd.fujitsu.oasys2": {
      source: "iana",
      extensions: ["oa2"]
    },
    "application/vnd.fujitsu.oasys3": {
      source: "iana",
      extensions: ["oa3"]
    },
    "application/vnd.fujitsu.oasysgp": {
      source: "iana",
      extensions: ["fg5"]
    },
    "application/vnd.fujitsu.oasysprs": {
      source: "iana",
      extensions: ["bh2"]
    },
    "application/vnd.fujixerox.art-ex": {
      source: "iana"
    },
    "application/vnd.fujixerox.art4": {
      source: "iana"
    },
    "application/vnd.fujixerox.ddd": {
      source: "iana",
      extensions: ["ddd"]
    },
    "application/vnd.fujixerox.docuworks": {
      source: "iana",
      extensions: ["xdw"]
    },
    "application/vnd.fujixerox.docuworks.binder": {
      source: "iana",
      extensions: ["xbd"]
    },
    "application/vnd.fujixerox.docuworks.container": {
      source: "iana"
    },
    "application/vnd.fujixerox.hbpl": {
      source: "iana"
    },
    "application/vnd.fut-misnet": {
      source: "iana"
    },
    "application/vnd.futoin+cbor": {
      source: "iana"
    },
    "application/vnd.futoin+json": {
      source: "iana",
      compressible: true
    },
    "application/vnd.fuzzysheet": {
      source: "iana",
      extensions: ["fzs"]
    },
    "application/vnd.genomatix.tuxedo": {
      source: "iana",
      extensions: ["txd"]
    },
    "application/vnd.gentics.grd+json": {
      source: "iana",
      compressible: true
    },
    "application/vnd.geo+json": {
      source: "iana",
      compressible: true
    },
    "application/vnd.geocube+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.geogebra.file": {
      source: "iana",
      extensions: ["ggb"]
    },
    "application/vnd.geogebra.slides": {
      source: "iana"
    },
    "application/vnd.geogebra.tool": {
      source: "iana",
      extensions: ["ggt"]
    },
    "application/vnd.geometry-explorer": {
      source: "iana",
      extensions: ["gex", "gre"]
    },
    "application/vnd.geonext": {
      source: "iana",
      extensions: ["gxt"]
    },
    "application/vnd.geoplan": {
      source: "iana",
      extensions: ["g2w"]
    },
    "application/vnd.geospace": {
      source: "iana",
      extensions: ["g3w"]
    },
    "application/vnd.gerber": {
      source: "iana"
    },
    "application/vnd.globalplatform.card-content-mgt": {
      source: "iana"
    },
    "application/vnd.globalplatform.card-content-mgt-response": {
      source: "iana"
    },
    "application/vnd.gmx": {
      source: "iana",
      extensions: ["gmx"]
    },
    "application/vnd.google-apps.document": {
      compressible: false,
      extensions: ["gdoc"]
    },
    "application/vnd.google-apps.presentation": {
      compressible: false,
      extensions: ["gslides"]
    },
    "application/vnd.google-apps.spreadsheet": {
      compressible: false,
      extensions: ["gsheet"]
    },
    "application/vnd.google-earth.kml+xml": {
      source: "iana",
      compressible: true,
      extensions: ["kml"]
    },
    "application/vnd.google-earth.kmz": {
      source: "iana",
      compressible: false,
      extensions: ["kmz"]
    },
    "application/vnd.gov.sk.e-form+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.gov.sk.e-form+zip": {
      source: "iana",
      compressible: false
    },
    "application/vnd.gov.sk.xmldatacontainer+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.grafeq": {
      source: "iana",
      extensions: ["gqf", "gqs"]
    },
    "application/vnd.gridmp": {
      source: "iana"
    },
    "application/vnd.groove-account": {
      source: "iana",
      extensions: ["gac"]
    },
    "application/vnd.groove-help": {
      source: "iana",
      extensions: ["ghf"]
    },
    "application/vnd.groove-identity-message": {
      source: "iana",
      extensions: ["gim"]
    },
    "application/vnd.groove-injector": {
      source: "iana",
      extensions: ["grv"]
    },
    "application/vnd.groove-tool-message": {
      source: "iana",
      extensions: ["gtm"]
    },
    "application/vnd.groove-tool-template": {
      source: "iana",
      extensions: ["tpl"]
    },
    "application/vnd.groove-vcard": {
      source: "iana",
      extensions: ["vcg"]
    },
    "application/vnd.hal+json": {
      source: "iana",
      compressible: true
    },
    "application/vnd.hal+xml": {
      source: "iana",
      compressible: true,
      extensions: ["hal"]
    },
    "application/vnd.handheld-entertainment+xml": {
      source: "iana",
      compressible: true,
      extensions: ["zmm"]
    },
    "application/vnd.hbci": {
      source: "iana",
      extensions: ["hbci"]
    },
    "application/vnd.hc+json": {
      source: "iana",
      compressible: true
    },
    "application/vnd.hcl-bireports": {
      source: "iana"
    },
    "application/vnd.hdt": {
      source: "iana"
    },
    "application/vnd.heroku+json": {
      source: "iana",
      compressible: true
    },
    "application/vnd.hhe.lesson-player": {
      source: "iana",
      extensions: ["les"]
    },
    "application/vnd.hl7cda+xml": {
      source: "iana",
      charset: "UTF-8",
      compressible: true
    },
    "application/vnd.hl7v2+xml": {
      source: "iana",
      charset: "UTF-8",
      compressible: true
    },
    "application/vnd.hp-hpgl": {
      source: "iana",
      extensions: ["hpgl"]
    },
    "application/vnd.hp-hpid": {
      source: "iana",
      extensions: ["hpid"]
    },
    "application/vnd.hp-hps": {
      source: "iana",
      extensions: ["hps"]
    },
    "application/vnd.hp-jlyt": {
      source: "iana",
      extensions: ["jlt"]
    },
    "application/vnd.hp-pcl": {
      source: "iana",
      extensions: ["pcl"]
    },
    "application/vnd.hp-pclxl": {
      source: "iana",
      extensions: ["pclxl"]
    },
    "application/vnd.httphone": {
      source: "iana"
    },
    "application/vnd.hydrostatix.sof-data": {
      source: "iana",
      extensions: ["sfd-hdstx"]
    },
    "application/vnd.hyper+json": {
      source: "iana",
      compressible: true
    },
    "application/vnd.hyper-item+json": {
      source: "iana",
      compressible: true
    },
    "application/vnd.hyperdrive+json": {
      source: "iana",
      compressible: true
    },
    "application/vnd.hzn-3d-crossword": {
      source: "iana"
    },
    "application/vnd.ibm.afplinedata": {
      source: "iana"
    },
    "application/vnd.ibm.electronic-media": {
      source: "iana"
    },
    "application/vnd.ibm.minipay": {
      source: "iana",
      extensions: ["mpy"]
    },
    "application/vnd.ibm.modcap": {
      source: "iana",
      extensions: ["afp", "listafp", "list3820"]
    },
    "application/vnd.ibm.rights-management": {
      source: "iana",
      extensions: ["irm"]
    },
    "application/vnd.ibm.secure-container": {
      source: "iana",
      extensions: ["sc"]
    },
    "application/vnd.iccprofile": {
      source: "iana",
      extensions: ["icc", "icm"]
    },
    "application/vnd.ieee.1905": {
      source: "iana"
    },
    "application/vnd.igloader": {
      source: "iana",
      extensions: ["igl"]
    },
    "application/vnd.imagemeter.folder+zip": {
      source: "iana",
      compressible: false
    },
    "application/vnd.imagemeter.image+zip": {
      source: "iana",
      compressible: false
    },
    "application/vnd.immervision-ivp": {
      source: "iana",
      extensions: ["ivp"]
    },
    "application/vnd.immervision-ivu": {
      source: "iana",
      extensions: ["ivu"]
    },
    "application/vnd.ims.imsccv1p1": {
      source: "iana"
    },
    "application/vnd.ims.imsccv1p2": {
      source: "iana"
    },
    "application/vnd.ims.imsccv1p3": {
      source: "iana"
    },
    "application/vnd.ims.lis.v2.result+json": {
      source: "iana",
      compressible: true
    },
    "application/vnd.ims.lti.v2.toolconsumerprofile+json": {
      source: "iana",
      compressible: true
    },
    "application/vnd.ims.lti.v2.toolproxy+json": {
      source: "iana",
      compressible: true
    },
    "application/vnd.ims.lti.v2.toolproxy.id+json": {
      source: "iana",
      compressible: true
    },
    "application/vnd.ims.lti.v2.toolsettings+json": {
      source: "iana",
      compressible: true
    },
    "application/vnd.ims.lti.v2.toolsettings.simple+json": {
      source: "iana",
      compressible: true
    },
    "application/vnd.informedcontrol.rms+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.informix-visionary": {
      source: "iana"
    },
    "application/vnd.infotech.project": {
      source: "iana"
    },
    "application/vnd.infotech.project+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.innopath.wamp.notification": {
      source: "iana"
    },
    "application/vnd.insors.igm": {
      source: "iana",
      extensions: ["igm"]
    },
    "application/vnd.intercon.formnet": {
      source: "iana",
      extensions: ["xpw", "xpx"]
    },
    "application/vnd.intergeo": {
      source: "iana",
      extensions: ["i2g"]
    },
    "application/vnd.intertrust.digibox": {
      source: "iana"
    },
    "application/vnd.intertrust.nncp": {
      source: "iana"
    },
    "application/vnd.intu.qbo": {
      source: "iana",
      extensions: ["qbo"]
    },
    "application/vnd.intu.qfx": {
      source: "iana",
      extensions: ["qfx"]
    },
    "application/vnd.iptc.g2.catalogitem+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.iptc.g2.conceptitem+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.iptc.g2.knowledgeitem+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.iptc.g2.newsitem+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.iptc.g2.newsmessage+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.iptc.g2.packageitem+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.iptc.g2.planningitem+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.ipunplugged.rcprofile": {
      source: "iana",
      extensions: ["rcprofile"]
    },
    "application/vnd.irepository.package+xml": {
      source: "iana",
      compressible: true,
      extensions: ["irp"]
    },
    "application/vnd.is-xpr": {
      source: "iana",
      extensions: ["xpr"]
    },
    "application/vnd.isac.fcs": {
      source: "iana",
      extensions: ["fcs"]
    },
    "application/vnd.iso11783-10+zip": {
      source: "iana",
      compressible: false
    },
    "application/vnd.jam": {
      source: "iana",
      extensions: ["jam"]
    },
    "application/vnd.japannet-directory-service": {
      source: "iana"
    },
    "application/vnd.japannet-jpnstore-wakeup": {
      source: "iana"
    },
    "application/vnd.japannet-payment-wakeup": {
      source: "iana"
    },
    "application/vnd.japannet-registration": {
      source: "iana"
    },
    "application/vnd.japannet-registration-wakeup": {
      source: "iana"
    },
    "application/vnd.japannet-setstore-wakeup": {
      source: "iana"
    },
    "application/vnd.japannet-verification": {
      source: "iana"
    },
    "application/vnd.japannet-verification-wakeup": {
      source: "iana"
    },
    "application/vnd.jcp.javame.midlet-rms": {
      source: "iana",
      extensions: ["rms"]
    },
    "application/vnd.jisp": {
      source: "iana",
      extensions: ["jisp"]
    },
    "application/vnd.joost.joda-archive": {
      source: "iana",
      extensions: ["joda"]
    },
    "application/vnd.jsk.isdn-ngn": {
      source: "iana"
    },
    "application/vnd.kahootz": {
      source: "iana",
      extensions: ["ktz", "ktr"]
    },
    "application/vnd.kde.karbon": {
      source: "iana",
      extensions: ["karbon"]
    },
    "application/vnd.kde.kchart": {
      source: "iana",
      extensions: ["chrt"]
    },
    "application/vnd.kde.kformula": {
      source: "iana",
      extensions: ["kfo"]
    },
    "application/vnd.kde.kivio": {
      source: "iana",
      extensions: ["flw"]
    },
    "application/vnd.kde.kontour": {
      source: "iana",
      extensions: ["kon"]
    },
    "application/vnd.kde.kpresenter": {
      source: "iana",
      extensions: ["kpr", "kpt"]
    },
    "application/vnd.kde.kspread": {
      source: "iana",
      extensions: ["ksp"]
    },
    "application/vnd.kde.kword": {
      source: "iana",
      extensions: ["kwd", "kwt"]
    },
    "application/vnd.kenameaapp": {
      source: "iana",
      extensions: ["htke"]
    },
    "application/vnd.kidspiration": {
      source: "iana",
      extensions: ["kia"]
    },
    "application/vnd.kinar": {
      source: "iana",
      extensions: ["kne", "knp"]
    },
    "application/vnd.koan": {
      source: "iana",
      extensions: ["skp", "skd", "skt", "skm"]
    },
    "application/vnd.kodak-descriptor": {
      source: "iana",
      extensions: ["sse"]
    },
    "application/vnd.las": {
      source: "iana"
    },
    "application/vnd.las.las+json": {
      source: "iana",
      compressible: true
    },
    "application/vnd.las.las+xml": {
      source: "iana",
      compressible: true,
      extensions: ["lasxml"]
    },
    "application/vnd.laszip": {
      source: "iana"
    },
    "application/vnd.leap+json": {
      source: "iana",
      compressible: true
    },
    "application/vnd.liberty-request+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.llamagraphics.life-balance.desktop": {
      source: "iana",
      extensions: ["lbd"]
    },
    "application/vnd.llamagraphics.life-balance.exchange+xml": {
      source: "iana",
      compressible: true,
      extensions: ["lbe"]
    },
    "application/vnd.logipipe.circuit+zip": {
      source: "iana",
      compressible: false
    },
    "application/vnd.loom": {
      source: "iana"
    },
    "application/vnd.lotus-1-2-3": {
      source: "iana",
      extensions: ["123"]
    },
    "application/vnd.lotus-approach": {
      source: "iana",
      extensions: ["apr"]
    },
    "application/vnd.lotus-freelance": {
      source: "iana",
      extensions: ["pre"]
    },
    "application/vnd.lotus-notes": {
      source: "iana",
      extensions: ["nsf"]
    },
    "application/vnd.lotus-organizer": {
      source: "iana",
      extensions: ["org"]
    },
    "application/vnd.lotus-screencam": {
      source: "iana",
      extensions: ["scm"]
    },
    "application/vnd.lotus-wordpro": {
      source: "iana",
      extensions: ["lwp"]
    },
    "application/vnd.macports.portpkg": {
      source: "iana",
      extensions: ["portpkg"]
    },
    "application/vnd.mapbox-vector-tile": {
      source: "iana",
      extensions: ["mvt"]
    },
    "application/vnd.marlin.drm.actiontoken+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.marlin.drm.conftoken+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.marlin.drm.license+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.marlin.drm.mdcf": {
      source: "iana"
    },
    "application/vnd.mason+json": {
      source: "iana",
      compressible: true
    },
    "application/vnd.maxar.archive.3tz+zip": {
      source: "iana",
      compressible: false
    },
    "application/vnd.maxmind.maxmind-db": {
      source: "iana"
    },
    "application/vnd.mcd": {
      source: "iana",
      extensions: ["mcd"]
    },
    "application/vnd.medcalcdata": {
      source: "iana",
      extensions: ["mc1"]
    },
    "application/vnd.mediastation.cdkey": {
      source: "iana",
      extensions: ["cdkey"]
    },
    "application/vnd.meridian-slingshot": {
      source: "iana"
    },
    "application/vnd.mfer": {
      source: "iana",
      extensions: ["mwf"]
    },
    "application/vnd.mfmp": {
      source: "iana",
      extensions: ["mfm"]
    },
    "application/vnd.micro+json": {
      source: "iana",
      compressible: true
    },
    "application/vnd.micrografx.flo": {
      source: "iana",
      extensions: ["flo"]
    },
    "application/vnd.micrografx.igx": {
      source: "iana",
      extensions: ["igx"]
    },
    "application/vnd.microsoft.portable-executable": {
      source: "iana"
    },
    "application/vnd.microsoft.windows.thumbnail-cache": {
      source: "iana"
    },
    "application/vnd.miele+json": {
      source: "iana",
      compressible: true
    },
    "application/vnd.mif": {
      source: "iana",
      extensions: ["mif"]
    },
    "application/vnd.minisoft-hp3000-save": {
      source: "iana"
    },
    "application/vnd.mitsubishi.misty-guard.trustweb": {
      source: "iana"
    },
    "application/vnd.mobius.daf": {
      source: "iana",
      extensions: ["daf"]
    },
    "application/vnd.mobius.dis": {
      source: "iana",
      extensions: ["dis"]
    },
    "application/vnd.mobius.mbk": {
      source: "iana",
      extensions: ["mbk"]
    },
    "application/vnd.mobius.mqy": {
      source: "iana",
      extensions: ["mqy"]
    },
    "application/vnd.mobius.msl": {
      source: "iana",
      extensions: ["msl"]
    },
    "application/vnd.mobius.plc": {
      source: "iana",
      extensions: ["plc"]
    },
    "application/vnd.mobius.txf": {
      source: "iana",
      extensions: ["txf"]
    },
    "application/vnd.mophun.application": {
      source: "iana",
      extensions: ["mpn"]
    },
    "application/vnd.mophun.certificate": {
      source: "iana",
      extensions: ["mpc"]
    },
    "application/vnd.motorola.flexsuite": {
      source: "iana"
    },
    "application/vnd.motorola.flexsuite.adsi": {
      source: "iana"
    },
    "application/vnd.motorola.flexsuite.fis": {
      source: "iana"
    },
    "application/vnd.motorola.flexsuite.gotap": {
      source: "iana"
    },
    "application/vnd.motorola.flexsuite.kmr": {
      source: "iana"
    },
    "application/vnd.motorola.flexsuite.ttc": {
      source: "iana"
    },
    "application/vnd.motorola.flexsuite.wem": {
      source: "iana"
    },
    "application/vnd.motorola.iprm": {
      source: "iana"
    },
    "application/vnd.mozilla.xul+xml": {
      source: "iana",
      compressible: true,
      extensions: ["xul"]
    },
    "application/vnd.ms-3mfdocument": {
      source: "iana"
    },
    "application/vnd.ms-artgalry": {
      source: "iana",
      extensions: ["cil"]
    },
    "application/vnd.ms-asf": {
      source: "iana"
    },
    "application/vnd.ms-cab-compressed": {
      source: "iana",
      extensions: ["cab"]
    },
    "application/vnd.ms-color.iccprofile": {
      source: "apache"
    },
    "application/vnd.ms-excel": {
      source: "iana",
      compressible: false,
      extensions: ["xls", "xlm", "xla", "xlc", "xlt", "xlw"]
    },
    "application/vnd.ms-excel.addin.macroenabled.12": {
      source: "iana",
      extensions: ["xlam"]
    },
    "application/vnd.ms-excel.sheet.binary.macroenabled.12": {
      source: "iana",
      extensions: ["xlsb"]
    },
    "application/vnd.ms-excel.sheet.macroenabled.12": {
      source: "iana",
      extensions: ["xlsm"]
    },
    "application/vnd.ms-excel.template.macroenabled.12": {
      source: "iana",
      extensions: ["xltm"]
    },
    "application/vnd.ms-fontobject": {
      source: "iana",
      compressible: true,
      extensions: ["eot"]
    },
    "application/vnd.ms-htmlhelp": {
      source: "iana",
      extensions: ["chm"]
    },
    "application/vnd.ms-ims": {
      source: "iana",
      extensions: ["ims"]
    },
    "application/vnd.ms-lrm": {
      source: "iana",
      extensions: ["lrm"]
    },
    "application/vnd.ms-office.activex+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.ms-officetheme": {
      source: "iana",
      extensions: ["thmx"]
    },
    "application/vnd.ms-opentype": {
      source: "apache",
      compressible: true
    },
    "application/vnd.ms-outlook": {
      compressible: false,
      extensions: ["msg"]
    },
    "application/vnd.ms-package.obfuscated-opentype": {
      source: "apache"
    },
    "application/vnd.ms-pki.seccat": {
      source: "apache",
      extensions: ["cat"]
    },
    "application/vnd.ms-pki.stl": {
      source: "apache",
      extensions: ["stl"]
    },
    "application/vnd.ms-playready.initiator+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.ms-powerpoint": {
      source: "iana",
      compressible: false,
      extensions: ["ppt", "pps", "pot"]
    },
    "application/vnd.ms-powerpoint.addin.macroenabled.12": {
      source: "iana",
      extensions: ["ppam"]
    },
    "application/vnd.ms-powerpoint.presentation.macroenabled.12": {
      source: "iana",
      extensions: ["pptm"]
    },
    "application/vnd.ms-powerpoint.slide.macroenabled.12": {
      source: "iana",
      extensions: ["sldm"]
    },
    "application/vnd.ms-powerpoint.slideshow.macroenabled.12": {
      source: "iana",
      extensions: ["ppsm"]
    },
    "application/vnd.ms-powerpoint.template.macroenabled.12": {
      source: "iana",
      extensions: ["potm"]
    },
    "application/vnd.ms-printdevicecapabilities+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.ms-printing.printticket+xml": {
      source: "apache",
      compressible: true
    },
    "application/vnd.ms-printschematicket+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.ms-project": {
      source: "iana",
      extensions: ["mpp", "mpt"]
    },
    "application/vnd.ms-tnef": {
      source: "iana"
    },
    "application/vnd.ms-windows.devicepairing": {
      source: "iana"
    },
    "application/vnd.ms-windows.nwprinting.oob": {
      source: "iana"
    },
    "application/vnd.ms-windows.printerpairing": {
      source: "iana"
    },
    "application/vnd.ms-windows.wsd.oob": {
      source: "iana"
    },
    "application/vnd.ms-wmdrm.lic-chlg-req": {
      source: "iana"
    },
    "application/vnd.ms-wmdrm.lic-resp": {
      source: "iana"
    },
    "application/vnd.ms-wmdrm.meter-chlg-req": {
      source: "iana"
    },
    "application/vnd.ms-wmdrm.meter-resp": {
      source: "iana"
    },
    "application/vnd.ms-word.document.macroenabled.12": {
      source: "iana",
      extensions: ["docm"]
    },
    "application/vnd.ms-word.template.macroenabled.12": {
      source: "iana",
      extensions: ["dotm"]
    },
    "application/vnd.ms-works": {
      source: "iana",
      extensions: ["wps", "wks", "wcm", "wdb"]
    },
    "application/vnd.ms-wpl": {
      source: "iana",
      extensions: ["wpl"]
    },
    "application/vnd.ms-xpsdocument": {
      source: "iana",
      compressible: false,
      extensions: ["xps"]
    },
    "application/vnd.msa-disk-image": {
      source: "iana"
    },
    "application/vnd.mseq": {
      source: "iana",
      extensions: ["mseq"]
    },
    "application/vnd.msign": {
      source: "iana"
    },
    "application/vnd.multiad.creator": {
      source: "iana"
    },
    "application/vnd.multiad.creator.cif": {
      source: "iana"
    },
    "application/vnd.music-niff": {
      source: "iana"
    },
    "application/vnd.musician": {
      source: "iana",
      extensions: ["mus"]
    },
    "application/vnd.muvee.style": {
      source: "iana",
      extensions: ["msty"]
    },
    "application/vnd.mynfc": {
      source: "iana",
      extensions: ["taglet"]
    },
    "application/vnd.nacamar.ybrid+json": {
      source: "iana",
      compressible: true
    },
    "application/vnd.ncd.control": {
      source: "iana"
    },
    "application/vnd.ncd.reference": {
      source: "iana"
    },
    "application/vnd.nearst.inv+json": {
      source: "iana",
      compressible: true
    },
    "application/vnd.nebumind.line": {
      source: "iana"
    },
    "application/vnd.nervana": {
      source: "iana"
    },
    "application/vnd.netfpx": {
      source: "iana"
    },
    "application/vnd.neurolanguage.nlu": {
      source: "iana",
      extensions: ["nlu"]
    },
    "application/vnd.nimn": {
      source: "iana"
    },
    "application/vnd.nintendo.nitro.rom": {
      source: "iana"
    },
    "application/vnd.nintendo.snes.rom": {
      source: "iana"
    },
    "application/vnd.nitf": {
      source: "iana",
      extensions: ["ntf", "nitf"]
    },
    "application/vnd.noblenet-directory": {
      source: "iana",
      extensions: ["nnd"]
    },
    "application/vnd.noblenet-sealer": {
      source: "iana",
      extensions: ["nns"]
    },
    "application/vnd.noblenet-web": {
      source: "iana",
      extensions: ["nnw"]
    },
    "application/vnd.nokia.catalogs": {
      source: "iana"
    },
    "application/vnd.nokia.conml+wbxml": {
      source: "iana"
    },
    "application/vnd.nokia.conml+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.nokia.iptv.config+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.nokia.isds-radio-presets": {
      source: "iana"
    },
    "application/vnd.nokia.landmark+wbxml": {
      source: "iana"
    },
    "application/vnd.nokia.landmark+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.nokia.landmarkcollection+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.nokia.n-gage.ac+xml": {
      source: "iana",
      compressible: true,
      extensions: ["ac"]
    },
    "application/vnd.nokia.n-gage.data": {
      source: "iana",
      extensions: ["ngdat"]
    },
    "application/vnd.nokia.n-gage.symbian.install": {
      source: "iana",
      extensions: ["n-gage"]
    },
    "application/vnd.nokia.ncd": {
      source: "iana"
    },
    "application/vnd.nokia.pcd+wbxml": {
      source: "iana"
    },
    "application/vnd.nokia.pcd+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.nokia.radio-preset": {
      source: "iana",
      extensions: ["rpst"]
    },
    "application/vnd.nokia.radio-presets": {
      source: "iana",
      extensions: ["rpss"]
    },
    "application/vnd.novadigm.edm": {
      source: "iana",
      extensions: ["edm"]
    },
    "application/vnd.novadigm.edx": {
      source: "iana",
      extensions: ["edx"]
    },
    "application/vnd.novadigm.ext": {
      source: "iana",
      extensions: ["ext"]
    },
    "application/vnd.ntt-local.content-share": {
      source: "iana"
    },
    "application/vnd.ntt-local.file-transfer": {
      source: "iana"
    },
    "application/vnd.ntt-local.ogw_remote-access": {
      source: "iana"
    },
    "application/vnd.ntt-local.sip-ta_remote": {
      source: "iana"
    },
    "application/vnd.ntt-local.sip-ta_tcp_stream": {
      source: "iana"
    },
    "application/vnd.oasis.opendocument.chart": {
      source: "iana",
      extensions: ["odc"]
    },
    "application/vnd.oasis.opendocument.chart-template": {
      source: "iana",
      extensions: ["otc"]
    },
    "application/vnd.oasis.opendocument.database": {
      source: "iana",
      extensions: ["odb"]
    },
    "application/vnd.oasis.opendocument.formula": {
      source: "iana",
      extensions: ["odf"]
    },
    "application/vnd.oasis.opendocument.formula-template": {
      source: "iana",
      extensions: ["odft"]
    },
    "application/vnd.oasis.opendocument.graphics": {
      source: "iana",
      compressible: false,
      extensions: ["odg"]
    },
    "application/vnd.oasis.opendocument.graphics-template": {
      source: "iana",
      extensions: ["otg"]
    },
    "application/vnd.oasis.opendocument.image": {
      source: "iana",
      extensions: ["odi"]
    },
    "application/vnd.oasis.opendocument.image-template": {
      source: "iana",
      extensions: ["oti"]
    },
    "application/vnd.oasis.opendocument.presentation": {
      source: "iana",
      compressible: false,
      extensions: ["odp"]
    },
    "application/vnd.oasis.opendocument.presentation-template": {
      source: "iana",
      extensions: ["otp"]
    },
    "application/vnd.oasis.opendocument.spreadsheet": {
      source: "iana",
      compressible: false,
      extensions: ["ods"]
    },
    "application/vnd.oasis.opendocument.spreadsheet-template": {
      source: "iana",
      extensions: ["ots"]
    },
    "application/vnd.oasis.opendocument.text": {
      source: "iana",
      compressible: false,
      extensions: ["odt"]
    },
    "application/vnd.oasis.opendocument.text-master": {
      source: "iana",
      extensions: ["odm"]
    },
    "application/vnd.oasis.opendocument.text-template": {
      source: "iana",
      extensions: ["ott"]
    },
    "application/vnd.oasis.opendocument.text-web": {
      source: "iana",
      extensions: ["oth"]
    },
    "application/vnd.obn": {
      source: "iana"
    },
    "application/vnd.ocf+cbor": {
      source: "iana"
    },
    "application/vnd.oci.image.manifest.v1+json": {
      source: "iana",
      compressible: true
    },
    "application/vnd.oftn.l10n+json": {
      source: "iana",
      compressible: true
    },
    "application/vnd.oipf.contentaccessdownload+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.oipf.contentaccessstreaming+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.oipf.cspg-hexbinary": {
      source: "iana"
    },
    "application/vnd.oipf.dae.svg+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.oipf.dae.xhtml+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.oipf.mippvcontrolmessage+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.oipf.pae.gem": {
      source: "iana"
    },
    "application/vnd.oipf.spdiscovery+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.oipf.spdlist+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.oipf.ueprofile+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.oipf.userprofile+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.olpc-sugar": {
      source: "iana",
      extensions: ["xo"]
    },
    "application/vnd.oma-scws-config": {
      source: "iana"
    },
    "application/vnd.oma-scws-http-request": {
      source: "iana"
    },
    "application/vnd.oma-scws-http-response": {
      source: "iana"
    },
    "application/vnd.oma.bcast.associated-procedure-parameter+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.oma.bcast.drm-trigger+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.oma.bcast.imd+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.oma.bcast.ltkm": {
      source: "iana"
    },
    "application/vnd.oma.bcast.notification+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.oma.bcast.provisioningtrigger": {
      source: "iana"
    },
    "application/vnd.oma.bcast.sgboot": {
      source: "iana"
    },
    "application/vnd.oma.bcast.sgdd+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.oma.bcast.sgdu": {
      source: "iana"
    },
    "application/vnd.oma.bcast.simple-symbol-container": {
      source: "iana"
    },
    "application/vnd.oma.bcast.smartcard-trigger+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.oma.bcast.sprov+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.oma.bcast.stkm": {
      source: "iana"
    },
    "application/vnd.oma.cab-address-book+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.oma.cab-feature-handler+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.oma.cab-pcc+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.oma.cab-subs-invite+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.oma.cab-user-prefs+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.oma.dcd": {
      source: "iana"
    },
    "application/vnd.oma.dcdc": {
      source: "iana"
    },
    "application/vnd.oma.dd2+xml": {
      source: "iana",
      compressible: true,
      extensions: ["dd2"]
    },
    "application/vnd.oma.drm.risd+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.oma.group-usage-list+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.oma.lwm2m+cbor": {
      source: "iana"
    },
    "application/vnd.oma.lwm2m+json": {
      source: "iana",
      compressible: true
    },
    "application/vnd.oma.lwm2m+tlv": {
      source: "iana"
    },
    "application/vnd.oma.pal+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.oma.poc.detailed-progress-report+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.oma.poc.final-report+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.oma.poc.groups+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.oma.poc.invocation-descriptor+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.oma.poc.optimized-progress-report+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.oma.push": {
      source: "iana"
    },
    "application/vnd.oma.scidm.messages+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.oma.xcap-directory+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.omads-email+xml": {
      source: "iana",
      charset: "UTF-8",
      compressible: true
    },
    "application/vnd.omads-file+xml": {
      source: "iana",
      charset: "UTF-8",
      compressible: true
    },
    "application/vnd.omads-folder+xml": {
      source: "iana",
      charset: "UTF-8",
      compressible: true
    },
    "application/vnd.omaloc-supl-init": {
      source: "iana"
    },
    "application/vnd.onepager": {
      source: "iana"
    },
    "application/vnd.onepagertamp": {
      source: "iana"
    },
    "application/vnd.onepagertamx": {
      source: "iana"
    },
    "application/vnd.onepagertat": {
      source: "iana"
    },
    "application/vnd.onepagertatp": {
      source: "iana"
    },
    "application/vnd.onepagertatx": {
      source: "iana"
    },
    "application/vnd.openblox.game+xml": {
      source: "iana",
      compressible: true,
      extensions: ["obgx"]
    },
    "application/vnd.openblox.game-binary": {
      source: "iana"
    },
    "application/vnd.openeye.oeb": {
      source: "iana"
    },
    "application/vnd.openofficeorg.extension": {
      source: "apache",
      extensions: ["oxt"]
    },
    "application/vnd.openstreetmap.data+xml": {
      source: "iana",
      compressible: true,
      extensions: ["osm"]
    },
    "application/vnd.opentimestamps.ots": {
      source: "iana"
    },
    "application/vnd.openxmlformats-officedocument.custom-properties+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.openxmlformats-officedocument.customxmlproperties+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.openxmlformats-officedocument.drawing+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.openxmlformats-officedocument.drawingml.chart+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.openxmlformats-officedocument.drawingml.chartshapes+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.openxmlformats-officedocument.drawingml.diagramcolors+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.openxmlformats-officedocument.drawingml.diagramdata+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.openxmlformats-officedocument.drawingml.diagramlayout+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.openxmlformats-officedocument.drawingml.diagramstyle+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.openxmlformats-officedocument.extended-properties+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.openxmlformats-officedocument.presentationml.commentauthors+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.openxmlformats-officedocument.presentationml.comments+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.openxmlformats-officedocument.presentationml.handoutmaster+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.openxmlformats-officedocument.presentationml.notesmaster+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.openxmlformats-officedocument.presentationml.notesslide+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.openxmlformats-officedocument.presentationml.presentation": {
      source: "iana",
      compressible: false,
      extensions: ["pptx"]
    },
    "application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.openxmlformats-officedocument.presentationml.presprops+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.openxmlformats-officedocument.presentationml.slide": {
      source: "iana",
      extensions: ["sldx"]
    },
    "application/vnd.openxmlformats-officedocument.presentationml.slide+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.openxmlformats-officedocument.presentationml.slidelayout+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.openxmlformats-officedocument.presentationml.slidemaster+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.openxmlformats-officedocument.presentationml.slideshow": {
      source: "iana",
      extensions: ["ppsx"]
    },
    "application/vnd.openxmlformats-officedocument.presentationml.slideshow.main+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.openxmlformats-officedocument.presentationml.slideupdateinfo+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.openxmlformats-officedocument.presentationml.tablestyles+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.openxmlformats-officedocument.presentationml.tags+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.openxmlformats-officedocument.presentationml.template": {
      source: "iana",
      extensions: ["potx"]
    },
    "application/vnd.openxmlformats-officedocument.presentationml.template.main+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.openxmlformats-officedocument.presentationml.viewprops+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.openxmlformats-officedocument.spreadsheetml.calcchain+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.openxmlformats-officedocument.spreadsheetml.chartsheet+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.openxmlformats-officedocument.spreadsheetml.comments+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.openxmlformats-officedocument.spreadsheetml.connections+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.openxmlformats-officedocument.spreadsheetml.dialogsheet+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.openxmlformats-officedocument.spreadsheetml.externallink+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.openxmlformats-officedocument.spreadsheetml.pivotcachedefinition+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.openxmlformats-officedocument.spreadsheetml.pivotcacherecords+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.openxmlformats-officedocument.spreadsheetml.pivottable+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.openxmlformats-officedocument.spreadsheetml.querytable+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.openxmlformats-officedocument.spreadsheetml.revisionheaders+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.openxmlformats-officedocument.spreadsheetml.revisionlog+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sharedstrings+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": {
      source: "iana",
      compressible: false,
      extensions: ["xlsx"]
    },
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheetmetadata+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.openxmlformats-officedocument.spreadsheetml.table+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.openxmlformats-officedocument.spreadsheetml.tablesinglecells+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.openxmlformats-officedocument.spreadsheetml.template": {
      source: "iana",
      extensions: ["xltx"]
    },
    "application/vnd.openxmlformats-officedocument.spreadsheetml.template.main+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.openxmlformats-officedocument.spreadsheetml.usernames+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.openxmlformats-officedocument.spreadsheetml.volatiledependencies+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.openxmlformats-officedocument.theme+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.openxmlformats-officedocument.themeoverride+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.openxmlformats-officedocument.vmldrawing": {
      source: "iana"
    },
    "application/vnd.openxmlformats-officedocument.wordprocessingml.comments+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": {
      source: "iana",
      compressible: false,
      extensions: ["docx"]
    },
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document.glossary+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.openxmlformats-officedocument.wordprocessingml.endnotes+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.openxmlformats-officedocument.wordprocessingml.fonttable+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.openxmlformats-officedocument.wordprocessingml.footer+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.openxmlformats-officedocument.wordprocessingml.footnotes+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.openxmlformats-officedocument.wordprocessingml.numbering+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.openxmlformats-officedocument.wordprocessingml.settings+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.openxmlformats-officedocument.wordprocessingml.template": {
      source: "iana",
      extensions: ["dotx"]
    },
    "application/vnd.openxmlformats-officedocument.wordprocessingml.template.main+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.openxmlformats-officedocument.wordprocessingml.websettings+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.openxmlformats-package.core-properties+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.openxmlformats-package.digital-signature-xmlsignature+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.openxmlformats-package.relationships+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.oracle.resource+json": {
      source: "iana",
      compressible: true
    },
    "application/vnd.orange.indata": {
      source: "iana"
    },
    "application/vnd.osa.netdeploy": {
      source: "iana"
    },
    "application/vnd.osgeo.mapguide.package": {
      source: "iana",
      extensions: ["mgp"]
    },
    "application/vnd.osgi.bundle": {
      source: "iana"
    },
    "application/vnd.osgi.dp": {
      source: "iana",
      extensions: ["dp"]
    },
    "application/vnd.osgi.subsystem": {
      source: "iana",
      extensions: ["esa"]
    },
    "application/vnd.otps.ct-kip+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.oxli.countgraph": {
      source: "iana"
    },
    "application/vnd.pagerduty+json": {
      source: "iana",
      compressible: true
    },
    "application/vnd.palm": {
      source: "iana",
      extensions: ["pdb", "pqa", "oprc"]
    },
    "application/vnd.panoply": {
      source: "iana"
    },
    "application/vnd.paos.xml": {
      source: "iana"
    },
    "application/vnd.patentdive": {
      source: "iana"
    },
    "application/vnd.patientecommsdoc": {
      source: "iana"
    },
    "application/vnd.pawaafile": {
      source: "iana",
      extensions: ["paw"]
    },
    "application/vnd.pcos": {
      source: "iana"
    },
    "application/vnd.pg.format": {
      source: "iana",
      extensions: ["str"]
    },
    "application/vnd.pg.osasli": {
      source: "iana",
      extensions: ["ei6"]
    },
    "application/vnd.piaccess.application-licence": {
      source: "iana"
    },
    "application/vnd.picsel": {
      source: "iana",
      extensions: ["efif"]
    },
    "application/vnd.pmi.widget": {
      source: "iana",
      extensions: ["wg"]
    },
    "application/vnd.poc.group-advertisement+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.pocketlearn": {
      source: "iana",
      extensions: ["plf"]
    },
    "application/vnd.powerbuilder6": {
      source: "iana",
      extensions: ["pbd"]
    },
    "application/vnd.powerbuilder6-s": {
      source: "iana"
    },
    "application/vnd.powerbuilder7": {
      source: "iana"
    },
    "application/vnd.powerbuilder7-s": {
      source: "iana"
    },
    "application/vnd.powerbuilder75": {
      source: "iana"
    },
    "application/vnd.powerbuilder75-s": {
      source: "iana"
    },
    "application/vnd.preminet": {
      source: "iana"
    },
    "application/vnd.previewsystems.box": {
      source: "iana",
      extensions: ["box"]
    },
    "application/vnd.proteus.magazine": {
      source: "iana",
      extensions: ["mgz"]
    },
    "application/vnd.psfs": {
      source: "iana"
    },
    "application/vnd.publishare-delta-tree": {
      source: "iana",
      extensions: ["qps"]
    },
    "application/vnd.pvi.ptid1": {
      source: "iana",
      extensions: ["ptid"]
    },
    "application/vnd.pwg-multiplexed": {
      source: "iana"
    },
    "application/vnd.pwg-xhtml-print+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.qualcomm.brew-app-res": {
      source: "iana"
    },
    "application/vnd.quarantainenet": {
      source: "iana"
    },
    "application/vnd.quark.quarkxpress": {
      source: "iana",
      extensions: ["qxd", "qxt", "qwd", "qwt", "qxl", "qxb"]
    },
    "application/vnd.quobject-quoxdocument": {
      source: "iana"
    },
    "application/vnd.radisys.moml+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.radisys.msml+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.radisys.msml-audit+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.radisys.msml-audit-conf+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.radisys.msml-audit-conn+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.radisys.msml-audit-dialog+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.radisys.msml-audit-stream+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.radisys.msml-conf+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.radisys.msml-dialog+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.radisys.msml-dialog-base+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.radisys.msml-dialog-fax-detect+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.radisys.msml-dialog-fax-sendrecv+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.radisys.msml-dialog-group+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.radisys.msml-dialog-speech+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.radisys.msml-dialog-transform+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.rainstor.data": {
      source: "iana"
    },
    "application/vnd.rapid": {
      source: "iana"
    },
    "application/vnd.rar": {
      source: "iana",
      extensions: ["rar"]
    },
    "application/vnd.realvnc.bed": {
      source: "iana",
      extensions: ["bed"]
    },
    "application/vnd.recordare.musicxml": {
      source: "iana",
      extensions: ["mxl"]
    },
    "application/vnd.recordare.musicxml+xml": {
      source: "iana",
      compressible: true,
      extensions: ["musicxml"]
    },
    "application/vnd.renlearn.rlprint": {
      source: "iana"
    },
    "application/vnd.resilient.logic": {
      source: "iana"
    },
    "application/vnd.restful+json": {
      source: "iana",
      compressible: true
    },
    "application/vnd.rig.cryptonote": {
      source: "iana",
      extensions: ["cryptonote"]
    },
    "application/vnd.rim.cod": {
      source: "apache",
      extensions: ["cod"]
    },
    "application/vnd.rn-realmedia": {
      source: "apache",
      extensions: ["rm"]
    },
    "application/vnd.rn-realmedia-vbr": {
      source: "apache",
      extensions: ["rmvb"]
    },
    "application/vnd.route66.link66+xml": {
      source: "iana",
      compressible: true,
      extensions: ["link66"]
    },
    "application/vnd.rs-274x": {
      source: "iana"
    },
    "application/vnd.ruckus.download": {
      source: "iana"
    },
    "application/vnd.s3sms": {
      source: "iana"
    },
    "application/vnd.sailingtracker.track": {
      source: "iana",
      extensions: ["st"]
    },
    "application/vnd.sar": {
      source: "iana"
    },
    "application/vnd.sbm.cid": {
      source: "iana"
    },
    "application/vnd.sbm.mid2": {
      source: "iana"
    },
    "application/vnd.scribus": {
      source: "iana"
    },
    "application/vnd.sealed.3df": {
      source: "iana"
    },
    "application/vnd.sealed.csf": {
      source: "iana"
    },
    "application/vnd.sealed.doc": {
      source: "iana"
    },
    "application/vnd.sealed.eml": {
      source: "iana"
    },
    "application/vnd.sealed.mht": {
      source: "iana"
    },
    "application/vnd.sealed.net": {
      source: "iana"
    },
    "application/vnd.sealed.ppt": {
      source: "iana"
    },
    "application/vnd.sealed.tiff": {
      source: "iana"
    },
    "application/vnd.sealed.xls": {
      source: "iana"
    },
    "application/vnd.sealedmedia.softseal.html": {
      source: "iana"
    },
    "application/vnd.sealedmedia.softseal.pdf": {
      source: "iana"
    },
    "application/vnd.seemail": {
      source: "iana",
      extensions: ["see"]
    },
    "application/vnd.seis+json": {
      source: "iana",
      compressible: true
    },
    "application/vnd.sema": {
      source: "iana",
      extensions: ["sema"]
    },
    "application/vnd.semd": {
      source: "iana",
      extensions: ["semd"]
    },
    "application/vnd.semf": {
      source: "iana",
      extensions: ["semf"]
    },
    "application/vnd.shade-save-file": {
      source: "iana"
    },
    "application/vnd.shana.informed.formdata": {
      source: "iana",
      extensions: ["ifm"]
    },
    "application/vnd.shana.informed.formtemplate": {
      source: "iana",
      extensions: ["itp"]
    },
    "application/vnd.shana.informed.interchange": {
      source: "iana",
      extensions: ["iif"]
    },
    "application/vnd.shana.informed.package": {
      source: "iana",
      extensions: ["ipk"]
    },
    "application/vnd.shootproof+json": {
      source: "iana",
      compressible: true
    },
    "application/vnd.shopkick+json": {
      source: "iana",
      compressible: true
    },
    "application/vnd.shp": {
      source: "iana"
    },
    "application/vnd.shx": {
      source: "iana"
    },
    "application/vnd.sigrok.session": {
      source: "iana"
    },
    "application/vnd.simtech-mindmapper": {
      source: "iana",
      extensions: ["twd", "twds"]
    },
    "application/vnd.siren+json": {
      source: "iana",
      compressible: true
    },
    "application/vnd.smaf": {
      source: "iana",
      extensions: ["mmf"]
    },
    "application/vnd.smart.notebook": {
      source: "iana"
    },
    "application/vnd.smart.teacher": {
      source: "iana",
      extensions: ["teacher"]
    },
    "application/vnd.snesdev-page-table": {
      source: "iana"
    },
    "application/vnd.software602.filler.form+xml": {
      source: "iana",
      compressible: true,
      extensions: ["fo"]
    },
    "application/vnd.software602.filler.form-xml-zip": {
      source: "iana"
    },
    "application/vnd.solent.sdkm+xml": {
      source: "iana",
      compressible: true,
      extensions: ["sdkm", "sdkd"]
    },
    "application/vnd.spotfire.dxp": {
      source: "iana",
      extensions: ["dxp"]
    },
    "application/vnd.spotfire.sfs": {
      source: "iana",
      extensions: ["sfs"]
    },
    "application/vnd.sqlite3": {
      source: "iana"
    },
    "application/vnd.sss-cod": {
      source: "iana"
    },
    "application/vnd.sss-dtf": {
      source: "iana"
    },
    "application/vnd.sss-ntf": {
      source: "iana"
    },
    "application/vnd.stardivision.calc": {
      source: "apache",
      extensions: ["sdc"]
    },
    "application/vnd.stardivision.draw": {
      source: "apache",
      extensions: ["sda"]
    },
    "application/vnd.stardivision.impress": {
      source: "apache",
      extensions: ["sdd"]
    },
    "application/vnd.stardivision.math": {
      source: "apache",
      extensions: ["smf"]
    },
    "application/vnd.stardivision.writer": {
      source: "apache",
      extensions: ["sdw", "vor"]
    },
    "application/vnd.stardivision.writer-global": {
      source: "apache",
      extensions: ["sgl"]
    },
    "application/vnd.stepmania.package": {
      source: "iana",
      extensions: ["smzip"]
    },
    "application/vnd.stepmania.stepchart": {
      source: "iana",
      extensions: ["sm"]
    },
    "application/vnd.street-stream": {
      source: "iana"
    },
    "application/vnd.sun.wadl+xml": {
      source: "iana",
      compressible: true,
      extensions: ["wadl"]
    },
    "application/vnd.sun.xml.calc": {
      source: "apache",
      extensions: ["sxc"]
    },
    "application/vnd.sun.xml.calc.template": {
      source: "apache",
      extensions: ["stc"]
    },
    "application/vnd.sun.xml.draw": {
      source: "apache",
      extensions: ["sxd"]
    },
    "application/vnd.sun.xml.draw.template": {
      source: "apache",
      extensions: ["std"]
    },
    "application/vnd.sun.xml.impress": {
      source: "apache",
      extensions: ["sxi"]
    },
    "application/vnd.sun.xml.impress.template": {
      source: "apache",
      extensions: ["sti"]
    },
    "application/vnd.sun.xml.math": {
      source: "apache",
      extensions: ["sxm"]
    },
    "application/vnd.sun.xml.writer": {
      source: "apache",
      extensions: ["sxw"]
    },
    "application/vnd.sun.xml.writer.global": {
      source: "apache",
      extensions: ["sxg"]
    },
    "application/vnd.sun.xml.writer.template": {
      source: "apache",
      extensions: ["stw"]
    },
    "application/vnd.sus-calendar": {
      source: "iana",
      extensions: ["sus", "susp"]
    },
    "application/vnd.svd": {
      source: "iana",
      extensions: ["svd"]
    },
    "application/vnd.swiftview-ics": {
      source: "iana"
    },
    "application/vnd.sycle+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.syft+json": {
      source: "iana",
      compressible: true
    },
    "application/vnd.symbian.install": {
      source: "apache",
      extensions: ["sis", "sisx"]
    },
    "application/vnd.syncml+xml": {
      source: "iana",
      charset: "UTF-8",
      compressible: true,
      extensions: ["xsm"]
    },
    "application/vnd.syncml.dm+wbxml": {
      source: "iana",
      charset: "UTF-8",
      extensions: ["bdm"]
    },
    "application/vnd.syncml.dm+xml": {
      source: "iana",
      charset: "UTF-8",
      compressible: true,
      extensions: ["xdm"]
    },
    "application/vnd.syncml.dm.notification": {
      source: "iana"
    },
    "application/vnd.syncml.dmddf+wbxml": {
      source: "iana"
    },
    "application/vnd.syncml.dmddf+xml": {
      source: "iana",
      charset: "UTF-8",
      compressible: true,
      extensions: ["ddf"]
    },
    "application/vnd.syncml.dmtnds+wbxml": {
      source: "iana"
    },
    "application/vnd.syncml.dmtnds+xml": {
      source: "iana",
      charset: "UTF-8",
      compressible: true
    },
    "application/vnd.syncml.ds.notification": {
      source: "iana"
    },
    "application/vnd.tableschema+json": {
      source: "iana",
      compressible: true
    },
    "application/vnd.tao.intent-module-archive": {
      source: "iana",
      extensions: ["tao"]
    },
    "application/vnd.tcpdump.pcap": {
      source: "iana",
      extensions: ["pcap", "cap", "dmp"]
    },
    "application/vnd.think-cell.ppttc+json": {
      source: "iana",
      compressible: true
    },
    "application/vnd.tmd.mediaflex.api+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.tml": {
      source: "iana"
    },
    "application/vnd.tmobile-livetv": {
      source: "iana",
      extensions: ["tmo"]
    },
    "application/vnd.tri.onesource": {
      source: "iana"
    },
    "application/vnd.trid.tpt": {
      source: "iana",
      extensions: ["tpt"]
    },
    "application/vnd.triscape.mxs": {
      source: "iana",
      extensions: ["mxs"]
    },
    "application/vnd.trueapp": {
      source: "iana",
      extensions: ["tra"]
    },
    "application/vnd.truedoc": {
      source: "iana"
    },
    "application/vnd.ubisoft.webplayer": {
      source: "iana"
    },
    "application/vnd.ufdl": {
      source: "iana",
      extensions: ["ufd", "ufdl"]
    },
    "application/vnd.uiq.theme": {
      source: "iana",
      extensions: ["utz"]
    },
    "application/vnd.umajin": {
      source: "iana",
      extensions: ["umj"]
    },
    "application/vnd.unity": {
      source: "iana",
      extensions: ["unityweb"]
    },
    "application/vnd.uoml+xml": {
      source: "iana",
      compressible: true,
      extensions: ["uoml"]
    },
    "application/vnd.uplanet.alert": {
      source: "iana"
    },
    "application/vnd.uplanet.alert-wbxml": {
      source: "iana"
    },
    "application/vnd.uplanet.bearer-choice": {
      source: "iana"
    },
    "application/vnd.uplanet.bearer-choice-wbxml": {
      source: "iana"
    },
    "application/vnd.uplanet.cacheop": {
      source: "iana"
    },
    "application/vnd.uplanet.cacheop-wbxml": {
      source: "iana"
    },
    "application/vnd.uplanet.channel": {
      source: "iana"
    },
    "application/vnd.uplanet.channel-wbxml": {
      source: "iana"
    },
    "application/vnd.uplanet.list": {
      source: "iana"
    },
    "application/vnd.uplanet.list-wbxml": {
      source: "iana"
    },
    "application/vnd.uplanet.listcmd": {
      source: "iana"
    },
    "application/vnd.uplanet.listcmd-wbxml": {
      source: "iana"
    },
    "application/vnd.uplanet.signal": {
      source: "iana"
    },
    "application/vnd.uri-map": {
      source: "iana"
    },
    "application/vnd.valve.source.material": {
      source: "iana"
    },
    "application/vnd.vcx": {
      source: "iana",
      extensions: ["vcx"]
    },
    "application/vnd.vd-study": {
      source: "iana"
    },
    "application/vnd.vectorworks": {
      source: "iana"
    },
    "application/vnd.vel+json": {
      source: "iana",
      compressible: true
    },
    "application/vnd.verimatrix.vcas": {
      source: "iana"
    },
    "application/vnd.veritone.aion+json": {
      source: "iana",
      compressible: true
    },
    "application/vnd.veryant.thin": {
      source: "iana"
    },
    "application/vnd.ves.encrypted": {
      source: "iana"
    },
    "application/vnd.vidsoft.vidconference": {
      source: "iana"
    },
    "application/vnd.visio": {
      source: "iana",
      extensions: ["vsd", "vst", "vss", "vsw"]
    },
    "application/vnd.visionary": {
      source: "iana",
      extensions: ["vis"]
    },
    "application/vnd.vividence.scriptfile": {
      source: "iana"
    },
    "application/vnd.vsf": {
      source: "iana",
      extensions: ["vsf"]
    },
    "application/vnd.wap.sic": {
      source: "iana"
    },
    "application/vnd.wap.slc": {
      source: "iana"
    },
    "application/vnd.wap.wbxml": {
      source: "iana",
      charset: "UTF-8",
      extensions: ["wbxml"]
    },
    "application/vnd.wap.wmlc": {
      source: "iana",
      extensions: ["wmlc"]
    },
    "application/vnd.wap.wmlscriptc": {
      source: "iana",
      extensions: ["wmlsc"]
    },
    "application/vnd.webturbo": {
      source: "iana",
      extensions: ["wtb"]
    },
    "application/vnd.wfa.dpp": {
      source: "iana"
    },
    "application/vnd.wfa.p2p": {
      source: "iana"
    },
    "application/vnd.wfa.wsc": {
      source: "iana"
    },
    "application/vnd.windows.devicepairing": {
      source: "iana"
    },
    "application/vnd.wmc": {
      source: "iana"
    },
    "application/vnd.wmf.bootstrap": {
      source: "iana"
    },
    "application/vnd.wolfram.mathematica": {
      source: "iana"
    },
    "application/vnd.wolfram.mathematica.package": {
      source: "iana"
    },
    "application/vnd.wolfram.player": {
      source: "iana",
      extensions: ["nbp"]
    },
    "application/vnd.wordperfect": {
      source: "iana",
      extensions: ["wpd"]
    },
    "application/vnd.wqd": {
      source: "iana",
      extensions: ["wqd"]
    },
    "application/vnd.wrq-hp3000-labelled": {
      source: "iana"
    },
    "application/vnd.wt.stf": {
      source: "iana",
      extensions: ["stf"]
    },
    "application/vnd.wv.csp+wbxml": {
      source: "iana"
    },
    "application/vnd.wv.csp+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.wv.ssp+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.xacml+json": {
      source: "iana",
      compressible: true
    },
    "application/vnd.xara": {
      source: "iana",
      extensions: ["xar"]
    },
    "application/vnd.xfdl": {
      source: "iana",
      extensions: ["xfdl"]
    },
    "application/vnd.xfdl.webform": {
      source: "iana"
    },
    "application/vnd.xmi+xml": {
      source: "iana",
      compressible: true
    },
    "application/vnd.xmpie.cpkg": {
      source: "iana"
    },
    "application/vnd.xmpie.dpkg": {
      source: "iana"
    },
    "application/vnd.xmpie.plan": {
      source: "iana"
    },
    "application/vnd.xmpie.ppkg": {
      source: "iana"
    },
    "application/vnd.xmpie.xlim": {
      source: "iana"
    },
    "application/vnd.yamaha.hv-dic": {
      source: "iana",
      extensions: ["hvd"]
    },
    "application/vnd.yamaha.hv-script": {
      source: "iana",
      extensions: ["hvs"]
    },
    "application/vnd.yamaha.hv-voice": {
      source: "iana",
      extensions: ["hvp"]
    },
    "application/vnd.yamaha.openscoreformat": {
      source: "iana",
      extensions: ["osf"]
    },
    "application/vnd.yamaha.openscoreformat.osfpvg+xml": {
      source: "iana",
      compressible: true,
      extensions: ["osfpvg"]
    },
    "application/vnd.yamaha.remote-setup": {
      source: "iana"
    },
    "application/vnd.yamaha.smaf-audio": {
      source: "iana",
      extensions: ["saf"]
    },
    "application/vnd.yamaha.smaf-phrase": {
      source: "iana",
      extensions: ["spf"]
    },
    "application/vnd.yamaha.through-ngn": {
      source: "iana"
    },
    "application/vnd.yamaha.tunnel-udpencap": {
      source: "iana"
    },
    "application/vnd.yaoweme": {
      source: "iana"
    },
    "application/vnd.yellowriver-custom-menu": {
      source: "iana",
      extensions: ["cmp"]
    },
    "application/vnd.youtube.yt": {
      source: "iana"
    },
    "application/vnd.zul": {
      source: "iana",
      extensions: ["zir", "zirz"]
    },
    "application/vnd.zzazz.deck+xml": {
      source: "iana",
      compressible: true,
      extensions: ["zaz"]
    },
    "application/voicexml+xml": {
      source: "iana",
      compressible: true,
      extensions: ["vxml"]
    },
    "application/voucher-cms+json": {
      source: "iana",
      compressible: true
    },
    "application/vq-rtcpxr": {
      source: "iana"
    },
    "application/wasm": {
      source: "iana",
      compressible: true,
      extensions: ["wasm"]
    },
    "application/watcherinfo+xml": {
      source: "iana",
      compressible: true,
      extensions: ["wif"]
    },
    "application/webpush-options+json": {
      source: "iana",
      compressible: true
    },
    "application/whoispp-query": {
      source: "iana"
    },
    "application/whoispp-response": {
      source: "iana"
    },
    "application/widget": {
      source: "iana",
      extensions: ["wgt"]
    },
    "application/winhlp": {
      source: "apache",
      extensions: ["hlp"]
    },
    "application/wita": {
      source: "iana"
    },
    "application/wordperfect5.1": {
      source: "iana"
    },
    "application/wsdl+xml": {
      source: "iana",
      compressible: true,
      extensions: ["wsdl"]
    },
    "application/wspolicy+xml": {
      source: "iana",
      compressible: true,
      extensions: ["wspolicy"]
    },
    "application/x-7z-compressed": {
      source: "apache",
      compressible: false,
      extensions: ["7z"]
    },
    "application/x-abiword": {
      source: "apache",
      extensions: ["abw"]
    },
    "application/x-ace-compressed": {
      source: "apache",
      extensions: ["ace"]
    },
    "application/x-amf": {
      source: "apache"
    },
    "application/x-apple-diskimage": {
      source: "apache",
      extensions: ["dmg"]
    },
    "application/x-arj": {
      compressible: false,
      extensions: ["arj"]
    },
    "application/x-authorware-bin": {
      source: "apache",
      extensions: ["aab", "x32", "u32", "vox"]
    },
    "application/x-authorware-map": {
      source: "apache",
      extensions: ["aam"]
    },
    "application/x-authorware-seg": {
      source: "apache",
      extensions: ["aas"]
    },
    "application/x-bcpio": {
      source: "apache",
      extensions: ["bcpio"]
    },
    "application/x-bdoc": {
      compressible: false,
      extensions: ["bdoc"]
    },
    "application/x-bittorrent": {
      source: "apache",
      extensions: ["torrent"]
    },
    "application/x-blorb": {
      source: "apache",
      extensions: ["blb", "blorb"]
    },
    "application/x-bzip": {
      source: "apache",
      compressible: false,
      extensions: ["bz"]
    },
    "application/x-bzip2": {
      source: "apache",
      compressible: false,
      extensions: ["bz2", "boz"]
    },
    "application/x-cbr": {
      source: "apache",
      extensions: ["cbr", "cba", "cbt", "cbz", "cb7"]
    },
    "application/x-cdlink": {
      source: "apache",
      extensions: ["vcd"]
    },
    "application/x-cfs-compressed": {
      source: "apache",
      extensions: ["cfs"]
    },
    "application/x-chat": {
      source: "apache",
      extensions: ["chat"]
    },
    "application/x-chess-pgn": {
      source: "apache",
      extensions: ["pgn"]
    },
    "application/x-chrome-extension": {
      extensions: ["crx"]
    },
    "application/x-cocoa": {
      source: "nginx",
      extensions: ["cco"]
    },
    "application/x-compress": {
      source: "apache"
    },
    "application/x-conference": {
      source: "apache",
      extensions: ["nsc"]
    },
    "application/x-cpio": {
      source: "apache",
      extensions: ["cpio"]
    },
    "application/x-csh": {
      source: "apache",
      extensions: ["csh"]
    },
    "application/x-deb": {
      compressible: false
    },
    "application/x-debian-package": {
      source: "apache",
      extensions: ["deb", "udeb"]
    },
    "application/x-dgc-compressed": {
      source: "apache",
      extensions: ["dgc"]
    },
    "application/x-director": {
      source: "apache",
      extensions: ["dir", "dcr", "dxr", "cst", "cct", "cxt", "w3d", "fgd", "swa"]
    },
    "application/x-doom": {
      source: "apache",
      extensions: ["wad"]
    },
    "application/x-dtbncx+xml": {
      source: "apache",
      compressible: true,
      extensions: ["ncx"]
    },
    "application/x-dtbook+xml": {
      source: "apache",
      compressible: true,
      extensions: ["dtb"]
    },
    "application/x-dtbresource+xml": {
      source: "apache",
      compressible: true,
      extensions: ["res"]
    },
    "application/x-dvi": {
      source: "apache",
      compressible: false,
      extensions: ["dvi"]
    },
    "application/x-envoy": {
      source: "apache",
      extensions: ["evy"]
    },
    "application/x-eva": {
      source: "apache",
      extensions: ["eva"]
    },
    "application/x-font-bdf": {
      source: "apache",
      extensions: ["bdf"]
    },
    "application/x-font-dos": {
      source: "apache"
    },
    "application/x-font-framemaker": {
      source: "apache"
    },
    "application/x-font-ghostscript": {
      source: "apache",
      extensions: ["gsf"]
    },
    "application/x-font-libgrx": {
      source: "apache"
    },
    "application/x-font-linux-psf": {
      source: "apache",
      extensions: ["psf"]
    },
    "application/x-font-pcf": {
      source: "apache",
      extensions: ["pcf"]
    },
    "application/x-font-snf": {
      source: "apache",
      extensions: ["snf"]
    },
    "application/x-font-speedo": {
      source: "apache"
    },
    "application/x-font-sunos-news": {
      source: "apache"
    },
    "application/x-font-type1": {
      source: "apache",
      extensions: ["pfa", "pfb", "pfm", "afm"]
    },
    "application/x-font-vfont": {
      source: "apache"
    },
    "application/x-freearc": {
      source: "apache",
      extensions: ["arc"]
    },
    "application/x-futuresplash": {
      source: "apache",
      extensions: ["spl"]
    },
    "application/x-gca-compressed": {
      source: "apache",
      extensions: ["gca"]
    },
    "application/x-glulx": {
      source: "apache",
      extensions: ["ulx"]
    },
    "application/x-gnumeric": {
      source: "apache",
      extensions: ["gnumeric"]
    },
    "application/x-gramps-xml": {
      source: "apache",
      extensions: ["gramps"]
    },
    "application/x-gtar": {
      source: "apache",
      extensions: ["gtar"]
    },
    "application/x-gzip": {
      source: "apache"
    },
    "application/x-hdf": {
      source: "apache",
      extensions: ["hdf"]
    },
    "application/x-httpd-php": {
      compressible: true,
      extensions: ["php"]
    },
    "application/x-install-instructions": {
      source: "apache",
      extensions: ["install"]
    },
    "application/x-iso9660-image": {
      source: "apache",
      extensions: ["iso"]
    },
    "application/x-iwork-keynote-sffkey": {
      extensions: ["key"]
    },
    "application/x-iwork-numbers-sffnumbers": {
      extensions: ["numbers"]
    },
    "application/x-iwork-pages-sffpages": {
      extensions: ["pages"]
    },
    "application/x-java-archive-diff": {
      source: "nginx",
      extensions: ["jardiff"]
    },
    "application/x-java-jnlp-file": {
      source: "apache",
      compressible: false,
      extensions: ["jnlp"]
    },
    "application/x-javascript": {
      compressible: true
    },
    "application/x-keepass2": {
      extensions: ["kdbx"]
    },
    "application/x-latex": {
      source: "apache",
      compressible: false,
      extensions: ["latex"]
    },
    "application/x-lua-bytecode": {
      extensions: ["luac"]
    },
    "application/x-lzh-compressed": {
      source: "apache",
      extensions: ["lzh", "lha"]
    },
    "application/x-makeself": {
      source: "nginx",
      extensions: ["run"]
    },
    "application/x-mie": {
      source: "apache",
      extensions: ["mie"]
    },
    "application/x-mobipocket-ebook": {
      source: "apache",
      extensions: ["prc", "mobi"]
    },
    "application/x-mpegurl": {
      compressible: false
    },
    "application/x-ms-application": {
      source: "apache",
      extensions: ["application"]
    },
    "application/x-ms-shortcut": {
      source: "apache",
      extensions: ["lnk"]
    },
    "application/x-ms-wmd": {
      source: "apache",
      extensions: ["wmd"]
    },
    "application/x-ms-wmz": {
      source: "apache",
      extensions: ["wmz"]
    },
    "application/x-ms-xbap": {
      source: "apache",
      extensions: ["xbap"]
    },
    "application/x-msaccess": {
      source: "apache",
      extensions: ["mdb"]
    },
    "application/x-msbinder": {
      source: "apache",
      extensions: ["obd"]
    },
    "application/x-mscardfile": {
      source: "apache",
      extensions: ["crd"]
    },
    "application/x-msclip": {
      source: "apache",
      extensions: ["clp"]
    },
    "application/x-msdos-program": {
      extensions: ["exe"]
    },
    "application/x-msdownload": {
      source: "apache",
      extensions: ["exe", "dll", "com", "bat", "msi"]
    },
    "application/x-msmediaview": {
      source: "apache",
      extensions: ["mvb", "m13", "m14"]
    },
    "application/x-msmetafile": {
      source: "apache",
      extensions: ["wmf", "wmz", "emf", "emz"]
    },
    "application/x-msmoney": {
      source: "apache",
      extensions: ["mny"]
    },
    "application/x-mspublisher": {
      source: "apache",
      extensions: ["pub"]
    },
    "application/x-msschedule": {
      source: "apache",
      extensions: ["scd"]
    },
    "application/x-msterminal": {
      source: "apache",
      extensions: ["trm"]
    },
    "application/x-mswrite": {
      source: "apache",
      extensions: ["wri"]
    },
    "application/x-netcdf": {
      source: "apache",
      extensions: ["nc", "cdf"]
    },
    "application/x-ns-proxy-autoconfig": {
      compressible: true,
      extensions: ["pac"]
    },
    "application/x-nzb": {
      source: "apache",
      extensions: ["nzb"]
    },
    "application/x-perl": {
      source: "nginx",
      extensions: ["pl", "pm"]
    },
    "application/x-pilot": {
      source: "nginx",
      extensions: ["prc", "pdb"]
    },
    "application/x-pkcs12": {
      source: "apache",
      compressible: false,
      extensions: ["p12", "pfx"]
    },
    "application/x-pkcs7-certificates": {
      source: "apache",
      extensions: ["p7b", "spc"]
    },
    "application/x-pkcs7-certreqresp": {
      source: "apache",
      extensions: ["p7r"]
    },
    "application/x-pki-message": {
      source: "iana"
    },
    "application/x-rar-compressed": {
      source: "apache",
      compressible: false,
      extensions: ["rar"]
    },
    "application/x-redhat-package-manager": {
      source: "nginx",
      extensions: ["rpm"]
    },
    "application/x-research-info-systems": {
      source: "apache",
      extensions: ["ris"]
    },
    "application/x-sea": {
      source: "nginx",
      extensions: ["sea"]
    },
    "application/x-sh": {
      source: "apache",
      compressible: true,
      extensions: ["sh"]
    },
    "application/x-shar": {
      source: "apache",
      extensions: ["shar"]
    },
    "application/x-shockwave-flash": {
      source: "apache",
      compressible: false,
      extensions: ["swf"]
    },
    "application/x-silverlight-app": {
      source: "apache",
      extensions: ["xap"]
    },
    "application/x-sql": {
      source: "apache",
      extensions: ["sql"]
    },
    "application/x-stuffit": {
      source: "apache",
      compressible: false,
      extensions: ["sit"]
    },
    "application/x-stuffitx": {
      source: "apache",
      extensions: ["sitx"]
    },
    "application/x-subrip": {
      source: "apache",
      extensions: ["srt"]
    },
    "application/x-sv4cpio": {
      source: "apache",
      extensions: ["sv4cpio"]
    },
    "application/x-sv4crc": {
      source: "apache",
      extensions: ["sv4crc"]
    },
    "application/x-t3vm-image": {
      source: "apache",
      extensions: ["t3"]
    },
    "application/x-tads": {
      source: "apache",
      extensions: ["gam"]
    },
    "application/x-tar": {
      source: "apache",
      compressible: true,
      extensions: ["tar"]
    },
    "application/x-tcl": {
      source: "apache",
      extensions: ["tcl", "tk"]
    },
    "application/x-tex": {
      source: "apache",
      extensions: ["tex"]
    },
    "application/x-tex-tfm": {
      source: "apache",
      extensions: ["tfm"]
    },
    "application/x-texinfo": {
      source: "apache",
      extensions: ["texinfo", "texi"]
    },
    "application/x-tgif": {
      source: "apache",
      extensions: ["obj"]
    },
    "application/x-ustar": {
      source: "apache",
      extensions: ["ustar"]
    },
    "application/x-virtualbox-hdd": {
      compressible: true,
      extensions: ["hdd"]
    },
    "application/x-virtualbox-ova": {
      compressible: true,
      extensions: ["ova"]
    },
    "application/x-virtualbox-ovf": {
      compressible: true,
      extensions: ["ovf"]
    },
    "application/x-virtualbox-vbox": {
      compressible: true,
      extensions: ["vbox"]
    },
    "application/x-virtualbox-vbox-extpack": {
      compressible: false,
      extensions: ["vbox-extpack"]
    },
    "application/x-virtualbox-vdi": {
      compressible: true,
      extensions: ["vdi"]
    },
    "application/x-virtualbox-vhd": {
      compressible: true,
      extensions: ["vhd"]
    },
    "application/x-virtualbox-vmdk": {
      compressible: true,
      extensions: ["vmdk"]
    },
    "application/x-wais-source": {
      source: "apache",
      extensions: ["src"]
    },
    "application/x-web-app-manifest+json": {
      compressible: true,
      extensions: ["webapp"]
    },
    "application/x-www-form-urlencoded": {
      source: "iana",
      compressible: true
    },
    "application/x-x509-ca-cert": {
      source: "iana",
      extensions: ["der", "crt", "pem"]
    },
    "application/x-x509-ca-ra-cert": {
      source: "iana"
    },
    "application/x-x509-next-ca-cert": {
      source: "iana"
    },
    "application/x-xfig": {
      source: "apache",
      extensions: ["fig"]
    },
    "application/x-xliff+xml": {
      source: "apache",
      compressible: true,
      extensions: ["xlf"]
    },
    "application/x-xpinstall": {
      source: "apache",
      compressible: false,
      extensions: ["xpi"]
    },
    "application/x-xz": {
      source: "apache",
      extensions: ["xz"]
    },
    "application/x-zmachine": {
      source: "apache",
      extensions: ["z1", "z2", "z3", "z4", "z5", "z6", "z7", "z8"]
    },
    "application/x400-bp": {
      source: "iana"
    },
    "application/xacml+xml": {
      source: "iana",
      compressible: true
    },
    "application/xaml+xml": {
      source: "apache",
      compressible: true,
      extensions: ["xaml"]
    },
    "application/xcap-att+xml": {
      source: "iana",
      compressible: true,
      extensions: ["xav"]
    },
    "application/xcap-caps+xml": {
      source: "iana",
      compressible: true,
      extensions: ["xca"]
    },
    "application/xcap-diff+xml": {
      source: "iana",
      compressible: true,
      extensions: ["xdf"]
    },
    "application/xcap-el+xml": {
      source: "iana",
      compressible: true,
      extensions: ["xel"]
    },
    "application/xcap-error+xml": {
      source: "iana",
      compressible: true
    },
    "application/xcap-ns+xml": {
      source: "iana",
      compressible: true,
      extensions: ["xns"]
    },
    "application/xcon-conference-info+xml": {
      source: "iana",
      compressible: true
    },
    "application/xcon-conference-info-diff+xml": {
      source: "iana",
      compressible: true
    },
    "application/xenc+xml": {
      source: "iana",
      compressible: true,
      extensions: ["xenc"]
    },
    "application/xhtml+xml": {
      source: "iana",
      compressible: true,
      extensions: ["xhtml", "xht"]
    },
    "application/xhtml-voice+xml": {
      source: "apache",
      compressible: true
    },
    "application/xliff+xml": {
      source: "iana",
      compressible: true,
      extensions: ["xlf"]
    },
    "application/xml": {
      source: "iana",
      compressible: true,
      extensions: ["xml", "xsl", "xsd", "rng"]
    },
    "application/xml-dtd": {
      source: "iana",
      compressible: true,
      extensions: ["dtd"]
    },
    "application/xml-external-parsed-entity": {
      source: "iana"
    },
    "application/xml-patch+xml": {
      source: "iana",
      compressible: true
    },
    "application/xmpp+xml": {
      source: "iana",
      compressible: true
    },
    "application/xop+xml": {
      source: "iana",
      compressible: true,
      extensions: ["xop"]
    },
    "application/xproc+xml": {
      source: "apache",
      compressible: true,
      extensions: ["xpl"]
    },
    "application/xslt+xml": {
      source: "iana",
      compressible: true,
      extensions: ["xsl", "xslt"]
    },
    "application/xspf+xml": {
      source: "apache",
      compressible: true,
      extensions: ["xspf"]
    },
    "application/xv+xml": {
      source: "iana",
      compressible: true,
      extensions: ["mxml", "xhvml", "xvml", "xvm"]
    },
    "application/yang": {
      source: "iana",
      extensions: ["yang"]
    },
    "application/yang-data+json": {
      source: "iana",
      compressible: true
    },
    "application/yang-data+xml": {
      source: "iana",
      compressible: true
    },
    "application/yang-patch+json": {
      source: "iana",
      compressible: true
    },
    "application/yang-patch+xml": {
      source: "iana",
      compressible: true
    },
    "application/yin+xml": {
      source: "iana",
      compressible: true,
      extensions: ["yin"]
    },
    "application/zip": {
      source: "iana",
      compressible: false,
      extensions: ["zip"]
    },
    "application/zlib": {
      source: "iana"
    },
    "application/zstd": {
      source: "iana"
    },
    "audio/1d-interleaved-parityfec": {
      source: "iana"
    },
    "audio/32kadpcm": {
      source: "iana"
    },
    "audio/3gpp": {
      source: "iana",
      compressible: false,
      extensions: ["3gpp"]
    },
    "audio/3gpp2": {
      source: "iana"
    },
    "audio/aac": {
      source: "iana"
    },
    "audio/ac3": {
      source: "iana"
    },
    "audio/adpcm": {
      source: "apache",
      extensions: ["adp"]
    },
    "audio/amr": {
      source: "iana",
      extensions: ["amr"]
    },
    "audio/amr-wb": {
      source: "iana"
    },
    "audio/amr-wb+": {
      source: "iana"
    },
    "audio/aptx": {
      source: "iana"
    },
    "audio/asc": {
      source: "iana"
    },
    "audio/atrac-advanced-lossless": {
      source: "iana"
    },
    "audio/atrac-x": {
      source: "iana"
    },
    "audio/atrac3": {
      source: "iana"
    },
    "audio/basic": {
      source: "iana",
      compressible: false,
      extensions: ["au", "snd"]
    },
    "audio/bv16": {
      source: "iana"
    },
    "audio/bv32": {
      source: "iana"
    },
    "audio/clearmode": {
      source: "iana"
    },
    "audio/cn": {
      source: "iana"
    },
    "audio/dat12": {
      source: "iana"
    },
    "audio/dls": {
      source: "iana"
    },
    "audio/dsr-es201108": {
      source: "iana"
    },
    "audio/dsr-es202050": {
      source: "iana"
    },
    "audio/dsr-es202211": {
      source: "iana"
    },
    "audio/dsr-es202212": {
      source: "iana"
    },
    "audio/dv": {
      source: "iana"
    },
    "audio/dvi4": {
      source: "iana"
    },
    "audio/eac3": {
      source: "iana"
    },
    "audio/encaprtp": {
      source: "iana"
    },
    "audio/evrc": {
      source: "iana"
    },
    "audio/evrc-qcp": {
      source: "iana"
    },
    "audio/evrc0": {
      source: "iana"
    },
    "audio/evrc1": {
      source: "iana"
    },
    "audio/evrcb": {
      source: "iana"
    },
    "audio/evrcb0": {
      source: "iana"
    },
    "audio/evrcb1": {
      source: "iana"
    },
    "audio/evrcnw": {
      source: "iana"
    },
    "audio/evrcnw0": {
      source: "iana"
    },
    "audio/evrcnw1": {
      source: "iana"
    },
    "audio/evrcwb": {
      source: "iana"
    },
    "audio/evrcwb0": {
      source: "iana"
    },
    "audio/evrcwb1": {
      source: "iana"
    },
    "audio/evs": {
      source: "iana"
    },
    "audio/flexfec": {
      source: "iana"
    },
    "audio/fwdred": {
      source: "iana"
    },
    "audio/g711-0": {
      source: "iana"
    },
    "audio/g719": {
      source: "iana"
    },
    "audio/g722": {
      source: "iana"
    },
    "audio/g7221": {
      source: "iana"
    },
    "audio/g723": {
      source: "iana"
    },
    "audio/g726-16": {
      source: "iana"
    },
    "audio/g726-24": {
      source: "iana"
    },
    "audio/g726-32": {
      source: "iana"
    },
    "audio/g726-40": {
      source: "iana"
    },
    "audio/g728": {
      source: "iana"
    },
    "audio/g729": {
      source: "iana"
    },
    "audio/g7291": {
      source: "iana"
    },
    "audio/g729d": {
      source: "iana"
    },
    "audio/g729e": {
      source: "iana"
    },
    "audio/gsm": {
      source: "iana"
    },
    "audio/gsm-efr": {
      source: "iana"
    },
    "audio/gsm-hr-08": {
      source: "iana"
    },
    "audio/ilbc": {
      source: "iana"
    },
    "audio/ip-mr_v2.5": {
      source: "iana"
    },
    "audio/isac": {
      source: "apache"
    },
    "audio/l16": {
      source: "iana"
    },
    "audio/l20": {
      source: "iana"
    },
    "audio/l24": {
      source: "iana",
      compressible: false
    },
    "audio/l8": {
      source: "iana"
    },
    "audio/lpc": {
      source: "iana"
    },
    "audio/melp": {
      source: "iana"
    },
    "audio/melp1200": {
      source: "iana"
    },
    "audio/melp2400": {
      source: "iana"
    },
    "audio/melp600": {
      source: "iana"
    },
    "audio/mhas": {
      source: "iana"
    },
    "audio/midi": {
      source: "apache",
      extensions: ["mid", "midi", "kar", "rmi"]
    },
    "audio/mobile-xmf": {
      source: "iana",
      extensions: ["mxmf"]
    },
    "audio/mp3": {
      compressible: false,
      extensions: ["mp3"]
    },
    "audio/mp4": {
      source: "iana",
      compressible: false,
      extensions: ["m4a", "mp4a"]
    },
    "audio/mp4a-latm": {
      source: "iana"
    },
    "audio/mpa": {
      source: "iana"
    },
    "audio/mpa-robust": {
      source: "iana"
    },
    "audio/mpeg": {
      source: "iana",
      compressible: false,
      extensions: ["mpga", "mp2", "mp2a", "mp3", "m2a", "m3a"]
    },
    "audio/mpeg4-generic": {
      source: "iana"
    },
    "audio/musepack": {
      source: "apache"
    },
    "audio/ogg": {
      source: "iana",
      compressible: false,
      extensions: ["oga", "ogg", "spx", "opus"]
    },
    "audio/opus": {
      source: "iana"
    },
    "audio/parityfec": {
      source: "iana"
    },
    "audio/pcma": {
      source: "iana"
    },
    "audio/pcma-wb": {
      source: "iana"
    },
    "audio/pcmu": {
      source: "iana"
    },
    "audio/pcmu-wb": {
      source: "iana"
    },
    "audio/prs.sid": {
      source: "iana"
    },
    "audio/qcelp": {
      source: "iana"
    },
    "audio/raptorfec": {
      source: "iana"
    },
    "audio/red": {
      source: "iana"
    },
    "audio/rtp-enc-aescm128": {
      source: "iana"
    },
    "audio/rtp-midi": {
      source: "iana"
    },
    "audio/rtploopback": {
      source: "iana"
    },
    "audio/rtx": {
      source: "iana"
    },
    "audio/s3m": {
      source: "apache",
      extensions: ["s3m"]
    },
    "audio/scip": {
      source: "iana"
    },
    "audio/silk": {
      source: "apache",
      extensions: ["sil"]
    },
    "audio/smv": {
      source: "iana"
    },
    "audio/smv-qcp": {
      source: "iana"
    },
    "audio/smv0": {
      source: "iana"
    },
    "audio/sofa": {
      source: "iana"
    },
    "audio/sp-midi": {
      source: "iana"
    },
    "audio/speex": {
      source: "iana"
    },
    "audio/t140c": {
      source: "iana"
    },
    "audio/t38": {
      source: "iana"
    },
    "audio/telephone-event": {
      source: "iana"
    },
    "audio/tetra_acelp": {
      source: "iana"
    },
    "audio/tetra_acelp_bb": {
      source: "iana"
    },
    "audio/tone": {
      source: "iana"
    },
    "audio/tsvcis": {
      source: "iana"
    },
    "audio/uemclip": {
      source: "iana"
    },
    "audio/ulpfec": {
      source: "iana"
    },
    "audio/usac": {
      source: "iana"
    },
    "audio/vdvi": {
      source: "iana"
    },
    "audio/vmr-wb": {
      source: "iana"
    },
    "audio/vnd.3gpp.iufp": {
      source: "iana"
    },
    "audio/vnd.4sb": {
      source: "iana"
    },
    "audio/vnd.audiokoz": {
      source: "iana"
    },
    "audio/vnd.celp": {
      source: "iana"
    },
    "audio/vnd.cisco.nse": {
      source: "iana"
    },
    "audio/vnd.cmles.radio-events": {
      source: "iana"
    },
    "audio/vnd.cns.anp1": {
      source: "iana"
    },
    "audio/vnd.cns.inf1": {
      source: "iana"
    },
    "audio/vnd.dece.audio": {
      source: "iana",
      extensions: ["uva", "uvva"]
    },
    "audio/vnd.digital-winds": {
      source: "iana",
      extensions: ["eol"]
    },
    "audio/vnd.dlna.adts": {
      source: "iana"
    },
    "audio/vnd.dolby.heaac.1": {
      source: "iana"
    },
    "audio/vnd.dolby.heaac.2": {
      source: "iana"
    },
    "audio/vnd.dolby.mlp": {
      source: "iana"
    },
    "audio/vnd.dolby.mps": {
      source: "iana"
    },
    "audio/vnd.dolby.pl2": {
      source: "iana"
    },
    "audio/vnd.dolby.pl2x": {
      source: "iana"
    },
    "audio/vnd.dolby.pl2z": {
      source: "iana"
    },
    "audio/vnd.dolby.pulse.1": {
      source: "iana"
    },
    "audio/vnd.dra": {
      source: "iana",
      extensions: ["dra"]
    },
    "audio/vnd.dts": {
      source: "iana",
      extensions: ["dts"]
    },
    "audio/vnd.dts.hd": {
      source: "iana",
      extensions: ["dtshd"]
    },
    "audio/vnd.dts.uhd": {
      source: "iana"
    },
    "audio/vnd.dvb.file": {
      source: "iana"
    },
    "audio/vnd.everad.plj": {
      source: "iana"
    },
    "audio/vnd.hns.audio": {
      source: "iana"
    },
    "audio/vnd.lucent.voice": {
      source: "iana",
      extensions: ["lvp"]
    },
    "audio/vnd.ms-playready.media.pya": {
      source: "iana",
      extensions: ["pya"]
    },
    "audio/vnd.nokia.mobile-xmf": {
      source: "iana"
    },
    "audio/vnd.nortel.vbk": {
      source: "iana"
    },
    "audio/vnd.nuera.ecelp4800": {
      source: "iana",
      extensions: ["ecelp4800"]
    },
    "audio/vnd.nuera.ecelp7470": {
      source: "iana",
      extensions: ["ecelp7470"]
    },
    "audio/vnd.nuera.ecelp9600": {
      source: "iana",
      extensions: ["ecelp9600"]
    },
    "audio/vnd.octel.sbc": {
      source: "iana"
    },
    "audio/vnd.presonus.multitrack": {
      source: "iana"
    },
    "audio/vnd.qcelp": {
      source: "iana"
    },
    "audio/vnd.rhetorex.32kadpcm": {
      source: "iana"
    },
    "audio/vnd.rip": {
      source: "iana",
      extensions: ["rip"]
    },
    "audio/vnd.rn-realaudio": {
      compressible: false
    },
    "audio/vnd.sealedmedia.softseal.mpeg": {
      source: "iana"
    },
    "audio/vnd.vmx.cvsd": {
      source: "iana"
    },
    "audio/vnd.wave": {
      compressible: false
    },
    "audio/vorbis": {
      source: "iana",
      compressible: false
    },
    "audio/vorbis-config": {
      source: "iana"
    },
    "audio/wav": {
      compressible: false,
      extensions: ["wav"]
    },
    "audio/wave": {
      compressible: false,
      extensions: ["wav"]
    },
    "audio/webm": {
      source: "apache",
      compressible: false,
      extensions: ["weba"]
    },
    "audio/x-aac": {
      source: "apache",
      compressible: false,
      extensions: ["aac"]
    },
    "audio/x-aiff": {
      source: "apache",
      extensions: ["aif", "aiff", "aifc"]
    },
    "audio/x-caf": {
      source: "apache",
      compressible: false,
      extensions: ["caf"]
    },
    "audio/x-flac": {
      source: "apache",
      extensions: ["flac"]
    },
    "audio/x-m4a": {
      source: "nginx",
      extensions: ["m4a"]
    },
    "audio/x-matroska": {
      source: "apache",
      extensions: ["mka"]
    },
    "audio/x-mpegurl": {
      source: "apache",
      extensions: ["m3u"]
    },
    "audio/x-ms-wax": {
      source: "apache",
      extensions: ["wax"]
    },
    "audio/x-ms-wma": {
      source: "apache",
      extensions: ["wma"]
    },
    "audio/x-pn-realaudio": {
      source: "apache",
      extensions: ["ram", "ra"]
    },
    "audio/x-pn-realaudio-plugin": {
      source: "apache",
      extensions: ["rmp"]
    },
    "audio/x-realaudio": {
      source: "nginx",
      extensions: ["ra"]
    },
    "audio/x-tta": {
      source: "apache"
    },
    "audio/x-wav": {
      source: "apache",
      extensions: ["wav"]
    },
    "audio/xm": {
      source: "apache",
      extensions: ["xm"]
    },
    "chemical/x-cdx": {
      source: "apache",
      extensions: ["cdx"]
    },
    "chemical/x-cif": {
      source: "apache",
      extensions: ["cif"]
    },
    "chemical/x-cmdf": {
      source: "apache",
      extensions: ["cmdf"]
    },
    "chemical/x-cml": {
      source: "apache",
      extensions: ["cml"]
    },
    "chemical/x-csml": {
      source: "apache",
      extensions: ["csml"]
    },
    "chemical/x-pdb": {
      source: "apache"
    },
    "chemical/x-xyz": {
      source: "apache",
      extensions: ["xyz"]
    },
    "font/collection": {
      source: "iana",
      extensions: ["ttc"]
    },
    "font/otf": {
      source: "iana",
      compressible: true,
      extensions: ["otf"]
    },
    "font/sfnt": {
      source: "iana"
    },
    "font/ttf": {
      source: "iana",
      compressible: true,
      extensions: ["ttf"]
    },
    "font/woff": {
      source: "iana",
      extensions: ["woff"]
    },
    "font/woff2": {
      source: "iana",
      extensions: ["woff2"]
    },
    "image/aces": {
      source: "iana",
      extensions: ["exr"]
    },
    "image/apng": {
      compressible: false,
      extensions: ["apng"]
    },
    "image/avci": {
      source: "iana",
      extensions: ["avci"]
    },
    "image/avcs": {
      source: "iana",
      extensions: ["avcs"]
    },
    "image/avif": {
      source: "iana",
      compressible: false,
      extensions: ["avif"]
    },
    "image/bmp": {
      source: "iana",
      compressible: true,
      extensions: ["bmp"]
    },
    "image/cgm": {
      source: "iana",
      extensions: ["cgm"]
    },
    "image/dicom-rle": {
      source: "iana",
      extensions: ["drle"]
    },
    "image/emf": {
      source: "iana",
      extensions: ["emf"]
    },
    "image/fits": {
      source: "iana",
      extensions: ["fits"]
    },
    "image/g3fax": {
      source: "iana",
      extensions: ["g3"]
    },
    "image/gif": {
      source: "iana",
      compressible: false,
      extensions: ["gif"]
    },
    "image/heic": {
      source: "iana",
      extensions: ["heic"]
    },
    "image/heic-sequence": {
      source: "iana",
      extensions: ["heics"]
    },
    "image/heif": {
      source: "iana",
      extensions: ["heif"]
    },
    "image/heif-sequence": {
      source: "iana",
      extensions: ["heifs"]
    },
    "image/hej2k": {
      source: "iana",
      extensions: ["hej2"]
    },
    "image/hsj2": {
      source: "iana",
      extensions: ["hsj2"]
    },
    "image/ief": {
      source: "iana",
      extensions: ["ief"]
    },
    "image/jls": {
      source: "iana",
      extensions: ["jls"]
    },
    "image/jp2": {
      source: "iana",
      compressible: false,
      extensions: ["jp2", "jpg2"]
    },
    "image/jpeg": {
      source: "iana",
      compressible: false,
      extensions: ["jpeg", "jpg", "jpe"]
    },
    "image/jph": {
      source: "iana",
      extensions: ["jph"]
    },
    "image/jphc": {
      source: "iana",
      extensions: ["jhc"]
    },
    "image/jpm": {
      source: "iana",
      compressible: false,
      extensions: ["jpm"]
    },
    "image/jpx": {
      source: "iana",
      compressible: false,
      extensions: ["jpx", "jpf"]
    },
    "image/jxr": {
      source: "iana",
      extensions: ["jxr"]
    },
    "image/jxra": {
      source: "iana",
      extensions: ["jxra"]
    },
    "image/jxrs": {
      source: "iana",
      extensions: ["jxrs"]
    },
    "image/jxs": {
      source: "iana",
      extensions: ["jxs"]
    },
    "image/jxsc": {
      source: "iana",
      extensions: ["jxsc"]
    },
    "image/jxsi": {
      source: "iana",
      extensions: ["jxsi"]
    },
    "image/jxss": {
      source: "iana",
      extensions: ["jxss"]
    },
    "image/ktx": {
      source: "iana",
      extensions: ["ktx"]
    },
    "image/ktx2": {
      source: "iana",
      extensions: ["ktx2"]
    },
    "image/naplps": {
      source: "iana"
    },
    "image/pjpeg": {
      compressible: false
    },
    "image/png": {
      source: "iana",
      compressible: false,
      extensions: ["png"]
    },
    "image/prs.btif": {
      source: "iana",
      extensions: ["btif"]
    },
    "image/prs.pti": {
      source: "iana",
      extensions: ["pti"]
    },
    "image/pwg-raster": {
      source: "iana"
    },
    "image/sgi": {
      source: "apache",
      extensions: ["sgi"]
    },
    "image/svg+xml": {
      source: "iana",
      compressible: true,
      extensions: ["svg", "svgz"]
    },
    "image/t38": {
      source: "iana",
      extensions: ["t38"]
    },
    "image/tiff": {
      source: "iana",
      compressible: false,
      extensions: ["tif", "tiff"]
    },
    "image/tiff-fx": {
      source: "iana",
      extensions: ["tfx"]
    },
    "image/vnd.adobe.photoshop": {
      source: "iana",
      compressible: true,
      extensions: ["psd"]
    },
    "image/vnd.airzip.accelerator.azv": {
      source: "iana",
      extensions: ["azv"]
    },
    "image/vnd.cns.inf2": {
      source: "iana"
    },
    "image/vnd.dece.graphic": {
      source: "iana",
      extensions: ["uvi", "uvvi", "uvg", "uvvg"]
    },
    "image/vnd.djvu": {
      source: "iana",
      extensions: ["djvu", "djv"]
    },
    "image/vnd.dvb.subtitle": {
      source: "iana",
      extensions: ["sub"]
    },
    "image/vnd.dwg": {
      source: "iana",
      extensions: ["dwg"]
    },
    "image/vnd.dxf": {
      source: "iana",
      extensions: ["dxf"]
    },
    "image/vnd.fastbidsheet": {
      source: "iana",
      extensions: ["fbs"]
    },
    "image/vnd.fpx": {
      source: "iana",
      extensions: ["fpx"]
    },
    "image/vnd.fst": {
      source: "iana",
      extensions: ["fst"]
    },
    "image/vnd.fujixerox.edmics-mmr": {
      source: "iana",
      extensions: ["mmr"]
    },
    "image/vnd.fujixerox.edmics-rlc": {
      source: "iana",
      extensions: ["rlc"]
    },
    "image/vnd.globalgraphics.pgb": {
      source: "iana"
    },
    "image/vnd.microsoft.icon": {
      source: "iana",
      compressible: true,
      extensions: ["ico"]
    },
    "image/vnd.mix": {
      source: "iana"
    },
    "image/vnd.mozilla.apng": {
      source: "iana"
    },
    "image/vnd.ms-dds": {
      compressible: true,
      extensions: ["dds"]
    },
    "image/vnd.ms-modi": {
      source: "iana",
      extensions: ["mdi"]
    },
    "image/vnd.ms-photo": {
      source: "apache",
      extensions: ["wdp"]
    },
    "image/vnd.net-fpx": {
      source: "iana",
      extensions: ["npx"]
    },
    "image/vnd.pco.b16": {
      source: "iana",
      extensions: ["b16"]
    },
    "image/vnd.radiance": {
      source: "iana"
    },
    "image/vnd.sealed.png": {
      source: "iana"
    },
    "image/vnd.sealedmedia.softseal.gif": {
      source: "iana"
    },
    "image/vnd.sealedmedia.softseal.jpg": {
      source: "iana"
    },
    "image/vnd.svf": {
      source: "iana"
    },
    "image/vnd.tencent.tap": {
      source: "iana",
      extensions: ["tap"]
    },
    "image/vnd.valve.source.texture": {
      source: "iana",
      extensions: ["vtf"]
    },
    "image/vnd.wap.wbmp": {
      source: "iana",
      extensions: ["wbmp"]
    },
    "image/vnd.xiff": {
      source: "iana",
      extensions: ["xif"]
    },
    "image/vnd.zbrush.pcx": {
      source: "iana",
      extensions: ["pcx"]
    },
    "image/webp": {
      source: "apache",
      extensions: ["webp"]
    },
    "image/wmf": {
      source: "iana",
      extensions: ["wmf"]
    },
    "image/x-3ds": {
      source: "apache",
      extensions: ["3ds"]
    },
    "image/x-cmu-raster": {
      source: "apache",
      extensions: ["ras"]
    },
    "image/x-cmx": {
      source: "apache",
      extensions: ["cmx"]
    },
    "image/x-freehand": {
      source: "apache",
      extensions: ["fh", "fhc", "fh4", "fh5", "fh7"]
    },
    "image/x-icon": {
      source: "apache",
      compressible: true,
      extensions: ["ico"]
    },
    "image/x-jng": {
      source: "nginx",
      extensions: ["jng"]
    },
    "image/x-mrsid-image": {
      source: "apache",
      extensions: ["sid"]
    },
    "image/x-ms-bmp": {
      source: "nginx",
      compressible: true,
      extensions: ["bmp"]
    },
    "image/x-pcx": {
      source: "apache",
      extensions: ["pcx"]
    },
    "image/x-pict": {
      source: "apache",
      extensions: ["pic", "pct"]
    },
    "image/x-portable-anymap": {
      source: "apache",
      extensions: ["pnm"]
    },
    "image/x-portable-bitmap": {
      source: "apache",
      extensions: ["pbm"]
    },
    "image/x-portable-graymap": {
      source: "apache",
      extensions: ["pgm"]
    },
    "image/x-portable-pixmap": {
      source: "apache",
      extensions: ["ppm"]
    },
    "image/x-rgb": {
      source: "apache",
      extensions: ["rgb"]
    },
    "image/x-tga": {
      source: "apache",
      extensions: ["tga"]
    },
    "image/x-xbitmap": {
      source: "apache",
      extensions: ["xbm"]
    },
    "image/x-xcf": {
      compressible: false
    },
    "image/x-xpixmap": {
      source: "apache",
      extensions: ["xpm"]
    },
    "image/x-xwindowdump": {
      source: "apache",
      extensions: ["xwd"]
    },
    "message/cpim": {
      source: "iana"
    },
    "message/delivery-status": {
      source: "iana"
    },
    "message/disposition-notification": {
      source: "iana",
      extensions: [
        "disposition-notification"
      ]
    },
    "message/external-body": {
      source: "iana"
    },
    "message/feedback-report": {
      source: "iana"
    },
    "message/global": {
      source: "iana",
      extensions: ["u8msg"]
    },
    "message/global-delivery-status": {
      source: "iana",
      extensions: ["u8dsn"]
    },
    "message/global-disposition-notification": {
      source: "iana",
      extensions: ["u8mdn"]
    },
    "message/global-headers": {
      source: "iana",
      extensions: ["u8hdr"]
    },
    "message/http": {
      source: "iana",
      compressible: false
    },
    "message/imdn+xml": {
      source: "iana",
      compressible: true
    },
    "message/news": {
      source: "iana"
    },
    "message/partial": {
      source: "iana",
      compressible: false
    },
    "message/rfc822": {
      source: "iana",
      compressible: true,
      extensions: ["eml", "mime"]
    },
    "message/s-http": {
      source: "iana"
    },
    "message/sip": {
      source: "iana"
    },
    "message/sipfrag": {
      source: "iana"
    },
    "message/tracking-status": {
      source: "iana"
    },
    "message/vnd.si.simp": {
      source: "iana"
    },
    "message/vnd.wfa.wsc": {
      source: "iana",
      extensions: ["wsc"]
    },
    "model/3mf": {
      source: "iana",
      extensions: ["3mf"]
    },
    "model/e57": {
      source: "iana"
    },
    "model/gltf+json": {
      source: "iana",
      compressible: true,
      extensions: ["gltf"]
    },
    "model/gltf-binary": {
      source: "iana",
      compressible: true,
      extensions: ["glb"]
    },
    "model/iges": {
      source: "iana",
      compressible: false,
      extensions: ["igs", "iges"]
    },
    "model/mesh": {
      source: "iana",
      compressible: false,
      extensions: ["msh", "mesh", "silo"]
    },
    "model/mtl": {
      source: "iana",
      extensions: ["mtl"]
    },
    "model/obj": {
      source: "iana",
      extensions: ["obj"]
    },
    "model/step": {
      source: "iana"
    },
    "model/step+xml": {
      source: "iana",
      compressible: true,
      extensions: ["stpx"]
    },
    "model/step+zip": {
      source: "iana",
      compressible: false,
      extensions: ["stpz"]
    },
    "model/step-xml+zip": {
      source: "iana",
      compressible: false,
      extensions: ["stpxz"]
    },
    "model/stl": {
      source: "iana",
      extensions: ["stl"]
    },
    "model/vnd.collada+xml": {
      source: "iana",
      compressible: true,
      extensions: ["dae"]
    },
    "model/vnd.dwf": {
      source: "iana",
      extensions: ["dwf"]
    },
    "model/vnd.flatland.3dml": {
      source: "iana"
    },
    "model/vnd.gdl": {
      source: "iana",
      extensions: ["gdl"]
    },
    "model/vnd.gs-gdl": {
      source: "apache"
    },
    "model/vnd.gs.gdl": {
      source: "iana"
    },
    "model/vnd.gtw": {
      source: "iana",
      extensions: ["gtw"]
    },
    "model/vnd.moml+xml": {
      source: "iana",
      compressible: true
    },
    "model/vnd.mts": {
      source: "iana",
      extensions: ["mts"]
    },
    "model/vnd.opengex": {
      source: "iana",
      extensions: ["ogex"]
    },
    "model/vnd.parasolid.transmit.binary": {
      source: "iana",
      extensions: ["x_b"]
    },
    "model/vnd.parasolid.transmit.text": {
      source: "iana",
      extensions: ["x_t"]
    },
    "model/vnd.pytha.pyox": {
      source: "iana"
    },
    "model/vnd.rosette.annotated-data-model": {
      source: "iana"
    },
    "model/vnd.sap.vds": {
      source: "iana",
      extensions: ["vds"]
    },
    "model/vnd.usdz+zip": {
      source: "iana",
      compressible: false,
      extensions: ["usdz"]
    },
    "model/vnd.valve.source.compiled-map": {
      source: "iana",
      extensions: ["bsp"]
    },
    "model/vnd.vtu": {
      source: "iana",
      extensions: ["vtu"]
    },
    "model/vrml": {
      source: "iana",
      compressible: false,
      extensions: ["wrl", "vrml"]
    },
    "model/x3d+binary": {
      source: "apache",
      compressible: false,
      extensions: ["x3db", "x3dbz"]
    },
    "model/x3d+fastinfoset": {
      source: "iana",
      extensions: ["x3db"]
    },
    "model/x3d+vrml": {
      source: "apache",
      compressible: false,
      extensions: ["x3dv", "x3dvz"]
    },
    "model/x3d+xml": {
      source: "iana",
      compressible: true,
      extensions: ["x3d", "x3dz"]
    },
    "model/x3d-vrml": {
      source: "iana",
      extensions: ["x3dv"]
    },
    "multipart/alternative": {
      source: "iana",
      compressible: false
    },
    "multipart/appledouble": {
      source: "iana"
    },
    "multipart/byteranges": {
      source: "iana"
    },
    "multipart/digest": {
      source: "iana"
    },
    "multipart/encrypted": {
      source: "iana",
      compressible: false
    },
    "multipart/form-data": {
      source: "iana",
      compressible: false
    },
    "multipart/header-set": {
      source: "iana"
    },
    "multipart/mixed": {
      source: "iana"
    },
    "multipart/multilingual": {
      source: "iana"
    },
    "multipart/parallel": {
      source: "iana"
    },
    "multipart/related": {
      source: "iana",
      compressible: false
    },
    "multipart/report": {
      source: "iana"
    },
    "multipart/signed": {
      source: "iana",
      compressible: false
    },
    "multipart/vnd.bint.med-plus": {
      source: "iana"
    },
    "multipart/voice-message": {
      source: "iana"
    },
    "multipart/x-mixed-replace": {
      source: "iana"
    },
    "text/1d-interleaved-parityfec": {
      source: "iana"
    },
    "text/cache-manifest": {
      source: "iana",
      compressible: true,
      extensions: ["appcache", "manifest"]
    },
    "text/calendar": {
      source: "iana",
      extensions: ["ics", "ifb"]
    },
    "text/calender": {
      compressible: true
    },
    "text/cmd": {
      compressible: true
    },
    "text/coffeescript": {
      extensions: ["coffee", "litcoffee"]
    },
    "text/cql": {
      source: "iana"
    },
    "text/cql-expression": {
      source: "iana"
    },
    "text/cql-identifier": {
      source: "iana"
    },
    "text/css": {
      source: "iana",
      charset: "UTF-8",
      compressible: true,
      extensions: ["css"]
    },
    "text/csv": {
      source: "iana",
      compressible: true,
      extensions: ["csv"]
    },
    "text/csv-schema": {
      source: "iana"
    },
    "text/directory": {
      source: "iana"
    },
    "text/dns": {
      source: "iana"
    },
    "text/ecmascript": {
      source: "iana"
    },
    "text/encaprtp": {
      source: "iana"
    },
    "text/enriched": {
      source: "iana"
    },
    "text/fhirpath": {
      source: "iana"
    },
    "text/flexfec": {
      source: "iana"
    },
    "text/fwdred": {
      source: "iana"
    },
    "text/gff3": {
      source: "iana"
    },
    "text/grammar-ref-list": {
      source: "iana"
    },
    "text/html": {
      source: "iana",
      compressible: true,
      extensions: ["html", "htm", "shtml"]
    },
    "text/jade": {
      extensions: ["jade"]
    },
    "text/javascript": {
      source: "iana",
      compressible: true
    },
    "text/jcr-cnd": {
      source: "iana"
    },
    "text/jsx": {
      compressible: true,
      extensions: ["jsx"]
    },
    "text/less": {
      compressible: true,
      extensions: ["less"]
    },
    "text/markdown": {
      source: "iana",
      compressible: true,
      extensions: ["markdown", "md"]
    },
    "text/mathml": {
      source: "nginx",
      extensions: ["mml"]
    },
    "text/mdx": {
      compressible: true,
      extensions: ["mdx"]
    },
    "text/mizar": {
      source: "iana"
    },
    "text/n3": {
      source: "iana",
      charset: "UTF-8",
      compressible: true,
      extensions: ["n3"]
    },
    "text/parameters": {
      source: "iana",
      charset: "UTF-8"
    },
    "text/parityfec": {
      source: "iana"
    },
    "text/plain": {
      source: "iana",
      compressible: true,
      extensions: ["txt", "text", "conf", "def", "list", "log", "in", "ini"]
    },
    "text/provenance-notation": {
      source: "iana",
      charset: "UTF-8"
    },
    "text/prs.fallenstein.rst": {
      source: "iana"
    },
    "text/prs.lines.tag": {
      source: "iana",
      extensions: ["dsc"]
    },
    "text/prs.prop.logic": {
      source: "iana"
    },
    "text/raptorfec": {
      source: "iana"
    },
    "text/red": {
      source: "iana"
    },
    "text/rfc822-headers": {
      source: "iana"
    },
    "text/richtext": {
      source: "iana",
      compressible: true,
      extensions: ["rtx"]
    },
    "text/rtf": {
      source: "iana",
      compressible: true,
      extensions: ["rtf"]
    },
    "text/rtp-enc-aescm128": {
      source: "iana"
    },
    "text/rtploopback": {
      source: "iana"
    },
    "text/rtx": {
      source: "iana"
    },
    "text/sgml": {
      source: "iana",
      extensions: ["sgml", "sgm"]
    },
    "text/shaclc": {
      source: "iana"
    },
    "text/shex": {
      source: "iana",
      extensions: ["shex"]
    },
    "text/slim": {
      extensions: ["slim", "slm"]
    },
    "text/spdx": {
      source: "iana",
      extensions: ["spdx"]
    },
    "text/strings": {
      source: "iana"
    },
    "text/stylus": {
      extensions: ["stylus", "styl"]
    },
    "text/t140": {
      source: "iana"
    },
    "text/tab-separated-values": {
      source: "iana",
      compressible: true,
      extensions: ["tsv"]
    },
    "text/troff": {
      source: "iana",
      extensions: ["t", "tr", "roff", "man", "me", "ms"]
    },
    "text/turtle": {
      source: "iana",
      charset: "UTF-8",
      extensions: ["ttl"]
    },
    "text/ulpfec": {
      source: "iana"
    },
    "text/uri-list": {
      source: "iana",
      compressible: true,
      extensions: ["uri", "uris", "urls"]
    },
    "text/vcard": {
      source: "iana",
      compressible: true,
      extensions: ["vcard"]
    },
    "text/vnd.a": {
      source: "iana"
    },
    "text/vnd.abc": {
      source: "iana"
    },
    "text/vnd.ascii-art": {
      source: "iana"
    },
    "text/vnd.curl": {
      source: "iana",
      extensions: ["curl"]
    },
    "text/vnd.curl.dcurl": {
      source: "apache",
      extensions: ["dcurl"]
    },
    "text/vnd.curl.mcurl": {
      source: "apache",
      extensions: ["mcurl"]
    },
    "text/vnd.curl.scurl": {
      source: "apache",
      extensions: ["scurl"]
    },
    "text/vnd.debian.copyright": {
      source: "iana",
      charset: "UTF-8"
    },
    "text/vnd.dmclientscript": {
      source: "iana"
    },
    "text/vnd.dvb.subtitle": {
      source: "iana",
      extensions: ["sub"]
    },
    "text/vnd.esmertec.theme-descriptor": {
      source: "iana",
      charset: "UTF-8"
    },
    "text/vnd.familysearch.gedcom": {
      source: "iana",
      extensions: ["ged"]
    },
    "text/vnd.ficlab.flt": {
      source: "iana"
    },
    "text/vnd.fly": {
      source: "iana",
      extensions: ["fly"]
    },
    "text/vnd.fmi.flexstor": {
      source: "iana",
      extensions: ["flx"]
    },
    "text/vnd.gml": {
      source: "iana"
    },
    "text/vnd.graphviz": {
      source: "iana",
      extensions: ["gv"]
    },
    "text/vnd.hans": {
      source: "iana"
    },
    "text/vnd.hgl": {
      source: "iana"
    },
    "text/vnd.in3d.3dml": {
      source: "iana",
      extensions: ["3dml"]
    },
    "text/vnd.in3d.spot": {
      source: "iana",
      extensions: ["spot"]
    },
    "text/vnd.iptc.newsml": {
      source: "iana"
    },
    "text/vnd.iptc.nitf": {
      source: "iana"
    },
    "text/vnd.latex-z": {
      source: "iana"
    },
    "text/vnd.motorola.reflex": {
      source: "iana"
    },
    "text/vnd.ms-mediapackage": {
      source: "iana"
    },
    "text/vnd.net2phone.commcenter.command": {
      source: "iana"
    },
    "text/vnd.radisys.msml-basic-layout": {
      source: "iana"
    },
    "text/vnd.senx.warpscript": {
      source: "iana"
    },
    "text/vnd.si.uricatalogue": {
      source: "iana"
    },
    "text/vnd.sosi": {
      source: "iana"
    },
    "text/vnd.sun.j2me.app-descriptor": {
      source: "iana",
      charset: "UTF-8",
      extensions: ["jad"]
    },
    "text/vnd.trolltech.linguist": {
      source: "iana",
      charset: "UTF-8"
    },
    "text/vnd.wap.si": {
      source: "iana"
    },
    "text/vnd.wap.sl": {
      source: "iana"
    },
    "text/vnd.wap.wml": {
      source: "iana",
      extensions: ["wml"]
    },
    "text/vnd.wap.wmlscript": {
      source: "iana",
      extensions: ["wmls"]
    },
    "text/vtt": {
      source: "iana",
      charset: "UTF-8",
      compressible: true,
      extensions: ["vtt"]
    },
    "text/x-asm": {
      source: "apache",
      extensions: ["s", "asm"]
    },
    "text/x-c": {
      source: "apache",
      extensions: ["c", "cc", "cxx", "cpp", "h", "hh", "dic"]
    },
    "text/x-component": {
      source: "nginx",
      extensions: ["htc"]
    },
    "text/x-fortran": {
      source: "apache",
      extensions: ["f", "for", "f77", "f90"]
    },
    "text/x-gwt-rpc": {
      compressible: true
    },
    "text/x-handlebars-template": {
      extensions: ["hbs"]
    },
    "text/x-java-source": {
      source: "apache",
      extensions: ["java"]
    },
    "text/x-jquery-tmpl": {
      compressible: true
    },
    "text/x-lua": {
      extensions: ["lua"]
    },
    "text/x-markdown": {
      compressible: true,
      extensions: ["mkd"]
    },
    "text/x-nfo": {
      source: "apache",
      extensions: ["nfo"]
    },
    "text/x-opml": {
      source: "apache",
      extensions: ["opml"]
    },
    "text/x-org": {
      compressible: true,
      extensions: ["org"]
    },
    "text/x-pascal": {
      source: "apache",
      extensions: ["p", "pas"]
    },
    "text/x-processing": {
      compressible: true,
      extensions: ["pde"]
    },
    "text/x-sass": {
      extensions: ["sass"]
    },
    "text/x-scss": {
      extensions: ["scss"]
    },
    "text/x-setext": {
      source: "apache",
      extensions: ["etx"]
    },
    "text/x-sfv": {
      source: "apache",
      extensions: ["sfv"]
    },
    "text/x-suse-ymp": {
      compressible: true,
      extensions: ["ymp"]
    },
    "text/x-uuencode": {
      source: "apache",
      extensions: ["uu"]
    },
    "text/x-vcalendar": {
      source: "apache",
      extensions: ["vcs"]
    },
    "text/x-vcard": {
      source: "apache",
      extensions: ["vcf"]
    },
    "text/xml": {
      source: "iana",
      compressible: true,
      extensions: ["xml"]
    },
    "text/xml-external-parsed-entity": {
      source: "iana"
    },
    "text/yaml": {
      compressible: true,
      extensions: ["yaml", "yml"]
    },
    "video/1d-interleaved-parityfec": {
      source: "iana"
    },
    "video/3gpp": {
      source: "iana",
      extensions: ["3gp", "3gpp"]
    },
    "video/3gpp-tt": {
      source: "iana"
    },
    "video/3gpp2": {
      source: "iana",
      extensions: ["3g2"]
    },
    "video/av1": {
      source: "iana"
    },
    "video/bmpeg": {
      source: "iana"
    },
    "video/bt656": {
      source: "iana"
    },
    "video/celb": {
      source: "iana"
    },
    "video/dv": {
      source: "iana"
    },
    "video/encaprtp": {
      source: "iana"
    },
    "video/ffv1": {
      source: "iana"
    },
    "video/flexfec": {
      source: "iana"
    },
    "video/h261": {
      source: "iana",
      extensions: ["h261"]
    },
    "video/h263": {
      source: "iana",
      extensions: ["h263"]
    },
    "video/h263-1998": {
      source: "iana"
    },
    "video/h263-2000": {
      source: "iana"
    },
    "video/h264": {
      source: "iana",
      extensions: ["h264"]
    },
    "video/h264-rcdo": {
      source: "iana"
    },
    "video/h264-svc": {
      source: "iana"
    },
    "video/h265": {
      source: "iana"
    },
    "video/iso.segment": {
      source: "iana",
      extensions: ["m4s"]
    },
    "video/jpeg": {
      source: "iana",
      extensions: ["jpgv"]
    },
    "video/jpeg2000": {
      source: "iana"
    },
    "video/jpm": {
      source: "apache",
      extensions: ["jpm", "jpgm"]
    },
    "video/jxsv": {
      source: "iana"
    },
    "video/mj2": {
      source: "iana",
      extensions: ["mj2", "mjp2"]
    },
    "video/mp1s": {
      source: "iana"
    },
    "video/mp2p": {
      source: "iana"
    },
    "video/mp2t": {
      source: "iana",
      extensions: ["ts"]
    },
    "video/mp4": {
      source: "iana",
      compressible: false,
      extensions: ["mp4", "mp4v", "mpg4"]
    },
    "video/mp4v-es": {
      source: "iana"
    },
    "video/mpeg": {
      source: "iana",
      compressible: false,
      extensions: ["mpeg", "mpg", "mpe", "m1v", "m2v"]
    },
    "video/mpeg4-generic": {
      source: "iana"
    },
    "video/mpv": {
      source: "iana"
    },
    "video/nv": {
      source: "iana"
    },
    "video/ogg": {
      source: "iana",
      compressible: false,
      extensions: ["ogv"]
    },
    "video/parityfec": {
      source: "iana"
    },
    "video/pointer": {
      source: "iana"
    },
    "video/quicktime": {
      source: "iana",
      compressible: false,
      extensions: ["qt", "mov"]
    },
    "video/raptorfec": {
      source: "iana"
    },
    "video/raw": {
      source: "iana"
    },
    "video/rtp-enc-aescm128": {
      source: "iana"
    },
    "video/rtploopback": {
      source: "iana"
    },
    "video/rtx": {
      source: "iana"
    },
    "video/scip": {
      source: "iana"
    },
    "video/smpte291": {
      source: "iana"
    },
    "video/smpte292m": {
      source: "iana"
    },
    "video/ulpfec": {
      source: "iana"
    },
    "video/vc1": {
      source: "iana"
    },
    "video/vc2": {
      source: "iana"
    },
    "video/vnd.cctv": {
      source: "iana"
    },
    "video/vnd.dece.hd": {
      source: "iana",
      extensions: ["uvh", "uvvh"]
    },
    "video/vnd.dece.mobile": {
      source: "iana",
      extensions: ["uvm", "uvvm"]
    },
    "video/vnd.dece.mp4": {
      source: "iana"
    },
    "video/vnd.dece.pd": {
      source: "iana",
      extensions: ["uvp", "uvvp"]
    },
    "video/vnd.dece.sd": {
      source: "iana",
      extensions: ["uvs", "uvvs"]
    },
    "video/vnd.dece.video": {
      source: "iana",
      extensions: ["uvv", "uvvv"]
    },
    "video/vnd.directv.mpeg": {
      source: "iana"
    },
    "video/vnd.directv.mpeg-tts": {
      source: "iana"
    },
    "video/vnd.dlna.mpeg-tts": {
      source: "iana"
    },
    "video/vnd.dvb.file": {
      source: "iana",
      extensions: ["dvb"]
    },
    "video/vnd.fvt": {
      source: "iana",
      extensions: ["fvt"]
    },
    "video/vnd.hns.video": {
      source: "iana"
    },
    "video/vnd.iptvforum.1dparityfec-1010": {
      source: "iana"
    },
    "video/vnd.iptvforum.1dparityfec-2005": {
      source: "iana"
    },
    "video/vnd.iptvforum.2dparityfec-1010": {
      source: "iana"
    },
    "video/vnd.iptvforum.2dparityfec-2005": {
      source: "iana"
    },
    "video/vnd.iptvforum.ttsavc": {
      source: "iana"
    },
    "video/vnd.iptvforum.ttsmpeg2": {
      source: "iana"
    },
    "video/vnd.motorola.video": {
      source: "iana"
    },
    "video/vnd.motorola.videop": {
      source: "iana"
    },
    "video/vnd.mpegurl": {
      source: "iana",
      extensions: ["mxu", "m4u"]
    },
    "video/vnd.ms-playready.media.pyv": {
      source: "iana",
      extensions: ["pyv"]
    },
    "video/vnd.nokia.interleaved-multimedia": {
      source: "iana"
    },
    "video/vnd.nokia.mp4vr": {
      source: "iana"
    },
    "video/vnd.nokia.videovoip": {
      source: "iana"
    },
    "video/vnd.objectvideo": {
      source: "iana"
    },
    "video/vnd.radgamettools.bink": {
      source: "iana"
    },
    "video/vnd.radgamettools.smacker": {
      source: "iana"
    },
    "video/vnd.sealed.mpeg1": {
      source: "iana"
    },
    "video/vnd.sealed.mpeg4": {
      source: "iana"
    },
    "video/vnd.sealed.swf": {
      source: "iana"
    },
    "video/vnd.sealedmedia.softseal.mov": {
      source: "iana"
    },
    "video/vnd.uvvu.mp4": {
      source: "iana",
      extensions: ["uvu", "uvvu"]
    },
    "video/vnd.vivo": {
      source: "iana",
      extensions: ["viv"]
    },
    "video/vnd.youtube.yt": {
      source: "iana"
    },
    "video/vp8": {
      source: "iana"
    },
    "video/vp9": {
      source: "iana"
    },
    "video/webm": {
      source: "apache",
      compressible: false,
      extensions: ["webm"]
    },
    "video/x-f4v": {
      source: "apache",
      extensions: ["f4v"]
    },
    "video/x-fli": {
      source: "apache",
      extensions: ["fli"]
    },
    "video/x-flv": {
      source: "apache",
      compressible: false,
      extensions: ["flv"]
    },
    "video/x-m4v": {
      source: "apache",
      extensions: ["m4v"]
    },
    "video/x-matroska": {
      source: "apache",
      compressible: false,
      extensions: ["mkv", "mk3d", "mks"]
    },
    "video/x-mng": {
      source: "apache",
      extensions: ["mng"]
    },
    "video/x-ms-asf": {
      source: "apache",
      extensions: ["asf", "asx"]
    },
    "video/x-ms-vob": {
      source: "apache",
      extensions: ["vob"]
    },
    "video/x-ms-wm": {
      source: "apache",
      extensions: ["wm"]
    },
    "video/x-ms-wmv": {
      source: "apache",
      compressible: false,
      extensions: ["wmv"]
    },
    "video/x-ms-wmx": {
      source: "apache",
      extensions: ["wmx"]
    },
    "video/x-ms-wvx": {
      source: "apache",
      extensions: ["wvx"]
    },
    "video/x-msvideo": {
      source: "apache",
      extensions: ["avi"]
    },
    "video/x-sgi-movie": {
      source: "apache",
      extensions: ["movie"]
    },
    "video/x-smv": {
      source: "apache",
      extensions: ["smv"]
    },
    "x-conference/x-cooltalk": {
      source: "apache",
      extensions: ["ice"]
    },
    "x-shader/x-fragment": {
      compressible: true
    },
    "x-shader/x-vertex": {
      compressible: true
    }
  };
});

// node_modules/mime-db/index.js
var require_mime_db = __commonJS((exports, module) => {
  /*!
   * mime-db
   * Copyright(c) 2014 Jonathan Ong
   * Copyright(c) 2015-2022 Douglas Christopher Wilson
   * MIT Licensed
   */
  module.exports = require_db();
});

// node_modules/ext-list/index.js
var require_ext_list = __commonJS((exports, module) => {
  var mimeDb = require_mime_db();
  module.exports = function() {
    var ret = {};
    Object.keys(mimeDb).forEach(function(x) {
      var val = mimeDb[x];
      if (val.extensions && val.extensions.length > 0) {
        val.extensions.forEach(function(y) {
          ret[y] = x;
        });
      }
    });
    return ret;
  };
});

// node_modules/sort-keys/node_modules/is-plain-obj/index.js
var require_is_plain_obj2 = __commonJS((exports, module) => {
  var toString = Object.prototype.toString;
  module.exports = function(x) {
    var prototype;
    return toString.call(x) === "[object Object]" && (prototype = Object.getPrototypeOf(x), prototype === null || prototype === Object.getPrototypeOf({}));
  };
});

// node_modules/sort-keys/index.js
var require_sort_keys2 = __commonJS((exports, module) => {
  var isPlainObj = require_is_plain_obj2();
  module.exports = function(obj, opts) {
    if (!isPlainObj(obj)) {
      throw new TypeError("Expected a plain object");
    }
    opts = opts || {};
    if (typeof opts === "function") {
      opts = { compare: opts };
    }
    var deep = opts.deep;
    var seenInput = [];
    var seenOutput = [];
    var sortKeys = function(x) {
      var seenIndex = seenInput.indexOf(x);
      if (seenIndex !== -1) {
        return seenOutput[seenIndex];
      }
      var ret = {};
      var keys = Object.keys(x).sort(opts.compare);
      seenInput.push(x);
      seenOutput.push(ret);
      for (var i = 0;i < keys.length; i++) {
        var key = keys[i];
        var val = x[key];
        ret[key] = deep && isPlainObj(val) ? sortKeys(val) : val;
      }
      return ret;
    };
    return sortKeys(obj);
  };
});

// node_modules/sort-keys-length/index.js
var require_sort_keys_length = __commonJS((exports, module) => {
  var sortKeys = require_sort_keys2();
  exports.desc = function(obj) {
    return sortKeys(obj, function(a, b) {
      return b.length - a.length;
    });
  };
  exports.asc = function(obj) {
    return sortKeys(obj, function(a, b) {
      return a.length - b.length;
    });
  };
});

// node_modules/ext-name/index.js
var require_ext_name = __commonJS((exports, module) => {
  var extList = require_ext_list();
  var sortKeysLength = require_sort_keys_length();
  module.exports = (str) => {
    const obj = sortKeysLength.desc(extList());
    const exts = Object.keys(obj).filter((x) => str.endsWith(x));
    if (exts.length === 0) {
      return [];
    }
    return exts.map((x) => ({
      ext: x,
      mime: obj[x]
    }));
  };
  module.exports.mime = (str) => {
    const obj = sortKeysLength.desc(extList());
    const exts = Object.keys(obj).filter((x) => obj[x] === str);
    if (exts.length === 0) {
      return [];
    }
    return exts.map((x) => ({
      ext: x,
      mime: obj[x]
    }));
  };
});

// node_modules/download/index.js
var require_download = __commonJS((exports, module) => {
  var fs = import.meta.require("fs");
  var path3 = import.meta.require("path");
  var url = import.meta.require("url");
  var caw = require_caw();
  var contentDisposition = require_content_disposition();
  var archiveType = require_archive_type();
  var decompress = require_decompress();
  var filenamify = require_filenamify();
  var getStream = require_get_stream2();
  var got = require_got();
  var makeDir = require_make_dir();
  var pify = require_pify2();
  var pEvent = require_p_event();
  var fileType = require_file_type6();
  var extName = require_ext_name();
  var fsP = pify(fs);
  var filenameFromPath = (res) => path3.basename(url.parse(res.requestUrl).pathname);
  var getExtFromMime = (res) => {
    const header = res.headers["content-type"];
    if (!header) {
      return null;
    }
    const exts = extName.mime(header);
    if (exts.length !== 1) {
      return null;
    }
    return exts[0].ext;
  };
  var getFilename = (res, data) => {
    const header = res.headers["content-disposition"];
    if (header) {
      const parsed = contentDisposition.parse(header);
      if (parsed.parameters && parsed.parameters.filename) {
        return parsed.parameters.filename;
      }
    }
    let filename = filenameFromPath(res);
    if (!path3.extname(filename)) {
      const ext = (fileType(data) || {}).ext || getExtFromMime(res);
      if (ext) {
        filename = `${filename}.${ext}`;
      }
    }
    return filename;
  };
  var getProtocolFromUri = (uri) => {
    let { protocol } = url.parse(uri);
    if (protocol) {
      protocol = protocol.slice(0, -1);
    }
    return protocol;
  };
  module.exports = (uri, output, opts) => {
    if (typeof output === "object") {
      opts = output;
      output = null;
    }
    const protocol = getProtocolFromUri(uri);
    opts = Object.assign({
      encoding: null,
      rejectUnauthorized: process.env.npm_config_strict_ssl !== "false"
    }, opts);
    const agent = caw(opts.proxy, { protocol });
    const stream2 = got.stream(uri, Object.assign({ agent }, opts)).on("redirect", (response, nextOptions) => {
      const redirectProtocol = getProtocolFromUri(nextOptions.href);
      if (redirectProtocol && redirectProtocol !== protocol) {
        nextOptions.agent = caw(opts.proxy, { protocol: redirectProtocol });
      }
    });
    const promise2 = pEvent(stream2, "response").then((res) => {
      const encoding = opts.encoding === null ? "buffer" : opts.encoding;
      return Promise.all([getStream(stream2, { encoding }), res]);
    }).then((result) => {
      const [data, res] = result;
      if (!output) {
        return opts.extract && archiveType(data) ? decompress(data, opts) : data;
      }
      const filename = opts.filename || filenamify(getFilename(res, data));
      const outputFilepath = path3.join(output, filename);
      if (opts.extract && archiveType(data)) {
        return decompress(data, path3.dirname(outputFilepath), opts);
      }
      return makeDir(path3.dirname(outputFilepath)).then(() => fsP.writeFile(outputFilepath, data)).then(() => data);
    });
    stream2.then = promise2.then.bind(promise2);
    stream2.catch = promise2.catch.bind(promise2);
    return stream2;
  };
});

// node_modules/git-clone/index.js
var require_git_clone = __commonJS((exports, module) => {
  var spawn = import.meta.require("child_process").spawn;
  module.exports = function(repo, targetPath, opts, cb) {
    if (typeof opts === "function") {
      cb = opts;
      opts = null;
    }
    opts = opts || {};
    var git = opts.git || "git";
    var args = ["clone"];
    if (opts.shallow) {
      args.push("--depth");
      args.push("1");
    }
    args.push("--");
    args.push(repo);
    args.push(targetPath);
    var process7 = spawn(git, args);
    process7.on("close", function(status) {
      if (status == 0) {
        if (opts.checkout) {
          _checkout();
        } else {
          cb && cb();
        }
      } else {
        cb && cb(new Error("'git clone' failed with status " + status));
      }
    });
    function _checkout() {
      var args2 = ["checkout", opts.checkout];
      var process8 = spawn(git, args2, { cwd: targetPath });
      process8.on("close", function(status) {
        if (status == 0) {
          cb && cb();
        } else {
          cb && cb(new Error("'git checkout' failed with status " + status));
        }
      });
    }
  };
});

// node_modules/fs.realpath/old.js
var require_old = __commonJS((exports) => {
  var rethrow = function() {
    var callback;
    if (DEBUG) {
      var backtrace = new Error;
      callback = debugCallback;
    } else
      callback = missingCallback;
    return callback;
    function debugCallback(err) {
      if (err) {
        backtrace.message = err.message;
        err = backtrace;
        missingCallback(err);
      }
    }
    function missingCallback(err) {
      if (err) {
        if (process.throwDeprecation)
          throw err;
        else if (!process.noDeprecation) {
          var msg = "fs: missing callback " + (err.stack || err.message);
          if (process.traceDeprecation)
            console.trace(msg);
          else
            console.error(msg);
        }
      }
    }
  };
  var maybeCallback = function(cb) {
    return typeof cb === "function" ? cb : rethrow();
  };
  var pathModule = import.meta.require("path");
  var isWindows = process.platform === "win32";
  var fs = import.meta.require("fs");
  var DEBUG = process.env.NODE_DEBUG && /fs/.test(process.env.NODE_DEBUG);
  var normalize2 = pathModule.normalize;
  if (isWindows) {
    nextPartRe = /(.*?)(?:[\/\\]+|$)/g;
  } else {
    nextPartRe = /(.*?)(?:[\/]+|$)/g;
  }
  var nextPartRe;
  if (isWindows) {
    splitRootRe = /^(?:[a-zA-Z]:|[\\\/]{2}[^\\\/]+[\\\/][^\\\/]+)?[\\\/]*/;
  } else {
    splitRootRe = /^[\/]*/;
  }
  var splitRootRe;
  exports.realpathSync = function realpathSync(p, cache) {
    p = pathModule.resolve(p);
    if (cache && Object.prototype.hasOwnProperty.call(cache, p)) {
      return cache[p];
    }
    var original = p, seenLinks = {}, knownHard = {};
    var pos;
    var current;
    var base;
    var previous;
    start();
    function start() {
      var m = splitRootRe.exec(p);
      pos = m[0].length;
      current = m[0];
      base = m[0];
      previous = "";
      if (isWindows && !knownHard[base]) {
        fs.lstatSync(base);
        knownHard[base] = true;
      }
    }
    while (pos < p.length) {
      nextPartRe.lastIndex = pos;
      var result = nextPartRe.exec(p);
      previous = current;
      current += result[0];
      base = previous + result[1];
      pos = nextPartRe.lastIndex;
      if (knownHard[base] || cache && cache[base] === base) {
        continue;
      }
      var resolvedLink;
      if (cache && Object.prototype.hasOwnProperty.call(cache, base)) {
        resolvedLink = cache[base];
      } else {
        var stat = fs.lstatSync(base);
        if (!stat.isSymbolicLink()) {
          knownHard[base] = true;
          if (cache)
            cache[base] = base;
          continue;
        }
        var linkTarget = null;
        if (!isWindows) {
          var id = stat.dev.toString(32) + ":" + stat.ino.toString(32);
          if (seenLinks.hasOwnProperty(id)) {
            linkTarget = seenLinks[id];
          }
        }
        if (linkTarget === null) {
          fs.statSync(base);
          linkTarget = fs.readlinkSync(base);
        }
        resolvedLink = pathModule.resolve(previous, linkTarget);
        if (cache)
          cache[base] = resolvedLink;
        if (!isWindows)
          seenLinks[id] = linkTarget;
      }
      p = pathModule.resolve(resolvedLink, p.slice(pos));
      start();
    }
    if (cache)
      cache[original] = p;
    return p;
  };
  exports.realpath = function realpath(p, cache, cb) {
    if (typeof cb !== "function") {
      cb = maybeCallback(cache);
      cache = null;
    }
    p = pathModule.resolve(p);
    if (cache && Object.prototype.hasOwnProperty.call(cache, p)) {
      return process.nextTick(cb.bind(null, null, cache[p]));
    }
    var original = p, seenLinks = {}, knownHard = {};
    var pos;
    var current;
    var base;
    var previous;
    start();
    function start() {
      var m = splitRootRe.exec(p);
      pos = m[0].length;
      current = m[0];
      base = m[0];
      previous = "";
      if (isWindows && !knownHard[base]) {
        fs.lstat(base, function(err) {
          if (err)
            return cb(err);
          knownHard[base] = true;
          LOOP();
        });
      } else {
        process.nextTick(LOOP);
      }
    }
    function LOOP() {
      if (pos >= p.length) {
        if (cache)
          cache[original] = p;
        return cb(null, p);
      }
      nextPartRe.lastIndex = pos;
      var result = nextPartRe.exec(p);
      previous = current;
      current += result[0];
      base = previous + result[1];
      pos = nextPartRe.lastIndex;
      if (knownHard[base] || cache && cache[base] === base) {
        return process.nextTick(LOOP);
      }
      if (cache && Object.prototype.hasOwnProperty.call(cache, base)) {
        return gotResolvedLink(cache[base]);
      }
      return fs.lstat(base, gotStat);
    }
    function gotStat(err, stat) {
      if (err)
        return cb(err);
      if (!stat.isSymbolicLink()) {
        knownHard[base] = true;
        if (cache)
          cache[base] = base;
        return process.nextTick(LOOP);
      }
      if (!isWindows) {
        var id = stat.dev.toString(32) + ":" + stat.ino.toString(32);
        if (seenLinks.hasOwnProperty(id)) {
          return gotTarget(null, seenLinks[id], base);
        }
      }
      fs.stat(base, function(err2) {
        if (err2)
          return cb(err2);
        fs.readlink(base, function(err3, target) {
          if (!isWindows)
            seenLinks[id] = target;
          gotTarget(err3, target);
        });
      });
    }
    function gotTarget(err, target, base2) {
      if (err)
        return cb(err);
      var resolvedLink = pathModule.resolve(previous, target);
      if (cache)
        cache[base2] = resolvedLink;
      gotResolvedLink(resolvedLink);
    }
    function gotResolvedLink(resolvedLink) {
      p = pathModule.resolve(resolvedLink, p.slice(pos));
      start();
    }
  };
});

// node_modules/fs.realpath/index.js
var require_fs = __commonJS((exports, module) => {
  var newError = function(er) {
    return er && er.syscall === "realpath" && (er.code === "ELOOP" || er.code === "ENOMEM" || er.code === "ENAMETOOLONG");
  };
  var realpath = function(p, cache, cb) {
    if (ok) {
      return origRealpath(p, cache, cb);
    }
    if (typeof cache === "function") {
      cb = cache;
      cache = null;
    }
    origRealpath(p, cache, function(er, result) {
      if (newError(er)) {
        old.realpath(p, cache, cb);
      } else {
        cb(er, result);
      }
    });
  };
  var realpathSync = function(p, cache) {
    if (ok) {
      return origRealpathSync(p, cache);
    }
    try {
      return origRealpathSync(p, cache);
    } catch (er) {
      if (newError(er)) {
        return old.realpathSync(p, cache);
      } else {
        throw er;
      }
    }
  };
  var monkeypatch = function() {
    fs.realpath = realpath;
    fs.realpathSync = realpathSync;
  };
  var unmonkeypatch = function() {
    fs.realpath = origRealpath;
    fs.realpathSync = origRealpathSync;
  };
  module.exports = realpath;
  realpath.realpath = realpath;
  realpath.sync = realpathSync;
  realpath.realpathSync = realpathSync;
  realpath.monkeypatch = monkeypatch;
  realpath.unmonkeypatch = unmonkeypatch;
  var fs = import.meta.require("fs");
  var origRealpath = fs.realpath;
  var origRealpathSync = fs.realpathSync;
  var version2 = process.version;
  var ok = /^v[0-5]\./.test(version2);
  var old = require_old();
});

// node_modules/concat-map/index.js
var require_concat_map = __commonJS((exports, module) => {
  module.exports = function(xs, fn) {
    var res = [];
    for (var i = 0;i < xs.length; i++) {
      var x = fn(xs[i], i);
      if (isArray(x))
        res.push.apply(res, x);
      else
        res.push(x);
    }
    return res;
  };
  var isArray = Array.isArray || function(xs) {
    return Object.prototype.toString.call(xs) === "[object Array]";
  };
});

// node_modules/balanced-match/index.js
var require_balanced_match = __commonJS((exports, module) => {
  var balanced = function(a, b, str) {
    if (a instanceof RegExp)
      a = maybeMatch(a, str);
    if (b instanceof RegExp)
      b = maybeMatch(b, str);
    var r = range(a, b, str);
    return r && {
      start: r[0],
      end: r[1],
      pre: str.slice(0, r[0]),
      body: str.slice(r[0] + a.length, r[1]),
      post: str.slice(r[1] + b.length)
    };
  };
  var maybeMatch = function(reg, str) {
    var m = str.match(reg);
    return m ? m[0] : null;
  };
  var range = function(a, b, str) {
    var begs, beg, left, right, result;
    var ai = str.indexOf(a);
    var bi = str.indexOf(b, ai + 1);
    var i = ai;
    if (ai >= 0 && bi > 0) {
      if (a === b) {
        return [ai, bi];
      }
      begs = [];
      left = str.length;
      while (i >= 0 && !result) {
        if (i == ai) {
          begs.push(i);
          ai = str.indexOf(a, i + 1);
        } else if (begs.length == 1) {
          result = [begs.pop(), bi];
        } else {
          beg = begs.pop();
          if (beg < left) {
            left = beg;
            right = bi;
          }
          bi = str.indexOf(b, i + 1);
        }
        i = ai < bi && ai >= 0 ? ai : bi;
      }
      if (begs.length) {
        result = [left, right];
      }
    }
    return result;
  };
  module.exports = balanced;
  balanced.range = range;
});

// node_modules/glob/node_modules/minimatch/node_modules/brace-expansion/index.js
var require_brace_expansion = __commonJS((exports, module) => {
  var numeric = function(str) {
    return parseInt(str, 10) == str ? parseInt(str, 10) : str.charCodeAt(0);
  };
  var escapeBraces = function(str) {
    return str.split("\\\\").join(escSlash).split("\\{").join(escOpen).split("\\}").join(escClose).split("\\,").join(escComma).split("\\.").join(escPeriod);
  };
  var unescapeBraces = function(str) {
    return str.split(escSlash).join("\\").split(escOpen).join("{").split(escClose).join("}").split(escComma).join(",").split(escPeriod).join(".");
  };
  var parseCommaParts = function(str) {
    if (!str)
      return [""];
    var parts = [];
    var m = balanced("{", "}", str);
    if (!m)
      return str.split(",");
    var pre = m.pre;
    var body = m.body;
    var post = m.post;
    var p = pre.split(",");
    p[p.length - 1] += "{" + body + "}";
    var postParts = parseCommaParts(post);
    if (post.length) {
      p[p.length - 1] += postParts.shift();
      p.push.apply(p, postParts);
    }
    parts.push.apply(parts, p);
    return parts;
  };
  var expandTop = function(str) {
    if (!str)
      return [];
    if (str.substr(0, 2) === "{}") {
      str = "\\{\\}" + str.substr(2);
    }
    return expand(escapeBraces(str), true).map(unescapeBraces);
  };
  var embrace = function(str) {
    return "{" + str + "}";
  };
  var isPadded = function(el) {
    return /^-?0\d/.test(el);
  };
  var lte = function(i, y) {
    return i <= y;
  };
  var gte = function(i, y) {
    return i >= y;
  };
  var expand = function(str, isTop) {
    var expansions = [];
    var m = balanced("{", "}", str);
    if (!m || /\$$/.test(m.pre))
      return [str];
    var isNumericSequence = /^-?\d+\.\.-?\d+(?:\.\.-?\d+)?$/.test(m.body);
    var isAlphaSequence = /^[a-zA-Z]\.\.[a-zA-Z](?:\.\.-?\d+)?$/.test(m.body);
    var isSequence = isNumericSequence || isAlphaSequence;
    var isOptions = m.body.indexOf(",") >= 0;
    if (!isSequence && !isOptions) {
      if (m.post.match(/,.*\}/)) {
        str = m.pre + "{" + m.body + escClose + m.post;
        return expand(str);
      }
      return [str];
    }
    var n;
    if (isSequence) {
      n = m.body.split(/\.\./);
    } else {
      n = parseCommaParts(m.body);
      if (n.length === 1) {
        n = expand(n[0], false).map(embrace);
        if (n.length === 1) {
          var post = m.post.length ? expand(m.post, false) : [""];
          return post.map(function(p) {
            return m.pre + n[0] + p;
          });
        }
      }
    }
    var pre = m.pre;
    var post = m.post.length ? expand(m.post, false) : [""];
    var N;
    if (isSequence) {
      var x = numeric(n[0]);
      var y = numeric(n[1]);
      var width = Math.max(n[0].length, n[1].length);
      var incr = n.length == 3 ? Math.abs(numeric(n[2])) : 1;
      var test = lte;
      var reverse = y < x;
      if (reverse) {
        incr *= -1;
        test = gte;
      }
      var pad = n.some(isPadded);
      N = [];
      for (var i = x;test(i, y); i += incr) {
        var c;
        if (isAlphaSequence) {
          c = String.fromCharCode(i);
          if (c === "\\")
            c = "";
        } else {
          c = String(i);
          if (pad) {
            var need = width - c.length;
            if (need > 0) {
              var z = new Array(need + 1).join("0");
              if (i < 0)
                c = "-" + z + c.slice(1);
              else
                c = z + c;
            }
          }
        }
        N.push(c);
      }
    } else {
      N = concatMap(n, function(el) {
        return expand(el, false);
      });
    }
    for (var j = 0;j < N.length; j++) {
      for (var k = 0;k < post.length; k++) {
        var expansion = pre + N[j] + post[k];
        if (!isTop || isSequence || expansion)
          expansions.push(expansion);
      }
    }
    return expansions;
  };
  var concatMap = require_concat_map();
  var balanced = require_balanced_match();
  module.exports = expandTop;
  var escSlash = "\0SLASH" + Math.random() + "\0";
  var escOpen = "\0OPEN" + Math.random() + "\0";
  var escClose = "\0CLOSE" + Math.random() + "\0";
  var escComma = "\0COMMA" + Math.random() + "\0";
  var escPeriod = "\0PERIOD" + Math.random() + "\0";
});

// node_modules/glob/node_modules/minimatch/minimatch.js
var require_minimatch = __commonJS((exports, module) => {
  var charSet = function(s) {
    return s.split("").reduce(function(set, c) {
      set[c] = true;
      return set;
    }, {});
  };
  var filter = function(pattern, options) {
    options = options || {};
    return function(p, i, list) {
      return minimatch(p, pattern, options);
    };
  };
  var ext = function(a, b) {
    b = b || {};
    var t = {};
    Object.keys(a).forEach(function(k) {
      t[k] = a[k];
    });
    Object.keys(b).forEach(function(k) {
      t[k] = b[k];
    });
    return t;
  };
  var minimatch = function(p, pattern, options) {
    assertValidPattern(pattern);
    if (!options)
      options = {};
    if (!options.nocomment && pattern.charAt(0) === "#") {
      return false;
    }
    return new Minimatch(pattern, options).match(p);
  };
  var Minimatch = function(pattern, options) {
    if (!(this instanceof Minimatch)) {
      return new Minimatch(pattern, options);
    }
    assertValidPattern(pattern);
    if (!options)
      options = {};
    pattern = pattern.trim();
    if (!options.allowWindowsEscape && path3.sep !== "/") {
      pattern = pattern.split(path3.sep).join("/");
    }
    this.options = options;
    this.set = [];
    this.pattern = pattern;
    this.regexp = null;
    this.negate = false;
    this.comment = false;
    this.empty = false;
    this.partial = !!options.partial;
    this.make();
  };
  var make = function() {
    var pattern = this.pattern;
    var options = this.options;
    if (!options.nocomment && pattern.charAt(0) === "#") {
      this.comment = true;
      return;
    }
    if (!pattern) {
      this.empty = true;
      return;
    }
    this.parseNegate();
    var set = this.globSet = this.braceExpand();
    if (options.debug)
      this.debug = function debug() {
        console.error.apply(console, arguments);
      };
    this.debug(this.pattern, set);
    set = this.globParts = set.map(function(s) {
      return s.split(slashSplit);
    });
    this.debug(this.pattern, set);
    set = set.map(function(s, si, set2) {
      return s.map(this.parse, this);
    }, this);
    this.debug(this.pattern, set);
    set = set.filter(function(s) {
      return s.indexOf(false) === -1;
    });
    this.debug(this.pattern, set);
    this.set = set;
  };
  var parseNegate = function() {
    var pattern = this.pattern;
    var negate = false;
    var options = this.options;
    var negateOffset = 0;
    if (options.nonegate)
      return;
    for (var i = 0, l = pattern.length;i < l && pattern.charAt(i) === "!"; i++) {
      negate = !negate;
      negateOffset++;
    }
    if (negateOffset)
      this.pattern = pattern.substr(negateOffset);
    this.negate = negate;
  };
  var braceExpand = function(pattern, options) {
    if (!options) {
      if (this instanceof Minimatch) {
        options = this.options;
      } else {
        options = {};
      }
    }
    pattern = typeof pattern === "undefined" ? this.pattern : pattern;
    assertValidPattern(pattern);
    if (options.nobrace || !/\{(?:(?!\{).)*\}/.test(pattern)) {
      return [pattern];
    }
    return expand(pattern);
  };
  var parse = function(pattern, isSub) {
    assertValidPattern(pattern);
    var options = this.options;
    if (pattern === "**") {
      if (!options.noglobstar)
        return GLOBSTAR;
      else
        pattern = "*";
    }
    if (pattern === "")
      return "";
    var re = "";
    var hasMagic = !!options.nocase;
    var escaping = false;
    var patternListStack = [];
    var negativeLists = [];
    var stateChar;
    var inClass = false;
    var reClassStart = -1;
    var classStart = -1;
    var patternStart = pattern.charAt(0) === "." ? "" : options.dot ? "(?!(?:^|\\/)\\.{1,2}(?:$|\\/))" : "(?!\\.)";
    var self2 = this;
    function clearStateChar() {
      if (stateChar) {
        switch (stateChar) {
          case "*":
            re += star;
            hasMagic = true;
            break;
          case "?":
            re += qmark;
            hasMagic = true;
            break;
          default:
            re += "\\" + stateChar;
            break;
        }
        self2.debug("clearStateChar %j %j", stateChar, re);
        stateChar = false;
      }
    }
    for (var i = 0, len = pattern.length, c;i < len && (c = pattern.charAt(i)); i++) {
      this.debug("%s\t%s %s %j", pattern, i, re, c);
      if (escaping && reSpecials[c]) {
        re += "\\" + c;
        escaping = false;
        continue;
      }
      switch (c) {
        case "/": {
          return false;
        }
        case "\\":
          clearStateChar();
          escaping = true;
          continue;
        case "?":
        case "*":
        case "+":
        case "@":
        case "!":
          this.debug("%s\t%s %s %j <-- stateChar", pattern, i, re, c);
          if (inClass) {
            this.debug("  in class");
            if (c === "!" && i === classStart + 1)
              c = "^";
            re += c;
            continue;
          }
          self2.debug("call clearStateChar %j", stateChar);
          clearStateChar();
          stateChar = c;
          if (options.noext)
            clearStateChar();
          continue;
        case "(":
          if (inClass) {
            re += "(";
            continue;
          }
          if (!stateChar) {
            re += "\\(";
            continue;
          }
          patternListStack.push({
            type: stateChar,
            start: i - 1,
            reStart: re.length,
            open: plTypes[stateChar].open,
            close: plTypes[stateChar].close
          });
          re += stateChar === "!" ? "(?:(?!(?:" : "(?:";
          this.debug("plType %j %j", stateChar, re);
          stateChar = false;
          continue;
        case ")":
          if (inClass || !patternListStack.length) {
            re += "\\)";
            continue;
          }
          clearStateChar();
          hasMagic = true;
          var pl = patternListStack.pop();
          re += pl.close;
          if (pl.type === "!") {
            negativeLists.push(pl);
          }
          pl.reEnd = re.length;
          continue;
        case "|":
          if (inClass || !patternListStack.length || escaping) {
            re += "\\|";
            escaping = false;
            continue;
          }
          clearStateChar();
          re += "|";
          continue;
        case "[":
          clearStateChar();
          if (inClass) {
            re += "\\" + c;
            continue;
          }
          inClass = true;
          classStart = i;
          reClassStart = re.length;
          re += c;
          continue;
        case "]":
          if (i === classStart + 1 || !inClass) {
            re += "\\" + c;
            escaping = false;
            continue;
          }
          var cs = pattern.substring(classStart + 1, i);
          try {
            RegExp("[" + cs + "]");
          } catch (er) {
            var sp = this.parse(cs, SUBPARSE);
            re = re.substr(0, reClassStart) + "\\[" + sp[0] + "\\]";
            hasMagic = hasMagic || sp[1];
            inClass = false;
            continue;
          }
          hasMagic = true;
          inClass = false;
          re += c;
          continue;
        default:
          clearStateChar();
          if (escaping) {
            escaping = false;
          } else if (reSpecials[c] && !(c === "^" && inClass)) {
            re += "\\";
          }
          re += c;
      }
    }
    if (inClass) {
      cs = pattern.substr(classStart + 1);
      sp = this.parse(cs, SUBPARSE);
      re = re.substr(0, reClassStart) + "\\[" + sp[0];
      hasMagic = hasMagic || sp[1];
    }
    for (pl = patternListStack.pop();pl; pl = patternListStack.pop()) {
      var tail = re.slice(pl.reStart + pl.open.length);
      this.debug("setting tail", re, pl);
      tail = tail.replace(/((?:\\{2}){0,64})(\\?)\|/g, function(_, $1, $2) {
        if (!$2) {
          $2 = "\\";
        }
        return $1 + $1 + $2 + "|";
      });
      this.debug("tail=%j\n   %s", tail, tail, pl, re);
      var t = pl.type === "*" ? star : pl.type === "?" ? qmark : "\\" + pl.type;
      hasMagic = true;
      re = re.slice(0, pl.reStart) + t + "\\(" + tail;
    }
    clearStateChar();
    if (escaping) {
      re += "\\\\";
    }
    var addPatternStart = false;
    switch (re.charAt(0)) {
      case "[":
      case ".":
      case "(":
        addPatternStart = true;
    }
    for (var n = negativeLists.length - 1;n > -1; n--) {
      var nl = negativeLists[n];
      var nlBefore = re.slice(0, nl.reStart);
      var nlFirst = re.slice(nl.reStart, nl.reEnd - 8);
      var nlLast = re.slice(nl.reEnd - 8, nl.reEnd);
      var nlAfter = re.slice(nl.reEnd);
      nlLast += nlAfter;
      var openParensBefore = nlBefore.split("(").length - 1;
      var cleanAfter = nlAfter;
      for (i = 0;i < openParensBefore; i++) {
        cleanAfter = cleanAfter.replace(/\)[+*?]?/, "");
      }
      nlAfter = cleanAfter;
      var dollar = "";
      if (nlAfter === "" && isSub !== SUBPARSE) {
        dollar = "$";
      }
      var newRe = nlBefore + nlFirst + nlAfter + dollar + nlLast;
      re = newRe;
    }
    if (re !== "" && hasMagic) {
      re = "(?=.)" + re;
    }
    if (addPatternStart) {
      re = patternStart + re;
    }
    if (isSub === SUBPARSE) {
      return [re, hasMagic];
    }
    if (!hasMagic) {
      return globUnescape(pattern);
    }
    var flags = options.nocase ? "i" : "";
    try {
      var regExp = new RegExp("^" + re + "$", flags);
    } catch (er) {
      return new RegExp("$.");
    }
    regExp._glob = pattern;
    regExp._src = re;
    return regExp;
  };
  var makeRe = function() {
    if (this.regexp || this.regexp === false)
      return this.regexp;
    var set = this.set;
    if (!set.length) {
      this.regexp = false;
      return this.regexp;
    }
    var options = this.options;
    var twoStar = options.noglobstar ? star : options.dot ? twoStarDot : twoStarNoDot;
    var flags = options.nocase ? "i" : "";
    var re = set.map(function(pattern) {
      return pattern.map(function(p) {
        return p === GLOBSTAR ? twoStar : typeof p === "string" ? regExpEscape(p) : p._src;
      }).join("\\/");
    }).join("|");
    re = "^(?:" + re + ")$";
    if (this.negate)
      re = "^(?!" + re + ").*$";
    try {
      this.regexp = new RegExp(re, flags);
    } catch (ex) {
      this.regexp = false;
    }
    return this.regexp;
  };
  var globUnescape = function(s) {
    return s.replace(/\\(.)/g, "$1");
  };
  var regExpEscape = function(s) {
    return s.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
  };
  module.exports = minimatch;
  minimatch.Minimatch = Minimatch;
  var path3 = function() {
    try {
      return import.meta.require("path");
    } catch (e) {
    }
  }() || {
    sep: "/"
  };
  minimatch.sep = path3.sep;
  var GLOBSTAR = minimatch.GLOBSTAR = Minimatch.GLOBSTAR = {};
  var expand = require_brace_expansion();
  var plTypes = {
    "!": { open: "(?:(?!(?:", close: "))[^/]*?)" },
    "?": { open: "(?:", close: ")?" },
    "+": { open: "(?:", close: ")+" },
    "*": { open: "(?:", close: ")*" },
    "@": { open: "(?:", close: ")" }
  };
  var qmark = "[^/]";
  var star = qmark + "*?";
  var twoStarDot = "(?:(?!(?:\\/|^)(?:\\.{1,2})($|\\/)).)*?";
  var twoStarNoDot = "(?:(?!(?:\\/|^)\\.).)*?";
  var reSpecials = charSet("().*{}+?[]^$\\!");
  var slashSplit = /\/+/;
  minimatch.filter = filter;
  minimatch.defaults = function(def) {
    if (!def || typeof def !== "object" || !Object.keys(def).length) {
      return minimatch;
    }
    var orig = minimatch;
    var m = function minimatch(p, pattern, options) {
      return orig(p, pattern, ext(def, options));
    };
    m.Minimatch = function Minimatch(pattern, options) {
      return new orig.Minimatch(pattern, ext(def, options));
    };
    m.Minimatch.defaults = function defaults(options) {
      return orig.defaults(ext(def, options)).Minimatch;
    };
    m.filter = function filter(pattern, options) {
      return orig.filter(pattern, ext(def, options));
    };
    m.defaults = function defaults(options) {
      return orig.defaults(ext(def, options));
    };
    m.makeRe = function makeRe(pattern, options) {
      return orig.makeRe(pattern, ext(def, options));
    };
    m.braceExpand = function braceExpand(pattern, options) {
      return orig.braceExpand(pattern, ext(def, options));
    };
    m.match = function(list, pattern, options) {
      return orig.match(list, pattern, ext(def, options));
    };
    return m;
  };
  Minimatch.defaults = function(def) {
    return minimatch.defaults(def).Minimatch;
  };
  Minimatch.prototype.debug = function() {
  };
  Minimatch.prototype.make = make;
  Minimatch.prototype.parseNegate = parseNegate;
  minimatch.braceExpand = function(pattern, options) {
    return braceExpand(pattern, options);
  };
  Minimatch.prototype.braceExpand = braceExpand;
  var MAX_PATTERN_LENGTH = 1024 * 64;
  var assertValidPattern = function(pattern) {
    if (typeof pattern !== "string") {
      throw new TypeError("invalid pattern");
    }
    if (pattern.length > MAX_PATTERN_LENGTH) {
      throw new TypeError("pattern is too long");
    }
  };
  Minimatch.prototype.parse = parse;
  var SUBPARSE = {};
  minimatch.makeRe = function(pattern, options) {
    return new Minimatch(pattern, options || {}).makeRe();
  };
  Minimatch.prototype.makeRe = makeRe;
  minimatch.match = function(list, pattern, options) {
    options = options || {};
    var mm = new Minimatch(pattern, options);
    list = list.filter(function(f) {
      return mm.match(f);
    });
    if (mm.options.nonull && !list.length) {
      list.push(pattern);
    }
    return list;
  };
  Minimatch.prototype.match = function match(f, partial) {
    if (typeof partial === "undefined")
      partial = this.partial;
    this.debug("match", f, this.pattern);
    if (this.comment)
      return false;
    if (this.empty)
      return f === "";
    if (f === "/" && partial)
      return true;
    var options = this.options;
    if (path3.sep !== "/") {
      f = f.split(path3.sep).join("/");
    }
    f = f.split(slashSplit);
    this.debug(this.pattern, "split", f);
    var set = this.set;
    this.debug(this.pattern, "set", set);
    var filename;
    var i;
    for (i = f.length - 1;i >= 0; i--) {
      filename = f[i];
      if (filename)
        break;
    }
    for (i = 0;i < set.length; i++) {
      var pattern = set[i];
      var file = f;
      if (options.matchBase && pattern.length === 1) {
        file = [filename];
      }
      var hit = this.matchOne(file, pattern, partial);
      if (hit) {
        if (options.flipNegate)
          return true;
        return !this.negate;
      }
    }
    if (options.flipNegate)
      return false;
    return this.negate;
  };
  Minimatch.prototype.matchOne = function(file, pattern, partial) {
    var options = this.options;
    this.debug("matchOne", { this: this, file, pattern });
    this.debug("matchOne", file.length, pattern.length);
    for (var fi = 0, pi = 0, fl = file.length, pl = pattern.length;fi < fl && pi < pl; fi++, pi++) {
      this.debug("matchOne loop");
      var p = pattern[pi];
      var f = file[fi];
      this.debug(pattern, p, f);
      if (p === false)
        return false;
      if (p === GLOBSTAR) {
        this.debug("GLOBSTAR", [pattern, p, f]);
        var fr = fi;
        var pr = pi + 1;
        if (pr === pl) {
          this.debug("** at the end");
          for (;fi < fl; fi++) {
            if (file[fi] === "." || file[fi] === ".." || !options.dot && file[fi].charAt(0) === ".")
              return false;
          }
          return true;
        }
        while (fr < fl) {
          var swallowee = file[fr];
          this.debug("\nglobstar while", file, fr, pattern, pr, swallowee);
          if (this.matchOne(file.slice(fr), pattern.slice(pr), partial)) {
            this.debug("globstar found match!", fr, fl, swallowee);
            return true;
          } else {
            if (swallowee === "." || swallowee === ".." || !options.dot && swallowee.charAt(0) === ".") {
              this.debug("dot detected!", file, fr, pattern, pr);
              break;
            }
            this.debug("globstar swallow a segment, and continue");
            fr++;
          }
        }
        if (partial) {
          this.debug("\n>>> no match, partial?", file, fr, pattern, pr);
          if (fr === fl)
            return true;
        }
        return false;
      }
      var hit;
      if (typeof p === "string") {
        hit = f === p;
        this.debug("string match", p, f, hit);
      } else {
        hit = f.match(p);
        this.debug("pattern match", p, f, hit);
      }
      if (!hit)
        return false;
    }
    if (fi === fl && pi === pl) {
      return true;
    } else if (fi === fl) {
      return partial;
    } else if (pi === pl) {
      return fi === fl - 1 && file[fi] === "";
    }
    throw new Error("wtf?");
  };
});

// node_modules/path-is-absolute/index.js
var require_path_is_absolute = __commonJS((exports, module) => {
  var posix = function(path3) {
    return path3.charAt(0) === "/";
  };
  var win32 = function(path3) {
    var splitDeviceRe = /^([a-zA-Z]:|[\\\/]{2}[^\\\/]+[\\\/]+[^\\\/]+)?([\\\/])?([\s\S]*?)$/;
    var result = splitDeviceRe.exec(path3);
    var device = result[1] || "";
    var isUnc = Boolean(device && device.charAt(1) !== ":");
    return Boolean(result[2] || isUnc);
  };
  module.exports = process.platform === "win32" ? win32 : posix;
  module.exports.posix = posix;
  module.exports.win32 = win32;
});

// node_modules/glob/common.js
var require_common = __commonJS((exports) => {
  var ownProp = function(obj, field) {
    return Object.prototype.hasOwnProperty.call(obj, field);
  };
  var alphasort = function(a, b) {
    return a.localeCompare(b, "en");
  };
  var setupIgnores = function(self2, options) {
    self2.ignore = options.ignore || [];
    if (!Array.isArray(self2.ignore))
      self2.ignore = [self2.ignore];
    if (self2.ignore.length) {
      self2.ignore = self2.ignore.map(ignoreMap);
    }
  };
  var ignoreMap = function(pattern) {
    var gmatcher = null;
    if (pattern.slice(-3) === "/**") {
      var gpattern = pattern.replace(/(\/\*\*)+$/, "");
      gmatcher = new Minimatch(gpattern, { dot: true });
    }
    return {
      matcher: new Minimatch(pattern, { dot: true }),
      gmatcher
    };
  };
  var setopts = function(self2, pattern, options) {
    if (!options)
      options = {};
    if (options.matchBase && pattern.indexOf("/") === -1) {
      if (options.noglobstar) {
        throw new Error("base matching requires globstar");
      }
      pattern = "**/" + pattern;
    }
    self2.silent = !!options.silent;
    self2.pattern = pattern;
    self2.strict = options.strict !== false;
    self2.realpath = !!options.realpath;
    self2.realpathCache = options.realpathCache || Object.create(null);
    self2.follow = !!options.follow;
    self2.dot = !!options.dot;
    self2.mark = !!options.mark;
    self2.nodir = !!options.nodir;
    if (self2.nodir)
      self2.mark = true;
    self2.sync = !!options.sync;
    self2.nounique = !!options.nounique;
    self2.nonull = !!options.nonull;
    self2.nosort = !!options.nosort;
    self2.nocase = !!options.nocase;
    self2.stat = !!options.stat;
    self2.noprocess = !!options.noprocess;
    self2.absolute = !!options.absolute;
    self2.fs = options.fs || fs;
    self2.maxLength = options.maxLength || Infinity;
    self2.cache = options.cache || Object.create(null);
    self2.statCache = options.statCache || Object.create(null);
    self2.symlinks = options.symlinks || Object.create(null);
    setupIgnores(self2, options);
    self2.changedCwd = false;
    var cwd = process.cwd();
    if (!ownProp(options, "cwd"))
      self2.cwd = cwd;
    else {
      self2.cwd = path3.resolve(options.cwd);
      self2.changedCwd = self2.cwd !== cwd;
    }
    self2.root = options.root || path3.resolve(self2.cwd, "/");
    self2.root = path3.resolve(self2.root);
    if (process.platform === "win32")
      self2.root = self2.root.replace(/\\/g, "/");
    self2.cwdAbs = isAbsolute(self2.cwd) ? self2.cwd : makeAbs(self2, self2.cwd);
    if (process.platform === "win32")
      self2.cwdAbs = self2.cwdAbs.replace(/\\/g, "/");
    self2.nomount = !!options.nomount;
    options.nonegate = true;
    options.nocomment = true;
    options.allowWindowsEscape = false;
    self2.minimatch = new Minimatch(pattern, options);
    self2.options = self2.minimatch.options;
  };
  var finish = function(self2) {
    var nou = self2.nounique;
    var all = nou ? [] : Object.create(null);
    for (var i = 0, l = self2.matches.length;i < l; i++) {
      var matches = self2.matches[i];
      if (!matches || Object.keys(matches).length === 0) {
        if (self2.nonull) {
          var literal = self2.minimatch.globSet[i];
          if (nou)
            all.push(literal);
          else
            all[literal] = true;
        }
      } else {
        var m = Object.keys(matches);
        if (nou)
          all.push.apply(all, m);
        else
          m.forEach(function(m2) {
            all[m2] = true;
          });
      }
    }
    if (!nou)
      all = Object.keys(all);
    if (!self2.nosort)
      all = all.sort(alphasort);
    if (self2.mark) {
      for (var i = 0;i < all.length; i++) {
        all[i] = self2._mark(all[i]);
      }
      if (self2.nodir) {
        all = all.filter(function(e) {
          var notDir = !/\/$/.test(e);
          var c = self2.cache[e] || self2.cache[makeAbs(self2, e)];
          if (notDir && c)
            notDir = c !== "DIR" && !Array.isArray(c);
          return notDir;
        });
      }
    }
    if (self2.ignore.length)
      all = all.filter(function(m2) {
        return !isIgnored(self2, m2);
      });
    self2.found = all;
  };
  var mark = function(self2, p) {
    var abs = makeAbs(self2, p);
    var c = self2.cache[abs];
    var m = p;
    if (c) {
      var isDir = c === "DIR" || Array.isArray(c);
      var slash = p.slice(-1) === "/";
      if (isDir && !slash)
        m += "/";
      else if (!isDir && slash)
        m = m.slice(0, -1);
      if (m !== p) {
        var mabs = makeAbs(self2, m);
        self2.statCache[mabs] = self2.statCache[abs];
        self2.cache[mabs] = self2.cache[abs];
      }
    }
    return m;
  };
  var makeAbs = function(self2, f) {
    var abs = f;
    if (f.charAt(0) === "/") {
      abs = path3.join(self2.root, f);
    } else if (isAbsolute(f) || f === "") {
      abs = f;
    } else if (self2.changedCwd) {
      abs = path3.resolve(self2.cwd, f);
    } else {
      abs = path3.resolve(f);
    }
    if (process.platform === "win32")
      abs = abs.replace(/\\/g, "/");
    return abs;
  };
  var isIgnored = function(self2, path4) {
    if (!self2.ignore.length)
      return false;
    return self2.ignore.some(function(item) {
      return item.matcher.match(path4) || !!(item.gmatcher && item.gmatcher.match(path4));
    });
  };
  var childrenIgnored = function(self2, path4) {
    if (!self2.ignore.length)
      return false;
    return self2.ignore.some(function(item) {
      return !!(item.gmatcher && item.gmatcher.match(path4));
    });
  };
  exports.setopts = setopts;
  exports.ownProp = ownProp;
  exports.makeAbs = makeAbs;
  exports.finish = finish;
  exports.mark = mark;
  exports.isIgnored = isIgnored;
  exports.childrenIgnored = childrenIgnored;
  var fs = import.meta.require("fs");
  var path3 = import.meta.require("path");
  var minimatch = require_minimatch();
  var isAbsolute = require_path_is_absolute();
  var Minimatch = minimatch.Minimatch;
});

// node_modules/glob/sync.js
var require_sync = __commonJS((exports, module) => {
  var globSync = function(pattern, options) {
    if (typeof options === "function" || arguments.length === 3)
      throw new TypeError("callback provided to sync glob\n" + "See: https://github.com/isaacs/node-glob/issues/167");
    return new GlobSync(pattern, options).found;
  };
  var GlobSync = function(pattern, options) {
    if (!pattern)
      throw new Error("must provide pattern");
    if (typeof options === "function" || arguments.length === 3)
      throw new TypeError("callback provided to sync glob\n" + "See: https://github.com/isaacs/node-glob/issues/167");
    if (!(this instanceof GlobSync))
      return new GlobSync(pattern, options);
    setopts(this, pattern, options);
    if (this.noprocess)
      return this;
    var n = this.minimatch.set.length;
    this.matches = new Array(n);
    for (var i = 0;i < n; i++) {
      this._process(this.minimatch.set[i], i, false);
    }
    this._finish();
  };
  module.exports = globSync;
  globSync.GlobSync = GlobSync;
  var rp = require_fs();
  var minimatch = require_minimatch();
  var Minimatch = minimatch.Minimatch;
  var Glob = require_glob().Glob;
  var util = import.meta.require("util");
  var path3 = import.meta.require("path");
  var assert = import.meta.require("assert");
  var isAbsolute = require_path_is_absolute();
  var common = require_common();
  var setopts = common.setopts;
  var ownProp = common.ownProp;
  var childrenIgnored = common.childrenIgnored;
  var isIgnored = common.isIgnored;
  GlobSync.prototype._finish = function() {
    assert.ok(this instanceof GlobSync);
    if (this.realpath) {
      var self2 = this;
      this.matches.forEach(function(matchset, index) {
        var set = self2.matches[index] = Object.create(null);
        for (var p in matchset) {
          try {
            p = self2._makeAbs(p);
            var real = rp.realpathSync(p, self2.realpathCache);
            set[real] = true;
          } catch (er) {
            if (er.syscall === "stat")
              set[self2._makeAbs(p)] = true;
            else
              throw er;
          }
        }
      });
    }
    common.finish(this);
  };
  GlobSync.prototype._process = function(pattern, index, inGlobStar) {
    assert.ok(this instanceof GlobSync);
    var n = 0;
    while (typeof pattern[n] === "string") {
      n++;
    }
    var prefix;
    switch (n) {
      case pattern.length:
        this._processSimple(pattern.join("/"), index);
        return;
      case 0:
        prefix = null;
        break;
      default:
        prefix = pattern.slice(0, n).join("/");
        break;
    }
    var remain = pattern.slice(n);
    var read;
    if (prefix === null)
      read = ".";
    else if (isAbsolute(prefix) || isAbsolute(pattern.map(function(p) {
      return typeof p === "string" ? p : "[*]";
    }).join("/"))) {
      if (!prefix || !isAbsolute(prefix))
        prefix = "/" + prefix;
      read = prefix;
    } else
      read = prefix;
    var abs = this._makeAbs(read);
    if (childrenIgnored(this, read))
      return;
    var isGlobStar = remain[0] === minimatch.GLOBSTAR;
    if (isGlobStar)
      this._processGlobStar(prefix, read, abs, remain, index, inGlobStar);
    else
      this._processReaddir(prefix, read, abs, remain, index, inGlobStar);
  };
  GlobSync.prototype._processReaddir = function(prefix, read, abs, remain, index, inGlobStar) {
    var entries = this._readdir(abs, inGlobStar);
    if (!entries)
      return;
    var pn = remain[0];
    var negate = !!this.minimatch.negate;
    var rawGlob = pn._glob;
    var dotOk = this.dot || rawGlob.charAt(0) === ".";
    var matchedEntries = [];
    for (var i = 0;i < entries.length; i++) {
      var e = entries[i];
      if (e.charAt(0) !== "." || dotOk) {
        var m;
        if (negate && !prefix) {
          m = !e.match(pn);
        } else {
          m = e.match(pn);
        }
        if (m)
          matchedEntries.push(e);
      }
    }
    var len = matchedEntries.length;
    if (len === 0)
      return;
    if (remain.length === 1 && !this.mark && !this.stat) {
      if (!this.matches[index])
        this.matches[index] = Object.create(null);
      for (var i = 0;i < len; i++) {
        var e = matchedEntries[i];
        if (prefix) {
          if (prefix.slice(-1) !== "/")
            e = prefix + "/" + e;
          else
            e = prefix + e;
        }
        if (e.charAt(0) === "/" && !this.nomount) {
          e = path3.join(this.root, e);
        }
        this._emitMatch(index, e);
      }
      return;
    }
    remain.shift();
    for (var i = 0;i < len; i++) {
      var e = matchedEntries[i];
      var newPattern;
      if (prefix)
        newPattern = [prefix, e];
      else
        newPattern = [e];
      this._process(newPattern.concat(remain), index, inGlobStar);
    }
  };
  GlobSync.prototype._emitMatch = function(index, e) {
    if (isIgnored(this, e))
      return;
    var abs = this._makeAbs(e);
    if (this.mark)
      e = this._mark(e);
    if (this.absolute) {
      e = abs;
    }
    if (this.matches[index][e])
      return;
    if (this.nodir) {
      var c = this.cache[abs];
      if (c === "DIR" || Array.isArray(c))
        return;
    }
    this.matches[index][e] = true;
    if (this.stat)
      this._stat(e);
  };
  GlobSync.prototype._readdirInGlobStar = function(abs) {
    if (this.follow)
      return this._readdir(abs, false);
    var entries;
    var lstat;
    var stat;
    try {
      lstat = this.fs.lstatSync(abs);
    } catch (er) {
      if (er.code === "ENOENT") {
        return null;
      }
    }
    var isSym = lstat && lstat.isSymbolicLink();
    this.symlinks[abs] = isSym;
    if (!isSym && lstat && !lstat.isDirectory())
      this.cache[abs] = "FILE";
    else
      entries = this._readdir(abs, false);
    return entries;
  };
  GlobSync.prototype._readdir = function(abs, inGlobStar) {
    var entries;
    if (inGlobStar && !ownProp(this.symlinks, abs))
      return this._readdirInGlobStar(abs);
    if (ownProp(this.cache, abs)) {
      var c = this.cache[abs];
      if (!c || c === "FILE")
        return null;
      if (Array.isArray(c))
        return c;
    }
    try {
      return this._readdirEntries(abs, this.fs.readdirSync(abs));
    } catch (er) {
      this._readdirError(abs, er);
      return null;
    }
  };
  GlobSync.prototype._readdirEntries = function(abs, entries) {
    if (!this.mark && !this.stat) {
      for (var i = 0;i < entries.length; i++) {
        var e = entries[i];
        if (abs === "/")
          e = abs + e;
        else
          e = abs + "/" + e;
        this.cache[e] = true;
      }
    }
    this.cache[abs] = entries;
    return entries;
  };
  GlobSync.prototype._readdirError = function(f, er) {
    switch (er.code) {
      case "ENOTSUP":
      case "ENOTDIR":
        var abs = this._makeAbs(f);
        this.cache[abs] = "FILE";
        if (abs === this.cwdAbs) {
          var error2 = new Error(er.code + " invalid cwd " + this.cwd);
          error2.path = this.cwd;
          error2.code = er.code;
          throw error2;
        }
        break;
      case "ENOENT":
      case "ELOOP":
      case "ENAMETOOLONG":
      case "UNKNOWN":
        this.cache[this._makeAbs(f)] = false;
        break;
      default:
        this.cache[this._makeAbs(f)] = false;
        if (this.strict)
          throw er;
        if (!this.silent)
          console.error("glob error", er);
        break;
    }
  };
  GlobSync.prototype._processGlobStar = function(prefix, read, abs, remain, index, inGlobStar) {
    var entries = this._readdir(abs, inGlobStar);
    if (!entries)
      return;
    var remainWithoutGlobStar = remain.slice(1);
    var gspref = prefix ? [prefix] : [];
    var noGlobStar = gspref.concat(remainWithoutGlobStar);
    this._process(noGlobStar, index, false);
    var len = entries.length;
    var isSym = this.symlinks[abs];
    if (isSym && inGlobStar)
      return;
    for (var i = 0;i < len; i++) {
      var e = entries[i];
      if (e.charAt(0) === "." && !this.dot)
        continue;
      var instead = gspref.concat(entries[i], remainWithoutGlobStar);
      this._process(instead, index, true);
      var below = gspref.concat(entries[i], remain);
      this._process(below, index, true);
    }
  };
  GlobSync.prototype._processSimple = function(prefix, index) {
    var exists = this._stat(prefix);
    if (!this.matches[index])
      this.matches[index] = Object.create(null);
    if (!exists)
      return;
    if (prefix && isAbsolute(prefix) && !this.nomount) {
      var trail = /[\/\\]$/.test(prefix);
      if (prefix.charAt(0) === "/") {
        prefix = path3.join(this.root, prefix);
      } else {
        prefix = path3.resolve(this.root, prefix);
        if (trail)
          prefix += "/";
      }
    }
    if (process.platform === "win32")
      prefix = prefix.replace(/\\/g, "/");
    this._emitMatch(index, prefix);
  };
  GlobSync.prototype._stat = function(f) {
    var abs = this._makeAbs(f);
    var needDir = f.slice(-1) === "/";
    if (f.length > this.maxLength)
      return false;
    if (!this.stat && ownProp(this.cache, abs)) {
      var c = this.cache[abs];
      if (Array.isArray(c))
        c = "DIR";
      if (!needDir || c === "DIR")
        return c;
      if (needDir && c === "FILE")
        return false;
    }
    var exists;
    var stat = this.statCache[abs];
    if (!stat) {
      var lstat;
      try {
        lstat = this.fs.lstatSync(abs);
      } catch (er) {
        if (er && (er.code === "ENOENT" || er.code === "ENOTDIR")) {
          this.statCache[abs] = false;
          return false;
        }
      }
      if (lstat && lstat.isSymbolicLink()) {
        try {
          stat = this.fs.statSync(abs);
        } catch (er) {
          stat = lstat;
        }
      } else {
        stat = lstat;
      }
    }
    this.statCache[abs] = stat;
    var c = true;
    if (stat)
      c = stat.isDirectory() ? "DIR" : "FILE";
    this.cache[abs] = this.cache[abs] || c;
    if (needDir && c === "FILE")
      return false;
    return c;
  };
  GlobSync.prototype._mark = function(p) {
    return common.mark(this, p);
  };
  GlobSync.prototype._makeAbs = function(f) {
    return common.makeAbs(this, f);
  };
});

// node_modules/inflight/inflight.js
var require_inflight = __commonJS((exports, module) => {
  var inflight = function(key, cb) {
    if (reqs[key]) {
      reqs[key].push(cb);
      return null;
    } else {
      reqs[key] = [cb];
      return makeres(key);
    }
  };
  var makeres = function(key) {
    return once(function RES() {
      var cbs = reqs[key];
      var len = cbs.length;
      var args = slice(arguments);
      try {
        for (var i = 0;i < len; i++) {
          cbs[i].apply(null, args);
        }
      } finally {
        if (cbs.length > len) {
          cbs.splice(0, len);
          process.nextTick(function() {
            RES.apply(null, args);
          });
        } else {
          delete reqs[key];
        }
      }
    });
  };
  var slice = function(args) {
    var length = args.length;
    var array = [];
    for (var i = 0;i < length; i++)
      array[i] = args[i];
    return array;
  };
  var wrappy = require_wrappy();
  var reqs = Object.create(null);
  var once = require_once();
  module.exports = wrappy(inflight);
});

// node_modules/glob/glob.js
var require_glob = __commonJS((exports, module) => {
  var glob = function(pattern, options, cb) {
    if (typeof options === "function")
      cb = options, options = {};
    if (!options)
      options = {};
    if (options.sync) {
      if (cb)
        throw new TypeError("callback provided to sync glob");
      return globSync(pattern, options);
    }
    return new Glob(pattern, options, cb);
  };
  var extend = function(origin, add) {
    if (add === null || typeof add !== "object") {
      return origin;
    }
    var keys = Object.keys(add);
    var i = keys.length;
    while (i--) {
      origin[keys[i]] = add[keys[i]];
    }
    return origin;
  };
  var Glob = function(pattern, options, cb) {
    if (typeof options === "function") {
      cb = options;
      options = null;
    }
    if (options && options.sync) {
      if (cb)
        throw new TypeError("callback provided to sync glob");
      return new GlobSync(pattern, options);
    }
    if (!(this instanceof Glob))
      return new Glob(pattern, options, cb);
    setopts(this, pattern, options);
    this._didRealPath = false;
    var n = this.minimatch.set.length;
    this.matches = new Array(n);
    if (typeof cb === "function") {
      cb = once(cb);
      this.on("error", cb);
      this.on("end", function(matches) {
        cb(null, matches);
      });
    }
    var self2 = this;
    this._processing = 0;
    this._emitQueue = [];
    this._processQueue = [];
    this.paused = false;
    if (this.noprocess)
      return this;
    if (n === 0)
      return done();
    var sync = true;
    for (var i = 0;i < n; i++) {
      this._process(this.minimatch.set[i], i, false, done);
    }
    sync = false;
    function done() {
      --self2._processing;
      if (self2._processing <= 0) {
        if (sync) {
          process.nextTick(function() {
            self2._finish();
          });
        } else {
          self2._finish();
        }
      }
    }
  };
  var readdirCb = function(self2, abs, cb) {
    return function(er, entries) {
      if (er)
        self2._readdirError(abs, er, cb);
      else
        self2._readdirEntries(abs, entries, cb);
    };
  };
  module.exports = glob;
  var rp = require_fs();
  var minimatch = require_minimatch();
  var Minimatch = minimatch.Minimatch;
  var inherits = require_inherits_browser();
  var EE = import.meta.require("events").EventEmitter;
  var path3 = import.meta.require("path");
  var assert = import.meta.require("assert");
  var isAbsolute = require_path_is_absolute();
  var globSync = require_sync();
  var common = require_common();
  var setopts = common.setopts;
  var ownProp = common.ownProp;
  var inflight = require_inflight();
  var util = import.meta.require("util");
  var childrenIgnored = common.childrenIgnored;
  var isIgnored = common.isIgnored;
  var once = require_once();
  glob.sync = globSync;
  var GlobSync = glob.GlobSync = globSync.GlobSync;
  glob.glob = glob;
  glob.hasMagic = function(pattern, options_) {
    var options = extend({}, options_);
    options.noprocess = true;
    var g = new Glob(pattern, options);
    var set = g.minimatch.set;
    if (!pattern)
      return false;
    if (set.length > 1)
      return true;
    for (var j = 0;j < set[0].length; j++) {
      if (typeof set[0][j] !== "string")
        return true;
    }
    return false;
  };
  glob.Glob = Glob;
  inherits(Glob, EE);
  Glob.prototype._finish = function() {
    assert(this instanceof Glob);
    if (this.aborted)
      return;
    if (this.realpath && !this._didRealpath)
      return this._realpath();
    common.finish(this);
    this.emit("end", this.found);
  };
  Glob.prototype._realpath = function() {
    if (this._didRealpath)
      return;
    this._didRealpath = true;
    var n = this.matches.length;
    if (n === 0)
      return this._finish();
    var self2 = this;
    for (var i = 0;i < this.matches.length; i++)
      this._realpathSet(i, next);
    function next() {
      if (--n === 0)
        self2._finish();
    }
  };
  Glob.prototype._realpathSet = function(index, cb) {
    var matchset = this.matches[index];
    if (!matchset)
      return cb();
    var found = Object.keys(matchset);
    var self2 = this;
    var n = found.length;
    if (n === 0)
      return cb();
    var set = this.matches[index] = Object.create(null);
    found.forEach(function(p, i) {
      p = self2._makeAbs(p);
      rp.realpath(p, self2.realpathCache, function(er, real) {
        if (!er)
          set[real] = true;
        else if (er.syscall === "stat")
          set[p] = true;
        else
          self2.emit("error", er);
        if (--n === 0) {
          self2.matches[index] = set;
          cb();
        }
      });
    });
  };
  Glob.prototype._mark = function(p) {
    return common.mark(this, p);
  };
  Glob.prototype._makeAbs = function(f) {
    return common.makeAbs(this, f);
  };
  Glob.prototype.abort = function() {
    this.aborted = true;
    this.emit("abort");
  };
  Glob.prototype.pause = function() {
    if (!this.paused) {
      this.paused = true;
      this.emit("pause");
    }
  };
  Glob.prototype.resume = function() {
    if (this.paused) {
      this.emit("resume");
      this.paused = false;
      if (this._emitQueue.length) {
        var eq = this._emitQueue.slice(0);
        this._emitQueue.length = 0;
        for (var i = 0;i < eq.length; i++) {
          var e = eq[i];
          this._emitMatch(e[0], e[1]);
        }
      }
      if (this._processQueue.length) {
        var pq = this._processQueue.slice(0);
        this._processQueue.length = 0;
        for (var i = 0;i < pq.length; i++) {
          var p = pq[i];
          this._processing--;
          this._process(p[0], p[1], p[2], p[3]);
        }
      }
    }
  };
  Glob.prototype._process = function(pattern, index, inGlobStar, cb) {
    assert(this instanceof Glob);
    assert(typeof cb === "function");
    if (this.aborted)
      return;
    this._processing++;
    if (this.paused) {
      this._processQueue.push([pattern, index, inGlobStar, cb]);
      return;
    }
    var n = 0;
    while (typeof pattern[n] === "string") {
      n++;
    }
    var prefix;
    switch (n) {
      case pattern.length:
        this._processSimple(pattern.join("/"), index, cb);
        return;
      case 0:
        prefix = null;
        break;
      default:
        prefix = pattern.slice(0, n).join("/");
        break;
    }
    var remain = pattern.slice(n);
    var read;
    if (prefix === null)
      read = ".";
    else if (isAbsolute(prefix) || isAbsolute(pattern.map(function(p) {
      return typeof p === "string" ? p : "[*]";
    }).join("/"))) {
      if (!prefix || !isAbsolute(prefix))
        prefix = "/" + prefix;
      read = prefix;
    } else
      read = prefix;
    var abs = this._makeAbs(read);
    if (childrenIgnored(this, read))
      return cb();
    var isGlobStar = remain[0] === minimatch.GLOBSTAR;
    if (isGlobStar)
      this._processGlobStar(prefix, read, abs, remain, index, inGlobStar, cb);
    else
      this._processReaddir(prefix, read, abs, remain, index, inGlobStar, cb);
  };
  Glob.prototype._processReaddir = function(prefix, read, abs, remain, index, inGlobStar, cb) {
    var self2 = this;
    this._readdir(abs, inGlobStar, function(er, entries) {
      return self2._processReaddir2(prefix, read, abs, remain, index, inGlobStar, entries, cb);
    });
  };
  Glob.prototype._processReaddir2 = function(prefix, read, abs, remain, index, inGlobStar, entries, cb) {
    if (!entries)
      return cb();
    var pn = remain[0];
    var negate = !!this.minimatch.negate;
    var rawGlob = pn._glob;
    var dotOk = this.dot || rawGlob.charAt(0) === ".";
    var matchedEntries = [];
    for (var i = 0;i < entries.length; i++) {
      var e = entries[i];
      if (e.charAt(0) !== "." || dotOk) {
        var m;
        if (negate && !prefix) {
          m = !e.match(pn);
        } else {
          m = e.match(pn);
        }
        if (m)
          matchedEntries.push(e);
      }
    }
    var len = matchedEntries.length;
    if (len === 0)
      return cb();
    if (remain.length === 1 && !this.mark && !this.stat) {
      if (!this.matches[index])
        this.matches[index] = Object.create(null);
      for (var i = 0;i < len; i++) {
        var e = matchedEntries[i];
        if (prefix) {
          if (prefix !== "/")
            e = prefix + "/" + e;
          else
            e = prefix + e;
        }
        if (e.charAt(0) === "/" && !this.nomount) {
          e = path3.join(this.root, e);
        }
        this._emitMatch(index, e);
      }
      return cb();
    }
    remain.shift();
    for (var i = 0;i < len; i++) {
      var e = matchedEntries[i];
      var newPattern;
      if (prefix) {
        if (prefix !== "/")
          e = prefix + "/" + e;
        else
          e = prefix + e;
      }
      this._process([e].concat(remain), index, inGlobStar, cb);
    }
    cb();
  };
  Glob.prototype._emitMatch = function(index, e) {
    if (this.aborted)
      return;
    if (isIgnored(this, e))
      return;
    if (this.paused) {
      this._emitQueue.push([index, e]);
      return;
    }
    var abs = isAbsolute(e) ? e : this._makeAbs(e);
    if (this.mark)
      e = this._mark(e);
    if (this.absolute)
      e = abs;
    if (this.matches[index][e])
      return;
    if (this.nodir) {
      var c = this.cache[abs];
      if (c === "DIR" || Array.isArray(c))
        return;
    }
    this.matches[index][e] = true;
    var st = this.statCache[abs];
    if (st)
      this.emit("stat", e, st);
    this.emit("match", e);
  };
  Glob.prototype._readdirInGlobStar = function(abs, cb) {
    if (this.aborted)
      return;
    if (this.follow)
      return this._readdir(abs, false, cb);
    var lstatkey = "lstat\0" + abs;
    var self2 = this;
    var lstatcb = inflight(lstatkey, lstatcb_);
    if (lstatcb)
      self2.fs.lstat(abs, lstatcb);
    function lstatcb_(er, lstat) {
      if (er && er.code === "ENOENT")
        return cb();
      var isSym = lstat && lstat.isSymbolicLink();
      self2.symlinks[abs] = isSym;
      if (!isSym && lstat && !lstat.isDirectory()) {
        self2.cache[abs] = "FILE";
        cb();
      } else
        self2._readdir(abs, false, cb);
    }
  };
  Glob.prototype._readdir = function(abs, inGlobStar, cb) {
    if (this.aborted)
      return;
    cb = inflight("readdir\0" + abs + "\0" + inGlobStar, cb);
    if (!cb)
      return;
    if (inGlobStar && !ownProp(this.symlinks, abs))
      return this._readdirInGlobStar(abs, cb);
    if (ownProp(this.cache, abs)) {
      var c = this.cache[abs];
      if (!c || c === "FILE")
        return cb();
      if (Array.isArray(c))
        return cb(null, c);
    }
    var self2 = this;
    self2.fs.readdir(abs, readdirCb(this, abs, cb));
  };
  Glob.prototype._readdirEntries = function(abs, entries, cb) {
    if (this.aborted)
      return;
    if (!this.mark && !this.stat) {
      for (var i = 0;i < entries.length; i++) {
        var e = entries[i];
        if (abs === "/")
          e = abs + e;
        else
          e = abs + "/" + e;
        this.cache[e] = true;
      }
    }
    this.cache[abs] = entries;
    return cb(null, entries);
  };
  Glob.prototype._readdirError = function(f, er, cb) {
    if (this.aborted)
      return;
    switch (er.code) {
      case "ENOTSUP":
      case "ENOTDIR":
        var abs = this._makeAbs(f);
        this.cache[abs] = "FILE";
        if (abs === this.cwdAbs) {
          var error2 = new Error(er.code + " invalid cwd " + this.cwd);
          error2.path = this.cwd;
          error2.code = er.code;
          this.emit("error", error2);
          this.abort();
        }
        break;
      case "ENOENT":
      case "ELOOP":
      case "ENAMETOOLONG":
      case "UNKNOWN":
        this.cache[this._makeAbs(f)] = false;
        break;
      default:
        this.cache[this._makeAbs(f)] = false;
        if (this.strict) {
          this.emit("error", er);
          this.abort();
        }
        if (!this.silent)
          console.error("glob error", er);
        break;
    }
    return cb();
  };
  Glob.prototype._processGlobStar = function(prefix, read, abs, remain, index, inGlobStar, cb) {
    var self2 = this;
    this._readdir(abs, inGlobStar, function(er, entries) {
      self2._processGlobStar2(prefix, read, abs, remain, index, inGlobStar, entries, cb);
    });
  };
  Glob.prototype._processGlobStar2 = function(prefix, read, abs, remain, index, inGlobStar, entries, cb) {
    if (!entries)
      return cb();
    var remainWithoutGlobStar = remain.slice(1);
    var gspref = prefix ? [prefix] : [];
    var noGlobStar = gspref.concat(remainWithoutGlobStar);
    this._process(noGlobStar, index, false, cb);
    var isSym = this.symlinks[abs];
    var len = entries.length;
    if (isSym && inGlobStar)
      return cb();
    for (var i = 0;i < len; i++) {
      var e = entries[i];
      if (e.charAt(0) === "." && !this.dot)
        continue;
      var instead = gspref.concat(entries[i], remainWithoutGlobStar);
      this._process(instead, index, true, cb);
      var below = gspref.concat(entries[i], remain);
      this._process(below, index, true, cb);
    }
    cb();
  };
  Glob.prototype._processSimple = function(prefix, index, cb) {
    var self2 = this;
    this._stat(prefix, function(er, exists) {
      self2._processSimple2(prefix, index, er, exists, cb);
    });
  };
  Glob.prototype._processSimple2 = function(prefix, index, er, exists, cb) {
    if (!this.matches[index])
      this.matches[index] = Object.create(null);
    if (!exists)
      return cb();
    if (prefix && isAbsolute(prefix) && !this.nomount) {
      var trail = /[\/\\]$/.test(prefix);
      if (prefix.charAt(0) === "/") {
        prefix = path3.join(this.root, prefix);
      } else {
        prefix = path3.resolve(this.root, prefix);
        if (trail)
          prefix += "/";
      }
    }
    if (process.platform === "win32")
      prefix = prefix.replace(/\\/g, "/");
    this._emitMatch(index, prefix);
    cb();
  };
  Glob.prototype._stat = function(f, cb) {
    var abs = this._makeAbs(f);
    var needDir = f.slice(-1) === "/";
    if (f.length > this.maxLength)
      return cb();
    if (!this.stat && ownProp(this.cache, abs)) {
      var c = this.cache[abs];
      if (Array.isArray(c))
        c = "DIR";
      if (!needDir || c === "DIR")
        return cb(null, c);
      if (needDir && c === "FILE")
        return cb();
    }
    var exists;
    var stat = this.statCache[abs];
    if (stat !== undefined) {
      if (stat === false)
        return cb(null, stat);
      else {
        var type = stat.isDirectory() ? "DIR" : "FILE";
        if (needDir && type === "FILE")
          return cb();
        else
          return cb(null, type, stat);
      }
    }
    var self2 = this;
    var statcb = inflight("stat\0" + abs, lstatcb_);
    if (statcb)
      self2.fs.lstat(abs, statcb);
    function lstatcb_(er, lstat) {
      if (lstat && lstat.isSymbolicLink()) {
        return self2.fs.stat(abs, function(er2, stat2) {
          if (er2)
            self2._stat2(f, abs, null, lstat, cb);
          else
            self2._stat2(f, abs, er2, stat2, cb);
        });
      } else {
        self2._stat2(f, abs, er, lstat, cb);
      }
    }
  };
  Glob.prototype._stat2 = function(f, abs, er, stat, cb) {
    if (er && (er.code === "ENOENT" || er.code === "ENOTDIR")) {
      this.statCache[abs] = false;
      return cb();
    }
    var needDir = f.slice(-1) === "/";
    this.statCache[abs] = stat;
    if (abs.slice(-1) === "/" && stat && !stat.isDirectory())
      return cb(null, false, stat);
    var c = true;
    if (stat)
      c = stat.isDirectory() ? "DIR" : "FILE";
    this.cache[abs] = this.cache[abs] || c;
    if (needDir && c === "FILE")
      return cb();
    return cb(null, c, stat);
  };
});

// node_modules/rimraf/rimraf.js
var require_rimraf = __commonJS((exports, module) => {
  var assert = import.meta.require("assert");
  var path3 = import.meta.require("path");
  var fs = import.meta.require("fs");
  var glob = undefined;
  try {
    glob = require_glob();
  } catch (_err) {
  }
  var defaultGlobOpts = {
    nosort: true,
    silent: true
  };
  var timeout = 0;
  var isWindows = process.platform === "win32";
  var defaults = (options) => {
    const methods = [
      "unlink",
      "chmod",
      "stat",
      "lstat",
      "rmdir",
      "readdir"
    ];
    methods.forEach((m) => {
      options[m] = options[m] || fs[m];
      m = m + "Sync";
      options[m] = options[m] || fs[m];
    });
    options.maxBusyTries = options.maxBusyTries || 3;
    options.emfileWait = options.emfileWait || 1000;
    if (options.glob === false) {
      options.disableGlob = true;
    }
    if (options.disableGlob !== true && glob === undefined) {
      throw Error("glob dependency not found, set `options.disableGlob = true` if intentional");
    }
    options.disableGlob = options.disableGlob || false;
    options.glob = options.glob || defaultGlobOpts;
  };
  var rimraf = (p, options, cb) => {
    if (typeof options === "function") {
      cb = options;
      options = {};
    }
    assert(p, "rimraf: missing path");
    assert.equal(typeof p, "string", "rimraf: path should be a string");
    assert.equal(typeof cb, "function", "rimraf: callback function required");
    assert(options, "rimraf: invalid options argument provided");
    assert.equal(typeof options, "object", "rimraf: options should be object");
    defaults(options);
    let busyTries = 0;
    let errState = null;
    let n = 0;
    const next = (er) => {
      errState = errState || er;
      if (--n === 0)
        cb(errState);
    };
    const afterGlob = (er, results) => {
      if (er)
        return cb(er);
      n = results.length;
      if (n === 0)
        return cb();
      results.forEach((p2) => {
        const CB = (er2) => {
          if (er2) {
            if ((er2.code === "EBUSY" || er2.code === "ENOTEMPTY" || er2.code === "EPERM") && busyTries < options.maxBusyTries) {
              busyTries++;
              return setTimeout(() => rimraf_(p2, options, CB), busyTries * 100);
            }
            if (er2.code === "EMFILE" && timeout < options.emfileWait) {
              return setTimeout(() => rimraf_(p2, options, CB), timeout++);
            }
            if (er2.code === "ENOENT")
              er2 = null;
          }
          timeout = 0;
          next(er2);
        };
        rimraf_(p2, options, CB);
      });
    };
    if (options.disableGlob || !glob.hasMagic(p))
      return afterGlob(null, [p]);
    options.lstat(p, (er, stat) => {
      if (!er)
        return afterGlob(null, [p]);
      glob(p, options.glob, afterGlob);
    });
  };
  var rimraf_ = (p, options, cb) => {
    assert(p);
    assert(options);
    assert(typeof cb === "function");
    options.lstat(p, (er, st) => {
      if (er && er.code === "ENOENT")
        return cb(null);
      if (er && er.code === "EPERM" && isWindows)
        fixWinEPERM(p, options, er, cb);
      if (st && st.isDirectory())
        return rmdir(p, options, er, cb);
      options.unlink(p, (er2) => {
        if (er2) {
          if (er2.code === "ENOENT")
            return cb(null);
          if (er2.code === "EPERM")
            return isWindows ? fixWinEPERM(p, options, er2, cb) : rmdir(p, options, er2, cb);
          if (er2.code === "EISDIR")
            return rmdir(p, options, er2, cb);
        }
        return cb(er2);
      });
    });
  };
  var fixWinEPERM = (p, options, er, cb) => {
    assert(p);
    assert(options);
    assert(typeof cb === "function");
    options.chmod(p, 438, (er2) => {
      if (er2)
        cb(er2.code === "ENOENT" ? null : er);
      else
        options.stat(p, (er3, stats) => {
          if (er3)
            cb(er3.code === "ENOENT" ? null : er);
          else if (stats.isDirectory())
            rmdir(p, options, er, cb);
          else
            options.unlink(p, cb);
        });
    });
  };
  var fixWinEPERMSync = (p, options, er) => {
    assert(p);
    assert(options);
    try {
      options.chmodSync(p, 438);
    } catch (er2) {
      if (er2.code === "ENOENT")
        return;
      else
        throw er;
    }
    let stats;
    try {
      stats = options.statSync(p);
    } catch (er3) {
      if (er3.code === "ENOENT")
        return;
      else
        throw er;
    }
    if (stats.isDirectory())
      rmdirSync(p, options, er);
    else
      options.unlinkSync(p);
  };
  var rmdir = (p, options, originalEr, cb) => {
    assert(p);
    assert(options);
    assert(typeof cb === "function");
    options.rmdir(p, (er) => {
      if (er && (er.code === "ENOTEMPTY" || er.code === "EEXIST" || er.code === "EPERM"))
        rmkids(p, options, cb);
      else if (er && er.code === "ENOTDIR")
        cb(originalEr);
      else
        cb(er);
    });
  };
  var rmkids = (p, options, cb) => {
    assert(p);
    assert(options);
    assert(typeof cb === "function");
    options.readdir(p, (er, files) => {
      if (er)
        return cb(er);
      let n = files.length;
      if (n === 0)
        return options.rmdir(p, cb);
      let errState;
      files.forEach((f) => {
        rimraf(path3.join(p, f), options, (er2) => {
          if (errState)
            return;
          if (er2)
            return cb(errState = er2);
          if (--n === 0)
            options.rmdir(p, cb);
        });
      });
    });
  };
  var rimrafSync = (p, options) => {
    options = options || {};
    defaults(options);
    assert(p, "rimraf: missing path");
    assert.equal(typeof p, "string", "rimraf: path should be a string");
    assert(options, "rimraf: missing options");
    assert.equal(typeof options, "object", "rimraf: options should be object");
    let results;
    if (options.disableGlob || !glob.hasMagic(p)) {
      results = [p];
    } else {
      try {
        options.lstatSync(p);
        results = [p];
      } catch (er) {
        results = glob.sync(p, options.glob);
      }
    }
    if (!results.length)
      return;
    for (let i = 0;i < results.length; i++) {
      const p2 = results[i];
      let st;
      try {
        st = options.lstatSync(p2);
      } catch (er) {
        if (er.code === "ENOENT")
          return;
        if (er.code === "EPERM" && isWindows)
          fixWinEPERMSync(p2, options, er);
      }
      try {
        if (st && st.isDirectory())
          rmdirSync(p2, options, null);
        else
          options.unlinkSync(p2);
      } catch (er) {
        if (er.code === "ENOENT")
          return;
        if (er.code === "EPERM")
          return isWindows ? fixWinEPERMSync(p2, options, er) : rmdirSync(p2, options, er);
        if (er.code !== "EISDIR")
          throw er;
        rmdirSync(p2, options, er);
      }
    }
  };
  var rmdirSync = (p, options, originalEr) => {
    assert(p);
    assert(options);
    try {
      options.rmdirSync(p);
    } catch (er) {
      if (er.code === "ENOENT")
        return;
      if (er.code === "ENOTDIR")
        throw originalEr;
      if (er.code === "ENOTEMPTY" || er.code === "EEXIST" || er.code === "EPERM")
        rmkidsSync(p, options);
    }
  };
  var rmkidsSync = (p, options) => {
    assert(p);
    assert(options);
    options.readdirSync(p).forEach((f) => rimrafSync(path3.join(p, f), options));
    const retries = isWindows ? 100 : 1;
    let i = 0;
    do {
      let threw = true;
      try {
        const ret = options.rmdirSync(p, options);
        threw = false;
        return ret;
      } finally {
        if (++i < retries && threw)
          continue;
      }
    } while (true);
  };
  module.exports = rimraf;
  rimraf.sync = rimrafSync;
});

// node_modules/download-git-repo/index.js
var require_download_git_repo = __commonJS((exports, module) => {
  var download = function(repo, dest, opts, fn) {
    if (typeof opts === "function") {
      fn = opts;
      opts = null;
    }
    opts = opts || {};
    var clone = opts.clone || false;
    delete opts.clone;
    repo = normalize2(repo);
    var url = repo.url || getUrl(repo, clone);
    if (clone) {
      var cloneOptions = {
        checkout: repo.checkout,
        shallow: repo.checkout === "master",
        ...opts
      };
      gitclone(url, dest, cloneOptions, function(err) {
        if (err === undefined) {
          rm(dest + "/.git");
          fn();
        } else {
          fn(err);
        }
      });
    } else {
      var downloadOptions = {
        extract: true,
        strip: 1,
        mode: "666",
        ...opts,
        headers: {
          accept: "application/zip",
          ...opts.headers || {}
        }
      };
      downloadUrl(url, dest, downloadOptions).then(function(data) {
        fn();
      }).catch(function(err) {
        fn(err);
      });
    }
  };
  var normalize2 = function(repo) {
    var regex = /^(?:(direct):([^#]+)(?:#(.+))?)$/;
    var match = regex.exec(repo);
    if (match) {
      var url = match[2];
      var directCheckout = match[3] || "master";
      return {
        type: "direct",
        url,
        checkout: directCheckout
      };
    } else {
      regex = /^(?:(github|gitlab|bitbucket):)?(?:(.+):)?([^/]+)\/([^#]+)(?:#(.+))?$/;
      match = regex.exec(repo);
      var type = match[1] || "github";
      var origin = match[2] || null;
      var owner = match[3];
      var name2 = match[4];
      var checkout = match[5] || "master";
      if (origin == null) {
        if (type === "github") {
          origin = "github.com";
        } else if (type === "gitlab") {
          origin = "gitlab.com";
        } else if (type === "bitbucket") {
          origin = "bitbucket.org";
        }
      }
      return {
        type,
        origin,
        owner,
        name: name2,
        checkout
      };
    }
  };
  var addProtocol = function(origin, clone) {
    if (!/^(f|ht)tps?:\/\//i.test(origin)) {
      if (clone) {
        origin = "git@" + origin;
      } else {
        origin = "https://" + origin;
      }
    }
    return origin;
  };
  var getUrl = function(repo, clone) {
    var url;
    var origin = addProtocol(repo.origin, clone);
    if (/^git@/i.test(origin)) {
      origin = origin + ":";
    } else {
      origin = origin + "/";
    }
    if (clone) {
      url = origin + repo.owner + "/" + repo.name + ".git";
    } else {
      if (repo.type === "github") {
        url = origin + repo.owner + "/" + repo.name + "/archive/" + repo.checkout + ".zip";
      } else if (repo.type === "gitlab") {
        url = origin + repo.owner + "/" + repo.name + "/repository/archive.zip?ref=" + repo.checkout;
      } else if (repo.type === "bitbucket") {
        url = origin + repo.owner + "/" + repo.name + "/get/" + repo.checkout + ".zip";
      }
    }
    return url;
  };
  var downloadUrl = require_download();
  var gitclone = require_git_clone();
  var rm = require_rimraf().sync;
  module.exports = download;
});

// index.ts
import path3 from "path";
import fs from "fs";

// package.json
var name = "create-hihono";
var version = "0.2.9";

// src/cli.ts
import * as readline from "readline";
var prompt = function(question, initial) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  question = `${konsol.green("?")} ${question} `;
  if (initial) {
    question += konsol.italic(konsol.grey(`(${initial}) `));
  }
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      const answered = initial && !answer ? initial : answer;
      resolve(answered);
      rl.close();
    });
    rl.prompt();
  }).then((answer) => {
    rl.setPrompt(answer);
    return answer;
  });
};
var confirm = function(question, initial) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  question = `${konsol.green("?")} ${question} `;
  if (initial) {
    question += "[Y/n] ";
  } else {
    question += "[y/N] ";
  }
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      const isYes = answer === "y" || answer === "Y" || answer === "yes" || answer === "YES" || answer === "Yes";
      const answered = initial && !answer ? initial : isYes;
      resolve(answered);
      rl.close();
    });
  });
};
var styles = {
  bold: "\x1B[1m",
  italic: "\x1B[3m",
  underline: "\x1B[4m",
  reset: "\x1B[0m",
  red: "\x1B[31m",
  green: "\x1B[32m",
  yellow: "\x1B[33m",
  blue: "\x1B[34m",
  magenta: "\x1B[35m",
  cyan: "\x1B[36m",
  white: "\x1B[37m",
  grey: "\x1B[90m"
};

class StyledText {
  text;
  constructor(text) {
    this.text = text;
  }
  applyStyle(style) {
    return `${styles[style]}${this.text}${styles.reset}`;
  }
}
var konsol = {
  blue: (text) => new StyledText(text).applyStyle("blue"),
  bold: (text) => new StyledText(text).applyStyle("bold"),
  red: (text) => new StyledText(text).applyStyle("red"),
  green: (text) => new StyledText(text).applyStyle("green"),
  yellow: (text) => new StyledText(text).applyStyle("yellow"),
  white: (text) => new StyledText(text).applyStyle("white"),
  grey: (text) => new StyledText(text).applyStyle("grey"),
  italic: (text) => new StyledText(text).applyStyle("italic"),
  underline: (text) => new StyledText(text).applyStyle("underline"),
  reset: (text) => new StyledText(text).applyStyle("reset"),
  log: (text) => console.log(text)
};

// src/hooks/dependencies.ts
import {exec} from "child_process";
import {chdir, exit} from "process";

// src/hook.ts
class Hook {
  #hookMap;
  constructor() {
    this.#hookMap = new Map;
  }
  addHook(templateName, hook) {
    const names = Array.isArray(templateName) ? templateName : [templateName];
    for (const name2 of names) {
      const hooks = this.#hookMap.get(name2) || [];
      hooks.push(hook);
      this.#hookMap.set(name2, hooks);
    }
  }
  applyHook(templateName, ...hookOptions) {
    const hooks = this.#hookMap.get(templateName);
    const results = [];
    if (hooks) {
      hooks.forEach((hook) => {
        results.push(hook(...hookOptions));
      });
    }
    return results;
  }
}
var afterCreateHook = new Hook;
var projectDependenciesHook = new Hook;

// node_modules/execa/index.js
var import_cross_spawn = __toESM(require_cross_spawn(), 1);
import {Buffer as Buffer3} from "buffer";
import path2 from "path";
import childProcess from "child_process";
import process6 from "process";

// node_modules/strip-final-newline/index.js
function stripFinalNewline(input) {
  const LF = typeof input === "string" ? "\n" : "\n".charCodeAt();
  const CR = typeof input === "string" ? "\r" : "\r".charCodeAt();
  if (input[input.length - 1] === LF) {
    input = input.slice(0, -1);
  }
  if (input[input.length - 1] === CR) {
    input = input.slice(0, -1);
  }
  return input;
}

// node_modules/npm-run-path/index.js
import process2 from "process";
import path from "path";
import {fileURLToPath} from "url";

// node_modules/npm-run-path/node_modules/path-key/index.js
function pathKey(options = {}) {
  const {
    env = process.env,
    platform = process.platform
  } = options;
  if (platform !== "win32") {
    return "PATH";
  }
  return Object.keys(env).reverse().find((key) => key.toUpperCase() === "PATH") || "Path";
}

// node_modules/npm-run-path/index.js
var npmRunPath = ({
  cwd = process2.cwd(),
  path: pathOption = process2.env[pathKey()],
  preferLocal = true,
  execPath = process2.execPath,
  addExecPath = true
} = {}) => {
  const cwdString = cwd instanceof URL ? fileURLToPath(cwd) : cwd;
  const cwdPath = path.resolve(cwdString);
  const result = [];
  if (preferLocal) {
    applyPreferLocal(result, cwdPath);
  }
  if (addExecPath) {
    applyExecPath(result, execPath, cwdPath);
  }
  return [...result, pathOption].join(path.delimiter);
};
var applyPreferLocal = (result, cwdPath) => {
  let previous;
  while (previous !== cwdPath) {
    result.push(path.join(cwdPath, "node_modules/.bin"));
    previous = cwdPath;
    cwdPath = path.resolve(cwdPath, "..");
  }
};
var applyExecPath = (result, execPath, cwdPath) => {
  const execPathString = execPath instanceof URL ? fileURLToPath(execPath) : execPath;
  result.push(path.resolve(cwdPath, execPathString, ".."));
};
var npmRunPathEnv = ({ env = process2.env, ...options } = {}) => {
  env = { ...env };
  const pathName = pathKey({ env });
  options.path = env[pathName];
  env[pathName] = npmRunPath(options);
  return env;
};

// node_modules/mimic-fn/index.js
var copyProperty = (to, from, property, ignoreNonConfigurable) => {
  if (property === "length" || property === "prototype") {
    return;
  }
  if (property === "arguments" || property === "caller") {
    return;
  }
  const toDescriptor = Object.getOwnPropertyDescriptor(to, property);
  const fromDescriptor = Object.getOwnPropertyDescriptor(from, property);
  if (!canCopyProperty(toDescriptor, fromDescriptor) && ignoreNonConfigurable) {
    return;
  }
  Object.defineProperty(to, property, fromDescriptor);
};
var canCopyProperty = function(toDescriptor, fromDescriptor) {
  return toDescriptor === undefined || toDescriptor.configurable || toDescriptor.writable === fromDescriptor.writable && toDescriptor.enumerable === fromDescriptor.enumerable && toDescriptor.configurable === fromDescriptor.configurable && (toDescriptor.writable || toDescriptor.value === fromDescriptor.value);
};
var changePrototype = (to, from) => {
  const fromPrototype = Object.getPrototypeOf(from);
  if (fromPrototype === Object.getPrototypeOf(to)) {
    return;
  }
  Object.setPrototypeOf(to, fromPrototype);
};
var wrappedToString = (withName, fromBody) => `/* Wrapped ${withName}*/\n${fromBody}`;
var toStringDescriptor = Object.getOwnPropertyDescriptor(Function.prototype, "toString");
var toStringName = Object.getOwnPropertyDescriptor(Function.prototype.toString, "name");
var changeToString = (to, from, name2) => {
  const withName = name2 === "" ? "" : `with ${name2.trim()}() `;
  const newToString = wrappedToString.bind(null, withName, from.toString());
  Object.defineProperty(newToString, "name", toStringName);
  Object.defineProperty(to, "toString", { ...toStringDescriptor, value: newToString });
};
function mimicFunction(to, from, { ignoreNonConfigurable = false } = {}) {
  const { name: name2 } = to;
  for (const property of Reflect.ownKeys(from)) {
    copyProperty(to, from, property, ignoreNonConfigurable);
  }
  changePrototype(to, from);
  changeToString(to, from, name2);
  return to;
}

// node_modules/onetime/index.js
var calledFunctions = new WeakMap;
var onetime = (function_, options = {}) => {
  if (typeof function_ !== "function") {
    throw new TypeError("Expected a function");
  }
  let returnValue;
  let callCount = 0;
  const functionName = function_.displayName || function_.name || "<anonymous>";
  const onetime2 = function(...arguments_) {
    calledFunctions.set(onetime2, ++callCount);
    if (callCount === 1) {
      returnValue = function_.apply(this, arguments_);
      function_ = null;
    } else if (options.throw === true) {
      throw new Error(`Function \`${functionName}\` can only be called once`);
    }
    return returnValue;
  };
  mimicFunction(onetime2, function_);
  calledFunctions.set(onetime2, callCount);
  return onetime2;
};
onetime.callCount = (function_) => {
  if (!calledFunctions.has(function_)) {
    throw new Error(`The given function \`${function_.name}\` is not wrapped by the \`onetime\` package`);
  }
  return calledFunctions.get(function_);
};
var onetime_default = onetime;

// node_modules/execa/lib/error.js
import process3 from "process";

// node_modules/human-signals/build/src/main.js
import {constants as constants2} from "os";

// node_modules/human-signals/build/src/realtime.js
var getRealtimeSignals = () => {
  const length = SIGRTMAX - SIGRTMIN + 1;
  return Array.from({ length }, getRealtimeSignal);
};
var getRealtimeSignal = (value, index) => ({
  name: `SIGRT${index + 1}`,
  number: SIGRTMIN + index,
  action: "terminate",
  description: "Application-specific signal (realtime)",
  standard: "posix"
});
var SIGRTMIN = 34;
var SIGRTMAX = 64;

// node_modules/human-signals/build/src/signals.js
import {constants} from "os";

// node_modules/human-signals/build/src/core.js
var SIGNALS = [
  {
    name: "SIGHUP",
    number: 1,
    action: "terminate",
    description: "Terminal closed",
    standard: "posix"
  },
  {
    name: "SIGINT",
    number: 2,
    action: "terminate",
    description: "User interruption with CTRL-C",
    standard: "ansi"
  },
  {
    name: "SIGQUIT",
    number: 3,
    action: "core",
    description: "User interruption with CTRL-\\",
    standard: "posix"
  },
  {
    name: "SIGILL",
    number: 4,
    action: "core",
    description: "Invalid machine instruction",
    standard: "ansi"
  },
  {
    name: "SIGTRAP",
    number: 5,
    action: "core",
    description: "Debugger breakpoint",
    standard: "posix"
  },
  {
    name: "SIGABRT",
    number: 6,
    action: "core",
    description: "Aborted",
    standard: "ansi"
  },
  {
    name: "SIGIOT",
    number: 6,
    action: "core",
    description: "Aborted",
    standard: "bsd"
  },
  {
    name: "SIGBUS",
    number: 7,
    action: "core",
    description: "Bus error due to misaligned, non-existing address or paging error",
    standard: "bsd"
  },
  {
    name: "SIGEMT",
    number: 7,
    action: "terminate",
    description: "Command should be emulated but is not implemented",
    standard: "other"
  },
  {
    name: "SIGFPE",
    number: 8,
    action: "core",
    description: "Floating point arithmetic error",
    standard: "ansi"
  },
  {
    name: "SIGKILL",
    number: 9,
    action: "terminate",
    description: "Forced termination",
    standard: "posix",
    forced: true
  },
  {
    name: "SIGUSR1",
    number: 10,
    action: "terminate",
    description: "Application-specific signal",
    standard: "posix"
  },
  {
    name: "SIGSEGV",
    number: 11,
    action: "core",
    description: "Segmentation fault",
    standard: "ansi"
  },
  {
    name: "SIGUSR2",
    number: 12,
    action: "terminate",
    description: "Application-specific signal",
    standard: "posix"
  },
  {
    name: "SIGPIPE",
    number: 13,
    action: "terminate",
    description: "Broken pipe or socket",
    standard: "posix"
  },
  {
    name: "SIGALRM",
    number: 14,
    action: "terminate",
    description: "Timeout or timer",
    standard: "posix"
  },
  {
    name: "SIGTERM",
    number: 15,
    action: "terminate",
    description: "Termination",
    standard: "ansi"
  },
  {
    name: "SIGSTKFLT",
    number: 16,
    action: "terminate",
    description: "Stack is empty or overflowed",
    standard: "other"
  },
  {
    name: "SIGCHLD",
    number: 17,
    action: "ignore",
    description: "Child process terminated, paused or unpaused",
    standard: "posix"
  },
  {
    name: "SIGCLD",
    number: 17,
    action: "ignore",
    description: "Child process terminated, paused or unpaused",
    standard: "other"
  },
  {
    name: "SIGCONT",
    number: 18,
    action: "unpause",
    description: "Unpaused",
    standard: "posix",
    forced: true
  },
  {
    name: "SIGSTOP",
    number: 19,
    action: "pause",
    description: "Paused",
    standard: "posix",
    forced: true
  },
  {
    name: "SIGTSTP",
    number: 20,
    action: "pause",
    description: "Paused using CTRL-Z or \"suspend\"",
    standard: "posix"
  },
  {
    name: "SIGTTIN",
    number: 21,
    action: "pause",
    description: "Background process cannot read terminal input",
    standard: "posix"
  },
  {
    name: "SIGBREAK",
    number: 21,
    action: "terminate",
    description: "User interruption with CTRL-BREAK",
    standard: "other"
  },
  {
    name: "SIGTTOU",
    number: 22,
    action: "pause",
    description: "Background process cannot write to terminal output",
    standard: "posix"
  },
  {
    name: "SIGURG",
    number: 23,
    action: "ignore",
    description: "Socket received out-of-band data",
    standard: "bsd"
  },
  {
    name: "SIGXCPU",
    number: 24,
    action: "core",
    description: "Process timed out",
    standard: "bsd"
  },
  {
    name: "SIGXFSZ",
    number: 25,
    action: "core",
    description: "File too big",
    standard: "bsd"
  },
  {
    name: "SIGVTALRM",
    number: 26,
    action: "terminate",
    description: "Timeout or timer",
    standard: "bsd"
  },
  {
    name: "SIGPROF",
    number: 27,
    action: "terminate",
    description: "Timeout or timer",
    standard: "bsd"
  },
  {
    name: "SIGWINCH",
    number: 28,
    action: "ignore",
    description: "Terminal window size changed",
    standard: "bsd"
  },
  {
    name: "SIGIO",
    number: 29,
    action: "terminate",
    description: "I/O is available",
    standard: "other"
  },
  {
    name: "SIGPOLL",
    number: 29,
    action: "terminate",
    description: "Watched event",
    standard: "other"
  },
  {
    name: "SIGINFO",
    number: 29,
    action: "ignore",
    description: "Request for process information",
    standard: "other"
  },
  {
    name: "SIGPWR",
    number: 30,
    action: "terminate",
    description: "Device running out of power",
    standard: "systemv"
  },
  {
    name: "SIGSYS",
    number: 31,
    action: "core",
    description: "Invalid system call",
    standard: "other"
  },
  {
    name: "SIGUNUSED",
    number: 31,
    action: "terminate",
    description: "Invalid system call",
    standard: "other"
  }
];

// node_modules/human-signals/build/src/signals.js
var getSignals = () => {
  const realtimeSignals = getRealtimeSignals();
  const signals = [...SIGNALS, ...realtimeSignals].map(normalizeSignal);
  return signals;
};
var normalizeSignal = ({
  name: name2,
  number: defaultNumber,
  description,
  action,
  forced = false,
  standard
}) => {
  const {
    signals: { [name2]: constantSignal }
  } = constants;
  const supported = constantSignal !== undefined;
  const number = supported ? constantSignal : defaultNumber;
  return { name: name2, number, description, supported, action, forced, standard };
};

// node_modules/human-signals/build/src/main.js
var getSignalsByName = () => {
  const signals2 = getSignals();
  return Object.fromEntries(signals2.map(getSignalByName));
};
var getSignalByName = ({
  name: name2,
  number,
  description,
  supported,
  action,
  forced,
  standard
}) => [name2, { name: name2, number, description, supported, action, forced, standard }];
var signalsByName = getSignalsByName();
var getSignalsByNumber = () => {
  const signals2 = getSignals();
  const length = SIGRTMAX + 1;
  const signalsA = Array.from({ length }, (value, number) => getSignalByNumber(number, signals2));
  return Object.assign({}, ...signalsA);
};
var getSignalByNumber = (number, signals2) => {
  const signal = findSignalByNumber(number, signals2);
  if (signal === undefined) {
    return {};
  }
  const { name: name2, description, supported, action, forced, standard } = signal;
  return {
    [number]: {
      name: name2,
      number,
      description,
      supported,
      action,
      forced,
      standard
    }
  };
};
var findSignalByNumber = (number, signals2) => {
  const signal = signals2.find(({ name: name2 }) => constants2.signals[name2] === number);
  if (signal !== undefined) {
    return signal;
  }
  return signals2.find((signalA) => signalA.number === number);
};
var signalsByNumber = getSignalsByNumber();

// node_modules/execa/lib/error.js
var getErrorPrefix = ({ timedOut, timeout, errorCode, signal, signalDescription, exitCode, isCanceled }) => {
  if (timedOut) {
    return `timed out after ${timeout} milliseconds`;
  }
  if (isCanceled) {
    return "was canceled";
  }
  if (errorCode !== undefined) {
    return `failed with ${errorCode}`;
  }
  if (signal !== undefined) {
    return `was killed with ${signal} (${signalDescription})`;
  }
  if (exitCode !== undefined) {
    return `failed with exit code ${exitCode}`;
  }
  return "failed";
};
var makeError = ({
  stdout,
  stderr,
  all,
  error,
  signal,
  exitCode,
  command,
  escapedCommand,
  timedOut,
  isCanceled,
  killed,
  parsed: { options: { timeout, cwd = process3.cwd() } }
}) => {
  exitCode = exitCode === null ? undefined : exitCode;
  signal = signal === null ? undefined : signal;
  const signalDescription = signal === undefined ? undefined : signalsByName[signal].description;
  const errorCode = error && error.code;
  const prefix = getErrorPrefix({ timedOut, timeout, errorCode, signal, signalDescription, exitCode, isCanceled });
  const execaMessage = `Command ${prefix}: ${command}`;
  const isError = Object.prototype.toString.call(error) === "[object Error]";
  const shortMessage = isError ? `${execaMessage}\n${error.message}` : execaMessage;
  const message = [shortMessage, stderr, stdout].filter(Boolean).join("\n");
  if (isError) {
    error.originalMessage = error.message;
    error.message = message;
  } else {
    error = new Error(message);
  }
  error.shortMessage = shortMessage;
  error.command = command;
  error.escapedCommand = escapedCommand;
  error.exitCode = exitCode;
  error.signal = signal;
  error.signalDescription = signalDescription;
  error.stdout = stdout;
  error.stderr = stderr;
  error.cwd = cwd;
  if (all !== undefined) {
    error.all = all;
  }
  if ("bufferedData" in error) {
    delete error.bufferedData;
  }
  error.failed = true;
  error.timedOut = Boolean(timedOut);
  error.isCanceled = isCanceled;
  error.killed = killed && !timedOut;
  return error;
};

// node_modules/execa/lib/stdio.js
var aliases = ["stdin", "stdout", "stderr"];
var hasAlias = (options) => aliases.some((alias) => options[alias] !== undefined);
var normalizeStdio = (options) => {
  if (!options) {
    return;
  }
  const { stdio } = options;
  if (stdio === undefined) {
    return aliases.map((alias) => options[alias]);
  }
  if (hasAlias(options)) {
    throw new Error(`It's not possible to provide \`stdio\` in combination with one of ${aliases.map((alias) => `\`${alias}\``).join(", ")}`);
  }
  if (typeof stdio === "string") {
    return stdio;
  }
  if (!Array.isArray(stdio)) {
    throw new TypeError(`Expected \`stdio\` to be of type \`string\` or \`Array\`, got \`${typeof stdio}\``);
  }
  const length = Math.max(stdio.length, aliases.length);
  return Array.from({ length }, (value, index) => stdio[index]);
};

// node_modules/execa/lib/kill.js
import os from "os";

// node_modules/signal-exit/dist/mjs/signals.js
var signals2 = [];
signals2.push("SIGHUP", "SIGINT", "SIGTERM");
if (process.platform !== "win32") {
  signals2.push("SIGALRM", "SIGABRT", "SIGVTALRM", "SIGXCPU", "SIGXFSZ", "SIGUSR2", "SIGTRAP", "SIGSYS", "SIGQUIT", "SIGIOT");
}
if (process.platform === "linux") {
  signals2.push("SIGIO", "SIGPOLL", "SIGPWR", "SIGSTKFLT");
}

// node_modules/signal-exit/dist/mjs/index.js
var processOk = (process4) => !!process4 && typeof process4 === "object" && typeof process4.removeListener === "function" && typeof process4.emit === "function" && typeof process4.reallyExit === "function" && typeof process4.listeners === "function" && typeof process4.kill === "function" && typeof process4.pid === "number" && typeof process4.on === "function";
var kExitEmitter = Symbol.for("signal-exit emitter");
var global2 = globalThis;
var ObjectDefineProperty = Object.defineProperty.bind(Object);

class Emitter {
  emitted = {
    afterExit: false,
    exit: false
  };
  listeners = {
    afterExit: [],
    exit: []
  };
  count = 0;
  id = Math.random();
  constructor() {
    if (global2[kExitEmitter]) {
      return global2[kExitEmitter];
    }
    ObjectDefineProperty(global2, kExitEmitter, {
      value: this,
      writable: false,
      enumerable: false,
      configurable: false
    });
  }
  on(ev, fn) {
    this.listeners[ev].push(fn);
  }
  removeListener(ev, fn) {
    const list = this.listeners[ev];
    const i = list.indexOf(fn);
    if (i === -1) {
      return;
    }
    if (i === 0 && list.length === 1) {
      list.length = 0;
    } else {
      list.splice(i, 1);
    }
  }
  emit(ev, code, signal) {
    if (this.emitted[ev]) {
      return false;
    }
    this.emitted[ev] = true;
    let ret = false;
    for (const fn of this.listeners[ev]) {
      ret = fn(code, signal) === true || ret;
    }
    if (ev === "exit") {
      ret = this.emit("afterExit", code, signal) || ret;
    }
    return ret;
  }
}

class SignalExitBase {
}
var signalExitWrap = (handler) => {
  return {
    onExit(cb, opts) {
      return handler.onExit(cb, opts);
    },
    load() {
      return handler.load();
    },
    unload() {
      return handler.unload();
    }
  };
};

class SignalExitFallback extends SignalExitBase {
  onExit() {
    return () => {
    };
  }
  load() {
  }
  unload() {
  }
}

class SignalExit extends SignalExitBase {
  #hupSig = process4.platform === "win32" ? "SIGINT" : "SIGHUP";
  #emitter = new Emitter;
  #process;
  #originalProcessEmit;
  #originalProcessReallyExit;
  #sigListeners = {};
  #loaded = false;
  constructor(process4) {
    super();
    this.#process = process4;
    this.#sigListeners = {};
    for (const sig of signals2) {
      this.#sigListeners[sig] = () => {
        const listeners = this.#process.listeners(sig);
        let { count } = this.#emitter;
        const p = process4;
        if (typeof p.__signal_exit_emitter__ === "object" && typeof p.__signal_exit_emitter__.count === "number") {
          count += p.__signal_exit_emitter__.count;
        }
        if (listeners.length === count) {
          this.unload();
          const ret = this.#emitter.emit("exit", null, sig);
          const s = sig === "SIGHUP" ? this.#hupSig : sig;
          if (!ret)
            process4.kill(process4.pid, s);
        }
      };
    }
    this.#originalProcessReallyExit = process4.reallyExit;
    this.#originalProcessEmit = process4.emit;
  }
  onExit(cb, opts) {
    if (!processOk(this.#process)) {
      return () => {
      };
    }
    if (this.#loaded === false) {
      this.load();
    }
    const ev = opts?.alwaysLast ? "afterExit" : "exit";
    this.#emitter.on(ev, cb);
    return () => {
      this.#emitter.removeListener(ev, cb);
      if (this.#emitter.listeners["exit"].length === 0 && this.#emitter.listeners["afterExit"].length === 0) {
        this.unload();
      }
    };
  }
  load() {
    if (this.#loaded) {
      return;
    }
    this.#loaded = true;
    this.#emitter.count += 1;
    for (const sig of signals2) {
      try {
        const fn = this.#sigListeners[sig];
        if (fn)
          this.#process.on(sig, fn);
      } catch (_) {
      }
    }
    this.#process.emit = (ev, ...a) => {
      return this.#processEmit(ev, ...a);
    };
    this.#process.reallyExit = (code) => {
      return this.#processReallyExit(code);
    };
  }
  unload() {
    if (!this.#loaded) {
      return;
    }
    this.#loaded = false;
    signals2.forEach((sig) => {
      const listener = this.#sigListeners[sig];
      if (!listener) {
        throw new Error("Listener not defined for signal: " + sig);
      }
      try {
        this.#process.removeListener(sig, listener);
      } catch (_) {
      }
    });
    this.#process.emit = this.#originalProcessEmit;
    this.#process.reallyExit = this.#originalProcessReallyExit;
    this.#emitter.count -= 1;
  }
  #processReallyExit(code) {
    if (!processOk(this.#process)) {
      return 0;
    }
    this.#process.exitCode = code || 0;
    this.#emitter.emit("exit", this.#process.exitCode, null);
    return this.#originalProcessReallyExit.call(this.#process, this.#process.exitCode);
  }
  #processEmit(ev, ...args) {
    const og = this.#originalProcessEmit;
    if (ev === "exit" && processOk(this.#process)) {
      if (typeof args[0] === "number") {
        this.#process.exitCode = args[0];
      }
      const ret = og.call(this.#process, ev, ...args);
      this.#emitter.emit("exit", this.#process.exitCode, null);
      return ret;
    } else {
      return og.call(this.#process, ev, ...args);
    }
  }
}
var process4 = globalThis.process;
var {
  onExit,
  load,
  unload
} = signalExitWrap(processOk(process4) ? new SignalExit(process4) : new SignalExitFallback);

// node_modules/execa/lib/kill.js
var DEFAULT_FORCE_KILL_TIMEOUT = 1000 * 5;
var spawnedKill = (kill, signal = "SIGTERM", options = {}) => {
  const killResult = kill(signal);
  setKillTimeout(kill, signal, options, killResult);
  return killResult;
};
var setKillTimeout = (kill, signal, options, killResult) => {
  if (!shouldForceKill(signal, options, killResult)) {
    return;
  }
  const timeout = getForceKillAfterTimeout(options);
  const t = setTimeout(() => {
    kill("SIGKILL");
  }, timeout);
  if (t.unref) {
    t.unref();
  }
};
var shouldForceKill = (signal, { forceKillAfterTimeout }, killResult) => isSigterm(signal) && forceKillAfterTimeout !== false && killResult;
var isSigterm = (signal) => signal === os.constants.signals.SIGTERM || typeof signal === "string" && signal.toUpperCase() === "SIGTERM";
var getForceKillAfterTimeout = ({ forceKillAfterTimeout = true }) => {
  if (forceKillAfterTimeout === true) {
    return DEFAULT_FORCE_KILL_TIMEOUT;
  }
  if (!Number.isFinite(forceKillAfterTimeout) || forceKillAfterTimeout < 0) {
    throw new TypeError(`Expected the \`forceKillAfterTimeout\` option to be a non-negative integer, got \`${forceKillAfterTimeout}\` (${typeof forceKillAfterTimeout})`);
  }
  return forceKillAfterTimeout;
};
var spawnedCancel = (spawned, context) => {
  const killResult = spawned.kill();
  if (killResult) {
    context.isCanceled = true;
  }
};
var timeoutKill = (spawned, signal, reject) => {
  spawned.kill(signal);
  reject(Object.assign(new Error("Timed out"), { timedOut: true, signal }));
};
var setupTimeout = (spawned, { timeout, killSignal = "SIGTERM" }, spawnedPromise) => {
  if (timeout === 0 || timeout === undefined) {
    return spawnedPromise;
  }
  let timeoutId;
  const timeoutPromise = new Promise((resolve, reject) => {
    timeoutId = setTimeout(() => {
      timeoutKill(spawned, killSignal, reject);
    }, timeout);
  });
  const safeSpawnedPromise = spawnedPromise.finally(() => {
    clearTimeout(timeoutId);
  });
  return Promise.race([timeoutPromise, safeSpawnedPromise]);
};
var validateTimeout = ({ timeout }) => {
  if (timeout !== undefined && (!Number.isFinite(timeout) || timeout < 0)) {
    throw new TypeError(`Expected the \`timeout\` option to be a non-negative integer, got \`${timeout}\` (${typeof timeout})`);
  }
};
var setExitHandler = async (spawned, { cleanup, detached }, timedPromise) => {
  if (!cleanup || detached) {
    return timedPromise;
  }
  const removeExitHandler = onExit(() => {
    spawned.kill();
  });
  return timedPromise.finally(() => {
    removeExitHandler();
  });
};

// node_modules/execa/lib/pipe.js
import {createWriteStream} from "fs";
import {ChildProcess} from "child_process";

// node_modules/is-stream/index.js
function isStream(stream) {
  return stream !== null && typeof stream === "object" && typeof stream.pipe === "function";
}
function isWritableStream(stream) {
  return isStream(stream) && stream.writable !== false && typeof stream._write === "function" && typeof stream._writableState === "object";
}

// node_modules/execa/lib/pipe.js
var isExecaChildProcess = (target) => target instanceof ChildProcess && typeof target.then === "function";
var pipeToTarget = (spawned, streamName, target) => {
  if (typeof target === "string") {
    spawned[streamName].pipe(createWriteStream(target));
    return spawned;
  }
  if (isWritableStream(target)) {
    spawned[streamName].pipe(target);
    return spawned;
  }
  if (!isExecaChildProcess(target)) {
    throw new TypeError("The second argument must be a string, a stream or an Execa child process.");
  }
  if (!isWritableStream(target.stdin)) {
    throw new TypeError("The target child process\'s stdin must be available.");
  }
  spawned[streamName].pipe(target.stdin);
  return target;
};
var addPipeMethods = (spawned) => {
  if (spawned.stdout !== null) {
    spawned.pipeStdout = pipeToTarget.bind(undefined, spawned, "stdout");
  }
  if (spawned.stderr !== null) {
    spawned.pipeStderr = pipeToTarget.bind(undefined, spawned, "stderr");
  }
  if (spawned.all !== undefined) {
    spawned.pipeAll = pipeToTarget.bind(undefined, spawned, "all");
  }
};

// node_modules/execa/lib/stream.js
import {createReadStream, readFileSync} from "fs";
import {setTimeout as setTimeout2} from "timers/promises";

// node_modules/get-stream/source/contents.js
var getStreamContents = async (stream, { init, convertChunk, getSize, truncateChunk, addChunk, getFinalChunk, finalize }, { maxBuffer = Number.POSITIVE_INFINITY } = {}) => {
  if (!isAsyncIterable(stream)) {
    throw new Error("The first argument must be a Readable, a ReadableStream, or an async iterable.");
  }
  const state = init();
  state.length = 0;
  try {
    for await (const chunk of stream) {
      const chunkType = getChunkType(chunk);
      const convertedChunk = convertChunk[chunkType](chunk, state);
      appendChunk({ convertedChunk, state, getSize, truncateChunk, addChunk, maxBuffer });
    }
    appendFinalChunk({ state, convertChunk, getSize, truncateChunk, addChunk, getFinalChunk, maxBuffer });
    return finalize(state);
  } catch (error) {
    error.bufferedData = finalize(state);
    throw error;
  }
};
var appendFinalChunk = ({ state, getSize, truncateChunk, addChunk, getFinalChunk, maxBuffer }) => {
  const convertedChunk = getFinalChunk(state);
  if (convertedChunk !== undefined) {
    appendChunk({ convertedChunk, state, getSize, truncateChunk, addChunk, maxBuffer });
  }
};
var appendChunk = ({ convertedChunk, state, getSize, truncateChunk, addChunk, maxBuffer }) => {
  const chunkSize = getSize(convertedChunk);
  const newLength = state.length + chunkSize;
  if (newLength <= maxBuffer) {
    addNewChunk(convertedChunk, state, addChunk, newLength);
    return;
  }
  const truncatedChunk = truncateChunk(convertedChunk, maxBuffer - state.length);
  if (truncatedChunk !== undefined) {
    addNewChunk(truncatedChunk, state, addChunk, maxBuffer);
  }
  throw new MaxBufferError;
};
var addNewChunk = (convertedChunk, state, addChunk, newLength) => {
  state.contents = addChunk(convertedChunk, state, newLength);
  state.length = newLength;
};
var isAsyncIterable = (stream) => typeof stream === "object" && stream !== null && typeof stream[Symbol.asyncIterator] === "function";
var getChunkType = (chunk) => {
  const typeOfChunk = typeof chunk;
  if (typeOfChunk === "string") {
    return "string";
  }
  if (typeOfChunk !== "object" || chunk === null) {
    return "others";
  }
  if (globalThis.Buffer?.isBuffer(chunk)) {
    return "buffer";
  }
  const prototypeName = objectToString.call(chunk);
  if (prototypeName === "[object ArrayBuffer]") {
    return "arrayBuffer";
  }
  if (prototypeName === "[object DataView]") {
    return "dataView";
  }
  if (Number.isInteger(chunk.byteLength) && Number.isInteger(chunk.byteOffset) && objectToString.call(chunk.buffer) === "[object ArrayBuffer]") {
    return "typedArray";
  }
  return "others";
};
var { toString: objectToString } = Object.prototype;

class MaxBufferError extends Error {
  name = "MaxBufferError";
  constructor() {
    super("maxBuffer exceeded");
  }
}

// node_modules/get-stream/source/utils.js
var identity = (value) => value;
var noop = () => {
  return;
};
var getContentsProp = ({ contents }) => contents;
var throwObjectStream = (chunk) => {
  throw new Error(`Streams in object mode are not supported: ${String(chunk)}`);
};
var getLengthProp = (convertedChunk) => convertedChunk.length;
// node_modules/get-stream/source/array-buffer.js
async function getStreamAsArrayBuffer(stream, options) {
  return getStreamContents(stream, arrayBufferMethods, options);
}
var initArrayBuffer = () => ({ contents: new ArrayBuffer(0) });
var useTextEncoder = (chunk) => textEncoder.encode(chunk);
var textEncoder = new TextEncoder;
var useUint8Array = (chunk) => new Uint8Array(chunk);
var useUint8ArrayWithOffset = (chunk) => new Uint8Array(chunk.buffer, chunk.byteOffset, chunk.byteLength);
var truncateArrayBufferChunk = (convertedChunk, chunkSize) => convertedChunk.slice(0, chunkSize);
var addArrayBufferChunk = (convertedChunk, { contents: contents3, length: previousLength }, length) => {
  const newContents = hasArrayBufferResize() ? resizeArrayBuffer(contents3, length) : resizeArrayBufferSlow(contents3, length);
  new Uint8Array(newContents).set(convertedChunk, previousLength);
  return newContents;
};
var resizeArrayBufferSlow = (contents3, length) => {
  if (length <= contents3.byteLength) {
    return contents3;
  }
  const arrayBuffer = new ArrayBuffer(getNewContentsLength(length));
  new Uint8Array(arrayBuffer).set(new Uint8Array(contents3), 0);
  return arrayBuffer;
};
var resizeArrayBuffer = (contents3, length) => {
  if (length <= contents3.maxByteLength) {
    contents3.resize(length);
    return contents3;
  }
  const arrayBuffer = new ArrayBuffer(length, { maxByteLength: getNewContentsLength(length) });
  new Uint8Array(arrayBuffer).set(new Uint8Array(contents3), 0);
  return arrayBuffer;
};
var getNewContentsLength = (length) => SCALE_FACTOR ** Math.ceil(Math.log(length) / Math.log(SCALE_FACTOR));
var SCALE_FACTOR = 2;
var finalizeArrayBuffer = ({ contents: contents3, length }) => hasArrayBufferResize() ? contents3 : contents3.slice(0, length);
var hasArrayBufferResize = () => ("resize" in ArrayBuffer.prototype);
var arrayBufferMethods = {
  init: initArrayBuffer,
  convertChunk: {
    string: useTextEncoder,
    buffer: useUint8Array,
    arrayBuffer: useUint8Array,
    dataView: useUint8ArrayWithOffset,
    typedArray: useUint8ArrayWithOffset,
    others: throwObjectStream
  },
  getSize: getLengthProp,
  truncateChunk: truncateArrayBufferChunk,
  addChunk: addArrayBufferChunk,
  getFinalChunk: noop,
  finalize: finalizeArrayBuffer
};
// node_modules/get-stream/source/buffer.js
async function getStreamAsBuffer(stream, options) {
  if (!("Buffer" in globalThis)) {
    throw new Error("getStreamAsBuffer() is only supported in Node.js");
  }
  try {
    return arrayBufferToNodeBuffer(await getStreamAsArrayBuffer(stream, options));
  } catch (error) {
    if (error.bufferedData !== undefined) {
      error.bufferedData = arrayBufferToNodeBuffer(error.bufferedData);
    }
    throw error;
  }
}
var arrayBufferToNodeBuffer = (arrayBuffer) => globalThis.Buffer.from(arrayBuffer);
// node_modules/get-stream/source/string.js
async function getStreamAsString(stream, options) {
  return getStreamContents(stream, stringMethods, options);
}
var initString = () => ({ contents: "", textDecoder: new TextDecoder });
var useTextDecoder = (chunk, { textDecoder }) => textDecoder.decode(chunk, { stream: true });
var addStringChunk = (convertedChunk, { contents: contents4 }) => contents4 + convertedChunk;
var truncateStringChunk = (convertedChunk, chunkSize) => convertedChunk.slice(0, chunkSize);
var getFinalStringChunk = ({ textDecoder }) => {
  const finalChunk = textDecoder.decode();
  return finalChunk === "" ? undefined : finalChunk;
};
var stringMethods = {
  init: initString,
  convertChunk: {
    string: identity,
    buffer: useTextDecoder,
    arrayBuffer: useTextDecoder,
    dataView: useTextDecoder,
    typedArray: useTextDecoder,
    others: throwObjectStream
  },
  getSize: getLengthProp,
  truncateChunk: truncateStringChunk,
  addChunk: addStringChunk,
  getFinalChunk: getFinalStringChunk,
  finalize: getContentsProp
};
// node_modules/execa/lib/stream.js
var import_merge_stream = __toESM(require_merge_stream(), 1);
var validateInputOptions = (input) => {
  if (input !== undefined) {
    throw new TypeError("The `input` and `inputFile` options cannot be both set.");
  }
};
var getInputSync = ({ input, inputFile }) => {
  if (typeof inputFile !== "string") {
    return input;
  }
  validateInputOptions(input);
  return readFileSync(inputFile);
};
var handleInputSync = (options) => {
  const input = getInputSync(options);
  if (isStream(input)) {
    throw new TypeError("The `input` option cannot be a stream in sync mode");
  }
  return input;
};
var getInput = ({ input, inputFile }) => {
  if (typeof inputFile !== "string") {
    return input;
  }
  validateInputOptions(input);
  return createReadStream(inputFile);
};
var handleInput = (spawned, options) => {
  const input = getInput(options);
  if (input === undefined) {
    return;
  }
  if (isStream(input)) {
    input.pipe(spawned.stdin);
  } else {
    spawned.stdin.end(input);
  }
};
var makeAllStream = (spawned, { all }) => {
  if (!all || !spawned.stdout && !spawned.stderr) {
    return;
  }
  const mixed = import_merge_stream.default();
  if (spawned.stdout) {
    mixed.add(spawned.stdout);
  }
  if (spawned.stderr) {
    mixed.add(spawned.stderr);
  }
  return mixed;
};
var getBufferedData = async (stream, streamPromise) => {
  if (!stream || streamPromise === undefined) {
    return;
  }
  await setTimeout2(0);
  stream.destroy();
  try {
    return await streamPromise;
  } catch (error) {
    return error.bufferedData;
  }
};
var getStreamPromise = (stream, { encoding, buffer, maxBuffer }) => {
  if (!stream || !buffer) {
    return;
  }
  if (encoding === "utf8" || encoding === "utf-8") {
    return getStreamAsString(stream, { maxBuffer });
  }
  if (encoding === null || encoding === "buffer") {
    return getStreamAsBuffer(stream, { maxBuffer });
  }
  return applyEncoding(stream, maxBuffer, encoding);
};
var applyEncoding = async (stream, maxBuffer, encoding) => {
  const buffer = await getStreamAsBuffer(stream, { maxBuffer });
  return buffer.toString(encoding);
};
var getSpawnedResult = async ({ stdout, stderr, all }, { encoding, buffer, maxBuffer }, processDone) => {
  const stdoutPromise = getStreamPromise(stdout, { encoding, buffer, maxBuffer });
  const stderrPromise = getStreamPromise(stderr, { encoding, buffer, maxBuffer });
  const allPromise = getStreamPromise(all, { encoding, buffer, maxBuffer: maxBuffer * 2 });
  try {
    return await Promise.all([processDone, stdoutPromise, stderrPromise, allPromise]);
  } catch (error) {
    return Promise.all([
      { error, signal: error.signal, timedOut: error.timedOut },
      getBufferedData(stdout, stdoutPromise),
      getBufferedData(stderr, stderrPromise),
      getBufferedData(all, allPromise)
    ]);
  }
};

// node_modules/execa/lib/promise.js
var nativePromisePrototype = (async () => {
})().constructor.prototype;
var descriptors = ["then", "catch", "finally"].map((property) => [
  property,
  Reflect.getOwnPropertyDescriptor(nativePromisePrototype, property)
]);
var mergePromise = (spawned, promise) => {
  for (const [property, descriptor] of descriptors) {
    const value = typeof promise === "function" ? (...args) => Reflect.apply(descriptor.value, promise(), args) : descriptor.value.bind(promise);
    Reflect.defineProperty(spawned, property, { ...descriptor, value });
  }
};
var getSpawnedPromise = (spawned) => new Promise((resolve, reject) => {
  spawned.on("exit", (exitCode, signal) => {
    resolve({ exitCode, signal });
  });
  spawned.on("error", (error) => {
    reject(error);
  });
  if (spawned.stdin) {
    spawned.stdin.on("error", (error) => {
      reject(error);
    });
  }
});

// node_modules/execa/lib/command.js
import {Buffer as Buffer2} from "buffer";
import {ChildProcess as ChildProcess2} from "child_process";
var normalizeArgs = (file, args = []) => {
  if (!Array.isArray(args)) {
    return [file];
  }
  return [file, ...args];
};
var NO_ESCAPE_REGEXP = /^[\w.-]+$/;
var escapeArg = (arg) => {
  if (typeof arg !== "string" || NO_ESCAPE_REGEXP.test(arg)) {
    return arg;
  }
  return `"${arg.replaceAll('"', '\\"')}"`;
};
var joinCommand = (file, args) => normalizeArgs(file, args).join(" ");
var getEscapedCommand = (file, args) => normalizeArgs(file, args).map((arg) => escapeArg(arg)).join(" ");
var SPACES_REGEXP = / +/g;
var parseExpression = (expression) => {
  const typeOfExpression = typeof expression;
  if (typeOfExpression === "string") {
    return expression;
  }
  if (typeOfExpression === "number") {
    return String(expression);
  }
  if (typeOfExpression === "object" && expression !== null && !(expression instanceof ChildProcess2) && "stdout" in expression) {
    const typeOfStdout = typeof expression.stdout;
    if (typeOfStdout === "string") {
      return expression.stdout;
    }
    if (Buffer2.isBuffer(expression.stdout)) {
      return expression.stdout.toString();
    }
    throw new TypeError(`Unexpected "${typeOfStdout}" stdout in template expression`);
  }
  throw new TypeError(`Unexpected "${typeOfExpression}" in template expression`);
};
var concatTokens = (tokens, nextTokens, isNew) => isNew || tokens.length === 0 || nextTokens.length === 0 ? [...tokens, ...nextTokens] : [
  ...tokens.slice(0, -1),
  `${tokens.at(-1)}${nextTokens[0]}`,
  ...nextTokens.slice(1)
];
var parseTemplate = ({ templates, expressions, tokens, index, template }) => {
  const templateString = template ?? templates.raw[index];
  const templateTokens = templateString.split(SPACES_REGEXP).filter(Boolean);
  const newTokens = concatTokens(tokens, templateTokens, templateString.startsWith(" "));
  if (index === expressions.length) {
    return newTokens;
  }
  const expression = expressions[index];
  const expressionTokens = Array.isArray(expression) ? expression.map((expression2) => parseExpression(expression2)) : [parseExpression(expression)];
  return concatTokens(newTokens, expressionTokens, templateString.endsWith(" "));
};
var parseTemplates = (templates, expressions) => {
  let tokens = [];
  for (const [index, template] of templates.entries()) {
    tokens = parseTemplate({ templates, expressions, tokens, index, template });
  }
  return tokens;
};

// node_modules/execa/lib/verbose.js
import {debuglog} from "util";
import process5 from "process";
var verboseDefault = debuglog("execa").enabled;
var padField = (field, padding) => String(field).padStart(padding, "0");
var getTimestamp = () => {
  const date = new Date;
  return `${padField(date.getHours(), 2)}:${padField(date.getMinutes(), 2)}:${padField(date.getSeconds(), 2)}.${padField(date.getMilliseconds(), 3)}`;
};
var logCommand = (escapedCommand, { verbose }) => {
  if (!verbose) {
    return;
  }
  process5.stderr.write(`[${getTimestamp()}] ${escapedCommand}\n`);
};

// node_modules/execa/index.js
function execa(file, args, options) {
  const parsed = handleArguments(file, args, options);
  const command2 = joinCommand(file, args);
  const escapedCommand = getEscapedCommand(file, args);
  logCommand(escapedCommand, parsed.options);
  validateTimeout(parsed.options);
  let spawned;
  try {
    spawned = childProcess.spawn(parsed.file, parsed.args, parsed.options);
  } catch (error2) {
    const dummySpawned = new childProcess.ChildProcess;
    const errorPromise = Promise.reject(makeError({
      error: error2,
      stdout: "",
      stderr: "",
      all: "",
      command: command2,
      escapedCommand,
      parsed,
      timedOut: false,
      isCanceled: false,
      killed: false
    }));
    mergePromise(dummySpawned, errorPromise);
    return dummySpawned;
  }
  const spawnedPromise = getSpawnedPromise(spawned);
  const timedPromise = setupTimeout(spawned, parsed.options, spawnedPromise);
  const processDone = setExitHandler(spawned, parsed.options, timedPromise);
  const context = { isCanceled: false };
  spawned.kill = spawnedKill.bind(null, spawned.kill.bind(spawned));
  spawned.cancel = spawnedCancel.bind(null, spawned, context);
  const handlePromise = async () => {
    const [{ error: error2, exitCode, signal, timedOut }, stdoutResult, stderrResult, allResult] = await getSpawnedResult(spawned, parsed.options, processDone);
    const stdout = handleOutput(parsed.options, stdoutResult);
    const stderr = handleOutput(parsed.options, stderrResult);
    const all = handleOutput(parsed.options, allResult);
    if (error2 || exitCode !== 0 || signal !== null) {
      const returnedError = makeError({
        error: error2,
        exitCode,
        signal,
        stdout,
        stderr,
        all,
        command: command2,
        escapedCommand,
        parsed,
        timedOut,
        isCanceled: context.isCanceled || (parsed.options.signal ? parsed.options.signal.aborted : false),
        killed: spawned.killed
      });
      if (!parsed.options.reject) {
        return returnedError;
      }
      throw returnedError;
    }
    return {
      command: command2,
      escapedCommand,
      exitCode: 0,
      stdout,
      stderr,
      all,
      failed: false,
      timedOut: false,
      isCanceled: false,
      killed: false
    };
  };
  const handlePromiseOnce = onetime_default(handlePromise);
  handleInput(spawned, parsed.options);
  spawned.all = makeAllStream(spawned, parsed.options);
  addPipeMethods(spawned);
  mergePromise(spawned, handlePromiseOnce);
  return spawned;
}
function execaSync(file, args, options) {
  const parsed = handleArguments(file, args, options);
  const command2 = joinCommand(file, args);
  const escapedCommand = getEscapedCommand(file, args);
  logCommand(escapedCommand, parsed.options);
  const input = handleInputSync(parsed.options);
  let result;
  try {
    result = childProcess.spawnSync(parsed.file, parsed.args, { ...parsed.options, input });
  } catch (error2) {
    throw makeError({
      error: error2,
      stdout: "",
      stderr: "",
      all: "",
      command: command2,
      escapedCommand,
      parsed,
      timedOut: false,
      isCanceled: false,
      killed: false
    });
  }
  const stdout = handleOutput(parsed.options, result.stdout, result.error);
  const stderr = handleOutput(parsed.options, result.stderr, result.error);
  if (result.error || result.status !== 0 || result.signal !== null) {
    const error2 = makeError({
      stdout,
      stderr,
      error: result.error,
      signal: result.signal,
      exitCode: result.status,
      command: command2,
      escapedCommand,
      parsed,
      timedOut: result.error && result.error.code === "ETIMEDOUT",
      isCanceled: false,
      killed: result.signal !== null
    });
    if (!parsed.options.reject) {
      return error2;
    }
    throw error2;
  }
  return {
    command: command2,
    escapedCommand,
    exitCode: 0,
    stdout,
    stderr,
    failed: false,
    timedOut: false,
    isCanceled: false,
    killed: false
  };
}
var create$ = function(options) {
  function $(templatesOrOptions, ...expressions) {
    if (!Array.isArray(templatesOrOptions)) {
      return create$({ ...options, ...templatesOrOptions });
    }
    const [file, ...args] = parseTemplates(templatesOrOptions, expressions);
    return execa(file, args, normalizeScriptOptions(options));
  }
  $.sync = (templates, ...expressions) => {
    if (!Array.isArray(templates)) {
      throw new TypeError("Please use $(options).sync`command` instead of $.sync(options)`command`.");
    }
    const [file, ...args] = parseTemplates(templates, expressions);
    return execaSync(file, args, normalizeScriptOptions(options));
  };
  return $;
};
var DEFAULT_MAX_BUFFER = 1000 * 1000 * 100;
var getEnv = ({ env: envOption, extendEnv, preferLocal, localDir, execPath }) => {
  const env = extendEnv ? { ...process6.env, ...envOption } : envOption;
  if (preferLocal) {
    return npmRunPathEnv({ env, cwd: localDir, execPath });
  }
  return env;
};
var handleArguments = (file, args, options = {}) => {
  const parsed = import_cross_spawn.default._parse(file, args, options);
  file = parsed.command;
  args = parsed.args;
  options = parsed.options;
  options = {
    maxBuffer: DEFAULT_MAX_BUFFER,
    buffer: true,
    stripFinalNewline: true,
    extendEnv: true,
    preferLocal: false,
    localDir: options.cwd || process6.cwd(),
    execPath: process6.execPath,
    encoding: "utf8",
    reject: true,
    cleanup: true,
    all: false,
    windowsHide: true,
    verbose: verboseDefault,
    ...options
  };
  options.env = getEnv(options);
  options.stdio = normalizeStdio(options);
  if (process6.platform === "win32" && path2.basename(file, ".exe") === "cmd") {
    args.unshift("/q");
  }
  return { file, args, options, parsed };
};
var handleOutput = (options, value, error2) => {
  if (typeof value !== "string" && !Buffer3.isBuffer(value)) {
    return error2 === undefined ? undefined : "";
  }
  if (options.stripFinalNewline) {
    return stripFinalNewline(value);
  }
  return value;
};
var normalizeScriptStdin = ({ input, inputFile, stdio: stdio2 }) => input === undefined && inputFile === undefined && stdio2 === undefined ? { stdin: "inherit" } : {};
var normalizeScriptOptions = (options = {}) => ({
  preferLocal: true,
  ...normalizeScriptStdin(options),
  ...options
});
var $ = create$();

// src/hooks/dependencies.ts
var import_nanospinner = __toESM(require_nanospinner(), 1);
var checkPackageManagerInstalled = function(packageManager) {
  return new Promise((resolve) => {
    execa(packageManager, ["--version"]).then(() => resolve(true)).catch(() => resolve(false));
  });
};
var knownPackageManagers = {
  npm: "npm install",
  bun: "bun install",
  pnpm: "pnpm install",
  yarn: "yarn"
};
var knownPackageManagerNames = Object.keys(knownPackageManagers);
var excludeTemplate = ["deno", "netlify"];
var registerInstallationHook = (template, installArg, pmArg) => {
  if (excludeTemplate.includes(template))
    return;
  projectDependenciesHook.addHook(template, async ({ directoryPath }) => {
    let installDeps = false;
    const installedPackageManagerNames = await Promise.all(knownPackageManagerNames.map(checkPackageManagerInstalled)).then((results) => knownPackageManagerNames.filter((_, index) => results[index]));
    if (!installedPackageManagerNames.length)
      return;
    if (typeof installArg === "boolean") {
      installDeps = installArg;
    } else {
      installDeps = await confirm("Do you want to install project dependencies?", true);
    }
    if (!installDeps)
      return;
    let packageManager;
    if (pmArg && installedPackageManagerNames.includes(pmArg)) {
      packageManager = pmArg;
    } else {
      packageManager = "bun";
    }
    chdir(directoryPath);
    if (!knownPackageManagers[packageManager]) {
      exit(1);
    }
    const spinner = import_nanospinner.createSpinner().start();
    const proc = exec(knownPackageManagers[packageManager]);
    proc.stdout?.pipe(process.stdout);
    proc.stderr?.pipe(process.stderr);
    const procExit = await new Promise((res) => {
      proc.on("exit", (code) => res(code == null ? 255 : code));
    });
    if (procExit == 0) {
      spinner.success({ text: `Dependencies installed`, mark: `\u2714` });
    } else {
      spinner.stop({
        mark: `\xD7`,
        text: "Failed to install project dependencies"
      });
      exit(procExit);
    }
    return;
  });
};

// index.ts
var import_nanospinner2 = __toESM(require_nanospinner(), 1);

// node_modules/yargs-parser/build/lib/index.js
import {format} from "util";
import {normalize, resolve} from "path";

// node_modules/yargs-parser/build/lib/string-utils.js
function camelCase(str) {
  const isCamelCase = str !== str.toLowerCase() && str !== str.toUpperCase();
  if (!isCamelCase) {
    str = str.toLowerCase();
  }
  if (str.indexOf("-") === -1 && str.indexOf("_") === -1) {
    return str;
  } else {
    let camelcase = "";
    let nextChrUpper = false;
    const leadingHyphens = str.match(/^-+/);
    for (let i = leadingHyphens ? leadingHyphens[0].length : 0;i < str.length; i++) {
      let chr = str.charAt(i);
      if (nextChrUpper) {
        nextChrUpper = false;
        chr = chr.toUpperCase();
      }
      if (i !== 0 && (chr === "-" || chr === "_")) {
        nextChrUpper = true;
      } else if (chr !== "-" && chr !== "_") {
        camelcase += chr;
      }
    }
    return camelcase;
  }
}
function decamelize(str, joinString) {
  const lowercase = str.toLowerCase();
  joinString = joinString || "-";
  let notCamelcase = "";
  for (let i = 0;i < str.length; i++) {
    const chrLower = lowercase.charAt(i);
    const chrString = str.charAt(i);
    if (chrLower !== chrString && i > 0) {
      notCamelcase += `${joinString}${lowercase.charAt(i)}`;
    } else {
      notCamelcase += chrString;
    }
  }
  return notCamelcase;
}
function looksLikeNumber(x) {
  if (x === null || x === undefined)
    return false;
  if (typeof x === "number")
    return true;
  if (/^0x[0-9a-f]+$/i.test(x))
    return true;
  if (/^0[^.]/.test(x))
    return false;
  return /^[-]?(?:\d+(?:\.\d*)?|\.\d+)(e[-+]?\d+)?$/.test(x);
}

// node_modules/yargs-parser/build/lib/tokenize-arg-string.js
function tokenizeArgString(argString) {
  if (Array.isArray(argString)) {
    return argString.map((e) => typeof e !== "string" ? e + "" : e);
  }
  argString = argString.trim();
  let i = 0;
  let prevC = null;
  let c = null;
  let opening = null;
  const args = [];
  for (let ii = 0;ii < argString.length; ii++) {
    prevC = c;
    c = argString.charAt(ii);
    if (c === " " && !opening) {
      if (!(prevC === " ")) {
        i++;
      }
      continue;
    }
    if (c === opening) {
      opening = null;
    } else if ((c === "'" || c === '"') && !opening) {
      opening = c;
    }
    if (!args[i])
      args[i] = "";
    args[i] += c;
  }
  return args;
}

// node_modules/yargs-parser/build/lib/yargs-parser-types.js
var DefaultValuesForTypeKey;
(function(DefaultValuesForTypeKey2) {
  DefaultValuesForTypeKey2["BOOLEAN"] = "boolean";
  DefaultValuesForTypeKey2["STRING"] = "string";
  DefaultValuesForTypeKey2["NUMBER"] = "number";
  DefaultValuesForTypeKey2["ARRAY"] = "array";
})(DefaultValuesForTypeKey || (DefaultValuesForTypeKey = {}));

// node_modules/yargs-parser/build/lib/yargs-parser.js
var combineAliases = function(aliases2) {
  const aliasArrays = [];
  const combined = Object.create(null);
  let change = true;
  Object.keys(aliases2).forEach(function(key) {
    aliasArrays.push([].concat(aliases2[key], key));
  });
  while (change) {
    change = false;
    for (let i = 0;i < aliasArrays.length; i++) {
      for (let ii = i + 1;ii < aliasArrays.length; ii++) {
        const intersect = aliasArrays[i].filter(function(v) {
          return aliasArrays[ii].indexOf(v) !== -1;
        });
        if (intersect.length) {
          aliasArrays[i] = aliasArrays[i].concat(aliasArrays[ii]);
          aliasArrays.splice(ii, 1);
          change = true;
          break;
        }
      }
    }
  }
  aliasArrays.forEach(function(aliasArray) {
    aliasArray = aliasArray.filter(function(v, i, self2) {
      return self2.indexOf(v) === i;
    });
    const lastAlias = aliasArray.pop();
    if (lastAlias !== undefined && typeof lastAlias === "string") {
      combined[lastAlias] = aliasArray;
    }
  });
  return combined;
};
var increment = function(orig) {
  return orig !== undefined ? orig + 1 : 1;
};
var sanitizeKey = function(key) {
  if (key === "__proto__")
    return "___proto___";
  return key;
};
var stripQuotes = function(val) {
  return typeof val === "string" && (val[0] === "'" || val[0] === '"') && val[val.length - 1] === val[0] ? val.substring(1, val.length - 1) : val;
};
var mixin;

class YargsParser {
  constructor(_mixin) {
    mixin = _mixin;
  }
  parse(argsInput, options) {
    const opts = Object.assign({
      alias: undefined,
      array: undefined,
      boolean: undefined,
      config: undefined,
      configObjects: undefined,
      configuration: undefined,
      coerce: undefined,
      count: undefined,
      default: undefined,
      envPrefix: undefined,
      narg: undefined,
      normalize: undefined,
      string: undefined,
      number: undefined,
      __: undefined,
      key: undefined
    }, options);
    const args = tokenizeArgString(argsInput);
    const inputIsString = typeof argsInput === "string";
    const aliases2 = combineAliases(Object.assign(Object.create(null), opts.alias));
    const configuration = Object.assign({
      "boolean-negation": true,
      "camel-case-expansion": true,
      "combine-arrays": false,
      "dot-notation": true,
      "duplicate-arguments-array": true,
      "flatten-duplicate-arrays": true,
      "greedy-arrays": true,
      "halt-at-non-option": false,
      "nargs-eats-options": false,
      "negation-prefix": "no-",
      "parse-numbers": true,
      "parse-positional-numbers": true,
      "populate--": false,
      "set-placeholder-key": false,
      "short-option-groups": true,
      "strip-aliased": false,
      "strip-dashed": false,
      "unknown-options-as-args": false
    }, opts.configuration);
    const defaults = Object.assign(Object.create(null), opts.default);
    const configObjects = opts.configObjects || [];
    const envPrefix = opts.envPrefix;
    const notFlagsOption = configuration["populate--"];
    const notFlagsArgv = notFlagsOption ? "--" : "_";
    const newAliases = Object.create(null);
    const defaulted = Object.create(null);
    const __ = opts.__ || mixin.format;
    const flags = {
      aliases: Object.create(null),
      arrays: Object.create(null),
      bools: Object.create(null),
      strings: Object.create(null),
      numbers: Object.create(null),
      counts: Object.create(null),
      normalize: Object.create(null),
      configs: Object.create(null),
      nargs: Object.create(null),
      coercions: Object.create(null),
      keys: []
    };
    const negative = /^-([0-9]+(\.[0-9]+)?|\.[0-9]+)$/;
    const negatedBoolean = new RegExp("^--" + configuration["negation-prefix"] + "(.+)");
    [].concat(opts.array || []).filter(Boolean).forEach(function(opt) {
      const key = typeof opt === "object" ? opt.key : opt;
      const assignment = Object.keys(opt).map(function(key2) {
        const arrayFlagKeys = {
          boolean: "bools",
          string: "strings",
          number: "numbers"
        };
        return arrayFlagKeys[key2];
      }).filter(Boolean).pop();
      if (assignment) {
        flags[assignment][key] = true;
      }
      flags.arrays[key] = true;
      flags.keys.push(key);
    });
    [].concat(opts.boolean || []).filter(Boolean).forEach(function(key) {
      flags.bools[key] = true;
      flags.keys.push(key);
    });
    [].concat(opts.string || []).filter(Boolean).forEach(function(key) {
      flags.strings[key] = true;
      flags.keys.push(key);
    });
    [].concat(opts.number || []).filter(Boolean).forEach(function(key) {
      flags.numbers[key] = true;
      flags.keys.push(key);
    });
    [].concat(opts.count || []).filter(Boolean).forEach(function(key) {
      flags.counts[key] = true;
      flags.keys.push(key);
    });
    [].concat(opts.normalize || []).filter(Boolean).forEach(function(key) {
      flags.normalize[key] = true;
      flags.keys.push(key);
    });
    if (typeof opts.narg === "object") {
      Object.entries(opts.narg).forEach(([key, value]) => {
        if (typeof value === "number") {
          flags.nargs[key] = value;
          flags.keys.push(key);
        }
      });
    }
    if (typeof opts.coerce === "object") {
      Object.entries(opts.coerce).forEach(([key, value]) => {
        if (typeof value === "function") {
          flags.coercions[key] = value;
          flags.keys.push(key);
        }
      });
    }
    if (typeof opts.config !== "undefined") {
      if (Array.isArray(opts.config) || typeof opts.config === "string") {
        [].concat(opts.config).filter(Boolean).forEach(function(key) {
          flags.configs[key] = true;
        });
      } else if (typeof opts.config === "object") {
        Object.entries(opts.config).forEach(([key, value]) => {
          if (typeof value === "boolean" || typeof value === "function") {
            flags.configs[key] = value;
          }
        });
      }
    }
    extendAliases(opts.key, aliases2, opts.default, flags.arrays);
    Object.keys(defaults).forEach(function(key) {
      (flags.aliases[key] || []).forEach(function(alias) {
        defaults[alias] = defaults[key];
      });
    });
    let error2 = null;
    checkConfiguration();
    let notFlags = [];
    const argv = Object.assign(Object.create(null), { _: [] });
    const argvReturn = {};
    for (let i = 0;i < args.length; i++) {
      const arg = args[i];
      const truncatedArg = arg.replace(/^-{3,}/, "---");
      let broken;
      let key;
      let letters;
      let m;
      let next;
      let value;
      if (arg !== "--" && /^-/.test(arg) && isUnknownOptionAsArg(arg)) {
        pushPositional(arg);
      } else if (truncatedArg.match(/^---+(=|$)/)) {
        pushPositional(arg);
        continue;
      } else if (arg.match(/^--.+=/) || !configuration["short-option-groups"] && arg.match(/^-.+=/)) {
        m = arg.match(/^--?([^=]+)=([\s\S]*)$/);
        if (m !== null && Array.isArray(m) && m.length >= 3) {
          if (checkAllAliases(m[1], flags.arrays)) {
            i = eatArray(i, m[1], args, m[2]);
          } else if (checkAllAliases(m[1], flags.nargs) !== false) {
            i = eatNargs(i, m[1], args, m[2]);
          } else {
            setArg(m[1], m[2], true);
          }
        }
      } else if (arg.match(negatedBoolean) && configuration["boolean-negation"]) {
        m = arg.match(negatedBoolean);
        if (m !== null && Array.isArray(m) && m.length >= 2) {
          key = m[1];
          setArg(key, checkAllAliases(key, flags.arrays) ? [false] : false);
        }
      } else if (arg.match(/^--.+/) || !configuration["short-option-groups"] && arg.match(/^-[^-]+/)) {
        m = arg.match(/^--?(.+)/);
        if (m !== null && Array.isArray(m) && m.length >= 2) {
          key = m[1];
          if (checkAllAliases(key, flags.arrays)) {
            i = eatArray(i, key, args);
          } else if (checkAllAliases(key, flags.nargs) !== false) {
            i = eatNargs(i, key, args);
          } else {
            next = args[i + 1];
            if (next !== undefined && (!next.match(/^-/) || next.match(negative)) && !checkAllAliases(key, flags.bools) && !checkAllAliases(key, flags.counts)) {
              setArg(key, next);
              i++;
            } else if (/^(true|false)$/.test(next)) {
              setArg(key, next);
              i++;
            } else {
              setArg(key, defaultValue(key));
            }
          }
        }
      } else if (arg.match(/^-.\..+=/)) {
        m = arg.match(/^-([^=]+)=([\s\S]*)$/);
        if (m !== null && Array.isArray(m) && m.length >= 3) {
          setArg(m[1], m[2]);
        }
      } else if (arg.match(/^-.\..+/) && !arg.match(negative)) {
        next = args[i + 1];
        m = arg.match(/^-(.\..+)/);
        if (m !== null && Array.isArray(m) && m.length >= 2) {
          key = m[1];
          if (next !== undefined && !next.match(/^-/) && !checkAllAliases(key, flags.bools) && !checkAllAliases(key, flags.counts)) {
            setArg(key, next);
            i++;
          } else {
            setArg(key, defaultValue(key));
          }
        }
      } else if (arg.match(/^-[^-]+/) && !arg.match(negative)) {
        letters = arg.slice(1, -1).split("");
        broken = false;
        for (let j = 0;j < letters.length; j++) {
          next = arg.slice(j + 2);
          if (letters[j + 1] && letters[j + 1] === "=") {
            value = arg.slice(j + 3);
            key = letters[j];
            if (checkAllAliases(key, flags.arrays)) {
              i = eatArray(i, key, args, value);
            } else if (checkAllAliases(key, flags.nargs) !== false) {
              i = eatNargs(i, key, args, value);
            } else {
              setArg(key, value);
            }
            broken = true;
            break;
          }
          if (next === "-") {
            setArg(letters[j], next);
            continue;
          }
          if (/[A-Za-z]/.test(letters[j]) && /^-?\d+(\.\d*)?(e-?\d+)?$/.test(next) && checkAllAliases(next, flags.bools) === false) {
            setArg(letters[j], next);
            broken = true;
            break;
          }
          if (letters[j + 1] && letters[j + 1].match(/\W/)) {
            setArg(letters[j], next);
            broken = true;
            break;
          } else {
            setArg(letters[j], defaultValue(letters[j]));
          }
        }
        key = arg.slice(-1)[0];
        if (!broken && key !== "-") {
          if (checkAllAliases(key, flags.arrays)) {
            i = eatArray(i, key, args);
          } else if (checkAllAliases(key, flags.nargs) !== false) {
            i = eatNargs(i, key, args);
          } else {
            next = args[i + 1];
            if (next !== undefined && (!/^(-|--)[^-]/.test(next) || next.match(negative)) && !checkAllAliases(key, flags.bools) && !checkAllAliases(key, flags.counts)) {
              setArg(key, next);
              i++;
            } else if (/^(true|false)$/.test(next)) {
              setArg(key, next);
              i++;
            } else {
              setArg(key, defaultValue(key));
            }
          }
        }
      } else if (arg.match(/^-[0-9]$/) && arg.match(negative) && checkAllAliases(arg.slice(1), flags.bools)) {
        key = arg.slice(1);
        setArg(key, defaultValue(key));
      } else if (arg === "--") {
        notFlags = args.slice(i + 1);
        break;
      } else if (configuration["halt-at-non-option"]) {
        notFlags = args.slice(i);
        break;
      } else {
        pushPositional(arg);
      }
    }
    applyEnvVars(argv, true);
    applyEnvVars(argv, false);
    setConfig(argv);
    setConfigObjects();
    applyDefaultsAndAliases(argv, flags.aliases, defaults, true);
    applyCoercions(argv);
    if (configuration["set-placeholder-key"])
      setPlaceholderKeys(argv);
    Object.keys(flags.counts).forEach(function(key) {
      if (!hasKey(argv, key.split(".")))
        setArg(key, 0);
    });
    if (notFlagsOption && notFlags.length)
      argv[notFlagsArgv] = [];
    notFlags.forEach(function(key) {
      argv[notFlagsArgv].push(key);
    });
    if (configuration["camel-case-expansion"] && configuration["strip-dashed"]) {
      Object.keys(argv).filter((key) => key !== "--" && key.includes("-")).forEach((key) => {
        delete argv[key];
      });
    }
    if (configuration["strip-aliased"]) {
      [].concat(...Object.keys(aliases2).map((k) => aliases2[k])).forEach((alias) => {
        if (configuration["camel-case-expansion"] && alias.includes("-")) {
          delete argv[alias.split(".").map((prop) => camelCase(prop)).join(".")];
        }
        delete argv[alias];
      });
    }
    function pushPositional(arg) {
      const maybeCoercedNumber = maybeCoerceNumber("_", arg);
      if (typeof maybeCoercedNumber === "string" || typeof maybeCoercedNumber === "number") {
        argv._.push(maybeCoercedNumber);
      }
    }
    function eatNargs(i, key, args2, argAfterEqualSign) {
      let ii;
      let toEat = checkAllAliases(key, flags.nargs);
      toEat = typeof toEat !== "number" || isNaN(toEat) ? 1 : toEat;
      if (toEat === 0) {
        if (!isUndefined(argAfterEqualSign)) {
          error2 = Error(__("Argument unexpected for: %s", key));
        }
        setArg(key, defaultValue(key));
        return i;
      }
      let available = isUndefined(argAfterEqualSign) ? 0 : 1;
      if (configuration["nargs-eats-options"]) {
        if (args2.length - (i + 1) + available < toEat) {
          error2 = Error(__("Not enough arguments following: %s", key));
        }
        available = toEat;
      } else {
        for (ii = i + 1;ii < args2.length; ii++) {
          if (!args2[ii].match(/^-[^0-9]/) || args2[ii].match(negative) || isUnknownOptionAsArg(args2[ii]))
            available++;
          else
            break;
        }
        if (available < toEat)
          error2 = Error(__("Not enough arguments following: %s", key));
      }
      let consumed = Math.min(available, toEat);
      if (!isUndefined(argAfterEqualSign) && consumed > 0) {
        setArg(key, argAfterEqualSign);
        consumed--;
      }
      for (ii = i + 1;ii < consumed + i + 1; ii++) {
        setArg(key, args2[ii]);
      }
      return i + consumed;
    }
    function eatArray(i, key, args2, argAfterEqualSign) {
      let argsToSet = [];
      let next = argAfterEqualSign || args2[i + 1];
      const nargsCount = checkAllAliases(key, flags.nargs);
      if (checkAllAliases(key, flags.bools) && !/^(true|false)$/.test(next)) {
        argsToSet.push(true);
      } else if (isUndefined(next) || isUndefined(argAfterEqualSign) && /^-/.test(next) && !negative.test(next) && !isUnknownOptionAsArg(next)) {
        if (defaults[key] !== undefined) {
          const defVal = defaults[key];
          argsToSet = Array.isArray(defVal) ? defVal : [defVal];
        }
      } else {
        if (!isUndefined(argAfterEqualSign)) {
          argsToSet.push(processValue(key, argAfterEqualSign, true));
        }
        for (let ii = i + 1;ii < args2.length; ii++) {
          if (!configuration["greedy-arrays"] && argsToSet.length > 0 || nargsCount && typeof nargsCount === "number" && argsToSet.length >= nargsCount)
            break;
          next = args2[ii];
          if (/^-/.test(next) && !negative.test(next) && !isUnknownOptionAsArg(next))
            break;
          i = ii;
          argsToSet.push(processValue(key, next, inputIsString));
        }
      }
      if (typeof nargsCount === "number" && (nargsCount && argsToSet.length < nargsCount || isNaN(nargsCount) && argsToSet.length === 0)) {
        error2 = Error(__("Not enough arguments following: %s", key));
      }
      setArg(key, argsToSet);
      return i;
    }
    function setArg(key, val, shouldStripQuotes = inputIsString) {
      if (/-/.test(key) && configuration["camel-case-expansion"]) {
        const alias = key.split(".").map(function(prop) {
          return camelCase(prop);
        }).join(".");
        addNewAlias(key, alias);
      }
      const value = processValue(key, val, shouldStripQuotes);
      const splitKey = key.split(".");
      setKey(argv, splitKey, value);
      if (flags.aliases[key]) {
        flags.aliases[key].forEach(function(x) {
          const keyProperties = x.split(".");
          setKey(argv, keyProperties, value);
        });
      }
      if (splitKey.length > 1 && configuration["dot-notation"]) {
        (flags.aliases[splitKey[0]] || []).forEach(function(x) {
          let keyProperties = x.split(".");
          const a = [].concat(splitKey);
          a.shift();
          keyProperties = keyProperties.concat(a);
          if (!(flags.aliases[key] || []).includes(keyProperties.join("."))) {
            setKey(argv, keyProperties, value);
          }
        });
      }
      if (checkAllAliases(key, flags.normalize) && !checkAllAliases(key, flags.arrays)) {
        const keys = [key].concat(flags.aliases[key] || []);
        keys.forEach(function(key2) {
          Object.defineProperty(argvReturn, key2, {
            enumerable: true,
            get() {
              return val;
            },
            set(value2) {
              val = typeof value2 === "string" ? mixin.normalize(value2) : value2;
            }
          });
        });
      }
    }
    function addNewAlias(key, alias) {
      if (!(flags.aliases[key] && flags.aliases[key].length)) {
        flags.aliases[key] = [alias];
        newAliases[alias] = true;
      }
      if (!(flags.aliases[alias] && flags.aliases[alias].length)) {
        addNewAlias(alias, key);
      }
    }
    function processValue(key, val, shouldStripQuotes) {
      if (shouldStripQuotes) {
        val = stripQuotes(val);
      }
      if (checkAllAliases(key, flags.bools) || checkAllAliases(key, flags.counts)) {
        if (typeof val === "string")
          val = val === "true";
      }
      let value = Array.isArray(val) ? val.map(function(v) {
        return maybeCoerceNumber(key, v);
      }) : maybeCoerceNumber(key, val);
      if (checkAllAliases(key, flags.counts) && (isUndefined(value) || typeof value === "boolean")) {
        value = increment();
      }
      if (checkAllAliases(key, flags.normalize) && checkAllAliases(key, flags.arrays)) {
        if (Array.isArray(val))
          value = val.map((val2) => {
            return mixin.normalize(val2);
          });
        else
          value = mixin.normalize(val);
      }
      return value;
    }
    function maybeCoerceNumber(key, value) {
      if (!configuration["parse-positional-numbers"] && key === "_")
        return value;
      if (!checkAllAliases(key, flags.strings) && !checkAllAliases(key, flags.bools) && !Array.isArray(value)) {
        const shouldCoerceNumber = looksLikeNumber(value) && configuration["parse-numbers"] && Number.isSafeInteger(Math.floor(parseFloat(`${value}`)));
        if (shouldCoerceNumber || !isUndefined(value) && checkAllAliases(key, flags.numbers)) {
          value = Number(value);
        }
      }
      return value;
    }
    function setConfig(argv2) {
      const configLookup = Object.create(null);
      applyDefaultsAndAliases(configLookup, flags.aliases, defaults);
      Object.keys(flags.configs).forEach(function(configKey) {
        const configPath = argv2[configKey] || configLookup[configKey];
        if (configPath) {
          try {
            let config = null;
            const resolvedConfigPath = mixin.resolve(mixin.cwd(), configPath);
            const resolveConfig = flags.configs[configKey];
            if (typeof resolveConfig === "function") {
              try {
                config = resolveConfig(resolvedConfigPath);
              } catch (e) {
                config = e;
              }
              if (config instanceof Error) {
                error2 = config;
                return;
              }
            } else {
              config = mixin.require(resolvedConfigPath);
            }
            setConfigObject(config);
          } catch (ex) {
            if (ex.name === "PermissionDenied")
              error2 = ex;
            else if (argv2[configKey])
              error2 = Error(__("Invalid JSON config file: %s", configPath));
          }
        }
      });
    }
    function setConfigObject(config, prev) {
      Object.keys(config).forEach(function(key) {
        const value = config[key];
        const fullKey = prev ? prev + "." + key : key;
        if (typeof value === "object" && value !== null && !Array.isArray(value) && configuration["dot-notation"]) {
          setConfigObject(value, fullKey);
        } else {
          if (!hasKey(argv, fullKey.split(".")) || checkAllAliases(fullKey, flags.arrays) && configuration["combine-arrays"]) {
            setArg(fullKey, value);
          }
        }
      });
    }
    function setConfigObjects() {
      if (typeof configObjects !== "undefined") {
        configObjects.forEach(function(configObject) {
          setConfigObject(configObject);
        });
      }
    }
    function applyEnvVars(argv2, configOnly) {
      if (typeof envPrefix === "undefined")
        return;
      const prefix = typeof envPrefix === "string" ? envPrefix : "";
      const env = mixin.env();
      Object.keys(env).forEach(function(envVar) {
        if (prefix === "" || envVar.lastIndexOf(prefix, 0) === 0) {
          const keys = envVar.split("__").map(function(key, i) {
            if (i === 0) {
              key = key.substring(prefix.length);
            }
            return camelCase(key);
          });
          if ((configOnly && flags.configs[keys.join(".")] || !configOnly) && !hasKey(argv2, keys)) {
            setArg(keys.join("."), env[envVar]);
          }
        }
      });
    }
    function applyCoercions(argv2) {
      let coerce;
      const applied = new Set;
      Object.keys(argv2).forEach(function(key) {
        if (!applied.has(key)) {
          coerce = checkAllAliases(key, flags.coercions);
          if (typeof coerce === "function") {
            try {
              const value = maybeCoerceNumber(key, coerce(argv2[key]));
              [].concat(flags.aliases[key] || [], key).forEach((ali) => {
                applied.add(ali);
                argv2[ali] = value;
              });
            } catch (err) {
              error2 = err;
            }
          }
        }
      });
    }
    function setPlaceholderKeys(argv2) {
      flags.keys.forEach((key) => {
        if (~key.indexOf("."))
          return;
        if (typeof argv2[key] === "undefined")
          argv2[key] = undefined;
      });
      return argv2;
    }
    function applyDefaultsAndAliases(obj, aliases3, defaults2, canLog = false) {
      Object.keys(defaults2).forEach(function(key) {
        if (!hasKey(obj, key.split("."))) {
          setKey(obj, key.split("."), defaults2[key]);
          if (canLog)
            defaulted[key] = true;
          (aliases3[key] || []).forEach(function(x) {
            if (hasKey(obj, x.split(".")))
              return;
            setKey(obj, x.split("."), defaults2[key]);
          });
        }
      });
    }
    function hasKey(obj, keys) {
      let o = obj;
      if (!configuration["dot-notation"])
        keys = [keys.join(".")];
      keys.slice(0, -1).forEach(function(key2) {
        o = o[key2] || {};
      });
      const key = keys[keys.length - 1];
      if (typeof o !== "object")
        return false;
      else
        return key in o;
    }
    function setKey(obj, keys, value) {
      let o = obj;
      if (!configuration["dot-notation"])
        keys = [keys.join(".")];
      keys.slice(0, -1).forEach(function(key2) {
        key2 = sanitizeKey(key2);
        if (typeof o === "object" && o[key2] === undefined) {
          o[key2] = {};
        }
        if (typeof o[key2] !== "object" || Array.isArray(o[key2])) {
          if (Array.isArray(o[key2])) {
            o[key2].push({});
          } else {
            o[key2] = [o[key2], {}];
          }
          o = o[key2][o[key2].length - 1];
        } else {
          o = o[key2];
        }
      });
      const key = sanitizeKey(keys[keys.length - 1]);
      const isTypeArray = checkAllAliases(keys.join("."), flags.arrays);
      const isValueArray = Array.isArray(value);
      let duplicate = configuration["duplicate-arguments-array"];
      if (!duplicate && checkAllAliases(key, flags.nargs)) {
        duplicate = true;
        if (!isUndefined(o[key]) && flags.nargs[key] === 1 || Array.isArray(o[key]) && o[key].length === flags.nargs[key]) {
          o[key] = undefined;
        }
      }
      if (value === increment()) {
        o[key] = increment(o[key]);
      } else if (Array.isArray(o[key])) {
        if (duplicate && isTypeArray && isValueArray) {
          o[key] = configuration["flatten-duplicate-arrays"] ? o[key].concat(value) : (Array.isArray(o[key][0]) ? o[key] : [o[key]]).concat([value]);
        } else if (!duplicate && Boolean(isTypeArray) === Boolean(isValueArray)) {
          o[key] = value;
        } else {
          o[key] = o[key].concat([value]);
        }
      } else if (o[key] === undefined && isTypeArray) {
        o[key] = isValueArray ? value : [value];
      } else if (duplicate && !(o[key] === undefined || checkAllAliases(key, flags.counts) || checkAllAliases(key, flags.bools))) {
        o[key] = [o[key], value];
      } else {
        o[key] = value;
      }
    }
    function extendAliases(...args2) {
      args2.forEach(function(obj) {
        Object.keys(obj || {}).forEach(function(key) {
          if (flags.aliases[key])
            return;
          flags.aliases[key] = [].concat(aliases2[key] || []);
          flags.aliases[key].concat(key).forEach(function(x) {
            if (/-/.test(x) && configuration["camel-case-expansion"]) {
              const c = camelCase(x);
              if (c !== key && flags.aliases[key].indexOf(c) === -1) {
                flags.aliases[key].push(c);
                newAliases[c] = true;
              }
            }
          });
          flags.aliases[key].concat(key).forEach(function(x) {
            if (x.length > 1 && /[A-Z]/.test(x) && configuration["camel-case-expansion"]) {
              const c = decamelize(x, "-");
              if (c !== key && flags.aliases[key].indexOf(c) === -1) {
                flags.aliases[key].push(c);
                newAliases[c] = true;
              }
            }
          });
          flags.aliases[key].forEach(function(x) {
            flags.aliases[x] = [key].concat(flags.aliases[key].filter(function(y) {
              return x !== y;
            }));
          });
        });
      });
    }
    function checkAllAliases(key, flag) {
      const toCheck = [].concat(flags.aliases[key] || [], key);
      const keys = Object.keys(flag);
      const setAlias = toCheck.find((key2) => keys.includes(key2));
      return setAlias ? flag[setAlias] : false;
    }
    function hasAnyFlag(key) {
      const flagsKeys = Object.keys(flags);
      const toCheck = [].concat(flagsKeys.map((k) => flags[k]));
      return toCheck.some(function(flag) {
        return Array.isArray(flag) ? flag.includes(key) : flag[key];
      });
    }
    function hasFlagsMatching(arg, ...patterns) {
      const toCheck = [].concat(...patterns);
      return toCheck.some(function(pattern) {
        const match = arg.match(pattern);
        return match && hasAnyFlag(match[1]);
      });
    }
    function hasAllShortFlags(arg) {
      if (arg.match(negative) || !arg.match(/^-[^-]+/)) {
        return false;
      }
      let hasAllFlags = true;
      let next;
      const letters = arg.slice(1).split("");
      for (let j = 0;j < letters.length; j++) {
        next = arg.slice(j + 2);
        if (!hasAnyFlag(letters[j])) {
          hasAllFlags = false;
          break;
        }
        if (letters[j + 1] && letters[j + 1] === "=" || next === "-" || /[A-Za-z]/.test(letters[j]) && /^-?\d+(\.\d*)?(e-?\d+)?$/.test(next) || letters[j + 1] && letters[j + 1].match(/\W/)) {
          break;
        }
      }
      return hasAllFlags;
    }
    function isUnknownOptionAsArg(arg) {
      return configuration["unknown-options-as-args"] && isUnknownOption(arg);
    }
    function isUnknownOption(arg) {
      arg = arg.replace(/^-{3,}/, "--");
      if (arg.match(negative)) {
        return false;
      }
      if (hasAllShortFlags(arg)) {
        return false;
      }
      const flagWithEquals = /^-+([^=]+?)=[\s\S]*$/;
      const normalFlag = /^-+([^=]+?)$/;
      const flagEndingInHyphen = /^-+([^=]+?)-$/;
      const flagEndingInDigits = /^-+([^=]+?\d+)$/;
      const flagEndingInNonWordCharacters = /^-+([^=]+?)\W+.*$/;
      return !hasFlagsMatching(arg, flagWithEquals, negatedBoolean, normalFlag, flagEndingInHyphen, flagEndingInDigits, flagEndingInNonWordCharacters);
    }
    function defaultValue(key) {
      if (!checkAllAliases(key, flags.bools) && !checkAllAliases(key, flags.counts) && `${key}` in defaults) {
        return defaults[key];
      } else {
        return defaultForType(guessType(key));
      }
    }
    function defaultForType(type) {
      const def = {
        [DefaultValuesForTypeKey.BOOLEAN]: true,
        [DefaultValuesForTypeKey.STRING]: "",
        [DefaultValuesForTypeKey.NUMBER]: undefined,
        [DefaultValuesForTypeKey.ARRAY]: []
      };
      return def[type];
    }
    function guessType(key) {
      let type = DefaultValuesForTypeKey.BOOLEAN;
      if (checkAllAliases(key, flags.strings))
        type = DefaultValuesForTypeKey.STRING;
      else if (checkAllAliases(key, flags.numbers))
        type = DefaultValuesForTypeKey.NUMBER;
      else if (checkAllAliases(key, flags.bools))
        type = DefaultValuesForTypeKey.BOOLEAN;
      else if (checkAllAliases(key, flags.arrays))
        type = DefaultValuesForTypeKey.ARRAY;
      return type;
    }
    function isUndefined(num) {
      return num === undefined;
    }
    function checkConfiguration() {
      Object.keys(flags.counts).find((key) => {
        if (checkAllAliases(key, flags.arrays)) {
          error2 = Error(__("Invalid configuration: %s, opts.count excludes opts.array.", key));
          return true;
        } else if (checkAllAliases(key, flags.nargs)) {
          error2 = Error(__("Invalid configuration: %s, opts.count excludes opts.narg.", key));
          return true;
        }
        return false;
      });
    }
    return {
      aliases: Object.assign({}, flags.aliases),
      argv: Object.assign(argvReturn, argv),
      configuration,
      defaulted: Object.assign({}, defaulted),
      error: error2,
      newAliases: Object.assign({}, newAliases)
    };
  }
}

// node_modules/yargs-parser/build/lib/index.js
import {readFileSync as readFileSync2} from "fs";
var _a;
var _b;
var _c;
var minNodeVersion = process && process.env && process.env.YARGS_MIN_NODE_VERSION ? Number(process.env.YARGS_MIN_NODE_VERSION) : 12;
var nodeVersion = (_b = (_a = process === null || process === undefined ? undefined : process.versions) === null || _a === undefined ? undefined : _a.node) !== null && _b !== undefined ? _b : (_c = process === null || process === undefined ? undefined : process.version) === null || _c === undefined ? undefined : _c.slice(1);
if (nodeVersion) {
  const major = Number(nodeVersion.match(/^([^.]+)/)[1]);
  if (major < minNodeVersion) {
    throw Error(`yargs parser supports a minimum Node.js version of ${minNodeVersion}. Read our version support policy: https://github.com/yargs/yargs-parser#supported-nodejs-versions`);
  }
}
var env = process ? process.env : {};
var parser = new YargsParser({
  cwd: process.cwd,
  env: () => {
    return env;
  },
  format,
  normalize,
  resolve,
  require: (path3) => {
    if (typeof import.meta.require !== "undefined") {
      return import.meta.require(path3);
    } else if (path3.match(/\.json$/)) {
      return JSON.parse(readFileSync2(path3, "utf8"));
    } else {
      throw Error("only .json config files are supported in ESM");
    }
  }
});
var yargsParser = function Parser(args, opts) {
  const result = parser.parse(args.slice(), opts);
  return result.argv;
};
yargsParser.detailed = function(args, opts) {
  return parser.parse(args.slice(), opts);
};
yargsParser.camelCase = camelCase;
yargsParser.decamelize = decamelize;
yargsParser.looksLikeNumber = looksLikeNumber;
var lib_default = yargsParser;

// index.ts
var import_download_git_repo = __toESM(require_download_git_repo(), 1);
var mkdirp = function(dir) {
  try {
    fs.mkdirSync(dir, { recursive: true });
  } catch (e) {
    if (e instanceof Error) {
      if ("code" in e && e.code === "EEXIST")
        return;
    }
    throw e;
  }
};
async function main() {
  console.info(konsol.yellow(`${name} version ${version}`));
  const args = lib_default(process.argv.slice(2));
  const { install, pm, template: templateArg } = args;
  let target = "";
  let projectName = "";
  if (args._[0]) {
    target = args._[0].toString();
    console.log(konsol.bold(`${"\u2714"} Using target directory \u2026 ${konsol.yellow(target)}`));
    projectName = path3.basename(target);
  } else {
    const answer = await prompt("Target directory", "hihono-app");
    target = answer;
    if (answer === ".") {
      projectName = path3.basename(process.cwd());
    } else {
      projectName = path3.basename(answer);
    }
  }
  const templateName = templateArg || "default";
  if (fs.existsSync(target)) {
    if (fs.readdirSync(target).length > 0) {
      const response = await confirm("Directory not empty. Continue?", false);
      if (!response) {
        console.warn(konsol.red("Installation cancelled by user"));
        process.exit();
      }
      fs.rmSync(target, { recursive: true, force: true });
    }
  } else {
    mkdirp(target);
  }
  const targetDirectoryPath = path3.join(process.cwd(), target);
  await new Promise((res, rej) => {
    const spinner = import_nanospinner2.createSpinner("Cloning the template").start();
    import_download_git_repo.default(`${config.provider}:${config.user}/${config.repository}#${config.ref}`, targetDirectoryPath, { clone: true }, (err) => {
      if (err) {
        spinner.error({ text: "Failed to clone the template" });
        console.error(err);
        rej(err);
        process.exit(1);
      } else {
        spinner.success();
        res(true);
      }
    });
  });
  registerInstallationHook(templateName, install, pm);
  try {
    afterCreateHook.applyHook(templateName, {
      projectName,
      directoryPath: targetDirectoryPath
    });
    await Promise.all(projectDependenciesHook.applyHook(templateName, {
      directoryPath: targetDirectoryPath
    }));
  } catch (e) {
    throw new Error(`Error running hook for ${templateName}: ${e instanceof Error ? e.message : e}`);
  }
  const packageJsonPath = path3.join(targetDirectoryPath, "package.json");
  if (fs.existsSync(packageJsonPath)) {
    const packageJson = fs.readFileSync(packageJsonPath, "utf-8");
    const packageJsonParsed = JSON.parse(packageJson);
    const newPackageJson = {
      name: projectName,
      ...packageJsonParsed
    };
    fs.writeFileSync(packageJsonPath, JSON.stringify(newPackageJson, null, 2));
  }
  console.log(konsol.green(`\uD83C\uDF89 Copied project files`));
  console.log(`\n Get started with:`);
  console.log(konsol.yellow(` \n cd ${target} && bun dev`));
}
var directoryName = "";
var config = {
  directory: directoryName,
  provider: "github",
  repository: "hihono",
  user: "riod94",
  ref: "main"
};
main();

/**
 * Minified by jsDelivr using Terser v5.3.5.
 * Original file: /npm/iconv-lite@0.6.3/lib/index.js
 *
 * Do NOT use SRI with dynamically generated files! More information: https://www.jsdelivr.com/using-sri-with-dynamic-files
 */
"use strict";
var stream_module,
  Buffer = require("safer-buffer").Buffer,
  bomHandling = require("./bom-handling"),
  iconv = module.exports;
(iconv.encodings = null),
  (iconv.defaultCharUnicode = "�"),
  (iconv.defaultCharSingleByte = "?"),
  (iconv.encode = function (e, n, o) {
    e = "" + (e || "");
    var c = iconv.getEncoder(n, o),
      r = c.write(e),
      i = c.end();
    return i && i.length > 0 ? Buffer.concat([r, i]) : r;
  }),
  (iconv.decode = function (e, n, o) {
    "string" == typeof e &&
      (iconv.skipDecodeWarning ||
        (console.error(
          "Iconv-lite warning: decode()-ing strings is deprecated. Refer to https://github.com/ashtuchkin/iconv-lite/wiki/Use-Buffers-when-decoding"
        ),
        (iconv.skipDecodeWarning = !0)),
      (e = Buffer.from("" + (e || ""), "binary")));
    var c = iconv.getDecoder(n, o),
      r = c.write(e),
      i = c.end();
    return i ? r + i : r;
  }),
  (iconv.encodingExists = function (e) {
    try {
      return iconv.getCodec(e), !0;
    } catch (e) {
      return !1;
    }
  }),
  (iconv.toEncoding = iconv.encode),
  (iconv.fromEncoding = iconv.decode),
  (iconv._codecDataCache = {}),
  (iconv.getCodec = function (e) {
    iconv.encodings || (iconv.encodings = require("../encodings"));
    for (var n = iconv._canonicalizeEncoding(e), o = {}; ; ) {
      var c = iconv._codecDataCache[n];
      if (c) return c;
      var r = iconv.encodings[n];
      switch (typeof r) {
        case "string":
          n = r;
          break;
        case "object":
          for (var i in r) o[i] = r[i];
          o.encodingName || (o.encodingName = n), (n = r.type);
          break;
        case "function":
          return (
            o.encodingName || (o.encodingName = n),
            (c = new r(o, iconv)),
            (iconv._codecDataCache[o.encodingName] = c),
            c
          );
        default:
          throw new Error(
            "Encoding not recognized: '" + e + "' (searched as: '" + n + "')"
          );
      }
    }
  }),
  (iconv._canonicalizeEncoding = function (e) {
    return ("" + e).toLowerCase().replace(/:\d{4}$|[^0-9a-z]/g, "");
  }),
  (iconv.getEncoder = function (e, n) {
    var o = iconv.getCodec(e),
      c = new o.encoder(n, o);
    return (
      o.bomAware && n && n.addBOM && (c = new bomHandling.PrependBOM(c, n)), c
    );
  }),
  (iconv.getDecoder = function (e, n) {
    var o = iconv.getCodec(e),
      c = new o.decoder(n, o);
    return (
      !o.bomAware ||
        (n && !1 === n.stripBOM) ||
        (c = new bomHandling.StripBOM(c, n)),
      c
    );
  }),
  (iconv.enableStreamingAPI = function (e) {
    if (!iconv.supportsStreams) {
      var n = require("./streams")(e);
      (iconv.IconvLiteEncoderStream = n.IconvLiteEncoderStream),
        (iconv.IconvLiteDecoderStream = n.IconvLiteDecoderStream),
        (iconv.encodeStream = function (e, n) {
          return new iconv.IconvLiteEncoderStream(iconv.getEncoder(e, n), n);
        }),
        (iconv.decodeStream = function (e, n) {
          return new iconv.IconvLiteDecoderStream(iconv.getDecoder(e, n), n);
        }),
        (iconv.supportsStreams = !0);
    }
  });
try {
  stream_module = require("stream");
} catch (e) {}
stream_module && stream_module.Transform
  ? iconv.enableStreamingAPI(stream_module)
  : (iconv.encodeStream = iconv.decodeStream =
      function () {
        throw new Error(
          "iconv-lite Streaming API is not enabled. Use iconv.enableStreamingAPI(require('stream')); to enable it."
        );
      });
//# sourceMappingURL=/sm/a1d317d532e0e79ff6c23991e5feb3ec213095604b1b775eb6ff7f2d09a31cd5.map

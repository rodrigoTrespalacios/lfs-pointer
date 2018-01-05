var asmCrypto = require('asmcrypto-lite')

function byteLength(str) {
  // returns the byte length of an utf8 string
  var s = str.length;
  for (var i=str.length-1; i>=0; i--) {
    var code = str.charCodeAt(i);
    if (code > 0x7f && code <= 0x7ff) s++;
    else if (code > 0x7ff && code <= 0xffff) s+=2;
    if (code >= 0xDC00 && code <= 0xDFFF) i--; //trail surrogate
  }
  return s;
}

function build_pointer_file_string_from_object(pointerObj, c) {
  var fileString = 'version https://git-lfs.github.com/spec/v1\n'
  var keys = Object.keys(pointerObj).sort();

  keys.forEach( function(key) {
    var isValidKey = /^[a-zA-Z0-9.-]+$/.test(key);
    if(!isValidKey) return c(null, 'Key ' + key + ' has invalid characters. Only [a-zA-Z0-9.-] allowed.')
    fileString += key + ' ' + pointerObj[key] + '\n'
  })

  c(fileString, null)
}

module.exports = function pointer(file_data, size, c) {
  if (typeof c !== "function") throw new Error("Callback function missing");
  var hash = asmCrypto.SHA256.hex(file_data)
  var pointerObj = {
    oid: 'sha256:' + hash,
    size: size,
  }
  build_pointer_file_string_from_object(pointerObj, function(pointerFile, err) {
    if (err) return c(null, err)
    c(pointerFile, null)
  })
}


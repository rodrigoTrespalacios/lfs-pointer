var fs = require('fs');
var pointer = require('./index')
var sha1 = require('sha1');

fs.readFile('../h.MOV', function read(err, data) {
  if(err) return console.log(err)
  var size = fs.statSync('../h.MOV').size
  pointer(data, size,  function(pointerFile, err) {
    if(err) throw new Error(err)
    fs.writeFile("./tmp/test", pointerFile, function(err) { console.log(err) })
  })
})

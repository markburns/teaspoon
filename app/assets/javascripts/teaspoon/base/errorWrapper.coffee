class Teaspoon.ErrorWrapper
  constructor: (@error)->

  urlRegex = /\b(https?):\/\/[\-A-Za-z0-9+&@#\/%?=~_|!:,.;]*[\-A-Za-z0-9+&@#\/%=~_|‌​]/
  lineEndingRegex = /(:[0-9]+)+$/
  lineNumberRegex = /[0-9]+$/

  urls: ->
    try
      @compact @error.stack.match(urlRegex).map (line)->
        try
          line.replace(lineEndingRegex,"")
        catch
          null
    catch
      []

  lineNumbers: ->
    try
      @compact @error.stack.match(urlRegex).map (line)->
        try
          parseInt line.match(lineNumberRegex)[0]
        catch
          null
    catch
      []
  compact: (array)->
    array.filter (item)-> item?

class Teaspoon.errorToFileMapper
  constructor: (@linesOfContext =5)->

  urlRegex = /\b(https?):\/\/[\-A-Za-z0-9+&@#\/%?=~_|!:,.;]*[\-A-Za-z0-9+&@#\/%=~_|‌​]/
  lineEndingRegex = /(:[0-9]+)+$/
  lineNumberRegex = /[0-9]+$/

  urlFrom: (error) ->
    error = new Teaspoon.ErrorWrapper(error)
    error.urls()[0]


  lineNumberFrom: (error)->
    error = new Teaspoon.ErrorWrapper(error)
    error.lineNumbers()[0]

  fetch: (error, loadComplete) =>
    url = @urlFrom(error)
    return loadComplete() unless url?
    lineNumber = @lineNumberFrom(error)
    return loadComplete() unless lineNumber?

    @fetchSourceCode(url, lineNumber, loadComplete)

  # Private

  xhr = null

  fetchSourceCode: (url, lineNumber, loadComplete) =>
    xhrRequest url, =>
      return unless xhr.readyState == 4
      throw("Unable to load file \"#{url}\".") unless xhr.status == 200
      loadComplete @extractLines(xhr.responseText, lineNumber)

  extractLines: (body, lineNumber)=>
    lines = body.split("\n")

    start  = parseInt(lineNumber - @linesOfContext / 2.0)
    finish = parseInt(lineNumber + @linesOfContext / 2.0)

    slice = lines.slice(start,finish)
    slice.join("\n")

  xhrRequest = (url, callback) ->
    if window.XMLHttpRequest # Mozilla, Safari, ...
      xhr = new XMLHttpRequest()
    else if window.ActiveXObject # IE
      try xhr = new ActiveXObject("Msxml2.XMLHTTP")
      catch e
        try xhr = new ActiveXObject("Microsoft.XMLHTTP")
        catch e
    throw("Unable to make Ajax Request") unless xhr

    xhr.onreadystatechange = callback
    xhr.open("GET", url, false)
    xhr.send()

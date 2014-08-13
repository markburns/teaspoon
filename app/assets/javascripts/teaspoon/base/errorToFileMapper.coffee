class Teaspoon.errorToFileMapper
  constructor: (error, linesOfContext =5)->
    @error = new Teaspoon.ErrorWrapper(error)
    @linesOfContext = linesOfContext

  fetch: (loadComplete) =>
    return loadComplete() unless @error.stackEntryAvailable()

    @fetchSourceCode(loadComplete)

  fetchSourceCode: (loadComplete) =>
    xhrRequest @error.url(), =>
      return unless xhr.readyState == 4
      throw("Unable to load file \"#{url}\".") unless xhr.status == 200
      loadComplete(@extractLines(xhr.responseText)...)

  extractLines: (body)=>
    lines = body.split("\n")
    surrounding = Math.floor(@linesOfContext / 2.0)
    lineIndex = @error.lineNumber() - 1

    start  = parseInt(lineIndex - surrounding)
    finish = parseInt(lineIndex + surrounding)

    before = lines.slice(start, lineIndex).join "\n"
    line = lines[lineIndex]
    after = lines.slice(lineIndex+ 1, finish+ 1).join "\n"

    [@error, before, line, after]


  # Private

  xhr = null


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

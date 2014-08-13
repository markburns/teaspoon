class Teaspoon.ErrorWrapper
  constructor: (@error)->

  urlRegex = /\b(https?):\/\/[\-A-Za-z0-9+&@#\/%?=~_|!:,.;]*[\-A-Za-z0-9+&@#\/%=~_|‌​]/g
  lineEndingRegex = /(:[0-9]+)+$/

  message: ()=>
    @removeErrorMessageFromStack()[0]

  stack: ()=>
    @removeErrorMessageFromStack()[1] || "Stack trace unavailable"


  stackEntryAvailable: =>
    @url()? && @lineNumber()?

  url: =>
    @lastApplicationStackTrace()?.replace(lineEndingRegex,"")

  lastApplicationStackTrace: =>
    @applicationStackTraceEntries()[0]

  lineNumberRegex = /(?::([0-9]+))?:([0-9]+)$/

  characters: =>
    result = @lastApplicationStackTrace()?.match(lineNumberRegex)
    number = if result[1]? then result[2] else null
    parseInt(number) if number

  lineNumber: =>
    result = @lastApplicationStackTrace().match(lineNumberRegex)
    number = if result[1]? then result[1] else result[2]
    parseInt(number)


  applicationStackTraceEntries: ->
    jasmineRegex = /jasmine\/\d\.\d\.\d\.js/

    @rawStackTraceEntries().filter (url)->
      !(url.match(jasmineRegex)?)

  rawStackTraceEntries: ->
    @compact @error.stack.match(urlRegex)

  compact: (array)->
    array.filter (item)-> item?

  removeErrorMessageFromStack: =>
    [stack, message] = [@error.stack.split("\n"), @error.message.split("\n")]

    isSubstring = (a,b)->
      (a).lastIndexOf(b) >= 0

    effectivelySame = (a,b)->
      isSubstring(a,b) || isSubstring(b,a)

    keepLineInStacktrace = (a,b)->
      !effectivelySame(a,b)

    stack = stack.filter (stackLine,index)->
      [a,b] = [(stackLine || ""), message[index] || ""]
      return true if a =="" || b ==""

      keepLineInStacktrace(a,b)

    [message.join("\n"), stack.join("\n")]

class Teaspoon.Reporters.HTML.FailureView extends Teaspoon.Reporters.BaseView

  constructor: (@spec) ->
    super


  build: ->
    super("spec")
    html = """<h1 class="teaspoon-clearfix"><a href="#{@spec.link}">#{@htmlSafe(@spec.fullDescription)}</a></h1>"""
    for error in @spec.errors()
      mapper = new Teaspoon.errorToFileMapper
      mapper.fetch error, (sourceCodeLines)=>
        if sourceCodeLines?
          sourceCode = """<pre class="source-code-extract">#{@htmlSafe(sourceCodeLines)}</pre>"""
          html += """<div>#{sourceCode}<strong>#{@htmlSafe(error.message)}</strong><br/>#{@htmlSafe(error.stack || "Stack trace unavailable")}</div>"""
        else
          sourceCode = ""
          [message, stack] = @removeErrorMessageFromStack(error)
          html += """<div><strong>#{message}</strong><br/>#{stack}</div>"""

        @el.innerHTML = html

  removeErrorMessageFromStack: (error)=>
    [stack, message] = [error.stack.split("\n"), error.message.split("\n")]

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


    [@htmlSafe(message.join("\n")), @htmlSafe(stack.join("\n"))]

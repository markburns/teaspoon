class Teaspoon.Reporters.HTML.FailureView extends Teaspoon.Reporters.BaseView

  constructor: (@spec) ->
    super


  build: ->
    super("spec")
    html = """<h1 class="teaspoon-clearfix"><a href="#{@spec.link}">#{@htmlSafe(@spec.fullDescription)}</a></h1>"""

    for error in @spec.errors()
      mapper = new Teaspoon.errorToFileMapper(error)
      mapper.fetch (error, before, line, after)=>
        sourceCode = """<pre class="source-code-extract">#{@htmlSafe(before)}</pre>"""

        sourceCode += "<br/>"
        sourceCode += """<pre class="source-code-extract main-line">#{@htmlSafe(line)}</pre>"""
        sourceCode += "<br/>"

        sourceCode += """<pre class="source-code-extract">#{@htmlSafe(after)}</pre>"""

        html += """<div>#{sourceCode}<strong>#{@htmlSafe(error.message())}</strong><br/>#{@htmlSafe(error.stack() )}</div>"""

        @el.innerHTML = html


class Teaspoon.Reporters.HTML.SpecView extends Teaspoon.Reporters.BaseView

  viewId = 0

  constructor: (@spec, @reporter) ->
    @views = @reporter.views
    @spec.viewId = viewId += 1
    @views.specs[@spec.viewId] = @
    super


  build: ->
    classes = ["spec"]
    classes.push("state-pending") if @spec.pending
    super(classes.join(" "))
    @el.innerHTML = """<a href="#{@spec.link}">#{@htmlSafe(@spec.description)}</a>"""
    @parentView = @buildParent()
    @parentView.append(@el)


  buildParent: ->
    parent = @spec.parent
    if parent.viewId
      @views.suites[parent.viewId]
    else
      view = new Teaspoon.Reporters.HTML.SuiteView(parent, @reporter)
      @views.suites[view.suite.viewId] = view


  buildErrors: ->
    div = @createEl("div")
    html = ""
    for error in @spec.errors()
      mapper = new Teaspoon.errorToFileMapper(error)

      mapper.fetch (error, before, line, after)=>
        sourceCode =  "<pre class='source-code-extract'><code>#{@htmlSafe(before)}\n</code>"
        sourceCode += "<code class='error-line'>#{@htmlSafe(line)}\n</code>"

        if error.characters()
          characters = Array(error.characters()).join(" ")
          sourceCode += "<code class='under-error-line'>#{characters}^\n</code>"

        sourceCode += "<code>#{@htmlSafe(after)}\n</code>"
        sourceCode += "</pre>"

        editUrl="mvim://open?url=file:///Users/markburns/kanji/teaspoon/lib/teaspoon/suite.rb&line=106"

        html += """<strong>#{@htmlSafe(error.message())}</strong><a class="file" href="#{editUrl}">#{sourceCode}</a>"""
        html += """<pre class="source-code-extract stack-trace"><code>\n#{linkify @htmlSafe(error.stack())}</code></pre>"""

        div.innerHTML = html
    @append(div)


  updateState: (state, elapsed) ->
    result = @spec.result()
    classes = ["state-#{state}"]
    classes.push("slow") if elapsed > Teaspoon.slow
    @el.innerHTML += "<span>#{elapsed}ms</span>" unless state == "failed"
    @el.className = classes.join(" ")
    @buildErrors() unless result.status == "passed"
    @parentView.updateState?(state)

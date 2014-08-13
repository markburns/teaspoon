class Teaspoon.Reporters.HTML.FailureView extends Teaspoon.Reporters.BaseView

  constructor: (@spec) ->
    super


  build: ->
    super("spec")
    html = """<h1 class="teaspoon-clearfix"><a href="#{@spec.link}">#{@htmlSafe(@spec.fullDescription)}</a></h1>"""
    mapper = new Teaspoon.errorToFileMapper

    for error in @spec.errors()
      mapper.fetch error, (sourceCodeLines)=>
        throw new Error "not implemented"
        
        @el.innerHTML = html


describe "Teaspoon.errorToFileMapper", ->

  beforeEach ->
    @mockXhr =
      readyState: 4
      status: 200
      responseText: jsFileBody
      getResponseHeader: -> "_type_"
      open: ->
      send: ->
    @xhrSpy = spyOn(@mockXhr, 'open')
    @xhrSpy
    try spyOn(window, 'XMLHttpRequest').andReturn(@mockXhr)
    catch e
      spyOn(window, 'ActiveXObject').andReturn(@mockXhr)


  jsFileBody =
    """
      (function() {
        var integration;

        integration = function() {
          return 'foo';
        };

      }).call(this);

      (function() {
        describe("Integration tests", function() {
          it("outputs file lines during errors", function() {
            return foo();
          });
        });
      }).call(this);
    end
    """

  url = "http://127.0.0.1:54933/relative/assets/integration/integration_spec.js?body=1"

  stack = """
     ReferenceError: foo is not defined in #{url}:13
    @#{url}:13 jasmine.Block.prototype.execute@http://127.0.0.1:54933/relative/assets/jasmine/1.3.1.js:1066 jasmine.Queue.prototype.next_@http://127.0.0.1:54933/relative/assets/jasmine/1.3.1.js:2098 jasmine.Queue.prototype.start@http://127.0.0.1:54933/relative/assets/jasmine/1.3.1.js:2051 jasmine.Spec.prototype.execute@http://127.0.0.1:54933/relative/assets/jasmine/1.3.1.js:2378 jasmine.Queue.prototype.next_@http://127.0.0.1:54933/relative/assets/jasmine/1.3.1.js:2098 jasmine.Queue.prototype.next_/onComplete@http://127.0.0.1:54933/relative/assets/jasmine/1.3.1.js:2094 jasmine.Spec.prototype.finish@http://127.0.0.1:54933/relative/assets/jasmine/1.3.1.js:2352 jasmine.Spec.prototype.execute/<@http://127.0.0.1:54933/relative/assets/jasmine/1.3.1.js:2379 jasmine.Queue.prototype.next_@http://127.0.0.1:54933/relative/assets/jasmine/1.3.1.js:2108 jasmine.Queue.prototype.next_/onComplete/<@http://127.0.0.1:54933/relative/assets/jasmine/1.3.1.js:2088
    """

  error = stack: stack

  describe "@urlFromStack", ->
    it "gets the url from the stack", ->
      mapper = new(Teaspoon.errorToFileMapper)
      expect(mapper.urlFrom(error)).toEqual(url)

  describe "@lineNumberFrom", ->
    it "fetches the line numberOf the exception from the stack", ->
      mapper = new(Teaspoon.errorToFileMapper)
      expect(mapper.lineNumberFrom(error)).toEqual(13)

  describe "@fetch", ->

    it "fetches the correct file", ->
      mapper = new Teaspoon.errorToFileMapper()
      mapper.fetch(error, ->{})

      expect(@xhrSpy).toHaveBeenCalledWith("GET", url, false)

  describe "@extractLines", ->
    it "extracts the correct lines", ->
      lines = """
        it("outputs file lines during errors", function() {
          return foo();
        });
      """

      lines = lines.split("\n")

      mapper = new Teaspoon.errorToFileMapper(linesOfContext=3)
      extracted = mapper.extractLines(jsFileBody, 13)

      extracted.split("\n").forEach (line, index)->
        expect(line.indexOf(lines[index])).not.toEqual -1





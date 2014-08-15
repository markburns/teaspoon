/* <![CDATA[ */
/* File:        linkify.js
 * Version:     20101010_1000
 * Copyright:   (c) 2010 Jeff Roberson - http://jmrware.com
 * MIT License: http://www.opensource.org/licenses/mit-license.php
 *
 * Summary: This script linkifys http URLs on a page.
 *
 * Usage:   See demonstration page: linkify.html
 */
function linkify(text) {
    /* Here is a commented version of the regex (in PHP string format):
    $url_pattern = '/# Rev:20100913_0900 github.com\/jmrware\/LinkifyURL
    # Match http & ftp URL that is not already linkified.
      # Alternative 1: URL delimited by (parentheses).
      (\()                     # $1  "(" start delimiter.
      ((?:ht|f)tps?:\/\/[a-z0-9\-._~!$&\'()*+,;=:\/?#[\]@%]+)  # $2: URL.
      (\))                     # $3: ")" end delimiter.
    | # Alternative 2: URL delimited by [square brackets].
      (\[)                     # $4: "[" start delimiter.
      ((?:ht|f)tps?:\/\/[a-z0-9\-._~!$&\'()*+,;=:\/?#[\]@%]+)  # $5: URL.
      (\])                     # $6: "]" end delimiter.
    | # Alternative 3: URL delimited by {curly braces}.
      (\{)                     # $7: "{" start delimiter.
      ((?:ht|f)tps?:\/\/[a-z0-9\-._~!$&\'()*+,;=:\/?#[\]@%]+)  # $8: URL.
      (\})                     # $9: "}" end delimiter.
    | # Alternative 4: URL delimited by <angle brackets>.
      (<|&(?:lt|\#60|\#x3c);)  # $10: "<" start delimiter (or HTML entity).
      ((?:ht|f)tps?:\/\/[a-z0-9\-._~!$&\'()*+,;=:\/?#[\]@%]+)  # $11: URL.
      (>|&(?:gt|\#62|\#x3e);)  # $12: ">" end delimiter (or HTML entity).
    | # Alternative 5: URL not delimited by (), [], {} or <>.
      (                        # $13: Prefix proving URL not already linked.
        (?: ^                  # Can be a beginning of line or string, or
        | [^=\s\'"\]]          # a non-"=", non-quote, non-"]", followed by
        ) \s*[\'"]?            # optional whitespace and optional quote;
      | [^=\s]\s+              # or... a non-equals sign followed by whitespace.
      )                        # End $13. Non-prelinkified-proof prefix.
      ( \b                     # $14: Other non-delimited URL.
        (?:ht|f)tps?:\/\/      # Required literal http, https, ftp or ftps prefix.
        [a-z0-9\-._~!$\'()*+,;=:\/?#[\]@%]+ # All URI chars except "&" (normal*).
        (?:                    # Either on a "&" or at the end of URI.
          (?!                  # Allow a "&" char only if not start of an...
            &(?:gt|\#0*62|\#x0*3e);                  # HTML ">" entity, or
          | &(?:amp|apos|quot|\#0*3[49]|\#x0*2[27]); # a [&\'"] entity if
            [.!&\',:?;]?        # followed by optional punctuation then
            (?:[^a-z0-9\-._~!$&\'()*+,;=:\/?#[\]@%]|$)  # a non-URI char or EOS.
          ) &                  # If neg-assertion true, match "&" (special).
          [a-z0-9\-._~!$\'()*+,;=:\/?#[\]@%]* # More non-& URI chars (normal*).
        )*                     # Unroll-the-loop (special normal*)*.
        [a-z0-9\-_~$()*+=\/#[\]@%]  # Last char can\'t be [.!&\',;:?]
      )                        # End $14. Other non-delimited URL.
    /imx';
    */
    var url_pattern = /(\()((?:ht|f)tps?:\/\/[a-z0-9\-._~!$&'()*+,;=:\/?#[\]@%]+)(\))|(\[)((?:ht|f)tps?:\/\/[a-z0-9\-._~!$&'()*+,;=:\/?#[\]@%]+)(\])|(\{)((?:ht|f)tps?:\/\/[a-z0-9\-._~!$&'()*+,;=:\/?#[\]@%]+)(\})|(<|&(?:lt|#60|#x3c);)((?:ht|f)tps?:\/\/[a-z0-9\-._~!$&'()*+,;=:\/?#[\]@%]+)(>|&(?:gt|#62|#x3e);)|((?:^|[^=\s'"\]])\s*['"]?|[^=\s]\s+)(\b(?:ht|f)tps?:\/\/[a-z0-9\-._~!$'()*+,;=:\/?#[\]@%]+(?:(?!&(?:gt|#0*62|#x0*3e);|&(?:amp|apos|quot|#0*3[49]|#x0*2[27]);[.!&',:?;]?(?:[^a-z0-9\-._~!$&'()*+,;=:\/?#[\]@%]|$))&[a-z0-9\-._~!$'()*+,;=:\/?#[\]@%]*)*[a-z0-9\-_~$()*+=\/#[\]@%])/img;
//    var url_replace = '$1$4$7$10$13<a href="$2$5$8$11$14">$2$5$8$11$14</a>$3$6$9$12';
//    return text.replace(url_pattern, url_replace);
//    var url_replace = '$1$4$7$10$13<a href="$2$5$8$11$14">$2$5$8$11$14</a>$3$6$9$12';
    return text.replace(url_pattern,
    		function ($0, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) {
	    		var len = arguments.length;
	    		for (var i = 0; i < len; ++i) {
	    			if (arguments[i] === undefined) arguments[i] = "";
	    		}
	    		var pre  = $1+$4+$7+$10+$13;
	    		var url  = $2+$5+$8+$11+$14;
	    		var post = $3+$6+$9+$12;
	    		if (allBalanced(url)) {
	    			return pre +'<a href="'+ url +'">'+ url +'</a>'+ post;
	    		} else {
		    		// Fixup urls ending with orphan "]" or "}"
		    		switch (url.slice(-1)) {
		    		case ')':
			    		if (!parensBalanced(url)) {
			    			if (parensBalanced(url.slice(0,-1))) {
			    				url = url.slice(0,-1);
			    				post = ')'+ post
			    			}
			    		}
			    		if (!bracketsBalanced(url)) {
			    			if (bracketsBalanced(url.slice(0,-1))) {
			    				url = url.slice(0,-1);
			    				post = ']'+ post
			    			}
			    		}
			    		break;
		    		case ']':
			    		if (!bracketsBalanced(url)) {
			    			if (bracketsBalanced(url.slice(0,-1))) {
			    				url = url.slice(0,-1);
			    				post = ']'+ post
			    			}
			    		}
			    		if (!parensBalanced(url)) {
			    			if (parensBalanced(url.slice(0,-1))) {
			    				url = url.slice(0,-1);
			    				post = ')'+ post
			    			}
			    		}
			    		break;
		    		}
	    		}
	    		if (allBalanced(url)) {
	    			return pre +'<a href="'+ url +'">'+ url +'</a>'+ post;
	    		} else return $0;
    		});
	function allBalanced(url) {
		return parensBalanced(url) && bracketsBalanced(url);
	}
	function parensBalanced(url) {
	    var re = /\([^()]*\)/g;
        while (url.search(re) !== -1) {
        	url = url.replace(re, '');
        }
		if (url.search(/[()]/) === -1) return true;
		return false;
	}
	function bracketsBalanced(url) {
	    var re = /\[[^[\]]*\]/g;
        while (url.search(re) !== -1) {
        	url = url.replace(re, '');
        }
		if (url.search(/[[\]]/) === -1) return true;
		return false;
	}

}

window.linkify = linkify;
/* ]]> */


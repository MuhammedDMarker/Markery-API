var searchAttr = 'data-search-mode';

// Javadoc Regex Helpers
function createSearchPattern(term) {
    var pattern = "";
    var isWordToken = false;
    term.replace(/,\s*/g, ", ").trim().split(/\s+/).forEach(function(w, index) {
        if (index > 0) {
            pattern += (isWordToken && /^\w/.test(w)) ? "\\s+" : "\\s*";
        }
        var tokens = w.split(/(?=[A-Z,.()<>[\/])/);
        for (var i = 0; i < tokens.length; i++) {
            var s = tokens[i];
            if (s === "") continue;
            // Escape Regex characters
            pattern += s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
            isWordToken =  /\w$/.test(s);
            if (isWordToken) {
                pattern += "([a-z0-9_$<>\\[\\]]*?)";
            }
        }
    });
    return pattern;
}

function createMatcher(pattern, flags) {
    var isCamelCase = /[A-Z]/.test(pattern);
    return new RegExp(pattern, flags + (isCamelCase ? "" : "i"));
}

function escapeHtml(str) {
    return str.replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// On Search Listener
document.getElementById("nav-search").addEventListener("keyup", function(event) {
    var searchTerm = this.value;

    if (!searchTerm) {
        // No search, show all results and clear highlights
        document.documentElement.removeAttribute(searchAttr);
        
        document.querySelectorAll("nav > ul > li:not(.level-hide)").forEach(function(elem) {
            elem.style.display = "block";
        });

        document.querySelectorAll("nav > ul > li > ul a").forEach(function(elem) {
            // Restore original text, removing highlights
            if (elem.hasAttribute('data-orig-text')) {
                elem.innerHTML = elem.getAttribute('data-orig-text');
            }
        });

        if (typeof hideAllButCurrent === "function") {
            hideAllButCurrent();
        } else {
            document.querySelectorAll("nav > ul > li > ul li").forEach(function(elem) {
                elem.style.display = "block";
            });
        }
    } else {
        // We are searching
        document.documentElement.setAttribute(searchAttr, '');

        var searchPattern = createSearchPattern(searchTerm);
        var fallbackPattern = createSearchPattern(searchTerm.toLowerCase());
        
        // Use Javadoc's CamelCase and fallback matchers
        var camelCaseMatcher = createMatcher(searchPattern, "g");
        var fallbackMatcher = new RegExp(fallbackPattern, "gi");

        // Show all parents
        document.querySelectorAll("nav > ul > li").forEach(function(elem) {
            elem.style.display = "block";
        });
        document.querySelectorAll("nav > ul").forEach(function(elem) {
            elem.style.display = "block";
        });
        
        // Hide all results initially
        document.querySelectorAll("nav > ul > li > ul li").forEach(function(elem) {
            elem.style.display = "none";
        });

        // Filter and Highlight Results
        document.querySelectorAll("nav > ul > li > ul a").forEach(function(elem) {
            // Store original text if not already stored
            if (!elem.hasAttribute('data-orig-text')) {
                elem.setAttribute('data-orig-text', elem.innerHTML);
            }
            
            var text = elem.textContent || elem.innerText || "";
            var escapedText = escapeHtml(text);
            
            // Check for match using Javadoc logic
            camelCaseMatcher.lastIndex = 0;
            fallbackMatcher.lastIndex = 0;
            
            var hasMatch = camelCaseMatcher.test(escapedText) || fallbackMatcher.test(escapedText);

            if (hasMatch) {
                elem.parentNode.style.display = "block";
                
                // Apply Highlight
                var highlighted = escapedText.replace(camelCaseMatcher, '<span class="result-highlight">$&</span>');
                if (highlighted === escapedText) {
                    highlighted = escapedText.replace(fallbackMatcher, '<span class="result-highlight">$&</span>');
                }
                elem.innerHTML = highlighted;
            }
        });

        // Hide parents without children
        document.querySelectorAll("nav > ul > li").forEach(function(parent) {
            var countUlVisible = 0;
            
            parent.querySelectorAll("ul").forEach(function(ulP) {
                var children = ulP.children;
                for (var i = 0; i < children.length; i++) {
                    if (children[i].style.display !== "none") {
                        countUlVisible++;
                    }
                }
            });
          
            if (countUlVisible === 0) {
                parent.style.display = "none";
            }
        });

        // Hide top-level categories if completely empty
        document.querySelectorAll("nav > ul.collapse_top").forEach(function(parent) {
            var countVisible = 0;
            parent.querySelectorAll("li").forEach(function(elem) {
                if (elem.style.display !== "none") {
                    countVisible++;
                }
            });
          
            if (countVisible === 0) {
                parent.style.display = "none";
            }
        });
    }
});
# trim

This JavaScript package provides an enhanced substitution for `String.prototype.trim()`, which functions well in cases with multiple lines.

# How to use it?

When no argument is passed and the string it's called on is a single-liner, it behaves just like the native `String.prototype.trim()`.

```js
'  hello\t'.trim()
=> 'hello'
```

When called on a string with multiple lines (separated with `'\n'`), it will automatically detect the indent pattern of the source string and trim the redundant indents off.
If there are any preceding or trailing lines full of whitespace characters, they'll be trimmed as well.

```js
`   hello, world\t
     What is this weird indent?
   (empty line below)
`.trim()
=> `hello, world
  What is this weird indent?
(empty line below)`
```

This is super handy when dealing with blog/code formatting in an HTML page.

```html
<pre>
    #include &lt;stdio.h&gt;
    int main() {
        printf("hello, world");
        return 0;
    }
</pre>
<script>
    // Automatically trim redundant code indents in <pre>
    for($pre of document.getElementsByTagName('pre')) {
        $pre => $pre.innerHTML = $pre.innerHTML.trim();
    }
</script>
```

You can also pass an object as an argument to configure its behavior. The configurable settings are listed below.

- `trimWhiteLines`: whether to remove the preceding and trailing lines that are full of whitespace characters, default set to `true`.
- `tabWidth`: no need to explain, pfft.
- `forceConvert`: forcefully convert all indents to spaces or tabs, default set to `false` (which means not to convert), you can set it to `' '` or `'\t'`. Note that the conversion result is affected by `tabWidth`.
- `strict`: when set to `true`, lines full of whitespace characters will not be ignored or trimmed, default set to `false`.
- `trimTrailing`: whether to remove the trailing whitespace characters in the lines, default set to `true`.
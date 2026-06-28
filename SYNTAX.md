# Vert 0.1.0-beta Syntax

Vert is a small programming language that uses JavaScript-like expressions with a simpler surface syntax.
Files usually use the `.vert` extension.

## Hello World

```vert
fn main() {
    log("Hello, World!")
}
```

When a Vert file is executed, Vert automatically calls `main()` if it exists.

## Program Entry

The entry point of a Vert program is:

```vert
fn main() {
    log("start")
}
```

Vert currently does not have comment syntax, so avoid `//` or `/* */` comments in real `.vert` files.

## Variables

Declare variables with `let`.

```vert
let name = "Vert"
let count = 3
```

Values can be reassigned.

```vert
let text = ""
text += "*"
```

## Functions

Define functions with `fn`.

```vert
fn add(a, b) {
    return a + b
}

fn main() {
    log(add(2, 3))
}
```

Function calls use parentheses.

```vert
star()
log("done")
```

## Strings

Vert supports single quotes, double quotes, and backtick strings.

```vert
let a = "hello"
let b = 'hello'
let c = `hello`
```

Escape characters can be used inside strings.

```vert
let text = "line\nnext"
```

## Numbers

Vert supports integer and decimal number literals.

```vert
let x = 10
let y = 3.14
let z = -5
```

## Operators

Vert supports common JavaScript-style operators.

Arithmetic:

```vert
a + b
a - b
a * b
a / b
a % b
```

Assignment:

```vert
a = 1
a += 1
a -= 1
a *= 2
a /= 2
a %= 2
```

Comparison:

```vert
a == b
a != b
a < b
a <= b
a > b
a >= b
```

Logic:

```vert
a && b
a || b
!a
```

Increment and decrement:

```vert
i++
i--
```

## If / Else

```vert
fn main() {
    let score = 90

    if (score >= 60) {
        log("pass")
    } else {
        log("fail")
    }
}
```

## While

```vert
fn main() {
    let i = 0

    while (i < 5) {
        log(i)
        i++
    }
}
```

## For In

Use `for` with `in` to iterate over an object or array-like value.

```vert
fn main() {
    for (let i in range(0, 5)) {
        log(i)
    }
}
```

With `range(0, 5)`, this prints indexes from `0` to `4`.

## Built-In Functions

### log(value)

Prints a value to the console.

```vert
log("Hello")
```

### range(a, b)

Creates a list of numbers from `a` up to, but not including, `b`.

```vert
range(0, 5)
```

Result:

```vert
[0, 1, 2, 3, 4]
```

### exit()

Stops the program.

```vert
exit()
```

## Import

Import another Vert file or a JavaScript file.

```vert
import "math.vert"
import "helper.js"
```

Imported `.vert` files are translated as Vert source code.
Imported `.js` files are included as JavaScript source code.

## Example

```vert
fn star() {
    let text = ""

    for (let i in range(0, 5)) {
        for (let j in range(0, i)) {
            text += "*"
        }

        log(text)
        text = ""
    }
}

fn main() {
    star()
}
```

Output:

```text

*
**
***
****
```

## Notes

- Vert syntax is currently line-based. Write each statement on its own line for the most reliable result.
- Identifiers such as `main`, `log`, and `range` are handled by Vert automatically.
- Vert is currently close to JavaScript internally, so many JavaScript-style expressions work.
- Comment syntax is not implemented yet.

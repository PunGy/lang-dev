# Language Development Platform

This repository is a playground for language development research.

Currently, it has an implementation of [Forth](https://en.wikipedia.org/wiki/Forth_(programming_language))-like pure [stack-oriented](https://en.wikipedia.org/wiki/Stack-oriented_programming) language which prints the entire path of execution.

Try here: https://lang-dev.pungy.me

Example of following code execution:

```text
(n1 n2 -- max)
: max
  over over               (n1 n2 n1 n2)
  = IF   drop             (they are equal)
    ELSE over over
         > IF drop        (n1 is greater)
           ELSE swap drop (n2 is greater)
           THEN
    THEN
;

25 20 max .
```

![code example](assets/code-example.png)


## Examples:

### Count down to 0

```
: countdown (n -- )
  BEGIN
    1 - print
    dup 0 =
  UNTIL
;

5 countdown
```

### Print string char by char

```
: print-string
  dup 'len dup (str len counter)
  BEGIN
    over over - 3 pick swap 'i .
    1 - dup 1 <
  UNTIL
;

"hello" print-string
```

### Factorial

```
: fac!
  dup 2 <
  IF drop 1 (just 1 in case you passed something below 2)
  ELSE
    dup (push result on top) (STACK: counter result)
    BEGIN
      swap 1 - swap (counter-1 result)
      over (counter' result counter')
      * (counter' result)
      over 3 < (repeat if counter is greater than 2)
    UNTIL
    swap drop
  THEN
;


5 fac! .
```

### String opeartions

```
"hello" " " '+ "world!" '+ .

">-<" 4 '* .
```

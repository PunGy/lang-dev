# A-0: stack-oriented computation system

Implementation of
[Forth](https://en.wikipedia.org/wiki/Forth_(programming_language))-like pure
[stack-oriented](https://en.wikipedia.org/wiki/Stack-oriented_programming)
language which prints the entire path of execution.

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

### Sum of values in stack

```
: sum
  empty?
  IF 0
  ELSE
    stack-len 1 >
    IF 
      BEGIN
        +
        stack-len 1 =
      UNTIL
    THEN
  THEN
;

1 2 3 4 5 sum .
```

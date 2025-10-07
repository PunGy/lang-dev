# Language Development Platform

This repository is a playground for language development research.

Currently, it has an implementation of [Forth](https://en.wikipedia.org/wiki/Forth_(programming_language))-like pure [stack-oriented](https://en.wikipedia.org/wiki/Stack-oriented_programming) language which prints the entire path of execution.

Try here: https://lang-dev.pungy.me

Example of following code execution:

```text
(n1 n2 -- max)
: max
  over over               (n1 n2 n1 n2)
  = if   drop             (they are equal)
    else over over
         > if drop        (n1 is greater)
           else swap drop (n2 is greater)
           then
    then
;

20 25 max .
```

![code example](assets/ui-example.png)

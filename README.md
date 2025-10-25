# Language Development Platform

This repository is a playground for language development research.

Currently implemented languages:

- [A-0](/src/a0/README.md): Forth-like stack-oriented language.
- [F-0](/src/f0/README.md): Untyped lambda calculus.

Try here: https://lang-dev.pungy.me

Example of following code execution (A-0 language):

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



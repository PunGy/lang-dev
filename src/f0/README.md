# Lambda calculus

Left-associativity

```
f a x = ((f a) x)
```

## Beta reduction

The β-reduction rule states that an application of the form `(\x.tx)a` would be reduced to the term:

```
t[x := a] -> ta
```

Examples:

```
(\x.x) a
β: x -> [x := a] = a

(\y.x)a
β: x -> [y := a] = x

(((\x.\y.y) a) b)
β: (\y.y) b -> [x := a] = ((\y.y) b)
β: y        -> [y := b] = b
```

SKK combinator

```
full: ((((\f.\g.\x.fx(gx)) (\x.\y.x)) (\x.\y.x)) a)
simplified: (\f.\g.\x.f x (g x)) (\x.\y.x) (\x.\y.x) a

β: (\g.\x.f x (g x)) (\x.\y.x) a   ->  [f  := (\x.\y.x)]    = (\g.\x.(\x.\y.x) x (g x)) (\x.\y.x) a
β: (\x.(\x.\y.x) x (g x)) a        ->  [g  := (\x.\y.x)]    = (\x.(\x.\y.x) x ((\x.\y.x) x)) a
β: ((\x.\y.x) x' ((\x.\y.x) x')) a ->  [x' := a]            = (\x.\y.x) a ((\x.\y.x) a)
β: (\y.x') ((\x.\y.x) a)           ->  [x' := a]            = (\y.a) ((\x.\y.x) a)
β: a                               ->  [y := ((\x.\y.x) a)] = a
```



```
(λx.λy.y x) (λz.z) w
β: (\y.y x) w -> [x := \z.z] = (\y.y (\z.z)) w
β: y (\z.z)   -> [y := w]    = w (\z.z)


(λf.λx.f (f x)) (λy.y z) a
β: (\x.f (f x)) a         -> [f := (λy.y z)]      = (\x.(\y.y z) ((\y.y z) x)) a
β: (\y.y z) ((\y.y z) x)  -> [x := a]             = (\y.y z) ((\y.y z) a)
β: y z                    -> [y := ((\y.y z) a)]  = ((\y.y z) a) z
β: (y z) z                -> [y := a]             = (a z) z
```

## Alpha reduction

Replacement of names which can conflict with each other

```
(\x.\y.x y) y a
α: ((\x.\y'.x y') -> [y |=> y'] -> (\x.\y'.x y')) y a
β: (\y'.x y') a   -> [x  -> y]  = (\y'.y y') a
β: y y'           -> [y' -> a]  = y a
```

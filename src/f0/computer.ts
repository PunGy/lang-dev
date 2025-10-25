import { execution } from "./execution";
import * as Token from "./tokens";

function freeVariables(expr: Token.Expression): Set<string> {
  switch (expr.type) {
    case Token.tvar:
      return new Set([expr.name.word]);
    case Token.tapply:
      const funcVars = freeVariables(expr.func);
      const argVars = freeVariables(expr.arg);
      return new Set([...funcVars, ...argVars]);
    case Token.tabstraction:
      const bodyVars = freeVariables(expr.expr);
      // A variable is free in λx.E if it's free in E and is not x.
      bodyVars.delete(expr.arg.name.word);
      return bodyVars;
  }
}

let alphaCounter = 0
function alphaConvertion(variable: Token.Variable): Token.Variable {
  return Token.makeVariable(Token.makeWord(variable.name.word + '_' + alphaCounter++))
}

function substitute(replaceWhere: Token.Expression, replaceWhat: Token.Variable, replaceWith: Token.Expression): Token.Expression {
  const varName = replaceWhat.name.word

  switch (replaceWhere.type) {
    case Token.tvar:
      return replaceWhere.name.word === varName ? replaceWith : replaceWhere
    case Token.tabstraction: {
      const funcVar = replaceWhere.arg
      const funcBody = replaceWhere.expr

      if (funcVar.name.word === varName) {
        // shadowing case
        return replaceWhere
      }

      const exprVars = freeVariables(replaceWith)
      if (exprVars.has(funcVar.name.word)) {
        // name collision
        const newVar = alphaConvertion(funcVar)
        const newBody = substitute(funcBody, funcVar, newVar)
        const fnc = Token.makeAbstraction(newVar, newBody)
        execution.operation(`α: [${funcVar.name.word} -> ${newVar.name.word}]`, { expression: fnc })
        return fnc
      }

      return Token.makeAbstraction(
        replaceWhere.arg,
        substitute(funcBody, replaceWhat, replaceWith),
      )
    }
    case Token.tapply:
      return Token.makeApplication(
        substitute(replaceWhere.func, replaceWhat, replaceWith),
        substitute(replaceWhere.arg, replaceWhat, replaceWith),
      )
  }
}

function betaRedex(expr: Token.Expression): [reduced: boolean, nextExpression: Token.Expression] {
  switch (expr.type) {
    case Token.tvar:
      return [false, expr]
    case Token.tabstraction: {
      const [reduced, newExpr] = betaRedex(expr.expr)
      if (reduced) {
        return [true, Token.makeAbstraction(expr.arg, newExpr)]
      }
      return [false, expr]
    }
    case Token.tapply: {
      const { func, arg } = expr

      if (func.type === Token.tabstraction) {
        return [true, substitute(func.expr, func.arg, arg)]
      }

      const funcReduction = betaRedex(func)
      if (funcReduction[0]) {
        return [true, Token.makeApplication(funcReduction[1], arg)]
      }

      const argReduction = betaRedex(arg)
      if (argReduction[0]) {
        return [true, Token.makeApplication(func, argReduction[1])]
      }
    }
  }

  return [false, expr]
}

export function run(expr: Token.Expression) {
  alphaCounter = 0
  let reduced = false

  do {
    [reduced, expr] = betaRedex(expr)
    if (reduced) {
      execution.operation('β', { expression: expr })
    }
  } while(reduced)

  return expr
}


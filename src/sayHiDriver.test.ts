import test from 'ava'
import xs from 'xstream'

import { sayHiDriver } from './sayHiDriver'

test
. cb
  ( 'Says Hi once'
  , (t) => {
      const ping1once$ =
        xs
        . periodic(1000)
        . drop(1)
        . take(1)
        . mapTo(1)
      const sayHi$ = sayHiDriver (ping1once$)
      sayHi$
      . addListener
        ( { next:
              (said) => {
                t.is(said, 'Hi')
                t.end()
              }
          , error:
              (err) => {
                t.fail(err.toString())
                t.end()
              }
          }
        )
    }
  )

test
. cb
  ( 'Says Hi 5 times'
  , (t) => {
      let times = 0
      const ping5once$ =
        xs
        . periodic(1000)
        . drop(1)
        . take(1)
        . mapTo(5)
      const sayHi$ = sayHiDriver (ping5once$)

      sayHi$
      . addListener
        ( { next:
            (said) => {
              t.is(said, 'Hi')
              times = times + 1
              if (times === 5) {
                t.end()
              }
            }
          }
        )
    }
  )

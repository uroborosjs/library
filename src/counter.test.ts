import test from 'ava'
import xs from 'xstream'
import
{ mockDOMSource
, div
} from '@cycle/dom'

import { counter } from './counter'

test
( 'counter shows DOM'
, (t) => {
    t.plan(1)

    const mockedDOM: any = mockDOMSource({})
    const mockedState: any =
      { stream: xs.of(10)
      }
    const sinks = counter({DOM: mockedDOM, state: mockedState})
    const expectedDOM =
      div
      ( [ div ('Count: 10')
        , div
          ( [ div
              ( { dataset:
                  { increment: true
                  }
                }
              , 'Increment'
              )
            , div
              ( { dataset:
                  { decrement: true
                  }
                }
              , 'Decrement'
              )
            ]
          )
        ]
      )


    sinks
    . DOM
    . subscribe
      ( { next:
          (value) => {
            t.deepEqual(value, expectedDOM)
          }
        }
      )
  }
)

test
( 'On increment button click, count + 1'
, (t) => {
    t.plan(7)

    let state = -3
    let answers = [-3, -2, -1, 0, 1, 2, 3]
    const mockedDOM: any =
      mockDOMSource
      ( { 'div[data-increment]':
          { click: xs.of(0, 1, 2, 3, 4, 5) }
        }
      )
    const mockedState: any =
      { stream: xs.of(0)
      }
    const sinks = counter({DOM: mockedDOM, state: mockedState})

    sinks
    . state
    . addListener
      ( { next:
          (reducer: any) => {
            state = reducer (state)
            t.is(state, answers[0])
            answers.shift()
          }
        }
      )
  }
)

test
( 'On decrement button click, count - 1'
, (t) => {
    t.plan(7)

    let state = 3
    let answers = [3, 2, 1, 0, -1, -2, -3]
    const mockedDOM: any =
      mockDOMSource
      ( { 'div[data-decrement]':
          { click: xs.of(0, 1, 2, 3, 4, 5) }
        }
      )
    const mockedState: any =
      { stream: xs.of()
      }
    const sinks = counter({DOM: mockedDOM, state: mockedState})

    sinks
    . state
    . subscribe
      ( { next:
          (reducer: any) => {
            state = reducer (state)
            t.is(answers[0], state)
            answers.shift()
          }
        }
      )
  }
)

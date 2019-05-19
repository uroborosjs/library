import
xs
, { Stream
  } from 'xstream'
import
{ DOMSource
, VNode
, div
} from '@cycle/dom'
import { StateSource } from '@cycle/state'

type State = number
type Sources =
  { DOM: DOMSource
  , state: StateSource<State>
  }
type InitReducer <T> = (prev: T | undefined) => T
type Reducer <T> = (prev: T) => T
type StateReducer <T> = InitReducer<T> | Reducer<T>
type StateSink<T> = Stream<StateReducer<T>>

type Sinks =
  { DOM: Stream<VNode>
  , state: StateSink<State>
  }
type Counter = (s: Sources) => Sinks
const counter: Counter =
  ({DOM, state}) => {
    const
    { increment$
    , decrement$
    } = intent(DOM)

    return (
      { DOM: dom(state.stream)
      , state: model({increment$, decrement$})
      }
    )
  }

type Increment$ =
  Record<'increment$', Stream<null>>
type Decrement$ =
  Record<'decrement$', Stream<null>>
type Actions =
  Increment$
  & Decrement$
type Intent = (DOM: DOMSource) => Actions
const intent: Intent =
  (DOM) => {
    const increment$ =
      DOM
      . select('div[data-increment]')
      . events('click')
      . mapTo(null)

    const decrement$ =
      DOM
      . select('div[data-decrement]')
      . events('click')
      . mapTo(null)

    return (
      { increment$
      , decrement$
      }
    )
  }

type Model = (actions: Actions) => Stream<StateReducer<State>>
const model: Model =
  ({increment$, decrement$}) => {
    const init$ =
      xs
      . of<InitReducer<State>>
        ((prev) => prev === undefined ? 0 : prev)

    const inc$ =
      increment$
      . mapTo<Reducer<State>>((prev) => prev + 1)

    const dec$ =
      decrement$
      . mapTo<Reducer<State>>((prev) => prev - 1)

    return xs.merge(init$, inc$, dec$)
  }

const toView =
  (state: State) =>
    div
    ( [ div (`Count: ${state}`)
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

type DOM = (state$: Stream<number>) => Stream<VNode>
const dom: DOM =
  (state$) =>
    state$.map(toView)

export
{ counter
}

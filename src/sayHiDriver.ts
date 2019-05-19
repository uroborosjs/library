import xs, { Stream } from 'xstream'
import { adapt } from '@cycle/run/lib/adapt'

type NPubSubCb = (str: string) => void
const nPubSub =
  (str: string) => {
    let cb: NPubSubCb = (someString: string) => {}

    const callCbNTimes =
      (n: number) => {
        if (n < 1) {
        } else {
          cb (str)
          callCbNTimes (n - 1)
        }
      }

    return (
      { setCb: (newCb: NPubSubCb) => { cb = newCb }
      , clearCb: () => { cb = (someString: string) => {} }
      , callN: (n:number) => { callCbNTimes(n) }
      }
    )
  }

type Hi = 'Hi'
type SayHiDriver = (sink$: Stream<number>) => Stream<Hi>
const sayHiDriver: SayHiDriver =
  (sink$) => {
    const hiNPubSub = nPubSub ('Hi')

    sink$
    . addListener
      ( { next:
            (n: number) => {
              hiNPubSub.callN(n)
            }
        }
      )

    const source$ =
      xs
      . create
        ( { start:
              (listener: any) => {
                hiNPubSub.setCb((hi: string) => { listener.next(hi) })
              }
          , stop:
              () => {
                hiNPubSub.clearCb()
              }
          }
        )

    return adapt(source$)
  }

export
{ sayHiDriver
}

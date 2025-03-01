import type {
  Block,
  BlockIdentifier,
  BlockNumber,
  BlockTag,
  Uncle,
} from './block.js'
import type { FeeHistory, FeeValues } from './fee.js'
import type { Log } from './log.js'
import type { Proof } from './proof.js'
import type {
  TransactionEIP1559,
  TransactionEIP2930,
  TransactionLegacy,
  TransactionReceipt,
  TransactionRequestEIP1559,
  TransactionRequestEIP2930,
  TransactionRequestLegacy,
} from './transaction.js'
import type { UnionOmit, UnionPartialBy } from './utils.js'

export type Index = `0x${string}`
export type Quantity = `0x${string}`
export type Status = '0x0' | '0x1'
export type TransactionType = '0x0' | '0x1' | '0x2' | (string & {})

export type RpcBlock<
  TBlockTag extends BlockTag = BlockTag,
  TIncludeTransactions extends boolean = boolean,
  TTransaction = RpcTransaction<TBlockTag extends 'pending' ? true : false>,
> = Block<Quantity, TIncludeTransactions, TBlockTag, TTransaction>
export type RpcBlockNumber = BlockNumber<Quantity>
export type RpcBlockIdentifier = BlockIdentifier<Quantity>
export type RpcUncle = Uncle<Quantity>
export type RpcFeeHistory = FeeHistory<Quantity>
export type RpcFeeValues = FeeValues<Quantity>
export type RpcLog = Log<Quantity, Index>
export type RpcProof = Proof<Quantity, Index>
export type RpcTransactionReceipt = TransactionReceipt<
  Quantity,
  Index,
  Status,
  TransactionType
>
export type RpcTransactionRequest =
  | TransactionRequestLegacy<Quantity, Index, '0x0'>
  | TransactionRequestEIP2930<Quantity, Index, '0x1'>
  | TransactionRequestEIP1559<Quantity, Index, '0x2'>
export type RpcTransaction<TPending extends boolean = boolean> = UnionOmit<
  UnionPartialBy<
    | TransactionLegacy<Quantity, Index, TPending, '0x0'>
    | TransactionEIP2930<Quantity, Index, TPending, '0x1'>
    | TransactionEIP1559<Quantity, Index, TPending, '0x2'>,
    // `yParity` is optional on the RPC type as some nodes do not return it
    // for 1559 & 2930 transactions (they should!).
    'yParity'
  >,
  'typeHex'
>

type SuccessResult<T> = {
  method?: never
  result: T
  error?: never
}
type ErrorResult<T> = {
  method?: never
  result?: never
  error: T
}
type Subscription<TResult, TError> = {
  method: 'eth_subscription'
  error?: never
  result?: never
  params: {
    subscription: string
  } & (
    | {
        result: TResult
        error?: never
      }
    | {
        result?: never
        error: TError
      }
  )
}

export type RpcRequest = {
  jsonrpc?: '2.0'
  method: string
  params?: any
  id?: number
}

export type RpcResponse<TResult = any, TError = any> = {
  jsonrpc: `${number}`
  id: number
} & (
  | SuccessResult<TResult>
  | ErrorResult<TError>
  | Subscription<TResult, TError>
)

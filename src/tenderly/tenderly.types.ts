export type TenderlyTransactionResponse = {
  hash: string
  block_hash: string
  block_number: number
  from: string
  gas: number
  gas_price: number
  gas_fee_cap: number
  gas_tip_cap: number
  cumulative_gas_used: number
  gas_used: number
  effective_gas_price: number
  input: string
  nonce: number
  to: string
  index: number
  value: string
  status: boolean
  addresses: string[]
  contract_ids: string[]
  network_id: string
  function_selector: string
  l1_block_number: number
  l1_timestamp: number
  deposit_tx: boolean
  system_tx: boolean
  mint: number
  error_message?: string
  method: string
}

export type TenderlySimulation = {
  id: string
  project_id: string
  owner_id: string
  network_id: string
  block_number: number
  transaction_index: number
  from: string
  to: string
  input: string
  gas: number
  gas_price: string
  gas_used: number
  value: string
  method: string
  status: boolean
  access_list: any
  queue_origin: string
  block_header: {
    number: string
    hash: string
    stateRoot: string
    parentHash: string
    sha3Uncles: string
    transactionsRoot: string
    receiptsRoot: string
    logsBloom: string
    timestamp: string
    difficulty: string
    gasLimit: string
    gasUsed: string
    miner: string
    extraData: string
    mixHash: string
    nonce: string
    baseFeePerGas: string
    size: string
    totalDifficulty: string
    uncles: any
    transactions: any
  }
  state_overrides: Record<string, Record<string, string>>
  deposit_tx: boolean
  system_tx: boolean
  error_message: string
  nonce: number
  addresses: string[]
  contract_ids: string[]
  shared: boolean
  created_at: string
}

export type TenderlyTransaction = {
  hash: string
  block_hash: string
  block_number: number
  from: string
  gas: number
  gas_price: number
  gas_fee_cap: number
  gas_tip_cap: number
  cumulative_gas_used: number
  gas_used: number
  effective_gas_price: number
  input: string
  nonce: number
  to: string
  index: number
  value: string
  access_list: null
  status: boolean
  addresses: string[]
  contract_ids: string[]
  network_id: string
  timestamp: string
  function_selector: string
  l1_block_number: number
  l1_timestamp: number
  deposit_tx: boolean
  system_tx: boolean
  sig: {
    v: string
    r: string
    s: string
  }
  transaction_info: any // more
  error_message: string
  error_info: {
    error_message: string
    address: string
  }
  method: string
  decoded_input: null
  call_trace: {
    call_type: string
    from: string
    to: string
    gas: number
    gas_used: number
    value: string
    address: string
    error: string
    subtraces: number
    input: string
    fromBalance: string
    toBalance: string
    trace_address?: string[]
    gas_in?: number
    gas_cost?: number
    output?: string
  }[]
}

export type TenderlySimulationResponse = {
  simulation: TenderlySimulation
  transaction: TenderlyTransaction
  // more data
}

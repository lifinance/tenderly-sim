export interface TenderlyContract {
    id: string;
    contract_id: string;
    balance: string;
    network_id: string;
    public: boolean;
    verified_by: string;
    verification_date: string;
    address: string;
    contract_name: string;
    ens_domain: null;
    type: string;
    standard: string;
    standards: string[];
    token_data: TokenData;
    child_contracts: ChildContract[];
    evm_version: string;
    compiler_version: string;
    optimizations_used: boolean;
    optimization_runs: number;
    libraries: null;
    compiler_settings: CompilerSettings;
    deployed_bytecode: string;
    creation_bytecode: string;
    data: Data;
    src_map: SrcMap;
    creation_block: number;
    creation_tx: string;
    creator_address: string;
    created_at: string;
    language: string;
    in_project: boolean;
}
export type TenderlyProjectContract = {
    id: string;
    contract: TenderlyContract;
    account: TenderlyContract;
    project_id: string;
    previous_versions: null;
    details_visible: boolean;
    include_in_transaction_listing: boolean;
    display_name: string;
    account_type: string;
    verification_type: string;
    added_at: string;
};
interface ChildContract {
    id: string;
    address: string;
    network_id: string;
}
interface CompilerSettings {
    optimizer: Optimizer;
}
interface Optimizer {
    enabled: boolean;
    runs: number;
}
interface Data {
    main_contract: number;
    contract_info: ContractInfo[];
    abi: ABI[];
    raw_abi: RawABI[];
    states: State[];
}
interface ABI {
    type: ABIType;
    name: string;
    constant: boolean;
    anonymous: boolean;
    stateMutability: StateMutability;
    inputs: ComponentElement[];
    outputs: State[] | null;
}
interface ComponentElement {
    name: string;
    type: NestedTypeType;
    storage_location: StorageLocation;
    offset: number;
    index: string;
    indexed: boolean;
    simple_type: Type;
}
interface Type {
    type: NestedTypeType;
}
declare enum NestedTypeType {
    Address = "address",
    Bool = "bool",
    Bytes = "bytes",
    Slice = "slice",
    String = "string",
    Uint = "uint",
    Uint256 = "uint256"
}
declare enum StorageLocation {
    Default = "default",
    Memory = "memory",
    Storage = "storage"
}
export interface State {
    name: string;
    type: string;
    storage_location: StorageLocation;
    offset: number;
    index: string;
    indexed: boolean;
    simple_type?: SimpleType;
    components?: ComponentElement[];
}
interface SimpleType {
    type: NestedTypeType;
    nested_type?: Type;
}
declare enum StateMutability {
    Empty = "",
    Nonpayable = "nonpayable",
    View = "view"
}
declare enum ABIType {
    Constructor = "constructor",
    Event = "event",
    Function = "function"
}
interface ContractInfo {
    id: number;
    path: string;
    name: string;
    source: string;
}
interface RawABI {
    constant?: boolean;
    inputs: RawABIInput[];
    name?: string;
    outputs?: Output[];
    payable?: boolean;
    stateMutability?: StateMutability;
    type: ABIType;
    anonymous?: boolean;
}
interface RawABIInput {
    name: string;
    type: NestedTypeType;
    indexed?: boolean;
}
interface Output {
    name: Name;
    type: NestedTypeType;
}
declare enum Name {
    Empty = "",
    Remaining = "remaining"
}
type SrcMap = object;
interface TokenData {
    symbol: string;
    name: string;
    decimals: number;
}
export {};
//# sourceMappingURL=tenderly.types.contract.d.ts.map
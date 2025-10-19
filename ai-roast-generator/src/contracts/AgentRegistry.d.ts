export declare const AGENT_REGISTRY_ABI: readonly [{
    readonly inputs: readonly [];
    readonly name: "platformOwner";
    readonly outputs: readonly [{
        readonly internalType: "address";
        readonly name: "";
        readonly type: "address";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "string";
        readonly name: "_agentName";
        readonly type: "string";
    }, {
        readonly internalType: "string";
        readonly name: "_roastText";
        readonly type: "string";
    }, {
        readonly internalType: "string";
        readonly name: "_imageUrl";
        readonly type: "string";
    }];
    readonly name: "recordRoast";
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "_roastId";
        readonly type: "uint256";
    }];
    readonly name: "voteRoast";
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "_limit";
        readonly type: "uint256";
    }];
    readonly name: "getTopRoasts";
    readonly outputs: readonly [{
        readonly components: readonly [{
            readonly internalType: "uint256";
            readonly name: "id";
            readonly type: "uint256";
        }, {
            readonly internalType: "string";
            readonly name: "agentName";
            readonly type: "string";
        }, {
            readonly internalType: "string";
            readonly name: "roastText";
            readonly type: "string";
        }, {
            readonly internalType: "string";
            readonly name: "imageUrl";
            readonly type: "string";
        }, {
            readonly internalType: "address";
            readonly name: "creator";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "votes";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "timestamp";
            readonly type: "uint256";
        }];
        readonly internalType: "struct AgentRegistry.Roast[]";
        readonly name: "";
        readonly type: "tuple[]";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [];
    readonly name: "getTotalRoasts";
    readonly outputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "";
        readonly type: "uint256";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly indexed: true;
        readonly internalType: "uint256";
        readonly name: "roastId";
        readonly type: "uint256";
    }, {
        readonly indexed: true;
        readonly internalType: "string";
        readonly name: "agentName";
        readonly type: "string";
    }, {
        readonly indexed: true;
        readonly internalType: "address";
        readonly name: "creator";
        readonly type: "address";
    }, {
        readonly indexed: false;
        readonly internalType: "string";
        readonly name: "imageUrl";
        readonly type: "string";
    }];
    readonly name: "RoastRecorded";
    readonly type: "event";
}, {
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly indexed: true;
        readonly internalType: "uint256";
        readonly name: "roastId";
        readonly type: "uint256";
    }, {
        readonly indexed: true;
        readonly internalType: "address";
        readonly name: "voter";
        readonly type: "address";
    }, {
        readonly indexed: false;
        readonly internalType: "uint256";
        readonly name: "totalVotes";
        readonly type: "uint256";
    }];
    readonly name: "RoastVoted";
    readonly type: "event";
}];
export declare const AGENT_REGISTRY_ADDRESS = "0x5b73C5498c1E3b4dbA84de0F1833c4a029d90519";
//# sourceMappingURL=AgentRegistry.d.ts.map
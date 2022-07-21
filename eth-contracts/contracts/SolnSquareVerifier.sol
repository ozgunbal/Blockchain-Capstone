// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./ERC721Mintable.sol";
import "./SquareVerifier.sol";

interface ISquareVerifier {
    struct Proof {
        Pairing.G1Point a;
        Pairing.G2Point b;
        Pairing.G1Point c;
    }
    function verifyTx(Proof memory proof, uint[1] memory input) external view returns (bool r);
}

contract SolnSquareVerifier is ERC721MintableComplete {
    event SolutionAdded(Solution solution, bytes32 solutionKey);

    ISquareVerifier verifier;

    struct Solution {
        uint256 index;
        address solutionAddress;
    }

    mapping (bytes32 => Solution) uniqueSolutions;

    constructor (address verifierAddress) ERC721MintableComplete() {
        verifier = ISquareVerifier(verifierAddress);
    }

    function _addSolution(uint256 _index, address _solutionAddress, bytes32 solutionKey) internal {
        Solution memory solution = Solution({
            index: _index,
            solutionAddress: _solutionAddress
        });
        uniqueSolutions[solutionKey] = solution;

        emit SolutionAdded(solution, solutionKey);
    }

    function mintWithProof (address to, uint256 tokenId, ISquareVerifier.Proof memory proof, uint[1] memory input) public returns (bool) {
        bytes32 solutionKey = keccak256(abi.encodePacked(proof.a.X, proof.a.Y, proof.b.X, proof.b.Y, proof.c.X, proof.c.Y, input));
        require(uniqueSolutions[solutionKey].solutionAddress == address(0), "Solution is not unique");
        require(verifier.verifyTx(proof, input), "Solution is not verified");
        _addSolution(tokenId, to, solutionKey);
        return super.mint(to, tokenId);
    }
}



























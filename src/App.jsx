import { useAddress, ConnectWallet, Web3Button, useContract, useNFTBalance } from '@thirdweb-dev/react';
import { useState, useEffect, useMemo } from 'react';

const App = () => {
  // Usando os hooks que o thirdweb nos dá.
  const address = useAddress();
  console.log("👋 Address:", address);
  // inicializar o contrato editionDrop e token
  const editionDropAddress = "0x31DeBdbD079eeB9A0513ccbf5caeA2B398915A05"
  const { contract: editionDrop } = useContract(editionDropAddress, "edition-drop");
  const { contract: token } = useContract("0xa9cf14497dB192544d71707b8f87F1d317416782", "token");
  // Hook para sabermos se o usuário tem nosso NFT.
  const { data: nftBalance } = useNFTBalance(editionDrop, address, "0")
  // Contrato TOKEN

//se tem o NFT
  const hasClaimedNFT = useMemo(() => {
    return nftBalance && nftBalance.gt(0)
  }, [nftBalance])

  // Guarda a quantidade de tokens que cada membro tem nessa variável de estado.
const [memberTokenAmounts, setMemberTokenAmounts] = useState([]);
// O array guardando todos os endereços dos nosso membros.
const [memberAddresses, setMemberAddresses] = useState([]);

// Uma função para diminuir o endereço da carteira de alguém, não é necessário mostrar a coisa toda.
const shortenAddress = (str) => {
  return str.substring(0, 6) + "..." + str.substring(str.length - 4);
};

// Esse useEffect pega todos os endereços dos nosso membros detendo nosso NFT.
useEffect(() => {
  if (!hasClaimedNFT) {
    return;
  }
  
  // Do mesmo jeito que fizemos no arquivo 7-airdrop-token.js! Pegue os usuários que tem nosso NFT
  // com o tokenId 0.
  const getAllAddresses = async () => {
    try {
      const memberAddresses = await editionDrop.history.getAllClaimerAddresses(0);
      setMemberAddresses(memberAddresses);
      console.log("🚀 Endereços de membros", memberAddresses);
    } catch (error) {
      console.error("falha ao pegar lista de membros", error);
    }

  };
  getAllAddresses();
}, [hasClaimedNFT, editionDrop.history]);

// Esse useEffect pega o # de tokens que cada membro tem.
useEffect(() => {
  if (!hasClaimedNFT) {
    return;
  }

  // Pega todos os saldos.
  const getAllBalances = async () => {
    try {
      const amounts = await token.history.getAllHolderBalances();
      setMemberTokenAmounts(amounts);
      console.log("👜 Quantidades", amounts);
    } catch (error) {
      console.error("falha ao buscar o saldo dos membros", error);
    }
  };
  getAllBalances();
}, [hasClaimedNFT, token.history]);


// Agora, nós combinamos os memberAddresses e os memberTokenAmounts em um único array
const memberList = useMemo(() => {
  return memberAddresses.map((address) => {
    // Se o endereço não está no memberTokenAmounts, isso significa que eles não
    // detêm nada do nosso token.
    const member = memberTokenAmounts?.find(({ holder }) => holder === address);

    return {
      address,
      tokenAmount: member?.balance.displayValue || "0",
    }
  });
}, [memberAddresses, memberTokenAmounts]);

    // Se ele não tiver uma carteira conectada vamos chamar Connect Wallet
    if (!address) {
    return (
      <div className="landing">
        <h1>Bem vindo ao SafaDAO</h1>
        <div className="btn-hero">
          <ConnectWallet btnTitle="Conectar Carteira" />
        </div>
      </div>
    );
  }

// Se o usuário já reivindicou seu NFT nós queremos mostrar a página interna da DAO para ele
// Apenas membros da DAO vão ver isso. Renderize todos os membros + quantidade de tokens
if (hasClaimedNFT) {
  return (
    <div className="member-page">
      <h1>🚴 Página dos membros da DAO</h1>
      <p>Parabéns por fazer parte desse clube de bikers!</p>
      <div>
        <div>
          <h2>Lista de Membros</h2>
          <table className="card">
            <thead>
              <tr>
                <th>Endereço</th>
                <th>Quantidade de Tokens</th>
              </tr>
            </thead>
            <tbody>
              {memberList.map((member) => {
                return (
                  <tr key={member.address}>
                    <td>{shortenAddress(member.address)}</td>
                    <td>{member.tokenAmount}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

  // Renderiza a tela de cunhagem do NFT.
  return (
    <div className="mint-nft">
      <h1>Para ser SafaDAO, precisa mintar seu NFT!</h1>
      <div className="btn-hero">
        <Web3Button 
          contractAddress={editionDropAddress}
          action={contract => {
            contract.erc1155.claim(0, 1)
          }}
          onSuccess={() => {
            console.log(`NFT mintado! Cheque seu NFT em: https://testnets.opensea.io/assets/${editionDrop.getAddress()}/0`);
          }}
          onError={error => {
            console.error("Não deu pra mintar seu NFT :/", error);
          }}
        >
          MINTE SEU NFT! (FREE)
        </Web3Button>
      </div>
    </div>
  );

}

export default App;
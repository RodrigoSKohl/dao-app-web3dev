import sdk from "./1-initialize-sdk.js";
import { readFileSync } from "fs";

(async () => {
  try {
    const editionDrop = await sdk.getContract(nft_contract, "edition-drop");
    await editionDrop.createBatch([
      {
        name: "NIGGA AHEGAO",
        description: "Bora ser SafaDAO?",
        image: readFileSync("scripts/assets/ahegao.png"),
      },
    ]);
    console.log("✅ Novo NFT criado com sucesso no !");
  } catch (error) {
    console.error("falha ao criar o novo NFT", error);
  }
})()
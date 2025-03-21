import { AnchorProvider, Program, setProvider } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import { BN } from "bn.js";
import { randomBytes } from "crypto";
import programInfo from "../constants/programInfo";

export const getProvider = (connection, wallet) => {
  const provider = new AnchorProvider(
    connection,
    wallet,
    AnchorProvider.defaultOptions()
  );
  setProvider(provider);
  return provider;
};

export async function initializeConfig(
  connection,
  wallet,
  maxDuration,
  maxAmount
) {
  console.log("here");
  try {
    const anchorProvider = getProvider(connection, wallet);
    const program = new Program(programInfo.idl_object, anchorProvider);
    const seed = new BN(randomBytes(8));
    const [config, config_bump] = PublicKey.findProgramAddressSync(
      [Buffer.from("config"), seed.toArrayLike(Buffer, "le", 8)],
      program.programId
    );
    // console.log(config);
    // console.log(key);

    const tx = await program.methods
      .initializeConfig(
        seed, // Seed
        new BN(maxDuration), // max_duration
        new BN(maxAmount) // max_amount
      )
      .accountsPartial({
        config: config,
      })
      .rpc();
    return {
      tx,
      seed,
      maxDurationS: maxDuration.toString(),
      maxAmountS: maxAmount.toString(),
      bump: config_bump,
      fee: 10,
      configKey: config,
    };
  } catch (err) {
    // @ts-ignore
    throw err;
  }
}

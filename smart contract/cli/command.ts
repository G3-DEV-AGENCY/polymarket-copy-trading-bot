import { program } from 'commander';
import { PublicKey } from '@solana/web3.js';
import { configProject, launchToken, migrate, setClusterConfig, swap, withdraw } from './scripts';

program.version('0.0.1');

programCommand('config').action(async (directory, cmd) => {
  const { env, keypair, rpc } = cmd.opts();

  await setClusterConfig(env, keypair, rpc);

  await configProject();
});

programCommand('launch').action(async (directory, cmd) => {
  const { env, keypair, rpc } = cmd.opts();

  await setClusterConfig(env, keypair, rpc);

  await launchToken();
});

programCommand('swap')
  .option('-t, --token <string>', 'token address')
  .option('-a, --amount <number>', 'swap amount')
  .option('-s, --style <string>', '0: buy token, 1: sell token')
  .action(async (directory, cmd) => {
    const { env, keypair, rpc, token, amount, style } = cmd.opts();

    await setClusterConfig(env, keypair, rpc);

    if (token === undefined) {
      console.log('Error token address');
      return;
    }

    if (amount === undefined) {
      console.log('Error swap amount');
      return;
    }

    if (style === undefined) {
      console.log('Error swap style');
      return;
    }

    await swap(new PublicKey(token), amount, style);
  });

programCommand('migrate')
  .option('-t, --token <string>', 'token address')
  .action(async (directory, cmd) => {
    const { env, keypair, rpc, token } = cmd.opts();

    await setClusterConfig(env, keypair, rpc);

    if (token === undefined) {
      console.log('Error token address');
      return;
    }

    await migrate(new PublicKey(token));
  });

programCommand('withdraw')
  .option('-t, --token <string>', 'token address')
  .action(async (directory, cmd) => {
    const { env, keypair, rpc, token } = cmd.opts();

    await setClusterConfig(env, keypair, rpc);

    if (token === undefined) {
      console.log('Error token address');
      return;
    }

    await withdraw(new PublicKey(token));
  });

function programCommand(name: string) {
  return program
    .command(name)
    .option(
      //  mainnet-beta, testnet, devnet
      '-e, --env <string>',
      'Solana cluster env name',
      'devnet'
    )
    .option('-r, --rpc <string>', 'Solana cluster RPC name', 'https://api.devnet.solana.com')
    .option('-k, --keypair <string>', 'Solana wallet Keypair Path', '../key/uu.json');
}

program.parse(process.argv);

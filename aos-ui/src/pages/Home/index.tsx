import { connect, createDataItemSigner } from '@permaweb/aoconnect';
import { useEffect, useState } from 'react';
import { useActiveAddress, useConnection } from 'arweave-wallet-kit';
import { ao_queryWalletProcesses } from '../../services';
import { prettyEntityId } from '@/utils';

const { result, results, message, spawn, monitor, unmonitor, dryrun } = connect(
  {
    MU_URL: 'https://mu.ao-testnet.xyz',
    CU_URL: 'https://cu.ao-testnet.xyz',
    GATEWAY_URL: 'https://arweave.net',
  }
);

const PROCESS_ID = '_WhVW-1HD4chJw87N34U2sYaItB0UJM1Psn4bflyImI';

export function Home() {
  const connection = useConnection();
  const activeAddress = useActiveAddress();

  const [processes, setProcesses] = useState<unknown[]>([]);

  useEffect(() => {
    if (connection.connected && activeAddress) {
      console.log(activeAddress);
      loadProcesses(activeAddress);
    } else {
      console.log('not connected');
    }
  }, [activeAddress, connection.connected]);

  async function loadProcesses(walletAddress: string) {
    const result = await ao_queryWalletProcesses(walletAddress);
    setProcesses(result.rows);
    console.log(result);
  }

  async function getResults() {
    // createDataItemSigner();

    const resultsOut = await results({
      process: PROCESS_ID,
      sort: 'ASC',
      limit: 25,
      //   from: 'eyJ0aW1lc3RhbXAiOjE3MTg0Njc5ODU3MjYsIm9yZGluYXRlIjoiNzIwMSIsImNyb24iOm51bGwsInNvcnQiOiJBU0MifQ==',
    });
    console.log(resultsOut);
  }

  async function tet2() {
    const sign = createDataItemSigner(window.arweaveWallet);
  }

  return (
    <div className="h-[calc(100vh_-_64px)] p-8 overflow-auto bg-[#f6f6f7]">
      <div className="m-auto w-[1024px] h-[600px] min-h-[600px] border rounded-md relative bg-white">
        {/* connect wallet overlay */}
        {connection.connected ? null : (
          <div className=" absolute top-0 left-0 h-full w-full flex justify-center items-center bg-slate-200 opacity-85">
            Please connect wallet first!
          </div>
        )}
        <div className="flex h-full shadow-lg rounded-lg overflow-hidden">
          <div className="w-[240px] h-full border-r">
            <div className="border-b text-center p-4 relative">
              <div className='absolute top-0 left-0 text-xs p-1 bg-black text-white'>Process Info</div>
              <div>Avatar</div>
              <div>name: {processes[0]?.node?.tags?.[1]?.value}</div>
              <div>id: {prettyEntityId(processes[0]?.node?.id)}</div>
              {/* Process List
              {processes.map((process: any) => {
                return <div>{process.node?.id}</div>;
              })} */}
            </div>
            <div>Chat</div>
            <div>Inbox</div>
          </div>
          <div className="flex-1 p-4">
            <button onClick={getResults}>shishis </button>|{' '}
            <button onClick={tet2}>Btn2 </button>
          </div>
        </div>
      </div>
    </div>
  );
}

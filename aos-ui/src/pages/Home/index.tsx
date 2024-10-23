import { connect, createDataItemSigner } from '@permaweb/aoconnect';
import { useEffect, useState } from 'react';
import { useActiveAddress, useConnection } from 'arweave-wallet-kit';
import { Button, Modal, Table, Menu } from 'antd';
import { User, Copy } from 'lucide-react';
import { Outlet } from 'react-router-dom';
import { ao_queryWalletProcesses } from '@/services';
import { prettyEntityId } from '@/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { router } from '@/router';

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
  const [open, setOpen] = useState(false);
  const [menuKeys, setSelectedKeys] = useState(['inbox']);

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

  function changeProcess() {
    setOpen(true);
  }

  return (
    <div className="h-[calc(100vh_-_64px)] p-8 overflow-auto bg-[#f6f6f7]">
      <div className="m-auto w-[1024px] h-[600px] min-h-[600px] border rounded-md relative bg-white">
        {/* connect wallet overlay */}
        {connection.connected ? null : (
          <div className="absolute top-0 left-0 z-10 h-full w-full flex justify-center items-center bg-slate-200 opacity-85">
            Please connect wallet first!
          </div>
        )}
        <div className="flex h-full shadow-lg rounded-lg overflow-hidden">
          <div className="w-[240px] h-full border-r">
            <div className="border-b text-center p-4 relative">
              <div className="absolute top-0 left-0 text-xs p-1 bg-black text-white">
                Process Info
              </div>
              <div className="text-lg flex justify-center">
                <Avatar className="h-12 w-12">
                  <AvatarFallback>
                    <User />
                  </AvatarFallback>
                </Avatar>
              </div>
              <div>
                <span>
                  Name: <strong>{processes[0]?.node?.tags?.[1]?.value}</strong>
                </span>
                <Button type="link" className="px-2" onClick={changeProcess}>
                  Change
                </Button>
              </div>
              <div>
                ID: <strong>{prettyEntityId(processes[0]?.node?.id)}</strong>
                <div className="h-6 w-6 pl-2 inline-block leading-6 align-bottom">
                  <Copy className="h-4 w-4 cursor-pointer inline-block active:w-3" />
                </div>
              </div>
              {/* Process List
              {processes.map((process: any) => {
                return <div>{process.node?.id}</div>;
              })} */}
            </div>
            <div>
              <Menu
                items={[
                  { type: 'item', key: 'inbox', label: 'Inbox' },
                  { type: 'item', key: 'chat', label: 'Chat' },
                ]}
                selectedKeys={menuKeys}
                onSelect={(info) => {
                  router.navigate(`/${info.key}`);
                  setSelectedKeys(info.selectedKeys);
                }}
              ></Menu>
            </div>
          </div>
          <div className="flex-1 p-4">
            <button onClick={getResults}>shishis </button>|{' '}
            <button onClick={tet2}>Btn2 </button>
            <Outlet />
          </div>
        </div>
      </div>
      <Modal title="Choose process" open={open} onCancel={() => setOpen(false)}>
        <Table />
      </Modal>
    </div>
  );
}

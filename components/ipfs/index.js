import { createHelia } from "helia";
import { React, useState, useEffect } from "react";
import { Web3Storage } from "web3.storage";

const IpfsComponent = (info) => {
  const [id, setId] = useState(null);
  const [helia, setHelia] = useState(null);
  const [isOnline, setIsOnline] = useState(false);
  const [data, setData] = useState({});
  function getAccessToken() {
    return process.env.NEXT_PUBLIC_WEB3STORAGE_TOKEN;
  }
  function makeStorageClient() {
    return new Web3Storage({ token: getAccessToken() });
  }

  useEffect(() => {
    const init = async () => {
      const heliaNode = await createHelia();

      const nodeId = await heliaNode.libp2p.peerId.toString();
      const nodeIsOnline = await heliaNode.libp2p.isStarted();

      const client = await makeStorageClient();
      console.log(info);
      const res = await client.get(info.cid);
      const files = await res.files();
      if (res && files && files.length > 0) {
        const content = await files[0].text();
        const json = JSON.parse(content);
        console.log({ json });
        setData(json);
      }
      setHelia(heliaNode);
      setId(nodeId);
      setIsOnline(nodeIsOnline);
    };

    init();
  }, [info]);

  if (!helia || !id || !info) {
    return <h4>Connecting to IPFS...</h4>;
  }

  return (
    <div>
      <h4 data-test="id">ID: {id.toString()}</h4>
      <h4 data-test="status">Status: {isOnline ? "Online" : "Offline"}</h4>
      {info && <h4 data-test="cid">CID: {info.cid}</h4>}
      <div>
        <pre data-test="content">Content: {JSON.stringify(data, null, 2)}</pre>
      </div>
    </div>
  );
};

export default IpfsComponent;

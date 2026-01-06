import dotenv from 'dotenv'
dotenv.config()

import { NodeSSH } from 'node-ssh'
const ssh = new NodeSSH()

ssh.connect({
  host: process.env.remote_sship,
  port: process.env.remote_sshport ? parseInt(process.env.remote_sshport) : 22,
  username: process.env.remote_sshuser,
  password: process.env.remote_sshpass,
})
  .then(async () => {
    const [macAddressResult, arpResult] = await Promise.all([
      ssh.execCommand('show mac address-table'),
      ssh.execCommand('show ip arp'),
    ]);

    if (macAddressResult.code !== 0) {
      console.error('Error executing "show mac address-table":', macAddressResult.stderr);
      ssh.dispose();
      return;
    }
    if (arpResult.code !== 0) {
      console.error('Error executing "show ip arp":', arpResult.stderr);
      ssh.dispose();
      return;
    }

    const macAddressTableOutput = macAddressResult.stdout;
    const arpListOutput = arpResult.stdout;

    const macPortMap = new Map<string, { vlan: string; port: string }>();
    macAddressTableOutput.trim().split('\n').forEach(line => {
      const parts = line.trim().split(/\s+/);
      const vlan = parts[0];
      const mac = parts[1];
      const port = parts[3];

      if (parts.length >= 4 && vlan && /^\d+$/.test(vlan) && mac && port) {
        const portMatch = port.match(/^eth-0-(\d+)$/);
        if (portMatch && portMatch[1]) {
          const portNumber = parseInt(portMatch[1], 10);
          if (portNumber < 49) {
            macPortMap.set(mac, { vlan, port });
          }
        }
      }
    });

    const macToIpMap = new Map<string, string>();
    arpListOutput.trim().split('\n').forEach(line => {
      const parts = line.trim().split(/\s+/);
      if (parts.length >= 4 && parts[0] === 'Internet') {
        const ip = parts[1];
        const mac = parts[3];
        if (ip && mac) {
          macToIpMap.set(mac, ip);
        }
      }
    });

    const resultObj: Record<string, string[]> = {};
    macPortMap.forEach(({ vlan, port }, mac) => {
      if (macToIpMap.has(mac)) {
        const ip = macToIpMap.get(mac)!;
        const ipParts = ip.split('.');
        if (ipParts.length === 4 && ipParts[3]) {
          const lastOctet = parseInt(ipParts[3], 10);
          if (!isNaN(lastOctet) && lastOctet < 77) {
            resultObj[port] = [ip, mac, vlan];
          }
        }
      }
    });

    console.log(JSON.stringify(resultObj, null, 2));

    ssh.dispose();
  })
  .catch((error) => {
    console.error('SSH Connection Error:', error);
    ssh.dispose();
  });

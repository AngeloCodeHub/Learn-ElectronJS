import { NodeSSH } from 'node-ssh'
import env from './Confidential/env.json';

let MACObj: { [key: string]: { switch: number; ip: string; port: string } } = {};
const regexRouter = /address=(\d+\.\d+\.\d+\.\d+).*mac-address=([a-f0-9]{2}:[a-f0-9]{2}:[a-f0-9]{2}:[a-f0-9]{2}:[a-f0-9]{2}:[a-f0-9]{2})/i;
const regexSwitch = /([0-9a-f]{4}\.[0-9a-f]{4}\.[0-9a-f]{4})\s+\S+\s+(eth-0-(?!49$)(?!50$)(?!51$)\d{1,2})/i;
const re = /(\.|:)/gi;

const ssh = new NodeSSH()

ssh.connect({
  host: env[3]['ROS-Host'],
  port: env[3]['ROS-SSHPort'],
  username: env[3]['ROS-User'],
  password: env[3]['ROS-Password'],
})
  .then(async () => {
    await ssh.execCommand('ip/arp/print terse where mac-address!=00:00:00:00:00:00 status=permanent')
      .then(function (result) {
        let data = result.stdout
        data.split('\n').forEach((line) => {
          const match = line.match(regexRouter);
          if (match) {
            match[2] = match[2].replaceAll(re, '').toLowerCase();
            // console.log(match[1], match[2]);
            MACObj[match[2]] = { switch: 2, ip: match[1], port: '0', };
          }
        })
      })
    ssh.dispose();
  })
  .then(() => {
    ssh.connect({
      host: env[3]['Switch2-Host'],
      port: env[3]['Switch2-SSHPort'],
      username: env[3]['Switch2-User'],
      password: env[3]['Switch2-Password'],
    })
      .then(async () => {
        await ssh.execCommand('show mac address-table')
          .then(function (result) {
            let data = result.stdout
            data.split('\n').forEach((line) => {
              const match = line.match(regexSwitch);
              if (match) {
                match[1] = match[1].replaceAll(re, '');
                MACObj[match[1]].port = match[2];
              }
            })
          })
      })
      .then(() => {
        // Bun.write("./build/MAC.json", JSON.stringify(MACObj, null, 2));
        console.log(MACObj);
        ssh.dispose();
        console.log('done');
      })
  })


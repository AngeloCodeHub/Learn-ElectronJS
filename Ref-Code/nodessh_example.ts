// require('dotenv').config();
// import 'dotenv/config'

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
    await ssh.execCommand('show mac address-table')
      // await ssh.exec('show interface eth-0-15')
      .then(function (result) {

        console.log(result.stdout);
        // console.log(result);

        // let data = result.stdout
        // data.split('\n').forEach((line) => {
        //   const match = line.match(regexRouter);
        //   if (match) {
        //     match[2] = match[2].replaceAll(re, '').toLowerCase();
        //     // console.log(match[1], match[2]);
        //     MACObj[match[2]] = { switch: 2, ip: match[1], port: '0', };
        //   }
        // })
      })
    ssh.dispose();
  })

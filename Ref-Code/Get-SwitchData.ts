import { NodeSSH } from 'node-ssh'
import { writeFileSync } from 'fs'

const ignorePorts_SW1 = [
  "agg0", "eth-0-3", "eth-0-7", "eth-0-19", "eth-0-20", "eth-0-21",
  "eth-0-49", "eth-0-50", "eth-0-51", "eth-0-52", "eth-0-53", "eth-0-54"
]

const ignorePorts_SW2 = [
  "eth-0-46",
  "eth-0-49", "eth-0-50", "eth-0-51", "eth-0-52", "eth-0-53", "eth-0-54"
]

const ignorePorts_SW3 = [
  "eth-0-43",
  "eth-0-49", "eth-0-50", "eth-0-51", "eth-0-52", "eth-0-53", "eth-0-54"
]

const SwitchIP = [process.env.Switch1_IP, process.env.Switch2_IP, process.env.Switch3_IP]
const SwitchPorts = [process.env.Switch1_Port, process.env.Switch2_Port, process.env.Switch3_Port]

interface DeviceInfo {
  SwitchIP: string
  SwitchPort: string
  LanPort: string
  Speed: string
  IP: string
}

interface MacAddressData {
  [macAddress: string]: DeviceInfo
}

// Function to parse MAC address table output
function parseMacAddressTable(output: string, ignorePorts: string[]): Map<string, string> {
  const macToPort = new Map<string, string>()
  const lines = output.split('\n')

  for (const line of lines) {
    const trimmed = line.trim()
    if (trimmed && !trimmed.includes('---') && !trimmed.includes('Vlan') &&
      !trimmed.includes('Mac Address Table') && !trimmed.includes('(*)') &&
      !trimmed.includes('(MO)') && !trimmed.includes('(E)')) {

      const parts = trimmed.split(/\s+/)
      if (parts.length >= 4 && parts[1] && parts[3]) {
        const macAddress = parts[1]
        const port = parts[3]

        // Skip ignored ports
        if (!ignorePorts.includes(port)) {
          macToPort.set(macAddress, port)
        }
      }
    }
  }

  return macToPort
}

// Function to parse ARP table output
function parseArpTable(output: string): Map<string, string> {
  const macToIp = new Map<string, string>()
  const lines = output.split('\n')

  for (const line of lines) {
    const trimmed = line.trim()
    if (trimmed && trimmed.includes('Internet')) {
      const parts = trimmed.split(/\s+/)
      if (parts.length >= 4 && parts[1] && parts[3]) {
        const ip = parts[1]
        const macAddress = parts[3]
        macToIp.set(macAddress, ip)
      }
    }
  }

  return macToIp
}

// Function to parse interface status output
function parseInterfaceStatus(output: string): Map<string, string> {
  const portToSpeed = new Map<string, string>()
  const lines = output.split('\n')

  for (const line of lines) {
    const trimmed = line.trim()
    if (trimmed && trimmed.startsWith('eth-')) {
      const parts = trimmed.split(/\s+/)
      if (parts.length >= 4 && parts[0] && parts[3]) {
        const port = parts[0]
        const speed = parts[3]
        portToSpeed.set(port, speed)
      }
    }
  }

  return portToSpeed
}

// Function to collect data from a single switch
async function collectSwitchData(switchIP: string, switchPort: string, ignorePorts: string[]): Promise<MacAddressData> {
  const ssh = new NodeSSH()

  try {
    await ssh.connect({
      host: switchIP,
      port: switchPort ? parseInt(switchPort) : 22,
      username: process.env.Switch_user || '',
      password: process.env.Switch_pass || ''
    })

    console.log(`Connected to switch: ${switchIP}`)

    const [macAddressResult, arpResult, interfaceResult] = await Promise.all([
      ssh.execCommand('show mac address-table'),
      ssh.execCommand('show ip arp'),
      ssh.execCommand('show interface status')
    ])

    // Parse all the data
    const macToPort = parseMacAddressTable(macAddressResult.stdout, ignorePorts)
    const macToIp = parseArpTable(arpResult.stdout)
    const portToSpeed = parseInterfaceStatus(interfaceResult.stdout)

    const switchData: MacAddressData = {}

    // Combine all data
    for (const [macAddress, port] of macToPort) {
      const ip = macToIp.get(macAddress) || ''
      const speed = portToSpeed.get(port) || ''

      switchData[macAddress] = {
        SwitchIP: switchIP,
        SwitchPort: switchPort,
        LanPort: port,
        Speed: speed,
        IP: ip
      }
    }

    ssh.dispose()
    console.log(`Collected ${Object.keys(switchData).length} devices from ${switchIP}`)

    return switchData

  } catch (error) {
    console.error(`Error connecting to switch ${switchIP}:`, error)
    ssh.dispose()
    return {}
  }
}

// Main function to collect data from all switches
async function collectAllSwitchData(): Promise<void> {
  const allData: MacAddressData = {}
  const ignorePortsArray = [ignorePorts_SW1, ignorePorts_SW2, ignorePorts_SW3]

  for (let i = 0; i < SwitchIP.length; i++) {
    const switchIP = SwitchIP[i]
    const switchPort = SwitchPorts[i]
    if (switchIP && switchPort) {
      const ignorePorts = ignorePortsArray[i] || []
      console.log(`Processing Switch ${i + 1}: ${switchIP}:${switchPort} with ignore ports:`, ignorePorts)
      const switchData = await collectSwitchData(switchIP, switchPort, ignorePorts)
      Object.assign(allData, switchData)
    }
  }

  // Save to JSON file
  const outputFile = 'switch_data.json'
  writeFileSync(outputFile, JSON.stringify(allData, null, 2), 'utf8')
  console.log(`Data saved to ${outputFile}`)
  console.log(`Total devices collected: ${Object.keys(allData).length}`)
}

// Run the main function
collectAllSwitchData().catch(console.error)

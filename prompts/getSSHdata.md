# nodessh套件 抓 switch 資料

程式中會給予 SwitchIP 的陣列資料，填入以下 json "SwitchIP" 的 value
使用 nodessh套件 抓 switch 資料，然後存成一個json檔案，json範例格式如下
```json
{
  "001A.2B3C.4D5E": {
    "SwitchIP": "192.168.1.1",
    "LanPort": "eth-0-31",
    "Speed": "a-1000",
    "IP": "192.168.1.52",
  }
}
```

程式中會給每一台Switch要忽略孔位的陣列資料 "ignorePorts_SWN"，這些孔位不用處理與儲存，如 SwitchIP[0] 套用 ignorePorts_SW1

由於有多台 Switch 資料要抓取，可以把抓取資料程式寫成一個函式

對話過程請使用繁體中文

## 抓取 mac-address-table 與孔位

1. "show mac address-table" 會輸出以下資料
    ```Powershell
    Mac Address Table
    -------------------------------------------
    (*)  - Security Entry     (M)  - MLAG Entry
    (MO) - MLAG Output Entry  (MI) - MLAG Input Entry
    (E)  - EVPN Entry         (EO) - EVPN Output Entry
    (EI) - EVPN Input Entry
    Vlan    Mac Address       Type        Ports
    ----    -----------       --------    -----
    1       d85b.2220.ab1a    dynamic     eth-0-49
    2       1499.3edc.5980    dynamic     eth-0-49
    2       c64d.13c1.9233    dynamic     eth-0-49
    2       fc34.97bf.0449    dynamic     eth-0-22
    2       00da.9a72.7a63    dynamic     eth-0-49
    2       6a57.7ed1.4a15    dynamic     eth-0-49
    2       08bf.b840.3b0f    dynamic     eth-0-29
    2       08bf.b840.3779    dynamic     eth-0-49
    2       e6b0.535c.07c5    dynamic     eth-0-49
    2       60cf.84dc.6593    dynamic     eth-0-12
    2       bcfc.e751.e10b    dynamic     eth-0-49
    2       60cf.84dc.7ae9    dynamic     eth-0-49
    2       08bf.b840.3a12    dynamic     eth-0-18
    2       bcfc.e751.e127    dynamic     eth-0-4
    2       60cf.84dc.749c    dynamic     eth-0-2
    2       08bf.b840.3aef    dynamic     eth-0-43
    2       60cf.84dc.78fc    dynamic     eth-0-7
    2       60cf.84dc.6528    dynamic     eth-0-49
    2       08bf.b840.3a7e    dynamic     eth-0-31
    2       60cf.84dc.65c7    dynamic     eth-0-49
    2       bcfc.e751.e10e    dynamic     eth-0-49
    2       fc34.97bf.033d    dynamic     eth-0-23
    2       60cf.84dc.65c3    dynamic     eth-0-1
    2       60cf.84dc.65b8    dynamic     eth-0-3
    2       08bf.b840.3af8    dynamic     eth-0-45
    2       60cf.84dc.7686    dynamic     eth-0-44
    2       08bf.b840.3b49    dynamic     eth-0-49
    2       60cf.84dc.75ff    dynamic     eth-0-49
    2       60cf.84dc.797d    dynamic     eth-0-10
    2       60cf.84dc.7632    dynamic     eth-0-9
    2       5a75.40fc.40e1    dynamic     eth-0-49
    2       08bf.b840.3a58    dynamic     eth-0-46
    2       08bf.b840.38a6    dynamic     eth-0-49
    2       08bf.b840.3730    dynamic     eth-0-49
    2       60cf.84dc.75f2    dynamic     eth-0-49
    2       bcfc.e751.e12b    dynamic     eth-0-20
    2       60cf.84dc.70c6    dynamic     eth-0-49
    2       60cf.84dc.7067    dynamic     eth-0-49
    2       fc34.97bf.02e7    dynamic     eth-0-24
    2       08bf.b840.3a1b    dynamic     eth-0-13
    2       08bf.b840.37f4    dynamic     eth-0-30
    2       aa7f.6de6.7c04    dynamic     eth-0-49
    2       d85b.2220.ab1a    dynamic     eth-0-49
    2       fc34.97bf.033e    dynamic     eth-0-39
    2       08bf.b840.38db    dynamic     eth-0-49
    2       60cf.84dc.7923    dynamic     eth-0-49
    2       60cf.84dc.74da    dynamic     eth-0-49
    2       60cf.84dc.709c    dynamic     eth-0-49
    2       60cf.84dc.6baf    dynamic     eth-0-49
    ```
2. 取得 Mac Address 欄位資料並填上以上json格式如下
    ```json
    {
    "001A.2B3C.4D5E": {}
    }
    ```
3. 取得 Ports 欄位資料並填上以上json格式如下
    ```json
    {
    "001A.2B3C.4D5E": {
        "LanPort": "eth-0-31"
      }
    }
    ```    

## 抓取 IP

1. "show ip arp" 指令會輸出以下資料
   ```Powershell
	  Protocol    Address          Age (min)  Hardware Addr   Interface
	 Internet    192.168.1.1             6   08bf.b840.396c  vlan2
	 Internet    192.168.1.2            55   08bf.b840.36e0  vlan2
	 Internet    192.168.1.3            27   08bf.b840.3a12  vlan2
	 Internet    192.168.1.4            47   bcfc.e751.e12b  vlan2
	 Internet    192.168.1.5            53   08bf.b840.3af8  vlan2
	 Internet    192.168.1.6            37   60cf.84dc.7686  vlan2
	 Internet    192.168.1.7            39   08bf.b840.3aef  vlan2
	 Internet    192.168.1.8            41   08bf.b840.3a58  vlan2
	 Internet    192.168.1.9            35   60cf.84dc.78fc  vlan2
	 Internet    192.168.1.10           14   60cf.84dc.797d  vlan2
	 Internet    192.168.1.11           12   60cf.84dc.7632  vlan2
	 Internet    192.168.1.12           28   60cf.84dc.75e7  vlan2
	 Internet    192.168.1.13           30   fc34.97bf.05ca  vlan2
	 Internet    192.168.1.14           56   fc34.97bf.0441  vlan2
	 Internet    192.168.1.15           56   fc34.97bf.033d  vlan2
	 Internet    192.168.1.16            9   fc34.97bf.02e7  vlan2
	 Internet    192.168.1.17           26   fc34.97bf.0449  vlan2
	 Internet    192.168.1.18           42   fc34.97bf.0321  vlan2
	 Internet    192.168.1.19            6   bcfc.e788.c16a  vlan2
	 Internet    192.168.1.20           49   bcfc.e788.c173  vlan2
	 Internet    192.168.1.22           38   fc34.97bf.04ac  vlan2
	 Internet    192.168.1.23           33   fc34.97bf.065f  vlan2
	 Internet    192.168.1.24           47   fc34.97bf.05ef  vlan2
	 Internet    192.168.1.25            4   08bf.b840.3ae2  vlan2
	 Internet    192.168.1.26           43   08bf.b840.3a7e  vlan2
	 Internet    192.168.1.27            9   08bf.b840.3a1b  vlan2
	 Internet    192.168.1.28           10   08bf.b840.37f4  vlan2
	 Internet    192.168.1.29           52   60cf.84dc.6593  vlan2
	 Internet    192.168.1.30           35   60cf.84dc.65c1  vlan2
	 Internet    192.168.1.31           41   08bf.b840.3a2b  vlan2
	 Internet    192.168.1.32           20   08bf.b840.3b0f  vlan2
	 Internet    192.168.1.34           36   60cf.84dc.7923  vlan2
	 Internet    192.168.1.35           18   60cf.84dc.70c6  vlan2
	 Internet    192.168.1.36           56   60cf.84dc.798d  vlan2
	 Internet    192.168.1.37           34   08bf.b840.3958  vlan2
	 Internet    192.168.1.38           24   08bf.b840.3956  vlan2
	 Internet    192.168.1.39           10   bcfc.e751.e139  vlan2
	 Internet    192.168.1.40           12   60cf.84dc.75ff  vlan2
	 Internet    192.168.1.41           44   60cf.84dc.6bb1  vlan2
	 Internet    192.168.1.42           16   60cf.84dc.74db  vlan2
	 Internet    192.168.1.43            1   08bf.b840.3b49  vlan2
	 Internet    192.168.1.44           16   60cf.84dc.6ec2  vlan2
	 Internet    192.168.1.45           56   60cf.84dc.798e  vlan2
	 Internet    192.168.1.46           10   60cf.84dc.6baf  vlan2
	 Internet    192.168.1.47           42   60cf.84dc.74da  vlan2
	 Internet    192.168.1.48           58   bcfc.e751.e0bd  vlan2
	 Internet    192.168.1.49           59   60cf.84dc.65c4  vlan2
	 Internet    192.168.1.50           49   08bf.b840.3955  vlan2

     ```
2. 核對  Hardware Addr 欄位並在 json 檔填入 ip 資料如下
   ```Powershell
    {
	    "001A.2B3C.4D5E": {
        "LanPort": "eth-0-31",
        "IP": "192.168.1.52",
	    }
	}
	```

## 抓取 speed 資料

1. "show interface status" 會輸出以下資料
```Powershell
	Port        Status     Duplex  Speed    Mode    Type                    Description
------------------------------------------------------------------------------------------
eth-0-1     up         a-full  2500     ACCESS  2G5BASE_T
eth-0-2     up         a-full  2500     ACCESS  2G5BASE_T
eth-0-3     up         a-full  2500     ACCESS  2G5BASE_T
eth-0-4     up         a-full  2500     ACCESS  2G5BASE_T
eth-0-5     down       auto    2500     ACCESS  2G5BASE_T
eth-0-6     down       auto    2500     ACCESS  2G5BASE_T
eth-0-7     up         a-full  2500     ACCESS  2G5BASE_T
eth-0-8     up         a-full  2500     ACCESS  2G5BASE_T
eth-0-9     up         a-full  2500     ACCESS  2G5BASE_T
eth-0-10    up         a-full  2500     ACCESS  2G5BASE_T
eth-0-11    up         a-full  2500     ACCESS  2G5BASE_T
eth-0-12    up         a-full  2500     ACCESS  2G5BASE_T
eth-0-13    up         a-full  2500     ACCESS  2G5BASE_T
eth-0-14    up         a-full  2500     ACCESS  2G5BASE_T
eth-0-15    down       auto    2500     ACCESS  2G5BASE_T
eth-0-16    down       auto    2500     ACCESS  2G5BASE_T
eth-0-17    up         a-full  2500     ACCESS  2G5BASE_T
eth-0-18    up         a-full  2500     ACCESS  2G5BASE_T
eth-0-19    down       auto    2500     ACCESS  2G5BASE_T
eth-0-20    up         a-full  2500     ACCESS  2G5BASE_T
eth-0-21    up         a-full  2500     ACCESS  2G5BASE_T
eth-0-22    up         a-full  2500     ACCESS  2G5BASE_T
eth-0-23    up         a-full  2500     ACCESS  2G5BASE_T
eth-0-24    up         a-full  2500     ACCESS  2G5BASE_T
eth-0-25    down       auto    2500     ACCESS  2G5BASE_T
```

2. 抓取 Speed 欄位填入 json
	```Powershell
	{
	    "001A.2B3C.4D5E": {
        "LanPort": "eth-0-31",
        "IP": "192.168.1.52",
        "Speed":"2500"
	    }
	}
	```

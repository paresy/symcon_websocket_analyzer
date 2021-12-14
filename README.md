## IP-Symcon WebSocket Analyzer

```
npm install
node index.js
```

By default the analyzer will connect to the local runnung IP-Symcon instance!

### The result should look like this

```
Received: 74, 4 msg/s

Longest Messages:
> Message: KL_MESSAGE, SenderID: 54974, Length: 200
> Message: KL_MESSAGE, SenderID: 12260, Length: 185
> Message: KL_MESSAGE, SenderID: 20183, Length: 185
> Message: KL_MESSAGE, SenderID: 25833, Length: 183
> Message: KL_MESSAGE, SenderID: 23374, Length: 181

Busy Messages:
> Message: VM_UPDATE, Count: 27
> Message: KL_MESSAGE, Count: 19
> Message: EM_UPDATE, Count: 9
> Message: SE_EXECUTE, Count: 9
> Message: SE_RUNNING, Count: 9

Busy IDs:
> SenderID: 34798, Count: 4
> SenderID: 38294, Count: 4
> SenderID: 25833, Count: 3
> SenderID: 12260, Count: 2
> SenderID: 12396, Count: 2
```

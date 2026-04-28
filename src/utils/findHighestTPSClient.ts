export default function findHighestTPSClient(clients: GPT_Client[]) {
    if (!clients || clients.length === 0) {
        return null
    }

    let bestClient = clients[0]
    for (const client of clients) {
        if ((client.model.tps ?? 0) > (bestClient.model.tps ?? 0)) {
            bestClient = client
        }
    }

    return bestClient
}

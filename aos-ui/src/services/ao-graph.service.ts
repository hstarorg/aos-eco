const AO_GRAPH_ENDPOINT = 'https://arweave-search.goldsky.com/graphql';

const AO_QUERY_WALLET_PROCESSES = `
query(
  $entityId: String!
  $limit: Int!
  $sortOrder: SortOrder!
  $cursor: String
) {
  transactions(
    sort: $sortOrder
    first: $limit
    after: $cursor
    tags: [
      { name: "Data-Protocol", values: ["ao"] }
      { name: "Type", values: ["Process"] }
    ]
    owners: [$entityId]
  ) {
    count
    ...MessageFields
  }
}

fragment MessageFields on TransactionConnection {
  edges {
    cursor
    node {
      id
      recipient
      block {
        timestamp
        height
      }
      ingested_at
      tags {
        name
        value
      }
      owner {
        address
      }
    }
  }
}

`;

async function fetchGraph(
  endpoint: string,
  query: string,
  variables: Record<string, unknown>
) {
  return fetch(endpoint, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  }).then((res) => res.json());
}

export async function ao_queryWalletProcesses(walletAddress: string) {
  const result = await fetchGraph(
    AO_GRAPH_ENDPOINT,
    AO_QUERY_WALLET_PROCESSES,
    {
      cursor: '',
      entityId: walletAddress,
      limit: 25,
      sortOrder: 'HEIGHT_DESC',
    }
  );
  const transactions = result?.data?.transactions;
  return { total: transactions?.count, rows: transactions.edges };
}

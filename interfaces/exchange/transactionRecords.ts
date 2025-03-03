interface TransactionRecords {
    id: string;
    orderId: string;
    symbol: string;
    price: number;
    quantity: number;
    side: string;
    fee: number;
    feeCurrency: string;
    timestamp: string;
    marketType: string;
    note?: string;
    createAt?: string;
  }
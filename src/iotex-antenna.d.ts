declare module "@iotexproject/iotex-antenna-js" {
  export class Antenna {
    constructor(host: string);
    iotx: {
      executeSmartContract(params: any): Promise<any>;
    };
  }
}

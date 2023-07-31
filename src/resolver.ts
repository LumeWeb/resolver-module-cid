import {
  AbstractResolverModule,
  DNS_RECORD_TYPE,
  DNSResult,
  resolverEmptyResponse,
  ResolverOptions,
  resolveSuccess,
} from "@lumeweb/kernel-libresolver";

const NETWORK_MAP = new Map(
  Object.entries({
    IPFS: "ipfs://",
    IPNS: "ipns://",
  }),
);

const NAMESPACE = "lume";

export default class CID extends AbstractResolverModule {
  ready(): Promise<void> {
    return Promise.resolve(true) as any;
  }

  async resolve(
    domain: string,
    options: ResolverOptions,
    bypassCache: boolean,
  ): Promise<DNSResult> {
    if (!domain.includes(".")) {
      return resolverEmptyResponse();
    }

    const domainParts = domain.split(".");
    const last = domainParts.slice()?.pop();
    if (last !== NAMESPACE) {
      return resolverEmptyResponse();
    }

      const network =  domainParts.slice(1).shift()?.toUpperCase() as string;

    if (!NETWORK_MAP.has(network)) {
      return resolverEmptyResponse();
    }

    const cid = domainParts.slice()?.shift();

    if (!cid) {
      return resolverEmptyResponse();
    }

    return resolveSuccess([
      {
        type: DNS_RECORD_TYPE.CONTENT,
        value: NETWORK_MAP.get(network) + cid,
      },
    ]);
  }
}

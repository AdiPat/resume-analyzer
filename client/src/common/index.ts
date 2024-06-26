import { LocalStorageCache } from "./local-storage-cache";
export type { Cache } from "./cache";
export { LocalStorageCache } from "./local-storage-cache";

const cache = new LocalStorageCache();

export { cache };

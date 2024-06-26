export type { Cache } from "./cache";
import { LocalStorageCache } from "./local-storage-cache";
export { LocalStorageCache } from "./local-storage-cache";

const cache = new LocalStorageCache();

export { cache };

import {defineConfig} from 'vitest/config';

// Full-match simulations are CPU-bound. Bound concurrency so they retain
// their per-test deadlines on developer machines and GitHub runners.
export default defineConfig({test:{maxWorkers:2}});

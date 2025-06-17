import { makeEsmPreset } from '@drunkcod/ts-jest-esm';

export default makeEsmPreset({ globals: { 'ts-jest': { isolatedModules: true } } });

import { makeEsmPreset } from '@drunkcod/ts-jest-esm';

export default makeEsmPreset({ 'ts-jest': { isolatedModules: true } });

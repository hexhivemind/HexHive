// vitest.config.ts
// import { fileURLToPath } from 'node:url';
import { defineVitestConfig } from '@nuxt/test-utils/config';

import { coverageConfigDefaults } from 'vitest/config';

export default defineVitestConfig({
  test: {
    environment: 'nuxt',
    // you can optionally set Nuxt-specific environment options
    // environmentOptions: {
    //   nuxt: {
    //     rootDir: fileURLToPath(new URL('./playground', import.meta.url)),
    //     domEnvironment: 'happy-dom', // 'happy-dom' (default) or 'jsdom'
    //     overrides: {
    //       // other Nuxt config you want to pass
    //     }
    //   }
    // }
    globals: true,
    coverage: {
      exclude: [
        'pages/**',
        'layouts/**',
        '*.config.*',
        '**/*.generated.*',
        'modules/runtime-types.codegen.ts',
        'shared/zod.ts',
        'shared/zod-typeguards.ts',
        ...coverageConfigDefaults.exclude,
      ],
    },
    env: {
      SEED_ADMINS: 'TestUser:test@example.com',
    },
  },
});

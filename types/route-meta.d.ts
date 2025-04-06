import 'nuxt/schema';
import 'vue-router';

declare module 'nuxt/schema' {
  export interface PageMeta {
    isNavigable?: boolean;
  }
}

declare module 'vue-router' {
  export interface RouteMeta {
    isNavigable?: boolean;
  }
}

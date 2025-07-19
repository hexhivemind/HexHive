<!-- 
    This component replicates v-pagination from Vuetify, except for small changes.
    See: https://github.com/vuetifyjs/vuetify/blob/master/LICENSE.md
-->

<template>
  <component
    :is="props.tag"
    ref="resizeRef"
    :aria-label="t(props.ariaLabel)"
    data-test="v-pagination-root"
    role="navigation"
    :style="props.style"
    :class="['v-pagination', props.class]"
    @keydown="onKeyDown"
  >
    <ul class="v-pagination__list">
      <li
        v-if="props.showFirstLastPage"
        key="first"
        class="v-pagination__first"
        data-test="v-pagination-first"
      >
        <slot name="first">
          <v-btn _as="VPaginationBtn" v-bind="controls.first" />
        </slot>
      </li>

      <li key="prev" class="v-pagination__prev" data-test="v-pagination-prev">
        <slot name="prev">
          <v-btn _as="VPaginationBtn" v-bind="controls.prev" />
        </slot>
      </li>

      <li
        v-for="item in items"
        :key="item.key"
        :class="[
          'v-pagination__item',
          { 'v-pagination__item--is-active': item.isActive },
        ]"
        data-test="v-pagination-item"
      >
        <slot name="item">
          <v-btn _as="VPaginationBtn" v-bind="item.props">{{
            item.page
          }}</v-btn>
        </slot>
      </li>

      <li key="next" class="v-pagination__next" data-test="v-pagination-next">
        <slot name="next">
          <v-btn _as="VPaginationBtn" v-bind="controls.next" />
        </slot>
      </li>

      <li
        v-if="props.showFirstLastPage"
        key="last"
        class="v-pagination__last"
        data-test="v-pagination-last"
      >
        <slot name="last">
          <v-btn _as="VPaginationBtn" v-bind="controls.last" />
        </slot>
      </li>
    </ul>
  </component>
</template>

<script lang="ts" setup>
  import { useResizeObserver } from '@vueuse/core';
  import type { StyleValue } from 'vue';
  import { provideDefaults } from 'vuetify/lib/composables/defaults';

  const { t, n } = useLocale();
  const { isRtl } = useRtl();
  const { width } = useDisplay();

  // types/v-pagination-props.ts
  interface VPaginationProps {
    length?: string | number;
    start?: string | number;
    ellipsis?: string;
    disabled?: boolean;
    ariaLabel?: string;
    size?: string | number;
    tag?: string;
    tile?: boolean;
    density?: 'default' | 'comfortable' | 'compact' | null;
    nextIcon?: string;
    prevIcon?: string;
    firstIcon?: string;
    lastIcon?: string;
    pageAriaLabel?: string;
    currentPageAriaLabel?: string;
    firstAriaLabel?: string;
    previousAriaLabel?: string;
    nextAriaLabel?: string;
    lastAriaLabel?: string;
    showFirstLastPage?: boolean;
    hideFirstLastPageNumbers?: boolean;
    variant?: 'flat' | 'text' | 'elevated' | 'tonal' | 'outlined' | 'plain';
    border?: string | number | boolean;
    color?: string;
    elevation?: string | number;
    rounded?: string | number | boolean | null;
    theme?: string;
    activeColor?: string;
    totalVisible?: string | number;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    class?: any;
    style?: StyleValue;
  }

  const props = withDefaults(defineProps<VPaginationProps>(), {
    ariaLabel: '$vuetify.pagination.ariaLabel.root',
    border: false,
    currentPageAriaLabel: '$vuetify.pagination.ariaLabel.currentPage',
    density: 'default',
    disabled: false,
    ellipsis: '...',
    firstAriaLabel: '$vuetify.pagination.ariaLabel.first',
    firstIcon: '$first',
    lastAriaLabel: '$vuetify.pagination.ariaLabel.last',
    lastIcon: '$last',
    length: 1,
    nextAriaLabel: '$vuetify.pagination.ariaLabel.next',
    nextIcon: '$next',
    pageAriaLabel: '$vuetify.pagination.ariaLabel.page',
    prevIcon: '$prev',
    previousAriaLabel: '$vuetify.pagination.ariaLabel.previous',
    showFirstLastPage: false,
    hideFirstLastPageNumbers: false,
    size: 'default',
    start: 1,
    tag: 'nav',
    tile: false,
    variant: 'text',

    activeColor: undefined,
    totalVisible: undefined,
    rounded: undefined,
    color: undefined,
    elevation: undefined,
    theme: undefined,
    class: undefined,
    style: undefined,
  });

  const page = defineModel<number>({ default: 1 });

  type PaginationEmits = 'first' | 'last' | 'next' | 'prev';
  const emit = defineEmits<{
    (e: PaginationEmits, value: number): boolean;
  }>();

  const resizeRef = useTemplateRef<HTMLElement>('resizeRef');

  useResizeObserver(resizeRef, (entries: readonly ResizeObserverEntry[]) => {
    if (!entries.length) return;

    const { target, contentRect } = entries[0];

    const firstItem = target.querySelector(
      'v-pagination__list > *',
    ) as HTMLElement;

    if (!firstItem) return;

    const totalWidth = contentRect.width;
    const itemWidth =
      firstItem.offsetWidth +
      parseFloat(getComputedStyle(firstItem).marginRight) * 2;

    maxButtons.value = getMax(totalWidth, itemWidth);
  });

  const setValue = (e: Event, value: number, event?: PaginationEmits) => {
    e.preventDefault();
    page.value = value;
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    event && emit(event, value);
  };

  const maxButtons = shallowRef(-1);

  const length = computed(() => parseInt(String(props.length), 10));
  const start = computed(() => parseInt(String(props.start), 10));
  const totalVisible = computed(() => {
    if (props.totalVisible != null)
      return parseInt(String(props.totalVisible), 10);
    else if (maxButtons.value >= 0) return maxButtons.value;
    return getMax(width.value, 58);
  });

  function getMax(totalWidth: number, itemWidth: number) {
    const minButtons = props.showFirstLastPage ? 5 : 3;
    return Math.max(
      0,
      Math.floor(
        // Rount to two decimal places to avoid floating point errors
        Number(((totalWidth - itemWidth * minButtons) / itemWidth).toFixed(2)),
      ),
    );
  }

  const controls = computed(() => {
    const prevDisabled = !!props.disabled || page.value <= start.value;
    const nextDisabled =
      !!props.disabled || page.value >= start.value + length.value - 1;

    return {
      first: props.showFirstLastPage
        ? {
            icon: isRtl.value ? props.lastIcon : props.firstIcon,
            onClick: (e: Event) => setValue(e, start.value),
            disabled: prevDisabled,
            'aria-label': t(props.firstAriaLabel),
            'aria-disabled': prevDisabled,
          }
        : undefined,
      prev: {
        icon: isRtl.value ? props.nextIcon : props.prevIcon,
        onClick: (e: Event) => setValue(e, page.value - 1, 'prev'),
        disabled: prevDisabled,
        'aria-label': t(props.previousAriaLabel),
        'aria-disabled': prevDisabled,
      },
      next: {
        icon: isRtl.value ? props.prevIcon : props.nextIcon,
        onClick: (e: Event) => setValue(e, page.value + 1, 'next'),
        disabled: nextDisabled,
        'aria-label': t(props.nextAriaLabel),
        'aria-disabled': nextDisabled,
      },
      last: props.showFirstLastPage
        ? {
            icon: isRtl.value ? props.firstIcon : props.lastIcon,
            onClick: (e: Event) =>
              setValue(e, start.value + length.value - 1, 'last'),
            disabled: nextDisabled,
            'aria-label': t(props.lastAriaLabel),
            'aria-disabled': nextDisabled,
          }
        : undefined,
    };
  });

  function createRange(length: number, start = 0): number[] {
    return Array.from({ length }, (v, k) => start + k);
  }

  const range = computed(() => {
    if (
      length.value <= 0 ||
      isNaN(length.value) ||
      length.value > Number.MAX_SAFE_INTEGER
    )
      return [];

    if (totalVisible.value <= 0) return [];

    if (length.value <= totalVisible.value) {
      return createRange(length.value, start.value);
    }

    const even = totalVisible.value % 2 === 0;
    const middle = even
      ? totalVisible.value / 2
      : Math.floor(totalVisible.value / 2);
    const left = even ? middle : middle + 1;
    const right = length.value - middle;

    const reduce = !(props.showFirstLastPage || props.hideFirstLastPageNumbers);

    if (left - page.value >= 0) {
      return [
        ...createRange(
          Math.max(1, totalVisible.value - (reduce ? 1 : 0)),
          start.value,
        ),
        props.ellipsis,
        ...(reduce ? [length.value] : []),
      ];
    } else if (page.value - right >= (even ? 1 : 0)) {
      const rangeLength = totalVisible.value - (reduce ? 1 : 0);
      const rangeStart = length.value - rangeLength + start.value;
      return [
        ...(reduce ? [start.value] : []),
        props.ellipsis,
        ...createRange(rangeLength, rangeStart),
      ];
    } else {
      const rangeLength = Math.max(1, totalVisible.value - (reduce ? 2 : 0));
      const rangeStart =
        rangeLength === 1
          ? page.value
          : page.value - Math.ceil(rangeLength / 2) + start.value;
      return [
        ...(reduce ? [start.value] : []),
        props.ellipsis,
        ...createRange(rangeLength, rangeStart),
        props.ellipsis,
        ...(reduce ? [length.value] : []),
      ];
    }
  });

  type itemRef = {
    isActive: boolean;
    key: string | number;
    page: number | string;
    props: Record<string, unknown>;
  };
  const refs = ref([] as ComponentPublicInstance[]);

  const items = computed((): itemRef[] => {
    return range.value.map((item, index) => {
      const ref = (e: ComponentPublicInstance) => (refs.value[index] = e);

      if (typeof item === 'string') {
        return {
          isActive: false,
          key: `ellipsis-${index}`,
          page: item,
          props: {
            ref,
            ellipsis: true,
            icon: true,
            disabled: true,
          },
        };
      } else {
        const isActive = item === page.value;
        return {
          isActive,
          key: item,
          page: n(item),
          props: {
            ref,
            ellipsis: false,
            icon: true,
            disabled: !!props.disabled || Number(props.length) < 2,
            color: isActive ? props.activeColor : props.color,
            'aria-current': isActive,
            'aria-label': t(
              isActive ? props.currentPageAriaLabel : props.pageAriaLabel,
              item,
            ),
            onClick: (e: Event) => setValue(e, item),
          },
        };
      }
    });
  });

  function updateFocus() {
    const currentIndex = page.value - start.value;
    refs.value[currentIndex]?.$el.focus();
  }

  function onKeyDown(e: KeyboardEvent) {
    if (e.key === 'ArrowLeft' && !props.disabled && page.value > start.value) {
      page.value -= 1;
      nextTick(updateFocus);
    } else if (
      e.key === 'ArrowRight' &&
      !props.disabled &&
      page.value < start.value + length.value - 1
    ) {
      page.value += 1;
      nextTick(updateFocus);
    }
  }

  provideDefaults({
    VPaginationBtn: {
      color: toRef(props, 'color'),
      border: toRef(props, 'border'),
      density: toRef(props, 'density'),
      size: toRef(props, 'size'),
      variant: toRef(props, 'variant'),
      rounded: toRef(props, 'rounded'),
      elevation: toRef(props, 'elevation'),
    },
  });
</script>

<style lang="scss" scoped></style>

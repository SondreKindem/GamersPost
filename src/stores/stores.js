import { writable } from 'svelte/store';

// TODO: able to modify these in a component, store and load from localstore, build css variables with them dynamically
// TODO: width & gap needs complete reload of component, use #key thingy for that
export const styles = writable({
    rounding: 5,
    primaryColor: "",
    secondaryColor: "",
    width: 560,
    gap: 15
});

export const sites = writable([3])
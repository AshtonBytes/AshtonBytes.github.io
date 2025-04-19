<script lang="ts">
    import Hero from "../components/Hero.svelte";
    import Product from "../components/Product.svelte";
    import Reviews from "../components/Reviews.svelte";
    import FaQs from "../components/FAQs.svelte";
    import Conversion from "../components/Conversion.svelte";
    import { lightMode } from '../store';
    import { onMount } from 'svelte';
  
    let isLightMode = false;

    const setTheme = (lightModeValue: boolean) => {
        document.documentElement.classList.toggle('dark', !lightModeValue);
        document.documentElement.classList.toggle('light', lightModeValue);
        lightMode.set(lightModeValue);
    };

    onMount(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const prefersLightMode = !mediaQuery.matches;
    setTheme(prefersLightMode);

    const handleChange = (e: MediaQueryListEvent) => setTheme(!e.matches);
    mediaQuery.addEventListener('change', handleChange);

    const unsubscribe = lightMode.subscribe((value) => {
        isLightMode = value;
        setTheme(value);
    })

    return () => {
        mediaQuery.removeEventListener('change', handleChange);
        unsubscribe();
    }
    });
</script>

<svelte:body class:light-mode={$lightMode} />

<main class="flex flex-col {$lightMode ? "light" : "dark"}">
    <Hero />
    <Product />
    <Reviews />
    <FaQs />
    <Conversion />
</main>
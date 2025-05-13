<script>
    import {openMenu} from "../store";
    import { lightMode } from "../store";
    import ConversionButtonOne from "./ConversionButtonOne.svelte";
</script>

<header class="flex flex-col relative z-20">
    <div class="max-w-[1400px] mx-auto w-full flex items-center justify-between p-4">
        <a href="/">
            <h1 class="font-semibold">
                <img src="assets/AurivaraLogo.png" alt="Aurivara LLC. Logo" style="height: var(--space-3xl); width: auto;"/>
            </h1>
        </a>
        <button
        on:click={() => ($openMenu = true)}
        class="md:hidden grid place-items-center {$lightMode ? "light" : "dark"}"
        aria-label="Open menu">
            <i class="fa-solid fa-bars"></i>
        </button>
        <nav class="hidden md:flex items-center gap-4 lg:gap-6">
            <a href="#product" class="duration-200 hyperLink hover:text-400 cursor-pointer">Product</a>
            <a href= "#faqs" class="duration-200 hyperLink hover:text-400 cursor-pointer">FAQs</a>
            <ConversionButtonOne/>
        </nav>
    </div>
</header>
<script lang="ts">
    import "../app.css";
    import Footer from "../components/Footer.svelte";
    import CtAs from "../components/CTAs.svelte";
    import {openMenu} from '../store';
    import Header from "../components/Header.svelte";
    import { lightMode } from '../store';

    let y: number;
    $: outerHeight = 0

    function reroute(href: string) {
        $openMenu = false;
        window.location.href = href;
    }
</script>

{#if $openMenu}
    <div class="fixed top-0 left-0 w-screen h-screen border-b z-50 flex flex-col gap-8 p-5 px-8 md:hidden {$lightMode ? "light" : "dark"}">
        <div class="flex items-center justify-between gap-4 border-b pb-2">
            <h1 class="font-semibold">
                <img src="assets/AurivaraLogo.png" alt="Aurivara LLC. Logo" style="height: var(--space-xxl); width: auto;"/>
            </h1>
            <button 
            on:click={() => ($openMenu = false)} 
            class="outline-none border-none {$lightMode ? "light" : "dark"}"
            aria-label="Open Menu">
                <i class="fa-solid fa-xmark text-2xl"></i>
            </button>
        </div>
        <div class="flex flex-col gap-4 flex-1">
            <button on:click={() => reroute("#product")} class="border-none outline-none {$lightMode ? "light" : "dark"} p-2 group duration-200 cursor-pointer text-left">
                <p class="duration-200 group-hover:pl-2 poppins text-3xl font-semibold">Product 
                    <i class="fa-solid fa-chevron-right text-xl pl-4"></i>
                </p>
            </button>
            <button on:click={() => reroute("#reviews")} class="border-none outline-none {$lightMode ? "light" : "dark"} p-2 group duration-200 cursor-pointer text-left">
                <p class="duration-200 group-hover:pl-2 poppins text-3xl font-semibold">Reviews
                    <i class="fa-solid fa-chevron-right text-xl pl-4"></i>
                </p>
            </button>
            <button on:click={() => reroute("#faqs")} class="border-none outline-none {$lightMode ? "light" : "dark"} p-2 group duration-200 cursor-pointer text-left">
                <p class="duration-200 group-hover:pl-2 poppins text-3xl font-semibold">FAQs 
                    <i class="fa-solid fa-chevron-right text-xl pl-4"></i>
                </p>
            </button>
        </div>
        <div class="flex flex-col items-center justify-center">
            <CtAs />
        </div>
    </div>
{/if}

{#if y > outerHeight}
    <div class="{$lightMode ? "light" : "dark"} fixed top-0 left-0 w-full flex flex-col z-20 px-4 fadeIn">
        <Header/>
    </div>
{/if}

<slot />
<Footer/>
<svelte:window bind:scrollY={y} bind:outerHeight/>

<!-- header
hero
product description
user reviews
faq
conversion
footer -->
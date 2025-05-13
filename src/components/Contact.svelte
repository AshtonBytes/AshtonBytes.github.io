<script>
    import SectionWrapper from "./SectionWrapper.svelte";
    import { lightMode } from '../store';
</script>
<SectionWrapper id="contact">
    <div class="flex flex-col gap-8 sm:gap-12 md:gap-16 py-20 flex-1 items-center justify-center {$lightMode ? 'light' : 'dark'}">
        <div class="flex flex-col gap-2">
          <p class="opacity-60 text-base sm:text-lg md:text-xl text-center">
            Get in Touch
          </p>
          <h3 class="text-4xl sm:text-5xl md:text-6xl max-w-[1000px] mx-auto w-full font-semibold text-center">
            Contact Us
          </h3>
        </div>

        <form
          action="https://formspree.io/f/mblopyvn"
          method="POST"
          class="flex flex-col gap-4 w-full max-w-[1200px] mx-auto p-4 px-6"
        >
          <!-- Name -->
          <div class="flex items-center gap-4">
            <label for="name" class="w-24 text-right font-medium text-base sm:text-lg">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              class="flex-1 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <!-- Email -->
          <div class="flex items-center gap-4">
            <label for="email" class="w-24 text-right font-medium text-base sm:text-lg">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              class="flex-1 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <!-- Message -->
          <div class="flex flex-col gap-2">
            <label for="message" class="font-medium text-base sm:text-lg">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              rows="6"
              required
              class="w-full border border-gray-300 rounded-md p-2 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
            ></textarea>
          </div>

          <!-- Submit -->
          <div class="flex justify-end">
            <button
              type="submit"
              class="conversionBtnOne {$lightMode ? 'light' : 'dark'} px-6 py-2 rounded-md text-white font-semibold text-lg"
            >
              Send Message
            </button>
          </div>
        </form>
    </div>
</SectionWrapper>
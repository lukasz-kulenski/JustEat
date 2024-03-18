<template>
  <q-page>
    <div class="q-gutter-y-md">
      <q-card class="shadow-0">
        <q-tabs
          v-model="tab"
          dense
          class="text-grey"
          active-color="primary"
          indicator-color="primary"
          align="justify"
        >
          <q-tab name="about" label="About" />
          <q-tab name="instructions" label="Instructions" />
          <q-tab name="guide" label="Guide" />
        </q-tabs>

        <q-separator />

        <q-tab-panels v-model="tab" animated>
          <q-tab-panel name="about">
            <q-scroll-area
              :thumb-style="thumbStyle"
              :bar-style="barStyle"
              class="q-pa-md"
              :style="aboutScrollBarSizes"
            >
              <div class="text-h5 q-pb-md q-ml-xs">About</div>
              <q-list bordered class="rounded-borders">
                <q-expansion-item
                  v-for="(item, index) in aboutItems"
                  :key="index"
                  expand-separator
                  :label="item.title"
                  header-class="text-bold"
                >
                  <q-card>
                    <q-card-section class="text-justify">
                      <span> {{ item.answer }}</span>
                    </q-card-section>
                  </q-card>
                </q-expansion-item>
              </q-list>
            </q-scroll-area>
          </q-tab-panel>

          <q-tab-panel name="instructions">
            <q-scroll-area
              :thumb-style="thumbStyle"
              :bar-style="barStyle"
              class="q-pa-md"
              :style="aboutScrollBarSizes"
            >
              <div class="text-h5 q-pl-xs">How to Use</div>
              <p class="q-pt-lg q-pl-xs text-h6">Menu Buttons</p>
              <q-list separator bordered>
                <q-item
                  clickable
                  v-for="(item, index) in instructionsButtons"
                  :key="index"
                >
                  <q-item-section>
                    <q-item-section>{{ item.buttonName }}</q-item-section>
                    <q-item-label caption>{{
                      item.buttonFunction
                    }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>

              <p class="q-pt-lg q-pl-xs text-h6">Others</p>
              <q-list separator bordered>
                <q-item
                  v-for="(item, index) in otherInstructions"
                  :key="index"
                  clickable
                >
                  <q-item-section>
                    <q-item-section>{{ item.optionName }}</q-item-section>
                    <q-item-label caption>{{ item.description }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-scroll-area>
          </q-tab-panel>

          <q-tab-panel name="guide">
            <div class="text-h5 q-pb-md q-ml-xs">Guide</div>
            <q-stepper v-model="step" vertical color="primary" animated>
              <q-step
                :name="1"
                title="Add first product"
                icon="add_circle"
                :done="step > 1"
              >
                To begin using the application, either add your first product
                from the existing database or manually input a product.

                <q-stepper-navigation>
                  <q-btn @click="step = 2" color="primary" label="Continue" />
                </q-stepper-navigation>
              </q-step>

              <q-step
                :name="2"
                title="Add a product to the current day"
                icon="inventory_2"
                :done="step > 2"
              >
                Once you have added your first product to your own database, you
                can add the product to the current day.

                <q-stepper-navigation>
                  <q-btn @click="step = 3" color="primary" label="Continue" />
                  <q-btn
                    flat
                    @click="step = 1"
                    color="primary"
                    label="Back"
                    class="q-ml-sm"
                  />
                </q-stepper-navigation>
              </q-step>

              <q-step
                :name="3"
                title="Checking History"
                icon="history"
                :done="step > 3"
              >
                After adding your first product to the current day, you unlock
                additional functions such as checking the history for the
                current day or from the beginning of using the application.

                <q-stepper-navigation>
                  <q-btn @click="step = 4" color="primary" label="Continue" />
                  <q-btn
                    flat
                    @click="step = 2"
                    color="primary"
                    label="Back"
                    class="q-ml-sm"
                  />
                </q-stepper-navigation>
              </q-step>

              <q-step
                :name="4"
                title="New Options"
                icon="compare_arrows"
                :done="step > 4"
              >
                Now you can also review the average calorie intake over the
                week, month, or year, and compare it with your target calorie
                intake.

                <q-stepper-navigation>
                  <q-btn @click="step = 5" color="primary" label="Continue" />
                  <q-btn
                    flat
                    @click="step = 3"
                    color="primary"
                    label="Back"
                    class="q-ml-sm"
                  />
                </q-stepper-navigation>
              </q-step>

              <q-step
                :name="5"
                title="More options"
                icon="show_chart"
                :done="step > 5"
              >
                What other options do you have? You can track calories using
                charts. You can also input calories and macronutrients without
                adding a product to the database - a useful feature if you only
                want to log calories. You can also adjust your target
                macronutrients.

                <q-stepper-navigation>
                  <q-btn @click="step = 6" color="primary" label="Continue" />
                  <q-btn
                    flat
                    @click="step = 4"
                    color="primary"
                    label="Back"
                    class="q-ml-sm"
                  />
                </q-stepper-navigation>
              </q-step>

              <q-step :name="6" title="Last step" icon="last_page">
                Explore the about section and instructions section to learn more
                about the application.
                <q-stepper-navigation>
                  <q-btn
                    @click="router.go(-1)"
                    color="primary"
                    label="Finish"
                  />
                  <q-btn
                    flat
                    @click="step = 5"
                    color="primary"
                    label="Back"
                    class="q-ml-sm"
                  />
                </q-stepper-navigation>
              </q-step>
            </q-stepper>
          </q-tab-panel>
        </q-tab-panels>
      </q-card>
    </div>
  </q-page>
</template>
  
<script setup>
import { ref, computed } from "vue";
import { customScrollBar } from "src/composables/ScrollBar.js";
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";

const router = useRouter();

const $q = useQuasar();

const step = ref(1);

const { thumbStyle, barStyle } = customScrollBar().useCustomScrollBar();

const aboutItems = ref([
  {
    title: "How many people created the app?",
    answer: "The app was created by one person.",
  },
  {
    title: "Why was the app created?",
    answer:
      "Initially, it was designed to help me track daily macronutrients. Later, I decided to include this project in my resume.",
  },
  {
    title: "What sets this app apart from other similar apps?",
    answer: `I have tried several similar applications, but none of them met my expectations. While they offered numerous features, the two main drawbacks that bothered me were the difficulty in finding specific products I consumed and the lack of accuracy in matching similar items with the same macronutrient content. Additionally, these applications utilized general product databases, resulting in prolonged searches for specific items. In contrast, my application resolves these issues. Each user has the ability to personalize the app by adding their own consumed products. This not only streamlines the product database but also facilitates quicker searches for items.`,
  },
  {
    title: "Is the app available on multiple platforms?",
    answer:
      "The app functions as a web application, allowing users to access it on any device with internet connectivity.",
  },
  {
    title: "Contact",
    answer: "email: lukasz.kulenski17@op.pl",
  },
]);

const instructionsButtons = ref([
  {
    buttonName: "Add a new product",
    buttonFunction:
      "Use this button to open the form for adding a new product.",
  },
  {
    buttonName: "Add a new product using the product database",
    buttonFunction:
      "Use this button to search for and add a product from the pre-existing database of products.",
  },
  {
    buttonName: "Change macronutrientst",
    buttonFunction: "Adjust your target macronutrients.",
  },
  {
    buttonName: "Add macronutrients",
    buttonFunction:
      "Enter your custom macronutrients (without adding a specific product).",
  },
  {
    buttonName: "Check current day",
    buttonFunction: "View the history from the current day.",
  },
  {
    buttonName: "Check history",
    buttonFunction: "Explore your history from the beginning.",
  },
  {
    buttonName: "Reset day",
    buttonFunction: "Clear macronutrient data for the current day.",
  },
]);

const otherInstructions = ref([
  {
    optionName: "Search field",
    description: "Enter the product name to find specific items.",
  },
  {
    optionName: "Information about a product on mobile devices",
    description: " Click on a product to view details on mobile devices.",
  },
]);

const tab = ref("about");

const aboutScrollBarSizes = computed(() => {
  if ($q.screen.height > 670) {
    return "height: 83dvh; width: 100%";
  } else {
    return "  height: 80dvh; width: 100%";
  }
});
</script>
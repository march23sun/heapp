// NotFount

var page_notFound = Vue.component("NotFound", {
  template: `<v-overlay :value="true">
  <v-alert prominent type="warning">
     Page Not Found
    </v-alert>
</v-overlay>`
});

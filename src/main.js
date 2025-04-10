import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

// PrimeVue
import PrimeVue from 'primevue/config';
// 主題
import Aura from '@primevue/themes/aura';
import Nora  from '@primevue/themes/nora';
import Lara  from '@primevue/themes/lara';
import Material from '@primevue/themes/material';
// 元件
import Button from "primevue/button"
import Card from "primevue/card"
import Drawer from 'primevue/drawer';
import Tooltip from 'primevue/tooltip';
import ToggleSwitch from 'primevue/toggleswitch';
import RadioButton from 'primevue/radiobutton';

// Icons css
import 'primeicons/primeicons.css'

// arcgis css
import '@arcgis/core/assets/esri/themes/light/main.css';

// import Swal from 'sweetalert2/dist/sweetalert2.js'
import 'sweetalert2/src/sweetalert2.scss'

// 水缸特效
// import 'ui-water-jar';
// import { defineCustomElements } from 'ui-water-jar/loader';
// defineCustomElements(window, { resourcesUrl: import.meta.env.BASE_URL + 'assets/' })
const app = createApp(App)
// app.use(PrimeVue);

// 暗黑模式
app.use(PrimeVue, {
    theme: {
        preset: Aura,
         options: {
                //prefix: 'p',
                darkModeSelector: '.my-app-dark',   //套用時會切換成 dark mode
                //cssLayer: false
            }
    }
});
app.component('Button', Button);
app.component('Card', Card);
app.component('Drawer', Drawer);
app.component('ToggleSwitch', ToggleSwitch);
app.component('RadioButton', RadioButton);
app.directive('tooltip', Tooltip);
app.use(createPinia())
app.use(router)

app.mount('#app')

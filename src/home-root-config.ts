import { registerApplication, start } from "single-spa";
import {
  constructApplications,
  constructRoutes,
  constructLayoutEngine,
} from "single-spa-layout";
import './style.scss';
import microfrontendLayout from "./microfrontend-layout.html";
import singleSpaCss from "single-spa-css";

const cssLifecycles = singleSpaCss({
  cssUrls: [],
  webpackExtractedCss: true,
  shouldUnmount: false,
  timeout: 500,
  createLink(url) {
    const linkEl = document.createElement('link');
    linkEl.rel = 'stylesheet';
    linkEl.href = url;
    return linkEl;
  },
});

cssLifecycles.mount({
  name: 'core-styles',
  singleSpa: null,
  mountParcel: () => null,
});

const routes = constructRoutes(microfrontendLayout);
const applications = constructApplications({
  routes,
  loadApp({ name }) {
    return System.import(name);
  },
});
const layoutEngine = constructLayoutEngine({ routes, applications });

applications.forEach(registerApplication);
layoutEngine.activate();
start();

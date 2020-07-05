import {
  Button,
  // Col,
  // Row,
  Popup,
  // Checkbox,
  // CheckboxGroup,
  Field,
  // Picker,
  // RadioGroup,
  // Radio,
  // Search,
  // ActionSheet,
  Dialog,
  // PullRefresh,
  Toast,
  // Divider,
  // Empty,
  List,
  // Progress,
  NavBar,
  // Pagination,
  // Tab,
  // Tabs,
  // Sticky,
  // DatetimePicker,
  Panel,
  Cell,
  CellGroup,
  Icon,
  Calendar,
  Form,
  Switch,
  Tag
  // Skeleton,
} from "vant";
const components = [
  Button,
  // Col,
  // Row,
  Popup,
  // Checkbox,
  // CheckboxGroup,
  Field,
  // Picker,
  // RadioGroup,
  // Radio,
  // Search,
  // ActionSheet,
  Dialog,
  // PullRefresh,
  Toast,
  // Divider,
  // Empty,
  List,
  // Progress,
  NavBar,
  // Pagination,
  // Tab,
  // Tabs,
  // Sticky,
  // DatetimePicker,
  Panel,
  Cell,
  CellGroup,
  Icon,
  Calendar,
  Form,
  Switch,
  Tag
  // Skeleton,
];
const install = (Vue) => {
  components.forEach((component) => {
    Vue.component(component.name, component);
  });
  Vue.prototype.$toast = Toast;
};
if (typeof window !== "undefined" && window.Vue) {
  install(window.Vue);
}
export default { install };

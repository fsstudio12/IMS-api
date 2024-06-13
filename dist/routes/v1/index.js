"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const config_1 = __importDefault(require("../../config/config"));
const swagger_route_1 = __importDefault(require("./swagger.route"));
const admin_route_1 = __importDefault(require("./admin.route"));
const auth_route_1 = __importDefault(require("./auth.route"));
const business_route_1 = __importDefault(require("./business.route"));
const category_route_1 = __importDefault(require("./category.route"));
const customer_route_1 = __importDefault(require("./customer.route"));
const department_route_1 = __importDefault(require("./department.route"));
const employee_route_1 = __importDefault(require("./employee.route"));
const item_route_1 = __importDefault(require("./item.route"));
const purchase_route_1 = __importDefault(require("./purchase.route"));
const recipe_route_1 = __importDefault(require("./recipe.route"));
const sales_route_1 = __importDefault(require("./sales.route"));
const utility_route_1 = __importDefault(require("./utility.route"));
const utilityPayment_route_1 = __importDefault(require("./utilityPayment.route"));
const vendor_route_1 = __importDefault(require("./vendor.route"));
const wastage_route_1 = __importDefault(require("./wastage.route"));
const router = express_1.default.Router();
const defaultIRoute = [
    {
        path: '/admin',
        route: admin_route_1.default,
    },
    {
        path: '/auth',
        route: auth_route_1.default,
    },
    {
        path: '/businesses',
        route: business_route_1.default,
    },
    {
        path: '/categories',
        route: category_route_1.default,
    },
    {
        path: '/customers',
        route: customer_route_1.default,
    },
    {
        path: '/departments',
        route: department_route_1.default,
    },
    {
        path: '/employees',
        route: employee_route_1.default,
    },
    {
        path: '/items',
        route: item_route_1.default,
    },
    {
        path: '/purchases',
        route: purchase_route_1.default,
    },
    {
        path: '/recipes',
        route: recipe_route_1.default,
    },
    {
        path: '/sales',
        route: sales_route_1.default,
    },
    {
        path: '/utilities',
        route: utility_route_1.default,
    },
    {
        path: '/utilityPayments',
        route: utilityPayment_route_1.default,
    },
    {
        path: '/vendors',
        route: vendor_route_1.default,
    },
    {
        path: '/wastages',
        route: wastage_route_1.default,
    },
];
const devIRoute = [
    // IRoute available only in development mode
    {
        path: '/docs',
        route: swagger_route_1.default,
    },
];
defaultIRoute.forEach((route) => {
    router.use(route.path, route.route);
});
/* istanbul ignore next */
if (config_1.default.env === 'development') {
    devIRoute.forEach((route) => {
        router.use(route.path, route.route);
    });
}
exports.default = router;
//# sourceMappingURL=index.js.map
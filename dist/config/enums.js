"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WageType = exports.PaySchedule = exports.EnrollmentType = exports.SortType = exports.PaymentMethod = exports.PaymentStatus = exports.RegistrationType = exports.CustomerType = exports.Role = exports.QuantityMetric = void 0;
var QuantityMetric;
(function (QuantityMetric) {
    QuantityMetric["GRAM"] = "gm";
    QuantityMetric["KILOGRAM"] = "kg";
    QuantityMetric["MILLILITER"] = "ml";
    QuantityMetric["LITER"] = "l";
    QuantityMetric["PLATE"] = "plate";
    QuantityMetric["HALF_PLATE"] = "half_plate";
    QuantityMetric["EACH"] = "each";
    QuantityMetric["PIECE"] = "pcs";
    QuantityMetric["PACKET"] = "pkt";
})(QuantityMetric = exports.QuantityMetric || (exports.QuantityMetric = {}));
var Role;
(function (Role) {
    Role["SUPER_ADMIN"] = "super_admin";
    Role["ADMIN"] = "admin";
    Role["EMPLOYEE"] = "employee";
})(Role = exports.Role || (exports.Role = {}));
var CustomerType;
(function (CustomerType) {
    CustomerType["INDIVIDUAL"] = "individual";
    CustomerType["ORGANIZATION"] = "organization";
})(CustomerType = exports.CustomerType || (exports.CustomerType = {}));
var RegistrationType;
(function (RegistrationType) {
    RegistrationType["PAN"] = "PAN";
    RegistrationType["VAT"] = "VAT";
})(RegistrationType = exports.RegistrationType || (exports.RegistrationType = {}));
var PaymentStatus;
(function (PaymentStatus) {
    PaymentStatus["PAID"] = "paid";
    PaymentStatus["NOT_PAID"] = "not_paid";
    PaymentStatus["PARTIAL_PAID"] = "partial_paid";
    PaymentStatus["RETURNED"] = "returned";
    PaymentStatus["PARTIAL_RETURNED"] = "partial_returned";
})(PaymentStatus = exports.PaymentStatus || (exports.PaymentStatus = {}));
var PaymentMethod;
(function (PaymentMethod) {
    PaymentMethod["CASH"] = "cash";
})(PaymentMethod = exports.PaymentMethod || (exports.PaymentMethod = {}));
var SortType;
(function (SortType) {
    SortType["ASC"] = "ascending";
    SortType["DESC"] = "descending";
})(SortType = exports.SortType || (exports.SortType = {}));
var EnrollmentType;
(function (EnrollmentType) {
    EnrollmentType["FULL_TIME"] = "full_time";
    EnrollmentType["PART_TIME"] = "part_time";
    EnrollmentType["CONTRACT"] = "contract";
})(EnrollmentType = exports.EnrollmentType || (exports.EnrollmentType = {}));
var PaySchedule;
(function (PaySchedule) {
    PaySchedule["WEEKLY"] = "weekly";
    PaySchedule["BI_WEEKLY"] = "bi-weekly";
    PaySchedule["MONTHLY"] = "monthly";
})(PaySchedule = exports.PaySchedule || (exports.PaySchedule = {}));
var WageType;
(function (WageType) {
    WageType["HOURLY"] = "hourly";
    WageType["WEEKLY"] = "weekly";
    WageType["MONTHLY"] = "monthly";
    WageType["FIXED"] = "fixed";
})(WageType = exports.WageType || (exports.WageType = {}));
//# sourceMappingURL=enums.js.map
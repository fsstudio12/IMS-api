'use strict';
var __createBinding =
  (this && this.__createBinding) ||
  (Object.create
    ? function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        var desc = Object.getOwnPropertyDescriptor(m, k);
        if (!desc || ('get' in desc ? !m.__esModule : desc.writable || desc.configurable)) {
          desc = {
            enumerable: true,
            get: function () {
              return m[k];
            },
          };
        }
        Object.defineProperty(o, k2, desc);
      }
    : function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
      });
var __setModuleDefault =
  (this && this.__setModuleDefault) ||
  (Object.create
    ? function (o, v) {
        Object.defineProperty(o, 'default', { enumerable: true, value: v });
      }
    : function (o, v) {
        o['default'] = v;
      });
var __importStar =
  (this && this.__importStar) ||
  function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null)
      for (var k in mod)
        if (k !== 'default' && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.deleteBusinessHandler =
  exports.updateBusinessHandler =
  exports.getBusinessHandler =
  exports.getBusinessesHandler =
    void 0;
const mongoose_1 = __importDefault(require('mongoose'));
const http_status_1 = __importDefault(require('http-status'));
const utils_1 = require('../utils');
const businessService = __importStar(require('./business.service'));
const SuccessResponse_1 = __importDefault(require('../success/SuccessResponse'));
const errors_1 = require('../errors');
const transactionWrapper_1 = __importDefault(require('../utils/transactionWrapper'));
exports.getBusinessesHandler = (0, utils_1.catchAsync)(async (req, res) => {
  const filter = (0, utils_1.pick)(req.query, ['name', 'email']);
  const options = (0, utils_1.pick)(req.query, ['sortBy', 'limit', 'page', 'projectBy']);
  const results = await businessService.queryBusinesses(filter, options);
  res.send((0, SuccessResponse_1.default)({ results }));
});
exports.getBusinessHandler = (0, utils_1.catchAsync)(async (req, res) => {
  if (typeof req.params['businessId'] === 'string') {
    const business = await businessService.getBusinessById(new mongoose_1.default.Types.ObjectId(req.params['businessId']));
    if (!business) throw new errors_1.ApiError(http_status_1.default.NOT_FOUND, 'Business not found.');
    res.send((0, SuccessResponse_1.default)({ business }));
  }
});
exports.updateBusinessHandler = (0, utils_1.catchAsync)(async (req, res) => {
  if (typeof req.params['businessId'] === 'string') {
    const business = await businessService.updateBusinessById(
      new mongoose_1.default.Types.ObjectId(req.params['businessId']),
      req.body
    );
    res.send((0, SuccessResponse_1.default)({ business }));
  }
});
exports.deleteBusinessHandler = (0, utils_1.catchAsync)(async (req, res) => {
  await (0, transactionWrapper_1.default)(async (session) => {
    if (typeof req.params['businessId'] === 'string') {
      await businessService.deleteBusinessById(new mongoose_1.default.Types.ObjectId(req.params['businessId']), session);
      res.status(http_status_1.default.NO_CONTENT).send();
    }
  });
});
//# sourceMappingURL=business.controller.js.map

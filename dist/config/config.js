"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
function loadEnvFile() {
    let envFileName = '.env';
    switch (process.env['NODE_ENV']) {
        case 'development':
            envFileName = '.env.development';
            break;
        case 'production':
            envFileName = '.env';
            break;
        case 'test':
            envFileName = '.env.test';
            break;
        default:
            break;
    }
    dotenv_1.default.config({ path: envFileName });
}
loadEnvFile();
const envVarsSchema = joi_1.default.object()
    .keys({
    NODE_ENV: joi_1.default.string().valid('production', 'development', 'test').required(),
    PORT: joi_1.default.number().default(3000),
    MONGODB_URL: joi_1.default.string().required().description('Mongo DB url'),
    JWT_SECRET: joi_1.default.string().required().description('JWT secret key'),
    JWT_ACCESS_EXPIRATION_MINUTES: joi_1.default.number().default(30).description('minutes after which access tokens expire'),
    JWT_REFRESH_EXPIRATION_DAYS: joi_1.default.number().default(30).description('days after which refresh tokens expire'),
    JWT_RESET_PASSWORD_EXPIRATION_MINUTES: joi_1.default.number()
        .default(10)
        .description('minutes after which reset password token expires'),
    JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: joi_1.default.number()
        .default(10)
        .description('minutes after which verify email token expires'),
    SMTP_HOST: joi_1.default.string().description('server that will send the emails'),
    SMTP_PORT: joi_1.default.number().description('port to connect to the email server'),
    SMTP_USERNAME: joi_1.default.string().description('username for email server'),
    SMTP_PASSWORD: joi_1.default.string().description('password for email server'),
    EMAIL_FROM: joi_1.default.string().description('the from field in the emails sent by the app'),
    CLIENT_URL: joi_1.default.string().required().description('Client url'),
    AWS_ACCESS_KEY_ID: joi_1.default.string().description('aws key id'),
    AWS_SECRET_ACCESS_KEY: joi_1.default.string().description('aws secret access key'),
    AWS_USER_REGION: joi_1.default.string().description('aws user region'),
    AWS_BUCKET_BASE_URL: joi_1.default.string().description('aws base url'),
    AWS_BUCKET_IMS: joi_1.default.string().description('aws bucket for IMS'),
    AWS_CUSTOMERS_FOLDER: joi_1.default.string().description('bucket folder for customers'),
    AWS_UNLABELED_FOLDER: joi_1.default.string().description('bucket folder for unlabeled files'),
})
    .unknown();
const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);
if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}
const config = {
    env: envVars.NODE_ENV,
    port: envVars.PORT,
    mongoose: {
        url: envVars.MONGODB_URL + (envVars.NODE_ENV === 'test' ? '-test' : ''),
        options: {
            useCreateIndex: true,
            useNewUrlParser: true,
            useUnifiedTopology: true,
        },
    },
    jwt: {
        secret: envVars.JWT_SECRET,
        accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
        refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
        resetPasswordExpirationMinutes: envVars.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
        verifyEmailExpirationMinutes: envVars.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES,
        cookieOptions: {
            httpOnly: true,
            secure: envVars.NODE_ENV === 'production',
            signed: true,
        },
    },
    email: {
        smtp: {
            host: envVars.SMTP_HOST,
            port: envVars.SMTP_PORT,
            auth: {
                user: envVars.SMTP_USERNAME,
                pass: envVars.SMTP_PASSWORD,
            },
        },
        from: envVars.EMAIL_FROM,
    },
    clientUrl: envVars.CLIENT_URL,
    aws: {
        accessKeyId: envVars.AWS_ACCESS_KEY_ID,
        secretAccessKey: envVars.AWS_SECRET_ACCESS_KEY,
        userRegion: envVars.AWS_USER_REGION,
        bucketBaseUrl: envVars.AWS_BUCKET_BASE_URL,
        bucket: envVars.AWS_BUCKET_IMS,
        customersFolder: envVars.AWS_CUSTOMERS_FOLDER,
        unlabeledFolder: envVars.AWS_UNLABELED_FOLDER,
    },
};
exports.default = config;
//# sourceMappingURL=config.js.map
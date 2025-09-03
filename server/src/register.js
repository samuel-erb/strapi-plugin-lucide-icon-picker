"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pluginId_1 = require("../../admin/src/pluginId");
const register = ({ strapi }) => {
    strapi.customFields.register({
        name: 'lucide-icon',
        plugin: pluginId_1.PLUGIN_ID,
        type: 'string',
        inputSize: {
            default: 4,
            isResizable: true,
        },
    });
};
exports.default = register;

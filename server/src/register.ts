import type { Core } from '@strapi/strapi';

const register = ({ strapi }: { strapi: Core.Strapi }) => {
  strapi.customFields.register({
    name: 'lucide-icon',
    plugin: 'lucide-icon-picker',
    type: 'string',
    inputSize: {
      default: 4,
      isResizable: true,
    },
  });
};

export default register;

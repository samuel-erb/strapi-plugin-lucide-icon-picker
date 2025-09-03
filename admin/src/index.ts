import { PLUGIN_ID } from './pluginId';
import { PluginIcon } from './components/PluginIcon';

export default {
  register(app: any) {
    app.customFields.register({
      name: 'lucide-icon',
      plugin: PLUGIN_ID,
      type: 'string',
      intlLabel: {
        id: 'lucide-icon-picker.label',
        defaultMessage: 'Lucide Icon',
      },
      intlDescription: {
        id: 'lucide-icon-picker.description',
        defaultMessage: 'Select a Lucide icon',
      },
      icon: PluginIcon,
      components: {
        Input: async () => import('./components/LucideIconField').then(module => module.LucideIconField),
      },
    });
  },
  async registerTrads({ locales }: { locales: string[] }) {
    return Promise.all(
      locales.map(async (locale) => {
        try {
          const { default: data } = await import(`./translations/${locale}.json`);

          return { data, locale };
        } catch {
          return { data: {}, locale };
        }
      })
    );
  },
};

import { PLUGIN_ID } from './pluginId';
import { PluginIcon } from './components/PluginIcon';
import { getTranslation } from './utils/getTranslation';

export default {
  register(app: any) {
    app.customFields.register({
      name: 'lucide-icon',
      pluginId: PLUGIN_ID,
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
        Input: async () => import('./components/Input'),
      },
      options: {
        advanced: [
          {
            sectionTitle: {
              id: 'global.settings',
              defaultMessage: 'Settings',
            },
            items: [
              {
                name: 'required',
                type: 'checkbox',
                intlLabel: {
                  id: getTranslation('options.required.label'),
                  defaultMessage: 'Required field',
                },
                description: {
                  id: getTranslation('options.required.description'),
                  defaultMessage: "You won't be able to create an entry if this field is empty",
                },
              },
            ],
          },
        ],
      }
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

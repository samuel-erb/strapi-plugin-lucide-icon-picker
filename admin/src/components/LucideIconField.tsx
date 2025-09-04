import * as React from 'react';
import {
  Box,
  Button,
  Field,
  Flex,
  Popover,
  Searchbar, Tooltip,
  Typography,
  useComposedRefs,
} from '@strapi/design-system';
import { type InputProps, useField } from '@strapi/strapi/admin';
import { useIntl } from 'react-intl';

import { ICONS_DATA } from '../data/iconsData';
import { CATEGORIES_DATA } from '../data/categoriesData';
import type { Icon } from '../../custom';
import { ApiIcon } from './ApiIcon';
import { getTranslation } from '../utils/getTranslation';

type LucideIconInputProps = InputProps & {
  labelAction?: React.ReactNode;
};

export const LucideIconField = React.forwardRef<HTMLButtonElement, LucideIconInputProps>(
  ({ hint, disabled, labelAction, label, name, required }, forwardedRef) => {
    const [showIconPicker, setShowIconPicker] = React.useState(false);
    const [searchTerm, setSearchTerm] = React.useState('');
    const iconPickerButtonRef = React.useRef<HTMLButtonElement>(null!);
    const { formatMessage } = useIntl();
    const field = useField(name);
    const value = field.value ?? '';

    const composedRefs = useComposedRefs(forwardedRef, iconPickerButtonRef);

    const filteredIconsByCategory = React.useMemo(() => {
      let filteredIcons = ICONS_DATA;

      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        filteredIcons = ICONS_DATA.filter((icon) => {
          return (
            icon.name.toLowerCase().includes(searchLower) ||
            icon.tags.some(tag => tag.toLowerCase().includes(searchLower)) ||
            icon.categories.some(cat => cat.toLowerCase().includes(searchLower))
          );
        });
      }

      // Group by categories
      const grouped = new Map();

      filteredIcons.forEach((icon) => {
        icon.categories.forEach((categoryName) => {
          if (!grouped.has(categoryName)) {
            grouped.set(categoryName, []);
          }
          grouped.get(categoryName).push(icon);
        });
      });

      return Array.from(grouped.entries()).map(([categoryName, icons]) => ({
        category: CATEGORIES_DATA.find(cat => cat.name === categoryName),
        icons: icons.slice(0, 50) // Limit per category
      })).filter(group => group.icons.length > 0)
        .sort((a, b) => (a.category?.title || '').localeCompare(b.category?.title || ''));
    }, [searchTerm]);

    const handleIconSelect = (iconName: string) => {
      field.onChange(name, iconName);
      setShowIconPicker(false);
      setSearchTerm('');
    };

    const handleClear = () => {
      field.onChange(name, '');
      setShowIconPicker(false);
      setSearchTerm('');
    };

    return (
      <Field.Root name={name} id={name} error={field.error} hint={hint} required={required}>
        <Flex direction="column" alignItems="stretch" gap={1}>
          <Field.Label action={labelAction}>{label}</Field.Label>
          <Flex gap={2} alignItems="stretch">
            {/* Display Field */}
            <Box
              borderStyle={'solid'}
              borderWidth={'1px'}
              borderColor={'secondary200'}
              background={'neutral0'}
              hasRadius
              padding={3}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                height: '40px',
              }}
            >
              {value ? (
                <>
                  <ApiIcon apiName={value} size={24} />
                  <Typography variant="omega" style={{ whiteSpace: 'nowrap' }}>
                    {value}
                  </Typography>
                </>
              ) : (
                <Typography textColor="neutral500" variant="omega" style={{ whiteSpace: 'nowrap' }}>
                  {formatMessage({
                    id: getTranslation('placeholder.no-selection'),
                    defaultMessage: 'No icon selected',
                  })}
                </Typography>
              )}
            </Box>

            {/* Change Button */}
            <Popover.Root onOpenChange={setShowIconPicker}>
              <Popover.Trigger>
                <Button
                  ref={composedRefs}
                  aria-label={formatMessage({
                    id: getTranslation('aria.toggle'),
                    defaultMessage: 'Change icon',
                  })}
                  aria-controls={formatMessage({
                    id: getTranslation('aria.picker'),
                    defaultMessage: 'icon-picker',
                  })}
                  aria-haspopup="dialog"
                  aria-expanded={showIconPicker}
                  aria-disabled={disabled}
                  disabled={disabled}
                  variant="secondary"
                  size="L"
                >
                  {value
                    ? formatMessage({
                        id: getTranslation('button.change'),
                        defaultMessage: 'Change',
                      })
                    : formatMessage({
                        id: getTranslation('button.select'),
                        defaultMessage: 'Select',
                      })}
                </Button>
              </Popover.Trigger>
              <Popover.Content
                sideOffset={8}
                side="bottom"
                align="center"
                collisionPadding={32}
                avoidCollisions={true}
                style={{ width: 460, maxHeight: 'min(350px, 60vh)', padding: 0, zIndex: 9999 }}
              >
                <Flex direction="column" gap={3}>
                  <Flex gap={3} style={{ paddingTop: 12 }}>
                    <Searchbar
                      name="searchbar"
                      onClear={() => setSearchTerm('')}
                      value={searchTerm}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setSearchTerm(e.target.value)
                      }
                      clearLabel="Clearing the plugin search"
                      placeholder={formatMessage({
                        id: getTranslation('placeholder.search'),
                        defaultMessage: 'Search icons...',
                      })}
                    >
                      Searching for an icon
                    </Searchbar>

                    {value && (
                      <Button variant="danger" onClick={handleClear} size="M">
                        {formatMessage({
                          id: getTranslation('button.clear'),
                          defaultMessage: 'Clear Selection',
                        })}
                      </Button>
                    )}
                  </Flex>
                  <Box
                    overflow={'scroll'}
                    style={{
                      maxHeight: 'min(240px, 40vh)',
                      width: '100%',
                      paddingLeft: 8,
                      paddingRight: 8,
                    }}
                  >
                    <Flex direction="column" gap={4}>
                      {filteredIconsByCategory.map(({ category, icons }) => (
                        <Box key={category?.name || 'uncategorized'}>
                          {category && (
                            <Flex gap={1} style={{marginBottom: 8}}>
                              <ApiIcon apiName={category.icon} size={"16px"} />
                              <Typography variant="sigma" textColor="neutral600" style={{textTransform: 'uppercase', fontSize: '11px' }}>
                                {category.title}
                              </Typography>
                            </Flex>
                          )}
                          <Box
                            display={'grid'}
                            style={{
                              gridTemplateColumns: 'repeat(8, 1fr)',
                              justifyItems: 'center',
                              gap: 6,
                              width: '100%',
                            }}
                          >
                            {icons.map((icon: Icon) => (
                              <Tooltip label={icon.name}>
                                <Button
                                  key={icon.name}
                                  onClick={() => handleIconSelect(icon.name)}
                                  variant={value === icon.name ? 'default' : 'tertiary'}
                                  title={icon.name}
                                  background={'transparent'}
                                  style={{
                                    height: 40,
                                    width: 40,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    padding: 8,
                                  }}
                                >
                                  <ApiIcon style={{marginTop: "3.95px"}} apiName={icon.name} size={20} />
                                </Button>
                              </Tooltip>
                            ))}
                          </Box>
                        </Box>
                      ))}
                    </Flex>
                  </Box>
                </Flex>
              </Popover.Content>
            </Popover.Root>
          </Flex>
          <Field.Hint />
          <Field.Error />
        </Flex>
      </Field.Root>
    );
  }
);

import * as React from 'react';
import {
  Button,
  Box,
  Field,
  Flex,
  Popover,
  Typography,
  TextInput,
  useComposedRefs,
} from '@strapi/design-system';
import { type InputProps, useField } from '@strapi/strapi/admin';
import { useIntl } from 'react-intl';

import { ICON_NAMES } from '../data/iconNames';
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

    const filteredIcons = React.useMemo(() => {
      if (!searchTerm) return ICON_NAMES;
      return ICON_NAMES
        .filter(iconName =>
          iconName.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .slice(0, 50);
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
              style={{
                flex: 1,
                border: '1px solid #dcdce4',
                borderRadius: '4px',
                padding: '8px 12px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                height: '40px',
                backgroundColor: disabled ? '#f6f6f9' : '#ffffff'
              }}
            >
              {value ? (
                <>
                  <ApiIcon apiName={value} size={24} />
                  <Typography variant="omega" style={{ whiteSpace: 'nowrap' }}>{value}</Typography>
                </>
              ) : (
                <Typography textColor="neutral500" variant="omega" style={{ whiteSpace: 'nowrap' }}>
                  {formatMessage({ id: getTranslation('placeholder.no-selection'), defaultMessage: 'No icon selected' })}
                </Typography>
              )}
            </Box>

            {/* Change Button */}
            <Popover.Root onOpenChange={setShowIconPicker}>
              <Popover.Trigger>
                <Button
                  ref={composedRefs}
                  aria-label={formatMessage({ id: getTranslation('aria.toggle'), defaultMessage: 'Change icon' })}
                  aria-controls={formatMessage({ id: getTranslation('aria.picker'), defaultMessage: 'icon-picker' })}
                  aria-haspopup="dialog"
                  aria-expanded={showIconPicker}
                  aria-disabled={disabled}
                  disabled={disabled}
                  variant="secondary"
                  size="L"
                >
                  {value ? formatMessage({ id: getTranslation('button.change'), defaultMessage: 'Change' }) : formatMessage({ id: getTranslation('button.select'), defaultMessage: 'Select' })}
                </Button>
              </Popover.Trigger>
            <Popover.Content
              sideOffset={8}
              side="bottom"
              align="center"
              collisionPadding={32}
              avoidCollisions={true}
              style={{ width: 320, maxHeight: 'min(350px, 60vh)', padding: 12, zIndex: 9999 }}
            >
              <Flex direction="column" gap={3}>
                <TextInput
                  placeholder={formatMessage({ id: getTranslation('placeholder.search'), defaultMessage: 'Search icons...' })}
                  value={searchTerm}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                  autoFocus
                />

                {value && (
                  <Button variant="danger" onClick={handleClear} size="S">
                    {formatMessage({ id: getTranslation('button.clear'), defaultMessage: 'Clear Selection' })}
                  </Button>
                )}

                <Box style={{
                  maxHeight: 'min(240px, 40vh)',
                  overflowY: 'auto',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: 6,
                  paddingRight: 4
                }}>
                  {filteredIcons.map((iconName) => (
                    <Button
                      key={iconName}
                      onClick={() => handleIconSelect(iconName)}
                      variant={value === iconName ? 'default' : 'tertiary'}
                      title={iconName}
                      style={{
                        height: 40,
                        width: 40,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: 8,
                        backgroundColor: value === iconName ? '#e6f7ff' : 'transparent'
                      }}
                    >
                      <ApiIcon apiName={iconName} size={20} />
                    </Button>
                  ))}
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

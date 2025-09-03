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
import { CaretDown } from '@strapi/icons';
import { type InputProps, useField } from '@strapi/strapi/admin';
import { useIntl } from 'react-intl';

import { ICON_NAMES } from '../data/iconNames';
import { ApiIcon } from './ApiIcon';

type LucideIconInputProps = InputProps & {
  labelAction?: React.ReactNode;
};

export const LucideIconField = React.forwardRef<HTMLButtonElement, LucideIconInputProps>(
  ({ hint, disabled, labelAction, label, name, required, ...props }, forwardedRef) => {
    const [showIconPicker, setShowIconPicker] = React.useState(false);
    const [searchTerm, setSearchTerm] = React.useState('');
    const iconPickerButtonRef = React.useRef<HTMLButtonElement>(null!);
    const { formatMessage } = useIntl();
    const field = useField(name);
    const value = field.value ?? '';

    const composedRefs = useComposedRefs(forwardedRef, iconPickerButtonRef);

    const filteredIcons = React.useMemo(() => {
      if (!searchTerm) return ICON_NAMES.slice(0, 100);
      return ICON_NAMES
        .filter(iconName => 
          iconName.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .slice(0, 100);
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
          <Popover.Root onOpenChange={setShowIconPicker}>
            <Popover.Trigger>
              <Button
                ref={composedRefs}
                aria-label="Icon picker toggle"
                aria-controls="icon-picker-value"
                aria-haspopup="dialog"
                aria-expanded={showIconPicker}
                aria-disabled={disabled}
                disabled={disabled}
                variant="tertiary"
                size="L"
                style={{ 
                  width: '100%',
                  justifyContent: 'space-between'
                }}
              >
                <Flex gap={2} alignItems="center">
                  {value ? (
                    <>
                      <ApiIcon apiName={value} size={20} />
                      <Typography variant="omega">{value}</Typography>
                    </>
                  ) : (
                    <Typography textColor="neutral600" variant="omega">
                      Select an icon
                    </Typography>
                  )}
                </Flex>
                <CaretDown aria-hidden />
              </Button>
            </Popover.Trigger>
            <Popover.Content sideOffset={4} style={{ width: 400, maxHeight: 500, padding: 16 }}>
              <Flex direction="column" gap={3}>
                <TextInput
                  placeholder="Search icons..."
                  value={searchTerm}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                />
                
                {value && (
                  <Button variant="danger" onClick={handleClear} size="S">
                    Clear Selection
                  </Button>
                )}
                
                <Box style={{ 
                  maxHeight: 350, 
                  overflowY: 'auto',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: 8
                }}>
                  {filteredIcons.map((iconName) => (
                    <Button
                      key={iconName}
                      onClick={() => handleIconSelect(iconName)}
                      variant={value === iconName ? 'default' : 'tertiary'}
                      style={{ 
                        height: 60,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 4,
                        backgroundColor: value === iconName ? '#e6f7ff' : 'transparent'
                      }}
                    >
                      <ApiIcon apiName={iconName} size={16} />
                      <Typography 
                        variant="pi" 
                        style={{ 
                          fontSize: 10, 
                          textAlign: 'center', 
                          wordBreak: 'break-all',
                          lineHeight: 1.2 
                        }}
                      >
                        {iconName}
                      </Typography>
                    </Button>
                  ))}
                </Box>
              </Flex>
            </Popover.Content>
          </Popover.Root>
          <Field.Hint />
          <Field.Error />
        </Flex>
      </Field.Root>
    );
  }
);

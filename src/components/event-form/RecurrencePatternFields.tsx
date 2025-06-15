
import React from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Control, useWatch } from 'react-hook-form';

interface RecurrencePatternFieldsProps {
  control: Control<any>;
}

const RecurrencePatternFields: React.FC<RecurrencePatternFieldsProps> = ({ control }) => {
  const patternType = useWatch({ control, name: 'recurrence.pattern_type' });
  const endType = useWatch({ control, name: 'recurrence.end_type' });

  const daysOfWeek = [
    { value: 0, label: 'Sun' },
    { value: 1, label: 'Mon' },
    { value: 2, label: 'Tue' },
    { value: 3, label: 'Wed' },
    { value: 4, label: 'Thu' },
    { value: 5, label: 'Fri' },
    { value: 6, label: 'Sat' },
  ];

  return (
    <div className="space-y-4 border rounded-lg p-4">
      <h3 className="font-semibold">Recurrence Pattern</h3>
      
      <FormField
        control={control}
        name="recurrence.pattern_type"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Repeat</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select recurrence pattern" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="recurrence.interval_value"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Every {patternType === 'daily' ? 'day(s)' : patternType === 'weekly' ? 'week(s)' : 'month(s)'}
            </FormLabel>
            <FormControl>
              <Input 
                type="number" 
                min="1" 
                {...field} 
                onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {patternType === 'weekly' && (
        <FormField
          control={control}
          name="recurrence.days_of_week"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Days of the week</FormLabel>
              <div className="flex flex-wrap gap-2">
                {daysOfWeek.map((day) => (
                  <div key={day.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={`day-${day.value}`}
                      checked={field.value?.includes(day.value) || false}
                      onCheckedChange={(checked) => {
                        const currentDays = field.value || [];
                        if (checked) {
                          field.onChange([...currentDays, day.value].sort());
                        } else {
                          field.onChange(currentDays.filter((d: number) => d !== day.value));
                        }
                      }}
                    />
                    <label htmlFor={`day-${day.value}`} className="text-sm font-medium">
                      {day.label}
                    </label>
                  </div>
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      {patternType === 'monthly' && (
        <FormField
          control={control}
          name="recurrence.day_of_month"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Day of month (1-31)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  min="1" 
                  max="31" 
                  {...field} 
                  onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      <FormField
        control={control}
        name="recurrence.end_type"
        render={({ field }) => (
          <FormItem>
            <FormLabel>End</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="When should this series end?" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="never">Never</SelectItem>
                <SelectItem value="after_count">After a number of occurrences</SelectItem>
                <SelectItem value="by_date">On a specific date</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {endType === 'after_count' && (
        <FormField
          control={control}
          name="recurrence.end_count"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Number of occurrences</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  min="1" 
                  {...field} 
                  onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      {endType === 'by_date' && (
        <FormField
          control={control}
          name="recurrence.end_date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>End date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(new Date(field.value), "PPP")
                      ) : (
                        <span>Pick an end date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value ? new Date(field.value) : undefined}
                    onSelect={(date) => field.onChange(date?.toISOString().split('T')[0])}
                    disabled={(date) => date < new Date()}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </div>
  );
};

export default RecurrencePatternFields;

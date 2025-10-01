"use client";

import React, { useEffect, useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { searchBusinessOwners } from "@/lib/actions/business-owners";
import { Owner } from "@/types/owners/type";

interface BusinessOwnerSelectorProps {
  placeholder?: string;
  isRequired?: boolean;
  value?: string | Owner;
  isDisabled?: boolean;
  description?: string;
  onChange: (value: string | Owner) => void;
  disabledValues?: string[];
}

const BusinessOwnerSelector: React.FC<BusinessOwnerSelectorProps> = ({
  placeholder = "Select business owner",
  value,
  isDisabled,
  description,
  onChange,
  disabledValues = [],
}) => {
  const [open, setOpen] = useState(false);
  const [businessOwners, setBusinessOwners] = useState<Owner[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const page = 1;
  const pageSize = 500

  useEffect(() => {
    async function loadBusinessOwners() {
      try {
        setIsLoading(true);
        const fetchedOwners = await searchBusinessOwners(page,pageSize);
        setBusinessOwners(fetchedOwners.content);
      } catch (error: any) {
        console.log("Error fetching business owners:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadBusinessOwners();
  }, []);

  const getDisplayName = (owner: Owner) => {
    return `${owner.firstName} ${owner.lastName}`;
  };
  

  const ownerOptions = businessOwners.map((owner) => ({
    id: owner.id,
    displayName: getDisplayName(owner),
    owner: owner,
    disabled: disabledValues.includes(owner.id),
  }));

  // Handle different value types (string ID or Owner object)
  const selectedValue = typeof value === 'object' && value !== null ? value.id : value;
  const selectedOption = ownerOptions.find((option) => option.id === selectedValue);

  // Handle change to pass full owner object
  const handleSelectionChange = (ownerId: string) => {
    const selectedOwner = businessOwners.find(owner => owner.id === ownerId);
    // Pass the full owner object to the parent component
    onChange(selectedOwner || ownerId);
    setOpen(false);
  };

  return (
    <div className="space-y-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
            disabled={isDisabled || isLoading}
          >
            {isLoading 
              ? "Loading business owners..." 
              : selectedOption 
                ? selectedOption.displayName 
                : placeholder
            }
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[400px] p-0">
          <Command filter={(value, search) => {
            if (!search) return 1;
            const item = ownerOptions.find(option => option.id === value);
            if (!item) return 0;
            return item.displayName.toLowerCase().includes(search.toLowerCase()) ? 1 : 0;
          }}>
            <CommandInput placeholder={`Search ${placeholder.toLowerCase()}...`} />
            <CommandList>
              <CommandEmpty>No business owner found.</CommandEmpty>
              <CommandGroup>
                {ownerOptions.map((option) => (
                  <CommandItem
                    key={option.id}
                    value={option.id}
                    disabled={option.disabled}
                    onSelect={(currentValue) => {
                      handleSelectionChange(currentValue);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedValue === option.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {option.displayName}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {description && <p className="text-sm text-gray-500">{description}</p>}
    </div>
  );
};

export default BusinessOwnerSelector;
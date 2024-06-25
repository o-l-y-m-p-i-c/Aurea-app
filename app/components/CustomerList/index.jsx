import { Autocomplete, BlockStack, DataTable, Icon, Layout, LegacyCard } from "@shopify/polaris"
import { useCallback, useEffect, useMemo, useState } from "react";
import { Input } from "../Input"
import {SearchIcon} from '@shopify/polaris-icons';



export const CustomerList = ({
    customers = [] , 
    callback = () => null , 
    title = '',
    headings = []
}) => {
    
    const deselectedOptions = useMemo(
        () => customers.map(({node}) => {return { 
          value: node.firstName.toLowerCase(),
          label: node.firstName
        }}),
        [],
      );
    
    
      const [selectedOptions, setSelectedOptions] = useState([]);
      const [inputValue, setInputValue] = useState('');
      const [options, setOptions] = useState(deselectedOptions);
    
      const [rowsInPriorityTable, setRowsInPriorityTable] = useState([])
    
      const updateText = useCallback(
        (value) => {
          setInputValue(value);
    
          if (value === '') {
            setOptions(deselectedOptions);
            return;
          }
    
          const filterRegex = new RegExp(value, 'i');
          const resultOptions = deselectedOptions.filter((option) =>
            option.label.match(filterRegex),
          );
          setOptions(resultOptions);
        },
        [deselectedOptions],
      );
    
      const updateSelection = useCallback(
        (selected) => {
          const selectedValue = selected.map((selectedItem) => {
            const matchedOption = options.find((option) => {
              return option.value.match(selectedItem);
            });
            return matchedOption && matchedOption.label;
          });
    
          setSelectedOptions(selected);
          setInputValue(selectedValue[0] || '');
        },
        [options],
      );
    
    
      useEffect(()=>{
    
        const rows = callback(inputValue, customers)
    
        setRowsInPriorityTable(()=>rows)
      },[inputValue])
    
    return <>
        <div className="">
          <h2>
            {title} - ({rowsInPriorityTable.length})
          </h2>
          <div style={{marginBottom: 20}}>
            <Autocomplete
              options={options}
              selected={selectedOptions}
              onSelect={updateSelection}
              textField={<Input 
                callback={updateText}  
                value={inputValue}
                icon={<Icon source={SearchIcon} tone="base" />}
                placeholder="Search"
              />}
            />
          </div>
          <BlockStack gap="500">
            <Layout>
              <Layout.Section>
              <LegacyCard>
                <div className="tableWrap">
                  <DataTable
                    stickyHeader={true}
                    columnContentTypes={[
                      'text',
                      'text',
                      'text',
                      'text'
                    ]}
                    headings={[ ...headings.map(heading => {return <b>{heading}</b>})]}
                    rows={[...rowsInPriorityTable].reverse()}
                  />
                </div>
              </LegacyCard>
              </Layout.Section>
            </Layout>
          </BlockStack> 
        </div>
    
    </>
}
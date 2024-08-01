import cssClass from '@/components/common/select.component.module.scss';
import { twMerge } from 'tailwind-merge';
import React, { useState } from 'react';
import { Select } from 'antd';
import { CaretDownOutlined } from '@ant-design/icons';

export default function SelectComponent() {
  const [chain, setChain] = useState('china');

  const handleChange = (value: any) => {
    setChain(value);
  };

  const options = [
    {
      label: 'China',
      value: 'china',
    },
    {
      label: 'USA',
      value: 'usa',
    },
  ];

  return (
    <div className={twMerge(cssClass.selectComponent)}>
      <div className="select-container">
        <Select
          defaultValue={chain}
          onChange={handleChange}
          options={options}
          suffixIcon={<CaretDownOutlined />}
        />
      </div>
    </div>
  );
}

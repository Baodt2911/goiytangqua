import {
  Button,
  Flex,
  Radio,
  Select,
  Space,
  Typography,
  Spin,
  message,
} from "antd";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { getFiltersAsync } from "../../features/filter/filter.service";
import { 
  getFiltersStart, 
  getFiltersSuccess, 
  getFiltersFailure 
} from "../../features/filter/filter.slice";
import { FilterType } from "../../types/filter.type";

const { Title } = Typography;

interface GiftFilterProps {
  onApplyFilters?: (filters: Record<string, string | string[]>) => void;
  onClearFilters?: () => void;
}

const GiftFilter: React.FC<GiftFilterProps> = ({ onApplyFilters, onClearFilters }) => {
  const dispatch = useDispatch();
  const { filters: filterData, loading } = useSelector((state: RootState) => state.filter);
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string | string[]>>({});

  // Fetch filter data from API
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        dispatch(getFiltersStart());
        const data = await getFiltersAsync();
        
        if (data.status === 200) {
          dispatch(getFiltersSuccess(data.filters));
          // Initialize selected filters state
          const initialFilters: Record<string, string | string[]> = {};
          data.filters.forEach((filter: FilterType) => {
            if (filter.type === 'Sở thích') {
              initialFilters[filter.type] = [];
            } else {
              initialFilters[filter.type] = '';
            }
          });
          setSelectedFilters(initialFilters);
        }
      } catch (error: any) {
        dispatch(getFiltersFailure(error.message || 'Không thể tải dữ liệu bộ lọc'));
        message.error('Không thể tải dữ liệu bộ lọc');
      }
    };

    fetchFilters();
  }, [dispatch]);

  const handleFilterChange = (filterType: string, value: string | string[]) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleApplyFiltersClick = () => {
    // Only include filters that have values
    const filtersWithValues: Record<string, string | string[]> = {};
    
    Object.entries(selectedFilters).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        // For arrays, only include if not empty
        if (value.length > 0) {
          filtersWithValues[key] = value;
        }
      } else {
        // For strings, only include if not empty
        if (value && value.trim() !== '') {
          filtersWithValues[key] = value;
        }
      }
    });
    
    console.log('Applied filters:', filtersWithValues);
    onApplyFilters?.(filtersWithValues);
  };

  const handleClearFiltersClick = () => {
    const clearedFilters: Record<string, string | string[]> = {};
    filterData.forEach(filter => {
      if (filter.type === 'Sở thích') {
        clearedFilters[filter.type] = [];
      } else {
        clearedFilters[filter.type] = '';
      }
    });
    setSelectedFilters(clearedFilters);
    onClearFilters?.();
  };

  // Render filter component based on type
  const renderFilterComponent = (filter: FilterType) => {
    const { type, options } = filter;
    const value = selectedFilters[type];

    // Special handling for different filter types
    switch (type) {
      case 'Sở thích':
        return (
          <Select
            mode="multiple"
            style={{ width: "100%" }}
            placeholder={`Chọn ${type.toLowerCase()}`}
            value={value as string[]}
            onChange={(val) => handleFilterChange(type, val)}
            options={options.map(option => ({ label: option, value: option }))}
            maxTagCount="responsive"
            showSearch
          />
        );
      
      case 'Giá trị quà tặng':
        return (
          <Radio.Group
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 8,
              fontWeight: 500,
            }}
            value={value as string}
            onChange={(e) => handleFilterChange(type, e.target.value)}
          >
            {options.map((option: string, index: number) => (
              <Radio key={index} value={option}>
                {option}
              </Radio>
            ))}
          </Radio.Group>
        );

      case 'Giới tính':
        return (
          <Radio.Group
            value={value as string}
            onChange={(e) => handleFilterChange(type, e.target.value)}
            options={options.map(option => ({ label: option, value: option }))}
          />
        );

      case 'Tuổi':
        return (
          <Select
            style={{ width: "100%" }}
            placeholder={`Chọn ${type.toLowerCase()}`}
            value={value as string}
            onChange={(val) => handleFilterChange(type, val)}
            options={options.map(option => ({ label: `${option} tuổi`, value: option }))}
            showSearch
          />
        );

      default:
        return (
          <Select
            style={{ width: "100%" }}
            placeholder={`Chọn ${type.toLowerCase()}`}
            value={value as string}
            onChange={(val) => handleFilterChange(type, val)}
            options={options.map(option => ({ label: option, value: option }))}
            showSearch
            allowClear
          />
        );
    }
  };

  if (loading) {
    return (
      <Flex justify="center" align="center" style={{ height: "200px" }}>
        <Spin size="large" />
      </Flex>
    );
  }

  return (
    <Flex
      style={{
        width: "100%",
        padding: "50px",
        gap: 30,
      }}
      vertical
    >
      {/* Dynamic Filter Rendering */}
      <Flex style={{ width: "100%" }} wrap="wrap" gap={20}>
        {filterData.map((filter) => (
          <Space key={filter._id} direction="vertical" style={{ minWidth: 200, flex: 1 }}>
            <Title level={5}>{filter.type}</Title>
            {renderFilterComponent(filter)}
          </Space>
        ))}
      </Flex>

      {/* Action Buttons */}
      <Flex style={{ width: "100%" }} justify="space-between">
        <Button
          onClick={handleClearFiltersClick}
          style={{ fontFamily: "Oswald", padding: "20px 25px", fontSize: 16 }}
        >
          Xóa bộ lọc
        </Button>
        <Button
          type="primary"
          onClick={handleApplyFiltersClick}
          style={{ fontFamily: "Oswald", padding: "20px 25px", fontSize: 16 }}
        >
          Áp dụng bộ lọc
        </Button>
      </Flex>
    </Flex>
  );
};

export default GiftFilter;

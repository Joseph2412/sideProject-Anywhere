import React from "react";
import { Tabs } from "antd";

type TabItem = {
  key: string;
  label: string;
  children: React.ReactNode;
};

type Props = {
  tabs: TabItem[];
};

const CustomTab: React.FC<Props> = ({ tabs }) => {
  return <Tabs defaultActiveKey={tabs[0]?.key} items={tabs} />;
};

export default CustomTab;

import { Flex, Typography } from "antd";
import React from "react";
const { Title } = Typography;

const DashBoard: React.FC = () => {
  // const dispatch = useAppDispatch();
  // const dataPost = useAppSelector((state: RootState) => state.post);
  return (
    <Flex vertical style={{ width: "100%" }} gap={30}>
      <Flex>
        <Title level={3}>Bảng thống kê</Title>
      </Flex>
    </Flex>
  );
};

export default DashBoard;

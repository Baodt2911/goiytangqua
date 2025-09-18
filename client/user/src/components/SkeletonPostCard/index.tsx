import { Row, Col, Flex, Skeleton } from "antd";

const SkeletonPostCard: React.FC<{count: number}> = ({count}) => {
  return (
    <Row gutter={[35, 35]}>
      {Array.from({ length: count }, (_, index) => (
        <Col key={index} span={24}>
          <Flex vertical gap={16} style={{ background: "#fff" }}>
            <Skeleton.Image style={{ width: "100%", height: 400 }} />
            <div
              style={{
                width: "70%",
                margin: "0 auto",
                background: "#fff",
                transform: "translateY(-150px)",
                padding: "20px 50px",
                minHeight: 200,
              }}
            >
              <Skeleton active />
            </div>
          </Flex>
        </Col>
      ))}
    </Row>
  );
};
export default SkeletonPostCard;
import React, { useEffect } from "react";
import { Card, Col, Flex, List, Row, Skeleton, Typography } from "antd";
import { useAppDispatch, useAppSelector } from "../../app/hook";
import {
  getPostsFailure,
  getPostsStart,
  getPostsSuccess,
} from "../../features/post/post.slice";
import { getAllPostAsync } from "../../features/post/post.service";
import { RootState } from "../../app/store";

const { Text, Title } = Typography;
const SkeletonListCard: React.FC = () => {
  return (
    <Row gutter={[16, 16]}>
      {Array.from({ length: 4 }, (_, index) => (
        <Col key={index} xs={24} sm={12} md={12} lg={12} xl={12}>
          <Flex vertical gap={16}>
            <Skeleton.Image style={{ width: "100%", height: 120 }} />
            <Skeleton active />
          </Flex>
        </Col>
      ))}
    </Row>
  );
};
const PostList: React.FC = () => {
  const { posts, loading } = useAppSelector((state: RootState) => state.post);
  const dispatch = useAppDispatch();
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        dispatch(getPostsStart());
        const { posts } = await getAllPostAsync({
          pageSize: 6,
        });

        dispatch(getPostsSuccess(posts));
      } catch (error: any) {
        console.log(error);
        dispatch(getPostsFailure(error.message));
      }
    };
    fetchPosts();
  }, []);

  return (
    <>
      {loading ? (
        <SkeletonListCard />
      ) : (
        <List
          style={{ width: "100%" }}
          grid={{ gutter: 16, column: 2 }}
          dataSource={posts}
          loading={loading}
          renderItem={(item) => (
            <List.Item>
              <Card
                hoverable
                cover={
                  <img
                    alt={item.title}
                    src={item.thumbnail}
                    style={{
                      height: 120,
                      objectFit: "cover",
                    }}
                  />
                }
              >
                <Title level={4}>{item.title}</Title>
                <Text ellipsis={true}>{item.description}</Text>
              </Card>
            </List.Item>
          )}
        />
      )}
    </>
  );
};

export default PostList;

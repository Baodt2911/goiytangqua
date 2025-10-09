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
import { getCloudinaryUrl } from "../../utils/image";
import { useNavigate } from "react-router-dom";

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
interface PostListProps {
  searchKeyword?: string;
  filters?: Record<string, string | string[]>;
  isSearching?: boolean;
}

const PostList: React.FC<PostListProps> = ({
  searchKeyword,
  filters,
  isSearching,
}) => {
  const { posts, loading } = useAppSelector((state: RootState) => state.post);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        dispatch(getPostsStart());

        // Build search parameters
        const searchParams: any = {
          pageSize: 6,
        };

        if (searchKeyword) {
          searchParams.search = searchKeyword;
        }
        if (filters) {
          searchParams.filters = filters;
        }

        const { posts } = await getAllPostAsync(searchParams);
        dispatch(getPostsSuccess(posts));
      } catch (error: any) {
        console.log(error);
        dispatch(getPostsFailure(error.message));
      }
    };
    fetchPosts();
  }, [searchKeyword, filters, isSearching, dispatch]);

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
          locale={{
            emptyText: "Không có bài viết nào liên quan đến tìm kiếm của bạn.",
          }}
          renderItem={(item) => (
            <List.Item>
              <Card
                onClick={() => {
                  navigate(`/article/${item.slug}`);
                }}
                hoverable
                cover={
                  <img
                    alt={item.title}
                    src={getCloudinaryUrl(item.thumbnail)}
                    style={{
                      height: 200,
                      objectFit: "cover",
                    }}
                  />
                }
              >
                <Title ellipsis={true} level={4}>
                  {item.title}
                </Title>
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
